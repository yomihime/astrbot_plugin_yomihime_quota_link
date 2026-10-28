import re
from dataclasses import replace
from datetime import UTC, datetime
from decimal import Decimal
from types import SimpleNamespace

import pytest
from test_alert_runtime import Clock, Service, engine, run_async, settings

from quota_link.alert_config import BalanceAlertLLM
from quota_link.models import (
    BalanceItem,
    BalanceItemKind,
    BalanceSnapshot,
    NormalizedProviderError,
    ProviderErrorCategory,
    ProviderType,
    QueryRequest,
    QueryRequestKind,
    SnapshotStatus,
)


class UnitService(Service):
    def __init__(self, config, clock):
        super().__init__(config, clock)
        self.items = [("CNY", Decimal("5"))]
        self.observer = None

    def set_snapshot_observer(self, callback):
        self.observer = callback

    def snapshot(self, account_id="account-0"):
        account = next(item for item in self.config.accounts if item.id == account_id)
        return BalanceSnapshot(
            account.id,
            account.provider_type,
            account.display_name,
            self.status,
            tuple(
                BalanceItem(
                    BalanceItemKind.CASH, amount=amount, unit=unit, metric=self.metric
                )
                for unit, amount in self.items
            ),
            "synthetic",
            datetime.fromtimestamp(self.clock() - self.age, UTC),
            cached=self.cached,
            error=self.error,
        )

    async def query(self, request, **kwargs):
        self.calls.append((request.target, kwargs))
        snapshot = self.snapshot(request.target)
        self.latest[request.target] = snapshot
        if self.observer is not None:
            self.observer(snapshot)
        return SimpleNamespace(snapshots=(snapshot,))


def setup(
    tmp_path,
    *,
    legacy="",
    enabled=True,
    config=None,
    clock=None,
    service=None,
    context=None,
):
    config = config or settings(interval=1)
    config.accounts[0].balance_alert = replace(
        config.accounts[0].balance_alert, unit=legacy, enabled=enabled
    )
    clock = clock or Clock()
    service = service or UnitService(config, clock)
    monitor, _, _, _, context = engine(tmp_path, config, clock, service, context)
    return monitor, config, clock, service, context


def choice(monitor, unit="CNY"):
    return next(
        item
        for item in monitor.unit_status()["accounts"][0]["choices"]
        if item["unit"] == unit
    )


def bind(monitor, unit="CNY"):
    return monitor.confirm_unit("account-0", choice(monitor, unit)["id"])


@run_async
@pytest.mark.parametrize(
    "amount,status",
    [
        (Decimal("5"), SnapshotStatus.AVAILABLE),
        (Decimal("0"), SnapshotStatus.UNAVAILABLE),
        (Decimal("-8.25"), SnapshotStatus.PARTIAL),
    ],
)
async def test_unique_actual_unit_auto_binds_and_real_zero_is_not_an_error(
    tmp_path, amount, status
):
    monitor, config, _, service, context = setup(tmp_path)
    service.items, service.status = [("USD", amount)], status
    await monitor.run_once()
    dto = monitor.unit_status()["accounts"][0]
    assert dto["unit_state"] == "verified" and dto["unit"] == "USD"
    assert dto["observed_at"].endswith("+00:00")
    assert re.fullmatch(r"[0-9a-f]{64}", dto["choices"][0]["id"])
    assert set(dto["choices"][0]) == {"id", "metric", "unit"}
    assert config.accounts[0].balance_alert.unit == ""
    assert len(context.sent) == 1 and "USD" in context.sent[0][1][1]
    await monitor.close()


@run_async
async def test_units_read_is_pure_and_disabled_account_can_confirm_fresh_cache(
    tmp_path,
):
    monitor, _, _, service, context = setup(tmp_path, enabled=False)
    service.latest["account-0"] = service.snapshot()
    before = monitor._db.total_changes
    dto = monitor.unit_status()["accounts"][0]
    assert dto["unit_state"] == "unidentified" and dto["unit"] is None
    assert len(dto["choices"]) == 1
    assert monitor._db.total_changes == before and not service.calls
    result = bind(monitor)
    assert result["unit_state"] == "verified" and result["unit"] == "CNY"
    assert not service.calls and not context.sent
    await monitor.close()


