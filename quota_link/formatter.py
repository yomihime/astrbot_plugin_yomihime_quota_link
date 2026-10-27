"""Chinese text presentation for provider-independent query results."""

from datetime import UTC, datetime
from decimal import Decimal
from unicodedata import category

from .capabilities import _PROVIDER_NAMES
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
    "missing_endpoint": "配置不全：请按服务商文档补齐服务地址与接口路径",
    "missing_base_url": "配置不全：请填写 HTTPS 服务根地址",
    "missing_api_path": "配置不全：请填写以 / 开头的接口路径",
    "invalid_endpoint": "服务地址或接口路径配置无效；服务地址填 HTTPS 服务根地址，接口路径以 / 开头",
    "invalid_base_url": "服务地址配置无效；请填写不含路径、参数或凭据的 HTTPS 服务根地址",
    "invalid_api_path": "接口路径配置无效；请填写以 / 开头且不含参数的相对路径",
    "invalid_response_mapping": "配置不全：请在高级设置中按服务商响应文档填写余额映射",
}


def _amount(value: Decimal | None, unit: str) -> str:
    if value is None:
        return "未知"
    return f"{value} {unit}"


def _single_line(value: str) -> str:
    """Normalize free text so control characters cannot forge reply structure."""
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
        return "账户站内额度以 site_credit 计量。"
    return _single_line(item.raw_semantics or "")


def display_target(result: QueryResult) -> str:
    """Label only the selected target; retain canonical IDs in query/tool facts."""
    target = result.request.target or ""
    if result.request.kind is QueryRequestKind.PROVIDER:
        try:
            return _PROVIDER_NAMES[ProviderType(target)]
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
        values.append(f"到期 {_display_time(item.expires_at)}")
    semantics = display_semantics(item, provider_type)
    if semantics:
        values.append(f"语义说明 {semantics}")
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
    lines = [f"{_single_line(snapshot.display_name)}：{status}{cache_mark}"]
    lines.extend(
        f"  {_item_text(item, snapshot.provider_type)}" for item in snapshot.balances
    )
    if not snapshot.balances and snapshot.error is None:
        lines.append("  没有可显示的余额或用量项目")
    if snapshot.error is not None:
        lines.append(f"  查询失败：{_single_line(snapshot.error.safe_message)}")
    lines.append(
        f"  获取时间：{_display_time(snapshot.fetched_at)}"
        f" · 来源：{_single_line(snapshot.source)}"
    )
    return lines


def format_result(result: QueryResult) -> str:
    """Render an aggregate result without interpreting provider-specific fields."""
    request = result.request
    lines = [f"查询时间：{_display_time(result.queried_at)}"]
    if not result.snapshots:
        if request.kind is QueryRequestKind.ALL:
            lines.append("当前没有配置可查询的账户。")
        else:
            lines.append("没有可显示的查询结果。")
        return "\n".join(lines)

    if request.kind is QueryRequestKind.ACCOUNT:
        title = f"账户查询：{display_target(result)}"
    elif request.kind is QueryRequestKind.PROVIDER:
        title = f"供应商查询：{display_target(result)}"
    else:
        title = "额度与用量查询"

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
    summary = "，".join(
        f"{label} {count}"
        for label, count in (
            ("成功", successes),
            ("部分成功", partial),
            ("失败", failures),
        )
        if count
    )
    lines.extend(("", f"查询汇总：{summary}。"))
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
        "在启用函数工具的 AI 对话中，也可用自然语言让模型调用 yql_query_balance。\n"
        "OpenAI 兼容服务的余额查询使用服务商专属接口；请按余额文档填写服务地址、接口路径和高级认证/响应映射。配置完整后即可查询。\n"
        "阿里云百炼模板查询阿里云账户现金余额（BSS）；RAM 身份至少需要 AliyunBSSReadOnlyAccess。"
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
                state = "已配置，可查询"
            else:
                reason = _UNAVAILABLE_REASONS.get(
                    entry.unavailable_reason or "", "配置不全或暂不可查询"
                )
                state = f"不可查询：{reason}"
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
