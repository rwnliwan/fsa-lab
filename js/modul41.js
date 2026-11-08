/* FSA Lab — Modul 41: Imbalan Pascakerja — Mekanika Pensiun (PERUSAHAAN ILUSTRATIF — PT Sejahtera Abadi (fiktif), Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
dcdb:{ title:"Siapa menanggung risiko — pemberi kerja atau karyawan?", cols:["Pos","Angka","Makna"],
 rows:[
  {l:"Iuran pasti (DC) — iuran tetap, manfaat mengikuti hasil investasi", v:"risiko: karyawan", v2:"iuran Rp250",
   d:"Pemberi kerja hanya membayar iuran tetap (ilustratif Rp250 juta) ke dana pensiun; manfaat yang diterima karyawan = akumulasi iuran + hasil investasinya. Bila investasi jeblok, pensiun karyawan yang menyusut — pemberi kerja tidak menutup selisihnya, dan tidak ada DBO di neraca pemberi kerja.",
   psak:"PSAK 219 = IAS 19", f:"Kredit: tidak ada liabilitas pensiun tersembunyi — risiko neraca kecil. Investasi: beban pensiun = iuran yang dibayar, mudah diprediksi. Forensik: klaim 'program DC' tapi perusahaan menanggung kekurangan dana = itu DB yang menyamar — cek janji manfaatnya."},
  {l:"Manfaat pasti (DB) — manfaat dijanjikan, iuran menyesuaikan", v:"risiko: pemberi kerja", v2:"DBO Rp5.610",
   d:"Manfaat pensiun dijanjikan dengan rumus (mis. gaji akhir × masa kerja × 2% per tahun). Pemberi kerja wajib menutup berapa pun biayanya: bila aset program kurang, selisihnya menjadi liabilitas neto di neraca — ilustratif di sini DBO Rp5.610 juta − aset program Rp4.570 juta = liabilitas neto Rp1.040 juta.",
   psak:"PSAK 219 = IAS 19", f:"Kredit: liabilitas neto Rp1.040 juta adalah utang ekonomi — tambahkan ke utang saat menilai leverage. Investasi: beban DB berayun dengan asumsi aktuaria, bukan dengan operasi. Forensik: perusahaan yang beralih DB→DC sedang memindahkan risiko ke karyawan — cek biaya transisinya."},
  {l:"Membaca perbedaannya di laporan", v:"DBO vs iuran", v2:"cek catatan",
   d:"Program DC hanya muncul sebagai beban iuran di laba rugi. Program DB muncul di TIGA tempat: liabilitas neto di neraca, beban service cost + net interest di laba rugi, dan remeasurement di OCI. Cara membaca catatan imbalan kerja sudah diajarkan di M7 — di sini kita belajar mekanika di balik angka-angkanya.",
   psak:"PSAK 219", f:"Kredit: DB tanpa aset program (unfunded) = janji dibayar dari kas masa depan. Investasi: bandingkan beban pensiun P&L dengan iuran kas — selisihnya adalah akrual yang menumpuk. Forensik: DBO besar + aset program kecil + OCI berayun = volatilitas yang disembunyikan dari laba bersih."}
 ]},
dbo:{ title:"Kewajiban imbalan pasti — nilai kini seluruh janji pensiun masa depan", cols:["Pos","Angka","Makna"],
 rows:[
  {l:"DBO — nilai kini pembayaran pensiun masa depan", v:"Rp5.610", v2:"akhir periode",
   d:"Defined Benefit Obligation (DBO) = nilai kini seluruh pembayaran pensiun yang dijanjikan kepada karyawan, didiskonto ke hari ini. Ilustratif: DBO awal Rp5.000 juta → DBO akhir Rp5.610 juta. DBO bukan kas yang harus dibayar besok — ia janji puluhan tahun yang diringkas jadi satu angka hari ini.",
   psak:"PSAK 219 = IAS 19", f:"Kredit: DBO adalah utang jangka sangat panjang — bandingkan dengan aset program, bukan dengan kas. Investasi: DBO naik belum tentu buruk — bisa karena karyawan bertambah atau masa kerja bertambah. Forensik: DBO hanya seakurat asumsinya — baca asumsi diskonto & gaji di catatan (M7)."},
  {l:"Projected unit credit — tiap tahun kerja 'menghasilkan' sepotong manfaat", v:"metode", v2:"per tahun jasa",
   d:"Metode projected unit credit: setiap tahun masa kerja karyawan dianggap menghasilkan satu unit manfaat pensiun tambahan, dihitung dengan proyeksi gaji akhir. Service cost tahun ini (Rp320 juta ilustratif) = nilai kini unit manfaat yang dihasilkan karyawan selama tahun berjalan.",
   psak:"PSAK 219 = IAS 19", f:"Kredit: metode ini membuat DBO tumbuh seiring masa kerja — perusahaan dengan karyawan senior punya DBO yang membengkak. Investasi: service cost adalah biaya tenaga kerja yang ditangguhkan — bandingkan dengan beban gaji tunai. Forensik: perubahan metode atau asumsi gaji mengubah service cost tanpa satu rupiah kas bergerak."},
  {l:"Rekonsiliasi DBO awal → akhir (ilustratif, Rp juta)", v:"5.000 → 5.610", v2:"menutup tepat",
   d:"DBO awal 5.000 + service cost 320 + interest cost 350 (7% × 5.000) − imbalan dibayar 180 + actuarial loss 120 = DBO akhir 5.610. Setiap rupiah dijelaskan — tidak ada 'selisih lain-lain'. Rekonsiliasi inilah yang wajib diungkap di catatan (cara membacanya di M7).",
   psak:"PSAK 219", f:"Kredit: actuarial loss 120 = asumsi meleset — tanya asumsi mana yang berubah. Investasi: imbalan dibayar 180 mengurangi DBO TAPI juga menguras aset program — efek netonya nol. Forensik: rekonsiliasi yang tidak menutup = tanda ada pos yang disembunyikan — hitung ulang sendiri."},
  {l:"Asumsi aktuaria kunci — empat tuas yang menggerakkan DBO", v:"4 tuas", v2:"diskonto · gaji · turnover · mortalitas",
   d:"Discount rate (imbal hasil obligasi korporat berkualitas), salary growth (kenaikan gaji), turnover karyawan, mortalitas. Keempatnya dipilih manajemen dengan nasihat aktuaris. Ilustratif: diskonto naik 1 pp → DBO turun ≈ Rp673 juta (durasi ~12 tahun); kenaikan gaji naik 1 pp → DBO naik ≈ Rp560 juta.",
   psak:"PSAK 219", f:"Kredit: diskonto adalah tuas terbesar — naik 1% bisa menghapus >10% liabilitas. Investasi: bandingkan asumsi antar tahun dan antar perusahaan sejenis. Forensik: diskonto yang naik di tahun laba tertekan adalah PEMICU investigasi, bukan bukti manipulasi — bandingkan dengan imbal hasil obligasi korporat berkualitas di pasar dan karakteristik kewajiban (pola yang sama seperti di M7): kenaikan yang sejalan dengan pasar adalah pasar, bukan poles; selisih dari pasarlah yang wajib dijelaskan manajemen."}
 ]},
service:{ title:"Service cost — harga satu tahun kerja karyawan", cols:["Pos","Angka","Makna"],
 rows:[
  {l:"Current service cost — manfaat yang dihasilkan tahun ini", v:"Rp320", v2:"ke P&L",
   d:"Nilai kini unit manfaat pensiun yang dihasilkan karyawan selama tahun berjalan: ilustratif Rp320 juta. Masuk laba rugi sebagai beban — ia bagian dari biaya tenaga kerja, sama seperti gaji, hanya dibayar puluhan tahun kemudian.",
   psak:"PSAK 219 = IAS 19", f:"Kredit: service cost naik terus = struktur karyawan menua atau manfaat membesar — beban masa depan menumpuk. Investasi: tambahkan service cost ke beban gaji untuk melihat total biaya tenaga kerja yang sebenarnya. Forensik: service cost yang tiba-tiba turun tanpa PHK massal = asumsi gaji atau diskonto diubah."},
  {l:"Past service cost — amandemen program yang berlaku surut", v:"ke P&L", v2:"langsung, tanpa diamortisasi",
   d:"Bila perusahaan menaikkan rumus manfaat (mis. 2% → 2,5% per tahun jasa) dan kenaikan itu berlaku untuk masa kerja LALU, selisih nilai kini manfaat lama itu = past service cost — diakui LANGSUNG di laba rugi pada periode amandemen, tidak diamortisasi bertahun-tahun. Ilustratif (dari DBO kanonis 5.610): amandemen menaikkan rumus 2% → 2,5% untuk masa kerja lalu menambah DBO Rp250 juta → DBO 5.610 + 250 = 5.860, dan beban Rp250 juta masuk P&L tahun amandemen SEKALIGUS. Laba tahun itu turun Rp250 juta sekali saja — bukan beban berulang.",
   psak:"PSAK 219 = IAS 19", f:"Kredit: amandemen manfaat = utang baru yang langsung membebani laba — cek apakah perusahaan mampu. Investasi: past service cost adalah biaya satu kali (one-off) — pisahkan dari beban pensiun berulang saat menilai laba normal. Forensik: amandemen di tahun bonus direksi diukur dari laba = insentif yang patut dicurigai."},
  {l:"Curtailment — pengurangan manfaat masa depan", v:"ke P&L", v2:"saat terjadi",
   d:"Bila program dipangkas (mis. pabrik ditutup, karyawan berhenti mendapat manfaat baru), DBO turun dan selisihnya — keuntungan atau kerugian curtailment — diakui di laba rugi saat peristiwa terjadi. Curtailment adalah kebalikan amandemen: janji dikurangi, bukan ditambah. Ilustratif (dari DBO kanonis 5.610): pabrik ditutup, 200 karyawan berhenti mendapat manfaat baru — DBO turun Rp400 juta (5.610 → 5.210) → curtailment gain Rp400 juta di P&L saat penutupan. Gain sekali saja — bukan perbaikan operasi.",
   psak:"PSAK 219", f:"Kredit: curtailment mengurangi utang masa depan — tapi sering datang bersama restrukturisasi yang mahal. Investasi: keuntungan curtailment di P&L adalah one-off — jangan dikapitalisasi sebagai laba berulang. Forensik: curtailment yang 'menguntungkan' di tahun yang sama dengan PHK besar = laba yang dibayar dengan pekerjaan karyawan."}
 ]},
netint:{ title:"Net interest — bunga atas janji yang belum dibayar", cols:["Pos","Angka","Makna"],
 rows:[
  {l:"Interest cost — DBO 'berbunga' seiring waktu mendekat", v:"Rp350", v2:"7% × 5.000",
   d:"DBO adalah nilai kini — setiap tahun berlalu, pembayaran pensiun setahun lebih dekat, sehingga nilai kininya naik. Kenaikan itu = interest cost: ilustratif 7% × DBO awal Rp5.000 juta = Rp350 juta. Bukan bunga pinjaman bank — tapi mekanikanya sama: utang yang didiskonto pasti 'berbunga'.",
   psak:"PSAK 219 = IAS 19", f:"Kredit: interest cost tumbuh bila DBO tumbuh — liabilitas pensiun membebani laba seperti utang berbunga. Investasi: interest cost naik karena diskonto naik atau DBO naik — dua cerita yang berlawanan, baca keduanya. Forensik: interest cost dihitung dari DBO AWAL — bila perusahaan memakai DBO akhir, bebannya digelembungkan."},
  {l:"Interest income — aset program 'berbunga' dengan tarif yang sama", v:"Rp294", v2:"7% × 4.200",
   d:"Aset program juga dihitung bunganya — dengan tingkat diskonto YANG SAMA (7%), bukan dengan imbal hasil yang diharapkan manajemen: 7% × aset awal Rp4.200 juta = Rp294 juta. Selisih antara imbal hasil aktual dan angka ini TIDAK masuk laba rugi — ia masuk OCI sebagai remeasurement.",
   psak:"PSAK 219 = IAS 19", f:"Kredit: memakai diskonto yang sama untuk aset dan liabilitas mencegah manajemen mengarang 'expected return' yang optimistis. Investasi: interest income 294 adalah angka akuntansi, bukan kas — kas sebenarnya adalah return aktual 300. Forensik: perusahaan yang masih memakai expected return di atas diskonto = memakai standar lama — periksa tanggal laporan."},
  {l:"Net interest — satu angka bersih ke laba rugi", v:"Rp56", v2:"350 − 294",
   d:"Net interest = interest cost − interest income = 350 − 294 = Rp56 juta, masuk laba rugi. Rumus singkatnya: tingkat diskonto × liabilitas neto AWAL periode (7% × 800 = 56). Bila program surplus (aset > DBO), net interest menjadi pendapatan, bukan beban.",
   psak:"PSAK 219", f:"Kredit: net interest 56 adalah biaya membawa liabilitas neto 800 selama setahun — seperti bunga utang 7%. Investasi: beban pensiun P&L total = service cost 320 + net interest 56 = 376 — bandingkan dengan iuran kas 250: perusahaan membayar kas LEBIH KECIL dari bebannya. Forensik: liabilitas neto naik 800 → 1.040 = net interest tahun depan ikut naik — beban yang menggulung."}
 ]},
remeas:{ title:"Remeasurement — volatilitas yang diparkir di OCI", cols:["Pos","Angka","Makna"],
 rows:[
  {l:"Actuarial gain/loss — asumsi meleset dari kenyataan", v:"rugi Rp120", v2:"ke OCI",
   d:"Bila asumsi aktuaria berubah (diskonto turun, gaji naik lebih cepat, karyawan hidup lebih lama) atau pengalaman berbeda dari asumsi, DBO bergerak — selisihnya = actuarial gain/loss. Ilustratif: actuarial loss Rp120 juta tahun ini. Masuk OCI, BUKAN laba rugi — laba bersih 'tenang', volatilitasnya parkir di ekuitas.",
   psak:"PSAK 219 = IAS 19", f:"Kredit: actuarial loss berulang = asumsi manajemen terlalu optimistis dari tahun ke tahun — liabilitas sebenarnya lebih besar. Investasi: laba bersih yang stabil + OCI yang berayun dari remeasurement = laba yang menenangkan secara semu. Forensik: bandingkan actuarial gain/loss dengan perubahan asumsi di catatan — angka yang tidak bisa dijelaskan asumsi = perlu ditanya."},
  {l:"Return aset program di luar net interest", v:"gain Rp6", v2:"300 − 294, ke OCI",
   d:"Aset program menghasilkan return aktual Rp300 juta (ilustratif), sedangkan interest income yang diakui di P&L hanya Rp294 juta. Selisih Rp6 juta = remeasurement gain atas aset program, masuk OCI. Bila return aktual di BAWAH interest income, selisihnya menjadi remeasurement loss di OCI.",
   psak:"PSAK 219", f:"Kredit: return aset yang buruk tidak memukul laba rugi tahun ini — tapi menggerus aset program dan menaikkan liabilitas neto. Investasi: return aktual 300 vs ekspektasi 294 — tahun ini aset 'mengalahkan' diskonto tipis; jangan ekstrapolasi satu tahun. Forensik: return aktual yang dilaporkan tanpa rincian kelas aset = sulit diverifikasi — minta komposisi aset program."},
  {l:"OCI neto — rugi 114 yang tidak terlihat di laba bersih", v:"rugi Rp114", v2:"120 − 6, tidak direklasifikasi",
   d:"OCI tahun ini = actuarial loss 120 − remeasurement gain aset 6 = rugi Rp114 juta. Remeasurement TIDAK pernah direklasifikasi (didaur ulang) ke laba rugi di periode berikut — ia menetap di ekuitas. Inilah jawaban case di seksi D: DBO naik, laba tetap — larinya 114 ke OCI.",
   psak:"PSAK 219", f:"Kredit: ekuitas terkikis 114 tanpa jejak di laba rugi — baca laporan laba rugi komprehensif, bukan cuma laba bersih. Investasi: perusahaan dengan DBO besar bisa terlihat 'stabil' di laba bersih sambil ekuitasnya tergerus OCI tiap tahun. Forensik: OCI negatif dari pensiun yang membesar tiap tahun = liabilitas yang manajemennya tidak kunjung memperbaiki asumsi."}
 ]},
ceiling:{ title:"Batas pengakuan & pendanaan — kapan surplus tidak boleh diakui penuh", cols:["Pos","Angka","Makna"],
 rows:[
  {l:"Asset ceiling — surplus diakui hanya sebesar manfaat ekonominya", v:"batas", v2:"refund / pengurangan iuran",
   d:"Bila aset program MELEBIHI DBO (surplus), perusahaan tidak otomatis mengakui seluruh surplus sebagai aset. Asset ceiling membatasi aset neto pensiun sampai sebesar manfaat ekonomi yang benar-benar bisa dinikmati: pengembalian dana (refund) atau pengurangan iuran masa depan. Kelebihan di atas ceiling = rugi remeasurement di OCI.",
   psak:"PSAK 219 = IAS 19", f:"Kredit: surplus di atas ceiling bukan aset yang bisa dijual — jangan hitung sebagai kas. Investasi: perusahaan dengan surplus besar tapi tanpa hak refund = aset yang tidak bisa dipakai. Forensik: aset neto pensiun yang naik bersamaan dengan larangan refund di perjanjian dana pensiun = angka yang menggelembung."},
  {l:"Funded vs unfunded — ada dananya atau hanya janji?", v:"funded", v2:"aset 4.570 vs DBO 5.610",
   d:"Funded: ada aset program terpisah (dana pensiun) — ilustratif di sini aset Rp4.570 juta menutup 81,5% DBO Rp5.610 juta. Unfunded: tidak ada aset program sama sekali — seluruh DBO dibayar dari kas operasi masa depan. Rasio pendanaan (funding ratio) = aset ÷ DBO.",
   psak:"PSAK 219", f:"Kredit: unfunded + DBO besar + arus kas lemah = bom waktu — kewajiban pensiun bersaing dengan utang bank atas kas yang sama. Investasi: funding ratio yang turun tiap tahun = perusahaan menunda iuran — cek iuran kas vs service cost. Forensik: dana pensiun yang 'funded' tapi asetnya berupa piutang ke perusahaan sendiri = pendanaan semu."},
  {l:"Settlement — melunasi kewajiban dengan pembayaran sekaligus", v:"ke P&L", v2:"selisih = gain/loss",
   d:"Settlement: perusahaan mengakhiri sebagian atau seluruh kewajiban pensiun dengan membayar sekaligus (mis. membeli anuitas dari perusahaan asuransi). Selisih antara DBO yang dilunasi dan kas yang dibayar = settlement gain/loss, diakui di laba rugi saat settlement terjadi. Ilustratif (dari DBO kanonis 5.610): lunasi sebagian DBO Rp500 juta dengan membeli anuitas Rp480 juta → settlement gain Rp20 juta di P&L; DBO tersisa 5.610 − 500 = 5.110.",
   psak:"PSAK 219", f:"Kredit: settlement mengurangi DBO dan ketidakpastian — tapi menguras kas hari ini. Investasi: settlement gain adalah one-off — pisahkan dari laba berulang. Forensik: settlement yang dilakukan tepat sebelum tahun tutup buku dengan harga 'murah' = tanyakan siapa pihak lawan dan bagaimana harganya ditetapkan."},
  {l:"Asset ceiling mengikat: net interest dihitung dari aset yang DIBATASI", v:"35", v2:"7% × 500, bukan 800",
   d:"Rumus singkat 'diskonto × liabilitas neto awal' TIDAK berlaku mentah bila asset ceiling mengikat. Contoh ilustratif (kasus surplus, terpisah dari contoh kanonis yang defisit): DBO awal 5.000, aset program awal 5.800 → surplus 800, tetapi manfaat ekonomi (refund/pengurangan iuran) hanya 500 → asset ceiling 500, aset neto diakui 500, kelebihan 300 tidak diakui. Net interest tahun itu: interest cost 350 (7% × DBO 5.000) − interest income 406 (7% × aset 5.800) + bunga atas efek ceiling 21 (7% × 300) = pendapatan 35 — sama dengan 7% × aset neto yang dibatasi (500), BUKAN 7% × surplus 800 (= 56). Bila memakai 56, pendapatan bunga dilebihsajikan 21.",
   psak:"PSAK 219 = IAS 19", f:"Kredit: surplus di atas ceiling bukan aset — net interest yang dihitung dari surplus penuh menggelembungkan laba. Investasi: pendapatan net interest 35 (bukan 56) adalah angka yang benar untuk program surplus ini. Forensik: net interest yang sama dengan diskonto × surplus (tanpa ceiling) = ceiling diabaikan — cek pengungkapan manfaat ekonomi."}
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
renderStmt("dcdb");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Tingkat diskonto naik 1 pp (7% → 8%), asumsi lain tetap", q1:"DBO", q2:"Liabilitas neto", a1:"turun", a2:"turun",
  e:"DBO adalah nilai kini — diskonto lebih tinggi = nilai kini lebih kecil: ilustratif DBO Rp5.610 juta turun ≈ Rp673 juta (durasi ~12 tahun × 1%). Aset program tidak berubah, jadi liabilitas neto ikut turun dengan jumlah yang sama. Hati-hati: ini keuntungan neraca tanpa satu rupiah kas masuk."},
 {t:"Iuran pemberi kerja naik Rp100 juta (250 → 350), semua lain tetap", q1:"Aset program akhir", q2:"Liabilitas neto", a1:"naik", a2:"turun",
  e:"Iuran kas masuk ke dana pensiun: aset program akhir 4.570 + 100 = Rp4.670 juta (naik). DBO tidak berubah, jadi liabilitas neto 1.040 − 100 = Rp940 juta (turun). Iuran adalah satu-satunya tuas yang benar-benar menambah kas dana pensiun — asumsi hanya mengubah angka di kertas."},
 {t:"Asumsi kenaikan gaji naik 1 pp, asumsi lain tetap", q1:"DBO", q2:"Current service cost", a1:"naik", a2:"naik",
  e:"Manfaat pensiun dihitung dari gaji akhir — gaji yang diproyeksikan lebih tinggi = janji lebih besar: ilustratif DBO naik ≈ Rp560 juta. Service cost ikut naik karena unit manfaat tahun ini dihitung dari gaji akhir yang lebih tinggi pula. Dua beban naik bersamaan, tanpa perubahan karyawan."},
 {t:"Return aktual aset program Rp200 juta, di bawah interest income Rp294 juta", q1:"Aset program akhir", q2:"Rugi remeasurement di OCI", a1:"turun", a2:"naik",
  e:"Aset akhir = 4.200 + 200 + 250 − 180 = Rp4.470 juta (turun Rp100 juta dari skenario dasar 4.570). Selisih return vs interest income = 200 − 294 = −Rp94 juta = remeasurement loss di OCI — laba rugi tidak tersentuh, tapi liabilitas neto naik 100 dan ekuitas terkikis 94 lewat OCI."},
 {t:"Amandemen program: rumus manfaat naik 2% → 2,5% per tahun jasa, berlaku surut", q1:"DBO", q2:"Beban P&L (past service cost)", a1:"naik", a2:"naik",
  e:"Kenaikan manfaat untuk masa kerja LALU langsung menambah DBO — dan karena ini past service cost, seluruh kenaikan diakui di laba rugi periode amandemen, tanpa diamortisasi. DBO naik, beban P&L naik, kas tidak bergerak: janji baru yang dibayar di masa depan."},
 {t:"Settlement: lunasi DBO Rp500 juta dengan pembayaran tunai Rp480 juta", q1:"DBO", q2:"Keuntungan settlement di P&L", a1:"turun", a2:"naik",
  e:"DBO turun Rp500 juta (kewajiban yang dilunasi) dan aset program turun Rp480 juta (kas yang dibayar) — liabilitas neto turun Rp20 juta. Selisih 500 − 480 = Rp20 juta diakui sebagai settlement gain di laba rugi. Perusahaan membeli kepastian: kewajiban hilang, kas berkurang, laba naik sekali saja."}
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
    try{ localStorage.setItem("fsa_pg_m41", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"DBO akhir (Rp juta)", hint:"DBO awal 5.000 + service cost 320 + interest cost 350 (7% × 5.000) − imbalan dibayar 180 + actuarial loss 120", ans:5610, dec:false, tol:0.5,
  why:"5.610 — jembatan DBO menutup tepat: 5.000 + 320 + 350 − 180 + 120 = 5.610. Imbalan dibayar MENGURANGI DBO (kewajiban yang sudah dilunasi), actuarial loss MENAMBAH DBO."},
 {q:"Aset program akhir (Rp juta)", hint:"Aset awal 4.200 + return aktual 300 + iuran pemberi kerja 250 − imbalan dibayar 180", ans:4570, dec:false, tol:0.5,
  why:"4.570 — 4.200 + 300 + 250 − 180 = 4.570. Return aktual yang dipakai di sini (300), bukan interest income (294) — selisih 6 menjadi remeasurement gain di OCI."},
 {q:"Liabilitas neto akhir (Rp juta)", hint:"DBO akhir − aset program akhir", ans:1040, dec:false, tol:0.5,
  why:"1.040 — 5.610 − 4.570 = 1.040. Inilah angka yang tercatat di neraca. Naik dari 800 di awal periode: perusahaan menutup 250 iuran kas tapi bebannya 376 + OCI 114."},
 {q:"Beban pensiun di laba rugi (Rp juta)", hint:"Service cost 320 + net interest (interest cost 350 − interest income 294)", ans:376, dec:false, tol:0.5,
  why:"376 — 320 + (350 − 294) = 376. Remeasurement (actuarial loss 120, gain aset 6) TIDAK masuk sini — ia ke OCI. Iuran kas 250 juga bukan beban: beban akuntansi ≠ kas yang dibayar."},
 {q:"Dampak diskonto +1 pp ke DBO (Rp juta, nilai absolut)", hint:"DBO akhir 5.610 × 1% × durasi ilustratif 12 tahun (pendekatan durasi: ΔDBO ≈ −durasi × Δdiskonto × DBO)", ans:673, dec:false, tol:15,
  why:"≈ 673 — 5.610 × 0,01 × 12 = 673,2. Tanda: diskonto NAIK → DBO TURUN ≈ 673 (sekitar 12%). Ini perkiraan durasi, bukan hitung ulang aktuaria penuh — durasi 12 tahun ilustratif untuk program dengan karyawan muda-menengah."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 5.610">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0));
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 5.610)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — PT Sejahtera Abadi (fiktif): DBO naik 5.000 → 5.610, liabilitas neto naik 800 → 1.040, tapi rugi OCI 114 tidak menyentuh laba bersih (beban P&L 376 tetap menggerakkan laba). Apakah sahamnya layak dibeli? Tulis 3 baris: apa yang menarik, apa yang mengganggumu, keputusanmu.",
 credit:"Lensa kredit — kamu analis kredit / calon pembeli obligasi Sejahtera Abadi: liabilitas neto pensiun 1.040 (funding ratio 81,5%), iuran kas 250 di bawah beban P&L 376, OCI rugi 114. Tulis 3 baris: kekuatan, risiko yang perlu covenant, kesimpulanmu.",
 forensic:"Lensa forensik — verifikasi jembatan 5.000 → 5.610 dan 4.200 → 4.570: dari mana actuarial loss 120 dan return aset 300 berasal? Apa yang TIDAK bisa kamu verifikasi dari angka agregat ini? Tulis 3 baris: yang terverifikasi, lubang terbesar, data tambahan yang kamu minta."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m41_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m41_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"Program iuran (defined contribution, DC) berbeda dari program manfaat (defined benefit, DB) dalam hal…", o:["Risiko investasi ditanggung karyawan, karena pemberi kerja hanya membayar iuran tetap","Risiko investasi ditanggung pemberi kerja, karena manfaat pensiun sudah dijanjikan","Risiko investasi ditanggung dana pensiun, karena aset program dikelola pihak ketiga","Risiko investasi ditanggung aktuaris, karena asumsi diskonto ditetapkan oleh aktuaris"], a:0},
 {q:"Beban pensiun yang masuk laba rugi (P&L) terdiri dari…", o:["Remeasurement ditambah iuran pemberi kerja yang dibayar ke dana pensiun","Service cost ditambah net interest atas liabilitas neto program pensiun","Service cost ditambah remeasurement atas aset program dan kewajiban aktuaria","Net interest ditambah keuntungan aktuaria dari perubahan asumsi diskonto"], a:1},
 {q:"Net interest atas program manfaat (DB) dihitung sebagai…", o:["Tingkat diskonto dikali aset program awal periode tanpa dikurangi DBO","Tingkat diskonto dikali liabilitas neto awal periode program pensiun","Tingkat diskonto dikali DBO akhir periode setelah dikurangi imbalan dibayar","Imbal hasil aktual aset program dikurangi service cost periode berjalan"], a:1},
 {q:"Asset ceiling membatasi pengakuan…", o:["Service cost periode berjalan sampai sebesar iuran yang dibayar pemberi kerja","Remeasurement di OCI sampai sebesar keuntungan aktuaria periode berjalan","Aset neto pensiun sampai sebesar manfaat ekonomi dari pengembalian dana atau pengurangan iuran","Liabilitas neto pensiun sampai sebesar DBO dikurangi nilai wajar aset program pada akhir periode pelaporan"], a:2},
 {q:"DBO awal Rp5.000, service cost Rp320, interest cost Rp350, imbalan dibayar Rp180, actuarial loss Rp120 — DBO akhir…", o:["Rp5.790, karena imbalan yang dibayar menambah kewajiban bukan menguranginya","Rp5.490, karena actuarial loss mengurangi kewajiban saat asumsi berubah","Rp5.430, karena interest cost dihitung dari DBO akhir bukan DBO awal","Rp5.610, karena komponen dijumlahkan lalu dikurangi imbalan yang dibayar"], a:3}];
(function(){
  var h = "";
  QUIZ.forEach(function(q,i){
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
           window.FSAMistake.log(41, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu menguasai mekanika pensiun: DBO, service cost, net interest, remeasurement di OCI, dan asset ceiling — jembatan angkanya menutup sampai rupiah terakhir. Lanjut ke <a href=\"/modul-42/\">Modul 42 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m41","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m41") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m41") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m41") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Modul 41 sudah kamu lewati sebelumnya — lanjut ke <a href=\"/modul-42/\">Modul 42</a>.</p>";
  }
}catch(e){}
})();
