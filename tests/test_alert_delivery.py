import asyncio
from decimal import Decimal
from functools import wraps
from types import SimpleNamespace

import pytest

from quota_link.alert_config import BalanceAlertLLM, BalanceAlertTarget
from quota_link.alert_delivery import (
    AlertDelivery,
    AlertFact,
    DeliveryResult,
    format_alert_facts,
)


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
        self.config_reads = []
        self.conversation_reads = []
        self.persona_reads = []
        self.config = {
            "provider_settings": {"enable": True},
            "agent_runner": {"runner_type": "local"},
        }
        self.current_id = "existing-conversation"
        self.conversation_persona_id = "gentle"
        self.selected_persona = ("gentle", {"prompt": "Speak gently."}, None, False)
        self.session_on = True
        self.session_ai_on = True
        self.session_checks = []
        self.ai_checks = []
        self.persona_manager = SimpleNamespace(resolve_selected_persona=self.persona)
        self.conversation_manager = SimpleNamespace(
            get_curr_conversation_id=self.current_conversation,
            get_conversation=self.conversation,
        )

    def get_config(self, *, umo):
        self.config_reads.append(umo)
        return self.config

    async def current_conversation(self, umo):
        self.conversation_reads.append(("current", umo))
        return self.current_id

    async def conversation(self, umo, cid, *, create_if_not_exists):
        self.conversation_reads.append(("read", umo, cid, create_if_not_exists))
        return SimpleNamespace(
            persona_id=self.conversation_persona_id,
            history="PRIVATE HISTORY MUST NEVER ENTER PROMPT",
        )

    async def session_enabled(self, umo):
        self.session_checks.append(umo)
        return self.session_on

    async def session_llm_enabled(self, umo):
        self.ai_checks.append(umo)
        return self.session_ai_on

    def get_platform_inst(self, instance):
        if self.adapter is None:
            return None
        return SimpleNamespace(
            meta=lambda: SimpleNamespace(id=instance, name=self.adapter)
        )

    async def get_current_chat_provider_id(self, umo):
        self.resolved.append(umo)
        return "fake-model"

    async def persona(self, **kwargs):
        self.persona_reads.append(kwargs)
        return self.selected_persona

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
    kwargs.setdefault("session_enabled", context.session_enabled)
    kwargs.setdefault("session_llm_enabled", context.session_llm_enabled)
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
async def test_target_host_model_and_resolved_persona_never_attach_history():
    context = FakeContext(text="温馨提醒：请及时检查账户额度。")
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert result.status == "submitted"
    assert context.resolved == ["custom:FriendMessage:123"] * 3
    assert context.prompts[0]["chat_provider_id"] == "fake-model"
    assert (
        context.conversation_reads
        == [
            ("current", "custom:FriendMessage:123"),
            ("read", "custom:FriendMessage:123", "existing-conversation", False),
        ]
        * 3
    )
    assert (
        context.persona_reads
        == [
            {
                "umo": "custom:FriendMessage:123",
                "conversation_persona_id": "gentle",
                "platform_name": "aiocqhttp",
                "provider_settings": {"enable": True},
            }
        ]
        * 3
    )
    assert "PRIVATE HISTORY" not in repr(context.prompts)
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
    assert result.status == "blocked"  # Deadline expired before entering transport.


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
    result = await AlertDelivery(
        context,
        session_enabled=context.session_enabled,
        session_llm_enabled=context.session_llm_enabled,
    ).deliver(
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


@run_async
@pytest.mark.parametrize(
    "config",
    [
        {
            "provider_settings": {"enable": False},
            "agent_runner": {"runner_type": "local"},
        },
        {
            "provider_settings": {"enable": True},
            "agent_runner": {"runner_type": "dify"},
        },
        {
            "provider_settings": {"enable": True},
            "agent_runner": {"runner_type": "coze"},
        },
        {"provider_settings": {"enable": True}},
    ],
)
async def test_target_disabled_ai_or_nonlocal_runner_never_resolves_fallback_model(
    config,
):
    context = FakeContext()
    context.config = config
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:GroupMessage:scope_123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert result.status == "submitted" and "固定提醒" in result.message
    assert not context.resolved and not context.prompts and not context.persona_reads
    assert context.sent[0][1][1] == format_alert_facts((fact(),))
    assert all(umo == "custom:GroupMessage:scope_123" for umo in context.config_reads)


@run_async
@pytest.mark.parametrize("state", [False, 1, "true", None])
async def test_session_ai_switch_requires_exact_true_and_uses_fixed_text(state):
    context = FakeContext()
    context.session_ai_on = state
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert result.status == "submitted" and not context.prompts and not context.resolved
    assert context.sent[0][1][1] == format_alert_facts((fact(),))


@run_async
@pytest.mark.parametrize("state", [False, 1, "true", None])
async def test_full_session_switch_blocks_all_transports_and_reservations(state):
    context = FakeContext()
    context.session_on = state
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: pytest.fail("must not reserve"),
    )
    assert result.status == "blocked" and not context.sent and not context.prompts


