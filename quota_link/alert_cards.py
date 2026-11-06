"""Credential-free alert command projections; no command parsing, IO or retries."""

from datetime import UTC, datetime

from .formatter import _single_line
from .i18n import message, render_text, tr
from .presentation.bitmap import CardSpec, Row, Section

HELP_GROUPS = (
    (
        message("help.status_heading"),
        (
            (message("help.usage"), "/yql alert help"),
            (message("alert.help.status"), "/yql alert status"),
            (
                message("alert.help.units_read"),
                message("alert.help.units_read_command"),
            ),
            (
                message("alert.help.units_refresh"),
                message("alert.help.units_refresh_command"),
            ),
        ),
    ),
    (
        message("alert.help.account_heading"),
        (
            (message("alert.help.toggle"), message("alert.help.toggle_command")),
            (message("alert.help.interval"), message("alert.help.interval_command")),
            (message("alert.help.trigger"), message("alert.help.threshold_command")),
            (message("alert.help.bind"), message("alert.help.bind_command")),
            (message("alert.help.recovery"), message("alert.help.recovery_command")),
            (message("alert.help.repeat"), message("alert.help.repeat_command")),
            (message("alert.help.retry"), message("alert.help.retry_command")),
        ),
    ),
    (
        message("alert.help.targets_heading"),
        (
            (message("alert.help.targets_list"), "/yql alert targets list"),
            (message("alert.help.targets_here"), "/yql alert targets addhere @123"),
            (message("alert.help.targets_add"), "/yql alert targets add UMO @123"),
            (
                message("alert.help.targets_remove"),
                message("alert.help.targets_remove_command"),
            ),
            (message("alert.help.admins"), message("alert.help.admins_command")),
            (message("alert.help.llm"), "/yql alert llm on|off"),
        ),
    ),
)


def format_alert_card(spec: CardSpec) -> str:
    """Keep all projected facts for fallback, without parsing human-readable text."""
    lines = [spec.title, spec.subtitle, spec.caption]
    for section in spec.sections:
        lines.append(section.heading)
        lines.extend(
            tr("common.field_separator").join(cell for cell in row.cells if cell)
            for row in section.rows
        )
        lines.extend(section.paragraphs)
    lines.extend((*spec.sources, *spec.limitations))
    return "\n".join(line for line in lines if line)


HELP_TOPICS = ("account", "units", "targets")
_HELP_NOTES = (
    message("alert.help.unit_note"),
    message("alert.help.admin_note"),
)


def _card(**values) -> CardSpec:
    return CardSpec(width=720, layout="compact", **values)


def _help_commands(topic: str):
    if topic == "account":
        return tuple(item for item in HELP_GROUPS[1][1] if " bind " not in item[1])
    if topic == "units":
        return (*HELP_GROUPS[0][1][2:], HELP_GROUPS[1][1][3])
    if topic == "targets":
        return HELP_GROUPS[2][1]
    if topic:
        raise ValueError("unknown help topic")
    return tuple(item for _heading, commands in HELP_GROUPS for item in commands)


def format_alert_help(topic: str = "") -> str:
    """Complete copyable commands, independent of the concise image overview."""
    commands = _help_commands(topic)
    return "\n".join(
        (
            tr("alert.help.title"),
            *(
                tr(
                    "common.label_value",
                    label=render_text(label),
                    value=render_text(command),
                )
                for label, command in commands
            ),
            *map(render_text, _HELP_NOTES),
        )
    )


