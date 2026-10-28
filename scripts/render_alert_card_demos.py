"""Render synthetic alert command cards with production builders, without IO.

Usage: python scripts/render_alert_card_demos.py --font /path/to/pinned.otf --output /tmp/alert-demo
Only this script adds the demo marker. No credentials, queries or messages.
"""

import argparse
import json
import sys
from dataclasses import replace
from hashlib import sha256
from io import BytesIO
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from quota_link.alert_cards import (  # noqa: E402
    build_alert_help_card,
    build_alert_status_card,
    build_alert_targets_card,
    build_alert_units_card,
)
from quota_link.alert_commands import target_id  # noqa: E402
from quota_link.alert_delivery import DELIVERY_DETAILS  # noqa: E402
from quota_link.alerts import _MESSAGES  # noqa: E402
from quota_link.cards import render_local_card  # noqa: E402


def demo_cases():
    accounts = [
        {
            "id": "synthetic-deepseek",
            "type": "deepseek",
            "display_name": "DeepSeek · 日常工作",
        },
        {
            "id": "synthetic-bailian",
            "type": "alibaba_bailian",
            "display_name": "阿里云百炼 · 开发团队",
        },
        {"id": "synthetic-grsai", "type": "grsai", "display_name": "Grsai · 创作账户"},
    ]
    status = {
        "running": True,
        "storage_available": True,
        "accounts": [
            {
                "account_id": "synthetic-deepseek",
                "status": "blocked",
                "message": _MESSAGES["blocked"],
                "detail_code": "platform_not_found",
                "detail": DELIVERY_DETAILS["platform_not_found"],
                "last_checked_at": "2026-10-28T01:20:08+00:00",
                "last_sent_at": None,
            },
            {
                "account_id": "synthetic-bailian",
                "status": "monitoring",
                "message": _MESSAGES["monitoring"],
                "detail": "",
                "last_checked_at": "2026-10-28T01:20:08+00:00",
                "last_sent_at": "2026-10-27T18:12:30+00:00",
            },
            {
                "account_id": "synthetic-grsai",
                "status": "waiting_budget",
                "message": _MESSAGES["waiting_budget"],
                "detail": "",
                "last_checked_at": "2026-10-28T01:20:08+00:00",
                "last_sent_at": "2026-10-28T01:18:42+00:00",
            },
        ],
    }
    targets = (
        ("demo-qq:GroupMessage:20001", ("10001", "10002")),
        ("demo-qq:FriendMessage:10003", ()),
    )
    units = {
        "unit_state": "changed",
        "unit": "CNY",
        "observed_at": "2026-10-28T01:15:00+00:00",
        "metric": "total_balance",
        "binding_metric": "total_balance",
        "change_reason": "unit_changed",
        "choices_state": "fresh",
        "choices_observed_at": "2026-10-28T01:20:08+00:00",
        "choices": [{"id": "a" * 64, "unit": "USD", "metric": "total_balance"}],
    }
    return (
        ("01-alert-help.png", build_alert_help_card()),
        (
            "02-alert-status.png",
            build_alert_status_card({"providers": accounts}, status),
        ),
        (
            "03-alert-targets.png",
            build_alert_targets_card(
                tuple((target_id(umo), umo, mentions) for umo, mentions in targets)
            ),
        ),
        ("04-alert-units.png", build_alert_units_card(accounts[0], units)),
    )


def main():
    from PIL import Image

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--font", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    manifest = []
    for filename, spec in demo_cases():
        bitmap = render_local_card(
            replace(spec, caption="演示数据 · 本地合成配置与运行状态"), args.font
        )
        if bitmap is None:
            raise SystemExit(f"Render failed: {filename}")
        (args.output / filename).write_bytes(bitmap)
        with Image.open(BytesIO(bitmap)) as image:
            image.load()
            width, height = image.size
        manifest.append(
            {
                "file": filename,
                "bytes": len(bitmap),
                "width": width,
                "height": height,
                "sha256": sha256(bitmap).hexdigest(),
            }
        )
    (args.output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
