#!/usr/bin/env python3
"""QA Round 12 — Phase 9 Learning Depth guards.
G1: review-variant keys verified (delegates to tools/verify_review_variants.py)
G2: rubric reveal panel present in all 37 modules + weekly note
G3: M34/M35 chain gates (M33->M34, M34->M35, no 'Phase 9 Tuntas' claim)
G4: F2 bedah-buta template exists, no curated company analysis
G5: F5 bedah-filing exists with honesty box
G6: mistake-log hooks in all 35 modules
G7: review bank 175/175 keys match
"""
import os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
fails = []
def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + ((" — " + detail) if detail and not cond else ""))
    if not cond: fails.append(name)

# G1: variant keys
r = subprocess.run([sys.executable, "tools/verify_review_variants.py"],
                   capture_output=True, text=True)
check("G1 variant keys 132 varian", r.returncode == 0, r.stderr[-300:] if r.returncode else "")

# G2: rubric panel in 37 modules + weekly note
missing = []
for m in range(1, 44):
    p = f"modul-{m}/index.html"
    try:
        h = open(p, encoding="utf-8").read()
        if "Tulis dulu, lalu bandingkan" not in h: missing.append(p)
    except FileNotFoundError: missing.append(p + " (missing)")
h = open("analisis-mingguan/index.html", encoding="utf-8").read()
if "Tulis dulu, lalu bandingkan" not in h: missing.append("analisis-mingguan/")
check("G2 rubric panel 44 pages", not missing, str(missing[:5]))

# G3: chain gates
j33 = open("js/modul33.js", encoding="utf-8").read()
j34 = open("js/modul34.js", encoding="utf-8").read()
check("G3 M33->M34 link", "modul-34" in j33)
check("G3 M34->M35 link", "modul-35" in j34)
check("G3 no 'Phase 9 Tuntas' claim", "Phase 9 Tuntas" not in j34 and "Phase 9 Tuntas" not in j33)

# G4: bedah-buta template, no curated company
bb = open("bedah-buta/index.html", encoding="utf-8").read()
bj = open("js/bedah-buta.js", encoding="utf-8").read()
check("G4 bedah-buta exists", len(bb) > 1000 and len(bj) > 500)
check("G4 no curated company", "Cemerlang Abadi" not in bb and "Nusantara Makmur" not in bb)

# G5: bedah-filing with honesty box
bf = open("bedah-filing/index.html", encoding="utf-8").read()
check("G5 bedah-filing exists", len(bf) > 2000)
check("G5 honesty/keterbatasan stated",
      "keterbatasan" in bf.lower() or "bukan rekomendasi" in bf.lower())

# G6: mistake-log hooks
nohook = []
for m in range(1, 44):
    try:
        j = open(f"js/modul{m}.js", encoding="utf-8").read()
        if "FSAMistake" not in j and "mistake" not in j.lower(): nohook.append(m)
    except FileNotFoundError: nohook.append(m)
check("G6 mistake-log hooks 43/43", not nohook, str(nohook[:8]))

# G7: review bank 175 keys
r = subprocess.run([sys.executable, "qa/qa-round6.py"], capture_output=True, text=True)
check("G7 review bank sweep", r.returncode == 0, r.stdout.strip().splitlines()[-1][:120] if r.stdout else r.stderr[-200:])

print()
if fails: print("RESULT: %d FAILURES — %s" % (len(fails), fails)); sys.exit(1)
print("RESULT: ALL PASS")
