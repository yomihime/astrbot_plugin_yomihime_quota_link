import json
from datetime import UTC, datetime
from decimal import Decimal

from quota_link.models import (
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
from quota_link.tool_facts import (
    serialize_capabilities,
    serialize_parse_error,
    serialize_query_result,
)


def test_parse_error_serializes_as_compact_json_facts():
    parsed = QueryParseResult(
        error=QueryParseError(
            QueryParseErrorCode.AMBIGUOUS,
            "匹配到多个账户",
            ("account-a", "account-b"),
        )
    )

    encoded = serialize_parse_error("query", parsed)

    assert json.loads(encoded) == {
        "schema_version": 1,
        "operation": "query",
        "error": {
            "category": "ambiguous",
            "message": "匹配到多个账户",
            "candidates": ["account-a", "account-b"],
        },
    }
    assert " " not in encoded


def test_capability_serialization_drops_config_and_secret_fields():
    encoded = serialize_capabilities(
        [
            {
                "id": "work",
                "display_name": "Work",
                "provider": "openai_compatible",
                "balance_kind": "第三方余额",
                "balance_scope": "generic",
                "queryable": False,
                "unavailable_reason": "missing_mapping",
                "endpoint": "https://secret.example.invalid/balance",
                "api_key": "never-output",
                "env_reference": "API_KEY",
            }
        ]
    )

    payload = json.loads(encoded)
    assert payload == {
        "schema_version": 1,
        "operation": "list",
        "accounts": [
            {
                "id": "work",
                "display_name": "Work",
                "provider": "openai_compatible",
                "balance_kind": "第三方余额",
                "balance_scope": "generic",
                "queryable": False,
                "unavailable_reason": "missing_mapping",
            }
        ],
    }
    assert "secret" not in encoded
    assert "API_KEY" not in encoded


def test_query_serialization_keeps_actual_amount_scope_and_safe_error():
    queried_at = datetime(2026, 9, 25, 3, 0, tzinfo=UTC)
    snapshot = BalanceSnapshot(
        account_id="ds-work",
        provider_type=ProviderType.DEEPSEEK,
        display_name="DS Work",
        status=SnapshotStatus.PARTIAL,
        balances=(
            BalanceItem(
                BalanceItemKind.CASH,
                amount=Decimal("12.3400"),
                unit="CNY",
                label="cash",
                raw_semantics="sensitive raw provider content",
            ),
            BalanceItem(BalanceItemKind.QUOTA, amount=None, unit="credit"),
        ),
        source="DeepSeek balance API",
        fetched_at=queried_at,
        cached=True,
        error=NormalizedProviderError(
            ProviderErrorCategory.PERMISSION, "需要余额只读权限"
        ),
    )
    result = QueryResult(
        QueryRequest(QueryRequestKind.ACCOUNT, "ds-work"), (snapshot,), queried_at
    )

    payload = json.loads(
        serialize_query_result(
            result,
            balance_metadata={
                "ds-work": {
                    "balance_scope": "account",
                    "balance_kind": "多币种账户余额",
                }
            },
        )
    )

    assert payload["target"] == {"kind": "account", "name": "ds-work"}
    assert payload["accounts"][0]["balance_scope"] == "account"
    assert payload["accounts"][0]["balance_kind"] == "多币种账户余额"
    assert payload["accounts"][0]["balances"] == [
        {"kind": "cash", "amount": "12.3400", "unit": "CNY", "label": "cash"},
        {"kind": "quota", "amount": None, "unit": "credit"},
    ]
    assert payload["accounts"][0]["cached"] is True
    assert payload["accounts"][0]["error"] == {
        "category": "permission",
        "message": "需要余额只读权限",
    }
    assert "sensitive raw" not in json.dumps(payload, ensure_ascii=False)
