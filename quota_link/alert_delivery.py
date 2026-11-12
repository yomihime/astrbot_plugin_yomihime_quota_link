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

from .i18n import current_locale, message, render_text, tr, use_locale

_QQ = re.compile(r"[1-9][0-9]{0,19}\Z")
# Insertion order is the deterministic primary-reason priority for multiple targets.
BLOCKED_DETAILS = {
    "session_disabled": message("alert.delivery.session_disabled"),
    "session_check_failed": message("alert.delivery.session_check_failed"),
    "target_invalid": message("alert.delivery.target_invalid"),
    "platform_not_found": message("alert.delivery.platform_not_found"),
    "platform_unavailable": message("alert.delivery.platform_unavailable"),
    "platform_unsupported": message("alert.delivery.platform_unsupported"),
    "mention_unsupported": message("alert.delivery.mention_unsupported"),
    "mention_invalid": message("alert.delivery.mention_invalid"),
    "transport_unavailable": message("alert.delivery.transport_unavailable"),
    "message_components_unavailable": message(
        "alert.delivery.message_components_unavailable"
    ),
}
DELIVERY_DETAILS = {
    **BLOCKED_DETAILS,
    "fixed_hint": message("alert.delivery.fixed_hint"),
}

# These checks reduce factual/action leakage from the short introduction, rather
# than proving its semantics. Ordinary counts, nicknames, emoji and prose remain.
_LINK_OR_PAYLOAD = re.compile(
    r"(?:[a-z][a-z0-9+.-]*://|www\.|(?:https?|mailto|javascript|data):"
    r"|\b(?:[a-z0-9-]+\.)+[a-z]{2,63}\b|\[[^\]]*\]\s*\("
    r"|\[\s*cq\s*:|@(?:all|everyone|here|全体成员|全體成員|全員|\d+)\b"
    r"|<\s*/?\s*(?:tool_call|function_call|script)\b"
    r'|["\'](?:tool_calls?|function_call|tools_call_name)["\']\s*:)',
    re.IGNORECASE,
)
_NUMBER = (
    r"(?:[+-]?\d[\d.,]*(?:e[+-]?\d+)?|[零〇一二两兩三四五六七八九十百千万萬亿億]+)"
)
_VALUE = re.compile(
    _NUMBER + r"|\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten"
    r"|hundred|thousand|million|billion)\b",
    re.IGNORECASE,
)
_MONEY = re.compile(
    r"[¥￥$€£]|人民币|人民幣|美元|米ドル|欧元|歐元|ユーロ|日元|日圓|英镑|英鎊|港币|港幣|新台币|新臺幣"
    r"|\b(?:dollars?|yuan|yen|euros?|pounds?|credits?)\b"
    r"|(?<![a-z])(?:cny|usd|eur|jpy|gbp|hkd|cad|aud|twd|(?-i:[A-Z]{3}))(?![a-z])",
    re.IGNORECASE,
)
_SHORT_AMOUNT = re.compile(
    rf"{_NUMBER}\s*(?:元|円|ドル|块钱|塊錢|毛钱|毛錢|分钱|分錢|积分|積分|點數|ポイント|クレジット"
    r"|点额度|(?:块|塊|毛|分)(?=$|[\s，。！？!?;；]|啦|了|哦))"
)
_FINANCE_TERM = r"余额|餘額|残高|额度|額度|积分|積分|點數|阈值|門檻|しきい値|クォータ|クレジット|ポイント"
_FINANCE = re.compile(rf"{_FINANCE_TERM}|\b(?:balance|quota|credit|threshold)\b", re.I)
_FINANCE_STATE = re.compile(
    r"为负|為負|负数|負數|负值|負值|归零|歸零|为零|為零|小于零|等于零|零余额|零餘額|见底|見底"
    r"|耗[光尽盡]|用[光尽盡完]|欠费|欠費|已空|透支|マイナス|ゼロ|使い切|底をつ"
    r"|\b(?:negative|zero|empty|depleted|exhausted|overdrawn)\b",
    re.I,
)
_SERVICE = re.compile(
    r"服务|服務|接口|账户|帳戶|账号|帳號|アカウント|サービス|\b(?:service|account|api)\b",
    re.I,
)
_SERVICE_STATE = re.compile(
    r"停[服用止]|禁用|封禁|中断|中斷|不可用|已恢复|已恢復|利用でき|利用不可|無効|再開|復旧"
    r"|\b(?:unavailable|disabled|suspended|blocked|closed|restored|stopped)\b",
    re.I,
)
_PAYMENT = re.compile(
    r"充值|儲值|付款|支付|缴费|繳費|转账|轉帳|汇款|匯款|入金|支払い|振込|課金|チャージ"
    r"|\b(?:pay(?:ment|ing|s)?|paid|recharg(?:e|ed|ing)"
    r"|top[ -]?up|topp(?:ed|ing)\s+up|transfer\s+(?:money|funds))\b",
    re.I,
)
_UNIT_CLAIM = re.compile(
    r"(?:单位|單位|币种|幣別|単位|通貨)\s*(?:为|為|是|は|[:：=])|\b(?:currency|unit)\s*(?:is\b|[:=])",
    re.I,
)
_CONVERSATIONAL_NUMBER = re.compile(
    rf"(?:{_NUMBER}|\b(?:one|two|three)\b)\s*(?:分钟|秒钟|小时|次|眼|minutes?\b|seconds?\b|moments?\b)",
    re.I,
)
_WRITTEN_CLAIM = re.compile(
    rf"(?:{_FINANCE_TERM})\s*(?:还剩|還剩|还有|還有|仅剩|僅剩|只剩|剩余|剩餘|现有|現有|为|為|是|只有|仅有|僅有|约|約|は|[:：=])+\s*{_NUMBER}"
    rf"|(?:{_FINANCE_TERM})\s*[零〇一二两兩三四五六七八九]*[十百千万萬亿億][零〇一二两兩三四五六七八九十百千万萬亿億]*"
    r"|\b(?:is|equals|has|have|remaining|left)\s+(?:(?:now|just|only|about|approximately)\s+)*"
    r"(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand)\b",
    re.I,
)


