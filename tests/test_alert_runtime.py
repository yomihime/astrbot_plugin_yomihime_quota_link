import asyncio
import os
import sqlite3
from dataclasses import replace
from datetime import UTC, datetime
from decimal import Decimal
from functools import wraps
from types import SimpleNamespace

import pytest

from quota_link.alert_config import (
    BalanceAlertLLM,
    BalanceAlertSettings,
    BalanceAlertTarget,
)
from quota_link.alert_delivery import AlertDelivery
from quota_link.alerts import AlertEngine
from quota_link.models import (
    BalanceItem,
    BalanceItemKind,
    BalanceSnapshot,
    NormalizedProviderError,
    ProviderErrorCategory,
    ProviderType,
    SnapshotStatus,
)


def run_async(function):
    @wraps(function)
    def wrapped(*args, **kwargs):
        return asyncio.run(function(*args, **kwargs))

    return wrapped


class Clock:
    def __init__(self):
        self.value = 1_700_000_000.0

    def __call__(self):
        return self.value

    def advance(self, seconds=900):
        self.value += seconds


def settings(
    *, count=1, targets=1, repeat=0, threshold="10", recovery=None, interval=15
):
    return SimpleNamespace(
        accounts=tuple(
            SimpleNamespace(
                id=f"account-{i}",
                display_name=f"Synthetic {i}",
                provider_type=ProviderType.DEEPSEEK,
                enabled=True,
                queryable=True,
                config_fingerprint=f"fingerprint-{i}",
                auth={"api_key": "never-send-this-secret"},
                endpoint=None,
                response_mapping={},
                service_profile="generic",
                balance_scope="generic",
                region="china",
                balance_alert=BalanceAlertSettings(
                    True,
                    interval,
                    "total_balance",
                    "CNY",
                    Decimal(threshold),
                    Decimal(recovery) if recovery is not None else None,
                    repeat,
                ),
            )
            for i in range(count)
        ),
        balance_alert_targets=tuple(
            BalanceAlertTarget(f"fake:GroupMessage:{i + 100}", ("234",))
            for i in range(targets)
        ),
        balance_alert_llm=BalanceAlertLLM(False),
    )


class Context:
    def __init__(self):
        self.sent = []
        self.result = True
        self.adapter = "aiocqhttp"
        self.conversation_manager = SimpleNamespace(
            get_curr_conversation_id=self.no_conversation
        )
        self.persona_manager = SimpleNamespace(resolve_selected_persona=self.no_persona)

    async def no_conversation(self, umo):
        return None

    async def no_persona(self, **kwargs):
        return None, None, None, False

    async def get_current_chat_provider_id(self, umo):
        return "fake-model"

    def get_config(self, **kwargs):
        return {
            "agent_runner": {"runner_type": "local"},
            "provider_settings": {"enable": True},
        }

    def get_platform_inst(self, instance):
        if self.adapter is None:
            return None
        return SimpleNamespace(
            meta=lambda: SimpleNamespace(id=instance, name=self.adapter)
        )

    async def send_message(self, target, message):
        self.sent.append((target, message))
        if isinstance(self.result, Exception):
            raise self.result
        return self.result


class Service:
    def __init__(self, config, clock):
        self.config, self.clock = config, clock
        self.amounts = {account.id: Decimal("10") for account in config.accounts}
        self.calls = []
        self.error = None
        self.age = 0
        self.unit = "CNY"
        self.metric = "total_balance"
        self.status = SnapshotStatus.AVAILABLE
        self.cached = False
        self.duplicate = False
        self.latest = {}

    def peek_snapshot(self, account_id, *, max_age_seconds=60):
        return self.latest.get(account_id)

    async def query(self, request, **kwargs):
        self.calls.append((request.target, kwargs))
        account = next(
            account for account in self.config.accounts if account.id == request.target
        )
        item = BalanceItem(
            BalanceItemKind.CASH,
            amount=self.amounts[account.id],
            unit=self.unit,
            metric=self.metric,
        )
        snapshot = BalanceSnapshot(
            account.id,
            account.provider_type,
            account.display_name,
            self.status,
            (item, item) if self.duplicate else (item,),
            "synthetic",
            datetime.fromtimestamp(self.clock() - self.age, UTC),
            cached=self.cached,
            error=self.error,
        )
        self.latest[account.id] = snapshot
        return SimpleNamespace(snapshots=(snapshot,))


