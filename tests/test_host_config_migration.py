"""Upgrade evidence using AstrBot 4.29.1's actual normalization methods.

All credentials, environment values, and files below are synthetic. The exact
upstream methods are pinned in fixtures/host_config_normalization.py rather than
approximating host behavior with a schema-key whitelist in these tests.
"""

import asyncio
import copy
import json
import runpy
from pathlib import Path

import pytest

from quota_link.config_store import LEGACY_DEFAULTS, ConfigStore
from quota_link.security import SecretStore
from quota_link.settings import load_settings, migrate_account_templates

ROOT = Path(__file__).resolve().parents[1]
HostConfigNormalization = runpy.run_path(
    str(Path(__file__).parent / "fixtures" / "host_config_normalization.py")
)["HostConfigNormalization"]
LEGACY_FIELDS = {
    "timeout_seconds",
    "total_timeout_seconds",
    "cache_ttl_seconds",
    "max_concurrency",
    "command_admin_only",
    "private_allowed_user_ids",
    "allow_group_queries",
    "group_allowed_user_ids",
    "providers",
}
TEMPLATES = {
    "deepseek",
    "alibaba_bailian",
    "grsai",
    "meinianda",
    "openai_compatible",
    "provider_account",
}


class SyntheticHostConfig(HostConfigNormalization, dict):
    """Run the host's schema-default/integrity/save sequence on a temp file."""

    def __init__(self, path, schema):
        super().__init__()
        self.path = path
        self.schema = copy.deepcopy(schema)
        self.save_calls = 0
        defaults = self._config_schema_to_default_config(self.schema)
        config = json.loads(path.read_text(encoding="utf-8"))
        changed = self.check_config_integrity(defaults, config, schema=self.schema)
        self.update(config)
        if changed:
            self.save_config()

    def save_config(self):
        self.save_calls += 1
        self.path.write_text(json.dumps(dict(self)), encoding="utf-8")


def dispatch(store, operation="read", body=None):
    return asyncio.run(
        store.dispatch(operation, {} if body is None else body, lambda: None)
    )


def execute_migration(store):
    snapshot = dispatch(store)
    return dispatch(
        store,
        "legacy-config-execute",
        {
            "revision": snapshot["revision"],
            "plan_id": snapshot["migration"]["plan_id"],
            "confirm": True,
        },
    )


def _base(provider, **overrides):
    return {
        "id": "synthetic-account",
        "display_name": "Synthetic account",
        "type": provider,
        "__template_key": provider,
        "aliases": ["Synthetic alias"],
        "enabled": True,
        "timeout_seconds": 12.0,
        "cache_ttl_seconds": 75.0,
        "auth": {"api_key": "synthetic-api-key-for-upgrade"},
        **overrides,
    }


