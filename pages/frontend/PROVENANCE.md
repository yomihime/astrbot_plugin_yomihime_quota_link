# Series UI provenance

This is the production Quota Link management page, not a static mockup. It uses the actual Game Link Oil UI source, with the same Vue / Naive UI rendering system, theme provider, form components, shell rail, responsive geometry, in-flow project footer, and inline confirmation/focus behavior.

Source: https://github.com/yomihime/astrbot_plugin_yomihime_game_link/tree/cf755ed4ac455e8be48a9b99c285078cdb696510/pages/frontend

The exact upstream commit is `cf755ed4ac455e8be48a9b99c285078cdb696510`. Both projects are AGPL-3.0. `provenance.json` records each byte-for-byte source copy and its SHA-256. Copied files are `src/ui/components.ts`, `src/ui/shared-components.ts`, `src/ui/tokens.css`, `src/shell.css`, and `src/confirmation.ts`. Quota-specific presentation is isolated in `src/quota.css`. The module SDK, game catalog, dynamic extension loader, and unrelated Game Link services are intentionally not copied.

`src/legacy-schema.json` preserves the actual Quota Link v0.1.3 field definitions from the original `_conf_schema.json` before that file became bootstrap-only. It contains descriptors and empty defaults, never user credentials. `src/config.js` derives the detailed account, endpoint, mapping, global and permission controls from that schema. This is explicit source reuse, not a claim that the two independent plugins share a runtime installation.

Pinned runtime dependencies are Vue 3.5.43 and Naive UI 2.45.3, matching the verified Game Link installation. Build tools are Vite 8.3.2, TypeScript 7.0.2, Node types 26.6.4, and jsdom 30.1.2. The pinned upstream checkout lists Vite 8.3.3; this frontend deliberately uses the already proven 8.3.2 dependency lock available in the build environment rather than silently changing the lock or inventing a successful registry install.

The build discovers the runtime packages actually rendered into the bundle and ships every corresponding license notice. `pages/00-quota-link/assets.json` records the production asset checksums. No CDN, remote fonts, image assets, or client-side analytics are used.
