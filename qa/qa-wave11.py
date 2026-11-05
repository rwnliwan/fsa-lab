#!/usr/bin/env python3
"""QA Gelombang 11 (Phase 6) — FSA Lab Modul 24 (Multiples) + Toggle expansion
+ Interview Bank + M1/M2 rows + snippet Indonesia. Permanent artifact."""
import os, re, sys, subprocess

WEB = "/home/hatch/workspace/fsa-web"
fails, warns = [], []

def check(name, cond, warn=False):
    if not cond:
        (warns if warn else fails).append(name)
    print(("WARN " if warn and not cond else "FAIL " if not cond else "ok   ") + name)

M24H = f"{WEB}/modul-24/index.html"
m24 = open(f"{WEB}/js/modul24.js", encoding="utf-8").read()
m24h = open(M24H, encoding="utf-8").read()
tog = open(f"{WEB}/js/toggle.js", encoding="utf-8").read()
m1 = open(f"{WEB}/js/modul1.js", encoding="utf-8").read()
m2 = open(f"{WEB}/js/modul2.js", encoding="utf-8").read()
iv = open(f"{WEB}/interview/index.html", encoding="utf-8").read()
snip = open(f"{WEB}/partials/indonesia-praktis.html", encoding="utf-8").read()

print("== M24: file & struktur ==")
check("modul-24/index.html ada", os.path.exists(M24H))
check("js/modul24.js ada", os.path.exists(f"{WEB}/js/modul24.js"))
check("kicker Phase 6 Penutup & Praktik", "Phase 6 · Penutup &amp; Praktik · Modul 24" in m24h or "Phase 6 · Penutup & Praktik · Modul 24" in m24h)
check("brand badge M24", '<span class="brand-badge">M24</span>' in m24h)
check("script ../js/modul24.js", '../js/modul24.js' in m24h)
check("5 section A-E", all(x in m24h for x in ['id="explorer"','id="playground"','id="ratiolab"','id="case"','id="quiz"']))

print("== M24: gate ke Phase 7 ==")
check("gate Phase 6 + link M25", "Phase 7 menantimu" in m24 and "../modul-25/" in m24)
check("gate 80%", ">= 80" in m24)

print("== M28: gate ke Phase 8 (bukan lagi modul terakhir) ==")
m28 = open(f"{WEB}/js/modul28.js", encoding="utf-8").read()
m28h = open(f"{WEB}/modul-28/index.html", encoding="utf-8").read()
check("M28 gate Phase 7 Tuntas", "Phase 7 Tuntas" in m28)
check("M28 link ke M29", "../modul-29/" in m28)
check("M28 badge", '<span class="brand-badge">M28</span>' in m28h)

print("== M24: ratio recompute independen ==")
check("P/E 5600/452,4 = 12,38", abs(5600/452.4-12.38) < 0.01)
check("EV/EBITDA 740000/102000 = 7,25", abs(740000/102000-7.25) < 0.01)
check("P/B 5600/1794,4 = 3,12", abs(5600/1794.4-3.12) < 0.01)
peg = (5600/452.4)/(((53449/100)-452.4)/452.4*100)
check("PEG 0,68", abs(peg-0.68) < 0.01)
check("continuing P/E 5600/390 = 14,36", abs(5600/390.0-14.36) < 0.01)
check("GAAP P/E 5600/358,8 = 15,61", abs(5600/358.8-15.61) < 0.01)
check("M24 ratio ans di source", all(x in m24 for x in ["ans:12.4","ans:7.3","ans:3.1","ans:0.68"]))

print("== M24: quiz distribusi kunci ==")
keys = [int(x) for x in re.findall(r'a:(\d)', m24.split("var QUIZ")[1].split("];")[0])]
check("5 soal quiz", m24.split("var QUIZ")[1].split("];")[0].count('{q:"') == 5)
check(f"kunci {keys} tersebar (tidak 5/5 sama)", len(set(keys)) > 1)
check("semua kunci valid (<4 opsi)", all(0 <= k < 4 for k in keys))

print("== M24: guard regresi ==")
check("parseIDNumber", "function parseIDNumber" in m24)
check("quiz warning nomor soal", "melewatkan soal" in m24)
check("gate permanen", "tetap tersimpan" in m24)
check("anti double-count", "pgCards.indexOf(i) < 0" in m24)
check("localStorage fsa_pg_m24", "fsa_pg_m24" in m24)
check("localStorage fsa_gate_m24", "fsa_gate_m24" in m24)
check("journal 3 lensa",
      "fsa_journal_m24_" in m24
      and all(k+":" in m24.split("var LENSES")[1].split("};")[0] for k in ["invest","credit","forensic"]))
