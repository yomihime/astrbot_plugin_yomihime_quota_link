"""Build and validate a persona notice without exposing its values to the model."""

from __future__ import annotations

import re
import unicodedata
from collections.abc import Mapping

_FIELDS = ("account", "metric", "balance", "threshold")
_TOKEN = re.compile(r"<yql\.(?:[1-9][0-9]*\.)?(?:account|metric|balance|threshold)>")
_SLOT_MARKERS = {
    "account": "\x04",
    "metric": "\x01",
    "balance": "\x02",
    "threshold": "\x03",
}
_PARAGRAPH = re.compile(r"\n(?:[^\S\n]*\n)+")
_HORIZONTAL_SPACE = re.compile(r"[^\S\n]{2,}|\t")
_PAYLOAD = re.compile(
    r"[<>@{}]|\[\s*cq\s*:|\[[^\]]*\]\s*\(|&#?\w+;"
    r"|[a-z][a-z0-9+.-]*://|(?:https?|mailto|javascript|data):"
    r"|\b(?:[a-z0-9-]+\.)+[a-z]{2,63}\b"
    r"|yql\.(?:[a-z]|\d)|\b(?:tool_calls?|function_call|tools_call_name)\b",
    re.I,
)
_FINANCE = re.compile(
    r"\x01|余额|餘額|残高|额度|額度|积分|積分|點數|阈值|門檻|しきい値|クォータ|クレジット|ポイント"
    r"|\b(?:balance|quota|credits?|threshold|limit)\b|还剩|還剩|剩余|剩餘|只剩|仅剩|僅剩",
    re.I,
)
_CJK_NUMBER = (
    r"[零〇一二两兩三四五六七八九十百千万萬亿億壹貳贰参參叁肆伍陸陆柒捌玖拾佰仟]+"
)
_UNIT = re.compile(
    r"[¥￥$€£%‰]|人民币|人民幣|美元|米ドル|欧元|歐元|ユーロ|日元|日圓|英镑|英鎊|港币|港幣"
    r"|新台币|新臺幣|(?:单位|單位|币种|幣別|単位|通貨)\s*(?:为|為|是|は|[:：=])"
    r"|\b(?:USD|CNY|RMB|JPY|EUR|GBP|HKD|TWD|CAD|AUD|CHF|INR|SGD|KRW|NZD|ZAR|THB"
    r"|MYR|VND|IDR|PHP|MOP|AED|SAR|RUB|TRY|BRL|MXN|SEK|NOK|DKK|PLN"
    r"|dollars?|yuan|yen|euros?|pounds?|site_credits?|quota_points?|tokens?"
    r"|baht|won|rupees?|ringgit|pesos?|rubles?"
    r"|percent|(?:currency|unit)\s*(?:is\b|[:=]))\b",
    re.I,
)
_VALUE_WITH_UNIT = re.compile(
    rf"(?:[\x02\x03]|\d+(?:\.\d+)?|{_CJK_NUMBER})\s*\(?\s*(?:元|円|ドル|[块塊毛分](?:[钱錢]|(?=$|[\s。,.!?]|啦|了|哦))"
    r"|积分|積分|點數|点数|額度點|额度点|ポイント|クレジット|\b(?:credits?|points?)\b)"
    r"|[\x02\x03]\s*\(?\s*[点點]"
    r"|[\x02\x03]\s*\(?\s*(?-i:[A-Z]{3,4})\b",
    re.I,
)
_NUMERIC_CURRENCY = re.compile(
    r"\d\s*(?:USD|CNY|RMB|JPY|EUR|GBP|HKD|TWD|CAD|AUD|CHF|INR|SGD|KRW|NZD|ZAR|THB"
    r"|MYR|VND|IDR|PHP|MOP|AED|SAR|RUB|TRY|BRL|MXN|SEK|NOK|DKK|PLN)(?![a-z])",
    re.I,
)
_UNIT_CLAIM = re.compile(
    rf"(?:[\x02\x03]|\d)\s*\(?\s*(?:{_UNIT.pattern})"
    rf"|(?:{_UNIT.pattern})\s*(?:[\x02\x03]|[+−-]?\d)"
    r"|(?:单位|單位|币种|幣別|単位|通貨)\s*(?:为|為|是|は|[:：=])"
    r"|\b(?:currency|unit)\s*(?:is\b|[:=])"
    rf"|(?:{_FINANCE.pattern})\s+(?:(?:is\s+)?(?:in|denominated in|measured in))\s+(?:{_UNIT.pattern})",
    re.I,
)
_THRESHOLD_LABEL = (
    r"\b(?:threshold|(?:alert|reminder|warning) (?:limit|level|line|trigger)|limit)\b"
    r"|(?:[阈閾]值|[门門][槛檻]|提醒[线線]|警戒[线線]|しきい値|閾値|(?:通知|警告)の目安)"
)
_CURRENT_LABEL = (
    r"\x01|\b(?:balance|remaining (?:quota|credits?)|current (?:amount|value|level))\b"
    r"|(?:[余餘]额|餘額|[额額]度|剩[余餘]|残高|残り)"
)
_LABEL_CONNECTOR = (
    r"\s*(?:(?:is|was|of|at|(?:is )?(?:set|configured) (?:to|at)|has reached)\b\s*"
    r"|(?:设置在|設在|设在|設定は|设为|設為|是|[为為]|在|还剩|還剩|は|が|を|[:=])\s*)?"
)
_SWAPPED_ROLE = re.compile(
    rf"(?:{_THRESHOLD_LABEL}){_LABEL_CONNECTOR}\x02"
    rf"|(?:{_CURRENT_LABEL}){_LABEL_CONNECTOR}\x03"
    rf"|\x02\s*(?:(?:is|was|as)\s+(?:the|its|your)\s+|(?:是|為|为|が|は)\s*)(?:{_THRESHOLD_LABEL})"
    rf"|\x03\s*(?:(?:is|was|as)\s+(?:the|its|your)\s+|(?:是|為|为|が|は)\s*)(?:{_CURRENT_LABEL})"
    r"|(?:\b(?:now|exactly|precisely|currently|equals?|equal to)\s+"
    r"|(?:目前|现在|現在|恰好|刚好|剛好|等[于於]|ちょうど)\s*(?:是|为|為)?)\x03"
    r"|\x03\s+(?:now|currently|remaining|left)\b",
    re.I,
)
_UNLABELED_VALUES = re.compile(
    r"\x02[\s,:;()]+\x03|\x03[\s,:;()]+\x02|\x02\x03|\x03\x02"
)
_INVALID_VALUE_COMPARISON = re.compile(
    r"\x02\s*(?:=+|≡|is\s+(?:right\s+)?at)\s*\x03"
    r"|\x03\s*(?:=+|≡|is\s+(?:right\s+)?at|[≤≦⩽])\s*\x02",
    re.I,
)
# Match financial assertions, not isolated words such as "negative", "closed",
# or "restored", which are also ordinary persona language. This is a guard for
# common mistakes, not a semantic proof for arbitrary natural language.
_CLAIM_SUBJECT = (
    rf"[\x01-\x04]|{_CURRENT_LABEL}|{_THRESHOLD_LABEL}"
    r"|\b(?:account|subscription|plan|service)\b"
    r"|账户|帳戶|賬戶|订阅|訂閱|套餐|计划|計畫|服务|服務|サービス|サブスクリプション|クレジット"
)
_CLAIM_STATE = (
    r"为负|為負|负[数值]|負[數值]|小[于於]零|等[于於]零|归零|歸零|为零|為零|见底|見底|耗[光尽盡]|用[光尽盡完]|欠费|欠費|透支"
    r"|空|(?:没有|沒有|已無|已无)(?:任何|剩餘|剩余)*(?:余额|餘額|额度|額度)"
    r"|停[服用止]|禁用|封禁|中断|中斷|不可用|可正常使用|恢复|恢復|可以继续使用|可以繼續使用|正常运行|正常運行|过期|過期|到期|失效|取消|终止|終止"
    r"|マイナス|ゼロ|ありません|残ってい(?:ない|ません)|な(?:い|くな)|使い切|底をつ|利用(?:でき|不可|可能)|無効|再開|復旧|有効期限(?:切れ|が切れ)|期限(?:が)?切れ|失効"
    r"|上回|より(?:高|上|多)|高[于於]|超[过過]|大[于於]|多[于於]|未达(?:到)?阈值|未達(?:到)?門檻"
    r"|\b(?:negative|zero|empty|depleted|exhausted|overdrawn|ran out|run out|used up"
    r"|unavailable|disabled|suspended|blocked|closed|restored|stopped|expired|terminated"
    r"|cancelled|canceled|operational|active|available|working|down|continue (?:using|to use)"
    r"|exceeds?|(?:higher|greater|more|larger)\s+than)\b"
)
_UNSUPPORTED_CLAIM = re.compile(
    rf"(?:{_CLAIM_SUBJECT})\s*(?:(?:is|are|has|have|was|were|been|became|remains|still|now|already|completely|entirely)\b\s*"
    rf"|已经|已經|现在|現在|目前|变成|變成|已|是|的|の|が|は|を|[:：]\s*)*(?:{_CLAIM_STATE})"
    r"|(?:已经?|已經)(?:替|帮|幫|为|為)(?:你|您)[^,，。;；\n!?！？]{0,12}(?:更新|调整|調整|修改)"
    r"|\b(?:updated|reset|changed) (?:your|the) (?:alert|threshold|account)\b"
    r"|[\x02\x03]\s*[≥≧⩾]",
    re.I,
)

