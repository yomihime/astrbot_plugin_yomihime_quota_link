import pytest

from quota_link.alert_notice import render_notice, template_prompt

FIRST = {
    "account": "Test wallet",
    "metric": "available balance",
    "balance": "-7.00001 CNY",
    "threshold": "10.25 CNY",
}
SECOND = {
    "account": "Test credits",
    "metric": "site credits",
    "balance": "1E-300 site_credit",
    "threshold": "0.0000001 site_credit",
}
NOTICE = (
    "Hey, a small heads-up!\n\n"
    "<yql.account>'s <yql.metric> reached its alert level. "
    "The limit was <yql.threshold> and it's now <yql.balance>. "
    "Take a peek when you have a moment. 🐈"
)


def test_prompt_describes_whole_notice_and_only_exposes_anonymous_slots():
    one = template_prompt(1)
    many = template_prompt(2)
    assert "complete proactive low-quota notice" in one
    assert "already include their unit" in one
    assert "blank line" in many
    assert "fell below" in many
    for field in FIRST:
        assert one.count(f"<yql.{field}>") == 1
        assert many.count(f"<yql.1.{field}>") == 1
        assert many.count(f"<yql.2.{field}>") == 1
        assert FIRST[field] not in many
        assert SECOND[field] not in many
    assert not template_prompt(0)
    assert not template_prompt(100_000)


def test_single_notice_preserves_persona_prose_and_exact_values():
    assert render_notice(NOTICE, (FIRST,)) == (
        "Hey, a small heads-up!\n\n"
        "Test wallet's available balance reached its alert level. "
        "The limit was 10.25 CNY and it's now -7.00001 CNY. "
        "Take a peek when you have a moment. 🐈"
    )


@pytest.mark.parametrize(
    "notice",
    [
        "給你提個醒。<yql.account>的<yql.metric>現在是<yql.balance>，已到提醒範圍，門檻為<yql.threshold>喔。",
        "<yql.account>の<yql.metric>は<yql.balance>。通知の目安は<yql.threshold>だよ。そっとお知らせします。",
        "给你递张便签。<yql.account>的<yql.metric>是<yql.balance>，提醒线设在<yql.threshold>。记得看一眼哦。",
        "Pay attention, friend. <yql.account> has <yql.metric> of <yql.balance>. "
        "Your reminder is set for <yql.threshold>. 🐈‍⬛",
    ],
)
def test_common_persona_prose_can_carry_all_facts_in_each_locale(notice):
    rendered = render_notice(notice, (FIRST,))
    for field, value in FIRST.items():
        notice = notice.replace(f"<yql.{field}>", value)
    assert rendered == notice


def test_multiple_accounts_bind_independently_even_when_paragraphs_reorder():
    row = "给你递张便签。<yql.account>的<yql.metric>是<yql.balance>，提醒线设在<yql.threshold>。"
    notice = (
        "记得看一眼哦。\r\n\r\n"
        + row.replace("<yql.", "<yql.2.")
        + "\r\n \r\n"
        + row.replace("<yql.", "<yql.1.")
    )
    assert render_notice(notice, (FIRST, SECOND)) == (
        "记得看一眼哦。\n\n"
        "给你递张便签。Test credits的site credits是1E-300 site_credit，提醒线设在0.0000001 site_credit。"
        "\n\n"
        "给你递张便签。Test wallet的available balance是-7.00001 CNY，提醒线设在10.25 CNY。"
    )


@pytest.mark.parametrize(
    "account",
    [r"<yql.balance> \\g<0> [CQ:at,qq=all] @everyone", "https://wallet.example"],
)
def test_fact_data_is_literal_and_never_reparsed_as_placeholders_or_commands(account):
    notice = render_notice(NOTICE, ({**FIRST, "account": account},))
    assert notice.count(account) == 1
    assert notice.count(FIRST["balance"]) == 1


