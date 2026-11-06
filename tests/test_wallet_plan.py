import asyncio
import json
from datetime import UTC, datetime
from decimal import Decimal, localcontext
from types import SimpleNamespace

import httpx
import pytest

from quota_link.http_client import HttpProviderClient
from quota_link.i18n import render_text, use_locale
from quota_link.models import BalanceItemKind, ProviderErrorCategory, SnapshotStatus
from quota_link.providers.wallet_plan import GLM_PLAN_ADAPTER, MINIMAX_PLAN_ADAPTER

_KEY = "sk-cp-synthetic-plan-key"
_INTERVAL_RESET = 1_776_373_200_000
_WEEKLY_RESET = 1_776_614_400_000


def _query(
    payload,
    *,
    adapter=MINIMAX_PLAN_ADAPTER,
    region="china",
    key=_KEY,
    status=200,
    headers=None,
):
    requests = []

    def respond(request):
        requests.append(request)
        body = payload if isinstance(payload, bytes) else json.dumps(payload).encode()
        return httpx.Response(status, content=body, headers=headers)

    async def run():
        account = SimpleNamespace(
            id="synthetic",
            display_name="Synthetic",
            auth={"api_key": key},
            region=region,
            endpoint={"url": "https://unrelated.invalid/quotas"},
            timeout_seconds=2.0,
        )
        client = HttpProviderClient(
            client=httpx.AsyncClient(transport=httpx.MockTransport(respond)),
            retry_delay=0,
        )
        try:
            return await adapter.fetch_balance(account, client)
        finally:
            await client.close()

    return asyncio.run(run()), requests


@pytest.mark.parametrize(
    ("region", "host"), [("china", "www.minimax.cn"), ("global", "www.minimax.io")]
)
def test_official_request_and_quota_windows_keep_counts_percentages_and_boost_separate(
    region, host
):
    # New API variant uses *_usage_count as consumed in the short window;
    # the same wire field uses legacy remaining semantics in the weekly window.
    snapshot, requests = _query(
        {
            "base_resp": {"status_code": 0},
            "model_remains": [
                {
                    "model_name": "general",
                    "current_interval_total_count": 1000,
                    "current_interval_usage_count": 150,
                    "current_interval_remaining_percent": 85,
                    "end_time": _INTERVAL_RESET,
                    "current_weekly_total_count": 8000,
                    "current_weekly_usage_count": 2000,
                    "current_weekly_remaining_percent": 25,
                    "weekly_end_time": _WEEKLY_RESET,
                    "weekly_boost_permille": 1500,
                }
            ],
        },
        region=region,
    )
    assert len(requests) == 1
    request = requests[0]
    assert request.method == "GET"
    assert str(request.url) == f"https://{host}/v1/token_plan/remains"
    assert request.headers["Authorization"] == f"Bearer {_KEY}"
    assert request.headers["Content-Type"] == "application/json"
    assert request.content == b""
    assert set(request.extensions["timeout"].values()) == {2.0}
    assert snapshot.status is SnapshotStatus.AVAILABLE
    assert snapshot.error is None and _KEY not in repr(snapshot)
    assert all(item.kind is BalanceItemKind.SUBSCRIPTION for item in snapshot.balances)
    assert [
        (item.unit, item.total, item.remaining, item.used, item.amount)
        for item in snapshot.balances
    ] == [
        ("plan_count", Decimal(1000), Decimal(850), Decimal(150), None),
        ("%", None, Decimal(85), None, None),
        ("plan_count", Decimal(8000), Decimal(2000), Decimal(6000), None),
        ("%", None, Decimal(25), None, None),
        ("‰", None, None, None, Decimal(1500)),
    ]
    assert [item.expires_at for item in snapshot.balances] == [
        datetime.fromtimestamp(_INTERVAL_RESET / 1000, UTC),
        datetime.fromtimestamp(_INTERVAL_RESET / 1000, UTC),
        datetime.fromtimestamp(_WEEKLY_RESET / 1000, UTC),
        datetime.fromtimestamp(_WEEKLY_RESET / 1000, UTC),
        None,
    ]


def test_legacy_counts_work_without_synthesizing_percentage_and_omit_disagreement():
    with localcontext() as context:
        context.prec = 5
        snapshot, _ = _query(
            {
                "model_remains": [
                    {
                        "model_name": "MiniMax-M3",
                        "current_interval_total_count": 1_000_001,
                        "current_interval_usage_count": 100_001,
                        "current_weekly_total_count": 100,
                        "current_weekly_usage_count": 45,
                        "current_weekly_remaining_percent": 21.5,
                    }
                ]
            }
        )
    assert snapshot.error is None
    short, week = snapshot.balances
    assert (short.unit, short.remaining, short.used) == (
        "plan_count",
        Decimal(100_001),
        Decimal(900_000),
    )
    assert (week.unit, week.remaining, week.total, week.used) == (
        "%",
        Decimal("21.5"),
        None,
        None,
    )


