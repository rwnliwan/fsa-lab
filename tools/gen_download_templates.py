#!/usr/bin/env python3
"""Build 4 FSA Lab Excel templates in downloads/templates/.

Tiap file: sheet PETUNJUK + INPUT (sel input unlocked, header kuning) +
OUTPUT (rumus, sheet protected password "fsalab").

Aturan xlsx SEVERE yang dijaga:
  (1) hanya fungsi Excel klasik (tanpa XLOOKUP dkk) -> tak butuh prefix _xlfn.
  (2) wb.calculation.fullCalcOnLoad=True agar LibreOffice forced recalc.
  (3) tak ada sel teks yang diawali = + - (Sheets parse sebagai rumus).

Verifikasi: python3 tools/gen_download_templates.py --verify
  -> hitung manual independen + forced recalc via soffice headless,
     bandingkan nilai OUTPUT. Bukti dicatat di qa/workstream-c-verify.md.
"""
import subprocess
import sys
from pathlib import Path

from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side, Protection

ROOT = Path(__file__).resolve().parent.parent
OUTDIR = ROOT / "downloads" / "templates"
PWD = "fsalab"

# Brand identity "Three-Lens Ledger" (Instinct): Ink #192B2B, Paper #FAF6ED,
# Apricot #F3C9A7, Teal #B9DDD2, Lilac #D9D1EB.
INK = "192B2B"
APRICOT = "F3C9A7"

YELLOW = PatternFill("solid", fgColor=APRICOT)
LBLUE = PatternFill("solid", fgColor="DDEBF7")
TITLE_FONT = Font(bold=True, size=14, color=INK)
HDR_FONT = Font(bold=True, size=11, color=INK)
BOLD = Font(bold=True)
THIN = Border(left=Side(style="thin", color="B0B0B0"),
              right=Side(style="thin", color="B0B0B0"),
              top=Side(style="thin", color="B0B0B0"),
              bottom=Side(style="thin", color="B0B0B0"))
WRAP = Alignment(wrap_text=True, vertical="center")
UNLOCKED = Protection(locked=False)
MODERN_FNS = ("XLOOKUP", "TEXTJOIN", "TEXTSPLIT", "FILTER(", "UNIQUE(",
              "SORT(", "SORTBY(", "SEQUENCE(", "LET(", "LAMBDA(", "XMATCH")


def new_wb():
    wb = Workbook()
    wb.remove(wb.active)
    wb.calculation.fullCalcOnLoad = True
    return wb


def brand_head(ws, title, note, ncols=3):
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=ncols)
    ws.cell(1, 1, "FSA Lab").font = Font(bold=True, size=16, color=INK)
    ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=ncols)
    ws.cell(2, 1, title).font = TITLE_FONT
    ws.merge_cells(start_row=3, start_column=1, end_row=3, end_column=ncols)
    c = ws.cell(3, 1, note)
    c.alignment = WRAP
    ws.row_dimensions[3].height = 42
    ws.row_dimensions[1].height = 22
    ws.row_dimensions[2].height = 22


def hdr_row(ws, row, labels):
    for i, lab in enumerate(labels, start=1):
        c = ws.cell(row, i, lab)
        c.font = HDR_FONT
        c.fill = YELLOW
        c.border = THIN
        c.alignment = Alignment(wrap_text=True, vertical="center")


def inp(ws, ref, value, fmt=None):
    c = ws[ref]
    c.value = value
    c.protection = UNLOCKED
    c.fill = LBLUE
    c.border = THIN
    if fmt:
        c.number_format = fmt
    return c


def lab(ws, ref, value, bold=False):
    c = ws[ref]
    c.value = value
    c.border = THIN
    c.alignment = WRAP
    if bold:
        c.font = BOLD
    return c


def lock(ws):
    ws.protection.password = PWD
    ws.protection.sheet = True


def print_setup(ws, last_col="D", last_row=20):
    """Print area + fit-to-page agar rapi saat dicetak."""
    ws.print_area = f"A1:{last_col}{last_row}"
    ws.page_setup.orientation = "portrait"
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_margins.left = 0.5
    ws.page_margins.right = 0.5
    ws.page_margins.top = 0.5
    ws.page_margins.bottom = 0.5