async def enabled_session(_umo):
    return True


def engine(tmp_path, config=None, clock=None, service=None, context=None, **kwargs):
    config = config or settings()
    clock = clock or Clock()
    service = service or Service(config, clock)
    context = context or Context()
    transport = AlertDelivery(
        context,
        component_factory=lambda mentions, text: (mentions, text),
        session_enabled=enabled_session,
        session_llm_enabled=enabled_session,
    )
    result = AlertEngine(
        config,
        service,
        context,
        tmp_path / "alerts.sqlite3",
        clock=clock,
        delivery=transport,
        **kwargs,
    )
    assert result.storage_available
    return result, config, clock, service, context


@run_async
async def test_first_crossing_boundary_and_continuing_low_do_not_repeat(tmp_path):
    monitor, _, clock, service, context = engine(tmp_path)
    service.amounts["account-0"] = Decimal("10.000000000000000001")
    await monitor.run_once()
    assert not context.sent
    clock.advance()
    service.amounts["account-0"] = Decimal("10")
    await monitor.run_once()
    assert len(context.sent) == 1
    assert monitor.status()["accounts"][0]["status"] == "submitted"
    for _ in range(4):
        clock.advance()
        await monitor.run_once()
    assert len(context.sent) == 1
    assert service.calls[0][1] == {"max_age_seconds": 60}
    await monitor.close()


@run_async
async def test_persistent_restart_and_interval_timeout_changes_do_not_repeat(tmp_path):
    monitor, config, clock, service, context = engine(tmp_path)
    await monitor.run_once()
    await monitor.close()
    config.accounts[0].balance_alert = replace(
        config.accounts[0].balance_alert, check_interval_minutes=1
    )
    config.accounts[0].config_fingerprint = "timeout-change-only"
    restarted, _, _, _, _ = engine(tmp_path, config, clock, service, context)
    clock.advance()
    await restarted.run_once()
    assert len(context.sent) == 1
    await restarted.close()


@run_async
async def test_recovery_hysteresis_rearms_only_after_recovery_threshold(tmp_path):
    monitor, _, clock, service, context = engine(tmp_path, settings(recovery="12"))
    await monitor.run_once()
    for amount in ("10.1", "11.999", "10"):
        clock.advance()
        service.amounts["account-0"] = Decimal(amount)
        await monitor.run_once()
    assert len(context.sent) == 1
    clock.advance()
    service.amounts["account-0"] = Decimal("12")
    await monitor.run_once()
    assert monitor.status()["accounts"][0]["status"] == "recovered"
    assert len(context.sent) == 1  # Recovery is state only, not an extra message.
    clock.advance()
    service.amounts["account-0"] = Decimal("9.999")
    await monitor.run_once()
    assert len(context.sent) == 2
    await monitor.close()


@run_async
@pytest.mark.parametrize(
    "amount,threshold",
    [
        ("-8.25", "0"),
        ("-0", "0"),
        ("0", "0"),
        ("-10", "-9"),
        ("0.000000000000000001", "0.000000000000000002"),
    ],
)
async def test_negative_and_decimal_balances_and_unavailable_facts_are_valid(
    tmp_path, amount, threshold
):
    monitor, _, _, service, context = engine(tmp_path, settings(threshold=threshold))
    service.status = SnapshotStatus.UNAVAILABLE
    service.amounts["account-0"] = Decimal(amount)
    await monitor.run_once()
    assert len(context.sent) == 1
    assert "-0 CNY" not in context.sent[0][1][1]
    await monitor.close()


