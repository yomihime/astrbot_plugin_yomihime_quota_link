"""Recipient grammar validation uses synthetic identifiers, never SDK sends."""

import pytest

from quota_link.alert_config import (
    AlertConfigError,
    parse_alert_admin_qq_ids,
    parse_alert_targets,
    parse_umo,
)


def target(umo="Synthetic:GroupMessage:900001", mentions=None):
    return {"umo": umo, "mentions": [] if mentions is None else mentions}


@pytest.mark.parametrize(
    "umo,parts",
    [
        ("Synthetic:FriendMessage:900001", ("Synthetic", "FriendMessage", "900001")),
        (
            "custom-instance:GroupMessage:900001",
            ("custom-instance", "GroupMessage", "900001"),
        ),
        ("matrix:GroupMessage:room:domain", ("matrix", "GroupMessage", "room:domain")),
        ("x:OtherMessage:a:b:c", ("x", "OtherMessage", "a:b:c")),
        ("实例:GroupMessage:scope_900001", ("实例", "GroupMessage", "scope_900001")),
        ("  custom:FriendMessage:user  ", ("custom", "FriendMessage", "user")),
    ],
)
def test_sdk_first_two_colons_and_arbitrary_platform_id(umo, parts):
    assert parse_umo(umo) == parts
    assert parse_alert_targets([target(umo)])[0].umo == ":".join(parts)


@pytest.mark.parametrize(
    "umo",
    [
        None,
        [],
        1,
        "",
        "one",
        "one:two",
        ":GroupMessage:1",
        "x::1",
        "x:GroupMessage:",
        "x:groupmessage:1",
        "x:Groupmessage:1",
        "x:Unknown:1",
        " x :GroupMessage:1",
        "x:GroupMessage:1 2",
        "x:GroupMessage:\t1",
        "x:GroupMessage:1\n",
        "\nx:GroupMessage:1",
        "\ufeffx:GroupMessage:1",
        "x:GroupMessage:1\u200b",
        "x:GroupMessage:\u202e1",
        "x:GroupMessage:1\x00",
        "x:GroupMessage:1\x85",
        "x:GroupMessage:1\u00a02",
        "x:GroupMessage:" + "1" * 500,
    ],
)
def test_invalid_umo(umo):
    with pytest.raises(AlertConfigError):
        parse_alert_targets([target(umo)])


def test_umo_length_counts_unicode_codepoints_not_utf16_units():
    prefix = "x:OtherMessage:"
    good = prefix + "😀" * (512 - len(prefix))
    assert parse_alert_targets([target(good)])[0].umo == good
    with pytest.raises(AlertConfigError):
        parse_alert_targets([target(good + "😀")])


@pytest.mark.parametrize("value", [None, {}, "", True, [target()] * 21])
def test_invalid_target_list_shape_or_count(value):
    with pytest.raises(AlertConfigError):
        parse_alert_targets(value)


@pytest.mark.parametrize(
    "item",
    [
        {},
        {"umo": "x:GroupMessage:1"},
        {"mentions": []},
        {**target(), "qq_group": True},
        [],
        None,
        "x:GroupMessage:1",
    ],
)
def test_exact_target_object_only(item):
    with pytest.raises(AlertConfigError):
        parse_alert_targets([item])


@pytest.mark.parametrize(
    "mention",
    [
        "",
        " ",
        "0",
        "01",
        "-1",
        "+1",
        "1.0",
        "1e2",
        "all",
        "@all",
        "@123",
        "全体成员",
        "[CQ:at,qq=123]",
        "昵称",
        "１２３",
        "١٢٣",
        "1 2",
        "1\n",
        "\t1",
        "\ufeff1",
        "1\u200b",
        "1\u202e",
        "1" * 21,
        123,
        True,
        None,
        {},
        [],
    ],
)
def test_invalid_mentions_and_qq_admin_ids(mention):
    with pytest.raises(AlertConfigError):
        parse_alert_targets([target(mentions=[mention])])
    with pytest.raises(AlertConfigError):
        parse_alert_admin_qq_ids([mention])


@pytest.mark.parametrize("value", [None, "123", 123, True, {}, ["1"] * 21])
def test_mentions_list_and_raw_limit(value):
    with pytest.raises(AlertConfigError):
        parse_alert_targets([{**target(), "mentions": value}])


def test_mentions_trim_dedup_preserve_order_and_strings():
    item = parse_alert_targets(
        [target(mentions=["900002", " 900003 ", "900002", "12345678901234567890"])]
    )[0]
    assert item.mentions == ("900002", "900003", "12345678901234567890")
    assert item.as_dict()["mentions"] == ["900002", "900003", "12345678901234567890"]


@pytest.mark.parametrize(
    "umo",
    [
        "x:FriendMessage:900001",
        "x:OtherMessage:900001",
        "x:GroupMessage:room:domain",
        "x:GroupMessage:all",
        "x:GroupMessage:0",
        "x:GroupMessage:001",
        "x:GroupMessage:prefix_",
    ],
)
def test_mentions_only_supported_numeric_group_intent(umo):
    assert parse_alert_targets([target(umo)])
    with pytest.raises(AlertConfigError):
        parse_alert_targets([target(umo, ["900002"])])


@pytest.mark.parametrize(
    "umo",
    [
        "custom:GroupMessage:900001",
        "not-napcat:GroupMessage:scope_900001",
        "平台:GroupMessage:a_b_900001",
    ],
)
def test_mentions_preserve_sdk_isolated_group_session_prefix(umo):
    item = parse_alert_targets([target(umo, ["900002"])])[0]
    assert item.umo == umo
    # This only declares intent. No adapter lookup or verified delivery claim.
    assert item.mentions == ("900002",)


def test_duplicate_umo_rejected_after_normalizing_outer_spaces():
    with pytest.raises(AlertConfigError, match="重复"):
        parse_alert_targets(
            [target(), target(" Synthetic:GroupMessage:900001 ", ["900002"])]
        )


def test_different_platform_id_case_not_merged():
    assert (
        len(parse_alert_targets([target(), target("synthetic:GroupMessage:900001")]))
        == 2
    )


def test_target_identity_is_stable_and_does_not_depend_on_mentions():
    a = parse_alert_targets([target()])[0]
    b = parse_alert_targets([target(mentions=["900002"])])[0]
    assert a.id == b.id and len(a.id) == 12
    assert "900001" not in repr(a)
    assert "900002" not in repr(b)


@pytest.mark.parametrize(
    "control",
    ["\x00", "\x0b", "\x0c", "\x85", "\u200b", "\u202e", "\ufeff", "\ud800", "\udfff"],
)
def test_control_characters_never_disappear_through_trimming(control):
    with pytest.raises(AlertConfigError):
        parse_umo(control + "x:GroupMessage:900001")
    with pytest.raises(AlertConfigError):
        parse_alert_targets([target(mentions=[control + "900002"])])
