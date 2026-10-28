"""Untrusted model introductions; program-owned fact blocks and bounded delivery."""

from __future__ import annotations

import asyncio
import hashlib
import re
import unicodedata
from collections.abc import Awaitable, Callable, Mapping
from dataclasses import dataclass
from decimal import Decimal
from typing import Any

_QQ = re.compile(r"[1-9][0-9]{0,19}\Z")
# Insertion order is the deterministic primary-reason priority for multiple targets.
BLOCKED_DETAILS = {
    "session_disabled": "目标会话已停用；请在 AstrBot 中启用该会话后等待下次检查",
    "session_check_failed": "无法确认目标会话状态；请检查 AstrBot 会话状态接口",
    "target_invalid": "目标 UMO 格式无效；请重新选择或填写完整会话标识",
    "platform_not_found": "目标平台实例未找到；请核对 UMO 中的平台实例 ID",
    "platform_unavailable": "目标平台实例状态不可用；请检查适配器是否正常运行",
    "platform_unsupported": "目标平台不支持此主动发送接口；请更换支持的目标平台",
    "mention_unsupported": "目标适配器或会话类型不支持 QQ 提及；请移除 @ 或使用 aiocqhttp 群目标",
    "mention_invalid": "群目标或提及 QQ 号格式无效；请核对群会话标识和数字 QQ 号",
    "transport_unavailable": "宿主主动发送接口不可用；请检查 AstrBot 版本及平台适配器",
    "message_components_unavailable": "消息组件构造失败；请检查 AstrBot 消息组件接口",
}
DELIVERY_DETAILS = {
    **BLOCKED_DETAILS,
    "fixed_hint": "会话 AI 不可用或输出未通过检查；已使用固定提示和精确事实",
}

# These checks reduce factual/action leakage from the short introduction, rather
# than proving its semantics. Ordinary counts, nicknames, emoji and prose remain.
_LINK_OR_PAYLOAD = re.compile(
    r"(?:[a-z][a-z0-9+.-]*://|www\.|(?:https?|mailto|javascript|data):"
    r"|\b(?:[a-z0-9-]+\.)+[a-z]{2,63}\b|\[[^\]]*\]\s*\("
    r"|\[\s*cq\s*:|@(?:all|everyone|here|全体成员|\d+)\b"
    r"|<\s*/?\s*(?:tool_call|function_call|script)\b"
    r'|["\'](?:tool_calls?|function_call|tools_call_name)["\']\s*:)',
    re.IGNORECASE,
)
_NUMBER = r"(?:[+-]?\d[\d.,]*(?:e[+-]?\d+)?|[零〇一二两三四五六七八九十百千万亿]+)"
_VALUE = re.compile(
    _NUMBER + r"|\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten"
    r"|hundred|thousand|million|billion)\b",
    re.IGNORECASE,
)
_MONEY = re.compile(
    r"[¥￥$€£]|人民币|美元|欧元|日元|英镑|港币|新台币"
    r"|\b(?:dollars?|yuan|yen|euros?|pounds?|credits?)\b"
    r"|(?<![a-z])(?:cny|usd|eur|jpy|gbp|hkd|cad|aud|twd|(?-i:[A-Z]{3}))(?![a-z])",
    re.IGNORECASE,
)
_SHORT_AMOUNT = re.compile(
    rf"{_NUMBER}\s*(?:元|块钱|毛钱|分钱|积分|点额度|(?:块|毛|分)(?=$|[\s，。！？!?;；]|啦|了|哦))"
)
_FINANCE = re.compile(
    r"余额|额度|积分|阈值|\b(?:balance|quota|credit|threshold)\b", re.I
)
_FINANCE_STATE = re.compile(
    r"为负|负数|负值|归零|为零|小于零|等于零|零余额|见底|耗[光尽]|用[光尽完]|欠费|已空|透支"
    r"|\b(?:negative|zero|empty|depleted|exhausted|overdrawn)\b",
    re.I,
)
_SERVICE = re.compile(r"服务|接口|账户|账号|\b(?:service|account|api)\b", re.I)
_SERVICE_STATE = re.compile(
    r"停[服用止]|禁用|封禁|中断|不可用|已恢复"
    r"|\b(?:unavailable|disabled|suspended|blocked|closed|restored|stopped)\b",
    re.I,
)
_PAYMENT = re.compile(
    r"充值|付款|支付|缴费|转账|汇款|\b(?:pay(?:ment|ing|s)?|paid|recharg(?:e|ed|ing)"
    r"|top[ -]?up|topp(?:ed|ing)\s+up|transfer\s+(?:money|funds))\b",
    re.I,
)
_UNIT_CLAIM = re.compile(
    r"(?:单位|币种)\s*(?:为|是|[:：=])|\b(?:currency|unit)\s*(?:is\b|[:=])", re.I
)
_CONVERSATIONAL_NUMBER = re.compile(
    rf"(?:{_NUMBER}|\b(?:one|two|three)\b)\s*(?:分钟|秒钟|小时|次|眼|minutes?\b|seconds?\b|moments?\b)",
    re.I,
)
_WRITTEN_CLAIM = re.compile(
    rf"(?:余额|额度|积分|阈值)\s*(?:还剩|还有|仅剩|只剩|剩余|现有|为|是|只有|仅有|约|[:：=])+\s*{_NUMBER}"
    r"|(?:余额|额度|积分|阈值)\s*[零〇一二两三四五六七八九]*[十百千万亿][零〇一二两三四五六七八九十百千万亿]*"
    r"|\b(?:is|equals|has|have|remaining|left)\s+(?:(?:now|just|only|about|approximately)\s+)*"
    r"(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand)\b",
    re.I,
)


