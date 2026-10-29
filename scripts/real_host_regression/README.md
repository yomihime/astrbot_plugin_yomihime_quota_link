# YQL real AstrBot alert regression

This optional integration test installs the **exact candidate ZIP** through the actual plugin manager of clean official AstrBot 4.29.1 (`dffe922773725e9c178392c423676ad65044748c`). It runs only in a new disposable root, with generated synthetic accounts and no production credentials.

## Run

Preinstall the official host and plugin requirements in an isolated Python 3.12 environment. The runner checks the host commit, tracked cleanliness, plugin requirements and pinned font hash before starting; it never installs missing dependencies online.

```sh
export QUOTA_TEST_PYTHON=/path/to/isolated-venv/bin/python
export QUOTA_TEST_ASTRBOT_SOURCE=/path/to/clean/AstrBot-4.29.1
export QUOTA_TEST_PLUGIN_ZIP=/path/to/candidate-plugin.zip
export QUOTA_TEST_FONT=/path/to/NotoSansCJKsc-Regular.otf
export QUOTA_TEST_WORK_ROOT=/path/to/new-nonexistent-disposable-root
./run_from_environment.sh > regression.log 2>&1
```

Keep all three Python files and the shell wrapper together. The work root **must not exist**; never point it at a user instance. The default loopback port is 19366. Do not run concurrent copies on this port. Allow approximately two minutes for the real 62-second expiry observation plus startup and card rendering. No mocked clock or direct engine-state injection is used.

## Coverage

- Official host lifecycle and plugin installer; actual plugin source from the ZIP, actual scheduler and SQLite persistence.
- Dashboard HTTP authentication, config/credential mutations, stale-revision conflict, explicit unit refresh and confirmation.
- Real event bus command dispatch: host admin and explicit QQ-whitelist authorization; unauthorized sender rejected.
- Threshold-first initial credentials, metric change retaining CNY and its correct reason, explicit multi-currency selection.
- 62 real seconds: candidate expiry without revoking verified binding, old candidate rejection, 60-second scheduled recheck.
- Shared target send-budget waiting, missing-platform specific reason, disabled-session block and re-enable recovery.
- Alert help/status/targets PNG replies, including budget-wait and blocked-reason status cards. Temporarily rename only the disposable cached font to cause real renderer failure and assert complete text fallback for all three commands; restore it immediately.
- Official model routing and persona storage/resolver; natural free-form introduction not limited to three fixed phrases; no facts, recipients, history or tools passed to the model. A synthetic unsafe model reply must fall back without changing exact code-owned facts.
- `Context.send_message` → real `AiocqhttpAdapter` → real OneBot `At`/`Plain` serialization.

## Explicit test boundaries

Only the final external interfaces are substitutes: balance HTTP uses `httpx.MockTransport`, the registered provider's `text_chat` returns synthetic prose, and CQHttp's final API transport captures actions instead of sending to QQ. No provider parser, query service, alert engine, permission function, scheduler, dashboard handler, persona resolver, card renderer or message serializer is substituted.

The genuine OneBot adapter is constructed and registered, but never starts a live connection. Python DNS/socket guards deny non-loopback networking; subprocesses and aiohttp external requests are denied. Two unrelated host background refresh jobs (model metadata and hosted renderer discovery) are explicitly recorded no-ops, and metrics are disabled. These guards are for trusted integration code, **not an adversarial OS sandbox**. They do not establish real supplier validity, model quality, actual QQ delivery or production deployment readiness.

## Evidence and cleanup

`result.json` records pass/fail, phase evidence, exact ZIP SHA256, pinned host commit, dependency versions, sanitized OneBot calls and `stopped`. `progress.json` records the last completed checkpoint if a later assertion fails. `evidence-cards/` contains only rendered synthetic test cards. These are not browser screenshots; Dashboard UI pixel behavior is not claimed.

On success or failure the runner stops the HTTP server and host core, terminates the plugin and disposes the host database. Inspect `stopped: true`, the process exit status and the log. Disposable roots contain synthetic test vault data and host databases; do not include them wholesale in a user-facing artifact. Export only scripts, this README, sanitized JSON/logs and synthetic card proofs. The official host source is read-only throughout the test.
