# Audit Cakupan Topik FSA Lab — Ronde 3 (pasca Phase 7)

Tanggal: 3 Nov 2026. Metode: baca js/modul25–28.js, lede modul-25–28/index.html,
konverter/konverter.js, glosarium/glosarium.js (167 istilah), spot-fraud/spot-fraud.js,
theater/theater.js, workbench/fsa_toolkit.py (fungsi baru: piotroski, altman, footnote_diff).
Aturan ketat SAMA: COVERED = diajarkan eksplisit dengan contoh/angka; PARTIAL = disinggung;
MISSING = tidak ada bukti.

## Ringkasan

- **67/67 topik inti TETAP COVERED** (tidak ada regresi — 18/18 suite QA lulus)
- **Topik BARU dari Phase 7 (di luar peta 67):**
  | Topik | Status | Bukti |
  |---|---|---|
  | Piotroski F-score (9 tes) | COVERED | M25: hitung 8/9 untuk Cemerlang (angka kanonis); workbench piotroski() |
  | Altman Z/Z'/Z" interaktif | COVERED | M25: kalkulator + Z=2,64 cocok kanonis; workbench altman() |
  | Dechow F-score | COVERED | M25: konsep + rumus + contoh ilustratif |
  | Jones / Modified Jones | COVERED | M25: discretionary accruals + contoh ilustratif |
  | Ohlson O-score | COVERED | M25: 9 variabel + contoh ilustratif |
  | Akuntansi syariah PSAK 401–4xx | COVERED | M26: 401, 402 murabahah, mudharabah, musyarakah, ijarah, sukuk, 409 zakat |
  | Laporan bank syariah | COVERED | M26: pos khas (Dana Syirkah Temporer) |
  | Sharia screening | COVERED | M26: rasio utang/pendapatan non-halal |
  | Share-based payment PSAK 102 | COVERED | M27: ESOP/MSOP, vesting, diluted EPS 430,9 ilustratif |
  | POJK 51 sustainability | COVERED | M27: RAKB + laporan keberlanjutan |
  | IFRS S1/S2 | COVERED | M27: status adopsi sebagai perkembangan |
  | Analisis tekstual MD&A | COVERED | M28: tone, boilerplate, readability |
  | Verifikasi short-seller report | COVERED | M28: metodologi 5 langkah |
  | Footnote deep-dive | COVERED | M28: peta baca 5 langkah + workbench footnote_diff() |
  | Benford untuk jurnal | COVERED | M28: kapan valid/tidak + workbench benford_test |
- **Fitur baru:** konverter nomor PSAK (55 mapping), glosarium 167 istilah, Spot the Fraud (3 kasus),
  Case Forensics Theater (Garuda 2016–2019, fakta terverifikasi filing), Footnote Diff Tool.
- **Catatan minor:** ROA Piotroski M25 pakai TA akhir periode (10,0%) vs kanonis 10,9% (rata-rata) —
  konsisten internal modul, bukan inkonsistensi kanonis. Konverter memuat catatan kejujuran
  untuk nomor arsip yang dicabut (40/41, 28/36, 34, 38, 55).
