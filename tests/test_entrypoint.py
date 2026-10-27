import asyncio
import importlib
import importlib.abc
import json
import sys
import types
from datetime import UTC, datetime
from pathlib import Path
from uuid import uuid4

import pytest

ROOT = Path(__file__).resolve().parents[1]


class FakeEvent:
    def __init__(
        self,
        text,
        *,
        private=True,
        admin=False,
        user="user-1",
        group="group-1",
        platform="telegram",
    ):
        self.text = text
        self.private = private
        self.admin = admin
        self.user = user
        self.group = group
        self.platform = platform
        self.extras = {}
        self.replies = []

    def get_message_str(self):
        return self.text

    def is_private_chat(self):
        return self.private

    def is_admin(self):
        return self.admin

    def get_sender_id(self):
        return self.user

    def get_group_id(self):
        return self.group

    def get_platform_name(self):
        return self.platform

    def set_extra(self, key, value):
        self.extras[key] = value

    def get_extra(self, key, default=None):
        return self.extras.get(key, default)

    def plain_result(self, text):
        self.replies.append(text)
        return text


class FakeHttpResponse:
    status_code = 401

    def json(self):
        return {}


class FakeHttpClient:
    instances = []

    def __init__(self, **kwargs):
        self.closed = False
        self.requests = []
        self.__class__.instances.append(self)

    async def request(self, method, url, **kwargs):
        self.requests.append((method, url, kwargs))
        return FakeHttpResponse()

    async def close(self):
        self.closed = True


def _identity_decorator(*args, **kwargs):
    return lambda function: function


def _tool_decorator(*args, **kwargs):
    def decorate(function):
        function._llm_tool_name = kwargs.get("name")
        return function

    return decorate


@pytest.fixture
def entrypoint(monkeypatch):
    for name in tuple(sys.modules):
        if name == "quota_link" or name.startswith("quota_link."):
            monkeypatch.delitem(sys.modules, name)

    class RejectTopLevelQuotaLink(importlib.abc.MetaPathFinder):
        def find_spec(self, fullname, path=None, target=None):
            if fullname == "quota_link" or fullname.startswith("quota_link."):
                raise AssertionError("plugin imported top-level quota_link")
            return None

    monkeypatch.setattr(sys, "meta_path", [RejectTopLevelQuotaLink(), *sys.meta_path])

    astrbot = types.ModuleType("astrbot")
    api = types.ModuleType("astrbot.api")
    event_module = types.ModuleType("astrbot.api.event")
    star_module = types.ModuleType("astrbot.api.star")
    filter_api = types.SimpleNamespace(
        command=_identity_decorator,
        llm_tool=_tool_decorator,
    )
    event_module.AstrMessageEvent = FakeEvent
    event_module.filter = filter_api
    star_module.Star = type(
        "Star", (), {"__init__": lambda self, context, config=None: None}
    )
    star_module.register = _identity_decorator
    api.event = event_module
    api.star = star_module
    astrbot.api = api
    for name, module in (
        ("astrbot", astrbot),
        ("astrbot.api", api),
        ("astrbot.api.event", event_module),
        ("astrbot.api.star", star_module),
    ):
        monkeypatch.setitem(sys.modules, name, module)

    package_name = f"data.plugins.yql_test_{uuid4().hex}"
    data_package = types.ModuleType("data")
    data_package.__path__ = []
    plugins_package = types.ModuleType("data.plugins")
    plugins_package.__path__ = []
    plugin_package = types.ModuleType(package_name)
    plugin_package.__path__ = [str(ROOT)]
    monkeypatch.setitem(sys.modules, "data", data_package)
    monkeypatch.setitem(sys.modules, "data.plugins", plugins_package)
    monkeypatch.setitem(sys.modules, package_name, plugin_package)

    module = importlib.import_module(f"{package_name}.main")
    monkeypatch.setattr(module, "HttpProviderClient", FakeHttpClient)

    async def no_font(root, ygl_font_path=None):
        return None

    monkeypatch.setattr(module, "prepare_font", no_font)
    # Existing text-contract tests explicitly exercise the fallback path.
    monkeypatch.setattr(
        module, "render_result_card", lambda result, font_path=None: None
    )
    monkeypatch.setattr(module, "render_local_card", lambda spec, font_path=None: None)
    FakeHttpClient.instances.clear()
    models = importlib.import_module(f"{package_name}.quota_link.models")
    module.YomihimeQuotaLink._test_models = models
    return module.YomihimeQuotaLink


def _config():
    return {
        "providers": [
            {
                "id": "grsai-work",
                "type": "deepseek",
                "display_name": "DeepSeek Work",
                "aliases": ["Grsai Work"],
                "auth": {"api_key": "test-placeholder"},
            },
            {
                "id": "openai-main",
                "type": "openai_compatible",
                "display_name": "Nova Quota",
                "auth": {"api_key": "test-placeholder-2"},
                "endpoint": {
                    "url": "https://example.invalid/balance",
                    "auth_mode": "bearer",
                },
                "response_mapping": {"amount_path": "/remaining"},
            },
        ]
    }


