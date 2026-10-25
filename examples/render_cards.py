"""Render deterministic synthetic card previews; no credentials or network IO."""

from dataclasses import replace
from datetime import UTC, datetime
from decimal import Decimal
from pathlib import Path

from quota_link.cards import render_result_card
from quota_link.models import (
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

NOW = datetime(2026, 10, 25, 12, 30, tzinfo=UTC)


def samples():
    def item(label, amount, unit="CNY", *, semantics=None):
        return BalanceItem(
            BalanceItemKind.CASH if unit == "CNY" else BalanceItemKind.CREDITS,
            Decimal(amount),
            unit,
            label=label,
            raw_semantics=semantics,
        )

    def snap(provider, name, balances, *, cached=False):
        return BalanceSnapshot(
            "synthetic-" + provider.value,
            provider,
            name,
            SnapshotStatus.AVAILABLE,
            balances,
            name + " API",
            NOW,
            cached=cached,
        )

    snapshots = (
        snap(
            ProviderType.DEEPSEEK,
            "DeepSeek · 示例账户",
            (
                item("总可用余额", "128.50"),
                item("未过期赠金余额", "8.50"),
                item("充值余额", "120.00"),
            ),
            cached=True,
        ),
        snap(
            ProviderType.ALIBABA_BAILIAN,
            "阿里云百炼 · 示例账户",
            (
                item(
                    "账户现金余额",
                    "56.25",
                    semantics="阿里云账户资金",
                ),
            ),
        ),
        snap(
            ProviderType.GRSAI, "Grsai · 示例账户", (item("积分", "45600", "credit"),)
        ),
        snap(
            ProviderType.MEINIANDA,
            "Meinianda · 示例账户",
            (
                item(
                    "账户站内额度",
                    "12.34567",
                    "site_credit",
                    semantics="账户站内额度，不是 API Key 限额；不换算为货币",
                ),
            ),
        ),
        snap(
            ProviderType.OPENAI_COMPATIBLE,
            "兼容服务 · 示例账户",
            (
                BalanceItem(
                    BalanceItemKind.QUOTA,
                    unit="token",
                    total=Decimal("1000000"),
                    remaining=Decimal("750000"),
                    used=Decimal("250000"),
                    label="套餐用量",
                    expires_at=datetime(2026, 11, 1, tzinfo=UTC),
                    raw_semantics="仅按服务商配置的余额字段展示",
                ),
            ),
        ),
    )
    result = QueryResult(QueryRequest(QueryRequestKind.ALL), snapshots, NOW)
    error = NormalizedProviderError(
        ProviderErrorCategory.AUTHENTICATION, "凭据无效或已过期，请由管理员检查配置。"
    )
    return {
        "all-providers": result,
        "account-detail": replace(
            result,
            request=QueryRequest(QueryRequestKind.ACCOUNT, "示例兼容账户"),
            snapshots=(snapshots[-1],),
        ),
        "partial-errors": replace(
            result,
            snapshots=(
                snapshots[0],
                replace(snapshots[1], status=SnapshotStatus.PARTIAL, error=error),
                replace(
                    snapshots[2],
                    status=SnapshotStatus.UNAVAILABLE,
                    balances=(),
                    error=error,
                ),
            ),
        ),
        "empty": replace(result, snapshots=()),
        "long-names": replace(
            result,
            snapshots=(
                replace(
                    snapshots[3],
                    display_name="这是专门验证长账户名称自动换行而不裁切内容的合成示例账户-ABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789",
                ),
            ),
        ),
    }


def main():
    import argparse

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=Path("card-previews"))
    parser.add_argument(
        "--font-path",
        type=Path,
        required=True,
        help="Explicit path to the pinned font (managed cache or test fixture)",
    )
    args = parser.parse_args()
    output = args.output_dir
    output.mkdir(parents=True, exist_ok=True)
    for name, result in samples().items():
        content = render_result_card(result, args.font_path)
        if content is None:
            raise RuntimeError(f"card render failed: {name}")
        path = output / f"{name}.png"
        path.write_bytes(content)
        print(path)


if __name__ == "__main__":
    main()
