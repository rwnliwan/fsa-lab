#!/usr/bin/env python3
"""Ganti <link> Google Fonts dengan self-hosted css/fonts.css (subset latin WOFF2).

Idempotent: halaman yang sudah memakai css/fonts.css dilewati.
Jalankan dari repo root: python3 tools/replace_font_links.py
"""
import os, re, sys

WEB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

GOOGLE_RE = re.compile(
    r'<link rel="preconnect" href="https://fonts\.googleapis\.com">\s*\n'
    r'<link rel="preconnect" href="https://fonts\.gstatic\.com" crossorigin>\s*\n'
    r'<link href="https://fonts\.googleapis\.com/css2\?[^"]*" rel="stylesheet">'
)

def main():
    changed, skipped = 0, []
    for dirpath, _dirs, files in os.walk(WEB):
        for fn in files:
            if fn != "index.html":
                continue
            p = os.path.join(dirpath, fn)
            rel = os.path.relpath(p, WEB)
            if rel.startswith("partials/"):
                continue  # bukan halaman penuh
            html = open(p, encoding="utf-8").read()
            if "css/fonts.css" in html:
                continue  # sudah diganti
            m = GOOGLE_RE.search(html)
            if not m:
                skipped.append(rel + " (pola Google Fonts tak cocok)")
                continue
            depth = rel.count(os.sep)  # 0 = root, 1 = satu subdir
            href = ("../" * depth) + "css/fonts.css"
            repl = ('<!-- Fonts: self-hosted WOFF2 subset latin (css/fonts.css). '
                    'Dulu Google Fonts; dipindah agar CSP ketat tanpa domain eksternal. -->\n'
                    f'<link rel="stylesheet" href="{href}">')
            html = GOOGLE_RE.sub(repl, html, count=1)
            open(p, "w", encoding="utf-8").write(html)
            changed += 1
    print(f"diganti: {changed} halaman")
    for s in skipped:
        print("  LEWATI:", s)

if __name__ == "__main__":
    main()
