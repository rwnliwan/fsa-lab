/* FSA Lab — Modul 18: Forecasting & Valuasi (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
fc:{ title:"Forecast 2026 — ilustratif, bukan rekomendasi (Rp juta)", cols:["Pos","2026F","Asumsi"],
 rows:[
  {l:"Penjualan", v:"598.000", v2:"+15%", d:"520.000 × 1,15 = 598.000. Asumsi growth — titik paling sensitif dalam forecast.", psak:"—", f:"Growth assumption = tempat optimism bias bersembunyi. Selalu uji skenario bear."},
  {l:"EBIT", v:"82.524", v2:"margin 13,8%", d:"598.000 × 13,8% = 82.524. Margin dipertahankan dari 2025.", psak:"—", f:"Margin konstan = asumsi kuat; cek pricing power & struktur biaya."},
  {l:"Beban bunga", v:"14.000", v2:"tetap", d:"Asumsi struktur utang tidak berubah.", psak:"—", f:"Bunga tetap + utang naik = inkonsisten; cek jadwal utang."},
  {l:"Laba bersih", v:"53.449", v2:"+18% YoY", d:"(82.524 − 14.000) × (1 − 22%) = 53.449. Ilustrasi mekanik, bukan rekomendasi.", psak:"—", f:"Forecast laba tanpa forecast kas = setengah cerita. Selalu proyeksikan arus kas."}
 ]},
val:{ title:"Jembatan ke valuasi — ilustratif (Rp juta)", cols:["Langkah","Angka","Catatan"],
 rows:[
  {l:"FCFF ilustrasi", v:"25.000", v2:"Rp juta", d:"Asumsi kas bebas ternormalisasi — ilustratif, bukan hasil model penuh.", psak:"—", f:"FCFF normalisasi vs FCFF aktual (−6.280): selisihnya = asumsi yang harus dibela."},
  {l:"WACC", v:"12%", v2:"tingkat diskonto", d:"Biaya modal rata-rata tertimbang (asumsi).", psak:"—", f:"WACC salah 2 poin = valuasi meleset puluhan persen."},
  {l:"g — pertumbuhan abadi", v:"3%", v2:"terminal", d:"Asumsi pertumbuhan jangka panjang.", psak:"—", f:"g > pertumbuhan ekonomi jangka panjang = tidak masuk akal."},
  {l:"Enterprise Value", v:"277.778", v2:"25.000 ÷ (12% − 3%)", d:"EV = FCFF ÷ (WACC − g) = 25.000 ÷ 0,09 = 277.778. Ilustratif.", psak:"—", f:"Rumus sederhana, asumsi berat. Sensitivitas ke g & WACC sangat tinggi."},
  {l:"Utang berbunga", v:"201.440", v2:"Rp juta", d:"31.440 + 110.000 + 60.000 — total klaim kreditur.", psak:"—", f:"—"},
  {l:"Kas", v:"(21.440)", v2:"Rp juta", d:"Dikurangkan — kas bisa langsung melunasi sebagian utang.", psak:"—", f:"—"},
  {l:"Utang bersih", v:"180.000", v2:"Rp juta", d:"201.440 − 21.440 = 180.000.", psak:"—", f:"—"},
  {l:"Nilai ekuitas", v:"97.778", v2:"277.778 − 180.000", d:"EV − utang bersih = nilai untuk pemegang saham. Di BAWAH nilai buku 179.440 — utang memakan nilai ekuitas.", psak:"—", f:"EV ≠ nilai ekuitas. Lupa mengurangkan utang bersih = kesalahan valuasi paling klasik."},
  {l:"Cross-check: DCF × multiples (→ M24)", v:"wajib", v2:"jangkar realitas", d:"DCF tidak pernah berdiri sendiri: EV 277.778 (ilustratif) harus masuk akal DIBANDING multiples pasar. M24: EV/EBITDA 7,3x (ilustratif) × EBITDA 102.000 ≈ 744.600 — jauh di atas hasil DCF. Selisihnya = pertanyaan: FCFF 25.000 terlalu pesimis, atau pasar terlalu optimis? DCF selalu di-cross-check dengan multiples — lihat Modul 24.", psak:"—", f:"Analis yang hanya punya DCF bisa 'membuktikan' harga apa pun lewat g dan WACC. Multiples adalah jangkar realitasnya."}
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
 {t:"Asumsi growth naik 15% → 20%", q1:"Nilai wajar", q2:"Risiko forecast", a1:"naik", a2:"naik",
  e:"Growth naik → nilai naik; tapi asumsi agresif → risiko salah naik."},
 {t:"WACC naik 12% → 14%", q1:"Nilai wajar", q2:"Tingkat diskonto", a1:"turun", a2:"naik",
  e:"Diskonto naik → nilai kini turun. Inilah kenapa suku bunga adalah musuh valuasi."},
 {t:"Margin turun 13,8% → 11%", q1:"Nilai wajar", q2:"NI forecast", a1:"turun", a2:"turun",
  e:"Margin turun → laba turun → nilai turun. Pricing power = nyawa valuasi."},
 {t:"g naik 3% → 5%", q1:"Nilai wajar", q2:"Sensitivitas", a1:"naik", a2:"naik",
  e:"g naik → penyebut (WACC−g) susut → EV melonjak. Terminal value sangat sensitif ke g."},
 {t:"Capex naik Rp20.000", q1:"FCFF", q2:"Nilai wajar", a1:"turun", a2:"turun",
  e:"Capex naik → FCFF turun → EV turun. Investasi hari ini = kas besok."},
 {t:"Skenario bear (growth 5%)", q1:"Nilai wajar", q2:"Margin of safety dibutuhkan", a1:"turun", a2:"naik",
  e:"Skenario buruk → nilai turun → butuh diskon (margin of safety) lebih besar sebelum beli."}
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
    try{ localStorage.setItem("fsa_pg_m18", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Forecast penjualan 2026 (Rp juta)", hint:"Penjualan 2025 × 1,15: 520.000 × 1,15", ans:598000, dec:false, tol:1000,
  why:"598.000 — ilustrasi mekanik, bukan ramalan."},
 {q:"NI forecast 2026 (Rp juta)", hint:"(EBIT − bunga) × (1 − pajak): (82.524 − 14.000) × 0,78", ans:53449, dec:false, tol:100,
  why:"53.449 — dengan margin & bunga konstan."},
 {q:"EV ilustrasi (Rp juta)", hint:"FCFF ÷ (WACC − g): 25.000 ÷ (0,12 − 0,03)", ans:277778, dec:false, tol:500,
  why:"277.778 — dari FCFF perpetuity ilustratif."},
 {q:"Nilai ekuitas ilustrasi (Rp juta)", hint:"EV − utang bersih: 277.778 − 180.000", ans:97778, dec:false, tol:500,
  why:"97.778 — di bawah nilai buku 179.440. Pelajaran: utang 180.000 memakan nilai ekuitas."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 598.000">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 598.000 atau 598000)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Nilai ekuitas ilustrasi 97.778 (EV 277.778 − utang bersih 180.000) vs nilai buku 179.440. BELI / TAHAN / JUAL? Tulis keputusan + 3 alasan.",
 credit:"Lensa kredit — Setelah 18 modul, apakah Cemerlang layak dapat kredit jangka panjang? Syarat apa?",
 forensic:"Lensa forensik — Satu halaman terakhir: apa 3 hal yang paling kamu curigai dari Cemerlang — dan bukti apa yang menutupnya?"
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m18_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m18_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Forecast keuangan dimulai dari asumsi…", o:["Dividen", "Laba bersih", "Kas", "Penjualan"], a:3},
 {q:"Enterprise value dari FCFF perpetuity…", o:["FCFF periode depan ÷ (WACC − g)","FCFF ÷ (WACC + g)","Aset − utang","FCFF × (WACC − g)"], a:0},
 {q:"WACC naik → nilai wajar…", o:["Naik","Nol","Turun","Sama"], a:2},
 {q:"Margin of safety berarti…", o:["Batas maksimum utang bank","Laba ditahan perusahaan","Selisih harga pasar di atas nilai wajar","Diskon dari nilai wajar sebelum beli"], a:3},
 {q:"Forecast pada dasarnya adalah…", o:["Ramalan yang pasti","Audit masa depan","Skenario berdasar asumsi","Proyeksi tanpa perlu asumsi"], a:2}
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
           window.FSAMistake.log(18, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓ — Phase 3 Tuntas!</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). 18 modul inti selesai — lanjut ke Phase 4: Sumber & Fondasi Filing. <a href=\"../modul-19/\">Lanjut ke Modul 19 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m18","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m18") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m18") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m18") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Phase 3 Tuntas ✓</h3><p>18 modul inti sudah kamu lewati. <a href=\"../modul-19/\">Lanjut ke Modul 19 →</a></p>";
  }
}catch(e){}
})();
