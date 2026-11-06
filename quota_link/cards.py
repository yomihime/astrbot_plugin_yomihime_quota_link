"""Command-only cards from normalized facts; no provider IO or HTML renderer."""

from datetime import UTC, datetime
from pathlib import Path

from .formatter import (
    _KIND_LABELS,
    _single_line,
    display_diagnostic,
    display_provider,
    display_semantics,
    display_snapshot_status,
    display_target,
    local_account_state,
)
from .i18n import render_text, tr
from .local_status import LocalStorageStatus, credential_label, storage_summary
from .models import (
    BalanceItem,
    ProviderType,
    QueryRequestKind,
    QueryResult,
    SnapshotStatus,
)
from .presentation.bitmap import CardSpec, Row, Section, render_card
from .presentation.font import CardFontProvider
from .presentation.provider_logos import load_logo, select_logo_key
from .settings import AccountDirectory, AccountDirectoryEntry, PluginSettings


def _time(value: datetime) -> str:
    return value.astimezone(UTC).strftime("%Y-%m-%d %H:%M:%S UTC")


def _item_rows(
    item: BalanceItem, provider_type: ProviderType, *, identify_notes: bool = False
) -> tuple[Row, ...]:
    label = _single_line(item.label) or render_text(_KIND_LABELS[item.kind])
    unit = _single_line(item.unit) or tr("balance.unknown_unit")
    rows = []
    for key, suffix in (
        ("amount", ""),
        ("total", tr("balance.total")),
        ("remaining", tr("balance.remaining")),
        ("used", tr("balance.used")),
    ):
        value = getattr(item, key)
        if value is not None:
            heading = f"{label} · {suffix}" if suffix else label
            rows.append(Row((heading, f"{value} {unit}")))
    if not rows:
        rows.append(
            Row(
                (
                    label,
                    tr("balance.unreported", unit=unit)
                    if provider_type is ProviderType.ALIBABA_BAILIAN
                    else tr("balance.unknown_amount", unit=unit),
                )
            )
        )
    if item.expires_at is not None:
        rows.append(
            Row(
                (
                    tr("balance.item_expiry", label=label)
                    if identify_notes
                    else tr("balance.expiry"),
                    _time(item.expires_at),
                ),
                role="note",
            )
        )
    semantics = display_semantics(item, provider_type)
    if semantics:
        rows.append(
            Row(
                (
                    tr("balance.item_note", label=label) if identify_notes else "",
                    semantics,
                ),
                role="note",
            )
        )
    return tuple(rows)


def _account_icon_key(entry: AccountDirectoryEntry) -> str:
    return select_logo_key(
        entry.provider_type.value, entry.service_profile, entry.region
    )


def build_result_card(
    result: QueryResult, directory: AccountDirectory | None = None
) -> CardSpec:
    """Project every visible fact into YGL-style stat and property panels."""
    if result.request.kind is QueryRequestKind.ACCOUNT:
        title = tr("query.account_card_title")
    elif result.request.kind is QueryRequestKind.PROVIDER:
        title = tr("query.provider_card_title")
    else:
        title = tr("query.all_card_title")
    icons = (
        {
            (entry.id, entry.provider_type): _account_icon_key(entry)
            for entry in directory.entries
        }
        if directory is not None
        else {}
    )
    sections = []
    for snapshot in result.snapshots:
        state = display_snapshot_status(snapshot)
        cache_mark = tr("query.cached_card") if snapshot.cached else ""
        rows = tuple(
            row
            for item in snapshot.balances
            for row in _item_rows(
                item, snapshot.provider_type, identify_notes=len(snapshot.balances) > 1
            )
        )
        if not rows and snapshot.error is None:
            rows = (Row(("", tr("query.no_items")), role="note"),)
        if snapshot.error is not None:
            rows += (
                Row(
                    (tr("query.failed"), _single_line(snapshot.error.safe_message)),
                    role="error",
                ),
            )
        sections.append(
            Section(
                heading=f"{_single_line(snapshot.display_name)} · {state}{cache_mark}",
                icon_key=icons.get(
                    (snapshot.account_id, snapshot.provider_type),
                    snapshot.provider_type.value,
                ),
                paragraphs=(
                    tr(
                        "query.source_time_card",
                        source=_single_line(snapshot.source),
                        time=_time(snapshot.fetched_at),
                    ),
                ),
                rows=rows,
            )
        )
    if not sections:
        message = (
            tr("query.no_accounts")
            if result.request.kind is QueryRequestKind.ALL
            else tr("query.no_results")
        )
        sections.append(Section(heading=tr("query.empty_title"), paragraphs=(message,)))
    successes = sum(
        s.status is SnapshotStatus.AVAILABLE and s.error is None
        for s in result.snapshots
    )
    partial = sum(
        s.status is SnapshotStatus.PARTIAL or (s.error is not None and bool(s.balances))
        for s in result.snapshots
    )
    failures = len(result.snapshots) - successes - partial
    summary = [tr("query.accounts_count", count=len(result.snapshots))]
    for count, label in (
        (successes, tr("query.success")),
        (partial, tr("query.partial_success")),
        (failures, tr("query.failed")),
    ):
        if count:
            summary.append(tr("query.account_outcome_count", count=count, label=label))
    target = (
        tr("query.target_card", target=display_target(result))
        if result.request.target
        else ""
    )
    return CardSpec(
        title=title,
        subtitle=target + " · ".join(summary),
        caption=tr("query.time_card", time=_time(result.queried_at)),
        sections=tuple(sections),
    )


