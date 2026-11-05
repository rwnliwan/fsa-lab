#!/usr/bin/env python3
"""Verifikasi independen 4 template Excel FSA Lab.

Untuk tiap file:
  1. Hitung ekspektasi via Python murni (rumus ditulis ulang independen,
     BUKAN menyalin string formula dari generator).
  2. Forced recalc: salin file, pastikan fullCalcOnLoad=True, convert via
     LibreOffice headless -> nilai cached hasil recalc engine LO.
  3. Bandingkan sel OUTPUT hasil recalc vs ekspektasi Python.

Dipanggil oleh: python3 tools/gen_download_templates.py --verify
"""
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from openpyxl import load_workbook
from openpyxl.utils import get_column_letter

ROOT = Path(__file__).resolve().parent.parent
OUTDIR = ROOT / "downloads" / "templates"
RECALC = Path("/tmp/wc-recalc")

FAILURES = []

NS = {
    "table": "urn:oasis:names:tc:opendocument:xmlns:table:1.0",
    "office": "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
    "text": "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
}


def _q(ns, a):
    return "{%s}%s" % (NS[ns], a)


def ods_values(path):
    """Baca nilai cached (hasil recalc LO) dari content.xml sebuah .ods.

    Return dict {(nama_sheet, "B7"): value}. Hanya sel berisi nilai.
    """
    root = ET.fromstring(zipfile.ZipFile(path).read("content.xml"))
    out = {}
    for tbl in root.iter(_q("table", "table")):
        sname = tbl.get(_q("table", "name"))
        r = 0
        for row in tbl.findall(_q("table", "table-row")):
            for _ in range(int(row.get(_q("table", "number-rows-repeated"), 1))):
                r += 1
                c = 0
                for cell in list(row):
                    tag = cell.tag.split("}")[1]
                    if tag not in ("table-cell", "covered-table-cell"):
                        continue
                    crep = int(cell.get(_q("table", "number-columns-repeated"), 1))
                    vtype = cell.get(_q("office", "value-type"))
                    v = None
                    if vtype in ("float", "percentage", "currency"):
                        v = float(cell.get(_q("office", "value")))
                    elif vtype == "string":
                        ps = cell.findall(".//" + _q("text", "p"))
                        v = "".join("".join(p.itertext()) for p in ps)
                    elif vtype == "boolean":
                        v = cell.get(_q("office", "boolean-value")) == "true"
                    for _ in range(crep):
                        c += 1
                        if v is not None:
                            out[(sname, f"{get_column_letter(c)}{r}")] = v
    return out


def ok(cond, msg):
    print(("  PASS " if cond else "  FAIL ") + msg)
    if not cond:
        FAILURES.append(msg)


def close(a, b, tol, msg):
    ok(abs(a - b) <= tol, f"{msg}: got {a!r}, expected {b!r} (tol {tol})")


class Recalc:
    """Hasil forced recalc: file xlsx -> LO headless -> .ods -> nilai cached."""
    def __init__(self, name, prefill=None):
        RECALC.mkdir(parents=True, exist_ok=True)
        src = OUTDIR / name
        tmp = RECALC / (src.stem + "-in.xlsx")
        shutil.copy(src, tmp)
        if prefill:
            wb = load_workbook(tmp)
            for sheet, ref, value in prefill:
                wb[sheet][ref] = value
            wb.save(tmp)
        # pastikan flag fullCalcOnLoad (defense in depth; generator sudah set)
        wb = load_workbook(tmp)
        wb.calculation.fullCalcOnLoad = True
        wb.save(tmp)
        out = tmp.with_suffix(".ods")
        if out.exists():
            out.unlink()
        r = subprocess.run(
            ["soffice", "--headless", "--convert-to", "ods",
             "--outdir", str(RECALC), str(tmp)],
            capture_output=True, text=True, timeout=180)
        if not out.exists():
            print(r.stdout[-2000:]); print(r.stderr[-2000:])
            raise RuntimeError(f"soffice convert gagal untuk {name}")
        self.cells = ods_values(out)

    def val(self, sheet, ref):
        return self.cells.get((sheet, ref))


def recalc_copy(name):
    return Recalc(name)


def val(recalc, sheet, ref):
    return recalc.val(sheet, ref)


