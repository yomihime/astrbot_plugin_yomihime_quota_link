"""Configured, read-only balance adapter for OpenAI-compatible providers."""

from __future__ import annotations

import asyncio
import re
from datetime import UTC, datetime
from decimal import Decimal, InvalidOperation
from typing import Any, Mapping
from urllib.parse import urlsplit

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
from ..settings import GRSAI_REGION_HOSTS
from .base import AsyncProviderClient

_SOURCE = "OpenAI-compatible 余额接口"
_GRSAI_SOURCE = "Grsai 账户积分接口"
_GRSAI_ACCOUNT_PATH = "/client/openapi/getCredits"
_SEGMENT_ESCAPE = re.compile(r"~(?![01])")
_SAFE_HEADER = re.compile(r"^[!#$%&'*+.^_`|~0-9A-Za-z-]+$")
_SAFE_DYNAMIC_KINDS = frozenset(kind.value for kind in BalanceItemKind)
_HTTP_ERRORS: dict[int, tuple[ProviderErrorCategory, str, str]] = {
    401: (
        ProviderErrorCategory.AUTHENTICATION,
        "余额接口认证失败",
        "http_401",
    ),
    403: (ProviderErrorCategory.PERMISSION, "余额接口拒绝访问", "http_403"),
    404: (ProviderErrorCategory.ENDPOINT, "余额接口路径或版本不存在", "http_404"),
    429: (
        ProviderErrorCategory.RATE_LIMITED,
        "余额接口请求过于频繁，请稍后重试",
        "http_429",
    ),
}


class OpenAICompatibleAdapter:
    """Fetch a configured read-only endpoint and apply explicit JSON mappings."""

    async def fetch_balance(
        self, account: Any, client: AsyncProviderClient
    ) -> BalanceSnapshot:
        provider_type = _account_provider_type(account)
        try:
            account_id, display_name, auth, endpoint, mapping, timeout = (
                _account_fields(account)
            )
            service_profile = _account_option(account, "service_profile", "generic")
            balance_scope = _account_option(account, "balance_scope", "generic")
            prefer_split_endpoint = _account_option(
                account, "prefer_split_endpoint", False
            )
            if provider_type is ProviderType.GRSAI:
                service_profile = "grsai"
                balance_scope = _account_option(account, "balance_scope", "account")
        except Exception:
            account_id, display_name = _fallback_identity(account)
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.CONFIGURATION,
                    "兼容平台余额查询配置无效",
                    "invalid_configuration",
                ),
                provider_type=provider_type,
            )
        try:
            if service_profile == "grsai":
                if balance_scope != "account":
                    raise ValueError("unsupported Grsai balance scope")
                method, url, headers, params, body = _grsai_account_request_config(
                    auth,
                    endpoint,
                    region=_account_option(account, "region", "china")
                    if provider_type is ProviderType.GRSAI
                    else None,
                )
            else:
                method, url, headers, params, body = _request_config(
                    auth,
                    endpoint,
                    mapping,
                    prefer_split_endpoint=prefer_split_endpoint is True,
                )
        except (TypeError, ValueError):
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.CONFIGURATION,
                    "兼容平台余额查询配置无效",
                    "invalid_configuration",
                ),
                source=_GRSAI_SOURCE if service_profile == "grsai" else _SOURCE,
                provider_type=provider_type,
            )

        try:
            response = await client.request(
                method,
                url,
                headers=headers,
                params=params,
                json=body,
                timeout=timeout,
            )
        except asyncio.CancelledError:
            raise
        except (
            HttpStatusError,
            HttpTransportError,
            HttpResponseParseError,
            HttpRequestError,
        ) as exc:
            error = (
                _grsai_transport_error(exc)
                if service_profile == "grsai"
                else _transport_error(exc)
            )
            return _error_snapshot(
                account_id,
                display_name,
                error,
                source=_GRSAI_SOURCE if service_profile == "grsai" else _SOURCE,
                provider_type=provider_type,
            )
        except Exception:
            # Third-party clients can attach URLs or request details to arbitrary
            # exceptions. Never forward their text into logs or user-facing data.
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                    "余额接口请求暂时失败",
                    "request_error",
                ),
                source=_GRSAI_SOURCE if service_profile == "grsai" else _SOURCE,
                provider_type=provider_type,
            )

        status_code = response.status_code
        if status_code != 200:
            if service_profile == "grsai":
                return _error_snapshot(
                    account_id,
                    display_name,
                    _grsai_http_error(status_code),
                    source=_GRSAI_SOURCE,
                    provider_type=provider_type,
                )
            category, message, diagnostic = _HTTP_ERRORS.get(
                status_code,
                (
                    ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                    "余额接口请求暂时失败",
                    f"http_{status_code}"
                    if 400 <= status_code <= 599
                    else "http_error",
                ),
            )
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(category, message, diagnostic),
                provider_type=provider_type,
            )

        try:
            payload = response.json()
            if service_profile == "grsai":
                item, status = _parse_grsai_account_payload(payload)
            else:
                item, status = _parse_payload(payload, mapping)
        except BusinessFailure:
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.ENDPOINT,
                    "余额服务报告查询失败",
                    "business_failure",
                ),
                source=_GRSAI_SOURCE if service_profile == "grsai" else _SOURCE,
                provider_type=provider_type,
            )
        except HttpResponseParseError:
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.PARSE,
                    "余额接口返回的数据格式无法识别",
                    "invalid_json",
                ),
                source=_GRSAI_SOURCE if service_profile == "grsai" else _SOURCE,
                provider_type=provider_type,
            )
        except (KeyError, TypeError, ValueError, InvalidOperation, OverflowError):
            return _error_snapshot(
                account_id,
                display_name,
                NormalizedProviderError(
                    ProviderErrorCategory.PARSE,
                    "余额接口返回的数据格式无法识别",
                    "invalid_balance_response",
                ),
                source=_GRSAI_SOURCE if service_profile == "grsai" else _SOURCE,
                provider_type=provider_type,
            )

        return BalanceSnapshot(
            account_id=account_id,
            provider_type=provider_type,
            display_name=display_name,
            status=status,
            balances=(item,),
            source=_GRSAI_SOURCE if service_profile == "grsai" else _SOURCE,
            fetched_at=datetime.now(UTC),
        )


