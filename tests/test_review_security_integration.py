"""Independent adversarial regression cases; all state is temporary/synthetic."""

import asyncio
import json
import shutil

import pytest

from quota_link.config_store import ConfigStore, ConfigValidation
from quota_link.security import SecretStore


@pytest.fixture(autouse=True)
def no_deployment_key(monkeypatch):
    monkeypatch.delenv("QUOTA_LINK_SECRET_KEY", raising=False)


def run(store, operation, body):
    return asyncio.run(store.dispatch(operation, body, lambda: None))


def account(**changes):
    return {"id": "review-account", "display_name": "Review account", **changes}


def test_review_nested_credentials_never_enter_plaintext_manifest(tmp_path):
    secrets = SecretStore(tmp_path)
    store = ConfigStore(secrets, {})
    with pytest.raises(ConfigValidation):
        run(
            store,
            "update",
            {
                "revision": 0,
                "config": {
                    "providers": [
                        account(
                            type="deepseek",
                            endpoint={
                                "json_body": {"token": "review-plaintext-sentinel"}
                            },
                        )
                    ]
                },
            },
        )
    assert secrets.read_config() is None


def test_review_template_only_type_change_does_not_rebind_credential(tmp_path):
    secrets = SecretStore(tmp_path)
    store = ConfigStore(secrets, {})
    run(
        store,
        "update",
        {
            "revision": 0,
            "config": {"providers": [account(__template_key="deepseek")]},
        },
    )
    run(
        store,
        "credential-replace",
        {
            "revision": 1,
            "account_id": "review-account",
            "field": "api_key",
            "value": "review-provider-secret",
        },
    )
    with pytest.raises(ConfigValidation):
        run(
            store,
            "update",
            {
                "revision": 2,
                "config": {
                    "providers": [
                        account(
                            __template_key="openai_compatible",
                            endpoint={
                                "url": "https://unused.invalid/balance",
                                "method": "GET",
                                "auth_mode": "bearer",
                            },
                            response_mapping={"amount_path": "/amount"},
                        )
                    ]
                },
            },
        )
    assert secrets.read_config()["revision"] == 2


def test_review_legacy_preview_hides_copied_credentials_and_env_values(
    tmp_path,
    monkeypatch,
):
    monkeypatch.setenv("REVIEW_SYNTHETIC_CREDENTIAL", "review-env-secret")
    legacy = {
        "providers": [
            account(
                type="deepseek",
                display_name="review-literal-secret and review-env-secret",
                aliases=["${REVIEW_SYNTHETIC_CREDENTIAL}"],
                auth={
                    "api_key": "review-literal-secret",
                    "token": "${REVIEW_SYNTHETIC_CREDENTIAL}",
                },
                endpoint={"json_body": {"password": "review-other-secret"}},
                response_mapping={
                    "status_values": {"review-literal-secret": "available"}
                },
            )
        ]
    }
    result = run(ConfigStore(SecretStore(tmp_path), legacy), "read", {})
    serialized = json.dumps(result)
    for value in (
        "review-literal-secret",
        "review-env-secret",
        "review-other-secret",
        "REVIEW_SYNTHETIC_CREDENTIAL",
    ):
        assert value not in serialized
    assert result["migration"]["pending"] is True


def test_review_manifest_only_restore_never_initializes_new_master_key(tmp_path):
    secrets = SecretStore(tmp_path)
    store = ConfigStore(secrets, {})
    run(
        store,
        "update",
        {
            "revision": 0,
            "config": {"providers": [account(type="deepseek")]},
        },
    )
    run(
        store,
        "credential-replace",
        {
            "revision": 1,
            "account_id": "review-account",
            "field": "api_key",
            "value": "review-lost-vault-secret",
        },
    )
    # Simulate an incomplete backup restore, without touching any live data.
    shutil.rmtree(tmp_path / "keys")
    shutil.rmtree(tmp_path / "secrets")
    reopened = SecretStore(tmp_path)
    assert reopened.encryption_readiness()["ready"] is False
    assert not (tmp_path / "keys" / "master.key").exists()
    assert reopened.read_config()["credentials"]


def test_review_lost_manifest_does_not_reactivate_uncleaned_legacy(tmp_path):
    class FailedCleanup(dict):
        def save_config(self):
            raise OSError("synthetic cleanup failure")

    legacy = FailedCleanup(
        {
            "providers": [
                account(
                    type="deepseek",
                    auth={"api_key": "review-retained-legacy-secret"},
                )
            ]
        }
    )
    store = ConfigStore(SecretStore(tmp_path), legacy)
    plan = run(store, "legacy-config-plan", {})
    migrated = run(
        store,
        "legacy-config-execute",
        {
            "revision": 0,
            "plan_id": plan["plan_id"],
            "confirm": True,
        },
    )
    assert migrated["migration"]["cleanup_pending"] is True
    (tmp_path / "config" / "accounts.json").unlink()
    (tmp_path / "keys" / "master.key").unlink()
    reopened = ConfigStore(SecretStore(tmp_path), legacy)
    with pytest.raises(ConfigValidation):
        reopened.runtime_config()
