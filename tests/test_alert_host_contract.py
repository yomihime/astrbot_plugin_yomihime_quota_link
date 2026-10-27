"""Hash-pinned official SDK fragments; no host startup or external delivery."""

from __future__ import annotations

import ast
import asyncio
import hashlib
import os
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from types import SimpleNamespace

import pytest

from quota_link.alert_commands import can_manage_alert
from quota_link.alert_config import parse_umo

HASHES = {
    "astrbot/core/platform/astr_message_event.py": "1c51db0b7e78e8cf6c8aa0f64c621d87e2af72a21fee0ff1524b68e6b5850954",
    "astrbot/core/platform/message_session.py": "86563844e9a0322cfaf475fda4f3699017c6747232c065298264b541af5a9ca3",
    "astrbot/core/message/components.py": "5a8dbf0ffb62cf83dcd333feb48e17acdf1a757ffcb63848423cf42585bc327f",
    "astrbot/core/message/message_event_result.py": "1496a597508319b69db53816ea02b8c9be9cecba2ee5001ed5f2934310c98219",
    "astrbot/core/pipeline/waking_check/stage.py": "0a6fc273004f13747816397fd875b27a7e6e34ce9a12230396f17d03865811f6",
    "astrbot/core/star/context.py": "10f5f5dd40491564ee196854abb5f6a4e4e6fc46a6c5e62e29935e2c53b6294f",
}
pytestmark = pytest.mark.skipif(
    not os.environ.get("QUOTA_TEST_ASTRBOT_SOURCE"),
    reason="pinned official host fixture not configured",
)


def source(path):
    text = (Path(os.environ["QUOTA_TEST_ASTRBOT_SOURCE"]) / path).read_text()
    assert hashlib.sha256(text.encode()).hexdigest() == HASHES[path], path
    return ast.parse(text)


def execute(nodes, namespace):
    future = ast.ImportFrom(
        module="__future__", names=[ast.alias(name="annotations")], level=0
    )
    exec(
        compile(
            ast.fix_missing_locations(
                ast.Module(body=[future, *nodes], type_ignores=[])
            ),
            "official-host-fragment",
            "exec",
        ),
        namespace,
    )


def method(path, class_name, method_name):
    cls = next(
        n
        for n in source(path).body
        if isinstance(n, ast.ClassDef) and n.name == class_name
    )
    return next(n for n in cls.body if getattr(n, "name", None) == method_name)


def sdk():
    class MessageType(Enum):
        GROUP_MESSAGE = "GroupMessage"
        FRIEND_MESSAGE = "FriendMessage"
        OTHER_MESSAGE = "OtherMessage"

    ns = {"dataclass": dataclass, "field": field, "MessageType": MessageType}
    execute(
        [
            n
            for n in source("astrbot/core/platform/message_session.py").body
            if isinstance(n, ast.ClassDef)
        ],
        ns,
    )
    return ns


@pytest.mark.parametrize(
    "umo",
    [
        "custom-id:GroupMessage:42",
        "not-napcat:FriendMessage:123",
        "Matrix:GroupMessage:room:thread",
        "QQ:GroupMessage:private_scope_42",
        "other:OtherMessage:system:event",
    ],
)
def test_config_umo_agrees_with_real_sdk_first_two_colons(umo):
    ns = sdk()
    session = ns["MessageSession"].from_str(umo)
    assert (
        session.platform_id,
        session.message_type.value,
        session.session_id,
    ) == parse_umo(umo)
    assert str(session) == umo


