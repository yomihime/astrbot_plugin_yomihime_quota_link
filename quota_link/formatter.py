"""Localized text presentation for provider-independent query results."""

from datetime import UTC, datetime
from decimal import Decimal
from unicodedata import category

from .capabilities import _PROVIDER_NAMES
from .i18n import message, render_text, tr
from .local_status import LocalStorageStatus, credential_label, storage_summary
from .models import (
    BalanceItem,
    BalanceItemKind,
    BalanceSnapshot,
    ProviderType,
    QueryParseError,
    QueryParseErrorCode,
    QueryRequestKind,
    QueryResult,
    SnapshotStatus,
)
from .settings import AccountDirectoryEntry, PluginSettings

_KIND_LABELS = {
    BalanceItemKind.CASH: message("balance.kind.cash"),
    BalanceItemKind.QUOTA: message("balance.kind.quota"),
    BalanceItemKind.FREE_QUOTA: message("balance.kind.free_quota"),
    BalanceItemKind.SUBSCRIPTION: message("balance.kind.subscription"),
    BalanceItemKind.CREDITS: message("balance.kind.credits"),
    BalanceItemKind.USAGE: message("balance.kind.usage"),
    BalanceItemKind.CUSTOM: message("balance.kind.custom"),
}

_UNAVAILABLE_REASONS = {
    "missing_environment_variable": message(
        "status.reason.missing_environment_variable"
    ),
    "missing_credentials": message("status.reason.missing_credentials"),
    "missing_grsai_token": message("status.reason.missing_grsai_token"),
    "invalid_grsai_region": message("status.reason.invalid_grsai_region"),
    "invalid_service_profile": message("status.reason.invalid_service_profile"),
    "invalid_balance_scope": message("status.reason.invalid_balance_scope"),
    "invalid_balance_kind": message("status.reason.invalid_balance_kind"),
    "grsai_method_must_post": message("status.reason.grsai_method_must_post"),
    "grsai_account_path_mismatch": message("status.reason.grsai_account_path_mismatch"),
    "grsai_balance_scope_mismatch": message(
        "status.reason.grsai_balance_scope_mismatch"
    ),
    "invalid_endpoint": message("status.reason.invalid_endpoint"),
    "invalid_base_url": message("status.reason.invalid_base_url"),
    "invalid_api_path": message("status.reason.invalid_api_path"),
}


_INCOMPLETE_REASONS = frozenset(
    {
        "missing_endpoint",
        "missing_base_url",
        "missing_api_path",
        "invalid_response_mapping",
    }
)


def _amount(value: Decimal | None, unit: str) -> str:
    if value is None:
        return tr("common.unknown")
    return f"{value} {unit}"


def _single_line(value: str) -> str:
    """Normalize free text so control characters cannot forge reply structure."""
    value = render_text(value)
    cleaned = "".join(" " if category(char) in {"Cc", "Cf"} else char for char in value)
    return " ".join(cleaned.split())


def display_semantics(
    item: BalanceItem, provider_type: ProviderType | None = None
) -> str:
    """Use affirmative copy only for the exact known built-in semantics.

    Custom/provider facts are otherwise preserved, including negative wording.
    This is command presentation, never a change to provider or tool facts.
    """
    if (
        provider_type is ProviderType.MEINIANDA
        and item.unit == "site_credit"
        and item.raw_semantics == "账户站内额度，不是 API Key 限额；不换算为货币"
    ):
        return tr("balance.site_credit_meaning")
    return _single_line(item.raw_semantics or "")


def display_target(result: QueryResult) -> str:
    """Label only the selected target; retain canonical IDs in query/tool facts."""
    target = result.request.target or ""
    if result.request.kind is QueryRequestKind.PROVIDER:
        try:
            return render_text(_PROVIDER_NAMES[ProviderType(target)])
        except ValueError:
            pass
    elif result.request.kind is QueryRequestKind.ACCOUNT:
        for snapshot in result.snapshots:
            if snapshot.account_id == target:
                return _single_line(snapshot.display_name) or _single_line(target)
    return _single_line(target)


def _display_time(value: datetime) -> str:
    return value.astimezone(UTC).strftime("%Y-%m-%d %H:%M:%S UTC")