async def _collect(generator):
    return [item async for item in generator]


def test_all_command_forms_keep_the_complete_multiword_argument(entrypoint):
    plugin = entrypoint(None, _config())
    cases = (
        ("/yql", "额度与用量查询"),
        ("/yql all", "额度与用量查询"),
        ("/yql provider openai compatible", "供应商查询：OpenAI 兼容服务"),
        ("/yql account grsai-work", "账户查询：DeepSeek Work"),
        ("/yql grsai-work", "账户查询：DeepSeek Work"),
        ("/yql help", "用法："),
        ("/yql status", "账户：共 2 个"),
    )
    for message, expected in cases:
        event = FakeEvent(message, admin=True)
        asyncio.run(_collect(plugin.quota_link(event)))
        assert len(event.replies) == 1
        assert expected in event.replies[0]


def test_llm_tool_returns_json_facts_without_sending_a_message(entrypoint):
    plugin = entrypoint(None, _config())
    assert plugin.query_balance_tool.__func__._llm_tool_name == "yql_query_balance"
    assert "operation(string):" in plugin.query_balance_tool.__doc__
    assert "target(string):" in plugin.query_balance_tool.__doc__

    event = FakeEvent("请帮我查一下", admin=True)
    returned = asyncio.run(plugin.query_balance_tool(event, "query", "grsai-work"))

    payload = json.loads(returned)
    assert payload["schema_version"] == 1
    assert payload["operation"] == "query"
    assert payload["target"] == {"kind": "account", "name": "grsai-work"}
    assert payload["accounts"][0]["status"] == "unavailable"
    assert payload["accounts"][0]["error"]["category"] == "authentication"
    assert event.replies == []
    assert len(FakeHttpClient.instances[-1].requests) == 1


def test_list_tool_returns_local_capabilities_without_network_or_message(entrypoint):
    plugin = entrypoint(None, _config())
    event = FakeEvent("我能查什么", admin=True)

    returned = asyncio.run(plugin.query_balance_tool(event, "list", "ignored"))

    payload = json.loads(returned)
    assert payload["schema_version"] == 1
    assert payload["operation"] == "list"
    assert [account["id"] for account in payload["accounts"]] == [
        "grsai-work",
        "openai-main",
    ]
    assert payload["accounts"][0]["balance_scope"] == "account"
    assert FakeHttpClient.instances[-1].requests == []
    assert event.replies == []


def test_permission_gate_precedes_local_account_disclosure(entrypoint):
    plugin = entrypoint(None, _config())
    event = FakeEvent("/yql status", private=False)
    asyncio.run(_collect(plugin.quota_link(event)))
    assert event.replies == ["当前会话无权查询额度信息。"]
    assert "DeepSeek Work" not in event.replies[0]


def test_private_defaults_to_admin_only_for_command_and_tool(entrypoint):
    plugin = entrypoint(None, _config())
    event = FakeEvent("/yql status")

    asyncio.run(_collect(plugin.quota_link(event)))
    listed = asyncio.run(plugin.query_balance_tool(event, "list", "all"))

    assert event.replies == ["当前会话无权查询额度信息。"]
    assert json.loads(listed)["error"]["category"] == "permission"
    assert FakeHttpClient.instances[-1].requests == []


def test_private_platform_whitelist_allows_tool_but_not_command_by_default(entrypoint):
    config = _config()
    config["private_allowed_user_ids"] = ["telegram:user-1"]
    plugin = entrypoint(None, config)
    allowed = FakeEvent("/yql status")
    other_platform = FakeEvent("查余额", platform="discord")

    asyncio.run(_collect(plugin.quota_link(allowed)))
    listed = asyncio.run(plugin.query_balance_tool(allowed, "list", "all"))
    denied = asyncio.run(plugin.query_balance_tool(other_platform, "list", "all"))

    assert allowed.replies == ["当前会话无权查询额度信息。"]
    assert [item["id"] for item in json.loads(listed)["accounts"]] == [
        "grsai-work",
        "openai-main",
    ]
    assert json.loads(denied)["error"]["category"] == "permission"


def test_command_admin_switch_keeps_private_whitelist_gate(entrypoint):
    config = _config()
    config["command_admin_only"] = False
    config["private_allowed_user_ids"] = ["telegram:user-1"]
    plugin = entrypoint(None, config)
    allowed = FakeEvent("/yql status")
    denied = FakeEvent("/yql status", user="other")

    asyncio.run(_collect(plugin.quota_link(allowed)))
    asyncio.run(_collect(plugin.quota_link(denied)))

    assert "账户：共 2 个" in allowed.replies[0]
    assert denied.replies == ["当前会话无权查询额度信息。"]


def test_tool_has_no_message_listener_and_command_still_works(entrypoint):
    plugin = entrypoint(None, _config())
    assert not hasattr(plugin, "natural_language_query")
    event = FakeEvent("/yql provider openai compatible", admin=True)
    asyncio.run(_collect(plugin.quota_link(event)))
    assert len(event.replies) == 1


