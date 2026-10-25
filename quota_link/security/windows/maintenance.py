# Adapted from Yomihime Game Link, commit cf755ed4ac455e8be48a9b99c285078cdb696510.
# Original project license: AGPL-3.0; see repository LICENSE.
"""Native Windows security descriptor decoding and conservative ACL checks.

Extracted primitives only: no Game Link maintenance lifecycle, Core authority,
or ACL mutation. Existing ownership and permissions are inspected, not repaired.
"""

from __future__ import annotations

import ctypes
import struct
from ctypes import wintypes
from dataclasses import dataclass

from . import fs

READ_CONTROL = 0x00020000
FILE_SHARE_WRITE = 0x00000002
TOKEN_QUERY = 0x0008
ERROR_NO_TOKEN = 1008
ERROR_INSUFFICIENT_BUFFER = 122
OWNER_SECURITY_INFORMATION = 0x00000001
DACL_SECURITY_INFORMATION = 0x00000004
SE_FILE_OBJECT = 1
INHERIT_ONLY_ACE = 0x08
MAX_TREE_ENTRIES = 4096
MAX_TREE_DEPTH = 64
MAX_ACES = 512
_PIN_ACCESS = READ_CONTROL | fs.FILE_READ_ATTRIBUTES | fs.FILE_READ_DATA
_ALL_FILE_RIGHTS = 0x001F01FF
_MUTATION = 0x000D0156
_ANCESTOR_MUTATION = 0x000D0152
_TRUSTED_INSTALLER = "S-1-5-80-956008885-3418522649-1831038044-1853292631-2271478464"
_OWNER_RIGHTS_SID = bytes.fromhex("010100000000000304000000")  # S-1-3-4


class WindowsMaintenanceError(fs.WindowsScanError):
    """A bounded OS-proof failure; never includes a path, SID, or payload."""


@dataclass(frozen=True, slots=True)
class _Ace:
    kind: int
    flags: int
    mask: int
    sid: bytes


def _mapped_mask(mask: int) -> int:
    mapped = mask & 0x0FFFFFFF
    for generic, specific in (
        (0x80000000, 0x00120089),
        (0x40000000, 0x00120116),
        (0x20000000, 0x001200A0),
        (0x10000000, _ALL_FILE_RIGHTS),
    ):
        if mask & generic:
            mapped |= specific
    if mapped & ~_ALL_FILE_RIGHTS:
        raise WindowsMaintenanceError("acl_uninterpretable")
    return mapped


def _validate_descriptor(
    owner: bytes,
    aces: tuple[_Ace, ...],
    operator: bytes,
    system: bytes,
    administrators: bytes,
    trusted_installer: bytes,
    *,
    role: str,
    directory: bool,
) -> None:
    trusted = {operator, system, administrators}
    owners = trusted | ({trusted_installer} if role == "ancestor" else set())
    if owner not in owners:
        raise WindowsMaintenanceError("untrusted_owner")
    for ace in aces:
        if ace.kind not in {0, 1} or ace.flags & ~0x1F:
            raise WindowsMaintenanceError("acl_uninterpretable")
        mask = _mapped_mask(ace.mask)
        # Deny ACEs never grant authority. Do not rely on a deny to compensate
        # for a dangerous outsider allow ACE or noncanonical ACL ordering.
        if ace.kind == 1:
            continue
        if ace.flags & INHERIT_ONLY_ACE and (role == "ancestor" or not directory):
            continue
        forbidden = _ANCESTOR_MUTATION if role == "ancestor" else _MUTATION
        if role == "data":
            forbidden |= 0x0001 | 0x0008  # contents/listing and extended attributes
        # OWNER_RIGHTS represents this descriptor's verified owner. It is not
        # a permanently privileged SID and must never stand in for a foreign
        # owner. The exact binary SID avoids wildcard authority matching.
        owner_rights = ace.sid == _OWNER_RIGHTS_SID and owner in owners
        if ace.sid not in trusted and not owner_rights and mask & forbidden:
            raise WindowsMaintenanceError("untrusted_access")


