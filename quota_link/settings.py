"""Validated provider account settings and safe name directory."""

from __future__ import annotations

import hashlib
import json
import math
import os
import re
from collections.abc import MutableMapping
from dataclasses import dataclass, field
from types import MappingProxyType
from typing import Any, Mapping
from urllib.parse import urlsplit

from .models import (
    ProviderType,
    QueryParseError,
    QueryParseErrorCode,
    QueryParseResult,
    QueryRequest,
    QueryRequestKind,
)

_ENV_REFERENCE = re.compile(r"^\$\{([A-Za-z_][A-Za-z0-9_]*)\}$")
_DEFAULT_TIMEOUT = 8.0
_DEFAULT_CACHE_TTL = 60.0
_DEFAULT_MAX_CONCURRENCY = 4
_DEFAULT_TOTAL_TIMEOUT = 30.0
_GRSAI_CREDIT_PATH_SCOPES = {
    "/client/openapi/getCredits": "account",
    "/client/openapi/getAPIKeyCredits": "api_key",
}
_GRSAI_ACCOUNT_CREDITS_PATH = "/client/openapi/getCredits"
GRSAI_REGION_HOSTS = {
    "china": "https://grsai.dakka.com.cn",
    "global": "https://grsaiapi.com",
}


@dataclass(frozen=True, slots=True)
class ConfigDiagnostic:
    """Safe configuration issue; never includes raw values."""

    code: str
    path: str
    safe_message: str
    account_id: str | None = None


@dataclass(frozen=True, slots=True)
class EnvironmentReference:
    """Name of an environment variable used for an account credential."""

    variable_name: str


@dataclass(frozen=True, slots=True)
class AccountDirectoryEntry:
    """Credential-free account metadata for help and status output."""

    id: str
    provider_type: ProviderType
    display_name: str
    aliases: tuple[str, ...]
    enabled: bool
    queryable: bool
    unavailable_reason: str | None
    env_references: tuple[EnvironmentReference, ...] = ()
    balance_kind: str = "custom"
    balance_scope: str = "generic"
    service_profile: str = "generic"


@dataclass(frozen=True, slots=True)
class AccountDirectory:
    """Standalone, credential-free view of configured accounts."""

    entries: tuple[AccountDirectoryEntry, ...]
    _account_index: Mapping[str, AccountDirectoryEntry] = field(
        repr=False, compare=False
    )
    _provider_index: Mapping[str, ProviderType] = field(repr=False, compare=False)

    @property
    def provider_aliases(self) -> Mapping[str, ProviderType]:
        """Return the normalized, credential-free provider alias mapping."""
        return self._provider_index

    def resolve_target(self, name: str) -> QueryParseResult:
        """Resolve an account name before considering built-in provider aliases."""
        normalized = normalize_name(name)
        if not normalized:
            return QueryParseResult(
                error=QueryParseError(
                    QueryParseErrorCode.INVALID_INPUT, "目标名称不能为空"
                )
            )
        account = self._account_index.get(normalized)
        if account is not None:
            return QueryParseResult(
                request=QueryRequest(QueryRequestKind.ACCOUNT, account.id)
            )
        provider = self._provider_index.get(normalized)
        if provider is not None:
            return QueryParseResult(
                request=QueryRequest(QueryRequestKind.PROVIDER, provider.value)
            )
        return QueryParseResult(
            error=QueryParseError(
                QueryParseErrorCode.UNKNOWN_TARGET, "未找到匹配的账户或供应商"
            )
        )


@dataclass(frozen=True, slots=True)
class AccountSettings:
    """Validated account data; authentication and endpoint never appear in repr."""

    id: str
    provider_type: ProviderType
    display_name: str
    aliases: tuple[str, ...]
    enabled: bool
    timeout_seconds: float
    cache_ttl_seconds: float
    queryable: bool
    unavailable_reason: str | None
    env_references: tuple[EnvironmentReference, ...]
    auth: Mapping[str, Any] = field(repr=False, compare=False)
    endpoint: Mapping[str, Any] | None = field(repr=False, compare=False)
    response_mapping: Mapping[str, Any] = field(repr=False, compare=False)
    config_fingerprint: str
    balance_kind: str = "custom"
    balance_scope: str = "generic"
    service_profile: str = "generic"
    prefer_split_endpoint: bool = False
    region: str = "china"


@dataclass(frozen=True, slots=True)
class PluginSettings:
    """Validated plugin settings with independent query and display views."""

    accounts: tuple[AccountSettings, ...]
    directory: AccountDirectory
    errors: tuple[ConfigDiagnostic, ...]
    timeout_seconds: float = _DEFAULT_TIMEOUT
    cache_ttl_seconds: float = _DEFAULT_CACHE_TTL
    max_concurrency: int = _DEFAULT_MAX_CONCURRENCY
    total_timeout_seconds: float = _DEFAULT_TOTAL_TIMEOUT
    allow_group_queries: bool = False
    group_allowed_user_ids: tuple[str, ...] = ()

    @property
    def enabled_accounts(self) -> tuple[AccountSettings, ...]:
        return tuple(account for account in self.accounts if account.enabled)

    @property
    def queryable_accounts(self) -> tuple[AccountSettings, ...]:
        return tuple(
            account
            for account in self.accounts
            if account.enabled and account.queryable
        )

    def resolve_target(self, name: str) -> QueryParseResult:
        return self.directory.resolve_target(name)


def normalize_name(value: str) -> str:
    """Normalize user-facing account names consistently."""
    return value.strip().casefold()


