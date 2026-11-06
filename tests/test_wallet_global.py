import asyncio
from decimal import Decimal, localcontext
from types import SimpleNamespace

import httpx
import pytest

from quota_link.http_client import HttpProviderClient
from quota_link.models import ProviderErrorCategory as Error
from quota_link.models import ProviderType, SnapshotStatus
from quota_link.providers.wallet_global import ADAPTERS

_KEY = "synthetic-wallet-test-key"
_REQUESTS = {
    ProviderType.OPENROUTER: (
        "https://openrouter.ai/api/v1/credits",
        b'{"data":{"total_credits":10.0000000000000000000000000000001,"total_usage":11}}',
        [("available_balance", "-0.9999999999999999999999999999999", "USD")],
    ),
    ProviderType.NOVITA: (
        "https://api.novita.ai/openapi/v1/billing/balance/detail",
        b'{"availableBalance":"-125","cashBalance":"0","creditLimit":"20001",'
        b'"pendingCharges":"0","outstandingInvoices":"20126"}',
        [
            ("available_balance", "-0.0125", "USD"),
            ("cash_balance", "0", "USD"),
            ("credit_limit", "2.0001", "USD"),
            ("outstanding_invoices", "2.0126", "USD"),
        ],
    ),
    ProviderType.XAI: (
        "https://management-api.x.ai/v1/billing/teams/team-123/prepaid/balance",
        b'{"changes":[{"amount":{"val":"-9999"}}],"total":{"val":"-2317"}}',
        [("posted_prepaid_balance", "23.17", "USD")],
    ),
    ProviderType.VENICE: (
        "https://api.venice.ai/api/v1/billing/balance",
        b'{"canConsume":true,"consumptionCurrency":"DIEM","diemEpochAllocation":100,'
        b'"balances":{"diem":90.50000000000000001,"usd":null,'
        b'"bundledCredits":0,"earnedCredits":5.5}}',
        [
            ("diem_balance", "90.50000000000000001", "DIEM"),
            ("bundled_credits", "0", "BUNDLED_CREDITS"),
            ("earned_credits", "5.5", "EARNED_CREDITS"),
        ],
    ),
    ProviderType.VERCEL_GATEWAY: (
        "https://ai-gateway.vercel.sh/v1/credits",
        b'{"balance":"0","total_used":"4.50000000000000001"}',
        [
            ("available_balance", "0", "USD"),
            ("lifetime_usage", "4.50000000000000001", "USD"),
        ],
    ),
}


def _query(provider, *, content=None, status=200, headers=None, **account_changes):
    _, sample, _ = _REQUESTS[provider]
    account = SimpleNamespace(
        **{
            "id": "fixture-wallet",
            "display_name": "Fixture Wallet",
            "auth": {"api_key": _KEY},
            "team_id": "team-123",
            "timeout_seconds": 3.0,
            "endpoint": {"url": "https://unrelated.invalid/user/balance"},
            **account_changes,
        },
    )
    requests = []

    def handler(request):
        requests.append(request)
        return httpx.Response(
            status, content=sample if content is None else content, headers=headers
        )

    async def run():
        client = HttpProviderClient(
            client=httpx.AsyncClient(transport=httpx.MockTransport(handler)),
            retry_delay=0,
        )
        try:
            return await ADAPTERS[provider].fetch_balance(account, client)
        finally:
            await client.close()

    return asyncio.run(run()), requests


@pytest.mark.parametrize("provider", _REQUESTS)
def test_documented_requests_keep_distinct_balance_units(provider):
    expected_url, _, amounts = _REQUESTS[provider]
    with localcontext() as context:
        context.prec = 6
        snapshot, requests = _query(provider)

    assert len(requests) == 1
    request = requests[0]
    assert request.method == "GET"
    assert str(request.url) == expected_url
    assert request.headers["authorization"] == f"Bearer {_KEY}"
    assert request.content == b""
    assert all(value == 3.0 for value in request.extensions["timeout"].values())
    if provider in {ProviderType.NOVITA, ProviderType.VERCEL_GATEWAY}:
        assert request.headers["content-type"] == "application/json"
    assert snapshot.provider_type is provider
    assert snapshot.status is SnapshotStatus.AVAILABLE
    assert snapshot.error is None
    assert _KEY not in repr(snapshot)
    assert [(item.metric, item.amount, item.unit) for item in snapshot.balances] == [
        (metric, Decimal(value), unit) for metric, value, unit in amounts
    ]
    if provider is ProviderType.OPENROUTER:
        item = snapshot.balances[0]
        assert item.total == Decimal("10.0000000000000000000000000000001")
        assert item.used == Decimal("11")
        assert item.remaining == item.amount
    if provider is ProviderType.VENICE:
        assert snapshot.balances[0].total == Decimal("100")
        assert snapshot.balances[0].remaining == snapshot.balances[0].amount
    if provider is ProviderType.VERCEL_GATEWAY:
        assert snapshot.balances[0].total is None
        assert snapshot.balances[0].used is None


