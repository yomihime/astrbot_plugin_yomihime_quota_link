"""Startup-only pinned font cache, following YGL's trusted download policy.

The caller supplies a host-owned YQL data root and, only after verifying YGL is
installed, its downloaded font path. No plugin runtime, credentials, user URLs,
query-time network access, or shared mutable font files are used here.
"""

import asyncio
import os
import stat
import tempfile
from hashlib import sha256
from pathlib import Path

import httpx

from .presentation.font import FONT_FILENAME, FONT_SHA256, FONT_SIZE

FONT_URLS = (
    "https://mirrors.tuna.tsinghua.edu.cn/CTAN/fonts/notocjksc/"
    "NotoSansCJKsc-Regular.otf",
    "https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@"
    "523d033d6cb47f4a80c58a35753646f5c3608a78/"
    "Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf",
    "https://raw.githubusercontent.com/notofonts/noto-cjk/"
    "523d033d6cb47f4a80c58a35753646f5c3608a78/"
    "Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf",
)
DOWNLOAD_TOTAL_SECONDS = 45
DOWNLOAD_SOURCE_SECONDS = 15


def _verify(content: bytes) -> None:
    if len(content) != FONT_SIZE or sha256(content).hexdigest() != FONT_SHA256:
        raise ValueError("font_integrity_failed")


def _is_reparse(info: os.stat_result) -> bool:
    return bool(
        getattr(info, "st_file_attributes", 0)
        & getattr(stat, "FILE_ATTRIBUTE_REPARSE_POINT", 0)
    )


def _safe_directories(directory: Path, *, create: bool = False) -> None:
    """Reject symlink components, including ancestors of the host-owned root."""
    for part in (*reversed(directory.parents), directory):
        try:
            info = part.lstat()
        except FileNotFoundError:
            if not create:
                raise
            part.mkdir()
            info = part.lstat()
        if not stat.S_ISDIR(info.st_mode) or _is_reparse(info):
            raise ValueError("invalid_font_directory")


def _read(path: Path) -> bytes:
    _safe_directories(path.parent)
    before = path.lstat()
    if (
        not stat.S_ISREG(before.st_mode)
        or _is_reparse(before)
        or before.st_size != FONT_SIZE
    ):
        raise ValueError("invalid_font_file")
    descriptor = os.open(path, os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0))
    with os.fdopen(descriptor, "rb") as stream:
        opened = os.fstat(stream.fileno())
        if not stat.S_ISREG(opened.st_mode) or (opened.st_dev, opened.st_ino) != (
            before.st_dev,
            before.st_ino,
        ):
            raise ValueError("invalid_font_file")
        content = stream.read(FONT_SIZE + 1)
    _verify(content)
    return content


def _install(path: Path, content: bytes) -> None:
    _verify(content)
    _safe_directories(path.parent, create=True)

    def check_destination():
        try:
            info = path.lstat()
        except FileNotFoundError:
            return
        if not stat.S_ISREG(info.st_mode) or _is_reparse(info):
            raise ValueError("invalid_font_file")

    check_destination()
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(
            dir=path.parent, prefix=".font-", delete=False
        ) as stream:
            temporary = Path(stream.name)
            stream.write(content)
            stream.flush()
            os.fsync(stream.fileno())
        _safe_directories(path.parent)
        check_destination()
        os.replace(temporary, path)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


async def _io(function, *args):
    """Join disk workers even if cancelled; no writes outlive caller shutdown."""
    task = asyncio.create_task(asyncio.to_thread(function, *args))
    cancelled = False
    while True:
        try:
            value = await asyncio.shield(task)
            break
        except asyncio.CancelledError:
            if task.cancelled():
                raise
            cancelled = True
        except Exception:
            if cancelled:
                raise asyncio.CancelledError from None
            raise
    if cancelled:
        raise asyncio.CancelledError
    return value


async def _download_source(client: httpx.AsyncClient, url: str) -> bytes:
    async with client.stream(
        "GET", url, headers={"Accept-Encoding": "identity"}
    ) as response:
        if response.status_code != 200:
            raise ValueError("font_download_http")
        if response.headers.get("Content-Encoding", "identity").lower() != "identity":
            raise ValueError("font_download_encoding")
        length = response.headers.get("Content-Length")
        if length is not None and length != str(FONT_SIZE):
            raise ValueError("font_download_length")
        content = bytearray()
        async for chunk in response.aiter_raw(65536):
            if len(content) + len(chunk) > FONT_SIZE:
                raise ValueError("font_download_length")
            content.extend(chunk)
        value = bytes(content)
        await _io(_verify, value)
        return value


async def prepare_font(root: Path, ygl_font_path: Path | None = None) -> Path | None:
    """Prepare one independent cache at startup; failures safely return None.

    Network sources are fixed and pinned by SHA, bounded to 15 seconds each / 45
    seconds total. Cancellation propagates after active disk work has joined.
    The source YGL file is read-only and never linked, moved, or modified.
    """
    path = Path(root).absolute() / "resources" / "fonts" / FONT_FILENAME
    try:
        await _io(_read, path)
        return path
    except asyncio.CancelledError:
        raise
    except Exception:
        pass
    if ygl_font_path is not None:
        try:
            content = await _io(_read, Path(ygl_font_path).absolute())
        except asyncio.CancelledError:
            raise
        except Exception:
            pass
        else:
            try:
                await _io(_install, path, content)
                return path
            except asyncio.CancelledError:
                raise
            except Exception:
                # A network copy of identical bytes cannot repair local writes.
                return None
    try:
        async with asyncio.timeout(DOWNLOAD_TOTAL_SECONDS):
            async with httpx.AsyncClient(
                trust_env=False,
                follow_redirects=False,
                timeout=httpx.Timeout(DOWNLOAD_SOURCE_SECONDS, connect=5, read=5),
            ) as client:
                for url in FONT_URLS:
                    try:
                        async with asyncio.timeout(DOWNLOAD_SOURCE_SECONDS):
                            content = await _download_source(client, url)
                    except (httpx.HTTPError, OSError, ValueError, TimeoutError):
                        continue
                    # Publishing is outside each source's transport timeout.
                    # If publication fails, another copy cannot fix the cache.
                    await _io(_install, path, content)
                    return path
    except asyncio.CancelledError:
        raise
    except Exception:
        pass
    return None
