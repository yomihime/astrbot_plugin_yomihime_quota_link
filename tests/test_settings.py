import json
from pathlib import Path

import pytest

from quota_link.capabilities import describe_capabilities
from quota_link.formatter import format_status
from quota_link.models import (
    ProviderType,
    QueryParseErrorCode,
    QueryRequestKind,
)
from quota_link.settings import load_settings, migrate_account_templates

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
    assert aliases["ds"] is ProviderType.DEEPSEEK
    assert aliases["阿里百炼"] is ProviderType.ALIBABA_BAILIAN
    assert aliases["阿里云百炼"] is ProviderType.ALIBABA_BAILIAN
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


def test_query_fingerprint_tracks_compatible_service_profile_and_balance_scope():
    base = account(
        provider_type="openai_compatible",
        service_profile="grsai",
        balance_scope="account",
    )
    original = load_settings({"providers": [base]}).accounts[0].config_fingerprint
    changed_scope = (
        load_settings({"providers": [{**base, "balance_scope": "api_key"}]})
        .accounts[0]
        .config_fingerprint
    )
    changed_profile = (
        load_settings({"providers": [{**base, "service_profile": "generic"}]})
        .accounts[0]
        .config_fingerprint
    )

    assert changed_scope != original
    assert changed_profile != original


def test_compatible_profile_and_scope_are_safe_directory_metadata():
    settings = load_settings(
        {
            "providers": [
                account(
                    provider_type="openai_compatible",
                    service_profile="grsai",
                    balance_scope="api_key",
                    response_mapping={"amount_path": "/balance", "kind": "credits"},
                )
            ]
        }
    )
    entry = settings.directory.entries[0]

    assert entry.service_profile == "grsai"
    assert entry.balance_scope == "api_key"
    assert entry.balance_kind == "credits"


def test_grsai_requires_explicit_balance_scope_but_generic_compatible_still_works():
    grsai = account(
        provider_type="openai_compatible",
        service_profile="grsai",
        balance_scope="generic",
    )
    generic = account(
        "generic",
        "Generic service",
        provider_type="openai_compatible",
    )
    settings = load_settings({"providers": [grsai, generic]})

    assert not settings.accounts[0].queryable
    assert settings.accounts[0].unavailable_reason == "invalid_balance_scope"
    diagnostic = next(
        error for error in settings.errors if error.code == "invalid_balance_scope"
    )
    assert diagnostic.path.endswith(".balance_scope")
    assert settings.accounts[1].queryable
    assert settings.accounts[1].balance_scope == "generic"
    assert settings.accounts[1].service_profile == "generic"


def test_invalid_compatible_service_profile_diagnostic_points_to_profile():
    settings = load_settings(
        {
            "providers": [
                account(
                    provider_type="openai_compatible",
                    service_profile="unsupported-profile",
                )
            ]
        }
    )

    assert not settings.accounts[0].queryable
    assert settings.accounts[0].unavailable_reason == "invalid_service_profile"
    diagnostic = next(
        error for error in settings.errors if error.code == "invalid_service_profile"
    )
    assert diagnostic.path.endswith(".service_profile")


def test_unknown_compatible_kind_is_not_projected_into_safe_directory():
    settings = load_settings(
        {
            "providers": [
                account(
                    provider_type="openai_compatible",
                    response_mapping={
                        "amount_path": "/balance",
                        "kind": "sensitive-secret-value",
                    },
                )
            ]
        }
    )

    assert settings.accounts[0].balance_kind == "custom"
    assert "sensitive-secret-value" not in repr(settings.directory)


@pytest.mark.parametrize(
    "endpoint,reason,field_path",
    [
        (
            {
                "base_url": "https://balance.example.test/v1",
                "path": "/balance",
                "auth_mode": "bearer",
            },
            "invalid_base_url",
            "endpoint.base_url",
        ),
        (
            {
                "base_url": "https://balance.example.test",
                "path": "https://balance.example.test/balance",
                "auth_mode": "bearer",
            },
            "invalid_api_path",
            "endpoint.path",
        ),
        (
            {
                "base_url": "https://balance.example.test",
                "path": "//balance",
                "auth_mode": "bearer",
            },
            "invalid_api_path",
            "endpoint.path",
        ),
        (
            {
                "base_url": "https://balance.example.test",
                "path": "/balance?token=x",
                "auth_mode": "bearer",
            },
            "invalid_api_path",
            "endpoint.path",
        ),
    ],
)
def test_compatible_split_endpoint_fields_are_strictly_validated(
    endpoint, reason, field_path
):
    settings = load_settings(
        {
            "providers": [
                account(
                    provider_type="openai_compatible",
                    endpoint=endpoint,
                    response_mapping={"amount_path": "/balance"},
                )
            ]
        }
    )

    assert not settings.accounts[0].queryable
    assert settings.accounts[0].unavailable_reason == reason
    assert any(error.path.endswith(field_path) for error in settings.errors)


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


