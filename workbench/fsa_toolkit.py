#!/usr/bin/env python3
"""
FSA Lab — Toolkit Forensik (Python Workbench)
Jalankan lokal / Colab. Tiga screen siap pakai untuk screening laporan keuangan.

Contoh:
    python3 fsa_toolkit.py
"""
import math
import xml.etree.ElementTree as ET


# ---------- 1. Beneish M-score: probabilitas manipulasi laba ----------
def beneish_mscore(dsri, gmi, aqi, sgi, depi, sgai, lvgi, tata):
    """8 rasio Beneish. M > -1.78 = kemungkinan manipulator (flag)."""
    m = (-4.84 + 0.92*dsri + 0.528*gmi + 0.404*aqi + 0.892*sgi
         + 0.115*depi - 0.172*sgai + 4.679*tata - 0.327*lvgi)
    return m, ("FLAG — kemungkinan manipulator" if m > -1.78
               else "PASS — tidak terindikasi")


# ---------- 2. DSO screen: piutang vs penjualan ----------
def dso_screen(receivables, revenue, prev_dso, threshold_days=15):
    """Flag bila DSO naik > threshold vs tahun lalu."""
    dso = receivables / revenue * 365 if revenue else 0
    drift = dso - prev_dso
    return dso, drift, ("FLAG — DSO melar %.1f hari" % drift if drift > threshold_days
                       else "PASS — DSO wajar")


# ---------- 3. Benford test: kealamian angka ----------
def benford_test(numbers):
    """Bandingkan distribusi digit pertama vs hukum Benford. Return max deviation."""
    benford = [math.log10(1 + 1/d) for d in range(1, 10)]
    digits = [int(str(abs(float(x))).lstrip("0").replace(".", "")[:1])
              for x in numbers if float(x) != 0]
    digits = [d for d in digits if 1 <= d <= 9]
    n = len(digits)
    if not n:
        return 0.0, "data kosong"
    dev = max(abs(digits.count(d)/n - benford[d-1]) for d in range(1, 10))
    return dev, ("FLAG — deviasi %.3f, selidiki" % dev if dev > 0.06
                 else "PASS — wajar")


# ---------- 4. Parser XBRL sederhana → 4 rasio forensik ----------
def xbrl_parse_ratios(xml_string):
    """Parse XML SEDERHANA berisi angka laporan (tag seperti <Revenue>,
    <NetIncome>, <TotalAssets>, <OperatingCashFlow>) lalu hitung:
    net margin, ROA, CFO/NI, dan accruals (NI - CFO).

    CONTOH OFFLINE — bukan koneksi live ke EDGAR. Untuk data live pakai
    SEC EDGAR API (https://www.sec.gov/cgi-bin/browse-edgar) lalu feed
    XML/JSON-nya ke fungsi ini.
    """
    root = ET.fromstring(xml_string)

    def num(tag):
        # cari tag apa adanya; abaikan namespace bila ada (suffix match)
        el = root.find(".//" + tag)
        if el is None:
            for e in root.iter():
                if e.tag == tag or e.tag.endswith("}" + tag):
                    el = e
                    break
        if el is None or el.text is None:
            raise ValueError("tag <%s> tidak ditemukan" % tag)
        return float(el.text.strip().replace(",", "").replace(" ", ""))

    rev = num("Revenue")
    ni = num("NetIncome")
    ta = num("TotalAssets")
    cfo = num("OperatingCashFlow")
    ratios = {
        "net_margin": ni / rev if rev else 0,
        "roa": ni / ta if ta else 0,
        "cfo_ni": cfo / ni if ni else 0,
        "accruals": ni - cfo,
    }
    return ratios


XBRL_CONTOH = """<Financials>
  <Revenue>520000</Revenue>
  <NetIncome>53200</NetIncome>
  <TotalAssets>461000</TotalAssets>
  <OperatingCashFlow>30800</OperatingCashFlow>
</Financials>"""


# ---------- 5. Duplicate detector: angka kembar = jejak invoice ganda ----------

