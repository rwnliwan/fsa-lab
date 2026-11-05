#!/usr/bin/env python3
"""FSA Lab — gen_review_bank.py

Membaca js/modulN.js (N=1..38) dan mengekstrak tiap entri QUIZ {q, o, a}
menjadi js/review-bank.js untuk halaman Spaced Repetition.

- Bank mencakup 38 modul (M1-M38). WAJIB regenerate setiap modul baru lahir
  atau ada kunci quiz yang berubah.
- Output: var REVIEW_BANK = [{m:6, q:"...", o:["..","..","..",".."], a:0, why:"..."}, ...];
- Deterministik: urut modul naik, urut soal sesuai file.
- SHUFFLE (Builder F, Round 7): urutan opsi di bank review DIACAK per soal
  dengan seed deterministik (SEED + gi) agar stabil antar regenerate.
  Kunci `a` disesuaikan ke teks kunci asli — quiz GATE (js/modulN.js) TIDAK DIUBAH.
- WHY (Builder F, Round 7): tiap soal dapat 1 kalimat "kenapa kunci benar"
  dari tools/review_why_data.py -> field "why" (ditampilkan review/index.html
  saat jawaban salah).
"""
import json
import os
import random
import sys

WEB = "/home/hatch/workspace/fsa-web"
SEED = 20261109  # seed shuffle opsi bank review — JANGAN diubah (stabilitas).
# Dipilih karena memberi sebaran posisi kunci paling seimbang ([45,45,40,45]).


def read_js_string(src, i):
    """Parse JS double/single-quoted string dari indeks i (harus di quote pembuka).
    Return (string_terdecode, indeks_setelah_quote_penutup)."""
    q = src[i]
    assert q in "\"'"
    i += 1
    out = []
    while i < len(src):
        c = src[i]
        if c == "\\" and i + 1 < len(src):
            n = src[i + 1]
            if n == "n":
                out.append("\n")
            elif n == "t":
                out.append("\t")
            elif n == "r":
                out.append("\r")
            elif n == "u" and len(src) >= i + 6:
                try:
                    out.append(chr(int(src[i + 2:i + 6], 16)))
                    i += 6
                    continue
                except ValueError:
                    out.append(n)
            else:
                out.append(n)  # \" \\ \' dst.
            i += 2
            continue
        if c == q:
            return "".join(out), i + 1
        out.append(c)
        i += 1
    raise ValueError("string tidak tertutup")


def skip_ws(src, i):
    while i < len(src) and src[i] in " \t\r\n":
        i += 1
    return i


def parse_quiz_array(src):
    """Parse isi array setelah 'var QUIZ = ['; return list of {q, o, a}."""
    i = src.index("var QUIZ")
    i = src.index("[", i) + 1
    items = []
    while True:
        i = skip_ws(src, i)
        if i >= len(src):
            raise ValueError("array QUIZ tidak tertutup")
        if src[i] == "]":
            return items
        if src[i] == ",":
            i += 1
            continue
        if src[i] != "{":
            raise ValueError("entri QUIZ tak terduga: %r" % src[i:i + 20])
        # parse object {q:"..", o:[...], a:N}
        i += 1
        entry = {}
        while True:
            i = skip_ws(src, i)
            if src[i] == "}":
                i += 1
                break
            # key
            j = i
            while j < len(src) and (src[j].isalnum() or src[j] == "_"):
                j += 1
            key = src[i:j]
            i = skip_ws(src, j)
            assert src[i] == ":", src[i:i + 10]
            i = skip_ws(src, i + 1)
            if src[i] in "\"'":
                val, i = read_js_string(src, i)
            elif src[i] == "[":
                i += 1
                opts = []
                while True:
                    i = skip_ws(src, i)
                    if src[i] == "]":
                        i += 1
                        break
                    if src[i] == ",":
                        i += 1
                        continue
                    val, i = read_js_string(src, i)
                    opts.append(val)
                val = opts
            else:
                j = i
                while j < len(src) and (src[j].isdigit() or src[j] == "-"):
                    j += 1
                val = int(src[i:j])
                i = j
            entry[key] = val
            i = skip_ws(src, i)
            if src[i] == ",":
                i += 1
        items.append(entry)


def main():
    sys.path.insert(0, os.path.join(WEB, "tools"))
    from review_why_data import WHY
    bank = []
    found = []
    for n in range(1, 39):
        path = os.path.join(WEB, "js", "modul%d.js" % n)
        if not os.path.exists(path):
            continue  # modul belum ada — skip, regenerate nanti
        src = open(path, encoding="utf-8").read()
        if "var QUIZ" not in src:
            print("PERINGATAN: %s tanpa var QUIZ" % path, file=sys.stderr)
            continue
        items = parse_quiz_array(src)
        for idx, it in enumerate(items):
            bank.append({"m": n, "q": it["q"], "o": it["o"], "a": it["a"]})
        found.append((n, len(items)))
    for n, cnt in found:
        print("modul%-2d: %d soal" % (n, cnt))

    # ---- WHY: 1 kalimat per soal, urutan gi ----
    assert len(WHY) == len(bank), \
        "review_why_data.WHY=%d != bank=%d — sinkronkan dulu" % (len(WHY), len(bank))
    assert all(w.strip() for w in WHY), "ada why kosong"

    # ---- SHUFFLE deterministik opsi per soal (bank review SAJA) ----
    dist_a = [0, 0, 0, 0]
    for gi, entry in enumerate(bank):
        old_o, old_a = entry["o"], entry["a"]
        key_text = old_o[old_a]
        rng = random.Random(SEED + gi)
        order = list(range(len(old_o)))
        rng.shuffle(order)
        entry["o"] = [old_o[k] for k in order]
        entry["a"] = entry["o"].index(key_text)
        # kunci menunjuk teks yang sama seperti di gate
        assert entry["o"][entry["a"]] == key_text, "kunci bergeser pada gi=%d" % gi
        assert len(entry["o"]) == 4 and len(set(entry["o"])) == 4, "opsi rusak gi=%d" % gi
        entry["why"] = WHY[gi]
        dist_a[entry["a"]] += 1
    print("distribusi posisi kunci bank (setelah shuffle):", dist_a)
    assert all(d > 0 for d in dist_a), "ada posisi kunci yang kosong"
    assert max(dist_a) - min(dist_a) <= 8, "distribusi kunci terlalu timpang: %s" % dist_a
    out = "/* FSA Lab — REVIEW_BANK (auto-generated oleh tools/gen_review_bank.py).\n   JANGAN edit manual — regenerate dari js/modulN.js. */\nvar REVIEW_BANK = " \
        + json.dumps(bank, ensure_ascii=False) + ";\n"
    dest = os.path.join(WEB, "js", "review-bank.js")
    open(dest, "w", encoding="utf-8").write(out)
    print("-> %s : %d soal dari %d modul" % (dest, len(bank), len(found)))
    return bank


if __name__ == "__main__":
    main()
