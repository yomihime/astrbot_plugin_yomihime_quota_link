"""Tests for configured read-only OpenAI-compatible balance sources."""

from __future__ import annotations

import asyncio
import json
from collections.abc import Mapping
from datetime import UTC, datetime
from decimal import Decimal
from pathlib import Path
from types import MappingProxyType
from typing import Any

import pytest

from quota_link.formatter import format_result
from quota_link.http_client import (
    HttpRequestError,
    HttpResponseParseError,
    HttpStatusError,
    HttpTransportError,
)
from quota_link.models import (
    BalanceItemKind,
    ProviderErrorCategory,
    ProviderType,
    QueryRequest,
    QueryRequestKind,
    QueryResult,
    SnapshotStatus,
)
from quota_link.providers.openai_compatible import OpenAICompatibleAdapter

FIXTURE = (
    Path(__file__).parent
    / "fixtures"
    / "openai_compatible"
    / "generic_balance_success.json"
)
_ACCOUNT = {
    "id": "generic-main",
    "display_name": "Generic balance account",
    "auth": {"api_key": "secret-token"},
    "endpoint": {
        "url": "https://provider.example/v1/account/balance",
        "method": "GET",
        "auth_mode": "bearer",
    },
    "response_mapping": {
        "amount_path": "/data/credits",
        "used_path": "/data/used",
        "unit": "credit",
        "kind": "credits",
        "status_path": "/data/state",
        "status_values": {"active": "available"},
        "expires_at_path": "/data/expires",
        "success_path": "/ok",
        "success_value": True,
    },
    "timeout_seconds": 4.0,
}


class FakeResponse:
    def __init__(self, payload: Any, status_code: int = 200) -> None:
        self.status_code = status_code
        self._payload = payload

    def json(self) -> Any:
        if isinstance(self._payload, Exception):
            raise self._payload
        return self._payload


class FakeClient:
    def __init__(
        self, response: FakeResponse | None = None, error: Exception | None = None
    ) -> None:
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
    ) -> FakeResponse:
        self.calls.append(
            (
                method,
                url,
                {
                    "headers": headers,
                    "params": params,
                    "json": json,
                    "timeout": timeout,
                },
            )
        )
        if self.error is not None:
            raise self.error
        return self.response


def _fixture_payload() -> Any:
    return json.loads(FIXTURE.read_text(encoding="utf-8"), parse_float=Decimal)


def _query(account: Mapping[str, Any] = _ACCOUNT, client: FakeClient | None = None):
    fake = client or FakeClient(FakeResponse(_fixture_payload()))
    return asyncio.run(OpenAICompatibleAdapter().fetch_balance(account, fake)), fake


def test_get_bearer_maps_explicit_fields_and_decimal_without_precision_loss():
    snapshot, client = _query()

    assert client.calls == [
        (
            "GET",
            "https://provider.example/v1/account/balance",
            {
                "headers": {
                    "Accept": "application/json",
                    "Authorization": "Bearer secret-token",
                },
                "params": {},
                "json": None,
                "timeout": 4.0,
            },
        )
    ]
    assert snapshot.status is SnapshotStatus.AVAILABLE
    item = snapshot.balances[0]
    assert item.amount == Decimal("12345678901234567890.12345678901234567890")
    assert item.used == Decimal("2.125")
    assert item.kind is BalanceItemKind.CREDITS
    assert item.unit == "credit"
    assert item.expires_at is not None
    assert item.expires_at.isoformat() == "2027-01-02T03:04:05+00:00"


