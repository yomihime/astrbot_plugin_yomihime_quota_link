"""Read three independent Alibaba Cloud account metrics through BSS OpenAPI."""

from __future__ import annotations

import asyncio
import base64
import hashlib
import hmac
import re
import secrets
from collections.abc import Mapping
from dataclasses import replace
from datetime import UTC, datetime
from decimal import Decimal, InvalidOperation
from typing import Any
from urllib.parse import quote

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

_BALANCE_URL = "https://business.aliyuncs.com/"
_SOURCE = "阿里云账户余额与额度"
_PERMISSION_ERROR_MESSAGE = (
    "阿里云拒绝访问账户现金余额。请为查询当前 BSS 现金余额的 RAM 身份至少授予 "
    "AliyunBSSReadOnlyAccess；DashScope 模型 API Key 不能替代此 RAM 授权。无需授予 BSS FullAccess。"
)
_CURRENCIES = frozenset({"CNY", "USD", "JPY"})
_SAFE_CODE = re.compile(r"^[A-Za-z0-9_.-]{1,64}$")
_BUSINESS_ERRORS: dict[str, tuple[ProviderErrorCategory, str]] = {
    "Throttling": (ProviderErrorCategory.RATE_LIMITED, "throttling"),
    "Throttling.User": (ProviderErrorCategory.RATE_LIMITED, "throttling_user"),
    "Throttling.Api": (ProviderErrorCategory.RATE_LIMITED, "throttling_api"),
    "Throttling.System": (ProviderErrorCategory.RATE_LIMITED, "throttling_system"),
    "Throttling.RateQuota": (
        ProviderErrorCategory.RATE_LIMITED,
        "throttling_rate_quota",
    ),
    "Throttling.Concurrent": (
        ProviderErrorCategory.RATE_LIMITED,
        "throttling_concurrent",
    ),
    "NoPermission": (ProviderErrorCategory.PERMISSION, "permission_denied"),
    "NotAuthorized": (ProviderErrorCategory.PERMISSION, "not_authorized"),
    "AuthSiteFail": (ProviderErrorCategory.AUTHENTICATION, "auth_site_failed"),
    "NotApplicable": (ProviderErrorCategory.ENDPOINT, "not_applicable"),
    "MissingParameter": (ProviderErrorCategory.ENDPOINT, "missing_parameter"),
    "InvalidParameter": (ProviderErrorCategory.ENDPOINT, "invalid_parameter"),
    "InvalidOwner": (ProviderErrorCategory.ENDPOINT, "invalid_owner"),
    "InternalError": (
        ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
        "internal_error",
    ),
    "UndefinedError": (
        ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
        "undefined_error",
    ),
}


class AlibabaBailianAdapter:
    """Query only the balance metrics exposed by mainland BSS OpenAPI."""

    async def fetch_balance(
        self, account: Any, client: AsyncProviderClient
    ) -> BalanceSnapshot:
        try:
            (
                account_id,
                display_name,
                access_key_id,
                access_key_secret,
                token,
                timeout,
            ) = _account_fields(account)
        except (TypeError, ValueError):
            return _error_snapshot(
                *_safe_account_labels(account),
                NormalizedProviderError(
                    ProviderErrorCategory.CONFIGURATION,
                    "阿里云余额查询凭据配置无效",
                    "invalid_configuration",
                ),
            )

        try:
            response = await client.request(
                "GET",
                _BALANCE_URL,
                timeout=timeout,
                params_factory=lambda: _signed_params(
                    access_key_id, access_key_secret, token
                ),
            )
        except asyncio.CancelledError:
            raise
        except HttpStatusError as exc:
            error = _status_response_error(exc)
            return _error_snapshot(
                account_id,
                display_name,
                error,
            )
        except HttpTransportError as exc:
            message = (
                "阿里云现金余额查询超时"
                if exc.kind == "timeout"
                else "无法连接阿里云余额服务"
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
                    "阿里云返回的余额数据格式无法识别",
                    "invalid_json",
                ),
            )
        except HttpRequestError as exc:
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.CONFIGURATION,
                    "阿里云余额查询请求配置无效",
                    exc.kind,
                ),
            )

        if response.status_code != 200:
            return _error_snapshot(
                account_id,
                display_name,
                _status_error(response.status_code),
            )

        try:
            payload = response.json()
            amounts, currency = _parse_payload(payload)
        except BusinessFailure as exc:
            return _error_snapshot(
                account_id,
                display_name,
                replace(
                    _business_error(exc.code),
                    retry_after_seconds=getattr(response, "retry_after_seconds", None),
                ),
            )
        except HttpResponseParseError:
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.PARSE,
                    "阿里云返回的余额数据格式无法识别",
                    "invalid_json",
                ),
            )
        except (KeyError, TypeError, ValueError, InvalidOperation, OverflowError):
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.PARSE,
                    "阿里云返回的余额数据格式无法识别",
                    "invalid_balance_response",
                ),
            )

        return BalanceSnapshot(
            account_id=account_id,
            provider_type=ProviderType.ALIBABA_BAILIAN,
            display_name=display_name,
            status=(
                SnapshotStatus.AVAILABLE
                if all(v is not None for v in amounts.values())
                else SnapshotStatus.PARTIAL
            ),
            balances=tuple(
                BalanceItem(
                    kind=kind,
                    amount=amounts[metric],
                    unit=currency,
                    label=label,
                    metric=metric,
                )
                for metric, label, kind in (
                    ("AvailableCashAmount", "现金余额", BalanceItemKind.CASH),
                    ("AvailableAmount", "可用额度", BalanceItemKind.QUOTA),
                    ("CreditAmount", "信用额度", BalanceItemKind.QUOTA),
                )
            ),
            source=_SOURCE,
            fetched_at=datetime.now(UTC),
        )


