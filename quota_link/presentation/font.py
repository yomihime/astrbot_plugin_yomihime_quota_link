"""Pinned offline Noto face; bounded coverage parser adapted from YGL."""

import struct
from hashlib import sha256
from io import BytesIO
from pathlib import Path

from .bitmap import BitmapUnavailable

FONT_FILENAME = "NotoSansCJKsc-Regular.otf"
FONT_SIZE = 16_437_364
FONT_SHA256 = "2c76254f6fc379fddfce0a7e84fb5385bb135d3e399294f6eeb6680d0365b74b"


def _cmap(content):
    """Read bounded Unicode cmap 4/12 of face zero, excluding glyph zero."""

    def u16(offset):
        return struct.unpack_from(">H", content, offset)[0]

    def u32(offset):
        return struct.unpack_from(">I", content, offset)[0]

    base = u32(12) if content[:4] == b"ttcf" else 0
    count = u16(base + 4)
    if count > 256:
        raise ValueError
    table = None
    for i in range(count):
        pos = base + 12 + i * 16
        if content[pos : pos + 4] == b"cmap":
            table = u32(pos + 8)
            length = u32(pos + 12)
            if table + length > len(content):
                raise ValueError
            break
    if table is None or u16(table + 2) > 256:
        raise ValueError
    points = set()
    work = 0
    records = {}
    for i in range(u16(table + 2)):
        rec = table + 4 + i * 8
        records[(u16(rec), u16(rec + 2))] = rec
    # Match the standard Unicode preference used by FreeType/fontTools.
    preferred = ((3, 10), (0, 6), (0, 4), (3, 1), (0, 3), (0, 2), (0, 1), (0, 0))
    selected = next((records[key] for key in preferred if key in records), None)
    if selected is None:
        raise ValueError
    for rec in (selected,):
        platform, encoding = u16(rec), u16(rec + 2)
        if platform != 0 and (platform, encoding) not in ((3, 1), (3, 10)):
            continue
        pos = table + u32(rec + 4)
        fmt = u16(pos)
        if fmt == 12:
            groups = u32(pos + 12)
            if groups > 65536 or pos + 16 + groups * 12 > len(content):
                raise ValueError
            for j in range(groups):
                p = pos + 16 + j * 12
                start, end, glyph = u32(p), u32(p + 4), u32(p + 8)
                if start > end or end > 0x10FFFF:
                    raise ValueError
                work += end - start + 1
                if work > 2_228_224:
                    raise ValueError
                points.update(range(start + (glyph == 0), end + 1))
        elif fmt == 4:
            segments = u16(pos + 6) // 2
            if segments > 8192 or pos + u16(pos + 2) > len(content):
                raise ValueError
            ends = pos + 14
            starts = ends + 2 * segments + 2
            deltas = starts + 2 * segments
            offsets = deltas + 2 * segments
            for j in range(segments):
                start, end = u16(starts + j * 2), u16(ends + j * 2)
                if start > end:
                    raise ValueError
                work += end - start + 1
                if work > 2_228_224:
                    raise ValueError
                delta, offset = u16(deltas + j * 2), u16(offsets + j * 2)
                for cp in range(start, min(end, 65534) + 1):
                    glyph = (
                        u16(offsets + j * 2 + offset + (cp - start) * 2)
                        if offset
                        else cp
                    )
                    if glyph and ((glyph + delta) & 65535):
                        points.add(cp)
    if not points:
        raise ValueError
    return frozenset(points)


class CardFontProvider:
    def __init__(self, path: Path | None):
        try:
            if path is None:
                raise ValueError
            path = Path(path)
            with path.open("rb") as stream:
                content = stream.read(FONT_SIZE + 1)
            if len(content) != FONT_SIZE or sha256(content).hexdigest() != FONT_SHA256:
                raise ValueError
            self._coverage = _cmap(content)
            self._font_bytes = content
        except Exception:
            raise BitmapUnavailable("font_unavailable") from None

    def supports(self, codepoint):
        return type(codepoint) is int and codepoint in self._coverage

    def load(self, size):
        try:
            from PIL import ImageFont

            return ImageFont.truetype(BytesIO(self._font_bytes), size, index=0)
        except Exception:
            raise BitmapUnavailable("font_unavailable") from None