def test_provider_templates_only_expose_fields_for_their_provider():
    root = Path(__file__).resolve().parents[1]
    schema = json.loads((root / "_conf_schema.json").read_text(encoding="utf-8"))
    templates = schema["providers"]["templates"]

    for provider_type in ("deepseek", "alibaba_bailian", "openai_compatible"):
        items = templates[provider_type]["items"]
        assert items["type"]["default"] == provider_type
        assert items["type"]["invisible"] is True
        assert items["auth"]["items"]
    assert set(templates["deepseek"]["items"]["auth"]["items"]) == {"api_key"}
    assert set(templates["alibaba_bailian"]["items"]["auth"]["items"]) == {
        "access_key_id",
        "access_key_secret",
        "security_token",
    }
    compatible_auth = templates["openai_compatible"]["items"]["auth"]["items"]
    assert set(compatible_auth) == {"api_key", "token"}
    assert compatible_auth["token"]["secret"] is True
    assert compatible_auth["token"]["condition"] == {
        "service_profile": "grsai",
        "balance_scope": "account",
    }
    for provider_type in ("deepseek", "alibaba_bailian"):
        assert "endpoint" not in templates[provider_type]["items"]
        assert "response_mapping" not in templates[provider_type]["items"]
    assert "endpoint" in templates["openai_compatible"]["items"]
    assert "response_mapping" in templates["openai_compatible"]["items"]
    assert "provider_account" in templates  # Already-saved entries remain editable.


def test_template_type_is_inferred_and_mismatch_is_rejected():
    inferred = account("inferred", "Inferred")
    inferred.pop("type")
    inferred["__template_key"] = "deepseek"
    mismatched = account("mismatch", "Mismatch", provider_type="deepseek")
    mismatched["__template_key"] = "alibaba_bailian"
    settings = load_settings({"providers": [inferred, mismatched]})

    assert [item.id for item in settings.accounts] == ["inferred"]
    assert any(error.code == "template_type_mismatch" for error in settings.errors)


def test_legacy_compatible_template_keeps_full_url_field_editable():
    legacy_url = "https://balance.example.invalid/legacy"
    config = {
        "providers": [
            account(
                "legacy-compatible",
                "Legacy compatible",
                provider_type="openai_compatible",
                endpoint={
                    "url": legacy_url,
                    "method": "GET",
                    "auth_mode": "bearer",
                    "json_body": {},
                },
            ),
            account("deepseek", "DeepSeek", provider_type="deepseek"),
        ]
    }
    for provider in config["providers"]:
        provider["__template_key"] = "provider_account"

    changed = migrate_account_templates(config)
    settings = load_settings(config)

    assert changed
    assert config["providers"][0]["__template_key"] == "provider_account"
    assert config["providers"][1]["__template_key"] == "deepseek"
    legacy = next(item for item in settings.accounts if item.id == "legacy-compatible")
    assert legacy.endpoint["url"] == legacy_url
    assert legacy.queryable


def test_already_migrated_compatible_full_url_restores_legacy_template():
    legacy_url = "https://balance.example.invalid/client/openapi/getCredits"
    endpoint = {
        "url": legacy_url,
        "base_url": "",
        "path": "",
        "method": "POST",
        "auth_mode": "bearer",
        "json_body": {},
    }
    provider = account(
        "grsai",
        "Grsai",
        provider_type="openai_compatible",
        endpoint=endpoint,
    )
    provider["__template_key"] = "openai_compatible"
    config = {"providers": [provider]}

    assert migrate_account_templates(config)
    assert provider["__template_key"] == "provider_account"
    assert provider["endpoint"] == endpoint
    assert load_settings(config).accounts[0].queryable
    assert not migrate_account_templates(config)