def original_provider_variants():
    return {
        "deepseek_native": _base("deepseek"),
        "alibaba_native": _base(
            "alibaba_bailian",
            auth={
                "access_key_id": "synthetic-access-id",
                "access_key_secret": "synthetic-access-secret",
                "security_token": "${SYNTHETIC_STS_TOKEN}",
            },
        ),
        "grsai_native_china": _base(
            "grsai", region="china", auth={"token": "synthetic-grsai-token"}
        ),
        "grsai_native_global_env": _base(
            "grsai", region="global", auth={"token": "${SYNTHETIC_GRSAI_TOKEN}"}
        ),
        "meinianda_native": _base("meinianda"),
        "compatible_split_endpoint": _base(
            "openai_compatible",
            advanced_options=True,
            endpoint={
                "base_url": "https://example.invalid",
                "path": "/balance",
                "method": "GET",
                "auth_mode": "header",
                "auth_name": "X-API-Key",
            },
            response_mapping={
                "amount_path": "/remaining",
                "unit": "credits",
                "kind": "credits",
            },
        ),
        "compatible_legacy_full_url": _base(
            "openai_compatible",
            __template_key="provider_account",
            endpoint={
                "url": "https://example.invalid/account/balance",
                "method": "GET",
                "auth_mode": "bearer",
            },
            response_mapping={
                "amount_path": "/data/balance",
                "unit": "USD",
                "kind": "cash",
            },
        ),
        "compatible_legacy_grsai_profile": _base(
            "openai_compatible",
            __template_key="provider_account",
            service_profile="grsai",
            balance_scope="account",
            auth={"token": "synthetic-compat-grsai-token"},
            endpoint={
                "base_url": "https://grsaiapi.com",
                "path": "/client/openapi/getCredits",
                "method": "POST",
            },
        ),
        "deepseek_legacy_generic_template": _base(
            "deepseek", __template_key="provider_account"
        ),
        "alibaba_legacy_generic_template": _base(
            "alibaba_bailian",
            __template_key="provider_account",
            auth={
                "access_key_id": "synthetic-legacy-access-id",
                "access_key_secret": "synthetic-legacy-access-secret",
            },
        ),
        "meinianda_legacy_generic_template": _base(
            "meinianda", __template_key="provider_account"
        ),
        "grsai_legacy_global_host": _base(
            "grsai",
            __template_key="provider_account",
            auth={"token": "synthetic-legacy-grsai"},
            endpoint={"base_url": "https://grsaiapi.com"},
        ),
        "native_nullable_endpoint": _base("deepseek", endpoint=None),
    }


@pytest.fixture
def schema():
    return json.loads((ROOT / "_conf_schema.json").read_text(encoding="utf-8"))


def test_only_bootstrap_control_is_visible_but_all_legacy_fields_remain(schema):
    assert set(schema) == LEGACY_FIELDS | {"enable_admin_page"}
    assert schema["enable_admin_page"]["default"] is True
    assert not schema["enable_admin_page"].get("invisible", False)
    assert all(schema[field].get("invisible") is True for field in LEGACY_FIELDS)
    assert set(schema["providers"]["templates"]) == TEMPLATES
    # These exact old shapes cannot be dropped until the host has handed them
    # to the explicit credential migration. The provider list is opaque to the
    # pinned host normalizer, but retaining its schema also preserves UI shape.
    templates = schema["providers"]["templates"]
    assert set(templates["deepseek"]["items"]["auth"]["items"]) == {"api_key"}
    assert set(templates["alibaba_bailian"]["items"]["auth"]["items"]) == {
        "access_key_id",
        "access_key_secret",
        "security_token",
    }
    assert "token" in templates["grsai"]["items"]["auth"]["items"]
    assert "url" in templates["provider_account"]["items"]["endpoint"]["items"]
    for field in ("base_url", "path", "auth_name", "json_body"):
        assert field in templates["openai_compatible"]["items"]["endpoint"]["items"]


def test_fixture_default_map_is_never_used_for_plugin_scalar_defaults(schema):
    def check(nodes):
        for node in nodes.values():
            if node["type"] == "object":
                check(node["items"])
            else:
                assert "default" in node
            if node["type"] == "template_list":
                for template in node["templates"].values():
                    check(template["items"])

    check(schema)


def test_pinned_host_normalizer_would_delete_legacy_config_with_bootstrap_only_schema(
    schema, tmp_path
):
    """Negative control: proves why testing a raw dict before host load is false assurance."""
    path = tmp_path / "synthetic-plugin-config.json"
    path.write_text(
        json.dumps(
            {
                "timeout_seconds": 19,
                "providers": [_base("deepseek")],
            }
        ),
        encoding="utf-8",
    )
    bootstrap_only = {"enable_admin_page": schema["enable_admin_page"]}
    host = SyntheticHostConfig(path, bootstrap_only)
    assert host == {"enable_admin_page": True}
    assert host.save_calls == 1
    assert json.loads(path.read_text()) == {"enable_admin_page": True}
    assert "synthetic-api-key-for-upgrade" not in path.read_text()