@run_async
async def test_full_session_switch_rechecked_after_llm_before_reservation():
    context = FakeContext()

    async def generate(**kwargs):
        context.session_on = False
        return SimpleNamespace(completion_text="温馨提醒：请及时检查账户额度。")

    context.llm_generate = generate
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: pytest.fail("must not reserve"),
    )
    assert result.status == "blocked" and not context.sent
    assert len(context.session_checks) >= 2


@run_async
async def test_missing_or_failing_session_callbacks_do_not_allow_hidden_bypass():
    context = FakeContext()

    async def failure(umo):
        raise RuntimeError("private callback detail")

    for callback in (None, failure):
        result = await delivery(context, session_enabled=callback).deliver(
            BalanceAlertTarget("custom:FriendMessage:123"),
            (fact(),),
            BalanceAlertLLM(False),
            active=lambda: True,
            reserve=lambda: pytest.fail("must not reserve"),
        )
        assert result.status == "blocked" and "private callback" not in repr(result)
    assert not context.sent
    for callback in (None, failure):
        result = await delivery(context, session_llm_enabled=callback).deliver(
            BalanceAlertTarget("custom:FriendMessage:123"),
            (fact(),),
            BalanceAlertLLM(),
            active=lambda: True,
            reserve=lambda: True,
        )
        assert result.status == "submitted" and not context.prompts
        assert context.sent[-1][1][1] == format_alert_facts((fact(),))


@run_async
async def test_no_current_conversation_never_creates_or_reads_one():
    context = FakeContext(text="温馨提醒：请及时检查账户额度。")
    context.current_id = None
    await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert context.conversation_reads == [("current", "custom:FriendMessage:123")] * 3
    assert context.persona_reads[0]["conversation_persona_id"] is None
    assert context.prompts[0]["contexts"] == [] and context.prompts[0]["tools"] is None


@run_async
@pytest.mark.parametrize(
    "selected,expected_llm",
    [
        (("[%None]", None, None, False), True),
        (("_chatui_default_", None, None, True), False),
        (("deleted-persona", None, None, False), False),
    ],
)
async def test_resolver_none_persona_and_webchat_special_are_respected(
    selected, expected_llm
):
    context = FakeContext(text="温馨提醒：请及时检查账户额度。")
    context.selected_persona = selected
    context.conversation_persona_id = "[%None]"
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert result.status == "submitted" and bool(context.prompts) is expected_llm
    assert context.persona_reads[0]["conversation_persona_id"] == "[%None]"
    if expected_llm:
        assert "Speak gently." not in context.prompts[0]["system_prompt"]


@run_async
@pytest.mark.parametrize(
    "stage",
    [
        "get_current_chat_provider_id",
        "current_conversation",
        "conversation",
        "persona",
        "llm_generate",
    ],
)
async def test_revocation_after_each_host_await_never_sends(stage):
    context = FakeContext(text="温馨提醒：请及时检查账户额度。")
    active = [True]
    original = getattr(context, stage)

    async def revoke(*args, **kwargs):
        result = await original(*args, **kwargs)
        active[0] = False
        return result

    setattr(context, stage, revoke)
    context.conversation_manager = SimpleNamespace(
        get_curr_conversation_id=context.current_conversation,
        get_conversation=context.conversation,
    )
    context.persona_manager = SimpleNamespace(resolve_selected_persona=context.persona)
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: active[0],
        reserve=lambda: pytest.fail("must not reserve"),
    )
    assert result.status == "cancelled" and not context.sent


@run_async
async def test_sdk_suppressing_cancellation_cannot_continue_to_late_model_call():
    context = FakeContext()
    entered, cancelled, release, finished = (asyncio.Event() for _ in range(4))

    async def resolve(umo):
        entered.set()
        try:
            await asyncio.Future()
        except asyncio.CancelledError:
            cancelled.set()
            await release.wait()
        finished.set()
        return "fake-model"

    context.get_current_chat_provider_id = resolve
    task = asyncio.create_task(
        delivery(context).deliver(
            BalanceAlertTarget("custom:FriendMessage:123"),
            (fact(),),
            BalanceAlertLLM(),
            active=lambda: True,
            reserve=lambda: pytest.fail("must not reserve"),
        )
    )
    await entered.wait()
    task.cancel()
    await asyncio.gather(task, return_exceptions=True)
    await cancelled.wait()
    release.set()
    await finished.wait()
    await asyncio.sleep(0)
    assert not context.conversation_reads and not context.prompts and not context.sent


