"""Install an actual release ZIP in isolated official AstrBot and probe it."""

# Host imports must remain below the isolated-root and network-guard setup.
# ruff: noqa: E402

import argparse
import asyncio
import hashlib
import json
import os
import shutil
import socket
import sys
import traceback
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument(
    "--host-source",
    default=os.environ.get("QUOTA_TEST_ASTRBOT_SOURCE"),
    type=Path,
    help="Official AstrBot checkout root (v4.29.1)",
)
parser.add_argument(
    "--plugin-zip", default=os.environ.get("QUOTA_TEST_PLUGIN_ZIP"), type=Path
)
parser.add_argument(
    "--work-root",
    default=os.environ.get("QUOTA_TEST_WORK_ROOT"),
    type=Path,
    help="New nonexistent disposable directory; never use a real AstrBot root",
)
parser.add_argument(
    "--font",
    type=Path,
    default=os.environ.get("QUOTA_TEST_FONT"),
)
args = parser.parse_args()
if not all((args.host_source, args.plugin_zip, args.work_root, args.font)):
    parser.error(
        "Set QUOTA_TEST_ASTRBOT_SOURCE, QUOTA_TEST_PLUGIN_ZIP, QUOTA_TEST_WORK_ROOT, and QUOTA_TEST_FONT (or their CLI equivalents)"
    )
if sys.flags.optimize:
    parser.error("Run without -O: smoke assertions must remain enabled")
host_source = args.host_source.resolve(strict=True)
plugin_zip = args.plugin_zip.resolve(strict=True)
font = args.font.resolve(strict=True)
root = args.work_root.absolute()
if root.exists() or root.is_symlink():
    parser.error(
        "--work-root must not already exist; choose a new disposable directory"
    )
if not (host_source / "astrbot/dashboard/server.py").is_file():
    parser.error("--host-source must be the official checkout root")
if not plugin_zip.is_file() or not font.is_file():
    parser.error("ZIP and font must be readable regular files")
if (
    hashlib.sha256(font.read_bytes()).hexdigest()
    != "2c76254f6fc379fddfce0a7e84fb5385bb135d3e399294f6eeb6680d0365b74b"
):
    parser.error("Font does not match the canonical offline fixture")
import subprocess

host_commit = subprocess.check_output(
    ["git", "-C", str(host_source), "rev-parse", "HEAD"], text=True
).strip()
if host_commit != "dffe922773725e9c178392c423676ad65044748c":
    parser.error(
        "Expected official v4.29.1 commit dffe922773725e9c178392c423676ad65044748c"
    )
if subprocess.check_output(
    ["git", "-C", str(host_source), "status", "--porcelain", "--untracked-files=no"],
    text=True,
).strip():
    parser.error("Official Host tracked files must be clean")
# Fail before Host startup if installation might invoke online dependency recovery.
import importlib.metadata
import zipfile

from packaging.requirements import Requirement

with zipfile.ZipFile(plugin_zip) as archive:
    requirements_text = archive.read("requirements.txt").decode("utf-8")
for line in requirements_text.splitlines():
    line = line.strip()
    if not line or line.startswith("#"):
        continue
    requirement = Requirement(line)
    if requirement.url:
        parser.error("Direct URL dependencies are not allowed in this offline smoke")
    if requirement.marker and not requirement.marker.evaluate():
        continue
    try:
        installed_version = importlib.metadata.version(requirement.name)
    except importlib.metadata.PackageNotFoundError:
        parser.error(
            f"Preinstall missing dependency before offline smoke: {requirement}"
        )
    if installed_version not in requirement.specifier:
        parser.error(f"Preinstall required version before offline smoke: {requirement}")
root.mkdir(parents=True, exist_ok=False)
root = root.resolve()
sys.path[:0] = [str(root), str(host_source)]
os.chdir(root)
os.environ["ASTRBOT_ROOT"] = str(root)
os.environ["ASTRBOT_TEST_MODE"] = "true"
os.environ["ASTRBOT_DASHBOARD_INITIAL_PASSWORD"] = "IsolatedSmokePassword123!"
os.environ.pop("ASTRBOT_RESET_DASHBOARD_PASSWORD", None)
os.environ.pop("YGL_SECRET_KEY", None)
# Fully offline fixture: deny external DNS and sockets before Host imports.
os.environ["ASTRBOT_DISABLE_METRICS"] = "1"
attempts = []
offline_jobs = []


def deny_network(*args, **kwargs):
    attempts.append("network_operation_denied")
    raise OSError("Network prohibited in fully offline integration fixture")


original_getaddrinfo = socket.getaddrinfo


def local_dns(host, *a, **kw):
    if host in ("127.0.0.1", "localhost", b"127.0.0.1", b"localhost", "::1"):
        return original_getaddrinfo(host, *a, **kw)
    return deny_network()


socket.getaddrinfo = local_dns
original_connect = socket.socket.connect


def local_connect(sock, address):
    if isinstance(address, tuple) and address[0] in ("127.0.0.1", "::1"):
        return original_connect(sock, address)
    return deny_network()


socket.socket.connect = local_connect
socket.socket.connect_ex = deny_network
socket.socket.sendto = deny_network


# No subprocess may bypass Python network guards during the smoke.
class OfflinePopen(subprocess.Popen):
    def __init__(self, *args, **kwargs):
        attempts.append("subprocess_denied")
        raise OSError(
            "Subprocess prohibited during offline smoke; preinstall dependencies"
        )


subprocess.Popen = OfflinePopen
import aiohttp


