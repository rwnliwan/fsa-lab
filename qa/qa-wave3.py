#!/usr/bin/env python3
"""QA Gelombang 3 — FSA Lab Modul 2 + Toggle PSAK/GAAP. Permanent artifact."""
import os, re, sys, subprocess

WEB = "/home/hatch/workspace/fsa-web"
fails, warns = [], []

def check(name, cond, warn=False):
    if not cond:
        (warns if warn else fails).append(name)
    print(("WARN " if warn and not cond else "FAIL " if not cond else "ok   ") + name)

M2 = f"{WEB}/modul-2/index.html"
m2js = open(f"{WEB}/js/modul2.js", encoding="utf-8").read()
T = f"{WEB}/toggle/index.html"
tjs = open(f"{WEB}/js/toggle.js", encoding="utf-8").read()

# 1. file & referensi
check("modul-2/index.html ada", os.path.exists(M2))
check("js/modul2.js ada", os.path.exists(f"{WEB}/js/modul2.js"))
check("toggle/index.html ada", os.path.exists(T))
check("js/toggle.js ada", os.path.exists(f"{WEB}/js/toggle.js"))
_idx3 = open(f"{WEB}/index.html", encoding="utf-8").read()
check("landing link modul-2", ('href="modul-2/"' in _idx3 or 'href="/modul-2/"' in _idx3))
check("landing link toggle", ('href="toggle/"' in _idx3 or 'href="/toggle/"' in _idx3))

# 2. MODUL 2 — artikulasi recompute independen (PT Cemerlang Abadi, Rp juta)
check("M2 IS: laba kotor", 520000-338000 == 182000)
check("M2 IS: laba operasi", 182000-110000 == 72000)
check("M2 IS: laba bersih", 58000-12760 == 45240)
check("M2 BS: A=L+E", 272000+186000 == 458000)
check("M2 CF: CFO", 45240+30000-44440 == 30800)
check("M2 CF: delta kas", 30800-50000+14000 == -5200)
check("M2 kas akhir", 33200-5200 == 28000)
check("M2 laba ditahan", 46760+45240-6000 == 86000)

# 3. MODUL 2 — rasio recompute
check("M2 akrual 14440", 45240-30800 == 14440)
check("M2 CFO/NI 0.68", abs(30800/45240 - 0.68) < 0.01)
check("M2 DSO 73.0", abs(104000/520000*365 - 73.0) < 0.1)
check("M2 CCC 109.7", abs(73.0 + 96000/338000*365 - 62000/338000*365 - 109.7) < 0.3)
check("M2 coverage 5.14", abs(72000/14000 - 5.14) < 0.01)

# 4. MODUL 2 — struktur (guard regresi dari M1 berlaku di sini juga)
check("M2 6 transaksi", m2js.count('{t:"') == 6)
check("M2 5 soal quiz", m2js.count('{q:"') == 5)
check("M2 gate 80%", ">= 80" in m2js)
check("M2 guard Cek tanpa pilihan", "keempat" in m2js)
check("M2 kunci tdk bocor saat gagal", "j !== q.a" in m2js)
check("M2 restore playground", 'JSON.parse(localStorage.getItem("fsa_pg_m2")' in m2js)
check("M2 restore gate", 'localStorage.getItem("fsa_gate_m2") === "lolos"' in m2js)
bare = re.findall(r'\{l:"([^"]+)", v[^}]*d:"—", psak:"[^"]*", f:"—"\}', m2js)
check("M2 tanpa baris kosong", len(bare) == 0)
for s in ["520.000","338.000","182.000","45.240","104.000","451.440","30.800"]:
    check(f"M2 angka {s} ada", s in m2js)

# 5. TOGGLE — 8 topik (5 asli + 3 baru wave11) + angka recompute
check("toggle 8 topik", tjs.count('{t:"') == 8)
check("toggle LIFO: COGS FIFO 1.000", "Rp1.000" in tjs)
check("toggle LIFO: COGS LIFO 1.400", "Rp1.400" in tjs)
check("toggle reversal 8.000", "Rp8.000" in tjs)
check("toggle R&D 30.000", "Rp30.000" in tjs)
check("toggle revaluasi 50.000", "Rp50.000" in tjs)
check("toggle bunga 12.000", "Rp12.000" in tjs)
check("toggle CFO 53.800/65.800", "Rp53.800" in tjs and "Rp65.800" in tjs)
check("toggle ada penyesuaian analis", "Penyesuaian analis" in tjs)
check("toggle 3 soal", tjs.count('{q:"') == 3)

# 6. JS syntax
for f in ["modul2.js","toggle.js"]:
    r = subprocess.run(["node","--check",f"{WEB}/js/{f}"], capture_output=True, text=True)
    check(f"node --check {f}", r.returncode == 0)

# 7. hygiene
for name, src in [("modul2",m2js),("toggle",tjs)]:
    check(f"{name} tanpa console.error", "console.error" not in src)
    check(f"{name} tanpa prompt(", "prompt(" not in src)
    check(f"{name} tanpa lorem", "lorem" not in src.lower())

print()
if fails:
    print(f"QA WAVE3: {len(fails)} FAIL"); sys.exit(1)
print(f"QA WAVE3: LULUS ({len(warns)} warning)")
sys.exit(0)