def test_webui_default_fields_with_base_url_path_query_successfully():
    endpoint = {
        "url": "",
        "base_url": "https://provider.example/",
        "path": "/v1/account/balance",
        "method": "GET",
        "auth_mode": "bearer",
        "auth_name": "",
        "json_body": {},
    }
    response_mapping = {
        "amount_path": "/data/credits",
        "total_path": "",
        "remaining_path": "",
        "used_path": "",
        "unit": "custom",
        "unit_path": "",
        "kind": "custom",
        "kind_path": "",
        "status_path": "",
        "status_values": {},
        "expires_at_path": "",
        "expiry_path": "",
        "success_path": "",
        "success_value": "",
        "failure_path": "",
        "failure_value": "",
    }
    account = {
        **_ACCOUNT,
        "endpoint": endpoint,
        "response_mapping": response_mapping,
    }

    snapshot, client = _query(account)

    assert snapshot.error is None
    assert snapshot.status is SnapshotStatus.AVAILABLE
    assert snapshot.balances[0].amount == Decimal(
        "12345678901234567890.12345678901234567890"
    )
    assert snapshot.balances[0].unit == "custom"
    assert snapshot.balances[0].total is None
    assert snapshot.balances[0].used is None
    assert snapshot.balances[0].expires_at is None
    assert client.calls[0][0:2] == (
        "GET",
        "https://provider.example/v1/account/balance",
    )
    assert client.calls[0][2]["json"] is None


def test_split_endpoint_marker_overrides_stale_legacy_url():
    account = {
        **_ACCOUNT,
        "prefer_split_endpoint": True,
        "endpoint": {
            **_ACCOUNT["endpoint"],
            "base_url": "https://new.example.invalid",
            "path": "/account/balance",
        },
    }

    snapshot, client = _query(account)

    assert snapshot.error is None
    assert client.calls[0][1] == "https://new.example.invalid/account/balance"


def test_legacy_url_precedes_split_fields_without_marker():
    account = {
        **_ACCOUNT,
        "endpoint": {
            **_ACCOUNT["endpoint"],
            "base_url": "https://new.example.invalid",
            "path": "/account/balance",
        },
    }

    snapshot, client = _query(account)

    assert snapshot.error is None
    assert client.calls[0][1] == _ACCOUNT["endpoint"]["url"]


def _grsai_account(**overrides):
    account = {
        "id": "grsai-account",
        "display_name": "Grsai account credits",
        "service_profile": "grsai",
        "balance_scope": "account",
        "auth": {"token": "request-token-secret"},
        "endpoint": {
            "base_url": "https://provider.example.invalid",
            "path": "/client/openapi/getCredits",
            "method": "POST",
            "json_body": {},
        },
        "response_mapping": {},
        "timeout_seconds": 4.0,
    }
    account.update(overrides)
    return account


def test_grsai_account_credits_documented_success_shape_and_body_auth():
    # Offline payload mirrors the documented success example, not a live response.
    payload = {"code": 0, "data": {"credits": 10000}, "msg": "success"}
    fake = FakeClient(FakeResponse(payload))

    snapshot, client = _query(_grsai_account(), fake)

    assert client.calls == [
        (
            "POST",
            "https://provider.example.invalid/client/openapi/getCredits",
            {
                "headers": {"Accept": "application/json"},
                "params": {},
                "json": {"token": "request-token-secret"},
                "timeout": 4.0,
            },
        )
    ]
    assert snapshot.status is SnapshotStatus.AVAILABLE
    assert snapshot.balances[0].amount == Decimal("10000")
    assert snapshot.balances[0].unit == "credit"
    assert snapshot.balances[0].kind is BalanceItemKind.CREDITS
    assert "request-token-secret" not in repr(snapshot)


def test_native_grsai_type_uses_fixed_account_protocol_and_typed_snapshot():
    account = _grsai_account(
        type="grsai",
        endpoint={
            "base_url": "https://wrong.example.invalid",
            "url": "https://wrong.example.invalid/stale",
        },
        response_mapping={"amount_path": "/stale/path"},
    )
    fake = FakeClient(FakeResponse({"code": 0, "data": {"credits": "2.5"}}))

    snapshot, client = _query(account, fake)

    assert snapshot.provider_type is ProviderType.GRSAI
    assert snapshot.balances[0].amount == Decimal("2.5")
    assert client.calls[0][0:2] == (
        "POST",
        "https://grsai.dakka.com.cn/client/openapi/getCredits",
    )
    assert client.calls[0][2]["headers"] == {"Accept": "application/json"}
    assert client.calls[0][2]["json"] == {"token": "request-token-secret"}


