/* FSA Lab — Modul 44: Lab Excel dari Nol — Bangun Model 3-Laporan dari Nol di Excel (PT Cemerlang Abadi, Rp juta; angka kanonis CANONICAL-DATA.md; forecast 2026 & sensitivitas ILUSTRATIF dari M31) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
asumsi:{ title:"Langkah 1 · Sheet Asumsi — satu sumber kebenaran: semua angka hanya diketik sekali, di sini", cols:["Asumsi / driver","Angka 2026","Konteks"],
 rows:[
  {l:"Penjualan 2026 = 520.000 × (1 + 12%)", v:"582.400", v2:"growth +12%",
   d:"Satu-satunya asumsi 'makro' model ini. Di Excel: =Asumsi!B5*(1+Asumsi!B24) — penjualan 2025 dikali satu tambah growth. Jangan ketik 582.400 sebagai angka mati: bila growth diubah ke 18%, penjualan harus ikut bergerak sendiri.",
   psak:"M31", f:"Investasi: setiap 1 pp growth ≈ 5.200 penjualan dan ±1.419 NI — growth adalah tuas valuasi terbesar sekaligus asumsi paling rapuh. Kredit: penjualan yang tumbuh 12% tanpa penjelasan sumber pertumbuhan (volume vs harga) = proyeksi yang belum diuji. Forensik: growth yang diketik manual di IS, bukan di-link dari Asumsi, adalah hardcode yang lolos dari sensitivitas."},
  {l:"Gross margin 35% → HPP = 582.400 × 65%", v:"378.560", v2:"laba kotor 203.840",
   d:"HPP = penjualan × (1 − GM). GM dipegang 35% (sama dengan 2025) → HPP 378.560, laba kotor 203.840. Rumus di IS: =C4*(1-Asumsi!B25). Margin adalah asumsi independen dari growth — keduanya bisa bergerak berlawanan arah.",
   psak:"M31", f:"Investasi: GM −2pp memotong NI 9.085 — lebih tajam dari efek growth ±6pp. Turunannya: penjualan 2026 582.400 × 2% = 11.648 laba kotor hilang; setelah pajak 22% tersisa 11.648 × (1 − 0,22) = 11.648 × 0,78 = 9.085,44 ≈ 9.085 — dan NI 53.695 − 9.085 = 44.610, cocok dengan skenario margin di Langkah 5. Kredit: margin yang 'dipegang tetap' selamanya adalah asumsi malas; tanya apa yang melindungi margin dari kenaikan bahan baku. Forensik: margin yang naik sendiri tanpa penjelasan struktur biaya = asumsi yang paling sering dipakai mempercantik model."},
  {l:"Beban operasi +10% = 121.000 → EBIT 82.840", v:"82.840", v2:"vs 72.000",
   d:"Opex = 110.000 × 1,10 = 121.000 → EBIT = 203.840 − 121.000 = 82.840. Opex tumbuh lebih lambat dari penjualan (+10% vs +12%): ada sedikit operating leverage di sini — dan asumsi itu harus eksplisit, bukan kebetulan rumus.",
   psak:"M31", f:"Investasi: operating leverage bekerja dua arah — bila penjualan meleset, EBIT jatuh lebih cepat. Kredit: opex yang tumbuh lebih lambat dari penjualan menaikkan coverage ke 5,92x — tetapi hanya bila disiplin biaya benar-benar terjadi. Forensik: opex yang 'lupa' naik mengikuti inflasi = laba yang digelembungkan diam-diam."},
  {l:"DSO 73 · DIO 103,67 · DPO 66,95 hari (dihitung dari aktual 2025)", v:"ΔWC −14.960", v2:"piutang 116.480",
   d:"Driver modal kerja dihitung dari aktual 2025, bukan diketik: DSO = 104.000 ÷ 520.000 × 365 = 73 hari; DIO = 96.000 ÷ 338.000 × 365 = 103,67; DPO = 62.000 ÷ 338.000 × 365 = 66,95. Piutang 2026 = 73 ÷ 365 × 582.400 = 116.480; persediaan = 103,67 ÷ 365 × 378.560 = 107.520; utang usaha = 66,95 ÷ 365 × 378.560 = 69.440. ΔWC = −(12.480 + 11.520) + (7.440 + 1.600) = −14.960.",
   psak:"M31", f:"Investasi: pertumbuhan 'memakan' kas — makin cepat tumbuh, makin besar kas tertahan di WC. Kredit: DSO/DIO/DPO tetap = asumsi disiplin penagihan tak berubah; DSO melar 10 hari saja menelan 15.956 kas. Forensik: WC days yang diketik manual (bukan rumus dari aktual) mudah 'disesuaikan' agar CFO terlihat bagus."},
  {l:"Tarif pajak 22% · depresiasi 32.000 · capex 50.000 · dividen 6.000", v:"NI 53.695", v2:"PBT 68.840",
   d:"Pajak = 22% × PBT 68.840 = 15.144,8 → NI = 68.840 − 15.144,8 = 53.695. Depresiasi 32.000 adalah beban non-kas (ditambahkan kembali di CFS); capex 50.000 adalah kas keluar (CFI); dividen 6.000 mengurangi laba ditahan dan kas. Tiga angka ini sering tertukar fungsinya — di Excel, masing-masing hanya boleh muncul di satu tempat yang benar.",
   psak:"M31", f:"Investasi: capex 50.000 > depresiasi 32.000 = perusahaan masih ekspansi; aset tetap neto naik 18.000 ke 248.000. Kredit: dividen 6.000 kecil terhadap NI 53.695 — payout 11,2% memberi ruang menahan kas. Forensik: depresiasi yang 'lupa' ditambahkan kembali di CFS = CFO yang understated 32.000."},
  {l:"Bunga flat 14.000 — utang bank TETAP 141.440", v:"141.440", v2:"31.440 + 110.000",
   d:"Utang bank pendek 31.440 + panjang 110.000 = 141.440 TETAP — tidak ada penarikan atau pelunasan baru; liabilitas sewa tetap 60.000. Karena utang tidak bergerak, bunga flat 14.000 dan model TIDAK sirkular — tarif implisitnya 14.000 ÷ 141.440 = 9,9% per tahun. Ini keputusan sadar, bukan kelalaian — lihat Langkah 4.",
   psak:"M31", f:"Investasi: D/E turun 1,52x → 1,24x BUKAN karena utang dibayar, melainkan ekuitas naik (laba ditahan 79.440 → 127.135). Kredit: seluruh kebutuhan kas growth ditutup dari kas internal — tidak ada fasilitas baru yang perlu dinegosiasi. Forensik: utang naik tetapi bunga tak naik = bunga disubsidi atau disembunyikan — red flag."}
 ]},
bangun:{ title:"Langkah 2 · Bangun IS / BS / CFS — rumus ter-link, bukan angka ketik", cols:["Baris model","Angka 2026","Konteks"],
 rows:[
  {l:"IS 2026: penjualan → HPP → EBIT → PBT → NI", v:"53.695", v2:"68.840 − 15.144,8",
   d:"Setiap baris IS adalah rumus yang menunjuk ke baris di atasnya atau ke sheet Asumsi: penjualan =Asumsi!B5*(1+Asumsi!B24); HPP =C4*(1-Asumsi!B25); EBIT =C6-C7; pajak =C10*Asumsi!B27; NI =C10-C11. Aturan emas: satu angka hanya diketik sekali (di Asumsi); di IS ia hanya boleh muncul sebagai referensi.",
   psak:"M31", f:"Investasi: NI 53.695 (+18,7% vs 45.240) adalah hasil asumsi, bukan ramalan — ubah growth 1 pp dan NI bergerak 1.419. Kredit: EBIT 82.840 menutup bunga 14.000 sebanyak 5,92x. Forensik: NI yang diketik manual di IS (bukan =PBT−pajak) adalah angka yang tidak bisa dilacak — tolak."},
  {l:"BS: piutang, persediaan, utang usaha dari DSO/DIO/DPO", v:"116.480", v2:"107.520 · 69.440",
   d:"Piutang =Asumsi!B34/365*IS!C4 → 116.480. Persediaan =Asumsi!B35/365*IS!C5 → 107.520. Utang usaha =Asumsi!B36/365*IS!C5 → 69.440. Ketiga saldo ini BUKAN asumsi terpisah — mereka adalah konsekuensi aritmetika dari penjualan, HPP, dan hari. Ubah growth, ketiganya bergerak.",
   psak:"M31", f:"Investasi: saldo WC adalah 'kas yang diparkir' di operasi — 116.480 + 107.520 − 69.440 = 154.560 kas tertahan. Kredit: piutang yang tumbuh secepat penjualan = disiplin penagihan terjaga; piutang yang tumbuh lebih cepat = penjualan yang belum jadi kas. Forensik: piutang yang dihitung dari DSO 'baru' yang diketik manual = cara halus mengecilkan WC."},
  {l:"BS: kas = kas awal + Δkas (dari CFS) · laba ditahan roll-forward", v:"36.175", v2:"127.135",
   d:"Kas 2026 = 21.440 + Δkas (dari CFS) = 36.175 — kas TIDAK dihitung dari asumsi sendiri; ia adalah plug yang benar, hasil dari seluruh model. Laba ditahan = 79.440 + NI 53.695 − dividen 6.000 = 127.135. Dua baris ini adalah jembatan antara ketiga laporan: kas menghubungkan BS–CFS, laba ditahan menghubungkan BS–IS.",
   psak:"M31", f:"Investasi: kas naik 14.735 walau growth menahan 14.960 di WC — CFO 70.735 menutup capex dan dividen. Kredit: kas 36.175 adalah buffer likuiditas pertama bila penjualan meleset. Forensik: kas yang diketik manual agar neraca balance = plug yang menyembunyikan kesalahan — kas harus selalu datang dari CFS."},
  {l:"CFS indirect: CFO = NI + depresiasi + ΔWC", v:"70.735", v2:"53.695+32.000−14.960",
   d:"CFO = 53.695 + 32.000 − 14.960 = 70.735. ΔWC diambil dari DELTA tiap pos BS (bukan asumsi terpisah): Δpiutang −12.480, Δpersediaan −11.520, Δutang usaha +7.440, Δutang pajak +1.600. Tanda adalah jebakan klasik: kenaikan aset = kas keluar (negatif), kenaikan liabilitas = kas masuk (positif).",
   psak:"M31", f:"Investasi: dari NI 53.695 hanya 70.735 yang jadi kas operasi — dan growth menelan sebagian lewat WC. Kredit: CFO 70.735 ÷ bunga 14.000 = 5,05x — ini interest coverage berbasis CFO, BUKAN debt-service coverage: debt service mencakup pokok + bunga, jadi jangan samakan 5,05x dengan DSCR. Jangan pula samakan dengan 5,92x (EBIT ÷ bunga) — itu interest coverage berbasis laba. Tiga rasio, tiga pembilang, tiga arti. Forensik: ΔWC yang diketik sebagai satu angka (bukan dari delta BS) adalah tempat favorit menyembunyikan selisih."},
  {l:"CFI −50.000 · CFF −6.000 → Δkas 14.735 → kas akhir 36.175", v:"14.735", v2:"70.735−50.000−6.000",
   d:"CFI = capex −50.000. CFF = dividen −6.000 (utang neto 0 — tidak ada penarikan/pelunasan). Δkas = 70.735 − 50.000 − 6.000 = 14.735; kas awal 21.440 → kas akhir 36.175. Kas akhir inilah yang harus sama persis dengan kas di BS — bila tidak sama, ada arus yang hilang di CFS.",
   psak:"M31", f:"Investasi: FCFF ≈ 70.735 + 14.000×(1−0,22) − 50.000 = 31.655 — growth didanai kas internal. Kredit: tidak ada utang baru berarti tidak ada covenant baru yang dinegosiasi. Forensik: Δkas yang tidak sama dengan perubahan kas di BS = CFS tidak lengkap — cek baris per baris."}
 ]},
check:{ title:"Langkah 3 · Balance Check — 7 uji artikulasi sebelum model dipercaya", cols:["Uji artikulasi","Selisih","Konteks"],
 rows:[
  {l:"Cek 1 · NI = PBT − pajak", v:"53.695", v2:"68.840 − 15.144,8",
   d:"Uji pertama dan termurah: 68.840 − 15.144,8 = 53.695. Bila NI di IS tidak sama dengan PBT dikurangi pajak, kesalahan ada di baris pajak — tarif yang menunjuk ke sel yang salah, atau pajak yang dihitung dari EBIT (lupa mengurangi bunga).",
   psak:"M31", f:"Investasi: NI yang salah 1.000 menggeser valuasi berkali-kali lipat lewat kelipatan laba. Kredit: NI salah berarti laba ditahan salah, ekuitas salah, D/E salah. Forensik: NI ≠ PBT − pajak adalah kesalahan aritmetika, bukan perbedaan pendapat."},
  {l:"Cek 2 · Balance check: A − (L + E) = 0", v:"0", v2:"508.175 = 508.175",
   d:"Total aset 508.175 harus sama dengan total liabilitas 281.040 + total ekuitas 227.135 = 508.175. Selisih ≠ 0 berarti ada satu (atau lebih) baris yang tidak ter-link: rumus putus, angka ketik, atau satu laporan memakai asumsi yang berbeda dari laporan lain.",
   psak:"M31", f:"Investasi: neraca yang tidak balance = model yang belum selesai — jangan pakai angkanya untuk keputusan apa pun. Kredit: A ≠ L+E berarti ekuitas atau utang salah saji — D/E dan coverage ikut salah. Forensik: selisih yang 'ditutup' dengan plug kas adalah kesalahan yang disembunyikan, bukan diperbaiki."},
  {l:"Cek 3 · ΔWC dari delta BS, bukan dari asumsi", v:"−14.960", v2:"−12.480−11.520+7.440+1.600",
   d:"Hitung ΔWC dua kali dari dua arah: (a) dari delta tiap pos BS — piutang +12.480, persediaan +11.520, utang usaha +7.440, utang pajak +1.600 → −14.960; (b) dari baris ΔWC di CFS. Keduanya harus sama. Bila beda, satu pos WC di CFS menunjuk ke sel yang salah — utang pajak yang lupa ikut adalah tersangka pertama.",
   psak:"M31", f:"Investasi: ΔWC adalah jembatan laba-ke-kas; jembatan yang salah membuat CFO salah. Kredit: ΔWC yang understated membuat CFO terlihat lebih besar — kapasitas bayar yang palsu. Forensik: selisih 14.960 yang 'kebetulan' sama dengan ΔWC = tanda satu komponen ΔWC hilang atau berbalik tanda."},
  {l:"Cek 4 · CFO = NI + depresiasi + ΔWC", v:"70.735", v2:"53.695+32.000−14.960",
   d:"53.695 + 32.000 − 14.960 = 70.735. Tiga komponen, tiga jebakan: depresiasi yang lupa ditambahkan kembali (CFO understated 32.000), ΔWC yang tandanya terbalik (CFO overstated 29.920), dan NI yang diambil dari baris PBT (CFO overstated 15.145).",
   psak:"M31", f:"Investasi: CFO adalah kas yang benar-benar dihasilkan operasi — salah 10.000 di sini menggeser FCFF dan valuasi. Kredit: CFO dipakai menghitung debt service coverage — CFO yang overstated = kreditur yang tertipu. Forensik: CFO yang tidak bisa direkonsiliasi dari NI = CFS yang dibangun dari angka, bukan dari laporan."},
  {l:"Cek 5 · Δkas = CFO + CFI + CFF", v:"14.735", v2:"70.735−50.000−6.000",
   d:"70.735 − 50.000 − 6.000 = 14.735. Uji ini menangkap arus yang hilang: capex yang lupa masuk CFI, dividen yang lupa masuk CFF, atau penarikan utang yang tercatat di BS tetapi tidak di CFS. Δkas harus sama dengan perubahan kas di BS (36.175 − 21.440 = 14.735).",
   psak:"M31", f:"Investasi: Δkas menghubungkan proyeksi kas ke saldo kas — bila tidak cocok, kas akhir di BS adalah fiksi. Kredit: Δkas negatif yang tidak dijelaskan = perusahaan membakar kas — tanya dari mana kekurangannya ditutup. Forensik: CFF yang tidak mencatat penarikan utang = utang yang muncul di BS tanpa jejak kas."},
  {l:"Cek 6 · Laba ditahan roll-forward", v:"127.135", v2:"79.440+53.695−6.000",
   d:"79.440 + 53.695 − 6.000 = 127.135. Laba ditahan adalah satu-satunya baris ekuitas yang bergerak — bila ia diketik manual, ekuitas tidak lagi mengikuti NI dan neraca tidak akan pernah balance walau semua rumus lain benar. Roll-forward adalah rantai yang tidak boleh putus.",
   psak:"M31", f:"Investasi: laba ditahan yang salah menggeser ekuitas dan D/E — 1,24x bisa jadi 1,52x tanpa ada yang sadar. Kredit: ekuitas adalah buffer pertama kreditur; ekuitas yang overstated = buffer yang palsu. Forensik: dividen yang lupa dikurangkan = laba ditahan yang overstated 6.000 — cek dividen di dua tempat (BS dan CFS)."},
  {l:"Cek 7 · Kas akhir CFS = kas di BS", v:"36.175", v2:"21.440+14.735",
   d:"Kas akhir CFS (21.440 + 14.735 = 36.175) harus sama dengan kas di BS (36.175). Ini uji penutup yang mengikat ketiga laporan sekaligus: bila kas tidak sama, minimal satu dari enam cek sebelumnya ada yang lolos palsu — kembali ke Cek 2 dan lacak selisihnya.",
   psak:"M31", f:"Investasi: kas adalah satu-satunya pos yang muncul di dua laporan (BS dan CFS) — ia adalah segel model. Kredit: kas akhir 36.175 adalah likuiditas yang bisa dipakai membayar utang — kas yang tidak cocok = likuiditas yang tidak bisa dipercaya. Forensik: kas yang cocok di kedua laporan tetapi dari rumus yang berbeda = dua kesalahan yang saling menutupi."}
 ]},
circ:{ title:"Langkah 4 · Circularity — lingkaran bunga dan cara memutusnya", cols:["Soal","Jawaban","Konteks"],
 rows:[
  {l:"Kenapa sirkular: bunga ← rata-rata utang ← kas ← laba ← bunga", v:"lingkaran", v2:"4 mata rantai",
   d:"Bunga yang benar dihitung dari RATA-RATA utang: bunga = rate × (utang awal + utang akhir) ÷ 2. Tetapi utang akhir bergantung pada kas akhir (utang menutup kekurangan kas), kas akhir bergantung pada laba, dan laba bergantung pada bunga. Empat mata rantai yang menutup lingkaran — Excel menyebutnya circular reference.",
   psak:"M31", f:"Investasi: model sirkular yang tidak disadari memberi NI yang 'terlihat' benar tetapi berubah tiap kali file dibuka ulang. Kredit: bunga yang dihitung dari utang yang belum final = coverage yang belum final. Forensik: bunga yang diklaim 'dari rata-rata utang' tetapi utang akhirnya diketik manual = klaim tanpa jejak."},
  {l:"Cara M31 menghindarinya: utang bank TETAP 141.440 → bunga flat 14.000", v:"14.000", v2:"tanpa iterasi",
   d:"M31 memutus lingkaran di mata rantai pertama: utang bank diasumsikan tetap (31.440 + 110.000 = 141.440, tanpa penarikan/pelunasan), sehingga rata-rata utang = saldo utang = 141.440 dan bunga flat 14.000 tanpa iterasi. Harga yang dibayar: model tidak bisa menjawab 'bagaimana bila perusahaan menarik utang baru' — tetapi untuk forecast satu tahun dengan kas internal yang cukup, harga itu murah.",
   psak:"M31", f:"Investasi: asumsi 'tetap' yang eksplisit dan diberi alasan lebih jujur daripada utang dinamis yang dihitung setengah-setengah. Kredit: utang tetap berarti tidak ada fasilitas baru — kapasitas pinjaman yang tidak terpakai tetap tersedia sebagai cadangan. Forensik: model yang mengklaim utang dinamis tetapi bunganya flat = inkonsisten internal — utang naik tetapi bunga tak naik."},
  {l:"Bila utang dibuat dinamis: aktifkan iterative calculation", v:"File → Options", v2:"Formulas → Enable iterative",
   d:"Bila utang akhir memang harus dinamis (misalnya utang menutup defisit kas), Excel bisa menyelesaikan lingkaran dengan iterative calculation: File → Options → Formulas → centang 'Enable iterative calculation', maksimum iterasi 100, maximum change 0,001. Excel lalu menghitung berulang sampai bunga dan utang saling cocok dalam toleransi.",
   psak:"—", f:"Investasi: iterasi memberi jawaban yang konsisten secara internal — tetapi jawabannya bergantung pada tebakan awal dan toleransi. Kredit: model iteratif yang tidak didokumentasikan = angka yang tidak bisa direplikasi kreditur lain. Forensik: iterative calculation yang aktif tanpa catatan = cara menyembunyikan circularity dari reviewer."},
  {l:"Risiko iterasi: tidak konvergen, sensitif tebakan awal, lambat", v:"3 risiko", v2:"waspada",
   d:"Tiga risiko: (1) lingkaran bisa tidak konvergen — Excel berputar 100 iterasi tanpa pernah cocok, dan menampilkan angka terakhir yang salah; (2) hasil sensitif terhadap nilai awal — ubah satu input, jawaban melompat; (3) file menjadi lambat dan rapuh — satu rumus baru bisa memicu perhitungan ulang yang tak berujung. Aturan praktis: pakai iterasi hanya bila utang dinamis benar-benar dibutuhkan, dan selalu laporkan bahwa model memakai iterasi.",
   psak:"—", f:"Investasi: NI dari model iteratif yang tidak konvergen adalah angka yang berubah-ubah — jangan jadikan dasar valuasi. Kredit: covenant yang dihitung dari model iteratif = covenant yang goyah. Forensik: file yang 'kadang' memberi angka berbeda untuk input yang sama = tanda iterasi tidak konvergen — minta model non-sirkular sebagai pembanding."}
 ]},
sens:{ title:"Langkah 5 · Sensitivitas — 4 skenario M31: apa yang paling menggerakkan model", cols:["Skenario","Laba bersih","CFO"],
 rows:[
  {l:"Growth +18% (+6pp): penjualan 613.600", v:"62.213", v2:"CFO 72.584",
   d:"Penjualan 613.600 → NI 62.213 (+8.518 vs base). Tetapi CFO hanya naik 1.849 (70.735 → 72.584): ΔWC −21.629 menelan sebagian besar tambahan laba. Growth menaikkan laba, tetapi pertumbuhan itu sendiri menahan kas — inilah 'growth eats cash'.",
   psak:"M31", f:"Investasi: dari +8.518 laba, hanya +1.849 yang jadi kas — valuasi berbasis laba melebih-lebihkan manfaat growth. Kredit: CFO yang hanya naik 1.849 berarti headroom debt service hampir tidak membaik walau laba naik 15,9%. Forensik: model yang memproyeksi NI tanpa WC akan mengklaim CFO naik 8.518 — salah 6.669."},
  {l:"Gross margin 33% (−2pp): HPP 390.208", v:"44.610", v2:"CFO 58.759",
   d:"HPP = 582.400 × 67% = 390.208 → NI 44.610 (−9.085), CFO 58.759 (−11.976). Efek margin ke kas LEBIH BESAR dari efek growth ±6pp: margin adalah tuas yang lebih tajam — dan yang paling sering dimanipulasi.",
   psak:"M31", f:"Investasi: margin −2pp menghapus 16,9% NI — sensitivitas terbesar di model ini. Kredit: coverage jatuh dari 5,92x ke 5,09x (EBIT 71.192 ÷ 14.000) — masih di atas 3,0x, tetapi headroom menyusut. Forensik: margin yang 'naik sendiri' tanpa penjelasan struktur biaya = asumsi yang paling sering dipakai mempercantik model jualan."},
  {l:"WC +10 hari (DSO/DIO/DPO): ΔWC −30.916", v:"53.695", v2:"CFO 54.779",
   d:"DSO/DIO/DPO masing-masing +10 hari: NI tetap 53.695 — P&L tidak tersentuh. Tetapi CFO anjlok ke 54.779 (−15.956) karena ΔWC −30.916. Laba bukan kas: model yang hanya memproyeksi P&L akan melewatkan lubang kas ini sepenuhnya.",
   psak:"M31", f:"Investasi: efisiensi modal kerja adalah 'laba' yang tidak muncul di income statement — tetapi muncul di kas. Kredit: DSO melar 10 hari menekan CFO 22,6% — debt service coverage ikut tertekan walau laba tetap. Forensik: perusahaan yang labanya naik tetapi kasnya turun = WC yang membengkak — cek piutang dan persediaan dulu."},
  {l:"WC −10 hari (efisien): ΔWC +996", v:"53.695", v2:"CFO 86.691",
   d:"DSO/DIO/DPO masing-masing −10 hari: NI tetap 53.695; CFO naik ke 86.691 (+15.956) karena ΔWC hampir nol (+996). Perbaikan 10 hari di tiap mata rantai membebaskan kas 15.956 — setara 29,7% NI — tanpa satu rupiah pun tambahan penjualan.",
   psak:"M31", f:"Investasi: perbaikan WC adalah sumber kas termurah — tanpa capex, tanpa utang, tanpa menaikkan harga. Kredit: CFO 86.691 menutup bunga 14.000 sebanyak 6,19x — headroom terbesar di antara semua skenario. Forensik: WC yang 'membaik' 10 hari dalam satu tahun tanpa perubahan proses = klaim yang perlu bukti — minta bukti penagihan dan perputaran persediaan."}
 ]}
};

function fmtStmt(key){
  var s = STMTS[key], h = '<table class="stmt"><tr><th>'+s.cols[0]+'</th><th style="text-align:right">'+s.cols[1]+'</th><th style="text-align:right">'+s.cols[2]+'</th></tr>';
  s.rows.forEach(function(r,i){
    h += '<tr class="clickable" data-stmt="'+key+'" data-i="'+i+'"><td>'+r.l+'</td><td class="val">'+r.v+'</td><td class="val" style="color:var(--ink-soft)">'+r.v2+'</td></tr>';
  });
  return h + '</table><p class="sub" style="font-size:.82rem">'+s.title+'</p>';
}
function renderStmt(key){
  $("#stmt-wrap").innerHTML = fmtStmt(key);
  $$("#stmt-wrap tr.clickable").forEach(function(tr){
    tr.addEventListener("click", function(){
      var r = STMTS[tr.dataset.stmt].rows[+tr.dataset.i];
      $("#explain").innerHTML = '<h3>'+r.l+'</h3>'
        + '<p>'+r.d+'</p>'
        + (r.psak && r.psak !== "—" ? '<span class="tag">'+r.psak+'</span>' : '')
        + (r.f && r.f !== "—" ? '<div class="forensic"><strong>Tiga lensa:</strong> '+r.f+'</div>' : '');
      $("#explain").scrollIntoView({behavior:"smooth", block:"nearest"});
    });
  });
}
$$(".stmt-tab[data-stmt]").forEach(function(b){
  b.addEventListener("click", function(){
    $$(".stmt-tab[data-stmt]").forEach(function(x){x.classList.remove("active");});
    b.classList.add("active"); renderStmt(b.dataset.stmt);
  });
});
renderStmt("asumsi");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Skenario 1: di template, growth diubah 12% → 18% di sheet Asumsi", q1:"Laba bersih vs base", q2:"CFO vs base", a1:"naik", a2:"naik",
  e:"Penjualan 613.600 → NI 62.213 (+8.518); CFO 72.584 (+1.849). Karena semua rumus ter-link ke Asumsi, satu perubahan mengalir ke IS, BS, dan CFS sekaligus — dan balance check tetap 0. Inilah gunanya membangun dari Asumsi, bukan mengetik angka di tiap sheet."},
 {t:"Skenario 2: gross margin diubah 35% → 33% di sheet Asumsi", q1:"Laba bersih vs base", q2:"CFO vs base", a1:"turun", a2:"turun",
  e:"NI 44.610 (−9.085), CFO 58.759 (−11.976). Efek margin ke kas lebih besar dari efek growth ±6pp — margin adalah tuas yang lebih tajam. Perhatikan: HPP naik juga menaikkan persediaan dan utang usaha (keduanya dihitung dari HPP), sehingga ΔWC ikut bergerak."},
 {t:"Skenario 3: DSO/DIO/DPO masing-masing +10 hari", q1:"Laba bersih vs base", q2:"CFO vs base", a1:"tetap", a2:"turun",
  e:"NI tetap 53.695 — P&L tak tersentuh. CFO anjlok ke 54.779 (−15.956): ΔWC −30.916. Di template, ubah DSO/DIO/DPO di Asumsi dan saksikan CFO jatuh sementara NI diam — pelajaran 'laba bukan kas' yang terlihat di layar."},
 {t:"Skenario 4: DSO/DIO/DPO masing-masing −10 hari (efisien)", q1:"Laba bersih vs base", q2:"CFO vs base", a1:"tetap", a2:"naik",
  e:"NI tetap 53.695; CFO naik ke 86.691 (+15.956) karena ΔWC hampir nol (+996). Efisiensi modal kerja membebaskan kas tanpa tambahan penjualan — dan di template, ini hanya soal mengubah tiga angka hari di Asumsi."},
 {t:"Capex dinaikkan 10.000 (50.000 → 60.000) di sheet Asumsi", q1:"Laba bersih vs base", q2:"Kas akhir vs base", a1:"tetap", a2:"turun",
  e:"NI tetap 53.695 — capex tidak menyentuh P&L (hanya depresiasi di tahun-tahun berikut yang berubah). Kas akhir turun 10.000 (36.175 → 26.175) karena CFI −60.000; aset tetap neto naik 10.000 (248.000 → 258.000) dan neraca tetap balance."},
 {t:"Dividen dinaikkan 6.000 (6.000 → 12.000) di sheet Asumsi", q1:"Laba bersih vs base", q2:"Kas akhir vs base", a1:"tetap", a2:"turun",
  e:"NI tetap 53.695 — dividen bukan beban, ia pembagian laba. Kas akhir turun 6.000 (36.175 → 30.175) dan laba ditahan turun 6.000 (127.135 → 121.135): kedua sisi neraca turun sama besar, balance check tetap 0."}
];
var OPTS3 = ["naik","turun","tetap"];
var pgScore = 0, pgDone = 0, pgCards = [];
function renderPg(){
  var h = "";
  CARDS.forEach(function(c,i){
    h += '<div class="quiz-q" id="pg'+i+'"><h3>Kartu '+(i+1)+': '+c.t+'</h3>';
    [["q1",c.q1],["q2",c.q2]].forEach(function(qq){
      h += '<p class="sub" style="margin:.4rem 0 .2rem">'+qq[1]+' akan…</p><div class="pg-opts">';
      OPTS3.forEach(function(o){ h += '<button data-card="'+i+'" data-q="'+qq[0]+'" data-opt="'+o+'">'+o+'</button>'; });
      h += '</div>';
    });
    h += '<button class="btn btn-primary" data-tx="'+i+'" style="margin-top:.6rem">Cek</button><div class="pg-result" id="pgr'+i+'"></div></div>';
  });
  $("#pg-wrap").innerHTML = h;
  $$("#pg-wrap .pg-opts button").forEach(function(b){
    b.addEventListener("click", function(){
      var sib = b.parentElement.querySelectorAll("button");
      sib.forEach(function(x){x.classList.remove("sel");}); b.classList.add("sel");
    });
  });
  $$("#pg-wrap [data-tx]").forEach(function(b){
    b.addEventListener("click", function(){ checkPg(+b.dataset.tx); });
  });
}
function checkPg(i){
  var c = CARDS[i], ok = 0;
  var sels = ["q1","q2"].map(function(qq){
    return document.querySelector('#pg'+i+' button[data-q="'+qq+'"].sel');
  });
  var r = $("#pgr"+i);
  var n = sels.filter(Boolean).length;
  if(n < 2){
    r.className = "pg-result show";
    r.innerHTML = "Jawab kedua ukuran dulu ("+n+"/2 terisi) — jawaban sebagian tidak dinilai.";
    return;
  }
  ["q1","q2"].forEach(function(qq,k){
    var sel = sels[k], ans = k===0?c.a1:c.a2;
    var btns = $$('#pg'+i+' button[data-q="'+qq+'"]');
    btns.forEach(function(x){
      x.classList.remove("right","wrong");
      if(x.dataset.opt === ans) x.classList.add("right");
      else if(x === sel) x.classList.add("wrong");
    });
    if(sel && sel.dataset.opt === ans) ok++;
  });
  r.className = "pg-result show";
  r.innerHTML = "<strong>"+ok+"/2 benar.</strong> "+c.e;
  if(pgCards.indexOf(i) < 0){
    pgScore += ok; pgDone += 2; pgCards.push(i);
    $("#pg"+i).dataset.scored = "1";
    try{ localStorage.setItem("fsa_pg_m44", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
  }
  $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  r.scrollIntoView({behavior:"smooth", block:"center"});
}
renderPg();

/* ---------- LAB HITUNGAN ---------- */
function parseIDNumber(str, isDecimal){
  var s = String(str||"").trim().replace(/\s/g,"");
  if(!s) return NaN;
  /* F3: validasi token penuh */
  if(/[^0-9.,\-+]/.test(s)) return NaN;  // karakter ilegal
  if(/--/.test(s) || /\+\+/.test(s)) return NaN;  // tanda ganda
  if(/\d-\d/.test(s) || /\d\+\d/.test(s)) return NaN;  // tanda di tengah (1-2)
  var dots = (s.match(/\./g)||[]).length;
  var commas = (s.match(/,/g)||[]).length;
  if(isDecimal){
    /* R17-F1: format Indonesia penuh — titik ribuan valid (diikuti kelipatan 3 digit + koma desimal) dilucuti dulu */
    s = s.replace(/\.(?=\d{3}(?:\.\d{3})*,)/g, "");
    var d2 = (s.match(/\./g)||[]).length, c2 = (s.match(/,/g)||[]).length;
    if(d2 + c2 > 1) return NaN;  // R1/F3: max 1 pemisah desimal
    s = s.replace(",",".");
  } else {
    if(s.indexOf(",")>=0){
      /* format Indonesia: 1.234,56 */
      if(dots > 0 && commas !== 1) return NaN;
      s = s.replace(/\./g,"").replace(",",".");
    } else if(/^-?0\./.test(s)){
      /* 0.xxx selalu desimal */
      if(dots !== 1) return NaN;
    } else {
      var parts = s.split(".");
      if(parts.length > 2){
        if(parts.slice(1).every(function(p){ return p.length === 3; }) && parts[0] !== "0" && parts[0] !== "-0"){
          s = parts.join("");  // ribuan bertingkat: 1.000.000 -> 1000000
        } else {
          return NaN;  // F3: 1.2.3 ditolak
        }
      } else if(parts.length === 2 && parts[1].length === 3 && parts[0] !== "0" && parts[0] !== "-0"){
        s = parts.join("");  // ribuan: 1.000 -> 1000
      } else if(parts.length === 2 && parts[1].length !== 3){
        /* desimal biasa: 2.26 tetap */
      } else if(parts.length === 2){
        return NaN;  // ambiguous
      }
    }
  }
  /* tanda hanya di depan */
  if(/-/.test(s.slice(1)) || /\+/.test(s.slice(1))) return NaN;
  var v = parseFloat(s);
  return isNaN(v) ? NaN : v;
}

