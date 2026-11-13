import asyncio
import gzip
import importlib.metadata
import json
import logging
import sys
from types import MappingProxyType, ModuleType, SimpleNamespace

import httpx
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


class ResponseStream(httpx.AsyncByteStream):
    def __init__(self, *chunks):
        self.chunks = chunks
        self.closed = False

    async def __aiter__(self):
        for chunk in self.chunks:
            yield chunk

    async def aclose(self):
        self.closed = True


@pytest.fixture
def qq_http(monkeypatch):
    class SDKAuth:
        def __init__(self):
            self.is_sandbox = False
            self._headers = None
            self.auth_calls = 0
            self.request_calls = 0

        async def check_session(self):
            self.auth_calls += 1
            self._headers = MappingProxyType(
                {
                    "aUtHoRiZaTiOn": "QQBot synthetic-token",
                    "X-Union-Appid": "synthetic-app",
                    "Cookie": "sdk-only-cookie",
                    "Host": "sdk.invalid",
                    "X-Extra": "sdk-only-header",
                }
            )

        async def request(self, *args, **kwargs):
            self.request_calls += 1
            raise AssertionError("The QQ SDK message request must not be called")

    http = SimpleNamespace(
        auth=SDKAuth(),
        response=httpx.Response(200, json={"id": "synthetic-message"}),
        requests=[],
        response_streams=[],
        transport_options=[],
    )

    def handle(request):
        http.requests.append(request)
        if isinstance(http.response, Exception):
            raise http.response
        response = http.response
        if not isinstance(response.stream, ResponseStream):
            response = httpx.Response(
                response.status_code,
                headers=response.headers,
                stream=ResponseStream(response.content),
            )
        http.response_streams.append(response.stream)
        return response

    def make_transport(**options):
        http.transport_options.append(options)
        return httpx.MockTransport(handle)

    monkeypatch.setattr(
        "quota_link.alert_delivery.httpx.AsyncHTTPTransport", make_transport
    )
    yield http
    assert http.auth.request_calls == 0
    assert all(stream.closed for stream in http.response_streams)


@pytest.fixture
def botpy_messages(monkeypatch):
    messages = ModuleType("botpy.message")
    for name in ("GroupMessage", "C2CMessage", "Message", "DirectMessage"):
        setattr(messages, name, type(name, (SimpleNamespace,), {}))
    monkeypatch.setitem(sys.modules, "botpy", ModuleType("botpy"))
    monkeypatch.setitem(sys.modules, "botpy.message", messages)
    return messages


@pytest.fixture(params=["qq_official", "qq_official_webhook"])
def adapter(request):
    return request.param


@pytest.fixture
def sdk_metadata(monkeypatch):
    from_name = importlib.metadata.Distribution.from_name

    def install(version):
        lookups = []

        def distribution(name):
            if name not in {"qq-botpy", "qq_botpy"}:
                return from_name(name)
            lookups.append(name)
            if version is None:
                raise importlib.metadata.PackageNotFoundError(name)
            return SimpleNamespace(version=version)

        monkeypatch.setattr(importlib.metadata.Distribution, "from_name", distribution)
        return lookups

    return install


def attach_official(context, adapter, transport, *, scenes=None):
    context.get_platform_inst = lambda pid: SimpleNamespace(
        meta=lambda: SimpleNamespace(id=pid, name=adapter),
        get_client=lambda: SimpleNamespace(http=transport),
        _session_scene=scenes or {},
    )


_FRIEND = BalanceAlertTarget("instance:FriendMessage:Opaque_ABC", scene="qq_c2c")


async def send_alert(context, target, reservations, *, active=lambda: True):
    return await delivery(context).deliver(
        target,
        (fact(),),
        BalanceAlertLLM(enabled=False),
        active=active,
        reserve=lambda: reservations.append(True) or True,
    )


