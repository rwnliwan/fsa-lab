#!/usr/bin/env python3
"""QA Round 3 — FSA Lab (review Instinct 8.8/10, 3 Nov 2026). Permanent artifact."""
import re, sys, subprocess, json

WEB = "/home/hatch/workspace/fsa-web"
fails = []

def check(name, cond):
    if not cond: fails.append(name)
    print(("FAIL " if not cond else "ok   ") + name)

def idnum(s):
    s = s.strip(); neg = s.startswith("(") and s.endswith(")")
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
cf = open(f"{WEB}/js/casefiles.js", encoding="utf-8").read()
kit = open(f"{WEB}/workbench/fsa_toolkit.py", encoding="utf-8").read()

print("== MUST 1: CFI = capex, arus kas foot ==")
cfi, _ = row(m2, "Arus kas investasi (CFI)")
capex, _ = row(m2, "Belanja modal (capex)")
check("CFI (48.000) = capex", abs(cfi - capex) < 0.01 and abs(cfi - (-48000)) < 0.01)
cfo, _ = row(m2, "Arus kas operasi (CFO)")
cff, _ = row(m2, "Arus kas pendanaan (CFF)")
dkas, _ = row(m2, "Perubahan kas")
check("CFO+CFI+CFF = Δkas", abs((cfo + cfi + cff) - dkas) < 0.01)
check("BS sebut capex kas 48.000", "Capex kas 48.000" in m2)

print("== MUST 2: klaim 'dua tahun' dihapus ==")
check("tanpa 'dua tahun beruntun/berturut-turut' di M2",
      "dua tahun beruntun" not in m2 and "dua tahun berturut-turut" not in m2)
check("quiz Q4 pakai 1,48x -> 0,68x", "1,48x (2024) ke 0,68x (2025)" in m2)
check("ratio why pakai 1,48x", "turun dari 1,48x di 2024" in m2)

print("== MUST 3: Garuda terverifikasi ==")
check("Garuda 2016 laba +8,1 (pemilik)", "US$+8,1 jt" in cf)
check("Garuda 2016 CFO +107,5", "US$+107,5 jt" in cf)
check("Garuda 2017 rugi (216,6) (pemilik)", "US$(216,6) jt" in cf)
check("Garuda 2017 CFO (61,7)", "US$(61,7) jt" in cf)
check("Garuda 2018 Mahata ~240", "US$~240 jt" in cf)
check("tidak ada '(308)' di Garuda", "(308)" not in cf)
check("ctx sebut sumber verifikasi", "FY2017" in cf and "sebelum restatement" in cf)
check("Enron utang 7,4/8,2/10,2", all(x in cf for x in ["US$7,4 M","US$8,2 M","US$10,2 M"]))

print("== SHOULD 4-7 & minor ==")
check("playground anti double-count (pgCards)", "pgCards.indexOf(i) < 0" in m1 and "pgCards.indexOf(i) < 0" in m2)
check("restore tandai kartu dinilai", 'c.dataset.scored = "1"' in m1)
check("label skor konsisten 'Skor: X / 24'", "Skor: \" + pgScore + \" / 24" in m1)
check("M1 sewa 54.000 di hint", "sewa 54.000 = 144.000" in m1)
check("gate pass permanen (M1+M2)", "tetap tersimpan" in m1 and "tetap tersimpan" in m2)
check("casefiles guard total belum lengkap", "belum dijawab" in cf)
check("casefiles skor terbaik", "terbaikmu" in cf)
check("toolkit lvgi 0.96", "lvgi=0.96" in kit)
check("gross margin 'naik 34%→35%'", "Gross margin naik 34%→35%" in m2)

print("== toolkit jalan, M-score recompute ==")
r = subprocess.run(["python3", f"{WEB}/workbench/fsa_toolkit.py"], capture_output=True, text=True)
check("toolkit exit 0", r.returncode == 0)
m = re.search(r"M = (-?\d+\.\d+)", r.stdout)
check("M = -1.65 FLAG", m and abs(float(m.group(1)) - (-1.65)) < 0.01 and "FLAG" in r.stdout)
mcalc = (-4.84 + 0.92*1.45 + 0.528*0.97 + 0.404*1.02 + 0.892*1.30
         + 0.115*1.0 - 0.172*1.05 + 4.679*0.032 - 0.327*0.96)
check("beneish recompute -1.65", abs(mcalc - (-1.65)) < 0.01)

for f in ["modul1.js","modul2.js","casefiles.js","simulator.js","toggle.js"]:
    r = subprocess.run(["node","--check",f"{WEB}/js/{f}"], capture_output=True, text=True)
    check(f"node --check {f}", r.returncode == 0)

print()
if fails:
    print(f"QA ROUND3: {len(fails)} FAIL"); sys.exit(1)
print("QA ROUND3: LULUS")
sys.exit(0)
