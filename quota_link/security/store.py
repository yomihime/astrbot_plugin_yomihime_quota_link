"""Quota-owned encrypted secret refs and safe configuration persistence.

The immutable blob/ref separation and AES-GCM codec are adapted from Game Link
infrastructure/secret_store.py and secret_codec.py at
cf755ed4ac455e8be48a9b99c285078cdb696510 (AGPL-3.0; see LICENSE).
This intentionally does not copy Game Link's SDK/runtime or receipt ledger.
"""

from __future__ import annotations

import json
import re
import secrets
import threading
from collections.abc import Callable
from pathlib import Path

from .managed_key import ManagedKeyProvider
from .managed_key_file import ManagedKeyFileError
from .private_files import PrivateFiles
from .secret_codec import AESGCMSecretCodec

_REF = re.compile(r"quota_secret_[0-9a-f]{48}\Z")
_MAX_SECRET = 1024 * 1024
_MAX_CONFIG = 2 * 1024 * 1024
_CONFIG_NAME = "accounts.json"
_HISTORY_NAME = "config-published.marker"
_HISTORY_PAYLOAD = b"quota-link:config-history:v1\n"


class _AuthorizationFailure(Exception):
    def __init__(self, original: Exception) -> None:
        self.original = original
        super().__init__("configuration authorization was denied")


class SecretStoreUnavailable(RuntimeError):
    code = "secret_store_unavailable"

    def __init__(self) -> None:
        super().__init__("secret storage is unavailable")


