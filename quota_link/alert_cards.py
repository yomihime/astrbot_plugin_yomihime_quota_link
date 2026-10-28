"""Credential-free alert command projections; no command parsing, IO or retries."""

from datetime import UTC, datetime

from .formatter import _single_line
from .presentation.bitmap import CardSpec, Row, Section

HELP_GROUPS = (
    (
        "帮助与状态",
        (
            ("使用帮助", "/yql alert help"),
            ("预警状态", "/yql alert status"),
            ("单位候选（只读）", '/yql alert units "账户名"'),
            ("刷新单位候选", '/yql alert units "账户名" refresh'),
        ),
    ),
    (
        "账户预警",
        (
            ("启用或关闭", '/yql alert on|off "账户名"'),
            ("检查间隔（分钟）", '/yql alert interval "账户名" 15'),
            ("触发阈值", '/yql alert threshold "账户名" 10 [指标ID]'),
            ("确认单位", '/yql alert bind "账户名" 候选ID'),
            ("恢复阈值", '/yql alert recovery "账户名" 12|auto'),
            ("重复间隔（0 为不重复）", '/yql alert repeat "账户名" 0'),
            ("解除认证暂停", '/yql alert retry "账户名"'),
        ),
    ),
    (
        "目标与管理权限",
        (
            ("查看目标", "/yql alert targets list"),
            ("添加当前会话", "/yql alert targets addhere @123"),
            ("添加指定会话", "/yql alert targets add UMO @123"),
            ("移除目标", "/yql alert targets remove 目标ID"),
            ("预警 QQ 白名单", "/yql alert admins list|add QQ号|remove QQ号"),
            ("智能提示", "/yql alert llm on|off"),
        ),
    ),
)


def format_alert_card(spec: CardSpec) -> str:
    """Keep all projected facts for fallback, without parsing human-readable text."""
    lines = [spec.title, spec.subtitle, spec.caption]
    for section in spec.sections:
        lines.append(section.heading)
        lines.extend(
            "：".join(cell for cell in row.cells if cell) for row in section.rows
        )
        lines.extend(section.paragraphs)
    lines.extend((*spec.sources, *spec.limitations))
    return "\n".join(line for line in lines if line)


