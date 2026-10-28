"""Synthetic real-host alert regression. Executed by run_real_host.py only."""


async def exercise(*, host, plugin, client, web, result, root, headers, plugin_name):
    import asyncio
    import base64
    import io
    import json
    import sys
    import time
    from copy import deepcopy
    from pathlib import Path

    import httpx
    from PIL import Image

    NAME = plugin_name

    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from adapter_fixture import install_offline_onebot
    from aiocqhttp import Event
    from astrbot.api.message_components import Plain
    from astrbot.core import sp
    from astrbot.core.platform.astrbot_message import AstrBotMessage, MessageMember
    from astrbot.core.platform.message_type import MessageType
    from astrbot.core.platform.sources.aiocqhttp.aiocqhttp_message_event import (
        AiocqhttpMessageEvent,
    )
    from astrbot.core.provider.entities import LLMResponse
    from astrbot.core.provider.provider import Provider
    from astrbot.core.provider.register import register_provider_adapter

    fixture = install_offline_onebot(host.star_context, "yql-offline-onebot")
    captured = fixture.calls
    llm_calls, http_calls, command_calls = [], [], []
    natural_hint = "我来轻轻提醒一下，记得照看账户额度呀。"
    llm_reply = natural_hint
    phases = result["phases"]
    cards = root / "evidence-cards"
    cards.mkdir()

    def safe_calls(calls, label):
        output = deepcopy(calls)
        for index, call in enumerate(output):
            for part, component in enumerate(call["params"].get("message", [])):
                value = component.get("data", {}).get("file", "")
                if value.startswith("base64://"):
                    data = base64.b64decode(value[9:])
                    filename = f"{label}-{index}-{part}.png"
                    (cards / filename).write_bytes(data)
                    with Image.open(io.BytesIO(data)) as bitmap:
                        bitmap.verify()
                    component["data"]["file"] = (
                        f"<evidence-cards/{filename}; {len(data)} bytes>"
                    )
        return output

    def record(label, value):
        phases[label] = deepcopy(value)
        (root / "progress.json").write_text(
            json.dumps(result, indent=2, ensure_ascii=False, default=str)
        )
        print("REAL_HOST_PHASE", label, flush=True)

    def text_reply(calls):
        return "\n".join(
            component["data"].get("text", "")
            for call in calls
            for component in call["params"].get("message", [])
            if component["type"] == "text"
        )

    def has_image(calls):
        return any(
            component["type"] == "image"
            for call in calls
            for component in call["params"].get("message", [])
        )

    def by_id(dto):
        return {account["account_id"]: account for account in dto["accounts"]}

    @register_provider_adapter("yql_offline_llm", "offline regression fixture")
    class OfflineProvider(Provider):
        def get_current_key(self):
            return "synthetic"

        def set_key(self, key):
            pass

        async def get_models(self):
            return ["offline"]

        async def text_chat(self, **kwargs):
            llm_calls.append(kwargs)
            return LLMResponse(role="assistant", completion_text=llm_reply)

    provider = OfflineProvider(
        {"id": "yql-offline-model", "type": "yql_offline_llm", "key": []}, {}
    )
    provider.set_model("offline")
    host.provider_manager.provider_insts.append(provider)
    host.provider_manager.inst_map["yql-offline-model"] = provider
    await host.star_context.persona_manager.create_persona(
        "offline-persona",
        "Synthetic target persona: be brief, warm, and speak naturally.",
    )

    async def configure_session(umo, enabled=True):
        await sp.put_async(
            scope="umo",
            scope_id=umo,
            key="provider_perf_chat_completion",
            value="yql-offline-model",
        )
        await sp.put_async(
            scope="umo",
            scope_id=umo,
            key="session_service_config",
            value={"persona_id": "offline-persona", "session_enabled": enabled},
        )

    target_umo = "yql-offline-onebot:GroupMessage:10002"
    await configure_session(target_umo)
    main_module = sys.modules[type(plugin).__module__]
    original_init = main_module.HttpProviderClient.__init__
    amounts = {"ds": "100", "new": "100", "multi": "8", "mnd": "7.45", "ali": "5.05"}

    def fake_http(request):
        aid = request.headers.get("authorization", "").removeprefix("Bearer synthetic-")
        http_calls.append(
            {
                "host": request.url.host,
                "method": request.method,
                "monotonic": time.monotonic(),
                "account": aid if aid in amounts else request.url.host,
            }
        )
        if request.url.host == "api.deepseek.com":
            assert aid in {"ds", "new", "multi"}, aid
            items = [
                {
                    "currency": "CNY",
                    "total_balance": amounts[aid],
                    "granted_balance": "0",
                    "topped_up_balance": amounts[aid],
                }
            ]
            if aid == "multi":
                items.append(
                    {
                        "currency": "USD",
                        "total_balance": "2",
                        "granted_balance": "0",
                        "topped_up_balance": "2",
                    }
                )
            body = {"is_available": True, "balance_infos": items}
        elif request.url.host == "meinianda.top":
            body = {
                "success": True,
                "data": {"unit": "site_credit", "balance": amounts["mnd"]},
            }
        elif request.url.host == "business.aliyuncs.com":
            body = {
                "Code": "200",
                "Success": True,
                "Data": {
                    "AvailableAmount": amounts["ali"],
                    "AvailableCashAmount": amounts["ali"],
                    "CreditAmount": "0",
                    "Currency": "CNY",
                },
            }
        else:
            raise AssertionError("Unexpected provider target")
        return httpx.Response(200, json=body)

    def fixture_http_init(self, *args, **kwargs):
        kwargs["client"] = httpx.AsyncClient(
            transport=httpx.MockTransport(fake_http), trust_env=False
        )
        original_init(self, *args, **kwargs)

    main_module.HttpProviderClient.__init__ = fixture_http_init

    async def command(text, sender="10001"):
        msg = AstrBotMessage()
        msg.type = MessageType.FRIEND_MESSAGE
        msg.self_id, msg.session_id = "10009", sender
        msg.message_id = str(time.time_ns())
        msg.sender = MessageMember(sender, "Synthetic tester")
        msg.message, msg.message_str = [Plain(text)], text
        msg.raw_message = Event(
            {
                "post_type": "message",
                "message_type": "private",
                "self_id": 10009,
                "user_id": int(sender),
                "message_id": int(time.time()),
                "message": [{"type": "text", "data": {"text": text}}],
            }
        )
        event = AiocqhttpMessageEvent(
            text, msg, fixture.adapter.meta(), sender, fixture.adapter.bot
        )
        before = len(captured)
        await host.star_context.get_event_queue().put(event)
        for _ in range(240):
            replies = [
                call
                for call in captured[before:]
                if call["action"] == "send_private_msg"
                and call["params"].get("user_id") == int(sender)
            ]
            if replies:
                await asyncio.sleep(0.1)
                value = deepcopy(replies)
                command_calls.append(
                    {
                        "command": text,
                        "sender": sender,
                        "replies": safe_calls(
                            value, f"command-{len(command_calls):02d}"
                        ),
                    }
                )
                return value
            await asyncio.sleep(0.05)
        raise AssertionError(("command_no_reply", text, event.get_result()))

    async def save_config(change):
        dto = await web("read")
        config = dto["config"]
        change(config)
        return await web("update", {"revision": dto["revision"], "config": config})

    async def await_status(aid, expected, timeout=12):
        deadline = time.monotonic() + timeout
        while True:
            status = await web("alert-status")
            row = by_id(status)[aid]
            if row["status"] == expected:
                return status
            assert time.monotonic() < deadline, (aid, expected, status)
            await asyncio.sleep(0.1)

    try:
        auth_response = await client.post(
            "/api/v1/plugins/extensions/" + NAME + "/admin/read", json={}
        )
        assert auth_response.status_code in {401, 403}, auth_response.text
        record(
            "dashboard_unauthorized_rejected",
            {"http_status": auth_response.status_code},
        )
        initial = await web("read")
        config = initial["config"]
        config.update(
            balance_alert_targets=[{"umo": target_umo, "mentions": ["10003", "10004"]}],
            balance_alert_admin_qq_ids=["10006"],
            balance_alert_llm={"enabled": True},
            providers=[],
        )
        for aid, ptype, metric in [
            ("ds", "deepseek", "total_balance"),
            ("ali", "alibaba_bailian", "AvailableAmount"),
            ("mnd", "meinianda", "site_credit"),
            ("multi", "deepseek", "total_balance"),
            ("new", "deepseek", "total_balance"),
        ]:
            config["providers"].append(
                {
                    "id": aid,
                    "type": ptype,
                    "display_name": "Synthetic " + aid,
                    "enabled": True,
                    "balance_alert": {
                        "enabled": False,
                        "metric": metric,
                        "threshold": "10" if aid == "new" else None,
                        "unit": "",
                        "check_interval_minutes": 1 if aid == "ds" else 15,
                    },
                }
            )
        saved = await web("update", {"revision": initial["revision"], "config": config})
        result["new_before_credentials"] = by_id(await web("alert-units"))["new"]
        for aid, field in [
            ("ds", "api_key"),
            ("ali", "access_key_id"),
            ("ali", "access_key_secret"),
            ("mnd", "api_key"),
            ("multi", "api_key"),
            ("new", "api_key"),
        ]:
            saved = await web(
                "credential-replace",
                {
                    "revision": saved["revision"],
                    "account_id": aid,
                    "field": field,
                    "value": "synthetic-" + aid,
                },
            )
        units = await web("alert-units")
        assert by_id(units)["new"]["unit_state"] == "unidentified", units
        reply = await command("/yql all")
        assert has_image(reply), text_reply(reply)
        units = await web("alert-units")
        for aid in ("ds", "ali", "mnd", "new"):
            assert by_id(units)[aid]["unit_state"] == "verified", units
        assert by_id(units)["multi"]["unit_state"] == "ambiguous", units
        assert {choice["unit"] for choice in by_id(units)["multi"]["choices"]} == {
            "CNY",
            "USD",
        }, units
        record("fresh_units_and_threshold_before_credentials", units)
        dto = await web("read")
        multi_choice = next(
            choice
            for choice in by_id(units)["multi"]["choices"]
            if choice["unit"] == "USD"
        )
        confirmed = await web(
            "alert-bind-unit",
            {
                "revision": dto["revision"],
                "account_id": "multi",
                "choice_id": multi_choice["id"],
            },
        )
        assert by_id(confirmed)["multi"]["unit_state"] == "verified"
        assert by_id(confirmed)["multi"]["unit"] == "USD"
        record("multi_currency_explicit_confirmation", confirmed)

        card_replies = {}
        for name in ("help", "status", "targets list"):
            reply = await command("/yql alert " + name)
            assert has_image(reply), (name, text_reply(reply))
            card_replies[name] = safe_calls(reply, name.replace(" ", "-"))
        reply = await command("/yql alert status", sender="10006")
        assert has_image(reply), text_reply(reply)
        revision = (await web("read"))["revision"]
        reply = await command("/yql alert off mnd", sender="10007")
        assert not has_image(reply) and "无权" in text_reply(reply), text_reply(reply)
        assert (await web("read"))["revision"] == revision
        record(
            "cards_and_real_event_authorization",
            {
                "cards": card_replies,
                "host_admin": "10001",
                "whitelist_admin": "10006",
                "denied_synthetic_sender": "10007",
            },
        )

        font_path = Path(plugin._font_path)
        missing = font_path.with_suffix(".regression-hidden")
        font_path.rename(missing)
        try:
            fallbacks = {}
            for operation, expected in (
                ("help", "/yql alert"),
                ("status", "Synthetic mnd"),
                ("targets list", target_umo),
            ):
                fallback = await command("/yql alert " + operation)
                assert not has_image(fallback) and expected in text_reply(fallback), (
                    text_reply(fallback)
                )
                fallbacks[operation] = {
                    "text": text_reply(fallback),
                    "replies": safe_calls(
                        fallback, "fallback-" + operation.replace(" ", "-")
                    ),
                }
            record(
                "card_missing_font_complete_text_fallback",
                fallbacks,
            )
        finally:
            missing.rename(font_path)

        def activate(config):
            for account in config["providers"]:
                if account["id"] in {"ds", "mnd", "ali"}:
                    account["balance_alert"].update(enabled=True, threshold="10")
                if account["id"] == "ali":
                    account["balance_alert"]["metric"] = "AvailableCashAmount"

        await save_config(activate)
        await await_status("mnd", "submitted")
        await command("/yql all")
        units = await web("alert-units")
        ali = by_id(units)["ali"]
        assert (
            ali["unit_state"] == "changed" and ali["change_reason"] == "metric_changed"
        ), units
        assert (
            ali["unit"] == "CNY"
            and ali["binding_metric"] == "AvailableAmount"
            and ali["metric"] == "AvailableCashAmount"
        ), ali
        assert ali["choices"] and ali["choices_state"] == "fresh", ali
        first_status = await web("alert-status")
        before_wait = time.monotonic()
        record(
            "metric_change_keeps_CNY_and_correct_reason",
            {"units": units, "status": first_status},
        )
        print("WAITING_REAL_62_SECONDS", flush=True)
        await asyncio.sleep(62)
        elapsed = time.monotonic() - before_wait
        units = await web("alert-units")
        expired = by_id(units)["ali"]
        assert elapsed >= 62
        assert (
            expired["unit_state"] == "changed"
            and expired["choices_state"] == "expired"
            and not expired["choices"]
        ), expired
        for aid in ("mnd", "new", "multi"):
            row = by_id(units)[aid]
            assert (
                row["unit_state"] == "verified"
                and row["choices_state"] == "expired"
                and not row["choices"]
            ), row
        assert by_id(units)["multi"]["unit"] == "USD"
        status = await web("alert-status")
        assert (
            by_id(status)["ds"]["last_checked_at"]
            > by_id(first_status)["ds"]["last_checked_at"]
        ), status
        record(
            "real_time_expiry_persistent_verified_and_background_recheck",
            {"elapsed_seconds": elapsed, "units": units, "status": status},
        )
        dto = await web("read")
        before_conflict_calls = len(http_calls)
        conflict_response = await client.post(
            "/api/v1/plugins/extensions/" + NAME + "/admin/alert-refresh-units",
            headers=headers,
            json={"revision": dto["revision"] - 1, "account_id": "ali"},
            follow_redirects=True,
        )
        assert conflict_response.status_code == 409, conflict_response.text
        assert len(http_calls) == before_conflict_calls
        stale_response = await client.post(
            "/api/v1/plugins/extensions/" + NAME + "/admin/alert-bind-unit",
            headers=headers,
            json={
                "revision": dto["revision"],
                "account_id": "ali",
                "choice_id": ali["choices"][0]["id"],
            },
            follow_redirects=True,
        )
        assert stale_response.status_code == 400, stale_response.text
        refreshed = await web(
            "alert-refresh-units", {"revision": dto["revision"], "account_id": "ali"}
        )
        fresh = by_id(refreshed)["ali"]
        assert (
            fresh["unit_state"] == "changed"
            and fresh["choices_state"] == "fresh"
            and fresh["choices"]
        ), fresh
        confirmed = await web(
            "alert-bind-unit",
            {
                "revision": dto["revision"],
                "account_id": "ali",
                "choice_id": fresh["choices"][0]["id"],
            },
        )
        assert (
            by_id(confirmed)["ali"]["unit_state"] == "verified"
            and by_id(confirmed)["ali"]["unit"] == "CNY"
        ), confirmed
        await command("/yql alert retry ali")
        budget_status = await await_status("ali", "waiting_budget")
        assert "300" in by_id(budget_status)["ali"]["message"], budget_status
        budget_card = await command("/yql alert status")
        assert has_image(budget_card), text_reply(budget_card)
        record(
            "expired_choice_rejected_refresh_confirm_and_budget_wait",
            {
                "stale_revision_http_status": conflict_response.status_code,
                "expired_bind_http_status": stale_response.status_code,
                "refreshed": refreshed,
                "confirmed": confirmed,
                "status": budget_status,
                "status_card": safe_calls(budget_card, "waiting-budget-status"),
            },
        )

        await save_config(
            lambda config: config.update(
                balance_alert_targets=[
                    {
                        "umo": "missing-instance:GroupMessage:10002",
                        "mentions": ["10003", "10004"],
                    }
                ]
            )
        )
        await command("/yql alert retry mnd")
        missing_status = await await_status("mnd", "blocked")
        assert by_id(missing_status)["mnd"]["detail_code"] == "platform_not_found", (
            missing_status
        )
        missing_card = await command("/yql alert status")
        assert has_image(missing_card), text_reply(missing_card)
        record(
            "missing_platform_specific_block_reason",
            {
                "status": missing_status,
                "status_card": safe_calls(missing_card, "missing-platform-status"),
            },
        )
        second_target = "yql-offline-onebot:GroupMessage:10005"
        await configure_session(second_target, enabled=False)
        await save_config(
            lambda config: config.update(
                balance_alert_targets=[
                    {"umo": second_target, "mentions": ["10003", "10004"]}
                ]
            )
        )
        await command("/yql alert retry ali")
        disabled_status = await await_status("ali", "blocked")
        assert by_id(disabled_status)["ali"]["detail_code"] == "session_disabled", (
            disabled_status
        )
        disabled_card = await command("/yql alert status")
        assert has_image(disabled_card), text_reply(disabled_card)
        await configure_session(second_target, enabled=True)
        await command("/yql alert retry ali")
        enabled_status = await await_status("ali", "submitted")
        record(
            "session_disabled_and_reenable",
            {
                "disabled": disabled_status,
                "reenabled": enabled_status,
                "disabled_status_card": safe_calls(
                    disabled_card, "disabled-session-status"
                ),
            },
        )

        groups = [call for call in captured if call["action"] == "send_group_msg"]
        assert len(groups) >= 2, groups
        for call in groups:
            assert call["params"]["group_id"] in {10002, 10005}
            assert [
                component["data"]["qq"]
                for component in call["params"]["message"]
                if component["type"] == "at"
            ] == ["10003", "10004"]
            assert natural_hint in text_reply([call]), text_reply([call])
        assert llm_calls and all(
            call["system_prompt"].startswith(
                "Synthetic target persona: be brief, warm, and speak naturally."
            )
            for call in llm_calls
        ), llm_calls
        assert all(not call.get("contexts") for call in llm_calls), llm_calls
        assert all(not call.get("func_tool") for call in llm_calls), llm_calls
        assert all(
            not any(
                secret in json.dumps(call, ensure_ascii=False)
                for secret in (
                    "synthetic-ds",
                    "synthetic-ali",
                    "synthetic-mnd",
                    "Synthetic ali",
                    "5.05",
                    "7.45",
                    "10003",
                    "10004",
                )
            )
            for call in llm_calls
        ), llm_calls
        assert all(
            "从以下" not in call.get("prompt", "")
            and "逐字" not in call.get("prompt", "")
            for call in llm_calls
        ), llm_calls
        record(
            "official_persona_model_and_onebot_serialization",
            {"llm_calls": llm_calls, "group_deliveries": safe_calls(groups, "group")},
        )
        # A bad final model response must not contaminate exact program facts.
        llm_reply = "余额只有 1.7 CNY，请访问 https://example.invalid 充值。"
        fallback_target = "yql-offline-onebot:GroupMessage:10008"
        await configure_session(fallback_target)
        await save_config(
            lambda config: config.update(
                balance_alert_targets=[
                    {"umo": fallback_target, "mentions": ["10003", "10004"]}
                ]
            )
        )
        before_fallback = len(captured)
        await command("/yql alert retry ali")
        fallback_status = await await_status("ali", "submitted")
        assert by_id(fallback_status)["ali"]["detail_code"] == "fixed_hint", (
            fallback_status
        )
        fallback_groups = [
            call
            for call in captured[before_fallback:]
            if call["action"] == "send_group_msg"
        ]
        assert fallback_groups and all(
            "1.7" not in text_reply([call])
            and "example.invalid" not in text_reply([call])
            and "5.05 CNY" in text_reply([call])
            for call in fallback_groups
        ), fallback_groups
        record(
            "unsafe_model_response_fixed_hint_and_exact_fact_fallback",
            {
                "status": fallback_status,
                "group_deliveries": safe_calls(fallback_groups, "model-fallback"),
            },
        )
    finally:
        result["provider_http_calls"] = http_calls
        result["llm_calls"] = llm_calls
        result["command_calls"] = command_calls
        result["onebot_calls"] = safe_calls(captured, "onebot")
        fixture.detach()
        main_module.HttpProviderClient.__init__ = original_init