def duplicate_detector(values, min_count=2):
    """Cari nilai yang muncul >= min_count kali dalam daftar angka jurnal.

    Duplikat persis dalam jumlah besar = red flag klasik: invoice digandakan,
    pembayaran dipecah agar lolos ambang otorisasi, atau round-tripping.
    Mengembalikan dict {nilai: jumlah_kemunculan} yang memenuhi ambang,
    diurut dari yang paling sering.
    """
    from collections import Counter
    c = Counter(values)
    dups = {v: n for v, n in c.items() if n >= min_count}
    return dict(sorted(dups.items(), key=lambda kv: -kv[1]))


# ---------- 6. Gap analysis: nomor dokumen yang hilang ----------

def gap_analysis(numbers):
    """Cari nomor urut yang HILANG dari deretan nomor dokumen (invoice, cek, PO).

    Nomor yang hilang = dokumen disembunyikan / dibatalkan diam-diam / dipakai
    dua kali. Mengembalikan list nomor yang hilang di antara min dan max.
    """
    if not numbers:
        return []
    lo, hi = min(numbers), max(numbers)
    have = set(numbers)
    return [n for n in range(lo, hi + 1) if n not in have]


# ---------- 7. Red-flag scan: bahasa MD&A yang menghindar ----------

REDFLAG_WORDS = [
    "challenging", "headwind", "one-time", "non-recurring", "restructuring",
    "strategic alternatives", "going concern", "material weakness",
    "restatement", "difficult market conditions", "unprecedented",
    "transformational", "right-sizing", "synergies", "pro forma",
]

def redflag_scan(text):
    """Hitung frasa penghindar (weasel words) dalam teks MD&A / catatan.

    Manajemen yang jujur memakai angka; yang bermasalah memakai eufemisme.
    Bukan bukti fraud — tapi daftar paragraf yang wajib dibaca ulang.
    Mengembalikan list (frasa, jumlah) yang ditemukan, terurut terbanyak.
    """
    t = text.lower()
    hits = [(w, t.count(w)) for w in REDFLAG_WORDS if w in t]
    return sorted(hits, key=lambda kv: -kv[1])


# ---------- 8. EDGAR live: tarik fakta XBRL emiten US langsung ----------

def fetch_edgar_facts(cik, timeout=30):
    """Tarik companyfacts XBRL dari SEC EDGAR API untuk satu emiten (LIVE).

    cik: string 10 digit, mis. "0000320193" (Apple). Daftar CIK:
    https://www.sec.gov/files/company_tickers.json
    Mengembalikan dict {Revenue, NetIncome, TotalAssets, OperatingCashFlow}
    periode FY terakhir (form 10-K), dalam USD, plus tahunnya.

    Jujur soal batas: butuh internet; SEC mewajibkan User-Agent yang wajar;
    angka = as-reported (belum dinormalisasi); rate-limit SEC ~10 req/detik.
    """
    import json, urllib.request
    cik = str(cik).zfill(10)
    url = "https://data.sec.gov/api/xbrl/companyfacts/CIK%s.json" % cik
    req = urllib.request.Request(url, headers={
        "User-Agent": "FSA-Lab-Edu/1.0 (pembelajaran analisis laporan keuangan)",
        "Accept": "application/json",
    })
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = json.load(r)
    facts = data["facts"]["us-gaap"]

    def latest_fy(tag):
        if tag not in facts:
            return None, None
        usd = facts[tag]["units"].get("USD", [])
        fy = [x for x in usd if x.get("form") == "10-K" and x.get("fp") == "FY"]
        if not fy:
            return None, None
        last = max(fy, key=lambda x: x["end"])
        return last["val"], last["end"][:4]

    rev_tags = ["RevenueFromContractWithCustomerExcludingAssessedTax",
                "RevenuesFromContractsWithCustomersExcludingAssessedTax",
                "Revenues", "SalesRevenueNet"]
    rev, yr = None, None
    for t in rev_tags:
        rev, yr = latest_fy(t)
        if rev is not None:
            break
    ni, _ = latest_fy("NetIncomeLoss")
    ta, _ = latest_fy("Assets")
    cfo, _ = latest_fy("NetCashProvidedByUsedInOperatingActivities")
    return {"cik": cik, "fiscal_year": yr, "Revenue": rev, "NetIncome": ni,
            "TotalAssets": ta, "OperatingCashFlow": cfo}


