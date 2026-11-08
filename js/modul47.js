/* FSA Lab — Modul 47: Linkage Metrik Non-Finansial (PT Cemerlang Abadi, Rp juta; angka kanonis CANONICAL-DATA.md; metrik non-finansial — 8.000 pelanggan, retensi 85%, belanja Rp65 juta — ilustratif) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
lead:{ title:"Leading vs lagging — metrik yang mendahului vs mencatat", cols:["Pos","Peran","Contoh"],
 rows:[
  {l:"Leading vs lagging — metrik yang mendahului vs mencatat", v:"leading mendahului", v2:"lagging mencatat",
   d:"Lagging indicator mencatat hasil yang sudah terjadi — laba bersih, penjualan kuartal lalu. Leading indicator bergerak SEBELUM hasil keuangan — retensi pelanggan hari ini DAPAT memprediksi penjualan berulang besok, tetapi hanya bila hubungan itu teruji terhadap data historis (lihat baris 'Memvalidasi leading indicator' di tab ini): efek tertunda, churn selektif, perubahan harga/mix, dan cohort yang berbeda dapat mematahkannya. Waktu pengiriman memprediksi kepuasan dan pembelian ulang — dengan syarat yang sama. Analis butuh keduanya: lagging untuk menilai, leading untuk memprediksi.",
   psak:"—", f:"Kredit: lagging menunjukkan kemampuan bayar kemarin — leading menunjukkan apakah debitur masih bisa bayar besok. Investasi: perusahaan yang hanya melaporkan lagging = kamu selalu melihat spion. Forensik: leading yang tiba-tiba 'membaik' tanpa lagging menyusul = metrik yang dipoles, bukan kinerja."},
  {l:"Rantai sebab-akibat — metrik harus punya mekanisme", v:"mekanisme", v2:"bukan sekadar korelasi",
   d:"Metrik non-finansial berguna bila ada MEKANISME yang menghubungkannya ke uang: retensi naik → pelanggan bertahan → pembelian berulang → penjualan naik. Tanpa mekanisme, metrik hanya angka yang bergerak bersamaan secara kebetulan. Uji sederhananya: bila metrik ini berubah, ceritakan langkah demi langkah bagaimana laba ikut berubah — bila ceritanya putus di tengah, metrik itu bukan driver.",
   psak:"—", f:"Kredit: mekanisme yang jelas membuat proyeksi debitur bisa diuji — bukan sekadar 'tren bagus'. Investasi: driver tree yang rantainya putus = valuasi yang berdiri di atas asumsi kosong. Forensik: metrik tanpa mekanisme yang selalu dikutip manajemen = metrik pajangan."},
  {l:"Memvalidasi leading indicator — cohort, lag, out-of-sample", v:"uji, bukan klaim", v2:"3 langkah",
   d:"Klaim 'retensi memprediksi penjualan' harus DIUJI, bukan dipercaya — tiga langkah. (1) COHORT: pisahkan pelanggan per kohort (mis. pelanggan baru Q1 vs Q2) dan bandingkan retensinya — bila retensi agregat 85% ternyata 95% di kohort lama dan 60% di kohort baru, agregatnya menipu. (2) LAG: retensi kuartal ini harus memprediksi penjualan berulang kuartal BERIKUTNYA — uji: retensi 85% × 8.000 pelanggan × belanja Rp65 juta = penjualan berulang prediksi 442.000 (dari total 520.000; sisanya 78.000 dari pelanggan baru). Bila realisasi kuartal berikut meleset >5% dari 442.000, retensi bukan prediktor yang baik — ada faktor lain (harga, churn selektif, mix). (3) OUT-OF-SAMPLE: uji hubungan itu pada periode yang TIDAK dipakai untuk menemukannya — mis. temukan pola di 2023, uji di 2024. Pola yang hanya 'berhasil' di data yang sama dengan data penemunya = overfitting, bukan prediksi.",
   psak:"—", f:"Kredit: proyeksi debitur yang leading indicator-nya tidak pernah divalidasi = proyeksi yang belum diuji. Investasi: perusahaan yang mengklaim retensi 'memprediksi' tanpa satu pun uji cohort/lag = klaim pemasaran, bukan analisis. Forensik: leading yang 'terbukti' hanya di satu periode yang dipilih = cherry-picking periode — minta periode lain."},
  {l:"Ujung driver tree Cemerlang — penjualan 520.000 dari dua metrik", v:"8.000 × 65", v2:"= 520.000",
   d:"Driver tree ilustratif Cemerlang: 8.000 pelanggan aktif (ilustratif) × belanja rata-rata Rp65 juta per pelanggan (ilustratif) = penjualan 520.000 (kanonis). Dari sini: × margin kotor 35% = laba kotor 182.000, − beban operasi 110.000 = EBIT 72.000 (semua kanonis). Setiap simpul bisa diuji: bila pelanggan naik 375, penjualan naik 24.375.",
   psak:"—", f:"Kredit: driver tree membuat proyeksi bisa diuji simpul per simpul — bukan satu angka 'penjualan naik 12%' tanpa jejak. Investasi: metrik ujung yang kanonis + metrik hulu yang ilustratif = bedakan mana fakta laporan, mana asumsi. Forensik: pelanggan yang naik tetapi belanja per pelanggan jatuh = pertumbuhan yang dibeli dengan diskon."}
 ]},
pilih:{ title:"Memilih metrik — driver, definisi tetap, sedikit tetapi menentukan", cols:["Kriteria","Aturan","Contoh"],
 rows:[
  {l:"Driver, bukan vanity — metrik harus menggerakkan uang", v:"uji driver", v2:"bukan pajangan",
   d:"Vanity metric terlihat mengesankan tetapi tidak menggerakkan keputusan atau laba — jumlah follower, jumlah unduhan, jumlah kunjungan laman. Driver metric menggerakkan uang: retensi, belanja per pelanggan, tingkat cacat. Uji: bila metrik ini naik 10% tetapi laba tidak bergerak, ia bukan driver — ia pajangan.",
   psak:"—", f:"Kredit: debitur yang memamerkan vanity metric di memo kredit = minta driver-nya. Investasi: valuasi yang bertumpu pada vanity metric = valuasi atas kesan, bukan arus kas. Forensik: metrik yang selalu naik tetapi laba stagnan = metrik yang tidak terhubung ke bisnis."},
  {l:"Spesifik dan bisa diukur ulang — definisi yang sama tiap periode", v:"definisi tetap", v2:"dapat diaudit",
   d:"Metrik yang baik punya definisi yang TETAP dan bisa diukur ulang pihak lain: 'pelanggan aktif' harus berarti hal yang sama bulan ini dan bulan depan — bukan 'pelanggan yang pernah beli sekali dalam 2 tahun' di kuartal ini lalu 'yang login minggu lalu' di kuartal depan. Definisi yang bergeser = tren yang tidak bisa dibandingkan.",
   psak:"—", f:"Kredit: definisi yang berubah tiap periode membuat tren tidak bisa dipakai untuk covenant. Investasi: tren metrik yang definisinya bergeser = tren yang tidak bisa dipercaya. Forensik: perubahan definisi diam-diam tepat saat metrik memburuk = manipulasi definisi."},
  {l:"Data dictionary & governance metrik — siapa pemiliknya, dari mana, jejaknya", v:"pemilik · sumber · jejak", v2:"3 metrik Cemerlang",
   d:"Tiap metrik butuh DATA DICTIONARY — satu baris per metrik: definisi operasional, PEMILIK data (siapa yang bertanggung jawab atas angkanya), SUMBER sistem (CRM? kasir? survei?), frekuensi pemutakhiran, dan AUDIT TRAIL (bisakah angka ini dilacak ke transaksi asalnya?). Contoh Cemerlang: pelanggan aktif — pemilik: tim CRM; sumber: database penjualan; frekuensi: bulanan; jejak: tiap pelanggan = ID transaksi. Retensi — pemilik: analis retensi; sumber: CRM + penjualan; frekuensi: kuartalan; jejak: kohort per bulan akuisisi. Belanja per pelanggan — pemilik: keuangan; sumber: penjualan ÷ pelanggan aktif; frekuensi: bulanan; jejak: rekonsiliasi ke penjualan 520.000. Metrik tanpa pemilik = metrik yang tidak ada yang menjaga; metrik tanpa jejak audit = angka yang tidak bisa diverifikasi.",
   psak:"—", f:"Kredit: debitur yang tidak bisa menunjukkan sumber sistem satu metrik andalannya = metrik yang belum bisa dipakai covenant. Investasi: perusahaan tanpa data dictionary = metriknya bisa bergeser tanpa ada yang tahu. Forensik: metrik yang sumbernya 'laporan manajemen' tanpa sistem di belakangnya = angka yang ditulis, bukan angka yang diukur."},
  {l:"Sedikit tetapi menentukan — 3–5 driver, bukan 30 metrik", v:"3–5 driver", v2:"fokus",
   d:"Driver tree yang baik punya 3–5 metrik kunci, bukan 30. Tiap metrik tambahan yang tidak menggerakkan keputusan hanya menambah noise dan biaya pengukuran. Aturannya: bila satu metrik tidak mengubah satu pun keputusanmu, buang. Cemerlang cukup dengan tiga: pelanggan aktif, retensi, belanja per pelanggan. Contoh definisi operasional — tetapkan SEBELUM mengukur, lalu jangan digeser: pelanggan aktif = pelanggan yang membeli minimal sekali dalam 12 bulan terakhir; retensi = pelanggan aktif tahun lalu yang membeli lagi tahun ini ÷ pelanggan aktif tahun lalu (periode observasi 12 bulan); belanja per pelanggan = penjualan ÷ pelanggan aktif. Bila kanal berbeda perilakunya (toko vs online), pisahkan definisinya per kanal.",
   psak:"—", f:"Kredit: 30 metrik dalam memo = tidak ada yang benar-benar dipantau. Investasi: perusahaan yang tahu 3 driver-nya = manajemen yang tahu bisnisnya. Forensik: metrik yang berlipat ganda tiap tahun = manajemen yang menyembunyikan driver yang memburuk di antara yang membaik."}
 ]},
bobot:{ title:"Memboboti metrik — normalisasi, bobot dari dampak, driver tree", cols:["Langkah","Cara","Contoh"],
 rows:[
  {l:"Satuan beda tidak bisa dijumlah — normalisasi dulu", v:"skor 0–100", v2:"baru dibobot",
   d:"Retensi 85%, waktu pengiriman 3 hari, pelanggan 8.000 — satuannya beda, angka mentahnya tidak bisa dijumlah. Caranya: NORMALISASI tiap metrik ke skala yang sama (mis. skor 0–100 terhadap target atau terhadap rentang historis), BARU beri bobot dan jumlahkan. Menjumlah angka mentah = menjumlah persen dengan hari dengan orang.",
   psak:"—", f:"Kredit: skor komposit tanpa normalisasi = angka yang satuannya tidak bermakna. Investasi: ranking perusahaan dari skor mentah yang tidak dinormalisasi = ranking yang menyesatkan. Forensik: bobot yang berubah tiap tahun tanpa alasan = skor yang digeser agar hasilnya bagus."},
  {l:"Bobot dari dampak, bukan dari kemudahan ukur", v:"dampak ke laba", v2:"bukan kemudahan",
   d:"Bobot metrik harus mencerminkan DAMPAKNYA pada laba, bukan seberapa mudah ia diukur. Retensi yang menggerakkan penjualan berulang layak berbobot besar; metrik yang mudah diukur tetapi dampaknya kecil layak berbobot kecil — atau dibuang. Bobot yang baik diuji: ubah bobot sedikit — bila kesimpulan berubah drastis, bobotmu belum kokoh.",
   psak:"—", f:"Kredit: bobot berbasis kemudahan ukur = penilaian yang mengukur apa yang gampang, bukan apa yang penting. Investasi: skor yang didominasi metrik gampang = skor yang tidak membedakan perusahaan bagus dan jelek. Forensik: bobot yang tiba-tiba berubah saat metrik andalan memburuk = skor yang direkayasa."},
  {l:"Uji sensitivitas bobot — hitung, bukan rasa", v:"rentang & ambang", v2:"contoh hitungan",
   d:"'Ubah bobot sedikit' harus DIHITUNG, bukan dirasa — contoh Cemerlang, skor dinormalisasi terhadap target (retensi 85% dari target 90% = 94,4; belanja 65 dari target 70 = 92,9; pelanggan 8.000 dari target 8.500 = 94,1). Bobot dasar 50/30/20 → skor komposit 0,50×94,4 + 0,30×92,9 + 0,20×94,1 = 93,9. Geser bobot retensi 50→60 (sisanya 24/16) → 0,60×94,4 + 0,24×92,9 + 0,16×94,1 = 94,0 — hanya +0,11 poin: kesimpulan stabil terhadap perubahan bobot ini. Uji ambang: bila retensi jatuh ke 80% (skor 88,9), komposit menjadi 91,1 — masih di atas ambang 90. Aturannya: laporkan RENTANG skor (bobot minimum–maksimum yang masuk akal) dan AMBANG yang bila dilewati mengubah keputusan — bukan satu angka komposit tanpa konteks.",
   psak:"—", f:"Kredit: skor komposit tanpa uji sensitivitas = angka yang rapuh — satu perubahan bobot bisa membalik keputusan kredit. Investasi: ranking yang berbalik bila bobot digeser sedikit = ranking yang tidak bisa dipakai. Forensik: bobot yang 'kebetulan' membuat skor melewati ambang tepat di tahun yang dibutuhkan = skor yang direkayasa — minta rentangnya."},
  {l:"Driver tree — dari metrik hulu ke laba hilir", v:"rantai", v2:"bisa diuji",
   d:"Driver tree menyusun metrik dari hulu (operasional) ke hilir (keuangan): retensi → pelanggan aktif → penjualan → laba kotor → EBIT. Tiap simpul punya rumus dan angka, sehingga satu perubahan di hulu bisa ditelusuri dampaknya ke hilir — dan sebaliknya, satu penyimpangan di hilir bisa dilacak ke simpul hulunya. Inilah yang membuat metrik non-finansial bisa diaudit, bukan sekadar dikagumi.",
   psak:"—", f:"Kredit: driver tree membuat proyeksi debitur bisa diuji simpul per simpul. Investasi: perusahaan tanpa driver tree = proyeksi tanpa jejak. Forensik: simpul yang angkanya tidak bisa direkonsiliasi ke laporan = simpul yang dikarang."}
 ]},
jebak:{ title:"Jebakan — korelasi bukan kausalitas, Goodhart's law, cherry-picking", cols:["Jebakan","Tanda","Pertahanan"],
 rows:[
  {l:"Korelasi bukan kausalitas — bergerak bersama ≠ saling menyebabkan", v:"faktor ketiga", v2:"kebetulan",
   d:"Dua metrik bisa bergerak bersama karena faktor ketiga, atau murni kebetulan: penjualan es krim dan kasus tenggelam sama-sama naik di musim panas — bukan karena es krim menyebabkan tenggelam. Sebelum memakai satu metrik untuk memprediksi metrik lain, tanyakan: adakah mekanisme? Apakah hubungan ini bertahan bila faktor ketiga dikendalikan? Bila tidak, itu korelasi — bukan driver.",
   psak:"—", f:"Kredit: proyeksi yang bertumpu pada korelasi tanpa mekanisme = proyeksi yang runtuh saat faktor ketiga berubah. Investasi: 'setiap kali X naik, laba naik' tanpa mekanisme = pola yang bisa hilang besok. Forensik: korelasi yang dikutip tanpa uji = klaim yang belum diuji."},
  {l:"Goodhart's law — metrik yang jadi target, lalu rusak", v:"target merusak ukuran", v2:"Goodhart",
   d:"Begitu suatu ukuran menjadi TARGET, ia berhenti menjadi ukuran yang baik: orang mengoptimalkan ukurannya, bukan kinerjanya. Target 'jumlah pelanggan baru' tanpa retensi → tim memberi diskon besar untuk menarik pelanggan yang cepat pergi: jumlah pelanggan naik, laba turun. Target NPS 90 → tim menekan pelanggan memberi skor tinggi: skor naik, kepuasan tidak.",
   psak:"—", f:"Kredit: covenant berbasis satu metrik = undangan untuk mengoptimalkan metrik itu. Investasi: perusahaan yang targetnya satu metrik = manajemen yang bermain untuk skor. Forensik: metrik yang melonjak tepat setelah dijadikan target = metrik yang sudah rusak — cari ukuran kedua yang tidak ditargetkan."},
  {l:"Cherry-picking — memilih metrik yang bagus, menyembunyikan yang buruk", v:"seluruh sampel", v2:"bukan pilihan",
   d:"Cherry-picking adalah memilih metrik, periode, atau pembanding yang membuat kinerja terlihat bagus — dan menyembunyikan sisanya. Pertahanan: minta SELURUH set metrik yang didefinisikan di awal periode, periode yang sama tiap tahun, dan pembanding yang sama. Metrik yang muncul tiba-tiba saat metrik lama memburuk = metrik pengganti, bukan perbaikan.",
   psak:"—", f:"Kredit: memo yang hanya menampilkan metrik yang membaik = memo yang belum lengkap. Investasi: perusahaan yang mengganti metrik andalannya tiap tahun = perusahaan yang menyembunyikan tren. Forensik: metrik lama yang hilang dari laporan tanpa penjelasan = temuan — tanyakan ke mana ia pergi."}
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
renderStmt("lead");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Retensi naik 85% → 90%, pelanggan baru tetap 1.625 (ilustratif)", q1:"Pelanggan akhir", q2:"Penjualan", a1:"naik", a2:"naik",
  e:"Pelanggan bertahan: 7.500 × 90% = 6.750 (dari 6.375); pelanggan akhir = 6.750 + 1.625 = 8.375. Penjualan = 8.375 × 65 = 544.375 (naik 24.375 dari 520.000). Retensi adalah leading indicator: naiknya retensi hari ini = naiknya penjualan besok."},
 {t:"Belanja rata-rata per pelanggan naik 10% (65 → 71,5), pelanggan tetap 8.000 (ilustratif)", q1:"Penjualan", q2:"EBIT (beban operasi tetap)", a1:"naik", a2:"naik",
  e:"Penjualan = 8.000 × 71,5 = 572.000 (naik 52.000). Laba kotor = 572.000 × 35% = 200.200; EBIT = 200.200 − 110.000 = 90.200 (naik dari 72.000). Driver hulu yang naik mengalir ke hilir — asalkan margin dan opex tidak ikut berubah."},
 {t:"Jumlah follower media sosial naik 2×, tetapi tingkat konversi ke pembelian tidak berubah", q1:"Penjualan", q2:"Risiko salah keputusan bila follower dijadikan target", a1:"tetap", a2:"naik",
  e:"Follower yang tidak membeli adalah vanity metric — penjualan tetap karena tidak ada mekanisme dari follower ke pembelian. Risikonya naik: begitu follower dijadikan target, tim mengoptimalkan follower (konten viral, giveaway) bukan pembeli — Goodhart's law bekerja."},
 {t:"NPS dijadikan target bonus; tim mulai menekan pelanggan memberi skor 9–10", q1:"Skor NPS yang dilaporkan", q2:"Nilai prediktif NPS terhadap pembelian ulang", a1:"naik", a2:"turun",
  e:"Skor naik karena tekanan, bukan karena kepuasan — ukurannya rusak sebagai target. Nilai prediktifnya turun: NPS yang tinggi kini tidak lagi memprediksi pembelian ulang, karena skornya dipaksa. Inilah Goodhart's law — dan alasan memakai ukuran kedua yang tidak ditargetkan."},
 {t:"Manajemen memilih metrik karena mudah diukur, bukan karena mendorong laba", q1:"Kemudahan pengukuran", q2:"Kekuatan prediksi metrik ke laba", a1:"naik", a2:"turun",
  e:"Metrik yang mudah diukur memang gampang dilaporkan — tetapi bila dampaknya ke laba kecil, kekuatan prediksinya rendah. Memilih metrik dari kemudahan ukur = mengukur apa yang gampang, bukan apa yang penting."},
 {t:"Pelanggan baru naik 1.625 → 2.000, retensi tetap 85% (ilustratif)", q1:"Pelanggan akhir", q2:"Penjualan", a1:"naik", a2:"naik",
  e:"Pelanggan bertahan tetap 6.375; pelanggan akhir = 6.375 + 2.000 = 8.375 — sama seperti skenario retensi 90%. Penjualan = 8.375 × 65 = 544.375. Dua jalan berbeda (retensi vs akuisisi) bisa sampai ke angka yang sama — driver tree menunjukkan jalan mana yang lebih murah dan lebih tahan lama."}
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
    try{ localStorage.setItem("fsa_pg_m47", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Penjualan 2025 dari driver tree — 8.000 pelanggan × Rp65 juta (ilustratif, Rp juta)", hint:"8.000 × 65", ans:520000, dec:false, tol:1,
  why:"520.000 — driver tree: pelanggan aktif × belanja per pelanggan = penjualan kanonis; 8.000 × 65 = 520.000."},
 {q:"Pelanggan yang bertahan — 7.500 pelanggan awal × retensi 85% (ilustratif)", hint:"7.500 × 0,85", ans:6375, dec:false, tol:1,
  why:"6.375 — retensi 85% dari 7.500 pelanggan awal bertahan; sisanya 1.125 pergi dan harus diganti pelanggan baru."},
 {q:"Pelanggan baru 2025 — pelanggan akhir 8.000 − yang bertahan 6.375 (ilustratif)", hint:"8.000 − 6.375", ans:1625, dec:false, tol:1,
  why:"1.625 — pelanggan baru = pelanggan akhir − yang bertahan; 8.000 − 6.375 = 1.625. Pertumbuhan neto hanya 500 (8.000 − 7.500) karena 1.125 pelanggan lama pergi."},
 {q:"Laba kotor 2025 dari penjualan — 520.000 × margin kotor 35% (Rp juta)", hint:"520.000 × 0,35", ans:182000, dec:false, tol:1,
  why:"182.000 — laba kotor kanonis: 520.000 × 35% = 182.000; margin kotor adalah simpul penghubung penjualan ke laba."},
 {q:"Sensitivitas retensi — penjualan bila retensi naik ke 90% (ilustratif, Rp juta)", hint:"Bertahan 7.500 × 90% = 6.750; pelanggan akhir 6.750 + 1.625 = 8.375; × 65", ans:544375, dec:false, tol:1,
  why:"544.375 — retensi 90% → 8.375 pelanggan → 8.375 × 65 = 544.375 (naik 24.375); satu perubahan di hulu mengalir ke hilir."},
 {q:"Manajemen menetapkan target 'jumlah pelanggan baru' tanpa mengaitkan ke retensi; tim memberi diskon besar untuk menarik pelanggan yang cepat pergi. Ini contoh…", hint:"Ingat hukum tentang metrik yang dijadikan target di tab Jebakan.",
  mc:["Goodhart's law — metrik yang dijadikan target kehilangan nilainya sebagai ukuran","Korelasi yang membuktikan diskon menyebabkan pertumbuhan pelanggan","Driver tree yang rantai sebab-akibatnya sudah lengkap","Normalisasi metrik yang satuannya berbeda"], a:0,
  why:"Goodhart's law — begitu jumlah pelanggan baru menjadi target, tim mengoptimalkan jumlahnya (diskon besar) bukan kinerjanya (pelanggan yang bertahan dan membeli ulang)."}
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
 invest:"Lensa investasi — Cemerlang (ilustratif): 8.000 pelanggan, retensi 85%, belanja Rp65 juta/pelanggan → penjualan 520.000, laba kotor 182.000, EBIT 72.000. Tulis 3 baris: metrik non-finansial mana yang paling kamu percaya sebagai prediktor laba — dan kenapa, keputusanmu (beli / tunggu / hindari) + SATU hal yang membunuh tesismu.",
 credit:"Lensa kredit — Cemerlang: retensi 85% (ilustratif), penjualan 520.000, EBIT 72.000, bunga 14.000, coverage 5,14x. Tulis 3 baris: metrik non-finansial apa yang kamu jadikan early warning untuk kemampuan bayar, satu covenant berbasis metrik itu yang kamu minta, keputusanmu.",
 forensic:"Lensa forensik — metrik non-finansial Cemerlang semuanya ilustratif (bukan data laporan). Tulis 3 baris: apa yang kamu verifikasi dulu (definisi metrik? sumber data? konsistensi periode?), satu uji konsistensi antara metrik dan angka keuangan, dan satu temuan yang membuatmu menolak mentah-mentah."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m47_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m47_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"Manakah yang merupakan leading indicator?", o:["Laba bersih kuartal lalu setelah pajak dan dividen","Tingkat retensi pelanggan kuartal ini","Total penjualan tahun lalu","Saldo kas di akhir tahun"], a:1},
 {q:"Manakah yang merupakan vanity metric?", o:["Retensi pelanggan yang berkorelasi dengan penjualan berulang","Waktu pengiriman yang memengaruhi kepuasan dan pembelian ulang","Tingkat cacat produksi yang menaikkan biaya garansi","Jumlah follower media sosial tanpa kaitan ke penjualan"], a:3},
 {q:"Goodhart's law menyatakan bahwa…", o:["Metrik yang dijadikan target kehilangan nilainya sebagai ukuran","Metrik yang diukur berulang kali dengan alat yang sama memberi hasil berbeda","Metrik keuangan lebih akurat daripada metrik operasional","Metrik yang naik berarti kinerja perusahaan pasti membaik"], a:0},
 {q:"Cara yang benar memboboti metrik yang satuannya berbeda adalah…", o:["Menjumlahkan angka mentahnya apa adanya","Memilih metrik dengan angka terbesar sebagai yang terpenting","Mengubah tiap metrik ke skor sebanding, lalu membobotnya","Mengabaikan satuan dan memakai metrik yang paling mudah diukur"], a:2},
 {q:"Pernyataan yang benar tentang korelasi dan kausalitas adalah…", o:["Korelasi yang kuat membuktikan satu metrik menyebabkan metrik lain","Dua metrik bisa bergerak bersama tanpa saling menyebabkan","Korelasi nol berarti kedua metrik tidak berhubungan sama sekali","Kausalitas hanya bisa dibuktikan dari laporan keuangan auditan"], a:1}];
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
           window.FSAMistake.log(47, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Modul 47 Tuntas ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu bisa membedakan leading dari lagging indicator, memilih driver bukan vanity metric, memboboti metrik beda satuan lewat normalisasi, membangun driver tree dari metrik hulu ke laba hilir, dan mengenali korelasi palsu, Goodhart's law, dan cherry-picking. Kembali ke <a href=\"/\">FSA Lab</a>.</p>";
    try{ localStorage.setItem("fsa_gate_m47","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m47") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m47") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m47") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Modul 47 Tuntas ✓</h3><p>Modul 47 sudah kamu lewati sebelumnya — kembali ke <a href=\"/\">FSA Lab</a>.</p>";
  }
}catch(e){}
})();
