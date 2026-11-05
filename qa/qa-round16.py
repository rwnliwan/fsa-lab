#!/usr/bin/env python3
"""QA Round 16 — stale-number guard Phase 10 Workstream A (M36 & M37).

PERMANENT GUARD: semua angka kanonis baru M36/M37 WAJIB muncul di HTML+JS
(prose-vs-logic consistency, pelajaran Round 13 G3/G4). Setiap perubahan angka
WAJIB update daftar CANON di bawah + bukti python /tmp/verify_m36_m37.py.

G1: M36 canon numbers present in modul-36/index.html AND js/modul36.js
G2: M37 canon numbers present in modul-37/index.html AND js/modul37.js
G3: wrong-variant sweep — angka/frasa salah yang umum DILARANG muncul
G4: PSAK numbering benar (nomor baru + nomor lama disebut sekali; pola old+200 ditolak)
G5: chain gates (M36->M37; no 'Phase 10 Tuntas' di M36; 'Phase 10 Tuntas' di M37)
G6: localStorage keys baru ada; tidak ada reset progress learner
G7: review bank memuat 10 soal baru (M36/M37); mistake-log MODUL 36/37
G8: quiz key distribution M36/M37 (tiap posisi <=2, no single-position pass)

Negative test: guard angka-salah assert == 0 kemunculan; guard angka-baru
assert > 0 — terhadap kondisi pre-fix/bug, guard ini FAIL.
"""
import json
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


def bpat(x):
    """Boundary-aware: '200' tidak match '1.200'/'20.000'."""
    return r"(?<![\d.])" + re.escape(x) + r"(?![\d])"


def count_pat(text, pat):
    return len(re.findall(pat, text))


m36h = read("modul-36/index.html")
m36j = read("js/modul36.js")
m37h = read("modul-37/index.html")
m37j = read("js/modul37.js")

# ---------- G1: M36 canon (Rp juta kecuali dinyatakan lain) ----------
CANON36_BOTH = [
    "9.000", "3.000", "60.000", "4.800", "55.000", "25.000", "1.500",
    "6.000", "31.500", "283", "212", "200", "24", "300", "190", "400",
    "20", "12", "10", "17", "21,2x", "20,0x",
]
for x in CANON36_BOTH:
    p = bpat(x)
    check("G1 M36 both '%s'" % x, count_pat(m36h, p) > 0 and count_pat(m36j, p) > 0,
          "html=%d js=%d" % (count_pat(m36h, p), count_pat(m36j, p)))
CANON36_JS = ["28.500", "150", "500"]  # playground/lab-only, JS-rendered
for x in CANON36_JS:
    p = bpat(x)
    check("G1 M36 js-only '%s'" % x, count_pat(m36j, p) > 0)

# ---------- G2: M37 canon ----------
CANON37_BOTH = [
    "30.000", "15.500", "17.500", "12.500", "14.500", "2.000", "440",
    "1.560", "8.000", "6.000", "25.000", "18.000", "20.000", "5.000",
    "3.400", "50.000", "1.400", "1.200", "1.000", "150", "100", "110",
    "120", "200", "22%",
]
for x in CANON37_BOTH:
    p = bpat(x)
    check("G2 M37 both '%s'" % x, count_pat(m37h, p) > 0 and count_pat(m37j, p) > 0,
          "html=%d js=%d" % (count_pat(m37h, p), count_pat(m37j, p)))

# ---------- G3: wrong-variant sweep ----------
WRONG = [
    ("M36 diluted EPS 283,02 (salah rounding)", r"283[,.]02", m36h, m36j),
    ("M36 'Rp284' (salah rounding)", r"Rp284(?![\d])", m36h, m36j),
    ("M36 P/E 21,20x (salah format)", r"21,20x", m36h, m36j),
    ("M36 basis confusion 'EPS Rp300' sbg diluted", r"[Dd]iluted[^.]{0,40}Rp300", m36h, m36j),
    ("M37 'LIFO diizinkan/dibolehkan PSAK'", r"LIFO di(izinkan|bolehkan)", m37h, m37j),
    ("M37 'goodwill boleh dibalik' (non-goodwill dikecualikan)", r"(?<!non-)goodwill boleh dibalik", m37h.lower(), m37j.lower()),
    ("M37 recoverable = min (salah standar)", r"ambil yang terendah(?! agar konservatif)", m37h, m37j),
]
for label, pat, h, j in WRONG:
    n = count_pat(h, pat) + count_pat(j, pat)
    check("G3 absent: " + label, n == 0, "ketemu %d" % n)

