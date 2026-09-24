import asyncio
from datetime import UTC, datetime
from decimal import Decimal
from typing import Any

import pytest

from quota_link.cache import BalanceCache
from quota_link.models import (
    BalanceItem,
    BalanceItemKind,
    BalanceSnapshot,
    ProviderErrorCategory,
    ProviderType,
    QueryRequest,
    QueryRequestKind,
    SnapshotStatus,
)
from quota_link.providers.base import AsyncProviderClient
from quota_link.service import QueryService
from quota_link.settings import load_settings


class FakeClient:
    async def request(self, method: str, url: str, **kwargs: Any) -> Any:
        raise AssertionError("service test adapter does not issue HTTP requests")


def make_settings(
    *,
    max_concurrency: int = 4,
    total_timeout_seconds: float = 30,
    providers: list[dict[str, Any]] | None = None,
):
    return load_settings(
        {
            "max_concurrency": max_concurrency,
            "total_timeout_seconds": total_timeout_seconds,
            "providers": providers
            if providers is not None
            else [
                {
                    "id": "first",
                    "type": "deepseek",
                    "display_name": "First",
                    "auth": {"api_key": "secret-one"},
                },
                {
                    "id": "second",
                    "type": "alibaba_bailian",
                    "display_name": "Second",
                    "auth": {
                        "access_key_id": "test-access-key-id",
                        "access_key_secret": "secret-two",
                    },
                },
            ],
        }
    )


def success(account: Any) -> BalanceSnapshot:
    return BalanceSnapshot(
        account_id=account.id,
        provider_type=account.provider_type,
        display_name=account.display_name,
        status=SnapshotStatus.AVAILABLE,
        balances=(
            BalanceItem(
                BalanceItemKind.QUOTA,
                remaining=Decimal("12.5"),
                unit="credits",
            ),
        ),
        source="injected adapter",
        fetched_at=datetime.now(UTC),
    )


class RecordingAdapter:
    def __init__(self, delay: float = 0, fail: bool = False) -> None:
        self.delay = delay
        self.fail = fail
        self.calls: list[str] = []
        self.active = 0
        self.max_active = 0
        self.cancelled = False
        self.started = asyncio.Event()
        self.cancel_seen = asyncio.Event()

    async def fetch_balance(self, account: Any, client: AsyncProviderClient):
        self.calls.append(account.id)
        self.started.set()
        self.active += 1
        self.max_active = max(self.active, self.max_active)
        try:
            if self.delay:
                await asyncio.sleep(self.delay)
            if self.fail:
                raise RuntimeError("secret response and credentials must not leak")
            return success(account)
        except asyncio.CancelledError:
            self.cancelled = True
            self.cancel_seen.set()
            raise
        finally:
            self.active -= 1


class CancellationIgnoringAdapter:
    def __init__(self, cleanup_delay: float) -> None:
        self.cleanup_delay = cleanup_delay
        self.started = asyncio.Event()
        self.cancel_seen = asyncio.Event()
        self.finished = asyncio.Event()

    async def fetch_balance(self, account: Any, client: AsyncProviderClient):
        self.started.set()
        try:
            await asyncio.sleep(60)
        except asyncio.CancelledError:
            self.cancel_seen.set()
            await asyncio.sleep(self.cleanup_delay)
        self.finished.set()
        return success(account)


def test_queries_return_configuration_order_and_cache_success() -> None:
    async def run() -> None:
        settings = make_settings()
        adapter = RecordingAdapter()
        cache = BalanceCache()
        service = QueryService(
            settings,
            {ProviderType.DEEPSEEK: adapter, ProviderType.ALIBABA_BAILIAN: adapter},
            FakeClient(),
            cache,
        )
        request = QueryRequest(QueryRequestKind.ALL)

        first = await service.query(request)
        second = await service.query(request)

        assert [item.account_id for item in first.snapshots] == ["first", "second"]
        assert [item.account_id for item in second.snapshots] == ["first", "second"]
        assert all(item.cached for item in second.snapshots)
        assert adapter.calls == ["first", "second"]
        await service.close()
        assert cache.get("first", settings.accounts[0].config_fingerprint, 60) is None

    asyncio.run(run())