class BusinessFailure(Exception):
    """An unsuccessful BSS business envelope with an allowlisted code only."""

    def __init__(self, code: str | None) -> None:
        self.code = code


def _signed_params(
    access_key_id: str,
    access_key_secret: str,
    security_token: str | None = None,
    *,
    timestamp: str | None = None,
    nonce: str | None = None,
) -> dict[str, str]:
    """Create fresh RPC parameters and sign them using Alibaba's RPC v1 rules."""
    params = {
        "Action": "QueryAccountBalance",
        "AccessKeyId": access_key_id,
        "Format": "JSON",
        "SignatureMethod": "HMAC-SHA1",
        "SignatureNonce": nonce or secrets.token_hex(16),
        "SignatureVersion": "1.0",
        "Timestamp": timestamp or datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "Version": "2017-12-14",
    }
    if security_token:
        params["SecurityToken"] = security_token
    params["Signature"] = _rpc_signature("GET", params, access_key_secret)
    return params


def _rpc_signature(method: str, params: Mapping[str, str], secret: str) -> str:
    canonical_query = "&".join(
        f"{_percent_encode(key)}={_percent_encode(value)}"
        for key, value in sorted(params.items())
        if key != "Signature"
    )
    string_to_sign = f"{method.upper()}&%2F&{_percent_encode(canonical_query)}"
    digest = hmac.new(
        f"{secret}&".encode("utf-8"),
        string_to_sign.encode("utf-8"),
        hashlib.sha1,
    ).digest()
    return base64.b64encode(digest).decode("ascii")


def _percent_encode(value: str) -> str:
    return quote(value, safe="-_.~", encoding="utf-8", errors="strict")


def _parse_payload(payload: Any) -> tuple[dict[str, Decimal | None], str]:
    if not isinstance(payload, Mapping):
        raise TypeError("response must be an object")
    success = payload.get("Success")
    code = payload.get("Code")
    if type(success) is not bool or not isinstance(code, str):
        raise TypeError("response success envelope is malformed")
    if success is not True or code != "200":
        safe_code = code if _SAFE_CODE.fullmatch(code) else None
        raise BusinessFailure(safe_code)
    data = payload.get("Data")
    if not isinstance(data, Mapping):
        raise TypeError("response data must be an object")
    amounts = {
        metric: None
        if data.get(metric) is None
        else _decimal(data[metric], allow_negative=metric == "AvailableAmount")
        for metric in ("AvailableCashAmount", "AvailableAmount", "CreditAmount")
    }
    if not any(value is not None for value in amounts.values()):
        raise ValueError("no supported balance metrics")
    currency = data.get("Currency")
    if not isinstance(currency, str) or currency not in _CURRENCIES:
        raise ValueError("unsupported currency")
    return amounts, currency


def _decimal(value: Any, *, allow_negative: bool = False) -> Decimal:
    if isinstance(value, bool) or isinstance(value, float):
        raise ValueError("amount must preserve decimal precision")
    if not isinstance(value, (str, int, Decimal)):
        raise TypeError("amount must be a decimal string or number")
    amount = Decimal(value)
    if not amount.is_finite() or (amount < 0 and not allow_negative):
        raise ValueError("amount must be finite and non-negative")
    return amount


