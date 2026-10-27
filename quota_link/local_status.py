"""Small, credential-free view of local credential-storage metadata.

The input DTO may contain private configuration. Only fixed state strings leave
this boundary. Saved records describe local persistence, not provider validity.
"""

from dataclasses import dataclass
from typing import Literal

from .settings import AccountDirectory

StorageState = Literal["unknown", "ready", "migration_pending", "unavailable"]
CredentialState = Literal["encrypted", "environment", "mixed", "missing", "unknown"]

_CREDENTIAL_FIELDS = frozenset(
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
_STORAGE_LABELS = {
    "unknown": "凭据保存状态待确认",
    "ready": "安全存储已就绪",
    "migration_pending": "旧配置待迁移",
    "unavailable": "安全存储待检查",
}
_CREDENTIAL_LABELS = {
    "encrypted": "加密凭据已保存",
    "environment": "环境变量引用已保存",
    "mixed": "加密凭据与环境变量引用已保存",
    "missing": "尚未保存凭据",
    "unknown": "保存状态待确认",
}


@dataclass(frozen=True, slots=True)
class LocalStorageStatus:
    """Fixed labels in account-directory order; no identifiers or raw values."""

    state: StorageState = "unknown"
    account_states: tuple[CredentialState, ...] = ()


def project_storage_status(
    directory: AccountDirectory, dto: object
) -> LocalStorageStatus:
    """Reduce a local ConfigStore DTO without retaining any of its raw values.

    Missing per-account evidence stays unknown. Malformed metadata fails closed
    for the entire projection, so no partial result can claim a saved state.
    """
    unknown = ("unknown",) * len(directory.entries)
    unavailable = LocalStorageStatus("unavailable", unknown)
    if type(dto) is not dict:
        return unavailable
    migration = dto.get("migration")
    encryption = dto.get("encryption")
    credentials = dto.get("credentials")
    if (
        type(migration) is not dict
        or type(migration.get("pending")) is not bool
        or type(encryption) is not dict
        or type(encryption.get("ready")) is not bool
        or type(credentials) is not dict
    ):
        return unavailable
    if not encryption["ready"]:
        return unavailable
    if migration["pending"]:
        return LocalStorageStatus("migration_pending", unknown)

    # Validate every supplied account status, including records absent from the
    # current directory. Raw account keys are used only for in-memory matching.
    states = {}
    for account_id, fields in credentials.items():
        if type(account_id) is not str or type(fields) is not dict:
            return unavailable
        if not fields:
            states[account_id] = "unknown"
            continue
        if set(fields) != _CREDENTIAL_FIELDS:
            return unavailable
        sources = set()
        for metadata in fields.values():
            if (
                type(metadata) is not dict
                or set(metadata) != {"configured", "source"}
                or type(metadata["configured"]) is not bool
                or type(metadata["source"]) is not str
            ):
                return unavailable
            configured, source = metadata["configured"], metadata["source"]
            if configured:
                if source not in {"encrypted", "environment"}:
                    return unavailable
                sources.add(source)
            elif source != "missing":
                return unavailable
        states[account_id] = (
            "mixed"
            if len(sources) == 2
            else next(iter(sources))
            if sources
            else "missing"
        )
    return LocalStorageStatus(
        "ready", tuple(states.get(entry.id, "unknown") for entry in directory.entries)
    )


def storage_summary(status: LocalStorageStatus) -> str:
    """Return fixed, safe text even for an invalid externally built state."""
    return _STORAGE_LABELS.get(status.state, _STORAGE_LABELS["unknown"])


def credential_label(status: LocalStorageStatus, index: int) -> str:
    """Describe a saved record without claiming credential or network validity."""
    if status.state != "ready" or type(index) is not int:
        return _CREDENTIAL_LABELS["unknown"]
    if index < 0 or index >= len(status.account_states):
        return _CREDENTIAL_LABELS["unknown"]
    return _CREDENTIAL_LABELS.get(
        status.account_states[index], _CREDENTIAL_LABELS["unknown"]
    )
