#!/usr/bin/env python3
"""QA Round 19 — guard permanen untuk fix review Terra Ronde 8 (FSA).

R19-F1 (GG-7, KELAS — klaim absolut sebagai aturan universal): pemindaian
  kalimat-per-kalimat atas SEMUA field d/k di 48 modul. Kalimat yang memuat
  penanda absolut (WAJIB / HARUS / TIDAK BISA / TIDAK PERNAH / SELALU /
  tidak sah / membatalkan / lupa = salah / tidak bisa) WAJIB punya SATU dari:
  (a) sitasi standar di kalimat yang sama (PSAK/SAK EP/POJK/SA/UU/PP/SEC),
  (b) kualifikasi aturan di kalimat yang sama (secara umum, tergantung,
  jika/bila, dapat berbeda, perlu diverifikasi, dalam konteks, umumnya,
  biasanya, kecuali, dengan syarat, untuk entitas),
  (c) pengecualian "tidak bisa + kata kerja keterbatasan" (disimpulkan,
  dikonfirmasi, disamakan, dijumlah, dibandingkan, diuji, dipastikan,
  diverifikasi, dikreditkan) — pernyataan keterbatasan, bukan aturan,
  (d) masuk ALLOWLIST kalimat yang sudah direview manusia (alasan di bawah).
  Kalimat absolut baru yang tak terkualifikasi = FAIL. Ini mengunci KELAS,
  bukan satu frasa: wording absolut baru dengan kata yang sama tertangkap.
R19-F2 (GG-7, daftar terlarang — tumbuh): frasa absolut SPESIFIK ronde 8
  (metafora "diparkir", inferensi "gelisah", superlatif "abu-abu terbesar",
  dst.) yang TIDAK bisa ditangkap pola umum F1 — DILARANG di semua modul.
  Daftar ini tumbuh tiap ronde; sertakan ke prompt review berikutnya.
R19-F3 (GG-7, positif): tiap lokasi fix R8 membawa kualifikasinya.
R19-F4 (S6b KELAS, statis — bug scope JS): analisis scope berbasis AST
  (acorn): tiap referensi di blok RESTORE harus terikat di scope yang
  melingkupinya; variabel yang hanya dideklarasi di callback lain = FAIL.
  Menangkap kelas "var di callback dipakai di luar scope", bukan hanya
  nama phaseTitle.
R19-F5 (S6b KELAS, eksekusi): tiap modul dieksekusi di node dengan stub DOM
  + gate "lolos" -> gate-box WAJIB ter-render (tidak kosong). Menangkap
  kelas "RESTORE gagal diam-diam di balik try/catch" apa pun penyebabnya.

KETERBATASAN (jujur, per perintah Septian 00:53):
- F1 hanya mengunci penanda absolut yang tercantum. Frasa inferensial
  ("auditor gelisah"), metafora ("laba diparkir"), superlatif ("area
  abu-abu terbesar"), dan generalisasi tanpa penanda modal ("umumnya tidak
  diakui penuh [tanpa yurisdiksi]", "tarif 2%/15% [tanpa kualifikasi]")
  TIDAK tertangkap F1 — dikunci F2/F3 sebagai string spesifik.
  Mitigasi: F2 tumbuh tiap ronde + daftar ini disertakan ke prompt review.
- F1 memakai ambang kalimat: kualifikasi di kalimat lain dalam baris yang
  sama tidak dihitung (sengaja ketat — kualifikasi harus menempel klaimnya).
"""
import json
import os
import re
import subprocess
import sys
import tempfile

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


# ---------------------------------------------------------------- F1: kelas
MARK = [r"WAJIB", r"HARUS", r"TIDAK BISA", r"TIDAK PERNAH", r"SELALU",
        r"tidak sah", r"membatalkan", r"lupa = salah", r"tidak bisa"]
