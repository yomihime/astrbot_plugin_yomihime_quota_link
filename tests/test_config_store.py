"""Synthetic tests of the ordinary-config/encrypted-credential boundary."""

import asyncio
import copy
import json

import pytest

from quota_link.config_store import (
    LEGACY_DEFAULTS,
    ConfigConflict,
    ConfigStore,
    ConfigUnavailable,
    ConfigValidation,
)
from quota_link.security import SecretStore, SecretStoreUnavailable


class LegacyConfig(dict):
    def __init__(self, config):
        super().__init__(copy.deepcopy(config))
        self.saved = copy.deepcopy(config)
        self.save_calls = 0
        self.fail_save = False

    def save_config(self):
        self.save_calls += 1
        if self.fail_save:
            raise OSError("synthetic host write failure")
        self.saved = copy.deepcopy(dict(self))


def account(account_id="main", **overrides):
    return {
        "id": account_id,
        "type": "deepseek",
        "display_name": f"Account {account_id}",
        **overrides,
    }


def dispatch(store, operation="read", body=None, authorize=lambda: None):
    return asyncio.run(
        store.dispatch(operation, {} if body is None else body, authorize)
    )


def migrate(store):
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


def update(store, config, revision=None):
    if revision is None:
        revision = dispatch(store)["revision"]
    return dispatch(store, "update", {"revision": revision, "config": config})


def replace(store, value="synthetic-key-alpha", **overrides):
    body = {
        "revision": dispatch(store)["revision"],
        "account_id": "main",
        "field": "api_key",
        "value": value,
        **overrides,
    }
    return dispatch(store, "credential-replace", body)


def assert_status_only(dto, *secrets):
    encoded = json.dumps(dto)
    for secret in secrets:
        assert secret not in encoded
    for record in dto["config"]["providers"]:
        assert "auth" not in record
    for fields in dto["credentials"].values():
        for status in fields.values():
            assert set(status) == {"configured", "source"}
            assert type(status["configured"]) is bool
            assert status["source"] in {"missing", "encrypted", "environment"}


@pytest.fixture
def secret_store(tmp_path, monkeypatch):
    monkeypatch.delenv("QUOTA_LINK_SECRET_KEY", raising=False)
    return SecretStore(tmp_path)


@pytest.fixture
def fresh(secret_store):
    return ConfigStore(secret_store, LegacyConfig({}))


def test_fresh_defaults_do_not_require_migration(secret_store):
    host = LegacyConfig({"enable_admin_page": True, **LEGACY_DEFAULTS})
    store = ConfigStore(secret_store, host)
    snapshot = dispatch(store)
    assert snapshot["revision"] == 0
    assert snapshot["config"] == {"providers": []}
    assert snapshot["migration"]["pending"] is False
    assert snapshot["migration"]["cleanup_pending"] is False
    assert host.save_calls == 0
    assert secret_store.read_config() is None
    assert update(store, {"providers": [account()]})["revision"] == 1


def test_legacy_read_and_plan_are_secret_free_and_do_not_migrate(secret_store):
    host = LegacyConfig(
        {"providers": [account(auth={"api_key": "synthetic-legacy-secret"})]}
    )
    original = copy.deepcopy(dict(host))
    store = ConfigStore(secret_store, host)
    snapshot = dispatch(store)
    plan = dispatch(store, "legacy-config-plan")
    assert_status_only(snapshot, "synthetic-legacy-secret")
    assert plan == snapshot["migration"]
    assert plan["pending"] and plan["plaintext_count"] == 1
    assert plan["environment_count"] == 0
    assert dict(host) == original == host.saved
    assert host.save_calls == 0
    assert secret_store.read_config() is None
    assert store.runtime_config() == original


@pytest.mark.parametrize(
    "operation", ["update", "credential-replace", "credential-clear"]
)
def test_mutation_is_blocked_until_legacy_migration_confirmed(secret_store, operation):
    host = LegacyConfig({"providers": [account(auth={"api_key": "synthetic-old"})]})
    store = ConfigStore(secret_store, host)
    with pytest.raises(ConfigValidation):
        dispatch(store, operation, {"revision": 0, "config": {"providers": []}})
    assert secret_store.read_config() is None
    assert host.save_calls == 0


