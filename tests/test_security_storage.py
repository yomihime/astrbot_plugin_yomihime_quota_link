"""Synthetic temporary storage only: never alter real instance ACLs or data."""

import base64
import json
import os
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import pytest

from quota_link.security import (
    AESGCMSecretCodec,
    EnvironmentKeyProvider,
    SecretKeyUnavailable,
    SecretStore,
    SecretStoreUnavailable,
)

ENV = "QUOTA_LINK_SECRET_KEY"


@pytest.fixture(autouse=True)
def no_deployment_key(monkeypatch):
    monkeypatch.delenv(ENV, raising=False)


@pytest.fixture
def store(tmp_path):
    return SecretStore(tmp_path)


def test_encrypted_roundtrip_and_restart(tmp_path, store):
    secret = b"sample-credential-never-visible-in-files"
    reference = store.put(secret)
    assert reference.startswith("quota_secret_")
    assert store.get(reference) == secret
    assert SecretStore(tmp_path).get(reference) == secret
    assert store.encryption_readiness() == {
        "ready": True,
        "state": "ready",
        "reason_code": "ready",
    }
    for path in tmp_path.rglob("*"):
        if path.is_file():
            assert secret not in path.read_bytes()
            assert path.stat().st_mode & 0o077 == 0
    assert "sample-credential" not in repr(store)
    assert store.delete(reference) is True
    assert store.delete(reference) is False
    with pytest.raises(SecretStoreUnavailable):
        store.get(reference)


def test_separate_nonces_refs_and_authenticated_reference_binding(tmp_path, store):
    one, two = store.put(b"same"), store.put(b"same")
    first, second = [tmp_path / "secrets" / f"{ref}.blob" for ref in (one, two)]
    assert first.read_bytes() != second.read_bytes()
    second.write_bytes(first.read_bytes())
    with pytest.raises(SecretStoreUnavailable):
        store.get(two)
    assert store.get(one) == b"same"


def test_json_bundle_and_config_have_independent_lifecycles(tmp_path, store):
    assert store.read_config() is None
    assert not (tmp_path / "keys").exists()
    reference = store.put_json({"api_key": "fake-value", "cookie": "会话"})
    config = {"revision": 1, "accounts": [{"secret_ref": reference}]}
    store.write_config(config)
    assert store.read_config() == config
    assert store.get_json(reference) == {"api_key": "fake-value", "cookie": "会话"}
    (tmp_path / "keys" / "master.key").unlink()
    assert store.read_config() == config
    store.write_config({"revision": 2})
    assert store.read_config() == {"revision": 2}
    with pytest.raises(SecretStoreUnavailable):
        store.get_json(reference)
    assert not (tmp_path / "keys" / "master.key").exists()


@pytest.mark.parametrize(
    "encoded", ["", "broken", "!" * 44, base64.b64encode(b"short").decode()]
)
def test_explicit_invalid_environment_never_falls_back(tmp_path, monkeypatch, encoded):
    monkeypatch.setenv(ENV, encoded)
    store = SecretStore(tmp_path)
    with pytest.raises(SecretStoreUnavailable):
        store.put(b"do-not-store")
    assert not (tmp_path / "keys").exists()
    assert not store.encryption_readiness()["ready"]


def test_environment_key_never_persisted_and_missing_or_changed_key_blocks(
    tmp_path, monkeypatch
):
    key = b"X" * 32
    monkeypatch.setenv(ENV, base64.b64encode(key).decode())
    store = SecretStore(tmp_path)
    reference = store.put(b"credential")
    assert not (tmp_path / "keys" / "master.key").exists()
    for path in tmp_path.rglob("*"):
        if path.is_file():
            assert key not in path.read_bytes()
    monkeypatch.delenv(ENV)
    for operation in (lambda: store.get(reference), lambda: store.put(b"other")):
        with pytest.raises(SecretStoreUnavailable):
            operation()
    assert not (tmp_path / "keys" / "master.key").exists()
    monkeypatch.setenv(ENV, base64.b64encode(b"Y" * 32).decode())
    with pytest.raises(SecretStoreUnavailable):
        store.put(b"other")
    monkeypatch.setenv(ENV, base64.b64encode(key).decode())
    assert store.get(reference) == b"credential"


