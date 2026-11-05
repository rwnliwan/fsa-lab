#!/usr/bin/env python3
"""QA Gelombang 8A — FSA Lab Modul 7, 8, 9, 10 (Phase 2). Permanent artifact."""
import os, re, sys, subprocess

WEB = "/home/hatch/workspace/fsa-web"
fails = []

def check(name, cond):
    if not cond: fails.append(name)
    print(("FAIL " if not cond else "ok   ") + name)

mods = {}
for n in [7, 8, 9, 10]:
    check(f"modul-{n}/index.html ada", os.path.exists(f"{WEB}/modul-{n}/index.html"))
    check(f"js/modul{n}.js ada", os.path.exists(f"{WEB}/js/modul{n}.js"))
    mods[n] = open(f"{WEB}/js/modul{n}.js", encoding="utf-8").read()

# gate chain: M6 -> M7
m6 = open(f"{WEB}/js/modul6.js", encoding="utf-8").read()
check("M6 gate link ke modul-7 (2 tempat)", m6.count('../modul-7/') >= 2)

print("== M7 recompute independen ==")
m7 = mods[7]
check("pajak efektif 22.0", abs(12760/58000*100-22.0) < 0.01)
check("payout 13.3", abs(6000/45240*100-13.3) < 0.05)
check("ECL rate 3.8", abs(4100/108100*100-3.8) < 0.05)
check("sewa/liabilitas 22.1", abs(60000/272000*100-22.1) < 0.05)
check("M7 ratio ans di source", all(x in m7 for x in ["ans:22.0","ans:13.3","ans:3.8","ans:22.1"]))
check("M7 quiz kunci [0,1,0,1,2]",
      [int(x) for x in re.findall(r'a:(\d)', m7.split("var QUIZ")[1].split("];")[0])] == [2,3,3,1,0])
check("M7 gate link modul-8", "../modul-8/" in m7)

print("== M8 recompute independen ==")
m8 = mods[8]
check("tax burden 78.0", abs(45240/58000*100-78.0) < 0.01)
check("interest burden 80.6", abs(58000/72000*100-80.6) < 0.05)
check("EBIT margin 13.8", abs(72000/520000*100-13.8) < 0.05)
check("margin Ritel 15.0", abs(46800/312000*100-15.0) < 0.01)
check("ROA Ritel 17.3", abs(46800/270864*100-17.3) < 0.05)
check("margin Distribusi 12.1", abs(25200/208000*100-12.1) < 0.05)
check("ROA Distribusi 14.0", abs(25200/180576*100-14.0) < 0.05)
prod = 0.78*(58000/72000)*(72000/520000)*(520000/414820)*(414820/159820)
check("DuPont product = ROE 28.3", abs(prod*100-28.31) < 0.05)
check("segmen tie penjualan", 312000+208000 == 520000)
check("segmen tie laba operasi", 46800+25200 == 72000)
check("segmen tie aset", 270864+180576 == 451440)
check("M8 ratio ans di source", all(x in m8 for x in ["ans:78.0","ans:80.6","ans:13.8","ans:15.0"]))
check("M8 quiz kunci [0,0,1,0,0]",
      [int(x) for x in re.findall(r'a:(\d)', m8.split("var QUIZ")[1].split("];")[0])] == [0,1,3,3,0])
check("M8 gate link modul-9", "../modul-9/" in m8)

print("== M9 recompute independen ==")
m9 = mods[9]
check("EPS dasar 452.4", abs(45240/100-452.4) < 0.01)
check("EPS 2024 296.4", abs(29640/100-296.4) < 0.01)
check("continuing NI 39.000", abs(45240-8000*0.78-39000) < 1)
check("continuing EPS 390.0", abs((45240-8000*0.78)/100-390.0) < 0.01)
check("porsi one-off 13.8", abs(8000*0.78/45240*100-13.8) < 0.05)
check("payout 13.3 (M9)", abs(6000/45240*100-13.3) < 0.05)
check("M9 ratio ans di source", all(x in m9 for x in ["ans:452.4","ans:390.0","ans:13.8","ans:13.3"]))
check("M9 quiz kunci [0,0,1,0,0]",
      [int(x) for x in re.findall(r'a:(\d)', m9.split("var QUIZ")[1].split("];")[0])] == [2,2,0,1,3])
check("M9 gate link modul-10", "../modul-10/" in m9)

print("== M10 recompute independen ==")
m10 = mods[10]
check("kas dari pelanggan 471.000", 520000-49000 == 471000)
check("CFO/liabilitas 11.3", abs(30800/272000*100-11.3) < 0.05)
check("capex/CFO 155.8", abs(48000/30800*100-155.8) < 0.05)
check("reinvestment 160", abs(48000/30000*100-160.0) < 0.01)
check("CFF = utang neto - dividen", 11440-6000 == 5440)
check("M10 ratio ans di source", all(x in m10 for x in ["ans:471000","ans:11.3","ans:155.8","ans:160.0"]))
check("M10 quiz kunci [0,0,0,0,1]",
      [int(x) for x in re.findall(r'a:(\d)', m10.split("var QUIZ")[1].split("];")[0])] == [2,3,1,1,0])
check("M10 gate link modul-11", "../modul-11/" in m10)

print("== guard regresi M7-M10 ==")
for n in [7, 8, 9, 10]:
    src = mods[n]
    name = f"M{n}"
    check(f"{name} parseIDNumber", "function parseIDNumber" in src)
    check(f"{name} quiz warning terlewat", "melewatkan soal" in src)
    check(f"{name} gate permanen", "tetap tersimpan" in src)
    check(f"{name} anti double-count", "pgCards.indexOf(i) < 0" in src)
    check(f"{name} 6 kartu playground", src.count('{t:"') == 6)
    check(f"{name} localStorage fsa_pg_m{n}", f"fsa_pg_m{n}" in src)
    check(f"{name} localStorage fsa_gate_m{n}", f"fsa_gate_m{n}" in src)
    check(f"{name} localStorage fsa_journal_m{n}_", f"fsa_journal_m{n}_" in src)
    check(f"{name} 4 ratio lab", src.split("var RATIOS")[1].split("];")[0].count('{q:"') == 4)
    check(f"{name} 5 soal quiz", len(re.findall(r'a:(\d)', src.split("var QUIZ")[1].split("];")[0])) == 5)
    bare = re.findall(r'\{l:"([^"]+)",[^}]*d:"—",', src)
    check(f"{name} tanpa d:'—' ({len(bare)} baris kosong)", not bare)
    r = subprocess.run(["node", "--check", f"{WEB}/js/modul{n}.js"], capture_output=True, text=True)
    check(f"node --check modul{n}.js", r.returncode == 0)

print()
if fails:
    print(f"QA WAVE8A: {len(fails)} FAIL")
    sys.exit(1)
print("QA WAVE8A: LULUS")
sys.exit(0)