@pytest.mark.parametrize(
    "variant", original_provider_variants(), ids=list(original_provider_variants())
)
def test_pinned_host_normalization_preserves_every_original_provider_until_confirmed_migration(
    schema, tmp_path, monkeypatch, variant
):
    monkeypatch.delenv("QUOTA_LINK_SECRET_KEY", raising=False)
    record = original_provider_variants()[variant]
    source = {
        "timeout_seconds": 19.0,
        "total_timeout_seconds": 51.0,
        "cache_ttl_seconds": 91.0,
        "max_concurrency": 3,
        "command_admin_only": False,
        "private_allowed_user_ids": ["telegram:synthetic-user"],
        "allow_group_queries": True,
        "group_allowed_user_ids": ["synthetic-group-user"],
        "providers": [copy.deepcopy(record)],
    }
    environment = {
        "SYNTHETIC_STS_TOKEN": "synthetic-resolved-sts",
        "SYNTHETIC_GRSAI_TOKEN": "synthetic-resolved-grsai",
    }
    expected_runtime = copy.deepcopy(source)
    migrate_account_templates(expected_runtime)
    baseline = load_settings(expected_runtime, environ=environment)
    assert baseline.errors == (), (
        f"fixture must be valid old config: {baseline.errors!r}"
    )
    assert len(baseline.queryable_accounts) == 1
    host_path = tmp_path / "synthetic-host-config.json"
    host_path.write_text(json.dumps(source), encoding="utf-8")
    # This runs before any ConfigStore/plugin constructor, just like AstrBot.
    host = SyntheticHostConfig(host_path, schema)
    assert host["providers"] == source["providers"]
    assert all(host[key] == source[key] for key in LEGACY_FIELDS)
    disk_before_confirmation = json.loads(host_path.read_text())
    assert disk_before_confirmation["providers"] == source["providers"]
    assert host["enable_admin_page"] is True
    data_root = tmp_path / "plugin-data"
    data_root.mkdir()
    store = ConfigStore(SecretStore(data_root), host)
    snapshot = dispatch(store)
    assert snapshot["migration"]["pending"] is True
    assert store.runtime_config()["providers"] == source["providers"]
    assert json.loads(host_path.read_text()) == disk_before_confirmation
    for credential in record["auth"].values():
        assert credential not in json.dumps(snapshot)
    migrated = execute_migration(store)
    assert migrated["migration"]["pending"] is False
    assert migrated["migration"]["cleanup_pending"] is False
    assert all(host[key] == LEGACY_DEFAULTS[key] for key in LEGACY_FIELDS)
    assert host["enable_admin_page"] is True
    host_disk = host_path.read_text()
    for credential in record["auth"].values():
        assert credential not in host_disk
    # The same host normalizer must not revive old migration work on restart.
    reloaded_host = SyntheticHostConfig(host_path, schema)
    assert reloaded_host.save_calls == 0
    reloaded = ConfigStore(SecretStore(data_root), reloaded_host)
    again = dispatch(reloaded)
    assert again["migration"]["pending"] is False
    assert again["migration"]["cleanup_pending"] is False
    runtime = reloaded.runtime_config()
    assert runtime == expected_runtime
    restored = load_settings(runtime, environ=environment)
    assert restored.errors == ()
    assert (
        restored.queryable_accounts[0].config_fingerprint
        == baseline.queryable_accounts[0].config_fingerprint
    )
    for credential in record["auth"].values():
        assert credential not in json.dumps(again)


def test_default_host_upgrade_does_not_create_phantom_migration(
    schema, tmp_path, monkeypatch
):
    monkeypatch.delenv("QUOTA_LINK_SECRET_KEY", raising=False)
    host_path = tmp_path / "empty-synthetic-host.json"
    host_path.write_text("{}", encoding="utf-8")
    host = SyntheticHostConfig(host_path, schema)
    data_root = tmp_path / "plugin-data"
    data_root.mkdir()
    store = ConfigStore(SecretStore(data_root), host)
    snapshot = dispatch(store)
    assert snapshot["migration"]["pending"] is False
    assert snapshot["migration"]["cleanup_pending"] is False
    assert snapshot["config"] == {"providers": []}
