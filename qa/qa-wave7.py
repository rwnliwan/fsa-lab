#!/usr/bin/env python3
"""QA Gelombang 7 — FSA Lab Modul 6 (Free Cash Flow). Permanent artifact."""
import os, re, sys, subprocess

WEB = "/home/hatch/workspace/fsa-web"
fails = []

def check(name, cond):
    if not cond: fails.append(name)
    print(("FAIL " if not cond else "ok   ") + name)

check("modul-6/index.html ada", os.path.exists(WEB+"/modul-6/index.html"))
check("js/modul6.js ada", os.path.exists(WEB+"/js/modul6.js"))
idx = open(WEB+"/index.html", encoding="utf-8").read()
check("landing link modul-6", ('href="modul-6/"' in idx or 'href="/modul-6/"' in idx))
m5 = open(WEB+"/js/modul5.js", encoding="utf-8").read()
check("M5 gate link ke modul-6", "../modul-6/" in m5)
m6 = open(WEB+"/js/modul6.js", encoding="utf-8").read()

print("== M6 rasio recompute ==")
int25, int24 = 14000*0.78, 10000*0.78
fcff25, fcff24 = 30800+int25-48000, 44000+int24-40000
check("FCFF -6.280/11.800", fcff25==-6280 and fcff24==11800)
fcfe25, fcfe24 = fcff25-int25+11440, fcff24-int24+0
check("FCFE -5.760/+4.000", abs(fcfe25+5760)<1 and fcfe24==4000)
check("FCFF margin -1.2%", abs(fcff25/520000*100+1.2)<0.05)
check("capex intensity 9.2%", abs(48000/520000*100-9.2)<0.05)
check("artikulasi 30.800-48.000-6.000+11.440=-11.760", 30800-48000-6000+11440==-11760)
check("M6 ratio ans di source", all(x in m6 for x in ["ans:-6280","ans:-5760","ans:-1.2","ans:9.2"]))
check("M6 Q1 definisi benar", "CFO + bunga(1\u2212pajak) \u2212 capex" in m6)
check("M6 quiz kunci [0,1,1,1,1]",
      [int(x) for x in re.findall(r'a:(\d)', m6.split("var QUIZ")[1].split("];")[0])] == [0,2,3,1,1])
# playground card 3: bunga naik -> FCFF tetap, FCFE turun
check("M6 playground card3 logis", 'q1:"FCFF", q2:"FCFE", a1:"tetap", a2:"turun"' in m6)

print("== guard regresi M6 ==")
check("parseIDNumber", "function parseIDNumber" in m6)
check("quiz warning", "melewatkan soal" in m6)
check("gate permanen", "tetap tersimpan" in m6)
check("anti double-count", "pgCards.indexOf(i) < 0" in m6)
check("6 kartu playground", m6.count('{t:"') == 6)
check("ratio terima negatif", "boleh negatif" in m6)
bare = re.findall(r'\{l:"([^"]+)",[^}]*d:"—",', m6)
check("tanpa d:'—'", not bare)
r = subprocess.run(["node","--check",WEB+"/js/modul6.js"], capture_output=True, text=True)
check("node --check modul6.js", r.returncode == 0)

print()
if fails:
    print(f"QA WAVE7: {len(fails)} FAIL"); sys.exit(1)
print("QA WAVE7: LULUS")
sys.exit(0)
