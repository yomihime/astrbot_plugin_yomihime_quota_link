"""No-network query/alert sharing and provider-budget regression coverage."""

import asyncio
from dataclasses import replace
from datetime import UTC, datetime, timedelta
from decimal import Decimal

import httpx
import pytest
from test_service import FakeClient, RecordingAdapter, make_settings, success

from quota_link.cache import BalanceCache
from quota_link.http_client import HttpProviderClient, HttpStatusError
from quota_link.models import (
    BalanceItem,
    BalanceItemKind,
    NormalizedProviderError,
    ProviderErrorCategory,
    ProviderType,
    QueryRequest,
    QueryRequestKind,
    SnapshotStatus,
)
from quota_link.providers import IMPLEMENTED_ADAPTERS
from quota_link.service import QueryService


class Clock:
    value = 1000.0
    now = datetime(2026, 10, 27, tzinfo=UTC)

    def monotonic(self):
        return self.value

    def wall(self):
        return self.now

    def advance(self, seconds):
        self.value += seconds
        self.now += timedelta(seconds=seconds)


class GateAdapter:
    def __init__(self):
        self.entered = asyncio.Event()
        self.release = asyncio.Event()
        self.cancelled = asyncio.Event()
        self.calls = 0

    async def fetch_balance(self, account, client):
        self.calls += 1
        self.entered.set()
        try:
            await self.release.wait()
        except asyncio.CancelledError:
            self.cancelled.set()
            raise
        return success(account)


def one_account():
    return make_settings(
        providers=[
            {
                "id": "first",
                "type": "deepseek",
                "display_name": "First",
                "auth": {"api_key": "synthetic-key"},
            }
        ]
    )


REQUEST = QueryRequest(QueryRequestKind.ACCOUNT, "first")


def test_manual_and_scheduler_share_one_inflight_fetch():
    async def run():
        adapter = GateAdapter()
        service = QueryService(
            one_account(),
            {ProviderType.DEEPSEEK: adapter},
            FakeClient(),
            BalanceCache(),
        )
        manual = asyncio.create_task(service.query(REQUEST))
        await adapter.entered.wait()
        scheduled = asyncio.create_task(service.query(REQUEST, max_age_seconds=60))
        await asyncio.sleep(0)
        adapter.release.set()
        first, second = await asyncio.gather(manual, scheduled)
        assert adapter.calls == 1
        assert first.snapshots == second.snapshots
        await service.close()

    asyncio.run(run())


def test_cancelled_subscriber_does_not_cancel_other_subscriber():
    async def run():
        adapter = GateAdapter()
        service = QueryService(
            one_account(),
            {ProviderType.DEEPSEEK: adapter},
            FakeClient(),
            BalanceCache(),
        )
        first = asyncio.create_task(service.query(REQUEST))
        await adapter.entered.wait()
        second = asyncio.create_task(service.query(REQUEST))
        # Flush both subscriber creation levels without any wall-clock sleep.
        await asyncio.sleep(0)
        await asyncio.sleep(0)
        first.cancel()
        await asyncio.gather(first, return_exceptions=True)
        await asyncio.sleep(0)
        assert not adapter.cancelled.is_set()
        adapter.release.set()
        assert (await second).snapshots[0].error is None
        assert adapter.calls == 1
        await service.close()

    asyncio.run(run())


def test_final_subscriber_cancel_revokes_underlying_fetch():
    async def run():
        adapter = GateAdapter()
        service = QueryService(
            one_account(),
            {ProviderType.DEEPSEEK: adapter},
            FakeClient(),
            BalanceCache(),
        )
        task = asyncio.create_task(service.query(REQUEST))
        await adapter.entered.wait()
        task.cancel()
        await asyncio.gather(task, return_exceptions=True)
        await adapter.cancelled.wait()
        assert not service._inflight
        await service.close()

    asyncio.run(run())


def test_cached_unavailable_with_real_zero_remains_factual_success():
    async def run():
        settings = one_account()
        clock = Clock()
        cache = BalanceCache(clock.monotonic)
        snapshot = replace(
            success(settings.accounts[0]),
            status=SnapshotStatus.UNAVAILABLE,
            fetched_at=clock.now,
            balances=(
                BalanceItem(
                    BalanceItemKind.CASH,
                    amount=Decimal("0"),
                    unit="CNY",
                    metric="total_balance",
                ),
            ),
        )
        cache.put("first", settings.accounts[0].config_fingerprint, snapshot)
        adapter = RecordingAdapter()
        service = QueryService(
            settings,
            {ProviderType.DEEPSEEK: adapter},
            FakeClient(),
            cache,
            monotonic=clock.monotonic,
            wall_clock=clock.wall,
        )
        result = (await service.query(REQUEST, max_age_seconds=60)).snapshots[0]
        assert (
            result.cached
            and result.error is None
            and result.status is SnapshotStatus.UNAVAILABLE
        )
        assert result.balances[0].amount == 0
        assert not adapter.calls
        await service.close()

    asyncio.run(run())


