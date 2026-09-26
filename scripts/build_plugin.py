"""Build a reproducible AstrBot plugin archive from an explicit source allowlist."""

from __future__ import annotations

import argparse
import os
import re
import sys
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ROOT_FILES = (
    "metadata.yaml",
    "logo.png",
    "main.py",
    "__init__.py",
    "_conf_schema.json",
    "requirements.txt",
    "README.md",
    "CHANGELOG.md",
    "LICENSE",
)
PACKAGE_FILES = (
    "quota_link/__init__.py",
    "quota_link/cache.py",
    "quota_link/capabilities.py",
    "quota_link/formatter.py",
    "quota_link/http_client.py",
    "quota_link/intent.py",
    "quota_link/models.py",
    "quota_link/service.py",
    "quota_link/settings.py",
    "quota_link/tool_facts.py",
    "quota_link/providers/__init__.py",
    "quota_link/providers/base.py",
    "quota_link/providers/deepseek.py",
    "quota_link/providers/alibaba_bailian.py",
    "quota_link/providers/openai_compatible.py",
)
TAG_PATTERN = re.compile(r"v[0-9]+\.[0-9]+\.[0-9]+(?:[-+][0-9A-Za-z.-]+)?\Z")
ZIP_TIMESTAMP = (1980, 1, 1, 0, 0, 0)
MAX_ARCHIVE_BYTES = 16 * 1024 * 1024


def _metadata_version(path: Path) -> str:
    versions = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if re.match(r"^version\s*:", line):
            value = line.split(":", 1)[1].split("#", 1)[0].strip()
            versions.append(value.strip("\"'"))
    if len(versions) != 1 or not versions[0]:
        raise ValueError("metadata.yaml must contain exactly one version")
    return versions[0]


def _sources(root: Path) -> list[Path]:
    sources = [root / name for name in (*ROOT_FILES, *PACKAGE_FILES)]
    for source in sources:
        if not source.is_file() or source.is_symlink():
            raise ValueError(f"required source is missing or is a symlink: {source}")
    return sources


def build(tag: str, output_dir: Path, root: Path = ROOT) -> Path:
    if not TAG_PATTERN.fullmatch(tag):
        raise ValueError("tag must be a v-prefixed version, such as v0.1.0")
    metadata_version = _metadata_version(root / "metadata.yaml")
    if tag != metadata_version:
        raise ValueError(
            f"tag {tag} does not match metadata.yaml version {metadata_version}"
        )

    sources = _sources(root)
    output_dir.mkdir(parents=True, exist_ok=True)
    destination = output_dir / f"astrbot_plugin_yomihime_quota_link-{tag}.zip"
    temporary: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            prefix=".plugin-build-", suffix=".zip", dir=output_dir, delete=False
        ) as handle:
            temporary = Path(handle.name)
        with zipfile.ZipFile(
            temporary, "w", compression=zipfile.ZIP_DEFLATED
        ) as archive:
            for source in sources:
                name = source.relative_to(root).as_posix()
                info = zipfile.ZipInfo(name, ZIP_TIMESTAMP)
                info.compress_type = zipfile.ZIP_DEFLATED
                info.create_system = 3
                info.external_attr = 0o100644 << 16
                archive.writestr(info, source.read_bytes())
        if temporary.stat().st_size > MAX_ARCHIVE_BYTES:
            raise ValueError("archive exceeds AstrBot's 16 MB plugin package limit")
        os.replace(temporary, destination)
        return destination
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tag", required=True, help="v-prefixed version tag")
    parser.add_argument("--output-dir", type=Path, default=Path("dist"))
    args = parser.parse_args()
    try:
        archive = build(args.tag, args.output_dir)
    except (OSError, ValueError) as error:
        print(f"build failed: {error}", file=sys.stderr)
        return 1
    print(archive)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
