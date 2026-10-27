"""Bounded native page operations; no public credential read-back endpoint.

AstrBot discovers ``pages/00-quota-link/index.html`` itself. Only API handlers
are registered here. The v1 entry redirects to the ordinary Dashboard route,
as in Game Link, to avoid treating API-key identity as a Dashboard session.
"""

from __future__ import annotations

import asyncio
import inspect
import json
from time import time

from .web_admin import (
    AdminAuthorizationDenied,
    DashboardRequestFence,
    bounded_body,
    verified_dashboard_request,
)

PLUGIN_NAME = "astrbot_plugin_yomihime_quota_link"
OPERATIONS = (
    "alert-status",
    "alert-units",
    "alert-bind-unit",
    "read",
    "update",
    "credential-status",
    "credential-replace",
    "credential-clear",
    "legacy-config-plan",
    "legacy-config-execute",
)
_MUTATIONS = frozenset(
    {
        "update",
        "credential-replace",
        "credential-clear",
        "legacy-config-execute",
        "alert-bind-unit",
    }
)
_ERRORS = {
    "admin_authorization_denied": 403,
    "revision_conflict": 409,
    "invalid_config": 400,
    "storage_unavailable": 503,
    "operation_unavailable": 503,
}
_SECRET_FIELDS = frozenset(
    {
        "api_key",
        "access_key_id",
        "access_key_secret",
        "security_token",
        "token",
        "secret",
        "key",
    }
)


def _validate_body(operation, body):
    if operation in {
        "read",
        "credential-status",
        "legacy-config-plan",
        "alert-status",
        "alert-units",
    }:
        expected = set()
    elif operation == "alert-bind-unit":
        expected = {"revision", "account_id", "choice_id"}
    elif operation == "update":
        expected = {"revision", "config"}
    elif operation == "credential-clear":
        expected = {"revision", "account_id", "field"}
    elif operation == "credential-replace":
        if ("value" in body) == ("environment" in body):
            raise ValueError("exactly one credential source is required")
        expected = {"revision", "account_id", "field"} | (
            {"value"} if "value" in body else {"environment"}
        )
    elif operation == "legacy-config-execute":
        expected = {"revision", "plan_id", "confirm"}
    else:
        raise ValueError("unknown management operation")
    if set(body) != expected:
        raise ValueError("invalid management fields")
    if operation in _MUTATIONS and (
        type(body["revision"]) is not int or not 0 <= body["revision"] <= 2**53 - 1
    ):
        raise ValueError("invalid management revision")
    if operation == "alert-bind-unit" and (
        type(body["account_id"]) is not str
        or not 1 <= len(body["account_id"]) <= 128
        or type(body["choice_id"]) is not str
        or len(body["choice_id"]) != 64
        or any(c not in "0123456789abcdef" for c in body["choice_id"])
    ):
        raise ValueError("invalid unit confirmation")
    if operation == "update" and type(body["config"]) is not dict:
        raise ValueError("invalid configuration")
    if operation.startswith("credential-") and operation != "credential-status":
        if (
            type(body["account_id"]) is not str
            or not 1 <= len(body["account_id"]) <= 128
            or type(body["field"]) is not str
            or body["field"] not in _SECRET_FIELDS
        ):
            raise ValueError("invalid credential target")
    if operation == "legacy-config-execute" and (
        body["confirm"] is not True
        or type(body["plan_id"]) is not str
        or not 1 <= len(body["plan_id"]) <= 128
    ):
        raise ValueError("invalid migration confirmation")


def _status_only_result(result):
    """Defense-in-depth: fail rather than serialize accidental credential data."""
    if type(result) is not dict:
        raise RuntimeError("invalid management response")
    credentials = result.get("credentials", {})
    if type(credentials) is not dict:
        raise RuntimeError("invalid credential status")
    for account_id, fields in credentials.items():
        if type(account_id) is not str or type(fields) is not dict:
            raise RuntimeError("invalid credential status")
        for field, status in fields.items():
            if (
                field not in _SECRET_FIELDS
                or type(status) is not dict
                or set(status) != {"configured", "source"}
                or type(status["configured"]) is not bool
                or status["source"] not in {"missing", "encrypted", "environment"}
                or status["configured"] != (status["source"] != "missing")
            ):
                raise RuntimeError("invalid credential status")
    # Never allow caller objects with custom JSON encoders to reach the Host.
    serialized = json.dumps(result, ensure_ascii=False, allow_nan=False)
    if len(serialized.encode("utf-8")) > 1024 * 1024:
        raise RuntimeError("management response too large")
    return json.loads(serialized)


