"""Opt-in tests executing pinned, independently supplied official AstrBot code.

Set QUOTA_TEST_ASTRBOT_SOURCE to an AstrBot v4.29.1 checkout root and install
PyJWT 2.10.1, FastAPI 0.135.2, Starlette 0.52.1, Quart 0.20.0, and httpx.
This exercises real auth/dispatch/request code, not full Host startup or a live
production deployment. Source hashes fail closed on missing/changed inputs.
"""

import ast
import asyncio
import hashlib
import inspect
import os
import re
import sys
import time
from pathlib import Path
from types import ModuleType, SimpleNamespace
from typing import Any, cast
from urllib.parse import quote

import pytest

from quota_link.admin import AdminPages
from quota_link.admin.pages import PLUGIN_NAME

HOST_VERSION = "4.29.1"
HOST_COMMIT = "dffe922773725e9c178392c423676ad65044748c"
SOURCE_ENV = "QUOTA_TEST_ASTRBOT_SOURCE"
HASHES = {
    "astrbot/core/utils/upload.py": "211c23524bee41187ac4e350ad48430113bf5491043e1e8a3518dcfd5d2b4518",
    "astrbot/core/star/context.py": "10f5f5dd40491564ee196854abb5f6a4e4e6fc46a6c5e62e29935e2c53b6294f",
    "astrbot/api/web.py": "faeb09a65f0f0559edfc4794ce152b5465e18c31ee4ab40c0a4e0f5ec8579d04",
    "astrbot/dashboard/responses.py": "2f3638f8196fbdd3315e6fe021a3163174e310b04f781b147ef5073c5f109e38",
    "astrbot/dashboard/plugin_page_auth.py": "69de4913a649f847bee3d24f30b8450ff77f289ce2f6d15c6844ecf0dc567d0d",
    "astrbot/dashboard/api/auth.py": "1ac9e90ee25412656f295aadcb48a119386ef62dc0c7516cf50e1a40512026ee",
    "astrbot/dashboard/server.py": "d911fd8273505aad4e088fafe55b6b634ea67e3515d67107dc6a23a76abea821",
    "astrbot/dashboard/asgi_runtime.py": "adb7abe6ae3f09e27440ce72a65a174d509c97bb7827c450f74c055057f14991",
    "astrbot/dashboard/api/plugins.py": "4ae3fa76ac36ec4cfb286057627cf97cee589ee6d7d8a36a83dc2fd43897c074",
    "astrbot/dashboard/services/auth_service.py": "9ef9124915d99eba5c1754b5c6efdc6cb508991140309fb57d0c6c1f0c216ba8",
}
pytestmark = pytest.mark.skipif(
    not os.environ.get(SOURCE_ENV),
    reason="independent pinned AstrBot source not configured",
)


def _sources():
    root = Path(os.environ[SOURCE_ENV])
    sources = {}
    for relative, digest in HASHES.items():
        text = (root / relative).read_text(encoding="utf-8")
        assert hashlib.sha256(text.encode()).hexdigest() == digest, relative
        sources[relative] = text
    return sources


def _module(monkeypatch, sources, relative):
    name = "quota_official_" + relative.replace("/", "_")
    module = ModuleType(name)
    module.__file__ = relative
    monkeypatch.setitem(sys.modules, name, module)
    exec(compile(sources[relative], relative, "exec"), module.__dict__)
    return module


def _extract(sources, relative, names, namespace):
    nodes = [
        n
        for n in ast.parse(sources[relative]).body
        if getattr(n, "name", None) in names
    ]
    assert {n.name for n in nodes} == names
    exec(compile(ast.Module(body=nodes, type_ignores=[]), relative, "exec"), namespace)


