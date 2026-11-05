# QA Plan — FSA Lab (self-learning loop)

Aturan Septian (3 Nov 2026): QA + self-learning loop berlaku sejak Gelombang 1.
Tiap gelombang: QA script permanen di `qa/` + regression sweep sebelum vonis "selesai".
Koreksi pola → `~/workspace/custom-skills/local-self-learning-loops/references/corrections.md`.

## Koreksi Round 13 (3 Nov 2026, fix review ronde 7, 9.3/10)
- **STALE SECOND COPY — ATURAN PERMANEN (pelajaran ronde 13)**: 3 ronde fix terakhir SEMUA meninggalkan angka lama di "second copy" — teks HTML/prose/model answer/journal prompt/exemplar/fact box masih angka lama padahal JS/tabel sudah benar (kasus: M32 56.000/12.320/440 di hero+blurb+factbox+model answer padahal tabel 52.000/11.440/1.320; weekly note example 1 vs kanonis). ATURAN: SETIAP perubahan angka WAJIB (1) didaftar sebagai pasangan (lama→baru), (2) grep angka lama di SELURUH *.html + *.js sebelum selesai, (3) assert prose-vs-logic (angka HTML == angka JS), (4) sweep khusus model answer/journal prompt/exemplar/fact box. Guard permanen: qa-round13.py (G1 stale sweep M32, G2 weekly note, G3 prose-vs-logic, G4 model-answer sweep; negative test: semua pola lama terdeteksi di teks pre-fix, tanpa false positive di "11.440"/"141.440" via boundary-aware regex).
- **Sweep kunci by teks, bukan posisi (pelajaran ronde 13)**: shuffle opsi review bank membuat sweep posisi-based (round6) FAIL palsu padahal kunci benar. Aturan: sweep kunci bank WAJIB bandingkan TEKS opsi kunci, bukan indeks posisi. qa-round6.py V4 diupdate (175/175 by teks).
- **Ekspektasi usang round8 (pelajaran ronde 13)**: qa-round8.py masih expect PKP 56.000 (angka pre-fix). Aturan: tiap perubahan angka, grep SEMUA suite untuk ekspektasi hardcode angka itu.
- **Arah DTA vs "pajak ditunda" (pelajaran ronde 13)**: reversal DTA (pajak dibayar di muka, kini dikurangkan) BUKAN penundaan pajak — ETR fiskal < ETR akuntansi karena prepayment masa lalu, bukan deferral. Wording "menunda pajak"/"pajak DITUNDA" untuk kasus reversal = salah arah. Guard: qa-round13.py G1 (0 kemunculan).
- **Weekly note vs kanonis (pelajaran ronde 13)**: worked example di halaman practice WAJIB recompute dari CANONICAL-DATA.md, bukan angka dari kepala. Guard: qa-round13.py G2.
- **Altman: warning kondisional = warning mati (pelajaran ronde 13)**: warning "bukan varian resmi" yang hanya muncul pada hasil ≈2,64 hilang saat user ubah input. Aturan: warning model non-resmi WAJIB permanen (tampil untuk input apapun). Guard: qa-round13.py G5.
- **Ineffectiveness vs net P&L (pelajaran ronde 13)**: pada cash-flow hedge under-hedge, lower-of → ineffectiveness = 0; angka net P&L setelah FX utang + recycling adalah ukuran BERBEDA. Soal WAJIB state ukuran mana yang ditanya + journal bridge. Guard: qa-round13.py G6.
- **SOCI: benefit vs beban (pelajaran ronde 13)**: deferred tax benefit WAJIB tampil sebagai (22.998), bukan dijumlah sebagai beban. Guard: qa-round13.py G7.

## Koreksi Round 11 (3 Nov 2026, fix review ronde 6, 9.1/10)
- **Rekonsiliasi fiskal: recognition > arithmetic (pelajaran ronde 11)**: M32 arithmetic foot (12.760) tapi recognition salah — DTA fiktif dari "beda waktu lain" di luar rekonsiliasi sendiri. Aturan: tiap komponen DTA/DTL WAJIB traceable ke baris rekonsiliasi; beda tetap netral (final income) lebih bersih daripada DTA imajiner. Guard: qa-round11.py G1 (ETR=22,0% + PKP 52.000 + no "beda waktu lain").
- **Basis laba Garuda: total vs pemilik (pelajaran ronde 11)**: verifikasi filing round-3 memakai angka TOTAL padahal label "(pemilik)". Aturan: tiap angka case file WAJIB catat basisnya (total/pemilik) + sumber halaman; label dan angka harus satu basis. Guard: qa-round11.py G2 (qa-round3.py ekspektasi diupdate ke basis pemilik).
- **Altman: headline = varian yang tepat (pelajaran ronde 11)**: hibrida (bobot klasik × ekuitas buku) bukan model terpublikasi; modul yang mengajarkan Z′ sebagai varian tepat TIDAK boleh headline hibrida. Aturan: headline = model resmi yang sesuai konteks; hibrida boleh disebut hanya dengan label eksplisit "bukan model resmi". Guard: qa-round11.py G4; qa-wave8c.py recompute dialihkan ke Z′.
- **Explorer footing (pelajaran ronde 11)**: subtotal tanpa komponen lengkap = red flag untuk murid teliti. Aturan: tiap subtotal di explorer WAJIB foot ke komponennya. Guard: qa-round11.py G5.
- **Scroll affordance (pelajaran ronde 11)**: tabel bisa di-scroll tapi tanpa petunjuk = user tak tahu ada kolom lanjutan. Aturan: tiap .tblwrap yang overflow WAJIB class scrollable + hint "geser". Guard: qa-round11.py G7.

