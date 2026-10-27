"""Conservative explicit throttling recognition, never arbitrary error text."""

from collections.abc import Mapping
from typing import Any

from .models import NormalizedProviderError, ProviderErrorCategory

_CODES = frozenset(
    {
        "Throttling",
        "Throttling.User",
        "Throttling.Api",
        "Throttling.System",
        "Throttling.RateQuota",
        "Throttling.Concurrent",
        "TooManyRequests",
        "RateLimitExceeded",
        "RATE_LIMITED",
        "rate_limit_exceeded",
    }
)


def explicit_throttling(payload: Any, response: Any) -> NormalizedProviderError | None:
    if not isinstance(payload, Mapping):
        return None
    code = payload.get("Code", payload.get("code"))
    # Numeric codes are not universally HTTP statuses. Only infer 429 from an
    # explicit failed envelope; do not classify unrelated balances as errors.
    failed = payload.get("Success") is False or payload.get("success") is False
    if (isinstance(code, str) and code in _CODES) or (
        failed and type(code) in (int, str) and str(code) == "429"
    ):
        return NormalizedProviderError(
            ProviderErrorCategory.RATE_LIMITED,
            "余额服务明确返回限流，请稍后重试",
            "business_throttling",
            getattr(response, "retry_after_seconds", None),
        )
    return None
