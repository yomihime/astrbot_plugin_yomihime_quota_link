"""Storage projection keeps local-save facts separate from provider validity."""

import asyncio
import copy
import sys
from dataclasses import FrozenInstanceError, asdict
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from quota_link.local_status import (  # noqa: E402
    LocalStorageStatus,
    credential_label,
    project_storage_status,
    storage_summary,
)
from quota_link.settings import load_settings  # noqa: E402

FIELDS = (
    "api_key",
    "access_key_id",
    "access_key_secret",
    "security_token",
    "token",
    "secret",
    "key",
)


def directory(*ids):
    return load_settings(
        {
            "providers": [
                {
                    "id": account_id,
                    "type": "deepseek",
                    "display_name": f"演示账户 {index}",
                    "auth": {"api_key": "synthetic-value"},
                }
                for index, account_id in enumerate(ids)
            ]
        }
    ).directory


def statuses(**sources):
    return {
        field: {
            "configured": field in sources,
            "source": sources.get(field, "missing"),
        }
        for field in FIELDS
    }


def dto(**credentials):
    return {
        "credentials": credentials,
        "encryption": {"ready": True},
        "migration": {"pending": False},
        "config": {
            "private": "https://example.invalid/?key=SYNTHETIC_SECRET",
        },
    }


def test_account_order_and_distinct_saved_sources():
    source = dto(
        a=statuses(api_key="encrypted"),
        b=statuses(api_key="environment"),
        c=statuses(api_key="encrypted", token="environment"),
        d=statuses(),
    )
    projected = project_storage_status(directory("c", "a", "d", "b", "e"), source)
    assert projected == LocalStorageStatus(
        "ready", ("mixed", "encrypted", "missing", "environment", "unknown")
    )
    assert "环境变量引用已保存" == credential_label(projected, 3)
    assert "加密凭据已保存" == credential_label(projected, 1)
    assert "尚未保存凭据" == credential_label(projected, 2)
    assert "加密凭据与环境变量引用已保存" == credential_label(projected, 0)


def test_projection_is_immutable_and_contains_only_fixed_states():
    source = dto(**{"private-id-789": statuses(api_key="encrypted")})
    projected = project_storage_status(directory("private-id-789"), source)
    source["credentials"]["private-id-789"]["api_key"]["source"] = "environment"
    assert asdict(projected) == {"state": "ready", "account_states": ("encrypted",)}
    assert "private-id" not in repr(projected)
    assert "https://" not in repr(projected)
    assert "SYNTHETIC_SECRET" not in repr(projected)
    with pytest.raises(FrozenInstanceError):
        projected.state = "unknown"


def test_missing_and_empty_account_mapping_keep_unknown_status():
    projected = project_storage_status(directory("a", "b"), dto(a={}))
    assert projected.account_states == ("unknown", "unknown")
    assert credential_label(projected, 0) == "保存状态待确认"


def test_pending_migration_overrides_saved_record_claims():
    source = dto(a=statuses(api_key="encrypted"))
    source["migration"]["pending"] = True
    projected = project_storage_status(directory("a"), source)
    assert projected == LocalStorageStatus("migration_pending", ("unknown",))
    assert storage_summary(projected) == "旧配置待迁移"
    assert credential_label(projected, 0) == "保存状态待确认"


def test_unavailable_encryption_suppresses_saved_record_claims():
    source = dto(a=statuses(api_key="encrypted"))
    source["encryption"]["ready"] = False
    projected = project_storage_status(directory("a"), source)
    assert projected == LocalStorageStatus("unavailable", ("unknown",))
    assert storage_summary(projected) == "安全存储待检查"


@pytest.mark.parametrize("value", [None, [], "raw-private-input", 1, True])
def test_malformed_top_level_fails_closed(value):
    assert project_storage_status(directory("a"), value) == LocalStorageStatus(
        "unavailable", ("unknown",)
    )


@pytest.mark.parametrize(
    "section,key", [("encryption", "ready"), ("migration", "pending")]
)
@pytest.mark.parametrize("value", [None, 0, 1, "true", [], {}])
def test_readiness_flags_require_actual_booleans(section, key, value):
    source = dto(a=statuses())
    source[section][key] = value
    assert project_storage_status(directory("a"), source).state == "unavailable"


@pytest.mark.parametrize(
    "metadata",
    [
        None,
        {},
        {"configured": "true", "source": "encrypted"},
        {"configured": 1, "source": "encrypted"},
        {"configured": False, "source": "encrypted"},
        {"configured": True, "source": "missing"},
        {"configured": True, "source": "https://private.invalid"},
        {"configured": True, "source": "encrypted", "secret": "private"},
    ],
)
def test_malformed_field_discards_all_partial_claims(metadata):
    source = dto(a=statuses(api_key="encrypted"), b=statuses())
    source["credentials"]["b"]["api_key"] = metadata
    assert project_storage_status(directory("a", "b"), source) == LocalStorageStatus(
        "unavailable", ("unknown", "unknown")
    )


def test_partial_field_mapping_is_not_treated_as_missing_credentials():
    source = dto(a={"api_key": {"configured": False, "source": "missing"}})
    assert project_storage_status(directory("a"), source).state == "unavailable"


def test_all_supplied_account_metadata_is_validated():
    source = dto(a=statuses())
    source["credentials"]["unmatched-private-id"] = "malformed"
    assert project_storage_status(directory("a"), source).state == "unavailable"


def test_input_dto_is_unchanged_and_empty_directory_is_supported():
    source = dto()
    before = copy.deepcopy(source)
    assert project_storage_status(directory(), source) == LocalStorageStatus("ready")
    assert source == before


def test_real_config_store_dto_projects_encrypted_record(tmp_path, monkeypatch):
    from quota_link.config_store import ConfigStore
    from quota_link.security import SecretStore

    monkeypatch.delenv("QUOTA_LINK_SECRET_KEY", raising=False)
    store = ConfigStore(SecretStore(tmp_path), {})

    async def run():
        configured = await store.dispatch(
            "update",
            {
                "revision": 0,
                "config": {
                    "providers": [
                        {
                            "id": "private-account-id",
                            "type": "deepseek",
                            "display_name": "演示账户",
                        }
                    ]
                },
            },
            lambda: None,
        )
        await store.dispatch(
            "credential-replace",
            {
                "revision": configured["revision"],
                "account_id": "private-account-id",
                "field": "api_key",
                "value": "synthetic-local-secret",
            },
            lambda: None,
        )
        return await store.dispatch("credential-status", {}, lambda: None)

    actual = asyncio.run(run())
    runtime_directory = load_settings(store.runtime_config()).directory
    projected = project_storage_status(runtime_directory, actual)
    assert projected == LocalStorageStatus("ready", ("encrypted",))
    assert "private-account-id" not in repr(projected)
    assert "synthetic-local-secret" not in repr(projected)


def test_fixed_labels_do_not_echo_arbitrary_external_states():
    projected = LocalStorageStatus("https://private.invalid", ("SYNTHETIC_SECRET",))
    assert storage_summary(projected) == "凭据保存状态待确认"
    assert credential_label(projected, 0) == "保存状态待确认"
    assert credential_label(LocalStorageStatus("ready", ("private",)), 0) == (
        "保存状态待确认"
    )


@pytest.mark.parametrize("index", [-1, 1, True, "0", None])
def test_invalid_or_out_of_range_indices_are_unknown(index):
    assert credential_label(LocalStorageStatus("ready", ("encrypted",)), index) == (
        "保存状态待确认"
    )