## Regression sweep (tiap gelombang, sebelum lapor selesai)
1. Semua halaman utama terbuka tanpa error (HTTP 200).
2. Tidak ada link mati / aset 404 (CSS, JS, font, SVG).
3. Tidak ada `console.error` saat load (cek via curl konten + inspeksi manual).
4. Tipografi angka: semua angka finansial pakai font mono/tabular, bukan font body.
5. Mode landscape HP: full-width, tanpa kolom kosong kiri-kanan (aturan UI Septian).
6. Nomor PSAK: pakai penomoran BARU (efektif 1 Jan 2024); nomor lama hanya dalam kurung
   saat pertama muncul. Dilarang menulis PSAK 73/71/72 tanpa pasangan nomor barunya.
7. Setiap klaim angka standar (tarif, ambang, tanggal efektif) wajib ada sumber di catatan.
8. Bahasa: narasi Indonesia, istilah teknis Inggris. Tidak ada istilah Inggris yang diterjemahkan
   aneh-aneh.

## Artefak QA
- `qa/qa-wave1.py` — Gelombang 1 (desain + landing)
- `qa/qa-wave2.py` — Gelombang 2 (Phase 1 + playground + gate)
- `qa/qa-wave3.py` — Gelombang 3 (Phase 2 + ratio lab + toggle)
- `qa/qa-wave4.py` — Gelombang 4 (Phase 3 + simulator + workbench)
- `qa/qa-mobile.py` — Mobile 390px (round-5): semua tabel dalam scroll wrapper
- `qa/qa-simulator-narrative.py` — Workstream D: retrofit narasi investigasi simulator
  (BRIEFS/DEBRIEFS + evidence log; kunci & skor tidak tersentuh)

## Koreksi Workstream D (3 Nov 2026, retrofit narasi investigasi simulator)
- **Riset pola** (ringkasan: `/tmp/investigation-patterns.md`): redflagmania.com/educators
  ("films set the stage for the investigation"; bukti dikumpulkan progresif, bukan
  disodorkan; true-crime debrief bikin "learning sticky") + SMU Red Flags Accounting
  Fraud Game (pemain = junior auditor; skenario lintas siklus revenue & expenditure;
  flag irregularities satu per satu; poin + progresi peran). 5 pola → 3 diterapkan:
  case brief naratif, evidence log progresif, debrief naratif + triple-lens.
- **Implementasi** (`js/simulator.js` saja; `simulator/index.html` TIDAK diubah —
  container brief/log/debrief di-render JS dalam `#sim-body`, CSP tetap tanpa
  inline script baru): `BRIEFS[9]` (peran auditor forensik, perusahaan, periode 2025)
  + `DEBRIEFS[9]` (kelanjutan fiktif + pelajaran triple-lens 1 baris) sebagai array
  TERPISAH — SCEN/MANIPS/SCREENS tidak disentuh (urutan/isi/kunci/skor identik).
  Evidence log: klik kartu screen (mouse/Enter/Space) menandai red flag; 1 kalimat
  bukti diambil dari data screen existing (nama + nilai + catatan) — tanpa second copy.
- **Perusahaan fiktif konsisten**: Kasus 1–6 = PT Nusantara Makmur (ilustratif),
  K7 = Baruna Lines, K8 = Sentosa Group, K9 = Cakra Steel.
  **PT Cemerlang Abadi DILARANG dipakai** — angkanya kanonis modul (CANONICAL-DATA.md);
  narasi simulator memakai angka ilustratifnya sendiri.
- **Pelajaran permanen**: (1) angka di narasi baru WAJIB reuse angka yang sudah ada
  di skenario (reveal/screen) — dilarang invent angka baru; (2) perusahaan fiktif
  baru dilarang bentrok angka kanonis; (3) teks bukti/debrief diambil dari data
  existing agar tidak lahir "second copy" (aturan round-13); (4) tiap retrofit
  fitur WAJIB guard baseline kunci jawaban (isi+urutan+jumlah) seperti G1.
- **Guard permanen**: qa-simulator-narrative.py — 26 guard (G0 syntax; G1 baseline
  MANIPS=7/SCREENS=7/SCEN=9 + tuple (name,diff,aManip,aScreen); G2 BRIEFS/DEBRIEFS
  9 entri, peran+perusahaan+2–3 kalimat, triple-lens 3 lens, aman-HTML; G3 smoke
  test node+fake DOM: brief ter-render, klik screen benar → evidence terisi,
  submit benar → Skor 2/2 + debrief; G4 index.html tak berubah struktural).
- `qa/qa-workstream-b.py` — Workstream B (Luckin Coffee, Case Files ke-7)

