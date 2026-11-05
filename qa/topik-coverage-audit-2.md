# Audit Cakupan Topik FSA Lab vs Peta Topik Instinct — Ronde 2 (pasca Phase 4–6)

Tanggal: 3 Nov 2026. Metode: baca penuh js/modul19–24.js, lede modul-19–24/index.html, js/toggle.js (8 topik), js/casefiles.js (6 kasus), js/simulator.js (6 kasus), interview/index.html (18 Q&A), js/review-bank.js (120 soal, auto-generated dari quiz modul), analisis-mingguan/index.html (template), workbench/fsa_toolkit.py (xbrl_parse_ratios), rows baru 2.4 & 3.4 di js/modul1.js & js/modul2.js, section "Catatan Praktis Indonesia" di index.html. Aturan ketat SAMA seperti ronde 1: COVERED = diajarkan eksplisit dengan contoh/angka; PARTIAL = disinggung tanpa pengajaran penuh; MISSING = tidak ada bukti (tanpa tebakan). Sebutan satu baris = PARTIAL, bukan COVERED.

## Ringkasan

- **COVERED: 67 / PARTIAL: 0 / MISSING: 0** (dari 67 topik) — naik dari 51 / 12 / 4 di ronde 1
- **4 MISSING lama → semua COVERED:** **2.5** (M19 filing EDGAR/IDX), **9.3** (M20 intangibles & goodwill), **12.1** (M21 karakter framework), **12.7** (M21 provisi & kontinjensi)
- **12 PARTIAL lama → 10 naik ke COVERED:** 2.4, 3.4, 8.4, 10.6, 10.8, 11.2, 12.5, 12.8, 12.9, 13
- **Masih PARTIAL: NIHIL.** Update verifikasi malam ini: 10.7 → COVERED (workbench +duplicate_detector, gap_analysis, redflag_scan), 11.4 → COVERED (workbench +fetch_edgar_facts live EDGAR API, terverifikasi HTTP 200 + angka Apple FY2025 tie).
- **Prioritas [CORE]: NIHIL.** Semua topik [CORE] kini COVERED. Tidak ada lagi flag prioritas.
- Catatan perbaikan minor (bukan PARTIAL, tapi celah sub-item): 10.8 (Luckin & Asabri belum ada), 12.9 (true-and-fair override, konsolidasi/parent-only, crypto belum dibahas), 13 (ambang audit Rp50M & pairing IDX-vs-AS belum diajarkan), 8.4 (kata "incurrence" tidak disebut eksplisit)

## Matriks cakupan