class AdminPages:
    """Register/close Host routes around ``await dispatch(op, body, authorize)``.

    ``authorize`` is a synchronous, request-owned commit fence, not reusable
    authority. The facade MUST call it immediately before each durable mutation
    and after every await. The callback expires on return, close, reload, token
    revocation, disconnect, or the original 30-second deadline. No write retries
    are made here; a lost post-commit response must be reconciled by reading.
    """

    def __init__(self, context, dispatch, *, request, json_response):
        if not callable(dispatch):
            raise TypeError("management dispatch must be callable")
        self.context, self.dispatch = context, dispatch
        self.request, self.json_response = request, json_response
        self.closed = True
        self.generation = 0
        self.registrations = []

    def register(self):
        if not self.closed:
            return
        self.closed = False
        self.generation += 1
        try:
            for operation in OPERATIONS:
                path = f"/{PLUGIN_NAME}/admin/{operation}"
                handler = self._handler(operation)
                self.registrations.append((path, handler))
                self.context.register_web_api(path, handler, ["POST"], "额度连结管理")
        except BaseException:
            self.close()
            raise

    def close(self):
        self.closed = True
        self.generation += 1
        apis = getattr(self.context, "registered_web_apis", None)
        if isinstance(apis, list):
            apis[:] = [
                entry
                for entry in apis
                if not any(
                    entry[0] == path and entry[1] is handler
                    for path, handler in self.registrations
                )
            ]
        self.registrations.clear()

    def _handler(self, operation):
        generation = self.generation
        legacy = f"/api/plug/{PLUGIN_NAME}/admin/{operation}"
        v1 = f"/api/v1/plugins/extensions/{PLUGIN_NAME}/admin/{operation}"

        async def handler():
            request, json_response = self.request, self.json_response

            if not self.closed and self.generation == generation:
                if request.method == "POST" and request.path == v1:
                    return json_response(
                        {},
                        status_code=307,
                        headers={"Location": legacy, "Cache-Control": "no-store"},
                    )
            result, code = None, None
            fence, watcher = None, None
            alive, watcher_stop = True, False
            task = asyncio.current_task()

            def authorize():
                if (
                    not alive
                    or self.closed
                    or self.generation != generation
                    or fence is None
                    or not fence.current()
                ):
                    raise AdminAuthorizationDenied

            try:
                if self.closed or self.generation != generation:
                    raise AdminAuthorizationDenied
                concrete = request._get_current()
                raw, subject, expiry = verified_dashboard_request(concrete, legacy)
                fence = DashboardRequestFence(concrete, legacy, raw, subject, expiry)
                data = await asyncio.wait_for(
                    bounded_body(concrete), timeout=max(0.001, expiry - time())
                )
                authorize()
                _validate_body(operation, data)
                if await raw.is_disconnected():
                    raise AdminAuthorizationDenied
                authorize()

                async def disconnect():
                    nonlocal alive
                    while alive and not watcher_stop:
                        try:
                            disconnected = await raw.is_disconnected()
                        except asyncio.CancelledError:
                            raise
                        except Exception:
                            # A failed liveness check cannot preserve authority.
                            disconnected = True
                        if watcher_stop:
                            return
                        if disconnected:
                            alive = False
                            if task is not None:
                                task.cancel()
                            return
                        await asyncio.sleep(0.02)

                watcher = asyncio.create_task(disconnect(), name="yql:admin-disconnect")
                pending = self.dispatch(operation, data, authorize)
                if not inspect.isawaitable(pending):
                    raise RuntimeError("management dispatch must be async")
                result = await asyncio.wait_for(
                    pending, timeout=max(0.001, expiry - time())
                )
                authorize()
                result = _status_only_result(result)
            except AdminAuthorizationDenied:
                code = "admin_authorization_denied"
            except Exception as error:
                candidate = getattr(error, "code", None)
                if type(candidate) is str and candidate in _ERRORS:
                    code = candidate
                elif isinstance(error, (ValueError, TypeError, RecursionError)):
                    code = "invalid_config"
                else:
                    code = "operation_unavailable"
            finally:
                # Joining the receive watcher is an async boundary too. Recheck
                # before the response, but always retire the request afterward.
                watcher_stop = True
                cancellation_pending = False
                try:
                    if watcher is not None:
                        watcher.cancel()
                        try:
                            await watcher
                        except asyncio.CancelledError:
                            cancellation_pending = (
                                task is not None and task.cancelling() > 0
                            )
                        except Exception:
                            code = "operation_unavailable"
                    cancellation_pending = cancellation_pending or (
                        task is not None and task.cancelling() > 0
                    )
                    if fence is not None:
                        try:
                            authorize()
                        except AdminAuthorizationDenied:
                            code = "admin_authorization_denied"
                finally:
                    alive = False
                if cancellation_pending:
                    raise asyncio.CancelledError
            payload = (
                {"status": "ok", "data": result, "message": ""}
                if code is None
                else {"status": "error", "data": {}, "code": code, "message": code}
            )
            return json_response(
                payload,
                status_code=200 if code is None else _ERRORS[code],
                headers={"Cache-Control": "no-store"},
            )

        return handler
