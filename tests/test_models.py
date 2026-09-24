from datetime import UTC, datetime
from decimal import Decimal

import pytest

from quota_link.models import (
    SUPPORTED_PROVIDER_TYPES,
    BalanceItem,
    BalanceItemKind,
    BalanceSnapshot,
    NormalizedProviderError,
    ProviderErrorCategory,
    ProviderType,
    QueryParseError,
    QueryParseErrorCode,
    QueryParseResult,
    QueryRequest,
    QueryRequestKind,
    QueryResult,
    SnapshotStatus,
)


def test_provider_type_recognition_is_not_adapter_implementation():
    assert SUPPORTED_PROVIDER_TYPES == {
        ProviderType.ALIBABA_BAILIAN,
        ProviderType.DEEPSEEK,
        ProviderType.OPENAI_COMPATIBLE,
    }


@pytest.mark.parametrize(
    "kind,target",
    [
        (QueryRequestKind.ALL, None),
        (QueryRequestKind.PROVIDER, "deepseek"),
        (QueryRequestKind.ACCOUNT, "ds-main"),
        (QueryRequestKind.HELP, None),
        (QueryRequestKind.STATUS, None),
    ],
)
def test_query_request_covers_supported_request_shapes(kind, target):
    request = QueryRequest(kind, target)
    assert request.kind is kind
    assert request.target == target


def test_query_parse_result_models_ambiguity_with_safe_candidates():
    error = QueryParseError(
        QueryParseErrorCode.AMBIGUOUS,
        "名称匹配到多个账户，请指定账户名。",
        ["deepseek-main", "deepseek-backup"],
    )
    result = QueryParseResult(error=error)

    assert result.request is None
    assert result.error.code is QueryParseErrorCode.AMBIGUOUS
    assert result.candidates == ("deepseek-main", "deepseek-backup")
    with pytest.raises((AttributeError, TypeError)):
        error.candidates += ("other",)


def test_parse_result_requires_exactly_one_outcome():
    with pytest.raises(ValueError, match="exactly one"):
        QueryParseResult()
    with pytest.raises(ValueError, match="exactly one"):
        QueryParseResult(
            request=QueryRequest(QueryRequestKind.ALL),
            error=QueryParseError(QueryParseErrorCode.INVALID_INPUT, "输入无效。"),
        )


def test_decimal_fields_preserve_precision_and_distinguish_zero_from_unknown():
    precise = Decimal("1234567890.000000000000000001")
    item = BalanceItem(BalanceItemKind.CREDITS, amount=precise, remaining=Decimal("0"))
    unknown = BalanceItem(BalanceItemKind.CASH, amount=None, unit="CNY")

    assert item.amount == precise
    assert item.remaining == Decimal("0")
    assert unknown.amount is None
    assert unknown.amount != Decimal("0")


@pytest.mark.parametrize("value", [0.1, Decimal("NaN"), Decimal("Infinity")])
def test_balance_amounts_reject_lossy_or_nonfinite_values(value):
    with pytest.raises(ValueError, match="finite Decimal"):
        BalanceItem(BalanceItemKind.CASH, amount=value)  # type: ignore[arg-type]


def test_snapshot_copies_balance_sequence_and_requires_aware_time():
    item = BalanceItem(BalanceItemKind.FREE_QUOTA, amount=Decimal("0"))
    mutable_items = [item]
    snapshot = BalanceSnapshot(
        account_id="bailian-main",
        provider_type=ProviderType.ALIBABA_BAILIAN,
        display_name="阿里百炼",
        status=SnapshotStatus.AVAILABLE,
        balances=mutable_items,
        source="configured balance endpoint",
        fetched_at=datetime(2026, 9, 24, tzinfo=UTC),
    )
    mutable_items.clear()

    assert snapshot.balances == (item,)
    with pytest.raises(ValueError, match="timezone-aware"):
        BalanceSnapshot(
            account_id="ds-main",
            provider_type=ProviderType.DEEPSEEK,
            display_name="DeepSeek",
            status=SnapshotStatus.UNKNOWN,
            balances=(),
            source="DeepSeek balance endpoint",
            fetched_at=datetime(2026, 9, 24),
        )


def test_standard_error_has_only_safe_message_and_diagnostic_code():
    error = NormalizedProviderError(
        ProviderErrorCategory.AUTHENTICATION,
        "认证失败，请检查已配置的凭据。",
        "HTTP_401",
    )

    assert error.category is ProviderErrorCategory.AUTHENTICATION
    assert error.safe_message == "认证失败，请检查已配置的凭据。"
    assert not hasattr(error, "response")
    assert not hasattr(error, "exception")


def test_query_result_is_immutable_and_requires_aware_aggregate_time():
    request = QueryRequest(QueryRequestKind.ALL)
    result = QueryResult(request, [], datetime(2026, 9, 24, tzinfo=UTC))

    assert result.request is request
    assert result.snapshots == ()
    with pytest.raises((AttributeError, TypeError)):
        result.snapshots = ()
    with pytest.raises(ValueError, match="timezone-aware"):
        QueryResult(request, (), datetime(2026, 9, 24))