MARK_RE = re.compile("|".join(MARK))
CITE_RE = re.compile(r"(PSAK|SAK EP|POJK|SA 7\d\d|UU |PP |SEC|Regulation)\s*\d*", re.I)
RULEQ = ["secara umum", "tergantung", "jika ", "bila ", "dapat berbeda",
         "perlu diverifikasi", "dalam konteks", "umumnya", "biasanya",
         "kecuali", "dengan syarat", "pada umumnya", "untuk entitas"]
LIMIT_VERB = ["disimpulkan", "dikonfirmasi", "disamakan", "dijumlah",
              "dibandingkan", "diuji", "dipastikan", "diverifikasi",
              "dikreditkan"]

# ALLOWLIST: kalimat absolut yang sudah direview manusia (ronde 8).
# Kunci = kalimat persis (normalisasi spasi). Bila kalimat diedit, kunci
# tidak cocok lagi -> guard me-flag ulang untuk review. Alasan per kalimat:
ALLOW = [
    # M16 — konsekuensi klasifikasi PSAK 109 (SPPI gagal -> FVTPL).
    ("modul16.js", "Gagal SPPI \u2192 otomatis FVTPL, tidak bisa AC/FVOCI."),
    # M16 — kewajiban pengungkapan (PSAK 236/IFRS 13).
    ("modul16.js", "Transfer antar level (mis. pasar jadi tidak aktif) WAJIB diungkap beserta alasannya."),
    # M19 — instruksi metodologis (bandingkan MD&A dgn laporan keuangan).
    ("modul19.js", "Penjelasan manajemen atas hasil, likuiditas & prospek \u2014 WAJIB dibandingkan dengan Item 8."),
    # M21 — syarat pengakuan (estimasi andal), konsekuensi standar.
    ("modul21.js", "Tanpa estimasi andal, kewajiban probable pun tidak bisa diakui."),
    # M23 — pembedaan faktual (breach \u2260 tidak bisa bayar).
    ("modul23.js", "Breach kontraktual \u2260 tidak bisa bayar \u2014 tapi memberi bank hak acceleration."),
    # M25 — pernyataan cakupan skor (tes independen, bukan aturan).
    ("modul25.js", "Kerugian hanya membuat tes INI gagal \u2014 delapan tes lain (CFO, \u0394ROA, akrual, leverage, likuiditas, penerbitan saham, margin, perputaran aset) tetap memberi informasi dan dibaca sendiri-sendiri: skor biner per tes tidak membatalkan satu sama lain."),
    # M27 — instruksi metodologis (cek status adopsi terkini).
    ("modul27.js", "Analis WAJIB cek status adopsi TERKINI sebelum mengandalkannya \u2014 jangan anggap sudah wajib penuh."),
    # M28 — persyaratan standar perubahan kebijakan akuntansi (retrospektif).
    ("modul28.js", "Ganti metode depresiasi, ganti pengakuan pendapatan, ganti model pengukuran \u2014 semua legal, tapi HARUS dijelaskan dan diterapkan retrospektif."),
    # M28 — persyaratan standar peristiwa setelah periode pelaporan (PSAK 210).
    ("modul28.js", "Yang adjusting (memberi bukti kondisi saat neraca) WAJIB disesuaikan; yang non-adjusting cukup diungkap."),
    # M28 — instruksi metodologis (titik awal pembacaan).
    ("modul28.js", "Mulai SELALU dari sini: metode pengakuan pendapatan, depresiasi, persediaan, instrumen keuangan."),
    # M31 — instruksi metodologis (uji sensitivitas asumsi).
    ("modul31.js", "Ini satu-satunya input 'asumsi makro' model ini: bukan hasil analisis, melainkan tebakan eksplisit yang WAJIB diuji sensitivitasnya (lihat playground S1/S2)."),
    # M33 — instruksi metodologis (skenario pailit di rekomendasi kredit).
    ("modul33.js", "Rekomendasi kredit WAJIB memuat skenario pailit: berapa recovery-mu di waterfall likuidasi?"),
    # M34 — identitas aritmetika (alokasi = harga transaksi).
    ("modul34.js", "Cek analis: jumlah alokasi HARUS = harga transaksi."),
    # M35 — aturan penyajian (atribusi laba induk vs NCI wajib dipecah).
    ("modul35.js", "Laporan konsolidasian SELALU memecah laba: 'laba yang dapat diatribusikan kepada pemilik entitas induk' 39.600 dan 'kepentingan nonpengendali' 2.400; total 42.000."),
    # M35 — instruksi metodologis (catat basis atribusi tiap angka).
    ("modul35.js", "Pelajaran: setiap angka yang dikutip WAJIB dicatat basisnya (total / pemilik / NCI) beserta sumber barisnya \u2014 label dan angka harus satu basis."),
    # M35 — prinsip konsolidasi (grup tak bisa menjual ke diri sendiri).
    ("modul35.js", "Grup tidak bisa 'menjual ke diri sendiri' \u2014 yang dihitung hanya penjualan ke pihak ketiga."),
    # M35 — instruksi metodologis (leverage setelah eliminasi).
    ("modul35.js", "Rasio leverage (D/E, debt ratio) WAJIB dihitung dari angka SETELAH eliminasi."),
    # M35 — definisi pengendalian bersama (joint control).
    ("modul35.js", "Satu pihak tidak bisa memutuskan sendiri, betapapun besar porsinya."),
    # M38 — MENYANGKAL klaim absolut (bukan menyatakannya).
    ("modul38.js", "Artinya BUKAN 'tidak bisa dibaca' \u2014 artinya bobot analisis bergeser: konsistensi internal NAIK (apakah angka-angkanya saling mengunci?), jangkar verifikasi eksternal TURUN."),
    # M37 — instruksi metodologis (penyetaraan LIFO via LIFO reserve).
    ("modul37.js", "Akibatnya: emiten AS ber-LIFO tidak bisa dibandingkan langsung dengan emiten Indonesia \u2014 WAJIB disetarakan via LIFO reserve dulu."),
    # M43 — kiasan keterlacakan (MPM tak bisa bersembunyi dari rekonsiliasi).
    ("modul43.js", "MPM tidak dilarang \u2014 tetapi tidak bisa lagi bersembunyi dari rekonsiliasi."),
]
ALLOW_SET = {(fn, re.sub(r"\s+", " ", s).strip()) for fn, s in ALLOW}


