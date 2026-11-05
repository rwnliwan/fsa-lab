#!/usr/bin/env python3
"""BUILDER C — verifikasi: jawab semua A/B/C/D tidak boleh pass gate (>=80%) per modul."""
import re, sys

WEB = "/home/hatch/workspace/fsa-web/"
fails = []

for n in (1, 2, 4, 6):
    src = open(f"{WEB}js/modul{n}.js", encoding="utf-8").read()
    keys = [int(x) for x in re.findall(r'a:(\d)', src.split("var QUIZ")[1].split("];")[0])]
    dist = [keys.count(i) for i in range(4)]
    print(f"M{n}: 5 soal, distribusi A/B/C/D = {dist}")
    assert len(keys) == 5, f"M{n} bukan 5 soal"
    assert max(dist) <= 2, f"M{n} ada posisi >2"
    for pos, label in enumerate(["A", "B", "C", "D"]):
        score = sum(1 for k in keys if k == pos)
        ok = score < 4
        print(f"   jawab semua {label}: {score}/5 = {score*20}% {'OK (<80%)' if ok else 'FAIL — PASS GATE'}")
        if not ok:
            fails.append(f"M{n} all-{label}")

print()
if fails:
    print("GAGAL:", fails); sys.exit(1)
print("LULUS: semua modul, jawab 1 posisi penuh tidak bisa pass gate.")
