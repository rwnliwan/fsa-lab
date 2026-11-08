#!/usr/bin/env python3
"""QA Round 18 — guard permanen untuk fix Instinct Recheck Round 14 (9,0/10).

R14-F1: quiz length cue — kunci unik-terpanjang <= 10/252 per bank; tak ada modul
        dengan >=4 kunci unik-terpanjang; nol qualifier template di distractor.
R14-F2: Credit Memo satu sumber bunga (tak ada #s-int); spread 2025 = kanonis
        (EBITDA 102.000, bunga 14.000, utang berbunga 201.440).
R14-F3: semua call-site parseIDNumber lab memakai flag desimal per soal (r.ans % 1).
R14-F4: Komparator — edit sel utang menghapus flag _leaseIncluded; note diperbarui.
R14-F5: kartu M33 tak lagi tulis "1-2 di bawah issuer" (contoh modul = 3 notch).
R14-F6: PETUNJUK 4 workbook — kolom A <= 90 (muat area cetak), wrap aktif.
R18-F7 (polish Nov 2026): tie-luck / luck-pass tiap modul <= 25% (model R18 §3:
        fixed single-rank strategy, tie block width k -> 1/k, Poisson-binomial,
        gate 4/5; implementasi kanonis qa/qa-luckpass.py).
R18-F8 (QA-update Nov 2026): koefisien Dechow Model 1 di M25 terkunci (rumus
        lengkap 7 koefisien terbitan + contoh F = 2,25; tanpa koefisien draf 2007).
"""
import json
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


NODE_EXTRACT = r"""
const fs = require('fs');
function extractArr(src, varName) {
  const m = src.match(new RegExp('var ' + varName + '\\s*=\\s*\\['));
  if (!m) return null;
  let i = src.indexOf('[', m.index), depth = 0, start = i;
  let inStr = null, esc = false;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) { esc = false; }
      else if (c === '\\') { esc = true; }
      else if (c === inStr) { inStr = null; }
      continue;
    }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '[') depth++;
    if (c === ']') { depth--; if (!depth) break; }
  }
  return eval(src.slice(start, i + 1));
}
const out = {modules: {}, bank: null};
const _nums = fs.readdirSync('js').filter(f => f.startsWith('modul') && f.endsWith('.js'))
  .map(f => parseInt(f.slice(5, -3), 10)).sort((a, b) => a - b);
for (const n of _nums) {
  const p = 'js/modul' + n + '.js';
  try {
    const q = extractArr(fs.readFileSync(p, 'utf8'), 'QUIZ');
    if (q) out.modules[n] = q.map(x => ({o: x.o, a: x.a}));
  } catch (e) { out.modules[n] = {error: String(e)}; }
}
try {
  out.bank = extractArr(fs.readFileSync('js/review-bank.js', 'utf8'), 'REVIEW_BANK')
    .map(x => ({m: x.m, o: x.o, a: x.a}));
} catch (e) { out.bank = {error: String(e)}; }
console.log(JSON.stringify(out));
"""

# ---------- R14-F1: quiz length cue ----------
proc = subprocess.run(["node", "-e", NODE_EXTRACT], cwd=ROOT, capture_output=True, text=True)
check("F1: ekstraksi QUIZ+bank via node", proc.returncode == 0, proc.stderr[:200])
data = json.loads(proc.stdout) if proc.returncode == 0 else {"modules": {}, "bank": []}

QUALIFIERS = ["dalam kondisi normal", "bila tidak ada one-off", "menurut definisi standar",
              "bila dihitung konsisten"]


def key_rank(o, a):
    """Strict length rank of the key (1 = longest). Ties share the better rank."""
    kl = len(o[a])
    r = 1
    for v in sorted((len(s) for s in o), reverse=True):
        if v > kl:
            r += 1
        else:
            break
    return r


