import hashlib
import json
import subprocess
import sys
import zipfile
from pathlib import Path

import pytest

from scripts import build_plugin

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "build_plugin.py"
VERSION = next(
    line.split(":", 1)[1].strip()
    for line in (ROOT / "metadata.yaml").read_text(encoding="utf-8").splitlines()
    if line.startswith("version:")
)
EXPECTED_ROOT_FILES = {
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
}
EXPECTED_PACKAGE_FILES = {
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
}

EXPECTED_PACKAGE_FILES |= {
    "quota_link/security/windows/managed_key_io.py",
    "quota_link/security/windows/__init__.py",
    "quota_link/security/secret_codec.py",
    "quota_link/admin/pages.py",
    "quota_link/security/windows/maintenance.py",
    "quota_link/security/managed_key_file.py",
    "quota_link/config_store.py",
    "quota_link/security/windows/documents.py",
    "quota_link/security/key_provider.py",
    "quota_link/security/windows/fs.py",
    "quota_link/security/managed_key.py",
    "quota_link/security/private_files.py",
    "quota_link/security/store.py",
    "quota_link/security/__init__.py",
    "quota_link/admin/web_admin.py",
    "quota_link/admin/__init__.py",
}
EXPECTED_PACKAGE_FILES |= {
    "quota_link/presentation/bitmap.py",
    "quota_link/presentation/font.py",
    "quota_link/presentation/__init__.py",
    "quota_link/presentation/NOTICE.md",
    "quota_link/cards.py",
    "quota_link/presentation/assets/fonts/OFL.txt",
    "quota_link/managed_font.py",
}
EXPECTED_PAGE_FILES = {
    "pages/00-quota-link/licenses/vueuc.txt",
    "pages/00-quota-link/licenses/vue.txt",
    "pages/00-quota-link/app.js",
    "pages/00-quota-link/licenses/@vue_runtime-dom.txt",
    "pages/00-quota-link/licenses/@vue_reactivity.txt",
    "pages/00-quota-link/licenses/@css-render_plugin-bem.txt",
    "pages/00-quota-link/licenses/@css-render_vue3-ssr.txt",
    "pages/00-quota-link/THIRD_PARTY_NOTICES.txt",
    "pages/00-quota-link/licenses/@emotion_hash.txt",
    "pages/00-quota-link/licenses/evtd.txt",
    "pages/00-quota-link/licenses/date-fns.txt",
    "pages/00-quota-link/licenses/seemly.txt",
    "pages/00-quota-link/licenses/@vue_shared.txt",
    "pages/00-quota-link/licenses/css-render.txt",
    "pages/00-quota-link/assets.json",
    "pages/00-quota-link/licenses/lodash-es.txt",
    "pages/00-quota-link/index.html",
    "pages/00-quota-link/licenses/vooks.txt",
    "pages/00-quota-link/licenses/@vue_runtime-core.txt",
    "pages/00-quota-link/licenses/@juggle_resize-observer.txt",
    "pages/00-quota-link/styles.css",
    "pages/00-quota-link/licenses/naive-ui.txt",
}
EXPECTED_DOC_FILES = {
    "docs/SECURITY.md",
    "pages/frontend/PROVENANCE.md",
    "pages/frontend/provenance.json",
}


def _run(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(SCRIPT), *args],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )


def test_build_contains_only_plugin_sources_and_is_reproducible(tmp_path: Path) -> None:
    output = tmp_path / "dist"
    args = ("--tag", VERSION, "--output-dir", str(output))
    first = _run(*args)
    assert first.returncode == 0, first.stderr

    archive = output / f"astrbot_plugin_yomihime_quota_link-{VERSION}.zip"
    assert archive.is_file()
    digest = hashlib.sha256(archive.read_bytes()).hexdigest()
    with zipfile.ZipFile(archive) as package:
        names = package.namelist()
        assert len(names) == len(set(names))
        expected = (
            EXPECTED_ROOT_FILES
            | EXPECTED_PACKAGE_FILES
            | EXPECTED_PAGE_FILES
            | EXPECTED_DOC_FILES
        )
        assert set(names) == expected
        assert package.read("metadata.yaml") == (ROOT / "metadata.yaml").read_bytes()
        assert package.read("logo.png") == (ROOT / "logo.png").read_bytes()
        assert all(
            info.date_time == (1980, 1, 1, 0, 0, 0) for info in package.infolist()
        )

    second = _run(*args)
    assert second.returncode == 0, second.stderr
    assert hashlib.sha256(archive.read_bytes()).hexdigest() == digest


