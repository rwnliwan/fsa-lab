/* FSA Lab — Modul 13: Deteksi Fraud — Triangle & Beneish (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
tri:{ title:"Segitiga fraud — 3 syarat manipulasi", cols:["Sisi","Arti","Contoh di Cemerlang"],
 rows:[
  {l:"Tekanan (pressure)", v:"motif", v2:"target laba +53%", d:"Target yang tak masuk akal memaksa manajemen 'mencari' laba.", psak:"—", f:"Tekanan terbesar: bonus berbasis laba, covenant utang, target analis."},
  {l:"Kesempatan (opportunity)", v:"celah", v2:"pengendalian lemah", d:"Pengendalian internal lemah + estimasi akuntansi yang luas = celah.", psak:"—", f:"Perusahaan dengan banyak estimasi (ECL, NRV, umur aset) = kesempatan besar."},
  {l:"Rasionalisasi", v:"pembenaran", v2:"'demi karyawan'", d:"Pelaku membenarkan: sementara saja, demi semua orang, nanti dibetulkan.", psak:"—", f:"Rasionalisasi tak terlihat di angka — terlihat di kultur & insentif."}
 ]},
ben:{ title:"Beneish M-score Cemerlang (ilustratif)", cols:["Komponen","Nilai","Arti"],
 rows:[
  {l:"M-score", v:"−1,65", v2:"FLAG", d:"Di atas batas −1,78 → kemungkinan manipulator. Bukan vonis, tapi flag.", psak:"—", f:"M-score adalah screen, bukan bukti. Flag → gali lebih dalam."},
  {l:"DSRI", v:"1,45", v2:"tinggi", d:"Piutang tumbuh jauh lebih cepat dari penjualan — 73 hari DSO.", psak:"—", f:"DSRI > 1 = screen #1 pendapatan prematur."},
  {l:"GMI", v:"0,97", v2:"netral", d:"Margin kotor relatif stabil — bukan sumber flag utama.", psak:"—", f:"—"},
  {l:"LVGI", v:"0,96", v2:"netral", d:"Leverage relatif stabil — bukan pendorong skor.", psak:"—", f:"—"},
  {l:"Batas", v:"−1,78", v2:"cutoff", d:"Skor di atas (kurang negatif dari) −1,78 = flag manipulator.", psak:"—", f:"Cutoff statistik — selalu gabungkan dengan analisis kualitatif."}
 ]},
repl:{ title:"Replikasi M-score — 8 variabel + bobot Beneish (1999), ilustratif", cols:["Komponen","Nilai","Kontribusi"],
 rows:[
  {l:"Konstanta", v:"−4,84", v2:"−4,840", d:"Intersep model Beneish (1999) — titik awal sebelum 8 variabel.", psak:"Beneish 1999", f:"Bobot di bawah adalah koefisien asli model — bukan tebakan."},
  {l:"DSRI × 0,92", v:"1,45", v2:"+1,334", d:"0,92 × 1,45 = 1,334. Piutang tumbuh jauh lebih cepat dari penjualan — pendorong flag #1.", psak:"—", f:"—"},
  {l:"GMI × 0,528", v:"0,97", v2:"+0,512", d:"0,528 × 0,97 = 0,512. Margin kotor relatif stabil.", psak:"—", f:"—"},
  {l:"AQI × 0,404", v:"1,00", v2:"+0,404", d:"0,404 × 1,00 = 0,404. Kualitas aset netral (ilustratif — porsi aset tak teridentifikasi stabil).", psak:"—", f:"—"},
  {l:"SGI × 0,892", v:"1,30", v2:"+1,160", d:"0,892 × 1,30 = 1,160. Penjualan 520.000 ÷ 400.000 = 1,30 — pertumbuhan 30% (M19) ikut menaikkan skor.", psak:"—", f:"Growth cepat menaikkan SGI & DSRI — flag pada perusahaan tumbuh belum tentu fraud."},
  {l:"DEPI × 0,115", v:"1,00", v2:"+0,115", d:"0,115 × 1,00 = 0,115. Laju depresiasi netral (ilustratif).", psak:"—", f:"—"},
  {l:"SGAI × −0,172", v:"1,00", v2:"−0,172", d:"−0,172 × 1,00 = −0,172. Beban SG&A relatif terhadap penjualan netral (ilustratif).", psak:"—", f:"—"},
  {l:"TATA × 4,679", v:"0,032", v2:"+0,150", d:"4,679 × 0,032 = 0,150. Akrual total 14.440 ÷ total aset 451.440 = 0,032 (Sloan, M17) — bobot TERBESAR model (4,679×).", psak:"—", f:"Akrual adalah tuas terbesar M-score: manipulasi akrual langsung menggerakkan skor."},
  {l:"LVGI × −0,327", v:"0,96", v2:"−0,314", d:"−0,327 × 0,96 = −0,314. Leverage relatif stabil.", psak:"—", f:"—"},
  {l:"M-score (jumlah)", v:"−1,65", v2:"FLAG", d:"−4,84 + 1,334 + 0,512 + 0,404 + 1,160 + 0,115 − 0,172 + 0,150 − 0,314 = −1,65 (pembulatan). Di atas batas −1,78 → FLAG — sama dengan skor jadi di tabel Beneish.", psak:"—", f:"Replikasi menutup ke skor jadi: model ini bisa dihitung ulang, bukan angka sulap."},
  {l:"Keterbatasan", v:"screen", v2:"bukan bukti", d:"M-score = screen statistik dari 8 rasio: bisa false positive (growth cepat menaikkan SGI/DSRI) dan false negative (manipulasi yang tak menyentuh ke-8 variabel lolos). Selalu gabungkan dengan segitiga fraud + bukti dokumen.", psak:"—", f:"Skor tinggi tanpa motif & kesempatan = gali dulu; skor rendah bukan jaminan bersih."}
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
renderStmt("tri");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Target laba tak masuk akal dari direksi", q1:"Risiko fraud", q2:"Skor M", a1:"naik", a2:"tetap",
  e:"Tekanan ekstrem = sisi pertama segitiga (risiko fraud NAIK). Target mustahil hampir selalu dibayar dengan manipulasi — TAPI skor M dihitung dari angka keuangan historis, jadi tanpa perubahan data keuangan skornya TETAP. Risiko kualitatif (triangle) ≠ skor kuantitatif (M-score)."},
 {t:"DSRI 1,45 terdeteksi", q1:"Risiko fraud", q2:"Skor M", a1:"naik", a2:"naik",
  e:"Piutang tumbuh > penjualan = jejak pendapatan prematur. DSRI tinggi menaikkan M-score."},
 {t:"Auditor resign tiba-tiba", q1:"Risiko fraud", q2:"Kepercayaan", a1:"naik", a2:"turun",
  e:"Auditor bisa mundur karena banyak alasan (fee, konflik, rotasi, kapasitas) — bukan otomatis menolak menandatangani sesuatu. Ini sinyal investigasi tata kelola yang keras: cek alasan pengunduran diri di pengungkapannya."},
 {t:"Kas cocok dengan laba 5 tahun", q1:"Risiko fraud", q2:"Skor M", a1:"turun", a2:"turun",
  e:"Laba yang jadi kas bertahun-tahun = kualitas laba yang baik — tapi bukan bukti mutlak: kas bisa dipinjam/diputar atau ditopang penundaan bayar supplier. Uji sumber dan keberlanjutan arus kasnya."},
 {t:"Bonus direksi 100% berbasis laba", q1:"Risiko fraud", q2:"Skor M", a1:"naik", a2:"tetap",
  e:"Insentif = tekanan + rasionalisasi ('saya layak dapat ini'). Desain bonus menentukan perilaku — risiko fraud NAIK, tapi skor M dari angka historis TETAP sampai angka keuangannya berubah."},
 {t:"Whistleblowing system kuat & independen", q1:"Risiko fraud", q2:"Skor M", a1:"turun", a2:"tetap",
  e:"Kesempatan menyusut → risiko turun. Tapi skor M dari angka historis tidak berubah."}
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
    try{ localStorage.setItem("fsa_pg_m13", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"M-score", hint:"Skor Beneish Cemerlang (ilustratif)", ans:-1.65, tol:0.05,
  why:"−1,65 — di atas batas −1,78 → FLAG. Bukan vonis, tapi perintah gali lebih dalam."},
 {q:"DSRI", hint:"Days sales in receivables index (ilustratif)", ans:1.45, tol:0.05,
  why:"1,45 — piutang tumbuh jauh lebih cepat dari penjualan. Pendorong utama flag."},
 {q:"GMI", hint:"Gross margin index (ilustratif)", ans:0.97, tol:0.05,
  why:"0,97 — margin relatif stabil, bukan sumber flag."},
 {q:"LVGI", hint:"Leverage index (ilustratif)", ans:0.96, tol:0.05,
  why:"0,96 — leverage relatif stabil, bukan pendorong skor."},
 {q:"Kontribusi SGI ke M-score", hint:"0,892 × 1,30 (SGI = 520.000 ÷ 400.000)", ans:1.16, dec:true, tol:0.02,
  why:"1,16 — kontribusi tunggal terbesar kedua setelah DSRI. Growth 30% ikut menaikkan skor — flag belum tentu fraud."},
 {q:"TATA Cemerlang (akrual ÷ total aset)", hint:"14.440 ÷ 451.440 (Sloan, M17)", ans:0.032, dec:true, tol:0.002,
  why:"0,032 — dikali bobot 4,679 = +0,150 ke M-score. Akrual adalah tuas terbesar model ini."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: -1,65">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (boleh negatif, contoh: -1,65)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — M-score −1,2 tapi laba tumbuh 40%/tahun. Apakah ini growth atau jebakan? Keputusanmu + batas risikomu.",
 credit:"Lensa kredit — Beri pinjaman ke perusahaan dengan M-score flag? Syarat, covenant, dan monitoring apa yang kamu pasang?",
 forensic:"Lensa forensik — Tulis 3 prosedur untuk memverifikasi apakah flag −1,2 ini manipulasi beneran atau false positive."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m13_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m13_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Tiga sisi fraud triangle…", o:["Uang, waktu, dan orang","Tekanan, kesempatan, rasionalisasi","Motif, sarana, dan peluang yang tersedia luas","Tekanan, kesempatan, dan lemahnya pengawasan"], a:1},
 {q:"M-score −1,65 vs batas −1,78 → …", o:["Flag","Butuh 10 tahun data","Aman","Tidak valid"], a:0},
 {q:"DSRI 1,45 artinya…", o:["Piutang tumbuh > penjualan","Penjualan tumbuh > piutang","Kas naik lebih cepat","Perusahaan menagih lebih cepat"], a:0},
 {q:"Skema manipulasi paling umum…", o:["Penggelapan kas","Suap dan korupsi","Pendapatan prematur","Mark-up beban fiktif"], a:2},
 {q:"Skeptisisme profesional = …", o:["Curiga buta","Percaya manajemen","Verifikasi bukti","Abaikan red flag"], a:2}
];
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
           window.FSAMistake.log(13, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). <a href=\"../modul-14/\">Lanjut ke Modul 14 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m13","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m13") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m13") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m13") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 13 sudah kamu lewati sebelumnya. <a href=\"../modul-14/\">Lanjut ke Modul 14 →</a></p>";
  }
}catch(e){}
})();
