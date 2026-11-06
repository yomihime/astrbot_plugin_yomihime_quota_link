"""Meinianda's read-only account site-credit balance adapter."""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import replace
from datetime import UTC, datetime
from decimal import Decimal, InvalidOperation
from typing import Any

from ..http_client import (
    HttpRequestError,
    HttpResponseParseError,
    HttpStatusError,
    HttpTransportError,
)
from ..i18n import message as localized_message
from ..models import (
    BalanceItem,
    BalanceItemKind,
    BalanceSnapshot,
    NormalizedProviderError,
    ProviderErrorCategory,
    ProviderType,
    SnapshotStatus,
)
from ..provider_retry import explicit_throttling
from ..settings import AccountSettings
from .base import AsyncProviderClient

_BALANCE_URL = "https://meinianda.top/api/balance"
_SOURCE = localized_message("provider.meinianda.source")


class MeiniandaAdapter:
    """Query the account balance using an API Key, preserving site_credit units."""

    async def fetch_balance(
        self, account: AccountSettings, client: AsyncProviderClient
    ) -> BalanceSnapshot:
        api_key = account.auth.get("api_key")
        if not isinstance(api_key, str) or not api_key.strip():
            return _failure(
                account,
                ProviderErrorCategory.CONFIGURATION,
                localized_message("provider.meinianda.missing_key"),
                "missing_api_key",
            )
        try:
            response = await client.request(
                "GET",
                _BALANCE_URL,
                headers={"Authorization": f"Bearer {api_key.strip()}"},
                timeout=account.timeout_seconds,
            )
        except HttpStatusError as exc:
            snapshot = _http_failure(account, exc.status_code)
            return replace(
                snapshot,
                error=replace(
                    snapshot.error, retry_after_seconds=exc.retry_after_seconds
                ),
            )
        except HttpTransportError as exc:
            return _failure(
                account,
                ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                localized_message("provider.meinianda.timeout")
                if exc.kind == "timeout"
                else localized_message("provider.meinianda.connection"),
                exc.kind,
            )
        except HttpResponseParseError:
            return _parse_failure(account, "invalid_json")
        except HttpRequestError as exc:
            return _failure(
                account,
                ProviderErrorCategory.CONFIGURATION,
                localized_message("provider.meinianda.invalid_request"),
                exc.kind,
            )
        if response.status_code != 200:
            return _http_failure(account, response.status_code)

        try:
            payload = response.json()
            if error := explicit_throttling(payload, response):
                return replace(
                    _failure(
                        account,
                        error.category,
                        error.safe_message,
                        error.diagnostic_code,
                    ),
                    error=error,
                )
            if isinstance(payload, Mapping) and payload.get("success") is False:
                # No documented business error codes: do not infer credentials
                # or permissions from the provider's free-form message.
                return _failure(
                    account,
                    ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                    localized_message("provider.meinianda.query_failed"),
                    "business_failure",
                )
            amount = _parse_balance(payload)
        except (
            HttpResponseParseError,
            KeyError,
            TypeError,
            ValueError,
            InvalidOperation,
            OverflowError,
        ):
            return _parse_failure(account, "invalid_balance_response")

        return BalanceSnapshot(
            account_id=account.id,
            provider_type=ProviderType.MEINIANDA,
            display_name=account.display_name,
            status=SnapshotStatus.AVAILABLE,
            balances=(
                BalanceItem(
                    kind=BalanceItemKind.CREDITS,
                    amount=amount,
                    unit="site_credit",
                    label=localized_message("provider.meinianda.site_credit"),
                    metric="site_credit",
                    raw_semantics=localized_message(
                        "provider.meinianda.site_credit_note"
                    ),
                ),
            ),
            source=_SOURCE,
            fetched_at=datetime.now(UTC),
        )


def _parse_balance(payload: Any) -> Decimal:
    if not isinstance(payload, Mapping) or payload.get("success") is not True:
        raise ValueError("missing business success")
    data = payload.get("data")
    if not isinstance(data, Mapping) or data.get("unit") != "site_credit":
        raise ValueError("missing balance data or unsupported unit")
    value = data.get("balance")
    # HttpProviderClient decodes JSON fractions directly as Decimal.
    if isinstance(value, bool) or not isinstance(value, (str, int, Decimal)):
        raise TypeError("balance must preserve decimal precision")
    amount = Decimal(value)
    if not amount.is_finite():
        raise ValueError("balance must be finite")
    return amount


def _http_failure(account: AccountSettings, status_code: int) -> BalanceSnapshot:
    category, message = {
        401: (
            ProviderErrorCategory.AUTHENTICATION,
            localized_message("provider.meinianda.authentication"),
        ),
        403: (
            ProviderErrorCategory.PERMISSION,
            localized_message("provider.meinianda.permission"),
        ),
        429: (
            ProviderErrorCategory.RATE_LIMITED,
            localized_message("provider.meinianda.rate_limited"),
        ),
    }.get(
        status_code,
        (
            ProviderErrorCategory.ENDPOINT
            if 400 <= status_code < 500
            else ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
            localized_message("provider.meinianda.unavailable"),
        ),
    )
    return _failure(account, category, message, f"http_{status_code}")


def _parse_failure(account: AccountSettings, diagnostic: str) -> BalanceSnapshot:
    return _failure(
        account,
        ProviderErrorCategory.PARSE,
        localized_message("provider.meinianda.invalid_response"),
        diagnostic,
    )


def _failure(
    account: AccountSettings,
    category: ProviderErrorCategory,
    message: str,
    diagnostic: str,
) -> BalanceSnapshot:
    return BalanceSnapshot(
        account_id=account.id,
        provider_type=ProviderType.MEINIANDA,
        display_name=account.display_name,
        status=SnapshotStatus.UNAVAILABLE,
        balances=(),
        source=_SOURCE,
        fetched_at=datetime.now(UTC),
        error=NormalizedProviderError(category, message, diagnostic),
    )