@pytest.mark.parametrize("confirmation", [None, False, 1, "true"])
def test_migration_requires_literal_confirmation(secret_store, confirmation):
    host = LegacyConfig({"providers": [account(auth={"api_key": "synthetic-old"})]})
    store = ConfigStore(secret_store, host)
    plan = dispatch(store, "legacy-config-plan")
    with pytest.raises(ConfigConflict):
        dispatch(
            store,
            "legacy-config-execute",
            {
                "revision": 0,
                "plan_id": plan["plan_id"],
                "confirm": confirmation,
            },
        )
    assert secret_store.read_config() is None
    assert host.save_calls == 0


def test_plan_is_bound_to_exact_current_legacy_source(secret_store):
    host = LegacyConfig({"providers": [account(auth={"api_key": "synthetic-old"})]})
    store = ConfigStore(secret_store, host)
    plan = dispatch(store, "legacy-config-plan")
    host["providers"][0]["auth"]["api_key"] = "synthetic-changed"
    with pytest.raises(ConfigConflict):
        dispatch(
            store,
            "legacy-config-execute",
            {
                "revision": 0,
                "plan_id": plan["plan_id"],
                "confirm": True,
            },
        )
    assert secret_store.read_config() is None
    assert host.save_calls == 0
    assert migrate(store)["migration"]["pending"] is False


def test_migration_separates_ciphertext_refs_and_preserves_env_reference(
    secret_store, tmp_path, monkeypatch
):
    monkeypatch.setenv("SYNTHETIC_QUOTA_ENV", "synthetic-resolved-env-secret")
    host = LegacyConfig(
        {
            "enable_admin_page": True,
            "timeout_seconds": 17.0,
            "providers": [
                account("plain", auth={"api_key": "synthetic-migration-plaintext"}),
                account("env", auth={"api_key": "${SYNTHETIC_QUOTA_ENV}"}),
            ],
        }
    )
    store = ConfigStore(secret_store, host)
    planned = dispatch(store)["migration"]
    assert (planned["plaintext_count"], planned["environment_count"]) == (1, 1)
    migrated = migrate(store)
    assert migrated["revision"] == 1
    assert not migrated["migration"]["pending"]
    assert not migrated["migration"]["cleanup_pending"]
    assert_status_only(
        migrated,
        "synthetic-migration-plaintext",
        "synthetic-resolved-env-secret",
        "SYNTHETIC_QUOTA_ENV",
    )
    manifest = secret_store.read_config()
    plain = manifest["credentials"]["plain"]["api_key"]
    assert plain["source"] == "encrypted"
    assert secret_store.get(plain["ref"]) == b"synthetic-migration-plaintext"
    assert manifest["credentials"]["env"]["api_key"] == {
        "source": "environment",
        "name": "SYNTHETIC_QUOTA_ENV",
    }
    assert all("auth" not in item for item in manifest["config"]["providers"])
    for file in tmp_path.rglob("*"):
        if file.is_file():
            raw = file.read_bytes()
            assert b"synthetic-migration-plaintext" not in raw
            assert b"synthetic-resolved-env-secret" not in raw
    assert host["providers"] == []
    assert host["enable_admin_page"] is True
    assert host.saved == dict(host)
    reloaded = ConfigStore(SecretStore(tmp_path), host)
    runtime = reloaded.runtime_config()
    assert runtime["timeout_seconds"] == 17.0
    assert runtime["providers"][0]["auth"]["api_key"] == "synthetic-migration-plaintext"
    assert runtime["providers"][1]["auth"]["api_key"] == "${SYNTHETIC_QUOTA_ENV}"
    with pytest.raises(ConfigConflict):
        migrate(reloaded)


def test_ordinary_save_does_not_replace_or_return_credentials(fresh, secret_store):
    update(fresh, {"providers": [account()]})
    dto = replace(fresh)
    before = secret_store.read_config()["credentials"]
    assert_status_only(dto, "synthetic-key-alpha")
    config = copy.deepcopy(dto["config"])
    config["providers"][0]["display_name"] = "Renamed safely"
    saved = update(fresh, config)
    assert_status_only(saved, "synthetic-key-alpha")
    assert secret_store.read_config()["credentials"] == before
    assert fresh.runtime_config()["providers"][0]["auth"] == {
        "api_key": "synthetic-key-alpha",
    }