@run_async
@pytest.mark.parametrize(
    "problem",
    ["error", "old_cache", "future", "currency", "metric", "missing", "duplicate"],
)
async def test_invalid_facts_neither_start_nor_recover_episode(tmp_path, problem):
    monitor, _, clock, service, context = engine(tmp_path)
    if problem == "error":
        service.error = NormalizedProviderError(
            ProviderErrorCategory.RATE_LIMITED, "synthetic"
        )
    elif problem == "old_cache":
        service.age, service.cached = 61, True
    elif problem == "future":
        service.age = -6
    elif problem == "currency":
        service.unit = "USD"
    elif problem == "metric":
        service.metric = "granted_balance"
    elif problem == "missing":
        service.amounts["account-0"] = None
    else:
        service.duplicate = True
    await monitor.run_once()
    assert not context.sent
    service.error, service.age, service.cached, service.unit = None, 0, False, "CNY"
    service.metric, service.duplicate = "total_balance", False
    service.amounts["account-0"] = Decimal("5")
    clock.advance()
    await monitor.run_once()
    if problem in {"currency", "duplicate"}:
        assert (
            not context.sent
        )  # A unit-change/ambiguity latch needs explicit confirmation.
        choice = monitor.unit_status()["accounts"][0]["choices"][0]
        monitor.confirm_unit("account-0", choice["id"])
        await monitor.run_once()
    assert len(context.sent) == 1
    clock.advance()
    service.error = NormalizedProviderError(
        ProviderErrorCategory.AUTHENTICATION, "synthetic"
    )
    service.amounts["account-0"] = Decimal("100")
    await monitor.run_once()
    clock.advance()
    service.error = None
    service.amounts["account-0"] = Decimal("5")
    await monitor.run_once()
    assert len(context.sent) == 1
    await monitor.close()


@run_async
async def test_fresh_cached_fact_can_trigger_but_backward_sample_cannot_recover(
    tmp_path,
):
    monitor, _, clock, service, context = engine(tmp_path)
    service.cached = True
    service.age = 20
    await monitor.run_once()
    assert len(context.sent) == 1
    monitor.wake("account-0")
    service.age = 30
    service.amounts["account-0"] = Decimal("100")
    await monitor.run_once()
    assert monitor.status()["accounts"][0]["status"] == "stale"
    await monitor.close()


@run_async
@pytest.mark.parametrize(
    "provider,metric,configured_unit,other_unit",
    [
        (ProviderType.DEEPSEEK, "total_balance", "CNY", "USD"),
        (ProviderType.DEEPSEEK, "total_balance", "USD", "CNY"),
        (ProviderType.ALIBABA_BAILIAN, "AvailableAmount", "CNY", "JPY"),
        (ProviderType.ALIBABA_BAILIAN, "CreditAmount", "JPY", "USD"),
        (ProviderType.MEINIANDA, "site_credit", "site_credit", "CNY"),
        (ProviderType.OPENAI_COMPATIBLE, "credit", "credit", "credits"),
    ],
)
async def test_default_or_explicit_unit_never_converts_or_recovers_other_units(
    tmp_path, provider, metric, configured_unit, other_unit
):
    config = settings()
    config.accounts[0].provider_type = provider
    config.accounts[0].balance_alert = replace(
        config.accounts[0].balance_alert, metric=metric, unit=configured_unit
    )
    monitor, _, clock, service, context = engine(tmp_path, config)
    service.metric, service.unit = metric, other_unit
    service.amounts["account-0"] = Decimal("-8.25")
    await monitor.run_once()
    assert not context.sent
    assert monitor.status()["accounts"][0]["status"] == "unit_changed"
    clock.advance()
    service.unit = configured_unit
    await monitor.run_once()
    assert not context.sent
    choice = monitor.unit_status()["accounts"][0]["choices"][0]
    monitor.confirm_unit("account-0", choice["id"])
    await monitor.run_once()
    assert len(context.sent) == 1
    assert f"-8.25 {configured_unit}" in context.sent[0][1][1]
    clock.advance()
    service.unit = other_unit
    service.amounts["account-0"] = Decimal("100")
    await monitor.run_once()
    assert monitor.status()["accounts"][0]["status"] == "unit_changed"
    clock.advance()
    service.unit = configured_unit
    service.amounts["account-0"] = Decimal("-8.25")
    await monitor.run_once()
    assert len(context.sent) == 1  # Mismatched currency did not rearm the episode.
    await monitor.close()


