import asyncio
from decimal import Decimal
from typing import Any

from quota_link.models import (
    BalanceItem,
    BalanceItemKind,
    BalanceSnapshot,
    ProviderType,
    SnapshotStatus,
)
from quota_link.providers import IMPLEMENTED_ADAPTERS, SUPPORTED_PROVIDER_TYPES
from quota_link.providers.alibaba_bailian import AlibabaBailianAdapter
from quota_link.providers.base import (
    AsyncProviderClient,
    ProviderAdapter,
    ProviderResponse,
)
from quota_link.providers.deepseek import DeepSeekAdapter
from quota_link.providers.openai_compatible import OpenAICompatibleAdapter


class FakeResponse:
    status_code = 200

    def json(self) -> Any:
        return {"remaining": "12.3400"}


class FakeClient:
    async def request(self, method: str, url: str, **kwargs: Any) -> FakeResponse:
        assert method == "GET"
        assert url == "https://example.invalid/balance"
        return FakeResponse()

    async def close(self) -> None:
        pass


class ExampleAdapter:
    async def fetch_balance(
        self, account: Any, client: AsyncProviderClient
    ) -> BalanceSnapshot:
        response = await client.request("GET", account["url"], timeout=1.0)
        amount = Decimal(response.json()["remaining"])
        from datetime import UTC, datetime

        return BalanceSnapshot(
            account_id=account["id"],
            provider_type=ProviderType.DEEPSEEK,
            display_name="test account",
            status=SnapshotStatus.AVAILABLE,
            balances=(BalanceItem(BalanceItemKind.QUOTA, remaining=amount),),
            source="test fixture",
            fetched_at=datetime.now(UTC),
        )


def test_adapter_protocol_can_consume_async_client_without_network():
    adapter: ProviderAdapter = ExampleAdapter()
    client = FakeClient()
    assert isinstance(client, AsyncProviderClient)
    assert isinstance(FakeResponse(), ProviderResponse)

    snapshot = asyncio.run(
        adapter.fetch_balance(
            {"id": "ds-main", "url": "https://example.invalid/balance"}, client
        )
    )

    assert snapshot.account_id == "ds-main"
    assert snapshot.balances[0].remaining == Decimal("12.3400")


def test_recognized_provider_types_have_explicit_stateless_adapters():
    assert len(SUPPORTED_PROVIDER_TYPES) == 3
    assert set(IMPLEMENTED_ADAPTERS) == set(SUPPORTED_PROVIDER_TYPES)
    assert isinstance(IMPLEMENTED_ADAPTERS[ProviderType.DEEPSEEK], DeepSeekAdapter)
    assert isinstance(
        IMPLEMENTED_ADAPTERS[ProviderType.ALIBABA_BAILIAN], AlibabaBailianAdapter
    )
    assert isinstance(
        IMPLEMENTED_ADAPTERS[ProviderType.OPENAI_COMPATIBLE],
        OpenAICompatibleAdapter,
    )
