"""Offline personality, factual-boundary and actionable delivery regressions."""

from dataclasses import replace
from decimal import Decimal
from types import SimpleNamespace

import pytest
from test_alert_delivery import FakeContext, delivery, fact, run_async
from test_alert_runtime import engine, settings

from quota_link.alert_config import BalanceAlertLLM, BalanceAlertTarget
from quota_link.alert_delivery import (
    BLOCKED_DETAILS,
    DELIVERY_DETAILS,
    DeliveryResult,
    format_alert_facts,
)


@run_async
@pytest.mark.parametrize(
    "introduction",
    [
        "主人，额度的小铃铛响啦～抽空看看下面的明细，我替你惦记着呢 🐟",
        "舰长，补给观察员来报到。请留意下方额度，接下来的航程咱们从容安排。",
        "再提醒你 1 次：忙归忙，也别忘了照看额度呀！",
        "给你提个醒，先花1分钟看一眼账户吧",
        "给你一个轻轻的提醒 👩‍💻：额度的事别忘啦。\n有空看看下方明细吧。",
        "Heads-up, captain! Let's keep an eye on the details below. 💙",
        "I've paid attention, captain! Please keep an eye on the details below.",
        "额度一低，我就赶来提醒你啦～请看看下面的明细。",
        "关于额度一事，记得看看下方明细哦～",
        "主人，额度一定要多留意呀。",
        "把额度一栏瞄一眼就好，别太劳累啦。",
        "主人，可查看控制台，按需处理额度就好～",
        "Take one minute to check the balance details, captain!",
        "主人，咱们一块看看下方明细吧。",
        "十分感谢你抽空看下额度，别太劳累啦。",
    ],
)
async def test_free_personality_prose_preserves_the_exact_program_owned_fact_block(
    introduction,
):
    context = FakeContext(text=introduction)
    facts = (
        replace(fact(), amount=Decimal("-0.000000000000000001")),
        replace(
            fact(),
            account_id="other",
            display_name="Other synthetic account",
            metric="credit",
            amount=Decimal("0"),
            threshold=Decimal("2.000000000000000001"),
            unit="credit",
        ),
    )
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:GroupMessage:123", ("456",)),
        facts,
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert result.status == "submitted" and result.reason_code == ""
    mentions, text = context.sent[0][1]
    assert mentions == ("456",)
    assert text.splitlines()[1] == " ".join(introduction.split())
    assert text.splitlines()[2:] == format_alert_facts(facts).splitlines()[1:]
    request = context.prompts[0]
    assert request["contexts"] == [] and request["tools"] is None
    assert request["chat_provider_id"] == "fake-model"
    assert "Speak gently." in request["system_prompt"]
    assert "只能原样" not in request["prompt"]
    for private in ("Other synthetic account", "-0.000000000000000001", "456"):
        assert private not in repr(request)


@run_async
@pytest.mark.parametrize(
    "introduction",
    [
        "余额还有９９９９元，放心用吧。",
        "账户余额只有一百元啦。",
        "Your balance is 999 USD.",
        "账户余额为负，请立即充值以免停服。",
        "账户余额为负。",
        "可用余额变成负值了。",
        "额度为零了。",
        "余额小于零。",
        "额度已耗光，服务已停用。",
        "额度已经耗尽。",
        "服务已停用。",
        "Your remaining balance is just 999 dollars.",
        "Your balance is now 999 dollars.",
        "Your balance is negative.",
        "The balance has been exhausted.",
        "The balance is one hundred.",
        "The account is suspended.",
        "你的账户已欠费，请留意下方明细。",
        "Your account is overdrawn. Please check the details below.",
        "999 dollars left.",
        "USD 999.",
        "999USD left.",
        "999usd left.",
        "还有999ZAR。",
        "one hundred dollars remaining.",
        "请在控制台完成付款后继续使用。",
        "主人，你的余额仅剩 999，请及时充值。",
        "刚刚替您完成了充值。",
        "先去充值页面，选择支付方式并确认付款。",
        "Top up your account before continuing.",
        "I've paid your invoice.",
        "The currency is USD.",
        "Currency: USD.",
        "币种为美元。",
        "主人，余额只剩五块啦。",
        "主人，你还剩五块。",
        "账户余额只剩两毛钱啦。",
        "充值成功，已经帮你处理好了。",
        "我已为你充值，不必担心。",
        "Payment successful!",
        "I've recharged your account.",
        "点击 https://pay.example.invalid 充值。",
        "充值地址是 pay.example.invalid。",
        "[充值](javascript:alert('synthetic'))",
        "［CQ:at,qq=all］",
        '<tool_call name="charge">synthetic</tool_call>',
        '{"tool_calls": [{"name": "charge"}]}',
        "@everyone 请看这里",
        "先看下额度\x00秘密内容",
        "请看额度\u202e反向覆盖",
        "额" * 161,
    ],
)
async def test_model_cannot_supply_financial_claims_links_or_active_payloads(
    introduction,
):
    context = FakeContext(text=introduction)
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:GroupMessage:123", ("456",)),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert result.status == "submitted" and result.reason_code == "fixed_hint"
    assert context.sent[0][1] == (("456",), format_alert_facts((fact(),)))
    assert introduction not in repr(result)