def test_old_fetched_at_is_not_renewed_by_cache_insertion_time():
    async def run():
        settings = one_account()
        clock = Clock()
        cache = BalanceCache(clock.monotonic)
        cache.put(
            "first",
            settings.accounts[0].config_fingerprint,
            replace(
                success(settings.accounts[0]),
                fetched_at=clock.now - timedelta(seconds=61),
            ),
        )
        adapter = RecordingAdapter()
        service = QueryService(
            settings,
            {ProviderType.DEEPSEEK: adapter},
            FakeClient(),
            cache,
            monotonic=clock.monotonic,
            wall_clock=clock.wall,
        )
        result = (await service.query(REQUEST, max_age_seconds=60)).snapshots[0]
        assert not result.cached and adapter.calls == ["first"]
        await service.close()

    asyncio.run(run())


@pytest.mark.parametrize(
    "category,code,delay",
    [
        (ProviderErrorCategory.RATE_LIMITED, "business_throttled", None),
        (ProviderErrorCategory.RATE_LIMITED, "http_429", 300),
        (ProviderErrorCategory.TEMPORARILY_UNAVAILABLE, "http_503", 7200),
    ],
)
def test_provider_budget_honors_retry_after_across_distinct_credentials(
    category, code, delay
):
    async def run():
        settings = make_settings(
            providers=[
                {
                    "id": name,
                    "type": "deepseek",
                    "display_name": name,
                    "auth": {"api_key": f"fake-{name}"},
                }
                for name in ("first", "second")
            ]
        )
        clock = Clock()
        calls = []

        class Limited:
            async def fetch_balance(self, account, client):
                calls.append(account.id)
                return replace(
                    success(account),
                    error=NormalizedProviderError(
                        category, "供应商要求等待", code, delay
                    ),
                )

        service = QueryService(
            settings,
            {ProviderType.DEEPSEEK: Limited()},
            FakeClient(),
            BalanceCache(),
            monotonic=clock.monotonic,
            wall_clock=clock.wall,
            jitter=lambda: 0,
        )
        other = QueryRequest(QueryRequestKind.ACCOUNT, "second")
        first, second = await asyncio.gather(
            service.query(REQUEST), service.query(other)
        )
        assert first.snapshots[0].error.diagnostic_code == code
        blocked = second.snapshots[0]
        assert blocked.error.category is category
        assert blocked.error.diagnostic_code == "provider_cooldown"
        wait = delay if delay is not None else 60
        assert blocked.error.retry_after_seconds == wait and calls == ["first"]
        service.retry_account("second")  # Explicit retry cannot bypass rate budgets.
        clock.advance(wait - 1)
        assert (await service.query(other)).snapshots[0].error.retry_after_seconds == 1
        clock.advance(1)
        await service.query(other)
        assert calls == ["first", "second"]
        await service.close()

    asyncio.run(run())


@pytest.mark.parametrize(
    "category", [ProviderErrorCategory.AUTHENTICATION, ProviderErrorCategory.PERMISSION]
)
def test_authentication_pause_requires_config_change_or_explicit_retry(category):
    async def run():
        clock = Clock()
        calls = []

        class Denied:
            async def fetch_balance(self, account, client):
                calls.append(account.id)
                return replace(
                    success(account),
                    balances=(),
                    error=NormalizedProviderError(category, "认证失败"),
                )

        service = QueryService(
            one_account(),
            {ProviderType.DEEPSEEK: Denied()},
            FakeClient(),
            BalanceCache(),
            monotonic=clock.monotonic,
            wall_clock=clock.wall,
        )
        await service.query(REQUEST)
        clock.advance(86400)
        await service.query(REQUEST)
        assert calls == ["first"]
        assert not service.retry_account("absent")
        assert service.retry_account("first")
        assert calls == ["first"]  # Method itself never sends.
        await service.query(REQUEST)
        assert calls == ["first", "first"]
        await service.close()

    asyncio.run(run())


def test_exponential_budget_uses_injected_clock_and_jitter():
    async def run():
        clock = Clock()
        adapter = RecordingAdapter(fail=True)
        service = QueryService(
            one_account(),
            {ProviderType.DEEPSEEK: adapter},
            FakeClient(),
            BalanceCache(),
            monotonic=clock.monotonic,
            wall_clock=clock.wall,
            jitter=lambda: 0.5,
        )
        for attempt in range(1, 14):
            await service.query(REQUEST)
            blocked = (await service.query(REQUEST)).snapshots[0]
            delay = min(2**attempt * 1.1, 3600)
            assert blocked.error.retry_after_seconds == pytest.approx(delay)
            assert len(adapter.calls) == attempt
            assert "secret" not in repr(blocked)
            clock.advance(delay + 0.01)
        await service.close()

    asyncio.run(run())