def test_tool_permission_gate_and_unknown_target(entrypoint):
    plugin = entrypoint(None, _config())
    denied = FakeEvent("任意文本", private=False)
    denied_result = asyncio.run(plugin.query_balance_tool(denied, "query", "DeepSeek"))
    assert json.loads(denied_result) == {
        "schema_version": 1,
        "operation": "query",
        "error": {
            "category": "permission",
            "message": "当前会话无权查询额度信息。",
        },
    }
    assert denied.replies == []
    unknown = FakeEvent("任意文本", admin=True)
    unknown_result = asyncio.run(plugin.query_balance_tool(unknown, "query", "missing"))
    assert json.loads(unknown_result)["error"]["category"] == "unknown_target"
    assert "未找到匹配" in json.loads(unknown_result)["error"]["message"]
    assert unknown.replies == []


def test_permission_denial_happens_before_directory_access(entrypoint, monkeypatch):
    plugin = entrypoint(None, _config())
    module = importlib.import_module(plugin.__class__.__module__)

    class DeniedSettings:
        allow_group_queries = False

        @property
        def directory(self):
            raise AssertionError("directory was read before permission passed")

    plugin.settings = DeniedSettings()
    monkeypatch.setattr(module, "can_query", lambda context, settings, **kwargs: False)
    event = FakeEvent("任意文本", private=False)

    result = asyncio.run(plugin.query_balance_tool(event, "list", "all"))

    assert json.loads(result)["error"]["category"] == "permission"
    assert event.replies == []


@pytest.mark.parametrize("operation", [None, 12, [], {}])
def test_invalid_operation_type_returns_tool_error_after_permission(
    entrypoint, operation
):
    plugin = entrypoint(None, _config())
    event = FakeEvent("查余额", admin=True)

    result = asyncio.run(plugin.query_balance_tool(event, operation, "all"))

    payload = json.loads(result)
    assert payload["operation"] == "query"
    assert payload["error"]["category"] == "invalid_operation"
    assert event.replies == []
    assert FakeHttpClient.instances[-1].requests == []


@pytest.mark.parametrize("target", [None, 12, [], {}])
def test_invalid_target_type_returns_tool_error(entrypoint, target):
    plugin = entrypoint(None, _config())
    event = FakeEvent("查余额", admin=True)

    result = asyncio.run(plugin.query_balance_tool(event, "query", target))

    payload = json.loads(result)
    assert payload["error"]["category"] == "invalid_target"
    assert event.replies == []
    assert FakeHttpClient.instances[-1].requests == []


@pytest.mark.parametrize("target", ["help", "status"])
def test_llm_query_rejects_command_only_targets_without_calling_service(
    entrypoint, target
):
    plugin = entrypoint(None, _config())
    event = FakeEvent("查余额", admin=True)

    result = asyncio.run(plugin.query_balance_tool(event, "query", target))

    payload = json.loads(result)
    assert payload["error"]["category"] == "invalid_target"
    assert event.replies == []
    assert FakeHttpClient.instances[-1].requests == []


def test_old_template_waits_for_explicit_migration_without_changing_credentials(
    entrypoint,
):
    class SavedConfig(dict):
        saves = 0

        def save_config(self):
            self.saves += 1

    config = SavedConfig(_config())
    config["providers"][0]["__template_key"] = "provider_account"
    original_auth = config["providers"][0]["auth"].copy()

    entrypoint(None, config)

    assert config.saves == 0
    assert config["providers"][0]["__template_key"] == "provider_account"
    assert config["providers"][0]["auth"] == original_auth


def test_empty_configuration_starts_and_shutdown_clears_service_cache(entrypoint):
    plugin = entrypoint(None)
    initial_cache = plugin.cache
    asyncio.run(plugin.initialize())
    assert plugin.settings.accounts == ()
    assert plugin.cache is not initial_cache
    assert FakeHttpClient.instances[-2].closed
    assert not plugin.http_client.closed

    event = FakeEvent("/yql", admin=True)
    asyncio.run(_collect(plugin.quota_link(event)))
    assert len(event.replies) == 1
    assert "当前没有配置可查询的账户" in event.replies[0]

    cache = plugin.cache
    cache.put(
        "account",
        "fingerprint",
        plugin.__class__._test_models.BalanceSnapshot(
            account_id="account",
            provider_type=plugin.__class__._test_models.ProviderType.DEEPSEEK,
            display_name="Account",
            status=plugin.__class__._test_models.SnapshotStatus.AVAILABLE,
            balances=(),
            source="test",
            fetched_at=datetime.now(UTC),
        ),
    )
    assert cache._entries
    asyncio.run(plugin.terminate())
    assert plugin.service._closed
    assert plugin.http_client.closed
    assert plugin.cache._entries == {}


