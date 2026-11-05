/* FSA Lab — Bedah Sendiri: benchmark terverifikasi KLBF (Tahun Buku 2024).
   File ini DIMUAT DINAMIS hanya saat learner menekan "Buka benchmark" (langkah 5).
   Jangan referensikan file ini di HTML awal / JS awal — isolasi blind first, reveal later.
   Sumber primer: AR 2024 PT Kalbe Farma Tbk (kalbe.co.id), LK konsolidasian auditan.
   Angka dalam Rupiah penuh, persis seperti di LK. "LK hal." = nomor halaman cetak LK. */
window.KLBF_BENCH = {
meta: {
  emiten: "PT Kalbe Farma Tbk",
  ticker: "KLBF",
  sektor: "Farmasi / consumer healthcare",
  periode: "Tahun buku 2024 (komparatif 2023)",
  basis: "Konsolidasian (Grup)",
  ccy: "Rupiah (Rp)",
  dokumen: "Laporan Tahunan 2024 (bilingual ID/EN), LK konsolidasian hal. cetak 1–8",
  auditor: "KAP Purwantono, Sungkoro & Surja (jaringan EY Indonesia)",
  opini: "Wajar tanpa pengecualian (unqualified), 27 Mar 2025 — tanpa paragraf penekanan",
  filing_url: "https://www.kalbe.co.id/api-content/File/GetFile/AR%20KLBF%202024.pdf?_rsc=1aaqb"
},
rows: {
  rev:    {label:"Penjualan neto", v:32627776108026, v23:30449134077618, note:"2, 8, 28, 29", page:4},
  cogs:   {label:"Beban pokok penjualan", v:19670735916128, v23:18625888544234, note:"2, 8, 28, 30", page:4},
  gross:  {label:"Laba bruto", v:12957040191898, v23:11823245533384, note:"—", page:4},
  sell:   {label:"Beban penjualan", v:6807092752437, v23:6302840232439, note:"2, 28, 31", page:4},
  ga:     {label:"Beban umum dan administrasi", v:1508756225242, v23:1497082601862, note:"2, 28, 32", page:4},
  rd:     {label:"Beban penelitian dan pengembangan", v:471599957208, v23:329621039815, note:"2, 28, 33", page:4},
  ebit:   {label:"Laba usaha (TERHITUNG — bukan subtotal LK)", v:4080720255919, v23:null, note:"terhitung", page:"—",
           formula:"laba bruto − beban penjualan − beban GA − R&D + pend. operasi lain − beban operasi lain"},
  int_exp:{label:"Beban bunga dan keuangan", v:69234366294, v23:95103843846, note:"2, 28, 34", page:4},
  pbt:    {label:"Laba sebelum beban pajak penghasilan", v:4218874269523, v23:3606237203810, note:"—", page:4},
  tax:    {label:"Beban pajak penghasilan", v:972304515326, v23:827832384309, note:"2, 3, 23, 28", page:4},
  ni_total:{label:"Laba tahun berjalan (total)", v:3246569754197, v23:2778404819501, note:"—", page:4},
  ni_attr:{label:"Laba tahun berjalan — diatribusikan ke pemilik entitas induk", v:3240636626331, v23:2766748040055, note:"2, 28, 44", page:5},
  cash_bs:{label:"Kas dan setara kas (neraca)", v:4723293839405, v23:3232420596769, note:"2, 4", page:1},
  recv:   {label:"Piutang usaha, neto (pihak ketiga + berelasi)", v:4864547870520, v23:4651970696489, note:"piutang ketiga (2,3,5) + berelasi (8a)", page:1},
  inv:    {label:"Persediaan, neto", v:6501631203212, v23:6791979793011, note:"2, 3, 9", page:1},
  ppe:    {label:"Aset tetap, neto", v:8269375706540, v23:7978027474025, note:"2, 3, 14", page:1},
  ca:     {label:"Total aset lancar", v:17187668427724, v23:15917724100860, note:"—", page:1},
  assets: {label:"TOTAL ASET", v:29429727898195, v23:27057568182323, note:"—", page:1},
  liab:   {label:"TOTAL LIABILITAS", v:4839294087709, v23:3937546172108, note:"—", page:2},
  cl:     {label:"Total liabilitas jangka pendek", v:4185749488069, v23:3243168544925, note:"—", page:2},
  intdebt:{label:"Utang berbunga (TERHITUNG — bank + sewa + pembiayaan + konversi)", v:561587369228, v23:621627147816, note:"terhitung", page:2,
           formula:"utang bank pendek + bag. lancar + utang bank panjang + sewa + pembiayaan + pinjaman konversi"},
  equity: {label:"TOTAL EKUITAS", v:24590433810486, v23:23120022010215, note:"—", page:3},
  re_start:{label:"Saldo laba AWAL 2024 — belum ditentukan penggunaannya (= akhir 2023)", v:21162752455815, v23:null, note:"24", page:3},
  re_end: {label:"Saldo laba AKHIR 2024 — belum ditentukan penggunaannya", v:22941791293036, v23:21162752455815, note:"24", page:3},
  cash_cf:{label:"Kas akhir tahun (arus kas)", v:4723293839405, v23:3232420596769, note:"4", page:8},
  cfo:    {label:"Kas neto diperoleh dari aktivitas operasi", v:4785179041408, v23:2908095709372, note:"—", page:7},
  capex:  {label:"Perolehan aset tetap", v:907909319042, v23:881550983830, note:"28", page:7},
  div:    {label:"Pembayaran dividen kas — Perusahaan", v:1433930308710, v23:1757714373580, note:"dividen kas — Perusahaan", page:8}
},
ratios: {
  net_margin:{label:"Net margin (atribusional)", v:0.0993, formula:"ni_attr ÷ rev", page:"hitungan"},
  roe_end:   {label:"ROE (ekuitas akhir)", v:0.1318, formula:"ni_attr ÷ ekuitas akhir", page:"hitungan"},
  roe_avg:   {label:"ROE (rata-rata ekuitas pemilik induk — headline analis)", v:0.1466, formula:"ni_attr ÷ rata-rata ekuitas pemilik induk", page:"hitungan"}
},
analyst: {
  inv: "Kalbe tumbuh 7,2% dengan laba naik 17,1% — ekspansi margin, bukan sekadar volume: gross margin 39,7% dan net margin 9,9% ditopang operating leverage (beban penjualan naik ~8% vs penjualan +7,2%, sementara beban bunga turun). ROE 14,7% dengan D/E hanya 0,20x berarti imbal hasil datang dari operasi, bukan leverage — profil defensif khas consumer healthcare. Pertanyaannya: apakah pertumbuhan 2024 datang dari divisi ber-margin tinggi (farmasi resep +12,2%) atau sekadar mix sementara?",
  cred: "Dari sisi kreditur, ini neraca yang sangat nyaman: current ratio 4,11x, kas Rp4,72 triliun vs total utang bank (pendek + panjang + bagian lancar) hanya ~Rp388 miliar, dan arus kas operasi Rp4,79 triliun menutup belanja modal + dividen dengan sisa. Pinjaman konversi baru Rp129,5 miliar adalah satu-satunya penambahan utang berarti — kecil relatif terhadap ekuitas Rp24,6 triliun. Risiko kredit material praktis tidak terlihat pada 2024.",
  foren: "Kualitas laba terlihat sehat (CFO 147% dari laba — kas mendahului akrual), tapi ada tiga pos yang layak ditanya, bukan disimpulkan: (1) mengapa tagihan restitusi pajak melonjak 3,2x menjadi Rp406 miliar? (2) apa syarat pinjaman konversi Rp129,5 miliar yang muncul tiba-tiba di 2024 — kepada siapa, harga konversi berapa? (3) buyback Rp460 miliar + dividen Rp1,43 triliun = pengembalian kas besar ke pemegang saham di tahun yang sama perusahaan menambah utang konversi — apakah ini disiplin modal atau sinyal kas berlebih yang tak teralokasi? Opini audit wajar tanpa pengecualian tidak menjawab ketiga pertanyaan ini."
},
redflags: [
  "Mengapa tagihan restitusi pajak melonjak 3,2x menjadi Rp406 miliar di 2024?",
  "Pinjaman konversi Rp129,5 miliar muncul tiba-tiba di 2024 — kepada siapa diterbitkan, dan berapa harga konversinya?",
  "Buyback Rp460 miliar + dividen Rp1,43 triliun di tahun yang sama perusahaan menambah utang konversi — disiplin modal atau kas berlebih yang tak teralokasi?"
]
};