def _sentences(t):
    return [s.strip() for s in
            re.split(r"(?<=[.!?])\s+(?=[A-Z0-9\"'\u201c(])", t) if s.strip()]


def _row_fields(seg):
    out = {}
    for f in ("d", "k", "psak", "tag", "v2"):
        m = re.search(r"\b" + f + r':"((?:[^"\\]|\\.)*)"', seg)
        out[f] = m.group(1) if m else ""
    return out


def scan_absolute(fn, src):
    """Kembalikan daftar kalimat absolut tak terkualifikasi di file ini."""
    bad = []
    for m in re.finditer(r'\{l:"((?:[^"\\]|\\.)*)"', src):
        seg = src[m.start():m.start() + 1800]
        flds = _row_fields(seg)
        for field in ("d", "k"):
            for s in _sentences(flds[field]):
                # Semua kemunculan penanda di kalimat diperiksa; kalimat
                # gagal bila SATU PUN kemunculan tak terkualifikasi.
                surviving = None
                for mm in MARK_RE.finditer(s):
                    marker = mm.group(0)
                    if marker == "tidak bisa" and any(
                            v in s[mm.end():mm.end() + 25] for v in LIMIT_VERB):
                        continue
                    if CITE_RE.search(s):
                        continue
                    if any(q in s.lower() for q in RULEQ):
                        continue
                    surviving = marker
                    break
                if surviving is None:
                    continue
                norm = re.sub(r"\s+", " ", s).strip()
                if (fn, norm) in ALLOW_SET:
                    continue
                bad.append(f"{fn}:{m.group(1)[:40]} [{field}] <{surviving}> {s[:110]}")
    return bad


