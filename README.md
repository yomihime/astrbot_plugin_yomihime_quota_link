# 如月怜的额度连结

AstrBot 插件，用于查询已配置 AI 服务账户的余额或用量。当前支持三类配置：DeepSeek、阿里云百炼关联的阿里云账户现金余额，以及用户自行描述只读余额端点的 OpenAI 兼容适配器。结果保留供应商提供的单位和数据含义，不做货币换算。

## 安装

在 AstrBot WebUI 的插件管理中，使用以下仓库地址安装：

```text
https://github.com/yomihime/astrbot_plugin_yomihime_quota_link
```

安装并启用插件后，在插件配置中添加账户。修改配置后通过 AstrBot 重载插件使设置生效。

## 查询

| 命令 | 用途 |
| --- | --- |
| `/yql` 或 `/yql all` | 查询所有已启用账户 |
| `/yql <账户名>` | 查询指定账户（也可用配置的 ID 或别名） |
| `/yql provider <供应商名>` | 查询某类供应商的账户 |
| `/yql help` | 查看插件帮助 |
| `/yql status` | 查看本地配置状态，不发起网络请求 |

也可以发送“余额还剩多少”“查 DeepSeek 余额”或“查看 <账户名> 的额度”等自然语言问题。未指定目标时会查询所有账户。命令前缀和唤醒方式以 AstrBot 配置为准。

私聊默认允许查询。群聊查询默认关闭；只有设置 `allow_group_queries` 为 `true` 后才开放给管理员及 `group_allowed_user_ids` 中的用户。

## 配置账户

在 AstrBot 插件配置的 `providers` 列表中添加账户。每个账户应有唯一 `id`、`display_name`、`type` 和凭据；`aliases` 可添加命令或自然语言匹配名称。密钥字段支持 `${ENV_VAR}` 引用，插件从 AstrBot 进程环境读取对应变量。请在运行 AstrBot 的环境中设置变量，不要把真实密钥写进公开文件或聊天。

下面是 DeepSeek 与阿里云账户的结构示意。请在 AstrBot 配置界面填写等价字段；这里的环境变量名称只是示例，不能代替你自己的密钥配置。

```json
{
  "providers": [
    {
      "id": "deepseek-main",
      "type": "deepseek",
      "display_name": "DeepSeek 主账户",
      "aliases": ["ds"],
      "auth": { "api_key": "${DEEPSEEK_API_KEY}" }
    },
    {
      "id": "aliyun-cash",
      "type": "alibaba_bailian",
      "display_name": "阿里云账户现金",
      "auth": {
        "access_key_id": "${ALIYUN_ACCESS_KEY_ID}",
        "access_key_secret": "${ALIYUN_ACCESS_KEY_SECRET}"
      }
    }
  ]
}
```

账户也可设置 `enabled`、`timeout_seconds` 和 `cache_ttl_seconds`。默认请求超时为 8 秒、成功结果缓存 60 秒；全局配置 `total_timeout_seconds` 默认 30 秒，`max_concurrency` 默认 4。超时和缓存时长必须为正数。

### DeepSeek

