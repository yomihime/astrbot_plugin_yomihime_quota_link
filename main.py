"""AstrBot boundary and lifecycle assembly for Yomihime Quota Link."""

from __future__ import annotations

import asyncio
import re
from collections.abc import Mapping
from pathlib import Path
from typing import Any

from astrbot.api.event import AstrMessageEvent, filter
from astrbot.api.star import Star, register

from .quota_link.alert_commands import AlertCommands
from .quota_link.cache import BalanceCache
from .quota_link.cards import (
    build_help_card,
    build_status_card,
    render_local_card,
    render_result_card,
)
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
from .quota_link.local_status import LocalStorageStatus, project_storage_status
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


async def _alert_session_enabled(umo):
    try:
        from astrbot.core.star.session_llm_manager import SessionServiceManager

        state = await SessionServiceManager.is_session_enabled(umo)
        return state if type(state) is bool else None
    except Exception:
        return None


async def _alert_session_llm_enabled(umo):
    try:
        from astrbot.core.star.session_llm_manager import SessionServiceManager

        return await SessionServiceManager.is_llm_enabled_for_session(umo) is True
    except Exception:
        return False


_COMMAND_START = re.compile(r"^\s*(?:/\s*)?yql\b\s*(.*)$", re.IGNORECASE | re.DOTALL)


def _alert_message_chain(mentions, text):
    """The SDK boundary constructs real mentions, never ordinary @ text."""
    from astrbot.api.event import MessageChain
    from astrbot.api.message_components import At, Plain

    return MessageChain([*(At(qq=qq) for qq in mentions), Plain(text)])


