"""Management uses synthetic identities/stores; never queries or sends messages."""

import asyncio
import copy
from types import SimpleNamespace

import pytest

from quota_link.alert_commands import (
    AlertCommands,
    can_manage_alert,
    parse_alert_command,
    target_id,
)
from quota_link.config_store import ConfigStore, ConfigValidation
from quota_link.security import SecretStore
from quota_link.settings import load_settings


class Event:
    def __init__(
        self, *, admin=False, sender="123", platform="aiocqhttp", private=True
    ):
        self.admin, self.sender, self.platform, self.private = (
            admin,
            sender,
            platform,
            private,
        )
        self.unified_msg_origin = "synthetic:GroupMessage:42"
        self.nickname = "AstrBot 管理员"
        self.group_role = "admin"

    def is_admin(self):
        return self.admin

    def get_platform_name(self):
        return self.platform

    def get_sender_id(self):
        return self.sender

    def is_private_chat(self):
        return self.private


@pytest.mark.parametrize("admin", [True, False])
@pytest.mark.parametrize(
    "platform", ["aiocqhttp", "telegram", "qq_official", "NapCat-QQ"]
)
@pytest.mark.parametrize("listed", [True, False])
def test_independent_or_matrix(admin, platform, listed):
    settings = SimpleNamespace(balance_alert_admin_qq_ids=("123",) if listed else ())
    event = Event(admin=admin, platform=platform)
    assert can_manage_alert(event, settings) is (
        admin or (platform == "aiocqhttp" and listed)
    )


@pytest.mark.parametrize(
    "sender", ["0123", "+123", "１２３", "123 ", "@123", 123, None]
)
def test_qq_branch_requires_actual_canonical_numeric_sender(sender):
    assert not can_manage_alert(
        Event(sender=sender), SimpleNamespace(balance_alert_admin_qq_ids=("123",))
    )


def test_target_membership_nickname_group_role_and_truthy_admin_do_not_authorize():
    event = Event(admin="admin")
    settings = SimpleNamespace(
        balance_alert_admin_qq_ids=(), balance_alert_targets=[event.unified_msg_origin]
    )
    assert not can_manage_alert(event, settings)


def test_broken_host_admin_getter_can_still_allow_independent_qq_branch():
    event = Event()
    event.is_admin = lambda: 1 / 0
    assert can_manage_alert(event, SimpleNamespace(balance_alert_admin_qq_ids=("123",)))


@pytest.mark.parametrize(
    "text",
    [
        'threshold "Synthetic Work" -0.01 CNY',
        "off Synthetic Work",
        'interval "Synthetic Work" 15',
    ],
)
def test_shlex_and_multiword_names(text):
    assert parse_alert_command(text).arguments


@pytest.mark.parametrize(
    "text", ['on "unfinished', "status secret", "delete all", "x" * 4097]
)
def test_bad_parser_never_echoes_input(text):
    with pytest.raises(ConfigValidation) as exc:
        parse_alert_command(text)
    assert text not in str(exc.value)


def config():
    return {
        "balance_alert_admin_qq_ids": ["123"],
        "providers": [
            {
                "id": "synthetic",
                "type": "deepseek",
                "display_name": "Synthetic Work",
                "aliases": ["work"],
            }
        ],
    }


@pytest.fixture
def harness(tmp_path, monkeypatch):
    monkeypatch.delenv("QUOTA_LINK_SECRET_KEY", raising=False)
    store = ConfigStore(SecretStore(tmp_path), {})
    asyncio.run(
        store.dispatch("update", {"revision": 0, "config": config()}, lambda: None)
    )
    retries = []
    state = {
        "running": True,
        "storage_available": True,
        "accounts": [
            {"account_id": "synthetic", "status": "idle", "message": "等待检查"}
        ],
    }
    commands = AlertCommands(
        lambda: load_settings(store.runtime_config()),
        store.dispatch,
        lambda: state,
        retries.append,
    )
    return store, commands, retries


def execute(harness, text, event=None):
    return asyncio.run(harness[1].execute(event or Event(), text))


@pytest.mark.parametrize(
    "text",
    [
        "help",
        "status",
        "targets list",
        "admins list",
        "on work",
        "targets addhere",
        "retry work",
    ],
)
def test_entire_tree_authorized_before_read_or_side_effect(harness, text):
    before = harness[0].runtime_config()
    result = execute(harness, text, Event(sender="999"))
    assert "无权" in result
    assert harness[0].runtime_config() == before and harness[2] == []


def test_query_permission_not_needed_for_whitelisted_alert_manager(harness):
    assert "等待检查" in execute(harness, "status")
    assert "已保存" in execute(harness, 'interval "Synthetic Work" 1')
    assert (
        harness[0].runtime_config()["providers"][0]["balance_alert"][
            "check_interval_minutes"
        ]
        == 1
    )


