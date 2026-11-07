/* FSA Lab — Modul 6: Free Cash Flow (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
fc:{ title:"Jembatan kas bebas 2025 (Rp juta)", cols:["Pos","2025","2024"],
 rows:[
  {l:"Arus kas operasi (CFO)", v:"30.800", v2:"44.000", d:"Titik awal — SUDAH setelah bunga dibayar (PSAK 207 menaruh bunga di operasi).", psak:"PSAK 207 (dulu 2)", f:"—"},
  {l:"Bunga setelah pajak", v:"10.920", v2:"7.800", d:"14.000 × (1−22%) = 10.920. Ditambahkan kembali — FCFF dihitung SEBELUM bunga.", psak:"—", f:"Lupa menambahkan bunga kembali = double-count saat menghitung FCFE. Kesalahan klasik."},
  {l:"Belanja modal (capex)", v:"(48.000)", v2:"(40.000)", d:"Investasi aset tetap — wajib dibayar sebelum bicara 'bebas'.", psak:"—", f:"Capex yang dikapitalisasi berlebihan = laba semu (ingat WorldCom)."},
  {l:"FCFF", v:"(6.280)", v2:"11.800", d:"30.800 + 10.920 − 48.000. Kas bebas untuk SEMUA penyandang dana (sebelum bunga).", psak:"—", f:"FCFF negatif saat ekspansi = wajar; FCFF negatif saat stagnan = bahaya."},
  {l:"Bunga setelah pajak", v:"(10.920)", v2:"(7.800)", d:"14.000 × (1−22%). Bagian kreditur — dikurangkan untuk sampai ke FCFE.", psak:"—", f:"—"},
  {l:"Utang neto", v:"11.440", v2:"0", d:"Tambah utang − bayar utang.", psak:"—", f:"—"},
  {l:"FCFE", v:"(5.760)", v2:"4.000", d:"−6.280 − 10.920 + 11.440. Kas bebas untuk PEMEGANG SAHAM.", psak:"—", f:"FCFE 2025 negatif = dividen dibayar dari utang. 2024 positif 4.000 — bukan dua tahun struktural."},
  {l:"Dividen dibayar", v:"(6.000)", v2:"(5.000)", d:"Dibayar saat FCFE −5.760 = dari kantong utang.", psak:"—", f:"Dividen > FCFE = tidak sustainable."}
 ]},
use:{ title:"Ke mana perginya kas 2025 (Rp juta)", cols:["Pos","2025","% CFO"],
 rows:[
  {l:"CFO masuk", v:"30.800", v2:"100%", d:"Kas dari operasi.", psak:"—", f:"—"},
  {l:"Capex", v:"(48.000)", v2:"−156%", d:"156% dari CFO — ekspansi menelan semua kas operasi.", psak:"—", f:"Capex intensity 9,2% dari penjualan."},
  {l:"Dividen", v:"(6.000)", v2:"−19%", d:"Dibayar dari utang, bukan dari kas bebas.", psak:"—", f:"—"},
  {l:"Utang neto menutup", v:"11.440", v2:"+37%", d:"Lubang kas ditutup dengan tambah utang.", psak:"—", f:"Pola: operasi − investasi − dividen + utang = gali lubang tutup lubang."},
  {l:"Perubahan kas", v:"(11.760)", v2:"−38%", d:"30.800 − 48.000 − 6.000 + 11.440 ✓", psak:"—", f:"—"}
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
renderStmt("fc");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Capex dipangkas 50% tahun depan", q1:"FCFF", q2:"Pertumbuhan", a1:"naik", a2:"turun",
  e:"FCFF naik instan — tapi pertumbuhan dikorbankan. Analis curiga pada FCFF yang naik karena capex dipotong."},
 {t:"Dividen dinaikkan 50%", q1:"FCFE", q2:"Kas", a1:"turun", a2:"turun",
  e:"Dividen bukan pengurang FCFE (sudah dihitung), tapi kas keluar → fleksibilitas turun. Dividen > FCFE = makan tabungan."},
 {t:"Suku bunga naik, beban bunga +40%", q1:"FCFF", q2:"FCFE", a1:"tetap", a2:"turun",
  e:"FCFF dihitung SEBELUM bunga → tetap. FCFE menanggung bunga penuh → turun. Inilah kenapa valuasi pakai FCFF."},
 {t:"Modal kerja membaik Rp20.000", q1:"CFO", q2:"FCFF", a1:"naik", a2:"naik",
  e:"Kas terlepas dari piutang/stok → CFO naik → FCFF naik. Perbaikan operasi = kas bebas beneran."},
 {t:"Buyback saham Rp20.000", q1:"FCFE", q2:"D/E ratio", a1:"tetap", a2:"naik",
  e:"Buyback DIBAYAR dari FCFE, bukan menguranginya. Ekuitas turun → D/E naik."},
 {t:"Jual anak perusahaan Rp60.000 (sekali)", q1:"FCFF", q2:"Kualitas FCFF", a1:"naik", a2:"turun",
  e:"Kas masuk → FCFF naik. Tapi ini one-off — analis memisahkan FCFF recurring vs non-recurring."}
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
    try{ localStorage.setItem("fsa_pg_m6", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"FCFF 2025 (Rp juta)", hint:"CFO + bunga(1−pajak) − capex: 30.800 + 10.920 − 48.000", ans:-6280, dec:false, tol:100,
  why:"−6.280 — kas bebas sebelum bunga; ekspansi menelan kas operasi."},
 {q:"FCFE 2025 (Rp juta)", hint:"FCFF − bunga(1−pajak) + utang neto: −6.280 − 10.920 + 11.440", ans:-5760, dec:false, tol:100,
  why:"−5.760 — untuk pemegang saham tidak tersisa kas; dividen 6.000 dibayar dari utang."},
 {q:"FCFF margin 2025 (%)", hint:"FCFF ÷ penjualan × 100: −6.280 ÷ 520.000 × 100", ans:-1.2, tol:0.3,
  why:"−1,2% — tiap Rp100 penjualan, kas bebas MINUS Rp1,2."},
 {q:"Capex intensity 2025 (%)", hint:"Capex ÷ penjualan × 100: 48.000 ÷ 520.000 × 100", ans:9.2, tol:0.3,
  why:"9,2% — intensitas investasi tinggi. Wajar untuk ekspansi, bahaya bila stagnan."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: -6280">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (boleh negatif, contoh: -6280)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — FCFF −6.280, FCFE −5.760, tapi laba +53%. Apakah ini growth story atau value trap? Tulis 3 baris.",
 credit:"Lensa kredit — Dividen naik 50% saat FCFE negatif dan utang neto +11.440. Setujui? Covenant apa yang kamu pasang?",
 forensic:"Lensa forensik — FCFF 2025 negatif (6.280) setelah +11.800 di 2024 + dividen dari utang + capex 156% dari CFO. Tulis 3 cek sebelum percaya narasi 'ekspansi'."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m6_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m6_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"FCFF dihitung sebagai…", o:["CFO + bunga(1−pajak) − capex", "CFO + depresiasi − capex", "Laba bersih + depresiasi − ΔWC", "Laba bersih + bunga − capex"], a:0},
 {q:"FCFF negatif artinya…", o:["Perusahaan pasti bangkrut dalam waktu dekat", "Laba bersih perusahaan pasti negatif juga", "Kas keluar > kas masuk — cek kenapa: ekspansi atau boros", "Dividen wajib dipangkas karena kas perusahaan habis total"], a:2},
 {q:"Bedanya FCFE dan FCFF…", o:["Tidak ada bedanya, keduanya sama persis", "FCFF adalah kas bebas yang menjadi hak pemegang saham", "FCFE dihitung sebelum capex dikurangkan dari CFO", "FCFE setelah bunga & utang — untuk pemegang saham"], a:3},
 {q:"FCFF naik karena capex dipotong setengah = …", o:["Kualitas kas murni membaik", "Waspada — pertumbuhan dikorbankan", "Kenaikan FCFF-nya pasti sustainable", "Efisiensi operasi yang membaik secara struktural"], a:1},
 {q:"Dividen > FCFE bertahun-tahun = …", o:["Praktik dividen yang sustainable", "Tidak sustainable — dibayar dari utang/tabungan", "Perusahaan wajib menaikkan dividennya setiap tahun", "Menguntungkan posisi para kreditur karena kas keluar"], a:1}
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
           window.FSAMistake.log(6, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓ — Phase 1 Tuntas!</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu sudah kuasai mekanik inti. <a href=\"../modul-7/\">Lanjut ke Modul 7 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m6","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m6") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m6") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m6") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 6 sudah kamu lewati sebelumnya — Phase 1 tuntas! <a href=\"../modul-7/\">Lanjut ke Modul 7 →</a></p>";
  }
}catch(e){}
})();
