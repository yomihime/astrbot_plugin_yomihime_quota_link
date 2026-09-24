from datetime import UTC, datetime
from decimal import Decimal

from quota_link.formatter import (
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
    assert f"查询时间：{NOW.isoformat()}" in text
    assert f"获取时间：{NOW.isoformat()}" in text
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
    assert text.endswith("所有账户查询均失败。")
    assert "模拟" not in text


def test_unavailable_snapshot_without_error_counts_as_failure():
    text = format_result(
        _result(_snapshot(name="断线账户", status=SnapshotStatus.UNAVAILABLE))
    )

    assert "断线账户：不可用" in text
    assert "所有账户查询均失败。" in text
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
    assert "查询汇总：成功 1，部分成功 0，失败 1。" in text


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
    assert "查询汇总：成功 0，部分成功 1，失败 0。" in text
    assert "\n群聊查询：已开启" not in text
    assert "\n伪造单位" not in text
    assert "\n伪造账户：管理员" not in text
    assert "\n伪造状态：成功" not in text


def test_format_result_handles_no_configured_accounts():
    assert format_result(_result()) == (
        f"查询时间：{NOW.isoformat()}\n当前没有配置可查询的账户。"
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
                    "auth": {"api_key": secret},
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
    assert "百炼账户：已配置，查询适配器可能尚未实现" in status_text
    assert secret not in help_text + status_text


def test_status_handles_no_configuration_and_reports_safe_diagnostics():
    settings = load_settings(None, environ={})
    text = format_status(settings)

    assert "账户：共 0 个，启用 0 个，可查询 0 个" in text
    assert "尚未配置账户。" in text
    assert "群聊查询：已关闭" in text


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

    assert "账户 群聊查询：已开启：已配置，查询适配器可能尚未实现" in text
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


def test_snapshot_and_query_times_and_source_are_formatted_as_iso_and_text():
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

    assert f"查询时间：{NOW.isoformat()}" in text
    assert f"获取时间：{NOW.isoformat()}" in text
    assert "来源：configured endpoint" in text
    assert f"到期 {expires.isoformat()}" in text