@register(
    "astrbot_plugin_yomihime_quota_link",
    "yomihime",
    "如月怜的额度连结：多平台 AI API 余额 / 用量监控。",
    "0.3.0",
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
        self._alert_engine = None
        self._alert_root = None
        self._terminated = False
        self._lifecycle_epoch = 0
        self._management_lock = asyncio.Lock()
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
        # A later initialization or termination invalidates this attempt even
        # while it is queued behind a config transaction or async cleanup.
        self._lifecycle_epoch += 1
        epoch = self._lifecycle_epoch
        async with self._management_lock:
            if epoch != self._lifecycle_epoch:
                return
            self._terminated = False
            await self._initialize(epoch)

    async def _initialize(self, epoch: int) -> None:
        await self._stop_alerts()
        self._alert_root = None
        await self._stop_font()
        if self._admin_pages is not None:
            self._admin_pages.close()
            self._admin_pages = None
        await self._close_runtime()
        if self._terminated or epoch != self._lifecycle_epoch:
            return
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
        if root is not None and not self._storage_failed:
            self._alert_root = Path(root)
            self._start_alerts()
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

    def _alert_status(self):
        if self._alert_engine is not None:
            return self._alert_engine.status()
        return {
            "running": False,
            "storage_available": False,
            "accounts": [],
        }

    def _alert_units(self):
        if self._alert_engine is not None:
            return self._alert_engine.unit_status()
        return {"accounts": []}

    def _start_alerts(self):
        if (
            self._terminated
            or self._alert_root is None
            or self._context is None
            or self._storage_failed
            or self._alert_engine is not None
        ):
            return
        from .quota_link.alert_delivery import AlertDelivery
        from .quota_link.alerts import AlertEngine

        engine = AlertEngine(
            self.settings,
            self.service,
            self._context,
            self._alert_root / "alerts.sqlite3",
            delivery=AlertDelivery(
                self._context,
                component_factory=_alert_message_chain,
                session_enabled=_alert_session_enabled,
                session_llm_enabled=_alert_session_llm_enabled,
            ),
            is_current=lambda: self._alert_engine is engine and not self._terminated,
        )
        self._alert_engine = engine
        engine.start()

    async def _stop_alerts(self):
        # Revoke generation before the first await: queued provider/LLM work
        # may finish late, but cannot acquire authority to send for this engine.
        engine, self._alert_engine = self._alert_engine, None
        if engine is not None:
            await engine.close()

    def _retry_alert(self, account_id):
        self.service.retry_account(account_id)
        if self._alert_engine is not None:
            self._alert_engine.wake(account_id)

    async def _admin_dispatch(self, operation, body, authorize):
        from .quota_link.config_store import (
            ConfigConflict,
            ConfigUnavailable,
            ConfigValidation,
        )

        async with self._management_lock:
            authorize()
            if operation == "alert-status":
                result = self._alert_status()
                authorize()
                return result
            if operation == "alert-units":
                result = self._alert_units()
                authorize()
                return result
            if self._config_store is None or self._terminated:
                raise ConfigUnavailable()
            if operation in {"alert-bind-unit", "alert-refresh-units"}:
                dto = await self._config_store.dispatch("read", {}, authorize)
                authorize()
                if (
                    type(body.get("revision")) is not int
                    or body["revision"] != dto["revision"]
                ):
                    raise ConfigConflict()
                if self._alert_engine is None:
                    raise ConfigUnavailable()
                engine = self._alert_engine
                try:
                    if operation == "alert-refresh-units":
                        await engine.refresh_units(body.get("account_id"), authorize)
                        authorize()
                        if self._terminated or self._alert_engine is not engine:
                            raise ConfigUnavailable()
                        latest = await self._config_store.dispatch(
                            "read", {}, authorize
                        )
                        authorize()
                        if self._terminated or self._alert_engine is not engine:
                            raise ConfigUnavailable()
                        if latest["revision"] != body["revision"]:
                            raise ConfigConflict()
                    else:
                        engine.confirm_unit(
                            body.get("account_id"), body.get("choice_id")
                        )
                except ConfigValidation:
                    raise
                except ValueError as error:
                    raise ConfigValidation(str(error)) from None
                authorize()
                return self._alert_units()
            mutation = operation in {
                "update",
                "credential-replace",
                "credential-clear",
                "legacy-config-execute",
            }
            if mutation:
                await self._stop_alerts()
            try:
                result = await self._config_store.dispatch(operation, body, authorize)
                if self._storage_failed:
                    authorize()
                    self._storage_failed = False
                    await self._replace_runtime(self._config_store.runtime_config())
                return result
            except ConfigUnavailable:
                self._storage_failed = True
                await self._replace_runtime({})
                raise
            finally:
                # Validation/CAS failures keep the previous config and episode;
                # they must not leave a formerly working watcher silently stopped.
                if mutation:
                    self._start_alerts()

    async def _replace_runtime(self, raw) -> None:
        await self._stop_alerts()
        old_service, old_client = self.service, self.http_client
        self._build_runtime(raw)
        await self._dispose_runtime(old_service, old_client)
        self._start_alerts()

    async def terminate(self) -> None:
        self._lifecycle_epoch += 1
        self._terminated = True
        await self._stop_alerts()
        async with self._management_lock:
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
        message = event.get_message_str()
        match = _COMMAND_START.match(message)
        argument = match.group(1) if match else ""
        alert_match = re.match(
            r"^alert(?:\s+|$)(.*)$", argument, re.IGNORECASE | re.DOTALL
        )
        if alert_match is not None:
            commands = AlertCommands(
                lambda: self.settings,
                self._admin_dispatch,
                self._alert_status,
                self._retry_alert,
            )
            result = await commands.execute_result(event, alert_match.group(1))
            if result.card is None:
                yield event.plain_result(result.text)
            else:
                yield await self._card_reply(
                    event, result.card, render_local_card, result.text
                )
            return
        context = self._permission_context(event)
        if not can_query(context, self.settings, is_command=True):
            yield event.plain_result("当前会话无权查询额度信息。")
            return

        parsed = parse_command(argument, self.settings.directory)
        if parsed.error is not None or parsed.request is None:
            yield event.plain_result(await self._render(parsed))
            return

        # Help/status stay local. Query results are fetched once; every route
        # then shares image preparation and complete text fallback below.
        settings = self.settings
        render_options = {}
        if parsed.request.kind.value == "help":
            payload = build_help_card(settings)
            renderer = render_local_card
            fallback = format_help(settings)
        elif parsed.request.kind.value == "status":
            try:
                storage = await self._local_storage_status(context)
            except PermissionError:
                yield event.plain_result("当前会话无权查询额度信息。")
                return
            settings = self.settings
            payload = build_status_card(settings, storage)
            renderer = render_local_card
            fallback = format_status(settings, storage)
        else:
            payload = await self.service.query(parsed.request)
            renderer = render_result_card
            render_options = {"directory": settings.directory}
            fallback = format_result(payload)
        yield await self._card_reply(
            event, payload, renderer, fallback, **render_options
        )

    async def _card_reply(self, event, payload, renderer, fallback, **render_options):
        """Prepare one reply; fallback never reruns a command, query or mutation."""
        prepared = None
        try:
            bitmap = await asyncio.to_thread(
                renderer, payload, self._font_path, **render_options
            )
            if bitmap:
                from astrbot.api.message_components import Image

                prepared = event.chain_result([Image.fromBytes(bitmap)])
        except Exception:
            # Optional rendering or image preparation may fail. Do not log
            # account facts or retry after dispatch, which could send twice.
            pass
        return prepared if prepared is not None else event.plain_result(fallback)

    async def _local_storage_status(self, context) -> LocalStorageStatus:
        """Read save metadata locally, then discard identifiers and config values."""
        if self._config_store is None:
            return LocalStorageStatus(
                state="unavailable" if self._storage_failed else "unknown"
            )

        def authorize():
            if not can_query(context, self.settings, is_command=True):
                raise PermissionError

        try:
            dto = await self._config_store.dispatch("credential-status", {}, authorize)
            authorize()
            return project_storage_status(self.settings.directory, dto)
        except PermissionError:
            raise
        except Exception:
            # Storage diagnostics can contain private paths or credential refs.
            return LocalStorageStatus(state="unavailable")

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