def test_wrong_environment_override_does_not_replace_managed_key(
    tmp_path, store, monkeypatch
):
    reference = store.put(b"credential")
    original = (tmp_path / "keys" / "master.key").read_bytes()
    monkeypatch.setenv(ENV, base64.b64encode(b"Z" * 32).decode())
    with pytest.raises(SecretStoreUnavailable):
        store.get(reference)
    with pytest.raises(SecretStoreUnavailable):
        store.put(b"new")
    assert (tmp_path / "keys" / "master.key").read_bytes() == original
    monkeypatch.delenv(ENV)
    assert store.get(reference) == b"credential"


@pytest.mark.parametrize("removed", ["master.key", "selection.json", "both"])
def test_missing_key_or_selector_with_ciphertext_never_regenerates(
    tmp_path, store, removed
):
    reference = store.put(b"credential")
    paths = ["master.key", "selection.json"] if removed == "both" else [removed]
    for name in paths:
        (tmp_path / "keys" / name).unlink()
    before = {p.name: p.read_bytes() for p in (tmp_path / "keys").iterdir()}
    for operation in (
        lambda: store.get(reference),
        lambda: SecretStore(tmp_path).put(b"new"),
    ):
        with pytest.raises(SecretStoreUnavailable):
            operation()
    assert {p.name: p.read_bytes() for p in (tmp_path / "keys").iterdir()} == before


@pytest.mark.parametrize(
    "mutation", ["tamper", "truncate", "plaintext", "wrong_key", "invalid_selector"]
)
def test_tamper_wrong_key_and_plaintext_fail_closed(tmp_path, store, mutation):
    reference = store.put(b"private-value")
    path = tmp_path / "secrets" / f"{reference}.blob"
    if mutation == "tamper":
        raw = bytearray(path.read_bytes())
        raw[-1] ^= 1
        path.write_bytes(raw)
    elif mutation == "truncate":
        path.write_bytes(path.read_bytes()[:10])
    elif mutation == "plaintext":
        path.write_bytes(b"private-value")
    elif mutation == "wrong_key":
        key = tmp_path / "keys" / "master.key"
        key.write_bytes(b"QLMK\x01" + b"different-key-that-has-32-bytes!!!"[:32])
    else:
        (tmp_path / "keys" / "selection.json").write_text('{"version":1}')
    with pytest.raises(SecretStoreUnavailable) as error:
        store.get(reference)
    assert str(error.value) == "secret storage is unavailable"
    assert str(tmp_path) not in str(error.value)
    assert "private-value" not in str(error.value)


@pytest.mark.parametrize(
    "reference",
    [
        "../escape",
        "quota_secret_../a",
        "quota_secret_" + "a" * 48 + "\n",
        "C:\\secret",
        "",
        None,
        1,
    ],
)
def test_hostile_refs_rejected_without_filesystem_access(store, reference):
    for operation in (store.get, store.delete):
        with pytest.raises(ValueError, match="invalid secret reference"):
            operation(reference)


@pytest.mark.skipif(os.name == "nt", reason="POSIX synthetic mode and link checks")
@pytest.mark.parametrize(
    "target", ["root", "keys", "secrets", "key", "blob", "selector", "config"]
)
def test_symlink_targets_are_not_followed(tmp_path, target):
    safe = tmp_path / "private"
    safe.mkdir(mode=0o700)
    store = SecretStore(safe)
    reference = store.put(b"credential")
    store.write_config({"revision": 1})
    mapping = {
        "root": safe,
        "keys": safe / "keys",
        "secrets": safe / "secrets",
        "key": safe / "keys" / "master.key",
        "selector": safe / "keys" / "selection.json",
        "blob": safe / "secrets" / f"{reference}.blob",
        "config": safe / "config" / "accounts.json",
    }
    original = mapping[target]
    moved = tmp_path / "outside"
    original.rename(moved)
    original.symlink_to(moved, target_is_directory=moved.is_dir())
    operation = (
        store.read_config if target == "config" else lambda: store.get(reference)
    )
    with pytest.raises(SecretStoreUnavailable):
        operation()
    if target == "config":
        with pytest.raises(SecretStoreUnavailable):
            store.write_config({"revision": 2})
        assert json.loads(moved.read_text()) == {"revision": 1}


