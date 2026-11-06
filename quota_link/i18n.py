"""Resolve the plugin's shared Dashboard and Python string resources."""

import json
import re
from contextlib import contextmanager
from contextvars import ContextVar
from functools import lru_cache
from pathlib import Path
from zipimport import zipimporter

DEFAULT_LOCALE = "zh-CN"
SUPPORTED_LOCALES = (DEFAULT_LOCALE, "zh-TW", "ja-JP", "en-US")
LANGUAGE_OPTIONS = ("auto", *SUPPORTED_LOCALES)
_locale = ContextVar("yql_locale", default=DEFAULT_LOCALE)
_directory = Path(__file__).resolve().parents[1] / ".astrbot-plugin" / "i18n"
_placeholder = re.compile(r"\{([a-zA-Z_][a-zA-Z_0-9]*)\}")
_locale_tag = re.compile(
    r"(?P<language>[a-z]{2,3})(?:-(?P<script>[a-z]{4}))?"
    r"(?:-(?P<region>[a-z]{2}|[0-9]{3}))?(?:-[a-z0-9]{1,8})*"
)


def normalize_locale(value):
    if not isinstance(value, str) or len(value) > 32:
        return DEFAULT_LOCALE
    match = _locale_tag.fullmatch(value.strip().lower().replace("_", "-"))
    if match is None:
        return DEFAULT_LOCALE
    language, script, region = match["language"], match["script"], match["region"]
    if language == "zh" and (
        script == "hant" or script != "hans" and region in {"tw", "hk", "mo"}
    ):
        return "zh-TW"
    return {"en": "en-US", "ja": "ja-JP"}.get(language, DEFAULT_LOCALE)


def resolve_locale(override, host_locale=None):
    return override if override in SUPPORTED_LOCALES else normalize_locale(host_locale)


def event_locale(event):
    """AstrBot's WebChat puts the UI locale in the message's extra fields."""
    get_extra = getattr(event, "get_extra", None)
    return get_extra("locale") if callable(get_extra) else None


@contextmanager
def use_locale(locale):
    token = _locale.set(normalize_locale(locale))
    try:
        yield
    finally:
        _locale.reset(token)


def current_locale():
    return _locale.get()


@lru_cache(maxsize=len(SUPPORTED_LOCALES))
def _catalog(locale):
    path = _directory / f"{locale}.json"
    try:
        loader = __spec__.loader if __spec__ else None
        content = (
            loader.get_data(str(path))
            if isinstance(loader, zipimporter)
            else path.read_bytes()
        )
        document = json.loads(content)
        strings = document.get("strings") if isinstance(document, dict) else None
    except (OSError, ValueError):
        return {}
    return strings if isinstance(strings, dict) else {}


def _format(locale, string_id, values):
    template = _catalog(locale).get(string_id)
    if not isinstance(template, str) or not template.strip():
        template = _catalog(DEFAULT_LOCALE).get(string_id)
    if not isinstance(template, str):
        return string_id
    return _placeholder.sub(
        lambda match: (
            _render(values[match[1]], locale) if match[1] in values else match[0]
        ),
        template,
    )


class _Message(str):
    """A default-language string that can be resolved at a presentation boundary."""

    def __new__(cls, default, string_id=None, values=None):
        value = super().__new__(cls, default)
        value.string_id = string_id
        value.values = values
        return value


def message(string_id, **values):
    return _Message(_format(DEFAULT_LOCALE, string_id, values), string_id, values)


def _render(value, locale):
    if isinstance(value, _Message) and value.string_id is not None:
        return _format(locale, value.string_id, value.values)
    return str(value)


def render_text(value):
    return _render(value, _locale.get())


def tr(string_id, **values):
    return _format(_locale.get(), string_id, values)
