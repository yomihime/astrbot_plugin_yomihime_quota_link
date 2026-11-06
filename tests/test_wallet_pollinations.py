import asyncio
from decimal import Decimal
from types import SimpleNamespace

import httpx
import pytest

from quota_link.http_client import HttpProviderClient
from quota_link.models import BalanceItemKind, ProviderErrorCategory, SnapshotStatus
from quota_link.providers.wallet_pollinations import POLLINATIONS_ADAPTER

_KEY = "sk_synthetic-pollen-key"


def _query(payload, *, status=200, headers=None):
    requests = []

    def handler(request):
        requests.append(request)
        return (
            httpx.Response(status, content=payload, headers=headers)
            if isinstance(payload, bytes)
            else httpx.Response(status, json=payload, headers=headers)
        )

    async def run():
        account = SimpleNamespace(
            id="pollen-fixture",
            display_name="Synthetic Pollinations",
            auth={"api_key": _KEY},
            timeout_seconds=3.0,
            endpoint={"url": "https://unrelated.invalid/account/balance"},
        )
        client = HttpProviderClient(
            client=httpx.AsyncClient(transport=httpx.MockTransport(handler)),
            retry_delay=0,
        )
        try:
            return await POLLINATIONS_ADAPTER.fetch_balance(account, client)
        finally:
            await client.close()

    return asyncio.run(run()), requests


def test_fixed_request_uses_account_wallet_even_when_key_has_a_distinct_budget():
    snapshot, requests = _query(
        b'{"balance":7,"accountBalance":{"total":35.750000000000000001,'
        b'"tier":10.500000000000000001,"paid":25.25}}'
    )
    assert len(requests) == 1
    request = requests[0]
    assert str(request.url) == "https://gen.pollinations.ai/account/balance"
    assert request.method == "GET"
    assert request.headers["authorization"] == f"Bearer {_KEY}"
    assert request.headers["accept"] == "application/json"
    assert request.content == b""
    assert set(request.extensions["timeout"].values()) == {3.0}
    assert snapshot.error is None
    assert _KEY not in repr(snapshot)
    assert [
        (item.metric, item.kind, item.unit, item.amount) for item in snapshot.balances
    ] == [
        (
            "available_balance",
            BalanceItemKind.CREDITS,
            "Pollen",
            Decimal("35.750000000000000001"),
        ),
        (
            "quest_pollen",
            BalanceItemKind.FREE_QUOTA,
            "Pollen",
            Decimal("10.500000000000000001"),
        ),
        ("paid_pollen", BalanceItemKind.CREDITS, "Pollen", Decimal("25.25")),
    ]


def test_held_quest_pollen_is_separate_from_available_funds():
    snapshot, _ = _query(
        {
            "balance": 8,
            "accountBalance": {
                "total": 8,
                "tier": 0,
                "paid": 8,
                "heldTier": 10.5,
                "questPollenRestricted": True,
            },
        }
    )
    assert [(item.metric, item.amount) for item in snapshot.balances] == [
        ("available_balance", Decimal(8)),
        ("quest_pollen", Decimal(0)),
        ("paid_pollen", Decimal(8)),
        ("held_quest_pollen", Decimal("10.5")),
    ]


def test_real_zero_wallet_is_available():
    snapshot, _ = _query(
        {"balance": 0, "accountBalance": {"total": 0, "tier": 0, "paid": 0}}
    )
    assert snapshot.status is SnapshotStatus.AVAILABLE
    assert len(snapshot.balances) == 3
    assert all(item.amount == 0 for item in snapshot.balances)


@pytest.mark.parametrize(
    ("payload", "status", "category", "retry"),
    [
        ({"balance": 7}, 200, "permission", None),
        (
            {"error": {"fixUrl": f"https://unrelated.invalid/{_KEY}"}},
            403,
            "permission",
            None,
        ),
        ({"error": _KEY}, 401, "authentication", None),
        ({"error": _KEY}, 429, "rate_limited", 60),
        ({"balance": True}, 200, "parse", None),
        ({"balance": 7, "accountBalance": None}, 200, "parse", None),
        (
            {"balance": 7, "accountBalance": {"total": True, "tier": 3, "paid": 4}},
            200,
            "parse",
            None,
        ),
        (
            {"balance": 7, "accountBalance": {"total": 7, "tier": -3, "paid": 4}},
            200,
            "parse",
            None,
        ),
        ({"balance": 7, "accountBalance": {"total": 7, "paid": 4}}, 200, "parse", None),
        (b"<html>not a wallet</html>", 200, "parse", None),
    ],
)
def test_unauthorized_and_invalid_responses_are_safe_failures(
    payload, status, category, retry
):
    snapshot, requests = _query(
        payload,
        status=status,
        headers=None if retry is None else {"Retry-After": str(retry)},
    )
    assert len(requests) == 1
    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert not snapshot.balances
    assert snapshot.error.category is ProviderErrorCategory(category)
    assert snapshot.error.retry_after_seconds == retry
    assert _KEY not in repr(snapshot)
