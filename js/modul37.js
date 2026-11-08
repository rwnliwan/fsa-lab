/* FSA Lab — Modul 37: Inventory & Long-Lived Asset Methods (lensa TRIPLE; contoh baru = ILUSTRATIF berlabel) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
fifo:{ title:"FIFO vs LIFO di masa inflasi: PT Dagang Prima (FIKTIF) — awal 100 unit @100, beli 100 @110, beli 100 @120, jual 150 unit @200. Angka ILUSTRATIF (Rp juta).", cols:["Ukuran","FIFO","LIFO"],
 rows:[
  {l:"HPP: siapa yang 'dijual' duluan", v:"15.500", v2:"17.500",
   d:"FIFO menjual yang PALING LAMA dulu: 100×100 + 50×110 = 15.500 (ilustratif). LIFO (periodik) menjual yang PALING BARU dulu: 100×120 + 50×110 = 17.500. Di masa inflasi, LIFO selalu menghasilkan HPP LEBIH BESAR karena yang dijual adalah barang termahal. Selisih HPP = 2.000.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa forensik: dua perusahaan dengan operasi IDENTIK bisa melaporkan laba beda 2.000 hanya karena metode — jangan bandingkan margin lintas metode tanpa penyesuaian."},
  {l:"Persediaan akhir: cerminan HPP", v:"17.500", v2:"15.500",
   d:"FIFO menyisakan barang termahal: 50×110 + 100×120 = 17.500 (ilustratif). LIFO menyisakan barang termurah: 100×100 + 50×110 = 15.500. Selisih 2.000 = LIFO RESERVE — jembatan resmi untuk mengubah laporan LIFO menjadi basis FIFO. Di neraca, persediaan LIFO terlihat 'lebih kecil' padahal barangnya sama.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa kredit: agunan persediaan berbasis nilai LIFO under-valued 2.000 — bank yang memakai angka LIFO mentah memberi plafon terlalu kecil; yang memakai FIFO tanpa penyesuaian memberi terlalu besar."},
  {l:"Laba kotor: FIFO menang di inflasi", v:"14.500", v2:"12.500",
   d:"Penjualan 150×200 = 30.000 (ilustratif). Laba kotor FIFO = 30.000 − 15.500 = 14.500; LIFO = 30.000 − 17.500 = 12.500. FIFO melaporkan laba LEBIH TINGGI 2.000 di inflasi — 'lebih tinggi' di sini murni efek metode, bukan kinerja. Dengan pajak 22%, LIFO menghemat pajak 440 (2.000×22%) dan laba bersihnya lebih rendah 1.560.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa investasi: 'pertumbuhan laba kotor' emiten ritel di era inflasi — cek dulu: FIFO atau rata-rata? Berapa LIFO reserve-nya?"},
  {l:"PSAK MELARANG LIFO — titik, tidak ada pengecualian", v:"dilarang", v2:"PSAK 202",
   d:"PSAK 202 (dulu PSAK 14, setara IAS 2) HANYA mengizinkan FIFO dan rata-rata tertimbang untuk persediaan yang sejenis — LIFO DILARANG. US GAAP masih mengizinkan LIFO (dengan syarat conformity rule: bila LIFO untuk pajak, harus LIFO untuk laporan). Akibatnya: emiten AS ber-LIFO tidak bisa dibandingkan langsung dengan emiten Indonesia — WAJIB disetarakan via LIFO reserve dulu.",
   tag:"PSAK 202 (dulu PSAK 14) · IAS 2",
   k:"Lensa forensik: emiten Indonesia yang 'menemukan' LIFO di laporannya = red flag kepatuhan; emiten AS = normal, tapi bandingkan setelah penyesuaian."}
 ]},
reserve:{ title:"LIFO reserve: jembatan LIFO → FIFO. Selisih persediaan 2.000, pajak 22%. Angka ILUSTRATIF (Rp juta).", cols:["Penyesuaian","Hitungan","Hasil"],
 rows:[
  {l:"Persediaan: tambah LIFO reserve", v:"+2.000", v2:"15.500 → 17.500",
   d:"Untuk menyetarakan neraca LIFO ke basis FIFO: persediaan +2.000 (15.500 → 17.500, ilustratif). Ini penyesuaian analis, BUKAN jurnal perusahaan — perusahaan LIFO tetap melaporkan 15.500. Tanpa langkah ini, rasio lancar dan perputaran persediaan tidak comparable.",
   tag:"Teknik analis (angka ilustratif)",
   k:"Lensa kredit: current ratio emiten LIFO naik setelah penyesuaian — putuskan DULU basis mana yang dipakai covenant, sebelum tanda tangan."},
  {l:"Pajak tangguhan: LIFO reserve menciptakan DTL", v:"2.000 × 22%", v2:"440",
   d:"Laba LIFO lebih rendah → pajak kini lebih kecil 440 (ilustratif) → liabilitas pajak tangguhan (DTL) 440. Logika: penghematan pajak LIFO hanya penundaan — saat persediaan lama akhirnya terjual (likuidasi lapisan LIFO), pajaknya jatuh tempo. DTL 440 = 'utang pajak masa depan' yang tersembunyi di balik laba rendah.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa forensik: likuidasi lapisan LIFO diam-diam (jual stok lama) memicu lonjakan laba + pajak sekaligus — baca arus persediaan, bukan cuma laba."},
  {l:"Ekuitas: laba ditahan naik bersih setelah pajak", v:"2.000 − 440", v2:"+1.560",
   d:"Ekuitas basis FIFO = ekuitas LIFO + 2.000 (persediaan) − 440 (DTL) = +1.560 (ilustratif). Footing: 15.500 + 2.000 = 17.500 ✓; 2.000 − 440 = 1.560 ✓. Tiga penyesuaian ini (persediaan, DTL, ekuitas) = paket lengkap konversi LIFO→FIFO yang dipakai analis kredit dan ekuitas.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa investasi: ROE emiten LIFO terlihat lebih tinggi (ekuitas lebih kecil) — setelah penyesuaian FIFO, ROE turun ke level yang sebenarnya."},
  {l:"Kapan LIFO reserve menyusut: sinyal bahaya", v:"likuidasi lapisan", v2:"peringatan",
   d:"LIFO reserve menyusut tajam tanpa penjelasan = perusahaan menjual persediaan TUA (likuidasi lapisan): HPP tiba-tiba murah → laba melonjak satu kali. Ini bukan efisiensi — ini makan tabungan. Analis menandai tahun likuidasi sebagai non-recurring dan mengeluarkannya dari laba inti.",
   tag:"Pola umum (peringatan)",
   k:"Lensa forensik: 'margin membaik' + LIFO reserve anjlok + volume penjualan datar = laba dari gudang, bukan dari pasar."}
 ]},
capex:{ title:"Kapitalisasi vs beban: overhaul mesin Rp8.000 juta, umur 4 tahun. Angka ILUSTRATIF.", cols:["Tahun 1","Kapitalisasi","Beban langsung"],
 rows:[
  {l:"Beban tahun 1: beda 6.000", v:"2.000", v2:"8.000",
   d:"Dikapitalisasi: 8.000 menjadi aset, disusutkan 2.000/tahun (ilustratif) — beban tahun 1 hanya 2.000. Dibebankan langsung: 8.000 penuh memotong laba tahun 1. Selisih laba tahun 1 = 6.000. Manajemen yang ingin 'laba tahun ini bagus' punya insentif mengkapitalisasi; yang ingin 'pajak tahun ini kecil' punya insentif membebankan.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa forensik: rasio kapitalisasi (aset baru ÷ total belanja) yang melonjak tanpa belanja modal yang jelas = laba dipoles."},
  {l:"Neraca: aset vs tidak ada", v:"+6.000 neto", v2:"0",
   d:"Akhir tahun 1, kapitalisasi menyisakan aset neto 6.000 (8.000 − 2.000, ilustratif); beban langsung menyisakan NOL. ROA tahun 1 terlihat lebih baik dengan beban langsung (aset lebih kecil) TAPI laba jauh lebih kecil — dua efek berlawanan yang harus dibaca bersamaan, bukan salah satu.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa kredit: aset hasil kapitalisasi agresif (overhaul yang sebenarnya perawatan rutin) = agunan semu — kreditur menilainya NOL."},
  {l:"Uji kapitalisasi: tiga syarat kumulatif", v:"manfaat > 1 thn", v2:"PSAK 216",
   d:"PSAK 216 (dulu PSAK 16, setara IAS 16) mengizinkan kapitalisasi pengeluaran purna-perolehan HANYA bila: (1) kemungkinan besar manfaat ekonomi masa depan mengalir ke entitas, (2) biaya dapat diukur andal, DAN (3) pengeluaran MENINGKATKAN kinerja/melebihi standar awal (kapasitas, umur, efisiensi) — bukan sekadar memulihkan. Perawatan rutin = beban, titik. Overhaul yang menambah umur mesin 4 tahun = lolos uji.",
   tag:"PSAK 216 (dulu PSAK 16) · IAS 16",
   k:"Lensa forensik: 'overhaul' yang dikapitalisasi tiap tahun untuk mesin yang sama = perawatan rutin berkedok capex — minta rincian engineering-nya."},
  {l:"Arus kas: tidak terpengaruh pilihan ini", v:"(8.000) sama", v2:"aturan",
   d:"Kas keluar 8.000 SAMA di kedua perlakuan (ilustratif) — bedanya hanya KLASIFIKASI: kapitalisasi → arus kas INVESTASI; beban langsung → arus kas OPERASI. Akibatnya CFO terlihat LEBIH BAIK 8.000 bila dikapitalisasi! Analis yang menilai 'kualitas laba' dari CFO tanpa menyesuaikan klasifikasi capex = tertipu.",
   tag:"Aturan FSA Lab: samakan klasifikasi capex",
   k:"Lensa investasi: CFO naik + capex naik beriringan = pindahkan capex pemeliharaan ke atas sebelum hitung FCF — FCF = CFO − capex total, bukan CFO saja."}
 ]},
impair:{ title:"Impairment & komponen: carrying 25.000, FVLCD 18.000, VIU 20.000; gedung 50.000 tiga komponen. Angka ILUSTRATIF (Rp juta).", cols:["Langkah","Hitungan","Hasil"],
 rows:[
  {l:"Recoverable amount = yang LEBIH TINGGI", v:"max(18.000, 20.000)", v2:"20.000",
   d:"PSAK 236 (dulu PSAK 48, setara IAS 36): jumlah terpulihkan = NILAI TERTINGGI antara nilai wajar dikurangi biaya pelepasan (18.000) dan nilai pakai (20.000, ilustratif) → 20.000. Logika: pemilik rasional memilih alternatif terbaik — jual atau pakai. Salah kaprah umum: memakai yang terendah 'agar konservatif' — itu SALAH standar.",
   tag:"PSAK 236 (dulu PSAK 48) · IAS 36",
   k:"Lensa forensik: VIU 20.000 di atas FVLCD 18.000 = nilai 'pakai' bertumpu pada proyeksi manajemen — uji asumsi diskonto & growth-nya, di situlah ruang main."},
  {l:"Rugi impairment = carrying − recoverable", v:"25.000 − 20.000", v2:"5.000",
   d:"Rugi penurunan nilai = 5.000 (ilustratif), diakui di laba rugi (atau mengurangi surplus revaluasi bila ada). Carrying baru = 20.000; depresiasi tahun-tahun berikut dihitung dari 20.000. Footing: 25.000 − 5.000 = 20.000 ✓. Aset keuangan & persediaan punya standar sendiri — PSAK 236 untuk aset non-keuangan di luar cakupannya.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa kredit: kreditur memakai carrying SETELAH impairment untuk tangible net worth — 5.000 ini menghapus penyangga utang."},
  {l:"Reversal: boleh, KECUALI goodwill — selamanya", v:"batas carrying", v2:"PSAK 236",
   d:"Bila kondisi pulih, rugi impairment aset NON-goodwill BOLEH dibalik — maksimal sampai nilai tercatat SEANDAINYA tidak pernah di-impair (setelah depresiasi normal). Goodwill: TIDAK BOLEH dibalik dalam kondisi apa pun — karena 'pemulihan goodwill' tak bisa dibedakan dari goodwill yang dihasilkan internal (yang dilarang diakui). Ini jebakan ujian & praktik paling klasik.",
   tag:"PSAK 236 (dulu PSAK 48) · IAS 36",
   k:"Lensa forensik: reversal besar-besaran setahun setelah big bath = cookie jar terbalik — laba 'pulih' yang direkayasa."},
  {l:"Depresiasi komponen: 3.400 vs 2.000 single-rate", v:"1.200+1.200+1.000", v2:"3.400",
   d:"Gedung 50.000 (ilustratif): struktur 30.000/25 thn = 1.200, atap 12.000/10 thn = 1.200, lift 8.000/8 thn = 1.000 → total 3.400/thn. Single-rate 50.000/25 = 2.000/thn — MEREMEHKAN beban 1.400/thn karena atap & lift aus lebih cepat. PSAK 216 MEWAJIBKAN depresiasi per komponen signifikan. Footing: 1.200+1.200+1.000 = 3.400 ✓; 30.000+12.000+8.000 = 50.000 ✓.",
   tag:"PSAK 216 (dulu PSAK 16) · IAS 16",
   k:"Lensa investasi: emiten properti/industri TANPA depresiasi komponen = laba overstated sistematis — sesuaikan sendiri: +1.400 beban per tahun di contoh ini."}
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
renderStmt("fifo");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Inflasi input melonjak: harga beli terakhir naik 120 → 150 (ilustratif)", q1:"Selisih laba kotor FIFO − LIFO", q2:"LIFO reserve", a1:"naik", a2:"naik",
  e:"HPP LIFO naik (barang termahal makin mahal) sementara FIFO hampir tak bergerak → selisih melebar. LIFO reserve = FIFO − LIFO ikut melebar. Makin panas inflasi, makin besar distorsi antar-metode."},
 {t:"Perusahaan AS beralih FIFO → LIFO di tengah inflasi (ilustratif)", q1:"Laba bersih yang dilaporkan", q2:"Pajak kini yang dibayar", a1:"turun", a2:"turun",
  e:"HPP naik → laba turun → pajak turun (conformity rule: LIFO untuk pajak = LIFO untuk laporan). Ini MOTIF PAJAK klasik pemilihan LIFO — bukan efisiensi operasi."},
 {t:"Overhaul Rp8.000 juta dibebankan langsung, bukan dikapitalisasi (ilustratif)", q1:"Laba tahun berjalan", q2:"Aset tetap neto akhir tahun", a1:"turun", a2:"turun",
  e:"Beban 8.000 vs 2.000 → laba lebih rendah 6.000; tidak ada aset baru yang tercatat. Pilihan ini 'membersihkan' neraca dari aset semu — tapi menghukum laba tahun ini."},
 {t:"Harga jual produk anjlok: VIU turun 20.000 → 16.000 (FVLCD tetap 18.000, ilustratif)", q1:"Recoverable amount", q2:"Rugi impairment", a1:"turun", a2:"naik",
  e:"Recoverable = max(18.000, 16.000) = 18.000 (turun dari 20.000) → rugi naik 25.000−18.000 = 7.000. Pemilik rasional kini memilih JUAL, bukan pakai."},
 {t:"Umur atap direvisi 10 → 6 tahun (ilustratif)", q1:"Beban depresiasi tahunan komponen atap", q2:"Laba bersih", a1:"naik", a2:"turun",
  e:"12.000÷6 = 2.000/thn (dari 1.200) → total komponen 4.200 vs 3.400. Revisi estimasi = prospektif, bukan restatement — tapi analis menandai 'laba inti' tanpa efek revisi."},
 {t:"Rugi impairment aset non-goodwill Rp5.000 juta dibalik penuh tahun berikut (ilustratif)", q1:"Laba tahun pemulihan", q2:"Nilai tercatat aset", a1:"naik", a2:"naik",
  e:"Reversal diakui di laba rugi (bukan OCI) — TAPI maksimal sampai carrying seandainya tak pernah di-impair. Goodwill tidak boleh. Reversal jumbo setahun setelah big bath = pola cookie-jar terbalik."}
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
    try{ localStorage.setItem("fsa_pg_m37", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"HPP FIFO (Rp juta)", hint:"100×100 + 50×110 — jual yang paling lama dulu (ilustratif)", ans:15500, dec:false, tol:1,
  why:"15.500 — FIFO di inflasi = HPP terkecil, laba terbesar. Bandingkan selalu dengan LIFO reserve."},
 {q:"LIFO reserve (Rp juta)", hint:"Persediaan FIFO 17.500 − LIFO 15.500 (ilustratif)", ans:2000, dec:false, tol:1,
  why:"2.000 — jembatan LIFO→FIFO: +2.000 persediaan, +440 DTL, +1.560 ekuitas."},
 {q:"Rugi impairment (Rp juta)", hint:"Carrying 25.000 − max(18.000, 20.000) (ilustratif)", ans:5000, dec:false, tol:1,
  why:"5.000 — recoverable = yang TERTINGGI (20.000), bukan terendah. Carrying baru 20.000."},
 {q:"Depresiasi komponen total per tahun (Rp juta)", hint:"30.000/25 + 12.000/10 + 8.000/8 (ilustratif)", ans:3400, dec:false, tol:1,
  why:"3.400 — vs 2.000 single-rate. Tanpa komponen, beban kurang 1.400/tahun."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 15.500">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 15.500)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — kamu menilai saham PT Dagang Prima (FIKTIF). Laba kotor FIFO 14.500 vs LIFO 12.500, LIFO reserve 2.000, rugi impairment 5.000, depresiasi komponen 3.400 vs 2.000 single-rate. Tulis 3 baris: metode mana yang kamu pakai untuk membandingkan dengan emiten Indonesia + penyesuaianmu, bagaimana kamu memperlakukan rugi impairment & reversal di proyeksi, keputusanmu (beli / tunggu / hindari).",
 credit:"Lensa kredit — perusahaan mengajukan pinjaman dengan agunan persediaan & gedung. Persediaan LIFO 15.500 (FIFO 17.500), gedung carrying 20.000 pasca-impairment, overhaul 8.000 dikapitalisasi. Tulis 3 baris: nilai agunan mana yang kamu akui (dengan haircut berapa) + alasan, satu covenant terkait kapitalisasi belanja & impairment yang kamu minta, keputusanmu.",
 forensic:"Lensa forensik — sebelum ACC, angka mana yang kamu verifikasi ulang? Tulis 3 baris: metode persediaan yang diklaim vs yang dipakai + sumbernya, satu uji atas kapitalisasi overhaul 8.000 (manfaat >1 tahun? bukti engineering?), dan satu temuan yang membuatmu menolak mentah-mentah."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m37_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m37_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"PT Dagang Prima memakai FIFO (ilustratif). Menurut PSAK 202 (dulu PSAK 14), metode persediaan yang DILARANG adalah…", o:["FIFO — metode ini dilarang karena menaikkan laba saat harga naik", "LIFO — hanya FIFO atau rata-rata tertimbang yang diizinkan", "Rata-rata tertimbang — hanya identifikasi khusus yang diizinkan", "Identifikasi khusus — tidak boleh dipakai untuk barang sejenis"], a:1},
 {q:"LIFO reserve Rp2.000 juta (ilustratif). Penyesuaian analis untuk menyetarakan persediaan LIFO ke basis FIFO…", o:["Tambah 2.000 ke persediaan LIFO","Kurang 2.000 dari persediaan LIFO","Tidak ada — langsung comparable","Bagi dua: tambah 1.000"], a:0},
 {q:"Carrying Rp25.000 juta, FVLCD Rp18.000 juta, VIU Rp20.000 juta (ilustratif). Recoverable amount menurut PSAK 236 (dulu PSAK 48)…", o:["Rp18.000 juta — ambil yang terendah agar konservatif","Rp43.000 juta — jumlahkan keduanya","Rp20.000 juta — ambil yang tertinggi","Rp25.000 juta — tidak ada impairment"], a:2},
 {q:"Tahun lalu perusahaan mencatat rugi impairment goodwill. Tahun ini kondisi pulih (ilustratif). Perlakuan yang TEPAT…", o:["Boleh dibalik bila kondisi pasar sudah pulih seperti aset lainnya", "Boleh dibalik tetapi hanya melalui OCI, bukan laba rugi", "Boleh dibalik maksimal 50% dari rugi yang pernah dicatat", "Dilarang — rugi impairment goodwill tidak boleh dibalik"], a:3},
 {q:"Overhaul Rp8.000 juta, umur manfaat 4 tahun (ilustratif). Bila dikapitalisasi (bukan dibebankan langsung), laba tahun 1…", o:["Lebih rendah 8.000","Sama saja — kas keluarnya sama","Lebih tinggi 6.000","Lebih tinggi 8.000"], a:2}];
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
/* SF-9 (R8): phaseTitle/phaseNote di scope IIFE — dipakai juga blok RESTORE di bawah. */
var m36ok=false; try{ m36ok = localStorage.getItem("fsa_gate_m36")==="lolos"; }catch(e){}
var m38ok=false; try{ m38ok = localStorage.getItem("fsa_gate_m38")==="lolos"; }catch(e){}
var phaseTitle = (m36ok && m38ok) ? "Phase 10 Tuntas \u2713" : "Modul 37 Tuntas \u2713";
var phaseNote = (m36ok && m38ok) ? "" : "<br>Selesaikan juga <a href=\"../modul-36/\">Modul 36</a> dan <a href=\"../modul-38/\">Modul 38</a> untuk menuntaskan Phase 10.";
$("#quiz-submit").addEventListener("click", function(){
  var score = 0, picked = [], skipped = [];
  QUIZ.forEach(function(q,i){
    var sel = document.querySelector('input[name="q'+i+'"]:checked');
    picked.push(sel ? +sel.value : -1);
    try{ if(window.FSAMistake && sel && +sel.value !== q.a)
           window.FSAMistake.log(37, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>"+phaseTitle+"</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu bisa membedakan FIFO vs LIFO di inflasi (dan tahu PSAK 202 melarang LIFO), menyetarakan laporan via LIFO reserve, menguji kapitalisasi vs beban, menghitung impairment PSAK 236 termasuk aturan reversal, dan memakai depresiasi komponen. Kembali ke <a href=\"../index.html\">FSA Lab</a>."+phaseNote+"</p>";
    try{ localStorage.setItem("fsa_gate_m37","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m37") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m37") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m37") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>"+phaseTitle+"</h3><p>Modul 37 sudah kamu lewati sebelumnya — kembali ke <a href=\"../index.html\">FSA Lab</a>.</p>";
  }
}catch(e){}
})();