@pytest.mark.parametrize("early_timeout", [False, True])
def test_connection_keeps_account_deadline_and_retries_early_timeout(early_timeout):
    async def run():
        settings = replace(one_account(), total_timeout_seconds=2)
        account = replace(settings.accounts[0], timeout_seconds=0.4)
        settings = replace(settings, accounts=(account,))
        calls = []

        async def connect(request):
            calls.append(request.extensions["timeout"])
            if len(calls) == 1:
                if early_timeout:
                    raise httpx.ConnectTimeout(
                        "synthetic proxy handshake", request=request
                    )
                assert calls[0]["connect"] > 0.25  # A healthy but slow connection.
                await asyncio.sleep(0.25)
            return httpx.Response(
                200,
                json={
                    "is_available": True,
                    "balance_infos": [
                        {
                            "currency": "CNY",
                            "total_balance": "10",
                            "granted_balance": "0",
                            "topped_up_balance": "10",
                        }
                    ],
                },
            )

        client = HttpProviderClient(
            client=httpx.AsyncClient(transport=httpx.MockTransport(connect)),
            retry_delay=0.01,
            jitter=lambda: 0,
        )
        service = QueryService(settings, IMPLEMENTED_ADAPTERS, client, BalanceCache())
        try:
            snapshot = (await service.query(REQUEST)).snapshots[0]
            assert snapshot.error is None
            assert snapshot.balances[0].amount == 10
            assert len(calls) == (2 if early_timeout else 1)
            assert all(
                timeouts["connect"] == timeouts["read"] == 0.4 for timeouts in calls
            )
        finally:
            await service.close()
            await client.close()

    asyncio.run(run())


def test_account_timeout_isolated_and_blocked_queries_do_not_extend_cooldown():
    async def run():
        providers = [
            {
                "id": name,
                "type": provider.value,
                "display_name": name,
                "auth": auth,
            }
            for name, provider, auth in (
                ("first", ProviderType.DEEPSEEK, {"api_key": "synthetic-key"}),
                ("second", ProviderType.DEEPSEEK, {"api_key": "synthetic-other"}),
                ("third", ProviderType.MEINIANDA, {"api_key": "synthetic-key"}),
            )
        ]
        settings = make_settings(providers=providers)
        first, *other = settings.accounts
        settings = replace(
            settings, accounts=(replace(first, timeout_seconds=0.05), *other)
        )
        clock = Clock()
        calls = []
        failing = True

        class Adapter:
            async def fetch_balance(self, account, client):
                calls.append(account.id)
                if account.id == "first" and failing:
                    await asyncio.Event().wait()
                return replace(success(account), fetched_at=clock.now)

        adapter = Adapter()
        service = QueryService(
            settings,
            {ProviderType.DEEPSEEK: adapter, ProviderType.MEINIANDA: adapter},
            FakeClient(),
            BalanceCache(clock.monotonic),
            monotonic=clock.monotonic,
            wall_clock=clock.wall,
            jitter=lambda: 0,
        )

        async def query(name):
            request = QueryRequest(QueryRequestKind.ACCOUNT, name)
            return (await service.query(request, max_age_seconds=0)).snapshots[0]

        try:
            first_failure = await query("first")
            assert "超过时限" in first_failure.error.safe_message
            assert not first_failure.balances
            for name in ("second", "third"):
                assert (await query(name)).error is None
            assert first_failure.error.diagnostic_code == "account_timeout"

            for elapsed, remaining in ((0, 2), (0.5, 1.5), (1, 0.5)):
                clock.advance(elapsed)
                blocked = await query("first")
                assert blocked.error.diagnostic_code == "account_cooldown"
                assert blocked.error.retry_after_seconds == remaining
                assert "冷却" in blocked.error.safe_message
                assert "超过时限" not in blocked.error.safe_message
            assert calls == ["first", "second", "third"]

            clock.advance(0.5)
            assert (await query("first")).error.diagnostic_code == "account_timeout"
            assert (await query("first")).error.retry_after_seconds == 4
            clock.advance(4)
            failing = False
            assert (await query("first")).error is None
            clock.advance(1)
            failing = True
            assert (await query("first")).error.diagnostic_code == "account_timeout"
            assert (await query("first")).error.retry_after_seconds == 2
            assert calls == ["first", "second", "third", "first", "first", "first"]
        finally:
            await service.close()

    asyncio.run(run())