@run_async
async def test_legacy_mismatch_latches_even_after_original_unit_returns_and_restart(
    tmp_path,
):
    monitor, config, clock, service, context = setup(tmp_path, legacy="CNY")
    service.items = [("USD", Decimal("3"))]
    await monitor.run_once()
    assert (
        not context.sent
        and monitor.unit_status()["accounts"][0]["unit_state"] == "changed"
    )
    clock.advance(60)
    service.items = [("CNY", Decimal("3"))]
    await monitor.run_once()
    assert (
        not context.sent
        and monitor.unit_status()["accounts"][0]["unit_state"] == "changed"
    )
    await monitor.close()
    monitor, *_ = setup(
        tmp_path,
        legacy="CNY",
        config=config,
        clock=clock,
        service=service,
        context=context,
    )
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "changed"
    bind(monitor)
    await monitor.run_once()
    assert len(context.sent) == 1
    await monitor.close()


@run_async
async def test_multi_currency_requires_confirmation_then_selected_currency_is_stable(
    tmp_path,
):
    monitor, _, clock, service, context = setup(tmp_path)
    service.items = [("USD", Decimal("2")), ("CNY", Decimal("9"))]
    await monitor.run_once()
    assert (
        monitor.unit_status()["accounts"][0]["unit_state"] == "ambiguous"
        and not context.sent
    )
    old_cny = choice(monitor, "CNY")["id"]
    bind(monitor, "USD")
    with pytest.raises(ValueError):
        monitor.confirm_unit("account-0", old_cny)
    await monitor.run_once()
    assert len(context.sent) == 1 and "2 USD" in context.sent[0][1][1]
    assert "9 CNY" not in context.sent[0][1][1]
    clock.advance(60)
    service.items.reverse()
    await monitor.run_once()
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "verified"
    clock.advance(60)
    service.items = [("CNY", Decimal("50"))]
    await monitor.run_once()
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "changed"
    clock.advance(60)
    service.items = [("USD", Decimal("2")), ("CNY", Decimal("9"))]
    await monitor.run_once()
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "changed"
    assert len(context.sent) == 1
    await monitor.close()


@run_async
async def test_auto_bound_unit_becoming_multi_currency_requires_explicit_selection(
    tmp_path,
):
    monitor, _, clock, service, context = setup(tmp_path)
    await monitor.run_once()
    clock.advance(60)
    service.items = [("CNY", Decimal("100")), ("USD", Decimal("0"))]
    await monitor.run_once()
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "ambiguous"
    clock.advance(60)
    service.items = [("CNY", Decimal("5"))]
    await monitor.run_once()
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "ambiguous"
    assert len(context.sent) == 1
    await monitor.close()


@run_async
async def test_duplicate_unit_is_not_selectable_but_distinct_unique_unit_can_be_confirmed(
    tmp_path,
):
    monitor, _, _, service, context = setup(tmp_path)
    service.items = [
        ("CNY", Decimal("1")),
        ("CNY", Decimal("2")),
        ("USD", Decimal("3")),
    ]
    await monitor.run_once()
    dto = monitor.unit_status()["accounts"][0]
    assert dto["unit_state"] == "ambiguous"
    assert [item["unit"] for item in dto["choices"]] == ["USD"]
    bind(monitor, "USD")
    await monitor.run_once()
    assert len(context.sent) == 1 and "3 USD" in context.sent[0][1][1]
    await monitor.close()


@run_async
@pytest.mark.parametrize(
    "field", ["auth", "endpoint", "metric", "response_mapping", "provider"]
)
async def test_request_identity_change_cannot_reuse_threshold_without_confirmation(
    tmp_path, field
):
    monitor, config, clock, service, context = setup(tmp_path)
    await monitor.run_once()
    old_id = choice(monitor)["id"]
    await monitor.close()
    account = config.accounts[0]
    if field == "auth":
        account.auth = {"api_key": "synthetic-changed"}
    elif field == "endpoint":
        account.endpoint = {"url": "https://synthetic.invalid/balance"}
    elif field == "metric":
        account.balance_alert = replace(account.balance_alert, metric="granted_balance")
        service.metric = "granted_balance"
    elif field == "response_mapping":
        account.response_mapping = {"amount_path": "changed"}
    else:
        account.provider_type = ProviderType.ALIBABA_BAILIAN
    clock.advance(300)
    service.items = [("USD", Decimal("2"))]
    monitor, *_ = setup(
        tmp_path, config=config, clock=clock, service=service, context=context
    )
    await monitor.run_once()
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "changed"
    assert len(context.sent) == 1
    with pytest.raises(ValueError):
        monitor.confirm_unit(account.id, old_id)
    bind(monitor, "USD")
    await monitor.run_once()
    assert len(context.sent) == 2 and "2 USD" in context.sent[-1][1][1]
    await monitor.close()