## Workstream B (3 Nov 2026, ACC Septian — Case Files: Luckin Coffee)
- **Kasus ke-7** `js/casefiles.js`: Luckin Coffee — fabricasi penjualan ~RMB 2,2 miliar (2018–2020). Pola flag-or-pass: 2018 = PASS (bakar kas agresif, belum ada bukti), **2019 = FLAG** (tahun fabricasi — revenue-per-toko +79,5% YoY justru saat harga jual efektif anjlok karena voucher; toko 2× tapi pendapatan 6×; Q3 2019 tiba-tiba 'profitable' level toko pertama kalinya), 2020 = PASS (tahun reveal: pengakuan 2 Apr 2020 → pemecatan CEO/COO Mei → delisting Nasdaq 29 Jun → denda SEC US$180 jt 16 Des 2020).
- **Screen yang diajarkan**: revenue-per-store analysis + anomali voucher/diskon (pendapatan tumbuh ketika harga efektif turun = volume palsu). Reveal menutup dengan pelajaran triple-lens (forensik: pendapatan vs logika harga + biaya digelembungkan >US$190 jt; investor: saham US$50 Jan 2020 vs IPO US$17 dengan ~47% pendapatan fiktif; kreditur: >US$864 jt utang+ekuitas digalang di tengah fabricasi).
- **Fakta terverifikasi** (URL tercatat di ctx): laporan anonim 89 halaman Muddy Waters 31 Jan 2020; pengakuan filing 6-K 2 Apr 2020 (COO Jian Liu); Nasdaq suspend 29 Jun 2020; kesepakatan denda SEC US$180 jt 16 Des 2020; denda SAMR Tiongkok RMB 61 jt Sep 2020. Angka operasional (~) disederhanakan, dilabeli di ctx per aturan.
- **Guard permanen**: `qa/qa-workstream-b.py` — (a) `node --check` JS; (b) tiap tahun flag boolean + tepat 1 flag:true per kasus; (c) reveal menyebut `<strong>YYYY = FLAG</strong>` tahun yang benar; (d) tiap ctx melabeli sumber fakta; (e) jumlah kasus (7) selaras header `case-files/index.html` ("Tujuh kasus"). Lolos 3 Nov 2026 (54/54).
- **Aturan baru (case-file baru)**: kasus baru WAJIB (1) label sumber di ctx dengan URL, (2) angka terverifikasi vs disederhanakan dipisah jelas, (3) tahun FLAG bervariasi secara faktual (aturan ronde 9 — tidak selalu tahun terakhir), (4) reveal memuat screen + pelajaran triple-lens, (5) smoke test render node + QA script permanen sebelum lapor selesai.

## Log koreksi proyek (pola, bukan insiden sekali)
| Tanggal | Pola kesalahan | Perbaikan / guard |
|---|---|---|
| 2026-11-03 | Tabel explorer terpotong di render 390px (15 modul + 4 tool; kolom kanan tak terbaca, M16 ~816px, M32 ~748px). Tabel dirender JS belakangan (ganti tab) → bungkus statis saja tidak cukup | Pola `.tblwrap` di css/modul.css + `js/tblwrap.js` (auto-wrap + MutationObserver) di semua 37 halaman; tabel statis telanjang di-pre-wrap. Guard permanen: qa/qa-mobile.py (FAIL bila ada tabel telanjang) |
| 2026-11-03 | QA script cek regex sebagai string literal (`"11[56]" in ctx` tidak pernah match) → false FAIL | Selalu pakai `re.search()` untuk pola regex di QA script; jangan `in` untuk pola |
| 2026-11-03 | Nomor PSAK lama dipakai di materi (73/71/72) — penomoran 3 digit efektif 1 Jan 2024 | Guard QA: dilarang PSAK 2-digit lama tanpa nomor baru; tabel pemetaan di DRAFT-2 |
| 2026-11-03 | Temuan Instinct Modul 1 (5): (1) playground overflow 390px; (2) gate bocorkan kunci saat gagal; (3) Cek tanpa pilihan kunci skor 0 permanen; (4) persistensi tidak di-load; (5) baris total klik kosong | Guard regresi FIX1–FIX5 di qa-wave2.py; pola: tiap temuan reviewer → guard permanen |

## Koreksi Round 2 (3 Nov 2026, review Instinct 8.6/10)
- **Lesson nyata**: angka ilustratif yang "dibuat bagus" tanpa artikulasi = cacat fatal di modul yang temanya artikulasi. 2024 NI ditulis 32.000 padahal barisnya 38.000−8.360=29.640; BS 2024 tak balance (6.560); ΔWC (44.440) vs delta BS (53.000).
- **Aturan**: setiap dataset ilustratif WAJIB lolos uji artikulasi penuh SEBELUM ditulis: (1) NI = PBT−pajak per kolom tahun; (2) A=L+E per kolom; (3) ΔWC = −Δaset operasi + Δliabilitas operasi dari delta BS; (4) CFO = NI+dep+ΔWC; (5) Δkas = CFO+CFI+CFF = kas akhir−kas awal; (6) laba ditahan roll-forward; (7) D/E & rasio narasi direcompute dari angka final, bukan dari draf.
- **Parser input**: format tampilan (titik ribuan) WAJIB bisa diketik user — parseIDNumber() sekarang standar di semua ratio lab; QA uji 10 format.
- **Playground guard**: wajib SEMUA dimensi, bukan "ada yang dipilih".
- **Simpan skor**: selalu skor TERBAIK, dan tampilkan kembali.
- **Quiz**: submit dengan soal terlewat → warning daftar nomor, bukan dinilai 0.