@pytest.mark.parametrize(
    "endpoint,expected_template",
    [
        (
            {
                "url": "",
                "base_url": "https://balance.example.invalid",
                "path": "/balance",
            },
            "openai_compatible",
        ),
        (
            {"base_url": "https://balance.example.invalid", "path": "/balance"},
            "openai_compatible",
        ),
        (
            {
                "url": "https://balance.example.invalid/old",
                "base_url": "https://balance.example.invalid",
                "path": "/balance",
            },
            "openai_compatible",
        ),
        (
            {
                "url": "https://balance.example.invalid/old",
                "base_url": "https://balance.example.invalid",
                "path": "",
            },
            "provider_account",
        ),
        (
            {"url": "https://balance.example.invalid/old", "path": "/balance"},
            "provider_account",
        ),
    ],
)
def test_compatible_template_handles_host_path_and_ambiguous_endpoint(
    endpoint, expected_template
):
    provider = account(provider_type="openai_compatible", endpoint=endpoint)
    provider["__template_key"] = "openai_compatible"

    assert migrate_account_templates({"providers": [provider]}) is (
        expected_template == "provider_account"
    )
    assert provider["__template_key"] == expected_template
    assert provider["endpoint"] == endpoint


def test_compatible_template_prefers_complete_split_endpoint_over_stale_url():
    endpoint = {
        "url": "/old/relative/path",
        "base_url": "https://balance.example.invalid",
        "path": "/client/openapi/getCredits",
        "method": "POST",
        "auth_mode": "bearer",
        "json_body": {},
    }
    provider = account(
        provider_type="openai_compatible",
        endpoint=endpoint,
        service_profile="grsai",
        balance_scope="account",
        auth={"token": "request-token"},
    )
    provider["response_mapping"]["kind"] = "credits"
    provider["__template_key"] = "openai_compatible"

    settings = load_settings({"providers": [provider]})
    loaded = settings.accounts[0]

    assert loaded.queryable
    assert loaded.prefer_split_endpoint
    assert loaded.endpoint["url"] == "/old/relative/path"
    assert not settings.errors
    assert not migrate_account_templates({"providers": [provider]})


def test_legacy_template_keeps_url_priority_when_split_endpoint_is_present():
    endpoint = {
        "url": "/old/relative/path",
        "base_url": "https://balance.example.invalid",
        "path": "/client/openapi/getCredits",
        "method": "POST",
        "auth_mode": "bearer",
        "json_body": {},
    }
    provider = account(provider_type="openai_compatible", endpoint=endpoint)
    provider["__template_key"] = "provider_account"

    settings = load_settings({"providers": [provider]})
    loaded = settings.accounts[0]

    assert not loaded.queryable
    assert loaded.unavailable_reason == "invalid_endpoint"
    assert not loaded.prefer_split_endpoint
    assert loaded.endpoint["url"] == "/old/relative/path"


def test_native_grsai_type_has_account_credit_defaults_and_no_mapping_requirement():
    native = account(
        "native-grsai",
        "Grsai",
        provider_type="grsai",
        auth={"token": "request-token-secret"},
        endpoint=None,
    )

    settings = load_settings({"providers": [native]})

    assert settings.errors == ()
    loaded = settings.accounts[0]
    assert loaded.provider_type is ProviderType.GRSAI
    assert loaded.queryable
    assert loaded.service_profile == "grsai"
    assert loaded.balance_scope == "account"
    assert loaded.balance_kind == "credits"
    assert loaded.region == "china"
    assert loaded.endpoint == {}
    assert settings.resolve_target("grsai").request.target == "native-grsai"
    assert "request-token-secret" not in repr(loaded)


def test_native_grsai_region_switches_without_a_host_and_invalid_region_is_safe():
    base = account(
        "grsai-region",
        "Grsai",
        provider_type="grsai",
        auth={"token": "request-token-secret"},
        endpoint=None,
        region="china",
    )
    china = load_settings({"providers": [base]})
    global_node = load_settings({"providers": [{**base, "region": "global"}]})
    invalid = load_settings({"providers": [{**base, "region": "unknown"}]})

    assert china.accounts[0].queryable
    assert global_node.accounts[0].queryable
    assert china.accounts[0].endpoint == global_node.accounts[0].endpoint == {}
    assert (
        china.accounts[0].config_fingerprint
        != global_node.accounts[0].config_fingerprint
    )
    assert not invalid.accounts[0].queryable
    assert invalid.accounts[0].unavailable_reason == "invalid_grsai_region"
    assert invalid.errors[0].path == "providers[0].region"
    assert "request-token-secret" not in repr(invalid)


