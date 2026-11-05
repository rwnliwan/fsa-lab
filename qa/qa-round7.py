#!/usr/bin/env python3
"""FSA Lab — QA ROUND 7 (Phase 7 guards, permanen).

Kelas kesalahan yang ditemukan saat build Phase 7 (M25-M28 + 5 fitur).
Aturan: tiap temuan ronde fix QA-nya jadi artefak permanen.
"""
import os
import re
import subprocess
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


# ---------- G1: quiz satu baris (regex QA brittle) ----------
print("== G1 format quiz satu baris (M25-M28) ==")
for n in (25, 26, 27, 28):
    s = read(f"js/modul{n}.js")
    m = re.search(r"var QUIZ = \[(.*?)\];", s, re.S)
    entries = re.findall(r'\{q:"(?:[^"\\]|\\.)*", o:\[.*?\], a:\d+\}', m.group(1))
    check(f"M{n} 5 quiz satu baris", len(entries) == 5 and "\n" not in m.group(1).replace(",\n", ""))

# ---------- G2: kunci quiz diacak (aturan 32) ----------
print("== G2 kunci quiz diacak ==")
for n in (25, 26, 27, 28):
    s = read(f"js/modul{n}.js")
    keys = [int(x) for x in re.findall(r'a:(\d)\}', s.split("var QUIZ")[1])]
    check(f"M{n} kunci tersebar >=3 posisi", len(set(keys)) >= 3)
    check(f"M{n} tidak semua kunci sama", len(set(keys)) > 1)

# ---------- G3: angka modul baru konsisten dengan CANONICAL-DATA ----------
print("== G3 angka kanonis tidak berubah & dipakai benar ==")
canon = read("CANONICAL-DATA.md")
for must in ["45.240", "29.640", "451.440", "30.800", "2,64", "179.440"]:
    check(f"kanonis {must} ada", must in canon)
m25 = read("js/modul25.js")
check("M25 Z=2,64 cocok kanonis", "2,64" in m25)
check("M25 Piotroski 8/9", "8/9" in m25 or "8 dari 9" in m25)
m27 = read("js/modul27.js")
check("M27 diluted EPS 430,9", "430,9" in m27)
check("M27 label ilustratif", "ilustratif" in m27.lower())

# ---------- G4: tidak ada klaim tanpa sumber (standar bernomor) ----------
print("== G4 klaim standar bernomor ==")
m26 = read("js/modul26.js")
check("M26 sebut PSAK 401", "401" in m26)
check("M26 sebut PSAK 402", "402" in m26)
check("M27 sebut PSAK 102", "102" in m27)
check("M27 sebut POJK 51", "51" in m27)

# ---------- G5: gate chain M24->...->M28->M29 (Phase 8: M28 bukan terakhir) ----------
print("== G5 gate chain Phase 7+8 ==")
check("M24 -> M25", "../modul-25/" in read("js/modul24.js"))
check("M25 -> M26", "../modul-26/" in read("js/modul25.js"))
check("M26 -> M27", "../modul-27/" in read("js/modul26.js"))
check("M27 -> M28", "../modul-28/" in read("js/modul27.js"))
check("M28 -> M29", "../modul-29/" in read("js/modul28.js"))
for n in (25, 26, 27, 28):
    check(f"modul-{n}/index.html ada", os.path.exists(f"{WEB}modul-{n}/index.html"))

# ---------- G6: 5 fitur ada & terlink landing ----------
print("== G6 fitur Phase 7 ==")
landing = read("index.html")
for feat in ["konverter/", "glosarium/", "spot-fraud/", "theater/"]:
    check(f"landing link {feat}", (f'href="{feat}"' in landing or f'href="/{feat}"' in landing))
    check(f"folder {feat}index.html", os.path.exists(f"{WEB}{feat}index.html"))
check("workbench footnote_diff", "footnote_diff" in read("workbench/fsa_toolkit.py"))
check("Phase 7 card", "Phase 7" in landing)

# ---------- G7: tidak ada nama AI di konten user-facing ----------
print("== G7 tanpa nama AI di konten ==")
for p in ["modul-25/index.html", "modul-26/index.html", "modul-27/index.html",
          "modul-28/index.html", "konverter/index.html", "glosarium/index.html",
          "spot-fraud/index.html", "theater/index.html"]:
    c = read(p).lower()
    check(f"{p} bersih", "claude" not in c and "chatgpt" not in c and "gemini" not in c)

# ---------- G8: node --check semua JS baru ----------
print("== G8 syntax JS ==")
for p in ["js/modul25.js", "js/modul26.js", "js/modul27.js", "js/modul28.js",
          "konverter/konverter.js", "glosarium/glosarium.js",
          "spot-fraud/spot-fraud.js", "theater/theater.js", "js/review-bank.js"]:
    r = subprocess.run(["node", "--check", WEB + p], capture_output=True)
    check(f"node --check {p}", r.returncode == 0)
r = subprocess.run(["python3", "-m", "py_compile", WEB + "workbench/fsa_toolkit.py"],
                   capture_output=True)
check("py_compile fsa_toolkit.py", r.returncode == 0)

print()
if fails:
    print(f"QA ROUND7: {len(fails)} FAIL")
    sys.exit(1)
print("QA ROUND7: LULUS (0 warning)")