@pytest.mark.parametrize(
    "account_expression",
    [
        "www.<yql.account>.com",
        "<yql.account>.com",
        "www.<yql.account>．com",
        "<yql.account>://example.invalid",
    ],
)
def test_rejects_templates_that_use_account_slot_to_assemble_a_url(account_expression):
    template = (
        f"For {account_expression}, <yql.metric> is <yql.balance>. "
        "The alert threshold is <yql.threshold>."
    )
    assert render_notice(template, ({**FIRST, "account": "testwallet"},)) == ""


def test_excess_whitespace_in_template_is_compacted_before_fact_substitution():
    padded = NOTICE.replace("heads-up!\n\n", "heads-up!\n\t\n\n").replace(
        "reached its", "reached" + " " * 3000 + "its"
    )
    facts = ({**FIRST, "account": "Test   wallet"},)
    assert render_notice(padded, facts) == render_notice(NOTICE, facts)
    assert "Test   wallet" in render_notice(padded, facts)


@pytest.mark.parametrize(
    "notice",
    [
        None,
        "",
        "x" * 4097 + NOTICE,
        NOTICE.replace("<yql.balance>", ""),
        NOTICE.replace("<yql.metric>", "<yql.account>"),
        NOTICE.replace("<yql.account>", "<yql.1.account>"),
        NOTICE.replace("<yql.account>", "＜yql.account＞"),
        NOTICE + " <yql.provider>",
        NOTICE + " yql.balance",
        NOTICE + " <yql.account>",
        NOTICE.replace("its alert level.", "its alert level.\n\n"),
        "<yql.account> <yql.metric> <yql.balance> <yql.threshold>",
        "<yql.account> <yql.metric> <yql.balance> <yql.threshold> Hi.",
        "<yql.account> <yql.metric>: <yql.threshold>，<yql.balance>。",
    ],
)
def test_invalid_templates_request_plain_fallback(notice):
    assert render_notice(notice, (FIRST,)) == ""


def test_mixed_rows_and_one_paragraph_for_two_accounts_request_fallback():
    row = "<yql.account>的<yql.metric>是<yql.balance>，提醒线设在<yql.threshold>。"
    left = row.replace("<yql.", "<yql.1.")
    right = row.replace("<yql.", "<yql.2.")
    mixed_left = left.replace("<yql.1.balance>", "<yql.2.balance>")
    mixed_right = right.replace("<yql.2.balance>", "<yql.1.balance>")
    assert render_notice(f"{mixed_left}\n\n{mixed_right}", (FIRST, SECOND)) == ""
    assert render_notice(f"{left}\n{right}", (FIRST, SECOND)) == ""
    assert render_notice(f"{left}\n\n{left}", (FIRST, SECOND)) == ""


@pytest.mark.parametrize(
    "claim",
    [
        "The balance is ０.７ dollars.",
        "The balance is twenty.",
        "余额还有九十九积分。",
        "你还剩五块。",
        "账户已耗尽。",
        "目前這個帳戶已經沒有餘額了。",
        "クレジットがありません。",
        "The account has been suspended.",
        "The service is operational.",
        "服務已停用。",
        "Your subscription expired.",
        "The account is canceled.",
        "订阅已经过期。",
        "你的訂閱到期了。",
        "サブスクリプションの有効期限が切れました。",
        "Payment successful.",
        "I've paid your invoice.",
        "我已經幫你調整門檻。",
        "The unit is USD.",
        "Your balance exceeds the limit.",
        "額度高於門檻。",
        "しきい値を上回りました。",
        "See https://example.invalid.",
        "Go to alerts.example.",
        "［CQ:at,qq=all］",
        "[C\u200dQ:at,qq=all]",
        "＠everyone",
        "<tool_call>update balance</tool_call>",
        "[check](javascript:alert('synthetic'))",
        "&#64;everyone",
        "控制\x00字符",
        "控制\u202e字符",
        "分隔\u2028内容",
    ],
)
def test_rejects_unsafe_prose_even_with_a_complete_template(claim):
    assert render_notice(f"{claim}\n\n{NOTICE}", (FIRST,)) == ""


