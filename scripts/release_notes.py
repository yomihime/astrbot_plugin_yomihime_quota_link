"""Extract the matching version section from CHANGELOG.md for GitHub Release."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TAG_PATTERN = re.compile(r"v[0-9]+\.[0-9]+\.[0-9]+(?:[-+][0-9A-Za-z.-]+)?\Z")


def extract_release_notes(changelog: str, tag: str) -> str:
    if not TAG_PATTERN.fullmatch(tag):
        raise ValueError("tag must be a v-prefixed version")

    lines = changelog.splitlines()
    heading = re.compile(rf"^##[ \t]+{re.escape(tag)}(?=$|[ \t（(—])")
    start = next((i for i, line in enumerate(lines) if heading.match(line)), None)
    if start is None:
        raise ValueError(f"CHANGELOG.md has no version section for {tag}")

    end = next(
        (i for i in range(start + 1, len(lines)) if re.match(r"^##[ \t]+", lines[i])),
        len(lines),
    )
    section = "\n".join(lines[start:end]).strip()
    if not any(line.strip() for line in lines[start + 1 : end]):
        raise ValueError(f"CHANGELOG.md version section for {tag} is empty")
    return section + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tag", required=True)
    parser.add_argument("--changelog", type=Path, default=ROOT / "CHANGELOG.md")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        content = args.changelog.read_text(encoding="utf-8")
        notes = extract_release_notes(content, args.tag)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(notes, encoding="utf-8")
    except (OSError, ValueError) as error:
        print(f"release notes failed: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
