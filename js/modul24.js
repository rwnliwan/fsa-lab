/* FSA Lab — Modul 24: Multiples (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
mult:{ title:"Multiples 2025 — harga saham ilustratif Rp5.600/lembar, 100 jt saham", cols:["Ukuran","Cemerlang","Peer median"],
 rows:[
  {l:"Harga saham (ilustratif)", v:"5.600", v2:"—", d:"Satu-satunya input yang datang dari PASAR, bukan dari laporan. Multiple = harga ÷ fundamental.", psak:"—", f:"Harga = ekspektasi kolektif. Multiple menjawab: seberapa mahal ekspektasi itu?"},
  {l:"Kapitalisasi pasar", v:"560.000", v2:"—", d:"5.600 × 100 juta saham = Rp560.000 jt. Nilai pasar EKUITAS saja — belum termasuk utang.", psak:"—", f:"Market cap ≠ nilai perusahaan. Lupa utang = lupa separuh harga beli akuisisi."},
  {l:"P/E", v:"12,4x", v2:"14,0x", d:"5.600 ÷ 452,4 (EPS 2025). Investor membayar 12,4 tahun laba untuk tiap Rp1 laba. Di bawah peer 14,0x — murah atau murahan?", psak:"—", f:"P/E murah + E yang digelembungkan = value trap. Cek kualitas E dulu (M2: akrual 14.440)."},
  {l:"EV (enterprise value)", v:"740.000", v2:"—", d:"560.000 + utang bersih 180.000. Nilai SELURUH perusahaan — harga yang dibayar pembeli akuisisi.", psak:"—", f:"—"},
  {l:"EV/EBITDA", v:"7,3x", v2:"8,0x", d:"740.000 ÷ 102.000. Sebelum bunga, pajak, depresiasi — netral terhadap struktur modal & kebijakan depresiasi.", psak:"—", f:"EBITDA mengabaikan capex — untuk bisnis padat modal, EV/EBITDA 'murah' bisa menipu."},
  {l:"P/B", v:"3,1x", v2:"2,5x", d:"5.600 ÷ 1.794,4 (nilai buku/lembar = 179.440 ÷ 100). Di atas peer — pasar membayar premi atas ROE 28,3%.", psak:"—", f:"Nilai buku bisa usang (cost historis) atau digelembungkan revaluasi (PSAK 216). Premi hanya wajar bila ROE sustainable."},
  {l:"PEG", v:"0,68x", v2:"0,90x", d:"12,4 ÷ 18,1. P/E dibagi pertumbuhan EPS 2026F (534,5 vs 452,4). Di bawah 1 = murah relatif terhadap pertumbuhan.", psak:"—", f:"PEG memakai FORECAST — sampah masuk, sampah keluar. Tanya: pertumbuhan 18,1% datang dari mana?"}
 ]},
trap:{ title:"Jebakan multiples — angka yang sama, kesimpulan yang salah", cols:["Jebakan","Angka","Pelajaran"],
 rows:[
  {l:"E negatif", v:"n.m.", v2:"—", d:"P/E perusahaan rugi = tidak bermakna (negatif/tak hingga). Jangan dipaksa — pakai EV/penjualan atau normalisasi laba.", psak:"—", f:"'P/E murah' dari E negatif adalah jebakan paling memalukan di ruang interview."},
  {l:"One-off dalam E", v:"14,4x vs 12,4x", v2:"—", d:"Laba jual aset 8.000 (sebelum pajak) → continuing EPS 390,0 → P/E continuing 14,4x, bukan 12,4x. Headline menipu 2 poin.", psak:"—", f:"Selalu hitung multiple dari continuing earnings (M11: normalisasi)."},
  {l:"Beda framework", v:"15,6x vs 12,4x", v2:"—", d:"Versi US GAAP (LIFO): NI 35.880 → EPS 358,8 → P/E 15,6x. Perusahaan SAMA, P/E beda 3,2 poin — hanya karena metode persediaan.", psak:"PSAK 202 = FIFO/rata-rata; US GAAP boleh LIFO", f:"Bandingkan multiple lintas framework tanpa normalisasi = bandingkan apel vs jeruk (lihat Toggle)."},
  {l:"Buyback mengecilkan pembagi", v:"EPS naik, laba tetap", v2:"—", d:"Buyback 10% saham → saham beredar menyusut → EPS naik ~11% → P/E turun. Laba total TETAP — multiple 'membaik' tanpa perbaikan bisnis.", psak:"—", f:"Cek: EPS naik karena laba tumbuh, atau karena pembaginya menyusut?"},
  {l:"P/B & revaluasi", v:"turun tanpa sebab bisnis", v2:"—", d:"Revaluasi tanah +50.000 (PSAK 216) menaikkan nilai buku → P/B turun dan terlihat 'murah' di kertas. Bisnisnya tidak berubah.", psak:"PSAK 216 (dulu 16)", f:"Tanya: siapa penilainya, kenapa sekarang?"}
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
renderStmt("mult");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Laba bersih −20%, harga saham tetap", q1:"P/E", q2:"Daya tarik valuasi", a1:"naik", a2:"turun",
  e:"P/E = P ÷ E. E turun 20% → P/E naik 25% → terlihat mahal. Kecuali pasar sudah antisipasi (harga biasanya jatuh duluan)."},
 {t:"Harga saham −30%, fundamental tetap", q1:"P/E", q2:"Risiko value trap", a1:"turun", a2:"naik",
  e:"P/E turun 30% = terlihat murah. Tapi tanya KENAPA harga jatuh: multiple murah + bisnis memburuk = value trap, bukan diskon."},
 {t:"Buyback 10% saham pakai kas", q1:"EPS", q2:"P/E", a1:"naik", a2:"turun",
  e:"Saham beredar −10% → EPS +11% → P/E turun. Laba total TETAP — multiple 'membaik' tanpa perbaikan bisnis apa pun."},
 {t:"EBITDA tetap, utang naik Rp100.000 (akuisisi)", q1:"EV", q2:"EV/EBITDA", a1:"naik", a2:"naik",
  e:"EV = market cap + utang bersih. Utang +100.000 → EV +100.000 → EV/EBITDA naik. Leverage menaikkan multiple walau operasi tetap."},
 {t:"Revaluasi tanah +Rp50.000 (PSAK 216)", q1:"Nilai buku/lembar", q2:"P/B", a1:"naik", a2:"turun",
  e:"Ekuitas +50.000 → nilai buku/lembar naik → P/B turun. Terlihat 'murah' — padahal bisnis tidak berubah. Jebakan P/B klasik emiten properti."},
 {t:"Disajikan versi US GAAP: LIFO reserve Rp12.000", q1:"Laba (E)", q2:"P/E", a1:"turun", a2:"naik",
  e:"NI 45.240 → 35.880 → EPS 358,8 → P/E 12,4x → 15,6x. Perusahaan sama, multiple beda — normalisasi dulu sebelum bandingkan lintas framework."}
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
    try{ localStorage.setItem("fsa_pg_m24", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"P/E 2025 (x)", hint:"Harga 5.600 ÷ EPS 452,4", ans:12.4, tol:0.3,
  why:"12,4x — di bawah peer 14,0x. Murah? Cek dulu kualitas E: akrual 14.440 dan one-off 8.000."},
 {q:"EV/EBITDA 2025 (x)", hint:"EV 740.000 ÷ EBITDA 102.000 — EV = 560.000 + utang bersih 180.000", ans:7.3, tol:0.2,
  why:"7,3x — netral terhadap struktur modal. Bandingkan hanya dengan peer se-industri & se-framework."},
 {q:"P/B 2025 (x)", hint:"5.600 ÷ 1.794,4 — nilai buku/lembar = 179.440 ÷ 100", ans:3.1, tol:0.2,
  why:"3,1x — pasar membayar premi atas ROE 28,3%. Premi hanya wajar bila ROE-nya sustainable."},
 {q:"PEG (x)", hint:"P/E 12,4 ÷ pertumbuhan EPS 18,1% (EPS 2026F 534,5 vs 452,4)", ans:0.68, tol:0.05,
  why:"0,68x < 1 — murah relatif terhadap pertumbuhan forecast. Tapi forecast = asumsi, bukan fakta."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 12,4">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 12,4)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — P/E 12,4x di bawah peer 14,0x, PEG 0,68x. Diskon atau value trap? Tulis 3 baris: kualitas E, pertumbuhan, keputusanmu.",
 credit:"Lensa kredit — EV/EBITDA 7,3x, utang bersih 180.000. Berapa debt capacity yang tersisa? Tulis 3 baris: leverage, coverage, kesimpulanmu.",
 forensic:"Lensa forensik — Multiple murah bisa direkayasa: E digelembungkan, buyback, revaluasi. Tulis 3 cek sebelum percaya P/E 12,4x."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m24_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m24_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"EV berbeda dari market cap karena EV…", o:["Mengabaikan utang dan hanya memakai ekuitas","Sama persis dengan market cap, hanya nama lain yang dipakai analis","Hanya dipakai untuk valuasi bank dan asuransi","Menambah utang bersih — harga beli seluruh perusahaan"], a:3},
 {q:"Perusahaan merugi. Multiple yang PALING tidak bermakna adalah…", o:["P/E","EV/penjualan","P/B","EV/EBITDA"], a:0},
 {q:"P/E Cemerlang versi US GAAP (LIFO) vs PSAK (FIFO)…", o:["Identik — metode persediaan tidak mengubah laba bersih perusahaan","GAAP lebih rendah karena LIFO menaikkan laba saat harga-harga naik","GAAP 15,6x > PSAK 12,4x — normalisasi dulu sebelum bandingkan","Tidak bisa dihitung tanpa data harga pasar sahamnya"], a:2},
 {q:"PEG 0,68x (di bawah 1) berarti…", o:["Saham pasti murah — beli sekarang juga tanpa analisis tambahan apa pun lagi","Murah relatif terhadap pertumbuhan forecast — tapi forecast bisa salah","Mahal — PEG rendah menandakan pasar menghindari saham ini","Tidak ada artinya — PEG tidak dipakai analis profesional"], a:1},
 {q:"Revaluasi tanah +50.000 (PSAK 216). Efek ke P/B…", o:["Naik — ekuitas bertambah sehingga valuasinya ikut naik","Turun — terlihat murah padahal bisnisnya tetap","Tetap — revaluasi tidak mengubah rasio valuasi","Menjadi negatif karena ekuitas terkoreksi"], a:1}
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
           window.FSAMistake.log(24, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓ — Kurikulum FSA Lab Tuntas!</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu menuntaskan Phase 6 — dari membaca laporan sampai menilai valuasi. Phase 7 menantimu: skor forensik lanjutan, akuntansi syariah, ESOP & ESG, dan forensik dokumen. <a href=\"../modul-25/\">Lanjut ke Modul 25 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m24","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m24") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m24") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m24") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 24 sudah kamu lewati sebelumnya — Kurikulum FSA Lab Tuntas!</p>";
  }
}catch(e){}
})();