# ---------------------------------------------------------------- Beneish
def verify_beneish():
    print("== fsa-lab-beneish-calculator.xlsx")
    inp = dict(DSRI=1.45, GMI=0.97, AQI=1.00, SGI=1.30,
               DEPI=1.00, SGAI=1.00, LVGI=0.96, TATA=0.032)
    coef = dict(DSRI=0.92, GMI=0.528, AQI=0.404, SGI=0.892, DEPI=0.115,
                SGAI=-0.172, TATA=4.679, LVGI=-0.327)
    m = -4.84 + sum(coef[k] * inp[k] for k in inp)
    exp_interp = ("PERLU INVESTIGASI — skor di atas ambang -1,78 (skor, bukan probabilitas)"
                  if m > -1.78 else "TIDAK TERINDIKASI — skor di bawah ambang -1,78 (tetap waspada)")
    p = recalc_copy("fsa-lab-beneish-calculator.xlsx")
    close(val(p, "OUTPUT", "D15"), m, 0.005, f"M-score (indep {m:.4f})")
    ok(val(p, "OUTPUT", "B17") == exp_interp, f"interpretasi: {val(p,'OUTPUT','B17')!r}")
    # kontribusi per komponen
    rows = {"DSRI": 7, "GMI": 8, "AQI": 9, "SGI": 10, "DEPI": 11,
            "SGAI": 12, "LVGI": 13, "TATA": 14}
    for k, r in rows.items():
        close(val(p, "OUTPUT", f"D{r}"), coef[k] * inp[k], 1e-4, f"kontribusi {k}")
    close(val(p, "OUTPUT", "D6"), -4.84, 1e-9, "konstanta")


# ---------------------------------------------------------------- Altman
# Varian Z' (Altman 1993) untuk perusahaan privat — sinkron dengan generator.
def verify_altman():
    print("== fsa-lab-altman-calculator.xlsx")
    x = [0.26, 0.18, 0.16, 0.66, 1.15]
    c = [0.717, 0.847, 3.107, 0.420, 0.998]
    z = sum(a * b for a, b in zip(x, c))
    zona = ("SAFE — risiko kebangkrutan rendah" if z > 2.90
            else "DISTRESS — risiko kebangkrutan tinggi" if z < 1.23
            else "GREY ZONE — waspada, butuh analisis lanjutan")
    p = recalc_copy("fsa-lab-altman-calculator.xlsx")
    close(val(p, "OUTPUT", "D11"), z, 0.005, f"Z'-score (indep {z:.4f})")
    ok(val(p, "OUTPUT", "B13") == zona, f"zona: {val(p,'OUTPUT','B13')!r}")
    for i, (xi, ci) in enumerate(zip(x, c)):
        close(val(p, "OUTPUT", f"D{6+i}"), xi * ci, 1e-4, f"kontribusi X{i+1}")


# ---------------------------------------------------------------- Dashboard
D24 = dict(pen=400000, hpp=264000, ebit=48000, bunga=10000, ni=29640,
           kas=33200, piut=55000, pers=80000, al=168200, ta=378200,
           ap=50000, ll=80000, tl=238000, ek=140200,
           ubank=130000, sewa=58000, ebitda=None, ic=None)
D25 = dict(pen=520000, hpp=338000, ebit=72000, bunga=14000, ni=45240,
           kas=21440, piut=104000, pers=96000, al=221440, ta=451440,
           ap=62000, ll=102000, tl=272000, ek=179440,
           ubank=141440, sewa=60000, ebitda=102000, ic=355443)


def ratios_yr(d, d_prev, ebitda_fill=None, ic_fill=None):
    """Hitung 16 rasio independen. None bila input tak tersedia."""
    ebitda = d["ebitda"] if d["ebitda"] is not None else ebitda_fill
    ic = d["ic"] if d["ic"] is not None else ic_fill
    nopat = d["ebit"] * 0.78
    r = {}
    r["CR"] = d["al"] / d["ll"]
    r["QR"] = (d["al"] - d["pers"]) / d["ll"]
    r["DSO"] = d["piut"] / d["pen"] * 365
    r["DIO"] = d["pers"] / d["hpp"] * 365
    r["DPO"] = d["ap"] / d["hpp"] * 365
    r["CCC"] = r["DSO"] + r["DIO"] - r["DPO"]
    r["ATO"] = d["pen"] / ((d_prev["ta"] + d["ta"]) / 2) if d_prev else d["pen"] / d["ta"]
    r["DE"] = d["tl"] / d["ek"]
    r["NDE"] = (d["ubank"] + d["sewa"] - d["kas"]) / ebitda if ebitda else None
    r["COV"] = d["ebit"] / d["bunga"]
    r["GM"] = (d["pen"] - d["hpp"]) / d["pen"]
    r["OM"] = d["ebit"] / d["pen"]
    r["NM"] = d["ni"] / d["pen"]
    r["ROE"] = d["ni"] / ((d_prev["ek"] + d["ek"]) / 2) if d_prev else d["ni"] / d["ek"]
    r["ROA"] = d["ni"] / ((d_prev["ta"] + d["ta"]) / 2) if d_prev else d["ni"] / d["ta"]
    r["ROIC"] = nopat / ic if ic else None
    return r, nopat


