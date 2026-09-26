"""AstrBot boundary and lifecycle assembly for Yomihime Quota Link."""

from __future__ import annotations

import re
from collections.abc import Mapping, MutableMapping
from typing import Any

from astrbot.api.event import AstrMessageEvent, filter
from astrbot.api.star import Star, register

from .quota_link.cache import BalanceCache
from .quota_link.formatter import (
    format_help,
    format_parse_error,
    format_result,
    format_status,
)
from .quota_link.http_client import HttpProviderClient
from .quota_link.intent import (
    PermissionContext,
    can_query,
    parse_command,
)
from .quota_link.providers import IMPLEMENTED_ADAPTERS
from .quota_link.service import QueryService
from .quota_link.settings import (
    PluginSettings,
    load_settings,
    migrate_account_templates,
)
from .quota_link.tool_facts import (
    encode_tool_result,
    serialize_capabilities,
    serialize_parse_error,
    serialize_query_result,
)

_COMMAND_START = re.compile(r"^\s*(?:/\s*)?yql\b\s*(.*)$", re.IGNORECASE | re.DOTALL)


@register(
    "astrbot_plugin_yomihime_quota_link",
    "yomihime",
    "如月怜的额度连结：多平台 AI API 余额 / 用量监控。",
    "0.1.1",
)
class YomihimeQuotaLink(Star):
    """Monitor balances and usage across AI API providers."""

    def __init__(self, context: Any, config: Mapping[str, Any] | None = None) -> None:
        super().__init__(context, config)
        self.config = config or {}
        save_config = getattr(self.config, "save_config", None)
        if isinstance(self.config, MutableMapping) and callable(save_config):
            if migrate_account_templates(self.config):
                save_config()
        self.settings: PluginSettings
        self.cache: BalanceCache
        self.service: QueryService
        self._build_runtime()

    def _build_runtime(self) -> None:
        """Create per-plugin settings, cache, and query service from config."""
        self.settings = load_settings(self.config)
        self.cache = BalanceCache()
        self.http_client = HttpProviderClient(timeout=self.settings.timeout_seconds)
        self.service = QueryService(
            self.settings, IMPLEMENTED_ADAPTERS, self.http_client, self.cache
        )

    async def initialize(self) -> None:
        await self._close_runtime()
        self._build_runtime()

    async def terminate(self) -> None:
        await self._close_runtime()

    async def _close_runtime(self) -> None:
        await self.service.close()
        await self.http_client.close()

    @filter.command("yql")
    async def quota_link(self, event: AstrMessageEvent):
        """Run one full-argument /yql request."""
        context = self._permission_context(event)
        if not can_query(context, self.settings, is_command=True):
            yield event.plain_result("当前会话无权查询额度信息。")
            return

        message = event.get_message_str()
        match = _COMMAND_START.match(message)
        argument = match.group(1) if match else ""
        parsed = parse_command(argument, self.settings.directory)
        yield event.plain_result(await self._render(parsed))

    @filter.llm_tool(name="yql_query_balance")
    async def query_balance_tool(
        self,
        event: AstrMessageEvent,
        operation: str = "query",
        target: str = "all",
    ) -> str:
        """查询余额事实，或列出本地已配置的可查询账户。

        用户询问余额时使用 query；询问当前能查哪些账户或余额时使用 list。
        list 只读取本地账户目录，不访问供应商。query 的目标可填账户 ID、显示名、
        别名、供应商名或 all；最终用户回复由 LLM 根据返回的 JSON 事实组织。

        Args:
            operation(string): 操作类型，query 查询余额，list 列出可查询账户。
            target(string): query 操作的账户或供应商名称；查询全部时填 all，list 忽略此项。
        """
        context = self._permission_context(event)
        if not can_query(context, self.settings):
            safe_operation = (
                operation
                if isinstance(operation, str) and operation in {"query", "list"}
                else "query"
            )
            return encode_tool_result(
                {
                    "schema_version": 1,
                    "operation": safe_operation,
                    "error": {
                        "category": "permission",
                        "message": "当前会话无权查询额度信息。",
                    },
                }
            )

        if not isinstance(operation, str) or operation not in {"query", "list"}:
            return encode_tool_result(
                {
                    "schema_version": 1,
                    "operation": "query",
                    "error": {
                        "category": "invalid_operation",
                        "message": "操作类型必须为 query 或 list。",
                    },
                }
            )

        if operation == "list":
            from .quota_link.capabilities import describe_capabilities

            accounts = describe_capabilities(self.settings.directory)
            return serialize_capabilities(accounts)
        if not isinstance(target, str):
            return encode_tool_result(
                {
                    "schema_version": 1,
                    "operation": "query",
                    "error": {
                        "category": "invalid_target",
                        "message": "查询目标必须是账户、供应商名称或 all。",
                    },
                }
            )

        parsed = parse_command(target, self.settings.directory)
        if parsed.error is not None:
            return serialize_parse_error("query", parsed)
        if parsed.request is None or parsed.request.kind.value not in {
            "all",
            "account",
            "provider",
        }:
            return encode_tool_result(
                {
                    "schema_version": 1,
                    "operation": "query",
                    "error": {
                        "category": "invalid_target",
                        "message": "查询目标必须是账户、供应商名称或 all。",
                    },
                }
            )

        from .quota_link.capabilities import describe_capabilities

        accounts = describe_capabilities(self.settings.directory)
        balance_metadata = {
            str(account["id"]): {
                "balance_scope": str(account["balance_scope"]),
                "balance_kind": str(account["balance_kind"]),
            }
            for account in accounts
            if "id" in account
            and "balance_scope" in account
            and "balance_kind" in account
        }
        result = await self.service.query(parsed.request)
        return serialize_query_result(result, balance_metadata=balance_metadata)

    async def _render(self, parsed) -> str:
        if parsed.error is not None:
            return format_parse_error(parsed.error)
        request = parsed.request
        if request is None:
            return "无法识别查询请求。"
        if request.kind.value == "help":
            return format_help(self.settings)
        if request.kind.value == "status":
            return format_status(self.settings)
        return format_result(await self.service.query(request))

    @staticmethod
    def _permission_context(event: AstrMessageEvent) -> PermissionContext:
        is_private = bool(event.is_private_chat())
        get_platform_name = getattr(event, "get_platform_name", None)
        platform_name = (
            str(get_platform_name() or "") if callable(get_platform_name) else ""
        )
        return PermissionContext(
            is_private=is_private,
            is_admin=bool(event.is_admin()),
            user_id=str(event.get_sender_id() or ""),
            group_id=(None if is_private else str(event.get_group_id() or "")),
            platform_name=platform_name,
        )
