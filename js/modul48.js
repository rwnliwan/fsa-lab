/* FSA Lab — Modul 48: Lab Power BI — Studi Kasus FSA (KLBF/MIKA/BBRI, LK auditan FY2024; angka dari bedah-sendiri/data/*-benchmark.js; BBRI dalam jutaan Rp; rasio [T] terhitung, [B] diungkap bank; TIDAK ada file .pbix) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

/* Satu sumber angka: nilai persis benchmark (Rp penuh untuk KLBF/MIKA, jutaan Rp untuk BBRI).
   Tampilan diformat dari angka ini saat render — tidak ada salinan kedua. */
function fmtT(n){ return "Rp" + (n/1e12).toFixed(2).replace(".", ",") + " T"; }   /* Rp penuh -> triliun */
function fmtTjt(n){ return "Rp" + (n/1e6).toFixed(2).replace(".", ",") + " T"; } /* jutaan Rp -> triliun */
function pct(x, d){ return (x*100).toFixed(d === undefined ? 2 : d).replace(".", ",") + "%"; }
function dec(x, d){ return x.toFixed(d === undefined ? 2 : d).replace(".", ",") + "x"; }

var K = { /* KLBF 2024 (2023 dalam kurung) */
 rev:32627776108026, rev23:30449134077618, gross:12957040191898, gross23:11823245533384,
 ebit:4080720255919, ni:3246569754197, ni_attr:3240636626331, ni_attr23:2766748040055,
 ca:17187668427724, cl:4185749488069, assets:29429727898195, assets23:27057568182323,
 liab:4839294087709, eq:24590433810486, eq23:23120022010215, cfo:4785179041408, cfo23:2908095709372,
 capex:907909319042, div:1433930308710
};
var M = { /* MIKA 2024 (2023 dalam kurung) */
 rev:4874369366591, rev23:4264279218860, gross:2616424760353, gross23:2128458519076,
 ebit:1508644303608, ebit23:1207019140319, ni:1227206343203, ni_attr:1146354111424, ni_attr23:916130678388,
 ca:3320528580340, cl:700429903111, assets:8247188907280, assets23:7340842527691,
 liab:916743530738, eq:7330445376542, eq23:6599783247273, cfo:1728912731527, cfo23:1314134014358,
 capex:596795569927, div:472854331375
};
var B = { /* BBRI 2024, jutaan Rp (2023 hanya: pinjaman, aset, ekuitas atribusional) */
 nii:142057190, int_inc:199266252, int_exp:57209062, ni:60643808, patmi:60154887,
 loans:1298318089, loans23:1197752706, ckpn_loan:76902889, ckpn_exp:41757637,
 assets:1992983447, assets23:1965007030, giro:374554340, tab:544426947, dep:446468817,
 dpk:1365450104, liab:1669794400, eq:323189047, eq_attr:317093838, eq_attr23:311363556,
 ppop:116752000, div:55773483
};