# ---------- 9. Piotroski F-score: 9 tes fundamental → skor 0-9 ----------

def piotroski(fin):
    """F-score Piotroski (2000): sembilan tes BINER, 1 poin per tes lolos.

    fin = dict dengan kunci (t = tahun berjalan, prev = tahun lalu):
      ni_t, ni_prev      laba bersih
      cfo_t             arus kas operasi
      ta_t, ta_prev     total aset
      ltd_t, ltd_prev   long-term debt (utang bank panjang + liabilitas sewa)
      ca_t, cl_t, ca_prev, cl_prev   aset & liabilitas lancar
      gm_t, gm_prev     gross margin (desimal, mis. 0.35)
      sales_t, sales_prev  penjualan
      new_equity        True bila menerbitkan saham baru tahun berjalan

    4 tes profitabilitas (ROA>0, CFO>0, ΔROA naik, CFO>NI),
    3 tes leverage/likuiditas (Δleverage turun, Δlikuiditas naik, tanpa emisi saham),
    2 tes efisiensi (Δgross margin naik, Δasset turnover naik).
    Skor 7-9 = value stock berfundamental kuat; 0-2 = lemah.

    Mengembalikan {"score": int 0-9, "tests": [ {"name", "passed", "detail"} ]}.
    """
    tests = []

    def _t(name, passed, detail):
        p = bool(passed)
        tests.append({"name": name, "passed": p, "detail": detail})
        return 1 if p else 0

    roa_t = fin["ni_t"] / fin["ta_t"] if fin["ta_t"] else 0
    roa_prev = fin["ni_prev"] / fin["ta_prev"] if fin["ta_prev"] else 0
    lev_t = fin["ltd_t"] / fin["ta_t"] if fin["ta_t"] else 0
    lev_prev = fin["ltd_prev"] / fin["ta_prev"] if fin["ta_prev"] else 0
    cr_t = fin["ca_t"] / fin["cl_t"] if fin["cl_t"] else 0
    cr_prev = fin["ca_prev"] / fin["cl_prev"] if fin["cl_prev"] else 0
    ato_t = fin["sales_t"] / fin["ta_t"] if fin["ta_t"] else 0
    ato_prev = fin["sales_prev"] / fin["ta_prev"] if fin["ta_prev"] else 0

    score = 0
    score += _t("ROA positif", roa_t > 0,
               "ROA t = %.2f%%" % (roa_t * 100))
    score += _t("CFO positif", fin["cfo_t"] > 0,
               "CFO t = %s" % ("{:,.0f}".format(fin["cfo_t"])))
    score += _t("ΔROA naik", roa_t > roa_prev,
               "ROA %.2f%% → %.2f%%" % (roa_prev * 100, roa_t * 100))
    score += _t("Accrual: CFO > NI", fin["cfo_t"] > fin["ni_t"],
               "CFO %s vs NI %s" % ("{:,.0f}".format(fin["cfo_t"]),
                                    "{:,.0f}".format(fin["ni_t"])))
    score += _t("ΔLeverage turun", lev_t < lev_prev,
               "LTD/TA %.2f%% → %.2f%%" % (lev_prev * 100, lev_t * 100))
    score += _t("ΔLiquidity naik", cr_t > cr_prev,
               "CR %.2f → %.2f" % (cr_prev, cr_t))
    score += _t("Tanpa penerbitan saham", not fin.get("new_equity", False),
               "emisi saham baru: %s" % ("YA" if fin.get("new_equity") else "tidak"))
    score += _t("ΔGross margin naik", fin["gm_t"] > fin["gm_prev"],
               "GM %.1f%% → %.1f%%" % (fin["gm_prev"] * 100, fin["gm_t"] * 100))
    score += _t("ΔAsset turnover naik", ato_t > ato_prev,
               "ATO %.2fx → %.2fx" % (ato_prev, ato_t))
    return {"score": score, "max": 9, "tests": tests}


# ---------- 10. Altman Z-score: zona distress (3 varian) ----------

