"""MiniMax Token Plan quota, separated by resource group and reset window."""

from collections.abc import Mapping
from datetime import UTC, datetime, timedelta
from decimal import Decimal, localcontext

from ..i18n import message
from ..models import BalanceItem, BalanceItemKind, ProviderErrorCategory, ProviderType
from ..wallet_transport import WalletAdapter, WalletResponseError, decimal_value

_PLAN_URLS = {
    "china": "https://www.minimax.cn/v1/token_plan/remains",
    "global": "https://www.minimax.io/v1/token_plan/remains",
}
_KNOWN_MODELS = {
    "MiniMax-M*",
    "MiniMax-M2",
    "MiniMax-M2.1",
    "MiniMax-M2.5",
    "MiniMax-M2.7",
    "MiniMax-M3",
    "MiniMax-M3.1",
    "MiniMax-M3.1-Flash",
    "image-01",
    "speech-hd",
}
_EPOCH = datetime(1970, 1, 1, tzinfo=UTC)
_MAX_COUNT = 2**53 - 1  # Official CLI wire counts use JavaScript numbers.
_BUSINESS_ERRORS = {
    1000: (ProviderErrorCategory.TEMPORARILY_UNAVAILABLE, "minimax_internal_error"),
    1001: (ProviderErrorCategory.TEMPORARILY_UNAVAILABLE, "minimax_timeout"),
    1004: (ProviderErrorCategory.AUTHENTICATION, "minimax_authentication"),
    1028: (ProviderErrorCategory.TEMPORARILY_UNAVAILABLE, "minimax_quota_exhausted"),
    1030: (ProviderErrorCategory.TEMPORARILY_UNAVAILABLE, "minimax_quota_exhausted"),
    2061: (ProviderErrorCategory.PERMISSION, "minimax_plan_unavailable"),
}


def _request(account):
    if account.auth["api_key"].strip().startswith("sk-api-"):
        # The official CLI sends these pay-as-you-go credentials to a different API.
        raise ValueError("MiniMax Token Plan requires a subscription key")
    return _PLAN_URLS[account.region], {"Content-Type": "application/json"}


def _validate_envelope(payload):
    if not isinstance(payload, Mapping):
        raise ValueError("invalid MiniMax payload")
    if payload.get("error") is not None:
        raise WalletResponseError(
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE, "minimax_business_error"
        )
    if "base_resp" not in payload:
        return  # Older successful model_remains responses omit this envelope.
    response = payload["base_resp"]
    if (
        not isinstance(response, Mapping)
        or type(response.get("status_code")) is not int
    ):
        raise ValueError("invalid MiniMax status")
    code = response["status_code"]
    if code:
        category, diagnostic = _BUSINESS_ERRORS.get(
            code,
            (ProviderErrorCategory.TEMPORARILY_UNAVAILABLE, "minimax_business_error"),
        )
        raise WalletResponseError(category, diagnostic)


def _number(value, maximum):
    if value is None:
        return None
    if type(value) not in {int, Decimal}:
        raise ValueError("invalid MiniMax numeric field")
    number = decimal_value(value)
    if not 0 <= number <= maximum:
        raise ValueError("out-of-range MiniMax numeric field")
    return number


def _count(value):
    number = _number(value, _MAX_COUNT)
    if number is not None and number != number.to_integral_value():
        raise ValueError("non-integral MiniMax count")
    return number


def _reset(value):
    if type(value) is not int or not 946_684_800_000 <= value <= 253_402_300_799_999:
        return None
    return _EPOCH + timedelta(milliseconds=value)


def _resolve_counts(count, total, percent):
    if count is None or total is None or total <= 0 or count > total:
        return None, None
    # Match the official CLI's two interpretations without rounding the ratio.
    with localcontext() as context:
        context.prec = 160
        if percent is not None:
            as_remaining = abs(100 * count - percent * total)
            as_used = abs(100 * (total - count) - percent * total)
            if min(as_remaining, as_used) > total:
                return None, None
            if as_used < as_remaining:
                return total - count, count
        return count, total - count


def _window(row, model, *, weekly, unavailable):
    window = "weekly" if weekly else "interval"
    prefix = f"current_{window}"
    label = message(f"provider.minimax_plan.{window}", model=model)
    status = row.get(f"{prefix}_status")
    if status is not None and (type(status) is not int or status not in {1, 2, 3}):
        raise ValueError("invalid MiniMax window status")
    reset = _reset(row.get("weekly_end_time" if weekly else "end_time"))
    kind = BalanceItemKind.SUBSCRIPTION
    if unavailable or status == 3:
        state = "not_in_plan" if unavailable else "unlimited"
        yield BalanceItem(
            kind,
            unit="plan_count",
            label=message(f"provider.minimax_plan.{state}", window=label),
            expires_at=None if unavailable else reset,
        )
        return
    total = _count(row.get(f"{prefix}_total_count"))
    count = _count(row.get(f"{prefix}_usage_count"))
    percent = _number(row.get(f"{prefix}_remaining_percent"), 100)
    if status == 2:
        label = message("provider.minimax_plan.exhausted", window=label)
        # Preserve an explicit exhausted state without inventing a numeric zero.
        if percent != 0:
            percent = None
        count = count if count in (0, total) else None
    remaining, used = _resolve_counts(count, total, percent)
    if status == 2 and remaining != 0:
        remaining = used = None
    if remaining is not None or (percent is None and (total or status == 2 or reset)):
        yield BalanceItem(
            kind,
            unit="plan_count",
            total=total if total else None,
            remaining=remaining,
            used=used,
            label=label,
            expires_at=reset,
        )
    if percent is not None:
        yield BalanceItem(
            kind,
            unit="%",
            remaining=percent,
            label=label,
            expires_at=reset,
        )
    if weekly:
        boost = _count(row.get("weekly_boost_permille"))
        if boost is not None and boost != 1000:
            yield BalanceItem(
                kind,
                amount=boost,
                unit="‰",
                label=message("provider.minimax_plan.weekly_boost", model=model),
            )


