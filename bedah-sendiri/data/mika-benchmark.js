/* FSA Lab — Bedah Sendiri: benchmark terverifikasi MIKA (Tahun Buku 2024).
   File ini DIMUAT DINAMIS hanya saat learner menekan "Buka benchmark" (langkah 5).
   Jangan referensikan file ini di HTML awal / JS awal — isolasi blind first, reveal later.
   Sumber primer: LK Konsolidasian auditan PT Mitra Keluarga Karyasehat Tbk 2024 (mirror quartr filing resmi).
   Angka dalam Rupiah penuh, persis seperti di LK. "LK hal." = nomor halaman cetak LK. */
window.MIKA_BENCH = {
meta: {
  emiten: "PT Mitra Keluarga Karyasehat Tbk",
  ticker: "MIKA",
  sektor: "Rumah sakit / healthcare",
  periode: "Tahun buku 2024 (komparatif 2023)",
  basis: "Konsolidasian (Grup)",
  ccy: "Rupiah (Rp)",
  dokumen: "Laporan Keuangan Konsolidasian auditan 2024 vs 2023, LK hal. cetak 1–5",
  auditor: "KAP Amir Abadi Jusuf, Aryanto, Mawar & Rekan (RSM Indonesia) — Eishennoraz, AP.1155",
  opini: "Wajar tanpa pengecualian (unqualified), 21 Mar 2025 — tanpa paragraf penekanan",
  filing_url: "https://investor.mitrakeluarga.com/investor-relations"
},
rows: {
  rev:    {label:"Pendapatan bersih", v:4874369366591, v23:4264279218860, note:"21", page:3},
  cogs:   {label:"Beban pokok pendapatan", v:2257944606238, v23:2135820699784, note:"22", page:3},
  gross:  {label:"Laba bruto", v:2616424760353, v23:2128458519076, note:"—", page:3},
  opex:   {label:"Beban usaha", v:1129103484672, v23:952277926762, note:"23", page:3},
  ebit:   {label:"Laba usaha (subtotal DISAJIKAN LK)", v:1508644303608, v23:1207019140319, note:"disajikan", page:3},
  int_exp:{label:"Beban keuangan", v:17536271134, v23:15499017580, note:"—", page:3},
  pbt:    {label:"Laba sebelum pajak penghasilan", v:1587828323243, v23:1263589019344, note:"—", page:3},
  tax:    {label:"Beban pajak penghasilan — bersih", v:360621980040, v23:267332386794, note:"15d", page:3},
  ni_total:{label:"Laba bersih tahun berjalan (total)", v:1227206343203, v23:996256632550, note:"—", page:3},
  ni_attr:{label:"Laba bersih — diatribusikan ke pemilik entitas induk", v:1146354111424, v23:916130678388, note:"—", page:3},
  cash_bs:{label:"Kas dan setara kas (neraca)", v:1067636241316, v23:842757489558, note:"4, 29", page:1},
  recv:   {label:"Piutang usaha", v:723194941498, v23:690122728521, note:"6, 29", page:1},
  inv:    {label:"Persediaan", v:62671989340, v23:81720215310, note:"8", page:1},
  ppe:    {label:"Aset tetap, neto", v:4236317680582, v23:3809905512300, note:"10", page:1},
  ca:     {label:"Total aset lancar", v:3320528580340, v23:2762225311075, note:"—", page:1},
  assets: {label:"TOTAL ASET", v:8247188907280, v23:7340842527691, note:"—", page:1},
  liab:   {label:"TOTAL LIABILITAS", v:916743530738, v23:741059280418, note:"—", page:2},
  cl:     {label:"Total liabilitas jangka pendek", v:700429903111, v23:556096181307, note:"—", page:1},
  intdebt:{label:"Utang berbunga (TERHITUNG — hanya liabilitas sewa; tanpa utang bank)", v:1609257648, v23:3054171460, note:"terhitung", page:"—",
           formula:"liabilitas sewa jangka pendek + jangka panjang"},
  equity: {label:"TOTAL EKUITAS", v:7330445376542, v23:6599783247273, note:"—", page:2},
  re_start:{label:"Saldo laba AWAL 2024 — belum ditentukan penggunaannya (= akhir 2023)", v:5008747960326, v23:null, note:"—", page:2},
  re_end: {label:"Saldo laba AKHIR 2024 — belum ditentukan penggunaannya", v:5673927846998, v23:5008747960326, note:"—", page:2},
  cash_cf:{label:"Kas akhir tahun (arus kas)", v:1067636241316, v23:842757489558, note:"4", page:5},
  cfo:    {label:"Kas neto diperoleh dari aktivitas operasi", v:1728912731527, v23:1314134014358, note:"—", page:5},
  capex:  {label:"Perolehan aset tetap", v:596795569927, v23:492969316264, note:"10", page:5},
  div:    {label:"Pembayaran dividen kas", v:472854331375, v23:514576772378, note:"—", page:5}
},
ratios: {
  net_margin:{label:"Net margin (atribusional)", v:0.2352, formula:"ni_attr ÷ rev", page:"hitungan"},
  roe_end:   {label:"ROE (total ekuitas akhir — definisi cek C5)", v:0.1564, formula:"ni_attr ÷ total ekuitas akhir", page:"hitungan"},
  roe_avg:   {label:"ROE (rata-rata ekuitas pemilik induk — headline analis)", v:0.1861, formula:"ni_attr ÷ rata-rata ekuitas pemilik induk", page:"hitungan"}
},
analyst: {
  inv: "Rumah sakit dengan pricing power: gross margin 53,7% dan operating margin 31,0% — jauh di atas manufaktur/farmasi — karena \u201cproduknya\u201d adalah jasa medis + hunian RS, bukan barang. Pendapatan tumbuh 14,3% dan laba atribusional +25,1% (ekspansi margin, bukan sekadar volume). ROE 18,6% dengan D/E hanya 0,13x: imbal hasil murni dari operasi, bukan leverage. Capex 12,2% dari pendapatan + uang muka aset tetap Rp105 miliar menandakan ekspansi kapasitas (RS baru/renovasi). Pertanyaannya: apakah pertumbuhan 2024 datang dari tarif naik, tingkat hunian (BOR) membaik, atau penambahan tempat tidur — LK tidak memecahnya, dan di sinilah analis RS membaca di luar angka.",
  cred: "Dari sisi kreditur, ini neraca nyaris tanpa utang: total liabilitas Rp917 miliar vs kas + investasi jangka pendek Rp2,43 triliun — kas likuid 2,6x seluruh liabilitas. Tidak ada utang bank sama sekali; satu-satunya \u201cutang berbunga\u201d adalah liabilitas sewa Rp1,6 miliar (immaterial). Current ratio 4,74x; CFO Rp1,73 triliun menutup capex Rp597 miliar + dividen Rp473 miliar dengan sisa Rp659 miliar. Risiko kredit material praktis nol pada 2024.",
  foren: "Kualitas laba sehat (CFO 141% dari laba — kas mendahului akrual), tapi ada empat pos yang layak ditanya, bukan disimpulkan: (1) investasi jangka pendek naik 38% menjadi Rp1,36 triliun — apa instrumennya (deposito? reksadana? surat berharga?), dan mengapa kas \u201cparkir\u201d di sana, bukan dipakai ekspansi atau dikembalikan ke pemegang saham? (2) seluruh saham treasuri Rp760 miliar (338,9 juta saham) DITARIK via pengurangan modal di 2024 — tindakan yang mengangkat EPS (penyebut menyusut 2,4%) — apakah ini capital return yang disiplin atau cara mempercantik EPS di tahun laba naik? (3) taksiran tagihan restitusi pajak naik 3,6x menjadi Rp21,9 miliar — sengketa pajak apa yang sedang berjalan? (4) beban usaha naik 18,6% vs pendapatan +14,3% — biaya apa yang tumbuh lebih cepat dari pendapatan di bisnis RS, dan apakah ini tekanan upah tenaga medis? Opini audit wajar tanpa pengecualian tidak menjawab keempat pertanyaan ini."
},
redflags: [
  "Investasi jangka pendek Rp1,36 triliun (+38% YoY) — apa isi portofolionya, dan mengapa kas menumpuk di instrumen jangka pendek alih-alih ekspansi?",
  "Penarikan seluruh saham treasuri (Rp760 miliar, 338,9 juta saham) via pengurangan modal di 2024 — bagaimana dampaknya ke EPS dan struktur modal? Apakah ini capital return disiplin atau pendorong EPS?",
  "Taksiran tagihan restitusi pajak naik 3,6x menjadi Rp21,9 miliar — sengketa/keberatan pajak apa yang mendasarinya?",
  "Beban usaha +18,6% melampaui pertumbuhan pendapatan +14,3% — komponen biaya apa yang menekan, dan apakah ini tekanan struktural (upah tenaga medis)?"
]
};
