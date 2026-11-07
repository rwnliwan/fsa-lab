/* FSA Lab — Modul 43: IFRS 18 / PSAK 118 — Penyajian Baru & MPM (PT Cemerlang Abadi, Rp juta; angka kanonis CANONICAL-DATA.md; MPM 78.000 & dividen 5.000 ilustratif) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
kat:{ title:"Tiga kategori laba-rugi PSAK 118 — operating / investing / financing", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Operating — penjualan 520.000, HPP (338.000), beban operasi (110.000)", v:"72.000", v2:"operating profit",
   d:"Kategori operating menampung pendapatan dan beban dari aktivitas utama perusahaan. Cemerlang: 520.000 − 338.000 − 110.000 = 72.000. Kategori ini bersifat residual — pos yang tidak masuk investing atau financing jatuh ke sini.",
   psak:"PSAK 118 (IFRS 18)", f:"Kredit: operating profit 72.000 adalah laba dari bisnis inti — inilah yang membayar bunga dan pokok utang. Investasi: bandingkan operating profit antar perusahaan sejenis — kini definisinya sama. Forensik: cek pos 'lain-lain' di operating — one-off yang disembunyikan di sini menggelembungkan laba inti."},
  {l:"Investing — hasil aset yang memberi imbal hasil sendiri", v:"0", v2:"di demo Cemerlang",
   d:"Investing menampung hasil dari aset yang memberi imbal hasil secara mandiri — dividen dan bunga dari investasi, hasil sewa properti investasi, serta hasil pelepasan aset investasi. Di demo kanonis Cemerlang tidak ada pos investing, sehingga kategorinya 0 dan profit before financing and income taxes sama dengan operating profit.",
   psak:"PSAK 118 (IFRS 18)", f:"Kredit: pisahkan hasil investing dari laba inti — dividen investasi tidak membayar utang seandalan laba operasi. Investasi: hasil investing yang berulang layak dinilai; yang sekali jadi jangan dikapitalisasi ke valuasi. Forensik: laba jual aset 8.000 (one-off kanonis) — telusuri kategorinya di catatan, jangan diasumsikan masuk operating."},
  {l:"Financing — bunga utang bank 14.000", v:"(14.000)", v2:"PBT 58.000",
   d:"Financing menampung beban atas liabilitas pendanaan — bunga utang bank 14.000 di Cemerlang. Bunga kini selalu di bawah operating profit: 72.000 − 14.000 = 58.000 (PBT). Total laba tidak berubah — hanya letak bunganya yang pindah ke kategori sendiri.",
   psak:"PSAK 118 (IFRS 18)", f:"Kredit: bunga di financing membuat coverage (72.000 ÷ 14.000 = 5,14x) terbaca dari dua subtotal standar. Investasi: struktur pendanaan kini terpisah dari kinerja operasi — leverage terbaca lebih bersih. Forensik: bunga yang 'hilang' dari operating tanpa muncul di financing = reklasifikasi tidak lengkap."}
 ]},
sub:{ title:"Dua subtotal wajib — operating profit & profit before financing and income taxes", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Operating profit 72.000 — subtotal wajib pertama", v:"72.000", v2:"520.000−338.000−110.000",
   d:"PSAK 118 mewajibkan operating profit sebagai subtotal: total kategori operating. Dulu tiap perusahaan mendefinisikan EBIT sendiri — kini satu definisi untuk semua. Di Cemerlang, operating profit 72.000 sama dengan EBIT kanonis; yang berubah adalah statusnya: dari label bebas menjadi subtotal standar.",
   psak:"PSAK 118 (IFRS 18)", f:"Kredit: operating profit standar = penyebut coverage yang bisa dibandingkan antar debitur. Investasi: margin operasi 13,8% (72.000 ÷ 520.000) kini apel-ke-apel antar emiten. Forensik: operating profit yang melonjak tanpa penjualan naik = beban operasi dipindah kategori — cek catatan reklasifikasi."},
  {l:"Profit before financing and income taxes 72.000 — subtotal wajib kedua", v:"72.000", v2:"72.000 + investing 0",
   d:"Subtotal wajib kedua: operating profit + hasil investing. Di demo Cemerlang investing = 0, sehingga subtotal ini 72.000 — sama dengan operating profit. Bila perusahaan punya dividen investasi, di sinilah bedanya terlihat: subtotal ini menangkap seluruh laba sebelum pendanaan dan pajak.",
   psak:"PSAK 118 (IFRS 18)", f:"Kredit: subtotal ini mengukur laba sebelum beban pendanaan — dasar menilai kemampuan bayar bunga. Investasi: selisih subtotal ini dengan operating profit = kontribusi investing — kecil di Cemerlang, besar di holding company. Forensik: selisih besar yang tidak dijelaskan di catatan = minta rincian investing."},
  {l:"PBT 58.000 dan laba bersih 45.240 — total TIDAK berubah", v:"45.240", v2:"58.000 − 12.760",
   d:"Setelah financing (bunga 14.000) dan pajak 12.760 (22% × 58.000), laba bersih tetap 45.240 — persis angka kanonis. PSAK 118 mengubah penyajian, bukan laba: 72.000 − 14.000 = 58.000 dan 58.000 − 12.760 = 45.240. Analis yang mengira laba 'naik' karena operating profit kini tampil hanya tertipu label.",
   psak:"PSAK 118 (IFRS 18)", f:"Kredit: PBT dan NI yang sama = kapasitas bayar tidak berubah; yang berubah hanya keterbandingan. Investasi: jangan membayar premi valuasi untuk 'kenaikan' operating profit yang hanya reklasifikasi. Forensik: NI berubah setelah adopsi PSAK 118 = reklasifikasi salah, atau ada perubahan kebijakan lain yang disembunyikan."}
 ]},
mpm:{ title:"MPM — ukuran kinerja definisi manajemen, dengan rekonsiliasi wajib", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"MPM — ukuran kinerja definisi manajemen", v:"78.000", v2:"ilustratif",
   d:"Management-Defined Performance Measure (MPM) adalah subtotal laba-rugi yang didefinisikan manajemen, dipakai dalam komunikasi publik di luar laporan keuangan, dan bukan subtotal yang ditentukan IFRS. Contoh ilustratif Cemerlang: 'laba operasi disesuaikan' 78.000 = operating profit 72.000 + biaya restrukturisasi 6.000 yang dikeluarkan manajemen.",
   psak:"PSAK 118 (IFRS 18)", f:"Kredit: MPM bukan angka standar — jangan pakai MPM sebagai penyebut covenant tanpa rekonsiliasi. Investasi: MPM yang selalu lebih tinggi dari operating profit = manajemen yang selalu mengeluarkan biaya 'sekali jadi'. Forensik: MPM tanpa rekonsiliasi = klaim tanpa jejak — tolak sebagai bukti."},
  {l:"Rekonsiliasi wajib — ke subtotal IFRS terdekat", v:"72.000 + 6.000", v2:"= 78.000",
   d:"Setiap MPM wajib direkonsiliasi ke subtotal IFRS yang paling dekat, dalam satu catatan: operating profit 72.000 + biaya restrukturisasi 6.000 (ilustratif) = MPM 78.000. Rekonsiliasi menunjukkan tiap item penyesuaian — analis melihat persis apa yang dikeluarkan manajemen dan berapa besarnya.",
   psak:"PSAK 118 (IFRS 18)", f:"Kredit: baca tiap item rekonsiliasi — penyesuaian yang berulang tiap tahun bukan 'sekali jadi'. Investasi: bandingkan MPM antar perusahaan hanya setelah rekonsiliasi — definisi MPM tiap perusahaan berbeda. Forensik: item rekonsiliasi tanpa angka pajak dan NCI = pengungkapan belum lengkap."},
  {l:"Alasan pemakaian + efek pajak & NCI tiap item", v:"satu catatan", v2:"semua MPM",
   d:"Pengungkapan MPM juga wajib menjelaskan mengapa MPM dipakai, bagaimana MPM dihitung, serta efek pajak dan efek kepentingan nonpengendali (NCI) untuk tiap item rekonsiliasi. MPM boleh dipakai manajemen — tetapi jejaknya harus lengkap sehingga analis bisa membangun ulang angka itu dari laporan keuangan.",
   psak:"PSAK 118 (IFRS 18)", f:"Kredit: efek pajak per item menunjukkan apakah penyesuaian benar-benar menambah laba setelah pajak. Investasi: MPM tanpa efek pajak = angka sebelum pajak yang terlihat lebih besar dari seharusnya. Forensik: NCI yang diabaikan = MPM mengklaim laba yang sebagian milik pihak lain."}
 ]},
analis:{ title:"Apa yang berubah bagi analis — komparabilitas, historis, jejak MPM", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Komparabilitas naik — operating profit satu definisi", v:"13,8%", v2:"72.000 ÷ 520.000",
   d:"Dulu 'EBIT' tiap perusahaan beda isi — ada yang mengeluarkan restrukturisasi, ada yang tidak. Kini operating profit punya satu definisi standar, sehingga margin operasi 13,8% Cemerlang bisa dibandingkan langsung dengan emiten sejenis. Perbandingan antar perusahaan tidak lagi butuh normalisasi definisi.",
   psak:"PSAK 118 (IFRS 18)", f:"Kredit: peer comparison untuk covenant kini memakai penyebut yang sama. Investasi: screening margin operasi lintas emiten menjadi lebih sejajar. Forensik: perusahaan yang operating profit-nya tiba-tiba 'membaik' saat adopsi — cek apa yang pindah kategori."},
  {l:"Reklasifikasi historis — komparatif 2024 disajikan ulang", v:"48.000", v2:"operating profit 2024",
   d:"Saat adopsi, angka komparatif disajikan ulang ke format baru: operating profit 2024 = 48.000 (400.000 − 264.000 − 88.000), bunga 10.000 di financing, PBT 38.000, pajak 8.360, NI 29.640 — semua sama dengan angka kanonis 2024. Tren 48.000 → 72.000 (+50,0%) tetap terbaca, kini dengan kategori yang konsisten.",
   psak:"PSAK 118 (IFRS 18)", f:"Kredit: tren dua tahun kini apel-ke-apel — covenant berbasis tren tidak rusak adopsi. Investasi: pertumbuhan operating profit 50,0% adalah pertumbuhan riil, bukan efek reklasifikasi. Forensik: NI komparatif yang ikut berubah = red flag — reklasifikasi tidak boleh mengubah total."},
  {l:"MPM kini bisa diaudit jejaknya", v:"1 catatan", v2:"rekonsiliasi wajib",
   d:"Sebelum PSAK 118, 'laba disesuaikan' manajemen hidup di siaran pers tanpa aturan — analis tidak bisa menelusuri dari mana angka itu berasal. Kini setiap MPM wajib punya rekonsiliasi di satu catatan laporan keuangan. MPM tidak dilarang — tetapi tidak bisa lagi bersembunyi dari rekonsiliasi.",
   psak:"PSAK 118 (IFRS 18)", f:"Kredit: MPM yang direkonsiliasi bisa diuji — MPM tanpa rekonsiliasi tidak dipakai dalam memo kredit. Investasi: rekonsiliasi adalah peta dari angka manajemen ke angka standar — ikuti petanya sebelum percaya. Forensik: MPM yang definisinya berubah tiap tahun = manajemen yang menggeser gawang."}
 ]},
bunga:{ title:"Klasifikasi bunga & dividen — mengikuti bisnis utama entitas", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Non-bank (Cemerlang): bunga dibayar → financing", v:"(14.000)", v2:"financing",
   d:"Untuk entitas yang bisnis utamanya bukan pendanaan atau investasi, bunga atas utang masuk kategori financing. Bunga utang bank Cemerlang 14.000 mengurangi laba setelah operating profit — bukan di dalamnya. Prinsipnya: bunga adalah harga pendanaan, bukan biaya operasi.",
   psak:"PSAK 118 (IFRS 18)", f:"Kredit: bunga di financing = coverage 5,14x terbaca langsung dari subtotal standar. Investasi: pisahkan biaya pendanaan dari kinerja operasi saat menilai manajemen. Forensik: bunga operasi yang dikapitalisasi atau dipindah kategori = cek kebijakan akuntansi."},
  {l:"Dividen & bunga diterima dari investasi → investing", v:"ilustratif", v2:"bukan operating",
   d:"Untuk entitas non-bank, dividen dan bunga dari investasi masuk kategori investing — aset itu memberi imbal hasil sendiri, terpisah dari aktivitas utama. Ilustrasi: dividen 5.000 dari portofolio investasi menaikkan profit before financing and income taxes menjadi 77.000, tanpa mengubah operating profit 72.000.",
   psak:"PSAK 118 (IFRS 18)", f:"Kredit: hasil investing bukan kas operasi berulang — jangan andalkan untuk membayar utang. Investasi: dividen investasi yang stabil layak dinilai terpisah dari bisnis inti. Forensik: dividen dari entitas berelasi yang diklasifikasi operating = laba inti yang digelembungkan."},
  {l:"Bank & entitas pendanaan: bunga & dividen → operating", v:"bisnis utama", v2:"kategori mengikuti",
   d:"Klasifikasi mengikuti bisnis utama entitas. Bank meminjamkan dan menghimpun dana sebagai aktivitas utama — bunga yang diterima dan dibayar bank masuk kategori operating. Aturan yang sama berlaku untuk entitas investasi yang bisnis utamanya mengelola investasi. Analis wajib membaca kebijakan klasifikasi entitas sebelum membandingkan.",
   psak:"PSAK 118 (IFRS 18)", f:"Kredit: operating profit bank sudah mengandung bunga — jangan bandingkan mentah dengan operating profit manufaktur. Investasi: pahami dulu apa bisnis utama emiten sebelum menafsir kategorinya. Forensik: bank yang memindah bunga ke investing agar operating profit terlihat 'bersih' = klasifikasi melawan bisnis utama."}
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
        + (r.f && r.f !== "—" ? '<div class="forensic"><strong>Tiga lensa:</strong> '+r.f+'</div>' : '');
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
renderStmt("kat");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Beban bunga 14.000 dipindah dari operating ke financing", q1:"Operating profit", q2:"Laba bersih", a1:"naik", a2:"tetap",
  e:"Bila bunga tetap di operating, laba operasi tinggal 72.000 − 14.000 = 58.000; setelah pindah ke financing, operating profit tampil penuh 72.000. Laba bersih tetap 45.240 — bunga tetap mengurangi laba, hanya kategorinya yang pindah."},
 {t:"MPM 'laba disesuaikan' mengeluarkan biaya restrukturisasi 6.000 (ilustratif)", q1:"MPM yang dilaporkan", q2:"Operating profit (IFRS)", a1:"naik", a2:"tetap",
  e:"MPM = 72.000 + 6.000 = 78.000 (ilustratif) — lebih tinggi dari operating profit karena satu biaya dikeluarkan. Operating profit IFRS tetap 72.000: MPM tidak mengubah angka standar, ia hanya menyajikan versi manajemen di sampingnya."},
 {t:"Dividen diterima 5.000 (ilustratif) diklasifikasi ke investing, bukan operating", q1:"Operating profit", q2:"Profit before financing and income taxes", a1:"tetap", a2:"naik",
  e:"Dividen masuk investing, sehingga operating profit tetap 72.000. Tetapi profit before financing and income taxes = 72.000 + 5.000 = 77.000 (naik). Inilah gunanya subtotal kedua: menangkap hasil investing tanpa mencemari laba operasi."},
 {t:"Sebuah bank memindah bunga kredit 10.000 (ilustratif) dari investing ke operating", q1:"Operating profit bank", q2:"Investing category bank", a1:"naik", a2:"turun",
  e:"Bagi bank, memberi kredit adalah bisnis utama — bunga kredit 10.000 masuk operating, sehingga operating profit naik 10.000 dan investing turun 10.000. Klasifikasi mengikuti bisnis utama entitas, bukan bentuk arusnya."},
 {t:"Komparatif 2024 disajikan ulang ke format PSAK 118", q1:"Laba bersih 2024", q2:"Keterbandingan tren 2024–2025", a1:"tetap", a2:"naik",
  e:"Laba bersih 2024 tetap 29.640 — reklasifikasi tidak mengubah total. Yang naik adalah keterbandingan: operating profit 48.000 → 72.000 kini memakai definisi yang sama di kedua tahun, sehingga tren +50,0% terbaca tanpa normalisasi definisi."},
 {t:"Manajemen wajib melampirkan rekonsiliasi untuk setiap MPM", q1:"Keterlacakan MPM ke angka IFRS", q2:"Operating profit (IFRS)", a1:"naik", a2:"tetap",
  e:"Rekonsiliasi wajib membuat setiap MPM bisa ditelusuri ke subtotal IFRS terdekat — 'laba disesuaikan' 78.000 kini harus menunjukkan 72.000 + 6.000. Operating profit tetap 72.000: aturan baru mengikat pengungkapan MPM, bukan mengubah laba standar."}
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
    try{ localStorage.setItem("fsa_pg_m43", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
  }
  $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  r.scrollIntoView({behavior:"smooth", block:"center"});
}
renderPg();

/* ---------- LAB HITUNGAN ---------- */
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
 {q:"Operating profit IFRS 18 Cemerlang 2025 (Rp juta)", hint:"Penjualan 520.000 − HPP 338.000 − beban operasi 110.000", ans:72000, dec:false, tol:1,
  why:"72.000 — subtotal wajib pertama PSAK 118; sama dengan EBIT kanonis, kini berdefinisi standar untuk semua perusahaan."},
 {q:"Profit before financing and income taxes 2025 (Rp juta)", hint:"Operating profit 72.000 + investing 0 (Cemerlang tak punya pos investing di demo ini)", ans:72000, dec:false, tol:1,
  why:"72.000 — subtotal wajib kedua; sama dengan operating profit di demo ini karena investing = 0. Selisih kedua subtotal ini = kontribusi investing."},
 {q:"PBT 2025 setelah bunga pindah ke financing (Rp juta)", hint:"72.000 − bunga 14.000 (financing)", ans:58000, dec:false, tol:1,
  why:"58.000 — total TIDAK berubah: 72.000 − 14.000 = 58.000. Bunga hanya pindah kategori, bukan hilang."},
 {q:"Laba bersih 2025 (Rp juta)", hint:"PBT 58.000 − pajak 12.760 (22% × 58.000)", ans:45240, dec:false, tol:1,
  why:"45.240 — persis laba bersih kanonis: 58.000 − 12.760 = 45.240. Reklasifikasi mengubah penyajian, bukan laba."},
 {q:"MPM 'laba operasi disesuaikan' 2025 (Rp juta, ilustratif)", hint:"Operating profit 72.000 + biaya restrukturisasi 6.000 (ilustratif)", ans:78000, dec:false, tol:1,
  why:"78.000 (ilustratif) — MPM wajib direkonsiliasi: 72.000 + 6.000. Tanpa rekonsiliasi ini, MPM tidak memenuhi syarat pengungkapan PSAK 118."},
 {q:"Manajemen melaporkan MPM 78.000 tanpa rekonsiliasi. Menurut PSAK 118, analis harus…", hint:"Ingat syarat pengungkapan MPM di tab MPM.",
  mc:["Menerima 78.000 sebagai pengganti operating profit 72.000 dalam analisis","Menuntut rekonsiliasi ke operating profit 72.000 sebelum memakai MPM","Memakai 78.000 untuk menghitung PBT dan laba bersih","Mengabaikan operating profit 72.000 karena MPM lebih baru"], a:1,
  why:"Menuntut rekonsiliasi — MPM tanpa rekonsiliasi ke subtotal IFRS terdekat tidak memenuhi syarat pengungkapan PSAK 118. MPM melengkapi, bukan menggantikan, angka standar."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>';
    if(r.mc){
      h += '<div class="pg-opts" style="justify-content:flex-start;flex-wrap:wrap">';
      r.mc.forEach(function(o,j){ h += '<button data-mc="'+i+'" data-opt="'+j+'">'+o+'</button>'; });
      h += '</div><div class="ratio-in"><button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div>';
    } else {
      h += '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Ketik jawabanmu…">'
        + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div>';
    }
    h += '</div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap .pg-opts button").forEach(function(b){
    b.addEventListener("click", function(){
      var sib = b.parentElement.querySelectorAll("button");
      sib.forEach(function(x){x.classList.remove("sel");}); b.classList.add("sel");
    });
  });
  $$("#ratio-wrap button[data-r]").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var el = $("#rr"+i);
      el.className = "pg-result show";
      var ok;
      if(r.mc){
        var sel = document.querySelector('button[data-mc="'+i+'"].sel');
        if(!sel){ el.innerHTML = "Pilih dulu salah satu jawaban, baru tekan Cek."; return; }
        ok = (+sel.dataset.opt === r.a);
        $$('button[data-mc="'+i+'"]').forEach(function(x){
          x.classList.remove("right","wrong");
          if(+x.dataset.opt === r.a) x.classList.add("right");
          else if(x === sel) x.classList.add("wrong");
        });
      } else {
        var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
        if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu."; return; }
        ok = Math.abs(v - r.ans) <= r.tol;
      }
      el.innerHTML = ok ? "<strong>Tepat ✓</strong> "+r.why : "<strong>Belum tepat.</strong> "+r.why;
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Cemerlang Abadi 2025: operating profit 72.000 (margin 13,8%), MPM 'laba disesuaikan' 78.000 (ilustratif), NI 45.240. Tulis 3 baris: apakah MPM 78.000 mengubah keputusanmu — angka apa yang kamu pakai + dari mana, keputusanmu (beli / tunggu / hindari) + SATU hal yang membunuh tesismu.",
 credit:"Lensa kredit — Cemerlang: operating profit 72.000, bunga 14.000 (financing), coverage 5,14x, NI 45.240. Tulis 3 baris: bagaimana subtotal standar membantumu menilai kemampuan bayar, satu covenant berbasis operating profit yang kamu minta, keputusanmu.",
 forensic:"Lensa forensik — PSAK 118 baru (efektif 1 Jan 2027), MPM 78.000 (ilustratif) = 72.000 + 6.000. Tulis 3 baris: apa yang kamu verifikasi dulu (rekonsiliasi MPM? kategori bunga?), satu uji konsistensi internal, dan satu temuan yang membuatmu menolak mentah-mentah."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m43_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m43_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"Di bawah PSAK 118, pendapatan dan beban dari aktivitas utama perusahaan — penjualan, HPP, beban operasi — masuk kategori…", o:["Kategori operating","Kategori investing","Kategori financing","Kategori pajak penghasilan"], a:0},
 {q:"Subtotal yang wajib disajikan PSAK 118 di laporan laba rugi adalah…", o:["Operating profit — subtotal kategori operating","EBITDA — subtotal laba sebelum bunga, pajak, dan depresiasi","Laba kotor — subtotal penjualan dikurangi HPP","Laba komprehensif — subtotal laba bersih ditambah OCI"], a:0},
 {q:"Manajemen Cemerlang melaporkan MPM 'laba operasi disesuaikan' 78.000 (ilustratif). Pengungkapan yang wajib menyertai MPM ini adalah…", o:["Rekonsiliasi ke operating profit 72.000, alasan MPM dipakai, dan efek pajak tiap item","Pernyataan manajemen bahwa MPM 78.000 menggantikan operating profit sebagai ukuran utama","Perhitungan MPM dari data internal tanpa acuan ke angka laporan keuangan","Pengungkapan MPM hanya di siaran pers, tanpa catatan di laporan keuangan"], a:0},
 {q:"Cemerlang Abadi (perusahaan non-bank) membayar bunga utang 14.000. Di bawah PSAK 118, bunga ini masuk kategori…", o:["Financing — bunga atas liabilitas pendanaan","Operating — bunga dibayar atas utang usaha","Investing — bunga atas aset yang memberi imbal hasil","Pajak penghasilan — bunga sebagai beban fiskal"], a:0},
 {q:"Dampak utama PSAK 118 bagi analis yang membandingkan dua perusahaan sejenis adalah…", o:["Definisi operating profit yang sama membuat perbandingan antar perusahaan lebih sejajar","Laba bersih kedua perusahaan menjadi sama karena rumus pajak dan tarif diseragamkan","MPM tiap perusahaan menjadi ukuran resmi yang menggantikan subtotal IFRS di laporan laba rugi","Biaya restrukturisasi tidak lagi muncul di laporan laba rugi kedua perusahaan"], a:0}];
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
           window.FSAMistake.log(43, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Modul 43 Tuntas ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu bisa menyusun ulang laba rugi ke format PSAK 118 (operating / investing / financing), memakai operating profit dan profit before financing and income taxes sebagai subtotal standar, menuntut rekonsiliasi untuk setiap MPM, mengklasifikasi bunga mengikuti bisnis utama entitas, dan membedakan laba baru dari penyajian baru. Kembali ke <a href=\"/\">FSA Lab</a>.</p>";
    try{ localStorage.setItem("fsa_gate_m43","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m43") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m43") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m43") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Modul 43 Tuntas ✓</h3><p>Modul 43 sudah kamu lewati sebelumnya — kembali ke <a href=\"/\">FSA Lab</a>.</p>";
  }
}catch(e){}
})();
