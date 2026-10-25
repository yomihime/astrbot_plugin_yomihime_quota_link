"""AstrBot Dashboard authorization, ported from Game Link's Host boundary.

The plugin does not decode JWTs or read the Dashboard signing key. Every proof
comes from the synchronous verifier bound to the actual request's Host server.
Verified against AstrBot 4.29.1 (dffe922773725e9c178392c423676ad65044748c).
"""

from __future__ import annotations

import hmac
import inspect
import ipaddress
import json
import re
import secrets
from math import isfinite
from time import time
from urllib.parse import urlsplit

BODY_LIMIT = 64 * 1024
REQUEST_TTL = 30.0


class AdminAuthorizationDenied(Exception):
    """An exact, non-secret marker understood by the native page bridge."""

    code = "admin_authorization_denied"
    status = 403


def normalize_origin(value: object) -> str:
    if (
        type(value) is not str
        or not value
        or len(value) > 2048
        or value != value.strip()
        or any(char.isspace() or ord(char) < 32 for char in value)
        or any(char in value for char in ("*", "\\", "?", "#", "%"))
    ):
        raise AdminAuthorizationDenied
    try:
        parsed = urlsplit(value)
        if (
            parsed.scheme not in ("http", "https")
            or not parsed.hostname
            or parsed.username is not None
            or parsed.password is not None
            or parsed.path not in ("", "/")
            or parsed.query
            or parsed.fragment
        ):
            raise ValueError
        hostname = parsed.hostname.encode("idna").decode("ascii").lower()
        if ":" in hostname:
            hostname = "[" + str(ipaddress.IPv6Address(hostname)) + "]"
        elif not re.fullmatch(r"[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?", hostname):
            raise ValueError
        port = parsed.port
        if port is not None and not 1 <= port <= 65535:
            raise ValueError
        suffix = (
            ""
            if port is None or (parsed.scheme, port) in (("http", 80), ("https", 443))
            else f":{port}"
        )
        return f"{parsed.scheme}://{hostname}{suffix}"
    except (ValueError, UnicodeError):
        raise AdminAuthorizationDenied from None


def verified_dashboard_request(request, exact_path):
    """Reverify the real Host session, never an asset token or API-key grant."""
    try:
        if request.method != "POST" or request.path != exact_path:
            raise AdminAuthorizationDenied
        raw = request._request
        origin = normalize_origin(f"{raw.url.scheme}://{raw.url.netloc}")
        headers = request.headers
        auth, origins = headers.getlist("authorization"), headers.getlist("origin")
        if (
            len(auth) != 1
            or len(origins) != 1
            or type(auth[0]) is not str
            or headers.getlist("x-api-key")
            or len(headers.getlist("host")) > 1
            or normalize_origin(origins[0]) != origin
        ):
            raise AdminAuthorizationDenied
        match = re.fullmatch(
            r"Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)", auth[0]
        )
        if match is None or len(match[1]) > 8192:
            raise AdminAuthorizationDenied
        adapter = raw.app.state.dashboard_app_adapter
        if adapter._app is not raw.app:
            raise AdminAuthorizationDenied
        server = adapter._dashboard_server
        verifier = getattr(server, "_validate_dashboard_token", None)
        if (
            not inspect.ismethod(verifier)
            or verifier.__self__ is not server
            or inspect.iscoroutinefunction(verifier)
            or inspect.isgeneratorfunction(verifier)
            or inspect.isasyncgenfunction(verifier)
        ):
            raise AdminAuthorizationDenied
        inspect.signature(verifier).bind(match[1], exact_path)
        verification = verifier(match[1], exact_path)
        if inspect.isawaitable(verification):
            if inspect.iscoroutine(verification):
                verification.close()
            raise AdminAuthorizationDenied
        if type(verification) is not tuple or len(verification) != 2:
            raise AdminAuthorizationDenied
        payload, error = verification
        if (
            type(error) is not str
            or error != ""
            or type(payload) is not dict
            or "token_type" in payload
            or type(payload.get("exp")) is not int
            or payload["exp"] <= time()
            or type(payload.get("username")) is not str
            or not payload["username"].strip()
            or payload["username"] != request.username
            or raw.state.dashboard_g.username != request.username
            or raw.method != request.method
            or raw.url.path != exact_path
        ):
            raise AdminAuthorizationDenied
        return (
            raw,
            payload["username"],
            min(float(payload["exp"]), time() + REQUEST_TTL),
        )
    except AdminAuthorizationDenied:
        raise
    except Exception:
        raise AdminAuthorizationDenied from None


