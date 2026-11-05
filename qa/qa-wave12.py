#!/usr/bin/env python3
"""QA Gelombang 12 (Phase 8) — 5 fitur penyeimbang lens credit & investment:
covenant_break + dcf_inputs (toolkit + workbench UI), memo-kredit/, komparator/,
risk-map/, update landing (8 phase). Permanent artifact."""
import os, re, sys

WEB = "/home/hatch/workspace/fsa-web"

def page_all(web_path):
    """HTML + isi js/inline-*.js yang dirujuk (Phase 10: <script> inline -> eksternal)."""
    p = os.path.join(WEB, web_path)
    html = open(p, encoding="utf-8").read() if os.path.exists(p) else ""
    base = os.path.dirname(p)
    for src in re.findall(r'<script\s+src="([^"]*inline-[^"]*\.js)"', html):
        jp = os.path.normpath(os.path.join(base, src))
        if os.path.exists(jp):
            html += "\n" + open(jp, encoding="utf-8").read()
    return html
fails, warns = [], []

def check(name, cond, warn=False):
    if not cond:
        (warns if warn else fails).append(name)
    print(("WARN " if warn and not cond else "FAIL " if not cond else "ok   ") + name)

sys.path.insert(0, f"{WEB}/workbench")
from fsa_toolkit import covenant_break, dcf_inputs  # noqa: E402

print("== FITUR 1: covenant_break (verifikasi independen) ==")
d, s, tj = covenant_break(1.35, 1.20, 110_000, -20)
check("DSCR 1,35 shock -20% = 1,08", abs(d - 1.08) < 1e-9)
check("status JEBOL", s == "JEBOL")
check("titik jebol = -11,11%", abs(tj - (-11.111111)) < 0.01)
d2, s2, _ = covenant_break(1.35, 1.20, 110_000, -5)
check("shock -5% = 1,2825 AMAN", abs(d2 - 1.2825) < 1e-9 and s2 == "AMAN")
check("di batas min = AMAN (tidak <)", covenant_break(1.2, 1.2, 0, 0)[1] == "AMAN")

print("== FITUR 3: dcf_inputs (verifikasi independen, kanonis M18) ==")
r = dcf_inputs(25_000, 0.03, 0.12, 0.03)
check("5 tahun proyeksi", len(r["fcff"]) == 5 and len(r["pv_fcff"]) == 5)
check("FCFF thn1 = base 25.000", abs(r["fcff"][0] - 25_000) < 1e-6)
check("FCFF5 = 25000*1,03^4", abs(r["fcff"][4] - 25_000 * 1.03**4) < 0.01)
check("TV = FCFF5*(1+g)/(wacc-g) = 322.021", abs(r["tv"] - 322_020.6) < 1)
check("EV = 277.778 (cocok M18)", abs(r["ev"] - 277_778) < 1)
check("EV = sum PV + PV(TV)", abs(r["ev"] - (sum(r["pv_fcff"]) + r["pv_tv"])) < 1e-6)

print("== Workbench: UI section 10 & 11 ==")
wb = page_all("workbench/index.html")
check("section covenant-break", 'id="covenant-break"' in wb)
check("section dcf-builder", 'id="dcf-builder"' in wb)
check("slider shock", 'id="cb-shock"' in wb and 'type="range"' in wb)
check("badge JEBOL/AMAN", '"JEBOL"' in wb and '"AMAN"' in wb)
check("tabel DCF 5 thn", 'id="dcf-table"' in wb)
check("default FCFF 25000", 'id="dcf-fcff"' in wb and 'value="25000"' in wb)
check("code card 10 covenant", "10 · Covenant Break Predictor" in wb)
check("code card 11 DCF", "11 · DCF Input Builder" in wb)
check("fungsi toolkit disebut", "fsa_toolkit.py" in wb)

print("== FITUR 2: memo-kredit/ ==")
mk = open(f"{WEB}/memo-kredit/index.html", encoding="utf-8").read()
mkj = open(f"{WEB}/memo-kredit/memo-kredit.js", encoding="utf-8").read()
check("index.html ada", os.path.exists(f"{WEB}/memo-kredit/index.html"))
check("memo-kredit.js ada", os.path.exists(f"{WEB}/memo-kredit/memo-kredit.js"))
check("5 langkah", all(f"Langkah {i}" in mk for i in range(1, 6)))
check("spread 3 tahun kanonis", all(x in mkj for x in ["598000", "53449", "45240", "29640"]))
check("tombol Salin memo", 'id="copy-btn"' in mk and "clipboard.writeText" in mkj)
check("rekomendasi 3 opsi", all(x in mk for x in ["APPROVE", "CONDITIONAL", "DECLINE"]))
check("label ilustratif", "ilustratif" in mk.lower())
check("back link landing", '../index.html' in mk)

