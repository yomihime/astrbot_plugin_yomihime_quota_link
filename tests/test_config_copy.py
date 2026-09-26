import json
from pathlib import Path


def _schema() -> dict:
    return json.loads(Path("_conf_schema.json").read_text(encoding="utf-8"))


def _walk_fields(value: dict):
    for key, item in value.items():
        if not isinstance(item, dict):
            continue
        if "type" in item and "description" in item:
            yield key, item
        yield from _walk_fields(item)


def test_provider_menu_has_plain_short_names_and_hints():
    providers = _schema()["providers"]
    templates = providers["templates"]
    assert list(templates) == [
        "deepseek",
        "alibaba_bailian",
        "grsai",
        "openai_compatible",
        "provider_account",
    ]
    assert [template["name"] for template in templates.values()] == [
        "DeepSeek",
        "阿里云百炼",
        "Grsai",
        "其他兼容服务",
        "旧版通用账户",
    ]
    assert len(providers["description"]) <= 20
    assert all(len(template["hint"]) <= 20 for template in templates.values())
    assert all(template.get("hide_hint_in_list") for template in templates.values())


def test_visible_field_labels_are_short_and_detail_moves_to_hint():
    templates = _schema()["providers"]["templates"]
    for template in templates.values():
        for name, item in _walk_fields(template["items"]):
            if item.get("invisible"):
                continue
            assert len(item["description"]) <= 20, name

    bailian_key = templates["alibaba_bailian"]["items"]["auth"]["items"][
        "access_key_id"
    ]
    assert "AliyunBSSReadOnlyAccess" in bailian_key["hint"]
    assert "DashScope" in bailian_key["hint"]
    compatible = templates["openai_compatible"]["items"]
    assert "模型接口兼容不代表余额接口通用" in compatible["service_profile"]["hint"]
    assert (
        "https://api.example.invalid"
        in compatible["endpoint"]["items"]["base_url"]["hint"]
    )
    assert "/account/balance" in compatible["endpoint"]["items"]["path"]["hint"]
    assert "amount_path 必需" in compatible["response_mapping"]["hint"]
    assert (
        "Grsai 账户积分预设忽略此栏" in compatible["auth"]["items"]["api_key"]["hint"]
    )
    assert (
        "新建 Grsai 条目并禁用旧条目"
        in templates["provider_account"]["items"]["type"]["hint"]
    )


def test_grsai_native_form_uses_region_and_token_without_host_field():
    templates = _schema()["providers"]["templates"]
    grsai = templates["grsai"]["items"]
    assert grsai["type"]["default"] == "grsai"
    assert grsai["service_profile"]["default"] == "grsai"
    assert grsai["balance_scope"]["default"] == "account"
    assert "endpoint" not in grsai
    assert grsai["region"]["default"] == "china"
    assert grsai["region"]["options"] == ["china", "global"]
    assert grsai["region"]["labels"] == ["国内直连", "海外节点"]
    assert "服务器地址" in grsai["region"]["hint"]
    assert set(grsai["auth"]["items"]) == {"token"}
    assert grsai["auth"]["items"]["token"]["secret"] is True


def test_generic_compatibility_options_remain_available():
    templates = _schema()["providers"]["templates"]
    compatible = templates["openai_compatible"]["items"]
    assert compatible["service_profile"]["options"] == ["generic", "grsai"]
    assert compatible["balance_scope"]["options"] == ["generic", "account", "api_key"]
    assert compatible["auth"]["items"]["token"]["secret"] is True
    assert compatible["auth"]["items"]["token"]["condition"] == {
        "service_profile": "grsai",
        "balance_scope": "account",
    }
    assert "url" not in compatible["endpoint"]["items"]
    assert compatible["response_mapping"]["condition"] == {"advanced_options": True}
    legacy = templates["provider_account"]["items"]
    assert "url" in legacy["endpoint"]["items"]
    assert "token" not in legacy["auth"]["items"]


def test_public_schema_does_not_embed_grsai_host():
    schema_text = Path("_conf_schema.json").read_text(encoding="utf-8").lower()
    assert "grsai.ai" not in schema_text
    assert "grsaiapi.com" not in schema_text
    assert "grsai.dakka.com.cn" not in schema_text


def test_access_form_defaults_to_admin_and_documents_private_identity_format():
    schema = _schema()

    assert schema["command_admin_only"]["default"] is True
    assert schema["private_allowed_user_ids"]["default"] == []
    assert "平台名:用户ID" in schema["private_allowed_user_ids"]["hint"]
