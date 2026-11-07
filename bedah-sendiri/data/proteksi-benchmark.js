/* FSA Lab — Bedah Sendiri: PT Proteksi Sejahtera (FIKTIF) — kunci jawaban ilustratif.
   SELURUH ANGKA ILUSTRATIF — latihan format Bedah Sendiri, BUKAN filing asli.
   Tidak ada filing insurer real yang diverifikasi di sesi ini; benchmark ini adalah
   kunci jawaban dari data ilustratif yang sama dengan ringkasan LK di langkah 1.
   Satuan internal: Rp JUTA (seperti bbri-benchmark.js). */
window.PROTEKSI_BENCH = {
 meta:{ emiten:"PT Proteksi Sejahtera (fiktif)", ticker:"PROTEKSI", periode:"FY2025 (ilustratif)",
   basis:"konsolidasian (ilustratif)", dokumen:"Ringkasan LK ilustratif FY2025 (Rp juta) — kartu referensi langkah 1",
   filing_url:"Tidak ada filing asli — seluruh angka ilustratif untuk latihan." },
 rows:{
  premi_diterima:{v:1200000, page:"Kartu referensi A", note:"premi diterima (gross written premium)", tag:"[T]"},
  ins_rev:{v:1080000, page:"Kartu referensi A", note:"insurance revenue FY2025", tag:"[T]"},
  klaim:{v:620000, page:"Kartu referensi A", note:"klaim terjadi (incurred claims)", tag:"[T]"},
  beban:{v:180000, page:"Kartu referensi A", note:"beban akuisisi dan administrasi", tag:"[T]"},
  service_exp:{v:800000, page:"—", note:"terhitung = klaim + beban", tag:"[T]"},
  service_result:{v:280000, page:"—", note:"terhitung = insurance revenue − service expense", tag:"[T]"},
  csm_awal:{v:150000, page:"Kartu referensi B", note:"CSM awal tahun (grup jiwa 3 tahun, M42)", tag:"[T]"},
  csm_release:{v:50000, page:"Kartu referensi B", note:"pelepasan CSM tahun berjalan", tag:"[T]"},
  csm_akhir:{v:100000, page:"—", note:"terhitung = CSM awal − pelepasan", tag:"[T]"},
  ra:{v:60000, page:"Kartu referensi B", note:"risk adjustment", tag:"[T]"},
  fcf:{v:1050000, page:"Kartu referensi B", note:"fulfilment cash flows (PV klaim+beban 990 + RA 60)", tag:"[T]"},
  premi_reas:{v:120000, page:"Kartu referensi C", note:"premi reasuransi (reinsurance held)", tag:"[T]"},
  recovery_reas:{v:60000, page:"Kartu referensi C", note:"recovery dari reasuradur atas klaim besar", tag:"[T]"},
  laba_bersih:{v:210000, page:"Kartu referensi A", note:"laba bersih FY2025", tag:"[T]"},
  aset:{v:2400000, page:"Kartu referensi D", note:"total aset 31 Des 2025", tag:"[T]"},
  liab:{v:1500000, page:"—", note:"terhitung = aset − ekuitas", tag:"[T]"},
  ekuitas:{v:900000, page:"Kartu referensi D", note:"total ekuitas 31 Des 2025", tag:"[T]"}
 },
 ratios:{
  combined:{v:74.07, def:"(klaim terjadi + beban asuransi) ÷ insurance revenue — definisi latihan atas seluruh portofolio", tag:"[T]"},
  service_margin:{v:25.93, def:"insurance service result ÷ insurance revenue", tag:"[T]"}
 },
 analyst:{
  inv:"Insurer ilustratif ini menarik di permukaan: CSM akhir 100 (Rp miliar) adalah laba masa depan yang sudah terkunci, service margin 25,9 persen menunjukkan jasa asuransi menguntungkan, dan combined ratio 74,1 persen (definisi latihan) jauh di bawah 100 persen. Yang menggangguku: seluruh cerita ini berdiri di atas asumsi — klaim ekspektasian 900 dan risk adjustment 60 tidak bisa diverifikasi dari ringkasan ini. Keputusan: layak dipelajari lebih lanjut, bukan layak dibeli — data ilustratif tidak cukup untuk vonis investasi.",
  cred:"Kekuatan kredit: CSM 100 sebagai bantalan laba masa depan dan service result 280 (Rp miliar) yang menutup beban. Risiko: klaim aktual 620 terhadap ekspektasi — bila pengalaman klaim memburuk 10 persen, service result tergerus 62. Ketergantungan reasuransi: recovery 60 dari premi reasuransi 120 — tanya siapa reasuradurnya dan seberapa cepat ia membayar. Covenant yang saya minta: combined ratio di bawah 100 persen, CSM akhir di atas 80, dan batas konsentrasi reasuradur tunggal.",
  foren:"Jembatan yang terverifikasi dari angkaku: service expense 800 = 620 + 180; service result 280 = 1.080 − 800; CSM akhir 100 = 150 − 50. Lubang terbesar: tidak ada rincian roll-forward CSM (kontrak baru, perubahan asumsi, akresi) dan tidak ada pengungkapan tingkat diskonto — dua hal yang menentukan apakah CSM 150 di awal tahun memang benar. Data tambahan yang saya minta: analisis pengalaman klaim 8 kuartal dan sensitivitas CSM terhadap perubahan asumsi klaim."
 },
 redflags:[
  "Klaim aktual 620 vs klaim ekspektasian dalam grup jiwa 300 per tahun — apakah pengalaman klaim keseluruhan memburuk, atau hanya satu klaim besar?",
  "Risk adjustment 60 atas fulfilment cash flows 990 — apakah 6 persen cukup untuk portofolio jiwa + umum yang risikonya berbeda?",
  "Recovery reasuransi 60 — separuh premi reasuransi 120; berapa lama piutang reasuransi ini tertagih?",
  "Laba bersih 210 vs service result 280 — selisih 70 adalah hasil investasi dan finance; dari mana tepatnya ia berasal?"
 ],
 callout:"Valuasi insurer bukan DCF atas premi. Analis memakai embedded value / appraisal value: CSM + risk adjustment + nilai bisnis baru, didiskonto — premi yang tumbuh tanpa CSM baru adalah pertumbuhan kosong."
};
