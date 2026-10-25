"""Startup font-cache tests: synthetic bytes and offline HTTP transport only."""

import asyncio
import hashlib
import os
import threading
from pathlib import Path

import httpx
import pytest

from quota_link import managed_font as font


@pytest.fixture
def content(monkeypatch):
    value = b"synthetic-pinned-font-content-for-cache-tests"
    monkeypatch.setattr(font, "FONT_SIZE", len(value))
    monkeypatch.setattr(font, "FONT_SHA256", hashlib.sha256(value).hexdigest())
    return value


def cache(root):
    return root / "resources" / "fonts" / font.FONT_FILENAME


def put(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content)
    return path


class Stream(httpx.AsyncByteStream):
    def __init__(self, chunks):
        self.chunks = chunks

    async def __aiter__(self):
        for chunk in self.chunks:
            yield chunk


def transport(monkeypatch, responses):
    original = httpx.AsyncClient
    calls, options = [], []

    async def handle(request):
        calls.append(request)
        response = responses[min(len(calls) - 1, len(responses) - 1)]
        if isinstance(response, Exception):
            raise response
        return response()

    def client(**kwargs):
        options.append(kwargs)
        return original(transport=httpx.MockTransport(handle), **kwargs)

    monkeypatch.setattr(font.httpx, "AsyncClient", client)
    return calls, options


def success(content):
    return lambda: httpx.Response(
        200,
        headers={"Content-Length": str(len(content))},
        stream=Stream([content[:10], content[10:]]),
    )


def forbid_network(monkeypatch):
    def fail(**kwargs):
        raise AssertionError("network must not be used")

    monkeypatch.setattr(font.httpx, "AsyncClient", fail)


def test_policy_matches_ygl_pinned_font_and_sources():
    assert font.FONT_SIZE == 16_437_364
    assert (
        font.FONT_SHA256
        == "2c76254f6fc379fddfce0a7e84fb5385bb135d3e399294f6eeb6680d0365b74b"
    )
    assert len(font.FONT_URLS) == 3
    assert font.FONT_URLS[0].startswith("https://mirrors.tuna.tsinghua.edu.cn/CTAN/")
    assert "cdn.jsdelivr.net" in font.FONT_URLS[1]
    assert "raw.githubusercontent.com" in font.FONT_URLS[2]
    assert all(
        "523d033d6cb47f4a80c58a35753646f5c3608a78" in url for url in font.FONT_URLS[1:]
    )
    assert (font.DOWNLOAD_SOURCE_SECONDS, font.DOWNLOAD_TOTAL_SECONDS) == (15, 45)


def test_valid_own_cache_precedes_ygl_and_network(tmp_path, monkeypatch, content):
    own = put(cache(tmp_path / "yql"), content)
    ygl = put(cache(tmp_path / "ygl"), b"invalid")
    forbid_network(monkeypatch)
    assert asyncio.run(font.prepare_font(tmp_path / "yql", ygl)) == own
    assert ygl.read_bytes() == b"invalid"


def test_valid_ygl_is_copied_independently_and_never_modified(
    tmp_path, monkeypatch, content
):
    ygl = put(cache(tmp_path / "ygl"), content)
    before = ygl.stat()
    forbid_network(monkeypatch)
    root = tmp_path / "yql"
    assert asyncio.run(font.prepare_font(root, ygl)) == cache(root)
    assert cache(root).read_bytes() == content
    assert cache(root).stat().st_ino != ygl.stat().st_ino
    assert ygl.stat().st_mtime_ns == before.st_mtime_ns
    cache(root).write_bytes(b"own-change")
    assert ygl.read_bytes() == content
    assert not list(cache(root).parent.glob(".font-*"))


def test_corrupt_own_cache_replaced_by_valid_ygl(tmp_path, monkeypatch, content):
    root = tmp_path / "yql"
    put(cache(root), b"corrupt")
    ygl = put(cache(tmp_path / "ygl"), content)
    forbid_network(monkeypatch)
    assert asyncio.run(font.prepare_font(root, ygl)) == cache(root)
    assert cache(root).read_bytes() == content


@pytest.mark.parametrize("ygl_state", ["missing", "corrupt", "digest", "symlink"])
def test_invalid_ygl_falls_back_to_verified_download(
    tmp_path, monkeypatch, content, ygl_state
):
    ygl = cache(tmp_path / "ygl")
    if ygl_state == "corrupt":
        put(ygl, b"bad")
    elif ygl_state == "digest":
        put(ygl, b"x" * len(content))
    elif ygl_state == "symlink":
        other = put(tmp_path / "other-font", content)
        ygl.parent.mkdir(parents=True)
        ygl.symlink_to(other)
    calls, options = transport(monkeypatch, [success(content)])
    root = tmp_path / "yql"
    assert asyncio.run(font.prepare_font(root, ygl)) == cache(root)
    assert cache(root).read_bytes() == content
    assert len(calls) == 1
    assert calls[0].headers["Accept-Encoding"] == "identity"
    assert options[0]["trust_env"] is False
    assert options[0]["follow_redirects"] is False


def test_serial_source_fallback_order(tmp_path, monkeypatch, content):
    calls, _ = transport(
        monkeypatch,
        [
            lambda: httpx.Response(503),
            lambda: httpx.Response(
                302, headers={"Location": "https://untrusted.invalid/font"}
            ),
            success(content),
        ],
    )
    assert asyncio.run(font.prepare_font(tmp_path)) == cache(tmp_path)
    assert [str(request.url) for request in calls] == list(font.FONT_URLS)


