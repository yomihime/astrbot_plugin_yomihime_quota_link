"""Synthetic alert settings/store tests; no provider or delivery network calls."""

import asyncio
import copy
from dataclasses import FrozenInstanceError
from decimal import Decimal

import pytest

from quota_link.alert_config import (
    AlertConfigError,
    BalanceAlertLLM,
    BalanceAlertSettings,
    alert_configuration_error,
    normalize_alert_config,
    parse_alert_admin_qq_ids,
    parse_alert_decimal,
    parse_alert_llm,
    parse_balance_alert,
)
from quota_link.config_store import ConfigConflict, ConfigStore, ConfigValidation
from quota_link.security import SecretStore
from quota_link.settings import load_settings


def account(**overrides):
    return {
        "id": "synthetic-main",
        "type": "deepseek",
        "display_name": "Synthetic",
        "auth": {"api_key": "synthetic-secret-only"},
        **overrides,
    }


def configured(**alert_overrides):
    return {
        "providers": [
            account(
                balance_alert={
                    "enabled": True,
                    "unit": "CNY",
                    "threshold": "10.00",
                    **alert_overrides,
                }
            )
        ],
        "balance_alert_targets": [
            {"umo": "Synthetic:GroupMessage:900001", "mentions": []}
        ],
    }


def dispatch(store, operation="read", body=None, authorize=lambda: None):
    return asyncio.run(store.dispatch(operation, body or {}, authorize))


def ordinary(raw):
    result = copy.deepcopy(raw)
    for record in result.get("providers", []):
        record.pop("auth", None)
    return result


@pytest.mark.parametrize(
    "provider,profile,metric",
    [
        ("alibaba_bailian", "", "AvailableAmount"),
        ("deepseek", "", "total_balance"),
        ("grsai", "", "credit"),
        ("meinianda", "", "site_credit"),
        ("openai_compatible", "generic", "mapped_balance"),
        ("openai_compatible", "grsai", "credit"),
    ],
)
def test_provider_defaults_are_stable(provider, profile, metric):
    parsed = parse_balance_alert({}, provider, profile)
    assert not parsed.enabled
    assert parsed.metric == metric
    assert parsed.check_interval_minutes == 15
    assert parsed.unit == ""
    assert parsed.threshold is None
    assert parsed.repeat_minutes == 0


@pytest.mark.parametrize("value", [1, 15, 4320])
def test_interval_bounds(value):
    assert (
        parse_balance_alert(
            {"check_interval_minutes": value}, "deepseek"
        ).check_interval_minutes
        == value
    )


@pytest.mark.parametrize(
    "value", [None, "", "15", True, False, 1.0, 0, -1, 4321, {}, []]
)
def test_interval_rejects_nonintegers_without_clamping(value):
    with pytest.raises(AlertConfigError):
        parse_balance_alert({"check_interval_minutes": value}, "deepseek")


@pytest.mark.parametrize(
    "key,value",
    [
        ("enabled", 1),
        ("enabled", "false"),
        ("enabled", None),
        ("repeat_minutes", -1),
        ("repeat_minutes", 4321),
        ("repeat_minutes", True),
        ("repeat_minutes", "0"),
        ("repeat_minutes", 0.0),
        ("metric", "credit"),
        ("metric", None),
        ("metric", "total_balance\u200b"),
        ("unit", None),
        ("unit", "CNY USD"),
        ("unit", "CNY\n"),
        ("unit", "\u202eCNY"),
        ("unit", "x" * 33),
        ("extra", True),
    ],
)
def test_invalid_account_alert_fields(key, value):
    with pytest.raises(AlertConfigError):
        parse_balance_alert({key: value}, "deepseek")


@pytest.mark.parametrize("value", [None, [], True, "", 15])
def test_explicit_nonobject_alert_is_invalid(value):
    with pytest.raises(AlertConfigError):
        parse_balance_alert(value, "deepseek")


@pytest.mark.parametrize(
    "value,expected",
    [
        (None, None),
        ("0", Decimal(0)),
        ("-0", Decimal(0)),
        ("-0.000", Decimal(0)),
        (" 0.0100 ", Decimal("0.0100")),
        ("-8.25", Decimal("-8.25")),
        (
            "999999999999999999999999999999.123456789012345678",
            Decimal("999999999999999999999999999999.123456789012345678"),
        ),
    ],
)
def test_decimal_exact(value, expected):
    assert parse_alert_decimal(value) == expected


@pytest.mark.parametrize(
    "value",
    [
        "",
        " ",
        "+1",
        "01",
        "1.",
        ".5",
        "1e3",
        "1E-2",
        "NaN",
        "Infinity",
        "-Infinity",
        "１",
        "١",
        "1,000",
        "1 0",
        "0x10",
        "\ufeff1",
        "1\n",
        "1\x00",
        "1" * 31,
        "0." + "1" * 19,
        1,
        1.2,
        True,
        {},
        [],
        Decimal("1"),
    ],
)
def test_decimal_rejects_ambiguous_or_unbounded_inputs(value):
    with pytest.raises(AlertConfigError):
        parse_alert_decimal(value)


