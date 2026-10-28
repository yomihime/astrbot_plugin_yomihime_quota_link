"""Synthetic alert projections and single-execution image/text command replies."""

import asyncio
import copy
import importlib
import sys
import threading
from io import BytesIO
from types import SimpleNamespace
from unittest.mock import patch

import pytest
from test_alert_commands import Event, config
from test_entrypoint import FakeEvent
from test_entrypoint import entrypoint as _entrypoint_fixture
from test_local_cards import font as _font_fixture
from test_local_cards import text

from quota_link.alert_cards import (
    HELP_GROUPS,
    build_alert_admins_card,
    build_alert_help_card,
    build_alert_receipt_card,
    build_alert_status_card,
    build_alert_targets_card,
    build_alert_units_card,
    format_alert_card,
)
from quota_link.alert_commands import AlertCommands, target_id
from quota_link.cards import render_local_card
from quota_link.presentation.bitmap import BitmapBounds

entrypoint = _entrypoint_fixture
font = _font_fixture


def status():
    return {
        "running": True,
        "storage_available": True,
        "accounts": [
            {
                "account_id": "synthetic",
                "status": "blocked",
                "message": "预警配置不完整或目标不可用",
                "detail_code": "platform_not_found",
                "detail": "推送目标的平台实例不存在，请确认平台实例 ID。",
                "last_checked_at": "2026-10-28T01:00:00+00:00",
                "last_sent_at": None,
            }
        ],
    }


def units(**changes):
    return {
        "account_id": "synthetic",
        "unit_state": "changed",
        "unit": "CNY",
        "metric": "total_balance",
        "binding_metric": "old_metric",
        "change_reason": "metric_changed",
        "observed_at": "2026-10-28T01:00:00+00:00",
        "choices_state": "fresh",
        "choices_observed_at": "2026-10-28T01:02:00+00:00",
        "choices": [{"id": "a" * 64, "metric": "total_balance", "unit": "USD"}],
        **changes,
    }


def examples():
    return (
        build_alert_help_card(),
        build_alert_status_card(config(), status()),
        build_alert_targets_card((("stable-id", "demo:GroupMessage:42", ("123",)),)),
        build_alert_targets_card(()),
        build_alert_admins_card(("123", "456")),
        build_alert_units_card(config()["providers"][0], units()),
        build_alert_receipt_card("预警配置已保存。"),
    )


def test_help_keeps_every_command_and_offline_or_explicit_refresh_boundary():
    card = build_alert_help_card()
    fallback = format_alert_card(card)
    for _heading, commands in HELP_GROUPS:
        for _label, command in commands:
            assert command in text(card) and command in fallback
    assert 'units "账户名" refresh' in fallback
    assert "白名单或 AstrBot 内置管理员" in fallback
    assert "阈值按当前单位判定" in fallback


def test_status_keeps_specific_blocked_reason_in_both_presentations():
    data = config()
    data["providers"][0]["auth"] = {"api_key": "SECRET-DO-NOT-SHOW"}
    data["providers"][0]["endpoint"] = {"url": "https://secret.invalid"}
    card = build_alert_status_card(data, status())
    for rendered in (text(card), format_alert_card(card)):
        assert "推送目标的平台实例不存在，请确认平台实例 ID。" in rendered
        assert "2026-10-28 01:00:00 UTC" in rendered
        assert "最近提交平台：暂无记录" in format_alert_card(card)
        assert "实际送达请查看平台记录" in rendered
        assert "SECRET" not in rendered and "secret.invalid" not in rendered
        assert "演示数据" not in rendered


def test_units_preserve_complete_choice_id_and_distinguish_metric_and_expiry():
    account = config()["providers"][0]
    current = build_alert_units_card(account, units())
    fallback = format_alert_card(current)
    for expected in (
        "a" * 64,
        "CNY",
        "USD",
        "old_metric",
        "指标已变化",
        "total_balance",
    ):
        assert expected in fallback and expected in text(current)
    expired = build_alert_units_card(
        account, units(unit_state="verified", choices=[], choices_state="expired")
    )
    assert "候选已过期" in format_alert_card(expired)
    assert "单位已验证" in format_alert_card(expired)
    assert "已有有效绑定不会因候选过期而失效" in format_alert_card(expired)
    refreshed = build_alert_units_card(account, units(), refreshed=True)
    assert "按请求刷新账户余额" in format_alert_card(refreshed)
    assert "不会查询供应商" not in format_alert_card(refreshed)


def test_target_ids_mentions_and_exact_umo_survive_both_presentations():
    umo = "synthetic-platform:GroupMessage:room:thread"
    key = target_id(umo)
    card = build_alert_targets_card(((key, umo, ("123", "456")),))
    for rendered in (text(card), format_alert_card(card)):
        for fact in (key, umo, "@123", "@456", "targets remove " + key):
            assert fact in rendered


@pytest.mark.parametrize("index", range(7))
def test_alert_cards_render_offline_with_pinned_font(font, index):
    with patch("socket.socket", side_effect=AssertionError("offline only")):
        bitmap = render_local_card(examples()[index], font)
    assert bitmap is not None
    from PIL import Image

    with Image.open(BytesIO(bitmap)) as image:
        image.load()
        assert image.format == "PNG"
        assert image.width == 960 and image.height <= BitmapBounds().max_height
    assert len(bitmap) <= BitmapBounds().max_bytes