def test_queue_timeout_does_not_start_an_account_cooldown():
    async def run():
        settings = make_settings(max_concurrency=1)
        first, second = settings.accounts
        settings = replace(
            settings, accounts=(first, replace(second, timeout_seconds=0.05))
        )
        gate = GateAdapter()
        other = RecordingAdapter()
        service = QueryService(
            settings,
            {ProviderType.DEEPSEEK: gate, ProviderType.ALIBABA_BAILIAN: other},
            FakeClient(),
            BalanceCache(),
        )
        queued = QueryRequest(QueryRequestKind.ACCOUNT, "second")
        running = asyncio.create_task(service.query(REQUEST))
        try:
            await gate.entered.wait()
            snapshot = (await service.query(queued)).snapshots[0]
            assert snapshot.error.diagnostic_code == "queue_timeout"
            assert not other.calls
            gate.release.set()
            assert (await running).snapshots[0].error is None
            assert (await service.query(queued)).snapshots[0].error is None
            assert other.calls == ["second"]
        finally:
            gate.release.set()
            await service.close()
            await asyncio.gather(running, return_exceptions=True)

    asyncio.run(run())


@pytest.mark.parametrize("status", [429, 503])
@pytest.mark.parametrize(
    "header,expected",
    [
        ("300", 300),
        ("Tue, 27 Oct 2026 00:05:00 GMT", 300),
        ("-10", None),
        ("NaN", None),
        ("１２３", None),
        ("invalid", None),
    ],
)
def test_retry_after_is_safe_and_preserved(status, header, expected):
    async def run():
        calls, sleeps = [], []

        async def sleep(seconds):
            sleeps.append(seconds)

        def handler(request):
            calls.append(request)
            return httpx.Response(
                status,
                headers={b"Retry-After": header.encode("utf-8")},
                json={"secret": "do-not-log"},
            )

        client = HttpProviderClient(
            client=httpx.AsyncClient(transport=httpx.MockTransport(handler)),
            sleep=sleep,
            jitter=lambda: 0.5,
            wall_clock=lambda: datetime(2026, 10, 27, tzinfo=UTC).timestamp(),
        )
        with pytest.raises(HttpStatusError) as caught:
            await client.request("GET", "https://provider.invalid/?api_key=fake-secret")
        assert caught.value.retry_after_seconds == expected
        assert "secret" not in repr(caught.value)
        if status == 429 or expected is not None:
            assert len(calls) == 1 and not sleeps
        else:
            assert len(calls) == 2 and sleeps == [1.1]
        await client.close()

    asyncio.run(run())


@pytest.mark.parametrize("value", [-1, float("nan"), float("inf"), True, "60"])
def test_invalid_freshness_budget_is_rejected_before_network(value):
    async def run():
        adapter = RecordingAdapter()
        service = QueryService(
            one_account(),
            {ProviderType.DEEPSEEK: adapter},
            FakeClient(),
            BalanceCache(),
        )
        with pytest.raises(ValueError):
            await service.query(REQUEST, max_age_seconds=value)
        assert not adapter.calls
        await service.close()

    asyncio.run(run())


def test_identical_credentials_share_auth_pause_without_guessing_other_accounts():
    async def run():
        settings = make_settings(
            providers=[
                {
                    "id": name,
                    "type": "deepseek",
                    "display_name": name,
                    "auth": {
                        "api_key": "synthetic-shared"
                        if name != "other"
                        else "synthetic-different"
                    },
                }
                for name in ("first", "alias", "other")
            ]
        )
        calls = []

        class Adapter:
            async def fetch_balance(self, account, client):
                calls.append(account.id)
                if account.id == "other":
                    return success(account)
                return replace(
                    success(account),
                    balances=(),
                    error=NormalizedProviderError(
                        ProviderErrorCategory.AUTHENTICATION, "认证失败"
                    ),
                )

        service = QueryService(
            settings, {ProviderType.DEEPSEEK: Adapter()}, FakeClient(), BalanceCache()
        )
        await service.query(REQUEST)
        alias = (
            await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "alias"))
        ).snapshots[0]
        assert "已暂停" in alias.error.safe_message
        assert (
            await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "other"))
        ).snapshots[0].error is None
        assert calls == ["first", "other"]
        await service.close()

    asyncio.run(run())


def test_close_during_retry_sleep_never_sends_late_request():
    async def run():
        waiting, release = asyncio.Event(), asyncio.Event()
        calls = []

        async def sleep(seconds):
            waiting.set()
            await release.wait()

        def handler(request):
            calls.append(request)
            return httpx.Response(500, json={})

        client = HttpProviderClient(
            client=httpx.AsyncClient(transport=httpx.MockTransport(handler)),
            sleep=sleep,
        )
        request = asyncio.create_task(client.request("GET", "https://provider.invalid"))
        await waiting.wait()
        await client.close()
        release.set()
        with pytest.raises(Exception) as caught:
            await request
        assert getattr(caught.value, "kind", None) == "closed"
        assert len(calls) == 1

    asyncio.run(run())
