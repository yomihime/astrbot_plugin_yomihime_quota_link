"""Validated persona notices, program-owned facts and bounded delivery."""

from __future__ import annotations

import asyncio
import copy
import hashlib
import json
import re
from collections.abc import Awaitable, Callable, Mapping
from dataclasses import dataclass
from decimal import Decimal
from typing import Any

import httpx

from .alert_config import (
    OFFICIAL_ADAPTERS,
    OFFICIAL_TARGET_SCENES,
    official_recipient,
)
from .alert_notice import render_notice, template_prompt
from .i18n import current_locale, message, tr, use_locale

_QQ = re.compile(r"[1-9][0-9]{0,19}\Z")
_OFFICIAL_SESSION = re.compile(r"[A-Za-z0-9_-]{1,257}\Z")
# Insertion order is the deterministic primary-reason priority for multiple targets.
BLOCKED_DETAILS = {
    "session_disabled": message("alert.delivery.session_disabled"),
    "session_check_failed": message("alert.delivery.session_check_failed"),
    "target_invalid": message("alert.delivery.target_invalid"),
    "platform_not_found": message("alert.delivery.platform_not_found"),
    "platform_unavailable": message("alert.delivery.platform_unavailable"),
    "platform_unsupported": message("alert.delivery.platform_unsupported"),
    "target_scene_required": message("alert.delivery.target_scene_required"),
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
    "legacy_target_unknown": message("alert.delivery.legacy_target_unknown"),
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
class _PersonaInput:
    prompt: str
    contexts: list[dict]


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


def format_alert_facts(facts: tuple[AlertFact, ...]) -> str:
    """Build one merged fallback with only account names and balances."""
    lines = [tr("alert.fact.title")]
    lines.extend(tr("alert.fact.line", **row) for row in _notice_rows(facts))
    return "\n".join(lines)


def _notice_rows(facts: tuple[AlertFact, ...]) -> tuple[dict[str, str], ...]:
    """Keep actual account data local, including the original exact units."""
    return tuple(
        {
            "name": " ".join(fact.display_name.split()),
            "balance": f"{_exact_decimal(fact.amount)} {fact.unit}",
        }
        for fact in facts
    )


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
        return self._resolve_target(target)[0]

    def _resolve_target(self, target: Any) -> tuple[str, Any]:
        try:
            platform_id, kind, session = target.umo.split(":", 2)
            if (
                not platform_id
                or not session
                or kind not in {"FriendMessage", "GroupMessage", "OtherMessage"}
            ):
                return "target_invalid", None
        except (AttributeError, TypeError, ValueError):
            return "target_invalid", None
        try:
            instance = self.context.get_platform_inst(platform_id)
            if instance is None:
                return "platform_not_found", None
            meta = instance.meta()
            if meta.id != platform_id:
                return "platform_unavailable", None
            if meta.name in OFFICIAL_ADAPTERS:
                if kind not in {"FriendMessage", "GroupMessage"}:
                    return "platform_unsupported", None
                if target.mentions:
                    return "mention_unsupported", None
                # SDK Route interpolates IDs into paths: reject delimiters and
                # control characters instead of permitting path/query injection.
                recipient = official_recipient(kind, session)
                if not _OFFICIAL_SESSION.fullmatch(session) or not recipient:
                    return "target_invalid", None
                scene = target.scene
                if scene is None:
                    return "target_scene_required", None
                if OFFICIAL_TARGET_SCENES.get(scene) != kind:
                    return "platform_unsupported", None
                scenes = getattr(instance, "_session_scene", {})
                if any(
                    scenes.get(value) == "channel" for value in (session, recipient)
                ):
                    return "platform_unsupported", None
                transport = self._official_transport(instance)
                if transport is None:
                    return "transport_unavailable", None
                return "", (transport, kind, recipient)
            if target.scene is not None:
                return "platform_unsupported", None
            if target.mentions:
                if meta.name != "aiocqhttp" or kind != "GroupMessage":
                    return "mention_unsupported", None
                if not _QQ.fullmatch(session.split("_")[-1]) or any(
                    not isinstance(qq, str) or not _QQ.fullmatch(qq)
                    for qq in target.mentions
                ):
                    return "mention_invalid", None
            return (
                ""
                if callable(getattr(self.context, "send_message", None))
                else "transport_unavailable",
                None,
            )
        except Exception:
            return "platform_unavailable", None

    def official_target_identity(self, target: Any) -> tuple[str, str, str, str] | None:
        """The recipient of both current and legacy official group UMOs."""
        try:
            platform_id, kind, session = target.umo.split(":", 2)
            if kind not in OFFICIAL_TARGET_SCENES.values():
                return None
            recipient = official_recipient(kind, session)
            if not _OFFICIAL_SESSION.fullmatch(session) or not recipient:
                return None
            meta = self.context.get_platform_inst(platform_id).meta()
            if meta.id == platform_id and meta.name in OFFICIAL_ADAPTERS:
                return meta.name, platform_id, kind, recipient
        except Exception:
            pass
        return None

    @staticmethod
    def _official_transport(instance: Any):
        try:
            transport = instance.get_client().http
            # Reuse the selected adapter's live authentication, not a package
            # version or its message-request retry implementation.
            if not callable(getattr(transport, "check_session", None)):
                return None
            if type(getattr(transport, "is_sandbox", None)) is not bool:
                return None
        except Exception:
            return None
        return transport

    @staticmethod
    def _official_headers(transport: Any) -> dict[str, str]:
        raw_headers = transport._headers
        if not isinstance(raw_headers, Mapping):
            raise ValueError
        headers = {}
        for key, value in raw_headers.items():
            if not isinstance(key, str):
                continue
            name = key.lower()
            if name not in {"authorization", "x-union-appid"}:
                continue
            if (
                name in headers
                or not isinstance(value, str)
                or not value.strip()
                or len(value) > 8192
                or any(not 32 <= ord(char) < 127 for char in value)
            ):
                raise ValueError
            headers[name] = value
        if set(headers) != {"authorization", "x-union-appid"}:
            raise ValueError
        authorization = headers["authorization"]
        scheme, separator, credential = authorization.partition(" ")
        if (
            scheme not in {"QQBot", "Bot"}
            or not separator
            or not credential
            or credential.lower() in {"none", "null", "undefined"}
            or any(char.isspace() for char in credential)
            or any(char.isspace() for char in headers["x-union-appid"])
        ):
            raise ValueError
        return headers

    @staticmethod
    async def _prepare_official(transport: Any):
        # Authentication may refresh a token, but must never submit a message.
        # A missing/changed auth interface is detected locally, without probing
        # a recipient or asking the user to inspect the Host's dependencies.
        await transport.check_session()
        sandbox = transport.is_sandbox
        if type(sandbox) is not bool:
            raise ValueError
        return sandbox, AlertDelivery._official_headers(transport)

    def official_diagnostics(self, targets: tuple) -> dict[str, Any] | None:
        """Read current capabilities without refreshing auth or sending anything."""
        rows = []
        for target in targets:
            if self.official_target_identity(target) is None:
                continue
            reason, _ = self._resolve_target(target)
            transport = None
            authenticated = False
            try:
                platform_id = target.umo.split(":", 1)[0]
                transport = self._official_transport(
                    self.context.get_platform_inst(platform_id)
                )
                if transport is not None:
                    self._official_headers(transport)
                    authenticated = True
            except Exception:
                pass
            rows.append(
                {
                    "target_id": target.id,
                    "transport_available": transport is not None,
                    "cached_auth_headers_available": authenticated,
                    "detail_code": reason,
                }
            )
        if not rows:
            return None
        try:
            from importlib.metadata import version

            sdk_version = version("qq-botpy")
        except Exception:
            sdk_version = None
        # Version is informational only; it is never a compatibility gate.
        return {"sdk_version": sdk_version, "targets": rows}

    @staticmethod
    async def _send_official(kind: str, recipient: str, text: str, *, auth: tuple):
        sandbox, headers = auth
        headers = {**headers, "accept-encoding": "identity"}
        path = "/v2/users" if kind == "FriendMessage" else "/v2/groups"
        host = "sandbox.api.sgroup.qq.com" if sandbox else "api.bot.qq.com"
        # The plugin owns the complete message POST boundary. No SDK retry
        # options, shared-session mutation, redirects, proxy env or fallback.
        # Use the transport directly: AsyncClient logs full recipient URLs at
        # INFO. No global logger settings or shared Host clients are changed.
        async with httpx.AsyncHTTPTransport(retries=0, trust_env=False) as outbound:
            request = httpx.Request(
                "POST",
                f"https://{host}{path}/{recipient}/messages",
                headers=headers,
                json={"msg_type": 0, "content": text},
                extensions={
                    "timeout": {
                        "connect": 10.0,
                        "read": 10.0,
                        "write": 10.0,
                        "pool": 10.0,
                    }
                },
            )
            response = await outbound.handle_async_request(request)
            try:
                if response.status_code in {401, 403, 404, 405, 429}:
                    return False
                if response.status_code not in {200, 201, 202}:
                    return None
                if response.headers.get("content-encoding", "identity").lower() not in {
                    "identity",
                    "",
                }:
                    return None
                body = bytearray()
                async for chunk in response.aiter_raw():
                    if len(body) + len(chunk) > 65536:
                        return None
                    body.extend(chunk)
                try:
                    result = json.loads(body)
                except (ValueError, UnicodeError):
                    return None
            finally:
                await response.aclose()
        # API acceptance, NOT proof of delivery/read. No retry or fallback send:
        # a timeout/missing receipt can follow a successful remote submission.
        if not isinstance(result, Mapping) or any(
            result.get(key) not in (None, 0, "0") for key in ("code", "err_code")
        ):
            return None
        receipt = result.get("id")
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
            # local is AstrBot's built-in executor, including cloud models.
            # Other executors select remote applications, not a chat Provider;
            # get_current_chat_provider_id would fall back to an unrelated one.
            return {}, tr("alert.delivery.llm_nonlocal")
        return provider_settings, ""

    async def _conversation_persona_id(
        self, manager: Any, umo: str, conversation_id: str, active: Callable[[], bool]
    ) -> str | None:
        # get_conversation loads and serializes real chat history. Use the
        # host's metadata-only projection instead, without searching content.
        page = 1
        while self._alive(active):
            conversations, total = await manager.get_filtered_conversations(
                page=page, page_size=100, umo_query=umo, include_history=False
            )
            if not self._alive(active):
                return None
            for conversation in conversations:
                if conversation.cid == conversation_id and conversation.user_id == umo:
                    return conversation.persona_id
            if not conversations or page * 100 >= total:
                return None
            page += 1
        return None

    def _model_signature(self, provider_id: str) -> tuple:
        # Provider ID alone does not detect /model switches or replacement of
        # a provider instance under the same ID. No credentials enter this key.
        getter = getattr(self.context, "get_provider_by_id", None)
        if getter is None:
            return ()
        provider = getter(provider_id)
        if provider is None:
            raise ValueError("chat provider unavailable")
        return (id(provider), provider.get_model())

    async def _resolve_target_llm(
        self, target: Any, active: Callable[[], bool], *, final: bool = False
    ) -> tuple[tuple | None, _PersonaInput | str, str]:
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
        model_signature = self._model_signature(provider_id)
        runner_signature = hashlib.sha256(
            json.dumps(
                self.context.get_config(umo=target.umo).get("agent_runner"),
                sort_keys=True,
                ensure_ascii=False,
            ).encode()
        ).hexdigest()
        manager = self.context.conversation_manager
        conversation_id = await manager.get_curr_conversation_id(target.umo)
        if not self._alive(active):
            return None, "", ""
        conversation_persona_id = None
        if conversation_id:
            conversation_persona_id = await self._conversation_persona_id(
                manager, target.umo, conversation_id, active
            )
            if not self._alive(active):
                return None, "", ""
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
            examples = []
        elif isinstance(persona, Mapping) and isinstance(persona.get("prompt"), str):
            full_prompt = persona["prompt"]
            # This is the same processed field the host's main agent prepends
            # to contexts. These are configured examples, not chat history.
            examples = copy.deepcopy(persona.get("_begin_dialogs_processed", []))
            if not isinstance(examples, list) or any(
                not isinstance(item, dict)
                or item.get("role") not in ("user", "assistant")
                or not isinstance(item.get("content"), str)
                for item in examples
            ):
                return None, "", tr("alert.delivery.llm_persona_unavailable")
            if persona.get("begin_dialogs") and not examples:
                # An invalid/unprocessed preset must not silently disappear.
                return None, "", tr("alert.delivery.llm_persona_unavailable")
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
            hashlib.sha256(
                json.dumps(
                    [full_prompt, examples], ensure_ascii=False, sort_keys=True
                ).encode()
            ).hexdigest(),
            runner_signature,
            model_signature,
        )
        return signature, _PersonaInput(full_prompt, examples), ""

    async def _notice(
        self,
        target: Any,
        facts: tuple[AlertFact, ...],
        llm: Any,
        active: Callable[[], bool],
    ) -> tuple[str, str, tuple | None]:
        if not llm.enabled or not self._alive(active):
            return "", "", None
        prompt = template_prompt(len(facts))
        if not prompt:
            return "", tr("alert.delivery.llm_failed"), None

        async def generate():
            signature, persona_input, note = await self._resolve_target_llm(
                target, active
            )
            if signature is None or not self._alive(active):
                return "", note, None
            # No balances, names, endpoints, recipients, credentials, history or
            # tools enter this request. Configured persona examples accompany
            # the full persona and anonymous schema; substitution is local.
            response = await self.context.llm_generate(
                chat_provider_id=signature[0],
                prompt=prompt,
                system_prompt=persona_input.prompt,
                contexts=persona_input.contexts,
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
            notice = render_notice(content, _notice_rows(facts))
            return (
                (notice, "", signature)
                if notice
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
        notice_locale = self._locale() if self._locale is not None else current_locale()
        with use_locale(notice_locale):
            notice, note, signature = await self._notice(target, facts, llm, active)
        if not self._alive(active):
            return DeliveryResult("cancelled", tr("alert.delivery.cancelled"))
        if reason := self._target_reason(target):
            return self._blocked(reason)
        cancelled = object()
        transport_started = False

        async def send():
            nonlocal transport_started, notice, note
            if not self._alive(active):
                return cancelled
            allowed = await self._session_state(
                self.session_enabled, target.umo, active
            )
            if not self._alive(active):
                return cancelled
            reason, prepared_official = self._resolve_target(target)
            if reason:
                return self._blocked(reason)
            if allowed is not True:
                return self._blocked(
                    "session_disabled" if allowed is False else "session_check_failed"
                )
            official_auth = None
            if prepared_official is not None:
                try:
                    official_auth = await self._prepare_official(prepared_official[0])
                except asyncio.CancelledError:
                    raise
                except Exception:
                    return self._blocked("transport_unavailable")
                # Authentication is prepared before the durable reservation.
                # It may await or even suppress cancellation inside the SDK.
                if not self._alive(active):
                    return cancelled
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
            if notice:
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
                    notice = ""
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
                if notice:
                    try:
                        _, latest_note = self._target_llm_settings(target.umo)
                    except Exception:
                        latest_note = tr("alert.delivery.llm_config_unavailable")
                    if latest_note:
                        notice, note = "", latest_note
                # Host routing/persona/session-AI have no atomic public snapshot.
                # Concurrent changes not observable through this final sync
                # config read remain a host TOCTOU limit; never retry a send.
            if not self._alive(active):
                return cancelled
            reason, official = self._resolve_target(target)
            if reason:
                return self._blocked(reason)
            if (official is None) != (prepared_official is None) or (
                official is not None
                and (
                    official[0] is not prepared_official[0]
                    or official[1:] != prepared_official[1:]
                    or official[0].is_sandbox != official_auth[0]
                )
            ):
                return self._blocked("platform_unavailable")
            try:
                locale = self._locale() if self._locale is not None else notice_locale
                with use_locale(locale):
                    # Persona language is independent of the plugin UI locale.
                    # Only the ordinary fallback needs the current UI language.
                    text = notice or format_alert_facts(facts)
                if official is None:
                    outbound = self.component_factory(target.mentions, text)
            except Exception:
                return self._blocked("message_components_unavailable")
            # Durable reservation remains the final synchronous operation before
            # entering transport, after the last session/permission await.
            if not reserve():
                return cancelled
            transport_started = True
            if official is not None:
                return await self._send_official(
                    *official[1:], text, auth=official_auth
                )
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
