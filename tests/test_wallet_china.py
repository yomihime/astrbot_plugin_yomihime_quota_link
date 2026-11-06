import asyncio
from decimal import Decimal
from types import SimpleNamespace

import pytest

from quota_link.http_client import HttpStatusError
from quota_link.models import ProviderErrorCategory, ProviderType, SnapshotStatus
from quota_link.providers.wallet_china import ADAPTERS

_KEY = "synthetic-mock-key"


class _Client:
    def __init__(self, payload=None, error=None):
        self.payload = payload
        self.error = error
        self.calls = []

    async def request(self, method, url, *, headers, timeout):
        self.calls.append((method, url, headers, timeout))
        if self.error is not None:
            raise self.error
        return SimpleNamespace(status_code=200, json=lambda: self.payload)


def _account(region, key=_KEY):
    return SimpleNamespace(
        id="fixture",
        display_name="Synthetic account",
        region=region,
        auth={"api_key": key},
        timeout_seconds=7.0,
    )


def _fetch(provider, client, *, region="china", key=_KEY):
    return asyncio.run(ADAPTERS[provider].fetch_balance(_account(region, key), client))


def _moonshot_payload():
    return {
        "code": 0,
        "status": True,
        "scode": "0x0",
        "data": {
            "available_balance": Decimal("17.125000000000000001"),
            "cash_balance": Decimal("-3.25"),
            "voucher_balance": Decimal("17.125000000000000001"),
        },
    }


def _stepfun_payload():
    return {
        "object": "account",
        "type": "postpaid",
        "balance": Decimal("-0.125000000000000001"),
        "total_cash_balance": Decimal("21"),
        "total_voucher_balance": Decimal("100"),
    }


@pytest.mark.parametrize(
    ("region", "suffix", "unit"), [("china", "cn", "CNY"), ("global", "ai", "USD")]
)
def test_moonshot_preserves_authoritative_amount_and_cash_debt(region, suffix, unit):
    client = _Client(_moonshot_payload())
    result = _fetch(ProviderType.MOONSHOT, client, region=region)

    assert client.calls == [
        (
            "GET",
            f"https://api.moonshot.{suffix}/v1/users/me/balance",
            {"Authorization": f"Bearer {_KEY}"},
            7.0,
        )
    ]
    assert result.status is SnapshotStatus.AVAILABLE
    assert result.provider_type is ProviderType.MOONSHOT
    assert {item.unit for item in result.balances} == {unit}
    available, cash, voucher = result.balances
    assert available.amount == voucher.amount == Decimal("17.125000000000000001")
    assert cash.amount == Decimal("-3.25")
    assert [item.metric for item in result.balances] == [
        "available_balance",
        None,
        None,
    ]


@pytest.mark.parametrize(
    ("region", "suffix", "unit"), [("china", "com", "CNY"), ("global", "ai", "USD")]
)
def test_stepfun_separates_current_balance_from_cumulative_funding(
    region, suffix, unit
):
    client = _Client(_stepfun_payload())
    result = _fetch(ProviderType.STEPFUN, client, region=region)

    assert client.calls == [
        (
            "GET",
            f"https://api.stepfun.{suffix}/v1/accounts",
            {"Authorization": f"Bearer {_KEY}"},
            7.0,
        )
    ]
    assert result.status is SnapshotStatus.AVAILABLE
    assert {item.unit for item in result.balances} == {unit}
    available, cash, voucher = result.balances
    assert available.amount == Decimal("-0.125000000000000001")
    assert available.metric == "available_balance"
    assert cash.total == Decimal("21") and voucher.total == Decimal("100")
    for item in (cash, voucher):
        assert item.amount is item.remaining is item.metric is None


@pytest.mark.parametrize(
    ("provider", "make_payload", "field", "value", "category"),
    [
        (
            ProviderType.MOONSHOT,
            _moonshot_payload,
            "code",
            123,
            "temporarily_unavailable",
        ),
        (ProviderType.MOONSHOT, _moonshot_payload, "code", False, "parse"),
        (
            ProviderType.MOONSHOT,
            _moonshot_payload,
            "status",
            False,
            "temporarily_unavailable",
        ),
        (ProviderType.MOONSHOT, _moonshot_payload, "status", "true", "parse"),
        (ProviderType.MOONSHOT, _moonshot_payload, "data", {}, "parse"),
        (ProviderType.STEPFUN, _stepfun_payload, "object", "subscription", "parse"),
        (ProviderType.STEPFUN, _stepfun_payload, "balance", True, "parse"),
        (ProviderType.STEPFUN, _stepfun_payload, "balance", "NaN", "parse"),
        (ProviderType.STEPFUN, _stepfun_payload, "balance", "1e99999", "parse"),
        (ProviderType.STEPFUN, _stepfun_payload, "total_cash_balance", None, "parse"),
    ],
)
def test_missing_invalid_and_failed_responses_do_not_create_balances(
    provider, make_payload, field, value, category
):
    payload = make_payload()
    payload[field] = value
    payload["message"] = f"Sensitive upstream text {_KEY}"
    result = _fetch(provider, _Client(payload))

    assert result.status is SnapshotStatus.UNAVAILABLE
    assert result.balances == ()
    assert result.error.category is ProviderErrorCategory(category)
    assert _KEY not in repr(result)


def test_negative_moonshot_voucher_is_rejected():
    payload = _moonshot_payload()
    payload["data"]["voucher_balance"] = -1
    result = _fetch(ProviderType.MOONSHOT, _Client(payload))
    assert result.error.category is ProviderErrorCategory.PARSE
    assert result.balances == ()


@pytest.mark.parametrize("provider", [ProviderType.MOONSHOT, ProviderType.STEPFUN])
@pytest.mark.parametrize(
    ("status", "category"),
    [
        (401, ProviderErrorCategory.AUTHENTICATION),
        (403, ProviderErrorCategory.PERMISSION),
        (429, ProviderErrorCategory.RATE_LIMITED),
        (503, ProviderErrorCategory.TEMPORARILY_UNAVAILABLE),
    ],
)
def test_http_errors_are_normalized_without_retry(provider, status, category):
    response = SimpleNamespace(retry_after_seconds=23 if status == 429 else None)
    client = _Client(error=HttpStatusError(status, response))
    result = _fetch(provider, client)

    assert len(client.calls) == 1
    assert result.balances == ()
    assert result.error.category is category
    assert result.error.retry_after_seconds == response.retry_after_seconds
    assert _KEY not in repr(result)


@pytest.mark.parametrize("provider", [ProviderType.MOONSHOT, ProviderType.STEPFUN])
@pytest.mark.parametrize(("key", "region"), [("", "china"), (_KEY, "other-region")])
def test_missing_key_or_invalid_region_does_not_make_request(provider, key, region):
    client = _Client()
    result = _fetch(provider, client, region=region, key=key)

    assert not client.calls
    assert result.error.category is ProviderErrorCategory.CONFIGURATION
    assert result.balances == ()
