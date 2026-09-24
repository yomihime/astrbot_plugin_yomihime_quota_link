import json
from pathlib import Path

import pytest

from quota_link.models import (
    ProviderType,
    QueryParseErrorCode,
    QueryRequestKind,
)
from quota_link.settings import load_settings

_DEFAULT_ENDPOINT = object()


def account(
    account_id="main",
    display_name="DeepSeek",
    *,
    aliases=(),
    enabled=True,
    provider_type="deepseek",
    auth=None,
    endpoint=_DEFAULT_ENDPOINT,
    **extra,
):
    return {
        "id": account_id,
        "type": provider_type,
        "display_name": display_name,
        "aliases": list(aliases),
        "enabled": enabled,
        "auth": {"api_key": "secret-key"} if auth is None else auth,
        "endpoint": (
            {
                "url": "https://example.invalid/balance",
                "auth_mode": "bearer",
            }
            if provider_type == "openai_compatible"
            else None
            if provider_type in {"deepseek", "alibaba_bailian"}
            else {"url": "https://example.invalid/balance"}
        )
        if endpoint is _DEFAULT_ENDPOINT
        else endpoint,
        "response_mapping": {"amount_path": "/remaining"}
        if provider_type == "openai_compatible"
        else {},
        **extra,
    }


def test_empty_configuration_is_valid_with_defaults():
    settings = load_settings({})

    assert settings.accounts == ()
    assert settings.errors == ()
    assert settings.timeout_seconds == 8
    assert settings.cache_ttl_seconds == 60
    assert settings.max_concurrency == 4
    assert settings.total_timeout_seconds == 30
    assert settings.allow_group_queries is False
    assert settings.group_allowed_user_ids == ()


def test_unknown_type_and_duplicate_id_are_diagnosed_locally():
    settings = load_settings(
        {
            "providers": [
                account("same", "Bad type", provider_type="unknown"),
                account("same", "Working"),
                account(" SAME ", "Duplicate"),
            ]
        }
    )

    assert [item.id for item in settings.accounts] == ["same"]
    assert {error.code for error in settings.errors} == {"unknown_type", "duplicate_id"}
    assert all("secret-key" not in error.safe_message for error in settings.errors)
    duplicate = next(error for error in settings.errors if error.code == "duplicate_id")
    assert duplicate.account_id == "SAME"
    assert "secret-key" not in repr(settings.errors)


def test_cross_account_name_conflict_removes_both_but_keeps_healthy_account():
    settings = load_settings(
        {
            "providers": [
                account("one", "One", aliases=[" shared "]),
                account("two", "Two", aliases=["SHARED"]),
                account("three", "Three"),
            ]
        }
    )

    assert [item.id for item in settings.accounts] == ["three"]
    assert sum(error.code == "name_conflict" for error in settings.errors) == 2


def test_same_account_names_deduplicate_and_account_name_beats_provider_alias():
    settings = load_settings(
        {
            "providers": [
                account("custom", "DeepSeek", aliases=["custom", "DEEPSEEK", " work "]),
            ]
        }
    )

    assert [item.id for item in settings.accounts] == ["custom"]
    assert settings.accounts[0].aliases == ("work",)
    resolved = settings.resolve_target("  deepseek ")
    assert resolved.request is not None
    assert resolved.request.kind is QueryRequestKind.ACCOUNT
    assert resolved.request.target == "custom"


def test_provider_alias_resolves_provider_even_when_multiple_accounts_share_type():
    settings = load_settings(
        {"providers": [account("a", "First"), account("b", "Second")]}
    )

    result = settings.resolve_target("深度求索")
    assert result.request is not None
    assert result.request.kind is QueryRequestKind.PROVIDER
    assert result.request.target == ProviderType.DEEPSEEK.value
    assert len(settings.queryable_accounts) == 2


def test_provider_aliases_are_public_normalized_and_read_only():
    aliases = load_settings({}).directory.provider_aliases

    assert aliases["deepseek"] is ProviderType.DEEPSEEK
    assert aliases["深度求索"] is ProviderType.DEEPSEEK
    assert aliases["阿里百炼"] is ProviderType.ALIBABA_BAILIAN
    assert aliases["openai-compatible"] is ProviderType.OPENAI_COMPATIBLE
    with pytest.raises(TypeError):
        aliases["custom"] = ProviderType.DEEPSEEK


