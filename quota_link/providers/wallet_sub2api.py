"""Wallet and finite key quota reads through Sub2API's documented server handler."""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from ..i18n import message
from ..models import BalanceItem, BalanceItemKind, ProviderErrorCategory, ProviderType
from ..settings import AccountSettings, gateway_origin
from ..wallet_transport import WalletAdapter, WalletResponseError, decimal_value


def _request(account: AccountSettings) -> tuple[str, dict[str, str]]:
    if not isinstance(account.endpoint, Mapping):
        raise ValueError("missing Sub2API gateway origin")
    origin = gateway_origin(account.endpoint.get("base_url"))
    return f"{origin}/v1/usage", {}


def _parse(payload: Any, account: AccountSettings) -> tuple[BalanceItem, ...]:
    if not isinstance(payload, Mapping):
        raise ValueError("expected Sub2API usage object")
    if payload.get("isValid") is False:
        raise WalletResponseError(
            ProviderErrorCategory.AUTHENTICATION, "invalid_gateway_key"
        )
    if payload.get("isValid") is not True or "error" in payload:
        raise ValueError("missing Sub2API key validity")
    mode = payload.get("mode")
    if mode == "unrestricted":
        return (_wallet_balance(payload),)
    if mode == "quota_limited":
        return (_finite_key_quota(payload),)
    raise ValueError("unknown Sub2API usage mode")


def _wallet_balance(payload: Mapping[str, Any]) -> BalanceItem:
    if payload.get("subscription") is not None or (
        "balance" not in payload and isinstance(payload.get("planName"), str)
    ):
        # The subscription branch may omit the subscription object if there is
        # no subscription in request context. Its remaining is never a wallet.
        raise WalletResponseError(
            ProviderErrorCategory.NOT_IMPLEMENTED, "sub2api_subscription_unsupported"
        )
    if payload.get("unit") != "USD":
        raise ValueError("unsupported Sub2API wallet unit")
    balance = decimal_value(payload["balance"])
    if "remaining" in payload and decimal_value(payload["remaining"]) != balance:
        raise ValueError("conflicting Sub2API wallet amounts")
    return BalanceItem(
        BalanceItemKind.CASH,
        amount=balance,
        unit="USD",
        label=message("provider.sub2api.wallet_balance"),
    )


def _finite_key_quota(payload: Mapping[str, Any]) -> BalanceItem:
    quota = payload.get("quota")
    if quota is None and "balance" not in payload and "remaining" not in payload:
        raise WalletResponseError(
            ProviderErrorCategory.NOT_IMPLEMENTED, "sub2api_rate_windows_unsupported"
        )
    if (
        not isinstance(quota, Mapping)
        or quota.get("unit") != "USD"
        or payload.get("unit", "USD") != "USD"
        or "balance" in payload
        or payload.get("subscription") is not None
    ):
        raise ValueError("missing or inconsistent Sub2API key quota")
    limit = decimal_value(quota["limit"])
    used = decimal_value(quota["used"])
    remaining = decimal_value(quota["remaining"])
    if limit <= 0 or used < 0 or not 0 <= remaining <= limit:
        raise ValueError("invalid Sub2API key quota")
    if "remaining" in payload and decimal_value(payload["remaining"]) != remaining:
        raise ValueError("conflicting Sub2API key quota amounts")
    return BalanceItem(
        BalanceItemKind.QUOTA,
        unit="USD",
        total=limit,
        used=used,
        remaining=remaining,
        label=message("provider.sub2api.key_quota"),
    )


SUB2API_ADAPTER = WalletAdapter(
    ProviderType.SUB2API, message("provider.sub2api.source"), _request, _parse
)
