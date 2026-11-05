/* FSA Lab — Case Library registry (satu sumber kebenaran).
   Dipakai: /kasus/ (indeks matriks), /healthcare/ (track), badge impostor.
   level_final: null = belum dikalibrasi. Kalibrasi pilot via fsa_case_calib_<slug>
   (diisi dari prompt "Seberapa sulit menurutmu?" — hanya Septian = final, n=1).
   progress: cara membaca status dari localStorage existing.
     kind "s5"   → drill Bedah Sendiri: key s5 = {revealed:true}; ns = prefix s1..s4
     kind "exam" → ujian: key s5 = {revealed:true}; ns = prefix s0..s7
     kind "cf"   → case-files: fsa_cf_<idx> ada = pernah dikerjakan
     kind "manual" → fsa_case_done_<slug> (diset manual / batch berikutnya)
   benchmark: "terverifikasi" (angka filing asli) | "naratif" (fakta publik, angka disederhanakan).
   impostor_armed: true = drill ini BISA mengandung impostor (lapisan, bukan tipe standalone).
*/
window.FSA_CASES = [
 {slug:"soci", title:"Bedah Filing: SOCI", sektor:"transportasi", subsektor:"pelayaran",
  tipe:"guided", peran:"latihan", level_estimasi:"mudah–menengah", level_final:null,
  prasyarat:[], benchmark:"terverifikasi", impostor_armed:false,
  route:"/bedah-filing/", progress:{kind:"manual", key:"fsa_case_done_soci"},
  desc:"Walkthrough terpandu Annual Report 2024 PT Soechi Lines Tbk — 12 pemberhentian, tiap temuan dipetakan ke modul. Janji guided: semua angka benar."},
 {slug:"klbf", title:"Bedah Sendiri: KLBF", sektor:"healthcare", subsektor:"farmasi",
  tipe:"blind", peran:"latihan", level_estimasi:"mudah–menengah", level_final:null,
  prasyarat:[], benchmark:"terverifikasi", impostor_armed:true,
  route:"/bedah-sendiri/klbf/", progress:{kind:"s5", key:"fsa_bs_klbf_s5", ns:"fsa_bs_klbf"},
  desc:"Latihan blind atas AR 2024 PT Kalbe Farma Tbk (auditan): input 28 angka + disiplin sumber, 8 cek mekanis, 3 lensa, benchmark reveal."},
 {slug:"mika", title:"Bedah Sendiri: MIKA", sektor:"healthcare", subsektor:"rumah sakit",
  tipe:"blind", peran:"latihan", level_estimasi:"mudah–menengah", level_final:null,
  prasyarat:[], benchmark:"terverifikasi", impostor_armed:false,
  route:"/bedah-sendiri/mika/", progress:{kind:"s5", key:"fsa_bs_mika_s5", ns:"fsa_bs_mika"},
  desc:"Healthcare blind #1: LK auditan 2024 PT Mitra Keluarga Karyasehat Tbk — 26 angka + disiplin sumber, 8 cek mekanis, 3 lensa, benchmark reveal. Impostor-free."},
 {slug:"tspc", title:"Guided: TSPC", sektor:"healthcare", subsektor:"farmasi",
  tipe:"guided", peran:"latihan", level_estimasi:"mudah", level_final:null,
  prasyarat:[], benchmark:"terverifikasi", impostor_armed:false,
  route:"/healthcare/guided-tspc/", progress:{kind:"manual", key:"fsa_hc_tspc_done"},
  desc:"Walkthrough terpandu LK auditan 2024 PT Tempo Scan Pacific Tbk — 12 stop: puzzle revenue +4% vs laba usaha +68%, 3 segmen 3 margin, tuas iklan Rp1,54 T, 5 jebakan sektor diperiksa satu per satu."},
 {slug:"bbri", title:"Bank Practice: BBRI", sektor:"bank", subsektor:"bank mikro",
  tipe:"blind", peran:"latihan", level_estimasi:"menengah", level_final:null,
  prasyarat:["M30 (bank deep-dive)"], benchmark:"terverifikasi", impostor_armed:true,
  route:"/bedah-sendiri/bbri/", progress:{kind:"s5", key:"fsa_bp_bbri_s5", ns:"fsa_bp_bbri"},
  desc:"Latihan blind bank: LK FY2024 PT Bank Rakyat Indonesia Tbk — 33 pos + 5 rasio ber-definisi wajib, 10 cek bank-spesifik (NIM, CASA, NPL, coverage, LDR, CAR)."},
 {slug:"bbca", title:"Ujian Blind: BBCA", sektor:"bank", subsektor:"bank korporat",
  tipe:"blind", peran:"ujian", level_estimasi:"menengah–sulit", level_final:null,
  prasyarat:["M38 lulus (hard gate)"], benchmark:"terverifikasi", impostor_armed:false,
  route:"/ujian/", progress:{kind:"exam", key:"fsa_exam_bbca_s5", ns:"fsa_exam_bbca"},
  desc:"Ujian kanonis FSA Lab: laporan interim unaudited BBCA H1 2026, derivasi Q2 standalone, rubrik K1–K5. Satu blind attempt terkunci permanen."},
 {slug:"unvr-transfer", title:"Ujian Transfer: UNVR", sektor:"konsumer", subsektor:"barang konsumen",
  tipe:"blind", peran:"ujian", level_estimasi:"menengah", level_final:null,
  prasyarat:["Ujian BBCA lulus (hard gate)"], benchmark:"terverifikasi", impostor_armed:false,
  route:"/ujian-transfer/", progress:{kind:"exam", key:"fsa_transfer_s5", ns:"fsa_transfer"},
  desc:"Ujian transfer FSA Lab: LK auditan UNVR FY2024 (non-bank) — 20 angka, 8 cek mekanis, 3 lensa thesis testing, red-flag memo mini, rubrik T1–T3. Bukti skill transfer."},
 {slug:"garuda", title:"Garuda Indonesia", sektor:"penerbangan", subsektor:"maskapai",
  tipe:"fraud", peran:"latihan", level_estimasi:"menengah", level_final:null,
  prasyarat:[], benchmark:"naratif", impostor_armed:false,
  route:"/case-files/#garuda", progress:{kind:"cf", idx:0},
  desc:"Pengakuan pendapatan prematur US$240 jt dari kontrak 15 tahun (2016–2018) — restatement resmi 2019."},
 {slug:"enron", title:"Enron", sektor:"energi", subsektor:"energi & trading",
  tipe:"fraud", peran:"latihan", level_estimasi:"menengah", level_final:null,
  prasyarat:[], benchmark:"naratif", impostor_armed:false,
  route:"/case-files/#enron", progress:{kind:"cf", idx:1},
  desc:"Utang off-balance-sheet via SPE yang tidak dikonsolidasi (1998–2000) — bangkrut Des 2001."},
 {slug:"wirecard", title:"Wirecard", sektor:"fintech", subsektor:"pembayaran",
  tipe:"fraud", peran:"latihan", level_estimasi:"sulit", level_final:null,
  prasyarat:[], benchmark:"naratif", impostor_armed:false,
  route:"/case-files/#wirecard", progress:{kind:"cf", idx:2},
  desc:"Kas fiktif €1,9 miliar di rekening trust Asia (2017–2019) — insolven Jun 2020."},
 {slug:"jiwasraya", title:"Jiwasraya", sektor:"asuransi", subsektor:"asuransi jiwa",
  tipe:"fraud", peran:"latihan", level_estimasi:"menengah", level_final:null,
  prasyarat:[], benchmark:"naratif", impostor_armed:false,
  route:"/case-files/#jiwasraya", progress:{kind:"cf", idx:3},
  desc:"Gagal bayar polis JS Saving Plan & kerugian negara Rp16,81 T (2017–2019)."},
 {slug:"snp", title:"SNP Finance", sektor:"pembiayaan", subsektor:"multifinance",
  tipe:"fraud", peran:"latihan", level_estimasi:"menengah", level_final:null,
  prasyarat:[], benchmark:"naratif", impostor_armed:false,
  route:"/case-files/#snp", progress:{kind:"cf", idx:4},
  desc:"Piutang fiktif & gagal bayar MTN Rp1,85 T (2016–2018) — rating idA → Selective Default."},
 {slug:"indosurya", title:"Indosurya", sektor:"pembiayaan", subsektor:"koperasi",
  tipe:"fraud", peran:"latihan", level_estimasi:"mudah–menengah", level_final:null,
  prasyarat:[], benchmark:"naratif", impostor_armed:false,
  route:"/case-files/#indosurya", progress:{kind:"cf", idx:5},
  desc:"Pola Ponzi berkedok koperasi: dana ~Rp106 T ke 26 perusahaan cangkang (2018–2020)."},
 {slug:"luckin", title:"Luckin Coffee", sektor:"konsumer", subsektor:"ritel kopi",
  tipe:"fraud", peran:"latihan", level_estimasi:"mudah", level_final:null,
  prasyarat:[], benchmark:"naratif", impostor_armed:false,
  route:"/case-files/#luckin", progress:{kind:"cf", idx:6},
  desc:"Fabricasi penjualan ~RMB 2,2 miliar (2018–2020) — revenue-per-store melawan logika harga."}
];

