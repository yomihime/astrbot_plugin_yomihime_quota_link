"""Cleanup uses real ConfigStore/SecretStore with synthetic credentials only."""

import asyncio
from copy import deepcopy

import pytest

from quota_link.config_store import ConfigConflict, ConfigStore
from quota_link.security import SecretStore
from scripts.acceptance_config_patch import (
    OwnedAccount,
    OwnedField,
    Value,
    merge_owned,
    restore_owned,
)


def account(name):
    return {"id": name, "type": "deepseek", "display_name": name}


def run(awaitable):
    return asyncio.run(awaitable)


@pytest.fixture
def store(tmp_path, monkeypatch):
    monkeypatch.delenv("QUOTA_LINK_SECRET_KEY", raising=False)
    return ConfigStore(SecretStore(tmp_path), {})


async def save(store, config):
    dto = await store.dispatch("read", {}, lambda: None)
    return await store.dispatch(
        "update", {"revision": dto["revision"], "config": config}, lambda: None
    )


async def credential(store, name, text):
    dto = await store.dispatch("read", {}, lambda: None)
    await store.dispatch(
        "credential-replace",
        {
            "revision": dto["revision"],
            "account_id": name,
            "field": "api_key",
            "value": text,
        },
        lambda: None,
    )


def blob_snapshot(store):
    manifest = store.secrets.read_config()
    references = {
        key: deepcopy(value) for key, value in manifest["credentials"].items()
    }
    blobs = {
        entry["ref"]: store.secrets._files.read(entry["ref"] + ".blob", 1048832)
        for fields in references.values()
        for entry in fields.values()
        if entry["source"] == "encrypted"
    }
    return references, blobs


def assert_blobs_preserved(store, before):
    refs, blobs = before
    after = store.secrets.read_config()["credentials"]
    for account_id, fields in refs.items():
        assert after[account_id] == fields
    for reference, payload in blobs.items():
        assert store.secrets._files.read(reference + ".blob", 1048832) == payload


def test_added_modified_accounts_and_ciphertexts_survive_cleanup(store):
    async def exercise():
        await save(store, {"providers": [account("original")], "timeout_seconds": 11})
        await credential(store, "original", "synthetic-original-secret")
        receipt = OwnedField(
            None, ("timeout_seconds",), Value(True, 10), Value(True, 11)
        )
        current = (await store.dispatch("read", {}, lambda: None))["config"]
        current["providers"][0]["display_name"] = "user modified name"
        current["providers"].append(account("concurrent-new"))
        await save(store, current)
        await credential(store, "concurrent-new", "synthetic-new-secret")
        before = blob_snapshot(store)
        result = await restore_owned(store.dispatch, [receipt])
        assert result["changed"] and not result["conflicts"]
        final = await store.dispatch("read", {}, lambda: None)
        assert final["config"]["timeout_seconds"] == 10
        assert final["config"]["providers"] == current["providers"]
        assert_blobs_preserved(store, before)

    run(exercise())


def test_cas_conflict_reloads_new_account_and_new_credential(store):
    async def exercise():
        await save(store, {"providers": [account("original")], "timeout_seconds": 11})
        injected = False
        latest_blobs = None

        async def racing(operation, body, authorize):
            nonlocal injected, latest_blobs
            if operation == "update" and not injected:
                injected = True
                dto = await store.dispatch("read", {}, authorize)
                dto["config"]["providers"].append(account("racing-account"))
                await save(store, dto["config"])
                await credential(store, "racing-account", "synthetic-race-secret")
                latest_blobs = blob_snapshot(store)
            return await store.dispatch(operation, body, authorize)

        result = await restore_owned(
            racing,
            [OwnedField(None, ("timeout_seconds",), Value(True, 10), Value(True, 11))],
        )
        assert injected and result["changed"]
        assert_blobs_preserved(store, latest_blobs)
        assert "racing-account" in {
            a["id"] for a in store.secrets.read_config()["config"]["providers"]
        }

    run(exercise())