def test_native_grsai_global_region_uses_documented_global_host_only():
    account = _grsai_account(
        type="grsai",
        region="global",
        endpoint={"base_url": "https://wrong.example.invalid"},
    )
    fake = FakeClient(FakeResponse({"code": 0, "data": {"credits": 3}}))

    snapshot, client = _query(account, fake)

    assert snapshot.status is SnapshotStatus.AVAILABLE
    assert client.calls[0] == (
        "POST",
        "https://grsaiapi.com/client/openapi/getCredits",
        {
            "headers": {"Accept": "application/json"},
            "params": {},
            "json": {"token": "request-token-secret"},
            "timeout": 4.0,
        },
    )


def test_native_grsai_invalid_region_makes_no_request():
    snapshot, client = _query(_grsai_account(type="grsai", region="bad"))

    assert client.calls == []
    assert snapshot.error.category is ProviderErrorCategory.CONFIGURATION


def test_native_grsai_error_snapshot_keeps_provider_type_without_request():
    account = _grsai_account(type="grsai", auth={"api_key": "old-model-key"})

    snapshot, client = _query(account)

    assert client.calls == []
    assert snapshot.provider_type is ProviderType.GRSAI
    assert snapshot.error.category is ProviderErrorCategory.CONFIGURATION
    assert "old-model-key" not in repr(snapshot)


def test_grsai_ignores_stale_legacy_url_and_generic_auth_mode():
    endpoint = {
        **_grsai_account()["endpoint"],
        "url": "https://legacy.example.invalid/wrong",
        "auth_mode": "bearer",
    }
    fake = FakeClient(FakeResponse({"code": 0, "data": {"credits": "1.25"}}))

    snapshot, client = _query(_grsai_account(endpoint=endpoint), fake)

    assert snapshot.error is None
    assert client.calls[0][1] == (
        "https://provider.example.invalid/client/openapi/getCredits"
    )
    assert client.calls[0][2]["headers"] == {"Accept": "application/json"}
    assert client.calls[0][2]["json"] == {"token": "request-token-secret"}


def test_grsai_optional_path_and_method_are_assembled_at_runtime():
    account = _grsai_account(
        endpoint={"base_url": "https://provider.example.invalid"},
        response_mapping={
            "amount_path": "/old/field",
            "kind": "custom",
            "unit": "custom",
        },
    )
    fake = FakeClient(FakeResponse({"code": 0, "data": {"credits": 12}}))

    snapshot, client = _query(account, fake)

    assert snapshot.error is None
    assert snapshot.balances[0].amount == Decimal("12")
    assert snapshot.balances[0].kind is BalanceItemKind.CREDITS
    assert snapshot.balances[0].unit == "credit"
    assert client.calls[0][0:2] == (
        "POST",
        "https://provider.example.invalid/client/openapi/getCredits",
    )


@pytest.mark.parametrize(
    "changes",
    [
        {"balance_scope": "api_key"},
        {"auth": {"api_key": "model-key"}},
        {"endpoint": {"base_url": "http://provider.example.invalid"}},
        {"endpoint": {"base_url": "https://provider.example.invalid/leak"}},
        {
            "endpoint": {
                "base_url": "https://provider.example.invalid",
                "path": "/wrong",
            }
        },
        {
            "endpoint": {
                "base_url": "https://provider.example.invalid",
                "json_body": {"token": "embedded-secret"},
            }
        },
    ],
)
def test_grsai_invalid_configuration_makes_no_request(changes):
    snapshot, client = _query(_grsai_account(**changes))

    assert client.calls == []
    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert snapshot.error.category is ProviderErrorCategory.CONFIGURATION
    assert "secret" not in repr(snapshot)