var STMTS = {
klbf:{ title:"KLBF — PT Kalbe Farma Tbk (farmasi / consumer healthcare), LK konsolidasian auditan FY2024, KAP Purwantono, Sungkoro & Surja (EY), opini wajar tanpa pengecualian 27 Mar 2025", cols:["Pos","2024","2023"],
 rows:[
  {l:"Penjualan neto", v:fmtT(K.rev), v2:fmtT(K.rev23),
   d:"Tumbuh 7,2% (30,45 T → 32,63 T). Di CSV: kolom Penjualan_Neto. Di Power BI, kolom ini menjadi penyebut Gross Margin dan Net Margin.",
   psak:"LK KLBF 2024 hal. 4", f:"Kredit: pertumbuhan penjualan adalah sumber utama kemampuan bayar — tanpa ini, rasio lain tidak ada artinya. Investasi: tumbuh 7,2% dengan laba naik 17,1% = ekspansi margin, bukan sekadar volume. Forensik: cek divisi mana yang tumbuh (farmasi resep +12,2%?) — mix sementara atau struktural?"},
  {l:"Laba bruto — gross margin " + pct(K.gross/K.rev), v:fmtT(K.gross), v2:fmtT(K.gross23),
   d:"Gross margin 39,71% (2023: 38,83%). Laba bruto = penjualan − HPP; di CSV kolom Laba_Bruto sudah tersedia, tetapi DAX Gross Margin tetap memakai DIVIDE(SUM(Laba_Bruto), SUM(Penjualan_Neto)) supaya rasio ikut filter Tahun.",
   psak:"LK KLBF 2024 hal. 4", f:"Kredit: margin kotor yang melebar memberi bantalan bila beban naik. Investasi: operating leverage — beban penjualan naik ~8% vs penjualan +7,2%. Forensik: margin naik karena harga, mix produk, atau HPP yang ditekan?"},
  {l:"Laba usaha (TERHITUNG — bukan subtotal LK)", v:fmtT(K.ebit), v2:"— (tidak dihitung 2023)",
   d:"4.080.720.255.919 = laba bruto − beban penjualan − beban GA − R&D + pendapatan operasi lain − beban operasi lain. Nilai 2023 tidak dihitung di benchmark, jadi sel CSV 2023 dikosongkan — jangan diisi dengan tebakan.",
   psak:"LK KLBF 2024 hal. 4 — terhitung", f:"Kredit: laba usaha adalah penyebut awal kemampuan bayar bunga (beban bunga hanya Rp69,23 miliar). Investasi: jangan bandingkan laba usaha terhitung ini dengan laba usaha MIKA yang DISAJIKAN LK tanpa membaca definisinya. Forensik: pos 'operasi lain' di dalam rumus ini wajib dirinci bila besar."},
  {l:"Laba bersih — diatribusikan ke pemilik entitas induk (net margin " + pct(K.ni_attr/K.rev) + ")", v:fmtT(K.ni_attr), v2:fmtT(K.ni_attr23),
   d:"Net margin atribusional 9,93%. Di CSV ada dua kolom laba: Laba_Bersih_Total dan Laba_Bersih_Atribusi_Pemilik_Induk — ukuran DAX memakai yang atribusional, karena itulah hak pemegang saham induk.",
   psak:"LK KLBF 2024 hal. 5", f:"Kredit: laba adalah sumber internal pelunasan utang — tetapi utang KLBF kecil (D/E 0,20x), jadi ini bukan isu. Investasi: ROE 14,66% headline dengan D/E 0,20x = imbal hasil dari operasi, bukan leverage. Forensik: kualitas laba sehat — CFO 1,47x laba."},
  {l:"TOTAL ASET — current ratio " + dec(K.ca/K.cl) + ", D/E " + dec(K.liab/K.eq), v:fmtT(K.assets), v2:fmtT(K.assets23),
   d:"Total aset 29,43 T; total ekuitas 24,59 T; total liabilitas 4,84 T. Current ratio 4,11x = aset lancar 17,19 T ÷ liabilitas jangka pendek 4,19 T. Kas Rp4,72 T vs total utang bank hanya ~Rp388 miliar.",
   psak:"LK KLBF 2024 hal. 1–3", f:"Kredit: neraca sangat nyaman — kas menutup utang bank berkali-kali lipat. Investasi: kas besar + buyback Rp460 miliar + dividen Rp1,43 T = pengembalian kas besar ke pemegang saham. Forensik: pinjaman konversi baru Rp129,5 miliar — kepada siapa, harga konversi berapa?"},
  {l:"Kas neto dari aktivitas operasi (CFO) — kualitas laba " + dec(K.cfo/K.ni) + "x", v:fmtT(K.cfo), v2:fmtT(K.cfo23),
   d:"CFO Rp4,79 T menutup capex Rp907,91 miliar + dividen Rp1,43 T dengan sisa. Rasio CFO ÷ laba bersih 1,47x: kas mendahului akrual.",
   psak:"LK KLBF 2024 hal. 7–8", f:"Kredit: CFO menutup capex + dividen = perusahaan membiayai dirinya sendiri. Investasi: sisa kas setelah capex + dividen adalah ruang buyback/akuisisi. Forensik: tagihan restitusi pajak melonjak 3,2x menjadi Rp406 miliar — tanyakan, jangan simpulkan."}
 ]},
mika:{ title:"MIKA — PT Mitra Keluarga Karyasehat Tbk (rumah sakit / healthcare), LK konsolidasian auditan FY2024, KAP Amir Abadi Jusuf, Aryanto, Mawar & Rekan (RSM), opini wajar tanpa pengecualian 21 Mar 2025", cols:["Pos","2024","2023"],
 rows:[
  {l:"Pendapatan bersih", v:fmtT(M.rev), v2:fmtT(M.rev23),
   d:"Tumbuh 14,3% (4,26 T → 4,87 T). Di CSV: kolom Pendapatan_Bersih — padanan Penjualan_Neto di KLBF. Di Power BI, ganti nama kolom di rumus DAX, bukan angkanya.",
   psak:"LK MIKA 2024 hal. 3", f:"Kredit: pertumbuhan 14,3% menopang kemampuan bayar — utang nyaris tidak ada. Investasi: pendapatan +14,3%, laba atribusional +25,1% = ekspansi margin. Forensik: apakah tumbuh dari tarif naik, hunian (BOR) membaik, atau tempat tidur baru — LK tidak memecahnya."},
  {l:"Laba bruto — gross margin " + pct(M.gross/M.rev), v:fmtT(M.gross), v2:fmtT(M.gross23),
   d:"Gross margin 53,68% (2023: 49,91%) — jauh di atas farmasi/manufaktur, karena 'produknya' adalah jasa medis + hunian RS, bukan barang.",
   psak:"LK MIKA 2024 hal. 3", f:"Kredit: margin kotor tinggi = bantalan besar terhadap guncangan biaya. Investasi: jangan bandingkan margin RS dengan margin farmasi tanpa memahami bisnisnya — selisih margin adalah perbedaan bisnis. Forensik: beban usaha naik 18,6% vs pendapatan +14,3% — biaya apa yang tumbuh lebih cepat?"},
  {l:"Laba usaha (subtotal DISAJIKAN LK)", v:fmtT(M.ebit), v2:fmtT(M.ebit23),
   d:"Laba usaha 1,51 T; operating margin 31,0%. Berbeda dengan KLBF, angka ini adalah subtotal yang disajikan LK — bukan terhitung. Di CSV: kolom Laba_Usaha terisi untuk kedua tahun.",
   psak:"LK MIKA 2024 hal. 3 — disajikan", f:"Kredit: operating margin 31,0% memberi ruang besar menutup beban keuangan (hanya Rp17,54 miliar). Investasi: margin operasi setinggi ini layak diuji keberlanjutannya — tarif RS diatur dan sensitif terhadap kebijakan. Forensik: bandingkan definisi laba usaha MIKA vs KLBF sebelum membandingkan angkanya."},
  {l:"Laba bersih — diatribusikan ke pemilik entitas induk (net margin " + pct(M.ni_attr/M.rev) + ")", v:fmtT(M.ni_attr), v2:fmtT(M.ni_attr23),
   d:"Net margin atribusional 23,52% — tertinggi di antara tiga perusahaan modul ini. ROE (ekuitas akhir) 15,64%; ROE headline analis 18,61% memakai rata-rata ekuitas pemilik induk (tidak ada di CSV).",
   psak:"LK MIKA 2024 hal. 3", f:"Kredit: laba besar vs liabilitas kecil (D/E 0,13x) = risiko kredit minimal. Investasi: ROE 18,61% dengan D/E 0,13x — imbal hasil murni dari operasi. Forensik: seluruh saham treasuri Rp760 miliar ditarik via pengurangan modal — penyebut EPS menyusut 2,4%."},
  {l:"TOTAL ASET — current ratio " + dec(M.ca/M.cl) + ", D/E " + dec(M.liab/M.eq), v:fmtT(M.assets), v2:fmtT(M.assets23),
   d:"Total aset 8,25 T; total ekuitas 7,33 T; total liabilitas hanya 0,92 T. Current ratio 4,74x. Tidak ada utang bank sama sekali; satu-satunya 'utang berbunga' adalah liabilitas sewa Rp1,61 miliar (immaterial). Kas + investasi jangka pendek Rp2,43 T = 2,6x seluruh liabilitas.",
   psak:"LK MIKA 2024 hal. 1–2", f:"Kredit: neraca nyaris tanpa utang — risiko kredit material praktis nol pada 2024. Investasi: kas 'parkir' di investasi jangka pendek Rp1,36 T (+38%) — kenapa tidak dipakai ekspansi atau dikembalikan? Forensik: apa isi investasi jangka pendek itu — deposito, reksadana, atau surat berharga?"},
  {l:"Kas neto dari aktivitas operasi (CFO) — kualitas laba " + dec(M.cfo/M.ni) + "x", v:fmtT(M.cfo), v2:fmtT(M.cfo23),
   d:"CFO Rp1,73 T menutup capex Rp596,80 miliar + dividen Rp472,85 miliar dengan sisa Rp659 miliar. Capex 12,2% dari pendapatan + uang muka aset tetap Rp105 miliar menandakan ekspansi kapasitas.",
   psak:"LK MIKA 2024 hal. 5", f:"Kredit: CFO menutup capex + dividen dengan sisa besar. Investasi: capex + uang muka aset tetap = ekspansi RS baru/renovasi — pantau apakah kapasitas baru terisi. Forensik: taksiran tagihan restitusi pajak naik 3,6x menjadi Rp21,9 miliar — sengketa pajak apa yang berjalan?"}
 ]},
bbri:{ title:"BBRI — PT Bank Rakyat Indonesia (Persero) Tbk (bank mikro & ultra-mikro), LK konsolidasian auditan FY2024 (filing IDX 34 hal.) + press conference 12 Feb 2025; satuan JUTAAN Rupiah", cols:["Pos","2024","2023"],
 rows:[
  {l:"Pendapatan bunga bersih / NII [T]", v:fmtTjt(B.nii), v2:"— (tidak tersedia 2023)",
   d:"NII = pendapatan bunga Rp199,27 T − beban bunga Rp57,21 T = Rp142,06 T. Terhitung [T] dari dua baris LK. Beban bunga naik +30,6% YoY menekan NIM 41bps.",
   psak:"LK BBRI 2024 hal. 13", f:"Kredit: NII adalah mesin inti bank — PPoP naik 9,6% menunjukkan mesin sehat. Investasi: NIM terkompresi menguji thesis 'bank mikro = pricing power' — di 2024 pricing power tidak cukup menutup cost of fund. Forensik: penerimaan kembali aset dihapusbukukan +50,7% ke Rp25,36 T — berapa yang recurring?"},
  {l:"Laba bersih — PATMI (ROE " + pct(B.patmi/((B.eq_attr+B.eq_attr23)/2)) + " [T])", v:fmtTjt(B.patmi), v2:"— (tidak tersedia 2023)",
   d:"Laba bersih total Rp60,64 T (+0,4%); PATMI Rp60,15 T (+0,1%). ROE hitung-sendiri 19,14% [T] = PATMI ÷ rata-rata ekuitas atribusional; bank ungkap 19,01% — selisih 0,13pp karena definisi denominator.",
   psak:"LK BBRI 2024 hal. 18", f:"Kredit: laba hampir datar karena CKPN melonjak 41,4% — pasar membayar kualitas laba, bukan PPoP. Investasi: ROE 19,01% tetap premium, tetapi DPR 92,7% membuat pertumbuhan ekuitas organik tipis. Forensik: CKPN di neraca TURUN Rp3 T sementara beban CKPN NAIK Rp12,2 T — write-off berapa?"},
  {l:"Pinjaman diberikan — gross [T]", v:fmtTjt(B.loans), v2:fmtTjt(B.loans23),
   d:"Rp1.298,32 T (terhitung: 1.209,20 T + 89,12 T). Bank ungkap Rp1.354,64 T (mencakup pembiayaan) — inilah sumber dua LDR yang berbeda (95,1% vs 88,85%). Catat definisimu sebelum membandingkan.",
   psak:"LK BBRI 2024 hal. 6 — terhitung", f:"Kredit: dua definisi 'kredit' = dua LDR — pastikan definisi sama sebelum memvonis likuiditas. Investasi: pertumbuhan kredit adalah mesin pendapatan bunga. Forensik: selisih Rp56,32 T antara dua definisi kredit wajib dijelaskan sebelum dipakai."},
  {l:"Simpanan nasabah (DPK) [T] — CASA " + pct((B.giro+B.tab)/B.dpk), v:fmtTjt(B.dpk), v2:"— (tidak tersedia 2023)",
   d:"DPK = giro Rp374,55 T + tabungan Rp544,43 T + deposito Rp446,47 T = Rp1.365,45 T. CASA 67,3% [T] = (giro + tabungan) ÷ DPK — fondasi pendanaan murah.",
   psak:"LK BBRI 2024 hal. 9 — terhitung", f:"Kredit: CASA 67,3% menahan biaya dana — tetapi deposito masih Rp446 T dan beban bunga +30,6% menunjukkan kompetisi dana nyata. Investasi: CASA tinggi = keunggulan struktural bank mikro. Forensik: pantau migrasi tabungan ke deposito bila suku bunga naik."},
  {l:"TOTAL ASET — ROA " + pct(B.ni/((B.assets+B.assets23)/2)) + " [B=T]", v:fmtTjt(B.assets), v2:fmtTjt(B.assets23),
   d:"Total aset Rp1.992,98 T (+1,4% YoY). ROA 3,06% = laba bersih ÷ rata-rata aset — cocok persis dengan angka bank [B=T]. Total liabilitas Rp1.669,79 T [T] = aset − ekuitas.",
   psak:"LK BBRI 2024 hal. 4", f:"Kredit: aset tumbuh pelan (+1,4%) sementara CKPN melonjak — bank menahan laju, bukan ekspansi agresif. Investasi: ROA 3,06% tinggi untuk bank besar. Forensik: aset naik tipis tetapi beban CKPN naik 41,4% — provisi ke depan (front-loading) atau ada yang belum terlihat?"},
  {l:"Beban CKPN aset produktif — CoC " + pct(B.ckpn_exp/((B.loans+B.loans23)/2)) + " [T]", v:fmtTjt(B.ckpn_exp), v2:"— (tidak tersedia 2023)",
   d:"Beban CKPN Rp41,76 T, naik +41,4% YoY. CoC 3,35% [T] = beban CKPN ÷ rata-rata pinjaman gross (bank ungkap 3,2% — selisih definisi denominator). CKPN pinjaman di neraca Rp76,90 T (turun dari Rp79,92 T di 2023).",
   psak:"LK BBRI 2024 hal. 16", f:"Kredit: CoC naik ke 3,2%+ sementara NPL turun — front-loading yang hati-hati, atau ada yang belum terlihat di angka NPL? Investasi: re-rating butuh bukti CoC kembali ke ~2%. Forensik: write-off mempercantik NPL 2,78%? Minta angka write-off sebelum percaya."}
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
renderStmt("klbf");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Penjualan KLBF 2024 naik 7,2% sementara HPP naik 5,6%", q1:"Gross Margin KLBF", q2:"Net Margin KLBF", a1:"naik", a2:"naik",
  e:"Penjualan tumbuh lebih cepat dari HPP → laba bruto tumbuh lebih cepat dari penjualan → gross margin naik (38,83% → 39,71%). Margin yang melebar mengalir ke laba bersih, jadi net margin ikut naik (9,09% → 9,93%). Cek di dashboard: kartu KPI 2023 vs 2024 harus menunjukkan arah yang sama."},
 {t:"Beban CKPN BBRI naik 41,4% sementara PPoP naik 9,6%", q1:"PPoP BBRI", q2:"Laba bersih BBRI", a1:"tetap", a2:"turun",
  e:"PPoP = laba operasional SEBELUM pencadangan — CKPN belum masuk, jadi PPoP tidak bergerak oleh kenaikan CKPN. Laba bersih justru turun tekanannya: PPoP naik 9,6% tetapi laba bersih hanya +0,1% karena CKPN melonjak. Inilah cerita 'tumbuh tapi dimakan provisi'."},
 {t:"MIKA menarik seluruh saham treasuri Rp760 miliar via pengurangan modal (laba tetap)", q1:"Total ekuitas MIKA", q2:"ROE MIKA", a1:"turun", a2:"naik",
  e:"Penarikan saham treasuri mengurangi modal — ekuitas turun, sementara laba tetap. ROE = laba ÷ ekuitas: penyebut menyusut → ROE naik (penyebut EPS juga menyusut 2,4%). Kenaikan ROE seperti ini bukan kinerja operasi — ia rekayasa penyebut. Di dashboard, ROE naik tanpa NPM naik = sinyal untuk bertanya."},
 {t:"KLBF menambah kas Rp1,49 triliun sementara liabilitas jangka pendek tetap", q1:"Current Ratio KLBF", q2:"Utang berbunga KLBF", a1:"naik", a2:"tetap",
  e:"Kas adalah aset lancar: aset lancar naik, liabilitas lancar tetap → current ratio naik. Utang berbunga tidak bergerak — kas naik dari operasi, bukan dari utang baru. (Cek: kas 2023 Rp3,23 T → 2024 Rp4,72 T; utang berbunga 2024 Rp561,59 miliar.)"},
 {t:"DPK BBRI naik sementara pinjaman diberikan tetap", q1:"LDR hitung-sendiri BBRI", q2:"Pendapatan bunga bersih BBRI", a1:"turun", a2:"tetap",
  e:"LDR = pinjaman ÷ DPK: penyebut naik, pembilang tetap → LDR turun. Pendapatan bunga bersih tidak bergerak — ia berasal dari pinjaman dan aset produktif, bukan dari DPK. DPK naik justru menambah beban bunga bila dananya mengendap sebagai deposito."},
 {t:"MIKA belanja capex Rp597 miliar dibayar tunai dari kas", q1:"Kas dan setara kas MIKA", q2:"Aset tetap neto MIKA", a1:"turun", a2:"naik",
  e:"Capex tunai: kas keluar (aset lancar turun), aset tetap masuk (aset tetap naik). Total aset hampir tidak berubah — yang berubah adalah komposisinya. Di dashboard, kartu kas turun + kartu aset tetap naik di tahun yang sama adalah jejak capex, bukan kehilangan uang."}
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
    try{ localStorage.setItem("fsa_pg_m48", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Current Ratio KLBF 2024 (x) — cocokkan dengan kartu KPI dashboard-mu", hint:"Total aset lancar 17.187.668.427.724 ÷ total liabilitas jangka pendek 4.185.749.488.069", ans:4.11, dec:true, tol:0.02,
  why:"4,11x — aset lancar menutup liabilitas jangka pendek lebih dari 4 kali; cocok dengan analisis kredit benchmark."},
 {q:"Gross Margin MIKA 2024 (%)", hint:"Laba bruto 2.616.424.760.353 ÷ pendapatan bersih 4.874.369.366.591", ans:53.7, dec:true, tol:0.2,
  why:"53,7% — margin RS jauh di atas farmasi karena produknya jasa medis + hunian, bukan barang."},
 {q:"ROE (ekuitas akhir) KLBF 2024 (%)", hint:"Laba atribusional 3.240.636.626.331 ÷ total ekuitas akhir 24.590.433.810.486", ans:13.18, dec:true, tol:0.1,
  why:"13,18% — cocok dengan benchmark [hitungan]. Bukan 14,66%: itu memakai rata-rata ekuitas pemilik induk."},
 {q:"CASA Ratio BBRI 2024 (%)", hint:"(Giro 374.554.340 + tabungan 544.426.947) ÷ DPK 1.365.450.104 — satuan jutaan Rp, saling meniadakan", ans:67.3, dec:true, tol:0.2,
  why:"67,3% [T] — dana murah mendominasi simpanan nasabah; fondasi pendanaan murah bank mikro."},
 {q:"LDR hitung-sendiri BBRI 2024 (%)", hint:"Pinjaman gross 1.298.318.089 ÷ DPK 1.365.450.104 — satuan jutaan Rp", ans:95.1, dec:true, tol:0.2,
  why:"95,1% [T] — bukan 88,85% [B]: pembilang bank mencakup pembiayaan (Rp1.354,64T). Dua definisi, dua angka."},
 {q:"Cost of Credit (CoC) BBRI 2024 (%)", hint:"Beban CKPN 41.757.637 ÷ rata-rata pinjaman gross ((1.298.318.089 + 1.197.752.706) ÷ 2)", ans:3.35, dec:true, tol:0.05,
  why:"3,35% [T] — bank ungkap 3,2%; selisih definisi denominator. CoC di atas 3% adalah red flag kuning di dashboard."}
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
        var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0));
        if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu."; return; }
        ok = Math.abs(v - r.ans) <= r.tol;
      }
      el.innerHTML = ok ? "<strong>Tepat ✓</strong> "+r.why : "<strong>Belum tepat.</strong> "+r.why;
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Dashboard-mu: MIKA gross margin 53,68% dan net margin 23,52%; KLBF 39,71% dan 9,93%; BBRI ROE 19,14% dengan DPR 92,7%. Tulis 3 baris: apakah dashboard ini cukup untuk memutuskan beli — angka apa yang kamu pakai + dari mana, keputusanmu (beli / tunggu / hindari) + SATU hal yang membunuh tesismu.",
 credit:"Lensa kredit — Dashboard-mu: KLBF current ratio 4,11x dan D/E 0,20x; MIKA 4,74x dan 0,13x; BBRI CAR 26,63% [DIUNGKAP BANK] dan CoC 3,35%. Tulis 3 baris: bagaimana dashboard membantumu menilai kemampuan bayar ketiga perusahaan, satu ukuran yang kamu minta diverifikasi dulu, keputusanmu.",
 forensic:"Lensa forensik — Dashboard-mu menampilkan NIM 7,74% dan NPL 2,78% sebagai angka [DIUNGKAP BANK] tanpa ukuran DAX, plus dua LDR (95,1% vs 88,85%). Tulis 3 baris: apa yang kamu verifikasi dulu sebelum percaya dashboard, satu uji konsistensi internal (kartu KPI vs LK), dan satu temuan yang membuatmu menolak dashboard mentah-mentah."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m48_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m48_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Kamu mengimpor klbf-fsa.csv ke Power BI. Kolom Tahun (2023, 2024) sebaiknya diatur sebagai tipe data…",
  o:["Bilangan desimal, supaya Tahun bisa dipakai sebagai penyebut rasio dan dihitung rata-ratanya",
     "Tanggal lengkap dengan jam, supaya Power BI otomatis membuat tabel kalender dan hierarki waktu",
     "Teks, supaya Tahun jadi label kategori, bukan angka yang dijumlahkan",
     "Benar/Salah, supaya filter tahun hanya punya dua pilihan"],
  a:2},
 {q:"Mengapa ukuran Current Ratio ditulis dengan DIVIDE, bukan tanda bagi / langsung?",
  o:["DIVIDE mengembalikan BLANK bila penyebut nol, jadi kartu KPI tidak menampilkan error",
     "DIVIDE membuat angka rasio dibulatkan ke dua desimal dan diformat persen secara otomatis",
     "Tanda / tidak dikenali Power BI di dalam ukuran DAX",
     "DIVIDE mempercepat refresh data dari file CSV"],
  a:0},
 {q:"NIM BBRI 7,74% berlabel [DIUNGKAP BANK] dan TIDAK dibuatkan ukuran DAX di modul ini. Alasannya…",
  o:["NIM hanya berlaku untuk emiten manufaktur dan farmasi, sedangkan bank memakai ukuran yang sama sekali berbeda",
     "Rumus NIM memakai laba bersih dibagi ekuitas, dan kedua angka itu tidak tersedia di file CSV modul ini",
     "Power BI Desktop versi gratis tidak mendukung ukuran NIM untuk bank karena butuh lisensi Pro",
     "Aset produktif rata-rata — penyebut NIM — tidak diungkap di filing 34 halaman sumber CSV"],
  a:3},
 {q:"DuPont KLBF 2024 (ekuitas total rata-rata): NPM 9,93% × Asset Turnover 1,16 × Equity Multiplier 1,18 = ROE 13,58%. Bila NPM naik menjadi 11% dan dua faktor lain tetap, ROE akan…",
  o:["Tetap 13,58%, karena ROE DuPont hanya berubah bila ketiganya berubah bersamaan",
     "Naik menjadi sekitar 15,05%, karena ROE adalah hasil kali ketiga faktor",
     "Turun, karena margin yang lebih tinggi menekan perputaran aset",
     "Naik menjadi 14,66%, menyamai ROE headline analis"],
  a:1},
 {q:"Dashboard Power BI-mu menampilkan ROE BBRI 19,14% dan CASA 67,3% — sama persis dengan benchmark. Sebelum memakai angka itu untuk keputusan investasi, batasan terpenting adalah…",
  o:["Rasio yang dihitung Power BI memakai definisi bank, jadi tidak perlu dicek ke LK",
     "File CSV dari modul ini sudah diaudit oleh KAP yang sama dengan emiten, sehingga angka dashboard bisa langsung dipakai tanpa verifikasi ulang",
     "Power BI memvisualkan angka dari CSV — bila ada salah ketik di CSV, dashboard tetap tampil rapi dan salah",
     "Dashboard Power BI menggantikan laporan tahunan sebagai sumber utama keputusan investasi dan tidak perlu lagi dibaca"],
  a:2}
];
(function(){
  var h = "";
  QUIZ.forEach(function(q,i){
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
           window.FSAMistake.log(48, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Modul 48 Tuntas ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu bisa mengimpor CSV ke Power BI dengan tipe data yang benar, menulis ukuran DAX yang aman dengan DIVIDE, membedakan rasio yang bisa dihitung dari yang tidak bisa, membaca DuPont sebagai perkalian tiga faktor, dan mengingat bahwa Power BI memvisualkan — bukan memverifikasi. Kembali ke <a href=\"/\">FSA Lab</a>.</p>";
    try{ localStorage.setItem("fsa_gate_m48","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m48") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m48") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m48") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Modul 48 Tuntas ✓</h3><p>Modul 48 sudah kamu lewati sebelumnya — kembali ke <a href=\"/\">FSA Lab</a>.</p>";
  }
}catch(e){}
})();