## Koreksi Round 3 (3 Nov 2026, review Instinct 8.8/10)
- **CFI wajib = capex**: total arus kas investasi harus sama dengan baris capex-nya; cek foot CFO+CFI+CFF=Δkas otomatis (lolos dari rekonsiliasi ronde 2!).
- **Klaim narasi vs kolom komparasi**: setiap klaim "dua tahun" / tren WAJIB dihitung dari kedua kolom yang tampil (CFO/NI 2024 = 1,48x, bukan <1).
- **Kasus perusahaan nyata**: angka per perusahaan NAMA ASLI wajib terverifikasi dari filing (bukan "disederhanakan"); tanda salah (rugi vs laba) = fatal. Verifikasi: unduh filing (pdftotext) + cross-check berita untuk fakta sanksi.
- **Skor + reload**: simpan KARTU/ITEM yang sudah dinilai, bukan cuma total — restore harus menandai ulang agar tidak double-count.
- **Gate**: pass = permanen; retake gagal tidak boleh menimpa status lulus (tegaskan di UI).
- **Demo toolkit**: input demo wajib diturunkan dari modul yang dirujuk (LVGI 0,96 dari BS M2).
- **FCFF/FCFE vs bunga (pelajaran ronde 5)**: CFO (PSAK 207) SUDAH setelah bunga dibayar → FCFF = CFO + bunga(1−pajak) − capex; FCFE = FCFF − bunga(1−pajak) + utang neto. Mengurangkan bunga dua kali = double-count. Verifikasi: definisi di teks modul vs rumus di ratio lab harus konsisten.
- **EV ≠ nilai ekuitas (pelajaran ronde 5)**: setiap jembatan valuasi WAJIB kurangkan utang bersih sebelum bandingkan dengan ekuitas/nilai buku. "Upside" dari EV langsung = salah.
- **Distribusi kunci quiz (pelajaran ronde 5)**: tiap modul, posisi jawaban benar WAJIB tersebar (cek: tidak ada modul dengan 5/5 kunci di posisi sama). Shuffle deterministik saat build; QA assert distribusinya.
- **Angka kasus nyata — verifikasi dua arah (pelajaran ronde 5)**: angka turunan (mis. "rugi tanpa X") tidak boleh menggantikan angka restatement resmi; pakai angka restatement bila ada, beri label "ilustrasi" hanya untuk hipotesis yang diberi label eksplisit.
- **Review bank regenerate**: setiap modul baru lahir → `python3 tools/gen_review_bank.py` sebelum deploy; QA features assert jumlah soal = 5 × jumlah modul.
- **Landing stats/kicker**: angka "N Phase" di hero stats + kicker kurikulum WAJIB = jumlah phase aktual (cek via grep saat tambah phase).
- **Gate chain**: modul terakhir LAMA tidak boleh lagi bertuliskan "kurikulum tuntas" bila ada modul baru — gate-nya di-link ke modul berikutnya; QA wave modul terakhir assert link-nya.
- **M19 playground custom renderer**: bila playground tidak pakai template OPTS3 standar, wajib verifikasi programmatic bahwa semua jawaban benar selectable + smoke test browser sebelum deploy.
- **Kunci quiz vs ajaran modul sendiri (pelajaran ronde 6)**: setiap kunci quiz WAJIB dicek silang dengan tabel explorer modul yang sama — kunci yang bertentangan dengan ajaran modul = FATAL (kasus: M20 goodwill a:2 "setara kas" vs explorer "dianggap NOL oleh kreditur"; M21 kontinjensi a:1 "diabaikan" vs PSAK 237 "diungkap").
- **Angka di teks narasi di-recompute (pelajaran ronde 6)**: setiap angka turunan di teks explorer/deskripsi WAJIB dihitung ulang dari inputnya (kasus: M23 "ruang dividen 31.620" seharusnya 16.620 = 0,5×45.240−6.000).
- **Fakta kasus nyata: tahun & jumlah presisi (pelajaran ronde 6)**: tahun kejadian, jumlah tersangka, tanggal putusan = fakta yang diverifikasi ke sumber, bukan perkiraan (kasus: FT Wirecard Jan 2019 bukan 2018; Jiwasraya 802M = Nov 2018; 5 tersangka 14 Jan 2020 + 1 pada 6 Feb 2020; MA Indosurya 16 Mei 2023).
- **Review bank sweep (pelajaran ronde 6)**: setelah regenerate, 120/120 kunci bank WAJIB cocok dengan kunci sumber (skrip sweep independen, bukan dari generator yang sama).
- **Topik PARTIAL → COVERED butuh bukti tool (pelajaran ronde 6)**: klaim "diimplementasikan" untuk tool WAJIB ada fungsi yang jalan + demo tereksekusi (kasus: 10.7/11.4 butuh duplicate_detector/gap_analysis/redflag_scan/fetch_edgar_facts yang dieksekusi, bukan janji).

