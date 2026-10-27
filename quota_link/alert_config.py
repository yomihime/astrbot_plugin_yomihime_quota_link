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
}


class AlertConfigError(ValueError):
    """Safe validation failure: messages never interpolate submitted values."""


def _has_control(value: str) -> bool:
    return any(unicodedata.category(char) in {"Cc", "Cf", "Cs"} for char in value)


def _text(value: Any, label: str, limit: int, *, token: bool = False) -> str:
    if not isinstance(value, str) or _has_control(value):
        raise AlertConfigError(f"{label}必须为不含控制字符的文本。")
    result = value.strip()
    if len(result) > limit or (token and any(c.isspace() for c in result)):
        raise AlertConfigError(f"{label}长度或格式无效。")
    return result


def _integer(value: Any, label: str, low: int, high: int) -> int:
    if type(value) is not int or not low <= value <= high:
        raise AlertConfigError(f"{label}必须为 {low}–{high} 的整数。")
    return value


def parse_alert_decimal(value: Any, label: str = "额度阈值") -> Decimal | None:
    """Only bounded plain-decimal strings are accepted; JSON floats lose precision."""
    if value is None:
        return None
    text = _text(value, label, 50, token=True)
    if not DECIMAL_TEXT.fullmatch(text):
        raise AlertConfigError(f"{label}须为普通十进制文本，不支持科学计数法。")
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
        raise AlertConfigError("账户预警配置必须为对象。")
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
        raise AlertConfigError("账户预警配置含未知字段。")
    enabled = value.get("enabled", False)
    if type(enabled) is not bool:
        raise AlertConfigError("预警开关必须为布尔值。")
    interval = _integer(
        value.get("check_interval_minutes", 15), "检查间隔（分钟）", 1, 4320
    )
    repeat = _integer(
        value.get("repeat_minutes", 0),
        "持续低额重复间隔（分钟，0 表示不重复）",
        0,
        4320,
    )
    choices = metric_choices(provider_type, service_profile)
    metric = _text(value.get("metric", ""), "预警指标", 64, token=True)
    if not metric:
        metric = choices[0] if choices else ""
    if metric and metric not in choices:
        raise AlertConfigError("预警指标不受该供应商支持。")
    threshold = parse_alert_decimal(value.get("threshold"))
    recovery = parse_alert_decimal(value.get("recovery_threshold"), "恢复阈值")
    if recovery is not None and (threshold is None or recovery <= threshold):
        raise AlertConfigError("恢复阈值必须大于额度阈值。")
    return BalanceAlertSettings(
        enabled=enabled,
        check_interval_minutes=interval,
        metric=metric,
        unit=_text(value.get("unit", ""), "预警单位", 32, token=True),
        threshold=threshold,
        recovery_threshold=recovery,
        repeat_minutes=repeat,
    )


def parse_umo(value: Any) -> tuple[str, str, str]:
    umo = _text(value, "UMO", MAX_UMO_LENGTH, token=True)
    parts = umo.split(":", 2)
    if len(parts) != 3 or not all(parts) or parts[1] not in MESSAGE_TYPES:
        raise AlertConfigError("UMO 须为 平台实例:消息类型:会话ID。")
    return tuple(parts)


def _qq_ids(value: Any, limit: int, label: str) -> tuple[str, ...]:
    if type(value) is not list or len(value) > limit:
        raise AlertConfigError(f"{label}须为最多 {limit} 项的列表。")
    normalized = []
    for item in value:
        qq = _text(item, label, 20, token=True)
        if not QQ_ID.fullmatch(qq):
            raise AlertConfigError(f"{label}仅支持 ASCII 正整数 QQ 号，不能 @全体。")
        if qq not in normalized:
            normalized.append(qq)
    return tuple(normalized)


def parse_alert_targets(value: Any) -> tuple[BalanceAlertTarget, ...]:
    if type(value) is not list or len(value) > MAX_ALERT_TARGETS:
        raise AlertConfigError(f"预警推送目标须为最多 {MAX_ALERT_TARGETS} 项的列表。")
    result = []
    seen = set()
    for item in value:
        if type(item) is not dict or set(item) != {"umo", "mentions"}:
            raise AlertConfigError("每个预警目标必须仅包含 umo 和 mentions。")
        platform, message_type, session = parse_umo(item["umo"])
        umo = ":".join((platform, message_type, session))
        if umo in seen:
            raise AlertConfigError("预警目标 UMO 重复，请合并为同一行。")
        seen.add(umo)
        mentions = _qq_ids(item["mentions"], MAX_ALERT_MENTIONS, "群内提及")
        if mentions and (
            message_type != "GroupMessage"
            or not QQ_ID.fullmatch(session.split("_")[-1])
        ):
            raise AlertConfigError("仅数字 QQ 群会话可配置 @QQ号；私聊请删除提及。")
        result.append(BalanceAlertTarget(umo, mentions))
    return tuple(result)


def parse_alert_admin_qq_ids(value: Any) -> tuple[str, ...]:
    return _qq_ids(value, MAX_ALERT_ADMIN_QQ_IDS, "预警管理 QQ 白名单")


def parse_alert_llm(value: Any) -> BalanceAlertLLM:
    if not isinstance(value, Mapping) or set(value) - {
        "enabled",
        "provider_id",
        "persona_id",
    }:
        raise AlertConfigError("预警模型配置结构无效。")
    enabled = value.get("enabled", True)
    if type(enabled) is not bool:
        raise AlertConfigError("预警模型开关必须为布尔值。")
    return BalanceAlertLLM(
        enabled,
        _text(value.get("provider_id", ""), "模型 ID", 128),
        _text(value.get("persona_id", ""), "人格 ID", 128),
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
        return "启用预警前须先启用账户。"
    if alert.threshold is None or not alert.metric:
        return "请设置阈值和指标。"
    if not targets:
        return "启用预警前须设置至少一个推送目标。"
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