@pytest.mark.skipif(os.name == "nt", reason="POSIX synthetic mode and link checks")
@pytest.mark.parametrize(
    "target,mode",
    [
        ("root", 0o777),
        ("keys", 0o755),
        ("secrets", 0o755),
        ("key", 0o644),
        ("blob", 0o644),
    ],
)
def test_unsafe_permissions_rejected_without_repair(tmp_path, store, target, mode):
    reference = store.put(b"credential")
    path = {
        "root": tmp_path,
        "keys": tmp_path / "keys",
        "secrets": tmp_path / "secrets",
        "key": tmp_path / "keys" / "master.key",
        "blob": tmp_path / "secrets" / f"{reference}.blob",
    }[target]
    path.chmod(mode)
    with pytest.raises(SecretStoreUnavailable):
        store.get(reference)
    assert path.stat().st_mode & 0o777 == mode


@pytest.mark.skipif(os.name == "nt", reason="POSIX synthetic link and FIFO checks")
@pytest.mark.parametrize("target", ["key", "blob"])
def test_hardlinks_rejected(tmp_path, store, target):
    reference = store.put(b"credential")
    path = (
        tmp_path / "keys" / "master.key"
        if target == "key"
        else tmp_path / "secrets" / f"{reference}.blob"
    )
    os.link(path, tmp_path / "outside-copy")
    with pytest.raises(SecretStoreUnavailable):
        store.get(reference)


@pytest.mark.skipif(os.name == "nt", reason="POSIX synthetic FIFO check")
def test_fifo_payload_is_rejected_without_blocking(tmp_path, store):
    reference = store.put(b"credential")
    path = tmp_path / "secrets" / f"{reference}.blob"
    path.unlink()
    os.mkfifo(path, 0o600)
    with pytest.raises(SecretStoreUnavailable):
        store.get(reference)


@pytest.mark.parametrize("directory", ["keys", "secrets"])
def test_unknown_inventory_prevents_auto_initialization(tmp_path, store, directory):
    path = tmp_path / directory
    path.mkdir(mode=0o700)
    (path / "unexpected").write_bytes(b"do not overwrite")
    with pytest.raises(SecretStoreUnavailable):
        store.put(b"new")
    assert not (tmp_path / "keys" / "master.key").exists()


def test_partial_master_key_is_preserved_and_blocks_initialization(tmp_path, store):
    keys = tmp_path / "keys"
    keys.mkdir(mode=0o700)
    path = keys / "master.key"
    path.write_bytes(b"QLMK\x01partial")
    path.chmod(0o600)
    with pytest.raises(SecretStoreUnavailable):
        store.put(b"new")
    assert path.read_bytes() == b"QLMK\x01partial"
    assert not (keys / "selection.json").exists()


def test_fresh_writers_converge_on_one_key(tmp_path):
    stores = [SecretStore(tmp_path) for _ in range(8)]

    # First initializer may expose an incomplete immutable candidate to a
    # competing writer. That writer must fail closed rather than replace it.
    def write(store):
        try:
            return store.put(b"credential")
        except SecretStoreUnavailable:
            return None

    with ThreadPoolExecutor(max_workers=8) as pool:
        references = list(pool.map(write, stores))
    assert any(references)
    reopened = SecretStore(tmp_path)
    for reference in filter(None, references):
        assert reopened.get(reference) == b"credential"


def test_json_types_bounds_and_config_corruption(tmp_path, store):
    for value in (
        [],
        {"value": float("nan")},
        {"value": object()},
        {"value": "x" * (2 * 1024 * 1024)},
    ):
        with pytest.raises(ValueError):
            store.put_json(value)
    for value in ("not-bytes", b"x" * (1024 * 1024 + 1)):
        with pytest.raises(ValueError):
            store.put(value)
    store.write_config({"ok": True})
    (tmp_path / "config" / "accounts.json").write_bytes(b"[]")
    with pytest.raises(SecretStoreUnavailable):
        store.read_config()


def test_invalid_root_and_environment_variable_are_bounded(tmp_path):
    for path in (Path("relative"), tmp_path / ".." / "unsafe"):
        with pytest.raises(SecretStoreUnavailable):
            SecretStore(path)
    with pytest.raises(SecretStoreUnavailable):
        SecretStore(tmp_path, key_variable="not a variable")