def test_enable_requires_threshold_unit_target_and_does_not_partial_save(harness):
    before = harness[0].runtime_config()
    assert "已保存" not in execute(harness, "on work")
    assert harness[0].runtime_config() == before
    assert "已保存" in execute(
        harness, 'threshold "Synthetic Work" 10 CNY total_balance'
    )
    assert "已保存" in execute(
        harness, "targets add synthetic:GroupMessage:42 @123 @123 @456"
    )
    assert "已保存" in execute(harness, "on work")
    raw = harness[0].runtime_config()
    assert raw["providers"][0]["balance_alert"]["enabled"] is True
    assert raw["balance_alert_targets"] == [
        {"umo": "synthetic:GroupMessage:42", "mentions": ["123", "456"]}
    ]


def test_group_read_privacy_and_short_confirmation(harness):
    event = Event(private=False)
    for text in ["status", "targets list", "admins list"]:
        reply = execute(harness, text, event)
        assert "私聊" in reply and "synthetic" not in reply and "123" not in reply
    assert execute(harness, "off work", event) == "预警配置已保存。详细状态请私聊查看。"
    assert "私聊" in execute(harness, "threshold work not-a-secret-number CNY", event)


def test_addhere_only_real_event_umo_and_private_mentions_rejected(harness):
    event = Event()
    event.unified_msg_origin = "verified:GroupMessage:scope_42"
    assert "已保存" in execute(harness, "targets addhere @123", event)
    assert (
        harness[0].runtime_config()["balance_alert_targets"][0]["umo"]
        == event.unified_msg_origin
    )
    before = harness[0].runtime_config()
    event.unified_msg_origin = "verified:FriendMessage:42"
    assert "已保存" not in execute(harness, "targets addhere @123", event)
    assert harness[0].runtime_config() == before


@pytest.mark.parametrize(
    "line",
    [
        "targets add synthetic:GroupMessage:42 @all",
        "targets add synthetic:GroupMessage:42 [CQ:at,qq=all]",
        "targets add synthetic:GroupMessage:not-qq @123",
        "targets addhere @昵称",
    ],
)
def test_mentions_fail_closed(harness, line):
    before = harness[0].runtime_config()
    assert "已保存" not in execute(harness, line)
    assert harness[0].runtime_config() == before


def test_stable_id_remove_and_other_platform_targets(harness):
    umo = "other:GroupMessage:room:thread"
    assert "已保存" in execute(harness, f"targets add {umo}")
    assert target_id(umo) in execute(harness, "targets list")
    assert "已保存" in execute(harness, f"targets remove {target_id(umo)}")
    assert harness[0].runtime_config()["balance_alert_targets"] == []


def test_retry_is_explicit_local_no_config_write(harness):
    before = harness[0].runtime_config()
    assert "未重发" in execute(harness, "retry work")
    assert harness[2] == ["synthetic"] and harness[0].runtime_config() == before


def test_llm_admin_repeat_recovery_commands(harness):
    for text in [
        "threshold work 10 CNY",
        "llm off",
        "llm provider synthetic-model",
        "llm persona synthetic-persona",
        "admins add 456",
        "repeat work 60",
        "recovery work 12",
    ]:
        assert "已保存" in execute(harness, text)
    raw = harness[0].runtime_config()
    assert raw["balance_alert_llm"] == {
        "enabled": False,
        "provider_id": "synthetic-model",
        "persona_id": "synthetic-persona",
    }
    assert raw["balance_alert_admin_qq_ids"] == ["123", "456"]
    for text in [
        "llm provider auto",
        "llm persona none",
        "admins remove 456",
        "repeat work 0",
        "recovery work auto",
    ]:
        assert "已保存" in execute(harness, text)


def test_revoked_while_queued_does_not_commit(harness):
    store, _, _ = harness
    event = Event()
    before = store.runtime_config()

    async def dispatch(operation, body, authorize):
        if operation == "update":
            event.sender = "999"
        return await store.dispatch(operation, body, authorize)

    command = AlertCommands(
        lambda: load_settings(store.runtime_config()), dispatch, lambda: {}
    )
    assert "无权" in asyncio.run(command.execute(event, "off work"))
    assert store.runtime_config() == before


def test_concurrent_web_update_is_cas_conflict_not_overwrite(harness):
    store, _, _ = harness

    async def dispatch(operation, body, authorize):
        if operation == "update":
            config = copy.deepcopy(body["config"])
            config["cache_ttl_seconds"] = 123
            await store.dispatch(
                "update", {"revision": body["revision"], "config": config}, authorize
            )
        return await store.dispatch(operation, body, authorize)

    command = AlertCommands(
        lambda: load_settings(store.runtime_config()), dispatch, lambda: {}
    )
    assert "配置已改变" in asyncio.run(command.execute(Event(), "off work"))
    assert store.runtime_config()["cache_ttl_seconds"] == 123
