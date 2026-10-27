"""Synthetic provider-logo examples using the production card renderer.

The PNGs are fixed offline renders of the bundled SVG sources. This script uses
the same automatic logo loading as commands. Demo markers are added only here. Run from the repository root with --font and --output.
"""

import argparse
import json
import sys
from dataclasses import replace
from hashlib import sha256
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from examples.render_cards import samples  # noqa: E402
from quota_link.cards import build_result_card, build_status_card, render_local_card  # noqa: E402
from quota_link.local_status import LocalStorageStatus  # noqa: E402
from quota_link.models import ProviderType, QueryRequest, QueryRequestKind  # noqa: E402
from quota_link.presentation.provider_logos import LOGO_SHA256  # noqa: E402
from quota_link.settings import load_settings  # noqa: E402


def cases():
    results = samples()["all-providers"]
    all_card = build_result_card(results)
    only_meinianda = next(
        s for s in results.snapshots if s.provider_type is ProviderType.MEINIANDA
    )
    detail = build_result_card(
        replace(
            results,
            request=QueryRequest(QueryRequestKind.ACCOUNT, only_meinianda.account_id),
            snapshots=(only_meinianda,),
        )
    )
    names = {
        "deepseek": "DeepSeek · 日常工作",
        "alibaba_bailian": "阿里云百炼 · 开发团队",
        "grsai": "Grsai · 创意工作室",
        "meinianda": "Meinianda · 个人账户",
        "openai_compatible": "兼容服务 · Research Sandbox / 团队实验室",
    }
    providers = []
    for snapshot in results.snapshots:
        kind = snapshot.provider_type
        account = {
            "id": f"synthetic-{kind.value}",
            "type": kind.value,
            "display_name": names[kind.value],
            "auth": {"api_key": "synthetic-demo-key"},
        }
        if kind is ProviderType.ALIBABA_BAILIAN:
            account["auth"] = {
                "access_key_id": "synthetic-id",
                "access_key_secret": "synthetic-secret",
            }
        elif kind is ProviderType.GRSAI:
            account["auth"] = {"token": "synthetic-token"}
        elif kind is ProviderType.OPENAI_COMPATIBLE:
            account["endpoint"] = {
                "url": "https://example.invalid/balance",
                "auth_mode": "bearer",
            }
            account["response_mapping"] = {"amount_path": "/balance", "unit": "credit"}
        providers.append(account)
    settings = load_settings({"providers": providers}, environ={})
    storage = LocalStorageStatus(
        "ready", ("encrypted", "mixed", "encrypted", "encrypted", "environment")
    )
    status = build_status_card(settings, storage)
    return (
        (
            "01-query-provider-logos.png",
            all_card,
            tuple(s.provider_type.value for s in results.snapshots),
        ),
        (
            "02-status-provider-logos.png",
            status,
            (None, *(e.provider_type.value for e in settings.directory.entries)),
        ),
        ("03-meinianda-detail-logo.png", detail, ("meinianda",)),
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--font", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    manifest = []
    for filename, spec, provider_keys in cases():
        spec = replace(spec, caption="演示数据 · " + spec.caption)
        content = render_local_card(spec, args.font)
        if content is None:
            raise RuntimeError(f"render failed: {filename}")
        from io import BytesIO

        from PIL import Image

        with Image.open(BytesIO(content)) as image:
            width, height = image.size
        path = args.output / filename
        path.write_bytes(content)
        manifest.append(
            {
                "file": filename,
                "width": width,
                "height": height,
                "bytes": len(content),
                "sha256": sha256(content).hexdigest(),
            }
        )
    (args.output / "manifest.json").write_text(
        json.dumps(
            {
                "base_commit": "647fa517b5040cb4846bfb4c605f9cb176460f94",
                "icon_size": 40,
                "png_sha256": LOGO_SHA256,
                "outputs": manifest,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n"
    )
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
