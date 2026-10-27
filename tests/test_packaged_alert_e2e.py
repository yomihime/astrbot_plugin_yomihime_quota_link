"""Release ZIP alert acceptance: real plugin chain, synthetic host and HTTP only.

The child uses ``-I`` and rejects development ``quota_link`` imports. It exercises
registered Dashboard handlers, commands, the started scheduler, real providers,
and pinned SDK message components. It is not a live AstrBot/QQ deployment test.
"""

from __future__ import annotations

import ast
import asyncio
import hashlib
import importlib
import importlib.abc
import json
import os
import shutil
import socket
import subprocess
import sys
import time
import zipfile
from dataclasses import dataclass, field
from datetime import UTC, datetime
from pathlib import Path
from types import ModuleType, SimpleNamespace

COMPONENT_HASH = "5a8dbf0ffb62cf83dcd333feb48e17acdf1a757ffcb63848423cf42585bc327f"
CHAIN_HASH = "1496a597508319b69db53816ea02b8c9be9cecba2ee5001ed5f2934310c98219"
PLUGIN = "astrbot_plugin_yomihime_quota_link"
TARGET = "synthetic-qq:GroupMessage:42"
SECRET = "synthetic-packaged-e2e-not-a-real-key"


def test_release_zip_runs_complete_alert_chain(tmp_path):
    """No query/engine/delivery implementation is replaced by a test double."""
    root = Path(__file__).resolve().parents[1]
    host = Path(os.environ.get("QUOTA_TEST_ASTRBOT_SOURCE", ""))
    font = Path(os.environ.get("QUOTA_TEST_FONT", ""))
    assert (host / "astrbot/core/message/components.py").is_file(), (
        "QUOTA_TEST_ASTRBOT_SOURCE must point to the pinned official fixture"
    )
    assert font.is_file(), "QUOTA_TEST_FONT must point to the pinned Noto fixture"
    # Resolve only already-installed test dependency paths, never source trees.
    dependency_paths = [
        str(Path(path).resolve())
        for path in sys.path
        if path and Path(path).name in {"site-packages", "dist-packages"}
    ]
    version = next(
        line.split(":", 1)[1].strip().strip("\"'")
        for line in (root / "metadata.yaml").read_text().splitlines()
        if line.startswith("version:")
    )
    built = subprocess.run(
        [
            sys.executable,
            str(root / "scripts/build_plugin.py"),
            "--tag",
            "v" + version.lstrip("v"),
            "--output-dir",
            str(tmp_path / "dist"),
        ],
        cwd=tmp_path,
        check=True,
        capture_output=True,
        text=True,
    )
    archive = Path(built.stdout.strip())
    unpacked = tmp_path / "unpacked"
    with zipfile.ZipFile(archive) as package:
        assert "quota_link/alerts.py" in package.namelist()
        assert "quota_link/alert_delivery.py" in package.namelist()
        assert not any(name.startswith("tests/") for name in package.namelist())
        package.extractall(unpacked)
    env = {
        key: value
        for key, value in os.environ.items()
        if not key.startswith(("QUOTA_", "PYTHON"))
        and key.lower() not in {"http_proxy", "https_proxy", "all_proxy"}
    }
    child = subprocess.run(
        [
            sys.executable,
            "-I",
            str(Path(__file__).resolve()),
            "--run-packaged",
            str(unpacked),
            str(tmp_path / "state"),
            str(host.resolve()),
            str(font.resolve()),
            json.dumps(dependency_paths),
        ],
        cwd=tmp_path,
        env=env,
        capture_output=True,
        text=True,
        timeout=60,
    )
    assert child.returncode == 0, child.stdout + child.stderr
    evidence = json.loads(child.stdout.strip().splitlines()[-1])
    assert evidence["http_requests"] >= 6
    assert evidence["submitted"] == 2
    assert evidence["llm_calls"] == 3
    assert evidence["normal_no_send"]
    assert evidence["restart_no_repeat"]
    assert evidence["terminate_no_late_send"]
    assert evidence["web_auth_cas_and_command_or"]
    assert evidence["socket_attempts"] == 0
    assert evidence["modules_from_zip"] >= 20
    (tmp_path / "packaged-alert-evidence.json").write_text(
        json.dumps(evidence, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )


class _NoDevelopmentImports(importlib.abc.MetaPathFinder):
    def find_spec(self, fullname, path=None, target=None):
        if fullname == "quota_link" or fullname.startswith("quota_link."):
            raise AssertionError("development quota_link import is forbidden")
        return None


def _official_components(host):
    """Execute complete At/Plain/chain classes from SHA-pinned official source."""
    from pydantic.v1 import BaseModel
    from typing_extensions import deprecated

    module = ModuleType("packaged_official_message_components")
    sys.modules[module.__name__] = module
    ns = module.__dict__
    ns.update(
        BaseModel=BaseModel, deprecated=deprecated, dataclass=dataclass, field=field
    )
    from enum import Enum

    ns["Enum"] = Enum
    for relative, expected, names in (
        (
            "astrbot/core/message/components.py",
            COMPONENT_HASH,
            {"ComponentType", "BaseMessageComponent", "At", "Plain"},
        ),
        (
            "astrbot/core/message/message_event_result.py",
            CHAIN_HASH,
            {"MessageChain"},
        ),
    ):
        raw = (host / relative).read_bytes()
        assert hashlib.sha256(raw).hexdigest() == expected
        nodes = [
            node
            for node in ast.parse(raw).body
            if isinstance(node, ast.ClassDef) and node.name in names
        ]
        assert len(nodes) == len(names)
        future = ast.ImportFrom(
            module="__future__", names=[ast.alias(name="annotations")], level=0
        )
        exec(
            compile(
                ast.fix_missing_locations(
                    ast.Module(body=[future, *nodes], type_ignores=[])
                ),
                str(host / relative),
                "exec",
            ),
            ns,
        )
    for name in ("BaseMessageComponent", "At", "Plain"):
        ns[name].update_forward_refs(**ns)
    return module


class _RequestProxy:
    current = None

    def __getattr__(self, name):
        return getattr(self.current, name)


class _Headers:
    def __init__(self, pairs):
        self.pairs = pairs

    def getlist(self, key):
        return [v for k, v in self.pairs if k.lower() == key.lower()]


class _Verifier:
    def _validate_dashboard_token(self, token, path):
        assert token == "test.header.signature"
        assert path.startswith(f"/api/plug/{PLUGIN}/admin/")
        return {"username": "admin", "exp": int(time.time()) + 600}, ""


class _Request:
    def __init__(self, operation, payload, *, authenticated=True):
        self.method = "POST"
        self.path = f"/api/plug/{PLUGIN}/admin/{operation}"
        self.username = "admin"
        self.body = json.dumps(payload).encode()
        self.headers = _Headers(
            [
                ("authorization", "Bearer test.header.signature"),
                (
                    "origin",
                    "https://dashboard.example"
                    if authenticated
                    else "https://attacker.invalid",
                ),
                ("content-type", "application/json"),
                ("content-length", str(len(self.body))),
            ]
        )
        app = SimpleNamespace(state=SimpleNamespace())
        app.state.dashboard_app_adapter = SimpleNamespace(
            _app=app, _dashboard_server=_Verifier()
        )
        self._request = SimpleNamespace(
            app=app,
            method=self.method,
            headers=self.headers,
            url=SimpleNamespace(
                scheme="https", netloc="dashboard.example", path=self.path
            ),
            state=SimpleNamespace(dashboard_g=SimpleNamespace(username="admin")),
            stream=self.stream,
            is_disconnected=self.is_disconnected,
        )

    def _get_current(self):
        return self

    async def stream(self):
        yield self.body

    async def is_disconnected(self):
        return False


class _Event:
    def __init__(self, text, *, sender="123", platform="aiocqhttp", admin=False):
        self.text, self.sender, self.platform, self.admin = (
            text,
            sender,
            platform,
            admin,
        )
        self.unified_msg_origin = "synthetic-qq:FriendMessage:123"

    def get_message_str(self):
        return self.text

    def is_private_chat(self):
        return True

    def is_admin(self):
        return self.admin

    def get_sender_id(self):
        return self.sender

    def get_group_id(self):
        return ""

    def get_platform_name(self):
        return self.platform

    def plain_result(self, text):
        return text


class _Clock:
    def __init__(self):
        self.now = 1800000000.0
        self.sleepers = []

    def time(self):
        return self.now

    async def sleep(self, seconds):
        future = asyncio.get_running_loop().create_future()
        self.sleepers.append((self.now + seconds, future))
        try:
            await future
        finally:
            self.sleepers = [(t, f) for t, f in self.sleepers if f is not future]

    def advance(self, seconds):
        self.now += seconds
        for deadline, future in list(self.sleepers):
            if deadline <= self.now and not future.done():
                future.set_result(None)


class _Context:
    def __init__(self, components):
        self.components = components
        self.registered_web_apis = []
        self.sent = []
        self.host_calls = []
        self.llm_calls = []
        self.llm_mode = "success"
        self.llm_entered = asyncio.Event()
        self.llm_release = asyncio.Event()
        self.llm_cancelled = asyncio.Event()
        self.llm_finished = asyncio.Event()
        self.conversation_manager = SimpleNamespace(
            get_curr_conversation_id=self.get_curr_conversation_id,
            get_conversation=self.get_conversation,
        )
        self.persona_manager = SimpleNamespace(
            resolve_selected_persona=self.resolve_selected_persona
        )

    def register_web_api(self, path, handler, methods, desc):
        self.registered_web_apis.append((path, handler, methods, desc))

    def get_registered_star(self, name):
        return None

    def get_platform_inst(self, platform_id):
        assert platform_id == "synthetic-qq"
        return SimpleNamespace(
            meta=lambda: SimpleNamespace(id=platform_id, name="aiocqhttp")
        )

    def get_config(self, *, umo):
        assert umo == TARGET
        self.host_calls.append(("config", umo))
        return {
            "provider_settings": {"enable": True},
            "agent_runner": {"runner_type": "local"},
        }

    async def get_current_chat_provider_id(self, umo):
        assert umo == TARGET
        self.host_calls.append(("model", umo))
        return "synthetic-target-model"

    async def get_curr_conversation_id(self, umo):
        assert umo == TARGET
        self.host_calls.append(("conversation", umo))
        return "existing-conversation"

    async def get_conversation(self, umo, conversation_id, *, create_if_not_exists):
        assert (umo, conversation_id, create_if_not_exists) == (
            TARGET,
            "existing-conversation",
            False,
        )
        return SimpleNamespace(persona_id="conversation-persona")

    async def resolve_selected_persona(
        self, *, umo, conversation_persona_id, platform_name, provider_settings
    ):
        assert (umo, conversation_persona_id, platform_name) == (
            TARGET,
            "conversation-persona",
            "aiocqhttp",
        )
        assert provider_settings == {"enable": True}
        self.host_calls.append(("persona", umo))
        return "resolved-persona", {"prompt": "Speak gently."}, None, False

    async def llm_generate(
        self, *, chat_provider_id, prompt, system_prompt, contexts, tools
    ):
        assert chat_provider_id == "synthetic-target-model"
        assert contexts == [] and tools is None
        assert "Speak gently." in system_prompt
        for sensitive in (SECRET, TARGET, "Package Account", "5 CNY"):
            assert sensitive not in prompt + system_prompt
        self.llm_calls.append(chat_provider_id)
        if self.llm_mode == "fail":
            raise RuntimeError("synthetic model unavailable")
        if self.llm_mode == "late":
            self.llm_entered.set()
            try:
                await self.llm_release.wait()
            except asyncio.CancelledError:
                self.llm_cancelled.set()
                await self.llm_release.wait()
            finally:
                self.llm_finished.set()
        return SimpleNamespace(completion_text="温馨提醒：请及时检查账户额度。")

    async def send_message(self, umo, message_chain):
        assert umo == TARGET
        assert type(message_chain) is self.components.MessageChain
        assert [type(item) for item in message_chain.chain] == [
            self.components.At,
            self.components.Plain,
        ]
        segments = [item.toDict() for item in message_chain.chain]
        assert segments[0] == {"type": "at", "data": {"qq": "456"}}
        assert segments[1]["type"] == "text"
        assert "5 CNY" in segments[1]["data"]["text"]
        assert "10 CNY" in segments[1]["data"]["text"]
        assert SECRET not in repr(segments)
        self.sent.append((umo, segments))
        return True  # Submission only, not proof of delivery to QQ.


def _install_host(state, components, proxy):
    def module(name, **items):
        value = ModuleType(name)
        value.__dict__.update(items)
        value.__path__ = []
        sys.modules[name] = value
        return value

    def decorator(*args, **kwargs):
        return lambda function: function

    class Star:
        def __init__(self, context, config):
            self.context = context

    class SessionServiceManager:
        @staticmethod
        async def is_session_enabled(umo):
            assert umo == TARGET
            return True

        @staticmethod
        async def is_llm_enabled_for_session(umo):
            assert umo == TARGET
            return True

    module("astrbot")
    module("astrbot.api")
    module("astrbot.core")
    module("astrbot.core.star")
    module(
        "astrbot.core.star.session_llm_manager",
        SessionServiceManager=SessionServiceManager,
    )
    module(
        "astrbot.api.star",
        Star=Star,
        register=decorator,
        StarTools=SimpleNamespace(get_data_dir=lambda _: state),
    )
    module(
        "astrbot.api.event",
        AstrMessageEvent=_Event,
        filter=SimpleNamespace(command=decorator, llm_tool=decorator),
        MessageChain=components.MessageChain,
    )
    module("astrbot.api.message_components", At=components.At, Plain=components.Plain)
    module(
        "astrbot.api.web",
        request=proxy,
        json_response=lambda body, status_code=200, headers=None: SimpleNamespace(
            body=body, status_code=status_code, headers=headers
        ),
    )


async def _eventually(predicate, description):
    # Give real filesystem worker threads time without any wall-clock minute wait.
    async with asyncio.timeout(10):
        while not predicate():
            await asyncio.sleep(0)
    assert predicate(), description


async def _scenario(unpacked, state, host, font):
    import httpx

    state.mkdir(mode=0o700)
    components = _official_components(host)
    proxy = _RequestProxy()
    _install_host(state, components, proxy)
    package = ModuleType("packaged_yql")
    package.__path__ = [str(unpacked)]
    sys.modules[package.__name__] = package
    main = importlib.import_module("packaged_yql.main")
    alerts = importlib.import_module("packaged_yql.quota_link.alerts")
    deepseek = importlib.import_module("packaged_yql.quota_link.providers.deepseek")
    font_module = importlib.import_module("packaged_yql.quota_link.presentation.font")
    font_data = font.read_bytes()
    assert len(font_data) == font_module.FONT_SIZE
    assert hashlib.sha256(font_data).hexdigest() == font_module.FONT_SHA256
    font_dest = state / "resources/fonts" / main.FONT_FILENAME
    font_dest.parent.mkdir(parents=True)
    shutil.copyfile(font, font_dest)
    clock = _Clock()
    # Inject supported dependency clocks, not scheduler/query/provider behavior.
    alerts.AlertEngine.__init__.__kwdefaults__.update(
        clock=clock.time, sleep=clock.sleep
    )
    main.QueryService.__init__.__kwdefaults__.update(
        monotonic=clock.time,
        wall_clock=lambda: datetime.fromtimestamp(clock.now, UTC),
    )
    main.BalanceCache.__init__.__defaults__ = (clock.time,)

    class VirtualDatetime(datetime):
        @classmethod
        def now(cls, tz=None):
            return datetime.fromtimestamp(clock.now, tz)

    deepseek.datetime = VirtualDatetime
    balance, http_requests = ["100"], []

    def transport(request):
        assert request.method == "GET"
        assert str(request.url) == "https://api.deepseek.com/user/balance"
        assert request.headers["Authorization"] == f"Bearer {SECRET}"
        http_requests.append(balance[0])
        return httpx.Response(
            200,
            json={
                "is_available": True,
                "balance_infos": [
                    {
                        "currency": "CNY",
                        "total_balance": balance[0],
                        "granted_balance": "0",
                        "topped_up_balance": balance[0],
                    }
                ],
            },
        )

    original_client = httpx.AsyncClient

    def guarded_client(*args, **kwargs):
        assert "transport" not in kwargs
        kwargs["transport"] = httpx.MockTransport(transport)
        return original_client(*args, **kwargs)

    httpx.AsyncClient = guarded_client
    context = _Context(components)
    plugin = main.YomihimeQuotaLink(context, {"enable_admin_page": True})

    async def web(operation, body=None, *, code=200, authenticated=True):
        proxy.current = _Request(operation, body or {}, authenticated=authenticated)
        path = f"/{PLUGIN}/admin/{operation}"
        handlers = [h for p, h, _, _ in context.registered_web_apis if p == path]
        assert len(handlers) == 1
        response = await handlers[0]()
        assert response.status_code == code, response.body
        assert SECRET not in repr(response.body)
        return response.body.get("data")

    async def command(text, **identity):
        return [value async for value in plugin.quota_link(_Event(text, **identity))]

    def account_status():
        return plugin._alert_engine.status()["accounts"][0]

    async def tick(value, seconds=61):
        before = len(http_requests)
        balance[0] = value
        await _eventually(lambda: bool(clock.sleepers), "scheduler sleep registered")
        clock.advance(seconds)
        await _eventually(lambda: len(http_requests) > before, "real scheduled HTTP")
        return before

    try:
        await plugin.initialize()
        assert not plugin._storage_failed
        assert type(plugin.service) is main.QueryService
        assert type(plugin.http_client) is main.HttpProviderClient
        assert type(plugin._alert_engine) is alerts.AlertEngine
        assert plugin._alert_engine._task is not None
        assert not plugin._alert_engine._task.done()
        await web("read", code=403, authenticated=False)
        initial = await web("read")
        config = initial["config"]
        config.update(
            balance_alert_targets=[{"umo": TARGET, "mentions": ["456"]}],
            balance_alert_admin_qq_ids=["123"],
            balance_alert_llm={"enabled": True},
            providers=[
                {
                    "id": "demo",
                    "type": "deepseek",
                    "display_name": "Package Account",
                    "enabled": True,
                    "balance_alert": {
                        "enabled": False,
                        "metric": "total_balance",
                        "threshold": None,
                        "unit": "",
                    },
                }
            ],
        )
        saved = await web("update", {"revision": initial["revision"], "config": config})
        assert saved["revision"] > initial["revision"]
        await web(
            "update", {"revision": initial["revision"], "config": config}, code=409
        )
        saved = await web(
            "credential-replace",
            {
                "revision": saved["revision"],
                "account_id": "demo",
                "field": "api_key",
                "value": SECRET,
            },
        )
        assert saved["credentials"]["demo"]["api_key"]["configured"]
        # The complete OR policy runs at the actual command boundary.
        revision = saved["revision"]
        for identity in (
            {"sender": "123", "platform": "telegram"},
            {"sender": "999", "platform": "aiocqhttp"},
        ):
            denied = await command(
                '/yql alert interval "Package Account" 9', **identity
            )
            assert denied and "权限" in denied[0], denied
            assert (await web("read"))["revision"] == revision
        replies = await command('/yql alert interval "Package Account" 1')
        assert replies and "已保存" in replies[0], replies
        replies = await command(
            '/yql alert threshold "Package Account" 10',
            sender="host-admin",
            platform="telegram",
            admin=True,
        )
        assert replies and "已保存" in replies[0], replies
        assert plugin.settings.accounts[0].balance_alert.check_interval_minutes == 1
        assert not http_requests and not context.sent
        replies = await command('/yql alert on "Package Account"')
        assert replies and "已保存" in replies[0], replies
        await _eventually(lambda: account_status()["status"] == "monitoring", "normal")
        assert http_requests == ["100"] and not context.sent
        units = await web("alert-units")
        assert units["accounts"][0]["unit"] == "CNY", units
        assert (
            plugin.settings.accounts[0].balance_alert.unit == ""
        )  # Auto, not user text.
        assert plugin.service.peek_snapshot("demo").balances[0].unit == "CNY"
        await tick("5")
        await _eventually(lambda: len(context.sent) == 1, "first crossing submitted")
        await _eventually(
            lambda: account_status()["status"] == "submitted", "persisted submission"
        )
        assert "温馨提醒" in context.sent[0][1][1]["data"]["text"]
        assert {name for name, _ in context.host_calls} >= {
            "config",
            "model",
            "conversation",
            "persona",
        }
        # Persistent episode and auto-bound unit survive actual full reinitialize.
        old_task = plugin._alert_engine._task
        await plugin.initialize()
        assert old_task.done()
        assert plugin._alert_engine._task is not old_task
        await tick("5")
        await _eventually(lambda: account_status()["status"] == "submitted", "restart")
        assert len(context.sent) == 1 and len(context.llm_calls) == 1
        await tick("100")
        await _eventually(lambda: account_status()["status"] == "recovered", "recovery")
        context.llm_mode = "fail"
        await tick("5", seconds=301)
        await _eventually(lambda: len(context.sent) == 2, "fixed-text fallback")
        await _eventually(
            lambda: account_status()["detail_code"] == "fixed_hint",
            "persisted fallback",
        )
        assert "温馨提醒" not in context.sent[1][1][1]["data"]["text"]
        await tick("100")
        await _eventually(
            lambda: account_status()["status"] == "recovered", "recovery2"
        )
        context.llm_mode = "late"
        await tick("5", seconds=301)
        await _eventually(context.llm_entered.is_set, "late LLM entered")
        task = plugin._alert_engine._task
        terminating = asyncio.create_task(plugin.terminate())
        await _eventually(context.llm_cancelled.is_set, "LLM cancelled by terminate")
        context.llm_release.set()
        await terminating
        await _eventually(context.llm_finished.is_set, "late fake LLM completed")
        assert task.done() and len(context.sent) == 2
        count = len(http_requests)
        clock.advance(3600)
        for _ in range(20):
            await asyncio.sleep(0)
        assert len(http_requests) == count and len(context.sent) == 2
        assert not context.registered_web_apis
        assert not plugin._cleanup_tasks
        for persisted in state.rglob("*"):
            if persisted.is_file() and persisted.stat().st_size < 1024 * 1024:
                assert SECRET.encode() not in persisted.read_bytes()
        modules = [
            module
            for name, module in sys.modules.items()
            if name.startswith("packaged_yql.") and getattr(module, "__file__", None)
        ]
        for module in modules:
            assert Path(module.__file__).resolve().is_relative_to(unpacked.resolve())
        assert "quota_link" not in sys.modules
        assert main.QueryService.__module__ == "packaged_yql.quota_link.service"
        assert (
            type(main.IMPLEMENTED_ADAPTERS[deepseek.ProviderType.DEEPSEEK])
            is deepseek.DeepSeekAdapter
        )
        return {
            "http_requests": len(http_requests),
            "submitted": len(context.sent),
            "llm_calls": len(context.llm_calls),
            "normal_no_send": True,
            "restart_no_repeat": True,
            "terminate_no_late_send": True,
            "web_auth_cas_and_command_or": True,
            "modules_from_zip": len(modules),
        }
    except BaseException:
        print(
            "DIAGNOSTIC",
            plugin._alert_status(),
            "http",
            http_requests,
            "units",
            plugin._alert_units(),
            file=sys.stderr,
        )
        raise
    finally:
        context.llm_release.set()
        await plugin.terminate()


def _run_packaged():
    unpacked, state, host, font = map(Path, sys.argv[2:6])
    for path in json.loads(sys.argv[6]):
        candidate = Path(path)
        assert candidate.name in {"site-packages", "dist-packages"}
        if str(candidate) not in sys.path:
            sys.path.append(str(candidate))
    sys.meta_path.insert(0, _NoDevelopmentImports())
    socket_attempts = []

    def no_connect(*args, **kwargs):
        socket_attempts.append(True)
        raise AssertionError("packaged acceptance must never open a network socket")

    socket.socket.connect = no_connect
    socket.socket.connect_ex = no_connect
    socket.getaddrinfo = no_connect
    evidence = asyncio.run(_scenario(unpacked, state, host, font))
    evidence["socket_attempts"] = len(socket_attempts)
    assert not socket_attempts
    print(json.dumps(evidence, sort_keys=True))


if __name__ == "__main__":
    assert sys.argv[1] == "--run-packaged"
    _run_packaged()
