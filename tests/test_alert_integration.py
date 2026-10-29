"""A real query service + scheduler seam, with fake adapter and transport only."""

import asyncio
from datetime import UTC, datetime
from decimal import Decimal
from types import SimpleNamespace

from quota_link.alert_delivery import AlertDelivery
from quota_link.alerts import AlertEngine
from quota_link.cache import BalanceCache
from quota_link.models import (
    BalanceItem,
    BalanceItemKind,
    BalanceSnapshot,
    ProviderType,
    QueryRequest,
    QueryRequestKind,
    SnapshotStatus,
)
from quota_link.service import QueryService
from quota_link.settings import load_settings


def test_manual_and_alert_share_one_request_and_valid_unavailable_zero_triggers(
    tmp_path,
):
    async def scenario():
        raw = {
            "balance_alert_targets": [
                {"umo": "fake:GroupMessage:42", "mentions": ["123"]}
            ],
            "balance_alert_llm": {"enabled": False},
            "providers": [
                {
                    "id": "demo",
                    "type": "deepseek",
                    "display_name": "合成账户",
                    "auth": {"api_key": "synthetic-do-not-send-secret"},
                    "balance_alert": {"enabled": True, "threshold": "0", "unit": "CNY"},
                }
            ],
        }
        settings = load_settings(raw)
        entered, release = asyncio.Event(), asyncio.Event()
        adapter_calls, sent = [], []

        class Adapter:
            async def fetch_balance(self, account, client):
                adapter_calls.append(account.id)
                entered.set()
                await release.wait()
                return BalanceSnapshot(
                    account.id,
                    account.provider_type,
                    account.display_name,
                    SnapshotStatus.UNAVAILABLE,
                    (
                        BalanceItem(
                            BalanceItemKind.CASH,
                            Decimal("0"),
                            "CNY",
                            metric="total_balance",
                        ),
                    ),
                    "synthetic adapter",
                    datetime.now(UTC),
                )

        async def send(target, chain):
            sent.append((target, chain))
            return True

        context = SimpleNamespace(
            get_platform_inst=lambda _: SimpleNamespace(
                meta=lambda: SimpleNamespace(id="fake", name="aiocqhttp")
            ),
            send_message=send,
        )
        service = QueryService(
            settings, {ProviderType.DEEPSEEK: Adapter()}, object(), BalanceCache()
        )

        async def session_enabled(umo):
            return True

        delivery = AlertDelivery(
            context,
            component_factory=lambda mentions, text: (mentions, text),
            session_enabled=session_enabled,
            session_llm_enabled=session_enabled,
        )
        engine = AlertEngine(
            settings, service, context, tmp_path / "alerts.sqlite3", delivery=delivery
        )
        manual = asyncio.create_task(
            service.query(QueryRequest(QueryRequestKind.ACCOUNT, "demo"))
        )
        await entered.wait()
        tick = asyncio.create_task(engine.run_once())
        await asyncio.sleep(0)
        release.set()
        result, _ = await asyncio.gather(manual, tick)
        assert adapter_calls == ["demo"]
        assert result.snapshots[0].status is SnapshotStatus.UNAVAILABLE
        assert len(sent) == 1 and sent[0][1][0] == ("123",)
        assert "0 CNY" in sent[0][1][1]
        assert "synthetic-do-not-send-secret" not in repr(sent)
        assert engine.status()["accounts"][0]["status"] == "submitted"
        engine.wake("demo")
        await engine.run_once()
        assert adapter_calls == ["demo"] and len(sent) == 1
        await engine.close()
        await service.close()

    asyncio.run(scenario())


def test_explicit_unit_refresh_queries_again_but_respects_shared_provider_backoff(
    tmp_path,
):
    import pytest

    from quota_link.models import NormalizedProviderError, ProviderErrorCategory

    async def scenario():
        settings = load_settings(
            {
                "providers": [
                    {
                        "id": "demo",
                        "type": "deepseek",
                        "display_name": "Synthetic",
                        "auth": {"api_key": "synthetic-only"},
                        "balance_alert": {"threshold": "10"},
                    }
                ]
            }
        )
        calls = []

        class Adapter:
            async def fetch_balance(self, account, client):
                calls.append(account.id)
                if len(calls) > 2:
                    return BalanceSnapshot(
                        account.id,
                        account.provider_type,
                        account.display_name,
                        SnapshotStatus.UNKNOWN,
                        (),
                        "synthetic",
                        datetime.now(UTC),
                        error=NormalizedProviderError(
                            ProviderErrorCategory.RATE_LIMITED,
                            "synthetic",
                            retry_after_seconds=300,
                        ),
                    )
                return BalanceSnapshot(
                    account.id,
                    account.provider_type,
                    account.display_name,
                    SnapshotStatus.AVAILABLE,
                    (
                        BalanceItem(
                            BalanceItemKind.CASH,
                            Decimal("5"),
                            "CNY" if len(calls) == 1 else "USD",
                            metric="total_balance",
                        ),
                    ),
                    "synthetic",
                    datetime.now(UTC),
                )

        service = QueryService(
            settings, {ProviderType.DEEPSEEK: Adapter()}, object(), BalanceCache()
        )
        monitor = AlertEngine(settings, service, object(), tmp_path / "alerts.sqlite3")
        first = (await monitor.refresh_units("demo", lambda: None))["accounts"][0]
        second = (await monitor.refresh_units("demo", lambda: None))["accounts"][0]
        assert calls == ["demo", "demo"]
        assert first["unit_state"] == "verified" and first["unit"] == "CNY"
        assert (
            second["unit_state"] == "changed" and second["choices"][0]["unit"] == "USD"
        )
        assert second["change_reason"] == "unit_changed"
        with pytest.raises(ValueError):
            monitor.confirm_unit("demo", first["choices"][0]["id"])
        for _ in range(2):
            with pytest.raises(ValueError, match="未取得"):
                await monitor.refresh_units("demo", lambda: None)
        assert calls == ["demo", "demo", "demo"]
        cooldown = service._cooldowns[ProviderType.DEEPSEEK][1]
        assert cooldown.category is ProviderErrorCategory.RATE_LIMITED
        assert cooldown.retry_after_seconds == 300
        await monitor.close()
        await service.close()

    asyncio.run(scenario())
