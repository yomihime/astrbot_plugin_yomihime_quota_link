import asyncio
import json
from collections.abc import Callable, Mapping
from decimal import Decimal
from pathlib import Path
from typing import Any

import pytest

from quota_link.http_client import (
    HttpResponseParseError,
    HttpStatusError,
    HttpTransportError,
)
from quota_link.models import (
    BalanceItemKind,
    ProviderErrorCategory,
    ProviderType,
    SnapshotStatus,
)
from quota_link.providers.base import AsyncProviderClient
from quota_link.providers.deepseek import DeepSeekAdapter

FIXTURE = Path(__file__).parent / "fixtures" / "deepseek" / "balance_success.json"
_ACCOUNT = {
    "id": "deepseek-main",
    "display_name": "DeepSeek 主账户",
    "auth": {"api_key": "test-secret"},
    "timeout_seconds": 3.0,
}


class FakeResponse:
    def __init__(self, payload: Any, status_code: int = 200) -> None:
        self.status_code = status_code
        self._payload = payload

    def json(self) -> Any:
        return self._payload


class FakeClient:
    def __init__(
        self, response: FakeResponse | None = None, error: Exception | None = None
    ):
        self.response = response or FakeResponse({})
        self.error = error
        self.calls: list[tuple[str, str, dict[str, Any]]] = []

    async def request(
        self,
        method: str,
        url: str,
        *,
        headers: Mapping[str, str] | None = None,
        params: Mapping[str, str] | None = None,
        json: Any = None,
        timeout: float | None = None,
        params_factory: Callable[[], Mapping[str, str]] | None = None,
    ) -> FakeResponse:
        kwargs = {
            "headers": headers,
            "params": params,
            "json": json,
            "timeout": timeout,
            "params_factory": params_factory,
        }
        kwargs = {key: value for key, value in kwargs.items() if value is not None}
        self.calls.append((method, url, kwargs))
        if self.error is not None:
            raise self.error
        return self.response

    async def close(self) -> None:
        return None


def test_deepseek_fetches_balance_with_bearer_and_preserves_all_currency_items():
    payload = json.loads(FIXTURE.read_text(encoding="utf-8"), parse_float=Decimal)
    client = FakeClient(FakeResponse(payload))

    snapshot = asyncio.run(DeepSeekAdapter().fetch_balance(_ACCOUNT, client))

    assert isinstance(client, AsyncProviderClient)
    assert client.calls[0] == (
        "GET",
        "https://api.deepseek.com/user/balance",
        {"headers": {"Authorization": "Bearer test-secret"}, "timeout": 3.0},
    )
    assert snapshot.provider_type is ProviderType.DEEPSEEK
    assert snapshot.status is SnapshotStatus.AVAILABLE
    assert [(item.unit, item.label, item.amount) for item in snapshot.balances] == [
        ("CNY", "总可用余额", Decimal("110.00")),
        ("CNY", "未过期赠金余额", Decimal("10.00")),
        ("CNY", "充值余额", Decimal("100.00")),
        ("USD", "总可用余额", Decimal("7.2500")),
        ("USD", "未过期赠金余额", Decimal("0.2500")),
        ("USD", "充值余额", Decimal("7.0000")),
    ]
    assert all(item.kind is BalanceItemKind.CASH for item in snapshot.balances)


def test_is_available_false_keeps_reported_amounts_and_marks_unavailable():
    client = FakeClient(
        FakeResponse(
            {
                "is_available": False,
                "balance_infos": [
                    {
                        "currency": "CNY",
                        "total_balance": "0.00",
                        "granted_balance": "0.00",
                        "topped_up_balance": "0.00",
                    }
                ],
            }
        )
    )

    snapshot = asyncio.run(DeepSeekAdapter().fetch_balance(_ACCOUNT, client))

    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert [item.amount for item in snapshot.balances] == [
        Decimal("0.00"),
        Decimal("0.00"),
        Decimal("0.00"),
    ]
    assert snapshot.error is None


@pytest.mark.parametrize("auth", [{}, {"api_key": "  "}, None])
def test_missing_api_key_returns_safe_configuration_error_without_request(auth: Any):
    account = {**_ACCOUNT, "auth": auth}
    client = FakeClient()

    snapshot = asyncio.run(DeepSeekAdapter().fetch_balance(account, client))

    assert client.calls == []
    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert snapshot.error is not None
    assert snapshot.error.category is ProviderErrorCategory.CONFIGURATION
    assert snapshot.error.diagnostic_code == "missing_api_key"
    assert snapshot.error.safe_message == "DeepSeek 账户缺少有效 API 密钥"
    assert "test-secret" not in snapshot.error.safe_message


@pytest.mark.parametrize(
    ("status_code", "category", "diagnostic"),
    [
        (401, ProviderErrorCategory.AUTHENTICATION, "http_401"),
        (402, ProviderErrorCategory.TEMPORARILY_UNAVAILABLE, "http_402"),
        (403, ProviderErrorCategory.PERMISSION, "http_403"),
        (429, ProviderErrorCategory.RATE_LIMITED, "http_429"),
    ],
)
def test_http_status_errors_are_normalized_without_response_details(
    status_code: int, category: ProviderErrorCategory, diagnostic: str
):
    secret = "top-secret-token"
    client = FakeClient(error=HttpStatusError(status_code))
    account = {**_ACCOUNT, "auth": {"api_key": secret}}

    snapshot = asyncio.run(DeepSeekAdapter().fetch_balance(account, client))

    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert snapshot.error is not None
    assert snapshot.error.category is category
    assert snapshot.error.diagnostic_code == diagnostic
    assert secret not in snapshot.error.safe_message


@pytest.mark.parametrize("kind", ["timeout", "connection"])
def test_transport_errors_are_safely_normalized(kind: str):
    snapshot = asyncio.run(
        DeepSeekAdapter().fetch_balance(
            _ACCOUNT, FakeClient(error=HttpTransportError(kind))
        )
    )

    assert snapshot.error is not None
    assert snapshot.error.category is ProviderErrorCategory.TEMPORARILY_UNAVAILABLE
    assert snapshot.error.diagnostic_code == kind


def test_invalid_json_transport_error_is_mapped_to_parse_error():
    snapshot = asyncio.run(
        DeepSeekAdapter().fetch_balance(
            _ACCOUNT, FakeClient(error=HttpResponseParseError())
        )
    )

    assert snapshot.error is not None
    assert snapshot.error.category is ProviderErrorCategory.PARSE
    assert snapshot.error.diagnostic_code == "invalid_json"


@pytest.mark.parametrize(
    "payload",
    [
        None,
        {"is_available": "true", "balance_infos": []},
        {"is_available": True, "balance_infos": []},
        {"is_available": True, "balance_infos": [{"currency": "EUR"}]},
        {
            "is_available": True,
            "balance_infos": [
                {
                    "currency": "CNY",
                    "total_balance": 1.1,
                    "granted_balance": "0",
                    "topped_up_balance": "1.1",
                }
            ],
        },
        {
            "is_available": True,
            "balance_infos": [
                {
                    "currency": "CNY",
                    "total_balance": "NaN",
                    "granted_balance": "0",
                    "topped_up_balance": "0",
                }
            ],
        },
    ],
)
def test_structural_or_amount_changes_return_safe_parse_error(payload: Any):
    snapshot = asyncio.run(
        DeepSeekAdapter().fetch_balance(_ACCOUNT, FakeClient(FakeResponse(payload)))
    )

    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert snapshot.error is not None
    assert snapshot.error.category is ProviderErrorCategory.PARSE
    assert snapshot.balances == ()
