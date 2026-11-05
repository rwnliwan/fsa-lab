/* FSA Lab — Modul 22: Pihak Berelasi & Tunneling (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
rel:{ title:"Peta pihak berelasi 2025 (Rp juta)", cols:["Pos","2025","% dari pos induk"],
 rows:[
  {l:"Penjualan ke pihak berelasi", v:"120.000", v2:"23,1% dari 520.000", d:"Hampir seperempat penjualan ke entitas yang dikendalikan pemegang saham yang sama. Harga jualnya wajar atau 'harga saudara'?", psak:"PSAK 224 (dulu 7)", f:"Penjualan berelasi tumbuh >> penjualan pihak ketiga = laba bisa 'dipesan'."},
  {l:"Piutang pihak berelasi (neto)", v:"52.000", v2:"50,0% dari 104.000", d:"Setengah piutang menumpuk di afiliasi. Piutang berelasi menua diam-diam — tak ada debt collector menagih saudara sendiri.", psak:"PSAK 224 (dulu 7)", f:"Piutang berelasi >> penjualan berelasi = kas tak pernah kembali; cek umur piutang di catatan."},
  {l:"Pembelian dari afiliasi", v:"180.000", v2:"53,3% dari HPP 338.000", d:"Lebih dari setengah HPP dibeli dari afiliasi. Margin bisa digeser naik-turun lewat harga beli ini.", psak:"PSAK 224 (dulu 7)", f:"Pemasok tunggal yang berelasi = transfer pricing dua arah."},
  {l:"Utang usaha ke afiliasi", v:"30.000", v2:"48,4% dari 62.000", d:"Utang ke afiliasi jarang ditagih agresif — fleksibel, tapi juga bisa jadi 'tabungan' laba.", psak:"—", f:"Utang berelasi yang tak kunjung dibayar = ekuitas terselubung."},
  {l:"Pinjaman diberikan ke afiliasi", v:"40.000", v2:"bunga 4%", d:"Dipinjamkan ke afiliasi dengan bunga 4% saat pasar 12%. Selisih 8% = subsidi Rp3.200/th yang tak tercatat sebagai beban.", psak:"—", f:"Pinjaman murah ke afiliasi = dividen terselubung untuk pengendali."},
  {l:"Jaminan silang untuk utang afiliasi", v:"80.000", v2:"off-balance-sheet", d:"Menjamin utang afiliasi Rp80.000. Nol rupiah di neraca — sampai afiliasinya gagal bayar.", psak:"PSAK 237 (dulu 57)", f:"Jaminan silang = utang yang menunggu giliran pindah ke neracamu."}
 ]},
tun:{ title:"Tiga skema tunneling — berapa bocornya? (Rp juta/th)", cols:["Skema","Mekanisme","Bocor/th"],
 rows:[
  {l:"1 · Transfer pricing", v:"Jual 120.000 di 80% harga pasar", v2:"30.000", d:"Harga wajar = 120.000 ÷ 0,8 = 150.000. Selisih 30.000/th pindah diam-diam ke afiliasi. (Ilustrasi: harga pasar diestimasi dari pembanding.)", psak:"—", f:"Margin segmen berelasi anjlok vs segmen independen = jejak transfer pricing."},
  {l:"2 · Pinjaman murah ke afiliasi", v:"40.000 @4% vs pasar 12%", v2:"3.200", d:"40.000 × (12% − 4%) = 3.200/th subsidi bunga. Pemegang saham minoritas ikut menanggung, tak ikut menikmati.", psak:"—", f:"Bandingkan yield pinjaman berelasi vs yield pasar — selisihnya = tunneling terukur."},
  {l:"3 · Jaminan silang", v:"Menjamin utang afiliasi 80.000", v2:"s/d 80.000", d:"Biaya di laporan = 0. Tapi jika afiliasi default, 80.000 jatuh ke Cemerlang — 44,6% dari ekuitas 179.440.", psak:"PSAK 237 (dulu 57)", f:"Baca catatan kontinjensi: jaminan ke pihak berelasi adalah utang yang belum lahir."},
  {l:"Total kebocoran terukur", v:"—", v2:"33.200 + risiko 80.000", d:"30.000 + 3.200 = 33.200/th terukur, PLUS risiko kontinjensi 80.000. Bandingkan dengan laba bersih 45.240.", psak:"—", f:"Tunneling 73% dari laba = laba akuntansi milik pengendali, bukan milikmu."}
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
renderStmt("rel");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Penjualan ke afiliasi naik 2× lipat, margin grup tetap", q1:"Risiko tunneling", q2:"Kualitas laba", a1:"naik", a2:"turun",
  e:"Laba 'naik' tapi didorong transaksi yang harganya dikontrol pengendali. Analis memberi diskon pada laba berelasi."},
 {t:"Piutang berelasi Rp52.000 dilunasi tunai penuh", q1:"Risiko tunneling", q2:"Kas", a1:"turun", a2:"naik",
  e:"Kas kembali = bukti transaksi berelasi itu riil. Piutang berelasi yang tak pernah dilunasi = dividen terselubung."},
 {t:"Pinjaman ke afiliasi dinaikkan jadi Rp100.000 @4%", q1:"Subsidi bunga per tahun", q2:"Kas bebas", a1:"naik", a2:"turun",
  e:"Subsidi jadi 100.000 × 8% = 8.000/th. Kas perusahaan bekerja untuk afiliasi, bukan untukmu."},
 {t:"Transfer pricing dikoreksi ke harga pasar penuh", q1:"Kebocoran per tahun", q2:"Laba operasi", a1:"turun", a2:"naik",
  e:"Kebocoran 30.000/th berhenti; laba operasi naik 30.000. Inilah kenapa otoritas pajak mengincar transfer pricing."},
 {t:"Afiliasi yang dijamin (Rp80.000) gagal bayar", q1:"Kewajiban kontinjensi", q2:"Ekuitas", a1:"naik", a2:"turun",
  e:"Jaminan berubah jadi utang sungguhan 80.000 — 44,6% ekuitas lenyap dalam sehari. Inilah bahaya off-balance-sheet."},
 {t:"Restrukturisasi sepengendali dicatat per PSAK 338", q1:"Laba dari transaksi", q2:"Selisih dicatat ke", a1:"tetap", a2:"naik",
  e:"PSAK 338: transfer antar entitas sepengendali pakai NILAI BUKU — tak boleh ada laba dari jual-beli dengan diri sendiri. Selisihnya masuk ekuitas."}
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
    try{ localStorage.setItem("fsa_pg_m22", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Konsentrasi penjualan berelasi 2025 (%)", hint:"Penjualan berelasi ÷ penjualan × 100: 120.000 ÷ 520.000 × 100", ans:23.1, tol:0.3,
  why:"23,1% — hampir seperempat penjualan ke pihak yang harganya bisa diatur pengendali."},
 {q:"Konsentrasi piutang berelasi 2025 (%)", hint:"Piutang berelasi ÷ piutang neto × 100: 52.000 ÷ 104.000 × 100", ans:50.0, dec:true, tol:0.5,
  why:"50,0% — setengah piutang di afiliasi. Lebih tinggi dari porsi penjualannya (23,1%) = kas tak kembali."},
 {q:"Kebocoran transfer pricing (Rp juta/th)", hint:"Harga wajar − harga jual: 120.000 ÷ 0,8 − 120.000", ans:30000, dec:false, tol:500,
  why:"30.000/th — 66% dari laba bersih 45.240 mengalir keluar lewat 'harga saudara'."},
 {q:"Subsidi bunga pinjaman afiliasi (Rp juta/th)", hint:"Pinjaman × (bunga pasar − bunga afiliasi): 40.000 × (12% − 4%)", ans:3200, dec:false, tol:100,
  why:"3.200/th — dividen terselubung yang tak pernah lewat laporan laba rugi."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 23,1">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (boleh desimal koma, contoh: 23,1)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — 23,1% penjualan & 50% piutang melibatkan afiliasi; kebocoran terukur 33.200/th vs laba 45.240. Berapa diskon yang pantas untuk saham ini? Tulis 3 baris.",
 credit:"Lensa kredit — Jaminan silang 80.000 (= 44,6% ekuitas) untuk utang afiliasi + pinjaman murah 40.000 @4%. Syarat kredit apa yang kamu pasang sebelum cairkan?",
 forensic:"Lensa forensik — Piutang berelasi 50% tapi penjualan berelasi cuma 23,1%. Tulis 3 cek catatan kaki untuk membuktikan kasnya benar-benar kembali."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m22_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m22_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"PSAK 224 (dulu PSAK 7) mengatur…", o:["Pengakuan pendapatan dari kontrak pelanggan termasuk estimasi imbalan variabel","Pengungkapan pihak berelasi (definisi, sifat transaksi, saldo, syarat)","Sewa dan hak-guna aset: pengakuan oleh penyewa dan lessor serta pengungkapannya","Penurunan nilai aset non-keuangan dan pengujian impairment"], a:1},
 {q:"Tunneling lewat transfer pricing artinya…", o:["Mencuri kas tunai dari brankas perusahaan secara langsung","Menggelapkan pajak dengan faktur fiktif","Memindahkan laba lewat harga tidak wajar ke afiliasi","Menjual aset di bawah nilai buku ke pihak ketiga independen"], a:2},
 {q:"Red flag paling tajam di catatan pihak berelasi…", o:["Struktur grup dengan puluhan entitas afiliasi di banyak negara berbeda","Seluruh transaksi berelasi dalam mata uang rupiah saja","Afiliasi utama berdomisili di yurisdiksi luar negeri","Piutang berelasi tumbuh jauh lebih cepat dari penjualan berelasi"], a:3},
 {q:"Pinjaman ke afiliasi bunga 4% saat pasar 12% = …", o:["Efisiensi pendanaan di dalam grup usaha yang terintegrasi","Subsidi tersembunyi — dividen untuk pengendali","Biaya bunga yang wajar dan normal","Investasi jangka panjang perusahaan"], a:1},
 {q:"Jaminan silang (cross guarantee) berbahaya karena…", o:["Kewajiban afiliasi bisa jatuh ke perusahaan tanpa tercatat di neraca","Menaikkan beban bunga pinjaman perusahaan induk","Melanggar ketentuan PSAK 338 yang berlaku saat ini","Jaminan silang selalu menguntungkan karena menurunkan bunga pinjaman grup"], a:0}
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
           window.FSAMistake.log(22, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓ — Phase 5 berlanjut!</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Pihak berelasi sudah bisa kamu baca. <a href=\"../modul-23/\">Lanjut ke Modul 23 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m22","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m22") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m22") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m22") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 22 sudah kamu lewati sebelumnya. <a href=\"../modul-23/\">Lanjut ke Modul 23 →</a></p>";
  }
}catch(e){}
})();
