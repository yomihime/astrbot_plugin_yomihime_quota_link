"""Command-only cards from normalized facts; no provider IO or HTML renderer."""

from datetime import UTC, datetime
from pathlib import Path

from .formatter import _KIND_LABELS, _single_line, display_semantics, display_target
from .models import (
    BalanceItem,
    ProviderType,
    QueryRequestKind,
    QueryResult,
    SnapshotStatus,
)
from .presentation.bitmap import CardSpec, Row, Section, render_card
from .presentation.font import CardFontProvider

_STATUS = {
    SnapshotStatus.AVAILABLE: "可用",
    SnapshotStatus.PARTIAL: "部分可用",
    SnapshotStatus.UNAVAILABLE: "不可用",
    SnapshotStatus.UNKNOWN: "状态未知",
}


def _time(value: datetime) -> str:
    return value.astimezone(UTC).strftime("%Y-%m-%d %H:%M:%S UTC")


def _item_rows(
    item: BalanceItem, provider_type: ProviderType, *, identify_notes: bool = False
) -> tuple[Row, ...]:
    label = _single_line(item.label) or _KIND_LABELS[item.kind]
    unit = _single_line(item.unit) or "未知单位"
    rows = []
    for key, suffix in (
        ("amount", ""),
        ("total", "总量"),
        ("remaining", "剩余"),
        ("used", "已用"),
    ):
        value = getattr(item, key)
        if value is not None:
            heading = f"{label} · {suffix}" if suffix else label
            rows.append(Row((heading, f"{value} {unit}")))
    if not rows:
        rows.append(Row((label, f"数值未知（单位：{unit}）")))
    if item.expires_at is not None:
        rows.append(
            Row(
                (f"{label}到期" if identify_notes else "到期", _time(item.expires_at)),
                role="note",
            )
        )
    semantics = display_semantics(item, provider_type)
    if semantics:
        rows.append(
            Row((f"{label}说明" if identify_notes else "", semantics), role="note")
        )
    return tuple(rows)


def build_result_card(result: QueryResult) -> CardSpec:
    """Project every visible fact into YGL-style stat and property panels."""
    if result.request.kind is QueryRequestKind.ACCOUNT:
        title = "账户额度与用量"
    elif result.request.kind is QueryRequestKind.PROVIDER:
        title = "供应商额度与用量"
    else:
        title = "额度与用量"
    sections = []
    for snapshot in result.snapshots:
        state = _STATUS[snapshot.status]
        cache_mark = " · 缓存数据" if snapshot.cached else ""
        rows = tuple(
            row
            for item in snapshot.balances
            for row in _item_rows(
                item, snapshot.provider_type, identify_notes=len(snapshot.balances) > 1
            )
        )
        if not rows and snapshot.error is None:
            rows = (Row(("", "没有可显示的余额或用量项目"), role="note"),)
        if snapshot.error is not None:
            rows += (
                Row(
                    ("查询失败", _single_line(snapshot.error.safe_message)),
                    role="error",
                ),
            )
        sections.append(
            Section(
                heading=f"{_single_line(snapshot.display_name)} · {state}{cache_mark}",
                paragraphs=(
                    f"来源：{_single_line(snapshot.source)} · 获取：{_time(snapshot.fetched_at)}",
                ),
                rows=rows,
            )
        )
    if not sections:
        message = (
            "当前没有配置可查询的账户。"
            if result.request.kind is QueryRequestKind.ALL
            else "没有可显示的查询结果。"
        )
        sections.append(Section(heading="暂无结果", paragraphs=(message,)))
    successes = sum(
        s.status is SnapshotStatus.AVAILABLE and s.error is None
        for s in result.snapshots
    )
    partial = sum(
        s.status is SnapshotStatus.PARTIAL or (s.error is not None and bool(s.balances))
        for s in result.snapshots
    )
    failures = len(result.snapshots) - successes - partial
    summary = [f"{len(result.snapshots)} 个账户"]
    for count, label in (
        (successes, "查询成功"),
        (partial, "部分成功"),
        (failures, "查询失败"),
    ):
        if count:
            summary.append(f"{count} 个{label}")
    target = f"目标：{display_target(result)}\n" if result.request.target else ""
    return CardSpec(
        title=title,
        subtitle=target + " · ".join(summary),
        caption=f"查询：{_time(result.queried_at)}",
        sections=tuple(sections),
    )


def render_result_card(
    result: QueryResult, font_path: Path | None = None
) -> bytes | None:
    """Return a complete offline PNG or None so the caller keeps full text.

    No sensitive exception details or raw provider data leave this boundary.
    The bounded renderer refuses oversized content and missing glyphs instead
    of silently cropping, replacing characters, or dropping account facts.
    """
    try:
        return render_card(
            build_result_card(result), font_provider=CardFontProvider(font_path)
        ).content
    except Exception:
        return None
