# Audit Cakupan Topik FSA Lab vs Peta Topik Instinct

Tanggal: 3 Nov 2026. Metode: 4 auditor paralel membaca penuh js/modul1–18.js, 18 lede modul-N/index.html, toggle/index.html, js/simulator.js, js/casefiles.js, workbench/. Aturan ketat: COVERED = diajarkan eksplisit dengan contoh/angka; PARTIAL = disinggung tanpa pengajaran penuh; MISSING = tidak ada bukti (tanpa tebakan).

## Ringkasan

- **COVERED: 51 / PARTIAL: 12 / MISSING: 4** (dari 67 topik)
- MISSING: **2.5** (sumber filing EDGAR/IDX — [CORE] ⚠️), **9.3** (intangibles & goodwill), **12.1** (karakter framework), **12.7** (provisi & kontinjensi)
- PARTIAL prioritas [CORE]: **10.8** (kasus terkenal — baru Garuda+Enron+WorldCom), **10.6** (pihak berelasi & tunneling — [CORE fraud path])
- PARTIAL lain: 2.4, 3.4, 8.4 (covenant), 11.2 (multiples), 11.4 (toolkit), 12.5 (CECL), 12.8 (split sewa US GAAP), 12.9 (disclosure), 13 (praktis Indonesia)

## Matriks cakupan