class DashboardRequestFence:
    """Bind one short-lived proof to one unchanged Host request and session."""

    def __init__(self, request, path, raw, subject, expiry):
        self.request, self.path, self.raw = request, path, raw
        self.subject, self.expiry = subject, expiry
        self.key = secrets.token_bytes(32)
        try:
            if (
                raw is None
                or type(subject) is not str
                or not subject.strip()
                or type(expiry) not in (int, float)
                or not isfinite(expiry)
                or expiry <= time()
            ):
                raise AdminAuthorizationDenied
            self.authorization, self.origin, self.server, self.verifier_function = (
                self._identity()
            )
        except Exception:
            raise AdminAuthorizationDenied from None

    def _identity(self):
        auth = self.request.headers.getlist("authorization")
        origins = self.request.headers.getlist("origin")
        if len(auth) != 1 or len(origins) != 1:
            raise AdminAuthorizationDenied
        server = self.request._request.app.state.dashboard_app_adapter._dashboard_server
        verifier = getattr(server, "_validate_dashboard_token", None)
        if not inspect.ismethod(verifier) or verifier.__self__ is not server:
            raise AdminAuthorizationDenied
        digest = hmac.digest(self.key, auth[0].encode("utf-8"), "sha256")
        return digest, origins[0], server, verifier.__func__

    def current(self):
        try:
            if time() >= self.expiry:
                return False
            raw, subject, expiry = verified_dashboard_request(self.request, self.path)
            digest, origin, server, function = self._identity()
            return (
                raw is self.raw
                and subject == self.subject
                and time() < min(expiry, self.expiry)
                and hmac.compare_digest(digest, self.authorization)
                and origin == self.origin
                and server is self.server
                and function is self.verifier_function
            )
        except Exception:
            return False


def _unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate management field")
        result[key] = value
    return result


def _invalid_number(_):
    raise ValueError("invalid management number")


def _check_json_shape(data):
    pending = [(data, 0)]
    while pending:
        value, depth = pending.pop()
        if depth > 16:
            raise ValueError("management body is too deeply nested")
        if type(value) is float and not isfinite(value):
            raise ValueError("invalid management number")
        if type(value) is dict:
            pending.extend((item, depth + 1) for item in value.values())
        elif type(value) is list:
            pending.extend((item, depth + 1) for item in value)


async def bounded_body(request):
    """Bound plugin processing, not Host allocation (its adapter may buffer first)."""
    headers = request.headers
    if headers.getlist("content-type") not in (
        ["application/json"],
        ["application/json; charset=utf-8"],
    ) or headers.getlist("content-encoding"):
        raise ValueError("invalid management body")
    lengths = headers.getlist("content-length")
    if lengths and (
        len(lengths) != 1
        or not re.fullmatch(r"[0-9]{1,7}", lengths[0])
        or int(lengths[0]) > BODY_LIMIT
        or headers.getlist("transfer-encoding")
    ):
        raise ValueError("invalid management body")
    body = bytearray()
    async for chunk in request._request.stream():
        if len(body) + len(chunk) > BODY_LIMIT:
            raise ValueError("management body is too large")
        body.extend(chunk)
    if lengths and len(body) != int(lengths[0]):
        raise ValueError("invalid management body length")
    try:
        data = json.loads(
            body.decode("utf-8"),
            object_pairs_hook=_unique_object,
            parse_constant=_invalid_number,
        )
        if type(data) is not dict:
            raise ValueError("management body requires an object")
        _check_json_shape(data)
    except (UnicodeError, RecursionError):
        raise ValueError("invalid management body") from None
    return data
