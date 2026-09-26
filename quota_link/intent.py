"""Pure command, natural language, and permission rules for quota queries."""

from __future__ import annotations

import re
from dataclasses import dataclass

from .models import (
    QueryParseError,
    QueryParseErrorCode,
    QueryParseResult,
    QueryRequest,
    QueryRequestKind,
)
from .settings import AccountDirectory, PluginSettings, normalize_name


@dataclass(frozen=True, slots=True)
class PermissionContext:
    """Small platform-independent set of identity and chat properties."""

    is_private: bool
    is_admin: bool
    user_id: str
    group_id: str | None
    platform_name: str = ""


_COMMANDS = {
    "all": QueryRequestKind.ALL,
    "全部": QueryRequestKind.ALL,
    "help": QueryRequestKind.HELP,
    "帮助": QueryRequestKind.HELP,
    "status": QueryRequestKind.STATUS,
    "状态": QueryRequestKind.STATUS,
}
_BALANCE_INTENT = re.compile(r"余额|额度|积分|quota|balance|credits?", re.IGNORECASE)
_REMAINING_CUE = re.compile(r"剩多少|还剩|剩余", re.IGNORECASE)
_TARGET_CAPTURE_PATTERNS = (
    re.compile(
        r"(?:查询|查|看看|查看)\s*[「『\"']?([^，。！？?!\s「」『』\"']+)[」』\"']?"
    ),
    re.compile(r"([^，。！？?!\s]+?)\s*(?:的)?\s*(?:余额|额度|积分|配额)"),
    re.compile(r"([^，。！？?!\s]+?)\s+(?:还剩|剩余)"),
)
_TARGET_PREFIXES = ("当前", "现在", "所有", "全部", "所有账户", "全部账户")
_TARGET_SUFFIXES = ("的", "账户", "账号", "余额", "额度", "积分", "配额")


def parse_command(
    argument: str | None, directory: AccountDirectory
) -> QueryParseResult:
    """Parse a ``/yql`` argument without requiring any configured accounts."""
    text = (argument or "").strip()
    if not text:
        return QueryParseResult(request=QueryRequest(QueryRequestKind.ALL))

    parts = text.split(maxsplit=1)
    command = normalize_name(parts[0]).lstrip("/")
    if command in _COMMANDS:
        if len(parts) > 1:
            return _invalid("该命令不接受目标参数")
        return QueryParseResult(request=QueryRequest(_COMMANDS[command]))

    # Explicit target kinds avoid provider/account ambiguity. Plain targets
    # use AccountDirectory's account-first resolution rule.
    match = re.match(r"^(provider|account)\s+(.+)$", text, re.IGNORECASE)
    if match:
        target_kind, target_name = match.group(1).casefold(), match.group(2).strip()
        if target_kind == "provider":
            provider = directory.provider_aliases.get(normalize_name(target_name))
            if provider is None:
                return _unknown_target()
            return QueryParseResult(
                request=QueryRequest(QueryRequestKind.PROVIDER, provider.value)
            )
        resolved = directory.resolve_target(target_name)
        if resolved.request is None:
            return resolved
        return (
            resolved
            if resolved.request.kind is QueryRequestKind.ACCOUNT
            else _unknown_target()
        )
    return directory.resolve_target(text)


def parse_natural_language(
    text: str, directory: AccountDirectory
) -> QueryParseResult | None:
    """Recognize balance questions and leave unrelated conversation alone."""
    if not isinstance(text, str) or not text.strip():
        return None

    matches = _find_known_targets(text, directory)
    if not _BALANCE_INTENT.search(text) and not (
        matches and _REMAINING_CUE.search(text)
    ):
        return None
    if len(matches) > 1:
        candidates = tuple(dict.fromkeys(target for _, target, _ in matches))
        return QueryParseResult(
            error=QueryParseError(
                QueryParseErrorCode.AMBIGUOUS,
                "检测到多个账户或供应商，请指定一个目标",
                candidates,
            )
        )
    if matches:
        _, target, kind = matches[0]
        return QueryParseResult(request=QueryRequest(kind, target))

    explicit_target = _extract_explicit_target(text)
    if explicit_target and _BALANCE_INTENT.search(text):
        return directory.resolve_target(explicit_target)

    # Unscoped balance questions refer to all configured accounts. The same
    # result is useful when the directory is empty: status is resolved later.
    return QueryParseResult(request=QueryRequest(QueryRequestKind.ALL))


