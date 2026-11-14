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
    assert "flowing prose, lines or lists" in many
    assert "own paragraph" not in many
    assert "fell below" in many
    for field in FIRST:
        assert one.count(f"<yql.{field}>") == 1
        assert many.count(f"<yql.1.{field}>") == 1
        assert many.count(f"<yql.2.{field}>") == 1
        assert FIRST[field] not in many
        assert SECOND[field] not in many
    assert not template_prompt(0)
    assert "<yql.100.account>" in template_prompt(100)


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
        NOTICE.replace("<yql.balance>", ""),
        NOTICE.replace("<yql.metric>", "<yql.account>"),
        NOTICE.replace("<yql.account>", "<yql.1.account>"),
        NOTICE.replace("<yql.account>", "＜yql.account＞"),
        NOTICE + " <yql.provider>",
        NOTICE + " yql.balance",
        NOTICE + " <yql.account>",
        "<yql.account> <yql.metric> <yql.balance> <yql.threshold>",
        "<yql.account> <yql.metric> <yql.balance> <yql.threshold> Hi.",
        "<yql.account> <yql.metric>: <yql.threshold>，<yql.balance>。",
    ],
)
def test_invalid_templates_request_plain_fallback(notice):
    assert render_notice(notice, (FIRST,)) == ""


def test_mixed_or_duplicate_rows_request_fallback():
    row = "<yql.account>的<yql.metric>是<yql.balance>，提醒线设在<yql.threshold>。"
    left = row.replace("<yql.", "<yql.1.")
    right = row.replace("<yql.", "<yql.2.")
    mixed_left = left.replace("<yql.1.balance>", "<yql.2.balance>")
    mixed_right = right.replace("<yql.2.balance>", "<yql.1.balance>")
    assert render_notice(f"{mixed_left}\n\n{mixed_right}", (FIRST, SECOND)) == ""
    assert render_notice(f"{left}\n\n{left}", (FIRST, SECOND)) == ""


@pytest.mark.parametrize("separator", [" ", "; ", "\n", "\n- ", "\n\n"])
@pytest.mark.parametrize("reverse", [False, True])
def test_multiple_accounts_allow_prose_lines_and_lists_without_required_paragraphs(
    separator, reverse
):
    row = "<yql.account>的<yql.metric>是<yql.balance>，提醒线设在<yql.threshold>。"
    indices = (2, 1) if reverse else (1, 2)
    template = separator.join(row.replace("<yql.", f"<yql.{i}.") for i in indices)
    result = render_notice(template, (FIRST, SECOND))
    expected = template
    for i, facts in enumerate((FIRST, SECOND), 1):
        for field, value in facts.items():
            expected = expected.replace(f"<yql.{i}.{field}>", value)
    assert result == expected


def test_single_account_may_continue_across_paragraphs():
    template = NOTICE.replace("its alert level.", "its alert level.\n\n")
    assert render_notice(template, (FIRST,)).count(FIRST["balance"]) == 1


def test_account_can_be_a_heading_with_facts_on_following_lines():
    template = (
        "<yql.account>\n\n"
        "<yql.metric>: <yql.balance>\n"
        "Threshold: <yql.threshold>\nTake a look when you have time."
    )
    assert render_notice(template, (FIRST,)).startswith(FIRST["account"] + "\n\n")


@pytest.mark.parametrize("field", tuple(FIRST))
@pytest.mark.parametrize("replacement", ["", "<yql.3.{field}>", "<yql.2.{field}>"])
def test_multiple_account_slots_are_complete_unique_and_in_range(field, replacement):
    template = NOTICE.replace("<yql.", "<yql.1.")
    template += " " + NOTICE.replace("<yql.", "<yql.2.")
    template = template.replace(f"<yql.1.{field}>", replacement.format(field=field))
    assert render_notice(template, (FIRST, SECOND)) == ""


def test_multiple_accounts_allow_different_fact_orders_in_one_paragraph():
    template = (
        "The warning level is <yql.2.threshold> for <yql.2.account>. "
        "The <yql.2.metric> is <yql.2.balance>. "
        "<yql.1.account>的<yql.1.metric>是<yql.1.balance>，提醒阈值是<yql.1.threshold>。"
    )
    rendered = render_notice(template, (FIRST, SECOND))
    assert rendered.startswith("The warning level is " + SECOND["threshold"])
    for row in (FIRST, SECOND):
        assert all(value in rendered for value in row.values())


