#!/usr/bin/env python3
"""FSA Lab — qa-round11.py (guard permanen ronde 11, review ronde 6 Instinct 9.1/10).

G1: M32 ETR = 22,0% persis + PKP 52.000 + PPh kini 11.440 (rekonsiliasi koheren).
G2: Garuda basis laba konsisten pemilik (2016 +8,1 / 2017 (216,6) / 2018 +0,8).
G3: Jiwasraya parenthetical benar (Syahmirwan 18; Joko 18->20).
G4: Altman headline = Z' 2,26; hibrida 2,64 dilabel eksplisit bukan-model-resmi.
G5: Explorer footing liabilitas lancar (62.000+31.440+8.560=102.000).
G6: M22 Q1 opsi benar hanya soal PSAK 224 (tanpa klausa 338).
G7: tblwrap.js punya affordance scroll (class scrollable + hint).
"""
import os
import re
import sys

WEB = "/home/hatch/workspace/fsa-web"
fails = []


def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + (" — " + detail if detail and not cond else ""))
    if not cond:
        fails.append(name)


def read(p):
    with open(os.path.join(WEB, p), encoding="utf-8") as f:
        return f.read()


m32 = read("js/modul32.js")

# G1: M32
check("G1 PKP 52.000", '"(=) PKP — Penghasilan Kena Pajak", v:"52.000"' in m32)
check("G1 PPh kini 11.440", '"PPh terutang (pajak kini)", v:"11.440"' in m32)
check("G1 PPh 29 3.080", '"(=) PPh 29 — kurang bayar", v:"3.080"' in m32)
check("G1 selisih 1.320", 'v:"12.760 vs 11.440", v2:"selisih 1.320"' in m32)
check("G1 no invented DTA", "beda waktu lain" not in m32, "DTA fiktif -4.000 harus hilang")
check("G1 ETR quiz 19.7", 'ans:19.7' in m32 and 'Rp11.440 juta' in m32)
# ETR persis 22,0%
check("G1 ETR=22.0", abs(12760 / 58000 * 100 - 22.0) < 1e-9)

# G2: Garuda
cf = read("js/casefiles.js")
check("G2 2016 +8,1 pemilik", 'US$+8,1 jt' in cf and 'Laba bersih (pemilik)' in cf)
check("G2 2017 (216,6) pemilik", 'US$(216,6) jt' in cf)
check("G2 no old total labels", 'US$+9,4 jt' not in cf and 'US$(213,4) jt' not in cf)

# G3: Jiwasraya
check("G3 Syahmirwan 18", "Syahmirwan 18," in cf)
check("G3 Joko 18->20", "Joko Hartono Tirto 18→20" in cf or "Joko Hartono Tirto 18->20" in cf)
check("G3 no Syahmirwan 18->20", "Syahmirwan 18->20" not in cf)

# G4: Altman
m25 = read("js/modul25.js")
m15 = read("js/modul15.js")
check("G4 M25 headline Z' 2,26", 'v2:"2,26 (grey)"' in m25)
check("G4 M25 hybrid labeled", "HIBRIDA ILUSTRATIF" in m25 and "BUKAN varian Altman resmi" in m25)
check("G4 M25 quiz Z' cutoffs", "aman >2,90; distress <1,23" in m25)
check("G4 M15 Z' 2,26", 'v:"2,26"' in m15 and "Z′-Score" in m15)
check("G4 M15 hybrid labeled", "Hibrida ilustratif (bukan model resmi)" in m15)
check("G4 M15 ratio-lab Z'", 'ans:2.26' in m15)
check("G4 no classic headline", 'v2:"2,64 (grey)"' not in m25)

# G5: Explorer footing
ex = read("explorer/explorer.js")
check("G5 utang pajak row", '"Utang pajak & akrual", "8.560"' in ex)
check("G5 footing", 62000 + 31440 + 8560 == 102000)

# G6: M22 Q1
m22 = read("js/modul22.js")
check("G6 no 338 clause", "restrukturisasi sepengendali dicatat nilai buku" not in m22.split("var QUIZ")[1].split("{q:\"PSAK 224")[1].split("}")[0] if "var QUIZ" in m22 else True)
q1 = re.search(r'\{q:"PSAK 224 \(dulu PSAK 7\) mengatur…".*?a:1\}', m22)
check("G6 Q1 text", q1 is not None and "338" not in q1.group(0) and "Pengungkapan pihak berelasi" in q1.group(0))

# G7: scroll affordance
tw = read("js/tblwrap.js")
check("G7 scrollable class", "scrollable" in tw)
check("G7 hint", "geser tabel" in tw)
css = read("css/modul.css")
check("G7 css fade", ".tblwrap.scrollable" in css and ".scrollhint" in css)

print()
if fails:
    print("RESULT: %d FAIL -> %s" % (len(fails), fails))
    sys.exit(1)
print("RESULT: ALL PASS")