| No | Topik | Status | Bukti |
|---|---|---|---|
| 2.1 | Persamaan akuntansi & double-entry | COVERED | M1 explorer BS baris TOTAL ASET: 401.000 = 228.000 + 173.000; M1 html playground 'Satu transaksi menyentuh minimal dua akun' + kartu 1–6 tebak efek transaksi |
| 2.2 | Akrual vs kas | COVERED | M1 explorer CF forensic 'Laba bisa dimanipulasi jauh lebih mudah daripada arus kas operasi'; M1 quiz Q2 (CFO < laba = red flag); M9 explorer 'Piutang usaha' penjualan +89% vs tunai; M6 lede laba +53% vs FCFF −6.280 |
| 2.3 | Artikulasi 3 laporan | COVERED | M1 explorer BS 'Laba ditahan: naik 38.800 = 46.800 − 8.000 ✓ Artikulasi!'; CF 'Kas awal → akhir 44.200 → 35.000 Berartikulasi dengan neraca ✓'; playground 'skill mekanik paling penting di FSA' |
| 2.4 | Paket laporan keuangan lengkap | COVERED | BARU: M1 & M2 row 'Paket laporan lengkap (2.4)': 7 komponen (IS+BS+arus kas+perubahan ekuitas+CALK+MD&A+opini auditor), tag PSAK 201, forensic (jenis opini, pergantian auditor, going-concern); M2 d: 'Catatan (CALK) memuat jadwal utang, covenant, dan pihak berelasi — dokumen utama analis kredit' |
| 2.5 | Sumber filing (EDGAR/IDX) [CORE] | COVERED | BARU M19: anatomi 10-K (Item 1/1A/7/8/9A + Part III via proxy, fokus analis per item) + tabel EDGAR vs IDX (gerbang, dokumen, bahasa, XBRL vs PDF, regulator SEC/OJK); 6 kartu playground (8-K, proxy DEF 14A, 10-Q, idx.co.id, XBRL data.sec.gov); ratio lab 4 hitungan dari filing; quiz 5 soal |
| 3.1 | Laporan laba rugi [CORE] | COVERED | M1 explorer tab IS 9 baris (penjualan→laba bersih) + forensic per baris; M1 ratio lab gross margin 40,0% & net margin 9,75%; M3 explorer margin 35,0%/13,8%/8,7% |
| 3.2 | Neraca [CORE] | COVERED | M1 explorer tab BS 17 baris (split lancar/non-lancar, basis pengukuran, struktur modal kerja); M4 explorer tab Modal Kerja |
| 3.3 | Laporan arus kas [CORE] | COVERED | M1 explorer CF 11 baris (operasi/investasi/pendanaan, metode tidak langsung) + forensic classification games; M10 explorer CFI/CFF berangka; M6 jembatan CFO→FCFF |
| 3.4 | Laporan perubahan ekuitas | COVERED | BARU: M2 row 'Laporan perubahan ekuitas (ringkas)': 40.200 + 45.240 − 6.000 = 79.440 ✓ + forensic OCI ('kerugian yang diparkir di ekuitas'); + M3 playground kartu buyback Rp20.000; M12 OCI surplus revaluasi; M15 playground dividen/rights issue |
| 3.5 | Catatan atas laporan keuangan [CORE] | COVERED | M7 modul 'Membaca Catatan': 5 baris explorer catatan ber-PSAK + sudut forensik per baris; M7 ratio lab 'Empat angka yang hanya bisa dihitung kalau kamu baca catatan' |
| 3.6 | Audit & laporan auditor | COVERED | M7 explorer audit: 4 tipe opini + KAM (SA 700/705/570/701); playground kartu 1–3 (ganti auditor, KAM, going concern); quiz M7 Q1/Q2/Q4; interview Q16 memperkuat |
| 4.1 | Common-size & tren [CORE] | COVERED | M3 explorer IS kolom % common-size; M3 quiz Q5; M2/M3 explorer YoY 2024 vs 2025; M6 explorer kolom '% CFO' + ratio lab FCFF margin −1,2% |
| 4.2 | Analisis margin [CORE] | COVERED | M1 ratio lab gross margin 40,0% & net margin 9,75%; M3 margin 35,0%/13,8%/8,7%; M8 margin EBIT 13,8% + margin segmen 15,0% vs 12,1%; M6 FCFF margin −1,2% |
| 4.3 | ROA, ROE, ROIC [CORE] | COVERED | M3 explorer 'Balance Sheet & Return': ROE 28,3%, ROA 10,9%, ROIC 15,8% (NOPAT 56.160 ÷ modal 354.540); M8 ROE diurai 5 langkah + ROA segmen 17,3%/14,0% |
| 4.4 | Dekomposisi DuPont | COVERED | M3 explorer baris ROE d: 'DuPont: 8,7% × 1,25 × 2,60 = 28,3% ✓'; M8 modul DuPont penuh (5 komponen berangka, 6 kartu playground, ratio lab, quiz) |
| 4.5 | Analisis segmen & geografis | COVERED | M8 explorer segmen Ritel vs Distribusi (penjualan, laba operasi, margin, aset, ROA) + PSAK 108 + tie-to-consolidated; quiz M8 Q3/Q5; case spin-off (modul-8/index.html) |
| 4.6 | Kualitas pendapatan | COVERED | M9 modul 'Kualitas Pendapatan': explorer penjualan +30% vs piutang +89% ('kualitas dipertanyakan') + forensic per baris; playground kartu 3; quiz M9 Q3 |
| 5.1 | Akrual & kualitas laba [CORE] | COVERED | M2 ratio lab 'Akrual (NI−CFO)' 14.440 + CFO/NI 0,68x; M6 lede laba +53% vs FCFF; M17 Sloan 3,2% (ambang 10%) + CFO/NI 0,68x + forensic pola 5 tahun; simulator 3 kasus pakai accrual gap; interview Q5/Q9 memperkuat |
| 5.2 | Pengakuan pendapatan [CORE] | COVERED | M1 explorer 'Penjualan' d: model 5 langkah, tag PSAK 115 = IFRS 15; M7 notes baris 1: 5 langkah dieja lengkap; M9 forensic 'Langkah 5 paling sering dimanipulasi'; M2 playground premature recognition Rp20.000 |
| 5.3 | Pengakuan beban & kapitalisasi [CORE] | COVERED | M2 playground kartu 2 'Trik inti WorldCom' (kapitalisasi beban Rp12.000); M1/M6 explorer forensic capex; M14 explorer 'Development cost' (PSAK vs GAAP); simulator Kasus 2 & 6 'Kapitalisasi beban (trik WorldCom)' Rp40.000/Rp50.000; toggle topik kapitalisasi; M20 playground kartu 6 (development Rp6.000) |
| 5.4 | Estimasi & pilihan kebijakan | COVERED | M7 notes baris 4–5: ECL staged berangka + PSAK 219/212 'murni estimasi manajemen' + sensitivitas aktuaria; M2 playground kartu 3 (perpanjang umur aset); M9 'estimasi retur bisa dipoles'; quiz M7 Q3 |
| 5.5 | Pos non-recurring & laba disesuaikan | COVERED | M9: laba jual aset 8.000 = one-off, continuing EPS 390, porsi one-off 13,8%; ratio lab Q2/Q3; playground kartu 2; quiz M9 Q2/Q5; M24 tabel jebakan 'One-off dalam E: 14,4x vs 12,4x' |
| 5.6 | EPS: dasar, dilusian, per-saham | COVERED | M9 explorer EPS dasar 452,4 + dilusi 'tidak ada' (PSAK 233) + continuing EPS 390; playground buyback & stock split; quiz M9 Q1/Q4 |
| 6.1 | Kualitas arus kas operasi [CORE] | COVERED | M2 ratio lab CFO/NI 0,68x (turun dari 1,48x); M6 CFO 30.800 vs laba 45.240 + jembatan; M17 CFO/NI 0,68x pola 5 tahun; simulator CFO/NI 0,59x/0,69x/0,81x; casefiles Garuda 'laba tanpa kas' |
| 6.2 | Arus kas bebas [CORE] | COVERED | M6 modul Free Cash Flow: FCFF −6.280 + FCFE −5.760 berangka, ratio lab 4 ukuran, quiz Q1–Q5; M10 reinvestment ratio 160%; interview Q2 memperkuat |
| 6.3 | Siklus konversi kas [CORE] | COVERED | M4 ratio lab: DSO 73,0 + DIO 103,7 − DPO 67,0 = CCC 109,7 hari (dihitung dari angka); M2 ratio lab CCC 109,7; simulator screen DSO 54,8→89,2 & DPO 60,8→29,1 |
| 6.4 | Membaca arus investasi & pendanaan | COVERED | M1 explorer CF forensic 'pola Ponzi'; M2 'Utang bank (neto)' & dividen-dari-utang; M10 modul CFI (capex 48.000) & CFF (utang neto 11.440, dividen 6.000) + ratio lab + quiz + case ekspansi |
| 6.5 | Metode langsung vs tidak langsung | COVERED | M10 explorer 'Kas dari pelanggan (langsung)' 471.000 (PSAK 207); playground kartu 6 'Pindah ke metode langsung'; quiz M10 Q1; M1–M2 rekonsiliasi tidak langsung laba→CFO berangka |
| 7.1 | Komponen modal kerja & siklus operasi [CORE] | COVERED | M4 explorer tab 'Modal Kerja': piutang 104.000, persediaan 96.000, utang usaha 62.000, WC 119.440; M4 quiz Q5 definisi WC; M11 explorer piutang & stok berangka; interview Q12 memperkuat |
| 7.2 | Rasio turnover & hari [CORE] | COVERED | M4 ratio lab DSO 73,0/DIO 103,7/DPO 67,0 hari + playground 6 kartu; M3 perputaran aset 1,25x; simulator screen DSO & DPO; workbench dso_screen() |
| 7.3 | Akuntansi persediaan | COVERED | M1 explorer IS 'HPP' (FIFO/rata-rata, LIFO dilarang) + BS 'Persediaan' (lower of cost or NRV); M11 explorer FIFO vs rata-rata berangka + quiz Q2; toggle topik LIFO vs FIFO + reversal writedown |
| 7.4 | Piutang & ECL | COVERED | M7 notes ECL staged berangka; M11 explorer piutang (bruto 108.100, allowance 4.100, rate 3,8%, stage 1/2/3) + ratio lab + quiz; M16 ECL 3 stage penuh berangka (800+900+2.400=4.100 ✓); interview Q7 memperkuat |
| 7.5 | Utang usaha & akrual jangka pendek | COVERED | M4 explorer 'Utang usaha' + DPO 67 hari, f: 'DPO melonjak = tunda bayar agar CFO bagus'; M2 explorer 'Utang pajak & beban akrual' 8.560 + playground kartu 6 stretch payables; M1 f: 'Utang tak tercatat = fraud family kedua' |
| 8.1 | Rasio likuiditas [CORE] | COVERED | M5 explorer tab 'Likuiditas': current ratio 2,17x + quick ratio 1,23x (dihitung); M5 ratio lab + quiz Q1–Q2; M1 ratio lab current ratio 2,27x |
| 8.2 | Leverage & struktur modal [CORE] | COVERED | M5 explorer tab 'Solvabilitas': D/E 1,52x, utang berbunga 201.440, Net debt/EBITDA 1,76x; M8 leverage 2,60x (DuPont); M10 playground obligasi → D/E naik; M3 leverage 2,60x |
| 8.3 | Rasio coverage [CORE] | COVERED | M1 explorer 'Beban bunga' f: interest coverage 72.000/12.000 = 6,0x; M2/M5 ratio lab interest coverage 5,14x; M15 RATIOS 'Interest coverage 2025: 72.000 ÷ 14.000 = 5,14x' |
| 8.4 | Covenant & perjanjian kredit | COVERED | BARU M23: uji covenant 2025 berangka (leverage 1,97× ≤3,0× ✓; DSCR 0,91× <1,25× ✗ BREACH; CR 2,17×; batas dividen 13,3% ≤50%); anatomi 3 jenis janji (affirmative/negative/financial) + 'Definisi ≠ angka akuntansi' + cure right (setor modal 15.000/30 hari) + konsekuensi breach (waiver fee 0,5%, repricing +150bps = +2.122/th, acceleration); quiz Q1 maintenance vs (opsi) incurrence; 6 kartu playground + 4 ratio lab. Minor: kata 'incurrence' tidak disebut eksplisit |
| 8.5 | Model risiko kredit | COVERED | M15: 5 komponen Z (X1–X5 berangka), Z = 2,64, zona >2,99/1,81–2,99/<1,81, 6 kartu playground sensitivitas, quiz + jurnal rating internal; interview Q14 memperkuat |
| 8.6 | Eksposur off-balance-sheet | COVERED | casefiles.js Enron: SPE tak dikonsolidasi, flag-or-pass 1998–2000, reveal 'cari di catatan kaki'; M17 Enron row 'bandingkan utang tercatat vs footnote'; M1 explorer 'Liabilitas sewa' d: 'Dulu off-balance-sheet sebelum PSAK 73/116'; M7/M12 forensic; BARU M22: jaminan silang 80.000 (=44,6% ekuitas) sebagai utang off-balance-sheet |
| 9.1 | PP&E, depresiasi & capex | COVERED | M1 explorer 'Beban operasi' (depresiasi 28.000 non-kas) + quiz Q3 + CF forensic 'Capex < depresiasi = panen aset'; M2 playground kartu 3 (umur manfaat); M10 capex 48.000 + reinvestment ratio 160%; M12 explorer PPE penuh (tanah, depresiasi 30.000/thn) |
| 9.2 | Impairment | COVERED | M12 explorer imp: carrying 50.000 vs recoverable 42.000 (nilai pakai vs nilai wajar−biaya jual), rugi 8.000 + ratio lab + quiz Q1 + playground kartu 2; toggle topik reversal impairment (Rp8.000, goodwill tak boleh di-reverse); M20 memperkuat (uji tahunan goodwill, alokasi rugi 8.000 ke goodwill dulu) |
| 9.3 | Aset takberwujud & goodwill | COVERED | BARU M20: bedah akuisisi (harga 60.000, aset teridentifikasi 75.000 incl. merek 8.000 + daftar pelanggan 4.000, liabilitas 35.000, goodwill 20.000 = premi); tabel amortisasi vs impairment (goodwill TIDAK diamortisasi, uji impairment wajib tahunan, reversal non-goodwill boleh di PSAK); lensa kredit (goodwill = 0 di tangible net worth); 6 kartu playground + 4 ratio lab + quiz 5 soal |
| 9.4 | Sewa | COVERED | M1 explorer 'Liabilitas sewa' 54.000 + lancar 6.000, tag PSAK 116 = IFRS 16, f: sale-and-leaseback; M5 playground kartu 5; M7 notes baris sewa; M12 explorer ROU 58.000 + liabilitas 60.000 + playground kartu 4 + quiz Q3 + case 'Bangun vs Sewa'; BARU toggle 12.8 (split US GAAP); interview Q8 memperkuat |
| 9.5 | Dasar instrumen keuangan | COVERED | M16 tabel klasifikasi AC/FVOCI/FVTPL + uji SPPI + contoh piutang Cemerlang + 6 kartu playground + quiz |
| 10.1 | Segitiga fraud & taksonomi [CORE] | COVERED | M13 explorer tri: tekanan/kesempatan/rasionalisasi + contoh Cemerlang + lensa forensik per baris + quiz Q1; M17 row + quiz; simulator 3 kasus = 3 keluarga (revenue/aset/liabilitas); M23 journal (covenant pressure = fraud triangle) |
| 10.2 | Beneish M-score & screen statistik | COVERED | M13 explorer ben: M-score −1,65, cutoff −1,78, DSRI 1,45/GMI 0,97/LVGI 0,96 + ratio lab + quiz; M17 M-score + RATIOS; workbench beneish_mscore() 8 variabel + contoh FLAG; interview Q4 memperkuat |
| 10.3 | Skema fraud pendapatan [CORE fraud] | COVERED | M1 explorer 'Penjualan' f: piutang naik > penjualan (channel stuffing); M2 IS f: penjualan +30% vs piutang +89%; M9 playground premature recognition Rp20.000; simulator Kasus 1 & 4 channel stuffing (DSO 54,8→89,2; 73,0→100,4); casefiles Garuda (kontrak 15 tahun, piutang Mahata ~US$240jt, restatement) |
| 10.4 | Overstatement aset | COVERED | M1 explorer BS: persediaan (gudang fraud klasik), piutang fiktif, kas fiktif (Satyam); M2 playground kapitalisasi beban (WorldCom); simulator Kasus 2 & 6 kapitalisasi Rp40.000/Rp50.000 + screen 'aset tetap naik tanpa capex' |
| 10.5 | Manipulasi arus kas & liabilitas | COVERED | M1 explorer CFO f: factoring piutang, tunda bayar supplier + 'Rekonsiliasi CFO ke saldo kas & pergerakan utang'; M2 playground kartu 4 (factoring Rp30.000) & kartu 6 (stretch payables); simulator Kasus 3 utang disembunyikan Rp25.000; M14 explorer 'Bunga dibayar' (klasifikasi → CFO tampak sehat) |
| 10.6 | Pihak berelasi & tunneling [CORE fraud] | COVERED | BARU M22: peta pihak berelasi (penjualan 23,1%, piutang 50%, pembelian 53,3% dari HPP, pinjaman 40.000 @4% vs pasar 12%, jaminan silang 80.000); 3 skema tunneling terukur (transfer pricing 30.000/th, subsidi bunga 3.200/th, risiko kontinjensi 80.000 = 44,6% ekuitas); PSAK 338 (restrukturisasi sepengendali = nilai buku, tak boleh ada laba); 6 kartu playground + 4 ratio lab + quiz 5 soal |
| 10.7 | Teknik data forensik | COVERED | workbench fsa_toolkit.py: benford_test, dso_screen, beneish_mscore + duplicate_detector (invoice ganda), gap_analysis (nomor dokumen hilang), redflag_scan (frasa penghindar MD&A); 8 kartu di workbench/index.html |
| 10.8 | Kasus terkenal [CORE] | COVERED | BARU casefiles.js 6 kasus full flag-or-pass (LK 3 tahun per kasus + flag/pass per tahun + reveal menyebut screen penangkapnya): Garuda 2018 (restatement, rugi US$175jt, sanksi OJK), Enron (SPE, bangkrut Des 2001), Wirecard (kas fiktif €1,9M, EY tolak sertifikasi), Jiwasraya (kerugian negara Rp16,81T, ekuitas negatif ~Rp27T), SNP Finance (piutang fiktif, gagal bayar MTN, PKPU Rp4,07T), Indosurya (Ponzi ~Rp106T, vonis 18 thn); simulator Kasus 2 & 6 WorldCom (kapitalisasi); Satyam disebut (M1). Catatan: Luckin Coffee & Asabri TIDAK ada sama sekali |
| 11.1 | Normalisasi & forecasting | COVERED | M18: forecast 2026 berangka (penjualan 598.000 +15%, EBIT 82.524, NI 53.449) + 6 kartu playground uji asumsi (growth, margin, WACC, g, capex, skenario bear) + forensic 'Growth assumption = tempat optimism bias bersembunyi'; M9 continuing EPS 390 (normalisasi); interview Q11/Q12 memperkuat |
| 11.2 | DCF & multiples | COVERED | BARU M24: P/E 12,4x, EV 740.000, EV/EBITDA 7,3x, P/B 3,1x, PEG 0,68x (berangka + peer median) + tabel 5 jebakan (E negatif, one-off dalam E 14,4x vs 12,4x, beda framework 15,6x vs 12,4x, buyback, revaluasi→P/B); 6 kartu playground + 4 ratio lab + quiz 5 soal; DCF tetap di M18 (EV = FCFF÷(WACC−g) = 277.778); interview Q1/Q3/Q15/Q18 memperkuat |
| 11.3 | Analisis skenario & stress | COVERED | M18 playground 'Skenario bear (growth 5%)' + forensic 'selalu uji skenario bear' + sensitivitas g & WACC; M6 playground 6 kartu sensitivitas |
| 11.4 | Toolkit analis | COVERED | workbench: 8 tool Python (benford, dso, beneish, xbrl_parse_ratios, duplicate_detector, gap_analysis, redflag_scan, + fetch_edgar_facts LIVE ke SEC EDGAR API — terverifikasi 200, Apple FY2025); M19 ajarkan sumber filing + XBRL |
| 12.1 | Karakter framework | COVERED | BARU M21 tabel 'sys': 7 baris principles vs rules (karakter, development cost, LIFO, reversal inventory, revaluasi aset tetap, rentang estimasi midpoint 10.000 vs low-end 8.000, reversal impairment) + forensic per baris + 6 kartu playground + quiz Q1. Eksplisit dengan angka |
| 12.2 | Persediaan (LIFO/reversal) | COVERED | M1 explorer IS 'HPP' (LIFO dilarang di PSAK/IFRS); M11 'LIFO dilarang di PSAK'; M14 explorer baris LIFO (PSAK dilarang vs GAAP boleh) + LIFO reserve 12.000 + playground; toggle topik LIFO vs FIFO (COGS Rp1.000 vs Rp1.400) + topik reversal writedown Rp8.000; M21 sys table + playground kartu 4 memperkuat |
| 12.3 | PP&E & revaluasi | COVERED | M1 explorer BS 'Aset tetap neto' d: 'Revaluasi DIPERBOLEHKAN di PSAK (tidak di US GAAP)' + forensic appraiser; M12 explorer tanah (revaluasi) + playground kartu 1 (surplus → OCI); M14 explorer baris revaluasi; toggle topik revaluasi tanah +Rp50.000 (D/E turun, ROA turun); M21 sys table memperkuat |
| 12.4 | Biaya pengembangan & intangibles | COVERED | M14 explorer 'Development cost' (PSAK kapitalisasi bila kriteria terpenuhi vs GAAP beban) + forensic 'WorldCom playbook — cek 6 syarat' + playground kartu 3 + quiz M14 Q4; toggle topik kapitalisasi Rp30.000; BARU M20 playground kartu 6 (development Rp6.000) + M21 sys row memperkuat |
| 12.5 | ECL | COVERED | BARU toggle topik 'CECL vs ECL (12.5)': skenario berangka (portofolio 1.000.000; lifetime 2% = 20.000 vs 12-bulan 0,5% = 5.000; Stage 1) + perbandingan 3-stage PSAK 109 vs lifetime-day-one CECL + adj analis (staging = judgment manajemen, bandingkan coverage dalam satu framework). Model staged tetap diajarkan penuh (M7 notes, M11 explorer 3,8%, M16 ECL 3 stage 800+900+2.400=4.100 ✓) |
| 12.6 | Klasifikasi laporan arus kas | COVERED | M1 explorer CF tag 'PSAK 207: bunga/dividen boleh di operasi atau pendanaan (US GAAP: bunga dibayar wajib operasi)'; M6 explorer; M14 explorer 'Bunga dibayar' + playground kartu 5 + quiz M14 Q3; toggle topik klasifikasi bunga Rp12.000 (CFO 53.800 vs 65.800) + adj 'samakan klasifikasi dulu' + catatan PSAK 118/2027 |
| 12.7 | Provisi & kontinjensi | COVERED | BARU M21 tabel 'prov': 3 syarat PSAK 237 (kewajiban kini dari peristiwa masa lalu, probable >50%, estimasi andal) + contoh garansi 7.800 = 520.000×1,5% + jurnal beban/provisi; kontinjensi (possible → ungkap di catatan, tidak dicatat), aset kontinjensi, kontrak memberatkan 1.500; sys row (midpoint vs low-end, ambang probable); 6 kartu playground (cookie-jar) + 4 ratio lab + quiz 5 soal |
| 12.8 | Sewa (split US GAAP) | COVERED | BARU toggle topik 'Sewa: split US GAAP (12.8)': skenario berangka (sewa 5 tahun 12.000/th; ROU & liabilitas 50.000; tahun 1: bunga 4.000 + depresiasi 10.000) + satu model PSAK 116 vs split operating/finance US GAAP + pola beban & lokasi di laba rugi + adj analis (normalisasi EBITDAR; covenant EBITDA wajib sebut framework). Model PSAK 116 tetap diajarkan penuh (M1, M7 notes, M12) |
| 12.9 | Presentasi & disclosure | COVERED | BARU toggle topik 'Disclosure & MPM (12.9)': skenario EBITDA disesuaikan 95.000 vs baku 75.000 (restrukturisasi 15.000 + rugi kurs 5.000) + aturan PSAK 118/IFRS 18 (rekonsiliasi wajib, efek pajak, prominence) vs SEC Reg G/Item 10(e) + adj analis; BARU M19 ajarkan format SEC (10-K/10-Q/8-K/DEF 14A) + disclosure OJK; BARU M22 ajarkan PSAK 338; interview Q17 memperkuat. Catatan: true-and-fair override, pengecualian konsolidasi/parent-only, crypto belum dibahas |
| 12.10 | Skill translasi praktis [CORE] | COVERED | toggle.js kini 8 topik (dari 5): tiap topik punya seksi 'Penyesuaian analis' + quiz komparabilitas; lede 'Transaksi Sama, Angka Beda'; M14 explorer tab dampak 'samakan dulu, baru bandingkan' + quiz M14 Q5; M21 journal lensa investasi ('daftar 3 penyesuaian sebelum bandingkan margin & ROE') |
| 13 | Catatan praktis Indonesia | COVERED | BARU landing section 'Catatan Praktis Indonesia' (Topik 13): OJK keterbukaan informasi (fakta material wajib diumumkan segera); IDX (idx.co.id gratis, LK auditan PSAK + disclosure OJK, kebiasaan analis: unduh 5 tahun, bangun time series sendiri); penomoran PSAK 3 digit (116/115/109/118); spesifik Indonesia (PSAK 338 grup keluarga + lensa forensik, PSAK 370, standar syariah); bahasa Indonesia & rupiah; 5 tips baca LK IDX (CALK dulu, laba vs CFO 3–5 thn, KAM, dividen vs FCFE, peta grup & afiliasi). M19 (idx.co.id) memperkuat. Catatan: ambang audit Rp50M & pairing IDX-vs-AS belum diajarkan |

