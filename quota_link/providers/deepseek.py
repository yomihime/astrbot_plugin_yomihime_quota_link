"""DeepSeek's read-only account balance adapter."""

from __future__ import annotations

from dataclasses import replace
from datetime import UTC, datetime
from decimal import Decimal, InvalidOperation
from typing import Any, Mapping

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
from .base import AsyncProviderClient

_BALANCE_URL = "https://api.deepseek.com/user/balance"
_SOURCE = localized_message("provider.deepseek.source")
_CURRENCIES = frozenset({"CNY", "USD"})
_HTTP_ERRORS: dict[int, tuple[ProviderErrorCategory, str, str]] = {
    401: (
        ProviderErrorCategory.AUTHENTICATION,
        localized_message("provider.deepseek.authentication"),
        "http_401",
    ),
    402: (
        ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
        localized_message("provider.deepseek.insufficient_balance"),
        "http_402",
    ),
    403: (
        ProviderErrorCategory.PERMISSION,
        localized_message("provider.deepseek.permission"),
        "http_403",
    ),
    429: (
        ProviderErrorCategory.RATE_LIMITED,
        localized_message("provider.deepseek.rate_limited"),
        "http_429",
    ),
}


class DeepSeekAdapter:
    """Fetch and normalize all currency balances for one DeepSeek account."""

    async def fetch_balance(
        self, account: Any, client: AsyncProviderClient
    ) -> BalanceSnapshot:
        account_id, display_name = _account_identity(account)
        api_key = _api_key(account)
        if api_key is None:
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.CONFIGURATION,
                    localized_message("provider.deepseek.missing_key"),
                    "missing_api_key",
                ),
            )
        try:
            response = await client.request(
                "GET",
                _BALANCE_URL,
                headers={"Authorization": f"Bearer {api_key}"},
                timeout=_timeout(account),
            )
        except HttpStatusError as exc:
            return _error_snapshot(
                account_id,
                display_name,
                replace(
                    _status_error(exc.status_code),
                    retry_after_seconds=exc.retry_after_seconds,
                ),
            )
        except HttpTransportError as exc:
            message = (
                localized_message("provider.deepseek.timeout")
                if exc.kind == "timeout"
                else localized_message("provider.deepseek.connection")
            )
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                    message,
                    exc.kind,
                ),
            )
        except HttpResponseParseError:
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.PARSE,
                    localized_message("provider.deepseek.invalid_response"),
                    "invalid_json",
                ),
            )
        except HttpRequestError as exc:
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.CONFIGURATION,
                    localized_message("provider.deepseek.invalid_request"),
                    exc.kind,
                ),
            )

        status_code = response.status_code
        if status_code != 200:
            return _error_snapshot(account_id, display_name, _status_error(status_code))

        try:
            payload = response.json()
            if error := explicit_throttling(payload, response):
                return _error_snapshot(account_id, display_name, error)
            balances, available = _parse_payload(payload)
        except (
            HttpResponseParseError,
            KeyError,
            TypeError,
            ValueError,
            InvalidOperation,
            OverflowError,
        ):
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.PARSE,
                    localized_message("provider.deepseek.invalid_response"),
                    "invalid_balance_response",
                ),
            )

        return BalanceSnapshot(
            account_id=account_id,
            provider_type=ProviderType.DEEPSEEK,
            display_name=display_name,
            status=(
                SnapshotStatus.AVAILABLE if available else SnapshotStatus.UNAVAILABLE
            ),
            balances=balances,
            source=_SOURCE,
            fetched_at=datetime.now(UTC),
        )


def _account_identity(account: Any) -> tuple[str, str]:
    if isinstance(account, Mapping):
        account_id = account.get("id")
        display_name = account.get("display_name")
    else:
        account_id = getattr(account, "id", None)
        display_name = getattr(account, "display_name", None)
    if not isinstance(account_id, str) or not account_id.strip():
        account_id = "unknown-account"
    if not isinstance(display_name, str) or not display_name.strip():
        display_name = "DeepSeek account"
    return account_id.strip(), display_name.strip()