_f1_bad = []
for _fn in modul_files():
    _f1_bad.extend(scan_absolute(_fn, read("js/" + _fn)))
check("F1: tak ada klaim absolut tak terkualifikasi di d/k (48 modul)",
      not _f1_bad, "; ".join(_f1_bad[:5]))

# ---------------------------------------------------------------- F2: denylist
DENY = [
    "lupa = salah hitung",                       # MF-1
    "WAJIB punya baris '+ beban SBC'",           # MF-1
    "(definisi PSAK 201)",                       # SF-1
    "tidak bisa dirugikan",                      # SF-2
    "tidak sah dan membatalkan hedge accounting",  # SF-4
    "tempat laba masa depan 'diparkir'",         # SF-6
    "dipersingkat (repricing)",                  # SF-8
    "auditor sendiri gelisah",                  # SF-11
    "area abu-abu terbesar tahun ini",           # SF-12
    "yang baru muncul = yang baru bermasalah",   # SF-12
    "umumnya tidak diakui penuh sebagai modal inti oleh regulator",  # SF-10
    "semuanya cocok sampai rupiah terakhir",     # N-2
    "imbaIan",                                   # N-4 (typo I kapital)
    'v2:"min OJK 8%"',                          # N-1 (tanpa label ilustratif)
]
_f2_bad = []
for _fn in modul_files():
    _src = read("js/" + _fn)
    for _phrase in DENY:
        if _phrase in _src:
            _line = _src[:_src.index(_phrase)].count("\n") + 1
            _f2_bad.append(f"{_fn}:{_line} {_phrase!r}")
check("F2: daftar terlarang frasa absolut R8 kosong (48 modul)",
      not _f2_bad, "; ".join(_f2_bad[:5]))


# ---------------------------------------------------------------- F3: positif
def row_seg(fn, label):
    src = read("js/" + fn)
    m = re.search(r'\{l:"' + re.escape(label), src)
    if not m:
        return None
    return src[m.start():m.start() + 1800]


def row_has(fn, label, field, needle):
    seg = row_seg(fn, label)
    if seg is None:
        return False
    flds = _row_fields(seg)
    return needle in flds.get(field, "")


check("F3a MF-1 M36 add-back SBC bersyarat dilusi",
      row_has("modul36.js", "SBC dan arus kas: addback non-kas di CFO", "d", "penyesuaian dilusi")
      and row_has("modul36.js", "SBC dan arus kas: addback non-kas di CFO", "d", "saham terdilusi"))
check("F3b SF-1 M32 definisi akuntabilitas publik -> SAK EP",
      row_has("modul32.js", "PSAK penuh", "d", "SAK EP"))
check("F3c SF-2 M32 PPh final redaksi tepat",
      row_has("modul32.js", "PPh final \u2014 PPh Pasal 4 ayat (2)", "d",
              "tidak diperhitungkan lagi dalam PPh non-final"))
check("F3d SF-3 M32 PPh 23 'secara umum' + verifikasi",
      row_has("modul32.js", "PPh 21 / 23 / 25 / 29", "d", "secara umum")
      and row_has("modul32.js", "PPh 21 / 23 / 25 / 29", "d", "perlu diverifikasi"))
check("F3e SF-4 M29 backdated = tak penuhi syarat sejak awal",
      row_has("modul29.js", "Dokumentasi formal di awal", "d", "tidak memenuhi syarat hedge accounting sejak awal"))
check("F3f SF-5 M34 garansi sebut tanggal mulai",
      row_has("modul34.js", "Ukur progress over-time", "d", "sejak Maret 2026"))
check("F3g SF-6 M34 contract asset = hak bersyarat",
      row_has("modul34.js", "Contract asset", "k", "hak bersyarat"))
check("F3h SF-7 M33 waterfall mengikuti dokumen proyek",
      row_has("modul33.js", "Cash waterfall", "d", "dokumen proyek"))
check("F3i SF-8 M36 repricing = modifikasi, bukan vesting",
      row_has("modul36.js", "Vesting dipercepat / kondisi kinerja", "d", "modifikasi"))