def test_unlimited_exhausted_and_unavailable_have_distinct_non_synthetic_values():
    snapshot, _ = _query(
        {
            "model_remains": [
                {
                    "model_name": "general",
                    "current_interval_status": 2,
                    "current_interval_total_count": 1000,
                    "current_interval_remaining_percent": 0,
                    "current_weekly_status": 3,
                    "weekly_end_time": 0,
                },
                {
                    "model_name": "video",
                    "current_interval_total_count": 0,
                    "current_weekly_total_count": 0,
                    "current_interval_status": 3,
                    "current_weekly_status": 3,
                    "end_time": 0,
                },
            ]
        }
    )
    exhausted, unlimited, short_excluded, weekly_excluded = snapshot.balances
    assert exhausted.remaining == 0
    for item in (unlimited, short_excluded, weekly_excluded):
        assert item.amount is item.total is item.remaining is item.used is None
        assert item.expires_at is None
    with use_locale("en-US"):
        assert "exhausted" in render_text(exhausted.label)
        assert "unlimited" in render_text(unlimited.label)
        assert "excluded from plan" in render_text(short_excluded.label)
        assert "excluded from plan" in render_text(weekly_excluded.label)


def test_unfamiliar_upstream_model_name_is_never_reflected():
    snapshot, _ = _query(
        {
            "model_remains": [
                {"model_name": _KEY, "current_interval_remaining_percent": 40}
            ]
        }
    )
    assert snapshot.error is None
    assert _KEY not in repr(snapshot)
    with use_locale("en-US"):
        assert "Resource group 1" in render_text(snapshot.balances[0].label)


@pytest.mark.parametrize(
    ("payload", "status", "expected", "retry"),
    [
        (
            {"base_resp": {"status_code": 1004, "status_msg": _KEY}},
            200,
            "authentication",
            None,
        ),
        (
            {"base_resp": {"status_code": 1001, "status_msg": _KEY}},
            200,
            "temporarily_unavailable",
            None,
        ),
        (
            {"base_resp": {"status_code": 1028, "status_msg": _KEY}},
            200,
            "temporarily_unavailable",
            None,
        ),
        (
            {"base_resp": {"status_code": 2061, "status_msg": _KEY}},
            200,
            "permission",
            None,
        ),
        ({"error": _KEY}, 429, "rate_limited", 42),
        ({"error": _KEY}, 403, "permission", None),
        ({"base_resp": {"status_code": True}}, 200, "parse", None),
        ({"model_remains": []}, 200, "parse", None),
        (
            {
                "model_remains": [
                    {
                        "model_name": "general",
                        "current_interval_remaining_percent": True,
                    }
                ]
            },
            200,
            "parse",
            None,
        ),
        (
            {
                "model_remains": [
                    {"model_name": "general", "current_interval_remaining_percent": 101}
                ]
            },
            200,
            "parse",
            None,
        ),
        (b"<html>unrelated provider page</html>", 200, "parse", None),
    ],
)
def test_http_and_business_failures_never_expose_secrets_or_return_zero(
    payload, status, expected, retry
):
    headers = None if retry is None else {"Retry-After": str(retry)}
    snapshot, requests = _query(payload, status=status, headers=headers)
    assert len(requests) == 1
    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert not snapshot.balances
    assert snapshot.error.category is ProviderErrorCategory(expected)
    assert snapshot.error.retry_after_seconds == retry
    assert _KEY not in repr(snapshot)


@pytest.mark.parametrize(
    ("region", "key"),
    [("unknown", _KEY), ("china", "sk-api-synthetic-payg-key")],
)
def test_invalid_region_or_paygo_key_never_leaves_local_configuration(region, key):
    snapshot, requests = _query({}, region=region, key=key)
    assert not requests
    assert snapshot.error.category is ProviderErrorCategory.CONFIGURATION
    assert key not in repr(snapshot)


_GLM_KEY = "synthetic-glm-plan-id.secret"


