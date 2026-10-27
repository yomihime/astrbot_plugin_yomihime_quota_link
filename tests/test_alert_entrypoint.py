"""Entry lifecycle and command isolation, using only synthetic Host fixtures."""

import asyncio
import importlib
import sys
from types import SimpleNamespace

import pytest
from test_entrypoint import FakeEvent
from test_entrypoint import entrypoint as _entrypoint_fixture

entrypoint = _entrypoint_fixture


async def collect(iterator):
    return [item async for item in iterator]


def test_alert_manager_does_not_gain_existing_balance_query_permission(entrypoint):
    plugin = entrypoint(
        None, {"balance_alert_admin_qq_ids": ["123"], "command_admin_only": True}
    )

    async def scenario():
        reply = await collect(
            plugin.quota_link(
                FakeEvent("/yql alert help", user="123", platform="aiocqhttp")
            )
        )
        assert "额度预警管理" in reply[0]
        reply = await collect(
            plugin.quota_link(FakeEvent("/yql all", user="123", platform="aiocqhttp"))
        )
        assert reply == ["当前会话无权查询额度信息。"]
        await plugin.terminate()

    asyncio.run(scenario())


@pytest.mark.parametrize(
    "command",
    [
        "help",
        "status",
        "targets list",
        "targets addhere @123",
        "on account",
        "retry account",
    ],
)
def test_alert_entire_tree_denied_even_if_ordinary_queries_allowed(entrypoint, command):
    plugin = entrypoint(
        None, {"command_admin_only": False, "private_allowed_user_ids": ["123"]}
    )

    async def forbidden(*args, **kwargs):
        raise AssertionError("unauthorized management touched state")

    plugin._admin_dispatch = forbidden

    async def scenario():
        reply = await collect(
            plugin.quota_link(
                FakeEvent("/yql alert " + command, user="123", platform="aiocqhttp")
            )
        )
        assert "无权管理" in reply[0]
        await plugin.terminate()

    asyncio.run(scenario())


def test_builtin_host_admin_on_non_qq_needs_no_whitelist(entrypoint):
    plugin = entrypoint(None, {})

    async def scenario():
        reply = await collect(
            plugin.quota_link(
                FakeEvent("/yql alert help", admin=True, platform="telegram")
            )
        )
        assert "额度预警管理" in reply[0]
        await plugin.terminate()

    asyncio.run(scenario())


def host_plugin(entrypoint, tmp_path):
    sys.modules["astrbot.api.star"].StarTools = SimpleNamespace(
        get_data_dir=lambda name: tmp_path
    )
    return entrypoint(object(), {"enable_admin_page": False})


def test_initialize_is_single_task_and_terminate_revokes_before_wait(
    entrypoint, tmp_path
):
    plugin = host_plugin(entrypoint, tmp_path)

    async def scenario():
        await plugin.initialize()
        first = plugin._alert_engine
        assert first is not None and first._task is not None
        first.start()
        task = first._task
        first.start()
        assert first._task is task
        await plugin.initialize()
        second = plugin._alert_engine
        assert second is not first and first._closed and task.done()
        assert not first.is_current()
        await plugin.terminate()
        assert plugin._alert_engine is None and second._closed and second._task.done()
        assert not second.is_current()

    asyncio.run(scenario())


def test_invalid_cas_restarts_old_engine_without_claiming_config_saved(
    entrypoint, tmp_path
):
    plugin = host_plugin(entrypoint, tmp_path)
    module = importlib.import_module(
        entrypoint.__module__.rsplit(".", 1)[0] + ".quota_link.config_store"
    )

    async def scenario():
        await plugin.initialize()
        first = plugin._alert_engine
        with pytest.raises(module.ConfigConflict):
            await plugin._admin_dispatch(
                "update", {"revision": 999, "config": {"providers": []}}, lambda: None
            )
        assert first._closed and not first.is_current()
        assert plugin._alert_engine is not None and plugin._alert_engine is not first
        assert plugin._alert_status()["running"] is True
        await plugin.terminate()

    asyncio.run(scenario())


def test_unauthorized_management_cannot_stop_existing_watcher(entrypoint, tmp_path):
    plugin = host_plugin(entrypoint, tmp_path)

    def denied():
        raise PermissionError

    async def scenario():
        await plugin.initialize()
        engine = plugin._alert_engine
        with pytest.raises(PermissionError):
            await plugin._admin_dispatch("update", {}, denied)
        assert plugin._alert_engine is engine and not engine._closed
        with pytest.raises(PermissionError):
            await plugin._admin_dispatch("alert-status", {}, denied)
        await plugin.terminate()

    asyncio.run(scenario())


def test_terminate_during_config_await_does_not_restart_or_leak_runtime(
    entrypoint, tmp_path
):
    plugin = host_plugin(entrypoint, tmp_path)

    async def scenario():
        await plugin.initialize()
        reached, release = asyncio.Event(), asyncio.Event()

        class DelayedStore:
            async def dispatch(self, *args):
                reached.set()
                await release.wait()
                await plugin._replace_runtime({})
                return {}

        plugin._config_store = DelayedStore()
        mutation = asyncio.create_task(
            plugin._admin_dispatch("update", {}, lambda: None)
        )
        await reached.wait()
        terminating = asyncio.create_task(plugin.terminate())
        await asyncio.sleep(0)
        assert plugin._terminated and plugin._alert_engine is None
        release.set()
        await mutation
        await terminating
        assert (
            plugin._alert_engine is None
            and plugin.http_client.closed
            and plugin.service._closed
        )

    asyncio.run(scenario())