def _host(monkeypatch):
    import jwt
    from fastapi import Request
    from starlette.responses import JSONResponse

    sources = _sources()
    upload = _module(monkeypatch, sources, "astrbot/core/utils/upload.py")
    monkeypatch.setitem(sys.modules, "astrbot.core.utils.upload", upload)
    web = _module(monkeypatch, sources, "astrbot/api/web.py")
    responses = _module(monkeypatch, sources, "astrbot/dashboard/responses.py")
    page_auth = _module(monkeypatch, sources, "astrbot/dashboard/plugin_page_auth.py")
    asgi = _module(monkeypatch, sources, "astrbot/dashboard/asgi_runtime.py")
    auth_service = ast.parse(sources["astrbot/dashboard/services/auth_service.py"])
    cookie_name = next(
        ast.literal_eval(node.value)
        for node in auth_service.body
        if isinstance(node, ast.Assign)
        and any(
            isinstance(target, ast.Name) and target.id == "DASHBOARD_JWT_COOKIE_NAME"
            for target in node.targets
        )
    )
    ns = {
        "__name__": "quota_official_contract",
        "jwt": jwt,
        "Request": Request,
        "JSONResponse": JSONResponse,
        "Any": Any,
        "cast": cast,
        "re": re,
        "quote": quote,
        "ApiError": responses.ApiError,
        "error": responses.error,
        "PluginPageAuth": page_auth.PluginPageAuth,
        "PluginRequest": web.PluginRequest,
        "bind_request_context": web.bind_request_context,
        "DASHBOARD_JWT_COOKIE_NAME": cookie_name,
        "DashboardRequestState": asgi.DashboardRequestState,
        "call_request_view": asgi.call_request_view,
        "FastAPIAppAdapter": asgi.FastAPIAppAdapter,
    }
    _extract(
        sources,
        "astrbot/dashboard/api/auth.py",
        {
            "_get_dashboard_state_username",
            "_extract_dashboard_jwt",
            "require_dashboard_user",
        },
        ns,
    )
    server = next(
        node
        for node in ast.parse(sources["astrbot/dashboard/server.py"]).body
        if isinstance(node, ast.ClassDef)
        and any(
            getattr(child, "name", None) == "auth_middleware" for child in node.body
        )
    )
    methods = [
        node
        for node in server.body
        if getattr(node, "name", None)
        in {
            "auth_middleware",
            "_validate_dashboard_token",
            "_extract_dashboard_jwt",
        }
    ]
    cls = ast.ClassDef(
        name="OfficialHostAuth", bases=[], keywords=[], body=methods, decorator_list=[]
    )
    exec(
        compile(
            ast.fix_missing_locations(ast.Module(body=[cls], type_ignores=[])),
            "official_dashboard_auth",
            "exec",
        ),
        ns,
    )

    async def no_rate_limit(*args):
        return None

    # Rate limiting is outside this contract. Signature and authorization are
    # unchanged upstream code, including real PyJWT verification and expiry.
    ns["OfficialHostAuth"]._apply_auth_rate_limit = no_rate_limit

    async def run_maybe_async(callback):
        result = callback()
        return await result if inspect.isawaitable(result) else result

    ns["run_maybe_async"] = run_maybe_async
    _extract(
        sources,
        "astrbot/dashboard/api/plugins.py",
        {
            "_normalize_plugin_api_route",
            "_plugin_api_route_pattern",
            "_match_registered_web_api",
            "_plugin_extension_legacy_path",
            "_call_plugin_extension",
        },
        ns,
    )
    context_cls = next(
        n
        for n in ast.parse(sources["astrbot/core/star/context.py"]).body
        if isinstance(n, ast.ClassDef) and n.name == "Context"
    )
    register = next(
        n for n in context_cls.body if getattr(n, "name", None) == "register_web_api"
    )
    register_ns = {"WebApiHandler": Any}
    exec(
        compile(
            ast.Module(body=[register], type_ignores=[]),
            "official_register_web_api",
            "exec",
        ),
        register_ns,
    )
    context = type(
        "Context", (), {"register_web_api": register_ns["register_web_api"]}
    )()
    context.registered_web_apis = []
    monkeypatch.setitem(sys.modules, "astrbot.api.web", web)
    return web, ns, context


def _harness(monkeypatch, dispatch=None):
    import httpx
    from fastapi import FastAPI, Request

    web, ns, context = _host(monkeypatch)
    calls = []

    async def default_dispatch(operation, body, authorize):
        authorize()
        calls.append((operation, body))
        return {"revision": 1, "credentials": {}}

    pages = AdminPages(
        context,
        dispatch or default_dispatch,
        request=web.request,
        json_response=web.json_response,
    )
    pages.register()
    server = ns["OfficialHostAuth"]()
    server._jwt_secret = "quota-contract-synthetic-secret-at-least-32-bytes"
    app = FastAPI()
    app.state.core_lifecycle = SimpleNamespace(star_context=context)
    adapter = ns["FastAPIAppAdapter"](app)
    adapter._dashboard_server = server

    @app.middleware("http")
    async def auth(request, call_next):
        request.state.dashboard_g = ns["DashboardRequestState"]()
        response = await server.auth_middleware(request)
        return response if response is not None else await call_next(request)

    @app.api_route(
        "/api/plug/{plugin_path:path}", methods=["GET", "POST", "PUT", "DELETE"]
    )
    async def legacy(plugin_path: str, request: Request):
        username = await ns["require_dashboard_user"](request)
        return await ns["_call_plugin_extension"](plugin_path, request, username)

    @app.post("/api/v1/plugins/extensions/{plugin_path:path}")
    async def v1(plugin_path: str, request: Request):
        # Deliberately broad identity mirrors v1's API-key-capable entry.
        return await ns["_call_plugin_extension"](plugin_path, request, "v1-identity")

    def client():
        return httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://testhost"
        )

    return client, server, calls, pages, web


