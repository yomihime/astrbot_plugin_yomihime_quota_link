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


@pytest.mark.parametrize(
    "prose",
    [
        "有 2 个账户需要留意，有空记得充值。",
        "有两个账户需要留意。",
        "這次有兩個帳戶需要留意，有空再儲值就好。",
        "These two accounts need attention. Top up when you have a moment.",
        "2つのアカウントをお知らせします。時間があるときにチャージを検討してね。",
    ],
)
def test_verified_account_counts_and_optional_topups_keep_persona(prose):
    row = "<yql.account>的<yql.metric>是<yql.balance>，提醒阈值是<yql.threshold>。"
    template = prose + "\n\n" + row.replace("<yql.", "<yql.1.")
    template += "\n\n" + row.replace("<yql.", "<yql.2.")
    result = render_notice(template, (FIRST, SECOND))
    assert result.startswith(prose)
    for facts in (FIRST, SECOND):
        assert all(value in result for value in facts.values())


@pytest.mark.parametrize(
    "prose",
    [
        "有 2 个账户需要留意。",
        "有 1.1 个账户需要留意。",
        "有 -1 个账户需要留意。",
        "There are -1 accounts.",
        "有十二个账户需要留意。",
        "Three accounts need attention.",
        "這次有兩個帳戶。",
        "2つのアカウントです。",
        "充值已成功。",
        "我已经帮你充值。",
        "必须充值才能继续使用。",
        "不充值就停服。",
        "有空记得充值50。",
        "有空记得充值大约50。",
        "Top up 50 when you have time.",
        "Consider topping up about fifty.",
        "有空充值五十就好。",
        "One hundred and one accounts need attention.",
        "Eleven accounts need attention.",
        "Twenty-one accounts need attention.",
        "One hundred accounts need attention.",
        "The balance is above the limit.",
        "The account is empty.",
        "999USD left.",
        "999usd left.",
        "还有999ZAR。",
        "请在控制台完成付款后继续使用。",
        "刚刚替您完成了充值。",
        "先去充值页面，选择支付方式并确认付款。",
        "Top up your account before continuing.",
        "Payment successful.",
        "I topped up your account.",
        "You must pay to continue.",
        "Your balance is 9.",
        "余额是９。",
        "还剩七块。",
        "还剩7。",
        "只剩7。",
        "有空充值100元。",
    ],
)
def test_wrong_counts_payment_claims_and_invented_amounts_still_fall_back(prose):
    assert render_notice(prose + "\n\n" + NOTICE, (FIRST,)) == ""


@pytest.mark.parametrize(
    "prose",
    [
        "有 1 个账户需要留意，有空记得充值。",
        "One account needs attention. You can consider topping up later.",
        "Take 2 minutes when you have time.",
        "先喝2口水，回头看看吧。",
        "Pay attention when you have a moment.",
        "For the account above, take a look when you have time.",
        "You can check when your schedule is empty.",
        "已提醒你，有空记得充值。",
        "Top up in 2 minutes if you like.",
        "有空花2分钟看看充值页面。",
        "有空充值一下。",
    ],
)
def test_optional_suggestions_and_nonfinancial_numbers_are_not_banned(prose):
    assert render_notice(prose + "\n\n" + NOTICE, (FIRST,)).startswith(prose)


@pytest.mark.parametrize(
    "template",
    [
        "<yql.account> is empty. Its <yql.metric> is <yql.balance>; threshold is <yql.threshold>.",
        "<yql.account>: <yql.metric> is completely empty at <yql.balance>; threshold is <yql.threshold>.",
        "<yql.account> is now entirely empty. Its <yql.metric> is <yql.balance>; threshold is <yql.threshold>.",
    ],
)
def test_empty_claim_retains_account_subject_and_metric_adverbs(template):
    row = {**FIRST, "balance": "7 CNY", "threshold": "10 CNY"}
    assert render_notice(template, (row,)) == ""