@run_async
async def test_accounts_are_merged_per_target_and_targets_are_independent(tmp_path):
    monitor, _, _, _, context = engine(tmp_path, settings(count=3, targets=2))
    await monitor.run_once()
    assert len(context.sent) == 2
    for _, (mentions, message) in context.sent:
        assert mentions == ("234",)
        assert all(f"Synthetic {i}" in message for i in range(3))
    await monitor.close()


@run_async
async def test_target_budget_delays_new_episode_without_losing_pending_account(
    tmp_path,
):
    monitor, _, clock, service, context = engine(
        tmp_path, settings(count=2, interval=1)
    )
    service.amounts["account-1"] = Decimal("100")
    await monitor.run_once()
    clock.advance(60)
    service.amounts["account-1"] = Decimal("1")
    await monitor.run_once()
    assert len(context.sent) == 1
    clock.advance(240)
    await monitor.run_once()
    assert len(context.sent) == 2
    assert "Synthetic 1" in context.sent[1][1][1]
    assert "Synthetic 0" not in context.sent[1][1][1]
    await monitor.close()


@run_async
async def test_optional_repeat_respects_longer_target_budget(tmp_path):
    monitor, _, clock, _, context = engine(tmp_path, settings(interval=1, repeat=1))
    await monitor.run_once()
    clock.advance(60)
    await monitor.run_once()
    assert len(context.sent) == 1
    clock.advance(240)
    await monitor.run_once()
    assert len(context.sent) == 2
    await monitor.close()


@run_async
async def test_unknown_result_survives_restart_and_explicit_wake_without_retries(
    tmp_path,
):
    monitor, config, clock, service, context = engine(
        tmp_path, settings(repeat=1, interval=1)
    )
    context.result = RuntimeError(
        "transport may have accepted; never print this secret"
    )
    await monitor.run_once()
    assert monitor.status()["accounts"][0]["status"] == "unknown"
    await monitor.close()
    restarted, _, _, _, _ = engine(tmp_path, config, clock, service, context)
    context.result = True
    clock.advance(600)
    restarted.wake()
    await restarted.run_once()
    assert len(context.sent) == 1
    assert restarted.status()["accounts"][0]["status"] == "unknown"
    await restarted.close()


@run_async
async def test_false_result_retries_only_after_cooldown(tmp_path):
    monitor, _, clock, _, context = engine(tmp_path, settings(interval=1))
    context.result = False
    await monitor.run_once()
    clock.advance(60)
    context.result = True
    await monitor.run_once()
    assert len(context.sent) == 1
    clock.advance(240)
    await monitor.run_once()
    assert len(context.sent) == 2
    await monitor.close()


@run_async
async def test_reserved_send_on_crash_becomes_unknown_and_never_resends(tmp_path):
    monitor, config, clock, service, context = engine(tmp_path)
    await monitor.run_once()
    await monitor.close()
    with sqlite3.connect(tmp_path / "alerts.sqlite3") as db:
        db.execute("UPDATE deliveries SET status='reserved'")
    restarted, _, _, _, _ = engine(tmp_path, config, clock, service, context)
    assert restarted.status()["accounts"][0]["status"] == "unknown"
    clock.advance()
    await restarted.run_once()
    assert len(context.sent) == 1
    await restarted.close()


@run_async
async def test_unavailable_target_rechecks_without_reserving_or_llm(tmp_path):
    monitor, _, clock, _, context = engine(tmp_path, settings(interval=1))
    context.adapter = "telegram"
    await monitor.run_once()
    assert not context.sent
    assert monitor.status()["accounts"][0]["status"] == "blocked"
    context.adapter = "aiocqhttp"
    clock.advance(60)
    await monitor.run_once()
    assert len(context.sent) == 1
    await monitor.close()


@run_async
async def test_revocation_while_query_is_queued_prevents_any_late_send(tmp_path):
    monitor, _, _, service, context = engine(tmp_path)
    started, release = asyncio.Event(), asyncio.Event()
    original = service.query

    async def delayed(*args, **kwargs):
        started.set()
        await release.wait()
        return await original(*args, **kwargs)

    service.query = delayed
    tick = asyncio.create_task(monitor.run_once())
    await started.wait()
    await monitor.close()
    release.set()
    await asyncio.gather(tick, return_exceptions=True)
    assert not context.sent and not monitor.status()["running"]


