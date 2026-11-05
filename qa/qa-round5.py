#!/usr/bin/env python3
"""QA ROUND5 — regression guards dari fix ronde 4 review Instinct (9,0/10).

Setiap temuan ronde 4 dijadikan guard permanen agar kesalahan yang sama
tidak bisa kembali diam-diam. Dijalankan tiap deploy.

G1: Enron CFO = 1,6 / 1,2 / 4,8 (US$ juta) — terverifikasi ke 10-K langsung.
    Guard: nilai lama 1,0/1,1/3,0 tidak boleh muncul lagi.
G2: Garuda 2018 = rugi restatement US$175,0 jt. Guard: "245" tidak boleh muncul.
G3: FCFF/FCFE — CFO (PSAK) sudah setelah bunga.
    FCFF = CFO + bunga(1-pajak) - capex ; FCFE = FCFF - bunga(1-pajak) + utang neto.
    Guard: ans lama (-17200/-16680/-3.3) tidak boleh muncul; definisi Q1 benar.
G4: EV != nilai ekuitas. Guard: "54,8"/"54.8" tidak boleh muncul di M18;
    bridge 277.778 - 180.000 = 97.778 harus ada.
G5: Label utang Enron M17 = utang TERCATAT (US$ miliar), bukan off-balance-sheet.
G6: Distribusi kunci quiz — tidak ada modul dengan 5/5 kunci di posisi sama
    (pelajaran: M11-M18 semua-A bisa dieksploitasi 100%).
"""
import re, sys

WEB = "/home/hatch/workspace/fsa-web/"
fails, warns = [], []

def check(name, cond):
    print(("ok   " if cond else "FAIL ") + name)
    if not cond: fails.append(name)

cf = open(WEB+"js/casefiles.js", encoding="utf-8").read()
m6 = open(WEB+"js/modul6.js", encoding="utf-8").read()
m17 = open(WEB+"js/modul17.js", encoding="utf-8").read()
m18 = open(WEB+"js/modul18.js", encoding="utf-8").read()
m10 = open(WEB+"js/modul10.js", encoding="utf-8").read()
sim = open(WEB+"js/simulator.js", encoding="utf-8").read()
land = open(WEB+"index.html", encoding="utf-8").read()

print("== G1 Enron CFO ==")
check("CFO 1998 = 1,6", '["CFO","US$1,6 M"]' in cf)
check("CFO 1999 = 1,2", '["CFO","US$1,2 M"]' in cf)
check("CFO 2000 = 4,8", '["CFO","US$4,8 M"]' in cf)
check("nilai CFO lama hilang", not any(x in cf for x in ['["CFO","US$1,0 M"]', '["CFO","US$1,1 M"]', '["CFO","US$3,0 M"]']))

print("== G2 Garuda restatement ==")
check("rugi 175,0", "175,0" in cf and "175,0" in m17)
check("245 hilang", "245" not in cf and "~US$245" not in m17)

print("== G3 FCFF/FCFE ==")
check("ans lama hilang", not any(x in m6 for x in ["ans:-17200", "ans:-16680", "ans:-3.3"]))
check("ans baru ada", all(x in m6 for x in ["ans:-6280", "ans:-5760", "ans:-1.2"]))
check("definisi Q1 benar", "CFO + bunga(1\u2212pajak) \u2212 capex" in m6)
check("FCFE 2024 positif (+4.000)", '"4.000"' in m6)
check("M10 Q5 angka baru", "5.760" in m10)
check("M18 FCFF aktual baru", "(6.280)" in m18 or "6.280" in m18)

print("== G4 EV->ekuitas ==")
check("54,8 hilang dari M18", "54,8" not in m18 and "54.8" not in m18)
check("bridge 97.778", "97.778" in m18 and "180.000" in m18)
check("ratio ans 97778", "ans:97778" in m18)

print("== G5 label utang Enron ==")
check("v2 = Utang TERCATAT", 'v2:"Utang TERCATAT"' in m17)
check("satuan miliar", "US$ MILIAR" in m17)
check("label explorer lama hilang", "Utang disembunyikan di entitas bertujuan khusus (SPE): 7,4" not in m17)

print("== G6 distribusi kunci quiz ==")
for n in range(1, 19):
    src = open(f"{WEB}js/modul{n}.js", encoding="utf-8").read()
    keys = [int(x) for x in re.findall(r'a:(\d)', src.split("var QUIZ")[1].split("];")[0])]
    check(f"M{n}: 5 soal", len(keys) == 5)
    check(f"M{n}: tidak all-satu-posisi", len(set(keys)) > 1)

print("== should-fix ronde 4 ==")
check("simulator: CR 2,3x dihapus", "2,3x" not in sim)
check("landing: interview bank live", (('href="interview/"' in land or 'href="/interview/"' in land) and "segera hadir" not in land))
check("interview page ada", __import__("os").path.exists(WEB+"interview/index.html"))
m2lede = open(WEB+"modul-2/index.html", encoding="utf-8").read()
check("M2: klarifikasi Nusantara/Cemerlang", "Nusantara Makmur" in m2lede and "Cemerlang Abadi" in m2lede)

print()
if fails:
    print(f"QA ROUND5: {len(fails)} FAIL")
    sys.exit(1)
print("QA ROUND5: LULUS")