@pytest.mark.parametrize("ordinals", [("一", "二"), ("1", "2")])
@pytest.mark.parametrize("total", [1, 2, 3])
def test_account_ordinals_are_not_confused_with_the_total_count(ordinals, total):
    row = "第{ordinal}个账户 <yql.account>的<yql.metric>是<yql.balance>，提醒阈值为<yql.threshold>。"
    template = " ".join(
        row.format(ordinal=ordinal).replace("<yql.", f"<yql.{i}.")
        for i, ordinal in enumerate(ordinals, 1)
    )
    template += f" 这次提醒涉及 {total} 个账户，有空看看就好。"
    result = render_notice(template, (FIRST, SECOND))
    assert bool(result) == (total == 2)
    if result:
        assert f"第{ordinals[0]}个账户 {FIRST['account']}" in result
        assert f"第{ordinals[1]}个账户 {SECOND['account']}" in result


@pytest.mark.parametrize("ordinal", ["零", "三", "十一", "一百", "1e2", "-1"])
def test_account_ordinals_outside_the_notice_are_rejected(ordinal):
    template = NOTICE.replace("<yql.", "<yql.1.")
    template += " " + NOTICE.replace("<yql.", "<yql.2.")
    assert render_notice(f"第{ordinal}个账户。 {template}", (FIRST, SECOND)) == ""


def test_long_prose_and_literal_local_account_names_are_not_truncated():
    introduction = "A quiet reminder, whenever you have a moment. " * 130
    account = "長い財布の名前・épargne・حساب・" * 220
    template = introduction + "\n\n" + NOTICE
    result = render_notice(template, ({**FIRST, "account": account},))
    assert len(template) > 4096
    assert len(account) > 4096
    assert result.startswith(introduction.rstrip())
    assert account in result
    assert result.endswith("Take a peek when you have a moment. 🐈")


@pytest.mark.parametrize(
    "template",
    [
        "Hola, <yql.account>: <yql.metric> está en <yql.balance>; umbral: <yql.threshold>. Cuando puedas, échale un vistazo.",
        "<yql.account> : <yql.metric> vaut <yql.balance> ; seuil : <yql.threshold>. À regarder tranquillement.",
        "主人，<yql.account>的<yql.metric>是<yql.balance>，提醒阈值为<yql.threshold>。有空看看吧。",
    ],
)
def test_language_and_form_of_address_are_not_prescribed(template):
    facts = {**FIRST, "account": "未知品牌 / Compte inconnu / 未登録アカウント"}
    expected = template
    for field, value in facts.items():
        expected = expected.replace(f"<yql.{field}>", value)
    assert render_notice(template, (facts,)) == expected


@pytest.mark.parametrize("quote", ["`", "``", "```", "**"])
def test_literal_text_emphasis_around_slots_is_preserved(quote):
    template = (
        f"主人，{quote}<yql.account>{quote}的{quote}<yql.metric>{quote}"
        f"是{quote}<yql.balance>{quote}，提醒阈值为{quote}<yql.threshold>{quote}。"
        "有空看一眼就好。"
    )
    expected = template
    for field, value in FIRST.items():
        expected = expected.replace(f"<yql.{field}>", value)
    assert render_notice(template, (FIRST,)) == expected


@pytest.mark.parametrize(
    "payload",
    [
        "https://example.invalid",
        "[CQ:at,qq=all]",
        "[C`Q:at,qq=all]",
        "@everyone",
        "<tool_call>pay</tool_call>",
    ],
)
def test_backticks_do_not_hide_unsafe_payloads(payload):
    assert render_notice(f"`{payload}`\n\n{NOTICE}", (FIRST,)) == ""


@pytest.mark.parametrize("quote", ["`", "**"])
def test_emphasis_does_not_hide_swapped_value_roles_or_extra_units(quote):
    template = (
        f"<yql.account>的<yql.metric>是{quote}<yql.threshold>{quote}，"
        f"提醒阈值为{quote}<yql.balance>{quote}。"
    )
    assert render_notice(template, (FIRST,)) == ""
    template = NOTICE.replace("<yql.balance>", f"{quote}<yql.balance>{quote} USD")
    assert render_notice(template, (FIRST,)) == ""


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
        "可用余额变成负值了。",
        "餘額變成負值了。",
        "余额小于零。",
        "餘額小於零。",
        "余额等于零。",
        "USD 999.",
        "CNY -9.",
        "账户已空。",
        "余额没有任何剩余额度。",
        "残高が残っていません。",
        "服务可正常使用。",
        "服务已恢复。",
        "服务可以继续使用。",
        "The service is available.",
        "The service is down.",
        "The balance is larger than the threshold.",
        "クレジットがない。",
        "クレジットがなくなった。",
        "额度已无任何余额。",
        "计划过期。",
        "服务中断。",
        "账户封禁。",
        "账户禁用。",
        "残高は底をついた。",
        "サービスは利用できる。",
        "The service is working normally.",
        "The service is still working.",
        "Your balance is more than the threshold.",
        "额度多于提醒阈值。",
        "余额未达到阈值。",
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