def render_result_card(
    result: QueryResult,
    font_path: Path | None = None,
    *,
    directory: AccountDirectory | None = None,
) -> bytes | None:
    """Return a complete offline PNG or None so the caller keeps full text.

    No sensitive exception details or raw provider data leave this boundary.
    The bounded renderer refuses oversized content and missing glyphs instead
    of silently cropping, replacing characters, or dropping account facts.
    """
    try:
        return render_local_card(build_result_card(result, directory), font_path)
    except Exception:
        return None


def build_help_card(settings: PluginSettings) -> CardSpec:
    """Build command help from the credential-free directory, with no IO."""
    names = tuple(
        _single_line(entry.display_name)
        for entry in settings.directory.entries
        if entry.enabled
    )
    return CardSpec(
        title=tr("help.card_title"),
        width=720,
        layout="compact",
        subtitle=tr("help.card_subtitle"),
        sections=(
            Section(
                heading=tr("help.query"),
                rows=(
                    Row(
                        (tr("help.all_accounts"), tr("help.all_command")),
                        role="command",
                    ),
                    Row(
                        (tr("help.select_account"), tr("help.account_command")),
                        role="command",
                    ),
                    Row(
                        (tr("help.select_provider"), tr("help.provider_command")),
                        role="command",
                    ),
                ),
                paragraphs=(tr("help.name_note"),),
            ),
            Section(
                heading=tr("help.status_heading"),
                rows=(
                    Row((tr("help.usage"), "/yql help"), role="command"),
                    Row((tr("help.local_config"), "/yql status"), role="command"),
                    Row((tr("help.alerts"), "/yql alert help"), role="command"),
                ),
                paragraphs=(tr("help.local_note"),),
            ),
            Section(
                heading=tr("help.enabled_accounts", count=len(names)),
                rows=tuple(Row(("", name), role="note") for name in names),
                paragraphs=() if names else (tr("help.no_enabled_accounts"),),
            ),
        ),
        limitations=(
            tr("help.card_tool_note"),
            tr("help.management_note"),
        ),
    )


def build_status_card(
    settings: PluginSettings, storage: LocalStorageStatus = LocalStorageStatus()
) -> CardSpec:
    """Show local readiness and save records, never remote credential validity."""
    accounts = settings.directory.entries
    enabled = sum(entry.enabled for entry in accounts)
    ready = sum(entry.enabled and entry.queryable for entry in accounts)
    sections = [
        Section(
            heading=tr("status.card_access"),
            rows=(
                Row(
                    (tr("status.credential_storage"), storage_summary(storage)),
                    role="note",
                ),
                Row(
                    (
                        tr("status.group_queries"),
                        tr("status.enabled")
                        if settings.allow_group_queries
                        else tr("status.off"),
                    ),
                    role="note",
                ),
                Row(
                    (
                        tr("status.permissions"),
                        tr("status.admin_only")
                        if settings.command_admin_only
                        else tr("status.session_permissions"),
                    ),
                    role="note",
                ),
            ),
        )
    ]
    for index, entry in enumerate(accounts):
        state = local_account_state(entry, card=True)
        sections.append(
            Section(
                heading=_single_line(entry.display_name),
                icon_key=_account_icon_key(entry),
                rows=(
                    Row(
                        (
                            "",
                            state,
                        ),
                        role="metric"
                        if entry.queryable or not entry.enabled
                        else "error",
                    ),
                    Row(
                        (
                            tr("status.saved_credentials"),
                            credential_label(storage, index),
                        ),
                        role="note",
                    ),
                ),
                paragraphs=(tr("status.provider", provider=display_provider(entry)),),
            )
        )
    if not accounts:
        sections.append(
            Section(
                heading=tr("status.card_no_accounts"),
                rows=(Row((tr("status.next_step"), tr("status.add_account"))),),
                paragraphs=(tr("status.after_save"),),
            )
        )
    if settings.errors:
        sections.append(
            Section(
                heading=tr("status.card_issues", count=len(settings.errors)),
                rows=tuple(
                    Row(
                        (str(index + 1), display_diagnostic(issue.safe_message)),
                        role="error",
                    )
                    for index, issue in enumerate(settings.errors)
                ),
            )
        )
    return CardSpec(
        title=tr("status.card_title"),
        width=720,
        layout="compact",
        subtitle=tr(
            "status.card_counts", total=len(accounts), enabled=enabled, ready=ready
        ),
        caption=tr("status.card_source"),
        sections=tuple(sections),
        limitations=(tr("status.card_online_check"),),
    )


def render_local_card(spec: CardSpec, font_path: Path | None = None) -> bytes | None:
    """Use the same bounded offline renderer and full-text fallback as queries."""
    try:
        icons = (
            tuple(load_logo(section.icon_key) for section in spec.sections)
            if len(spec.sections) <= 32
            else ()
        )
        return render_card(
            spec, font_provider=CardFontProvider(font_path), section_icons=icons
        ).content
    except Exception:
        return None