# A suggestion is not evidence of a payment or of a service restriction.
_PAYMENT = r"(?:充值|儲值|付款|支付|缴费|繳費|转账|轉帳|汇款|匯款|入金|支払い|振込|課金|チャージ)"
_PAYMENT_CLAIM = re.compile(
    rf"(?:已|已经|已經|替你|帮你|幫你|替您|帮您|幫您|必须|必須|务必|務必)[^,，。;；\n!?！？]{{0,12}}{_PAYMENT}"
    rf"|{_PAYMENT}[^,，。;；\n!?！？]{{0,8}}(?:成功|完成|済|完了|才能|才可|方可|即可恢复|即可恢復)"
    rf"|{_PAYMENT}[^,，。;；\n!?！？]{{0,8}}[后後][^,，。;；\n!?！？]{{0,8}}(?:继续|繼續|使用)"
    rf"|不{_PAYMENT}[^,，。;；\n!?！？]{{0,8}}(?:停服|停用|不可用)"
    r"|(?:选择|選擇)(?:支付|付款)方式|(?:确认|確認)(?:支付|付款)"
    r"|\b(?:paid|recharged|topped\s+up)\s+(?:(?:your|the|this|my|an?)\s+)?(?:(?:account|balance|wallet|invoice|bill|subscription|plan)\b|\x04)"
    r"|\b(?:account|balance|wallet|invoice|bill|subscription|plan)\s+(?:(?:is|was|has|been|already)\s+)*(?:paid|recharged|topped\s+up)\b"
    r"|\btransferred\s+(?:money|funds)\b"
    r"|\b(?:payment|recharge|top[ -]?up|transfer)\s+(?:is\s+|was\s+)?(?:successful|completed|confirmed|required)\b"
    r"|\b(?:must|need to|have to|will|shall|already)\s+(?:pay|recharge|top[ -]?up|transfer)\b"
    r"|\b(?:pay|recharge|top[ -]?up)[^,，。;；\n!?！？]{0,30}(?:to continue|to restore|before you can|before continuing)\b",
    re.I,
)
_COUNT_WORDS = dict(
    zip(
        (
            "zero",
            "one",
            "two",
            "three",
            "four",
            "five",
            "six",
            "seven",
            "eight",
            "nine",
            "ten",
            "eleven",
            "twelve",
            "thirteen",
            "fourteen",
            "fifteen",
            "sixteen",
            "seventeen",
            "eighteen",
            "nineteen",
        ),
        range(20),
        strict=True,
    )
)
for _tens, _value in zip(
    ("twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"),
    range(20, 100, 10),
    strict=True,
):
    _COUNT_WORDS[_tens] = _value
    for _unit, _number in tuple(_COUNT_WORDS.items()):
        if 0 < _number < 10:
            _COUNT_WORDS[f"{_tens} {_unit}"] = _value + _number