@pytest.mark.parametrize(
    "suffix",
    [
        " USD",
        " THB",
        " thb",
        " XOF",
        " (XDR)",
        " (credits)",
        " 元",
        "ポイント",
        "%",
        " ₽",
    ],
)
def test_rejects_a_second_unit_after_value_slot(suffix):
    for field in ("balance", "threshold"):
        token = f"<yql.{field}>"
        assert render_notice(NOTICE.replace(token, token + suffix), (FIRST,)) == ""


@pytest.mark.parametrize(
    "notice",
    [
        "Heads up! <yql.account> has a <yql.metric> of <yql.threshold> "
        "with an alert limit of <yql.balance>.",
        "The threshold is <yql.balance> for <yql.account>. The <yql.metric> is <yql.threshold>.",
        "<yql.account>的<yql.metric>是<yql.threshold>，提醒阈值是<yql.balance>。",
        "<yql.account>的提醒門檻是<yql.balance>，<yql.metric>現在是<yql.threshold>。",
        "<yql.account>の<yql.metric>は<yql.threshold>。しきい値は<yql.balance>だよ。",
        "The <yql.metric> of <yql.account> is <yql.balance>. It is exactly <yql.threshold> now.",
        "<yql.account>の<yql.metric>は<yql.balance>、ちょうど<yql.threshold>だよ。",
        "<yql.account>的<yql.metric>目前是<yql.balance>，等于<yql.threshold>。",
        "Heads up, <yql.account> has <yql.metric>: <yql.balance> = <yql.threshold>.",
        "Take a look at <yql.account>'s <yql.metric>: <yql.balance> is at <yql.threshold>.",
    ],
)
def test_wrong_value_roles_request_fallback_even_with_every_slot(notice):
    assert render_notice(notice, (FIRST,)) == ""


@pytest.mark.parametrize(
    "notice",
    [
        "The warning level is <yql.threshold> for <yql.account>. The <yql.metric> is <yql.balance>.",
        "<yql.account>的提醒阈值是<yql.threshold>，<yql.metric>现在是<yql.balance>，留意一下喔。",
        "提醒門檻為<yql.threshold>。<yql.account>的<yql.metric>是<yql.balance>，記得看看喔。",
        "通知の目安は<yql.threshold>。<yql.account>の<yql.metric>は<yql.balance>です。",
        "For <yql.account>, <yql.metric> is <yql.balance> ≤ <yql.threshold>. Take a peek.",
    ],
)
def test_threshold_first_is_valid_if_value_roles_are_correct(notice):
    rendered = render_notice(notice, (FIRST,))
    for field, value in FIRST.items():
        notice = notice.replace(f"<yql.{field}>", value)
    assert rendered == notice


@pytest.mark.parametrize("operator", ["≤", "≦", "⩽"])
@pytest.mark.parametrize("balance", ["7 CNY", "10 CNY"])
def test_comparator_only_accepts_balance_at_or_below_threshold(operator, balance):
    row = {**FIRST, "balance": balance, "threshold": "10 CNY"}
    inverted = (
        "Heads up! For <yql.account>, the alert limit is "
        f"<yql.threshold> {operator} <yql.balance> in <yql.metric>."
    )
    valid = (
        f"For <yql.account>, <yql.metric> is <yql.balance> {operator} <yql.threshold>. "
        "Take a peek."
    )
    assert render_notice(inverted, (row,)) == ""
    assert render_notice(valid, (row,)) == (
        f"For Test wallet, available balance is {balance} {operator} 10 CNY. "
        "Take a peek."
    )


def test_rejects_missing_invalid_or_oversized_local_facts():
    assert render_notice(NOTICE, ()) == ""
    assert render_notice(NOTICE, ({"account": "test"},)) == ""
    assert render_notice(NOTICE, ({**FIRST, "account": "test\x00"},)) == ""
    assert render_notice(NOTICE, ({**FIRST, "account": "test\n\nother"},)) == ""
    assert render_notice(NOTICE, ({**FIRST, "account": "x" * 4096},)) == ""