async def deny_http(*args, **kwargs):
    from urllib.parse import urlsplit

    target = urlsplit(str(args[2] if len(args) > 2 else kwargs.get("url", "")))
    attempts.append({"blocked_http_host": target.hostname, "path": target.path})
    raise aiohttp.ClientConnectionError(
        "HTTP prohibited in fully offline integration fixture"
    )


aiohttp.ClientSession._request = deny_http
# Explicitly neutralize only unrelated Host background refreshes; record each call.
import astrbot.core.core_lifecycle as lifecycle_module
from astrbot.core import LogBroker, astrbot_config, db_helper
from astrbot.core.core_lifecycle import AstrBotCoreLifecycle
from astrbot.core.utils.t2i.network_strategy import NetworkRenderStrategy
from astrbot.dashboard.server import AstrBotDashboard


async def offline_t2i(self):
    offline_jobs.append("official_t2i_endpoint_refresh")


async def offline_metadata():
    offline_jobs.append("llm_metadata_refresh")


NetworkRenderStrategy.get_official_endpoints = offline_t2i
lifecycle_module.update_llm_metadata = offline_metadata
import httpx

NAME = "astrbot_plugin_yomihime_quota_link"


async def main():
    astrbot_config["disable_metrics"] = True
    astrbot_config["provider"] = []
    astrbot_config["provider_sources"] = []
    astrbot_config["platform"] = []
    astrbot_config["admins_id"] = ["10001"]
    astrbot_config["dashboard"]["jwt_secret"] = (
        "synthetic-isolated-yql-key-at-least-32-bytes"
    )
    astrbot_config.save_config()
    target = root / "data/plugin_data" / NAME / "resources/fonts" / font.name
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(font, target)
    host = AstrBotCoreLifecycle(LogBroker(), db_helper)
    await host.initialize()
    core_task = asyncio.create_task(host.start())
    result = {
        "host_commit": host_commit,
        "host_version": "4.29.1",
        "zip_sha256": hashlib.sha256(plugin_zip.read_bytes()).hexdigest(),
        "phases": {},
        "packages": {
            name: importlib.metadata.version(name)
            for name in ("httpx", "cryptography", "Pillow", "hypercorn", "aiocqhttp")
        },
    }
    try:
        disposable = root / "input.zip"
        shutil.copy2(plugin_zip, disposable)
        installed = await host.plugin_manager.install_plugin_from_file(
            str(disposable), ignore_version_check=False
        )
        result["install"] = {"name": installed["name"], "repo": installed["repo"]}
        star = next(s for s in host.star_context.get_all_stars() if s.name == NAME)
        plugin = star.star_cls
        installed_module = Path(sys.modules[type(plugin).__module__].__file__).resolve()
        assert installed_module.is_relative_to(root / "data/plugins"), installed_module
        result["plugin_source"] = str(installed_module.relative_to(root))
        assert plugin._alert_engine and not plugin._alert_engine._task.done()
        result["plugin_loaded"] = True
        result["scheduler_running"] = True
        dashboard = AstrBotDashboard(host, db_helper, host.dashboard_shutdown_event)
        token = dashboard.asgi_app.state.services.auth.generate_jwt("isolated-admin")
        headers = {
            "Authorization": "Bearer " + token,
            "Origin": "http://127.0.0.1:19366",
        }
        from hypercorn.asyncio import serve
        from hypercorn.config import Config

        config = Config()
        config.bind = ["127.0.0.1:19366"]
        config.accesslog = None
        shutdown = asyncio.Event()
        server = asyncio.create_task(
            serve(dashboard.asgi_app, config, shutdown_trigger=shutdown.wait)
        )
        await asyncio.sleep(1)
        async with httpx.AsyncClient(
            base_url="http://127.0.0.1:19366", trust_env=False
        ) as client:
            base = "/api/v1/plugins/extensions/" + NAME + "/admin/"

            async def web(operation, body=None, code=200):
                r = await client.post(
                    base + operation,
                    headers=headers,
                    json=body or {},
                    follow_redirects=True,
                )
                assert r.status_code == code, (operation, r.status_code, r.text)
                return r.json().get("data")

            result["read"] = await web("read")
            result["units"] = await web("alert-units")
            result["status"] = await web("alert-status")
            result["http_live"] = True
            Path(root.parent / "startup-proof.json").write_text(
                json.dumps(result, indent=2, ensure_ascii=False, default=str)
            )
            print("REAL_HOST_STARTED", flush=True)
            from exercise import exercise

            await exercise(
                host=host,
                plugin=plugin,
                client=client,
                web=web,
                result=result,
                root=root,
                headers=headers,
                plugin_name=NAME,
            )
        shutdown.set()
        await server
        result["passed"] = True
    except BaseException:
        result["passed"] = False
        result["failure"] = traceback.format_exc()
        raise
    finally:
        if "shutdown" in locals():
            shutdown.set()
            await asyncio.gather(server, return_exceptions=True)
        await host.stop()
        await asyncio.gather(core_task, return_exceptions=True)
        result["stopped"] = True
        result["blocked_attempts"] = attempts
        result["offline_jobs"] = offline_jobs
        result["plugin_modules_from_zip"] = sorted(
            name
            for name, module in sys.modules.items()
            if getattr(module, "__file__", None)
            and Path(module.__file__).resolve().is_relative_to(root / "data/plugins")
        )
        (root / "result.json").write_text(
            json.dumps(result, indent=2, ensure_ascii=False, default=str)
        )
    print(json.dumps(result, indent=2, ensure_ascii=False, default=str))


asyncio.run(main())
