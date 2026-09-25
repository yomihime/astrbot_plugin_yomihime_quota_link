"""Provider-independent query orchestration and failure normalization."""

from __future__ import annotations

import asyncio
from datetime import UTC, datetime
from typing import Mapping

from .cache import BalanceCache
from .models import (
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
from .settings import AccountSettings, PluginSettings


class QueryService:
    """Run configured account queries with deadlines, caching and bounded access."""

    def __init__(
        self,
        settings: PluginSettings,
        adapters: Mapping[ProviderType, ProviderAdapter],
        client: AsyncProviderClient | None,
        cache: BalanceCache,
    ) -> None:
        self._settings = settings
        self._adapters = adapters
        self._client = client
        self._cache = cache
        self._semaphore = asyncio.Semaphore(settings.max_concurrency)
        self._tasks: set[asyncio.Task[BalanceSnapshot]] = set()
        self._adapter_tasks: set[asyncio.Task[BalanceSnapshot]] = set()
        self._closed = False

    async def query(self, request: QueryRequest) -> QueryResult:
        if request.kind in (QueryRequestKind.HELP, QueryRequestKind.STATUS):
            return self._result(request, ())
        if self._closed:
            return self._result(request, ())

        accounts = self._select_accounts(request)
        tasks = [
            asyncio.create_task(self._query_account(account)) for account in accounts
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
        if pending:
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
                            "查询暂时不可用",
                        )
                    )
            else:
                snapshots.append(
                    self._failure(
                        account,
                        ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                        "查询超过总时限",
                    )
                )
        return self._result(request, tuple(snapshots))

    async def close(self) -> None:
        """Cancel work promptly; an adapter that suppresses cancellation may
        continue in the background until it finishes, and is never awaited here.
        """
        self._closed = True
        tasks = tuple(self._tasks)
        adapter_tasks = tuple(self._adapter_tasks)
        for task in (*tasks, *adapter_tasks):
            if not task.done() and task.cancelling() == 0:
                task.cancel()
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
        self._tasks.clear()
        self._adapter_tasks.clear()
        self._cache.clear()

    async def _query_account(self, account: AccountSettings) -> BalanceSnapshot:
        if not account.queryable:
            return self._failure(
                account,
                ProviderErrorCategory.CONFIGURATION,
                "账户配置不完整，暂时无法查询",
            )

        cached = self._cache.get(
            account.id, account.config_fingerprint, account.cache_ttl_seconds
        )
        if cached is not None:
            return cached

        adapter = self._adapters.get(account.provider_type)
        if adapter is None:
            return self._failure(
                account,
                ProviderErrorCategory.NOT_IMPLEMENTED,
                "该供应商的余额查询尚未实现",
            )
        if self._client is None:
            return self._failure(
                account,
                ProviderErrorCategory.CONFIGURATION,
                "查询客户端未配置",
            )

        adapter_task = asyncio.create_task(self._fetch_account(adapter, account))
        self._adapter_tasks.add(adapter_task)
        adapter_task.add_done_callback(self._observe_task)
        try:
            done, pending = await asyncio.wait(
                (adapter_task,), timeout=account.timeout_seconds
            )
        except asyncio.CancelledError:
            adapter_task.cancel()
            raise
        if pending:
            adapter_task.cancel()
            return self._failure(
                account,
                ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                "账户查询超过时限",
            )
        if adapter_task not in done:
            return self._failure(
                account,
                ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                "查询暂时不可用",
            )
        try:
            snapshot = adapter_task.result()
        except asyncio.CancelledError:
            raise
        except Exception:
            return self._failure(
                account,
                ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                "查询暂时不可用",
            )

        if (
            not isinstance(snapshot, BalanceSnapshot)
            or snapshot.account_id != account.id
        ):
            return self._failure(
                account,
                ProviderErrorCategory.PARSE,
                "供应商返回的账户结果无效",
            )
        if snapshot.error is None and snapshot.status in (
            SnapshotStatus.AVAILABLE,
            SnapshotStatus.PARTIAL,
        ):
            self._cache.put(account.id, account.config_fingerprint, snapshot)
        return snapshot

    async def _fetch_account(
        self, adapter: ProviderAdapter, account: AccountSettings
    ) -> BalanceSnapshot:
        async with self._semaphore:
            return await adapter.fetch_balance(account, self._client)

    def _observe_task(self, task: asyncio.Task[BalanceSnapshot]) -> None:
        """Forget completed work and retrieve exceptions from detached tasks."""
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
    ) -> BalanceSnapshot:
        return BalanceSnapshot(
            account_id=account.id,
            provider_type=account.provider_type,
            display_name=account.display_name,
            status=SnapshotStatus.UNAVAILABLE,
            balances=(),
            source="query service",
            fetched_at=datetime.now(UTC),
            error=NormalizedProviderError(category, message),
        )

    @staticmethod
    def _result(
        request: QueryRequest, snapshots: tuple[BalanceSnapshot, ...]
    ) -> QueryResult:
        return QueryResult(request, snapshots, datetime.now(UTC))