def altman(fin, variant="z"):
    """Altman Z-score: jarak perusahaan ke kebangkrutan.

    fin = dict: wc (working capital), ta (total aset), re (retained earnings),
      ebit, mve (market value ekuitas untuk 'z'; BOOK value untuk
      'zprime'/'zdoubleprime'), tl (total liabilitas), sales.

    variant:
      'z'            klasik, perusahaan publik manufaktur
                     Z = 1.2·X1+1.4·X2+3.3·X3+0.6·X4+1.0·X5
                     aman >2.99 · grey 1.81-2.99 · distress <1.81
      'zprime'       perusahaan privat (X4 = book equity/TL)
                     Z' = 0.717·X1+0.847·X2+3.107·X3+0.420·X4+0.998·X5
                     aman >2.90 · grey 1.23-2.90 · distress <1.23
      'zdoubleprime' non-manufaktur / emerging (tanpa X5, X4 = book equity/TL)
                     Z" = 6.56·X1+3.26·X2+6.72·X3+1.05·X4
                     aman >2.60 · grey 1.10-2.60 · distress <1.10

    X1=WC/TA, X2=RE/TA, X3=EBIT/TA, X4=ekuitas/TL, X5=sales/TA.
    Mengembalikan {"variant", "z", "zone" ("safe"/"grey"/"distress"),
                   "x": {x1..x5}, "cutoffs"}.
    """
    v = str(variant).lower()
    if v not in ("z", "zprime", "zdoubleprime"):
        raise ValueError("variant harus 'z', 'zprime', atau 'zdoubleprime'")
    ta = fin["ta"]
    x1 = fin["wc"] / ta
    x2 = fin["re"] / ta
    x3 = fin["ebit"] / ta
    x4 = fin["mve"] / fin["tl"]
    x5 = fin["sales"] / ta
    if v == "z":
        z = 1.2*x1 + 1.4*x2 + 3.3*x3 + 0.6*x4 + 1.0*x5
        zone = "safe" if z > 2.99 else ("grey" if z >= 1.81 else "distress")
        cutoffs = "aman >2,99 · grey 1,81-2,99 · distress <1,81"
    elif v == "zprime":
        z = 0.717*x1 + 0.847*x2 + 3.107*x3 + 0.420*x4 + 0.998*x5
        zone = "safe" if z > 2.90 else ("grey" if z >= 1.23 else "distress")
        cutoffs = "aman >2,90 · grey 1,23-2,90 · distress <1,23"
    else:
        z = 6.56*x1 + 3.26*x2 + 6.72*x3 + 1.05*x4
        zone = "safe" if z > 2.60 else ("grey" if z >= 1.10 else "distress")
        cutoffs = "aman >2,60 · grey 1,10-2,60 · distress <1,10"
    return {"variant": v, "z": z, "zone": zone,
            "x": {"x1": x1, "x2": x2, "x3": x3, "x4": x4, "x5": x5},
            "cutoffs": cutoffs}


# ---------- 11. Covenant Break Predictor: shock CFO setelah bunga → DSCR baru ----------

def covenant_break(dscr_base, dscr_min, cfo, shock_pct):
    """Prediksi DSCR setelah shock CFO & titik jebol covenant (lensa kredit).

    Konvensi (sama seperti M23): DSCR = CFO setelah bunga / (bunga + cicilan pokok).

    dscr_base: DSCR saat ini (CFO setelah bunga / debt service), mis. 1.35
    dscr_min:  batas minimum covenant, mis. 1.20
    cfo:       CFO setelah bunga saat ini (Rp juta; debt service dianggap TETAP saat shock)
    shock_pct: shock CFO dalam persen, mis. -20 untuk -20%

    Asumsi linear: debt service tetap → DSCR baru = DSCR_base × (1 + shock).
    Titik jebol (linear approx): shock % di mana DSCR tepat = minimum.
    Mengembalikan (dscr_baru, status, titik_jebol_pct).
    status = "JEBOL" bila dscr_baru < dscr_min, "AMAN" bila sebaliknya.
    """
    dscr_baru = dscr_base * (1 + shock_pct / 100.0)
    status = "JEBOL" if dscr_baru < dscr_min else "AMAN"
    titik_jebol = (dscr_min / dscr_base - 1.0) * 100.0 if dscr_base else 0.0
    return dscr_baru, status, titik_jebol


# ---------- 12. DCF Input Builder: proyeksi FCFF 5 thn + TV + EV ----------