def build_alert_help_card(topic: str = "") -> CardSpec:
    commands = _help_commands(topic)
    if not topic:
        return _card(
            title=tr("alert.help.title"),
            subtitle=tr("alert.help.prefix"),
            sections=(
                Section(
                    heading=tr("alert.help.common_actions"),
                    rows=(
                        Row((tr("alert.help.view_status"), "status"), role="command"),
                        Row(
                            (
                                tr("alert.help.toggle_short"),
                                tr("alert.help.toggle_quick_command"),
                            ),
                            role="command",
                        ),
                        Row(
                            (
                                tr("alert.help.set_threshold"),
                                tr("alert.help.threshold_quick_command"),
                            ),
                            role="command",
                        ),
                    ),
                ),
                Section(
                    heading=tr("alert.help.more_settings"),
                    rows=(
                        Row(
                            (tr("alert.help.account_rules"), "help account"),
                            role="command",
                        ),
                        Row(
                            (tr("alert.help.unit_confirmation"), "help units"),
                            role="command",
                        ),
                        Row(
                            (tr("alert.help.delivery_permissions"), "help targets"),
                            role="command",
                        ),
                    ),
                ),
            ),
            limitations=(tr("alert.help.private_notice"),),
        )
    titles = {
        "account": tr("alert.help.account_title"),
        "units": tr("alert.help.units_title"),
        "targets": tr("alert.help.targets_title"),
    }
    labels = {
        message("alert.help.toggle"): tr("alert.help.toggle_short"),
        message("alert.help.interval"): tr("alert.help.interval_short"),
        message("alert.help.repeat"): tr("alert.help.repeat_short"),
        message("alert.help.retry"): tr("alert.help.retry_short"),
        message("alert.help.units_read"): tr("alert.help.units_read_short"),
        message("alert.help.units_refresh"): tr("alert.help.units_refresh_short"),
        message("alert.help.targets_here"): tr("alert.help.targets_here_short"),
        message("alert.help.targets_add"): tr("alert.help.targets_add_short"),
        message("alert.help.admins"): tr("alert.help.admins_short"),
    }
    notes = {
        "account": (
            tr("alert.help.interval_note"),
            tr("alert.help.threshold_note"),
        ),
        "units": (
            tr("alert.help.refresh_note"),
            tr("alert.help.confirm_note"),
        ),
        "targets": (
            tr("alert.help.recipients_note"),
            tr("alert.help.manage_note"),
            tr("alert.help.persona_note"),
        ),
    }
    return _card(
        title=titles[topic],
        subtitle=tr("alert.help.prefix"),
        sections=(
            Section(
                rows=tuple(
                    Row(
                        (
                            labels.get(label, render_text(label)),
                            render_text(command).removeprefix("/yql alert "),
                        ),
                        role="command",
                    )
                    for label, command in commands
                ),
            ),
        ),
        limitations=(*notes[topic], tr("alert.help.return")),
    )


def _account_title(account: dict) -> str:
    return _single_line(account.get("display_name") or account["id"])


def _account_icon(account: dict) -> str:
    return (
        "grsai"
        if account.get("service_profile") == "grsai"
        else account.get("type", "")
    )


def _timestamp(value: str | None) -> str:
    if value is None:
        return tr("alert.status.no_record")
    try:
        parsed = datetime.fromisoformat(value)
        if parsed.tzinfo is not None:
            return parsed.astimezone(UTC).strftime("%Y-%m-%d %H:%M:%S UTC")
    except (TypeError, ValueError):
        pass
    return _single_line(value)


_STATUS_LABELS = {
    "disabled": message("status.off"),
    "blocked": message("alert.status.blocked"),
    "waiting": message("alert.status.waiting"),
    "monitoring": message("alert.status.monitoring"),
    "low": message("alert.status.low"),
    "waiting_budget": message("alert.status.waiting_budget"),
    "recovering": message("alert.status.recovering"),
    "recovered": message("alert.status.recovered"),
    "error": message("query.failed"),
    "paused": message("alert.status.paused"),
    "stale": message("alert.status.stale"),
    "submitted": message("alert.status.submitted"),
    "unknown": message("alert.status.unknown"),
    "failed": message("alert.status.failed"),
    "storage_unavailable": message("alert.status.storage_unavailable"),
    "unit_unidentified": message("alert.status.unit_unidentified"),
    "units_ambiguous": message("alert.status.units_ambiguous"),
    "unit_changed": message("alert.status.unit_changed"),
}


