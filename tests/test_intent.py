from types import MappingProxyType

from quota_link.intent import (
    PermissionContext,
    can_query,
    parse_command,
    parse_natural_language,
)
from quota_link.models import ProviderType, QueryParseErrorCode, QueryRequestKind
from quota_link.settings import AccountDirectory, load_settings


def _settings(
    *,
    allow_group_queries=False,
    group_allowed_user_ids=(),
    private_allowed_user_ids=(),
    command_admin_only=True,
):
    return load_settings(
        {
            "allow_group_queries": allow_group_queries,
            "group_allowed_user_ids": list(group_allowed_user_ids),
            "private_allowed_user_ids": list(private_allowed_user_ids),
            "command_admin_only": command_admin_only,
            "providers": [
                {
                    "id": "grsai-work",
                    "type": "deepseek",
                    "display_name": "Grsai Work",
                    "aliases": ["grsai"],
                    "auth": {"api_key": "secret"},
                },
                {
                    "id": "deepseek-account",
                    "type": "deepseek",
                    "display_name": "DeepSeek",
                    "auth": {"api_key": "another-secret"},
                },
                {
                    "id": "bailian-work",
                    "type": "alibaba_bailian",
                    "display_name": "百炼工作号",
                    "auth": {"api_key": "third-secret"},
                },
            ],
        }
    )


def _request(result):
    assert result is not None
    assert result.request is not None
    return result.request


def test_natural_language_queries_all_accounts_and_current_model():
    settings = _settings()

    for text in ("余额都还剩多少？", "当前模型余额还剩多少？"):
        request = _request(parse_natural_language(text, settings.directory))
        assert request.kind is QueryRequestKind.ALL


def test_natural_language_resolves_provider_and_account_names():
    settings = _settings()

    provider = _request(
        parse_natural_language("DeepSeek 的余额还剩多少？", settings.directory)
    )
    assert provider.kind is QueryRequestKind.ACCOUNT
    assert provider.target == "deepseek-account"

    account = _request(
        parse_natural_language("grsai-work 还剩多少积分？", settings.directory)
    )
    assert account.kind is QueryRequestKind.ACCOUNT
    assert account.target == "grsai-work"


def test_builtin_synonyms_match_natural_language_case_insensitively():
    directory = _settings().directory

    for target_text in (
        "DS 还剩多少？",
        "dS 还剩多少？",
        "深度求索 还剩多少？",
    ):
        result = _request(parse_natural_language(target_text, directory))
        assert result.kind is QueryRequestKind.PROVIDER
        assert result.target == ProviderType.DEEPSEEK.value

    deepseek_account = _request(
        parse_natural_language("deepseek 还剩多少？", directory)
    )
    assert deepseek_account.kind is QueryRequestKind.ACCOUNT
    assert deepseek_account.target == "deepseek-account"

    for target_text in ("阿里云百炼余额是多少？", "阿里百炼余额是多少？"):
        result = _request(parse_natural_language(target_text, directory))
        assert result.kind is QueryRequestKind.PROVIDER
        assert result.target == ProviderType.ALIBABA_BAILIAN.value


def test_account_id_or_alias_wins_over_builtin_provider_synonym():
    settings = load_settings(
        {
            "providers": [
                {
                    "id": "DS",
                    "type": "deepseek",
                    "display_name": "Dedicated DS account",
                    "aliases": ["DeepSeek"],
                    "auth": {"api_key": "account-secret"},
                }
            ]
        }
    )

    for target_text in ("DS 还剩多少？", "DeepSeek 还剩多少？"):
        result = _request(parse_natural_language(target_text, settings.directory))
        assert result.kind is QueryRequestKind.ACCOUNT
        assert result.target == "DS"
    assert (
        _request(parse_command("DS", settings.directory)).kind
        is QueryRequestKind.ACCOUNT
    )


def test_standalone_grsai_provider_name_targets_only_grsai_accounts():
    settings = load_settings(
        {
            "providers": [
                {
                    "id": "grsai-primary",
                    "type": "grsai",
                    "display_name": "中转站主账户",
                    "auth": {"token": "request-token"},
                    "endpoint": {"base_url": "https://example.invalid"},
                },
                {
                    "id": "other-relay",
                    "type": "openai_compatible",
                    "display_name": "其他中转站",
                    "auth": {"api_key": "other-key"},
                    "endpoint": {
                        "base_url": "https://other.invalid",
                        "path": "/balance",
                        "auth_mode": "bearer",
                    },
                    "response_mapping": {"amount_path": "/remaining"},
                },
            ]
        }
    )
    for text in ("GRSAI 还剩多少积分？", "grsai 还剩多少积分？"):
        request = _request(parse_natural_language(text, settings.directory))
        assert request.kind is QueryRequestKind.PROVIDER
        assert request.target == ProviderType.GRSAI.value
    explicit = _request(parse_command("provider grsai", settings.directory))
    assert explicit.kind is QueryRequestKind.PROVIDER
    assert explicit.target == ProviderType.GRSAI.value


