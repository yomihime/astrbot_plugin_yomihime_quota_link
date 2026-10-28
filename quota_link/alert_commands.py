"""Explicit alert management commands, separate from balance query authority.

Only trusted Host event identity is used. Neither a target UMO, a mention, an
LLM argument nor a platform group-admin badge grants management permission.
"""

from __future__ import annotations

import copy
import hashlib
import re
import shlex
from dataclasses import dataclass

from .alert_cards import (
    build_alert_admins_card,
    build_alert_help_card,
    build_alert_receipt_card,
    build_alert_status_card,
    build_alert_targets_card,
    build_alert_units_card,
    format_alert_card,
)
from .config_store import ConfigValidation
from .presentation.bitmap import CardSpec

HELP = format_alert_card(build_alert_help_card())


def can_manage_alert(event, settings) -> bool:
    """OR authority: SDK is_admin OR a supported QQ adapter's actual sender."""
    try:
        if event.is_admin() is True:
            return True
    except Exception:
        pass
    try:
        # This adapter exposes actual numeric QQ IDs. qq_official openids are
        # not QQ numbers and must not be guessed into this number whitelist.
        if event.get_platform_name() != "aiocqhttp":
            return False
        sender = event.get_sender_id()
        return (
            isinstance(sender, str)
            and re.fullmatch(r"[1-9][0-9]{0,19}", sender) is not None
            and sender in settings.balance_alert_admin_qq_ids
        )
    except Exception:
        return False


def target_id(umo: str) -> str:
    """Stable removal key, independent of ordering and mention edits."""
    return hashlib.sha256(umo.encode("utf-8")).hexdigest()[:12]


@dataclass(frozen=True)
class AlertCommand:
    operation: str
    arguments: tuple[str, ...] = ()


def parse_alert_command(argument: str) -> AlertCommand:
    if not isinstance(argument, str) or len(argument) > 4096:
        raise ConfigValidation("预警命令过长。")
    try:
        words = shlex.split(argument)
    except ValueError:
        raise ConfigValidation("引号未配对；多词账户名请使用双引号。") from None
    if not words:
        return AlertCommand("help")
    operation = words.pop(0).casefold()
    if operation not in {
        "help",
        "status",
        "on",
        "off",
        "interval",
        "threshold",
        "recovery",
        "repeat",
        "retry",
        "units",
        "bind",
        "targets",
        "admins",
        "llm",
    }:
        raise ConfigValidation("未知预警命令；使用 /yql alert help 查看用法。")
    if operation in {"help", "status"} and words:
        raise ConfigValidation("该预警命令不接受附加参数。")
    return AlertCommand(operation, tuple(words))


def _integer(text: str, minimum: int, maximum: int) -> int:
    if not re.fullmatch(r"[0-9]+", text) or len(text) > 4:
        raise ConfigValidation("间隔必须是范围内的整数分钟。")
    value = int(text)
    if not minimum <= value <= maximum:
        raise ConfigValidation("间隔必须是范围内的整数分钟。")
    return value


def _account(config, name):
    normalized = name.strip().casefold()
    matches = [
        account
        for account in config.get("providers", [])
        if normalized
        in {
            str(value).strip().casefold()
            for value in (
                account["id"],
                account.get("display_name", ""),
                *account.get("aliases", []),
            )
            if value
        }
    ]
    if len(matches) != 1:
        raise ConfigValidation("账户不存在或名称不唯一，请使用管理页中的账户 ID。")
    return matches[0]


def _mentions(words):
    if any(not word.startswith("@") or len(word) < 2 for word in words):
        raise ConfigValidation("提及必须写成 @QQ号；不支持昵称、@all 或 CQ 代码。")
    return [word[1:] for word in words]


