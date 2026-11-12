"""Pure, bounded alert configuration contracts; never performs I/O or delivery.

QQ mentions express user intent only. A sender must resolve the actual platform
instance and verify adapter support immediately before constructing At segments.
"""

from __future__ import annotations

import copy
import hashlib
import re
import unicodedata
from collections.abc import Mapping
from dataclasses import dataclass, field
from decimal import Decimal, localcontext
from typing import Any

from .i18n import message
from .models import WALLET_ALERT_PROVIDERS

MAX_ALERT_TARGETS = 20
MAX_ALERT_MENTIONS = 20
MAX_ALERT_ADMIN_QQ_IDS = 100
MAX_UMO_LENGTH = 512
QQ_ID = re.compile(r"[1-9][0-9]{0,19}\Z")
DECIMAL_TEXT = re.compile(r"-?(?:0|[1-9][0-9]{0,29})(?:\.[0-9]{1,18})?\Z")
MESSAGE_TYPES = frozenset({"FriendMessage", "GroupMessage", "OtherMessage"})
ALERT_METRICS = {
    "alibaba_bailian": ("AvailableAmount", "AvailableCashAmount", "CreditAmount"),
    "deepseek": ("total_balance", "granted_balance", "topped_up_balance"),
    "grsai": ("credit",),
    "meinianda": ("site_credit",),
    "openai_compatible": ("mapped_balance",),
    **{provider.value: ("available_balance",) for provider in WALLET_ALERT_PROVIDERS},
    "xai": ("posted_prepaid_balance",),
}


class AlertConfigError(ValueError):
    """Safe validation failure: messages never interpolate submitted values."""


def _has_control(value: str) -> bool:
    return any(unicodedata.category(char) in {"Cc", "Cf", "Cs"} for char in value)


def _text(value: Any, label: str, limit: int, *, token: bool = False) -> str:
    if not isinstance(value, str) or _has_control(value):
        raise AlertConfigError(message("error.alert_config.invalid_text", label=label))
    result = value.strip()
    if len(result) > limit or (token and any(c.isspace() for c in result)):
        raise AlertConfigError(
            message("error.alert_config.invalid_text_format", label=label)
        )
    return result


def _integer(value: Any, label: str, low: int, high: int) -> int:
    if type(value) is not int or not low <= value <= high:
        raise AlertConfigError(
            message("error.alert_config.integer_range", label=label, low=low, high=high)
        )
    return value


def parse_alert_decimal(
    value: Any, label: str = message("error.alert_config.label.threshold")
) -> Decimal | None:
    """Only bounded plain-decimal strings are accepted; JSON floats lose precision."""
    if value is None:
        return None
    text = _text(value, label, 50, token=True)
    if not DECIMAL_TEXT.fullmatch(text):
        raise AlertConfigError(
            message("error.alert_config.decimal_format", label=label)
        )
    number = Decimal(text)
    return Decimal(0) if number.is_zero() else number


def decimal_text(value: Decimal | None) -> str | None:
    return None if value is None else format(value, "f")


def metric_choices(provider_type: str, service_profile: str = "") -> tuple[str, ...]:
    provider = str(provider_type)
    if provider == "openai_compatible" and service_profile == "grsai":
        provider = "grsai"
    return ALERT_METRICS.get(provider, ())


@dataclass(frozen=True, slots=True, repr=False)
class BalanceAlertSettings:
    enabled: bool = False
    check_interval_minutes: int = 15
    metric: str = ""
    unit: str = ""
    threshold: Decimal | None = None
    recovery_threshold: Decimal | None = None
    repeat_minutes: int = 0

    @property
    def effective_recovery_threshold(self) -> Decimal | None:
        if self.recovery_threshold is not None or self.threshold is None:
            return self.recovery_threshold
        with localcontext() as context:
            context.prec = 100
            return self.threshold + max(
                abs(self.threshold) * Decimal("0.1"), Decimal("0.01")
            )

    def as_dict(self) -> dict[str, Any]:
        return {
            "enabled": self.enabled,
            "check_interval_minutes": self.check_interval_minutes,
            "metric": self.metric,
            "unit": self.unit,
            "threshold": decimal_text(self.threshold),
            "recovery_threshold": decimal_text(self.recovery_threshold),
            "repeat_minutes": self.repeat_minutes,
        }


