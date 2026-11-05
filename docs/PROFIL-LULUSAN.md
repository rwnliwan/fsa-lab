# PROFIL LULUSAN — FSA Lab × FMVA Sprint

**Status: LOCKED 4 Nov 2026 (Septian).** Dokumen ini adalah acceptance criteria formal
untuk semua fitur expansion. Setiap fitur baru WAJIB menunjuk mata rantai yang
diperkuat: **baca → nilai → tulis → publikasi**. Sintesis dari: 6 poin induk,
3 tambahan Septian, rekomendasi Instinct (Round 18 + catatan 4 Nov 2026).

---

## 1. Definisi lulus

**Lulus = tahu + TERBUKTI bisa.** Penyelesaian 37 modul = "tahu". "Bisa" dibuktikan
lewat **ujian baca laporan real** (blind, tanpa bantuan). Tanpa ujian, profil ini
hanyalah sertifikat kehadiran.

- **Bukti terakumulasi, bukan garansi.** Setiap ujian lulus = evidence kemampuan pada
  tugas itu; evidence menguat lewat transfer (ujian kedua pada emiten & periode berbeda
  dengan kualitas setara). Tidak ada rangkaian modul + ujian yang bisa *menjamin*
  mastery — itu sifat permanen setiap course, bukan defect.

## 2. Kemampuan lulusan (acceptance criteria)

Lulusan — tanpa bantuan — atas **satu laporan emiten IDX** (tahunan maupun interim)
mampu:

1. **Menavigasi**: menemukan pos kunci + catatan terkait di laporan.
2. **Menghitung**: rasio kunci dari angka mentah dengan benar (16 rasio non-bank;
   NIM/NPL/CAR/LDR/CASA untuk bank — Modul 30).
3. **Memverifikasi**: konsistensi internal (neraca balance, kas akhir = arus kas,
   laba ditahan nyambung). Untuk interim: paham angka **kumulatif YTD** (flow item
   standalone kuartal = H1 − Q1; stock tidak dikurangkan; rasio dihitung ulang dari
   komponen, tidak dikurangkan langsung).
4. **Menilai 3 lensa** (thesis testing): tiap pertanyaan lensa ditemani **bukti apa
   yang menguatkan dan bukti apa yang mematahkannya**. Menulis verdict 5-baris per
   lensa dengan angka pendukung.
5. **Menandai**: red flag sebagai **pertanyaan investigasi**, bukan vonis
   ("A red flag is a question. Not a conviction.").
6. **Membedakan**: fakta vs interpretasi; angka terverifikasi vs ilustratif;
   periode, satuan, mata uang, basis (konsolidasi vs induk).

### Mekanik kuartalan (konten baru, wajib)
- Annualisasi = konvensi, bukan ×4 sembarangan; hati-hati seasonality.
- Rasio memakai denominator rata-rata (NIM = rata-rata earning assets).
- Interim unaudited → bobot lebih ke konsistensi internal, bukan jangkar terverifikasi.

## 3. Arsitektur guided → latihan → ujian

**Satu format, satu rubrik** — template output dan rubrik inti sama; kriteria
sektor-spesifik menyesuaikan (bank dinilai dari kualitas aset/permodalan/pendanaan/NIM,
bukan rasio identik dengan non-bank).

1. **Guided**: Bedah Filing SOCI (sudah ada) — walkthrough 12-stop dengan angka
   terverifikasi + referensi halaman.
2. **Latihan**: Bedah Sendiri — format sama, emiten berbeda, benchmark terverifikasi
   builder (angka dicek ke filing, metode SOCI).
3. **Ujian**: blind, filing belum pernah dipelajari.

### Contamination rule (wajib)
- Ujian menguji baca **unaided** atas filing yang unfamiliar.
- Latihan WAJIB pakai **bank/periode berbeda** dari filing ujian.
- **Jangan buka Real Case 6 (BBCA) FMVA Sprint sebelum ujian BBCA.** Kalau terlanjur
  dipelajari dulu, labeli "coached capstone", bukan blind exam — lalu pakai emiten
  + periode baru untuk transfer check.

### Ujian kanonis
**BBCA interim H1 2026** (terverifikasi Instinct 4 Nov 2026: surat 018/ATX/2026,
"Laporan Keuangan Interim Yang Tidak Diaudit", 6 bulan berakhir 30 Jun 2026,
diserahkan 28 Jul 2026; kumulatif YTD; ada versi Inggris → bonus latihan Inggris).

