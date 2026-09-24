"""Read the Alibaba Cloud account's cash balance through BSS OpenAPI."""

from __future__ import annotations

import asyncio
import base64
import hashlib
import hmac
import re
import secrets
from collections.abc import Mapping
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
_SOURCE = "阿里云账户现金余额"
_CURRENCIES = frozenset({"CNY", "USD", "JPY"})
_SAFE_CODE = re.compile(r"^[A-Za-z0-9_-]{1,64}$")
_BUSINESS_ERRORS: dict[str, tuple[ProviderErrorCategory, str]] = {
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
    """Query only the cash balance exposed by mainland BSS OpenAPI."""

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
            amount, currency = _parse_payload(payload)
        except BusinessFailure as exc:
            return _error_snapshot(account_id, display_name, _business_error(exc.code))
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
            status=SnapshotStatus.AVAILABLE,
            balances=(
                BalanceItem(
                    kind=BalanceItemKind.CASH,
                    amount=amount,
                    unit=currency,
                    label="账户现金余额",
                ),
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


def _parse_payload(payload: Any) -> tuple[Decimal, str]:
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
    amount = _decimal(data.get("AvailableCashAmount"))
    currency = data.get("Currency")
    if not isinstance(currency, str) or currency not in _CURRENCIES:
        raise ValueError("unsupported currency")
    return amount, currency


def _decimal(value: Any) -> Decimal:
    if isinstance(value, bool) or isinstance(value, float):
        raise ValueError("amount must preserve decimal precision")
    if not isinstance(value, (str, int, Decimal)):
        raise TypeError("amount must be a decimal string or number")
    amount = Decimal(value)
    if not amount.is_finite() or amount < 0:
        raise ValueError("amount must be finite and non-negative")
    return amount


def _business_error(code: str | None) -> NormalizedProviderError:
    if code in _BUSINESS_ERRORS:
        category, diagnostic = _BUSINESS_ERRORS[code]
        messages = {
            ProviderErrorCategory.PERMISSION: "阿里云拒绝访问账户现金余额",
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
            "阿里云拒绝访问账户现金余额",
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
                return _business_error(code)
    return _status_error(exc.status_code)


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
