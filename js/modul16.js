/* FSA Lab — Modul 16: Instrumen Keuangan & ECL 3 Stage (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
klas:{ title:"Klasifikasi instrumen keuangan — PSAK 109", cols:["Kategori","Pengukuran","Kriteria"],
 rows:[
  {l:"Amortised Cost (AC)", v:"Biaya perolehan diamortisasi", v2:"Hold-to-collect + SPPI", d:"Aset dipegang untuk menagih arus kas kontraktual semata (pokok + bunga). Contoh: piutang usaha Cemerlang.", psak:"PSAK 109 (dulu 71)", f:"Mayoritas piutang dagang = AC. Klasifikasi ini paling sedikit volatil."},
  {l:"FVOCI", v:"Nilai wajar via OCI", v2:"Hold-to-collect-and-sell + SPPI", d:"Dipegang untuk menagih DAN menjual. Perubahan nilai wajar ke OCI; didaur ke laba rugi saat dijual (instrumen utang).", psak:"PSAK 109 (dulu 71)", f:"Pilihan FVOCI untuk ekuitas = tidak bisa didaur; cek pilihan manajemen."},
  {l:"FVTPL", v:"Nilai wajar via laba rugi", v2:"Trading / gagal SPPI", d:"Kategori sisa. Perubahan nilai wajar langsung ke laba rugi — laba jadi volatil mengikuti pasar.", psak:"PSAK 109 (dulu 71)", f:"FVTPL besar + laba stabil = curiga; cek instrumen apa yang disembunyikan di sini."},
  {l:"Uji SPPI", v:"Solely Payments of Principal & Interest", v2:"Arus kas = pokok + bunga?", d:"Syarat arus kas kontraktual. Gagal SPPI → otomatis FVTPL, tidak bisa AC/FVOCI.", psak:"PSAK 109 (dulu 71)", f:"Struktur eksotis (derivatif melekat) = gagal SPPI = FVTPL."}
 ]},
ecl:{ title:"ECL 3 stage — piutang Cemerlang 2025 (Rp juta)", cols:["Stage","Piutang","ECL"],
 rows:[
  {l:"Stage 1 — lancar", v:"80.000", v2:"800 (1%)", d:"Risiko kredit belum naik signifikan. ECL 12 bulan: 80.000 × 1% = 800.", psak:"PSAK 109 (dulu 71)", f:"Stage 1 terlalu gemuk = manajemen enggan mengakui kenaikan risiko."},
  {l:"Stage 2 — risiko naik", v:"18.000", v2:"900 (5%)", d:"Risiko naik signifikan sejak pengakuan awal. ECL seumur hidup: 18.000 × 5% = 900.", psak:"PSAK 109 (dulu 71)", f:"Migrasi 1→2 yang lambat = tunda beban. Bandingkan dengan DSO 73 hari."},
  {l:"Stage 3 — gagal bayar", v:"10.100", v2:"2.400 (23,8%)", d:"Bukti objektif impairment. 10.100 × 23,8% = 2.400.", psak:"PSAK 109 (dulu 71)", f:"Stage 3 = 9,3% dari bruto. Naik tiap tahun = kualitas pelanggan memburuk."},
  {l:"TOTAL", v:"108.100", v2:"4.100 (3,8%)", d:"800 + 900 + 2.400 = 4.100 = allowance di neraca ✓. Neto: 108.100 − 4.100 = 104.000 ✓.", psak:"PSAK 109 (dulu 71)", f:"ECL forward-looking: naik SEBELUM gagal bayar. Model incurred lama menunggu rugi dulu."}
 ]},
fv:{ title:"Hierarki nilai wajar — PSAK 113 (dulu 68): seberapa 'bisa dicek' angkanya?", cols:["Level","Input","Contoh"],
 rows:[
  {l:"Level 1", v:"harga kuotasian pasar aktif", v2:"saham listed", d:"Harga pasar yang bisa dilihat semua orang, tanpa penyesuaian. Paling objektif — 'nilainya' = harga di layar.", psak:"PSAK 113 (dulu 68) = IFRS 13", f:"Level 1 jarang bermasalah — kecuali pasarnya tidak likuid tapi diklaim 'aktif'."},
  {l:"Level 2", v:"input teramati (bukan kuotasi)", v2:"yield curve, kurs", d:"Model sederhana dengan input yang bisa diobservasi pasar: kurva imbal hasil, kurs, volatilitas implisit. Contoh: swap dinilai dari kurva suku bunga.", psak:"PSAK 113 (dulu 68)", f:"Cek inputnya: kurva dari sumber independen atau 'estimasi internal'? Level 2 berinput buatan = Level 3 berkedok."},
  {l:"Level 3", v:"input TAK teramati", v2:"asumsi manajemen", d:"Model dengan asumsi yang dibuat manajemen sendiri — proyeksi arus kas, discount rate internal, asumsi pertumbuhan. Mark-to-model: nilainya = apa kata model manajemen.", psak:"PSAK 113 (dulu 68)", f:"Level 3 besar + laba stabil = laba yang 'dihitung', bukan yang terjadi. Minta analisis sensitivitasnya."},
  {l:"Aturan level & transfer", v:"input terendah yang signifikan", v2:"wajib diungkap", d:"Instrumen diklasifikasikan pada level input TERENDAH yang signifikan bagi pengukurannya. Transfer antar level (mis. pasar jadi tidak aktif) WAJIB diungkap beserta alasannya.", psak:"PSAK 113 (dulu 68)", f:"Transfer Level 2→3 yang diam-diam = aset yang tadinya 'bisa dicek pasar' kini hanya 'kata model'. Red flag."},
  {l:"Forensik: pelajaran Wirecard", v:"saldo tak terkonfirmasi", v2:"kasus nyata", d:"Wirecard (2020): saldo kas escrow yang diklaim ada ternyata tidak bisa dikonfirmasi pihak ketiga independen — perusahaan runtuh. Prinsip yang sama berlaku untuk Level 3: angka yang hanya 'kata model manajemen' tanpa verifikasi eksternal = area kepercayaan buta.", psak:"—", f:"Aturan praktis: makin besar porsi Level 3 di neraca, makin besar 'kepercayaan' yang kamu berikan ke manajemen — diskon valuasimu accordingly."}
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
renderStmt("klas");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Piutang Rp5.000 migrasi ke stage 3", q1:"ECL", q2:"Laba", a1:"naik", a2:"turun",
  e:"Stage 3 = tarif tertinggi → ECL naik → beban naik → laba turun."},
 {t:"Obligasi FVTPL, pasar bergejolak", q1:"Volatilitas laba", q2:"Sensitivitas ke pasar", a1:"naik", a2:"naik",
  e:"FVTPL: nilai wajar via laba rugi → pasar goyang, laba ikut goyang."},
 {t:"Ekonomi memburuk tajam", q1:"Migrasi stage", q2:"ECL", a1:"naik", a2:"naik",
  e:"Forward-looking: piutang pindah stage 1→2→3 → ECL naik SEBELUM gagal bayar terjadi."},
 {t:"Suku bunga naik 2%", q1:"Nilai wajar obligasi", q2:"OCI", a1:"turun", a2:"turun",
  e:"Bunga naik → harga obligasi turun → FVOCI mencatat rugi di OCI."},
 {t:"Lunasi obligasi yang dimiliki Rp10.000", q1:"Aset keuangan", q2:"Kas", a1:"turun", a2:"naik",
  e:"Obligasi −10.000, kas +10.000. Total aset tetap — hanya berubah bentuk."},
 {t:"Reklasifikasi karena model bisnis berubah", q1:"Komparabilitas", q2:"Pengungkapan", a1:"turun", a2:"naik",
  e:"Reklasifikasi jarang & butuh bukti perubahan model bisnis; komparabilitas turun, pengungkapan wajib naik."}
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
    try{ localStorage.setItem("fsa_pg_m16", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"ECL total 2025 (Rp juta)", hint:"ECL stage 1 + 2 + 3: 800 + 900 + 2.400", ans:4100, dec:false, tol:50,
  why:"4.100 — sama persis dengan allowance di neraca ✓."},
 {q:"Porsi stage 3 dari piutang bruto (%)", hint:"10.100 ÷ 108.100 × 100", ans:9.3, tol:0.2,
  why:"9,3% piutang sudah gagal bayar — pantau trennya tiap tahun."},
 {q:"ECL rate keseluruhan (%)", hint:"ECL total ÷ piutang bruto × 100: 4.100 ÷ 108.100 × 100", ans:3.8, tol:0.2,
  why:"3,8% — cadangan rata-rata atas seluruh piutang bruto."},
 {q:"Piutang stage 1 (Rp juta)", hint:"Lihat tabel ECL 3 stage di atas", ans:80000, dec:false, tol:500,
  why:"80.000 — 74% piutang masih lancar (stage 1)."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 4.100">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 4.100 atau 4100)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Stage 3 = 9,3% dari piutang. Apakah ini mengancam laba masa depan? Tulis 3 baris.",
 credit:"Lensa kredit — Cadangan 4.100 atas bruto 108.100. Cukup konservatif? Apa yang kamu tanyakan ke manajemen?",
 forensic:"Lensa forensik — ECL adalah area judgment terbesar. Tulis 3 cara manajemen bisa mengecilkan cadangan — dan cara mendeteksinya."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m16_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m16_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"FVTPL artinya instrumen diukur pada…", o:["Biaya perolehan diamortisasi","Nilai wajar via laba rugi","Nilai wajar via OCI","Harga perolehan historis yang tidak pernah direvaluasi"], a:1},
 {q:"Stage 3 dalam ECL berarti piutang…", o:["Lancar (tanpa bukti impairment)","Menunggak ringan (SICR terdeteksi)","Gagal bayar (bukti objektif impairment)","Baru diterbitkan (belum ada riwayat bayar)"], a:2},
 {q:"Bedanya ECL dengan model incurred lama…", o:["ECL menunggu rugi terjadi","Keduanya berbasis kerugian historis","Incurred lebih antisipatif","ECL ekspektasian ke depan"], a:3},
 {q:"Reklasifikasi kategori instrumen keuangan…", o:["Dilarang total tanpa kecuali","Bebas kapan saja sesuai keinginan","Boleh kapan saja selama harga pasar berubah","Jarang, hanya saat model bisnis berubah"], a:3},
 {q:"Efek FVTPL terhadap laba rugi…", o:["Volatil mengikuti pasar","Laba selalu stabil","Tidak masuk laba rugi","Naik terus mengikuti pasar"], a:0}
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
           window.FSAMistake.log(16, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). <a href=\"../modul-17/\">Lanjut ke Modul 17 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m16","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m16") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m16") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m16") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 16 sudah kamu lewati sebelumnya. <a href=\"../modul-17/\">Lanjut ke Modul 17 →</a></p>";
  }
}catch(e){}
})();