_EN_NUMBER_WORD = (
    r"(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve"
    r"|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen"
    r"|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety"
    r"|hundred|thousand|million|billion|trillion)"
)
_WRITTEN_UNIT = re.compile(
    rf"(?:\b{_EN_NUMBER_WORD}(?:[ -]+{_EN_NUMBER_WORD})*|{_CJK_NUMBER})\s*(?:{_UNIT.pattern})",
    re.I,
)
_COUNT_WORDS.update(dict(zip("零一二三四五六七八九十", range(11), strict=True)))
_COUNT_WORDS.update({"两": 2, "兩": 2})
# Consume the whole quantity even when its notation is unsupported. Otherwise
# "one hundred" or "1e2" could be mistaken for the leading, valid count of one.
_COUNT_LITERAL = (
    r"[+−-]?(?:\d+(?:[.,/]\d+|\s+\d{3}(?!\d))*|[.,]\d+)"
    r"(?:[a-z][a-z0-9+−-]*)?"
    r"(?:[百千万萬亿億]+|\s+(?:hundred|thousand|million|billion|trillion|dozen))?"
)
_COUNT_CJK = (
    r"[零〇一二两兩三四五六七八九十百千万萬亿億壹貳贰参參叁肆伍陸陆柒捌玖拾佰仟半]+"
)
_ACCOUNT_COUNT = re.compile(
    rf"(?<![\w.+−-])(?P<en>{_COUNT_LITERAL}|{_EN_NUMBER_WORD}(?:[ -]+(?:and[ -]+)?{_EN_NUMBER_WORD})*)\s+accounts?\b"
    rf"|(?<![\d.+−-])(?P<cjk>{_COUNT_LITERAL}|{_COUNT_CJK})\s*(?:个|個)?(?:账户|帳戶|賬戶)"
    rf"|(?<![\d.+−-])(?P<jp>{_COUNT_LITERAL}|{_COUNT_CJK})\s*(?:つ|件)のアカウント",
    re.I,
)
_ACCOUNT_COUNT_REVERSED = re.compile(
    r"(?:账户|帳戶|賬戶)\s*(?:(?:的)?(?:数量|數量)\s*(?:是|为|為|[:：])?|共有|共计|共計|总共|總共|合计|合計|共|[:：])\s*"
    rf"(?P<cjk>{_COUNT_LITERAL}|{_COUNT_CJK})"
    r"|\b(?:number of accounts?|account count|accounts?(?:\s+(?:count|total))?)\s*"
    r"(?:[:=]|(?:is|are|totals?)\b)\s*"
    rf"(?P<en>{_COUNT_LITERAL}|{_EN_NUMBER_WORD}(?:[ -]+(?:and[ -]+)?{_EN_NUMBER_WORD})*)(?![\w-]|\.\d)",
    re.I,
)
_ORDINAL_ACCOUNT = re.compile(
    rf"第\s*(?P<cjk>{_COUNT_LITERAL}|{_COUNT_CJK})\s*(?:个|個)?(?:账户|帳戶|賬戶)",
    re.I,
)
_PAYMENT_TOPIC = re.compile(
    rf"{_PAYMENT}|\b(?:pay|payment|recharg\w*|top[ -]?up|topping up|transfer)\b", re.I
)
_AMOUNT_ASSERTION = re.compile(
    rf"(?:{_FINANCE.pattern}|{_PAYMENT_TOPIC.pattern})\s*"
    r"(?:(?:is|was|of|at|now|currently|remaining|left|about|only|approximately|equals?|to)\b\s*"
    r"|还剩|還剩|还有|還有|只剩|仅剩|僅剩|剩余|剩餘|现有|現有|现在|現在|目前|大约|大約|大概|至少|最多|为|為|是|约|約|は|[:：=]\s*)*"
    rf"(?:[+−-]?\d|\.\d|{_CJK_NUMBER}(?![\u3400-\u9fff])|\b{_EN_NUMBER_WORD}\b)",
    re.I,
)
_PAYMENT_QUANTITY = re.compile(
    rf"{_PAYMENT}\s*(?:(?:大?约|大?約|大概|至少|最多)\s*)?{_CJK_NUMBER}"
    r"(?=$|[\s。,.!?！？;；，]|就|左右|即可)"
)
_DURATION = re.compile(
    rf"\b(?:\d+|{_EN_NUMBER_WORD})\s+(?:seconds?|minutes?|hours?|days?|weeks?)\b"
    rf"|(?:\d+|{_CJK_NUMBER})\s*(?:秒钟|秒鐘|分钟|分鐘|小时|小時|天|秒|分|時間)",
    re.I,
)
_SCOPED_VALUE_CLAIM = re.compile(
    rf"(?:{_CURRENT_LABEL}|\x04|\baccount\b)\s+(?:is|has become|became|remains)\s+"
    r"(?:(?:now|completely|entirely|totally|already|currently)\s+)*(?:empty|above)\b"
    rf"|\bempty\s+(?:{_CURRENT_LABEL}|\x04|account\b)"
    r"|[\x02\x03]\s+(?:is\s+)?above\s+[\x02\x03]",
    re.I,
)