def test_new_modules_import_from_archive_without_source_tree(tmp_path: Path) -> None:
    archive = build_plugin.build(VERSION, tmp_path / "dist")
    script = """
import importlib
import json
import sys

archive = sys.argv[1]
sys.path.insert(0, archive)
capabilities = importlib.import_module("quota_link.capabilities")
tool_facts = importlib.import_module("quota_link.tool_facts")
security = importlib.import_module("quota_link.security")
admin = importlib.import_module("quota_link.admin")
assert callable(security.SecretStore)
assert callable(admin.AdminPages)
assert capabilities.__file__.startswith(archive)
assert tool_facts.__file__.startswith(archive)
assert callable(capabilities.describe_capabilities)
assert json.loads(tool_facts.encode_tool_result({"ok": True})) == {"ok": True}
"""
    result = subprocess.run(
        [sys.executable, "-I", "-c", script, str(archive)],
        cwd=tmp_path,
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0, result.stderr


def test_build_rejects_invalid_or_mismatched_tag(tmp_path: Path) -> None:
    for tag in ("0.1.0", "v999.999.999", "v0.1.0/../../secret"):
        result = _run("--tag", tag, "--output-dir", str(tmp_path))
        assert result.returncode == 1
        assert "build failed" in result.stderr
    assert not list(tmp_path.glob("*.zip"))


def test_build_rejects_oversize_package_without_leaving_archive(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    source = _fixture_source(tmp_path)
    monkeypatch.setattr(build_plugin, "MAX_ARCHIVE_BYTES", 1)
    destination = tmp_path / "dist"

    with pytest.raises(ValueError, match="16 MB"):
        build_plugin.build(VERSION, destination, root=source)

    assert not list(destination.iterdir())


def _fixture_source(tmp_path: Path) -> Path:
    source = tmp_path / "source"
    source.mkdir()
    for name in (
        EXPECTED_ROOT_FILES
        | EXPECTED_PACKAGE_FILES
        | EXPECTED_PAGE_FILES
        | EXPECTED_DOC_FILES
    ):
        path = source / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(
            f"version: {VERSION}\n" if name == "metadata.yaml" else "example\n",
            encoding="utf-8",
        )
    return source


def test_build_rejects_missing_logo(tmp_path: Path) -> None:
    source = _fixture_source(tmp_path)
    (source / "logo.png").unlink()
    destination = tmp_path / "dist"

    with pytest.raises(ValueError, match="required source is missing"):
        build_plugin.build(VERSION, destination, root=source)

    assert not destination.exists()


def test_build_excludes_extra_local_python_and_secret_files(tmp_path: Path) -> None:
    source = _fixture_source(tmp_path)
    (source / "quota_link" / "config.local.py").write_text(
        "SECRET = 'never package me'\n", encoding="utf-8"
    )
    (source / ".env").write_text("PRIVATE=1\n", encoding="utf-8")

    archive = build_plugin.build(VERSION, tmp_path / "dist", root=source)

    with zipfile.ZipFile(archive) as package:
        assert (
            set(package.namelist())
            == EXPECTED_ROOT_FILES
            | EXPECTED_PACKAGE_FILES
            | EXPECTED_PAGE_FILES
            | EXPECTED_DOC_FILES
        )
        assert b"never package me" not in b"".join(
            package.read(name) for name in package.namelist()
        )


def test_production_page_manifest_matches_packaged_bytes():
    page_root = ROOT / "pages" / "00-quota-link"
    manifest = json.loads((page_root / "assets.json").read_text())
    assert manifest["schema_version"] == 1
    paths = set()
    for item in manifest["assets"]:
        name = item["path"]
        assert name not in paths
        paths.add(name)
        assert not Path(name).is_absolute() and ".." not in Path(name).parts
        source = page_root / name
        assert source.is_file() and not source.is_symlink()
        assert hashlib.sha256(source.read_bytes()).hexdigest() == item["sha256"]
        assert "pages/00-quota-link/" + name in EXPECTED_PAGE_FILES
    assert {"index.html", "app.js", "styles.css", "THIRD_PARTY_NOTICES.txt"} <= paths


@pytest.mark.parametrize(
    "locale,title", [("zh-CN", "额度查询"), ("en-US", "Quota Query")]
)
def test_packaged_sidebar_locales_match_host_page_contract(tmp_path, locale, title):
    archive = build_plugin.build(VERSION, tmp_path)
    name = f".astrbot-plugin/i18n/{locale}.json"
    with zipfile.ZipFile(archive) as package:
        content = package.read(name)
    assert content == (ROOT / name).read_bytes()
    translations = json.loads(content)
    for namespace in ("views", "pages"):
        assert translations[namespace] == {"00-quota-link": {"title": title}}
    assert (ROOT / "pages/00-quota-link/index.html").is_file()


@pytest.mark.parametrize("locale", ["zh-CN", "en-US"])
def test_build_requires_sidebar_locale_files(tmp_path, locale):
    source = _fixture_source(tmp_path)
    (source / f".astrbot-plugin/i18n/{locale}.json").unlink()
    with pytest.raises(ValueError, match="required source is missing"):
        build_plugin.build(VERSION, tmp_path / "dist", root=source)
