"""Provider contracts and the set of provider types recognized by settings."""

from types import MappingProxyType
from typing import Mapping

from ..models import SUPPORTED_PROVIDER_TYPES, ProviderType
from .base import ProviderAdapter

# Types recognized by configuration stay separate from executable adapters.
# No real provider adapter is implemented in the framework phase.
IMPLEMENTED_ADAPTERS: Mapping[ProviderType, type[ProviderAdapter]] = MappingProxyType(
    {}
)

__all__ = ["IMPLEMENTED_ADAPTERS", "SUPPORTED_PROVIDER_TYPES", "ProviderType"]