@run_async
async def test_delete_then_readd_same_id_requires_confirmation(tmp_path):
    monitor, config, clock, service, context = setup(tmp_path)
    await monitor.run_once()
    await monitor.close()
    empty = SimpleNamespace(
        accounts=(),
        balance_alert_targets=config.balance_alert_targets,
        balance_alert_llm=config.balance_alert_llm,
    )
    deleted, *_ = engine(tmp_path, empty, clock, service, context)
    await deleted.close()
    monitor, *_ = setup(
        tmp_path, config=config, clock=clock, service=service, context=context
    )
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "changed"
    await monitor.close()


@run_async
@pytest.mark.parametrize("failure", ["error", "stale", "missing", "wrong_metric"])
async def test_invalid_observations_do_not_change_unit_or_recover_episode(
    tmp_path, failure
):
    monitor, _, clock, service, context = setup(tmp_path)
    await monitor.run_once()
    original = dict(monitor._binding("account-0"))
    clock.advance(60)
    service.items = [("USD", Decimal("100"))]
    if failure == "error":
        service.error = NormalizedProviderError(
            ProviderErrorCategory.RATE_LIMITED, "synthetic"
        )
    elif failure == "stale":
        service.age = 61
    elif failure == "missing":
        service.items = [("USD", None)]
    else:
        service.metric = "granted_balance"
    await monitor.run_once()
    assert dict(monitor._binding("account-0")) == original
    clock.advance(60)
    service.error, service.age, service.metric = None, 0, "total_balance"
    service.items = [("CNY", Decimal("5"))]
    await monitor.run_once()
    assert len(context.sent) == 1
    await monitor.close()


@run_async
@pytest.mark.parametrize("change", ["timestamp", "amount", "stale"])
async def test_confirmation_rejects_replaced_or_expired_snapshot_choices(
    tmp_path, change
):
    monitor, _, clock, service, _ = setup(tmp_path, enabled=False)
    await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "account-0"))
    old = choice(monitor)["id"]
    if change == "timestamp":
        clock.advance(1)
        await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "account-0"))
    elif change == "amount":
        service.items = [("CNY", Decimal("4"))]
        await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "account-0"))
    else:
        clock.advance(61)
    with pytest.raises(ValueError):
        monitor.confirm_unit("account-0", old)
    await monitor.close()


@run_async
async def test_manual_success_observer_latches_change_before_next_scheduler_tick(
    tmp_path,
):
    monitor, _, clock, service, context = setup(tmp_path, enabled=False)
    await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "account-0"))
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "verified"
    clock.advance(1)
    service.items = [("USD", Decimal("5"))]
    await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "account-0"))
    clock.advance(1)
    service.items = [("CNY", Decimal("5"))]
    await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "account-0"))
    assert (
        monitor.unit_status()["accounts"][0]["unit_state"] == "changed"
        and not context.sent
    )
    old_observer = service.observer
    await monitor.close()
    assert service.observer is None
    old_observer(service.snapshot())


@run_async
async def test_confirm_same_unit_during_llm_revokes_old_queued_generation(tmp_path):
    monitor, config, _, service, context = setup(tmp_path)
    config.balance_alert_llm = BalanceAlertLLM(True)

    async def generate(**kwargs):
        bind(monitor)
        return SimpleNamespace(completion_text="温馨提醒：请及时检查账户额度。")

    context.llm_generate = generate
    await monitor.run_once()
    assert not context.sent
    config.balance_alert_llm = BalanceAlertLLM(False)
    await monitor.run_once()
    assert len(context.sent) == 1
    await monitor.close()