def _positive_number(
    value: Any,
    default: float,
    path: str,
    errors: list[ConfigDiagnostic],
    account_id: str | None = None,
) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        errors.append(
            ConfigDiagnostic(
                "invalid_positive_number",
                path,
                f"{path} 必须为正数；已使用默认值",
                account_id,
            )
        )
        return default
    try:
        number = float(value)
    except (OverflowError, ValueError):
        errors.append(
            ConfigDiagnostic(
                "invalid_positive_number",
                path,
                f"{path} 必须为正数；已使用默认值",
                account_id,
            )
        )
        return default
    if not math.isfinite(number) or number <= 0:
        errors.append(
            ConfigDiagnostic(
                "invalid_positive_number",
                path,
                f"{path} 必须为正数；已使用默认值",
                account_id,
            )
        )
        return default
    return number


def _positive_integer(
    value: Any,
    default: int,
    path: str,
    errors: list[ConfigDiagnostic],
) -> int:
    if isinstance(value, bool) or not isinstance(value, int) or value <= 0:
        errors.append(
            ConfigDiagnostic(
                "invalid_positive_integer",
                path,
                f"{path} 必须为正整数；已使用默认值",
            )
        )
        return default
    return value


def _deep_freeze(value: Any) -> Any:
    if isinstance(value, Mapping):
        return MappingProxyType(
            {key: _deep_freeze(item) for key, item in value.items()}
        )
    if isinstance(value, (list, tuple)):
        return tuple(_deep_freeze(item) for item in value)
    return value


def _freeze_mapping(value: Mapping[str, Any] | None) -> Mapping[str, Any] | None:
    if value is None:
        return None
    return _deep_freeze(value)


def _canonical_value(value: Any) -> Any:
    """Convert supported config values to deterministic JSON-safe data."""
    if isinstance(value, Mapping):
        return {
            str(key): _canonical_value(item)
            for key, item in sorted(value.items(), key=lambda pair: str(pair[0]))
        }
    if isinstance(value, (list, tuple)):
        return [_canonical_value(item) for item in value]
    if value is None or isinstance(value, (str, bool, int, float)):
        return value
    return str(value)


def _config_fingerprint(
    provider_type: ProviderType,
    auth: Mapping[str, Any],
    endpoint: Mapping[str, Any] | None,
    response_mapping: Mapping[str, Any],
    timeout_seconds: float,
    service_profile: str = "generic",
    balance_scope: str = "generic",
    prefer_split_endpoint: bool = False,
    region: str = "china",
) -> str:
    payload = {
        "provider_type": provider_type.value,
        "auth": _canonical_value(auth),
        "endpoint": _canonical_value(endpoint),
        "response_mapping": _canonical_value(response_mapping),
        "timeout_seconds": timeout_seconds,
        "service_profile": service_profile,
        "balance_scope": balance_scope,
        "prefer_split_endpoint": prefer_split_endpoint,
        "region": region,
    }
    encoded = json.dumps(
        payload, sort_keys=True, ensure_ascii=False, separators=(",", ":")
    ).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def _resolve_secrets(
    value: Any,
    env: Mapping[str, str],
    missing: list[str],
    references: list[EnvironmentReference],
) -> Any:
    if isinstance(value, str):
        match = _ENV_REFERENCE.fullmatch(value.strip())
        if match:
            env_name = match.group(1)
            references.append(EnvironmentReference(env_name))
            resolved = env.get(env_name)
            if not resolved:
                missing.append(env_name)
                return None
            return resolved
        return value
    if isinstance(value, Mapping):
        return {
            key: _resolve_secrets(item, env, missing, references)
            for key, item in value.items()
        }
    if isinstance(value, (list, tuple)):
        return [_resolve_secrets(item, env, missing, references) for item in value]
    return value


def _has_credential(auth: Mapping[str, Any]) -> bool:
    credential_keys = {
        "api_key",
        "access_key_id",
        "access_key_secret",
        "security_token",
        "token",
        "secret",
        "key",
    }
    return any(
        isinstance(key, str)
        and key.casefold() in credential_keys
        and isinstance(value, str)
        and bool(value.strip())
        for key, value in auth.items()
    )


def _credential_values(auth: Mapping[str, Any]) -> set[str]:
    credential_keys = {
        "api_key",
        "access_key_id",
        "access_key_secret",
        "security_token",
        "token",
        "secret",
        "key",
    }
    return {
        value
        for key, value in auth.items()
        if isinstance(key, str)
        and key.casefold() in credential_keys
        and isinstance(value, str)
        and value.strip()
    }


def _raw_credential_values(value: Any, env: Mapping[str, str]) -> set[str]:
    credential_keys = {
        "api_key",
        "access_key_id",
        "access_key_secret",
        "security_token",
        "token",
        "secret",
        "key",
    }
    found: set[str] = set()

    def visit(item: Any) -> None:
        if not isinstance(item, Mapping):
            return
        for key, nested in item.items():
            if isinstance(key, str) and key.casefold() in credential_keys:
                candidates = nested if isinstance(nested, (list, tuple)) else (nested,)
                for candidate in candidates:
                    if not isinstance(candidate, str):
                        continue
                    match = _ENV_REFERENCE.fullmatch(candidate.strip())
                    secret = env.get(match.group(1)) if match else candidate
                    if secret:
                        found.add(secret)
            visit(nested)

    visit(value)
    return found


def _safe_account_id(
    account_id: str,
    record: Mapping[str, Any],
    env: Mapping[str, str],
    all_secrets: set[str],
) -> str | None:
    secrets = all_secrets | _raw_credential_values(record.get("auth", {}), env)
    return None if any(secret in account_id for secret in secrets) else account_id