def petunjuk_sheet(wb, lines):
    ws = wb.create_sheet("PETUNJUK")
    brand_head(ws, "Petunjuk", "Baca dulu sebelum mengisi.", ncols=1)
    r = 5
    for ln in lines:
        ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=1)
        c = ws.cell(r, 1, ln)
        c.alignment = WRAP
        # F6-R14: kolom selebar area cetak (85) + tinggi baris ikut jumlah baris wrap
        # agar tidak terpotong di tepi kanan saat print
        import math
        wrapped_lines = max(1, math.ceil(len(ln) / 78))
        ws.row_dimensions[r].height = 15 * wrapped_lines + 8
        r += 1
    ws.column_dimensions["A"].width = 85
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    print_setup(ws, "A", r)
    lock(ws)
    return ws


PETUNJUK_COMMON = [
    "Sheet INPUT: ganti angka pada sel biru muda. Sheet lain terkunci agar rumus tidak rusak.",
    "Kata sandi proteksi sheet: fsalab (bila ingin membuka kunci).",
    "Angka prefill memakai PT Cemerlang Abadi (ilustratif, Rp juta) — konsisten dengan Ratio Lab.",
    "File dibuka di Microsoft Excel, Google Sheets, atau LibreOffice. Rumus memakai fungsi klasik saja.",
]


# ---------------------------------------------------------------- Beneish
def build_beneish():
    wb = new_wb()
    petunjuk_sheet(wb, PETUNJUK_COMMON + [
        "Isi 8 variabel Beneish (DSRI s.d. TATA) dengan angka perusahaan yang dianalisis.",
        "M-score > -1,78 menandakan profil mirip manipulator (Beneish 1999). Ini skor model, bukan probabilitas — vonis butuh investigasi.",
    ])
    ws = wb.create_sheet("INPUT")
    brand_head(ws, "Kalkulator Beneish M-Score",
               "Isi kolom NILAI (sel biru muda) dengan 8 variabel Beneish. "
               "Lihat hasil di sheet OUTPUT. Desimal memakai titik.", ncols=3)
    hdr_row(ws, 5, ["Variabel", "Nilai", "Keterangan"])
    vars_ = [
        ("DSRI", 1.45, "Days sales in receivables index"),
        ("GMI", 0.97, "Gross margin index"),
        ("AQI", 1.00, "Asset quality index"),
        ("SGI", 1.30, "Sales growth index"),
        ("DEPI", 1.00, "Depreciation index"),
        ("SGAI", 1.00, "SG&A index"),
        ("LVGI", 0.96, "Leverage index"),
        ("TATA", 0.032, "Total accruals / total assets"),
    ]
    for i, (v, val, ket) in enumerate(vars_):
        r = 6 + i
        lab(ws, f"A{r}", v, bold=True)
        inp(ws, f"B{r}", val, "0.000")
        lab(ws, f"C{r}", ket)
        ws.row_dimensions[r].height = 20
    ws.merge_cells("A15:C15")
    ws["A15"] = "Ambang: M-score di atas -1,78 = likely manipulator (Beneish 1999)."
    ws["A15"].font = Font(italic=True)
    for col, w in (("A", 14), ("B", 14), ("C", 44)):
        ws.column_dimensions[col].width = w
    print_setup(ws, "C", 16)
    lock(ws)

    wo = wb.create_sheet("OUTPUT")
    brand_head(wo, "Hasil Beneish M-Score",
               "Rumus otomatis dari sheet INPUT. Sheet ini terkunci.", ncols=4)
    hdr_row(wo, 5, ["Komponen", "Koefisien", "Nilai (dari INPUT)", "Kontribusi"])
    comps = [
        ("Konstanta", -4.84, None),
        ("DSRI", 0.92, "INPUT!B6"),
        ("GMI", 0.528, "INPUT!B7"),
        ("AQI", 0.404, "INPUT!B8"),
        ("SGI", 0.892, "INPUT!B9"),
        ("DEPI", 0.115, "INPUT!B10"),
        ("SGAI", -0.172, "INPUT!B11"),
        ("LVGI", -0.327, "INPUT!B12"),
        ("TATA", 4.679, "INPUT!B13"),
    ]
    for i, (name, coef, ref) in enumerate(comps):
        r = 6 + i
        lab(wo, f"A{r}", name)
        lab(wo, f"B{r}", coef).number_format = "0.000"
        if ref:
            f = wo.cell(r, 3, f"={ref}")
            f.border = THIN
            f.number_format = "0.000"
            g = wo.cell(r, 4, f"=B{r}*C{r}")
        else:
            g = wo.cell(r, 4, f"=B{r}")
        g.border = THIN
        g.number_format = "0.0000"
    wo.merge_cells("A15:C15")
    lab(wo, "A15", "M-SCORE", bold=True).font = Font(bold=True, size=12)
    m = wo.cell(15, 4, "=SUM(D6:D14)")
    m.font = Font(bold=True, size=12)
    m.border = THIN
    m.number_format = "0.00"
    lab(wo, "A17", "Interpretasi", bold=True)
    wo.merge_cells("B17:D17")
    it = wo.cell(17, 2,
                 '=IF(D15>-1.78,"PERLU INVESTIGASI — skor di atas ambang -1,78 (skor, bukan probabilitas)",'
                 '"TIDAK TERINDIKASI — skor di bawah ambang -1,78 (tetap waspada)")')
    it.font = BOLD
    it.alignment = WRAP
    wo.row_dimensions[17].height = 30
    lab(wo, "A18", "Catatan")
    wo.merge_cells("B18:D18")
    wo.cell(18, 2, "Model Beneish 8-variabel. Ambang -1,78: di atasnya profil mirip "
                   "manipulator. Selalu padukan dengan analisis arus kas dan CALK.").alignment = WRAP
    wo.row_dimensions[18].height = 36
    for col, w in (("A", 16), ("B", 12), ("C", 18), ("D", 16)):
        wo.column_dimensions[col].width = w
    print_setup(wo, "D", 19)
    lock(wo)
    wb.active = wb["INPUT"]
    return wb, "fsa-lab-beneish-calculator.xlsx"