@dataclass(frozen=True, slots=True)
class BalanceAlertTarget:
    umo: str = field(repr=False)
    mentions: tuple[str, ...] = field(default=(), repr=False)

    @property
    def id(self) -> str:
        return hashlib.sha256(self.umo.encode("utf-8")).hexdigest()[:12]

    def as_dict(self) -> dict[str, Any]:
        return {"umo": self.umo, "mentions": list(self.mentions)}


@dataclass(frozen=True, slots=True)
class BalanceAlertLLM:
    enabled: bool = True
    provider_id: str = field(default="", repr=False)
    persona_id: str = field(default="", repr=False)

    def as_dict(self) -> dict[str, Any]:
        return {
            "enabled": self.enabled,
            "provider_id": self.provider_id,
            "persona_id": self.persona_id,
        }


def parse_balance_alert(
    value: Any, provider_type: str, service_profile: str = ""
) -> BalanceAlertSettings:
    if not isinstance(value, Mapping):
        raise AlertConfigError(message("error.alert_config.invalid_object"))
    allowed = {
        "enabled",
        "check_interval_minutes",
        "metric",
        "unit",
        "threshold",
        "recovery_threshold",
        "repeat_minutes",
    }
    if set(value) - allowed:
        raise AlertConfigError(message("error.alert_config.unknown_fields"))
    enabled = value.get("enabled", False)
    if type(enabled) is not bool:
        raise AlertConfigError(message("error.alert_config.invalid_enabled"))
    interval = _integer(
        value.get("check_interval_minutes", 15),
        message("error.alert_config.label.check_interval"),
        1,
        4320,
    )
    repeat = _integer(
        value.get("repeat_minutes", 0),
        message("error.alert_config.label.repeat_interval"),
        0,
        4320,
    )
    choices = metric_choices(provider_type, service_profile)
    metric = _text(
        value.get("metric", ""),
        message("error.alert_config.label.metric"),
        64,
        token=True,
    )
    if not metric:
        metric = choices[0] if choices else ""
    if metric and metric not in choices:
        raise AlertConfigError(message("error.alert_config.unsupported_metric"))
    threshold = parse_alert_decimal(value.get("threshold"))
    recovery = parse_alert_decimal(
        value.get("recovery_threshold"),
        message("error.alert_config.label.recovery_threshold"),
    )
    if recovery is not None and (threshold is None or recovery <= threshold):
        raise AlertConfigError(message("error.alert_config.recovery_threshold_order"))
    return BalanceAlertSettings(
        enabled=enabled,
        check_interval_minutes=interval,
        metric=metric,
        unit=_text(
            value.get("unit", ""),
            message("error.alert_config.label.unit"),
            32,
            token=True,
        ),
        threshold=threshold,
        recovery_threshold=recovery,
        repeat_minutes=repeat,
    )


def parse_umo(value: Any) -> tuple[str, str, str]:
    umo = _text(value, "UMO", MAX_UMO_LENGTH, token=True)
    parts = umo.split(":", 2)
    if len(parts) != 3 or not all(parts) or parts[1] not in MESSAGE_TYPES:
        raise AlertConfigError(message("error.alert_config.invalid_umo"))
    return tuple(parts)


def _qq_ids(value: Any, limit: int, label: str) -> tuple[str, ...]:
    if type(value) is not list or len(value) > limit:
        raise AlertConfigError(
            message("error.alert_config.list_limit", label=label, limit=limit)
        )
    normalized = []
    for item in value:
        qq = _text(item, label, 20, token=True)
        if not QQ_ID.fullmatch(qq):
            raise AlertConfigError(
                message("error.alert_config.invalid_qq_id", label=label)
            )
        if qq not in normalized:
            normalized.append(qq)
    return tuple(normalized)


