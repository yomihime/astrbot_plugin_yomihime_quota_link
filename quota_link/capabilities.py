"""Safe, credential-free descriptions of configured query capabilities."""

from __future__ import annotations

from .models import ProviderType
from .settings import AccountDirectory

_PROVIDER_NAMES = {
    ProviderType.DEEPSEEK: "DeepSeek",
    ProviderType.ALIBABA_BAILIAN: "阿里云百炼",
    ProviderType.GRSAI: "Grsai",
    ProviderType.OPENAI_COMPATIBLE: "OpenAI 兼容服务",
}
_BALANCE_KIND_NAMES = {
    "cash": "现金余额",
    "quota": "额度",
    "free_quota": "免费额度",
    "subscription": "订阅额度",
    "credits": "积分",
    "usage": "用量",
    "custom": "用户配置的余额类别",
}
_SAFE_REASONS = {
    "missing_environment_variable": "未配置可用凭据",
    "missing_credentials": "未配置可用凭据",
    "missing_grsai_token": "未配置 Grsai 账户请求令牌",
    "invalid_grsai_region": "Grsai 节点配置无效",
    "missing_endpoint": "缺少余额查询端点",
    "missing_base_url": "缺少 HTTPS 服务根地址 Host",
    "missing_api_path": "缺少以 / 开头的相对 API Path",
    "invalid_endpoint": "余额查询端点配置无效",
    "invalid_base_url": "Host 配置无效",
    "invalid_api_path": "API Path 配置无效",
    "invalid_response_mapping": "余额字段映射未配置或无效",
    "invalid_balance_scope": "余额范围配置无效",
    "invalid_balance_kind": "Grsai 积分类别必须映射为 credits",
    "invalid_service_profile": "服务类型配置无效",
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
            balance_kind = "多币种账户余额"
        elif entry.provider_type is ProviderType.ALIBABA_BAILIAN:
            balance_kind = "阿里云账户现金余额（BSS）"
        else:
            balance_kind = _BALANCE_KIND_NAMES.get(
                entry.balance_kind, "用户配置的余额类别"
            )
        queryable = entry.queryable
        reason = None
        if not queryable:
            reason = _SAFE_REASONS.get(
                entry.unavailable_reason or "", "当前配置不可查询"
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
