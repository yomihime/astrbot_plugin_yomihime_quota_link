"""Management uses synthetic identities/stores; never queries or sends messages."""

import asyncio
import copy
from types import SimpleNamespace

import pytest

from quota_link.alert_cards import build_alert_help_card, format_alert_help
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
        'threshold "Synthetic Work" -0.01',
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


@pytest.mark.parametrize("argument", ["", "help", "HELP"])
def test_help_without_topic_keeps_home_entry(argument):
    parsed = parse_alert_command(argument)
    assert parsed.operation == "help" and parsed.arguments == ()


@pytest.mark.parametrize("topic", ["account", "units", "targets"])
def test_help_accepts_one_case_insensitive_topic(topic):
    parsed = parse_alert_command("HELP " + topic.upper())
    assert parsed.operation == "help" and parsed.arguments == (topic,)


@pytest.mark.parametrize(
    "argument",
    [
        "help unknown-private-input",
        "help account units",
        "help units refresh",
        "help targets list",
        'help ""',
        "status account",
        "status help",
    ],
)
def test_help_and_status_reject_extra_or_invalid_arguments(argument):
    with pytest.raises(ConfigValidation) as exc:
        parse_alert_command(argument)
    assert argument not in str(exc.value)


@pytest.mark.parametrize(
    "argument",
    [
        "",
        "help",
        "help account",
        "help units",
        "help targets",
        "help unknown-private-input",
        "help account units",
        "help units refresh",
        "status account",
    ],
)
@pytest.mark.parametrize("private", [True, False])
@pytest.mark.parametrize("authorized", [True, False])
def test_help_authorizes_first_and_never_dispatches_or_reads_status(
    argument, private, authorized
):
    def no_io(*args, **kwargs):
        raise AssertionError("help must not read configuration/status or run actions")

    commands = AlertCommands(
        lambda: SimpleNamespace(balance_alert_admin_qq_ids=("123",)),
        no_io,
        no_io,
        no_io,
    )
    event = Event(sender="123" if authorized else "999", private=private)
    result = asyncio.run(commands.execute_result(event, argument))
    if not authorized:
        assert result.card is None and "无权管理" in result.text
        assert "用法" not in result.text
    elif not private:
        assert result.card is None and "私聊" in result.text
        assert "unknown-private-input" not in result.text
        assert "account|units|targets" not in result.text
    elif argument in {"", "help", "help account", "help units", "help targets"}:
        topic = argument.partition(" ")[2]
        assert result.text == format_alert_help(topic)
        assert result.card == build_alert_help_card(topic)
        assert asyncio.run(commands.execute(event, argument)) == result.text
    else:
        assert result.card is None and "unknown-private-input" not in result.text


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
        "help account",
        "help units",
        "help targets",
        "status",
        "targets list",
        "admins list",
        "on work",
        "targets addhere",
        "retry work",
        "units work",
        "bind work " + "a" * 64,
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


def test_enable_requires_threshold_target_and_does_not_partial_save(harness):
    before = harness[0].runtime_config()
    assert "已保存" not in execute(harness, "on work")
    assert harness[0].runtime_config() == before
    assert "已保存" in execute(harness, 'threshold "Synthetic Work" 10 total_balance')
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
    for text in ["status", "targets list", "admins list", "units work"]:
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
    assert "恢复检查" in execute(harness, "retry work")
    assert harness[2] == ["synthetic"] and harness[0].runtime_config() == before


def test_llm_admin_repeat_recovery_commands(harness):
    for text in [
        "threshold work 10",
        "llm off",
        "admins add 456",
        "repeat work 60",
        "recovery work 12",
    ]:
        assert "已保存" in execute(harness, text)
    raw = harness[0].runtime_config()
    assert raw["balance_alert_llm"] == {
        "enabled": False,
        "provider_id": "",
        "persona_id": "",
    }
    assert raw["balance_alert_admin_qq_ids"] == ["123", "456"]
    for text in [
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


@pytest.mark.parametrize(
    "text",
    [
        "threshold work 10 CNY",
        "threshold work 10 USD total_balance",
        "llm provider synthetic",
        "llm persona synthetic",
    ],
)
def test_manual_unit_and_independent_model_persona_commands_are_removed(harness, text):
    before = harness[0].runtime_config()
    assert "已保存" not in execute(harness, text)
    assert harness[0].runtime_config() == before


def test_unit_candidates_and_binding_share_authorized_revision(harness):
    store, _, _ = harness
    calls = []

    async def dispatch(operation, body, authorize):
        authorize()
        calls.append((operation, body))
        if operation == "alert-units":
            return {
                "accounts": [
                    {
                        "account_id": "synthetic",
                        "unit": None,
                        "choices": [
                            {"id": "a" * 64, "unit": "USD", "metric": "total_balance"}
                        ],
                    }
                ]
            }
        if operation == "alert-bind-unit":
            assert body == {
                "revision": 1,
                "account_id": "synthetic",
                "choice_id": "a" * 64,
            }
            return {"accounts": []}
        return await store.dispatch(operation, body, authorize)

    commands = AlertCommands(
        lambda: load_settings(store.runtime_config()), dispatch, lambda: {}
    )
    assert "USD" in asyncio.run(commands.execute(Event(), "units work"))
    assert (
        asyncio.run(commands.execute(Event(), "bind work " + "a" * 64))
        == "单位已确认。"
    )
    assert not any(op == "update" for op, _ in calls)
    assert "候选" in asyncio.run(commands.execute(Event(), "bind work USD"))