check("F3j SF-10 M38 laba interim perlu diverifikasi ke regulator",
      row_has("modul38.js", "CAR interim", "d", "perlu diverifikasi ke"))
check("F3k SF-11 M28 emphasis of matter, opini tetap WTP",
      row_has("modul28.js", "Opini audit tidak WTP / WTP dengan paragraf penekanan", "d", "opini tetap WTP"))
check("F3l SF-12 M28 KAM baru bukan otomatis bermasalah",
      row_has("modul28.js", "KAM (Key Audit Matters) baru", "d", "bukan otomatis yang baru bermasalah"))
_seg13 = row_seg("modul28.js", "MD&A: tone berubah, boilerplate hilang/muncul, kalimat memanjang")
_f13 = _seg13 is not None and 'psak:"PSAK 201"' not in _seg13 and "pasar modal" in _seg13
check("F3m SF-13 M28 MD&A tanpa label PSAK 201, rujuk pasar modal", _f13)
check("F3n N-1 M30 CAR 8% = floor dasar ilustratif",
      row_has("modul30.js", "CAR (KPMM) 22,1%", "d", "floor dasar")
      and row_has("modul30.js", "CAR (KPMM) 22,1%", "v2", "ilustratif"))
check("F3o N-2 M31 klaim artikulasi dibatasi ke angka yang diuji",
      "angka-angka utama yang diuji dalam modul ini terartikulasi" in read("js/modul31.js"))
_m32 = read("js/modul32.js")
check("F3p N-3 M32 beda tetap dikualifikasi 'jika benar-benar permanen' (2 baris)",
      _m32.count("jika benar-benar merupakan beda tetap permanen") >= 2)
check("F3q N-5 M35 goodwill di bawah PSAK 103/236",
      row_has("modul35.js", "Goodwill yang tak pernah diuji penurunannya", "d", "PSAK 103"))
check("F3r N-6 M33 AAA 'secara historis/relatif'",
      row_has("modul33.js", "AAA (ilustratif)", "d", "secara historis"))
_m28 = read("js/modul28.js")
_i = _m28.find("Skor checklist red flag")
check("F3s N-7 M28 skor red flag = jumlah item, bukan probabilitas fraud",
      _i >= 0 and "bukan probabilitas fraud" in _m28[_i:_i + 500])
_m37 = read("js/modul37.js")
check("F3t SF-9 M37 phaseTitle di scope IIFE (sebelum listener quiz-submit)",
      _m37.find("var phaseTitle") >= 0
      and _m37.find("var phaseTitle") < _m37.find('$("#quiz-submit")'))

