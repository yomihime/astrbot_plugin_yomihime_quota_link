"""Persistent low-balance episodes and a revocable, single-task scheduler.

SQLite stores suppression metadata only: never credentials, amounts, or recipient
addresses. Reservations precede transport; uncertain outcomes are not retried.
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import math
import os
import re
import sqlite3
import stat
import time
from collections.abc import Callable
from datetime import UTC, datetime
from decimal import Decimal, localcontext
from pathlib import Path
from typing import Any

from .alert_delivery import AlertDelivery, AlertFact
from .alert_units import observe_units, request_identity, transition, valid_unit
from .models import (
    ProviderErrorCategory,
    QueryRequest,
    QueryRequestKind,
    SnapshotStatus,
)

_BUDGET_SECONDS = 300
_MESSAGES = {
    "disabled": "预警已关闭",
    "blocked": "预警配置不完整或目标不可用",
    "waiting": "等待下一次检查",
    "monitoring": "监测中，未触发预警",
    "low": "额度低于阈值，等待发送预算或目标恢复",
    "recovering": "额度已回升，尚未达到恢复阈值",
    "recovered": "已达到恢复阈值，等待下一次低额事件",
    "error": "查询失败；保留原预警状态，不将错误视为零余额",
    "paused": "认证或权限校验失败；修正配置或手动重试后恢复检查",
    "stale": "未获得新鲜且指标、单位一致的余额；保留原状态",
    "submitted": "已提交平台；不代表最终送达",
    "unknown": "发送结果未知；为避免重复不自动重发",
    "failed": "平台未接受发送；冷却后可重试",
    "storage_unavailable": "预警状态存储不可用；已停止检查和发送",
    "unit_unidentified": "等待有效查询识别额度单位",
    "units_ambiguous": "存在多个或重复单位，请确认实际候选单位",
    "unit_changed": "单位或查询身份变化，请确认后继续",
}


def _target_key(target: Any) -> str:
    # Changes to mentions do not resend an existing episode to the same session.
    return hashlib.sha256(target.umo.encode()).hexdigest()


def _decimal_identity(value: Decimal | None) -> str | None:
    if value is None:
        return None
    with localcontext() as context:
        context.prec = 100
        return str(value.normalize())


def _rule_key(account: Any, *, legacy_unit: bool = False) -> str:
    rule = account.balance_alert
    return hashlib.sha256(
        json.dumps(
            [
                str(account.provider_type),
                dict(account.auth),
                account.endpoint,
                account.response_mapping,
                account.service_profile,
                account.balance_scope,
                account.region,
                getattr(account, "prefer_split_endpoint", False),
                rule.metric,
                *([rule.unit] if legacy_unit else []),
                _decimal_identity(rule.threshold),
                _decimal_identity(rule.effective_recovery_threshold),
            ],
            separators=(",", ":"),
            ensure_ascii=True,
            sort_keys=True,
            default=lambda value: dict(value),
        ).encode()
    ).hexdigest()


def _auth_key(account: Any) -> str:
    return hashlib.sha256(
        json.dumps(
            [
                str(account.provider_type),
                dict(account.auth),
                account.endpoint,
                account.service_profile,
                account.balance_scope,
                account.region,
                getattr(account, "prefer_split_endpoint", False),
            ],
            sort_keys=True,
            ensure_ascii=True,
            separators=(",", ":"),
            default=lambda value: dict(value),
        ).encode()
    ).hexdigest()


class AlertEngine:
    """One engine per plugin generation; mutations revoke it before persistence."""

    def __init__(
        self,
        settings: Any,
        service: Any,
        context: Any,
        state_path: str | Path,
        *,
        clock: Callable[[], float] = time.time,
        sleep: Callable = asyncio.sleep,
        is_current: Callable[[], bool] = lambda: True,
        delivery: Any = None,
    ) -> None:
        self.settings = settings
        self.service = service
        self.clock = clock
        self.sleep = sleep
        self.is_current = is_current
        self.delivery = delivery or AlertDelivery(context)
        self._closed = False
        self._task: asyncio.Task | None = None
        self._runs: set[asyncio.Task] = set()
        self._lock = asyncio.Lock()
        self._wakeup = asyncio.Event()
        self._db: sqlite3.Connection | None = None
        self.storage_available = False
        self._statuses: dict[str, str] = {}
        self._times: dict[str, tuple[float | None, float | None]] = {}
        self._detail_codes: dict[tuple[str, str], str] = {}
        self._observation_tokens: dict[str, tuple] = {}
        try:
            self._open_state(Path(state_path))
            self._initialize_accounts()
            self._initialize_units()
            self.storage_available = True
            observer = getattr(self.service, "set_auth_pause_observer", None)
            if callable(observer):
                observer(self._on_auth_pause)
            snapshot_observer = getattr(self.service, "set_snapshot_observer", None)
            if callable(snapshot_observer):
                snapshot_observer(self._on_snapshot)
        except Exception:
            self._fail_storage()

    def _open_state(self, path: Path) -> None:
        if not path.is_absolute() or not path.parent.is_dir():
            raise ValueError("invalid alert state path")
        if path.parent.resolve() != path.parent:
            raise ValueError("symlinked alert state directory")
        if os.name != "nt" and path.parent.stat().st_mode & 0o022:
            raise ValueError("unsafe alert state directory")
        created = False
        try:
            fd = os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
        except FileExistsError:
            pass
        else:
            os.close(fd)
            created = True
        info = path.lstat()
        if (
            not stat.S_ISREG(info.st_mode)
            or (not created and info.st_size == 0)
            or info.st_size > 16 * 1024 * 1024
            or (
                os.name != "nt"
                and (info.st_uid != os.geteuid() or info.st_mode & 0o077)
            )
        ):
            raise ValueError("unsafe alert state file")
        self._db = sqlite3.connect(path, timeout=0.1)
        self._db.row_factory = sqlite3.Row
        self._db.execute("PRAGMA synchronous=FULL")
        self._db.execute("PRAGMA journal_mode=DELETE")
        version = self._db.execute("PRAGMA user_version").fetchone()[0]
        if version not in (0, 1):
            raise ValueError("unsupported alert state version")
        self._db.executescript(
            """
            CREATE TABLE IF NOT EXISTS accounts (
                account_id TEXT PRIMARY KEY, rule_key TEXT NOT NULL,
                low INTEGER NOT NULL DEFAULT 0, episode INTEGER NOT NULL DEFAULT 0,
                checked REAL, next_check REAL NOT NULL DEFAULT 0,
                sample_at REAL, last_sent REAL, status TEXT NOT NULL DEFAULT 'waiting'
            );
            CREATE TABLE IF NOT EXISTS deliveries (
                account_id TEXT NOT NULL, episode INTEGER NOT NULL,
                target_key TEXT NOT NULL, attempted REAL NOT NULL, status TEXT NOT NULL,
                PRIMARY KEY(account_id, episode, target_key)
            );
            CREATE TABLE IF NOT EXISTS budgets (
                target_key TEXT PRIMARY KEY, attempted REAL NOT NULL
            );
            CREATE TABLE IF NOT EXISTS auth_pauses (
                auth_key TEXT PRIMARY KEY
            );
            CREATE TABLE IF NOT EXISTS unit_bindings (
                account_id TEXT PRIMARY KEY, identity TEXT NOT NULL,
                metric TEXT NOT NULL, unit TEXT, confirmed INTEGER NOT NULL DEFAULT 0,
                state TEXT NOT NULL DEFAULT 'unidentified', observed_at REAL,
                active INTEGER NOT NULL DEFAULT 1, threshold_set INTEGER NOT NULL DEFAULT 0,
                revision INTEGER NOT NULL DEFAULT 0, verified_at REAL,
                semantic_reset INTEGER NOT NULL DEFAULT 0
            );
            PRAGMA user_version=1;
            """
        )
        if "revision" not in {
            row[1] for row in self._db.execute("PRAGMA table_info(unit_bindings)")
        }:
            self._db.execute(
                "ALTER TABLE unit_bindings ADD COLUMN revision INTEGER NOT NULL DEFAULT 0"
            )
        unit_columns = {
            row[1] for row in self._db.execute("PRAGMA table_info(unit_bindings)")
        }
        if "verified_at" not in unit_columns:
            self._db.execute("ALTER TABLE unit_bindings ADD COLUMN verified_at REAL")
            self._db.execute(
                "UPDATE unit_bindings SET verified_at=observed_at WHERE state='verified'"
            )
        if "semantic_reset" not in unit_columns:
            self._db.execute(
                "ALTER TABLE unit_bindings ADD COLUMN semantic_reset INTEGER NOT NULL DEFAULT 0"
            )
        for row in self._db.execute("SELECT * FROM accounts"):
            if (
                row["low"] not in (0, 1)
                or type(row["episode"]) is not int
                or row["episode"] < 0
                or row["status"] not in _MESSAGES
            ):
                raise ValueError("invalid persisted alert account")
            for key in ("checked", "next_check", "sample_at", "last_sent"):
                value = row[key]
                if value is not None and (
                    not isinstance(value, (int, float)) or not math.isfinite(value)
                ):
                    raise ValueError("invalid persisted alert time")
        for row in self._db.execute("SELECT attempted,status FROM deliveries"):
            if (
                row["status"]
                not in {"reserved", "submitted", "unknown", "failed", "blocked"}
                or not isinstance(row["attempted"], (int, float))
                or not math.isfinite(row["attempted"])
            ):
                raise ValueError("invalid persisted delivery")
        for row in self._db.execute("SELECT attempted FROM budgets"):
            if not isinstance(row[0], (int, float)) or not math.isfinite(row[0]):
                raise ValueError("invalid persisted target budget")
        # A previous process may have died after the network accepted a send.
        self._db.execute(
            "UPDATE deliveries SET status='unknown' WHERE status='reserved'"
        )
        self._db.commit()

    def _initialize_accounts(self) -> None:
        now = self.clock()
        with self._db:
            for account in self.settings.accounts:
                self._db.execute(
                    "INSERT OR IGNORE INTO accounts(account_id,rule_key) VALUES(?,?)",
                    (account.id, _rule_key(account)),
                )
                row = self._row(account.id)
                compatible_keys = {
                    _rule_key(account),
                    _rule_key(account, legacy_unit=True),
                }
                if row["rule_key"] in compatible_keys and row["status"] == "paused":
                    # Upgrade the earlier local state format without discarding
                    # a known authentication failure.
                    self._db.execute(
                        "INSERT OR IGNORE INTO auth_pauses VALUES(?)",
                        (_auth_key(account),),
                    )
                if row["rule_key"] not in compatible_keys:
                    self._db.execute(
                        "UPDATE accounts SET rule_key=?,low=0,next_check=0,"
                        "sample_at=NULL,status='waiting' WHERE account_id=?",
                        (_rule_key(account), account.id),
                    )
                else:
                    self._db.execute(
                        "UPDATE accounts SET rule_key=? WHERE account_id=?",
                        (_rule_key(account), account.id),
                    )
                    # A shortened interval should take effect without resetting
                    # the low episode or its durable send reservations.
                    self._db.execute(
                        "UPDATE accounts SET next_check=MIN(next_check,?) WHERE account_id=?",
                        (
                            now + account.balance_alert.check_interval_minutes * 60,
                            account.id,
                        ),
                    )
                row = self._row(account.id)
                paused = self._db.execute(
                    "SELECT 1 FROM auth_pauses WHERE auth_key=?", (_auth_key(account),)
                ).fetchone()
                if paused:
                    self._db.execute(
                        "UPDATE accounts SET status='paused' WHERE account_id=?",
                        (account.id,),
                    )
                    restore = getattr(self.service, "restore_auth_pause", None)
                    if callable(restore):
                        restore(account.id)
                self._times[account.id] = (row["checked"], row["last_sent"])
                remembered = (
                    self._delivery_status(account, row["episode"])
                    if row["low"]
                    else row["status"]
                )
                self._statuses[account.id] = self._configuration_status(account) or (
                    "paused" if paused else remembered
                )

    def _on_auth_pause(self, account_id: str) -> None:
        if not self._active():
            return
        account = next(
            (item for item in self.settings.accounts if item.id == account_id), None
        )
        if account is None:
            return
        key = _auth_key(account)
        try:
            with self._db:
                self._db.execute("INSERT OR IGNORE INTO auth_pauses VALUES(?)", (key,))
                for item in self.settings.accounts:
                    if _auth_key(item) != key:
                        continue
                    self._db.execute(
                        "UPDATE accounts SET status='paused' WHERE account_id=?",
                        (item.id,),
                    )
                    self._statuses[item.id] = (
                        self._configuration_status(item) or "paused"
                    )
                    restore = getattr(self.service, "restore_auth_pause", None)
                    if callable(restore):
                        restore(item.id)
        except sqlite3.Error:
            self._fail_storage()

    def _row(self, account_id: str) -> sqlite3.Row:
        return self._db.execute(
            "SELECT * FROM accounts WHERE account_id=?", (account_id,)
        ).fetchone()

    def _binding(self, account_id: str) -> sqlite3.Row:
        return self._db.execute(
            "SELECT * FROM unit_bindings WHERE account_id=?", (account_id,)
        ).fetchone()

    def _initialize_units(self) -> None:
        current = {account.id for account in self.settings.accounts}
        with self._db:
            for row in self._db.execute("SELECT * FROM unit_bindings").fetchall():
                if (
                    row["state"]
                    not in {"unidentified", "verified", "ambiguous", "changed"}
                    or row["confirmed"] not in {0, 1}
                    or row["active"] not in {0, 1}
                    or row["threshold_set"] not in {0, 1}
                    or row["semantic_reset"] not in {0, 1}
                    or type(row["revision"]) is not int
                    or row["revision"] < 0
                    or (row["unit"] is not None and not valid_unit(row["unit"]))
                    or (row["state"] == "verified" and row["unit"] is None)
                ):
                    raise ValueError("invalid unit binding")
                for time_key in ("observed_at", "verified_at"):
                    value = row[time_key]
                    if value is not None and (
                        not isinstance(value, (int, float))
                        or not math.isfinite(value)
                        or not -62135596800 <= value <= 253402300799
                    ):
                        raise ValueError("invalid unit observation time")
                if row["account_id"] not in current:
                    self._db.execute(
                        "UPDATE unit_bindings SET active=0,revision=revision+1 WHERE account_id=? AND active=1",
                        (row["account_id"],),
                    )
            for account in self.settings.accounts:
                identity = request_identity(account)
                row = self._binding(account.id)
                threshold_set = int(account.balance_alert.threshold is not None)
                if row is None:
                    legacy = account.balance_alert.unit
                    self._db.execute(
                        "INSERT INTO unit_bindings(account_id,identity,metric,unit,threshold_set) VALUES(?,?,?,?,?)",
                        (
                            account.id,
                            identity,
                            account.balance_alert.metric,
                            legacy if valid_unit(legacy) else None,
                            threshold_set,
                        ),
                    )
                elif row["identity"] != identity or not row["active"]:
                    # New credentials/metric or a deleted-and-readded ID must
                    # not silently reinterpret an existing numeric threshold.
                    needs_confirmation = (
                        not row["active"]
                        or row["unit"] is not None
                        or row["threshold_set"]
                    )
                    self._db.execute(
                        "UPDATE unit_bindings SET identity=?,metric=?,confirmed=0,state=?,observed_at=NULL,active=1,threshold_set=?,revision=revision+1,semantic_reset=? WHERE account_id=?",
                        (
                            identity,
                            account.balance_alert.metric,
                            "changed" if needs_confirmation else "unidentified",
                            threshold_set,
                            int(needs_confirmation),
                            account.id,
                        ),
                    )
                else:
                    self._db.execute(
                        "UPDATE unit_bindings SET threshold_set=? WHERE account_id=?",
                        (threshold_set, account.id),
                    )

    def _observe_units(self, account: Any, snapshot: Any):
        observation = observe_units(account, snapshot, self.clock())
        row = self._binding(account.id)
        if observation is None or not observation.units:
            return None, (
                "unit_unidentified" if row["state"] == "unidentified" else "stale"
            )
        if (
            row["observed_at"] is not None
            and observation.observed_at < row["observed_at"]
        ):
            return None, "stale"
        self._observation_tokens[account.id] = (
            observation.observed_at,
            tuple(choice.id for choice in observation.choices),
        )
        state, choice = transition(row, observation)
        unit = choice.unit if choice is not None else row["unit"]
        changed = int(state != row["state"] or unit != row["unit"])
        with self._db:
            self._db.execute(
                "UPDATE unit_bindings SET unit=?,state=?,observed_at=?,revision=revision+?,verified_at=? WHERE account_id=?",
                (
                    unit,
                    state,
                    observation.observed_at,
                    changed,
                    observation.observed_at
                    if choice is not None
                    else row["verified_at"],
                    account.id,
                ),
            )
        failure = {
            "changed": "unit_changed",
            "ambiguous": "units_ambiguous",
            "stale": "stale",
        }.get(state, "")
        return choice, failure

    def _on_snapshot(self, snapshot: Any) -> None:
        if not self._active():
            return
        account = next(
            (item for item in self.settings.accounts if item.id == snapshot.account_id),
            None,
        )
        if account is None:
            return
        try:
            self._observe_units(account, snapshot)
        except Exception:
            self._fail_storage()

    def _peek_units(self, account: Any):
        peek = getattr(self.service, "peek_snapshot", None)
        snapshot = peek(account.id, max_age_seconds=60) if callable(peek) else None
        observation = observe_units(account, snapshot, self.clock())
        row = self._binding(account.id)
        if (
            observation is not None
            and row["observed_at"] is not None
            and observation.observed_at < row["observed_at"]
        ):
            return None
        return observation

    @staticmethod
    def _choice_id(binding, choice) -> str:
        return hashlib.sha256(
            json.dumps(
                [
                    choice.id,
                    binding["identity"],
                    binding["revision"],
                    binding["unit"],
                    binding["confirmed"],
                    binding["state"],
                    binding["active"],
                ],
                separators=(",", ":"),
            ).encode()
        ).hexdigest()

    def unit_status(self) -> dict[str, Any]:
        """Read existing fresh facts only; this method never binds or queries."""
        accounts = []
        for account in self.settings.accounts:
            dto = {
                "account_id": account.id,
                "unit_state": "unidentified",
                "unit": None,
                "observed_at": None,
                "choices": [],
            }
            if not self._active():
                accounts.append(dto)
                continue
            row = self._binding(account.id)
            observation = self._peek_units(account)
            state = row["state"]
            observed_at = row["verified_at"]
            if observation is not None and observation.units:
                projected, _ = transition(row, observation)
                state = (
                    "unidentified"
                    if state == "unidentified" and projected == "verified"
                    else projected
                )
                if projected == "verified" and row["verified_at"] is not None:
                    observed_at = observation.observed_at
                dto["choices"] = [
                    {**choice.dto(), "id": self._choice_id(row, choice)}
                    for choice in observation.choices[:20]
                ]
            elif state == "verified":
                state = "stale"
            dto.update(
                unit_state=state,
                unit=row["unit"] if row["verified_at"] is not None else None,
                observed_at=datetime.fromtimestamp(observed_at, UTC).isoformat()
                if observed_at is not None
                else None,
            )
            accounts.append(dto)
        return {"accounts": accounts}

    def confirm_unit(self, account_id: str, choice_id: str) -> dict[str, Any]:
        if (
            not self._active()
            or not isinstance(choice_id, str)
            or not re.fullmatch(r"[0-9a-f]{64}", choice_id)
        ):
            raise ValueError("单位候选无效或预警运行时已更新，请刷新后重试。")
        account = next(
            (item for item in self.settings.accounts if item.id == account_id), None
        )
        if account is None:
            raise ValueError("未找到该预警账户。")
        observation = self._peek_units(account)
        row = self._binding(account.id)
        choice = (
            next(
                (
                    item
                    for item in observation.choices[:20]
                    if self._choice_id(row, item) == choice_id
                ),
                None,
            )
            if observation is not None
            else None
        )
        if choice is None:
            raise ValueError("候选已过期或不再匹配；请先查询余额，再刷新单位候选。")
        reset = row["unit"] != choice.unit or bool(row["semantic_reset"])
        paused = self._db.execute(
            "SELECT 1 FROM auth_pauses WHERE auth_key=?", (_auth_key(account),)
        ).fetchone()
        with self._db:
            self._db.execute(
                "UPDATE unit_bindings SET unit=?,confirmed=1,state='verified',observed_at=?,verified_at=?,revision=revision+1,semantic_reset=0 WHERE account_id=?",
                (
                    choice.unit,
                    observation.observed_at,
                    observation.observed_at,
                    account.id,
                ),
            )
            if reset:
                self._db.execute(
                    "UPDATE accounts SET low=0,sample_at=NULL WHERE account_id=?",
                    (account.id,),
                )
            self._db.execute(
                "UPDATE accounts SET next_check=0,status=? WHERE account_id=?",
                ("paused" if paused else "waiting", account.id),
            )
        self._statuses[account.id] = self._configuration_status(account) or (
            "paused" if paused else "waiting"
        )
        self._wakeup.set()  # Do not clear authentication pauses or send anything.
        return next(
            item
            for item in self.unit_status()["accounts"]
            if item["account_id"] == account.id
        )

    def _configuration_status(self, account: Any) -> str | None:
        rule = account.balance_alert
        if not account.enabled or not rule.enabled:
            return "disabled"
        if (
            not account.queryable
            or rule.threshold is None
            or not rule.metric
            or not self.settings.balance_alert_targets
        ):
            return "blocked"
        return None

    def _active(self) -> bool:
        try:
            return not self._closed and self.storage_available and self.is_current()
        except Exception:
            return False

    def _fail_storage(self) -> None:
        self.storage_available = False
        if self._db is not None:
            try:
                self._db.close()
            except Exception:
                pass
            self._db = None
        for account in self.settings.accounts:
            self._statuses[account.id] = "storage_unavailable"

    def start(self) -> None:
        if self._active() and (self._task is None or self._task.done()):
            self._task = asyncio.create_task(self._loop(), name="yql-balance-alerts")

    async def close(self) -> None:
        self._closed = True  # Revoke before any await or cancellation delivery.
        observer = getattr(self.service, "set_auth_pause_observer", None)
        if callable(observer):
            observer(None)
        snapshot_observer = getattr(self.service, "set_snapshot_observer", None)
        if callable(snapshot_observer):
            snapshot_observer(None)
        self._wakeup.set()
        current = asyncio.current_task()
        tasks = {
            task
            for task in (*self._runs, self._task)
            if task is not None and task is not current and not task.done()
        }
        for task in tasks:
            task.cancel()
        if tasks:
            done, pending = await asyncio.wait(tasks, timeout=1.0)
            for task in done:
                if not task.cancelled():
                    task.exception()
            for task in pending:
                task.add_done_callback(
                    lambda result: None if result.cancelled() else result.exception()
                )
        if self._db is not None:
            self._db.close()
            self._db = None

    def wake(self, account_id: str | None = None) -> None:
        """Explicit retry schedules a check; it never clears duplicate suppression."""
        if not self._active():
            return
        try:
            selected = [
                account
                for account in self.settings.accounts
                if account_id is None or account.id == account_id
            ]
            keys = {_auth_key(account) for account in selected}
            with self._db:
                for key in keys:
                    self._db.execute("DELETE FROM auth_pauses WHERE auth_key=?", (key,))
                for account in self.settings.accounts:
                    if _auth_key(account) not in keys:
                        continue
                    self._db.execute(
                        "UPDATE accounts SET next_check=0,status='waiting' WHERE account_id=?",
                        (account.id,),
                    )
                    self._statuses[account.id] = (
                        self._configuration_status(account) or "waiting"
                    )
                    retry = getattr(self.service, "retry_account", None)
                    if callable(retry):
                        retry(account.id)
            self._wakeup.set()
        except sqlite3.Error:
            self._fail_storage()

    async def _loop(self) -> None:
        while self._active():
            await self.run_once()
            if not self._active():
                return
            self._wakeup.clear()
            sleeper = asyncio.create_task(self.sleep(30))
            waiter = asyncio.create_task(self._wakeup.wait())
            try:
                await asyncio.wait(
                    (sleeper, waiter), return_when=asyncio.FIRST_COMPLETED
                )
            finally:
                sleeper.cancel()
                waiter.cancel()
                await asyncio.gather(sleeper, waiter, return_exceptions=True)

    def _detail_code(self, account_id: str, status: str) -> str:
        codes = {
            code for (key, _), code in self._detail_codes.items() if key == account_id
        }
        if status == "blocked" and "session_disabled" in codes:
            return "session_disabled"
        if status == "submitted" and "fixed_hint" in codes:
            return "fixed_hint"
        return ""

    def status(self) -> dict[str, Any]:
        accounts = []
        for account in self.settings.accounts:
            status = self._statuses.get(account.id, "waiting")
            checked, submitted = self._times.get(account.id, (None, None))
            accounts.append(
                {
                    "account_id": account.id,
                    "status": status,
                    "message": _MESSAGES.get(status, _MESSAGES["waiting"]),
                    "detail_code": self._detail_code(account.id, status),
                    "last_checked_at": datetime.fromtimestamp(checked, UTC).isoformat()
                    if checked is not None
                    else None,
                    "last_sent_at": datetime.fromtimestamp(submitted, UTC).isoformat()
                    if submitted is not None
                    else None,
                }
            )
        return {
            "running": self._active()
            and self._task is not None
            and not self._task.done(),
            "storage_available": self.storage_available,
            "accounts": accounts,
        }

    def _fact(
        self, account: Any, result: Any, now: float
    ) -> tuple[AlertFact | None, str]:
        snapshots = result.snapshots
        if len(snapshots) != 1:
            return None, "error"
        snapshot = snapshots[0]
        if snapshot.error is not None:
            return None, (
                "paused"
                if snapshot.error.category
                in {
                    ProviderErrorCategory.AUTHENTICATION,
                    ProviderErrorCategory.PERMISSION,
                }
                else "error"
            )
        if (
            snapshot.account_id != account.id
            or snapshot.provider_type != account.provider_type
            or snapshot.status
            not in (
                SnapshotStatus.AVAILABLE,
                SnapshotStatus.PARTIAL,
                SnapshotStatus.UNAVAILABLE,
            )
        ):
            return None, "stale"
        age = now - snapshot.fetched_at.timestamp()
        if not -5 <= age <= min(account.balance_alert.check_interval_minutes * 60, 60):
            return None, "stale"
        choice, failure = self._observe_units(account, snapshot)
        if failure or choice is None:
            return None, failure or "unit_unidentified"
        return AlertFact(
            account.id,
            account.display_name,
            account.balance_alert.metric,
            choice.amount,
            account.balance_alert.threshold,
            choice.unit,
            snapshot.fetched_at.timestamp(),
        ), ""

    def _eligible(self, account: Any, episode: int, target: Any, now: float) -> bool:
        row = self._db.execute(
            "SELECT attempted,status FROM deliveries WHERE account_id=? AND episode=? AND target_key=?",
            (account.id, episode, _target_key(target)),
        ).fetchone()
        if row is None:
            return True
        if row["status"] in {"unknown", "reserved"}:
            return False
        if row["status"] == "blocked":
            return True
        if row["status"] == "failed":
            return now - row["attempted"] >= _BUDGET_SECONDS
        repeat = account.balance_alert.repeat_minutes
        return bool(repeat and now - row["attempted"] >= repeat * 60)

    def _budget_ready(self, target: Any, now: float) -> bool:
        row = self._db.execute(
            "SELECT attempted FROM budgets WHERE target_key=?", (_target_key(target),)
        ).fetchone()
        return row is None or now - row["attempted"] >= _BUDGET_SECONDS

    def _priority(self, account: Any, episode: int, target: Any) -> tuple:
        row = self._db.execute(
            "SELECT attempted,status FROM deliveries WHERE account_id=? AND episode=? AND target_key=?",
            (account.id, episode, _target_key(target)),
        ).fetchone()
        # First alerts precede repeat reminders; the oldest attempts win ties.
        return (
            (0, 0, account.id)
            if row is None
            else (int(row["status"] == "submitted"), row["attempted"], account.id)
        )

    def _delivery_status(self, account: Any, episode: int) -> str:
        statuses = [
            self._db.execute(
                "SELECT status FROM deliveries WHERE account_id=? AND episode=? AND target_key=?",
                (account.id, episode, _target_key(target)),
            ).fetchone()
            for target in self.settings.balance_alert_targets
        ]
        present = [row[0] if row else "low" for row in statuses]
        for status in ("unknown", "reserved", "failed", "blocked", "low", "submitted"):
            if status in present:
                return "unknown" if status == "reserved" else status
        return "low"

    async def run_once(self) -> None:
        """Drive a deterministic tick, useful for tests and explicit retries."""
        task = asyncio.current_task()
        self._runs.add(task)
        try:
            async with self._lock:
                if not self._active():
                    return
                candidates: list[tuple[Any, AlertFact, int]] = []
                binding_revisions = {}
                observation_tokens = {}
                due = []
                for account in self.settings.accounts:
                    state = self._configuration_status(account)
                    if state:
                        self._statuses[account.id] = state
                        continue
                    row = self._row(account.id)
                    if row["status"] == "paused":
                        self._statuses[account.id] = "paused"
                        continue
                    if row["next_check"] <= self.clock():
                        due.append((account, row))
                due.sort(
                    key=lambda entry: (
                        entry[1]["next_check"],
                        entry[1]["checked"] or 0,
                        entry[0].id,
                    )
                )
                # A result that expired in a slow queue gets a single-account
                # batch on its next configured check, so it cannot starve forever.
                stale_index = next(
                    (
                        index
                        for index, (_, row) in enumerate(due[:10])
                        if row["status"] == "stale"
                    ),
                    10,
                )
                limit = max(stale_index, 1)
                for account, row in due[:limit]:
                    if not self._active():
                        return
                    now = self.clock()
                    with self._db:
                        self._db.execute(
                            "UPDATE accounts SET checked=?,next_check=? WHERE account_id=?",
                            (
                                now,
                                now + account.balance_alert.check_interval_minutes * 60,
                                account.id,
                            ),
                        )
                    self._times[account.id] = (now, row["last_sent"])
                    try:
                        result = await self.service.query(
                            QueryRequest(QueryRequestKind.ACCOUNT, account.id),
                            max_age_seconds=min(
                                account.balance_alert.check_interval_minutes * 60, 60
                            ),
                        )
                    except asyncio.CancelledError:
                        raise
                    except Exception:
                        self._statuses[account.id] = "error"
                        continue
                    if not self._active():
                        return
                    fact, failure = self._fact(account, result, self.clock())
                    if failure:
                        self._statuses[account.id] = failure
                        if failure == "paused":
                            self._on_auth_pause(account.id)
                            if not self._active():
                                return
                        with self._db:
                            self._db.execute(
                                "UPDATE accounts SET status=? WHERE account_id=?",
                                (failure, account.id),
                            )
                        continue
                    row = self._row(account.id)
                    sample_at = result.snapshots[0].fetched_at.timestamp()
                    if row["sample_at"] is not None and sample_at < row["sample_at"]:
                        self._statuses[account.id] = "stale"
                        continue
                    low, episode = bool(row["low"]), row["episode"]
                    rule = account.balance_alert
                    recovery = rule.effective_recovery_threshold
                    if not low and fact.amount <= rule.threshold:
                        low, episode = True, episode + 1
                        state = "low"
                    elif low and fact.amount >= recovery:
                        low, state = False, "recovered"
                    elif low and fact.amount > rule.threshold:
                        state = "recovering"
                    elif low:
                        state = self._delivery_status(account, episode)
                    else:
                        state = "monitoring"
                    with self._db:
                        self._db.execute(
                            "UPDATE accounts SET low=?,episode=?,sample_at=?,status=? WHERE account_id=?",
                            (int(low), episode, sample_at, state, account.id),
                        )
                    self._statuses[account.id] = state
                    if low and fact.amount <= rule.threshold:
                        candidates.append((account, fact, episode))
                        binding_revisions[account.id] = self._binding(account.id)[
                            "revision"
                        ]
                        observation_tokens[account.id] = self._observation_tokens.get(
                            account.id
                        )
                targets = sorted(
                    self.settings.balance_alert_targets,
                    key=lambda target: min(
                        (
                            self._priority(account, episode, target)
                            for account, _, episode in candidates
                            if self._eligible(account, episode, target, self.clock())
                        ),
                        default=(2, 0, ""),
                    ),
                )
                for target in targets:
                    if not self._active():
                        return
                    now = self.clock()
                    chosen = [
                        (account, fact, episode)
                        for account, fact, episode in candidates
                        if self._eligible(account, episode, target, now)
                        and -5 <= now - fact.fetched_at <= 60
                    ]
                    chosen.sort(
                        key=lambda item: self._priority(item[0], item[2], target)
                    )
                    chosen = chosen[:10]
                    if not chosen or not self._budget_ready(target, now):
                        continue

                    def active():
                        return (
                            self._active()
                            and target in self.settings.balance_alert_targets
                            and all(
                                -5 <= self.clock() - fact.fetched_at <= 60
                                and self._observation_tokens.get(account.id)
                                == observation_tokens[account.id]
                                and self._binding(account.id)["state"] == "verified"
                                and self._binding(account.id)["revision"]
                                == binding_revisions[account.id]
                                and self._binding(account.id)["identity"]
                                == request_identity(account)
                                and self._binding(account.id)["metric"] == fact.metric
                                and self._binding(account.id)["unit"] == fact.unit
                                and self._row(account.id)["low"]
                                and self._row(account.id)["episode"] == episode
                                for account, fact, episode in chosen
                            )
                        )

                    def reserve():
                        if not active():
                            return False
                        reserved_at = self.clock()
                        with self._db:
                            if not self._budget_ready(target, reserved_at):
                                return False
                            self._db.execute(
                                "INSERT OR REPLACE INTO budgets VALUES(?,?)",
                                (_target_key(target), reserved_at),
                            )
                            for account, _fact, episode in chosen:
                                self._db.execute(
                                    "INSERT OR REPLACE INTO deliveries VALUES(?,?,?,?,?)",
                                    (
                                        account.id,
                                        episode,
                                        _target_key(target),
                                        reserved_at,
                                        "reserved",
                                    ),
                                )
                        return True

                    outcome = await self.delivery.deliver(
                        target,
                        tuple(fact for _, fact, _ in chosen),
                        self.settings.balance_alert_llm,
                        active=active,
                        reserve=reserve,
                    )
                    if not self._active():
                        return
                    with self._db:
                        for account, _, episode in chosen:
                            code = getattr(outcome, "reason_code", "")
                            self._detail_codes[(account.id, _target_key(target))] = (
                                code
                                if code in {"session_disabled", "fixed_hint"}
                                else ""
                            )
                            if outcome.status in {"submitted", "failed", "unknown"}:
                                self._db.execute(
                                    "UPDATE deliveries SET status=? WHERE account_id=? AND episode=? AND target_key=?",
                                    (
                                        outcome.status,
                                        account.id,
                                        episode,
                                        _target_key(target),
                                    ),
                                )
                            elif outcome.status == "blocked":
                                self._db.execute(
                                    "INSERT OR REPLACE INTO deliveries VALUES(?,?,?,?,?)",
                                    (
                                        account.id,
                                        episode,
                                        _target_key(target),
                                        self.clock(),
                                        "blocked",
                                    ),
                                )
                            if outcome.status == "submitted":
                                self._db.execute(
                                    "UPDATE accounts SET last_sent=? WHERE account_id=?",
                                    (self.clock(), account.id),
                                )
                            row = self._row(account.id)
                            self._times[account.id] = (row["checked"], row["last_sent"])
                for account, fact, episode in candidates:
                    status = self._delivery_status(account, episode)
                    self._statuses[account.id] = (
                        "stale"
                        if status == "low" and self.clock() - fact.fetched_at > 60
                        else status
                    )
                    with self._db:
                        self._db.execute(
                            "UPDATE accounts SET status=? WHERE account_id=?",
                            (self._statuses[account.id], account.id),
                        )
        except asyncio.CancelledError:
            raise
        except (sqlite3.Error, OSError, ValueError):
            self._fail_storage()
        finally:
            self._runs.discard(task)
