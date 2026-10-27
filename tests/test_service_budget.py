"""Restoring a persisted auth pause must gate manual and scheduled traffic."""

import asyncio

from test_service import FakeClient, RecordingAdapter, make_settings, success

from quota_link.cache import BalanceCache
from quota_link.models import (
    ProviderErrorCategory,
    ProviderType,
    QueryRequest,
    QueryRequestKind,
)
from quota_link.service import QueryService


def test_restored_auth_pause_blocks_cache_and_queries_until_explicit_retry():
    async def run():
        settings = make_settings(
            providers=[
                {
                    "id": "paused",
                    "type": "deepseek",
                    "display_name": "Synthetic",
                    "auth": {"api_key": "synthetic-private-value"},
                }
            ]
        )
        cache = BalanceCache()
        account = settings.accounts[0]
        cache.put(account.id, account.config_fingerprint, success(account))
        adapter = RecordingAdapter()
        service = QueryService(
            settings, {ProviderType.DEEPSEEK: adapter}, FakeClient(), cache
        )
        assert service.restore_auth_pause("paused") is None
        assert not adapter.calls
        for max_age in (None, 0, 60):
            result = await service.query(
                QueryRequest(QueryRequestKind.ACCOUNT, "paused"),
                max_age_seconds=max_age,
            )
            snapshot = result.snapshots[0]
            assert snapshot.error.category is ProviderErrorCategory.AUTHENTICATION
            assert snapshot.error.diagnostic_code == "restored_auth_pause"
            assert "已暂停" in snapshot.error.safe_message
            assert "synthetic-private-value" not in repr(snapshot)
            assert not snapshot.balances and not snapshot.cached
        assert not adapter.calls
        assert service.retry_account("paused")
        assert not adapter.calls  # Explicit reset itself does not query or send.
        assert (
            await service.query(
                QueryRequest(QueryRequestKind.ACCOUNT, "paused"), max_age_seconds=0
            )
        ).snapshots[0].error is None
        assert adapter.calls == ["paused"]
        await service.close()

    asyncio.run(run())


def test_restored_pause_uses_current_fingerprint_and_does_not_guess_other_accounts():
    async def run():
        settings = make_settings(
            providers=[
                {
                    "id": name,
                    "type": "deepseek",
                    "display_name": name,
                    "auth": {
                        "api_key": "same-synthetic-value"
                        if name != "other"
                        else "different-synthetic-value"
                    },
                }
                for name in ("paused", "alias", "other")
            ]
        )
        adapter = RecordingAdapter()
        service = QueryService(
            settings, {ProviderType.DEEPSEEK: adapter}, FakeClient(), BalanceCache()
        )
        service.restore_auth_pause("missing")
        assert not service._auth_paused
        service.restore_auth_pause("paused")
        assert set(service._auth_paused) == {settings.accounts[0].config_fingerprint}
        assert not adapter.calls
        alias = (
            await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "alias"))
        ).snapshots[0]
        assert alias.error.category is ProviderErrorCategory.AUTHENTICATION
        other = (
            await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "other"))
        ).snapshots[0]
        assert other.error is None
        assert adapter.calls == ["other"]
        await service.close()
        before = dict(service._auth_paused)
        service.restore_auth_pause("other")
        assert service._auth_paused == before

    asyncio.run(run())


def test_manual_auth_failure_notifies_persistence_synchronously_and_only_once():
    async def run():
        from dataclasses import replace

        from quota_link.models import NormalizedProviderError

        settings = make_settings()
        noticed = []

        class Denied:
            async def fetch_balance(self, account, client):
                return replace(
                    success(account),
                    balances=(),
                    error=NormalizedProviderError(
                        ProviderErrorCategory.PERMISSION, "权限失败"
                    ),
                )

        service = QueryService(
            settings, {ProviderType.DEEPSEEK: Denied()}, FakeClient(), BalanceCache()
        )
        service.set_auth_pause_observer(noticed.append)
        result = await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "first"))
        assert result.snapshots[0].error.category is ProviderErrorCategory.PERMISSION
        assert noticed == ["first"]  # Complete before the query returns.
        await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "first"))
        service.restore_auth_pause("first")
        service.restore_auth_pause("second")
        assert noticed == ["first"]  # Restore cannot recursively persist.
        service.retry_account("first")
        await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "first"))
        assert noticed == ["first", "first"]
        service.set_auth_pause_observer(None)
        service.retry_account("first")
        await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "first"))
        assert noticed == ["first", "first"]
        await service.close()

    asyncio.run(run())


