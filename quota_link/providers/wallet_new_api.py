"""New API read-only token usage, preserving the site's raw quota points."""

from collections.abc import Mapping
from datetime import UTC, datetime, timedelta

from ..i18n import message
from ..models import BalanceItem, BalanceItemKind, ProviderErrorCategory, ProviderType
from ..settings import gateway_origin
from ..wallet_transport import WalletAdapter, WalletResponseError, decimal_value

_UNIT = "quota_points"


def _request(account):
    origin = gateway_origin(
        account.endpoint.get("base_url") if account.endpoint else None
    )
    return f"{origin}/api/usage/token/", {}


def _points(value):
    if type(value) is not int:
        raise ValueError("invalid quota point count")
    return decimal_value(value)


def _parse(payload, _account):
    if not isinstance(payload, Mapping):
        raise ValueError("invalid token usage envelope")
    if payload.get("code") is False or payload.get("success") is False:
        raise WalletResponseError(
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE, "new_api_business_failure"
        )
    if payload.get("code") is not True:
        raise ValueError("invalid token usage envelope")
    data = payload["data"]
    if (
        not isinstance(data, Mapping)
        or data.get("object") != "token_usage"
        or type(data.get("unlimited_quota")) is not bool
    ):
        raise ValueError("invalid token usage object")
    used = _points(data["total_used"])
    remaining = _points(data["total_available"])
    expiration = data["expires_at"]
    if type(expiration) is not int or expiration < 0:
        raise ValueError("invalid token expiry")
    expires_at = (
        datetime(1970, 1, 1, tzinfo=UTC) + timedelta(seconds=expiration)
        if expiration
        else None
    )
    unlimited = data["unlimited_quota"]
    items = [
        BalanceItem(
            BalanceItemKind.QUOTA,
            None if unlimited else remaining,
            unit=_UNIT,
            used=used,
            expires_at=expires_at,
            label=message(
                "provider.new_api.unlimited"
                if unlimited
                else "provider.new_api.key_quota"
            ),
        )
    ]
    if "user_quota" in data:
        user = data["user_quota"]
        if not isinstance(user, Mapping):
            raise ValueError("invalid user quota object")
        available = _points(user["total_available"])
        items.append(
            BalanceItem(
                BalanceItemKind.QUOTA,
                available,
                unit=_UNIT,
                used=_points(user["total_used"]),
                label=message("provider.new_api.user_quota"),
            )
        )
        items.insert(
            0,
            BalanceItem(
                BalanceItemKind.QUOTA,
                available if unlimited else min(available, remaining),
                unit=_UNIT,
                label=message("provider.new_api.effective_quota"),
            ),
        )
    return tuple(items)


NEW_API_ADAPTER = WalletAdapter(
    ProviderType.NEW_API, message("provider.new_api.source"), _request, _parse
)
