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

from .config_store import ConfigValidation

HELP = """额度预警管理（不会因保存命令而测试发送）
/yql alert status
/yql alert on|off \"账户名\"
/yql alert interval \"账户名\" 15
/yql alert threshold \"账户名\" 10 CNY [指标ID]
/yql alert recovery \"账户名\" 12（auto 使用默认迟滞）
/yql alert repeat \"账户名\" 0（0 不持续重复）
/yql alert retry \"账户名\"（解除查询认证暂停，不重发结果未知消息）
/yql alert targets list
/yql alert targets addhere @123 @456
/yql alert targets add 平台:GroupMessage:群号 @123 @456
/yql alert targets remove 目标ID
/yql alert admins list|add QQ号|remove QQ号
/yql alert llm on|off|provider 模型ID|persona 人格ID
模型 auto 使用目标会话模型；人格 none 不附加人格。
阈值必须指定单位；指标默认随供应商，兼容服务为 mapped_balance。
仅可信 QQ 白名单成员或 AstrBot 内置管理员可管理；群内不展示详细配置。
低于或等于阈值触发，恢复阈值之上才结束本轮；默认不持续重复。
"""


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


class AlertCommands:
    """One CAS transaction shared with the authenticated web configuration."""

    def __init__(self, settings, dispatch, status, retry=None):
        self._settings = settings
        self._dispatch = dispatch
        self._status = status
        self._retry = retry

    async def execute(self, event, argument: str) -> str:
        def authorize():
            if not can_manage_alert(event, self._settings()):
                raise PermissionError

        try:
            authorize()
            command = parse_alert_command(argument)
            private = event.is_private_chat() is True
            if command.operation == "help":
                return (
                    HELP
                    if private
                    else "预警管理：请私聊机器人使用 /yql alert help 查看详细配置用法。"
                )
            if (
                command.operation in {"status", "targets", "admins"}
                and (command.operation == "status" or command.arguments == ("list",))
                and not private
            ):
                return "预警详细状态和目标名单仅在私聊显示，请私聊机器人执行此命令。"
            dto = await self._dispatch("read", {}, authorize)
            authorize()
            config = copy.deepcopy(dto["config"])
            if command.operation == "status":
                status = self._status()
                lines = [
                    "额度预警："
                    + ("检查任务已启动" if status["running"] else "检查任务未运行")
                ]
                for row in status.get("accounts", []):
                    lines.append(f"{row['account_id']}：{row['message']}")
                lines.append("提交到平台不代表最终送达；结果未知不会自动重发。")
                return "\n".join(lines)
            if command.operation == "targets" and command.arguments == ("list",):
                targets = config.get("balance_alert_targets", [])
                return (
                    "\n".join(
                        [
                            "额度预警目标（保存不测试发送）：",
                            *[
                                f"{target_id(t['umo'])}  {t['umo']}"
                                + "".join(f" @{qq}" for qq in t["mentions"])
                                for t in targets
                            ],
                        ]
                    )
                    if targets
                    else "尚未配置预警目标。"
                )
            if command.operation == "admins" and command.arguments == ("list",):
                return (
                    "预警 QQ 管理白名单："
                    + ("、".join(config.get("balance_alert_admin_qq_ids", [])) or "空")
                    + "；AstrBot 内置管理员也可管理。"
                )
            if command.operation == "retry":
                if not command.arguments:
                    raise ConfigValidation("请指定账户。")
                account = _account(config, " ".join(command.arguments))
                authorize()
                if self._retry is not None:
                    self._retry(account["id"])
                return "已解除该账户的查询认证暂停，等待下一次预警检查；未重发任何结果未知的通知。"
            self._mutate(config, command, event)
            authorize()
            await self._dispatch(
                "update", {"revision": dto["revision"], "config": config}, authorize
            )
            authorize()
            return (
                "预警配置已保存；未执行测试发送。"
                if private
                else "预警配置已保存。详细状态请私聊查看。"
            )
        except PermissionError:
            return "无权管理额度预警；需要预警 QQ 白名单或 AstrBot 内置管理员权限。"
        except ConfigValidation as exc:
            try:
                private = event.is_private_chat() is True
            except Exception:
                private = False
            return (
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
                if len(args) not in {3, 4}:
                    raise ConfigValidation(
                        '用法：threshold "账户名" 金额 单位 [指标ID]。'
                    )
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
                alert["threshold"], alert["unit"] = values[:2]
                if len(values) == 3:
                    alert["metric"] = values[2]
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
            if len(args) == 2 and args[0] in {"provider", "persona"}:
                llm[args[0] + "_id"] = (
                    ""
                    if args[1] == ("auto" if args[0] == "provider" else "none")
                    else args[1]
                )
                return
        raise ConfigValidation("预警命令参数无效；请私聊使用 /yql alert help。")
