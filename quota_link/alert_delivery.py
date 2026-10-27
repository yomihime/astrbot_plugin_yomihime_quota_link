"""Bounded AstrBot delivery; models can select tone, never facts or recipients."""

from __future__ import annotations

import asyncio
import hashlib
import re
from collections.abc import Awaitable, Callable, Mapping
from dataclasses import dataclass
from decimal import Decimal
from typing import Any

_QQ = re.compile(r"[1-9][0-9]{0,19}\Z")
_HINTS = (
    "额度有点紧张，请留意后续使用。",
    "温馨提醒：请及时检查账户额度。",
    "请关注额度变化，按需安排后续使用。",
)
_METRIC_LABELS = {
    "AvailableCashAmount": "现金余额",
    "AvailableAmount": "可用额度",
    "CreditAmount": "信用额度",
    "total_balance": "总余额",
    "granted_balance": "赠送余额",
    "topped_up_balance": "充值余额",
    "credit": "积分余额",
    "site_credit": "站点积分",
    "mapped_balance": "映射余额",
}


@dataclass(frozen=True, slots=True)
class AlertFact:
    account_id: str
    display_name: str
    metric: str
    amount: Decimal
    threshold: Decimal
    unit: str
    fetched_at: float | None = None


@dataclass(frozen=True, slots=True)
class DeliveryResult:
    status: str
    message: str
    reason_code: str = ""

    def __post_init__(self) -> None:
        if self.reason_code not in {"", "session_disabled", "fixed_hint"}:
            raise ValueError("unknown delivery reason code")


def _exact_decimal(value: Decimal) -> str:
    if not isinstance(value, Decimal) or not value.is_finite():
        raise ValueError("invalid alert amount")
    if value.is_zero():
        return "0"
    digits, exponent = value.as_tuple().digits, value.as_tuple().exponent
    if len(digits) > 128:
        raise ValueError("alert amount is too long")
    return format(value, "f") if len(digits) + abs(exponent) <= 128 else str(value)


def format_alert_facts(facts: tuple[AlertFact, ...], hint: str = "") -> str:
    """The only source of amounts, conditions and account names is program data."""
    lines = ["【额度预警】"]
    if hint in _HINTS:
        lines.append(hint)
    for fact in facts:
        # Names remain Plain text, never CQ/At markup or a model instruction.
        name = " ".join(fact.display_name.split())[:128]
        label = _METRIC_LABELS.get(fact.metric, fact.metric)
        lines.append(
            f"{name} · {label}（{fact.metric}）：{_exact_decimal(fact.amount)} {fact.unit}"
            f" ≤ {_exact_decimal(fact.threshold)} {fact.unit}（预警阈值）"
        )
    lines.append("数据来自本次有效查询；请以供应商控制台为准。")
    return "\n".join(lines)


