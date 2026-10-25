# 如月怜的额度连结

AstrBot 插件，用于查询已配置 AI 服务账户的余额或用量。当前提供 DeepSeek、阿里云百炼（查询阿里云账户现金余额 BSS）、Grsai 账户积分、Meinianda 账户站内额度预设和 OpenAI 兼容服务 / 第三方服务配置。结果保留各接口的数据含义，不做货币换算。

## 安装

在 AstrBot WebUI 的插件管理中，使用以下仓库地址安装：

```text
https://github.com/yomihime/astrbot_plugin_yomihime_quota_link
```

安装并启用插件后，登录 AstrBot Dashboard，打开本插件的「00-quota-link」页面。插件设置仅展示管理页面启用开关；账户、供应商、全局超时与查询权限都在插件页面管理，保存成功后立即重建运行时与缓存。

## 查询

| 命令 | 用途 |
| --- | --- |
| `/yql` 或 `/yql all` | 查询所有已启用账户 |
| `/yql <账户名>` | 查询指定账户（也可用配置的 ID 或别名） |
| `/yql provider <供应商名>` | 查询某类供应商的账户 |
| `/yql help` | 查看插件帮助 |
| `/yql status` | 查看本地配置状态，不发起网络请求 |

在启用函数工具且聊天模型支持工具调用的 AstrBot AI 对话中，也可以说“余额还剩多少”“查 DeepSeek 余额”或“查看 <账户名> 的额度”。模型按需要调用 `yql_query_balance`，并传入账户名、供应商名或 `all`；插件不再监听固定关键词自动回复。工具是否被调用由模型和 AstrBot 的函数工具设置决定；需要确定执行时可使用 `/yql`。命令前缀和唤醒方式以 AstrBot 配置为准。[AstrBot 函数工具说明](https://docs.astrbot.app/use/function-calling.html)

`/yql` 命令默认仅管理员可用，包括 `/yql help` 和 `/yql status`。需要开放命令时，可将 `command_admin_only` 设为 `false`；此开关不会放宽自然语言工具调用的私聊权限。

私聊中的自然语言工具查询默认仅管理员可用。可在 `private_allowed_user_ids` 中明确加入非管理员，格式必须是完整的 `平台名:用户ID`（例如 `aiocqhttp:123456`），避免不同平台的相同用户 ID 混用。白名单不会绕过 `/yql` 的管理员限制；若关闭 `command_admin_only`，白名单用户也可在私聊使用命令。群聊查询仍默认关闭；只有设置 `allow_group_queries` 为 `true` 后才开放给管理员及 `group_allowed_user_ids` 中的用户。

## 配置账户

在插件页面的账户区添加 DeepSeek、阿里云百炼、Grsai、Meinianda 或其他兼容服务。每个账户有唯一 `id`、显示名称和可选别名。现有账户的 ID 与供应商类型不可重绑；需要更换供应商时请新建账户。普通设置保存与凭据替换/清除是不同操作，普通保存不会写入或回显凭据。

凭据区域只显示是否已配置、来源为加密存储或环境变量，不提供读取原值的接口。填写新值后单独确认替换，或选择环境变量并填写变量名称（不是变量的值）；原有 `${ENV_VAR}` 引用在迁移时保持为环境引用。不要把真实密钥写进普通字段、公开文件或聊天。账户页沿用 Game Link 的 Oil 明暗主题、组件与交互。

其他兼容服务模板把 **Host** 和 **API Path** 分开填写。Host 是 HTTPS 服务根地址；API Path 是以 `/` 开头的路径。配置页中的 `https://api.example.invalid` 与 `/account/balance` 仅展示填写格式；域名不可访问，路径也是占位值。Grsai 独立模板只需填写请求令牌并选择国内或海外连接区域，官方服务器地址由插件内置，路径、方法和响应解析也由插件固定。模型 API 兼容不代表余额 API 兼容；其他服务须依据余额接口文档配置。认证方式、请求方法和响应映射位于“高级设置”中；通用服务缺少协议资料时会在 `/yql status` 标为不可查询。

旧版本升级后不会自动移动或删除凭据。页面先展示无凭据内容的迁移预览，必须明确确认才会先写入加密数据和引用，再清理旧插件配置。若旧配置保存失败，页面显示清理待完成，使用确认后的清理重试；不会重新导入覆盖已有保险库。旧字段在宿主 schema 中仅隐藏保留，因为 AstrBot 会在插件启动前删除未知字段。迁移前，旧配置中的明文仍存在，隐藏和 `secret` 标记都不是加密。完整边界、备份与恢复说明见 [安全与迁移](docs/SECURITY.md)。

下面是 DeepSeek 与阿里云账户的结构示意。这些是旧配置的结构示意，仅用于理解供应商字段和迁移；新配置请使用插件页面及独立凭据操作，不要把这些 auth 字段粘贴到普通设置中。这里的环境变量名称只是示例。

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
      "display_name": "阿里云账户现金余额（BSS）",
      "auth": {
        "access_key_id": "${ALIYUN_ACCESS_KEY_ID}",
        "access_key_secret": "${ALIYUN_ACCESS_KEY_SECRET}"
      }
    }
  ]
}
```

账户也可设置 `enabled`、`timeout_seconds` 和 `cache_ttl_seconds`。默认请求超时为 8 秒、成功结果缓存 60 秒；全局配置 `total_timeout_seconds` 默认 30 秒，`max_concurrency` 默认 4。超时和缓存时长必须为正数；管理页限制单次超时不超过 120 秒，总超时不超过 300 秒，并发不超过 32，缓存不超过 86400 秒，最多 100 个账户。

### DeepSeek

需要 DeepSeek API Key。插件通过官方 `GET https://api.deepseek.com/user/balance` 余额接口查询，不调用模型生成接口。结果按币种分别显示总可用余额、未过期赠金余额和充值余额；总额已包含两个分项，不要相加。`is_available` 表示当前账户是否有余额可供 API 调用；不可用状态不会伪装成零余额。[DeepSeek 余额接口文档](https://api-docs.deepseek.com/api/get-user-balance/)

