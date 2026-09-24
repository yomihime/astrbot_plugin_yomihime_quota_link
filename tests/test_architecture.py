import ast
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _is_core_module(module: str) -> bool:
    return module == "quota_link" or module.startswith("quota_link.")


def _module_name(path: Path, root: Path) -> str:
    if path == root / "main.py":
        return "plugin.main"
    relative = path.relative_to(root).with_suffix("")
    parts = list(relative.parts)
    if parts[-1] == "__init__":
        parts.pop()
    return ".".join(parts)


def _resolve_imports(path: Path, module_name: str, root: Path) -> set[str]:
    """Return imported module names, expanding relative import aliases."""
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    is_package = path.name == "__init__.py"
    package_parts = (
        module_name.split(".") if is_package else module_name.split(".")[:-1]
    )
    imports: set[str] = set()

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            imports.update(alias.name for alias in node.names)
            continue
        if not isinstance(node, ast.ImportFrom):
            continue

        if node.level:
            # A single leading dot means the current package. Each extra dot
            # moves one level toward its parent package.
            anchor = package_parts[: len(package_parts) - node.level + 1]
            base_parts = anchor + (node.module.split(".") if node.module else [])
            base = ".".join(base_parts)
        else:
            base = node.module or ""

        if base and (node.module is not None or not node.level):
            imports.add(base)
        for alias in node.names:
            if alias.name != "*":
                imported_child = ".".join(part for part in (base, alias.name) if part)
                if imported_child:
                    imports.add(imported_child)

    return imports


def _uses_absolute_prefix(path: Path, prefixes: tuple[str, ...]) -> bool:
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            if any(
                alias.name == prefix or alias.name.startswith(f"{prefix}.")
                for alias in node.names
                for prefix in prefixes
            ):
                return True
        elif isinstance(node, ast.ImportFrom) and node.level == 0:
            module = node.module or ""
            if any(
                module == prefix or module.startswith(f"{prefix}.")
                for prefix in prefixes
            ):
                return True
    return False


def _module_sources(root: Path) -> dict[str, Path]:
    core = root / "quota_link"
    source_files = [*core.rglob("*.py"), root / "main.py"]
    return {_module_name(path, root): path for path in source_files if path.is_file()}


def _dependency_graph(root: Path, modules: dict[str, Path]) -> dict[str, set[str]]:
    graph: dict[str, set[str]] = {name: set() for name in modules}
    for name, path in modules.items():
        for imported in _resolve_imports(path, name, root):
            if _is_core_module(name) and imported in modules and imported != name:
                graph[name].add(imported)
    return graph


def _assert_import_direction(root: Path, modules: dict[str, Path]) -> None:
    providers = {
        module
        for module in modules
        if module.startswith("quota_link.providers.")
        and module not in {"quota_link.providers", "quota_link.providers.base"}
    }

    for name, path in modules.items():
        imported_modules = _resolve_imports(path, name, root)
        if _is_core_module(name):
            assert not any(
                imported == "astrbot" or imported.startswith("astrbot.")
                for imported in imported_modules
            ), f"core module {name} imports AstrBot"
            assert not any(
                imported == "main" or imported.startswith("main.")
                for imported in imported_modules
            ), f"core module {name} imports main.py"

        if name in providers:
            forbidden = ("service", "intent", "formatter")
            assert not any(
                imported == f"quota_link.{part}"
                or imported.startswith(f"quota_link.{part}.")
                for imported in imported_modules
                for part in forbidden
            ), f"provider {name} imports a service or presentation module"
            assert not any(
                imported == provider or imported.startswith(f"{provider}.")
                for imported in imported_modules
                for provider in providers
                if provider != name
            ), f"provider {name} imports another provider"


def _assert_no_cycles(graph: dict[str, set[str]]) -> None:
    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(name: str) -> None:
        assert name not in visiting, f"circular project import involving {name}"
        if name in visited:
            return
        visiting.add(name)
        for dependency in graph[name]:
            visit(dependency)
        visiting.remove(name)
        visited.add(name)

    for module in graph:
        visit(module)


