/* FSA Lab — Modul 28: Forensik Dokumen (PT Tunas Cemerlang, FIKTIF, ilustratif) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
flags:{ title:"Checklist 10 red flag dokumen — satu saja terpenuhi belum vonis; yang berbahaya adalah POLANYA", cols:["Red flag","Sinyal","Acuan"],
 rows:[
  {l:"Opini audit tidak WTP / WTP dengan paragraf penekanan", v:"KRITIS", v2:"—",
   d:"Opini WTP (wajar tanpa pengecualian) adalah baseline. Opini modifikasian berarti opini diubah (mis. pengecualian) — berbeda dengan WTP dengan paragraf penekanan (emphasis of matter) soal kelangsungan usaha: opini tetap WTP, auditor hanya menarik perhatian ke pengungkapan yang sudah ada; 'gelisah' hanya tepat bila paragraf itu memang soal going concern — baca persis kalimat opininya, bukan ringkasan manajemen.",
   psak:"SA 705 / SA 706", f:"Investasi: diskon risiko naik. Kredit: covenant & going concern wajib dicek ulang. Forensik: opini adalah dokumen — siapa auditornya, sejak kapan?"},
  {l:"KAM (Key Audit Matters) baru — terutama soal pendapatan", v:"TINGGI", v2:"—",
   d:"KAM = hal yang paling menyita perhatian auditor. KAM baru tentang pengakuan pendapatan / estimasi = hal yang baru menyita perhatian signifikan tahun ini — bukan otomatis yang baru bermasalah. Bandingkan daftar KAM 3 tahun: yang baru muncul = yang baru menyita perhatian; uji apakah ada salah saji atau kelemahan di baliknya.",
   psak:"SA 701", f:"KAM bukan tuduhan — tapi peta tempat menggali. Cross-check ke footnote kebijakan pendapatan (PSAK 208)."},
  {l:"Restatement laporan keuangan", v:"KRITIS", v2:"—",
   d:"Laporan tahun lalu 'dikoreksi' = angka yang dulu kamu percayai ternyata salah. Restatement karena kesalahan (bukan perubahan kebijakan) merusak kredibilitas seluruh histori. Ukur: berapa % laba yang direvisi?",
   psak:"PSAK 208", f:"Satu restatement = kecelakaan. Dua = pola. Cek apakah restatement menyentuh pendapatan — itu yang paling beracun."},
  {l:"Pergantian auditor berulang", v:"TINGGI", v2:"—",
   d:"Ganti auditor sekali bisa wajar (rotasi). Dua-tiga kali dalam 3–4 tahun = bau: manajemen mungkin 'berbelanja opini' (opinion shopping) setelah auditor lama menolak kompromi. Baca alasan pergantian di keterbukaan.",
   psak:"—", f:"Cek di keterbukaan BEI: siapa yang memutus — perusahaan atau auditor yang mengundurkan diri? Yang kedua jauh lebih merah."},
  {l:"Perubahan kebijakan akuntansi tanpa alasan bisnis jelas", v:"TINGGI", v2:"—",
   d:"Ganti metode depresiasi, ganti pengakuan pendapatan, ganti model pengukuran — semua legal, tapi HARUS dijelaskan dan diterapkan retrospektif. Red flag: berubah di tahun laba tertekan, penjelasannya satu paragraf kabur.",
   psak:"PSAK 208", f:"Hitung dampak kuantitatif perubahan (wajib diungkap). Kalau 'tidak material' tapi mengubah arah laba — curigai definisi materialnya."},
  {l:"Transaksi pihak berelasi membesar / tak wajar", v:"TINGGI", v2:"—",
   d:"Penjualan ke entitas sepengendali, pinjaman ke direksi, sewa ke perusahaan keluarga. Wajar bila diungkap + arm's length. Red flag: porsinya tumbuh lebih cepat dari pendapatan, syaratnya tidak diungkap.",
   psak:"PSAK 224", f:"Tunneling klasik: laba dipompa lewat penjualan ke pihak berelasi, kas tak pernah kembali. Lacak: piutang berelasi vs kas diterima."},
  {l:"Provisi / kontinjensi melonjak atau justru tak diungkap", v:"SEDANG", v2:"—",
   d:"Gugatan hukum, garansi, kewajiban lingkungan — harus diakui bila probable & terukur, diungkap bila possible. Red flag dua arah: provisi tiba-tiba besar (big bath) atau gugatan material yang 'tidak diungkap karena belum probable'.",
   psak:"PSAK 237", f:"Bandingkan dengan berita publik: perusahaan digugat RpX miliar tapi footnote kontinjensi nihil = kebohongan dokumen."},
  {l:"Peristiwa setelah periode pelaporan yang material", v:"SEDANG", v2:"—",
   d:"Kebakaran pabrik, gagal bayar debitur besar, akuisisi — setelah tanggal neraca tapi sebelum laporan terbit. Yang adjusting (memberi bukti kondisi saat neraca) WAJIB disesuaikan; yang non-adjusting cukup diungkap. Red flag: diungkap samar sebagai 'peristiwa kemudian'.",
   psak:"PSAK 210", f:"Cek tanggal: laporan terbit 3 bulan setelah tutup buku — apa yang terjadi di antaranya dan tidak masuk angka?"},
  {l:"MD&A: tone berubah, boilerplate hilang/muncul, kalimat memanjang", v:"SEDANG", v2:"—",
   d:"Narasi manajemen adalah dokumen juga. Optimis → defensif, pengungkapan risiko yang tiba-tiba hilang, kalimat rata-rata 18 → 34 kata (readability turun = menyembunyikan). Lihat tab 'Teknik Teks & Angka'.",
   psak:"—", f:"Bahasa tidak bisa diaudit — justru itu celahnya. Bandingkan MD&A 3 tahun berdampingan, paragraf per paragraf. Acuan MD&A: ketentuan pasar modal/regulator, bukan PSAK 201 (PSAK 201 hanya mengatur penyajian laporan keuangan)."},
  {l:"Laba positif bertahun-tahun, arus kas operasi negatif", v:"TINGGI", v2:"—",
   d:"Laba adalah opini (akrual), kas adalah fakta. Divergensi laba-vs-kas yang melebar tahun demi tahun = kualitas laba membusuk: piutang tak tertagih, pendapatan fiktif, atau kapitalisasi biaya agresif.",
   psak:"PSAK 207", f:"Investasi: jangan bayar untuk laba yang tak jadi kas. Kredit: debt service dibayar dengan kas, bukan dengan laba."}
 ]},
foot:{ title:"Peta baca footnote — baca BERURUTAN; yang BERUBAH tahun-ke-tahun adalah sinyalnya", cols:["Catatan","Fokus baca","Acuan"],
 rows:[
  {l:"1 · Kebijakan akuntansi", v:"apa yang BERUBAH?", v2:"—",
   d:"Mulai SELALU dari sini: metode pengakuan pendapatan, depresiasi, persediaan, instrumen keuangan. Yang berubah vs tahun lalu = sinyal utama. Kebijakan yang stabil 5 tahun lalu tiba-tiba diganti di tahun sulit = manajemen sedang 'memasak'.",
   psak:"PSAK 208", f:"Minta angka dampak kuantitatif perubahan. 'Tidak material' tanpa angka = klaim tanpa bukti."},
  {l:"2 · Estimasi & pertimbangan signifikan", v:"asumsi kunci", v2:"—",
   d:"Umur manfaat aset, cadangan kerugian kredit (ECL), asumsi aktuaria, nilai wajar level 3. Di sinilah laba paling lentur: umur manfaat +2 tahun = beban depresiasi turun = laba naik, tanpa satu rupiah kas.",
   psak:"PSAK 208, PSAK 109 (dulu PSAK 71)", f:"Uji sensitivitas wajib diungkap untuk estimasi material. Asumsi yang selalu 'tepat di batas optimis' = pola."},
  {l:"3 · Pihak berelasi", v:"sifat + syarat + saldo", v2:"—",
   d:"Siapa, transaksinya apa, syaratnya (bunga? tenor? jaminan?), saldonya berapa. Red flag: syarat 'sesuai kesepakatan para pihak' tanpa angka — itu bukan pengungkapan, itu sensor.",
   psak:"PSAK 224", f:"Rekonsiliasi: penjualan ke berelasi RpX → piutang berelasi naik RpX? Kas masuk berapa? Selisihnya ke mana?"},
  {l:"4 · Kontinjensi & komitmen", v:"gugatan + garansi", v2:"—",
   d:"Gugatan hukum, sengketa pajak, garansi produk, komitmen belanja modal. 'Possible' cukup diungkap, 'probable' harus diakui. Red flag: perusahaan se-industri mengakui provisi serupa, perusahaan ini nihil.",
   psak:"PSAK 237", f:"Cross-check ke berita & putusan pengadilan publik. Dokumen yang diam soal fakta publik = dokumen yang berbohong."},
  {l:"5 · Peristiwa kemudian", v:"adjusting vs non-adjusting", v2:"—",
   d:"Tutup dengan ini: apa yang terjadi antara tanggal neraca dan tanggal terbit. Kebangkrutan debitur besar setelah tutup buku = bukti piutang sudah macet saat neraca (adjusting) — kalau hanya 'diungkap', angkanya salah saji.",
   psak:"PSAK 210", f:"Jendela 1–3 bulan ini favorit untuk menyembunyikan: cek keterbukaan BEI di periode yang sama."}
 ]},
teks:{ title:"Teknik teks & angka — membaca narasi seperti forensik, menguji angka seperti statistikawan", cols:["Teknik","Inti","Kapan dipakai"],
 rows:[
  {l:"Perubahan tone MD&A (optimis → defensif)", v:"bandingkan 3 tahun", v2:"—",
   d:"Manajemen yang percaya diri bicara spesifik & berangka; yang menyembunyikan bicara abstrak & defensif. Contoh ILUSTRATIF (fiktif): 2024 — 'Kami optimistis menyambut 2025. Permintaan inti tumbuh dua digit dan efisiensi biaya berjalan sesuai rencana.' 2025 — 'Manajemen berupaya semaksimal mungkin di tengah berbagai tantangan eksternal yang berada di luar kendali perseroan, dan akan terus memantau perkembangan kondisi yang dinamis ke depan.' Kata kabur ('berbagai', 'dinamis') menggantikan angka.",
   psak:"PSAK 201", f:"Buat daftar kata hedging ('mungkin', 'diupayakan', 'tantangan') per 100 kata, 3 tahun. Tren naik = kepercayaan turun. Coba redflag_scan di workbench."},
  {l:"Boilerplate yang tiba-tiba hilang / muncul", v:"diff paragraf", v2:"—",
   d:"Paragraf risiko yang ada 5 tahun lalu tiba-tiba lenyap tepat saat risikonya membesar — atau sebaliknya, disclaimer baru yang sangat panjang muncul untuk menutupi satu kalimat penting. Teknik: letakkan MD&A 3 tahun berdampingan, tandai paragraf yang hilang & yang baru.",
   psak:"—", f:"Yang DIHAPUS lebih informatif daripada yang ditambahkan. Tanya: risiko apa yang tidak lagi 'pantas' ditulis?"},
  {l:"Readability: kalimat makin panjang = menyembunyikan", v:"kata ÷ kalimat", v2:"—",
   d:"Riset forensik linguistik: kalimat yang memanjang + kata kabur yang bertambah = upaya mengaburkan. Hitung: total kata MD&A ÷ jumlah kalimat. Tunas Cemerlang (ilustratif): 18 → 34 kata/kalimat. Bukan bukti fraud — tapi alasan kuat untuk menggali footnote.",
   psak:"—", f:"Kombinasikan dengan tone: panjang + defensif = merah. Panjang + tetap berangka = mungkin hanya gaya bahasa baru."},
  {l:"Benford's Law — KAPAN VALID untuk jurnal", v:"dataset besar, angka natural", v2:"—",
   d:"Digit pertama angka-angka natural mengikuti pola: 1 muncul ~30,1%, 9 hanya ~4,6%. Berlaku bila: ribuan entri jurnal, angka 'terjadi' secara alami (nilai transaksi, saldo), tanpa batas atas/bawah artifisial. Deviasi signifikan = angka mungkin 'dibuat manusia' — manusia buruk dalam memalsukan keacakan.",
   psak:"—", f:"Jalankan benford_test di workbench pada export jurnal. Deviasi = sinyal untuk sampling audit, BUKAN vonis."},
  {l:"Benford's Law — KAPAN TIDAK valid", v:"angka assigned / dataset kecil", v2:"—",
   d:"JANGAN pakai Benford untuk: nomor faktur berurutan, kode akun, harga yang dipatok (mis. Rp9.999), data berbatas (threshold), atau sampel kecil (< ~1.000). Di sana deviasi adalah sifat data, bukan sinyal fraud. Kesalahan paling umum: memakai Benford lalu menuduh — itu pseudosains forensik.",
   psak:"—", f:"Aturan praktis: tanya dulu 'apakah angka ini BISA mengikuti Benford secara natural?' Kalau tidak — jangan diuji."}
 ]},
evid:{ title:"Hierarki evidensi — sinyal vs red flag vs bukti: kapan analis boleh menulis vonis", cols:["Tingkat","Arti","Tindakan"],
 rows:[
  {l:"1 · Sinyal — sesuatu yang menarik perhatian, belum berarti apa-apa", v:"catat", v2:"gali",
   d:"Sinyal adalah satu observasi yang tidak biasa: tone MD&A berubah, satu KAM baru muncul, satu angka menyimpang dari Benford. Satu sinyal tidak membuktikan apa pun — ia hanya berkata 'lihat ke sini'. Kesalahan paling umum: menulis sinyal seolah kesimpulan. Yang benar: catat sinyalnya, lalu cari yang kedua dari sumber yang BERBEDA.",
   psak:"—", f:"Sinyal yang tidak ditindaklanjuti = sinyal yang hilang. Sinyal yang langsung jadi vonis = analis yang melompat."},
  {l:"2 · Red flag — pola atau gabungan sinyal yang menaikkan probabilitas masalah", v:"uji hipotesis", v2:"cari pembanding",
   d:"Red flag naik satu tingkat bila sinyal-sinyal membentuk POLA atau datang dari sumber independen: piutang +89% DITAMBAH CFO < NI DITAMBAH opini berubah dari WTP — tiga sinyal independen yang menunjuk ke arah yang sama. Sepuluh red flag di checklist modul ini (tab pertama) masing-masing masih red flag, bukan vonis. Di tingkat ini analis merumuskan hipotesis ('pendapatan mungkin dipompa lewat channel stuffing') dan mengujinya — cek umur piutang, konsentrasi debitur, kas yang diterima setelah periode.",
   psak:"—", f:"Red flag yang diuji dan GAGAL terbukti = hipotesis yang gugur — itu hasil yang baik, bukan kegagalan. Red flag yang tidak pernah diuji = tuduhan yang belum lahir."},
  {l:"3 · Bukti — fakta terverifikasi yang bisa ditunjukkan ke pihak ketiga", v:"vonis boleh ditulis", v2:"tunjukkan sumbernya",
   d:"Bukti adalah fakta yang terverifikasi dan bisa direproduksi pihak lain: restatement yang mengakui kesalahan, angka yang direkonsiliasi ke dokumen sumber (kontrak, rekening koran, konfirmasi pihak ketiga), atau pengakuan manajemen yang tercatat. Baru di tingkat ini vonis boleh ditulis — dan vonisnya harus menyebut buktinya ('restatement 2024 mengakui pendapatan fiktif RpX') bukan red flag-nya. Aturan keras: satu red flag ≠ bukti; sepuluh sinyal dari sumber yang SAMA ≠ bukti (satu sumber yang salah menghitung sepuluh kali tetap satu kesalahan); bukti harus independen dari klaim yang diuji. Benford yang menyimpang = sinyal; Benford + piutang tak tertagih + kas tak masuk = red flag; konfirmasi debitur yang membantah saldo = bukti.",
   psak:"—", f:"Tanyakan sebelum menulis vonis: 'bila pihak yang saya tuduh membaca ini, bukti apa yang tidak bisa mereka bantah?' Bila jawabannya hanya red flag — tulis red flag-nya, bukan vonisnya."}
 ]},
mda:{ title:"MD&A: sumber regulasinya & batasnya — narasi manajemen BUKAN laporan keuangan", cols:["Sumber / batas","Isi","Cara pakai"],
 rows:[
  {l:"Sumber Indonesia: POJK 29/2016", v:"laporan tahunan emiten", v2:"—",
   d:"Analisis dan Pembahasan Manajemen (MD&A) wajib dimuat dalam Laporan Tahunan emiten atau perusahaan publik menurut POJK No. 29/POJK.04/2016 — bersama laporan keuangan audited, laporan tata kelola, dan tanggung jawab direksi/komisaris. Inilah sumber normatif MD&A emiten Indonesia — bukan standar akuntansi.",
   psak:"POJK 29/2016", f:"Kredit: MD&A yang tidak ada di laporan tahunan emiten = kewajiban pelaporan yang dilanggar — cek keterbukaan BEI."},
  {l:"Referensi praktik: SEC Regulation S-K Item 303", v:"emiten AS", v2:"pembanding",
   d:"Untuk emiten AS (dan sebagai pembanding praktik), MD&A diatur SEC Regulation S-K Item 303: pembahasan likuiditas, sumber daya modal, hasil operasi, dan tren yang diketahui. Berguna sebagai pembanding kualitas — MD&A emiten Indonesia yang baik menjawab pertanyaan yang sama.",
   psak:"SEC Reg S-K Item 303", f:"Investasi: bandingkan kedalaman MD&A emiten Indonesia dengan standar Item 303 — MD&A yang hanya mengulang angka LK tanpa analisis = MD&A yang tidak bekerja."},
  {l:"MD&A ≠ laporan keuangan", v:"laporan manajemen", v2:"bukan LK",
   d:"MD&A adalah LAPORAN MANAJEMEN (narasi + analisis + prospek), bukan bagian laporan keuangan yang diaudit. Angkanya harus konsisten dengan laporan keuangan, tetapi tingkat keyakinannya berbeda: auditor tidak memberi opini atas MD&A seperti atas laporan keuangan.",
   psak:"—", f:"Forensik: klaim MD&A yang tidak ada jejaknya di laporan keuangan audited = narasi tanpa jangkar — minta angka pendukungnya."},
  {l:"Catatan atas laporan keuangan (CaLK)", v:"bagian LK, diaudit", v2:"PSAK 201",
   d:"Berbeda dengan MD&A, catatan atas laporan keuangan (CaLK) ADALAH bagian laporan keuangan yang diaudit dan mengikuti PSAK 201 (penyajian). Bila MD&A dan CaLK bercerita berbeda tentang angka yang sama, CaLK yang dipegang — dan selisihnya ditanyakan.",
   psak:"PSAK 201", f:"Investasi: CaLK adalah sumber yang diaudit — MD&A adalah tafsir manajemen atas sumber itu. Pegang sumbernya, bukan tafsirnya."},
  {l:"Klaim prospektif di MD&A", v:"ekspektasi, bukan fakta", v2:"uji realisasi",
   d:"Pernyataan ke depan (target, proyeksi, rencana) di MD&A adalah ekspektasi manajemen — bukan fakta dan bukan janji. Analis mengujinya ke realisasi periode berikut: MD&A tahun lalu yang menjanjikan X, berapa yang benar-benar terjadi? Selisih yang berulang tanpa penjelasan adalah sinyal.",
   psak:"—", f:"Forensik: MD&A yang tiap tahun menjanjikan hal yang sama dan tiap tahun meleset = manajemen yang tidak belajar — atau tidak jujur."}
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
renderStmt("flags");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Opini WTP → WTP dengan paragraf penekanan kelangsungan usaha", q1:"Kredibilitas laporan", q2:"Risiko forensik", a1:"turun", a2:"naik",
  e:"Paragraf penekanan (SA 706) berarti auditor sendiri menandai keraguan material soal going concern. Kredibilitas turun, risiko forensik naik — baca persis kalimat opininya."},
 {t:"MD&A: kalimat rata-rata 18 → 34 kata, boilerplate risiko hilang", q1:"Readability", q2:"Risiko forensik", a1:"turun", a2:"naik",
  e:"Kalimat memanjang + pengungkapan risiko yang dihapus = pola pengaburan klasik. Readability turun, risiko forensik naik — gali footnote, jangan langsung menuduh."},
 {t:"Uji Benford pada 10.000 jurnal: deviasi digit-1 signifikan", q1:"Indikasi angka tak natural", q2:"Kewajiban investigasi lanjutan", a1:"naik", a2:"tetap",
  e:"Deviasi Benford = sinyal statistik, bukan bukti. Indikasi naik, tapi kewajiban investigasi TETAP ada — tanpa tindak lanjut, angka deviasi itu tidak berarti apa-apa."},
 {t:"Short-seller report: 4 dari 5 klaim ternyata opini tanpa sumber primer", q1:"Bobot tuduhan", q2:"Kewajiban verifikasi mandiri", a1:"turun", a2:"tetap",
  e:"Klaim tanpa sumber primer = opini berbaju data. Bobot tuduhan turun, tapi kewajiban verifikasi mandiri TETAP — laporan yang lemah tidak otomatis berarti perusahaan bersih."},
 {t:"Pergantian auditor 3x dalam 4 tahun + restatement laba −30%", q1:"Risiko forensik", q2:"Kepercayaan kreditur", a1:"naik", a2:"turun",
  e:"Opinion shopping + koreksi historis = dua red flag KRITIS sekaligus. Risiko forensik naik tajam; kreditur yang cermat menaikkan spread atau memperketat covenant."},
 {t:"Footnote: kebijakan pendapatan berubah + estimasi ECL melonggar di tahun yang sama", q1:"Kualitas laba", q2:"Risiko forensik", a1:"turun", a2:"naik",
  e:"Dua pelonggaran akuntansi di tahun yang sama, dua-duanya menaikkan laba (PSAK 208, PSAK 109 (dulu PSAK 71)). Kualitas laba turun; risiko forensik naik — hitung dampak kuantitatif keduanya."}
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
    try{ localStorage.setItem("fsa_pg_m28", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
  }
  $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  r.scrollIntoView({behavior:"smooth", block:"center"});
}
renderPg();

/* ---------- LAB UKUR ---------- */
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
 {q:"Rata-rata kata per kalimat MD&A 2025", hint:"1.190 kata ÷ 35 kalimat (ilustratif)", ans:34.0, dec:true, tol:0.5,
  why:"34,0 kata/kalimat — hampir 2x lipat dari 2024 (18). Readability jatuh: sinyal untuk menggali, bukan vonis."},
 {q:"Kenaikan panjang kalimat vs 2024 (%)", hint:"(34 − 18) ÷ 18 × 100% — 2024: 18 kata/kalimat (ilustratif)", ans:88.9, tol:0.8,
  why:"+88,9% — kalimat memanjang nyaris dua kali lipat dalam setahun. Perubahan sebesar ini jarang 'kebetulan gaya bahasa'."},
 {q:"Deviasi Benford digit-1 (poin persentase)", hint:"Observasi 42,0% − ekspektasi 30,1% — 10.000 jurnal (ilustratif)", ans:11.9, tol:0.3,
  why:"+11,9 pp di atas ekspektasi 30,1% — deviasi signifikan. Sinyal kuat untuk sampling audit; tetap bukan bukti fraud."},
 {q:"Skor checklist red flag (%)", hint:"4 dari 10 red flag terpenuhi × 100% (ilustratif — jumlah item terpenuhi, bukan probabilitas fraud)", ans:40.0, dec:true, tol:0.5,
  why:"40% — empat red flag termasuk pergantian auditor & KAM pendapatan. Satu red flag = waspada; empat = investigasi serius. Skor ini jumlah item terpenuhi — bukan probabilitas fraud."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 34,0">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 34,0)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — short-seller menuduh 'laba kertas'. Setelah 5 langkah verifikasi: klaim mana yang terbukti faktual, mana yang opini? Apakah harga sudah mencerminkan risikonya? Tulis 3 baris: temuan verifikasi, implikasi valuasi, keputusanmu.",
 credit:"Lensa kredit — KAM pendapatan + auditor berganti 2x + MD&A defensif. Berapa probabilitas angka yang kamu pakai untuk covenant itu salah saji? Tulis 3 baris: kualitas angka, mitigasi (covenant/collateral), kesimpulanmu.",
 forensic:"Lensa forensik — susun bukti seperti penyidik: dokumen primer apa yang kamu cek, angka apa yang kamu hitung ulang, dan di mana rantai buktinya putus? Tulis 3 baris: bukti terkuat, lubang terbesar, langkah berikut."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m28_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m28_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"MD&A Tunas Cemerlang: kalimat rata-rata 18 → 34 kata, tone optimis → defensif. Interpretasi forensik yang TEPAT…", o:["Bukti kuat manipulasi laba — segera laporkan ke regulator bursa dan hentikan analisis lebih lanjut karena sudah terbukti","Hanya gaya bahasa baru dari tim humas — abaikan saja tidak penting","Sinyal untuk investigasi lebih dalam — readability turun + tone defensif = pola pengaburan, bukan vonis","Hanya masalah editor naskah — tidak ada arti analitis sama sekali bagi analis fundamental yang membaca dengan cermat"], a:2},
 {q:"Benford's Law PALING valid untuk menguji…", o:["10.000 entri jurnal dengan angka natural (nilai transaksi)","Nomor faktur yang diberi nomor berurutan oleh sistem akuntansi","Kode akun 4 digit yang ditetapkan perusahaan secara berurutan","Sampel kecil berisi 40 transaksi pilihan auditor"], a:0},
 {q:"Langkah PERTAMA yang benar saat menerima short-seller report adalah…", o:["Menyebarluaskannya agar pasar tahu","Langsung menjual semua saham sebelum harganya jatuh","Menunggu klarifikasi manajemen","Memisahkan klaim faktual dari opini/interpretasi"], a:3},
 {q:"Saat membaca catatan atas laporan keuangan, urutan baca yang disarankan DIMULAI dari…", o:["Catatan pihak berelasi perusahaan","Kebijakan akuntansi — apa yang berubah tahun-ke-tahun","Liabilitas kontinjensi dan komitmen modal","Peristiwa setelah periode pelaporan yang memerlukan penyesuaian"], a:1},
 {q:"Dari daftar berikut, yang BUKAN red flag dokumen adalah…", o:["Restatement laba −30% karena kesalahan penyajian tahun lalu","Pergantian auditor 3x dalam 4 tahun","Opini WTP konsisten 5 tahun tanpa paragraf penekanan","KAM baru tentang pengakuan pendapatan"], a:2}];
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
           window.FSAMistake.log(28, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Phase 7 Tuntas ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu membaca dokumen seperti forensik: MD&A, tuduhan, footnote, Benford, dan checklist red flag. <a href=\"../modul-29/\">Lanjut ke Modul 29 →</a> — dan ingat: verifikasi, bukan ikut menuduh. 🎓</p>";
    try{ localStorage.setItem("fsa_gate_m28","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m28") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m28") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m28") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Phase 7 Tuntas ✓</h3><p>Modul 28 sudah kamu lewati sebelumnya — <a href=\"../modul-29/\">Lanjut ke Modul 29 →</a>.</p>";
  }
}catch(e){}
})();
