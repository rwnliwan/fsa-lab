/* FSA Lab — Modul 11: Bedah Modal Kerja — Piutang & Persediaan (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
piutang:{ title:"Piutang usaha 2025 (Rp juta)", cols:["Pos","2025","2024"],
 rows:[
  {l:"Piutang bruto", v:"108.100", v2:"—", d:"Nilai tagihan sebelum cadangan. Dasar hitung ECL.", psak:"PSAK 109 (dulu 71)", f:"—"},
  {l:"Cadangan ECL (allowance)", v:"(4.100)", v2:"—", d:"Expected credit loss — estimasi yang tidak tertagih.", psak:"PSAK 109 (dulu 71)", f:"Cadangan yang melonjak tiba-tiba = big bath atau antisipasi kerugian besar."},
  {l:"Piutang neto", v:"104.000", v2:"55.000", d:"108.100 − 4.100. Yang tampil di neraca.", psak:"—", f:"—"},
  {l:"ECL rate", v:"3,8%", v2:"—", d:"4.100 ÷ 108.100. Rp3,80 dari tiap Rp100 piutang dianggap tak tertagih.", psak:"—", f:"ECL rate yang turun saat DSO naik = cadangan kurang konservatif."},
  {l:"Stage 1 (lancar)", v:"80.000", v2:"—", d:"Risiko kredit belum naik signifikan — cadangan 12 bulan. (Ilustrasi pendekatan umum; piutang usaha memakai pendekatan sederhana PSAK 109: lifetime ECL tanpa stage 1/2/3.)", psak:"PSAK 109 (dulu 71)", f:"—"},
  {l:"Stage 2 (risiko naik)", v:"18.000", v2:"—", d:"Risiko naik signifikan — cadangan lifetime. (Ilustrasi pendekatan umum — lihat Stage 1.)", psak:"PSAK 109 (dulu 71)", f:"Migrasi S1→S2 yang besar = early warning portofolio pelanggan."},
  {l:"Stage 3 (credit-impaired)", v:"10.100", v2:"—", d:"Aset credit-impaired — 9,3% dari bruto. Lebih luas dari 'gagal bayar' semata.", psak:"PSAK 109 (dulu 71)", f:"Stage 3 yang tumbuh = tagihan macet menumpuk; cek umur piutang."},
  {l:"DSO", v:"73,0 hari", v2:"50,2 hari", d:"Rata-rata tagihan tertagih 73 hari.", psak:"—", f:"DSO melar = screen #1 pendapatan prematur (channel stuffing)."}
 ]},
stok:{ title:"Persediaan 2025 (Rp juta)", cols:["Pos","Ilustrasi","Keterangan"],
 rows:[
  {l:"Persediaan", v:"96.000", v2:"Rp juta", d:"Stok barang dagang & bahan — 21,3% dari aset.", psak:"PSAK 202 (dulu 14)", f:"Stok usang yang tidak dihapusbukukan = aset semu."},
  {l:"Metode: FIFO", v:"HPP 1.000", v2:"ilustratif", d:"Contoh: beli 100@10 + 100@12, jual 100 → yang keluar duluan yang murah.", psak:"PSAK 202 (dulu 14)", f:"Saat harga naik, FIFO → laba lebih tinggi. LIFO dilarang di PSAK."},
  {l:"Metode: rata-rata", v:"HPP 1.100", v2:"ilustratif", d:"Contoh yang sama: (1.000+1.200)/2 = 1.100 per 100 unit.", psak:"PSAK 202 (dulu 14)", f:"Rata-rata meratakan fluktuasi harga — laba lebih stabil."},
  {l:"DIO", v:"103,7 hari", v2:"2024: 110,6", d:"Stok berputar tiap ~104 hari — membaik dari 110,6.", psak:"—", f:"DIO yang memburuk = stok menumpuk atau obsolescence disembunyikan."},
  {l:"NRV rule", v:"lower of cost", v2:"atau NRV", d:"Persediaan dicatat mana yang lebih rendah: biaya atau nilai realisasi neto.", psak:"PSAK 202 (dulu 14)", f:"Tidak ada write-down saat harga jatuh = laba digelembungkan."}
 ]}
};

var NOTE_PIUTANG = '<div class="explain" style="margin-bottom:1rem"><h3>Piutang usaha: pendekatan sederhana PSAK 109</h3><p>Piutang usaha memakai <strong>pendekatan sederhana</strong> (<em>simplified approach</em>) PSAK 109: cadangan <strong>lifetime ECL</strong> dihitung sejak pengakuan awal &mdash; <strong>tanpa stage 1/2/3</strong> dan tanpa menilai apakah risiko kredit naik signifikan. Jadi baris Stage 1/2/3 di tabel di atas adalah ilustrasi pendekatan umum (untuk pinjaman dan obligasi, misalnya), BUKAN cara cadangan piutang usaha dihitung.</p><p><strong>Contoh:</strong> tagihan baru Rp10.000 ke pelanggan dengan histori gagal bayar 2% langsung dicadangkan lifetime ECL Rp200 (2% &times; 10.000) sejak hari pertama &mdash; tidak menunggu 12 bulan, tidak menunggu memburuk. Konsisten dengan tabel: cadangan 4.100 atas bruto 108.100 = ECL rate 3,8% &mdash; seluruhnya lifetime ECL pendekatan sederhana, bukan cadangan 12 bulan.</p></div>';
function fmtStmt(key){
  var s = STMTS[key], h = '<table class="stmt"><tr><th>'+s.cols[0]+'</th><th style="text-align:right">'+s.cols[1]+'</th><th style="text-align:right">'+s.cols[2]+'</th></tr>';
  s.rows.forEach(function(r,i){
    h += '<tr class="clickable" data-stmt="'+key+'" data-i="'+i+'"><td>'+r.l+'</td><td class="val">'+r.v+'</td><td class="val" style="color:var(--ink-soft)">'+r.v2+'</td></tr>';
  });
  var out = h + '</table><p class="sub" style="font-size:.82rem">'+s.title+'</p>';
  if(key==="piutang"){ out += NOTE_PIUTANG; }
  return out;
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
renderStmt("piutang");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Pelanggan besar gagal bayar", q1:"Allowance", q2:"Laba", a1:"naik", a2:"turun",
  e:"Piutang macet → cadangan ECL naik → beban naik → laba turun. Inilah kenapa stage 3 dipantau ketat."},
 {t:"Harga bahan naik (metode FIFO)", q1:"Laba", q2:"HPP", a1:"naik", a2:"turun",
  e:"FIFO mengeluarkan stok lama yang murah dulu → HPP lebih rendah → laba lebih tinggi saat harga naik. LIFO dilarang di PSAK."},
 {t:"Stok usang dihapusbukukan", q1:"Persediaan", q2:"Laba", a1:"turun", a2:"turun",
  e:"Write-down ke NRV: aset turun, beban naik. Menunda write-down = menggelembungkan laba."},
 {t:"Perketat syarat kredit pelanggan", q1:"Piutang", q2:"Penjualan", a1:"turun", a2:"turun",
  e:"Kredit ketat → piutang turun (bagus), tapi penjualan ikut turun (mahal). Trade-off klasik."},
 {t:"Stok menumpuk di gudang", q1:"DIO", q2:"CCC", a1:"naik", a2:"naik",
  e:"Persediaan mengendap → DIO naik → CCC naik. Gudang penuh = kas mati."},
 {t:"Cadangan ECL dinaikkan manajemen", q1:"Laba", q2:"Kualitas laba", a1:"turun", a2:"naik",
  e:"Laba tahun ini turun, tapi laba jadi lebih konservatif dan jujur — kualitasnya naik."}
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
    try{ localStorage.setItem("fsa_pg_m11", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"ECL rate 2025 (%)", hint:"Allowance ÷ piutang bruto × 100: 4.100 ÷ 108.100 × 100", ans:3.8, tol:0.2,
  why:"3,8% — belum dapat dinilai 'tipis' atau 'wajar' dari DSO 73 hari saja; butuh umur piutang & data kerugian. Selidiki sebelum memberi vonis."},
 {q:"Allowance 2025 (Rp juta)", hint:"Piutang bruto − neto: 108.100 − 104.000", ans:4100, dec:false, tol:50,
  why:"4.100 — buffer atas tagihan yang mungkin tak tertagih."},
 {q:"Stage-3 share (%)", hint:"Stage 3 ÷ bruto × 100: 10.100 ÷ 108.100 × 100", ans:9.3, tol:0.3,
  why:"9,3% — hampir 1 dari 10 rupiah piutang sudah credit-impaired."},
 {q:"DIO 2025 (hari)", hint:"Persediaan ÷ HPP × 365: 96.000 ÷ 338.000 × 365", ans:103.7, tol:0.5,
  why:"103,7 hari — membaik dari 110,6. Stok berputar sedikit lebih cepat."},
 {q:"Lifetime ECL tagihan baru Rp10.000 (Rp juta)", hint:"Pendekatan sederhana PSAK 109: 2% × 10.000, langsung lifetime sejak hari pertama", ans:200, dec:false, tol:10,
  why:"200 — tanpa stage 1/2: piutang usaha langsung dicadangkan lifetime ECL sejak pengakuan awal."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 3,8">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 3,8 atau 4100)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Termin 90 hari akan menaikkan DSO & CCC. Efek ke kas, valuasi, dan keputusanmu? Tulis 3 baris.",
 credit:"Lensa kredit — Syarat kredit seperti apa yang aman untuk distributor ini? Limit, jaminan, covenant?",
 forensic:"Lensa forensik — Tulis 3 cek sebelum menyetujui termin 90 hari: apakah ini penjualan beneran atau channel stuffing?"
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m11_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m11_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"ECL 3,8% artinya…", o:["Piutang neto ÷ penjualan","Cadangan ÷ piutang bruto","Cadangan ÷ piutang neto setelah hapus buku","Kerugian aktual ÷ piutang bruto"], a:1},
 {q:"Harga naik + metode FIFO → laba…", o:["Lebih tinggi","Lebih kecil","Sama saja","Tetap seperti LIFO"], a:0},
 {q:"Stage 3 dalam PSAK 109 = …", o:["Menunggak ringan","Lancar","Baru dicairkan (belum jatuh tempo)","Credit-impaired"], a:3},
 {q:"Allowance naik tajam tiba-tiba bisa berarti…", o:["Big bath / antisipasi kerugian","Kualitas kredit membaik","Manajemen menaikkan laba tahun ini","Kolektibilitas debitur membaik"], a:0},
 {q:"PSAK 109 memakai pendekatan…", o:["Incurred loss","Nilai wajar","Tanpa cadangan","Expected loss"], a:3}
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
           window.FSAMistake.log(11, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). <a href=\"../modul-12/\">Lanjut ke Modul 12 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m11","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m11") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m11") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m11") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 11 sudah kamu lewati sebelumnya. <a href=\"../modul-12/\">Lanjut ke Modul 12 →</a></p>";
  }
}catch(e){}
})();
