"""Read-only API key transport shared by the documented wallet presets."""

from __future__ import annotations

import re
from collections.abc import Callable, Mapping
from datetime import UTC, datetime
from decimal import Decimal, DecimalException
from typing import TYPE_CHECKING, Any

from .http_client import (
    HttpRequestError,
    HttpResponseParseError,
    HttpStatusError,
    HttpTransportError,
)
from .i18n import message
from .models import (
    BalanceItem,
    BalanceSnapshot,
    NormalizedProviderError,
    ProviderType,
    SnapshotStatus,
)
from .models import (
    ProviderErrorCategory as Error,
)
from .provider_retry import explicit_throttling

if TYPE_CHECKING:
    from .providers.base import AsyncProviderClient

_NUMBER = re.compile(r"[+-]?[0-9]+(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\Z")
_BEARER = re.compile(r"[!-~]{1,4096}\Z")
_ERROR_MESSAGES = {
    Error.CONFIGURATION: "provider.wallet.configuration",
    Error.AUTHENTICATION: "provider.wallet.authentication",
    Error.PERMISSION: "provider.wallet.permission",
    Error.ENDPOINT: "provider.wallet.endpoint",
    Error.RATE_LIMITED: "provider.wallet.rate_limited",
    Error.TEMPORARILY_UNAVAILABLE: "provider.wallet.unavailable",
    Error.PARSE: "provider.wallet.parse",
    Error.NOT_IMPLEMENTED: "provider.wallet.unsupported",
}


def decimal_value(value: Any) -> Decimal:
    """Keep JSON decimal precision and bound downstream formatting/arithmetic."""
    if type(value) is str and len(value) <= 128 and _NUMBER.fullmatch(value):
        value = Decimal(value)
    elif type(value) is int and value.bit_length() <= 426:
        value = Decimal(value)
    if type(value) is not Decimal or not value.is_finite():
        raise ValueError("invalid numeric field")
    parts = value.as_tuple()
    if len(parts.digits) + abs(parts.exponent) > 128:
        raise ValueError("numeric field out of range")
    return value


class WalletResponseError(Exception):
    """A parser-classified failure with a fixed diagnostic code."""

    def __init__(self, category: Error, diagnostic_code: str):
        super().__init__(diagnostic_code)
        self.category = category
        self.diagnostic_code = diagnostic_code


def _status_category(status: int) -> Error:
    if status == 401:
        return Error.AUTHENTICATION
    if status == 403:
        return Error.PERMISSION
    if status == 429:
        return Error.RATE_LIMITED
    if status in {402, 408, 425} or 500 <= status <= 599:
        return Error.TEMPORARILY_UNAVAILABLE
    return Error.ENDPOINT


class WalletAdapter:
    def __init__(
        self,
        provider_type: ProviderType,
        source: str,
        request: Callable[[Any], tuple[str, dict[str, str]]],
        parse: Callable[[Any, Any], tuple[BalanceItem, ...]],
        *,
        bearer: bool = True,
    ) -> None:
        self.provider_type = provider_type
        self.source = source
        self.request = request
        self.parse = parse
        self.bearer = bearer

    async def fetch_balance(
        self, account: Any, client: AsyncProviderClient
    ) -> BalanceSnapshot:
        def snapshot(balances=(), error=None):
            return BalanceSnapshot(
                account.id,
                self.provider_type,
                account.display_name,
                SnapshotStatus.AVAILABLE
                if error is None
                else SnapshotStatus.UNAVAILABLE,
                balances,
                self.source,
                datetime.now(UTC),
                error=error,
            )

        def failed(category, code, retry_after=None):
            return snapshot(
                error=NormalizedProviderError(
                    category, message(_ERROR_MESSAGES[category]), code, retry_after
                )
            )

        auth = account.auth
        key = auth.get("api_key") if isinstance(auth, Mapping) else None
        if not isinstance(key, str) or not _BEARER.fullmatch(key.strip()):
            return failed(Error.CONFIGURATION, "invalid_api_key")
        try:
            url, headers = self.request(account)
        except WalletResponseError as error:
            return failed(error.category, error.diagnostic_code)
        except (TypeError, ValueError, KeyError):
            return failed(Error.CONFIGURATION, "invalid_wallet_endpoint")

        try:
            authorization = f"Bearer {key.strip()}" if self.bearer else key.strip()
            response = await client.request(
                "GET",
                url,
                headers={**headers, "Authorization": authorization},
                timeout=account.timeout_seconds,
            )
        except HttpStatusError as error:
            return failed(
                _status_category(error.status_code),
                f"http_{error.status_code}",
                error.retry_after_seconds,
            )
        except HttpTransportError as error:
            return failed(Error.TEMPORARILY_UNAVAILABLE, error.kind)
        except HttpRequestError as error:
            return failed(Error.CONFIGURATION, error.kind)
        except HttpResponseParseError:
            return failed(Error.PARSE, "invalid_json")

        if response.status_code != 200:
            return failed(
                _status_category(response.status_code),
                f"http_{response.status_code}",
                getattr(response, "retry_after_seconds", None),
            )
        try:
            payload = response.json()
            if error := explicit_throttling(payload, response):
                return snapshot(error=error)
            return snapshot(self.parse(payload, account))
        except WalletResponseError as error:
            return failed(
                error.category,
                error.diagnostic_code,
                getattr(response, "retry_after_seconds", None),
            )
        except HttpResponseParseError:
            return failed(Error.PARSE, "invalid_json")
        except (DecimalException, TypeError, ValueError, KeyError, OverflowError):
            return failed(Error.PARSE, "invalid_wallet_response")