def test_account_query_does_not_call_other_provider_adapter() -> None:
    async def run() -> None:
        settings = make_settings()
        ds = RecordingAdapter()
        alibaba = RecordingAdapter()
        service = QueryService(
            settings,
            {
                ProviderType.DEEPSEEK: ds,
                ProviderType.ALIBABA_BAILIAN: alibaba,
            },
            FakeClient(),
            BalanceCache(),
        )

        result = await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "first"))

        assert [snapshot.account_id for snapshot in result.snapshots] == ["first"]
        assert ds.calls == ["first"]
        assert alibaba.calls == []
        await service.close()

    asyncio.run(run())


def test_unqueryable_account_returns_configuration_error_without_adapter_call() -> None:
    async def run() -> None:
        settings = make_settings(
            providers=[
                {
                    "id": "broken",
                    "type": "deepseek",
                    "display_name": "Broken",
                    "auth": {},
                }
            ]
        )
        adapter = RecordingAdapter()
        service = QueryService(
            settings,
            {ProviderType.DEEPSEEK: adapter},
            FakeClient(),
            BalanceCache(),
        )

        result = await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "broken"))

        assert result.snapshots[0].error.category is ProviderErrorCategory.CONFIGURATION
        assert adapter.calls == []
        await service.close()

    asyncio.run(run())


def test_empty_adapter_registry_is_explicitly_not_implemented() -> None:
    async def run() -> None:
        service = QueryService(make_settings(), {}, FakeClient(), BalanceCache())

        result = await service.query(QueryRequest(QueryRequestKind.ALL))

        assert all(
            snapshot.error.category is ProviderErrorCategory.NOT_IMPLEMENTED
            for snapshot in result.snapshots
        )
        assert all(snapshot.balances == () for snapshot in result.snapshots)
        await service.close()

    asyncio.run(run())


def test_failed_queries_do_not_replace_a_cached_success() -> None:
    async def run() -> None:
        settings = make_settings(
            providers=[
                {
                    "id": "first",
                    "type": "deepseek",
                    "display_name": "First",
                    "auth": {"api_key": "secret"},
                }
            ]
        )
        account = settings.accounts[0]
        cache = BalanceCache()
        original = success(account)
        cache.put(account.id, account.config_fingerprint, original)
        adapter = RecordingAdapter(fail=True)
        service = QueryService(
            settings, {ProviderType.DEEPSEEK: adapter}, FakeClient(), cache
        )

        result = await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "first"))

        assert result.snapshots[0].cached is True
        assert result.snapshots[0].balances == original.balances
        assert "secret" not in repr(result)
        await service.close()

    asyncio.run(run())


def test_concurrency_is_bounded() -> None:
    async def run() -> None:
        providers = [
            {
                "id": f"account-{index}",
                "type": "deepseek",
                "display_name": f"Account {index}",
                "auth": {"api_key": f"secret-{index}"},
            }
            for index in range(5)
        ]
        settings = make_settings(max_concurrency=2, providers=providers)
        adapter = RecordingAdapter(delay=0.01)
        service = QueryService(
            settings, {ProviderType.DEEPSEEK: adapter}, FakeClient(), BalanceCache()
        )

        await service.query(QueryRequest(QueryRequestKind.ALL))

        assert adapter.max_active == 2
        await service.close()

    asyncio.run(run())


def test_account_and_total_timeouts_return_partial_safe_results() -> None:
    async def run() -> None:
        settings = make_settings(
            max_concurrency=1,
            total_timeout_seconds=0.03,
            providers=[
                {
                    "id": "slow",
                    "type": "deepseek",
                    "display_name": "Slow",
                    "auth": {"api_key": "secret-one"},
                    "timeout_seconds": 0.01,
                },
                {
                    "id": "queued",
                    "type": "deepseek",
                    "display_name": "Queued",
                    "auth": {"api_key": "secret-two"},
                    "timeout_seconds": 1,
                },
            ],
        )
        adapter = RecordingAdapter(delay=0.2)
        service = QueryService(
            settings, {ProviderType.DEEPSEEK: adapter}, FakeClient(), BalanceCache()
        )

        result = await service.query(QueryRequest(QueryRequestKind.ALL))

        assert [snapshot.account_id for snapshot in result.snapshots] == [
            "slow",
            "queued",
        ]
        assert (
            result.snapshots[0].error.category
            is ProviderErrorCategory.TEMPORARILY_UNAVAILABLE
        )
        assert (
            result.snapshots[1].error.category
            is ProviderErrorCategory.TEMPORARILY_UNAVAILABLE
        )
        assert adapter.cancelled is True
        await service.close()

    asyncio.run(run())


