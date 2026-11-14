"""Compose persona notices with anonymous slots and literal local values."""

from __future__ import annotations

import re
from collections.abc import Mapping

_FIELDS = ("name", "balance")
_TOKEN = re.compile(r"<yql\.[1-9][0-9]*\.(?:name|balance)>")
_RESERVED = re.compile(r"<\s*yql\b|\byql\.", re.I)


def _tokens(count: int) -> tuple[tuple[str, ...], ...]:
    return tuple(
        tuple(f"<yql.{index}.{field}>" for field in _FIELDS)
        for index in range(1, count + 1)
    )


def template_prompt(count: int) -> str:
    """Ask for one combined notice; only anonymous slots reach the model."""
    if count < 1:
        return ""
    return (
        "These accounts have triggered low-balance alerts. "
        "Write one combined message in the selected persona, naturally reminding "
        "the user to pay attention to their low balances. "
        "Let the persona and its examples guide the language and style. "
        "Use every placeholder below exactly once, unchanged. "
        "Each numbered name slot identifies an account; its balance slot gives "
        "that account's current balance, including its unit. "
        "These values will be filled in locally. Arrange the message naturally:\n"
        + "\n".join(" ".join(group) for group in _tokens(count))
    )


def render_notice(content: object, rows: tuple[Mapping[str, str], ...]) -> str:
    """Check only slot integrity, then replace each slot once with local text."""
    if not isinstance(content, str) or not rows:
        return ""
    groups = _tokens(len(rows))
    expected = {token for group in groups for token in group}
    found = _TOKEN.findall(content)
    if len(found) != len(expected) or set(found) != expected:
        return ""
    # Any reserved reference left after removing valid slots is unknown or
    # malformed. Other prose is not interpreted or filtered.
    if _RESERVED.search(_TOKEN.sub("", content)):
        return ""
    replacements = {}
    for group, row in zip(groups, rows, strict=True):
        for token, field in zip(group, _FIELDS, strict=True):
            value = row.get(field)
            if not isinstance(value, str):
                return ""
            replacements[token] = value
    # A callback preserves backslashes and slot-like names as literal data;
    # inserted values are never parsed or replaced again.
    return _TOKEN.sub(lambda match: replacements[match[0]], content)
