/* FSA Lab — Modul 46: IFRS 13 / PSAK 113 — Hierarki Nilai Wajar (PT Cemerlang Abadi, Rp juta; angka kanonis CANONICAL-DATA.md; nilai wajar tanah 45.000, DCF 75.816, harga saham Rp1.250 ilustratif) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
def:{ title:"Definisi nilai wajar — exit price, pasar utama, pelaku pasar", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Fair value = exit price, bukan entry price", v:"harga jual", v2:"pasar utama",
   d:"PSAK 113 mendefinisikan nilai wajar sebagai harga yang diterima untuk MENJUAL aset (atau dibayar untuk mengalihkan liabilitas) dalam transaksi teratur antara pelaku pasar pada tanggal pengukuran. Ini exit price — harga keluar — bukan harga yang dibayar perusahaan saat membeli (entry price). Selisih keduanya nyata: biaya transaksi dan marjin dealer membuat harga beli dan harga jual berbeda.",
   psak:"PSAK 113 (dulu 68) = IFRS 13", f:"Kredit: nilai wajar yang dipakai sebagai agunan harus exit price — harga yang benar-benar bisa didapat saat dijual, bukan harga beli. Investasi: aset yang 'naik' hanya karena entry price diganti exit price = bukan keuntungan riil. Forensik: perusahaan yang mengukur aset pada harga beli lalu menyebutnya nilai wajar = definisi yang salah."},
  {l:"Pasar utama vs pasar paling menguntungkan", v:"volume terbesar", v2:"harga neto tertinggi",
   d:"Pengukuran memakai harga di PASAR UTAMA — pasar dengan volume dan tingkat aktivitas terbesar untuk aset itu. Bila tidak ada pasar utama, dipakai pasar PALING MENGUNTUNGKAN — yang memberi harga neto tertinggi setelah biaya transaksi. Pasar yang dipakai harus bisa diakses entitas pada tanggal pengukuran.",
   psak:"PSAK 113 (dulu 68)", f:"Kredit: agunan yang 'bernilai tinggi' di pasar yang tidak bisa diakses perusahaan = nilai yang tidak bisa direalisasi. Investasi: cek pasar mana yang dipakai — pasar tipis memberi harga yang rapuh. Forensik: perusahaan yang pindah-pindah pasar pengukuran tiap tahun untuk mendapat harga tertinggi = cherry-picking pasar."},
  {l:"Pelaku pasar — pembeli hipotetis yang rasional", v:"independen", v2:"berpengetahuan",
   d:"Harga diukur dari sudut pandang PELAKU PASAR — pembeli dan penjual yang independen, berpengetahuan, mampu dan bersedia bertransaksi, tanpa tekanan. Bukan dari sudut pandang perusahaan sendiri: nilai sinergi khusus milik perusahaan (mis. aset itu lebih berharga di tangan Cemerlang) TIDAK masuk nilai wajar, karena pembeli hipotetis tidak memilikinya.",
   psak:"PSAK 113 (dulu 68)", f:"Kredit: nilai wajar mengabaikan sinergi pemilik — agunan dinilai apa adanya di tangan pembeli umum. Investasi: premi yang dibayar atas sinergi bukan bagian nilai wajar aset. Forensik: nilai wajar yang memasukkan 'nilai strategis khusus kami' = angka yang digelembungkan asumsi internal."}
 ]},
hie:{ title:"Hierarki Level 1 / 2 / 3 — seberapa 'bisa dicek' angkanya? (pondasi: M16)", cols:["Level","Input","Contoh"],
 rows:[
  {l:"Level 1 — harga kuotasi pasar aktif, tanpa penyesuaian", v:"paling objektif", v2:"saham listed",
   d:"Harga kuotasi (unadjusted) di pasar aktif untuk aset atau liabilitas yang IDENTIK. Dipakai apa adanya — tanpa penyesuaian. Contoh: saham yang diperdagangkan di bursa. Syaratnya pasar AKTIF: transaksi cukup sering dan volume cukup besar sehingga harga tersedia setiap saat. (Pondasi di M16 — di sini pendalaman: kapan pasar berhenti disebut aktif.)",
   psak:"PSAK 113 (dulu 68)", f:"Kredit: Level 1 jarang bermasalah — kecuali pasarnya diklaim aktif padahal transaksinya jarang. Investasi: harga Level 1 adalah harga yang benar-benar bisa dieksekusi hari ini. Forensik: saham yang 'listed' tetapi tidak diperdagangkan berbulan-bulan lalu tetap diklaim Level 1 = level yang salah."},
  {l:"Level 2 — input teramati, model sederhana", v:"kurva, kurs", v2:"swap, obligasi",
   d:"Input selain kuotasi Level 1 yang bisa DIAMATI pasar — langsung (harga aset sejenis) atau tidak langsung (kurva imbal hasil, kurs, volatilitas implisit). Tekniknya model sederhana: obligasi dinilai dari kurva yield, swap dari kurva suku bunga. Kuncinya: inputnya berasal dari pasar, bukan dari asumsi manajemen.",
   psak:"PSAK 113 (dulu 68)", f:"Kredit: tanyakan sumber inputnya — kurva dari penyedia independen atau 'estimasi internal'? Investasi: Level 2 yang inputnya benar-benar pasar masih bisa dipercaya. Forensik: Level 2 berinput buatan = Level 3 berkedok — cek sumber tiap input signifikan."},
  {l:"Level 3 — input tak teramati, mark-to-model", v:"asumsi manajemen", v2:"DCF, cost approach",
   d:"Input yang TIDAK bisa diamati pasar — proyeksi arus kas, discount rate internal, asumsi pertumbuhan — sehingga nilai dihitung model manajemen sendiri (mark-to-model). Contoh Cemerlang: mesin khusus di bangunan & mesin neto 132.000 yang tidak ada pasarnya. Level 3 bukan dilarang — tetapi ia menuntut pengungkapan paling berat: teknik, asumsi, dan sensitivitas.",
   psak:"PSAK 113 (dulu 68)", f:"Kredit: makin besar porsi Level 3, makin besar kepercayaan buta ke manajemen — diskon valuasi accordingly. Investasi: laba dari perubahan nilai Level 3 adalah laba 'yang dihitung', bukan yang terjadi. Forensik: Level 3 besar + laba stabil = minta analisis sensitivitas sebelum percaya."}
 ]},
tek:{ title:"Tiga teknik valuasi — market, income, cost", cols:["Teknik","Cara","Contoh"],
 rows:[
  {l:"Market approach — bandingkan dengan transaksi pasar", v:"komparabel", v2:"tanah, properti",
   d:"Memakai harga transaksi aset yang sama atau sejenis di pasar — dengan penyesuaian atas perbedaan kondisi, lokasi, dan karakteristik. Contoh Cemerlang: tanah 40.000 (nilai buku) dinilai dari harga bidang sejenis di kawasan yang sama. Cocok bila ada pasar komparabel; lemah bila asetnya unik.",
   psak:"PSAK 113 (dulu 68)", f:"Kredit: komparabel harus benar-benar sebanding — beda lokasi atau zonasi = penyesuaian yang wajib dijelaskan. Investasi: market approach memberi jangkar pasar yang bisa dicek. Forensik: komparabel yang dipilih hanya yang harganya tinggi = cherry-picking — minta seluruh sampel."},
  {l:"Income approach — diskontokan arus kas masa depan (DCF)", v:"DCF", v2:"Level 3",
   d:"Mengubah arus kas masa depan menjadi nilai kini dengan discount rate yang mencerminkan risiko — DCF adalah teknik utamanya. Dipakai saat aset tidak punya pasar: mesin khusus Cemerlang yang menghasilkan arus kas ilustratif 20.000 per tahun selama 5 tahun, didiskonto 10%, bernilai 75.816 (Rp juta). Hasilnya sensitif pada dua asumsi: arus kas dan discount rate.",
   psak:"PSAK 113 (dulu 68)", f:"Kredit: uji discount rate-nya — rate yang terlalu rendah menggelembungkan nilai agunan. Investasi: DCF yang asumsi pertumbuhannya optimistis = nilai yang optimistis. Forensik: minta tabel sensitivitas — nilai yang berubah drastis dengan perubahan rate kecil = angka yang rapuh."},
  {l:"Cost approach — biaya penggantian kini dikurangi keusangan", v:"replacement cost", v2:"aset khusus",
   d:"Nilai wajar = biaya untuk membangun atau membeli kembali aset dengan kapasitas yang sama hari ini, dikurangi keusangan fisik, fungsional, dan ekonomis. Dipakai untuk aset khusus yang tidak menghasilkan arus kas sendiri dan tidak ada pasarnya. Contoh ilustratif: mesin dengan biaya penggantian 150.000 dikurangi keusangan 45.000 → nilai wajar 105.000 (Rp juta).",
   psak:"PSAK 113 (dulu 68)", f:"Kredit: keusangan adalah judgment — keusangan yang diremehkan menggelembungkan nilai agunan. Investasi: cost approach memberi batas atas — tidak ada pembeli rasional membayar di atas biaya membangun kembali. Forensik: biaya penggantian tanpa potongan keusangan = nilai yang belum dikoreksi umur aset."}
 ]},
dis:{ title:"Transfer antar level & disclosure — kapan level pindah, apa yang wajib diungkap", cols:["Pos","Aturan","Konteks"],
 rows:[
  {l:"Level ditentukan input terendah yang signifikan", v:"prinsip level", v2:"signifikan",
   d:"Instrumen diklasifikasikan pada level input TERENDAH yang signifikan bagi keseluruhan pengukuran. DCF yang memakai satu asumsi tak teramati yang signifikan = Level 3, walau input lainnya teramati. Prinsip ini mencegah manajemen 'mengencerkan' asumsi internal dengan input pasar agar terlihat Level 2.",
   psak:"PSAK 113 (dulu 68)", f:"Kredit: tanyakan input mana yang paling menentukan nilai — bila jawabannya asumsi internal, perlakukan sebagai Level 3. Investasi: label level yang terlalu bagus untuk modelnya = red flag. Forensik: Level 2 yang satu input signifikannya tak teramati = Level 3 yang salah label."},
  {l:"Transfer antar level wajib diungkap beserta alasannya", v:"wajib diungkap", v2:"tiap transfer",
   d:"Bila pasar menjadi tidak aktif (Level 1 → 2) atau input tak teramati menjadi signifikan (Level 2 → 3), transfer itu WAJIB diungkap beserta alasan dan kebijakan kapan transfer diakui. Transfer yang diam-diam = aset yang tadinya 'bisa dicek pasar' kini hanya 'kata model' tanpa ada yang tahu.",
   psak:"PSAK 113 (dulu 68)", f:"Kredit: transfer Level 2 → 3 menaikkan risiko pengukuran — perbarui penilaian agunanmu. Investasi: perusahaan yang sering memindah level = pengukurannya tidak stabil. Forensik: transfer yang terjadi tepat sebelum laba dilaporkan = cek apakah level dipindah untuk menghaluskan laba."},
  {l:"Disclosure Level 3 — teknik, asumsi, dan sensitivitas", v:"pengungkapan terberat", v2:"sensitivitas",
   d:"Untuk Level 3, pengungkapan wajib mencakup: teknik valuasi dan input yang dipakai, rekonsiliasi saldo awal–akhir, dan analisis SENSITIVITAS — berapa nilai berubah bila asumsi utama berubah. Contoh Cemerlang: DCF mesin 75.816 pada discount rate 10% turun menjadi 72.096 pada 12% — selisih 3.720 (4,9%). Tanpa sensitivitas, pengguna laporan tidak tahu seberapa rapuh angka itu.",
   psak:"PSAK 113 (dulu 68)", f:"Kredit: sensitivitas menunjukkan rentang nilai agunan yang mungkin — pakai ujung bawah untuk keputusan kredit. Investasi: Level 3 tanpa sensitivitas = angka yang tidak bisa diuji. Forensik: sensitivitas yang hilang dari catatan = pengungkapan belum lengkap — tolak angka itu sebagai bukti."}
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
renderStmt("def");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Harga kuotasi saham (FVTPL) naik 10% dalam sehari", q1:"Nilai wajar (Level 1)", q2:"Laba periode berjalan", a1:"naik", a2:"naik",
  e:"Level 1 dipakai apa adanya — harga naik 10% berarti nilai wajar naik 10%. Karena instrumen diukur FVTPL (M16), perubahan nilai wajar langsung ke laba rugi — laba ikut naik 10% dari nilai instrumen itu."},
 {t:"Bursa saham tempat aset diperdagangkan menjadi sepi — transaksi jarang, volume kecil", q1:"Level pengukuran aset", q2:"Pengungkapan transfer yang wajib", a1:"turun", a2:"naik",
  e:"Pasar yang tidak lagi aktif berarti harga kuotasi bukan lagi Level 1 — pengukuran turun ke Level 2 (input teramati lain). Transfer Level 1 → 2 wajib diungkap beserta alasannya: pengguna laporan harus tahu aset itu kini kurang bisa dicek pasar."},
 {t:"Discount rate DCF mesin khusus naik dari 10% menjadi 12%", q1:"Nilai wajar Level 3 (DCF)", q2:"Ketidakpastian pengukuran", a1:"turun", a2:"naik",
  e:"Discount rate lebih tinggi mendiskonto arus kas lebih berat: 75.816 → 72.096 (turun 3.720). Ketidakpastian naik — nilai kini lebih sensitif pada asumsi rate, dan analis wajib membaca sensitivitasnya sebelum percaya."},
 {t:"Input tak teramati menjadi signifikan dalam model obligasi yang tadinya Level 2", q1:"Level klasifikasi instrumen", q2:"Beban pembuktian manajemen", a1:"turun", a2:"naik",
  e:"Prinsip input terendah yang signifikan: satu asumsi tak teramati yang signifikan menurunkan klasifikasi ke Level 3. Beban pembuktian naik — manajemen kini wajib mengungkapkan teknik, asumsi, dan sensitivitas modelnya."},
 {t:"Biaya penggantian mesin khusus naik karena harga baja naik", q1:"Nilai wajar (cost approach)", q2:"Selisih nilai wajar terhadap nilai buku", a1:"naik", a2:"naik",
  e:"Cost approach: biaya penggantian naik berarti nilai wajar naik (sebelum keusangan). Bila nilai buku tetap, selisih nilai wajar terhadap nilai buku ikut membesar — potensi revaluasi naik, tetapi keusangan tetap harus dikurangkan."},
 {t:"Manajemen mengklaim aset Level 3 sebagai Level 2 — tanpa satu pun input teramati baru", q1:"Kredibilitas pengukuran", q2:"Risiko forensik", a1:"turun", a2:"naik",
  e:"Label level bukan pilihan manajemen — ia mengikuti input. Mengklaim Level 2 tanpa input teramati adalah salah label: kredibilitas pengukuran turun, dan risiko forensik naik karena angka yang 'kata model' disajikan seolah 'bisa dicek pasar'."}
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
    try{ localStorage.setItem("fsa_pg_m46", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Nilai wajar saham Level 1 — 10.000 lembar × harga kuotasi Rp1.250 (ilustratif, Rp juta)", hint:"Harga kuotasi dipakai apa adanya, tanpa penyesuaian: 10.000 × 1.250 = 12.500.000 rupiah = … Rp juta", ans:12500, dec:false, tol:1,
  why:"12.500 — Level 1: harga kuotasi pasar aktif dipakai tanpa penyesuaian; 10.000 × Rp1.250 = Rp12.500.000 = 12.500 (Rp juta)."},
 {q:"Kenaikan revaluasi tanah Cemerlang — nilai wajar 45.000 vs nilai buku 40.000 (ilustratif, Rp juta)", hint:"Nilai wajar (market approach, komparabel ilustratif) 45.000 − nilai buku kanonis 40.000", ans:5000, dec:false, tol:1,
  why:"5.000 — kenaikan revaluasi = 45.000 − 40.000; tanah tidak disusutkan dan boleh direvaluasi ke nilai wajar (M12)."},
 {q:"Nilai wajar mesin khusus — DCF: arus kas 20.000/tahun, 5 tahun, discount rate 10% (ilustratif, Rp juta)", hint:"Faktor anuitas 5 tahun pada 10% = 3,7908; 20.000 × 3,7908", ans:75816, dec:false, tol:1,
  why:"75.816 — income approach: 20.000 × 3,7908 = 75.816; DCF mengubah arus kas masa depan menjadi nilai kini."},
 {q:"Nilai wajar mesin khusus — cost approach: biaya penggantian 150.000 − keusangan 45.000 (ilustratif, Rp juta)", hint:"150.000 − 45.000", ans:105000, dec:false, tol:1,
  why:"105.000 — cost approach: biaya penggantian kini dikurangi keusangan fisik, fungsional, dan ekonomis."},
 {q:"Sensitivitas DCF — nilai wajar bila discount rate naik ke 12% (ilustratif, Rp juta)", hint:"Faktor anuitas 5 tahun pada 12% = 3,6048; 20.000 × 3,6048", ans:72096, dec:false, tol:1,
  why:"72.096 — naiknya discount rate 2pp menurunkan nilai wajar 3.720 (4,9%): 75.816 → 72.096; inilah sensitivitas Level 3 yang wajib diungkap."},
 {q:"Aset Cemerlang yang tadinya Level 2 kini memakai asumsi tak teramati yang signifikan. Menurut PSAK 113, analis harus…", hint:"Ingat prinsip input terendah yang signifikan di tab Transfer & Disclosure.",
  mc:["Menerima label Level 2 karena modelnya tidak berubah","Meminta reklasifikasi ke Level 3 dan pengungkapan transfer beserta alasannya","Mengabaikan perubahan karena total nilai wajar tidak berubah","Memakai nilai buku sebagai pengganti nilai wajar Level 3"], a:1,
  why:"Meminta reklasifikasi ke Level 3 — prinsip input terendah yang signifikan menentukan level, dan transfer antar level wajib diungkap beserta alasannya."}
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
 invest:"Lensa investasi — Cemerlang: tanah 40.000 (nilai wajar ilustratif 45.000), mesin khusus DCF 75.816 (Level 3), aset tetap neto 230.000. Tulis 3 baris: berapa nilai wajar yang kamu pakai dalam valuasi — dan diskon berapa untuk porsi Level 3, keputusanmu (beli / tunggu / hindari) + SATU hal yang membunuh tesismu.",
 credit:"Lensa kredit — Cemerlang: aset tetap neto 230.000, tanah 40.000, mesin khusus Level 3 DCF 75.816 (sensitivitas −3.720 bila rate naik 2pp). Tulis 3 baris: nilai agunan mana yang kamu akui dan pada angka berapa, satu syarat pengungkapan yang kamu minta, keputusanmu.",
 forensic:"Lensa forensik — PSAK 113: Level 1 harga kuotasi, Level 2 input teramati, Level 3 mark-to-model. Tulis 3 baris: apa yang kamu verifikasi dulu (pasar aktif? sumber input? sensitivitas?), satu uji konsistensi internal, dan satu temuan yang membuatmu menolak mentah-mentah."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m46_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m46_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"Nilai wajar (fair value) menurut PSAK 113 (IFRS 13) adalah…", o:["Harga perolehan historis aset dikurangi akumulasi depresiasi dan penurunan nilai","Nilai pakai aset yang dihitung dari arus kas internal perusahaan","Harga jual aset di pasar utama (exit price)","Harga yang dibayar perusahaan saat membeli aset pertama kali"], a:2},
 {q:"Input yang menempatkan aset di Level 1 hierarki nilai wajar adalah…", o:["Harga kuotasi di pasar aktif untuk aset yang identik","Harga dari model internal yang memakai asumsi manajemen sendiri","Nilai buku aset setelah dikurangi akumulasi depresiasi","Harga transaksi antar pihak berelasi yang dinegosiasikan tertutup"], a:0},
 {q:"Manakah yang merupakan input Level 3 (tak teramati)?", o:["Harga kuotasi saham yang diperdagangkan setiap hari di bursa","Kurs dan kurva imbal hasil yang dipublikasikan bank sentral","Harga aset sejenis yang bisa diamati di pasar properti","Proyeksi arus kas dan discount rate dari asumsi manajemen"], a:3},
 {q:"Teknik valuasi income approach mengukur nilai wajar dengan cara…", o:["Membandingkan aset dengan harga transaksi aset sejenis di pasar","Mendiskontokan arus kas masa depan aset ke nilai kini (DCF)","Menghitung biaya membangun kembali aset yang sama hari ini","Memakai nilai buku aset sebagai pengganti nilai wajarnya"], a:1},
 {q:"Pengungkapan yang wajib menyertai aset Level 3 adalah…", o:["Perusahaan cukup menyebut total aset Level 3 tanpa rincian apa pun","Perusahaan boleh menyembunyikan asumsi model bila dianggap rahasia dagang","Analisis sensitivitas atas perubahan asumsi utama wajib diungkap","Pengungkapan Level 3 hanya wajib bila asetnya sudah dijual"], a:2}];
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
           window.FSAMistake.log(46, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Modul 46 Tuntas ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu bisa membedakan exit price dari entry price, mengklasifikasi aset ke Level 1/2/3, memilih teknik valuasi market/income/cost, menuntut pengungkapan transfer dan sensitivitas Level 3, dan membedakan angka yang bisa dicek pasar dari angka kata model. Kembali ke <a href=\"/\">FSA Lab</a>.</p>";
    try{ localStorage.setItem("fsa_gate_m46","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m46") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m46") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m46") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Modul 46 Tuntas ✓</h3><p>Modul 46 sudah kamu lewati sebelumnya — kembali ke <a href=\"/\">FSA Lab</a>.</p>";
  }
}catch(e){}
})();