# ---------------------------------------------------------------- F4: scope
NODE_SCOPE = r"""
const fs = require('fs');
let acorn;
try { acorn = require('acorn'); }
catch (e) {
  acorn = require(process.env.HOME + '/workspace/radar-tokenized-stocks/web/node_modules/acorn');
}
const GLOBALS = new Set(['document','window','localStorage','JSON','Math','console',
  'parseInt','parseFloat','isNaN','isFinite','Number','String','Array','Object',
  'Boolean','setTimeout','clearTimeout','setInterval','clearInterval','location',
  'navigator','alert','RegExp','Date','Error','Promise','Symbol','Map','Set',
  'WeakMap','Intl']);
const PHRASE = 'RESTORE';
const out = {};
for (const f of process.argv.slice(2)) {
  const src = fs.readFileSync(f, 'utf8');
  let ast;
  try { ast = acorn.parse(src, {ecmaVersion: 2024, sourceType: 'script', locations: true}); }
  catch (e) { out[f] = ['PARSE-ERROR: ' + e.message]; continue; }
  // Jangkar: komentar /* ---------- RESTORE ---------- */; blok RESTORE
  // adalah TryStatement pertama yang dimulai sesudah komentar itu.
  const ri = src.indexOf(PHRASE);
  if (ri < 0) { out[f] = ['RESTORE-COMMENT-NOT-FOUND']; continue; }
  let restore = null;
  (function find(n){
    if (!n || typeof n.type !== 'string' || restore) return;
    if (n.type === 'TryStatement' && n.start > ri) { restore = n; return; }
    for (const k of Object.keys(n)) {
      if (k === 'loc' || k === 'range') continue;
      const v = n[k];
      if (Array.isArray(v)) v.forEach(find);
      else if (v && typeof v.type === 'string') find(v);
    }
  })(ast);
  if (!restore) { out[f] = ['RESTORE-TRY-NOT-FOUND']; continue; }
  const bindings = {};
  const refs = [];
  let seq = 0;
  const stack = [];
  function push(kind){ const s = {id: ++seq, kind}; stack.push(s); return s; }
  function pop(){ stack.pop(); }
  function nearestFn(){ for (let i = stack.length - 1; i >= 0; i--) if (stack[i].kind === 'function') return stack[i]; return stack[0]; }
  function bind(name, kind, loc){
    const scope = (kind === 'var' || kind === 'param' || kind === 'function') ? nearestFn() : stack[stack.length - 1];
    (bindings[name] = bindings[name] || []).push({scope: scope.id, loc, kind});
  }
  function bindPattern(p, kind){
    if (!p) return;
    if (p.type === 'Identifier') bind(p.name, kind, p.loc);
    else if (p.type === 'ObjectPattern') p.properties.forEach(pr => bindPattern(pr.value || pr.argument, kind));
    else if (p.type === 'ArrayPattern') p.elements.forEach(e => { if (e) bindPattern(e, kind); });
    else if (p.type === 'AssignmentPattern') bindPattern(p.left, kind);
    else if (p.type === 'RestElement') bindPattern(p.argument, kind);
  }
  function walk(n){
    if (!n || typeof n.type !== 'string') return;
    switch (n.type) {
      case 'Program': push('function'); n.body.forEach(walk); pop(); break;
      case 'FunctionDeclaration':
        if (n.id) bind(n.id.name, 'function', n.id.loc);
        push('function'); n.params.forEach(p => bindPattern(p, 'param')); walk(n.body); pop(); break;
      case 'FunctionExpression': case 'ArrowFunctionExpression':
        push('function'); if (n.id) bind(n.id.name, 'function', n.id.loc);
        n.params.forEach(p => bindPattern(p, 'param')); walk(n.body); pop(); break;
      case 'BlockStatement': push('block'); n.body.forEach(walk); pop(); break;
      case 'CatchClause': push('block'); if (n.param) bindPattern(n.param, 'catch'); walk(n.body); pop(); break;
      case 'VariableDeclaration':
        n.declarations.forEach(d => bindPattern(d.id, n.kind));
        n.declarations.forEach(d => { if (d.init) walk(d.init); }); break;
      case 'MemberExpression': walk(n.object); if (n.computed) walk(n.property); break;
      case 'Property': if (n.computed) walk(n.key); walk(n.value); break;
      case 'Identifier':
        if (n.start >= restore.start && n.end <= restore.end)
          refs.push({name: n.name, loc: n.loc.start.line, chain: stack.map(s => s.id)});
        break;
      case 'LabeledStatement': walk(n.body); break;
      case 'BreakStatement': case 'ContinueStatement': break;
      default:
        for (const k of Object.keys(n)) {
          if (k === 'loc' || k === 'range') continue;
          const v = n[k];
          if (Array.isArray(v)) v.forEach(c => { if (c && typeof c.type === 'string') walk(c); });
          else if (v && typeof v.type === 'string') walk(v);
        }
    }
  }
  walk(ast);
  const viol = [];
  for (const r of refs) {
    if (GLOBALS.has(r.name)) continue;
    const bs = bindings[r.name] || [];
    if (bs.some(b => r.chain.includes(b.scope))) continue;
    if (bs.length) viol.push(r.name + ' (baris ' + r.loc + '): hanya dideklarasi di scope lain (' + bs.map(b => b.kind + '@baris ' + b.loc.start.line).join(', ') + ')');
    else viol.push(r.name + ' (baris ' + r.loc + '): tidak dideklarasi di mana pun');
  }
  out[f] = viol;
}
console.log(JSON.stringify(out));
"""

