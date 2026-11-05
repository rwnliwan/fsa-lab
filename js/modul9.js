/* FSA Lab — Modul 9: Kualitas Pendapatan & EPS (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
rev:{ title:"Pendapatan 2025 (Rp juta)", cols:["Pos","2025","2024"],
 rows:[
  {l:"Penjualan", v:"520.000", v2:"400.000", d:"+30% YoY. Diakui saat kewajiban pelaksanaan dipenuhi (PSAK 115).", psak:"PSAK 115 (dulu 72)", f:"Tumbuh 30% tapi piutang +89% — kualitas dipertanyakan."},
  {l:"Piutang usaha", v:"104.000", v2:"55.000", d:"+89% YoY. Sebagian besar penjualan = kredit, bukan tunai.", psak:"PSAK 109 (dulu 71)", f:"Pendapatan tanpa kas = janji. Cek kolektibilitasnya."},
  {l:"Model 5 langkah", v:"PSAK 115", v2:"—", d:"Kontrak → kewajiban → harga → alokasi → pengakuan. Tiap langkah = ruang judgment manajemen.", psak:"PSAK 115", f:"Langkah 5 (pengakuan) paling sering dimanipulasi: akui lebih awal."},
  {l:"Retur & diskon (ilustratif)", v:"Diungkap", v2:"—", d:"Ilustratif: estimasi retur mengurangi pendapatan. Estimasi = bisa dipoles.", psak:"PSAK 115", f:"Cadangan retur yang terlalu kecil = pendapatan digelembungkan."},
 ]},
eps:{ title:"EPS & one-off 2025", cols:["Pos","2025","2024"],
 rows:[
  {l:"Saham beredar", v:"100 juta", v2:"100 juta", d:"Tidak berubah. Basis per-saham.", psak:"PSAK 233 (dulu 56)", f:"—"},
  {l:"EPS dasar", v:"452,4", v2:"296,4", d:"45.240 ÷ 100 juta. +52,6% YoY.", psak:"PSAK 233", f:"EPS naik — tapi berapa yang recurring?"},
  {l:"Dilusi", v:"Tidak ada", v2:"—", d:"Tanpa opsi/saham konversi → diluted = dasar.", psak:"PSAK 233", f:"—"},
  {l:"One-off: laba jual aset", v:"8.000", v2:"—", d:"Sebelum pajak. Setelah pajak 6.240 = 13,8% dari laba.", psak:"—", f:"One-off di headline = ilusi pertumbuhan."},
  {l:"Continuing EPS", v:"390,0", v2:"—", d:"39.000 ÷ 100 juta. Laba berulang per saham — basis valuasi.", psak:"—", f:"Valuasi pakai continuing EPS — bukan headline."},
 ]},
adj:{ title:"Non-GAAP / adjusted: apa yang di-add-back — angka ilustratif, Rp juta", cols:["Penyesuaian","Angka","Makna"],
 rows:[
  {l:"Adjusted EBITDA 2025 (ilustratif)", v:"108.000", v2:"+6.000", d:"EBITDA dilaporkan 102.000 + add-back beban restrukturisasi 6.000 (ilustratif, diklaim sekali lewat) = adjusted EBITDA 108.000. Add-back = klaim manajemen: 'tanpa gangguan ini, labanya sekian'.", psak:"Non-GAAP — bukan PSAK", f:"Add-back adalah klaim manajemen, bukan angka audit. Tanya: bukti 'one-off'-nya dari mana?"},
  {l:"Add-back khas", v:"5 pola", v2:"—", d:"Restrukturisasi, impairment, laba/rugi jual aset, stock-based compensation, rugi selisih kurs. Sah dipakai analis — ASALKAN benar-benar non-recurring dan direkonsiliasi ke angka GAAP.", psak:"Non-GAAP", f:"'Beban restrukturisasi' yang muncul TIAP tahun = biaya operasional yang disamarkan. One-off yang berulang = oxymoron."},
  {l:"Pro forma", v:"'seolah'", v2:"—", d:"Angka 'seolah' akuisisi/divestasi terjadi 1 Januari — beda dengan adjusted. Pro forma menjawab 'bagaimana kalau…', adjusted menjawab 'tanpa gangguan…' — keduanya hipotesis, bukan fakta.", psak:"Non-GAAP", f:"Pro forma memakai asumsi sinergi yang sering terlalu manis. Cek asumsinya, bukan cuma hasilnya."},
  {l:"Tes analis #1: rekonsiliasi", v:"GAAP → non-GAAP", v2:"wajib ada", d:"Emiten wajib menunjukkan jembatan angka GAAP ke angka adjusted (di US diatur SEC Regulation G; di IDX sering hanya muncul di press release/siaran pers). Tanpa rekonsiliasi = klaim tanpa bukti.", psak:"SEC Reg G (US)", f:"Bandingkan definisi 'adjusted' antar tahun — definisi yang berubah-ubah = angka yang sedang diatur."},
  {l:"Tes analis #2: kas vs klaim", v:"108.000 vs 30.800", v2:"gap", d:"Adjusted EBITDA 108.000 (ilustratif) vs CFO aktual 30.800. Adjusted yang naik sementara arus kas datar = laba akrual, bukan kas. Selalu sandingkan klaim adjusted dengan arus kas operasi.", psak:"—", f:"Perusahaan bisa 'untung adjusted' bertahun-tahun sambil kasnya kering — di situlah distress bersembunyi."},
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
renderStmt("rev");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Akui pendapatan Rp20.000 lebih awal", q1:"EPS", q2:"Kualitas laba", a1:"naik", a2:"turun",
  e:"EPS naik instan, kualitas anjlok. Inilah premature recognition."},
 {t:"Jual aset, laba one-off 8.000", q1:"EPS", q2:"Continuing EPS", a1:"naik", a2:"tetap",
  e:"Headline naik, recurring tidak. Analis memisahkan keduanya."},
 {t:"Piutang naik 89%, penjualan 30%", q1:"Kolektibilitas", q2:"Kualitas pendapatan", a1:"turun", a2:"turun",
  e:"Pendapatan makin tidak tertagih. Waspada."},
 {t:"Buyback 10% saham beredar", q1:"EPS", q2:"Jumlah saham", a1:"naik", a2:"turun",
  e:"Pembagi menyusut → EPS naik. Bukan kinerja — aritmetika."},
 {t:"Stock split 2:1", q1:"EPS per saham", q2:"Total laba", a1:"turun", a2:"tetap",
  e:"Saham berlipat → EPS per saham turun setengah. Nilai perusahaan tidak berubah."},
 {t:"Hapusbuku piutang tak tertagih", q1:"EPS", q2:"Kualitas laba", a1:"turun", a2:"naik",
  e:"Laba turun sekali, tapi angka jadi jujur. Kualitas naik."},
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
    try{ localStorage.setItem("fsa_pg_m9", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"EPS dasar 2025", hint:"Laba bersih ÷ saham: 45.240 ÷ 100", ans:452.4, tol:0.5,
  why:"452,4 — headline. Tapi 62,4-nya one-off."},
 {q:"Continuing EPS", hint:"(45.240 − 8.000×0,78) ÷ 100", ans:390.0, dec:false, tol:0.5,
  why:"390,0 — laba berulang per saham. Ini yang dipakai valuasi."},
 {q:"Porsi one-off (%)", hint:"6.240 ÷ 45.240 × 100", ans:13.8, tol:0.3,
  why:"13,8% — hampir seperenam EPS = sekali lewat."},
 {q:"Payout ratio (%)", hint:"Dividen ÷ laba: 6.000 ÷ 45.240 × 100", ans:13.3, tol:0.3,
  why:"13,3% — kecil. Tapi dibayar dari utang (FCFE negatif)."},
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 452,4">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 452,4 atau 452.4)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Bonus berbasis EPS: selaras atau mengundang gaming? Tulis 3 baris.",
 credit:"Lensa kredit — Insentif EPS bisa mendorong manipulasi. Risiko apa untuk kreditur?",
 forensic:"Lensa forensik — 3 cara manajemen bisa 'memainkan' EPS tahun ini. Tulis."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m9_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m9_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"EPS dasar 2025?", o:["390,0","514,8","452,4","296,4"], a:2},
 {q:"Continuing EPS lebih rendah karena…", o:["Saham beredar bertambah sehingga EPS terencer", "Dividen yang dibagikan tahun ini lebih besar", "Mengeluarkan one-off jual aset 8.000", "Beban pajak tahun ini naik cukup besar"], a:2},
 {q:"Piutang +89% vs penjualan +30% → kualitas…", o:["Memburuk","Membaik","Normal saja","Pasti fraud"], a:0},
 {q:"EPS dilusian = EPS dasar karena…", o:["Stock split menambah jumlah saham", "Tak ada opsi/saham konversi", "Rugi membuat efek dilusi diabaikan", "Saham beredar sudah terlalu banyak"], a:1},
 {q:"Continuing EPS dipakai untuk…", o:["Dasar pembagian dividen","Mengganti opini audit","Menghitung pajak penghasilan","Valuasi laba berulang"], a:3},
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
           window.FSAMistake.log(9, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). <a href=\"../modul-10/\">Lanjut ke Modul 10 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m9","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m9") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m9") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m9") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 9 sudah kamu lewati sebelumnya. <a href=\"../modul-10/\">Lanjut ke Modul 10 →</a></p>";
  }
}catch(e){}
})();
