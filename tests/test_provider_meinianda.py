import asyncio
import json
from decimal import Decimal
from pathlib import Path

import httpx
import pytest

from quota_link.cache import BalanceCache
from quota_link.capabilities import describe_capabilities
from quota_link.formatter import format_result
from quota_link.http_client import HttpProviderClient, HttpRequestError
from quota_link.intent import parse_command, parse_natural_language
from quota_link.models import (
    BalanceItemKind,
    ProviderErrorCategory,
    ProviderType,
    QueryRequest,
    QueryRequestKind,
    SnapshotStatus,
)
from quota_link.providers import IMPLEMENTED_ADAPTERS
from quota_link.providers.meinianda import MeiniandaAdapter
from quota_link.service import QueryService
from quota_link.settings import load_settings
from quota_link.tool_facts import serialize_query_result

FIXTURE = Path(__file__).parent / "fixtures" / "meinianda" / "balance_success.json"
ACCOUNT = {
    "id": "meinianda-main",
    "type": "meinianda",
    "display_name": "Meinianda 主账户",
    "auth": {"api_key": "test-secret"},
    "timeout_seconds": 3.0,
}


def _fetch(payload=None, *, status=200, raw=None, error=None, account=None):
    calls = []

    def handler(request):
        calls.append(request)
        if error is not None:
            raise error
        if raw is not None:
            return httpx.Response(status, content=raw)
        return httpx.Response(status, json=payload)

    async def run():
        settings = load_settings({"providers": [account or ACCOUNT]}, environ={})
        client = HttpProviderClient(
            client=httpx.AsyncClient(transport=httpx.MockTransport(handler)),
            retry_delay=0,
        )
        try:
            return await MeiniandaAdapter().fetch_balance(settings.accounts[0], client)
        finally:
            await client.close()

    return asyncio.run(run()), calls


def test_documented_response_uses_fixed_read_only_endpoint_and_preserves_unit():
    # A stale configurable endpoint cannot redirect the API Key.
    account = {**ACCOUNT, "endpoint": {"url": "https://other.invalid/balance"}}
    snapshot, calls = _fetch(raw=FIXTURE.read_bytes(), account=account)

    assert len(calls) == 1
    request = calls[0]
    assert request.method == "GET"
    assert str(request.url) == "https://meinianda.top/api/balance"
    assert request.headers["Authorization"] == "Bearer test-secret"
    assert request.content == b""
    assert all(value == 3.0 for value in request.extensions["timeout"].values())
    assert snapshot.provider_type is ProviderType.MEINIANDA
    assert snapshot.status is SnapshotStatus.AVAILABLE
    assert snapshot.error is None
    assert snapshot.balances[0].kind is BalanceItemKind.CREDITS
    assert snapshot.balances[0].amount == Decimal("12.5")
    assert snapshot.balances[0].unit == "site_credit"
    assert snapshot.balances[0].label == "账户站内额度"
    assert "不是 API Key 限额" in snapshot.balances[0].raw_semantics
    assert "test-secret" not in repr(snapshot)


@pytest.mark.parametrize("balance", ["0", 0, "-1.25", "12.3400"])
def test_finite_balances_keep_zero_sign_and_precision(balance):
    snapshot, _ = _fetch(
        {"success": True, "data": {"balance": balance, "unit": "site_credit"}}
    )
    assert snapshot.error is None
    assert str(snapshot.balances[0].amount) == str(Decimal(str(balance)))


def test_json_fraction_is_decoded_without_float_rounding():
    snapshot, _ = _fetch(
        raw=b'{"success":true,"data":{"balance":12.34567890123456789,"unit":"site_credit"}}'
    )
    assert snapshot.balances[0].amount == Decimal("12.34567890123456789")


@pytest.mark.parametrize("auth", [{}, {"api_key": " "}, {"token": "wrong-field"}])
def test_missing_api_key_never_sends_a_request(auth):
    snapshot, calls = _fetch(account={**ACCOUNT, "display_name": "账户", "auth": auth})
    assert calls == []
    assert snapshot.error.category is ProviderErrorCategory.CONFIGURATION
    assert snapshot.error.diagnostic_code == "missing_api_key"


@pytest.mark.parametrize(
    "environ,queryable", [({}, False), ({"SITE_KEY": "env-secret"}, True)]
)
def test_environment_key_controls_queryability_and_capabilities(environ, queryable):
    settings = load_settings(
        {"providers": [{**ACCOUNT, "auth": {"api_key": "${SITE_KEY}"}}]},
        environ=environ,
    )
    assert settings.accounts[0].queryable is queryable
    assert settings.accounts[0].cache_ttl_seconds == 60
    capability = describe_capabilities(settings.directory)[0]
    assert capability["queryable"] is queryable
    assert capability["balance_scope"] == "account"
    assert "env-secret" not in repr(capability)
    if not queryable:
        assert settings.accounts[0].unavailable_reason == "missing_environment_variable"