def _account_fields(
    account: Any,
) -> tuple[
    str, str, Mapping[str, Any], Mapping[str, Any], Mapping[str, Any], float | None
]:
    if isinstance(account, Mapping):
        account_id = account.get("id")
        display_name = account.get("display_name")
        auth = account.get("auth")
        endpoint = account.get("endpoint")
        mapping = account.get("response_mapping")
        timeout = account.get("timeout_seconds")
    else:
        account_id = getattr(account, "id", None)
        display_name = getattr(account, "display_name", None)
        auth = getattr(account, "auth", None)
        endpoint = getattr(account, "endpoint", None)
        mapping = getattr(account, "response_mapping", None)
        timeout = getattr(account, "timeout_seconds", None)
    if not all(
        isinstance(value, str) and value.strip() for value in (account_id, display_name)
    ):
        raise ValueError("account identity is missing")
    if not isinstance(auth, Mapping) or not isinstance(endpoint, Mapping):
        raise ValueError("account request configuration is missing")
    if not isinstance(mapping, Mapping):
        raise ValueError("account response mapping is missing")
    if isinstance(timeout, bool) or not isinstance(timeout, (float, int)):
        timeout = None
    return account_id.strip(), display_name.strip(), auth, endpoint, mapping, timeout


def _fallback_identity(account: Any) -> tuple[str, str]:
    """Return safe local identity fields for a malformed account object."""
    if isinstance(account, Mapping):
        account_id = account.get("id")
        display_name = account.get("display_name")
    else:
        try:
            account_id = getattr(account, "id", None)
        except Exception:
            account_id = None
        try:
            display_name = getattr(account, "display_name", None)
        except Exception:
            display_name = None
    return (
        account_id.strip()
        if isinstance(account_id, str) and account_id.strip()
        else "unknown-account",
        display_name.strip()
        if isinstance(display_name, str) and display_name.strip()
        else "OpenAI-compatible account",
    )


def _account_option(account: Any, name: str, default: Any) -> Any:
    if isinstance(account, Mapping):
        return account.get(name, default)
    return getattr(account, name, default)


def _account_provider_type(account: Any) -> ProviderType:
    """Keep legacy compatible records distinct from the native Grsai type."""
    raw = _account_option(account, "provider_type", None)
    if raw is None:
        raw = _account_option(account, "type", None)
    return (
        ProviderType.GRSAI
        if raw == ProviderType.GRSAI.value
        else ProviderType.OPENAI_COMPATIBLE
    )


