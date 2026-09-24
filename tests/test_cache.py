from datetime import UTC, datetime

from quota_link.cache import BalanceCache
from quota_link.models import (
    BalanceSnapshot,
    NormalizedProviderError,
    ProviderErrorCategory,
    ProviderType,
    SnapshotStatus,
)


def snapshot(
    status: SnapshotStatus = SnapshotStatus.AVAILABLE,
    error: NormalizedProviderError | None = None,
) -> BalanceSnapshot:
    return BalanceSnapshot(
        account_id="main",
        provider_type=ProviderType.DEEPSEEK,
        display_name="Main",
        status=status,
        balances=(),
        source="test",
        fetched_at=datetime.now(UTC),
        error=error,
    )


def test_cache_ttl_fingerprint_and_snapshot_immutability() -> None:
    now = [10.0]
    cache = BalanceCache(lambda: now[0])
    original = snapshot()

    cache.put("main", "fingerprint-a", original)
    cached = cache.get("main", "fingerprint-a", 5)

    assert cached is not original
    assert cached is not None and cached.cached is True
    assert original.cached is False
    assert cache.get("main", "fingerprint-b", 5) is None
    now[0] = 15.0
    assert cache.get("main", "fingerprint-a", 5) is None


def test_cache_does_not_store_failed_or_non_success_snapshots() -> None:
    cache = BalanceCache(lambda: 0.0)
    failed = snapshot(
        SnapshotStatus.UNAVAILABLE,
        NormalizedProviderError(ProviderErrorCategory.ENDPOINT, "failed"),
    )
    cache.put("main", "fingerprint", failed)
    cache.put("main", "fingerprint", snapshot(SnapshotStatus.UNKNOWN))

    assert cache.get("main", "fingerprint", 10) is None


def test_cache_clear_removes_entries_and_nonpositive_ttl_expires_immediately() -> None:
    cache = BalanceCache(lambda: 0.0)
    cache.put("main", "fingerprint", snapshot())

    assert cache.get("main", "fingerprint", 0) is None
    cache.put("main", "fingerprint", snapshot())
    cache.clear()
    assert cache.get("main", "fingerprint", 10) is None
