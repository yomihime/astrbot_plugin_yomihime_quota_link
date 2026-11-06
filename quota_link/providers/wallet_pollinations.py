"""Pollinations account wallet, excluding the calling key's budget."""

from collections.abc import Mapping
from decimal import Decimal

from ..i18n import message
from ..models import BalanceItem, BalanceItemKind, ProviderErrorCategory, ProviderType
from ..wallet_transport import WalletAdapter, WalletResponseError, decimal_value

_URL = "https://gen.pollinations.ai/account/balance"


def _request(_account):
    return _URL, {"Accept": "application/json"}


def _number(value):
    if type(value) not in {int, Decimal}:
        raise ValueError("invalid Pollinations amount")
    return decimal_value(value)


def _item(wallet, field, label, metric, kind):
    amount = _number(wallet[field])
    if amount < 0:
        raise ValueError("negative Pollinations account bucket")
    return BalanceItem(
        kind, amount=amount, unit="Pollen", label=message(label), metric=metric
    )


def _parse(payload, _account):
    if not isinstance(payload, Mapping) or payload.get("error") is not None:
        raise ValueError("invalid Pollinations payload")
    _number(payload["balance"])
    if "accountBalance" not in payload:
        # An authorized budget-only key can read its own number but not the wallet.
        raise WalletResponseError(
            ProviderErrorCategory.PERMISSION, "pollinations_account_usage_required"
        )
    wallet = payload["accountBalance"]
    if not isinstance(wallet, Mapping):
        raise ValueError("invalid Pollinations account wallet")
    items = [
        _item(
            wallet,
            "total",
            "provider.pollinations.total",
            "available_balance",
            BalanceItemKind.CREDITS,
        ),
        _item(
            wallet,
            "tier",
            "provider.pollinations.quest",
            "quest_pollen",
            BalanceItemKind.FREE_QUOTA,
        ),
        _item(
            wallet,
            "paid",
            "provider.pollinations.paid",
            "paid_pollen",
            BalanceItemKind.CREDITS,
        ),
    ]
    if "heldTier" in wallet:
        items.append(
            _item(
                wallet,
                "heldTier",
                "provider.pollinations.held",
                "held_quest_pollen",
                BalanceItemKind.FREE_QUOTA,
            )
        )
    return tuple(items)


POLLINATIONS_ADAPTER = WalletAdapter(
    ProviderType.POLLINATIONS,
    message("provider.pollinations.source"),
    _request,
    _parse,
)