def _parse(payload, _account):
    _validate_envelope(payload)
    rows = payload.get("model_remains")
    if type(rows) is not list or not 1 <= len(rows) <= 32:
        raise ValueError("invalid MiniMax model list")
    items = []
    for index, row in enumerate(rows, start=1):
        if not isinstance(row, Mapping):
            raise ValueError("invalid MiniMax model")
        name = row.get("model_name")
        if type(name) is not str or not name.strip() or len(name) > 128:
            raise ValueError("invalid MiniMax model name")
        if name in {"general", "video"}:
            model = message(f"provider.minimax_plan.{name}")
        elif name in _KNOWN_MODELS:
            model = name
        else:
            # Unexpected upstream text must never appear in chat or tool facts.
            model = message("provider.minimax_plan.other_model", number=index)
        unavailable = all(
            type(row.get(f"current_{window}_{key}")) is int
            and row[f"current_{window}_{key}"] == value
            for window in ("interval", "weekly")
            for key, value in (("total_count", 0), ("status", 3))
        )
        items.extend(_window(row, model, weekly=False, unavailable=unavailable))
        items.extend(_window(row, model, weekly=True, unavailable=unavailable))
    if not items:
        raise ValueError("missing MiniMax quota fields")
    return tuple(items)


MINIMAX_PLAN_ADAPTER = WalletAdapter(
    ProviderType.MINIMAX_PLAN,
    message("provider.minimax_plan.source"),
    _request,
    _parse,
)

_GLM_PLAN_URLS = {
    "china": "https://open.bigmodel.cn/api/monitor/usage/quota/limit",
    "global": "https://api.z.ai/api/monitor/usage/quota/limit",
}
_GLM_TYPES = {
    "TOKENS_LIMIT": "tokens",
    "CREDIT_LIMIT": "credits",
    "TIME_LIMIT": "mcp",
}
_GLM_FAILURES = {
    "401": (ProviderErrorCategory.AUTHENTICATION, "glm_plan_authentication"),
    "403": (ProviderErrorCategory.PERMISSION, "glm_plan_permission"),
    "429": (ProviderErrorCategory.RATE_LIMITED, "glm_plan_throttled"),
}


def _glm_request(account):
    return _GLM_PLAN_URLS[account.region], {
        "Accept-Language": "en-US,en",
        "Content-Type": "application/json",
    }


def _glm_limits(payload):
    if not isinstance(payload, Mapping):
        raise ValueError("invalid GLM plan payload")
    code = payload.get("code")
    success = payload.get("success")
    if ("code" in payload and type(code) not in {int, str}) or (
        "success" in payload and type(success) is not bool
    ):
        raise ValueError("invalid GLM plan business status")
    if (
        ("code" in payload and str(code) not in {"0", "200"})
        or success is False
        or payload.get("error") is not None
    ):
        category, diagnostic = _GLM_FAILURES.get(
            str(code),
            (ProviderErrorCategory.TEMPORARILY_UNAVAILABLE, "glm_plan_business_error"),
        )
        raise WalletResponseError(category, diagnostic)
    if code is None and success is not True:
        raise ValueError("missing GLM plan business status")
    data = payload.get("data")
    limits = data.get("limits") if isinstance(data, Mapping) else None
    if type(limits) is not list or not 1 <= len(limits) <= 32:
        raise ValueError("invalid GLM plan limits")
    return limits


def _glm_window(row, category, index):
    unit = row.get("unit")
    count = row.get("number")
    if type(unit) is int and type(count) is int:
        if category == "mcp" and (unit, count) == (5, 1):
            return message("provider.glm_plan.monthly")
        if category != "mcp":
            if (unit, count) == (3, 5):
                return message("provider.glm_plan.five_hours")
            if (unit, count) == (6, 1):
                return message("provider.glm_plan.weekly")
    return message("provider.glm_plan.other_window", number=index)


def _glm_parse(payload, _account):
    items = []
    for index, row in enumerate(_glm_limits(payload), start=1):
        if not isinstance(row, Mapping) or type(row.get("type")) is not str:
            raise ValueError("invalid GLM plan limit")
        category = _GLM_TYPES.get(row["type"])
        if category is None:
            continue  # Unknown future limit types do not inherit current units.
        percent = _number(row.get("percentage"), 100)
        if percent is None:
            continue  # A missing percentage does not imply any quota state.
        with localcontext() as context:
            context.prec = 160
            remaining = Decimal(100) - percent
        label = message(
            "provider.glm_plan.window",
            category=message(f"provider.glm_plan.{category}"),
            window=_glm_window(row, category, index),
        )
        items.append(
            BalanceItem(
                BalanceItemKind.SUBSCRIPTION,
                unit="%",
                total=Decimal(100),
                remaining=remaining,
                used=percent,
                expires_at=_reset(row.get("nextResetTime")),
                label=label,
            )
        )
    if not items:
        raise ValueError("no recognized GLM plan percentages")
    return tuple(items)


GLM_PLAN_ADAPTER = WalletAdapter(
    ProviderType.GLM_PLAN,
    message("provider.glm_plan.source"),
    _glm_request,
    _glm_parse,
    bearer=False,
)
