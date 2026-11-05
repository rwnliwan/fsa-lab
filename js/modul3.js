/* FSA Lab — Modul 3: Margin, Return & Common-Size (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
is:{ title:"Income Statement 2025 (Rp juta) — kolom % = common-size dari penjualan", cols:["Pos","2025","2024","%"],
 rows:[
  {l:"Penjualan", v:"520.000", v2:"400.000", pct:"100%", d:"Basis common-size: semua baris dibaca sebagai % dari penjualan.", psak:"—", f:"—"},
  {l:"Harga Pokok Penjualan (HPP)", v:"(338.000)", v2:"(264.000)", pct:"65,0%", d:"Turun dari 66,0% (2024) — efisiensi membaik 1 poin.", psak:"PSAK 202 (dulu 14)", f:"HPP common-size yang turun tiba-tiba = cek kapitalisasi biaya ke persediaan."},
  {l:"Laba kotor", v:"182.000", v2:"136.000", pct:"35,0%", d:"Gross margin 35,0% (2024: 34,0%).", psak:"—", f:"—"},
  {l:"Beban operasi", v:"(110.000)", v2:"(88.000)", pct:"21,2%", d:"2024: 22,0%. Skala ekonomi: beban tumbuh 25% < penjualan 30%.", psak:"—", f:"Beban operasi common-size yang turun = cek klasifikasi biaya."},
  {l:"Laba operasi", v:"72.000", v2:"48.000", pct:"13,8%", d:"Operating margin 13,8% (2024: 12,0%).", psak:"—", f:"—"},
  {l:"Beban bunga", v:"(14.000)", v2:"(10.000)", pct:"2,7%", d:"Coverage 5,14x.", psak:"—", f:"—"},
  {l:"Beban pajak", v:"(12.760)", v2:"(8.360)", pct:"2,5%", d:"Tarif efektif 22% konsisten.", psak:"PSAK 212 (dulu 46)", f:"—"},
  {l:"LABA BERSIH", v:"45.240", v2:"29.640", pct:"8,7%", d:"Net margin 8,7% (2024: 7,4%).", psak:"—", f:"Margin naik — tapi ingat Modul 2: laba akrual vs kas."}
 ]},
bs:{ title:"Balance Sheet & Return 2025 (Rp juta)", cols:["Pos","2025","2024"],
 rows:[
  {l:"Total aset", v:"451.440", v2:"378.200", d:"Basis BS common-size.", psak:"—", f:"—"},
  {l:"Ekuitas", v:"179.440", v2:"140.200", d:"39,7% dari aset.", psak:"—", f:"—"},
  {l:"Utang berbunga", v:"201.440", v2:"188.000", d:"Bank pendek 31.440 + panjang 110.000 + sewa 60.000.", psak:"—", f:"—"},
  {l:"Modal investasian (rata-rata)", v:"354.540", v2:"—", d:"(380.880 + 328.200)/2 = ekuitas + utang berbunga.", psak:"—", f:"—"},
  {l:"Perputaran aset", v:"1,25x", v2:"1,06x", d:"520.000/414.820. Setiap Rp1 aset menghasilkan Rp1,25 penjualan.", psak:"—", f:"—"},
  {l:"Leverage (A/E)", v:"2,60x", v2:"—", d:"414.820/159.820. Setiap Rp1 ekuitas menopang Rp2,60 aset.", psak:"—", f:"Leverage = pengungkit ROE sekaligus pengungkit risiko."},
  {l:"ROE", v:"28,3%", v2:"—", d:"DuPont: 8,7% × 1,25 × 2,60 = 28,3% ✓", psak:"—", f:"ROE tinggi dari leverage ≠ ROE dari operasi. Selalu urai DuPont."},
  {l:"ROA", v:"10,9%", v2:"—", d:"45.240/414.820 — return atas SELURUH aset.", psak:"—", f:"—"},
  {l:"ROIC", v:"15,8%", v2:"—", d:"NOPAT 56.160/354.540. Di atas WACC 12% = mencipta nilai.", psak:"—", f:"ROIC < WACC bertahun-tahun = bisnis menghancurkan nilai."}
 ]}
};

function fmtStmt(key){
  var s = STMTS[key], h = '<table class="stmt"><tr><th>'+s.cols[0]+'</th><th style="text-align:right">'+s.cols[1]+'</th><th style="text-align:right">'+s.cols[2]+'</th>';
  if(s.cols[3]) h += '<th style="text-align:right">'+s.cols[3]+'</th>';
  h += '</tr>';
  s.rows.forEach(function(r,i){
    h += '<tr class="clickable" data-stmt="'+key+'" data-i="'+i+'"><td>'+r.l+'</td><td class="val">'+r.v+'</td><td class="val" style="color:var(--ink-soft)">'+r.v2+'</td>';
    if(s.cols[3]) h += '<td class="val" style="color:var(--teal-deep)">'+(r.pct||"")+'</td>';
    h += '</tr>';
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
renderStmt("is");

/* ---------- PLAYGROUND: tebak arah rasio ---------- */
var CARDS = [
 {t:"Buyback saham Rp20.000 dengan kas", q1:"ROE", q2:"ROA", a1:"naik", a2:"naik",
  e:"Ekuitas −20.000 dan aset −20.000, laba tetap → kedua rasio naik. ROE naik TANPA perbaikan operasi — curigai setiap 'ROE naik'."},
 {t:"Ambil utang Rp100.000 untuk ekspansi, laba belum naik", q1:"ROE", q2:"ROA", a1:"tetap", a2:"turun",
  e:"Ekuitas & laba tetap → ROE tetap; aset +100.000 → ROA turun. Leverage naik duluan, return-nya belakangan (atau tidak pernah)."},
 {t:"HPP naik 5% tanpa bisa naikkan harga jual", q1:"Gross margin", q2:"Net margin", a1:"turun", a2:"turun",
  e:"Biaya naik, harga terkunci → margin terkompresi dua level. Inilah pricing power (atau tidak adanya)."},
 {t:"Jual aset menganggur Rp30.000 senilai buku (tanpa laba/rugi)", q1:"Perputaran aset", q2:"ROA", a1:"naik", a2:"naik",
  e:"Penjualan tetap, aset −30.000 → perputaran naik → ROA naik. Divestasi aset tidak produktif = return membaik tanpa cuan baru."},
 {t:"Tarif pajak efektif naik 22% → 28%", q1:"Net margin", q2:"ROE", a1:"turun", a2:"turun",
  e:"Pajak bukan operasi, tapi menggerus kedua rasio. Analis memakai NOPAT & tarif normalisasi agar tidak tertipu tahun pajak aneh."},
 {t:"Kapitalisasi beban Rp40.000 ala WorldCom", q1:"ROA", q2:"Laba operasi", a1:"naik", a2:"naik",
  e:"Beban hilang → laba naik; aset +40.000. ROA naik SEMU tahun ini — dan akan turun tahun-tahun berikut saat amortisasi jalan."}
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
    r.innerHTML = "Jawab kedua rasio dulu ("+n+"/2 terisi) — jawaban sebagian tidak dinilai.";
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
    try{ localStorage.setItem("fsa_pg_m3", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Gross margin 2025 (%)", hint:"Laba kotor ÷ penjualan: 182.000 ÷ 520.000 × 100", ans:35.0, dec:true, tol:0.3,
  why:"35,0% — naik dari 34,0%. HPP common-size turun 66%→65% = efisiensi."},
 {q:"ROE 2025 (%)", hint:"Laba bersih ÷ rata-rata ekuitas: 45.240 ÷ ((179.440+140.200)/2) × 100", ans:28.3, tol:0.5,
  why:"28,3% — tinggi, tapi ingat leverage 2,60x. Urai DuPont sebelum kagum."},
 {q:"ROA 2025 (%)", hint:"Laba bersih ÷ rata-rata total aset: 45.240 ÷ 414.820 × 100", ans:10.9, tol:0.3,
  why:"10,9% — return atas seluruh aset, tanpa bantuan leverage di pembilang."},
 {q:"ROIC 2025 (%)", hint:"NOPAT ÷ rata-rata modal investasian: 56.160 ÷ 354.540 × 100", ans:15.8, tol:0.5,
  why:"15,8% > WACC 12% = mencipta nilai. ROIC < WACC bertahun-tahun = hancurkan nilai."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 35,0">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 35,0 atau 35.0)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — ROE 28,3%, ROIC 15,8% > WACC 12%, harga saham +40% tahun ini. Layak beli? Tulis 3 baris: kualitas return, valuasi vs risiko, keputusanmu.",
 credit:"Lensa kredit — Leverage 2,60x, utang berbunga 201.440, coverage 5,14x. Apakah struktur modalnya aman untuk kreditur? Di mana batas bahayanya?",
 forensic:"Lensa forensik — ROE 28,3%: berapa banyak yang dari operasi vs dari leverage & akrual? Tulis 3 cek yang akan kamu lakukan sebelum percaya angka ini."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m3_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m3_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Gross margin naik 34% → 35% terutama karena…", o:["Penjualan naik sehingga margin ikut terdongkrak naik", "HPP turun dari 66% ke 65% dari penjualan", "Beban operasi turun menekan total biaya", "Beban pajak turun sehingga margin naik"], a:1},
 {q:"ROE 28,3% jauh di atas ROA 10,9%. Penyebab utama selisihnya…", o:["Margin sangat tinggi", "Perputaran aset sangat tinggi", "Leverage: aset 2,6x ekuitas", "Saldo kas yang sangat besar"], a:2},
 {q:"Buyback Rp20.000 dengan kas membuat ROE…", o:["Naik — tapi bukan dari kinerja operasi", "Turun karena kas berkurang Rp20.000 untuk buyback", "Tetap karena laba bersih tidak berubah", "Naik karena perusahaan makin efisien mengelola modal"], a:0},
 {q:"ROIC 15,8% vs WACC 12% artinya perusahaan…", o:["Menghancurkan nilai", "Menciptakan nilai", "Tidak mencipta nilai", "Keduanya tak berkaitan"], a:1},
 {q:"Common-size analysis paling berguna untuk…", o:["Melihat struktur biaya antar periode / antar perusahaan", "Menghitung saldo kas akhir tiap periode", "Memprediksi pergerakan harga saham", "Menggantikan seluruh prosedur audit atas laporan keuangan"], a:0}
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
           window.FSAMistake.log(3, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Modul 4 segera hadir — progresmu tersimpan.</p>";
    try{ localStorage.setItem("fsa_gate_m3","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m3") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m3") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m3") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 3 sudah kamu lewati sebelumnya. Modul 4 segera hadir.</p>";
  }
}catch(e){}
})();