def _grsai_account_request_config(
    auth: Mapping[str, Any], endpoint: Mapping[str, Any], *, region: str | None = None
) -> tuple[str, str, dict[str, str], dict[str, str], dict[str, str]]:
    """Build the documented account-credit request from a secret field."""
    token = auth.get("token")
    if not isinstance(token, str) or not token.strip():
        raise ValueError("missing Grsai request token")
    if region is not None and region not in GRSAI_REGION_HOSTS:
        raise ValueError("unsupported Grsai region")
    base_url = (
        GRSAI_REGION_HOSTS[region] if region is not None else endpoint.get("base_url")
    )
    if (
        not isinstance(base_url, str)
        or not base_url
        or base_url != base_url.strip()
        or any(ord(char) < 32 or ord(char) == 127 for char in base_url)
    ):
        raise ValueError("missing or malformed Grsai Host")
    parsed = urlsplit(base_url)
    try:
        _ = parsed.port
    except ValueError as exc:
        raise ValueError("malformed Grsai Host") from exc
    if (
        parsed.scheme.casefold() != "https"
        or not parsed.hostname
        or parsed.username is not None
        or parsed.password is not None
        or parsed.path not in {"", "/"}
        or parsed.query
        or parsed.fragment
        or "\\" in base_url
    ):
        raise ValueError("Grsai Host must be a clean HTTPS root")
    if region is None:
        configured_path = endpoint.get("path")
        if configured_path not in (None, "", _GRSAI_ACCOUNT_PATH):
            raise ValueError("unsupported Grsai account path")
        if endpoint.get("json_body") not in (None, {}):
            raise ValueError("Grsai JSON body is assembled from the secret field")
        configured_method = endpoint.get("method")
        if configured_method not in (None, "") and (
            not isinstance(configured_method, str)
            or configured_method.upper() != "POST"
        ):
            raise ValueError("Grsai account request must use POST")
    # Legacy endpoint.url and generic auth_mode are deliberately not consulted.
    url = base_url.rstrip("/") + _GRSAI_ACCOUNT_PATH
    return "POST", url, {"Accept": "application/json"}, {}, {"token": token.strip()}


def _parse_grsai_account_payload(payload: Any) -> tuple[BalanceItem, SnapshotStatus]:
    if not isinstance(payload, Mapping):
        raise ValueError("Grsai response must be an object")
    code = payload.get("code")
    if isinstance(code, bool) or not isinstance(code, int):
        raise ValueError("Grsai response code is invalid")
    if code != 0:
        raise BusinessFailure
    data = payload.get("data")
    if not isinstance(data, Mapping):
        raise ValueError("Grsai response data is invalid")
    amount = _decimal(data["credits"])
    return (
        BalanceItem(kind=BalanceItemKind.CREDITS, amount=amount, unit="credit"),
        SnapshotStatus.AVAILABLE,
    )