def analyze(questions, label):
    total = len(questions)
    uniq_longest = 0
    qual_hits = []
    per_mod = {}
    rank_dist = {}  # R15: distribusi rank kunci per modul {m: {rank: count}}
    for q in questions:
        o, a = q["o"], q["a"]
        lens = [len(s) for s in o]
        others = [l for i, l in enumerate(lens) if i != a]
        if lens[a] > max(others):
            uniq_longest += 1
            m = q.get("m")
            if m:
                per_mod[m] = per_mod.get(m, 0) + 1
        m = q.get("m")
        if m:
            rd = rank_dist.setdefault(m, {})
            r = key_rank(o, a)
            rd[r] = rd.get(r, 0) + 1
        for i, s in enumerate(o):
            if i == a:
                continue
            low = s.lower()
            for qp in QUALIFIERS:
                if qp in low:
                    qual_hits.append((label, q.get("m"), s[:60]))
    return total, uniq_longest, qual_hits, per_mod, rank_dist


mod_qs = []
for n, qs in data["modules"].items():
    if isinstance(qs, dict) and "error" in qs:
        check(f"F1: modul {n} ter-parse", False, qs["error"])
        continue
    for q in qs:
        q["m"] = int(n)
        mod_qs.append(q)
bank_qs = data["bank"] if isinstance(data["bank"], list) else []

t1, u1, qh1, pm1, rd1 = analyze(mod_qs, "modul")
t2, u2, qh2, pm2, rd2 = analyze(bank_qs, "bank")
check("F1: 252 soal modul", t1 == 252, f"got {t1}")
check("F1: 252 soal review bank", t2 == 252, f"got {t2}")
check("F1: kunci unik-terpanjang modul <= 10", u1 <= 10, f"{u1}/{t1}")
check("F1: kunci unik-terpanjang bank <= 10", u2 <= 10, f"{u2}/{t2}")
bad_mods = [m for m, c in pm1.items() if c >= 4]
check("F1: tak ada modul dgn >=4 kunci unik-terpanjang", not bad_mods, str(bad_mods))
bad_mods_b = [m for m, c in pm2.items() if c >= 4]
check("F1: bank — tak ada modul dgn >=4 kunci unik-terpanjang", not bad_mods_b, str(bad_mods_b))
# R15: anti-morph — tak ada SATU rank pun yang >=4 di satu modul (longest/second/dst.)
bad_rank = [(m, r, c) for m, d in rd1.items() for r, c in d.items() if c >= 4]
check("F1: tak ada rank >=4 di satu modul (anti-morph)", not bad_rank, str(bad_rank))
bad_rank_b = [(m, r, c) for m, d in rd2.items() for r, c in d.items() if c >= 4]
check("F1: bank — tak ada rank >=4 di satu modul", not bad_rank_b, str(bad_rank_b))
check("F1: nol qualifier template di distractor", not (qh1 or qh2), str((qh1 + qh2)[:3]))

# ---------- R14-F2: Credit Memo satu sumber ----------
mk = read("memo-kredit/memo-kredit.js")
mkh = read("memo-kredit/index.html")
check("F2: tak ada #s-int di JS", "s-int" not in mk)
check("F2: tak ada #s-int di HTML", "s-int" not in mkh)
check("F2: spread 2025 EBITDA 102000", "v:[70000, 102000, 120000]" in mk)
check("F2: spread 2025 bunga 14000", "v:[15000, 14000, 18000]" in mk)
check("F2: spread 2025 utang berbunga 201440", "v:[240000, 201440, 250000]" in mk)
check("F2: label 'Utang berbunga' (bukan Total utang)", '"Utang berbunga"' in mk or "{l:\"Utang berbunga\"" in mk)
check("F2: stress pakai sel spread 2026F", "data[5].v[2]" in mk)

# ---------- R14-F3 / R15-F2: flag desimal per soal (+ r.dec opsional) ----------
bad_calls = []
for n in range(1, 44):
    src = read(f"js/modul{n}.js")
    for m in re.finditer(r'parseIDNumber\(\$\("#rin"\+i\)\.value(.*?)\)', src):
        if "r.dec !== undefined" not in m.group(1):
            bad_calls.append(f"modul{n}")
check("F3: semua call-site lab pakai flag r.dec/r.ans", not bad_calls, str(bad_calls[:5]))