def test_same_field_user_change_wins_even_after_cas_conflict(store):
    async def exercise():
        await save(store, {"providers": [account("original")], "timeout_seconds": 11})
        injected = False

        async def racing(operation, body, authorize):
            nonlocal injected
            if operation == "update" and not injected:
                injected = True
                dto = await store.dispatch("read", {}, authorize)
                dto["config"]["timeout_seconds"] = 42
                await save(store, dto["config"])
                raise ConfigConflict()
            return await store.dispatch(operation, body, authorize)

        result = await restore_owned(
            racing,
            [OwnedField(None, ("timeout_seconds",), Value(True, 10), Value(True, 11))],
        )
        assert not result["changed"] and result["conflicts"]
        assert store.secrets.read_config()["config"]["timeout_seconds"] == 42

    run(exercise())


@pytest.mark.parametrize("user_change", ["public", "credential", "none"])
def test_fixture_removal_preserves_user_changes_and_new_secret(store, user_change):
    async def exercise():
        fixture = account("synthetic-fixture")
        await save(store, {"providers": [account("other"), fixture]})
        await credential(store, "other", "synthetic-preserved-secret")
        if user_change == "public":
            dto = await store.dispatch("read", {}, lambda: None)
            dto["config"]["providers"][1]["display_name"] = "user renamed fixture"
            await save(store, dto["config"])
        if user_change == "credential":
            await credential(store, "synthetic-fixture", "synthetic-user-new-secret")
        before = blob_snapshot(store)
        result = await restore_owned(store.dispatch, accounts=[OwnedAccount(fixture)])
        assert bool(result["conflicts"]) == (user_change != "none")
        final = await store.dispatch("read", {}, lambda: None)
        assert (
            "synthetic-fixture" in {a["id"] for a in final["config"]["providers"]}
        ) == (user_change != "none")
        assert_blobs_preserved(store, before)

    run(exercise())


def test_target_list_merge_preserves_user_added_target_and_rejects_same_target_edit():
    old = {"umo": "synthetic:GroupMessage:1", "mentions": []}
    owned = {"umo": "synthetic:GroupMessage:2", "mentions": []}
    user = {"umo": "synthetic:GroupMessage:3", "mentions": []}
    field = OwnedField(
        None, ("balance_alert_targets",), Value(True, [old]), Value(True, [owned])
    )
    dto = {
        "revision": 1,
        "config": {"providers": [], "balance_alert_targets": [owned, user]},
    }
    result, conflicts = merge_owned(dto, [field])
    assert not conflicts and result["balance_alert_targets"] == [user, old]
    dto["config"]["balance_alert_targets"][0] = {**owned, "mentions": ["9"]}
    result, conflicts = merge_owned(dto, [field])
    assert conflicts and result == dto["config"]


def test_absent_target_baseline_removes_only_owned_target_and_preserves_ciphertexts(
    store,
):
    async def exercise():
        baseline = await save(store, {"providers": [account("original")]})
        assert "balance_alert_targets" not in baseline["config"]
        await credential(store, "original", "synthetic-existing-secret")
        owned = {"umo": "synthetic:GroupMessage:1", "mentions": []}
        user = {"umo": "synthetic:GroupMessage:2", "mentions": ["9"]}
        root_config = deepcopy(baseline["config"])
        root_config["balance_alert_targets"] = [owned]
        saved = await save(store, root_config)
        receipt = OwnedField(
            None,
            ("balance_alert_targets",),
            Value(False),
            Value(True, saved["config"]["balance_alert_targets"]),
        )
        concurrent = deepcopy(saved["config"])
        concurrent["balance_alert_targets"].append(user)
        concurrent["providers"].append(account("concurrent-new"))
        concurrent["providers"][0]["display_name"] = "user updated existing account"
        await save(store, concurrent)
        await credential(store, "concurrent-new", "synthetic-new-secret")
        before = blob_snapshot(store)
        result = await restore_owned(store.dispatch, [receipt])
        assert result["changed"] and not result["conflicts"]
        final = await store.dispatch("read", {}, lambda: None)
        assert final["config"]["balance_alert_targets"] == [user]
        assert final["config"]["providers"] == concurrent["providers"]
        assert_blobs_preserved(store, before)

    run(exercise())


