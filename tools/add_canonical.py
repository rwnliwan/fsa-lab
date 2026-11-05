#!/usr/bin/env python3
"""Tambah <link rel="canonical"> absolut di semua halaman (landing + modul + tools).

Aturan: https://fsa-lab.pages.dev/<path>/ dengan trailing slash konsisten.
Root index.html -> https://fsa-lab.pages.dev/
Idempotent: halaman yang sudah punya canonical dilewati.
Jalankan dari repo root: python3 tools/add_canonical.py
"""
import os, re

WEB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://fsa-lab.pages.dev"
DESC_RE = re.compile(r'(<meta name="description" content="[^"]*">)')

def canonical_for(rel):
    # rel mis. "modul-1/index.html" atau "index.html"
    d = os.path.dirname(rel).replace(os.sep, "/")
    return BASE + "/" if not d else BASE + "/" + d + "/"

def main():
    added, skipped = 0, []
    for dirpath, _dirs, files in os.walk(WEB):
        for fn in files:
            if fn != "index.html":
                continue
            p = os.path.join(dirpath, fn)
            rel = os.path.relpath(p, WEB)
            if rel.startswith("partials/"):
                continue  # bukan halaman penuh
            html = open(p, encoding="utf-8").read()
            if 'rel="canonical"' in html:
                continue
            m = DESC_RE.search(html)
            if not m:
                skipped.append(rel + " (tak ada meta description)")
                continue
            canon = canonical_for(rel)
            tag = f'\n<link rel="canonical" href="{canon}">'
            html = html[:m.end()] + tag + html[m.end():]
            open(p, "w", encoding="utf-8").write(html)
            added += 1
    print(f"canonical ditambah: {added} halaman")
    for s in skipped:
        print("  LEWATI:", s)

if __name__ == "__main__":
    main()
