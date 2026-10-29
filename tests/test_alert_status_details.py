"""Current blocked reasons cannot leak across low episodes or delivery outcomes."""

from decimal import Decimal

import pytest
from test_alert_runtime import engine, run_async, settings

from quota_link.alert_delivery import DeliveryResult
from quota_link.alerts import _target_key


@run_async
async def test_new_low_episode_ignores_old_reason_for_budget_delayed_target(tmp_path):
    monitor, config, clock, service, _ = engine(
        tmp_path, settings(count=2, targets=2, interval=1)
    )
    first, second = config.balance_alert_targets
    service.amounts["account-1"] = Decimal("100")
    phase, attempts = 0, []

    async def deliver(target, facts, llm, *, reserve, **kwargs):
        attempts.append((phase, target, tuple(fact.account_id for fact in facts)))
        if target == second:
            return DeliveryResult("blocked", "synthetic", "platform_not_found")
        if phase == 0:
            return DeliveryResult("blocked", "synthetic", "session_disabled")
        assert reserve()
        return DeliveryResult("submitted", "synthetic")

    monitor.delivery.deliver = deliver
    await monitor.run_once()
    assert monitor.status()["accounts"][0]["detail_code"] == "session_disabled"
    phase = 1
    clock.advance(60)
    service.amounts.update({"account-0": Decimal("100"), "account-1": Decimal("1")})
    await monitor.run_once()
    assert any(item == (1, first, ("account-1",)) for item in attempts)
    assert monitor.status()["accounts"][0]["detail_code"] == ""
    phase = 2
    clock.advance(60)
    service.amounts["account-0"] = Decimal("1")
    await monitor.run_once()
    assert not any(when == 2 and target == first for when, target, _ in attempts)
    row = monitor.status()["accounts"][0]
    assert row["status"] == "blocked" and row["detail_code"] == "platform_not_found"
    assert "会话已停用" not in row["detail"]
    assert monitor._row("account-0")["episode"] == 2
    assert not any(
        account == "account-0" and episode == 1
        for account, episode, _ in monitor._detail_codes
    )
    await monitor.close()


@run_async
@pytest.mark.parametrize(
    "superseding_status", ["submitted", "failed", "unknown", "reserved"]
)
async def test_detail_aggregates_only_current_actual_blocked_records(
    tmp_path, superseding_status
):
    monitor, config, _, _, _ = engine(tmp_path, settings(targets=2))
    first, second = config.balance_alert_targets

    async def deliver(target, *args, **kwargs):
        code = "session_disabled" if target == first else "platform_not_found"
        return DeliveryResult("blocked", "synthetic", code)

    monitor.delivery.deliver = deliver
    await monitor.run_once()
    # Simulate a superseding durable outcome while an old in-memory reason
    # remains; aggregation must trust the actual record, not that stale cache.
    with monitor._db:
        monitor._db.execute(
            "UPDATE deliveries SET status=? WHERE account_id=? AND target_key=?",
            (superseding_status, "account-0", _target_key(first)),
        )
    row = monitor.status()["accounts"][0]
    assert row["detail_code"] == "platform_not_found"
    await monitor.close()


@run_async
async def test_removed_target_and_configuration_block_do_not_reuse_delivery_reason(
    tmp_path,
):
    monitor, config, _, _, _ = engine(tmp_path, settings(targets=2))
    first, second = config.balance_alert_targets

    async def deliver(target, *args, **kwargs):
        return DeliveryResult(
            "blocked",
            "synthetic",
            "session_disabled" if target == first else "platform_not_found",
        )

    monitor.delivery.deliver = deliver
    await monitor.run_once()
    config.balance_alert_targets = (second,)
    assert monitor.status()["accounts"][0]["detail_code"] == "platform_not_found"
    config.accounts[0].queryable = False
    assert monitor.status()["accounts"][0]["detail_code"] == ""
    await monitor.close()