| No | Topik | Status | Bukti |
|---|---|---|---|
| 2.1 | Persamaan akuntansi & double-entry | COVERED | M1 explorer BS baris TOTAL ASET: 401.000 = 228.000 + 173.000; M1 html playground 'Satu transaksi menyentuh minimal dua akun' + kartu 1–6 tebak efek transaksi |
| 2.2 | Akrual vs kas | COVERED | M1 explorer CF forensic 'Laba bisa dimanipulasi jauh lebih mudah daripada arus kas operasi'; M1 quiz Q2 (CFO < laba = red flag); M9 explorer 'Piutang usaha' penjualan +89% vs tunai; M6 lede laba +53% vs FCFF −6.280 |
| 2.3 | Artikulasi 3 laporan | COVERED | M1 explorer BS 'Laba ditahan: naik 38.800 = 46.800 − 8.000 ✓ Artikulasi!'; CF 'Kas awal → akhir 44.200 → 35.000 Berartikulasi dengan neraca ✓'; playground 'skill mekanik paling penting di FSA' |
| 2.4 | Paket laporan keuangan lengkap | PARTIAL | M2 explorer BS 'Utang bank jangka panjang' d: jadwal jatuh tempo ada di catatan; M7 explorer 5 baris catatan + 5 baris kamus opini audit. MD&A, laporan perubahan ekuitas sebagai laporan, paket penuh tidak dibahas |
| 2.5 | Sumber filing (EDGAR/IDX) [CORE] | MISSING | - |
| 3.1 | Laporan laba rugi [CORE] | COVERED | M1 explorer tab IS 9 baris (penjualan→laba bersih) + forensic per baris; M1 ratio lab gross margin 40,0% & net margin 9,75%; M3 explorer margin 35,0%/13,8%/8,7% |
| 3.2 | Neraca [CORE] | COVERED | M1 explorer tab BS 17 baris (split lancar/non-lancar, basis pengukuran, struktur modal kerja); M4 explorer tab Modal Kerja |
| 3.3 | Laporan arus kas [CORE] | COVERED | M1 explorer CF 11 baris (operasi/investasi/pendanaan, metode tidak langsung) + forensic classification games; M10 explorer CFI/CFF berangka; M6 jembatan CFO→FCFF |
| 3.4 | Laporan perubahan ekuitas | PARTIAL | M1 explorer BS 'Laba ditahan' (pergerakan laba−dividen + forensic OCI); M3 playground kartu buyback Rp20.000; M12 OCI surplus revaluasi; M15 playground dividen/rights issue. Tidak diajarkan sebagai laporan tersendiri |
| 3.5 | Catatan atas laporan keuangan [CORE] | COVERED | M7 modul 'Membaca Catatan': 5 baris explorer catatan ber-PSAK + sudut forensik per baris; M7 ratio lab 'Empat angka yang hanya bisa dihitung kalau kamu baca catatan' |
| 3.6 | Audit & laporan auditor | COVERED | M7 explorer audit: 4 tipe opini + KAM (SA 700/705/570/701); playground kartu 1–3 (ganti auditor, KAM, going concern); quiz M7 Q1/Q2/Q4 |
| 4.1 | Common-size & tren [CORE] | COVERED | M3 explorer IS kolom % common-size; M3 quiz Q5; M2/M3 explorer YoY 2024 vs 2025; M6 explorer kolom '% CFO' + ratio lab FCFF margin −1,2% |
| 4.2 | Analisis margin [CORE] | COVERED | M1 ratio lab gross margin 40,0% & net margin 9,75%; M3 margin 35,0%/13,8%/8,7%; M8 margin EBIT 13,8% + margin segmen 15,0% vs 12,1%; M6 FCFF margin −1,2% |
| 4.3 | ROA, ROE, ROIC [CORE] | COVERED | M3 explorer 'Balance Sheet & Return': ROE 28,3%, ROA 10,9%, ROIC 15,8% (NOPAT 56.160 ÷ modal 354.540); M8 ROE diurai 5 langkah + ROA segmen 17,3%/14,0% |
| 4.4 | Dekomposisi DuPont | COVERED | M3 explorer baris ROE d: 'DuPont: 8,7% × 1,25 × 2,60 = 28,3% ✓'; M8 modul DuPont penuh (5 komponen berangka, 6 kartu playground, ratio lab, quiz) |
| 4.5 | Analisis segmen & geografis | COVERED | M8 explorer segmen Ritel vs Distribusi (penjualan, laba operasi, margin, aset, ROA) + PSAK 108 + tie-to-consolidated; quiz M8 Q3/Q5; case spin-off (modul-8/index.html) |
| 4.6 | Kualitas pendapatan | COVERED | M9 modul 'Kualitas Pendapatan': explorer penjualan +30% vs piutang +89% ('kualitas dipertanyakan') + forensic per baris; playground kartu 3; quiz M9 Q3 |
| 5.1 | Akrual & kualitas laba [CORE] | COVERED | M2 ratio lab 'Akrual (NI−CFO)' 14.440 + CFO/NI 0,68x; M6 lede laba +53% vs FCFF; M17 Sloan 3,2% (ambang 10%) + CFO/NI 0,68x + forensic pola 5 tahun; simulator 3 kasus pakai accrual gap |
| 5.2 | Pengakuan pendapatan [CORE] | COVERED | M1 explorer 'Penjualan' d: model 5 langkah, tag PSAK 115 = IFRS 15; M7 notes baris 1: 5 langkah dieja lengkap; M9 forensic 'Langkah 5 paling sering dimanipulasi'; M2 playground premature recognition Rp20.000 |
| 5.3 | Pengakuan beban & kapitalisasi [CORE] | COVERED | M2 playground kartu 2 'Trik inti WorldCom' (kapitalisasi beban Rp12.000); M1/M6 explorer forensic capex; M14 explorer 'Development cost' (PSAK vs GAAP); simulator Kasus 2 'Kapitalisasi beban (trik WorldCom)' Rp40.000; toggle topik kapitalisasi |
| 5.4 | Estimasi & pilihan kebijakan | COVERED | M7 notes baris 4–5: ECL staged berangka + PSAK 219/212 'murni estimasi manajemen' + sensitivitas aktuaria; M2 playground kartu 3 (perpanjang umur aset); M9 'estimasi retur bisa dipoles'; quiz M7 Q3 |
| 5.5 | Pos non-recurring & laba disesuaikan | COVERED | M9: laba jual aset 8.000 = one-off, continuing EPS 390, porsi one-off 13,8%; ratio lab Q2/Q3; playground kartu 2; quiz M9 Q2/Q5 |
| 5.6 | EPS: dasar, dilusian, per-saham | COVERED | M9 explorer EPS dasar 452,4 + dilusi 'tidak ada' (PSAK 233) + continuing EPS 390; playground buyback & stock split; quiz M9 Q1/Q4 |
| 6.1 | Kualitas arus kas operasi [CORE] | COVERED | M2 ratio lab CFO/NI 0,68x (turun dari 1,48x); M6 CFO 30.800 vs laba 45.240 + jembatan; M17 CFO/NI 0,68x pola 5 tahun; simulator CFO/NI 0,59x/0,69x/0,81x; casefiles Garuda 'laba tanpa kas' |
| 6.2 | Arus kas bebas [CORE] | COVERED | M6 modul Free Cash Flow: FCFF −6.280 + FCFE −5.760 berangka, ratio lab 4 ukuran, quiz Q1–Q5; M10 reinvestment ratio 160% |
| 6.3 | Siklus konversi kas [CORE] | COVERED | M4 ratio lab: DSO 73,0 + DIO 103,7 − DPO 67,0 = CCC 109,7 hari (dihitung dari angka); M2 ratio lab CCC 109,7; simulator screen DSO 54,8→89,2 & DPO 60,8→29,1 |
| 6.4 | Membaca arus investasi & pendanaan | COVERED | M1 explorer CF forensic 'pola Ponzi'; M2 'Utang bank (neto)' & dividen-dari-utang; M10 modul CFI (capex 48.000) & CFF (utang neto 11.440, dividen 6.000) + ratio lab + quiz + case ekspansi |
| 6.5 | Metode langsung vs tidak langsung | COVERED | M10 explorer 'Kas dari pelanggan (langsung)' 471.000 (PSAK 207); playground kartu 6 'Pindah ke metode langsung'; quiz M10 Q1; M1–M2 rekonsiliasi tidak langsung laba→CFO berangka |
| 7.1 | Komponen modal kerja & siklus operasi [CORE] | COVERED | M4 explorer tab 'Modal Kerja': piutang 104.000, persediaan 96.000, utang usaha 62.000, WC 119.440; M4 quiz Q5 definisi WC; M11 explorer piutang & stok berangka |
| 7.2 | Rasio turnover & hari [CORE] | COVERED | M4 ratio lab DSO 73,0/DIO 103,7/DPO 67,0 hari + playground 6 kartu; M3 perputaran aset 1,25x; simulator screen DSO & DPO; workbench dso_screen() |
| 7.3 | Akuntansi persediaan | COVERED | M1 explorer IS 'HPP' (FIFO/rata-rata, LIFO dilarang) + BS 'Persediaan' (lower of cost or NRV); M11 explorer FIFO vs rata-rata berangka + quiz Q2; toggle topik LIFO vs FIFO + reversal writedown |
| 7.4 | Piutang & ECL | COVERED | M7 notes ECL staged berangka; M11 explorer piutang (bruto 108.100, allowance 4.100, rate 3,8%, stage 1/2/3) + ratio lab + quiz; M16 ECL 3 stage penuh berangka (800+900+2.400=4.100 ✓) |
| 7.5 | Utang usaha & akrual jangka pendek | COVERED | M4 explorer 'Utang usaha' + DPO 67 hari, f: 'DPO melonjak = tunda bayar agar CFO bagus'; M2 explorer 'Utang pajak & beban akrual' 8.560 + playground kartu 6 stretch payables; M1 f: 'Utang tak tercatat = fraud family kedua' |
| 8.1 | Rasio likuiditas [CORE] | COVERED | M5 explorer tab 'Likuiditas': current ratio 2,17x + quick ratio 1,23x (dihitung); M5 ratio lab + quiz Q1–Q2; M1 ratio lab current ratio 2,27x |
| 8.2 | Leverage & struktur modal [CORE] | COVERED | M5 explorer tab 'Solvabilitas': D/E 1,52x, utang berbunga 201.440, Net debt/EBITDA 1,76x; M8 leverage 2,60x (DuPont); M10 playground obligasi → D/E naik; M3 leverage 2,60x |
| 8.3 | Rasio coverage [CORE] | COVERED | M1 explorer 'Beban bunga' f: interest coverage 72.000/12.000 = 6,0x; M2/M5 ratio lab interest coverage 5,14x; M15 RATIOS 'Interest coverage 2025: 72.000 ÷ 14.000 = 5,14x' |
| 8.4 | Covenant & perjanjian kredit | PARTIAL | Disinggung di M1 (leverage + covenant = motif fraud), M1 dividen (leakage), M5/M6/M7/M8/M10/M11/M13/M14 prompt jurnal kredit, M15 quiz ('D/E maksimum & coverage minimum'). Maintenance vs incurrence, definisi covenant, cure rights TIDAK pernah diajarkan |
| 8.5 | Model risiko kredit | COVERED | M15: 5 komponen Z (X1–X5 berangka), Z = 2,64, zona >2,99/1,81–2,99/<1,81, 6 kartu playground sensitivitas, quiz + jurnal rating internal |
| 8.6 | Eksposur off-balance-sheet | COVERED | casefiles.js Enron: SPE tak dikonsolidasi, flag-or-pass 1998–2000, reveal 'cari di catatan kaki'; M17 Enron row 'bandingkan utang tercatat vs footnote'; M1 explorer 'Liabilitas sewa' d: 'Dulu off-balance-sheet sebelum PSAK 73/116'; M7/M12 forensic |
| 9.1 | PP&E, depresiasi & capex | COVERED | M1 explorer 'Beban operasi' (depresiasi 28.000 non-kas) + quiz Q3 + CF forensic 'Capex < depresiasi = panen aset'; M2 playground kartu 3 (umur manfaat); M10 capex 48.000 + reinvestment ratio 160%; M12 explorer PPE penuh (tanah, depresiasi 30.000/thn) |
| 9.2 | Impairment | COVERED | M12 explorer imp: carrying 50.000 vs recoverable 42.000 (nilai pakai vs nilai wajar−biaya jual), rugi 8.000 + ratio lab + quiz Q1 + playground kartu 2; toggle topik reversal impairment (Rp8.000, goodwill tak boleh di-reverse) |
| 9.3 | Aset takberwujud & goodwill | MISSING | - |
| 9.4 | Sewa | COVERED | M1 explorer 'Liabilitas sewa' 54.000 + lancar 6.000, tag PSAK 116 = IFRS 16, f: sale-and-leaseback; M5 playground kartu 5; M7 notes baris sewa; M12 explorer ROU 58.000 + liabilitas 60.000 + playground kartu 4 + quiz Q3 + case 'Bangun vs Sewa' |
| 9.5 | Dasar instrumen keuangan | COVERED | M16 tabel klasifikasi AC/FVOCI/FVTPL + uji SPPI + contoh piutang Cemerlang + 6 kartu playground + quiz |
| 10.1 | Segitiga fraud & taksonomi [CORE] | COVERED | M13 explorer tri: tekanan/kesempatan/rasionalisasi + contoh Cemerlang + lensa forensik per baris + quiz Q1; M17 row + quiz; simulator 3 kasus = 3 keluarga (revenue/aset/liabilitas) |
| 10.2 | Beneish M-score & screen statistik | COVERED | M13 explorer ben: M-score −1,65, cutoff −1,78, DSRI 1,45/GMI 0,97/LVGI 0,96 + ratio lab + quiz; M17 M-score + RATIOS; workbench beneish_mscore() 8 variabel + contoh FLAG |
| 10.3 | Skema fraud pendapatan [CORE fraud] | COVERED | M1 explorer 'Penjualan' f: piutang naik > penjualan (channel stuffing); M2 IS f: penjualan +30% vs piutang +89%; M9 playground premature recognition Rp20.000; simulator Kasus 1 channel stuffing (DSO 54,8→89,2); casefiles Garuda (kontrak 15 tahun, piutang Mahata ~US$240jt, restatement) |
| 10.4 | Overstatement aset | COVERED | M1 explorer BS: persediaan (gudang fraud klasik), piutang fiktif, kas fiktif (Satyam); M2 playground kapitalisasi beban (WorldCom); simulator Kasus 2 kapitalisasi Rp40.000 + screen 'aset tetap naik tanpa capex' |
| 10.5 | Manipulasi arus kas & liabilitas | COVERED | M1 explorer CFO f: factoring piutang, tunda bayar supplier + 'Rekonsiliasi CFO ke saldo kas & pergerakan utang'; M2 playground kartu 4 (factoring Rp30.000) & kartu 6 (stretch payables); simulator Kasus 3 utang disembunyikan Rp25.000; M14 explorer 'Bunga dibayar' (klasifikasi → CFO tampak sehat) |
| 10.6 | Pihak berelasi & tunneling [CORE fraud] | PARTIAL | M1 explorer BS 'Piutang' f: 'Konsentrasi ke pihak berelasi?' (satu frasa); M7 quiz Q5 (satu soal); M17 playground 'penjualan ke pihak berelasi naik tajam'; casefiles Garuda reveal (piutang Mahata). PSAK 338, tunneling, pemetaan struktur grup TIDAK diajarkan |
| 10.7 | Teknik data forensik | PARTIAL | workbench fsa_toolkit.py: benford_test() + dso_screen() + beneish_mscore() + workflow screening massal di workbench/index.html. Journal-entry testing, duplicate/gap analysis, analisis teks MD&A tidak ada |
| 10.8 | Kasus terkenal [CORE] | PARTIAL | casefiles.js full flag-or-pass: Garuda 2018 (restatement, rugi US$175jt, sanksi OJK) & Enron (SPE, bangkrut Des 2001); simulator: WorldCom (kapitalisasi); Satyam disebut (M1). Wirecard, Luckin, Jiwasraya, Asabri, Indosurya, SNP Finance TIDAK ada |
| 11.1 | Normalisasi & forecasting | COVERED | M18: forecast 2026 berangka (penjualan 598.000 +15%, EBIT 82.524, NI 53.449) + 6 kartu playground uji asumsi (growth, margin, WACC, g, capex, skenario bear) + forensic 'Growth assumption = tempat optimism bias bersembunyi'; M9 continuing EPS 390 (normalisasi) |
| 11.2 | DCF & multiples | PARTIAL | M18: EV = FCFF ÷ (WACC−g) = 277.778 + bridge ke nilai ekuitas 97.778 + sensitivitas g/WACC. Multiples (EV/EBITDA, P/E, P/B) TIDAK diajarkan |
| 11.3 | Analisis skenario & stress | COVERED | M18 playground 'Skenario bear (growth 5%)' + forensic 'selalu uji skenario bear' + sensitivitas g & WACC; M6 playground 6 kartu sensitivitas |
| 11.4 | Toolkit analis | PARTIAL | workbench: 3 screen Python siap jalan (benford, dso, beneish) + workflow 'looping puluhan emiten IDX → urutkan by M-score'. Tarik EDGAR XBRL / scraping PDF IDX / SQL TIDAK diimplementasikan |
| 12.1 | Karakter framework | MISSING | - |
| 12.2 | Persediaan (LIFO/reversal) | COVERED | M1 explorer IS 'HPP' (LIFO dilarang di PSAK/IFRS); M11 'LIFO dilarang di PSAK'; M14 explorer baris LIFO (PSAK dilarang vs GAAP boleh) + LIFO reserve 12.000 + playground; toggle topik LIFO vs FIFO (COGS Rp1.000 vs Rp1.400) + topik reversal writedown Rp8.000 |
| 12.3 | PP&E & revaluasi | COVERED | M1 explorer BS 'Aset tetap neto' d: 'Revaluasi DIPERBOLEHKAN di PSAK (tidak di US GAAP)' + forensic appraiser; M12 explorer tanah (revaluasi) + playground kartu 1 (surplus → OCI); M14 explorer baris revaluasi; toggle topik revaluasi tanah +Rp50.000 (D/E turun, ROA turun) |
| 12.4 | Biaya pengembangan & intangibles | COVERED | M14 explorer 'Development cost' (PSAK kapitalisasi bila kriteria terpenuhi vs GAAP beban) + forensic 'WorldCom playbook — cek 6 syarat' + playground kartu 3 + quiz M14 Q4; toggle topik kapitalisasi Rp30.000 |
| 12.5 | ECL | PARTIAL | Model staged PSAK 109 diajarkan penuh (M7 notes, M11 explorer 3,8% + stages, M16 ECL 3 stage berangka). Perbandingan mekanik US CECL (lifetime day-one) TIDAK pernah dibahas |
| 12.6 | Klasifikasi laporan arus kas | COVERED | M1 explorer CF tag 'PSAK 207: bunga/dividen boleh di operasi atau pendanaan (US GAAP: bunga dibayar wajib operasi)'; M6 explorer; M14 explorer 'Bunga dibayar' + playground kartu 5 + quiz M14 Q3; toggle topik klasifikasi bunga Rp12.000 (CFO 53.800 vs 65.800) + adj 'samakan klasifikasi dulu' + catatan PSAK 118/2027 |
| 12.7 | Provisi & kontinjensi | MISSING | - |
| 12.8 | Sewa (split US GAAP) | PARTIAL | Model PSAK 116 diajarkan penuh (M1, M7 notes, M12 explorer ROU + liabilitas + EBITDA naik semu). Split operating/finance US GAAP TIDAK dibahas |
| 12.9 | Presentasi & disclosure | PARTIAL | Hanya satu baris: M1 explorer IS 'Laba operasi' f: 'Mulai 2027, PSAK 118 mewajibkan subtotal laba operasi'. MPMs, format SEC/OJK, PSAK 338/370/syariah, crypto tidak dibahas |
| 12.10 | Skill translasi praktis [CORE] | COVERED | toggle.js: tiap topik punya seksi 'Penyesuaian analis' + quiz komparabilitas; lede 'Transaksi Sama, Angka Beda'; M14 explorer tab dampak 'samakan dulu, baru bandingkan' + quiz M14 Q5 |
| 13 | Catatan praktis Indonesia | PARTIAL | Terminologi Indonesia + rupiah + penomoran PSAK baru konsisten di semua modul; kasus Garuda (sanksi OJK, PSAK 115); tag PSAK 109; workbench 'emiten IDX'. Filing stack IDX/OJK, ambang audit Rp50M, grup keluarga/PSAK 338, pairing IDX-vs-AS tidak diajarkan |