@pytest.mark.parametrize(
    ("old_host", "expected_region"),
    [
        ("https://grsai.dakka.com.cn", "china"),
        ("https://grsaiapi.com", "global"),
    ],
)
def test_native_grsai_old_host_migrates_to_exact_region(old_host, expected_region):
    old = account(
        "old-grsai",
        "Grsai",
        provider_type="grsai",
        auth={"token": "request-token-secret"},
        endpoint={"base_url": old_host, "path": "/client/openapi/getCredits"},
    )

    loaded = load_settings({"providers": [old]})

    assert loaded.accounts[0].region == expected_region
    assert loaded.accounts[0].queryable
    assert loaded.accounts[0].endpoint == {}


def test_native_grsai_unknown_old_host_is_not_silently_switched():
    old = account(
        "old-grsai",
        "Grsai",
        provider_type="grsai",
        auth={"token": "request-token-secret"},
        endpoint={"base_url": "https://other.example.invalid"},
    )

    loaded = load_settings({"providers": [old]})

    assert not loaded.accounts[0].queryable
    assert loaded.accounts[0].unavailable_reason == "invalid_grsai_region"
    assert loaded.errors[0].path == "providers[0].region"


@pytest.mark.parametrize("template_key", ["provider_account", "grsai"])
def test_migrated_overseas_grsai_survives_webui_defaults(template_key):
    old = account(
        "old-overseas-grsai",
        "Grsai",
        provider_type="grsai",
        auth={"token": "request-token-secret"},
        endpoint={"base_url": "https://grsaiapi.com"},
    )
    old["__template_key"] = template_key
    config = {"providers": [old]}

    assert migrate_account_templates(config)
    # Simulates Dashboard applyDefaults on the new Grsai template.
    if old["__template_key"] == "grsai":
        old.setdefault("region", "china")
    loaded = load_settings(config)

    assert old["__template_key"] == "grsai"
    assert old["region"] == "global"
    assert loaded.accounts[0].region == "global"
    assert loaded.accounts[0].queryable
    assert not migrate_account_templates(config)


@pytest.mark.parametrize("template_key", ["provider_account", "grsai"])
def test_unknown_old_grsai_host_stays_unavailable_after_webui_defaults(template_key):
    old = account(
        "old-unknown-grsai",
        "Grsai",
        provider_type="grsai",
        auth={"token": "request-token-secret"},
        endpoint={"base_url": "https://other.example.invalid"},
    )
    old["__template_key"] = template_key
    config = {"providers": [old]}

    migrate_account_templates(config)
    if old["__template_key"] == "grsai":
        old.setdefault("region", "china")
    loaded = load_settings(config)

    assert not loaded.accounts[0].queryable
    assert loaded.accounts[0].unavailable_reason == "invalid_grsai_region"
    assert loaded.errors[0].path == "providers[0].region"
    assert not migrate_account_templates(config)


def test_native_grsai_type_rejects_api_key_scope_and_missing_request_token():
    base = account(
        "native-grsai",
        "Grsai",
        provider_type="grsai",
        auth={"token": "request-token-secret"},
        endpoint={"base_url": "https://provider.example.invalid"},
        region="china",
    )

    api_key = load_settings({"providers": [{**base, "balance_scope": "api_key"}]})
    missing_token = load_settings(
        {"providers": [{**base, "auth": {"api_key": "model-secret"}}]}
    )

    assert api_key.accounts[0].unavailable_reason == "invalid_balance_scope"
    assert api_key.errors[0].path == "providers[0].balance_scope"
    assert missing_token.accounts[0].unavailable_reason == "missing_grsai_token"
    assert missing_token.errors[0].path == "providers[0].auth.token"
    assert "model-secret" not in repr(missing_token.errors)


