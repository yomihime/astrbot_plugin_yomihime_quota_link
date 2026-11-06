import asyncio
from decimal import Decimal
from types import SimpleNamespace

import pytest

from quota_link.http_client import HttpStatusError
from quota_link.models import BalanceItemKind, ProviderErrorCategory, SnapshotStatus
from quota_link.providers.wallet_sub2api import SUB2API_ADAPTER

_ORIGIN = "https://gateway.example.invalid:9443"
_KEY = "synthetic-mock-key"


def _wallet():
    return {
        "mode": "unrestricted",
        "isValid": True,
        "unit": "USD",
        "planName": "wallet",
        "balance": Decimal("-0.125000000000000001"),
        "remaining": Decimal("-0.125000000000000001"),
    }


def _quota():
    return {
        "mode": "quota_limited",
        "isValid": True,
        "status": "quota_exhausted",
        "unit": "USD",
        "remaining": 0,
        "quota": {"limit": 10, "used": 11, "remaining": 0, "unit": "USD"},
        "usage": {"totalTokens": 1000000},
    }


def _fetch(payload=None, *, origin=_ORIGIN, error=None):
    calls = []

    async def request(method, url, *, headers, timeout):
        calls.append((method, url, headers, timeout))
        if error is not None:
            raise error
        return SimpleNamespace(status_code=200, json=lambda: payload)

    account = SimpleNamespace(
        id="fixture",
        display_name="Synthetic account",
        auth={"api_key": _KEY},
        endpoint={"base_url": origin},
        timeout_seconds=5.0,
    )
    result = asyncio.run(
        SUB2API_ADAPTER.fetch_balance(account, SimpleNamespace(request=request))
    )
    return result, calls


def test_sub2api_wallet_uses_fixed_read_only_route_and_exact_usd():
    result, calls = _fetch(_wallet(), origin=_ORIGIN + "/")

    assert calls == [
        ("GET", _ORIGIN + "/v1/usage", {"Authorization": f"Bearer {_KEY}"}, 5.0)
    ]
    assert result.status is SnapshotStatus.AVAILABLE
    (balance,) = result.balances
    assert balance.kind is BalanceItemKind.CASH
    assert balance.amount == Decimal("-0.125000000000000001")
    assert balance.unit == "USD"
    assert balance.metric is None


def test_sub2api_exhausted_key_quota_remains_available_as_a_numeric_report():
    result, _ = _fetch(_quota())

    assert result.status is SnapshotStatus.AVAILABLE
    (quota,) = result.balances
    assert quota.kind is BalanceItemKind.QUOTA
    assert quota.unit == "USD"
    assert (quota.total, quota.used, quota.remaining) == (
        Decimal(10),
        Decimal(11),
        Decimal(0),
    )
    assert quota.amount is quota.metric is None


@pytest.mark.parametrize(
    "fields",
    [
        {"mode": "unrestricted", "planName": "subscription", "remaining": 13},
        {"mode": "unrestricted", "subscription": {}, "remaining": -1},
        {"mode": "unrestricted", "planName": "subscription"},
        {"mode": "quota_limited", "rate_limits": [{"window": "5h", "remaining": 23}]},
    ],
)
def test_sub2api_subscription_and_rate_windows_are_not_wallets(fields):
    result, _ = _fetch({"isValid": True, "unit": "USD", **fields})
    assert result.status is SnapshotStatus.UNAVAILABLE
    assert result.balances == ()
    assert result.error.category is ProviderErrorCategory.NOT_IMPLEMENTED


@pytest.mark.parametrize(
    ("make_payload", "changes"),
    [
        (_wallet, {"unit": "CNY"}),
        (_wallet, {"remaining": 2}),
        (_wallet, {"mode": "unrecognized"}),
        (_wallet, {"balance": None}),
        (_wallet, {"isValid": 1}),
        (_quota, {"remaining": 2}),
        (_quota, {"balance": 0}),
        (_quota, {"quota": {"limit": 10, "used": 1, "remaining": -1, "unit": "USD"}}),
        (_quota, {"quota": {"limit": 10, "used": 1, "remaining": 11, "unit": "USD"}}),
    ],
)
def test_sub2api_ambiguous_or_invalid_numbers_fail_closed(make_payload, changes):
    result, _ = _fetch({**make_payload(), **changes})
    assert result.balances == ()
    assert result.error.category is ProviderErrorCategory.PARSE


@pytest.mark.parametrize(
    "origin",
    [
        "http://gateway.example.invalid",
        "https://user@gateway.example.invalid",
        "https://gateway.example.invalid/v1",
        "https://gateway.example.invalid?param=value",
        "https://gateway.example.invalid#frag",
    ],
)
def test_sub2api_rejects_non_origin_before_transport(origin):
    result, calls = _fetch(_wallet(), origin=origin)
    assert not calls
    assert result.error.category is ProviderErrorCategory.CONFIGURATION


def test_sub2api_invalid_key_and_transport_throttling_do_not_leak_body():
    result, _ = _fetch({**_wallet(), "isValid": False, "message": _KEY})
    assert result.error.category is ProviderErrorCategory.AUTHENTICATION
    assert result.balances == ()
    assert _KEY not in repr(result)

    result, calls = _fetch(
        error=HttpStatusError(429, SimpleNamespace(retry_after_seconds=42))
    )
    assert len(calls) == 1
    assert result.error.category is ProviderErrorCategory.RATE_LIMITED
    assert result.error.retry_after_seconds == 42