def test_absent_target_baseline_without_concurrent_addition_restores_absence(store):
    async def exercise():
        baseline = await save(store, {"providers": [account("original")]})
        assert "balance_alert_targets" not in baseline["config"]
        owned = {"umo": "synthetic:GroupMessage:1", "mentions": []}
        config = deepcopy(baseline["config"])
        config["balance_alert_targets"] = [owned]
        saved = await save(store, config)
        receipt = OwnedField(
            None,
            ("balance_alert_targets",),
            Value(False),
            Value(True, saved["config"]["balance_alert_targets"]),
        )
        result = await restore_owned(store.dispatch, [receipt])
        assert result["changed"] and not result["conflicts"]
        final = await store.dispatch("read", {}, lambda: None)
        assert "balance_alert_targets" not in final["config"]

    run(exercise())


def test_absent_target_identity_merge_preserves_same_umo_user_edit_and_presence():
    owned = {"umo": "synthetic:GroupMessage:1", "mentions": []}
    changed = {**owned, "mentions": ["9"]}
    user = {"umo": "synthetic:GroupMessage:2", "mentions": []}
    field = OwnedField(
        None, ("balance_alert_targets",), Value(False), Value(True, [owned])
    )
    dto = {
        "revision": 1,
        "config": {"providers": [], "balance_alert_targets": [changed, user]},
    }
    result, conflicts = merge_owned(dto, [field])
    assert conflicts and result == dto["config"]
    # Only owned targets remain, with order changed: preserve original absence.
    other_owned = {"umo": "synthetic:GroupMessage:3", "mentions": []}
    reordered = {
        "revision": 1,
        "config": {"providers": [], "balance_alert_targets": [other_owned, owned]},
    }
    field = OwnedField(
        None,
        ("balance_alert_targets",),
        Value(False),
        Value(True, [owned, other_owned]),
    )
    result, conflicts = merge_owned(reordered, [field])
    assert not conflicts and "balance_alert_targets" not in result


@pytest.mark.parametrize("malformed", [None, "not-list", 1])
@pytest.mark.parametrize("side", ["before", "after"])
def test_present_nonlist_target_receipt_is_rejected(malformed, side):
    owned = {"umo": "synthetic:GroupMessage:1", "mentions": []}
    before, after = Value(False), Value(True, [owned])
    if side == "before":
        before = Value(True, malformed)
    else:
        after = Value(True, malformed)
    field = OwnedField(None, ("balance_alert_targets",), before, after)
    dto = {"revision": 1, "config": {"providers": [], "balance_alert_targets": [owned]}}
    with pytest.raises(ValueError, match="target receipt"):
        merge_owned(dto, [field])


def test_leaf_restore_retains_concurrent_sibling_and_absence():
    dto = {
        "revision": 1,
        "config": {
            "providers": [
                {
                    **account("a"),
                    "balance_alert": {
                        "enabled": False,
                        "threshold": "7",
                        "unit": "user-unit",
                    },
                }
            ]
        },
    }
    field = OwnedField(
        "a", ("balance_alert", "threshold"), Value(False), Value(True, "7")
    )
    merged, conflicts = merge_owned(dto, [field])
    assert not conflicts
    assert merged["providers"][0]["balance_alert"] == {
        "enabled": False,
        "unit": "user-unit",
    }


def test_no_secret_or_whole_account_replay():
    dto = {"revision": 1, "config": {"providers": []}}
    with pytest.raises(ValueError):
        merge_owned(
            dto, [OwnedField(None, ("providers",), Value(True, []), Value(True, []))]
        )
    with pytest.raises(ValueError):
        merge_owned(
            dto,
            accounts=[
                OwnedAccount({**account("fixture"), "auth": {"api_key": "forbidden"}})
            ],
        )


def test_non_cas_failure_does_not_retry():
    calls = []

    async def dispatch(operation, body, authorize):
        calls.append(operation)
        if operation == "read":
            return {"revision": 1, "config": {"providers": [], "timeout_seconds": 11}}
        raise RuntimeError("synthetic possible post-commit failure")

    with pytest.raises(RuntimeError):
        run(
            restore_owned(
                dispatch,
                [
                    OwnedField(
                        None, ("timeout_seconds",), Value(True, 10), Value(True, 11)
                    )
                ],
            )
        )
    assert calls == ["read", "update"]