def build_alert_status_card(config: dict, status: dict) -> CardSpec:
    accounts = {account["id"]: account for account in config.get("providers", [])}
    rows = status.get("accounts", [])
    sections = [
        Section(
            rows=(
                Row(
                    (
                        "",
                        tr(
                            "alert.status.scheduler",
                            task=tr(
                                "alert.status.running"
                                if status["running"]
                                else "alert.status.stopped"
                            ),
                            storage=tr(
                                "query.available"
                                if status.get("storage_available")
                                else "query.status_unavailable"
                            ),
                        ),
                    ),
                    role="note",
                ),
            ),
        )
    ]
    for row in rows:
        account = accounts.get(row["account_id"], {"id": row["account_id"]})
        # Short states already read well as a single line; do not repeat them.
        label = (
            render_text(_STATUS_LABELS.get(row.get("status"), ""))
            if len(_single_line(row["message"])) > 22
            else None
        )
        details = [Row(("", label or _single_line(row["message"])))]
        if label:
            details.append(Row(("", _single_line(row["message"])), role="note"))
        if row.get("detail"):
            details.append(Row(("", _single_line(row["detail"])), role="error"))
        details.extend(
            (
                Row(
                    (tr("alert.status.account_id"), _single_line(row["account_id"])),
                    role="note",
                ),
                Row(
                    (
                        tr("alert.status.last_checked"),
                        _timestamp(row.get("last_checked_at")),
                    ),
                    role="note",
                ),
                Row(
                    (tr("alert.status.last_sent"), _timestamp(row.get("last_sent_at"))),
                    role="note",
                ),
            )
        )
        sections.append(
            Section(
                heading=_account_title(account),
                icon_key=_account_icon(account),
                rows=tuple(details),
            )
        )
    if not rows:
        sections.append(
            Section(
                heading=tr("alert.status.empty_heading"),
                paragraphs=(tr("alert.status.empty"),),
            )
        )
    return _card(
        title=tr("alert.status.title"),
        subtitle=tr("alert.status.account_count", count=len(rows)),
        sections=tuple(sections),
        limitations=(tr("alert.status.delivery_note"),),
    )


def build_alert_targets_card(
    targets: tuple[tuple[str, str, tuple[str, ...]], ...],
) -> CardSpec:
    return _card(
        title=tr("alert.targets.title"),
        subtitle=tr("alert.targets.count", count=len(targets)),
        sections=tuple(
            Section(
                heading=tr("alert.targets.item", index=index, key=key),
                rows=(
                    Row((tr("alert.targets.umo"), _single_line(umo)), role="note"),
                    Row(
                        (
                            tr("alert.targets.mentions"),
                            " ".join(f"@{qq}" for qq in mentions) or tr("common.none"),
                        ),
                        role="note",
                    ),
                    Row(
                        (
                            tr("alert.targets.remove_command"),
                            f"/yql alert targets remove {key}",
                        ),
                        role="note",
                    ),
                ),
            )
            for index, (key, umo, mentions) in enumerate(targets, 1)
        )
        or (
            Section(
                heading=tr("alert.targets.empty"),
                paragraphs=(tr("alert.targets.add_note"),),
            ),
        ),
        limitations=(tr("alert.targets.save_note"),),
    )


def build_alert_admins_card(admins: tuple[str, ...]) -> CardSpec:
    return _card(
        title=tr("alert.admins.title"),
        subtitle=tr("alert.admins.count", count=len(admins)),
        sections=(
            Section(
                heading=tr("alert.admins.permissions"),
                rows=(
                    Row(
                        (
                            tr("alert.admins.qq_list"),
                            tr("common.list_separator").join(admins)
                            or tr("common.empty"),
                        )
                    ),
                ),
            ),
        ),
        limitations=(
            tr("alert.admins.host_admin_note"),
            tr("alert.admins.separate_permissions"),
        ),
    )


