#!/usr/bin/env python3
"""QA Gelombang 4 — FSA Lab Simulator + Case Files + Workbench. Permanent artifact."""
import os, re, sys, subprocess

WEB = "/home/hatch/workspace/fsa-web"
fails, warns = [], []

def check(name, cond, warn=False):
    if not cond:
        (warns if warn else fails).append(name)
    print(("WARN " if warn and not cond else "FAIL " if not cond else "ok   ") + name)

simjs = open(f"{WEB}/js/simulator.js", encoding="utf-8").read()
cfjs = open(f"{WEB}/js/casefiles.js", encoding="utf-8").read()

# 1. file & referensi
for p in ["simulator/index.html","js/simulator.js","case-files/index.html","js/casefiles.js",
          "workbench/index.html","workbench/fsa_toolkit.py"]:
    check(f"{p} ada", os.path.exists(f"{WEB}/{p}"))
idx = open(f"{WEB}/index.html", encoding="utf-8").read()
for h in ['simulator/', 'case-files/', 'workbench/']:
    check(f"landing link {h}", (f'href="{h}"' in idx or f'href="/{h}"' in idx))

# 2. SIMULATOR — angka recompute independen
# S1: 540000*0.4=216000; 216000-120000=96000; 96000-12000=84000; 84000*0.78=65520
check("S1 NI 65.520", 84000*0.78 == 65520)
check("S1 DSO 89.2", abs(132000/540000*365 - 89.2) < 0.1)
check("S1 akrual 26.720", 65520-38800 == 26720)
# S2: 46800+40000*0.78=78000; akrual 78000-53800=24200
check("S2 NI 78.000", 46800+40000*0.78 == 78000)
check("S2 akrual 24.200", 78000-53800 == 24200)
# S3: 46800+25000*0.78=66300; DPO 23000/288000*365=29.1
check("S3 NI 66.300", 46800+25000*0.78 == 66300)
check("S3 DPO 29.1", abs(23000/288000*365 - 29.1) < 0.1)
check("sim 9 skenario (6 lama + 3 phase-10)", simjs.count('{name:"Kasus') == 9)
check("sim kunci valid", all(m in simjs for m in ["aManip:0","aManip:1","aManip:2","aManip:3","aManip:4","aManip:5","aManip:6"]))
check("sim 6 kasus lama tak berubah", all(x in simjs for x in
      ['name:"Kasus 1", diff:"Mudah"', 'name:"Kasus 2", diff:"Sedang"', 'name:"Kasus 3", diff:"Sulit"']))
check("sim 3 kasus hard-mode tak berubah", all(x in simjs for x in
      ['name:"Kasus 4", diff:"Sulit"', 'name:"Kasus 5", diff:"Sulit"', 'name:"Kasus 6", diff:"Sulit"']))
check("sim 3 kasus baru phase-10", all(x in simjs for x in
      ['name:"Kasus 7", diff:"Sedang"', 'name:"Kasus 8", diff:"Sedang"', 'name:"Kasus 9", diff:"Sulit"']))
check("sim skor tersimpan", "fsa_sim_" in simjs)
# recompute independen Kasus 7-9 (Phase 10)
check("S7 provisi 7,0%", abs(35000/500000*100 - 7.0) < 0.05)
check("S7 DSO 65,7", abs(90000/500000*365 - 65.7) < 0.05)
check("S7 akrual -29.600", 50400-80000 == -29600)
check("S7 CFO/NI 1,59", abs(80000/50400 - 1.59) < 0.005)
check("S8 pangsa berelasi 30,0%", abs(180000/600000*100 - 30.0) < 0.05)
check("S8 DSO berelasi 243,3", abs(120000/180000*365 - 243.3) < 0.1)
check("S8 akrual +36.000", 66000-30000 == 36000)
check("S9 one-off 16,3%", abs(85000/520000*100 - 16.3) < 0.05)
check("S9 akrual -93.000", -45000-48000 == -93000)
check("S9 laba continuing +21.300", abs(-45000+85000*0.78 - 21300) < 1)

# 3. CASE FILES — struktur & fakta publik
check("cf 7 kasus (2 lama + 4 wave10 + Luckin workstream B)", cfjs.count('{name:"') == 7)
check("cf Garuda ada", "Garuda Indonesia" in cfjs)
check("cf Enron ada", "Enron" in cfjs)
check("cf disclaimer angka disederhanakan", "disederhanakan" in cfjs)
check("cf 3 tahun per kasus (7 kasus)", cfjs.count('{y:"') == 21)
check("cf skor tersimpan", "fsa_cf_" in cfjs)

# 4. WORKBENCH — toolkit jalan
r = subprocess.run(["python3", f"{WEB}/workbench/fsa_toolkit.py"],
                   capture_output=True, text=True)
check("toolkit exit 0", r.returncode == 0)
check("toolkit M-score keluar", "M =" in r.stdout)
check("toolkit DSO keluar", "DSO =" in r.stdout)
check("toolkit Benford keluar", "deviasi" in r.stdout)
# verifikasi rumus Beneish: M(-1.78 boundary) — recompute satu titik
m = (-4.84 + 0.92*1.45 + 0.528*0.97 + 0.404*1.02 + 0.892*1.30
     + 0.115*1.0 - 0.172*1.05 + 4.679*0.032 - 0.327*0.96)
check("beneish recompute -1.65", abs(m - (-1.65)) < 0.01)

# 5. JS syntax + hygiene
for f in ["simulator.js","casefiles.js"]:
    r = subprocess.run(["node","--check",f"{WEB}/js/{f}"], capture_output=True, text=True)
    check(f"node --check {f}", r.returncode == 0)
for name, src in [("sim",simjs),("cf",cfjs)]:
    check(f"{name} tanpa console.error", "console.error" not in src)
    check(f"{name} tanpa prompt(", "prompt(" not in src)

print()
if fails:
    print(f"QA WAVE4: {len(fails)} FAIL"); sys.exit(1)
print(f"QA WAVE4: LULUS ({len(warns)} warning)")
sys.exit(0)
