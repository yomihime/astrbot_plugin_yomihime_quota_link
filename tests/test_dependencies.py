"""Runtime declarations stay minimal; test/build locks have a separate scope."""

from pathlib import Path

import pytest
from packaging.requirements import Requirement
from packaging.specifiers import SpecifierSet
from packaging.utils import canonicalize_name

from scripts.build_plugin import build

ROOT = Path(__file__).resolve().parents[1]
# Add an exception only with a reproduced incompatibility and an upstream issue.
# Key: (normalized dependency name, specifier); value: evidence/rationale.
BOUND_EXCEPTIONS: dict[tuple[str, str], str] = {}


def requirements(path):
    return {
        canonicalize_name(requirement.name): requirement
        for raw in path.read_text(encoding="utf-8").splitlines()
        if (line := raw.partition("#")[0].strip())
        for requirement in (Requirement(line),)
    }


def metadata_value(key):
    return next(
        line.split(":", 1)[1].strip().strip("\"'")
        for line in (ROOT / "metadata.yaml").read_text(encoding="utf-8").splitlines()
        if line.startswith(key + ":")
    )


def test_runtime_bounds_need_evidence():
    declarations = {
        name: requirement.specifier
        for name, requirement in requirements(ROOT / "requirements.txt").items()
    }
    declarations["astrbot"] = SpecifierSet(metadata_value("astrbot_version"))
    used_exceptions = set()
    for name, specifiers in declarations.items():
        assert any(spec.operator == ">=" for spec in specifiers), name
        for spec in specifiers:
            if spec.operator == ">=":
                continue
            key = (name, str(spec))
            assert BOUND_EXCEPTIONS.get(key, "").strip(), (
                f"{name}{spec} needs reproduced incompatibility evidence"
            )
            used_exceptions.add(key)
    assert used_exceptions == BOUND_EXCEPTIONS.keys()


@pytest.mark.parametrize(
    ("name", "minimum"),
    (("httpx", "0.28"), ("cryptography", "46.0.3"), ("pillow", "10")),
)
def test_existing_runtime_minimum_is_preserved(name, minimum):
    assert minimum in requirements(ROOT / "requirements.txt")[name].specifier


def test_host_protected_pillow_is_accepted_by_source_and_archive(tmp_path):
    import zipfile

    host = requirements(ROOT / "tests/fixtures/host-pillow13.txt")["pillow"]
    (protected,) = host.specifier
    assert protected.operator == "=="
    assert (
        protected.version in requirements(ROOT / "requirements.txt")["pillow"].specifier
    )
    with zipfile.ZipFile(build(metadata_value("version"), tmp_path)) as archive:
        archived = archive.read("requirements.txt").decode("utf-8")
    assert archived == (ROOT / "requirements.txt").read_text(encoding="utf-8")


def test_required_font_gate_cannot_silently_skip(monkeypatch):
    # Import by the pytest module name; tests/ is not a production package.
    from test_cards import BitmapTests

    monkeypatch.delenv("QUOTA_TEST_FONT", raising=False)
    monkeypatch.setenv("QUOTA_REQUIRE_TEST_FONT", "1")
    with pytest.raises(RuntimeError, match="QUOTA_TEST_FONT is required"):
        BitmapTests.setUpClass()
