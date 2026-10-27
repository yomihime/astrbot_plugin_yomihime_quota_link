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
import sqlite3
import stat
import time
from collections.abc import Callable
from datetime import UTC, datetime
from decimal import Decimal, localcontext
from pathlib import Path
from typing import Any

from .alert_delivery import AlertDelivery, AlertFact
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


def _rule_key(account: Any) -> str:
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
                rule.unit,
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
        try:
            self._open_state(Path(state_path))
            self._initialize_accounts()
            self.storage_available = True
            observer = getattr(self.service, "set_auth_pause_observer", None)
            if callable(observer):
                observer(self._on_auth_pause)
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
            PRAGMA user_version=1;
            """
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
                if row["rule_key"] == _rule_key(account) and row["status"] == "paused":
                    # Upgrade the earlier local state format without discarding
                    # a known authentication failure.
                    self._db.execute(
                        "INSERT OR IGNORE INTO auth_pauses VALUES(?)",
                        (_auth_key(account),),
                    )
                if row["rule_key"] != _rule_key(account):
                    self._db.execute(
                        "UPDATE accounts SET rule_key=?,low=0,next_check=0,"
                        "sample_at=NULL,status='waiting' WHERE account_id=?",
                        (_rule_key(account), account.id),
                    )
                else:
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

    def _configuration_status(self, account: Any) -> str | None:
        rule = account.balance_alert
        if not account.enabled or not rule.enabled:
            return "disabled"
        if (
            not account.queryable
            or rule.threshold is None
            or not rule.metric
            or not rule.unit
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
        rule = account.balance_alert
        matches = [
            item
            for item in snapshot.balances
            if item.metric == rule.metric and item.unit == rule.unit
        ]
        if len(matches) != 1:
            return None, "stale"
        item = matches[0]
        amount = (
            item.remaining
            if rule.metric == "mapped_balance" and item.remaining is not None
            else item.amount
        )
        if not isinstance(amount, Decimal) or not amount.is_finite():
            return None, "stale"
        amount = Decimal(0) if amount.is_zero() else amount
        if len(amount.as_tuple().digits) + abs(amount.as_tuple().exponent) > 128:
            return None, "stale"
        return AlertFact(
            account.id,
            account.display_name,
            rule.metric,
            amount,
            rule.threshold,
            rule.unit,
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
                                for _, fact, _ in chosen
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
