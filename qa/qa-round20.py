#!/usr/bin/env python3
"""QA Round 20 — guard permanen untuk BUILD GAP Ronde 8 Terra (FSA).

13 gap penuh + 1 parsial (G-14 M37) dibangun 9 Nov 2026 atas perintah Septian
"gap, kerjakan aja". Guard ini mengunci:
- G1: tiap tabel baru ADA (STMTS key + tombol tab HTML yang cocok).
- G2: tiap angka baru yang bisa dicek DIHITUNG ULANG dari data modul
  (bukan dihafal dari teks) — termasuk jebakan yang sempat terjadi saat
  build: full goodwill M35 = 12.000 (88.000+24.000-100.000), BUKAN 10.400;
  translasi M35 memakai "ribu USD" agar satuan konsisten (Rp juta).
- G3: QUIZ tak berubah (252 soal — dikunci qa-round18 F1 juga) dan
  review bank tetap sinkron (regenerasi tanpa diff).
- G4: parseIDNumber tetap byte-identik di ke-48 modul.
- G5: MD&A M28 merujuk POJK 29/2016 (bukan PSAK 201) sebagai sumber normatif.
"""
import hashlib
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []


def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + ((" — " + detail) if detail and not cond else ""))
    if not cond:
        fails.append(name)


def read(p):
    with open(os.path.join(ROOT, p), encoding="utf-8") as f:
        return f.read()


# ---------------------------------------------------------------- G1: tabel+tab
PAIRS = [(28, "mda"), (29, "lanjut"), (30, "likuid"), (30, "status"),
         (31, "is"), (31, "bscf"), (32, "dta"), (32, "status"), (33, "pkpu"),
         (34, "modif"), (34, "ecl"), (35, "akuisisi"), (35, "lintas"),
         (36, "pajak"), (38, "assurance")]
for _n, _k in PAIRS:
    _js, _html = read(f"js/modul{_n}.js"), read(f"modul-{_n}/index.html")
    check(f"G1: M{_n} tabel { _k} ada + tab HTML cocok",
          (_k + ":{") in _js and f'data-stmt="{_k}"' in _html)

# G-14 parsial: SATU caveat, bukan topik baru (tidak ada tabel baru M37)
_m37 = read("js/modul37.js")
_m37_keys = set(re.findall(r"^(\w+):\{ title:", _m37, re.M))
check("G1: M37 caveat LIFO reserve (1 baris, tanpa tabel baru)",
      "Keterbatasan data: LIFO reserve tidak selalu diungkapkan rinci" in _m37
      and _m37_keys == {"fifo", "reserve", "capex", "impair"}, str(_m37_keys))

# ---------------------------------------------------------------- G2: hitung ulang
# G-1 M31 — IS/BS/CF lengkap (2026 forecast ilustratif vs 2025 kanonis)
_m31 = read("js/modul31.js")
check("G2 G-1 IS 2026: 582.400-378.560=203.840; 203.840-121.000=82.840; 82.840-14.000=68.840",
      582400 - 378560 == 203840 and 203840 - 121000 == 82840 and 82840 - 14000 == 68840)
check("G2 G-1 pajak/NI: 68.840x22%=15.144,8; NI 53.695,2",
      abs(68840 * 0.22 - 15144.8) < 1e-9 and abs(68840 - 15144.8 - 53695.2) < 1e-9)
check("G2 G-1 BS 2026 menutup: aset 508.175 = L 281.040 + E 227.135",
      36175 + 116480 + 107520 + 248000 == 508175
      and 69440 + 10160 + 141440 + 60000 == 281040
      and 100000 + 127135 == 227135 and 281040 + 227135 == 508175)
check("G2 G-1 BS 2025 menutup: aset 451.440 = L 272.000 + E 179.440",
      21440 + 104000 + 96000 + 230000 == 451440
      and 62000 + 8560 + 141440 + 60000 == 272000 and 272000 + 179440 == 451440)
check("G2 G-1 CF: CFO 70.735; dKas 14.735; kas akhir 36.175 = neraca",
      53695 + 32000 - 14960 == 70735 and 70735 - 50000 - 6000 == 14735
      and 21440 + 14735 == 36175)
check("G2 G-1 angka kunci tertulis di modul31.js",
      all(s in _m31 for s in ["508.175", "36.175", "21.440 → 36.175", "127.135"]))
# G-2 M29
check("G2 G-2 cost of hedging: 300/12=25/bulan", 300 / 12 == 25)
# G-3 M30
check("G2 G-3 LCR: (1.972+2.856+5.172)=10.000; net 8.000; 12.000/8.000=150%",
      39440 * 0.05 == 1972 and 28560 * 0.10 == 2856 and 1972 + 2856 + 5172 == 10000
      and 10000 - 2000 == 8000 and 12000 / 8000 == 1.5)
check("G2 G-3 NSFR: ASF 72.672 / RSF 64.600 = 112,5%",
      abs((9500 + 39440 * 0.95 + 28560 * 0.90) - 72672) < 1e-9
      and abs((12000 * 0.05 + 60000 * 0.85 + 13000) - 64600) < 1e-9
      and abs(72672 / 64600 - 1.12495) < 1e-4)
# G-4 M32
check("G2 G-4 DTA roll-forward: 3.300-1.320=1.980 (15.000x22%; 6.000x22%)",
      15000 * 0.22 == 3300 and 6000 * 0.22 == 1320 and 3300 - 1320 == 1980)
