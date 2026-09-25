import subprocess
import sys
from pathlib import Path

import pytest

from scripts.release_notes import extract_release_notes

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "release_notes.py"


def test_extracts_only_requested_version_with_chinese_text() -> None:
    changelog = """# 更新记录

## 未发布

- 下一次更新

## v0.1.0 — 2026-09-26

### 新增

- 支持 Grsai 账户积分。

## v0.0.1

- 早期版本。
"""
    assert extract_release_notes(changelog, "v0.1.0") == (
        "## v0.1.0 — 2026-09-26\n\n### 新增\n\n- 支持 Grsai 账户积分。\n"
    )


@pytest.mark.parametrize("tag", ["v0.1", "v0.1.0/../../oops", "v0.1.1"])
def test_rejects_invalid_or_missing_version(tag: str) -> None:
    with pytest.raises(ValueError):
        extract_release_notes("## v0.1.0\n\n- 已发布。\n", tag)


def test_rejects_empty_version_section() -> None:
    with pytest.raises(ValueError, match="empty"):
        extract_release_notes("## v0.1.0\n\n## v0.0.1\n- old\n", "v0.1.0")


def test_does_not_match_prerelease_heading_for_stable_tag() -> None:
    with pytest.raises(ValueError, match="no version section"):
        extract_release_notes("## v0.1.0-rc1\n- 候选版本\n", "v0.1.0")


def test_cli_writes_only_matching_notes(tmp_path: Path) -> None:
    changelog = tmp_path / "CHANGELOG.md"
    output = tmp_path / "release-notes.md"
    changelog.write_text(
        "## 未发布\n- later\n\n## v0.1.0\n- 现在发布。\n", encoding="utf-8"
    )
    result = subprocess.run(
        [
            sys.executable,
            str(SCRIPT),
            "--tag",
            "v0.1.0",
            "--changelog",
            str(changelog),
            "--output",
            str(output),
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0, result.stderr
    assert output.read_text(encoding="utf-8") == "## v0.1.0\n- 现在发布。\n"