def test_cancelled_runtime_replacement_still_closes_retired_client(entrypoint):
    async def scenario():
        plugin = entrypoint(None)
        entered, release = asyncio.Event(), asyncio.Event()
        retired_client = plugin.http_client

        class SlowService:
            async def close(self):
                entered.set()
                await release.wait()

        plugin.service = SlowService()
        task = asyncio.create_task(plugin._replace_runtime({}))
        await entered.wait()
        task.cancel()
        with pytest.raises(asyncio.CancelledError):
            await task
        assert not retired_client.closed
        release.set()
        await asyncio.gather(*tuple(plugin._cleanup_tasks))
        assert retired_client.closed
        assert not plugin.http_client.closed
        await plugin.terminate()
        assert plugin.http_client.closed

    asyncio.run(scenario())


def test_runtime_cleanup_closes_client_even_when_service_close_fails(entrypoint):
    async def scenario():
        plugin = entrypoint(None)
        client = plugin.http_client

        class BrokenService:
            async def close(self):
                raise RuntimeError("synthetic shutdown failure")

        with pytest.raises(RuntimeError, match="synthetic shutdown failure"):
            await plugin._dispose_runtime(BrokenService(), client)
        assert client.closed

    asyncio.run(scenario())


def test_host_initialization_uses_vault_and_migrates_only_on_confirm(
    entrypoint, monkeypatch, tmp_path
):
    class SavedConfig(dict):
        def save_config(self):
            pass

    star_module = sys.modules["astrbot.api.star"]
    star_module.StarTools = types.SimpleNamespace(get_data_dir=lambda name: tmp_path)
    config = SavedConfig(_config(), enable_admin_page=False)
    plugin = entrypoint(object(), config)

    async def scenario():
        await plugin.initialize()
        assert plugin._config_store is not None
        before = await plugin._admin_dispatch("read", {}, lambda: None)
        assert before["migration"]["pending"]
        assert "test-placeholder" not in json.dumps(before)
        result = await plugin._admin_dispatch(
            "legacy-config-execute",
            {"revision": 0, "confirm": True, "plan_id": before["migration"]["plan_id"]},
            lambda: None,
        )
        assert not result["migration"]["pending"]
        assert config["providers"] == []
        assert plugin.settings.accounts[0].auth["api_key"] == "test-placeholder"
        assert not plugin.cache._entries
        await plugin.terminate()

    asyncio.run(scenario())


@pytest.mark.parametrize(
    "command", ["/yql all", "/yql grsai-work", "/yql provider deepseek"]
)
def test_command_card_uses_one_query_and_offloads_rendering(
    entrypoint, monkeypatch, command
):
    import threading

    plugin = entrypoint(None, _config())
    module = importlib.import_module(plugin.__class__.__module__)
    models = entrypoint._test_models
    queries = []
    renders = []
    caller_thread = threading.get_ident()

    async def query(request):
        result = models.QueryResult(request, (), datetime.now(UTC))
        queries.append(result)
        return result

    def render(result, font_path=None):
        assert threading.get_ident() != caller_thread
        renders.append(result)
        return b"synthetic-png"

    image_module = types.ModuleType("astrbot.api.message_components")
    image_module.Image = types.SimpleNamespace(fromBytes=lambda data: ("image", data))
    monkeypatch.setitem(sys.modules, "astrbot.api.message_components", image_module)
    monkeypatch.setattr(module, "render_result_card", render)
    monkeypatch.setattr(plugin.service, "query", query)
    event = FakeEvent(command, admin=True)
    event.chain_result = lambda components: ("chain", components)

    replies = asyncio.run(_collect(plugin.quota_link(event)))

    assert replies == [("chain", [("image", b"synthetic-png")])]
    assert len(queries) == 1
    assert renders == queries
    assert event.replies == []
    assert FakeHttpClient.instances[-1].requests == []


@pytest.mark.parametrize("failure", ["unavailable", "render", "component", "chain"])
def test_command_card_failure_preserves_complete_text_without_requery(
    entrypoint, monkeypatch, failure
):
    plugin = entrypoint(None, _config())
    module = importlib.import_module(plugin.__class__.__module__)
    models = entrypoint._test_models
    queries = []

    async def query(request):
        result = models.QueryResult(request, (), datetime.now(UTC))
        queries.append(result)
        return result

    def fail(*args):
        raise RuntimeError("SENSITIVE provider detail must not be exposed")

    def render(result, font_path=None):
        if failure == "render":
            fail()
        return None if failure == "unavailable" else b"synthetic-png"

    image_module = types.ModuleType("astrbot.api.message_components")
    image_module.Image = types.SimpleNamespace(
        fromBytes=fail if failure == "component" else lambda data: data
    )
    monkeypatch.setitem(sys.modules, "astrbot.api.message_components", image_module)
    monkeypatch.setattr(module, "render_result_card", render)
    monkeypatch.setattr(plugin.service, "query", query)
    event = FakeEvent("/yql all", admin=True)
    event.chain_result = fail if failure == "chain" else lambda components: components

    replies = asyncio.run(_collect(plugin.quota_link(event)))

    assert len(queries) == 1
    assert replies == [module.format_result(queries[0])]
    assert event.replies == replies
    assert "SENSITIVE" not in replies[0]