## Koreksi Phase 8 (3 Nov 2026, build M29-M33 + 5 fitur penyeimbang lens)
- **Ekspektasi test usang (pelajaran Phase 8)**: 5 suite FAIL palsu karena ekspektasi hardcode era Phase 7 — qa-wave11 & qa-round7 ("M28 kembali landing"; M28 kini → M29), qa-round6 ("bank 140 soal" → 165), qa-features (range 1..28 → 1..33). Aturan: tiap phase baru, grep SEMUA suite qa/ untuk ekspektasi jumlah modul/soal & gate modul-terakhir, update eksplisit. Guard: qa-round8.py G5 (gate chain penuh).
- **Key dict workbench case-sensitive (pelajaran Phase 8)**: dcf_inputs() return key lowercase ('ev','tv') — QA yang menebak 'EV' KeyError. Aturan: cek signature fungsi via Python dulu sebelum tulis assert.
- **Fungsi workbench baru WAJIB diuji numerik di QA**: covenant_break() & dcf_inputs() diassert dengan angka ekspektasi (JEBOL pada -20%, EV=277.778 cocok kanonis M18). Guard: qa-round8.py G4.
- **Lens balance check**: fitur baru diklaim "penyeimbang lens" → QA assert keberadaannya per lens (credit: covenant+memo, investment: DCF+comparator, cross: risk-map). Guard: qa-round8.py G7.

## Koreksi Phase 7 (3 Nov 2026, build M25-M28 + 5 fitur)
- **Format quiz satu baris (pelajaran Phase 7)**: regex QA (round6 sweep) brittle terhadap entri quiz multi-baris — M25/M28 lolos gen_review_bank tapi GAGAL sweep kunci (10 mismatch palsu). Konvensi: tiap entri `{q, o, a}` WAJIB satu baris. Guard permanen: qa-round7.py G1.
- **Ekspektasi test jumlah modul/soal (pelajaran Phase 7)**: test yang hardcode "24 modul"/"120 soal" (wave11, round6, features) FAIL palsu saat modul baru lahir. Aturan: ekspektasi jumlah dihitung dinamis dari file yang ada, atau diupdate eksplisit tiap phase. Guard: qa-features.py hitung exp_mods dinamis.
- **Gate modul terakhir (pelajaran Phase 7)**: M24 bertuliskan "Kurikulum Tuntas" padahal Phase 7 lahir sesudahnya — gate WAJIB di-link ke modul berikutnya; modul terakhir BARU (M28) yang boleh klaim tuntas. Guard: qa-round7.py G5.
- **Kunci quiz vs contoh ilustratif (pelajaran Phase 7)**: M27 quiz #1 menguji bahwa contoh MSOP adalah ilustratif — kunci yang mengaburkan fakta kanonis vs ilustrasi = FATAL. Setiap soal tentang contoh ilustratif WAJIB menyebut statusnya di opsi benar.
- **Angka turunan di modul baru di-recompute (pelajaran Phase 7)**: M25 Piotroski 8/9, M27 diluted EPS 430,9 — diverifikasi manual via Python independen sebelum deploy. Guard: qa-round7.py G3.

## Koreksi Round 10 (3 Nov 2026, Statement Explorer + Ratio Lab + stepper LK)
- **ROA/ROE/ATO kanonis pakai rata-rata (pelajaran ronde 10)**: prefill awal pakai denominator akhir periode → ROA 10,0% vs kanonis 10,9%; ROE 25,2% vs 28,3%; ATO 1,15 vs 1,25. Kanonis memakai rata-rata (awal+akhir)/2. Aturan: tiap rasio turunan WAJIB dicocokkan ke angka kanonis via node SEBELUM tulis; bila definisi ambigu (rata-rata vs akhir), pakai yang cocok kanonis + catat definisinya di kartu. Guard: qa-round10.py G3 (16/16 == kanonis).
- **Regex QA match artefak (pelajaran ronde 10)**: `p:"..."` match komentar kode + ekor kata `atetap:`; `data-k="..."` tak match karena di-generate via concat. Aturan: strip komentar dulu; pakai lookbehind `(?<![a-zA-Z])`; hitung dari sumber data (baris TABS), bukan dari template HTML dinamis.
- **Ekspektasi quiz usang lagi (pelajaran ronde 10)**: wave8a/8c/9 FAIL karena hardcode distribusi pra-stabilisasi (M7/M16/M21 di-rebalance ronde 9). Distribusi kini semua ≤2/posisi (compliant G2/G3) → update ekspektasi. Aturan: tiap rebalance kunci, grep SEMUA suite untuk ekspektasi hardcode modul itu.
- **Kartu landing tanpa link = janji palsu (pelajaran ronde 10)**: Statement Explorer & Ratio Lab dipajang di landing tanpa halaman. Aturan: kartu fitur WAJIB punya href ke halaman yang ada; QA assert (qa-round10.py G4).
- **Bug kelewat stabilisasi**: risk-map menulis "tunneling (PSAK 207)" — seharusnya 224. Guard: qa-round10.py G6.

