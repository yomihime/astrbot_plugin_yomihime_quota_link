import asyncio
import sys
from types import ModuleType, SimpleNamespace

import pytest
from test_alert_delivery import FakeContext, delivery, fact
from test_alert_runtime import Context, engine, run_async, settings

from quota_link.alert_commands import (
    AlertCommands,
    can_manage_alert,
    parse_alert_command,
)
from quota_link.alert_config import (
    BalanceAlertLLM,
    BalanceAlertTarget,
    parse_alert_admin_qq_ids,
    parse_alert_targets,
)
from quota_link.alerts import _target_key
from quota_link.config_store import ConfigValidation


@pytest.fixture
def botpy(monkeypatch):
    class BotHttp:
        def __init__(self):
            self.result = {"id": "synthetic-message"}
            self.calls = []

        async def request(self, route, **kwargs):
            self.calls.append((route.method, route.path, kwargs))
            if isinstance(self.result, Exception):
                raise self.result
            return self.result

    class Route:
        def __init__(self, method, path):
            self.method = method
            self.path = path

    errors = ModuleType("botpy.errors")
    for name in (
        "AuthenticationFailedError",
        "ForbiddenError",
        "MethodNotAllowedError",
        "NotFoundError",
        "SequenceNumberError",
        "ServerError",
    ):
        setattr(errors, name, type(name, (RuntimeError,), {}))
    messages = ModuleType("botpy.message")
    for name in ("GroupMessage", "C2CMessage", "Message", "DirectMessage"):
        setattr(messages, name, type(name, (SimpleNamespace,), {}))
    http = ModuleType("botpy.http")
    http.BotHttp = BotHttp
    http.Route = Route
    monkeypatch.setitem(sys.modules, "botpy", ModuleType("botpy"))
    monkeypatch.setitem(sys.modules, "botpy.errors", errors)
    monkeypatch.setitem(sys.modules, "botpy.message", messages)
    monkeypatch.setitem(sys.modules, "botpy.http", http)
    monkeypatch.setattr("quota_link.alert_delivery.version", lambda name: "1.2.1")
    return SimpleNamespace(transport=BotHttp(), errors=errors, messages=messages)


@pytest.fixture(params=["qq_official", "qq_official_webhook"])
def adapter(request):
    return request.param


def attach_official(context, adapter, transport, *, scenes=None):
    context.get_platform_inst = lambda pid: SimpleNamespace(
        meta=lambda: SimpleNamespace(id=pid, name=adapter),
        get_client=lambda: SimpleNamespace(http=transport),
        _session_scene=scenes or {},
    )


@pytest.mark.parametrize(
    "kind,scene,path",
    [
        ("FriendMessage", "qq_c2c", "/v2/users/Opaque_ABC/messages"),
        ("GroupMessage", "qq_group", "/v2/groups/ABC/messages"),
    ],
)
@pytest.mark.parametrize(
    "receipt,status",
    [
        ({"id": "synthetic-message"}, "submitted"),
        ({}, "unknown"),
        (True, "unknown"),
        (None, "unknown"),
        (RuntimeError("secret"), "unknown"),
        (TimeoutError(), "unknown"),
        (ConnectionResetError(), "unknown"),
    ],
)
def test_official_receipt_no_context_false_success_or_retries(
    adapter, botpy, kind, scene, path, receipt, status
):
    context = FakeContext(adapter=adapter)
    attach_official(context, adapter, botpy.transport)
    botpy.transport.result = receipt
    reservations = []
    result = asyncio.run(
        delivery(context).deliver(
            BalanceAlertTarget(f"instance:{kind}:Opaque_ABC", scene=scene),
            (fact(),),
            BalanceAlertLLM(enabled=False),
            active=lambda: True,
            reserve=lambda: reservations.append(True) or True,
        )
    )
    assert result.status == status
    assert len(botpy.transport.calls) == len(reservations) == 1
    method, actual_path, options = botpy.transport.calls[0]
    assert (method, actual_path) == ("POST", path)
    assert options == {
        "retry_time": 2,
        "allow_redirects": False,
        "json": {"msg_type": 0, "content": options["json"]["content"]},
    }
    assert "Synthetic account" in options["json"]["content"]
    assert not context.sent