def test_missing_environment_reference_and_credentials_are_unqueryable():
    settings = load_settings(
        {
            "providers": [
                account("env", "Env", auth={"api_key": "${MISSING_SECRET}"}),
                account("none", "None", auth={}),
                account("healthy", "Healthy"),
            ]
        },
        environ={},
    )

    assert [
        (item.id, item.queryable, item.unavailable_reason) for item in settings.accounts
    ] == [
        ("env", False, "missing_environment_variable"),
        ("none", False, "missing_credentials"),
        ("healthy", True, None),
    ]
    assert [item.id for item in settings.queryable_accounts] == ["healthy"]
    localized = {
        error.code: error.account_id
        for error in settings.errors
        if error.code in {"missing_environment_variable", "missing_credentials"}
    }
    assert localized == {
        "missing_environment_variable": "env",
        "missing_credentials": "none",
    }


def test_missing_endpoint_and_disabled_account_do_not_enter_resolution_index():
    settings = load_settings(
        {
            "providers": [
                account(
                    "no-endpoint",
                    "No endpoint",
                    endpoint=None,
                    auth={"api_key": "credential"},
                    provider_type="openai_compatible",
                ),
                account("disabled", "Disabled", enabled=False),
            ]
        }
    )

    assert settings.accounts[0].unavailable_reason == "missing_endpoint"
    assert (
        next(
            error.account_id
            for error in settings.errors
            if error.code == "missing_endpoint"
        )
        == "no-endpoint"
    )
    assert [item.id for item in settings.enabled_accounts] == ["no-endpoint"]
    assert (
        settings.resolve_target("disabled").error.code
        is QueryParseErrorCode.UNKNOWN_TARGET
    )


def test_timeout_and_ttl_must_be_positive_and_use_safe_defaults():
    settings = load_settings(
        {
            "timeout_seconds": 0,
            "cache_ttl_seconds": -1,
            "providers": [account("main", "Main", timeout_seconds=float("inf"))],
        }
    )

    assert settings.timeout_seconds == 8
    assert settings.cache_ttl_seconds == 60
    assert settings.accounts[0].timeout_seconds == 8
    assert settings.accounts[0].cache_ttl_seconds == 60
    assert [error.code for error in settings.errors].count(
        "invalid_positive_number"
    ) == 3


def test_huge_integer_setting_is_local_diagnostic_and_keeps_healthy_account():
    settings = load_settings(
        {
            "providers": [
                account("huge", "Huge", timeout_seconds=10**10000),
                account("healthy", "Healthy"),
            ]
        }
    )

    assert [item.id for item in settings.accounts] == ["huge", "healthy"]
    assert settings.accounts[0].timeout_seconds == 8
    diagnostic = next(
        error for error in settings.errors if error.code == "invalid_positive_number"
    )
    assert diagnostic.account_id == "huge"


def test_diagnostic_does_not_include_an_id_that_contains_a_credential():
    settings = load_settings(
        {
            "providers": [
                account(
                    "prefix-secret-key-suffix",
                    "Unsafe name",
                    auth={"api_key": "secret-key"},
                )
            ]
        }
    )

    assert settings.accounts == ()
    diagnostic = next(
        error for error in settings.errors if error.code == "secret_in_name"
    )
    assert diagnostic.account_id is None
    assert "secret-key" not in repr(diagnostic)


def test_account_id_is_checked_against_secrets_from_other_accounts():
    settings = load_settings(
        {
            "providers": [
                account("secret-key", "Invalid type", provider_type="unknown"),
                account("healthy", "Healthy", auth={"api_key": "secret-key"}),
            ]
        }
    )

    diagnostic = next(
        error for error in settings.errors if error.code == "unknown_type"
    )
    assert diagnostic.account_id is None
    assert [item.id for item in settings.accounts] == ["healthy"]
    assert "secret-key" not in repr(settings.errors)


def test_secret_is_hidden_from_repr_diagnostics_and_name_index():
    settings = load_settings(
        {
            "providers": [
                account(
                    "main",
                    "safe",
                    aliases=["secret-key"],
                    auth={"api_key": "secret-key"},
                )
            ]
        }
    )

    assert settings.accounts == ()
    assert "secret-key" not in repr(settings)
    assert all("secret-key" not in error.safe_message for error in settings.errors)
    assert (
        settings.resolve_target("secret-key").error.code
        is QueryParseErrorCode.UNKNOWN_TARGET
    )