@run_async
async def test_generation_change_during_query_prevents_any_send(tmp_path):
    current = [True]
    monitor, _, _, service, context = engine(tmp_path, is_current=lambda: current[0])
    original = service.query

    async def changed(*args, **kwargs):
        result = await original(*args, **kwargs)
        current[0] = False
        return result

    service.query = changed
    await monitor.run_once()
    assert not context.sent
    await monitor.close()


@run_async
async def test_start_is_idempotent_and_shutdown_cancels_loop(tmp_path):
    monitor, _, _, _, _ = engine(tmp_path)
    monitor.start()
    task = monitor._task
    monitor.start()
    assert monitor._task is task and monitor.status()["running"]
    await monitor.close()
    assert task.done() and not monitor.status()["running"]


@run_async
async def test_concurrent_ticks_do_not_duplicate_or_overlap(tmp_path):
    monitor, _, _, service, context = engine(tmp_path)
    await asyncio.gather(*(monitor.run_once() for _ in range(10)))
    assert len(context.sent) == len(service.calls) == 1
    await monitor.close()


@run_async
async def test_disabled_or_incomplete_account_never_queries(tmp_path):
    config = settings(count=3)
    config.accounts[0].balance_alert = replace(
        config.accounts[0].balance_alert, enabled=False
    )
    config.accounts[1].balance_alert = replace(
        config.accounts[1].balance_alert, threshold=None
    )
    config.accounts[2].queryable = False
    monitor, _, _, service, context = engine(tmp_path, config)
    await monitor.run_once()
    assert not context.sent and not service.calls
    assert [a["status"] for a in monitor.status()["accounts"]] == [
        "disabled",
        "blocked",
        "blocked",
    ]
    await monitor.close()


@run_async
async def test_persistence_has_private_metadata_only(tmp_path):
    monitor, _, _, _, _ = engine(tmp_path)
    await monitor.run_once()
    await monitor.close()
    path = tmp_path / "alerts.sqlite3"
    if os.name != "nt":
        assert path.stat().st_mode & 0o777 == 0o600
    raw = path.read_bytes()
    assert b"never-send-this-secret" not in raw
    assert b"fake:GroupMessage" not in raw and b"Synthetic 0" not in raw


@pytest.mark.parametrize("unsafe", ["corrupt", "symlink", "permissions", "version"])
def test_unsafe_or_unknown_storage_fails_closed(tmp_path, unsafe):
    path = tmp_path / "alerts.sqlite3"
    if unsafe == "symlink":
        destination = tmp_path / "other"
        destination.write_text("do not modify")
        path.symlink_to(destination)
    elif unsafe == "version":
        with sqlite3.connect(path) as db:
            db.execute("PRAGMA user_version=42")
        path.chmod(0o600)
    else:
        path.write_text("corrupt")
        path.chmod(0o644 if unsafe == "permissions" else 0o600)
    config = settings()
    monitor = AlertEngine(config, Service(config, Clock()), Context(), path)
    assert not monitor.storage_available
    assert monitor.status()["accounts"][0]["status"] == "storage_unavailable"


@pytest.mark.parametrize("unknown_first", [True, False])
@run_async
async def test_unknown_target_status_is_not_hidden_by_success_order(
    tmp_path, unknown_first
):
    monitor, _, _, _, context = engine(tmp_path, settings(targets=2))

    async def send(target, message):
        context.sent.append((target, message))
        if (target.endswith(":100")) == unknown_first:
            raise RuntimeError("uncertain transport")
        return True

    context.send_message = send
    await monitor.run_once()
    status = monitor.status()["accounts"][0]
    assert status["status"] == "unknown"
    assert status["last_checked_at"].endswith("+00:00")
    assert status["last_sent_at"].endswith("+00:00")
    assert len(context.sent) == 2
    await monitor.close()


