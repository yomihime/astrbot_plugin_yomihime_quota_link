"""Adversarial route tests. These doubles do not claim to be real Host tests."""

import asyncio
import json
import sys
import time
from types import MethodType, ModuleType, SimpleNamespace

import pytest

from quota_link.admin import AdminAuthorizationDenied, AdminPages
from quota_link.admin.pages import OPERATIONS, PLUGIN_NAME
from quota_link.admin.web_admin import (
    BODY_LIMIT,
    DashboardRequestFence,
    bounded_body,
    verified_dashboard_request,
)


class Headers:
    def __init__(self, pairs):
        self.pairs = list(pairs)

    def getlist(self, key):
        return [value for name, value in self.pairs if name.lower() == key.lower()]

    def set(self, key, value):
        self.pairs = [(k, v) for k, v in self.pairs if k.lower() != key.lower()]
        self.pairs.append((key, value))


class HostVerifier:
    def __init__(self):
        self.calls = []
        self.payload = {"username": "admin", "exp": int(time.time()) + 600}
        self.error = ""

    def _validate_dashboard_token(self, token, path):
        self.calls.append((token, path))
        return self.payload.copy(), self.error


class Request:
    def __init__(self, operation="read", body=b"{}"):
        self.method = "POST"
        self.path = f"/api/plug/{PLUGIN_NAME}/admin/{operation}"
        self.username = "admin"
        self.headers = Headers(
            [
                ("authorization", "Bearer test.header.signature"),
                ("origin", "https://dashboard.example"),
                ("content-type", "application/json"),
                ("content-length", str(len(body))),
            ]
        )
        self.host = HostVerifier()
        app = SimpleNamespace(state=SimpleNamespace())
        app.state.dashboard_app_adapter = SimpleNamespace(
            _app=app, _dashboard_server=self.host
        )
        self.disconnected = False
        self.body_started = False
        self.after_body = None
        self.body = body
        self._request = SimpleNamespace(
            app=app,
            method=self.method,
            headers=self.headers,
            url=SimpleNamespace(
                scheme="https", netloc="dashboard.example", path=self.path
            ),
            state=SimpleNamespace(dashboard_g=SimpleNamespace(username="admin")),
            stream=self.stream,
            is_disconnected=self.is_disconnected,
        )

    def _get_current(self):
        return self

    async def stream(self):
        self.body_started = True
        yield self.body
        if self.after_body:
            self.after_body()

    async def is_disconnected(self):
        return self.disconnected


class Context:
    def __init__(self):
        self.registered_web_apis = []

    def register_web_api(self, path, handler, methods, desc):
        self.registered_web_apis.append((path, handler, methods, desc))


def install_web(monkeypatch, request):
    web = ModuleType("astrbot.api.web")
    web.request = request
    web.json_response = lambda body, status_code=200, headers=None: SimpleNamespace(
        body=body, status_code=status_code, headers=headers
    )
    monkeypatch.setitem(sys.modules, "astrbot.api.web", web)
    return web


def invoke(monkeypatch, request, dispatch, operation=None, before=None):
    context = Context()
    web = install_web(monkeypatch, request)
    pages = AdminPages(
        context, dispatch, request=web.request, json_response=web.json_response
    )
    pages.register()
    operation = operation or request.path.rsplit("/", 1)[-1]
    handler = dict((p.rsplit("/", 1)[-1], h) for p, h in pages.registrations)[operation]
    install_web(monkeypatch, request)
    if before:
        before(pages)
    return asyncio.run(handler()), pages


async def successful(operation, body, authorize):
    authorize()
    return {
        "revision": 1,
        "credentials": {
            "demo": {"api_key": {"configured": True, "source": "encrypted"}}
        },
    }


def test_success_is_native_envelope_and_no_store(monkeypatch):
    request = Request()
    result, _ = invoke(monkeypatch, request, successful)
    assert result.status_code == 200
    assert result.body["status"] == "ok"
    assert result.body["message"] == ""
    assert result.headers == {"Cache-Control": "no-store"}
    assert len(request.host.calls) >= 4
    assert all(path == request.path for _, path in request.host.calls)


