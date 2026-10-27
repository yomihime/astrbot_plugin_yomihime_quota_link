"""Bounded AstrBot delivery; models can select tone, never facts or recipients."""

from __future__ import annotations

import asyncio
import re
from collections.abc import Callable
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
    ) -> None:
        self.context = context
        self.component_factory = component_factory
        self.llm_timeout = llm_timeout
        self.send_timeout = send_timeout

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

    async def _hint(self, target: Any, llm: Any, active: Callable[[], bool]) -> str:
        if not llm.enabled or not active():
            return ""

        async def generate():
            provider_id = llm.provider_id
            if not provider_id:
                if not active():
                    return ""
                provider_id = await self.context.get_current_chat_provider_id(
                    target.umo
                )
            if not provider_id or not active():
                return ""
            persona_prompt = ""
            if llm.persona_id:
                persona = await self.context.persona_manager.get_persona(llm.persona_id)
                if not active():
                    return ""
                persona_prompt = str(getattr(persona, "system_prompt", ""))[:4000]
            # No balances, account names, endpoints, recipients, keys or history
            # enter this request. A persona can affect tone only, not facts.
            response = await self.context.llm_generate(
                chat_provider_id=provider_id,
                prompt="为额度预警选择一句合适的提醒，只能原样返回下列一句：\n"
                + "\n".join(_HINTS),
                system_prompt=(
                    "只选择给定短句，不输出解释、数字、链接、工具调用或其他文字。\n"
                    + persona_prompt
                ),
                contexts=[],
                tools=None,
            )
            if not active():
                return ""
            content = getattr(response, "completion_text", "")
            return content.strip() if isinstance(content, str) else ""

        try:
            hint = await self._bounded(generate(), self.llm_timeout)
            return hint if hint in _HINTS else ""
        except asyncio.CancelledError:
            raise
        except Exception:
            return ""

    async def deliver(
        self,
        target: Any,
        facts: tuple[AlertFact, ...],
        llm: Any,
        *,
        active: Callable[[], bool],
        reserve: Callable[[], bool],
    ) -> DeliveryResult:
        if not active():
            return DeliveryResult("cancelled", "配置已变更或预警已停止")
        if not self.validate_target(target):
            return DeliveryResult("blocked", "目标平台未就绪或不支持该提及配置")
        hint = await self._hint(target, llm, active)
        if not active() or not self.validate_target(target):
            return DeliveryResult("cancelled", "配置已变更或目标已不可用")
        try:
            message = self.component_factory(
                target.mentions, format_alert_facts(facts, hint)
            )
        except Exception:
            return DeliveryResult("blocked", "消息组件暂不可用")
        # Durable reservation is the final operation before entering transport.
        if not active() or not reserve():
            return DeliveryResult("cancelled", "配置已变更或发送预算暂不可用")

        async def send():
            if not active():
                return None
            return await self.context.send_message(target.umo, message)

        try:
            result = await self._bounded(send(), self.send_timeout)
        except asyncio.CancelledError:
            raise
        except Exception:
            return DeliveryResult("unknown", "发送结果未知；为避免重复不自动重发")
        if result is True:
            return DeliveryResult("submitted", "已提交平台；不代表最终送达")
        if result is False:
            return DeliveryResult("failed", "平台未接受发送；冷却后可重试")
        return DeliveryResult("unknown", "发送结果未知；为避免重复不自动重发")