class AlertDelivery:
    """No automatic send retries: an exception can follow a real delivery."""

    def __init__(
        self,
        context: Any,
        *,
        component_factory: Callable | None = None,
        llm_timeout: float = 10.0,
        send_timeout: float = 15.0,
        session_enabled: Callable[[str], Awaitable[bool]] | None = None,
        session_llm_enabled: Callable[[str], Awaitable[bool]] | None = None,
        session_check_timeout: float = 3.0,
    ) -> None:
        self.context = context
        self.component_factory = component_factory
        self.llm_timeout = llm_timeout
        self.send_timeout = send_timeout
        self.session_enabled = session_enabled
        self.session_llm_enabled = session_llm_enabled
        self.session_check_timeout = session_check_timeout

    def validate_target(self, target: Any) -> bool:
        """Resolve the actual instance; names such as 'NapCat' prove nothing."""
        try:
            platform_id, kind, session = target.umo.split(":", 2)
            if (
                not platform_id
                or not session
                or kind not in {"FriendMessage", "GroupMessage", "OtherMessage"}
            ):
                return False
            instance = self.context.get_platform_inst(platform_id)
            if instance is None:
                return False
            meta = instance.meta()
            if meta.id != platform_id or meta.name == "qq_official":
                return False
            if target.mentions and (
                meta.name != "aiocqhttp"
                or kind != "GroupMessage"
                or not _QQ.fullmatch(session.split("_")[-1])
                or any(
                    not isinstance(qq, str) or not _QQ.fullmatch(qq)
                    for qq in target.mentions
                )
            ):
                return False
            return callable(getattr(self.context, "send_message", None))
        except Exception:
            return False

    @staticmethod
    async def _bounded(awaitable: Any, timeout: float) -> Any:
        # wait_for can exceed its deadline when a provider suppresses cancellation.
        task = asyncio.create_task(awaitable)
        task.add_done_callback(
            lambda result: None if result.cancelled() else result.exception()
        )
        try:
            done, _ = await asyncio.wait((task,), timeout=timeout)
            if task not in done:
                raise TimeoutError
            return task.result()
        finally:
            if not task.done():
                task.cancel()

    @staticmethod
    def _alive(active: Callable[[], bool]) -> bool:
        # A timed-out SDK coroutine may suppress cancellation. It must not
        # continue into another API call after its owning task was cancelled.
        task = asyncio.current_task()
        return active() and (task is None or task.cancelling() == 0)

    async def _session_allows(
        self, callback: Callable | None, umo: str, active: Callable[[], bool]
    ) -> bool:
        if callback is None or not self._alive(active):
            return False
        try:
            enabled = await self._bounded(callback(umo), self.session_check_timeout)
            return self._alive(active) and enabled is True
        except asyncio.CancelledError:
            raise
        except Exception:
            return False

    def _target_llm_settings(self, umo: str) -> tuple[Mapping, str]:
        config = self.context.get_config(umo=umo)
        if not isinstance(config, Mapping):
            return {}, "会话 AI 配置不可用，已用固定提醒"
        provider_settings = config.get("provider_settings", {})
        runner = config.get("agent_runner", {})
        if (
            not isinstance(provider_settings, Mapping)
            or provider_settings.get("enable", True) is not True
        ):
            return {}, "会话 AI 已关闭，已用固定提醒"
        if not isinstance(runner, Mapping) or runner.get("runner_type") != "local":
            return {}, "当前会话非本地 Agent，已用固定提醒"
        return provider_settings, ""

    async def _resolve_target_llm(
        self, target: Any, active: Callable[[], bool]
    ) -> tuple[tuple | None, str, str]:
        """Read host routing only, preserving exact UMO and host persona priority."""
        provider_settings, note = self._target_llm_settings(target.umo)
        if note:
            return None, "", note
        if not await self._session_allows(self.session_llm_enabled, target.umo, active):
            return None, "", "会话 AI 已关闭或状态不可用，已用固定提醒"
        if not self._alive(active):
            return None, "", ""
        provider_id = await self.context.get_current_chat_provider_id(target.umo)
        if not self._alive(active):
            return None, "", ""
        if not isinstance(provider_id, str) or not provider_id.strip():
            return None, "", "会话模型不可用，已用固定提醒"
        manager = self.context.conversation_manager
        conversation_id = await manager.get_curr_conversation_id(target.umo)
        if not self._alive(active):
            return None, "", ""
        conversation_persona_id = None
        if conversation_id:
            conversation = await manager.get_conversation(
                target.umo, conversation_id, create_if_not_exists=False
            )
            if not self._alive(active):
                return None, "", ""
            conversation_persona_id = getattr(conversation, "persona_id", None)
        if not self.validate_target(target) or not self._alive(active):
            return None, "", ""
        platform_name = (
            self.context.get_platform_inst(target.umo.split(":", 2)[0]).meta().name
        )
        (
            selected_id,
            persona,
            forced_id,
            webchat_special,
        ) = await self.context.persona_manager.resolve_selected_persona(
            umo=target.umo,
            conversation_persona_id=conversation_persona_id,
            platform_name=platform_name,
            provider_settings=provider_settings,
        )
        if not self._alive(active):
            return None, "", ""
        if webchat_special:
            return None, "", "会话使用专用 WebChat 人格，已用固定提醒"
        if persona is None:
            if selected_id not in (None, "[%None]"):
                return None, "", "会话人格不可用，已用固定提醒"
            full_prompt = ""
        elif isinstance(persona, Mapping) and isinstance(persona.get("prompt"), str):
            full_prompt = persona["prompt"]
        else:
            return None, "", "会话人格不可用，已用固定提醒"
        _, note = self._target_llm_settings(target.umo)
        if note:
            return None, "", note
        if not await self._session_allows(self.session_llm_enabled, target.umo, active):
            return None, "", "会话 AI 已关闭或状态不可用，已用固定提醒"
        if not self._alive(active):
            return None, "", ""
        if not await self._session_allows(self.session_enabled, target.umo, active):
            return None, "", "目标会话已停用或状态不可用，未调用 AI"
        if not self._alive(active):
            return None, "", ""
        # Fingerprint contains no account credentials, history or raw persona
        # text, and remains local to this attempt (never persisted or logged).
        signature = (
            provider_id,
            selected_id,
            forced_id,
            conversation_id,
            conversation_persona_id,
            platform_name,
            hashlib.sha256(full_prompt.encode()).hexdigest(),
        )
        return signature, full_prompt[:4000], ""

    async def _hint(
        self, target: Any, llm: Any, active: Callable[[], bool]
    ) -> tuple[str, str]:
        if not llm.enabled or not self._alive(active):
            return "", ""

        async def generate():
            signature, persona_prompt, note = await self._resolve_target_llm(
                target, active
            )
            if signature is None or not self._alive(active):
                return "", note
            # No balances, names, endpoints, recipients, credentials, history or
            # tools enter this request. Persona only selects controlled tone.
            response = await self.context.llm_generate(
                chat_provider_id=signature[0],
                prompt="为额度预警选择一句合适的提醒，只能原样返回下列一句：\n"
                + "\n".join(_HINTS),
                system_prompt=persona_prompt
                + "\n只选择给定短句，不输出解释、数字、链接、工具调用或其他文字。",
                contexts=[],
                tools=None,
            )
            if not self._alive(active):
                return "", ""
            current, _prompt, note = await self._resolve_target_llm(target, active)
            if not self._alive(active):
                return "", ""
            if current != signature:
                return "", note or "会话模型或人格已变更，已用固定提醒"
            content = getattr(response, "completion_text", "")
            hint = content.strip() if isinstance(content, str) else ""
            return (hint, "") if hint in _HINTS else ("", "AI 润色不可用，已用固定提醒")

        try:
            return await self._bounded(generate(), self.llm_timeout)
        except asyncio.CancelledError:
            raise
        except Exception:
            return "", "AI 润色不可用，已用固定提醒"

    async def deliver(
        self,
        target: Any,
        facts: tuple[AlertFact, ...],
        llm: Any,
        *,
        active: Callable[[], bool],
        reserve: Callable[[], bool],
    ) -> DeliveryResult:
        if not self._alive(active):
            return DeliveryResult("cancelled", "配置已变更或预警已停止")
        if not self.validate_target(target):
            return DeliveryResult("blocked", "目标平台未就绪或不支持该提及配置")
        allowed = await self._session_allows(self.session_enabled, target.umo, active)
        if not self._alive(active):
            return DeliveryResult("cancelled", "配置已变更或预警已停止")
        if not allowed:
            return DeliveryResult(
                "blocked", "目标会话已停用或状态不可用，未发送", "session_disabled"
            )
        hint, note = await self._hint(target, llm, active)
        if not self._alive(active) or not self.validate_target(target):
            return DeliveryResult("cancelled", "配置已变更或目标已不可用")
        try:
            message = self.component_factory(
                target.mentions, format_alert_facts(facts, hint)
            )
        except Exception:
            return DeliveryResult("blocked", "消息组件暂不可用")

        blocked, cancelled = object(), object()
        transport_started = False

        async def send():
            nonlocal transport_started
            if not self._alive(active):
                return cancelled
            allowed = await self._session_allows(
                self.session_enabled, target.umo, active
            )
            if not self._alive(active) or not self.validate_target(target):
                return cancelled
            if not allowed:
                return blocked
            # Durable reservation remains the final synchronous operation before
            # entering transport, after the last session/permission await.
            if not reserve():
                return cancelled
            transport_started = True
            return await self.context.send_message(target.umo, message)

        try:
            result = await self._bounded(send(), self.send_timeout)
        except asyncio.CancelledError:
            raise
        except Exception:
            if not transport_started:
                return DeliveryResult("blocked", "会话状态检查未完成，未发送")
            return DeliveryResult("unknown", "发送结果未知；为避免重复不自动重发")
        if result is blocked:
            return DeliveryResult(
                "blocked", "目标会话已停用或状态不可用，未发送", "session_disabled"
            )
        if result is cancelled:
            return DeliveryResult("cancelled", "配置已变更或发送预算暂不可用")
        if result is True:
            suffix = f"；{note}" if note else ""
            return DeliveryResult(
                "submitted",
                "已提交平台；不代表最终送达" + suffix,
                "fixed_hint" if note else "",
            )
        if result is False:
            return DeliveryResult("failed", "平台未接受发送；冷却后可重试")
        return DeliveryResult("unknown", "发送结果未知；为避免重复不自动重发")