@pytest.mark.parametrize(
    "error,status",
    [
        ("AuthenticationFailedError", "failed"),
        ("ForbiddenError", "failed"),
        ("MethodNotAllowedError", "failed"),
        ("NotFoundError", "failed"),
        ("SequenceNumberError", "failed"),
        ("ServerError", "unknown"),
    ],
)
def test_only_typed_rejections_are_failed(adapter, botpy, error, status):
    context = FakeContext()
    attach_official(context, adapter, botpy.transport)
    botpy.transport.result = getattr(botpy.errors, error)("sensitive remote body")
    result = asyncio.run(
        delivery(context).deliver(
            BalanceAlertTarget("instance:FriendMessage:Opaque_ABC", scene="qq_c2c"),
            (fact(),),
            BalanceAlertLLM(enabled=False),
            active=lambda: True,
            reserve=lambda: True,
        )
    )
    assert result.status == status
    assert "sensitive remote body" not in result.message
    assert len(botpy.transport.calls) == 1


@run_async
@pytest.mark.parametrize(
    "response_status,outcome",
    [
        (401, "failed"),
        (403, "failed"),
        (404, "failed"),
        (405, "failed"),
        (429, "failed"),
        (400, "unknown"),
        (503, "unknown"),
        (307, "unknown"),
        (None, "unknown"),
    ],
)
async def test_real_botpy_makes_one_post_even_after_reset(response_status, outcome):
    botpy_http = pytest.importorskip("botpy.http")
    transport = botpy_http.BotHttp(timeout=1)
    context = FakeContext()
    attach_official(context, "qq_official_webhook", transport)
    requests = []

    class Response:
        status = response_status
        request_info = SimpleNamespace(url="synthetic")
        headers = {"content-type": "application/json"}

        async def __aenter__(self):
            if response_status is None:
                raise ConnectionResetError
            return self

        async def __aexit__(self, *args):
            return None

        async def json(self):
            return {"message": "synthetic SDK response"}

    def request(**kwargs):
        requests.append(kwargs)
        return Response()

    async def check_session():
        # Keep the real SDK request loop and error handler. Replace only
        # authentication and the underlying network client.
        transport._headers = {}
        transport._session = SimpleNamespace(closed=True, request=request)

    transport.check_session = check_session
    result = await delivery(context).deliver(
        BalanceAlertTarget("instance:FriendMessage:User_ABC", scene="qq_c2c"),
        (fact(),),
        BalanceAlertLLM(enabled=False),
        active=lambda: True,
        reserve=lambda: True,
    )
    assert result.status == outcome
    assert len(requests) == 1
    assert requests[0]["method"] == "POST"
    assert requests[0]["url"].endswith("/v2/users/User_ABC/messages")
    assert requests[0]["allow_redirects"] is False


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
            BalanceAlertTarget("instance:FriendMessage:OpaqueABC", scene="qq_c2c"),
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


@pytest.mark.parametrize(
    "target,scenes,reason",
    [
        (
            BalanceAlertTarget("instance:GroupMessage:Opaque"),
            {},
            "target_scene_required",
        ),
        (
            BalanceAlertTarget("instance:FriendMessage:Opaque"),
            {"Opaque": "friend"},
            "target_scene_required",
        ),
        (
            BalanceAlertTarget(
                "instance:GroupMessage:sender_Channel", scene="qq_group"
            ),
            {"Channel": "channel"},
            "platform_unsupported",
        ),
        (
            BalanceAlertTarget("instance:GroupMessage:Opaque", scene="qq_c2c"),
            {},
            "platform_unsupported",
        ),
    ],
)
def test_official_target_requires_explicit_scene_and_refuses_known_channel(
    adapter, botpy, target, scenes, reason
):
    context = FakeContext()
    attach_official(context, adapter, botpy.transport, scenes=scenes)
    assert delivery(context)._target_reason(target) == reason
    assert not botpy.transport.calls


