/* FSA Lab — Bedah Sendiri: benchmark terverifikasi BBRI (Tahun Buku 2024).
   File ini DIMUAT DINAMIS hanya saat learner menekan "Buka benchmark" (langkah 5).
   Jangan referensikan file ini di HTML awal / JS awal — isolasi blind first, reveal later.
   Sumber primer: LK konsolidasian auditan FY2024 (filing IDX resmi) + press conference
   kinerja 12 Feb 2025 + Annual Report 2024.
   Angka dalam JUTAAN Rupiah, persis seperti di filing. "LK hal." = nomor halaman PDF filing.
   Tag: [B] = diungkap bank (press/AR), [T] = terhitung builder. */
window.BBRI_BENCH = {
meta: {
  emiten: "PT Bank Rakyat Indonesia (Persero) Tbk",
  ticker: "BBRI",
  sektor: "Bank — mikro & ultra-mikro",
  periode: "Tahun buku 2024 (komparatif 2023)",
  basis: "Konsolidasian (Grup)",
  ccy: "Rupiah — filing dalam JUTAAN Rupiah",
  dokumen: "LK konsolidasian auditan FY2024 (filing IDX, 34 hal.) + press conference kinerja 12 Feb 2025",
  auditor: "KAP Purwantono, Sungkoro & Surja (jaringan EY Indonesia), partner Christophorus Alvin Kossim",
  opini: "Wajar Tanpa Modifikasian (unqualified), 12 Feb 2025 — tanpa paragraf penekanan hal",
  filing_url: "https://www.idx.co.id/StaticData/NewsAndAnnouncement/ANNOUNCEMENTSTOCK/From_EREP/202402/20250212180445-49632-0/FinancialStatement-2024-Tahunan-BBRI.pdf",
  ar_url: "https://ir-bri.com"
},
rows: {
  int_inc:  {label:"Pendapatan bunga", v:199266252, note:"LK laba rugi", page:13},
  int_exp:  {label:"Beban bunga", v:57209062, note:"LK laba rugi", page:13},
  nii:      {label:"Pendapatan bunga bersih / NII", v:142057190, tag:"T", note:"terhitung: pendapatan − beban bunga", page:"—"},
  prov_fee: {label:"Pendapatan provisi & komisi", v:20475078, note:"LK laba rugi", page:15},
  recoveries:{label:"Penerimaan kembali aset dihapusbukukan", v:25363951, note:"LK laba rugi — naik +50,7% yoy", page:15},
  ga:       {label:"Beban umum & administrasi", v:29652420, note:"LK laba rugi", page:16},
  opex_other:{label:"Beban operasional lainnya", v:53464006, note:"LK laba rugi", page:16},
  op_profit:{label:"Laba operasional", v:78578018, note:"LK laba rugi (+2,3% yoy)", page:17},
  ppop:     {label:"PPoP (laba operasional sebelum pencadangan)", v:116752000, tag:"B", note:"diungkap bank — press conference 12 Feb 2025 (+9,6% yoy)", page:"press"},
  ckpn_exp: {label:"CKPN aset produktif (beban)", v:41757637, note:"LK laba rugi — naik +41,4% yoy", page:16},
  pbt:      {label:"Laba sebelum pajak", v:77599110, note:"LK laba rugi", page:17},
  tax:      {label:"Beban pajak", v:16955302, note:"LK laba rugi", page:17},
  ni_total: {label:"Laba bersih", v:60643808, note:"LK laba rugi (+0,4% yoy)", page:18},
  patmi:    {label:"Laba bersih — diatribusikan ke pemilik entitas induk", v:60154887, note:"LK laba rugi (+0,1% yoy)", page:18},
  div:      {label:"Dividen kas didistribusikan", v:55773483, note:"LK ekuitas — DPR 92,7%", page:20},
  loans_gross:{label:"Pinjaman diberikan — gross", v:1298318089, tag:"T", note:"terhitung: 1.209.195.037 + 89.123.052. Bank ungkap Rp1.354,64T (mencakup pembiayaan) — catat definisimu", page:6},
  loans_gross_23:{label:"Pinjaman diberikan — gross (2023, untuk rata-rata)", v:1197752706, note:"LK posisi keuangan", page:6},
  ckpn_loan:{label:"CKPN pinjaman", v:76902889, note:"LK posisi keuangan (turun dari 79.924.211 di 2023)", page:6},
  assets:   {label:"TOTAL ASET", v:1992983447, note:"LK posisi keuangan (+1,4% yoy)", page:4},
  assets_23:{label:"Total aset 2023 (untuk rata-rata)", v:1965007030, note:"LK posisi keuangan", page:4},
  giro:     {label:"Giro (simpanan nasabah)", v:374554340, note:"LK posisi keuangan", page:9},
  tabungan: {label:"Tabungan (simpanan nasabah)", v:544426947, note:"LK posisi keuangan", page:9},
  deposito: {label:"Deposito berjangka (simpanan nasabah)", v:446468817, note:"LK posisi keuangan", page:9},
  dpk:      {label:"Simpanan nasabah (DPK)", v:1365450104, tag:"T", note:"terhitung: giro + tabungan + deposito", page:"—"},
  liab:     {label:"TOTAL LIABILITAS", v:1669794400, tag:"T", note:"terhitung: total aset − total ekuitas", page:"—"},
  equity:   {label:"TOTAL EKUITAS", v:323189047, note:"LK posisi keuangan", page:11},
  equity_attr:{label:"Ekuitas yang dapat diatribusikan ke pemilik entitas induk", v:317093838, note:"LK posisi keuangan", page:11},
  equity_attr_23:{label:"Ekuitas atribusional 2023 (untuk rata-rata)", v:311363556, note:"LK posisi keuangan", page:11}
},
ratios: {
  nim:     {label:"NIM", v:7.74, tag:"B", def:"NII ÷ rata-rata aset produktif (definisi bank; aset produktif tidak diungkap di filing 34-hal)"},
  npl:     {label:"NPL gross", v:2.78, tag:"B", def:"kredit bermasalah (kolektibilitas 3–5) ÷ total kredit"},
  coverage:{label:"NPL coverage", v:215.01, tag:"B", def:"CKPN ÷ NPL gross"},
  ldr:     {label:"LDR (diungkap bank)", v:88.85, tag:"B", def:"definisi resmi tidak diungkap di filing 34-hal; pembilang bank mencakup pembiayaan (kredit Rp1.354,64T)"},
  ldr_naive:{label:"LDR (hitung-sendiri: kredit ÷ DPK)", v:95.1, tag:"T", def:"pinjaman gross ÷ simpanan nasabah"},
  car:     {label:"CAR", v:26.63, tag:"B", def:"total modal ÷ ATMR (rincian modal/ATMR tidak di filing 34-hal)"},
  casa:    {label:"CASA", v:67.3, tag:"T", def:"(giro + tabungan) ÷ simpanan nasabah"},
  coc:     {label:"CoC", v:3.35, tag:"T", def:"CKPN ÷ rata-rata pinjaman gross (bank ungkap 3,2% — selisih definisi denominator)"},
  roa:     {label:"ROA", v:3.06, tag:"B=T", def:"laba bersih ÷ rata-rata aset — cocok persis"},
  roe:     {label:"ROE", v:19.14, tag:"T", def:"PATMI ÷ rata-rata ekuitas atribusional (bank ungkap 19,01% — selisih 0,13pp)"}
},
analyst: {
  inv: "BRI 2024 adalah cerita 'tumbuh tapi dimakan provisi': PPoP naik 9,6% menunjukkan mesin inti sehat, tetapi laba bersih hanya +0,1% karena CKPN melonjak 41,4% — pasar membayar untuk kualitas laba, bukan PPoP. NIM terkompresi 41bps oleh biaya dana (+30,6%) menguji thesis 'bank mikro = pricing power': di 2024 pricing power tidak cukup menutup cost of fund. ROE 19,01% tetap premium, tetapi dengan DPR 92,7% hampir seluruh laba dibagikan — pertumbuhan ekuitas organik tipis, sehingga re-rating butuh bukti CoC kembali ke ~2%.",
  cred: "Dari sisi kreditor, BRI 2024 solid dengan catatan: CAR 26,63% memberi buffer besar, NPL membaik ke 2,78% dengan coverage 215% — tetapi trennya bertanya: CoC naik ke 3,2% (dari 2,4%) sementara NPL turun, artinya bank memprovisioning ke depan (front-loading) — kehati-hatian atau ada yang belum terlihat di angka NPL? CASA 67,3% adalah fondasi pendanaan murah, namun deposito masih Rp446T dan beban bunga +30,6% menunjukkan kompetisi dana nyata. Dividen 92,7% menggerus buffer — untuk analis kredit, pertanyaannya: apakah CAR 26,63% cukup menahan jika CoC bertahan di 3%+ dua tahun?",
  foren: "Tiga hal yang pantas jadi pertanyaan, bukan vonis: (1) Penerimaan kembali aset dihapusbukukan melonjak 50,7% ke Rp25,36T — berapa yang recurring vs one-off, dan seberapa besar kontribusinya menutup kenaikan CKPN? (2) CKPN pinjaman di neraca TURUN Rp3T sementara beban CKPN di laba rugi NAIK Rp12,2T — write-off berapa, dan apakah write-off mempercantik NPL 2,78%? (3) Dua definisi 'kredit' (Rp1.298T vs Rp1.354T) dan dua LDR (95,1% vs 88,85%) — sebelum memvonis angka, pastikan definisinya sama."
},
redflags: [
  "Penerimaan kembali aset dihapusbukukan +50,7% ke Rp25,36T — berapa yang recurring vs one-off, dan seberapa besar menutup kenaikan CKPN?",
  "CKPN pinjaman di neraca TURUN Rp3T sementara beban CKPN di laba rugi NAIK Rp12,2T — write-off berapa, dan apakah write-off mempercantik NPL 2,78%?",
  "Dua definisi 'kredit' (Rp1.298T vs Rp1.354T) dan dua LDR (95,1% vs 88,85%) — pastikan definisinya sama sebelum memvonis angka."
],
callout: "Bank tidak divaluasi dengan FCFF/WACC seperti emiten industri (bunga adalah bahan baku, bukan biaya modal). Metode yang tepat: Dividend Discount Model, residual income, atau P/BV relatif — materi valuasi bank ada di FMVA Sprint (capstone bank & Real Case 6). Latihan ini melatih MEMBACA bank, bukan memvaluasinya."
};
