/* FSA Lab — Modul 39: Translasi Mata Uang Asing (PT Cakrawala Global fiktif; anak Singapura, SGD ribu; kurs IDR/SGD ilustratif: investasi 10.000, rata-rata 11.000, penutup 12.000) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
func:{ title:"Mata uang fungsional — mata uang lingkungan ekonomi utama anak (PSAK 221 = IAS 21)", cols:["Penentu","Nilai","Konteks"],
 rows:[
  {l:"Mata uang fungsional = mata uang lingkungan ekonomi utama", v:"IAS 21", v2:"bukan mata uang laporan",
   d:"Mata uang fungsional adalah mata uang dari lingkungan ekonomi utama tempat entitas beroperasi — mata uang yang paling memengaruhi harga jual dan biaya. Mata uang laporan (presentation currency) induk boleh berbeda: induk melaporkan dalam IDR, anak beroperasi dalam SGD. Salah menetapkan mata uang fungsional = salah memilih metode translasi.",
   psak:"PSAK 221 (IAS 21)", f:"Kredit: mata uang fungsional yang salah = risiko kurs yang salah diukur — covenant berbasis ekuitas bisa goyah karena CTA. Investasi: tanyakan 'dalam mata uang apa anak ini benar-benar hidup?' sebelum membaca labanya. Forensik: perubahan mata uang fungsional adalah judgment — minta alasan tertulis manajemen dan dampaknya ke laba."},
  {l:"Indikator utama: harga jual dan biaya operasi", v:"SGD", v2:"anak Singapura",
   d:"Anak Singapura menjual jasa dalam SGD dan membayar gaji, sewa, dan pemasok lokal dalam SGD — harga jual dan biaya dominan dalam SGD. Dua indikator ini yang paling menentukan: bila pelanggan membayar SGD dan biaya keluar SGD, lingkungan ekonomi utamanya adalah Singapura.",
   psak:"PSAK 221", f:"Kredit: biaya dalam SGD = kewajiban SGD terlindung alami oleh pendapatan SGD — risiko kurs neto lebih kecil dari yang tampak di neraca. Investasi: margin anak dalam SGD lebih stabil daripada margin tertranslasi dalam IDR. Forensik: harga jual dalam SGD tapi biaya besar dalam IDR = sinyal mata uang fungsional mungkin IDR, bukan SGD."},
  {l:"Indikator pendukung: pendanaan dan arus kas", v:"SGD", v2:"kas ditahan SGD",
   d:"Anak meminjam dari bank Singapura dalam SGD, kas operasi ditahan dalam SGD, dan dividen ke induk dibayar dari kas SGD yang tersisa. Pendanaan dan arus kas yang dominan dalam satu mata uang memperkuat penetapan mata uang fungsional — tetapi indikator ini pendukung, bukan penentu utama.",
   psak:"PSAK 221", f:"Kredit: utang SGD yang didanai arus kas SGD = risiko refinancing lokal, bukan risiko kurs grup. Investasi: dividen dari anak bergantung pada sisa kas SGD setelah kebutuhan lokal — bukan pada laba tertranslasi. Forensik: anak yang didanai penuh oleh induk dalam IDR tapi beroperasi dalam SGD — cek siapa yang menanggung risiko kurs."}
 ]},
trans:{ title:"Transaksi valas — pengakuan awal kurs spot, remeasurement pos moneter ke P&L", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Pengakuan awal: kurs spot tanggal transaksi", v:"11.000", v2:"kurs spot",
   d:"Transaksi dalam mata uang asing dicatat pertama kali dengan kurs spot pada tanggal transaksi. Contoh (ilustratif): anak membeli persediaan SGD 50 ribu saat kurs spot 11.000 → dicatat Rp550 juta (50 × 11.000, dalam Rp juta). Kurs spot hari itu adalah biaya perolehannya.",
   psak:"PSAK 221", f:"Kredit: biaya perolehan dalam IDR terkunci pada tanggal transaksi — risiko kurs baru muncul setelahnya. Investasi: transaksi besar di tanggal kurs ekstrem = biaya yang tidak terulang. Forensik: kurs spot yang dipakai harus bisa dilacak ke tanggal transaksi — kurs 'rata-rata bulan' untuk transaksi tunggal adalah tanda tanya."},
  {l:"Pos moneter diremeasure kurs penutup — selisih ke P&L", v:"rugi 50", v2:"550 → 600",
   d:"Pos moneter (kas, piutang, utang) dinilai kembali dengan kurs penutup setiap akhir periode, dan selisihnya masuk laba rugi. Contoh (ilustratif): utang dagang SGD 50 ribu yang belum dibayar — dicatat Rp550 juta, pada kurs penutup 12.000 menjadi Rp600 juta → rugi kurs Rp50 juta di P&L. Utang dalam SGD membengkak dalam IDR karena SGD menguat.",
   psak:"PSAK 221", f:"Kredit: utang valas yang membengkak = kewajiban riil membesar — cek apakah ada piutang valas yang mengimbanginya. Investasi: rugi kurs transaksi adalah volatilitas laba yang nyata, bukan 'non-kas' yang boleh diabaikan. Forensik: rugi kurs yang disembunyikan di OCI = pelanggaran — selisih transaksi masuk P&L, bukan OCI."},
  {l:"Pos non-moneter biaya historis: tidak diremeasure", v:"tetap 550", v2:"kurs historis",
   d:"Pos non-moneter yang diukur pada biaya historis (persediaan, aset tetap) TIDAK dinilai kembali saat kurs bergerak — ia tetap pada kurs saat perolehan. Persediaan SGD 50 ribu yang dicatat Rp550 juta tetap Rp550 juta meski kurs penutup 12.000. Pengecualian: pos non-moneter yang diukur pada nilai wajar dinilai kembali dengan kurs pada tanggal nilai wajar ditentukan.",
   psak:"PSAK 221", f:"Kredit: persediaan yang 'tetap' Rp550 juta sementara kurs naik = nilai jualnya dalam SGD tetap, dalam IDR naik — margin tertranslasi membesar tanpa usaha. Investasi: aset non-moneter yang tidak diremeasure = laba tertranslasi tidak mencerminkan seluruh perubahan nilai. Forensik: aset tetap yang tiba-tiba 'diremeasure' ke kurs penutup = metode temporal yang dilanggar — cek konsistensi."}
 ]},
current:{ title:"Metode kurs berjalan (current-rate) — seluruh neraca kurs penutup, CTA di OCI", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Aset dan liabilitas: kurs penutup", v:"12.000", v2:"1.000 × 12.000",
   d:"Current-rate: SEMUA aset dan liabilitas ditranslasi dengan kurs penutup. Contoh (ilustratif): aset anak SGD 1.000 ribu × 12.000 = Rp12.000 juta; liabilitas SGD 600 ribu × 12.000 = Rp7.200 juta. Satu kurs untuk seluruh neraca — sederhana, dan inilah yang membuat CTA muncul sebagai penyeimbang.",
   psak:"PSAK 221", f:"Kredit: aset tertranslasi naik saat SGD menguat — tetapi itu bukan kas tambahan, hanya penilaian kembali. Investasi: aset anak yang 'membesar' Rp1.000 juta karena kurs = bukan pertumbuhan operasi. Forensik: aset tetap yang ditranslasi kurs penutup adalah ciri current-rate — bila memakai kurs historis, metodenya temporal."},
  {l:"Laba rugi: kurs rata-rata", v:"1.100", v2:"100 × 11.000",
   d:"Laba rugi ditranslasi dengan kurs rata-rata periode (pendekatan praktis atas kurs tanggal transaksi). Contoh (ilustratif): laba bersih anak SGD 100 ribu × 11.000 = Rp1.100 juta; pendapatan SGD 800 ribu × 11.000 = Rp8.800 juta. Asumsinya transaksi tersebar merata sepanjang tahun — bila ada transaksi jumbo di satu tanggal, kurs tanggal itu lebih tepat.",
   psak:"PSAK 221", f:"Kredit: laba tertranslasi Rp1.100 juta bergantung pada kurs rata-rata — bandingkan dengan arus kas dividen aktual dari anak. Investasi: laba 'naik' karena kurs rata-rata naik = bukan kinerja operasi anak. Forensik: kurs rata-rata yang dipakai harus wajar terhadap pergerakan kurs tahun itu — cek bila kurs bergerak tajam di akhir tahun."},
  {l:"Ekuitas: kurs historis", v:"3.000 + 1.100", v2:"modal 10.000 · RE 11.000",
   d:"Ekuitas TIDAK memakai kurs penutup: modal disetor memakai kurs saat disetor, laba ditahan mengikuti laba rugi (kurs rata-rata). Contoh (ilustratif): modal SGD 300 ribu × 10.000 = Rp3.000 juta; laba ditahan SGD 100 ribu × 11.000 = Rp1.100 juta; ekuitas historis Rp4.100 juta. Inilah sumber CTA — ekuitas dicatat pada kurs lama, aset-liabilitas pada kurs baru.",
   psak:"PSAK 221", f:"Kredit: modal Rp3.000 juta adalah kas yang benar-benar disetor — jangkar yang tidak bergerak oleh kurs. Investasi: laba ditahan tertranslasi Rp1.100 juta = akumulasi laba, bukan kas yang bisa ditarik. Forensik: modal yang 'berubah' antar tahun tanpa setoran baru = tanda kurs historis tidak diterapkan konsisten."},
  {l:"CTA: selisih penyeimbang di OCI", v:"700", v2:"12.000 − 11.300",
   d:"CTA (cumulative translation adjustment) adalah selisih agar neraca seimbang: aset Rp12.000 juta − liabilitas Rp7.200 juta − ekuitas historis Rp4.100 juta = Rp700 juta. CTA dicatat di penghasilan komprehensif lain (OCI) dan terakumulasi di ekuitas — BUKAN di laba rugi. SGD menguat → aset neto anak lebih berharga dalam IDR → CTA positif.",
   psak:"PSAK 221", f:"Kredit: CTA Rp700 juta adalah ekuitas 'lunak' — bukan laba ditahan kas, dan bisa berbalik bila SGD melemah. Investasi: ekuitas tertranslasi Rp4.800 juta (4.100 + 700) tampak lebih besar — pisahkan mana laba, mana selisih kurs. Forensik: CTA yang masuk laba rugi = kesalahan klasifikasi — CTA hanya direklasifikasi ke P&L saat divestasi."}
 ]},
temporal:{ title:"Metode temporal — moneter kurs penutup, non-moneter historis, selisih di P&L", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Pos moneter: kurs penutup", v:"4.800 · 7.200", v2:"400 × 12.000 · 600 × 12.000",
   d:"Temporal: pos moneter memakai kurs penutup, sama seperti current-rate. Contoh (ilustratif): aset moneter (kas SGD 380 ribu + piutang SGD 20 ribu) × 12.000 = Rp4.800 juta; liabilitas moneter SGD 600 ribu × 12.000 = Rp7.200 juta. Posisi moneter neto anak adalah liabilitas SGD 200 ribu — inilah sumber selisih translasi di P&L.",
   psak:"PSAK 221", f:"Kredit: posisi moneter neto liabilitas SGD 200 ribu = setiap penguatan SGD menambah beban translasi — eksposur yang terukur. Investasi: aset moneter Rp4.800 juta adalah yang benar-benar bisa menjadi kas; sisanya aset non-moneter. Forensik: klasifikasi moneter vs non-moneter adalah garis pemisah metode ini — persediaan yang diklaim 'moneter' adalah tanda tanya."},
  {l:"Pos non-moneter: kurs historis", v:"2.750 + 3.850", v2:"250 & 350 × 11.000",
   d:"Pos non-moneter memakai kurs saat perolehan (kurs historis). Contoh (ilustratif): persediaan SGD 250 ribu × 11.000 = Rp2.750 juta; aset tetap SGD 350 ribu × 11.000 = Rp3.850 juta — kurs 11.000 karena pembelian terjadi sepanjang tahun (kurs historis ≈ kurs rata-rata). Total aset temporal Rp11.400 juta (4.800 + 2.750 + 3.850), lebih kecil dari current-rate Rp12.000 juta.",
   psak:"PSAK 221", f:"Kredit: aset temporal Rp11.400 juta lebih konservatif — tidak membesar hanya karena kurs penutup naik. Investasi: aset tetap yang 'tidak ikut naik' saat SGD menguat = laba masa depan (depresiasi) juga tidak ikut naik. Forensik: kurs historis persediaan harus bisa dilacak ke tanggal beli — 'kurs rata-rata' untuk barang yang dibeli di satu tanggal adalah penyederhanaan yang harus diungkap."},
  {l:"Selisih translasi masuk laba rugi", v:"gain 100", v2:"laba 1.200 vs 1.100",
   d:"Di bawah temporal, selisih translasi pos moneter neto diakui di laba rugi — bukan OCI. Contoh (ilustratif): posisi moneter neto awal aset SGD 300 ribu menguat (12.000 − 10.000) = gain Rp600 juta; arus moneter neto −SGD 500 ribu sepanjang tahun (12.000 − 11.000) = rugi Rp500 juta; gain neto Rp100 juta. Laba temporal Rp1.200 juta vs laba current-rate Rp1.100 juta — selisih Rp100 juta persis gain ini. Rekonsiliasi: ekuitas temporal Rp4.200 juta = modal 3.000 + laba ditahan 1.200.",
   psak:"PSAK 221", f:"Kredit: laba temporal Rp1.200 juta mengandung gain kurs Rp100 juta — pisahkan laba operasi dari laba kurs sebelum menilai kemampuan bayar. Investasi: laba temporal lebih volatil — ia menanggung seluruh pergerakan kurs pos moneter. Forensik: gain Rp100 juta harus bisa direkonsiliasi ke perubahan posisi moneter neto — gain tanpa perubahan posisi adalah tanda tanya."}
 ]},
pilih:{ title:"Kapan pakai yang mana — plus divestasi dan hiperinflasi", cols:["Aturan","Metode","Konteks"],
 rows:[
  {l:"Current-rate bila mata uang fungsional = mata uang lokal anak", v:"SGD → current", v2:"CTA di OCI",
   d:"Bila anak beroperasi mandiri dalam mata uang lokalnya (SGD), pakai current-rate: seluruh neraca kurs penutup, laba rugi kurs rata-rata, CTA di OCI. Anak Singapura PT Cakrawala Global memakai current-rate karena harga jual, biaya, dan pendanaannya dominan SGD.",
   psak:"PSAK 221", f:"Kredit: CTA di OCI = volatilitas kurs tidak menyentuh laba — covenant berbasis laba lebih stabil. Investasi: laba current-rate mencerminkan operasi anak tanpa noise kurs pos moneter. Forensik: anak yang 'mandiri' tapi seluruh penjualannya ke induk dalam IDR = mata uang fungsional yang perlu dipertanyakan."},
  {l:"Temporal bila mata uang fungsional = mata uang induk", v:"IDR → temporal", v2:"selisih di P&L",
   d:"Bila mata uang fungsional anak adalah mata uang induk (IDR) — misalnya anak hanya perpanjangan operasi induk, menjual dalam IDR dan didanai induk — pakai temporal: moneter kurs penutup, non-moneter historis, selisih di P&L. Secara ekonomi anak ini 'diukur ulang' seolah-olah transaksinya dalam IDR sejak awal.",
   psak:"PSAK 221", f:"Kredit: selisih di P&L = laba grup menyerap seluruh volatilitas kurs — covenant laba harus memberi ruang untuk itu. Investasi: laba temporal yang berayun karena kurs = bukan kinerja operasi — baca laba sebelum selisih translasi. Forensik: perpindahan current-rate ke temporal mengubah tempat selisih (OCI ke P&L) — bandingkan laba historis sebelum dan sesudah perubahan."},
  {l:"Divestasi: CTA direklasifikasi OCI → P&L", v:"700", v2:"sekali, saat jual",
   d:"Saat induk kehilangan pengendalian atas anak asing, CTA yang terakumulasi di OCI direklasifikasi (didaur ulang) ke laba rugi sebagai bagian dari laba/rugi pelepasan. Contoh (ilustratif): CTA Rp700 juta masuk P&L di tahun penjualan — laba tahun itu naik Rp700 juta sekali saja, dan saldo CTA di OCI menjadi nol. Ini bukan laba operasi — ini realisasi selisih kurs yang tertunda.",
   psak:"PSAK 221", f:"Kredit: laba tahun divestasi membengkak Rp700 juta sekali — jangan kapitalisasi laba itu ke kemampuan bayar berkelanjutan. Investasi: 'laba naik' di tahun jual anak = keuntungan pelepasan, bukan perbaikan operasi. Forensik: CTA yang direklasifikasi sebagian atau dicicil = tanda tanya — reklasifikasi terjadi penuh saat pengendalian hilang."},
  {l:"Hiperinflasi (IAS 29): restate dulu, baru translate", v:"IAS 29", v2:"kurs penutup",
   d:"Bila mata uang fungsional anak adalah mata uang ekonomi hiperinflasi, laporan anak dinyatakan kembali (restatement) dengan indeks harga umum sesuai IAS 29 (PSAK 243) DAHULU — semua pos, termasuk non-moneter — lalu ditranslasi dengan kurs penutup. Tanpa restatement, angka historis dari tahun-tahun inflasi tinggi tidak sebanding dan translasi menghasilkan angka yang menyesatkan.",
   psak:"IAS 29", f:"Kredit: restatement IAS 29 mengubah seluruh basis angka anak — rasio sebelum dan sesudah restatement tidak bisa dibandingkan langsung. Investasi: laba anak hiperinflasi tanpa restatement = ilusi nominal. Forensik: anak di negara inflasi tinggi yang TIDAK direstatement = laporan yang belum menerapkan IAS 29 — cek pengungkapan."}
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
renderStmt("func");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"SGD menguat: kurs penutup 12.000 → 13.000, anak memakai current-rate", q1:"CTA (OCI)", q2:"Aset tertranslasi", a1:"naik", a2:"naik",
  e:"CTA 700 → 1.100 (+400 = aset neto SGD 400 ribu × kenaikan kurs 1.000); aset 12.000 → 13.000 (1.000 × 13.000). SGD menguat membesarkan aset neto anak dalam IDR — tetapi itu penilaian kembali, bukan kas."},
 {t:"SGD melemah: kurs penutup 12.000 → 11.000, anak memakai current-rate", q1:"CTA (OCI)", q2:"Ekuitas tertranslasi", a1:"turun", a2:"turun",
  e:"CTA 700 → 300; ekuitas tertranslasi 4.800 → 4.400 (aset 11.000 = liabilitas 6.600 + modal 3.000 + laba ditahan 1.100 + CTA 300). Pelemahan SGD menggerus ekuitas grup lewat OCI — laba rugi tidak tersentuh."},
 {t:"Anak memakai temporal, SGD melemah 12.000 → 11.000", q1:"Laba bersih temporal", q2:"Aset non-moneter tertranslasi", a1:"naik", a2:"tetap",
  e:"Posisi moneter neto anak adalah liabilitas SGD 200 ribu — SGD melemah membuat utang itu lebih murah dalam IDR → translation gain → laba temporal naik. Persediaan dan aset tetap tetap pada kurs historis 11.000, tidak bergerak oleh kurs penutup."},
 {t:"Anak memakai temporal, SGD menguat 12.000 → 13.000", q1:"Laba bersih temporal", q2:"Aset moneter tertranslasi", a1:"turun", a2:"naik",
  e:"Liabilitas moneter neto SGD 200 ribu × kenaikan kurs 1.000 = rugi translasi Rp200 juta → laba temporal turun. Aset moneter 400 × 13.000 = Rp5.200 juta (naik dari 4.800). Di bawah temporal, penguatan mata uang anak merugikan laba bila posisi moneter neto adalah liabilitas."},
 {t:"Induk menjual seluruh kepemilikan di anak Singapura", q1:"Laba tahun divestasi", q2:"CTA di OCI", a1:"naik", a2:"turun",
  e:"CTA Rp700 juta yang terakumulasi di OCI direklasifikasi ke laba rugi sebagai bagian dari laba pelepasan → laba tahun itu naik Rp700 juta sekali saja, dan saldo CTA di OCI menjadi nol. Laba ini realisasi selisih kurs yang tertunda — bukan perbaikan operasi."},
 {t:"Mata uang fungsional anak ternyata IDR, bukan SGD", q1:"Volatilitas laba grup", q2:"CTA di OCI", a1:"naik", a2:"turun",
  e:"Metode beralih dari current-rate ke temporal: selisih translasi pindah dari OCI ke laba rugi → laba grup menyerap seluruh pergerakan kurs pos moneter dan menjadi lebih volatil. CTA di OCI menjadi nol karena di bawah temporal tidak ada CTA."}
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
    try{ localStorage.setItem("fsa_pg_m39", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
  }
  $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  r.scrollIntoView({behavior:"smooth", block:"center"});
}
renderPg();

/* ---------- LAB RASIO ---------- */
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
 {q:"Aset tertranslasi — current-rate (Rp juta)", hint:"Aset anak SGD 1.000 ribu × kurs penutup 12.000 (IDR/SGD, ilustratif)", ans:12000, dec:false, tol:1,
  why:"Rp12.000 juta — seluruh aset memakai kurs penutup di bawah current-rate. Cek: 1.000 × 12.000 = 12.000.000 ribu IDR = Rp12.000 juta."},
 {q:"Laba bersih tertranslasi — current-rate (Rp juta)", hint:"Laba bersih anak SGD 100 ribu × kurs rata-rata 11.000 (ilustratif)", ans:1100, dec:false, tol:1,
  why:"Rp1.100 juta — laba rugi memakai kurs rata-rata. Cek: 100 × 11.000 = 1.100.000 ribu IDR = Rp1.100 juta."},
 {q:"CTA — current-rate (Rp juta)", hint:"Aset 12.000 − liabilitas 7.200 − modal 3.000 − laba ditahan 1.100 (Rp juta)", ans:700, dec:false, tol:1,
  why:"Rp700 juta — selisih penyeimbang agar A = L + E. Cek: 12.000 − 7.200 − 3.000 − 1.100 = 700. CTA dicatat di OCI, bukan laba rugi."},
 {q:"Laba bersih — metode temporal (Rp juta)", hint:"Laba sebelum selisih translasi 1.100 + selisih translasi pos moneter neto 100 (Rp juta)", ans:1200, dec:false, tol:1,
  why:"Rp1.200 juta — bandingkan dengan laba current-rate Rp1.100 juta: selisih Rp100 juta persis gain translasi pos moneter neto di P&L. Rekonsiliasi: ekuitas temporal 4.200 = modal 3.000 + laba ditahan 1.200."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 12.000">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 12.000)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — laba anak SGD 100 ribu (Rp1.100 juta current-rate) naik, tetapi ekuitas tertranslasi Rp4.800 juta berisi CTA Rp700 juta yang bukan kas dan bisa berbalik bila SGD melemah. Apakah saham induk layak dibeli karena 'laba naik'? Tulis 3 baris: apa yang menarik, apa yang mengganggumu, keputusanmu.",
 credit:"Lensa kredit — kamu analis kredit induk: anak menyumbang aset Rp12.000 juta, tetapi Rp700 juta ekuitasnya adalah CTA (selisih kurs, bukan laba ditahan kas) dan utang anak SGD 600 ribu (Rp7.200 juta) membengkak bila SGD menguat. Tulis 3 baris: kekuatan, risiko yang perlu covenant, kesimpulanmu.",
 forensic:"Lensa forensik — verifikasi jembatan 12.000 = 7.200 + 3.000 + 1.100 + 700: dari mana Rp700 juta berasal, dan apa yang TIDAK bisa kamu verifikasi dari angka agregat ini? Tulis 3 baris: yang terverifikasi, lubang terbesar, data tambahan yang kamu minta."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m39_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m39_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"Mata uang fungsional anak di Singapura ditentukan terutama oleh…", o:["Mata uang laporan induk, karena konsolidasi memakai mata uang induk", "Mata uang yang dominan dalam harga jual dan biaya operasi anak", "Mata uang negara tempat kantor pusat induk berada", "Mata uang yang memberi laba tertranslasi tertinggi bagi grup"], a:1},
 {q:"Di bawah metode kurs berjalan (current-rate), pos yang ditranslasi dengan kurs penutup adalah…", o:["Hanya pos moneter; pos non-moneter memakai kurs historis", "Aset dan liabilitas, termasuk aset tetap dan persediaan", "Hanya laba rugi; neraca memakai kurs rata-rata tahun berjalan", "Hanya ekuitas; aset dan liabilitas memakai kurs historis"], a:1},
 {q:"Selisih translasi (CTA) Rp700 juta pada contoh current-rate dicatat di…", o:["Laba rugi tahun berjalan sebagai keuntungan kurs periode ini", "Penghasilan komprehensif lain (OCI), terakumulasi di ekuitas", "Laporan arus kas sebagai penerimaan kas dari operasi", "Catatan atas laporan keuangan saja, tanpa jurnal apa pun"], a:1},
 {q:"Utang dagang SGD 50 ribu yang belum dibayar pada akhir tahun dinilai kembali dengan…", o:["Kurs historis saat transaksi, tanpa penilaian kembali", "Kurs rata-rata tahun berjalan, dan selisihnya masuk OCI", "Kurs penutup, dan selisih kursnya diakui di laba rugi", "Kurs penutup, dan selisihnya masuk OCI sebagai CTA"], a:2},
 {q:"Anak beroperasi di negara hiperinflasi (IAS 29). Langkah yang tepat sebelum translasi adalah…", o:["Restatement dengan indeks harga umum, lalu kurs penutup", "Memakai metode temporal tanpa penyesuaian harga apa pun", "Memakai kurs rata-rata untuk pos neraca dan laba rugi", "Menghentikan konsolidasi anak sampai inflasi kembali normal"], a:0}];
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
           window.FSAMistake.log(39, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu membaca translasi seperti analis multinasional: mata uang fungsional, current-rate vs temporal (PSAK 221 = IAS 21), CTA di OCI, dan remeasurement pos moneter ke P&L — semuanya terartikulasi. Lanjut ke <a href=\"/modul-40/\">Modul 40 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m39","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m39") === "lolos"){
    box.style.display = "block";
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m39") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m39") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Modul 39 sudah kamu lewati sebelumnya — lanjut ke <a href=\"/modul-40/\">Modul 40</a>.</p>";
  }
}catch(e){}
})();