def test_total_timeout_does_not_wait_for_adapter_that_suppresses_cancel() -> None:
    async def run() -> None:
        settings = make_settings(
            total_timeout_seconds=0.02,
            providers=[
                {
                    "id": "slow",
                    "type": "deepseek",
                    "display_name": "Slow",
                    "auth": {"api_key": "secret"},
                    "timeout_seconds": 2,
                }
            ],
        )
        adapter = CancellationIgnoringAdapter(cleanup_delay=0.15)
        service = QueryService(
            settings,
            {ProviderType.DEEPSEEK: adapter},
            FakeClient(),
            BalanceCache(),
        )
        started_at = asyncio.get_running_loop().time()

        result = await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "slow"))

        elapsed = asyncio.get_running_loop().time() - started_at
        assert elapsed < 0.1
        assert (
            result.snapshots[0].error.category
            is ProviderErrorCategory.TEMPORARILY_UNAVAILABLE
        )
        await asyncio.wait_for(adapter.cancel_seen.wait(), timeout=0.1)
        assert not adapter.finished.is_set()
        await service.close()
        await asyncio.wait_for(adapter.finished.wait(), timeout=0.2)

    asyncio.run(run())


def test_account_timeout_does_not_accept_late_success_after_suppressed_cancel() -> None:
    async def run() -> None:
        settings = make_settings(
            total_timeout_seconds=1,
            providers=[
                {
                    "id": "slow",
                    "type": "deepseek",
                    "display_name": "Slow",
                    "auth": {"api_key": "secret"},
                    "timeout_seconds": 0.02,
                }
            ],
        )
        adapter = CancellationIgnoringAdapter(cleanup_delay=0.08)
        service = QueryService(
            settings,
            {ProviderType.DEEPSEEK: adapter},
            FakeClient(),
            BalanceCache(),
        )
        started_at = asyncio.get_running_loop().time()

        result = await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "slow"))

        elapsed = asyncio.get_running_loop().time() - started_at
        assert elapsed < 0.1
        assert (
            result.snapshots[0].error.category
            is ProviderErrorCategory.TEMPORARILY_UNAVAILABLE
        )
        await asyncio.wait_for(adapter.cancel_seen.wait(), timeout=0.1)
        await asyncio.wait_for(adapter.finished.wait(), timeout=0.2)
        await service.close()

    asyncio.run(run())


def test_caller_cancellation_propagates_and_cancels_account_work() -> None:
    async def run() -> None:
        settings = make_settings()
        adapter = RecordingAdapter(delay=2)
        service = QueryService(
            settings,
            {ProviderType.DEEPSEEK: adapter, ProviderType.ALIBABA_BAILIAN: adapter},
            FakeClient(),
            BalanceCache(),
        )
        query = asyncio.create_task(service.query(QueryRequest(QueryRequestKind.ALL)))
        await asyncio.wait_for(adapter.started.wait(), timeout=1)
        query.cancel()

        with pytest.raises(asyncio.CancelledError):
            await query
        await asyncio.wait_for(adapter.cancel_seen.wait(), timeout=0.1)
        assert adapter.cancelled is True
        await service.close()

    asyncio.run(run())


def test_close_cancels_inflight_work_and_clears_cache() -> None:
    async def run() -> None:
        settings = make_settings()
        adapter = RecordingAdapter(delay=2)
        cache = BalanceCache()
        cache.put("stale", "fingerprint", success(settings.accounts[0]))
        service = QueryService(
            settings,
            {ProviderType.DEEPSEEK: adapter, ProviderType.ALIBABA_BAILIAN: adapter},
            FakeClient(),
            cache,
        )
        query = asyncio.create_task(service.query(QueryRequest(QueryRequestKind.ALL)))
        await asyncio.wait_for(adapter.started.wait(), timeout=1)

        await service.close()

        assert adapter.cancelled is True
        assert cache.get("stale", "fingerprint", 60) is None
        query.cancel()
        await asyncio.gather(query, return_exceptions=True)

    asyncio.run(run())
