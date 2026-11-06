import json
import re
from collections import Counter
from pathlib import Path

from quota_link.i18n import (
    DEFAULT_LOCALE,
    SUPPORTED_LOCALES,
    message,
    render_text,
    use_locale,
)


def test_catalogs_have_the_same_string_ids_and_named_arguments():
    directory = Path(__file__).resolve().parents[1] / ".astrbot-plugin" / "i18n"
    pattern = re.compile(r"\{([a-zA-Z_][a-zA-Z_0-9]*)\}")

    def unique_object(pairs):
        result = dict(pairs)
        assert len(result) == len(pairs), pairs
        return result

    catalogs = {
        locale: json.loads(
            (directory / f"{locale}.json").read_bytes(), object_pairs_hook=unique_object
        )["strings"]
        for locale in SUPPORTED_LOCALES
    }
    baseline = catalogs[DEFAULT_LOCALE]
    for locale, catalog in catalogs.items():
        assert catalog.keys() == baseline.keys(), locale
        for key, translation in catalog.items():
            assert translation.strip(), (locale, key)
            assert Counter(pattern.findall(translation)) == Counter(
                pattern.findall(baseline[key])
            ), (locale, key)


def test_shared_query_message_uses_the_current_recipient_language():
    # The same error message can be reused by an in-flight query or a cooldown.
    with use_locale("en-US"):
        shared = message("query.cooldown_account", seconds=17)
        english = render_text(shared)
        with use_locale("ja-JP"):
            japanese = render_text(shared)
        assert render_text(shared) == english
    chinese = render_text(shared)
    assert all("17" in text for text in (english, japanese, chinese))
    assert "second" in english
    assert "秒" in japanese and "アカウント" in japanese
    assert "账户" in chinese
    assert len({english, japanese, chinese}) == 3
