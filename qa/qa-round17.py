#!/usr/bin/env python3
"""QA Round 17 — guard permanen untuk fix review Cue 7,2/10 (F01-F10).

F01: tak ada href relatif route-site di HTML manapun; _redirects ada aturan mulai-belajar
F02: ratio-lab.js punya guardNA; denominator nol -> "N/A" tanpa label Kuat
F03: CSS simulator radio: flex/grid + gap, line-height memadai
F04: workbench/index.html tepat 1x script inline-workbench.js; JS punya guard idempoten
F05: tak ada "9 phase" di HTML manapun; "10 phase" di index.html
F06: tak ada wording absolut "statutori memakai Bahasa Indonesia dan rupiah"
F07: <label for> di konverter/glosarium/ratio-lab; aria-label tombol theater; role tab explorer
F08: breadcrumb + "Modul N dari 38" + prev/next di 38 modul
F09: bedah-filing label Kutipan/Hitungan/Interpretasi; glosarium Beneish caveat false positive
F10: 404.html ada, proper (tanpa redirect), link root-absolute
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []

def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + ((" — " + detail) if detail and not cond else ""))
    if not cond:
        fails.append(name)

def read(p):
    with open(os.path.join(ROOT, p), encoding="utf-8") as f:
        return f.read()

def all_html():
    out = []
    for dirpath, _d, files in os.walk(ROOT):
        for fn in files:
            if fn.endswith(".html"):
                rel = os.path.relpath(os.path.join(dirpath, fn), ROOT)
                out.append(rel)
    return sorted(out)

HTML = all_html()

# ---------- F01: href relatif route ----------
# Pola berbahaya: href="namaroute/" tanpa leading slash (bukan #anchor, bukan http, bukan asset file)
ROUTE_RE = re.compile(r'href="([a-z][a-z0-9-]*)/"')
ASSET_DIRS = ("css/", "js/", "assets/", "fonts/", "images/", "img/")
bad = []
for p in HTML:
    try:
        h = read(p)
    except Exception:
        continue
    for m in ROUTE_RE.finditer(h):
        route = m.group(1) + "/"
        if route.startswith(ASSET_DIRS):
            continue
        bad.append(f"{p}: {m.group(0)}")
check("F01 tak ada href relatif route-site", not bad, "; ".join(bad[:5]))

try:
    rd = read("_redirects")
    check("F01 _redirects ada", True)
    check("F01 _redirects mulai-belajar -> /#mulai",
          "/mulai-belajar" in rd and "/#mulai" in rd)
except FileNotFoundError:
    check("F01 _redirects ada", False)

# ---------- F02: guard ratio ----------
try:
    rl = read("ratio-lab/ratio-lab.js")
    check("F02 guardNA ada", "guardNA" in rl)
    check("F02 pesan N/A denominator nol",
          "tidak dapat diinterpretasikan" in rl)
    # pastikan tidak ada label Kuat pada path Infinity (abaikan komentar kode)
    code_no_comments = re.sub(r"/\*.*?\*/", "", re.sub(r"//.*", "", rl), flags=re.S)
    check("F02 tak ada 'Kuat' berdampingan Infinity",
          not re.search(r"Infinity.{0,40}Kuat|Kuat.{0,40}Infinity", code_no_comments))
except FileNotFoundError:
    check("F02 ratio-lab.js ada", False)

# ---------- F03: CSS simulator ----------
try:
    css = read("css/modul.css")
    check("F03 sim-opt flex/grid", "sim-opt" in css and ("display:flex" in css.replace(" ", "") or "display: flex" in css))
    check("F03 sim-opt gap", "sim-opt" in css and "gap" in css)
except FileNotFoundError:
    check("F03 css/modul.css ada", False)

# ---------- F04: workbench script ----------
try:
    wb = read("workbench/index.html")
    n = len(re.findall(r'<script[^>]*inline-workbench\.js[^>]*>', wb))
    check("F04 tepat 1x script inline-workbench.js", n == 1, f"dapat {n}")
    iwb = read("js/inline-workbench.js")
    check("F04 guard idempoten", "__fsaWorkbenchInit" in iwb or "__fsaWorkbenchAlreadyInit" in iwb)
except FileNotFoundError as e:
    check("F04 file ada", False, str(e))

# ---------- F05: phase count ----------
nine = [p for p in HTML if re.search(r"9\s+[Pp]hase", read(p))]
check("F05 tak ada '9 phase'", not nine, "; ".join(nine[:3]))
try:
    check("F05 '10 phase' di index.html", re.search(r"10\s+[Pp]hase", read("index.html")) is not None)
except FileNotFoundError:
    check("F05 index.html ada", False)

# ---------- F06: wording absolut ----------
absolut = []
for p in HTML:
    try:
        h = read(p)
    except Exception:
        continue
    if "statutori memakai Bahasa Indonesia dan rupiah" in h:
        absolut.append(p)
check("F06 tak ada wording absolut rupiah", not absolut, "; ".join(absolut[:3]))

# ---------- F07: aksesibilitas ----------
def has_label_for(p, fid):
    try:
        h = read(p)
    except FileNotFoundError:
        return False
    return f'for="{fid}"' in h and f'id="{fid}"' in h

check("F07 konverter label for", has_label_for("konverter/index.html", "conv-q"))
check("F07 glosarium label for", has_label_for("glosarium/index.html", "glo-q"))
try:
    rlj = read("ratio-lab/ratio-lab.js")
    # label dibangun dinamis: <label for="' + inpId + '"> dengan inpId = "rl-in-i-j"
    check("F07 ratio-lab label for",
          "<label for=" in rlj and 'rl-in-' in rlj)
except FileNotFoundError:
    check("F07 ratio-lab file ada", False)
try:
    th = read("theater/index.html")
    check("F07 theater aria-label panah", "aria-label" in th)
except FileNotFoundError:
    check("F07 theater file ada", False)
try:
    ex = read("explorer/index.html")
    check("F07 explorer role tablist", 'role="tablist"' in ex or "role='tablist'" in ex)
except FileNotFoundError:
    check("F07 explorer file ada", False)

# ---------- F08: breadcrumb modul ----------
moduls = sorted([d for d in os.listdir(ROOT) if re.match(r"modul-\d+$", d)],
                key=lambda x: int(x.split("-")[1]))
check("F08 38 direktori modul", len(moduls) == 38, f"dapat {len(moduls)}")
missing_bc, missing_count, missing_pn = [], [], []
for m in moduls:
    n = int(m.split("-")[1])
    p = f"{m}/index.html"
    try:
        h = read(p)
    except FileNotFoundError:
        missing_bc.append(p + " (hilang)")
        continue
    if "breadcrumb" not in h.lower():
        missing_bc.append(p)
    if f"Modul {n} dari 38" not in h:
        missing_count.append(p)
    has_prev = f'href="/modul-{n-1}/"' in h
    has_next = f'href="/modul-{n+1}/"' in h
    if n == 1 and has_prev:
        missing_pn.append(p + " (prev tak seharusnya ada)")
    elif n == 38 and has_next:
        missing_pn.append(p + " (next tak seharusnya ada)")
    elif n not in (1, 38) and not (has_prev and has_next):
        missing_pn.append(p)
check("F08 breadcrumb 38/38", not missing_bc, "; ".join(missing_bc[:3]))
check("F08 'Modul N dari 38' 38/38", not missing_count, "; ".join(missing_count[:3]))
check("F08 prev/next benar", not missing_pn, "; ".join(missing_pn[:3]))

# ---------- F11b: anti-kontaminasi M38 (filing ujian BBCA) ----------
# Contamination rule (desain M38, ACC Septian): kata BBCA / 018/ATX / "Bank Central
# Asia" DILARANG muncul di modul-38/ dalam bentuk apapun. Contoh hanya ilustratif.
try:
    import subprocess as _sp
    _r = _sp.run(["grep", "-rliE", "bbca|018/ATX|bank central asia", "modul-38/", "js/modul38.js"],
                 cwd=ROOT, capture_output=True, text=True)
    _hits = [l for l in _r.stdout.splitlines() if l.strip()]
    check("F11b M38 bebas kontaminasi BBCA", not _hits, "; ".join(_hits[:3]))
except Exception as _e:
    check("F11b M38 bebas kontaminasi BBCA", False, str(_e)[:80])

# ---------- F09: bedah-filing + beneish ----------
try:
    bf = read("bedah-filing/index.html")
    check("F09 label Kutipan", "Kutipan" in bf)
    check("F09 label Hitungan FSA Lab", "Hitungan FSA Lab" in bf)
    check("F09 label Interpretasi", "Interpretasi" in bf)
except FileNotFoundError:
    check("F09 bedah-filing ada", False)
try:
    gj = read("glosarium/glosarium.js")
    check("F09 Beneish false positive caveat",
          "false positive" in gj.lower() and "Beneish" in gj)
except FileNotFoundError:
    check("F09 glosarium.js ada", False)

# ---------- F10: 404.html ----------
try:
    h404 = read("404.html")
    check("F10 404.html ada", True)
    check("F10 tanpa meta refresh/JS redirect",
          "http-equiv=\"refresh\"" not in h404.lower() and "window.location" not in h404)
    check("F10 link beranda root-absolute", 'href="/"' in h404)
    check("F10 H1 404", "<h1" in h404)
except FileNotFoundError:
    check("F10 404.html ada", False)

# ---------- F11: pg-opts flex-wrap (bug 4 Nov 2026: playground modul-1/2 scroll horizontal di tablet portrait 768px) ----------
# Akar: .pg-opts display:flex tanpa flex-wrap + breakpoint 760px tak mencakup 768px
# -> grid 4 kolom sempit, tombol naik/turun/tetap meluber, scrollWidth halaman 903.
try:
    mcss = read("css/modul.css")
    m = re.search(r"\.pg-opts\{([^}]*)\}", mcss.replace("\n", ""))
    check("F11 .pg-opts ada", m is not None)
    check("F11 .pg-opts flex-wrap:wrap", m is not None and "flex-wrap" in m.group(1))
    # Guard generik: semua rule flex berisi 'button' di baris yang sama WAJIB punya flex-wrap
    # (mencegah regresi pola yang sama di komponen tombol lain)
    for mm in re.finditer(r"([^{}]*button[^{}]*)\{([^}]*)\}", mcss.replace("\n", "")):
        sel, body = mm.group(1), mm.group(2)
        if "display:flex" in body.replace(" ", "") and "flex-wrap" not in body:
            check(f"F11 flex button row wrap [{sel.strip()[:40]}]", False, "tanpa flex-wrap")
            break
    else:
        check("F11 semua flex button-row punya flex-wrap", True)
except FileNotFoundError:
    check("F11 css/modul.css ada", False)

print()
if fails:
    print(f"GAGAL: {len(fails)} guard")
    sys.exit(1)
print("ALL PASS")