# ---------------------------------------------------------------- Altman
# Varian Z' (Altman 1993) untuk perusahaan privat/manufaktur non-publik.
# Koefisien: 0.717 / 0.847 / 3.107 / 0.420 / 0.998. Cut-off: 2.90 / 1.23.
# Prefill PT Cemerlang Abadi (ilustratif, privat): Z' = 2,26 (grey zone).
# BUKAN Z klasik 1968 (1.2/1.4/3.3/0.6/1.0, cut-off 2.99/1.81) — varian itu
# untuk manufaktur publik dan memakai nilai PASAR ekuitas di X4.
def build_altman():
    wb = new_wb()
    petunjuk_sheet(wb, PETUNJUK_COMMON + [
        "Isi 5 rasio Altman (X1 s.d. X5) sebagai desimal (contoh: 0,26 ditulis 0.26).",
        "Template ini memakai varian Z' (Altman 1993) untuk perusahaan PRIVAT: "
        "X4 = nilai BUKU ekuitas / total liabilitas (bukan nilai pasar).",
        "Zona Z': di atas 2,90 = SAFE; 1,23-2,90 = GREY ZONE; "
        "di bawah 1,23 = DISTRESS. BUKAN ambang Z klasik (2,99/1,81).",
    ])
    ws = wb.create_sheet("INPUT")
    brand_head(ws, "Kalkulator Altman Z'-Score (Perusahaan Privat)",
               "Isi kolom NILAI (sel biru muda) dengan 5 rasio. "
               "Lihat hasil di sheet OUTPUT. Desimal memakai titik.", ncols=3)
    hdr_row(ws, 5, ["Rasio", "Nilai", "Keterangan"])
    vars_ = [
        ("X1", 0.26, "Modal kerja / Total aset (WC/TA)"),
        ("X2", 0.18, "Laba ditahan / Total aset (RE/TA)"),
        ("X3", 0.16, "EBIT / Total aset (EBIT/TA)"),
        ("X4", 0.66, "Nilai BUKU ekuitas / Total liabilitas (BVE/TL)"),
        ("X5", 1.15, "Penjualan / Total aset (S/TA)"),
    ]
    for i, (v, val, ket) in enumerate(vars_):
        r = 6 + i
        lab(ws, f"A{r}", v, bold=True)
        inp(ws, f"B{r}", val, "0.00")
        lab(ws, f"C{r}", ket)
    ws.merge_cells("A12:C12")
    ws["A12"] = ("Prefill = PT Cemerlang Abadi 2025 (kanonis, ilustratif): "
                 "Z' = 2,26, zona grey. Varian Z' untuk perusahaan privat.")
    ws["A12"].font = Font(italic=True)
    ws["A12"].alignment = WRAP
    ws.row_dimensions[12].height = 36
    for col, w in (("A", 10), ("B", 12), ("C", 52)):
        ws.column_dimensions[col].width = w
    print_setup(ws, "C", 13)
    lock(ws)

    wo = wb.create_sheet("OUTPUT")
    brand_head(wo, "Hasil Altman Z'-Score (Perusahaan Privat)",
               "Rumus otomatis dari sheet INPUT. Sheet ini terkunci.", ncols=4)
    hdr_row(wo, 5, ["Komponen", "Koefisien", "Nilai (dari INPUT)", "Kontribusi"])
    comps = [("X1", 0.717, "INPUT!B6"), ("X2", 0.847, "INPUT!B7"),
             ("X3", 3.107, "INPUT!B8"), ("X4", 0.420, "INPUT!B9"),
             ("X5", 0.998, "INPUT!B10")]
    for i, (name, coef, ref) in enumerate(comps):
        r = 6 + i
        lab(wo, f"A{r}", name)
        lab(wo, f"B{r}", coef).number_format = "0.000"
        f = wo.cell(r, 3, f"={ref}")
        f.border = THIN
        f.number_format = "0.00"
        g = wo.cell(r, 4, f"=B{r}*C{r}")
        g.border = THIN
        g.number_format = "0.0000"
    wo.merge_cells("A11:C11")
    lab(wo, "A11", "Z'-SCORE", bold=True).font = Font(bold=True, size=12)
    z = wo.cell(11, 4, "=SUM(D6:D10)")
    z.font = Font(bold=True, size=12)
    z.border = THIN
    z.number_format = "0.00"
    lab(wo, "A13", "Zona", bold=True)
    wo.merge_cells("B13:D13")
    zn = wo.cell(13, 2,
                 '=IF(D11>2.90,"SAFE — risiko kebangkrutan rendah",'
                 'IF(D11<1.23,"DISTRESS — risiko kebangkrutan tinggi",'
                 '"GREY ZONE — waspada, butuh analisis lanjutan"))')
    zn.font = BOLD
    zn.alignment = WRAP
    wo.row_dimensions[13].height = 30
    lab(wo, "A14", "Catatan")
    wo.merge_cells("B14:D14")
    wo.cell(14, 2, "Varian Z' (Altman 1993) untuk perusahaan PRIVAT: X4 memakai "
                   "nilai BUKU ekuitas (bukan nilai pasar). Ambang 2,90 / 1,23. "
                   "BUKAN Z klasik 1968 (untuk manufaktur publik, ambang 2,99/1,81). "
                   "Skor adalah sinyal, bukan vonis.").alignment = WRAP
    wo.row_dimensions[14].height = 68
    for col, w in (("A", 14), ("B", 12), ("C", 18), ("D", 16)):
        wo.column_dimensions[col].width = w
    print_setup(wo, "D", 15)
    lock(wo)
    wb.active = wb["INPUT"]
    return wb, "fsa-lab-altman-calculator.xlsx"


