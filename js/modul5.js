/* FSA Lab — Modul 5: Likuiditas & Solvabilitas (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
liq:{ title:"Likuiditas 2025 (Rp juta) — sanggup bayar tagihan <12 bulan?", cols:["Pos","2025","2024"],
 rows:[
  {l:"Aset lancar", v:"221.440", v2:"168.200", d:"Kas 21.440 + piutang 104.000 + persediaan 96.000.", psak:"—", f:"—"},
  {l:"Liabilitas lancar", v:"102.000", v2:"80.000", d:"Utang usaha 62.000 + bank pendek 31.440 + akrual 8.560.", psak:"—", f:"—"},
  {l:"Current ratio", v:"2,17x", v2:"2,10x", d:"221.440/102.000. Di atas 1,5x = likuid.", psak:"—", f:"Current ratio tinggi dari persediaan = likuiditas semu. Cek quick ratio."},
  {l:"Quick ratio", v:"1,23x", v2:"1,10x", d:"(221.440−96.000)/102.000. Tanpa persediaan, masih >1x.", psak:"—", f:"—"},
  {l:"Kas", v:"21.440", v2:"33.200", d:"Turun 11.760 — buffer kas menipis.", psak:"—", f:"Kas menipis + utang naik = kombinasi yang harus diwaspadai."}
 ]},
sol:{ title:"Solvabilitas 2025 (Rp juta) — selamat dari utang jangka panjang?", cols:["Pos","2025","2024"],
 rows:[
  {l:"Total liabilitas", v:"272.000", v2:"238.000", d:"60,3% dari aset didanai utang.", psak:"—", f:"—"},
  {l:"Ekuitas", v:"179.440", v2:"140.200", d:"39,7% dari aset.", psak:"—", f:"—"},
  {l:"D/E ratio", v:"1,52x", v2:"1,70x", d:"272.000/179.440. Membaik dari 1,70x.", psak:"—", f:"Membaik karena ekuitas naik dari laba akrual — bukan dari bayar utang."},
  {l:"Utang berbunga", v:"201.440", v2:"188.000", d:"74% dari total liabilitas.", psak:"—", f:"—"},
  {l:"Net debt / EBITDA", v:"1,76x", v2:"—", d:"EBITDA = EBIT + depresiasi = 72.000 + 30.000 = 102.000; (201.440−21.440)/102.000. Utang bersih lunas ~1,8 tahun dari EBITDA — ingat, EBITDA bukan arus kas aktual.", psak:"—", f:"Di atas 4x = zona merah kredit."},
  {l:"Interest coverage", v:"5,14x", v2:"4,80x", d:"72.000/14.000. Di atas 2x = aman.", psak:"—", f:"Coverage < 1,5x = perusahaan pinjam untuk bayar bunga."}
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
renderStmt("liq");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Terbitkan obligasi Rp50.000 untuk ekspansi", q1:"D/E ratio", q2:"Interest coverage", a1:"naik", a2:"turun",
  e:"Utang +50.000, ekuitas tetap → D/E naik; beban bunga naik → coverage turun. Leverage = pedang dua sisi."},
 {t:"Lunasi utang bank Rp30.000 dari kas", q1:"D/E ratio", q2:"Current ratio", a1:"turun", a2:"naik",
  e:"Utang & kas −30.000 → D/E turun. Current ratio justru NAIK (2,17→2,66x) karena pembilang dan penyebut turun sama — matematika rasio."},
 {t:"Rugi bersih Rp40.000 tahun ini", q1:"Ekuitas", q2:"D/E ratio", a1:"turun", a2:"naik",
  e:"Rugi menggerus laba ditahan → ekuitas turun → D/E naik. Inilah death spiral: rugi → leverage naik → bunga naik → rugi lagi."},
 {t:"Rights issue Rp50.000 tunai", q1:"D/E ratio", q2:"Kas", a1:"turun", a2:"naik",
  e:"Ekuitas +50.000, kas +50.000 → D/E turun. Tapi saham lama terdilusi — pemegang saham membayar pengaman ini."},
 {t:"Sewa guna usaha baru Rp20.000 (PSAK 116)", q1:"D/E ratio", q2:"Total aset", a1:"naik", a2:"naik",
  e:"Aset hak-guna + liabilitas sewa +20.000 → keduanya naik. Sejak PSAK 116, 'tidak punya utang' harus dicek ulang."},
 {t:"Bayar dividen Rp25.000 tunai", q1:"Ekuitas", q2:"Current ratio", a1:"turun", a2:"turun",
  e:"Kas & ekuitas −25.000 → current ratio turun. Dividen besar di perusahaan berleverage = leakage untuk kreditur."}
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
    try{ localStorage.setItem("fsa_pg_m5", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Current ratio 2025 (x)", hint:"Aset lancar ÷ liabilitas lancar: 221.440 ÷ 102.000", ans:2.17, tol:0.05,
  why:"2,17x — likuid. Tapi ingat: 96.000-nya persediaan. Cek quick ratio."},
 {q:"Quick ratio 2025 (x)", hint:"(Aset lancar − persediaan) ÷ liabilitas lancar: 125.440 ÷ 102.000", ans:1.23, tol:0.05,
  why:"1,23x — tanpa persediaan masih >1x. Likuiditasnya beneran."},
 {q:"D/E ratio 2025 (x)", hint:"Total liabilitas ÷ ekuitas: 272.000 ÷ 179.440", ans:1.52, tol:0.05,
  why:"1,52x — tiap Rp1 ekuitas menanggung Rp1,52 utang. Membaik dari 1,70x."},
 {q:"Interest coverage 2025 (x)", hint:"Laba operasi ÷ beban bunga: 72.000 ÷ 14.000", ans:5.14, tol:0.1,
  why:"5,14x — laba operasi menutup bunga 5x lipat. Di bawah 2x = zona bahaya."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 2,17">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 2,17 atau 2.17)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — D/E 1,52x, ROE 28,3%. Apakah leverage ini menguntungkan pemegang saham atau bom waktu? Tulis 3 baris.",
 credit:"Lensa kredit — Kredit investasi Rp100 miliar. Coverage 5,14x, net debt/EBITDA 1,76x, tren DSO memburuk. Keputusan + covenant apa?",
 forensic:"Lensa forensik — Perusahaan berleverage + laba akrual + dividen sambil tambah utang. Tulis 3 red flag yang kamu cek dulu."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m5_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m5_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Current ratio 2,17x artinya…", o:["Aset lancar 2,17x liabilitas lancar", "Total utang 2,17x ekuitas perusahaan", "Laba operasi 2,17x beban bunga", "Kas 2,17x utang jangka pendek"], a:0},
 {q:"Quick ratio mengecualikan…", o:["Kas di bank", "Piutang usaha", "Persediaan", "Utang usaha"], a:2},
 {q:"D/E naik 1,2x → 1,8x dalam setahun. Artinya…", o:["Leverage naik — risiko kredit naik", "Perusahaan makin aman bagi kreditur", "Ekuitas tumbuh lebih cepat daripada utang", "Aset tumbuh seiring utang"], a:0},
 {q:"Interest coverage di bawah 2x = …", o:["Kondisi keuangan sangat aman", "Zona bahaya — laba hampir habis untuk bunga", "Masih wajar untuk startup yang agresif bertumbuh", "Aman selama arus kas positif"], a:1},
 {q:"Net debt/EBITDA 1,76x artinya…", o:["Beban bunga 1,76x laba operasi tahunan", "Dividen 1,76x laba bersih", "Kerugian 1,76x ekuitas", "Utang lunas ~1,8 tahun dari EBITDA"], a:3}
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
           window.FSAMistake.log(5, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). <a href=\"../modul-6/\">Lanjut ke Modul 6 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m5","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m5") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m5") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m5") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 5 sudah kamu lewati sebelumnya. <a href=\"../modul-6/\">Lanjut ke Modul 6 →</a></p>";
  }
}catch(e){}
})();
