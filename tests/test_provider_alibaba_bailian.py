import asyncio
import json
from collections.abc import Callable, Mapping
from decimal import Decimal
from pathlib import Path
from typing import Any

import httpx
import pytest

from quota_link.http_client import (
    HttpProviderClient,
    HttpRequestError,
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
from quota_link.providers.alibaba_bailian import (
    AlibabaBailianAdapter,
    _rpc_signature,
)

FIXTURE = (
    Path(__file__).parent / "fixtures" / "alibaba_bailian" / "balance_success.json"
)
_ACCOUNT = {
    "id": "aliyun-main",
    "display_name": "阿里云主账户",
    "auth": {
        "access_key_id": "testid",
        "access_key_secret": "testsecret",
    },
    "timeout_seconds": 4.5,
}


class FakeResponse:
    def __init__(self, payload: Any, status_code: int = 200) -> None:
        self.status_code = status_code
        self._payload = payload

    def json(self) -> Any:
        return self._payload


class FakeClient:
    def __init__(
        self,
        response: FakeResponse | None = None,
        error: Exception | None = None,
        *,
        factory_calls: int = 1,
    ) -> None:
        self.response = response or FakeResponse({})
        self.error = error
        self.factory_calls = factory_calls
        self.calls: list[tuple[str, str, dict[str, Any]]] = []
        self.generated_params: list[Mapping[str, str]] = []

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
        self.calls.append(
            (
                method,
                url,
                {
                    "headers": headers,
                    "params": params,
                    "json": json,
                    "timeout": timeout,
                    "params_factory": params_factory,
                },
            )
        )
        if params_factory is not None:
            self.generated_params.extend(
                params_factory() for _ in range(self.factory_calls)
            )
        if self.error is not None:
            raise self.error
        return self.response


def test_rpc_signature_matches_official_aliyun_example_vector():
    # Alibaba's official ActionTrail RPC signing example, with testsecret.
    params = {
        "AccessKeyId": "testid",
        "Action": "CreateTrail",
        "Format": "JSON",
        "Name": "test",
        "RegionId": "cn-hangzhou",
        "RoleName": "AliyunServiceRoleForActionTrail",
        "SignatureMethod": "HMAC-SHA1",
        "SignatureNonce": "d7730860-e66f-11ea-a3a5-d5f3b52e66a1",
        "SignatureVersion": "1.0",
        # This is the exact encoded query value shown in Alibaba's signed URL.
        "Timestamp": "2020-08-25T01%3A11%3A01Z",
        "Version": "2017-12-04",
    }
    assert (
        _rpc_signature("POST", params, "testsecret") == "d15sJSZ0cc+y6a6FHlWxGK/qcUA="
    )


def test_fetches_only_cash_balance_through_fixed_mainland_endpoint():
    payload = json.loads(FIXTURE.read_text(encoding="utf-8"), parse_float=Decimal)
    client = FakeClient(FakeResponse(payload))

    snapshot = asyncio.run(AlibabaBailianAdapter().fetch_balance(_ACCOUNT, client))

    assert client.calls[0][:2] == ("GET", "https://business.aliyuncs.com/")
    assert client.calls[0][2]["timeout"] == 4.5
    assert client.calls[0][2]["params"] is None
    assert client.calls[0][2]["headers"] is None
    params = client.generated_params[0]
    assert params["Action"] == "QueryAccountBalance"
    assert params["Version"] == "2017-12-14"
    assert params["Format"] == "JSON"
    assert params["AccessKeyId"] == "testid"
    assert params["SignatureMethod"] == "HMAC-SHA1"
    assert params["SignatureVersion"] == "1.0"
    assert params["Timestamp"].endswith("Z")
    assert params["Signature"] == _rpc_signature("GET", params, "testsecret")
    assert snapshot.provider_type is ProviderType.ALIBABA_BAILIAN
    assert snapshot.status is SnapshotStatus.AVAILABLE
    assert len(snapshot.balances) == 1
    item = snapshot.balances[0]
    assert item.kind is BalanceItemKind.CASH
    assert item.amount == Decimal("10000.00")
    assert item.unit == "CNY"
    assert item.label == "账户现金余额"


def test_factory_generates_new_timestamp_nonce_and_signature_for_each_attempt():
    client = FakeClient(FakeResponse({}), factory_calls=2)

    asyncio.run(AlibabaBailianAdapter().fetch_balance(_ACCOUNT, client))

    first, second = client.generated_params
    assert first["SignatureNonce"] != second["SignatureNonce"]
    assert first["Timestamp"].endswith("Z")
    assert first["Signature"] != second["Signature"]


def test_security_token_is_in_signed_query_params_when_configured():
    account = {
        **_ACCOUNT,
        "auth": {**_ACCOUNT["auth"], "security_token": "sts-token"},
    }
    client = FakeClient(FakeResponse({}))

    asyncio.run(AlibabaBailianAdapter().fetch_balance(account, client))

    params = client.generated_params[0]
    assert params["SecurityToken"] == "sts-token"
    assert params["Signature"] == _rpc_signature("GET", params, "testsecret")


@pytest.mark.parametrize(
    ("payload", "category", "diagnostic"),
    [
        (
            {
                "Success": False,
                "Code": "NoPermission",
                "Message": "secret details from provider",
            },
            ProviderErrorCategory.PERMISSION,
            "permission_denied",
        ),
        (
            {
                "Success": False,
                "Code": "NotAuthorized",
                "Message": "secret details from provider",
            },
            ProviderErrorCategory.PERMISSION,
            "not_authorized",
        ),
    ],
)
def test_business_permission_errors_are_safe_and_not_exposed(
    payload: Any, category: ProviderErrorCategory, diagnostic: str
):
    snapshot = asyncio.run(
        AlibabaBailianAdapter().fetch_balance(
            _ACCOUNT, FakeClient(FakeResponse(payload))
        )
    )

    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert snapshot.balances == ()
    assert snapshot.error is not None
    assert snapshot.error.category is category
    assert snapshot.error.diagnostic_code == diagnostic
    assert "secret details" not in snapshot.error.safe_message


@pytest.mark.parametrize(
    ("status_code", "category"),
    [
        (401, ProviderErrorCategory.AUTHENTICATION),
        (403, ProviderErrorCategory.PERMISSION),
        (404, ProviderErrorCategory.ENDPOINT),
        (429, ProviderErrorCategory.RATE_LIMITED),
        (503, ProviderErrorCategory.TEMPORARILY_UNAVAILABLE),
    ],
)
def test_http_status_errors_map_to_safe_categories(
    status_code: int, category: ProviderErrorCategory
):
    snapshot = asyncio.run(
        AlibabaBailianAdapter().fetch_balance(
            _ACCOUNT, FakeClient(error=HttpStatusError(status_code))
        )
    )

    assert snapshot.error is not None
    assert snapshot.error.category is category
    assert snapshot.error.diagnostic_code == f"http_{status_code}"


def test_real_transport_http_400_permission_code_is_mapped_without_echoing_message():
    secret_message = "AK secret=testsecret; Signature=private-signature"
    snapshot = asyncio.run(
        _fetch_through_mock_transport(
            400,
            json.dumps(
                {
                    "Code": "NoPermission",
                    "Message": secret_message,
                    "AccessKeyId": "testid",
                }
            ),
        )
    )

    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert snapshot.error is not None
    assert snapshot.error.category is ProviderErrorCategory.PERMISSION
    assert snapshot.error.diagnostic_code == "permission_denied"
    assert secret_message not in snapshot.error.safe_message
    assert "testsecret" not in snapshot.error.safe_message
    assert "private-signature" not in snapshot.error.safe_message


@pytest.mark.parametrize(
    "body",
    [
        "not-json",
        '{"Code":"UnexpectedProviderCode","Message":"must stay private"}',
    ],
)
def test_real_transport_http_400_without_allowlisted_code_falls_back_safely(
    body: str,
):
    snapshot = asyncio.run(_fetch_through_mock_transport(400, body))

    assert snapshot.error is not None
    assert snapshot.error.category is ProviderErrorCategory.ENDPOINT
    assert snapshot.error.diagnostic_code == "http_400"
    assert "must stay private" not in snapshot.error.safe_message


async def _fetch_through_mock_transport(status_code: int, body: str):
    async_httpx = httpx.AsyncClient(
        transport=httpx.MockTransport(
            lambda request: httpx.Response(
                status_code,
                content=body.encode("utf-8"),
                headers={"Content-Type": "application/json"},
            )
        )
    )
    client = HttpProviderClient(client=async_httpx, retry_delay=0)
    try:
        return await AlibabaBailianAdapter().fetch_balance(_ACCOUNT, client)
    finally:
        await client.close()


@pytest.mark.parametrize(
    ("error", "category", "diagnostic"),
    [
        (
            HttpTransportError("timeout"),
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
            "timeout",
        ),
        (
            HttpTransportError("connection"),
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
            "connection",
        ),
        (
            HttpResponseParseError(),
            ProviderErrorCategory.PARSE,
            "invalid_json",
        ),
        (
            HttpRequestError("closed"),
            ProviderErrorCategory.CONFIGURATION,
            "closed",
        ),
    ],
)
def test_transport_and_local_request_errors_are_normalized(
    error: Exception, category: ProviderErrorCategory, diagnostic: str
):
    snapshot = asyncio.run(
        AlibabaBailianAdapter().fetch_balance(_ACCOUNT, FakeClient(error=error))
    )

    assert snapshot.error is not None
    assert snapshot.error.category is category
    assert snapshot.error.diagnostic_code == diagnostic


@pytest.mark.parametrize(
    "payload",
    [
        None,
        {"Code": "200", "Data": {"AvailableCashAmount": "1.00", "Currency": "CNY"}},
        {
            "Code": "200",
            "Success": True,
            "Data": {"AvailableAmount": "1.00", "Currency": "CNY"},
        },
        {"Code": "200", "Success": True, "Data": {"AvailableCashAmount": "1.00"}},
        {
            "Code": "200",
            "Success": True,
            "Data": {"AvailableCashAmount": "1.00", "Currency": "EUR"},
        },
        {
            "Code": "200",
            "Success": True,
            "Data": {"AvailableCashAmount": 1.1, "Currency": "CNY"},
        },
        {
            "Code": "200",
            "Success": True,
            "Data": {"AvailableCashAmount": "NaN", "Currency": "CNY"},
        },
        {
            "Code": "200",
            "Success": True,
            "Data": {"AvailableCashAmount": "-1.00", "Currency": "CNY"},
        },
    ],
)
def test_missing_or_invalid_cash_fields_never_fall_back_to_other_amounts(
    payload: Any,
):
    snapshot = asyncio.run(
        AlibabaBailianAdapter().fetch_balance(
            _ACCOUNT, FakeClient(FakeResponse(payload))
        )
    )

    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert snapshot.balances == ()
    assert snapshot.error is not None
    assert snapshot.error.category is ProviderErrorCategory.PARSE


def test_missing_credentials_fail_without_sending_a_request():
    client = FakeClient()
    account = {**_ACCOUNT, "auth": {"api_key": "dashscope-key"}}

    snapshot = asyncio.run(AlibabaBailianAdapter().fetch_balance(account, client))

    assert not client.calls
    assert snapshot.error is not None
    assert snapshot.error.category is ProviderErrorCategory.CONFIGURATION
    assert "dashscope-key" not in snapshot.error.safe_message


def test_error_response_message_is_not_returned():
    secret_message = "access key secret leaked in provider message"
    snapshot = asyncio.run(
        AlibabaBailianAdapter().fetch_balance(
            _ACCOUNT,
            FakeClient(
                FakeResponse(
                    {
                        "Code": "InternalError",
                        "Success": False,
                        "Message": secret_message,
                    }
                )
            ),
        )
    )

    assert snapshot.error is not None
    assert secret_message not in snapshot.error.safe_message
    assert snapshot.error.diagnostic_code == "internal_error"
