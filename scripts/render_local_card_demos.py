"""Render four synthetic help/status reviews with the production card builders.

Usage: python scripts/render_local_card_demos.py --font /path/to/pinned.otf --output /tmp/demo
The marker is added here, never by the production builders. No provider IO.
"""

import argparse
import json
import sys
from dataclasses import replace
from datetime import UTC, datetime
from decimal import Decimal
from hashlib import sha256
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from quota_link.cards import (  # noqa: E402
    build_help_card,
    build_result_card,
    build_status_card,
    render_local_card,
)
from quota_link.config_store import SECRET_FIELDS  # noqa: E402
from quota_link.local_status import project_storage_status  # noqa: E402
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
from quota_link.settings import load_settings  # noqa: E402


def result_cases():
    when = datetime(2026, 10, 28, 1, 20, tzinfo=UTC)
    base = BalanceSnapshot(
        account_id="synthetic-balance",
        provider_type=ProviderType.DEEPSEEK,
        display_name="DeepSeek · 日常工作",
        status=SnapshotStatus.AVAILABLE,
        balances=(BalanceItem(BalanceItemKind.CASH, Decimal("12.34"), "CNY"),),
        source="本地合成数据",
        fetched_at=when,
    )
    failure = NormalizedProviderError(
        ProviderErrorCategory.TEMPORARILY_UNAVAILABLE, "服务暂时不可用，请稍后重试。"
    )
    variants = (
        ("05-balance.png", base),
        (
            "06-balance-partial.png",
            replace(base, status=SnapshotStatus.PARTIAL, error=failure),
        ),
        (
            "07-balance-failed.png",
            replace(
                base, status=SnapshotStatus.UNAVAILABLE, balances=(), error=failure
            ),
        ),
    )
    return tuple(
        (
            filename,
            build_result_card(
                QueryResult(QueryRequest(QueryRequestKind.ALL), (item,), when)
            ),
        )
        for filename, item in variants
    )


def demo_cases():
    normal = load_settings(
        {
            "providers": [
                {
                    "id": "synthetic-deepseek",
                    "type": "deepseek",
                    "display_name": "DeepSeek · 日常工作",
                    "auth": {"api_key": "synthetic-key-for-demo-only"},
                },
                {
                    "id": "synthetic-bailian",
                    "type": "alibaba_bailian",
                    "display_name": "阿里云百炼 · 开发团队",
                    "auth": {
                        "access_key_id": "synthetic-id",
                        "access_key_secret": "${DEMO_SECRET}",
                    },
                },
                {
                    "id": "synthetic-grsai",
                    "type": "grsai",
                    "display_name": "Grsai Creative Studio · 备用",
                    "enabled": False,
                    "auth": {"token": "synthetic-grsai-token"},
                },
            ]
        },
        environ={"DEMO_SECRET": "synthetic-environment-key"},
    )
    normal_dto = {
        "encryption": {"ready": True},
        "migration": {"pending": False},
        "credentials": {
            "synthetic-deepseek": {
                "api_key": {"configured": True, "source": "encrypted"}
            },
            "synthetic-bailian": {
                "access_key_id": {"configured": True, "source": "encrypted"},
                "access_key_secret": {"configured": True, "source": "environment"},
            },
            "synthetic-grsai": {"token": {"configured": True, "source": "encrypted"}},
        },
    }
    problems = load_settings(
        {
            "allow_group_queries": True,
            "providers": [
                {
                    "id": "synthetic-research",
                    "type": "openai_compatible",
                    "display_name": "联合研究项目 · Research Sandbox / Europe and Asia Collaboration",
                    "auth": {"api_key": "synthetic-demo-api-key"},
                    "endpoint": {"base_url": "https://example.invalid"},
                },
                {
                    "id": "synthetic-environment",
                    "type": "deepseek",
                    "display_name": "DeepSeek · 环境变量凭据",
                    "auth": {"api_key": "${MISSING_DEMO_KEY}"},
                },
            ],
        },
        environ={},
    )
    problem_dto = {
        "encryption": {"ready": True},
        "migration": {"pending": False},
        "credentials": {
            "synthetic-research": {
                "api_key": {"configured": True, "source": "encrypted"}
            },
            "synthetic-environment": {
                "api_key": {"configured": True, "source": "environment"}
            },
        },
    }
    for dto in (normal_dto, problem_dto):
        for fields in dto["credentials"].values():
            for field in SECRET_FIELDS:
                fields.setdefault(field, {"configured": False, "source": "missing"})
    empty = load_settings({}, environ={})
    empty_dto = {
        "encryption": {"ready": True},
        "migration": {"pending": False},
        "credentials": {},
    }
    return (
        ("01-help.png", build_help_card(normal)),
        (
            "02-status-configured.png",
            build_status_card(
                normal, project_storage_status(normal.directory, normal_dto)
            ),
        ),
        (
            "03-status-attention.png",
            build_status_card(
                problems, project_storage_status(problems.directory, problem_dto)
            ),
        ),
        (
            "04-status-empty.png",
            build_status_card(
                empty, project_storage_status(empty.directory, empty_dto)
            ),
        ),
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--font", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    manifest = []
    for filename, spec in (*demo_cases(), *result_cases()):
        caption = "演示数据 · " + (spec.caption or "本地合成账户")
        image = render_local_card(replace(spec, caption=caption), args.font)
        if image is None:
            raise SystemExit(f"Render failed: {filename}")
        target = args.output / filename
        target.write_bytes(image)
        manifest.append(
            {"file": filename, "bytes": len(image), "sha256": sha256(image).hexdigest()}
        )
    (args.output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