@run_async
async def test_confirm_during_query_does_not_reuse_old_low_episode(tmp_path):
    monitor, _, clock, service, context = setup(tmp_path)
    await monitor.run_once()
    assert monitor._row("account-0")["episode"] == 1
    clock.advance(300)
    service.items = [("USD", Decimal("2"))]
    original = service.query

    async def confirm_in_query(*args, **kwargs):
        result = await original(*args, **kwargs)
        bind(monitor, "USD")
        return result

    service.query = confirm_in_query
    await monitor.run_once()
    assert monitor._row("account-0")["episode"] == 2
    assert len(context.sent) == 2 and "2 USD" in context.sent[-1][1][1]
    await monitor.close()


@run_async
@pytest.mark.parametrize(
    "unit", ["custom", "unknown", " USD", "USD\u200b", "USD\ud800", "A" * 33]
)
async def test_unknown_or_unsafe_unit_never_binds(tmp_path, unit):
    monitor, _, _, service, context = setup(tmp_path)
    service.items = [(unit, Decimal("0"))]
    await monitor.run_once()
    dto = monitor.unit_status()["accounts"][0]
    assert dto["unit_state"] == "unidentified" and not dto["choices"]
    assert not context.sent
    await monitor.close()


@run_async
async def test_more_than_twenty_units_is_ambiguous_without_truncated_choices(tmp_path):
    monitor, _, _, service, context = setup(tmp_path)
    service.items = [(f"unit-{number}", Decimal("1")) for number in range(21)]
    await monitor.run_once()
    dto = monitor.unit_status()["accounts"][0]
    assert dto["unit_state"] == "ambiguous" and dto["choices"] == []
    assert not context.sent
    await monitor.close()


@run_async
@pytest.mark.parametrize(
    "provider,metric,unit",
    [
        (ProviderType.GRSAI, "credit", "credit"),
        (ProviderType.MEINIANDA, "site_credit", "site_credit"),
    ],
)
async def test_fixed_contract_unit_must_match_actual_item(
    tmp_path, provider, metric, unit
):
    config = settings(interval=1)
    config.accounts[0].provider_type = provider
    config.accounts[0].balance_alert = replace(
        config.accounts[0].balance_alert, metric=metric, unit=""
    )
    monitor, _, clock, service, context = setup(tmp_path, config=config)
    service.metric, service.items = metric, [("USD", Decimal("1"))]
    await monitor.run_once()
    dto = monitor.unit_status()["accounts"][0]
    assert dto["unit_state"] == "changed" and not dto["choices"] and not context.sent
    clock.advance(60)
    service.items = [(unit, Decimal("1"))]
    await monitor.run_once()
    assert not context.sent
    bind(monitor, unit)
    await monitor.run_once()
    assert len(context.sent) == 1
    await monitor.close()


@run_async
@pytest.mark.parametrize(
    "transport_result", [True, RuntimeError("synthetic uncertain")]
)
async def test_same_unit_confirmation_preserves_submitted_or_unknown_episode(
    tmp_path, transport_result
):
    monitor, config, clock, service, context = setup(tmp_path)
    context.result = transport_result
    await monitor.run_once()
    assert len(context.sent) == 1
    original_episode = monitor._row("account-0")["episode"]
    clock.advance(60)
    service.items = [("CNY", Decimal("5")), ("USD", Decimal("2"))]
    await monitor.run_once()
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "ambiguous"
    bind(monitor, "CNY")
    clock.advance(300)
    context.result = True
    await monitor.run_once()
    assert monitor._row("account-0")["episode"] == original_episode
    assert len(context.sent) == 1
    await monitor.close()
    monitor, *_ = setup(
        tmp_path, config=config, clock=clock, service=service, context=context
    )
    clock.advance(300)
    await monitor.run_once()
    assert len(context.sent) == 1
    await monitor.close()


@run_async
async def test_unverified_legacy_guess_is_not_reported_as_observed_unit(tmp_path):
    monitor, _, _, service, _ = setup(tmp_path, legacy="CNY")
    service.items = [("USD", Decimal("5"))]
    await monitor.run_once()
    dto = monitor.unit_status()["accounts"][0]
    assert dto["unit_state"] == "changed" and dto["unit"] is None
    assert dto["observed_at"] is None
    assert dto["choices"][0]["unit"] == "USD"
    await monitor.close()