@pytest.mark.parametrize(
    "kind,session,event_type,scene",
    [
        ("GroupMessage", "sender_GroupABC", "GroupMessage", "qq_group"),
        ("FriendMessage", "User_ABC", "C2CMessage", "qq_c2c"),
        ("GroupMessage", "OtherGroup", "GroupMessage", None),
        ("GroupMessage", "GroupABC", "Message", None),
        ("FriendMessage", "User_ABC", "DirectMessage", None),
    ],
)
def test_addhere_binds_only_sdk_group_or_c2c(
    adapter, botpy, kind, session, event_type, scene
):
    raw = getattr(botpy.messages, event_type)(
        group_openid="GroupABC", author=SimpleNamespace(user_openid="User_ABC")
    )
    event = SimpleNamespace(
        get_platform_name=lambda: adapter,
        unified_msg_origin=f"instance:{kind}:{session}",
        message_obj=SimpleNamespace(raw_message=raw),
    )
    config = {}
    command = parse_alert_command("targets addhere")
    if scene is None:
        with pytest.raises(ConfigValidation):
            AlertCommands._mutate(config, command, event)
        assert not config["balance_alert_targets"]
    else:
        AlertCommands._mutate(config, command, event)
        (target,) = parse_alert_targets(config["balance_alert_targets"])
        assert target.as_dict() == {
            "umo": event.unified_msg_origin,
            "mentions": [],
            "scene": scene,
        }


def test_manual_scene_and_legacy_onebot_configuration_round_trip():
    config = {}
    for cmd in (
        "targets add official:GroupMessage:GroupABC scene=qq_group",
        "targets add official:FriendMessage:User_ABC scene=qq_c2c",
        "targets add onebot:GroupMessage:123 @456",
    ):
        AlertCommands._mutate(config, parse_alert_command(cmd), None)
    targets = config["balance_alert_targets"]
    assert [t.as_dict() for t in parse_alert_targets(targets)] == targets
    for invalid in (
        {**targets[0], "scene": "qq_c2c"},
        {**targets[0], "scene": None},
        {**targets[1], "scene": "guild_dm"},
        {"umo": "official:GroupMessage:123", "scene": "qq_group", "mentions": ["456"]},
    ):
        with pytest.raises(ValueError):
            parse_alert_targets([invalid])
    onebot = FakeContext(adapter="aiocqhttp")
    assert delivery(onebot).validate_target(parse_alert_targets([targets[2]])[0])
    assert not delivery(onebot).validate_target(parse_alert_targets([targets[0]])[0])


def official_group(session):
    return BalanceAlertTarget(f"fake:GroupMessage:{session}", scene="qq_group")


@run_async
async def test_alias_permission_checks_use_the_configured_umo(adapter, botpy, tmp_path):
    raw, alias = official_group("GroupABC"), official_group("sender_GroupABC")
    config = settings()
    config.balance_alert_targets = (raw, alias)
    context = Context()
    attach_official(context, adapter, botpy.transport)
    monitor, *_ = engine(tmp_path, config=config, context=context)
    checked = []

    async def session_enabled(umo):
        checked.append(umo)
        return umo == alias.umo

    monitor.delivery.session_enabled = session_enabled
    await monitor.run_once()
    assert checked == [raw.umo, alias.umo, alias.umo]
    assert len(botpy.transport.calls) == 1
    assert botpy.transport.calls[0][1] == "/v2/groups/GroupABC/messages"
    assert monitor.status()["accounts"][0]["status"] == "submitted"
    await monitor.close()


@run_async
@pytest.mark.parametrize("error", ["SequenceNumberError", "ServerError"])
async def test_aliases_share_durable_outcome_and_budget(
    adapter, botpy, error, tmp_path
):
    raw, alias = official_group("GroupABC"), official_group("sender_GroupABC")
    config = settings(interval=1)
    config.balance_alert_targets = (raw, alias)
    context = Context()
    attach_official(context, adapter, botpy.transport)
    botpy.transport.result = getattr(botpy.errors, error)("synthetic remote error")
    monitor, _, clock, service, _ = engine(tmp_path, config=config, context=context)
    await monitor.run_once()
    assert len(botpy.transport.calls) == 1
    assert monitor._db.execute("SELECT COUNT(*) FROM budgets").fetchone()[0] == 1
    await monitor.close()

    config.balance_alert_targets = (official_group("new_sender_GroupABC"),)
    botpy.transport.result = {"id": "synthetic-message"}
    restarted, _, _, _, _ = engine(tmp_path, config, clock, service, context)
    clock.advance(60)
    await restarted.run_once()
    assert len(botpy.transport.calls) == 1
    clock.advance(240)
    await restarted.run_once()
    if error == "SequenceNumberError":
        assert len(botpy.transport.calls) == 2
        assert restarted.status()["accounts"][0]["status"] == "submitted"
    else:
        assert len(botpy.transport.calls) == 1
        assert restarted.status()["accounts"][0]["status"] == "unknown"
    await restarted.close()


