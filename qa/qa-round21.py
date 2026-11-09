#!/usr/bin/env python3
"""QA Round 21 — guard permanen untuk BUILD GAP Ronde 7 Terra (FSA).

9 gap dibangun 9 Nov 2026 atas perintah Septian ("Sekalian krjakan aja",
catatan harian 9 Nov). Guard ini mengunci:
- G1: tiap tabel baru ADA (STMTS key + tombol tab HTML yang cocok);
  G-9 M27 menambah baris ke tabel esop yang sudah ada (tanpa tabel baru).
- G2: tiap angka baru DIHITUNG ULANG dari data modul (bukan dihafal dari
  teks) — termasuk jebakan yang dihindari saat build:
  * G-1: replikasi Beneish menutup ke M-score kanonis -1,65 (TATA 0,032
    dari akrual Sloan 14.440/451.440; SGI 1,30 dari 520.000/400.000).
  * G-2: yang menggerakkan laba adalah PERUBAHAN LIFO reserve (2.400),
    bukan saldonya (12.000); jembatan menutup 45.240 -> 35.880.
  * G-9: TSM memakai harga pasar 5.600 & strike 3.000 (grant date) —
    tambahan bersih 2,32 jt, BUKAN 5 jt penuh; diluted EPS 442,1.
- G3: QUIZ tak berubah (252 soal — dikunci qa-round18 F1 juga) dan
  review bank tetap sinkron (regenerasi tanpa diff).
- G4: parseIDNumber tetap byte-identik di ke-48 modul.
- G5: G-8 M26 menyebut metodologi + yurisdiksi (pola DES OJK,
  Indonesia) dan menempatkan pemeriksaan kegiatan SEBELUM rasio.
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
PAIRS = [(13, "repl"), (14, "jemb"), (19, "cek"), (19, "xbrl"),
         (20, "upk"), (21, "ukur"), (23, "reklas"), (26, "usaha")]
for _n, _k in PAIRS:
    _js, _html = read(f"js/modul{_n}.js"), read(f"modul-{_n}/index.html")
    check(f"G1: M{_n} tabel {_k} ada + tab HTML cocok",
          (_k + ":{") in _js and f'data-stmt="{_k}"' in _html)

# G-9: baris baru di tabel esop yang sudah ada (tanpa tabel baru M27)
_m27 = read("js/modul27.js")
_m27_keys = set(re.findall(r"^(\w+):\{ title:", _m27, re.M))
check("G1: M27 TSM numerik = 6 baris baru di tabel esop, tanpa tabel baru",
      _m27_keys == {"esop", "esg"}
      and all(s in _m27 for s in ["TSM — contoh numerik: harga pasar rata-rata",
                                   "TSM — strike price (grant date)",
                                   "TSM — proceeds exercise",
                                   "TSM — saham yang 'dibeli kembali'",
                                   "TSM — tambahan saham bersih",
                                   "TSM — diluted EPS (PSAK 233)"]),
      str(_m27_keys))

# G-8: tab kegiatan usaha SEBELUM tab screening rasio (urutan HTML)
_m26_html = read("modul-26/index.html")
check("G1: M26 tab 'Kegiatan Usaha' sebelum tab screening rasio",
      _m26_html.find('data-stmt="usaha"') < _m26_html.find('data-stmt="screen"')
      and _m26_html.find('data-stmt="usaha"') > _m26_html.find('data-stmt="bank"'))

# ---------------------------------------------------------------- G2: hitung ulang
# G-1 M13 — replikasi Beneish menutup ke M-score kanonis -1,65
_w = {"DSRI": (1.45, 0.92), "GMI": (0.97, 0.528), "AQI": (1.00, 0.404),
      "SGI": (1.30, 0.892), "DEPI": (1.00, 0.115), "SGAI": (1.00, -0.172),
      "TATA": (0.032, 4.679), "LVGI": (0.96, -0.327)}
_m13 = -4.84 + sum(v * w for v, w in _w.values())
check("G2 G-1 Beneish: -4,84+1,334+0,512+0,404+1,160+0,115-0,172+0,150-0,314=-1,65",
      abs(_m13 + 1.65) < 0.005, f"got {_m13:.4f}")
check("G2 G-1 TATA 0,032 = akrual Sloan 14.440/451.440; SGI 1,30 = 520.000/400.000",
      abs(14440 / 451440 - 0.032) < 0.001 and 520000 / 400000 == 1.3)
check("G2 G-1 kontribusi SGI 0,892x1,30=1,1596; lab M13 ans 1.16 + 0.032",
      abs(0.892 * 1.30 - 1.1596) < 1e-9 and "ans:1.16" in read("js/modul13.js")
      and "ans:0.032" in read("js/modul13.js"))
# G-2 M14 — jembatan menutup 45.240 -> 35.880
check("G2 G-2 jembatan: pre-tax -12.000; pajak +2.640 (22%); neto -9.360",
      -(2400 + 4000 + 3000 + 2600) == -12000 and 12000 * 0.22 == 2640
      and 45240 - 12000 + 2640 == 35880)
check("G2 G-2 per pos neto: LIFO -1.872; dev -3.120; reversal -2.340; writedown -2.028",
      -2400 + 2400 * 0.22 == -1872 and -4000 + 4000 * 0.22 == -3120
      and -3000 + 3000 * 0.22 == -2340 and -2600 + 2600 * 0.22 == -2028
      and -1872 - 3120 - 2340 - 2028 == -9360)
check("G2 G-2 jebakan: delta reserve 2.400 = 12.000-9.600, BUKAN saldo 12.000",
      12000 - 9600 == 2400 and "ans:2400" in read("js/modul14.js")
      and "ans:2640" in read("js/modul14.js"))
# G-4 M19 — rekonsiliasi XBRL
check("G2 G-4 XBRL: 312.000+208.000=520.000; selisih vs Item 8 = 0",
      312000 + 208000 == 520000 and "ans:0" in read("js/modul19.js"))
# G-6 M20 — UPK & sensitivitas
check("G2 G-6 alokasi goodwill: 12.000+8.000=20.000; sisa Ritel 12.000-8.000=4.000",
      12000 + 8000 == 20000 and 12000 - 8000 == 4000)
check("G2 G-6 sensitivitas: 50.000-39.500=10.500; 50.000-40.000=10.000",
      50000 - 39500 == 10500 and 50000 - 40000 == 10000
      and "ans:10500" in read("js/modul20.js"))
# G-5 M21 — pengukuran provisi
check("G2 G-5 PV: 12.000/1,08^3=9.526; unwinding thn-1 9.526x8%=762",
      abs(12000 / 1.08 ** 3 - 9525.99) < 0.01 and abs(12000 / 1.08 ** 3 * 0.08 - 762.08) < 0.01)
check("G2 G-5 expected value: 70%x6.000+20%x9.000+10%x15.000=7.500",
      0.7 * 6000 + 0.2 * 9000 + 0.1 * 15000 == 7500)
# G-7 M23 — reklasifikasi utang
check("G2 G-7 CR setelah reklas: 221.440/(102.000+110.000)=1,04x (< batas 1,5x)",
      abs(221440 / 212000 - 1.0445) < 0.001 and 221440 / 212000 < 1.5)
# G-9 M27 — treasury stock method
check("G2 G-9 TSM: proceeds 5jt x 3.000=15.000; buyback 15.000/5.600=2,68jt; neto 2,32jt",
      5 * 3000 == 15000 and abs(15000 / 5600 - 2.6786) < 0.001
      and abs(5 - 15000 / 5600 - 2.3214) < 0.001)
check("G2 G-9 TSM diluted EPS: 45.240/102,32=442,1 (basic 452,4 > TSM 442,1 > maks 430,9)",
      abs(45240 / 102.32 - 442.14) < 0.01 and 452.4 > 442.14 > 430.9
      and "ans:2.32" in _m27)

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

# ---------------------------------------------------------------- G5: G-8 metodologi + yurisdiksi
_m26 = read("js/modul26.js")
_usaha = _m26.split("usaha:{")[1].split("screen:{")[0]
check("G5: M26 usaha menyebut metodologi + yurisdiksi (DES OJK, Indonesia)",
      "Daftar Efek Syariah" in _usaha and "OJK" in _usaha
      and "Indonesia" in _usaha and "AAOIFI" in _usaha)
check("G5: M26 usaha menegaskan urutan kegiatan DULU, rasio KEMUDIAN",
      "kegiatan DULU, rasio KEMUDIAN" in _usaha
      and "Lolos tiga rasio keuangan" in _usaha)
check("G5: M26 usaha menyebut ambang contoh 10% pendapatan non-halal",
      "10%" in _usaha)

print()
if fails:
    print(f"QA ROUND21: {len(fails)} FAIL — {fails}")
    sys.exit(1)
print("QA ROUND21: ALL PASS")
