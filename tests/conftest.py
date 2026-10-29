"""Cross-platform synthetic filesystem fixtures; no existing ACLs are changed."""

import os
import stat
from pathlib import Path
from types import SimpleNamespace

import pytest


@pytest.fixture
def unsafe_link(monkeypatch):
    """Use real links when possible, real NTFS junctions for directories.

    A file symlink may require a privilege absent from Windows CI. In that
    case expose link metadata for just the synthetic placeholder via lstat;
    the target stays real and is checked unchanged by each caller.
    """
    original = Path.lstat
    simulated = set()

    def create(link, target, *, directory=False):
        try:
            link.symlink_to(target, target_is_directory=directory)
            return "symlink"
        except OSError as error:
            if os.name != "nt" or error.winerror != 1314:
                raise
        if directory:
            import _winapi

            _winapi.CreateJunction(str(target), str(link))
            assert link.is_junction()
            return "junction"
        # Keep valid target bytes: malformed placeholders could be rejected for
        # corruption even if the reparse check regressed.
        link.write_bytes(target.read_bytes())
        simulated.add(link)

        def link_lstat(path, *args, **kwargs):
            result = original(path, *args, **kwargs)
            if path in simulated:
                fields = {
                    name: getattr(result, name)
                    for name in dir(result)
                    if name.startswith("st_")
                }
                fields["st_mode"] = stat.S_IFLNK | 0o777
                fields["st_file_attributes"] = stat.FILE_ATTRIBUTE_REPARSE_POINT
                return SimpleNamespace(**fields)
            return result

        monkeypatch.setattr(Path, "lstat", link_lstat)
        from quota_link.security.windows import fs

        original_info = fs._get_info

        def reparse_info(native, handle):
            result = original_info(native, handle)
            final = native.final_path(handle).casefold()
            if any(
                final.endswith("\\" + str(path.relative_to(path.anchor)).casefold())
                for path in simulated
            ):
                result.dwFileAttributes |= fs.FILE_ATTRIBUTE_REPARSE_POINT
            return result

        monkeypatch.setattr(fs, "_get_info", reparse_info)
        return "simulated-file-symlink"

    return create
