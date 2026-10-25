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
