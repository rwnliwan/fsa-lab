/* FSA Lab — Modul 15: Model Kredit Altman Z-Score (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
comp:{ title:"5 komponen Z′-Score 2025 (Rp juta) — bobot model Z′ untuk perusahaan privat", cols:["Komponen","Nilai","Bobot"],
 rows:[
  {l:"X1 — Modal kerja / total aset", v:"0,26", v2:"0,717×", d:"119.440 ÷ 451.440 = 0,26. Likuiditas jangka pendek.", psak:"—", f:"X1 rendah + X4 rendah = perusahaan kehabisan napas dua sisi."},
  {l:"X2 — Laba ditahan / total aset", v:"0,18", v2:"0,847×", d:"79.440 ÷ 451.440 = 0,18. Umur & profitabilitas kumulatif.", psak:"—", f:"X2 rendah = perusahaan muda atau riwayat rugi — waspadai dividen besar yang menggerus X2."},
  {l:"X3 — EBIT / total aset", v:"0,16", v2:"3,107×", d:"72.000 ÷ 451.440 = 0,16. Produktivitas aset; bobot TERBESAR (bobot Z′, bukan bobot Z klasik).", psak:"—", f:"X3 paling sensitif dimanipulasi via kapitalisasi beban — cek vs arus kas."},
  {l:"X4 — Ekuitas / liabilitas", v:"0,66", v2:"0,420×", d:"179.440 ÷ 272.000 = 0,66. Bantalan modal terhadap utang.", psak:"—", f:"X4 turun tajam = leverage naik; cek off-balance-sheet."},
  {l:"X5 — Penjualan / total aset", v:"1,15", v2:"0,998×", d:"520.000 ÷ 451.440 = 1,15. Perputaran aset = asset turnover.", psak:"—", f:"X5 bisa dipompa via channel stuffing — cek DSO."}
 ]},
zone:{ title:"Zona Altman Z′-Score (varian perusahaan privat)", cols:["Zona","Batas","Arti"],
 rows:[
  {l:"Z′-Score Cemerlang", v:"2,26", v2:"Grey zone", d:"0,717×0,26 + 0,847×0,18 + 3,107×0,16 + 0,420×0,66 + 0,998×1,15 = 2,26. Varian Z′ = yang tepat untuk perusahaan tidak tercatat di bursa.", psak:"—", f:"Skor dihitung dari angka akuntansi — kualitas input menentukan kualitas skor."},
  {l:"Zona aman", v:"> 2,90", v2:"Risiko distress rendah", d:"Perusahaan dengan Z′ di atas 2,90 jarang gagal bayar dalam 2 tahun.", psak:"—", f:"Aman menurut model ≠ aman selamanya; model dilatih di data manufaktur AS."},
  {l:"Grey zone", v:"1,23–2,90", v2:"Waspada — Cemerlang di sini", d:"Zona abu-abu: tidak bisa disimpulkan; butuh analisis lanjutan.", psak:"—", f:"Grey zone = alasan menggali, bukan alasan panik."},
  {l:"Zona distress", v:"< 1,23", v2:"Risiko gagal bayar tinggi", d:"Di bawah 1,23 = probabilitas distress tinggi menurut model.", psak:"—", f:"Distress prediksi ≠ vonis; cek likuiditas aktual & jadwal utang."},
  {l:"Hibrida ilustratif (bukan model resmi)", v:"2,64", v2:"Hanya perbandingan", d:"1,2×0,26 + 1,4×0,18 + 3,3×0,16 + 0,6×0,66 + 1,0×1,15 = 2,64 — bobot Z klasik × X4 ekuitas buku. Klasik aslinya memakai market value; jangan pakai angka ini sebagai vonis.", psak:"—", f:"Forensik: angka yang 'kelihatan resmi' tapi bukan model terpublikasi = jebakan presisi palsu."}
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
renderStmt("comp");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Laba ditahan naik Rp20.000", q1:"X2", q2:"Z-Score", a1:"naik", a2:"naik",
  e:"Laba ditahan naik → X2 naik → Z naik. Perusahaan menua dengan sehat."},
 {t:"Tambah utang bank Rp50.000", q1:"X4", q2:"Z-Score", a1:"turun", a2:"turun",
  e:"Liabilitas naik, ekuitas tetap → X4 turun → Z turun. Leverage menekan skor."},
 {t:"Rugi operasi Rp30.000", q1:"X3", q2:"Z-Score", a1:"turun", a2:"turun",
  e:"EBIT turun → X3 (bobot Z′ 3,107×!) turun → Z turun tajam. Komponen berbobot terbesar paling sensitif."},
 {t:"Efisiensi aset naik (penjualan +10%, aset tetap)", q1:"X5", q2:"Z-Score", a1:"naik", a2:"naik",
  e:"Penjualan naik → X5 naik → Z naik. Perputaran aset memperbaiki skor."},
 {t:"Rights issue Rp50.000 tunai", q1:"X4", q2:"Z-Score", a1:"naik", a2:"naik",
  e:"Ekuitas & kas naik → X4 naik → Z naik. Suntikan modal memperbaiki bantalan."},
 {t:"Dividen besar Rp25.000 tunai", q1:"X2", q2:"Z-Score", a1:"turun", a2:"turun",
  e:"Laba ditahan & kas turun → X2 turun → Z turun. Dividen menggerus cadangan."}
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
    try{ localStorage.setItem("fsa_pg_m15", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Z′-Score 2025 (varian privat)", hint:"0,717×0,26 + 0,847×0,18 + 3,107×0,16 + 0,420×0,66 + 0,998×1,15", ans:2.26, tol:0.05,
  why:"2,26 — grey zone Z′ (1,23–2,90). Belum distress, tapi tidak aman. Z′ = varian yang tepat untuk perusahaan tidak tercatat."},
 {q:"X3 — EBIT / total aset", hint:"Laba operasi ÷ total aset: 72.000 ÷ 451.440", ans:0.16, tol:0.01,
  why:"0,16 — komponen berbobot terbesar (3,107×, bobot Z′)."},
 {q:"X5 — penjualan / total aset", hint:"Penjualan ÷ total aset: 520.000 ÷ 451.440", ans:1.15, tol:0.02,
  why:"1,15 — sama dengan asset turnover dari Modul 3."},
 {q:"Interest coverage 2025 (x)", hint:"Laba operasi ÷ beban bunga: 72.000 ÷ 14.000", ans:5.14, tol:0.1,
  why:"5,14x — pelengkap Z: kemampuan bayar bunga masih kuat."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 2,64">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 2,64 atau 2.64)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Z′ 2,26 grey zone, ROE 28,3%. Apakah return-nya sepadan dengan risiko distress? Tulis 3 baris.",
 credit:"Lensa kredit — Rating internal: layak investment grade, watchlist, atau tolak? Covenant apa yang kamu syaratkan?",
 forensic:"Lensa forensik — Z-Score bisa dimanipulasi via akuntansi (X2, X3). Tulis 3 cek sebelum percaya skor 2,26 ini."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m15_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m15_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Z′-Score Cemerlang 2,26 berarti…", o:["Distress","Bangkrut","Aman","Grey zone"], a:3},
 {q:"Komponen dengan bobot terbesar dalam Z′-Score…", o:["X1 (0,717×)","X4 (0,420×)","X3 (3,107×)","X5 (0,998×)"], a:2},
 {q:"Z′-Score di bawah 1,23 berarti…", o:["Grey", "Tidak valid", "Aman", "Distress"], a:3},
 {q:"Kelemahan utama Altman Z-Score…", o:["Hanya berlaku untuk bank","Modelnya terlalu baru","Bisa dimanipulasi via akuntansi","Bergantung pada asumsi distribusi normal"], a:2},
 {q:"Covenant kredit yang tipikal…", o:["D/E maksimum & coverage minimum","Dividen wajib naik tiap tahun","Tidak ada covenant sama sekali","Laporan keuangan diaudit tiap kuartal"], a:0}
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
           window.FSAMistake.log(15, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). <a href=\"../modul-16/\">Lanjut ke Modul 16 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m15","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m15") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m15") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m15") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 15 sudah kamu lewati sebelumnya. <a href=\"../modul-16/\">Lanjut ke Modul 16 →</a></p>";
  }
}catch(e){}
})();