def _has_endpoint(endpoint: Any) -> bool:
    if not isinstance(endpoint, Mapping):
        return False
    if isinstance(endpoint.get("url"), str) and endpoint["url"].strip():
        return True
    base_url = endpoint.get("base_url")
    path = endpoint.get("path")
    return (
        isinstance(base_url, str)
        and bool(base_url.strip())
        and isinstance(path, str)
        and bool(path.strip())
    )


def _has_fields(auth: Mapping[str, Any], fields: tuple[str, ...]) -> bool:
    return all(
        isinstance(auth.get(name), str) and bool(auth[name].strip()) for name in fields
    )


def _valid_pointer(value: Any) -> bool:
    return isinstance(value, str) and (
        value == "" or (value.startswith("/") and not re.search(r"~(?![01])", value))
    )


def _grsai_account_config_error(
    auth: Mapping[str, Any], endpoint: Mapping[str, Any] | None
) -> tuple[str, str] | None:
    if not _has_fields(auth, ("token",)):
        return "missing_grsai_token", "missing_grsai_token"
    if not isinstance(endpoint, Mapping):
        return "missing_endpoint", "missing_endpoint"
    base_url = endpoint.get("base_url")
    if not isinstance(base_url, str) or not base_url.strip():
        return "missing_base_url", "missing_base_url"
    if (
        base_url != base_url.strip()
        or "\\" in base_url
        or any(ord(char) < 32 or ord(char) == 127 for char in base_url)
    ):
        return "invalid_base_url", "invalid_base_url"
    try:
        parsed_base = urlsplit(base_url)
        _ = parsed_base.port
    except ValueError:
        return "invalid_base_url", "invalid_base_url"
    if (
        parsed_base.scheme.casefold() != "https"
        or not parsed_base.hostname
        or parsed_base.username is not None
        or parsed_base.password is not None
        or parsed_base.path not in {"", "/"}
        or parsed_base.query
        or parsed_base.fragment
    ):
        return "invalid_base_url", "invalid_base_url"
    if endpoint.get("path", "") not in (None, "", _GRSAI_ACCOUNT_CREDITS_PATH):
        return "grsai_account_path_mismatch", "grsai_account_path_mismatch"
    method = endpoint.get("method", "")
    if method not in (None, "") and (
        not isinstance(method, str) or method.upper() != "POST"
    ):
        return "grsai_method_must_post", "grsai_method_must_post"
    if endpoint.get("json_body") not in (None, {}):
        return "invalid_endpoint", "invalid_endpoint"
    return None


