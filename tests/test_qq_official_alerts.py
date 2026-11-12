import asyncio
from types import SimpleNamespace

import pytest
from test_alert_delivery import FakeContext, delivery, fact

from quota_link.alert_commands import can_manage_alert
from quota_link.alert_config import (
    BalanceAlertLLM,
    BalanceAlertTarget,
    parse_alert_admin_qq_ids,
)


@pytest.mark.parametrize("platform", ["qq_official", "qq_official_webhook"])
@pytest.mark.parametrize(
    "kind,key", [("FriendMessage", "openid"), ("GroupMessage", "group_openid")]
)
@pytest.mark.parametrize(
    "receipt,status",
    [
        ({"id": "synthetic-message"}, "submitted"),
        ({}, "unknown"),
        (True, "unknown"),
        (None, "unknown"),
        (RuntimeError("secret"), "unknown"),
    ],
)
def test_official_receipt_no_context_false_success_or_retries(
    platform, kind, key, receipt, status
):
    context = FakeContext(adapter=platform)
    calls = []

    async def send(**kwargs):
        calls.append(kwargs)
        if isinstance(receipt, Exception):
            raise receipt
        return receipt

    api = SimpleNamespace(post_c2c_message=send, post_group_message=send)
    context.get_platform_inst = lambda pid: SimpleNamespace(
        meta=lambda: SimpleNamespace(id=pid, name=platform),
        get_client=lambda: SimpleNamespace(api=api),
    )
    reservations = []
    result = asyncio.run(
        delivery(context).deliver(
            BalanceAlertTarget(f"instance:{kind}:Opaque_ABC"),
            (fact(),),
            BalanceAlertLLM(enabled=False),
            active=lambda: True,
            reserve=lambda: reservations.append(True) or True,
        )
    )
    assert result.status == status
    assert len(calls) == len(reservations) == 1
    assert calls[0][key] == ("Opaque_ABC" if kind == "FriendMessage" else "ABC")
    assert calls[0]["msg_type"] == 0
    assert "msg_id" not in calls[0]
    assert not context.sent


def test_official_admin_identity_is_not_numeric_qq_or_umo():
    ids = parse_alert_admin_qq_ids(["12345", "qq_official:OpaqueABC"])
    settings = SimpleNamespace(balance_alert_admin_qq_ids=ids)

    def event(platform, uid):
        return SimpleNamespace(
            is_admin=lambda: False,
            get_platform_name=lambda: platform,
            get_sender_id=lambda: uid,
        )

    assert can_manage_alert(event("qq_official", "OpaqueABC"), settings)
    assert can_manage_alert(event("aiocqhttp", "12345"), settings)
    assert not can_manage_alert(event("qq_official", "12345"), settings)
    assert not can_manage_alert(event("telegram", "OpaqueABC"), settings)
    assert not can_manage_alert(event("qq_official", "opaqueabc"), settings)
    with pytest.raises(ValueError):
        parse_alert_admin_qq_ids(["instance:FriendMessage:OpaqueABC"])


@pytest.mark.parametrize("platform", ["qq_official", "qq_official_webhook"])
def test_official_missing_sdk_blocks_before_budget(platform):
    context = FakeContext(adapter=platform)
    calls = []
    result = asyncio.run(
        delivery(context).deliver(
            BalanceAlertTarget("instance:FriendMessage:OpaqueABC"),
            (fact(),),
            BalanceAlertLLM(enabled=False),
            active=lambda: True,
            reserve=lambda: calls.append(True) or True,
        )
    )
    assert result.status == "blocked"
    assert result.reason_code == "transport_unavailable"
    assert not calls and not context.sent


@pytest.mark.parametrize("platform", ["qq_official", "qq_official_webhook"])
def test_query_uid_is_not_umo_bot_id_or_admin_authority(platform):
    from quota_link.intent import PermissionContext, can_query
    from quota_link.settings import load_settings

    settings = load_settings(
        {
            "private_allowed_user_ids": [f"{platform}:OpaqueABC"],
            "group_allowed_user_ids": ["OpaqueABC"],
            "allow_group_queries": True,
        }
    )

    def identity(private, uid):
        return PermissionContext(
            private, False, uid, None if private else "GroupABC", platform
        )

    assert can_query(identity(True, "OpaqueABC"), settings)
    assert can_query(identity(False, "OpaqueABC"), settings)
    assert not can_query(identity(True, "instance:FriendMessage:OpaqueABC"), settings)
    assert not can_query(identity(True, "instance"), settings)
    assert not can_query(identity(True, "OpaqueABC"), settings, is_command=True)


@pytest.mark.parametrize(
    "session", ["../messages", "abc?token=x", "abc#x", "abc%2fdef", "sender_"]
)
def test_official_route_rejects_unsafe_or_empty_group_ids(session):
    context = FakeContext(adapter="qq_official")
    assert (
        delivery(context)._target_reason(
            BalanceAlertTarget(f"instance:GroupMessage:{session}")
        )
        == "target_invalid"
    )
