from dataclasses import replace
from datetime import UTC, datetime, timedelta, timezone
from decimal import Decimal

from quota_link.formatter import (
    display_semantics,
    format_help,
    format_parse_error,
    format_result,
    format_status,
)
from quota_link.models import (
    BalanceItem,
    BalanceItemKind,
    BalanceSnapshot,
    NormalizedProviderError,
    ProviderErrorCategory,
    ProviderType,
    QueryParseError,
    QueryParseErrorCode,
    QueryRequest,
    QueryRequestKind,
    QueryResult,
    SnapshotStatus,
)
from quota_link.settings import load_settings

NOW = datetime(2026, 9, 24, 10, 30, tzinfo=UTC)


def _snapshot(
    *,
    name: str = "主账户",
    balances: tuple[BalanceItem, ...] = (),
    status: SnapshotStatus = SnapshotStatus.AVAILABLE,
    cached: bool = False,
    error: NormalizedProviderError | None = None,
) -> BalanceSnapshot:
    return BalanceSnapshot(
        account_id="main",
        provider_type=ProviderType.OPENAI_COMPATIBLE,
        display_name=name,
        status=status,
        balances=balances,
        source="configured endpoint",
        fetched_at=NOW,
        cached=cached,
        error=error,
    )


def _result(*snapshots: BalanceSnapshot, kind: QueryRequestKind = QueryRequestKind.ALL):
    return QueryResult(QueryRequest(kind), snapshots, NOW)


def test_format_result_preserves_decimal_precision_and_renders_multiple_items_and_units():
    precise = Decimal("1234567890.000000000000000001")
    snapshot = _snapshot(
        balances=(
            BalanceItem(BalanceItemKind.CASH, amount=precise, unit="CNY"),
            BalanceItem(BalanceItemKind.CREDITS, amount=Decimal("0"), unit="积分"),
            BalanceItem(
                BalanceItemKind.USAGE,
                total=Decimal("1000"),
                remaining=Decimal("875.25"),
                used=Decimal("124.75"),
                unit="tokens",
                raw_semantics="本周期 token 使用情况",
            ),
        )
    )

    text = format_result(_result(snapshot))

    assert f"现金余额：{precise} CNY" in text
    assert "积分：0 积分" in text
    assert "用量：总量 1000 tokens；剩余 875.25 tokens；已用 124.75 tokens" in text
    assert "语义说明 本周期 token 使用情况" in text
    assert f"查询时间：{NOW.strftime('%Y-%m-%d %H:%M:%S UTC')}" in text
    assert f"获取时间：{NOW.strftime('%Y-%m-%d %H:%M:%S UTC')}" in text
    assert "来源：configured endpoint" in text


def test_format_result_distinguishes_unknown_from_zero_and_marks_cached_data():
    snapshot = _snapshot(
        balances=(
            BalanceItem(BalanceItemKind.CASH, amount=None, unit="USD"),
            BalanceItem(BalanceItemKind.QUOTA, remaining=Decimal("0"), unit="tokens"),
        ),
        cached=True,
    )

    text = format_result(_result(snapshot))

    assert "主账户：可用（缓存）" in text
    assert "现金余额：数值未知（单位：USD）" in text
    assert "额度：剩余 0 tokens" in text


def test_format_result_handles_all_failures_and_safe_error_text():
    safe_error = NormalizedProviderError(
        ProviderErrorCategory.NOT_IMPLEMENTED,
        "此账户的余额查询适配器尚未实现。",
        "ADAPTER_NOT_IMPLEMENTED",
    )
    text = format_result(
        _result(
            _snapshot(
                name="未实现账户",
                status=SnapshotStatus.UNAVAILABLE,
                error=safe_error,
            )
        )
    )

    assert "未实现账户：不可用" in text
    assert "查询失败：此账户的余额查询适配器尚未实现。" in text
    assert text.endswith("查询汇总：失败 1。")
    assert "模拟" not in text


