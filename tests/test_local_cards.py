"""Local help/status facts, safety, complete fallback and real-font PNG checks."""

import os
from dataclasses import replace
from io import BytesIO
from pathlib import Path
from unittest.mock import patch

import pytest

from quota_link.cards import build_help_card, build_status_card, render_local_card
from quota_link.formatter import format_help, format_status
from quota_link.local_status import LocalStorageStatus
from quota_link.presentation.bitmap import BitmapBounds
from quota_link.settings import ConfigDiagnostic, load_settings


def text(spec):
    values = [
        spec.title,
        spec.subtitle,
        spec.caption,
        spec.brand,
        *spec.limitations,
        *spec.sources,
    ]
    for section in spec.sections:
        values.extend((section.heading, *section.paragraphs))
        for row in section.rows:
            values.extend(row.cells)
    return "\n".join(values)


def settings(count=2):
    return load_settings(
        {
            "providers": [
                {
                    "id": f"private-raw-id-{i}",
                    "type": "deepseek",
                    "display_name": f"中文 English 账户 {i}",
                    "auth": {"api_key": "PRIVATE-SYNTHETIC-TOKEN"},
                }
                for i in range(count)
            ]
        },
        environ={},
    )


@pytest.fixture
def font():
    value = os.environ.get("QUOTA_TEST_FONT")
    if not value:
        if os.environ.get("QUOTA_REQUIRE_TEST_FONT") == "1":
            pytest.fail("QUOTA_TEST_FONT required")
        pytest.skip("fixed font fixture required")
    return Path(value)


def test_help_has_every_real_command_and_only_enabled_display_names():
    value = settings()
    disabled = replace(value.directory.entries[1], enabled=False)
    value = replace(
        value,
        directory=replace(
            value.directory, entries=(value.directory.entries[0], disabled)
        ),
    )
    spec = build_help_card(value)
    for command in (
        "/yql",
        "/yql all",
        "/yql account <名称>",
        "/yql provider <名称>",
        "/yql help",
        "/yql status",
        "/yql <名称>",
    ):
        assert command in text(spec)
        assert command in format_help(value)
    assert value.directory.entries[0].display_name in text(spec)
    assert disabled.display_name not in text(spec)
    assert "演示数据" not in text(spec)


def test_status_includes_local_save_state_and_safe_diagnostics_only():
    value = settings()
    issue = ConfigDiagnostic(
        "safe-code",
        "PRIVATE-PATH",
        "请补齐余额接口配置，保存后可重新检查。",
        "PRIVATE-ID",
    )
    value = replace(value, errors=(issue,))
    storage = LocalStorageStatus("ready", ("encrypted", "environment"))
    combined = text(build_status_card(value, storage)) + format_status(value, storage)
    for expected in (
        "本地",
        "加密凭据已保存",
        "环境变量引用已保存",
        issue.safe_message,
        "群聊查询",
        "命令权限",
    ):
        assert expected in combined
    for forbidden in (
        "PRIVATE",
        "private-raw-id",
        "https://",
        "已联网",
        "验证成功",
        "演示数据",
    ):
        assert forbidden not in combined


@pytest.mark.parametrize("builder", [build_help_card, build_status_card])
def test_empty_cards_render_valid_offline_png(font, builder):
    from PIL import Image

    spec = builder(load_settings({}, environ={}))
    with patch("socket.socket", side_effect=AssertionError("offline")):
        content = render_local_card(spec, font)
    assert content is not None
    with Image.open(BytesIO(content)) as image:
        image.load()
        assert image.width == 960
        assert image.height <= BitmapBounds().max_height
        assert image.format == "PNG"
    assert len(content) <= BitmapBounds().max_bytes


@pytest.mark.parametrize("builder", [build_help_card, build_status_card])
def test_long_chinese_english_names_and_diagnostics_are_not_truncated(font, builder):
    value = settings(1)
    long_name = "长账户名称" * 12 + " SuperLongEnglishAccountName" * 5
    entry = replace(value.directory.entries[0], display_name=long_name)
    long_message = "请检查服务地址与接口路径。" * 20
    value = replace(
        value,
        directory=replace(value.directory, entries=(entry,)),
        errors=(ConfigDiagnostic("safe", "private", long_message),),
    )
    spec = builder(value)
    assert long_name in text(spec)
    if builder is build_status_card:
        assert long_message in text(spec)
    assert render_local_card(spec, font) is not None


@pytest.mark.parametrize(
    "builder,formatter",
    [(build_help_card, format_help), (build_status_card, format_status)],
)
def test_oversize_directory_falls_back_without_losing_accounts(
    font, builder, formatter
):
    value = settings(205)
    spec = builder(value)
    assert render_local_card(spec, font) is None
    fallback = formatter(value)
    for entry in value.directory.entries:
        assert entry.display_name in fallback
        assert entry.display_name in text(spec)


@pytest.mark.parametrize("builder", [build_help_card, build_status_card])
def test_missing_or_bad_font_returns_none(builder, tmp_path):
    spec = builder(settings())
    assert render_local_card(spec, None) is None
    bad = tmp_path / "bad.otf"
    bad.write_bytes(b"not a font")
    assert render_local_card(spec, bad) is None


def test_oversize_diagnostic_uses_complete_text_fallback(font):
    message = "需检查配置" * 1000
    value = replace(settings(), errors=(ConfigDiagnostic("safe", "private", message),))
    assert render_local_card(build_status_card(value), font) is None
    assert message in format_status(value)


def test_native_grsai_reason_is_actionable():
    value = load_settings(
        {
            "providers": [
                {"id": "private", "type": "grsai", "display_name": "Grsai Demo"}
            ]
        },
        environ={},
    )
    assert "请配置 Grsai 账户请求令牌" in text(build_status_card(value))
    assert "请配置 Grsai 账户请求令牌" in format_status(value)


def test_display_diagnostic_localizes_known_path_copy_without_mutating_facts():
    original = "请填写以 / 开头的相对 API Path"
    issue = ConfigDiagnostic("missing_api_path", "providers[0].endpoint.path", original)
    value = replace(settings(), errors=(issue,))
    combined = text(build_status_card(value)) + format_status(value)
    assert "请填写以 / 开头的相对接口路径" in combined
    assert "API Path" not in combined
    assert issue.safe_message == original