@pytest.mark.parametrize(
    ("command", "admin"),
    [
        ("/yql all", False),
        ("/yql help", True),
        ("/yql status", True),
        ("/yql missing-target", True),
    ],
)
def test_local_invalid_and_denied_commands_never_use_query_renderer_or_provider(
    entrypoint, monkeypatch, command, admin
):
    plugin = entrypoint(None, _config())
    module = importlib.import_module(plugin.__class__.__module__)
    calls = []

    def render(result, font_path=None):
        calls.append("render")
        raise AssertionError("must not render")

    async def query(request):
        calls.append("query")
        raise AssertionError("must not query")

    monkeypatch.setattr(module, "render_result_card", render)
    monkeypatch.setattr(plugin.service, "query", query)
    event = FakeEvent(command, admin=admin)

    replies = asyncio.run(_collect(plugin.quota_link(event)))

    assert len(replies) == 1
    assert isinstance(replies[0], str)
    assert calls == []


def test_llm_tool_never_calls_command_card_renderer(entrypoint, monkeypatch):
    plugin = entrypoint(None, _config())
    module = importlib.import_module(plugin.__class__.__module__)
    calls = []

    def render(result, font_path=None):
        calls.append(result)
        raise AssertionError("LLM facts must not render")

    monkeypatch.setattr(module, "render_result_card", render)
    monkeypatch.setattr(module, "render_local_card", render)
    event = FakeEvent("查余额", admin=True)
    result = asyncio.run(plugin.query_balance_tool(event, "query", "grsai-work"))
    assert json.loads(result)["operation"] == "query"
    assert event.replies == []
    assert calls == []


def _font_host(entrypoint, monkeypatch, tmp_path, metadata=None):
    """Minimal public Host metadata and in-memory config store for lifecycle tests."""
    module = importlib.import_module(entrypoint.__module__)
    package = module.__package__
    data_calls, star_calls = [], []
    root = tmp_path / "astrbot_plugin_yomihime_quota_link"

    def data_dir(name):
        data_calls.append(name)
        return root

    def registered(name):
        star_calls.append(name)
        if isinstance(metadata, Exception):
            raise metadata
        return metadata

    config_module = importlib.import_module(f"{package}.quota_link.config_store")
    security_module = importlib.import_module(f"{package}.quota_link.security")
    monkeypatch.setattr(
        config_module,
        "ConfigStore",
        lambda *args: types.SimpleNamespace(runtime_config=lambda: {}),
    )
    monkeypatch.setattr(security_module, "SecretStore", lambda root: object())
    sys.modules["astrbot.api.star"].StarTools = types.SimpleNamespace(
        get_data_dir=data_dir
    )
    context = types.SimpleNamespace(get_registered_star=registered)
    plugin = entrypoint(context, {"enable_admin_page": False})
    return plugin, module, root, data_calls, star_calls


@pytest.mark.parametrize(
    "metadata, installed",
    [
        (None, False),
        (types.SimpleNamespace(name="other-plugin"), False),
        (types.SimpleNamespace(name="astrbot_plugin_yomihime_game_link"), True),
        (
            types.SimpleNamespace(
                name="astrbot_plugin_yomihime_game_link", activated=False
            ),
            True,
        ),
        (RuntimeError("metadata unavailable"), False),
    ],
)
def test_font_startup_discovers_installed_ygl_without_creating_its_data_dir(
    entrypoint, monkeypatch, tmp_path, metadata, installed
):
    plugin, module, root, data_calls, star_calls = _font_host(
        entrypoint, monkeypatch, tmp_path, metadata
    )
    calls = []
    ready = root / "resources/fonts" / module.FONT_FILENAME

    async def prepare(own_root, ygl_path):
        calls.append((own_root, ygl_path))
        return ready

    monkeypatch.setattr(module, "prepare_font", prepare)

    async def scenario():
        assert plugin._font_task is None
        assert plugin._font_path is None
        await plugin.initialize()
        await plugin._font_task
        expected = (
            root.parent
            / "astrbot_plugin_yomihime_game_link"
            / "resources/fonts"
            / module.FONT_FILENAME
            if installed
            else None
        )
        assert calls == [(root, expected)]
        assert plugin._font_path == ready
        assert data_calls == ["astrbot_plugin_yomihime_quota_link"]
        assert star_calls == ["astrbot_plugin_yomihime_game_link"]
        assert not root.parent.joinpath("astrbot_plugin_yomihime_game_link").exists()
        await plugin.terminate()
        assert plugin._font_task is None
        assert plugin._font_path is None

    asyncio.run(scenario())


def test_font_never_starts_without_host_context(entrypoint, monkeypatch):
    plugin = entrypoint(None)
    module = importlib.import_module(entrypoint.__module__)
    calls = []

    async def prepare(*args):
        calls.append(args)
        raise AssertionError("no Host root")

    monkeypatch.setattr(module, "prepare_font", prepare)

    async def scenario():
        await plugin.initialize()
        assert plugin._font_task is None
        assert plugin._font_path is None
        await plugin.terminate()
        assert calls == []

    asyncio.run(scenario())