## Perubahan status vs ronde 1

| Topik | Ronde 1 | Ronde 2 | Pemicu |
|---|---|---|---|
| 2.4 | PARTIAL | COVERED | Row baru 'Paket laporan lengkap (2.4)' di M1 & M2 |
| 2.5 [CORE] | MISSING | COVERED | Modul 19 (filing EDGAR/IDX) |
| 3.4 | PARTIAL | COVERED | Row baru 'Laporan perubahan ekuitas (ringkas)' di M2 |
| 8.4 | PARTIAL | COVERED | Modul 23 (covenant & perjanjian kredit) |
| 9.3 | MISSING | COVERED | Modul 20 (intangibles & goodwill) |
| 10.6 [CORE fraud] | PARTIAL | COVERED | Modul 22 (pihak berelasi & tunneling) |
| 10.8 [CORE] | PARTIAL | COVERED | casefiles.js: +Wirecard, Jiwasraya, SNP Finance, Indosurya (6 kasus full) |
| 11.2 | PARTIAL | COVERED | Modul 24 (multiples: P/E, EV/EBITDA, P/B, PEG) |
| 12.1 | MISSING | COVERED | Modul 21 tabel 'sys' (principles vs rules) |
| 12.5 | PARTIAL | COVERED | Toggle topik baru 'CECL vs ECL (12.5)' |
| 12.7 | MISSING | COVERED | Modul 21 tabel 'prov' (PSAK 237) |
| 12.8 | PARTIAL | COVERED | Toggle topik baru 'Sewa: split US GAAP (12.8)' |
| 12.9 | PARTIAL | COVERED | Toggle topik baru 'Disclosure & MPM (12.9)' + M19 (format SEC) + M22 (PSAK 338) |
| 13 | PARTIAL | COVERED | Landing section 'Catatan Praktis Indonesia' |
| 10.7 | PARTIAL | COVERED | +3 tool forensik di workbench (duplicate_detector, gap_analysis, redflag_scan) |
| 11.4 | PARTIAL | COVERED | +fetch_edgar_facts: tarik companyfacts XBRL live dari SEC EDGAR API (terverifikasi) |

