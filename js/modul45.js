/* FSA Lab — Modul 45: Membaca Annual Report End-to-End — Workflow MD&A (PT Cemerlang Abadi, Rp juta; angka kanonis CANONICAL-DATA.md; contoh MD&A & kalimat manajemen ilustratif) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
nav:{ title:"Langkah 1 — Navigasi annual report & MD&A: peta baca, apa yang dicari, apa yang tidak boleh dipercaya mentah-mentah", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Peta annual report — urutan baca analis", v:"5 langkah", v2:"cover → verdict",
   d:"Urutan baca: cover & daftar isi (struktur, tahun buku, auditor), financial highlights (angka kunci — tapi verifikasi ke laporan auditan), laporan direksi (narasi strategi), MD&A (penjelasan manajemen), laporan keuangan auditan, notes, opini audit. Analis membaca MD&A SETELAH tahu angka — narasi dibaca dengan angka di tangan, bukan sebaliknya.",
   psak:"Workflow M45 · rujuk M7", f:"Kredit: mulai dari opini audit dan highlights — bila opini bermasalah, seluruh narasi dibaca dengan curiga. Investasi: highlights adalah klaim manajemen — verifikasi tiap angka ke laporan auditan sebelum memakai. Forensik: daftar isi yang menyembunyikan notes material di belakang = tanya kenapa pos itu tidak menonjol."},
  {l:"Apa yang dicari di MD&A", v:"+30,0%", v2:"penjualan 2025",
   d:"MD&A (Management Discussion & Analysis) adalah tempat manajemen menjelaskan perubahan: penjualan naik 30,0% (400.000 → 520.000) karena apa — volume atau harga? Margin kotor 34,0% → 35,0% karena bauran atau biaya? Kas operasi 30.800 vs laba bersih 45.240 — ke mana larinya kas? MD&A yang baik memberi sebab yang bisa diuji, bukan mengulang angka yang sudah ada di laporan.",
   psak:"Workflow M45", f:"Kredit: cari penjelasan atas perubahan kas dan utang — MD&A yang diam soal utang bank 141.440 dan kas yang turun 11.760 menyembunyikan cerita likuiditas. Investasi: penjelasan volume vs harga menentukan apakah pertumbuhan 30,0% bisa diulang. Forensik: sebab yang tidak bisa diuji ('kondisi pasar membaik') bukan penjelasan — itu cuaca."},
  {l:"Apa yang TIDAK boleh dipercaya mentah-mentah", v:"tidak diaudit", v2:"MD&A",
   d:"MD&A tidak diaudit seperti laporan keuangan — auditor hanya membaca untuk inkonsistensi material. Waspada tiga pola: bahasa pemasaran ('kinerja terbaik dalam sejarah') tanpa angka pembanding; cherry-picking (menonjolkan NI +52,6% sambil menyembunyikan one-off jual aset 8.000 dan CFO yang turun dari 44.000 ke 30.800); penjelasan yang tidak bisa diuji karena rincian volume/harga tidak pernah diungkap.",
   psak:"Workflow M45", f:"Kredit: superlatif tanpa angka = nol informasi untuk memo kredit. Investasi: klaim yang menonjolkan headline NI 45.240 sambil diam soal continuing NI 39.000 adalah framing, bukan fakta. Forensik: cherry-picking yang sistematis — tiap tahun hanya metrik yang membaik yang ditonjolkan — adalah pola yang dicatat, bukan kebetulan."}
 ]},
notes:{ title:"Langkah 2 — Membaca notes (catatan atas laporan keuangan): kebijakan, rincian pos material, komitmen & kontinjensi", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Kebijakan akuntansi — cara angka dihitung", v:"PSAK baru", v2:"M7 · M14",
   d:"Notes membuka kebijakan: pengakuan pendapatan, persediaan, depresiasi, sewa. Rujuk M7 (Membaca Catatan & Opini Audit) dan M14 (PSAK vs US GAAP) — modul ini tidak menduplikasi keduanya. Perubahan kebijakan tanpa alasan bisnis yang jelas = tanya kenapa: kebijakan yang berubah di tahun laba melonjak layak dicurigai, bukan diterima.",
   psak:"Rujuk M7 · M14", f:"Kredit: kebijakan pengakuan pendapatan menentukan apakah penjualan 520.000 sudah benar-benar terjadi — baca sebelum meminjamkan. Investasi: dua perusahaan dengan kebijakan berbeda tidak bisa dibandingkan mentah — normalisasi dulu. Forensik: kebijakan yang berubah tiap tahun = manajemen yang menggeser gawang pengukuran."},
  {l:"Rincian pos material — isi di balik satu baris neraca", v:"104.000", v2:"piutang neto",
   d:"Satu baris di neraca bisa menyembunyikan banyak hal. Piutang neto 104.000 = bruto 108.100 − allowance 4.100 (ECL 3,8%); persediaan 96.000; utang bank 141.440 (31.440 pendek + 110.000 panjang). Notes memberi rincian: umur piutang, konsentrasi pelanggan, dan pihak berelasi — tanpa rincian ini, analis tidak tahu apakah piutang yang naik 49.000 itu sehat atau menua.",
   psak:"Rujuk M7", f:"Kredit: umur piutang dan konsentrasi pelanggan menentukan apakah piutang 104.000 bisa ditagih — angka neto saja tidak cukup. Investasi: allowance 3,8% yang tidak naik saat piutang naik 89,1% = tanya apakah cadangan sudah memadai. Forensik: rincian yang hilang di tahun piutang melonjak = red flag yang dicatat."},
  {l:"Komitmen & kontinjensi — kewajiban yang belum masuk neraca", v:"60.000", v2:"liabilitas sewa",
   d:"Liabilitas sewa 60.000 sudah di neraca — tapi komitmen (kontrak pembelian, capex yang sudah disetujui) dan kontinjensi (gugatan, garansi) hanya hidup di notes, dan bisa berubah menjadi liabilitas nyata. Analis yang hanya membaca neraca meremehkan total kewajiban; analis kredit membaca notes komitmen sebelum menyetujui fasilitas baru.",
   psak:"Rujuk M7", f:"Kredit: komitmen capex + kontinjensi gugatan adalah utang masa depan — masukkan ke analisis kapasitas bayar. Investasi: kontinjensi yang tidak diungkap nominalnya = ketidakpastian yang harus didiskon dari valuasi. Forensik: kontinjensi yang muncul tiba-tiba di tahun berjalan = tanya apa yang berubah dan kenapa baru sekarang diungkap."}
 ]},
segmen:{ title:"Langkah 3 — Bedah segmen: segmen operasi, penopang vs penahan laba", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Membaca segmen operasi — dua bisnis, dua cerita", v:"312.000", v2:"Ritel vs 208.000",
   d:"Rujuk M8 (DuPont & Bedah Segmen). Ritel: penjualan 312.000, laba operasi 46.800, margin 15,0%. Distribusi: penjualan 208.000, laba operasi 25.200, margin 12,1%. Totalnya artikulasi ke laporan: 312.000 + 208.000 = 520.000 dan 46.800 + 25.200 = 72.000. Segmen yang tidak artikulasi ke total = laporan atau bacaanmu salah.",
   psak:"Rujuk M8", f:"Kredit: segmen yang berbeda risikonya berbeda — fasilitas untuk Ritel tidak sama risikonya dengan fasilitas untuk Distribusi. Investasi: pertumbuhan total 30,0% tanpa rincian segmen tidak memberi tahu segmen mana yang tumbuh. Forensik: segmen yang definisinya berubah tiap tahun = laba yang dipindah-pindah antar segmen."},
  {l:"Penopang vs penahan laba", v:"65,0%", v2:"Ritel dari EBIT",
   d:"Ritel menyumbang 46.800 dari 72.000 laba operasi (65,0%) dengan hanya 60,0% penjualan (312.000 dari 520.000). Distribusi menyumbang 35,0% laba dari 40,0% penjualan — margin lebih tipis (12,1% vs 15,0%). Ritel penopang laba; Distribusi penahan. Analis yang hanya membaca total laba tidak pernah tahu struktur ini.",
   psak:"Rujuk M8", f:"Kredit: penopang laba adalah sumber pembayaran utang — Ritel = 46.800 dari 72.000 EBIT (65,0%). Bila EBIT Ritel → 0, coverage jatuh dari 5,14x menjadi 25.200 ÷ 14.000 = 1,8x — bunga hanya tertutup 1,8x, di bawah zona nyaman, bukan sekadar 'goyah'. Investasi: valuasi memakai margin campuran 13,8% menyembunyikan bahwa Distribusi — 40,0% penjualan (208.000 dari 520.000) dan 35,0% laba (25.200 dari 72.000) — bermargin 12,1%, bukan 'separuh' bisnis — nilai segmen terpisah. Forensik: segmen penahan yang tiba-tiba 'membaik' tanpa penjelasan = cek alokasi biaya antar segmen."},
  {l:"Aset & ROA segmen — laba per rupiah modal", v:"17,3%", v2:"Ritel vs 14,0%",
   d:"Ritel: aset 270.864, ROA 17,3% (46.800 ÷ 270.864). Distribusi: aset 180.576, ROA 14,0% (25.200 ÷ 180.576). Total aset segmen 270.864 + 180.576 = 451.440 = total aset neraca. Ritel tidak hanya lebih menguntungkan — ia juga lebih efisien memakai aset. Segmen dengan ROA rendah dan aset besar adalah tempat modal terperangkap.",
   psak:"Rujuk M8", f:"Kredit: ROA segmen menunjukkan segmen mana yang menghasilkan kas untuk membayar utang — bukan sekadar laba akuntansi. Investasi: modal tambahan sebaiknya mengalir ke segmen ROA 17,3%, bukan 14,0%. Forensik: aset segmen yang membengkak tanpa laba ikut naik = tanya apakah aset itu masih produktif."}
 ]},
risiko:{ title:"Langkah 4 — Risk factors & going concern: faktor risiko, opini audit, emphasis of matter", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Risk factors — daftar risiko versi manajemen", v:"141.440", v2:"utang bank total",
   d:"Faktor risiko dibaca lengkap, bukan ringkasannya: konsentrasi pelanggan, harga bahan baku, suku bunga (utang bank 141.440; bunga 14.000), likuiditas (kas turun 11.760; FCFF −6.280). Risiko yang ditulis generik ('persaingan ketat') tanpa angka dan mitigasi = sinyal lemah yang tidak bisa diuji; risiko dengan angka, pemicu, dan mitigasi = bisa dimasukkan ke model.",
   psak:"Workflow M45", f:"Kredit: risiko likuiditas dan refinancing utang 141.440 adalah risiko nomor satu — baca jatuh tempo utang, bukan sekadar totalnya. Investasi: risiko yang tidak disebut MD&A sama sekali (mis. konsentrasi piutang +89,1%) adalah risiko yang manajemen pilih untuk tidak dibicarakan. Forensik: daftar risiko yang menyusut di tahun kinerja memburuk = manajemen yang menyembunyikan, bukan risiko yang hilang."},
  {l:"Opini audit & emphasis of matter", v:"WTP?", v2:"baca opini utuh",
   d:"Opini audit dibaca utuh, bukan judulnya: wajar tanpa pengecualian (WTP), wajar dengan pengecualian, tidak wajar, atau tidak menyatakan pendapat. Emphasis of matter = auditor menyorot sesuatu (mis. ketidakpastian material) tanpa memodifikasi opini — sorotan itu tetap harus dibaca. Rujuk M7. Opini selain WTP = berhenti dan baca alasannya sebelum verdict apa pun.",
   psak:"Rujuk M7", f:"Kredit: opini selain WTP = fasilitas ditahan sampai alasan pengecualian dipahami. Investasi: emphasis of matter atas ketidakpastian = diskon valuasi, bukan catatan kaki. Forensik: opini yang berubah dari WTP ke pengecualian adalah sinyal paling keras di seluruh annual report — lebih keras dari angka laba mana pun."},
  {l:"Going concern — bisakah perusahaan bertahan?", v:"2,64", v2:"Altman Z grey zone (hibrida ilustratif)",
   d:"Going concern tidak dibuktikan satu angka: kas 21.440 (turun dari 33.200), CFO 30.800 < capex 48.000, FCFF −6.280, D/E 1,52x, coverage 5,14x, Altman Z 2,64 (hibrida ilustratif, bukan varian resmi — lihat M25). Gabungkan likuiditas, arus kas, utang jatuh tempo, dan pernyataan auditor — lalu tanya: bila pola kas 2025 berulang dua tahun, dari mana perusahaan membayar utang bank 141.440?",
   psak:"Rujuk M25 (Altman Z)", f:"Kredit: going concern adalah pertanyaan pertama kreditur — FCFF negatif dan kas menipis adalah jawaban yang harus dijelaskan manajemen. Investasi: perusahaan yang hidup dari utang baru (utang neto +11.440) bukan dari kas operasi dinilai berbeda. Forensik: MD&A yang tidak menyebut going concern sama sekali sementara Z di grey zone = kelalaian yang dicatat."}
 ]},
checklist:{ title:"Langkah 5 — Checklist penutup: 10 cek analis sebelum memberi verdict", cols:["Pos","Angka","Konteks"],
 rows:[
  {l:"Cek 1–3: artikulasi — angka saling mengunci", v:"45.240", v2:"58.000 − 12.760",
   d:"(1) NI = PBT − pajak: 58.000 − 12.760 = 45.240. (2) A = L + E: 451.440 = 272.000 + 179.440. (3) Δkas = CFO + CFI + CFF: −11.760 = 30.800 − 48.000 + 5.440. Satu yang tidak mengunci = laporan atau bacaanmu yang salah — berhenti dan cari selisihnya sebelum lanjut.",
   psak:"Workflow M45", f:"Kredit: artikulasi yang gagal = laporan yang tidak bisa dipakai untuk memo kredit. Investasi: angka yang tidak mengunci membuat semua rasio di bawahnya tidak bisa dipercaya. Forensik: selisih artikulasi yang kecil tapi konsisten tiap tahun = pola, bukan salah ketik."},
  {l:"Cek 4–6: kas & kualitas laba", v:"30.800", v2:"CFO < NI 45.240",
   d:"(4) CFO vs NI: 30.800 < 45.240 — selisihnya ΔWC −44.440 (piutang naik 49.000 menelan kas). (5) One-off: laba jual aset 8.000 = 13,8% NI; continuing NI hanya 39.000. (6) Piutang +89,1% vs penjualan +30,0% — DSO 73,0 hari; kas dari pelanggan 471.000 (520.000 − 49.000). Laba yang tidak menjadi kas adalah klaim, bukan uang.",
   psak:"Workflow M45", f:"Kredit: CFO < NI dua tahun berturut-turut = kapasitas bayar dari operasi melemah — covenant berbasis CFO, bukan NI. Investasi: kualitas laba rendah = kelipatan valuasi lebih rendah; bayar harga laba continuing, bukan headline. Forensik: piutang yang tumbuh 3x penjualan = uji pertama manipulasi pendapatan — cek umur dan konsentrasi."},
  {l:"Cek 7–10: risiko, opini & verdict tertulis", v:"1,52x", v2:"D/E · Z 2,64 (hibrida)",
   d:"(7) Leverage & coverage: D/E 1,52x, coverage 5,14x, CR 2,17x — memadai tapi arah kas melemah. (8) Segmen: Ritel penopang (65,0% EBIT), Distribusi penahan. (9) Opini audit & going concern dibaca — bukan diasumsikan WTP. (10) Verdict tertulis triple-lens — investasi / kredit / forensik — dengan angka dan tahunnya, bukan adjektiva. Verdict tanpa angka = opini; verdict dengan angka = analisis.",
   psak:"Workflow M45", f:"Kredit: verdict kredit menyebut covenant dan ambang — DSO ≤ 75 hari, FCFF negatif dua tahun = larangan dividen. Investasi: verdict investasi menyebut angka yang dipakai (continuing NI 39.000) dan angka yang ditolak (headline 45.240). Forensik: verdict forensik menyebut apa yang masih harus diverifikasi — umur piutang, opini audit, rincian volume vs harga."}
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
renderStmt("nav");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"MD&A (ilustratif): \u201CPenjualan tumbuh 30% karena permintaan pasar yang kuat.\u201D", q1:"Klaim ini didukung angka laporan?", o1:["ya","sebagian","tidak"], a1:"sebagian", q2:"Tindakan analis", o2:["percaya","cek catatan","tolak"], a2:"cek catatan",
  e:"Angka pertumbuhannya benar: 520.000 \u00F7 400.000 \u2212 1 = +30,0%. Tapi sebabnya belum terbukti \u2014 \u2018permintaan kuat\u2019 bisa berarti volume naik, harga naik, atau keduanya; rincian itu ada di notes dan segmen, bukan di kalimat MD&A. Analis yang percaya mentah-mentah membeli narasi, bukan bukti."},
 {t:"MD&A (ilustratif): \u201CMargin kotor membaik berkat efisiensi operasional.\u201D", q1:"Klaim ini didukung angka laporan?", o1:["ya","sebagian","tidak"], a1:"sebagian", q2:"Tindakan analis", o2:["percaya","cek catatan","tolak"], a2:"cek catatan",
  e:"Margin kotor naik 34,0% \u2192 35,0% \u2014 hanya +1,0 poin persentase. HPP naik 28,0% (264.000 \u2192 338.000) sementara penjualan naik 30,0% \u2014 perbaikan ada tapi tipis, dan \u2018efisiensi\u2019 belum terbukti tanpa rincian biaya. Satu poin margin bukan bukti efisiensi."},
 {t:"MD&A (ilustratif): \u201CArus kas operasi kami kuat: Rp30.800 juta.\u201D", q1:"Klaim ini didukung angka laporan?", o1:["ya","sebagian","tidak"], a1:"tidak", q2:"Tindakan analis", o2:["percaya","cek catatan","tolak"], a2:"tolak",
  e:"Angka 30.800 benar, tapi framing \u2018kuat\u2019 tidak didukung: CFO turun dari 44.000 pada 2024 meski laba bersih naik 52,6%, dan CFO lebih kecil dari NI 45.240 karena \u0394WC \u221244.440 (piutang naik 49.000). Kas operasi melemah \u2014 klaim ini dibalik oleh angka."},
 {t:"MD&A (ilustratif): \u201CLaba bersih naik 52,6% \u2014 kinerja inti membaik.\u201D", q1:"Klaim ini didukung angka laporan?", o1:["ya","sebagian","tidak"], a1:"sebagian", q2:"Tindakan analis", o2:["percaya","cek catatan","tolak"], a2:"cek catatan",
  e:"NI naik 52,6% (29.640 \u2192 45.240) memang benar, tapi 8.000 di antaranya laba jual aset sekali jadi \u2014 continuing NI hanya 39.000 (+31,6%). Kinerja inti membaik, tapi tidak sebesar yang diklaim. Analis memakai continuing NI, bukan headline."},
 {t:"MD&A (ilustratif): \u201CSegmen Ritel adalah mesin laba kami.\u201D", q1:"Klaim ini didukung angka laporan?", o1:["ya","sebagian","tidak"], a1:"ya", q2:"Tindakan analis", o2:["percaya","cek catatan","tolak"], a2:"percaya",
  e:"Klaim ini didukung penuh: Ritel menyumbang 46.800 dari 72.000 laba operasi (65,0%) dengan margin 15,0% vs 12,1% Distribusi dan ROA 17,3% vs 14,0%. Inilah klaim MD&A yang lolos uji angka \u2014 bedakan dari klaim yang hanya terdengar meyakinkan."},
 {t:"MD&A (ilustratif): \u201CPosisi kas kami aman: kas Rp21.440 juta.\u201D", q1:"Klaim ini didukung angka laporan?", o1:["ya","sebagian","tidak"], a1:"sebagian", q2:"Tindakan analis", o2:["percaya","cek catatan","tolak"], a2:"cek catatan",
  e:"Kas 21.440 memang cukup untuk liabilitas lancar (CR 2,17x, QR 1,23x), tapi kas turun 11.760 dari 33.200 dan FCFF negatif (6.280) \u2014 CFO 30.800 tidak menutup capex 48.000, selisihnya ditutup utang neto 11.440. Aman hari ini, menipis bila pola ini berulang."}
];
var pgScore = 0, pgDone = 0, pgCards = [];
function renderPg(){
  var h = "";
  CARDS.forEach(function(c,i){
    h += '<div class="quiz-q" id="pg'+i+'"><h3>Kartu '+(i+1)+': '+c.t+'</h3>';
    [["q1",c.q1,c.o1],["q2",c.q2,c.o2]].forEach(function(qq){
      h += '<p class="sub" style="margin:.4rem 0 .2rem">'+qq[1]+'</p><div class="pg-opts">';
      qq[2].forEach(function(o){ h += '<button data-card="'+i+'" data-q="'+qq[0]+'" data-opt="'+o+'">'+o+'</button>'; });
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
    try{ localStorage.setItem("fsa_pg_m45", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Pertumbuhan penjualan 2025 (%)", hint:"(520.000 − 400.000) ÷ 400.000 × 100%", ans:30, dec:true, tol:0.1,
  why:"30,0% — angka pertumbuhan di MD&A benar. Yang belum terbukti adalah sebabnya ('permintaan kuat'): butuh rincian volume vs harga dari notes dan segmen."},
 {q:"Margin kotor 2025 (%)", hint:"Laba kotor 182.000 ÷ penjualan 520.000", ans:35, dec:true, tol:0.1,
  why:"35,0% — naik tipis dari 34,0% pada 2024 (+1,0 poin). 'Efisiensi operasional' sebagai penjelasan belum terbukti dari selisih sekecil ini."},
 {q:"Pertumbuhan laba bersih 2025 (%)", hint:"(45.240 − 29.640) ÷ 29.640 × 100%", ans:52.6, dec:true, tol:0.1,
  why:"52,6% — headline benar, tapi menyesatkan sebagai 'kinerja inti': continuing NI hanya 39.000 (+31,6%) setelah mengeluarkan laba jual aset 8.000 sekali jadi."},
 {q:"Laba bersih continuing 2025 (Rp juta)", hint:"NI 45.240 − laba jual aset 8.000 × (1 − pajak 22%)", ans:39000, dec:false, tol:1,
  why:"39.000 — NI 45.240 − 8.000 × 0,78 = 45.240 − 6.240. Inilah angka yang dipakai analis untuk menilai kinerja inti, bukan headline 45.240."},
 {q:"Kas dari pelanggan 2025 (Rp juta, direct method)", hint:"Penjualan 520.000 − kenaikan piutang 49.000 (104.000 − 55.000)", ans:471000, dec:false, tol:1,
  why:"471.000 — penjualan 520.000, tapi hanya 471.000 yang menjadi kas: 49.000 masih tertahan di piutang. Inilah bukti kas di balik klaim pertumbuhan penjualan."},
 {q:"CFO 30.800 lebih kecil dari NI 45.240. Penyebab utama selisihnya adalah…", hint:"Ingat rumus CFO = NI + depresiasi + ΔWC; hitung ΔWC dari perubahan neraca.",
  mc:["Dividen 6.000 yang dibayar ke pemegang saham","ΔWC −44.440 — piutang naik 49.000 menelan kas","Depresiasi 30.000 yang mengurangi laba bersih","Capex 48.000 untuk pembelian aset tetap"], a:1,
  why:"ΔWC −44.440 — CFO = 45.240 + 30.000 − 44.440 = 30.800. Piutang yang naik 49.000 adalah penelan kas terbesar; dividen dan capex tidak masuk CFO, depresiasi justru menambah CFO."}
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
 invest:"Lensa investasi — Cemerlang Abadi 2025: penjualan +30,0%, NI headline 45.240 tapi continuing 39.000, CFO 30.800 < NI, Ritel 65,0% EBIT. Tulis 3 baris: klaim MD&A mana yang lolos dan mana yang menyesatkan + angka buktinya, keputusanmu (beli / tahan / hindari) + SATU hal yang membunuh tesismu.",
 credit:"Lensa kredit — Cemerlang: coverage 5,14x, D/E 1,52x, CR 2,17x, kas 33.200 → 21.440, FCFF (6.280), utang bank 141.440. Tulis 3 baris: apakah kemampuan bayar menguat atau melemah + angka buktinya, satu covenant yang kamu minta, keputusanmu.",
 forensic:"Lensa forensik — MD&A ilustratif Cemerlang: klaim 'kas operasi kuat' vs CFO yang turun, NI +52,6% vs continuing +31,6%, piutang +89,1%. Tulis 3 baris: apa yang kamu verifikasi dulu (opini audit? umur piutang? rincian volume vs harga?), satu uji konsistensi internal, dan satu temuan yang membuatmu menolak mentah-mentah."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m45_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m45_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"Analis membaca MD&A Cemerlang: penjualan naik 30,0% dan manajemen menulis \u2018permintaan pasar kuat\u2019. Langkah pertama yang tepat sebelum menerima penjelasan itu adalah…", o:["Menerima penjelasan manajemen begitu saja karena angka penjualan memang naik 30,0% dari tahun lalu","Mencari rincian volume vs harga di notes dan segmen untuk menguji penjelasan itu","Mengabaikan MD&A dan hanya memakai laporan laba rugi tanpa membaca narasi","Mengganti angka penjualan 520.000 dengan estimasi sendiri dari data pasar eksternal"], a:1},
 {q:"Dalam contoh MD&A ilustratif Cemerlang, kalimat \u2018arus kas operasi kami kuat: Rp30.800 juta\u2019 perlu diuji terhadap angka…", o:["Laba bersih Rp45.240 juta dan CFO 2024 Rp44.000 juta \u2014 CFO turun meski laba naik","Modal disetor Rp100.000 juta yang tidak berubah sejak 2024 dan tidak memengaruhi kas operasi","Laba ditahan Rp79.440 juta yang naik dari Rp40.200 juta karena laba tidak dibagikan penuh","Aset tetap neto Rp230.000 juta yang naik setelah belanja modal tahun ini"], a:0},
 {q:"Catatan atas laporan keuangan (notes) paling berguna bagi analis untuk…", o:["Menggantikan laporan laba rugi sebagai sumber angka penjualan dan laba kotor perusahaan","Menilai harga saham wajar tanpa perlu melihat laporan arus kas atau neraca sama sekali","Mengetahui kebijakan akuntansi, rincian pos material, serta komitmen dan kontinjensi","Menghapus kebutuhan membaca opini audit karena notes sudah diaudit oleh manajemen sendiri"], a:2},
 {q:"Segmen Ritel Cemerlang mencatat penjualan Rp312.000 juta dan laba operasi Rp46.800 juta; Distribusi Rp208.000 juta dan Rp25.200 juta. Kesimpulan yang didukung angka adalah…", o:["Distribusi penopang laba karena penjualannya lebih besar dari Ritel dan tumbuh lebih cepat","Kedua segmen sama menguntungkan karena laba operasinya berimbang","Segmen tidak relevan karena total laba perusahaan sudah diketahui dari laporan laba rugi","Ritel penopang laba: margin 15,0%, 65,0% dari laba operasi, di atas Distribusi 12,1%"], a:3},
 {q:"Sebelum memberi verdict atas Cemerlang, cek penutup yang paling penting dari lensa forensik adalah…", o:["Membandingkan margin kotor 35,0% dengan rata-rata industri sejenis untuk menilai daya saing","Memastikan opini audit, emphasis of matter, dan konsistensi angka antar laporan","Menghitung target harga saham dari laba bersih Rp45.240 juta dan kelipatan pasar saat ini","Menyalin prospek manajemen 2026 ke dalam memo investasi sebagai dasar utama rekomendasi"], a:1}];
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
           window.FSAMistake.log(45, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Modul 45 Tuntas ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu bisa membaca annual report end-to-end — menguji klaim MD&A ke angka, membaca notes untuk kebijakan dan rincian pos material, membedah segmen penopang vs penahan laba, menilai risk factors dan going concern, dan menutup dengan checklist 10 cek analis sebelum memberi verdict. Kembali ke <a href=\"/\">FSA Lab</a>.</p>";
    try{ localStorage.setItem("fsa_gate_m45","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m45") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m45") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m45") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Modul 45 Tuntas ✓</h3><p>Modul 45 sudah kamu lewati sebelumnya — kembali ke <a href=\"/\">FSA Lab</a>.</p>";
  }
}catch(e){}
})();
