"""Safe, bounded asynchronous HTTP transport for provider adapters."""

from __future__ import annotations

import asyncio
import json as json_module
import math
import random
import time
from collections.abc import Callable, Mapping
from decimal import Decimal
from email.utils import parsedate_to_datetime
from typing import TYPE_CHECKING, Any, Literal
from urllib.parse import urlsplit

import httpx

if TYPE_CHECKING:
    from .providers.base import ProviderResponse


class HttpStatusError(Exception):
    """An HTTP response had a non-success status."""

    def __init__(
        self, status_code: int, response: ProviderResponse | None = None
    ) -> None:
        self.status_code = status_code
        self._response = response
        self.retry_after_seconds = getattr(response, "retry_after_seconds", None)
        super().__init__(f"Provider returned HTTP status {status_code}")

    @property
    def response(self) -> ProviderResponse | None:
        """Safe response facade for inspecting provider business error data."""
        return self._response


class HttpTransportError(Exception):
    """A connection or timeout failure occurred during a request."""

    def __init__(self, kind: Literal["timeout", "connection"]) -> None:
        self.kind = kind
        super().__init__(f"Provider request failed ({kind})")


class HttpResponseParseError(Exception):
    """The response body was not valid JSON."""

    def __init__(self) -> None:
        super().__init__("Provider returned invalid JSON")


class HttpRequestError(Exception):
    """A request could not be sent because of a safe local validation error."""

    def __init__(
        self,
        kind: Literal["insecure_scheme", "params_conflict", "closed"],
    ) -> None:
        self.kind = kind
        messages = {
            "insecure_scheme": "Provider requests require HTTPS",
            "params_conflict": "params and params_factory cannot be combined",
            "closed": "Provider HTTP client is closed",
        }
        super().__init__(messages[kind])


class _ProviderResponse:
    """Response facade that exposes only safe, parsed data."""

    def __init__(self, response: httpx.Response, *, now: float | None = None) -> None:
        self._status_code = response.status_code
        self._content = response.content
        self.retry_after_seconds = _retry_after(
            response.headers.get("Retry-After"), time.time() if now is None else now
        )

    @property
    def status_code(self) -> int:
        return self._status_code

    def json(self) -> Any:
        try:
            return json_module.loads(self._content, parse_float=Decimal)
        except (json_module.JSONDecodeError, UnicodeDecodeError):
            raise HttpResponseParseError() from None


class HttpProviderClient:
    """One shared AsyncClient with HTTPS, bounded retry, and safe failures."""

    def __init__(
        self,
        timeout: float = 10.0,
        retry_delay: float = 1.0,
        client: httpx.AsyncClient | None = None,
        *,
        sleep=asyncio.sleep,
        jitter=random.random,
        wall_clock=time.time,
    ) -> None:
        self._timeout = timeout
        self._retry_delay = retry_delay
        self._client = client or httpx.AsyncClient(follow_redirects=False)
        self._closed = False
        self._sleep = sleep
        self._jitter = jitter
        self._wall_clock = wall_clock

    async def request(
        self,
        method: str,
        url: str,
        *,
        headers: Mapping[str, str] | None = None,
        params: Mapping[str, str] | None = None,
        json: Any = None,
        timeout: float | None = None,
        params_factory: Callable[[], Mapping[str, str]] | None = None,
    ) -> _ProviderResponse:
        if self._closed:
            raise HttpRequestError("closed")
        if params is not None and params_factory is not None:
            raise HttpRequestError("params_conflict")
        try:
            scheme = urlsplit(url).scheme.lower()
        except ValueError:
            scheme = ""
        if scheme != "https":
            raise HttpRequestError("insecure_scheme")

        for attempt in range(2):
            if self._closed:
                raise HttpRequestError("closed")
            request_params = params_factory() if params_factory else params
            try:
                response = await self._client.request(
                    method,
                    url,
                    headers=headers,
                    params=request_params,
                    json=json,
                    timeout=self._timeout if timeout is None else timeout,
                    follow_redirects=False,
                )
            except asyncio.CancelledError:
                raise
            except httpx.TimeoutException:
                if attempt == 0:
                    await self._sleep(
                        self._retry_delay * (2**attempt) * (1 + 0.2 * self._jitter())
                    )
                    continue
                raise HttpTransportError("timeout") from None
            except httpx.ConnectError:
                if attempt == 0:
                    await self._sleep(
                        self._retry_delay * (2**attempt) * (1 + 0.2 * self._jitter())
                    )
                    continue
                raise HttpTransportError("connection") from None

            # 429 is returned immediately to the shared provider budget. Never
            # retry it inside a request and collide across accounts.
            facade = _ProviderResponse(response, now=self._wall_clock())
            if self._closed:
                raise HttpRequestError("closed")
            if (
                500 <= response.status_code <= 599
                and facade.retry_after_seconds is None
            ):
                if attempt == 0:
                    await self._sleep(
                        self._retry_delay * (2**attempt) * (1 + 0.2 * self._jitter())
                    )
                    continue
            if not 200 <= response.status_code < 300:
                raise HttpStatusError(response.status_code, facade) from None
            return facade

        # The loop always returns or raises. This keeps static checkers aware of
        # the return type without retaining any low-level exception details.
        raise HttpTransportError("connection")

    async def close(self) -> None:
        """Close the managed HTTP session. Repeated calls are harmless."""
        if self._closed:
            return
        self._closed = True
        await self._client.aclose()


def _retry_after(value: str | None, now: float) -> float | None:
    """Preserve delay-seconds or HTTP-date without retaining arbitrary headers."""
    if value is None:
        return None
    try:
        stripped = value.strip()
        if stripped.isascii() and stripped.isdigit():
            delay = float(stripped)
        else:
            timestamp = parsedate_to_datetime(stripped)
            if timestamp.tzinfo is None:
                return None
            delay = max(0.0, timestamp.timestamp() - now)
        return delay if math.isfinite(delay) and delay >= 0 else None
    except (ValueError, TypeError, OverflowError):
        return None