def test_environment_resolved_secret_is_available_but_hidden_from_repr():
    settings = load_settings(
        {"providers": [account("main", "Main", auth={"api_key": "${API_KEY}"})]},
        environ={"API_KEY": "resolved-secret"},
    )

    assert settings.accounts[0].queryable
    assert "resolved-secret" not in repr(settings)
    assert settings.accounts[0].env_references[0].variable_name == "API_KEY"
    assert settings.directory.entries[0].id == "main"
    assert not hasattr(settings.directory.entries[0], "auth")


def test_query_fingerprint_tracks_auth_endpoint_and_response_mapping_only():
    base = account(
        auth={"api_key": "secret-a"},
        endpoint={"url": "https://example.invalid/balance"},
        response_mapping={"remaining": "data.left"},
    )
    same = {**base, "display_name": "Renamed", "aliases": ["other"]}
    variants = (
        {**base, "auth": {"api_key": "secret-b"}},
        {**base, "endpoint": {"url": "https://example.invalid/v2/balance"}},
        {**base, "response_mapping": {"remaining": "result.left"}},
        {**base, "timeout_seconds": 3},
    )
    fingerprint = load_settings({"providers": [base]}).accounts[0].config_fingerprint

    assert (
        load_settings({"providers": [base]}).accounts[0].config_fingerprint
        == fingerprint
    )
    assert (
        load_settings({"providers": [same]}).accounts[0].config_fingerprint
        == fingerprint
    )
    assert all(
        load_settings({"providers": [variant]}).accounts[0].config_fingerprint
        != fingerprint
        for variant in variants
    )
    assert "secret-a" not in fingerprint
    assert "secret-a" not in repr(load_settings({"providers": [base]}))


def test_account_response_mapping_is_immutable_and_hidden_from_repr():
    settings = load_settings(
        {
            "providers": [
                account(
                    response_mapping={
                        "remaining": "payload.balance",
                        "nested": {"x": 1},
                    }
                )
            ]
        }
    )
    mapping = settings.accounts[0].response_mapping

    assert mapping["remaining"] == "payload.balance"
    assert mapping["nested"]["x"] == 1
    assert "response_mapping" not in repr(settings.accounts[0])
    with pytest.raises(TypeError):
        mapping["remaining"] = "changed"
    with pytest.raises(TypeError):
        mapping["nested"]["x"] = 2


def test_builtin_provider_types_accept_missing_account_endpoint():
    settings = load_settings(
        {
            "providers": [
                account("deepseek", "DeepSeek", endpoint=None),
                account(
                    "bailian",
                    "Bailian",
                    provider_type="alibaba_bailian",
                    endpoint=None,
                    auth={
                        "access_key_id": "ram-id",
                        "access_key_secret": "ram-secret",
                    },
                ),
            ]
        }
    )

    assert [item.queryable for item in settings.accounts] == [True, True]
    assert not any(error.code == "missing_endpoint" for error in settings.errors)


def test_each_provider_requires_its_own_credentials():
    settings = load_settings(
        {
            "providers": [
                account("ds", "DeepSeek", auth={"access_key_id": "wrong"}),
                account("ali", "Ali", provider_type="alibaba_bailian"),
                account(
                    "compatible",
                    "Compatible",
                    provider_type="openai_compatible",
                    auth={"api_key": "key"},
                    endpoint={
                        "url": "https://balance.example/api",
                        "auth_mode": "bearer",
                    },
                    response_mapping={"amount_path": "/balance"},
                ),
            ]
        }
    )
    assert [
        (item.queryable, item.unavailable_reason) for item in settings.accounts
    ] == [
        (False, "missing_credentials"),
        (False, "missing_credentials"),
        (True, None),
    ]


def test_webui_default_fields_accept_empty_optional_values_with_base_url():
    root = Path(__file__).resolve().parents[1]
    schema = json.loads((root / "_conf_schema.json").read_text(encoding="utf-8"))
    template = schema["providers"]["templates"]["provider_account"]["items"]

    def defaults(field):
        return {
            name: definition.get("default")
            for name, definition in template[field]["items"].items()
        }

    endpoint = defaults("endpoint")
    endpoint.update(
        {
            "base_url": "https://balance.example.test",
            "path": "/v1/balance",
        }
    )
    response_mapping = defaults("response_mapping")
    response_mapping["amount_path"] = "/data/remaining"
    auth = defaults("auth")
    auth["api_key"] = "offline-key"

    settings = load_settings(
        {
            "providers": [
                {
                    "id": "webui-compatible",
                    "type": "openai_compatible",
                    "display_name": "WebUI compatible",
                    "auth": auth,
                    "endpoint": endpoint,
                    "response_mapping": response_mapping,
                }
            ]
        },
        environ={},
    )

    assert settings.accounts[0].queryable
    assert settings.accounts[0].endpoint["url"] == ""
    assert settings.accounts[0].response_mapping["amount_path"] == "/data/remaining"
    assert "remaining_path" not in settings.accounts[0].response_mapping


