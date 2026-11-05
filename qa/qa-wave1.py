#!/usr/bin/env python3
"""QA Gelombang 1 — FSA Lab (desain + landing). Static checks, permanent artifact."""
import os, re, sys

WEB = "/home/hatch/workspace/fsa-web"
fails, warns = [], []

def check(name, cond, warn=False):
    (warns if warn else fails).append(name) if not cond else None
    print(("WARN " if warn and not cond else "FAIL " if not cond else "ok   ") + name)

idx = open(f"{WEB}/index.html", encoding="utf-8").read()
css = open(f"{WEB}/css/style.css", encoding="utf-8").read()
js  = open(f"{WEB}/js/main.js", encoding="utf-8").read()

# 1. file & referensi aset
check("index.html ada", os.path.exists(f"{WEB}/index.html"))
check("css/style.css ada", os.path.exists(f"{WEB}/css/style.css"))
check("js/main.js ada", os.path.exists(f"{WEB}/js/main.js"))
for m in re.findall(r'(?:href|src)="(css/|js/)([^"]+)"', idx):
    check(f"aset direferensikan ada: {m[0]+m[1]}", os.path.exists(f"{WEB}/{m[0]+m[1]}"))

# 2. tidak ada link mati internal
for href in re.findall(r'href="(#[^"]*)"', idx):
    if href != "#":
        check(f"anchor {href} ada targetnya", f'id="{href[1:]}"' in idx or f"id='{href[1:]}'" in idx)

# 3. nomor PSAK: dilarang nomor lama tanpa pasangan baru
old_only = []
for m in re.finditer(r"PSAK\s+7[123]\b", idx):
    ctx = idx[max(0,m.start()-60):m.end()+40]
    if not re.search(r"11[56]|115|109", ctx):
        old_only.append(ctx.strip()[:60])
check("tidak ada PSAK 71/72/73 tanpa nomor baru", not old_only)
check("PSAK 116/115/109/118 disebut", all(f"PSAK {n}" in idx or f">{n}<" in idx for n in ["116","115","109","118"]), warn=True)

# 4. tipografi angka: class .num / font-mono dipakai untuk statistik
check("angka statistik pakai .num (mono)", 'class="num"' in idx)
# 4b. font Space Mono diload — via self-hosted css/fonts.css (bukan lagi Google Fonts, Phase 10)
_fcss = open(f"{WEB}/css/fonts.css", encoding="utf-8").read()
check("font Space Mono diload", "css/fonts.css" in idx and "Space Mono" in _fcss)

# 5. ikon SVG inline valid (tidak ada img eksternal yang bisa 404)
check("tidak ada <img> eksternal", "<img src=\"http" not in idx and "<img src='http" not in idx)
nsvg = idx.count("<svg")
check(f"SVG inline ada ({nsvg})", nsvg >= 8)

# 6. meta dasar
check("<title> ada", "<title>" in idx)
check('meta viewport', 'name="viewport"' in idx)
check('meta description', 'name="description"' in idx)

# 7. CSS: token retro terdefinisi
for tok in ["--paper", "--sunset", "--mustard", "--teal", "--font-display", "--font-mono"]:
    check(f"token {tok} ada", tok in css)
check("grain overlay ada", ".grain" in css)
check("stripes ada", ".stripes" in css)
check("responsive breakpoint ada", "@media" in css)
check("landscape full-width rule", "orientation:landscape" in css)

# 8. JS: tidak ada console.error / prompt
check("js tanpa console.error", "console.error" not in js)
check("js tanpa prompt()", "prompt(" not in js)

# 9. Bahasa: tidak ada placeholder lorem
check("tanpa lorem ipsum", "lorem" not in idx.lower())

print()
if fails:
    print(f"QA WAVE1: {len(fails)} FAIL"); sys.exit(1)
print(f"QA WAVE1: LULUS ({len(warns)} warning)")
sys.exit(0)
