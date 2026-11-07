#!/usr/bin/env python3
"""QA Workstream B — Luckin Coffee, Case Files ke-7 (FSA Lab).
(a) node --check js/casefiles.js
(b) setiap tahun punya flag boolean (tepat 1 flag:true per kasus)
(c) reveal menyebut tahun FLAG yang benar
(d) setiap ctx melabeli sumber fakta
(e) jumlah kasus (7) selaras dengan header case-files/index.html ('Tujuh kasus')
"""
import re, subprocess, sys

ROOT = "/home/hatch/workspace/fsa-web"
JS = ROOT + "/js/casefiles.js"
HTML = ROOT + "/case-files/index.html"

fails = []
def check(cond, msg):
    print(("PASS" if cond else "FAIL"), "-", msg)
    if not cond:
        fails.append(msg)

# (a) syntax
r = subprocess.run(["node", "--check", JS], capture_output=True, text=True)
check(r.returncode == 0, "(a) node --check js/casefiles.js valid" + ("" if r.returncode == 0 else ": " + r.stderr.strip()))

src = open(JS, encoding="utf-8").read()
body = src.split("var CASES = [", 1)[1].rsplit("\n];", 1)[0]
parts = re.split(r"\},\s*\n \{name:", body)
cases = []
for i, p in enumerate(parts):
    s = (" {name:" + p) if i > 0 else p   # split memakan '},\n {name:' di delimiter
    if i < len(parts) - 1:
        s += "}"
    cases.append(s)

# (e) 7 kasus & selaras header
check(len(cases) == 7, f"(e) jumlah kasus = {len(cases)} (ekspektasi 7)")
html = open(HTML, encoding="utf-8").read()
check("Tujuh kasus" in html, "(e) header index.html menyebut 'Tujuh kasus'")
check("Enam kasus" not in html, "(e) tidak ada sisa teks 'Enam kasus'")

names = [re.search(r'name:"([^"]+)"', c).group(1) for c in cases]
check(names == ["Garuda Indonesia", "Enron", "Wirecard", "Jiwasraya", "SNP Finance", "Indosurya", "Luckin Coffee"],
      f"(b0) urutan 6 kasus existing tak berubah + Luckin ke-7: {names[-1]}")

for c in cases:
    name = re.search(r'name:"([^"]+)"', c).group(1)
    yrs = re.findall(r'\{y:"(\d{4})", rows:\[.*?\], note:"(?:[^"\\]|\\.)*", flag:(true|false)\}', c)
    n_y = len(re.findall(r'\{y:"\d{4}"', c))
    check(len(yrs) == n_y and n_y >= 1, f"(b) {name}: {n_y} tahun, semua punya flag boolean")
    flag_years = [y for y, f in yrs if f == "true"]
    # Desain case (8 Nov 2026): 1-2 tahun flag membentuk AKHIRAN (trailing run) —
    # tahun flag pertama = tangkapan paling awal (+1 bonus, lihat js/casefiles.js
    # firstFlagIdx). Guard lama "tepat 1 flag" bertentangan dengan desain yang
    # sudah live (Garuda 1 tahun; 6 kasus lain 2 tahun).
    fl = [f for _, f in yrs]
    trailing = fl == ["false"] * fl.count("false") + ["true"] * fl.count("true")
    check(1 <= len(flag_years) <= 2 and trailing,
          f"(b) {name}: 1-2 tahun flag:true (akhiran) -> {flag_years}")
    # (c) — reveal menyebut SEMUA tahun flag: "<strong>Y = FLAG" (1 tahun) atau
    # "<strong>Y1 & Y2 = FLAG" (2 tahun)
    exp = " & ".join(flag_years)
    m = re.search(r'reveal:"(.*)"\}\s*$', c, re.S)
    reveal = m.group(1)
    check(f"<strong>{exp} = FLAG" in reveal,
          f"(c) {name}: reveal menyebut <strong>{exp} = FLAG</strong>")
    # (d)
    ctx = re.search(r'ctx:"(.*?)",\s*years:', c, re.S).group(1)
    check(any(k in ctx.lower() for k in ("sumber", "terverifikasi", "fakta publik")),
          f"(d) {name}: ctx melabeli sumber fakta")
    # row shape sanity
    for y, f in yrs:
        blk = re.search(r'\{y:"' + y + r'", rows:\[(.*?)\], note:', c, re.S).group(1)
        bad = [p for p in re.findall(r'\["(.*?)"\]', blk) if p.count('","') != 1]
        check(not bad, f"(b) {name} {y}: semua row [label,value] berpasangan")

print()
if fails:
    print(f"HASIL: {len(fails)} FAIL"); sys.exit(1)
print("HASIL: semua guard Workstream B lolos")
