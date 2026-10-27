"""Offline wiring check from settings through all provider adapters."""

import asyncio
from decimal import Decimal

import httpx
import pytest

from quota_link.cache import BalanceCache
from quota_link.http_client import HttpProviderClient
from quota_link.models import QueryRequest, QueryRequestKind, SnapshotStatus
from quota_link.providers import IMPLEMENTED_ADAPTERS
from quota_link.service import QueryService
from quota_link.settings import load_settings


@pytest.mark.parametrize("legacy_cash_only", [False, True])
def test_all_provider_types_query_through_one_mocked_http_client(legacy_cash_only):
    settings = load_settings(
        {
            "providers": [
                {
                    "id": "grsai",
                    "type": "grsai",
                    "display_name": "Grsai",
                    "auth": {"token": "offline-token"},
                },
                {
                    "id": "meinianda",
                    "type": "meinianda",
                    "display_name": "Meinianda",
                    "auth": {"api_key": "offline-meinianda"},
                },
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
    assert len(settings.queryable_accounts) == 5

    def respond(request: httpx.Request) -> httpx.Response:
        if request.url.host in {"grsaiapi.com", "api.grsai.com", "grsai.dakka.com.cn"}:
            return httpx.Response(200, json={"code": 0, "data": {"credits": "12"}})
        if request.url.host == "meinianda.top":
            return httpx.Response(
                200,
                json={
                    "success": True,
                    "data": {"balance": "23", "unit": "site_credit"},
                },
            )
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
                    "Data": {
                        "AvailableCashAmount": "7.50",
                        "Currency": "CNY",
                        **(
                            {}
                            if legacy_cash_only
                            else {"AvailableAmount": "-2.50", "CreditAmount": "10.00"}
                        ),
                    },
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
        "grsai",
        "meinianda",
    }
    alibaba = next(
        snapshot for snapshot in result.snapshots if snapshot.account_id == "bailian"
    )
    assert all(snapshot.error is None for snapshot in result.snapshots)
    assert all(
        snapshot.status is SnapshotStatus.AVAILABLE
        for snapshot in result.snapshots
        if snapshot is not alibaba
    )
    assert alibaba.status is (
        SnapshotStatus.PARTIAL if legacy_cash_only else SnapshotStatus.AVAILABLE
    )
    assert [item.metric for item in alibaba.balances] == [
        "AvailableCashAmount",
        "AvailableAmount",
        "CreditAmount",
    ]
    assert [item.amount for item in alibaba.balances] == [
        Decimal("7.50"),
        None if legacy_cash_only else Decimal("-2.50"),
        None if legacy_cash_only else Decimal("10.00"),
    ]
    compatible = next(
        snapshot for snapshot in result.snapshots if snapshot.account_id == "compatible"
    )
    assert compatible.balances[0].amount == Decimal("5.125")