## 4. Thesis testing (pola desain site-wide)

Kata "sensitivity" dicadangkan untuk makna standar finance (mengubah asumsi melihat
perubahan output). Pola kita bernama **thesis testing**: setiap pertanyaan lensa
wajib ditemani "bukti penguat / bukti pematah". Ini yang dilatih — bukan hafalan rasio.

## 5. Output profesional (north star)

| Tier | Artefak | Mesin |
|------|---------|-------|
| FSA | Credit memo, analyst note, red-flag memo — tiap output wajib paket lengkap: contoh real case + guided + cara buat + hal penting + batasan + checklist unsur wajib | Upgrade Credit Memo Builder (reuse, bukan build baru) |
| FMVA | Model 3-statement + valuasi → target price. **Metode mengikuti jenis emiten**: non-bank = DCF; bank = DDM/residual income/P-BV (bukan DCF industri) | Audit kelengkapan modul (cara → contoh → latihan real case) |
| Gabungan | **Equity research report**: tesis + bukti bersumber + konteks valuasi + risiko + apa yang mematahkan tesis + kesimpulan actionable. Wajib: as-of date, horizon, currency/unit, per-share basis (saham beredar), scenario range | Research Note Builder (baru, di FSA Lab) |

**Publikasi = validasi belajar.** Target: research note yang layak dilampirkan ke
lamaran dan lolos review editorial (Seeking Alpha ada gate; kelayakan ticker IDX
dicek saat submit, bukan diasumsikan). Kanal terbuka (LinkedIn, komunitas lokal)
tanpa gate = bukan bukti kualitas dengan sendirinya. Publikasi = bukti portofolio
yang compounding dengan lamaran kerja, bukan bukti employability atau income plan.
Identitas: **analis ritel independen**.

## 6. Case library (tulang punggung bersama)

Setiap case di-tag: **sektor × level (mudah/menengah/sulit) × tipe
(guided/blind/fraud/impostor)**. Sektor beda sifat keuangannya (bank vs konsumer
vs tambang). Mekanik **impostor** dipakai ulang (pola terbukti milik Septian).
Label level dikalibrasi via pilot, bukan ditempel.

## 7. Batasan = backlog (bukan prasasti)

| # | Batasan lama | Cara mematahkan |
|---|--------------|-----------------|
| a | Annual-centric | Konten mekanik kuartalan (§2) |
| b | Bukan valuasi | Link FMVA dua arah; metode mengikuti emiten (§5) |
| c | Bukan fluency | Repetisi Bedah Sendiri; fluency terbuka (repetisi mengecilkan, tak pernah "selesai") |
| d | Bukan exam-prep | **Support, bukan program**: mapping topik → CFA L1 readings (CFA = 3 level; kurikulum kita overlap sebagian L1) |

## 8. Penempatan build (LOCKED 4 Nov 2026)

- **FSA Lab (extension)**: research craft & publikasi, real-filing bank practice,
  sector track + case library.
- **learn-platform (sudah ada)**: finance data pipeline (Python/SQL: tarik data
  IDX/EDGAR XBRL, bersihkan, otomatisasi rasio; script vs spreadsheet harus cocok).
- **FMVA Sprint**: audit kelengkapan + link dua arah. Tanpa konten web baru.
- **Web baru (satu, terakhir)**: **Analis Kredit Profesional** — disiplin tersendiri,
  target job #1, brand mandiri untuk portofolio. Dibangun setelah extension FSA
  membuktikan pola; isi ngelink, bukan duplikat.

## 9. Sequence build (usulan)

1. Spec ini (selesai).
2. Audit kelengkapan FMVA.
3. Konten mekanik kuartalan (FSA).
4. Bedah Sendiri non-bank (format latihan).
5. Bank practice real-filing (bank ≠ exam) + benchmark terverifikasi.
6. Infrastruktur ujian + benchmark BBCA H1 2026 terverifikasi.
7. Research Note Builder.
8. Sector track + case library matrix.
9. Data pipeline (learn-platform).
10. Web Analis Kredit Profesional.

**Aturan produksi**: analisis & desain dulu, baru produce. Setiap angka perusahaan:
verifikasi tahun + periode + sumber; tak terverifikasi → label "ilustratif" PROMINENT.