# ---------- R16-F2: semua lab jawaban bulat deklarasi dec eksplisit ----------
NODE_DEC = r"""
const fs = require('fs');
function extractArr(src, varName) {
  const m = src.match(new RegExp('var ' + varName + '\\s*=\\s*\\['));
  if (!m) return null;
  let i = src.indexOf('[', m.index), depth = 0, start = i;
  let inStr = null, esc = false;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) { esc = false; }
      else if (c === '\\') { esc = true; }
      else if (c === inStr) { inStr = null; }
      continue;
    }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '[') depth++;
    if (c === ']') { depth--; if (!depth) break; }
  }
  return eval(src.slice(start, i + 1));
}
const bad = [];
for (let n = 1; n <= 43; n++) {
  let lab = null;
  try { lab = extractArr(fs.readFileSync('js/modul' + n + '.js', 'utf8'), 'RATIOS'); } catch (e) {}
  if (!lab) continue;
  lab.forEach((r, i) => {
    if (r && typeof r.ans === 'number' && r.ans % 1 === 0 && r.dec === undefined)
      bad.push('M' + n + ' R' + (i + 1));
  });
}
console.log(JSON.stringify(bad));
"""
proc = subprocess.run(["node", "-e", NODE_DEC], cwd=ROOT, capture_output=True, text=True)
_missing = json.loads(proc.stdout or "[]")
check("F3b: semua lab jawaban bulat deklarasi dec eksplisit", not _missing, str(_missing[:8]))

# ---------- R17-F1: parser fungsional (format Indonesia penuh di mode desimal) ----------
NODE_PARSER = r"""
const fs = require('fs');
const src = fs.readFileSync('js/modul34.js', 'utf8');
eval(src.match(/function parseIDNumber[\s\S]*?\n\}/)[0]);
const cases = [
  ['13.333,33', true, 13333.33], ['7.407,41', true, 7407.41],
  ['1.234.567,89', true, 1234567.89],
  ['13333,33', true, 13333.33], ['13333.33', true, 13333.33],
  ['1.970', true, 1.97], ['73.000', true, 73], ['2.26', true, 2.26],
  ['1,97', true, 1.97], ['1.2.3', true, NaN], ['221440abc', true, NaN],
  ['221.440', false, 221440], ['13.333,33', false, 13333.33],
  ['1.970', false, 1970], ['73.000', false, 73000],
];
const bad = [];
cases.forEach(([inp, dec, exp]) => {
  const v = parseIDNumber(inp, dec);
  const ok = (isNaN(exp) && isNaN(v)) || Math.abs(v - exp) < 1e-9;
  if (!ok) bad.push(inp + '/' + dec + '=' + v);
});
console.log(JSON.stringify(bad));
"""
proc = subprocess.run(["node", "-e", NODE_PARSER], cwd=ROOT, capture_output=True, text=True)
_pbad = json.loads(proc.stdout or '["extract-fail"]')
check("F3c: parser lolos 15 kasus (ID penuh + regresi)", not _pbad, str(_pbad[:5]))

# ---------- R14-F4: Komparator lease flag ----------
kmp = read("komparator/komparator.js")
kmph = read("komparator/index.html")
check("F4: edit utang menghapus _leaseIncluded",
      re.search(r'if\s*\(\s*k\s*===\s*"utang"\s*\)\s*delete rows\[i\]\._leaseIncluded', kmp) is not None)
check("F4: note tak lagi bilang 'jangan centang ... belum disesuaikan'",
      "jangan centang lease bila utang belum disesuaikan" not in kmph)

# ---------- R14-F5: kartu M33 ----------
m33 = read("js/modul33.js")
check("F5: kartu tak tulis '1–2 di bawah issuer'", "di-notch 1–2 di bawah issuer" not in m33)

# ---------- R18-F7 (polish Nov 2026): tie-luck / luck-pass <= 25% ----------
# Model Instinct R18 §3: fixed single-rank strategy (pilih opsi terpanjang ke-r,
# r=1..4, acak seragam di dalam tie block); tie block lebar k yang menutupi
# posisi r bisa dieksploitasi dengan probabilitas 1/k; peluang lolos gate modul
# (ceil 80% x jumlah soal: 4/5, 7/8) via Poisson-binomial (aritmetika eksak,
# Fraction). Implementasi kanonis + dokumentasi metode: qa/qa-luckpass.py
# (skrip ini menghitung ulang dari data QUIZ yang sudah diekstrak di atas agar
# round18 tetap self-contained).
from fractions import Fraction as _Fr


