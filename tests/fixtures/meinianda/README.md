# Meinianda 余额响应

`balance_success.json` 来自用户提供的 https://meinianda.top/ 余额查询 API 文档截图，保留原示例数值和字段结构，不包含真实账户数据。

- 只读请求：`GET https://meinianda.top/api/balance`
- 认证：`Authorization: Bearer YOUR_API_KEY`
- `balance` 为账户站内额度，不是 Key 限额；单位为 `site_credit`。
- 文档建议每分钟查询一次。

失败结构由测试构造，仅验证保守错误处理，不代表已核实站点的错误响应或完成真实账户验收。