def test_grsai_account_endpoint_rejects_get_and_accepts_post():
    def configured(method):
        endpoint = {
            "base_url": "https://balance.example.invalid",
            "path": "/client/openapi/getCredits",
            "method": method,
            "auth_mode": "bearer",
            "json_body": {},
        }
        return account(
            provider_type="openai_compatible",
            service_profile="grsai",
            balance_scope="account",
            auth={"token": "request-token"},
            endpoint=endpoint,
            response_mapping={},
        )

    get_settings = load_settings({"providers": [configured("GET")]})
    post_settings = load_settings({"providers": [configured("POST")]})

    assert not get_settings.accounts[0].queryable
    assert get_settings.accounts[0].unavailable_reason == "grsai_method_must_post"
    assert any(
        error.path.endswith(".endpoint.method")
        for error in get_settings.errors
        if error.code == "grsai_method_must_post"
    )
    assert post_settings.accounts[0].queryable


@pytest.mark.parametrize("split_endpoint", [False, True])
def test_grsai_api_key_scope_is_unavailable_even_with_endpoint(split_endpoint):
    path = "/client/openapi/getAPIKeyCredits"
    endpoint = {
        "method": "POST",
        "auth_mode": "bearer",
        "json_body": {},
    }
    if split_endpoint:
        endpoint.update(base_url="https://balance.example.invalid", path=path)
    else:
        endpoint["url"] = f"https://balance.example.invalid{path}"
    settings = load_settings(
        {
            "providers": [
                account(
                    provider_type="openai_compatible",
                    service_profile="grsai",
                    balance_scope="api_key",
                    endpoint=endpoint,
                    response_mapping={"amount_path": "/credits", "kind": "credits"},
                )
            ]
        }
    )

    assert not settings.accounts[0].queryable
    assert settings.accounts[0].unavailable_reason == "invalid_balance_scope"
    diagnostic = next(
        error for error in settings.errors if error.code == "invalid_balance_scope"
    )
    assert diagnostic.path.endswith(".balance_scope")
    assert "尚未实现" in diagnostic.safe_message
    assert settings.directory.entries[0].service_profile == "grsai"
    assert settings.directory.entries[0].balance_scope == "api_key"
    assert not settings.directory.entries[0].queryable
    assert "secret-key" not in repr(settings.errors)


def test_grsai_api_key_unknown_credit_path_is_unavailable():
    settings = load_settings(
        {
            "providers": [
                account(
                    provider_type="openai_compatible",
                    service_profile="grsai",
                    balance_scope="api_key",
                    endpoint={
                        "url": "https://balance.example.invalid/custom/credits",
                        "method": "GET",
                        "auth_mode": "bearer",
                    },
                    response_mapping={"amount_path": "/credits", "kind": "credits"},
                )
            ]
        }
    )

    assert not settings.accounts[0].queryable
    assert settings.accounts[0].unavailable_reason == "invalid_balance_scope"
    capability = describe_capabilities(settings.directory)[0]
    assert capability["provider"] == "Grsai"
    assert capability["balance_scope"] == "api_key"
    assert capability["queryable"] is False
    assert capability["reason"]
    status = format_status(settings)
    assert "可查询 0 个" in status
    assert "不可查询" in status
    assert "尚未实现" in status


@pytest.mark.parametrize(
    "mapping",
    [
        {"amount_path": "/balance", "kind": "cash"},
        {"amount_path": "/balance", "kind": "credits", "kind_path": "/kind"},
    ],
)
def test_grsai_account_ignores_old_response_mapping_and_fixes_credits(mapping):
    grsai = account(
        provider_type="openai_compatible",
        service_profile="grsai",
        balance_scope="account",
        auth={"token": "request-token"},
        endpoint={"base_url": "https://balance.example.invalid"},
        response_mapping=mapping,
    )
    generic = account(
        "generic-cash",
        "Generic cash service",
        provider_type="openai_compatible",
        response_mapping={"amount_path": "/balance", "kind": "cash"},
    )
    settings = load_settings({"providers": [grsai, generic]})

    assert settings.accounts[0].queryable
    assert settings.accounts[0].balance_kind == "credits"
    assert settings.accounts[1].queryable
    assert settings.accounts[1].balance_kind == "cash"


