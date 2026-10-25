# Adapted from Game Link cf755ed4ac455e8be48a9b99c285078cdb696510 (AGPL-3.0).
"""Bounded errors shared with the extracted native key-file guards."""


class ManagedKeyFileError(RuntimeError):
    def __init__(self, code: str = "key_file_unavailable") -> None:
        if code not in {"key_file_unavailable", "key_file_exists", "key_file_invalid"}:
            code = "key_file_unavailable"
        self.code = code
        super().__init__(code)