def test_sdk_components_only_constructed_in_boundary(entrypoint, monkeypatch):
    module = importlib.import_module(entrypoint.__module__)
    components = SimpleNamespace(
        At=lambda **kwargs: ("at", kwargs), Plain=lambda text: ("plain", text)
    )
    monkeypatch.setitem(sys.modules, "astrbot.api.message_components", components)
    monkeypatch.setattr(
        sys.modules["astrbot.api.event"],
        "MessageChain",
        lambda chain: chain,
        raising=False,
    )
    assert module._alert_message_chain(("123", "456"), "合成预警") == [
        ("at", {"qq": "123"}),
        ("at", {"qq": "456"}),
        ("plain", "合成预警"),
    ]


@pytest.mark.parametrize("successor", ["terminate", "initialize"])
def test_overlapping_initialization_obeys_latest_lifecycle_generation(
    entrypoint, tmp_path, monkeypatch, successor
):
    plugin = host_plugin(entrypoint, tmp_path)
    old_client = plugin.http_client

    async def scenario():
        entered, release = asyncio.Event(), asyncio.Event()
        original_close = old_client.close

        async def gated_close():
            if not entered.is_set():
                entered.set()
                await release.wait()
            await original_close()

        monkeypatch.setattr(old_client, "close", gated_close)
        first = asyncio.create_task(plugin.initialize())
        await entered.wait()
        second = asyncio.create_task(getattr(plugin, successor)())
        await asyncio.sleep(0)  # Yield scheduling only; no real timed sleep.
        release.set()
        await asyncio.gather(first, second)
        if successor == "terminate":
            assert plugin._terminated and plugin.http_client is old_client
            assert plugin._alert_engine is None and plugin._admin_pages is None
            assert plugin._font_task is None and old_client.closed
        else:
            assert plugin.http_client is not old_client
            assert plugin._alert_engine.service is plugin.service
            assert plugin._alert_engine.is_current()
            await plugin.terminate()

    asyncio.run(scenario())


@pytest.mark.parametrize("revision", [0, True, "1", None])
def test_bind_unit_requires_exact_config_revision(entrypoint, tmp_path, revision):
    ConfigConflict = importlib.import_module(
        entrypoint.__module__.rsplit(".", 1)[0] + ".quota_link.config_store"
    ).ConfigConflict

    plugin = host_plugin(entrypoint, tmp_path)
    calls = []

    class Store:
        async def dispatch(self, operation, body, authorize):
            authorize()
            return {"revision": 1}

    plugin._config_store = Store()
    plugin._alert_engine = SimpleNamespace(
        confirm_unit=lambda *args: calls.append(args),
        unit_status=lambda: {"accounts": []},
    )

    async def scenario():
        with pytest.raises(ConfigConflict):
            await plugin._admin_dispatch(
                "alert-bind-unit",
                {
                    "revision": revision,
                    "account_id": "synthetic",
                    "choice_id": "a" * 64,
                },
                lambda: None,
            )
        assert not calls
        plugin._alert_engine = None
        await plugin.terminate()

    asyncio.run(scenario())


def test_bind_unit_rechecks_authority_after_revision_read(entrypoint, tmp_path):
    plugin = host_plugin(entrypoint, tmp_path)
    revoked = False
    calls = []

    class Store:
        async def dispatch(self, operation, body, authorize):
            nonlocal revoked
            authorize()
            revoked = True
            return {"revision": 1}

    def authorize():
        if revoked:
            raise PermissionError

    plugin._config_store = Store()
    plugin._alert_engine = SimpleNamespace(
        confirm_unit=lambda *args: calls.append(args)
    )

    async def scenario():
        with pytest.raises(PermissionError):
            await plugin._admin_dispatch(
                "alert-bind-unit",
                {"revision": 1, "account_id": "synthetic", "choice_id": "a" * 64},
                authorize,
            )
        assert not calls
        plugin._alert_engine = None
        await plugin.terminate()

    asyncio.run(scenario())


def test_units_read_and_bind_do_not_query_or_restart_engine(entrypoint, tmp_path):
    plugin = host_plugin(entrypoint, tmp_path)
    calls = []

    class Store:
        async def dispatch(self, operation, body, authorize):
            authorize()
            assert operation == "read"
            return {"revision": 7}

    plugin._config_store = Store()
    engine = SimpleNamespace(
        confirm_unit=lambda *args: calls.append(args),
        unit_status=lambda: {"accounts": [{"account_id": "synthetic", "unit": "USD"}]},
    )
    plugin._alert_engine = engine

    async def scenario():
        result = await plugin._admin_dispatch("alert-units", {}, lambda: None)
        assert result["accounts"][0]["unit"] == "USD" and not calls
        result = await plugin._admin_dispatch(
            "alert-bind-unit",
            {"revision": 7, "account_id": "synthetic", "choice_id": "a" * 64},
            lambda: None,
        )
        assert result["accounts"][0]["unit"] == "USD"
        assert calls == [("synthetic", "a" * 64)]
        assert plugin._alert_engine is engine
        plugin._alert_engine = None
        await plugin.terminate()

    asyncio.run(scenario())