# ---------------------------------------------------------------- Ratio dashboard
def build_dashboard():
    wb = new_wb()
    petunjuk_sheet(wb, PETUNJUK_COMMON + [
        "INPUT sudah terisi angka kanonis PT Cemerlang Abadi 2024–2025 (Rp juta). "
        "Ganti dengan angka perusahaan lain untuk memakai ulang template.",
        "EBITDA 2024 dan Modal diinvestasikan 2024 sengaja dikosongkan "
        "(bukan angka kanonis) — isi manual bila tersedia.",
        "Kolom 2024 memakai angka akhir tahun untuk rasio rata-rata "
        "(aset/ekuitas 2023 tidak tersedia). Kolom Perubahan = 2025 − 2024.",
        "Definisi 16 rasio mengikuti Ratio Lab.",
    ])
    ws = wb.create_sheet("INPUT")
    brand_head(ws, "Dashboard Rasio — Data Laporan",
               "Isi sel biru muda (Rp juta). Baris 'Cek' harus OK sebelum lanjut "
               "ke OUTPUT.", ncols=3)
    hdr_row(ws, 5, ["Pos laporan", "2024", "2025"])
    R = dict(pen=6, hpp=7, ebit=8, bunga=9, ni=10,
             kas=12, piut=13, pers=14, al=15, ta=16, ap=17, ll=18, tl=19, ek=20,
             ubank=22, sewa=23, ebitda=24, ic=25)
    rows = [
        ("Penjualan", 400000, 520000, R["pen"]),
        ("HPP", 264000, 338000, R["hpp"]),
        ("EBIT", 48000, 72000, R["ebit"]),
        ("Beban bunga", 10000, 14000, R["bunga"]),
        ("Laba bersih", 29640, 45240, R["ni"]),
        ("Kas", 33200, 21440, R["kas"]),
        ("Piutang usaha", 55000, 104000, R["piut"]),
        ("Persediaan", 80000, 96000, R["pers"]),
        ("Aset lancar", 168200, 221440, R["al"]),
        ("Total aset", 378200, 451440, R["ta"]),
        ("Utang usaha", 50000, 62000, R["ap"]),
        ("Liabilitas lancar", 80000, 102000, R["ll"]),
        ("Total liabilitas", 238000, 272000, R["tl"]),
        ("Total ekuitas", 140200, 179440, R["ek"]),
        ("Utang bank total", 130000, 141440, R["ubank"]),
        ("Liabilitas sewa", 58000, 60000, R["sewa"]),
        ("EBITDA", None, 102000, R["ebitda"]),
        ("Modal diinvestasikan", None, 355443, R["ic"]),
    ]
    for label, v24, v25, r in rows:
        lab(ws, f"A{r}", label)
        inp(ws, f"B{r}", v24, "#,##0")
        inp(ws, f"C{r}", v25, "#,##0")
        ws.row_dimensions[r].height = 20
    ws.merge_cells("A11:C11")
    lab(ws, "A11", "Neraca", bold=True).fill = PatternFill("solid", fgColor="E2EFDA")
    ws.merge_cells("A21:C21")
    lab(ws, "A21", "Lainnya", bold=True).fill = PatternFill("solid", fgColor="E2EFDA")
    lab(ws, "A27", "Cek: Aset = Liabilitas + Ekuitas ?", bold=True)
    for col in ("B", "C"):
        yr = col
        c = ws.cell(27, 2 if col == "B" else 3,
                    f'=IF({yr}{R["ta"]}={yr}{R["tl"]}+{yr}{R["ek"]},"OK","CEK")')
        c.font = BOLD
        c.border = THIN
        c.alignment = Alignment(horizontal="center")
    ws.merge_cells("A28:C28")
    ws["A28"] = ("Utang bank total 2024 = 30.000 + 100.000 (pendek + panjang). "
                 "Modal diinvestasikan 2025 = NOPAT / 15,8% agar konsisten dengan Ratio Lab.")
    ws["A28"].font = Font(italic=True, size=9)
    ws["A28"].alignment = WRAP
    for col, w in (("A", 34), ("B", 16), ("C", 16)):
        ws.column_dimensions[col].width = w
    print_setup(ws, "C", 29)
    lock(ws)

    wo = wb.create_sheet("OUTPUT")
    brand_head(wo, "Dashboard 16 Rasio — PT Cemerlang Abadi",
               "Rumus otomatis dari sheet INPUT. Sheet ini terkunci.", ncols=5)
    hdr_row(wo, 5, ["Rasio", "Rumus", "2024", "2025", "Perubahan"])
    I24, I25 = "INPUT!B", "INPUT!C"
    NOPAT_R = 23  # helper row di OUTPUT
    ratios = [
        # (nama, rumus tampil, fmt, f24, f25)
        ("Current Ratio (x)", "Aset lancar / Liabilitas lancar", "0.00",
         f"={I24}{R['al']}/{I24}{R['ll']}", f"={I25}{R['al']}/{I25}{R['ll']}"),
        ("Quick Ratio (x)", "(Aset lancar - Persediaan) / Liabilitas lancar", "0.00",
         f"=({I24}{R['al']}-{I24}{R['pers']})/{I24}{R['ll']}",
         f"=({I25}{R['al']}-{I25}{R['pers']})/{I25}{R['ll']}"),
        ("DSO — hari piutang", "Piutang / Penjualan x 365", "0.0",
         f"={I24}{R['piut']}/{I24}{R['pen']}*365", f"={I25}{R['piut']}/{I25}{R['pen']}*365"),
        ("DIO — hari persediaan", "Persediaan / HPP x 365", "0.0",
         f"={I24}{R['pers']}/{I24}{R['hpp']}*365", f"={I25}{R['pers']}/{I25}{R['hpp']}*365"),
        ("DPO — hari utang", "Utang usaha / HPP x 365", "0.0",
         f"={I24}{R['ap']}/{I24}{R['hpp']}*365", f"={I25}{R['ap']}/{I25}{R['hpp']}*365"),
        ("Cash Conversion Cycle (hari)", "DSO + DIO - DPO", "0.0",
         "=C8+C9-C10", "=D8+D9-D10"),
        ("Asset Turnover (x)", "Penjualan / Rata-rata total aset", "0.00",
         f"={I24}{R['pen']}/{I24}{R['ta']}",
         f"={I25}{R['pen']}/AVERAGE({I24}{R['ta']},{I25}{R['ta']})"),
        ("Debt to Equity (x)", "Total liabilitas / Ekuitas", "0.00",
         f"={I24}{R['tl']}/{I24}{R['ek']}", f"={I25}{R['tl']}/{I25}{R['ek']}"),
        ("Net Debt / EBITDA (x)", "(Utang bank + Sewa - Kas) / EBITDA", "0.00",
         f'=IFERROR(({I24}{R["ubank"]}+{I24}{R["sewa"]}-{I24}{R["kas"]})/{I24}{R["ebitda"]},"—")',
         f'=IFERROR(({I25}{R["ubank"]}+{I25}{R["sewa"]}-{I25}{R["kas"]})/{I25}{R["ebitda"]},"—")'),
        ("Interest Coverage (x)", "EBIT / Beban bunga", "0.00",
         f"={I24}{R['ebit']}/{I24}{R['bunga']}", f"={I25}{R['ebit']}/{I25}{R['bunga']}"),
        ("Gross Margin", "(Penjualan - HPP) / Penjualan", "0.0%",
         f"=({I24}{R['pen']}-{I24}{R['hpp']})/{I24}{R['pen']}",
         f"=({I25}{R['pen']}-{I25}{R['hpp']})/{I25}{R['pen']}"),
        ("Operating Margin", "EBIT / Penjualan", "0.0%",
         f"={I24}{R['ebit']}/{I24}{R['pen']}", f"={I25}{R['ebit']}/{I25}{R['pen']}"),
        ("Net Margin", "Laba bersih / Penjualan", "0.0%",
         f"={I24}{R['ni']}/{I24}{R['pen']}", f"={I25}{R['ni']}/{I25}{R['pen']}"),
        ("ROE", "Laba bersih / Rata-rata ekuitas", "0.0%",
         f"={I24}{R['ni']}/{I24}{R['ek']}",
         f"={I25}{R['ni']}/AVERAGE({I24}{R['ek']},{I25}{R['ek']})"),
        ("ROA", "Laba bersih / Rata-rata total aset", "0.0%",
         f"={I24}{R['ni']}/{I24}{R['ta']}",
         f"={I25}{R['ni']}/AVERAGE({I24}{R['ta']},{I25}{R['ta']})"),
        ("ROIC", "NOPAT / Modal diinvestasikan", "0.0%",
         f'=IFERROR(C{NOPAT_R}/{I24}{R["ic"]},"—")',
         f'=IFERROR(D{NOPAT_R}/{I25}{R["ic"]},"—")'),
    ]
    for i, (nama, rumus, fmt, f24, f25) in enumerate(ratios):
        r = 6 + i
        lab(wo, f"A{r}", nama)
        lab(wo, f"B{r}", rumus).font = Font(size=9, italic=True)
        for col, f in (("C", f24), ("D", f25)):
            c = wo.cell(r, {"C": 3, "D": 4}[col], f)
            c.border = THIN
            c.number_format = fmt
        e = wo.cell(r, 5, f'=IFERROR(D{r}-C{r},"—")')
        e.border = THIN
        e.number_format = fmt
        wo.row_dimensions[r].height = 20
    lab(wo, f"A{NOPAT_R}", "NOPAT — helper (EBIT x (1 - 22%))", bold=True)
    lab(wo, f"B{NOPAT_R}", "bukan rasio")
    for col, yr in (("C", "B"), ("D", "C")):
        c = wo.cell(NOPAT_R, {"C": 3, "D": 4}[col], f"=INPUT!{yr}{R['ebit']}*(1-0.22)")
        c.border = THIN
        c.number_format = "#,##0"
    wo.cell(NOPAT_R, 5, "—").border = THIN
    wo.row_dimensions[NOPAT_R].height = 24
    fr = NOPAT_R + 2
    wo.merge_cells(f"A{fr}:E{fr}")
    wo.cell(fr, 1, "Catatan: kolom 2024 memakai angka akhir tahun untuk rasio rata-rata "
                   "(aset/ekuitas 2023 tidak tersedia). Kolom Perubahan = 2025 − 2024 "
                   "(poin-persen untuk rasio %, hari/x untuk lainnya).").alignment = WRAP
    wo.row_dimensions[fr].height = 44
    for col, w in (("A", 30), ("B", 38), ("C", 12), ("D", 12), ("E", 12)):
        wo.column_dimensions[col].width = w
    print_setup(wo, "E", 27)
    lock(wo)
    wb.active = wb["INPUT"]
    return wb, "fsa-lab-ratio-dashboard.xlsx"


