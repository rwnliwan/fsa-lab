/* FSA Lab — Modul 4: Modal Kerja & Cash Conversion Cycle (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
wc:{ title:"Modal Kerja 2025 (Rp juta)", cols:["Pos","2025","2024"],
 rows:[
  {l:"Piutang usaha", v:"104.000", v2:"55.000", d:"+89% YoY — komponen WC terbesar yang memburuk.", psak:"PSAK 109 (dulu 71) — ECL", f:"Piutang = kas yang dipinjamkan ke pelanggan. +89% = pelanggan makin lama bayar atau penjualan fiktif."},
  {l:"Persediaan", v:"96.000", v2:"80.000", d:"+20% — sejalan dengan penjualan +30%.", psak:"PSAK 202 (dulu 14)", f:"Persediaan usang disembunyikan di sini; cek perputaran vs industri."},
  {l:"Utang usaha", v:"62.000", v2:"50.000", d:"+24% — pembiayaan gratis dari supplier.", psak:"—", f:"Utang usaha yang tumbuh LEBIH CEPAT dari pembelian = stretch payables."},
  {l:"Kas dan setara kas", v:"21.440", v2:"33.200", d:"Bagian aset lancar (rincian lengkap di M5).", psak:"—", f:"—"},
  {l:"Utang bank jangka pendek", v:"31.440", v2:"—", d:"Bagian liabilitas lancar (rincian lengkap di M5).", psak:"—", f:"—"},
  {l:"Akrual", v:"8.560", v2:"—", d:"Bagian liabilitas lancar (rincian lengkap di M5).", psak:"—", f:"—"},
  {l:"Modal kerja (WC)", v:"119.440", v2:"88.200", d:"Aset lancar − liabilitas lancar: 221.440 − 102.000 = 119.440 (2024: 168.200 − 80.000 = 88.200). Naik 35,4% — kas terikat makin besar.", psak:"—", f:"WC yang tumbuh lebih cepat dari penjualan = efisiensi operasi memburuk."}
 ]},
cyc:{ title:"Siklus operasi 2025 (hari)", cols:["Ukuran","2025","2024"],
 rows:[
  {l:"DSO (piutang)", v:"73,0 hari", v2:"50,2 hari", d:"104.000/520.000×365. Kas tertagih 23 hari lebih lambat.", psak:"—", f:"DSO melar = screen #1 revenue fraud (channel stuffing)."},
  {l:"DIO (persediaan)", v:"103,7 hari", v2:"110,6 hari", d:"96.000/338.000×365. Membaik 7 hari.", psak:"—", f:"—"},
  {l:"DPO (utang usaha)", v:"67,0 hari", v2:"69,1 hari", d:"62.000/338.000×365. Bayar sedikit lebih cepat.", psak:"—", f:"DPO yang melonjak tiba-tiba = tunda bayar agar CFO terlihat bagus."},
  {l:"Cash conversion cycle", v:"109,7 hari", v2:"91,7 hari", d:"73,0 + 103,7 − 67,0. Naik 18 hari — kas terikat hampir 4 bulan.", psak:"—", f:"CCC yang memburuk = alarm dini sebelum krisis likuiditas."}
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
renderStmt("wc");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Pelanggan membayar 20 hari lebih lambat", q1:"DSO", q2:"CCC", a1:"naik", a2:"naik",
  e:"Kas tertagih lebih lama → DSO naik → CCC naik. Solusinya: diskon tunai atau koleksi agresif."},
 {t:"Stok menumpuk karena over-produksi", q1:"DIO", q2:"CCC", a1:"naik", a2:"naik",
  e:"Persediaan mengendap → DIO naik → CCC naik. Gudang penuh = kas mati."},
 {t:"Tunda bayar supplier 15 hari lebih lama", q1:"DPO", q2:"CCC", a1:"naik", a2:"turun",
  e:"DPO naik = pembiayaan gratis → CCC turun. Tapi supplier bisa memutus pasokan — trik ini ada harganya."},
 {t:"Diskon tunai 2/10 untuk pelanggan", q1:"DSO", q2:"CCC", a1:"turun", a2:"turun",
  e:"Pelanggan bayar cepat demi diskon → DSO turun → CCC turun. Biaya: margin 2%."},
 {t:"Produksi just-in-time, stok dipangkas", q1:"DIO", q2:"CCC", a1:"turun", a2:"turun",
  e:"Persediaan ramping → DIO turun → CCC turun. Risiko: stockout saat demand melonjak."},
 {t:"Jual piutang Rp40.000 ke bank (factoring)", q1:"DSO", q2:"Kas", a1:"turun", a2:"naik",
  e:"Piutang −40.000 → DSO turun, kas +40.000. Tapi ini menjual masa depan — bukan perbaikan operasi."}
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
    try{ localStorage.setItem("fsa_pg_m4", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"DSO 2025 (hari)", hint:"Piutang ÷ penjualan × 365: 104.000 ÷ 520.000 × 365", ans:73.0, dec:true, tol:0.5,
  why:"73,0 hari — naik dari 50,2. Kas tertagih 23 hari lebih lambat dari tahun lalu."},
 {q:"DIO 2025 (hari)", hint:"Persediaan ÷ HPP × 365: 96.000 ÷ 338.000 × 365", ans:103.7, tol:0.5,
  why:"103,7 hari — membaik dari 110,6. Stok berputar sedikit lebih cepat."},
 {q:"DPO 2025 (hari)", hint:"Utang usaha ÷ HPP × 365: 62.000 ÷ 338.000 × 365", ans:67.0, dec:true, tol:0.5,
  why:"67,0 hari — turun tipis dari 69,1. Bayar supplier sedikit lebih cepat."},
 {q:"Cash conversion cycle 2025 (hari)", hint:"DSO + DIO − DPO: 73,0 + 103,7 − 67,0", ans:109.7, tol:0.5,
  why:"109,7 hari — naik dari 91,7. Kas terikat 18 hari lebih lama. Inilah kenapa laba +53% tapi kas −35% (kas 33.200 → 21.440)."},
 {q:"Modal kerja 2025 (Rp juta)", hint:"(Kas + piutang + persediaan) − (utang usaha + bank pendek + akrual): 221.440 − 102.000", ans:119440, dec:false, tol:100,
  why:"119.440 — kas 21.440 + piutang 104.000 + persediaan 96.000 dikurangi utang usaha 62.000 + bank pendek 31.440 + akrual 8.560. Semua komponen ada di tabel di atas — tak perlu buka M5."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 73,0">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 73,0 atau 73.0)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — CCC 109,7 hari dan tren menaik. Apakah ini bisnis yang efisien memutar modal? Tulis 3 baris: efisiensi operasi, risiko, keputusanmu.",
 credit:"Lensa kredit — Fasilitas modal kerja Rp30 miliar. DSO 73 hari, WC 119.440. Layak diberi? Syarat apa yang kamu pasang?",
 forensic:"Lensa forensik — DSO +23 hari dalam setahun. Tulis 3 cek untuk memastikan ini masalah koleksi biasa, bukan penjualan fiktif."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m4_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m4_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"CCC naik 91,7 → 109,7 hari artinya…", o:["Kas terikat 18 hari lebih lama di operasi", "Putaran modal kerja makin cepat", "Pemasok dibayar lebih cepat", "Laba operasi pasti ikut turun juga"], a:0},
 {q:"DSO 73 hari vs 50 hari tahun lalu menunjukkan…", o:["Koleksi piutang justru membaik", "Persediaan menumpuk akibat pembelian berlebihan", "Utang usaha dilunasi lebih cepat", "Koleksi memburuk — waspadai kualitas penjualan"], a:3},
 {q:"Cara tercepat memperbaiki CCC tanpa tambah utang…", o:["Tarik utang bank jangka pendek", "Tambah stok agar penjualan naik", "Tagih piutang lebih agresif", "Naikkan dividen tunai tahun ini"], a:2},
 {q:"DPO naik tajam tiba-tiba bisa berarti…", o:["Perbaikan efisiensi operasional murni", "Stretch payables — tunda bayar agar CFO terlihat bagus", "Penjualan naik tajam sehingga utang usaha ikut membengkak", "Modal kerja membaik secara permanen"], a:1},
 {q:"Modal kerja positif Rp119.440 artinya…", o:["Aset lancar melebihi liabilitas lancar", "Perusahaan pasti mencetak rugi tahun ini", "Saldo kas perusahaan negatif", "Perusahaan bebas utang sama sekali"], a:0}
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
           window.FSAMistake.log(4, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). <a href=\"../modul-5/\">Lanjut ke Modul 5 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m4","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m4") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m4") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m4") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 4 sudah kamu lewati sebelumnya. <a href=\"../modul-5/\">Lanjut ke Modul 5 →</a></p>";
  }
}catch(e){}
})();
