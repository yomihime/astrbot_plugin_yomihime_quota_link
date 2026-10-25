"""Offline card regressions, runnable with unittest without developer packages."""

import asyncio
import builtins
import importlib.util
import os
import sys
import unittest
from dataclasses import replace
from datetime import UTC, datetime, timedelta, timezone
from decimal import Decimal
from io import BytesIO
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from quota_link import cards  # noqa: E402
from quota_link.models import (  # noqa: E402
    BalanceItem,
    BalanceItemKind,
    BalanceSnapshot,
    NormalizedProviderError,
    ProviderErrorCategory,
    ProviderType,
    QueryRequest,
    QueryRequestKind,
    QueryResult,
    SnapshotStatus,
)
from quota_link.presentation.bitmap import (  # noqa: E402
    BitmapBounds,
    BitmapUnavailable,
    render_card,
)
from quota_link.presentation.font import CardFontProvider  # noqa: E402

WHEN = datetime(2026, 1, 2, 3, 4, 5, tzinfo=UTC)


def snapshot(**changes):
    value = BalanceSnapshot(
        account_id="synthetic-account",
        provider_type=ProviderType.DEEPSEEK,
        display_name="演示账户",
        status=SnapshotStatus.AVAILABLE,
        balances=(BalanceItem(BalanceItemKind.CASH, Decimal("12.340"), "CNY"),),
        source="合成数据，不访问供应商",
        fetched_at=WHEN,
    )
    return replace(value, **changes)


def result(*snapshots, kind=QueryRequestKind.ALL, target=None):
    return QueryResult(QueryRequest(kind, target), snapshots, WHEN)


def all_text(spec):
    parts = [
        spec.title,
        spec.subtitle,
        spec.caption,
        spec.brand,
        *spec.sources,
        *spec.limitations,
    ]
    for section in spec.sections:
        parts.extend((section.heading, *section.paragraphs, *section.columns))
        for row in section.rows:
            parts.extend(row.cells)
    return "\n".join(parts)


