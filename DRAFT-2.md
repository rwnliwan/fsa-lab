# DRAFT 2 — Web Financial Statement Analysis (FSA)

Tanggal: 3 Nov 2026. Status: desain dikunci, diskusi materi berjalan.

Mewarisi seluruh Draft 1 + keputusan baru di bawah. (Draft 1: ~/workspace/fsa-web/DRAFT-1.md)

## Keputusan baru (3 Nov, dikunci Septian)
- **3 lensa**: kredit + ekuitas + **forensik** (lensa 3 = leverage background fraud Septian).
- Semua ide tambahan MASUK.

## Fitur terkunci (final) — SEMUA Part 14 peta Instinct diadopsi penuh (keputusan 3 Nov)
1. Case-first: laporan asli emiten IDX + pertanyaan tajam; teori = alat jawab.
2. Forensik skandal per topik (Garuda–Mahata, Enron, Wirecard, Luckin, Jiwasraya, SNP Finance, Indosurya).
3. Toggle PSAK/IFRS vs US GAAP (14.5).
4. Triple lens per case → credit memo + equity note + forensic memo; jurnal analis per perusahaan (14.1).
5. Sudut PSAK per lesson (nomor BARU + nomor lama dalam kurung).
6. Statement explorer interaktif (klik pos → penjelasan + acuan PSAK + cara manipulasi).
7. Statement-linking playground: prediksi efek transaksi ke 3 laporan (14.2) — mekanik fondasi, digate.
8. Ratio lab: formula → ambil input dari laporan asli → banding 5 tahun + 2 peer → twist "bagaimana rasio ini
   dibuat bagus tanpa bisnis membaik?" (14.3).
9. Kalkulator rasio + Altman Z-score + Beneish M-score + Dechow F-score.
10. Manipulation simulator "cooked books": laporan asli dimasak app, kamu cari manipulasinya (14.4).
11. Case files: "flag or pass?" per tahun pre-collapse, skor = seberapa dini kamu flag (14.6, gabung time-travel).
12. Python workbench: sel kode per modul — tarik EDGAR XBRL / IDX, hitung rasio, Benford/M-score; deliverable =
    1 script per modul ke toolkit repo = portofolio (14.7).
13. Spaced repetition ringan: quiz selingi topik lama di modul baru (14.8).
14. Weekly analyst note 300–500 kata, versi EN+ID berdampingan (14.9) — melatih English writing.
15. Bank jawaban interview per topik.
16. Desain retro (landing/hero/kartu) + tipografi disiplin body; standalone site; narasi ID + istilah EN.
17. 14.10 dipatuhi: TANPA badges/leaderboard/streak/social/video-first.

## Kurikulum: FULL 60+ topik (keputusan Septian 3 Nov — lengkap, tidak dipadatkan)
Peta Instinct = kurikulumnya langsung (Parts 2–13 = modul). Ini proyek waktu luang —
makin luas makin dalam perspektifnya. Phase mengikuti Part 15 peta:
- Phase 1 (mekanik inti): Part 2 (semua), 3.1–3.3, 3.5, 4.1–4.3, 5.1–5.3, 6.1–6.3, 7.1–7.2, 8.1–8.3, 12.10
- Phase 2 (judgment): 3.4, 3.6, 4.4–4.6, 5.4–5.6, 6.4–6.5, 7.3–7.5, 8.4, 9.1–9.4, 10.1–10.3, 12.2–12.8
- Phase 3 (spesialis): 8.5–8.6, 9.5, 10.4–10.7, 11.1–11.4
- Paralel selalu jalan: 1 emiten IDX + 1 peer US per minggu; weekly analyst note; FMVA
- Hard gate: AKTIF (keputusan Septian) — lulus 80%+ untuk buka phase/modul berikutnya.
- Priority tags CORE/INTERMEDIATE/ADVANCED = skill tree + syarat buka modul.

## Kurikulum lama (18 lesson) — DIBATALKAN, diganti full map di atas
### Fondasi (L1–L3)
1. Kerangka analisis laporan keuangan (proses 4 langkah, tujuan analis)
2. Mekanisme pelaporan (siklus akuntansi, akrual vs kas)
3. Standar: IFRS vs US GAAP vs PSAK (kerangka konseptual, karakteristik kualitatif)
### Tiga laporan (L4–L6)
4. Income statement (pengakuan pendapatan PSAK 72/IFRS 15 — 5 langkah; EPS)
5. Balance sheet (klasifikasi, ekuitas)
6. Cash flow statement (langsung vs tidak langsung; klasifikasi bunga/dividen IFRS vs GAAP)
### Teknik & pos kunci (L7–L11)
7. Teknik analisis: rasio lengkap + common-size + DuPont
8. Inventories (FIFO/LIFO/average; NRV; write-down)
9. Long-lived assets (kapitalisasi vs beban; depresiasi; revaluasi; impairment & reversal)
10. Income taxes (pajak tangguh DTA/DTL; tarif efektif)
11. Liabilitas jangka panjang & sewa (obligasi; PSAK 73/IFRS 16 deep dive)
### Kualitas & aplikasi (L12–L13)
12. Kualitas pelaporan keuangan (red flags, akrual agresif, Beneish M-score)
13. Aplikasi: analisis kredit & ekuitas (Altman Z-score, studi kasus integratif)
### Lanjutan — setara CFA L2 (L14–L18)
14. Intercorporate investments (IFRS 9/PSAK 71: amortized cost, FVOCI, FVPL; metode ekuitas; konsolidasi)
15. Employee compensation (imbalan pascakerja IAS 19/PSAK 24; share-based payment)
16. Multinational operations (translasi valas: temporal vs current rate; PSAK 10/IAS 21)
17. Analisis institusi keuangan (bank: NIM, CAR, NPL — jembatan ke target credit risk)
18. Evaluasi kualitas laporan lanjut + case integratif triple-lens penuh

