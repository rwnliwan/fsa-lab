/* Glosarium dwibahasa FSA Lab — istilah English + definisi Indonesia + rujukan.
   Dikumpulkan dari materi M1–M28 (rasio, forensik, syariah, ESOP, ESG, standar). */
(function () {
  "use strict";

  var TERMS = [
    {en:"Accrual", id:"Pencatatan pendapatan/beban saat hak & kewajiban terjadi, bukan saat kas berpindah.", ref:"M1 · PSAK 201"},
    {en:"Accrual Anomaly", id:"Pola akrual abnormal dibanding histori/peer; sinyal awal earnings management.", ref:"M13 · M25"},
    {en:"Accrual Ratio", id:"(Laba bersih − arus kas operasi) ÷ total aset; makin besar makin rendah kualitas laba.", ref:"M2 · M25"},
    {en:"Acid-Test Ratio", id:"(Aset lancar − persediaan) ÷ liabilitas lancar; likuiditas tanpa harus menjual stok.", ref:"M5"},
    {en:"Adverse Opinion", id:"Opini audit negatif: laporan keuangan tidak menyajikan secara wajar.", ref:"M7"},
    {en:"Akad", id:"Perjanjian/kontrak yang menjadi dasar transaksi keuangan syariah.", ref:"M26 · PSAK 401"},
    {en:"Altman Z-Score", id:"Skor kebangkrutan dari 5 rasio; cut-off tergantung varian — klasik (publik): <1,81 distress, 1,81–2,99 grey, >2,99 safe; Z′ (perusahaan privat): <1,23 distress, 1,23–2,90 grey, >2,90 safe; Z″ (non-manufaktur): <1,10 distress, 1,10–2,60 grey, >2,60 safe.", ref:"M15 · M25"},
    {en:"Amortisation", id:"Pengakuan bertahap diskon atau premium ke beban bunga selama umur obligasi, sebesar beban bunga dikurangi kas kupon.", ref:"M40 · PSAK 109"},
    {en:"Asset Ceiling", id:"Batas pengakuan aset neto pensiun: surplus aset program atas DBO hanya diakui sampai sebesar manfaat ekonomi dari pengembalian dana atau pengurangan iuran masa depan.", ref:"M41 · PSAK 219"},
    {en:"Asset Turnover", id:"Penjualan ÷ total aset; efisiensi perusahaan memakai asetnya.", ref:"M3 · M8"},
    {en:"Audit Committee", id:"Komite dewan yang mengawasi pelaporan keuangan dan auditor eksternal.", ref:"M7"},
    {en:"Audit Opinion", id:"Pendapat auditor atas kewajaran laporan keuangan: wajar, pengecualian, atau menolak.", ref:"M7"},
    {en:"Balance Sheet", id:"Laporan posisi keuangan: aset = liabilitas + ekuitas pada satu tanggal.", ref:"M1 · PSAK 201"},
    {en:"Beneish M-Score", id:"Delapan rasio pendeteksi manipulasi laba; skor > −1,78 = flag (cutoff model 8-variabel klasik; varian 5-variabel memakai cutoff berbeda — jangan campur). Batas penerapan: hanya skrining awal, BUKAN bukti manipulasi; perusahaan bertumbuh cepat atau agresif akuisisi rawan false positive. Selalu verifikasi ke arus kas & CALK.", ref:"M13 · Workbench"},
    {en:"Benford's Law", id:"Digit pertama angka alami mengikuti pola logaritmik; deviasi besar layak diselidiki.", ref:"M28 · Workbench"},
    {en:"Big Bath", id:"Sengaja membesarkan rugi di tahun buruk agar tahun berikutnya tampak pulih.", ref:"M13 · M17"},
    {en:"Book Value", id:"Nilai ekuitas per saham menurut pembukuan.", ref:"M24"},
    {en:"Burn Rate", id:"Kecepatan kas habis per bulan; umur kas = kas ÷ burn rate.", ref:"M6"},
    {en:"CAGR", id:"Compound annual growth rate — rata-rata pertumbuhan tahunan majemuk.", ref:"M18"},
    {en:"CTA", id:"Cumulative translation adjustment: selisih penyeimbang agar neraca tertranslasi seimbang di bawah current-rate, dicatat di OCI dan terakumulasi di ekuitas; direklasifikasi ke laba rugi saat divestasi.", ref:"M39 · PSAK 221"},
    {en:"Capital Employed", id:"Modal yang dipakai operasi = ekuitas + utang berbunga.", ref:"M3"},
    {en:"Capital Expenditure (Capex)", id:"Belanja modal untuk aset jangka panjang; dikapitalisasi, bukan dibebankan.", ref:"M6 · M12 · PSAK 216"},
    {en:"Capitalization", id:"Mengubah pengeluaran menjadi aset; bila agresif = red flag klasik.", ref:"M12 · M17 · PSAK 216/238"},
    {en:"Carbon Footprint", id:"Total emisi gas rumah kaca dari aktivitas entitas.", ref:"M27"},
    {en:"Carrying Amount", id:"Nilai tercatat liabilitas obligasi pada biaya perolehan diamortisasi; bergerak menuju nilai nominal selama umur obligasi.", ref:"M40 · PSAK 109"},
    {en:"Cash Conversion Cycle", id:"Hari kas terikat operasi: DIO + DSO − DPO; makin pendek makin baik.", ref:"M4"},
    {en:"Cash Flow Statement", id:"Laporan arus kas: aktivitas operasi, investasi, dan pendanaan.", ref:"M1 · M10 · PSAK 207"},
    {en:"Cash Ratio", id:"Kas dan setara kas ÷ liabilitas lancar; uji likuiditas paling ketat.", ref:"M5"},
    {en:"Channel Stuffing", id:"Memaksa distributor menyerap stok agar penjualan tercatat lebih dini.", ref:"M11 · M13"},
    {en:"Chart of Accounts", id:"Daftar kode akun pembukuan perusahaan.", ref:"M1"},
    {en:"Cliff Vesting", id:"Hak opsi saham aktif sekaligus setelah melewati masa tunggu.", ref:"M27"},
    {en:"Combined Ratio", id:"(Klaim terjadi ditambah beban underwriting) dibagi premi yang diperoleh; di bawah 100 persen berarti underwriting untung.", ref:"M42 · PSAK 117"},
    {en:"Component Depreciation", id:"Depresiasi per komponen aset yang umur manfaatnya berbeda — mis. struktur 25 thn, atap 10 thn, lift 8 thn.", ref:"M37 · PSAK 216"},
    {en:"Consolidated Statements", id:"Laporan gabungan induk dan entitas anak yang dikendalikan.", ref:"M1 · PSAK 110"},
    {en:"Contingent Liability", id:"Kewajiban potensial; diungkap di catatan, belum diakui di neraca.", ref:"M21 · PSAK 237"},
    {en:"Contract Asset (Aset Kontrak)", id:"Hak atas imbalan untuk barang/jasa yang sudah diserahkan tetapi masih bersyarat (contract asset); beda dari piutang yang sudah tanpa syarat.", ref:"M34/M35 · PSAK 115"},
    {en:"Contract Liability (Liabilitas Kontrak)", id:"Kewajiban menyerahkan barang/jasa karena imbalan sudah diterima (atau jatuh tempo) lebih dulu; contoh: uang muka penjualan.", ref:"M34/M35 · PSAK 115"},
    {en:"Contractual Service Margin (CSM)", id:"Laba yang belum diakui dari kontrak asuransi: premi dikurangi fulfilment cash flows dan risk adjustment, dilepas ke laba selama masa coverage.", ref:"M42 · PSAK 117"},
    {en:"Convertible Bond", id:"Obligasi yang dapat ditukar menjadi saham; komponen liabilitas diukur dulu sebesar nilai wajar utang tanpa opsi, sisanya menjadi ekuitas.", ref:"M40 · PSAK 109"},
    {en:"Current-Rate Method", id:"Metode translasi laporan entitas anak asing: aset dan liabilitas memakai kurs penutup, laba rugi memakai kurs rata-rata, ekuitas memakai kurs historis, selisihnya (CTA) masuk OCI.", ref:"M39 · PSAK 221"},
    {en:"DBO (Defined Benefit Obligation)", id:"Nilai kini seluruh pembayaran pensiun masa depan yang dijanjikan, dihitung aktuaris dengan metode projected unit credit; ilustratif M41: 5.000 menjadi 5.610.", ref:"M41 · PSAK 219"},
    {en:"Defined Benefit Plan", id:"Program pensiun manfaat pasti: manfaat dijanjikan dengan rumus (gaji × masa kerja), risiko investasi dan aktuaria ditanggung pemberi kerja, DBO dan liabilitas neto tercatat di neraca.", ref:"M41 · PSAK 219"},
    {en:"Defined Contribution Plan", id:"Program pensiun iuran pasti: pemberi kerja hanya membayar iuran tetap, manfaat karyawan mengikuti akumulasi iuran plus hasil investasi, risiko ditanggung karyawan, tanpa DBO di neraca pemberi kerja.", ref:"M41 · PSAK 219"},
    {en:"Discount/Premium on Bonds", id:"Selisih antara harga terbit dan nilai nominal: diskon bila kupon di bawah suku bunga pasar, premium bila kupon di atas suku bunga pasar.", ref:"M40 · PSAK 109"},
    {en:"Early Extinguishment", id:"Pelunasan obligasi sebelum jatuh tempo; laba atau rugi sebesar nilai tercatat dikurangi harga beli kembali.", ref:"M40 · PSAK 109"},
    {en:"Effective Interest Method", id:"Metode yang menghitung beban bunga sebagai nilai tercatat dikali suku bunga pasar saat terbit; selisih dengan kas kupon adalah amortisasi diskon atau premium.", ref:"M40 · PSAK 109"},
    {en:"Financing Category", id:"Kategori laba-rugi untuk beban atas liabilitas pendanaan, seperti bunga utang; bagi entitas non-bank, bunga dibayar masuk kategori ini.", ref:"M43 · PSAK 118"},
    {en:"Fulfilment Cash Flows", id:"Arus kas masa depan kontrak asuransi (klaim dan beban ekspektasian) yang didiskonto ke nilai kini, ditambah risk adjustment.", ref:"M42 · PSAK 117"},
    {en:"Functional Currency", id:"Mata uang lingkungan ekonomi utama tempat entitas beroperasi, yang paling memengaruhi harga jual dan biaya; penentunya antara lain mata uang harga jual, biaya, dan pendanaan.", ref:"M39 · PSAK 221"},
    {en:"Hyperinflation", id:"Kondisi inflasi sangat tinggi sehingga laporan anak wajib dinyatakan kembali dengan indeks harga umum (IAS 29) sebelum ditranslasi dengan kurs penutup.", ref:"M39 · PSAK 221"},
    {en:"IFRS 18", id:"Standar pelaporan keuangan tentang penyajian dan pengungkapan laporan keuangan; menggantikan IAS 1 dan efektif 1 Jan 2027.", ref:"M43 · PSAK 118"},
    {en:"Insurance Revenue", id:"Pendapatan jasa asuransi PSAK 117: klaim ekspektasian yang terjadi ditambah beban ditambah pelepasan CSM — bukan premi kas.", ref:"M42 · PSAK 117"},
    {en:"Insurance Service Result", id:"Laba jasa asuransi: insurance revenue dikurangi insurance service expense (klaim aktual dan beban yang terjadi).", ref:"M42 · PSAK 117"},
    {en:"Investing Category", id:"Kategori laba-rugi untuk hasil aset yang memberi imbal hasil secara mandiri, seperti dividen dan bunga dari investasi serta hasil pelepasan aset investasi.", ref:"M43 · PSAK 118"},
    {en:"Management-Defined Performance Measure (MPM)", id:"Ukuran kinerja yang didefinisikan manajemen: subtotal laba-rugi yang dipakai manajemen dalam komunikasi publik dan bukan subtotal yang ditentukan IFRS; wajib direkonsiliasi ke subtotal IFRS terdekat.", ref:"M43 · PSAK 118"},
    {en:"Monetary Item", id:"Pos yang akan diterima atau dibayar dalam jumlah mata uang yang tetap atau dapat ditentukan, misalnya kas, piutang, dan utang; dinilai kembali dengan kurs penutup dan selisihnya masuk laba rugi.", ref:"M39 · PSAK 221"},
    {en:"Net Interest", id:"Tingkat diskonto dikali liabilitas neto awal periode, sama dengan interest cost atas DBO dikurangi interest income atas aset program; ilustratif M41: 350 dikurangi 294 sama dengan 56.", ref:"M41 · PSAK 219"},
    {en:"Operating Category", id:"Kategori laba-rugi untuk pendapatan dan beban dari aktivitas utama entitas; bersifat residual bagi pos yang tidak masuk investing atau financing.", ref:"M43 · PSAK 118"},
    {en:"Operating Profit", id:"Subtotal wajib PSAK 118: total kategori operating (pendapatan dan beban dari aktivitas utama); berdefinisi standar untuk semua entitas.", ref:"M43 · PSAK 118"},
    {en:"PSAK 118", id:"Pernyataan Standar Akuntansi Keuangan Indonesia yang mengadopsi IFRS 18: penyajian laba-rugi berkategori, subtotal wajib, dan pengungkapan MPM.", ref:"M43 · PSAK 118"},
    {en:"Premium Allocation Approach (PAA)", id:"Pendekatan sederhana PSAK 117 untuk kontrak pendek (coverage sampai 1 tahun): liabilitas sisa coverage mengikuti premi yang belum diakui.", ref:"M42 · PSAK 117"},
    {en:"Principal vs Agent (Prinsipal vs Agen)", id:"Prinsipal mengakui pendapatan bruto karena mengendalikan barang/jasa sebelum diserahkan; agen mengakui neto (komisi) karena hanya mengatur penyerahan pihak lain.", ref:"M34/M35 · PSAK 115"},
    {en:"Intra-Group Elimination (Eliminasi Intragrup)", id:"Saldo, transaksi, dan laba/rugi yang belum terealisasi antar entitas dalam satu grup dihapus penuh saat menyusun laporan konsolidasian.", ref:"M34/M35 · PSAK 110"},
    {en:"Cookie Jar Reserve", id:"Cadangan disembunyikan di tahun bagus untuk dipakai merapikan tahun jelek.", ref:"M13 · M17"},
    {en:"Cost of Goods Sold", id:"Harga pokok penjualan; pembanding utama margin kotor.", ref:"M3 · PSAK 202"},
    {en:"Cost Principle", id:"Aset dicatat sebesar biaya perolehan historisnya.", ref:"M1"},
    {en:"Covenant", id:"Syarat perjanjian utang; pelanggaran bisa mempercepat jatuh tempo.", ref:"M23"},
    {en:"Covenant Breach", id:"Pelanggaran syarat utang; sering memicu renegosiasi atau default teknis.", ref:"M23"},
    {en:"Creative Accounting", id:"Akuntansi agresif di batas aturan untuk mempercantik angka.", ref:"M13 · M17"},
    {en:"Credit Risk", id:"Risiko debitur/counterparty gagal memenuhi kewajiban.", ref:"M15 · M16"},
    {en:"Current Ratio", id:"Aset lancar ÷ liabilitas lancar; likuiditas jangka pendek.", ref:"M5"},
    {en:"Days Sales Outstanding (DSO)", id:"Rata-rata hari piutang tertagih; melonjak tajam = indikasi channel stuffing.", ref:"M11 · M13 · Workbench"},
    {en:"Debenture", id:"Obligasi tanpa jaminan aset spesifik; mengandalkan kelayakan kredit penerbit.", ref:"M23"},
    {en:"Deferred Revenue", id:"Pendapatan diterima di muka; dicatat sebagai liabilitas sampai jasa diserahkan.", ref:"M9 · PSAK 115"},
    {en:"Deferred Tax", id:"Pajak tangguhan dari perbedaan temporer akuntansi vs fiskal.", ref:"M21 · PSAK 212"},
    {en:"Depreciation", id:"Alokasi biaya aset tetap sepanjang umur manfaatnya.", ref:"M12 · PSAK 216"},
    {en:"Diluted EPS", id:"Laba per saham setelah memperhitungkan opsi, waran, dan konversi.", ref:"M9 · M36"},
    {en:"Disclaimer of Opinion", id:"Auditor tidak menyatakan pendapat, biasanya karena keterbatasan bukti.", ref:"M7"},
    {en:"Dividend Yield", id:"Dividen per saham ÷ harga saham.", ref:"M24"},
    {en:"Double Materiality", id:"Materialitas ganda ESG: dampak ke perusahaan DAN dampak perusahaan ke lingkungan/masyarakat.", ref:"M27"},
    {en:"Double-Entry", id:"Setiap transaksi dicatat berpasangan: debit dan kredit.", ref:"M1"},
    {en:"DuPont Analysis", id:"ROE diurai menjadi margin × perputaran aset × leverage.", ref:"M8"},
    {en:"Earnings Management", id:"Pengaturan laba dalam koridor aturan akuntansi.", ref:"M2 · M13"},
    {en:"Earnings Per Share (EPS)", id:"Laba bersih ÷ rata-rata saham beredar.", ref:"M9"},
    {en:"Earnings Quality", id:"Kualitas laba: seberapa tunai, berulang, dan bebas rekayasa laba tersebut.", ref:"M2 · M9"},
    {en:"EBIT", id:"Laba sebelum bunga dan pajak.", ref:"M3"},
    {en:"EBITDA", id:"Laba sebelum bunga, pajak, depresiasi, dan amortisasi; proksi kas operasi kotor.", ref:"M3 · M24"},
    {en:"Economic Moat", id:"Keunggulan kompetitif yang melindungi laba dari pesaing.", ref:"M18"},
    {en:"Employee Stock Option", id:"Hak karyawan membeli saham perusahaan pada harga tetap di masa depan.", ref:"M27"},
    {en:"Enterprise Value (EV)", id:"Kapitalisasi pasar + utang berbunga − kas; harga beli seluruh perusahaan.", ref:"M24"},
    {en:"Equity", id:"Hak residual pemilik atas aset setelah dikurangi seluruh liabilitas.", ref:"M1 · PSAK 201"},
    {en:"Equity Method", id:"Investasi pada asosiasi dicatat proporsional terhadap laba entitas investee.", ref:"M14 · M34/M35 · PSAK 228"},
    {en:"ESG", id:"Lensa lingkungan, sosial, dan tata kelola dalam menilai perusahaan.", ref:"M27"},
    {en:"ESOP", id:"Employee stock ownership plan — program kepemilikan saham karyawan.", ref:"M27"},
    {en:"Exercise Price", id:"Harga tebus opsi saham (strike price).", ref:"M27"},
    {en:"Fair Value", id:"Harga jual wajar antara pihak berpengetahuan dan berkehendak.", ref:"M14 · PSAK 113"},
    {en:"FIFO", id:"First-in, first-out: barang paling lama dijual duluan; di inflasi menghasilkan HPP terkecil dan laba terbesar.", ref:"M37 · PSAK 202"},
    {en:"Financial Leverage", id:"Penggunaan utang untuk memperbesar imbal hasil — sekaligus risiko.", ref:"M5 · M8"},
    {en:"Fiscal Year", id:"Tahun buku perusahaan; tidak selalu sama dengan tahun kalender.", ref:"M1"},
    {en:"Forensic Accounting", id:"Akuntansi investigatif untuk mendeteksi dan membuktikan kecurangan.", ref:"M13 · M17"},
    {en:"Fraud Triangle", id:"Tiga pemicu fraud: tekanan (pressure), kesempatan (opportunity), rasionalisasi.", ref:"M13"},
    {en:"Free Cash Flow", id:"Arus kas operasi − capex; kas bebas untuk pemilik dan kreditur.", ref:"M6"},
    {en:"GAAP", id:"Prinsip akuntansi berlaku umum; versi AS = US GAAP.", ref:"M14"},
    {en:"Gharar", id:"Ketidakpastian berlebihan yang dilarang dalam akad syariah.", ref:"M26"},
    {en:"Going Concern", id:"Asumsi entitas terus beroperasi; keraguan wajib diungkap.", ref:"M7 · M13 · PSAK 201"},
    {en:"Goodwill", id:"Selisih harga akuisisi di atas nilai wajar aset neto teridentifikasi.", ref:"M20 · PSAK 103"},
    {en:"Grant Date", id:"Tanggal pemberian opsi/RSU kepada karyawan.", ref:"M27"},
    {en:"Greenhouse Gas (GHG)", id:"Gas rumah kaca; diukur per Scope 1, 2, dan 3.", ref:"M27"},
    {en:"Greenwashing", id:"Klaim ramah lingkungan yang menyesatkan.", ref:"M27"},
    {en:"Gross Margin", id:"(Penjualan − HPP) ÷ penjualan.", ref:"M3"},
    {en:"Hedge Accounting", id:"Akuntansi lindung nilai; menunda volatilitas derivatif ke OCI.", ref:"M16 · PSAK 109"},
    {en:"Ijarah", id:"Akad sewa dalam keuangan syariah.", ref:"M26 · PSAK 407"},
    {en:"Impairment", id:"Penurunan nilai aset di bawah nilai tercatatnya.", ref:"M12 · M37 · PSAK 236"},
    {en:"Impairment Test", id:"Uji penurunan nilai tahunan, wajib untuk goodwill.", ref:"M20 · PSAK 236"},
    {en:"Income Statement", id:"Laporan laba rugi satu periode.", ref:"M1 · PSAK 201"},
    {en:"Intangible Asset", id:"Aset takberwujud: paten, merek, perangkat lunak.", ref:"M20 · PSAK 238"},
    {en:"Interest-Bearing Debt", id:"Utang berbunga; komponen kunci enterprise value.", ref:"M24"},
    {en:"Interest Coverage", id:"EBIT ÷ beban bunga; kemampuan membayar bunga utang.", ref:"M5 · M23"},
    {en:"Internal Control", id:"Pengendalian internal atas pelaporan keuangan; kelemahannya = kesempatan fraud.", ref:"M13"},
    {en:"Inventory Turnover", id:"HPP ÷ rata-rata persediaan; makin tinggi makin laku.", ref:"M4 · M11"},
    {en:"Istishna'", id:"Akad jual beli barang pesanan (manufaktur).", ref:"M26 · PSAK 404"},
    {en:"Journal Entry", id:"Jurnal pencatatan tiap transaksi.", ref:"M1"},
    {en:"Kiting", id:"Fraud memanfaatkan jeda kliring antar-rekening bank.", ref:"M28"},
    {en:"Lapping", id:"Menutup piutang nasabah A dengan pembayaran nasabah B; fraud kas klasik.", ref:"M28"},
    {en:"Ledger", id:"Buku besar: kumpulan seluruh akun perusahaan.", ref:"M1"},
    {en:"Leverage Ratio", id:"Ukuran ketergantungan pada utang, mis. D/E dan D/A.", ref:"M5"},
    {en:"LIFO", id:"Last-in, first-out: barang paling baru dijual duluan; DILARANG PSAK 202 — hanya diizinkan US GAAP.", ref:"M37"},
    {en:"LIFO Reserve", id:"Selisih persediaan FIFO minus LIFO; jembatan analis untuk menyetarakan laporan ber-LIFO ke basis FIFO.", ref:"M37"},
    {en:"Liquidity", id:"Kemampuan memenuhi kewajiban jangka pendek.", ref:"M5"},
    {en:"Market Capitalization", id:"Harga saham × jumlah saham beredar.", ref:"M24"},
    {en:"Matching Principle", id:"Beban diakui pada periode yang sama dengan pendapatan terkaitnya.", ref:"M1"},
    {en:"Materiality", id:"Ambang informasi yang dapat memengaruhi keputusan pengguna laporan.", ref:"M7"},
    {en:"Non-Controlling Interest (NCI)", id:"Kepentingan nonpengendali (KNP): bagian ekuitas entitas anak yang tidak dimiliki induk; disajikan terpisah di ekuitas konsolidasian (istilah lama: minority interest).", ref:"M1 · M34/M35 · PSAK 110"},
    {en:"Mudharabah", id:"Akad bagi hasil antara pemilik modal dan pengelola.", ref:"M26 · PSAK 405"},
    {en:"Murabahah", id:"Jual beli syariah dengan margin keuntungan yang disepakati di awal.", ref:"M26 · PSAK 402"},
    {en:"Musyarakah", id:"Akad kemitraan modal bersama dengan bagi hasil.", ref:"M26 · PSAK 406"},
    {en:"Net Margin", id:"Laba bersih ÷ penjualan.", ref:"M3"},
    {en:"Net Present Value (NPV)", id:"Nilai kini arus kas masa depan dikurangi investasi awal.", ref:"M18"},
    {en:"Normalized Earnings", id:"Laba yang disesuaikan dari pos non-rutin agar tren terbaca.", ref:"M24"},
    {en:"Notes to Financial Statements", id:"Catatan atas laporan keuangan; tempat red flag paling sering bersembunyi.", ref:"M7 · PSAK 201"},
    {en:"Off-Balance-Sheet", id:"Kewajiban atau aset yang tidak tampil di neraca.", ref:"M17 · M22"},
    {en:"One-Off Item", id:"Pos sekali terjadi; keluarkan dari analisis tren laba.", ref:"M2 · M9"},
    {en:"Operating Cash Flow", id:"Arus kas dari aktivitas operasi; pembanding utama kualitas laba.", ref:"M2 · M6 · PSAK 207"},
    {en:"Operating Lease", id:"Sewa operasi; kini umumnya tercatat on-balance-sheet.", ref:"M12 · PSAK 116"},
    {en:"Operating Margin", id:"Laba operasi ÷ penjualan.", ref:"M3"},
    {en:"Ponzi Scheme", id:"Skema membayar investor lama dengan dana investor baru.", ref:"M13"},
    {en:"Price-to-Book (P/B)", id:"Harga saham ÷ nilai buku per saham.", ref:"M24"},
    {en:"Price-to-Earnings (P/E)", id:"Harga saham ÷ laba per saham.", ref:"M24"},
    {en:"Pro Forma", id:"Laporan seolah-olah suatu transaksi sudah terjadi; bukan angka GAAP.", ref:"M14"},
    {en:"Profit Before Financing and Income Taxes", id:"Subtotal wajib PSAK 118: operating profit ditambah hasil kategori investing; laba sebelum beban pendanaan dan pajak.", ref:"M43 · PSAK 118"},
    {en:"Projected Unit Credit", id:"Metode pengukuran DBO: tiap tahun masa kerja dianggap menghasilkan satu unit manfaat pensiun tambahan, dihitung dengan proyeksi gaji akhir karyawan.", ref:"M41 · PSAK 219"},
    {en:"Provision", id:"Liabilitas yang waktu atau jumlahnya belum pasti.", ref:"M21 · PSAK 237"},
    {en:"Pyramid Scheme", id:"Skema rekrut berlapis tanpa produk riil.", ref:"M13"},
    {en:"Qualified Opinion", id:"Opini wajar dengan pengecualian atas hal tertentu.", ref:"M7"},
    {en:"Quick Ratio", id:"Rasio cepat = acid-test ratio.", ref:"M5"},
    {en:"Recoverable Amount", id:"Jumlah terpulihkan: nilai TERTINGGI antara nilai wajar dikurangi biaya pelepasan dan nilai pakai.", ref:"M37 · PSAK 236"},
    {en:"Reinsurance Held", id:"Reasuransi yang dibeli insurer, disajikan terpisah sebagai aset kontrak reasuransi beserta income dan expense-nya sendiri, bukan pengurang premi.", ref:"M42 · PSAK 117"},
    {en:"Related-Party Disclosure", id:"Pengungkapan pihak berelasi: nama, sifat hubungan, nilai transaksi.", ref:"M22 · PSAK 224"},
    {en:"Related-Party Transaction", id:"Transaksi dengan pihak berelasi; rawan transfer pricing dan tunneling.", ref:"M22 · PSAK 224"},
    {en:"Remeasurement", id:"Keuntungan atau kerugian aktuaria atas DBO plus selisih return aktual aset program di luar net interest; dicatat di OCI dan tidak direklasifikasi ke laba rugi.", ref:"M41 · PSAK 219"},
    {en:"Restatement", id:"Penyajian ulang laporan keuangan karena kesalahan atau kecurangan.", ref:"M13 · M17"},
    {en:"Restricted Stock Unit (RSU)", id:"Saham karyawan yang menjadi milik bertahap sesuai jadwal vesting.", ref:"M27"},
    {en:"Retained Earnings", id:"Saldo laba ditahan yang belum dibagikan sebagai dividen.", ref:"M1 · PSAK 201"},
    {en:"Return on Assets (ROA)", id:"Laba bersih ÷ total aset.", ref:"M3"},
    {en:"Return on Equity (ROE)", id:"Laba bersih ÷ ekuitas.", ref:"M3 · M8"},
    {en:"Return on Invested Capital (ROIC)", id:"NOPAT ÷ modal diinvestasikan; imbal hasil operasi murni.", ref:"M3 · M18"},
    {en:"Revenue", id:"Pendapatan dari kontrak dengan pelanggan.", ref:"M9 · PSAK 115"},
    {en:"Revenue Recognition", id:"Kapan pendapatan boleh diakui; lima langkah PSAK 115.", ref:"M9 · M13 · PSAK 115"},
    {en:"Riba", id:"Tambahan/bunga yang dilarang dalam keuangan syariah.", ref:"M26"},
    {en:"Risk Adjustment", id:"Kompensasi atas ketidakpastian jumlah dan waktu arus kas non-keuangan kontrak asuransi; dilepas ke laba seiring risiko mereda.", ref:"M42 · PSAK 117"},
    {en:"Round-Tripping", id:"Jual-beli bolak-balik antar pihak terkait untuk menggelembungkan pendapatan.", ref:"M17"},
    {en:"Salam", id:"Akad jual beli dengan pembayaran di muka, barang diserahkan kemudian.", ref:"M26 · PSAK 403"},
    {en:"Scope 1 / 2 / 3", id:"Klasifikasi emisi: langsung, dari energi, dan dari rantai nilai.", ref:"M27"},
    {en:"Segment Margin", id:"Margin laba per segmen operasi.", ref:"M8 · PSAK 108"},
    {en:"Segment Reporting", id:"Pelaporan kinerja per segmen operasi.", ref:"M8 · PSAK 108"},
    {en:"Service Cost", id:"Nilai kini unit manfaat pensiun yang dihasilkan karyawan selama periode berjalan (current service cost), ditambah past service cost dari amandemen program yang berlaku surut; keduanya masuk laba rugi.", ref:"M41 · PSAK 219"},
    {en:"Share Premium", id:"Agio saham: selisih harga jual di atas nilai nominal.", ref:"M1 · PSAK 201"},
    {en:"Shell Company", id:"Perusahaan cangkang tanpa operasi riil; kendaraan favorit fraud.", ref:"M17 · M22"},
    {en:"Skimming", id:"Mengambil kas sebelum tercatat dalam pembukuan.", ref:"M28"},
    {en:"Solvency", id:"Kemampuan membayar seluruh kewajiban jangka panjang.", ref:"M5"},
    {en:"Statement of Changes in Equity", id:"Laporan perubahan ekuitas satu periode.", ref:"M1 · PSAK 201"},
    {en:"Stock Appreciation Right (SAR)", id:"Hak atas kenaikan harga saham tanpa harus membeli sahamnya.", ref:"M27"},
    {en:"Stock-Based Compensation (SBC)", id:"Kompensasi karyawan dengan instrumen ekuitas (opsi/RSU); beban diakui selama vesting sebesar fair value saat grant.", ref:"M36 · PSAK 102"},
    {en:"Subsequent Events", id:"Peristiwa setelah periode pelaporan yang perlu disesuaikan atau diungkap.", ref:"M7 · PSAK 210"},
    {en:"Subsidiary", id:"Entitas anak yang dikendalikan oleh entitas induk.", ref:"M1 · PSAK 110"},
    {en:"Sukuk", id:"Efek syariah berbasis aset atau akad.", ref:"M26 · PSAK 410"},
    {en:"Sustainability Report", id:"Laporan keberlanjutan; baca kritis, waspadai greenwashing.", ref:"M27"},
    {en:"Sustainable Growth Rate", id:"g = ROE × (1 − payout ratio); pertumbuhan tanpa modal luar.", ref:"M18"},
    {en:"Takaful", id:"Asuransi syariah berbasis tolong-menolong.", ref:"M26 · PSAK 408"},
    {en:"Tangible Book Value", id:"Nilai buku tanpa aset takberwujud dan goodwill.", ref:"M24"},
    {en:"TCFD", id:"Kerangka pengungkapan risiko dan peluang terkait iklim.", ref:"M27"},
    {en:"Temporal Method", id:"Metode translasi bila mata uang fungsional anak adalah mata uang induk: pos moneter memakai kurs penutup, pos non-moneter memakai kurs historis, selisih translasi masuk laba rugi.", ref:"M39 · PSAK 221"},
    {en:"Translation Exposure", id:"Seberapa besar nilai tertranslasi laporan anak berubah saat kurs bergerak; di bawah current-rate memengaruhi CTA di OCI, di bawah temporal memengaruhi laba rugi lewat pos moneter neto.", ref:"M39 · PSAK 221"},
    {en:"Treasury Stock Method", id:"Metode hitung saham dilutif: hasil exercise opsi dianggap dipakai membeli kembali saham pada harga pasar rata-rata.", ref:"M36 · PSAK 233"},
    {en:"Trial Balance", id:"Neraca saldo untuk memastikan debit = kredit.", ref:"M1"},
    {en:"Unqualified Opinion", id:"Opini wajar tanpa pengecualian (clean opinion).", ref:"M7"},
    {en:"Vesting", id:"Proses hak opsi/RSU menjadi milik karyawan.", ref:"M27 · M36"},
    {en:"Vesting Schedule", id:"Jadwal bertahapnya vesting, mis. 25% per tahun.", ref:"M27"},
    {en:"WACC", id:"Weighted average cost of capital — rata-rata tertimbang biaya modal.", ref:"M18"},
    {en:"Wadiah", id:"Akad titipan dalam perbankan syariah.", ref:"M26 · PSAK 411"},
    {en:"Wakaf", id:"Harta yang ditahan pokoknya untuk manfaat sosial berkelanjutan.", ref:"M26 · PSAK 412"},
    {en:"Whistleblower", id:"Pelapor pelanggaran; sumber utama temuan fraud menurut survei global.", ref:"M13"},
    {en:"Window Dressing", id:"Mempercantik laporan sesaat sebelum tanggal pelaporan.", ref:"M13 · M17"},
    {en:"Working Capital", id:"Modal kerja = aset lancar − liabilitas lancar.", ref:"M4"},
    {en:"Write-Down", id:"Penurunan nilai tercatat aset ke nilai terpulihkannya.", ref:"M12 · PSAK 236"},
    {en:"XBRL", id:"Format data terstruktur untuk filing laporan keuangan.", ref:"M19 · Workbench"},
    {en:"Zakat", id:"Kewajiban sosial atas harta dalam Islam; akuntansinya di PSAK 409.", ref:"M26 · PSAK 409"},
    {en:"Debt-to-Equity (D/E)", id:"Total liabilitas ÷ ekuitas; leverage paling populer.", ref:"M5"},
    {en:"Days Inventory Outstanding (DIO)", id:"Rata-rata hari persediaan mengendap sebelum terjual.", ref:"M4 · M11"},
    {en:"Days Payable Outstanding (DPO)", id:"Rata-rata hari utang usaha dibayar; molor ekstrem = masalah likuiditas.", ref:"M4"},
    {en:"Earnings Before Tax (EBT)", id:"Laba sebelum pajak penghasilan.", ref:"M3"},
    {en:"Effective Tax Rate", id:"Beban pajak ÷ laba sebelum pajak; jauh dari tarif statutori = selidiki.", ref:"M21 · PSAK 212"},
    {en:"Expected Credit Loss (ECL)", id:"Cadangan kerugian kredit ekspektasian model 3 stage PSAK 109.", ref:"M16 · PSAK 109"},
    {en:"Tunneling", id:"Mengalirkan sumber daya perusahaan ke kantong pengendali via pihak berelasi.", ref:"M22"},
    {en:"Self-Dealing", id:"Pejabat bertransaksi dengan perusahaannya sendiri demi keuntungan pribadi.", ref:"M22"},
  ];

  // urut alfabet (case-insensitive)
  TERMS.sort(function (a, b) {
    return a.en.toLowerCase().localeCompare(b.en.toLowerCase());
  });

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  var q = document.getElementById("glo-q");
  var list = document.getElementById("glo-list");
  var cnt = document.getElementById("glo-count");
  var lettersBox = document.getElementById("glo-letters");
  var activeLetter = "";

  var letters = [];
  TERMS.forEach(function (t) {
    var L = t.en.charAt(0).toUpperCase();
    if (letters.indexOf(L) === -1) letters.push(L);
  });
  lettersBox.innerHTML = '<button data-l="" class="active">Semua</button>' +
    letters.map(function (L) { return '<button data-l="' + L + '">' + L + '</button>'; }).join("");
  lettersBox.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    activeLetter = b.dataset.l;
    lettersBox.querySelectorAll("button").forEach(function (x) {
      x.classList.toggle("active", x === b);
    });
    render();
  });

  function render() {
    var v = q.value.trim().toLowerCase();
    var hits = TERMS.filter(function (t) {
      if (activeLetter && t.en.charAt(0).toUpperCase() !== activeLetter) return false;
      if (!v) return true;
      return t.en.toLowerCase().indexOf(v) !== -1 ||
             t.id.toLowerCase().indexOf(v) !== -1 ||
             t.ref.toLowerCase().indexOf(v) !== -1;
    });
    cnt.textContent = hits.length + " dari " + TERMS.length + " istilah";
    if (!hits.length) {
      list.innerHTML = '<div class="glo-empty">Tidak ada istilah yang cocok dengan <strong>' +
        esc(q.value) + '</strong>.</div>';
      return;
    }
    list.innerHTML = hits.map(function (t) {
      return '<div class="glo-term"><div class="en"><span class="init">' +
        esc(t.en.charAt(0).toUpperCase()) + '</span>' + esc(t.en) + '</div>' +
        '<div class="idn">' + esc(t.id) + '</div>' +
        '<div class="ref">↳ ' + esc(t.ref) + '</div></div>';
    }).join("");
  }

  q.addEventListener("input", render);
  render();
})();