@pytest.mark.parametrize(
    "payload,category",
    [
        ({"code": 7, "msg": "request-token-secret"}, ProviderErrorCategory.ENDPOINT),
        ({"code": 0, "data": {}}, ProviderErrorCategory.PARSE),
        ({"code": "0", "data": {"credits": 1}}, ProviderErrorCategory.PARSE),
        ({"code": 0, "data": {"credits": -1}}, ProviderErrorCategory.PARSE),
    ],
)
def test_grsai_failure_response_is_safely_classified(payload, category):
    fake = FakeClient(FakeResponse(payload))

    snapshot, _ = _query(_grsai_account(), fake)

    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert snapshot.error.category is category
    assert "request-token-secret" not in repr(snapshot)


@pytest.mark.parametrize("status", [401, 403, 404, 429, 500])
def test_grsai_unknown_http_mapping_stays_generic(status):
    fake = FakeClient(FakeResponse({"msg": "request-token-secret"}, status))

    snapshot, _ = _query(_grsai_account(), fake)

    assert snapshot.error.category is ProviderErrorCategory.TEMPORARILY_UNAVAILABLE
    assert snapshot.error.diagnostic_code == f"http_{status}"
    assert "request-token-secret" not in repr(snapshot)
    assert snapshot.source == "Grsai 账户积分接口"


@pytest.mark.parametrize(
    ("mode", "name", "expected"),
    [
        ("header", "X-API-Key", {"X-API-Key": "secret-token"}),
        ("query", "apikey", None),
    ],
)
def test_custom_header_and_query_auth_are_explicit(mode, name, expected):
    account = {
        **_ACCOUNT,
        "endpoint": {**_ACCOUNT["endpoint"], "auth_mode": mode, "auth_name": name},
    }
    _, client = _query(account)
    call = client.calls[0][2]
    if mode == "header":
        assert call["headers"][name] == expected[name]
        assert call["params"] == {}
    else:
        assert call["params"] == {name: "secret-token"}
        assert name not in client.calls[0][1]


def test_documented_read_only_post_sends_only_static_json_body():
    account = {
        **_ACCOUNT,
        "endpoint": {
            **_ACCOUNT["endpoint"],
            "method": "POST",
            "json_body": {"scope": "account"},
        },
    }
    _, client = _query(account)
    assert client.calls[0][0] == "POST"
    assert client.calls[0][2]["json"] == {"scope": "account"}


def test_frozen_settings_body_is_thawed_for_json_transport():
    account = {
        **_ACCOUNT,
        "endpoint": MappingProxyType(
            {
                **_ACCOUNT["endpoint"],
                "method": "POST",
                "json_body": MappingProxyType(
                    {"scope": "account", "filters": ("credits",)}
                ),
            }
        ),
    }
    _, client = _query(account)
    assert client.calls[0][2]["json"] == {
        "scope": "account",
        "filters": ["credits"],
    }


@pytest.mark.parametrize(
    "account",
    [
        {
            **_ACCOUNT,
            "endpoint": {
                **_ACCOUNT["endpoint"],
                "url": "http://provider.example/balance",
            },
        },
        {
            **_ACCOUNT,
            "endpoint": {
                **_ACCOUNT["endpoint"],
                "url": "https://user:secret@provider.example/balance",
            },
        },
        {
            **_ACCOUNT,
            "endpoint": {
                **_ACCOUNT["endpoint"],
                "url": "https://provider.example/v1/chat/completions",
            },
        },
        {**_ACCOUNT, "endpoint": {**_ACCOUNT["endpoint"], "method": "DELETE"}},
        {**_ACCOUNT, "endpoint": {**_ACCOUNT["endpoint"], "auth_mode": "unknown"}},
        {
            **_ACCOUNT,
            "endpoint": {
                **_ACCOUNT["endpoint"],
                "method": "POST",
                "json_body": {"token": "secret"},
            },
        },
        {
            **_ACCOUNT,
            "endpoint": {
                **_ACCOUNT["endpoint"],
                "method": "POST",
                "json_body": {"value": "${SECRET}"},
            },
        },
        {**_ACCOUNT, "response_mapping": {"amount_path": "data.balance"}},
        {**_ACCOUNT, "response_mapping": {"amount_path": ""}},
        {
            **_ACCOUNT,
            "endpoint": {**_ACCOUNT["endpoint"], "json_body": {"scope": "account"}},
        },
        {
            **_ACCOUNT,
            "response_mapping": {
                **_ACCOUNT["response_mapping"],
                "failure_path": "/failed",
            },
        },
    ],
)
def test_invalid_configuration_is_rejected_before_any_request(account):
    snapshot, client = _query(account)
    assert client.calls == []
    assert snapshot.error is not None
    assert snapshot.error.category is ProviderErrorCategory.CONFIGURATION


