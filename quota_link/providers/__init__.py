"""Provider contracts and the set of provider types recognized by settings."""

from types import MappingProxyType
from typing import Mapping

from ..models import SUPPORTED_PROVIDER_TYPES, ProviderType
from .alibaba_bailian import AlibabaBailianAdapter
from .base import ProviderAdapter
from .deepseek import DeepSeekAdapter
from .meinianda import MeiniandaAdapter
from .openai_compatible import OpenAICompatibleAdapter
from .wallet_china import ADAPTERS as REGIONAL_WALLETS
from .wallet_global import ADAPTERS as GLOBAL_WALLETS
from .wallet_new_api import NEW_API_ADAPTER
from .wallet_plan import GLM_PLAN_ADAPTER, MINIMAX_PLAN_ADAPTER
from .wallet_pollinations import POLLINATIONS_ADAPTER
from .wallet_sub2api import SUB2API_ADAPTER

# Explicit instances keep provider support reviewable and avoid dynamic imports.
IMPLEMENTED_ADAPTERS: Mapping[ProviderType, ProviderAdapter] = MappingProxyType(
    {
        ProviderType.ALIBABA_BAILIAN: AlibabaBailianAdapter(),
        ProviderType.DEEPSEEK: DeepSeekAdapter(),
        ProviderType.GRSAI: OpenAICompatibleAdapter(),
        ProviderType.MEINIANDA: MeiniandaAdapter(),
        ProviderType.OPENAI_COMPATIBLE: OpenAICompatibleAdapter(),
        ProviderType.MINIMAX_PLAN: MINIMAX_PLAN_ADAPTER,
        ProviderType.GLM_PLAN: GLM_PLAN_ADAPTER,
        ProviderType.NEW_API: NEW_API_ADAPTER,
        ProviderType.POLLINATIONS: POLLINATIONS_ADAPTER,
        ProviderType.SUB2API: SUB2API_ADAPTER,
        **REGIONAL_WALLETS,
        **GLOBAL_WALLETS,
    }
)

__all__ = ["IMPLEMENTED_ADAPTERS", "SUPPORTED_PROVIDER_TYPES", "ProviderType"]