class SecretStore:
    """Small synchronous boundary; call from an async worker for filesystem I/O.

    ``data_root`` must be an existing absolute plugin data directory. New files
    are private; unsafe existing paths/permissions fail closed without repair.
    ``put`` creates a fresh immutable reference. Persist it only after success;
    callers publish config atomically, then retire replaced refs with ``delete``.
    Config writes are atomic, not cross-process compare-and-swap transactions.
    """

    def __init__(
        self, data_root: str | Path, *, key_variable: str = "QUOTA_LINK_SECRET_KEY"
    ) -> None:
        try:
            root = Path(data_root)
            self._files = PrivateFiles(root, "secrets")
            self._config = PrivateFiles(root, "config")
            self._history = PrivateFiles(root, "state")
            self._provider = ManagedKeyProvider(root, key_variable)
            self._codec = AESGCMSecretCodec(self._provider)
            self._lock = threading.RLock()
        except (ValueError, TypeError, ManagedKeyFileError):
            raise SecretStoreUnavailable() from None

    @staticmethod
    def _reference(reference: str) -> str:
        if type(reference) is not str or not _REF.fullmatch(reference):
            raise ValueError("invalid secret reference")
        return reference

    def put(self, value: bytes) -> str:
        if type(value) is not bytes or len(value) > _MAX_SECRET:
            raise ValueError("secret payload must be bounded bytes")
        with self._lock:
            reference = "quota_secret_" + secrets.token_hex(24)
            try:
                # Authenticated inner binding prevents a valid blob copied to a
                # different reference from silently yielding another credential.
                encrypted = self._codec.encrypt(
                    reference.encode("ascii") + b"\0" + value
                )
                self._files.create(reference + ".blob", encrypted)
                return reference
            except Exception:
                raise SecretStoreUnavailable() from None

    def get(self, reference: str) -> bytes:
        reference = self._reference(reference)
        with self._lock:
            try:
                raw = self._files.read(reference + ".blob", _MAX_SECRET + 256)
                value = self._codec.decrypt(raw)
                prefix = reference.encode("ascii") + b"\0"
                if (
                    not value.startswith(prefix)
                    or len(value) - len(prefix) > _MAX_SECRET
                ):
                    raise ValueError
                return value[len(prefix) :]
            except Exception:
                raise SecretStoreUnavailable() from None

    def delete(self, reference: str) -> bool:
        reference = self._reference(reference)
        with self._lock:
            try:
                return self._files.delete(reference + ".blob")
            except Exception:
                raise SecretStoreUnavailable() from None

    def put_json(self, value: dict) -> str:
        return self.put(self._encode_json(value, _MAX_SECRET))

    def get_json(self, reference: str) -> dict:
        try:
            result = json.loads(self.get(reference))
            if type(result) is not dict:
                raise ValueError
            return result
        except ValueError:
            raise SecretStoreUnavailable() from None

    @staticmethod
    def _encode_json(value: dict, limit: int) -> bytes:
        if type(value) is not dict:
            raise ValueError("payload must be a JSON object")
        try:
            raw = json.dumps(
                value, ensure_ascii=False, allow_nan=False, separators=(",", ":")
            ).encode("utf-8")
            if len(raw) > limit:
                raise ValueError
            return raw
        except (TypeError, ValueError, OverflowError, RecursionError):
            raise ValueError("payload must be a bounded JSON object") from None

    def read_config(self) -> dict | None:
        """Read the non-secret manifest without initializing or requiring a key."""
        with self._lock:
            try:
                if _CONFIG_NAME not in self._config.entries():
                    return None
                raw = self._config.read(_CONFIG_NAME, _MAX_CONFIG + 1)
                if len(raw) > _MAX_CONFIG:
                    raise ValueError
                result = json.loads(raw)
                if type(result) is not dict:
                    raise ValueError
                return result
            except Exception:
                raise SecretStoreUnavailable() from None

    def config_history_exists(self) -> bool:
        """Conservative evidence of a prior publication attempt or ciphertext.

        The immutable marker is outside the replaceable config directory. A
        failed first publication leaves it behind deliberately: disappearance
        of the manifest must never resurrect the old plaintext configuration.
        This is evidence of history, not proof that the last commit succeeded.
        """
        with self._lock:
            try:
                names = self._history.entries()
                if names:
                    if (
                        set(names) != {_HISTORY_NAME}
                        or self._history.read(_HISTORY_NAME, len(_HISTORY_PAYLOAD) + 1)
                        != _HISTORY_PAYLOAD
                    ):
                        raise ValueError
                    return True
                return bool(self._config.entries() or self._files.entries())
            except Exception:
                raise SecretStoreUnavailable() from None

    def _mark_config_history(self) -> None:
        names = self._history.entries()
        if set(names) - {_HISTORY_NAME}:
            raise SecretStoreUnavailable()
        try:
            self._history.create(_HISTORY_NAME, _HISTORY_PAYLOAD)
        except ManagedKeyFileError as error:
            if error.code != "key_file_exists":
                raise
        # Re-flush a marker left by an interrupted attempt before relying on
        # its persistence to fence a subsequent manifest replacement.
        if (
            self._history.confirm(_HISTORY_NAME, len(_HISTORY_PAYLOAD) + 1)
            != _HISTORY_PAYLOAD
        ):
            raise SecretStoreUnavailable()

    def write_config(
        self, value: dict, authorize: Callable[[], None] | None = None
    ) -> None:
        """Publish refs atomically, with the request's final synchronous fence.

        Callback exceptions propagate unchanged. Storage failures remain
        bounded. The caller must exclude credentials from the manifest.
        """
        if authorize is not None and not callable(authorize):
            raise TypeError("authorization callback must be callable")
        raw = self._encode_json(value, _MAX_CONFIG)

        def final_authorize() -> None:
            if authorize is not None:
                try:
                    authorize()
                except Exception as error:
                    # Private POSIX/Windows I/O normalizes OSError/ValueError.
                    # Carry auth failures through those guards without losing
                    # their public denial type, then unwrap at this boundary.
                    raise _AuthorizationFailure(error) from None

        with self._lock:
            try:
                self._mark_config_history()
                self._config.replace(_CONFIG_NAME, raw, authorize=final_authorize)
            except _AuthorizationFailure as failure:
                raise failure.original.with_traceback(
                    failure.original.__traceback__
                ) from None
            except Exception:
                raise SecretStoreUnavailable() from None

    def encryption_readiness(self, *, diagnostics: bool = False) -> dict:
        """Validate key selection and an in-memory round trip, not stored blobs."""
        if type(diagnostics) is not bool:
            raise ValueError("diagnostics must be boolean")
        with self._lock:
            key_state, codec_state = self._codec.encryption_diagnostics()
            ready = codec_state == "available"
            result = {
                "ready": ready,
                "state": "ready" if ready else "unavailable",
                "reason_code": "ready" if ready else "secret_encryption_unavailable",
            }
            if diagnostics:
                result["diagnostics"] = {
                    "key_state": key_state,
                    "codec_state": codec_state,
                }
            return result

    def __repr__(self) -> str:
        return "SecretStore(<private encrypted storage>)"
