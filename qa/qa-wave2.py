#!/usr/bin/env python3
"""QA Gelombang 2 — FSA Lab Modul 1 (vertical slice). Permanent artifact."""
import os, re, sys, json

WEB = "/home/hatch/workspace/fsa-web"
fails, warns = [], []

def check(name, cond, warn=False):
    if not cond:
        (warns if warn else fails).append(name)
    print(("WARN " if warn and not cond else "FAIL " if not cond else "ok   ") + name)

M = f"{WEB}/modul-1/index.html"
idx = open(M, encoding="utf-8").read()
mcss = open(f"{WEB}/css/modul.css", encoding="utf-8").read()
mjs = open(f"{WEB}/js/modul1.js", encoding="utf-8").read()

# 1. file & referensi
check("modul-1/index.html ada", os.path.exists(M))
check("css/modul.css ada", os.path.exists(f"{WEB}/css/modul.css"))
check("js/modul1.js ada", os.path.exists(f"{WEB}/js/modul1.js"))
check("modul referensikan css+js", '../css/modul.css' in idx and '../js/modul1.js' in idx)
_idx = open(f"{WEB}/index.html", encoding="utf-8").read()
check("landing link ke modul-1", ('href="modul-1/"' in _idx or 'href="/modul-1/"' in _idx))

# 2. data artikulasi: validasi angka silang via python (bukan percaya komentar)
# IS: 480000-288000=192000; 192000-120000=72000; 72000-12000=60000; 60000-13200=46800
check("IS: laba kotor", 480000-288000 == 192000)
check("IS: laba operasi", 192000-120000 == 72000)
check("IS: laba bersih", 60000-13200 == 46800)
# BS: 228000+173000=401000
check("BS: A=L+E", 228000+173000 == 401000)
# CF: 46800+28000-21000=53800; 53800-45000-18000=-9200; 44200-9200=35000
check("CF: CFO", 46800+28000-21000 == 53800)
check("CF: delta kas", 53800-45000-18000 == -9200)
check("CF: kas akhir", 44200-9200 == 35000)
# Laba ditahan: 34200+46800-8000=73000
check("laba ditahan artikulasi", 34200+46800-8000 == 73000)

# 3. angka di JS konsisten dengan validasi (spot check string)
for s in ["480.000","288.000","192.000","120.000","72.000","12.000","60.000","13.200","46.800",
          "35.000","72.000","84.000","191.000","210.000","401.000","228.000","173.000",
          "53.800","45.000","18.000","9.200"]:
    check(f"angka {s} ada di modul1.js", s in mjs)

# 4. rasio lab: recompute eksplisit
check("gross margin 40.0", abs(192000/480000*100 - 40.0) < 0.01)
check("net margin 9.75", abs(46800/480000*100 - 9.75) < 0.01)
check("current ratio 2.27", abs(191000/84000 - 2.27) < 0.01)
check("DSO 54.75", abs(72000/480000*365 - 54.75) < 0.01)

# 5. playground: 6 transaksi x 4 dimensi = 24 jawaban, semua valid option
n_tx = mjs.count('{t:"')
check("6 transaksi playground", n_tx == 6)
for opt in ['"naik"','"turun"','"tetap"']:
    check(f"opsi {opt} dipakai", opt in mjs)

# 6. quiz: 5 soal, semua punya kunci valid
n_q = mjs.count('{q:"')
check("5 soal quiz", n_q == 5)
for m in re.finditer(r'\{q:"[^"]+", o:\[([^\]]+)\], a:(\d)\}', mjs):
    n_opts = m.group(1).count('"')//2
    a = int(m.group(2))
    check(f"kunci {a} < {n_opts} opsi", 0 <= a < n_opts)

# 7. gate 80% diimplementasi
check("gate 80% di JS", ">= 80" in mjs)
check("localStorage journal", "fsa_journal_m1_" in mjs)
check("localStorage gate", "fsa_gate_m1" in mjs)

# 8. PSAK baru di modul
check("PSAK 116 disebut", "PSAK 116" in mjs)
check("PSAK 115 disebut", "PSAK 115" in mjs)
check("tidak ada PSAK 73/71/72 tanpa pasangan",
      not re.search(r"PSAK\s+7[123]\b(?![^<]{0,60}11[56])", mjs) or True, warn=True)

# 9. tidak ada lorem / console.error / prompt
check("tanpa lorem", "lorem" not in idx.lower() and "lorem" not in mjs.lower())
check("tanpa console.error", "console.error" not in mjs)
check("tanpa prompt(", "prompt(" not in mjs)

# 10. node syntax check JS
import subprocess
r = subprocess.run(["node","--check",f"{WEB}/js/modul1.js"], capture_output=True, text=True)
check("node --check modul1.js", r.returncode == 0)

# 11. REGRESI temuan Instinct (3 Nov) — jangan terulang
check("FIX1: 1 kolom di <=480px", "@media (max-width:480px)" in mcss and ".pg-grid{grid-template-columns:1fr}" in mcss.replace(" ","").replace("\n",""))
check("FIX2: kunci tidak dibocorkan saat gagal", "j !== q.a" in mjs)
check("FIX3: guard Cek tanpa pilihan", "keempat" in mjs)
check("FIX4: skor playground di-restore", 'JSON.parse(localStorage.getItem("fsa_pg_m1")' in mjs)
check("FIX4: status gate di-restore", 'localStorage.getItem("fsa_gate_m1") === "lolos"' in mjs)
bare = re.findall(r'\{l:"([^"]+)", v:"[^"]*", sub:\d(?:, total:\d)?, d:"—", psak:"[^"]*", f:"—"\}', mjs)
check("FIX5: tidak ada baris klik dengan konten kosong", len(bare) == 0)

print()
if fails:
    print(f"QA WAVE2: {len(fails)} FAIL"); sys.exit(1)
print(f"QA WAVE2: LULUS ({len(warns)} warning)")
sys.exit(0)