def _compatible_config_error(
    auth: Mapping[str, Any],
    endpoint: Mapping[str, Any] | None,
    mapping: Mapping[str, Any],
    service_profile: str = "generic",
    balance_scope: str = "generic",
    prefer_split_endpoint: bool = False,
) -> tuple[str, str] | None:
    if service_profile == "grsai" and balance_scope == "account":
        return _grsai_account_config_error(auth, endpoint)
    if not _has_fields(auth, ("api_key",)):
        return "missing_credentials", "missing_credentials"
    if not isinstance(endpoint, Mapping):
        return "missing_endpoint", "missing_endpoint"
    raw_url = endpoint.get("url")
    if prefer_split_endpoint or not isinstance(raw_url, str) or not raw_url.strip():
        base_url, path = endpoint.get("base_url"), endpoint.get("path")
        has_base = isinstance(base_url, str) and bool(base_url.strip())
        has_path = isinstance(path, str) and bool(path.strip())
        if not has_base and not has_path:
            return "missing_endpoint", "missing_endpoint"
        if not has_base:
            return "missing_base_url", "missing_base_url"
        if not has_path:
            return "missing_api_path", "missing_api_path"
        if base_url != base_url.strip():
            return "invalid_base_url", "invalid_base_url"
        if path != path.strip():
            return "invalid_api_path", "invalid_api_path"
        try:
            parsed_base = urlsplit(base_url.strip())
            _ = parsed_base.port
        except ValueError:
            return "invalid_base_url", "invalid_base_url"
        if (
            parsed_base.scheme.casefold() != "https"
            or not parsed_base.hostname
            or parsed_base.username is not None
            or parsed_base.password is not None
            or parsed_base.path not in {"", "/"}
            or parsed_base.query
            or parsed_base.fragment
        ):
            return "invalid_base_url", "invalid_base_url"
        try:
            parsed_path = urlsplit(path.strip())
        except ValueError:
            return "invalid_api_path", "invalid_api_path"
        if (
            not path.startswith("/")
            or path.startswith("//")
            or parsed_path.scheme
            or parsed_path.netloc
            or parsed_path.query
            or parsed_path.fragment
            or parsed_path.path != path
            or "\\" in path
        ):
            return "invalid_api_path", "invalid_api_path"
        raw_url = base_url.rstrip("/") + "/" + path.lstrip("/")
    if not isinstance(raw_url, str):
        return "invalid_endpoint", "invalid_endpoint"
    try:
        parsed = urlsplit(raw_url)
        _ = parsed.port
    except ValueError:
        return "invalid_endpoint", "invalid_endpoint"
    if (
        parsed.scheme.casefold() != "https"
        or not parsed.hostname
        or parsed.username is not None
        or parsed.password is not None
        or parsed.query
        or parsed.fragment
    ):
        return "invalid_endpoint", "invalid_endpoint"
    if (
        parsed.path.rstrip("/")
        .casefold()
        .endswith(("/chat/completions", "/completions", "/responses"))
    ):
        return "invalid_endpoint", "invalid_endpoint"
    method = endpoint.get("method", "GET")
    if not isinstance(method, str) or method.upper() not in {"GET", "POST"}:
        return "invalid_endpoint", "invalid_endpoint"
    if (
        service_profile == "grsai"
        and parsed.path in _GRSAI_CREDIT_PATH_SCOPES
        and method.upper() == "GET"
    ):
        return "grsai_method_must_post", "grsai_method_must_post"
    if (
        service_profile == "grsai"
        and parsed.path in _GRSAI_CREDIT_PATH_SCOPES
        and balance_scope != _GRSAI_CREDIT_PATH_SCOPES[parsed.path]
    ):
        return "grsai_balance_scope_mismatch", "grsai_balance_scope_mismatch"
    mode = endpoint.get("auth_mode")
    if not isinstance(mode, str) or mode not in {"bearer", "header", "query"}:
        return "invalid_endpoint", "invalid_endpoint"
    if mode in {"header", "query"}:
        auth_name = endpoint.get("auth_name")
        if not isinstance(auth_name, str) or not auth_name.strip():
            return "invalid_endpoint", "invalid_endpoint"
        if mode == "header" and (
            not re.fullmatch(r"[!#$%&'*+.^_`|~0-9A-Za-z-]+", auth_name)
            or auth_name.casefold() in {"host", "content-length", "connection"}
        ):
            return "invalid_endpoint", "invalid_endpoint"
        if mode == "query" and any(
            ord(char) < 32 or ord(char) == 127 for char in auth_name
        ):
            return "invalid_endpoint", "invalid_endpoint"
    if method.upper() == "POST":
        body = endpoint.get("json_body")
        if not isinstance(body, Mapping):
            return "invalid_endpoint", "invalid_endpoint"
        if _contains_auth_or_template(body):
            return "invalid_endpoint", "invalid_endpoint"
        try:
            json.dumps(body, allow_nan=False)
        except (TypeError, ValueError):
            return "invalid_endpoint", "invalid_endpoint"
    else:
        body = endpoint.get("json_body")
        if body not in (None, {}):
            return "invalid_endpoint", "invalid_endpoint"
    amount_path = mapping.get("amount_path")
    if not _valid_pointer(amount_path) or not amount_path.strip():
        return "invalid_response_mapping", "invalid_response_mapping"
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
    if any(key in mapping and not _valid_pointer(mapping[key]) for key in path_keys):
        return "invalid_response_mapping", "invalid_response_mapping"
    if "status_path" in mapping and not isinstance(
        mapping.get("status_values"), Mapping
    ):
        return "invalid_response_mapping", "invalid_response_mapping"
    unit = mapping.get("unit", "custom")
    if "unit_path" in mapping and "unit" not in mapping:
        return "invalid_response_mapping", "invalid_response_mapping"
    if not isinstance(unit, str) or unit not in {
        "CNY",
        "USD",
        "JPY",
        "credit",
        "credits",
        "tokens",
        "requests",
        "custom",
    }:
        return "invalid_response_mapping", "invalid_response_mapping"
    kind = mapping.get("kind", "custom")
    if not isinstance(kind, str) or kind not in {
        "cash",
        "quota",
        "free_quota",
        "subscription",
        "credits",
        "usage",
        "custom",
    }:
        return "invalid_response_mapping", "invalid_response_mapping"
    if "status_values" in mapping:
        status_values = mapping["status_values"]
        if not isinstance(status_values, Mapping) or any(
            not isinstance(value, str)
            or value not in {"available", "unavailable", "partial", "unknown"}
            for value in status_values.values()
        ):
            return "invalid_response_mapping", "invalid_response_mapping"
    if "success_path" in mapping and "success_value" not in mapping:
        return "invalid_response_mapping", "invalid_response_mapping"
    if "failure_path" in mapping and "failure_value" not in mapping:
        return "invalid_response_mapping", "invalid_response_mapping"
    return None


def _contains_auth_or_template(value: Any) -> bool:
    if isinstance(value, str):
        return "${" in value or "{{" in value or "}}" in value
    if isinstance(value, Mapping):
        return any(
            (
                isinstance(key, str)
                and key.casefold()
                in {"authorization", "api_key", "apikey", "token", "secret", "password"}
            )
            or _contains_auth_or_template(key)
            or _contains_auth_or_template(item)
            for key, item in value.items()
        )
    if isinstance(value, (list, tuple)):
        return any(_contains_auth_or_template(item) for item in value)
    return False


def _provider_aliases() -> dict[str, ProviderType]:
    aliases = {
        "alibaba_bailian": (
            "alibaba_bailian",
            "alibaba bailian",
            "百炼",
            "阿里百炼",
            "阿里云百炼",
            "dashscope",
        ),
        "deepseek": ("deepseek", "ds", "深度求索"),
        "grsai": ("grsai",),
        "openai_compatible": (
            "openai_compatible",
            "openai compatible",
            "openai-compatible",
        ),
    }
    return {
        normalize_name(alias): ProviderType(provider)
        for provider, names in aliases.items()
        for alias in names
    }