@pytest.mark.parametrize(
    "record_extra",
    [
        {"auth": {"api_key": "synthetic-injected"}},
        {"api_key": "synthetic-injected"},
        {"endpoint": {"url": "https://example.invalid", "token": "synthetic-injected"}},
    ],
)
def test_ordinary_save_rejects_credential_fields(fresh, secret_store, record_extra):
    update(fresh, {"providers": [account()]})
    before = secret_store.read_config()
    with pytest.raises(ConfigValidation):
        update(fresh, {"providers": [account(**record_extra)]})
    assert secret_store.read_config() == before


def test_credential_replace_and_clear_never_return_secret_values(fresh, secret_store):
    update(fresh, {"providers": [account()]})
    first = replace(fresh)
    old_ref = secret_store.read_config()["credentials"]["main"]["api_key"]["ref"]
    second = replace(fresh, "synthetic-key-beta")
    new_ref = secret_store.read_config()["credentials"]["main"]["api_key"]["ref"]
    assert old_ref != new_ref
    assert_status_only(first, "synthetic-key-alpha")
    assert_status_only(second, "synthetic-key-alpha", "synthetic-key-beta")
    assert (
        fresh.runtime_config()["providers"][0]["auth"]["api_key"]
        == "synthetic-key-beta"
    )
    clear = dispatch(
        fresh,
        "credential-clear",
        {
            "revision": second["revision"],
            "account_id": "main",
            "field": "api_key",
        },
    )
    assert clear["credentials"]["main"]["api_key"] == {
        "configured": False,
        "source": "missing",
    }
    assert fresh.runtime_config()["providers"][0]["auth"] == {}
    assert_status_only(dispatch(fresh, "credential-status"), "synthetic-key-beta")


def test_environment_credential_operation_preserves_reference(fresh, secret_store):
    update(fresh, {"providers": [account()]})
    dto = dispatch(
        fresh,
        "credential-replace",
        {
            "revision": 1,
            "account_id": "main",
            "field": "api_key",
            "environment": "SYNTHETIC_RUNTIME_KEY",
        },
    )
    assert_status_only(dto, "SYNTHETIC_RUNTIME_KEY")
    assert (
        fresh.runtime_config()["providers"][0]["auth"]["api_key"]
        == "${SYNTHETIC_RUNTIME_KEY}"
    )
    assert secret_store.read_config()["credentials"]["main"]["api_key"] == {
        "source": "environment",
        "name": "SYNTHETIC_RUNTIME_KEY",
    }


@pytest.mark.parametrize("revision", [None, -1, True, "1", 0, 2])
def test_all_writes_use_strict_revision_compare_and_swap(fresh, secret_store, revision):
    update(fresh, {"providers": [account()]})
    before = secret_store.read_config()
    with pytest.raises(ConfigConflict):
        dispatch(
            fresh,
            "credential-replace",
            {
                "revision": revision,
                "account_id": "main",
                "field": "api_key",
                "value": "synthetic-never-written",
            },
        )
    assert secret_store.read_config() == before


def test_concurrent_updates_with_same_revision_have_exactly_one_winner(fresh):
    async def race():
        return await asyncio.gather(
            fresh.dispatch(
                "update",
                {"revision": 0, "config": {"providers": [account("a")]}},
                lambda: None,
            ),
            fresh.dispatch(
                "update",
                {"revision": 0, "config": {"providers": [account("b")]}},
                lambda: None,
            ),
            return_exceptions=True,
        )

    results = asyncio.run(race())
    assert sum(isinstance(result, dict) for result in results) == 1
    assert sum(isinstance(result, ConfigConflict) for result in results) == 1
    assert dispatch(fresh)["revision"] == 1


def test_failed_secret_write_does_not_publish_or_delete_legacy(
    secret_store, monkeypatch
):
    host = LegacyConfig({"providers": [account(auth={"api_key": "synthetic-kept"})]})
    store = ConfigStore(secret_store, host)
    original = copy.deepcopy(dict(host))

    def fail_put(value):
        raise SecretStoreUnavailable()

    monkeypatch.setattr(secret_store, "put", fail_put)
    with pytest.raises(ConfigUnavailable):
        migrate(store)
    assert secret_store.read_config() is None
    assert dict(host) == original == host.saved
    assert host.save_calls == 0


def test_failed_manifest_write_keeps_original_credential_usable(
    fresh, secret_store, monkeypatch
):
    update(fresh, {"providers": [account()]})
    replace(fresh, "synthetic-live-key")
    before = secret_store.read_config()

    def fail_write(value, **kwargs):
        raise SecretStoreUnavailable()

    monkeypatch.setattr(secret_store, "write_config", fail_write)
    with pytest.raises(ConfigUnavailable):
        replace(fresh, "synthetic-unpublished-key")
    assert secret_store.read_config() == before
    assert (
        fresh.runtime_config()["providers"][0]["auth"]["api_key"]
        == "synthetic-live-key"
    )