def test_unavailable_snapshot_without_error_counts_as_failure():
    text = format_result(
        _result(_snapshot(name="断线账户", status=SnapshotStatus.UNAVAILABLE))
    )

    assert "断线账户：不可用" in text
    assert "查询汇总：失败 1。" in text
    assert "查询汇总：成功 1" not in text


def test_format_result_reports_partial_failures_alongside_successful_results():
    failed = _snapshot(
        name="备用账户",
        status=SnapshotStatus.UNAVAILABLE,
        error=NormalizedProviderError(
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE, "服务暂时不可用。"
        ),
    )

    text = format_result(
        _result(
            _snapshot(
                balances=(
                    BalanceItem(
                        BalanceItemKind.CREDITS, amount=Decimal("4"), unit="积分"
                    ),
                )
            ),
            failed,
        )
    )

    assert "主账户：可用" in text
    assert "备用账户：不可用" in text
    assert "查询汇总：成功 1，失败 1。" in text


def test_formatter_folds_control_characters_in_all_free_text_fields():
    snapshot = BalanceSnapshot(
        account_id="main",
        provider_type=ProviderType.OPENAI_COMPATIBLE,
        display_name="正常账户\n群聊查询：已开启",
        status=SnapshotStatus.PARTIAL,
        balances=(
            BalanceItem(
                BalanceItemKind.CASH,
                amount=Decimal("3"),
                unit="USD\n伪造单位",
                label="余额\n所有账户查询均失败",
                raw_semantics="充值\n伪造账户：管理员",
            ),
        ),
        source="查询端点\n伪造来源",
        fetched_at=NOW,
        error=NormalizedProviderError(
            ProviderErrorCategory.PARSE, "响应异常\n伪造状态：成功"
        ),
    )
    text = format_result(_result(snapshot))

    assert "正常账户 群聊查询：已开启：部分可用" in text
    assert "来源：查询端点 伪造来源" in text
    assert (
        "余额 所有账户查询均失败：3 USD 伪造单位；语义说明 充值 伪造账户：管理员"
        in text
    )
    assert "查询失败：响应异常 伪造状态：成功" in text
    assert "查询汇总：部分成功 1。" in text
    assert "\n群聊查询：已开启" not in text
    assert "\n伪造单位" not in text
    assert "\n伪造账户：管理员" not in text
    assert "\n伪造状态：成功" not in text


def test_format_result_handles_no_configured_accounts():
    assert format_result(_result()) == (
        f"查询时间：{NOW.strftime('%Y-%m-%d %H:%M:%S UTC')}\n当前没有配置可查询的账户。"
    )


def test_help_and_status_are_local_and_never_disclose_credentials():
    secret = "do-not-print-this-key"
    settings = load_settings(
        {
            "providers": [
                {
                    "id": "bailian-main",
                    "type": "alibaba_bailian",
                    "display_name": "百炼账户",
                    "auth": {
                        "access_key_id": "test-access-key-id",
                        "access_key_secret": secret,
                    },
                }
            ]
        },
        environ={},
    )

    help_text = format_help(settings)
    status_text = format_status(settings)

    assert "/yql                 查询所有账户" in help_text
    assert "/yql help            查看帮助" in help_text
    assert "/yql status" in help_text
    assert "/yql all" in help_text
    assert "账户：共 1 个，启用 1 个，可查询 1 个" in status_text
    assert "百炼账户：已配置，可查询" in status_text
    assert secret not in help_text + status_text


def test_grsai_account_status_is_queryable_without_exposing_request_token_or_old_key():
    token = "private-grsai-request-token"
    old_key = "old-model-api-key"
    settings = load_settings(
        {
            "providers": [
                {
                    "id": "grsai-account",
                    "type": "openai_compatible",
                    "service_profile": "grsai",
                    "balance_scope": "account",
                    "display_name": "Grsai 账户积分",
                    "auth": {"token": token, "api_key": old_key},
                    "endpoint": {"base_url": "https://api.example.invalid"},
                    "response_mapping": {
                        "amount_path": "/old/amount",
                        "kind": "custom",
                    },
                }
            ]
        },
        environ={},
    )

    assert settings.accounts[0].queryable is True
    status_text = format_status(settings)
    help_text = format_help(settings)
    assert "Grsai 账户积分：已配置，可查询" in status_text
    assert token not in status_text + help_text
    assert old_key not in status_text + help_text


