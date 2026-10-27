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


def test_provider_budget_honors_retry_after_across_distinct_credentials():
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
                        ProviderErrorCategory.RATE_LIMITED, "限流", "http_429", 300
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
        await service.query(REQUEST)
        other = QueryRequest(QueryRequestKind.ACCOUNT, "second")
        blocked = (await service.query(other)).snapshots[0]
        assert blocked.error.retry_after_seconds == 300 and calls == ["first"]
        service.retry_account("second")  # Explicit retry cannot bypass rate budgets.
        clock.advance(299)
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
        await service.query(REQUEST)
        first = (await service.query(REQUEST)).snapshots[0]
        assert first.error.retry_after_seconds == pytest.approx(2.2)
        clock.advance(2.2)
        await service.query(REQUEST)
        second = (await service.query(REQUEST)).snapshots[0]
        assert second.error.retry_after_seconds == pytest.approx(4.4)
        assert len(adapter.calls) == 2
        assert "secret" not in repr(first)
        await service.close()

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
