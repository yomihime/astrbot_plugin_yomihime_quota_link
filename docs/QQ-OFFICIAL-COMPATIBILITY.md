# QQ 官方机器人兼容性

## 身份与目标

- 查询私聊名单使用 `qq_official:UID`，Webhook 使用 `qq_official_webhook:UID`。
- 查询群聊名单使用发送者 UID，仍须开启群查询。预警管理名单可使用平台前缀加 UID。原有数字项仍匹配 OneBot QQ。
- 预警目标使用完整 UMO，第一段是实际平台实例 ID。目标配置不会授予管理权限。原有 OneBot 目标写法继续适用。

在 QQ 群或 QQ 个人私聊中运行 `/yql alert targets addhere` 时，插件从 QQ SDK 的消息对象识别场景。QQ 频道和频道私信无法通过此命令添加。

手填时在 UMO 后明确指定场景。使用对应的 QQ 群或 QQ 个人私聊 OpenID，并保留大小写。

```text
OfficialQQ:GroupMessage:GroupOpenID scene=qq_group
OfficialQQ:FriendMessage:UserOpenID scene=qq_c2c
```

可将同样的参数用于 `/yql alert targets add`。手填场景由管理员确认。AstrBot 的 `GroupMessage` 和 `FriendMessage` 也用于频道消息和频道私信，单凭 UMO 无法区分。已有官方目标须在管理页补填场景，或移除旧目标后重新运行 `addhere`。QQ 官方目标只发送纯文本。

## 发送与去重

发送前按原始 UMO 检查插件和会话权限。QQ 群隔离 UMO 按 AstrBot 的规则取末尾群段。指向同一平台实例、同一场景和同一收件方的目标共享发送预算和低余额去重记录。

升级时按现有目标迁移能对应的旧记录。若旧目标已删除，其哈希无法还原收件方。账户在本次低余额期间有这类发送结果未知的记录时，暂停其 QQ 官方目标发送，直到余额恢复并进入下一次低余额。当前配置中的 OneBot 目标仍按各自的 UMO 发送。

插件不限制 qq-botpy 的版本号，也不要求用户检查或修改宿主依赖。YQL 检查所选实例是否提供认证准备接口和正式／沙箱环境标识，在发送前复用该实例的当前认证。认证不就绪时停止该目标的发送，不改动宿主 SDK 或其他插件。

消息 POST 由 YQL 自己的 HTTP 客户端提交，不经过 SDK 的消息重试路径，不跟随重定向，不在失败后换发送路径。每次发送尝试最多发起一个消息 POST。非空消息 ID 表示请求已获接受，实际送达与已读状态仍未知。明确的 HTTP 401、403、404、405 和 429 可在预算窗口后重试。超时、连接异常、回执缺失、重定向及其他服务端错误记为未知，本次低余额期间不再向同一收件方发送。

管理页使用的只读状态接口会附带官方 QQ 目标的接口能力、缓存认证头是否具备所需格式，以及可读取的 SDK 版本。读取状态不会刷新认证或发送测试消息；版本字段仅用于诊断，不参与准入判断。缓存认证头可读不代表令牌仍有效、适配器在线或 QQ 已接受主动消息。

正式环境使用现行接口域名 `api.bot.qq.com`。宿主明确选择沙箱时仍使用 SDK 的既有沙箱域名 `sandbox.api.sgroup.qq.com`，不会映射到正式环境或跟随重定向；这里不保证旧沙箱服务仍可用。

**QQ 平台限制：**旧 GitHub 文档有 2025 年主动推送停用公告，现行官网 API 文档仍列有主动消息权限和拒绝错误码。两者说明不同，不能据此承诺任何实际账号可主动发送。定时余额提醒属于主动消息，需与用户发送查询命令后的被动回复分别验证；插件安装成功、目标格式正确或缓存认证头可读都不能替代平台验证。插件不伪造或复用过期消息 ID 绕过平台限制。

离线测试与真实 QQ 验证分别记录；合成回执不能证明实际账户可发送或消息已送达。

- [AstrBot WebSocket 适配器](https://github.com/AstrBotDevs/AstrBot/blob/v4.29.1/astrbot/core/platform/sources/qqofficial/qqofficial_platform_adapter.py)
- [AstrBot Webhook 适配器](https://github.com/AstrBotDevs/AstrBot/blob/v4.29.1/astrbot/core/platform/sources/qqofficial_webhook/qo_webhook_adapter.py)
- [QQ 机器人消息发送接口](https://github.com/tencent-connect/bot-docs/blob/main/docs/develop/api-v2/server-inter/message/send-receive/send.md)
- [现行 API 调用说明](https://bot.q.qq.com/wiki/develop/api-v2/dev-prepare/api-call-guide.html)
- [现行消息概述](https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/overview.html)
- [现行 C2C 消息接口](https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_users_user_openid_messages.post.html)