def test_font_startup_failure_keeps_command_text_fallback(
    entrypoint, monkeypatch, tmp_path
):
    plugin, module, _, _, _ = _font_host(entrypoint, monkeypatch, tmp_path)
    render_paths = []

    async def prepare(*args):
        raise RuntimeError("SENSITIVE download endpoint detail")

    def render(result, font_path=None):
        render_paths.append(font_path)
        return None

    monkeypatch.setattr(module, "prepare_font", prepare)
    monkeypatch.setattr(module, "render_result_card", render)

    async def scenario():
        await plugin.initialize()
        await plugin._font_task
        assert plugin._font_path is None
        event = FakeEvent("/yql all", admin=True)
        replies = await _collect(plugin.quota_link(event))
        assert "当前没有配置可查询的账户" in replies[0]
        assert "SENSITIVE" not in replies[0]
        assert render_paths == [None]
        await plugin.terminate()

    asyncio.run(scenario())


def test_prepared_font_passes_to_renderer_without_query_time_preparation(
    entrypoint, monkeypatch, tmp_path
):
    plugin, module, root, _, _ = _font_host(entrypoint, monkeypatch, tmp_path)
    calls, paths = [], []
    ready = root / "resources/fonts" / module.FONT_FILENAME

    async def prepare(*args):
        calls.append(args)
        return ready

    def render(result, font_path=None):
        paths.append(font_path)
        return None

    monkeypatch.setattr(module, "prepare_font", prepare)
    monkeypatch.setattr(module, "render_result_card", render)

    async def scenario():
        await plugin.initialize()
        task = plugin._font_task
        await task
        await plugin._replace_runtime({})
        assert plugin._font_task is task
        for _ in range(2):
            await _collect(plugin.quota_link(FakeEvent("/yql all", admin=True)))
        assert calls == [(root, None)]
        assert paths == [ready, ready]
        assert plugin._font_path == ready
        await plugin.terminate()

    asyncio.run(scenario())


def test_terminate_joins_font_cancellation_before_completing(
    entrypoint, monkeypatch, tmp_path
):
    plugin, module, root, _, _ = _font_host(entrypoint, monkeypatch, tmp_path)

    async def scenario():
        entered, cancelled, release = asyncio.Event(), asyncio.Event(), asyncio.Event()

        async def prepare(*args):
            entered.set()
            try:
                await asyncio.sleep(60)
            except asyncio.CancelledError:
                cancelled.set()
                await release.wait()
                raise

        monkeypatch.setattr(module, "prepare_font", prepare)
        await plugin.initialize()
        pending = plugin._font_task
        await entered.wait()
        plugin._font_path = root / "stale-font"
        closing = asyncio.create_task(plugin.terminate())
        await cancelled.wait()
        assert not closing.done()
        assert plugin._font_path is None
        release.set()
        await closing
        assert pending.done()
        assert plugin._font_task is None
        assert plugin._font_path is None
        assert plugin.http_client.closed

    asyncio.run(scenario())


def test_reinitialize_joins_old_font_then_publishes_only_new_path(
    entrypoint, monkeypatch, tmp_path
):
    plugin, module, root, _, _ = _font_host(entrypoint, monkeypatch, tmp_path)

    async def scenario():
        entered, cancelled, release = asyncio.Event(), asyncio.Event(), asyncio.Event()
        calls = []
        ready = root / "ready-font"

        async def prepare(*args):
            calls.append(args)
            if len(calls) == 1:
                entered.set()
                try:
                    await asyncio.sleep(60)
                except asyncio.CancelledError:
                    cancelled.set()
                    await release.wait()
                    raise
            return ready

        monkeypatch.setattr(module, "prepare_font", prepare)
        await plugin.initialize()
        old_task = plugin._font_task
        await entered.wait()
        initializing = asyncio.create_task(plugin.initialize())
        await cancelled.wait()
        assert not initializing.done()
        assert len(calls) == 1
        release.set()
        await initializing
        await plugin._font_task
        assert old_task.cancelled()
        assert len(calls) == 2
        assert plugin._font_path == ready
        await plugin.terminate()
        assert plugin._font_path is None

    asyncio.run(scenario())


