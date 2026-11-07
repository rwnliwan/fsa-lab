#!/usr/bin/env python3
"""QA Gelombang 8C — FSA Lab Modul 15 (Altman Z), 16 (ECL 3 Stage), 17 (Forensik), 18 (Valuasi). Permanent artifact."""
import os, re, sys, subprocess

WEB = "/home/hatch/workspace/fsa-web"
fails = []

def check(name, cond):
    if not cond: fails.append(name)
    print(("FAIL " if not cond else "ok   ") + name)

for n in [15, 16, 17, 18]:
    check(f"modul-{n}/index.html ada", os.path.exists(WEB+f"/modul-{n}/index.html"))
    check(f"js/modul{n}.js ada", os.path.exists(WEB+f"/js/modul{n}.js"))

m15 = open(WEB+"/js/modul15.js", encoding="utf-8").read()
m16 = open(WEB+"/js/modul16.js", encoding="utf-8").read()
m17 = open(WEB+"/js/modul17.js", encoding="utf-8").read()
m18 = open(WEB+"/js/modul18.js", encoding="utf-8").read()

print("== gate links ==")
check("M15 gate -> ../modul-16/", "../modul-16/" in m15)
check("M16 gate -> ../modul-17/", "../modul-17/" in m16)
check("M17 gate -> ../modul-18/", "../modul-18/" in m17)
check("M18 gate -> ../modul-19/", "Phase 3 Tuntas" in m18 and "../modul-19/" in m18)

print("== M15 recompute (Z' privat) ==")
z = 0.717*0.26 + 0.847*0.18 + 3.107*0.16 + 0.420*0.66 + 0.998*1.15
check("Z' = 2,26", abs(z-2.26) < 0.01)
check("Z' unrounded 2,261", abs(0.717*(119440/451440)+0.847*(79440/451440)+3.107*(72000/451440)+0.420*(179440/272000)+0.998*520000/451440-2.26) < 0.01)
check("X1 0,26", abs(119440/451440-0.26) < 0.005)
check("X2 0,18", abs(79440/451440-0.18) < 0.005)
check("X3 0,16", abs(72000/451440-0.16) < 0.005)
check("X4 0,66", abs(179440/272000-0.66) < 0.005)
check("X5 1,15", abs(520000/451440-1.15) < 0.005)
check("grey zone 1,23-2,90", 1.23 < 2.26 < 2.90)
check("coverage 5,14", abs(72000/14000-5.14) < 0.01)
check("M15 ratio ans di source", all(x in m15 for x in ["ans:2.26","ans:0.16","ans:1.15","ans:5.14"]))
check("M15 quiz kunci [0,0,0,0,0]",
      [int(x) for x in re.findall(r'a:(\d)', m15.split("var QUIZ")[1].split("];")[0])] == [3,2,3,2,0])

print("== M16 recompute ==")
check("ECL S1 800", 80000*0.01 == 800)
check("ECL S2 900", 18000*0.05 == 900)
check("ECL S3 2.400", abs(10100*0.238-2400) < 5)
check("ECL total 4.100", 800+900+2400 == 4100)
check("bruto 108.100", 80000+18000+10100 == 108100)
check("neto 104.000", 108100-4100 == 104000)
check("S3 share 9,3%", abs(10100/108100*100-9.3) < 0.05)
check("ECL rate 3,8%", abs(4100/108100*100-3.8) < 0.05)
check("M16 ratio ans di source", all(x in m16 for x in ["ans:4100","ans:9.3","ans:3.8","ans:80000"]))
check("M16 quiz kunci [0,0,0,0,0]",
      [int(x) for x in re.findall(r'a:(\d)', m16.split("var QUIZ")[1].split("];")[0])] == [1,2,3,3,0])

print("== M17 recompute ==")
check("akrual 14.440", 45240-30800 == 14440)
check("Sloan 3,2%", abs(14440/451440*100-3.2) < 0.05)
check("CFO/NI 0,68", abs(30800/45240-0.68) < 0.005)
check("M-score -1,65 (kanonis)", "-1,65" in m17 and "ans:-1.65" in m17)
check("M17 ratio ans di source", all(x in m17 for x in ["ans:3.2","ans:14440","ans:0.68","ans:-1.65"]))
check("M17 quiz kunci [0,0,0,0,0]",
      [int(x) for x in re.findall(r'a:(\d)', m17.split("var QUIZ")[1].split("];")[0])] == [3,0,1,3,1])

print("== M18 recompute ==")
check("sales 2026F 598.000", 520000*1.15 == 598000)
check("EBIT 82.524", abs(598000*0.138-82524) < 1)
check("NI 53.449", abs((82524-14000)*0.78-53449) < 1)
check("EV 277.778", abs(25000/0.09-277778) < 1)
check("net debt 180.000", (31440+110000+60000)-21440 == 180000)
check("nilai ekuitas 97.778", 277778-180000 == 97778)
check("ekuitas < nilai buku", 97778 < 179440)
check("M18 tanpa upside salah", "54,8" not in m18 and "54.8" not in m18)
check("M18 ratio ans di source", all(x in m18 for x in ["ans:598000","ans:53449","ans:277778","ans:97778"]))
check("M18 quiz kunci [0,0,0,0,0]",
      [int(x) for x in re.findall(r'a:(\d)', m18.split("var QUIZ")[1].split("];")[0])] == [3,0,2,3,2,0,2,1])

print("== guard regresi M15-M18 ==")
for name, src, fn in [("M15",m15,"modul15"),("M16",m16,"modul16"),("M17",m17,"modul17"),("M18",m18,"modul18")]:
    check(f"{name} parseIDNumber", "function parseIDNumber" in src)
    check(f"{name} quiz warning nomor soal", "melewatkan soal" in src)
    check(f"{name} gate permanen", "tetap tersimpan" in src)
    check(f"{name} anti double-count", "pgCards.indexOf(i) < 0" in src)
    check(f"{name} localStorage fsa_pg", f"fsa_pg_m{name[1:]}" in src)
    check(f"{name} localStorage fsa_gate", f"fsa_gate_m{name[1:]}" in src)
    check(f"{name} journal 3 lensa",
          f"fsa_journal_m{name[1:]}_" in src
          and all(k+":" in src.split("var LENSES")[1].split("};")[0] for k in ["invest","credit","forensic"]))
    check(f"{name} 6 kartu playground", src.count('{t:"') == 6)
    check(f"{name} skor /12", "/ 12 (" in src)
    check(f"{name} kunci tidak dibocorkan", "kunci tidak dibocorkan" in src)
    bare = re.findall(r'\{l:"([^"]+)",[^}]*d:"—",', src)
    check(f"{name} tanpa d:'—'", not bare)
    _exp_q = 8 if name == "M18" else 5
    check(f"{name} {_exp_q} soal quiz", src.split("var QUIZ")[1].split("];")[0].count('{q:"') == _exp_q)
    r = subprocess.run(["node","--check",WEB+"/js/"+fn+".js"], capture_output=True, text=True)
    check(f"node --check {fn}.js", r.returncode == 0)

print()
if fails:
    print(f"QA WAVE8C: {len(fails)} FAIL"); sys.exit(1)
print("QA WAVE8C: LULUS")
sys.exit(0)