_UNIT_STATES = {
    "unidentified": message("alert.status.unit_unidentified"),
    "verified": message("alert.units.verified"),
    "ambiguous": message("alert.units.ambiguous"),
    "changed": message("alert.status.unit_changed"),
    "stale": message("alert.units.stale"),
}


def build_alert_units_card(
    account: dict, row: dict, *, refreshed: bool = False
) -> CardSpec:
    choices = row.get("choices", [])
    metric = (
        row.get("metric")
        or account.get("balance_alert", {}).get("metric")
        or tr("alert.units.metric_unknown")
    )
    binding_metric = row.get("binding_metric") or tr("alert.units.not_bound")
    metric_rows = (
        (Row((tr("alert.units.current_and_bound"), metric), role="note"),)
        if metric == binding_metric
        else (
            Row((tr("alert.units.current_metric"), metric), role="note"),
            Row((tr("alert.units.bound_metric"), binding_metric), role="note"),
        )
    )
    sections = [
        Section(
            heading=_account_title(account),
            icon_key=_account_icon(account),
            rows=(
                Row(
                    (
                        "",
                        render_text(
                            _UNIT_STATES.get(
                                row.get("unit_state"),
                                tr("alert.status.unit_unidentified"),
                            )
                        ),
                    )
                ),
                Row(
                    (
                        tr("alert.units.current_unit"),
                        row.get("unit") or tr("alert.units.pending_query"),
                    ),
                    role="note",
                ),
                *metric_rows,
                Row(
                    (
                        tr("alert.units.change_reason"),
                        {
                            "metric_changed": tr("alert.units.metric_changed"),
                            "query_identity_changed": tr(
                                "alert.units.identity_changed"
                            ),
                            "unit_changed": tr("alert.units.unit_changed"),
                        }.get(row.get("change_reason"), tr("common.none")),
                    ),
                    role="note",
                ),
                Row(
                    (tr("alert.status.account_id"), _single_line(account["id"])),
                    role="note",
                ),
                Row(
                    (
                        tr("alert.units.last_verified"),
                        _timestamp(row.get("observed_at")),
                    ),
                    role="note",
                ),
                Row(
                    (
                        tr("alert.units.candidate_updated"),
                        _timestamp(row.get("choices_observed_at")),
                    ),
                    role="note",
                ),
            ),
        )
    ]
    for index, choice in enumerate(choices, 1):
        sections.append(
            Section(
                heading=tr("alert.units.candidate", index=index, unit=choice["unit"]),
                rows=(
                    Row((tr("alert.units.metric"), choice["metric"]), role="note"),
                    Row((tr("alert.units.candidate_id"), choice["id"]), role="note"),
                ),
            )
        )
    if not choices:
        sections.append(
            Section(
                heading=tr("alert.units.candidates_expired")
                if row.get("choices_state") == "expired"
                else tr("alert.units.candidates_empty"),
                paragraphs=(
                    tr("alert.units.binding_valid_note")
                    if row.get("choices_state") == "expired"
                    else tr("alert.units.auto_detect_note"),
                    tr("alert.units.refresh_command"),
                ),
            )
        )
    return _card(
        title=tr("alert.units.title"),
        subtitle=tr("alert.units.refreshed")
        if refreshed
        else tr("alert.units.readonly"),
        sections=tuple(sections),
        limitations=(
            tr("alert.units.bind_command"),
            tr("alert.units.threshold_note"),
            tr("alert.units.refreshed_note")
            if refreshed
            else tr("alert.units.readonly_note"),
        ),
    )


def build_alert_receipt_card(message: str) -> CardSpec:
    return _card(
        title=tr("alert.help.title"),
        sections=(
            Section(
                heading=tr("alert.receipt.title"),
                rows=(Row((tr("alert.receipt.result"), message)),),
            ),
        ),
    )
