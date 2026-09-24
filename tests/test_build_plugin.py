import hashlib
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
    "metadata.yaml",
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
    "quota_link/formatter.py",
    "quota_link/http_client.py",
    "quota_link/intent.py",
    "quota_link/models.py",
    "quota_link/service.py",
    "quota_link/settings.py",
    "quota_link/providers/__init__.py",
    "quota_link/providers/base.py",
    "quota_link/providers/deepseek.py",
    "quota_link/providers/alibaba_bailian.py",
    "quota_link/providers/openai_compatible.py",
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
        expected = EXPECTED_ROOT_FILES | EXPECTED_PACKAGE_FILES
        assert set(names) == expected
        assert package.read("metadata.yaml") == (ROOT / "metadata.yaml").read_bytes()
        assert all(
            info.date_time == (1980, 1, 1, 0, 0, 0) for info in package.infolist()
        )

    second = _run(*args)
    assert second.returncode == 0, second.stderr
    assert hashlib.sha256(archive.read_bytes()).hexdigest() == digest


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
    for name in EXPECTED_ROOT_FILES | EXPECTED_PACKAGE_FILES:
        path = source / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(
            f"version: {VERSION}\n" if name == "metadata.yaml" else "example\n",
            encoding="utf-8",
        )
    return source


def test_build_excludes_extra_local_python_and_secret_files(tmp_path: Path) -> None:
    source = _fixture_source(tmp_path)
    (source / "quota_link" / "config.local.py").write_text(
        "SECRET = 'never package me'\n", encoding="utf-8"
    )
    (source / ".env").write_text("PRIVATE=1\n", encoding="utf-8")

    archive = build_plugin.build(VERSION, tmp_path / "dist", root=source)

    with zipfile.ZipFile(archive) as package:
        assert set(package.namelist()) == EXPECTED_ROOT_FILES | EXPECTED_PACKAGE_FILES
        assert b"never package me" not in b"".join(
            package.read(name) for name in package.namelist()
        )