@pytest.mark.parametrize(
    ("path", "category", "calls"),
    [
        (
            "__import__('os').system('echo unsafe')",
            ProviderErrorCategory.CONFIGURATION,
            0,
        ),
        ("/data/credits[0]", ProviderErrorCategory.PARSE, 1),
        ("/data/~2key", ProviderErrorCategory.CONFIGURATION, 0),
        ("/data/credits/../secret", ProviderErrorCategory.PARSE, 1),
    ],
)
def test_expression_like_or_invalid_pointer_is_never_evaluated(path, category, calls):
    mapping = {**_ACCOUNT["response_mapping"], "amount_path": path}
    account = {**_ACCOUNT, "response_mapping": mapping}
    snapshot, client = _query(account)
    assert len(client.calls) == calls
    assert snapshot.error is not None
    assert snapshot.error.category is category
    assert snapshot.balances == ()


@pytest.mark.parametrize(
    ("payload", "mapping"),
    [
        ({"ok": False, "data": {"credits": "1"}}, _ACCOUNT["response_mapping"]),
        ({"ok": True, "data": {"credits": 1.1}}, _ACCOUNT["response_mapping"]),
        ({"ok": True, "data": {"credits": "NaN"}}, _ACCOUNT["response_mapping"]),
        ({"ok": True, "data": {"credits": "-1"}}, _ACCOUNT["response_mapping"]),
        (
            {"ok": True, "data": {"credits": "1", "state": "strange"}},
            _ACCOUNT["response_mapping"],
        ),
    ],
)
def test_business_failure_and_invalid_values_return_safe_errors(payload, mapping):
    account = {**_ACCOUNT, "response_mapping": mapping}
    snapshot, _ = _query(account, FakeClient(FakeResponse(payload)))
    assert snapshot.error is not None
    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert snapshot.balances == ()
    if payload.get("ok") is False:
        assert snapshot.error.diagnostic_code == "business_failure"
    else:
        assert snapshot.error.category is ProviderErrorCategory.PARSE


@pytest.mark.parametrize(
    ("path_key", "response_field", "response_value"),
    [
        ("unit_path", "unit", "secret-token"),
        ("kind_path", "kind", "secret-token"),
    ],
)
def test_dynamic_display_fields_cannot_echo_credentials(
    path_key, response_field, response_value
):
    mapping = {
        **_ACCOUNT["response_mapping"],
        path_key: f"/data/{response_field}",
    }
    payload = {
        "ok": True,
        "data": {"credits": "5", response_field: response_value},
    }
    snapshot, _ = _query(
        {**_ACCOUNT, "response_mapping": mapping}, FakeClient(FakeResponse(payload))
    )
    result = QueryResult(
        QueryRequest(QueryRequestKind.ALL),
        (snapshot,),
        datetime.now(UTC),
    )
    rendered = format_result(result)

    assert snapshot.error is not None
    assert snapshot.error.category is ProviderErrorCategory.PARSE
    assert snapshot.balances == ()
    assert "secret-token" not in repr(snapshot)
    assert "secret-token" not in rendered