var RATIOS = [
 {q:"Laba bersih forecast 2026 (Rp juta)", hint:"PBT 68.840 − pajak 15.144,8 (22%)", ans:53695, dec:false, tol:1,
  why:"53.695 = 68.840 − 15.144,8. Di template: IS!C12 =C10-C11 — NI yang ter-link, bukan ketik."},
 {q:"CFO forecast 2026 — indirect method (Rp juta)", hint:"NI 53.695 + depresiasi 32.000 + ΔWC (−14.960)", ans:70735, dec:false, tol:1,
  why:"70.735 = 53.695 + 32.000 − 14.960. ΔWC dari delta BS — bila ΔWC diketik manual, uji artikulasi Cek 3 akan menangkapnya."},
 {q:"Kas akhir 2026 (Rp juta)", hint:"Kas awal 21.440 + Δkas 14.735 (CFO 70.735 − capex 50.000 − dividen 6.000)", ans:36175, dec:false, tol:1,
  why:"36.175 = 21.440 + 14.735. Kas akhir CFS harus sama dengan kas di BS — uji penutup yang mengikat ketiga laporan."},
 {q:"Balance check 2026: Total aset − (Total liabilitas + Total ekuitas) (Rp juta)", hint:"Total aset 508.175; total liabilitas 281.040 + total ekuitas 227.135", ans:0, dec:false, tol:1,
  why:"0 — 508.175 = 281.040 + 227.135. Selisih ≠ 0 berarti ada rumus putus; jangan tutup dengan plug kas."},
 {q:"ΔWC 2026 (Rp juta)", hint:"−(12.480 + 11.520) + (7.440 + 1.600) — kenaikan aset negatif, kenaikan liabilitas positif", ans:-14960, dec:false, tol:1,
  why:"−14.960 = −12.480 − 11.520 + 7.440 + 1.600. Tanda adalah jebakan klasik: piutang dan persediaan naik menelan kas, utang naik menahan kas."},
 {q:"Utang bank dibuat dinamis — pelunasan diambil dari kas akhir — dan bunga dihitung dari rata-rata utang. Apa yang terjadi di Excel?", hint:"Ikuti rantainya: bunga → laba → kas → utang → bunga…",
  mc:["Excel menghitung normal seperti biasa — bunga dari rata-rata utang adalah rumus standar yang tidak pernah sirkular di model keuangan",
      "Circular reference — bunga butuh utang akhir, utang butuh kas, kas butuh laba, laba butuh bunga",
      "Excel otomatis mengaktifkan iterative calculation sendiri tanpa perlu pengaturan apa pun dari pengguna",
      "Rumus bunga berubah menjadi nol karena rata-rata utang tidak terdefinisi"], a:1,
  why:"Circular reference — lingkaran utang → kas → laba → bunga hanya bisa diselesaikan dengan iterative calculation, atau diputus dengan asumsi utang tetap seperti M31."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>';
    if(r.mc){
      h += '<div class="pg-opts" style="justify-content:flex-start;flex-wrap:wrap">';
      r.mc.forEach(function(o,j){ h += '<button data-mc="'+i+'" data-opt="'+j+'">'+o+'</button>'; });
      h += '</div><div class="ratio-in"><button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div>';
    } else {
      h += '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Ketik jawabanmu…">'
        + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div>';
    }
    h += '</div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap .pg-opts button").forEach(function(b){
    b.addEventListener("click", function(){
      var sib = b.parentElement.querySelectorAll("button");
      sib.forEach(function(x){x.classList.remove("sel");}); b.classList.add("sel");
    });
  });
  $$("#ratio-wrap button[data-r]").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var el = $("#rr"+i);
      el.className = "pg-result show";
      var ok;
      if(r.mc){
        var sel = document.querySelector('button[data-mc="'+i+'"].sel');
        if(!sel){ el.innerHTML = "Pilih dulu salah satu jawaban, baru tekan Cek."; return; }
        ok = (+sel.dataset.opt === r.a);
        $$('button[data-mc="'+i+'"]').forEach(function(x){
          x.classList.remove("right","wrong");
          if(+x.dataset.opt === r.a) x.classList.add("right");
          else if(x === sel) x.classList.add("wrong");
        });
      } else {
        var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
        if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu."; return; }
        ok = Math.abs(v - r.ans) <= r.tol;
      }
      el.innerHTML = ok ? "<strong>Tepat ✓</strong> "+r.why : "<strong>Belum tepat.</strong> "+r.why;
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — kamu baru saja membangun model Cemerlang dari blank workbook: NI 53.695, CFO 70.735, kas akhir 36.175, balance check 0. Tulis 3 baris: asumsi mana yang paling menentukan valuasi bila model ini dipakai menilai saham, satu skenario sensitivitas yang kamu jalankan di template, dan keputusanmu (beli / tunggu / hindari) + SATU hal yang membunuh tesismu.",
 credit:"Lensa kredit — model ini memproyeksi D/E 1,24x, coverage 5,92x, CFO 70.735 vs bunga 14.000, utang bank flat 141.440. Tulis 3 baris: skenario mana yang paling mengancam kemampuan bayar (growth? margin? WC?), satu covenant yang kamu tulis berdasarkan model ini, dan keputusanmu.",
 forensic:"Lensa forensik — model ini 'menghindari' circularity dengan utang tetap, memegang GM 35% dan DSO/DIO/DPO tetap, dan ΔWC dari delta BS. Tulis 3 baris: asumsi 'tetap' mana yang paling mencurigakan, satu angka yang kamu cek ulang ke sumber (CANONICAL-DATA / M31), dan satu temuan yang membuatmu menolak model ini mentah-mentah."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m44_"+k) || ""; }catch(e){}
  $("#journal-text").value = v;
  updCount();
}
function updCount(){
  var n = $("#journal-text").value.length;
  $("#journal-count").textContent = n + " karakter";
  $("#journal-status").textContent = n > 0 ? "Tersimpan otomatis ✓" : "Belum ada catatan.";
}
$$(".journal-tabs .stmt-tab").forEach(function(b){
  b.addEventListener("click", function(){ setLens(b.dataset.lens); });
});
$("#journal-text").addEventListener("input", function(){
  try{ localStorage.setItem("fsa_journal_m44_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"Di Excel, rumus piutang usaha 2026 yang benar bila DSO dipegang 73 hari adalah…", o:["Penjualan 2025 × 73 ÷ 365 — memakai penjualan tahun lalu","Penjualan 2026 × 73 ÷ 365 — memakai penjualan tahun berjalan","HPP 2026 × 73 ÷ 365 — memakai HPP tahun berjalan","Piutang 2025 + penjualan 2026 × 73 ÷ 365 — menambah saldo lama ke arus baru"], a:1},
 {q:"Balance check menunjukkan A − (L+E) = 14.960. Langkah pelacakan pertama yang paling tepat adalah…", o:["Menambah kas 14.960 agar neraca balance — selisih kecil boleh ditutup plug","Menghapus rumus laba ditahan lalu mengetik 127.135 secara manual","Mengubah tarif pajak sampai laba bersih bergeser 14.960","Cek ΔWC di CFS vs delta tiap pos WC di BS — 14.960 = ΔWC base"], a:3},
 {q:"Beban bunga 2026 menjadi sirkular (circular reference) di Excel ketika…", o:["Utang akhir bergantung pada kas akhir, kas pada laba, dan laba pada bunga","Tarif pajak berubah di tengah tahun sehingga pajak tangguhan ikut bergerak","Dividen yang dibayar lebih besar dari laba bersih tahun berjalan","Depresiasi dihitung dengan metode saldo menurun, bukan garis lurus"], a:0},
 {q:"Di template, skenario WC +10 hari (DSO/DIO/DPO) menghasilkan NI dan CFO…", o:["NI 53.695, CFO 54.779 — laba tetap, kas turun","NI 44.610, CFO 58.759 — laba dan kas sama-sama turun","NI 62.213, CFO 72.584 — laba dan kas sama-sama naik","NI 53.695, CFO 86.691 — laba tetap, kas naik 15.956"], a:0},
 {q:"Mengapa sheet Asumsi dipisah dari sheet IS, BS, dan CFS?", o:["Agar file terlihat rapi dan jumlah sheet-nya genap","Agar angka aktual 2025 tidak perlu dicantumkan di mana pun","Agar satu perubahan asumsi mengalir ke semua laporan lewat rumus ter-link","Agar template tetap bisa dibuka di Excel lama tanpa mengaktifkan perhitungan otomatis"], a:2}];
(function(){
  var h = "";
  QUIZ.forEach(function(q,i){
    /* Acak urutan opsi tiap pemuatan (Fisher-Yates); petakan ulang indeks jawaban benar ke posisi tampil baru — kunci jawaban tetap terlacak. */
    var order = q.o.map(function(_,k){ return k; });
    for(var k=order.length-1;k>0;k--){ var r=Math.floor(Math.random()*(k+1)), t=order[k]; order[k]=order[r]; order[r]=t; }
    q.a = order.indexOf(q.a);
    h += '<div class="quiz-q" id="qq'+i+'"><h3>'+(i+1)+'. '+q.q+'</h3>';
    order.forEach(function(oi,j){
      h += '<label><input type="radio" name="q'+i+'" value="'+j+'"> '+q.o[oi]+'</label>';
    });
    h += '</div>';
  });
  $("#quiz-wrap").innerHTML = h;
})();
$("#quiz-submit").addEventListener("click", function(){
  var score = 0, picked = [], skipped = [];
  QUIZ.forEach(function(q,i){
    var sel = document.querySelector('input[name="q'+i+'"]:checked');
    picked.push(sel ? +sel.value : -1);
    try{ if(window.FSAMistake && sel && +sel.value !== q.a)
           window.FSAMistake.log(44, i, "quiz"); }catch(e){}
    if(!sel) skipped.push(i+1);
    else if(+sel.value === q.a) score++;
  });
  var box = $("#gate-box");
  if(skipped.length){
    box.style.display = "block";
    box.innerHTML = "<h3>Belum lengkap</h3><p>Kamu melewatkan soal: <strong>"+skipped.join(", ")+"</strong>. Jawab dulu semuanya, baru submit.</p>";
    box.scrollIntoView({behavior:"smooth", block:"center"});
    return;
  }
  var pct = Math.round(score/QUIZ.length*100), passed = pct >= 80;
  QUIZ.forEach(function(q,i){
    $$('#qq'+i+' label').forEach(function(lb, j){
      lb.classList.remove("right","wrong");
      if(passed && j === q.a) lb.classList.add("right");
      else if(picked[i] === j && j !== q.a) lb.classList.add("wrong");
    });
  });
  box.style.display = "block";
  if(passed){
    box.innerHTML = "<h3>Modul 44 Tuntas ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu membangun model 3-laporan dari blank workbook: Asumsi sebagai satu sumber kebenaran, IS/BS/CFS ter-link rumus, balance check 0 lewat 7 uji artikulasi, circularity yang diputus dengan utang tetap, dan sensitivitas yang menunjukkan margin sebagai tuas tertajam. Kembali ke <a href=\"/\">FSA Lab</a>.</p>";
    try{ localStorage.setItem("fsa_gate_m44","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m44") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m44") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m44") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Modul 44 Tuntas ✓</h3><p>Modul 44 sudah kamu lewati sebelumnya — kembali ke <a href=\"/\">FSA Lab</a>.</p>";
  }
}catch(e){}
})();