def _request_config(
    auth: Mapping[str, Any],
    endpoint: Mapping[str, Any],
    mapping: Mapping[str, Any],
    *,
    prefer_split_endpoint: bool = False,
) -> tuple[str, str, dict[str, str], dict[str, str], Mapping[str, Any] | None]:
    method = endpoint.get("method", "GET")
    if not isinstance(method, str) or method.upper() not in {"GET", "POST"}:
        raise ValueError("unsupported method")
    method = method.upper()
    raw_url = None if prefer_split_endpoint else endpoint.get("url")
    if not isinstance(raw_url, str) or not raw_url.strip():
        base_url = endpoint.get("base_url")
        path = endpoint.get("path")
        if not isinstance(base_url, str) or not isinstance(path, str):
            raise ValueError("invalid endpoint")
        if not base_url.strip() or not path.strip():
            raise ValueError("invalid endpoint")
        if "?" in path or "#" in path:
            raise ValueError("query or fragment in path")
        raw_url = base_url.rstrip("/") + "/" + path.lstrip("/")
    raw_url = raw_url.strip()
    parsed = urlsplit(raw_url)
    if (
        parsed.scheme.lower() != "https"
        or not parsed.hostname
        or parsed.username is not None
        or parsed.password is not None
        or parsed.query
        or parsed.fragment
    ):
        raise ValueError("endpoint must be a clean HTTPS URL")
    path_lower = parsed.path.rstrip("/").casefold()
    if path_lower.endswith(("/chat/completions", "/completions", "/responses")):
        raise ValueError("model generation endpoint is not a balance endpoint")
    # Accessing .port validates malformed ports; the endpoint itself is kept free
    # of userinfo, query credentials and fragments.
    _ = parsed.port

    api_key = auth.get("api_key")
    mode = endpoint.get("auth_mode")
    name = endpoint.get("auth_name")
    if not isinstance(api_key, str) or not api_key.strip():
        raise ValueError("missing API key")
    if mode not in {"bearer", "header", "query"}:
        raise ValueError("invalid auth mode")
    headers: dict[str, str] = {"Accept": "application/json"}
    params: dict[str, str] = {}
    if mode == "bearer":
        headers["Authorization"] = f"Bearer {api_key.strip()}"
    elif mode == "header":
        if (
            not isinstance(name, str)
            or not _SAFE_HEADER.fullmatch(name)
            or name.casefold() in {"host", "content-length", "connection"}
        ):
            raise ValueError("invalid auth header name")
        headers[name] = api_key.strip()
    else:
        if not isinstance(name, str) or not name.strip():
            raise ValueError("invalid auth query name")
        params[name] = api_key.strip()

    if _optional_path(mapping, "unit_path") is not None:
        expected_unit = mapping.get("unit")
        if (
            not isinstance(expected_unit, str)
            or not expected_unit.strip()
            or expected_unit.strip() == api_key.strip()
        ):
            raise ValueError("unit_path requires a safe configured unit")

    body = endpoint.get("json_body")
    if method == "GET":
        if body not in (None, {}) and not (isinstance(body, Mapping) and not body):
            raise ValueError("GET cannot have a JSON body")
        body = None
    else:
        if (
            not isinstance(body, Mapping)
            or _contains_template_or_auth(body)
            or _contains_value(body, api_key.strip())
        ):
            raise ValueError("POST requires a static non-auth JSON object")
        _validate_json_values(body)
        body = _plain_json(body)
    amount_path = _optional_path(mapping, "amount_path")
    if amount_path is None:
        raise ValueError("amount mapping is required")
    _validate_mapping(mapping)
    return method, raw_url, headers, params, body


def _contains_template_or_auth(value: Any) -> bool:
    if isinstance(value, str):
        return "${" in value or "{{" in value or "}}" in value
    if isinstance(value, Mapping):
        return any(
            isinstance(key, str)
            and key.casefold()
            in {"authorization", "api_key", "apikey", "token", "secret", "password"}
            or _contains_template_or_auth(key)
            or _contains_template_or_auth(item)
            for key, item in value.items()
        )
    if isinstance(value, (list, tuple)):
        return any(_contains_template_or_auth(item) for item in value)
    return False


def _validate_json_values(value: Any) -> None:
    if value is None or isinstance(value, (str, bool, int)):
        return
    if isinstance(value, float):
        if not Decimal(str(value)).is_finite():
            raise ValueError("non-finite JSON number")
        return
    if isinstance(value, Mapping):
        if any(not isinstance(key, str) for key in value):
            raise ValueError("invalid JSON object key")
        for item in value.values():
            _validate_json_values(item)
        return
    if isinstance(value, (list, tuple)):
        for item in value:
            _validate_json_values(item)
        return
    raise ValueError("unsupported JSON body value")


