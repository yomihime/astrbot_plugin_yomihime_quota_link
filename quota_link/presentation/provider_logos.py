"""Bundled, hash-verified provider logos; no network or SVG runtime parser.

importlib.resources supports both extracted installations and ZIP imports. The
fixed provider allowlist is the sole filename selector; raw account values,
URLs and user-supplied paths are never used by command rendering.
"""

from hashlib import sha256
from importlib.resources import files

LOGO_SHA256 = {
    "deepseek": "22439dedcbbac97acbffd8e952e35203d7670f1d224572300e6a880972af0f03",
    "alibaba_bailian": "3a7fe7ef77d648661ce6cda98ac9b815c1f273286faf607c703e2743124a0c1d",
    "grsai": "9d4cd0d4f1564ef7f4c6303231b936a42aeddb0e2eed5cd967f5cbe5f3368f5c",
    "meinianda": "a0e656134eeb3ed104f5c2c76211c5ea036006bf762f7cfcbf155010b917bc1d",
    "openai_compatible": "7850cf836a4602ae51a50e4ca32970fcd1608f923002a0a615d253bc423ed9f8",
}


def load_logo(provider: str | None, assets=None) -> bytes | None:
    """Allowlisted local branding only; missing/unverified assets stay optional."""
    if type(provider) is not str or provider not in LOGO_SHA256:
        return None
    try:
        root = (
            assets
            if assets is not None
            else files(__package__).joinpath("assets", "provider_logos")
        )
        with root.joinpath("png-128", f"{provider}.png").open("rb") as stream:
            content = stream.read(131073)
        if sha256(content).hexdigest() == LOGO_SHA256[provider]:
            return content
    except Exception:
        pass
    return None