print("== FITUR 4: komparator/ ==")
kp = open(f"{WEB}/komparator/index.html", encoding="utf-8").read()
kpj = open(f"{WEB}/komparator/komparator.js", encoding="utf-8").read()
check("index.html ada", os.path.exists(f"{WEB}/komparator/index.html"))
check("komparator.js ada", os.path.exists(f"{WEB}/komparator/komparator.js"))
mc, ev = 5600*100, 5600*100+272000-92000
check("Cemerlang P/E 12,4x", abs(mc/45240 - 12.38) < 0.01 and "12,4x" in kp)
check("Cemerlang EV/EBITDA 7,3x", abs(ev/101370 - 7.30) < 0.01 and "7,3x" in kp)
check("Cemerlang P/B 3,1x", abs(mc/179440 - 3.12) < 0.01 and "3,1x" in kp)
check("default Cemerlang di JS", "PT Cemerlang (fiktif)" in kpj)
check("checkbox kas berlebih", 'id="adj-cash"' in kp)
check("checkbox sewa PSAK 116", "PSAK 116" in kp)
check("maks 3 perusahaan", "rows.length >= 3" in kpj)
check("nama fiktif", "Fiktif" in kpj)
check("back link landing", '../index.html' in kp)

print("== FITUR 5: risk-map/ ==")
rm = open(f"{WEB}/risk-map/index.html", encoding="utf-8").read()
rmj = open(f"{WEB}/risk-map/risk-map.js", encoding="utf-8").read()
check("index.html ada", os.path.exists(f"{WEB}/risk-map/index.html"))
check("risk-map.js ada", os.path.exists(f"{WEB}/risk-map/risk-map.js"))
sektors = ["Bank","Batubara","Nikel","CPO","Properti","Konstruksi BUMN","Ritel","Telco","Shipping","Multifinance"]
check("10 sektor", all(s in rmj for s in sektors))
drivers = ["Utang USD","Harga komoditas","Regulasi","Pihak berelasi","Likuiditas","Suku bunga","Tata kelola"]
check("7 driver", all(d in rmj for d in drivers))
check("batubara x komoditas = 5", re.search(r'n:"Batubara", v:\[4,5,', rmj) is not None)
check("semua skor 1-5", all(1 <= int(x) <= 5 for x in re.findall(r'v:\[([\d,]+)\]', rmj)[0].split(","))
      and len(re.findall(r'v:\[([\d,]+)\]', rmj)) == 10)
check("label BESAR ilustratif", "penilaian analis — ilustratif, bukan data live, update berkala" in rm.lower())
check("metodologi tertulis", "Metodologi" in rm and "1–5" in rm)
check("back link landing", '../index.html' in rm)

print("== Landing: Phase 8 ==")
ld = open(f"{WEB}/index.html", encoding="utf-8").read()
check("hero stat 10 Phase", '<span class="num" id="stat-phase">10</span><span class="lbl">Phase + Hard Gate</span>' in ld)
check("kicker 10 phase", "10 phase · hard gate 80%" in ld)
check("tidak ada sisa '8 phase · hard gate'", "8 phase · hard gate 80%" not in ld)
check("tidak ada sisa '7 phase'", "7 phase" not in ld)
check("Phase 8 article", '<p class="phase-tag">Phase 8</p>' in ld)
check("judul Kredit & Investasi Deep-Dive", "Kredit &amp; Investasi Deep-Dive" in ld)
check("deskripsi 5 topik", all(x in ld for x in ["Hedge accounting", "analisis bank", "3-statement modeling", "SAK EP/EMKM", "credit deep-dive"]))
check("gate quiz 5 modul", "lolos quiz 5 modul" in ld)
check("link M29-M34", all((f'href="modul-{i}/"' in ld or f'href="/modul-{i}/"' in ld) for i in range(29, 35)))
check("Phase 9 article", '<p class="phase-tag">Phase 9</p>' in ld)
check("link M34", ('href="modul-34/"' in ld or 'href="/modul-34/"' in ld))
check("link M35", ('href="modul-35/"' in ld or 'href="/modul-35/"' in ld))
check("link memo-kredit", ('href="memo-kredit/"' in ld or 'href="/memo-kredit/"' in ld))
check("link komparator", ('href="komparator/"' in ld or 'href="/komparator/"' in ld))
check("link risk-map", ('href="risk-map/"' in ld or 'href="/risk-map/"' in ld))
check("Phase 7 utuh", "Forensik Lanjutan &amp; Topik Khusus" in ld and ('href="modul-28/"' in ld or 'href="/modul-28/"' in ld))
check("Phase 1 utuh", "Mekanik Inti" in ld)

print()
print("FAIL: %d | WARN: %d" % (len(fails), len(warns)))
if fails:
    print("GAGAL:", fails); sys.exit(1)
print("QA WAVE 12 LULUS")