# ---------------------------------------------------------------- DCF
def build_dcf():
    wb = new_wb()
    petunjuk_sheet(wb, PETUNJUK_COMMON + [
        "FCFF historis 2024–2025 hanya konteks. Model memakai FCFF proyeksi tahun 1 "
        "di bawah (prefill 25.000 = angka ilustrasi EV kanonis).",
        "Ubah g1, WACC, dan g terminal lalu lihat EV berubah di OUTPUT.",
        "Syarat: WACC harus lebih besar dari g terminal (ada baris cek).",
    ])
    ws = wb.create_sheet("INPUT")
    brand_head(ws, "DCF Input Builder — 2 tahap",
               "Isi sel biru muda. FCFF dalam Rp juta, tingkat dalam desimal "
               "atau persen.", ncols=3)
    hdr_row(ws, 5, ["Asumsi", "Nilai", "Keterangan"])
    R = dict(fcff1=6, g1=7, n=8, wacc=9, g=10, debt=11, kas=12, saham=13,
             f24=15, f25=16)
    rows = [
        ("FCFF proyeksi tahun 1 / 2026", 25000, "#,##0", R["fcff1"],
         "ilustratif — angka ilustrasi EV kanonis"),
        ("Pertumbuhan tahap 1 (g1)", 0.08, "0.0%", R["g1"], "per tahun"),
        ("Lama tahap 1 (tahun) \u2014 TETAP", 5, "0", R["n"], "model 5 tahun tetap; sel dikunci"),
        ("WACC", 0.12, "0.0%", R["wacc"], "biaya modal rata-rata tertimbang"),
        ("Pertumbuhan terminal (g)", 0.03, "0.0%", R["g"], "harus < WACC"),
        ("Utang berbunga total", 201440, "#,##0", R["debt"], "bank 141.440 + sewa 60.000"),
        ("Kas", 21440, "#,##0", R["kas"], "akhir 2025"),
        ("Saham beredar (juta)", 100, "#,##0", R["saham"], "tidak ada dilusi"),
        ("FCFF 2024 aktual — konteks", 11800, "#,##0", R["f24"], "kanonis"),
        ("FCFF 2025 aktual — konteks", -6280, "#,##0", R["f25"], "kanonis; negatif"),
    ]
    for label, val, fmt, r, ket in rows:
        lab(ws, f"A{r}", label)
        inp(ws, f"B{r}", val, fmt)
        lab(ws, f"C{r}", ket)
        ws.row_dimensions[r].height = 20
    # F03: B8 dikunci — model 5 tahun tetap, bukan input variabel
    ws["B8"].protection = Protection(locked=True)
    ws["B8"].fill = PatternFill("solid", fgColor="D9D9D9")  # abu = terkunci
    ws.merge_cells("A14:C14")
    lab(ws, "A14", "Historis (konteks)", bold=True).fill = PatternFill("solid", fgColor="E2EFDA")
    ws.merge_cells("A17:C17")
    ws["A17"] = ("FCFF = CFO + bunga x (1 - pajak) - capex. "
                 "FCFF 2025 negatif (investasi besar) — model DCF memakai proyeksi, bukan ekstrapolasi buta.")
    ws["A17"].font = Font(italic=True, size=9)
    ws["A17"].alignment = WRAP
    ws.row_dimensions[17].height = 36
    for col, w in (("A", 34), ("B", 16), ("C", 46)):
        ws.column_dimensions[col].width = w
    print_setup(ws, "C", 18)
    lock(ws)

    wo = wb.create_sheet("OUTPUT")
    brand_head(wo, "Hasil DCF 2-Tahap — Enterprise Value",
               "Rumus otomatis dari sheet INPUT. Sheet ini terkunci.", ncols=5)
    hdr_row(wo, 5, ["Tahun", "t", "FCFF (Rp juta)", "Faktor diskonto", "PV FCFF"])
    for t in range(1, 6):
        r = 5 + t
        lab(wo, f"A{r}", 2025 + t)
        lab(wo, f"B{r}", t)
        if t == 1:
            fcff_f = "=INPUT!$B$6"
        else:
            fcff_f = f"=C{r-1}*(1+INPUT!$B$7)"
        for col, f in (("C", fcff_f),
                       ("D", f"=1/(1+INPUT!$B$9)^B{r}"),
                       ("E", f"=C{r}*D{r}")):
            c = wo.cell(r, {"C": 3, "D": 4, "E": 5}[col], f)
            c.border = THIN
            c.number_format = "#,##0" if col in "CE" else "0.0000"
    rtv = 11
    lab(wo, f"A{rtv}", "Nilai terminal (akhir thn 5)", bold=True)
    lab(wo, f"B{rtv}", "TV = FCFF6 / (WACC - g)")
    c = wo.cell(rtv, 3, "=C10*(1+INPUT!$B$10)/(INPUT!$B$9-INPUT!$B$10)")
    c.border = THIN
    c.number_format = "#,##0"
    wo.cell(rtv, 4, "—").border = THIN
    c = wo.cell(rtv, 5, f"=C{rtv}/(1+INPUT!$B$9)^$B$10")
    c.border = THIN
    c.number_format = "#,##0"
    for r, label, f in (
            (13, "ENTERPRISE VALUE (EV)", "=SUM(E6:E10)+E11"),
            (14, "Dikurangi: utang berbunga neto", "=INPUT!$B$11-INPUT!$B$12"),
            (15, "NILAI EKUITAS TERSIRAT", "=C13-C14"),
            (16, "Per saham (Rp)", "=C15/INPUT!$B$13")):
        lab(wo, f"A{r}", label, bold=True)
        wo.merge_cells(f"A{r}:B{r}")
        c = wo.cell(r, 3, f)
        c.font = BOLD
        c.border = THIN
        c.number_format = "#,##0"
        for cc in (4, 5):
            wo.cell(r, cc, "").border = THIN
    wo.merge_cells("A18:E18")
    ck = wo.cell(18, 1, '=IF(INPUT!$B$9>INPUT!$B$10,"Cek: OK — WACC > g terminal",'
                        '"Cek: ERROR — WACC harus lebih besar dari g terminal")')
    ck.font = BOLD
    ck.alignment = WRAP
    wo.merge_cells("A19:E19")
    wo.cell(19, 1, "Model 2 tahap: 5 tahun pertumbuhan tinggi (g1), lalu perpetuitas "
                   "tumbuh g. EV = jumlah PV FCFF tahap 1 + PV nilai terminal.").alignment = WRAP
    wo.row_dimensions[19].height = 36
    for col, w in (("A", 30), ("B", 26), ("C", 16), ("D", 16), ("E", 16)):
        wo.column_dimensions[col].width = w
    print_setup(wo, "E", 20)
    lock(wo)
    wb.active = wb["INPUT"]
    return wb, "fsa-lab-dcf-input-builder.xlsx"


BUILDERS = [build_beneish, build_altman, build_dashboard, build_dcf]


def check_formulas(wb):
    bad = []
    for ws in wb.worksheets:
        for row in ws.iter_rows():
            for c in row:
                if c.data_type == "f":
                    f = c.value.upper()
                    if any(fn in f for fn in MODERN_FNS):
                        bad.append(f"{ws.title}!{c.coordinate}: {c.value}")
                elif c.data_type == "s" and c.value and c.value[:1] in "=+-":
                    bad.append(f"{ws.title}!{c.coordinate}: teks diawali '{c.value[:1]}'")
    return bad


def main():
    verify = "--verify" in sys.argv
    OUTDIR.mkdir(parents=True, exist_ok=True)
    for b in BUILDERS:
        wb, name = b()
        bad = check_formulas(wb)
        if bad:
            print(f"FORMULA/TEXT CHECK FAIL {name}:")
            for x in bad:
                print("  ", x)
            sys.exit(1)
        path = OUTDIR / name
        wb.save(path)
        print(f"built {path} ({path.stat().st_size} bytes)")
    if verify:
        from verify_templates import run_verify
        sys.exit(run_verify())


if __name__ == "__main__":
    main()