@run_async
@pytest.mark.parametrize(
    "target,sandbox,path",
    [
        (_FRIEND, False, "/v2/users/Opaque_ABC/messages"),
        (
            BalanceAlertTarget("instance:GroupMessage:sender_ABC", scene="qq_group"),
            True,
            "/v2/groups/ABC/messages",
        ),
    ],
)
@pytest.mark.parametrize("sdk_version", [None, "1.2.0", "1.2.1", "9.99.0"])
async def test_official_uses_live_auth_regardless_of_sdk_metadata(
    adapter, qq_http, target, sandbox, path, sdk_version, sdk_metadata, monkeypatch
):
    metadata_lookups = sdk_metadata(sdk_version)
    monkeypatch.setenv("HTTPS_PROXY", "http://proxy.invalid:8123")
    context = FakeContext(adapter=adapter)
    attach_official(context, adapter, qq_http.auth)
    qq_http.auth.is_sandbox = sandbox
    qq_http.auth._headers = {
        "Authorization": "QQBot stale-token",
        "X-Union-Appid": "stale-app",
    }
    reservations = []
    result = await send_alert(context, target, reservations)

    assert result.status == "submitted"
    assert not metadata_lookups
    assert qq_http.auth.auth_calls == 1
    assert len(qq_http.requests) == len(reservations) == 1
    (request,) = qq_http.requests
    host = "sandbox.api.sgroup.qq.com" if sandbox else "api.bot.qq.com"
    assert (request.method, request.url) == ("POST", httpx.URL(f"https://{host}{path}"))
    assert request.headers["Authorization"] == "QQBot synthetic-token"
    assert request.headers["X-Union-Appid"] == "synthetic-app"
    assert request.headers["Host"] == host
    assert request.headers["Accept-Encoding"] == "identity"
    assert "cookie" not in request.headers
    assert "x-extra" not in request.headers
    assert qq_http.auth._headers["Cookie"] == "sdk-only-cookie"
    assert len(qq_http.transport_options) == 1
    assert qq_http.transport_options[0]["retries"] == 0
    assert qq_http.transport_options[0]["trust_env"] is False
    body = json.loads(request.content)
    assert body == {"msg_type": 0, "content": body["content"]}
    assert "Synthetic account" in body["content"]
    assert not context.sent


@run_async
@pytest.mark.parametrize("sdk_version", [None, "9.99.0"])
async def test_official_diagnostics_report_cached_readiness_without_refresh(
    qq_http, sdk_metadata, sdk_version
):
    metadata_lookups = sdk_metadata(sdk_version)
    context = FakeContext()
    alert = delivery(context)
    assert alert.official_diagnostics((_FRIEND,)) is None
    assert not metadata_lookups

    attach_official(context, "qq_official", qq_http.auth)
    assert alert.official_diagnostics((_FRIEND,)) == {
        "sdk_version": sdk_version,
        "targets": [
            {
                "target_id": _FRIEND.id,
                "transport_available": True,
                "cached_auth_headers_available": False,
                "detail_code": "",
            }
        ],
    }
    assert qq_http.auth.auth_calls == 0
    assert not qq_http.requests

    result = await send_alert(context, _FRIEND, [])
    assert result.status == "submitted"
    ready = alert.official_diagnostics((_FRIEND,))
    assert ready["targets"][0]["cached_auth_headers_available"] is True
    for secret in ("synthetic-token", "synthetic-app", "sdk-only-cookie", "Opaque_ABC"):
        assert secret not in json.dumps(ready)
    assert metadata_lookups == ["qq-botpy", "qq-botpy"]
    assert qq_http.auth.auth_calls == len(qq_http.requests) == 1


@run_async
@pytest.mark.parametrize(
    "response,outcome",
    [
        *[
            (httpx.Response(status, json={"id": "synthetic-message"}), "submitted")
            for status in (200, 201, 202)
        ],
        *[
            (httpx.Response(status, text="sensitive remote body"), "failed")
            for status in (401, 403, 404, 405, 429)
        ],
        *[
            (httpx.Response(status, json={"id": "synthetic-message"}), "unknown")
            for status in (204, 400, 500, 503)
        ],
        (
            httpx.Response(307, headers={"Location": "https://redirect.invalid/"}),
            "unknown",
        ),
        (httpx.Response(200, content=b"sensitive remote body"), "unknown"),
        (httpx.Response(200, content=b"null"), "unknown"),
        (httpx.Response(200, json=True), "unknown"),
        (httpx.Response(200, json={}), "unknown"),
        (httpx.Response(200, json={"id": 42}), "unknown"),
        (httpx.Response(200, json={"id": " "}), "unknown"),
        (httpx.Response(200, json={"id": "id", "code": 42}), "unknown"),
        (httpx.Response(200, json={"id": "id", "err_code": "42"}), "unknown"),
        (
            httpx.Response(
                200,
                stream=ResponseStream(b'{"id":"', b"a" * 65536, b'"}'),
            ),
            "unknown",
        ),
        (
            httpx.Response(
                200,
                headers={"Content-Encoding": "gzip"},
                stream=ResponseStream(gzip.compress(b'{"id":"synthetic-message"}')),
            ),
            "unknown",
        ),
        (ConnectionResetError("sensitive remote body"), "unknown"),
        (httpx.ConnectError("sensitive remote body"), "unknown"),
        (httpx.ReadTimeout("sensitive remote body"), "unknown"),
    ],
)
async def test_official_outcome_from_one_post_without_fallback(
    qq_http, response, outcome, caplog
):
    caplog.set_level(logging.INFO)
    context = FakeContext()
    attach_official(context, "qq_official_webhook", qq_http.auth)
    qq_http.response = response
    reservations = []
    result = await send_alert(context, _FRIEND, reservations)
    assert result.status == outcome
    assert "sensitive remote body" not in result.message
    assert len(qq_http.requests) == len(reservations) == 1
    (request,) = qq_http.requests
    assert request.method == "POST"
    assert request.url.host == "api.bot.qq.com"
    assert request.extensions["timeout"] == dict.fromkeys(
        ("connect", "read", "write", "pool"), 10.0
    )
    for private in (
        "Opaque_ABC",
        "Synthetic account",
        "synthetic-token",
        "synthetic-app",
        "sensitive remote body",
    ):
        assert private not in caplog.text
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
@pytest.mark.parametrize("capability", ["no_client", "no_refresh", "no_sandbox"])
def test_official_missing_sdk_blocks_before_budget(platform, capability, qq_http):
    context = FakeContext(adapter=platform)
    if capability == "no_refresh":
        qq_http.auth.check_session = None
        attach_official(context, platform, qq_http.auth)
    if capability == "no_sandbox":
        qq_http.auth.is_sandbox = 1
        attach_official(context, platform, qq_http.auth)
    calls = []
    result = asyncio.run(send_alert(context, _FRIEND, calls))
    assert result.status == "blocked"
    assert result.reason_code == "transport_unavailable"
    assert qq_http.auth.auth_calls == 0
    assert not qq_http.requests
    assert not calls and not context.sent


