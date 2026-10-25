"""Quota-specific revisioned configuration; credentials never enter admin DTOs.

Uses the portable Game Link secret store, not AstrBot's plaintext shared KV.
All mutation entrypoints are serialized and re-authorize at persistence boundaries.
"""

from __future__ import annotations

import asyncio
import copy
import hashlib
import hmac
import json
import os
import re
import secrets as random_secrets
from collections.abc import Mapping, MutableMapping
from typing import Any

from .security import SecretStoreUnavailable
from .settings import load_settings, migrate_account_templates

GLOBAL_FIELDS = frozenset(
    {
        "timeout_seconds",
        "total_timeout_seconds",
        "cache_ttl_seconds",
        "max_concurrency",
        "command_admin_only",
        "private_allowed_user_ids",
        "allow_group_queries",
        "group_allowed_user_ids",
        "providers",
    }
)
ACCOUNT_FIELDS = frozenset(
    {
        "id",
        "type",
        "__template_key",
        "display_name",
        "aliases",
        "enabled",
        "timeout_seconds",
        "cache_ttl_seconds",
        "service_profile",
        "balance_scope",
        "region",
        "endpoint",
        "advanced_options",
        "response_mapping",
    }
)
SECRET_FIELDS = frozenset(
    {
        "api_key",
        "access_key_id",
        "access_key_secret",
        "security_token",
        "token",
        "secret",
        "key",
    }
)
LEGACY_DEFAULTS = {
    "timeout_seconds": 8.0,
    "total_timeout_seconds": 30.0,
    "cache_ttl_seconds": 60.0,
    "max_concurrency": 4,
    "command_admin_only": True,
    "private_allowed_user_ids": [],
    "allow_group_queries": False,
    "group_allowed_user_ids": [],
    "providers": [],
}
ENV = re.compile(r"[A-Za-z_][A-Za-z0-9_]{0,127}\Z")
ENV_REF = re.compile(r"\$\{([A-Za-z_][A-Za-z0-9_]*)\}\Z")
ENDPOINT_FIELDS = frozenset(
    {"url", "base_url", "path", "method", "auth_mode", "auth_name", "json_body"}
)
MAPPING_FIELDS = frozenset(
    {
        "amount_path",
        "total_path",
        "remaining_path",
        "used_path",
        "unit",
        "unit_path",
        "kind",
        "kind_path",
        "status_path",
        "status_values",
        "expires_at_path",
        "expiry_path",
        "success_path",
        "success_value",
        "failure_path",
        "failure_value",
    }
)


class ConfigValidation(ValueError):
    code = "invalid_config"
    status = 400

    def __init__(self, message="配置无效；请检查字段和数据类型。"):
        super().__init__(message)


class ConfigConflict(ConfigValidation):
    code = "revision_conflict"
    status = 409

    def __init__(self):
        super().__init__("配置已改变，请刷新后重新确认。")


class ConfigUnavailable(ConfigValidation):
    code = "storage_unavailable"
    status = 503

    def __init__(self):
        super().__init__("安全存储暂不可用；未回退到明文，请检查密钥与存储状态。")


def _clone(value):
    try:
        encoded = json.dumps(value, ensure_ascii=False, allow_nan=False)
        if len(encoded.encode()) > 65536:
            raise ValueError
        return json.loads(encoded)
    except (TypeError, ValueError, RecursionError):
        raise ConfigValidation() from None


def _empty():
    return {
        "schema": "yomihime-quota-link/config/v1",
        "revision": 0,
        "config": {"providers": []},
        "credentials": {},
        "migrated": False,
        "legacy_cleanup": None,
    }


