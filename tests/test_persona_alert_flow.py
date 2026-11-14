"""Persona notice behavior across the scheduler, model and synthetic transport."""

import asyncio
import sqlite3
from dataclasses import replace
from decimal import Decimal
from types import SimpleNamespace

import pytest
from test_alert_delivery import FakeContext, delivery, run_async
from test_alert_runtime import Clock, Service, engine, settings

from quota_link.alert_config import BalanceAlertLLM
from quota_link.alert_delivery import AlertFact, format_alert_facts
from quota_link.models import BalanceItemKind, ProviderType

ROWS = "<yql.1.name>的余额是<yql.1.balance>；还有<yql.2.name>，余额是<yql.2.balance>。"


class MixedUnitService(Service):
    async def query(self, request, **kwargs):
        result = await super().query(request, **kwargs)
        if request.target == "account-1":
            (snapshot,) = result.snapshots
            (item,) = snapshot.balances
            snapshot = replace(
                snapshot,
                balances=(
                    replace(
                        item,
                        kind=BalanceItemKind.CREDITS,
                        unit="credit",
                        metric="credit",
                    ),
                ),
            )
            self.latest[request.target] = snapshot
            result.snapshots = (snapshot,)
        return result


@run_async
@pytest.mark.parametrize("mode", ["valid", "missing_token", "model_error", "timeout"])
async def test_same_tick_sends_one_combined_notice_per_target(tmp_path, mode):
    config = settings(count=2, targets=2)
    config.balance_alert_llm = BalanceAlertLLM(True)
    cash, credit = config.accounts
    cash.display_name = "Synthetic cash account"
    credit.display_name = "Synthetic credit account"
    credit.provider_type = ProviderType.GRSAI
    credit.balance_alert = replace(
        credit.balance_alert, metric="credit", unit="credit", threshold=Decimal("8.75")
    )
    clock = Clock()
    service = MixedUnitService(config, clock)
    service.amounts.update(
        {cash.id: Decimal("-1.000000000000000001"), credit.id: Decimal("0")}
    )
    context = FakeContext()
    targets = config.balance_alert_targets
    names = dict(
        zip((target.umo for target in targets), ("captain", "gardener"), strict=True)
    )
    salutations = {"captain": "舰长，请看补给。", "gardener": "园丁，记得照料额度呀。"}

    async def provider(umo):
        return f"model-{names[umo]}"

    async def persona(**kwargs):
        name = names[kwargs["umo"]]
        return name, {"prompt": f"Tone for {name}."}, None, False

    async def generate(**request):
        context.prompts.append(request)
        name = request["chat_provider_id"].removeprefix("model-")
        text = salutations[name] + ROWS
        if mode == "model_error":
            raise RuntimeError("synthetic provider details")
        if mode == "timeout":
            await asyncio.Future()
        if mode == "missing_token":
            text = text.replace("<yql.2.balance>", "")
        return SimpleNamespace(completion_text=text)

    context.get_current_chat_provider_id = provider
    context.persona_manager.resolve_selected_persona = persona
    context.llm_generate = generate
    monitor, *_ = engine(tmp_path, config, clock, service, context)
    if mode == "timeout":
        monitor.delivery = delivery(context, llm_timeout=0.1)
    facts = (
        AlertFact(
            cash.id,
            cash.display_name,
            "total_balance",
            service.amounts[cash.id],
            Decimal("10"),
            "CNY",
        ),
        AlertFact(
            credit.id,
            credit.display_name,
            "credit",
            service.amounts[credit.id],
            Decimal("8.75"),
            "credit",
        ),
    )
    try:
        await monitor.run_once()
        assert len(context.sent) == len(context.prompts) == len(targets)
        assert [umo for umo, _ in context.sent] == [target.umo for target in targets]
        for target, (_, (mentions, text)), request in zip(
            targets, context.sent, context.prompts, strict=True
        ):
            name = names[target.umo]
            assert request["chat_provider_id"] == f"model-{name}"
            assert request["system_prompt"] == f"Tone for {name}."
            assert request["contexts"] == [] and request["tools"] is None
            assert (
                "<yql.1.name>" in request["prompt"]
                and "<yql.2.balance>" in request["prompt"]
            )
            for private in (
                cash.display_name,
                credit.display_name,
                str(service.amounts[cash.id]),
                "8.75",
                "CNY",
                "never-send-this-secret",
                target.umo,
                "234",
                "PRIVATE HISTORY",
                "existing-conversation",
            ):
                assert private not in repr(request)
            assert mentions == target.mentions
            assert "threshold" not in repr(request) and "metric" not in repr(request)
            assert "10 CNY" not in text and "8.75 credit" not in text
            assert "总余额" not in text and "积分余额" not in text
            if mode == "valid":
                assert text == (
                    salutations[name]
                    + "Synthetic cash account的余额是-1.000000000000000001 CNY；"
                    "还有Synthetic credit account，余额是0 credit。"
                )
            else:
                assert text == format_alert_facts(facts)

        first = monitor.status()["accounts"]
        assert [status["account_id"] for status in first] == [cash.id, credit.id]
        assert {status["status"] for status in first} == {"submitted"}
        assert {status["detail_code"] for status in first} == {
            "" if mode == "valid" else "fixed_hint"
        }
        assert all(status["last_sent_at"] for status in first)

        clock.advance()
        await monitor.run_once()
        assert len(service.calls) == 4
        assert len(context.sent) == len(context.prompts) == len(targets)
        again = monitor.status()["accounts"]
        assert [status["last_sent_at"] for status in again] == [
            status["last_sent_at"] for status in first
        ]
    finally:
        await monitor.close()

    with sqlite3.connect(tmp_path / "alerts.sqlite3") as db:
        assert db.execute(
            "SELECT account_id, episode, COUNT(*), COUNT(DISTINCT attempted) "
            "FROM deliveries WHERE status = 'submitted' GROUP BY account_id, episode "
            "ORDER BY account_id"
        ).fetchall() == [(cash.id, 1, 2, 1), (credit.id, 1, 2, 1)]
        assert db.execute("SELECT COUNT(*) FROM deliveries").fetchone() == (4,)
        assert db.execute("SELECT COUNT(*) FROM budgets").fetchone() == (2,)