@pytest.mark.parametrize(
    "alter",
    [
        lambda r: r.headers.set("authorization", ""),
        lambda r: r.headers.pairs.append(
            ("authorization", "Bearer test.header.signature")
        ),
        lambda r: r.headers.pairs.append(("origin", "https://dashboard.example")),
        lambda r: r.headers.pairs.append(("x-api-key", "api-key")),
        lambda r: r.headers.set("origin", "https://evil.example"),
        lambda r: r.headers.set("origin", "null"),
        lambda r: r.headers.set("origin", "https://dashboard.example@evil.example"),
        lambda r: r.headers.set("origin", "https://dashboard.example/?ignored"),
        lambda r: r.headers.set("origin", "https://dashboard.example\\@evil.example"),
        lambda r: setattr(r, "method", "GET"),
        lambda r: setattr(r._request, "method", "DELETE"),
        lambda r: setattr(r, "path", r.path + "/"),
        lambda r: setattr(r._request.url, "path", "/wrong"),
        lambda r: setattr(r._request.url, "netloc", "evil.example"),
        lambda r: setattr(r._request.app.state.dashboard_app_adapter, "_app", object()),
        lambda r: setattr(r, "username", "other"),
        lambda r: setattr(r._request.state.dashboard_g, "username", "other"),
        lambda r: r.host.payload.update(exp=int(time.time()) - 1),
        lambda r: r.host.payload.update(exp=True),
        lambda r: r.host.payload.update(username=""),
        lambda r: r.host.payload.update(token_type="plugin_page_asset"),
        lambda r: setattr(r.host, "error", "invalid signature"),
    ],
)
def test_auth_failure_never_reads_body_or_dispatches(monkeypatch, alter):
    request = Request()
    alter(request)
    called = []

    async def dispatch(*args):
        called.append(args)
        raise AssertionError

    result, _ = invoke(monkeypatch, request, dispatch, operation="read")
    assert result.status_code == 403
    assert result.body["message"] == "admin_authorization_denied"
    assert not request.body_started
    assert not called


@pytest.mark.parametrize(
    "body",
    [
        b'{"x":1,"x":2}',
        b'{"x":{"a":1,"a":2}}',
        b"[]",
        b"null",
        b'{"x":NaN}',
        b'{"x":Infinity}',
        b'{"x":1e999}',
        b'{"x":',
        b'{"x":"\xff"}',
        b'{"x":' + b"[" * 30 + b"0" + b"]" * 30 + b"}",
        b'{"padding":"' + b"x" * BODY_LIMIT + b'"}',
    ],
)
def test_hostile_json_is_rejected_before_dispatch(monkeypatch, body):
    request = Request(body=body)
    result, _ = invoke(monkeypatch, request, successful)
    assert result.status_code == 400
    assert result.body["code"] == "invalid_config"


@pytest.mark.parametrize(
    "key,value",
    [
        ("content-type", "text/plain"),
        ("content-encoding", "gzip"),
        ("content-length", "-1"),
        ("content-length", "2x"),
        ("content-length", "0"),
        ("content-length", "9" * 10000),
        ("transfer-encoding", "chunked"),
    ],
)
def test_untrusted_body_headers_are_rejected(monkeypatch, key, value):
    request = Request()
    request.headers.set(key, value)
    result, _ = invoke(monkeypatch, request, successful)
    assert result.status_code == 400


def test_streamed_chunk_limit_applies_without_content_length():
    request = Request(body=b"x" * (BODY_LIMIT + 1))
    request.headers.pairs = [
        (k, v) for k, v in request.headers.pairs if k != "content-length"
    ]
    with pytest.raises(ValueError):
        asyncio.run(bounded_body(request))


@pytest.mark.parametrize(
    "body",
    [
        {},
        {"revision": True, "config": {}},
        {"revision": -1, "config": {}},
        {"revision": 0, "config": {}, "role": "admin"},
        {"revision": 0, "config": []},
        {"expected_revision": 0, "config": {}},
    ],
)
def test_write_requires_exact_fields_and_cas_revision(monkeypatch, body):
    request = Request("update", json.dumps(body).encode())
    result, _ = invoke(monkeypatch, request, successful)
    assert result.status_code == 400


def test_revocation_during_body_is_fenced_before_dispatch(monkeypatch):
    request = Request()
    request.after_body = lambda: setattr(request.host, "error", "revoked")
    result, _ = invoke(monkeypatch, request, successful)
    assert result.status_code == 403