def _has_financial_claim(text: str) -> bool:
    """Conservative zh/en domain checks, not a general semantic correctness proof.

    The model's job is a social introduction, not financial/payment advice. Check
    categories within clauses so intervening qualifiers cannot hide an amount or
    status, while ordinary conversational counts and conditional '额度一低' survive.
    """
    # 'Pay attention' is an ordinary invitation, not a financial operation.
    without_attention = re.sub(
        r"\b(?:pay(?:ing)?|paid)\s+attention\b", "", text, flags=re.I
    )
    if _PAYMENT.search(without_attention) or _UNIT_CLAIM.search(text):
        return True
    for clause in re.split(r"[。!?！？;；\n]|(?<!\d)[,.，](?!\d)", text):
        if _SHORT_AMOUNT.search(clause):
            return True
        values = _CONVERSATIONAL_NUMBER.sub("", clause)
        if _VALUE.search(values) and _MONEY.search(values):
            return True
        if _FINANCE.search(clause):
            # Chinese numeral glyphs are also ordinary prose ('一定', '一栏').
            # Require a value construction, rather than treating every 一 as money.
            if (
                re.search(r"\d", values)
                or _WRITTEN_CLAIM.search(values)
                or _FINANCE_STATE.search(clause)
            ):
                return True
        if _SERVICE.search(clause) and (
            _SERVICE_STATE.search(clause) or _FINANCE_STATE.search(clause)
        ):
            return True
    return False


def _safe_introduction(content: Any) -> str:
    """Accept bounded plain prose without interpreting markup or model actions."""
    if not isinstance(content, str) or not content.strip() or len(content) > 160:
        return ""
    if any(
        unicodedata.category(char) in {"Cc", "Cs", "Cf"} and char not in "\n\r\t\u200d"
        for char in content
    ):
        return ""
    checked = unicodedata.normalize("NFKC", content)
    if _LINK_OR_PAYLOAD.search(checked) or _has_financial_claim(checked):
        return ""
    return " ".join(content.split())