@run_async
async def test_slow_second_query_does_not_send_stale_first_account_fact(tmp_path):
    monitor, _, clock, service, context = engine(tmp_path, settings(count=2))
    original = service.query

    async def slow(request, **kwargs):
        if request.target == "account-1":
            clock.advance(61)
        return await original(request, **kwargs)

    service.query = slow
    await monitor.run_once()
    assert len(context.sent) == 1
    assert "Synthetic 0" not in context.sent[0][1][1]
    assert "Synthetic 1" in context.sent[0][1][1]
    assert monitor.status()["accounts"][0]["status"] == "stale"
    await monitor.close()


@run_async
async def test_slow_llm_invalidates_facts_before_reservation_and_send(tmp_path):
    monitor, config, clock, _, context = engine(tmp_path)
    config.balance_alert_llm = BalanceAlertLLM(True, "explicit")

    async def generate(**kwargs):
        clock.advance(61)
        return SimpleNamespace(completion_text="温馨提醒：请及时检查账户额度。")

    context.llm_generate = generate
    await monitor.run_once()
    assert not context.sent
    assert monitor.status()["accounts"][0]["status"] == "stale"
    with sqlite3.connect(tmp_path / "alerts.sqlite3") as db:
        assert db.execute("SELECT COUNT(*) FROM deliveries").fetchone()[0] == 0
    await monitor.close()


@run_async
async def test_second_target_does_not_receive_fact_expired_by_first_transport(tmp_path):
    monitor, _, clock, _, context = engine(tmp_path, settings(targets=2))

    async def send(target, message):
        context.sent.append((target, message))
        clock.advance(61)
        return True

    context.send_message = send
    await monitor.run_once()
    assert len(context.sent) == 1
    await monitor.close()


@run_async
async def test_large_batch_is_bounded_and_pending_accounts_send_later(tmp_path):
    monitor, _, clock, _, context = engine(tmp_path, settings(count=13, interval=1))
    await monitor.run_once()
    assert len(context.sent) == 1
    assert context.sent[0][1][1].count("（预警阈值）") == 10
    clock.advance(300)
    await monitor.run_once()
    assert len(context.sent) == 2
    assert context.sent[1][1][1].count("（预警阈值）") == 3
    await monitor.close()


@run_async
async def test_first_alerts_are_not_starved_by_ten_repeating_accounts(tmp_path):
    monitor, _, clock, _, context = engine(
        tmp_path, settings(count=13, interval=1, repeat=1)
    )
    await monitor.run_once()
    clock.advance(300)
    await monitor.run_once()
    sent_text = "\n".join(message for _, (_, message) in context.sent)
    assert all(f"Synthetic {index} ·" in sent_text for index in range(13))
    await monitor.close()


@run_async
async def test_slow_bounded_queue_eventually_reports_every_first_episode(tmp_path):
    monitor, _, clock, service, context = engine(
        tmp_path, settings(count=20, interval=1)
    )
    original = service.query

    async def slow(*args, **kwargs):
        clock.advance(61)
        return await original(*args, **kwargs)

    service.query = slow
    for _ in range(60):
        previous_calls = len(service.calls)
        await monitor.run_once()
        assert len(service.calls) - previous_calls <= 10
        clock.advance(300)
        text = "\n".join(message for _, (_, message) in context.sent)
        if all(f"Synthetic {index} ·" in text for index in range(20)):
            break
    assert all(f"Synthetic {index} ·" in text for index in range(20))
    await monitor.close()


@run_async
async def test_unsent_targets_precede_repeating_targets_after_slow_transport(tmp_path):
    monitor, _, clock, _, context = engine(
        tmp_path, settings(targets=8, interval=1, repeat=1)
    )

    async def send(target, message):
        context.sent.append((target, message))
        clock.advance(31)
        return True

    context.send_message = send
    for _ in range(4):
        await monitor.run_once()
        clock.advance(300)
    assert len({target for target, _ in context.sent[:8]}) == 8
    await monitor.close()


