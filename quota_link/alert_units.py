"""Pure unit observations: no API access, persistence or threshold arithmetic."""

from __future__ import annotations

import hashlib
import json
import unicodedata
from dataclasses import dataclass, field
from decimal import Decimal
from typing import Any

from .models import SnapshotStatus


def request_identity(account: Any) -> str:
    return hashlib.sha256(
        json.dumps(
            [
                str(account.provider_type),
                dict(account.auth),
                account.endpoint,
                account.response_mapping,
                account.service_profile,
                account.balance_scope,
                account.region,
                getattr(account, "prefer_split_endpoint", False),
                account.balance_alert.metric,
            ],
            sort_keys=True,
            ensure_ascii=True,
            separators=(",", ":"),
            default=lambda value: dict(value),
        ).encode()
    ).hexdigest()


def valid_unit(value: Any) -> bool:
    return (
        isinstance(value, str)
        and 0 < len(value) <= 32
        and value.casefold() not in {"custom", "unknown"}
        and not any(
            char.isspace() or unicodedata.category(char) in {"Cc", "Cf", "Cs"}
            for char in value
        )
    )


@dataclass(frozen=True, slots=True)
class UnitChoice:
    id: str
    metric: str
    unit: str
    amount: Decimal = field(repr=False)

    def dto(self) -> dict[str, str]:
        return {"id": self.id, "metric": self.metric, "unit": self.unit}


@dataclass(frozen=True, slots=True)
class UnitObservation:
    observed_at: float
    units: tuple[str, ...]
    choices: tuple[UnitChoice, ...]
    contract_mismatch: bool = False
    too_many: bool = False


def observe_units(account: Any, snapshot: Any, now: float) -> UnitObservation | None:
    if (
        snapshot is None
        or snapshot.account_id != account.id
        or snapshot.provider_type != account.provider_type
        or snapshot.error is not None
        or snapshot.status
        not in {
            SnapshotStatus.AVAILABLE,
            SnapshotStatus.PARTIAL,
            SnapshotStatus.UNAVAILABLE,
        }
    ):
        return None
    observed_at = snapshot.fetched_at.timestamp()
    if not -5 <= now - observed_at <= 60:
        return None
    metric = account.balance_alert.metric
    contract = (
        "site_credit"
        if str(account.provider_type) == "meinianda"
        else "credit"
        if str(account.provider_type) == "grsai"
        or (
            str(account.provider_type) == "openai_compatible"
            and account.service_profile == "grsai"
        )
        else None
    )
    entries: dict[str, list[Decimal]] = {}
    for item in snapshot.balances:
        if item.metric != metric or not valid_unit(item.unit):
            continue
        amount = (
            item.remaining
            if metric == "mapped_balance" and item.remaining is not None
            else item.amount
        )
        if not isinstance(amount, Decimal) or not amount.is_finite():
            continue
        amount = Decimal(0) if amount.is_zero() else amount
        if len(amount.as_tuple().digits) + abs(amount.as_tuple().exponent) > 128:
            continue
        entries.setdefault(item.unit, []).append(amount)
    mismatch = contract is not None and any(unit != contract for unit in entries)
    if mismatch or len(entries) > 20:
        return UnitObservation(
            observed_at, tuple(sorted(entries))[:21], (), mismatch, len(entries) > 20
        )
    content = sorted(
        (unit, sorted(str(value) for value in values))
        for unit, values in entries.items()
    )
    choices = []
    for unit, values in sorted(entries.items()):
        if len(values) != 1:
            continue
        identity = [
            account.id,
            request_identity(account),
            metric,
            unit,
            observed_at,
            content,
        ]
        choice_id = hashlib.sha256(
            json.dumps(identity, ensure_ascii=True, separators=(",", ":")).encode()
        ).hexdigest()
        choices.append(UnitChoice(choice_id, metric, unit, values[0]))
    return UnitObservation(observed_at, tuple(sorted(entries)), tuple(choices))


def transition(
    binding: Any, observation: UnitObservation
) -> tuple[str, UnitChoice | None]:
    """Changed and ambiguous states are latches, never healed by a later response."""
    state, selected = binding["state"], binding["unit"]
    if state in {"changed", "ambiguous"}:
        return state, None
    if observation.contract_mismatch:
        return "changed", None
    if observation.too_many:
        return "ambiguous", None
    if not observation.units:
        return "stale", None
    matches = [choice for choice in observation.choices if choice.unit == selected]
    if binding["confirmed"] and selected:
        if len(matches) == 1:
            return "verified", matches[0]
        return ("changed" if selected not in observation.units else "ambiguous"), None
    if selected and selected not in observation.units:
        return "changed", None
    if len(observation.units) != 1 or len(observation.choices) != 1:
        return "ambiguous", None
    choice = observation.choices[0]
    if selected and choice.unit != selected:
        return "changed", None
    return "verified", choice