class ProjectionTests(unittest.TestCase):
    def test_all_five_provider_types_preserve_independent_units(self):
        units = ["CNY", "USD", "credit", "site_credit", "tokens"]
        snapshots = tuple(
            snapshot(
                provider_type=provider,
                display_name=provider.value,
                balances=(BalanceItem(BalanceItemKind.CUSTOM, Decimal(i + 1), unit),),
            )
            for i, (provider, unit) in enumerate(zip(ProviderType, units, strict=True))
        )
        spec = cards.build_result_card(result(*snapshots))
        self.assertEqual(len(spec.sections), 5)
        text = all_text(spec)
        for i, (provider, unit) in enumerate(zip(ProviderType, units, strict=True)):
            self.assertIn(provider.value, text)
            self.assertIn(f"{i + 1} {unit}", text)
        self.assertNotIn("不合并", text)
        self.assertNotIn("15 CNY", text)

    def test_every_balance_field_and_semantics_survive(self):
        item = BalanceItem(
            BalanceItemKind.QUOTA,
            amount=Decimal("1.2300"),
            unit="site_credit",
            total=Decimal("20"),
            remaining=Decimal("8.75"),
            used=Decimal("11.25"),
            expires_at=WHEN + timedelta(days=1),
            label="站内额度",
            raw_semantics="账户站内额度，不是 API Key 额度；不换算为货币",
        )
        text = all_text(cards.build_result_card(result(snapshot(balances=(item,)))))
        for expected in (
            "1.2300 site_credit",
            "总量\n20 site_credit",
            "剩余\n8.75 site_credit",
            "已用\n11.25 site_credit",
            "到期\n2026-01-03 03:04:05 UTC",
            "站内额度",
            item.raw_semantics,
        ):
            self.assertIn(expected, text)

    def test_multiple_item_notes_keep_their_item_identity(self):
        items = tuple(
            BalanceItem(
                BalanceItemKind.CUSTOM,
                Decimal("2"),
                "credit",
                label=label,
                raw_semantics=note,
                expires_at=WHEN + timedelta(days=index),
            )
            for index, (label, note) in enumerate(
                (("项目甲", "仅用于甲服务"), ("项目乙", "仅用于乙服务"))
            )
        )
        spec = cards.build_result_card(result(snapshot(balances=items)))
        rows = spec.sections[0].rows
        for index, (label, note) in enumerate(
            (("项目甲", "仅用于甲服务"), ("项目乙", "仅用于乙服务"))
        ):
            self.assertTrue(any(row.cells == (label + "说明", note) for row in rows))
            self.assertTrue(
                any(
                    row.cells
                    == (
                        label + "到期",
                        (WHEN + timedelta(days=index)).strftime(
                            "%Y-%m-%d %H:%M:%S UTC"
                        ),
                    )
                    for row in rows
                )
            )

    def test_unknown_amount_not_invented_as_zero(self):
        text = all_text(
            cards.build_result_card(
                result(
                    snapshot(
                        balances=(BalanceItem(BalanceItemKind.CREDITS, unit="credit"),)
                    )
                )
            )
        )
        self.assertIn("数值未知（单位：credit）", text)
        self.assertNotIn("0 credit", text)

    def test_local_configuration_failure_does_not_claim_remote_fetch(self):
        from quota_link.cache import BalanceCache
        from quota_link.service import QueryService
        from quota_link.settings import load_settings

        async def run():
            settings = load_settings(
                {
                    "providers": [
                        {
                            "id": "missing-key",
                            "type": "deepseek",
                            "display_name": "未配置凭据",
                        }
                    ]
                }
            )
            service = QueryService(settings, {}, None, BalanceCache())
            try:
                return await service.query(QueryRequest(QueryRequestKind.ALL))
            finally:
                await service.close()

        outcome = asyncio.run(run())
        self.assertEqual(len(outcome.snapshots), 1)
        self.assertEqual(
            outcome.snapshots[0].error.category, ProviderErrorCategory.CONFIGURATION
        )
        text = all_text(cards.build_result_card(outcome))
        self.assertNotIn("缓存数据", text)
        self.assertIn("账户配置不完整", text)
        self.assertNotIn("实时获取", text)

    def test_cache_and_fetched_time_are_distinct_from_query_time(self):
        cached = snapshot(cached=True, fetched_at=WHEN - timedelta(hours=2))
        text = all_text(cards.build_result_card(result(cached)))
        self.assertIn("缓存", text)
        self.assertIn("获取：2026-01-02 01:04:05 UTC", text)
        self.assertIn("查询：2026-01-02 03:04:05 UTC", text)

    def test_timezone_conversion_is_explicit(self):
        local = WHEN.astimezone(timezone(timedelta(hours=8)))
        spec = cards.build_result_card(replace(result(snapshot()), queried_at=local))
        self.assertIn("2026-01-02 03:04:05 UTC", spec.caption)

    def test_error_and_partial_balances_are_both_retained(self):
        error = NormalizedProviderError(ProviderErrorCategory.RATE_LIMITED, "稍后重试")
        value = snapshot(status=SnapshotStatus.PARTIAL, error=error)
        text = all_text(cards.build_result_card(result(value)))
        self.assertIn("12.340 CNY", text)
        self.assertIn("稍后重试", text)
        self.assertIn("1 个部分成功", text)

    def test_all_status_labels_and_failure_summary(self):
        values = [snapshot(status=status, balances=()) for status in SnapshotStatus]
        text = all_text(cards.build_result_card(result(*values)))
        for label in ("可用", "不可用", "部分可用", "状态未知"):
            self.assertIn(label, text)
        self.assertIn("1 个查询成功 · 1 个部分成功 · 2 个查询失败", text)

    def test_empty_accounts_and_empty_balances(self):
        self.assertIn(
            "当前没有配置可查询的账户", all_text(cards.build_result_card(result()))
        )
        empty = result(kind=QueryRequestKind.ACCOUNT, target="demo")
        self.assertIn("没有可显示的查询结果", all_text(cards.build_result_card(empty)))
        self.assertIn(
            "没有可显示的余额或用量项目",
            all_text(cards.build_result_card(result(snapshot(balances=())))),
        )

    def test_detail_titles_and_target(self):
        for kind, expected in (
            (QueryRequestKind.ACCOUNT, "账户额度与用量"),
            (QueryRequestKind.PROVIDER, "供应商额度与用量"),
        ):
            spec = cards.build_result_card(result(snapshot(), kind=kind, target="demo"))
            self.assertEqual(spec.title, expected)
            self.assertIn("目标：demo", spec.subtitle)

    def test_control_characters_cannot_forge_structure(self):
        value = snapshot(display_name="安全\n账户\u202e", source="本地\x00来源")
        text = all_text(cards.build_result_card(result(value)))
        self.assertIn("安全 账户", text)
        self.assertNotIn("\u202e", text)
        self.assertNotIn("\x00", text)

    def test_private_identifiers_and_diagnostic_details_are_not_projected(self):
        secret = "https://example.invalid/?api_key=SYNTHETIC_SECRET"
        error = NormalizedProviderError(
            ProviderErrorCategory.ENDPOINT, "端点不可用", secret
        )
        text = all_text(
            cards.build_result_card(result(snapshot(account_id=secret, error=error)))
        )
        self.assertNotIn(secret, text)
        self.assertNotIn("SYNTHETIC_SECRET", text)
        self.assertNotIn("https://", text)
        self.assertIn("端点不可用", text)


class BitmapTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        value = os.environ.get("QUOTA_TEST_FONT")
        if not value:
            raise unittest.SkipTest(
                "Set QUOTA_TEST_FONT to the pinned Noto font fixture"
            )
        cls.font_path = Path(value)

    def render(self, facts):
        return cards.render_result_card(facts, self.font_path)

    def test_actual_png_is_bounded_and_offline(self):
        from PIL import Image

        with patch(
            "socket.create_connection", side_effect=AssertionError("offline only")
        ):
            content = self.render(result(snapshot()))
        self.assertIsNotNone(content)
        self.assertTrue(content.startswith(b"\x89PNG\r\n\x1a\n"))
        self.assertLessEqual(len(content), BitmapBounds().max_bytes)
        with Image.open(BytesIO(content)) as image:
            self.assertEqual(image.format, "PNG")
            self.assertEqual(image.width, 960)
            self.assertLessEqual(image.height, BitmapBounds().max_height)
            image.load()

    def test_long_unicode_name_wraps_without_dropping_text(self):
        name = "很长的账户名称" * 20 + " ABCDEFGHIJKLMNOPQRSTUVWXYZ" * 3
        facts = result(snapshot(display_name=name))
        self.assertIn(name, all_text(cards.build_result_card(facts)))
        self.assertIsNotNone(self.render(facts))

    def test_all_providers_empty_and_failure_cards_actually_render(self):
        all_providers = result(
            *(
                snapshot(provider_type=provider, display_name=provider.value)
                for provider in ProviderType
            )
        )
        failed = result(
            snapshot(
                status=SnapshotStatus.UNAVAILABLE,
                balances=(),
                error=NormalizedProviderError(
                    ProviderErrorCategory.AUTHENTICATION, "凭据不可用，请检查配置"
                ),
            )
        )
        for facts in (all_providers, result(), failed):
            with self.subTest(snapshots=len(facts.snapshots)):
                self.assertIsNotNone(self.render(facts))

    def test_unsupported_glyph_uses_text_fallback(self):
        self.assertIsNone(self.render(result(snapshot(display_name="账户\U0010ffff"))))

    def test_oversized_sections_or_text_use_fallback(self):
        self.assertIsNone(self.render(result(*(snapshot() for _ in range(33)))))
        self.assertIsNone(self.render(result(snapshot(display_name="长" * 5000))))

    def test_height_pixel_and_byte_limits_reject_not_crop(self):
        spec = cards.build_result_card(result(snapshot()))
        for bounds in (
            BitmapBounds(max_height=10),
            BitmapBounds(max_pixels=100),
            BitmapBounds(max_bytes=10),
        ):
            with self.subTest(bounds=bounds), self.assertRaises(BitmapUnavailable):
                render_card(
                    spec, font_provider=CardFontProvider(self.font_path), bounds=bounds
                )

    def test_missing_or_corrupt_font_falls_back(self):
        with patch.object(Path, "open", side_effect=FileNotFoundError("private path")):
            self.assertIsNone(self.render(result(snapshot())))
        with patch.object(Path, "open", return_value=BytesIO(b"corrupt")):
            self.assertIsNone(self.render(result(snapshot())))

    def test_font_integrity_mismatch_falls_back(self):
        with patch("quota_link.presentation.font.sha256") as digest:
            digest.return_value.hexdigest.return_value = "0" * 64
            self.assertIsNone(self.render(result(snapshot())))

    def test_missing_pillow_falls_back(self):
        original = builtins.__import__

        def without_pillow(name, *args, **kwargs):
            if name == "PIL" or name.startswith("PIL."):
                raise ImportError("no Pillow")
            return original(name, *args, **kwargs)

        with patch("builtins.__import__", side_effect=without_pillow):
            self.assertIsNone(self.render(result(snapshot())))

    def test_unexpected_renderer_failure_has_no_details(self):
        with patch.object(
            cards, "render_card", side_effect=RuntimeError("SYNTHETIC_SECRET")
        ):
            self.assertIsNone(self.render(result(snapshot())))

    def test_release_allowlist_contains_rendering_assets(self):
        spec = importlib.util.spec_from_file_location(
            "card_test_builder", ROOT / "scripts/build_plugin.py"
        )
        builder = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(builder)
        required = {
            "quota_link/cards.py",
            "quota_link/presentation/bitmap.py",
            "quota_link/presentation/font.py",
            "quota_link/presentation/NOTICE.md",
            "quota_link/managed_font.py",
            "quota_link/presentation/assets/fonts/OFL.txt",
        }
        self.assertTrue(required.issubset(builder.PACKAGE_FILES))
        self.assertFalse(
            any(
                path.endswith((".otf", ".ttf", ".ttc"))
                for path in builder.PACKAGE_FILES
            )
        )
        for path in required:
            self.assertTrue((ROOT / path).is_file(), path)


if __name__ == "__main__":
    unittest.main()
