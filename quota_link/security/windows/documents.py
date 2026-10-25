"""Pinned atomic publication and deletion, without changing existing ACLs.

Publication follows Game Link infrastructure/windows/private_storage.py,
cf755ed4ac455e8be48a9b99c285078cdb696510 (AGPL-3.0; see LICENSE).
"""

from collections.abc import Callable
from ctypes import wintypes
from pathlib import Path

from ..managed_key_file import ManagedKeyFileError
from .managed_key_io import _pin, list_keys, read_key


def replace_file(
    data_root: Path,
    root: Path,
    candidate: str,
    name: str,
    *,
    authorize: Callable[[], None] | None = None,
) -> None:
    with _pin(root, data_root) as (native, *_):
        read_key(data_root, root, candidate, 1)
        if name in list_keys(data_root, root):
            read_key(data_root, root, name, 1)
        native.dll.MoveFileExW.argtypes = [
            wintypes.LPCWSTR,
            wintypes.LPCWSTR,
            wintypes.DWORD,
        ]
        native.dll.MoveFileExW.restype = wintypes.BOOL
        source, destination = str(root / candidate), str(root / name)
        if authorize is not None:
            authorize()
        if not native.dll.MoveFileExW(source, destination, 1 | 8):
            raise ManagedKeyFileError()


def delete_file(data_root: Path, root: Path, name: str) -> None:
    with _pin(root, data_root) as (native, *_):
        read_key(data_root, root, name, 1)
        native.dll.DeleteFileW.argtypes = [wintypes.LPCWSTR]
        native.dll.DeleteFileW.restype = wintypes.BOOL
        if not native.dll.DeleteFileW(str(root / name)):
            raise ManagedKeyFileError()