def _business_error(code: str | None) -> NormalizedProviderError:
    if code in _BUSINESS_ERRORS:
        category, diagnostic = _BUSINESS_ERRORS[code]
        messages = {
            ProviderErrorCategory.RATE_LIMITED: "阿里云余额查询被限流，请稍后重试",
            ProviderErrorCategory.PERMISSION: _PERMISSION_ERROR_MESSAGE,
            ProviderErrorCategory.AUTHENTICATION: "阿里云访问密钥认证失败",
            ProviderErrorCategory.ENDPOINT: "阿里云账户现金余额查询失败",
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE: "阿里云余额服务暂时不可用",
        }
        return NormalizedProviderError(category, messages[category], diagnostic)
    return NormalizedProviderError(
        ProviderErrorCategory.ENDPOINT,
        "阿里云账户现金余额查询失败",
        "business_failure",
    )


def _status_error(status_code: int) -> NormalizedProviderError:
    if status_code == 401:
        category, message = (
            ProviderErrorCategory.AUTHENTICATION,
            "阿里云访问密钥认证失败",
        )
    elif status_code == 403:
        category, message = (
            ProviderErrorCategory.PERMISSION,
            _PERMISSION_ERROR_MESSAGE,
        )
    elif status_code == 429:
        category, message = (
            ProviderErrorCategory.RATE_LIMITED,
            "阿里云余额查询过于频繁，请稍后重试",
        )
    elif status_code >= 500:
        category, message = (
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
            "阿里云余额服务暂时不可用",
        )
    else:
        category, message = (
            ProviderErrorCategory.ENDPOINT,
            "阿里云拒绝了账户现金余额查询请求",
        )
    return NormalizedProviderError(category, message, f"http_{status_code}")


def _status_response_error(exc: HttpStatusError) -> NormalizedProviderError:
    """Use only an allowlisted BSS Code from an HTTP 400 JSON envelope."""
    if exc.status_code == 400 and exc.response is not None:
        try:
            payload = exc.response.json()
        except HttpResponseParseError:
            payload = None
        if isinstance(payload, Mapping):
            code = payload.get("Code")
            if isinstance(code, str) and code in _BUSINESS_ERRORS:
                return replace(
                    _business_error(code), retry_after_seconds=exc.retry_after_seconds
                )
    return replace(
        _status_error(exc.status_code), retry_after_seconds=exc.retry_after_seconds
    )


def _account_fields(
    account: Any,
) -> tuple[str, str, str, str, str | None, float | None]:
    if isinstance(account, Mapping):
        account_id = account.get("id")
        display_name = account.get("display_name")
        auth = account.get("auth")
        timeout = account.get("timeout_seconds")
    else:
        account_id = getattr(account, "id", None)
        display_name = getattr(account, "display_name", None)
        auth = getattr(account, "auth", None)
        timeout = getattr(account, "timeout_seconds", None)
    access_key_id = auth.get("access_key_id") if isinstance(auth, Mapping) else None
    access_key_secret = (
        auth.get("access_key_secret") if isinstance(auth, Mapping) else None
    )
    security_token = auth.get("security_token") if isinstance(auth, Mapping) else None
    if not all(
        isinstance(value, str) and value.strip()
        for value in (account_id, display_name, access_key_id, access_key_secret)
    ) or (security_token is not None and not isinstance(security_token, str)):
        raise ValueError("Alibaba account is missing required configuration")
    safe_timeout = (
        timeout
        if isinstance(timeout, (int, float)) and not isinstance(timeout, bool)
        else None
    )
    return (
        account_id.strip(),
        display_name.strip(),
        access_key_id.strip(),
        access_key_secret.strip(),
        security_token.strip() if security_token and security_token.strip() else None,
        safe_timeout,
    )


def _safe_account_labels(account: Any) -> tuple[str, str]:
    if isinstance(account, Mapping):
        account_id = account.get("id")
        display_name = account.get("display_name")
    else:
        account_id = getattr(account, "id", None)
        display_name = getattr(account, "display_name", None)
    safe_id = (
        account_id.strip()
        if isinstance(account_id, str) and account_id.strip()
        else "alibaba_bailian"
    )
    safe_name = (
        display_name.strip()
        if isinstance(display_name, str) and display_name.strip()
        else "阿里云账户"
    )
    return safe_id, safe_name


def _error_snapshot(
    account_id: str, display_name: str, error: NormalizedProviderError
) -> BalanceSnapshot:
    return BalanceSnapshot(
        account_id=account_id,
        provider_type=ProviderType.ALIBABA_BAILIAN,
        display_name=display_name,
        status=SnapshotStatus.UNAVAILABLE,
        balances=(),
        source=_SOURCE,
        fetched_at=datetime.now(UTC),
        error=error,
    )