def test_status_handles_no_configuration_and_reports_safe_diagnostics():
    settings = load_settings(None, environ={})
    text = format_status(settings)

    assert "账户：共 0 个，启用 0 个，可查询 0 个" in text
    assert "尚未配置账户。" in text
    assert "群聊查询：已关闭" in text


def test_help_explains_service_boundaries_and_status_marks_incomplete_accounts():
    settings = load_settings(
        {
            "providers": [
                {
                    "id": "third-party",
                    "type": "openai_compatible",
                    "display_name": "第三方服务",
                    "auth": {"api_key": "example-key"},
                    "endpoint": {},
                }
            ]
        },
        environ={},
    )

    help_text = format_help(settings)
    status_text = format_status(settings)

    assert "余额查询使用服务商专属接口" in help_text
    assert "不是" not in help_text
    assert "不代表" not in help_text
    assert "阿里云账户现金余额（BSS）" in help_text
    assert "AliyunBSSReadOnlyAccess" in help_text
    assert "第三方服务：不可查询：配置不全" in status_text


def test_status_folds_control_characters_in_configured_account_names():
    settings = load_settings(
        {
            "providers": [
                {
                    "id": "newline-account",
                    "type": "deepseek",
                    "display_name": "账户\n群聊查询：已开启",
                    "auth": {"api_key": "example-secret"},
                }
            ]
        },
        environ={},
    )

    text = format_status(settings)

    assert "账户 群聊查询：已开启：已配置，可查询" in text
    assert "\n群聊查询：已开启" not in text


def test_format_parse_error_shows_safe_ambiguity_candidates():
    error = QueryParseError(
        QueryParseErrorCode.AMBIGUOUS,
        "名称匹配到多个账户，请指定账户名。",
        ("主账户", "备用账户"),
    )

    assert format_parse_error(error) == (
        "名称匹配到多个账户，请指定账户名。\n匹配项：主账户、备用账户"
    )


def test_snapshot_and_query_times_and_source_are_formatted_as_utc_and_text():
    expires = datetime(2026, 12, 1, 12, 0, tzinfo=UTC)
    text = format_result(
        _result(
            _snapshot(
                balances=(
                    BalanceItem(
                        BalanceItemKind.SUBSCRIPTION,
                        remaining=Decimal("1"),
                        unit="月",
                        expires_at=expires,
                    ),
                )
            )
        )
    )

    assert f"查询时间：{NOW.strftime('%Y-%m-%d %H:%M:%S UTC')}" in text
    assert f"获取时间：{NOW.strftime('%Y-%m-%d %H:%M:%S UTC')}" in text
    assert "来源：configured endpoint" in text
    assert f"到期 {expires.strftime('%Y-%m-%d %H:%M:%S UTC')}" in text


def test_builtin_meinianda_semantics_use_affirmative_command_copy_only():
    raw = "账户站内额度，不是 API Key 限额；不换算为货币"
    item = BalanceItem(
        BalanceItemKind.CREDITS,
        amount=Decimal("8.7654321"),
        unit="site_credit",
        raw_semantics=raw,
    )
    value = replace(_snapshot(balances=(item,)), provider_type=ProviderType.MEINIANDA)

    text = format_result(_result(value))

    assert "账户站内额度以 site_credit 计量。" in text
    assert "8.7654321 site_credit" in text
    assert "不是" not in text
    assert "不换算" not in text
    assert item.raw_semantics == raw
    assert display_semantics(item, ProviderType.MEINIANDA) == (
        "账户站内额度以 site_credit 计量。"
    )


