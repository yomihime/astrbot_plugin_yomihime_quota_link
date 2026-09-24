"""Chinese text presentation for provider-independent query results."""

from decimal import Decimal
from unicodedata import category

from .models import (
    BalanceItem,
    BalanceItemKind,
    BalanceSnapshot,
    QueryParseError,
    QueryParseErrorCode,
    QueryRequestKind,
    QueryResult,
    SnapshotStatus,
)
from .settings import PluginSettings

_KIND_LABELS = {
    BalanceItemKind.CASH: "现金余额",
    BalanceItemKind.QUOTA: "额度",
    BalanceItemKind.FREE_QUOTA: "免费额度",
    BalanceItemKind.SUBSCRIPTION: "套餐",
    BalanceItemKind.CREDITS: "积分",
    BalanceItemKind.USAGE: "用量",
    BalanceItemKind.CUSTOM: "自定义项目",
}

_UNAVAILABLE_REASONS = {
    "missing_environment_variable": "凭据环境变量未设置",
    "missing_credentials": "缺少可用凭据",
    "missing_endpoint": "缺少余额查询端点",
}


def _amount(value: Decimal | None, unit: str) -> str:
    if value is None:
        return "未知"
    return f"{value} {unit}"


def _single_line(value: str) -> str:
    """Normalize free text so control characters cannot forge reply structure."""
    cleaned = "".join(" " if category(char) in {"Cc", "Cf"} else char for char in value)
    return " ".join(cleaned.split())


def _item_text(item: BalanceItem) -> str:
    label = _single_line(item.label) or _KIND_LABELS[item.kind]
    unit = _single_line(item.unit) or "未知单位"
    values: list[str] = []
    if item.amount is not None:
        values.append(_amount(item.amount, unit))
    if item.total is not None:
        values.append(f"总量 {_amount(item.total, unit)}")
    if item.remaining is not None:
        values.append(f"剩余 {_amount(item.remaining, unit)}")
    if item.used is not None:
        values.append(f"已用 {_amount(item.used, unit)}")
    if not values:
        values.append(f"数值未知（单位：{unit}）")
    if item.expires_at is not None:
        values.append(f"到期 {item.expires_at.isoformat()}")
    if item.raw_semantics:
        values.append(f"语义说明 {_single_line(item.raw_semantics)}")
    return f"{label}：" + "；".join(values)


def _snapshot_text(snapshot: BalanceSnapshot) -> list[str]:
    if snapshot.status is SnapshotStatus.AVAILABLE:
        status = "可用"
    elif snapshot.status is SnapshotStatus.PARTIAL:
        status = "部分可用"
    elif snapshot.status is SnapshotStatus.UNAVAILABLE:
        status = "不可用"
    else:
        status = "状态未知"

    cache_mark = "（缓存）" if snapshot.cached else ""
    lines = [
        f"{_single_line(snapshot.display_name)}：{status}{cache_mark}",
        f"  获取时间：{snapshot.fetched_at.isoformat()}",
        f"  来源：{_single_line(snapshot.source)}",
    ]
    lines.extend(f"  {_item_text(item)}" for item in snapshot.balances)
    if not snapshot.balances and snapshot.error is None:
        lines.append("  没有可显示的余额或用量项目")
    if snapshot.error is not None:
        lines.append(f"  查询失败：{_single_line(snapshot.error.safe_message)}")
    return lines


def format_result(result: QueryResult) -> str:
    """Render an aggregate result without interpreting provider-specific fields."""
    request = result.request
    lines = [f"查询时间：{result.queried_at.isoformat()}"]
    if not result.snapshots:
        if request.kind is QueryRequestKind.ALL:
            lines.append("当前没有配置可查询的账户。")
        else:
            lines.append("没有可显示的查询结果。")
        return "\n".join(lines)

    if request.kind is QueryRequestKind.ACCOUNT:
        title = f"账户查询：{_single_line(request.target or '')}"
    elif request.kind is QueryRequestKind.PROVIDER:
        title = f"供应商查询：{_single_line(request.target or '')}"
    else:
        title = "额度与用量查询"

    lines.insert(0, title)
    lines.extend(
        line for snapshot in result.snapshots for line in _snapshot_text(snapshot)
    )
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
    if partial or (successes and failures):
        lines.append(
            f"查询汇总：成功 {successes}，部分成功 {partial}，失败 {failures}。"
        )
    elif failures == len(result.snapshots):
        lines.append("所有账户查询均失败。")
    return "\n".join(lines)


def format_help(settings: PluginSettings) -> str:
    """Render local command help using the credential-free account directory."""
    lines = [
        "如月怜的额度连结\n"
        "用法：\n"
        "  /yql                 查询所有账户\n"
        "  /yql help            查看帮助\n"
        "  /yql status          查看本地配置状态\n"
        "  /yql all             查询所有账户\n"
        "  /yql <名称>          查询指定账户或供应商\n"
        "也可发送“余额还剩多少”等自然语言进行查询。"
    ]
    entries = [entry for entry in settings.directory.entries if entry.enabled]
    if entries:
        names = "、".join(_single_line(entry.display_name) for entry in entries)
        lines.append(f"已配置账户：{names}")
    else:
        lines.append("当前没有配置账户。")
    return "\n".join(lines)


def format_status(settings: PluginSettings) -> str:
    """Render local settings state; this function performs no network access."""
    accounts = settings.directory.entries
    enabled = [entry for entry in accounts if entry.enabled]
    queryable = [entry for entry in enabled if entry.queryable]
    lines = [
        "如月怜的额度连结状态",
        f"账户：共 {len(accounts)} 个，启用 {len(enabled)} 个，可查询 {len(queryable)} 个",
        f"群聊查询：{'已开启' if settings.allow_group_queries else '已关闭'}",
    ]
    if not accounts:
        lines.append("尚未配置账户。")
    else:
        lines.append("账户列表：")
        for entry in accounts:
            if not entry.enabled:
                state = "已禁用"
            elif entry.queryable:
                state = "已配置，查询适配器可能尚未实现"
            else:
                state = _UNAVAILABLE_REASONS.get(
                    entry.unavailable_reason or "", "暂不可查询"
                )
            lines.append(f"  {_single_line(entry.display_name)}：{state}")
    if settings.errors:
        lines.append(f"配置问题：{len(settings.errors)} 项")
        lines.extend(
            f"  {_single_line(diagnostic.safe_message)}"
            for diagnostic in settings.errors
        )
    return "\n".join(lines)


def format_parse_error(error: QueryParseError) -> str:
    """Render a safe parse error and, when present, its safe candidate names."""
    if error.code is QueryParseErrorCode.AMBIGUOUS and error.candidates:
        candidates = "、".join(
            _single_line(candidate) for candidate in error.candidates
        )
        return f"{_single_line(error.safe_message)}\n匹配项：{candidates}"
    return _single_line(error.safe_message)
