/* FSA Lab — Ujian: benchmark terverifikasi BBCA Interim H1 2026.
   File ini DIMUAT DINAMIS hanya saat learner menekan "Buka benchmark" (langkah 5).
   Jangan referensikan file ini di HTML awal / JS awal — isolasi blind first, reveal later.
   Sumber primer: LK Interim (Publikasi) 6 bulan berakhir 30 Jun 2026 — UNAUDITED (10 hlm, bca.co.id resmi)
   + 1H26 Results — Analyst Meeting 28 Jul 2026 + siaran pers Q1 2026 (23 Apr 2026).
   Angka dalam JUTAAN Rupiah, persis seperti di filing. "LK hlm." = nomor halaman PDF S1.
   Tag: [B] = diungkap bank, [T] = terhitung builder. Diverifikasi 4 Nov 2026 dari PDF asli bca.co.id.
   Keterbatasan: Q1 2026 standalone filing tidak diperoleh via pencarian — referensi Q1 dari
   presentasi analis resmi bank (S2) [B]; benchmark memakai S1 untuk H1; provisi S2 vs S1
   beda scope — JANGAN jadikan CKPN Q2 benchmark tunggal. */
window.BBCA_BENCH = {
meta: {
  emiten: "PT Bank Central Asia Tbk",
  ticker: "BBCA",
  sektor: "Bank — transaksional & korporasi",
  periode: "6 bulan berakhir 30 Jun 2026 (H1 2026 — interim, YTD kumulatif)",
  basis: "Konsolidasian (Grup)",
  ccy: "Rupiah — filing dalam JUTAAN Rupiah",
  dokumen: "Laporan Keuangan Interim (Publikasi), 10 halaman — seluruh kolom berlabel 'Unaudited'",
  status_audit: "UNAUDITED — tidak ada laporan review auditor dalam dokumen publikasi ini",
  surat_idx: "Surat pengantar penyampaian ke IDX: 018/ATX/2026, 28 Jul 2026 (klasifikasi Quarter II)",
  auditor_tahunan: "RUPS 12 Mar 2026 menunjuk KAP Rintis, Jumadi, Rianto & Rekan (PwC Indonesia) untuk TB 2026 — konteks saja, bukan bagian ujian",
  filing_url: "https://www.bca.co.id/-/media/Feature/Report/File/S8/Laporan-Triwulan/2026/20260728-financial-report-june-2026.pdf",
  presentasi_url: "https://bca.co.id/-/media/Feature/Report/File/Berita-Investor/2026/20260728-1h26-presentasi-perusahaan.pdf"
},
rows: {
  int_inc:  {label:"Pendapatan bunga", v:49858169, note:"LK IS H1, hlm. 3", page:3},
  int_exp:  {label:"Beban bunga", v:7253606, note:"LK IS H1, hlm. 3", page:3},
  nii:      {label:"NII — pendapatan bunga bersih", v:42604563, tag:"T", note:"terhitung: 49.858.169 − 7.253.606", page:"—"},
  nonint_inc:{label:"Pendapatan bersih asuransi", v:200284, note:"LK IS H1, hlm. 3", page:3},
  opex:     {label:"Beban operasional", v:0, tag:"T", note:"tidak diinput — terhitung implisit dari laba operasional", page:"—"},
  ckpn_exp: {label:"Beban CKPN (penambahan kerugian penurunan nilai aset)", v:1984747, note:"LK IS H1, hlm. 3", page:3},
  op_profit:{label:"Laba operasional", v:36611227, note:"LK IS H1, hlm. 3", page:3},
  pbt:      {label:"Laba sebelum pajak", v:36451829, note:"LK IS H1, hlm. 3", page:3},
  tax:      {label:"Beban pajak", v:6906208, note:"LK IS H1, hlm. 3", page:3},
  patmi:    {label:"Laba bersih — atribusional pemilik induk", v:29534446, note:"LK IS H1, hlm. 3", page:3},
  div_paid: {label:"Dividen kas dibayar (arus kas)", v:36985059, note:"LK CF H1 — termasuk final FY2025 Rp336/saham + termin I interim 2026 Rp20/saham", page:5},
  cfo:      {label:"Kas bersih dari operasi", v:32261974, note:"LK CF H1, hlm. 5", page:5},
  loans_gross:{label:"Kredit yang diberikan — gross (konvensional + syariah)", v:1035623547, tag:"T", note:"1.022.048.832 + 13.574.715; cocok S2 Rp1.035,6 T", page:1},
  ckpn_loan:{label:"CKPN atas kredit & syariah (neraca)", v:31638005, note:"LK BS, hlm. 1", page:1},
  assets:   {label:"TOTAL ASET", v:1660579336, note:"LK BS, hlm. 1", page:1},
  giro:     {label:"Giro", v:444493072, note:"LK BS, hlm. 1", page:1},
  tabungan: {label:"Tabungan", v:637779226, note:"LK BS, hlm. 1", page:1},
  deposito: {label:"Deposito berjangka", v:201780633, note:"LK BS, hlm. 1", page:1},
  dpk:      {label:"Total DPK", v:1284052931, tag:"T", note:"terhitung: giro + tabungan + deposito; cocok S2 Rp1.284 T", page:"—"},
  liab:     {label:"TOTAL LIABILITAS", v:1390141793, note:"LK BS, hlm. 2", page:2},
  equity:   {label:"TOTAL EKUITAS", v:270437543, note:"LK BS, hlm. 2", page:2},
  cash_bs:  {label:"Kas (neraca)", v:21065925, note:"LK BS baris 1, hlm. 1", page:1},
  cash_begin:{label:"Kas awal periode (arus kas)", v:87549328, note:"LK CF, hlm. 5", page:5},
  cash_end: {label:"Kas akhir periode (arus kas)", v:94492550, note:"LK CF, hlm. 5", page:5},
  cf_net:   {label:"Kenaikan neto kas H1", v:8453748, tag:"T", note:"terhitung: 94.492.550 − 87.549.328", page:"—"},
  cf_fx:    {label:"Selisih kurs atas kas", v:1510526, note:"LK CF, hlm. 5", page:5},
  re_begin: {label:"Saldo laba awal", v:263286937, note:"LK perubahan ekuitas, hlm. 4", page:4},
  re_end:   {label:"Saldo laba akhir", v:255836324, note:"LK perubahan ekuitas, hlm. 4", page:4},
  cap_core: {label:"Modal inti (Tier 1)", v:null, note:"TIDAK diungkap di filing publikasi 10-hal — baris 'tidak diungkapkan'", page:"—"},
  rwa:      {label:"ATMR", v:null, note:"TIDAK diungkap di filing publikasi 10-hal — baris 'tidak diungkapkan'", page:"—"},
  q1_nii:   {label:"NII Q1 2026 [referensi]", v:21100000, tag:"B", note:"S2 slide quarterly (Rp21,1 T)", page:"S2"},
  q1_ni:    {label:"Laba bersih Q1 2026 [referensi]", v:14700000, tag:"B", note:"S2 + siaran pers 23 Apr 2026 (Rp14,7 T)", page:"S2"},
  q1_ckpn:  {label:"Provisi Q1 2026 [referensi — scope presentasi]", v:1500000, tag:"B", note:"S2 — definisi 'Provision' presentasi, BUKAN baris CKPN LK", page:"S2"},
  q2_nii:   {label:"NII Q2 standalone [T]", v:21504563, tag:"T", note:"42.604.563 − 21.100.000", page:"—"},
  q2_ni:    {label:"Laba bersih Q2 standalone [T]", v:14834446, tag:"T", note:"29.534.446 − 14.700.000", page:"—"},
  q2_ckpn:  {label:"CKPN Q2 standalone [T]", v:484747, tag:"T", note:"1.984.747 − 1.500.000 — beda scope, bukan benchmark tunggal", page:"—"}
},
ratios: {
  car:      {label:"CAR", v:26.79, tag:"B", def:"total modal ÷ ATMR (rincian modal/ATMR tidak di filing publikasi 10-hal)"},
  npl:      {label:"NPL gross", v:1.86, tag:"B", def:"kredit bermasalah (kolektibilitas 3–5) ÷ total kredit"},
  npl_net:  {label:"NPL net", v:0.75, tag:"B", def:"(NPL − CKPN) ÷ total kredit"},
  nim:      {label:"NIM", v:5.32, tag:"B", def:"NII ter-annualisasi ÷ rata-rata aset produktif (definisi bank)"},
  ldr:      {label:"LDR (bank)", v:78.67, tag:"B", def:"definisi resmi mengeluarkan komponen tertentu — lihat jebakan"},
  ldr_naive:{label:"LDR (hitung-sendiri)", v:80.65, tag:"T", def:"kredit gross ÷ DPK"},
  casa:     {label:"CASA (hitung-sendiri)", v:84.28, tag:"T", def:"(giro + tabungan) ÷ DPK (bank ungkap 85,2% bank-only)"},
  coverage: {label:"NPL coverage (hitung-sendiri)", v:164.2, tag:"T", def:"CKPN ÷ NPL gross nominal (bank ungkap 165,5%)"},
  roe:      {label:"ROE (bank)", v:24.13, tag:"B", def:"definisi bank — denominator kemungkinan bank-only / tanpa OCI (hitungan builder 21,4%)"},
  roa:      {label:"ROA PAT (bank)", v:3.82, tag:"B", def:"laba bersih ÷ rata-rata aset (hitungan builder 3,64% — beda konvensi rata-rata)"},
  coc_gross:{label:"CoC gross", v:0.5, tag:"B", def:"provisi ÷ rata-rata kredit (definisi S2)"},
  nim_ra_q2:{label:"Risk-adjusted NIM Q2", v:5.0, tag:"B", def:"NIM − CoC gross (S2; Q1: 4,8% → Q2: 5,0%)"}
},
analyst: {
  inv: "Kompresi NIM berlanjut (5,78% → 5,32% YoY) karena loan yield turun lebih cepat dari cost of funds — tapi Q2 menunjukkan stabilisasi: NII Q2 Rp21,5 T (+1,9% QoQ) dan risk-adjusted NIM naik 4,8% → 5,0% karena CoC turun. Pertumbuhan kredit +8,0% YoY ke Rp1.036 T dengan CASA 85% = mesin dana murah tetap jalan. Kebijakan baru dividen interim 3× setahun (termin I Rp20 dibayar Jun 2026) menambah cerita shareholder yield; CAR 26,79% memberi ruang modal luas. Pertanyaan penguat: apakah Q2 awal pembalikan tren NIM? Pematah: NIM masih jauh di bawah tahun lalu; pertumbuhan laba hanya +1,8% YoY.",
  cred: "Kualitas aset terjaga: NPL gross 1,86% (membaik dari 2,17%), coverage ~165%, LAR 4,9% membaik. Namun provisi anjlok −51% QoQ (S2: 1,5 → 0,9 T) sementara NPL nominal naik +9,8% YtD — kombinasi yang menuntut penjelasan: front-loading di Q1 atau perbaikan riil di Q2? Pendanaan fortress (CASA 85,2%, LDR 78,67%), likuiditas bukan isu. CoC after recovery hanya 0,3% — biaya kredit terkendali, untuk saat ini.",
  foren: "Tiga hal yang pantas jadi pertanyaan, bukan vonis: (1) Mengapa beban provisi turun 51% QoQ di saat NPL nominal naik 9,8% YtD — apakah Q1 kelebihan provisi, atau Q2 kekurangan? (2) Selisih definisi: LDR hitungan 80,65% vs bank 78,67%; ROE hitungan 21,4% vs bank 24,13% — komponen apa yang dikeluarkan bank dari denominatornya? (3) Blok tanda tangan laporan ber-tanggal '23 Januari 2024' pada laporan Jun 2026 — sekadar template usang, atau indikasi kontrol dokumen yang longgar? (4) Arus kas dividen Rp36,99 T di H1 vs kebijakan interim 3× yang baru — bagaimana manajemen modal berubah?"
},
redflags: [
  "Mengapa beban provisi turun 51% QoQ di saat NPL nominal naik 9,8% YtD — apakah Q1 kelebihan provisi, atau Q2 kekurangan?",
  "Selisih definisi: LDR hitungan 80,65% vs bank 78,67%; ROE hitungan 21,4% vs bank 24,13% — komponen apa yang dikeluarkan bank dari denominatornya?",
  "Blok tanda tangan laporan ber-tanggal '23 Januari 2024' pada laporan Jun 2026 — sekadar template usang, atau indikasi kontrol dokumen yang longgar?",
  "Arus kas dividen Rp36,99 T di H1 vs kebijakan interim 3× yang baru — bagaimana manajemen modal berubah?"
],
callout: "Interim = UNAUDITED: tidak ada laporan review auditor dalam dokumen publikasi 10 halaman ini. Yang diuji benchmark ini adalah KONSISTENSI internal (neraca balance, kas tie-out, laba ditahan walk), bukan kebenaran audit. Analis yang baik memberi bobot lebih pada konsistensi saat membaca interim — dan mencatatnya sebagai keterbatasan.",
callout_val: "Bank tidak divaluasi dengan FCFF/WACC seperti emiten industri (bunga adalah bahan baku, bukan biaya modal). Metode yang tepat: Dividend Discount Model, residual income, atau P/BV relatif — materi valuasi bank ada di FMVA Sprint (capstone bank & Real Case 6). Ujian ini menguji MEMBACA bank interim, bukan memvaluasinya."
};