@pytest.mark.parametrize(
    "role,platform,sender,listed,allowed",
    [
        ("admin", "telegram", "not-qq", False, True),
        ("admin", "aiocqhttp", "123", False, True),
        ("member", "aiocqhttp", "123", True, True),
        ("member", "telegram", "123", True, False),
        ("member", "aiocqhttp", "123", False, False),
    ],
)
def test_real_host_admin_getter_or_trusted_platform_identity(
    role, platform, sender, listed, allowed
):
    ns = {}
    for name in ("is_admin", "get_platform_name"):
        execute(
            [
                method(
                    "astrbot/core/platform/astr_message_event.py",
                    "AstrMessageEvent",
                    name,
                )
            ],
            ns,
        )
    event = SimpleNamespace(role=role, platform_meta=SimpleNamespace(name=platform))
    event.is_admin = lambda: ns["is_admin"](event)
    event.get_platform_name = lambda: ns["get_platform_name"](event)
    event.get_sender_id = lambda: sender
    assert (
        can_manage_alert(
            event,
            SimpleNamespace(balance_alert_admin_qq_ids=("123",) if listed else ()),
        )
        is allowed
    )


def test_official_waking_stage_authority_comes_from_host_admin_ids_not_group_role():
    tree = source("astrbot/core/pipeline/waking_check/stage.py")
    loops = [
        n
        for n in ast.walk(tree)
        if isinstance(n, ast.For)
        and isinstance(n.iter, ast.Subscript)
        and ast.unparse(n.iter).endswith("astrbot_config['admins_id']")
    ]
    assert len(loops) == 1
    for trusted, expected in [(True, "admin"), (False, "member")]:
        event = SimpleNamespace(
            role="member", group_role="admin", get_sender_id=lambda: "123"
        )
        ns = {
            "event": event,
            "self": SimpleNamespace(
                ctx=SimpleNamespace(astrbot_config={"admins_id": ["123"]})
            ),
            "api_key_allow_admin_role": trusted,
        }
        execute(loops, ns)
        assert event.role == expected


def test_real_at_serialization_preserves_string_id_and_component_order():
    from pydantic import BaseModel
    from typing_extensions import deprecated

    ns = {
        "deprecated": deprecated,
        "BaseMessageComponent": BaseModel,
        "ComponentType": Enum("ComponentType", {"At": "at"}),
        "dataclass": dataclass,
        "field": field,
    }
    execute(
        [
            n
            for n in source("astrbot/core/message/components.py").body
            if isinstance(n, ast.ClassDef) and n.name == "At"
        ],
        ns,
    )
    execute(
        [
            n
            for n in source("astrbot/core/message/message_event_result.py").body
            if isinstance(n, ast.ClassDef) and n.name == "MessageChain"
        ],
        ns,
    )
    ns["At"].model_rebuild(_types_namespace=ns)
    first, second = ns["At"](qq="123"), ns["At"](qq="99999999999999999999")
    chain = ns["MessageChain"]([first, second])
    assert [item.toDict() for item in chain.chain] == [
        {"type": "at", "data": {"qq": "123"}},
        {"type": "at", "data": {"qq": "99999999999999999999"}},
    ]


def test_real_context_true_means_platform_found_not_final_delivery_ack():
    ns = sdk()
    ns.update(
        MessageSesion=ns["MessageSession"],
        logger=SimpleNamespace(warning=lambda *a: None, exception=lambda *a: None),
    )
    execute([method("astrbot/core/star/context.py", "Context", "send_message")], ns)
    calls = []

    async def send(session, chain):
        calls.append((str(session), chain))
        return None  # Host still returns True, not an end-recipient acknowledgement.

    platform = SimpleNamespace(
        meta=lambda: SimpleNamespace(id="custom", name="aiocqhttp"),
        send_by_session=send,
    )
    context = SimpleNamespace(
        platform_manager=SimpleNamespace(platform_insts=[platform]),
        get_config=lambda **kwargs: {},
    )
    assert (
        asyncio.run(
            ns["send_message"](context, "custom:GroupMessage:42", "synthetic-chain")
        )
        is True
    )
    assert calls == [("custom:GroupMessage:42", "synthetic-chain")]
    assert (
        asyncio.run(
            ns["send_message"](context, "missing:GroupMessage:42", "synthetic-chain")
        )
        is False
    )
