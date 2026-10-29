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
    ".astrbot-plugin/i18n/zh-CN.json",
    ".astrbot-plugin/i18n/en-US.json",
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
    "quota_link/alert_config.py",
    "quota_link/alert_units.py",
    "quota_link/alert_commands.py",
    "quota_link/alert_cards.py",
    "quota_link/alerts.py",
    "quota_link/alert_delivery.py",
    "quota_link/provider_retry.py",
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
    "quota_link/providers/meinianda.py",
    "quota_link/providers/alibaba_bailian.py",
    "quota_link/providers/openai_compatible.py",
)
PACKAGE_FILES += (
    "quota_link/config_store.py",
    "quota_link/admin/__init__.py",
    "quota_link/admin/pages.py",
    "quota_link/admin/web_admin.py",
    "quota_link/security/__init__.py",
    "quota_link/security/key_provider.py",
    "quota_link/security/managed_key.py",
    "quota_link/security/managed_key_file.py",
    "quota_link/security/private_files.py",
    "quota_link/security/secret_codec.py",
    "quota_link/security/store.py",
    "quota_link/security/windows/__init__.py",
    "quota_link/security/windows/documents.py",
    "quota_link/security/windows/fs.py",
    "quota_link/security/windows/maintenance.py",
    "quota_link/security/windows/managed_key_io.py",
)
PACKAGE_FILES += (
    "quota_link/cards.py",
    "quota_link/local_status.py",
    "quota_link/presentation/provider_logos.py",
    "quota_link/presentation/__init__.py",
    "quota_link/presentation/bitmap.py",
    "quota_link/presentation/font.py",
    "quota_link/presentation/NOTICE.md",
    "quota_link/managed_font.py",
    "quota_link/presentation/assets/fonts/OFL.txt",
)
PACKAGE_FILES += (
    "quota_link/presentation/assets/provider_logos/README.md",
    "quota_link/presentation/assets/provider_logos/licenses/DeepSeek-LICENSE-CODE.txt",
    "quota_link/presentation/assets/provider_logos/licenses/Lobe-Icons-LICENSE.txt",
    "quota_link/presentation/assets/provider_logos/manifest.json",
    "quota_link/presentation/assets/provider_logos/png-128/alibaba_bailian.png",
    "quota_link/presentation/assets/provider_logos/png-128/deepseek.png",
    "quota_link/presentation/assets/provider_logos/png-128/grsai-dark.png",
    "quota_link/presentation/assets/provider_logos/png-128/grsai.png",
    "quota_link/presentation/assets/provider_logos/png-128/meinianda.png",
    "quota_link/presentation/assets/provider_logos/png-128/openai_compatible.png",
    "quota_link/presentation/assets/provider_logos/svg/alibaba_bailian.svg",
    "quota_link/presentation/assets/provider_logos/svg/deepseek.svg",
    "quota_link/presentation/assets/provider_logos/svg/grsai-dark.svg",
    "quota_link/presentation/assets/provider_logos/svg/grsai.svg",
    "quota_link/presentation/assets/provider_logos/svg/meinianda.svg",
    "quota_link/presentation/assets/provider_logos/svg/openai_compatible.svg",
)
PAGE_FILES = (
    "pages/00-quota-link/THIRD_PARTY_NOTICES.txt",
    "pages/00-quota-link/app.js",
    "pages/00-quota-link/assets.json",
    "pages/00-quota-link/index.html",
    "pages/00-quota-link/licenses/@css-render_plugin-bem.txt",
    "pages/00-quota-link/licenses/@css-render_vue3-ssr.txt",
    "pages/00-quota-link/licenses/@emotion_hash.txt",
    "pages/00-quota-link/licenses/@juggle_resize-observer.txt",
    "pages/00-quota-link/licenses/@vue_reactivity.txt",
    "pages/00-quota-link/licenses/@vue_runtime-core.txt",
    "pages/00-quota-link/licenses/@vue_runtime-dom.txt",
    "pages/00-quota-link/licenses/@vue_shared.txt",
    "pages/00-quota-link/licenses/css-render.txt",
    "pages/00-quota-link/licenses/date-fns.txt",
    "pages/00-quota-link/licenses/evtd.txt",
    "pages/00-quota-link/licenses/lodash-es.txt",
    "pages/00-quota-link/licenses/naive-ui.txt",
    "pages/00-quota-link/licenses/seemly.txt",
    "pages/00-quota-link/licenses/vooks.txt",
    "pages/00-quota-link/licenses/vue.txt",
    "pages/00-quota-link/licenses/vueuc.txt",
    "pages/00-quota-link/styles.css",
)
DOC_FILES = (
    "docs/SECURITY.md",
    "pages/frontend/PROVENANCE.md",
    "pages/frontend/provenance.json",
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
    sources = [
        root / name for name in (*ROOT_FILES, *PACKAGE_FILES, *PAGE_FILES, *DOC_FILES)
    ]
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
