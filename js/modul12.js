/* FSA Lab — Modul 12: Aset Tetap, Impairment & Sewa (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
ppe:{ title:"Aset tetap neto 2025 (Rp juta) — 40.000 + 132.000 + 58.000 = 230.000 ✓", cols:["Pos","2025","2024"],
 rows:[
  {l:"Tanah", v:"40.000", v2:"40.000", d:"Tidak disusutkan. Bisa direvaluasi ke nilai wajar.", psak:"PSAK 216 (dulu 16)", f:"Tanah yang direvaluasi berulang = cara menaikkan ekuitas tanpa kas."},
  {l:"Bangunan & mesin (neto)", v:"132.000", v2:"120.000", d:"Setelah akumulasi depresiasi. Depresiasi 30.000/thn.", psak:"PSAK 216 (dulu 16)", f:"Perubahan umur manfaat tiba-tiba = cara legal-adjacent menaikkan laba."},
  {l:"Aset hak-guna / ROU (neto)", v:"58.000", v2:"50.000", d:"Hak pakai dari kontrak sewa — 25,2% dari aset tetap.", psak:"PSAK 116 (dulu 73)", f:"Sejak PSAK 116, 'tidak punya utang' harus dicek ulang — sewa jadi liabilitas."},
  {l:"Total aset tetap neto", v:"230.000", v2:"210.000", d:"51,0% dari total aset — perusahaan padat modal.", psak:"—", f:"—"},
  {l:"Capex vs depresiasi", v:"48.000 > 30.000", v2:"40.000 > 26.000", d:"Investasi melebihi penyusutan = ekspansi kapasitas.", psak:"—", f:"Capex yang dikapitalisasi berlebihan = laba semu (ingat WorldCom)."}
 ]},
imp:{ title:"Impairment & sewa (ilustratif Rp juta)", cols:["Pos","Angka","Keterangan"],
 rows:[
  {l:"Nilai tercatat (carrying)", v:"50.000", v2:"mesin X", d:"Nilai buku mesin sebelum uji penurunan nilai.", psak:"PSAK 236 (dulu 48)", f:"—"},
  {l:"Nilai terpulihkan (recoverable)", v:"42.000", v2:"ilustratif", d:"Mana yang lebih tinggi: nilai pakai vs nilai wajar − biaya jual.", psak:"PSAK 236 (dulu 48)", f:"Asumsi nilai pakai bisa dimanipulasi — cek discount rate & proyeksi."},
  {l:"Rugi impairment", v:"8.000", v2:"50.000 − 42.000", d:"Dibebankan ke laba rugi tahun berjalan.", psak:"PSAK 236 (dulu 48)", f:"Impairment yang ditunda bertahun-tahun = bom waktu di neraca."},
  {l:"Liabilitas sewa", v:"60.000", v2:"2024: 58.000", d:"Nilai kini pembayaran sewa masa depan.", psak:"PSAK 116 (dulu 73)", f:"—"},
  {l:"Beban sewa di laba rugi", v:"depresiasi + bunga", v2:"bukan sewa", d:"Di bawah PSAK 116, sewa operasi dipecah jadi depresiasi ROU + beban bunga.", psak:"PSAK 116 (dulu 73)", f:"EBITDA naik semu setelah PSAK 116 — beban sewa pindah ke bawah EBIT."}
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
renderStmt("ppe");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Revaluasi tanah +Rp20.000", q1:"Ekuitas", q2:"Depresiasi", a1:"naik", a2:"tetap",
  e:"Surplus revaluasi masuk OCI → ekuitas naik. Tanah tidak disusutkan → depresiasi tetap."},
 {t:"Impairment mesin Rp8.000", q1:"Laba", q2:"Aset", a1:"turun", a2:"turun",
  e:"Rugi impairment membebani laba dan menurunkan nilai tercatat. Menundanya = bom waktu."},
 {t:"Umur manfaat diperpanjang", q1:"Depresiasi", q2:"Laba", a1:"turun", a2:"naik",
  e:"Beban susut tahunan lebih kecil → laba naik. Legal-adjacent, tapi perubahan tiba-tiba = flag."},
 {t:"Kontrak sewa baru Rp20.000", q1:"Aset", q2:"Liabilitas", a1:"naik", a2:"naik",
  e:"PSAK 116: aset hak-guna + liabilitas sewa naik bersamaan. Neraca menggelembung dua sisi."},
 {t:"Capex > depresiasi bertahun-tahun", q1:"Kapasitas", q2:"FCFF", a1:"naik", a2:"turun",
  e:"Kapasitas tumbuh, tapi kas bebas tertekan. Ekspansi yang sehat butuh return di atas WACC."},
 {t:"Jual tanah di atas nilai buku", q1:"Laba", q2:"Kas", a1:"naik", a2:"naik",
  e:"Selisih jual = laba; kas masuk. Tapi ini one-off — pisahkan dari laba operasi."}
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
    try{ localStorage.setItem("fsa_pg_m12", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"PPE intensity 2025 (%)", hint:"Aset tetap ÷ total aset × 100: 230.000 ÷ 451.440 × 100", ans:51.0, dec:true, tol:0.3,
  why:"51,0% — lebih dari separuh aset tertanam di aset tetap. Perusahaan padat modal."},
 {q:"ROU share (%)", hint:"Aset hak-guna ÷ aset tetap × 100: 58.000 ÷ 230.000 × 100", ans:25.2, tol:0.3,
  why:"25,2% — seperempat aset tetap adalah hak sewa, bukan milik."},
 {q:"Impairment ilustrasi (Rp juta)", hint:"Carrying − recoverable: 50.000 − 42.000", ans:8000, dec:false, tol:100,
  why:"8.000 — rugi penurunan nilai yang membebani laba tahun berjalan."},
 {q:"Depresiasi tahunan (Rp juta)", hint:"Beban penyusutan aset tetap 2025", ans:30000, dec:false, tol:500,
  why:"30.000 — non-kas, ditambah kembali di arus kas operasi."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 51,0">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 51,0 atau 8000)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Bangun (capex 80.000, depresiasi 20 thn) vs sewa 10 tahun (ROU + liabilitas). Mana yang lebih baik untuk return & fleksibilitas? Tulis 3 baris.",
 credit:"Lensa kredit — Dampak tiap opsi ke D/E, coverage, dan jaminan kreditur. Opsi mana yang lebih aman untuk bank?",
 forensic:"Lensa forensik — Tulis 3 cek: apakah sewa ini sewa beneran atau utang terselubung? Apakah capex bangun dikapitalisasi wajar?"
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m12_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m12_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Impairment diakui ketika…", o:["Recoverable < carrying amount","Carrying amount < recoverable amount","Harga pasar naik di atas nilai buku","Laba tahun berjalan naik"], a:0},
 {q:"Revaluasi tanah ke nilai wajar → …", o:["Ekuitas naik via OCI","Laba naik via OCI","Laba bersih naik","Aset naik, ekuitas tetap"], a:0},
 {q:"Aset hak-guna (ROU) muncul karena…", o:["PSAK 115","PSAK 116","IFRS 18","PSAK 109"], a:1},
 {q:"Capex > depresiasi bertahun-tahun = …", o:["Kontraksi", "Efisiensi", "Ekspansi", "Rugi"], a:2},
 {q:"Aset tetap 51% dari total aset → …", o:["Padat karya","Jasa murni","Risiko rendah","Padat modal"], a:3}
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
           window.FSAMistake.log(12, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). <a href=\"../modul-13/\">Lanjut ke Modul 13 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m12","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m12") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m12") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m12") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 12 sudah kamu lewati sebelumnya. <a href=\"../modul-13/\">Lanjut ke Modul 13 →</a></p>";
  }
}catch(e){}
})();