def test_core_imports_without_astrbot_available():
    code = """
import importlib.abc
import sys
class BlockAstrBot(importlib.abc.MetaPathFinder):
    def find_spec(self, fullname, path=None, target=None):
        if fullname == 'astrbot' or fullname.startswith('astrbot.'):
            raise AssertionError('core attempted to import AstrBot')
sys.meta_path.insert(0, BlockAstrBot())
import quota_link
import quota_link.models
import quota_link.providers
import quota_link.providers.base
"""
    result = subprocess.run(
        [sys.executable, "-c", code],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0, result.stderr


def test_module_dependencies_follow_core_and_provider_boundaries():
    modules = _module_sources(ROOT)
    _assert_import_direction(ROOT, modules)
    _assert_no_cycles(_dependency_graph(ROOT, modules))


def test_astrbot_boundary_stays_in_main_and_schema_has_safe_templates():
    modules = _module_sources(ROOT)
    main_imports = _resolve_imports(ROOT / "main.py", "plugin.main", ROOT)
    assert "astrbot.api.event" in main_imports
    assert "astrbot.api.star" in main_imports
    assert all(
        not any(
            name == "astrbot" or name.startswith("astrbot.")
            for name in _resolve_imports(path, name, ROOT)
        )
        for name, path in modules.items()
        if name != "plugin.main"
    )
    assert all(
        not _uses_absolute_prefix(path, ("quota_link",)) for path in modules.values()
    ), "plugin modules must use package-relative imports for AstrBot namespace loading"

    schema = json.loads((ROOT / "_conf_schema.json").read_text(encoding="utf-8"))
    providers = schema["providers"]
    assert providers["type"] == "template_list"
    assert providers["default"] == []
    auth = providers["templates"]["provider_account"]["items"]["auth"]
    assert auth["items"]["api_key"]["secret"] is True
    assert auth["items"]["api_key"]["default"] == ""


def _write_module(root: Path, relative_path: str, source: str) -> Path:
    path = root / relative_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(source, encoding="utf-8")
    return path


def test_relative_imports_resolve_against_package_and_expand_aliases(tmp_path):
    package_init = _write_module(
        tmp_path, "quota_link/__init__.py", "from . import models\n"
    )
    providers_init = _write_module(
        tmp_path,
        "quota_link/providers/__init__.py",
        "from . import deepseek\n",
    )
    model_init = _write_module(tmp_path, "quota_link/models.py", "")
    provider_module = _write_module(tmp_path, "quota_link/providers/deepseek.py", "")

    assert _resolve_imports(package_init, "quota_link", tmp_path) == {
        "quota_link.models"
    }
    assert _resolve_imports(providers_init, "quota_link.providers", tmp_path) == {
        "quota_link.providers.deepseek"
    }
    assert _module_name(model_init, tmp_path) == "quota_link.models"
    assert _module_name(provider_module, tmp_path) == "quota_link.providers.deepseek"


def test_relative_import_cycle_is_detected(tmp_path):
    _write_module(tmp_path, "quota_link/__init__.py", "")
    _write_module(tmp_path, "quota_link/alpha.py", "from . import beta\n")
    _write_module(tmp_path, "quota_link/beta.py", "from . import alpha\n")
    modules = _module_sources(tmp_path)

    try:
        _assert_no_cycles(_dependency_graph(tmp_path, modules))
    except AssertionError as error:
        assert "circular project import" in str(error)
    else:
        raise AssertionError("relative import cycle was not detected")


def test_package_root_import_of_astrbot_is_rejected(tmp_path):
    _write_module(tmp_path, "quota_link/__init__.py", "import astrbot\n")
    _write_module(tmp_path, "quota_link/models.py", "")
    modules = _module_sources(tmp_path)

    try:
        _assert_import_direction(tmp_path, modules)
    except AssertionError as error:
        assert "core module quota_link imports AstrBot" in str(error)
    else:
        raise AssertionError("package-root AstrBot import was not rejected")


def test_package_root_and_models_cycle_is_detected(tmp_path):
    _write_module(tmp_path, "quota_link/__init__.py", "from . import models\n")
    _write_module(tmp_path, "quota_link/models.py", "import quota_link\n")
    modules = _module_sources(tmp_path)

    try:
        _assert_no_cycles(_dependency_graph(tmp_path, modules))
    except AssertionError as error:
        assert "circular project import" in str(error)
    else:
        raise AssertionError("package-root/models cycle was not detected")


def test_relative_provider_import_of_another_provider_is_rejected(tmp_path):
    _write_module(tmp_path, "quota_link/__init__.py", "")
    _write_module(tmp_path, "quota_link/providers/__init__.py", "")
    _write_module(tmp_path, "quota_link/providers/alpha.py", "from . import beta\n")
    _write_module(tmp_path, "quota_link/providers/beta.py", "")
    modules = _module_sources(tmp_path)

    try:
        _assert_import_direction(tmp_path, modules)
    except AssertionError as error:
        assert "imports another provider" in str(error)
    else:
        raise AssertionError("relative provider-to-provider import was not rejected")


def test_relative_provider_import_of_service_module_is_rejected(tmp_path):
    _write_module(tmp_path, "quota_link/__init__.py", "")
    _write_module(tmp_path, "quota_link/service.py", "")
    _write_module(tmp_path, "quota_link/providers/__init__.py", "")
    _write_module(tmp_path, "quota_link/providers/alpha.py", "from .. import service\n")
    modules = _module_sources(tmp_path)

    try:
        _assert_import_direction(tmp_path, modules)
    except AssertionError as error:
        assert "service or presentation" in str(error)
    else:
        raise AssertionError("relative provider-to-service import was not rejected")
