#!/usr/bin/env python3
"""QA Gelombang 5 — FSA Lab Modul 3 (Margin, Return & Common-Size). Permanent artifact."""
import re, sys, subprocess, json

WEB = "/home/hatch/workspace/fsa-web"
fails = []

def check(name, cond):
    if not cond: fails.append(name)
    print(("FAIL " if not cond else "ok   ") + name)

m3 = open(f"{WEB}/js/modul3.js", encoding="utf-8").read()
check("modul-3/index.html ada", __import__("os").path.exists(f"{WEB}/modul-3/index.html"))
check("js/modul3.js ada", __import__("os").path.exists(f"{WEB}/js/modul3.js"))
idx = open(f"{WEB}/index.html", encoding="utf-8").read()
check("landing link modul-3", ('href="modul-3/"' in idx or 'href="/modul-3/"' in idx))

print("== rasio recompute independen ==")
check("GM 35.0 vs 34.0", abs(182000/520000*100-35.0)<0.01 and abs(136000/400000*100-34.0)<0.01)
check("OM 13.8 vs 12.0", abs(72000/520000*100-13.85)<0.01)
check("NM 8.70 vs 7.41", abs(45240/520000*100-8.70)<0.01)
avg_ta, avg_e = (451440+378200)/2, (179440+140200)/2
check("ROA 10.9", abs(45240/avg_ta*100-10.91)<0.02)
check("ROE 28.3", abs(45240/avg_e*100-28.31)<0.02)
ic = (179440+31440+110000+60000 + 140200+30000+100000+58000)/2
check("ROIC 15.8", abs(72000*0.78/ic*100-15.84)<0.02)
check("DuPont tie 8.7x1.25x2.60=28.3", abs(8.70/100*(520000/avg_ta)*(avg_ta/avg_e)*100-28.31)<0.05)
check("HPP common-size 65.0 vs 66.0", abs(338000/520000*100-65.0)<0.01)
check("jawaban ratio lab di source", all(x in m3 for x in ["ans:35.0","ans:28.3","ans:10.9","ans:15.8"]))

print("== playground & quiz ==")
check("6 kartu playground", m3.count('{t:"') == 6)
check("skor /12", "/ 12 (" in m3 and "pgDone += 2" in m3)
check("quiz 5 soal, kunci [1,2,0,1,0]",
      [int(x) for x in re.findall(r'a:(\d)', m3.split("var QUIZ")[1].split("];")[0])] == [1,2,0,1,0])

print("== guard regresi ==")
check("parseIDNumber", "function parseIDNumber" in m3)
check("quiz warning terlewat", "melewatkan soal" in m3)
check("gate permanen", "tetap tersimpan" in m3)
check("anti double-count pgCards", "pgCards.indexOf(i) < 0" in m3)
check("playground wajib 2 jawaban", 'n < 2' in m3)
bare = re.findall(r'\{l:"([^"]+)",[^}]*d:"—",', m3)
check("tanpa d:'—'", not bare)
r = subprocess.run(["node","--check",f"{WEB}/js/modul3.js"], capture_output=True, text=True)
check("node --check modul3.js", r.returncode == 0)

print()
if fails:
    print(f"QA WAVE5: {len(fails)} FAIL"); sys.exit(1)
print("QA WAVE5: LULUS")
sys.exit(0)
