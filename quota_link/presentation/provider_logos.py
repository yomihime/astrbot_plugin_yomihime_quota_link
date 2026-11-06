"""Allowlisted bundled provider PNGs. No network, user paths or SVG runtime parser."""

from hashlib import sha256
from importlib.resources import files

LOGO_SHA256 = {
    "deepseek": "22439dedcbbac97acbffd8e952e35203d7670f1d224572300e6a880972af0f03",
    "alibaba_bailian": "3a7fe7ef77d648661ce6cda98ac9b815c1f273286faf607c703e2743124a0c1d",
    "grsai": "9d4cd0d4f1564ef7f4c6303231b936a42aeddb0e2eed5cd967f5cbe5f3368f5c",
    "meinianda": "a0e656134eeb3ed104f5c2c76211c5ea036006bf762f7cfcbf155010b917bc1d",
    "openai_compatible": "7850cf836a4602ae51a50e4ca32970fcd1608f923002a0a615d253bc423ed9f8",
    "moonshot": "97fffdb319a648ea069325dbe4db24a17a820eb3c1b8c20d65f496249a834108",
    "openrouter": "8e83605318ddb5ded8e83526f724e8bf9b16e026e583e7ac084746a8bd0cbea7",
    "novita": "457c2d4ae28df42bcd7922ec001e46ecc04b3755938a4ee78ff82243b37ad6a0",
    "venice": "d55ae42571f4ef2013bae2586b350228cc5a744dce10c48abc84892adb47e24a",
    "vercel_gateway": "18aa691e39c45c7be7c5ca7bc02464a9868df2556634f561354760b7e54a2515",
    "new_api": "009df4fb78dc13aa81403853c165fd853d48d2c05443f4b3509d8f504d69211f",
    "sub2api": "efbedb2eb582ea62253274e7e2bd18dfb31da6025915dc69080dd5521e895c05",
    "glm_plan_global": "fabe7abb1b6980cdf089b039cbe6d763c4dfbd3dc96f602ee62bc8cb78bb941d",
    "pollinations": "b51b029c09802819104de2229879011e7d383f9fc63389456d227f3e64a40f8d",
}
LOGO_ASSETS = {
    "deepseek": "deepseek",
    "alibaba_bailian": "alibaba_bailian",
    "grsai": "grsai",
    "meinianda": "meinianda",
    "openai_compatible": "openai_compatible",
    "moonshot": "moonshot",
    "openrouter": "openrouter",
    "novita": "novita",
    "venice": "venice",
    "vercel_gateway": "vercel_gateway",
    "new_api": "new_api",
    "sub2api": "sub2api",
    "glm_plan_global": "glm_plan_global",
    "pollinations": "pollinations",
    "stepfun": "openai_compatible",
    "minimax_plan": "openai_compatible",
    "xai": "openai_compatible",
    "glm_plan": "openai_compatible",
}


def select_logo_key(
    provider: str, service_profile: str = "generic", region: str = "china"
) -> str:
    """Select by configured adapter/region, never by user labels or endpoint URLs."""
    if provider == "openai_compatible" and service_profile == "grsai":
        return "grsai"
    if provider == "glm_plan" and region == "global":
        return "glm_plan_global"
    return provider


def load_logo(provider: str | None, assets=None) -> bytes | None:
    """Read one fixed asset; explicitly unresolved brands use the generic symbol."""
    if type(provider) is not str or provider not in LOGO_ASSETS:
        return None
    key = LOGO_ASSETS[provider]
    try:
        root = (
            assets
            if assets is not None
            else files(__package__).joinpath("assets", "provider_logos")
        )
        with root.joinpath("png-128", f"{key}.png").open("rb") as stream:
            content = stream.read(131073)
        if sha256(content).hexdigest() == LOGO_SHA256[key]:
            return content
    except Exception:
        pass
    return None
