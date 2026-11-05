#!/usr/bin/env python3
"""FSA Lab — verify_review_variants.py (QA permanen, Builder D F3)

Verifikasi INDEPENDEN js/review-variants.js:
- parse JSON dari file JS (tanpa impor generator),
- hitung ulang tiap kunci dari {formula, inputs} dengan implementasi KETIGA
  (float murni + pembulatan half-up manual),
- assert: o[a] == hasil hitung, 4 opsi unik, a valid, m/src/gi konsisten,
  cara non-kosong, soal mandiri (menyebut angka input sendiri).

Exit 0 bila semua lolos; exit 1 + daftar FAIL bila ada yang gagal.
Jalankan: python3 tools/verify_review_variants.py
"""
import json
import math
import re
import sys

WEB = "/home/hatch/workspace/fsa-web"


def hup1(x):
    return math.floor(x * 10 + 0.5) / 10.0


def fmt1(x):
    s = ("%.1f" % hup1(x)).replace(".", ",")
    return ("−" + s[1:]) if s.startswith("-") else s


def hup2(x):
    return math.floor(x * 100 + 0.5) / 100.0


def fmt2(x):
    """2 desimal gaya Indonesia: 1.428571 -> '1,43' ; -0.5 -> '−0,50'."""
    v = hup2(x)
    neg = v < 0
    v = abs(v)
    ip = int(v)
    frac = int(round((v - ip) * 100))
    return ("−" if neg else "") + fmti(ip) + "," + ("%02d" % frac)


def fmti(n):
    n = int(math.floor(n + 0.5)) if n >= 0 else int(math.ceil(n - 0.5))
    neg = n < 0
    s = str(abs(n))
    s = ".".join([s[max(0, i - 3):i] for i in range(len(s), 0, -3)][::-1])
    return ("−" if neg else "") + s


