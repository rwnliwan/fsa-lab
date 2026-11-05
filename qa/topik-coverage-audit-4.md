# Audit Cakupan Topik FSA Lab — Ronde 4 (pasca Phase 8)

Tanggal: 3 Nov 2026. Metode: baca js/modul29–33.js, lede modul-29–33/index.html,
workbench/fsa_toolkit.py (fungsi baru: covenant_break, dcf_inputs), memo-kredit/,
komparator/, risk-map/. Aturan ketat SAMA: COVERED = diajarkan eksplisit dengan
contoh/angka; PARTIAL = disinggung; MISSING = tidak ada bukti.

## Ringkasan

- **67/67 topik inti TETAP COVERED** (tidak ada regresi — 21/21 suite QA lulus)
- **Topik BARU dari Phase 8 (di luar peta 67):**
  | Topik | Status | Bukti |
  |---|---|---|
  | Hedge accounting PSAK 109/IFRS 9 | COVERED | M29: 3 jenis hedge, syarat kualifikasi, ineffectiveness 400 → P&L |
  | Efektivitas hedge 80–125% | COVERED | M29: contoh 92,0% dalam koridor |
  | CAMELS bank analysis | COVERED | M30: 6 komponen + 14 baris explorer (bank ilustratif) |
  | NIM / CAR / NPL / coverage / CASA / LDR / CIR | COVERED | M30: dihitung ulang (LDR 88,2%, CAR 22,1%, coverage 145%) |
  | Stage 1/2/3 migration | COVERED | M30: S1 52.000 / S2 5.500 / S3 2.500 |
  | Restructured loans | COVERED | M30: dibedakan dari NPL |
  | 3-statement modeling | COVERED | M31: forecast 2026 artikulasi penuh (NI 53.695, A=L+E) |
  | Revenue drivers / debt schedule | COVERED | M31: 6 building blocks |
  | Circularity bunga | COVERED | M31: konsep + perlakuan (utang flat, tanpa iterasi) |
  | SAK EP / SAK EMKM | COVERED | M32: peta regime + threshold + dampak comparability |
  | Rekonsiliasi fiskal | COVERED | M32: PKP 56.000, PPh terutang 12.320 (Python) |
  | PPh Final / 21 / 23 / 25 / 29 | COVERED | M32: alur + sumber UU |
  | Sengketa pajak | COVERED | M32: keberatan→banding→PK + PSAK 237 |
  | Rating methodology | COVERED | M33: matriks business×financial, skala PEFINDO idAAA–idD |
  | Merton/KMV | COVERED | M33: ekuitas = call option, buffer 40% ilustratif |
  | PKPU / restructuring | COVERED | M33: UU 37/2004, waterfall recovery 40% |
  | Project finance (DSCR/LLCR/waterfall) | COVERED | M33: DSCR 1,35x, LLCR 1,30x |
- **Fitur baru:** Covenant Break Predictor (workbench), Credit Memo Builder (memo-kredit/),
  DCF Input Builder (workbench, EV=277.778 cocok kanonis), Multiples Comparator (komparator/),
  Indonesia Risk Map v1 (risk-map/, 10×7 statis + metodologi).
- **Lens balance:** credit (M30, M33, covenant, memo) + investment (M31, DCF, comparator)
  kini sejajar forensic. Guard: qa-round8.py G7.
