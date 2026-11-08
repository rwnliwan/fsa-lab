#!/usr/bin/env python3
"""QA FSA — guard penomoran PSAK di file modul (js/modul*.js).

Latar: guard PSAK lama (qa-wave1 / qa-phase9 / qa-round8) hanya memindai
index.html dan hanya nomor 71/72/73. Nomor lama di FILE MODUL lolos — ronde 5
menemukan 13 kemunculan nomor lama di modul28.js (PSAK 1/2/7/8/25/57) dan
modul32.js (PSAK 1), yang sudah diperbaiki ke penomoran baru (201/207/208/
210/224/237). Guard ini menutup celah itu secara permanen.

Aturan: tiap kemunculan "PSAK <nomor lama>" di js/modul*.js WAJIB berpasangan
dengan nomor barunya dalam ±80 karakter (penyebutan historis, mis.
"PSAK 109 (dulu PSAK 71)" atau "PSAK 71 berubah menjadi PSAK 109").
Tanpa pasangan = FAIL. Pemetaan lama->baru dibaca dari konverter/konverter.js
(sumber kebenaran yang sama dengan tool Konverter di situs). Nomor 102-112
tidak diperiksa (ambigu: lama sekaligus baru — konteks yang menentukan).
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_mapping():
    with open(os.path.join(ROOT, "konverter", "konverter.js"), encoding="utf-8") as f:
        src = f.read()
    mapping = {}
    for m in re.finditer(r'\{\s*t:"PSAK",\s*o:"(\d+)",\s*n:"(\d+)"', src):
        mapping[m.group(1)] = m.group(2)
    # Nomor 102-112 AMBIGU: nomor lama untuk satu topik SEKALIGUS nomor baru
    # untuk topik lain (mis. 109 lama = zakat -> 409; 109 baru = IFRS 9).
    # Modul memakai 102-112 sebagai nomor BARU (konteks IFRS) — JANGAN di-flag.
    # Hanya nomor yang TIDAK PERNAH jadi nomor baru yang unambiguous-old.
    new_numbers = set(mapping.values())
    return {o: n for o, n in mapping.items() if o not in new_numbers}


def main():
    mapping = load_mapping()
    if not mapping:
        print("FAIL qa-psak-modul: tabel konverter kosong")
        sys.exit(1)
    old_re = re.compile(r"PSAK\s+(" + "|".join(sorted(mapping, key=int)) + r")\b")
    fails = []
    scanned = 0
    jsdir = os.path.join(ROOT, "js")
    for fn in sorted(os.listdir(jsdir)):
        if not (fn.startswith("modul") and fn.endswith(".js")):
            continue
        scanned += 1
        with open(os.path.join(jsdir, fn), encoding="utf-8") as f:
            src = f.read()
        for m in old_re.finditer(src):
            old, new = m.group(1), mapping[m.group(1)]
            ctx = src[max(0, m.start() - 80):m.end() + 80]
            if new not in ctx:
                line = src[:m.start()].count("\n") + 1
                fails.append(f"{fn}:{line} PSAK {old} tanpa pasangan PSAK {new}")
    if fails:
        print(f"QA PSAK-MODUL: {len(fails)} FAIL")
        for f in fails:
            print("  FAIL " + f)
        sys.exit(1)
    print(f"QA PSAK-MODUL: ALL PASS ({scanned} file modul, "
          f"{len(mapping)} nomor lama dipetakan)")
    sys.exit(0)


if __name__ == "__main__":
    main()