def test_rejects_missing_or_invalid_local_facts():
    assert render_notice(NOTICE, ()) == ""
    assert render_notice(NOTICE, ({"account": "test"},)) == ""
    assert render_notice(NOTICE, ({**FIRST, "account": "test\x00"},)) == ""
    assert render_notice(NOTICE, ({**FIRST, "account": "test\n\nother"},)) == ""


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
        "You have fifty dollars.",
        "五十美元。",
        "Your balance is measured in tokens.",
        "The balance is in pounds.",
        "I paid <yql.account>.",
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
        "Put those negative thoughts aside and take a breath.",
        "The window is closed; take a break when you like.",
        "I'm exhausted today, so here's a quiet reminder.",
        "休憩は大事。いったん作業を停止してお茶にしよう。",
        "暂停一下，喝两口水吧，主人。",
        "After 2 minutes you can check the balance when you like.",
        "This is a token of care.",
        "My heart pounds with excitement.",
        "I've recharged myself with a little nap.",
        "I paid a visit to the garden.",
        "心情变成负值了，先缓缓吧。",
        "你的茶杯已空，有空再倒一杯吧。",
        "窗外已经恢复平静，慢慢来吧。",
        "お茶が残っていません。後で淹れよう。",
        "I'm available if you feel like taking a break.",
    ],
)
def test_optional_suggestions_and_nonfinancial_numbers_are_not_banned(prose):
    assert render_notice(prose + "\n\n" + NOTICE, (FIRST,)).startswith(prose)


@pytest.mark.parametrize(
    "advice",
    [
        "let's take small steps, one at a time",
        "take 2 minutes for yourself",
        "this is a token of care",
        "my heart pounds with excitement",
        "I've recharged myself with a nap",
        "I paid a visit to the garden",
    ],
)
def test_advice_in_the_same_financial_sentence_does_not_become_an_amount(advice):
    template = (
        "<yql.account>'s <yql.metric> is <yql.balance> "
        f"with threshold <yql.threshold> and {advice}."
    )
    assert advice in render_notice(template, (FIRST,))


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


@pytest.mark.parametrize(
    "template",
    [
        "负责提醒的账户共有 {number} 个。",
        "本次账户数量为{number}。",
        "這次帳戶共計 {number} 個。",
        "账户：{number}。",
        "Accounts: {number}",
        "The account count is {number}.",
        "The number of accounts is {number}.",
        "Accounts total: {number}",
    ],
)
@pytest.mark.parametrize("number", ["1", "2", "1.1", "-1"])
@pytest.mark.parametrize("count", [1, 2])
def test_reversed_account_counts_match_rows(template, number, count):
    prose = template.format(number=number)
    body = NOTICE
    rows = (FIRST,)
    if count == 2:
        body = NOTICE.replace("<yql.", "<yql.1.")
        body += "\n\n" + NOTICE.replace("<yql.", "<yql.2.")
        rows = (FIRST, SECOND)
    result = render_notice(prose + "\n\n" + body, rows)
    assert bool(result) == (number == str(count))
    if result:
        assert result.startswith(prose)


@pytest.mark.parametrize("number", ["one", "two", "eleven", "twenty-one"])
def test_reversed_written_account_counts_match_rows(number):
    assert bool(render_notice(f"Account count is {number}.\n\n{NOTICE}", (FIRST,))) == (
        number == "one"
    )


@pytest.mark.parametrize(
    "number",
    [
        "一百",
        "一千",
        "一半",
        "1e2",
        "1E+2",
        "1,000",
        ".5",
        "1st",
        "1万",
        "1/2",
        "1 000",
    ],
)
@pytest.mark.parametrize("template", ["账户共有{number}个。", "本次有{number}个账户。"])
def test_account_count_never_accepts_only_a_valid_numeric_prefix(number, template):
    assert (
        render_notice(template.format(number=number) + "\n\n" + NOTICE, (FIRST,)) == ""
    )


@pytest.mark.parametrize(
    "number", ["1e2", "1E+2", "1,000", ".5", "1st", "1/2", "1 000", "1 dozen"]
)
@pytest.mark.parametrize(
    "template", ["Accounts: {number}.", "There are {number} accounts."]
)
def test_english_account_count_consumes_the_whole_quantity(number, template):
    assert (
        render_notice(template.format(number=number) + "\n\n" + NOTICE, (FIRST,)) == ""
    )