def migrate_account_templates(config: MutableMapping[str, Any]) -> bool:
    """Retag old WebUI entries while preserving Grsai node selection."""
    records = config.get("providers")
    if not isinstance(records, list):
        return False
    changed = False
    supported = {provider.value for provider in ProviderType}
    for record in records:
        if not isinstance(record, MutableMapping):
            continue
        provider_type = record.get("type")
        template_key = record.get("__template_key")
        if provider_type == ProviderType.GRSAI.value and "region" not in record:
            endpoint = record.get("endpoint")
            legacy_host = (
                endpoint.get("base_url") if isinstance(endpoint, Mapping) else None
            )
            if isinstance(legacy_host, str) and legacy_host.strip():
                inferred = next(
                    (
                        region
                        for region, host in GRSAI_REGION_HOSTS.items()
                        if legacy_host.rstrip("/") == host
                    ),
                    None,
                )
                if inferred is not None:
                    record["region"] = inferred
                    changed = True
                elif template_key == ProviderType.GRSAI.value:
                    # Keep WebUI defaults from silently switching an unknown
                    # existing Host to the domestic node.
                    record["region"] = "invalid_legacy_host"
                    changed = True
            elif isinstance(endpoint, Mapping) and endpoint.get("url"):
                if template_key == ProviderType.GRSAI.value:
                    record["region"] = "invalid_legacy_host"
                    changed = True
        if (
            provider_type == ProviderType.OPENAI_COMPATIBLE.value
            and template_key == ProviderType.OPENAI_COMPATIBLE.value
        ):
            endpoint = record.get("endpoint")
            if isinstance(endpoint, Mapping):
                url = endpoint.get("url")
                if (
                    isinstance(url, str)
                    and url.strip()
                    # A complete Host/Path pair may be a newer configuration.
                    # Preserve that ambiguous record instead of changing its UI.
                    and not all(
                        endpoint.get(key) not in (None, "")
                        for key in ("base_url", "path")
                    )
                ):
                    record["__template_key"] = "provider_account"
                    changed = True
            continue
        if template_key != "provider_account":
            continue
        if isinstance(provider_type, str) and provider_type in supported:
            # Keep legacy compatible accounts on the editable legacy template:
            # it still exposes endpoint.url, which takes precedence at runtime.
            if provider_type == ProviderType.OPENAI_COMPATIBLE.value:
                continue
            if provider_type == ProviderType.GRSAI.value and "region" not in record:
                endpoint = record.get("endpoint")
                if isinstance(endpoint, Mapping) and any(
                    endpoint.get(key) for key in ("base_url", "url")
                ):
                    # Unknown old Host must remain on the old template; the
                    # Grsai template would fill a default region in the UI.
                    continue
            record["__template_key"] = provider_type
            changed = True
    return changed