@pytest.mark.parametrize(
    "threshold,recovery", [("10", "10"), ("10", "9.9"), (None, "20"), ("-10", "-11")]
)
def test_recovery_must_be_strictly_higher(threshold, recovery):
    with pytest.raises(AlertConfigError):
        parse_balance_alert(
            {"threshold": threshold, "recovery_threshold": recovery}, "deepseek"
        )


@pytest.mark.parametrize(
    "threshold,recovery",
    [("0", "0.01"), ("10", "11.0"), ("-10", "-9.0"), ("0.001", "0.011")],
)
def test_default_recovery_uses_exact_hysteresis(threshold, recovery):
    parsed = parse_balance_alert({"threshold": threshold}, "deepseek")
    assert parsed.effective_recovery_threshold == Decimal(recovery)


def test_large_decimal_hysteresis_not_rounded_by_decimal_default_context():
    parsed = parse_balance_alert(
        {"threshold": "999999999999999999999999999999.123456789012345678"}, "deepseek"
    )
    assert parsed.effective_recovery_threshold == Decimal(
        "1099999999999999999999999999999.0358024679135802458"
    )


def test_readiness_and_runtime_safe_disable_legacy_preview():
    raw = configured(threshold=None, unit="")
    normalized = normalize_alert_config(raw, require_ready=False)
    assert normalized["providers"][0]["balance_alert"]["enabled"] is True
    parsed = load_settings(raw)
    assert parsed.accounts[0].queryable
    assert not parsed.accounts[0].balance_alert.enabled
    assert any(issue.code == "invalid_balance_alert" for issue in parsed.errors)
    with pytest.raises(AlertConfigError, match="阈值"):
        normalize_alert_config(raw)


@pytest.mark.parametrize(
    "mutation",
    ["missing_targets", "disabled_account", "missing_threshold", "missing_unit"],
)
def test_new_enabling_requires_complete_explicit_configuration(mutation):
    raw = configured()
    if mutation == "missing_targets":
        raw["balance_alert_targets"] = []
    elif mutation == "disabled_account":
        raw["providers"][0]["enabled"] = False
    else:
        raw["providers"][0]["balance_alert"][mutation.removeprefix("missing_")] = (
            None if mutation == "missing_threshold" else ""
        )
    with pytest.raises(AlertConfigError):
        normalize_alert_config(raw)
    assert not load_settings(raw).accounts[0].balance_alert.enabled


def test_optional_disabled_draft_empty_target_and_unit_preserved():
    raw = {"providers": [account(balance_alert={"enabled": False})]}
    normalized = normalize_alert_config(raw)
    assert normalized["providers"][0]["balance_alert"]["unit"] == ""
    assert "balance_alert_targets" not in normalized
    assert raw["providers"][0]["balance_alert"] == {"enabled": False}
    assert (
        alert_configuration_error(
            BalanceAlertSettings(), account_enabled=False, targets=()
        )
        is None
    )


@pytest.mark.parametrize(
    "provider,unit",
    [
        ("deepseek", "USD"),
        ("deepseek", ""),
        ("alibaba_bailian", "JPY"),
        ("alibaba_bailian", "USD"),
        ("grsai", "credit"),
        ("meinianda", "site_credit"),
        ("openai_compatible", "tokens"),
    ],
)
def test_ui_unit_suggestions_do_not_migrate_saved_unit_or_threshold(
    tmp_path, provider, unit
):
    """Web suggestions are draft-only, not a server-side currency conversion."""
    store = ConfigStore(SecretStore(tmp_path), {})
    raw = ordinary(
        {
            "providers": [
                account(
                    type=provider,
                    balance_alert={
                        "enabled": False,
                        "unit": unit,
                        "threshold": "-8.250000000000000001",
                    },
                )
            ]
        }
    )
    if provider == "openai_compatible":
        raw["providers"][0].update(
            {
                "endpoint": {
                    "base_url": "https://synthetic.example.invalid",
                    "path": "/balance",
                    "auth_mode": "bearer",
                },
                "response_mapping": {"amount_path": "/amount", "unit": "tokens"},
            }
        )
    saved = dispatch(store, "update", {"revision": 0, "config": raw})
    reloaded = dispatch(ConfigStore(SecretStore(tmp_path), {}))
    assert reloaded["config"] == saved["config"]
    assert reloaded["revision"] == saved["revision"]
    alert = reloaded["config"]["providers"][0]["balance_alert"]
    assert alert["unit"] == unit
    assert alert["threshold"] == "-8.250000000000000001"


def test_runtime_valid_settings_are_frozen_and_not_exposed_in_repr():
    raw = configured(threshold="-8.25")
    raw["balance_alert_admin_qq_ids"] = ["900002"]
    raw["balance_alert_llm"] = {
        "provider_id": "private-provider-id",
        "persona_id": "private-persona-id",
    }
    parsed = load_settings(raw)
    assert parsed.errors == ()
    alert = parsed.accounts[0].balance_alert
    assert (
        alert.enabled
        and alert.metric == "total_balance"
        and alert.threshold == Decimal("-8.25")
    )
    with pytest.raises(FrozenInstanceError):
        alert.enabled = False
    for secret in (
        "900001",
        "900002",
        "private-provider-id",
        "private-persona-id",
        "synthetic-secret-only",
        "threshold",
    ):
        assert secret not in repr(parsed)
        assert secret not in repr(parsed.accounts[0])
    assert not hasattr(parsed.directory.entries[0], "balance_alert")