def test_failed_migration_manifest_write_is_recoverable(secret_store, monkeypatch):
    host = LegacyConfig(
        {"providers": [account(auth={"api_key": "synthetic-legacy-live"})]}
    )
    store = ConfigStore(secret_store, host)
    original = copy.deepcopy(dict(host))
    write = secret_store.write_config

    def fail_write(value, **kwargs):
        raise OSError("synthetic atomic publication failure")

    monkeypatch.setattr(secret_store, "write_config", fail_write)
    with pytest.raises(ConfigUnavailable):
        migrate(store)
    assert secret_store.read_config() is None
    assert dict(host) == original == host.saved
    assert host.save_calls == 0
    monkeypatch.setattr(secret_store, "write_config", write)
    recovered = migrate(store)
    assert recovered["revision"] == 1
    assert host["providers"] == []
    assert (
        store.runtime_config()["providers"][0]["auth"]["api_key"]
        == "synthetic-legacy-live"
    )


def test_failed_host_cleanup_can_retry_without_reencrypting(secret_store, monkeypatch):
    host = LegacyConfig(
        {"providers": [account(auth={"api_key": "synthetic-cleanup-key"})]}
    )
    original = copy.deepcopy(dict(host))
    host.fail_save = True
    store = ConfigStore(secret_store, host)
    migrated = migrate(store)
    assert not migrated["migration"]["pending"]
    assert migrated["migration"]["cleanup_pending"]
    assert dict(host) == original == host.saved
    durable = secret_store.read_config()
    assert durable["migrated"] is True
    assert (
        store.runtime_config()["providers"][0]["auth"]["api_key"]
        == "synthetic-cleanup-key"
    )
    host.fail_save = False

    def no_new_secret(value):
        raise AssertionError("cleanup must not encrypt or recreate a credential")

    monkeypatch.setattr(secret_store, "put", no_new_secret)
    cleaned = migrate(store)
    assert not cleaned["migration"]["cleanup_pending"]
    assert secret_store.read_config()["credentials"] == durable["credentials"]
    assert host["providers"] == []
    assert host.save_calls == 2


def test_missing_established_key_fails_closed_and_does_not_generate_replacement(
    fresh, secret_store, tmp_path
):
    update(fresh, {"providers": [account()]})
    replace(fresh, "synthetic-unrecoverable-without-key")
    before = secret_store.read_config()
    key_file = tmp_path / "keys" / "master.key"
    assert key_file.is_file()
    key_file.unlink()
    reloaded = ConfigStore(SecretStore(tmp_path), LegacyConfig({}))
    dto = dispatch(reloaded)
    assert dto["encryption"]["ready"] is False
    assert_status_only(dto, "synthetic-unrecoverable-without-key")
    assert reloaded.runtime_config()["providers"][0]["auth"] == {}
    assert not key_file.exists()
    with pytest.raises(ConfigUnavailable):
        replace(reloaded, "synthetic-forbidden-replacement")
    assert secret_store.read_config() == before
    assert not key_file.exists()


def test_reauthorization_failure_before_commit_preserves_previous_state(
    fresh, secret_store
):
    update(fresh, {"providers": [account()]})
    before = secret_store.read_config()
    calls = 0

    def authorize():
        nonlocal calls
        calls += 1
        if calls > 1:
            raise PermissionError("synthetic revoked authority")

    with pytest.raises(PermissionError):
        dispatch(
            fresh, "update", {"revision": 1, "config": {"providers": []}}, authorize
        )
    assert calls == 2
    assert secret_store.read_config() == before


def test_change_callback_observes_only_persisted_runtime_config(secret_store):
    observed = []

    async def changed(config):
        assert secret_store.read_config() is not None
        observed.append(config)

    store = ConfigStore(secret_store, LegacyConfig({}), on_change=changed)
    update(store, {"providers": [account()]})
    replace(store, "synthetic-runtime-only")
    assert len(observed) == 2
    assert observed[-1]["providers"][0]["auth"]["api_key"] == "synthetic-runtime-only"
    assert_status_only(dispatch(store), "synthetic-runtime-only")


