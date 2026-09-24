"""Provider contracts and the set of provider types recognized by settings."""

from types import MappingProxyType
from typing import Mapping

from ..models import SUPPORTED_PROVIDER_TYPES, ProviderType
from .alibaba_bailian import AlibabaBailianAdapter
from .base import ProviderAdapter
from .deepseek import DeepSeekAdapter
from .openai_compatible import OpenAICompatibleAdapter

# Explicit instances keep provider support reviewable and avoid dynamic imports.
IMPLEMENTED_ADAPTERS: Mapping[ProviderType, ProviderAdapter] = MappingProxyType(
    {
        ProviderType.ALIBABA_BAILIAN: AlibabaBailianAdapter(),
        ProviderType.DEEPSEEK: DeepSeekAdapter(),
        ProviderType.OPENAI_COMPATIBLE: OpenAICompatibleAdapter(),
    }
)

__all__ = ["IMPLEMENTED_ADAPTERS", "SUPPORTED_PROVIDER_TYPES", "ProviderType"]