@run_async
@pytest.mark.parametrize(
    "extra",
    [
        {"tools_call_name": ["charge"]},
        {"tools_call_args": [{"account": "private synthetic"}]},
        {"tool_calls": [{"name": "charge"}]},
        {"role": "tool"},
        {"role": "err"},
    ],
)
async def test_tool_or_error_response_is_not_interpreted_even_with_safe_text(extra):
    context = FakeContext()

    async def generate(**kwargs):
        context.prompts.append(kwargs)
        return SimpleNamespace(completion_text="来提醒你留意额度啦～", **extra)

    context.llm_generate = generate
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert result.reason_code == "fixed_hint"
    assert context.sent[0][1][1] == format_alert_facts((fact(),))
    assert len(context.prompts) == len(context.sent) == 1


@run_async
@pytest.mark.parametrize("code", list(BLOCKED_DETAILS))
async def test_each_blocked_reason_is_specific_safe_and_never_reserves(code):
    context = FakeContext()
    target = BalanceAlertTarget("custom:GroupMessage:123", ("456",))
    kwargs = {}
    if code == "target_invalid":
        target = BalanceAlertTarget("private malformed target")
    elif code == "platform_not_found":
        context.adapter = None
    elif code == "platform_unavailable":

        def fail(_):
            raise RuntimeError("private adapter token and endpoint")

        context.get_platform_inst = fail
    elif code == "platform_unsupported":
        context.adapter = "qq_official"
    elif code == "mention_unsupported":
        context.adapter = "telegram"
    elif code == "mention_invalid":
        target = BalanceAlertTarget("custom:GroupMessage:123", ("all",))
    elif code == "transport_unavailable":
        context.send_message = None
    elif code == "message_components_unavailable":
        transport = delivery(context)
        transport.component_factory = None
    elif code == "session_disabled":
        context.session_on = False
    elif code == "session_check_failed":

        async def fail(_):
            raise RuntimeError("private session token")

        kwargs["session_enabled"] = fail
    if code != "message_components_unavailable":
        transport = delivery(context, **kwargs)
    result = await transport.deliver(
        target,
        (fact(),),
        BalanceAlertLLM(False),
        active=lambda: True,
        reserve=lambda: pytest.fail("blocked deliveries must not reserve"),
    )
    assert result == DeliveryResult("blocked", BLOCKED_DETAILS[code], code)
    assert not context.sent and not context.prompts
    assert "private" not in repr(result) and target.umo not in result.message


@run_async
async def test_late_platform_disappearance_keeps_specific_blocked_detail():
    context = FakeContext()

    async def generate(**kwargs):
        context.adapter = None
        return SimpleNamespace(completion_text="主人，留意额度哦～")

    context.llm_generate = generate
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:GroupMessage:123", ("456",)),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: pytest.fail("must not reserve"),
    )
    assert result.status == "blocked" and result.reason_code == "platform_not_found"
    assert not context.sent


@run_async
@pytest.mark.parametrize(
    "change",
    ["ai_off", "config_ai_off", "persona", "provider", "runner", "session_off"],
)
@pytest.mark.parametrize("change_at", [4, 5])
async def test_final_session_await_cannot_leave_a_stale_persona_introduction(
    change, change_at
):
    context = FakeContext(text="主人，我来轻轻敲个门～请看看下方的明细。")
    original = context.session_enabled

    async def final_permission(umo):
        result = await original(umo)
        # Initial permission, pre-generation resolution, post-generation
        # resolution, then the final permission await inside send().
        if len(context.session_checks) == change_at:
            if change == "ai_off":
                context.session_ai_on = False
            elif change == "config_ai_off":
                context.config["provider_settings"]["enable"] = False
            elif change == "persona":
                context.selected_persona = (
                    "new",
                    {"prompt": "Different."},
                    None,
                    False,
                )
            elif change == "provider":

                async def new_provider(_):
                    return "new-model"

                context.get_current_chat_provider_id = new_provider
            elif change == "runner":
                context.config["agent_runner"]["runner_type"] = "remote"
            else:
                context.session_on = False
        # This callback must report the switch it just observed; a callback
        # returning a stale True cannot provide an atomic host-state guarantee.
        return context.session_on if change == "session_off" else result

    context.session_enabled = final_permission
    reservations = []
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: reservations.append(True) or True,
    )
    assert len(context.prompts) == 1
    if change == "session_off":
        assert result.status == "blocked" and result.reason_code == "session_disabled"
        assert not context.sent and not reservations
    else:
        assert result.status == "submitted" and result.reason_code == "fixed_hint"
        assert context.sent[0][1][1] == format_alert_facts((fact(),))
        assert len(context.sent) == len(reservations) == 1


