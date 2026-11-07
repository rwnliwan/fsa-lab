#!/usr/bin/env python3
"""QA Round 15 — guard permanen untuk Phase 10 (hardening teknis, Builder A).

G1: _headers ada + memuat semua header wajib (CSP/HSTS/X-Frame/Permissions/Referrer/CTO)
G2: CSP tidak memblokir JS — smoke test: tak ada <script> inline, tak ada event
    handler inline, tak ada javascript: URL, semua <script src> & <link> resolve,
    script-src TANPA 'unsafe-inline', tak ada sumber eksternal http(s)
G3: canonical absolut + trailing slash konsisten di 81 halaman, path cocok direktori
G4: font self-hosted — tak ada referensi Google Fonts di HTML, css/fonts.css ada,
    semua woff2 yang dirujuk ada di disk, font-display: swap
G5: export/import progres — tombol + input + penjelasan batasan ada di review/;
    merge logic (SM-2 naik-saja, mistake union, gate OR) roundtrip via node
G6: section "Mulai di sini" di landing — ada SEBELUM #kurikulum, 3 jalur persona,
    tiap jalur: modul awal + prasyarat + estimasi + 1 CTA
"""
import os, re, sys, subprocess, json, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []

def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + ((" — " + detail) if detail and not cond else ""))
    if not cond:
        fails.append(name)

def read(p):
    with open(os.path.join(ROOT, p), encoding="utf-8") as f:
        return f.read()

def pages():
    out = []
    for dirpath, _d, files in os.walk(ROOT):
        for fn in files:
            if fn != "index.html":
                continue
            rel = os.path.relpath(os.path.join(dirpath, fn), ROOT)
            if rel.startswith("partials/"):
                continue
            out.append(rel)
    return sorted(out)

PAGES = pages()
check("halaman terdeteksi 81", len(PAGES) == 81, f"dapat {len(PAGES)}")

# ---- G1: _headers ----
try:
    h = read("_headers")
    check("G1 _headers ada", True)
    for hdr in ["Content-Security-Policy:", "Strict-Transport-Security:",
                "X-Frame-Options:", "Permissions-Policy:",
                "Referrer-Policy:", "X-Content-Type-Options:"]:
        check(f"G1 header {hdr[:-1]}", hdr in h)
    check("G1 HSTS includeSubDomains", "includeSubDomains" in h)
    check("G1 XFO DENY", "X-Frame-Options: DENY" in h)
    check("G1 Permissions camera/mic/geo dibatasi",
          "camera=()" in h and "microphone=()" in h and "geolocation=()" in h)
    m = re.search(r"Content-Security-Policy:\s*([^\n]+)", h)
    csp = m.group(1) if m else ""
    check("G1 CSP ada isinya", bool(csp.strip()))
except FileNotFoundError:
    check("G1 _headers ada", False)
    csp = ""

# ---- G2: CSP vs JS aktual (smoke test) ----
inline_scripts, ev_handlers, js_urls, bad_src, ext_src = [], [], [], [], []
for rel in PAGES:
    html = read(rel)
    base = os.path.dirname(rel)
    # blok <script> tanpa src
    if re.search(r"<script(?![^>]*\bsrc=)[^>]*>", html):
        inline_scripts.append(rel)
    # event handler inline (onX="...") — hindari false positive "content="
    if re.search(r'\son(click|load|change|submit|input|error|mouseover)="', html):
        ev_handlers.append(rel)
    if "javascript:" in html:
        js_urls.append(rel)
    for src in re.findall(r'<script\s+src="([^"]+)"', html):
        if src.startswith("http"):
            ext_src.append(rel + " :: " + src)
        elif not os.path.exists(os.path.normpath(os.path.join(ROOT, base, src))):
            bad_src.append(rel + " :: " + src)
    for href in re.findall(r'<link\s+rel="stylesheet"\s+href="([^"]+)"', html):
        if href.startswith("http"):
            ext_src.append(rel + " :: " + href)
        elif not os.path.exists(os.path.normpath(os.path.join(ROOT, base, href))):
            bad_src.append(rel + " :: " + href)