@run_async
async def test_decimal_equivalent_rule_updates_do_not_make_new_episode(tmp_path):
    monitor, config, clock, service, context = engine(
        tmp_path, settings(threshold="10.0")
    )
    await monitor.run_once()
    await monitor.close()
    config.accounts[0].balance_alert = replace(
        config.accounts[0].balance_alert,
        threshold=Decimal("10.00"),
        recovery_threshold=Decimal("11.000"),
    )
    restarted, _, _, _, _ = engine(tmp_path, config, clock, service, context)
    clock.advance()
    await restarted.run_once()
    assert len(context.sent) == 1
    await restarted.close()


@run_async
async def test_disable_and_reenable_retains_low_episode(tmp_path):
    monitor, config, clock, service, context = engine(tmp_path)
    await monitor.run_once()
    await monitor.close()
    original = config.accounts[0].balance_alert
    config.accounts[0].balance_alert = replace(original, enabled=False)
    disabled, _, _, _, _ = engine(tmp_path, config, clock, service, context)
    clock.advance()
    await disabled.run_once()
    assert len(service.calls) == 1
    await disabled.close()
    config.accounts[0].balance_alert = original
    restarted, _, _, _, _ = engine(tmp_path, config, clock, service, context)
    await restarted.run_once()
    assert len(context.sent) == 1
    await restarted.close()


@pytest.mark.parametrize(
    "category", [ProviderErrorCategory.AUTHENTICATION, ProviderErrorCategory.PERMISSION]
)
@run_async
async def test_authentication_and_permission_errors_report_paused(tmp_path, category):
    monitor, _, _, service, context = engine(tmp_path)
    service.error = NormalizedProviderError(category, "synthetic")
    await monitor.run_once()
    assert not context.sent
    assert monitor.status()["accounts"][0]["status"] == "paused"
    await monitor.close()


@pytest.mark.parametrize(
    "amount,sends", [("1E-10000", False), ("-0E-10000", True), ("1E+10000", False)]
)
@run_async
async def test_extreme_provider_exponents_are_bounded_before_render(
    tmp_path, amount, sends
):
    monitor, _, _, service, context = engine(tmp_path)
    service.amounts["account-0"] = Decimal(amount)
    await monitor.run_once()
    assert bool(context.sent) is sends
    await monitor.close()


def real_query_runtime(tmp_path, clock, raw, adapter):
    from quota_link.cache import BalanceCache
    from quota_link.service import QueryService
    from quota_link.settings import load_settings

    config = load_settings(raw)
    assert not config.errors
    service = QueryService(
        config,
        {ProviderType.DEEPSEEK: adapter},
        object(),
        BalanceCache(clock),
        monotonic=clock,
        wall_clock=lambda: datetime.fromtimestamp(clock(), UTC),
    )
    context = Context()
    monitor = AlertEngine(
        config,
        service,
        context,
        tmp_path / "alerts.sqlite3",
        clock=clock,
        delivery=AlertDelivery(
            context,
            component_factory=lambda mentions, text: (mentions, text),
            session_enabled=enabled_session,
            session_llm_enabled=enabled_session,
        ),
    )
    assert monitor.storage_available
    return monitor, service


def auth_pause_config():
    return {
        "balance_alert_targets": [{"umo": "fake:GroupMessage:100", "mentions": []}],
        "balance_alert_llm": {"enabled": False},
        "providers": [
            {
                "id": name,
                "display_name": name,
                "type": "deepseek",
                "auth": {"api_key": key},
                "balance_alert": {"enabled": True, "threshold": "10", "unit": "CNY"},
            }
            for name, key in (
                ("first", "synthetic-same"),
                ("alias", "synthetic-same"),
                ("other", "synthetic-other"),
            )
        ],
    }


class AuthAdapter:
    def __init__(self, clock):
        self.clock = clock
        self.calls = []
        self.fail = True

    async def fetch_balance(self, account, client):
        self.calls.append(account.id)
        error = (
            NormalizedProviderError(
                ProviderErrorCategory.AUTHENTICATION, "合成认证失败"
            )
            if self.fail and account.auth["api_key"] == "synthetic-same"
            else None
        )
        return BalanceSnapshot(
            account.id,
            account.provider_type,
            account.display_name,
            SnapshotStatus.UNKNOWN if error else SnapshotStatus.AVAILABLE,
            ()
            if error
            else (
                BalanceItem(
                    BalanceItemKind.CASH,
                    amount=Decimal("100"),
                    unit="CNY",
                    metric="total_balance",
                ),
            ),
            "synthetic",
            datetime.fromtimestamp(self.clock(), UTC),
            error=error,
        )


