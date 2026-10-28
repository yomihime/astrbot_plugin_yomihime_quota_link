"""Explicit unit refresh preserves the config CAS and request-owned authority."""

import asyncio
import importlib
from types import SimpleNamespace

import pytest
from test_alert_entrypoint import entrypoint as _entrypoint_fixture
from test_alert_entrypoint import host_plugin

entrypoint = _entrypoint_fixture


@pytest.mark.parametrize("revision", [0, None, True])
def test_refresh_requires_current_revision_before_query(entrypoint, tmp_path, revision):
    plugin = host_plugin(entrypoint, tmp_path)
    module = importlib.import_module(
        entrypoint.__module__.rsplit(".", 1)[0] + ".quota_link.config_store"
    )
    calls = []

    class Store:
        async def dispatch(self, operation, body, authorize):
            authorize()
            return {"revision": 1}

    async def refresh(*args):
        calls.append(args)

    plugin._config_store = Store()
    plugin._alert_engine = SimpleNamespace(refresh_units=refresh)

    async def scenario():
        with pytest.raises(module.ConfigConflict):
            await plugin._admin_dispatch(
                "alert-refresh-units",
                {"revision": revision, "account_id": "synthetic"},
                lambda: None,
            )
        assert not calls
        plugin._alert_engine = None
        await plugin.terminate()

    asyncio.run(scenario())


@pytest.mark.parametrize(
    "interruption", ["authorization", "revision", "runtime", "none"]
)
def test_refresh_rechecks_fences_after_await(entrypoint, tmp_path, interruption):
    plugin = host_plugin(entrypoint, tmp_path)
    module = importlib.import_module(
        entrypoint.__module__.rsplit(".", 1)[0] + ".quota_link.config_store"
    )
    calls, revoked, revision = [], False, 4

    def authorize():
        if revoked:
            raise PermissionError

    class Store:
        async def dispatch(self, operation, body, authorize):
            authorize()
            return {"revision": revision}

    async def refresh(account_id, authorize):
        nonlocal revoked, revision
        calls.append(account_id)
        await asyncio.sleep(0)
        if interruption == "authorization":
            revoked = True
        elif interruption == "revision":
            revision += 1
        elif interruption == "runtime":
            plugin._alert_engine = None

    plugin._config_store = Store()
    engine = SimpleNamespace(
        refresh_units=refresh,
        unit_status=lambda: {
            "accounts": [{"account_id": "synthetic", "unit_state": "changed"}]
        },
    )
    plugin._alert_engine = engine

    async def scenario():
        operation = plugin._admin_dispatch(
            "alert-refresh-units",
            {"revision": 4, "account_id": "synthetic"},
            authorize,
        )
        if interruption == "none":
            result = await operation
            assert result["accounts"][0]["unit_state"] == "changed"
            assert plugin._alert_engine is engine
        else:
            expected = {
                "authorization": PermissionError,
                "revision": module.ConfigConflict,
                "runtime": module.ConfigUnavailable,
            }[interruption]
            with pytest.raises(expected):
                await operation
        assert calls == ["synthetic"]
        plugin._alert_engine = None
        await plugin.terminate()

    asyncio.run(scenario())