@dataclass(frozen=True)
class AlertCommandResult:
    """One execution's complete text and optional, already-projected card."""

    text: str
    card: CardSpec | None = None

    @classmethod
    def from_card(cls, card: CardSpec) -> AlertCommandResult:
        return cls(format_alert_card(card), card)

    @classmethod
    def receipt(cls, text: str, *, private: bool) -> AlertCommandResult:
        return cls(text, build_alert_receipt_card(text) if private else None)


class AlertCommands:
    """One CAS transaction shared with the authenticated web configuration."""

    def __init__(self, settings, dispatch, status, retry=None):
        self._settings = settings
        self._dispatch = dispatch
        self._status = status
        self._retry = retry

    async def execute(self, event, argument: str) -> str:
        """Compatibility API: render failures must never execute this twice."""
        return (await self.execute_result(event, argument)).text

    async def execute_result(self, event, argument: str) -> AlertCommandResult:
        def authorize():
            if not can_manage_alert(event, self._settings()):
                raise PermissionError

        try:
            authorize()
            command = parse_alert_command(argument)
            private = event.is_private_chat() is True
            if command.operation == "help":
                return (
                    AlertCommandResult.from_card(build_alert_help_card())
                    if private
                    else AlertCommandResult(
                        "预警管理：请私聊机器人使用 /yql alert help 查看详细配置用法。"
                    )
                )
            if (
                command.operation in {"status", "targets", "admins", "units"}
                and (
                    command.operation in {"status", "units"}
                    or command.arguments == ("list",)
                )
                and not private
            ):
                return AlertCommandResult(
                    "预警详细状态和目标名单仅在私聊显示，请私聊机器人执行此命令。"
                )
            dto = await self._dispatch("read", {}, authorize)
            authorize()
            config = copy.deepcopy(dto["config"])
            if command.operation in {"units", "bind"}:
                args = list(command.arguments)
                if not args or command.operation == "bind" and len(args) < 2:
                    raise ConfigValidation("请指定账户与候选 ID。")
                choice = args.pop() if command.operation == "bind" else None
                refresh = (
                    command.operation == "units"
                    and len(args) > 1
                    and args[-1].casefold() == "refresh"
                )
                if refresh:
                    args.pop()
                account = _account(config, " ".join(args))
                if choice is not None:
                    if not re.fullmatch(r"[0-9a-f]{64}", choice):
                        raise ConfigValidation("请选择最新单位候选 ID。")
                    await self._dispatch(
                        "alert-bind-unit",
                        {
                            "revision": dto["revision"],
                            "account_id": account["id"],
                            "choice_id": choice,
                        },
                        authorize,
                    )
                    authorize()
                    return AlertCommandResult.receipt("单位已确认。", private=private)
                data = await self._dispatch(
                    "alert-refresh-units" if refresh else "alert-units",
                    {"revision": dto["revision"], "account_id": account["id"]}
                    if refresh
                    else {},
                    authorize,
                )
                authorize()
                row = next(
                    (
                        item
                        for item in data.get("accounts", [])
                        if item["account_id"] == account["id"]
                    ),
                    {},
                )
                return AlertCommandResult.from_card(
                    build_alert_units_card(account, row, refreshed=refresh)
                )
            if command.operation == "status":
                return AlertCommandResult.from_card(
                    build_alert_status_card(config, self._status())
                )
            if command.operation == "targets" and command.arguments == ("list",):
                return AlertCommandResult.from_card(
                    build_alert_targets_card(
                        tuple(
                            (target_id(t["umo"]), t["umo"], tuple(t["mentions"]))
                            for t in config.get("balance_alert_targets", [])
                        )
                    )
                )
            if command.operation == "admins" and command.arguments == ("list",):
                return AlertCommandResult.from_card(
                    build_alert_admins_card(
                        tuple(config.get("balance_alert_admin_qq_ids", []))
                    )
                )
            if command.operation == "retry":
                if not command.arguments:
                    raise ConfigValidation("请指定账户。")
                account = _account(config, " ".join(command.arguments))
                authorize()
                if self._retry is not None:
                    self._retry(account["id"])
                return AlertCommandResult.receipt("已恢复检查。", private=private)
            self._mutate(config, command, event)
            authorize()
            await self._dispatch(
                "update", {"revision": dto["revision"], "config": config}, authorize
            )
            authorize()
            return AlertCommandResult.receipt(
                "预警配置已保存。"
                if private
                else "预警配置已保存。详细状态请私聊查看。",
                private=private,
            )
        except PermissionError:
            return AlertCommandResult(
                "无权管理额度预警；需要预警 QQ 白名单或 AstrBot 内置管理员权限。"
            )
        except ConfigValidation as exc:
            try:
                private = event.is_private_chat() is True
            except Exception:
                private = False
            return AlertCommandResult(
                str(exc)
                if private
                else "预警配置未保存；请私聊查看用法或在管理页修正配置。"
            )

    @staticmethod
    def _mutate(config, command, event):
        args = list(command.arguments)
        op = command.operation
        if op in {"on", "off", "interval", "threshold", "recovery", "repeat"}:
            if not args:
                raise ConfigValidation("请指定账户及必要参数。")
            if op in {"on", "off"}:
                name, values = " ".join(args), []
            elif op == "threshold":
                if len(args) not in {2, 3}:
                    raise ConfigValidation('用法：threshold "账户名" 金额 [指标ID]。')
                name, values = args[0], args[1:]
            else:
                if len(args) < 2:
                    raise ConfigValidation("请指定账户及数值。")
                name, values = " ".join(args[:-1]), args[-1:]
            account = _account(config, name)
            alert = account.setdefault(
                "balance_alert", {"enabled": False, "check_interval_minutes": 15}
            )
            if op in {"on", "off"}:
                alert["enabled"] = op == "on"
            elif op == "interval":
                alert["check_interval_minutes"] = _integer(values[0], 1, 4320)
            elif op == "repeat":
                alert["repeat_minutes"] = _integer(values[0], 0, 4320)
            elif op == "threshold":
                alert["threshold"] = values[0]
                if len(values) == 2:
                    alert["metric"] = values[1]
            elif op == "recovery":
                alert["recovery_threshold"] = None if values[0] == "auto" else values[0]
            return
        if op == "targets":
            if not args:
                raise ConfigValidation("请使用 targets list/add/addhere/remove。")
            action = args.pop(0)
            targets = config.setdefault("balance_alert_targets", [])
            if action == "remove" and len(args) == 1:
                matches = [t for t in targets if target_id(t["umo"]) == args[0]]
                if len(matches) != 1:
                    raise ConfigValidation("目标 ID 不存在；请私聊使用 targets list。")
                targets.remove(matches[0])
                return
            if action == "addhere":
                umo = getattr(event, "unified_msg_origin", None)
                if not isinstance(umo, str) or not umo:
                    raise ConfigValidation("宿主没有提供可信当前会话，未保存目标。")
            elif action == "add" and args:
                umo = args.pop(0)
            else:
                raise ConfigValidation("目标命令参数无效。")
            targets.append({"umo": umo, "mentions": _mentions(args)})
            return
        if op == "admins" and len(args) == 2 and args[0] in {"add", "remove"}:
            admins = config.setdefault("balance_alert_admin_qq_ids", [])
            if args[0] == "add":
                admins.append(args[1])
            elif args[1] in admins:
                admins.remove(args[1])
            else:
                raise ConfigValidation("该 QQ 号不在预警管理白名单中。")
            return
        if op == "llm" and args:
            llm = config.setdefault(
                "balance_alert_llm",
                {"enabled": True, "provider_id": "", "persona_id": ""},
            )
            if len(args) == 1 and args[0] in {"on", "off"}:
                llm["enabled"] = args[0] == "on"
                return
        raise ConfigValidation("预警命令参数无效；请私聊使用 /yql alert help。")