@pytest.mark.parametrize(
    "payload",
    [
        None,
        [],
        {},
        {"success": "true"},
        {"success": 1, "data": {"balance": 12, "unit": "site_credit"}},
        {"success": True},
        {"success": True, "data": []},
        {"success": True, "data": {"balance": 12}},
        {"success": True, "data": {"balance": 12, "unit": "CNY"}},
        {"success": True, "data": {"unit": "site_credit"}},
        *(
            {"success": True, "data": {"balance": value, "unit": "site_credit"}}
            for value in [None, True, False, "NaN", "Infinity", "", {}, []]
        ),
    ],
)
def test_malformed_success_never_becomes_zero_or_another_unit(payload):
    snapshot, _ = _fetch(payload)
    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert snapshot.balances == ()
    assert snapshot.error.category is ProviderErrorCategory.PARSE


def test_business_failure_does_not_expose_messages_or_report_a_balance():
    snapshot, calls = _fetch(
        {
            "success": False,
            "message": "test-secret private account details",
            "data": {"balance": 12.5, "unit": "site_credit"},
        }
    )
    assert len(calls) == 1
    assert snapshot.balances == ()
    assert snapshot.error.diagnostic_code == "business_failure"
    assert "test-secret" not in repr(snapshot)
    assert "private account details" not in repr(snapshot)


@pytest.mark.parametrize(
    "status,category",
    [
        (401, ProviderErrorCategory.AUTHENTICATION),
        (403, ProviderErrorCategory.PERMISSION),
        (404, ProviderErrorCategory.ENDPOINT),
        (429, ProviderErrorCategory.RATE_LIMITED),
        (500, ProviderErrorCategory.TEMPORARILY_UNAVAILABLE),
        (302, ProviderErrorCategory.TEMPORARILY_UNAVAILABLE),
    ],
)
def test_http_failures_are_safe_and_only_transient_statuses_retry(status, category):
    snapshot, calls = _fetch({"message": "test-secret"}, status=status)
    assert len(calls) == (2 if status in {429, 500} else 1)
    assert snapshot.balances == ()
    assert snapshot.error.category is category
    assert snapshot.error.diagnostic_code == f"http_{status}"
    assert "test-secret" not in repr(snapshot)


@pytest.mark.parametrize(
    "error,category,diagnostic",
    [
        (
            httpx.ReadTimeout("test-secret"),
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
            "timeout",
        ),
        (
            httpx.ConnectError("test-secret"),
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
            "connection",
        ),
        (HttpRequestError("closed"), ProviderErrorCategory.CONFIGURATION, "closed"),
    ],
)
def test_transport_errors_are_normalized(error, category, diagnostic):
    snapshot, _ = _fetch(error=error)
    assert snapshot.error.category is category
    assert snapshot.error.diagnostic_code == diagnostic
    assert "test-secret" not in repr(snapshot)


def test_invalid_json_is_a_safe_parse_failure():
    snapshot, _ = _fetch(raw=b"not-json test-secret")
    assert snapshot.error.category is ProviderErrorCategory.PARSE
    assert "test-secret" not in repr(snapshot)


def test_provider_selection_cache_text_and_tool_facts_with_registered_adapter():
    async def run():
        settings = load_settings(
            {
                "providers": [
                    ACCOUNT,
                    {
                        "id": "other-account",
                        "type": "deepseek",
                        "display_name": "Other",
                        "auth": {"api_key": "other-secret"},
                    },
                ]
            }
        )
        calls = []

        def handler(request):
            calls.append(request)
            return httpx.Response(200, content=FIXTURE.read_bytes())

        client = HttpProviderClient(
            client=httpx.AsyncClient(transport=httpx.MockTransport(handler))
        )
        service = QueryService(settings, IMPLEMENTED_ADAPTERS, client, BalanceCache())
        try:
            for name in ("meinianda", "Meinianda", "meinianda.top"):
                parsed = parse_command(name, settings.directory)
                assert parsed.request == QueryRequest(
                    QueryRequestKind.PROVIDER, "meinianda"
                )
                result = await service.query(parsed.request)
                assert [s.account_id for s in result.snapshots] == ["meinianda-main"]
            assert result.snapshots[0].cached
            assert len(calls) == 1
            natural = parse_natural_language(
                "查询 Meinianda 的余额", settings.directory
            )
            assert natural.request == parsed.request
            capability = describe_capabilities(settings.directory)[0]
            assert capability["provider"] == "Meinianda"
            assert capability["balance_scope"] == "account"
            assert capability["balance_kind"] == "账户站内额度（site_credit）"
            assert capability["queryable"] is True
            assert "账户站内额度：12.5 site_credit" in format_result(result)
            facts = json.loads(serialize_query_result(result))
            balance = facts["accounts"][0]["balances"][0]
            assert balance["unit"] == "site_credit"
            assert balance["amount"] == "12.5"
            assert "test-secret" not in repr(facts)
        finally:
            await service.close()
            await client.close()

    asyncio.run(run())
