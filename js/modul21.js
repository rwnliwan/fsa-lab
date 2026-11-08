/* FSA Lab — Modul 21: Aturan Main & Provisi (PSAK/IFRS vs US GAAP, PSAK 237, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
sys:{ title:"Principles-based vs rules-based — angka yang sama, ekonomi yang sama, hasil bisa beda", cols:["Aspek","PSAK / IFRS","US GAAP"],
 rows:[
  {l:"Karakter", v:"Principles-based", v2:"Rules-based", d:"PSAK/IFRS memberi prinsip + judgment; US GAAP memberi bright lines rinci. Keduanya sah — tapi angkanya tidak langsung comparable.", psak:"—", f:"Principles-based = lebih banyak ruang untuk posisi agresif-tapi-arguable."},
  {l:"Biaya development", v:"Dikapitalisasi bila 6 kriteria", v2:"Dibebankan", d:"PSAK 238 WAJIB mengkapitalisasi development yang memenuhi kriteria teknis & komersial; US GAAP membebankan hampir semua R&D.", psak:"PSAK 238 (dulu 19)", f:"Kriteria 'kelayakan' = judgment call. Kapitalisasi agresif = laba digelembungkan."},
  {l:"LIFO", v:"Dilarang", v2:"Boleh", d:"Perusahaan LIFO di industri harga naik melaporkan laba & persediaan lebih rendah dari padanan FIFO-nya.", psak:"—", f:"LIFO liquidation (menguras lapisan murah lama) = trik laba khas US."},
  {l:"Reversal inventory writedown", v:"Wajib bila pulih", v2:"Dilarang", d:"PSAK mewajibkan pembalikan penurunan nilai persediaan saat nilai pulih; GAAP melarang.", psak:"—", f:"Timing reversal = tuas legal untuk mengangkat laba periode berikutnya."},
  {l:"Revaluasi aset tetap", v:"Boleh (model revaluasi)", v2:"Cost only", d:"PSAK 216 membolehkan nilai wajar; GAAP hanya biaya historis. Revaluasi menaikkan ekuitas & menurunkan ROA mekanis.", psak:"PSAK 216 (dulu 16)", f:"Revaluasi tepat sebelum covenant test = tanya siapa penilai & kenapa sekarang."},
  {l:"Rentang tanpa titik terbaik", v:"Midpoint", v2:"Low end", d:"Estimasi 8.000–12.000 tanpa titik terbaik (dan seluruh titik sama mungkin) → PSAK akui 10.000 (midpoint), GAAP akui 8.000 (low end, untuk kontinjensi kerugian). Contoh pada skenario yang diasumsikan di sini — bukan aturan universal tanpa kondisi. Neraca US bisa lebih tipis untuk risiko identik.", psak:"PSAK 237 (dulu 57)", f:"—"},
  {l:"Reversal impairment non-goodwill", v:"Boleh", v2:"Dilarang", d:"PSAK membolehkan pembalikan (kecuali goodwill); GAAP melarang semua reversal.", psak:"PSAK 236 (dulu 48)", f:"—"}
 ]},
prov:{ title:"Anatomi provisi — PSAK 237 (3 syarat + contoh)", cols:["Unsur","Isi","Contoh"],
 rows:[
  {l:"Syarat 1 · Kewajiban kini", v:"Dari peristiwa masa lalu", v2:"garansi produk terjual", d:"Kewajiban sudah lahir (produk terjual bergaransi) — bukan rencana masa depan.", psak:"PSAK 237 (dulu 57)", f:"Provisi untuk 'rencana' restrukturisasi yang belum diumumkan = tidak sah."},
  {l:"Syarat 2 · Probable", v:"Arus keluar >50%", v2:"litigasi 70% kalah", d:"'Probable' dibaca lebih-likely-than-not. Dalam beberapa area (mis. kontinjensi kerugian), ambang atau praktik US GAAP dapat berbeda / bar-nya lebih tinggi — bukan aturan umum semua provisi.", psak:"PSAK 237 (dulu 57)", f:"Ambang 51% vs 49% = judgment yang menggerakkan laba."},
  {l:"Syarat 3 · Estimasi andal", v:"Bisa diestimasi", v2:"garansi 1,5% historis", d:"Tanpa estimasi andal, kewajiban probable pun tidak bisa diakui.", psak:"PSAK 237 (dulu 57)", f:"Perubahan asumsi 1,5% → 2,5% = cek motif di baliknya."},
  {l:"Diakui → provisi 7.800", v:"520.000 × 1,5%", v2:"beban (D) / provisi (K)", d:"Jurnal: beban garansi Rp7.800 pada provisi garansi Rp7.800. Laba turun, kas belum keluar.", psak:"PSAK 237 (dulu 57)", f:"Provisi membengkak tiap Q4 lalu dibalik Q1 = cookie-jar reserve."},
  {l:"Tidak diakui → kontinjensi", v:"Possible, tak probable", v2:"hanya diungkap", d:"Kewajiban yang possible tapi tidak probable = liabilitas kontinjensi: DIUNGKAP di catatan, tidak dicatat.", psak:"PSAK 237 (dulu 57)", f:"Kontinjensi yang 'tiba-tiba' jadi probable = baca lagi disclosure 3 tahun ke belakang."},
  {l:"Aset kontinjensi", v:"Tidak diakui", v2:"diungkap bila probable", d:"Klaim ganti rugi yang mungkin menang = tidak boleh diakui sebagai aset; hanya diungkap bila inflow probable.", psak:"PSAK 237 (dulu 57)", f:"Aset kontinjensi yang sudah 'diakui' diam-diam = pelanggaran."}
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
renderStmt("sys");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Estimasi garansi naik 1,5% → 2,0% dari penjualan Rp520.000", q1:"Provisi garansi", q2:"Laba tahun berjalan", a1:"naik", a2:"turun",
  e:"Tambahan provisi Rp2.600 = beban Rp2.600. Konservatif atau cookie-jar? Cek apakah klaim garansi historis ikut naik."},
 {t:"Litigasi Rp10.000 berubah dari probable → possible", q1:"Provisi", q2:"Pengungkapan di catatan", a1:"turun", a2:"tetap",
  e:"Provisi dihapus (Rp10.000 kembali ke laba), TAPI kewajiban tetap diungkap sebagai liabilitas kontinjensi. Hilang dari neraca ≠ hilang dari risiko."},
 {t:"Dua perusahaan kembar: estimasi 8.000–12.000 tanpa titik terbaik", q1:"Selisih provisi (GAAP − PSAK)", q2:"Laba GAAP vs laba PSAK", a1:"turun", a2:"naik",
  e:"Pada skenario/panduan yang diasumsikan di sini (kontinjensi kerugian, tanpa titik terbaik): GAAP pakai low end 8.000, PSAK pakai midpoint 10.000 → selisih −2.000. Provisi lebih kecil = laba GAAP lebih besar Rp2.000 untuk ekonomi identik. Bukan perbedaan umum PSAK-vs-GAAP untuk semua jenis provisi."},
 {t:"Harga pulih: reversal penurunan nilai persediaan Rp2.000", q1:"Laba PSAK", q2:"Laba US GAAP", a1:"naik", a2:"tetap",
  e:"PSAK mewajibkan reversal → laba naik Rp2.000. GAAP melarang → tetap. Satu gudang, dua laba."},
 {t:"Biaya R&D Rp6.000: PSAK kapitalisasi, GAAP dibebankan", q1:"Aset perusahaan PSAK vs GAAP", q2:"Laba tahun ini PSAK vs GAAP", a1:"naik", a2:"naik",
  e:"Perusahaan software Indonesia terlihat lebih profitable & lebih 'beraset' dari kembaran AS-nya — sebelum penyesuaian apa pun."},
 {t:"Cookie-jar: provisi dibesar-besarkan di tahun bagus", q1:"Laba tahun ini", q2:"Laba tahun depan saat provisi dibalik", a1:"turun", a2:"naik",
  e:"Menabung laba di provisi tahun ini, dicairkan tahun depan. Pola: provisi 'lain-lain' membengkak tiap Q4."}
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
    try{ localStorage.setItem("fsa_pg_m21", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Provisi garansi 2025 (Rp juta)", hint:"Penjualan 520.000 × 1,5%", ans:7800, dec:false, tol:100,
  why:"7.800 — jurnal: beban garansi (D) 7.800 / provisi garansi (K) 7.800. Laba turun, kas belum keluar."},
 {q:"Provisi PSAK atas rentang 8.000–12.000 — midpoint, bila semua titik sama mungkin (Rp juta)", hint:"(8.000 + 12.000) ÷ 2", ans:10000, dec:false, tol:100,
  why:"10.000 — PSAK pakai midpoint bila tidak ada titik yang lebih mungkin (seluruh titik sama mungkin); US GAAP pakai low end 8.000 untuk kontinjensi kerugian. Selisih Rp2.000 untuk risiko identik pada skenario ini."},
 {q:"Tambahan provisi bila estimasi 1,5% → 2,0% (Rp juta)", hint:"520.000 × 0,5%", ans:2600, dec:false, tol:100,
  why:"2.600 — setengah persen dari penjualan = Rp2,6 miliar beban. Asumsi kecil, dampak tidak kecil."},
 {q:"Provisi kontrak memberatkan (Rp juta)", hint:"Biaya tak terhindarkan 5.000 − manfaat 3.500", ans:1500, dec:false, tol:100,
  why:"1.500 — kontrak yang biaya memenuhinya melebihi manfaatnya wajib diprovisikan sebesar selisihnya."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 7800">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 7800)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Dua perusahaan kembar: satu laporan PSAK, satu US GAAP. Daftar 3 penyesuaian yang WAJIB kamu buat sebelum membandingkan margin & ROE mereka.",
 credit:"Lensa kredit — Provisi garansi naik 1,5% → 2,5% dalam setahun; covenant pinjaman berbasis EBITDA. Apakah covenant terganggu? Tulis responsmu sebagai kreditur.",
 forensic:"Lensa forensik — Provisi 'lain-lain' membengkak tiap Q4 lalu dibalik di Q1. Tulis 3 cek untuk membuktikan ini cookie-jar reserve, bukan kehati-hatian."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  $("#journal-text").value = (function(){ try{ return localStorage.getItem("fsa_journal_m21_"+k) || ""; }catch(e){ return ""; } })();
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
  try{ localStorage.setItem("fsa_journal_m21_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Karakter kedua sistem standar…", o:["PSAK/IFRS principles-based, US GAAP rules-based","Keduanya identik persis tanpa perbedaan","PSAK/IFRS rules-based, US GAAP principles-based juga","Keduanya rules-based secara murni"], a:0},
 {q:"Provisi diakui bila tiga syarat terpenuhi…", o:["Manajemen menginginkannya untuk meratakan laba tahun berjalan","Ada kewajiban kini + arus keluar probable + estimasi andal","Kas sudah benar-benar keluar dari perusahaan","Dewan direksi sudah menyetujui rencana pembayaran"], a:1},
 {q:"Kewajiban yang possible tapi tidak probable…", o:["Diakui penuh di neraca sebagai utang jangka panjang","Diabaikan sama sekali oleh manajemen","Diungkap sebagai liabilitas kontinjensi","Dicatat sebagai aset kontinjensi"], a:2},
 {q:"Dalam skenario ini (kontinjensi kerugian, rentang 8.000–12.000 tanpa titik terbaik), US GAAP memakai…", o:["Midpoint 10.000 — tengah rentang","High end 12.000 — paling konservatif","Rata-rata tertimbang probabilitas","Low end 8.000"], a:3},
 {q:"Kontrak memberatkan → provisi sebesar…", o:["Nol — tunggu rugi terealisasi","Total manfaat ekonomik dari kontrak","Biaya tak terhindarkan − manfaat ekonomik","Total pendapatan yang dijanjikan kontrak"], a:2}
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
           window.FSAMistake.log(21, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓ — Phase 4 Tuntas!</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu membaca angka lengkap dengan aturan mainnya. <a href=\"../modul-22/\">Lanjut ke Modul 22 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m21","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m21") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m21") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m21") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 21 sudah kamu lewati sebelumnya — Phase 4 tuntas! <a href=\"../modul-22/\">Lanjut ke Modul 22 →</a></p>";
  }
}catch(e){}
})();