def verify_dashboard():
    print("== fsa-lab-ratio-dashboard.xlsx")
    p = recalc_copy("fsa-lab-ratio-dashboard.xlsx")
    r24, n24 = ratios_yr(D24, None)
    r25, n25 = ratios_yr(D25, D24)
    keys = ["CR", "QR", "DSO", "DIO", "DPO", "CCC", "ATO", "DE", "NDE",
            "COV", "GM", "OM", "NM", "ROE", "ROA", "ROIC"]
    for i, k in enumerate(keys):
        r = 6 + i
        v24, v25 = r24[k], r25[k]
        got24, got25 = val(p, "OUTPUT", f"C{r}"), val(p, "OUTPUT", f"D{r}")
        if v24 is None:
            ok(got24 == "—", f"{k} 2024 placeholder: {got24!r}")
        else:
            close(got24, v24, 0.005, f"{k} 2024 (indep {v24:.4f})")
        if v25 is None:
            ok(got25 == "—", f"{k} 2025 placeholder")
        else:
            close(got25, v25, 0.005, f"{k} 2025 (indep {v25:.4f})")
        # kolom perubahan
        if v24 is None or v25 is None:
            ok(val(p, "OUTPUT", f"E{r}") == "—", f"{k} delta placeholder")
        else:
            close(val(p, "OUTPUT", f"E{r}"), v25 - v24, 0.005, f"{k} delta")
    close(val(p, "OUTPUT", "C23"), n24, 1.0, "NOPAT 2024 helper")
    close(val(p, "OUTPUT", "D23"), n25, 1.0, "NOPAT 2025 helper")
    ok(val(p, "INPUT", "B27") == "OK", "cek neraca 2024")
    ok(val(p, "INPUT", "C27") == "OK", "cek neraca 2025")

    # varian uji: isi EBITDA 2024 & IC 2024 manual -> cabang IFERROR terisi
    print("-- varian: EBITDA24=74000, IC24=300000")
    pv = Recalc("fsa-lab-ratio-dashboard.xlsx",
                prefill=[("INPUT", "B24", 74000), ("INPUT", "B25", 300000)])
    rv24, _ = ratios_yr(D24, None, ebitda_fill=74000, ic_fill=300000)
    close(val(pv, "OUTPUT", "C14"), rv24["NDE"], 0.005,
          f'NDE 2024 varian (indep {rv24["NDE"]:.4f})')
    close(val(pv, "OUTPUT", "C21"), rv24["ROIC"], 0.0005,
          f'ROIC 2024 varian (indep {rv24["ROIC"]:.4f})')


# ---------------------------------------------------------------- DCF
def verify_dcf():
    print("== fsa-lab-dcf-input-builder.xlsx")
    fcff1, g1, n, wacc, g = 25000, 0.08, 5, 0.12, 0.03
    fcffs = [fcff1 * (1 + g1) ** t for t in range(n)]  # t=0 -> thn 1
    pvs = [f / (1 + wacc) ** (t + 1) for t, f in enumerate(fcffs)]
    tv = fcffs[-1] * (1 + g) / (wacc - g)
    pv_tv = tv / (1 + wacc) ** n
    ev = sum(pvs) + pv_tv
    netdebt = 201440 - 21440
    eq = ev - netdebt
    psh = eq / 100
    p = recalc_copy("fsa-lab-dcf-input-builder.xlsx")
    for t in range(n):
        r = 6 + t
        close(val(p, "OUTPUT", f"C{r}"), fcffs[t], 1.0, f"FCFF thn {t+1}")
        close(val(p, "OUTPUT", f"D{r}"), 1 / (1 + wacc) ** (t + 1), 1e-4,
              f"DF thn {t+1}")
        close(val(p, "OUTPUT", f"E{r}"), pvs[t], 1.0, f"PV FCFF thn {t+1}")
    close(val(p, "OUTPUT", "C11"), tv, 5.0, f"TV (indep {tv:,.1f})")
    close(val(p, "OUTPUT", "E11"), pv_tv, 5.0, f"PV TV (indep {pv_tv:,.1f})")
    close(val(p, "OUTPUT", "C13"), ev, 5.0, f"EV (indep {ev:,.1f})")
    close(val(p, "OUTPUT", "C14"), netdebt, 1.0, "utang neto")
    close(val(p, "OUTPUT", "C15"), eq, 5.0, f"ekuitas tersirat (indep {eq:,.1f})")
    close(val(p, "OUTPUT", "C16"), psh, 1.0, f"per saham (indep {psh:,.1f})")
    ok(val(p, "OUTPUT", "A18").startswith("Cek: OK"), "cek WACC > g")


def run_verify():
    verify_beneish()
    verify_altman()
    verify_dashboard()
    verify_dcf()
    print()
    if FAILURES:
        print(f"VERIFY GAGAL: {len(FAILURES)} kegagalan")
        for f in FAILURES:
            print(" -", f)
        return 1
    print("VERIFY LULUS: semua nilai recalc cocok dengan hitungan Python independen.")
    return 0


if __name__ == "__main__":
    sys.exit(run_verify())