def test_natural_language_returns_candidates_for_multiple_targets():
    settings = _settings()
    result = parse_natural_language(
        "DeepSeek 和百炼的余额还剩多少？", settings.directory
    )

    assert result is not None
    assert result.error is not None
    assert result.error.code is QueryParseErrorCode.AMBIGUOUS
    assert set(result.candidates) == {"deepseek-account", "alibaba_bailian"}


def test_natural_language_reports_explicit_unknown_target_and_ignores_chat():
    settings = _settings()

    unknown = parse_natural_language("Claude 的余额还剩多少？", settings.directory)
    assert unknown is not None
    assert unknown.error is not None
    assert unknown.error.code is QueryParseErrorCode.UNKNOWN_TARGET
    assert parse_natural_language("我今天还剩多少时间？", settings.directory) is None
    assert parse_natural_language("今天天气怎么样？", settings.directory) is None


def test_commands_parse_without_accounts_and_resolve_targets():
    empty = load_settings({}).directory
    assert _request(parse_command(None, empty)).kind is QueryRequestKind.ALL
    assert _request(parse_command("", empty)).kind is QueryRequestKind.ALL
    assert _request(parse_command("all", empty)).kind is QueryRequestKind.ALL
    assert _request(parse_command("help", empty)).kind is QueryRequestKind.HELP
    assert _request(parse_command("status", empty)).kind is QueryRequestKind.STATUS

    directory = _settings().directory
    assert (
        _request(parse_command("deepseek", directory)).kind is QueryRequestKind.ACCOUNT
    )
    explicit_provider = _request(parse_command("provider deepseek", directory))
    assert explicit_provider.kind is QueryRequestKind.PROVIDER
    assert explicit_provider.target == "deepseek"
    assert (
        _request(parse_command("account grsai-work", directory)).target == "grsai-work"
    )


def test_commands_report_unknown_and_invalid_targets():
    directory = load_settings({}).directory
    unknown = parse_command("missing", directory)
    assert unknown.error is not None
    assert unknown.error.code is QueryParseErrorCode.UNKNOWN_TARGET
    invalid = parse_command("help extra", directory)
    assert invalid.error is not None
    assert invalid.error.code is QueryParseErrorCode.INVALID_INPUT


def test_provider_aliases_are_taken_from_the_directory_contract():
    directory = AccountDirectory(
        entries=(),
        _account_index=MappingProxyType({}),
        _provider_index=MappingProxyType({"nova quota": ProviderType.DEEPSEEK}),
    )

    natural = _request(parse_natural_language("nova quota 余额还剩多少？", directory))
    assert natural.kind is QueryRequestKind.PROVIDER
    assert natural.target == ProviderType.DEEPSEEK.value

    explicit = _request(parse_command("provider nova quota", directory))
    assert explicit.kind is QueryRequestKind.PROVIDER
    assert explicit.target == ProviderType.DEEPSEEK.value


def test_private_group_and_admin_permissions():
    settings = _settings()
    private = PermissionContext(True, False, "user-1", None, "telegram")
    private_admin = PermissionContext(True, True, "admin", None)
    group = PermissionContext(False, False, "user-1", "group-1")
    admin = PermissionContext(False, True, "admin", "group-1")
    assert not can_query(private, settings)
    assert can_query(private_admin, settings)
    assert not can_query(private, settings, is_command=True)
    assert can_query(private_admin, settings, is_command=True)
    assert not can_query(group, settings)
    assert not can_query(admin, settings)

    enabled = _settings(
        allow_group_queries=True,
        group_allowed_user_ids=("user-1",),
        private_allowed_user_ids=("telegram:user-1",),
    )
    assert can_query(private, enabled)
    assert not can_query(
        PermissionContext(True, False, "user-1", None, "discord"), enabled
    )
    assert not can_query(private, enabled, is_command=True)
    assert can_query(group, enabled)
    assert not can_query(group, enabled, is_command=True)
    assert can_query(admin, enabled)
    assert can_query(admin, enabled, is_command=True)
    assert not can_query(PermissionContext(False, False, "other", "group-1"), enabled)

    command_opt_out = _settings(
        allow_group_queries=True,
        group_allowed_user_ids=("user-1",),
        private_allowed_user_ids=("telegram:user-1",),
        command_admin_only=False,
    )
    assert can_query(private, command_opt_out, is_command=True)
    assert can_query(group, command_opt_out, is_command=True)
    assert not can_query(
        PermissionContext(True, False, "other", None),
        command_opt_out,
        is_command=True,
    )
