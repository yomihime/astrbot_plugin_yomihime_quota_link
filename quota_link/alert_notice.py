"""Build and validate a persona notice without exposing its values to the model."""

from __future__ import annotations

import re
import unicodedata
from collections.abc import Mapping

_FIELDS = ("account", "metric", "balance", "threshold")
_MAX_LENGTH = 4096
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
    r"[<>`@{}]|\[\s*cq\s*:|\[[^\]]*\]\s*\(|&#?\w+;"
    r"|[a-z][a-z0-9+.-]*://|(?:https?|mailto|javascript|data):"
    r"|\b(?:[a-z0-9-]+\.)+[a-z]{2,63}\b"
    r"|yql\.(?:[a-z]|\d)|\b(?:tool_calls?|function_call|tools_call_name)\b",
    re.I,
)
_FINANCE = re.compile(
    r"[\x01\x02\x03]|余额|餘額|残高|额度|額度|积分|積分|點數|阈值|門檻|しきい値|クォータ|クレジット|ポイント"
    r"|\b(?:balance|quota|credits?|threshold|limit)\b|还剩|還剩|剩余|剩餘|只剩|仅剩|僅剩",
    re.I,
)
_CJK_NUMBER = (
    r"[零〇一二两兩三四五六七八九十百千万萬亿億壹貳贰参參叁肆伍陸陆柒捌玖拾佰仟]+"
)
_WRITTEN_AMOUNT = re.compile(
    rf"(?:还剩|還剩|还有|還有|只剩|仅剩|僅剩|剩余|剩餘|现有|現有|为|為|是|约|約|は|[:：=])"
    rf"\s*{_CJK_NUMBER}(?![\u3400-\u9fff])"
    r"|\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve"
    r"|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen"
    r"|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety"
    r"|hundred|thousand|million|billion|trillion)\b",
    re.I,
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
_UNSUPPORTED_CLAIM = re.compile(
    r"为负|為負|负数|負數|负值|負值|归零|歸零|为零|為零|小于零|等于零|零余额|零餘額"
    r"|见底|見底|耗[光尽盡]|用[光尽盡完]|欠费|欠費|已空|透支|マイナス|ゼロ|使い切|底をつ"
    r"|(?:没有|沒有|已無|已无)(?:任何|剩餘|剩余)?(?:余额|餘額|额度|額度)"
    r"|(?:残高|クレジット|クォータ|ポイント)(?:が|は)\s*(?:残ってい(?:ない|ません)|な(?:い|くな)|ありません)"
    r"|停[服用止]|禁用|封禁|中断|中斷|不可用|可正常使用|已恢复|已恢復|正常运行|正常運行|可以继续使用|可以繼續使用"
    r"|(?:订阅|訂閱|套餐|服务|服務|计划|計畫|賬戶|帳戶|账户).{0,8}(?:过期|過期|到期|失效|取消|终止|終止)"
    r"|(?:已经?|已經)(?:替|帮|幫|为|為)(?:你|您).{0,12}(?:处理|處理|更新|调整|調整|修改)"
    r"|利用(?:でき|不可|可能)|無効|再開|復旧|有効期限(?:切れ|が切れ)|期限(?:が)?切れ|失効"
    r"|高[于於]|超[过過]|大[于於]|多[于於]|未达(?:到)?阈值|未達(?:到)?門檻|上回|より(?:高|上|多)"
    r"|\b(?:negative|zero|depleted|exhausted|overdrawn|ran out|run out|used up"
    r"|unavailable|disabled|suspended|blocked|closed|restored|stopped|expired|terminated"
    r"|(?:subscription|plan|service|account)\s+(?:is\s+)?(?:cancelled|canceled|down)"
    r"|still (?:available|active|working)|continue (?:using|to use)"
    r"|(?:is|are) (?:available|operational|active)|working normally"
    r"|(?:updated|reset|changed) (?:your|the) (?:alert|threshold|account)"
    r"|exceeds?|(?:higher|greater|more|larger)\s+than)\b"
    r"|[≥≧⩾]",
    re.I,
)

# A suggestion is not evidence of a payment or of a service restriction.
_PAYMENT = r"(?:充值|儲值|付款|支付|缴费|繳費|转账|轉帳|汇款|匯款|入金|支払い|振込|課金|チャージ)"
_PAYMENT_CLAIM = re.compile(
    rf"(?:已|已经|已經|替你|帮你|幫你|替您|帮您|幫您|必须|必須|务必|務必)[^,，。;；\n!?！？]{{0,12}}{_PAYMENT}"
    rf"|{_PAYMENT}[^,，。;；\n!?！？]{{0,8}}(?:成功|完成|済|完了|才能|才可|方可|即可恢复|即可恢復)"
    rf"|{_PAYMENT}[^,，。;；\n!?！？]{{0,8}}[后後][^,，。;；\n!?！？]{{0,8}}(?:继续|繼續|使用)"
    r"|(?:选择|選擇)(?:支付|付款)方式|(?:确认|確認)(?:支付|付款)"
    r"|\b(?:paid|recharged|topped\s+up|transferred\s+(?:money|funds))\b"
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
_COUNT_WORDS.update(dict(zip("零一二三四五六七八九十", range(11), strict=True)))
_COUNT_WORDS.update({"两": 2, "兩": 2})
_ACCOUNT_COUNT = re.compile(
    rf"(?<![\w.+−-])(?P<en>[+−-]?\d+(?:\.\d+)?|{_EN_NUMBER_WORD}(?:[ -]+(?:and[ -]+)?{_EN_NUMBER_WORD})*)\s+accounts?\b"
    r"|(?<![\d.+−-])(?P<cjk>[+−-]?\d+(?:\.\d+)?|[零一二两兩三四五六七八九十]+)\s*(?:个|個)?(?:账户|帳戶|賬戶)"
    r"|(?<![\d.+−-])(?P<jp>[+−-]?\d+(?:\.\d+)?|[零一二三四五六七八九十]+)\s*(?:つ|件)のアカウント",
    re.I,
)
_PAYMENT_TOPIC = re.compile(
    rf"{_PAYMENT}|\b(?:pay|payment|recharg\w*|top[ -]?up|topping up|transfer)\b", re.I
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

    def replace(match: re.Match[str]) -> str:
        nonlocal invalid
        word = next(value for value in match.groups() if value is not None).lower()
        number = (
            int(word)
            if word.isascii() and word.isdigit()
            else _COUNT_WORDS.get(re.sub(r"[ -]+", " ", word))
        )
        invalid |= number != count
        return "accounts"

    result = _ACCOUNT_COUNT.sub(replace, prose)
    return None if invalid else result


def _tokens(count: int) -> tuple[tuple[str, ...], ...]:
    if count < 1 or count > _MAX_LENGTH // sum(len(field) + 6 for field in _FIELDS):
        return ()
    prefixes = (
        ("yql",) if count == 1 else tuple(f"yql.{i}" for i in range(1, count + 1))
    )
    tokens = tuple(
        tuple(f"<{prefix}.{field}>" for field in _FIELDS) for prefix in prefixes
    )
    if (
        sum(len(token) for row in tokens for token in row) + 2 * (count - 1)
        > _MAX_LENGTH
    ):
        return ()
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
        "Do not output links, mentions, code, tool calls or markup. "
        "Keep each account's four placeholders together in its own paragraph. "
        "Use a blank line between account paragraphs. "
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
    checked = _checked_counts(checked, count)
    if checked is None:
        return True
    checked = re.sub(r"\b(?:pay(?:ing)?|paid)\s+attention\b", "", checked, flags=re.I)
    if (
        _UNSUPPORTED_CLAIM.search(checked)
        or _PAYMENT_CLAIM.search(checked)
        or _PAYMENT_QUANTITY.search(checked)
        or _SCOPED_VALUE_CLAIM.search(checked)
        or _UNIT.search(checked)
        or _VALUE_WITH_UNIT.search(checked)
        or _NUMERIC_CURRENCY.search(checked)
        or _SWAPPED_ROLE.search(checked)
        or _UNLABELED_VALUES.search(checked)
        or _INVALID_VALUE_COMPARISON.search(checked)
        or any(unicodedata.category(char) == "Sc" for char in checked)
    ):
        return True
    for clause in re.split(r"[。.!?！？;；,，\n]", checked):
        payment = _PAYMENT_TOPIC.search(clause)
        if payment:
            # A time suggestion is not a proposed payment amount.
            clause = _DURATION.sub("time", clause)
        if (_FINANCE.search(clause) or payment) and (
            _WRITTEN_AMOUNT.search(clause)
            or any(
                char.isnumeric() and not "\u3400" <= char <= "\u9fff" for char in clause
            )
        ):
            return True
    return False


def render_notice(content: object, rows: tuple[Mapping[str, str], ...]) -> str:
    """Check a template before filling its slots once. Empty requests fallback."""
    if not isinstance(content, str) or len(content) > _MAX_LENGTH:
        return ""
    normalized_newlines = content.replace("\r\n", "\n")
    text = normalized_newlines.strip()
    if not text or _has_control(normalized_newlines, "\n\t\u200d"):
        return ""
    groups = _tokens(len(rows))
    if not groups:
        return ""
    remaining = {frozenset(group) for group in groups}
    paragraphs = [
        _HORIZONTAL_SPACE.sub(" ", paragraph.strip())
        for paragraph in _PARAGRAPH.split(text)
    ]
    for paragraph in paragraphs:
        found = _TOKEN.findall(paragraph)
        if found:
            group = frozenset(found)
            if len(found) != len(_FIELDS) or group not in remaining:
                return ""
            remaining.remove(group)
        # Check what the template could assemble around a fact without using
        # the actual fact text, which is inserted as a literal after validation.
        payload_text = unicodedata.normalize(
            "NFKC", _TOKEN.sub("slot", paragraph)
        ).replace("\u200d", "")
        if _PAYLOAD.search(payload_text):
            return ""
        # Distinct internal markers let the prose checks see which slot is used.
        prose = _TOKEN.sub(
            lambda match: _SLOT_MARKERS[match[0][:-1].rsplit(".", 1)[-1]],
            paragraph,
        )
        if _unsafe_prose(prose, len(rows)) or (
            found and not any(char.isalpha() for char in prose)
        ):
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
    rendered = _TOKEN.sub(lambda match: replacements[match[0]], "\n\n".join(paragraphs))
    return rendered if len(rendered) <= _MAX_LENGTH else ""
