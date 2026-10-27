"""Cache inspection and observers do not turn inspection into upstream traffic."""

import asyncio
from dataclasses import replace
from datetime import timedelta

import pytest
from test_alert_query_transport import Clock, one_account
from test_service import FakeClient, RecordingAdapter, success

from quota_link.cache import BalanceCache
from quota_link.models import (
    NormalizedProviderError,
    ProviderErrorCategory,
    ProviderType,
    QueryRequest,
    QueryRequestKind,
    SnapshotStatus,
)
from quota_link.service import QueryService


def make_service(*, disabled=False):
    clock = Clock()
    settings = one_account()
    if disabled:
        settings = replace(
            settings, accounts=(replace(settings.accounts[0], enabled=False),)
        )
    account = settings.accounts[0]
    cache = BalanceCache(clock.monotonic)
    adapter = RecordingAdapter()
    service = QueryService(
        settings,
        {ProviderType.DEEPSEEK: adapter},
        FakeClient(),
        cache,
        monotonic=clock.monotonic,
        wall_clock=clock.wall,
    )
    snapshot = replace(success(account), fetched_at=clock.now)
    return service, cache, clock, account, adapter, snapshot


@pytest.mark.parametrize("disabled", [False, True])
@pytest.mark.parametrize(
    "status",
    [SnapshotStatus.AVAILABLE, SnapshotStatus.PARTIAL, SnapshotStatus.UNAVAILABLE],
)
def test_peek_valid_cached_facts_even_for_disabled_account_without_io_or_state_changes(
    disabled, status
):
    service, cache, clock, account, adapter, snapshot = make_service(disabled=disabled)
    cache.put(account.id, account.config_fingerprint, replace(snapshot, status=status))
    before = dict(cache._entries)
    assert service.peek_snapshot(account.id).cached
    assert service.peek_snapshot(account.id).status is status
    assert cache._entries == before
    assert not adapter.calls and not service._inflight and not service._auth_paused


@pytest.mark.parametrize("age", [-5, -4, 0, 59])
def test_peek_has_bounded_clock_skew(age):
    service, cache, clock, account, adapter, snapshot = make_service()
    cache.put(
        account.id,
        account.config_fingerprint,
        replace(snapshot, fetched_at=clock.now - timedelta(seconds=age)),
    )
    assert service.peek_snapshot(account.id) is not None
    assert not adapter.calls


@pytest.mark.parametrize("age", [-5.001, 60.001, 86400])
def test_peek_rejects_future_or_stale_even_if_recently_inserted(age):
    service, cache, clock, account, adapter, snapshot = make_service()
    cache.put(
        account.id,
        account.config_fingerprint,
        replace(snapshot, fetched_at=clock.now - timedelta(seconds=age)),
    )
    before = dict(cache._entries)
    assert service.peek_snapshot(account.id, 86400) is None
    assert cache._entries == before and not adapter.calls


def test_peek_expired_entry_is_not_evicted_and_wrong_fingerprint_never_used():
    service, cache, clock, account, adapter, snapshot = make_service()
    cache.put(account.id, account.config_fingerprint, snapshot)
    clock.advance(61)
    before = dict(cache._entries)
    assert service.peek_snapshot(account.id) is None
    assert cache._entries == before
    cache.put(account.id, "old-fingerprint", replace(snapshot, fetched_at=clock.now))
    assert service.peek_snapshot(account.id) is None
    assert service.peek_snapshot("missing") is None
    assert not adapter.calls


@pytest.mark.parametrize("value", [0, -1, True, "60", float("nan"), float("inf")])
def test_invalid_peek_budget_fails_closed(value):
    service, cache, clock, account, adapter, snapshot = make_service()
    cache.put(account.id, account.config_fingerprint, snapshot)
    assert service.peek_snapshot(account.id, value) is None
    assert not adapter.calls


@pytest.mark.parametrize(
    "change",
    [
        {"balances": ()},
        {"error": NormalizedProviderError(ProviderErrorCategory.PARSE, "invalid")},
        {"account_id": "other"},
        {"provider_type": ProviderType.GRSAI},
        {"status": SnapshotStatus.UNKNOWN},
    ],
)
def test_peek_revalidates_entry_identity_and_success(change):
    service, cache, clock, account, adapter, snapshot = make_service()
    # Corrupted/incompatible internal entry cannot escape the public peek API.
    cache._entries[(account.id, account.config_fingerprint)] = (
        clock.value,
        replace(snapshot, **change),
    )
    assert service.peek_snapshot(account.id) is None
    assert not adapter.calls


def test_snapshot_observer_notices_all_fresh_manual_values_not_cache_hits():
    async def run():
        service, cache, clock, account, adapter, snapshot = make_service()
        currencies = iter(["USD", "CNY"])

        class Values:
            async def fetch_balance(self, a, c):
                return replace(
                    snapshot,
                    balances=(replace(snapshot.balances[0], unit=next(currencies)),),
                )

        service._adapters = {ProviderType.DEEPSEEK: Values()}
        observed = []
        service.set_snapshot_observer(observed.append)
        request = QueryRequest(QueryRequestKind.ACCOUNT, account.id)
        await service.query(request, max_age_seconds=0)
        assert len(observed) == 1 and observed[0].balances[0].unit == "USD"
        await service.query(request)
        service.peek_snapshot(account.id)
        assert len(observed) == 1
        await service.query(request, max_age_seconds=0)
        assert [s.balances[0].unit for s in observed] == ["USD", "CNY"]
        await service.close()
        assert service._snapshot_observer is None
        service.set_snapshot_observer(observed.append)
        assert service._snapshot_observer is None
        assert service.peek_snapshot(account.id) is None

    asyncio.run(run())


def test_snapshot_observer_exception_never_exposes_details_or_breaks_query():
    async def run():
        service, cache, clock, account, adapter, snapshot = make_service()
        # Adapt the fixture wall clock to the adapter's live synthetic timestamp.
        service._wall_clock = lambda: success(account).fetched_at

        called = []

        def broken(snapshot):
            called.append(snapshot)
            raise RuntimeError("secret observer detail")

        service.set_snapshot_observer(broken)
        result = await service.query(QueryRequest(QueryRequestKind.ACCOUNT, account.id))
        assert result.snapshots[0].error is None and len(called) == 1
        assert "secret observer" not in repr(result)
        await service.close()

    asyncio.run(run())


@pytest.mark.parametrize(
    "change",
    [
        {"fetched_at": Clock.now - timedelta(seconds=61)},
        {"fetched_at": Clock.now + timedelta(seconds=6)},
        {"balances": ()},
        {"status": SnapshotStatus.UNKNOWN},
        {"error": NormalizedProviderError(ProviderErrorCategory.PARSE, "invalid")},
    ],
)
def test_snapshot_observer_rejects_invalid_or_stale_results(change):
    async def run():
        service, cache, clock, account, adapter, snapshot = make_service()

        class Values:
            async def fetch_balance(self, a, c):
                return replace(snapshot, **change)

        service._adapters = {ProviderType.DEEPSEEK: Values()}
        observed = []
        service.set_snapshot_observer(observed.append)
        await service.query(QueryRequest(QueryRequestKind.ACCOUNT, account.id))
        assert not observed
        await service.close()

    asyncio.run(run())


def test_extreme_integer_peek_budget_is_capped_without_float_overflow():
    service, cache, clock, account, adapter, snapshot = make_service()
    cache.put(account.id, account.config_fingerprint, snapshot)
    assert service.peek_snapshot(account.id, 10**1000) is not None
    clock.advance(61)
    assert service.peek_snapshot(account.id, 10**1000) is None
    assert not adapter.calls