def _checked_counts(prose: str, count: int) -> str | None:
    """Remove verified account counts before looking for invented amounts."""
    invalid = False

    def replace(match: re.Match[str], *, ordinal: bool = False) -> str:
        nonlocal invalid
        word = next(value for value in match.groups() if value is not None).lower()
        number = (
            int(word)
            if word.isascii() and word.isdigit()
            else _COUNT_WORDS.get(re.sub(r"[ -]+", " ", word))
        )
        invalid |= (
            number is None or not 1 <= number <= count if ordinal else number != count
        )
        return "accounts"

    # "The first account" identifies one row; it does not assert that the
    # entire notice has only one account. Consume its full ordinal first.
    result = _ORDINAL_ACCOUNT.sub(lambda match: replace(match, ordinal=True), prose)
    result = _ACCOUNT_COUNT.sub(replace, result)
    result = _ACCOUNT_COUNT_REVERSED.sub(replace, result)
    return None if invalid else result


def _tokens(count: int) -> tuple[tuple[str, ...], ...]:
    if count < 1:
        return ()
    prefixes = (
        ("yql",) if count == 1 else tuple(f"yql.{i}" for i in range(1, count + 1))
    )
    tokens = tuple(
        tuple(f"<{prefix}.{field}>" for field in _FIELDS) for prefix in prefixes
    )
    return tokens