def test_oversize_status_and_missing_glyph_keep_complete_fallback(font):
    state = status()
    state["accounts"] = [
        {**state["accounts"][0], "account_id": f"synthetic-{index}"}
        for index in range(40)
    ]
    card = build_alert_status_card(config(), state)
    assert render_local_card(card, font) is None
    for row in state["accounts"]:
        assert row["account_id"] in format_alert_card(card)
        assert row["detail"] in format_alert_card(card)
    state["accounts"] = [{**status()["accounts"][0], "detail": "未知字形\U0010ffff"}]
    card = build_alert_status_card(config(), state)
    assert render_local_card(card, font) is None
    assert "未知字形\U0010ffff" in format_alert_card(card)


@pytest.mark.parametrize("private", [True, False])
def test_structured_api_keeps_existing_authority_and_group_privacy(private):
    calls = []

    async def dispatch(operation, body, authorize):
        authorize()
        calls.append(operation)
        return {"revision": 7, "config": config()}

    commands = AlertCommands(
        lambda: SimpleNamespace(balance_alert_admin_qq_ids=("123",)), dispatch, status
    )
    for argument in ("help", "status", "targets list", "admins list", "units work"):
        before = len(calls)
        denied = asyncio.run(
            commands.execute_result(Event(sender="999", private=private), argument)
        )
        assert denied.card is None and "无权管理" in denied.text
        assert len(calls) == before
        if not private:
            result = asyncio.run(
                commands.execute_result(Event(private=False), argument)
            )
            assert result.card is None and "私聊" in result.text
            assert "synthetic" not in result.text and "123" not in result.text
            assert len(calls) == before
    invalid = asyncio.run(
        commands.execute_result(Event(private=private), 'on "unfinished')
    )
    assert invalid.card is None


def test_units_refresh_is_explicit_once_and_uses_existing_revision():
    calls = []

    async def dispatch(operation, body, authorize):
        authorize()
        calls.append((operation, body))
        return (
            {"revision": 7, "config": config()}
            if operation == "read"
            else {"accounts": [units()]}
        )

    commands = AlertCommands(
        lambda: SimpleNamespace(balance_alert_admin_qq_ids=("123",)), dispatch, status
    )
    current = asyncio.run(commands.execute_result(Event(), "units work"))
    assert current.card is not None
    assert calls == [("read", {}), ("alert-units", {})]
    calls.clear()
    refreshed = asyncio.run(commands.execute_result(Event(), "units work refresh"))
    assert refreshed.card is not None and "按请求刷新" in refreshed.text
    assert calls == [
        ("read", {}),
        ("alert-refresh-units", {"revision": 7, "account_id": "synthetic"}),
    ]


@pytest.mark.parametrize(
    "command",
    [
        "help",
        "status",
        "targets list",
        "admins list",
        "units work",
        "units work refresh",
        "off work",
        "bind work " + "a" * 64,
        "retry work",
    ],
)
@pytest.mark.parametrize("failure", [None, "font", "renderer", "component", "chain"])
def test_entrypoint_renders_once_without_reexecuting_or_querying(
    entrypoint, monkeypatch, command, failure
):
    raw = config()
    raw["balance_alert_targets"] = [
        {"umo": "demo:GroupMessage:42", "mentions": ["123"]}
    ]
    plugin = entrypoint(None, raw)
    module = importlib.import_module(plugin.__class__.__module__)
    caller = threading.get_ident()
    calls, renders, statuses, retries = [], [], [], []

    async def dispatch(operation, body, authorize):
        authorize()
        calls.append((operation, copy.deepcopy(body)))
        return (
            {"revision": 7, "config": raw}
            if operation == "read"
            else {"accounts": [units()]}
        )

    async def no_query(*args, **kwargs):
        raise AssertionError(
            "commands must not invoke balance service outside explicit dispatch"
        )

    def fail(*args):
        raise RuntimeError("SECRET-NEVER-EXPOSE")

    def render(spec, font_path=None):
        assert threading.get_ident() != caller
        renders.append(spec)
        if failure == "renderer":
            fail()
        return None if failure == "font" else b"synthetic-png"

    plugin._admin_dispatch = dispatch
    plugin._alert_status = lambda: statuses.append(True) or status()
    plugin._retry_alert = retries.append
    monkeypatch.setattr(plugin.service, "query", no_query)
    monkeypatch.setattr(module, "render_local_card", render)
    monkeypatch.setitem(
        sys.modules,
        "astrbot.api.message_components",
        SimpleNamespace(
            Image=SimpleNamespace(
                fromBytes=fail
                if failure == "component"
                else lambda value: ("image", value)
            )
        ),
    )
    event = FakeEvent("/yql alert " + command, platform="aiocqhttp", user="123")
    event.chain_result = (
        fail if failure == "chain" else lambda values: ("chain", values)
    )

    async def run():
        return [reply async for reply in plugin.quota_link(event)]

    replies = asyncio.run(run())
    assert len(replies) == len(renders) == 1
    assert [op for op, _ in calls] == (
        []
        if command == "help"
        else ["read", "alert-units"]
        if command == "units work"
        else ["read", "alert-refresh-units"]
        if command.endswith("refresh")
        else ["read", "update"]
        if command == "off work"
        else ["read", "alert-bind-unit"]
        if command.startswith("bind ")
        else ["read"]
    )
    assert len(statuses) == (command == "status")
    assert retries == (["synthetic"] if command == "retry work" else [])
    if failure is None:
        assert replies == [("chain", [("image", b"synthetic-png")])]
        assert event.replies == []
    else:
        assert isinstance(replies[0], str) and "SECRET" not in replies[0]
        if command in {"off work", "retry work"} or command.startswith("bind "):
            assert replies[0] in {"预警配置已保存。", "已恢复检查。", "单位已确认。"}
        else:
            alert_cards = importlib.import_module(
                module.__package__ + ".quota_link.alert_cards"
            )
            assert replies[0] == alert_cards.format_alert_card(renders[0])
        if command == "status":
            assert status()["accounts"][0]["detail"] in replies[0]
