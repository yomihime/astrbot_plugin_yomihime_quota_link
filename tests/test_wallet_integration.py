import asyncio
from datetime import UTC, datetime
from decimal import Decimal

import httpx
import pytest

from quota_link.alert_units import request_identity
from quota_link.cache import BalanceCache
from quota_link.http_client import HttpProviderClient
from quota_link.models import (
    ProviderErrorCategory,
    ProviderType,
    QueryRequest,
    QueryRequestKind,
)
from quota_link.providers import IMPLEMENTED_ADAPTERS
from quota_link.service import QueryService
from quota_link.settings import load_settings
from quota_link.tool_facts import serialize_query_result


def _record(provider, account_id, **fields):
    return {
        "id": account_id,
        "type": provider,
        "display_name": f"Fixture {account_id}",
        "auth": {"api_key": f"synthetic-key-{account_id}"},
        **fields,
    }


def _token(*, unlimited=False, user=None):
    data = {
        "object": "token_usage",
        "name": "private upstream name",
        "total_available": 120,
        "total_used": 500,
        "unlimited_quota": unlimited,
        "expires_at": 1800000000,
    }
    if user is not None:
        data["user_quota"] = {"total_available": user, "total_used": 800}
    return {"code": True, "data": data}


@pytest.mark.parametrize(
    ("unlimited", "user", "expected"),
    [
        (False, None, [120]),
        (False, 30, [30, 120, 30]),
        (True, 0, [0, None, 0]),
        (True, None, [None]),
    ],
)
def test_new_api_queries_only_its_configured_origin_and_keeps_raw_quota(
    unlimited, user, expected
):
    def reply(request):
        assert request.method == "GET"
        assert str(request.url) == "https://gateway.example/api/usage/token/"
        assert request.headers["Authorization"] == "Bearer synthetic-key-gateway"
        assert not request.content
        return httpx.Response(200, json=_token(unlimited=unlimited, user=user))

    async def scenario():
        settings = load_settings(
            {
                "providers": [
                    _record(
                        "new_api",
                        "gateway",
                        endpoint={"base_url": "https://GATEWAY.example:443/"},
                    ),
                ]
            },
            environ={},
        )
        async with httpx.AsyncClient(transport=httpx.MockTransport(reply)) as http:
            client = HttpProviderClient(client=http)
            service = QueryService(
                settings, IMPLEMENTED_ADAPTERS, client, BalanceCache()
            )
            result = await service.query(
                QueryRequest(QueryRequestKind.PROVIDER, "new_api")
            )
        (snapshot,) = result.snapshots
        assert snapshot.error is None
        assert [item.amount for item in snapshot.balances] == expected
        assert all(
            item.unit == "quota_points" and item.metric is None
            for item in snapshot.balances
        )
        token = next(item for item in snapshot.balances if item.expires_at)
        assert token.used == Decimal(500)
        assert token.expires_at == datetime.fromtimestamp(1800000000, UTC)
        facts = serialize_query_result(result)
        assert "private upstream name" not in facts and "synthetic-key" not in facts

    asyncio.run(scenario())


@pytest.mark.parametrize(
    ("status", "body", "category"),
    [
        (
            200,
            {"success": False, "message": "private upstream error"},
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
        ),
        (200, {"code": 1, "data": {}}, ProviderErrorCategory.PARSE),
        (
            200,
            {"code": True, "data": {"object": "token_usage"}},
            ProviderErrorCategory.PARSE,
        ),
        (302, {}, ProviderErrorCategory.ENDPOINT),
        (401, {}, ProviderErrorCategory.AUTHENTICATION),
        (403, {}, ProviderErrorCategory.PERMISSION),
        (429, {}, ProviderErrorCategory.RATE_LIMITED),
    ],
)
def test_new_api_failure_does_not_expose_response_or_follow_redirect(
    status, body, category
):
    requests = []

    def reply(request):
        requests.append(str(request.url))
        return httpx.Response(
            status,
            headers={"Location": "https://redirect.example", "Retry-After": "42"},
            json=body,
        )

    async def scenario():
        settings = load_settings(
            {
                "providers": [
                    _record(
                        "new_api",
                        "gateway",
                        endpoint={"base_url": "https://gateway.example"},
                    ),
                ]
            },
            environ={},
        )
        async with httpx.AsyncClient(
            transport=httpx.MockTransport(reply), follow_redirects=True
        ) as http:
            client = HttpProviderClient(client=http)
            snapshot = await IMPLEMENTED_ADAPTERS[ProviderType.NEW_API].fetch_balance(
                settings.accounts[0], client
            )
        assert snapshot.error.category is category
        assert snapshot.balances == ()
        assert "private upstream error" not in repr(snapshot)
        assert requests == ["https://gateway.example/api/usage/token/"]
        if status == 429:
            assert snapshot.error.retry_after_seconds == 42

    asyncio.run(scenario())


@pytest.mark.parametrize(
    "origin",
    [
        "http://gateway.example",
        "https://user:pass@gateway.example",
        "https://gateway.example/api",
        "https://gateway.example/?bad=1",
        "https://gateway.example/#anchor",
        "https://gateway.example:99999",
    ],
)
def test_invalid_gateway_origins_never_become_queryable(origin):
    for provider in ("new_api", "sub2api"):
        settings = load_settings(
            {
                "providers": [
                    _record(provider, "gateway", endpoint={"base_url": origin}),
                ]
            },
            environ={},
        )
        assert not settings.accounts[0].queryable
        assert settings.accounts[0].unavailable_reason == "invalid_wallet_origin"


def test_team_change_invalidates_query_cache_and_alert_unit_identity():
    def account(team_id):
        return load_settings(
            {"providers": [_record("xai", "wallet", team_id=team_id)]}, environ={}
        ).accounts[0]

    first, second = account("team-1"), account("team-2")
    assert first.queryable and second.queryable
    assert first.config_fingerprint != second.config_fingerprint
    assert request_identity(first) != request_identity(second)
    assert not account("team/../other").queryable


@pytest.mark.parametrize("provider", ["new_api", "moonshot"])
def test_upstream_throttling_shares_one_origin_or_region_only(provider):
    def record(id_, first_origin):
        if provider == "new_api":
            host = "https://first.example" if first_origin else "https://other.example"
            return _record(provider, id_, endpoint={"base_url": host})
        return _record(provider, id_, region="china" if first_origin else "global")

    requests = []

    def reply(request):
        requests.append(request.url.host)
        return httpx.Response(429, headers={"Retry-After": "360"})

    async def scenario():
        settings = load_settings(
            {
                "providers": [
                    record("first", True),
                    record("same", True),
                    record("other", False),
                ]
            },
            environ={},
        )
        async with httpx.AsyncClient(transport=httpx.MockTransport(reply)) as http:
            client = HttpProviderClient(client=http)
            service = QueryService(
                settings, IMPLEMENTED_ADAPTERS, client, BalanceCache()
            )
            for name, expected in (
                ("first", "http_429"),
                ("same", "provider_cooldown"),
                ("other", "http_429"),
            ):
                result = await service.query(
                    QueryRequest(QueryRequestKind.ACCOUNT, name)
                )
                assert result.snapshots[0].error.diagnostic_code == expected
        assert len(requests) == 2 and requests[0] != requests[1]

    asyncio.run(scenario())