def template_prompt(count: int) -> str:
    """Ask for the entire persona message using only anonymous fact slots."""
    tokens = _tokens(count)
    if not tokens:
        return ""
    schema = "\n".join(" ".join(row) for row in tokens)
    return (
        "Write the complete proactive low-quota notice as natural plain text in "
        "the selected persona. The monitored metric reached or fell below its "
        "configured alert threshold. Do not guess which of these applies. "
        "We know no account or service status. "
        "Work every placeholder into the message exactly once, unchanged. "
        "The account slot names the account, metric names the measured quantity, "
        "balance gives its current value, and threshold gives the configured trigger. "
        "Describe the balance as the measured value and the threshold as the "
        "configured alert level. Both value slots already include their unit. "
        "Do not invent names, values, units, conversions, depletion, outages, "
        "subscription or service status, completed payments or other actions. "
        "A gentle optional top-up suggestion is fine; do not claim payment is required. "
        f"You may mention that this notice covers {count} account(s). "
        "Do not output links, mentions, tool calls or executable payloads. "
        "Simple text emphasis or literal backtick quotes are fine. "
        "Keep each account's four placeholders associated with that account; "
        "finish its facts before moving to another account. "
        "You may use flowing prose, lines or lists, in any account or field order. "
        "Write the prose yourself using these slots:\n" + schema
    )


