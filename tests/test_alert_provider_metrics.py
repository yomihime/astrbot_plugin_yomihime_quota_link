"""Stable independent metrics for deterministic alert comparisons."""

import asyncio
import json
from datetime import UTC, datetime
from decimal import Decimal

import httpx
import pytest
from test_provider_alibaba_bailian import _ACCOUNT, FakeClient, FakeResponse

from quota_link.cards import build_result_card
from quota_link.formatter import format_result
from quota_link.http_client import HttpProviderClient
from quota_link.models import (
    ProviderErrorCategory,
    QueryRequest,
    QueryRequestKind,
    QueryResult,
    SnapshotStatus,
)
from quota_link.providers.alibaba_bailian import AlibabaBailianAdapter
from quota_link.providers.deepseek import DeepSeekAdapter
from quota_link.providers.meinianda import MeiniandaAdapter
from quota_link.providers.openai_compatible import OpenAICompatibleAdapter
from quota_link.settings import load_settings
from quota_link.tool_facts import serialize_query_result

METRICS = ("AvailableCashAmount", "AvailableAmount", "CreditAmount")


def bss(data):
    return asyncio.run(
        AlibabaBailianAdapter().fetch_balance(
            _ACCOUNT,
            FakeClient(
                FakeResponse(
                    {
                        "Code": "200",
                        "Success": True,
                        "Data": {"Currency": "CNY", **data},
                    }
                )
            ),
        )
    )


@pytest.mark.parametrize("present", range(1, 8))
def test_each_missing_bss_metric_stays_none_not_another_metric_or_zero(present):
    data = {
        metric: str(index + 1)
        for index, metric in enumerate(METRICS)
        if present & (1 << index)
    }
    snapshot = bss(data)
    assert snapshot.error is None
    assert snapshot.status is (
        SnapshotStatus.AVAILABLE if present == 7 else SnapshotStatus.PARTIAL
    )
    for index, item in enumerate(snapshot.balances):
        assert item.metric == METRICS[index]
        assert item.amount == (Decimal(index + 1) if present & (1 << index) else None)
    result = QueryResult(
        QueryRequest(QueryRequestKind.ALL), (snapshot,), datetime.now(UTC)
    )
    facts = json.loads(serialize_query_result(result))["accounts"][0]["balances"]
    assert [item["metric"] for item in facts] == list(METRICS)
    assert [item["amount"] for item in facts] == [
        str(index + 1) if present & (1 << index) else None for index in range(3)
    ]
    if present != 7:
        assert "未提供（单位：CNY）" in format_result(result)


@pytest.mark.parametrize("field", METRICS)
@pytest.mark.parametrize("value", ["NaN", "Infinity", "-Infinity", True, 1.25, {}, []])
def test_all_bss_metrics_reject_nonfinite_lossy_or_wrong_types(field, value):
    snapshot = bss({**dict.fromkeys(METRICS, "1"), field: value})
    assert snapshot.error.category is ProviderErrorCategory.PARSE
    assert not snapshot.balances


@pytest.mark.parametrize(
    "value", ["-8.25", "-0", "-0.00", "0.000000000000000000123456789"]
)
def test_signed_available_amount_exact_and_title_never_claims_spendability(value):
    snapshot = bss(
        {
            "AvailableCashAmount": "125.60",
            "AvailableAmount": value,
            "CreditAmount": "300.00",
        }
    )
    assert snapshot.balances[1].amount == Decimal(value)
    assert snapshot.error is None
    result = QueryResult(
        QueryRequest(QueryRequestKind.ALL), (snapshot,), datetime.now(UTC)
    )
    assert "查询成功" in format_result(result).splitlines()[3]
    heading = build_result_card(result).sections[0].heading
    assert "查询成功" in heading and "可用" not in heading
    # This is a presentation correction, not a new machine status contract.
    assert (
        json.loads(serialize_query_result(result))["accounts"][0]["status"]
        == "available"
    )


def test_null_is_unprovided_and_unrequested_metrics_never_summed():
    snapshot = bss(
        {
            "AvailableCashAmount": None,
            "AvailableAmount": "-2.35",
            "CreditAmount": "9",
            "MybankCreditAmount": "9999",
            "QuotaLimit": "8888",
        }
    )
    assert [i.amount for i in snapshot.balances] == [
        None,
        Decimal("-2.35"),
        Decimal("9"),
    ]
    assert snapshot.status is SnapshotStatus.PARTIAL
    absent = bss({"MybankCreditAmount": "9999"})
    assert absent.error.category is ProviderErrorCategory.PARSE


