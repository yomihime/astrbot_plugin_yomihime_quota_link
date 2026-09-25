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
        self, text, *, private=True, admin=False, user="user-1", group="group-1"
    ):
        self.text = text
        self.private = private
        self.admin = admin
        self.user = user
        self.group = group
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
        ("/yql provider openai compatible", "供应商查询：openai_compatible"),
        ("/yql account grsai-work", "账户查询：grsai-work"),
        ("/yql grsai-work", "账户查询：grsai-work"),
        ("/yql help", "用法："),
        ("/yql status", "账户：共 2 个"),
    )
    for message, expected in cases:
        event = FakeEvent(message)
        asyncio.run(_collect(plugin.quota_link(event)))
        assert len(event.replies) == 1
        assert expected in event.replies[0]


def test_llm_tool_returns_json_facts_without_sending_a_message(entrypoint):
    plugin = entrypoint(None, _config())
    assert plugin.query_balance_tool.__func__._llm_tool_name == "yql_query_balance"
    assert "operation(string):" in plugin.query_balance_tool.__doc__
    assert "target(string):" in plugin.query_balance_tool.__doc__

    event = FakeEvent("请帮我查一下")
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
    event = FakeEvent("我能查什么")

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


def test_tool_has_no_message_listener_and_command_still_works(entrypoint):
    plugin = entrypoint(None, _config())
    assert not hasattr(plugin, "natural_language_query")
    event = FakeEvent("/yql provider openai compatible")
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
    unknown = FakeEvent("任意文本")
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
    monkeypatch.setattr(module, "can_query", lambda context, settings: False)
    event = FakeEvent("任意文本", private=False)

    result = asyncio.run(plugin.query_balance_tool(event, "list", "all"))

    assert json.loads(result)["error"]["category"] == "permission"
    assert event.replies == []


@pytest.mark.parametrize("operation", [None, 12, [], {}])
def test_invalid_operation_type_returns_tool_error_after_permission(
    entrypoint, operation
):
    plugin = entrypoint(None, _config())
    event = FakeEvent("查余额")

    result = asyncio.run(plugin.query_balance_tool(event, operation, "all"))

    payload = json.loads(result)
    assert payload["operation"] == "query"
    assert payload["error"]["category"] == "invalid_operation"
    assert event.replies == []
    assert FakeHttpClient.instances[-1].requests == []


@pytest.mark.parametrize("target", [None, 12, [], {}])
def test_invalid_target_type_returns_tool_error(entrypoint, target):
    plugin = entrypoint(None, _config())
    event = FakeEvent("查余额")

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
    event = FakeEvent("查余额")

    result = asyncio.run(plugin.query_balance_tool(event, "query", target))

    payload = json.loads(result)
    assert payload["error"]["category"] == "invalid_target"
    assert event.replies == []
    assert FakeHttpClient.instances[-1].requests == []


def test_old_template_is_retagged_without_changing_credentials(entrypoint):
    class SavedConfig(dict):
        saves = 0

        def save_config(self):
            self.saves += 1

    config = SavedConfig(_config())
    config["providers"][0]["__template_key"] = "provider_account"
    original_auth = config["providers"][0]["auth"].copy()

    entrypoint(None, config)

    assert config.saves == 1
    assert config["providers"][0]["__template_key"] == "deepseek"
    assert config["providers"][0]["auth"] == original_auth


def test_empty_configuration_starts_and_shutdown_clears_service_cache(entrypoint):
    plugin = entrypoint(None)
    initial_cache = plugin.cache
    asyncio.run(plugin.initialize())
    assert plugin.settings.accounts == ()
    assert plugin.cache is not initial_cache
    assert FakeHttpClient.instances[-2].closed
    assert not plugin.http_client.closed

    event = FakeEvent("/yql")
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
