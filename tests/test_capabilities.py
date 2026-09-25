from quota_link.capabilities import describe_capabilities
from quota_link.settings import load_settings


def _account(
    account_id,
    display_name,
    provider_type,
    *,
    auth,
    endpoint=None,
    response_mapping=None,
    enabled=True,
    **extra,
):
    return {
        "id": account_id,
        "type": provider_type,
        "display_name": display_name,
        "enabled": enabled,
        "auth": auth,
        "endpoint": endpoint,
        "response_mapping": response_mapping or {},
        **extra,
    }


def test_describe_capabilities_exposes_safe_enabled_account_metadata_only():
    settings = load_settings(
        {
            "providers": [
                _account(
                    "ds",
                    "My DeepSeek",
                    "deepseek",
                    auth={"api_key": "deepseek-secret"},
                ),
                _account(
                    "bailian",
                    "Bailian",
                    "alibaba_bailian",
                    auth={
                        "access_key_id": "ram-id",
                        "access_key_secret": "ram-secret",
                    },
                ),
                _account(
                    "third-party",
                    "Third party",
                    "openai_compatible",
                    auth={"api_key": "third-secret"},
                    endpoint={
                        "base_url": "https://example.invalid",
                        "path": "/balance",
                        "auth_mode": "bearer",
                    },
                    response_mapping={"amount_path": "/credits", "kind": "credits"},
                ),
                _account(
                    "missing",
                    "Needs setup",
                    "deepseek",
                    auth={},
                ),
                _account(
                    "disabled",
                    "Disabled",
                    "deepseek",
                    auth={"api_key": "disabled-secret"},
                    enabled=False,
                ),
            ]
        },
        environ={},
    )

    descriptions = describe_capabilities(settings.directory)

    assert [item["id"] for item in descriptions] == [
        "ds",
        "bailian",
        "third-party",
        "missing",
    ]
    assert descriptions[0]["provider"] == "DeepSeek"
    assert descriptions[0]["balance_kind"] == "多币种账户余额"
    assert descriptions[1]["provider"] == "阿里云百炼"
    assert descriptions[1]["balance_kind"] == "阿里云账户现金余额（BSS）"
    assert descriptions[2]["provider"] == "OpenAI 兼容服务"
    assert descriptions[2]["balance_kind"] == "积分"
    assert descriptions[2]["balance_scope"] == "generic"
    assert descriptions[3]["queryable"] is False
    assert descriptions[3]["reason"] == "未配置可用凭据"
    serialized = repr(descriptions)
    for secret in (
        "deepseek-secret",
        "ram-id",
        "ram-secret",
        "third-secret",
        "disabled-secret",
        "example.invalid",
        "api_key",
        "endpoint",
    ):
        assert secret not in serialized


def test_grsai_profile_scope_is_explicit_and_does_not_infer_configuration():
    settings = load_settings(
        {
            "providers": [
                _account(
                    "grsai-key",
                    "Grsai key",
                    "openai_compatible",
                    auth={"api_key": "some-key"},
                    service_profile="grsai",
                    balance_scope="api_key",
                    response_mapping={
                        "amount_path": "/credits",
                        "kind": "credits",
                    },
                )
            ]
        },
        environ={},
    )

    entry = describe_capabilities(settings.directory)[0]
    assert entry["provider"] == "Grsai"
    assert entry["balance_scope"] == "api_key"
    assert entry["queryable"] is False
    assert entry["reason"] == "余额范围配置无效"


def test_standalone_grsai_capability_uses_provider_identity_and_secret_safe_reason():
    settings = load_settings(
        {
            "providers": [
                _account(
                    "grsai-account",
                    "Grsai account",
                    "grsai",
                    auth={"token": "private-request-token"},
                    region="china",
                ),
                _account(
                    "grsai-missing",
                    "Grsai missing",
                    "grsai",
                    auth={},
                    region="china",
                ),
            ]
        },
        environ={},
    )
    capabilities = describe_capabilities(settings.directory)
    assert capabilities[0]["provider"] == "Grsai"
    assert capabilities[0]["balance_scope"] == "account"
    assert capabilities[0]["balance_kind"] == "积分"
    assert capabilities[0]["queryable"] is True
    assert capabilities[1]["queryable"] is False
    assert capabilities[1]["reason"] == "未配置 Grsai 账户请求令牌"
    assert "private-request-token" not in repr(capabilities)
    assert "example.invalid" not in repr(capabilities)


def test_capability_description_never_echoes_unknown_configured_kind():
    settings = load_settings(
        {
            "providers": [
                _account(
                    "third-party",
                    "Third party",
                    "openai_compatible",
                    auth={"api_key": "some-key"},
                    endpoint={
                        "url": "https://example.invalid/balance",
                        "auth_mode": "bearer",
                    },
                    response_mapping={
                        "amount_path": "/balance",
                        "kind": "sensitive-secret-value",
                    },
                )
            ]
        },
        environ={},
    )

    descriptions = describe_capabilities(settings.directory)
    assert descriptions[0]["balance_kind"] == "用户配置的余额类别"
    assert "sensitive-secret-value" not in repr(descriptions)