需要 DeepSeek API Key。插件通过官方 `GET https://api.deepseek.com/user/balance` 余额接口查询，不调用模型生成接口。结果按币种分别显示总可用余额、未过期赠金余额和充值余额；总额已包含两个分项，不要相加。`is_available` 表示当前账户是否有余额可供 API 调用；不可用状态不会伪装成零余额。[DeepSeek 余额接口文档](https://api-docs.deepseek.com/api/get-user-balance/)

### 阿里云百炼关联账户

本适配器读取的是**中国大陆阿里云账户 BSS 现金余额**，不是百炼模型 Key 的 token、免费额度、资源包或套餐用量。需要独立的 RAM AccessKey ID 和 Secret，并授予账户余额只读访问权限。DashScope/百炼 API Key 不能替代阿里云 AccessKey。官方材料对单项 RAM action 的拼写有差异，请在自己的 RAM 权限配置中核实授权项；不要授予充值或其他写权限。插件只展示 `AvailableCashAmount` 和币种，不会拿其他额度字段补成现金余额。[QueryAccountBalance 接口文档](https://help.aliyun.com/zh/user-center/developer-reference/api-bssopenapi-2017-12-14-queryaccountbalance) · [阿里云费用与成本 RAM 权限说明](https://help.aliyun.com/zh/user-center/ram-policies-for-billing-management)

### OpenAI 兼容余额端点（含 Grsai）

此类型要求你依据余额 API 文档填写一个 HTTPS 只读端点和对应响应映射。它只查询配置的余额端点，不会调用聊天或模型生成接口。手工配置时必须显式填写 `endpoint.auth_mode`，可选 `bearer`、`header` 或 `query`（WebUI schema 默认值为 `bearer`）；不能依赖省略该字段时自动选择认证方式。方法只能是 GET，或经你核实无副作用的 POST。POST 仅接受静态 JSON 查询体，不支持模板、表达式或把凭据放入请求体。

以下是**人工通用结构示例，不是可运行配置，也不是任何供应商的接口预设**。`example.invalid` 是保留的无效示例域名；路径、字段和返回体也都是占位内容。必须从目标服务商文档确认实际值后再配置。

```json
{
  "id": "compatible-example",
  "type": "openai_compatible",
  "display_name": "兼容余额示例",
  "auth": { "api_key": "${COMPATIBLE_BALANCE_KEY}" },
  "endpoint": {
    "url": "https://balance.example.invalid/v1/account/balance",
    "method": "GET",
    "auth_mode": "bearer"
  },
  "response_mapping": {
    "amount_path": "/data/remaining",
    "unit": "credits",
    "kind": "credits"
  }
}
```

这里的示意响应结构可写作 `{"data":{"remaining":12.5}}`，仅用于说明 `amount_path` 映射含义。实际响应字段、金额语义和单位都须按服务商文档配置，插件不会猜字段。映射路径使用 JSON Pointer，例如 `/data/remaining`；可选配置 `total_path`、`remaining_path`、`used_path`、`unit_path`、`kind_path`、`status_path`、`status_values`、`expires_at_path`，以及供应商有明确业务成功/失败字段时的 `success_path`/`success_value`、`failure_path`/`failure_value`。`unit` 是固定展示单位，`kind` 可设为 `cash`、`quota`、`free_quota`、`subscription`、`credits`、`usage` 或 `custom`。

Grsai 官方旧版中文文档列出了账户积分查询 `POST /client/openapi/getCredits`，但仅能确认用途、方法和路径。目标节点 host、认证、请求体和响应结构尚未核实，因此这里不提供声称可运行的 Grsai 预设。请先从目标节点的官方文档或经核实的账户信息确认这些细节，再按上面的通用字段配置；若需要 POST，只能填写官方确认的静态只读请求体。Grsai 账户积分和 API Key 积分是不同范围，不能互相替代，也不能换算为货币。[Grsai 官方中文其他 API 文档](https://grsai.ai/zh/dashboard/documents/other)

## 数据、缓存与错误

- 每个账户独立查询。成功结果按账户和配置缓存，默认 60 秒；失败结果不缓存。查询结果会标注获取时间和数据来源。
- 单账户默认最多等待 8 秒，一次全账户查询默认最多等待 30 秒，同时查询数默认上限为 4。传输仅对连接/超时、HTTP 429 和 5xx 做一次有限重试；认证、权限、端点、业务或响应解析错误不会重试。
- 一个账户失败不会替代其他账户结果。错误会归类为配置、认证、权限、限流、暂时不可用或响应格式问题；不会把余额缺失补成零。
- DeepSeek 各币种分别显示，不跨币种求和。阿里云只显示现金余额。兼容接口按配置的映射与固定单位展示，不自动推断 total、remaining、used 的含义。
- 重载会重新读取配置并重建缓存与 HTTP 客户端；插件关闭或卸载时会取消未完成查询、清除缓存并关闭 HTTP 客户端。

## 故障排查

1. 运行 `/yql status` 查看账户是否启用、是否可查询及安全的配置诊断；该命令不会查询供应商。
2. 若提示缺少环境变量，检查变量是否设置在 AstrBot 进程环境中，并确认配置写成完整形式 `${VARIABLE_NAME}`，随后重载插件。
3. DeepSeek 查询失败时，检查 API Key 和账户 API 可用状态；HTTP 401 表示认证失败，429 表示请求过快。
4. 阿里云失败时，确认配置的是 RAM AccessKey ID/Secret 而非 DashScope Key，并核对 RAM 账户余额读取权限和账号适用性。缺少 `AvailableCashAmount` 不会回退到“可用额度”。
5. 兼容接口失败时，核对 HTTPS host、只读 method/path、认证位置、JSON Pointer 路径和固定单位；不要把聊天地址用作余额地址。Grsai 在目标节点协议字段未核实前无法完成有效配置。
6. 检查端点可达性和账户/全局超时设置。配置调整后重载插件；若显示缓存结果，等待对应缓存时长后再次查询。

## 开发

本项目面向 Python 3.12+ 和 AstrBot 4.16+。本说明仅描述实现与配置边界，不表示三类供应商都已通过真实账户验证；特别是阿里云现金查询依赖具备相应权限的 RAM 凭据，Grsai 的完整协议信息仍待目标节点确认。

提交前可运行：

```bash
ruff check .
ruff format --check .
```

### 构建插件包

本地构建需要 Python 3.12+。构建脚本会检查指定 tag 与 `metadata.yaml` 中的 `version` 完全一致，并生成以 tag 命名的 ZIP；ZIP 根目录直接是插件文件。

```bash
python scripts/build_plugin.py --tag v0.1.0 --output-dir dist
```

示例产物为 `dist/astrbot_plugin_yomihime_quota_link-v0.1.0.zip`。推送新的 `v*` tag 后，GitHub Actions 会运行代码检查和测试，再构建相同的 ZIP，并将其上传到该次工作流的 **Artifacts** 供下载。本工作流只上传 Actions artifact，不会自动创建 GitHub Release，也不会自动创建或修改 tag、更新元数据版本。创建 tag 前，请先提交与该 tag 完全一致的 `metadata.yaml` 版本和更新记录。构建通过只表示代码检查与打包通过，不表示三类供应商的真实账户余额均已验收；当前阿里云现金和 Grsai 协议仍存在上述实测限制。

插件持久化数据应写入 AstrBot 的 `data` 目录，不要写入插件源码目录。

## 许可证

本项目采用 [AGPL-3.0](LICENSE) 许可证。