## Tech stack (keputusan 3 Nov)
- Frontend: static site di Cloudflare Pages (pola terbukti FMVA Sprint). Vanilla HTML/CSS/JS.
- Database: **D1** (tabel baru di worker progress-hub yang sudah ada) untuk jurnal analis, notes,
  progress, spaced-repetition state. **TIDAK perlu Turso** (solo learner, traffic kecil — D1 cukup,
  dan menghindari risiko row-read limit). localStorage = mirror offline + export/import JSON
  sebagai backup manual (mengikuti aturan safety net Septian).
- **TIDAK perlu R2**: aset visual = SVG inline + CSS (grain via feTurbulence, sunset stripes via
  gradient). Semua self-contained, Rp0, cepat.
- Ikon: **Lucide (MIT, SVG inline)** — gratis, konsisten, tanpa request eksternal.

## Gelombang build
- **Gelombang 2: VERTICAL SLICE Modul 1** (keputusan 3 Nov): satu modul Phase 1 LENGKAP
  (statement explorer + statement-linking playground + ratio lab + case triple-lens + jurnal +
  quiz + hard gate) → Septian nilai pengalaman belajarnya sebelum gas 60 topik.
- **Gelombang 3 (berjalan)**: Modul 2 "Kualitas Laba & Arus Kas" (skeleton sama) + halaman interaktif
  **Toggle PSAK/IFRS vs US GAAP** (5 topik: LIFO, reversal impairment, kapitalisasi R&D, revaluasi,
  klasifikasi CFO) → side-by-side recompute.
- **Gelombang 4 (berjalan)**: Cooked Books Simulator (3 skenario manipulasi) + Case Files
  (Garuda & Enron, flag-or-pass) + Python Workbench (toolkit M-score/DSO/Benford + download .py).
Nama kerja proyek: "FSA Lab" (bisa diganti Septian).
## Referensi konten: peta Instinct (3 Nov 2026)
File: `~/workspace/user/files/financial-statement-analysis-topic-map-11eba1d5.md.txt`.
Vonis induk: BAGUS — diadopsi sebagai **kurikulum penuh** (Parts 2–13 = modul, 60+ topik, 3 phase).
Yang diadopsi: Part 12 (beda PSAK vs US GAAP), Part 13 (catatan Indonesia), 14.4 manipulation
simulator, 14.6 case files (gabung time-travel), 14.9 weekly analyst note EN+ID, priority tags →
skill tree, 14.10 (no badges/leaderboard). Hard gate AKTIF (keputusan Septian 3 Nov).

## KOREKSI NOMOR PSAK (terverifikasi 3 Nov via IAI/konsultanku/updatesak)
Induk sempat pakai nomor LAMA. DSAK IAI menomori ulang PSAK/ISAK efektif **1 Jan 2024**
(diputuskan 12 Des 2022): digit 1=IFRS, 2=IAS/SIC, 3=lokal, 4=syariah. Pemetaan baru:
- 115 = IFRS 15 (pendapatan; dulu PSAK 72)
- 116 = IFRS 16 (sewa; dulu PSAK 73)
- 109 = IFRS 9 (instrumen keuangan; dulu PSAK 71)
- 219 = IAS 19 (imbalan kerja; dulu PSAK 24)
- 221 = IAS 21 (valas; dulu PSAK 10)
- 233 = IAS 33 (laba per saham; dulu PSAK 56)
- 201 = penyajian (dulu PSAK 1); 202 = persediaan (dulu 14); 207 = arus kas (dulu 2)
- 208 = kebijakan akuntansi (dulu 25); 212 = pajak (dulu 46); 216 = aset tetap (dulu 16)
- 236 = penurunan nilai (dulu 48); 240 = properti investasi (dulu 13); 108 = segmen (dulu 5)
- 118 = IFRS 18 (efektif 1 Jan 2027: subtotal laba operasi wajib + disiplin MPM)
- 338 = kombinasi bisnis sepengendali (dulu PSAK 38); 370 = tax amnesty (dulu PSAK 70)
- 4xx = syariah (401=penyajian syariah ... 459=perbankan syariah)
Substansi TIDAK berubah — hanya nomor. Di web: pakai nomor BARU + sebut nomor lama dalam kurung
sekali saat pertama muncul (pembaca laporan lama butuh jembatan ini).
Concern Septian: takut tidak bisa membedakan versi Indo vs global → fleksibilitas role.
- Komponen berulang **"Spotlight: Beda IFRS vs US GAAP"** di lesson 3, 6, 8, 9, 11, 14, 16.
- Halaman referensi **tabel perbandingan** + **pemetaan PSAK↔IFRS nomor BARU** (109=IFRS 9, 115=IFRS 15, 116=IFRS 16, 219=IAS 19, 221=IAS 21, 118=IFRS 18).
- Quiz khusus menguji perbedaan standar (bukan hafalan definisi).
- Beda utama yang dicakup: LIFO (dilarang IFRS), reversal impairment (boleh IFRS kecuali goodwill), kapitalisasi development cost, revaluasi PPE, klasifikasi bunga/dividen di arus kas, ambang "probable" liabilitas kontinjensi, investment property fair value, biological assets.

