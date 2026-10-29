"""Field-owned acceptance cleanup over the normal public read/CAS API.

This module has no file, secret, HTTP, or runtime access. The caller supplies an
authenticated normal ConfigStore dispatch and must quiesce test engines first.
An ownership receipt contains public configuration only, never credentials.
"""

from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass
from typing import Any

from quota_link.config_store import ACCOUNT_FIELDS, GLOBAL_FIELDS, ConfigConflict


@dataclass(frozen=True)
class Value:
    present: bool
    value: Any = None


@dataclass(frozen=True)
class OwnedField:
    account_id: str | None
    path: tuple[str, ...]
    before: Value
    after: Value


@dataclass(frozen=True)
class OwnedAccount:
    """A newly created account: remove only if public record is still exact."""

    record: dict


def _public(value):
    if isinstance(value, dict):
        if any(
            str(k).casefold()
            in {
                "auth",
                "credentials",
                "ref",
                "api_key",
                "token",
                "access_key_id",
                "access_key_secret",
                "password",
            }
            for k in value
        ):
            raise ValueError("public configuration only")
        for item in value.values():
            _public(item)
    elif isinstance(value, (list, tuple)):
        for item in value:
            _public(item)
    elif value is not None and type(value) not in (str, int, float, bool):
        raise ValueError("invalid public value")


def _get(mapping, path):
    for key in path[:-1]:
        if not isinstance(mapping, dict) or key not in mapping:
            return Value(False)
        mapping = mapping[key]
    if not isinstance(mapping, dict) or path[-1] not in mapping:
        return Value(False)
    return Value(True, deepcopy(mapping[path[-1]]))


def _put(mapping, path, value):
    for key in path[:-1]:
        if key not in mapping:
            mapping[key] = {}
        if not isinstance(mapping[key], dict):
            raise ValueError("changed parent shape")
        mapping = mapping[key]
    if value.present:
        mapping[path[-1]] = deepcopy(value.value)
    else:
        mapping.pop(path[-1], None)


def _targets(current, field):
    """Restore owned target entries while preserving concurrent added UMOs."""
    if not current.present or type(current.value) is not list:
        return None
    if any(
        v.present and type(v.value) is not list for v in (field.before, field.after)
    ):
        return None
    # An absent target field has the same target identities as an empty list.
    # Keep its original presence when no concurrent target survives cleanup.
    lists = [current.value] + [
        v.value if v.present else [] for v in (field.before, field.after)
    ]
    indexes = []
    for items in lists:
        if any(type(v) is not dict or type(v.get("umo")) is not str for v in items):
            return None
        index = {v["umo"]: v for v in items}
        if len(index) != len(items):
            return None
        indexes.append(index)
    now, before, after = indexes
    result = deepcopy(lists[0])
    for umo in before.keys() | after.keys():
        old, owned, actual = before.get(umo), after.get(umo), now.get(umo)
        if old == owned:
            continue
        if actual != owned:
            return None  # Same target edited: preserve all, report conflict.
        result = [v for v in result if v["umo"] != umo]
        if old is not None:
            result.append(deepcopy(old))
    return (
        Value(False) if not result and not field.before.present else Value(True, result)
    )


def merge_owned(dto, fields=(), accounts=()):
    """Return fresh merged config and conflicts, with no mutation of the DTO."""
    if type(dto) is not dict or type(dto.get("revision")) is not int:
        raise ValueError("normal public DTO required")
    config = deepcopy(dto["config"])
    _public(config)
    providers = config.get("providers", [])
    if type(providers) is not list or any(type(a) is not dict for a in providers):
        raise ValueError("invalid providers")
    ids = [a.get("id") for a in providers]
    if len(ids) != len(set(ids)):
        raise ValueError("ambiguous account IDs")
    conflicts = []
    selected = set()
    for field in fields:
        if (
            not isinstance(field, OwnedField)
            or not field.path
            or any(type(p) is not str for p in field.path)
        ):
            raise ValueError("invalid ownership receipt")
        allowed = (
            GLOBAL_FIELDS - {"providers"}
            if field.account_id is None
            else ACCOUNT_FIELDS - {"id", "type"}
        )
        if field.path[0] not in allowed:
            raise ValueError("unsupported field")
        if field.path[0] == "balance_alert_targets" and len(field.path) != 1:
            raise ValueError("targets require identity merge")
        key = (field.account_id, field.path)
        if any(
            a == key[0] and (p[: len(key[1])] == key[1] or key[1][: len(p)] == p)
            for a, p in selected
        ):
            raise ValueError("overlapping ownership")
        selected.add(key)
        for value in (field.before, field.after):
            if not isinstance(value, Value) or type(value.present) is not bool:
                raise ValueError("invalid ownership value")
            _public(value.value)
            if type(value.value) is dict:
                raise ValueError("receipt must own individual leaves")
            if (
                field.account_id is None
                and field.path == ("balance_alert_targets",)
                and value.present
                and type(value.value) is not list
            ):
                raise ValueError("target receipt must be a list or absent")
        target = (
            config
            if field.account_id is None
            else next((a for a in providers if a.get("id") == field.account_id), None)
        )
        if target is None:
            conflicts.append(key)
            continue
        current = _get(target, field.path)
        if current == field.before:
            continue  # Already restored: idempotent.
        restored = field.before if current == field.after else None
        if (
            restored is None
            and field.account_id is None
            and field.path == ("balance_alert_targets",)
        ):
            restored = _targets(current, field)
        if restored is None:
            conflicts.append(key)
        else:
            _put(target, field.path, restored)
    for owned in accounts:
        if not isinstance(owned, OwnedAccount) or type(owned.record) is not dict:
            raise ValueError("invalid account receipt")
        _public(owned.record)
        account_id = owned.record.get("id")
        if type(account_id) is not str or any(a == account_id for a, _p in selected):
            raise ValueError("invalid account ownership")
        current = next((a for a in providers if a.get("id") == account_id), None)
        if current is None:
            continue
        statuses = dto.get("credentials", {}).get(account_id)
        credential_free = (
            type(statuses) is dict
            and bool(statuses)
            and all(
                type(s) is dict
                and s.get("configured") is False
                and s.get("source") == "missing"
                for s in statuses.values()
            )
        )
        if current != owned.record or not credential_free:
            conflicts.append((account_id, ()))
            continue
        providers.remove(current)
    return config, conflicts


async def restore_owned(dispatch, fields=(), accounts=(), *, authorize=lambda: None):
    """Fresh read + identity merge + CAS; conflicts never authorize overwrite.

    Only ConfigConflict retries. All other failures propagate because a vault
    commit may already have happened. Cancellation/authorization remain caller
    controlled; there is no automatic secret recovery or whole snapshot replay.
    """
    while True:
        authorize()
        current = await dispatch("read", {}, authorize)
        merged, conflicts = merge_owned(current, fields, accounts)
        authorize()
        if merged == current["config"]:
            return {
                "changed": False,
                "conflicts": conflicts,
                "revision": current["revision"],
            }
        try:
            saved = await dispatch(
                "update", {"revision": current["revision"], "config": merged}, authorize
            )
        except ConfigConflict:
            continue
        authorize()
        return {"changed": True, "conflicts": conflicts, "revision": saved["revision"]}