def _has_control(text: str, allowed: str) -> bool:
    return any(
        char not in allowed
        and unicodedata.category(char) in {"Cc", "Cf", "Cs", "Zl", "Zp"}
        for char in text
    )


def _unsafe_prose(prose: str, count: int) -> bool:
    """Reject common false claims in the supported locales."""
    checked = unicodedata.normalize("NFKC", prose).replace("\u200d", "")
    # Emphasis is literal transport text, not a boundary between a fact and
    # its label/unit. Inspect through it without altering the returned notice.
    checked = checked.replace("`", "").replace("*", "")
    checked = _checked_counts(checked, count)
    if checked is None:
        return True
    checked = re.sub(r"\b(?:pay(?:ing)?|paid)\s+attention\b", "", checked, flags=re.I)
    if (
        _UNSUPPORTED_CLAIM.search(checked)
        or _PAYMENT_CLAIM.search(checked)
        or _PAYMENT_QUANTITY.search(checked)
        or _SCOPED_VALUE_CLAIM.search(checked)
        or _UNIT_CLAIM.search(checked)
        or _WRITTEN_UNIT.search(checked)
        or _VALUE_WITH_UNIT.search(checked)
        or _NUMERIC_CURRENCY.search(checked)
        or _SWAPPED_ROLE.search(checked)
        or _UNLABELED_VALUES.search(checked)
        or _INVALID_VALUE_COMPARISON.search(checked)
        or any(unicodedata.category(char) == "Sc" for char in checked)
    ):
        return True
    # Only quantities asserted as financial values are suspect. A number
    # elsewhere in the same sentence can be ordinary advice or persona prose.
    return bool(_AMOUNT_ASSERTION.search(_DURATION.sub("time", checked)))


def render_notice(content: object, rows: tuple[Mapping[str, str], ...]) -> str:
    """Check a template before filling its slots once. Empty requests fallback."""
    if not isinstance(content, str):
        return ""
    normalized_newlines = content.replace("\r\n", "\n")
    text = normalized_newlines.strip()
    if not text or _has_control(normalized_newlines, "\n\t\u200d"):
        return ""
    groups = _tokens(len(rows))
    if not groups:
        return ""
    found = _TOKEN.findall(text)
    remaining = {frozenset(group) for group in groups}
    # Slot runs establish which account owns each fact without prescribing
    # paragraphs, punctuation, field order, or a fixed presentation template.
    # Interleaved account slots would make that association ambiguous.
    if len(found) != len(rows) * len(_FIELDS):
        return ""
    for start in range(0, len(found), len(_FIELDS)):
        group = frozenset(found[start : start + len(_FIELDS)])
        if group not in remaining:
            return ""
        remaining.remove(group)
    paragraphs = [
        _HORIZONTAL_SPACE.sub(" ", paragraph.strip())
        for paragraph in _PARAGRAPH.split(text)
    ]
    text = "\n\n".join(paragraphs)
    # Check what the template could assemble around a fact without using
    # the actual fact text, which is inserted as a literal after validation.
    payload_text = unicodedata.normalize("NFKC", _TOKEN.sub("slot", text)).replace(
        "\u200d", ""
    )
    payload_text = payload_text.replace("`", "").replace("*", "")
    if _PAYLOAD.search(payload_text):
        return ""
    # Distinct internal markers let the prose checks see which slot is used.
    prose = _TOKEN.sub(
        lambda match: _SLOT_MARKERS[match[0][:-1].rsplit(".", 1)[-1]], text
    )
    if _unsafe_prose(prose, len(rows)) or not any(char.isalpha() for char in prose):
        return ""
    if remaining:
        return ""
    replacements = {}
    for group, row in zip(groups, rows, strict=True):
        for token, field in zip(group, _FIELDS, strict=True):
            value = row.get(field)
            if (
                not isinstance(value, str)
                or not value.strip()
                or _has_control(value, "\u200d")
            ):
                return ""
            replacements[token] = value
    # A callback preserves literal backslashes and any slot-like account text.
    rendered = _TOKEN.sub(lambda match: replacements[match[0]], text)
    return rendered