class _SecurityNative(fs._Native):
    def __init__(self) -> None:
        super().__init__()
        try:
            self.security = ctypes.WinDLL("advapi32", use_last_error=True)
            prototypes = (
                (self.dll, "GetCurrentProcess", [], wintypes.HANDLE),
                (self.dll, "GetCurrentThread", [], wintypes.HANDLE),
                (self.dll, "LocalFree", [ctypes.c_void_p], ctypes.c_void_p),
                (
                    self.dll,
                    "GetFinalPathNameByHandleW",
                    [wintypes.HANDLE, wintypes.LPWSTR, wintypes.DWORD, wintypes.DWORD],
                    wintypes.DWORD,
                ),
                (
                    self.security,
                    "OpenProcessToken",
                    [wintypes.HANDLE, wintypes.DWORD, ctypes.POINTER(wintypes.HANDLE)],
                    wintypes.BOOL,
                ),
                (
                    self.security,
                    "OpenThreadToken",
                    [
                        wintypes.HANDLE,
                        wintypes.DWORD,
                        wintypes.BOOL,
                        ctypes.POINTER(wintypes.HANDLE),
                    ],
                    wintypes.BOOL,
                ),
                (
                    self.security,
                    "GetTokenInformation",
                    [
                        wintypes.HANDLE,
                        ctypes.c_int,
                        ctypes.c_void_p,
                        wintypes.DWORD,
                        ctypes.POINTER(wintypes.DWORD),
                    ],
                    wintypes.BOOL,
                ),
                (
                    self.security,
                    "GetSecurityInfo",
                    [
                        wintypes.HANDLE,
                        ctypes.c_int,
                        wintypes.DWORD,
                        ctypes.POINTER(ctypes.c_void_p),
                        ctypes.c_void_p,
                        ctypes.POINTER(ctypes.c_void_p),
                        ctypes.c_void_p,
                        ctypes.POINTER(ctypes.c_void_p),
                    ],
                    wintypes.DWORD,
                ),
                (
                    self.security,
                    "IsValidSecurityDescriptor",
                    [ctypes.c_void_p],
                    wintypes.BOOL,
                ),
                (self.security, "IsValidAcl", [ctypes.c_void_p], wintypes.BOOL),
                (self.security, "IsValidSid", [ctypes.c_void_p], wintypes.BOOL),
                (self.security, "GetLengthSid", [ctypes.c_void_p], wintypes.DWORD),
                (
                    self.security,
                    "ConvertStringSidToSidW",
                    [wintypes.LPCWSTR, ctypes.POINTER(ctypes.c_void_p)],
                    wintypes.BOOL,
                ),
            )
            for dll, name, arguments, result in prototypes:
                function = getattr(dll, name)
                function.argtypes = arguments
                function.restype = result
                setattr(self, name, function)
        except (AttributeError, OSError):
            raise WindowsMaintenanceError("unsupported_environment") from None

    def _free(self, allocation: ctypes.c_void_p) -> None:
        if allocation.value and self.LocalFree(allocation):
            raise WindowsMaintenanceError("security_cleanup_failed")

    def _sid(self, pointer: int) -> bytes:
        if not pointer or not self.IsValidSid(ctypes.c_void_p(pointer)):
            raise WindowsMaintenanceError("identity_unavailable")
        size = int(self.GetLengthSid(ctypes.c_void_p(pointer)))
        if not 8 <= size <= 68:
            raise WindowsMaintenanceError("identity_unavailable")
        return ctypes.string_at(pointer, size)

    def _fixed_sid(self, text: str) -> bytes:
        allocation = ctypes.c_void_p()
        try:
            if not self.ConvertStringSidToSidW(text, ctypes.byref(allocation)):
                raise WindowsMaintenanceError("identity_unavailable")
            return self._sid(allocation.value)
        finally:
            self._free(allocation)

    def operator(self) -> bytes:
        thread = wintypes.HANDLE()
        if self.OpenThreadToken(
            self.GetCurrentThread(), TOKEN_QUERY, True, ctypes.byref(thread)
        ):
            with fs._Handle(self, int(thread.value)):
                raise WindowsMaintenanceError("impersonation_rejected")
        if self.last_error() != ERROR_NO_TOKEN:
            raise WindowsMaintenanceError("identity_unavailable")
        process = wintypes.HANDLE()
        if not self.OpenProcessToken(
            self.GetCurrentProcess(), TOKEN_QUERY, ctypes.byref(process)
        ):
            raise WindowsMaintenanceError("identity_unavailable")
        with fs._Handle(self, int(process.value)) as token:
            token_type, returned = wintypes.DWORD(), wintypes.DWORD()
            if (
                not self.GetTokenInformation(
                    wintypes.HANDLE(token.value),
                    8,
                    ctypes.byref(token_type),
                    ctypes.sizeof(token_type),
                    ctypes.byref(returned),
                )
                or returned.value != 4
                or token_type.value != 1
            ):
                raise WindowsMaintenanceError("identity_unavailable")
            required = wintypes.DWORD()
            if (
                self.GetTokenInformation(
                    wintypes.HANDLE(token.value), 1, None, 0, ctypes.byref(required)
                )
                or self.last_error() != ERROR_INSUFFICIENT_BUFFER
                or not 16 <= required.value <= 256
            ):
                raise WindowsMaintenanceError("identity_unavailable")
            buffer = ctypes.create_string_buffer(required.value)
            if not self.GetTokenInformation(
                wintypes.HANDLE(token.value),
                1,
                buffer,
                len(buffer),
                ctypes.byref(returned),
            ) or returned.value != len(buffer):
                raise WindowsMaintenanceError("identity_unavailable")
            sid = ctypes.c_void_p.from_buffer(buffer).value
            base = ctypes.addressof(buffer)
            if sid is None or not base <= sid <= base + len(buffer) - 8:
                raise WindowsMaintenanceError("identity_unavailable")
            sid_header = ctypes.string_at(sid, 8)
            if (
                sid_header[0] != 1
                or sid_header[1] > 15
                or sid + 8 + 4 * sid_header[1] > base + len(buffer)
            ):
                raise WindowsMaintenanceError("identity_unavailable")
            value = self._sid(sid)
            if sid + len(value) > base + len(buffer):
                raise WindowsMaintenanceError("identity_unavailable")
            return value

    def descriptor(self, handle: fs._Handle) -> tuple[bytes, tuple[_Ace, ...]]:
        owner, acl, descriptor = ctypes.c_void_p(), ctypes.c_void_p(), ctypes.c_void_p()
        try:
            result = self.GetSecurityInfo(
                wintypes.HANDLE(handle.value),
                SE_FILE_OBJECT,
                OWNER_SECURITY_INFORMATION | DACL_SECURITY_INFORMATION,
                ctypes.byref(owner),
                None,
                ctypes.byref(acl),
                None,
                ctypes.byref(descriptor),
            )
            if (
                result
                or not descriptor.value
                or not self.IsValidSecurityDescriptor(descriptor)
                or not acl.value
                or not self.IsValidAcl(acl)
            ):
                raise WindowsMaintenanceError("acl_unavailable")
            owner_bytes = self._sid(owner.value)
            header = ctypes.string_at(acl.value, 8)
            revision, _, size, count, reserved = struct.unpack("<BBHHH", header)
            if (
                revision not in {2, 4}
                or reserved
                or not 8 <= size <= 65535
                or count > MAX_ACES
            ):
                raise WindowsMaintenanceError("acl_uninterpretable")
            raw = ctypes.string_at(acl.value, size)
            offset, aces = 8, []
            for _ in range(count):
                if offset + 8 > size:
                    raise WindowsMaintenanceError("acl_uninterpretable")
                kind, flags, length, mask = struct.unpack_from("<BBHI", raw, offset)
                if (
                    kind not in {0, 1}
                    or length < 16
                    or length % 4
                    or offset + length > size
                ):
                    raise WindowsMaintenanceError("acl_uninterpretable")
                sid_pointer = acl.value + offset + 8
                sid_header = raw[offset + 8 : offset + 16]
                if (
                    sid_header[0] != 1
                    or sid_header[1] > 15
                    or 8 + 4 * sid_header[1] != length - 8
                ):
                    raise WindowsMaintenanceError("acl_uninterpretable")
                sid = self._sid(sid_pointer)
                if len(sid) != length - 8:
                    raise WindowsMaintenanceError("acl_uninterpretable")
                aces.append(_Ace(kind, flags, mask, sid))
                offset += length
            return owner_bytes, tuple(aces)
        finally:
            self._free(descriptor)

    def final_path(self, handle: fs._Handle) -> str:
        capacity = 256
        while capacity <= fs.MAX_WINDOWS_PATH_UNITS + 1:
            buffer = ctypes.create_unicode_buffer(capacity)
            length = int(
                self.GetFinalPathNameByHandleW(
                    wintypes.HANDLE(handle.value), buffer, capacity, 1
                )
            )
            if not length:
                raise WindowsMaintenanceError("identity_unavailable")
            if length < capacity:
                return buffer.value
            capacity = length + 1
        raise WindowsMaintenanceError("unsupported_environment")
