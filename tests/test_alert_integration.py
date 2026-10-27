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
