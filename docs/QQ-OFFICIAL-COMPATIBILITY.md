# QQ 官方机器人兼容性

## 身份与权限

- 查询私聊名单：`qq_official:UID`；Webhook 使用 `qq_official_webhook:UID`。
- 查询群聊名单：发送者 UID，仍须开启群查询；命令管理员限制不变。
- 预警管理名单：平台前缀加 UID。原有数字项仍仅匹配 OneBot QQ，名单不自动授予跨平台权限。
- 推送：完整 UMO，第一段匹配实际平台实例 ID。私聊保留 UID；群隔离会话按 AstrBot 的 `sender_openid_group_openid` 取群段。推送目标不授予权限。

## 发送边界

只实现官方私聊和群聊纯文本预警，无 @、图片或频道回退。调用实际实例 `get_client().api.post_c2c_message` / `post_group_message`，保留插件会话检查、持久预算预留与超时限制。官方 SDK 方法缺失时阻止发送。只接受非空消息 ID 回执为 `submitted`，不代表用户已收到或读过；异常、空响应或布尔值返回均不能作为成功。

QQ 主动消息权限、次数、关系及内容审核仍由官方 API 决定，不能通过改 UMO 绕过。插件不追加重试，也不在失败时改发其他目标或通道。qq-botpy 1.2.1 的 HTTP 层自身在连接异常时可能重试；因此这里不承诺网络严格发送一次。其递归结果缺失时可能出现已提交但无回执，保持 `unknown`。

## 依据与验证

核对 AstrBot v4.29.1、v4.29.4 的官方 WebSocket/Webhook 实例客户端接口与群会话规则；核对 qq-botpy 1.2.1 的公开 API、路径及返回值。使用合成消息 ID 和发送替身，无真实 QQ 账号发送。

- Python 最终全量：1967 通过、5 跳过、17 个 subtests。
- 前端：205 项通过；TypeScript 类型检查和生产构建通过。
- 修改的 Python 文件 Ruff 检查/格式、Git diff 空白检查通过。
- 全量使用固定 AstrBot 4.29.1 源码夹具与固定 Noto 字体；首次缺少夹具导致的打包测试失败已补齐并重跑通过。
- 未做真实 QQ 官方网络验收；SDK 默认 null 可选字段是否被具体账号/API 接受仍需该环境验证。未启动用户本地环境。

参考：
- https://github.com/AstrBotDevs/AstrBot/blob/v4.29.1/astrbot/core/platform/sources/qqofficial/qqofficial_platform_adapter.py
- https://github.com/AstrBotDevs/AstrBot/blob/v4.29.1/astrbot/core/platform/sources/qqofficial_webhook/qo_webhook_adapter.py
- https://github.com/AstrBotDevs/AstrBot/blob/v4.29.1/astrbot/core/event_bus.py
- https://github.com/tencent-connect/botpy/blob/master/botpy/api.py
- https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/overview.html
