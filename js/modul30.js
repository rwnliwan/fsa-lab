/* FSA Lab — Modul 30: Analisis Bank Deep-Dive (BANK ILUSTRATIF — PT Bank Nusantara Fiktif, Rp miliar) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
capital:{ title:"Permodalan — bantalan pertama saat kredit macet", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"CAR (KPMM) 22,1%", v:"22,1%", v2:"min OJK 8% (ilustratif)",
   d:"CAR = modal ÷ ATMR. Minimum OJK 8% (ambang ilustratif — floor dasar yang disederhanakan; batas yang berlaku dapat bergantung pada kategori bank, profil risiko, dan buffer); bank ini 22,1% → buffer ≈ 14,1 poin persentase. ATMR ilustratif Rp42.986 miliar (9.500 ÷ 22,1%). Modal tebal = ruang menyerap kerugian kredit sebelum menyentuh batas regulator.",
   psak:"POJK KPMM", f:"Kredit: buffer tebal = bank tahan guncangan; tapi cek komposisi modal — modal inti vs modal pelengkap. Investasi: CAR jumbo = aman, namun modal menganggur menekan ROE. Forensik: CAR naik tanpa setoran modal? Curigai ATMR yang 'menyusut' — cek perubahan bobot risiko."},
  {l:"Rasio ekuitas terhadap aset 11,2%", v:"11,2%", v2:"9.500 ÷ 85.000",
   d:"Ekuitas Rp9.500 miliar ÷ aset Rp85.000 miliar = 11,2% — setiap Rp100 aset didanai Rp11,2 modal sendiri. Leverage aset ≈ 8,9x, konservatif untuk bank. Jembatan ROE: 2,24% × 8,9x ≈ 20%.",
   psak:"—", f:"Kredit: leverage rendah = klaim kreditur lebih aman. Investasi: leverage adalah mesin ROE bank — tapi leverage tinggi tanpa CAR tebal = rapuh. Forensik: ekuitas naik karena laba ditahan (bagus) atau revaluasi aset (lunak)?"},
  {l:"ATMR Rp42.986 miliar — penyebut CAR", v:"42.986", v2:"9.500 ÷ 22,1%",
   d:"ATMR (aset tertimbang menurut risiko) = setiap aset dikali bobot risikonya: kredit korporasi berbobot lebih tinggi daripada obligasi pemerintah, misalnya. CAR 22,1% = modal Rp9.500 miliar ÷ ATMR Rp42.986 miliar — ATMR di sini DITURUNKAN dari CAR (9.500 ÷ 22,1%), bukan angka laporan yang berdiri sendiri. Densitas risiko: ATMR ÷ aset = 42.986 ÷ 85.000 ≈ 50,6% — moderat. ATMR naik (kredit tumbuh ke segmen berisiko) → CAR turun walau modal tetap.",
   psak:"POJK KPMM", f:"Kredit: ATMR yang 'menyusut' tanpa perubahan portofolio = curigai perubahan bobot atau model internal. Investasi: pertumbuhan kredit ke segmen berisiko menggerus CAR lebih cepat daripada pertumbuhan nominalnya. Forensik: bandingkan ATMR ÷ aset antar bank — bank dengan densitas jauh lebih rendah atas portofolio serupa mungkin memakai bobot yang lebih longgar."}
 ]},
asset:{ title:"Kualitas aset — di sinilah bank hidup atau mati", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"NPL gross 2,8% (Rp1.680 miliar)", v:"2,8%", v2:"ambang OJK 5%",
   d:"Kredit bermasalah (kolektibilitas 3–5) Rp1.680 miliar ÷ total kredit Rp60.000 miliar = 2,8% — di bawah ambang 5% batas perhatian OJK. NPL gross mengukur SEBERAPA BANYAK kredit macet, belum dikurangi cadangan.",
   psak:"POJK Kualitas Aset", f:"Kredit: 2,8% masih sehat, tapi yang penting TREN-nya — NPL naik 1 pp = Rp600 miliar masalah baru. Investasi: NPL tinggi = dividen terancam (laba habis untuk CKPN). Forensik: NPL 'terkendali' + restrukturisasi membengkak = macet yang disamarkan (lihat baris restrukturisasi)."},
  {l:"NPL net 0,9% (Rp540 miliar)", v:"0,9%", v2:"(1.680−1.140) ÷ 60.000",
   d:"NPL net = (NPL bruto Rp1.680 miliar − CKPN atas kredit bermasalah Rp1.140 miliar) ÷ kredit Rp60.000 miliar = 0,9%. Mengukur risiko BERSIH setelah cadangan — inilah yang benar-benar mengancam modal bila debitur gagal total.",
   psak:"—", f:"Kredit: 0,9% = risiko residual kecil; bank sudah mencadangkan dua pertiga NPL-nya. Investasi: NPL net rendah = kualitas laba lebih jernih. Forensik: NPL net HANYA mengurangkan CKPN atas kredit bermasalah — bukan total CKPN (lihat coverage)."},
  {l:"Coverage ratio 145% (total CKPN Rp2.436 miliar)", v:"145%", v2:"2.436 ÷ 1.680",
   d:"Coverage = TOTAL CKPN Rp2.436 miliar ÷ NPL bruto Rp1.680 miliar = 145%. Bisa >100% karena CKPN total mencakup ECL Stage 1 & 2 (Rp1.296 miliar, tarif 2,25%) — BUKAN hanya CKPN atas NPL (Rp1.140 miliar). Rekonsiliasi: 1.140 + 1.296 = 2.436. Inilah jembatan 2,8% → 0,9% → 145%.",
   psak:"PSAK 109 (71)", f:"Kredit: coverage >100% = bank konservatif; guncangan NPL masih tertutup cadangan. Investasi: CKPN jumbo menekan laba hari ini tapi melindungi laba esok. Forensik: coverage turun diam-diam sementara NPL naik = cadangan dikuras untuk memoles laba."},
  {l:"Staging PSAK 109: S1 52.000 · S2 5.500 · S3 2.500", v:"60.000", v2:"S2→S3 = sinyal",
   d:"52.000 + 5.500 + 2.500 = Rp60.000 miliar = total kredit — terartikulasi penuh. Stage 2 (risiko naik signifikan, lifetime ECL) Rp5.500 miliar adalah 'ruang tunggu' NPL: migrasi S2→S3 adalah sinyal dini SEBELUM NPL gross bergerak.",
   psak:"PSAK 109", f:"Kredit: awasi porsi S2 (9,2% di sini) — S2 yang membengkak = NPL masa depan. Investasi: migrasi ke S3 memicu lifetime ECL → beban CKPN melonjak → laba terpukul. Forensik: staging adalah area judgment terbesar bank — bandingkan definisi 'significant increase in credit risk' antar bank."},
  {l:"Kredit restrukturisasi (COVID legacy) Rp3.200 miliar", v:"3.200", v2:"BUKAN NPL",
   d:"Restrukturisasi lancar ≠ NPL: debitur yang direstrukturisasi dan membayar sesuai jadwal baru tercatat performing. Rp3.200 miliar (5,3% kredit) dipantau TERPISAH — bahayanya bila jadwal baru gagal: langsung melompat ke NPL. Stress-test: 30% gagal = Rp960 miliar NPL baru → NPL gross 2,8% → 4,4%.",
   psak:"POJK Restrukturisasi", f:"Kredit: ini 'NPL tertunda' — minta disclosure vintage & kolektibilitasnya. Investasi: pasar menghukum bank yang restrukturisasinya meledak belakangan. Forensik: restrukturisasi berulang atas debitur yang sama = evergreening — macet yang didandani."},
  {l:"CoC (cost of credit) 3,0% — ilustratif", v:"3,0%", v2:"1.800 ÷ 60.000",
   d:"CoC = beban CKPN periode berjalan ÷ rata-rata kredit = Rp1.800 miliar (ilustratif) ÷ Rp60.000 miliar = 3,0%. Ini ARUS (beban satu periode) — jangan dicampur dengan STOK total CKPN Rp2.436 miliar di neraca: beban 1.800 menambah cadangan, yang lalu dipakai menutup hapus buku. Harga risiko ini besar: beban CKPN Rp1.800 miliar 'memakan' 1.800 ÷ 3.900 ≈ 46% pendapatan bunga bersih (lihat baris NIM). CoC naik = kualitas kredit memburuk SEBELUM NPL bergerak — beban CKPN adalah sinyal dini.",
   psak:"PSAK 109", f:"Kredit: CoC naik + coverage turun = cadangan dikuras untuk memoles laba. Investasi: NIM − CoC tidak bisa dikurangkan mentah-mentah (penyebut berbeda: aset produktif vs kredit) — bandingkan dalam rupiah: 3.900 vs 1.800. Forensik: CoC turun sementara NPL naik = cadangan dikuras (lihat coverage)."}
 ]},
manage:{ title:"Manajemen — dinilai dari keputusan, terbaca dari efisiensi", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"CIR (Cost-to-Income Ratio) 62%", v:"62%", v2:"beban ÷ pendapatan",
   d:"CIR = beban operasional ÷ pendapatan operasional = 62%: dari tiap Rp100 pendapatan, Rp62 habis untuk biaya. Di bawah 60% = efisien; 62% = wajar untuk bank menengah yang masih investasi cabang & digital.",
   psak:"—", f:"Kredit: CIR tinggi = buffer laba tipis saat pendapatan bunga tertekan. Investasi: CIR turun 5 pp ≈ laba naik signifikan (operational leverage). Forensik: CIR 'membaik' karena pendapatan one-off — pisahkan recurring vs non-recurring."},
  {l:"Kualitas tata kelola & manajemen risiko", v:"kualitatif", v2:"self-assessment",
   d:"Huruf 'M' dinilai kualitatif: komposisi direksi/komisaris, independensi komite audit & risiko, kedisiplinan limit, budaya kepatuhan. Tidak ada di laporan laba rugi — tapi semua angka di tab lain adalah AKIBAT keputusan manajemen ini.",
   psak:"POJK Tata Kelola", f:"Kredit: governance lemah = covenant harus lebih ketat. Investasi: bank adalah bisnis kepercayaan — diskon valuasi untuk governance buruk. Forensik: pergantian direksi + strategi 'agresif tumbuh kredit' + NPL naik = pola klasik."},
  {l:"BOPO 62% — label OJK untuk CIR", v:"62%", v2:"sama dengan CIR",
   d:"BOPO (Biaya Operasional terhadap Pendapatan Operasional) = beban operasional ÷ pendapatan operasional — RUMUS YANG SAMA dengan CIR 62% di baris atas, hanya labelnya label OJK. Bukan rasio kedua, bukan angka kedua: satu ukuran, dua nama. Kalau laporan bank menyebut BOPO 62% dan CIR 62%, itu SATU fakta yang disebut dua kali — jangan dijumlahkan, jangan dirata-rata.",
   psak:"POJK (istilah OJK)", f:"Kredit: BOPO tinggi = buffer laba tipis saat pendapatan tertekan. Investasi: BOPO turun 5 pp ≈ laba naik signifikan (operational leverage). Forensik: BOPO 'membaik' karena pendapatan one-off — pisahkan recurring vs non-recurring, sama seperti CIR."}
 ]},
earning:{ title:"Rentabilitas — dari mana laba bank berasal", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"NIM (Net Interest Margin) 5,2%", v:"5,2%", v2:"bunga bersih ÷ aset produktif",
   d:"NIM = pendapatan bunga bersih ÷ rata-rata aset produktif = Rp3.900 miliar (ilustratif) ÷ Rp75.000 miliar (ilustratif) = 5,2% tepat — tinggi, ditopang CASA 58% (dana murah). NIM adalah 'upah' bank atas risiko kreditnya: ia harus cukup menutup biaya dana + biaya kredit (cost of risk) + operasional.",
   psak:"—", f:"Kredit: NIM tebal = bank mampu menyerap kenaikan CKPN tanpa merugi. Investasi: NIM driver utama ROE bank — tapi NIM tinggi sering berarti segmen berisiko. Forensik: NIM naik saat suku bunga turun? Cek pengakuan bunga dari kredit bermasalah (non-accrual)."},
  {l:"ROA 2,24% · ROE 20,0%", v:"20,0%", v2:"1.900 ÷ 9.500",
   d:"ROA = 1.900 ÷ 85.000 = 2,24%; ROE = 1.900 ÷ 9.500 = 20,0%. Jembatan: ROE = ROA × leverage (2,24% × 8,9x ≈ 20%). ROE 20% = kuat — tapi selalu tanya: dari NIM sehat, atau dari leverage & under-provisioning?",
   psak:"—", f:"Kredit: ROE tinggi + CAR tebal = bank bisa tumbuh dari laba ditahan. Investasi: ROE 20% layak premium — SELAMA kualitasnya terjaga (lihat NPL & coverage). Forensik: ROE 'cantik' + coverage tipis = laba dipoles dengan CKPN kurang."}
 ]},
liquid:{ title:"Likuiditas — bank mati karena kehabisan kas, bukan kehabisan modal", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"CASA 58% (Rp39.440 miliar)", v:"58%", v2:"39.440 ÷ 68.000",
   d:"Dana murah (giro + tabungan) Rp39.440 miliar ÷ DPK Rp68.000 miliar = 58%. CASA tinggi = biaya dana rendah = NIM tebal. CASA adalah 'parit' bank: deposan transaksional yang tidak sensitif bunga.",
   psak:"—", f:"Kredit: CASA stabil = funding tahan guncangan likuiditas. Investasi: tiap 1 pp CASA ≈ basis poin NIM — bank digital menggerus parit ini. Forensik: CASA 'naik' karena giro sementara proyek (volatile) — cek persistensinya."},
  {l:"LDR 88,2% (60.000 ÷ 68.000)", v:"88,2%", v2:"ruang tumbuh ada",
   d:"LDR = kredit Rp60.000 miliar ÷ DPK Rp68.000 miliar = 88,2%. Masih longgar — bank punya ruang menyalurkan kredit tanpa berebut DPK mahal. Analis umumnya waspada bila LDR menembus 95–100%: bank meminjam untuk meminjamkan.",
   psak:"POJK Likuiditas", f:"Kredit: LDR >100% = risiko likuiditas naik tajam. Investasi: LDR naik (kredit tumbuh > DPK) = pendapatan bunga naik TAPI biaya dana ikut naik. Forensik: LDR 'sehat' + DPK turun = kredit didanai pinjaman antarbank (mahal & volatile)."}
 ]},
sensitiv:{ title:"Sensitivitas — apa yang terjadi bila suku bunga bergerak", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Repricing gap 1 tahun −Rp5.000 miliar (ilustratif)", v:"−5.000", v2:"+100 bps → NII ≈ −50",
   d:"Aset yang repricing <1 tahun Rp40.000 miliar vs liabilitas Rp45.000 miliar → gap −Rp5.000 miliar (ilustratif). Kenaikan bunga 100 bps ≈ −Rp50 miliar NII tahunan (5.000 × 1%). Gap negatif = bank dirugikan saat bunga naik, diuntungkan saat bunga turun.",
   psak:"—", f:"Kredit: gap besar = laba bank (dan kemampuan bayar utangnya) sensitif ke BI-rate. Investasi: di siklus bunga turun, gap negatif justru menguntungkan. Forensik: gap dihitung dari asumsi perilaku (CASA dianggap 'sticky') — asumsi berubah, kesimpulan berubah."}
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
renderStmt("capital");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"NPL gross naik 2,8% → 4,0%, CKPN belum disesuaikan", q1:"Coverage ratio", q2:"NPL net", a1:"turun", a2:"naik",
  e:"NPL naik Rp720 miliar tanpa CKPN baru: coverage = 2.436 ÷ 2.400 = 101,5% (turun dari 145%), NPL net = (2.400 − 1.140) ÷ 60.000 = 2,1% (naik dari 0,9%). CKPN yang 'cukup kemarin' belum tentu cukup hari ini."},
 {t:"Rights issue Rp1.500 miliar, ATMR & laba tetap", q1:"CAR", q2:"ROE", a1:"naik", a2:"turun",
  e:"CAR = 11.000 ÷ 42.986 = 25,6% (naik dari 22,1%); ROE = 1.900 ÷ 11.000 = 17,3% (turun dari 20,0%). Modal baru = lebih aman tapi mengencerkan return — trade-off klasik permodalan bank."},
 {t:"CASA 58% → 45%, digantikan deposito berbiaya", q1:"NIM", q2:"Biaya dana (cost of funds)", a1:"turun", a2:"naik",
  e:"Dana murah menyusut Rp8.840 miliar (13 pp × 68.000) → biaya bunga naik → pendapatan bunga bersih tergerus → NIM turun. Inilah mengapa analis memuja CASA: ia parit termurah bank."},
 {t:"Migrasi Stage 2 → Stage 3 Rp1.000 miliar (PSAK 109)", q1:"Beban CKPN periode berjalan", q2:"Risiko NPL ke depan", a1:"naik", a2:"naik",
  e:"Stage 3 = credit-impaired: ECL lifetime penuh langsung membebani laba, dan kolektibilitas ikut memburuk → NPL gross berikutnya naik. Migrasi S2→S3 adalah alarm, bukan sekadar reklasifikasi."},
 {t:"Kredit tumbuh 15%, DPK stagnan → LDR 88% → ±101%", q1:"Risiko likuiditas", q2:"Pendapatan bunga (ceteris paribus)", a1:"naik", a2:"naik",
  e:"LDR = 69.000 ÷ 68.000 = 101,5%: tiap Rp100 DPK dipakai Rp101,5 kredit — bank harus cari dana mahal (pinjaman antarbank/obligasi). Pendapatan bunga naik, tapi biaya dana & risiko likuiditas ikut naik."},
 {t:"Rp960 miliar restrukturisasi gagal bayar → NPL, tanpa CKPN tambahan", q1:"NPL gross", q2:"Coverage", a1:"naik", a2:"turun",
  e:"NPL = 2.640 ÷ 60.000 = 4,4% (naik dari 2,8%); coverage = 2.436 ÷ 2.640 = 92,3% (turun dari 145%). Restrukturisasi yang gagal = NPL tertunda yang jatuh tempo."}
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
    try{ localStorage.setItem("fsa_pg_m30", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"LDR (%)", hint:"Kredit Rp60.000 miliar ÷ DPK Rp68.000 miliar × 100%", ans:88.2, tol:0.15,
  why:"88,2% — masih longgar: bank punya ruang menyalurkan kredit tanpa berebut DPK mahal."},
 {q:"CAR (%)", hint:"Modal Rp9.500 miliar ÷ ATMR Rp42.986 miliar × 100%", ans:22.1, tol:0.15,
  why:"22,1% — buffer ≈14,1 pp di atas minimum OJK 8%. Bantalan tebal, tapi modal menganggur menekan ROE."},
 {q:"NPL net (%)", hint:"(NPL bruto Rp1.680 miliar − CKPN atas NPL Rp1.140 miliar) ÷ kredit Rp60.000 miliar × 100%", ans:0.9, tol:0.05,
  why:"0,9% — risiko bersih setelah cadangan. Ingat: yang dikurangkan hanya CKPN atas kredit bermasalah, bukan total CKPN."},
 {q:"Coverage ratio (%)", hint:"Total CKPN Rp2.436 miliar ÷ NPL bruto Rp1.680 miliar × 100%", ans:145.0, dec:true, tol:0.5,
  why:"145,0% — di atas 100% karena CKPN total mencakup ECL Stage 1 & 2 (PSAK 109). Rekonsiliasi: 1.140 + 1.296 = 2.436."},
 {q:"CoC — cost of credit (%)", hint:"Beban CKPN Rp1.800 miliar (ilustratif) ÷ rata-rata kredit Rp60.000 miliar × 100%", ans:3.0, dec:true, tol:0.05,
  why:"3,0% — harga risiko kredit periode ini. Ingat: beban CKPN (arus) bukan total CKPN Rp2.436 miliar (stok). Beban 1.800 'memakan' ≈46% pendapatan bunga bersih 3.900."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 88,2">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 88,2)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — bank ilustratif ini: ROE 20,0%, NIM 5,2%, CAR 22,1%, NPL net 0,9%. Apakah sahamnya layak dibeli? Tulis 3 baris: apa yang menarik, apa yang mengganggumu, keputusanmu.",
 credit:"Lensa kredit — kamu analis kredit / calon pembeli obligasi bank ini: CAR 22,1%, coverage 145%, tetapi restrukturisasi legacy Rp3.200 miliar dan Stage 2 Rp5.500 miliar. Tulis 3 baris: kekuatan, risiko yang perlu covenant, kesimpulanmu.",
 forensic:"Lensa forensik — verifikasi jembatan angka 2,8% → 0,9% → 145%: dari mana Rp1.140 miliar dan Rp1.296 miliar berasal? Apa yang TIDAK bisa kamu verifikasi dari angka agregat ini? Tulis 3 baris: yang terverifikasi, lubang terbesar, data tambahan yang kamu minta."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m30_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m30_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"LDR 88,2% (= Rp60.000 ÷ Rp68.000 miliar) dibaca analis sebagai…", o:["Bank kelebihan likuiditas — sebagian DPK menganggur sehingga pendapatan bunga tidak optimal", "Setiap Rp100 DPK disalurkan Rp88,2 sebagai kredit; bank masih punya ruang tumbuh", "Bank melanggar batas LDR OJK sehingga wajib menahan ekspansi kredit tahun ini juga", "LDR adalah rasio permodalan: modal inti dibagi aset tertimbang menurut risiko (ATMR)"], a:1},
 {q:"NPL gross 2,8%, NPL net 0,9%, coverage 145% — pernyataan yang TEPAT…", o:["NPL net 0,9% membuktikan CKPN sudah melebihi seluruh NPL — risiko kredit bank praktis sudah nol dan tak perlu analisis lebih lanjut", "Bank tidak perlu membentuk CKPN lagi tahun ini — coverage 145% berarti pencadangan sudah melebihi total kredit bermasalah sehingga biaya CKPN dapat dihemat untuk menaikkan laba", "Coverage memakai total CKPN — termasuk ECL Stage 1 & 2 (PSAK 109) — sedangkan NPL net hanya mengurangkan CKPN atas kredit bermasalah; keduanya konsisten", "NPL gross 2,8% berarti 2,8% dari total DPK bank macet dan harus dihapusbukukan seluruhnya pada tahun berjalan"], a:2},
 {q:"Migrasi Rp1.000 miliar dari Stage 2 ke Stage 3 (PSAK 109) berarti…", o:["Beban CKPN naik — Stage 3 = credit-impaired dengan ECL lifetime penuh, dan ini sinyal kolektibilitas memburuk", "Tidak ada dampak ke laba rugi karena CKPN Stage 3 dibentuk dari laba ditahan, bukan dibebankan pada tahun berjalan", "CAR justru membaik karena kredit bermasalah dipindahkan keluar dari perhitungan ATMR", "Migrasi antar stage hanya reklasifikasi disclosure di catatan — angka CKPN tidak berubah"], a:0},
 {q:"CASA turun 58% → 45% dan digantikan deposito berjangka. Dampak ke NIM…", o:["NIM naik karena total DPK bertambah sehingga dana yang bisa disalurkan lebih besar", "Tidak ada dampak ke NIM — komposisi DPK tidak memengaruhi margin bunga", "NIM naik karena dana murah yang hilang digantikan deposito dengan bunga lebih tinggi", "NIM turun — biaya dana naik menggerus pendapatan bunga bersih"], a:3},
 {q:"Kredit restrukturisasi (COVID legacy) Rp3.200 miliar yang masih lancar…", o:["Otomatis masuk NPL gross — semua kredit yang pernah direstrukturisasi wajib digolongkan bermasalah tanpa kecuali", "Tidak perlu dipantau lagi karena restrukturisasi yang disetujui OJK menghapus seluruh risiko gagal bayar di masa depan", "Tetap dipantau terpisah — restrukturisasi lancar BUKAN NPL, tetapi gagal bayar berikutnya langsung menaikkan NPL", "Dikeluarkan dari total kredit dan dicatat sebagai aset lain-lain di neraca"], a:2},
 {q:"ATMR Bank Nusantara Rp42.986 miliar (ilustratif) diturunkan dari…", o:["Modal Rp9.500 miliar ÷ CAR 22,1%","Aset Rp85.000 miliar − ekuitas Rp9.500 miliar","Kredit Rp60.000 miliar × NPL 2,8%","DPK Rp68.000 miliar × LDR 88,2%"], a:0},
 {q:"NIM Bank Nusantara 5,2% (ilustratif) = …", o:["Laba bersih 1.900 ÷ total aset 85.000","Pendapatan bunga bersih 3.900 ÷ total DPK 68.000 (dana pihak ketiga)","Pendapatan bunga bersih 3.900 ÷ rata-rata aset produktif 75.000","Pendapatan bunga bersih 3.900 ÷ total kredit 60.000 yang disalurkan"], a:2},
 {q:"Laporan bank menyebut BOPO 62% dan CIR 62% (ilustratif). Pembacaan yang TEPAT…", o:["BOPO mengukur beban ÷ aset produktif, CIR mengukur beban ÷ DPK — dua rasio berbeda","BOPO dan CIR dijumlahkan: beban total bank adalah 124% dari pendapatan operasional","BOPO hanya berlaku untuk bank syariah, CIR hanya untuk bank konvensional","Satu ukuran, dua nama — beban operasional ÷ pendapatan operasional = 62%"], a:3}];
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
           window.FSAMistake.log(30, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu membaca bank seperti analis kredit: CAMELS, staging ECL PSAK 109 (71), dan jembatan NPL → coverage — semuanya terartikulasi. Lanjut ke <a href=\"../modul-31/\">Modul 31 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m30","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m30") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m30") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m30") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Modul 30 sudah kamu lewati sebelumnya — lanjut ke <a href=\"../modul-31/\">Modul 31</a>.</p>";
  }
}catch(e){}
})();
