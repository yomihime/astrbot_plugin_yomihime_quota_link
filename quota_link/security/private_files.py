"""Immutable private files and atomic config publication, never ACL repair.

POSIX descriptor-relative traversal and file identity checks are adapted from
Game Link infrastructure/managed_key_file.py at
cf755ed4ac455e8be48a9b99c285078cdb696510 (AGPL-3.0; see LICENSE).
Only newly created entries receive private modes. Existing entries are checked,
not chmod'ed. Windows uses the extracted native handle/ACL implementation.
"""

from __future__ import annotations

import os
import re
import secrets
import stat
from collections.abc import Callable
from contextlib import contextmanager
from pathlib import Path

from .managed_key_file import ManagedKeyFileError

_NAME = re.compile(r"[a-zA-Z0-9_.-]{1,128}\Z")


class PrivateFiles:
    def __init__(self, data_root: str | Path, directory: str) -> None:
        self.data_root = Path(data_root)
        if (
            not self.data_root.is_absolute()
            or ".." in self.data_root.parts
            or directory not in {"keys", "secrets", "config", "state"}
        ):
            raise ManagedKeyFileError("key_file_invalid")
        self.root = self.data_root / directory
        self.directory = directory

    @staticmethod
    def _name(name: str) -> str:
        if type(name) is not str or not _NAME.fullmatch(name) or name in {".", ".."}:
            raise ManagedKeyFileError("key_file_invalid")
        return name

    @contextmanager
    def _posix_directory(self, *, create: bool = False):
        flags = os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW | os.O_CLOEXEC
        parent = directory = None
        try:
            parent = os.open(self.data_root.anchor, flags)
            for component in self.data_root.parts[1:]:
                ancestor = os.fstat(parent)
                if (
                    not stat.S_ISDIR(ancestor.st_mode)
                    or ancestor.st_uid not in (0, os.geteuid())
                    or ancestor.st_mode & 0o022
                    and not ancestor.st_mode & stat.S_ISVTX
                ):
                    raise ManagedKeyFileError()
                following = os.open(component, flags, dir_fd=parent)
                os.close(parent)
                parent = following
            info = os.fstat(parent)
            if (
                not stat.S_ISDIR(info.st_mode)
                or info.st_uid != os.geteuid()
                or info.st_mode & 0o022
            ):
                raise ManagedKeyFileError()
            if create:
                try:
                    os.mkdir(self.directory, mode=0o700, dir_fd=parent)
                except FileExistsError:
                    pass
            directory = os.open(self.directory, flags, dir_fd=parent)
            info = os.fstat(directory)
            if (
                not stat.S_ISDIR(info.st_mode)
                or info.st_uid != os.geteuid()
                or info.st_mode & 0o077
                or info.st_nlink < 2
            ):
                raise ManagedKeyFileError()
            if create:
                os.fsync(parent)
            yield directory
        except ManagedKeyFileError:
            raise
        except OSError:
            raise ManagedKeyFileError() from None
        finally:
            if directory is not None:
                os.close(directory)
            if parent is not None:
                os.close(parent)

    @staticmethod
    def _check_file(directory: int, name: str, handle: int) -> None:
        opened = os.fstat(handle)
        named = os.stat(name, dir_fd=directory, follow_symlinks=False)
        if (
            not stat.S_ISREG(opened.st_mode)
            or opened.st_uid != os.geteuid()
            or opened.st_mode & 0o077
            or opened.st_nlink != 1
            or (opened.st_dev, opened.st_ino) != (named.st_dev, named.st_ino)
        ):
            raise ManagedKeyFileError()

    def entries(self) -> tuple[str, ...]:
        if os.name == "nt":
            from .windows.managed_key_io import list_keys

            return list_keys(self.data_root, self.root)
        # Validate the complete parent chain even for a missing child, and avoid
        # creating it during read-only inventory. A missing child is empty only
        # after its parent has passed the same secure traversal.
        try:
            with self._posix_directory() as directory:
                result = tuple(sorted(os.listdir(directory)))
                if len(result) > 4096:
                    raise ManagedKeyFileError()
                return result
        except ManagedKeyFileError:
            self._validate_missing_directory()
            return ()

    def _validate_missing_directory(self) -> None:
        # Reuse the traversal via a sibling-free path walk, not Path.exists(),
        # which follows links and can mistake an unsafe/dangling link for empty.
        flags = os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW | os.O_CLOEXEC
        handle = None
        try:
            handle = os.open(self.data_root.anchor, flags)
            for component in self.data_root.parts[1:]:
                info = os.fstat(handle)
                if (
                    info.st_uid not in (0, os.geteuid())
                    or info.st_mode & 0o022
                    and not info.st_mode & stat.S_ISVTX
                ):
                    raise ManagedKeyFileError()
                following = os.open(component, flags, dir_fd=handle)
                os.close(handle)
                handle = following
            info = os.fstat(handle)
            if info.st_uid != os.geteuid() or info.st_mode & 0o022:
                raise ManagedKeyFileError()
            try:
                os.stat(self.directory, dir_fd=handle, follow_symlinks=False)
            except FileNotFoundError:
                return
            raise ManagedKeyFileError()
        except OSError:
            raise ManagedKeyFileError() from None
        finally:
            if handle is not None:
                os.close(handle)

    def read(self, name: str, limit: int) -> bytes:
        name = self._name(name)
        if os.name == "nt":
            from .windows.managed_key_io import read_key

            return read_key(self.data_root, self.root, name, limit)
        with self._posix_directory() as directory:
            handle = None
            try:
                handle = os.open(
                    name,
                    os.O_RDONLY | os.O_NOFOLLOW | os.O_CLOEXEC | os.O_NONBLOCK,
                    dir_fd=directory,
                )
                self._check_file(directory, name, handle)
                chunks, remaining = [], limit
                while remaining:
                    chunk = os.read(handle, remaining)
                    if not chunk:
                        break
                    chunks.append(chunk)
                    remaining -= len(chunk)
                self._check_file(directory, name, handle)
                return b"".join(chunks)
            except OSError:
                raise ManagedKeyFileError() from None
            finally:
                if handle is not None:
                    os.close(handle)

    def confirm(self, name: str, limit: int) -> bytes:
        """Flush a complete candidate again before publishing a key selector."""
        name = self._name(name)
        if os.name == "nt":
            from .windows.managed_key_io import confirm_key_durable

            return confirm_key_durable(self.data_root, self.root, name, limit)
        with self._posix_directory() as directory:
            handle = None
            try:
                handle = os.open(
                    name,
                    os.O_RDWR | os.O_NOFOLLOW | os.O_CLOEXEC | os.O_NONBLOCK,
                    dir_fd=directory,
                )
                self._check_file(directory, name, handle)
                value = os.read(handle, limit)
                os.fsync(handle)
                self._check_file(directory, name, handle)
                os.fsync(directory)
                return value
            except OSError:
                raise ManagedKeyFileError() from None
            finally:
                if handle is not None:
                    os.close(handle)

    def create(self, name: str, payload: bytes) -> None:
        name = self._name(name)
        if os.name == "nt":
            from .windows.managed_key_io import create_key

            create_key(self.data_root, self.root, name, payload)
            return
        with self._posix_directory(create=True) as directory:
            handle = None
            try:
                handle = os.open(
                    name,
                    os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW | os.O_CLOEXEC,
                    0o600,
                    dir_fd=directory,
                )
                self._check_file(directory, name, handle)
                remaining = payload
                while remaining:
                    written = os.write(handle, remaining)
                    if written <= 0:
                        raise ManagedKeyFileError()
                    remaining = remaining[written:]
                os.fsync(handle)
                self._check_file(directory, name, handle)
                os.fsync(directory)
            except FileExistsError:
                raise ManagedKeyFileError("key_file_exists") from None
            except OSError:
                raise ManagedKeyFileError() from None
            finally:
                if handle is not None:
                    os.close(handle)
                # Preserve failed immutable candidates. Never mistake a partial
                # key or a ciphertext orphan for a fresh installation.

    def replace(
        self, name: str, payload: bytes, *, authorize: Callable[[], None] | None = None
    ) -> None:
        name = self._name(name)
        candidate = "candidate-" + secrets.token_hex(16) + ".tmp"
        self.create(candidate, payload)
        if os.name == "nt":
            from .windows.documents import replace_file

            replace_file(
                self.data_root, self.root, candidate, name, authorize=authorize
            )
            return
        with self._posix_directory() as directory:
            try:
                if name in os.listdir(directory):
                    self.read(name, 1)
                if authorize is not None:
                    authorize()
                os.replace(candidate, name, src_dir_fd=directory, dst_dir_fd=directory)
                os.fsync(directory)
            except OSError:
                raise ManagedKeyFileError() from None

    def delete(self, name: str) -> bool:
        name = self._name(name)
        if name not in self.entries():
            return False
        if os.name == "nt":
            from .windows.documents import delete_file

            delete_file(self.data_root, self.root, name)
            return True
        with self._posix_directory() as directory:
            # Validate regular file, owner, permissions and link count before
            # unlinking. Same-user compromise is outside this storage boundary.
            self.read(name, 1)
            try:
                os.unlink(name, dir_fd=directory)
                os.fsync(directory)
            except OSError:
                raise ManagedKeyFileError() from None
            return True
