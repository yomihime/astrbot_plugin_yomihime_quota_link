"""Phone-friendly alert layouts retain bounded wrapping and lossless facts."""

from dataclasses import replace
from io import BytesIO

import pytest
from test_alert_cards import examples, status, units
from test_alert_commands import config
from test_local_cards import font as _font_fixture

from quota_link.alert_cards import (
    build_alert_help_card,
    build_alert_status_card,
    build_alert_units_card,
    format_alert_card,
)
from quota_link.presentation.bitmap import (
    BitmapBounds,
    BitmapUnavailable,
    CardSpec,
    Row,
    Section,
    _Layout,
    render_card,
)
from quota_link.presentation.font import CardFontProvider

font = _font_fixture


@pytest.mark.parametrize("topic", ("", "account", "units", "targets"))
def test_help_is_readable_at_phone_scale_without_a_tall_index(font, topic):
    from PIL import Image

    card = build_alert_help_card(topic)
    assert card.layout == "compact" and card.width == 720
    layout = _Layout(CardFontProvider(font), BitmapBounds())
    height = layout.build(card)
    commands = {row.cells[1] for section in card.sections for row in section.rows}
    for item in layout.texts:
        value = "".join(line.text for line in item.lines)
        if value in commands:
            assert item.size * 390 / card.width >= 14
        for line in item.lines:
            assert item.x >= 36
            assert item.x + line.bbox[2] - line.bbox[0] <= card.width - 36
    if not topic:
        assert height <= 760
    bitmap = render_card(card, font_provider=CardFontProvider(font))
    with Image.open(BytesIO(bitmap.content)) as image:
        assert image.size == (card.width, height)


def test_compact_wraps_long_commands_ids_and_unicode_without_loss(font):
    values = ("账户" * 18, "refresh " + "a" * 64 + "\\n结束")
    card = CardSpec(
        title="长字段",
        layout="compact",
        width=720,
        sections=(Section(rows=(Row(values, role="command"),)),),
    )
    layout = _Layout(CardFontProvider(font), BitmapBounds())
    layout.build(card)
    drawn = ["".join(line.text for line in item.lines) for item in layout.texts]
    for value in values:
        assert value in drawn


@pytest.mark.parametrize(
    "bounds",
    (
        BitmapBounds(max_height=10),
        BitmapBounds(max_pixels=100),
        BitmapBounds(max_bytes=10),
        BitmapBounds(max_output_lines=2),
        BitmapBounds(max_measurements=2),
    ),
)
def test_compact_budget_failure_rejects_whole_image(font, bounds):
    with pytest.raises(BitmapUnavailable):
        render_card(
            build_alert_help_card(), font_provider=CardFontProvider(font), bounds=bounds
        )


def test_unknown_layout_is_rejected_before_drawing(font):
    with pytest.raises(BitmapUnavailable, match="invalid_input"):
        render_card(
            replace(build_alert_help_card(), layout="unknown"),
            font_provider=CardFontProvider(font),
        )


def test_short_status_not_repeated_and_long_status_never_lost():
    data = status()
    row = data["accounts"][0]
    row.update(status="monitoring", message="监测中，未触发预警", detail="")
    card = build_alert_status_card(config(), data)
    assert format_alert_card(card).count(row["message"]) == 1
    message = "同一推送目标共用至少 300 秒发送间隔；等待后续有效检查"
    row.update(status="waiting_budget", message=message)
    card = build_alert_status_card(config(), data)
    assert message in format_alert_card(card)
    assert any(
        item.role == "note" and item.cells[1] == message
        for section in card.sections
        for item in section.rows
    )


def test_equal_metrics_combine_but_different_metrics_remain_explicit():
    account = config()["providers"][0]
    same = build_alert_units_card(account, units(binding_metric="total_balance"))
    assert "当前 / 已绑定指标：total_balance" in format_alert_card(same)
    different = format_alert_card(build_alert_units_card(account, units()))
    assert "当前指标：total_balance" in different
    assert "已绑定指标：old_metric" in different


def test_all_alert_projections_use_compact_without_changing_general_card_default():
    assert all(card.layout == "compact" for card in examples())
    assert CardSpec(title="标准额度卡").layout == "standard"
