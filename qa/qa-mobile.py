#!/usr/bin/env python3
"""FSA Lab — QA MOBILE 390px (round-5, permanen).

Kelas kesalahan: tabel explorer terpotong di render 390px (Chrome phone
emulation) — 15 modul + 4 tool; kolom kanan tidak terbaca (M16 ~816px,
M32 ~748px). Tabel explorer dirender JS belakangan (ganti tab), jadi
pembungkusan statis saja tidak cukup.

Aturan permanen:
  1. css/modul.css wajib mendefinisikan .tblwrap dengan overflow-x:auto
     dan max-width:100% (tidak boleh di-override jadi visible di mana pun).
  2. Setiap halaman modul-1..35 + 4 tool (konverter, komparator, memo-kredit,
     risk-map) WAJIB memuat js/tblwrap.js (menangani tabel statis + tabel
     yang disuntik JS belakangan via MutationObserver).
  3. Setiap <table> STATIS di HTML 37 halaman itu WAJIB berada di dalam
     div scroll wrapper (.tblwrap/.kmp-wrap/.spread-scroll/.heat-scroll/
     .conv-scroll). Tabel telanjang = FAIL.
  4. Tidak boleh ada CSS yang memaksa tabel lebih lebar dari wrapper tanpa
     overflow (table-layout:fixed / overflow:visible pada .tblwrap).
  5. Mode landscape HP: .modul-sec tidak boleh menyempitkan konten
     (max-width >= 740px) — aturan UI Septian: full-width tanpa kolom kosong.
"""
import os
import re
import sys
from html.parser import HTMLParser

WEB = "/home/hatch/workspace/fsa-web/"
fails = []

WRAP_CLASSES = {"tblwrap", "kmp-wrap", "spread-scroll", "heat-scroll", "conv-scroll"}
MODULES = [f"modul-{n}/index.html" for n in range(1, 36)]
TOOLS = ["konverter/index.html", "komparator/index.html",
         "memo-kredit/index.html", "risk-map/index.html"]
PAGES = MODULES + TOOLS


def check(name, cond):
    print(("ok   " if cond else "FAIL ") + name)
    if not cond:
        fails.append(name)


def read(p):
    with open(os.path.join(WEB, p), encoding="utf-8") as f:
        return f.read()


class TableWrapChecker(HTMLParser):
    """Catat setiap <table> + apakah ada ancestor div.scroll-wrapper."""
    VOID = {"meta", "link", "br", "hr", "img", "input", "source", "wbr"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []          # list of (tag, class-set)
        self.tables = []         # list of (line, wrapped:bool)

    def handle_starttag(self, tag, attrs):
        if tag in self.VOID:
            return
        cls = set()
        for k, v in attrs:
            if k == "class" and v:
                cls.update(v.split())
        if tag == "table":
            wrapped = any(t == "div" and (c & WRAP_CLASSES)
                          for t, c in self.stack)
            self.tables.append((self.getpos()[0], wrapped))
        self.stack.append((tag, cls))

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if self.stack and self.stack[-1][0] == tag:
            self.stack.pop()
        # mismatch lain diabaikan: bukan urusan guard ini


# ---------- G1: CSS .tblwrap benar ----------
print("== G1 CSS .tblwrap ==")
css = read("css/modul.css")
m = re.search(r"\.tblwrap\s*\{([^}]*)\}", css)
check(".tblwrap terdefinisi di css/modul.css", bool(m))
if m:
    body = m.group(1)
    check(".tblwrap overflow-x:auto", "overflow-x" in body and "auto" in body)
    check(".tblwrap max-width:100%", "max-width" in body and "100%" in body)
else:
    check(".tblwrap overflow-x:auto", False)
    check(".tblwrap max-width:100%", False)

# ---------- G2: tidak ada override yang mematikan scroll ----------
print("== G2 tidak ada CSS anti-scroll ==")
all_css = css + read("css/style.css")
check("tidak ada table-layout:fixed", "table-layout" not in all_css.replace(" ", "")
      or "table-layout:fixed" not in all_css.replace(" ", ""))
bad_override = re.findall(r"\.tblwrap[^{]*\{[^}]*overflow(?:-x)?\s*:\s*visible", all_css)
check("tidak ada .tblwrap overflow:visible", not bad_override)
# inline <style> di 37 halaman
inline_bad = []
for p in PAGES:
    for mm in re.finditer(r"\.tblwrap[^{]*\{[^}]*overflow(?:-x)?\s*:\s*visible", read(p)):
        inline_bad.append(p)
check("tidak ada inline .tblwrap overflow:visible", not inline_bad)

# ---------- G3: js/tblwrap.js ada & benar ----------
print("== G3 js/tblwrap.js ==")
js = read("js/tblwrap.js")
check("js/tblwrap.js ada", bool(js))
check("wrap semua <table>", 'querySelectorAll("table")' in js)
check("MutationObserver untuk tabel susulan", "MutationObserver" in js)
check("lewati tabel yang sudah terbungkus", "closest(WRAP_SEL)" in js)

# ---------- G4: semua halaman memuat tblwrap.js ----------
print("== G4 script tag tblwrap.js di 37 halaman ==")
missing_tag = [p for p in PAGES if "tblwrap.js" not in read(p)]
check("37/37 halaman memuat tblwrap.js", not missing_tag)
for p in missing_tag:
    print("     hilang di:", p)

# ---------- G5: tidak ada tabel statis telanjang ----------
print("== G5 semua <table> statis dalam scroll wrapper ==")
total_tables = 0
naked = []
for p in PAGES:
    c = TableWrapChecker()
    c.feed(read(p))
    total_tables += len(c.tables)
    for line, wrapped in c.tables:
        if not wrapped:
            naked.append(f"{p}:{line}")
check(f"{total_tables} tabel statis, 0 telanjang", not naked)
for n in naked:
    print("     telanjang:", n)

# ---------- G6: modul.css dipakai semua halaman ----------
print("== G6 css/modul.css ter-link di 37 halaman ==")
no_css = [p for p in PAGES if "css/modul.css" not in read(p)]
check("37/37 halaman link css/modul.css", not no_css)

# ---------- G7: landscape HP full-width ----------
print("== G7 landscape HP tanpa kolom kosong ==")
msec = re.search(r"\.modul-sec\s*\{([^}]*)\}", css)
mw_ok = True
if msec:
    mw = re.search(r"max-width\s*:\s*(\d+)px", msec.group(1))
    mw_ok = (mw is None) or int(mw.group(1)) >= 740
check(".modul-sec max-width >= 740px (landscape HP full-width)", mw_ok)
check("aturan landscape .section ada (QA-PLAN #5)",
      "orientation:landscape" in read("css/style.css"))

print()
if fails:
    print(f"QA MOBILE: {len(fails)} FAIL")
    sys.exit(1)
print("QA MOBILE: LULUS (0 warning)")
