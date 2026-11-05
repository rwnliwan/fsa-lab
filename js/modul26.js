/* FSA Lab — Modul 26: Akuntansi Syariah (Bank Barakah fiktif, ilustratif Rp miliar) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
bank:{ title:"Neraca Bank Barakah 2025 — bank syariah fiktif, SEMUA ANGKA ILUSTRATIF (Rp miliar)", cols:["Pos","Rp M (ilustratif)","Khas syariah?"],
 rows:[
  {l:"Piutang murabahah (bersih)", v:"980", v2:"Ya", d:"Jual-beli cost-plus: bank beli barang lalu jual ke nasabah dengan margin yang disepakati. Margin diakui secara proporsional SELAMA periode akad (accrual), bukan sekaligus di muka.", psak:"PSAK 402 (dulu 102) — murabahah", f:"Cek kebijakan pengakuan margin: margin yang diakui di muka menggelembungkan laba tahun berjalan. Bandingkan margin rate antar periode."},
  {l:"Pembiayaan mudharabah", v:"450", v2:"Ya", d:"Bagi hasil: bank sebagai shahibul maal (pemilik dana), nasabah sebagai mudharib (pengelola). Rugi finansial TANPA kelalaian ditanggung bank; nasabah rugi waktu dan tenaga.", psak:"PSAK 105 — mudharabah", f:"Lensa kredit: tidak ada 'beban bunga' tetap — arus kas bagi hasil fluktuatif mengikuti laba usaha nasabah. DSCR konvensional tidak bisa dipakai mentah-mentah."},
  {l:"Pembiayaan musyarakah", v:"300", v2:"Ya", d:"Kemitraan modal: bank dan nasabah sama-sama setor modal, untung dibagi sesuai nisbah, rugi dibagi proporsional modal. Beda dengan mudharabah yang modalnya 100% dari bank.", psak:"PSAK 106 — musyarakah", f:"Cek porsi modal riil nasabah: musyarakah yang 99% dananya dari bank secara ekonomi mirip mudharabah — label akad ≠ substansi risiko."},
  {l:"Aset ijarah", v:"200", v2:"Ya", d:"Sewa syariah: bank (lessor) menyewakan aset dan memungut ujrah (sewa). Kepemilikan tetap di bank; yang berpindah hanya manfaat pakai. Bukan bunga atas pinjaman.", psak:"PSAK 107 — ijarah; bedakan dari PSAK 116 (sewa konvensional)", f:"Ijarah tanpa underlying yang jelas = red flag. Pastikan ada aset riil yang disewakan, bukan sekadar label untuk arus kas berbunga."},
  {l:"Sukuk ijarah diterbitkan", v:"500", v2:"Ya", d:"Sukuk = bukti kepemilikan atas aset/manfaat aset (di sini: hak atas sewa). Imbal hasil 12% (ilustratif) berasal dari SEWA underlying — investor menanggung risiko aset, bukan sekadar menagih bunga.", psak:"PSAK 110 — sukuk", f:"Baca prospektus: apa underlying-nya, siapa yang menanggung risiko aset rusak/hilang? Sukuk tanpa underlying riil = obligasi berbunga berkedok syariah."},
  {l:"Dana Syirkah Temporer", v:"1.100", v2:"Ya", d:"Dana nasabah berbasis bagi hasil (tabungan/deposito mudharabah). Klasifikasi KHUSUS: bukan liabilitas, bukan ekuitas — disajikan tersendiri di antara keduanya.", psak:"PSAK 401 (dulu 101) — penyajian lap. keuangan syariah", f:"Analis yang menjumlahkan DST ke utang akan salah hitung leverage. Cek: nisbah bagi hasil DST vs margin pembiayaan = spread riil bank syariah."},
  {l:"Dana zakat", v:"25", v2:"Ya", d:"Dana titipan untuk zakat/infak/sedekah. Dilaporkan tersendiri: LAPORAN SUMBER & PENGGUNAAN DANA ZAKAT — bukan bagian laba rugi bank.", psak:"PSAK 409 (dulu 109) — akuntansi zakat, infak, sedekah", f:"Dana zakat BUKAN milik bank. Penyalurannya tidak boleh menyentuh laba rugi. Cek arus: zakat terkumpul vs disalurkan."},
  {l:"Kas & setara kas", v:"150", v2:"Tidak", d:"Sama seperti bank konvensional — bedanya dikelola tanpa instrumen berbunga (tidak ada deposito berbunga, tidak ada SBI konvensional).", psak:"—", f:"—"}
 ]},
screen:{ title:"Sharia screening saham — contoh rasio & ambang ILUSTRATIF mengikuti pola kriteria saham syariah", cols:["Rasio screening","Ilustratif","Ambang contoh"],
 rows:[
  {l:"Utang berbunga / total aset", v:"18%", v2:"≤ 45%", d:"Menakar seberapa 'ribawi' struktur modal emiten. Di atas ambang = gugur dari daftar saham syariah (contoh ambang ilustratif).", psak:"— (kriteria screening, bukan PSAK)", f:"Window dressing: utang dilunasi menjelang tanggal screening lalu ditarik lagi sesudahnya. Cek rata-rata periode, bukan snapshot."},
  {l:"Pendapatan non-halal / total pendapatan", v:"4%", v2:"≤ 10%", d:"Pendapatan bunga + pendapatan non-halal lain dibagi total pendapatan. Kecil bukan berarti nol — screening menoleransi di bawah ambang.", psak:"— (kriteria screening, bukan PSAK)", f:"Cek definisi 'pendapatan' di metodologi screening: reklasifikasi pendapatan bunga ke 'lain-lain' tidak mengubah substansi."},
  {l:"Kas + surat berharga berbunga / total aset", v:"6%", v2:"≤ 33%", d:"Kas yang mengendap di instrumen berbunga ikut dihitung — treasury yang 'parkir' di deposito konvensional bisa menggugurkan.", psak:"— (kriteria screening, bukan PSAK)", f:"Lensa investasi: emiten kas-berlimpah yang parkir di deposito berbunga = yield halal-nya bocor. Tanya ke IR: di mana kas disimpan?"},
  {l:"Status: LOLOS screening", v:"✓", v2:"(ilustratif)", d:"Ketiga rasio di bawah ambang contoh → lolos (ilustratif). Status ini PERIODIK — dievaluasi ulang tiap periode screening.", psak:"—", f:"Lolos hari ini ≠ lolos selamanya. Akuisisi berutang atau ekspansi ke bisnis non-halal bisa menggugurkan di screening berikut."}
 ]}
};

function fmtStmt(key){
  var s = STMTS[key], h = '<table class="stmt"><tr><th>'+s.cols[0]+'</th><th style="text-align:right">'+s.cols[1]+'</th><th style="text-align:right">'+s.cols[2]+'</th></tr>';
  s.rows.forEach(function(r,i){
    h += '<tr class="clickable" data-stmt="'+key+'" data-i="'+i+'"><td>'+r.l+'</td><td class="val mono">'+r.v+'</td><td class="val" style="color:var(--ink-soft)">'+r.v2+'</td></tr>';
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
        + (r.f && r.f !== "—" ? '<div class="forensic"><strong>Lensa forensik:</strong> '+r.f+'</div>' : '');
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
renderStmt("bank");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Margin murabahah +Rp50 M, pembiayaan tetap", q1:"Margin rate murabahah", q2:"Pendapatan operasional", a1:"naik", a2:"naik",
  e:"Margin = harga jual − biaya perolehan. Kenaikan margin murni menaikkan pendapatan — tapi ingat PSAK 402 (dulu 102): margin diakui proporsional selama akad, bukan sekaligus."},
 {t:"Nisbah mudharabah bank turun 60% → 50%", q1:"Bagi hasil untuk bank", q2:"Bagian nasabah (Dana Syirkah Temporer)", a1:"turun", a2:"naik",
  e:"Bagi hasil BUKAN beban bunga tetap. Lensa kredit: DSCR debitur/analisis bank syariah harus memakai arus bagi hasil aktual yang fluktuatif — bukan asumsi kupon tetap."},
 {t:"Seluruh aset ijarah dijual", q1:"Pendapatan sewa (ujrah)", q2:"Kas", a1:"turun", a2:"naik",
  e:"Underlying habis = sumber sewa hilang. Lensa investasi: pemegang sukuk ijarah ikut terdampak — imbal hasil sukuk berasal dari sewa aset ini, bukan bunga yang dijamin."},
 {t:"Pendapatan non-halal naik 4% → 12%", q1:"Rasio pendapatan non-halal", q2:"Status saham syariah", a1:"naik", a2:"turun",
  e:"Melewati ambang contoh 10% → gugur dari screening (ilustratif). Status syariah itu periodik: lolos hari ini tidak menjamin lolos periode berikut."},
 {t:"Dana zakat disalurkan Rp10 M", q1:"Saldo dana zakat", q2:"Laba bank", a1:"turun", a2:"tetap",
  e:"Dana zakat bukan milik bank (PSAK 409, dulu 109) — penyalurannya tercatat di Laporan Sumber & Penggunaan Dana Zakat, tidak menyentuh laba rugi."},
 {t:"Dana Syirkah Temporer +Rp100 M", q1:"Total aset", q2:"Liabilitas konvensional", a1:"naik", a2:"tetap",
  e:"DST disajikan tersendiri — bukan liabilitas, bukan ekuitas (PSAK 401, dulu 101). Analis yang menjumlahkan DST ke utang akan salah hitung leverage bank syariah."}
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
    try{ localStorage.setItem("fsa_pg_m26", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
  }
  $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  r.scrollIntoView({behavior:"smooth", block:"center"});
}
renderPg();

/* ---------- RATIO LAB ---------- */
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
      if(parts.length > 2) return NaN;  // F3: 1.2.3 ditolak
      if(parts.length === 2 && parts[1].length === 3 && parts[0] !== "0" && parts[0] !== "-0"){
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
 {q:"Margin murabahah efektif per tahun (%)", hint:"Margin 200 M ÷ (pembiayaan 1.000 M × tenor 2 tahun) — semua angka ilustratif", ans:10, dec:true, tol:0.5,
  why:"10%/tahun — angkanya mirip bunga KPR, tapi substansinya jual-beli: diakui proporsional selama akad (PSAK 402, dulu 102), bukan bunga atas pinjaman."},
 {q:"Bagi hasil bank dari mudharabah (Rp M)", hint:"Nisbah bank 60% × laba usaha nasabah 150 M — ilustratif", ans:90, dec:false, tol:1,
  why:"Rp90 M — dan ini BUKAN 'bunga 90'. Kalau usaha nasabah rugi tanpa kelalaian, bank tidak dapat apa-apa. DSCR analis kredit wajib pakai arus aktual."},
 {q:"Rasio utang berbunga / total aset (%)", hint:"Utang berbunga 180 M ÷ total aset 1.000 M — ilustratif", ans:18, dec:true, tol:1,
  why:"18% — di bawah ambang contoh 45% → lolos screening (ilustratif). Ingat: status syariah dievaluasi periodik, bukan sekali seumur hidup."},
 {q:"Imbal hasil sukuk ijarah (% per tahun)", hint:"Sewa tahunan 120 M ÷ nominal sukuk 1.000 M — ilustratif", ans:12, dec:true, tol:0.5,
  why:"12% — dari SEWA aset underlying, bukan bunga. Investor punya klaim atas aset/manfaatnya (PSAK 110 — sukuk); cek prospektus untuk risiko asetnya."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 10">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 10)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — return 10% dari jual-beli (murabahah) vs 10% dari pinjaman berbunga. Apakah risikonya identik? Tulis 3 baris: sumber return, risiko gagal bayar, keputusanmu.",
 credit:"Lensa kredit — cicilan murabahah dan cicilan KPR konvensional sama-sama tetap tiap bulan. Apa bedanya bagi analis kredit? Tulis 3 baris: DSCR, agunan/underlying, kesimpulanmu.",
 forensic:"Lensa forensik — kapan 'margin' hanya label untuk bunga? Tulis 3 cek sebelum percaya: isi akad, pola pengakuan margin, keberadaan underlying."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m26_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m26_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"Setelah renumbering PSAK syariah (efektif 1 Januari 2024), standar penyajian laporan keuangan entitas syariah adalah…", o:["PSAK 101","PSAK 401","PSAK 410","PSAK 201"], a:1},
 {q:"Bank Barakah menjual barang Rp20 jt + margin Rp4 jt, tenor 2 tahun (ilustratif). Margin Rp4 jt diakui…", o:["Seluruhnya saat akad ditandatangani di awal periode","Sebagai liabilitas bank yang harus dibayar","Hanya bila nasabah melunasi seluruhnya di akhir tenor","Proporsional selama periode akad (accrual)"], a:3},
 {q:"Pembiayaan mudharabah Rp100 jt merugi Rp10 jt TANPA kelalaian nasabah (ilustratif). Yang menanggung kerugian finansial…", o:["Bank (shahibul maal) — nasabah rugi waktu dan tenaga","Nasabah wajib mengganti penuh semua kerugian ke bank syariah","Kerugian dibagi otomatis 50:50 ke nasabah","Ditalangi dana zakat bank sementara waktu"], a:0},
 {q:"Perbedaan utama ijarah dengan sewa konvensional (PSAK 116) adalah…", o:["Ijarah tidak mengenal aset sama sekali — hanya jasa pemakaian yang diperjualbelikan tanpa perpindahan kepemilikan","PSAK 116 melarang semua bentuk sewa oleh perusahaan penyewa","Ijarah memindahkan manfaat pakai tanpa bunga; kepemilikan tetap pada lessor dalam akad syariah","Tidak ada beda dengan sewa biasa — hanya istilahnya diganti"], a:2},
 {q:"Kenapa sukuk ijarah BUKAN 'obligasi berbunga' di laporan?", o:["Karena kupon sukuk selalu mengambang mengikuti suku bunga pasar","Imbal hasil berasal dari sewa aset underlying yang menjadi hak investor — bukan bunga atas utang","Karena sukuk ijarah hanya diterbitkan pemerintah untuk proyek infrastruktur negara sehingga bebas riba","Karena sukuk ijarah tidak dicatat di laporan keuangan penerbit"], a:1}];
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
           window.FSAMistake.log(26, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Laporan syariah sudah bisa kamu baca: dari Dana Syirkah Temporer sampai sharia screening.</p>"
      + '<p><a class="btn btn-primary" href="../modul-27/">Lanjut ke Modul 27 →</a></p>';
    try{ localStorage.setItem("fsa_gate_m26","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m26") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>"
      + '<p><a class="btn btn-primary" href="../modul-27/">Lanjut ke Modul 27 →</a></p>';
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m26") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m26") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = '<h3>Lulus ✓</h3><p>Modul 26 sudah kamu lewati sebelumnya.</p><p><a class="btn btn-primary" href="../modul-27/">Lanjut ke Modul 27 →</a></p>';
  }
}catch(e){}
})();