def test_observer_exception_preserves_auth_gate_without_leaking_details():
    async def run():
        from dataclasses import replace

        from quota_link.models import NormalizedProviderError

        settings = make_settings()
        calls = []

        class Adapter:
            async def fetch_balance(self, account, client):
                calls.append(account.id)
                if account.id == "first":
                    return replace(
                        success(account),
                        balances=(),
                        error=NormalizedProviderError(
                            ProviderErrorCategory.AUTHENTICATION, "认证失败"
                        ),
                    )
                return success(account)

        def broken_observer(account_id):
            raise RuntimeError("credential-private-and-filesystem-path")

        service = QueryService(
            settings,
            {ProviderType.DEEPSEEK: Adapter(), ProviderType.ALIBABA_BAILIAN: Adapter()},
            FakeClient(),
            BalanceCache(),
        )
        service.set_auth_pause_observer(broken_observer)
        result = await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "first"))
        blocked = await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "first"))
        assert (
            result.snapshots[0].error.category is ProviderErrorCategory.AUTHENTICATION
        )
        assert (
            blocked.snapshots[0].error.category is ProviderErrorCategory.AUTHENTICATION
        )
        assert "credential-private" not in repr(result) + repr(blocked)
        assert (
            await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "second"))
        ).snapshots[0].error is None
        assert calls == ["first", "second"]
        await service.close()

    asyncio.run(run())


def test_close_revokes_observer_and_late_auth_result_cannot_write():
    async def run():
        from dataclasses import replace

        from quota_link.models import NormalizedProviderError

        settings = make_settings()
        entered, cancelled, release, finished = (asyncio.Event() for _ in range(4))
        notices = []

        class Late:
            async def fetch_balance(self, account, client):
                entered.set()
                try:
                    await asyncio.Event().wait()
                except asyncio.CancelledError:
                    cancelled.set()
                    await release.wait()
                finished.set()
                return replace(
                    success(account),
                    balances=(),
                    error=NormalizedProviderError(
                        ProviderErrorCategory.AUTHENTICATION, "认证失败"
                    ),
                )

        service = QueryService(
            settings, {ProviderType.DEEPSEEK: Late()}, FakeClient(), BalanceCache()
        )
        service.set_auth_pause_observer(notices.append)
        query = asyncio.create_task(
            service.query(QueryRequest(QueryRequestKind.ACCOUNT, "first"))
        )
        await entered.wait()
        await service.close()
        await cancelled.wait()
        assert service._auth_pause_observer is None
        service.set_auth_pause_observer(notices.append)
        assert service._auth_pause_observer is None
        release.set()
        await finished.wait()
        await asyncio.gather(query, return_exceptions=True)
        await asyncio.sleep(0)
        assert not notices and not service._auth_paused

    asyncio.run(run())


def test_grsai_http_auth_and_rate_statuses_reach_shared_service_gates():
    import httpx

    from quota_link.http_client import HttpProviderClient
    from quota_link.providers import IMPLEMENTED_ADAPTERS
    from quota_link.settings import load_settings

    async def run(status):
        settings = load_settings(
            {
                "providers": [
                    {
                        "id": "grsai",
                        "type": "grsai",
                        "display_name": "Synthetic Grsai",
                        "auth": {"token": "synthetic-secret"},
                    }
                ]
            }
        )
        calls, notices = [], []
        clock = [0.0]

        def handler(request):
            calls.append(request)
            return httpx.Response(
                status,
                headers={"Retry-After": "300"},
                json={"message": "do-not-expose-response"},
            )

        client = HttpProviderClient(
            client=httpx.AsyncClient(transport=httpx.MockTransport(handler))
        )
        service = QueryService(
            settings,
            IMPLEMENTED_ADAPTERS,
            client,
            BalanceCache(),
            monotonic=lambda: clock[0],
            jitter=lambda: 0,
        )
        service.set_auth_pause_observer(notices.append)
        request = QueryRequest(QueryRequestKind.ACCOUNT, "grsai")
        first = (await service.query(request)).snapshots[0]
        assert (
            first.error.category
            is {
                401: ProviderErrorCategory.AUTHENTICATION,
                403: ProviderErrorCategory.PERMISSION,
                429: ProviderErrorCategory.RATE_LIMITED,
            }[status]
        )
        assert first.error.retry_after_seconds == 300
        assert "do-not-expose-response" not in repr(first)
        assert len(calls) == 1
        await service.query(request)
        assert len(calls) == 1
        if status in (401, 403):
            assert notices == ["grsai"]
            assert service.retry_account("grsai")
            await service.query(request)
            assert len(calls) == 2
        else:
            assert not notices
            assert service.retry_account("grsai")
            await service.query(request)
            assert len(calls) == 1  # Retry cannot bypass upstream Retry-After.
            clock[0] = 300
            await service.query(request)
            assert len(calls) == 2
        await service.close()
        await client.close()

    for status in (401, 403, 429):
        asyncio.run(run(status))