def test_grsai_account_requires_request_token_not_api_key():
    provider = account(
        provider_type="openai_compatible",
        service_profile="grsai",
        balance_scope="account",
        endpoint={"base_url": "https://balance.example.invalid"},
        response_mapping={},
    )

    settings = load_settings({"providers": [provider]})

    assert not settings.accounts[0].queryable
    assert settings.accounts[0].unavailable_reason == "missing_grsai_token"
    assert any(error.path.endswith(".auth.token") for error in settings.errors)
    assert "secret-key" not in repr(settings.errors)


def test_grsai_account_token_environment_reference_and_empty_mapping():
    provider = account(
        provider_type="openai_compatible",
        service_profile="grsai",
        balance_scope="account",
        auth={"token": "${GRSAI_REQUEST_TOKEN}", "api_key": "old-api-key"},
        endpoint={"url": "/stale", "base_url": "https://balance.example.invalid"},
        response_mapping={},
    )

    missing = load_settings({"providers": [provider]}, environ={})
    loaded = load_settings(
        {"providers": [provider]}, environ={"GRSAI_REQUEST_TOKEN": "request-token"}
    )

    assert missing.accounts[0].unavailable_reason == "missing_environment_variable"
    assert loaded.accounts[0].queryable
    assert loaded.accounts[0].auth["token"] == "request-token"
    assert loaded.accounts[0].auth["api_key"] == "old-api-key"
    assert loaded.accounts[0].endpoint["url"] == "/stale"
    assert loaded.accounts[0].balance_kind == "credits"
    assert "request-token" not in repr(loaded)


@pytest.mark.parametrize(
    "endpoint,reason",
    [
        ({}, "missing_base_url"),
        ({"base_url": "http://balance.example.invalid"}, "invalid_base_url"),
        ({"base_url": "https://balance.example.invalid/x"}, "invalid_base_url"),
        ({"base_url": "https://balance.example.invalid\\evil"}, "invalid_base_url"),
        ({"base_url": "https://balance.example.invalid\x7f"}, "invalid_base_url"),
        (
            {
                "base_url": "https://balance.example.invalid",
                "path": "/client/openapi/getAPIKeyCredits",
            },
            "grsai_account_path_mismatch",
        ),
        (
            {"base_url": "https://balance.example.invalid", "method": "GET"},
            "grsai_method_must_post",
        ),
        (
            {
                "base_url": "https://balance.example.invalid",
                "json_body": {"token": "request-token"},
            },
            "invalid_endpoint",
        ),
    ],
)
def test_grsai_account_rejects_conflicting_endpoint_fields(endpoint, reason):
    provider = account(
        provider_type="openai_compatible",
        service_profile="grsai",
        balance_scope="account",
        auth={"token": "request-token"},
        endpoint=endpoint,
        response_mapping={},
    )

    settings = load_settings({"providers": [provider]})

    assert not settings.accounts[0].queryable
    assert settings.accounts[0].unavailable_reason == reason


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


def test_access_settings_default_to_admin_only_and_empty_private_allowlist():
    settings = load_settings({})

    assert settings.command_admin_only is True
    assert settings.private_allowed_user_ids == ()


def test_private_allowlist_accepts_only_complete_platform_user_identity():
    settings = load_settings(
        {
            "command_admin_only": False,
            "private_allowed_user_ids": [
                " aiocqhttp:123456 ",
                "aiocqhttp:123456",
                "telegram:123456",
            ],
        }
    )

    assert settings.command_admin_only is False
    assert settings.private_allowed_user_ids == (
        "aiocqhttp:123456",
        "telegram:123456",
    )
    assert not settings.errors


@pytest.mark.parametrize(
    "value",
    [
        "123456",
        ":123456",
        "aiocqhttp:",
        " aiocqhttp: 123456 ",
        ["aiocqhttp:123456", "123456"],
        123456,
    ],
)
def test_invalid_private_allowlist_fails_closed_without_echoing_values(value):
    settings = load_settings({"private_allowed_user_ids": value})

    assert settings.private_allowed_user_ids == ()
    assert any(error.code == "invalid_private_user_ids" for error in settings.errors)
    assert "123456" not in repr(settings.errors)


def test_invalid_command_admin_flag_fails_closed():
    settings = load_settings({"command_admin_only": "false"})

    assert settings.command_admin_only is True
    assert any(
        error.code == "invalid_boolean" and error.path == "command_admin_only"
        for error in settings.errors
    )