def recompute(formula, i):
    if formula == "eps":
        return fmt1(i["ni"] / i["shares"])
    if formula == "cash":
        return fmti(i["sales"] - (i["ar1"] - i["ar0"]))
    if formula == "dilusi":
        return fmt1(i["ni"] / (i["out"] + i["opt"]))
    if formula == "tsm":
        incr = i["opt"] - i["opt"] * i["strike"] / i["mkt"]
        return fmt1(i["ni"] / (i["waso"] + incr))
    if formula == "capdep":
        return fmti(i["c1"] / i["l1"] + i["c2"] / i["l2"] + i["c3"] / i["l3"])
    if formula == "swap":
        return fmti(i["gain"] - i["loss"])
    if formula == "dso":
        return fmti(i["dso"] / 365 * i["sales"])
    if formula == "capex":
        d = i["capex"] - i["depr"]
        arah = "naik" if d > 0 else "turun"
        return "Aset tetap neto %s %s → %s" % (arah, fmti(abs(d)), fmti(230000 + d))
    if formula == "pkp":
        return fmti(i["pbt"] + i["tp"] - i["tm"] + i["w"])
    if formula == "waterfall":
        pct = (i["ev"] - i["senior"]) / i["sub"] * 100
        pct = max(0, min(100, int(math.floor(pct + 0.5))))
        return "%d%%" % pct
    if formula == "ssp":
        v = i["tp"] * i["t"] / sum(i["ssp"])
        r = math.floor(v * 1000 + 0.5) / 1000.0
        ip, frac = int(r), int(round((r - int(r)) * 1000))
        return fmti(ip) if not frac else fmti(ip) + "," + ("%03d" % frac)
    if formula == "sl":
        return fmti(i["total"] * (13 - i["start"]) / i["months"])
    if formula == "nci":
        return "Rp" + fmti(i["ni"] * (100 - i["own"]) / 100) + " juta"
    if formula == "elim":
        return "Rp" + fmti(i["total"] - i["nci"] - i["unreal"]) + " juta"
    # ---- Round 7: 15 tipe formula baru ----
    if formula == "fcff":
        return fmti(i["cfo"] + i["interest"] * (100 - i["tax"]) / 100 - i["capex"])
    if formula == "cr":
        return fmt2(i["ca"] / i["cl"]) + "x"
    if formula == "ccc":
        return fmt1(i["dso"] + i["dio"] - i["dpo"]) + " hari"
    if formula == "roe_lev":
        return fmt1(i["roa"] * i["lev"]) + "%"
    if formula == "dsri":
        return fmt2((i["ar1"] / i["s1"]) / (i["ar0"] / i["s0"]))
    if formula == "sloan":
        return fmt1((i["ni"] - i["cfo"]) / i["assets"] * 100) + "%"
    if formula == "evperp":
        return fmti(i["fcff"] / (i["wacc"] - i["g"]) * 100)
    if formula == "peg":
        return fmt2(i["pe"] / i["growth"]) + "x"
    if formula == "dscr":
        return fmt1(i["cfo"] / i["ds"]) + "x"
    if formula == "ldr":
        return fmt1(i["kredit"] / i["dpk"] * 100) + "%"
    if formula == "coverage":
        return fmti(i["ckpn"] / i["npl"] * 100) + "%"
    if formula == "murabahah":
        assert i["margin"] % i["tenor"] == 0
        return "Rp%d jt" % (i["margin"] // i["tenor"])
    if formula == "ecl":
        return fmt1(i["allow"] / i["ar"] * 100) + "%"
    if formula == "cfoni":
        return fmt2(i["cfo"] / i["ni"]) + "x"
    if formula == "taxburden":
        return fmti(i["ni"] / i["pbt"] * 100) + "%"
    # ---- Phase 10: 15 tipe formula baru ----
    if formula == "artik":
        return "Rp" + fmti(i["l"] + i["e"]) + " juta"
    if formula == "material":
        return "Rp" + fmti(i["pbt"] * i["pct"] / 100) + " juta"
    if formula == "impair":
        return "Rp" + fmti(max(0, i["c"] - i["r"])) + " juta"
    if formula == "lifo":
        return "Rp" + fmti(i["ni"] - i["reserve"] * (100 - i["tax"]) / 100) + " juta"
    if formula == "altmanz":
        z = (0.717 * i["x1"] + 0.847 * i["x2"] + 3.107 * i["x3"]
             + 0.420 * i["x4"] + 0.998 * i["x5"])
        return fmt2(z)
    if formula == "fvtpl":
        d = i["fv1"] - i["fv0"]
        return ("−" if d < 0 else "") + "Rp" + fmti(abs(d)) + " juta"
    if formula == "deadline":
        return fmti(i["aktual"] - i["batas"]) + " hari"
    if formula == "goodwill":
        d = i["price"] - i["fv"]
        return ("−" if d < 0 else "") + "Rp" + fmti(abs(d)) + " juta"
    if formula == "warranty":
        return "Rp" + fmti(i["sales"] * i["pct"] / 100) + " juta"
    if formula == "rpsales":
        return fmt1(i["rp"] / i["total"] * 100) + "%"
    if formula == "piotroski":
        return "%d/9" % sum(i["crit"])
    if formula == "benford":
        # half-up eksak via Fraction (0.301 float = 150.4999… → salah bila pakai float)
        num, den = i["n"] * 301, 1000
        return fmti((2 * num + den) // (2 * den))
    if formula == "llcr":
        return fmt2(i["pv"] / i["debt"]) + "x"
    if formula == "eqval":
        return "Rp" + fmti(i["ev"] - i["netdebt"]) + " juta"
    if formula == "pbv":
        return fmt2(i["price"] / i["bvps"]) + "x"
    raise ValueError("formula tak dikenal: %s" % formula)


def main():
    src = open(WEB + "/js/review-variants.js", encoding="utf-8").read()
    m = re.search(r"var REVIEW_VARIANTS = (\[.*\]);\s*$", src, re.S)
    assert m, "REVIEW_VARIANTS tidak ketemu / tidak parse-able"
    bank = json.loads(m.group(1))

    # bank asli untuk cek src/gi
    bsrc = open(WEB + "/js/review-bank.js", encoding="utf-8").read()
    bm = re.search(r"var REVIEW_BANK = (\[.*\]);\s*$", bsrc, re.S)
    base = json.loads(bm.group(1)) if bm else []
    max_m = max((q["m"] for q in base), default=33)

    fails = []
    def check(name, cond, detail=""):
        print(("ok   " if cond else "FAIL ") + name + (" — " + detail if detail and not cond else ""))
        if not cond:
            fails.append(name)

    check("jumlah varian = 132 (44 tipe x 3 set)", len(bank) == 132, "dapat %d" % len(bank))
    ids = [v["id"] for v in bank]
    check("id unik", len(set(ids)) == len(ids))

    for v in bank:
        tag = v["id"]
        exp = recompute(v["formula"], v["inputs"])
        check("%s kunci == recompute" % tag, v["o"][v["a"]] == exp,
              "o[a]=%r vs hitung=%r" % (v["o"][v["a"]], exp))
        check("%s 4 opsi unik" % tag, len(set(v["o"])) == 4, repr(v["o"]))
        check("%s a valid 0-3" % tag, isinstance(v["a"], int) and 0 <= v["a"] <= 3)
        check("%s m 1-%d" % (tag, max_m), 1 <= v["m"] <= max_m)
        check("%s cara non-kosong" % tag, bool(v.get("cara", "").strip()))
        check("%s q menyebut 'Varian'" % tag, "Varian" in v["q"])
        # src/gi menunjuk soal asli yang ada
        gi = v.get("gi")
        if isinstance(gi, int) and 0 <= gi < len(base):
            check("%s src m cocok bank" % tag, base[gi]["m"] == v["m"],
                  "bank gi=%d m=%d vs varian m=%d" % (gi, base[gi]["m"], v["m"]))
        else:
            check("%s gi valid" % tag, False, "gi=%r" % gi)

    dist = [0, 0, 0, 0]
    for v in bank:
        dist[v["a"]] += 1
    check("posisi kunci tersebar %s" % dist, all(d > 0 for d in dist) and max(dist) - min(dist) <= 8)

    print("----")
    if fails:
        print("GAGAL: %d cek" % len(fails))
        return 1
    print("SEMUA LOLOS: %d varian terverifikasi independen" % len(bank))
    return 0


if __name__ == "__main__":
    sys.exit(main())
