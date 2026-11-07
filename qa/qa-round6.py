#!/usr/bin/env python3
"""QA ROUND6 — regression guards dari verifikasi pra-review Phase 4+5+6 (3 Nov).

Kelas kesalahan yang ditemukan 3 worker verifikasi independen (WS-A/B/C)
dan WAJIB tidak terulang:

V1: Kunci quiz bertentangan dengan ajaran modul sendiri (M20 goodwill a:1,
    M21 kontinjensi a:2) — ditemukan WS-C.
V2: Miskalkulasi di teks explorer (M23 ruang dividen 16.620, bukan 31.620).
V3: Fakta kasus nyata salah tahun/jumlah (Wirecard FT=2019, Jiwasraya 802M=2018,
    5 tersangka 14 Jan 2020, MA Indosurya 16 Mei 2023) — ditemukan WS-A via
    verifikasi ke sumber (Reuters/BPK/Kejagung).
V4: Review bank mewarisi kunci salah — sweep 140/140 wajib cocok sumber. (Phase 8: 33 modul; Phase 9: 34 modul)
V5: Topik 10.7 & 11.4 (workbench 8 tools) — guard cakupan 67/67.
"""
import re, sys, json

WEB = "/home/hatch/workspace/fsa-web/"

def page_all(web_path):
    """HTML + isi js/inline-*.js yang dirujuk (Phase 10: <script> inline -> eksternal)."""
    import os as _os
    p = _os.path.join(WEB.rstrip("/"), web_path)
    html = open(p, encoding="utf-8").read() if _os.path.exists(p) else ""
    base = _os.path.dirname(p)
    for src in re.findall(r'<script\s+src="([^"]*inline-[^"]*\.js)"', html):
        jp = _os.path.normpath(_os.path.join(base, src))
        if _os.path.exists(jp):
            html += "\n" + open(jp, encoding="utf-8").read()
    return html
fails = []

def check(name, cond):
    print(("ok   " if cond else "FAIL ") + name)
    if not cond: fails.append(name)

m20 = open(WEB+"js/modul20.js", encoding="utf-8").read()
m21 = open(WEB+"js/modul21.js", encoding="utf-8").read()
m23 = open(WEB+"js/modul23.js", encoding="utf-8").read()
cf = open(WEB+"js/casefiles.js", encoding="utf-8").read()
wb = open(WEB+"workbench/fsa_toolkit.py", encoding="utf-8").read()
wbi = page_all("workbench/index.html")

print("== V1 kunci quiz vs ajaran modul ==")
check("M20 goodwill a:1", '"Dikurangkan dari tangible net worth","Setara kas untuk covenant","Jaminan utama pinjaman bila gagal bayar"], a:1}' in m20)
check("M20 kunci salah hilang", 'a:2}' not in m20.split("Kreditur menilai goodwill")[1].split("}")[0])
check("M21 kontinjensi a:2", '"Diungkap sebagai liabilitas kontinjensi","Dicatat sebagai aset kontinjensi"], a:2}' in m21)

print("== V2 angka explorer ==")
check("M23 ruang dividen 16.620", "16.620" in m23)
check("M23 angka salah hilang", "31.620" not in m23)
check("M23 recompute", abs(0.5*45240-6000-16620) < 1)

print("== V3 fakta case files (terverifikasi WS-A) ==")
check("Wirecard FT = Jan 2019", "Jan 2019: Financial Times" in cf)
check("Jiwasraya 802M di 2018", '"Gagal bayar klaim JS Saving Plan","Rp802 M (Nov 2018)"' in cf)
check("Jiwasraya 2019 tanpa 802M", cf.count('"Gagal bayar klaim","Rp802 M"') == 0)
check("5 tersangka 14 Jan 2020", "lima tersangka ditetapkan" in cf and "6 Feb 2020" in cf)
check("MA Indosurya 16 Mei 2023", "16 Mei 2023" in cf and "2113 K/Pid.Sus/2023" in cf)
check("MA 17 Mei hilang", "MA 17 Mei" not in cf)

print("== V4 review bank sweep ==")
bank = open(WEB+"js/review-bank.js", encoding="utf-8").read()
entries = json.loads(re.search(r'var REVIEW_BANK = (\[.*\]);', bank, re.S).group(1))
def _dec(raw):
    # JS string escapes (\uXXXX dsb.) didekode agar cocok dgn bank (bank = hasil json.loads)
    try:
        return json.loads('"' + raw + '"')
    except Exception:
        return raw
tot_mod = 0  # jumlah soal di modul (bukan lagi 5/modul: M12/M18/M30/M35 = 8)
qpat = re.compile(r'\{q:"((?:[^"\\]|\\.)*)",\s*o:\[((?:"(?:[^"\\]|\\.)*"\s*,\s*)*(?:"(?:[^"\\]|\\.)*"))\],\s*a:(\d)\}')
opat = re.compile(r'"((?:[^"\\]|\\.)*)"')
mm = 0
for n in range(1, 49):
    src = open(f"{WEB}js/modul{n}.js", encoding="utf-8").read()
    # source: q -> TEKS kunci (bukan posisi, karena bank me-shuffle opsi)
    src_qs = {}
    for m in qpat.finditer(src):
        opts = [_dec(o) for o in opat.findall(m.group(2))]
        src_qs[_dec(m.group(1))] = opts[int(m.group(3))]
    tot_mod += len(src_qs)
    for e in [x for x in entries if x["m"] == n]:
        if src_qs.get(e["q"], None) != e["o"][e["a"]]:
            mm += 1
check("bank = jumlah soal modul (%d)" % tot_mod, len(entries) == tot_mod)
check("252/252 kunci cocok sumber (by teks)", mm == 0)

print("== V5 workbench 8 tools (10.7 + 11.4) ==")
for t in ["beneish_mscore", "dso_screen", "benford_test", "xbrl_parse_ratios",
          "duplicate_detector", "gap_analysis", "redflag_scan", "fetch_edgar_facts"]:
    check("tool " + t, ("def %s(" % t) in wb)
check("halaman workbench 8 kartu", wbi.count("code-card") >= 8 or wbi.count('{t:"') >= 8)

print()
if fails:
    print(f"QA ROUND6: {len(fails)} FAIL")
    sys.exit(1)
print("QA ROUND6: LULUS")