check("G2 tak ada <script> inline", not inline_scripts, str(inline_scripts[:3]))
check("G2 tak ada event handler inline", not ev_handlers, str(ev_handlers[:3]))
check("G2 tak ada javascript: URL", not js_urls, str(js_urls[:3]))
check("G2 semua <script src> resolve", not bad_src, str(bad_src[:3]))
check("G2 tak ada sumber eksternal http(s)", not ext_src, str(ext_src[:3]))
ss = re.search(r"script-src([^;]*)", csp)
check("G2 script-src tanpa 'unsafe-inline'", ss and "'unsafe-inline'" not in ss.group(1), csp[:100])
check("G2 style-src izinkan 'unsafe-inline' (terdokumentasi)",
      "'unsafe-inline'" in csp and "style-src" in csp)
check("G2 font-src 'self' (tanpa Google)", "font-src 'self'" in csp)
check("G2 frame-ancestors 'none'", "frame-ancestors 'none'" in csp)

# ---- G3: canonical ----
bad_canon = []
for rel in PAGES:
    html = read(rel)
    d = os.path.dirname(rel).replace(os.sep, "/")
    exp = "https://fsa-lab.pages.dev/" + (d + "/" if d else "")
    m = re.search(r'<link rel="canonical" href="([^"]+)">', html)
    if not m or m.group(1) != exp:
        bad_canon.append(rel + " -> " + (m.group(1) if m else "TAK ADA"))
check("G3 canonical absolut + path benar di 81 halaman", not bad_canon, str(bad_canon[:3]))
dup = [r for r in PAGES if read(r).count('rel="canonical"') != 1]
check("G3 tepat 1 canonical per halaman", not dup, str(dup[:3]))

# ---- G4: font self-hosted ----
grefs = [r for r in PAGES if "fonts.googleapis" in read(r) or "fonts.gstatic" in read(r)]
check("G4 tak ada referensi Google Fonts di HTML", not grefs, str(grefs[:3]))
try:
    fc = read("css/fonts.css")
    check("G4 css/fonts.css ada", True)
    check("G4 font-display: swap", "font-display: swap" in fc)
    missing = [w for w in re.findall(r"url\('\.\./fonts/([^']+)'\)", fc)
               if not os.path.exists(os.path.join(ROOT, "fonts", w))]
    check("G4 semua woff2 ada di disk", not missing, str(missing))
    check("G4 Inter variable (rentang 400 700)", "font-weight: 400 700" in fc)
    n_face = fc.count("@font-face")
    check("G4 9 @font-face (2 DM Serif + Inter var + 2 Space Mono + 4 Noto brand)", n_face == 9, f"dapat {n_face}")
except FileNotFoundError:
    check("G4 css/fonts.css ada", False)

# ---- G5: export/import progres ----
rev = read("review/index.html")
check("G5 tombol Ekspor ada", 'id="btn-export"' in rev)
check("G5 tombol Impor ada", 'id="btn-import"' in rev)
check("G5 file input ada", 'id="file-import"' in rev and 'type="file"' in rev)
check("G5 penjelasan batasan (browser/perangkat ini saja + hilang bila dibersihkan)",
      "browser/perangkat ini saja" in rev and "hilang bila storage browser dibersihkan" in rev)
ir = read("js/inline-review.js")
check("G5 validasi app==='fsa-lab' di impor", 'p.app !== "fsa-lab"' in ir)
check("G5 merge SR naik-saja", "imp.box > cur.box" in ir)
check("G5 merge mistakes union+cap", 'slice(0, 500)' in ir)
check("G5 jurnal hanya diisi bila kosong", 'cur === null || cur === ""' in ir)

