"""Account and team wallets backed by documented public billing APIs."""

import re
from collections.abc import Mapping
from decimal import Decimal, localcontext

from ..i18n import message
from ..models import XAI_TEAM_ID, BalanceItem, BalanceItemKind, ProviderType
from ..wallet_transport import WalletAdapter, decimal_value

_OPENROUTER_URL = "https://openrouter.ai/api/v1/credits"
_NOVITA_URL = "https://api.novita.ai/openapi/v1/billing/balance/detail"
_VENICE_URL = "https://api.venice.ai/api/v1/billing/balance"
_VERCEL_URL = "https://ai-gateway.vercel.sh/v1/credits"


def _object(value):
    if not isinstance(value, Mapping) or value.get("error") is not None:
        raise ValueError("invalid wallet object")
    return value


def _number(value):
    if not isinstance(value, (int, Decimal)):
        raise ValueError("expected a JSON number")
    return decimal_value(value)


def _scaled_integer(value, places):
    if (
        not isinstance(value, str)
        or len(value) > 128
        or not re.fullmatch(r"-?[0-9]+", value)
    ):
        raise ValueError("expected an integer string in billing subunits")
    sign, digits, _ = decimal_value(value).as_tuple()
    return decimal_value(Decimal((sign, digits, -places)))


def _openrouter_items(payload, _account):
    data = _object(_object(payload)["data"])
    purchased = _number(data["total_credits"])
    spent = _number(data["total_usage"])
    # Match the published credit calculation without Decimal context rounding
    # or assuming the net balance cannot be negative.
    with localcontext() as context:
        smallest_exponent = min(
            purchased.as_tuple().exponent, spent.as_tuple().exponent
        )
        context.prec = (
            max(purchased.adjusted(), spent.adjusted()) - smallest_exponent + 2
        )
        remaining = decimal_value(purchased - spent)
    return (
        BalanceItem(
            BalanceItemKind.CREDITS,
            amount=remaining,
            unit="USD",
            total=purchased,
            remaining=remaining,
            used=spent,
            label=message("provider.openrouter.balance"),
            metric="available_balance",
        ),
    )


def _novita_items(payload, _account):
    data = _object(payload)
    # Novita documents pendingCharges as a placeholder that currently defaults
    # to zero. Keep it out of the snapshot rather than implying settled usage.
    return (
        BalanceItem(
            BalanceItemKind.CREDITS,
            amount=_scaled_integer(data["availableBalance"], 4),
            unit="USD",
            label=message("provider.novita.available"),
            metric="available_balance",
        ),
        BalanceItem(
            BalanceItemKind.CASH,
            amount=_scaled_integer(data["cashBalance"], 4),
            unit="USD",
            label=message("provider.novita.cash"),
            metric="cash_balance",
        ),
        BalanceItem(
            BalanceItemKind.QUOTA,
            amount=_scaled_integer(data["creditLimit"], 4),
            unit="USD",
            label=message("provider.novita.credit_limit"),
            metric="credit_limit",
        ),
        BalanceItem(
            BalanceItemKind.USAGE,
            amount=_scaled_integer(data["outstandingInvoices"], 4),
            unit="USD",
            label=message("provider.novita.outstanding"),
            metric="outstanding_invoices",
        ),
    )


def _xai_request(account):
    team_id = account.team_id
    if not isinstance(team_id, str) or not XAI_TEAM_ID.fullmatch(team_id):
        raise ValueError("invalid team ID")
    return f"https://management-api.x.ai/v1/billing/teams/{team_id}/prepaid/balance", {}


def _xai_items(payload, _account):
    usd = _scaled_integer(_object(_object(payload)["total"])["val"], 2)
    # Purchases are negative ledger entries, while posted spend is positive.
    # The signed inverse is the posted credit balance, not real-time usage.
    return (
        BalanceItem(
            BalanceItemKind.CREDITS,
            amount=usd.copy_abs() if usd.is_zero() else usd.copy_negate(),
            unit="USD",
            label=message("provider.xai.posted_balance"),
            raw_semantics=message("provider.xai.posted_note"),
            metric="posted_prepaid_balance",
        ),
    )


def _venice_items(payload, _account):
    data = _object(payload)
    consumption_currency = data["consumptionCurrency"]
    if not isinstance(data["canConsume"], bool) or (
        consumption_currency is not None and not isinstance(consumption_currency, str)
    ):
        raise ValueError("invalid Venice account status")
    balances = _object(data["balances"])
    diem_total = _number(data["diemEpochAllocation"])
    items = []
    for field, kind, unit, metric in (
        ("usd", BalanceItemKind.CASH, "USD", "available_balance"),
        ("diem", BalanceItemKind.SUBSCRIPTION, "DIEM", "diem_balance"),
        (
            "bundledCredits",
            BalanceItemKind.CREDITS,
            "BUNDLED_CREDITS",
            "bundled_credits",
        ),
        ("earnedCredits", BalanceItemKind.CREDITS, "EARNED_CREDITS", "earned_credits"),
    ):
        # Preserve null as an unreported amount. Explicit negative USD may
        # represent debt or pending holds larger than the posted balance.
        value = balances[field]
        if value is None:
            continue
        amount = _number(value)
        items.append(
            BalanceItem(
                kind,
                amount=amount,
                total=diem_total if field == "diem" else None,
                remaining=amount if field == "diem" else None,
                unit=unit,
                label=message(f"provider.venice.{metric}"),
                metric=metric,
            )
        )
    return tuple(items) or (
        BalanceItem(
            BalanceItemKind.CASH,
            unit="USD",
            label=message("provider.venice.available_balance"),
            raw_semantics=message("provider.venice.no_numeric_balance"),
            metric="available_balance",
        ),
    )


def _vercel_items(payload, _account):
    data = _object(payload)
    balance, lifetime_used = data["balance"], data["total_used"]
    if not isinstance(balance, str) or not isinstance(lifetime_used, str):
        raise ValueError("expected Vercel Gateway credit amounts as decimal strings")
    return (
        BalanceItem(
            BalanceItemKind.CREDITS,
            amount=decimal_value(balance),
            unit="USD",
            label=message("provider.vercel_gateway.balance"),
            metric="available_balance",
        ),
        BalanceItem(
            BalanceItemKind.USAGE,
            amount=decimal_value(lifetime_used),
            unit="USD",
            label=message("provider.vercel_gateway.lifetime_usage"),
            metric="lifetime_usage",
        ),
    )


ADAPTERS = {
    ProviderType.OPENROUTER: WalletAdapter(
        ProviderType.OPENROUTER,
        message("provider.openrouter.source"),
        lambda _account: (_OPENROUTER_URL, {}),
        _openrouter_items,
    ),
    ProviderType.NOVITA: WalletAdapter(
        ProviderType.NOVITA,
        message("provider.novita.source"),
        lambda _account: (_NOVITA_URL, {"Content-Type": "application/json"}),
        _novita_items,
    ),
    ProviderType.XAI: WalletAdapter(
        ProviderType.XAI, message("provider.xai.source"), _xai_request, _xai_items
    ),
    ProviderType.VENICE: WalletAdapter(
        ProviderType.VENICE,
        message("provider.venice.source"),
        lambda _account: (_VENICE_URL, {}),
        _venice_items,
    ),
    ProviderType.VERCEL_GATEWAY: WalletAdapter(
        ProviderType.VERCEL_GATEWAY,
        message("provider.vercel_gateway.source"),
        lambda _account: (_VERCEL_URL, {"Content-Type": "application/json"}),
        _vercel_items,
    ),
}
