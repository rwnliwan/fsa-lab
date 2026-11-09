#!/usr/bin/env python3
"""QA Round 22 — guard permanen untuk fix review DeepSeek/Terra Ronde 9 (FSA).

Pemetaan ID pusat (konsolidasi R9 §6 — penomoran lokal laporan FSA dipetakan):
- GG-17 pusat = minus ASCII di awal nilai / nilai runtime (lokal GG-17 notasi).
  Pindai string tampilan berawalan U+002D + semua formatter runtime — di FSA
  modul memakai string statis, jadi guard memindai field tampilan
  (v/v2/pct/d/k/f/why/e/hint/q/o/t/l) di js/modul*.js.
- GG-21 pusat = angka tanpa jejak derivasi/basis (lokal GG-19: ROE 28,3% M5).
- GG-22 pusat = label baris identik ganda, arti/tanda berlawanan (lokal GG-18).
- GG-23 pusat = ambang ganda tak berlabel untuk satu vonis (lokal GG-20).
- Penguatan GG-3 (prose-vs-lab/kuis), GG-13 (cakupan parsial dilaporkan
  lengkap), GG-14 (konsistensi lintas-modul: definisi + istilah).

KETERBATASAN (jujur, per perintah Septian 00:53):
- GG-23 hanya mengunci pola cutoff eksplisit ("di bawah/di atas/≥/≤/</> N, Nx")
  yang muncul >=2 nilai berbeda dalam satu baris (d+k). Ambang yang
  dibedakan hanya lewat narasi tanpa pola cutoff, atau yang hidup di field
  f, TIDAK tertangkap — mitigasi: cek positif M33 + daftar ini masuk ke
  prompt review ronde berikut.
- GG-3 D2 hanya mengunci klaim tren kuis yang ditulis "A → B" (panah).
  Hipotetis tanpa panah, atau angka yang kebetulan cocok substring dengan
  data modul lain, TIDAK tertangkap — mitigasi: cek positif M5 + review
  manusia untuk soal kuis baru.
- GG-3 D1 mengunci istilah bernama (Beneish, Altman, Dechow, Jones, Benford,
  Piotroski, Ohlson, Springate, Zmijewski, Merton, Black-Scholes, Sloan,
  DuPont): kuis di modul N hanya boleh memakai istilah yang sudah diajarkan
  di modul <= N. Istilah di luar daftar ini tidak dipindai.
- GG-17 TIDAK memindai placeholder input ("Contoh: -6280") — SENGAJA ASCII:
  parseIDNumber hanya menerima hyphen ASCII sebagai input pengguna; placeholder
  adalah contoh ketikan, bukan nilai tampil. Formatter runtime di luar modul
  (bedah-sendiri-bbri.js, toFixed) TIDAK tercakup guard ini — dicatat untuk
  ronde berikut.
- GG-13 hanya mengunci tabel `status` (M30/M32): baris TURUNAN wajib menyebut
  "ilustratif". Klaim cakupan parsial di tabel lain tidak dipindai.
- GG-14 F2 melarang frasa "utang neto" (arus pinjaman neto) di SEMUA modul —
  "piutang neto" (piutang setelah allowance) adalah istilah BERBEDA dan
  dikecualikan lewat lookbehind.
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


def modul_files():
    d = os.path.join(ROOT, "js")
    return sorted([f for f in os.listdir(d)
                   if f.startswith("modul") and f.endswith(".js")],
                  key=lambda x: int(x[5:-3]))


def row_fields(seg):
    out = {}
    for f in ("d", "k", "psak", "tag", "v2", "v", "pct"):
        m = re.search(r"\b" + f + r':"((?:[^"\\]|\\.)*)"', seg)
        out[f] = m.group(1) if m else ""
    return out


def row_seg(src, label):
    m = re.search(r'\{l:"' + re.escape(label), src)
    if not m:
        return None
    return src[m.start():m.start() + 1800]


def row_has(fn, label, field, needle):
    seg = row_seg(read("js/" + fn), label)
    if seg is None:
        return False
    return needle in row_fields(seg).get(field, "")


def stmts_tables(src):
    """Yield (key, segmen_tabel) dari blok var STMTS."""
    m = re.search(r"var STMTS = \{(.*?)\n\};", src, re.S)
    if not m:
        return []
    body = m.group(1)
    starts = [(tm.group(1), tm.start()) for tm in
              re.finditer(r"(\w+):\{ title:", body)]
    out = []
    for i, (key, st) in enumerate(starts):
        en = starts[i + 1][1] if i + 1 < len(starts) else len(body)
        out.append((key, body[st:en]))
    return out


def quiz_block(src):
    i, j = src.find("var QUIZ"), src.find("/* ---------- RESTORE",
                                          src.find("var QUIZ"))
    return src[i:j] if i >= 0 else ""


# ---------------------------------------------------------------- GG-22: label ganda
_g22_bad = []
for _fn in modul_files():
    _src = read("js/" + _fn)
    for _key, _seg in stmts_tables(_src):
        _labels = re.findall(r'\{l:"((?:[^"\\]|\\.)*)"', _seg)
        _seen = {}
        for _lb in _labels:
            _seen[_lb] = _seen.get(_lb, 0) + 1
        for _lb, _c in _seen.items():
            if _c > 1:
                _g22_bad.append(f"{_fn}/{_key}: {_lb!r} x{_c}")
check("GG-22: tak ada label baris identik ganda dalam satu tabel STMTS (48 modul)",
      not _g22_bad, "; ".join(_g22_bad[:5]))
check("GG-22 positif: M6 'Bunga setelah pajak (dikurangkan)' membedakan add-back",
      row_has("modul6.js", "Bunga setelah pajak (dikurangkan)", "d",
              "dikurangkan untuk sampai ke FCFE"))

# ---------------------------------------------------------------- GG-23: ambang ganda
CUTOFF_RE = re.compile(r"(?:di bawah|di atas|≥|≤|<|>)\s*(\d[,\.]\d+)\s*x", re.I)
ROLE = ["covenant", "break-even", "kecukupan kas", "praktik umum",
        "ambang", "batas"]
_g23_bad = []
for _fn in modul_files():
    _src = read("js/" + _fn)
    for _m in re.finditer(r'\{l:"((?:[^"\\]|\\.)*)"', _src):
        _seg = _src[_m.start():_m.start() + 1800]
        _flds = row_fields(_seg)
        _txt = _flds["d"] + " || " + _flds["k"]
        _allcuts = set(CUTOFF_RE.findall(_txt))
        if len(_allcuts) < 2:
            continue
        # Per nilai ambang: minimal SATU kalimat yang menyebut nilai itu
        # wajib memuat label peran (kalimat lain yang menyebut nilai yang
        # sama tanpa label tidak menggugurkan bila sudah ada yang melabeli).
        _sents = re.split(r"(?<=[.!?])\s+", _txt)
        for _val in sorted(_allcuts):
            _ok = any(_val in _s and any(r in _s.lower() for r in ROLE)
                      for _s in _sents)
            if not _ok:
                _g23_bad.append(f"{_fn}:{_m.group(1)[:40]} ambang {_val} tanpa label peran")
check("GG-23: baris dgn >=2 ambang cutoff wajib melabeli peran tiap ambang",
      not _g23_bad, "; ".join(_g23_bad[:5]))
_m33 = read("js/modul33.js")
_seg33 = row_seg(_m33, "Uji arus kas proposal — DSCR proyeksi")
_f33 = row_fields(_seg33) if _seg33 else {}
check("GG-23 positif: M33 PKPU melabeli 'batas covenant' + 'kecukupan kas'",
      "batas covenant" in _f33.get("d", "") and "kecukupan kas" in _f33.get("d", ""))
check("F-2 positif: M33 tak lagi menulis 'proposal hanya menunda pailit' kategoris",
      "proposal hanya menunda pailit" not in _m33)

# ---------------------------------------------------------------- GG-17: minus ASCII
FLD_RE = re.compile(r'\b(v|v2|pct|d|k|f|why|e|hint|q|o|t|l):"((?:[^"\\]|\\.)*)"')
_g17_bad = []
for _fn in modul_files():
    _src = read("js/" + _fn)
    for _m in FLD_RE.finditer(_src):
        if re.search(r"(?<![\w.])-\d", _m.group(2)):
            _line = _src[:_m.start()].count("\n") + 1
            _g17_bad.append(f"{_fn}:{_line} [{_m.group(1)}] {_m.group(2)[:60]!r}")
check("GG-17: tak ada minus ASCII sebelum digit di string tampilan (48 modul)",
      not _g17_bad, "; ".join(_g17_bad[:5]))
_m17 = read("js/modul17.js")
check("GG-17 positif: M17 Beneish v memakai minus Unicode",
      'v:"−1,65"' in _m17 and 'v2:"di atas −1,78"' in _m17)

# ---------------------------------------------------------------- GG-3: prose-vs-lab/kuis
TOOLS = ["Beneish", "Altman", "Dechow", "Jones", "Benford", "Piotroski",
         "Ohlson", "Springate", "Zmijewski", "Merton", "Black-Scholes",
         "Sloan", "DuPont"]
_first = {}
for _n in range(1, 49):
    _src = read(f"js/modul{_n}.js")
    _qz = quiz_block(_src)
    _rest = _src[:_src.find("var QUIZ")] + _src[_src.find("/* ---------- RESTORE",
                                                       _src.find("var QUIZ")):]
    for _t in TOOLS:
        if _t in _rest and _t not in _first:
            _first[_t] = _n
_g3a_bad = []
for _n in range(1, 49):
    _src = read(f"js/modul{_n}.js")
    _qz = quiz_block(_src)
    for _t in TOOLS:
        if _t in _qz and _n < _first.get(_t, 99):
            _g3a_bad.append(f"M{_n} kuis pakai {_t} (baru diajarkan M{_first.get(_t)})")
check("GG-3a: kuis tak menguji istilah bernama sebelum diajarkan (urutan modul)",
      not _g3a_bad, "; ".join(_g3a_bad[:5]))
check("GG-3a positif: Beneish diajarkan di M2 (lensa forensik LABA BERSIH)",
      "Beneish" in read("js/modul2.js").split("var QUIZ")[0])

TREND_RE = re.compile(r"(\d+(?:[,\.]\d+)?)\s*(x|hari|%|kata)?\s*→\s*(\d+(?:[,\.]\d+)?)\s*(x|hari|%|kata)?")
MARKER = re.compile(r"skenario|hipotetis|misal|andaikan", re.I)


def _tok_variants(num, unit):
    # Varian penulisan angka yang sama: "34%" ~ "34,0%"; "73 hari" ~ "73,0 hari".
    if unit in ("x", "%"):
        return [num + unit, num + ",0" + unit]
    if unit in ("hari", "kata"):
        return [num + " " + unit, num + ",0 " + unit]
    return [num, num + ",0"]


def _tok_present(variants, rest):
    for _tok in variants:
        if re.search(r"(?<![\d,])" + re.escape(_tok) + r"(?![\d,])", rest):
            return True
    return False


_g3b_bad = []
for _n in range(1, 49):
    _src = read(f"js/modul{_n}.js")
    _qz = quiz_block(_src)
    _rest = _src[:_src.find("var QUIZ")]
    for _m in re.finditer(r'\{q:"((?:[^"\\]|\\.)*)"', _qz):
        _q = _m.group(1)
        _tm = TREND_RE.search(_q)
        if not _tm:
            continue
        if MARKER.search(_q):
            continue
        _a = _tok_variants(_tm.group(1), _tm.group(2) or "")
        _b = _tok_variants(_tm.group(3), _tm.group(4) or "")
        if not (_tok_present(_a, _rest) and _tok_present(_b, _rest)):
            _g3b_bad.append(f"M{_n}: {_q[:70]!r} (endpoint tak ada di materi modul)")
check("GG-3b: klaim tren kuis 'A → B' wajib cocok data modul atau berpenanda (skenario)",
      not _g3b_bad, "; ".join(_g3b_bad[:5]))
check("GG-3b positif: M5 soal D/E hipotetis berpenanda (skenario)",
      "(skenario)" in read("js/modul5.js").split("var QUIZ")[1].split("/* ---------- RESTORE")[0])

# GG-3c: basis kolom % — sel di kolom "% X" wajib berupa persen pada basis
# kolom itu: harus memuat "%" (penyebut boleh disebut eksplisit, mis.
# "23,1% dari 520.000") dan TAK BOLEH beda basis (mis. "−35% YoY").
_g3c_bad = []
for _fn in modul_files():
    _src = read("js/" + _fn)
    for _key, _seg in stmts_tables(_src):
        _cm = re.search(r"cols:\[\"Pos\",\"2025\",\"([^\"]+)\"", _seg)
        _cm3 = re.search(r"cols:\[[^\]]*,\"%\"\]", _seg)
        for _rm in re.finditer(r'\{l:"((?:[^"\\]|\\.)*)"', _seg):
            _flds = row_fields(_seg[_rm.start():_rm.start() + 900])
            if _cm and _cm.group(1).startswith("%"):
                _cell = _flds.get("v2", "")
                if _cell != "—" and ("%" not in _cell or "YoY" in _cell):
                    _g3c_bad.append(f"{_fn}/{_key}: {_rm.group(1)[:40]} v2={_cell!r} beda basis")
            if _cm3:
                _cell = _flds.get("pct", "")
                if _cell not in ("—", "") and ("%" not in _cell or "YoY" in _cell):
                    _g3c_bad.append(f"{_fn}/{_key}: {_rm.group(1)[:40]} pct={_cell!r} beda basis")
check("GG-3c: sel kolom '% …' tak berisi basis lain (mis. YoY)",
      not _g3c_bad, "; ".join(_g3c_bad[:5]))
check("GG-3c positif: M6 'Perubahan kas' = −38% dari CFO (bukan −35% YoY)",
      row_has("modul6.js", "Perubahan kas", "v2", "−38%"))

# ---------------------------------------------------------------- GG-13: status TURUNAN
_g13_bad = []
for _n in (30, 32):
    _src = read(f"js/modul{_n}.js")
    for _key, _seg in stmts_tables(_src):
        if _key != "status":
            continue
        for _rm in re.finditer(r'\{l:"((?:[^"\\]|\\.)*)"', _seg):
            _flds = row_fields(_seg[_rm.start():_rm.start() + 1200])
            if "TURUNAN" not in _flds.get("v", ""):
                continue
            _d = _flds.get("d", "")
            if "ilustratif" not in _d.lower():
                _g13_bad.append(f"M{_n} status TURUNAN tanpa sebut 'ilustratif': {_rm.group(1)[:40]}")
            if ("Dihitung dari data dasar dengan" in _d
                    or "Dihitung dari angka kanonis lewat" in _d):
                _g13_bad.append(f"M{_n} status TURUNAN klaim sepihak dari data dasar/kanonis")
check("GG-13: baris TURUNAN di tabel status wajib mengakui input ilustratif",
      not _g13_bad, "; ".join(_g13_bad[:5]))
check("GG-13 positif: M30 TURUNAN = 'data dasar DAN input ilustratif'",
      row_has("modul30.js", "CAR 22,1%", "d", "DAN input ilustratif")
      or row_has("modul30.js", "CAR 22,1%", "d", "dan input ilustratif"))
check("GG-13 positif: M32 TURUNAN = 'angka kanonis DAN asumsi ilustratif'",
      row_has("modul32.js", "PKP 52.000", "d", "DAN asumsi ilustratif")
      or row_has("modul32.js", "PKP 52.000", "d", "dan asumsi ilustratif"))

# ---------------------------------------------------------------- GG-14: lintas-modul
_g14_bad = []
for _fn in modul_files():
    _src = read("js/" + _fn)
    if 'v:"7 komponen"' in _src:
        _g14_bad.append(f"{_fn}: v 7 komponen")
    if re.search(r"(?<!pi)utang neto", _src, re.I):
        _g14_bad.append(f"{_fn}: frasa 'utang neto' (arus) masih dipakai")
_why = read("tools/review_why_data.py")
if re.search(r"(?<!pi)utang neto", _why, re.I):
    _g14_bad.append("tools/review_why_data.py: frasa 'utang neto' masih dipakai")
check("GG-14a: tak ada '7 komponen' dan tak ada frasa 'utang neto' (48 modul)",
      not _g14_bad, "; ".join(_g14_bad[:5]))
_m2 = read("js/modul2.js")
check("GG-14a positif MF-1: M2 '5 komponen (+2 pendamping)' + dokumen pendamping",
      row_has("modul2.js", "Paket laporan lengkap (2.4)", "v", "5 komponen (+2 pendamping)")
      and row_has("modul2.js", "Paket laporan lengkap (2.4)", "d", "dokumen pendamping"))
check("GG-14a positif: M1 tetap '5 komponen' (PSAK 201)",
      row_has("modul1.js", "Paket laporan lengkap (2.4)", "v", "5 komponen"))
check("GG-14a positif SF-3: M6 label 'Pinjaman neto (net borrowing)' + Δ utang bersih",
      row_has("modul6.js", "Pinjaman neto (net borrowing)", "d", "Δ utang bersih M5")
      and row_has("modul6.js", "Pinjaman neto (net borrowing)", "d", "+25.200"))
_m6 = read("js/modul6.js")
check("GG-14a positif SF-3: hint lab FCFE + baris use memakai 'pinjaman neto'",
      "FCFF − bunga(1−pajak) + pinjaman neto" in _m6
      and "Pinjaman neto menutup" in _m6)
check("GG-21 positif N-8: lensa invest M5 menyebut basis ROE 28,3%",
      "45.240" in read("js/modul5.js").split("var LENSES")[1].split("};")[0]
      and "159.820" in read("js/modul5.js").split("var LENSES")[1].split("};")[0])

# ---------------------------------------------------------------- Fix R9 — cek positif per item
check("MF-1: M2 tak lagi mencampur MD&A/opini ke komponen laporan keuangan",
      "IS + BS + arus kas + perubahan ekuitas + CALK + MD&A + opini auditor" not in _m2)
check("SF-1: M2 capex 'Di luar itu terdapat penambahan aset hak-guna Rp2.000 (non-kas)'",
      row_has("modul2.js", "Belanja modal (capex)", "d", "Di luar itu terdapat penambahan aset hak-guna"))
check("SF-2: M4 v2 utang bank pendek 2024 = 30.000 dan akrual 2024 = 0",
      row_has("modul4.js", "Utang bank jangka pendek", "v2", "30.000")
      and row_has("modul4.js", "Akrual", "v2", "0"))
check("SF-4: lensa full goodwill M35 = 4.000, bukan 2.400",
      row_has("modul35.js", "Full goodwill", "k", "4.000")
      and "2.400" not in row_fields(row_seg(read("js/modul35.js"), "Full goodwill")).get("k", ""))
check("F-1: M35 tak lagi menulis 'karena premi pengendalian' sbg penyebab selisih NCI",
      "karena premi pengendalian" not in read("js/modul35.js"))
check("N-2: M3 IS punya baris Laba sebelum pajak 11,2% + catatan pembulatan",
      row_has("modul3.js", "Laba sebelum pajak", "pct", "11,2%")
      and row_has("modul3.js", "LABA BERSIH", "d", "pembulatan"))
check("N-3: factoring M2 berlabel tanpa recourse + syarat derecognition",
      "tanpa recourse" in _m2.split("var TXS")[1].split("var DIMS")[0]
      and "derecognition" in _m2.split("var TXS")[1].split("var DIMS")[0])
check("N-4: M5 tak ada '((6.280))'; NOTE_SOL menulis FCFF −6.280",
      "((6.280))" not in read("js/modul5.js")
      and "FCFF −6.280" in read("js/modul5.js"))
check("N-6: M6 tak ada label 'Bunga setelah pajak' ganda (lihat GG-22)",
      _m6.count('{l:"Bunga setelah pajak",') == 1)
check("G-1: M1 punya baris OCI tahun berjalan + contoh item",
      row_has("modul1.js", "OCI tahun berjalan", "d", "revaluasi")
      and row_has("modul1.js", "OCI tahun berjalan", "d", "selisih kurs"))
check("G-2: M3 BS punya kolom % (Total aset 100%, Ekuitas 39,7%) + kartu lab common-size BS",
      row_has("modul3.js", "Total aset", "pct", "100%")
      and row_has("modul3.js", "Ekuitas", "pct", "39,7%")
      and "Ekuitas sebagai % total aset" in read("js/modul3.js"))
check("G-3: M4 punya baris CCC negatif (contoh ritel)",
      row_has("modul4.js", "CCC negatif", "d", "−30 hari")
      or row_has("modul4.js", "CCC negatif", "v", "−30 hari"))
check("G-4: M5 tabel sol punya baris Total aset 451.440 / 378.200",
      row_has("modul5.js", "Total aset", "v", "451.440")
      and row_has("modul5.js", "Total aset", "v2", "378.200"))

# ---------------------------------------------------------------- G3/G4 (house)
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
check("G3: review bank tak berubah (regen setelah fix sudah di-commit)", _diff == "", _diff)
_bank = read("js/review-bank.js")
check("G3: review bank 252 soal", _bank.count('"m":') == 252, _bank.count('"m":'))


def _pid(s):
    m = re.search(r"function parseIDNumber\(str, isDecimal\)\{.*?\n\}", s, re.S)
    return m.group(0) if m else None


_hashes = {hashlib.md5(_pid(read(f"js/modul{n}.js")).encode()).hexdigest()
           for n in range(1, 49)}
check("G4: parseIDNumber 1 hash di 48 modul", len(_hashes) == 1, str(_hashes))

print()
if fails:
    print(f"QA ROUND22: {len(fails)} FAIL — {fails}")
    sys.exit(1)
print("QA ROUND22: ALL PASS")