@run_async
@pytest.mark.parametrize(
    "change", ["none", "config_at_persona", "session_at_persona", "config_at_gate"]
)
async def test_final_routing_keeps_one_last_session_hard_gate_then_sync_config(
    change,
):
    context = FakeContext(text="主人，记得看看下面的明细哦～")
    events = []

    def trace(name, method):
        async def wrapped(*args, **kwargs):
            events.append(name)
            result = await method(*args, **kwargs)
            if (
                name == "persona"
                and events.count("persona") == 3
                and change in {"config_at_persona", "session_at_persona"}
            ):
                if change == "session_at_persona":
                    context.session_on = False
                else:
                    context.config["provider_settings"]["enable"] = False
            if (
                name == "session"
                and events.count("persona") == 3
                and change == "config_at_gate"
            ):
                context.config["provider_settings"]["enable"] = False
            return result

        return wrapped

    context.session_enabled = trace("session", context.session_enabled)
    context.session_llm_enabled = trace("ai", context.session_llm_enabled)
    context.get_current_chat_provider_id = trace(
        "provider", context.get_current_chat_provider_id
    )
    context.persona_manager.resolve_selected_persona = trace("persona", context.persona)
    context.send_message = trace("send", context.send_message)
    result = await delivery(context).deliver(
        BalanceAlertTarget("custom:FriendMessage:123"),
        (fact(),),
        BalanceAlertLLM(),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert len(context.prompts) == 1
    final_provider = max(
        index for index, event in enumerate(events) if event == "provider"
    )
    if change == "session_at_persona":
        assert result.status == "blocked" and result.reason_code == "session_disabled"
        assert not context.sent
        assert events[final_provider:] == ["provider", "persona", "session"]
    elif change != "none":
        assert result.status == "submitted"
        assert result.reason_code == "fixed_hint"
        assert context.sent[0][1][1] == format_alert_facts((fact(),))
    else:
        assert result.reason_code == ""
        assert events[final_provider:] == ["provider", "persona", "session", "send"]
        assert events[final_provider - 2 : final_provider] == ["session", "ai"]


@run_async
@pytest.mark.parametrize("code", list(BLOCKED_DETAILS))
async def test_runtime_preserves_only_controlled_reason_codes_and_detail(
    tmp_path, code
):
    monitor, _, _, _, _ = engine(tmp_path)

    async def blocked(*args, **kwargs):
        return DeliveryResult("blocked", "private raw status must not leak", code)

    monitor.delivery.deliver = blocked
    await monitor.run_once()
    dto = monitor.status()["accounts"][0]
    assert dto["status"] == "blocked"
    assert dto["detail_code"] == code and dto["detail"] == DELIVERY_DETAILS[code]
    assert "private raw" not in repr(dto)
    await monitor.close()


def test_site_credit_uses_readable_label_without_duplicate_internal_metric():
    text = format_alert_facts(
        (replace(fact(), metric="site_credit", unit="site_credit"),)
    )
    assert "站内额度：-8.25 site_credit" in text
    assert "（site_credit）" not in text and "站点积分" not in text


@run_async
@pytest.mark.parametrize("other", ["submitted", "failed", "unknown", "blocked"])
async def test_mixed_targets_never_hide_failure_behind_one_success(tmp_path, other):
    monitor, config, _, _, _ = engine(tmp_path, config=settings(targets=3))

    async def outcome(target, *args, reserve, **kwargs):
        index = config.balance_alert_targets.index(target)
        if index == 0:
            return DeliveryResult("blocked", "private", "platform_not_found")
        status = "submitted" if index == 1 else other
        if status == "blocked":
            return DeliveryResult(status, "private", "session_disabled")
        assert reserve()
        return DeliveryResult(status, "private")

    monitor.delivery.deliver = outcome
    await monitor.run_once()
    dto = monitor.status()["accounts"][0]
    expected = "blocked" if other in {"submitted", "blocked"} else other
    assert dto["status"] == expected
    expected_code = (
        "session_disabled"
        if other == "blocked"
        else "platform_not_found"
        if other == "submitted"
        else ""
    )
    assert dto["detail_code"] == expected_code
    assert dto["detail"] == DELIVERY_DETAILS.get(expected_code, "")
    assert "private" not in repr(dto)
    await monitor.close()
