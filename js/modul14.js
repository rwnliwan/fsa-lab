/* FSA Lab — Modul 14: PSAK vs US GAAP (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
beda:{ title:"5 beda utama PSAK vs US GAAP", cols:["Topik","PSAK","US GAAP"],
 rows:[
  {l:"LIFO", v:"dilarang", v2:"boleh", d:"PSAK hanya FIFO/rata-rata. US GAAP membolehkan LIFO.", psak:"PSAK 202 (dulu 14)", f:"Perusahaan AS dengan LIFO punya 'LIFO reserve' — cadangan tersembunyi."},
  {l:"Reversal impairment", v:"boleh", v2:"dilarang", d:"PSAK membolehkan pembalikan rugi impairment (kecuali goodwill). GAAP tidak.", psak:"PSAK 236 (dulu 48)", f:"Reversal besar = cek apakah pemulihan beneran atau manajemen laba."},
  {l:"Development cost", v:"kapitalisasi*", v2:"beban", d:"PSAK: dikapitalisasi bila kriteria terpenuhi. GAAP: langsung beban (kecuali software).", psak:"PSAK 216/208", f:"Kapitalisasi agresif = WorldCom playbook. Cek kriteria 6 syarat."},
  {l:"Revaluasi aset tetap", v:"boleh", v2:"tidak boleh", d:"PSAK membolehkan model revaluasi. GAAP: historical cost saja.", psak:"PSAK 216 (dulu 16)", f:"Revaluasi berulang = ekuitas semu. Analis GAAP menyesuaikan ke cost."},
  {l:"Bunga dibayar", v:"operasi/pendanaan", v2:"operasi", d:"PSAK: boleh di operasi atau pendanaan. GAAP: wajib operasi.", psak:"PSAK 207 (dulu 2)", f:"Bunga di pendanaan → CFO terlihat lebih besar. Samakan dulu sebelum bandingkan."}
 ]},
dampak:{ title:"Dampak ke angka Cemerlang bila pakai US GAAP (ilustratif Rp juta)", cols:["Pos","Angka","Keterangan"],
 rows:[
  {l:"LIFO reserve", v:"12.000", v2:"ilustratif", d:"Selisih persediaan FIFO vs LIFO saat harga naik.", psak:"—", f:"LIFO reserve = laba yang 'disimpan' di persediaan."},
  {l:"Persediaan GAAP", v:"84.000", v2:"96.000 − 12.000", d:"96.000 − 12.000. Lebih rendah dari versi PSAK.", psak:"—", f:"—"},
  {l:"Laba bersih GAAP", v:"35.880", v2:"ilustratif", d:"45.240 − 9.360. 20,7% lebih rendah dari versi PSAK.", psak:"—", f:"Selisih 20% hanya dari beda aturan — tanpa beda bisnis."},
  {l:"Selisih laba bersih", v:"(9.360)", v2:"45.240 − 35.880", d:"Dampak gabungan penyesuaian LIFO & lainnya.", psak:"—", f:"Inilah kenapa analis menyesuaikan dulu sebelum membandingkan lintas negara."},
  {l:"Pelajaran", v:"samakan dulu", v2:"baru bandingkan", d:"Jangan bandingkan ROE/margin lintas GAAP tanpa penyesuaian.", psak:"—", f:"—"}
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
renderStmt("beda");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Pakai LIFO saat harga naik", q1:"HPP", q2:"Laba", a1:"naik", a2:"turun",
  e:"LIFO mengeluarkan stok termahal dulu → HPP naik → laba turun. Pajak lebih kecil — itulah alasan perusahaan AS memakainya."},
 {t:"Revaluasi tanah dibalik (ke GAAP)", q1:"Ekuitas", q2:"Aset", a1:"turun", a2:"turun",
  e:"GAAP tak mengakui revaluasi → surplus dihapus → ekuitas & aset turun. Bandingkan apel dengan apel."},
 {t:"Development cost dibebankan (GAAP)", q1:"Aset", q2:"Laba", a1:"turun", a2:"turun",
  e:"Tak ada kapitalisasi → aset tak terbentuk, beban langsung → laba turun. R&D-heavy = beda besar antar GAAP."},
 {t:"Reversal impairment dibalik (GAAP)", q1:"Laba", q2:"Aset", a1:"turun", a2:"turun",
  e:"GAAP melarang reversal → pembalikan dibatalkan → laba & aset turun ke versi konservatif."},
 {t:"Bunga dibayar dipindah ke operasi (GAAP)", q1:"CFO", q2:"CFF", a1:"turun", a2:"naik",
  e:"Bunga keluar dari pendanaan → CFO turun, CFF naik (tak lagi terbebani). Total kas tetap sama."},
 {t:"LIFO reserve dihapus dari ekuitas", q1:"Persediaan", q2:"Ekuitas", a1:"turun", a2:"turun",
  e:"Cadangan tersembunyi dihapus → persediaan & ekuitas turun. Analis yang teliti menambahkannya kembali."}
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
    try{ localStorage.setItem("fsa_pg_m14", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"LIFO reserve (Rp juta)", hint:"Selisih persediaan FIFO vs LIFO (ilustratif)", ans:12000, dec:false, tol:100,
  why:"12.000 — laba yang 'disimpan' di persediaan versi LIFO."},
 {q:"Laba bersih GAAP (Rp juta)", hint:"45.240 − 9.360 (ilustratif)", ans:35880, dec:false, tol:100,
  why:"35.880 — 20,7% lebih rendah dari versi PSAK. Beda aturan, bukan beda bisnis."},
 {q:"Selisih laba bersih (Rp juta)", hint:"45.240 − 35.880", ans:9360, dec:false, tol:100,
  why:"9.360 — magnitude penyesuaian yang wajib dibuat analis lintas negara."},
 {q:"Persediaan GAAP (Rp juta)", hint:"96.000 − 12.000 (ilustratif)", ans:84000, dec:false, tol:100,
  why:"84.000 — persediaan versi LIFO lebih rendah saat harga naik."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 12000">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 12000)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Setelah penyesuaian GAAP, margin & ROE Cemerlang turun. Apakah peer AS masih lebih menarik? Tulis 3 baris.",
 credit:"Lensa kredit — Covenant berbasis GAAP vs PSAK bisa memberi hasil beda. Klausul mana yang kamu tulis agar tak diakali beda aturan?",
 forensic:"Lensa forensik — Tulis 3 cek: apakah perusahaan sengaja memilih metode yang menggelembungkan laba?"
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m14_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m14_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Metode LIFO di PSAK…", o:["Dilarang","Boleh","Tak diatur","Wajib"], a:0},
 {q:"Reversal impairment di US GAAP…", o:["Boleh","Tak diatur","Dilarang","Wajib"], a:2},
 {q:"Bunga dibayar di US GAAP diklasifikasikan…", o:["Investasi","Operasi","Pendanaan","Ekuitas"], a:1},
 {q:"Development cost di US GAAP dicatat…", o:["Beban","Aset","Ekuitas","Tidak dicatat"], a:0},
 {q:"Analis peduli beda PSAK vs GAAP karena…", o:["Kepatuhan regulasi","Kemudahan audit","Perhitungan pajak","Komparabilitas"], a:3}
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
           window.FSAMistake.log(14, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). <a href=\"../modul-15/\">Lanjut ke Modul 15 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m14","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m14") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m14") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m14") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 14 sudah kamu lewati sebelumnya. <a href=\"../modul-15/\">Lanjut ke Modul 15 →</a></p>";
  }
}catch(e){}
})();