def _item_text(item: BalanceItem, provider_type: ProviderType | None = None) -> str:
    label = _single_line(item.label) or render_text(_KIND_LABELS[item.kind])
    unit = _single_line(item.unit) or tr("balance.unknown_unit")
    values: list[str] = []
    if item.amount is not None:
        values.append(_amount(item.amount, unit))
    if item.total is not None:
        values.append(tr("balance.total_amount", amount=_amount(item.total, unit)))
    if item.remaining is not None:
        values.append(
            tr("balance.remaining_amount", amount=_amount(item.remaining, unit))
        )
    if item.used is not None:
        values.append(tr("balance.used_amount", amount=_amount(item.used, unit)))
    if not values:
        values.append(
            tr("balance.unreported", unit=unit)
            if provider_type is ProviderType.ALIBABA_BAILIAN
            else tr("balance.unknown_amount", unit=unit)
        )
    if item.expires_at is not None:
        values.append(tr("balance.expiry_date", time=_display_time(item.expires_at)))
    semantics = display_semantics(item, provider_type)
    if semantics:
        values.append(tr("balance.semantics", meaning=semantics))
    return tr(
        "common.label_value",
        label=label,
        value=tr("balance.value_separator").join(values),
    )


def display_snapshot_status(snapshot: BalanceSnapshot) -> str:
    """BSS success is a successful query, not proof of spendable credit."""
    if snapshot.provider_type is ProviderType.ALIBABA_BAILIAN:
        if snapshot.error is not None:
            return tr("query.failed")
        if snapshot.status is SnapshotStatus.AVAILABLE:
            return tr("query.success")
        if snapshot.status is SnapshotStatus.PARTIAL:
            return tr("query.partial_data")
    return {
        SnapshotStatus.AVAILABLE: tr("query.available"),
        SnapshotStatus.PARTIAL: tr("query.partial"),
        SnapshotStatus.UNAVAILABLE: tr("query.status_unavailable"),
        SnapshotStatus.UNKNOWN: tr("query.unknown_status"),
    }[snapshot.status]


def _snapshot_text(snapshot: BalanceSnapshot) -> list[str]:
    status = display_snapshot_status(snapshot)
    cache_mark = tr("query.cached") if snapshot.cached else ""
    lines = [
        tr(
            "common.label_value",
            label=_single_line(snapshot.display_name),
            value=status + cache_mark,
        )
    ]
    lines.extend(
        f"  {_item_text(item, snapshot.provider_type)}" for item in snapshot.balances
    )
    if not snapshot.balances and snapshot.error is None:
        lines.append("  " + tr("query.no_items"))
    if snapshot.error is not None:
        lines.append(
            tr("query.error_detail", message=_single_line(snapshot.error.safe_message))
        )
    lines.append(
        tr(
            "query.source_time",
            time=_display_time(snapshot.fetched_at),
            source=_single_line(snapshot.source),
        )
    )
    return lines


def format_result(result: QueryResult) -> str:
    """Render an aggregate result without interpreting provider-specific fields."""
    request = result.request
    lines = [tr("query.time", time=_display_time(result.queried_at))]
    if not result.snapshots:
        if request.kind is QueryRequestKind.ALL:
            lines.append(tr("query.no_accounts"))
        else:
            lines.append(tr("query.no_results"))
        return "\n".join(lines)

    if request.kind is QueryRequestKind.ACCOUNT:
        title = tr("query.account_title", target=display_target(result))
    elif request.kind is QueryRequestKind.PROVIDER:
        title = tr("query.provider_title", target=display_target(result))
    else:
        title = tr("query.all_title")

    lines.insert(0, title)
    for snapshot in result.snapshots:
        lines.append("")
        lines.extend(_snapshot_text(snapshot))
    successes = sum(
        snapshot.status is SnapshotStatus.AVAILABLE and snapshot.error is None
        for snapshot in result.snapshots
    )
    partial = sum(
        snapshot.status is SnapshotStatus.PARTIAL
        or (snapshot.error is not None and bool(snapshot.balances))
        for snapshot in result.snapshots
    )
    failures = len(result.snapshots) - successes - partial
    summary = tr("query.summary_separator").join(
        tr("query.outcome_count", label=label, count=count)
        for label, count in (
            (tr("query.success_short"), successes),
            (tr("query.partial_success"), partial),
            (tr("query.failed_short"), failures),
        )
        if count
    )
    lines.extend(("", tr("query.summary", summary=summary)))
    return "\n".join(lines)


