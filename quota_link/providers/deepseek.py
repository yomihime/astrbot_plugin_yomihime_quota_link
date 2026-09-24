"""DeepSeek's read-only account balance adapter."""

from __future__ import annotations

from datetime import UTC, datetime
from decimal import Decimal, InvalidOperation
from typing import Any, Mapping

from ..http_client import (
    HttpRequestError,
    HttpResponseParseError,
    HttpStatusError,
    HttpTransportError,
)
from ..models import (
    BalanceItem,
    BalanceItemKind,
    BalanceSnapshot,
    NormalizedProviderError,
    ProviderErrorCategory,
    ProviderType,
    SnapshotStatus,
)
from .base import AsyncProviderClient

_BALANCE_URL = "https://api.deepseek.com/user/balance"
_SOURCE = "DeepSeek API"
_CURRENCIES = frozenset({"CNY", "USD"})
_HTTP_ERRORS: dict[int, tuple[ProviderErrorCategory, str, str]] = {
    401: (
        ProviderErrorCategory.AUTHENTICATION,
        "DeepSeek API 密钥认证失败",
        "http_401",
    ),
    402: (
        ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
        "DeepSeek 账户余额不足，当前无法调用 API",
        "http_402",
    ),
    403: (ProviderErrorCategory.PERMISSION, "DeepSeek 拒绝了余额查询", "http_403"),
    429: (
        ProviderErrorCategory.RATE_LIMITED,
        "DeepSeek 请求过于频繁，请稍后重试",
        "http_429",
    ),
}


class DeepSeekAdapter:
    """Fetch and normalize all currency balances for one DeepSeek account."""

    async def fetch_balance(
        self, account: Any, client: AsyncProviderClient
    ) -> BalanceSnapshot:
        account_id, display_name = _account_identity(account)
        api_key = _api_key(account)
        if api_key is None:
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.CONFIGURATION,
                    "DeepSeek 账户缺少有效 API 密钥",
                    "missing_api_key",
                ),
            )
        try:
            response = await client.request(
                "GET",
                _BALANCE_URL,
                headers={"Authorization": f"Bearer {api_key}"},
                timeout=_timeout(account),
            )
        except HttpStatusError as exc:
            return _error_snapshot(
                account_id, display_name, _status_error(exc.status_code)
            )
        except HttpTransportError as exc:
            message = (
                "DeepSeek 余额查询超时"
                if exc.kind == "timeout"
                else "无法连接 DeepSeek 余额服务"
            )
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                    message,
                    exc.kind,
                ),
            )
        except HttpResponseParseError:
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.PARSE,
                    "DeepSeek 返回的余额数据格式无法识别",
                    "invalid_json",
                ),
            )
        except HttpRequestError as exc:
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.CONFIGURATION,
                    "DeepSeek 余额查询请求配置无效",
                    exc.kind,
                ),
            )

        status_code = response.status_code
        if status_code != 200:
            return _error_snapshot(account_id, display_name, _status_error(status_code))

        try:
            payload = response.json()
            balances, available = _parse_payload(payload)
        except (
            HttpResponseParseError,
            KeyError,
            TypeError,
            ValueError,
            InvalidOperation,
            OverflowError,
        ):
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.PARSE,
                    "DeepSeek 返回的余额数据格式无法识别",
                    "invalid_balance_response",
                ),
            )

        return BalanceSnapshot(
            account_id=account_id,
            provider_type=ProviderType.DEEPSEEK,
            display_name=display_name,
            status=(
                SnapshotStatus.AVAILABLE if available else SnapshotStatus.UNAVAILABLE
            ),
            balances=balances,
            source=_SOURCE,
            fetched_at=datetime.now(UTC),
        )


def _account_identity(account: Any) -> tuple[str, str]:
    if isinstance(account, Mapping):
        account_id = account.get("id")
        display_name = account.get("display_name")
    else:
        account_id = getattr(account, "id", None)
        display_name = getattr(account, "display_name", None)
    if not isinstance(account_id, str) or not account_id.strip():
        account_id = "unknown-account"
    if not isinstance(display_name, str) or not display_name.strip():
        display_name = "DeepSeek account"
    return account_id.strip(), display_name.strip()


def _api_key(account: Any) -> str | None:
    auth = (
        account.get("auth")
        if isinstance(account, Mapping)
        else getattr(account, "auth", None)
    )
    api_key = auth.get("api_key") if isinstance(auth, Mapping) else None
    return api_key.strip() if isinstance(api_key, str) and api_key.strip() else None


def _timeout(account: Any) -> float | None:
    value = (
        account.get("timeout_seconds")
        if isinstance(account, Mapping)
        else getattr(account, "timeout_seconds", None)
    )
    return (
        value
        if isinstance(value, (float, int)) and not isinstance(value, bool)
        else None
    )


def _parse_payload(payload: Any) -> tuple[tuple[BalanceItem, ...], bool]:
    if not isinstance(payload, Mapping):
        raise TypeError("response must be an object")
    available = payload.get("is_available")
    infos = payload.get("balance_infos")
    if type(available) is not bool or not isinstance(infos, list) or not infos:
        raise ValueError("response has no valid availability or balance list")

    items: list[BalanceItem] = []
    for info in infos:
        if not isinstance(info, Mapping):
            raise TypeError("balance row must be an object")
        currency = info.get("currency")
        if not isinstance(currency, str) or currency not in _CURRENCIES:
            raise ValueError("unsupported currency")
        total = _decimal(info.get("total_balance"))
        granted = _decimal(info.get("granted_balance"))
        topped_up = _decimal(info.get("topped_up_balance"))
        items.extend(
            (
                _balance_item(currency, total, "总可用余额"),
                _balance_item(currency, granted, "未过期赠金余额"),
                _balance_item(currency, topped_up, "充值余额"),
            )
        )
    return tuple(items), available


def _decimal(value: Any) -> Decimal:
    if isinstance(value, bool) or isinstance(value, float):
        raise ValueError("amount must preserve decimal precision")
    if not isinstance(value, (str, int, Decimal)):
        raise TypeError("amount must be a decimal string or number")
    amount = Decimal(value)
    if not amount.is_finite() or amount < 0:
        raise ValueError("amount must be finite and non-negative")
    return amount


def _balance_item(currency: str, amount: Decimal, label: str) -> BalanceItem:
    return BalanceItem(
        kind=BalanceItemKind.CASH,
        amount=amount,
        unit=currency,
        label=label,
    )


def _status_error(status_code: int) -> NormalizedProviderError:
    known = _HTTP_ERRORS.get(status_code)
    if known is not None:
        category, message, diagnostic = known
    elif 400 <= status_code <= 499:
        category, message, diagnostic = (
            ProviderErrorCategory.ENDPOINT,
            "DeepSeek 拒绝了余额查询请求",
            f"http_{status_code}",
        )
    else:
        category, message, diagnostic = (
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
            "DeepSeek 余额查询暂时失败",
            f"http_{status_code}" if 400 <= status_code <= 599 else "http_error",
        )
    return NormalizedProviderError(category, message, diagnostic)


def _error_snapshot(
    account_id: str, display_name: str, error: NormalizedProviderError
) -> BalanceSnapshot:
    return BalanceSnapshot(
        account_id=account_id,
        provider_type=ProviderType.DEEPSEEK,
        display_name=display_name,
        status=SnapshotStatus.UNAVAILABLE,
        balances=(),
        source=_SOURCE,
        fetched_at=datetime.now(UTC),
        error=error,
    )