@pytest.mark.parametrize(
    ("region", "host"), [("china", "open.bigmodel.cn"), ("global", "api.z.ai")]
)
def test_glm_plan_matches_official_raw_authorization_and_preserves_window_types(
    region, host
):
    snapshot, requests = _query(
        {
            "code": 200,
            "success": True,
            "data": {
                "limits": [
                    {
                        "type": "CREDIT_LIMIT",
                        "unit": 3,
                        "number": 5,
                        "percentage": 7.25,
                        "nextResetTime": _INTERVAL_RESET,
                    },
                    {
                        "type": "TOKENS_LIMIT",
                        "unit": 6,
                        "number": 1,
                        "percentage": 99,
                        "nextResetTime": _WEEKLY_RESET,
                    },
                    {
                        "type": "TIME_LIMIT",
                        "unit": 5,
                        "number": 1,
                        "percentage": 0,
                        "currentValue": 0,
                        "usage": 250,
                        "nextResetTime": 0,
                    },
                ]
            },
        },
        adapter=GLM_PLAN_ADAPTER,
        key=_GLM_KEY,
        region=region,
    )
    assert len(requests) == 1
    request = requests[0]
    assert request.method == "GET"
    assert str(request.url) == f"https://{host}/api/monitor/usage/quota/limit"
    assert request.headers["Authorization"] == _GLM_KEY
    assert request.headers["Accept-Language"] == "en-US,en"
    assert request.headers["Content-Type"] == "application/json"
    assert request.content == b""
    assert snapshot.error is None
    assert [
        (item.kind, item.unit, item.total, item.remaining, item.used, item.amount)
        for item in snapshot.balances
    ] == [
        (
            BalanceItemKind.SUBSCRIPTION,
            "%",
            100,
            Decimal("92.75"),
            Decimal("7.25"),
            None,
        ),
        (BalanceItemKind.SUBSCRIPTION, "%", 100, 1, 99, None),
        (BalanceItemKind.SUBSCRIPTION, "%", 100, 100, 0, None),
    ]
    with use_locale("en-US"):
        assert [render_text(item.label) for item in snapshot.balances] == [
            "Credit usage · 5-hour window",
            "Token usage · Weekly window",
            "MCP usage · Monthly window",
        ]
    assert [item.expires_at for item in snapshot.balances] == [
        datetime.fromtimestamp(_INTERVAL_RESET / 1000, UTC),
        datetime.fromtimestamp(_WEEKLY_RESET / 1000, UTC),
        None,
    ]


def test_glm_absent_windows_or_percentages_do_not_become_free_or_unlimited():
    snapshot, _ = _query(
        {
            "success": True,
            "data": {
                "limits": [
                    {"type": "TOKENS_LIMIT", "unit": 3, "number": 5, "percentage": 30},
                    {"type": "TIME_LIMIT", "currentValue": 0, "usage": 250},
                    {"type": _GLM_KEY, "percentage": 0},
                ]
            },
        },
        adapter=GLM_PLAN_ADAPTER,
        key=_GLM_KEY,
    )
    assert len(snapshot.balances) == 1
    assert snapshot.balances[0].remaining == 70
    assert _GLM_KEY not in repr(snapshot)


@pytest.mark.parametrize(
    ("payload", "status", "category", "retry"),
    [
        ({"code": 401, "msg": _GLM_KEY}, 200, "authentication", None),
        ({"code": "403", "msg": _GLM_KEY}, 200, "permission", None),
        ({"code": 429, "success": False, "msg": _GLM_KEY}, 200, "rate_limited", 30),
        (
            {"code": 200, "success": False, "msg": _GLM_KEY},
            200,
            "temporarily_unavailable",
            None,
        ),
        ({"code": True}, 200, "parse", None),
        ({"data": {"limits": []}}, 200, "parse", None),
        (
            {"success": True, "data": {"limits": [{"type": "TIME_LIMIT"}]}},
            200,
            "parse",
            None,
        ),
        (
            {
                "success": True,
                "data": {"limits": [{"type": "TIME_LIMIT", "percentage": -1}]},
            },
            200,
            "parse",
            None,
        ),
        ({"error": _GLM_KEY}, 401, "authentication", None),
        ({"error": _GLM_KEY}, 429, "rate_limited", 15),
    ],
)
def test_glm_failures_are_sanitized_without_auth_or_region_fallback(
    payload, status, category, retry
):
    snapshot, requests = _query(
        payload,
        adapter=GLM_PLAN_ADAPTER,
        key=_GLM_KEY,
        status=status,
        headers=None if retry is None else {"Retry-After": str(retry)},
    )
    assert len(requests) == 1
    assert snapshot.status is SnapshotStatus.UNAVAILABLE
    assert not snapshot.balances
    assert snapshot.error.category is ProviderErrorCategory(category)
    assert snapshot.error.retry_after_seconds == retry
    assert _GLM_KEY not in repr(snapshot)
