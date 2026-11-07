/* FSA Lab — Modul 35: Konsolidasi & NCI (lensa TRIPLE; contoh baru = ILUSTRATIF berlabel) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
metode:{ title:"Tiga cara mencatat investasi pada perusahaan lain — PERSEN = PRESUMSI AWAL, BUKAN ATURAN. Contoh angka ILUSTRATIF.", cols:["Tingkat pengaruh","Perlakuan","Standar"],
 rows:[
  {l:"Kontrol (>50% hak suara): PRESUMSI AWAL, bukan aturan — konsolidasi penuh", v:"100% digabung", v2:"PSAK 110",
   d:"PSAK 110 memakai konsep control: (1) power atas investee, (2) eksposur atas imbal hasil variabel, (3) kemampuan memakai power untuk memengaruhi imbal hasil. Angka >50% hanya PRESUMSI AWAL: (a) kontrol TANPA mayoritas — de facto control: 40% hak suara bisa menjadi suara mayoritas di RUPS bila pemegang lain tersebar + hak menunjuk mayoritas direksi; (b) >50% pun belum tentu kontrol bila dibatasi perjanjian (mis. hak veto pemegang minoritas atas keputusan operasi kunci). Induk menggabungkan 100% aset, liabilitas, pendapatan, dan beban anak — seolah satu perusahaan. Investasi dieliminasi; selisih harga beli vs nilai wajar aset neto teridentifikasi = goodwill; porsi pihak lain disajikan sebagai kepentingan nonpengendali (NCI). PSAK 110 (dulu PSAK 65), setara IFRS 10.",
   tag:"PSAK 110 (dulu PSAK 65) · IFRS 10",
   k:"Lensa forensik: 'konsolidasi' BUKAN berarti 'dimiliki penuh' — 100% aset anak masuk neraca walau induk hanya pegang 80%. Baca NCI sebelum menilai leverage."},
  {l:"Pengaruh signifikan (20–50%): PRESUMSI AWAL — metode ekuitas, satu baris", v:"satu baris", v2:"PSAK 228",
   d:"Satu baris di neraca ('investasi pada entitas asosiasi') dan satu baris di laba rugi ('bagian laba entitas asosiasi'). Laba asosiasi diakui proporsional (contoh ilustratif: 30% × 10.000 = 3.000). Dividen yang diterima MENGURANGI nilai tercatat investasi — BUKAN pendapatan. Angka 20–50% hanya PRESUMSI AWAL: pengaruh signifikan bisa ada DI BAWAH 20% — contoh: 15% + kursi dewan + transaksi material antar entitas + teknologi kunci yang dipasok investor. Sebaliknya, 25% tanpa kursi dewan dan tanpa keterlibatan operasional = bukan pengaruh signifikan. PSAK 228 (dulu PSAK 15), setara IAS 28.",
   tag:"PSAK 228 (dulu PSAK 15) · IAS 28",
   k:"Lensa investasi: laba asosiasi 'satu baris' = laba TANPA kas yang bisa dipakai induk semaunya. Bandingkan bagian laba vs dividen kas yang benar-benar diterima."},
  {l:"Di bawah 20% tanpa pengaruh signifikan: aset keuangan", v:"nilai wajar", v2:"PSAK 109",
   d:"Dicatat sebagai aset keuangan (umumnya nilai wajar, PSAK 109 setara IFRS 9) — bukan konsolidasi, bukan metode ekuitas. Dividen = pendapatan. Tidak ada NCI, tidak ada eliminasi intra-grup. Ingat: 'di bawah 20%' adalah TITIK AWAL ANALISIS, bukan vonis otomatis — uji dulu indikator pengaruh (kursi dewan, transaksi, teknologi, ketergantungan) sebelum menyimpulkan.",
   tag:"PSAK 109 · IFRS 9",
   k:"Lensa kredit: kepemilikan kecil tidak menambah 'kekuatan grup' — jangan hitung aset perusahaan lain sebagai penyangga utang induk."},
  {l:"Uji analis: hak SUBSTANTIF vs protektif, hak suara potensial, perjanjian kontraktual", v:"power + return", v2:"konsep",
   d:"Tugasmu sebelum memakai persen: (1) hak SUBSTANTIF vs PROTEKTIF — hak menunjuk direksi = substantif (memberi power); hak veto atas penerbitan saham baru atau penjualan aset besar = protektif (melindungi, bukan mengendalikan); (2) hak suara POTENSIAL — opsi/waran/konversi yang DAPAT dieksekusi saat ini dan bersifat substantif ikut dihitung; yang belum bisa dieksekusi atau sekadar protektif tidak; (3) perjanjian KONTRAKTUAL — voting agreement atau management contract bisa memberi power tanpa selembar saham pun. Inilah yang membedakan analis dari pembaca brosur: baca catatan konsolidasi, bukan cuma persen kepemilikan.",
   tag:"Konsep PSAK 110 / IFRS 10",
   k:"Lensa forensik: struktur '49% tapi mengendalikan' atau '51% tapi tak berdaya' = baca catatan konsolidasi, jangan cuma persen kepemilikan."}
 ]},
nci:{ title:"Membaca split 'pemilik vs NCI' di laporan konsolidasian real. Angka contoh ILUSTRATIF (Rp juta).", cols:["Baris laporan","Angka","Basis"],
 rows:[
  {l:"Laba total vs laba pemilik: DUA baris yang wajib dibaca berpasangan", v:"42.000 → 39.600", v2:"ilustratif",
   d:"Laporan konsolidasian SELALU memecah laba: 'laba yang dapat diatribusikan kepada pemilik entitas induk' 39.600 dan 'kepentingan nonpengendali' 2.400; total 42.000. Rumus: NCI = 20% × laba anak 12.000 = 2.400.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa investasi: mengutip 'laba bersih 42.000' tanpa menyebut basis = klaim tak terverifikasi. Selalu tanya: total atau pemilik?"},
  {l:"Split ekuitas: pemilik vs NCI di neraca", v:"169.600 vs 21.600", v2:"ilustratif",
   d:"Ekuitas konsolidasian 191.200 = pemilik 169.600 + NCI 21.600. NCI = 20% × ekuitas anak 108.000. Ekuitas pemilik = ekuitas induk 163.200 + 80% × pertumbuhan pasca-akuisisi anak 8.000 = 169.600. ✓ Footing: 169.600 + 21.600 = 191.200.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa kredit: NCI BUKAN milik induk — analis konservatif mengeluarkannya dari ekuitas saat hitung leverage (D/E dengan vs tanpa NCI bisa beda cerita)."},
  {l:"EPS memakai laba PEMILIK, bukan laba total", v:"495 vs 525", v2:"ilustratif",
   d:"EPS = 39.600 ÷ 80 juta saham = Rp495. Memakai laba total 42.000 → Rp525: salah basis, valuasi ikut meleset 6%. Saham induk hanya berhak atas laba pemilik — NCI punya pemilik lain.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa investasi: P/E yang dihitung dari laba total = murah palsu 6%. Cek basis laba SEBELUM bandingkan multiple."},
  {l:"Pelajaran Garuda: label '(pemilik)' vs angka TOTAL", v:"basis ≠ label", v2:"aturan",
   d:"Pelajaran: setiap angka yang dikutip WAJIB dicatat basisnya (total / pemilik / NCI) beserta sumber barisnya — label dan angka harus satu basis. Inilah kenapa split ini penting: salah basis = salah vonis.",
   tag:"Aturan FSA Lab: catat basis atribusi",
   k:"Lensa forensik: saat membaca filing real, verifikasi dua baris atribusi ('diatribusikan kepada pemilik… / kepentingan nonpengendali') SEBELUM mengutip angka laba ke analisismu."}
 ]},
eliminasi:{ title:"Eliminasi intra-grup: grup tidak bisa bertransaksi dengan dirinya sendiri. Angka ILUSTRATIF (Rp juta).", cols:["Transaksi internal","Eliminasi","Dampak"],
 rows:[
  {l:"Penjualan intra-grup: pendapatan & HPP saling hapus", v:"neto 0", v2:"ilustratif",
   d:"Induk jual ke anak 50.000: di konsolidasian, pendapatan 50.000 dan HPP 50.000 dieliminasi. Grup tidak bisa 'menjual ke diri sendiri' — yang dihitung hanya penjualan ke pihak ketiga.",
   tag:"Mekanisme konsolidasi PSAK 110",
   k:"Lensa forensik: penjualan anak ke induk yang melonjak = pompa revenue grup? Setelah eliminasi, revenue konsolidasian tak bergerak — yang bergerak hanya 'penjualan per entitas'."},
  {l:"Dividen internal: bukan pendapatan grup", v:"(3.200)", v2:"ilustratif",
   d:"Dividen 3.200 dari anak ke induk tercatat sebagai pendapatan di laporan tersendiri induk — tapi di konsolidasian DIELIMINASI: laba total = 33.200 + 12.000 − 3.200 = 42.000. Tanpa eliminasi = double-count (labanya dihitung di anak DAN di induk).",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa investasi: dividen internal bukan 'pendapatan baru' — ia hanya memindahkan kas di dalam grup. Yang menambah kekayaan grup hanya laba operasi."},
  {l:"Laba belum direalisasi di persediaan: downstream vs upstream", v:"10.000", v2:"ilustratif",
   d:"Induk jual barang ke anak 50.000 (HPP 40.000), barang masih di gudang anak akhir tahun → eliminasi laba 10.000. DOWNSTREAM (induk→anak): penjualnya induk → NCI tetap 2.400, laba pemilik 39.600 → 29.600. UPSTREAM (anak→induk): laba anak ikut terkoreksi → NCI = 20% × (12.000 − 10.000) = 400, laba pemilik 31.600.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa forensik: arah transaksi menentukan SIAPA yang menanggung koreksi. Pola 'anak jual mahal ke induk tiap akhir tahun' = pompa laba anak (dan NCI) yang belum terealisasi."},
  {l:"Utang-piutang intra-grup saling hapus", v:"(15.000)", v2:"ilustratif",
   d:"Piutang induk 15.000 = utang anak 15.000: keduanya dieliminasi — total aset DAN total liabilitas konsolidasian turun 15.000. Rasio leverage (D/E, debt ratio) WAJIB dihitung dari angka SETELAH eliminasi.",
   tag:"Mekanisme konsolidasi PSAK 110",
   k:"Lensa kredit: piutang 'ke anak' bukan aset likuid grup — ia lenyap saat konsolidasi. Agunan berbasis piutang intra-grup = agunan semu."}
 ]},
forensik:{ title:"Empat sudut forensik grup: di mana nilai bisa bocor lewat struktur kepemilikan. Contoh ILUSTRATIF.", cols:["Skema","Mekanisme","Jejak di laporan"],
 rows:[
  {l:"Value leaking ke NCI: transaksi di luar harga wajar", v:"8.000 bocor", v2:"ilustratif",
   d:"Anak (80%) membayar jasa 20.000 ke perusahaan milik pemegang 20%, harga wajar 12.000: selisih 8.000 = transfer nilai dari pemilik induk ke kantong NCI. Lacak di catatan pihak berelasi (PSAK 224) + uji kewajaran harga vs pasar.",
   tag:"Ilustrasi modul (angka fiktif)",
   k:"Lensa forensik: NCI yang 'terlalu bahagia' (dividen/imbaIan jumbo vs kontribusi) = tanya siapa di balik NCI dan berapa harga wajar transaksinya."},
  {l:"Buyout NCI di atas harga wajar", v:"tunneling ke minoritas", v2:"pola",
   d:"Induk membeli 20% sisanya jauh di atas nilai buku/wajar: kas grup mengalir ke pemegang NCI — yang bisa jadi pihak terafiliasi pengendali. Selisih harga vs nilai buku NCI dicatat di ekuitas (bukan goodwill baru). Cek: SIAPA penjualnya dan apa hubungan istimewanya.",
   tag:"Pola umum tunneling",
   k:"Lensa forensik: transaksi ekuitas dengan NCI tak lewat laba rugi — ia 'bersembunyi' di laporan perubahan ekuitas. Baca mutasi NCI baris per baris."},
  {l:"'Meminjam' laba via anak non-konsolidasi", v:"<50% trick", v2:"pola",
   d:"Aset bermasalah diparkir di entitas <50% agar tak dikonsolidasi (ruginya tak terlihat di grup); sebaliknya laba dipompa via entitas asosiasi yang diakui satu baris 'bagian laba'. Uji: bandingkan bagian laba asosiasi vs dividen kas yang benar-benar diterima + baca catatan entitas terstruktur.",
   tag:"Pola umum rekayasa grup",
   k:"Lensa forensik: laba asosiasi yang tak pernah jadi dividen kas = laba kertas. Konsolidasi vs ekuitas = batas mana 'grup' versi manajemen vs versi kas."},
  {l:"Goodwill yang tak pernah diuji penurunannya", v:"8.000 abadi?", v2:"peringatan",
   d:"Goodwill 8.000 di contoh ini tidak diamortisasi — wajib diuji penurunan nilai minimal setahun sekali. Manajemen yang 'selalu lolos uji' dengan asumsi diskonto/growth agresif = menunda pengakuan rugi. Uji: sensitivitas asumsi di catatan impairment.",
   tag:"Praktik umum (kasus: M20)",
   k:"Lensa kredit: kreditur menganggap goodwill NOL saat hitung tangible net worth — 8.000 ini bukan penyangga utang."}
 ]},
joint:{ title:"Joint arrangements: operasi bersama vs ventura bersama. Contoh angka ILUSTRATIF (Rp juta).", cols:["Bentuk","Perlakuan","Standar"],
 rows:[
  {l:"Pengendalian bersama (joint control): keputusan bulat", v:"unanimous consent", v2:"PSAK 111",
   d:"Joint arrangement = pengaturan di mana dua pihak atau lebih BERBAGI pengendalian — dan pengendalian itu BERSAMA: keputusan tentang aktivitas relevan mensyaratkan persetujuan BULAT (unanimous consent) dari semua pihak yang berbagi pengendalian. Satu pihak tidak bisa memutuskan sendiri, betapapun besar porsinya. Inilah pembeda dari kontrol (PSAK 110: satu pihak memutuskan) dan dari pengaruh signifikan (PSAK 228: satu pihak memengaruhi tapi tidak mengendalikan). PSAK 111 (dulu PSAK 66), setara IFRS 11.",
   tag:"PSAK 111 (dulu PSAK 66) · IFRS 11",
   k:"Lensa forensik: 'pengaturan bersama' di catatan tapi satu pihak memutuskan semua hal penting = bukan joint arrangement — uji siapa yang benar-benar memegang veto, jangan percaya labelnya."},
  {l:"Joint operations: akui BAGIANMU — aset, liabilitas, pendapatan, beban", v:"bagian proporsional", v2:"langsung di laporan",
   d:"Dalam joint operation, tiap operator punya hak LANGSUNG atas ASET dan kewajiban atas LIABILITAS pengaturan itu. Ia mengakui bagiannya baris per baris di laporan keuangannya sendiri: 50% aset = asetnya, 50% liabilitas = liabilitasnya, 50% pendapatan dan beban = pendapatan dan bebannya. Ini mirip konsolidasi proporsional secara EKONOMI — tapi BUKAN konsolidasi: tidak ada entitas anak, tidak ada NCI, tidak ada goodwill. Contoh: lihat baris contoh di bawah.",
   tag:"PSAK 111 · joint operations",
   k:"Lensa kredit: utang bagian operator MASUK neracanya langsung — leverage terbaca penuh. Jangan lewatkan liabilitas joint operation saat hitung D/E."},
  {l:"Joint ventures: SATU BARIS metode ekuitas — seperti asosiasi", v:"satu baris", v2:"PSAK 228",
   d:"Dalam joint venture, venturer hanya punya hak atas ASET NETO (ekuitas) pengaturan — bukan atas aset individualnya. Perlakuannya: metode ekuitas (PSAK 228) — satu baris 'investasi pada ventura bersama' di neraca dan satu baris 'bagian laba ventura bersama' di laba rugi. Dividen yang diterima MENGURANGI nilai tercatat investasi — bukan pendapatan; sama seperti asosiasi di tab Metode Pencatatan. Bedanya dengan asosiasi bukan CARA mencatatnya, melainkan SIFAT pengendaliannya (lihat baris berikut).",
   tag:"PSAK 111 + PSAK 228 · IFRS 11 + IAS 28",
   k:"Lensa investasi: laba ventura bersama 'satu baris' = laba TANPA kas yang bisa dipakai venturer semaunya — bandingkan bagian laba vs dividen kas yang benar-benar diterima, seperti asosiasi."},
  {l:"Pembeda dengan asosiasi: veto bersama vs pengaruh sepihak", v:"kontrol vs pengaruh", v2:"bukan persen",
   d:"Asosiasi (20–50%, presumsi awal): investor punya pengaruh SIGNIFIKAN — bisa memengaruhi kebijakan, tapi pihak lain bisa memutuskan tanpa persetujuannya. Ventura bersama: TIDAK ADA keputusan penting tanpa persetujuan bulat — tiap venturer memegang veto efektif atas aktivitas relevan. Jadi pembedanya bukan PERSEN kepemilikan (JV bisa 50:50, bisa juga 30:70 bila perjanjian memberi hak veto ke minoritas), melainkan ADA-TIDAKNYA pengendalian bersama dalam perjanjian. Rujuk tab Metode Pencatatan untuk ambang 20–50% — jangan hafal persennya, baca perjanjiannya.",
   tag:"Konsep PSAK 111 vs PSAK 228",
   k:"Lensa forensik: kepemilikan 50% tanpa veto kontraktual = BUKAN pengendalian bersama — mungkin hanya asosiasi (atau bahkan aset keuangan). Klasifikasi mengikuti perjanjian, bukan persen."},
  {l:"Contoh ilustratif 50:50 — JV aset 1.000, liabilitas 400, laba 120 (Rp juta)", v:"500 vs 300", v2:"JO vs JV",
   d:"Dua venturer 50:50. Ventura punya aset 1.000, liabilitas 400 → ekuitas 600; laba tahun berjalan 120. JOINT VENTURE (metode ekuitas): tiap venturer mencatat SATU BARIS investasi 50% × 600 = 300 dan bagian laba 50% × 120 = 60. JOINT OPERATION (bagian langsung): tiap operator mencatat 50% × 1.000 = 500 aset DAN 50% × 400 = 200 liabilitas langsung di neracanya, plus 50% pendapatan dan beban. Perhatikan: eksposur ekonomi SAMA (500 − 200 = 300), tapi TAMPILANNYA beda total — JO menggelembungkan aset & liabilitas, JV menyembunyikannya dalam satu baris. Itulah kenapa klasifikasi JO vs JV mengubah leverage yang terbaca.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa kredit: dua venturer dengan eksposur ekonomi identik bisa menampilkan D/E yang sangat berbeda hanya karena klasifikasi JO vs JV — hitung leverage dengan MEMASUKKAN kembali bagian JV bila perlu."}
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
        + (r.tag && r.tag !== "—" ? '<span class="tag">'+r.tag+'</span>' : '')
        + (r.k && r.k !== "—" ? '<div class="forensic"><strong>'+r.k.split(":")[0]+':</strong> '+r.k.slice(r.k.indexOf(":")+1)+'</div>' : '');
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
renderStmt("metode");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Induk membeli 20% sisanya sehingga menjadi 100% (buyout NCI, ilustratif)", q1:"NCI di ekuitas konsolidasian", q2:"Laba yang diatribusikan ke pemilik induk", a1:"turun", a2:"naik",
  e:"Buyout menghapus NCI (→ nol); seluruh laba anak kini milik induk. Selisih harga beli vs nilai buku NCI dicatat di ekuitas — bukan goodwill baru."},
 {t:"Anak mengumumkan dividen Rp4.000 juta (ilustratif)", q1:"Ekuitas NCI", q2:"Kas keluar ke pemegang NCI", a1:"turun", a2:"naik",
  e:"Dividen mengurangi ekuitas; 20% × 4.000 = 800 mengalir sebagai kas ke NCI. Dividen internal ke induk (3.200) dieliminasi di konsolidasian."},
 {t:"Ditemukan laba belum direalisasi downstream Rp10.000 juta yang belum dieliminasi", q1:"Laba pemilik induk setelah koreksi", q2:"NCI atas laba", a1:"turun", a2:"tetap",
  e:"Downstream = penjualnya induk → koreksi 10.000 hanya memotong porsi induk (39.600 → 29.600); NCI tetap 2.400."},
 {t:"Laba entitas asosiasi (30%, metode ekuitas) naik (ilustratif)", q1:"Nilai tercatat investasi pada asosiasi", q2:"Pendapatan dividen di laba rugi induk", a1:"naik", a2:"tetap",
  e:"Metode ekuitas: 30% laba diakui satu baris → investasi naik. Dividen BUKAN pendapatan — ia mengurangi nilai tercatat investasi."},
 {t:"Eliminasi utang-piutang intra-grup Rp15.000 juta (ilustratif)", q1:"Total aset konsolidasian", q2:"Total liabilitas konsolidasian", a1:"turun", a2:"turun",
  e:"Piutang dan utang internal saling hapus — keduanya turun 15.000. Rasio leverage dihitung dari angka SETELAH eliminasi."},
 {t:"Goodwill Rp8.000 juta turun nilai menjadi Rp5.000 juta (ilustratif)", q1:"Laba bersih total", q2:"NCI atas laba", a1:"turun", a2:"tetap",
  e:"Rugi impairment 3.000 menekan laba total. Goodwill akuisisi ini seluruhnya milik induk → NCI tidak kena."}
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
    try{ localStorage.setItem("fsa_pg_m35", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"NCI atas laba (Rp juta)", hint:"20% × laba anak Rp12.000 juta (ilustratif)", ans:2400, dec:false, tol:1,
  why:"2.400 — porsi 20% pemegang nonpengendali atas laba anak. Laba pemilik = 42.000 − 2.400 = 39.600."},
 {q:"NCI atas ekuitas (Rp juta)", hint:"20% × ekuitas anak Rp108.000 juta (ilustratif)", ans:21600, dec:false, tol:1,
  why:"21.600 — NCI di neraca = 20% × 108.000. Ekuitas pemilik = 191.200 − 21.600 = 169.600."},
 {q:"Laba pemilik entitas induk (Rp juta)", hint:"Laba total 42.000 − NCI 2.400 (ilustratif)", ans:39600, dec:false, tol:1,
  why:"39.600 — inilah angka untuk EPS (Rp495), BUKAN laba total 42.000."},
 {q:"Goodwill saat akuisisi (Rp juta)", hint:"Harga 88.000 − 80% × aset neto teridentifikasi 100.000 (ilustratif)", ans:8000, dec:false, tol:1,
  why:"8.000 — premi di atas 80% aset neto; diuji impairment tiap tahun, tidak diamortisasi. Contoh ini memakai metode partial goodwill (NCI at proportionate share) — IFRS 3 (PSAK 103) juga mengizinkan full goodwill method (NCI at fair value); pilihan metode mengubah goodwill dan ekuitas NCI."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 2.400">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 2.400)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — kamu menilai saham PT Induk Nusantara (FIKTIF). Laba 'bersih' 42.000, tapi EPS yang benar memakai laba pemilik 39.600 → Rp495 (80 juta saham). Tulis 3 baris: EPS mana yang kamu pakai untuk valuasi + kenapa, apa yang berubah bila NCI di-buyout 100%, keputusanmu (beli / tunggu / hindari).",
 credit:"Lensa kredit — kamu analis bank. Grup mengajukan pinjaman; 100% utang anak masuk konsolidasian, tapi ekuitas NCI 21.600 bukan milik induk. Tulis 3 baris: D/E mana yang kamu pakai (dengan / tanpa NCI di ekuitas) + alasan, satu covenant yang kamu minta terkait transaksi dengan NCI, keputusanmu.",
 forensic:"Lensa forensik — sebelum ACC, angka mana yang kamu verifikasi ulang? Tulis 3 baris: basis angka laba yang kamu kutip (total / pemilik) + sumbernya, satu transaksi intra-grup atau dengan NCI yang kamu uji kewajarannya, dan satu temuan yang membuatmu menolak mentah-mentah."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m35_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m35_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"PT Induk Nusantara mengendalikan 80% PT Anak Berkah (ilustratif). Perlakuan yang TEPAT di laporan konsolidasian…", o:["Hanya 80% aset dan liabilitas anak yang digabung sesuai porsi kepemilikan", "Investasi dicatat satu baris dengan metode ekuitas — sama seperti perlakuan atas entitas asosiasi karena kepemilikan di bawah 100%", "100% aset & liabilitas anak digabung; 20% sisanya disajikan sebagai kepentingan nonpengendali (NCI)", "Laporan anak diabaikan — cukup akui dividen tunai yang diterima induk"], a:2},
 {q:"Laba bersih anak Rp12.000 juta (ilustratif), kepemilikan induk 80%. Kepentingan nonpengendali atas laba = …", o:["Rp2.400 juta", "Rp9.600 juta", "Rp12.000 juta", "Rp0 — NCI hanya ada di neraca"], a:0},
 {q:"Induk memiliki 30% entitas asosiasi (metode ekuitas, PSAK 228). Asosiasi membayar dividen; bagian induk Rp450 juta (ilustratif). Pencatatan yang TEPAT di laporan induk…", o:["Mengakui pendapatan dividen di laba rugi sebesar Rp450 juta", "Menambah pos 'bagian laba asosiasi' satu baris di laba rugi", "Mencatat kas bertambah tanpa jurnal lawan karena dividen sudah menjadi hak", "Mengurangi nilai tercatat investasi — bukan pendapatan"], a:3},
 {q:"Laba belum direalisasi downstream Rp10.000 juta belum dieliminasi (ilustratif). Setelah koreksi, laba yang dapat diatribusikan kepada pemilik induk menjadi… (dasar: laba total 42.000, NCI 2.400)", o:["Rp32.000 juta", "Rp29.600 juta", "Rp39.600 juta", "Rp31.600 juta"], a:1},
 {q:"Piutang induk ke anak Rp15.000 juta dieliminasi saat konsolidasi (ilustratif). Dampak ke TOTAL ASET konsolidasian…", o:["Naik Rp15.000 juta — eliminasi menambah pos penyeimbang di aset", "Tetap — eliminasi hanya reklasifikasi antar pos dalam aset", "Turun Rp15.000 juta — piutang & utang internal saling hapus", "Naik berlipat karena piutang dan utang dieliminasi dua-duanya"], a:2},
 {q:"Dua perusahaan membentuk joint operation 50:50 atas aset 1.000 dan liabilitas 400 (ilustratif, Rp juta). Tiap operator mencatat…", o:["Satu baris investasi 300 dengan metode ekuitas (PSAK 228)","Aset 500 dan liabilitas 200 langsung di neraca sendiri","Tidak mencatat apa-apa sampai ventura membagikan dividen","Aset 1.000 dan liabilitas 400 penuh — konsolidasi 100%"], a:1},
 {q:"Pengaturan yang sama diperlakukan sebagai joint venture. Tiap venturer mencatat…", o:["Aset 500 dan liabilitas 200 langsung di neraca","Konsolidasi penuh — 100% aset dan liabilitas ventura digabung","Satu baris investasi 300 dan bagian laba 60 (metode ekuitas)","Tidak ada pencatatan sampai ventura dilikuidasi"], a:2},
 {q:"Pembeda utama ventura bersama dengan entitas asosiasi adalah…", o:["Keputusan penting butuh persetujuan bulat — pengendalian bersama","Persen kepemilikan: ventura bersama 50%, asosiasi 20–50%","Ventura bersama dikonsolidasi penuh seperti entitas anak","Ventura bersama memakai metode biaya, asosiasi memakai metode ekuitas"], a:0}];
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
           window.FSAMistake.log(35, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Phase 9 Tuntas ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu bisa membaca split laba pemilik vs NCI, membedakan konsolidasi–metode ekuitas–biaya, dan mengeliminasi transaksi intra-grup — termasuk jebakan basis angka seperti kasus Garuda. Kembali ke <a href=\"../index.html\">FSA Lab</a>.</p>";
    try{ localStorage.setItem("fsa_gate_m35","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m35") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m35") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m35") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Phase 9 Tuntas ✓</h3><p>Modul 35 sudah kamu lewati sebelumnya — kembali ke <a href=\"../index.html\">FSA Lab</a>.</p>";
  }
}catch(e){}
})();