def _plain_json(value: Any) -> Any:
    """Thaw settings' immutable mappings into JSON encoder friendly values."""
    if isinstance(value, Mapping):
        return {key: _plain_json(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_plain_json(item) for item in value]
    return value


def _parse_payload(
    payload: Any, mapping: Mapping[str, Any]
) -> tuple[BalanceItem, SnapshotStatus]:
    success_path = _optional_path(mapping, "success_path")
    failure_path = _optional_path(mapping, "failure_path")
    if failure_path is not None:
        actual_failure = _pointer(payload, failure_path)
        if actual_failure == mapping["failure_value"]:
            raise BusinessFailure
    if success_path is not None:
        actual = _pointer(payload, success_path)
        if "success_value" not in mapping or actual != mapping["success_value"]:
            raise BusinessFailure

    amount_path = _optional_path(mapping, "amount_path")
    if amount_path is None:
        raise ValueError("amount mapping is required")
    amount = _decimal(_pointer(payload, amount_path))
    values: dict[str, Decimal | None] = {"amount": amount}
    for field in ("total", "remaining", "used"):
        path = _optional_path(mapping, f"{field}_path")
        values[field] = _decimal(_pointer(payload, path)) if path is not None else None

    unit = mapping.get("unit", "custom")
    unit_path = _optional_path(mapping, "unit_path")
    if unit_path is not None:
        response_unit = _pointer(payload, unit_path)
        if response_unit != unit:
            raise ValueError("response unit does not match the configured unit")
    if not isinstance(unit, str) or not unit.strip():
        raise ValueError("invalid unit")

    kind_value = mapping.get("kind", "custom")
    kind_path = _optional_path(mapping, "kind_path")
    if kind_path is not None:
        kind_value = _pointer(payload, kind_path)
        if not isinstance(kind_value, str) or kind_value not in _SAFE_DYNAMIC_KINDS:
            raise ValueError("response kind is not in the supported kind set")
    kind = _kind(kind_value)

    expires_at = None
    expiry_path = _optional_path(mapping, "expires_at_path") or _optional_path(
        mapping, "expiry_path"
    )
    if expiry_path is not None:
        raw_expiry = _pointer(payload, expiry_path)
        if raw_expiry is not None:
            if not isinstance(raw_expiry, str):
                raise ValueError("expiry must be an ISO timestamp")
            expires_at = datetime.fromisoformat(raw_expiry.replace("Z", "+00:00"))
            if expires_at.tzinfo is None or expires_at.utcoffset() is None:
                raise ValueError("expiry must include timezone")

    status = _snapshot_status(payload, mapping)
    return (
        BalanceItem(
            kind=kind,
            amount=values["amount"],
            unit=unit.strip(),
            total=values["total"],
            remaining=values["remaining"],
            used=values["used"],
            expires_at=expires_at,
            raw_semantics=(
                str(kind_value)
                if kind_path is None and kind is BalanceItemKind.CUSTOM
                else None
            ),
        ),
        status,
    )


def _validate_mapping(mapping: Mapping[str, Any]) -> None:
    path_keys = (
        "total_path",
        "remaining_path",
        "used_path",
        "unit_path",
        "kind_path",
        "status_path",
        "expires_at_path",
        "expiry_path",
        "success_path",
        "failure_path",
    )
    for key in path_keys:
        path = _optional_path(mapping, key)
        if path is not None:
            _validate_pointer_syntax(path)
    amount_path = _optional_path(mapping, "amount_path")
    if amount_path is None:
        raise ValueError("amount_path is required")
    _validate_pointer_syntax(amount_path)
    if (
        _optional_path(mapping, "success_path") is not None
        and "success_value" not in mapping
    ):
        raise ValueError("success_value is required with success_path")
    if (
        _optional_path(mapping, "failure_path") is not None
        and "failure_value" not in mapping
    ):
        raise ValueError("failure_value is required with failure_path")
    if _optional_path(mapping, "status_path") is not None and not isinstance(
        mapping.get("status_values"), Mapping
    ):
        raise ValueError("status_values is required with status_path")


def _optional_path(mapping: Mapping[str, Any], key: str) -> str | None:
    value = mapping.get(key)
    if isinstance(value, str) and not value.strip():
        return None
    return value


def _validate_pointer_syntax(path: Any) -> None:
    if not isinstance(path, str):
        raise ValueError("JSON Pointer must be a string")
    if path == "":
        return
    if not path.startswith("/"):
        raise ValueError("JSON Pointer must be absolute")
    for encoded in path[1:].split("/"):
        if _SEGMENT_ESCAPE.search(encoded):
            raise ValueError("invalid JSON Pointer escape")


class BusinessFailure(Exception):
    pass


def _contains_value(value: Any, target: str) -> bool:
    if isinstance(value, str):
        return value == target
    if isinstance(value, Mapping):
        return any(
            _contains_value(key, target) or _contains_value(item, target)
            for key, item in value.items()
        )
    if isinstance(value, (list, tuple)):
        return any(_contains_value(item, target) for item in value)
    return False


def _snapshot_status(payload: Any, mapping: Mapping[str, Any]) -> SnapshotStatus:
    path = _optional_path(mapping, "status_path")
    if path is None:
        return SnapshotStatus.AVAILABLE
    value = _pointer(payload, path)
    status_map = mapping.get("status_values")
    if not isinstance(status_map, Mapping):
        raise ValueError("status_values mapping is required with status_path")
    for expected, mapped in status_map.items():
        if value == expected:
            try:
                return SnapshotStatus(mapped)
            except (ValueError, TypeError) as exc:
                raise ValueError("invalid mapped snapshot status") from exc
    raise ValueError("unmapped status value")


def _kind(value: Any) -> BalanceItemKind:
    if not isinstance(value, str):
        raise ValueError("kind must be configured as a string")
    try:
        return BalanceItemKind(value)
    except ValueError:
        return BalanceItemKind.CUSTOM


def _decimal(value: Any) -> Decimal:
    if isinstance(value, bool) or isinstance(value, float):
        raise ValueError("amount must preserve decimal precision")
    if not isinstance(value, (Decimal, int, str)):
        raise TypeError("amount must be a JSON number or numeric string")
    try:
        amount = Decimal(value)
    except InvalidOperation as exc:
        raise ValueError("invalid amount") from exc
    if not amount.is_finite() or amount < 0:
        raise ValueError("amount must be finite and non-negative")
    return amount


def _pointer(payload: Any, path: Any) -> Any:
    _validate_pointer_syntax(path)
    if path == "":
        return payload
    current = payload
    for encoded in path[1:].split("/"):
        segment = encoded.replace("~1", "/").replace("~0", "~")
        if isinstance(current, Mapping):
            current = current[segment]
        elif isinstance(current, (list, tuple)):
            if not segment.isdecimal() or (
                len(segment) > 1 and segment.startswith("0")
            ):
                raise ValueError("invalid JSON array index")
            current = current[int(segment)]
        else:
            raise ValueError("JSON Pointer traverses a scalar")
    return current


def _transport_error(exc: Exception) -> NormalizedProviderError:
    if isinstance(exc, HttpStatusError):
        status = exc.status_code
        category, message, diagnostic = _HTTP_ERRORS.get(
            status,
            (
                ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                "余额接口请求暂时失败",
                f"http_{status}" if 400 <= status <= 599 else "http_error",
            ),
        )
        return NormalizedProviderError(category, message, diagnostic)
    if isinstance(exc, HttpTransportError):
        if exc.kind == "timeout":
            return NormalizedProviderError(
                ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
                "余额接口查询超时",
                "timeout",
            )
        return NormalizedProviderError(
            ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
            "余额接口连接失败",
            "connection_error",
        )
    if isinstance(exc, HttpResponseParseError):
        return NormalizedProviderError(
            ProviderErrorCategory.PARSE,
            "余额接口返回的数据格式无法识别",
            "invalid_json",
        )
    if isinstance(exc, HttpRequestError):
        if exc.kind == "insecure_scheme":
            return NormalizedProviderError(
                ProviderErrorCategory.CONFIGURATION,
                "余额接口必须使用 HTTPS",
                "insecure_endpoint",
            )
        return NormalizedProviderError(
            ProviderErrorCategory.CONFIGURATION,
            "余额接口请求配置无效",
            "invalid_request",
        )
    return NormalizedProviderError(
        ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
        "余额接口请求暂时失败",
        "request_error",
    )


def _grsai_http_error(status: int) -> NormalizedProviderError:
    # No provider-specific failure response or HTTP mapping has been verified.
    diagnostic = f"http_{status}" if 400 <= status <= 599 else "http_error"
    return NormalizedProviderError(
        ProviderErrorCategory.TEMPORARILY_UNAVAILABLE,
        "账户积分接口请求失败",
        diagnostic,
    )


def _grsai_transport_error(exc: Exception) -> NormalizedProviderError:
    if isinstance(exc, HttpStatusError):
        return _grsai_http_error(exc.status_code)
    return _transport_error(exc)


def _error_snapshot(
    account_id: str,
    display_name: str,
    error: NormalizedProviderError,
    *,
    source: str = _SOURCE,
    provider_type: ProviderType = ProviderType.OPENAI_COMPATIBLE,
) -> BalanceSnapshot:
    return BalanceSnapshot(
        account_id=account_id,
        provider_type=provider_type,
        display_name=display_name,
        status=SnapshotStatus.UNAVAILABLE,
        balances=(),
        source=source,
        fetched_at=datetime.now(UTC),
        error=error,
    )