@pytest.mark.parametrize(
    "change", ["token", "origin", "server", "verifier", "subject", "expired"]
)
def test_fence_rejects_request_identity_changes(change):
    request = Request()
    fence = DashboardRequestFence(
        request, request.path, *verified_dashboard_request(request, request.path)
    )
    if change == "token":
        request.headers.set("authorization", "Bearer other.header.signature")
    elif change == "origin":
        request.headers.set("origin", "https://dashboard.example:443")
    elif change == "server":
        request._request.app.state.dashboard_app_adapter._dashboard_server = (
            HostVerifier()
        )
    elif change == "verifier":
        request.host._validate_dashboard_token = MethodType(
            lambda s, t, p: (s.payload, ""), request.host
        )
    elif change == "subject":
        request.host.payload["username"] = "new"
        request.username = "new"
        request._request.state.dashboard_g.username = "new"
    elif change == "expired":
        fence.expiry = time.time() - 1
    assert not fence.current()


def test_request_authority_does_not_renew():
    request = Request()
    fence = DashboardRequestFence(
        request, request.path, *verified_dashboard_request(request, request.path)
    )
    original_expiry = fence.expiry
    assert fence.current()
    assert fence.expiry == original_expiry


@pytest.mark.parametrize(
    "kind",
    [
        "async",
        "generator",
        "async_generator",
        "unbound",
        "foreign",
        "shape",
        "awaitable",
    ],
)
def test_verifier_contract_changes_fail_closed(kind):
    request = Request()
    if kind == "async":

        async def verify(self, token, path):
            return self.payload, ""
    elif kind == "generator":

        def verify(self, token, path):
            yield self.payload
    elif kind == "async_generator":

        async def verify(self, token, path):
            yield self.payload
    elif kind == "shape":

        def verify(self, token, path):
            return [self.payload, ""]
    elif kind == "awaitable":

        async def pending():
            return request.host.payload, ""

        def verify(self, token, path):
            return pending()
    else:

        def verify(self, token, path):
            return self.payload, ""

    request.host._validate_dashboard_token = (
        verify
        if kind == "unbound"
        else MethodType(verify, HostVerifier() if kind == "foreign" else request.host)
    )
    with pytest.raises(AdminAuthorizationDenied):
        verified_dashboard_request(request, request.path)


def test_close_is_exact_and_old_handler_never_reactivates(monkeypatch):
    request = Request()
    install_web(monkeypatch, request)
    context = Context()
    web = install_web(monkeypatch, request)
    pages = AdminPages(
        context, successful, request=web.request, json_response=web.json_response
    )
    pages.register()
    assert len(context.registered_web_apis) == len(OPERATIONS)
    pages.register()
    assert len(context.registered_web_apis) == len(OPERATIONS)
    old_handler = pages.registrations[0][1]
    foreign = ("/foreign", object(), ["POST"], "foreign")
    same_path_other_handler = (
        pages.registrations[0][0],
        object(),
        ["POST"],
        "new owner",
    )
    context.registered_web_apis.extend([foreign, same_path_other_handler])
    pages.close()
    assert context.registered_web_apis == [foreign, same_path_other_handler]
    pages.register()
    assert asyncio.run(old_handler()).status_code == 403


def test_authorize_closure_retired_after_response(monkeypatch):
    captured = []

    async def dispatch(operation, body, authorize):
        captured.append(authorize)
        authorize()
        return {}

    result, _ = invoke(monkeypatch, Request(), dispatch)
    assert result.status_code == 200
    with pytest.raises(AdminAuthorizationDenied):
        captured[0]()


def test_commit_fence_stops_revoked_mutation(monkeypatch):
    request = Request("update", b'{"revision":0,"config":{}}')
    writes = []

    async def dispatch(operation, body, authorize):
        await asyncio.sleep(0)
        request.host.error = "revoked"
        authorize()
        writes.append(body)
        return {}

    result, _ = invoke(monkeypatch, request, dispatch)
    assert result.status_code == 403
    assert writes == []


def test_close_during_dispatch_prevents_commit(monkeypatch):
    request = Request("update", b'{"revision":0,"config":{}}')
    context = Context()
    writes = []

    async def dispatch(operation, body, authorize):
        pages.close()
        authorize()
        writes.append(body)
        return {}

    web = install_web(monkeypatch, request)
    pages = AdminPages(
        context, dispatch, request=web.request, json_response=web.json_response
    )
    pages.register()
    handler = pages.registrations[1][1]
    install_web(monkeypatch, request)
    assert asyncio.run(handler()).status_code == 403
    assert not writes


def test_unexpected_errors_never_leak_details(monkeypatch):
    async def dispatch(*args):
        raise RuntimeError("secret=do-not-return")

    result, _ = invoke(monkeypatch, Request(), dispatch)
    assert result.status_code == 503
    assert "do-not-return" not in json.dumps(result.body)


