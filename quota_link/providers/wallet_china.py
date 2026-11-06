"""Read-only Moonshot and StepFun wallets with explicit regional endpoints."""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from ..i18n import message
from ..models import BalanceItem, BalanceItemKind, ProviderErrorCategory, ProviderType
from ..settings import AccountSettings
from ..wallet_transport import WalletAdapter, WalletResponseError, decimal_value

_MOONSHOT_URLS = {
    "china": "https://api.moonshot.cn/v1/users/me/balance",
    "global": "https://api.moonshot.ai/v1/users/me/balance",
}
_STEPFUN_URLS = {
    "china": "https://api.stepfun.com/v1/accounts",
    "global": "https://api.stepfun.ai/v1/accounts",
}
_UNITS = {"china": "CNY", "global": "USD"}


def _request(
    account: AccountSettings, urls: Mapping[str, str]
) -> tuple[str, dict[str, str]]:
    url = urls.get(account.region)
    if url is None:
        raise ValueError("unsupported wallet region")
    return url, {}


def _moonshot(payload: Any, account: AccountSettings) -> tuple[BalanceItem, ...]:
    if not isinstance(payload, Mapping):
        raise ValueError("expected Moonshot balance object")
    code = payload.get("code")
    status = payload.get("status")
    if "error" in payload or status is False or (type(code) is int and code != 0):
        raise WalletResponseError(
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE, "business_failure"
        )
    if type(code) is not int or status is not True:
        raise ValueError("missing Moonshot success envelope")
    data = payload.get("data")
    if not isinstance(data, Mapping):
        raise ValueError("missing Moonshot balance data")
    unit = _UNITS[account.region]
    available = decimal_value(data["available_balance"])
    cash = decimal_value(data["cash_balance"])
    voucher = decimal_value(data["voucher_balance"])
    if voucher < 0:
        raise ValueError("Moonshot voucher balance cannot be negative")
    # Moonshot determines the amount usable for inference. In particular, a
    # negative cash balance is not subtracted from the reported voucher balance.
    return (
        BalanceItem(
            BalanceItemKind.QUOTA,
            amount=available,
            unit=unit,
            label=message("provider.wallet.available_balance"),
            metric="available_balance",
        ),
        BalanceItem(
            BalanceItemKind.CASH,
            amount=cash,
            unit=unit,
            label=message("provider.moonshot.cash_balance"),
        ),
        BalanceItem(
            BalanceItemKind.FREE_QUOTA,
            amount=voucher,
            unit=unit,
            label=message("provider.moonshot.voucher_balance"),
        ),
    )


def _stepfun(payload: Any, account: AccountSettings) -> tuple[BalanceItem, ...]:
    if not isinstance(payload, Mapping):
        raise ValueError("expected StepFun account object")
    if "error" in payload:
        raise WalletResponseError(
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE, "business_failure"
        )
    if payload.get("object") != "account" or payload.get("type") not in (
        "prepaid",
        "postpaid",
    ):
        raise ValueError("missing StepFun account envelope")
    unit = _UNITS[account.region]
    return (
        BalanceItem(
            BalanceItemKind.QUOTA,
            amount=decimal_value(payload["balance"]),
            unit=unit,
            label=message("provider.wallet.available_balance"),
            metric="available_balance",
        ),
        # These are cumulative amounts, so they have no remaining amount or
        # monitoring metric and do not participate in the available balance.
        BalanceItem(
            BalanceItemKind.CASH,
            total=decimal_value(payload["total_cash_balance"]),
            unit=unit,
            label=message("provider.stepfun.total_cash"),
        ),
        BalanceItem(
            BalanceItemKind.FREE_QUOTA,
            total=decimal_value(payload["total_voucher_balance"]),
            unit=unit,
            label=message("provider.stepfun.total_voucher"),
        ),
    )


ADAPTERS = {
    ProviderType.MOONSHOT: WalletAdapter(
        ProviderType.MOONSHOT,
        message("provider.moonshot.source"),
        lambda account: _request(account, _MOONSHOT_URLS),
        _moonshot,
    ),
    ProviderType.STEPFUN: WalletAdapter(
        ProviderType.STEPFUN,
        message("provider.stepfun.source"),
        lambda account: _request(account, _STEPFUN_URLS),
        _stepfun,
    ),
}