@pytest.mark.parametrize("command", ["/yql help", "/yql status"])
def test_local_command_cards_render_off_thread_without_query(
    entrypoint, monkeypatch, command
):
    import threading

    plugin = entrypoint(None, _config())
    module = importlib.import_module(plugin.__class__.__module__)
    caller = threading.get_ident()
    renders = []

    async def query(*args):
        raise AssertionError("local cards must not query a provider")

    def render(spec, font_path=None):
        assert threading.get_ident() != caller
        renders.append(spec)
        return b"synthetic-local-png"

    image_module = types.ModuleType("astrbot.api.message_components")
    image_module.Image = types.SimpleNamespace(fromBytes=lambda value: ("image", value))
    monkeypatch.setitem(sys.modules, "astrbot.api.message_components", image_module)
    monkeypatch.setattr(module, "render_local_card", render)
    monkeypatch.setattr(plugin.service, "query", query)
    event = FakeEvent(command, admin=True)
    event.chain_result = lambda values: ("chain", values)
    replies = asyncio.run(_collect(plugin.quota_link(event)))
    assert replies == [("chain", [("image", b"synthetic-local-png")])]
    assert len(renders) == 1
    assert "演示数据" not in str(renders[0])
    assert FakeHttpClient.instances[-1].requests == []
    assert event.replies == []


@pytest.mark.parametrize("command", ["/yql help", "/yql status"])
@pytest.mark.parametrize("failure", ["font", "render", "component", "chain"])
def test_local_card_failure_keeps_complete_text(
    entrypoint, monkeypatch, command, failure
):
    plugin = entrypoint(None, _config())
    module = importlib.import_module(plugin.__class__.__module__)

    def fail(*args, **kwargs):
        raise RuntimeError("SENSITIVE-DO-NOT-EXPOSE")

    async def query(*args):
        fail()

    def render(spec, font_path=None):
        if failure == "render":
            fail()
        return None if failure == "font" else b"synthetic-png"

    image_module = types.ModuleType("astrbot.api.message_components")
    image_module.Image = types.SimpleNamespace(
        fromBytes=fail if failure == "component" else lambda value: value
    )
    monkeypatch.setitem(sys.modules, "astrbot.api.message_components", image_module)
    monkeypatch.setattr(module, "render_local_card", render)
    monkeypatch.setattr(plugin.service, "query", query)
    event = FakeEvent(command, admin=True)
    event.chain_result = fail if failure == "chain" else lambda values: values
    replies = asyncio.run(_collect(plugin.quota_link(event)))
    expected = (
        module.format_help(plugin.settings)
        if command.endswith("help")
        else module.format_status(plugin.settings)
    )
    assert replies == [expected]
    assert "DeepSeek Work" in replies[0] and "Nova Quota" in replies[0]
    assert "SENSITIVE" not in replies[0]
    assert FakeHttpClient.instances[-1].requests == []


def test_status_uses_only_local_storage_metadata(entrypoint, monkeypatch):
    plugin = entrypoint(None, _config())
    module = importlib.import_module(plugin.__class__.__module__)
    store_module = importlib.import_module(
        module.__package__ + ".quota_link.config_store"
    )
    calls = []
    renders = []
    metadata = {
        field: {
            "configured": field == "api_key",
            "source": "encrypted" if field == "api_key" else "missing",
        }
        for field in store_module.SECRET_FIELDS
    }

    async def dispatch(operation, body, authorize):
        authorize()
        calls.append((operation, body))
        return {
            "config": {
                "private-url": "https://SENSITIVE.invalid",
                "raw-secret": "SENSITIVE",
            },
            "credentials": {"grsai-work": metadata, "openai-main": metadata},
            "encryption": {"ready": True},
            "migration": {"pending": False},
        }

    plugin._config_store = types.SimpleNamespace(dispatch=dispatch)
    monkeypatch.setattr(
        module, "render_local_card", lambda spec, font=None: renders.append(spec)
    )
    event = FakeEvent("/yql status", admin=True)
    replies = asyncio.run(_collect(plugin.quota_link(event)))
    assert calls == [("credential-status", {})]
    assert "加密凭据已保存" in replies[0]
    assert "安全存储已就绪" in replies[0]
    for forbidden in (
        "SENSITIVE",
        "https://",
        "grsai-work",
        "openai-main",
        "test-placeholder",
    ):
        assert forbidden not in replies[0] + str(renders[0])
    assert FakeHttpClient.instances[-1].requests == []


@pytest.mark.parametrize("mode", ["storage_error", "storage_absent"])
def test_status_storage_failure_is_safe_and_keeps_local_accounts(
    entrypoint, monkeypatch, mode
):
    plugin = entrypoint(None, _config())
    module = importlib.import_module(plugin.__class__.__module__)
    monkeypatch.setattr(module, "render_local_card", lambda *args: None)

    async def dispatch(*args):
        raise RuntimeError("SENSITIVE /private/path vault_ref")

    if mode == "storage_error":
        plugin._config_store = types.SimpleNamespace(dispatch=dispatch)
    else:
        plugin._storage_failed = True
    event = FakeEvent("/yql status", admin=True)
    replies = asyncio.run(_collect(plugin.quota_link(event)))
    assert "安全存储待检查" in replies[0]
    assert "DeepSeek Work" in replies[0]
    assert "SENSITIVE" not in replies[0]
    assert FakeHttpClient.instances[-1].requests == []