@run_async
async def test_changed_unit_retains_only_previous_actual_unit_timestamp(tmp_path):
    monitor, _, clock, service, _ = setup(tmp_path)
    await monitor.run_once()
    original = monitor.unit_status()["accounts"][0]
    clock.advance(300)
    service.items = [("USD", Decimal("5"))]
    await monitor.run_once()
    changed = monitor.unit_status()["accounts"][0]
    assert changed["unit_state"] == "changed" and changed["unit"] == "CNY"
    assert changed["observed_at"] == original["observed_at"]
    bind(monitor, "USD")
    confirmed = monitor.unit_status()["accounts"][0]
    assert (
        confirmed["unit"] == "USD"
        and confirmed["observed_at"] != original["observed_at"]
    )
    await monitor.close()


@run_async
@pytest.mark.parametrize("kind", ["session_disabled", "fixed_hint", "normal"])
async def test_status_detail_is_a_closed_code_not_a_freeform_model_message(
    tmp_path, kind
):
    monitor, config, _, _, context = setup(tmp_path)
    if kind == "session_disabled":

        async def disabled(umo):
            return False

        monitor.delivery.session_enabled = disabled
    elif kind == "fixed_hint":
        config.balance_alert_llm = BalanceAlertLLM(True)

        async def failure(**kwargs):
            raise RuntimeError("synthetic secret must not reach status")

        context.llm_generate = failure
    await monitor.run_once()
    dto = monitor.status()["accounts"][0]
    assert dto["detail_code"] == ("" if kind == "normal" else kind)
    assert "synthetic secret" not in repr(dto)
    await monitor.close()


@run_async
@pytest.mark.parametrize(
    "field,value",
    [("revision", -1), ("observed_at", 1e300), ("verified_at", "invalid")],
)
async def test_corrupt_unit_metadata_fails_closed(tmp_path, field, value):
    import sqlite3

    from quota_link.alerts import AlertEngine

    monitor, config, clock, service, context = setup(tmp_path)
    await monitor.run_once()
    await monitor.close()
    with sqlite3.connect(tmp_path / "alerts.sqlite3") as db:
        db.execute(f"UPDATE unit_bindings SET {field}=?", (value,))
    monitor = AlertEngine(
        config, service, context, tmp_path / "alerts.sqlite3", clock=clock
    )
    assert not monitor.storage_available
    assert monitor.status()["accounts"][0]["status"] == "storage_unavailable"
    await monitor.close()


@run_async
@pytest.mark.parametrize("elapsed", [0, 1])
async def test_newer_same_unit_recovery_during_llm_revokes_queued_low_fact(
    tmp_path, elapsed
):
    monitor, config, clock, service, context = setup(tmp_path)
    config.balance_alert_llm = BalanceAlertLLM(True)

    async def generate(**kwargs):
        clock.advance(elapsed)
        service.items = [("CNY", Decimal("100"))]
        await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "account-0"))
        return SimpleNamespace(completion_text="温馨提醒：请及时检查账户额度。")

    context.llm_generate = generate
    await monitor.run_once()
    assert not context.sent
    config.balance_alert_llm = BalanceAlertLLM(False)
    monitor.wake("account-0")
    await monitor.run_once()
    assert monitor._row("account-0")["low"] == 0
    assert not context.sent
    await monitor.close()


@run_async
async def test_verified_binding_outlives_candidate_ttl_and_restart(tmp_path):
    monitor, config, clock, service, context = setup(tmp_path)
    await monitor.run_once()
    original = monitor.unit_status()["accounts"][0]
    old_id = original["choices"][0]["id"]
    clock.advance(61)
    before = monitor._db.total_changes
    expired = monitor.unit_status()["accounts"][0]
    assert expired["unit_state"] == "verified"
    assert expired["unit"] == "CNY"
    assert expired["observed_at"] == original["observed_at"]
    assert expired["binding_metric"] == "total_balance"
    assert expired["choices_state"] == "expired" and expired["choices"] == []
    assert monitor._db.total_changes == before and len(service.calls) == 1
    with pytest.raises(ValueError):
        monitor.confirm_unit("account-0", old_id)
    await monitor.close()
    monitor, *_ = setup(
        tmp_path, config=config, clock=clock, service=service, context=context
    )
    assert monitor.unit_status()["accounts"][0] == expired
    await monitor.close()