def can_query(
    context: PermissionContext, settings: PluginSettings, *, is_command: bool = False
) -> bool:
    """Enforce query access before any account details are disclosed."""
    if is_command and settings.command_admin_only and not context.is_admin:
        return False
    if context.is_private:
        return context.is_admin or (
            bool(context.platform_name)
            and f"{context.platform_name}:{context.user_id}"
            in settings.private_allowed_user_ids
        )
    if not settings.allow_group_queries:
        return False
    return context.is_admin or context.user_id in settings.group_allowed_user_ids


def _invalid(message: str) -> QueryParseResult:
    return QueryParseResult(
        error=QueryParseError(QueryParseErrorCode.INVALID_INPUT, message)
    )


def _unknown_target() -> QueryParseResult:
    return QueryParseResult(
        error=QueryParseError(
            QueryParseErrorCode.UNKNOWN_TARGET, "未找到匹配的账户或供应商"
        )
    )


def _find_known_targets(
    text: str, directory: AccountDirectory
) -> list[tuple[int, str, QueryRequestKind]]:
    """Find configured account/provider names, preferring account name hits."""
    account_hits: list[tuple[int, int, str]] = []
    for entry in directory.entries:
        if not entry.enabled:
            continue
        for name in (entry.id, entry.display_name, *entry.aliases):
            for start, end in _name_spans(text, name):
                account_hits.append((start, end, entry.id))

    # Collapse repeated mentions of the same account, and let its full name
    # own any provider name nested inside it.
    account_hits.sort(key=lambda item: (item[0], -(item[1] - item[0])))
    unique_accounts: list[tuple[int, int, str]] = []
    seen_accounts: set[str] = set()
    for hit in account_hits:
        if hit[2] not in seen_accounts:
            unique_accounts.append(hit)
            seen_accounts.add(hit[2])

    hits = [
        (start, account_id, QueryRequestKind.ACCOUNT)
        for start, _, account_id in unique_accounts
    ]
    for alias, provider in directory.provider_aliases.items():
        for start, end in _name_spans(text, alias):
            if any(
                left <= start and end <= right for left, right, _ in unique_accounts
            ):
                continue
            hits.append((start, provider.value, QueryRequestKind.PROVIDER))

    # Unique by canonical result target; preserve its first occurrence.
    result: list[tuple[int, str, QueryRequestKind]] = []
    seen_targets: set[tuple[QueryRequestKind, str]] = set()
    for hit in sorted(hits):
        key = (hit[2], normalize_name(hit[1]))
        if key not in seen_targets:
            result.append(hit)
            seen_targets.add(key)
    return result


def _name_spans(text: str, name: str) -> list[tuple[int, int]]:
    escaped = re.escape(name.strip())
    if not escaped:
        return []
    # For Latin/digit names, avoid matching a substring in a larger token.
    if re.fullmatch(r"[A-Za-z0-9_ -]+", name):
        pattern = re.compile(rf"(?<![\w-]){escaped}(?![\w-])", re.IGNORECASE)
    else:
        pattern = re.compile(escaped, re.IGNORECASE)
    return [(match.start(), match.end()) for match in pattern.finditer(text)]


def _extract_explicit_target(text: str) -> str | None:
    if re.match(r"^\s*(?:余额|额度|积分|剩余|还剩)", text):
        return None
    for pattern in _TARGET_CAPTURE_PATTERNS:
        match = pattern.search(text)
        if not match:
            continue
        target = match.group(1).strip(" 的账户账号余额额度积分配额，。！？?!\t\n")
        for prefix in _TARGET_PREFIXES:
            if target.startswith(prefix):
                target = target[len(prefix) :].strip()
        for suffix in _TARGET_SUFFIXES:
            if target.endswith(suffix):
                target = target[: -len(suffix)].strip()
        if target and target not in {"当前模型", "模型", "当前", "所有", "全部"}:
            return target
    return None