def test_semantic_mapping_requires_exact_provider_unit_and_builtin_text():
    raw = "账户站内额度，不是 API Key 限额；不换算为货币"
    item = BalanceItem(BalanceItemKind.CREDITS, unit="site_credit", raw_semantics=raw)
    assert display_semantics(item) == raw
    assert display_semantics(item, ProviderType.OPENAI_COMPATIBLE) == raw
    assert display_semantics(replace(item, unit="USD"), ProviderType.MEINIANDA) == raw
    custom = "用户定义：不是现金；仅在当前项目可用"
    assert (
        display_semantics(replace(item, raw_semantics=custom), ProviderType.MEINIANDA)
        == custom
    )
    spaced = "账户站内额度，不是 API Key 限额；不换算为货币 "
    assert (
        display_semantics(replace(item, raw_semantics=spaced), ProviderType.MEINIANDA)
        == raw
    )


def test_unknown_negative_semantics_are_preserved_and_controls_normalized():
    custom = "不是现金\n只用于项目\u202e"
    item = BalanceItem(BalanceItemKind.CUSTOM, unit="points", raw_semantics=custom)
    assert display_semantics(item, ProviderType.MEINIANDA) == "不是现金 只用于项目"
    text = format_result(_result(_snapshot(balances=(item,))))
    assert "语义说明 不是现金 只用于项目" in text


def test_compact_text_has_nonzero_counts_and_balances_before_metadata():
    value = _snapshot(
        balances=(BalanceItem(BalanceItemKind.CASH, Decimal("1"), "CNY"),)
    )
    text = format_result(_result(value))
    assert "查询汇总：成功 1。" in text
    assert "部分成功 0" not in text
    assert "失败 0" not in text
    assert text.index("现金余额") < text.index("获取时间")


def test_text_times_convert_to_utc_with_seconds():
    local = datetime(2026, 9, 24, 18, 30, 12, 987654, timezone(timedelta(hours=8)))
    value = replace(_snapshot(), fetched_at=local)
    facts = replace(_result(value), queried_at=local)
    text = format_result(facts)
    assert "查询时间：2026-09-24 10:30:12 UTC" in text
    assert "获取时间：2026-09-24 10:30:12 UTC" in text
    assert "987654" not in text
    assert "+08:00" not in text


def test_target_labels_are_presentation_only_for_text_and_cards():
    from quota_link.cards import build_result_card

    for provider, label in (
        (ProviderType.DEEPSEEK, "DeepSeek"),
        (ProviderType.ALIBABA_BAILIAN, "阿里云百炼"),
        (ProviderType.GRSAI, "Grsai"),
        (ProviderType.MEINIANDA, "Meinianda"),
        (ProviderType.OPENAI_COMPATIBLE, "OpenAI 兼容服务"),
    ):
        request = QueryRequest(QueryRequestKind.PROVIDER, provider.value)
        facts = QueryResult(request, (_snapshot(),), NOW)
        assert f"供应商查询：{label}" in format_result(facts)
        assert f"目标：{label}\n" in build_result_card(facts).subtitle
        assert facts.request.target == provider.value

    request = QueryRequest(QueryRequestKind.ACCOUNT, "main")
    facts = QueryResult(request, (_snapshot(name="主账户\n测试"),), NOW)
    assert "账户查询：主账户 测试" in format_result(facts)
    assert "目标：主账户 测试\n" in build_result_card(facts).subtitle
    assert facts.request.target == "main"
    assert facts.snapshots[0].display_name == "主账户\n测试"


def test_target_labels_preserve_unknown_targets_and_match_account_ids_only():
    from quota_link.formatter import display_target

    for kind in (QueryRequestKind.ACCOUNT, QueryRequestKind.PROVIDER):
        facts = QueryResult(QueryRequest(kind, "unknown\n目标"), (_snapshot(),), NOW)
        assert display_target(facts) == "unknown 目标"
    # An account whose ID looks like a provider must keep its own display name.
    account = replace(_snapshot(name="自定义账户"), account_id="deepseek")
    facts = QueryResult(
        QueryRequest(QueryRequestKind.ACCOUNT, "deepseek"), (account,), NOW
    )
    assert display_target(facts) == "自定义账户"
    assert display_target(replace(facts, snapshots=())) == "deepseek"
    assert (
        display_target(
            replace(facts, snapshots=(replace(account, display_name="\u202e"),))
        )
        == "deepseek"
    )
