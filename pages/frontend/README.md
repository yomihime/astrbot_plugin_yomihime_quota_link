# Quota Link native administrator page

## Build and test

From the repository root:

```
npm ci --prefix pages/frontend
npm run typecheck --prefix pages/frontend
npm run build --prefix pages/frontend
npm test --prefix pages/frontend
```

Node 24 is used by the verified build. The lockfile pins the complete dependency graph. The production output is `pages/00-quota-link/`, which AstrBot discovers as page `00-quota-link`. Build creates deterministic `app.js`, `styles.css`, `index.html`, runtime license notices, and `assets.json`; source maps are not published. No development server, Node process, or frontend install is needed at plugin runtime.

## Host boundary

The page loads the official same-origin `/api/plugin/page/bridge-sdk.js` and uses `AstrBotPluginView.ready`, `onContext`, and `apiPost('admin/<operation>', body)`. Context must identify `astrbot_plugin_yomihime_quota_link` and `00-quota-link`. A standalone HTML opening fails closed. The SDK unwraps the native Host response envelope; the frontend consumes only the returned DTO, not a custom HTTP authentication path.

Read supplies `{revision, config, credentials, encryption, migration}`. Ordinary configuration never contains `auth`. Credential statuses contain only `configured` and `source`. Replacement sends one credential field with either `value` or an environment variable name. Clearing is a separate explicitly confirmed operation. Every write carries the last read `revision`; migration also carries the current opaque `plan_id`. There are no write retries.

A missing response, malformed success, or CAS conflict disables further mutation until an explicit authoritative read. Authorization loss, context identity changes, page teardown, and confirmed navigation erase sensitive inputs and invalidate in-flight response ownership. Presentation-only host theme/locale updates do not reset the authorized editing session. Secret drafts are never persisted to local/session storage, cookies, IndexedDB, URLs, or logs. Ordinary and credential changes are saved separately.

## Coverage and limits

The automated Node suite covers native read/write contracts, sparse defaults, real backend status fields, CAS, duplicate submission, unknown-result reconciliation, authorization loss, context/late-response fencing, navigation cleanup, credential separation, migration tokens/conflicts/cleanup, field limits, build hashes and source provenance. Browser validation should additionally cover desktop/mobile layout, host light/dark changes, focus and confirmation cancel behavior, actual controls, native discovery and authenticated route integration.

`legacy-schema.json` is an internal build descriptor, not a second editable configuration source. See `PROVENANCE.md` for source origin and the deliberate dependency version choice.

## 额度预警配置与离线预览

- 每个账户独立配置开关、1–4320 分钟检查间隔、稳定指标 ID 和十进制文本阈值；单位由查询结果自动识别。触发为余额 ≤ 阈值；恢复阈值必须更高，留空采用 `阈值 + max(abs(阈值) × 10%, 0.01)`。重复间隔 0 默认不重复。
- 全局单 textarea 每行 `UMO @QQ号 @QQ号`，整体校验后以 `balance_alert_targets: [{umo, mentions: []}]` 保存。示例只在 placeholder；没有默认收件人。
- 独立 QQ 预警管理名单只授权 `/yql alert`：可信 QQ 身份命中名单 **或** AstrBot 内置管理员。推送目标、普通群管理员身份不会自动授权。
- “智能提示”跟随每个目标会话当前使用的模型和人格，不再提供独立模型/人格配置。LLM 仅可润色短提示；金额、单位、阈值与路由不由模型决定。运行状态单独读取，不触发查询/发送，也不将发送请求受理视为送达。
- `node build-demo.mjs` 将**当前生产 bundle**嵌入独立 HTML：合成数据、仅当前页面内存、CSP 禁止网络、不保存生产配置。演示使用生产 UI 的 DOM 回归，并不替代真实宿主或浏览器像素验收。

### 自动识别与确认单位

网页不接受手填预警单位，不猜测人民币或从旧规则复制币种。Grsai `credit`、Meinianda `site_credit` 可按固定协议显示；金额单位只来自经宿主鉴权的 `admin/alert-units` 缓存读取，读取本身不查询供应商。页面展示单位、人类可读的监测项、本地更新时间，以及未识别/歧义/变更状态，不接收或显示金额。已验证的绑定不因查询候选过期而失效；界面分别展示绑定状态与候选时效。

只有后端返回的真实候选可以确认。`admin/alert-bind-unit` 提交当前配置 `revision`、账户 ID 与 64 位不透明 `choice_id`；不提交自造单位或金额，不改变配置修订号。确认前须保存草稿，弹窗展示原始高精度阈值文本；确认不会换汇、四舍五入或清空阈值。结果未知时不得盲重试，先读取新的单位状态。旧 `balance_alert.unit` 仅作隐藏兼容字段，不参与前端单位显示。

首次单一单位由后台检查自动绑定；账户未开启时，缓存中的唯一候选也可显式确认。尚未获取单位不会阻止保存阈值与开启意图，运行状态保持“等待识别单位”。不同服务类型切换仍需在明确确认后清空阈值并关闭旧预警规则。

“读取单位状态”只读已有缓存；“重新查询单位”显式调用 `admin/alert-refresh-units`，携带当前 `revision` 与 `account_id`，查询该账户余额接口取得新候选，不发送预警。空候选或过期候选保留可执行的恢复入口；保存草稿并完成凭据输入后才能查询。重复点击受锁保护，导航、关闭、上下文变化与更新配置会使旧响应失去所有权；确认仍需独立的 `alert-bind-unit` CAS。相同 CNY 下监测项切换显示监测项变化，不误称币种变化。

运行状态按结构化 `detail_code` 提供排查动作；未知原因只显示通用排查提示，不猜测实际阻止原因。`waiting_budget` 明示同一推送目标共用至少 300 秒发送间隔，仍需后续有效检查，不显示误导性的必发倒计时。检查间隔下方明确标记为快捷设置按钮，而非滑条刻度。`credit` / `site_credit` 只改变界面标签，保存仍使用原协议值。

离线预览支持切换已验证/候选过期/监测项变化/歧义、阻止原因和预算等待场景；预览中的“重新查询”与确认仅修改合成内存，不请求供应商或投递消息。
