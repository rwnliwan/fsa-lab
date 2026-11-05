#!/usr/bin/env python3
"""QA Gelombang 6 — FSA Lab Modul 4 (Modal Kerja & CCC) + Modul 5 (Likuiditas & Solvabilitas). Permanent artifact."""
import os, re, sys, subprocess

WEB = "/home/hatch/workspace/fsa-web"
fails = []

def check(name, cond):
    if not cond: fails.append(name)
    print(("FAIL " if not cond else "ok   ") + name)

import os
for m, d in [("modul4","modul-4"),("modul5","modul-5")]:
    check(f"{d}/index.html ada", os.path.exists(WEB+"/"+d+"/index.html"))
    check(f"js/{m}.js ada", os.path.exists(WEB+"/js/"+m+".js"))
idx = open(f"{WEB}/index.html", encoding="utf-8").read()
check("landing link modul-4", ('href="modul-4/"' in idx or 'href="/modul-4/"' in idx))
check("landing link modul-5", ('href="modul-5/"' in idx or 'href="/modul-5/"' in idx))
m4 = open(f"{WEB}/js/modul4.js", encoding="utf-8").read()
m5 = open(f"{WEB}/js/modul5.js", encoding="utf-8").read()
check("M4 gate link ke modul-5", "../modul-5/" in m4)

print("== M4 rasio recompute ==")
check("DSO 73.0/50.2", abs(104000/520000*365-73.0)<0.05 and abs(55000/400000*365-50.2)<0.05)
check("DIO 103.7/110.6", abs(96000/338000*365-103.7)<0.05 and abs(80000/264000*365-110.6)<0.05)
check("DPO 67.0/69.1", abs(62000/338000*365-67.0)<0.05 and abs(50000/264000*365-69.1)<0.05)
check("CCC 109.7/91.7", abs(73.0+103.7-67.0-109.7)<0.05)
check("WC 119.440/88.200", 221440-102000==119440 and 168200-80000==88200)
check("M4 ratio ans di source", all(x in m4 for x in ["ans:73.0","ans:103.7","ans:67.0","ans:109.7"]))
check("M4 quiz kunci [0,1,1,1,0]",
      [int(x) for x in re.findall(r'a:(\d)', m4.split("var QUIZ")[1].split("];")[0])] == [0,3,2,1,0])

print("== M5 rasio recompute ==")
check("CR 2.17", abs(221440/102000-2.17)<0.005)
check("QR 1.23", abs((221440-96000)/102000-1.23)<0.005)
check("D/E 1.52", abs(272000/179440-1.52)<0.005)
check("Coverage 5.14", abs(72000/14000-5.14)<0.01)
check("ND/EBITDA 1.76", abs((201440-21440)/(72000+30000)-1.76)<0.01)
check("M5 ratio ans di source", all(x in m5 for x in ["ans:2.17","ans:1.23","ans:1.52","ans:5.14"]))
check("M5 quiz kunci [0,2,0,1,0]",
      [int(x) for x in re.findall(r'a:(\d)', m5.split("var QUIZ")[1].split("];")[0])] == [0,2,0,1,3])
# playground card 2 M5: lunasi utang -> CR naik 2.17->2.66
check("M5 playground card2 CR naik valid", abs((221440-30000)/(102000-30000)-2.66)<0.01)

print("== guard regresi M4+M5 ==")
for name, src, fn in [("M4",m4,"modul4"),("M5",m5,"modul5")]:
    check(f"{name} parseIDNumber", "function parseIDNumber" in src)
    check(f"{name} quiz warning", "melewatkan soal" in src)
    check(f"{name} gate permanen", "tetap tersimpan" in src)
    check(f"{name} anti double-count", "pgCards.indexOf(i) < 0" in src)
    check(f"{name} 6 kartu playground", src.count('{t:"') == 6)
    bare = re.findall(r'\{l:"([^"]+)",[^}]*d:"—",', src)
    check(f"{name} tanpa d:'—'", not bare)
    r = subprocess.run(["node","--check",WEB+"/js/"+fn+".js"], capture_output=True, text=True)
    check(f"node --check {fn}.js", r.returncode == 0)

print()
if fails:
    print(f"QA WAVE6: {len(fails)} FAIL"); sys.exit(1)
print("QA WAVE6: LULUS")
sys.exit(0)
