"""Small async contracts shared by future balance provider adapters."""

from collections.abc import Callable, Mapping
from typing import Any, Protocol, runtime_checkable

from ..models import BalanceSnapshot


@runtime_checkable
class ProviderResponse(Protocol):
    """Minimal response shape consumed by an adapter."""

    @property
    def status_code(self) -> int: ...

    def json(self) -> Any: ...


@runtime_checkable
class AsyncProviderClient(Protocol):
    """Minimal request capability needed by future async adapters."""

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
    ) -> ProviderResponse: ...

    async def close(self) -> None: ...


@runtime_checkable
class ProviderAdapter(Protocol):
    """Convert one configured account's provider response into a snapshot."""

    async def fetch_balance(
        self, account: Any, client: AsyncProviderClient
    ) -> BalanceSnapshot: ...