class ConfigStore:
    def __init__(self, secrets, legacy: Mapping[str, Any], on_change=None):
        self.secrets = secrets
        self.legacy = legacy
        self.on_change = on_change
        self._lock = asyncio.Lock()
        self._plan_key = random_secrets.token_bytes(32)
        self._fresh_observed = False

    def _read(self):
        try:
            result = self.secrets.read_config()
            if result is None:
                if self.secrets.config_history_exists() and not self._fresh_observed:
                    raise ConfigUnavailable()
                self._fresh_observed = True
                return _empty()
            if (
                type(result) is not dict
                or result.get("schema") != _empty()["schema"]
                or type(result.get("revision")) is not int
                or result["revision"] < 0
                or type(result.get("config")) is not dict
                or type(result.get("credentials")) is not dict
                or type(result.get("migrated")) is not bool
            ):
                raise ConfigUnavailable()
            self._fresh_observed = False
            result["config"] = self._validate(result["config"])
            for account_id, entries in result["credentials"].items():
                if not isinstance(account_id, str) or type(entries) is not dict:
                    raise ConfigUnavailable()
                for field, entry in entries.items():
                    if field not in SECRET_FIELDS or type(entry) is not dict:
                        raise ConfigUnavailable()
                    if entry.get("source") == "encrypted":
                        if (
                            set(entry) != {"source", "ref"}
                            or not isinstance(entry["ref"], str)
                            or not re.fullmatch(
                                r"quota_secret_[0-9a-f]{48}", entry["ref"]
                            )
                        ):
                            raise ConfigUnavailable()
                    elif entry.get("source") == "environment":
                        if (
                            set(entry) != {"source", "name"}
                            or not isinstance(entry["name"], str)
                            or not ENV.fullmatch(entry["name"])
                        ):
                            raise ConfigUnavailable()
                    else:
                        raise ConfigUnavailable()
            return result
        except (SecretStoreUnavailable, OSError, ValueError):
            raise ConfigUnavailable() from None

    def _legacy_config(self):
        return _clone(
            {
                key: value
                for key, value in self.legacy.items()
                if key in GLOBAL_FIELDS and value != LEGACY_DEFAULTS.get(key)
            }
        )

    def _pending(self, manifest):
        return not manifest["migrated"] and bool(self._legacy_config())

    def _plan(self, manifest):
        source = self._legacy_config()
        encoded = json.dumps(source, sort_keys=True, ensure_ascii=False).encode()
        records = source.get("providers", [])
        if not isinstance(records, list):
            raise ConfigValidation()
        values = [
            value
            for record in records
            if isinstance(record, dict)
            if isinstance(record.get("auth", {}), dict)
            for value in record.get("auth", {}).values()
            if isinstance(value, str) and value
        ]
        cleanup = manifest.get("legacy_cleanup")
        matches_cleanup = (
            type(cleanup) is dict
            and set(cleanup) == {"salt", "digest"}
            and isinstance(cleanup["salt"], str)
            and isinstance(cleanup["digest"], str)
            and hmac.compare_digest(
                cleanup["digest"],
                hashlib.sha256(cleanup["salt"].encode() + encoded).hexdigest(),
            )
        )
        return {
            "pending": self._pending(manifest),
            "cleanup_pending": manifest["migrated"]
            and bool(source)
            and matches_cleanup,
            "legacy_conflict": manifest["migrated"]
            and bool(source)
            and not matches_cleanup,
            "account_count": len(records),
            "plaintext_count": sum(
                not bool(ENV_REF.fullmatch(value.strip())) for value in values
            ),
            "environment_count": sum(
                bool(ENV_REF.fullmatch(value.strip())) for value in values
            ),
            "plan_id": hmac.new(self._plan_key, encoded, hashlib.sha256).hexdigest(),
        }

    @staticmethod
    def _has_secret_fields(value):
        if isinstance(value, dict):
            return any(
                str(key).casefold()
                in SECRET_FIELDS | {"authorization", "apikey", "password", "auth"}
                or ConfigStore._has_secret_fields(item)
                for key, item in value.items()
            )
        if isinstance(value, list):
            return any(ConfigStore._has_secret_fields(item) for item in value)
        if isinstance(value, str):
            return "${" in value or "{{" in value or "}}" in value
        return False

    def _legacy_preview(self):
        source = self._legacy_config()
        hidden = set()
        for account in source.get("providers", []):
            if isinstance(account, dict) and isinstance(account.get("auth"), dict):
                for value in account["auth"].values():
                    if isinstance(value, str) and value:
                        hidden.add(value)
                        match = ENV_REF.fullmatch(value.strip())
                        if match and os.environ.get(match[1]):
                            hidden.add(os.environ[match[1]])

        def clean(value):
            if isinstance(value, dict):
                return {
                    key: clean(item)
                    for key, item in value.items()
                    if str(key).casefold()
                    not in SECRET_FIELDS
                    | {"authorization", "apikey", "password", "auth"}
                    and not self._contains_value(str(key), hidden)
                    and not any(token in str(key) for token in ("${", "{{", "}}"))
                }
            if isinstance(value, list):
                return [clean(item) for item in value]
            if isinstance(value, str):
                for secret in sorted(hidden, key=len, reverse=True):
                    value = value.replace(secret, "[已隐藏]")
                if "${" in value or "{{" in value or "}}" in value:
                    return "[已隐藏]"
            return value

        return clean(source)

    @staticmethod
    def _contains_value(value, secrets):
        if isinstance(value, dict):
            return any(
                ConfigStore._contains_value(key, secrets)
                or ConfigStore._contains_value(item, secrets)
                for key, item in value.items()
            )
        if isinstance(value, list):
            return any(ConfigStore._contains_value(item, secrets) for item in value)
        return isinstance(value, str) and any(
            secret and secret in value for secret in secrets
        )

    def _ordinary(self, config):
        result = _clone(config)
        for record in result.get("providers", []):
            if isinstance(record, dict):
                record.pop("auth", None)
        return result

    def _validate(self, config):
        config = _clone(config)
        if type(config) is not dict or set(config) - GLOBAL_FIELDS:
            raise ConfigValidation()
        if self._has_secret_fields(config):
            raise ConfigValidation("凭据只能通过独立凭据操作保存。")
        records = config.get("providers", [])
        if type(records) is not list or len(records) > 100:
            raise ConfigValidation()
        for key, limit in (
            ("timeout_seconds", 120),
            ("total_timeout_seconds", 300),
            ("cache_ttl_seconds", 86400),
            ("max_concurrency", 32),
        ):
            value = config.get(key)
            if value is not None and (
                type(value) not in (int, float) or not 0 < value <= limit
            ):
                raise ConfigValidation()
        ids = set()
        for record in records:
            if type(record) is not dict or set(record) - ACCOUNT_FIELDS:
                raise ConfigValidation()
            account_id = record.get("id")
            if (
                not isinstance(account_id, str)
                or not account_id.strip()
                or account_id != account_id.strip()
                or len(account_id) > 128
                or account_id.casefold() in ids
            ):
                raise ConfigValidation()
            ids.add(account_id.casefold())
            for key, limit in (("timeout_seconds", 120), ("cache_ttl_seconds", 86400)):
                value = record.get(key)
                if value is not None and (
                    type(value) not in (int, float) or not 0 < value <= limit
                ):
                    raise ConfigValidation()
            for key, allowed in (
                ("endpoint", ENDPOINT_FIELDS),
                ("response_mapping", MAPPING_FIELDS),
            ):
                value = record.get(key, {})
                if key == "endpoint" and value is None:
                    continue
                if type(value) is not dict or set(value) - allowed:
                    raise ConfigValidation()
        # Missing credentials are expected on an ordinary-config-only DTO.
        probe = _clone(config)
        for record in probe.get("providers", []):
            record["auth"] = {
                field: "quota-validation-placeholder-not-a-credential"
                for field in SECRET_FIELDS
            }
        parsed = load_settings(probe, environ={})
        permitted = {
            "missing_credentials",
            "missing_grsai_token",
            "missing_environment",
        }
        if any(issue.code not in permitted for issue in parsed.errors):
            raise ConfigValidation()
        if len(parsed.accounts) != len(records):
            raise ConfigValidation()
        for record, account in zip(records, parsed.accounts, strict=True):
            record["type"] = account.provider_type.value
        return config

    def _runtime(self, manifest):
        if self._pending(manifest):
            return self._legacy_config()
        result = _clone(manifest["config"])
        for account in result.get("providers", []):
            auth = {}
            for field, entry in manifest["credentials"].get(account["id"], {}).items():
                if field not in SECRET_FIELDS or type(entry) is not dict:
                    raise ConfigUnavailable()
                if entry.get("source") == "environment":
                    name = entry.get("name")
                    if not isinstance(name, str) or not ENV.fullmatch(name):
                        raise ConfigUnavailable()
                    auth[field] = "${" + name + "}"
                elif entry.get("source") == "encrypted":
                    try:
                        auth[field] = self.secrets.get(entry["ref"]).decode("utf-8")
                    except (SecretStoreUnavailable, UnicodeError, KeyError):
                        # Fail this account closed, never reuse an old secret.
                        auth = {}
                        break
                else:
                    raise ConfigUnavailable()
            account["auth"] = auth
        return result

    def runtime_config(self):
        return self._runtime(self._read())

    def _dto(self, manifest):
        pending = self._pending(manifest)
        config = self._legacy_preview() if pending else _clone(manifest["config"])
        statuses = {}
        for account in config.get("providers", []):
            account_id = account.get("id")
            if not isinstance(account_id, str):
                continue
            entries = manifest["credentials"].get(account_id, {})
            statuses[account_id] = {
                field: {
                    "configured": field in entries,
                    "source": entries.get(field, {}).get("source", "missing"),
                }
                for field in sorted(SECRET_FIELDS)
            }
        return {
            "revision": manifest["revision"],
            "config": config,
            "credentials": statuses,
            "encryption": self.secrets.encryption_readiness(),
            "migration": self._plan(manifest),
        }

    @staticmethod
    def _cas(manifest, body):
        if (
            type(body.get("revision")) is not int
            or body["revision"] != manifest["revision"]
        ):
            raise ConfigConflict()

    def _persist(self, manifest, authorize):
        authorize()
        manifest["revision"] += 1
        try:
            self.secrets.write_config(manifest, authorize=authorize)
            self._fresh_observed = False
        except (SecretStoreUnavailable, OSError, ValueError):
            raise ConfigUnavailable() from None

    async def dispatch(self, operation, body, authorize):
        async with self._lock:
            authorize()
            manifest = self._read()
            previous_refs = {
                entry["ref"]
                for entries in manifest["credentials"].values()
                for entry in entries.values()
                if entry.get("source") == "encrypted"
            }
            if operation == "read" or operation == "credential-status":
                return self._dto(manifest)
            if operation == "legacy-config-plan":
                return self._plan(manifest)
            self._cas(manifest, body)
            if operation == "legacy-config-execute":
                result = self._migrate(manifest, body, authorize)
            else:
                if self._pending(manifest):
                    raise ConfigValidation("请先确认并迁移旧配置，再修改设置。")
                if operation == "update":
                    config = self._validate(body.get("config"))
                    runtime = self._runtime(manifest)
                    values = {
                        value
                        for account in runtime.get("providers", [])
                        for value in account.get("auth", {}).values()
                        if isinstance(value, str) and value
                    }
                    values |= {
                        os.environ[match[1]]
                        for value in tuple(values)
                        if (match := ENV_REF.fullmatch(value.strip()))
                        and os.environ.get(match[1])
                    }
                    if self._contains_value(config, values):
                        raise ConfigValidation("普通配置字段不得包含凭据。")
                    old = {a["id"]: a for a in manifest["config"].get("providers", [])}
                    for account in config.get("providers", []):
                        if account["id"] in old and account.get("type") != old[
                            account["id"]
                        ].get("type"):
                            raise ConfigValidation(
                                "现有账户的供应商类型不可更改；请新建账户。"
                            )
                    manifest["config"] = config
                    kept = {a["id"] for a in config.get("providers", [])}
                    manifest["credentials"] = {
                        key: value
                        for key, value in manifest["credentials"].items()
                        if key in kept
                    }
                elif operation in {"credential-replace", "credential-clear"}:
                    self._credential(manifest, body, operation, authorize)
                else:
                    raise ConfigValidation()
                manifest["migrated"] = True
                self._persist(manifest, authorize)
                result = self._dto(manifest)
            if self.on_change is not None:
                await self.on_change(self._runtime(manifest))
                authorize()
            current_refs = {
                entry["ref"]
                for entries in manifest["credentials"].values()
                for entry in entries.values()
                if entry.get("source") == "encrypted"
            }
            for reference in previous_refs - current_refs:
                authorize()
                try:
                    self.secrets.delete(reference)
                except (SecretStoreUnavailable, ValueError):
                    pass  # Orphaned ciphertext is safe; never roll back a commit.
            return result

    def _credential(self, manifest, body, operation, authorize):
        account_id, field = body.get("account_id"), body.get("field")
        if (
            not isinstance(account_id, str)
            or not isinstance(field, str)
            or field not in SECRET_FIELDS
            or account_id
            not in {a["id"] for a in manifest["config"].get("providers", [])}
        ):
            raise ConfigValidation()
        entries = manifest["credentials"].setdefault(account_id, {})
        if operation == "credential-clear":
            entries.pop(field, None)
            return
        if ("value" in body) == ("environment" in body):
            raise ConfigValidation()
        authorize()
        if "environment" in body:
            name = body["environment"]
            if not isinstance(name, str) or not ENV.fullmatch(name):
                raise ConfigValidation()
            entries[field] = {"source": "environment", "name": name}
        else:
            value = body["value"]
            if (
                not isinstance(value, str)
                or not value.strip()
                or len(value.encode()) > 16384
            ):
                raise ConfigValidation()
            if self._contains_value(manifest["config"], {value}):
                raise ConfigValidation("凭据不得与普通配置字段重复。")
            try:
                ref = self.secrets.put(value.encode())
            except SecretStoreUnavailable:
                raise ConfigUnavailable() from None
            entries[field] = {"source": "encrypted", "ref": ref}

    def _migrate(self, manifest, body, authorize):
        plan = self._plan(manifest)
        if body.get("confirm") is not True or body.get("plan_id") != plan["plan_id"]:
            raise ConfigConflict()
        if not plan["pending"] and not plan["cleanup_pending"]:
            raise ConfigConflict()
        if plan["pending"]:
            source = self._legacy_config()
            migrate_account_templates(source)
            ordinary = self._validate(self._ordinary(source))
            values = {
                value
                for account in source.get("providers", [])
                if isinstance(account.get("auth"), dict)
                for value in account["auth"].values()
                if isinstance(value, str) and value
            }
            values |= {
                os.environ[match[1]]
                for value in tuple(values)
                if (match := ENV_REF.fullmatch(value.strip()))
                and os.environ.get(match[1])
            }
            if self._contains_value(ordinary, values):
                raise ConfigValidation("旧配置的普通字段包含凭据，原配置未删除。")
            credentials = {}
            for account in source.get("providers", []):
                auth = account.get("auth", {})
                if type(auth) is not dict or set(auth) - SECRET_FIELDS:
                    raise ConfigValidation("旧凭据结构无法安全迁移，原配置未删除。")
                entries = {}
                for field, value in auth.items():
                    if value in (None, ""):
                        continue
                    if not isinstance(value, str):
                        raise ConfigValidation()
                    match = ENV_REF.fullmatch(value.strip())
                    if match:
                        entries[field] = {"source": "environment", "name": match[1]}
                    else:
                        authorize()
                        try:
                            entries[field] = {
                                "source": "encrypted",
                                "ref": self.secrets.put(value.encode()),
                            }
                        except SecretStoreUnavailable:
                            raise ConfigUnavailable() from None
                credentials[account["id"]] = entries
            salt = random_secrets.token_hex(32)
            encoded_source = json.dumps(
                self._legacy_config(), sort_keys=True, ensure_ascii=False
            ).encode()
            manifest.update(
                config=ordinary,
                credentials=credentials,
                migrated=True,
                legacy_cleanup={
                    "salt": salt,
                    "digest": hashlib.sha256(
                        salt.encode() + encoded_source
                    ).hexdigest(),
                },
            )
            self._persist(manifest, authorize)
        # Only after durable ciphertext + refs exist do we clean the old source.
        # Failure retains the original in memory and exposes cleanup_pending.
        saver = getattr(self.legacy, "save_config", None)
        if isinstance(self.legacy, MutableMapping) and callable(saver):
            original = copy.deepcopy(dict(self.legacy))
            authorize()
            try:
                for key in GLOBAL_FIELDS:
                    self.legacy[key] = copy.deepcopy(LEGACY_DEFAULTS[key])
                saver()
            except Exception:
                self.legacy.clear()
                self.legacy.update(original)
        return self._dto(manifest)