@run_async
@pytest.mark.parametrize(
    "headers",
    [
        pytest.param(RuntimeError("synthetic auth secret"), id="refresh-error"),
        pytest.param(None, id="missing-header-map"),
        pytest.param({"X-Union-Appid": "synthetic-app"}, id="missing-token"),
        pytest.param({"Authorization": "QQBot synthetic-token"}, id="missing-appid"),
        pytest.param(
            {
                "Authorization": "Basic synthetic-token",
                "X-Union-Appid": "synthetic-app",
            },
            id="unsupported-scheme",
        ),
        pytest.param(
            {"Authorization": "QQBot  ", "X-Union-Appid": "synthetic-app"},
            id="blank-token",
        ),
        pytest.param(
            {"Authorization": "QQBot None", "X-Union-Appid": "synthetic-app"},
            id="placeholder-token",
        ),
        pytest.param(
            {
                "Authorization": "QQBot synthetic-token\r\n",
                "X-Union-Appid": "synthetic-app",
            },
            id="header-injection",
        ),
        pytest.param(
            {
                "Authorization": "QQBot synthetic-token",
                "authorization": "QQBot another-token",
                "X-Union-Appid": "synthetic-app",
            },
            id="duplicate-token",
        ),
    ],
)
async def test_official_invalid_auth_blocks_before_budget(qq_http, headers):
    context = FakeContext()
    attach_official(context, "qq_official", qq_http.auth)

    async def check_session():
        qq_http.auth.auth_calls += 1
        if isinstance(headers, Exception):
            raise headers
        qq_http.auth._headers = headers

    qq_http.auth.check_session = check_session
    reservations = []
    result = await send_alert(context, _FRIEND, reservations)
    assert result.status == "blocked"
    assert result.reason_code == "transport_unavailable"
    assert "synthetic auth secret" not in result.message
    assert qq_http.auth.auth_calls == 1
    assert not reservations and not qq_http.requests and not context.sent


