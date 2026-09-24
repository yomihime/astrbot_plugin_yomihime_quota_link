"""In-memory cache for successful immutable balance snapshots."""

from __future__ import annotations

import time
from dataclasses import replace
from typing import Callable

from .models import BalanceSnapshot, SnapshotStatus


class BalanceCache:
    """Cache successful snapshots by account and non-secret config fingerprint."""

    def __init__(self, monotonic: Callable[[], float] = time.monotonic) -> None:
        self._monotonic = monotonic
        self._entries: dict[tuple[str, str], tuple[float, BalanceSnapshot]] = {}

    def get(
        self, account_id: str, config_fingerprint: str, ttl_seconds: float
    ) -> BalanceSnapshot | None:
        key = (account_id, config_fingerprint)
        entry = self._entries.get(key)
        if entry is None:
            return None
        inserted_at, snapshot = entry
        if ttl_seconds <= 0 or self._monotonic() - inserted_at >= ttl_seconds:
            self._entries.pop(key, None)
            return None
        return replace(snapshot, cached=True)

    def put(
        self,
        account_id: str,
        config_fingerprint: str,
        snapshot: BalanceSnapshot,
    ) -> None:
        if snapshot.error is not None or snapshot.status not in (
            SnapshotStatus.AVAILABLE,
            SnapshotStatus.PARTIAL,
        ):
            return
        self._entries[(account_id, config_fingerprint)] = (
            self._monotonic(),
            snapshot,
        )

    def clear(self) -> None:
        self._entries.clear()
