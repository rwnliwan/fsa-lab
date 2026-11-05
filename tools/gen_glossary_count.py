#!/usr/bin/env python3
"""Sync the glossary term count into the HTML pages that display it.

Counts glossary entries ({en:"..."} in glosarium/glosarium.js) and rewrites
any stale digit count placed before the word "istilah" in:
  - glosarium/index.html  (lede + meta description)
  - index.html            (landing feature card)

No hardcoded numbers: rerun after adding terms so the copy never goes stale.
Ref: QA-PLAN.md Round 13 — stale second copy is a permanent lesson.

Usage: python3 tools/gen_glossary_count.py
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JS = ROOT / "glosarium" / "glosarium.js"
FILES = [ROOT / "glosarium" / "index.html", ROOT / "index.html"]
ENTRY_RE = re.compile(r"\{en:")


def count_terms() -> int:
    return len(ENTRY_RE.findall(JS.read_text(encoding="utf-8")))


def main() -> int:
    n = count_terms()
    for f in FILES:
        text = f.read_text(encoding="utf-8")
        new_text, subs = re.subn(r"\d+\+?(?=\s*istilah)", str(n), text)
        if subs:
            f.write_text(new_text, encoding="utf-8")
            print(f"{f.relative_to(ROOT)}: updated {subs} count(s) -> {n} istilah")
        else:
            print(f"{f.relative_to(ROOT)}: no count found before 'istilah' (already {n}?)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
