#!/usr/bin/env python3
"""QA Round 10 — guard permanen: Statement Explorer + Ratio Lab + stepper LK + fix risk-map.
G1: explorer/ ada, >=15 pos bisa diklik, tiap pos punya acuan PSAK nomor BARU (3 digit)
G2: tidak ada nomor PSAK lama 2-digit tanpa pasangan baru di explorer/ratio-lab
G3: ratio-lab/ ada, >=10 rasio, semua prefill 2025 == kanonis (dihitung via node)
G4: kartu landing Statement Explorer & Ratio Lab punya link href
G5: stepper vertikal ada di index.html (5 langkah) + CSS .stepper di style.css
G6: risk-map tidak lagi menulis PSAK 207 untuk pihak berelasi
G7: angka explorer == CANONICAL-DATA (spot check)
"""
import re, subprocess, sys

fails = []
def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + (f" — {detail}" if detail and not cond else ""))
    if not cond: fails.append(name)

# G1: explorer
try:
    ex_html = open("explorer/index.html").read()
    ex_js = open("explorer/explorer.js").read()
except FileNotFoundError as e:
    check("G1 explorer files exist", False, str(e)); ex_html = ex_js = ""
else:
    check("G1 explorer files exist", True)
# kunci pos ada di baris TABS (["kas", "..."]) — data-k di-generate dinamis via concat
picks = re.findall(r'\[\s*"([a-z]+)"\s*,', ex_js)
check("G1 >=15 clickable items", len(set(picks)) >= 15, f"found {len(set(picks))}")
# tiap item D{} punya p: "PSAK ..." nomor 3 digit; strip komentar dulu; (?<![a-zA-Z]) cegah match "atetap:"
code = re.sub(r"/\*.*?\*/", "", ex_js, flags=re.S)
dblocks = re.findall(r"(?<![a-zA-Z])p:\s*\"([^\"]+)\"", code)
bad_psak = [b for b in dblocks if not re.search(r"PSAK \d{3}", b)]
check("G1 all items cite 3-digit PSAK", len(dblocks) >= 15 and not bad_psak, f"{len(dblocks)} refs, bad={bad_psak[:3]}")

# G2: no bare old 2-digit PSAK without new number nearby
for f in ["explorer/explorer.js", "ratio-lab/ratio-lab.js"]:
    try: ctx = open(f).read()
    except FileNotFoundError: ctx = ""; check(f"G2 {f} exists", False); continue
    bare = re.findall(r"PSAK (?:73|71|72|55|7|2|1)(?!\d)", ctx)
    # allowed only if "dulu N" pattern (old number in parens after new)
    bare_real = [b for b in bare if "dulu" not in ctx[max(0, ctx.find(b)-40):ctx.find(b)+40]]
    check(f"G2 no bare old PSAK in {f}", not bare_real, str(bare_real[:3]))

# G3: ratio-lab ratios == canonical via node
node_test = r"""
const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync('ratio-lab/ratio-lab.js','utf8');
const sb={document:{getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[]}};
let code=src.replace('(function () {','(function () { globalThis.__R=null;')
 .replace('function render() {','globalThis.__R=R; function render() {').replace('render();','');
vm.createContext(sb); vm.runInContext(code,sb);
const R=sb.__R;
const exp={'Current Ratio':'2,17x','Quick Ratio':'1,23x','DSO (hari piutang)':'73,0 hari',
 'DIO (hari persediaan)':'103,7 hari','DPO (hari utang)':'67,0 hari','Cash Conversion Cycle':'109,7 hari',
 'Asset Turnover':'1,25x','Debt to Equity':'1,52x','Net Debt / EBITDA':'1,76x','Interest Coverage':'5,14x',
 'Gross Margin':'35,0%','Operating Margin':'13,8%','Net Margin':'8,7%','ROE':'28,3%','ROA':'10,9%','ROIC':'15,8%'};
let bad=[];
R.forEach(r=>{const o={};r.inputs.forEach(p=>o[p.id]=p.val);
 const got=r.fmt(r.calc(o)); if(got!==exp[r.name]) bad.push(r.name+':'+got);});
console.log(JSON.stringify({n:R.length,bad}));
"""
try:
    out = subprocess.run(["node", "-e", node_test], capture_output=True, text=True, timeout=30, cwd=".")
    import json
    res = json.loads(out.stdout.strip().split("\n")[-1])
    check("G3 ratio-lab >=10 ratios", res["n"] >= 10, f"n={res['n']}")
    check("G3 all prefill == canonical", not res["bad"], str(res["bad"][:4]))
except Exception as e:
    check("G3 ratio-lab node test", False, str(e)[:120])

# G4: landing cards link
idx = open("index.html").read()
check("G4 explorer card links explorer/", ('href="explorer/"' in idx or 'href="/explorer/"' in idx))
check("G4 ratio-lab card links ratio-lab/", ('href="ratio-lab/"' in idx or 'href="/ratio-lab/"' in idx))

# G5: stepper
check("G5 stepper in index.html (5 steps)", idx.count('<span class="step-n">') >= 5, f"count={idx.count(chr(60)+'span class=\"step-n\"'+chr(62))}")
css = open("css/style.css").read()
check("G5 .stepper CSS exists", ".stepper" in css and ".step-n" in css)
part = open("partials/indonesia-praktis.html").read()
check("G5 stepper in partial too", part.count('<span class="step-n">') == 5)

# G6: risk-map fix
rm = open("risk-map/index.html").read()
check("G6 risk-map tunneling = PSAK 224", "tunneling (PSAK 224)" in rm)
check("G6 no tunneling (PSAK 207)", "tunneling (PSAK 207)" not in rm)

# G7: explorer numbers == canonical spot check
for k, v in [("21.440", "kas"), ("104.000", "piutang"), ("230.000", "aset tetap"),
             ("520.000", "penjualan"), ("30.800", "CFO"), ("(48.000)", "capex")]:
    check(f"G7 explorer has {v}={k}", k in ex_js, "")

print()
print("RESULT:", "ALL PASS" if not fails else f"{len(fails)} FAILURES: {fails}")
sys.exit(1 if fails else 0)