def test_codec_matches_game_link_contract_with_quota_namespace(monkeypatch):
    monkeypatch.setenv(ENV, base64.b64encode(b"K" * 32).decode())
    codec = AESGCMSecretCodec(EnvironmentKeyProvider(ENV))
    encrypted = codec.encrypt(b"hello")
    assert encrypted.startswith(b"QLSC\x01")
    assert codec.decrypt(encrypted) == b"hello"
    assert codec.encryption_diagnostics() == ("valid_format", "available")
    for bad in (encrypted[:-1], b"hello", b"YHSC\x01" + encrypted[5:]):
        with pytest.raises(ValueError):
            codec.decrypt(bad)
    monkeypatch.setenv(ENV, base64.b64encode(b"J" * 32).decode())
    with pytest.raises(ValueError):
        codec.decrypt(encrypted)
    monkeypatch.delenv(ENV)
    with pytest.raises(SecretKeyUnavailable):
        EnvironmentKeyProvider(ENV).get_key()


def test_partial_write_does_not_return_ref_or_expose_plaintext(
    tmp_path, store, monkeypatch
):
    assert store.encryption_readiness()["ready"]
    original = os.write

    def partial_then_fail(handle, value):
        original(handle, value[:4])
        raise OSError("synthetic disk failure")

    monkeypatch.setattr(os, "write", partial_then_fail)
    with pytest.raises(SecretStoreUnavailable):
        store.put(b"unique-sensitive-plaintext")
    candidates = list((tmp_path / "secrets").iterdir())
    assert len(candidates) == 1
    assert candidates[0].read_bytes() == b"QLSC"
    with pytest.raises(SecretStoreUnavailable):
        store.get(candidates[0].stem)


def test_config_replace_failure_preserves_previous_commit(tmp_path, store, monkeypatch):
    store.write_config({"revision": 1})

    def deny_replace(*args, **kwargs):
        raise OSError("synthetic disk failure")

    monkeypatch.setattr(os, "replace", deny_replace)
    with pytest.raises(SecretStoreUnavailable):
        store.write_config({"revision": 2})
    assert store.read_config() == {"revision": 1}
    assert len(list((tmp_path / "config").glob("candidate-*.tmp"))) == 1


def test_failed_master_key_flush_never_publishes_selector(tmp_path, store, monkeypatch):
    original = os.fsync

    def fail_file_flush(handle):
        import stat

        if stat.S_ISREG(os.fstat(handle).st_mode):
            raise OSError("synthetic flush failure")
        original(handle)

    monkeypatch.setattr(os, "fsync", fail_file_flush)
    with pytest.raises(SecretStoreUnavailable):
        store.put(b"credential")
    assert (tmp_path / "keys" / "master.key").exists()
    assert not (tmp_path / "keys" / "selection.json").exists()
    assert not (tmp_path / "secrets").exists()
    # A later restart must re-flush the preserved complete candidate, not just
    # read/adopt it as a supposedly durable master key.
    with pytest.raises(SecretStoreUnavailable):
        SecretStore(tmp_path).put(b"credential")
    assert not (tmp_path / "keys" / "selection.json").exists()
    monkeypatch.setattr(os, "fsync", original)
    reopened = SecretStore(tmp_path)
    reference = reopened.put(b"credential")
    assert reopened.get(reference) == b"credential"


def test_history_survives_missing_manifest_and_missing_config_directory(
    tmp_path, store
):
    import shutil

    assert store.config_history_exists() is False
    store.write_config({"revision": 1})
    assert store.config_history_exists() is True
    (tmp_path / "config" / "accounts.json").unlink()
    assert store.read_config() is None
    assert SecretStore(tmp_path).config_history_exists() is True
    shutil.rmtree(tmp_path / "config")
    assert SecretStore(tmp_path).config_history_exists() is True
    # A new key cannot be synthesized over a lost manifest and its history.
    with pytest.raises(SecretStoreUnavailable):
        SecretStore(tmp_path).put(b"new-value")
    assert not (tmp_path / "keys" / "master.key").exists()


def test_ciphertext_is_history_even_without_a_config_marker(tmp_path, store):
    store.put(b"credential")
    assert not (tmp_path / "state").exists()
    assert store.config_history_exists() is True
    assert store.read_config() is None


def test_in_memory_readiness_alone_is_not_config_history(store):
    assert store.encryption_readiness()["ready"]
    assert store.config_history_exists() is False


