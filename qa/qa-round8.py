#!/usr/bin/env python3
"""FSA Lab — QA ROUND 8 (Phase 8 guards, permanen).

Kelas kesalahan yang ditemukan saat build Phase 8 (M29-M33 + 5 fitur penyeimbang lens).
Phase 9 (M34) ditambahkan kemudian — guard modul-terakhir & gate chain diperbarui.
Aturan: tiap temuan ronde fix QA-nya jadi artefak permanen.
"""
import os
import re
import sys

WEB = "/home/hatch/workspace/fsa-web/"
fails = []


def check(name, cond):
    print(("ok   " if cond else "FAIL ") + name)
    if not cond:
        fails.append(name)


def read(p):
    with open(os.path.join(WEB, p), encoding="utf-8") as f:
        return f.read()


# ---------- G1: quiz satu baris (M29-M35) ----------
print("== G1 format quiz satu baris (M29-M35) ==")
for n in (29, 30, 31, 32, 33, 34, 35):
    s = read(f"js/modul{n}.js")
    m = re.search(r"var QUIZ = \[(.*?)\];", s, re.S)
    entries = re.findall(r'\{q:"(?:[^"\\]|\\.)*", o:\[.*?\], a:\d+\}', m.group(1))
    _exp = 8 if n in (30, 35) else 5
    check(f"M{n} {_exp} quiz satu baris", len(entries) == _exp)

# ---------- G2: kunci quiz diacak ----------
print("== G2 kunci quiz diacak ==")
for n in (29, 30, 31, 32, 33, 34, 35):
    s = read(f"js/modul{n}.js")
    keys = [int(x) for x in re.findall(r'a:(\d)\}', s.split("var QUIZ")[1])]
    check(f"M{n} kunci tersebar >=3 posisi", len(set(keys)) >= 3)
    check(f"M{n} tidak semua kunci sama", len(set(keys)) > 1)

# ---------- G3: angka modul baru konsisten ----------
print("== G3 angka Phase 8 konsisten ==")
m31 = read("js/modul31.js")
check("M31 NI 53.695", "53.695" in m31)
check("M31 penjualan 582.400", "582.400" in m31)
check("M31 label ilustratif forecast", "ilustratif" in m31.lower())
m32 = read("js/modul32.js")
check("M32 PKP 52.000", "52.000" in m32)
check("M32 PPh terutang 11.440", "11.440" in m32)
m30 = read("js/modul30.js")
check("M30 label bank ilustratif", "ilustratif" in m30.lower())
check("M30 LDR 88,2", "88,2" in m30)
m29 = read("js/modul29.js")
check("M29 ineffektif 400", "400" in m29)
check("M29 PSAK 109", "109" in m29)

# ---------- G4: workbench functions baru jalan ----------
print("== G4 workbench Phase 8 ==")
sys.path.insert(0, os.path.join(WEB, "workbench"))
import fsa_toolkit as tk
dscr_baru, status, titik = tk.covenant_break(1.35, 1.2, 110000, -20)
check("covenant_break JEBOL", status == "JEBOL" and abs(dscr_baru - 1.08) < 0.01)
check("covenant_break titik jebol ~-11.11%", abs(titik - (-11.11)) < 0.1)
res = tk.dcf_inputs(25000, 0.03, 0.12, 0.03)
check("dcf_inputs EV = 277.778", abs(res["ev"] - 277778) < 1)
check("dcf_inputs TV konsisten", abs(res["tv"] - 322020.6) < 1)

# ---------- G5: gate chain M28->...->M34->M35 ----------
print("== G5 gate chain Phase 8+9 ==")
check("M28 -> M29", "../modul-29/" in read("js/modul28.js"))
check("M29 -> M30", "../modul-30/" in read("js/modul29.js"))
check("M30 -> M31", "../modul-31/" in read("js/modul30.js"))
check("M31 -> M32", "../modul-32/" in read("js/modul31.js"))
check("M32 -> M33", "../modul-33/" in read("js/modul32.js"))
check("M33 -> M34", "../modul-34/" in read("js/modul33.js"))
check("M34 -> M35", "../modul-35/" in read("js/modul34.js"))
check("M35 kembali landing", "../index.html" in read("js/modul35.js"))
for n in (29, 30, 31, 32, 33, 34, 35):
    check(f"modul-{n}/index.html ada", os.path.exists(f"{WEB}modul-{n}/index.html"))

# ---------- G6: 5 fitur Phase 8 ada & terlink ----------
print("== G6 fitur Phase 8 ==")
landing = read("index.html")
for feat in ["memo-kredit/", "komparator/", "risk-map/"]:
    check(f"landing link {feat}", (f'href="{feat}"' in landing or f'href="/{feat}"' in landing))
    check(f"folder {feat}index.html", os.path.exists(f"{WEB}{feat}index.html"))
check("workbench covenant_break", "covenant_break" in read("workbench/fsa_toolkit.py"))
check("workbench dcf_inputs", "dcf_inputs" in read("workbench/fsa_toolkit.py"))
check("Phase 8 card", "Phase 8" in landing)
check("hero 11 phase", '<span class="num" id="stat-phase">11</span>' in landing)

# ---------- G7: lens balance — credit & investment features ----------
print("== G7 lens balance ==")
check("credit: covenant predictor UI", "Covenant Break" in read("workbench/index.html"))
check("credit: memo builder", "memo-kredit" in landing)
check("investment: DCF builder UI", "DCF" in read("workbench/index.html"))
check("investment: comparator", "komparator" in landing)
check("cross-lens: risk map metodologi", "metodologi" in read("risk-map/index.html").lower())
check("risk map label ilustratif", "ilustratif" in read("risk-map/index.html").lower())

# ---------- G8: M35 = modul terakhir, klaim tuntas hanya di sini ----------
print("== G8 modul terakhir ==")
check("M35 klaim Phase 9 tuntas", "Phase 9 Tuntas" in read("js/modul35.js"))
check("M34 tidak klaim tuntas lagi (link ke M35)", "Phase 9 Tuntas" not in read("js/modul34.js"))
check("M33 tidak klaim tuntas lagi (link ke M34)", "Kurikulum Phase 8 Tuntas" not in read("js/modul33.js"))
for n in (29, 30, 31, 32, 33, 34):
    check(f"M{n} tidak klaim tuntas", "Tuntas ✓" not in read(f"js/modul{n}.js").split("var QUIZ")[0]
          or "Phase 9 Tuntas" not in read(f"js/modul{n}.js"))

print()
if fails:
    print(f"QA ROUND8: {len(fails)} FAIL")
    sys.exit(1)
print("QA ROUND8: LULUS (0 warning)")
