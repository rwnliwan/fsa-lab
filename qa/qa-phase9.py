#!/usr/bin/env python3
"""QA PHASE 9 — Builder F: F2 Bedah Buta + F5 Bedah Filing SOCI.
Permanent artifact.

F2: bedah-buta/index.html + js/bedah-buta.js ada; template MURNI (tanpa emiten
    contoh yang dianalisis); 5 rasio wajib + formula; format vonis 5 baris;
    rubrik self-check 6 item; tips + link filing IDX/EDGAR (klaim akses real).
F5: bedah-filing/index.html ada; emiten SOCI Annual Report 2024 (filing real,
    angka dikutip dari PDF); 12 stop; peta modul per stop; kotak jujur +
    keterbatasan; link sumber filing.
Landing: 2 kartu fitur ber-link valid; gate Phase 2 -> bedah-buta;
    gate Phase 4 -> bedah-filing.
Regresi: tabel dalam .tblwrap; JS lolos node --check; tanpa console.error
    literal; penomoran PSAK baru (tanpa 71/72/73 telanjang).
"""
import os
import re
import subprocess
import sys

WEB = "/home/hatch/workspace/fsa-web"
fails = []

def check(name, cond):
    print(("ok   " if cond else "FAIL ") + name)
    if not cond:
        fails.append(name)

BB = open(f"{WEB}/bedah-buta/index.html", encoding="utf-8").read()
BBJS = open(f"{WEB}/js/bedah-buta.js", encoding="utf-8").read()
BF = open(f"{WEB}/bedah-filing/index.html", encoding="utf-8").read()
LAND = open(f"{WEB}/index.html", encoding="utf-8").read()

print("== F2 file & struktur ==")
check("bedah-buta/index.html ada", os.path.exists(f"{WEB}/bedah-buta/index.html"))
check("js/bedah-buta.js ada", os.path.exists(f"{WEB}/js/bedah-buta.js"))
check("nav + hero + modul-sec", all(x in BB for x in ["modul-nav", "modul-hero", "modul-sec"]))
check("css/style.css + modul.css", all(x in BB for x in ['href="../css/style.css"', 'href="../css/modul.css"']))
check("tblwrap.js di-load", 'src="../js/tblwrap.js"' in BB)

print("== F2 isi template ==")
for lens in ["Likuiditas", "Solvabilitas", "Profitabilitas", "Efisiensi", "Kualitas laba"]:
    check("rasio wajib: " + lens, lens in BB)
for formula in ["aset lancar ÷ liabilitas lancar", "total liabilitas ÷ total ekuitas",
                "laba bersih ÷ pendapatan", "pendapatan ÷ rata-rata total aset",
                "arus kas operasi ÷ laba bersih"]:
    check("formula: " + formula[:30], formula in BB)
check("format vonis 5 baris", BB.count("Baris ") >= 5 and "PEMBUNUH TESIS" in BB)
check("rubrik 6 item", BB.count('class="rq"') == 6)
check("rubrik sebut vonis/3 angka/pembunuh tesis",
      all(x in BB for x in ["beli / tahan / jual / hindari", "3 angka", "pembunuh tesis"]))
check("instruksi 7 langkah", BB.count("bb-steps") >= 1 and "90 menit" in BB)
check("link IDX", "idx.co.id" in BB)
check("link EDGAR browse", "sec.gov/cgi-bin/browse-edgar" in BB)
check("klaim akses dicek (3 Nov 2026)", "3 Nov 2026" in BB)
check("tanpa emiten contoh yang dianalisis",
      "PT Cemerlang Abadi" not in BB and "PT Nusantara Makmur" not in BB)
check("drill log localStorage", "fsa_bedahbuta_log" in BBJS)
check("JS escape HTML di log", "replace(/&/g" in BBJS)

print("== F5 file & isi ==")
check("bedah-filing/index.html ada", os.path.exists(f"{WEB}/bedah-filing/index.html"))
check("kotak jujur", "Kotak jujur" in BF)
check("keterbatasan", "Keterbatasan" in BF)
check("12 stop", BF.count('class="stop"') == 12)
check("identitas SOCI + ticker", all(x in BF for x in ["PT Soechi Lines Tbk", "SOCI"]))
check("link PDF AR 2024", "Annual%20Report%202024-SOCI%20final.pdf" in BF)
# angka real kunci dari filing
for num, label in [("165.638.994", "pendapatan"), ("17.130.116", "laba pemilik"),
                   ("0,86", "rasio lancar"), ("40.866.814", "CFO"),
                   ("3.414.388", "ECL"), ("83.970.644", "konsentrasi PIS"),
                   ("164.900.841", "utang bank"), ("10,4%", "ETR"),
                   ("1.891.088", "sewa berelasi")]:
    check("angka filing: %s (%s)" % (num, label), num in BF)
# peta modul per stop
for m in ["M4", "M5", "M6", "M7", "M8", "M10", "M12", "M13", "M16", "M22", "M23", "M24", "M28", "M32", "G2", "G5"]:
    check("peta modul " + m, m in BF)
check("kerangka filing berikutnya", "Kerangka untuk filing berikutnya" in BF)
check("bukan rekomendasi investasi", "Bukan rekomendasi investasi" in BF)

print("== Landing ==")
check("kartu Bedah Buta ber-link", 'href="bedah-buta/"' in LAND)
check("kartu Bedah Filing ber-link", 'href="bedah-filing/"' in LAND)
check("gate Phase 2 -> bedah-buta", "bedah-buta/" in LAND and "Phase 2" in LAND)
check("gate Phase 4 -> bedah-filing", "bedah-filing/" in LAND)

print("== Regresi ==")
check("semua tabel BB dalam tblwrap",
      BB.count("<table") == BB.count('class="tblwrap"') and BB.count('class="tblwrap"') >= 1)
check("tabel BF dalam tblwrap", BF.count('class="tblwrap"') >= 2)
for name, src in [("bedah-buta.js", BBJS)]:
    r = subprocess.run(["node", "--check", f"{WEB}/js/{name}"],
                       capture_output=True, text=True)
    check("node --check " + name, r.returncode == 0)
check("tanpa console.error literal", "console.error" not in BBJS)
# PSAK lama telanjang dilarang
old_psak = re.findall(r"PSAK\s*(?:No\.\s*)?(?:73|71|72)(?!\d)", BB + BF)
check("tanpa PSAK 71/72/73 telanjang", len(old_psak) == 0)
check("PSAK baru disebut (109/116/224/338)",
      all(x in BF for x in ["PSAK 109", "PSAK 116", "PSAK 224", "PSAK 338"]))

print()
if fails:
    print("FAILURES:", len(fails))
    sys.exit(1)
print("ALL GREEN")
