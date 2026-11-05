/* FSA Lab — Modul 7: Membaca Catatan & Opini Audit (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
notes:{ title:"Catatan penting 2025 (Rp juta)", cols:["Pos","2025","2024"],
 rows:[
  {l:"Pendapatan (PSAK 115)", v:"520.000", v2:"400.000", d:"Diakui dengan model 5 langkah: identifikasi kontrak, kewajiban pelaksanaan, harga transaksi, alokasi, pengakuan saat kewajiban dipenuhi. Piutang 104.000 = pendapatan yang belum jadi kas.", psak:"PSAK 115 (dulu 72)", f:"Pendapatan adalah pos manipulasi #1. Cek: syarat pengakuan terpenuhi? Retur & diskon diungkap?"},
  {l:"Persediaan (PSAK 202)", v:"96.000", v2:"80.000", d:"Dicatat sebesar lower of cost or NRV; LIFO dilarang. Metode FIFO/rata-rata diungkap di catatan.", psak:"PSAK 202 (dulu 14)", f:"Persediaan usang yang tidak dihapusbukukan = laba semu. Cek umur persediaan & penurunan nilai."},
  {l:"Sewa (PSAK 116)", v:"Liab 60.000", v2:"58.000", d:"Liabilitas sewa 60.000; aset hak-guna neto 58.000 (bagian dari aset tetap 230.000). Sewa operasi tidak bisa lagi off-balance-sheet.", psak:"PSAK 116 (dulu 73)", f:"Sebelum PSAK 116, sewa operasi disembunyikan dari neraca. Cek: semua kontrak sewa tercatat?"},
  {l:"ECL piutang (PSAK 109)", v:"(4.100)", v2:"—", d:"Allowance 4.100 dari piutang bruto 108.100 = 3,8%. Model ekspektasian: stage 1 (80.000), stage 2 (18.000), stage 3 (10.100).", psak:"PSAK 109 (dulu 71)", f:"Allowance yang terlalu tipis vs DSO 73 hari = laba dipoles. Bandingkan dengan kolektibilitas aktual."},
  {l:"Imbalan kerja & pajak tangguhan (ilustratif)", v:"PSAK 219/212", v2:"—", d:"Ilustratif: liabilitas imbalan pasti dihitung aktuaris (asumsi diskonto & kenaikan gaji); pajak tangguhan dari beda temporer. Keduanya murni estimasi manajemen.", psak:"PSAK 219 (dulu 24) / 212 (dulu 46)", f:"Asumsi aktuaria yang 'optimis' 1% bisa menghapus miliaran liabilitas. Selalu baca analisis sensitivitasnya."},
 ]},
ben:{ title:"Liabilitas imbalan kerja — PSAK 219 (dulu 24): dibangun dari estimasi (Rp juta, ilustratif)", cols:["Komponen","Angka","Makna"],
 rows:[
  {l:"Cara liabilitas dibangun", v:"DBO − aset program", v2:"neto", d:"Kewajiban imbalan pasti (DBO) = nilai kini seluruh pembayaran pensiun masa depan, dihitung aktuaris dengan metode projected unit credit. Liabilitas neto di neraca = DBO − nilai wajar aset program (dana pensiun).", psak:"PSAK 219 (dulu 24) = IAS 19", f:"Ilustratif: DBO 24.000 − aset program 18.000 = liabilitas 6.000. DBO-nya sendiri tak terlihat — hanya hasil netonya yang tercatat."},
  {l:"Asumsi aktuaria kunci", v:"4 tuas", v2:"—", d:"Discount rate (imbal hasil obligasi korporat berkualitas), salary growth (kenaikan gaji), turnover karyawan, mortalitas. Keempatnya dipilih manajemen — dengan 'nasihat' aktuaris.", psak:"PSAK 219 (dulu 24)", f:"Discount rate adalah tuas terbesar. Naikkan 1% → DBO susut ~10–15% (ilustratif, tergantung durasi). Legal — tapi mengubah neraca."},
  {l:"Sensitivitas (ilustratif)", v:"±1% → ∓~12%", v2:"durasi panjang", d:"Ilustratif: DBO 24.000 berdurasi ~12 tahun — discount rate naik 1% → DBO turun ≈ 2.900 (≈12%); salary growth naik 1% → DBO naik ≈ 2.500. PSAK 219 mewajibkan analisis sensitivitas ini diungkap di catatan.", psak:"PSAK 219 (dulu 24)", f:"Bandingkan asumsi antar tahun: discount rate yang 'kebetulan' naik di tahun laba tertekan = manajemen sedang memoles liabilitas."},
  {l:"Remeasurement → OCI, bukan P&L", v:"parkir di OCI", v2:"—", d:"Keuntungan/kerugian aktuaria (asumsi meleset) dan imbal hasil aset program di luar bunga neto → dicatat di penghasilan komprehensif lain (OCI), BUKAN laba rugi. Laba bersih 'tenang' — volatilitasnya parkir di ekuitas.", psak:"PSAK 219 (dulu 24)", f:"Laba stabil + OCI berayun liar dari remeasurement = liabilitas pensiun yang sebenarnya tidak stabil. Baca OCI, bukan cuma laba bersih."},
  {l:"Yang dicek di catatan", v:"checklist", v2:"—", d:"(1) Tabel asumsi & perubahannya year-on-year; (2) analisis sensitivitas; (3) rekonsiliasi DBO awal→akhir; (4) funded vs unfunded — kewajiban tanpa aset program = janji yang dibayar dari kas masa depan.", psak:"PSAK 219 (dulu 24)", f:"Unfunded + DBO besar + arus kas lemah = bom waktu. Cek juga: apakah KAM auditor menyebut imbalan kerja?"},
 ]},
audit:{ title:"Opini audit — kamus bahasa auditor", cols:["Opini","Arti","—"],
 rows:[
  {l:"Wajar tanpa modifikasian", v:"✓", v2:"—", d:"Opini tertinggi: auditor memperoleh reasonable assurance bahwa laporan bebas salah saji MATERIAL. Reasonable assurance = keyakinan tinggi, BUKAN jaminan mutlak: salah saji material masih bisa lolos tanpa terdeteksi — audit punya keterbatasan inheren (sampling, estimasi manajemen, potensi kolusi).", psak:"SA 700", f:"Opini bersih bukan vonis sehat. Enron pun pernah dapat opini bersih."},
  {l:"Wajar + penekanan going concern", v:"⚠", v2:"—", d:"Opini tetap wajar, tapi auditor menekankan ketidakpastian kelangsungan usaha. Lampu kuning: baca arus kas & jadwal utang.", psak:"SA 570", f:"Paragraf ini sering muncul 1-2 tahun SEBELUM gagal bayar. Jangan abaikan."},
  {l:"Modifikasian (pengecualian)", v:"✕", v2:"—", d:"'Wajar, kecuali untuk...' — ada area yang auditor tidak bisa verifikasi atau tidak setuju. Red flag serius.", psak:"SA 705", f:"Cek persis area pengecualiannya — biasanya di situlah masalahnya."},
  {l:"Tidak wajar / menolak opini", v:"✕✕", v2:"—", d:"Laporan menyesatkan secara pervasif, atau auditor tidak dapat bukti cukup. Hindari.", psak:"SA 705", f:"Menolak opini = auditor tidak berani tanda tangan. Itu vonis."},
  {l:"KAM (Key Audit Matters)", v:"Fokus", v2:"—", d:"Hal yang paling SIGNIFIKAN dalam audit — dipilih dari hal-hal yang dikomunikasikan auditor kepada tata kelola (bukan daftar semua risiko fraud). Contoh umum: pengakuan pendapatan & estimasi. KAM = peta harta karun analis forensik.", psak:"SA 701", f:"Baca KAM dulu sebelum baca laporan. Auditor sudah menunjukkan area mana yang paling signifikan dalam audit ini."},
 ]},
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
renderStmt("notes");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Auditor diganti 3 kali dalam 5 tahun", q1:"Risiko salah saji", q2:"Kepercayaan analis", a1:"naik", a2:"turun",
  e:"Opini shopping: manajemen mencari auditor yang mau tanda tangan. Pergantian auditor yang sering = red flag klasik."},
 {t:"KAM menyebut pengakuan pendapatan", q1:"Risiko salah saji", q2:"Kepercayaan analis", a1:"naik", a2:"turun",
  e:"Auditor sendiri menilai pengakuan pendapatan sebagai hal paling signifikan dalam audit ini. Percaya angkanya? Verifikasi dulu."},
 {t:"Paragraf penekanan kelangsungan usaha", q1:"Risiko salah saji", q2:"Kepercayaan analis", a1:"naik", a2:"turun",
  e:"Auditor ragu perusahaan bertahan 12 bulan. Risiko salah saji naik (tekanan tampil baik) dan kepercayaan turun."},
 {t:"40% penjualan ke satu pelanggan (diungkap catatan)", q1:"Risiko salah saji", q2:"Kepercayaan analis", a1:"naik", a2:"turun",
  e:"Konsentrasi pelanggan = risiko pendapatan & daya tawar. Diungkap dengan jujur — tapi risikonya nyata."},
 {t:"Opini wajar bersih 5 tahun berturut-turut", q1:"Risiko salah saji", q2:"Kepercayaan analis", a1:"turun", a2:"naik",
  e:"Track record bersih membangun kepercayaan — tapi bukan jaminan. Tetap baca KAM tiap tahun."},
 {t:"Temuan pengendalian internal yang lemah", q1:"Risiko salah saji", q2:"Kepercayaan analis", a1:"naik", a2:"turun",
  e:"Kontrol lemah = angka mudah dimanipulasi, sengaja atau tidak. Risiko salah saji naik."},
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
    try{ localStorage.setItem("fsa_pg_m7", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Tarif pajak efektif (%)", hint:"Beban pajak ÷ PBT: 12.760 ÷ 58.000 × 100", ans:22.0, dec:true, tol:0.3,
  why:"22,0% — sama dengan tarif statutori. Tarif efektif yang jauh di bawah statutori = cek insentif atau rugi fiskal."},
 {q:"Payout ratio (%)", hint:"Dividen ÷ laba bersih: 6.000 ÷ 45.240 × 100", ans:13.3, tol:0.3,
  why:"13,3% — dividen kecil dari laba. Tapi ingat Modul 6: FCFE negatif, jadi dividen ini dibayar dari utang."},
 {q:"ECL rate (%)", hint:"Allowance ÷ piutang bruto: 4.100 ÷ 108.100 × 100", ans:3.8, tol:0.3,
  why:"3,8% — cadangan tipis untuk DSO 73 hari. Analis forensik akan menuntut lebih."},
 {q:"Sewa terhadap liabilitas (%)", hint:"Liabilitas sewa ÷ total liabilitas: 60.000 ÷ 272.000 × 100", ans:22.1, tol:0.3,
  why:"22,1% — seperlima utang adalah sewa. Sejak PSAK 116, leverage 'asli' jadi terlihat."},
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 22,0">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 22,0 atau 22.0)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Layak IPO? Tulis 3 baris: keterbukaan catatan, risiko yang diungkap, keputusanmu.",
 credit:"Lensa kredit — Keterbukaan utang & covenant di catatan — cukup untuk kreditur? Apa yang masih kurang?",
 forensic:"Lensa forensik — Apa yang mungkin disembunyikan catatan? Tulis 3 cek: estimasi, pihak berelasi, KAM."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m7_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m7_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Opini 'wajar tanpa modifikasian' artinya…", o:["Catatan tak perlu dibaca karena auditor telah memverifikasi semua asumsi di dalamnya", "Jaminan mutlak bahwa seluruh angka laporan pasti benar tanpa kecuali", "Bebas salah saji material — menurut reasonable assurance auditor (bukan jaminan mutlak)", "Auditor menyatakan estimasi manajemen — termasuk ECL dan impairment — telah diuji kewajarannya"], a:2},
 {q:"KAM (Key Audit Matters) adalah…", o:["Ringkasan eksekutif hasil audit yang disederhanakan agar mudah dibaca investor ritel", "Seluruh temuan salah saji dan kelemahan pengendalian yang wajib diperbaiki manajemen sebelum auditor menandatangani opini audit", "Daftar lengkap semua risiko fraud yang ditemukan selama pemeriksaan tahun berjalan", "Hal paling signifikan dalam audit — dipilih dari yang dikomunikasikan ke tata kelola (bukan daftar semua risiko fraud)"], a:3},
 {q:"Estimasi yang paling butuh skeptisisme analis?", o:["Pinjaman bank","Saldo kas di bank","Modal saham disetor","ECL & impairment"], a:3},
 {q:"Ada paragraf penekanan going concern — analis harus…", o:["Menjual semua saham karena kebangkrutan sudah pasti", "Cek arus kas & jadwal jatuh tempo utang", "Mengabaikannya karena bukan modifikasi opini", "Menaikkan valuasi karena risiko sudah diungkap"], a:1},
 {q:"Transaksi pihak berelasi yang material — lensa utama?", o:["Lensa forensik","Lensa investasi","Lensa kredit","Bukan masalah besar"], a:0},
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
           window.FSAMistake.log(7, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). <a href=\"../modul-8/\">Lanjut ke Modul 8 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m7","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m7") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m7") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m7") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 7 sudah kamu lewati sebelumnya. <a href=\"../modul-8/\">Lanjut ke Modul 8 →</a></p>";
  }
}catch(e){}
})();
