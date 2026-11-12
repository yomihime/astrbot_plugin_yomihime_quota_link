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

使用所选实例的 qq-botpy 1.2.1 HTTP 客户端发送单次请求。其他 SDK 版本需要适配后才能启用官方预警。QQ 决定主动消息权限、频次和内容审核。非空消息 ID 表示请求已获接受，实际送达与已读状态仍未知。SDK 明确识别的 HTTP 401、403、404、405 和 429 可在预算窗口后重试。超时、连接异常、回执缺失及 SDK 无法区分的服务端错误记为未知，本次低余额期间不再向同一收件方发送。

离线测试覆盖 AstrBot 4.29.1 的 WebSocket 和 Webhook 场景、qq-botpy 1.2.1 的单次请求和旧状态迁移。真实 QQ 账号的主动消息权限与送达仍需在对应环境验证。

- [AstrBot WebSocket 适配器](https://github.com/AstrBotDevs/AstrBot/blob/v4.29.1/astrbot/core/platform/sources/qqofficial/qqofficial_platform_adapter.py)
- [AstrBot Webhook 适配器](https://github.com/AstrBotDevs/AstrBot/blob/v4.29.1/astrbot/core/platform/sources/qqofficial_webhook/qo_webhook_adapter.py)
- [QQ 机器人消息发送接口](https://github.com/tencent-connect/bot-docs/blob/main/docs/develop/api-v2/server-inter/message/send-receive/send.md)
