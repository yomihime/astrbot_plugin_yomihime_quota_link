"""Shared, coalesced provider queries with conservative provider-wide budgets."""

from __future__ import annotations

import asyncio
import math
import random
import time
from collections.abc import Callable
from dataclasses import replace
from datetime import UTC, datetime
from typing import Mapping

from .cache import BalanceCache
from .i18n import message as localized
from .models import (
    WALLET_GATEWAY_PROVIDERS,
    WALLET_REGION_PROVIDERS,
    BalanceSnapshot,
    NormalizedProviderError,
    ProviderErrorCategory,
    ProviderType,
    QueryRequest,
    QueryRequestKind,
    QueryResult,
    SnapshotStatus,
)
from .providers.base import AsyncProviderClient, ProviderAdapter
from .settings import AccountSettings, PluginSettings, gateway_origin

_ProviderBudget = ProviderType | tuple[str, ProviderType, str]
_CooldownKey = _ProviderBudget | tuple[str, str]


class QueryService:
    """One shared request per account; never turn failures or old cache into zero.

    Provider-wide serialization deliberately makes no claim that different keys
    belong to different upstream accounts. A failed caller does not cancel work
    still awaited by another caller; the final departing waiter cancels it.
    """

    def __init__(
        self,
        settings: PluginSettings,
        adapters: Mapping[ProviderType, ProviderAdapter],
        client: AsyncProviderClient | None,
        cache: BalanceCache,
        *,
        monotonic=time.monotonic,
        wall_clock=lambda: datetime.now(UTC),
        jitter=random.random,
    ) -> None:
        self._settings, self._adapters, self._client, self._cache = (
            settings,
            adapters,
            client,
            cache,
        )
        self._clock, self._wall_clock, self._jitter = monotonic, wall_clock, jitter
        self._semaphore = asyncio.Semaphore(settings.max_concurrency)
        self._tasks: set[asyncio.Task] = set()
        self._adapter_tasks: set[asyncio.Task] = set()
        self._inflight: dict[tuple[str, str], asyncio.Task] = {}
        self._waiters: dict[tuple[str, str], int] = {}
        self._provider_locks: dict[_ProviderBudget, asyncio.Lock] = {}
        self._cooldowns: dict[_CooldownKey, tuple[float, NormalizedProviderError]] = {}
        self._failures: dict[_CooldownKey, int] = {}
        self._auth_paused: dict[str, NormalizedProviderError] = {}
        self._closed = False
        self._auth_pause_observer: Callable[[str], None] | None = None
        self._snapshot_observer: Callable[[BalanceSnapshot], None] | None = None

    async def query(
        self, request: QueryRequest, *, max_age_seconds: float | None = None
    ) -> QueryResult:
        if max_age_seconds is not None and (
            isinstance(max_age_seconds, bool)
            or not isinstance(max_age_seconds, (int, float))
            or (
                isinstance(max_age_seconds, float)
                and not math.isfinite(max_age_seconds)
            )
            or max_age_seconds < 0
        ):
            raise ValueError("max_age_seconds must be finite and nonnegative")
        if (
            request.kind in (QueryRequestKind.HELP, QueryRequestKind.STATUS)
            or self._closed
        ):
            return self._result(request, ())
        accounts = self._select_accounts(request)
        tasks = [
            asyncio.create_task(self._query_account(a, max_age_seconds))
            for a in accounts
        ]
        self._tasks.update(tasks)
        for task in tasks:
            task.add_done_callback(self._observe_task)
        if not tasks:
            return self._result(request, ())
        try:
            done, pending = await asyncio.wait(
                tasks, timeout=self._settings.total_timeout_seconds
            )
        except asyncio.CancelledError:
            for task in tasks:
                task.cancel()
            raise
        for task in pending:
            task.cancel()
        snapshots = []
        for account, task in zip(accounts, tasks, strict=True):
            if task in done:
                try:
                    snapshots.append(task.result())
                except asyncio.CancelledError:
                    raise
                except Exception:
                    snapshots.append(
                        self._failure(
                            account,
                            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                            localized("query.unavailable"),
                        )
                    )
            else:
                snapshots.append(
                    self._failure(
                        account,
                        ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                        localized("query.total_timeout"),
                        diagnostic_code="total_timeout",
                    )
                )
        return self._result(request, tuple(snapshots))

    def peek_snapshot(
        self, account_id: str, max_age_seconds: float = 60
    ) -> BalanceSnapshot | None:
        """Read verified facts only; never query, refresh cache or touch budgets.

        Inspection has a hard sixty-second cap. Disabled accounts may still
        expose an existing matching-fingerprint manual result, never credentials.
        """
        if self._closed or (
            isinstance(max_age_seconds, bool)
            or not isinstance(max_age_seconds, (int, float))
            or (
                isinstance(max_age_seconds, float)
                and not math.isfinite(max_age_seconds)
            )
            or max_age_seconds <= 0
        ):
            return None
        account = next((a for a in self._settings.accounts if a.id == account_id), None)
        if account is None:
            return None
        age_limit = min(60.0, max_age_seconds, account.cache_ttl_seconds)
        snapshot = self._cache.peek(account.id, account.config_fingerprint, age_limit)
        if (
            snapshot is None
            or snapshot.account_id != account.id
            or snapshot.provider_type is not account.provider_type
            or not self._fresh_facts(snapshot, age_limit)
        ):
            return None
        return snapshot

    def _fresh_facts(self, snapshot: BalanceSnapshot, max_age: float = 60) -> bool:
        if (
            snapshot.error is not None
            or not snapshot.balances
            or snapshot.status
            not in (
                SnapshotStatus.AVAILABLE,
                SnapshotStatus.PARTIAL,
                SnapshotStatus.UNAVAILABLE,
            )
        ):
            return False
        age = (self._wall_clock() - snapshot.fetched_at).total_seconds()
        return -5 <= age <= max_age

    def set_snapshot_observer(
        self, observer: Callable[[BalanceSnapshot], None] | None
    ) -> None:
        """Observe new validated facts synchronously, never cache reads."""
        if observer is not None and not callable(observer):
            raise TypeError("snapshot observer must be callable or None")
        if not self._closed:
            self._snapshot_observer = observer

    def set_auth_pause_observer(self, observer: Callable[[str], None] | None) -> None:
        """Attach lifecycle-owned persistence notification without provider IO."""
        if observer is not None and not callable(observer):
            raise TypeError("auth pause observer must be callable or None")
        if not self._closed:
            self._auth_pause_observer = observer

    def restore_auth_pause(self, account_id: str) -> None:
        """Restore a validated persistent pause into the current credential gate.

        The lifecycle owner checks persistent rule identity before calling this.
        No provider request is made; even manual queries and cached snapshots
        remain blocked until an explicit retry or a new configuration runtime.
        """
        if self._closed:
            return
        account = next((a for a in self._settings.accounts if a.id == account_id), None)
        if account is not None:
            self._auth_paused[account.config_fingerprint] = NormalizedProviderError(
                ProviderErrorCategory.AUTHENTICATION,
                localized("query.authentication_paused"),
                "restored_auth_pause",
            )

    def retry_account(self, account_id: str) -> bool:
        """Explicitly clear authentication pause; never issue a network request.

        Rate-limit Retry-After is intentionally not bypassed by a user retry.
        """
        account = next((a for a in self._settings.accounts if a.id == account_id), None)
        if account is None:
            return False
        self._auth_paused.pop(account.config_fingerprint, None)
        return True

    async def close(self) -> None:
        """Revoke first; never await an adapter that ignores cancellation."""
        self._closed = True
        self._auth_pause_observer = None
        self._snapshot_observer = None
        tasks = tuple(self._tasks)
        for task in (
            *tasks,
            *tuple(self._inflight.values()),
            *tuple(self._adapter_tasks),
        ):
            if not task.done() and task.cancelling() == 0:
                task.cancel()
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
        self._tasks.clear()
        self._inflight.clear()
        self._waiters.clear()
        self._cache.clear()

    def _provider(self, account: AccountSettings) -> _ProviderBudget:
        provider = account.provider_type
        if account.service_profile == "grsai":
            return ProviderType.GRSAI
        if provider in WALLET_GATEWAY_PROVIDERS and account.endpoint is not None:
            return (
                "origin",
                provider,
                gateway_origin(account.endpoint.get("base_url")),
            )
        if provider in WALLET_REGION_PROVIDERS:
            return ("region", provider, account.region)
        return provider

    def _blocked(self, account: AccountSettings) -> BalanceSnapshot | None:
        error = self._auth_paused.get(account.config_fingerprint)
        if error is not None:
            return replace(
                self._failure(
                    account,
                    error.category,
                    localized("query.authentication_paused"),
                ),
                error=replace(
                    error,
                    safe_message=localized("query.authentication_paused"),
                ),
            )
        provider = self._cooldowns.get(self._provider(account))
        local = self._cooldowns.get((account.id, account.config_fingerprint))
        provider_blocked = provider is not None and (
            local is None or provider[0] >= local[0]
        )
        cooldown = provider if provider_blocked else local
        if cooldown is None:
            return None
        remaining = cooldown[0] - self._clock()
        if remaining <= 0:
            return None
        message = localized(
            "query.cooldown_provider" if provider_blocked else "query.cooldown_account",
            seconds=math.ceil(remaining),
        )
        error = replace(
            cooldown[1],
            safe_message=message,
            diagnostic_code="provider_cooldown"
            if provider_blocked
            else "account_cooldown",
            retry_after_seconds=remaining,
        )
        return replace(self._failure(account, error.category, message), error=error)

    async def _query_account(
        self, account: AccountSettings, max_age_seconds: float | None = None
    ) -> BalanceSnapshot:
        if not account.queryable:
            return self._failure(
                account,
                ProviderErrorCategory.CONFIGURATION,
                localized("query.account_incomplete"),
            )
        if self._closed:
            return self._failure(
                account,
                ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                localized("query.service_closed"),
            )
        if account.config_fingerprint in self._auth_paused:
            return self._blocked(account)
        ttl = account.cache_ttl_seconds
        if max_age_seconds is not None:
            ttl = min(ttl, max(0.0, max_age_seconds))
        cached = self._cache.get(account.id, account.config_fingerprint, ttl)
        if cached is not None:
            age = (self._wall_clock() - cached.fetched_at).total_seconds()
            if 0 <= age <= ttl:
                return cached
        adapter = self._adapters.get(account.provider_type)
        if adapter is None:
            return self._failure(
                account,
                ProviderErrorCategory.NOT_IMPLEMENTED,
                localized("query.provider_unsupported"),
            )
        if self._client is None:
            return self._failure(
                account,
                ProviderErrorCategory.CONFIGURATION,
                localized("query.client_unconfigured"),
            )
        key = (account.id, account.config_fingerprint)
        task = self._inflight.get(key)
        if task is None or task.done():
            blocked = self._blocked(account)
            if blocked is not None:
                return blocked
            task = asyncio.create_task(self._run_account(adapter, account))
            self._inflight[key] = task
            task.add_done_callback(self._observe_task)
        self._waiters[key] = self._waiters.get(key, 0) + 1
        try:
            return await asyncio.shield(task)
        finally:
            self._waiters[key] = self._waiters.get(key, 1) - 1
            if self._waiters[key] <= 0:
                self._waiters.pop(key, None)
                if self._inflight.get(key) is task:
                    self._inflight.pop(key, None)
                if not task.done() and task.cancelling() == 0:
                    task.cancel()

    async def _run_account(
        self, adapter: ProviderAdapter, account: AccountSettings
    ) -> BalanceSnapshot:
        started = asyncio.Event()
        adapter_task = asyncio.create_task(
            self._fetch_account(adapter, account, started)
        )
        self._adapter_tasks.add(adapter_task)
        adapter_task.add_done_callback(self._observe_task)
        try:
            done, pending = await asyncio.wait(
                (adapter_task,), timeout=account.timeout_seconds
            )
        except asyncio.CancelledError:
            if adapter_task.cancelling() == 0:
                adapter_task.cancel()
            raise
        if pending:
            adapter_task.cancel()
            if not started.is_set():
                return self._failure(
                    account,
                    ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                    localized("query.queue_timeout"),
                    diagnostic_code="queue_timeout",
                )
            snapshot = self._failure(
                account,
                ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                localized("query.account_timeout"),
                diagnostic_code="account_timeout",
            )
            self._record_outcome(account, snapshot.error)
            return snapshot
        snapshot = adapter_task.result()
        if self._closed:
            return self._failure(
                account,
                ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                localized("query.service_closed"),
            )
        if snapshot.error is None and snapshot.status in (
            SnapshotStatus.AVAILABLE,
            SnapshotStatus.PARTIAL,
            SnapshotStatus.UNAVAILABLE,
        ):
            self._cache.put(account.id, account.config_fingerprint, snapshot)
        return snapshot

    async def _fetch_account(
        self, adapter: ProviderAdapter, account: AccountSettings, started: asyncio.Event
    ) -> BalanceSnapshot:
        provider = self._provider(account)
        lock = self._provider_locks.setdefault(provider, asyncio.Lock())
        async with lock, self._semaphore:
            if self._closed:
                raise asyncio.CancelledError
            blocked = self._blocked(account)
            if blocked is not None:
                return blocked
            try:
                started.set()
                snapshot = await adapter.fetch_balance(account, self._client)
            except asyncio.CancelledError:
                raise
            except Exception:
                snapshot = self._failure(
                    account,
                    ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                    localized("query.unavailable"),
                )
            # An uncooperative adapter may catch cancellation. Its late result is
            # revoked and cannot reset budget, update cache or trigger alerts.
            if self._closed or asyncio.current_task().cancelling():
                raise asyncio.CancelledError
            if (
                not isinstance(snapshot, BalanceSnapshot)
                or snapshot.account_id != account.id
                or snapshot.provider_type is not account.provider_type
            ):
                snapshot = self._failure(
                    account,
                    ProviderErrorCategory.PARSE,
                    localized("query.invalid_provider_result"),
                )
            self._record_outcome(account, snapshot.error)
            if self._snapshot_observer is not None and self._fresh_facts(snapshot):
                try:
                    self._snapshot_observer(snapshot)
                except Exception:
                    # The observer owns fail-closed monitoring state. It cannot
                    # expose errors, alter facts, or break the manual query.
                    pass
            return snapshot

    def _record_outcome(
        self, account: AccountSettings, error: NormalizedProviderError | None
    ) -> None:
        if self._closed:
            return
        provider = self._provider(account)
        account_key = (account.id, account.config_fingerprint)
        if error is None:
            for key in (provider, account_key):
                self._failures.pop(key, None)
                self._cooldowns.pop(key, None)
        elif error.category in (
            ProviderErrorCategory.AUTHENTICATION,
            ProviderErrorCategory.PERMISSION,
        ):
            already_paused = account.config_fingerprint in self._auth_paused
            self._auth_paused[account.config_fingerprint] = error
            if not already_paused and self._auth_pause_observer is not None:
                try:
                    self._auth_pause_observer(account.id)
                except Exception:
                    # Persistence owner handles its own fail-closed state. Never
                    # discard the credential gate or expose callback exceptions.
                    pass
        elif error.category in (
            ProviderErrorCategory.RATE_LIMITED,
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
            ProviderErrorCategory.PARSE,
        ):
            rate_limited = error.category is ProviderErrorCategory.RATE_LIMITED
            # Explicit upstream budgets stay shared across keys. A local
            # transport or response failure only backs off the queried account.
            key = (
                provider
                if rate_limited or error.retry_after_seconds is not None
                else account_key
            )
            count = min(self._failures.get(key, 0) + 1, 12)
            self._failures[key] = count
            base = 60.0 if rate_limited else 2.0
            delay = min(base * (2 ** (count - 1)) * (1 + 0.2 * self._jitter()), 3600.0)
            delay = max(delay, error.retry_after_seconds or 0)
            self._cooldowns[key] = (self._clock() + delay, error)

    def _observe_task(self, task: asyncio.Task) -> None:
        self._tasks.discard(task)
        self._adapter_tasks.discard(task)
        if not task.cancelled():
            task.exception()

    def _select_accounts(self, request: QueryRequest) -> tuple[AccountSettings, ...]:
        accounts = tuple(
            account for account in self._settings.accounts if account.enabled
        )
        if request.kind is QueryRequestKind.ALL:
            return accounts
        if request.kind is QueryRequestKind.ACCOUNT:
            account = next(
                (
                    item
                    for item in accounts
                    if item.id.casefold() == request.target.casefold()
                ),
                None,
            )
            if account is None:
                return ()
            return (account,)
        if request.kind is QueryRequestKind.PROVIDER:
            try:
                provider = ProviderType(request.target)
            except ValueError:
                return ()
            return tuple(
                item
                for item in accounts
                if (
                    ProviderType.GRSAI
                    if item.provider_type is ProviderType.OPENAI_COMPATIBLE
                    and item.service_profile == "grsai"
                    else item.provider_type
                )
                is provider
            )
        return ()

    @staticmethod
    def _failure(
        account: AccountSettings,
        category: ProviderErrorCategory,
        message: str,
        *,
        diagnostic_code: str | None = None,
    ) -> BalanceSnapshot:
        return BalanceSnapshot(
            account_id=account.id,
            provider_type=account.provider_type,
            display_name=account.display_name,
            status=SnapshotStatus.UNAVAILABLE,
            balances=(),
            source="query service",
            fetched_at=datetime.now(UTC),
            error=NormalizedProviderError(category, message, diagnostic_code),
        )

    @staticmethod
    def _result(
        request: QueryRequest, snapshots: tuple[BalanceSnapshot, ...]
    ) -> QueryResult:
        return QueryResult(request, snapshots, datetime.now(UTC))