@run_async
@pytest.mark.parametrize("legacy", ["", "CNY"])
@pytest.mark.parametrize("actual", ["CNY", "USD"])
async def test_first_credentials_do_not_turn_unverified_threshold_into_real_binding(
    tmp_path, legacy, actual
):
    config = settings(interval=1, threshold="10.000000000000000001")
    account = config.accounts[0]
    account.auth, account.queryable = {}, False
    monitor, _, clock, service, context = setup(tmp_path, config=config, legacy=legacy)
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "unidentified"
    await monitor.close()
    account.auth, account.queryable = {"api_key": "synthetic-first-key"}, True
    monitor, *_ = setup(
        tmp_path,
        config=config,
        legacy=legacy,
        clock=clock,
        service=service,
        context=context,
    )
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "unidentified"
    service.items = [(actual, Decimal("1"))]
    await monitor.run_once()
    dto = monitor.unit_status()["accounts"][0]
    if legacy and legacy != actual:
        # A mismatching legacy threshold-unit reference still needs an explicit
        # decision; it is never presented as a previously verified binding.
        assert dto["unit_state"] == "changed"
        assert dto["unit"] is None and dto["binding_metric"] is None
        assert not context.sent
    else:
        assert dto["unit_state"] == "verified" and dto["unit"] == actual
        assert len(context.sent) == 1
    assert account.balance_alert.threshold == Decimal("10.000000000000000001")
    await monitor.close()


@run_async
async def test_same_currency_metric_switch_reports_real_semantic_change(tmp_path):
    config = settings(interval=1)
    account = config.accounts[0]
    account.provider_type = ProviderType.ALIBABA_BAILIAN
    account.balance_alert = replace(account.balance_alert, metric="AvailableAmount")
    monitor, _, clock, service, context = setup(tmp_path, config=config)
    service.metric = "AvailableAmount"
    await monitor.run_once()
    original = monitor.unit_status()["accounts"][0]
    await monitor.close()
    account.balance_alert = replace(account.balance_alert, metric="AvailableCashAmount")
    service.metric = "AvailableCashAmount"
    clock.advance(61)
    monitor, *_ = setup(
        tmp_path, config=config, clock=clock, service=service, context=context
    )
    dto = monitor.unit_status()["accounts"][0]
    assert dto["unit_state"] == "changed" and dto["unit"] == "CNY"
    assert dto["change_reason"] == "metric_changed"
    assert dto["metric"] == "AvailableCashAmount"
    assert dto["binding_metric"] == "AvailableAmount"
    assert dto["observed_at"] == original["observed_at"]
    await monitor.close()
    account.auth = {"api_key": "synthetic-replaced-again"}
    monitor, *_ = setup(
        tmp_path, config=config, clock=clock, service=service, context=context
    )
    assert monitor.unit_status()["accounts"][0]["change_reason"] == "metric_changed"
    await monitor.refresh_units(account.id, lambda: None)
    await monitor.run_once()
    dto = monitor.unit_status()["accounts"][0]
    assert dto["unit_state"] == "changed" and len(context.sent) == 1
    assert (
        monitor.status()["accounts"][0]["message"] == "监测项已变更，请确认阈值和单位"
    )
    bind(monitor)
    dto = monitor.unit_status()["accounts"][0]
    assert dto["binding_metric"] == "AvailableCashAmount" and dto["change_reason"] == ""
    assert account.balance_alert.threshold == Decimal("10")
    await monitor.close()


@run_async
async def test_expired_changed_candidates_require_explicit_query_then_confirmation(
    tmp_path,
):
    monitor, _, clock, service, context = setup(tmp_path)
    await monitor.run_once()
    clock.advance(61)
    service.items = [("USD", Decimal("3"))]
    await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "account-0"))
    old_id = choice(monitor, "USD")["id"]
    clock.advance(61)
    dto = monitor.unit_status()["accounts"][0]
    assert dto["unit_state"] == "changed" and dto["choices"] == []
    assert dto["choices_state"] == "expired"
    calls = len(service.calls)
    monitor.unit_status()
    assert len(service.calls) == calls
    result = await monitor.refresh_units("account-0", lambda: None)
    assert service.calls[-1] == ("account-0", {"max_age_seconds": 0})
    dto = result["accounts"][0]
    assert dto["unit_state"] == "changed" and dto["choices_state"] == "fresh"
    assert dto["choices"][0]["unit"] == "USD"
    assert len(context.sent) == 1
    with pytest.raises(ValueError):
        monitor.confirm_unit("account-0", old_id)
    bind(monitor, "USD")
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "verified"
    assert len(context.sent) == 1
    await monitor.close()