def test_cleanup_retry_does_not_erase_changed_legacy_source(secret_store):
    host = LegacyConfig(
        {"providers": [account(auth={"api_key": "synthetic-original-source"})]}
    )
    host.fail_save = True
    store = ConfigStore(secret_store, host)
    migrate(store)
    committed = secret_store.read_config()
    host["providers"][0]["auth"]["api_key"] = "synthetic-new-unmigrated-source"
    changed = copy.deepcopy(dict(host))
    host.fail_save = False
    snapshot = dispatch(store)
    assert snapshot["migration"]["pending"] is False
    assert snapshot["migration"]["cleanup_pending"] is False
    assert snapshot["migration"]["legacy_conflict"] is True
    with pytest.raises(ConfigConflict):
        migrate(store)
    assert dict(host) == changed
    assert secret_store.read_config() == committed
    assert (
        store.runtime_config()["providers"][0]["auth"]["api_key"]
        == "synthetic-original-source"
    )


@pytest.mark.parametrize("operation", ["read", "credential-status"])
def test_corrupted_manifest_cannot_return_plaintext_auth(
    fresh, secret_store, operation
):
    update(fresh, {"providers": [account()]})
    corrupt = secret_store.read_config()
    corrupt["config"]["providers"][0]["auth"] = {
        "api_key": "synthetic-untrusted-disk-secret"
    }
    secret_store.write_config(corrupt)
    with pytest.raises(ConfigUnavailable) as error:
        dispatch(fresh, operation)
    assert "synthetic-untrusted-disk-secret" not in str(error.value)


@pytest.mark.parametrize(
    "credential_entry",
    [
        {"source": "synthetic-secret-disguised-as-source"},
        {"source": "encrypted", "ref": "../../synthetic-secret-path"},
        {"source": "environment", "name": "${INVALID_ENV}"},
        {
            "source": "encrypted",
            "ref": "quota_secret_" + "0" * 48,
            "value": "synthetic-injected-plaintext",
        },
    ],
)
def test_corrupted_credential_entries_are_unavailable_not_reflected(
    fresh, secret_store, credential_entry
):
    update(fresh, {"providers": [account()]})
    corrupt = secret_store.read_config()
    corrupt["credentials"] = {"main": {"api_key": credential_entry}}
    secret_store.write_config(corrupt)
    with pytest.raises(ConfigUnavailable):
        dispatch(fresh)


def test_missing_key_does_not_fall_back_to_uncleaned_legacy_plaintext(
    secret_store, tmp_path
):
    host = LegacyConfig(
        {"providers": [account(auth={"api_key": "synthetic-do-not-fallback"})]}
    )
    host.fail_save = True
    store = ConfigStore(secret_store, host)
    migrate(store)
    assert host["providers"][0]["auth"]["api_key"] == "synthetic-do-not-fallback"
    (tmp_path / "keys" / "master.key").unlink()
    reloaded = ConfigStore(SecretStore(tmp_path), host)
    assert reloaded.runtime_config()["providers"][0]["auth"] == {}
    assert dispatch(reloaded)["encryption"]["ready"] is False
    assert not (tmp_path / "keys" / "master.key").exists()


@pytest.mark.parametrize(
    "field,value",
    [
        ("display_name", "prefix-synthetic-reflected-secret-suffix"),
        ("aliases", ["prefix-synthetic-reflected-secret-suffix"]),
        ("endpoint", {"url": "https://example.invalid/synthetic-reflected-secret"}),
    ],
)
def test_pending_legacy_preview_does_not_reflect_credentials_in_ordinary_fields(
    secret_store, field, value
):
    host = LegacyConfig(
        {
            "providers": [
                account(
                    auth={"api_key": "synthetic-reflected-secret"},
                    **{field: value},
                )
            ]
        }
    )
    store = ConfigStore(secret_store, host)
    assert_status_only(dispatch(store), "synthetic-reflected-secret")
    assert secret_store.read_config() is None
    assert host.save_calls == 0


def test_migration_does_not_publish_a_secret_copied_into_an_ordinary_name(secret_store):
    host = LegacyConfig(
        {
            "providers": [
                account(
                    display_name="prefix-synthetic-name-secret-suffix",
                    auth={"api_key": "synthetic-name-secret"},
                )
            ]
        }
    )
    store = ConfigStore(secret_store, host)
    with pytest.raises(ConfigValidation):
        migrate(store)
    assert secret_store.read_config() is None
    assert host.save_calls == 0
