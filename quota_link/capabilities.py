"""Safe, credential-free descriptions of configured query capabilities."""

from __future__ import annotations

from .i18n import message as localized
from .models import WALLET_NAMES, ProviderType
from .settings import AccountDirectory

_PROVIDER_NAMES = {
    **WALLET_NAMES,
    ProviderType.DEEPSEEK: "DeepSeek",
    ProviderType.ALIBABA_BAILIAN: localized("capability.alibaba"),
    ProviderType.GRSAI: "Grsai",
    ProviderType.MEINIANDA: "Meinianda",
    ProviderType.OPENAI_COMPATIBLE: localized("capability.compatible"),
}
_BALANCE_KIND_NAMES = {
    "cash": localized("capability.cash"),
    "quota": localized("capability.quota"),
    "free_quota": localized("capability.free_quota"),
    "subscription": localized("capability.subscription"),
    "credits": localized("capability.credits"),
    "usage": localized("capability.usage"),
    "custom": localized("capability.custom"),
}
_SAFE_REASONS = {
    "invalid_wallet_region": localized("config.wallet_region"),
    "invalid_wallet_team": localized("config.wallet_team"),
    "invalid_wallet_origin": localized("config.wallet_origin"),
    "missing_environment_variable": localized("capability.credential_missing"),
    "missing_credentials": localized("capability.credential_missing"),
    "missing_grsai_token": localized("capability.grsai_token_missing"),
    "invalid_grsai_region": localized("capability.grsai_region"),
    "missing_endpoint": localized("config.missing_endpoint"),
    "missing_base_url": localized("capability.host_missing"),
    "missing_api_path": localized("capability.path_missing"),
    "invalid_endpoint": localized("capability.endpoint_invalid"),
    "invalid_base_url": localized("capability.host_invalid"),
    "invalid_api_path": localized("capability.path_invalid"),
    "invalid_response_mapping": localized("capability.mapping_invalid"),
    "invalid_balance_scope": localized("capability.scope_invalid"),
    "invalid_balance_kind": localized("capability.kind_invalid"),
    "invalid_service_profile": localized("capability.profile_invalid"),
}


def describe_capabilities(
    directory: AccountDirectory,
) -> list[dict[str, object]]:
    """Return enabled account capabilities without secrets or endpoint details."""
    descriptions: list[dict[str, object]] = []
    for entry in directory.entries:
        if not entry.enabled:
            continue
        provider = (
            "Grsai"
            if entry.provider_type is ProviderType.OPENAI_COMPATIBLE
            and entry.service_profile == "grsai"
            else _PROVIDER_NAMES[entry.provider_type]
        )
        if entry.provider_type is ProviderType.DEEPSEEK:
            balance_kind = localized("capability.deepseek_balance")
        elif entry.provider_type is ProviderType.ALIBABA_BAILIAN:
            balance_kind = localized("capability.alibaba_balance")
        elif entry.provider_type is ProviderType.MEINIANDA:
            balance_kind = localized("capability.meinianda_balance")
        else:
            balance_kind = _BALANCE_KIND_NAMES.get(
                entry.balance_kind, localized("capability.custom")
            )
        queryable = entry.queryable
        reason = None
        if not queryable:
            reason = _SAFE_REASONS.get(
                entry.unavailable_reason or "", localized("capability.unqueryable")
            )
        descriptions.append(
            {
                "id": entry.id,
                "display_name": entry.display_name,
                "provider": provider,
                "balance_kind": balance_kind,
                "balance_scope": entry.balance_scope,
                "queryable": queryable,
                "reason": reason,
            }
        )
    return descriptions
