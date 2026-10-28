# 如月怜的额度连结

AstrBot 插件，用于查询已配置 AI 服务账户的余额或用量，并按明确阈值发送额度预警。当前提供 DeepSeek、阿里云百炼（BSS 现金余额、可用额度、信用额度）、Grsai 账户积分、Meinianda 账户站内额度预设和 OpenAI 兼容服务 / 第三方服务配置。结果保留各接口的数据含义，不做货币换算。

## 安装

在 AstrBot WebUI 的插件管理中，使用以下仓库地址安装：

```text
https://github.com/yomihime/astrbot_plugin_yomihime_quota_link
```

安装并启用插件后，登录 AstrBot Dashboard，打开本插件的「额度查询」页面。插件设置仅展示管理页面启用开关；账户、供应商、全局超时与查询权限都在插件页面管理，保存成功后立即重建运行时与缓存。

## 查询

| 命令 | 用途 |
| --- | --- |
| `/yql` 或 `/yql all` | 查询所有已启用账户 |
| `/yql <账户名>` | 查询指定账户（也可用配置的 ID 或别名） |
| `/yql provider <供应商名>` | 查询某类供应商的账户 |
| `/yql help` | 查看插件帮助 |
| `/yql status` | 查看本地配置状态，不发起网络请求 |

