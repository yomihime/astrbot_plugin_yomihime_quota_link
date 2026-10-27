"""AstrBot boundary and lifecycle assembly for Yomihime Quota Link."""

from __future__ import annotations

import asyncio
import re
from collections.abc import Mapping
from pathlib import Path
from typing import Any

from astrbot.api.event import AstrMessageEvent, filter
from astrbot.api.star import Star, register

from .quota_link.cache import BalanceCache
from .quota_link.cards import render_result_card
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
from .quota_link.managed_font import FONT_FILENAME, prepare_font
from .quota_link.providers import IMPLEMENTED_ADAPTERS
from .quota_link.service import QueryService
from .quota_link.settings import (
    PluginSettings,
    load_settings,
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
    "0.2.2",
)
class YomihimeQuotaLink(Star):
    """Monitor balances and usage across AI API providers."""

    def __init__(self, context: Any, config: Mapping[str, Any] | None = None) -> None:
        super().__init__(context, config)
        self.config = config if config is not None else {}
        self._context = context
        self._config_store = None
        self._admin_pages = None
        self._storage_failed = False
        self._cleanup_tasks = set()
        self._font_task = None
        self._font_path = None
        self.settings: PluginSettings
        self.cache: BalanceCache
        self.service: QueryService
        self._build_runtime({} if context is not None else None)

    def _build_runtime(self, raw: Mapping[str, Any] | None = None) -> None:
        """Create per-plugin settings, cache, and query service from config."""
        self.settings = load_settings(self.config if raw is None else raw)
        self.cache = BalanceCache()
        self.http_client = HttpProviderClient(timeout=self.settings.timeout_seconds)
        self.service = QueryService(
            self.settings, IMPLEMENTED_ADAPTERS, self.http_client, self.cache
        )

    async def initialize(self) -> None:
        await self._stop_font()
        if self._admin_pages is not None:
            self._admin_pages.close()
            self._admin_pages = None
        await self._close_runtime()
        raw = self.config
        root = None
        # Host initialization owns the persistent data directory. Tests without
        # a host context retain an entirely in-memory legacy runtime.
        if self._context is not None:
            from astrbot.api.star import StarTools

            from .quota_link.config_store import ConfigStore
            from .quota_link.security import SecretStore

            try:
                root = StarTools.get_data_dir("astrbot_plugin_yomihime_quota_link")
                self._config_store = ConfigStore(
                    SecretStore(root), self.config, self._replace_runtime
                )
                raw = self._config_store.runtime_config()
                self._storage_failed = False
            except Exception:
                # A failed vault must never reactivate old plaintext secrets.
                self._storage_failed = True
                raw = {}
        self._build_runtime(raw)
        if self._context is not None and self.config.get("enable_admin_page", True):
            from astrbot.api.web import json_response, request

            from .quota_link.admin import AdminPages

            self._admin_pages = AdminPages(
                self._context,
                self._admin_dispatch,
                request=request,
                json_response=json_response,
            )
            self._admin_pages.register()

        if root is not None:
            ygl_font = None
            try:
                # Public Host metadata confirms installation; use the sibling
                # plugin-data path without creating or importing YGL's runtime.
                get_star = getattr(self._context, "get_registered_star", None)
                ygl = (
                    get_star("astrbot_plugin_yomihime_game_link")
                    if callable(get_star)
                    else None
                )
                if getattr(ygl, "name", None) == "astrbot_plugin_yomihime_game_link":
                    ygl_font = (
                        Path(root).parent
                        / "astrbot_plugin_yomihime_game_link"
                        / "resources"
                        / "fonts"
                        / FONT_FILENAME
                    )
            except Exception:
                pass
            self._font_task = asyncio.create_task(
                self._prepare_command_font(Path(root), ygl_font),
                name="yql:managed-font",
            )

    async def _prepare_command_font(self, root, ygl_font) -> None:
        try:
            self._font_path = await prepare_font(root, ygl_font)
        except Exception:
            self._font_path = None

    async def _stop_font(self) -> None:
        task, self._font_task = self._font_task, None
        self._font_path = None
        if task is not None:
            if not task.done():
                task.cancel()
            await asyncio.gather(task, return_exceptions=True)

    async def _admin_dispatch(self, operation, body, authorize):
        from .quota_link.config_store import ConfigUnavailable

        if self._config_store is None:
            raise ConfigUnavailable()
        try:
            result = await self._config_store.dispatch(operation, body, authorize)
        except ConfigUnavailable:
            self._storage_failed = True
            await self._replace_runtime({})
            raise
        if self._storage_failed:
            authorize()
            await self._replace_runtime(self._config_store.runtime_config())
            self._storage_failed = False
        return result

    async def _replace_runtime(self, raw) -> None:
        old_service, old_client = self.service, self.http_client
        self._build_runtime(raw)
        await self._dispose_runtime(old_service, old_client)

    async def terminate(self) -> None:
        await self._stop_font()
        if self._admin_pages is not None:
            self._admin_pages.close()
            self._admin_pages = None
        await self._close_runtime()

    async def _dispose_runtime(self, service, client) -> None:
        async def cleanup():
            try:
                await service.close()
            finally:
                await client.close()

        task = asyncio.create_task(cleanup())
        self._cleanup_tasks.add(task)

        def finished(completed):
            self._cleanup_tasks.discard(completed)
            if not completed.cancelled():
                completed.exception()

        task.add_done_callback(finished)
        # Request cancellation must not strand the retired HTTP client/cache.
        await asyncio.shield(task)

    async def _close_runtime(self) -> None:
        await self._dispose_runtime(self.service, self.http_client)
        if self._cleanup_tasks:
            await asyncio.shield(asyncio.gather(*tuple(self._cleanup_tasks)))

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
        if (
            parsed.error is not None
            or parsed.request is None
            or parsed.request.kind.value in {"help", "status"}
        ):
            yield event.plain_result(await self._render(parsed))
            return

        # Query once: image and text fallback share the same immutable facts.
        result = await self.service.query(parsed.request)
        prepared = None
        try:
            bitmap = await asyncio.to_thread(
                render_result_card, result, self._font_path
            )
            if bitmap:
                from astrbot.api.message_components import Image

                prepared = event.chain_result([Image.fromBytes(bitmap)])
        except Exception:
            # Optional rendering or image preparation may fail. Do not log
            # account facts or retry after dispatch, which could send twice.
            pass
        if prepared is not None:
            yield prepared
        else:
            yield event.plain_result(format_result(result))

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
