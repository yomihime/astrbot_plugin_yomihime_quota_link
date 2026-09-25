"""Small, credential-free JSON facts returned by the LLM tool."""

from __future__ import annotations

import json
from datetime import datetime
from decimal import Decimal
from typing import Any

from .models import QueryParseResult, QueryResult


def encode_tool_result(payload: dict[str, Any]) -> str:
    """Encode one compact JSON object without exposing non-JSON internals."""
    return json.dumps(payload, ensure_ascii=False, separators=(",", ":"))


def serialize_parse_error(operation: str, parsed: QueryParseResult) -> str:
    error = parsed.error
    if error is None:
        raise ValueError("parsed result has no error")
    result: dict[str, Any] = {
        "schema_version": 1,
        "operation": operation,
        "error": {"category": error.code.value, "message": error.safe_message},
    }
    if error.candidates:
        result["error"]["candidates"] = list(error.candidates)
    return encode_tool_result(result)


def serialize_capabilities(accounts: list[dict[str, object]]) -> str:
    """Return only the public capability fields supplied by AccountDirectory."""
    safe_accounts = []
    for account in accounts:
        item = {
            key: account[key]
            for key in (
                "id",
                "display_name",
                "provider",
                "balance_kind",
                "balance_scope",
                "queryable",
            )
            if key in account
        }
        reason = account.get("unavailable_reason", account.get("reason"))
        if reason is not None:
            item["unavailable_reason"] = reason
        safe_accounts.append(item)
    return encode_tool_result(
        {"schema_version": 1, "operation": "list", "accounts": safe_accounts}
    )


def serialize_query_result(
    result: QueryResult,
    *,
    balance_metadata: dict[str, dict[str, str]] | None = None,
) -> str:
    """Serialize resolved query facts, excluding credentials and raw responses."""
    request = result.request
    output: dict[str, Any] = {
        "schema_version": 1,
        "operation": "query",
        "target": {"kind": request.kind.value, "name": request.target},
        "queried_at": _datetime(result.queried_at),
        "accounts": [],
    }
    metadata = balance_metadata or {}
    for snapshot in result.snapshots:
        account: dict[str, Any] = {
            "id": snapshot.account_id,
            "display_name": snapshot.display_name,
            "provider": snapshot.provider_type.value,
            "status": snapshot.status.value,
            "cached": snapshot.cached,
            "source": snapshot.source,
            "fetched_at": _datetime(snapshot.fetched_at),
            "balances": [],
        }
        if snapshot.account_id in metadata:
            account.update(metadata[snapshot.account_id])
        if snapshot.error is not None:
            account["error"] = {
                "category": snapshot.error.category.value,
                "message": snapshot.error.safe_message,
            }
        for balance in snapshot.balances:
            item: dict[str, Any] = {
                "kind": balance.kind.value,
                "amount": _decimal(balance.amount),
                "unit": balance.unit,
            }
            for field in ("total", "remaining", "used"):
                value = getattr(balance, field)
                if value is not None:
                    item[field] = _decimal(value)
            if balance.label:
                item["label"] = balance.label
            if balance.expires_at is not None:
                item["expires_at"] = _datetime(balance.expires_at)
            account["balances"].append(item)
        output["accounts"].append(account)
    return encode_tool_result(output)


def _decimal(value: Decimal | None) -> str | None:
    return None if value is None else format(value, "f")


def _datetime(value: datetime) -> str:
    return value.isoformat()