@run_async
async def test_model_and_persona_are_resolved_independently_for_each_exact_target():
    context = FakeContext(text="温馨提醒：请及时检查账户额度。")

    async def provider(umo):
        context.resolved.append(umo)
        return "model-" + umo

    async def current(umo):
        return "conversation-" + umo

    async def conv(umo, cid, *, create_if_not_exists):
        assert cid == "conversation-" + umo and create_if_not_exists is False
        return SimpleNamespace(persona_id="persona-" + umo)

    async def persona(**kwargs):
        assert kwargs["conversation_persona_id"] == "persona-" + kwargs["umo"]
        return (
            kwargs["conversation_persona_id"],
            {"prompt": "Tone " + kwargs["conversation_persona_id"]},
            None,
            False,
        )

    context.get_current_chat_provider_id = provider
    context.conversation_manager = SimpleNamespace(
        get_curr_conversation_id=current, get_conversation=conv
    )
    context.persona_manager = SimpleNamespace(resolve_selected_persona=persona)
    targets = ("custom:GroupMessage:sender_123", "custom:GroupMessage:other_123")
    for umo in targets:
        await delivery(context).deliver(
            BalanceAlertTarget(umo),
            (fact(),),
            BalanceAlertLLM(),
            active=lambda: True,
            reserve=lambda: True,
        )
    assert [p["chat_provider_id"] for p in context.prompts] == [
        "model-" + u for u in targets
    ]
    for umo, prompt in zip(targets, context.prompts, strict=True):
        assert "Tone persona-" + umo in prompt["system_prompt"]
        assert prompt["contexts"] == [] and prompt["tools"] is None


@run_async
@pytest.mark.parametrize(
    "change",
    ["model", "persona_id", "persona_prompt", "ai_off", "runner", "full_session"],
)
async def test_host_settings_changed_during_generation_never_send_stale_hint(change):
    context = FakeContext(text="温馨提醒：请及时检查账户额度。")
    old_generate = context.llm_generate

    async def generate(**kwargs):
        result = await old_generate(**kwargs)
        if change == "model":

            async def changed(umo):
                return "new-model"

            context.get_current_chat_provider_id = changed
        elif change == "persona_id":
            context.selected_persona = (
                "new-persona",
                {"prompt": "Speak gently."},
                None,
                False,
            )
        elif change == "persona_prompt":
            context.selected_persona = (
                "gentle",
                {"prompt": "A different personality."},
                None,
                False,
            )
        elif change == "ai_off":
            context.session_ai_on = False
        elif change == "runner":
            context.config["agent_runner"]["runner_type"] = "dify"
        elif change == "full_session":
            context.session_on = False
        return result

    context.llm_generate = generate
    reservations = []
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: reservations.append(True) or True,
    )
    assert len(context.prompts) == 1
    if change == "full_session":
        assert result.status == "blocked" and not context.sent and not reservations
    else:
        assert result.status == "submitted" and "固定提醒" in result.message
        assert context.sent[0][1][1] == format_alert_facts((fact(),))


@run_async
@pytest.mark.parametrize("switch", ["session_on", "session_ai_on"])
async def test_session_disabled_during_persona_await_does_not_call_model(switch):
    context = FakeContext()
    original = context.persona

    async def resolve(**kwargs):
        result = await original(**kwargs)
        setattr(context, switch, False)
        return result

    context.persona_manager.resolve_selected_persona = resolve
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: switch != "session_on",
    )
    assert not context.prompts
    if switch == "session_on":
        assert result.status == "blocked" and not context.sent
    else:
        assert result.status == "submitted"
        assert context.sent[0][1][1] == format_alert_facts((fact(),))


@run_async
async def test_controlled_reason_codes_preserve_status_and_never_expose_free_text():
    context = FakeContext()
    target = BalanceAlertTarget("custom:FriendMessage:123")
    context.session_on = False
    blocked = await delivery(context).deliver(
        target,
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: pytest.fail("must not reserve"),
    )
    assert blocked.status == "blocked" and blocked.reason_code == "session_disabled"
    context.session_on = True
    context.session_ai_on = False
    fixed = await delivery(context).deliver(
        target, (fact(),), BalanceAlertLLM(), active=lambda: True, reserve=lambda: True
    )
    assert fixed.status == "submitted" and fixed.reason_code == "fixed_hint"
    disabled = await delivery(context).deliver(
        target,
        (fact(),),
        BalanceAlertLLM(False),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert disabled.status == "submitted" and disabled.reason_code == ""
    context.session_ai_on = True
    context.text = "温馨提醒：请及时检查账户额度。"
    hinted = await delivery(context).deliver(
        target, (fact(),), BalanceAlertLLM(), active=lambda: True, reserve=lambda: True
    )
    assert hinted.status == "submitted" and hinted.reason_code == ""
    context.config["agent_runner"]["runner_type"] = "dify"
    external = await delivery(context).deliver(
        target, (fact(),), BalanceAlertLLM(), active=lambda: True, reserve=lambda: True
    )
    assert external.status == "submitted" and external.reason_code == "fixed_hint"


def test_delivery_reason_code_is_closed_vocabulary():
    assert DeliveryResult("submitted", "safe message").reason_code == ""
    with pytest.raises(ValueError, match="unknown delivery reason code"):
        DeliveryResult("submitted", "safe message", "private persona content")