def dcf_inputs(fcff_tahun1, growth, wacc, g_terminal):
    """Bangun input DCF 2 tahap (lensa investasi).

    fcff_tahun1: FCFF tahun 1 (tahun proyeksi pertama; pertumbuhan mulai tahun 2)
    growth:    pertumbuhan FCFF tahunan fase eksplisit (desimal, mis. 0.03)
    wacc:      discount rate (desimal, mis. 0.12)
    g_terminal: pertumbuhan abadi setelah tahun 5 (desimal, mis. 0.03)

    FCFF_t = fcff_tahun1 × (1+growth)^(t-1) untuk tahun 1..5.
    TV = FCFF5 × (1+g_terminal) / (wacc − g_terminal), didiskon ke t=0.
    EV = Σ PV(FCFF_t) + PV(TV).

    Kanonis (M18): fcff_tahun1=25.000, growth=3%, wacc=12%, g=3% → EV = 277.778
    (identik dengan M18: EV = FCFF ÷ (WACC − g) = 25.000 ÷ 0,09).

    Guard domain model (Cue P2-1): wacc HARUS > g_terminal, jika tidak
    rumus perpetuitas TV tidak bermakna → ValueError.
    """
    if not (wacc > g_terminal):
        raise ValueError(
            f"Model tidak valid: wacc ({wacc:.2%}) harus > g_terminal ({g_terminal:.2%}). "
            "Rumus TV = FCFF×(1+g)/(wacc−g) hanya bermakna bila wacc > g."
        )
    fcff = [fcff_tahun1 * (1 + growth) ** t for t in range(5)]  # tahun 1..5
    tv = fcff[-1] * (1 + g_terminal) / (wacc - g_terminal)
    pv_fcff = [f / (1 + wacc) ** (i + 1) for i, f in enumerate(fcff)]
    pv_tv = tv / (1 + wacc) ** 5
    ev = sum(pv_fcff) + pv_tv
    return {"fcff": fcff, "tv": tv, "ev": ev,
            "pv_fcff": pv_fcff, "pv_tv": pv_tv}

def footnote_diff(old_text, new_text):
    """Bandingkan dua versi teks (footnote / MD&A / catatan) per kalimat.

    Mengembalikan dict:
        {"added": [...], "removed": [...], "changed": [{"dari":..., "ke":...}, ...]}
    - added:   kalimat yang hanya ada di teks baru
    - removed: kalimat yang hanya ada di teks lama
    - changed: pasangan kalimat lama->baru yang mirip (>=40%) tapi tidak identik

    Berguna untuk audit: apa yang diam-diam berubah di catatan kaki antar tahun?
    Murni stdlib (difflib) — jalan di Colab/lokal tanpa install.
    """
    import difflib
    import re

    def sentences(t):
        t = (t or "").strip()
        if not t:
            return []
        parts = re.split(r"(?<=[.!?])\s+", t)
        return [p.strip() for p in parts if p.strip()]

    old = sentences(old_text)
    new = sentences(new_text)
    sm = difflib.SequenceMatcher(None, old, new, autojunk=False)

    added, removed, changed = [], [], []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            continue
        if tag == "delete":
            removed.extend(old[i1:i2])
        elif tag == "insert":
            added.extend(new[j1:j2])
        else:  # replace: pasangkan yang mirip sebagai 'changed'
            ro, rn = old[i1:i2], new[j1:j2]
            used = set()
            for a in ro:
                best, bi, bs = None, None, 0.0
                for k, b in enumerate(rn):
                    if k in used:
                        continue
                    r = difflib.SequenceMatcher(None, a, b).ratio()
                    if r > bs:
                        best, bi, bs = b, k, r
                if bs >= 0.4:
                    changed.append({"dari": a, "ke": best})
                    used.add(bi)
                else:
                    removed.append(a)
            for k, b in enumerate(rn):
                if k not in used:
                    added.append(b)
    return {"added": added, "removed": removed, "changed": changed}


