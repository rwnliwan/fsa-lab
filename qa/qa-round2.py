#!/usr/bin/env python3
"""QA Round 2 — FSA Lab (review Instinct 8.6/10, 3 Nov 2026). Permanent artifact.
Menangkap SEMUA temuan fix #1–#8 agar tidak pernah terulang."""
import os, re, sys, subprocess, json

WEB = "/home/hatch/workspace/fsa-web"
fails, warns = [], []

def check(name, cond, warn=False):
    if not cond:
        (warns if warn else fails).append(name)
    print(("WARN " if warn and not cond else "FAIL " if not cond else "ok   ") + name)

def idnum(s):
    """Parse angka format Indonesia dari source JS: '21.440'->21440, '(11.760)'->-11760."""
    s = s.strip()
    neg = s.startswith("(") and s.endswith(")")
    s = s.strip("()").replace(".", "").replace(",", ".")
    try: v = float(s)
    except ValueError: return None
    return -v if neg else v

def row(src, label):
    m = re.search(r'\{l:"' + re.escape(label) + r'", v:"([^"]+)",(?: v2:"([^"]+)",)?', src)
    assert m, label
    return idnum(m.group(1)), (idnum(m.group(2)) if m.group(2) else None)

m1 = open(f"{WEB}/js/modul1.js", encoding="utf-8").read()
m2 = open(f"{WEB}/js/modul2.js", encoding="utf-8").read()
sim = open(f"{WEB}/js/simulator.js", encoding="utf-8").read()
tog = open(f"{WEB}/js/toggle.js", encoding="utf-8").read()

print("== FIX #1: rekonsiliasi Modul 2 ==")
# 1a: 2024 NI = 38.000 - 8.360 = 29.640
pbt24 = 38000.0; tax24 = 8360.0
ni25, ni24 = row(m2, "LABA BERSIH")
check("2024 NI = 29.640 (38.000-8.360)", abs(ni24 - (pbt24-tax24)) < 0.01)
# 1b: 2024 A = L + E
ta25, ta24 = row(m2, "TOTAL ASET")
tl25, tl24 = row(m2, "TOTAL LIABILITAS")
te25, te24 = row(m2, "TOTAL EKUITAS")
check("2024 A=L+E (378.200=238.000+140.200)", abs(ta24 - (tl24+te24)) < 0.01)
check("2025 A=L+E (451.440=272.000+179.440)", abs(ta25 - (tl25+te25)) < 0.01)
# 1c: ΔWC dari delta BS
ar25, ar24 = row(m2, "Piutang usaha")
inv25, inv24 = row(m2, "Persediaan")
ap25, ap24 = row(m2, "Utang usaha")
acc25, acc24 = row(m2, "Utang pajak & beban akrual")
dwc = -((ar25-ar24)+(inv25-inv24)) + ((ap25-ap24)+(acc25-acc24))
cfo25, cfo24 = row(m2, "Arus kas operasi (CFO)")
check("ΔWC 2025 = (44.440) dari delta BS", abs(dwc - (-44440)) < 0.01)
check("CFO 2025 = 30.800", abs((ni25+30000+dwc) - 30800) < 0.01 and abs(cfo25-30800) < 0.01)
# rantai kas
cfi25, _ = row(m2, "Belanja modal (capex)")
cff25, _ = row(m2, "Arus kas pendanaan (CFF)")
dkas25, _ = row(m2, "Perubahan kas")
check("Δkas = 30.800-48.000+5.440 = (11.760)", abs(dkas25 - (30800-48000+5440)) < 0.01)
kas25, kas24 = row(m2, "Kas dan setara kas")
check("kas akhir 21.440 = 33.200-11.760", abs(kas25 - (kas24+dkas25)) < 0.01)
# laba ditahan
re25, re24 = row(m2, "Laba ditahan")
check("laba ditahan roll 40.200+45.240-6.000=79.440", abs(re25 - (re24+45240-6000)) < 0.01)
# D/E & current ratio sesuai narasi
check("D/E 2024 = 1,70x", abs(tl24/te24 - 1.70) < 0.005)
check("D/E 2025 = 1,52x", abs(tl25/te25 - 1.52) < 0.005)
al25, _ = row(m2, "Total aset lancar")
ll25, _ = row(m2, "Total liabilitas lancar")
check("current ratio 2025 = 2,17x", abs(al25/ll25 - 2.17) < 0.005)
# growth narrative
check("growth +53% ((45.240-29.640)/29.640)", abs((ni25-ni24)/ni24 - 0.526) < 0.005)
check("CFO -30% ((30.800-44.000)/44.000)", abs((cfo25-cfo24)/cfo24 - (-0.30)) < 0.005)

print("== FIX #2: parser angka Indonesia ==")
fn = re.search(r"function parseIDNumber\(str[^)]*\)\{.*?\n\}", m2, re.S).group(0)  # R14/R15: signature kini (str, isDecimal)
cases = {"14.440":14440,"14.440,0":14440,"9,75":9.75,"0.68":0.68,"109.7":109.7,
         "5.14":5.14,"1.234.567":1234567,"40,0":40.0,"2,27":2.27,"54,75":54.75}
js = fn + "\nvar out={};\n" + "\n".join(
    f'out[{json.dumps(k)}]=parseIDNumber({json.dumps(k)});' for k in cases) + "\nconsole.log(JSON.stringify(out));"
r = subprocess.run(["node","-e",js], capture_output=True, text=True)
got = json.loads(r.stdout or "{}")
for k, exp in cases.items():
    check(f'parse "{k}" = {exp}', abs(got.get(k, -999) - exp) < 1e-9)
r2 = subprocess.run(["node","-e",fn+"\nconsole.log(isNaN(parseIDNumber(''))&&isNaN(parseIDNumber('abc'))?'nan-ok':'bad')"],
                    capture_output=True, text=True)
check("parser tolak kosong/non-numerik", "nan-ok" in r2.stdout)
check("ratio lab pakai parseIDNumber", "parseIDNumber($(\"#rin\"+i).value," in m1 and "parseIDNumber($(\"#rin\"+i).value," in m2)

print("== FIX #3–#8: guard regresi ==")
check("M1 gate link ke modul-2", '../modul-2/' in m1)
check("playground wajib 4 dimensi (M1+M2)", "selCount < 4" in m1 and "selCount < 4" in m2)
check("simulator simpan skor TERBAIK", "Math.max(score, prev)" in sim and "terbaikmu" in sim)
check("quiz warning soal terlewat (M1+M2)", "melewatkan soal" in m1 and "melewatkan soal" in m2)
check("simulator catatan WorldCom/CFO", "WorldCom" in sim and "lebih sehat" in sim)
check("toggle footnote ASC 985", "ASC 985" in tog)
bare1 = re.findall(r'\{l:"([^"]+)",[^}]*d:"—",', m1)
bare2 = re.findall(r'\{l:"([^"]+)",[^}]*d:"—",', m2)
check("tanpa baris explorer d:'—' (M1)", not bare1)
check("tanpa baris explorer d:'—' (M2)", not bare2)
for f in ["modul1.js","modul2.js","simulator.js","casefiles.js","toggle.js"]:
    r = subprocess.run(["node","--check",f"{WEB}/js/{f}"], capture_output=True, text=True)
    check(f"node --check {f}", r.returncode == 0)

print()
if fails:
    print(f"QA ROUND2: {len(fails)} FAIL"); sys.exit(1)
print(f"QA ROUND2: LULUS ({len(warns)} warning)")
sys.exit(0)