def build_alert_help_card() -> CardSpec:
    return CardSpec(
        title="额度预警管理",
        subtitle="本地配置 · 阈值与单位 · 推送目标",
        sections=tuple(
            Section(
                heading=heading,
                rows=tuple(Row(cells, role="note") for cells in commands),
            )
            for heading, commands in HELP_GROUPS
        ),
        limitations=(
            "单位自动识别，阈值按当前单位判定；提示人格跟随目标会话。",
            "管理权限：预警 QQ 白名单或 AstrBot 内置管理员。详细状态和名单请私聊查看。",
        ),
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
        return "暂无记录"
    try:
        parsed = datetime.fromisoformat(value)
        if parsed.tzinfo is not None:
            return parsed.astimezone(UTC).strftime("%Y-%m-%d %H:%M:%S UTC")
    except (TypeError, ValueError):
        pass
    return _single_line(value)


def build_alert_status_card(config: dict, status: dict) -> CardSpec:
    accounts = {account["id"]: account for account in config.get("providers", [])}
    rows = status.get("accounts", [])
    sections = [
        Section(
            heading="运行状态",
            rows=(
                Row(
                    (
                        "额度预警",
                        "检查任务已启动" if status["running"] else "检查任务未运行",
                    )
                ),
                Row(
                    (
                        "状态存储",
                        "可用" if status.get("storage_available") else "不可用",
                    )
                ),
            ),
        )
    ]
    for row in rows:
        account = accounts.get(row["account_id"], {"id": row["account_id"]})
        details = [Row(("当前状态", _single_line(row["message"])))]
        if row.get("detail"):
            details.append(Row(("详情", _single_line(row["detail"])), role="error"))
        details.extend(
            (
                Row(("账户 ID", _single_line(row["account_id"])), role="note"),
                Row(("最近检查", _timestamp(row.get("last_checked_at"))), role="note"),
                Row(("最近提交平台", _timestamp(row.get("last_sent_at"))), role="note"),
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
                heading="暂无账户状态", paragraphs=("当前没有可显示的预警检查记录。",)
            )
        )
    return CardSpec(
        title="额度预警状态",
        subtitle=f"{len(rows)} 个账户 · 本地运行记录",
        sections=tuple(sections),
        limitations=(
            "状态读取本地记录。",
            "提交状态记录平台接收情况；实际送达请查看平台记录。",
        ),
    )


def build_alert_targets_card(
    targets: tuple[tuple[str, str, tuple[str, ...]], ...],
) -> CardSpec:
    return CardSpec(
        title="预警推送目标",
        subtitle=f"{len(targets)} 个目标 · 仅私聊显示",
        sections=tuple(
            Section(
                heading=f"目标 {index} · {key}",
                rows=(
                    Row(("会话 UMO", _single_line(umo))),
                    Row(
                        ("群内提及", " ".join(f"@{qq}" for qq in mentions) or "无"),
                        role="note",
                    ),
                    Row(("移除命令", f"/yql alert targets remove {key}"), role="note"),
                ),
            )
            for index, (key, umo, mentions) in enumerate(targets, 1)
        )
        or (
            Section(
                heading="尚未配置预警目标",
                paragraphs=("使用 targets add 或 targets addhere 添加已确认的目标。",),
            ),
        ),
        limitations=("管理员确认收件人和群成员后配置；保存仅更新本地目标。",),
    )


def build_alert_admins_card(admins: tuple[str, ...]) -> CardSpec:
    return CardSpec(
        title="预警 QQ 管理白名单",
        subtitle=f"{len(admins)} 位 QQ 用户 · 仅私聊显示",
        sections=(
            Section(
                heading="管理权限",
                rows=(Row(("QQ 白名单", "、".join(admins) or "空")),),
            ),
        ),
        limitations=(
            "AstrBot 内置管理员也可管理。",
            "预警管理权限不等于额度查询权限或推送收件权限。",
        ),
    )


_UNIT_STATES = {
    "unidentified": "等待识别单位",
    "verified": "单位已验证",
    "ambiguous": "多个单位待确认",
    "changed": "需要重新确认",
    "stale": "单位验证已过期",
}


def build_alert_units_card(
    account: dict, row: dict, *, refreshed: bool = False
) -> CardSpec:
    choices = row.get("choices", [])
    sections = [
        Section(
            heading=_account_title(account),
            icon_key=_account_icon(account),
            rows=(
                Row(("单位", row.get("unit") or "待获取")),
                Row(
                    (
                        "单位状态",
                        _UNIT_STATES.get(row.get("unit_state"), "等待识别单位"),
                    )
                ),
                Row(
                    (
                        "当前指标",
                        row.get("metric")
                        or account.get("balance_alert", {}).get("metric")
                        or "待识别",
                    ),
                    role="note",
                ),
                Row(
                    ("已绑定指标", row.get("binding_metric") or "尚未绑定"), role="note"
                ),
                Row(
                    (
                        "变更原因",
                        {
                            "metric_changed": "指标已变化，请重新确认",
                            "query_identity_changed": "查询身份已变化，请重新确认",
                            "unit_changed": "单位已变化，请重新确认",
                        }.get(row.get("change_reason"), "无"),
                    ),
                    role="note",
                ),
                Row(("账户 ID", _single_line(account["id"])), role="note"),
                Row(("最近验证", _timestamp(row.get("observed_at"))), role="note"),
                Row(
                    ("候选更新时间", _timestamp(row.get("choices_observed_at"))),
                    role="note",
                ),
            ),
        )
    ]
    for index, choice in enumerate(choices, 1):
        sections.append(
            Section(
                heading=f"候选 {index} · {choice['unit']}",
                rows=(
                    Row(("指标", choice["metric"])),
                    Row(("候选 ID", choice["id"]), role="note"),
                ),
            )
        )
    if not choices:
        sections.append(
            Section(
                heading="候选已过期"
                if row.get("choices_state") == "expired"
                else "暂无可确认候选",
                paragraphs=(
                    "已有有效绑定不会因候选过期而失效。"
                    if row.get("choices_state") == "expired"
                    else "查询余额后自动识别。",
                    '使用 /yql alert units "账户名" refresh 显式刷新候选。',
                ),
            )
        )
    return CardSpec(
        title="预警单位与候选",
        subtitle="已请求刷新 · 最新本地状态"
        if refreshed
        else "已有查询结果 · 只读状态",
        sections=tuple(sections),
        limitations=(
            '确认命令：/yql alert bind "账户名" 候选ID',
            "确认前核对阈值含义；确认后保留阈值原值。",
            "本次按请求刷新账户余额。"
            if refreshed
            else "列表读取现有查询结果；候选过期时可显式刷新。",
        ),
    )


def build_alert_receipt_card(message: str) -> CardSpec:
    return CardSpec(
        title="额度预警管理",
        sections=(Section(heading="操作完成", rows=(Row(("处理结果", message)),)),),
    )