HELP_NOTES = (
    message("help.tool_note"),
    message("help.compatible_note"),
    message("help.aliyun_note"),
)


def display_provider(entry: AccountDirectoryEntry) -> str:
    if entry.service_profile == "grsai":
        return "Grsai"
    return render_text(_PROVIDER_NAMES[entry.provider_type])


def local_account_state(entry: AccountDirectoryEntry, *, card: bool = False) -> str:
    if not entry.enabled:
        return tr("status.disabled")
    if entry.queryable:
        return tr("status.queryable")
    reason = _local_account_reason(entry, card=card)
    return reason if card else tr("status.not_queryable", reason=reason)


def _local_account_reason(entry: AccountDirectoryEntry, *, card: bool) -> str:
    code = entry.unavailable_reason or ""
    if code in _INCOMPLETE_REASONS:
        reason = tr(f"status.reason.{code}")
        return tr(
            "status.card_incomplete" if card else "status.incomplete", reason=reason
        )
    reason = render_text(_UNAVAILABLE_REASONS.get(code, tr("status.unknown_reason")))
    if not card:
        return reason
    key = (
        "status.card_needs_setup"
        if code
        in {
            "missing_environment_variable",
            "missing_credentials",
            "missing_grsai_token",
        }
        else "status.card_needs_check"
    )
    return tr(key, reason=reason)


def display_diagnostic(message: str) -> str:
    """Localize known command copy without changing stored diagnostic facts."""
    if message == "请填写以 / 开头的相对 API Path":
        message = tr("status.api_path")
    return _single_line(message)


def format_help(settings: PluginSettings) -> str:
    """Render local command help using the credential-free account directory."""
    lines = [tr("help.command_body") + "\n".join(map(render_text, HELP_NOTES))]
    entries = [entry for entry in settings.directory.entries if entry.enabled]
    if entries:
        names = tr("common.list_separator").join(
            _single_line(entry.display_name) for entry in entries
        )
        lines.append(tr("help.configured_accounts", names=names))
    else:
        lines.append(tr("help.no_accounts"))
    return "\n".join(lines)


def format_status(
    settings: PluginSettings, storage: LocalStorageStatus = LocalStorageStatus()
) -> str:
    """Render local settings state; this function performs no network access."""
    accounts = settings.directory.entries
    enabled = [entry for entry in accounts if entry.enabled]
    queryable = [entry for entry in enabled if entry.queryable]
    lines = [
        tr("status.title"),
        tr("status.source"),
        tr(
            "status.accounts_count",
            total=len(accounts),
            enabled=len(enabled),
            ready=len(queryable),
        ),
        tr(
            "status.group_queries_state",
            state=tr(
                "status.enabled" if settings.allow_group_queries else "status.off"
            ),
        ),
        tr(
            "status.permissions_state",
            state=tr(
                "status.admin_only"
                if settings.command_admin_only
                else "status.session_permissions"
            ),
        ),
        tr("status.credential_storage_state", state=storage_summary(storage)),
    ]
    if not accounts:
        lines.append(tr("status.no_accounts"))
    else:
        lines.append(tr("status.account_list"))
        for index, entry in enumerate(accounts):
            lines.append(
                "  "
                + tr(
                    "common.label_value",
                    label=_single_line(entry.display_name),
                    value=local_account_state(entry),
                )
            )
            lines.append(
                f"    {display_provider(entry)} · {credential_label(storage, index)}"
            )
    if settings.errors:
        lines.append(tr("status.issue_count", count=len(settings.errors)))
        lines.extend(
            f"  {display_diagnostic(diagnostic.safe_message)}"
            for diagnostic in settings.errors
        )
    return "\n".join(lines)


def format_parse_error(error: QueryParseError) -> str:
    """Render a safe parse error and, when present, its safe candidate names."""
    if error.code is QueryParseErrorCode.AMBIGUOUS and error.candidates:
        candidates = tr("common.list_separator").join(
            _single_line(candidate) for candidate in error.candidates
        )
        return tr(
            "query.matches",
            message=_single_line(error.safe_message),
            candidates=candidates,
        )
    return _single_line(error.safe_message)