def load_settings(
    raw: Mapping[str, Any] | None,
    *,
    environ: Mapping[str, str] | None = None,
) -> PluginSettings:
    """Parse raw plugin configuration while keeping broken accounts local.

    Account records are read from ``providers``. Invalid records are reported and
    skipped; accounts missing credentials or endpoint remain in the directory as
    unavailable entries and do not prevent healthy records from loading.
    """
    env = os.environ if environ is None else environ
    errors: list[ConfigDiagnostic] = []
    raw = {} if raw is None else raw
    if not isinstance(raw, Mapping):
        errors.append(ConfigDiagnostic("invalid_root", "$", "配置根节点必须是映射"))
        raw = {}

    timeout = _positive_number(
        raw.get("timeout_seconds", _DEFAULT_TIMEOUT),
        _DEFAULT_TIMEOUT,
        "timeout_seconds",
        errors,
    )
    ttl = _positive_number(
        raw.get("cache_ttl_seconds", _DEFAULT_CACHE_TTL),
        _DEFAULT_CACHE_TTL,
        "cache_ttl_seconds",
        errors,
    )
    max_concurrency = _positive_integer(
        raw.get("max_concurrency", _DEFAULT_MAX_CONCURRENCY),
        _DEFAULT_MAX_CONCURRENCY,
        "max_concurrency",
        errors,
    )
    total_timeout = _positive_number(
        raw.get("total_timeout_seconds", _DEFAULT_TOTAL_TIMEOUT),
        _DEFAULT_TOTAL_TIMEOUT,
        "total_timeout_seconds",
        errors,
    )
    allow_group_queries = raw.get("allow_group_queries", False)
    if not isinstance(allow_group_queries, bool):
        errors.append(
            ConfigDiagnostic(
                "invalid_boolean",
                "allow_group_queries",
                "allow_group_queries 必须为布尔值；已使用默认值",
            )
        )
        allow_group_queries = False
    group_ids_raw = raw.get("group_allowed_user_ids", ())
    if not isinstance(group_ids_raw, (list, tuple)) or any(
        not isinstance(user_id, str) or not user_id.strip() for user_id in group_ids_raw
    ):
        errors.append(
            ConfigDiagnostic(
                "invalid_user_ids",
                "group_allowed_user_ids",
                "group_allowed_user_ids 必须为非空文本列表；已使用空列表",
            )
        )
        group_allowed_user_ids: tuple[str, ...] = ()
    else:
        group_allowed_user_ids = tuple(
            dict.fromkeys(user_id.strip() for user_id in group_ids_raw)
        )
    records = raw.get("providers", ())
    if not isinstance(records, (list, tuple)):
        errors.append(
            ConfigDiagnostic("invalid_providers", "providers", "providers 必须为列表")
        )
        records = ()
    all_secrets = {
        secret
        for record in records
        if isinstance(record, Mapping)
        for secret in _raw_credential_values(record.get("auth", {}), env)
    }

    parsed: list[AccountSettings] = []
    parsed_paths: list[str] = []
    ids: set[str] = set()
    name_owners: dict[str, set[int]] = {}
    for index, record in enumerate(records):
        path = f"providers[{index}]"
        if not isinstance(record, Mapping):
            errors.append(
                ConfigDiagnostic("invalid_account", path, "账户配置必须为映射")
            )
            continue
        account_id = record.get("id")
        display_name = record.get("display_name")
        template_key = record.get("__template_key")
        template_type = (
            template_key
            if isinstance(template_key, str)
            and template_key in {item.value for item in ProviderType}
            else None
        )
        provider_raw = record.get("type", template_type)
        if not isinstance(account_id, str) or not account_id.strip():
            errors.append(
                ConfigDiagnostic("invalid_id", f"{path}.id", "账户 id 必须为非空文本")
            )
            continue
        account_id = account_id.strip()
        safe_account_id = _safe_account_id(account_id, record, env, all_secrets)
        normalized_id = normalize_name(account_id)
        if not isinstance(provider_raw, str):
            errors.append(
                ConfigDiagnostic(
                    "unknown_type", f"{path}.type", "未知供应商类型", safe_account_id
                )
            )
            continue
        try:
            provider_type = ProviderType(provider_raw.strip().casefold())
        except ValueError:
            errors.append(
                ConfigDiagnostic(
                    "unknown_type", f"{path}.type", "未知供应商类型", safe_account_id
                )
            )
            continue
        if template_type is not None and provider_type.value != template_type:
            errors.append(
                ConfigDiagnostic(
                    "template_type_mismatch",
                    f"{path}.type",
                    "账户模板与供应商类型不一致",
                    safe_account_id,
                )
            )
            continue
        if not isinstance(display_name, str) or not display_name.strip():
            errors.append(
                ConfigDiagnostic(
                    "invalid_display_name",
                    f"{path}.display_name",
                    "display_name 必须为非空文本",
                    safe_account_id,
                )
            )
            continue
        display_name = display_name.strip()
        aliases_raw = record.get("aliases", ())
        if not isinstance(aliases_raw, (list, tuple)) or any(
            not isinstance(alias, str) or not alias.strip() for alias in aliases_raw
        ):
            errors.append(
                ConfigDiagnostic(
                    "invalid_aliases",
                    f"{path}.aliases",
                    "aliases 必须为非空文本列表",
                    safe_account_id,
                )
            )
            continue
        if normalized_id in ids:
            errors.append(
                ConfigDiagnostic(
                    "duplicate_id", f"{path}.id", "账户 id 重复", safe_account_id
                )
            )
            continue
        aliases: list[str] = []
        own_names: set[str] = set()
        for name in (account_id, display_name, *aliases_raw):
            cleaned = name.strip()
            key = normalize_name(cleaned)
            if key and key not in own_names:
                own_names.add(key)
                # Preserve first spelling, including the canonical id/display name.
                if key not in {
                    normalize_name(account_id),
                    normalize_name(display_name),
                }:
                    aliases.append(cleaned)
        auth_raw = record.get("auth", {})
        if not isinstance(auth_raw, Mapping):
            auth_raw = {}
            errors.append(
                ConfigDiagnostic(
                    "invalid_auth", f"{path}.auth", "auth 必须为映射", safe_account_id
                )
            )
        missing_env: list[str] = []
        env_references: list[EnvironmentReference] = []
        auth = _resolve_secrets(auth_raw, env, missing_env, env_references)
        endpoint_raw = record.get("endpoint")
        # Native Grsai chooses a documented node by region. Stale Host fields
        # from earlier versions are ignored, including endpoint.url.
        endpoint = (
            {}
            if provider_type is ProviderType.GRSAI
            else endpoint_raw
            if isinstance(endpoint_raw, Mapping)
            else None
        )
        prefer_split_endpoint = (
            template_key == ProviderType.OPENAI_COMPATIBLE.value
            and isinstance(endpoint, Mapping)
            and all(
                isinstance(endpoint.get(key), str) and endpoint[key].strip()
                for key in ("base_url", "path")
            )
        )
        if (
            provider_type is not ProviderType.GRSAI
            and endpoint_raw is not None
            and endpoint is None
        ):
            errors.append(
                ConfigDiagnostic(
                    "invalid_endpoint",
                    f"{path}.endpoint",
                    "endpoint 必须为映射",
                    safe_account_id,
                )
            )
        response_mapping_raw = record.get("response_mapping", {})
        if not isinstance(response_mapping_raw, Mapping):
            response_mapping = {}
            errors.append(
                ConfigDiagnostic(
                    "invalid_response_mapping",
                    f"{path}.response_mapping",
                    "response_mapping 必须为映射；已使用空映射",
                    safe_account_id,
                )
            )
        else:
            response_mapping = dict(response_mapping_raw)
            for mapping_key in (
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
            ):
                value = response_mapping.get(mapping_key)
                if isinstance(value, str) and not value.strip():
                    response_mapping.pop(mapping_key)
        service_profile = "generic"
        balance_scope = (
            "account"
            if provider_type in {ProviderType.DEEPSEEK, ProviderType.ALIBABA_BAILIAN}
            else "generic"
        )
        balance_kind = (
            "cash"
            if provider_type in {ProviderType.DEEPSEEK, ProviderType.ALIBABA_BAILIAN}
            else "custom"
        )
        capability_issue: tuple[str, str] | None = None
        region = "china"
        if provider_type is ProviderType.GRSAI:
            service_profile = "grsai"
            balance_scope = "account"
            balance_kind = "credits"
            raw_region = record.get("region")
            if raw_region is None:
                legacy_host = (
                    endpoint_raw.get("base_url")
                    if isinstance(endpoint_raw, Mapping)
                    else None
                )
                if isinstance(legacy_host, str) and legacy_host.strip():
                    raw_region = next(
                        (
                            key
                            for key, host in GRSAI_REGION_HOSTS.items()
                            if legacy_host.rstrip("/") == host
                        ),
                        None,
                    )
                elif isinstance(endpoint_raw, Mapping) and endpoint_raw.get("url"):
                    # A stale full URL cannot identify the chosen region safely.
                    raw_region = None
                else:
                    raw_region = "china"
            if isinstance(raw_region, str) and raw_region in GRSAI_REGION_HOSTS:
                region = raw_region
            else:
                capability_issue = (
                    "invalid_grsai_region",
                    "Grsai 节点只能选择国内直连或海外",
                )
            raw_scope = record.get("balance_scope", "account")
            if raw_scope != "account":
                balance_scope = raw_scope if isinstance(raw_scope, str) else "generic"
                capability_issue = (
                    "invalid_balance_scope",
                    "Grsai 当前仅支持账户积分，API Key 积分预设尚未实现",
                )
        if provider_type is ProviderType.OPENAI_COMPATIBLE:
            raw_profile = record.get("service_profile", "generic")
            raw_scope = record.get("balance_scope", "generic")
            if not isinstance(raw_profile, str) or raw_profile not in {
                "generic",
                "grsai",
            }:
                capability_issue = (
                    "invalid_service_profile",
                    "兼容服务类型只能是 generic 或 grsai",
                )
            elif not isinstance(raw_scope, str) or raw_scope not in {
                "generic",
                "account",
                "api_key",
            }:
                capability_issue = (
                    "invalid_balance_scope",
                    "余额范围只能是 generic、account 或 api_key",
                )
            elif raw_profile == "grsai" and raw_scope == "generic":
                capability_issue = (
                    "invalid_balance_scope",
                    "Grsai 当前仅支持账户积分预设",
                )
            elif raw_profile == "grsai" and raw_scope == "api_key":
                service_profile = raw_profile
                balance_scope = raw_scope
                capability_issue = (
                    "invalid_balance_scope",
                    "Grsai API Key 积分预设尚未实现，请选择账户积分",
                )
            elif raw_profile != "grsai" and raw_scope != "generic":
                capability_issue = (
                    "invalid_balance_scope",
                    "账户余额或 API Key 余额范围仅适用于已选择的 Grsai 服务",
                )
            else:
                service_profile = raw_profile
                balance_scope = raw_scope
            configured_kind = response_mapping.get("kind", "custom")
            if service_profile == "grsai" and balance_scope in {"account", "api_key"}:
                balance_kind = "credits"
            elif isinstance(configured_kind, str) and configured_kind in {
                "cash",
                "quota",
                "free_quota",
                "subscription",
                "credits",
                "usage",
                "custom",
            }:
                balance_kind = configured_kind
        enabled = record.get("enabled", True) is True
        if "enabled" in record and not isinstance(record["enabled"], bool):
            errors.append(
                ConfigDiagnostic(
                    "invalid_enabled",
                    f"{path}.enabled",
                    "enabled 必须为布尔值；已禁用账户",
                    safe_account_id,
                )
            )
            enabled = False
        account_timeout = _positive_number(
            record.get("timeout_seconds", timeout),
            _DEFAULT_TIMEOUT,
            f"{path}.timeout_seconds",
            errors,
            safe_account_id,
        )
        account_ttl = _positive_number(
            record.get("cache_ttl_seconds", ttl),
            _DEFAULT_CACHE_TTL,
            f"{path}.cache_ttl_seconds",
            errors,
            safe_account_id,
        )
        reason = None
        if capability_issue is not None:
            code, safe_message = capability_issue
            reason = code
            diagnostic_field = (
                "response_mapping.kind"
                if code == "invalid_balance_kind"
                else "service_profile"
                if code == "invalid_service_profile"
                else "region"
                if code == "invalid_grsai_region"
                else "balance_scope"
            )
            errors.append(
                ConfigDiagnostic(
                    code,
                    f"{path}.{diagnostic_field}",
                    safe_message,
                    safe_account_id,
                )
            )
        elif missing_env:
            reason = "missing_environment_variable"
            errors.append(
                ConfigDiagnostic(
                    "missing_environment_variable",
                    f"{path}.auth",
                    "引用的凭据环境变量未设置",
                    safe_account_id,
                )
            )
        elif provider_type is ProviderType.DEEPSEEK and not _has_fields(
            auth, ("api_key",)
        ):
            reason = "missing_credentials"
            errors.append(
                ConfigDiagnostic(
                    "missing_credentials",
                    f"{path}.auth",
                    "缺少可用凭据",
                    safe_account_id,
                )
            )
        elif provider_type is ProviderType.ALIBABA_BAILIAN and not _has_fields(
            auth, ("access_key_id", "access_key_secret")
        ):
            reason = "missing_credentials"
            errors.append(
                ConfigDiagnostic(
                    "missing_credentials",
                    f"{path}.auth",
                    "阿里云 BSS 查询需要独立 AccessKey ID 和 AccessKey Secret",
                    safe_account_id,
                )
            )
        elif provider_type in {ProviderType.OPENAI_COMPATIBLE, ProviderType.GRSAI}:
            issue = (
                (
                    ("missing_grsai_token", "missing_grsai_token")
                    if not _has_fields(auth, ("token",))
                    else None
                )
                if provider_type is ProviderType.GRSAI
                else _compatible_config_error(
                    auth,
                    endpoint,
                    response_mapping,
                    service_profile,
                    balance_scope,
                    prefer_split_endpoint,
                )
            )
            if issue is not None:
                code, reason = issue
                field_path = {
                    "missing_credentials": f"{path}.auth",
                    "missing_grsai_token": f"{path}.auth.token",
                    "missing_endpoint": f"{path}.endpoint",
                    "missing_base_url": f"{path}.endpoint.base_url",
                    "missing_api_path": f"{path}.endpoint.path",
                    "invalid_endpoint": f"{path}.endpoint",
                    "grsai_method_must_post": f"{path}.endpoint.method",
                    "grsai_account_path_mismatch": f"{path}.endpoint.path",
                    "grsai_balance_scope_mismatch": f"{path}.balance_scope",
                    "invalid_balance_kind": f"{path}.response_mapping.kind",
                    "invalid_base_url": f"{path}.endpoint.base_url",
                    "invalid_api_path": f"{path}.endpoint.path",
                    "invalid_response_mapping": f"{path}.response_mapping",
                }.get(code, f"{path}.endpoint")
                messages = {
                    "missing_credentials": "兼容接口需要配置 API 密钥",
                    "missing_grsai_token": "Grsai 账户积分需要用户信息中的请求令牌 token",
                    "missing_endpoint": "缺少余额查询端点",
                    "missing_base_url": "请填写 HTTPS 服务根地址 Host",
                    "missing_api_path": "请填写以 / 开头的相对 API Path",
                    "invalid_endpoint": "余额端点必须是安全的 HTTPS GET 或 POST 配置",
                    "grsai_method_must_post": "该 Grsai 积分端点要求使用 POST",
                    "grsai_account_path_mismatch": "Grsai 账户积分仅支持 /client/openapi/getCredits",
                    "grsai_balance_scope_mismatch": "Grsai getCredits 端点应选择 account；getAPIKeyCredits 端点应选择 api_key",
                    "invalid_balance_kind": "Grsai 积分查询必须将 kind 固定映射为 credits",
                    "invalid_base_url": "Host 必须是没有路径、查询参数或片段的 HTTPS 服务根地址",
                    "invalid_api_path": "API Path 必须以单个 / 开头，且不能包含完整 URL、查询参数或片段",
                    "invalid_response_mapping": "兼容接口必须配置有效的 amount_path 映射",
                }
                errors.append(
                    ConfigDiagnostic(code, field_path, messages[code], safe_account_id)
                )
        secret_values = all_secrets | _credential_values(auth)
        if any(
            any(secret in name for secret in secret_values)
            for name in (account_id, display_name, *aliases)
        ):
            errors.append(
                ConfigDiagnostic(
                    "secret_in_name", path, "账户名称不得包含凭据", safe_account_id
                )
            )
            continue
        ids.add(normalized_id)
        frozen_auth = _freeze_mapping(auth)
        frozen_endpoint = _freeze_mapping(endpoint)
        frozen_response_mapping = _freeze_mapping(response_mapping)
        fingerprint = _config_fingerprint(
            provider_type,
            auth,
            endpoint,
            response_mapping,
            account_timeout,
            service_profile,
            balance_scope,
            prefer_split_endpoint,
            region,
        )
        candidate = AccountSettings(
            id=account_id,
            provider_type=provider_type,
            display_name=display_name,
            aliases=tuple(aliases),
            enabled=enabled,
            timeout_seconds=account_timeout,
            cache_ttl_seconds=account_ttl,
            queryable=reason is None,
            unavailable_reason=reason,
            env_references=tuple(dict.fromkeys(env_references)),
            auth=frozen_auth,
            endpoint=frozen_endpoint,
            response_mapping=frozen_response_mapping,
            config_fingerprint=fingerprint,
            balance_kind=balance_kind,
            balance_scope=balance_scope,
            service_profile=service_profile,
            prefer_split_endpoint=prefer_split_endpoint,
            region=region,
        )
        parsed.append(candidate)
        parsed_paths.append(path)
        for key in own_names:
            name_owners.setdefault(key, set()).add(len(parsed) - 1)

    conflicted = {
        owner for owners in name_owners.values() if len(owners) > 1 for owner in owners
    }
    conflict_owners: set[int] = set()
    for owners in name_owners.values():
        if len(owners) > 1:
            conflict_owners.update(owners)
    for owner in sorted(conflict_owners):
        errors.append(
            ConfigDiagnostic(
                "name_conflict",
                parsed_paths[owner],
                "账户名称与其他账户冲突",
                parsed[owner].id,
            )
        )
    accounts = tuple(
        account for pos, account in enumerate(parsed) if pos not in conflicted
    )
    entries = tuple(
        AccountDirectoryEntry(
            account.id,
            account.provider_type,
            account.display_name,
            account.aliases,
            account.enabled,
            account.queryable,
            account.unavailable_reason,
            account.env_references,
            account.balance_kind,
            account.balance_scope,
            account.service_profile,
        )
        for account in accounts
    )
    account_index: dict[str, AccountDirectoryEntry] = {}
    for entry in entries:
        if entry.enabled:
            for name in (entry.id, entry.display_name, *entry.aliases):
                account_index[normalize_name(name)] = entry
    directory = AccountDirectory(
        entries=entries,
        _account_index=MappingProxyType(account_index),
        _provider_index=MappingProxyType(_provider_aliases()),
    )
    return PluginSettings(
        accounts=accounts,
        directory=directory,
        errors=tuple(errors),
        timeout_seconds=timeout,
        cache_ttl_seconds=ttl,
        max_concurrency=max_concurrency,
        total_timeout_seconds=total_timeout,
        allow_group_queries=allow_group_queries,
        group_allowed_user_ids=group_allowed_user_ids,
    )