# ---------- G4: PSAK numbering ----------
for label, pat, files in [
    ("M36 PSAK 102", r"PSAK 102", (m36h, m36j)),
    ("M36 dulu PSAK 53", r"dulu PSAK 53", (m36h, m36j)),
    ("M36 PSAK 233", r"PSAK 233", (m36h, m36j)),
    ("M36 dulu PSAK 56", r"dulu PSAK 56", (m36h, m36j)),
    ("M37 PSAK 202", r"PSAK 202", (m37h, m37j)),
    ("M37 dulu PSAK 14", r"dulu PSAK 14", (m37h, m37j)),
    ("M37 PSAK 236", r"PSAK 236", (m37h, m37j)),
    ("M37 dulu PSAK 48", r"dulu PSAK 48", (m37h, m37j)),
    ("M37 PSAK 216", r"PSAK 216", (m37h, m37j)),
    ("M37 dulu PSAK 16", r"dulu PSAK 16", (m37h, m37j)),
]:
    check("G4 " + label, any(count_pat(f, pat) > 0 for f in files))
check("G4 no 'PSAK 214' (jebakan old+200 utk persediaan)",
      count_pat(m37h, r"PSAK 214") + count_pat(m37j, r"PSAK 214") == 0)

# ---------- G5: chain gates (aturan Round 12 G3) ----------
check("G5 M36->M37 link", "modul-37" in m36j)
check("G5 no 'Phase 10 Tuntas' di M36", "Phase 10 Tuntas" not in m36j)
check("G5 'Phase 10 Tuntas' di M37", "Phase 10 Tuntas" in m37j)
check("G5 no 'Phase 9 Tuntas' di M36/M37",
      "Phase 9 Tuntas" not in m36j and "Phase 9 Tuntas" not in m37j)

# ---------- G6: localStorage — keys baru, tanpa reset ----------
for n, j in (("m36", m36j), ("m37", m37j)):
    check("G6 gate key fsa_gate_%s" % n, "fsa_gate_%s" % n in j)
    check("G6 pg key fsa_pg_%s" % n, "fsa_pg_%s" % n in j)
    check("G6 journal key fsa_journal_%s" % n, "fsa_journal_%s" % n in j)
    check("G6 no localStorage.clear (%s)" % n, "localStorage.clear" not in j)
    check("G6 no removeItem gate (%s)" % n, 'removeItem("fsa_gate' not in j)

# ---------- G7: review bank + mistake-log ----------
bank_src = read("js/review-bank.js")
bank = json.loads(bank_src[bank_src.index("["):bank_src.rindex("]") + 1])
c36 = sum(1 for q in bank if q["m"] == 36)
c37 = sum(1 for q in bank if q["m"] == 37)
check("G7 bank M36 = 5 soal", c36 == 5, "dapat %d" % c36)
check("G7 bank M37 = 5 soal", c37 == 5, "dapat %d" % c37)
ml = read("js/mistake-log.js")
check("G7 mistake-log MODUL 36", '36:{t:"Stock-Based Compensation & EPS"' in ml)
check("G7 mistake-log MODUL 37", '37:{t:"Inventory & Long-Lived Asset Methods"' in ml)

# ---------- G8: quiz key distribution (aturan Round 9 G2/G3) ----------
for n, j in ((36, m36j), (37, m37j)):
    keys = re.findall(r"\{q:.*?, a:(\d)\}", j)
    dist = [keys.count(str(i)) for i in range(4)]
    check("G8 M%d 5 soal" % n, len(keys) == 5, "dapat %d" % len(keys))
    check("G8 M%d max<=2 per posisi" % n, max(dist) <= 2, "dist=%s" % dist)
    sim = max(sum(1 for k in keys if k == str(i)) / len(keys) for i in range(4))
    check("G8 M%d no single-pass" % n, sim < 0.8, "max=%.0f%%" % (sim * 100))

print()
if fails:
    print("QA ROUND16: %d FAIL" % len(fails))
    sys.exit(1)
print("QA ROUND16: LULUS")