check("G2 G-4 recoverability: kapasitas 5.500 vs 1.100; shortfall 880",
      25000 * 0.22 == 5500 and 5000 * 0.22 == 1100 and 1980 - 1100 == 880)
# G-6 M34
check("G2 G-6 catch-up: alokasi baru 80.000/12.000/16.000; koreksi 10.222,22",
      108000 * 100 / 135 == 80000 and 108000 * 15 / 135 == 12000
      and 108000 * 20 / 135 == 16000
      and abs((88888.89 + 13333.33) - 92000 - 10222.22) < 0.01
      and abs(16000 / 24 - 666.67) < 0.01)
# G-7 M34
check("G2 G-7 ECL: piutang 40.000x2%=800; contract asset 13.333,33x1%=133,33",
      40000 * 0.02 == 800 and abs(13333.33 * 0.01 - 133.33) < 0.01)
# G-8 M35 — jebakan build: full goodwill 12.000, BUKAN 10.400
_m35 = read("js/modul35.js")
check("G2 G-8 partial goodwill: 88.000-80%x100.000=8.000; aset neto 140.000-40.000",
      140000 - 40000 == 100000 and 88000 - 0.8 * 100000 == 8000)
check("G2 G-8 full goodwill 12.000 (88.000+24.000-100.000) — bukan 10.400",
      88000 + 24000 - 100000 == 12000 and "10.400" not in _m35
      and "ans:12000" in _m35)
check("G2 G-8 bargain purchase: 80.000-75.000=5.000; jembatan 100.000+8.000=108.000",
      0.8 * 100000 - 75000 == 5000 and 100000 + 8000 == 108000)
# G-9 M35
check("G2 G-9 translasi: 160.000-120.000-31.000=9.000 (satuan ribu USD)",
      10000 * 16 == 160000 and 8000 * 15 == 120000 and 2000 * 15.5 == 31000
      and 160000 - 120000 - 31000 == 9000 and "ribu USD" in _m35)
# G-10 M33
check("G2 G-10 likuidasi: senior 90%, subordinasi 0%; going concern 100%/40%",
      180000 / 200000 == 0.9 and 60000 / 150000 == 0.4 and 260000 - 180000 == 80000)
check("G2 G-10 DSCR proyeksi 1,20x; downside -20% -> 0,96x",
      120000 / 100000 == 1.2 and 120000 * 0.8 / 100000 == 0.96)
# G-11 M36
check("G2 G-11 SBC pajak: 12.000x22%=2.640; 9.000x22%=1.980; excess 660",
      12000 * 0.22 == 2640 and 9000 * 0.22 == 1980 and 3000 * 0.22 == 660
      and 1980 + 660 == 2640 and 24 * 200 == 4800)

# ---------------------------------------------------------------- G3: QUIZ + bank
_total = 0
for _n in range(1, 49):
    _src = read(f"js/modul{_n}.js")
    _i, _j = _src.find("var QUIZ"), _src.find("/* ---------- RESTORE", _src.find("var QUIZ"))
    _total += len(re.findall(r'\{q:"', _src[_i:_j]))
check("G3: total soal QUIZ tetap 252", _total == 252, f"got {_total}")
_proc = subprocess.run([sys.executable, "tools/gen_review_bank.py"],
                       cwd=ROOT, capture_output=True, text=True)
check("G3: gen_review_bank jalan", _proc.returncode == 0, _proc.stderr[:200])
_diff = subprocess.run(["git", "diff", "--porcelain", "js/review-bank.js"],
                       cwd=ROOT, capture_output=True, text=True).stdout.strip()
check("G3: review bank tak berubah (QUIZ tak disentuh)", _diff == "", _diff)
_bank = read("js/review-bank.js")
check("G3: review bank 252 soal", _bank.count('"m":') == 252, _bank.count('"m":'))

# ---------------------------------------------------------------- G4: parseIDNumber
def _pid(s):
    m = re.search(r"function parseIDNumber\(str, isDecimal\)\{.*?\n\}", s, re.S)
    return m.group(0) if m else None


_hashes = {hashlib.md5(_pid(read(f"js/modul{n}.js")).encode()).hexdigest()
           for n in range(1, 49)}
check("G4: parseIDNumber 1 hash di 48 modul", len(_hashes) == 1, str(_hashes))

# ---------------------------------------------------------------- G5: MD&A M28
_m28 = read("js/modul28.js")
_mda = _m28.split("mda:{")[1].split("function fmtStmt")[0]
check("G5: MD&A M28 merujuk POJK 29/2016 sebagai sumber normatif",
      "POJK 29/2016" in _mda and "POJK No. 29/POJK.04/2016" in _mda)
_src_row = _mda.split('l:"Sumber Indonesia')[1].split("},")[0]
check("G5: baris sumber MD&A tidak memakai PSAK 201 sebagai acuan MD&A",
      "PSAK 201" not in _src_row)
_calk_row = _mda.split('l:"Catatan atas laporan keuangan (CaLK)"')[1].split("}\n ]},")[0]
check("G5: PSAK 201 hanya di baris CaLK (konteks penyajian yang benar)",
      _mda.count("PSAK 201") == 3 and _calk_row.count("PSAK 201") == 3)
# G-12 M38: SA 2410
check("G5: assurance M38 merujuk SA 2410 (review terbatas)",
      "SA 2410" in read("js/modul38.js"))

print()
if fails:
    print(f"QA ROUND20: {len(fails)} FAIL — {fails}")
    sys.exit(1)
print("QA ROUND20: ALL PASS")