@run_async
async def test_explicit_refresh_versions_even_identical_candidates(tmp_path):
    monitor, _, _, service, _ = setup(tmp_path, enabled=False)
    service.items = [("CNY", Decimal("3")), ("USD", Decimal("2"))]
    await monitor.refresh_units("account-0", lambda: None)
    old_id = choice(monitor)["id"]
    await monitor.refresh_units("account-0", lambda: None)
    assert choice(monitor)["id"] != old_id
    with pytest.raises(ValueError):
        monitor.confirm_unit("account-0", old_id)
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "ambiguous"
    await monitor.close()


@run_async
@pytest.mark.parametrize("failure", ["error", "missing_metric", "duplicate", "stale"])
async def test_explicit_refresh_never_reports_empty_candidates_as_success(
    tmp_path, failure
):
    monitor, _, _, service, context = setup(tmp_path, enabled=False)
    if failure == "error":
        service.error = NormalizedProviderError(
            ProviderErrorCategory.RATE_LIMITED, "synthetic"
        )
    elif failure == "missing_metric":
        service.metric = "granted_balance"
    elif failure == "duplicate":
        service.items = [("CNY", Decimal("1")), ("CNY", Decimal("2"))]
    else:
        service.age = 61
    with pytest.raises(ValueError, match="未取得"):
        await monitor.refresh_units("account-0", lambda: None)
    assert not monitor.unit_status()["accounts"][0]["choices"] and not context.sent
    await monitor.close()


@run_async
@pytest.mark.parametrize("semantic_reset", [0, 1])
async def test_old_binding_schema_migration_never_invents_previous_metric(
    tmp_path, semantic_reset
):
    import sqlite3

    monitor, config, clock, service, context = setup(tmp_path)
    await monitor.run_once()
    await monitor.close()
    with sqlite3.connect(tmp_path / "alerts.sqlite3") as db:
        db.execute("ALTER TABLE unit_bindings DROP COLUMN binding_metric")
        db.execute("ALTER TABLE unit_bindings DROP COLUMN change_reason")
        if semantic_reset:
            db.execute("UPDATE unit_bindings SET state='changed',semantic_reset=1")
    monitor, *_ = setup(
        tmp_path, config=config, clock=clock, service=service, context=context
    )
    dto = monitor.unit_status()["accounts"][0]
    assert dto["unit"] == "CNY"
    assert dto["binding_metric"] == (None if semantic_reset else "total_balance")
    assert dto["change_reason"] == ("query_identity_changed" if semantic_reset else "")
    await monitor.close()


@run_async
async def test_config_store_threshold_then_first_credential_keeps_unidentified(
    tmp_path,
):
    from quota_link.config_store import ConfigStore
    from quota_link.security import SecretStore
    from quota_link.settings import load_settings

    store = ConfigStore(SecretStore(tmp_path), {})
    raw = {
        "providers": [
            {
                "id": "account-0",
                "type": "deepseek",
                "display_name": "Synthetic",
                "balance_alert": {"enabled": True, "threshold": "10.00"},
            }
        ],
        "balance_alert_targets": [{"umo": "fake:GroupMessage:100", "mentions": []}],
        "balance_alert_llm": {"enabled": False},
    }
    saved = await store.dispatch("update", {"revision": 0, "config": raw}, lambda: None)
    config = load_settings(store.runtime_config())
    clock = Clock()
    service = UnitService(config, clock)
    monitor, *_ = engine(tmp_path, config, clock, service)
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "unidentified"
    await monitor.close()
    saved = await store.dispatch(
        "credential-replace",
        {
            "revision": saved["revision"],
            "account_id": "account-0",
            "field": "api_key",
            "value": "synthetic-first-key",
        },
        lambda: None,
    )
    config = load_settings(store.runtime_config())
    service = UnitService(config, clock)
    monitor, *_ = engine(tmp_path, config, clock, service)
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "unidentified"
    await monitor.refresh_units("account-0", lambda: None)
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "verified"
    assert saved["config"]["providers"][0]["balance_alert"]["threshold"] == "10.00"
    await monitor.close()


