/* FSA Lab — Ujian Transfer: benchmark terverifikasi UNVR FY2024.
   File ini DIMUAT DINAMIS hanya saat learner menekan "Buka benchmark" (langkah 5).
   Jangan referensikan file ini di HTML awal / JS awal — isolasi blind first, reveal later.
   Sumber primer: siaran pers resmi unilever.co.id 13 Feb 2025 + LK Interim H1 2025
   (kolom 31 Des 2024 = angka AUDITAN) + pengumuman IDX (auditor).
   Angka dalam JUTAAN Rupiah, persis seperti di filing.
   Tag: [B] = sumber primer, [S] = agregator sekunder (carisaham/roic.ai/DBS), [T] = terhitung builder.
   Dokumen verifikasi: ~/workspace/build-logs/unvr-2024-benchmark.md (4 Nov 2026).
   KETERBATASAN: PDF AR 2024 asli terblokir dari VM — bila Septian mengunduh AR dari
   perangkatnya, benchmark ini WAJIB direkonsiliasi ulang. */
window.UNVR_BENCH = {
meta: {
  emiten: "PT Unilever Indonesia Tbk",
  ticker: "UNVR",
  sektor: "Barang konsumen (non-bank) — perawatan rumah & tubuh, makanan-minuman",
  periode: "Tahun buku berakhir 31 Desember 2024 (FY2024 — auditan)",
  basis: "Perseroan (standalone)",
  ccy: "Rupiah — filing dalam JUTAAN Rupiah",
  dokumen: "Siaran pers FY2024 (13 Feb 2025) + LK Interim H1 2025 kolom 31 Des 2024 (auditan)",
  status_audit: "AUDITAN — opini Wajar Tanpa Modifikasian",
  auditor: "KAP Siddharta Widjaja & Rekan (KPMG Indonesia), partner Kartika Singodimejo",
  dirut: "Benjie Yap (Presiden Direktur)",
  catatan_kunci: "Angka 2024 as-published MASIH mencakup bisnis es krim (divestasi diumumkan Des 2024 ke The Magnum Ice Cream Indonesia; restatement baru muncul di filing 2025)."
},
rows: {
  sales:     {label:"Penjualan bersih", v:35100000, tag:"B", note:"siaran pers: Rp35,1 T; cek Σ kuartal = 35.138.643"},
  cogs:      {label:"Beban pokok penjualan", v:18387600, tag:"T", note:"terhitung: 35.100.000 × (1 − 47,6%)"},
  gross:     {label:"Laba bruto", v:16712400, tag:"T", note:"terhitung: 35.100.000 × 47,6%"},
  ebitda:    {label:"EBITDA", v:5100000, tag:"S", note:"carisaham (dari LK tahunan)"},
  net_profit:{label:"Laba bersih", v:3368693, tag:"B", note:"siaran pers: Rp3,4 T"},
  eps:       {label:"EPS dasar (Rp, full amount)", v:88.30, tag:"S", note:"carisaham; cek: 3.368.693 ÷ 38.150 = 88,3 ✓", isRatio:true},
  cash:      {label:"Kas dan setara kas", v:671180, tag:"B", note:"LK BS 31 Des 2024 (auditan)"},
  recv:      {label:"Piutang usaha (ketiga + relasi)", v:1880942, tag:"B", note:"1.674.140 + 206.802"},
  inv:       {label:"Persediaan", v:2505852, tag:"B", note:"LK BS 31 Des 2024 (auditan)"},
  ca:        {label:"Jumlah aset lancar", v:5280548, tag:"B", note:"LK BS 31 Des 2024 (auditan)"},
  assets:    {label:"JUMLAH ASET", v:16046195, tag:"B", note:"LK BS 31 Des 2024 (auditan)"},
  bankloan:  {label:"Pinjaman bank", v:1450000, tag:"B", note:"LK BS 31 Des 2024 (auditan)"},
  payables:  {label:"Utang usaha (ketiga + relasi)", v:3983297, tag:"B", note:"3.812.423 + 170.874"},
  cl:        {label:"Jumlah liabilitas jangka pendek", v:11830201, tag:"B", note:"LK BS 31 Des 2024 (auditan)"},
  liab:      {label:"JUMLAH LIABILITAS", v:13896928, tag:"B", note:"LK BS 31 Des 2024 (auditan)"},
  equity:    {label:"JUMLAH EKUITAS", v:2149267, tag:"B", note:"LK BS 31 Des 2024 (auditan)"},
  shares:    {label:"Saham beredar (lembar, full amount)", v:38150000000, tag:"B", note:"38,15 M lbr @ Rp2", isCount:true},
  cfo:       {label:"Kas dari operasi", v:4000000, tag:"S", note:"carisaham (dari LK tahunan)"},
  capex:     {label:"Belanja modal", v:1100000, tag:"S", note:"carisaham (dari LK tahunan)"},
  div: {label:"Dividen tahun buku", v:3357200, unit:"Rp jt", tag:"B", note:"Rp88 x 38.150 jt saham (siaran pers resmi)"}
},
ratios: {
  gm:     {label:"Gross margin", v:47.6, unit:"%", tag:"B", note:"siaran pers (−213 bps YoY)"},
  npm:    {label:"Net profit margin", v:9.6, unit:"%", tag:"T", note:"3.368.693 ÷ 35.100.000"},
  cr:     {label:"Current ratio", v:0.45, unit:"x", tag:"T", note:"5.280.548 ÷ 11.830.201 — DI BAWAH 1"},
  de:     {label:"D/E", v:6.47, unit:"x", tag:"T", note:"13.896.928 ÷ 2.149.267 — SANGAT TINGGI"},
  payout: {label:"Dividend payout ratio", v:99.7, unit:"%", tag:"T", note:"3.357.200 ÷ 3.368.693 — nyaris seluruh laba dibagikan"},
  cfo_cov:{label:"CFO / laba bersih", v:118.7, unit:"%", tag:"T", note:"4.000.000 ÷ 3.368.693 — konversi kas sehat"},
  roe:    {label:"ROE", v:135.2, unit:"%", tag:"S", note:"carisaham — ARTEFAK ekuitas tipis, bukan kekuatan absolut"}
},
analyst: [
  {lens:"investasi", text:"UNVR 2024: penjualan −9% YoY, laba −30% — tahun transformasi. Ekuitas hanya Rp2,1 T dari aset Rp16 T: ROE >100% adalah artefak struktur modal, bukan keunggulan operasional. Pertanyaan investasi: apakah margin 47,6% dan konversi kas 119% cukup membayar risiko leverage?"},
  {lens:"kredit", text:"CR 0,45x dan D/E 6,5x terlihat mengerikan di atas kertas — tapi utang usaha Rp4,0 T adalah pendanaan dagang murah, dan CFO Rp4 T menutup pinjaman bank Rp1,45 T hampir 3x. Bedakan consumer-goods berputar-cepat dari manufaktur padat-modal."},
  {lens:"forensik", text:"Dividen Rp3,36 T ≈ laba Rp3,37 T (payout 99,7%): nyaris seluruh laba dibagikan — berapa kas yang tersisa untuk reinvestasi? Ditambah divestasi es krim Des 2024 — angka 2024 as-published vs restatement 2025 akan MEMBINGUNGKAN analis yang tidak teliti. Selalu cek basis 'continuing vs total'."}
]};