@pytest.mark.parametrize(
    "command,admin",
    [
        ("/yql status", False),
        ("/yql help extra", True),
        ("/yql status extra", True),
        ("/yql missing-target", True),
    ],
)
def test_invalid_or_denied_commands_keep_short_text_and_skip_all_cards(
    entrypoint, monkeypatch, command, admin
):
    plugin = entrypoint(None, _config())
    module = importlib.import_module(plugin.__class__.__module__)
    calls = []

    def unexpected(*args, **kwargs):
        calls.append("unexpected")
        raise AssertionError

    async def dispatch(*args):
        unexpected()

    plugin._config_store = types.SimpleNamespace(dispatch=dispatch)
    monkeypatch.setattr(module, "render_local_card", unexpected)
    monkeypatch.setattr(module, "render_result_card", unexpected)
    monkeypatch.setattr(plugin.service, "query", dispatch)
    event = FakeEvent(command, admin=admin)
    replies = asyncio.run(_collect(plugin.quota_link(event)))
    assert len(replies) == 1 and isinstance(replies[0], str)
    assert len(replies[0]) < 80
    assert calls == []


def test_status_rechecks_permission_after_local_storage_read(entrypoint, monkeypatch):
    from dataclasses import replace

    plugin = entrypoint(
        None,
        {
            **_config(),
            "command_admin_only": False,
            "private_allowed_user_ids": ["telegram:user-1"],
        },
    )
    module = importlib.import_module(plugin.__class__.__module__)
    calls = []
    monkeypatch.setattr(
        module, "render_local_card", lambda *args: calls.append("render")
    )

    async def dispatch(operation, body, authorize):
        authorize()
        plugin.settings = replace(plugin.settings, command_admin_only=True)
        return {}

    plugin._config_store = types.SimpleNamespace(dispatch=dispatch)
    event = FakeEvent("/yql status")
    replies = asyncio.run(_collect(plugin.quota_link(event)))
    assert replies == ["当前会话无权查询额度信息。"]
    assert calls == []


@pytest.mark.parametrize("command", ["/yql help", "/yql status"])
@pytest.mark.parametrize("size", [0, 205])
def test_local_entrypoint_real_renderer_empty_and_oversize(
    entrypoint, monkeypatch, command, size
):
    import os

    font = os.environ.get("QUOTA_TEST_FONT")
    if not font:
        pytest.skip("fixed font fixture required")
    config = {
        "providers": [
            {
                "id": f"private-{i}",
                "type": "deepseek",
                "display_name": f"账户 {i}",
                "auth": {"api_key": "synthetic-key"},
            }
            for i in range(size)
        ]
    }
    plugin = entrypoint(None, config)
    module = importlib.import_module(plugin.__class__.__module__)
    cards = importlib.import_module(module.__package__ + ".quota_link.cards")
    plugin._font_path = Path(font)
    monkeypatch.setattr(module, "render_local_card", cards.render_local_card)

    async def query(*args):
        raise AssertionError("local command must not query")

    monkeypatch.setattr(plugin.service, "query", query)
    image_module = types.ModuleType("astrbot.api.message_components")
    image_module.Image = types.SimpleNamespace(fromBytes=lambda value: value)
    monkeypatch.setitem(sys.modules, "astrbot.api.message_components", image_module)
    event = FakeEvent(command, admin=True)
    event.chain_result = lambda values: values[0]
    replies = asyncio.run(_collect(plugin.quota_link(event)))
    assert len(replies) == 1
    if size:
        assert isinstance(replies[0], str)
        assert all(f"账户 {i}" in replies[0] for i in range(size))
    else:
        assert replies[0].startswith(b"\x89PNG\r\n\x1a\n")
    assert FakeHttpClient.instances[-1].requests == []


def test_status_uses_current_directory_after_waiting_for_storage(
    entrypoint, monkeypatch
):
    plugin = entrypoint(None, _config())
    module = importlib.import_module(plugin.__class__.__module__)
    store_module = importlib.import_module(
        module.__package__ + ".quota_link.config_store"
    )
    fields = {
        field: {
            "configured": field == "api_key",
            "source": "encrypted" if field == "api_key" else "missing",
        }
        for field in store_module.SECRET_FIELDS
    }
    monkeypatch.setattr(module, "render_local_card", lambda *args: None)

    async def dispatch(operation, body, authorize):
        authorize()
        plugin.settings = module.load_settings(
            {
                "providers": [
                    {
                        "id": "new-private-id",
                        "type": "deepseek",
                        "display_name": "更新后的账户",
                        "auth": {"api_key": "synthetic-key"},
                    }
                ]
            }
        )
        return {
            "credentials": {"new-private-id": fields},
            "encryption": {"ready": True},
            "migration": {"pending": False},
        }

    plugin._config_store = types.SimpleNamespace(dispatch=dispatch)
    event = FakeEvent("/yql status", admin=True)
    replies = asyncio.run(_collect(plugin.quota_link(event)))
    assert "更新后的账户" in replies[0]
    assert "加密凭据已保存" in replies[0]
    assert "DeepSeek Work" not in replies[0]
    assert "new-private-id" not in replies[0]
    assert "账户：共 1 个" in replies[0]