## Koreksi Round 9 (3 Nov 2026, stabilization — review ronde 5, 8.8/10)
- **Konverter PSAK dari tabel resmi IAI (pelajaran ronde 9)**: pola "nomor lama + 200" SALAH TOTAL (71→271 vs resmi 109). Aturan: mapping nomor PSAK HANYA dari tabel resmi IAI (Komparasi Penomoran FINAL); baris tanpa padanan resmi DILARANG (21,27,30,33,34,35,37,40,41). Guard: qa/verify-psak-mapping.py (79/79) + qa-round9.py G1.
- **Quiz exploit single-position (pelajaran ronde 9)**: jawab B semua lolos M2/M6 (80%). Aturan: tiap modul 5 soal, tiap posisi kunci ≤2, simulasi 4 posisi penuh SEMUA <80%. Guard: qa-round9.py G2/G3.
- **Case Files FLAG selalu tahun terakhir (pelajaran ronde 9)**: variasikan tahun FLAG (faktual). Guard: qa-wave10.py ekspektasi variasi.
- **Review page 1..24 → 1..33 (pelajaran ronde 9)**: modul baru WAJIB masuk loop review. Guard: qa-round9.py G4.
- **Mobile 390px tabel terpotong (pelajaran ronde 9)**: SEMUA tabel >390px WAJIB dalam .tblwrap (auto-wrapper js/tblwrap.js + MutationObserver untuk tabel JS-rendered). Guard: qa/qa-mobile.py (15/15).
- **Jiwasraya kasasi (pelajaran ronde 9)**: vonis per tahap beda — pakai tahap TERAKHIR terverifikasi + label tanggal ("putusan kasasi MA, Agustus 2021"); jangan klaim "final" tanpa verifikasi. Guard: qa-round9.py G6.
- **PSAK 224 vs 338 (pelajaran ronde 9)**: 338 = kombinasi bisnis sepengendali; 224 = pihak berelasi. Guard: qa-round9.py G7.
- **DSCR sebutkan konvensi (pelajaran ronde 9)**: CFO PSAK sudah setelah bunga → tulis konvensi pembilang eksplisit + alternatif pre-interest. Guard: qa-round9.py G8.

## Koreksi Round 12 (3 Nov 2026, Phase 9 Learning Depth)
- **G1 varian soal**: kunci tiap varian WAJIB dihitung via 3 jalur independen (Decimal/Fraction/float); distraktor = kesalahan hitung umum. Varian HANYA untuk review bank, TIDAK untuk gate.
- **G2 rubrik**: panel reveal-after-write di semua modul berjurnal — pola `<details>` statis, tanpa JS grading. Exemplar 150-250 kata, spesifik per modul.
- **G3 chain gate**: klaim "Phase N Tuntas" di file JS modul terakhir = bug bila modul berikutnya belum ada; guard regex menolak klaim itu.
- **G4 template self-serve**: halaman template (bedah-buta) TIDAK boleh memuat analisis contoh emiten (QA assert negatif).
- **G5 filing real**: klaim angka dari filing WAJIB terverifikasi ke dokumen; kotak keterbatasan wajib.
- **G6 mistake-log**: hook 1 baris di quiz-submit handler tiap modul; template modul baru WAJIB sertakan hook + script tag.
- Pelajaran Builder F: link mati pre-existing (modul33.js → modul-34/) — guard: semua href modul-N harus resolve ke direktori yang ada.