- **Gelombang 5 (SELESAI 3 Nov)**: Modul 3 'Seberapa Cuan?' (Part 4.1–4.3: margin, ROA/ROE/ROIC, DuPont, common-size) — PT Cemerlang Abadi; playground tebak-arah-rasio 6 kartu (/12); QA wave5 LULUS.

- **Gelombang 6 (SELESAI 3 Nov)**: Modul 4 'Kasnya Nyangkut di Mana?' (Part 7.1–7.2: DSO 73,0/DIO 103,7/DPO 67,0/CCC 109,7, WC 119.440) + Modul 5 'Aman dari Utang?' (Part 8.1–8.3: CR 2,17/QR 1,23/D/E 1,52/coverage 5,14x/ND-EBITDA 1,76x) — QA wave6 LULUS; 8 suite QA SEMUA LULUS.

- **Gelombang 7 (SELESAI 3 Nov)**: Modul 6 'Kas Bebasnya Berapa?' (Part 6.1–6.2: FCFF −17.200/FCFE −16.680/FCFF margin −3,3%/capex intensity 9,2%) — **Phase 1 TUNTAS (M1–M6)**. QA wave7 LULUS.

- **Gelombang 8 (SELESAI 3 Nov, ~17:05)**: Phase 2 + Phase 3 LENGKAP — 12 modul baru (M7–M18), dibangun 3 builder paralel dari CANONICAL-DATA.md tunggal.
  Phase 2: M7 Catatan & Audit, M8 DuPont & Segmen, M9 Kualitas Pendapatan & EPS, M10 Arus Investasi/Pendanaan, M11 Piutang & Persediaan (ECL), M12 Aset Tetap & Impairment, M13 Triangle & Beneish, M14 PSAK vs GAAP, M15 Altman Z-Score (2,64 grey zone).
  Phase 3: M16 Instrumen Keuangan & ECL 3 Stage, M17 Forensik Lanjutan (Sloan 3,2%), M18 Forecasting & Valuasi (tutup kurikulum).
  QA: wave8a/b/c LULUS + 9 suite lama regresi LULUS (total 12 suite). Verifikasi silang induk: gate chain M6→M18, konsistensi ECL/Beneish/Sloan/Z antar-modul. Deploy live 200 semua.

- **Ronde 5 (SELESAI 3 Nov, ~18:3x)**: fix 5 must-fix + 4 should-fix review Instinct ronde 4 (9,0/10). Enron CFO → 1,6/1,2/4,8 (verifikasi 10-K langsung); Garuda → rugi restatement 175,0; FCFF/FCFE dihitung ulang dengan benar (FCFF 2025 (6.280), FCFE (5.760), 2024 +4.000); bridge M18 → nilai ekuitas 97.778; label utang Enron M17 diperbaiki; 60 quiz M7–M18 di-shuffle. 12 suite QA LULUS, deploy live terverifikasi.

- **Phase 4+5+6 + fitur (SELESAI 3 Nov, ~19:0x, ACC Septian "Gas")**: 6 modul baru (M19 filing/EDGAR-IDX, M20 goodwill, M21 framework+provisi, M22 tunneling, M23 covenant, M24 multiples) + case files 6 kasus + toggle 8 topik + interview bank 18 Q&A + spaced repetition (120 soal) + analyst note dwibahasa + simulator 6 kasus + workbench XBRL. 17/17 suite QA LULUS, deploy live terverifikasi (14 halaman 200). Changelog: ~/workspace/your_files/fsa-lab-changelog-phase456.md.

- **Verifikasi pra-review (SELESAI 3 Nov malam)**: 3 worker independen — WS-A verifikasi angka 4 case baru ke sumber (3 fakta salah diperbaiki: FT Wirecard 2019, Jiwasraya 802M Nov 2018 + 5 tersangka, MA Indosurya 16 Mei 2023); WS-B re-audit 67 topik → 67/67 COVERED (10.7/11.4 ditutup via 4 tool workbench baru); WS-C quality read M19-M24 (3 FATAL: kunci M20/M21 + angka M23). 18/18 QA LULUS (qa-round6.py baru). Deploy live terverifikasi. SIAP untuk review Instinct.