### 阿里云百炼

本适配器读取的是**阿里云账户现金余额（BSS）**，不是百炼模型 Key 的 token、免费额度、资源包或套餐用量。需要独立的 RAM AccessKey ID 和 Secret；RAM 身份至少授予阿里云费用与成本只读系统策略 `AliyunBSSReadOnlyAccess`。DashScope/百炼 API Key 不能替代阿里云 AccessKey。不要授予充值或其他写权限。插件只展示 `AvailableCashAmount` 和币种，不会拿其他额度字段补成现金余额。[QueryAccountBalance 接口文档](https://help.aliyun.com/zh/user-center/developer-reference/api-bssopenapi-2017-12-14-queryaccountbalance) · [AliyunBSSReadOnlyAccess 策略说明](https://help.aliyun.com/zh/ram/developer-reference/aliyunbssreadonlyaccess)

### OpenAI 兼容服务 / 第三方服务

此模板提供 Host、API Path 和 API Key 凭据栏。它只查询配置的余额端点，不会调用聊天或模型生成接口。**OpenAI 模型调用协议兼容不代表余额接口通用**：Host、路径、HTTP 方法、认证位置、请求体和响应结构均须依据目标余额服务文档填写。点开“高级设置”后才能编辑认证位置、请求方法、可选 JSON 请求体和响应映射。POST 仅能用于已确认无副作用的只读接口；请求体只接受静态 JSON 对象，不支持模板、表达式或凭据。

格式示意（不是可运行配置或供应商预设）：

```json
{
  "id": "compatible-example",
  "type": "openai_compatible",
  "service_profile": "generic",
  "display_name": "兼容余额示例",
  "auth": { "api_key": "${BALANCE_API_KEY}" },
  "endpoint": {
    "base_url": "https://api.example.invalid",
    "path": "/account/balance"
  },
  "response_mapping": {
    "amount_path": "",
    "unit": "custom",
    "kind": "custom"
  }
}
```

示例域名 `.invalid` 不可访问，示例路径和空映射也是占位内容，因此该示例不可查询。实际服务的 Host 必须只含 HTTPS 服务根地址；API Path 必须以 `/` 开头。响应映射使用 JSON Pointer；`amount_path` 是必需的。可选映射字段包括 `total_path`、`remaining_path`、`used_path`、`unit_path`、`kind_path`、`status_path`、`status_values`、`expires_at_path`，以及服务文档明确业务成功/失败字段后的 `success_path`/`success_value`、`failure_path`/`failure_value`。`unit` 为固定展示单位，`kind` 可设为 `cash`、`quota`、`free_quota`、`subscription`、`credits`、`usage` 或 `custom`。

### Grsai 账户积分

新建账户时直接选 **Grsai**，填写 Grsai 用户信息栏的**请求令牌** `auth.token`，并选择国内直连或海外节点。两种区域都使用插件内置的官方 HTTPS 节点，无需填写服务器地址。独立模板固定 `type=grsai`、账户积分范围、POST 路径与响应解析。已按旧版兼容服务模板配置的 Grsai 账户继续可用；要改用独立模板，先备份配置，再新建 Grsai 条目，复制名称、别名、超时等非秘密设置，使用唯一 `id` 并自行填写请求令牌，然后禁用旧条目，确认新条目查询成功后再移除旧条目。旧版 `provider_account` 通用模板也应按此方式迁移。`auth.api_key` 是其他兼容服务的密钥栏；模型 API Key、Bearer 值都不能代替 Grsai 请求令牌，旧密钥不会自动转成令牌。

官方中文文档已核实账户积分 `POST /client/openapi/getCredits`，JSON 请求体为 `{"token": "用户信息栏请求令牌"}`；成功时 `code=0`，`data.credits` 为积分。插件固定请求路径与方法，直接从 secret `auth.token` 组成 JSON 请求体，按 `code=0` 和 `data.credits` 解析，显示为 `credits` 类别、`credit` 单位；无需手填响应映射。下面仅示意字段形状，示例令牌不能查询：

```json
{
  "id": "grsai-account",
  "type": "grsai",
  "display_name": "Grsai 账户积分",
  "auth": { "token": "${GRSAI_REQUEST_TOKEN}" },
  "region": "china"
}
```

官方文档还列出 API Key 积分 `POST /client/openapi/getAPIKeyCredits`，但它与账户积分是不同范围；当前该范围暂不可查询，独立 Grsai 模板只支持账户积分。旧兼容模板中的 API Key 积分选项仅用于识别旧配置范围，不提供请求预设。用户已在 AstrBot ChatUI 得到 Grsai 账户积分成功结果，并验证自然语言工具回复；海外节点及失败响应的业务码、HTTP 状态含义尚未实测，插件只做保守的失败归类，不据此推断认证或权限原因。两种积分范围互不替代，也不能换算为货币。[Grsai 官方中文其他 API 文档](https://grsai.ai/zh/dashboard/documents/other)

### Meinianda 账户站内额度

新建账户时选择 **Meinianda**，填写账户唯一 ID、显示名称及 API Key（`auth.api_key`），无需填写服务器地址、路径或响应映射。插件按站点提供的余额查询示例调用 `GET https://meinianda.top/api/balance`，通过 `Authorization: Bearer <API Key>` 认证；仅接受 `success=true` 且 `data.unit=site_credit` 的余额响应，读取 `data.balance`。

查询结果是**账户站内额度，不是 API Key 限额**，保留 `site_credit` 单位，不换算为货币。站点说明该查询不扣费，并建议每分钟查询一次；默认缓存为 60 秒。可使用 `/yql meinianda`、`/yql meinianda.top` 或在自然语言查询中指定 Meinianda。

```json
{
  "id": "meinianda-main",
  "type": "meinianda",
  "display_name": "Meinianda 主账户",
  "auth": { "api_key": "${MEINIANDA_API_KEY}" }
}
```

协议依据为 [Meinianda 站点](https://meinianda.top/) 的余额查询 API 示例（用户提供的截图）；自动化测试使用模拟响应，尚未以真实 API Key 验证账户查询或 AstrBot WebUI。业务失败响应不推断认证或权限原因，也不会将缺失余额补成零。

## 数据、缓存与错误

- 每个账户独立查询。成功结果按账户和配置缓存，默认 60 秒；失败结果不缓存。查询结果会标注获取时间和数据来源。
- 单账户默认最多等待 8 秒，一次全账户查询默认最多等待 30 秒，同时查询数默认上限为 4。传输仅对连接/超时、HTTP 429 和 5xx 做一次有限重试；认证、权限、端点、业务或响应解析错误不会重试。
- 一个账户失败不会替代其他账户结果。错误会归类为配置、认证、权限、限流、暂时不可用或响应格式问题；不会把余额缺失补成零。
- DeepSeek 各币种分别显示，不跨币种求和。阿里云百炼模板只查阿里云账户 BSS 现金余额。兼容接口按配置的映射与固定单位展示，不自动推断 total、remaining、used 的含义。
- 重载会重新读取配置并重建缓存与 HTTP 客户端；插件关闭或卸载时会取消未完成查询、清除缓存并关闭 HTTP 客户端。

## 故障排查

1. 运行 `/yql status` 查看账户是否启用、是否可查询及安全的配置诊断；该命令不会查询供应商。
2. 若提示缺少环境变量，检查变量是否设置在 AstrBot 进程环境中，并确认配置写成完整形式 `${VARIABLE_NAME}`，随后重载插件。
3. DeepSeek 查询失败时，检查 API Key 和账户 API 可用状态；HTTP 401 表示认证失败，429 表示请求过快。
4. 阿里云失败时，确认配置的是 RAM AccessKey ID/Secret 而非 DashScope Key，并确认 RAM 身份至少具有 `AliyunBSSReadOnlyAccess`。缺少 `AvailableCashAmount` 不会回退到“可用额度”。
5. 通用 OpenAI 兼容服务失败时，检查 Host 是否为 HTTPS 服务根地址、API Path 是否以 `/` 开头，再依据文档确认高级认证、方法和响应映射。独立 Grsai 模板失败时，检查请求令牌和连接区域；旧兼容模板的 Grsai 条目还须选 `grsai/account`，并清除非积分 API Path、GET 方法与静态请求体。失败响应细节未核实，不能仅凭状态码断言令牌或权限问题。
6. 检查端点可达性和账户/全局超时设置。插件页面保存成功会立即重建运行时并清缓存；若结果未知，请先刷新核对，不要重复提交凭据。

## 开发

本项目面向 Python 3.12+；本版原生插件页与 Dashboard 鉴权契约以 AstrBot 4.29.1（提交 dffe922773725e9c178392c423676ad65044748c）验证，最低版本改为 4.29.1。对未来 4.x 版本不作已验证兼容承诺；宿主契约不匹配时管理路由拒绝访问，不提供自签 JWT 降级。Windows 加密存储仅支持保留自 Game Link 的受限资格矩阵，详见安全文档。用户已在 AstrBot ChatUI 验证 Grsai 账户积分与自然语言工具回复；这不覆盖海外节点或失败响应语义。阿里云 BSS 查询依赖具备 `AliyunBSSReadOnlyAccess` 的 RAM 凭据。

提交前可运行：

```bash
ruff check .
ruff format --check .
```

### 构建插件包

本地构建需要 Python 3.12+ 和 Node.js 22.12+。先在 pages/frontend 执行 npm ci、npm run typecheck、npm test、npm run build；生成的 pages/00-quota-link 生产资源随插件包提供，不需要目标机器安装 Node.js。构建脚本会检查指定 tag 与 `metadata.yaml` 中的 `version` 完全一致，并生成以 tag 命名的 ZIP；ZIP 根目录直接是插件文件。根目录的 `logo.png` 是 256×256 透明插件图标，也会随包安装。

```bash
python scripts/build_plugin.py --tag v0.2.0 --output-dir dist
```

示例产物为 `dist/astrbot_plugin_yomihime_quota_link-v0.2.0.zip`。推送新的 `v*` tag 后，GitHub Actions 会运行代码检查和测试，构建相同的 ZIP，将其上传到该次工作流的 **Artifacts**，并创建附带 ZIP 的 GitHub Release。Release 说明取自 `CHANGELOG.md` 中对应版本的小节。工作流不会自动创建或修改 tag、更新元数据版本。创建 tag 前，请先提交与该 tag 完全一致的 `metadata.yaml` 版本和更新记录。构建通过只表示代码检查与打包通过；已完成的 Grsai 账户积分实测不覆盖海外节点和失败响应语义。

插件持久化数据应写入 AstrBot 的 `data` 目录，不要写入插件源码目录。

## 许可证

本项目采用 [AGPL-3.0](LICENSE) 许可证。
