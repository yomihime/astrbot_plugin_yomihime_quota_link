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
        "endpoint": {"url": "https://example.invalid/balance"}
        if endpoint is _DEFAULT_ENDPOINT
        else endpoint,
        **extra,
    }


def test_empty_configuration_is_valid_with_defaults():
    settings = load_settings({})

    assert settings.accounts == ()
    assert settings.errors == ()
    assert settings.timeout_seconds == 8
    assert settings.cache_ttl_seconds == 60


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