@pytest.mark.parametrize("ledger,usd", [("143", "-1.43"), ("0", "0.00")])
def test_xai_inverts_the_ledger_instead_of_using_absolute_value(ledger, usd):
    content = ('{"total":{"val":"' + ledger + '"}}').encode()
    snapshot, _ = _query(ProviderType.XAI, content=content)
    assert str(snapshot.balances[0].amount) == usd


@pytest.mark.parametrize("usd", ["-0.05", "0", "0.05"])
def test_venice_can_consume_flag_does_not_replace_reported_balance(usd):
    snapshot, _ = _query(
        ProviderType.VENICE,
        content=(
            '{"canConsume":false,"consumptionCurrency":null,"diemEpochAllocation":0,'
            f'"balances":{{"usd":{usd},"diem":null,"bundledCredits":null,"earnedCredits":null}}}}'
        ).encode(),
    )
    assert snapshot.status is SnapshotStatus.AVAILABLE
    assert len(snapshot.balances) == 1
    assert snapshot.balances[0].amount == Decimal(usd)


def test_venice_all_null_is_a_success_with_no_numeric_balance():
    snapshot, _ = _query(
        ProviderType.VENICE,
        content=(
            b'{"canConsume":false,"consumptionCurrency":null,"diemEpochAllocation":0,'
            b'"balances":{"usd":null,"diem":null,"bundledCredits":null,"earnedCredits":null}}'
        ),
    )
    assert snapshot.status is SnapshotStatus.AVAILABLE
    assert snapshot.error is None
    item = snapshot.balances[0]
    assert item.metric == "available_balance"
    assert item.amount is None
    assert item.raw_semantics


@pytest.mark.parametrize(
    "team_id", ["", "../v1", "team?param=x", "team%2Fother", "a/b"]
)
def test_xai_team_id_cannot_change_the_request_route(team_id):
    snapshot, requests = _query(ProviderType.XAI, team_id=team_id)
    assert not requests
    assert snapshot.error.category is Error.CONFIGURATION


@pytest.mark.parametrize(
    "provider,content",
    [
        (ProviderType.OPENROUTER, b'{"data":{"total_credits":true,"total_usage":5}}'),
        (ProviderType.OPENROUTER, b'{"data":{"total_credits":10}}'),
        (ProviderType.NOVITA, b'{"availableBalance":"10000.5","cashBalance":"0"}'),
        (ProviderType.NOVITA, b'{"availableBalance":"10000","cashBalance":0}'),
        (ProviderType.XAI, b'{"changes":[{"amount":{"val":"-10000"}}]}'),
        (ProviderType.XAI, b'{"total":{"val":true}}'),
        (
            ProviderType.VENICE,
            b'{"canConsume":false,"consumptionCurrency":null,"diemEpochAllocation":0,'
            b'"balances":{"diem":null,"bundledCredits":null,"earnedCredits":null}}',
        ),
        (
            ProviderType.VENICE,
            b'{"canConsume":true,"consumptionCurrency":"DIEM","diemEpochAllocation":100,'
            b'"balances":{"usd":null,"diem":"NaN","bundledCredits":null,"earnedCredits":null}}',
        ),
        (ProviderType.VERCEL_GATEWAY, b'{"balance":95.5,"total_used":"4.50"}'),
        (ProviderType.VERCEL_GATEWAY, b'{"balance":"95.50","total_used":null}'),
    ],
)
def test_malformed_or_unreported_values_do_not_create_a_balance(provider, content):
    snapshot, requests = _query(provider, content=content)
    assert len(requests) == 1
    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert snapshot.balances == ()
    assert snapshot.error.category is Error.PARSE


@pytest.mark.parametrize("provider", _REQUESTS)
@pytest.mark.parametrize(
    "status,category",
    [(401, Error.AUTHENTICATION), (403, Error.PERMISSION), (429, Error.RATE_LIMITED)],
)
def test_billing_failures_are_redacted_and_429_is_never_retried(
    provider, status, category
):
    snapshot, requests = _query(
        provider,
        content=b'{"error":"sensitive-provider-reply"}',
        status=status,
        headers={"Retry-After": "37"} if status == 429 else None,
    )
    assert len(requests) == 1
    assert snapshot.balances == ()
    assert snapshot.error.category is category
    assert snapshot.error.retry_after_seconds == (37 if status == 429 else None)
    assert "sensitive-provider-reply" not in repr(snapshot)
    assert _KEY not in repr(snapshot)


@pytest.mark.parametrize("provider", _REQUESTS)
def test_wallet_key_is_not_forwarded_to_a_redirect(provider):
    snapshot, requests = _query(
        provider, status=302, headers={"Location": "https://unrelated.invalid/"}
    )
    assert len(requests) == 1
    assert snapshot.error.category is Error.ENDPOINT