def _api_key(account: Any) -> str | None:
    auth = (
        account.get("auth")
        if isinstance(account, Mapping)
        else getattr(account, "auth", None)
    )
    api_key = auth.get("api_key") if isinstance(auth, Mapping) else None
    return api_key.strip() if isinstance(api_key, str) and api_key.strip() else None


def _timeout(account: Any) -> float | None:
    value = (
        account.get("timeout_seconds")
        if isinstance(account, Mapping)
        else getattr(account, "timeout_seconds", None)
    )
    return (
        value
        if isinstance(value, (float, int)) and not isinstance(value, bool)
        else None
    )


def _parse_payload(payload: Any) -> tuple[tuple[BalanceItem, ...], bool]:
    if not isinstance(payload, Mapping):
        raise TypeError("response must be an object")
    available = payload.get("is_available")
    infos = payload.get("balance_infos")
    if type(available) is not bool or not isinstance(infos, list) or not infos:
        raise ValueError("response has no valid availability or balance list")

    items: list[BalanceItem] = []
    for info in infos:
        if not isinstance(info, Mapping):
            raise TypeError("balance row must be an object")
        currency = info.get("currency")
        if not isinstance(currency, str) or currency not in _CURRENCIES:
            raise ValueError("unsupported currency")
        total = _decimal(info.get("total_balance"))
        granted = _decimal(info.get("granted_balance"))
        topped_up = _decimal(info.get("topped_up_balance"))
        items.extend(
            (
                _balance_item(
                    currency,
                    total,
                    localized_message("provider.deepseek.total_balance"),
                    "total_balance",
                ),
                _balance_item(
                    currency,
                    granted,
                    localized_message("provider.deepseek.granted_balance"),
                    "granted_balance",
                ),
                _balance_item(
                    currency,
                    topped_up,
                    localized_message("provider.deepseek.topped_up_balance"),
                    "topped_up_balance",
                ),
            )
        )
    return tuple(items), available


def _decimal(value: Any) -> Decimal:
    if isinstance(value, bool) or isinstance(value, float):
        raise ValueError("amount must preserve decimal precision")
    if not isinstance(value, (str, int, Decimal)):
        raise TypeError("amount must be a decimal string or number")
    amount = Decimal(value)
    if not amount.is_finite() or amount < 0:
        raise ValueError("amount must be finite and non-negative")
    return amount


def _balance_item(
    currency: str, amount: Decimal, label: str, metric: str
) -> BalanceItem:
    return BalanceItem(
        kind=BalanceItemKind.CASH,
        amount=amount,
        unit=currency,
        label=label,
        metric=metric,
    )


def _status_error(status_code: int) -> NormalizedProviderError:
    known = _HTTP_ERRORS.get(status_code)
    if known is not None:
        category, message, diagnostic = known
    elif 400 <= status_code <= 499:
        category, message, diagnostic = (
            ProviderErrorCategory.ENDPOINT,
            localized_message("provider.deepseek.request_denied"),
            f"http_{status_code}",
        )
    else:
        category, message, diagnostic = (
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
            localized_message("provider.deepseek.unavailable"),
            f"http_{status_code}" if 400 <= status_code <= 599 else "http_error",
        )
    return NormalizedProviderError(category, message, diagnostic)


def _error_snapshot(
    account_id: str, display_name: str, error: NormalizedProviderError
) -> BalanceSnapshot:
    return BalanceSnapshot(
        account_id=account_id,
        provider_type=ProviderType.DEEPSEEK,
        display_name=display_name,
        status=SnapshotStatus.UNAVAILABLE,
        balances=(),
        source=_SOURCE,
        fetched_at=datetime.now(UTC),
        error=error,
    )
