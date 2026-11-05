# Workstream C — Bukti verifikasi template Excel (3 Nov 2026)

Metode (aturan xlsx SEVERE):
1. `wb.calculation.fullCalcOnLoad = True` diset generator SEBELUM save.
2. Forced recalc: salin file → LibreOffice headless `--convert-to ods`
   (build LO ini TIDAK bisa menulis xlsx — `impl_store` 0x81a gagal untuk
   SEMUA file xlsx, termasuk file trivial; ods = jalur recalc yang jalan).
3. Nilai cached hasil recalc engine LO dibaca dari `content.xml` (.ods)
   via `tools/verify_templates.py::ods_values` (stdlib; tangani
   `covered-table-cell`, `percentage`, `number-columns-repeated`).
4. Dibandingkan dengan hitungan Python independen (rumus ditulis ulang,
   bukan salinan string formula generator).

Perintah: `python3 tools/gen_download_templates.py --verify` → **LULUS** (semua PASS).

## Bug yang tertangkap verifikasi (bukan lolos)
- `build_beneish`: OUTPUT memetakan TATA→INPUT!B12 / LVGI→INPUT!B13 padahal
  INPUT menaruh LVGI di B12, TATA di B13. Recalc LO memberi M = 2,99
  (salah), Python independen -1,65 → KETAHUAN. Fix: urutan comps disamakan
  dengan INPUT. Pelajaran: untuk tiap file, assert pemetaan ref sel
  INPUT→OUTPUT, bukan cuma nilai akhir.

## Angka uji vs ekspektasi (nilai recalc LO)
| File | Uji | Recalc LO | Python independen |
|---|---|---|---|
| beneish | M-score (DSRI 1,45 … TATA 0,032) | -1,6514 | -1,6514 |
| beneish | interpretasi | MANIPULATOR LIKELY — skor di atas ambang -1,78 | sama (string exact) |
| altman | Z (0,26/0,18/0,16/0,66/1,15) | 2,638 | 2,638 |
| altman | zona | GREY ZONE — waspada, butuh analisis lanjutan | sama (string exact) |
| dashboard | CR 2025 / 2024 | 2,1710 / 2,1025 | sama |
| dashboard | DSO 2025 / DIO 2025 / DPO 2025 / CCC 2025 | 73,0 / 103,67 / 66,95 / 109,72 | sama |
| dashboard | GM 2025 / OM 2025 / NM 2025 | 35,0% / 13,85% / 8,70% | sama |
| dashboard | ROE 2025 / ROA 2025 / ROIC 2025 | 28,31% / 10,91% / 15,80% | sama |
| dashboard | ND/EBITDA 2025 / D-E 2025 / Coverage 2025 | 1,7647 / 1,5158 / 5,1429 | sama |
| dashboard | NDE 2024 / ROIC 2024 (input kosong) | "—" (IFERROR) | "—" |
| dashboard | varian EBITDA24=74000, IC24=300000 | NDE 2,0919 / ROIC 12,48% | sama |
| dashboard | cek neraca 2024 & 2025 | OK / OK | OK / OK |
| dcf | EV (FCFF1 25.000, g1 8%, 5 thn, WACC 12%, g 3%) | 324.786,3 | 324.786,3 |
| dcf | TV / PV TV | 389.251,0 / 220.871,5 | sama |
| dcf | ekuitas tersirat / per saham | 144.786,3 / Rp1.447,9 | sama |
| dcf | cek WACC > g | "Cek: OK — WACC > g terminal" | sama |

## Cek SEVERE lain (otomatis di generator, gagal = build ditolak)
- Fungsi modern (_xlfn.): tidak ada — semua rumus klasik
  (IF/SUM/AVERAGE/IFERROR/POWER tidak dipakai; hanya IF, SUM, AVERAGE, IFERROR, operator ^).
- Sel teks diawali `=`/`+`/`-`: tidak ada (guard `check_formulas`).
- Proteksi: sheet OUTPUT & INPUT & PETUNJUK diproteksi, password `fsalab`;
  sel input di INPUT unlocked.

## File
- downloads/templates/fsa-lab-beneish-calculator.xlsx (8.427 bytes)
- downloads/templates/fsa-lab-altman-calculator.xlsx (8.270 bytes)
- downloads/templates/fsa-lab-ratio-dashboard.xlsx (9.615 bytes)
- downloads/templates/fsa-lab-dcf-input-builder.xlsx (8.875 bytes)
- Generator permanen: tools/gen_download_templates.py (+ tools/verify_templates.py)
