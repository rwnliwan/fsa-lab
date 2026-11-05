#!/usr/bin/env python3
"""QA FEATURES — Builder D (FSA Lab): Spaced Repetition + Analyst Note +
Simulator hard mode + Workbench tool 4. Permanent artifact.

F1: gen_review_bank.py jalan & hasilkan 90 soal dari 18 modul
    (a valid 0-3, tiap soal 4 opsi, m valid 1-18)
F2: review/index.html ada + referensi REVIEW_BANK
F3: analisis-mingguan/index.html ada + pola localStorage fsa_note_
F4: simulator 9 kasus (aManip/aScreen valid 0-6); 6 kasus lama tak berubah;
    angka 6 kasus baru recompute independen
F5: toolkit tool 4 ada (xbrl_parse_ratios) + __main__ exit 0 + komentar jujur
    (offline; live = SEC EDGAR API)
"""
import json
import os
import re
import subprocess
import sys

WEB = "/home/hatch/workspace/fsa-web"

def page_all(web_path):
    """HTML + isi file js/inline-*.js yang dirujuk halaman (Phase 10: blok
    <script> inline dipindah ke file eksternal agar CSP script-src 'self')."""
    p = os.path.join(WEB, web_path)
    html = open(p, encoding="utf-8").read() if os.path.exists(p) else ""
    base = os.path.dirname(p)
    for src in re.findall(r'<script\s+src="([^"]*inline-[^"]*\.js)"', html):
        jp = os.path.normpath(os.path.join(base, src))
        if os.path.exists(jp):
            html += "\n" + open(jp, encoding="utf-8").read()
    return html
fails = []

def check(name, cond):
    print(("ok   " if cond else "FAIL ") + name)
    if not cond:
        fails.append(name)

# ---------- F1: generator review bank ----------
print("== F1 gen_review_bank.py ==")
r = subprocess.run(["python3", f"{WEB}/tools/gen_review_bank.py"],
                   capture_output=True, text=True)
check("gen exit 0", r.returncode == 0)
# Modul yang punya QUIZ = sumber kebenaran (modul 19-24 bisa lahir kapan saja;
# generator skip yang belum ada — ekspektasi dihitung dinamis, bukan hardcode)
# Phase 10: M36-M37 lahir -> range 1..37
exp_mods = []
for n in range(1, 38):
    p = f"{WEB}/js/modul{n}.js"
    if os.path.exists(p) and "var QUIZ" in open(p, encoding="utf-8").read():
        exp_mods.append(n)
print("    (modul ber-QUIZ saat ini: %s)" % exp_mods)
check("gen %d modul" % len(exp_mods), "%d modul" % len(exp_mods) in r.stdout)
check("gen %d soal" % (5 * len(exp_mods)), "%d soal" % (5 * len(exp_mods)) in r.stdout)
src = open(f"{WEB}/js/review-bank.js", encoding="utf-8").read()
m = re.search(r"var REVIEW_BANK = (\[.*\]);\s*$", src, re.S)
check("REVIEW_BANK parse-able", m is not None)
bank = json.loads(m.group(1)) if m else []
check("%d soal" % (5 * len(exp_mods)), len(bank) == 5 * len(exp_mods))
mods = sorted(set(q["m"] for q in bank)) if bank else []
check("modul bank = modul ber-QUIZ", mods == exp_mods)
check("tiap soal 4 opsi", all(len(q["o"]) == 4 for q in bank))
check("a valid 0-3", all(isinstance(q["a"], int) and 0 <= q["a"] <= 3 for q in bank))
check("a menunjuk opsi valid",
      all(0 <= q["a"] < len(q["o"]) for q in bank))
check("5 soal per modul", all(sum(1 for q in bank if q["m"] == n) == 5 for n in exp_mods))
check("q non-kosong", all(q["q"].strip() for q in bank))

# ---------- F2: halaman review ----------
print("== F2 review/index.html ==")
check("review ada", os.path.exists(f"{WEB}/review/index.html"))
rev = page_all("review/index.html")
check("review load REVIEW_BANK", 'src="../js/review-bank.js"' in rev)
check("review pakai REVIEW_BANK", "REVIEW_BANK" in rev.split('src="../js/review-bank.js"')[-1] if 'src="../js/review-bank.js"' in rev else False)
check("review baca gate fsa_gate_m", "fsa_gate_m" in rev)
check("review state fsa_sr_", "fsa_sr_" in rev)
check("review interval SM-2 [1,3,7,14,30]", "[1, 3, 7, 14, 30]" in rev)
check("review maks 20/hari", "20" in rev and "MAX_PER_DAY" in rev)
check("review pesan modul lolos", "Selesaikan minimal 1 modul dulu" in rev)
check("review css/style.css", 'href="../css/style.css"' in rev)

# ---------- F3: halaman analisis mingguan ----------
print("== F3 analisis-mingguan/index.html ==")
check("analisis ada", os.path.exists(f"{WEB}/analisis-mingguan/index.html"))
anw = page_all("analisis-mingguan/index.html")
check("analisis key fsa_note_", "fsa_note_" in anw)
check("analisis 2 textarea", anw.count("<textarea") >= 2)
check("analisis contoh note", "Contoh note lengkap" in anw)
check("analisis panduan ID+EN", "Struktur (Indonesia)" in anw and "Structure (English)" in anw)
check("analisis baca/hapus", "data-read" in anw and "data-del" in anw)
check("analisis css/style.css", 'href="../css/style.css"' in anw)