/* Slot kosong prioritas (P1–P5) — tampil sebagai "Segera hadir", bukan link mati. */
window.FSA_CASE_SOON = [
 {prio:"P1", title:"Impostor pertama", desc:"Mekanik impostor sudah live di KLBF + BBRI (lihat Bedah Sendiri)."},
 {prio:"P2", title:"Healthcare blind #2 — emiten RS", desc:"Pilot track butuh ≥2 case se-sektor agar pola sektor terasa, bukan anekdot. Kandidat: MIKA / SILO / HEAL — butuh verifikasi benchmark filing."},
 {prio:"P3", title:"Healthcare guided — farmasi ✅ LIVE", desc:"Guided TSPC live 4 Nov 2026 (12-stop terpandu, LK auditan 2024)."},
 {prio:"P4", title:"Tambang blind", desc:"Diversitas maksimal: cyclical commodity vs semua yang ada sekarang."},
 {prio:"P5", title:"Konsumer blind", desc:"FMCG staple — model bisnis paling intuitif setelah farmasi."}
];

/* Helper kecil: baca kalibrasi pilot untuk satu slug. */
window.FSA_caseCalib = function(slug){
  try{ var v=JSON.parse(localStorage.getItem("fsa_case_calib_"+slug)); return v||null; }
  catch(e){ return null; }
};
window.FSA_caseLevelLabel = function(c){
  var cal = window.FSA_caseCalib(c.slug);
  if(cal && cal.level) return {txt:cal.level, calib:true};
  return {txt:c.level_estimasi, calib:false};
};