def test_empty_required_amount_path_is_invalid():
    settings = load_settings(
        {
            "providers": [
                account(
                    provider_type="openai_compatible",
                    endpoint={
                        "url": "",
                        "base_url": "https://balance.example.test",
                        "path": "/balance",
                        "method": "GET",
                        "auth_mode": "bearer",
                        "json_body": {},
                    },
                    response_mapping={"amount_path": ""},
                )
            ]
        }
    )

    assert not settings.accounts[0].queryable
    assert settings.accounts[0].unavailable_reason == "invalid_response_mapping"
    assert any(error.code == "invalid_response_mapping" for error in settings.errors)


@pytest.mark.parametrize(
    "endpoint,mapping,code",
    [
        (
            {"url": "http://balance.example/api", "auth_mode": "bearer"},
            {"amount_path": "/x"},
            "invalid_endpoint",
        ),
        (
            {
                "url": "https://balance.example/api",
                "method": "DELETE",
                "auth_mode": "bearer",
            },
            {"amount_path": "/x"},
            "invalid_endpoint",
        ),
        (
            {"url": "https://balance.example/api", "auth_mode": "bearer"},
            {},
            "invalid_response_mapping",
        ),
        (
            {"url": "https://balance.example/api", "auth_mode": "header"},
            {"amount_path": "/x"},
            "invalid_endpoint",
        ),
        (
            {"url": "https://balance.example/api", "auth_mode": "bearer"},
            {"amount_path": "/x", "unit_path": "/unit"},
            "invalid_response_mapping",
        ),
        (
            {"url": "https://balance.example/api", "auth_mode": "bearer"},
            {"amount_path": "/x", "unit": "password-value"},
            "invalid_response_mapping",
        ),
        (
            {"url": "https://balance.example/api", "auth_mode": "bearer"},
            {"amount_path": "/x/~2invalid"},
            "invalid_response_mapping",
        ),
        (
            {"url": "https://balance.example/api", "auth_mode": "bearer"},
            {"amount_path": "/x", "unit": {}},
            "invalid_response_mapping",
        ),
        (
            {"url": "https://balance.example/api", "auth_mode": "bearer"},
            {
                "amount_path": "/x",
                "status_path": "/status",
                "status_values": {"ok": []},
            },
            "invalid_response_mapping",
        ),
    ],
)
def test_compatible_provider_rejects_unsafe_or_incomplete_contract(
    endpoint, mapping, code
):
    settings = load_settings(
        {
            "providers": [
                account(
                    provider_type="openai_compatible",
                    endpoint=endpoint,
                    response_mapping=mapping,
                )
            ]
        }
    )
    assert not settings.accounts[0].queryable
    assert settings.accounts[0].unavailable_reason == code
    assert any(error.code == code for error in settings.errors)


def test_global_query_settings_validate_boundaries_and_group_defaults():
    settings = load_settings(
        {
            "max_concurrency": 1,
            "total_timeout_seconds": 0.01,
            "allow_group_queries": True,
            "group_allowed_user_ids": [" 1001 ", "1001", "1002"],
        }
    )
    invalid = load_settings(
        {
            "max_concurrency": 0,
            "total_timeout_seconds": float("inf"),
            "allow_group_queries": "yes",
            "group_allowed_user_ids": ["valid", ""],
        }
    )

    assert settings.max_concurrency == 1
    assert settings.total_timeout_seconds == 0.01
    assert settings.allow_group_queries is True
    assert settings.group_allowed_user_ids == ("1001", "1002")
    assert invalid.max_concurrency == 4
    assert invalid.total_timeout_seconds == 30
    assert invalid.allow_group_queries is False
    assert invalid.group_allowed_user_ids == ()
    assert {error.code for error in invalid.errors} >= {
        "invalid_positive_integer",
        "invalid_positive_number",
        "invalid_boolean",
        "invalid_user_ids",
    }