@run_async
async def test_close_cancels_explicit_refresh_without_waiting_for_provider(tmp_path):
    import asyncio

    monitor, _, _, service, context = setup(tmp_path, enabled=False)
    entered = asyncio.Event()

    async def delayed_query(*args, **kwargs):
        entered.set()
        await asyncio.Event().wait()

    service.query = delayed_query
    refresh = asyncio.create_task(monitor.refresh_units("account-0", lambda: None))
    await entered.wait()
    await monitor.close()
    assert refresh.done() and refresh.cancelled()
    assert not context.sent


@run_async
@pytest.mark.parametrize(
    "failure", ["missing_metric", "invalid_unit", "invalid_amount"]
)
@pytest.mark.parametrize("elapsed", [0, 1])
async def test_new_success_without_usable_metric_revokes_queued_fact_only(
    tmp_path, failure, elapsed
):
    monitor, config, clock, service, context = setup(tmp_path)
    config.balance_alert_llm = BalanceAlertLLM(True)
    observed = {}

    async def generate(**kwargs):
        observed["binding"] = dict(monitor._binding("account-0"))
        observed["episode"] = monitor._row("account-0")["episode"]
        clock.advance(elapsed)
        if failure == "missing_metric":
            service.metric = "granted_balance"
        elif failure == "invalid_unit":
            service.items = [("unknown", Decimal("5"))]
        else:
            service.items = [("CNY", None)]
        await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "account-0"))
        assert dict(monitor._binding("account-0")) == observed["binding"]
        return SimpleNamespace(completion_text="温馨提醒：请及时检查账户额度。")

    context.llm_generate = generate
    await monitor.run_once()
    assert not context.sent
    row = monitor._row("account-0")
    assert row["low"] == 1 and row["episode"] == observed["episode"]
    assert monitor.unit_status()["accounts"][0]["unit_state"] == "verified"
    assert monitor._db.execute("SELECT count(*) FROM deliveries").fetchone()[0] == 0
    config.balance_alert_llm = BalanceAlertLLM(False)
    service.metric, service.items = "total_balance", [("CNY", Decimal("5"))]
    clock.advance(60)
    await monitor.run_once()
    assert len(context.sent) == 1
    assert monitor._row("account-0")["episode"] == observed["episode"]
    await monitor.close()


@run_async
async def test_old_snapshot_cannot_restore_token_after_new_success_missing_metric(
    tmp_path,
):
    monitor, config, clock, service, context = setup(tmp_path)
    config.balance_alert_llm = BalanceAlertLLM(True)

    async def generate(**kwargs):
        old = service.latest["account-0"]
        clock.advance(1)
        service.metric = "granted_balance"
        await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "account-0"))
        token = monitor._observation_tokens["account-0"]
        monitor._on_snapshot(old)
        assert monitor._observation_tokens["account-0"] == token
        service.latest["account-0"] = old
        assert monitor.unit_status()["accounts"][0]["choices"] == []
        return SimpleNamespace(completion_text="温馨提醒：请及时检查账户额度。")

    context.llm_generate = generate
    await monitor.run_once()
    assert not context.sent
    assert monitor._row("account-0")["low"] == 1
    await monitor.close()


@run_async
async def test_unusable_new_success_keeps_unknown_delivery_suppression(tmp_path):
    monitor, _, clock, service, context = setup(tmp_path)
    context.result = RuntimeError("synthetic uncertain delivery")
    await monitor.run_once()
    episode = monitor._row("account-0")["episode"]
    assert monitor.status()["accounts"][0]["status"] == "unknown"
    clock.advance(1)
    service.metric = "granted_balance"
    await service.query(QueryRequest(QueryRequestKind.ACCOUNT, "account-0"))
    assert monitor._row("account-0")["low"] == 1
    assert monitor._row("account-0")["episode"] == episode
    assert (
        monitor._db.execute("SELECT status FROM deliveries").fetchone()[0] == "unknown"
    )
    service.metric = "total_balance"
    clock.advance(60)
    context.result = True
    await monitor.run_once()
    assert monitor.status()["accounts"][0]["status"] == "unknown"
    assert len(context.sent) == 1
    await monitor.close()
