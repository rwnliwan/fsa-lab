#!/usr/bin/env python3
"""QA Gelombang 10 — FSA Lab Modul 22 (Pihak Berelasi & Tunneling), 23 (Covenant),
+ Case Files expansion (Wirecard, Jiwasraya, SNP Finance, Indosurya). Permanent artifact."""
import os, re, sys, subprocess

WEB = "/home/hatch/workspace/fsa-web"
fails = []

def check(name, cond):
    if not cond: fails.append(name)
    print(("FAIL " if not cond else "ok   ") + name)

for n in [22, 23]:
    check(f"modul-{n}/index.html ada", os.path.exists(WEB+f"/modul-{n}/index.html"))
    check(f"js/modul{n}.js ada", os.path.exists(WEB+f"/js/modul{n}.js"))

m22 = open(WEB+"/js/modul22.js", encoding="utf-8").read()
m23 = open(WEB+"/js/modul23.js", encoding="utf-8").read()
cf  = open(WEB+"/js/casefiles.js", encoding="utf-8").read()
h22 = open(WEB+"/modul-22/index.html", encoding="utf-8").read()
h23 = open(WEB+"/modul-23/index.html", encoding="utf-8").read()

print("== kicker & gate ==")
check("M22 kicker Phase 5", "Phase 5 · Forensik Lanjutan II · Modul 22" in h22)
check("M23 kicker Phase 5", "Phase 5 · Forensik Lanjutan II · Modul 23" in h23)
check("M22 gate -> ../modul-23/", "../modul-23/" in m22)
check("M23 gate Phase 5 Tuntas", "Gerbang Lolos ✓ — Phase 5 Tuntas!" in m23)
check("M23 gate -> ../modul-24/", "../modul-24/" in m23)
check("M23 tanpa modul-25", "../modul-25/" not in m23)
check("M22 PSAK 338 (nomor baru)", "PSAK 338" in m22)
check("M22/M23 tanpa PSAK 2-digit lama telanjang",
      not re.search(r'PSAK\s+[0-9]{2}\b(?!\s*\()', m22.replace("PSAK 338 (dulu 7)","")) 
      and not re.search(r'PSAK\s+[0-9]{2}\b', m23))

print("== M22 recompute ==")
check("konsentrasi penjualan 23,1%", abs(120000/520000*100-23.1) < 0.05)
check("konsentrasi piutang 50,0%", abs(52000/104000*100-50.0) < 0.05)
check("bocor transfer pricing 30.000", 120000/0.8-120000 == 30000)
check("subsidi bunga 3.200", 40000*0.08 == 3200)
check("80.000 = 44,6% ekuitas", abs(80000/179440*100-44.6) < 0.05)
check("kanonis: penjualan 520.000", "520.000" in m22)
check("M22 ratio ans di source", all(x in m22 for x in ["ans:23.1","ans:50.0","ans:30000","ans:3200"]))

print("== M23 recompute ==")
check("total utang 201.440", 31440+110000+60000 == 201440)
check("leverage 1,97", abs(201440/102000-1.97) < 0.005)
check("DSCR 0,91", abs(30800/34000-0.91) < 0.005)
check("headroom 104.560", 3.0*102000-201440 == 104560)
check("repricing 2.122", abs(141440*0.015-2122) < 1)
check("dividen 13,3%", abs(6000/45240*100-13.3) < 0.05)
check("M23 ratio ans di source", all(x in m23 for x in ["ans:1.97","ans:0.91","ans:104560","ans:2122"]))

print("== quiz distribusi kunci ==")
for name, src in [("M22",m22),("M23",m23)]:
    keys = [int(x) for x in re.findall(r'a:(\d)', src.split("var QUIZ")[1].split("];")[0])]
    check(f"{name} 5 soal", len(keys) == 5)
    check(f"{name} kunci tersebar (tidak 5/5 sama)", len(set(keys)) >= 3 and max(keys.count(k) for k in set(keys)) <= 2)
    print(f"     kunci {name}: {keys}")