@pytest.mark.parametrize(
    "response",
    [
        lambda: httpx.Response(
            200, headers={"Content-Encoding": "gzip"}, stream=Stream([b"bad"])
        ),
        lambda: httpx.Response(
            200, headers={"Content-Length": "999999999"}, stream=Stream([b"bad"])
        ),
        lambda: httpx.Response(200, stream=Stream([b"short"])),
        lambda: httpx.Response(200, stream=Stream([b"x" * 500])),
    ],
)
def test_invalid_download_never_published(tmp_path, monkeypatch, content, response):
    calls, _ = transport(monkeypatch, [response])
    assert asyncio.run(font.prepare_font(tmp_path)) is None
    assert len(calls) == 3
    assert not cache(tmp_path).exists()


def test_wrong_digest_download_never_published(tmp_path, monkeypatch, content):
    transport(monkeypatch, [success(b"x" * len(content))])
    assert asyncio.run(font.prepare_font(tmp_path)) is None
    assert not cache(tmp_path).exists()


def test_unwritable_cache_does_not_retry_identical_network_bytes(
    tmp_path, monkeypatch, content
):
    calls, _ = transport(monkeypatch, [success(content)])
    monkeypatch.setattr(
        font, "_install", lambda *args: (_ for _ in ()).throw(OSError("private-path"))
    )
    assert asyncio.run(font.prepare_font(tmp_path)) is None
    assert len(calls) == 1


@pytest.mark.parametrize("location", ["root", "resources", "fonts", "file"])
def test_destination_symlinks_rejected_without_touching_target(
    tmp_path, monkeypatch, content, location
):
    root = tmp_path / "yql"
    target = tmp_path / "target"
    target.mkdir()
    relative = {
        "root": root,
        "resources": root / "resources",
        "fonts": cache(root).parent,
        "file": cache(root),
    }[location]
    relative.parent.mkdir(parents=True, exist_ok=True)
    if location == "file":
        target = put(target / "font", b"untouched")
    relative.symlink_to(target, target_is_directory=location != "file")
    ygl = put(cache(tmp_path / "ygl"), content)
    forbid_network(monkeypatch)
    assert asyncio.run(font.prepare_font(root, ygl)) is None
    if location == "file":
        assert target.read_bytes() == b"untouched"
    else:
        assert list(target.iterdir()) == []


def test_atomic_publication_failure_cleans_temporary_and_keeps_old(
    tmp_path, monkeypatch, content
):
    destination = put(cache(tmp_path), b"old")
    monkeypatch.setattr(
        font.os, "replace", lambda *args: (_ for _ in ()).throw(OSError("fail"))
    )
    with pytest.raises(OSError):
        font._install(destination, content)
    assert destination.read_bytes() == b"old"
    assert not list(destination.parent.glob(".font-*"))


def test_source_deadline_allows_later_source(tmp_path, monkeypatch, content):
    calls = []

    async def download(client, url):
        calls.append(url)
        if len(calls) == 1:
            await asyncio.sleep(1)
        return content

    monkeypatch.setattr(font, "DOWNLOAD_SOURCE_SECONDS", 0.02)
    monkeypatch.setattr(font, "_download_source", download)
    assert asyncio.run(font.prepare_font(tmp_path)) == cache(tmp_path)
    assert calls == list(font.FONT_URLS[:2])


def test_total_deadline_stops_all_sources(tmp_path, monkeypatch, content):
    async def download(*args):
        await asyncio.sleep(1)

    monkeypatch.setattr(font, "DOWNLOAD_TOTAL_SECONDS", 0.02)
    monkeypatch.setattr(font, "_download_source", download)
    assert asyncio.run(font.prepare_font(tmp_path)) is None
    assert not cache(tmp_path).exists()


def test_cancellation_during_download_propagates(tmp_path, monkeypatch, content):
    async def scenario():
        started = asyncio.Event()

        async def download(*args):
            started.set()
            await asyncio.sleep(60)

        monkeypatch.setattr(font, "_download_source", download)
        task = asyncio.create_task(font.prepare_font(tmp_path))
        await started.wait()
        task.cancel()
        with pytest.raises(asyncio.CancelledError):
            await task
        assert not cache(tmp_path).exists()

    asyncio.run(scenario())


def test_cancellation_joins_disk_worker_before_return(tmp_path, monkeypatch, content):
    entered, release, finished = threading.Event(), threading.Event(), threading.Event()
    original = font._install
    ygl = put(cache(tmp_path / "ygl"), content)

    def install(*args):
        entered.set()
        assert release.wait(5)
        original(*args)
        finished.set()

    async def scenario():
        monkeypatch.setattr(font, "_install", install)
        task = asyncio.create_task(font.prepare_font(tmp_path / "yql", ygl))
        assert await asyncio.to_thread(entered.wait, 5)
        task.cancel()
        await asyncio.sleep(0.01)
        assert not task.done()
        release.set()
        with pytest.raises(asyncio.CancelledError):
            await task
        assert finished.is_set()

    asyncio.run(scenario())


@pytest.mark.skipif(
    not os.environ.get("QUOTA_TEST_FONT"),
    reason="explicit pinned font fixture not configured",
)
def test_exact_real_font_is_copied_then_reused_offline(tmp_path, monkeypatch):
    source = Path(os.environ["QUOTA_TEST_FONT"])
    assert len(source.read_bytes()) == font.FONT_SIZE
    assert hashlib.sha256(source.read_bytes()).hexdigest() == font.FONT_SHA256
    forbid_network(monkeypatch)
    copied = asyncio.run(font.prepare_font(tmp_path, source))
    assert copied == cache(tmp_path)
    assert copied.read_bytes() == source.read_bytes()
    assert copied.stat().st_ino != source.stat().st_ino
    assert asyncio.run(font.prepare_font(tmp_path)) == copied