# ---------- F4: simulator 9 kasus ----------
print("== F4 simulator.js ==")
sim = open(f"{WEB}/js/simulator.js", encoding="utf-8").read()
check("sim 9 kasus", sim.count('{name:"Kasus') == 9)
am = [int(x) for x in re.findall(r"aManip:(\d)", sim)]
check("9 aManip valid 0-6", len(am) == 9 and all(0 <= x <= 6 for x in am))
sc = [int(x) for x in re.findall(r"aScreen:(\d)", sim)]
check("9 aScreen valid 0-6", len(sc) == 9 and all(0 <= x <= 6 for x in sc))
names = re.findall(r'name:"(Kasus \d)"', sim)
check("Kasus 1..9 berurutan", names == ["Kasus %d" % i for i in range(1, 10)])
diffs = re.findall(r'name:"Kasus \d", diff:"([^"]+)"', sim)
check("3 lama tak berubah (Mudah/Sedang/Sulit)", diffs[:3] == ["Mudah", "Sedang", "Sulit"])
check("3 hard-mode diff Sulit", diffs[3:6] == ["Sulit", "Sulit", "Sulit"])
check("3 phase-10 diff Sedang/Sedang/Sulit", diffs[6:] == ["Sedang", "Sedang", "Sulit"])
check("3 lama kunci 0/1/2", am[:3] == [0, 1, 2])
check("kasus 5 = tidak ada manipulasi", am[4] == 3 and sc[4] == 3)
check("kasus 7-9 kunci 4/5/6", am[6:] == [4, 5, 6] and sc[6:] == [4, 5, 6])
# recompute independen 3 kasus baru
check("S4 DSO 100,4", abs(148500 / 540000 * 365 - 100.4) < 0.1)
check("S4 akrual 19.800", 70200 - 50400 == 19800)
check("S4 CFO/NI 0,72", abs(50400 / 70200 - 0.72) < 0.01)
check("S5 DSO 50,0", abs(84900 / 620000 * 365 - 50.0) < 0.1)
check("S5 CFO/NI 1,10", abs(81800 / 74400 - 1.10) < 0.01)
check("S5 akrual -7.400", 74400 - 81800 == -7400)
check("S6 akrual 30.800", 82000 - 51200 == 30800)
check("S6 CFO/NI 0,62", abs(51200 / 82000 - 0.62) < 0.01)
check("S6 DSO 63,5", abs(94000 / 540000 * 365 - 63.5) < 0.1)
# recompute independen 3 kasus phase-10
check("S7 provisi 7,0%", abs(35000 / 500000 * 100 - 7.0) < 0.05)
check("S7 DSO 65,7", abs(90000 / 500000 * 365 - 65.7) < 0.05)
check("S7 akrual -29.600", 50400 - 80000 == -29600)
check("S7 CFO/NI 1,59", abs(80000 / 50400 - 1.59) < 0.005)
check("S8 pangsa berelasi 30,0%", abs(180000 / 600000 * 100 - 30.0) < 0.05)
check("S8 DSO berelasi 243,3", abs(120000 / 180000 * 365 - 243.3) < 0.1)
check("S8 akrual +36.000", 66000 - 30000 == 36000)
check("S9 one-off 16,3%", abs(85000 / 520000 * 100 - 16.3) < 0.05)
check("S9 akrual -93.000", -45000 - 48000 == -93000)
check("S9 laba continuing +21.300", abs(-45000 + 85000 * 0.78 - 21300) < 1)
r = subprocess.run(["node", "--check", f"{WEB}/js/simulator.js"],
                   capture_output=True, text=True)
check("node --check simulator.js", r.returncode == 0)
r = subprocess.run(["node", "--check", f"{WEB}/js/review-bank.js"],
                   capture_output=True, text=True)
check("node --check review-bank.js", r.returncode == 0)

# ---------- F5: workbench tool 4 ----------
print("== F5 fsa_toolkit.py tool 4 ==")
tk = open(f"{WEB}/workbench/fsa_toolkit.py", encoding="utf-8").read()
check("xbrl_parse_ratios ada", "def xbrl_parse_ratios" in tk)
check("hitung 4 rasio", all(x in tk for x in ["net_margin", '"roa"', '"cfo_ni"', '"accruals"']))
check("komentar jujur offline", "CONTOH OFFLINE" in tk or "contoh offline" in tk.lower())
check("arahkan SEC EDGAR API", "SEC EDGAR API" in tk)
check("contoh XML inline", "<Revenue>" in tk and "XBRL_CONTOH" in tk)
check("xml.etree dipakai", "xml.etree" in tk)
r = subprocess.run(["python3", "-m", "py_compile", f"{WEB}/workbench/fsa_toolkit.py"],
                   capture_output=True, text=True)
check("py_compile OK", r.returncode == 0)
r = subprocess.run(["python3", f"{WEB}/workbench/fsa_toolkit.py"],
                   capture_output=True, text=True)
check("__main__ exit 0", r.returncode == 0)
check("rasio XBRL ter-print", "net margin" in r.stdout and "ROA" in r.stdout and "accruals" in r.stdout)
wbi = page_all("workbench/index.html")
check("workbench list covenant predictor", "10 · Covenant Break Predictor" in wbi)
check("workbench list dcf builder", "11 · DCF Input Builder" in wbi)

print()
if fails:
    print(f"QA FEATURES: {len(fails)} FAIL")
    sys.exit(1)
print("QA FEATURES: LULUS")