# roundtrip merge logic via node (localStorage shim)
node_test = r"""
const fs = require('fs');
const src = fs.readFileSync('js/inline-review.js', 'utf8');
function grab(name){
  // ambil deklarasi function <name> sampai brace seimbang
  const i = src.indexOf('function ' + name + '(');
  if(i < 0) throw new Error('tak ada ' + name);
  let j = src.indexOf('{', i), depth = 0;
  for(let k = j; k < src.length; k++){
    if(src[k] === '{') depth++;
    else if(src[k] === '}'){ depth--; if(depth === 0){ return src.slice(i, k+1); } }
  }
  throw new Error('brace tak seimbang ' + name);
}
const store = {};
global.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; },
  key: i => Object.keys(store)[i], get length(){ return Object.keys(store).length; }
};
eval(grab('parseSR')); eval(grab('mergeSR')); eval(grab('mergeMistakes'));
const out = [];
// SR: naik
localStorage.setItem('fsa_sr_1_0', JSON.stringify({box:2, due:100}));
out.push(['sr-naik', mergeSR('fsa_sr_1_0', JSON.stringify({box:3, due:50})) === true
  && JSON.parse(localStorage.getItem('fsa_sr_1_0')).box === 3]);
// SR: turun ditolak
out.push(['sr-turun-ditolak', mergeSR('fsa_sr_1_0', JSON.stringify({box:1, due:999})) === false
  && JSON.parse(localStorage.getItem('fsa_sr_1_0')).box === 3]);
// SR: seri -> due terbaru menang
out.push(['sr-seri-due', mergeSR('fsa_sr_1_0', JSON.stringify({box:3, due:5000})) === true
  && JSON.parse(localStorage.getItem('fsa_sr_1_0')).due === 5000]);
// SR: invalid diabaikan
out.push(['sr-invalid', mergeSR('fsa_sr_9_9', 'bukan-json') === false]);
// mistakes: union, terbaru menang, cap
localStorage.setItem('fsa_mistakes', JSON.stringify([{m:1,q:'a',t:10,k:'quiz'}]));
const n = mergeMistakes(JSON.stringify([{m:1,q:'a',t:20,k:'quiz'},{m:2,q:'b',t:5,k:'review'}]));
const ml = JSON.parse(localStorage.getItem('fsa_mistakes'));
out.push(['mis-union', n === 2 && ml.length === 2 && ml.find(e=>e.m===1).t === 20]);
const big = []; for(let i=0;i<600;i++) big.push({m:1,q:'q'+i,t:i,k:'quiz'});
mergeMistakes(JSON.stringify(big));
out.push(['mis-cap500', JSON.parse(localStorage.getItem('fsa_mistakes')).length === 500]);
console.log(JSON.stringify(out));
"""
with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as tf:
    tf.write(node_test)
    tpath = tf.name
try:
    r = subprocess.run(["node", tpath], capture_output=True, text=True, cwd=ROOT, timeout=60)
    results = json.loads(r.stdout.strip()) if r.returncode == 0 else []
except Exception as e:
    results = []
    print("  (node test error:", str(e)[:80], ")")
os.unlink(tpath)
for name, ok in results:
    check("G5 node " + name, ok)
if not results:
    check("G5 node roundtrip jalan", False, "node tidak mengembalikan hasil")

# ---- G6: Mulai di sini ----
land = read("index.html")
i_mulai = land.find('id="mulai"')
i_kur = land.find('id="kurikulum"')
check("G6 section #mulai ada", i_mulai > 0)
check("G6 #mulai SEBELUM #kurikulum", 0 < i_mulai < i_kur)
sec = land[i_mulai:i_kur] if i_mulai > 0 else ""
for persona in ["Pemula", "Investor", "Forensik"]:
    check(f"G6 jalur {persona}", persona in sec)
for label in ["Mulai:", "Prasyarat:", "Estimasi:"]:
    check(f"G6 label '{label}' x3", sec.count(label) >= 3, f"dapat {sec.count(label)}")
for cta in ['href="/modul-1/"', 'href="/modul-16/"', 'href="/modul-13/"']:
    check(f"G6 CTA {cta}", cta in sec)

print()
if fails:
    print(f"GAGAL: {len(fails)} guard")
    sys.exit(1)
print("SEMUA GUARD LOLOS")
