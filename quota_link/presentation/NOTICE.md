# Command-card provenance

The bounded character wrapping and drawing budgets in
`bitmap.py` are adapted from `presentation/card_bitmap.py` of
[yomihime/astrbot_plugin_yomihime_game_link](https://github.com/yomihime/astrbot_plugin_yomihime_game_link)
at commit `2d6fb1fbd137a5959a5e2bee135451c31cef33a5` (AGPL-3.0, same as this plugin).
The Unicode cmap parser in `font.py` is adapted from its `system_font.py`.
Unused rich-text effects and declarative layout machinery are not copied.
The modern `presentation/layout_renderer.py` supplies the exact nine-color
warm-paper palette, detail layout tokens (margin 56, gap 18, panel padding 22,
radius 18) and title/heading/body/caption type sizes (40/28/24/16). YQL uses
independent account panels with a primary stat and supporting property grid,
not YGL's older generic label/value tables. All content is measured before
painting at 960px width. YQL projects only normalized result facts into this private renderer;
it has no runtime dependency on YGL or remote rendering services.

## Managed font (not bundled)

The expected font is the original unmodified Noto Sans CJK SC Regular version
2.004, face 0, © 2014–2021 Adobe, licensed under SIL OFL 1.1. The license is
included as `assets/fonts/OFL.txt`; the font binary is not in source or packages.
Upstream revision: `notofonts/noto-cjk@523d033d6cb47f4a80c58a35753646f5c3608a78`,
`Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf`.
Size: 16,437,364 bytes. SHA256:
`2c76254f6fc379fddfce0a7e84fb5385bb135d3e399294f6eeb6680d0365b74b`.

`quota_link/managed_font.py` adapts YGL's `services/managed_font.py` from the
same pinned YGL commit above: fixed Tsinghua CTAN, pinned jsDelivr, then pinned
raw GitHub URLs; 15-second per-source / 45-second total download budgets;
identity encoding, no redirects or environment proxies; exact byte/hash checks
and atomic publication. Existing httpx supplies transport instead of adding a
second HTTP library. File/hash work is offloaded and joined on cancellation.

Startup first uses a valid YQL `resources/fonts/` cache. After public AstrBot
metadata confirms YGL installation, its valid `resources/fonts/` font may be
copied atomically into YQL's independent cache. AstrBot 4.29.1's public
`Context.get_registered_star` and `StarTools.get_data_dir` establish installation
and the sibling plugin-data root; YGL is never imported, changed, or linked.
If neither cache is usable, one bounded download round runs in the background.
Queries never download; pending, missing, corrupt or unsupported fonts fall
back to complete command text. Restart retries preparation.

For offline rendering tests set `QUOTA_TEST_FONT` to an explicit local copy of
the exact pinned font. Test mocks exercise network failures without contacting
providers. `examples/render_cards.py --font-path ...` uses that same checked
font-loading and card-rendering path. No real account values enter the samples.
