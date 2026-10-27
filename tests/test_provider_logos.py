"""Bundled provider-logo safety/geometry; branding is optional and never provider IO."""

import os
from dataclasses import replace
from io import BytesIO
from pathlib import Path
from unittest.mock import patch

import pytest

from examples.provider_logo_preview.render import cases
from quota_link.presentation.bitmap import (
    SECTION_ICON_SIZE,
    BitmapBounds,
    CardSpec,
    Row,
    Section,
    _Layout,
    render_card,
)
from quota_link.presentation.font import CardFontProvider
from quota_link.presentation.provider_logos import LOGO_SHA256, load_logo


@pytest.fixture
def font():
    path = os.environ.get("QUOTA_TEST_FONT")
    if not path:
        if os.environ.get("QUOTA_REQUIRE_TEST_FONT") == "1":
            pytest.fail("fixed font fixture required")
        pytest.skip("fixed font fixture required")
    return CardFontProvider(Path(path))


def spec():
    return CardSpec(
        "本地演示", sections=(Section("账户名称", rows=(Row(("余额", "12.34 CNY")),)),)
    )


def test_only_current_allowlisted_asset_hashes_load(tmp_path):
    assert all(load_logo(key) is not None for key in LOGO_SHA256)
    assert load_logo("../../private-path") is None
    assert load_logo("https://private.invalid/secret") is None
    assert load_logo(None) is None
    assert load_logo("meinianda", tmp_path) is None
    (tmp_path / "png-128").mkdir()
    (tmp_path / "png-128/meinianda.png").write_bytes(b"old or corrupted asset")
    assert load_logo("meinianda", tmp_path) is None


@pytest.mark.parametrize(
    "icons",
    [
        (),
        (None,),
        (b"not-png SENSITIVE_TOKEN",),
        (b"x" * 131073,),
        ("https://private.invalid",),
        (None, None),
    ],
)
def test_missing_bad_or_remote_icon_keeps_identical_original_card(font, icons):
    original = render_card(spec(), font_provider=font)
    with patch("socket.socket", side_effect=AssertionError("offline only")):
        result = render_card(spec(), font_provider=font, section_icons=icons)
    assert result == original
    assert b"SENSITIVE_TOKEN" not in result.content


def test_oversized_png_is_optional_and_preserves_original_card(font):
    from PIL import Image

    stream = BytesIO()
    Image.new("RGBA", (300, 1), "red").save(stream, format="PNG")
    assert render_card(
        spec(), font_provider=font, section_icons=(stream.getvalue(),)
    ) == render_card(spec(), font_provider=font)


def test_long_heading_with_logo_wraps_completely_above_values(font):
    heading = "中文长账户名称" * 12 + " / SuperLongEnglishAccountName" * 6
    value = replace(
        spec(), sections=(Section(heading, rows=(Row(("余额", "99.123 CNY")),)),)
    )
    layout = _Layout(font, BitmapBounds(), frozenset({0}))
    layout.build(value)
    rendered_heading = next(item for item in layout.texts if item.size == 28)
    assert "".join(line.text for line in rendered_heading.lines) == heading
    index, icon_x, icon_y = layout.icons[0]
    assert index == 0
    assert rendered_heading.x >= icon_x + SECTION_ICON_SIZE + 12
    metric_label = next(
        item for item in layout.texts if any(line.text == "余额" for line in item.lines)
    )
    assert metric_label.y >= icon_y + SECTION_ICON_SIZE + 12
    content = render_card(
        value, font_provider=font, section_icons=(load_logo("meinianda"),)
    )
    assert content.height <= BitmapBounds().max_height


@pytest.mark.parametrize("case", cases(), ids=lambda value: value[0])
def test_real_demo_pipeline_is_bounded_offline_and_preserves_text(font, case):
    from PIL import Image

    filename, value, keys = case
    with patch("socket.socket", side_effect=AssertionError("offline only")):
        result = render_card(
            value,
            font_provider=font,
            section_icons=tuple(load_logo(key) for key in keys),
        )
    assert result.width == 960
    assert result.height <= BitmapBounds().max_height
    assert len(result.content) <= BitmapBounds().max_bytes
    with Image.open(BytesIO(result.content)) as image:
        image.load()
        assert image.format == "PNG"
    assert "演示数据" not in value.caption  # Marker belongs to the demo script only.