_DEPLETION = re.compile(
    rf"(?:没有|沒有|已無|已无)(?:任何|剩餘|剩余)?(?:{_FINANCE_TERM})"
    rf"|(?:{_FINANCE_TERM})(?:が|は)\s*(?:残ってい(?:ない|ません)|な(?:い|くな)|ありません)"
)


def _has_financial_claim(text: str) -> bool:
    """Conservative checks for the supported languages, not a semantic proof.

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
                or _DEPLETION.search(values)
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
    "AvailableCashAmount": message("alert.metric.available_cash"),
    "AvailableAmount": message("alert.metric.available"),
    "CreditAmount": message("alert.metric.credit_amount"),
    "total_balance": message("alert.metric.total"),
    "granted_balance": message("alert.metric.granted"),
    "topped_up_balance": message("alert.metric.topped_up"),
    "credit": message("alert.metric.credit"),
    "site_credit": message("alert.metric.site_credit"),
    "mapped_balance": message("alert.metric.mapped"),
    "available_balance": message("provider.wallet.available_balance"),
    "posted_prepaid_balance": message("provider.xai.posted_balance"),
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
    lines = [tr("alert.fact.title")]
    if introduction := _safe_introduction(hint):
        lines.append(introduction)
    for fact in facts:
        # Names remain Plain text, never CQ/At markup or a model instruction.
        name = " ".join(fact.display_name.split())[:128]
        label = render_text(_METRIC_LABELS.get(fact.metric, fact.metric))
        lines.append(
            tr(
                "alert.fact.line",
                name=name,
                metric=label,
                amount=_exact_decimal(fact.amount),
                unit=fact.unit,
                threshold=_exact_decimal(fact.threshold),
            )
        )
    lines.append(tr("alert.fact.source"))
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
        locale: Callable[[], str] | None = None,
    ) -> None:
        self.context = context
        self.component_factory = component_factory
        self.llm_timeout = llm_timeout
        self.send_timeout = send_timeout
        self.session_enabled = session_enabled
        self.session_llm_enabled = session_llm_enabled
        self.session_check_timeout = session_check_timeout
        self._locale = locale

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
            if meta.name in {"qq_official", "qq_official_webhook"}:
                if kind not in {"FriendMessage", "GroupMessage"}:
                    return "platform_unsupported"
                if target.mentions:
                    return "mention_unsupported"
                # SDK Route interpolates IDs into paths: reject delimiters and
                # control characters instead of permitting path/query injection.
                if not re.fullmatch(r"[A-Za-z0-9_-]{1,257}", session):
                    return "target_invalid"
                if kind == "GroupMessage" and not session.rsplit("_", 1)[-1]:
                    return "target_invalid"
                # Use the resolved instance's SDK, not Context.send_message:
                # AstrBot can silently skip a group send yet return True.
                if self._official_sender(instance, kind) is None:
                    return "transport_unavailable"
                return ""
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
    def _official_sender(instance: Any, kind: str):
        client = (
            instance.get_client()
            if callable(getattr(instance, "get_client", None))
            else None
        )
        api = getattr(client, "api", None)
        name = "post_c2c_message" if kind == "FriendMessage" else "post_group_message"
        sender = getattr(api, name, None)
        return sender if callable(sender) else None

    async def _send_official(self, target: Any, text: str) -> bool | None:
        platform_id, kind, session = target.umo.split(":", 2)
        instance = self.context.get_platform_inst(platform_id)
        sender = self._official_sender(instance, kind)
        if sender is None:
            return False
        # AstrBot's official group UMO is either group_openid or, with
        # unique_session, sender_openid_group_openid. Mirror its adapter routing.
        # Private OpenIDs are never split or converted into group recipients.
        if kind == "GroupMessage":
            session = session.rsplit("_", 1)[-1]
        recipient = "openid" if kind == "FriendMessage" else "group_openid"
        result = await sender(**{recipient: session}, msg_type=0, content=text)
        # API acceptance, NOT proof of delivery/read. No retry or fallback send:
        # a timeout/missing receipt can follow a successful remote submission.
        receipt = (
            result.get("id")
            if isinstance(result, Mapping)
            else getattr(result, "id", None)
        )
        return True if isinstance(receipt, str) and receipt.strip() else None

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
            return {}, tr("alert.delivery.llm_config_unavailable")
        provider_settings = config.get("provider_settings", {})
        runner = config.get("agent_runner", {})
        if (
            not isinstance(provider_settings, Mapping)
            or provider_settings.get("enable", True) is not True
        ):
            return {}, tr("alert.delivery.llm_off")
        if not isinstance(runner, Mapping) or runner.get("runner_type") != "local":
            return {}, tr("alert.delivery.llm_nonlocal")
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
            return None, "", tr("alert.delivery.llm_session_unavailable")
        if not await self._session_allows(self.session_llm_enabled, target.umo, active):
            return None, "", tr("alert.delivery.llm_unavailable")
        if not self._alive(active):
            return None, "", ""
        provider_id = await self.context.get_current_chat_provider_id(target.umo)
        if not self._alive(active):
            return None, "", ""
        if not isinstance(provider_id, str) or not provider_id.strip():
            return None, "", tr("alert.delivery.llm_model_unavailable")
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
            return None, "", tr("alert.delivery.llm_webchat_persona")
        if persona is None:
            if selected_id not in (None, "[%None]"):
                return None, "", tr("alert.delivery.llm_persona_unavailable")
            full_prompt = ""
        elif isinstance(persona, Mapping) and isinstance(persona.get("prompt"), str):
            full_prompt = persona["prompt"]
        else:
            return None, "", tr("alert.delivery.llm_persona_unavailable")
        _, note = self._target_llm_settings(target.umo)
        if note:
            return None, "", note
        if not final:
            if not await self._session_allows(
                self.session_llm_enabled, target.umo, active
            ):
                return None, "", tr("alert.delivery.llm_unavailable")
            if not self._alive(active):
                return None, "", ""
            if not await self._session_allows(self.session_enabled, target.umo, active):
                return None, "", tr("alert.delivery.llm_not_called")
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
                )
                + "\n"
                + tr("alert.delivery.llm_language"),
                contexts=[],
                tools=None,
            )
            if not self._alive(active):
                return "", "", None
            current, _prompt, note = await self._resolve_target_llm(target, active)
            if not self._alive(active):
                return "", "", None
            if current != signature:
                return "", note or tr("alert.delivery.llm_changed"), None
            if getattr(response, "role", "assistant") != "assistant" or any(
                getattr(response, key, None)
                for key in ("tools_call_name", "tools_call_args", "tool_calls")
            ):
                return "", tr("alert.delivery.llm_failed"), None
            content = getattr(response, "completion_text", "")
            hint = _safe_introduction(content)
            return (
                (hint, "", signature)
                if hint
                else ("", tr("alert.delivery.llm_failed"), None)
            )

        try:
            return await self._bounded(generate(), self.llm_timeout)
        except asyncio.CancelledError:
            raise
        except Exception:
            return "", tr("alert.delivery.llm_failed"), None

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
            return DeliveryResult("cancelled", tr("alert.delivery.cancelled"))
        if reason := self._target_reason(target):
            return self._blocked(reason)
        allowed = await self._session_state(self.session_enabled, target.umo, active)
        if not self._alive(active):
            return DeliveryResult("cancelled", tr("alert.delivery.cancelled"))
        if allowed is not True:
            return self._blocked(
                "session_disabled" if allowed is False else "session_check_failed"
            )
        hint_locale = self._locale() if self._locale is not None else current_locale()
        with use_locale(hint_locale):
            hint, note, signature = await self._hint(target, llm, active)
        if not self._alive(active):
            return DeliveryResult("cancelled", tr("alert.delivery.cancelled"))
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
                    current, latest_note = None, tr("alert.delivery.llm_failed")
                if not self._alive(active):
                    return cancelled
                if current != signature:
                    hint = ""
                    note = latest_note or tr("alert.delivery.llm_changed")
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
                        latest_note = tr("alert.delivery.llm_config_unavailable")
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
                locale = self._locale() if self._locale is not None else hint_locale
                with use_locale(locale):
                    if hint and locale != hint_locale:
                        hint, note = "", tr("alert.delivery.llm_locale_changed")
                    text = format_alert_facts(facts, hint)
                outbound = self.component_factory(target.mentions, text)
            except Exception:
                return self._blocked("message_components_unavailable")
            # Durable reservation remains the final synchronous operation before
            # entering transport, after the last session/permission await.
            if not reserve():
                return cancelled
            transport_started = True
            instance = self.context.get_platform_inst(target.umo.split(":", 2)[0])
            if instance.meta().name in {"qq_official", "qq_official_webhook"}:
                return await self._send_official(target, text)
            return await self.context.send_message(target.umo, outbound)

        try:
            result = await self._bounded(send(), self.send_timeout)
        except asyncio.CancelledError:
            raise
        except Exception:
            if not transport_started:
                return self._blocked("session_check_failed")
            return DeliveryResult("unknown", tr("alert.delivery.unknown"))
        if isinstance(result, DeliveryResult):
            return result
        if result is cancelled:
            return DeliveryResult("cancelled", tr("alert.delivery.budget"))
        if result is True:
            suffix = tr("alert.delivery.note_suffix", note=note) if note else ""
            return DeliveryResult(
                "submitted",
                tr("alert.delivery.submitted") + suffix,
                "fixed_hint" if note else "",
            )
        if result is False:
            return DeliveryResult("failed", tr("alert.delivery.failed"))
        return DeliveryResult("unknown", tr("alert.delivery.unknown"))