@run_async
async def test_manual_auth_failure_persists_immediately_and_hydrates_new_service(
    tmp_path,
):
    from quota_link.models import QueryRequest, QueryRequestKind

    clock, raw = Clock(), auth_pause_config()
    adapter = AuthAdapter(clock)
    monitor, service = real_query_runtime(tmp_path, clock, raw, adapter)

    def request(account):
        return QueryRequest(QueryRequestKind.ACCOUNT, account)

    assert (await service.query(request("first"))).snapshots[0].error is not None
    assert adapter.calls == ["first"]
    assert (await service.query(request("alias"))).snapshots[0].error is not None
    assert (await service.query(request("other"))).snapshots[0].error is None
    assert adapter.calls == ["first", "other"]
    old_observer = monitor._on_auth_pause
    await monitor.close()
    await service.close()

    adapter = AuthAdapter(clock)
    restarted, service = real_query_runtime(tmp_path, clock, raw, adapter)
    old_observer("other")
    assert (await service.query(request("first"))).snapshots[0].error is not None
    assert (await service.query(request("alias"))).snapshots[0].error is not None
    assert not adapter.calls
    await restarted.run_once()
    assert adapter.calls == ["other"]
    adapter.fail = False
    restarted.wake("first")
    assert (await service.query(request("first"))).snapshots[0].error is None
    assert (await service.query(request("alias"))).snapshots[0].error is None
    assert "first" in adapter.calls and "alias" in adapter.calls
    await restarted.close()
    await service.close()
    adapter = AuthAdapter(clock)
    adapter.fail = False
    final, service = real_query_runtime(tmp_path, clock, raw, adapter)
    assert (await service.query(request("first"))).snapshots[0].error is None
    assert (await service.query(request("alias"))).snapshots[0].error is None
    assert adapter.calls == ["first", "alias"]
    await final.close()
    await service.close()


@run_async
async def test_auth_pause_survives_threshold_edit_but_not_changed_credentials(tmp_path):
    from quota_link.models import QueryRequest, QueryRequestKind

    clock, raw = Clock(), auth_pause_config()
    adapter = AuthAdapter(clock)
    monitor, service = real_query_runtime(tmp_path, clock, raw, adapter)
    await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "first"))
    await monitor.close()
    await service.close()
    raw["providers"][0]["balance_alert"].update(
        threshold="12", check_interval_minutes=1
    )
    adapter = AuthAdapter(clock)
    restarted, service = real_query_runtime(tmp_path, clock, raw, adapter)
    assert (
        await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "first"))
    ).snapshots[0].error is not None
    assert not adapter.calls
    await restarted.close()
    await service.close()
    raw["providers"][0]["auth"]["api_key"] = "synthetic-replaced"
    adapter = AuthAdapter(clock)
    restarted, service = real_query_runtime(tmp_path, clock, raw, adapter)
    assert (
        await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "first"))
    ).snapshots[0].error is None
    assert (
        await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "alias"))
    ).snapshots[0].error is not None
    assert adapter.calls == ["first"]
    await restarted.close()
    await service.close()


@run_async
async def test_persist_observer_failure_retains_auth_error_and_other_key_access(
    tmp_path,
):
    from quota_link.models import QueryRequest, QueryRequestKind

    clock, raw = Clock(), auth_pause_config()
    adapter = AuthAdapter(clock)
    monitor, service = real_query_runtime(tmp_path, clock, raw, adapter)
    monitor._db.close()
    error = (
        (await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "first")))
        .snapshots[0]
        .error
    )
    assert error.category == ProviderErrorCategory.AUTHENTICATION
    assert not monitor.storage_available
    result = await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "other"))
    assert result.snapshots[0].error is None
    await monitor.close()
    await service.close()
