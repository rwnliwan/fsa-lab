/* FSA Lab — Modul 40: Obligasi & Utang Jangka Panjang (PERUSAHAAN ILUSTRATIF — PT Dana Abadi fiktif, Rp juta; PSAK 109) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
pardiskon:{ title:"Par, diskon, premium — ditentukan oleh kupon vs suku bunga pasar", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Par: kupon 10% = suku bunga pasar 10%", v:"10.000,00", v2:"harga = nominal",
   d:"Bila kupon sama dengan suku bunga pasar, PV arus kas tepat sama dengan nilai nominal Rp10.000 juta — obligasi terjual pada harga par. Investor mendapat imbal hasil yang dimintanya dari kupon saja, tanpa perlu diskon atau premium.",
   psak:"PSAK 109", f:"Kredit: par = utang dicatat sebesar pokoknya; tidak ada amortisasi. Investasi: imbal hasil = kupon, tidak ada capital gain dari diskon. Forensik: harga par saat kupon jauh di bawah pasar = tanda pasar memakai suku bunga berbeda — cek asumsi diskonto."},
  {l:"Diskon: kupon 8% < pasar 10%", v:"9.502,63", v2:"diskon 497,37",
   d:"Kupon 8% memberi kas Rp800 juta per tahun, tetapi pasar menuntut imbal hasil 10%. Investor hanya mau membayar PV arus kas pada 10%: 727,27 + 661,16 + 8.114,20 = Rp9.502,63 juta. Diskon Rp497,37 juta = kekurangan imbal hasil kupon yang 'dibayar' lewat kenaikan nilai tercatat.",
   psak:"PSAK 109", f:"Kredit: diskon = utang tercatat LEBIH KECIL dari pokok yang harus dibayar — beban bunga efektif (950,26) melebihi kas (800). Investasi: diskon adalah imbal hasil tambahan saat jatuh tempo — total return = kupon + apresiasi nilai tercatat. Forensik: diskon besar + kupon rendah = cek apakah suku bunga pasar 10% didukung data pasar, bukan asumsi manajemen."},
  {l:"Premium: kupon 12% > pasar 10%", v:"10.497,37", v2:"premium 497,37",
   d:"Kupon 12% memberi kas Rp1.200 juta per tahun, di atas imbal hasil 10% yang diminta pasar. Investor mau membayar lebih dari nominal: PV pada 10% = Rp10.497,37 juta — premium Rp497,37 juta. Cerminan simetris dari diskon: selisih kupon vs pasar yang sama (2 pp) menghasilkan selisih harga yang sama besarnya, berlawanan arah.",
   psak:"PSAK 109", f:"Kredit: premium = utang tercatat LEBIH BESAR dari pokok — beban bunga efektif (1.049,74 di tahun pertama) lebih kecil dari kas kupon (1.200). Investasi: premium diamortisasi sebagai pengurang imbal hasil — kupon tinggi bukan berarti return tinggi. Forensik: premium besar = cek apakah kupon 12% berkelanjutan, atau penerbit membayar mahal karena risiko kreditnya tinggi."}
 ]},
efektif:{ title:"Metode bunga efektif — beban bunga mengikuti nilai tercatat, bukan kas", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Beban bunga = nilai tercatat × suku bunga pasar saat terbit", v:"950,26", v2:"9.502,63 × 10%",
   d:"Tahun pertama: Rp9.502,63 juta × 10% = Rp950,26 juta. Suku bunga yang dipakai adalah suku bunga pasar SAAT TERBIT (10%) — dikunci selama umur obligasi, tidak berubah walau pasar bergerak setelahnya. Inilah 'effective interest rate' PSAK 109.",
   psak:"PSAK 109", f:"Kredit: beban bunga efektif adalah biaya utang SEBENARNYA — covenant berbasis laba harus memakai angka ini, bukan kas kupon. Investasi: imbal hasil pemegang obligasi = 10% atas nilai tercatat, bukan 8% kupon. Forensik: beban bunga yang sama persis dengan kas kupon pada obligasi diskon = amortisasi diskon tidak diakui — laba dilebihsajikan."},
  {l:"Amortisasi = beban bunga − kas kupon", v:"150,26", v2:"950,26 − 800,00",
   d:"Tahun pertama: beban bunga Rp950,26 juta − kas kupon Rp800 juta = amortisasi diskon Rp150,26 juta. Amortisasi ini MENAMBAH nilai tercatat (9.502,63 → 9.652,89) — diskon 'ditelan' sedikit demi sedikit menjadi beban bunga. Pada obligasi premium rumusnya sama, tetapi beban bunga < kas kupon sehingga amortisasi MENGURANGI nilai tercatat.",
   psak:"PSAK 109", f:"Kredit: amortisasi diskon = beban non-kas yang menekan laba tanpa menekan kas — bedakan saat membaca arus kas vs laba rugi. Investasi: amortisasi adalah bagian imbal hasil yang diterima sebagai kenaikan nilai, bukan kas. Forensik: total amortisasi tiga tahun (150,26 + 165,29 + 181,82 = 497,37) HARUS sama dengan diskon awal — selisihnya = jadwal yang salah."},
  {l:"Kas kupon tetap, beban bunga bergerak", v:"800,00", v2:"beban: 950,26→981,82",
   d:"Kas kupon tetap Rp800 juta tiap tahun (8% × 10.000), tetapi beban bunga naik mengikuti nilai tercatat: 950,26 → 965,29 → 981,82. Pola ini khas diskon: beban bunga naik karena utang tercatatnya membesar mendekati nominal. Pada premium, polanya terbalik — beban bunga TURUN tiap tahun.",
   psak:"PSAK 109", f:"Kredit: beban bunga yang naik sementara kas tetap = tekanan laba meningkat mendekati jatuh tempo — rencanakan likuiditas pokoknya juga. Investasi: pemegang obligasi diskon mendapat imbal hasil yang 'membesar' — nilai wajarnya naik mendekati nominal bila suku bunga pasar tidak berubah. Forensik: beban bunga yang DATAR pada obligasi diskon = metode garis lurus, bukan bunga efektif — tidak sesuai PSAK 109."}
 ]},
jadwal:{ title:"Jadwal amortisasi — baca kolom per kolom, lalu uji ujungnya", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Kolom nilai tercatat awal — titik berangkat tiap tahun", v:"9.502,63", v2:"tahun 1",
   d:"Nilai tercatat awal tahun 1 = harga terbit Rp9.502,63 juta. Tahun 2 berangkat dari 9.652,89 (akhir tahun 1), tahun 3 dari 9.818,18. Setiap baris 'akhir' menjadi 'awal' baris berikut — rantai ini yang membuat jadwal bisa diaudit: satu angka putus, seluruh jadwal runtuh.",
   psak:"PSAK 109", f:"Kredit: nilai tercatat awal adalah dasar beban bunga tahun itu — salah satu angka = salah seluruh beban. Investasi: nilai tercatat = klaim pemegang obligasi atas pokok yang tersisa. Forensik: lompatan nilai tercatat yang tidak sama dengan amortisasi = jurnal yang hilang atau salah."},
  {l:"Kolom beban bunga, kas, amortisasi — mesin tiap baris", v:"950,26", v2:"− 800,00 = 150,26",
   d:"Tiap baris: beban bunga (nilai tercatat awal × 10%) dikurangi kas kupon (800,00) menghasilkan amortisasi (150,26). Tiga kolom ini adalah mesin jadwal — bila beban bunga dihitung dari nilai NOMINAL (10.000 × 10% = 1.000), amortisasi jadi 200,00 dan jadwal tidak pernah kembali ke 10.000.",
   psak:"PSAK 109", f:"Kredit: beban bunga dari nilai tercatat, bukan nominal — kekeliruan paling umum di soal dan di praktik. Investasi: amortisasi = porsi imbal hasil non-kas tahun itu. Forensik: amortisasi yang sama besar tiap tahun (497,37 ÷ 3 = 165,79) = metode garis lurus — bukan bunga efektif."},
  {l:"Uji akhir: tahun ke-3 kembali tepat ke 10.000,00", v:"10.000,00", v2:"9.818,18 + 181,82",
   d:"Tahun 3: nilai tercatat awal 9.818,18 + amortisasi 181,82 = 10.000,00 — TEPAT sama dengan nilai nominal yang dibayar saat jatuh tempo. Inilah uji rekonsiliasi jadwal amortisasi: bila akhir tidak tepat ke nominal, ada yang salah di harga terbit, suku bunga, atau amortisasi. Jadwal yang benar selalu 'mendarat' di nominal.",
   psak:"PSAK 109", f:"Kredit: saat jatuh tempo, kas keluar 10.000 = nilai tercatat — tidak ada lagi laba/rugi pelunasan. Investasi: pemegang obligasi menerima pokok penuh — diskon sudah 'dibayar' lewat amortisasi. Forensik: nilai tercatat akhir ≠ nominal = jadwal tidak mengunci — minta jadwal lengkap dari catatan laporan keuangan."}
 ]},
pelunasan:{ title:"Pelunasan dini — derecognition dan laba/rugi selisihnya", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Derecognition: hapus liabilitas sebesar nilai tercatat", v:"9.652,89", v2:"akhir tahun 1",
   d:"Saat obligasi dibeli kembali, liabilitas dihapus dari neraca sebesar nilai tercatatnya saat itu — contoh: akhir tahun 1 sebesar Rp9.652,89 juta. Bukan sebesar nominal (10.000), bukan sebesar harga terbit (9.502,63) — sebesar nilai tercatat PADA TANGGAL pelunasan.",
   psak:"PSAK 109", f:"Kredit: pelunasan dini menghapus utang — tetapi kas yang keluar menentukan ada laba atau rugi. Investasi: pemegang obligasi menerima harga beli kembali, bukan nilai tercatat. Forensik: liabilitas yang dihapus sebesar nominal padahal nilai tercatatnya berbeda = laba/rugi pelunasan tidak diakui."},
  {l:"Laba/rugi = nilai tercatat − harga beli kembali", v:"−147,11", v2:"9.652,89 − 9.800",
   d:"Beli kembali seharga Rp9.800 juta saat nilai tercatat Rp9.652,89 juta → rugi Rp147,11 juta (9.652,89 − 9.800 = −147,11). Membayar LEBIH dari nilai tercatat = rugi; membayar KURANG = laba. Rugi ini diakui di laba rugi periode berjalan — bukan ditangguhkan, bukan masuk OCI.",
   psak:"PSAK 109", f:"Kredit: rugi pelunasan = harga yang dibayar untuk menghapus utang lebih awal — tanyakan mengapa manajemen mau membayar premium. Investasi: pemegang obligasi untung 147,11 di atas nilai tercatat — pelunasan dini adalah transfer kekayaan antar pihak. Forensik: pelunasan dini berulang dengan rugi besar = manajemen menutupi beban bunga masa depan dengan rugi hari ini — cek motifnya."},
  {l:"Beli kembali di bawah nilai tercatat = laba", v:"152,89", v2:"9.652,89 − 9.500",
   d:"Beli kembali seharga Rp9.500 juta saat nilai tercatat Rp9.652,89 juta → laba Rp152,89 juta. Ini terjadi bila suku bunga pasar naik setelah penerbitan (harga wajar obligasi turun) sehingga penerbit bisa membeli utangnya sendiri dengan murah. Laba ini nyata — utang Rp9.652,89 juta lenyap dengan kas Rp9.500 juta — tetapi tidak berulang: ia adalah keuntungan satu kali dari pergerakan pasar.",
   psak:"PSAK 109", f:"Kredit: laba pelunasan memperbaiki laba tahun berjalan tetapi tidak memperbaiki arus kas operasi — pisahkan saat menilai kualitas laba. Investasi: bila penerbit membeli kembali di bawah nilai tercatat, pemegang obligasi menerima kurang dari nilai tercatatnya. Forensik: laba pelunasan yang besar di tahun laba sedang tertekan = sinyal earnings management — cek apakah pelunasan itu ekonomis atau kosmetik."},
  {l:"Biaya transaksi penerbitan — menambah diskon efektif", v:"9.800", v2:"10.000 − 200",
   d:"Biaya transaksi saat menerbitkan utang (fee penjamin emisi, hukum) TIDAK dibebankan langsung — ia mengurangi hasil penerbitan dan diamortisasi lewat suku bunga efektif. Contoh (ilustratif, obligasi par 10.000, kupon 10%, 3 tahun, biaya 200): nilai tercatat awal = 10.000 − 200 = 9.800; suku bunga efektif naik dari 10% menjadi ≈10,82%; beban bunga tahun 1 = 9.800 × 10,82% ≈ 1.060 (bukan kupon 1.000); amortisasi ≈ 60; nilai tercatat akhir tahun 1 ≈ 9.860. Biaya 200 itu 'dibayar' pelan-pelan sebagai bunga tambahan selama umur obligasi.",
   psak:"PSAK 109 (IFRS 9)", f:"Kredit: biaya transaksi mengecilkan kas bersih yang diterima — nilai tercatat awal adalah kas bersih, bukan nominal. Investasi: yield efektif pemegang obligasi tidak berubah — biaya transaksi adalah beban penerbit, bukan pemegang. Forensik: biaya transaksi yang dibebankan langsung ke laba rugi = beban yang seharusnya dikapitalisasi ke nilai tercatat — cek apakah suku bunga efektif sudah mencerminkannya."},
  {l:"Modifikasi vs penghentian — uji 10% (PSAK 109)", v:"5,39% vs 14,38%", v2:"modifikasi vs extinguishment",
   d:"Bila syarat utang diubah, uji 10%: bandingkan nilai kini arus kas BARU (didiskonto dengan suku bunga efektif ASAL) dengan nilai tercatat. Di bawah 10% = modifikasi non-substansial: sesuaikan nilai tercatat, selisih langsung ke laba rugi. 10% atau lebih = penghentian (extinguishment): hapus liabilitas lama, akui liabilitas baru sebesar nilai wajarnya, selisih ke laba rugi. Contoh dari posisi akhir tahun 1 (nilai tercatat 9.652,89): kupon dipangkas 8% → 5% selama 2 tahun → PV arus baru 9.132,23; selisih 520,66 = 5,39% < 10% → modifikasi: laba 520,66 di P&L, nilai tercatat menjadi 9.132,23. Bila kupon dipangkas ke 0% → PV 8.264,46; selisih 1.388,43 = 14,38% ≥ 10% → penghentian: laba 1.388,43 di P&L, liabilitas baru diakui 8.264,46 (dengan asumsi suku bunga pasar tetap 10%). Fee yang dibayar/diterima dalam renegosiasi ikut dihitung dalam uji 10%.",
   psak:"PSAK 109 (IFRS 9)", f:"Kredit: modifikasi yang 'menguntungkan' penerbit (laba 520,66) tetap berarti utang yang lebih ringan — tetapi laba itu satu kali, bukan perbaikan arus kas. Investasi: pemegang obligasi yang setuju kupon dipangkas menerima nilai kini lebih kecil — tanyakan apa yang ia dapat sebagai gantinya. Forensik: renegosiasi berulang yang tiap kali lolos di bawah 10% = restrukturisasi bertahap yang menghindari pengakuan penghentian — jumlahkan seluruh perubahan syaratnya."}
 ]},
konversi:{ title:"Obligasi konversi — satu instrumen, dua komponen", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Pisah komponen: liabilitas + ekuitas", v:"2 komponen", v2:"PSAK 109 + 110",
   d:"Obligasi konversi mengandung utang (pokok + kupon) DAN opsi menukar menjadi saham. Saat terbit, keduanya dipisah: komponen liabilitas diukur dulu sebesar nilai wajar utang SEJENIS TANPA opsi konversi; sisanya menjadi komponen ekuitas (opsi konversi). Total keduanya = hasil penerbitan.",
   psak:"PSAK 109", f:"Kredit: hanya komponen liabilitas yang menjadi utang — ekuitasnya bukan kewajiban membayar. Investasi: opsi konversi bernilai karena saham bisa naik — nilainya tercermin di komponen ekuitas. Forensik: seluruh hasil dicatat sebagai liabilitas = opsi konversi tidak diakui — leverage tampak lebih besar dari sebenarnya."},
  {l:"Komponen liabilitas ikut biaya perolehan diamortisasi", v:"bunga efektif", v2:"suku bunga utang murni",
   d:"Setelah pemisahan, komponen liabilitas diperlakukan seperti obligasi biasa: dicatat pada biaya perolehan diamortisasi dengan metode bunga efektif, memakai suku bunga pasar utang TANPA opsi (lebih tinggi dari kupon, karena investor 'membayar' opsi lewat kupon yang lebih rendah). Beban bunganya lebih besar dari kas kupon — seperti obligasi diskon.",
   psak:"PSAK 109", f:"Kredit: beban bunga efektif atas komponen liabilitas = biaya utang sebenarnya — kupon rendah bukan berarti utang murah. Investasi: kupon rendah adalah harga opsi konversi yang dibayar pemegang obligasi. Forensik: beban bunga memakai kupon, bukan suku bunga utang murni = komponen ekuitas tidak pernah diakui dengan benar."},
  {l:"Saat konversi: liabilitas dihapus ke ekuitas, tanpa laba/rugi", v:"tanpa laba/rugi", v2:"reklasifikasi",
   d:"Saat pemegang obligasi menukar menjadi saham, komponen liabilitas dihapus dan dipindah ke ekuitas (ditambah komponen ekuitas opsi yang sudah ada). Tidak ada laba atau rugi — ini reklasifikasi di dalam ekuitas dan liabilitas, bukan transaksi jual-beli. Utang hilang, saham bertambah, kas tidak bergerak.",
   psak:"PSAK 109", f:"Kredit: konversi memperbaiki leverage (utang → ekuitas) tanpa kas masuk — tetapi mengencerkan pemegang saham lama. Investasi: pemegang obligasi menjadi pemegang saham — risikonya berubah dari kreditur menjadi pemilik. Forensik: konversi yang dicatat dengan laba/rugi = kesalahan klasifikasi — cek jurnal konversinya."}
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
renderStmt("pardiskon");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Suku bunga pasar naik 10% → 12% setelah penerbitan", q1:"Nilai wajar obligasi", q2:"Nilai tercatat (amortised cost)", a1:"turun", a2:"tetap",
  e:"Nilai wajar = PV arus kas pada 12% → turun di bawah 9.502,63 (arus kas yang sama didiskonto lebih berat). Nilai tercatat TETAP mengikuti jadwal lama: bunga efektif memakai suku bunga pasar SAAT TERBIT (10%), yang dikunci. Inilah beda nilai wajar vs biaya perolehan diamortisasi — pasar bergerak, catatan tidak."},
 {t:"Amortisasi diskon tahun berjalan (beban bunga 950,26, kas kupon 800)", q1:"Nilai tercatat", q2:"Diskon belum diamortisasi", a1:"naik", a2:"turun",
  e:"Amortisasi 150,26 = beban bunga 950,26 − kas 800: nilai tercatat naik 9.502,63 → 9.652,89, dan diskon yang belum diamortisasi turun 497,37 → 347,11. Keduanya bergerak berlawanan arah dengan jumlah yang sama — itulah arti amortisasi: diskon berpindah dari neraca ke laba rugi."},
 {t:"Obligasi diterbitkan premium (kupon 12% > pasar 10%), harga terbit 10.497,37", q1:"Harga terbit dibanding nilai nominal", q2:"Beban bunga dibanding kas kupon", a1:"naik", a2:"turun",
  e:"Harga terbit 10.497,37 di ATAS nominal 10.000 (premium 497,37). Beban bunga tahun pertama = 10.497,37 × 10% = 1.049,74 — LEBIH KECIL dari kas kupon 1.200, sehingga amortisasi premium 150,26 MENGURANGI nilai tercatat tiap tahun menuju 10.000. Premium adalah cerminan diskon."},
 {t:"Pelunasan dini: dibeli kembali 9.500 saat nilai tercatat 9.652,89", q1:"Laba yang diakui", q2:"Liabilitas obligasi setelah pelunasan", a1:"naik", a2:"turun",
  e:"Laba = 9.652,89 − 9.500 = 152,89 (naik dari nol menjadi 152,89): utang senilai 9.652,89 lenyap dengan kas 9.500. Liabilitas obligasi turun menjadi nol — utang selesai. Laba ini satu kali dan non-kas: kas justru KELUAR 9.500."},
 {t:"Pelunasan dini: dibeli kembali 9.800 saat nilai tercatat 9.652,89", q1:"Rugi yang diakui", q2:"Ekuitas setelah pelunasan", a1:"naik", a2:"turun",
  e:"Rugi = 9.800 − 9.652,89 = 147,11 (naik dari nol menjadi 147,11): penerbit membayar lebih dari nilai tercatatnya. Rugi itu mengurangi laba ditahan → ekuitas TURUN 147,11. Membayar premium untuk menghapus utang lebih awal hanya masuk akal bila suku bunga baru jauh lebih murah."},
 {t:"Obligasi konversi ditukar menjadi saham (nilai tercatat liabilitas 9.652,89)", q1:"Liabilitas obligasi", q2:"Ekuitas", a1:"turun", a2:"naik",
  e:"Liabilitas 9.652,89 dihapus dan dipindah ke ekuitas — utang hilang, saham bertambah, kas TIDAK bergerak, dan tidak ada laba atau rugi. Leverage membaik seketika, tetapi pemegang saham lama terdilusi: klaim atas perusahaan yang sama kini dibagi ke lebih banyak saham."}
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
    try{ localStorage.setItem("fsa_pg_m40", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Harga terbit (Rp juta)", hint:"PV arus kas pada 10%: 800/1,10 + 800/1,10² + 10.800/1,10³", ans:9502.63, tol:0.5,
  why:"9.502,63 — PV kupon 727,27 + 661,16 + 601,05 = 1.989,48 ditambah PV pokok 7.513,15. Diskon = 10.000 − 9.502,63 = 497,37."},
 {q:"Beban bunga tahun 1 (Rp juta)", hint:"Nilai tercatat awal Rp9.502,63 juta × suku bunga pasar 10%", ans:950.26, tol:0.05,
  why:"950,26 — beban bunga efektif LEBIH BESAR dari kas kupon 800,00. Selisihnya adalah amortisasi diskon tahun pertama."},
 {q:"Amortisasi diskon tahun 1 (Rp juta)", hint:"Beban bunga Rp950,26 juta − kas kupon Rp800,00 juta", ans:150.26, tol:0.05,
  why:"150,26 — nilai tercatat naik 9.502,63 → 9.652,89. Tiga tahun amortisasi (150,26 + 165,29 + 181,82) berjumlah 497,37 = diskon awal."},
 {q:"Rugi pelunasan dini (Rp juta)", hint:"Beli kembali Rp9.800 juta saat nilai tercatat akhir tahun 1 Rp9.652,89 juta — rugi = harga beli − nilai tercatat", ans:147.11, tol:0.05,
  why:"147,11 — membayar 9.800 untuk menghapus utang senilai 9.652,89 = rugi 147,11. Sebaliknya, beli kembali 9.500 akan memberi laba 152,89."},
 {q:"Harga terbit bila kupon 12% (Rp juta)", hint:"PV arus kas pada 10%: 1.200/1,10 + 1.200/1,10² + 11.200/1,10³", ans:10497.37, tol:0.5,
  why:"10.497,37 — PREMIUM 497,37 di atas nominal. Kupon di atas pasar = investor membayar lebih; beban bunga tahun pertama 1.049,74 lebih kecil dari kas kupon 1.200."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 9.502,63">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 9.502,63)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — kamu pemegang obligasi PT Dana Abadi: kupon 8%, pasar 10%, harga terbit 9.502,63. Apakah obligasi ini menarik dibeli? Tulis 3 baris: imbal hasil sebenarnya, apa yang mengganggumu, keputusanmu.",
 credit:"Lensa kredit — kamu analis kredit penerbitnya: beban bunga 950,26 vs kas kupon 800, dan beban itu naik tiap tahun (965,29 lalu 981,82). Tulis 3 baris: seberapa berat beban utang ini, covenant apa yang kamu minta, kesimpulanmu.",
 forensic:"Lensa forensik — verifikasi jembatan 9.502,63 → 950,26 → 150,26 → 9.652,89: dari mana tiap angka berasal dan apa yang TIDAK bisa kamu verifikasi dari angka agregat ini? Tulis 3 baris: yang terverifikasi, lubang terbesar, data tambahan yang kamu minta."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m40_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m40_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"PT Dana Abadi menerbitkan obligasi kupon 8% saat suku bunga pasar 10%. Mengapa obligasi itu terjual di bawah nilai nominal?", o:["Kupon 8% memberi kas lebih kecil dari imbal hasil 10% yang diminta pasar, sehingga harga terbit jatuh ke 9.502,63", "Biaya penerbitan obligasi dicatat sebagai pengurang kas sehingga nilai tercatat awal menjadi lebih kecil", "Perusahaan menetapkan harga terbit di bawah nominal agar beban bunga tahun pertama tampak lebih rendah", "Nilai nominal obligasi dihitung ulang mengikuti suku bunga pasar sehingga pokok yang dibayar saat jatuh tempo menjadi lebih kecil"], a:0},
 {q:"Nilai tercatat awal 9.502,63 dan suku bunga pasar 10%. Berapa beban bunga tahun pertama obligasi itu?", o:["800,00 — sama dengan kas kupon yang dibayarkan kepada pemegang obligasi", "950,26 — nilai tercatat awal dikali suku bunga pasar 10%", "1.000,00 — nilai nominal dikali suku bunga pasar 10%", "150,26 — selisih antara beban bunga dan kas kupon tahun pertama"], a:1},
 {q:"Selama umur obligasi yang diterbitkan pada harga diskon, nilai tercatat bergerak ke arah mana?", o:["Naik menuju nilai nominal 10.000 karena amortisasi diskon menambah nilai tercatat tiap tahun", "Turun menuju nol karena diskon diamortisasi sebagai pengurang nilai tercatat pada tiap tahun berjalan", "Tetap di harga terbit 9.502,63 karena nilai tercatat dicatat pada biaya historis", "Naik melebihi nilai nominal karena beban bunga tiap tahun lebih besar dari kas kupon"], a:0},
 {q:"PT Dana Abadi membeli kembali obligasinya seharga 9.800 saat nilai tercatat 9.652,89. Dampak pelunasan dini itu?", o:["Laba 147,11 karena harga beli kembali lebih tinggi dari nilai tercatat obligasi", "Rugi 147,11 karena harga beli kembali melebihi nilai tercatat obligasi", "Laba 147,11 karena nilai tercatat obligasi turun setelah pelunasan dini dilakukan", "Tidak ada laba atau rugi karena pelunasan dini dicatat langsung mengurangi ekuitas"], a:1},
 {q:"Obligasi konversi diterbitkan dengan komponen liabilitas dan ekuitas. Bagaimana pemisahan keduanya?", o:["Hasil penerbitan dicatat sebagai liabilitas dan opsi konversi diungkap di catatan saja", "Komponen ekuitas diukur dulu sebesar nilai wajar opsi konversi lalu sisanya menjadi komponen liabilitas", "Komponen liabilitas diukur dulu sebesar nilai wajar utang tanpa opsi lalu sisanya menjadi ekuitas", "Hasil penerbitan dibagi rata antara liabilitas dan ekuitas berdasarkan nilai nominal obligasi"], a:2}];
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
           window.FSAMistake.log(40, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu menguasai mekanika obligasi: harga terbit sebagai PV, bunga efektif PSAK 109, jadwal amortisasi yang mengunci ke nominal, dan laba/rugi pelunasan dini. Lanjut ke <a href=\"/modul-41/\">Modul 41 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m40","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m40") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m40") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m40") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Modul 40 sudah kamu lewati sebelumnya — lanjut ke <a href=\"/modul-41/\">Modul 41</a>.</p>";
  }
}catch(e){}
})();