def _blocks(o, a):
    order = sorted(range(len(o)), key=lambda i: -len(o[i]))
    blocks = []
    i, pos = 0, 1
    while i < len(order):
        j = i
        while j + 1 < len(order) and len(o[order[j + 1]]) == len(o[order[i]]):
            j += 1
        idxs = order[i:j + 1]
        blocks.append((set(range(pos, pos + len(idxs))), a in idxs, len(idxs)))
        pos += len(idxs)
        i = j + 1
    return blocks


def _strat_p(o, a, r):
    for positions, key_inside, width in _blocks(o, a):
        if r in positions:
            return _Fr(1, width) if key_inside else _Fr(0)
    return _Fr(0)


def _p_pass(ps, gate=4):
    dist = [_Fr(1)]
    for p in ps:
        nd = [_Fr(0)] * (len(dist) + 1)
        for k, v in enumerate(dist):
            nd[k] += v * (1 - p)
            nd[k + 1] += v * p
        dist = nd
    return sum(dist[gate:])


_luck_bad = []
for _n in sorted({q["m"] for q in mod_qs}):
    _qs = [q for q in mod_qs if q["m"] == _n]
    _gate = -(-len(_qs) * 4 // 5)  # gate modul = ceil(80% x soal): 4/5, 7/8
    _best = max((_p_pass([_strat_p(q["o"], q["a"], r) for q in _qs], _gate)
                 for r in range(1, 5)), default=_Fr(0))
    if _best > _Fr(1, 4):
        _luck_bad.append(f"M{_n} {float(_best) * 100:.1f}%")
check("F7: luck-pass tiap modul <= 25% (R18 tie-block)", not _luck_bad, str(_luck_bad))

# ---------- R14-F6: PETUNJUK print ----------
from openpyxl import load_workbook  # noqa: E402

TPLS = ["fsa-lab-beneish-calculator.xlsx", "fsa-lab-altman-calculator.xlsx",
        "fsa-lab-ratio-dashboard.xlsx", "fsa-lab-dcf-input-builder.xlsx"]
for t in TPLS:
    p = os.path.join(ROOT, "downloads", "templates", t)
    if not os.path.exists(p):
        check(f"F6: {t} ada", False)
        continue
    wb = load_workbook(p)
    ws = wb["PETUNJUK"]
    w = ws.column_dimensions["A"].width
    check(f"F6: {t} kolom A <= 90", (w or 0) <= 90, f"width={w}")
    wraps = sum(1 for row in ws.iter_rows(min_row=5) for c in row
                if c.value and c.alignment.wrap_text)
    check(f"F6: {t} wrap aktif di baris petunjuk", wraps > 0, f"wraps={wraps}")

# ---------- R18-F8: koefisien Dechow Model 1 (M25) ----------
# Ronde 5: 5/7 koefisien lesson salah vs Model 1 terbitan (varian draf 2007).
# Kunci rumus lengkap + contoh F agar tidak berbalik diam-diam.
_m25 = read("js/modul25.js")
_DECHOW = "−7,893 + 0,790·RSST + 2,518·ΔREC + 1,191·ΔINV + 1,979·SOFT + 0,171·ΔCS − 0,932·ΔROA + 1,029·ISSUE"
check("F8: rumus Dechow Model 1 lengkap (7 koefisien terbitan)", _DECHOW in _m25)
check("F8: tanpa koefisien draf 2007 (1,437/1,125/0,207/2,947)",
      not any(x in _m25 for x in ["1,437", "1,125", "0,207", "2,947"]))
check("F8: contoh F = 2,25", "F = 0,00834 ÷ 0,0037 = 2,25" in _m25)

print()
if fails:
    print(f"QA ROUND18: {len(fails)} FAIL — {fails}")
    sys.exit(1)
print("QA ROUND18: ALL PASS")
