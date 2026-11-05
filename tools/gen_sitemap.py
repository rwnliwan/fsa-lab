#!/usr/bin/env python3
"""Generate sitemap.xml for FSA Lab from the actual directories on disk.

No hardcoded module/tool lists: any depth-1 directory containing an
index.html (except asset/tooling dirs: css, js, qa, tools, partials) is
registered, plus the site root. Rerun before each deploy.

Usage: python3 tools/gen_sitemap.py
"""
import sys
import xml.dom.minidom
from pathlib import Path
from datetime import date, timezone

BASE = "https://fsa-lab.pages.dev/"
ROOT = Path(__file__).resolve().parent.parent
EXCLUDE = {"css", "js", "qa", "tools", "partials", "__pycache__"}


def collect() -> list[str]:
    dirs = []
    for p in sorted(ROOT.iterdir()):
        if not p.is_dir():
            continue
        if p.name in EXCLUDE or p.name.startswith("."):
            continue
        if (p / "index.html").is_file():
            dirs.append(p.name + "/")
    return dirs


def main() -> int:
    entries = [""] + collect()  # "" = root
    today = date.today().isoformat()

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for path in entries:
        lines.append("  <url>")
        lines.append(f"    <loc>{BASE}{path}</loc>")
        lines.append(f"    <lastmod>{today}</lastmod>")
        lines.append("  </url>")
    lines.append("</urlset>")
    xml_text = "\n".join(lines) + "\n"

    # Validate the XML we just built.
    xml.dom.minidom.parseString(xml_text)

    out = ROOT / "sitemap.xml"
    out.write_text(xml_text, encoding="utf-8")
    print(f"wrote {out} — {len(entries)} URLs "
          f"(root + {len(entries) - 1} pages)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
