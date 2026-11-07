/* FSA Lab — Modul 29: Hedge Accounting (PT Cemerlang Abadi — angka LK kanonis; swap cross-currency ILUSTRATIF) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
hedge:{ title:"Tiga jenis hubungan lindung nilai — beda risiko yang dilindungi, beda tempat gain/loss dicatat", cols:["Jenis hedge","Gain/loss efektif ke","Perlakuan akuntansi"],
 rows:[
  {l:"Cash flow hedge", v:"OCI", v2:"—",
   d:"Melindungi ARUS KAS masa depan yang belum pasti — mis. pembayaran bunga/pokok utang berdenominasi USD. Bagian yang efektif → OCI (cash flow hedge reserve), lalu direklasifikasi ke P&L saat item yang dilindungi memengaruhi laba. Contoh Cemerlang <strong>(ILUSTRATIF)</strong>: cross-currency swap atas utang bank USD (dari utang bank kanonis 141.440) — swap gain 5.000 vs loss utang 4.600 → 4.600 ke OCI, 400 yang ineffektif ke P&L.",
   psak:"PSAK 109 (dulu 71) = IFRS 9", f:"Investasi: laba jadi 'tenang' — tapi cek OCI reserve, di situlah ayunan kurs disembunyikan. Kredit: debt service terekspos kurs? baca hedge ratio. Forensik: reklasifikasi OCI→P&L bisa dipakai mengatur timing laba."},
  {l:"Fair value hedge", v:"P&L (offset)", v2:"—",
   d:"Melindungi NILAI WAJAR aset/liabilitas yang sudah diakui — mis. obligasi fixed-rate dari risiko suku bunga. Gain/loss instrumen lindung nilai DAN penyesuaian nilai wajar item yang dilindungi — keduanya dicatat di P&L sehingga saling meng-offset. Net ke laba ≈ nol bila hedge bekerja. Contoh (ILUSTRATIF): suku bunga naik → swap gain, nilai wajar utang obligasi turun → keduanya ke P&L, netral.",
   psak:"PSAK 109 (dulu 71) = IFRS 9", f:"Investasi: P&L tetap berayun dua arah — net-nya yang penting. Kredit: carrying value utang ikut bergerak — jangan pakai nilai nominal untuk covenant. Forensik: offset yang 'terlalu sempurna' tiap periode patut dicurigai."},
  {l:"Net investment hedge", v:"OCI", v2:"—",
   d:"Melindungi INVESTASI NETO di operasi luar negeri dari risiko kurs. Bagian efektif → OCI (akumulasi selisih kurs), direklasifikasi ke P&L hanya saat investasi asing dilepas/di-disposal. Contoh (ILUSTRATIF): pinjaman USD didesainasi sebagai lindung nilai atas anak usaha di luar negeri — translasi anak & pinjaman saling offset di OCI.",
   psak:"PSAK 109 (dulu 71) = IFRS 9", f:"Investasi: OCI menampung volatilitas translasi — ekuitas book value berayun tanpa menyentuh laba. Kredit: pastikan pinjaman yang didesainasi memang ada (baca notional vs nilai investasi). Forensik: disposal parsial = trigger reklasifikasi — cek timing-nya."}
 ]},
syarat:{ title:"Tanpa TIGA ini, tidak ada hedge accounting — seluruh mark-to-market jatuh ke P&L", cols:["Syarat","Inti","Detail"],
 rows:[
  {l:"Dokumentasi formal di awal", v:"TANPA ini = gagal", v2:"—",
   d:"Desainasi tertulis: item yang dilindungi, instrumen lindung nilai, sifat risiko, dan cara menguji efektivitas. Wajib dibuat SAAT hubungan dimulai — dokumentasi yang dibuat belakangan (backdated) tidak sah dan membatalkan hedge accounting.",
   psak:"PSAK 109 (dulu 71)", f:"Forensik: ini syarat paling mudah diaudit — minta dokumennya, cek tanggalnya. Dokumen rapi tapi dibuat setelah fakta = red flag."},
  {l:"Efektivitas: hubungan ekonomis", v:"dulu 80–125% → kini prinsip", v2:"—",
   d:"Aturan LAMA (PSAK 55 — nomor baru 239): rasio offset harus 80–125%. Aturan BARU PSAK 109 (dulu 71): tiga prinsip — (1) ada hubungan ekonomis antara item & instrumen, (2) efek risiko kredit tidak mendominasi perubahan nilai, (3) hedge ratio = rasio aktual yang dipakai manajemen. Tidak ada lagi angka ajaib 80–125%.",
   psak:"PSAK 109 (dulu 71) = IFRS 9", f:"Investasi: efektivitas 92% (ilustratif) masih 'lolos' di aturan lama; di aturan baru yang dinilai logika ekonominya. Kredit: risiko kredit counterparty swap kini eksplisit diuji."},
  {l:"Penghentian (discontinuation)", v:"prospektif", v2:"—",
   d:"Hedge accounting berhenti KE DEPAN bila: instrumen kedaluwarsa/dijual/dieksekusi, syarat kualifikasi tak lagi terpenuhi, atau manajemen mencabut desainasi. Tidak retrospektif — yang sudah dicatat tetap. Saldo akumulasi OCI (cash flow hedge) TETAP di OCI sampai transaksi yang dilindungi memengaruhi P&L.",
   psak:"PSAK 109 (dulu 71)", f:"Investasi: pencabutan desainasi = sinyal manajemen menyerah pada hedge — tanya kenapa. Forensik: saldo OCI 'ngendon' bertahun-tahun tanpa reklasifikasi = forecast transaction yang tak kunjung terjadi."}
 ]},
ineff:{ title:"Ineffectiveness — porsi lindung nilai yang gagal offset, langsung menggoyang laba", cols:["Konsep","Rumus","Makna"],
 rows:[
  {l:"Definisi ineffectiveness", v:"kelebihan Δ tak-offset", v2:"—",
   d:"Perubahan nilai wajar instrumen lindung nilai yang TIDAK di-offset oleh perubahan item yang dilindungi. Porsi ini tidak boleh parkir di OCI — wajib langsung ke P&L periode berjalan. Inilah 'biaya' lindung nilai yang tetap menggoyang laba bersih.",
   psak:"PSAK 109 (dulu 71)", f:"Investasi: ineffectiveness yang membesar = hedge-nya bocor — laba makin berayun. Kredit: P&L jadi sulit diprediksi untuk proyeksi debt service."},
  {l:"Contoh Cemerlang (ILUSTRATIF)", v:"5.000 − 4.600 = 400", v2:"—",
   d:"Swap gain <span style=\"font-family:var(--font-mono)\">5.000</span> (Rp juta), utang USD loss <span style=\"font-family:var(--font-mono)\">4.600</span>. Bagian efektif <span style=\"font-family:var(--font-mono)\">4.600</span> → OCI; ineffektif <span style=\"font-family:var(--font-mono)\">400</span> → P&L. Efektivitas <span style=\"font-family:var(--font-mono)\">92,0%</span> — masih dalam koridor lama 80–125%. Setelah pajak 22%: P&L hanya bertambah <span style=\"font-family:var(--font-mono)\">312</span>, bukan <span style=\"font-family:var(--font-mono)\">3.900</span>.",
   psak:"PSAK 109 (dulu 71)", f:"Forensik: ineffectiveness yang SELALU nol persis tiap periode = terlalu sempurna — uji ulang perhitungannya, bukan sekadar percaya."},
  {l:"Sudut PSAK: ukur vs ungkap", v:"109 vs 107", v2:"—",
   d:"Pengukuran & pengakuan hedge accounting diatur PSAK 109 (dulu PSAK 71) = IFRS 9. PENGUNGKAPANNYA — notional, maturity, hedge ratio, sumber ineffectiveness — diatur PSAK 107 (dulu PSAK 60). Analis membaca keduanya: angka di 109, ceritanya di 107.",
   psak:"PSAK 109 (dulu 71); PSAK 107 (dulu 60)", f:"Investasi: footnote 107 adalah tempat menemukan notional & jatuh tempo — tanpa itu, OCI reserve hanyalah angka misterius."}
 ]},
fx:{ title:"FX: transaksi vs translasi — PSAK 221 (dulu 10); dampak ke leverage & covenant", cols:["Konsep","Ke mana?","Makna"],
 rows:[
  {l:"Mata uang fungsional", v:"PSAK 221", v2:"fondasi", d:"Mata uang lingkungan ekonomi UTAMA: mata uang yang paling memengaruhi harga jual & biaya — bukan pilihan bebas manajemen. Salah tentukan → seluruh perlakuan FX ikut salah.", psak:"PSAK 221 (dulu 10) = IAS 21", f:"Eksportir ber-USD tapi melaporkan IDR 'agar terlihat lokal' — cek indikator fungsionalnya di catatan."},
  {l:"Transaction: utang USD dijabarkan ulang", v:"P&L", v2:"goyang laba", d:"Pos MONETER valuta asing (utang USD, piutang USD) dijabarkan ke kurs spot tiap tanggal laporan → selisih kurs masuk LABA RUGI. IDR melemah 10% atas utang USD = rugi selisih kurs langsung memotong laba.", psak:"PSAK 221 (dulu 10)", f:"Kaitkan ke contoh modul ini: utang USD tanpa hedge → ayunan kurs penuh ke P&L. Inilah yang dilindungi cash flow hedge di tab pertama."},
  {l:"Translation: anak usaha luar negeri", v:"OCI", v2:"goyang ekuitas", d:"Aset/liabilitas anak usaha → kurs PENUTUP; laba rugi anak → kurs RATA-RATA; selisihnya → OCI (akumulasi selisih kurs), BUKAN laba. Direklasifikasi ke P&L hanya saat investasi asing dilepas.", psak:"PSAK 221 (dulu 10)", f:"Ekuitas book value berayun tanpa menyentuh laba — analis yang hanya membaca laba bersih tidak melihatnya."},
  {l:"Dampak ke leverage & covenant", v:"headroom", v2:"menyusut", d:"Utang USD membengkak karena kurs → D/E dan ND/EBITDA naik, interest coverage turun — headroom covenant menyusut TANPA perusahaan meminjam sepeser pun. Covenant berbasis ekuitas bisa jebol dari rugi translasi di OCI.", psak:"—", f:"Kredit: untuk debitur berutang USD, stress test WAJIB pakai skenario kurs — bukan cuma skenario penjualan."},
  {l:"Yang dicek di catatan", v:"checklist", v2:"—", d:"(1) Mata uang fungsional & penyajian tiap entitas; (2) sensitivitas kurs (mis. ±10% → dampak ke laba); (3) utang valas yang TIDAK di-hedge vs yang di-hedge — sambungkan ke catatan lindung nilai PSAK 109.", psak:"PSAK 221 (dulu 10); PSAK 107 (dulu 60)", f:"Sensitivitas kurs yang hilang dari catatan = manajemen tak mau kamu menghitung skenario buruknya."}
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
renderStmt("hedge");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Swap gain 5.000 vs utang USD loss 4.600 — hedge qualified (ILUSTRATIF)", q1:"Saldo OCI (cash flow hedge reserve)", q2:"Volatilitas laba bersih vs tanpa hedge", a1:"naik", a2:"turun",
  e:"Efektif 4.600 parkir di OCI → reserve NAIK. Hanya 400 ineffektif yang masuk P&L (312 setelah pajak), sehingga laba jauh lebih tenang: volatilitas TURUN. Tanpa designasi, 5.000 dan (4.600) SAMA-SAMA masuk P&L = net 400 — hedge accounting mengubah TIMING, bukan total."},
 {t:"Swap gain 5.000 vs utang USD loss 3.900 — hedge 'kelebihan' (ILUSTRATIF)", q1:"Saldo OCI reserve", q2:"Porsi yang masuk P&L (ineffektif)", a1:"naik", a2:"naik",
  e:"Efektif hanya 3.900 → OCI tetap NAIK. Tapi ineffektif membesar: 5.000 − 3.900 = 1.100 → P&L NAIK lebih besar dari skenario 1. Hedge yang 'over' tetap menggoyang laba."},
 {t:"Tidak ada dokumentasi formal di awal — hedge accounting GAGAL syarat", q1:"Saldo OCI reserve", q2:"P&L (seluruh mark-to-market swap)", a1:"tetap", a2:"naik",
  e:"Tanpa dokumentasi = tidak ada hedge accounting. OCI TETAP nol; seluruh gain 5.000 jatuh ke P&L → P&L NAIK penuh. Satu syarat administratif membedakan laba yang tenang vs berayun."},
 {t:"Fair value hedge: suku bunga naik — swap gain, nilai wajar obligasi turun", q1:"Gain/loss swap di P&L", q2:"Dampak NETO ke laba", a1:"naik", a2:"tetap",
  e:"Keduanya dicatat di P&L: gain swap NAIK, rugi nilai wajar obligasi meng-offset — dampak NETO TETAP ≈ nol. Inilah bedanya dengan cash flow hedge: ayunan tetap terlihat, tapi saling meniadakan."},
 {t:"Net investment hedge: anak usaha luar negeri rugi translasi, pinjaman USD offset (ILUSTRATIF)", q1:"Akumulasi OCI (selisih kurs)", q2:"Volatilitas laba bersih", a1:"naik", a2:"turun",
  e:"Translasi & instrumen lindung nilai sama-sama ke OCI → reserve NAIK (net setelah offset). P&L tidak tersentuh — volatilitas laba TURUN. Direklasifikasi ke P&L hanya saat investasi dilepas."},
 {t:"Manajemen mencabut desainasi — hubungan lindung nilai DIHENTIKAN", q1:"Gain swap BARU yang masuk P&L", q2:"Saldo OCI reserve LAMA", a1:"naik", a2:"tetap",
  e:"Penghentian bersifat prospektif: gain baru langsung ke P&L → NAIK. Saldo OCI lama TETAP di ekuitas sampai transaksi yang dilindungi memengaruhi P&L — tidak hangus, tidak langsung direklas."}
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
    try{ localStorage.setItem("fsa_pg_m29", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
  }
  $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  r.scrollIntoView({behavior:"smooth", block:"center"});
}
renderPg();

/* ---------- LAB UKUR ---------- */
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
 {q:"Efektivitas hedge (%)", hint:"4.600 ÷ 5.000 × 100% — swap gain 5.000, loss utang 4.600 (ilustratif, Rp juta)", ans:92.0, dec:true, tol:0.5,
  why:"92,0% — masih dalam koridor lama 80–125%; di PSAK 109 (dulu 71) yang dinilai hubungan ekonomisnya, bukan angkanya."},
 {q:"Porsi ineffektif dari swap gain (%)", hint:"400 ÷ 5.000 × 100% (ilustratif)", ans:8.0, dec:true, tol:0.3,
  why:"8,0% — porsi inilah yang langsung menggoyang P&L. Kecil di sini; waspadai bila trennya membesar tiap periode."},
 {q:"Cash flow hedge reserve terhadap ekuitas (%)", hint:"4.600 ÷ 179.440 × 100% — ekuitas kanonis 2025 (ilustratif)", ans:2.56, tol:0.05,
  why:"2,56% dari ekuitas — 'laba yang ditunda' di OCI. Kecil sekarang; analis memantaunya karena reklasifikasi masa depan = laba masa depan."},
 {q:"Dampak bersih ke laba (tanpa designasi hedge accounting, Rp juta, setelah pajak)", hint:"(5.000 − 4.600) × (1 − 22%) — swap gain dikurangi rugi utang, ilustratif", ans:312, dec:false, tol:5,
  why:"312 — tanpa designasi, swap gain 5.000 dan rugi utang 4.600 SAMA-SAMA masuk P&L: net 400 pretax, 312 setelah pajak 22%. Hedge accounting tidak mengubah total ekonomi — ia mengubah TIMING: 4.600 ditunda di OCI (cash flow hedge reserve) sampai item yang dilindungi memengaruhi laba. Bandingkan: tanpa hedge ekonomi sama sekali, P&L tidak dapat 5.000 maupun (4.600)."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 92,0">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 92,0)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — tanpa designasi, swap 5.000 dan rugi utang (4.600) sama-sama masuk P&L (net 400); dengan hedge accounting, 4.600 diparkir di OCI. Tulis 3 baris: kualitas laba yang dilaporkan, apakah pasar sudah 'melihat menembus' OCI reserve, keputusanmu.",
 credit:"Lensa kredit — utang bank 141.440 (kanonis, Rp juta) berdenominasi USD dan dilindungi cross-currency swap (ilustratif). Berapa debt service yang benar-benar terekspos kurs setelah hedge? Tulis 3 baris: eksposur bersih, mitigasi covenant yang kamu minta, kesimpulanmu.",
 forensic:"Lensa forensik — hedge accounting adalah area abu-abu: dokumentasi bisa rapi sementara hubungan ekonominya lemah. Tulis 3 baris: bukti efektivitas yang kamu minta ke manajemen, sinyal manipulasi (mis. ineffectiveness yang selalu NOL persis — terlalu sempurna?), langkah berikut."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m29_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m29_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"Hedge accounting di Indonesia diatur oleh…", o:["PSAK 107 (dulu 60) — hanya disclosure instrumen keuangan", "PSAK 109 (dulu 71), setara IFRS 9", "PSAK 237 (dulu 57) — provisi & kontinjensi", "PSAK 116 (dulu 73) — sewa"], a:1},
 {q:"Swap gain 5.000, utang USD loss 4.600 (ILUSTRATIF, Rp juta). Net yang masuk P&L — setelah rugi FX utang + reklasifikasi cadangan hedge — adalah…", o:["4.600", "0 — semuanya ke OCI", "400", "9.600"], a:2},
 {q:"Pada cash flow hedge yang memenuhi syarat, bagian yang efektif dicatat di…", o:["OCI (penghasilan komprehensif lain)", "P&L periode berjalan", "Langsung mengurangi laba ditahan", "Tidak dicatat — cukup diungkap di catatan"], a:0},
 {q:"Berikut ini BUKAN syarat kualifikasi hedge accounting PSAK 109 (dulu 71)…", o:["Dokumentasi formal di awal hubungan lindung nilai", "Desainasi instrumen & item yang dilindungi", "Uji efektivitas yang berkelanjutan", "Nilai nosional minimum Rp10 miliar"], a:3},
 {q:"Setelah hubungan lindung nilai dihentikan, saldo akumulasi OCI (cash flow hedge reserve)…", o:["Langsung direklasifikasi seluruhnya ke P&L begitu hubungan dihentikan", "Tetap di OCI sampai transaksi yang dilindungi memengaruhi P&L", "Dipindahkan ke laba ditahan tanpa pernah lewat P&L", "Diamortisasi ke P&L selama sisa umur instrumen lindung nilai"], a:1}];
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
           window.FSAMistake.log(29, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Hedge Accounting Tuntas ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu paham ke mana gain/loss lindung nilai dicatat — dan berapa yang tetap menggoyang laba. <a href=\"../modul-30/\">Lanjut ke Modul 30 →</a> 🎓</p>";
    try{ localStorage.setItem("fsa_gate_m29","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m29") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m29") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m29") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Hedge Accounting Tuntas ✓</h3><p>Modul 29 sudah kamu lewati sebelumnya — <a href=\"../modul-30/\">Lanjut ke Modul 30 →</a>.</p>";
  }
}catch(e){}
})();
