"""Offline wiring check from settings through all provider adapters."""

import asyncio
from decimal import Decimal

import httpx

from quota_link.cache import BalanceCache
from quota_link.http_client import HttpProviderClient
from quota_link.models import QueryRequest, QueryRequestKind, SnapshotStatus
from quota_link.providers import IMPLEMENTED_ADAPTERS
from quota_link.service import QueryService
from quota_link.settings import load_settings


def test_all_provider_types_query_through_one_mocked_http_client():
    settings = load_settings(
        {
            "providers": [
                {
                    "id": "deepseek",
                    "type": "deepseek",
                    "display_name": "DeepSeek",
                    "auth": {"api_key": "offline-key"},
                },
                {
                    "id": "bailian",
                    "type": "alibaba_bailian",
                    "display_name": "阿里云",
                    "auth": {
                        "access_key_id": "offline-id",
                        "access_key_secret": "offline-secret",
                    },
                },
                {
                    "id": "compatible",
                    "type": "openai_compatible",
                    "display_name": "Compatible",
                    "auth": {"api_key": "offline-key"},
                    "endpoint": {
                        "url": "https://balance.example.test/account",
                        "method": "GET",
                        "auth_mode": "bearer",
                    },
                    "response_mapping": {
                        "amount_path": "/remaining",
                        "unit": "credits",
                        "kind": "credits",
                    },
                },
            ]
        },
        environ={},
    )
    assert len(settings.queryable_accounts) == 3

    def respond(request: httpx.Request) -> httpx.Response:
        if request.url.host == "api.deepseek.com":
            return httpx.Response(
                200,
                json={
                    "is_available": True,
                    "balance_infos": [
                        {
                            "currency": "CNY",
                            "total_balance": "9.25",
                            "granted_balance": "1.00",
                            "topped_up_balance": "8.25",
                        }
                    ],
                },
            )
        if request.url.host == "business.aliyuncs.com":
            return httpx.Response(
                200,
                json={
                    "Success": True,
                    "Code": "200",
                    "Data": {"AvailableCashAmount": "7.50", "Currency": "CNY"},
                },
            )
        if request.url.host == "balance.example.test":
            return httpx.Response(200, json={"remaining": "5.125"})
        raise AssertionError(f"unexpected host: {request.url.host}")

    client = HttpProviderClient(
        client=httpx.AsyncClient(
            transport=httpx.MockTransport(respond), follow_redirects=False
        )
    )
    service = QueryService(settings, IMPLEMENTED_ADAPTERS, client, BalanceCache())

    async def run_query():
        try:
            return await service.query(QueryRequest(QueryRequestKind.ALL))
        finally:
            await service.close()
            await client.close()

    result = asyncio.run(run_query())
    assert {snapshot.provider_type.value for snapshot in result.snapshots} == {
        "deepseek",
        "alibaba_bailian",
        "openai_compatible",
    }
    assert all(
        snapshot.status is SnapshotStatus.AVAILABLE for snapshot in result.snapshots
    )
    compatible = next(
        snapshot for snapshot in result.snapshots if snapshot.account_id == "compatible"
    )
    assert compatible.balances[0].amount == Decimal("5.125")
