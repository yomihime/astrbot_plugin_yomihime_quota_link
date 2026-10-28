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
from .presentation.provider_logos import load_logo
from .settings import AccountDirectory, AccountDirectoryEntry, PluginSettings


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
        rows.append(
            Row(
                (
                    label,
                    f"未提供（单位：{unit}）"
                    if provider_type is ProviderType.ALIBABA_BAILIAN
                    else f"数值未知（单位：{unit}）",
                )
            )
        )
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


def _account_icon_key(entry: AccountDirectoryEntry) -> str:
    return "grsai" if entry.service_profile == "grsai" else entry.provider_type.value


def build_result_card(
    result: QueryResult, directory: AccountDirectory | None = None
) -> CardSpec:
    """Project every visible fact into YGL-style stat and property panels."""
    if result.request.kind is QueryRequestKind.ACCOUNT:
        title = "账户额度与用量"
    elif result.request.kind is QueryRequestKind.PROVIDER:
        title = "供应商额度与用量"
    else:
        title = "额度与用量"
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
                icon_key=icons.get(
                    (snapshot.account_id, snapshot.provider_type),
                    snapshot.provider_type.value,
                ),
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
        title="YQL 使用帮助",
        width=720,
        layout="compact",
        subtitle="查询额度 · 查看本地配置",
        sections=(
            Section(
                heading="查询额度",
                rows=(
                    Row(("全部账户", "/yql  或  /yql all"), role="command"),
                    Row(("指定账户", "/yql account <名称>"), role="command"),
                    Row(("指定供应商", "/yql provider <名称>"), role="command"),
                ),
                paragraphs=("也可使用 /yql <名称>；名称支持显示名、别名与供应商名。",),
            ),
            Section(
                heading="帮助与状态",
                rows=(
                    Row(("使用帮助", "/yql help"), role="command"),
                    Row(("本地配置", "/yql status"), role="command"),
                    Row(("额度预警", "/yql alert help"), role="command"),
                ),
                paragraphs=("help 和 status 读取本地信息。",),
            ),
            Section(
                heading=f"已启用账户 · {len(names)} 个",
                rows=tuple(Row(("", name), role="note") for name in names),
                paragraphs=()
                if names
                else ("尚未配置启用的账户。请先在管理页添加账户。",),
            ),
        ),
        limitations=(
            "启用函数工具后，可用自然语言查询额度。",
            "供应商接口与凭据请在管理页配置。",
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
            heading="访问与凭据",
            rows=(
                Row(("凭据存储", storage_summary(storage)), role="note"),
                Row(
                    (
                        "群聊查询",
                        "已开启" if settings.allow_group_queries else "已关闭",
                    ),
                    role="note",
                ),
                Row(
                    (
                        "命令权限",
                        "仅管理员" if settings.command_admin_only else "按会话授权",
                    ),
                    role="note",
                ),
            ),
        )
    ]
    for index, entry in enumerate(accounts):
        state = local_account_state(entry)
        if entry.enabled and not entry.queryable:
            reason = state.removeprefix("不可查询：")
            if reason.startswith("配置不全："):
                state = "待补齐：" + reason.removeprefix("配置不全：")
            elif entry.unavailable_reason in {
                "missing_environment_variable",
                "missing_credentials",
                "missing_grsai_token",
            }:
                state = "待配置：" + reason
            else:
                state = "待检查：" + reason
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
                    Row(("凭据保存", credential_label(storage, index)), role="note"),
                ),
                paragraphs=(f"供应商：{display_provider(entry)}",),
            )
        )
    if not accounts:
        sections.append(
            Section(
                heading="尚未配置账户",
                rows=(Row(("下一步", "在管理页添加账户与凭据")),),
                paragraphs=(
                    "保存后发送 /yql status 查看本地配置，再用 /yql 查询额度。",
                ),
            )
        )
    if settings.errors:
        sections.append(
            Section(
                heading=f"配置问题 · {len(settings.errors)} 项",
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
        title="本地配置状态",
        width=720,
        layout="compact",
        subtitle=f"{len(accounts)} 个账户 · {enabled} 个启用 · {ready} 个配置完整",
        caption="依据本地账户目录与凭据保存记录",
        sections=tuple(sections),
        limitations=("连通性和余额可通过 /yql 查询。",),
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