def test_production_renderer_automatically_uses_bundled_icons(font):
    from quota_link.cards import render_local_card

    for filename, value, keys in cases():
        expected = render_card(
            value,
            font_provider=font,
            section_icons=tuple(load_logo(key) for key in keys),
        ).content
        actual = render_local_card(value, Path(os.environ["QUOTA_TEST_FONT"]))
        assert actual == expected
        assert actual != render_card(value, font_provider=font).content


def test_production_missing_icons_retains_complete_original_card(font):
    from quota_link.cards import render_local_card

    for filename, value, keys in cases():
        with patch("quota_link.cards.load_logo", return_value=None):
            actual = render_local_card(value, Path(os.environ["QUOTA_TEST_FONT"]))
        assert actual == render_card(value, font_provider=font).content


def test_bundled_manifest_matches_static_sources_and_png_derivatives():
    import json
    from hashlib import sha256
    from xml.etree import ElementTree

    root = (
        Path(__file__).resolve().parents[1]
        / "quota_link/presentation/assets/provider_logos"
    )
    manifest = json.loads((root / "manifest.json").read_text())
    for item in manifest["assets"]:
        source = (root / item["file"]).read_bytes()
        content = (root / item["png_file"]).read_bytes()
        assert sha256(source).hexdigest() == item["sha256"]
        assert (
            sha256(content).hexdigest()
            == item["png_sha256"]
            == LOGO_SHA256[item["provider_type"]]
        )
    for path in (root / "svg").glob("*.svg"):
        document = ElementTree.fromstring(path.read_bytes())
        for node in document.iter():
            assert node.tag.rsplit("}", 1)[-1] in {
                "svg",
                "title",
                "desc",
                "g",
                "path",
                "defs",
                "clipPath",
            }
            for key, value in node.attrib.items():
                assert not key.lower().startswith("on")
                assert key.rsplit("}", 1)[-1] not in {"href", "src", "style"}
                if "url(" in value:
                    assert value.startswith("url(#") and value.endswith(")")
    assert "library_file_id" not in json.dumps(manifest)


def test_unknown_selector_does_not_resolve_any_resource():
    with patch(
        "quota_link.presentation.provider_logos.files",
        side_effect=AssertionError("do not resolve"),
    ):
        assert load_logo("../../sensitive") is None
        assert load_logo("https://private.invalid") is None
        assert load_logo({"secret": "value"}) is None


def test_resource_failure_omits_icon_without_exposing_diagnostic():
    with patch(
        "quota_link.presentation.provider_logos.files",
        side_effect=OSError("PRIVATE-PATH-TOKEN"),
    ):
        assert load_logo("meinianda") is None


@pytest.mark.parametrize("available", [True, False])
def test_legacy_grsai_uses_consistent_presentation_icon_without_changing_facts(
    available,
):
    from datetime import UTC, datetime

    from quota_link.cards import build_result_card, build_status_card
    from quota_link.models import (
        BalanceSnapshot,
        NormalizedProviderError,
        ProviderErrorCategory,
        ProviderType,
        QueryRequest,
        QueryRequestKind,
        QueryResult,
        SnapshotStatus,
    )
    from quota_link.settings import load_settings

    settings = load_settings(
        {
            "providers": [
                {
                    "id": "legacy",
                    "type": "openai_compatible",
                    "service_profile": "grsai",
                    "balance_scope": "account",
                    "display_name": "Grsai 旧配置",
                    "auth": {"token": "synthetic-token"},
                    "endpoint": {"base_url": "https://example.invalid"},
                }
            ]
        },
        environ={},
    )
    now = datetime(2026, 10, 27, tzinfo=UTC)
    snapshot = BalanceSnapshot(
        "legacy",
        ProviderType.OPENAI_COMPATIBLE,
        "Grsai 旧配置",
        SnapshotStatus.AVAILABLE if available else SnapshotStatus.UNAVAILABLE,
        (),
        "synthetic",
        now,
        error=None
        if available
        else NormalizedProviderError(ProviderErrorCategory.CONFIGURATION, "请检查配置"),
    )
    result = QueryResult(QueryRequest(QueryRequestKind.ALL), (snapshot,), now)
    assert build_result_card(result, settings.directory).sections[0].icon_key == "grsai"
    assert build_status_card(settings).sections[1].icon_key == "grsai"
    assert snapshot.provider_type is ProviderType.OPENAI_COMPATIBLE
    assert result.snapshots == (snapshot,)