## Daftar perbaikan untuk koordinator

1. **10.7 Teknik data forensik [PARTIAL]** — tambahkan journal-entry testing, duplicate/gap analysis, analisis teks MD&A (workbench sudah punya benford/dso/beneish).
2. **11.4 Toolkit analis [PARTIAL]** — implementasikan tarik EDGAR XBRL live (bukan contoh offline), scraping PDF IDX, dan contoh SQL multi-emiten.
3. **10.8 Kasus terkenal [COVERED, celah minor]** — Luckin Coffee & Asabri belum ada sama sekali; Satyam hanya disebut satu baris.
4. **12.9 Presentasi & disclosure [COVERED, celah minor]** — true-and-fair override, pengecualian konsolidasi & parent-only statements, dan perlakuan crypto belum dibahas.
5. **13 Catatan praktis Indonesia [COVERED, celah minor]** — ambang audit Rp50M dan latihan pairing IDX-vs-AS belum diajarkan.
6. **8.4 Covenant [COVERED, celah minor]** — kata 'incurrence' tidak disebut eksplisit (hanya dideskripsikan sebagai opsi quiz).

## Catatan metode

- review/ (120 soal spaced repetition) adalah auto-generated dari quiz 24 modul — memperkuat retensi, tidak menambah cakupan topik baru.
- interview/ (18 Q&A) memperkuat topik yang sudah diajarkan (DCF, multiples, Beneish, ECL, sewa, MPM, opini audit) — bukan pengajaran baru.
- analisis-mingguan/ adalah template menulis analyst note dwibahasa — alat praktik, bukan materi topik.
- simulator.js kasus 4–6 (hard) memperkuat Part 10 (channel stuffing, kapitalisasi beban, 'bersih' sebagai jawaban) — bukan topik baru.
- Lede modul-19–24/index.html hanya struktural (pola A/B/C sama seperti 18 modul) — isi pengajaran ada di js/modulN.js.
