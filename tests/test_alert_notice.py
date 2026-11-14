import pytest

from quota_link.alert_notice import render_notice, template_prompt

FIRST = {"name": "Test wallet", "balance": "-7.00001 CNY"}
SECOND = {"name": "Test credits", "balance": "1E-300 site_credit"}
NOTICE = "主人，`<yql.1.name>`的余额是 <yql.1.balance>，有空看看就好。"


@pytest.mark.parametrize("count", [1, 2, 100])
def test_prompt_exposes_only_numbered_name_and_balance_slots(count):
    prompt = template_prompt(count)
    assert "have triggered low-balance alerts" in prompt
    assert "one combined message" in prompt
    assert "pay attention to their low balances" in prompt
    assert "persona and its examples" in prompt
    assert "including its unit" in prompt
    for index in range(1, count + 1):
        for field in FIRST:
            assert prompt.count(f"<yql.{index}.{field}>") == 1
    for row in (FIRST, SECOND):
        assert all(value not in prompt for value in row.values())
    assert "threshold" not in prompt
    assert "metric" not in prompt
    assert "paragraph" not in prompt


@pytest.mark.parametrize("count", [0, -1])
def test_prompt_without_accounts_is_empty(count):
    assert template_prompt(count) == ""


def test_single_account_is_numbered_and_values_are_exact():
    assert render_notice(NOTICE, (FIRST,)) == (
        "主人，`Test wallet`的余额是 -7.00001 CNY，有空看看就好。"
    )


@pytest.mark.parametrize(
    "template",
    [
        "<yql.2.name>: <yql.2.balance>; <yql.1.name>: <yql.1.balance>.",
        "<yql.1.name> / <yql.2.name>：余额分别是 <yql.1.balance> / <yql.2.balance>。",
        "Balances <yql.2.balance> and <yql.1.balance> belong to <yql.2.name> and <yql.1.name> respectively.",
        "<yql.1.name>\n\n<yql.2.name>\n<yql.1.balance>\n\n<yql.2.balance>",
    ],
)
def test_multiple_accounts_allow_any_slot_order_or_layout(template):
    expected = template
    for index, row in enumerate((FIRST, SECOND), 1):
        for field, value in row.items():
            expected = expected.replace(f"<yql.{index}.{field}>", value)
    assert render_notice(template, (FIRST, SECOND)) == expected


@pytest.mark.parametrize(
    "template",
    [
        None,
        12,
        "",
        NOTICE.replace("<yql.1.name>", ""),
        NOTICE.replace("<yql.1.balance>", ""),
        NOTICE.replace("<yql.1.balance>", "<yql.1.name>"),
        NOTICE + " <yql.1.balance>",
        NOTICE.replace("<yql.1.name>", "<yql.name>"),
        NOTICE.replace("<yql.1.name>", "<yql.2.name>"),
        NOTICE.replace("<yql.1.name>", "<yql.0.name>"),
        NOTICE.replace("<yql.1.name>", "<yql.01.name>"),
    ],
)
def test_missing_duplicate_or_wrong_numbered_slots_request_fallback(template):
    assert render_notice(template, (FIRST,)) == ""


@pytest.mark.parametrize(
    "extra",
    [
        "<yql.2.name>",
        "<yql.1.threshold>",
        "<yql.1.account>",
        "<yql.provider>",
        "<yql>",
        "<yql.1.name",
        "yql.1.balance>",
        "< yql.1.name>",
        "<yql .1.name>",
        "<YQL.1.name>",
        "＜yql.1.name＞",
    ],
)
def test_unknown_or_malformed_reserved_references_request_fallback(extra):
    assert render_notice(NOTICE + " " + extra, (FIRST,)) == ""


@pytest.mark.parametrize("field", tuple(FIRST))
@pytest.mark.parametrize("replacement", ["", "<yql.3.{field}>", "<yql.2.{field}>"])
def test_multi_account_completeness_and_uniqueness(field, replacement):
    template = "<yql.1.name>: <yql.1.balance>; <yql.2.name>: <yql.2.balance>."
    template = template.replace(f"<yql.1.{field}>", replacement.format(field=field))
    assert render_notice(template, (FIRST, SECOND)) == ""


@pytest.mark.parametrize(
    "name",
    [
        r"<yql.1.balance> \\g<0> <yql.99.name>",
        "钱包 / Compte inconnu / 未登録アカウント / حساب",
        "[CQ:at,qq=all] @everyone https://wallet.example",
    ],
)
def test_local_names_are_literal_and_never_reparsed(name):
    expected = f"主人，`{name}`的余额是 {FIRST['balance']}，有空看看就好。"
    assert render_notice(NOTICE, ({**FIRST, "name": name},)) == expected


def test_long_prose_names_and_values_are_not_limited_or_truncated():
    introduction = "A quiet reminder, whenever you have a moment. " * 130
    name = "長い名前・épargne・حساب・" * 300
    balance = "1234567890" * 500 + " credits"
    template = introduction + "\n\n" + NOTICE
    expected = introduction + f"\n\n主人，`{name}`的余额是 {balance}，有空看看就好。"
    assert min(len(introduction), len(name), len(balance)) > 4096
    assert render_notice(template, ({"name": name, "balance": balance},)) == expected


@pytest.mark.parametrize(
    "prose",
    [
        "Hola, cuando puedas, échale un vistazo.",
        "À regarder tranquillement, mon ami.",
        "ゆっくり確認してね。",
        "主人，有空看看就好。",
        "One step at a time; take 2 minutes if you like.",
        "This is a token of care. My heart pounds with excitement.",
        "The service is available. The balance is zero. USD 999.",
        "这次有三个账户，余额小于零，必须充值。",
        "https://example.invalid @everyone [CQ:at,qq=all] <tool_call>text</tool_call>",
        "  **Keep emphasis**\n\n\tand whitespace.  ",
    ],
)
def test_prose_is_not_semantically_interpreted_or_filtered(prose):
    template = prose + "\n" + NOTICE
    assert render_notice(template, (FIRST,)) == (
        prose + "\n主人，`Test wallet`的余额是 -7.00001 CNY，有空看看就好。"
    )


@pytest.mark.parametrize(
    "rows", [(), ({"name": "wallet"},), ({**FIRST, "balance": 1},)]
)
def test_no_accounts_or_non_text_local_values_request_fallback(rows):
    assert render_notice(NOTICE, rows) == ""