## Koreksi Round 14 (3 Nov 2026, fix temuan audit Cue)
- **Kartu landing tanpa link = janji palsu (aturan round-10) DIPERTAHANKAN untuk simulator**: verifikasi independen membuktikan /simulator/ FUNGSIONAL (js/simulator.js 94 baris, 3 skenario) — klaim audit "simulator kosong" adalah FALSE POSITIVE (audit tidak eksekusi JS). Aturan: klaim "fitur kosong/mati" WAJIB diverifikasi dengan membaca source JS, bukan cuma HTML awal. Link simulator dipertahankan + <noscript> fallback.
- **Klaim "script path salah" juga false positive**: semua referensi script sudah relative-path benar; audit mengetes URL root yang memang tidak dipakai. Aturan: sebelum setuju temuan path, grep referensi aktual di HTML.
- **robots.txt/sitemap.xml REAL**: file statis di root mengalahkan SPA fallback Cloudflare Pages. Guard: qa-round14.py G1/G2. Generator permanen: tools/gen_sitemap.py (scan direktori, rerun tiap deploy).
- **Glosarium count via script permanen**: tools/gen_glossary_count.py (hitung {en: + rewrite angka di HTML+landing). Aturan: angka count JANGAN hardcode manual. Guard: qa-round14.py G3 (JS==HTML==landing).
- **Mobile nav**: hamburger (aria-expanded/aria-controls/Escape/klik-luar) + :focus-visible 3px. Guard: qa-round14.py G4.
- **M35 framing**: ambang kontrol = "PRESUMSI AWAL, bukan aturan" + contoh de facto control & <20% signifikan.
- **M7 KAM**: "hal paling signifikan dalam audit" (bukan "paling berisiko"); opini bersih = reasonable assurance, bukan jaminan mutlak.
- **verify-psak-mapping.py**: SKIP graceful bila /tmp/komparasi-psak.txt tak ada (artefak manual); mapping di-guard qa-round9.py G1.

## Koreksi Round 15 (3 Nov 2026, Phase 10 Builder A — hardening teknis)
- **Ekspektasi test usang (varian baru)**: pemindahan 5 blok `<script>` inline ke file eksternal
  (js/inline-workbench.js, js/inline-review.js, js/inline-analisis.js — syarat CSP script-src 'self')
  mematahkan 4 suite yang grep HTML halaman langsung (round6 "8 kartu", wave12 "badge JEBOL/AMAN",
  round9 G4 "review 1..35", features F2/F3/F5). Aturan: QA yang membaca HTML halaman WAJIB
  menyertakan js/inline-*.js yang dirujuk (helper `page_all()` di tiap suite).
- **Ekspektasi font usang**: qa-wave1 cek `"Space+Mono"` (fragmen URL Google Fonts). Sejak Phase 10 font
  self-hosted — cek `css/fonts.css` memuat Space Mono + index.html me-link css/fonts.css.
- **Inter = variable font**: Google serve 1 file untuk wght 400/500/600/700 (md5 identik) → deklarasi
  tunggal `font-weight: 400 700`, bukan 4 @font-face. Subset latin saja (ID cukup U+0000–00FF).
- **style-src 'unsafe-inline' = trade-off terdokumentasi**: atribut style="..." dipakai di 54 halaman;
  menghapusnya butuh refactor besar — didokumentasikan di `_headers`, bukan disembunyikan.
- **Referrer-Policy "sudah ada" ternyata belum**: tidak ditemukan di HTML mana pun — ditambahkan via
  `_headers` (lebih kuat dari meta tag). Jangan percaya asumsi "sudah ada"; grep dulu.
- Guard permanen: qa-round15.py (53 guard: G1 _headers, G2 CSP-vs-JS smoke, G3 canonical,
  G4 font self-hosted, G5 export/import + roundtrip merge via node, G6 "Mulai di sini").

## Workstream C — Template Excel unduhan (3 Nov 2026, SEPTIAN ACC)
- **Deliverable**: `downloads/index.html` (4 kartu + tombol `<a download>`) +
  `downloads/templates/`: beneish (8.427 B), altman (8.270 B), ratio-dashboard
  (9.615 B), dcf-input-builder (8.875 B). Link dari kartu "Template Excel" di
  grid #fitur landing. Pola head/nav/footer modul existing; canonical
  `https://fsa-lab.pages.dev/downloads/`; sitemap via tools/gen_sitemap.py (57 URL).
- **Struktur tiap file**: PETUNJUK + INPUT (header kuning, sel input unlocked,
  petunjuk ID) + OUTPUT (rumus, sheet protected password `fsalab`).
  Prefill = angka kanonis PT Cemerlang Abadi (CANONICAL-DATA.md).
- **Guard SEVERE xlsx** (build DITOLAK bila gagal — `check_formulas` di generator):
  (1) hanya fungsi Excel klasik → tak butuh prefix `_xlfn.`; (2) forced recalc
  via `wb.calculation.fullCalcOnLoad=True` + convert LO headless, bandingkan
  dengan hitungan Python independen; (3) tak ada sel teks diawali `=`/`+`/`-`.
- **Verifikasi** (`python3 tools/gen_download_templates.py --verify` → LULUS;
  bukti: `qa/workstream-c-verify.md`): M-score −1,6514 (MANIPULATOR LIKELY);
  Z 2,638 (GREY ZONE); 16 rasio × 2 thn + Δ cocok (CR 2,17; DSO 73,0; GM 35,0%;
  ROE 28,3%; ROIC 15,8%; ND/EBITDA 1,76); EV 2-tahap 324.786 (TV 389.251,
  ekuitas tersirat 144.786, Rp1.447,9/saham); cabang IFERROR "—" untuk
  EBITDA24/IC24 kosong + varian terisi (NDE 2,0919; ROIC 12,48%); cek neraca OK.
- **Bug tertangkap verifikasi**: OUTPUT Beneish memetakan TATA→B12/LVGI→B13
  padahal INPUT menaruh LVGI/B12, TATA/B13 → recalc LO M=2,99 vs Python −1,65.
  Fix: urutan disamakan. **Aturan**: tiap template WAJIB assert pemetaan ref
  sel INPUT→OUTPUT (verifikasi nilai akhir saja tidak cukup).
- **Catatan LO**: build LibreOffice ini TIDAK bisa menulis xlsx
  (`impl_store` 0x81a gagal untuk semua xlsx) → forced recalc via
  `--convert-to ods`, nilai cached dibaca dari `content.xml`
  (`tools/verify_templates.py::ods_values`; tangani `covered-table-cell`
  dan `value-type="percentage"`).
- Generator permanen: `tools/gen_download_templates.py` (+ `--verify`).

## BACKLOG (deferred, bukan blocker)
- ~~Security headers (CSP/HSTS/frame-ancestors/Permissions-Policy)~~ — SELESAI Round 15
- ~~Canonical tags absolut~~ — SELESAI Round 15
- CORS wildcard review
- ~~Self-host fonts (ganti Google Fonts)~~ — SELESAI Round 15
- ~~Export/import progres (localStorage → JSON)~~ — SELESAI Round 15
- ~~"Mulai di sini" section + 3 jalur persona di landing~~ — SELESAI Round 15
- Progress bar global / breadcrumb fase>modul
- Cooked Books Simulator: kembangkan skenario (saat ini 9: Kasus 1–9, fungsional; Phase 10 tambah cookie jar, related-party revenue, big bath)

## Koreksi Round 15 (3 Nov 2026, Phase 10: hardening + bank soal + simulator)
- **Bank soal 301** (175 base + 126 varian, 42 tipe): 15 tipe baru (artik/material/impair/lifo/altmanz/fvtpl/deadline/goodwill/warranty/rpsales/piotroski/benford/llcr/eqval/pbv) — triple-verified (Decimal vs Fraction vs verifier). Substitusi: M14 margin segmen → LIFO (aturan: varian WAJIB sesuai ajaran modul).
- **Simulator 9 skenario** (tambah cookie jar, related-party revenue, big bath) — 21/21 Python-verified.
- **Hardening**: _headers (CSP/HSTS/frame-ancestors/Permissions-Policy), canonical 54/54, export/import progres JSON, "Mulai di sini" 3 jalur, fonts self-host WOFF2.
- **Pelajaran**: klaim "fitur kosong" dari reviewer eksternal WAJIB verifikasi source JS (bukan cuma HTML) — 2 false positive Cue (simulator, script path) tertangkap di sini.
- Backlog Round 14: 5 item dicoret (selesai), sisa: CORS wildcard review (low).

## Koreksi Phase 10 Workstream A (3 Nov 2026, M36 & M37 — SEPTIAN ACC)
- **M36 "Stock-Based Compensation & EPS"** (PT Teknologi Maju, FIKTIF): PSAK 102 (dulu 53) — beban SBC 3.000/thn dari fair value 9.000 vesting 3 thn; WASO 200 jt (190 + 20×6/12); treasury stock method — 24 jt opsi @200, pasar 400 → proceeds 4.800 → buyback 12 jt → dilutif +12 jt → diluted shares 212 jt → diluted EPS Rp283,0 (drag Rp17, 5,7%); P/E 21,2x (diluted) vs 20,0x (basic); FCFE 31.500 (CFO 55.000 − capex 25.000 + net borrowing 1.500; tanpa add-back SBC = 28.500).
- **M37 "Inventory & Long-Lived Asset Methods"** (PT Dagang Prima, FIKTIF): FIFO vs LIFO di inflasi — HPP 15.500 vs 17.500, laba kotor 14.500 vs 12.500, LIFO reserve 2.000 (hemat pajak 440 @22%, laba bersih +1.560 basis FIFO); PSAK 202 (dulu 14) MELARANG LIFO; kapitalisasi vs beban — overhaul 8.000/4 thn (2.000/thn vs 8.000, selisih laba 6.000); impairment PSAK 236 (dulu 48) — recoverable = max(18.000, 20.000) = 20.000 → rugi 5.000, reversal boleh kecuali goodwill; depresiasi komponen PSAK 216 (dulu 16) — 3.400/thn vs 2.000 single-rate.
- **Angka ilustratif WAJIB Python-verified**: /tmp/verify_m36_m37.py (28/28 OK) SEBELUM tulis modul.
- **Guard permanen**: qa/qa-round16.py (G1/G2 canon HTML+JS, G3 wrong-variant sweep, G4 PSAK numbering incl. jebakan "PSAK 214", G5 chain gates, G6 localStorage tanpa reset, G7 bank+mistake-log, G8 key distribution).
- **Review bank 317** (185 base + 132 varian, 44 tipe): 2 tipe baru — tsm (M36, diluted EPS via treasury stock method), capdep (M37, depresiasi komponen); WHY +10 (gi 175-184); triple-verified (Decimal vs Fraction vs verifier independen).
- **Glosarium 178 istilah** (+7: Component Depreciation, FIFO, LIFO, LIFO Reserve, Recoverable Amount, Stock-Based Compensation (SBC), Treasury Stock Method; ref update: Diluted EPS, Impairment, Vesting) via tools/gen_glossary_count.py.
- **Aturan**: modul baru = chain gate ke modul berikut ("Modul N Tuntas", bukan "Phase N Tuntas"); klaim "Phase N Tuntas" hanya di modul terakhir fase (aturan Round 12 G3). PSAK 14 → 202 (BUKAN 214 — guard qa-round9/verify-psak-mapping dari tabel resmi IAI).

## Guard quiz-cue permanen (4 Nov 2026, temuan proaktivitas pagi)
- **Temuan**: klaim Round 12 "longest-is-key 78% → 40%" (325 distractor auto-fix) TIDAK bertahan diukur dari file yang di-ship: pengukuran independen 4 Nov 2026 = **77,8%** (ties incl, metode sama dgn Instinct) / 70,3% (unique) di 185 soal modul + 185 soal review bank. Mekanisme: revert Round 13 (penghapusan qualifier hack yang bikin cue lebih buruk) ikut menghapus 325 edit auto-balancing tsb — dua fix otomatis saling meniadakan.
- **Guard permanen**: `qa/qa-quiz-cues.py` — G1 longest-is-key ≤ 35% (target Septian; FAIL jujur sampai rewrite manual dikerjakan), G2 qualifier-cue == 0 (kelas bug Round 13), G3 review-bank ↔ modul: 185 soal sama + teks kunci identik (kelas "stale second copy").
- **Stale copy diperbaiki**: `tools/review_why_data.py` why DSCR diselaraskan ke ajaran R2 Round 12 (BREACH kontraktual ≠ tak bisa bayar), `js/review-bank.js` diregenerate via `tools/gen_review_bank.py` (JANGAN edit manual — header file). Varian review (132, `js/review-variants.js`) dicek bersih dari wording lama.
- **Aturan**: klaim "% → %" soal quiz-cue WAJIB dibuktikan dengan run `qa/qa-quiz-cues.py`, bukan dari log builder. Review bank WAJIB regenerate (bukan edit manual) setiap quiz modul berubah.
