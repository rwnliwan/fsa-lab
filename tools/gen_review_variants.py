#!/usr/bin/env python3
"""FSA Lab — gen_review_variants.py (Builder D, F3; Builder F Round 7)

Generate VARIAN NUMERIK soal quiz formulaik untuk SPACED REPETITION SAJA.

- Sumber konsep: soal formulaik di bank review (jawaban = hasil formula).
- Tiap varian: angka input DIUBAH (realistis & konsisten, Rp juta), soal
  mandiri (input disebut eksplisit di teks soal — TIDAK bergantung pada
  angka kanonis modul), kunci DIHITUNG ULANG via formula independen.
- Output: js/review-variants.js  (var REVIEW_VARIANTS = [...])
- Quiz gate modul (185 soal asli di js/modulN.js) TIDAK DIUBAH.
- Tiap varian menyimpan {inputs, formula, cara} agar QA bisa verifikasi
  ulang via tools/verify_review_variants.py (recompute independen).

Cakupan (Round 7 + Phase 10): 44 tipe formula x 3 set = 132 varian.
  Batch awal (12): eps, cash, dilusi, swap, dso, capex, pkp, waterfall,
    ssp, sl, nci, elim  (M9, M10, M27, M29, M31-M35)
  Batch Round 7 (15): fcff (M6), cr (M5), ccc (M4), roe_lev (M3),
    dsri (M13), sloan (M17), evperp (M18), peg (M24), dscr (M23),
    ldr (M30), coverage (M30), murabahah (M26), ecl (M11),
    cfoni (M2), taxburden (M8)
  Batch Phase 10 (15): artik (M1), material (M7), impair (M12),
    lifo (M14, PENGGANTI margin segmen — M14 = PSAK vs US GAAP, bukan segmen),
    altmanz (M15), fvtpl (M16), deadline (M19), goodwill (M20),
    warranty (M21), rpsales (M22), piotroski (M25), benford (M28),
    llcr (M33), eqval (M18), pbv (M24)
  Batch Phase 10 Workstream A (2): tsm (M36), capdep (M37)

Aturan QA (QA-PLAN.md): kunci quiz WAJIB verifikasi kebenaran via recompute
independen — generator ini memakai DUA jalur hitung (Decimal vs Fraction)
yang harus cocok, plus skrip verifikasi terpisah (jalur KETIGA).
"""
import json
import math
import os
import random
import sys
from decimal import Decimal, ROUND_HALF_UP
from fractions import Fraction

WEB = "/home/hatch/workspace/fsa-web"

# ---------------------------------------------------------------- formatting
def _D(x):
    """Ke Decimal secara eksak: dukung Decimal, Fraction, int, float, str desimal."""
    if isinstance(x, Fraction):
        return Decimal(x.numerator) / Decimal(x.denominator)
    return Decimal(str(x))


def fmt_int(n):
    """121667 -> '121.667' ; -400 -> '−400' (konvensi situs: minus U+2212)."""
    neg = n < 0
    s = "%d" % abs(int(n))
    s = ".".join([s[max(0, i - 3):i] for i in range(len(s), 0, -3)][::-1])
    return ("−" if neg else "") + s


def r1_half_up(x):
    """Bulatkan ke 1 desimal, half-up (bukan banker's rounding Python)."""
    return float(_D(x).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))


def fmt_1(x):
    """450.0 -> '450,0' ; 430.857 -> '430,9' ; negatif pakai U+2212."""
    v = r1_half_up(x)
    s = ("%.1f" % v).replace(".", ",")
    return ("−" + s[1:]) if s.startswith("-") else s


def fmt_2(x):
    """1.428571 -> '1,43' ; -0.5 -> '−0,50' (2 desimal, half-up)."""
    q = _D(x).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    neg = q < 0
    q = abs(q)
    ip = int(q)
    frac = int((q - ip) * 100)
    return ("−" if neg else "") + fmt_int(ip) + "," + ("%02d" % frac)