@run_async
@pytest.mark.parametrize("mode", ["cancelled", "inactive", "permission_revoked"])
async def test_official_rechecks_activity_and_permission_after_auth(qq_http, mode):
    context = FakeContext()
    attach_official(context, "qq_official", qq_http.auth)
    ready = asyncio.Event()
    refresh = asyncio.Event()
    check_session = qq_http.auth.check_session
    auth_tasks = []
    active = True

    async def slow_check_session():
        auth_tasks.append(asyncio.current_task())
        ready.set()
        try:
            await refresh.wait()
        except asyncio.CancelledError:
            # Simulate an SDK refresh that swallows cancellation and returns auth.
            pass
        await check_session()

    qq_http.auth.check_session = slow_check_session
    reservations = []
    sending = asyncio.create_task(
        send_alert(context, _FRIEND, reservations, active=lambda: active)
    )
    await asyncio.wait_for(ready.wait(), timeout=2)
    if mode == "cancelled":
        sending.cancel()
        with pytest.raises(asyncio.CancelledError):
            await sending
        await asyncio.wait_for(auth_tasks[0], timeout=2)
    else:
        active = mode != "inactive"
        context.session_on = mode != "permission_revoked"
        refresh.set()
        result = await sending
        if mode == "permission_revoked":
            assert result.status == "blocked"
            assert result.reason_code == "session_disabled"
        else:
            assert result.status == "cancelled"
    assert qq_http.auth.auth_calls == 1
    assert not reservations and not qq_http.requests and not context.sent


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
    adapter, qq_http, target, scenes, reason
):
    context = FakeContext()
    attach_official(context, adapter, qq_http.auth, scenes=scenes)
    assert delivery(context)._target_reason(target) == reason
    assert not qq_http.requests


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
    adapter, botpy_messages, kind, session, event_type, scene
):
    raw = getattr(botpy_messages, event_type)(
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
async def test_alias_permission_checks_use_the_configured_umo(
    adapter, qq_http, tmp_path
):
    raw, alias = official_group("GroupABC"), official_group("sender_GroupABC")
    config = settings()
    config.balance_alert_targets = (raw, alias)
    context = Context()
    attach_official(context, adapter, qq_http.auth)
    monitor, *_ = engine(tmp_path, config=config, context=context)
    checked = []

    async def session_enabled(umo):
        checked.append(umo)
        return umo == alias.umo

    monitor.delivery.session_enabled = session_enabled
    await monitor.run_once()
    assert checked == [raw.umo, alias.umo, alias.umo, alias.umo]
    (request,) = qq_http.requests
    assert request.url.path == "/v2/groups/GroupABC/messages"
    assert monitor.status()["accounts"][0]["status"] == "submitted"
    await monitor.close()


@run_async
@pytest.mark.parametrize("status", [429, 503])
async def test_aliases_share_durable_outcome_and_budget(
    adapter, qq_http, status, tmp_path
):
    raw, alias = official_group("GroupABC"), official_group("sender_GroupABC")
    config = settings(interval=1)
    config.balance_alert_targets = (raw, alias)
    context = Context()
    attach_official(context, adapter, qq_http.auth)
    qq_http.response = httpx.Response(status, text="synthetic remote error")
    monitor, _, clock, service, _ = engine(tmp_path, config=config, context=context)
    await monitor.run_once()
    assert len(qq_http.requests) == 1
    assert monitor._db.execute("SELECT COUNT(*) FROM budgets").fetchone()[0] == 1
    await monitor.close()

    config.balance_alert_targets = (official_group("new_sender_GroupABC"),)
    qq_http.response = httpx.Response(200, json={"id": "synthetic-message"})
    restarted, _, _, _, _ = engine(tmp_path, config, clock, service, context)
    clock.advance(60)
    await restarted.run_once()
    assert len(qq_http.requests) == 1
    clock.advance(240)
    await restarted.run_once()
    if status == 429:
        assert len(qq_http.requests) == 2
        assert restarted.status()["accounts"][0]["status"] == "submitted"
    else:
        assert len(qq_http.requests) == 1
        assert restarted.status()["accounts"][0]["status"] == "unknown"
    await restarted.close()


@run_async
@pytest.mark.parametrize("legacy_status", ["unknown", "reserved", "submitted"])
async def test_legacy_official_alias_migrates_on_restart(
    adapter, qq_http, legacy_status, tmp_path
):
    raw, alias = official_group("GroupABC"), official_group("sender_GroupABC")
    config = settings(interval=1)
    config.balance_alert_targets = (raw, alias)
    context = Context()
    attach_official(context, adapter, qq_http.auth)
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
    assert len(qq_http.requests) == 1
    assert restarted.status()["accounts"][0]["status"] == (
        "submitted" if legacy_status == "submitted" else "unknown"
    )
    await restarted.close()


@run_async
async def test_deleted_legacy_unknown_alias_suppresses_only_official_until_next_episode(
    qq_http, tmp_path
):
    legacy = official_group("removed_sender_GroupABC")
    current = official_group("GroupABC")
    onebot = BalanceAlertTarget("onebot:GroupMessage:100", ("234",))
    config = settings(interval=1)
    config.balance_alert_targets = (legacy,)
    context = Context()
    attach_official(context, "qq_official_webhook", qq_http.auth)
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
    assert len(context.sent) == len(qq_http.requests) == 1
    assert restarted.status()["accounts"][0]["detail_code"] == "legacy_target_unknown"

    service.amounts["account-0"] = config.accounts[
        0
    ].balance_alert.effective_recovery_threshold
    clock.advance()
    await restarted.run_once()
    service.amounts["account-0"] = config.accounts[0].balance_alert.threshold
    clock.advance()
    await restarted.run_once()
    assert len(context.sent) == len(qq_http.requests) == 2
    assert restarted.status()["accounts"][0]["status"] == "submitted"
    await restarted.close()
