"""Safe, bounded asynchronous HTTP transport for provider adapters."""

from __future__ import annotations

import asyncio
import json as json_module
from collections.abc import Callable, Mapping
from decimal import Decimal
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

    def __init__(self, response: httpx.Response) -> None:
        self._status_code = response.status_code
        self._content = response.content

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
        retry_delay: float = 0.05,
        client: httpx.AsyncClient | None = None,
    ) -> None:
        self._timeout = timeout
        self._retry_delay = retry_delay
        self._client = client or httpx.AsyncClient(follow_redirects=False)
        self._closed = False

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
                    await asyncio.sleep(self._retry_delay)
                    continue
                raise HttpTransportError("timeout") from None
            except httpx.ConnectError:
                if attempt == 0:
                    await asyncio.sleep(self._retry_delay)
                    continue
                raise HttpTransportError("connection") from None

            if response.status_code == 429 or 500 <= response.status_code <= 599:
                if attempt == 0:
                    await asyncio.sleep(self._retry_delay)
                    continue
            if not 200 <= response.status_code < 300:
                raise HttpStatusError(
                    response.status_code, _ProviderResponse(response)
                ) from None
            return _ProviderResponse(response)

        # The loop always returns or raises. This keeps static checkers aware of
        # the return type without retaining any low-level exception details.
        raise HttpTransportError("connection")

    async def close(self) -> None:
        """Close the managed HTTP session. Repeated calls are harmless."""
        if self._closed:
            return
        self._closed = True
        await self._client.aclose()