if __name__ == "__main__":
    # Contoh: PT Cemerlang Abadi (Modul 2) — angka ilustratif
    print("== Beneish M-score (contoh) ==")
    m, s = beneish_mscore(dsri=1.45, gmi=0.97, aqi=1.02, sgi=1.30,
                          depi=1.0, sgai=1.05, lvgi=0.96, tata=0.032)
    print("M = %.2f → %s" % (m, s))
    print("\n== DSO screen ==")
    dso, drift, s = dso_screen(receivables=104_000, revenue=520_000, prev_dso=50.2)
    print("DSO = %.1f hari → %s" % (dso, s))
    print("\n== Benford test (contoh umum — 12 angka terlalu sedikit untuk uji serius) ==")
    dev, s = benford_test([480000, 288000, 192000, 120000, 72000, 46800,
                           35000, 72000, 84000, 210000, 48000, 30000])
    print("deviasi maks = %.3f → %s" % (dev, s))

    print("\n== Duplicate detector (contoh: invoice digandakan?) ==")
    d = duplicate_detector([12000, 45000, 12000, 7800, 45000, 45000, 9100])
    print("duplikat:", d if d else "tidak ada")

    print("\n== Gap analysis (contoh: nomor invoice hilang) ==")
    g = gap_analysis([101, 102, 104, 105, 108])
    print("nomor hilang:", g if g else "tidak ada")

    print("\n== Red-flag scan (contoh MD&A) ==")
    rf = redflag_scan("In this challenging year with headwinds, we booked one-time "
                      "restructuring charges as part of strategic alternatives.")
    print("frasa penghindar:", rf if rf else "tidak ada")

    print("\n== Parser XBRL → rasio forensik (contoh offline; live = SEC EDGAR API) ==")
    r = xbrl_parse_ratios(XBRL_CONTOH)
    print("net margin = %.1f%%" % (r["net_margin"] * 100))
    print("ROA        = %.1f%%" % (r["roa"] * 100))
    print("CFO / NI   = %.2fx %s" % (r["cfo_ni"],
          "→ FLAG, laba tidak jadi kas" if r["cfo_ni"] < 1 else "→ PASS"))
    print("accruals (NI-CFO) = {:,.0f}".format(r["accruals"]))

    print("\n== Piotroski F-score (Cemerlang 2025 vs 2024, ilustratif Rp juta) ==")
    pf = piotroski(dict(ni_t=45_240, ni_prev=29_640, cfo_t=30_800,
                        ta_t=451_440, ta_prev=378_200,
                        ltd_t=110_000+60_000, ltd_prev=100_000+58_000,
                        ca_t=221_440, cl_t=102_000, ca_prev=168_200, cl_prev=80_000,
                        gm_t=0.350, gm_prev=0.340,
                        sales_t=520_000, sales_prev=400_000, new_equity=False))
    print("F-score = %d/%d" % (pf["score"], pf["max"]))
    for t in pf["tests"]:
        print("  [%s] %s — %s" % ("1" if t["passed"] else "0", t["name"], t["detail"]))

    print("\n== Altman Z (Cemerlang 2025; mve = book equity utk Z'/Z\") ==")
    fa = dict(wc=119_440, ta=451_440, re=79_440, ebit=72_000,
              mve=179_440, tl=272_000, sales=520_000)
    for var in ("z", "zprime", "zdoubleprime"):
        az = altman(fa, var)
        print("%-12s Z = %.2f → %s (%s)" % (az["variant"], az["z"],
                                            az["zone"].upper(), az["cutoffs"]))

    print("\n== Covenant Break Predictor (DSCR 1,35 → shock -20%) ==")
    d, s, tj = covenant_break(dscr_base=1.35, dscr_min=1.20,
                              cfo=110_000, shock_pct=-20)
    print("DSCR baru = %.2f → %s (titik jebol: shock %.1f%%)" % (d, s, tj))

    print("\n== DCF Input Builder (kanonis M18: EV harus 277.778) ==")
    di = dcf_inputs(fcff_tahun1=25_000, growth=0.03, wacc=0.12, g_terminal=0.03)
    print("FCFF 5 thn:", ", ".join("{:,.0f}".format(f) for f in di["fcff"]))
    print("TV = {:,.0f} (PV {:,.0f})".format(di["tv"], di["pv_tv"]))
    print("EV = {:,.0f} {}".format(di["ev"],
          "✓ cocok M18" if abs(di["ev"] - 277_778) < 1 else "✗ TIDAK cocok M18"))
