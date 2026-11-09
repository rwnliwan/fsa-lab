/* FSA Lab — Modul 17: Forensik Lanjutan (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
sloan:{ title:"Toolkit forensik — Cemerlang 2025", cols:["Ukuran","2025","Arti"],
 rows:[
  {l:"Akrual (NI - CFO)", v:"14.440", v2:"Rp juta", d:"45.240 - 30.800 = 14.440. Bagian laba yang belum menjadi kas.", psak:"—", f:"Akrual = tempat manajemen 'menyimpan' laba. Naik terus = curiga."},
  {l:"Sloan ratio", v:"3,2%", v2:"akrual moderat", d:"14.440 ÷ 451.440 = 3,2%. Di atas 10% persisten = kualitas laba rendah — RULE OF THUMB ilustratif, bukan ambang diagnostik (tergantung definisi akrual, denominator, industri & periode).", psak:"—", f:"Sloan tinggi persisten = perusahaan hidup dari akuntansi, bukan kas."},
  {l:"CFO / NI", v:"0,68x", v2:"di bawah 1", d:"30.800 ÷ 45.240 = 0,68. Laba tidak sepenuhnya didukung kas operasi.", psak:"—", f:"CFO/NI < 1 lima tahun beruntun = pola manipulasi klasik."},
  {l:"Beneish M-score", v:"−1,65", v2:"di atas −1,78", d:"Model 8 variabel (DSRI 1,45; GMI 0,97; LVGI 0,96). Di atas batas −1,78 = flag manipulator.", psak:"—", f:"M-score = probabilitas, bukan vonis. Flag = alasan menggali, bukan alasan menuduh."}
 ]},
cases:{ title:"Kasus fraud nyata — polanya", cols:["Kasus","Tahun","Pola"],
 rows:[
  {l:"Garuda Indonesia", v:"2018", v2:"Piutang Mahata ~US$240jt", d:"Pendapatan kontrak 15 tahun diakui penuh di 2018; restatement setelah sanksi OJK & Kemenkeu Juni 2019. Restatement resmi 2018: rugi US$175,0 jt.", psak:"PSAK 115 (dulu 72)", f:"Pelajaran: pendapatan diakui di muka + piutang jumbo ke satu pihak = cek kontraknya."},
  {l:"Enron", v:"2000", v2:"Utang TERCATAT", d:"Utang tercatat 7,4 → 8,2 → 10,2 (US$ MILIAR, 1998–2000) — yang disembunyikan di SPE justru TIDAK muncul di angka ini.", psak:"—", f:"Pelajaran: bandingkan utang tercatat vs footnote — selisihnya tempat badan disembunyikan."},
  {l:"Segitiga fraud", v:"Semua kasus", v2:"Tekanan + kesempatan + rasionalisasi", d:"Tekanan (target laba), kesempatan (kontrol lemah), rasionalisasi ('demi perusahaan'). Ketiganya hadir di tiap skandal.", psak:"—", f:"Cek insentif manajemen dulu: bonus berbasis laba = tekanan."}
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
renderStmt("sloan");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Akrual >10% selama 3 tahun beruntun", q1:"Kualitas laba", q2:"Risiko", a1:"turun", a2:"naik",
  e:"Akrual persisten tinggi = laba kertas menumpuk. Sloan: kualitas rendah."},
 {t:"CFO/NI < 1 selama 5 tahun", q1:"Kualitas", q2:"Kepercayaan", a1:"turun", a2:"turun",
  e:"Laba tak pernah jadi kas = pola manipulasi klasik."},
 {t:"Penjualan ke pihak berelasi naik tajam", q1:"Risiko", q2:"Skeptisisme", a1:"naik", a2:"naik",
  e:"Related-party = transaksi tidak wajar. Naikkan skeptisisme, verifikasi bukti."},
 {t:"Komite audit independen diperkuat", q1:"Risiko", q2:"Kepercayaan", a1:"turun", a2:"naik",
  e:"Governance kuat menekan kesempatan fraud → kepercayaan naik."},
 {t:"Kas > laba selama 5 tahun", q1:"Kualitas", q2:"Kepercayaan", a1:"naik", a2:"naik",
  e:"Laba konservatif yang menjadi kas = kualitas tertinggi."},
 {t:"Restatement 3 tahun beruntun", q1:"Risiko", q2:"Kepercayaan", a1:"naik", a2:"turun",
  e:"Restatement berulang = sistem akuntansi tidak bisa dipercaya."}
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
    try{ localStorage.setItem("fsa_pg_m17", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Sloan ratio 2025 (%)", hint:"Akrual ÷ total aset × 100: 14.440 ÷ 451.440 × 100", ans:3.2, tol:0.2,
  why:"3,2% — akrual moderat, di bawah ambang bahaya 10% (rule of thumb ilustratif, bukan batas diagnostik universal)."},
 {q:"Akrual 2025 (Rp juta)", hint:"Laba bersih - CFO: 45.240 - 30.800", ans:14440, dec:false, tol:100,
  why:"14.440 — laba yang belum menjadi kas."},
 {q:"CFO / NI 2025 (x)", hint:"CFO ÷ laba bersih: 30.800 ÷ 45.240", ans:0.68, tol:0.02,
  why:"0,68x — di bawah 1 = waspada."},
 {q:"Beneish M-score", hint:"Model 8 variabel (DSRI 1,45; LVGI 0,96)", ans:-1.65, tol:0.05,
  why:"−1,65 > −1,78 = flag. Bukan vonis, tapi alasan menggali."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 3,2">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (boleh negatif, contoh: 3,2)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Sloan 3,2% moderat, tapi M-score flag. Apakah ini cukup untuk menghindari sahamnya? Tulis 3 baris.",
 credit:"Lensa kredit — Memo forensik untuk komite kredit: red flag apa yang mengubah syarat pinjamanmu?",
 forensic:"Lensa forensik — Tulis memo 1 halaman: kumpulkan SEMUA red flag Cemerlang + 3 bukti yang kamu minta ke manajemen."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m17_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m17_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Sloan ratio Cemerlang 3,2% berarti…", o:["Nol akrual","Zona bahaya","Akrual sangat besar","Akrual moderat"], a:3},
 {q:"Akrual tinggi yang persisten berarti…", o:["Kualitas laba rendah","Kualitas laba tinggi","Sudah pasti fraud dan harus dilaporkan","Manajemen sedang efisien"], a:0},
 {q:"Kasus Garuda Indonesia 2018 berpusat pada…", o:["Laba yang naik","Piutang Mahata","Kas yang hilang","Tidak ada kasus"], a:1},
 {q:"Skandal Enron berpusat pada…", o:["Kas yang dicuri","Penggelapan pajak","Penggelapan oleh direksi","Utang off-balance-sheet"], a:3},
 {q:"Skeptisisme profesional berarti…", o:["Curiga buta pada semua","Verifikasi bukti sebelum percaya","Percaya pada manajemen","Mengabaikan semua red flag yang ada"], a:1}
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
           window.FSAMistake.log(17, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). <a href=\"../modul-18/\">Lanjut ke Modul 18 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m17","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m17") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m17") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m17") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 17 sudah kamu lewati sebelumnya. <a href=\"../modul-18/\">Lanjut ke Modul 18 →</a></p>";
  }
}catch(e){}
})();