@pytest.mark.parametrize(
    "failure",
    [
        ValueError("denied"),
        PermissionError("denied"),
        OSError("denied"),
        RuntimeError("denied"),
    ],
)
def test_final_authorization_denial_preserves_config_and_exception(
    tmp_path, store, monkeypatch, failure
):
    store.write_config({"revision": 1})
    events = []
    original_replace = os.replace

    def traced_replace(*args, **kwargs):
        events.append("replace")
        return original_replace(*args, **kwargs)

    monkeypatch.setattr(os, "replace", traced_replace)

    def deny():
        events.append("authorize")
        assert store.read_config() == {"revision": 1}
        assert len(list((tmp_path / "config").glob("candidate-*.tmp"))) == 1
        raise failure

    with pytest.raises(type(failure)) as raised:
        store.write_config({"revision": 2}, authorize=deny)
    assert raised.value is failure
    assert events == ["authorize"]
    assert store.read_config() == {"revision": 1}


def test_final_authorization_immediately_precedes_posix_replace(store, monkeypatch):
    events = []
    original_replace = os.replace

    def traced_replace(*args, **kwargs):
        events.append("replace")
        return original_replace(*args, **kwargs)

    monkeypatch.setattr(os, "replace", traced_replace)
    store.write_config({"revision": 1}, authorize=lambda: events.append("authorize"))
    assert events == ["authorize", "replace"]
    assert store.read_config() == {"revision": 1}


def test_failed_initial_publication_leaves_durable_history(
    tmp_path, store, monkeypatch
):
    def deny_replace(*args, **kwargs):
        raise OSError("synthetic failure")

    monkeypatch.setattr(os, "replace", deny_replace)
    with pytest.raises(SecretStoreUnavailable):
        store.write_config({"revision": 1})
    assert store.read_config() is None
    assert SecretStore(tmp_path).config_history_exists() is True


def test_corrupt_history_marker_blocks_manifest_publication(tmp_path, store):
    store.write_config({"revision": 1})
    marker = tmp_path / "state" / "config-published.marker"
    marker.write_bytes(b"corrupt")
    with pytest.raises(SecretStoreUnavailable):
        store.config_history_exists()
    with pytest.raises(SecretStoreUnavailable):
        store.write_config({"revision": 2})
    assert store.read_config() == {"revision": 1}
    assert marker.read_bytes() == b"corrupt"


def test_manifest_refs_block_regeneration_after_keys_and_blobs_are_lost(
    tmp_path, store
):
    import shutil

    reference = store.put(b"credential")
    store.write_config(
        {
            "schema": "yomihime-quota-link/config/v1",
            "credentials": {
                "account": {"api_key": {"source": "encrypted", "ref": reference}}
            },
        }
    )
    shutil.rmtree(tmp_path / "keys")
    shutil.rmtree(tmp_path / "secrets")
    shutil.rmtree(tmp_path / "state")
    reopened = SecretStore(tmp_path)
    with pytest.raises(SecretStoreUnavailable):
        reopened.put(b"replacement")
    assert not (tmp_path / "keys" / "master.key").exists()
    assert reopened.config_history_exists() is True


def test_environment_only_manifest_permits_first_encrypted_credential(tmp_path, store):
    store.write_config(
        {
            "schema": "yomihime-quota-link/config/v1",
            "credentials": {
                "account": {"api_key": {"source": "environment", "name": "MY_API_KEY"}}
            },
        }
    )
    reference = store.put(b"first-stored-value")
    assert SecretStore(tmp_path).get(reference) == b"first-stored-value"


def test_windows_final_authorization_immediately_precedes_move_without_native_io(
    tmp_path, monkeypatch
):
    from contextlib import contextmanager
    from types import SimpleNamespace

    from quota_link.security.windows import documents

    events = []

    def move(*args):
        events.append("move")
        return True

    @contextmanager
    def pin(*args):
        yield (SimpleNamespace(dll=SimpleNamespace(MoveFileExW=move)),)

    monkeypatch.setattr(documents, "_pin", pin)
    monkeypatch.setattr(documents, "read_key", lambda *args: events.append("read"))
    monkeypatch.setattr(documents, "list_keys", lambda *args: ("accounts.json",))
    documents.replace_file(
        tmp_path,
        tmp_path,
        "candidate.tmp",
        "accounts.json",
        authorize=lambda: events.append("authorize"),
    )
    assert events[-2:] == ["authorize", "move"]
