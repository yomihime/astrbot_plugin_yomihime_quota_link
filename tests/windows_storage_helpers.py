"""Native Windows observation/fault injection, retaining real handles and ACLs."""


class _Call:
    def __init__(self, original, hook):
        object.__setattr__(self, "original", original)
        object.__setattr__(self, "hook", hook)

    def __call__(self, *args):
        return self.hook(self.original, *args)

    def __setattr__(self, name, value):
        setattr(self.original, name, value)


class _Dll:
    def __init__(self, original, hooks):
        self.original = original
        self.calls = {
            name: _Call(getattr(original, name), hook) for name, hook in hooks.items()
        }

    def __getattr__(self, name):
        return self.calls.get(name) or getattr(self.original, name)


def patch_native(monkeypatch, **hooks):
    from quota_link.security.windows import managed_key_io

    original = managed_key_io._SecurityNative

    def native():
        result = original()
        # Configure the real functions before wrapping; wrappers forward later
        # argtypes/restype assignments as well as all unaffected operations.
        managed_key_io._bindings(result)
        result.dll = _Dll(result.dll, hooks)
        return result

    monkeypatch.setattr(managed_key_io, "_SecurityNative", native)
    return lambda: monkeypatch.setattr(managed_key_io, "_SecurityNative", original)


def assert_private_file(path, data_root):
    from quota_link.security.windows import fs, managed_key_io
    from quota_link.security.windows.maintenance import READ_CONTROL

    with managed_key_io._pin(path.parent, data_root) as (
        native,
        parent,
        serial,
        operator,
        trusted,
        *_,
    ):
        value = fs._handle_value(
            native.CreateFileW(
                parent + "\\" + path.name,
                0x80000000 | READ_CONTROL | fs.FILE_READ_ATTRIBUTES,
                fs.FILE_SHARE_READ,
                None,
                fs.OPEN_EXISTING,
                fs.FILE_FLAG_OPEN_REPARSE_POINT,
                None,
            )
        )
        assert value is not None
        with fs._Handle(native, value) as handle:
            managed_key_io._file_check(
                native, handle, parent + "\\" + path.name, serial, operator, trusted
            )
            owner, aces = native.descriptor(handle)
            assert owner == operator
            allowed = {operator, trusted[0], trusted[1]}
            aces = managed_key_io._resolve_owner_rights(native, owner, aces, allowed)
            assert aces
            assert all(ace.kind != 0 or ace.sid in allowed for ace in aces)
            assert fs._get_info(native, handle).nNumberOfLinks == 1
