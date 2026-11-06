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
    format_alert_help,
)
from .config_store import ConfigValidation
from .i18n import message, render_text, tr
from .presentation.bitmap import CardSpec

HELP = format_alert_help()


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
        raise ConfigValidation(message("alert.command.too_long"))
    try:
        words = shlex.split(argument)
    except ValueError:
        raise ConfigValidation(message("alert.command.unclosed_quote")) from None
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
        raise ConfigValidation(message("alert.command.unknown"))
    if operation == "help" and words:
        if len(words) != 1 or words[0].casefold() not in {
            "account",
            "units",
            "targets",
        }:
            raise ConfigValidation(message("alert.command.help_syntax"))
        words[0] = words[0].casefold()
    if operation == "status" and words:
        raise ConfigValidation(message("alert.command.extra_arguments"))
    return AlertCommand(operation, tuple(words))


def _integer(text: str, minimum: int, maximum: int) -> int:
    if not re.fullmatch(r"[0-9]+", text) or len(text) > 4:
        raise ConfigValidation(message("alert.command.interval_range"))
    value = int(text)
    if not minimum <= value <= maximum:
        raise ConfigValidation(message("alert.command.interval_range"))
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
        raise ConfigValidation(message("alert.command.account_not_unique"))
    return matches[0]


def _mentions(words):
    if any(not word.startswith("@") or len(word) < 2 for word in words):
        raise ConfigValidation(message("alert.command.mention_syntax"))
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
                topic = command.arguments[0] if command.arguments else ""
                return (
                    AlertCommandResult(
                        format_alert_help(topic), build_alert_help_card(topic)
                    )
                    if private
                    else AlertCommandResult(tr("alert.command.private_help"))
                )
            if (
                command.operation in {"status", "targets", "admins", "units"}
                and (
                    command.operation in {"status", "units"}
                    or command.arguments == ("list",)
                )
                and not private
            ):
                return AlertCommandResult(tr("alert.command.private_status"))
            dto = await self._dispatch("read", {}, authorize)
            authorize()
            config = copy.deepcopy(dto["config"])
            if command.operation in {"units", "bind"}:
                args = list(command.arguments)
                if not args or command.operation == "bind" and len(args) < 2:
                    raise ConfigValidation(
                        message("alert.command.account_candidate_required")
                    )
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
                        raise ConfigValidation(
                            message("alert.command.latest_candidate_required")
                        )
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
                    return AlertCommandResult.receipt(
                        tr("alert.command.unit_confirmed"), private=private
                    )
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
                    raise ConfigValidation(message("alert.command.account_required"))
                account = _account(config, " ".join(command.arguments))
                authorize()
                if self._retry is not None:
                    self._retry(account["id"])
                return AlertCommandResult.receipt(
                    tr("alert.command.resumed"), private=private
                )
            self._mutate(config, command, event)
            authorize()
            await self._dispatch(
                "update", {"revision": dto["revision"], "config": config}, authorize
            )
            authorize()
            return AlertCommandResult.receipt(
                tr("alert.command.saved")
                if private
                else tr("alert.command.saved_private"),
                private=private,
            )
        except PermissionError:
            return AlertCommandResult(tr("alert.command.admin_required"))
        except ConfigValidation as exc:
            try:
                private = event.is_private_chat() is True
            except Exception:
                private = False
            return AlertCommandResult(
                render_text(exc.args[0] if exc.args else "")
                if private
                else tr("alert.command.save_failed")
            )

    @staticmethod
    def _mutate(config, command, event):
        args = list(command.arguments)
        op = command.operation
        if op in {"on", "off", "interval", "threshold", "recovery", "repeat"}:
            if not args:
                raise ConfigValidation(message("alert.command.parameters_required"))
            if op in {"on", "off"}:
                name, values = " ".join(args), []
            elif op == "threshold":
                if len(args) not in {2, 3}:
                    raise ConfigValidation(message("alert.command.threshold_syntax"))
                name, values = args[0], args[1:]
            else:
                if len(args) < 2:
                    raise ConfigValidation(message("alert.command.value_required"))
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
                raise ConfigValidation(message("alert.command.targets_syntax"))
            action = args.pop(0)
            targets = config.setdefault("balance_alert_targets", [])
            if action == "remove" and len(args) == 1:
                matches = [t for t in targets if target_id(t["umo"]) == args[0]]
                if len(matches) != 1:
                    raise ConfigValidation(message("alert.command.target_missing"))
                targets.remove(matches[0])
                return
            if action == "addhere":
                umo = getattr(event, "unified_msg_origin", None)
                if not isinstance(umo, str) or not umo:
                    raise ConfigValidation(message("alert.command.untrusted_session"))
            elif action == "add" and args:
                umo = args.pop(0)
            else:
                raise ConfigValidation(
                    message("alert.command.invalid_target_arguments")
                )
            targets.append({"umo": umo, "mentions": _mentions(args)})
            return
        if op == "admins" and len(args) == 2 and args[0] in {"add", "remove"}:
            admins = config.setdefault("balance_alert_admin_qq_ids", [])
            if args[0] == "add":
                admins.append(args[1])
            elif args[1] in admins:
                admins.remove(args[1])
            else:
                raise ConfigValidation(message("alert.command.qq_not_allowlisted"))
            return
        if op == "llm" and args:
            llm = config.setdefault(
                "balance_alert_llm",
                {"enabled": True, "provider_id": "", "persona_id": ""},
            )
            if len(args) == 1 and args[0] in {"on", "off"}:
                llm["enabled"] = args[0] == "on"
                return
        raise ConfigValidation(message("alert.command.invalid_arguments"))
