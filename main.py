"""AstrBot boundary and lifecycle assembly for Yomihime Quota Link."""

from __future__ import annotations

import re
from collections.abc import Mapping
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
from .quota_link.intent import (
    PermissionContext,
    can_query,
    parse_command,
    parse_natural_language,
)
from .quota_link.providers import IMPLEMENTED_ADAPTERS
from .quota_link.service import QueryService
from .quota_link.settings import PluginSettings, load_settings

_COMMAND_EVENT = "yomihime_quota_link.command_handled"
_COMMAND_START = re.compile(r"^\s*(?:/\s*)?yql\b\s*(.*)$", re.IGNORECASE | re.DOTALL)
_COMMAND_MESSAGE = re.compile(r"^\s*(?:/|!|\.)\S")


@register(
    "astrbot_plugin_yomihime_quota_link",
    "yomihime",
    "如月怜的额度连结：多平台 AI API 余额 / 用量监控。",
    "0.1.0",
)
class YomihimeQuotaLink(Star):
    """Monitor balances and usage across AI API providers."""

    def __init__(self, context: Any, config: Mapping[str, Any] | None = None) -> None:
        super().__init__(context, config)
        self.config = config or {}
        self.settings: PluginSettings
        self.cache: BalanceCache
        self.service: QueryService
        self._build_runtime()

    def _build_runtime(self) -> None:
        """Create per-plugin settings, cache, and query service from config."""
        self.settings = load_settings(self.config)
        self.cache = BalanceCache()
        self.service = QueryService(
            self.settings, IMPLEMENTED_ADAPTERS, None, self.cache
        )

    async def initialize(self) -> None:
        await self.service.close()
        self._build_runtime()

    async def terminate(self) -> None:
        await self.service.close()

    @filter.command("yql")
    async def quota_link(self, event: AstrMessageEvent):
        """Run one full-argument /yql request."""
        event.set_extra(_COMMAND_EVENT, True)
        context = self._permission_context(event)
        if not can_query(context, self.settings):
            yield event.plain_result("当前会话无权查询额度信息。")
            return

        message = event.get_message_str()
        match = _COMMAND_START.match(message)
        argument = match.group(1) if match else ""
        parsed = parse_command(argument, self.settings.directory)
        yield event.plain_result(await self._render(parsed))

    @filter.event_message_type(filter.EventMessageType.ALL)
    async def natural_language_query(self, event: AstrMessageEvent):
        """Answer recognized balance questions once, leaving commands to filters."""
        if (
            event.get_extra(_COMMAND_EVENT, False)
            or event.get_extra("parsed_params") is not None
        ):
            return
        message = event.get_message_str()
        if _COMMAND_MESSAGE.match(message) or re.match(
            r"^\s*yql(?:\s|$)", message, re.IGNORECASE
        ):
            return
        context = self._permission_context(event)
        if not can_query(context, self.settings):
            return
        parsed = parse_natural_language(message, self.settings.directory)
        if parsed is None:
            return
        event.set_extra(_COMMAND_EVENT, True)
        yield event.plain_result(await self._render(parsed))

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
        return PermissionContext(
            is_private=is_private,
            is_admin=bool(event.is_admin()),
            user_id=str(event.get_sender_id() or ""),
            group_id=(None if is_private else str(event.get_group_id() or "")),
        )
