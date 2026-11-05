/* FSA Lab — Modul 20: Aset Tak Berwujud & Goodwill (akuisisi ilustratif PT Delta Ritel, Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
acq:{ title:"Bedah akuisisi PT Delta Ritel — ilustratif (Rp juta)", cols:["Pos","Nilai","Catatan"],
 rows:[
  {l:"Harga akuisisi (kas)", v:"60.000", v2:"yang dibayar", d:"100% saham PT Delta Ritel dibeli tunai.", psak:"—", f:"Harga vs valuasi independen — premi berapa persen?"},
  {l:"Aset teridentifikasi", v:"75.000", v2:"nilai wajar", d:"Termasuk merek 8.000 + daftar pelanggan 4.000 — aset takberwujud yang BISA diidentifikasi.", psak:"PSAK 238 (dulu 19)", f:"Aset takberwujud 'teridentifikasi' yang nilainya ditebak = goodwill terselubung."},
  {l:"Liabilitas teridentifikasi", v:"(35.000)", v2:"nilai wajar", d:"Utang & kewajiban Delta yang ikut dibeli.", psak:"—", f:"Liabilitas yang 'lupa' diidentifikasi = goodwill kegedean."},
  {l:"Aset neto teridentifikasi", v:"40.000", v2:"75.000 − 35.000", d:"Nilai wajar bersih yang benar-benar bisa ditunjuk.", psak:"—", f:"—"},
  {l:"Goodwill", v:"20.000", v2:"60.000 − 40.000", d:"Premi di atas nilai wajar — sinergi, merek tak terpisah, dan harapan. BUKAN aset yang bisa dijual sendiri.", psak:"PSAK 103 (dulu 22)", f:"Goodwill = selisih harapan vs kenyataan. Menolak impairment = bom waktu."}
 ]},
rule:{ title:"Amortisasi vs impairment — dua nasib berbeda", cols:["Aturan","Umur terbatas","Goodwill"],
 rows:[
  {l:"Contoh", v:"Merek 8.000 (8 thn)", v2:"Goodwill 20.000", d:"Daftar pelanggan 4.000 (4 thn) ikut kelompok umur terbatas.", psak:"PSAK 238 (dulu 19)", f:"—"},
  {l:"Beban tahunan", v:"2.000 amortisasi", v2:"0 — tidak diamortisasi", d:"8.000/8 + 4.000/4 = 2.000 per tahun. Goodwill TIDAK pernah diamortisasi.", psak:"PSAK 238 (dulu 19)", f:"Perusahaan yang 'lupa' mengamortisasi = laba digelembungkan."},
  {l:"Uji penurunan nilai", v:"Bila ada indikasi", v2:"Wajib tiap tahun", d:"Goodwill + intangible umur tak terbatas diuji impairment minimal setahun sekali, tanpa menunggu indikasi.", psak:"PSAK 236 (dulu 48)", f:"Asumsi nilai pakai (discount rate, proyeksi) = tempat manipulasi."},
  {l:"Reversal", v:"Boleh (non-goodwill)", v2:"Dilarang", d:"PSAK membolehkan pembalikan impairment selain goodwill; US GAAP melarang semua reversal.", psak:"PSAK 236 (dulu 48)", f:"Reversal besar = cek apakah pemulihan beneran atau manajemen laba."},
  {l:"Lensa kredit", v:"Aset bernilai ekonomi", v2:"Dianggap NOL", d:"Kreditur mencoret goodwill dari tangible net worth — tak ada nilainya saat likuidasi.", psak:"—", f:"Goodwill > 30% ekuitas = neraca rapuh di mata kreditur."}
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
renderStmt("acq");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Akuisisi Rp60.000, aset neto teridentifikasi Rp40.000 → goodwill Rp20.000", q1:"ROIC (aset naik, laba belum)", q2:"Risiko impairment masa depan", a1:"turun", a2:"naik",
  e:"Denominator ROIC membengkak Rp20.000 tanpa laba tambahan → ROIC turun. Goodwill besar = janji yang harus dibuktikan tiap tahun."},
 {t:"Rugi impairment goodwill Rp8.000 diakui tahun ini", q1:"Laba bersih", q2:"Arus kas operasi", a1:"turun", a2:"tetap",
  e:"Impairment non-kas: laba turun Rp8.000, kas tak bergerak. Analis memisahkannya — tapi impairment = pengakuan overpay masa lalu."},
 {t:"Daftar pelanggan selesai diamortisasi (masuk tahun ke-5)", q1:"Beban amortisasi tahun ke-5", q2:"Laba tahun ke-5", a1:"turun", a2:"naik",
  e:"Beban Rp1.000 hilang → laba naik Rp1.000 tanpa perbaikan bisnis apa pun. Jangan terkecoh 'pertumbuhan' semu."},
 {t:"Nilai terpulihkan jatuh, manajemen menunda impairment 2 tahun", q1:"Red flag forensik", q2:"Kualitas neraca", a1:"naik", a2:"turun",
  e:"Menolak impairment = fraud by omission. Cek discount rate & proyeksi nilai pakai mereka — di sanalah manipulasi bersembunyi."},
 {t:"Big bath: impairment jumbo Rp15.000 di tahun buruk", q1:"Laba tahun ini", q2:"Basis laba tahun depan", a1:"turun", a2:"naik",
  e:"Tahun ini sekalian 'mandi besar' → basis aset lebih rendah → laba tahun depan terlihat melesat. Earnings management klasik."},
 {t:"Biaya development Rp6.000 dikapitalisasi (PSAK 238)", q1:"Total aset", q2:"Laba tahun berjalan vs bila dibebankan", a1:"naik", a2:"naik",
  e:"Kapitalisasi menaikkan aset & laba hari ini, bebannya dicicil via amortisasi. 6 kriteria harus terpenuhi — ini area judgment paling empuk."}
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
    try{ localStorage.setItem("fsa_pg_m20", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Goodwill akuisisi PT Delta Ritel (Rp juta)", hint:"Harga 60.000 − aset neto teridentifikasi 40.000", ans:20000, dec:false, tol:100,
  why:"20.000 — premi yang dibayar di atas nilai wajar. Inilah 'harapan' yang masuk neraca."},
 {q:"Amortisasi tahunan intangibles (Rp juta)", hint:"Merek 8.000/8 + daftar pelanggan 4.000/4", ans:2000, dec:false, tol:50,
  why:"2.000/tahun — 1.000 merek + 1.000 daftar pelanggan. Goodwill TIDAK ikut diamortisasi."},
 {q:"Rugi impairment UPK (Rp juta)", hint:"Carrying 50.000 − recoverable 42.000", ans:8000, dec:false, tol:100,
  why:"8.000 — dialokasikan dulu ke goodwill (20.000 → 12.000), sisanya ke aset lain."},
 {q:"Goodwill ÷ ekuitas 2025 (%)", hint:"20.000 ÷ 179.440 × 100", ans:11.1, tol:0.3,
  why:"11,1% — masih moderat. Di atas 30% = neraca rapuh di mata kreditur."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 20000">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 20000)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Goodwill Rp20.000 dari akuisisi Rp60.000. Hitung ROIC dengan & tanpa goodwill. Cerita mana yang kamu percaya, dan berapa lama kamu kasih waktu ke manajemen membuktikan sinerginya?",
 credit:"Lensa kredit — Goodwill Rp20.000, ekuitas Rp179.440. Berapa tangible net worth-nya? Beranikah kamu menulis covenant berbasis ekuitas penuh?",
 forensic:"Lensa forensik — Nilai terpulihkan UPK jatuh ke Rp42.000 tapi manajemen menunda impairment 2 tahun. Tulis 3 cek atas asumsi nilai pakai mereka (discount rate, proyeksi, pembanding)."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m20_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m20_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Goodwill muncul ketika…", o:["Total aset perusahaan bertambah karena revaluasi aset tetap","Perusahaan mencetak rugi bersih tahun berjalan","Harga akuisisi > nilai wajar aset neto teridentifikasi","Kapitalisasi pasar melebihi nilai buku ekuitas perusahaan"], a:2},
 {q:"Apakah goodwill diamortisasi?", o:["Tidak — diuji impairment minimal setahun sekali","Ya — diamortisasi selama 10 tahun","Ya — diamortisasi selama 20 tahun","Hanya diuji impairment saat perusahaan dijual ke pihak ketiga"], a:0},
 {q:"Merek dagang dengan umur manfaat 8 tahun…", o:["Tidak diamortisasi — hanya impairment","Hanya diuji impairment tahunan","Dibebankan penuh sekaligus tahun ini","Diamortisasi selama 8 tahun"], a:3},
 {q:"Rugi impairment goodwill yang sudah diakui…", o:["Bisa dibalik bila nilai wajarnya pulih di periode berikut","Tidak bisa dibalik — di PSAK maupun US GAAP","Bisa dibalik hanya di bawah US GAAP","Wajib dibalik dalam dua tahun buku"], a:1},
 {q:"Kreditur menilai goodwill Rp20.000 di neraca sebagai…", o:["Aset likuid yang mudah dicairkan","Dikurangkan dari tangible net worth","Setara kas untuk covenant","Jaminan utama pinjaman bila gagal bayar"], a:1}
];
(function(){
  var h = "";
  QUIZ.forEach(function(q,i){
    h += '<div class="quiz-q" id="qq'+i+'"><h3>'+(i+1)+'. '+q.q+'</h3>';
    q.o.forEach(function(o,j){
      h += '<label><input type="radio" name="q'+i+'" value="'+j+'"> '+o+'</label>';
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
           window.FSAMistake.log(20, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓ — Modul 20 Tuntas!</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu bisa membedakan harga, nilai, dan harapan di neraca. <a href=\"../modul-21/\">Lanjut ke Modul 21 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m20","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m20") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m20") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m20") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 20 sudah kamu lewati sebelumnya — goodwill bukan lagi sulap! <a href=\"../modul-21/\">Lanjut ke Modul 21 →</a></p>";
  }
}catch(e){}
})();