@pytest.mark.parametrize(
    "key,value",
    [
        ("balance_alert_targets", None),
        ("balance_alert_admin_qq_ids", ["all"]),
        ("balance_alert_llm", {"enabled": 1}),
    ],
)
def test_malformed_global_settings_fail_closed_without_breaking_queries(key, value):
    parsed = load_settings({"providers": [account()], key: value})
    assert parsed.accounts[0].queryable
    assert any(issue.code == "invalid_balance_alert" for issue in parsed.errors)


def test_llm_defaults_and_trimmed_explicit_ids():
    assert parse_alert_llm({}) == BalanceAlertLLM()
    assert parse_alert_llm(
        {"enabled": False, "provider_id": " p 1 ", "persona_id": " personality "}
    ).as_dict() == {"enabled": False, "provider_id": "p 1", "persona_id": "personality"}


@pytest.mark.parametrize(
    "raw",
    [
        None,
        [],
        True,
        {"enabled": None},
        {"extra": "x"},
        {"provider_id": 1},
        {"provider_id": "x" * 129},
        {"persona_id": "x\n"},
        {"persona_id": "\ufeffx"},
    ],
)
def test_llm_invalid_values(raw):
    with pytest.raises(AlertConfigError):
        parse_alert_llm(raw)


def test_whitelist_stable_dedup_and_raw_limit():
    assert parse_alert_admin_qq_ids(["900001", " 900002 ", "900001"]) == (
        "900001",
        "900002",
    )
    with pytest.raises(AlertConfigError):
        parse_alert_admin_qq_ids(["1"] * 101)


def test_config_store_save_and_reload_preserve_exact_alert_settings(tmp_path):
    store = ConfigStore(SecretStore(tmp_path), {})
    raw = ordinary(
        configured(
            threshold="-8.250000000000000001",
            recovery_threshold="0",
            check_interval_minutes=4320,
        )
    )
    raw["balance_alert_admin_qq_ids"] = ["900002", "900002"]
    raw["balance_alert_llm"] = {"enabled": False}
    saved = dispatch(store, "update", {"revision": 0, "config": raw})
    assert saved["config"]["balance_alert_admin_qq_ids"] == ["900002"]
    assert (
        saved["config"]["providers"][0]["balance_alert"]["threshold"]
        == "-8.250000000000000001"
    )
    again = dispatch(ConfigStore(SecretStore(tmp_path), {}))
    assert again["config"] == saved["config"]
    assert again["revision"] == saved["revision"]
    assert again["credentials"] == saved["credentials"]
    with pytest.raises(ConfigConflict):
        dispatch(store, "update", {"revision": 0, "config": raw})
    assert dispatch(store) == saved


def test_invalid_update_is_atomic_and_does_not_change_revision(tmp_path):
    store = ConfigStore(SecretStore(tmp_path), {})
    raw = ordinary(configured())
    saved = dispatch(store, "update", {"revision": 0, "config": raw})
    raw["providers"][0]["balance_alert"]["threshold"] = "NaN"
    raw["balance_alert_targets"].append(
        {"umo": "Synthetic:FriendMessage:900003", "mentions": ["900004"]}
    )
    with pytest.raises(ConfigValidation):
        dispatch(store, "update", {"revision": saved["revision"], "config": raw})
    assert dispatch(store) == saved


def test_old_enabled_preview_manifest_is_readable_but_not_running(tmp_path):
    secrets = SecretStore(tmp_path)
    secrets.write_config(
        {
            "schema": "yomihime-quota-link/config/v1",
            "revision": 3,
            "config": ordinary(configured(threshold=None, unit="")),
            "credentials": {},
            "migrated": True,
            "legacy_cleanup": None,
        }
    )
    store = ConfigStore(secrets, {})
    dto = dispatch(store)
    assert dto["revision"] == 3
    assert dto["config"]["providers"][0]["balance_alert"]["enabled"]
    assert not load_settings(store.runtime_config()).accounts[0].balance_alert.enabled
    with pytest.raises(ConfigValidation, match="阈值"):
        dispatch(store, "update", {"revision": 3, "config": dto["config"]})
    fixed = copy.deepcopy(dto["config"])
    fixed["providers"][0]["balance_alert"]["enabled"] = False
    assert dispatch(store, "update", {"revision": 3, "config": fixed})["revision"] == 4


def test_authorization_is_rechecked_before_alert_persistence(tmp_path):
    store = ConfigStore(SecretStore(tmp_path), {})
    calls = 0

    def authorize():
        nonlocal calls
        calls += 1
        if calls >= 2:
            raise PermissionError("synthetic revoked principal")

    with pytest.raises(PermissionError):
        dispatch(
            store,
            "update",
            {"revision": 0, "config": ordinary(configured())},
            authorize,
        )
    assert dispatch(store)["revision"] == 0