_scope_files = [os.path.join(ROOT, "js", f) for f in modul_files()]
with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as _tf:
    _tf.write(NODE_SCOPE)
    _scope_js = _tf.name
try:
    _proc = subprocess.run(["node", _scope_js] + _scope_files,
                           capture_output=True, text=True, timeout=180)
    if _proc.returncode != 0:
        check("F4: scope-scan node berjalan", False, _proc.stderr[:200])
        _scope_bad = ["node-error"]
    else:
        _scope_out = json.loads(_proc.stdout)
        _scope_bad = [f"{f}: {v}" for f, vs in _scope_out.items() for v in vs]
        check("F4: semua referensi RESTORE terikat di scope pelingkup (48 modul, AST)",
              not _scope_bad, "; ".join(_scope_bad[:5]))
finally:
    os.unlink(_scope_js)

# ---------------------------------------------------------------- F5: eksekusi
NODE_EXEC = r"""
const fs = require('fs');
const vm = require('vm');
function makeEl(sel){
  return {
    _sel: sel, innerHTML: '', textContent: '',
    style: {}, dataset: {},
    classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    addEventListener(){}, removeEventListener(){},
    appendChild(){}, scrollIntoView(){}, querySelector(){ return makeEl(sel + '>q'); },
    querySelectorAll(){ return []; }, setAttribute(){}, getAttribute(){ return null; },
    closest(){ return null; }, focus(){}, click(){}, value: '', checked: false,
  };
}
const bad = [];
const root = process.argv[2];
for (let n = 1; n <= 48; n++) {
  const mod = 'modul' + n;
  const registry = {};
  const doc = {
    querySelector(s){ if (!registry[s]) registry[s] = makeEl(s); return registry[s]; },
    querySelectorAll(){ return []; },
    createElement(){ return makeEl('created'); },
    addEventListener(){}, getElementById(s){ return this.querySelector('#' + s); },
    body: makeEl('body'), title: '',
  };
  const store = {}; store['fsa_gate_m' + n] = 'lolos';
  const localStorage = { getItem(k){ return k in store ? store[k] : null; },
    setItem(k, v){ store[k] = v; }, removeItem(k){ delete store[k]; } };
  const window = { localStorage };
  const sandbox = { document: doc, localStorage, window, console, JSON, Math,
    setTimeout, clearTimeout, location: {href: ''} };
  sandbox.window.document = doc;
  vm.createContext(sandbox);
  let err = null;
  try { vm.runInContext(fs.readFileSync(root + '/js/' + mod + '.js', 'utf8'), sandbox, {filename: mod + '.js'}); }
  catch (e) { err = String(e).slice(0, 120); }
  const gb = registry['#gate-box'];
  const html = gb ? gb.innerHTML : '';
  if (err || !html.length) bad.push('M' + n + ': err=' + err + ' htmlLen=' + html.length);
}
console.log(JSON.stringify(bad));
"""
with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as _tf:
    _tf.write(NODE_EXEC)
    _exec_js = _tf.name
try:
    _proc = subprocess.run(["node", _exec_js, ROOT],
                           capture_output=True, text=True, timeout=180)
    if _proc.returncode != 0:
        check("F5: exec-test node berjalan", False, _proc.stderr[:200])
    else:
        _exec_bad = json.loads(_proc.stdout)
        check("F5: gate-box RESTORE ter-render di semua modul (gate=lolos, 48 modul)",
              not _exec_bad, "; ".join(_exec_bad[:5]))
finally:
    os.unlink(_exec_js)

print()
if fails:
    print(f"QA ROUND19: {len(fails)} FAIL \u2014 {fails}")
    sys.exit(1)
print("QA ROUND19: ALL PASS")