在启用函数工具且聊天模型支持工具调用的 AstrBot AI 对话中，也可以说“余额还剩多少”“查 DeepSeek 余额”或“查看 <账户名> 的额度”。模型按需要调用 `yql_query_balance`，并传入账户名、供应商名或 `all`；插件不再监听固定关键词自动回复。工具是否被调用由模型和 AstrBot 的函数工具设置决定；需要确定执行时可使用 `/yql`。命令前缀和唤醒方式以 AstrBot 配置为准。[AstrBot 函数工具说明](https://docs.astrbot.app/use/function-calling.html)

### 查询卡片

`/yql`、`/yql all`、账户查询与供应商查询默认返回与 Game Link 同系列的暖纸色图片卡片。每个账户使用独立面板与 40px 供应商图标，主数值突出展示，其余余额以属性分栏排列；币种、积分和站内额度保留各自单位，状态、缓存、来源与时间作为辅助信息。内置语义说明采用简洁的肯定式表述，自定义接口说明保留原意。时间统一显示为 UTC（保留到秒）。帮助、配置状态与预警管理使用同系列卡片：`/yql help` 按查询、本地命令和已启用账户分组；`/yql status` 展示本地配置、访问规则、凭据保存记录及安全诊断。状态中的加密凭据与环境变量引用分别标明保存情况，连通性和余额由 `/yql` 查询。`/yql alert` 的帮助、私聊状态、目标名单、单位候选和成功回执沿用同系列卡片；群内管理保留简短确认与既有隐私范围。参数错误和权限拒绝保持简短文字；LLM 工具保留原有 JSON 事实。

图标的 SVG 源文件、固定 128px 透明 PNG 派生和来源/许可说明随插件包提供；Pillow 只读取已校验的内置 PNG。Meinianda 使用已确认的女孩头像，兼容服务使用通用接口符号。图标缺失或校验失败时保留原卡片内容，不触发下载。

卡片在本地生成，不把账户信息发送到外部制图服务，不写临时图片。插件包不包含字体。启动时沿用 Game Link 的固定 Noto 字体下载与缓存方式：先检查 YQL 自己的有效缓存；若同时安装了 YGL 且其字体已就绪，将经过同一大小与 SHA256 校验的字体复制到 YQL 的独立缓存；否则按 YGL 的固定镜像顺序下载。缓存位于插件数据目录的 `resources/fonts/`，不会修改或依赖 YGL 的文件。下载在后台进行，每个来源最多 15 秒、单轮最多 45 秒；查询只读取已就绪的字体，不触发重复下载。字体准备期间或准备失败时使用文字回退，下次插件启动再尝试。字体采用 SIL OFL 1.1，卡片绘制使用 Pillow。若图像依赖/字体不可用、包含字体不支持的字符、内容超出绘制预算或宿主无法准备图像消息，会退回完整文字结果；不会静默省略账户或用量字段，也不会为回退重复查询供应商。超长结果可改用 `/yql <账户名>` 缩小范围。消息已交给宿主后发生的适配器发送错误不自动重试，避免重复发送。

复现不含真实账户数据的卡片：`PYTHONPATH=. python examples/render_cards.py --font-path <已校验字体路径> --output-dir card-previews`。带供应商图标的三种演示可用 `python examples/provider_logo_preview/render.py --font <已校验字体路径> --output provider-card-previews` 生成。帮助与状态的四种演示可用 `python scripts/render_local_card_demos.py --font <已校验字体路径> --output local-card-previews` 生成；演示标记仅由该脚本添加，命令卡片使用实际本地配置。渲染来源、字体许可和离线策略见 [`quota_link/presentation/NOTICE.md`](quota_link/presentation/NOTICE.md)。

`/yql` 命令默认仅管理员可用，包括 `/yql help` 和 `/yql status`。需要开放命令时，可将 `command_admin_only` 设为 `false`；此开关不会放宽自然语言工具调用的私聊权限。

私聊中的自然语言工具查询默认仅管理员可用。可在 `private_allowed_user_ids` 中明确加入非管理员，格式必须是完整的 `平台名:用户ID`（例如 `aiocqhttp:123456`），避免不同平台的相同用户 ID 混用。白名单不会绕过 `/yql` 的管理员限制；若关闭 `command_admin_only`，白名单用户也可在私聊使用命令。群聊查询仍默认关闭；只有设置 `allow_group_queries` 为 `true` 后才开放给管理员及 `group_allowed_user_ids` 中的用户。

## 配置账户

在插件页面的账户区添加 DeepSeek、阿里云百炼、Grsai、Meinianda 或其他兼容服务。每个账户有唯一 `id`、显示名称和可选别名。现有账户的 ID 与供应商类型不可重绑；需要更换供应商时请新建账户。普通设置保存与凭据替换/清除是不同操作，普通保存不会写入或回显凭据。

凭据区域只显示是否已配置、来源为加密存储或环境变量，不提供读取原值的接口。填写新值后单独确认替换，或选择环境变量并填写变量名称（不是变量的值）；原有 `${ENV_VAR}` 引用在迁移时保持为环境引用。不要把真实密钥写进普通字段、公开文件或聊天。账户页沿用 Game Link 的 Oil 明暗主题、组件与交互。

其他兼容服务模板把 **服务地址** 和 **接口路径** 分开填写。服务地址是 HTTPS 服务根地址；接口路径是以 `/` 开头的路径。配置页中的 `https://api.example.invalid` 与 `/account/balance` 仅展示填写格式；域名不可访问，路径也是占位值。Grsai 独立模板只需填写请求令牌并选择国内或海外连接区域，官方服务器地址由插件内置，路径、方法和响应解析也由插件固定。模型 API 兼容不代表余额 API 兼容；其他服务须依据余额接口文档配置。认证方式、请求方法和响应映射位于“高级设置”中；通用服务缺少协议资料时会在 `/yql status` 标为不可查询。

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

## 额度预警

账户页独立开关默认关闭。检查间隔为 **1–4320 分钟**（默认 15），滑条与数字输入同步。先填入触发阈值和全局目标，再开启；阈值未配置时不会运行。原 UI 预览中曾保存的开关若缺少这些必要信息，会安全停用并提示补齐。

“单位”自动识别并只读显示，不再预填 CNY 或接受手输。Grsai 的 `credit`、Meinianda 的 `site_credit` 有固定协议；货币等以所选指标的实际有效查询结果为准。首次尚未识别时可以保存阈值并开启，正常检查取得唯一可信单位后绑定。已有旧单位只是迁移参考，必须通过实际结果验证。

已识别单位持续保存；用于重新确认的查询候选有独立有效期。切换监测项、改变已验证账户的查询身份、单位变化或存在多个币种时，页面分别显示原因，并提供“查询最新余额”与确认入口。候选过期后可重新查询，再核对原阈值含义并确认；确认保留原阈值的精确数值。只读状态刷新查看现有缓存，主动查询按钮才请求供应商；并发修改后旧页面须重新加载。

- 金额使用精确十进制字符串；**低于或等于触发阈值**首次提醒。恢复阈值必须更高；留空自动使用 `触发阈值 + max(abs(触发阈值) × 10%, 0.01)`。达到恢复阈值才结束本轮，不发送恢复消息。
- 默认持续低额不重复。可设重复间隔，仍受每目标至少 5 分钟的消息预算约束；每条最多合并 10 个账户，剩余等待后续有效检查。程序重启、改检查间隔不会重置已通知的同一低额事件。
- 默认指标：阿里 `AvailableAmount`、DeepSeek `total_balance`、Grsai `credit`、Meinianda `site_credit`、通用兼容接口 `mapped_balance`（明确 remaining 优先，否则 amount）。单位必须与供应商结果精确匹配，不跨币种、不把分项相加、不取任意首项。
- 只使用新鲜、无错误且存在所选指标的结果。错误、缺字段、币种不符、过期缓存既不触发新提醒也不解除旧状态；DeepSeek `is_available=false` 但仍有有效零余额时可正常触发。

全局“额度预警推送目标”每行一个 UMO，可在后面用空格追加 `@QQ号`。例如（仅示意，不是默认收件人）：

```text
my-qq:FriendMessage:10001
my-qq:GroupMessage:20001 @10001 @10002
```

UMO 第一段是实际平台实例 ID，不必叫 NapCat。私聊行不可带 @；群内提及只支持明确数字 QQ 号，不支持昵称、全体、CQ 代码。群发送前再次验证实际实例是支持 QQ 提及的 `aiocqhttp` 适配器；普通群目标也必须有可用实例。`qq_official` 不支持此 SDK 主动发送方式，状态会提示阻止。目标和 QQ 成员须由管理员自己确认；保存配置、addhere 都不会测试发送。

“预警 QQ 管理白名单”独立于查询权限和收件名单。`/yql alert` **整棵命令树**仅允许：可信 `aiocqhttp` 事件的实际 QQ 号命中该名单，**或** AstrBot 内置管理员。空名单仍允许宿主管理员；普通群管理员、昵称、参数中的 QQ 号和被 @ 的人不因此获得权限。其他平台可使用宿主内置管理员身份。网页继续只接受原 Dashboard 管理授权。

私聊使用 `/yql alert help` 查看常用命令与分项入口；`help account`、`help units`、`help targets` 分别查看账户设置、单位确认、目标与管理权限的详细用法。帮助只读，不查询供应商；图片不可用时保留完整命令参数的文字说明。

```text
/yql alert status
/yql alert threshold "账户名" 10 [指标ID]
/yql alert units "账户名"
/yql alert units "账户名" refresh
/yql alert bind "账户名" <最新候选ID>
/yql alert on "账户名"
/yql alert off "账户名"
/yql alert interval "账户名" 15
/yql alert recovery "账户名" 12
/yql alert recovery "账户名" auto
/yql alert repeat "账户名" 0
/yql alert targets list
/yql alert targets addhere @10001
/yql alert targets add my-qq:GroupMessage:20001 @10001 @10002
/yql alert targets remove <稳定目标ID>
/yql alert admins list
/yql alert admins add 10001
/yql alert admins remove 10001
/yql alert llm on
/yql alert retry "账户名"
```

`units` 查看现有候选，追加 `refresh` 主动查询最新余额并刷新候选。`threshold` 中方括号表示可选参数，不要输入方括号。模型与人格跟随推送目标的 AstrBot 会话设置，不在此插件另行指定。群里仅返回简短确认；状态和目标/管理名单请私聊查看。命令与网页共享配置事务和修订号，遇到并发修改必须重新确认，不会覆盖别人的新配置。既有 `/yql` 查询权限不变，LLM 查询工具仍只读，不能修改预警。

智能提示按目标的完整 UMO 获取当前模型，并使用宿主解析器处理会话人格覆盖；不创建会话或写入聊天历史。使用标准 `llm_generate` 生成、`send_message` 投递，不启动带工具的完整 Agent。会话 AI 关闭、非本地执行器或解析失败时回退固定文案；整个会话停用则暂停该目标。

LLM 默认可用，按目标会话人格生成简短自然提醒；程序独立附上精确余额、单位与阈值，并确定收件人和真实 @。模型只生成普通文字，不接收凭据、供应商地址、会话历史或工具。模型不可用、超时、空响应或输出超出安全边界时使用固定事实文案。引言使用保守的中英文结构和财务断言检查；自然语言仍可能存在语义偏差，金额以程序生成的明细为准。每次实际合并提醒才有一次生成，默认持续低额只在首次调用模型。

发送前在插件数据目录的私有 `alerts.sqlite3` 记录事件和发送占位。成功返回只显示“已提交平台”，**不等于最终送达**。异常/超时/中断后结果未知时不自动重发，显式 retry 也只解除查询认证暂停、不清除未知投递；应由管理员检查平台记录，避免重复打扰。明确未找到平台/未接受发送可在预算冷却后重试。卸载、关闭或配置变更会撤销旧任务的发送资格；已经进入平台传输的请求无法撤回，中断后按结果未知处理，不再启动新的发送。状态库不可用时停止提醒，不降级无状态刷屏。状态文件仅保存事件、时间、账户 ID、单位绑定和目标哈希，不保存金额、凭据或明文收件人。

验证覆盖离线测试与真实 AstrBot 隔离宿主；供应商、模型响应和最终 QQ 网络发送使用测试替身。实际平台送达与原生 Windows I/O 仍需分别验收。默认检查间隔为 15 分钟，预警检查使用原余额接口；请求遵循插件退避和消息预算。

### DeepSeek

需要 DeepSeek API Key。插件通过官方 `GET https://api.deepseek.com/user/balance` 余额接口查询，不调用模型生成接口。结果按币种分别显示总可用余额、未过期赠金余额和充值余额；总额已包含两个分项，不要相加。`is_available` 表示当前账户是否有余额可供 API 调用；不可用状态不会伪装成零余额。[DeepSeek 余额接口文档](https://api-docs.deepseek.com/api/get-user-balance/)

### 阿里云百炼

本适配器读取的是**阿里云账户余额（BSS）**，不是百炼模型 Key 的 token、免费额度、资源包或套餐用量。需要独立的 RAM AccessKey ID 和 Secret；RAM 身份至少授予阿里云费用与成本只读系统策略 `AliyunBSSReadOnlyAccess`。DashScope/百炼 API Key 不能替代阿里云 AccessKey。不要授予充值或其他写权限。插件分别展示 `AvailableCashAmount` 现金余额、`AvailableAmount` 可用额度、`CreditAmount` 信用额度和响应币种；三项不能相加。可用额度允许负数，字段缺失显示“未提供”，不会补零或替代。查询成功不代表资金可用或服务可正常消费。[QueryAccountBalance 接口文档](https://help.aliyun.com/zh/user-center/developer-reference/api-bssopenapi-2017-12-14-queryaccountbalance) · [AliyunBSSReadOnlyAccess 策略说明](https://help.aliyun.com/zh/ram/developer-reference/aliyunbssreadonlyaccess)

### OpenAI 兼容服务 / 第三方服务

此模板提供服务地址、接口路径和 API Key 凭据栏。它只查询配置的余额端点，不会调用聊天或模型生成接口。**OpenAI 模型调用协议兼容不代表余额接口通用**：服务地址、接口路径、HTTP 方法、认证位置、请求体和响应结构均须依据目标余额服务文档填写。点开“高级设置”后才能编辑认证位置、请求方法、可选 JSON 请求体和响应映射。POST 仅能用于已确认无副作用的只读接口；请求体只接受静态 JSON 对象，不支持模板、表达式或凭据。

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

示例域名 `.invalid` 不可访问，示例路径和空映射也是占位内容，因此该示例不可查询。实际配置中的服务地址必须只含 HTTPS 服务根地址；接口路径必须以 `/` 开头。响应映射使用 JSON Pointer；`amount_path` 是必需的。可选映射字段包括 `total_path`、`remaining_path`、`used_path`、`unit_path`、`kind_path`、`status_path`、`status_values`、`expires_at_path`，以及服务文档明确业务成功/失败字段后的 `success_path`/`success_value`、`failure_path`/`failure_value`。`unit` 为固定展示单位，`kind` 可设为 `cash`、`quota`、`free_quota`、`subscription`、`credits`、`usage` 或 `custom`。

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

官方文档还列出 API Key 积分 `POST /client/openapi/getAPIKeyCredits`，但它与账户积分是不同范围；当前该范围暂不可查询，独立 Grsai 模板只支持账户积分。旧兼容模板中的 API Key 积分选项仅用于识别旧配置范围，不提供请求预设。用户已在 AstrBot ChatUI 得到 Grsai 账户积分成功结果，并验证自然语言工具回复；海外节点及失败响应业务码尚未实测；真实 HTTP 401/403/429 按通用保护策略暂停或退避，未知业务码仍不推断具体认证或权限原因。两种积分范围互不替代，也不能换算为货币。[Grsai 官方中文其他 API 文档](https://grsai.ai/zh/dashboard/documents/other)

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
- 单账户默认最多等待 8 秒，一次全账户查询默认最多等待 30 秒，同时查询数默认上限为 4。手动与定时查询共享进行中的请求；同供应商保守串行，不猜测不同 Key 是否同主账号。传输仅对连接/超时及未带 Retry-After 的 5xx 做一次有延迟重试；429、明确业务限流及带 Retry-After 的失败交给共享退避预算，不再 50ms 连撞。401/403 将认证相关配置的暂停持久化，重启或改提醒间隔也不自动解除；更改认证相关配置或显式 retry 才解除，不暂停其他凭据。
- 一个账户失败不会替代其他账户结果。错误会归类为配置、认证、权限、限流、暂时不可用或响应格式问题；不会把余额缺失补成零。
- DeepSeek 各币种分别显示，不跨币种求和。阿里云百炼模板只查阿里云账户 BSS 三项金额，不查询账单、券或资源包。兼容接口按配置的映射与固定单位展示，不自动推断 total、remaining、used 的含义。
- 重载会重新读取配置并重建缓存与 HTTP 客户端；插件关闭或卸载时会取消未完成查询、清除缓存并关闭 HTTP 客户端。

## 故障排查

1. 运行 `/yql status` 查看账户是否启用、是否可查询及安全的配置诊断；该命令不会查询供应商。
2. 若提示缺少环境变量，检查变量是否设置在 AstrBot 进程环境中，并确认配置写成完整形式 `${VARIABLE_NAME}`，随后重载插件。
3. DeepSeek 查询失败时，检查 API Key 和账户 API 可用状态；HTTP 401 表示认证失败，429 表示请求过快。
4. 阿里云失败时，确认配置的是 RAM AccessKey ID/Secret 而非 DashScope Key，并确认 RAM 身份至少具有 `AliyunBSSReadOnlyAccess`。缺少 `AvailableCashAmount` 不会回退到“可用额度”。
5. 通用 OpenAI 兼容服务失败时，检查服务地址是否为 HTTPS 服务根地址、接口路径是否以 `/` 开头，再依据文档确认高级认证、方法和响应映射。独立 Grsai 模板失败时，检查请求令牌和连接区域；旧兼容模板的 Grsai 条目还须选 `grsai/account`，并清除非积分接口路径、GET 方法与静态请求体。失败业务响应细节未核实；HTTP 401/403 用于暂停保护，仍需在服务商控制台核对具体原因。
6. 检查端点可达性和账户/全局超时设置。插件页面保存成功会立即重建运行时并清缓存；若结果未知，请先刷新核对，不要重复提交凭据。

## 开发

本项目面向 Python 3.12+；本版原生插件页与 Dashboard 鉴权契约以 AstrBot 4.29.1（提交 dffe922773725e9c178392c423676ad65044748c）验证，最低版本改为 4.29.1。后续宿主版本按兼容回归验证；宿主契约不匹配时管理路由拒绝访问，不提供自签 JWT 降级。Windows 加密存储仅支持保留自 Game Link 的受限资格矩阵，详见安全文档。用户已在 AstrBot ChatUI 验证 Grsai 账户积分与自然语言工具回复；这不覆盖海外节点或失败响应语义。阿里云 BSS 查询依赖具备 `AliyunBSSReadOnlyAccess` 的 RAM 凭据。

提交前可运行：

```bash
ruff check .
ruff format --check .
```

### 构建插件包

本地构建需要 Python 3.12+ 和 Node.js 22.12+。先在 pages/frontend 执行 npm ci、npm run typecheck、npm test、npm run build；生成的 pages/00-quota-link 生产资源随插件包提供，不需要目标机器安装 Node.js。构建脚本会检查指定 tag 与 `metadata.yaml` 中的 `version` 完全一致，并生成以 tag 命名的 ZIP；ZIP 根目录直接是插件文件。根目录的 `logo.png` 是 256×256 透明插件图标，也会随包安装。

```bash
python scripts/build_plugin.py --tag v0.3.0 --output-dir dist
```

示例产物为 `dist/astrbot_plugin_yomihime_quota_link-v0.3.0.zip`。推送新的 `v*` tag 后，GitHub Actions 会运行代码检查和测试，构建相同的 ZIP，将其上传到该次工作流的 **Artifacts**，并创建附带 ZIP 的 GitHub Release。Release 说明取自 `CHANGELOG.md` 中对应版本的小节。工作流不会自动创建或修改 tag、更新元数据版本。创建 tag 前，请先提交与该 tag 完全一致的 `metadata.yaml` 版本和更新记录。构建通过只表示代码检查与打包通过；已完成的 Grsai 账户积分实测不覆盖海外节点和失败响应语义。

插件持久化数据应写入 AstrBot 的 `data` 目录，不要写入插件源码目录。

## 许可证

本项目采用 [AGPL-3.0](LICENSE) 许可证。
