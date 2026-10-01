import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "index.html"
DICTIONARY = ROOT / "i18n" / "en.txt"
TARGET = ROOT / "en" / "index.html"

CYRILLIC = re.compile(r"[А-Яа-яЁё]")
TOKENS = re.compile(r"(<script\b[^>]*>.*?</script>|<style\b[^>]*>.*?</style>|<!--.*?-->|<[^>]+>|[^<]+)", re.S)
ENTITY = re.compile(r"(&[#\w]+;)")
ATTRIBUTE = re.compile(r'(\s(?:title|aria-label|placeholder|content|alt|data-title|data-phrases|data-captions)=")([^"]*)(")')
STRING_LITERAL = re.compile(r"'(?:[^'\\\n]|\\.)*'|\"(?:[^\"\\\n]|\\.)*\"")
MIN_SCRIPT_PHRASE = 4
TEMPLATE_START = '<template id="luminaSrc">'
TEMPLATE_END = "</template>"

PAGE_SWAPS = [
    ('<html lang="ru">', '<html lang="en">'),
    ('<a href="./" class="on" aria-current="page" lang="ru" hreflang="ru">RU</a><a href="en/" lang="en" hreflang="en">EN</a>',
     '<a href="../" lang="ru" hreflang="ru">RU</a><a href="./" class="on" aria-current="page" lang="en" hreflang="en">EN</a>'),
]
REDIRECT_SCRIPT = re.compile(r'<script id="langRedirect">.*?</script>\n', re.S)


def load_dictionary():
    pairs = {}
    for line in DICTIONARY.read_text(encoding="utf-8").splitlines():
        if " => " not in line:
            continue
        russian, english = line.split(" => ", 1)
        pairs[russian.strip()] = english.strip()
    return pairs


class Translator:
    def __init__(self, pairs):
        self.pairs = pairs
        self.script_phrases = sorted((key for key in pairs if len(key) >= MIN_SCRIPT_PHRASE), key=len, reverse=True)
        self.missing = []

    def phrase(self, text):
        if not CYRILLIC.search(text):
            return text
        core = re.sub(r"\s+", " ", text).strip()
        if core not in self.pairs:
            self.missing.append(core)
            return text
        leading = text[: len(text) - len(text.lstrip())]
        trailing = text[len(text.rstrip()):]
        return leading + self.pairs[core] + trailing

    def text(self, chunk):
        return "".join(part if ENTITY.fullmatch(part) else self.phrase(part) for part in ENTITY.split(chunk))

    def attribute(self, match):
        name, value, closing = match.groups()
        if "data-phrases" in name or "data-captions" in name:
            value = "|".join(self.phrase(part) for part in value.split("|"))
        else:
            value = self.phrase(value)
        return name + value.replace('"', "&quot;") + closing

    def tag(self, chunk):
        return ATTRIBUTE.sub(self.attribute, chunk)

    def literal(self, match):
        literal = match.group(0)
        quote, body = literal[0], literal[1:-1]
        if not CYRILLIC.search(body):
            return literal
        def escaped(english):
            return english.replace(quote, "\\" + quote)

        stripped = body.strip()
        if stripped in self.pairs:
            return quote + body.replace(stripped, escaped(self.pairs[stripped])) + quote
        for key in self.script_phrases:
            if key in body:
                body = body.replace(key, escaped(self.pairs[key]))
        if CYRILLIC.search(body):
            self.missing.append("script: " + body)
        return quote + body + quote

    def script(self, chunk):
        return STRING_LITERAL.sub(self.literal, chunk)

    def markup(self, html):
        parts = []
        for chunk in TOKENS.findall(html):
            if chunk.startswith("<script"):
                parts.append(self.script(chunk))
            elif chunk.startswith(("<style", "<!--")):
                parts.append(chunk)
            elif chunk.startswith("<"):
                parts.append(self.tag(chunk))
            else:
                parts.append(self.text(chunk))
        return "".join(parts)


def build():
    page = SOURCE.read_text(encoding="utf-8")
    template_start = page.index(TEMPLATE_START)
    template_end = page.index(TEMPLATE_END, template_start) + len(TEMPLATE_END)
    translator = Translator(load_dictionary())
    english = translator.markup(page[:template_start]) + page[template_start:template_end] + translator.markup(page[template_end:])
    english = REDIRECT_SCRIPT.sub("", english, count=1)
    for russian, translated in PAGE_SWAPS:
        if russian not in english:
            sys.exit(f"page marker not found: {russian[:60]}")
        english = english.replace(russian, translated, 1)
    TARGET.parent.mkdir(exist_ok=True)
    TARGET.write_text(english, encoding="utf-8", newline="\n")
    unique_missing = list(dict.fromkeys(translator.missing))
    print(f"en/index.html written, untranslated: {len(unique_missing)}")
    for phrase in unique_missing:
        print("  ", phrase)
    return 1 if unique_missing else 0


if __name__ == "__main__":
    sys.exit(build())
