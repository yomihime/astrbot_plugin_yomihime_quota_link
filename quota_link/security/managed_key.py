"""Small durable key selection, extracted from Game Link's key-manager design.

Proven-empty initialization and immutable key files follow Game Link
infrastructure/managed_key_manager.py at
cf755ed4ac455e8be48a9b99c285078cdb696510 (AGPL-3.0; see LICENSE).
Quota Link does not import its SQLite journal, SDK, or runtime. It has one
immutable master key and selector; rotation/reset must be explicit future work.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import re
from pathlib import Path

from .key_provider import EnvironmentKeyProvider, SecretKeyUnavailable
from .managed_key_file import ManagedKeyFileError
from .private_files import PrivateFiles

_KEY_MAGIC = b"QLMK\x01"
_CHECK_CONTEXT = b"quota-link:master-key:check:v1"
_KEY_NAME = "master.key"
_SELECTION_NAME = "selection.json"


class ManagedKeyProvider:
    """Never replace or regenerate an established key, including after loss."""

    def __init__(self, data_root: Path, variable_name: str) -> None:
        self._keys = PrivateFiles(data_root, "keys")
        self._secrets = PrivateFiles(data_root, "secrets")
        self._config = PrivateFiles(data_root, "config")
        self._history = PrivateFiles(data_root, "state")
        self._environment = EnvironmentKeyProvider(variable_name)
        self._variable_name = variable_name

    def _managed_key(self, *, confirm: bool = False) -> bytes:
        reader = self._keys.confirm if confirm else self._keys.read
        raw = reader(_KEY_NAME, len(_KEY_MAGIC) + 33)
        if len(raw) != len(_KEY_MAGIC) + 32 or not raw.startswith(_KEY_MAGIC):
            raise SecretKeyUnavailable()
        return raw[len(_KEY_MAGIC) :]

    @staticmethod
    def _check(key: bytes) -> str:
        return hmac.new(key, _CHECK_CONTEXT, hashlib.sha256).hexdigest()

    def _selection(self) -> dict:
        raw = self._keys.read(_SELECTION_NAME, 1025)
        if len(raw) > 1024:
            raise SecretKeyUnavailable()
        value = json.loads(raw)
        if (
            type(value) is not dict
            or set(value) != {"version", "source", "check"}
            or type(value["version"]) is not int
            or value["version"] != 1
            or value["source"] not in {"managed", "environment"}
            or type(value["check"]) is not str
            or len(value["check"]) != 64
        ):
            raise SecretKeyUnavailable()
        return value

    def _prove_no_manifest_ciphertext(self) -> None:
        """A partial restore may retain refs after losing both key and blobs."""
        names = self._config.entries()
        if not names:
            if self._history.entries():
                raise SecretKeyUnavailable()
            return
        if set(names) != {"accounts.json"}:
            raise SecretKeyUnavailable()
        raw = self._config.read("accounts.json", 2 * 1024 * 1024 + 1)
        if len(raw) > 2 * 1024 * 1024:
            raise SecretKeyUnavailable()
        value = json.loads(raw)
        if (
            type(value) is not dict
            or value.get("schema") != "yomihime-quota-link/config/v1"
            or type(value.get("credentials")) is not dict
        ):
            raise SecretKeyUnavailable()
        for entries in value["credentials"].values():
            if type(entries) is not dict:
                raise SecretKeyUnavailable()
            for entry in entries.values():
                if (
                    type(entry) is not dict
                    or entry.get("source") != "environment"
                    or set(entry) != {"source", "name"}
                    or type(entry["name"]) is not str
                    or not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]{0,127}", entry["name"])
                ):
                    raise SecretKeyUnavailable()

    def get_key(self) -> bytes:
        try:
            # Membership is intentional. Explicit empty/invalid configuration
            # must never fall through to a managed key or create a replacement.
            environment_key = (
                self._environment.get_key()
                if self._variable_name in os.environ
                else None
            )
            names = set(self._keys.entries())
            if names - {_KEY_NAME, _SELECTION_NAME}:
                raise SecretKeyUnavailable()
            if _SELECTION_NAME not in names:
                # Includes corrupt blobs, unknown files, symlinks and failed
                # writes: an unknown inventory is never a fresh installation.
                if self._secrets.entries():
                    raise SecretKeyUnavailable()
                self._prove_no_manifest_ciphertext()
                if _KEY_NAME in names:
                    key = self._managed_key(confirm=True)
                    if environment_key is not None and not hmac.compare_digest(
                        key, environment_key
                    ):
                        raise SecretKeyUnavailable()
                    source = "managed"
                elif environment_key is not None:
                    key, source = environment_key, "environment"
                else:
                    key, source = os.urandom(32), "managed"
                    try:
                        self._keys.create(_KEY_NAME, _KEY_MAGIC + key)
                    except ManagedKeyFileError as error:
                        if error.code != "key_file_exists":
                            raise
                        # Another writer may have initialized first. It must
                        # be a complete valid immutable key, never overwrite.
                        key = self._managed_key(confirm=True)
                candidate = json.dumps(
                    {"version": 1, "source": source, "check": self._check(key)},
                    sort_keys=True,
                    separators=(",", ":"),
                ).encode("ascii")
                try:
                    self._keys.create(_SELECTION_NAME, candidate)
                except ManagedKeyFileError as error:
                    if error.code != "key_file_exists":
                        raise
            selection = self._selection()
            if environment_key is not None:
                key = environment_key
            elif selection["source"] == "managed":
                key = self._managed_key()
            else:
                raise SecretKeyUnavailable(reason="not_provided")
            if not hmac.compare_digest(selection["check"], self._check(key)):
                raise SecretKeyUnavailable()
            return key
        except SecretKeyUnavailable:
            raise
        except (ManagedKeyFileError, OSError, ValueError, TypeError, KeyError):
            raise SecretKeyUnavailable() from None

    def __repr__(self) -> str:
        return "ManagedKeyProvider(<private key selection>)"