check("6 kartu playground", m24.count('{t:"') == 6)
check("skor /12", "/ 12 (" in m24)
check("kunci tidak dibocorkan", "kunci tidak dibocorkan" in m24)
bare = re.findall(r'\{l:"([^"]+)",[^}]*d:"—",', m24)
check("tanpa d:'—'", not bare)
r = subprocess.run(["node","--check",f"{WEB}/js/modul24.js"], capture_output=True, text=True)
check("node --check modul24.js", r.returncode == 0)

print("== Toggle: 8 topik ==")
check("toggle 8 topik total", tog.count('{t:"') == 8)
for t in ["LIFO vs FIFO","Reversal impairment","Kapitalisasi biaya pengembangan",
          "Revaluasi aset tetap","Klasifikasi bunga dibayar"]:
    check(f"topik lama ada: {t[:20]}", t in tog)
for t in ["CECL vs ECL (12.5)","Sewa: split US GAAP (12.8)","Disclosure & MPM (12.9)"]:
    check(f"topik baru ada: {t}", t in tog)
check("CECL angka tie 5.000/20.000/15.000",
      all(x in tog for x in ["Rp5.000","Rp20.000","Rp15.000"]))
check("sewa angka tie 14.000/12.000/2.000",
      all(x in tog for x in ["Rp14.000","Rp12.000","Rp2.000"]))
check("MPM angka tie 95.000/75.000",
      all(x in tog for x in ["Rp95.000","Rp75.000"]))
check("adj analis di 3 topik baru", tog.count("Penyesuaian analis") >= 8)
r = subprocess.run(["node","--check",f"{WEB}/js/toggle.js"], capture_output=True, text=True)
check("node --check toggle.js", r.returncode == 0)

print("== Interview bank ==")
check("interview/index.html ada", os.path.exists(f"{WEB}/interview/index.html"))
nqa = iv.count('<details class="qa"')
check(f"15-20 Q&A (ketemu {nqa})", 15 <= nqa <= 20)
check("judul Bank Jawaban Interview", "<title>Bank Jawaban Interview · FSA Lab</title>" in iv)
check("tanpa JS berat", "<script" not in iv)
for q in ["Walk me through a DCF","FCFF dan FCFE","Beneish M-score"]:
    check(f"Q ada: {q[:25]}", q in iv)

print("== Snippet Indonesia ==")
check("partials/indonesia-praktis.html ada", os.path.exists(f"{WEB}/partials/indonesia-praktis.html"))
s = snip.strip()
check("snippet = <section> saja", s.startswith("<!--") and s.rstrip().endswith("</section>") and "<html" not in snip)
for kw in ["OJK","IDX","PSAK 116","PSAK 118","CALK"]:
    check(f"snippet sebut {kw}", kw in snip)

print("== M1/M2 rows baru ==")
check("M1 baris perubahan ekuitas", "Laporan perubahan ekuitas (ringkas)" in m1)
check("M1 baris paket lengkap", "Paket laporan lengkap (2.4)" in m1)
check("M2 baris perubahan ekuitas", "Laporan perubahan ekuitas (ringkas)" in m2)
check("M2 baris paket lengkap", "Paket laporan lengkap (2.4)" in m2)
bare1 = re.findall(r'\{l:"([^"]+)",[^}]*d:"—",', m1)
bare2 = re.findall(r'\{l:"([^"]+)",[^}]*d:"—",', m2)
check("M1 tanpa baris d:'—'", not bare1)
check("M2 tanpa baris d:'—'", not bare2)

print("== regresi wave1/wave2 ==")
for w in ["qa-wave1.py","qa-wave2.py"]:
    r = subprocess.run(["python3", f"{WEB}/qa/{w}"], capture_output=True, text=True)
    check(f"{w} LULUS", r.returncode == 0)

print("== hygiene file baru ==")
for name, src in [("modul24",m24),("modul24-html",m24h),("interview",iv),("snippet",snip)]:
    check(f"{name} tanpa console.error", "console.error" not in src)
    check(f"{name} tanpa lorem", "lorem" not in src.lower())
check("tanpa prompt( di modul24", "prompt(" not in m24)

print()
if fails:
    print(f"QA WAVE11: {len(fails)} FAIL"); sys.exit(1)
print(f"QA WAVE11: LULUS ({len(warns)} warning)")
sys.exit(0)