def _token(server, **changes):
    import jwt

    claims = {"username": "admin", "exp": int(time.time()) + 600}
    claims.update(changes)
    return jwt.encode(claims, server._jwt_secret, algorithm="HS256")


def test_official_auth_dispatch_and_v1_redirect(monkeypatch):
    client, server, calls, _, _ = _harness(monkeypatch)

    async def check():
        async with client() as http:
            response = await http.post(
                f"/api/v1/plugins/extensions/{PLUGIN_NAME}/admin/read",
                json={},
                headers={
                    "Authorization": "Bearer " + _token(server),
                    "Origin": "http://testhost",
                },
                follow_redirects=True,
            )
            assert [item.status_code for item in response.history] == [307]
            assert response.status_code == 200
            assert response.headers["cache-control"] == "no-store"
            assert response.json() == {
                "status": "ok",
                "data": {"revision": 1, "credentials": {}},
                "message": "",
            }
            assert calls == [("read", {})]

    asyncio.run(check())


@pytest.mark.parametrize(
    "case", ["missing", "expired", "wrong_signature", "asset", "api_key", "origin"]
)
def test_official_auth_denies_without_dispatch(monkeypatch, case):
    client, server, calls, _, _ = _harness(monkeypatch)
    token = _token(server)
    if case == "expired":
        token = _token(server, exp=int(time.time()) - 60)
    elif case == "wrong_signature":
        import jwt

        token = jwt.encode(
            {"username": "admin", "exp": int(time.time()) + 600},
            "different-synthetic-key-at-least-32-bytes",
            algorithm="HS256",
        )
    elif case == "asset":
        token = _token(
            server,
            token_type="plugin_page_asset",
            plugin_name=PLUGIN_NAME,
            page_name="00-quota-link",
        )
    headers = {"Authorization": "Bearer " + token, "Origin": "http://testhost"}
    if case == "missing":
        del headers["Authorization"]
    elif case == "api_key":
        del headers["Authorization"]
        headers["X-API-Key"] = "not-a-dashboard-token"
    elif case == "origin":
        headers["Origin"] = "http://hostile.example"

    async def check():
        async with client() as http:
            response = await http.post(
                f"/api/plug/{PLUGIN_NAME}/admin/read", json={}, headers=headers
            )
            assert response.status_code in {401, 403}
            assert not calls

    asyncio.run(check())


def test_official_route_match_disallows_wrong_method(monkeypatch):
    client, server, calls, _, _ = _harness(monkeypatch)

    async def check():
        async with client() as http:
            response = await http.get(
                f"/api/plug/{PLUGIN_NAME}/admin/read",
                headers={
                    "Authorization": "Bearer " + _token(server),
                    "Origin": "http://testhost",
                },
            )
            assert response.json()["status"] == "error"
            assert not calls

    asyncio.run(check())


def test_official_host_key_rotation_fences_commit(monkeypatch):
    writes = []

    async def dispatch(operation, body, authorize):
        await asyncio.sleep(0)
        server._jwt_secret = "rotated-synthetic-secret-at-least-32-bytes"
        authorize()
        writes.append(body)
        return {}

    client, server, _, _, _ = _harness(monkeypatch, dispatch)

    async def check():
        async with client() as http:
            response = await http.post(
                f"/api/plug/{PLUGIN_NAME}/admin/update",
                json={"revision": 0, "config": {}},
                headers={
                    "Authorization": "Bearer " + _token(server),
                    "Origin": "http://testhost",
                },
            )
            assert response.status_code == 403
            assert response.json()["message"] == "admin_authorization_denied"
            assert not writes

    asyncio.run(check())
