#!/usr/bin/env python3
"""QA Gelombang 9 — FSA Lab Modul 19 (Filing), 20 (Goodwill), 21 (Aturan & Provisi). Permanent artifact."""
import os, re, sys, subprocess

WEB = "/home/hatch/workspace/fsa-web"
fails = []

def check(name, cond):
    if not cond: fails.append(name)
    print(("FAIL " if not cond else "ok   ") + name)

for n in [19, 20, 21]:
    check(f"modul-{n}/index.html ada", os.path.exists(WEB+f"/modul-{n}/index.html"))
    check(f"js/modul{n}.js ada", os.path.exists(WEB+f"/js/modul{n}.js"))

m19 = open(WEB+"/js/modul19.js", encoding="utf-8").read()
m20 = open(WEB+"/js/modul20.js", encoding="utf-8").read()
m21 = open(WEB+"/js/modul21.js", encoding="utf-8").read()

print("== gate links ==")
check("M19 gate -> ../modul-20/", "../modul-20/" in m19)
check("M20 gate -> ../modul-21/", "../modul-21/" in m20)
check("M21 gate Phase 4 Tuntas + -> ../modul-22/", "Phase 4 Tuntas!" in m21 and "../modul-22/" in m21)
check("M19 tidak bocor ke modul-21", "../modul-21/" not in m19)
check("M20 tidak bocor ke modul-19/22", "../modul-19/" not in m20 and "../modul-22/" not in m20)

print("== kicker & brand ==")
for n, src in [(19, m19), (20, m20), (21, m21)]:
    html = open(WEB+f"/modul-{n}/index.html", encoding="utf-8").read()
    check(f"M{n} kicker Phase 4", "Phase 4 · Sumber & Fondasi Filing · Modul "+str(n) in html or "Phase 4 · Sumber &amp; Fondasi Filing · Modul "+str(n) in html)
    check(f"M{n} brand-badge M{n}", '<span class="brand-badge">M'+str(n)+'</span>' in html)

print("== M19 recompute ==")
check("growth 30%", abs((520000-400000)/400000*100-30) < 0.01)
check("net debt 180.000", (31440+110000+60000)-21440 == 180000)
check("akuisisi/ekuitas 33,4%", abs(60000/179440*100-33.4) < 0.05)
check("run-rate 30.800", 23100*4/3 == 30800)
check("M19 ratio ans di source", all(x in m19 for x in ["ans:30","ans:180000","ans:33.4","ans:30800"]))
check("M19 quiz kunci [1,3,0,2,1]",
      [int(x) for x in re.findall(r'a:(\d)', m19.split("var QUIZ")[1].split("];")[0])] == [1,3,0,2,1])
check("M19 fakta EDGAR", "sec.gov/edgar/search" in m19 and "data.sec.gov" in m19 and "DEF 14A" in m19)
check("M19 fakta IDX/OJK", "idx.co.id" in m19 and "OJK" in m19)

print("== M20 recompute (uji artikulasi akuisisi) ==")
check("aset neto 40.000", 75000-35000 == 40000)
check("goodwill 20.000", 60000-40000 == 20000)
check("amortisasi 2.000", 8000/8+4000/4 == 2000)
check("impairment 8.000", 50000-42000 == 8000)
check("goodwill pasca-impairment 12.000", 20000-8000 == 12000)
check("goodwill/ekuitas 11,1%", abs(20000/179440*100-11.1) < 0.05)
check("M20 ratio ans di source", all(x in m20 for x in ["ans:20000","ans:2000","ans:8000","ans:11.1"]))
check("M20 quiz kunci [2,0,3,1,1]",
      [int(x) for x in re.findall(r'a:(\d)', m20.split("var QUIZ")[1].split("];")[0])] == [2,0,3,1,1])
check("M20 PSAK baru", "PSAK 238 (dulu 19)" in m20 and "PSAK 236 (dulu 48)" in m20)

print("== M21 recompute ==")
check("provisi garansi 7.800", 520000*0.015 == 7800)
check("midpoint 10.000", (8000+12000)/2 == 10000)
check("tambahan provisi 2.600", abs(520000*0.005-2600) < 0.01)
check("kontrak memberatkan 1.500", 5000-3500 == 1500)
check("M21 ratio ans di source", all(x in m21 for x in ["ans:7800","ans:10000","ans:2600","ans:1500"]))
check("M21 quiz kunci [0,2,2,3,2]",
      [int(x) for x in re.findall(r'a:(\d)', m21.split("var QUIZ")[1].split("];")[0])] == [0,1,2,3,2])
check("M21 PSAK baru", "PSAK 237 (dulu 57)" in m21 and "PSAK 216 (dulu 16)" in m21)
check("M21 tanpa PSAK 2-digit telanjang",
      not re.search(r'PSAK (19|48|57|16|22)\b(?! \(dulu)', m21))

print("== guard regresi M19-M21 ==")
for name, src, fn in [("M19",m19,"modul19"),("M20",m20,"modul20"),("M21",m21,"modul21")]:
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
    check(f"{name} 5 soal quiz", src.split("var QUIZ")[1].split("];")[0].count('{q:"') == 5)
    keys = [int(x) for x in re.findall(r'a:(\d)', src.split("var QUIZ")[1].split("];")[0])]
    check(f"{name} kunci tersebar (tidak 5/5 satu posisi)", len(set(keys)) > 1)
    r = subprocess.run(["node","--check",WEB+"/js/"+fn+".js"], capture_output=True, text=True)
    check(f"node --check {fn}.js", r.returncode == 0)

print()
if fails:
    print(f"QA WAVE9: {len(fails)} FAIL"); sys.exit(1)
print("QA WAVE9: LULUS")
sys.exit(0)