def test_revision_conflict_is_distinct_and_no_write_retry(monkeypatch):
    count = 0

    class Conflict(Exception):
        code = "revision_conflict"

    async def dispatch(*args):
        nonlocal count
        count += 1
        raise Conflict("private storage details")

    result, _ = invoke(monkeypatch, Request(), dispatch)
    assert result.status_code == 409
    assert result.body["message"] == "revision_conflict"
    assert count == 1


def test_credential_result_cannot_accidentally_reveal_secret(monkeypatch):
    async def dispatch(*args):
        return {
            "credentials": {
                "demo": {
                    "api_key": {
                        "configured": True,
                        "source": "encrypted",
                        "value": "never-return",
                    }
                }
            }
        }

    result, _ = invoke(monkeypatch, Request(), dispatch)
    assert result.status_code == 503
    assert "never-return" not in json.dumps(result.body)


def test_v1_redirect_never_claims_authority_or_reads_body(monkeypatch):
    request = Request()
    request.path = request.path.replace("/api/plug/", "/api/v1/plugins/extensions/")
    result, _ = invoke(monkeypatch, request, successful)
    assert result.status_code == 307
    assert result.headers["Location"] == f"/api/plug/{PLUGIN_NAME}/admin/read"
    assert result.headers["Cache-Control"] == "no-store"
    assert not request.body_started
    assert request.host.calls == []


def test_registration_failure_removes_only_its_partial_routes():
    context = Context()
    foreign = ("/foreign", object(), ["POST"], "foreign")
    context.registered_web_apis.append(foreign)

    def register(path, handler, methods, desc):
        context.registered_web_apis.append((path, handler, methods, desc))
        if len(context.registered_web_apis) == 3:
            raise RuntimeError("failed registration")

    context.register_web_api = register
    pages = AdminPages(context, successful, request=None, json_response=None)
    with pytest.raises(RuntimeError):
        pages.register()
    assert pages.closed
    assert pages.registrations == []
    assert context.registered_web_apis == [foreign]


def test_final_await_rechecks_authority_before_response(monkeypatch):
    request = Request()
    started = asyncio.Event()
    checks = 0

    async def is_disconnected():
        nonlocal checks
        checks += 1
        if checks == 1:
            return False
        started.set()
        try:
            await asyncio.Future()
        except asyncio.CancelledError:
            request.host.error = "revoked at final await"
            raise

    request._request.is_disconnected = is_disconnected

    async def dispatch(operation, body, authorize):
        await started.wait()
        authorize()
        return {"revision": 0}

    result, _ = invoke(monkeypatch, request, dispatch)
    assert result.status_code == 403
    assert result.body["data"] == {}


@pytest.mark.parametrize("receive_fails", [False, True])
def test_disconnect_and_failed_liveness_cancel_before_mutation(
    monkeypatch, receive_fails
):
    request = Request()
    checks = 0
    writes = []

    async def is_disconnected():
        nonlocal checks
        checks += 1
        if checks == 1:
            return False
        if receive_fails:
            raise OSError("connection lost")
        return True

    request._request.is_disconnected = is_disconnected

    async def dispatch(operation, body, authorize):
        await asyncio.sleep(0.1)
        authorize()
        writes.append(body)
        return {}

    with pytest.raises(asyncio.CancelledError):
        invoke(monkeypatch, request, dispatch)
    assert not writes


def test_cancellation_retires_authority_and_does_not_retry(monkeypatch):
    request = Request()
    captured = []

    async def dispatch(operation, body, authorize):
        captured.append(authorize)
        raise asyncio.CancelledError

    with pytest.raises(asyncio.CancelledError):
        invoke(monkeypatch, request, dispatch)
    assert len(captured) == 1
    with pytest.raises(AdminAuthorizationDenied):
        captured[0]()


@pytest.mark.parametrize(
    "body",
    [
        {"revision": True, "account_id": "synthetic", "choice_id": "a" * 64},
        {"revision": 1, "account_id": "synthetic", "choice_id": "USD"},
        {
            "revision": 1,
            "account_id": "synthetic",
            "choice_id": "a" * 64,
            "unit": "USD",
        },
    ],
)
def test_unit_binding_operation_rejects_manual_units_and_invalid_cas(monkeypatch, body):
    request = Request("alert-bind-unit", json.dumps(body).encode())
    result, _ = invoke(monkeypatch, request, successful)
    assert result.status_code == 400


def test_unit_status_read_only_route_available(monkeypatch):
    request = Request("alert-units", b"{}")
    result, _ = invoke(monkeypatch, request, successful)
    assert result.status_code == 200
