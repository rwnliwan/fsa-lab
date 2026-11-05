/* FSA Lab — Modul 8: DuPont & Bedah Segmen (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
dupont:{ title:"DuPont 5 langkah 2025", cols:["Komponen","2025","2024"],
 rows:[
  {l:"Beban pajak (NI ÷ PBT)", v:"78,0%", v2:"—", d:"45.240 ÷ 58.000. Dari tiap Rp100 laba sebelum pajak, Rp78 sampai ke pemegang saham.", psak:"—", f:"Tax burden yang melonjak tiba-tiba = cek one-off pajak."},
  {l:"Beban bunga (PBT ÷ EBIT)", v:"80,6%", v2:"—", d:"58.000 ÷ 72.000. Bunga memakan 19,4% laba operasi.", psak:"—", f:"Interest burden yang turun = leverage makin rakus."},
  {l:"Margin EBIT", v:"13,8%", v2:"12,0%", d:"72.000 ÷ 520.000. Inti profitabilitas operasi.", psak:"—", f:"—"},
  {l:"Perputaran aset", v:"1,25x", v2:"—", d:"520.000 ÷ 414.820 (rata-rata aset). Efisiensi pemakaian aset.", psak:"—", f:"—"},
  {l:"Leverage (A ÷ E)", v:"2,60x", v2:"—", d:"414.820 ÷ 159.820 (rata-rata). Pengungkit ROE — sekaligus risiko.", psak:"—", f:"Leverage = pengungkit return sekaligus pengungkit risiko."},
  {l:"ROE (hasil kali)", v:"28,3%", v2:"—", d:"78,0% × 80,6% × 13,8% × 1,25 × 2,60 ≈ 28,3% (selisih pembulatan).", psak:"—", f:"Selalu urai ROE sebelum kagum padanya."},
 ]},
segmen:{ title:"Segmen usaha 2025 (ilustratif, Rp juta)", cols:["Segmen","Penjualan","Laba operasi"],
 rows:[
  {l:"Ritel", v:"312.000", v2:"46.800", d:"60% penjualan. Margin 15,0%; aset 270.864; ROA 17,3% — mesin cuan perusahaan.", psak:"PSAK 108 (dulu 5)", f:"—"},
  {l:"Distribusi", v:"208.000", v2:"25.200", d:"40% penjualan. Margin 12,1%; aset 180.576; ROA 14,0% — di bawah Ritel.", psak:"PSAK 108 (dulu 5)", f:"Segmen margin rendah = kandidat divestasi atau perbaikan operasi."},
  {l:"Total (tie)", v:"520.000", v2:"72.000", d:"312.000+208.000 = 520.000 ✓; 46.800+25.200 = 72.000 ✓; aset 270.864+180.576 = 451.440 ✓", psak:"—", f:"Segmen harus tie ke konsolidasian — kalau tidak, ada yang disembunyikan."},
 ]},
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
renderStmt("dupont");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Tarif pajak efektif naik ke 28%", q1:"Beban pajak (NI/PBT)", q2:"ROE", a1:"turun", a2:"turun",
  e:"Pajak naik → NI/PBT turun → ROE turun. DuPont memisahkan efek pajak dari operasi."},
 {t:"Beban bunga naik 40%", q1:"Beban bunga (PBT/EBIT)", q2:"ROE", a1:"turun", a2:"turun",
  e:"PBT tergerus bunga → rasio turun → ROE turun. Leverage punya harga."},
 {t:"Margin EBIT naik 2 poin", q1:"ROE", q2:"ROA", a1:"naik", a2:"naik",
  e:"Operasi membaik → keduanya naik. Inilah return yang berkualitas."},
 {t:"Jual aset Distribusi (ROA 14% < 17,3%)", q1:"Perputaran aset", q2:"ROE", a1:"naik", a2:"naik",
  e:"Lepas aset ber-return rendah → perputaran naik → ROE naik. Divestasi cerdas."},
 {t:"Tambah utang untuk buyback", q1:"Leverage", q2:"ROE", a1:"naik", a2:"naik",
  e:"Leverage naik → ROE naik SEMU. Cek: ROA tidak bergerak — ini rekayasa, bukan kinerja."},
 {t:"Ritel tumbuh 2x lebih cepat dari Distribusi", q1:"Mix margin", q2:"ROE", a1:"naik", a2:"naik",
  e:"Mix bergeser ke segmen margin tinggi → margin konsolidasi naik → ROE naik."},
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
    try{ localStorage.setItem("fsa_pg_m8", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Tax burden (%)", hint:"NI ÷ PBT: 45.240 ÷ 58.000 × 100", ans:78.0, dec:true, tol:0.3,
  why:"78,0% — pajak 22% dari PBT. Tax burden = cermin tarif efektif."},
 {q:"Interest burden (%)", hint:"PBT ÷ EBIT: 58.000 ÷ 72.000 × 100", ans:80.6, tol:0.3,
  why:"80,6% — bunga memakan 19,4% laba operasi."},
 {q:"EBIT margin (%)", hint:"EBIT ÷ penjualan: 72.000 ÷ 520.000 × 100", ans:13.8, tol:0.3,
  why:"13,8% — inti profitabilitas operasi."},
 {q:"Margin segmen Ritel (%)", hint:"Laba operasi Ritel ÷ penjualan Ritel: 46.800 ÷ 312.000 × 100", ans:15.0, dec:true, tol:0.3,
  why:"15,0% vs Distribusi 12,1% — Ritel mesin cuannya."},
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 78,0">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 78,0 atau 78.0)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Spin-off Distribusi: melepas beban atau membuang diversifikasi? Tulis 3 baris.",
 credit:"Lensa kredit — Setelah spin-off, leverage & coverage berubah bagaimana? Lebih aman atau lebih berisiko?",
 forensic:"Lensa forensik — Apakah spin-off menutupi masalah di Distribusi? Tulis 3 cek."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m8_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m8_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"DuPont 5 langkah mengurai ROE menjadi…", o:["Beban pajak, beban bunga, margin EBIT, perputaran aset, leverage", "Lima laporan keuangan utama yang wajib dibaca berurutan", "Lima rasio likuiditas untuk menilai kemampuan perusahaan membayar utang jangka pendek", "Data ROE lima tahun terakhir yang dirata-ratakan"], a:0},
 {q:"Tax burden 78% artinya…", o:["Pajak 78% dari laba","Pajak 22% dari PBT","Perusahaan rugi fiskal","Tarif pajak efektif 78%"], a:1},
 {q:"Segmen yang lebih profitable?", o:["Distribusi, karena diusulkan spin-off", "Tak bisa dibandingkan langsung", "Sama saja karena satu perusahaan", "Ritel (margin 15,0% vs 12,1%)"], a:3},
 {q:"Interest burden turun artinya…", o:["Beban bunga turun sehingga porsi bunga mengecil", "Laba pasti naik karena beban berkurang", "Perusahaan bebas dari beban bunga", "Bunga memakan porsi laba lebih besar"], a:3},
 {q:"Segment analysis terutama untuk…", o:["Alokasi modal & menilai tiap segmen", "Menentukan dividen untuk pemegang saham", "Mengganti prosedur audit atas laporan keuangan", "Menghitung pajak tiap segmen secara terpisah"], a:0},
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
           window.FSAMistake.log(8, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). <a href=\"../modul-9/\">Lanjut ke Modul 9 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m8","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m8") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m8") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m8") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 8 sudah kamu lewati sebelumnya. <a href=\"../modul-9/\">Lanjut ke Modul 9 →</a></p>";
  }
}catch(e){}
})();
