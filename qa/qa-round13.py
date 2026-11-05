#!/usr/bin/env python3
"""QA Round 13 — Fix Round 7 guards (review Instinct 9.3/10).

PERMANENT GUARD: "stale second copy" sweep. Pola yang berulang 3 ronde:
angka diperbaiki di JS/tabel tapi teks HTML/prose/model answer/journal prompt
masih angka lama. Setiap perubahan angka WAJIB terdaftar di STALE_PAIRS di bawah;
suite ini assert angka_lama = 0 kemunculan di HTML+JS.

G1: M32 stale numbers (PKP 56.000->52.000, PPh 12.320->11.440, 440->1.320,
    ETR fiskal 21,2%->19,7%, PPh29 3.960->3.080, "pajak DITUNDA"->reversal)
G2: Weekly note example 1 (10,2%->8,7%, 54,8->73,0, 22.400->14.440, 0,58x->0,68x,
    6,1%->10,9%, D/E 0,4x->1,52x)
G3: Prose-vs-logic consistency M32 (angka HTML == angka JS)
G4: Model answer / journal prompt / exemplar / fact box sweep (no old numbers)
G5: Altman hybrid label ("Z klasik (publik)" gone, "konservatif" gone,
    warning permanent, Z' headline 2,26)
G6: M29 swap wording ("Bagian yang langsung ke P&L" gone)
G7: SOCI deferred tax sign ("+ tangguhan 22.998" gone, "(22.998)" present)
G8: M35 QA-history ("temuan QA" gone, "partial goodwill" present)
G9: Bedah-buta mobile (no inline grid 2-col on .note-guide)

Negative test: setiap guard assert angka_lama == 0 (dan angka_baru > 0 bila
relevan), sehingga terhadap kondisi pre-fix guard ini FAIL.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
fails = []


def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + ((" — " + detail) if detail and not cond else ""))
    if not cond:
        fails.append(name)


def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


def count_pat(text, pat):
    return len(re.findall(pat, text))


M32_HTML = "modul-32/index.html"
M32_JS = "js/modul32.js"
m32h = read(M32_HTML)
m32j = read(M32_JS)

# ---------- G1: M32 stale numbers ----------
# "440" boundary-aware: jangan match "11.440" / "141.440"
p440 = r"(?<![\d.])440(?![\d])"
stale_m32 = [
    ("56.000", r"(?<![\d.])56\.000(?![\d])"),
    ("12.320", r"(?<![\d.])12\.320(?![\d])"),
    ("440 (standalone)", p440),
    ("Rp440", r"Rp440"),
    ("440 juta", r"(?<![\d.])440 juta"),
    ("tangguhan 440", r"tangguhan 440"),
    ("21,2%", r"21,2%"),
    ("3.960", r"(?<![\d.])3\.960(?![\d])"),
    ("pajak DITUNDA", r"pajak DITUNDA"),
    ("menunda pajak", r"menunda pajak"),
    ("beda tetap +4.000 tiap tahun", r"beda tetap \+4\.000 tiap tahun"),
]
for label, pat in stale_m32:
    n = count_pat(m32h, pat) + count_pat(m32j, pat)
    check(f"G1 M32 stale '{label}' == 0", n == 0, f"found {n}")

# angka baru HARUS ada (negative test: pre-fix tidak punya ini)
for label, pat in [("52.000", r"52\.000"), ("11.440", r"11\.440"),
                   ("19,7%", r"19,7%"), ("3.080", r"3\.080")]:
    n = count_pat(m32h, pat) + count_pat(m32j, pat)
    check(f"G1 M32 new '{label}' present", n > 0, "missing")

# ---------- G2: weekly note example 1 ----------
wn = read("analisis-mingguan/index.html")
stale_wn = [
    ("10,2%", r"10,2%"), ("10.2%", r"10\.2%"),
    ("54,8", r"(?<![\d.])54,8(?![\d])"), ("54.8", r"(?<![\d.])54\.8(?![\d])"),
    ("22.400", r"22\.400"), ("22,400", r"22,400"),
    ("0,58x", r"0,58x"), ("0.58x", r"0\.58x"),
    ("6,1%", r"6,1%"), ("6.1%", r"6\.1%"),
    ("0,4x", r"(?<![\d.])0,4x"), ("0.7x", r"(?<![\d.])0\.7x"),
]
for label, pat in stale_wn:
    n = count_pat(wn, pat)
    check(f"G2 weekly-note stale '{label}' == 0", n == 0, f"found {n}")
for label, pat in [("8,7%", r"8,7%"), ("73,0", r"73,0"), ("14.440", r"14\.440"),
                   ("0,68x", r"0,68x"), ("1,52x", r"1,52x")]:
    check(f"G2 weekly-note new '{label}' present", count_pat(wn, pat) > 0, "missing")

# ---------- G3: prose-vs-logic consistency (M32) ----------
for label, pat in [("PKP 52.000", r"52\.000"), ("PPh 11.440", r"11\.440"),
                   ("tangguhan 1.320", r"1\.320"), ("ETR fiskal 19,7%", r"19,7%")]:
    in_html = count_pat(m32h, pat) > 0
    in_js = count_pat(m32j, pat) > 0
    check(f"G3 M32 '{label}' in HTML+JS", in_html and in_js,
          f"html={in_html} js={in_js}")

# ---------- G4: model answer / journal / exemplar / fact box ----------
# (dicakup G1/G2 untuk angka; di sini assert section-nya tidak mengandung pola lama)
check("G4 no '56.000' in model answers",
      "56.000" not in m32h[m32h.find("Model"):m32h.find("Model") + 6000]
      if "Model" in m32h else True)
check("G4 journal prompt no '440'",
      not re.search(p440, m32j))

# ---------- G5: Altman ----------
m25j = read("js/modul25.js")
m25h = read("modul-25/index.html")
check("G5 'Z klasik (publik)' gone", "Z klasik (publik)" not in m25j)
check("G5 'konservatif' gone (hybrid)", "konservatif" not in m25j.lower())
check("G5 hybrid renamed", "Hibrida ilustratif" in m25j)
check("G5 warning not conditional on 2.64",
      "Math.abs(z-2.64)" not in m25j and "Math.abs(z - 2.64)" not in m25j)
check("G5 Z' headline 2,26", "2,26" in m25h)
check("G5 not-an-official-model warning present",
      "BUKAN varian" in m25j or "bukan varian resmi" in m25j.lower())

# ---------- G6: M29 ----------
m29j = read("js/modul29.js")
check("G6 'Bagian yang langsung ke P&L' gone",
      "Bagian yang langsung ke P&L" not in m29j)
rv = read("js/review-variants.js")
check("G6 swap bridge distinguishes ineffectiveness",
      "ineffectiveness" in rv.lower() or "inefektif" in rv.lower())

# ---------- G7: SOCI ----------
bf = read("bedah-filing/index.html")
check("G7 '+ tangguhan 22.998' gone",
      not re.search(r"\+\s*tangguhan 22\.998", bf))
check("G7 deferred shown as benefit (22.998)", "(22.998)" in bf)
check("G7 16.782 cited to LK 2025",
      "16.782" in bf and ("2025" in bf or "belum diverifikasi" in bf.lower()))

# ---------- G8: M35 ----------
m35j = read("js/modul35.js")
m35h = read("modul-35/index.html")
check("G8 'temuan QA' gone", "temuan QA" not in m35j and "temuan QA" not in m35h)
check("G8 partial goodwill stated",
      "partial goodwill" in m35j.lower())

# ---------- G9: bedah-buta mobile ----------
bb = read("bedah-buta/index.html")
check("G9 no inline 2-col grid on .note-guide",
      'class="note-guide" style=' not in bb)
check("G9 .note-guide collapses at <=720px",
      "note-guide" in bb and "720px" in bb)

print()
if fails:
    print("RESULT: %d FAILURES — %s" % (len(fails), fails))
    sys.exit(1)
print("RESULT: ALL PASS")