@pytest.mark.parametrize(
    "code",
    [
        "Throttling",
        "Throttling.User",
        "Throttling.Api",
        "Throttling.System",
        "Throttling.RateQuota",
        "Throttling.Concurrent",
    ],
)
@pytest.mark.parametrize("status", [200, 400])
def test_bss_explicit_throttling_in_http_success_or_error_is_rate_limited(code, status):
    async def run():
        calls = []

        def handler(request):
            calls.append(request)
            return httpx.Response(
                status,
                headers={"Retry-After": "125"},
                json={"Success": False, "Code": code, "Message": "secret-response"},
            )

        client = HttpProviderClient(
            client=httpx.AsyncClient(transport=httpx.MockTransport(handler))
        )
        snapshot = await AlibabaBailianAdapter().fetch_balance(_ACCOUNT, client)
        await client.close()
        assert len(calls) == 1
        return snapshot

    result = asyncio.run(run())
    assert result.error.category is ProviderErrorCategory.RATE_LIMITED
    assert result.error.retry_after_seconds == 125
    assert "secret-response" not in repr(result)


def account(kind):
    return load_settings(
        {
            "providers": [
                {
                    "id": "fake",
                    "display_name": "Synthetic",
                    "type": kind,
                    "auth": {"api_key": "synthetic-key", "token": "synthetic-token"},
                    **(
                        {
                            "endpoint": {
                                "url": "https://relay.invalid/balance",
                                "method": "GET",
                                "auth_mode": "bearer",
                            },
                            "response_mapping": {
                                "amount_path": "/balance",
                                "unit": "USD",
                            },
                        }
                        if kind == "openai_compatible"
                        else {}
                    ),
                }
            ]
        }
    ).accounts[0]


@pytest.mark.parametrize(
    "kind,adapter",
    [
        ("deepseek", DeepSeekAdapter()),
        ("grsai", OpenAICompatibleAdapter()),
        ("meinianda", MeiniandaAdapter()),
        ("openai_compatible", OpenAICompatibleAdapter()),
    ],
)
@pytest.mark.parametrize("status", [429, 503])
def test_retry_after_survives_every_adapter(kind, adapter, status):
    async def run():
        client = HttpProviderClient(
            client=httpx.AsyncClient(
                transport=httpx.MockTransport(
                    lambda request: httpx.Response(
                        status,
                        headers={"Retry-After": "301"},
                        json={"secret": "hidden"},
                    )
                )
            )
        )
        result = await adapter.fetch_balance(account(kind), client)
        await client.close()
        return result

    result = asyncio.run(run())
    assert result.error is not None and result.error.retry_after_seconds == 301
    assert "hidden" not in repr(result)


@pytest.mark.parametrize(
    "kind,adapter",
    [
        ("deepseek", DeepSeekAdapter()),
        ("grsai", OpenAICompatibleAdapter()),
        ("meinianda", MeiniandaAdapter()),
        ("openai_compatible", OpenAICompatibleAdapter()),
    ],
)
def test_explicit_business_throttling_does_not_parse_as_zero(kind, adapter):
    async def run():
        client = HttpProviderClient(
            client=httpx.AsyncClient(
                transport=httpx.MockTransport(
                    lambda request: httpx.Response(
                        200,
                        headers={"Retry-After": "70"},
                        json={"success": False, "code": "Throttling", "balance": "0"},
                    )
                )
            )
        )
        result = await adapter.fetch_balance(account(kind), client)
        await client.close()
        return result

    result = asyncio.run(run())
    assert result.error.category is ProviderErrorCategory.RATE_LIMITED
    assert result.error.retry_after_seconds == 70
    assert result.balances == ()


def test_provider_metric_names_are_stable_not_localized_label_or_order():
    async def run():
        cases = [
            (
                "deepseek",
                DeepSeekAdapter(),
                {
                    "is_available": False,
                    "balance_infos": [
                        {
                            "currency": "CNY",
                            "total_balance": "0",
                            "granted_balance": "0",
                            "topped_up_balance": "0",
                        }
                    ],
                },
                ["total_balance", "granted_balance", "topped_up_balance"],
            ),
            (
                "grsai",
                OpenAICompatibleAdapter(),
                {"code": 0, "data": {"credits": "123"}},
                ["credit"],
            ),
            (
                "meinianda",
                MeiniandaAdapter(),
                {"success": True, "data": {"unit": "site_credit", "balance": "-2.1"}},
                ["site_credit"],
            ),
            (
                "openai_compatible",
                OpenAICompatibleAdapter(),
                {"balance": "12.3"},
                ["mapped_balance"],
            ),
        ]
        for kind, adapter, payload, metrics in cases:
            client = HttpProviderClient(
                client=httpx.AsyncClient(
                    transport=httpx.MockTransport(
                        lambda request: httpx.Response(200, json=payload)
                    )
                )
            )
            result = await adapter.fetch_balance(account(kind), client)
            await client.close()
            assert result.error is None
            assert [i.metric for i in result.balances] == metrics
            if kind == "deepseek":
                assert result.status is SnapshotStatus.UNAVAILABLE

    asyncio.run(run())