print("== guard regresi M22/M23 ==")
for name, src in [("M22",m22),("M23",m23)]:
    n = name[1:]
    check(f"{name} parseIDNumber", "function parseIDNumber" in src)
    check(f"{name} quiz warning nomor soal", "melewatkan soal" in src)
    check(f"{name} gate permanen", "tetap tersimpan" in src)
    check(f"{name} anti double-count", "pgCards.indexOf(i) < 0" in src)
    check(f"{name} localStorage fsa_pg_m"+n, f"fsa_pg_m{n}" in src)
    check(f"{name} localStorage fsa_gate_m"+n, f"fsa_gate_m{n}" in src)
    check(f"{name} journal 3 lensa",
          f"fsa_journal_m{n}_" in src
          and all(k+":" in src.split("var LENSES")[1].split("};")[0] for k in ["invest","credit","forensic"]))
    check(f"{name} 6 kartu playground", src.count('{t:"') == 6)
    check(f"{name} skor /12", "/ 12 (" in src)
    check(f"{name} kunci tidak dibocorkan", "kunci tidak dibocorkan" in src)
    bare = re.findall(r'\{l:"([^"]+)",[^}]*d:"—",', src)
    check(f"{name} tanpa d:'—'", not bare)
    check(f"{name} 5 soal quiz", src.split("var QUIZ")[1].split("];")[0].count('{q:"') == 5)
    r = subprocess.run(["node","--check",WEB+"/js/modul"+n+".js"], capture_output=True, text=True)
    check(f"node --check modul{n}.js", r.returncode == 0)

print("== casefiles: 7 cases ==")
names = re.findall(r'\{name:"([^"]+)"', cf)
check("7 cases total", len(names) == 7)
check("2 kasus lama utuh", names[:2] == ["Garuda Indonesia","Enron"])
check("5 kasus baru", names[2:] == ["Wirecard","Jiwasraya","SNP Finance","Indosurya","Luckin Coffee"])
check("Garuda utuh (US$240 jt)", "US$~240 jt" in cf)
check("Enron utuh (US$101 M)", "US$101 M" in cf)
r = subprocess.run(["node","--check",WEB+"/js/casefiles.js"], capture_output=True, text=True)
check("node --check casefiles.js", r.returncode == 0)

print("== kasus baru: ctx sumber + angka terverifikasi ==")
newcases = {
 "Wirecard":  ("EY", "€1,9"),
 "Jiwasraya": ("BPK", "16,81"),
 "SNP Finance": ("KSEI", "6,75"),
 "Indosurya": ("Bareskrim", "106"),
}
for cname, (src_kw, num) in newcases.items():
    block = cf.split('{name:"'+cname+'"')[1].split("{name:")[0] if '{name:"'+cname+'"' in cf else ""
    ctx = block.split("ctx:")[1].split('",')[0] if "ctx:" in block else ""
    check(f"{cname} ctx ada sumber ({src_kw})", src_kw in ctx)
    check(f"{cname} angka terverifikasi ({num})", num in block)
    yrs = re.findall(r'\{y:"(\d+)"', block)
    check(f"{cname} 3 tahun", len(yrs) == 3)
    flags = re.findall(r'flag:(true|false)', block)
    # Desain case (8 Nov 2026): DUA tahun flag — tengah = tangkapan paling awal
    # (+1 bonus, lihat js/casefiles.js firstFlagIdx) dan akhir = pola berlanjut.
    # Anti-pola terpenuhi bila tahun TENGAH ikut di-flag: tebak "selalu tahun
    # terakhir" saja hanya dapat 4/7 tanpa bonus. Guard lama ["false","true","false"]
    # bertentangan dengan desain yang sudah live di 4 kasus baru ini.
    check(f"{cname} flag tahun tengah + pola berlanjut (tengah=earliest, akhir=lanjutan)", flags == ["false", "true", "true"])
    check(f"{cname} ada reveal pelajaran", "Pelajaran:" in block)

print()
if fails:
    print(f"QA WAVE10: {len(fails)} FAIL"); sys.exit(1)
print("QA WAVE10: LULUS")
sys.exit(0)