def parse_alert_targets(value: Any) -> tuple[BalanceAlertTarget, ...]:
    if type(value) is not list or len(value) > MAX_ALERT_TARGETS:
        raise AlertConfigError(
            message("error.alert_config.target_limit", limit=MAX_ALERT_TARGETS)
        )
    result = []
    seen = set()
    for item in value:
        if type(item) is not dict or set(item) != {"umo", "mentions"}:
            raise AlertConfigError(message("error.alert_config.invalid_target_fields"))
        platform, message_type, session = parse_umo(item["umo"])
        umo = ":".join((platform, message_type, session))
        if umo in seen:
            raise AlertConfigError(message("error.alert_config.duplicate_target"))
        seen.add(umo)
        mentions = _qq_ids(
            item["mentions"],
            MAX_ALERT_MENTIONS,
            message("error.alert_config.label.mentions"),
        )
        if mentions and (
            message_type != "GroupMessage"
            or not QQ_ID.fullmatch(session.split("_")[-1])
        ):
            raise AlertConfigError(message("error.alert_config.group_mention_only"))
        result.append(BalanceAlertTarget(umo, mentions))
    return tuple(result)


def parse_alert_admin_qq_ids(value: Any) -> tuple[str, ...]:
    label = message("error.alert_config.label.admin_qq")
    if type(value) is not list or len(value) > MAX_ALERT_ADMIN_QQ_IDS:
        raise AlertConfigError(
            message(
                "error.alert_config.list_limit",
                label=label,
                limit=MAX_ALERT_ADMIN_QQ_IDS,
            )
        )
    result = []
    for item in value:
        identity = _text(item, label, 160, token=True)
        if not QQ_ID.fullmatch(identity) and not re.fullmatch(
            r"qq_official(?:_webhook)?:[A-Za-z0-9_-]{1,128}", identity
        ):
            raise AlertConfigError(
                message("error.alert_config.invalid_admin_id", label=label)
            )
        if identity not in result:
            result.append(identity)
    return tuple(result)


def parse_alert_llm(value: Any) -> BalanceAlertLLM:
    if not isinstance(value, Mapping) or set(value) - {
        "enabled",
        "provider_id",
        "persona_id",
    }:
        raise AlertConfigError(message("error.alert_config.invalid_model_object"))
    enabled = value.get("enabled", True)
    if type(enabled) is not bool:
        raise AlertConfigError(message("error.alert_config.invalid_model_enabled"))
    return BalanceAlertLLM(
        enabled,
        _text(
            value.get("provider_id", ""), message("error.alert_config.label.model"), 128
        ),
        _text(
            value.get("persona_id", ""),
            message("error.alert_config.label.persona"),
            128,
        ),
    )


def alert_configuration_error(
    alert: BalanceAlertSettings,
    *,
    account_enabled: bool,
    targets: tuple[BalanceAlertTarget, ...],
) -> str | None:
    if not alert.enabled:
        return None
    if not account_enabled:
        return message("error.alert_config.account_disabled")
    if alert.threshold is None or not alert.metric:
        return message("error.alert_config.missing_threshold_or_metric")
    if not targets:
        return message("error.alert_config.missing_targets")
    return None


def normalize_alert_config(
    config: Mapping[str, Any], *, require_ready: bool = True
) -> dict[str, Any]:
    """Normalize only present fields, preserving old DTO shapes and credentials.

    ``require_ready=False`` is for reading an earlier UI-only stored draft. It
    never makes that draft runnable: load_settings independently fails closed.
    Every new save uses the strict default, including command transactions.
    """
    result = copy.deepcopy(dict(config))
    targets = parse_alert_targets(result.get("balance_alert_targets", []))
    admins = parse_alert_admin_qq_ids(result.get("balance_alert_admin_qq_ids", []))
    llm = parse_alert_llm(result.get("balance_alert_llm", {}))
    for key, value in (
        ("balance_alert_targets", [item.as_dict() for item in targets]),
        ("balance_alert_admin_qq_ids", list(admins)),
        ("balance_alert_llm", llm.as_dict()),
    ):
        if key in result:
            result[key] = value
    for account in result.get("providers", []):
        if not isinstance(account, dict) or "balance_alert" not in account:
            continue
        alert = parse_balance_alert(
            account["balance_alert"],
            account.get("type", account.get("__template_key", "")),
            account.get("service_profile", ""),
        )
        error = alert_configuration_error(
            alert, account_enabled=account.get("enabled", True) is True, targets=targets
        )
        if require_ready and error:
            raise AlertConfigError(error)
        account["balance_alert"] = alert.as_dict()
    return result
