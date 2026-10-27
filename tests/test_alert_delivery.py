import asyncio
from decimal import Decimal
from functools import wraps
from types import SimpleNamespace

import pytest

from quota_link.alert_config import BalanceAlertLLM, BalanceAlertTarget
from quota_link.alert_delivery import AlertDelivery, AlertFact, format_alert_facts


def run_async(function):
    @wraps(function)
    def wrapped(*args, **kwargs):
        return asyncio.run(function(*args, **kwargs))

    return wrapped


class FakeContext:
    def __init__(self, *, adapter="aiocqhttp", result=True, text=""):
        self.adapter = adapter
        self.result = result
        self.text = text
        self.sent = []
        self.prompts = []
        self.resolved = []
        self.persona_manager = SimpleNamespace(get_persona=self.persona)

    def get_platform_inst(self, instance):
        if self.adapter is None:
            return None
        return SimpleNamespace(
            meta=lambda: SimpleNamespace(id=instance, name=self.adapter)
        )

    async def get_current_chat_provider_id(self, umo):
        self.resolved.append(umo)
        return "fake-model"

    async def persona(self, persona_id):
        return SimpleNamespace(system_prompt="Speak gently.")

    async def llm_generate(self, **kwargs):
        self.prompts.append(kwargs)
        if isinstance(self.text, Exception):
            raise self.text
        return SimpleNamespace(completion_text=self.text)

    async def send_message(self, umo, message):
        self.sent.append((umo, message))
        if isinstance(self.result, Exception):
            raise self.result
        return self.result


def fact():
    return AlertFact(
        "account",
        "Synthetic account",
        "AvailableAmount",
        Decimal("-8.25"),
        Decimal("10"),
        "CNY",
    )


def delivery(context, **kwargs):
    return AlertDelivery(
        context, component_factory=lambda mentions, text: (mentions, text), **kwargs
    )


@run_async
@pytest.mark.parametrize(
    "response,status",
    [
        (True, "submitted"),
        (False, "failed"),
        (None, "unknown"),
        ("true", "unknown"),
        (RuntimeError("secret"), "unknown"),
    ],
)
async def test_transport_result_is_not_delivery_receipt(response, status):
    context = FakeContext(result=response)
    reserved = []
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(False),
        active=lambda: True,
        reserve=lambda: reserved.append(True) or True,
    )
    assert result.status == status
    assert len(context.sent) == len(reserved) == 1
    assert "secret" not in repr(result)
    if status == "submitted":
        assert "不代表最终送达" in result.message


@run_async
@pytest.mark.parametrize(
    "adapter,umo,mentions,allowed",
    [
        ("aiocqhttp", "arbitrary:GroupMessage:prefix_123", ("456", "789"), True),
        ("aiocqhttp", "custom:FriendMessage:123", ("456",), False),
        ("telegram", "NapCat-QQ:GroupMessage:123", ("456",), False),
        (None, "custom:GroupMessage:123", ("456",), False),
        ("qq_official", "custom:FriendMessage:123", (), False),
        ("aiocqhttp", "custom:GroupMessage:abc:123", ("456",), False),
        ("aiocqhttp", "custom:GroupMessage:123", ("all",), False),
        ("aiocqhttp", "custom:GroupMessage:123", ("０１２",), False),
        ("telegram", "custom:OtherMessage:room:thread", (), True),
        ("telegram", "custom:GroupMessage:room:thread", (), True),
    ],
)
async def test_mentions_use_actual_adapter_and_message_type(
    adapter, umo, mentions, allowed
):
    context = FakeContext(adapter=adapter)
    result = await delivery(context).deliver(
        BalanceAlertTarget(umo, mentions),
        (fact(),),
        BalanceAlertLLM(False),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert (result.status == "submitted") is allowed
    assert bool(context.sent) is allowed
    if allowed:
        assert context.sent[0][1][0] == mentions


@run_async
@pytest.mark.parametrize(
    "text",
    [
        "",
        "余额还有9999元",
        "@all",
        "[CQ:at,qq=all]",
        "https://evil.test",
        "充值成功",
        "x" * 500,
        RuntimeError("model-secret"),
    ],
)
async def test_invalid_or_failed_llm_output_falls_back_to_fixed_facts(text):
    context = FakeContext(text=text)
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert result.status == "submitted"
    sent = context.sent[0][1][1]
    assert sent == format_alert_facts((fact(),))
    assert "-8.25 CNY" in sent and "10 CNY" in sent
    prompt = repr(context.prompts)
    assert "-8.25" not in prompt and "Synthetic account" not in prompt
    assert "custom:FriendMessage" not in prompt and "model-secret" not in prompt
    assert context.prompts[0]["tools"] is None
    assert context.prompts[0]["contexts"] == []


@run_async
async def test_explicit_model_and_persona_never_attach_conversation():
    context = FakeContext(text="温馨提醒：请及时检查账户额度。")
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(True, "explicit", "gentle"),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert result.status == "submitted" and not context.resolved
    assert context.prompts[0]["chat_provider_id"] == "explicit"
    assert "Speak gently." in context.prompts[0]["system_prompt"]
    assert "温馨提醒" in context.sent[0][1][1]


@run_async
async def test_revocation_during_model_generation_never_reaches_transport():
    context = FakeContext()
    active = [True]

    async def generate(**kwargs):
        active[0] = False
        return SimpleNamespace(completion_text="温馨提醒：请及时检查账户额度。")

    context.llm_generate = generate
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: active[0],
        reserve=lambda: pytest.fail("must not reserve"),
    )
    assert result.status == "cancelled" and not context.sent


@run_async
async def test_send_timeout_is_unknown_and_model_timeout_is_safe_fallback():
    context = FakeContext()

    async def never(**kwargs):
        await asyncio.Future()

    context.llm_generate = never
    result = await delivery(context, llm_timeout=0).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert result.status == "submitted" and context.sent[0][1][1] == format_alert_facts(
        (fact(),)
    )

    async def never_send(*args):
        await asyncio.Future()

    context.send_message = never_send
    result = await delivery(context, send_timeout=0).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(False),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert result.status == "unknown"


@run_async
async def test_budget_reservation_can_deny_without_transport():
    context = FakeContext()
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(False),
        active=lambda: True,
        reserve=lambda: False,
    )
    assert result.status == "cancelled" and not context.sent


@run_async
async def test_missing_host_component_factory_fails_closed():
    context = FakeContext()
    result = await AlertDelivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(False),
        active=lambda: True,
        reserve=lambda: pytest.fail("must not reserve"),
    )
    assert result.status == "blocked" and not context.sent


def test_extreme_decimal_formatting_is_exact_and_bounded():
    from dataclasses import replace

    text = format_alert_facts((replace(fact(), amount=Decimal("1E-10000")),))
    assert "1E-10000" in text and len(text) < 500
    text = format_alert_facts((replace(fact(), amount=Decimal("-0E-10000")),))
    assert "：0 CNY" in text and len(text) < 500