_METRIC_LABELS = {
    "AvailableCashAmount": "现金余额",
    "AvailableAmount": "可用额度",
    "CreditAmount": "信用额度",
    "total_balance": "总余额",
    "granted_balance": "赠送余额",
    "topped_up_balance": "充值余额",
    "credit": "积分余额",
    "site_credit": "站内额度",
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
        if not isinstance(self.reason_code, str) or (
            self.reason_code and self.reason_code not in DELIVERY_DETAILS
        ):
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
    """Build the authoritative fact block exclusively from program data."""
    lines = ["【额度预警】"]
    if introduction := _safe_introduction(hint):
        lines.append(introduction)
    for fact in facts:
        # Names remain Plain text, never CQ/At markup or a model instruction.
        name = " ".join(fact.display_name.split())[:128]
        label = _METRIC_LABELS.get(fact.metric, fact.metric)
        lines.append(
            f"{name} · {label}：{_exact_decimal(fact.amount)} {fact.unit}"
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
        session_enabled: Callable[[str], Awaitable[bool | None]] | None = None,
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
        return not self._target_reason(target)

    def _target_reason(self, target: Any) -> str:
        try:
            platform_id, kind, session = target.umo.split(":", 2)
            if (
                not platform_id
                or not session
                or kind not in {"FriendMessage", "GroupMessage", "OtherMessage"}
            ):
                return "target_invalid"
        except (AttributeError, TypeError, ValueError):
            return "target_invalid"
        try:
            instance = self.context.get_platform_inst(platform_id)
            if instance is None:
                return "platform_not_found"
            meta = instance.meta()
            if meta.id != platform_id:
                return "platform_unavailable"
            if meta.name == "qq_official":
                return "platform_unsupported"
            if target.mentions:
                if meta.name != "aiocqhttp" or kind != "GroupMessage":
                    return "mention_unsupported"
                if not _QQ.fullmatch(session.split("_")[-1]) or any(
                    not isinstance(qq, str) or not _QQ.fullmatch(qq)
                    for qq in target.mentions
                ):
                    return "mention_invalid"
            return (
                ""
                if callable(getattr(self.context, "send_message", None))
                else "transport_unavailable"
            )
        except Exception:
            return "platform_unavailable"

    @staticmethod
    def _blocked(reason: str) -> DeliveryResult:
        return DeliveryResult("blocked", BLOCKED_DETAILS[reason], reason)

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
        return await self._session_state(callback, umo, active) is True

    async def _session_state(
        self, callback: Callable | None, umo: str, active: Callable[[], bool]
    ) -> bool | None:
        if callback is None or not self._alive(active):
            return None
        try:
            enabled = await self._bounded(callback(umo), self.session_check_timeout)
            return enabled if self._alive(active) and type(enabled) is bool else None
        except asyncio.CancelledError:
            raise
        except Exception:
            return None

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
        self, target: Any, active: Callable[[], bool], *, final: bool = False
    ) -> tuple[tuple | None, str, str]:
        """Read host routing only, preserving exact UMO and host persona priority."""
        provider_settings, note = self._target_llm_settings(target.umo)
        if note:
            return None, "", note
        # Final mode places permission awaits before the routing reads. There
        # is no host versioned snapshot/lock: async host mutations during those
        # reads cannot be made atomic by repeatedly awaiting the same switches.
        if final and not await self._session_allows(
            self.session_enabled, target.umo, active
        ):
            return None, "", "目标会话已停用或状态不可用，未使用 AI 引言"
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
        if not final:
            if not await self._session_allows(
                self.session_llm_enabled, target.umo, active
            ):
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
    ) -> tuple[str, str, tuple | None]:
        if not llm.enabled or not self._alive(active):
            return "", "", None

        async def generate():
            signature, persona_prompt, note = await self._resolve_target_llm(
                target, active
            )
            if signature is None or not self._alive(active):
                return "", note, None
            # No balances, names, endpoints, recipients, credentials, history or
            # tools enter this request. The model writes only the introduction.
            response = await self.context.llm_generate(
                chat_provider_id=signature[0],
                prompt=(
                    "请按当前人格的语气，主动写一段简短自然的招呼或提醒引言。"
                    "可以使用符合人格的称呼、情绪和表情，不必套用固定句式。"
                    "提醒对方留意下方的额度明细、按需安排使用即可。"
                    "仅返回一至两句纯文本，最多160字；不要解释创作过程。"
                ),
                system_prompt=persona_prompt
                + (
                    "\n你正在撰写通知引言，不是执行对话任务。"
                    "账户、余额、单位、阈值由程序在下方独立补充，以该事实块为准；"
                    "仅作自然引言，不得断言财务数值、币种、正负或零余额、额度耗尽、"
                    "账户及服务可用性；也不要把付款作为继续使用的先决条件。"
                    "不要提供充值链接、支付操作、@提及、CQ代码或工具调用，"
                    "不要声称已经充值、付款或执行其他操作。"
                ),
                contexts=[],
                tools=None,
            )
            if not self._alive(active):
                return "", "", None
            current, _prompt, note = await self._resolve_target_llm(target, active)
            if not self._alive(active):
                return "", "", None
            if current != signature:
                return "", note or "会话模型或人格已变更，已用固定提醒", None
            if getattr(response, "role", "assistant") != "assistant" or any(
                getattr(response, key, None)
                for key in ("tools_call_name", "tools_call_args", "tool_calls")
            ):
                return "", "AI 润色不可用，已用固定提醒", None
            content = getattr(response, "completion_text", "")
            hint = _safe_introduction(content)
            return (
                (hint, "", signature)
                if hint
                else ("", "AI 润色不可用，已用固定提醒", None)
            )

        try:
            return await self._bounded(generate(), self.llm_timeout)
        except asyncio.CancelledError:
            raise
        except Exception:
            return "", "AI 润色不可用，已用固定提醒", None

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
        if reason := self._target_reason(target):
            return self._blocked(reason)
        allowed = await self._session_state(self.session_enabled, target.umo, active)
        if not self._alive(active):
            return DeliveryResult("cancelled", "配置已变更或预警已停止")
        if allowed is not True:
            return self._blocked(
                "session_disabled" if allowed is False else "session_check_failed"
            )
        hint, note, signature = await self._hint(target, llm, active)
        if not self._alive(active):
            return DeliveryResult("cancelled", "配置已变更或预警已停止")
        if reason := self._target_reason(target):
            return self._blocked(reason)
        cancelled = object()
        transport_started = False

        async def send():
            nonlocal transport_started, hint, note
            if not self._alive(active):
                return cancelled
            allowed = await self._session_state(
                self.session_enabled, target.umo, active
            )
            if not self._alive(active):
                return cancelled
            if reason := self._target_reason(target):
                return self._blocked(reason)
            if allowed is not True:
                return self._blocked(
                    "session_disabled" if allowed is False else "session_check_failed"
                )
            if hint:
                # Re-read after the preceding permission await. Rebuilding below is
                # synchronous; no extra model call or automatic resend occurs.
                try:
                    current, _, latest_note = await self._bounded(
                        self._resolve_target_llm(target, active, final=True),
                        self.llm_timeout,
                    )
                except asyncio.CancelledError:
                    raise
                except Exception:
                    current, latest_note = None, "AI 润色不可用，已用固定提醒"
                if not self._alive(active):
                    return cancelled
                if current != signature:
                    hint = ""
                    note = latest_note or "会话模型或人格已变更，已用固定提醒"
                # Sending permission wins over tone consistency. A session may
                # have been disabled during the read-only routing awaits above.
                # This is one final hard gate, not an unbounded recheck loop.
                allowed = await self._session_state(
                    self.session_enabled, target.umo, active
                )
                if not self._alive(active):
                    return cancelled
                if allowed is not True:
                    return self._blocked(
                        "session_disabled"
                        if allowed is False
                        else "session_check_failed"
                    )
                if hint:
                    try:
                        _, latest_note = self._target_llm_settings(target.umo)
                    except Exception:
                        latest_note = "会话 AI 配置不可用，已用固定提醒"
                    if latest_note:
                        hint, note = "", latest_note
                # Host routing/persona/session-AI have no atomic public snapshot.
                # Concurrent changes not observable through this final sync
                # config read remain a host TOCTOU limit; never retry a send.
            if not self._alive(active):
                return cancelled
            if reason := self._target_reason(target):
                return self._blocked(reason)
            try:
                message = self.component_factory(
                    target.mentions, format_alert_facts(facts, hint)
                )
            except Exception:
                return self._blocked("message_components_unavailable")
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
                return self._blocked("session_check_failed")
            return DeliveryResult("unknown", "发送结果未知；为避免重复不自动重发")
        if isinstance(result, DeliveryResult):
            return result
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