def test_dynamic_display_fields_accept_only_configured_unit_and_known_kind():
    mapping = {
        **_ACCOUNT["response_mapping"],
        "unit_path": "/data/unit",
        "kind_path": "/data/kind",
    }
    payload = {
        "ok": True,
        "data": {
            "credits": "5",
            "used": "0.5",
            "unit": "credit",
            "kind": "credits",
            "expires": "2027-01-02T03:04:05+00:00",
            "state": "active",
        },
    }
    snapshot, _ = _query(
        {**_ACCOUNT, "response_mapping": mapping}, FakeClient(FakeResponse(payload))
    )

    assert snapshot.error is None
    assert snapshot.balances[0].unit == "credit"
    assert snapshot.balances[0].kind is BalanceItemKind.CREDITS
    assert snapshot.balances[0].raw_semantics is None


def test_malformed_account_settings_return_configuration_snapshot_without_request():
    account = {**_ACCOUNT, "response_mapping": None}
    snapshot, client = _query(account)

    assert client.calls == []
    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert snapshot.error is not None
    assert snapshot.error.category is ProviderErrorCategory.CONFIGURATION
    assert snapshot.error.diagnostic_code == "invalid_configuration"


def test_explicit_failure_mapping_is_honored_without_echoing_provider_text():
    mapping = {
        **_ACCOUNT["response_mapping"],
        "failure_path": "/error",
        "failure_value": "BALANCE_DENIED",
    }
    payload = {
        "ok": True,
        "error": "BALANCE_DENIED",
        "message": "secret-token must not be echoed",
        "data": {"credits": "9.25"},
    }
    snapshot, _ = _query(
        {**_ACCOUNT, "response_mapping": mapping}, FakeClient(FakeResponse(payload))
    )
    assert snapshot.error is not None
    assert snapshot.error.category is ProviderErrorCategory.ENDPOINT
    assert snapshot.error.diagnostic_code == "business_failure"
    assert "secret-token" not in snapshot.error.safe_message


@pytest.mark.parametrize(
    ("status", "category"),
    [
        (401, ProviderErrorCategory.AUTHENTICATION),
        (403, ProviderErrorCategory.PERMISSION),
        (404, ProviderErrorCategory.ENDPOINT),
        (429, ProviderErrorCategory.RATE_LIMITED),
        (503, ProviderErrorCategory.TEMPORARILY_UNAVAILABLE),
    ],
)
def test_http_statuses_are_safely_normalized(status, category):
    secret = "secret-token"
    snapshot, _ = _query(_ACCOUNT, FakeClient(error=HttpStatusError(status)))
    assert snapshot.error is not None
    assert snapshot.error.category is category
    assert secret not in snapshot.error.safe_message
    assert "provider.example" not in snapshot.error.safe_message


@pytest.mark.parametrize("kind", ["timeout", "connection"])
def test_timeout_and_connection_errors_are_mapped(kind):
    snapshot, _ = _query(_ACCOUNT, FakeClient(error=HttpTransportError(kind)))
    assert snapshot.error is not None
    assert snapshot.error.category is ProviderErrorCategory.TEMPORARILY_UNAVAILABLE
    assert snapshot.error.diagnostic_code == (
        "timeout" if kind == "timeout" else "connection_error"
    )


def test_json_and_local_http_errors_are_safe():
    for exception, expected_category in (
        (HttpResponseParseError(), ProviderErrorCategory.PARSE),
        (HttpRequestError("insecure_scheme"), ProviderErrorCategory.CONFIGURATION),
    ):
        snapshot, _ = _query(_ACCOUNT, FakeClient(error=exception))
        assert snapshot.error is not None
        assert snapshot.error.category is expected_category
        assert "secret-token" not in snapshot.error.safe_message


def test_cancelled_query_propagates():
    async def run():
        class CancelClient(FakeClient):
            async def request(self, *args, **kwargs):
                raise asyncio.CancelledError

        with pytest.raises(asyncio.CancelledError):
            await OpenAICompatibleAdapter().fetch_balance(_ACCOUNT, CancelClient())

    asyncio.run(run())