def rint_half_up(x):
    return int(_D(x).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def fmt_id3(x):
    """17777.777... -> '17.778' ; 36000 -> '36.000' (gaya jawaban asli M34)."""
    q = Decimal(str(x)).quantize(Decimal("0.001"), rounding=ROUND_HALF_UP)
    neg = q < 0
    q = abs(q)
    ip = int(q)
    frac = int((q - ip) * 1000)
    s = fmt_int(ip)
    if frac:
        return ("−" if neg else "") + s + "," + ("%03d" % frac)
    return ("−" if neg else "") + s


def fmt_rp(x):
    """5000 -> 'Rp5.000 juta'."""
    return "Rp" + fmt_int(x) + " juta"

# ------------------------------------------------- formula jalur 1 (Decimal)
def f_eps(i):
    return fmt_1(Decimal(i["ni"]) / Decimal(i["shares"]))

def f_cash(i):
    return fmt_int(rint_half_up(Decimal(i["sales"]) - (Decimal(i["ar1"]) - Decimal(i["ar0"]))))

def f_dilusi(i):
    return fmt_1(Decimal(i["ni"]) / Decimal(i["out"] + i["opt"]))

def f_swap(i):
    return fmt_int(rint_half_up(Decimal(i["gain"]) - Decimal(i["loss"])))

def f_dso(i):
    return fmt_int(rint_half_up(Decimal(i["dso"]) / Decimal(365) * Decimal(i["sales"])))

def f_capex(i):
    """Return (delta, nbv_baru). Opsi kalimat dirakit pemanggil."""
    delta = i["capex"] - i["depr"]
    return delta, 230000 + delta

def f_pkp(i):
    return fmt_int(rint_half_up(Decimal(i["pbt"]) + Decimal(i["tp"]) - Decimal(i["tm"]) + Decimal(i["w"])))

def f_waterfall(i):
    rec = Fraction(i["ev"] - i["senior"], i["sub"]) * 100
    pct = rint_half_up(float(rec))
    return "%d%%" % max(0, min(100, pct))

def f_ssp(i):
    """Alokasi harga transaksi proporsional SSP: tp × ssp_target / Σssp."""
    return fmt_id3(Decimal(i["tp"]) * Decimal(i["t"]) / Decimal(sum(i["ssp"])))

def f_sl(i):
    """Straight-line: total × bulan_di_tahun_berjalan / total_bulan."""
    mth = 13 - i["start"]
    return fmt_int(rint_half_up(Decimal(i["total"]) * Decimal(mth) / Decimal(i["months"])))

def f_nci(i):
    """NCI atas laba = laba_anak × (100 − kepemilikan_induk)%."""
    return fmt_rp(rint_half_up(Decimal(i["ni"]) * Decimal(100 - i["own"]) / Decimal(100)))

def f_elim(i):
    """Downstream: (laba_total − NCI) − laba_belum_direalisasi (eliminasi penuh)."""
    return fmt_rp(rint_half_up(Decimal(i["total"]) - Decimal(i["nci"]) - Decimal(i["unreal"])))

# --------------------------------------- Round 7: formula batch baru (Decimal)
def f_fcff(i):
    """FCFF = CFO + bunga×(1−pajak) − capex."""
    return fmt_int(rint_half_up(
        Decimal(i["cfo"]) + Decimal(i["interest"]) * (Decimal(100) - Decimal(i["tax"])) / Decimal(100)
        - Decimal(i["capex"])))

def f_cr(i):
    """Current ratio = aset lancar ÷ liabilitas lancar."""
    return fmt_2(Decimal(i["ca"]) / Decimal(i["cl"])) + "x"

def f_ccc(i):
    """CCC = DSO + DIO − DPO (hari)."""
    return fmt_1(_D(i["dso"]) + _D(i["dio"]) - _D(i["dpo"])) + " hari"

def f_roe_lev(i):
    """Identitas DuPont: ROE = ROA × leverage."""
    return fmt_1(Decimal(str(i["roa"])) * Decimal(str(i["lev"]))) + "%"

def f_dsri(i):
    """DSRI = (piutang1/penjualan1) ÷ (piutang0/penjualan0)."""
    return fmt_2(Decimal(i["ar1"]) / Decimal(i["s1"]) / (Decimal(i["ar0"]) / Decimal(i["s0"])))

def f_sloan(i):
    """Sloan ratio = (NI − CFO) ÷ total aset."""
    return fmt_1((Decimal(i["ni"]) - Decimal(i["cfo"])) / Decimal(i["assets"]) * 100) + "%"

def f_evperp(i):
    """EV perpetuity = FCFF ÷ (WACC − g)."""
    return fmt_int(rint_half_up(
        Decimal(i["fcff"]) / (Decimal(i["wacc"]) - Decimal(i["g"])) * 100))

def f_peg(i):
    """PEG = (P/E) ÷ growth%."""
    return fmt_2(Decimal(str(i["pe"])) / Decimal(str(i["growth"]))) + "x"

def f_dscr(i):
    """DSCR = CFO setelah bunga ÷ kewajiban bunga+pokok."""
    return fmt_1(Decimal(i["cfo"]) / Decimal(i["ds"])) + "x"

def f_ldr(i):
    """LDR = kredit ÷ DPK."""
    return fmt_1(Decimal(i["kredit"]) / Decimal(i["dpk"]) * 100) + "%"

def f_coverage(i):
    """NPL coverage = total CKPN ÷ NPL gross."""
    return fmt_int(rint_half_up(Decimal(i["ckpn"]) / Decimal(i["npl"]) * 100)) + "%"

def f_murabahah(i):
    """Margin diakui per tahun = margin ÷ tenor (tahun); tenor bulat."""
    assert i["margin"] % i["tenor"] == 0, "margin/tenor harus bulat"
    return "Rp%d jt" % (i["margin"] // i["tenor"])

def f_ecl(i):
    """Rasio ECL = cadangan ÷ piutang bruto."""
    return fmt_1(Decimal(i["allow"]) / Decimal(i["ar"]) * 100) + "%"

def f_cfoni(i):
    """CFO/NI — kualitas laba."""
    return fmt_2(Decimal(i["cfo"]) / Decimal(i["ni"])) + "x"

def f_taxburden(i):
    """Tax burden = NI ÷ PBT."""
    return fmt_int(rint_half_up(Decimal(i["ni"]) / Decimal(i["pbt"]) * 100)) + "%"

# ------------------------------ Phase 10: formula batch baru (Decimal)
def f_artik(i):
    """Artikulasi: total aset = total liabilitas + total ekuitas."""
    return fmt_rp(rint_half_up(Decimal(i["l"]) + Decimal(i["e"])))

def f_material(i):
    """Materialitas ilustratif = PBT × %."""
    return fmt_rp(rint_half_up(Decimal(i["pbt"]) * Decimal(i["pct"]) / Decimal(100)))

def f_impair(i):
    """Rugi impairment = max(0, carrying − recoverable) (PSAK 236)."""
    loss = max(0, rint_half_up(Decimal(i["c"]) - Decimal(i["r"])))
    return fmt_rp(loss)

def f_lifo(i):
    """NI GAAP (LIFO) = NI PSAK − LIFO reserve × (1 − pajak); PSAK 202 melarang LIFO."""
    return fmt_rp(rint_half_up(
        Decimal(i["ni"]) - Decimal(i["reserve"]) * (Decimal(100) - Decimal(i["tax"])) / Decimal(100)))

def f_altmanz(i):
    """Z' privat = 0,717·X1+0,847·X2+3,107·X3+0,420·X4+0,998·X5."""
    z = (Decimal("0.717") * Decimal(str(i["x1"])) + Decimal("0.847") * Decimal(str(i["x2"]))
         + Decimal("3.107") * Decimal(str(i["x3"])) + Decimal("0.420") * Decimal(str(i["x4"]))
         + Decimal("0.998") * Decimal(str(i["x5"])))
    return fmt_2(z)

def _rp_signed(d):
    neg = d < 0
    return ("−" if neg else "") + "Rp" + fmt_int(abs(d)) + " juta"

def f_fvtpl(i):
    """FVTPL (PSAK 109): ΔFV langsung ke laba rugi (amortised cost = 0)."""
    return _rp_signed(rint_half_up(Decimal(i["fv1"]) - Decimal(i["fv0"])))

def f_deadline(i):
    """Keterlambatan filing (ILUSTRATIF) = hari aktual − batas (hari kalender)."""
    return fmt_int(i["aktual"] - i["batas"]) + " hari"

def f_goodwill(i):
    """Goodwill = harga akuisisi − FV aset neto teridentifikasi."""
    return _rp_signed(rint_half_up(Decimal(i["price"]) - Decimal(i["fv"])))

def f_warranty(i):
    """Provisi garansi (PSAK 237) = % × penjualan."""
    return fmt_rp(rint_half_up(Decimal(i["sales"]) * Decimal(i["pct"]) / Decimal(100)))

def f_rpsales(i):
    """Konsentrasi pihak berelasi (PSAK 224) = penjualan RP ÷ total."""
    return fmt_1(Decimal(i["rp"]) / Decimal(i["total"]) * 100) + "%"

def f_piotroski(i):
    """F-score = jumlah kriteria terpenuhi dari 9 (Piotroski 2000)."""
    return "%d/9" % sum(i["crit"])

def f_benford(i):
    """Ekspektasi Benford digit-1 = 30,1% × n."""
    return fmt_int(rint_half_up(Decimal(i["n"]) * Decimal("0.301")))

def f_llcr(i):
    """LLCR (ilustratif) = NPV arus kas ÷ utang proyek."""
    return fmt_2(Decimal(i["pv"]) / Decimal(i["debt"])) + "x"

def f_eqval(i):
    """Nilai ekuitas = EV − utang bersih (EV ≠ ekuitas!)."""
    return fmt_rp(rint_half_up(Decimal(i["ev"]) - Decimal(i["netdebt"])))

def f_pbv(i):
    """P/B = harga saham ÷ nilai buku per saham."""
    return fmt_2(Decimal(str(i["price"])) / Decimal(str(i["bvps"]))) + "x"

def f_tsm(i):
    """Diluted EPS via treasury stock method = ni ÷ (waso + opt − opt×strike/mkt)."""
    incr = Decimal(i["opt"]) - Decimal(i["opt"] * i["strike"]) / Decimal(i["mkt"])
    return fmt_1(Decimal(i["ni"]) / (Decimal(i["waso"]) + incr))

def f_capdep(i):
    """Depresiasi komponen = c1/l1 + c2/l2 + c3/l3 (bukan single-rate)."""
    tot = (Decimal(i["c1"]) / Decimal(i["l1"]) + Decimal(i["c2"]) / Decimal(i["l2"])
           + Decimal(i["c3"]) / Decimal(i["l3"]))
    return fmt_int(rint_half_up(tot))

FORMULAS = {
    "eps": f_eps, "cash": f_cash, "dilusi": f_dilusi, "swap": f_swap,
    "dso": f_dso, "capex": f_capex, "pkp": f_pkp, "waterfall": f_waterfall,
    "ssp": f_ssp, "sl": f_sl, "nci": f_nci, "elim": f_elim,
    "fcff": f_fcff, "cr": f_cr, "ccc": f_ccc, "roe_lev": f_roe_lev,
    "dsri": f_dsri, "sloan": f_sloan, "evperp": f_evperp, "peg": f_peg,
    "dscr": f_dscr, "ldr": f_ldr, "coverage": f_coverage,
    "murabahah": f_murabahah, "ecl": f_ecl, "cfoni": f_cfoni,
    "taxburden": f_taxburden,
    "artik": f_artik, "material": f_material, "impair": f_impair,
    "lifo": f_lifo, "altmanz": f_altmanz, "fvtpl": f_fvtpl,
    "deadline": f_deadline, "goodwill": f_goodwill, "warranty": f_warranty,
    "rpsales": f_rpsales, "piotroski": f_piotroski, "benford": f_benford,
    "llcr": f_llcr, "eqval": f_eqval, "pbv": f_pbv,
    "tsm": f_tsm, "capdep": f_capdep,
}

# ------------------------------------------- formula jalur 2 (Fraction, cek)
def c_eps(i):
    return fmt_1(Fraction(i["ni"], i["shares"]))

def c_cash(i):
    return fmt_int(rint_half_up(Fraction(i["sales"]) - (Fraction(i["ar1"]) - Fraction(i["ar0"]))))

def c_dilusi(i):
    return fmt_1(Fraction(i["ni"], i["out"] + i["opt"]))

def c_swap(i):
    return fmt_int(rint_half_up(Fraction(i["gain"]) - Fraction(i["loss"])))

def c_dso(i):
    return fmt_int(rint_half_up(Fraction(i["dso"], 365) * i["sales"]))

def c_capex(i):
    delta = i["capex"] - i["depr"]
    return delta, 230000 + delta

def c_pkp(i):
    return fmt_int(rint_half_up(Fraction(i["pbt"]) + Fraction(i["tp"]) - Fraction(i["tm"]) + Fraction(i["w"])))

def c_waterfall(i):
    rec = Fraction(i["ev"] - i["senior"], i["sub"]) * 100
    pct = rint_half_up(float(rec))
    return "%d%%" % max(0, min(100, pct))

def c_ssp(i):
    v = Fraction(i["tp"] * i["t"], sum(i["ssp"]))
    r = math.floor(float(v) * 1000 + 0.5) / 1000.0
    ip, frac = int(r), int(round((r - int(r)) * 1000))
    return (fmt_int(ip) if not frac else fmt_int(ip) + "," + ("%03d" % frac))

def c_sl(i):
    mth = 13 - i["start"]
    return fmt_int(rint_half_up(Fraction(i["total"]) * Fraction(mth, i["months"])))

def c_nci(i):
    return fmt_rp(rint_half_up(Fraction(i["ni"]) * Fraction(100 - i["own"], 100)))

def c_elim(i):
    return fmt_rp(rint_half_up(Fraction(i["total"]) - Fraction(i["nci"]) - Fraction(i["unreal"])))

# --------------------------------- Round 7: formula batch baru (Fraction, cek)
def c_fcff(i):
    v = Fraction(i["cfo"]) + Fraction(i["interest"]) * Fraction(100 - i["tax"], 100) - Fraction(i["capex"])
    return fmt_int(rint_half_up(v))

def c_cr(i):
    return fmt_2(_D(Fraction(i["ca"], i["cl"]))) + "x"

def c_ccc(i):
    v = Fraction(i["dso"]) + Fraction(i["dio"]) - Fraction(str(i["dpo"]))
    return fmt_1(_D(v)) + " hari"

def c_roe_lev(i):
    v = Fraction(str(i["roa"])) * Fraction(str(i["lev"]))
    return fmt_1(_D(v)) + "%"

def c_dsri(i):
    v = Fraction(i["ar1"], i["s1"]) / Fraction(i["ar0"], i["s0"])
    return fmt_2(_D(v))

def c_sloan(i):
    v = (Fraction(i["ni"]) - Fraction(i["cfo"])) / Fraction(i["assets"]) * 100
    return fmt_1(_D(v)) + "%"

def c_evperp(i):
    v = Fraction(i["fcff"] * 100, i["wacc"] - i["g"])
    return fmt_int(rint_half_up(v))

def c_peg(i):
    v = Fraction(str(i["pe"])) / Fraction(str(i["growth"]))
    return fmt_2(_D(v)) + "x"

def c_dscr(i):
    return fmt_1(_D(Fraction(i["cfo"], i["ds"]))) + "x"

def c_ldr(i):
    v = Fraction(i["kredit"], i["dpk"]) * 100
    return fmt_1(_D(v)) + "%"

def c_coverage(i):
    v = Fraction(i["ckpn"], i["npl"]) * 100
    return fmt_int(rint_half_up(v)) + "%"

def c_murabahah(i):
    assert i["margin"] % i["tenor"] == 0, "margin/tenor harus bulat"
    return "Rp%d jt" % (i["margin"] // i["tenor"])

def c_ecl(i):
    v = Fraction(i["allow"], i["ar"]) * 100
    return fmt_1(_D(v)) + "%"

def c_cfoni(i):
    return fmt_2(_D(Fraction(i["cfo"], i["ni"]))) + "x"

def c_taxburden(i):
    v = Fraction(i["ni"], i["pbt"]) * 100
    return fmt_int(rint_half_up(v)) + "%"

# -------------------------------- Phase 10: formula batch baru (Fraction, cek)
def c_artik(i):
    return fmt_rp(rint_half_up(Fraction(i["l"]) + Fraction(i["e"])))

def c_material(i):
    return fmt_rp(rint_half_up(Fraction(i["pbt"]) * Fraction(i["pct"], 100)))

def c_impair(i):
    loss = max(0, rint_half_up(Fraction(i["c"]) - Fraction(i["r"])))
    return fmt_rp(loss)

def c_lifo(i):
    v = Fraction(i["ni"]) - Fraction(i["reserve"]) * Fraction(100 - i["tax"], 100)
    return fmt_rp(rint_half_up(v))

def c_altmanz(i):
    z = (Fraction("0.717") * Fraction(str(i["x1"])) + Fraction("0.847") * Fraction(str(i["x2"]))
         + Fraction("3.107") * Fraction(str(i["x3"])) + Fraction("0.420") * Fraction(str(i["x4"]))
         + Fraction("0.998") * Fraction(str(i["x5"])))
    return fmt_2(_D(z))

def c_fvtpl(i):
    return _rp_signed(rint_half_up(Fraction(i["fv1"]) - Fraction(i["fv0"])))

def c_deadline(i):
    return fmt_int(i["aktual"] - i["batas"]) + " hari"

def c_goodwill(i):
    return _rp_signed(rint_half_up(Fraction(i["price"]) - Fraction(i["fv"])))

def c_warranty(i):
    return fmt_rp(rint_half_up(Fraction(i["sales"]) * Fraction(i["pct"], 100)))

def c_rpsales(i):
    return fmt_1(_D(Fraction(i["rp"], i["total"]) * 100)) + "%"

def c_piotroski(i):
    return "%d/9" % sum(i["crit"])

def c_benford(i):
    return fmt_int(rint_half_up(Fraction(i["n"] * 301, 1000)))

def c_llcr(i):
    return fmt_2(_D(Fraction(i["pv"], i["debt"]))) + "x"

def c_eqval(i):
    return fmt_rp(rint_half_up(Fraction(i["ev"]) - Fraction(i["netdebt"])))

def c_pbv(i):
    return fmt_2(_D(Fraction(str(i["price"])) / Fraction(str(i["bvps"])))) + "x"

def c_tsm(i):
    incr = Fraction(i["opt"]) - Fraction(i["opt"] * i["strike"], i["mkt"])
    return fmt_1(_D(Fraction(i["ni"], 1) / (Fraction(i["waso"], 1) + incr)))

def c_capdep(i):
    tot = (Fraction(i["c1"], i["l1"]) + Fraction(i["c2"], i["l2"])
           + Fraction(i["c3"], i["l3"]))
    return fmt_int(rint_half_up(_D(tot)))

CHECKS = {
    "eps": c_eps, "cash": c_cash, "dilusi": c_dilusi, "swap": c_swap,
    "dso": c_dso, "capex": c_capex, "pkp": c_pkp, "waterfall": c_waterfall,
    "ssp": c_ssp, "sl": c_sl, "nci": c_nci, "elim": c_elim,
    "fcff": c_fcff, "cr": c_cr, "ccc": c_ccc, "roe_lev": c_roe_lev,
    "dsri": c_dsri, "sloan": c_sloan, "evperp": c_evperp, "peg": c_peg,
    "dscr": c_dscr, "ldr": c_ldr, "coverage": c_coverage,
    "murabahah": c_murabahah, "ecl": c_ecl, "cfoni": c_cfoni,
    "taxburden": c_taxburden,
    "artik": c_artik, "material": c_material, "impair": c_impair,
    "lifo": c_lifo, "altmanz": c_altmanz, "fvtpl": c_fvtpl,
    "deadline": c_deadline, "goodwill": c_goodwill, "warranty": c_warranty,
    "rpsales": c_rpsales, "piotroski": c_piotroski, "benford": c_benford,
    "llcr": c_llcr, "eqval": c_eqval, "pbv": c_pbv,
    "tsm": c_tsm, "capdep": c_capdep,
}

# ================================================================== SPEK
# Tiap varian: q (teks soal mandiri), inputs, traps (3 distraktor), cara.
# Distraktor = kesalahan hitung yang umum (salah tanda, lupa komponen, dst).
FAMILIES = [
 dict(fam="eps", m=9, src="M9#1", gi=40, formula="eps", judul="EPS dasar",
      variants=[
   dict(q="Varian latihan: laba bersih Rp54.000 juta (termasuk one-off jual aset Rp6.000 juta), saham beredar 120 juta. EPS dasar?",
        inputs={"ni": 54000, "oneoff": 6000, "shares": 120, "old_shares": 100},
        kunci="54000/120", traps=["400,0", "540,0", "500,0"],
        cara="EPS = 54.000 ÷ 120 = 450,0 (one-off tetap di NI untuk EPS dasar; continuing = 48.000 ÷ 120 = 400,0)"),
   dict(q="Varian latihan: laba bersih Rp36.000 juta (termasuk one-off Rp4.500 juta), saham beredar 90 juta (tahun lalu 72 juta). EPS dasar?",
        inputs={"ni": 36000, "oneoff": 4500, "shares": 90, "old_shares": 72},
        kunci="36000/90", traps=["350,0", "500,0", "450,0"],
        cara="EPS = 36.000 ÷ 90 = 400,0 (pakai saham kini 90 juta, bukan 72 juta; continuing = 31.500 ÷ 90 = 350,0)"),
   dict(q="Varian latihan: laba bersih Rp63.000 juta (termasuk one-off Rp7.000 juta), saham beredar 140 juta (tahun lalu 100 juta). EPS dasar?",
        inputs={"ni": 63000, "oneoff": 7000, "shares": 140, "old_shares": 100},
        kunci="63000/140", traps=["400,0", "630,0", "500,0"],
        cara="EPS = 63.000 ÷ 140 = 450,0 (one-off tidak dikeluarkan; continuing = 56.000 ÷ 140 = 400,0)"),
  ]),
 dict(fam="cash", m=10, src="M10#2", gi=46, formula="cash", judul="Kas dari pelanggan",
      variants=[
   dict(q="Varian latihan: penjualan Rp600.000 juta; piutang usaha naik dari Rp80.000 juta menjadi Rp140.000 juta. Kas dari pelanggan (metode langsung)?",
        inputs={"sales": 600000, "ar0": 80000, "ar1": 140000},
        kunci="600000-(140000-80000)", traps=["600.000", "660.000", "140.000"],
        cara="Kas dari pelanggan = 600.000 − (140.000 − 80.000) = 540.000"),
   dict(q="Varian latihan: penjualan Rp450.000 juta; piutang usaha turun dari Rp120.000 juta menjadi Rp95.000 juta. Kas dari pelanggan (metode langsung)?",
        inputs={"sales": 450000, "ar0": 120000, "ar1": 95000},
        kunci="450000-(95000-120000)", traps=["450.000", "425.000", "95.000"],
        cara="Kas dari pelanggan = 450.000 − (95.000 − 120.000) = 475.000 (piutang turun → kas > penjualan)"),
   dict(q="Varian latihan: penjualan Rp780.000 juta; piutang usaha naik dari Rp200.000 juta menjadi Rp260.000 juta. Kas dari pelanggan (metode langsung)?",
        inputs={"sales": 780000, "ar0": 200000, "ar1": 260000},
        kunci="780000-(260000-200000)", traps=["780.000", "840.000", "260.000"],
        cara="Kas dari pelanggan = 780.000 − (260.000 − 200.000) = 720.000"),
  ]),
 dict(fam="dilusi", m=27, src="M27#3", gi=132, formula="dilusi", judul="Dilusi maksimum",
      variants=[
   dict(q="Varian latihan (ILUSTRATIF): laba bersih Rp60.000 juta; 100 juta saham beredar + 25 juta opsi saham karyawan. Dilusi MAKSIMUM per saham (Rp, tanpa treasury stock method)?",
        inputs={"ni": 60000, "out": 100, "opt": 25},
        kunci="60000/(100+25)", traps=["600,0", "533,3", "400,0"],
        cara="Dilusi maks = 60.000 ÷ (100 + 25) = 480,0"),
   dict(q="Varian latihan (ILUSTRATIF): laba bersih Rp48.000 juta; 120 juta saham beredar + 30 juta opsi saham karyawan. Dilusi MAKSIMUM per saham (Rp, tanpa treasury stock method)?",
        inputs={"ni": 48000, "out": 120, "opt": 30},
        kunci="48000/(120+30)", traps=["400,0", "355,6", "266,7"],
        cara="Dilusi maks = 48.000 ÷ (120 + 30) = 320,0"),
   dict(q="Varian latihan (ILUSTRATIF): laba bersih Rp75.000 juta; 150 juta saham beredar + 50 juta opsi saham karyawan. Dilusi MAKSIMUM per saham (Rp, tanpa treasury stock method)?",
        inputs={"ni": 75000, "out": 150, "opt": 50},
        kunci="75000/(150+50)", traps=["500,0", "428,6", "300,0"],
        cara="Dilusi maks = 75.000 ÷ (150 + 50) = 375,0"),
  ]),
 dict(fam="swap", m=29, src="M29#2", gi=141, formula="swap", judul="Net swap ke P&L",
      variants=[
   dict(q="Varian latihan (ILUSTRATIF, Rp juta): swap gain 7.200, utang USD loss 6.850. Net yang langsung ke P&L (setelah rugi FX utang + reklasifikasi cadangan hedge)?",
        inputs={"gain": 7200, "loss": 6850},
        kunci="7200-6850", traps=["6.850", "14.050", "0 — semuanya ke OCI"],
        cara="Net ke P&L = 7.200 − 6.850 = 350. Jembatan jurnal (cash flow hedge, PSAK 109): rugi FX utang 6.850 → P&L; gain swap 7.200: efektif 6.850 → OCI (aturan lower-of), 350 ineffektif → P&L; reklasifikasi 6.850 dari OCI → P&L mengimbangi rugi FX. Net = −6.850 + 6.850 + 350 = 350. CATATAN: yang ditanya adalah NET P&L, bukan hedge ineffectiveness — keduanya kebetulan sama (350) hanya karena ini OVER-hedge."),
   dict(q="Varian latihan (ILUSTRATIF, Rp juta): swap gain 12.000, utang USD loss 12.400. Net yang langsung ke P&L (setelah rugi FX utang + reklasifikasi cadangan hedge)?",
        inputs={"gain": 12000, "loss": 12400},
        kunci="12000-12400", traps=["12.400", "24.400", "0 — semuanya ke OCI"],
        cara="Net ke P&L = 12.000 − 12.400 = −400. Jembatan jurnal (cash flow hedge, PSAK 109): rugi FX utang USD 12.400 → P&L; gain swap 12.000: UNDER-hedge (swap lebih kecil dari eksposur) → aturan lower-of → porsi efektif = 12.000 PENUH → OCI (cash flow hedge reserve), sehingga hedge ineffectiveness = 0; lalu reklasifikasi 12.000 dari OCI → P&L mengimbangi rugi FX. Net P&L = −12.400 + 12.000 + 0 = −400. CATATAN: −400 ini BUKAN hedge ineffectiveness (yang = 0), melainkan net P&L setelah rugi FX utang + recycling cadangan — dua ukuran yang berbeda, yang hanya kebetulan sama pada kasus over-hedge."),
   dict(q="Varian latihan (ILUSTRATIF, Rp juta): swap gain 9.600, utang USD loss 3.100. Net yang langsung ke P&L (setelah rugi FX utang + reklasifikasi cadangan hedge)?",
        inputs={"gain": 9600, "loss": 3100},
        kunci="9600-3100", traps=["3.100", "12.700", "0 — semuanya ke OCI"],
        cara="Net ke P&L = 9.600 − 3.100 = 6.500. Jembatan jurnal (cash flow hedge, PSAK 109): rugi FX utang 3.100 → P&L; gain swap 9.600: efektif 3.100 → OCI (aturan lower-of), 6.500 ineffektif → P&L; reklasifikasi 3.100 dari OCI → P&L mengimbangi rugi FX. Net = −3.100 + 3.100 + 6.500 = 6.500. CATATAN: yang ditanya adalah NET P&L, bukan hedge ineffectiveness — keduanya kebetulan sama (6.500) hanya karena ini OVER-hedge."),
  ]),
 dict(fam="dso", m=31, src="M31#2", gi=151, formula="dso", judul="Piutang forecast (DSO)",
      variants=[
   dict(q="Varian latihan: DSO 2026 = 60 hari; penjualan 2026 = Rp730.000 juta; piutang 2025 = Rp100.000 juta. Piutang usaha 2026 = …",
        inputs={"dso": 60, "sales": 730000, "ar2025": 100000},
        kunci="60/365*730000", traps=["100.000 (sama seperti 2025)", "121.667", "130.000"],
        cara="Piutang = 60/365 × 730.000 = 120.000"),
   dict(q="Varian latihan: DSO 2026 = 90 hari; penjualan 2026 = Rp547.500 juta; piutang 2025 = Rp110.000 juta. Piutang usaha 2026 = …",
        inputs={"dso": 90, "sales": 547500, "ar2025": 110000},
        kunci="90/365*547500", traps=["110.000 (sama seperti 2025)", "136.875", "142.500"],
        cara="Piutang = 90/365 × 547.500 = 135.000"),
   dict(q="Varian latihan: DSO 2026 = 45 hari; penjualan 2026 = Rp876.000 juta; piutang 2025 = Rp95.000 juta. Piutang usaha 2026 = …",
        inputs={"dso": 45, "sales": 876000, "ar2025": 95000},
        kunci="45/365*876000", traps=["95.000 (sama seperti 2025)", "109.500", "120.000"],
        cara="Piutang = 45/365 × 876.000 = 108.000"),
  ]),
 dict(fam="capex", m=31, src="M31#4", gi=153, formula="capex", judul="Capex vs depresiasi",
      variants=[
   dict(q="Varian latihan: capex Rp60.000 juta > depresiasi Rp28.000 juta. Dampak ke neraca? (aset tetap neto awal Rp230.000 juta)",
        inputs={"capex": 60000, "depr": 28000},
        kunci="60000-28000 -> 262000",
        traps=["Aset tetap neto turun 32.000", "Tidak ada dampak ke neraca", "Ekuitas naik 32.000"],
        cara="Δ = 60.000 − 28.000 = 32.000 → aset tetap neto 230.000 + 32.000 = 262.000"),
   dict(q="Varian latihan: depresiasi Rp45.000 juta > capex Rp40.000 juta. Dampak ke neraca? (aset tetap neto awal Rp230.000 juta)",
        inputs={"capex": 40000, "depr": 45000},
        kunci="40000-45000 -> 225000",
        traps=["Aset tetap neto naik 5.000", "Tidak ada dampak ke neraca", "Ekuitas turun 5.000"],
        cara="Δ = 40.000 − 45.000 = −5.000 → aset tetap neto 230.000 − 5.000 = 225.000 (kontraksi)"),
   dict(q="Varian latihan: capex Rp72.000 juta > depresiasi Rp30.000 juta. Dampak ke neraca? (aset tetap neto awal Rp230.000 juta)",
        inputs={"capex": 72000, "depr": 30000},
        kunci="72000-30000 -> 272000",
        traps=["Aset tetap neto turun 42.000", "Tidak ada dampak ke neraca", "Ekuitas naik 42.000"],
        cara="Δ = 72.000 − 30.000 = 42.000 → aset tetap neto 230.000 + 42.000 = 272.000"),
  ]),
 dict(fam="pkp", m=32, src="M32#1", gi=155, formula="pkp", judul="PKP rekonsiliasi fiskal",
      variants=[
   dict(q="Varian latihan: PBT Rp70.000 juta, beda tetap +Rp5.000 juta (non-deductible), beda tetap −Rp7.000 juta (penghasilan final), beda waktu −Rp3.000 juta. PKP-nya…",
        inputs={"pbt": 70000, "tp": 5000, "tm": 7000, "w": -3000},
        kunci="70000+5000-7000-3000", traps=["Rp71.000 juta", "Rp67.000 juta", "Rp79.000 juta"],
        cara="PKP = 70.000 + 5.000 − 7.000 − 3.000 = 65.000"),
   dict(q="Varian latihan: PBT Rp46.000 juta, beda tetap +Rp8.000 juta (non-deductible), beda tetap −Rp2.000 juta (penghasilan final), beda waktu −Rp5.000 juta. PKP-nya…",
        inputs={"pbt": 46000, "tp": 8000, "tm": 2000, "w": -5000},
        kunci="46000+8000-2000-5000", traps=["Rp57.000 juta", "Rp41.000 juta", "Rp51.000 juta"],
        cara="PKP = 46.000 + 8.000 − 2.000 − 5.000 = 47.000"),
   dict(q="Varian latihan: PBT Rp88.000 juta, beda tetap +Rp3.000 juta (non-deductible), beda tetap −Rp9.000 juta (penghasilan final), beda waktu +Rp4.000 juta. PKP-nya…",
        inputs={"pbt": 88000, "tp": 3000, "tm": 9000, "w": 4000},
        kunci="88000+3000-9000+4000", traps=["Rp78.000 juta", "Rp92.000 juta", "Rp96.000 juta"],
        cara="PKP = 88.000 + 3.000 − 9.000 + 4.000 = 86.000"),
  ]),
 dict(fam="waterfall", m=33, src="M33#5", gi=164, formula="waterfall", judul="Recovery waterfall",
      variants=[
   dict(q="Varian latihan (ILUSTRATIF): EV 300.000; klaim senior 180.000; subordinasi 200.000. Recovery kreditur subordinasi = …",
        inputs={"ev": 300000, "senior": 180000, "sub": 200000},
        kunci="(300000-180000)/200000", traps=["100%", "0%", "150%"],
        cara="Recovery = (300.000 − 180.000) ÷ 200.000 = 60%"),
   dict(q="Varian latihan (ILUSTRATIF): EV 240.000; klaim senior 200.000; subordinasi 160.000. Recovery kreditur subordinasi = …",
        inputs={"ev": 240000, "senior": 200000, "sub": 160000},
        kunci="(240000-200000)/160000", traps=["100%", "0%", "150%"],
        cara="Recovery = (240.000 − 200.000) ÷ 160.000 = 25%"),
   dict(q="Varian latihan (ILUSTRATIF): EV 180.000; klaim senior 200.000; subordinasi 150.000. Recovery kreditur subordinasi = …",
        inputs={"ev": 180000, "senior": 200000, "sub": 150000},
        kunci="max(0,(180000-200000)/150000)", traps=["100%", "120%", "−13%"],
        cara="Recovery = (180.000 − 200.000) ÷ 150.000 < 0 → 0% (senior saja tak lunas penuh)"),
  ]),
 dict(fam="ssp", m=34, src="M34#2", gi=166, formula="ssp", judul="Alokasi SSP (PSAK 115)",
      variants=[
   dict(q="Varian latihan (ilustratif): harga transaksi Rp180.000 juta; SSP alat Rp140.000 juta, instalasi Rp20.000 juta, garansi Rp40.000 juta. Alokasi ke garansi = … (Rp juta)",
        inputs={"tp": 180000, "ssp": [140000, 20000, 40000], "t": 40000},
        kunci="180000*40000/200000", traps=["40.000", "45.000", "144.000"],
        cara="Alokasi garansi = 180.000 × 40.000 ÷ 200.000 = 36.000"),
   dict(q="Varian latihan (ilustratif): harga transaksi Rp90.000 juta; SSP alat Rp60.000 juta, instalasi Rp15.000 juta, garansi Rp25.000 juta. Alokasi ke garansi = … (Rp juta)",
        inputs={"tp": 90000, "ssp": [60000, 15000, 25000], "t": 25000},
        kunci="90000*25000/100000", traps=["25.000", "30.000", "67.500"],
        cara="Alokasi garansi = 90.000 × 25.000 ÷ 100.000 = 22.500"),
   dict(q="Varian latihan (ilustratif): harga transaksi Rp140.000 juta; SSP alat Rp100.000 juta, instalasi Rp25.000 juta, garansi Rp25.000 juta. Alokasi ke garansi = … (Rp juta)",
        inputs={"tp": 140000, "ssp": [100000, 25000, 25000], "t": 25000},
        kunci="140000*25000/150000", traps=["25.000", "28.000", "116.667"],
        cara="Alokasi garansi = 140.000 × 25.000 ÷ 150.000 = 23.333"),
  ]),
 dict(fam="sl", m=34, src="M34#4", gi=168, formula="sl", judul="Straight-line revenue",
      variants=[
   dict(q="Varian latihan (ilustratif): alokasi garansi Rp36.000 juta diakui straight-line 24 bulan mulai April 2026. Pendapatan garansi selama 2026 = … (Rp juta)",
        inputs={"total": 36000, "months": 24, "start": 4},
        kunci="36000*9/24", traps=["36.000", "18.000", "1.500"],
        cara="2026 = 36.000 × 9/24 = 13.500 (Apr–Des = 9 bulan)"),
   dict(q="Varian latihan (ilustratif): alokasi garansi Rp22.500 juta diakui straight-line 12 bulan mulai Juli 2026. Pendapatan garansi selama 2026 = … (Rp juta)",
        inputs={"total": 22500, "months": 12, "start": 7},
        kunci="22500*6/12", traps=["22.500", "13.125", "1.875"],
        cara="2026 = 22.500 × 6/12 = 11.250 (Jul–Des = 6 bulan)"),
   dict(q="Varian latihan (ilustratif): alokasi garansi Rp30.000 juta diakui straight-line 30 bulan mulai Maret 2026. Pendapatan garansi selama 2026 = … (Rp juta)",
        inputs={"total": 30000, "months": 30, "start": 3},
        kunci="30000*10/30", traps=["30.000", "12.000", "1.000"],
        cara="2026 = 30.000 × 10/30 = 10.000 (Mar–Des = 10 bulan)"),
  ]),
 dict(fam="nci", m=35, src="M35#2", gi=171, formula="nci", judul="NCI atas laba",
      variants=[
   dict(q="Varian latihan (ilustratif): laba bersih anak Rp20.000 juta, kepemilikan induk 75%. Kepentingan nonpengendali atas laba = …",
        inputs={"ni": 20000, "own": 75},
        kunci="20000*25%", traps=["Rp15.000 juta", "Rp20.000 juta", "Rp0 — NCI hanya ada di neraca"],
        cara="NCI = 20.000 × 25% = 5.000"),
   dict(q="Varian latihan (ilustratif): laba bersih anak Rp8.000 juta, kepemilikan induk 60%. Kepentingan nonpengendali atas laba = …",
        inputs={"ni": 8000, "own": 60},
        kunci="8000*40%", traps=["Rp4.800 juta", "Rp8.000 juta", "Rp0 — NCI hanya ada di neraca"],
        cara="NCI = 8.000 × 40% = 3.200"),
   dict(q="Varian latihan (ilustratif): laba bersih anak Rp15.000 juta, kepemilikan induk 90%. Kepentingan nonpengendali atas laba = …",
        inputs={"ni": 15000, "own": 90},
        kunci="15000*10%", traps=["Rp13.500 juta", "Rp15.000 juta", "Rp0 — NCI hanya ada di neraca"],
        cara="NCI = 15.000 × 10% = 1.500"),
  ]),
 dict(fam="elim", m=35, src="M35#4", gi=173, formula="elim", judul="Eliminasi downstream",
      variants=[
   dict(q="Varian latihan (ilustratif): laba belum direalisasi downstream Rp12.000 juta belum dieliminasi. Setelah koreksi, laba yang dapat diatribusikan kepada pemilik induk menjadi… (dasar: laba total 60.000, NCI 3.000; induk 80%)",
        inputs={"total": 60000, "nci": 3000, "unreal": 12000, "own": 80},
        kunci="(60000-3000)-12000", traps=["Rp57.000 juta", "Rp47.400 juta", "Rp60.000 juta"],
        cara="(60.000 − 3.000) − 12.000 = 45.000 (downstream → eliminasi penuh ke induk, bukan proporsional)"),
   dict(q="Varian latihan (ilustratif): laba belum direalisasi downstream Rp8.000 juta belum dieliminasi. Setelah koreksi, laba yang dapat diatribusikan kepada pemilik induk menjadi… (dasar: laba total 50.000, NCI 5.000; induk 75%)",
        inputs={"total": 50000, "nci": 5000, "unreal": 8000, "own": 75},
        kunci="(50000-5000)-8000", traps=["Rp45.000 juta", "Rp39.000 juta", "Rp50.000 juta"],
        cara="(50.000 − 5.000) − 8.000 = 37.000 (downstream → eliminasi penuh)"),
   dict(q="Varian latihan (ilustratif): laba belum direalisasi downstream Rp6.000 juta belum dieliminasi. Setelah koreksi, laba yang dapat diatribusikan kepada pemilik induk menjadi… (dasar: laba total 40.000, NCI 4.000; induk 90%)",
        inputs={"total": 40000, "nci": 4000, "unreal": 6000, "own": 90},
        kunci="(40000-4000)-6000", traps=["Rp36.000 juta", "Rp30.600 juta", "Rp40.000 juta"],
        cara="(40.000 − 4.000) − 6.000 = 30.000 (downstream → eliminasi penuh)"),
  ]),
 # ================= ROUND 7: 15 tipe formula baru =================
 dict(fam="fcff", m=6, src="M6#1", gi=25, formula="fcff", judul="FCFF",
      variants=[
   dict(q="Varian latihan (Rp juta): CFO 40.000, beban bunga 8.000, tarif pajak 22%, capex 25.000. FCFF = …",
        inputs={"cfo": 40000, "interest": 8000, "tax": 22, "capex": 25000},
        kunci="40000+8000*(1-22%)-25000", traps=["23.000", "15.000", "71.240"],
        cara="FCFF = 40.000 + 8.000×(1−22%) − 25.000 = 21.240"),
   dict(q="Varian latihan (Rp juta): CFO 55.000, beban bunga 12.000, tarif pajak 25%, capex 30.000. FCFF = …",
        inputs={"cfo": 55000, "interest": 12000, "tax": 25, "capex": 30000},
        kunci="55000+12000*(1-25%)-30000", traps=["37.000", "25.000", "94.000"],
        cara="FCFF = 55.000 + 12.000×(1−25%) − 30.000 = 34.000"),
   dict(q="Varian latihan (Rp juta): CFO 28.000, beban bunga 5.000, tarif pajak 20%, capex 35.000. FCFF = …",
        inputs={"cfo": 28000, "interest": 5000, "tax": 20, "capex": 35000},
        kunci="28000+5000*(1-20%)-35000", traps=["−2.000", "−7.000", "67.000"],
        cara="FCFF = 28.000 + 5.000×(1−20%) − 35.000 = −3.000 (negatif — investasi melebihi kas operasi)"),
  ]),
 dict(fam="cr", m=5, src="M5#1", gi=20, formula="cr", judul="Current ratio",
      variants=[
   dict(q="Varian latihan (Rp juta): aset lancar 217.000, liabilitas lancar 100.000. Current ratio = …",
        inputs={"ca": 217000, "cl": 100000},
        kunci="217000/100000", traps=["0,46x", "3,17x", "1,17x"],
        cara="Current ratio = 217.000 ÷ 100.000 = 2,17x"),
   dict(q="Varian latihan (Rp juta): aset lancar 150.000, liabilitas lancar 120.000. Current ratio = …",
        inputs={"ca": 150000, "cl": 120000},
        kunci="150000/120000", traps=["0,80x", "2,25x", "0,25x"],
        cara="Current ratio = 150.000 ÷ 120.000 = 1,25x"),
   dict(q="Varian latihan (Rp juta): aset lancar 95.000, liabilitas lancar 110.000. Current ratio = …",
        inputs={"ca": 95000, "cl": 110000},
        kunci="95000/110000", traps=["1,16x", "1,86x", "0,14x"],
        cara="Current ratio = 95.000 ÷ 110.000 = 0,86x (di bawah 1 — liabilitas lancar melebihi aset lancar)"),
  ]),
 dict(fam="ccc", m=4, src="M4#1", gi=15, formula="ccc", judul="Cash conversion cycle",
      variants=[
   dict(q="Varian latihan: DSO 73 hari, DIO 60 hari, DPO 41,3 hari. Cash conversion cycle = …",
        inputs={"dso": 73, "dio": 60, "dpo": 41.3},
        kunci="73+60-41.3", traps=["174,3 hari", "133,0 hari", "54,3 hari"],
        cara="CCC = 73 + 60 − 41,3 = 91,7 hari"),
   dict(q="Varian latihan: DSO 50 hari, DIO 45 hari, DPO 60 hari. Cash conversion cycle = …",
        inputs={"dso": 50, "dio": 45, "dpo": 60},
        kunci="50+45-60", traps=["155,0 hari", "95,0 hari", "65,0 hari"],
        cara="CCC = 50 + 45 − 60 = 35,0 hari"),
   dict(q="Varian latihan: DSO 90 hari, DIO 75 hari, DPO 40,5 hari. Cash conversion cycle = …",
        inputs={"dso": 90, "dio": 75, "dpo": 40.5},
        kunci="90+75-40.5", traps=["205,5 hari", "165,0 hari", "55,5 hari"],
        cara="CCC = 90 + 75 − 40,5 = 124,5 hari"),
  ]),
 dict(fam="roe_lev", m=3, src="M3#2", gi=11, formula="roe_lev", judul="ROE via leverage (DuPont)",
      variants=[
   dict(q="Varian latihan: ROA 10,9%, aset 2,6x ekuitas. ROE = …",
        inputs={"roa": 10.9, "lev": 2.6},
        kunci="10.9%*2.6", traps=["13,5%", "4,2%", "2,6%"],
        cara="ROE = 10,9% × 2,6 = 28,3% (identitas DuPont: ROE = ROA × leverage)"),
   dict(q="Varian latihan: ROA 8,0%, aset 3,0x ekuitas. ROE = …",
        inputs={"roa": 8.0, "lev": 3.0},
        kunci="8.0%*3.0", traps=["11,0%", "2,7%", "3,0%"],
        cara="ROE = 8,0% × 3,0 = 24,0%"),
   dict(q="Varian latihan: ROA 12,5%, aset 1,8x ekuitas. ROE = …",
        inputs={"roa": 12.5, "lev": 1.8},
        kunci="12.5%*1.8", traps=["14,3%", "6,9%", "1,8%"],
        cara="ROE = 12,5% × 1,8 = 22,5%"),
  ]),
 dict(fam="dsri", m=13, src="M13#3", gi=62, formula="dsri", judul="DSRI (Beneish)",
      variants=[
   dict(q="Varian latihan (Rp juta): piutang 120 → 180, penjualan 1.000 → 1.050. DSRI = …",
        inputs={"ar0": 120, "s0": 1000, "ar1": 180, "s1": 1050},
        kunci="(180/1050)/(120/1000)", traps=["1,50", "0,70", "1,05"],
        cara="DSRI = (180÷1.050) ÷ (120÷1.000) = 1,43 (di atas 1 — piutang tumbuh lebih cepat)"),
   dict(q="Varian latihan (Rp juta): piutang 150 → 195, penjualan 1.500 → 1.650. DSRI = …",
        inputs={"ar0": 150, "s0": 1500, "ar1": 195, "s1": 1650},
        kunci="(195/1650)/(150/1500)", traps=["1,30", "0,85", "1,10"],
        cara="DSRI = (195÷1.650) ÷ (150÷1.500) = 1,18"),
   dict(q="Varian latihan (Rp juta): piutang 100 → 130, penjualan 1.200 → 1.300. DSRI = …",
        inputs={"ar0": 100, "s0": 1200, "ar1": 130, "s1": 1300},
        kunci="(130/1300)/(100/1200)", traps=["1,30", "0,83", "1,08"],
        cara="DSRI = (130÷1.300) ÷ (100÷1.200) = 1,20"),
  ]),
 dict(fam="sloan", m=17, src="M17#1", gi=80, formula="sloan", judul="Sloan ratio",
      variants=[
   dict(q="Varian latihan (Rp juta): laba bersih 45.240, CFO 30.800, total aset 450.000. Sloan ratio = …",
        inputs={"ni": 45240, "cfo": 30800, "assets": 450000},
        kunci="(45240-30800)/450000", traps=["−3,2%", "32,1%", "10,1%"],
        cara="Sloan = (45.240 − 30.800) ÷ 450.000 = 3,2%"),
   dict(q="Varian latihan (Rp juta): laba bersih 20.000, CFO 22.000, total aset 400.000. Sloan ratio = …",
        inputs={"ni": 20000, "cfo": 22000, "assets": 400000},
        kunci="(20000-22000)/400000", traps=["0,5%", "−5,0%", "5,0%"],
        cara="Sloan = (20.000 − 22.000) ÷ 400.000 = −0,5% (akrual negatif — CFO melebihi laba)"),
   dict(q="Varian latihan (Rp juta): laba bersih 60.000, CFO 35.000, total aset 500.000. Sloan ratio = …",
        inputs={"ni": 60000, "cfo": 35000, "assets": 500000},
        kunci="(60000-35000)/500000", traps=["−5,0%", "50,0%", "12,0%"],
        cara="Sloan = (60.000 − 35.000) ÷ 500.000 = 5,0% (akrual tinggi — waspadai kualitas laba)"),
  ]),
 dict(fam="evperp", m=18, src="M18#2", gi=86, formula="evperp", judul="EV perpetuity",
      variants=[
   dict(q="Varian latihan (Rp juta): FCFF 10.000, WACC 12%, pertumbuhan 4%. Enterprise value (perpetuity) = …",
        inputs={"fcff": 10000, "wacc": 12, "g": 4},
        kunci="10000/(12%-4%)", traps=["62.500", "83.333", "−125.000"],
        cara="EV = 10.000 ÷ (12% − 4%) = 125.000"),
   dict(q="Varian latihan (Rp juta): FCFF 8.000, WACC 10%, pertumbuhan 3%. Enterprise value (perpetuity) = …",
        inputs={"fcff": 8000, "wacc": 10, "g": 3},
        kunci="8000/(10%-3%)", traps=["61.538", "80.000", "−114.286"],
        cara="EV = 8.000 ÷ (10% − 3%) = 114.286"),
   dict(q="Varian latihan (Rp juta): FCFF 15.000, WACC 14%, pertumbuhan 6%. Enterprise value (perpetuity) = …",
        inputs={"fcff": 15000, "wacc": 14, "g": 6},
        kunci="15000/(14%-6%)", traps=["75.000", "107.143", "−187.500"],
        cara="EV = 15.000 ÷ (14% − 6%) = 187.500"),
  ]),
 dict(fam="peg", m=24, src="M24#4", gi=118, formula="peg", judul="PEG ratio",
      variants=[
   dict(q="Varian latihan: P/E 12x, pertumbuhan laba forecast 17,6%/tahun. PEG = …",
        inputs={"pe": 12, "growth": 17.6},
        kunci="12/17.6", traps=["1,47x", "68,18x", "211,20x"],
        cara="PEG = 12 ÷ 17,6 = 0,68x (di bawah 1 — murah relatif terhadap pertumbuhan)"),
   dict(q="Varian latihan: P/E 20x, pertumbuhan laba forecast 25,0%/tahun. PEG = …",
        inputs={"pe": 20, "growth": 25.0},
        kunci="20/25.0", traps=["1,25x", "80,00x", "500,00x"],
        cara="PEG = 20 ÷ 25,0 = 0,80x"),
   dict(q="Varian latihan: P/E 15x, pertumbuhan laba forecast 10,0%/tahun. PEG = …",
        inputs={"pe": 15, "growth": 10.0},
        kunci="15/10.0", traps=["0,67x", "150,00x", "1,50%"],
        cara="PEG = 15 ÷ 10,0 = 1,50x (di atas 1 — mahal relatif terhadap pertumbuhan)"),
  ]),
 dict(fam="dscr", m=23, src="M23#2", gi=111, formula="dscr", judul="DSCR",
      variants=[
   dict(q="Varian latihan (Rp juta): CFO setelah bunga 30.800; kewajiban bunga+pokok 34.000. DSCR = …",
        inputs={"cfo": 30800, "ds": 34000},
        kunci="30800/34000", traps=["1,1x", "0,1x", "9,1x"],
        cara="DSCR = 30.800 ÷ 34.000 = 0,9x (di bawah 1 — kas tak cukup menutup kewajiban)"),
   dict(q="Varian latihan (Rp juta): CFO setelah bunga 45.000; kewajiban bunga+pokok 30.000. DSCR = …",
        inputs={"cfo": 45000, "ds": 30000},
        kunci="45000/30000", traps=["0,7x", "0,3x", "15,0x"],
        cara="DSCR = 45.000 ÷ 30.000 = 1,5x"),
   dict(q="Varian latihan (Rp juta): CFO setelah bunga 22.000; kewajiban bunga+pokok 25.000. DSCR = …",
        inputs={"cfo": 22000, "ds": 25000},
        kunci="22000/25000", traps=["1,1x", "0,1x", "8,8x"],
        cara="DSCR = 22.000 ÷ 25.000 = 0,9x"),
  ]),
 dict(fam="ldr", m=30, src="M30#1", gi=145, formula="ldr", judul="LDR bank",
      variants=[
   dict(q="Varian latihan (Rp miliar): total kredit 60.000, DPK 68.000. LDR = …",
        inputs={"kredit": 60000, "dpk": 68000},
        kunci="60000/68000", traps=["113,3%", "11,8%", "88,2x"],
        cara="LDR = 60.000 ÷ 68.000 = 88,2%"),
   dict(q="Varian latihan (Rp miliar): total kredit 45.000, DPK 50.000. LDR = …",
        inputs={"kredit": 45000, "dpk": 50000},
        kunci="45000/50000", traps=["111,1%", "10,0%", "90,0x"],
        cara="LDR = 45.000 ÷ 50.000 = 90,0%"),
   dict(q="Varian latihan (Rp miliar): total kredit 72.000, DPK 90.000. LDR = …",
        inputs={"kredit": 72000, "dpk": 90000},
        kunci="72000/90000", traps=["125,0%", "20,0%", "80,0x"],
        cara="LDR = 72.000 ÷ 90.000 = 80,0%"),
  ]),
 dict(fam="coverage", m=30, src="M30#2", gi=146, formula="coverage", judul="NPL coverage",
      variants=[
   dict(q="Varian latihan (Rp miliar): total CKPN 2.900, NPL gross 2.000. NPL coverage = …",
        inputs={"ckpn": 2900, "npl": 2000},
        kunci="2900/2000", traps=["69%", "45%", "145x"],
        cara="Coverage = 2.900 ÷ 2.000 = 145% (CKPN melebihi NPL — bantalan kuat)"),
   dict(q="Varian latihan (Rp miliar): total CKPN 1.800, NPL gross 2.400. NPL coverage = …",
        inputs={"ckpn": 1800, "npl": 2400},
        kunci="1800/2400", traps=["133%", "33%", "75x"],
        cara="Coverage = 1.800 ÷ 2.400 = 75% (CKPN belum menutup penuh NPL)"),
   dict(q="Varian latihan (Rp miliar): total CKPN 5.000, NPL gross 4.000. NPL coverage = …",
        inputs={"ckpn": 5000, "npl": 4000},
        kunci="5000/4000", traps=["80%", "25%", "125x"],
        cara="Coverage = 5.000 ÷ 4.000 = 125%"),
  ]),
 dict(fam="murabahah", m=26, src="M26#2", gi=126, formula="murabahah", judul="Margin murabahah per tahun",
      variants=[
   dict(q="Varian latihan: Bank Barakah menjual barang Rp20 jt + margin Rp4 jt, tenor 2 tahun (ilustratif). Margin yang diakui per tahun…",
        inputs={"margin": 4, "tenor": 2},
        kunci="4jt/2thn", traps=["Rp4 jt (diakui sekaligus saat akad)", "Rp0 — diakui hanya saat lunas", "Rp1 jt"],
        cara="Margin Rp4 jt ÷ 2 tahun = Rp2 jt/tahun (proporsional selama akad)"),
   dict(q="Varian latihan: Bank Barakah menjual barang Rp50 jt + margin Rp6 jt, tenor 2 tahun (ilustratif). Margin yang diakui per tahun…",
        inputs={"margin": 6, "tenor": 2},
        kunci="6jt/2thn", traps=["Rp6 jt (diakui sekaligus saat akad)", "Rp0 — diakui hanya saat lunas", "Rp2 jt"],
        cara="Margin Rp6 jt ÷ 2 tahun = Rp3 jt/tahun (proporsional selama akad)"),
   dict(q="Varian latihan: Bank Barakah menjual barang Rp90 jt + margin Rp12 jt, tenor 3 tahun (ilustratif). Margin yang diakui per tahun…",
        inputs={"margin": 12, "tenor": 3},
        kunci="12jt/3thn", traps=["Rp12 jt (diakui sekaligus saat akad)", "Rp0 — diakui hanya saat lunas", "Rp6 jt"],
        cara="Margin Rp12 jt ÷ 3 tahun = Rp4 jt/tahun (proporsional selama akad)"),
  ]),
 dict(fam="ecl", m=11, src="M11#1", gi=51, formula="ecl", judul="Rasio ECL",
      variants=[
   dict(q="Varian latihan (Rp juta): cadangan kerugian 3.800, piutang bruto 100.000. Rasio ECL = …",
        inputs={"allow": 3800, "ar": 100000},
        kunci="3800/100000", traps=["2.631,6%", "96,2%", "3,9%"],
        cara="ECL = 3.800 ÷ 100.000 = 3,8%"),
   dict(q="Varian latihan (Rp juta): cadangan kerugian 2.500, piutang bruto 50.000. Rasio ECL = …",
        inputs={"allow": 2500, "ar": 50000},
        kunci="2500/50000", traps=["2.000,0%", "95,0%", "5,3%"],
        cara="ECL = 2.500 ÷ 50.000 = 5,0%"),
   dict(q="Varian latihan (Rp juta): cadangan kerugian 6.000, piutang bruto 200.000. Rasio ECL = …",
        inputs={"allow": 6000, "ar": 200000},
        kunci="6000/200000", traps=["3.333,3%", "97,0%", "3,1%"],
        cara="ECL = 6.000 ÷ 200.000 = 3,0%"),
  ]),
 dict(fam="cfoni", m=2, src="M2#4", gi=8, formula="cfoni", judul="CFO/NI",
      variants=[
   dict(q="Varian latihan (Rp juta): CFO 30.800, laba bersih 45.240. Rasio CFO/NI = …",
        inputs={"cfo": 30800, "ni": 45240},
        kunci="30800/45240", traps=["1,47x", "0,32x", "68,08x"],
        cara="CFO/NI = 30.800 ÷ 45.240 = 0,68x (di bawah 1 — laba tak sepenuhnya menjadi kas)"),
   dict(q="Varian latihan (Rp juta): CFO 40.000, laba bersih 35.000. Rasio CFO/NI = …",
        inputs={"cfo": 40000, "ni": 35000},
        kunci="40000/35000", traps=["0,88x", "−0,14x", "114,29x"],
        cara="CFO/NI = 40.000 ÷ 35.000 = 1,14x (di atas 1 — kas melampaui laba)"),
   dict(q="Varian latihan (Rp juta): CFO 15.000, laba bersih 30.000. Rasio CFO/NI = …",
        inputs={"cfo": 15000, "ni": 30000},
        kunci="15000/30000", traps=["2,00x", "0,50%", "50,00x"],
        cara="CFO/NI = 15.000 ÷ 30.000 = 0,50x"),
  ]),
 dict(fam="taxburden", m=8, src="M8#2", gi=36, formula="taxburden", judul="Tax burden",
      variants=[
   dict(q="Varian latihan (Rp juta): laba bersih 35.100, PBT 45.000. Tax burden = …",
        inputs={"ni": 35100, "pbt": 45000},
        kunci="35100/45000", traps=["22%", "128%", "27%"],
        cara="Tax burden = 35.100 ÷ 45.000 = 78% (pajak = 22% dari PBT)"),
   dict(q="Varian latihan (Rp juta): laba bersih 40.000, PBT 50.000. Tax burden = …",
        inputs={"ni": 40000, "pbt": 50000},
        kunci="40000/50000", traps=["20%", "125%", "25%"],
        cara="Tax burden = 40.000 ÷ 50.000 = 80%"),
   dict(q="Varian latihan (Rp juta): laba bersih 27.300, PBT 39.000. Tax burden = …",
        inputs={"ni": 27300, "pbt": 39000},
        kunci="27300/39000", traps=["30%", "143%", "43%"],
        cara="Tax burden = 27.300 ÷ 39.000 = 70%"),
  ]),
 # ================= PHASE 10: 15 tipe formula baru =================
 dict(fam="artik", m=1, src="M1#5", gi=4, formula="artik", judul="Artikulasi A=L+E",
      variants=[
   dict(q="Varian latihan (Rp juta): total liabilitas 150.000, total ekuitas 90.000. Total aset yang FOOT (A = L + E) = …",
        inputs={"l": 150000, "e": 90000},
        kunci="150000+90000", traps=["Rp60.000 juta", "Rp150.000 juta", "Rp90.000 juta"],
        cara="A = L + E = 150.000 + 90.000 = 240.000 (neraca WAJIB balance tiap kolom; distraktor 60.000 = L−E, salah arah)"),
   dict(q="Varian latihan (Rp juta): total liabilitas 310.500, total ekuitas 120.000. Total aset yang FOOT (A = L + E) = …",
        inputs={"l": 310500, "e": 120000},
        kunci="310500+120000", traps=["Rp190.500 juta", "Rp310.500 juta", "Rp120.000 juta"],
        cara="A = L + E = 310.500 + 120.000 = 430.500"),
   dict(q="Varian latihan (Rp juta): total liabilitas 88.000, total ekuitas 112.000. Total aset yang FOOT (A = L + E) = …",
        inputs={"l": 88000, "e": 112000},
        kunci="88000+112000", traps=["Rp−24.000 juta", "Rp88.000 juta", "Rp112.000 juta"],
        cara="A = L + E = 88.000 + 112.000 = 200.000 (distraktor −24.000 = L−E, salah arah)"),
  ]),
 dict(fam="material", m=7, src="M7#1", gi=30, formula="material", judul="Materialitas % PBT",
      variants=[
   dict(q="Varian latihan (Rp juta): PBT 58.000. Ambang materialitas ILUSTRATIF 5% dari PBT = …",
        inputs={"pbt": 58000, "pct": 5},
        kunci="5%x58000", traps=["Rp58.000 juta", "Rp5 juta", "Rp55.100 juta"],
        cara="Materialitas = 5% × 58.000 = 2.900. ILUSTRATIF: 5% dari PBT adalah praktik umum, ambang final = judgment auditor (bukan rumus baku)"),
   dict(q="Varian latihan (Rp juta): PBT 120.000. Ambang materialitas ILUSTRATIF 5% dari PBT = …",
        inputs={"pbt": 120000, "pct": 5},
        kunci="5%x120000", traps=["Rp120.000 juta", "Rp5 juta", "Rp114.000 juta"],
        cara="Materialitas = 5% × 120.000 = 6.000 (ilustratif; judgment auditor yang menentukan)"),
   dict(q="Varian latihan (Rp juta): PBT 44.000. Ambang materialitas ILUSTRATIF 10% dari PBT = …",
        inputs={"pbt": 44000, "pct": 10},
        kunci="10%x44000", traps=["Rp44.000 juta", "Rp10 juta", "Rp39.600 juta"],
        cara="Materialitas = 10% × 44.000 = 4.400 (ilustratif; 10% dipakai bila PBT volatil/kecil)"),
  ]),
 dict(fam="impair", m=12, src="M12#1", gi=55, formula="impair", judul="Rugi impairment",
      variants=[
   dict(q="Varian latihan (Rp juta, ilustratif): nilai tercatat 50.000, jumlah terpulihkan 42.000. Rugi penurunan nilai (PSAK 236) = …",
        inputs={"c": 50000, "r": 42000},
        kunci="50000-42000", traps=["Rp42.000 juta", "Rp50.000 juta", "Rp92.000 juta"],
        cara="Rugi = 50.000 − 42.000 = 8.000 (diakui bila carrying > recoverable, PSAK 236)"),
   dict(q="Varian latihan (Rp juta, ilustratif): nilai tercatat 120.000, jumlah terpulihkan 135.000. Rugi penurunan nilai (PSAK 236) = …",
        inputs={"c": 120000, "r": 135000},
        kunci="max(0,120000-135000)", traps=["Rp15.000 juta", "Rp135.000 juta", "Rp120.000 juta"],
        cara="Recoverable (135.000) > carrying (120.000) → TIDAK ada rugi = 0 (distraktor 15.000 = selisih yang salah diakui sebagai rugi)"),
   dict(q="Varian latihan (Rp juta, ilustratif): nilai tercatat 75.000, jumlah terpulihkan 60.000. Rugi penurunan nilai (PSAK 236) = …",
        inputs={"c": 75000, "r": 60000},
        kunci="75000-60000", traps=["Rp60.000 juta", "Rp75.000 juta", "Rp135.000 juta"],
        cara="Rugi = 75.000 − 60.000 = 15.000"),
  ]),
 dict(fam="lifo", m=14, src="M14#1", gi=65, formula="lifo", judul="Penyesuaian LIFO→FIFO",
      variants=[
   dict(q="Varian latihan (Rp juta, ilustratif): laba bersih PSAK 45.240; LIFO reserve 12.000; tarif pajak 22%. Laba bersih versi US GAAP/LIFO (PSAK 202 melarang LIFO) = …",
        inputs={"ni": 45240, "reserve": 12000, "tax": 22},
        kunci="45240-12000*(1-22%)", traps=["Rp33.240 juta", "Rp45.240 juta", "Rp54.600 juta"],
        cara="NI GAAP = 45.240 − 12.000×(1−22%) = 45.240 − 9.360 = 35.880 (LIFO reserve = HPP lebih tinggi → laba lebih rendah SETELAH pajak; distraktor 33.240 = kurang penuh tanpa efek pajak)"),
   dict(q="Varian latihan (Rp juta, ilustratif): laba bersih PSAK 30.000; LIFO reserve 8.000; tarif pajak 25%. Laba bersih versi US GAAP/LIFO = …",
        inputs={"ni": 30000, "reserve": 8000, "tax": 25},
        kunci="30000-8000*(1-25%)", traps=["Rp22.000 juta", "Rp30.000 juta", "Rp36.000 juta"],
        cara="NI GAAP = 30.000 − 8.000×(1−25%) = 30.000 − 6.000 = 24.000"),
   dict(q="Varian latihan (Rp juta, ilustratif): laba bersih PSAK 60.000; LIFO reserve 20.000; tarif pajak 20%. Laba bersih versi US GAAP/LIFO = …",
        inputs={"ni": 60000, "reserve": 20000, "tax": 20},
        kunci="60000-20000*(1-20%)", traps=["Rp40.000 juta", "Rp60.000 juta", "Rp76.000 juta"],
        cara="NI GAAP = 60.000 − 20.000×(1−20%) = 60.000 − 16.000 = 44.000"),
  ]),
 dict(fam="altmanz", m=15, src="M15#1", gi=70, formula="altmanz", judul="Altman Z'-Score",
      variants=[
   dict(q="Varian latihan (ilustratif): X1=0,26; X2=0,18; X3=0,16; X4=0,66; X5=1,15. Z′-Score = 0,717·X1+0,847·X2+3,107·X3+0,420·X4+0,998·X5 = …",
        inputs={"x1": 0.26, "x2": 0.18, "x3": 0.16, "x4": 0.66, "x5": 1.15},
        kunci="0.717*0.26+0.847*0.18+3.107*0.16+0.420*0.66+0.998*1.15", traps=["2,41", "1,23", "2,90"],
        cara="Z′ = 0,186+0,152+0,497+0,277+1,148 = 2,26 → GREY ZONE (1,23–2,90; distraktor 2,41 = jumlah tanpa bobot)"),
   dict(q="Varian latihan (ilustratif): X1=0,35; X2=0,25; X3=0,22; X4=1,10; X5=1,40. Z′-Score (bobot 0,717/0,847/3,107/0,420/0,998) = …",
        inputs={"x1": 0.35, "x2": 0.25, "x3": 0.22, "x4": 1.10, "x5": 1.40},
        kunci="0.717*0.35+0.847*0.25+3.107*0.22+0.420*1.10+0.998*1.40", traps=["3,32", "2,90", "1,23"],
        cara="Z′ = 0,251+0,212+0,684+0,462+1,397 = 3,01 → ZONA AMAN (>2,90; distraktor 3,32 = jumlah tanpa bobot)"),
   dict(q="Varian latihan (ilustratif): X1=0,10; X2=0,05; X3=0,02; X4=0,30; X5=0,80. Z′-Score (bobot 0,717/0,847/3,107/0,420/0,998) = …",
        inputs={"x1": 0.10, "x2": 0.05, "x3": 0.02, "x4": 0.30, "x5": 0.80},
        kunci="0.717*0.10+0.847*0.05+3.107*0.02+0.420*0.30+0.998*0.80", traps=["1,27", "1,23", "2,90"],
        cara="Z′ = 0,072+0,042+0,062+0,126+0,798 = 1,10 → ZONA DISTRESS (<1,23; distraktor 1,27 = jumlah tanpa bobot)"),
  ]),
 dict(fam="fvtpl", m=16, src="M16#5", gi=79, formula="fvtpl", judul="Dampak FVTPL ke P&L",
      variants=[
   dict(q="Varian latihan (Rp juta, ilustratif): obligasi diklasifikasikan FVTPL (PSAK 109); nilai wajar naik dari 100.000 menjadi 108.000. Dampak ke laba rugi = …",
        inputs={"fv0": 100000, "fv1": 108000},
        kunci="108000-100000", traps=["Rp0 juta", "Rp108.000 juta", "−Rp8.000 juta"],
        cara="FVTPL → ΔFV langsung ke P&L = 108.000 − 100.000 = +8.000 (distraktor 0 = perlakuan amortised cost; PSAK 109)"),
   dict(q="Varian latihan (Rp juta, ilustratif): saham diklasifikasikan FVTPL (PSAK 109); nilai wajar turun dari 200.000 menjadi 185.000. Dampak ke laba rugi = …",
        inputs={"fv0": 200000, "fv1": 185000},
        kunci="185000-200000", traps=["Rp0 juta", "Rp185.000 juta", "Rp15.000 juta"],
        cara="FVTPL → ΔFV langsung ke P&L = 185.000 − 200.000 = −15.000 (rugi; volatil mengikuti pasar)"),
   dict(q="Varian latihan (Rp juta, ilustratif): obligasi diklasifikasikan FVTPL (PSAK 109); nilai wajar tetap 50.000. Dampak ke laba rugi = …",
        inputs={"fv0": 50000, "fv1": 50000},
        kunci="50000-50000", traps=["Rp50.000 juta", "Rp100.000 juta", "−Rp50.000 juta"],
        cara="ΔFV = 0 → dampak ke P&L = 0 (bukan sebesar nilai wajarnya)"),
  ]),
 dict(fam="deadline", m=19, src="M19#1", gi=90, formula="deadline", judul="Keterlambatan filing",
      variants=[
   dict(q="Varian latihan (ILUSTRATIF): tutup buku 31 Des; batas lapor 120 hari kalender; laporan disampaikan pada hari ke-135. Keterlambatan = …",
        inputs={"batas": 120, "aktual": 135},
        kunci="135-120", traps=["−15 hari", "120 hari", "135 hari"],
        cara="Terlambat = 135 − 120 = 15 hari kalender. ILUSTRATIF: angka 120 hari hanya asumsi latihan, bukan ketentuan regulator"),
   dict(q="Varian latihan (ILUSTRATIF): tutup buku 31 Des; batas lapor 90 hari kalender; laporan disampaikan pada hari ke-118. Keterlambatan = …",
        inputs={"batas": 90, "aktual": 118},
        kunci="118-90", traps=["−28 hari", "90 hari", "118 hari"],
        cara="Terlambat = 118 − 90 = 28 hari kalender (ilustratif)"),
   dict(q="Varian latihan (ILUSTRATIF): tutup buku 31 Des; batas lapor 120 hari kalender; laporan disampaikan pada hari ke-162. Keterlambatan = …",
        inputs={"batas": 120, "aktual": 162},
        kunci="162-120", traps=["−42 hari", "120 hari", "162 hari"],
        cara="Terlambat = 162 − 120 = 42 hari kalender (ilustratif; distraktor −42 = urutan kurang terbalik)"),
  ]),
 dict(fam="goodwill", m=20, src="M20#1", gi=95, formula="goodwill", judul="Goodwill akuisisi",
      variants=[
   dict(q="Varian latihan (Rp juta, ilustratif): harga akuisisi 60.000; nilai wajar aset neto teridentifikasi 40.000. Goodwill = …",
        inputs={"price": 60000, "fv": 40000},
        kunci="60000-40000", traps=["Rp100.000 juta", "Rp40.000 juta", "−Rp20.000 juta"],
        cara="Goodwill = 60.000 − 40.000 = 20.000 (premi atas FV aset neto; TIDAK diamortisasi, uji impairment tahunan)"),
   dict(q="Varian latihan (Rp juta, ilustratif): harga akuisisi 150.000; nilai wajar aset neto teridentifikasi 175.000. Goodwill = …",
        inputs={"price": 150000, "fv": 175000},
        kunci="150000-175000", traps=["Rp25.000 juta", "Rp325.000 juta", "Rp175.000 juta"],
        cara="FV (175.000) > harga (150.000) → BARGAIN PURCHASE: selisih −25.000 diakui sebagai KEUNTUNGAN, bukan goodwill negatif"),
   dict(q="Varian latihan (Rp juta, ilustratif): harga akuisisi 90.000; nilai wajar aset neto teridentifikasi 55.000. Goodwill = …",
        inputs={"price": 90000, "fv": 55000},
        kunci="90000-55000", traps=["Rp145.000 juta", "Rp55.000 juta", "−Rp35.000 juta"],
        cara="Goodwill = 90.000 − 55.000 = 35.000"),
  ]),
 dict(fam="warranty", m=21, src="M21#2", gi=101, formula="warranty", judul="Provisi garansi",
      variants=[
   dict(q="Varian latihan (Rp juta, ilustratif): penjualan 450.000; estimasi klaim garansi 2% dari penjualan (PSAK 237). Provisi garansi = …",
        inputs={"sales": 450000, "pct": 2},
        kunci="2%x450000", traps=["Rp441.000 juta", "Rp2 juta", "Rp450.000 juta"],
        cara="Provisi = 2% × 450.000 = 9.000 (estimasi andal + kewajiban kini → akui, PSAK 237)"),
   dict(q="Varian latihan (Rp juta, ilustratif): penjualan 800.000; estimasi klaim garansi 1% dari penjualan (PSAK 237). Provisi garansi = …",
        inputs={"sales": 800000, "pct": 1},
        kunci="1%x800000", traps=["Rp792.000 juta", "Rp1 juta", "Rp800.000 juta"],
        cara="Provisi = 1% × 800.000 = 8.000"),
   dict(q="Varian latihan (Rp juta, ilustratif): penjualan 520.000; estimasi klaim garansi 3% dari penjualan (PSAK 237). Provisi garansi = …",
        inputs={"sales": 520000, "pct": 3},
        kunci="3%x520000", traps=["Rp504.400 juta", "Rp3 juta", "Rp520.000 juta"],
        cara="Provisi = 3% × 520.000 = 15.600"),
  ]),
 dict(fam="rpsales", m=22, src="M22#1", gi=105, formula="rpsales", judul="Konsentrasi pihak berelasi",
      variants=[
   dict(q="Varian latihan (Rp juta, ilustratif): penjualan ke pihak berelasi 120.000 dari total 520.000 (PSAK 224). Konsentrasi pihak berelasi = …",
        inputs={"rp": 120000, "total": 520000},
        kunci="120000/520000", traps=["76,9%", "0,23", "433,3%"],
        cara="120.000 ÷ 520.000 = 23,1% (distraktor 433,3% = total÷RP terbalik; 0,23 = lupa ×100)"),
   dict(q="Varian latihan (Rp juta, ilustratif): penjualan ke pihak berelasi 45.000 dari total 300.000 (PSAK 224). Konsentrasi pihak berelasi = …",
        inputs={"rp": 45000, "total": 300000},
        kunci="45000/300000", traps=["85,0%", "0,15", "666,7%"],
        cara="45.000 ÷ 300.000 = 15,0%"),
   dict(q="Varian latihan (Rp juta, ilustratif): penjualan ke pihak berelasi 200.000 dari total 400.000 (PSAK 224). Konsentrasi pihak berelasi = …",
        inputs={"rp": 200000, "total": 400000},
        kunci="200000/400000", traps=["0,50", "200,0%", "50,0"],
        cara="200.000 ÷ 400.000 = 50,0% — separuh penjualan ke pihak berelasi = red flag tajam (tunneling via transfer pricing)"),
  ]),
 dict(fam="piotroski", m=25, src="M25#1", gi=120, formula="piotroski", judul="F-score Piotroski",
      variants=[
   dict(q="Varian latihan (ilustratif): dari 9 kriteria Piotroski (2000), 8 terpenuhi (gagal 1: akrual). F-score = …",
        inputs={"crit": [1, 1, 1, 1, 1, 1, 1, 1, 0]},
        kunci="8 dari 9", traps=["9/9", "7/9", "8/8"],
        cara="F = 8/9 → zona KUAT (7–9: general strength). 1 kriteria gagal tak membatalkan 8 lainnya"),
   dict(q="Varian latihan (ilustratif): dari 9 kriteria Piotroski (2000), 5 terpenuhi. F-score = …",
        inputs={"crit": [1, 0, 1, 1, 0, 1, 0, 1, 0]},
        kunci="5 dari 9", traps=["4/9", "6/9", "5/5"],
        cara="F = 5/9 → zona ABU-ABU (4–6): tanpa sinyal arah yang jelas"),
   dict(q="Varian latihan (ilustratif): dari 9 kriteria Piotroski (2000), 2 terpenuhi. F-score = …",
        inputs={"crit": [1, 0, 0, 0, 0, 0, 0, 1, 0]},
        kunci="2 dari 9", traps=["3/9", "1/9", "2/7"],
        cara="F = 2/9 → zona LEMAH (0–3): fundamental rapuh menurut Piotroski (2000)"),
  ]),
 dict(fam="benford", m=28, src="M28#2", gi=136, formula="benford", judul="Ekspektasi Benford digit-1",
      variants=[
   dict(q="Varian latihan (ilustratif): 1.000 angka faktur diuji Benford. Jumlah berdigit awal 1 yang DIHARAPKAN (30,1%) = …",
        inputs={"n": 1000},
        kunci="30.1%x1000", traps=["111", "46", "1.000"],
        cara="Ekspektasi = 30,1% × 1.000 = 301 (distraktor 111 = asumsi seragam 1/9; 46 = ekspektasi digit 9)"),
   dict(q="Varian latihan (ilustratif): 2.000 angka faktur diuji Benford. Jumlah berdigit awal 1 yang DIHARAPKAN (30,1%) = …",
        inputs={"n": 2000},
        kunci="30.1%x2000", traps=["222", "92", "2.000"],
        cara="Ekspektasi = 30,1% × 2.000 = 602"),
   dict(q="Varian latihan (ilustratif): 500 angka faktur diuji Benford. Jumlah berdigit awal 1 yang DIHARAPKAN (30,1%) = …",
        inputs={"n": 500},
        kunci="30.1%x500", traps=["56", "23", "500"],
        cara="Ekspektasi = 30,1% × 500 = 151 (150,5 dibulatkan half-up)"),
  ]),
 dict(fam="llcr", m=33, src="M33#4", gi=163, formula="llcr", judul="LLCR proyek",
      variants=[
   dict(q="Varian latihan (Rp juta, ILUSTRATIF): NPV arus kas proyek 150.000; utang proyek 120.000. LLCR = …",
        inputs={"pv": 150000, "debt": 120000},
        kunci="150000/120000", traps=["0,80x", "30.000", "0,20x"],
        cara="LLCR = 150.000 ÷ 120.000 = 1,25x (di atas 1 — arus kas menutup utang; distraktor 0,80x = utang÷PV terbalik)"),
   dict(q="Varian latihan (Rp juta, ILUSTRATIF): NPV arus kas proyek 90.000; utang proyek 100.000. LLCR = …",
        inputs={"pv": 90000, "debt": 100000},
        kunci="90000/100000", traps=["1,11x", "−10.000", "−0,11x"],
        cara="LLCR = 90.000 ÷ 100.000 = 0,90x (di bawah 1 — proyek tak menutup utangnya)"),
   dict(q="Varian latihan (Rp juta, ILUSTRATIF): NPV arus kas proyek 220.000; utang proyek 110.000. LLCR = …",
        inputs={"pv": 220000, "debt": 110000},
        kunci="220000/110000", traps=["0,50x", "110.000", "1,00x"],
        cara="LLCR = 220.000 ÷ 110.000 = 2,00x"),
  ]),
 dict(fam="eqval", m=18, src="M18#2", gi=86, formula="eqval", judul="Nilai ekuitas dari EV",
      variants=[
   dict(q="Varian latihan (Rp juta, ilustratif): enterprise value 740.000; utang bersih 160.000. Nilai ekuitas = …",
        inputs={"ev": 740000, "netdebt": 160000},
        kunci="740000-160000", traps=["Rp900.000 juta", "Rp740.000 juta", "Rp160.000 juta"],
        cara="Ekuitas = EV − utang bersih = 740.000 − 160.000 = 580.000 (EV ≠ nilai ekuitas — kurangkan utang bersih DULU)"),
   dict(q="Varian latihan (Rp juta, ilustratif): enterprise value 277.778; utang bersih 92.560. Nilai ekuitas = …",
        inputs={"ev": 277778, "netdebt": 92560},
        kunci="277778-92560", traps=["Rp370.338 juta", "Rp277.778 juta", "Rp92.560 juta"],
        cara="Ekuitas = 277.778 − 92.560 = 185.218"),
   dict(q="Varian latihan (Rp juta, ilustratif): enterprise value 500.000; utang bersih 500.000. Nilai ekuitas = …",
        inputs={"ev": 500000, "netdebt": 500000},
        kunci="500000-500000", traps=["Rp1.000.000 juta", "Rp500.000 juta", "−Rp500.000 juta"],
        cara="Ekuitas = 500.000 − 500.000 = 0 (seluruh nilai perusahaan milik kreditur)"),
  ]),
 dict(fam="pbv", m=24, src="M24#4", gi=118, formula="pbv", judul="P/B ratio",
      variants=[
   dict(q="Varian latihan (ilustratif): harga saham Rp5.600; nilai buku per saham Rp1.800. P/B = …",
        inputs={"price": 5600, "bvps": 1800},
        kunci="5600/1800", traps=["0,32x", "3.800", "7.400"],
        cara="P/B = 5.600 ÷ 1.800 = 3,11x (distraktor 0,32x = BV÷harga terbalik)"),
   dict(q="Varian latihan (ilustratif): harga saham Rp2.000; nilai buku per saham Rp2.500. P/B = …",
        inputs={"price": 2000, "bvps": 2500},
        kunci="2000/2500", traps=["1,25x", "−500", "4.500"],
        cara="P/B = 2.000 ÷ 2.500 = 0,80x (di bawah 1 — pasar menilai di bawah nilai buku)"),
   dict(q="Varian latihan (ilustratif): harga saham Rp10.000; nilai buku per saham Rp4.000. P/B = …",
        inputs={"price": 10000, "bvps": 4000},
        kunci="10000/4000", traps=["0,40x", "6.000", "14.000"],
        cara="P/B = 10.000 ÷ 4.000 = 2,50x"),
  ]),
 dict(fam="tsm", m=36, src="M36#3", gi=177, formula="tsm", judul="Diluted EPS (treasury stock method)",
      variants=[
   dict(q="Varian latihan (ILUSTRATIF): laba bersih Rp48.000 juta; 160 juta saham beredar; 20 juta opsi @Rp150; harga pasar rata-rata Rp500. Diluted EPS (Rp, treasury stock method)?",
        inputs={"ni": 48000, "waso": 160, "opt": 20, "strike": 150, "mkt": 500},
        kunci="48000/(160+20-20*150/500)", traps=["300,0", "266,7", "289,2"],
        cara="TSM: 20 − (20×150÷500 = 6) = 14 → 48.000 ÷ 174 = 275,9"),
   dict(q="Varian latihan (ILUSTRATIF): laba bersih Rp72.000 juta; 240 juta saham beredar; 30 juta opsi @Rp200; harga pasar rata-rata Rp600. Diluted EPS (Rp, treasury stock method)?",
        inputs={"ni": 72000, "waso": 240, "opt": 30, "strike": 200, "mkt": 600},
        kunci="72000/(240+30-30*200/600)", traps=["300,0", "266,7", "288,0"],
        cara="TSM: 30 − (30×200÷600 = 10) = 20 → 72.000 ÷ 260 = 276,9"),
   dict(q="Varian latihan (ILUSTRATIF): laba bersih Rp96.000 juta; 300 juta saham beredar; 40 juta opsi @Rp250; harga pasar rata-rata Rp1.000. Diluted EPS (Rp, treasury stock method)?",
        inputs={"ni": 96000, "waso": 300, "opt": 40, "strike": 250, "mkt": 1000},
        kunci="96000/(300+40-40*250/1000)", traps=["320,0", "282,4", "309,7"],
        cara="TSM: 40 − (40×250÷1.000 = 10) = 30 → 96.000 ÷ 330 = 290,9"),
  ]),
 dict(fam="capdep", m=37, src="M37#5", gi=184, formula="capdep", judul="Depresiasi komponen",
      variants=[
   dict(q="Varian latihan (ILUSTRATIF, Rp juta): gedung 39.000 — struktur 24.000/20 thn, atap 9.000/9 thn, lift 6.000/6 thn. Depresiasi komponen per tahun?",
        inputs={"c1": 24000, "l1": 20, "c2": 9000, "l2": 9, "c3": 6000, "l3": 6},
        kunci="24000/20+9000/9+6000/6", traps=["1.300", "39.000", "2.200"],
        cara="24.000/20 + 9.000/9 + 6.000/6 = 1.200 + 1.000 + 1.000 = 3.200"),
   dict(q="Varian latihan (ILUSTRATIF, Rp juta): pabrik 73.000 — bangunan 50.000/25 thn, atap 15.000/15 thn, mesin 8.000/8 thn. Depresiasi komponen per tahun?",
        inputs={"c1": 50000, "l1": 25, "c2": 15000, "l2": 15, "c3": 8000, "l3": 8},
        kunci="50000/25+15000/15+8000/8", traps=["2.920", "73.000", "3.000"],
        cara="50.000/25 + 15.000/15 + 8.000/8 = 2.000 + 1.000 + 1.000 = 4.000"),
   dict(q="Varian latihan (ILUSTRATIF, Rp juta): gudang 58.000 — struktur 36.000/30 thn, atap 12.000/12 thn, lift 10.000/10 thn. Depresiasi komponen per tahun?",
        inputs={"c1": 36000, "l1": 30, "c2": 12000, "l2": 12, "c3": 10000, "l3": 10},
        kunci="36000/30+12000/12+10000/10", traps=["1.450", "58.000", "2.200"],
        cara="36.000/30 + 12.000/12 + 10.000/10 = 1.200 + 1.000 + 1.000 = 3.200"),
  ]),
]

# Opsi kalimat untuk family capex dirakit dari angka (kunci recompute).
def capex_options(i, delta, nbv):
    d, n = fmt_int(abs(delta)), fmt_int(nbv)
    arah = "naik" if delta > 0 else "turun"
    lawan = "turun" if delta > 0 else "naik"
    kunci = "Aset tetap neto %s %s → %s" % (arah, d, n)
    traps = ["Aset tetap neto %s %s" % (lawan, d),
             "Tidak ada dampak ke neraca",
             "Ekuitas %s %s" % (arah, d)]
    return kunci, traps


def main():
    out = []
    dist_a = [0, 0, 0, 0]
    print("== gen_review_variants: verifikasi kunci (Decimal vs Fraction) ==")
    for fi, fam in enumerate(FAMILIES):
        formula, check = FORMULAS[fam["formula"]], CHECKS[fam["formula"]]
        for vi, v in enumerate(fam["variants"]):
            i = v["inputs"]
            r1, r2 = formula(i), check(i)
            if fam["formula"] == "capex":
                kunci_disp, traps = capex_options(i, r1[0], r1[1])
                ck_disp, ck_traps = capex_options(i, r2[0], r2[1])
                assert kunci_disp == ck_disp and traps == ck_traps, "jalur1 != jalur2 (%s-%d)" % (fam["fam"], vi)
            else:
                kunci_disp = r1
                assert r1 == r2, "jalur1(%s) != jalur2(%s) pada %s-%d" % (r1, r2, fam["fam"], vi)
                traps = v["traps"]
            assert len(traps) == 3, "butuh 3 distraktor"
            assert kunci_disp not in traps, "kunci tabrakan distraktor pada %s-%d" % (fam["fam"], vi)
            assert len(set(traps)) == 3, "distraktor ganda pada %s-%d" % (fam["fam"], vi)
            # shuffle deterministik -> sebar posisi kunci
            rng = random.Random(1000 * fi + vi)
            opts = [kunci_disp] + list(traps)
            order = list(range(4))
            rng.shuffle(order)
            shuffled = [opts[k] for k in order]
            a = shuffled.index(kunci_disp)
            dist_a[a] += 1
            vid = "%s-%d" % (fam["fam"], vi + 1)
            entry = {
                "id": vid, "m": fam["m"], "src": fam["src"], "gi": fam["gi"],
                "formula": fam["formula"], "inputs": i,
                "q": v["q"], "o": shuffled, "a": a, "cara": v["cara"],
            }
            out.append(entry)
            print("  %-9s M%-2d a=%d | %s = %s  ✓" % (vid, fam["m"], a, v["kunci"], kunci_disp))
    print("distribusi posisi kunci:", dist_a, "(target: tersebar, tak ada posisi dominan)")
    assert all(d > 0 for d in dist_a), "ada posisi kunci yang kosong"
    assert max(dist_a) - min(dist_a) <= 8, "distribusi kunci terlalu timpang"

    js = ("/* FSA Lab — REVIEW_VARIANTS (auto-generated oleh tools/gen_review_variants.py).\n"
          "   Varian numerik soal formulaik — SPACED REPETITION SAJA, bukan gate.\n"
          "   JANGAN edit manual — regenerate via tools/gen_review_variants.py. */\n"
          "var REVIEW_VARIANTS = " + json.dumps(out, ensure_ascii=False) + ";\n")
    dest = os.path.join(WEB, "js", "review-variants.js")
    open(dest, "w", encoding="utf-8").write(js)
    print("-> %s : %d varian dari %d soal formulaik" % (dest, len(out), len(FAMILIES)))


if __name__ == "__main__":
    main()
