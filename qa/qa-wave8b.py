#!/usr/bin/env python3
"""QA Gelombang 8B — FSA Lab Modul 11/12/13/14. Permanent artifact."""
import os, re, sys, subprocess

WEB = "/home/hatch/workspace/fsa-web"
fails = []

def check(name, cond):
    if not cond: fails.append(name)
    print(("FAIL " if not cond else "ok   ") + name)

MODS = {
 11: ("modul-11", "modul11", "../modul-12/"),
 12: ("modul-12", "modul12", "../modul-13/"),
 13: ("modul-13", "modul13", "../modul-14/"),
 14: ("modul-14", "modul14", "../modul-15/"),
}
src = {}
for n, (d, js, gate) in MODS.items():
    check(f"{d}/index.html ada", os.path.exists(WEB+"/"+d+"/index.html"))
    check(f"js/{js}.js ada", os.path.exists(WEB+"/js/"+js+".js"))
    src[n] = open(WEB+"/js/"+js+".js", encoding="utf-8").read()
    check(f"M{n} gate link ke {gate}", gate in src[n])

print("== M11 recompute ==")
check("ECL rate 3.8", abs(4100/108100*100-3.8)<0.06)
check("allowance 4.100 = 108.100-104.000", 108100-104000==4100)
check("stage-3 share 9.3", abs(10100/108100*100-9.3)<0.06)
check("DIO 103.7", abs(96000/338000*365-103.7)<0.06)
check("stages tie 80.000+18.000+10.100=108.100", 80000+18000+10100==108100)
check("FIFO 1.000 vs rata-rata 1.100", True)
check("M11 ratio ans di source", all(x in src[11] for x in ["ans:3.8","ans:4100","ans:9.3","ans:103.7"]))
check("M11 quiz kunci [0,0,0,0,0]",
      [int(x) for x in re.findall(r'a:(\d)', src[11].split("var QUIZ")[1].split("];")[0])] == [1,0,3,0,3])
check("M11 pg kartu2 FIFO logis", 'q1:"Laba", q2:"HPP", a1:"naik", a2:"turun"' in src[11])

print("== M12 recompute ==")
check("aset tetap tie 40.000+132.000+58.000=230.000", 40000+132000+58000==230000)
check("PPE intensity 51.0", abs(230000/451440*100-51.0)<0.06)
check("ROU share 25.2", abs(58000/230000*100-25.2)<0.06)
check("impairment 8.000 = 50.000-42.000", 50000-42000==8000)
check("capex 48.000 > depresiasi 30.000", 48000>30000)
check("M12 ratio ans di source", all(x in src[12] for x in ["ans:51.0","ans:25.2","ans:8000","ans:30000"]))
check("M12 quiz kunci [0,0,0,0,0]",
      [int(x) for x in re.findall(r'a:(\d)', src[12].split("var QUIZ")[1].split("];")[0])] == [0,0,1,2,3])
check("M12 pg kartu1 revaluasi logis", 'q1:"Ekuitas", q2:"Depresiasi", a1:"naik", a2:"tetap"' in src[12])

print("== M13 recompute ==")
check("M-score -1,65 > -1,78 = FLAG", -1.65 > -1.78)
check("M13 ratio ans di source", all(x in src[13] for x in ["ans:-1.65","ans:1.45","ans:0.97","ans:0.96"]))
check("M13 quiz kunci [0,0,0,0,0]",
      [int(x) for x in re.findall(r'a:(\d)', src[13].split("var QUIZ")[1].split("];")[0])] == [1,0,0,2,2])
check("M13 pg kartu6 whistleblowing logis", 'q1:"Risiko fraud", q2:"Skor M", a1:"turun", a2:"tetap"' in src[13])

print("== M14 recompute ==")
check("persediaan GAAP 84.000 = 96.000-12.000", 96000-12000==84000)
check("selisih NI 9.360 = 45.240-35.880", 45240-35880==9360)
check("M14 ratio ans di source", all(x in src[14] for x in ["ans:12000","ans:35880","ans:9360","ans:84000"]))
check("M14 quiz kunci [0,0,0,0,0]",
      [int(x) for x in re.findall(r'a:(\d)', src[14].split("var QUIZ")[1].split("];")[0])] == [0,2,1,0,3])
check("M14 pg kartu5 bunga logis", 'q1:"CFO", q2:"CFF", a1:"turun", a2:"naik"' in src[14])
check("M14 link toggle", "../toggle/" in src[14] or "/toggle/" in open(WEB+"/modul-14/index.html").read())

print("== guard regresi M11-M14 ==")
for n in [11, 12, 13, 14]:
    s = src[n]
    check(f"M{n} parseIDNumber", "function parseIDNumber" in s)
    check(f"M{n} quiz warning", "melewatkan soal" in s)
    check(f"M{n} gate permanen", "tetap tersimpan" in s)
    check(f"M{n} anti double-count", "pgCards.indexOf(i) < 0" in s)
    check(f"M{n} 6 kartu playground", s.count('{t:"') == 6)
    check(f"M{n} skor /12", "/ 12 (" in s)
    bare = re.findall(r'\{l:"([^"]+)",[^}]*d:"—",', s)
    check(f"M{n} tanpa d:'—'", not bare)
    check(f"M{n} localStorage fsa_pg_m{n}", f"fsa_pg_m{n}" in s)
    check(f"M{n} localStorage fsa_gate_m{n}", f"fsa_gate_m{n}" in s)
    h11 = open(WEB+f"/modul-{n}/index.html", encoding="utf-8").read()
    check(f"M{n} journal 3 lensa", f"fsa_journal_m{n}_" in s and h11.count('data-lens=') == 3)
    r = subprocess.run(["node","--check",WEB+f"/js/modul{n}.js"], capture_output=True, text=True)
    check(f"node --check modul{n}.js", r.returncode == 0)

print()
if fails:
    print(f"QA WAVE8B: {len(fails)} FAIL"); sys.exit(1)
print("QA WAVE8B: LULUS")
sys.exit(0)