@run_async
@pytest.mark.parametrize("legacy_status", ["unknown", "reserved", "submitted"])
async def test_legacy_official_alias_migrates_on_restart(
    adapter, botpy, legacy_status, tmp_path
):
    raw, alias = official_group("GroupABC"), official_group("sender_GroupABC")
    config = settings(interval=1)
    config.balance_alert_targets = (raw, alias)
    context = Context()
    attach_official(context, adapter, botpy.transport)
    monitor, _, clock, service, _ = engine(tmp_path, config=config, context=context)
    await monitor.run_once()
    episode = monitor._row("account-0")["episode"]
    with monitor._db:
        monitor._db.execute("DELETE FROM deliveries")
        monitor._db.execute("DELETE FROM budgets")
        monitor._db.execute(
            "INSERT INTO deliveries VALUES(?,?,?,?,?)",
            ("account-0", episode, _target_key(alias), clock(), legacy_status),
        )
        monitor._db.execute(
            "INSERT INTO budgets VALUES(?,?)", (_target_key(alias), clock())
        )
    await monitor.close()
    restarted, _, _, _, _ = engine(tmp_path, config, clock, service, context)
    assert restarted._db.execute("SELECT target_key FROM budgets").fetchone()[
        0
    ] != _target_key(alias)
    config.balance_alert_targets = (raw,)
    clock.advance(600)
    await restarted.run_once()
    assert len(botpy.transport.calls) == 1
    assert restarted.status()["accounts"][0]["status"] == (
        "submitted" if legacy_status == "submitted" else "unknown"
    )
    await restarted.close()


@run_async
async def test_deleted_legacy_unknown_alias_suppresses_only_official_until_next_episode(
    botpy, tmp_path
):
    legacy = official_group("removed_sender_GroupABC")
    current = official_group("GroupABC")
    onebot = BalanceAlertTarget("onebot:GroupMessage:100", ("234",))
    config = settings(interval=1)
    config.balance_alert_targets = (legacy,)
    context = Context()
    attach_official(context, "qq_official_webhook", botpy.transport)
    official_instance = context.get_platform_inst
    context.get_platform_inst = lambda pid: (
        official_instance(pid)
        if pid != "onebot"
        else SimpleNamespace(meta=lambda: SimpleNamespace(id=pid, name="aiocqhttp"))
    )
    monitor, _, clock, service, _ = engine(tmp_path, config=config, context=context)
    await monitor.run_once()
    episode = monitor._row("account-0")["episode"]
    with monitor._db:
        monitor._db.execute("DELETE FROM deliveries")
        monitor._db.execute("DELETE FROM budgets")
        monitor._db.execute("DROP TABLE legacy_uncertain_deliveries")
        monitor._db.execute(
            "INSERT INTO deliveries VALUES(?,?,?,?,?)",
            ("account-0", episode, _target_key(legacy), clock(), "unknown"),
        )
    await monitor.close()
    config.balance_alert_targets = (current, onebot)
    restarted, _, _, _, _ = engine(tmp_path, config, clock, service, context)
    clock.advance(600)
    await restarted.run_once()
    assert len(context.sent) == len(botpy.transport.calls) == 1
    assert restarted.status()["accounts"][0]["detail_code"] == "legacy_target_unknown"

    service.amounts["account-0"] = config.accounts[
        0
    ].balance_alert.effective_recovery_threshold
    clock.advance()
    await restarted.run_once()
    service.amounts["account-0"] = config.accounts[0].balance_alert.threshold
    clock.advance()
    await restarted.run_once()
    assert len(context.sent) == len(botpy.transport.calls) == 2
    assert restarted.status()["accounts"][0]["status"] == "submitted"
    await restarted.close()
