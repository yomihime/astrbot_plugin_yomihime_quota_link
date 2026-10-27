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

- 每个账户独立配置开关、1–4320 分钟检查间隔、稳定指标 ID、准确单位和十进制文本阈值。触发为余额 ≤ 阈值；恢复阈值必须更高，留空采用 `阈值 + max(abs(阈值) × 10%, 0.01)`。重复间隔 0 默认不重复。
- 全局单 textarea 每行 `UMO @QQ号 @QQ号`，整体校验后以 `balance_alert_targets: [{umo, mentions: []}]` 保存。示例只在 placeholder；没有默认收件人。
- 独立 QQ 预警管理名单只授权 `/yql alert`：可信 QQ 身份命中名单 **或** AstrBot 内置管理员。推送目标、普通群管理员身份不会自动授权。
- LLM 仅可润色短提示；金额、单位、阈值与路由不由模型决定。运行状态单独读取，不触发查询/发送，也不将发送请求受理视为送达。
- `node build-demo.mjs` 将**当前生产 bundle**嵌入独立 HTML：合成数据、仅当前页面内存、CSP 禁止网络、不保存生产配置。演示使用生产 UI 的 DOM 回归，并不替代真实宿主或浏览器像素验收。

### 预警单位建议

单位建议只属于当前编辑草稿，不改变后端单位匹配：阿里云/DeepSeek 默认建议可修改的 `CNY`（实际也可能是其他币种）；Grsai 为 `credit`，Meinianda 为 `site_credit`。通用兼容服务只从明确的非空响应映射单位带入，不把隐式 `custom` 或单位路径当成已知单位。

打开空白单位账户会标明“默认单位尚未保存”，沿用未保存导航确认与凭据锁定。既有非空单位、手动输入均优先；放弃修改/保存清空后本页不强行回填，重新读取或重新打开才重新建议。跨服务类型有既存单位或阈值时，明确确认重设指标/单位、清空两个阈值并关闭预警；不默默复用跨单位阈值。
