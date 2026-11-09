/* FSA Lab — Modul 33: Credit Deep-Dive (lensa KREDIT; contoh baru = ILUSTRATIF berlabel) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
rating:{ title:"Metodologi rating: dua pilar (business risk × financial risk) memetakan ke skala peringkat. Matriks angka di sini ILUSTRATIF.", cols:["Elemen rating","Nilai","Acuan"],
 rows:[
  {l:"Skema umum: business risk × financial risk → peringkat", v:"MATRIKS", v2:"ilustratif",
   d:"Lembaga pemeringkat menilai dua pilar: business risk (risiko industri, posisi pasar, diversifikasi, tata kelola) dan financial risk (arus kas, leverage, likuiditas, fleksibilitas keuangan). Kombinasinya memetakan ke skala AAA–D. Matriks di modul ini ILUSTRATIF — bobot pastinya milik metodologi masing-masing lembaga.",
   tag:"Sumber: kriteria/metodologi publik lembaga pemeringkat (PEFINDO, S&P)",
   k:"Analis kredit memakai matriks ini untuk menebak arah rating SEBELUM diumumkan — EBITDA −20% menggeser financial risk ke kanan (lebih berisiko), peringkat ikut tertekan."},
  {l:"AAA (ilustratif): business risk sangat kuat × financial risk minimal", v:"AAA", v2:"ilustratif",
   d:"Kombinasi terbaik: pemimpin pasar di industri stabil + leverage sangat rendah + arus kas sangat kuat. Probabilitas default mendekati nol dalam horizon pemeringkatan — secara historis/relatif, bukan estimasi numerik untuk pricing; rujuk tabel default lembaga pemeringkat terkait.",
   tag:"—",
   k:"Jarang ada korporasi non-keuangan di AAA — kalaupun ada, spread-nya tipis karena pasar percaya penuh."},
  {l:"BBB (ilustratif): investment grade terbawah", v:"BBB", v2:"ilustratif",
   d:"Batas bawah investment grade menurut konvensi umum lembaga pemeringkat. Di bawah BBB (BB+ ke bawah) = speculative grade / high yield: spread melebar tajam dan sebagian investor institusi dilarang memegang.",
   tag:"Konvensi umum lembaga pemeringkat",
   k:"Downgrade BBB− → BB+ ('fallen angel') bisa menjatuhkan harga obligasi BUKAN karena fundamental berubah, tapi karena aturan: investor investment-grade dipaksa jual."},
  {l:"PEFINDO: skala nasional idAAA–idD", v:"idAAA–idD", v2:"nasional",
   d:"PEFINDO memberi peringkat dengan awalan 'id' (mis. idAAA, idBBB+, idD): peringkat RELATIF terhadap obligor Indonesia lainnya, bukan terhadap standar global. idAAA = kemampuan superior memenuhi kewajiban jangka panjang dibanding obligor Indonesia lain; idD = gagal bayar.",
   tag:"Sumber: definisi skala peringkat PEFINDO",
   k:"Obligasi idAAA belum tentu 'aman absolut' — ia hanya paling aman DI ANTARA penerbit Indonesia. Selalu cek skala apa yang dipakai di prospektus."},
  {l:"Skala nasional vs skala global: tidak sebanding", v:"idAAA ≠ AAA", v2:"tak sebanding",
   d:"AAA global (S&P/Moody's/Fitch) membandingkan ke seluruh dunia; idAAA membandingkan ke sesama Indonesia. Keduanya TIDAK bisa disamakan: idAAA kira-kira setara peringkat global selevel sovereign Indonesia, bukan AAA global.",
   tag:"Sumber: definisi skala peringkat PEFINDO",
   k:"Kesalahan klasik: mengira idAAA = AAA global lalu memakai tabel default global AAA. PD yang benar dirujuk dari tabel default skala nasional."},
  {l:"Notching: peringkat instrumen ≠ peringkat issuer", v:"±notch", v2:"ilustratif",
   d:"Peringkat obligasi bisa di atas/di bawah peringkat perusahaan (issuer): senior secured bisa 1 notch di atas; subordinasi biasanya 2–3 notch di bawah karena recovery-nya lebih rendah. Contoh ilustratif: issuer idBBB → obligasi subordinasi idBB (turun 3 notch: idBBB → idBBB− → idBB+ → idBB; PEFINDO memakai idBBB−).",
   tag:"Praktik umum pemeringkatan",
   k:"Harga obligasi mengikuti rating INSTRUMEN-nya, bukan rating perusahaannya — cek tranche mana yang kamu pegang sebelum menilai mahal/murah."}
 ]},
merton:{ title:"Merton/KMV: ekuitas sebagai call option atas aset — intuisi tanpa kalkulus berat. Contoh angka ILUSTRATIF.", cols:["Konsep","Angka","Catatan"],
 rows:[
  {l:"Ide inti: ekuitas = call option atas aset perusahaan", v:"max(A−D, 0)", v2:"konsep",
   d:"Model Merton (1974): saat utang jatuh tempo, pemegang saham 'menebus' aset dengan membayar utang (strike = nilai nominal utang D). Payoff ekuitas = max(nilai aset − D, 0) — persis seperti call option. Jika aset < utang → default, ekuitas = 0 (limited liability).",
   tag:"Merton 1974",
   k:"Dibalik: kreditur pada dasarnya MENJUAL put option ke pemegang saham — jika aset jatuh di bawah utang, kreditur yang menanggung kerugiannya."},
  {l:"Contoh ilustratif: aset 500.000, utang 300.000, jatuh tempo 1 tahun", v:"buffer 200.000", v2:"ilustratif",
   d:"Strike = 300.000. Nilai intrinsik ekuitas hari ini (ilustratif — abaikan diskonto & volatilitas): 500.000 − 300.000 = 200.000. Perusahaan default hanya jika dalam 1 tahun nilai aset jatuh lebih dari 40% (dari 500.000 ke bawah 300.000).",
   tag:"Ilustrasi modul (angka fiktif)",
   k:"Buffer 200.000 inilah 'modal' yang melindungi kreditur — analis kredit mengukurnya sebagai distance-to-default."},
  {l:"Distance-to-default: intuisi tanpa kalkulus", v:"jarak ke 300.000", v2:"konsep",
   d:"Seberapa jauh nilai aset dari titik default, diukur dalam 'langkah volatilitas'. Aset 500.000 dengan titik default 300.000 = jarak 200.000. Makin BESAR jaraknya (atau makin KECIL volatilitas aset) → makin KECIL probabilitas default. KMV (Moody's) memakai kerangka ini dengan data empiris default.",
   tag:"Kerangka Merton/KMV",
   k:"Dua perusahaan dengan leverage SAMA bisa punya PD beda: yang volatilitas asetnya tinggi lebih mungkin 'menyentuh' titik default."},
  {l:"Sinyal pasar: saham jatuh → PD implisit naik", v:"early warning", v2:"lensa",
   d:"Karena ekuitas = opsi atas aset, harga & volatilitas saham mengandung informasi tentang nilai & volatilitas aset. Saham anjlok + volatilitas melonjak = pasar menilai jarak ke default menyempit — BAHKAN bila laporan keuangan belum menunjukkan apa-apa.",
   tag:"Kerangka Merton/KMV",
   k:"Analis kredit memantau ekuitas debitur sebagai early warning: pasar sering mencium distress lebih dulu daripada rasio akuntansi."},
  {l:"Batas model: asumsi sederhana, dunia nyata berlapis", v:"batasan", v2:"—",
   d:"Merton mengasumsikan satu utang zero-coupon dengan satu tanggal jatuh tempo — dunia nyata punya multi-tranche, covenant, dan opsi pelunasan dipercepat. KMV/Moody's Analytics menambal ini secara empiris. Model = kompas, bukan GPS.",
   tag:"Catatan metodologi",
   k:"Jangan pakai PD model mentah-mentah untuk pricing — kalibrasi ke data default historis pada skala yang relevan."}
 ]},
distress:{ title:"Distress & restrukturisasi Indonesia: PKPU (UU 37/2004) dan waterfall recovery. Contoh angka ILUSTRATIF.", cols:["Tahapan / opsi","Angka","Status"],
 rows:[
  {l:"PKPU: penundaan kewajiban pembayaran utang", v:"UU 37/2004", v2:"—",
   d:"Mekanisme hukum Indonesia agar debitur yang tak mampu membayar utang jatuh tempo mendapat waktu menyusun rencana perdamaian — alternatif dari kepailitan langsung. Dapat diajukan debitur atau kreditur ke Pengadilan Niaga.",
   tag:"Sumber: UU 37/2004",
   k:"Bagi kreditur, PKPU = 'jeda terstruktur': penagihan individual ditahan, semua berunding dalam satu forum."},
  {l:"Tahap 1 — PKPU sementara: maks 45 hari", v:"45 hari", v2:"—",
   d:"Diputus pengadilan setelah permohonan diterima. Pengadilan menunjuk hakim pengawas + pengurus; debitur menyusun rencana perdamaian (tawaran membayar sebagian/seluruh utang).",
   tag:"Sumber: UU 37/2004",
   k:"45 hari sangat singkat untuk restrukturisasi kompleks — inilah alasan sebagian besar PKPU lanjut ke tahap tetap."},
  {l:"Tahap 2 — PKPU tetap: maks 270 hari, voting kreditor", v:"270 hari", v2:"—",
   d:"Diputus berdasarkan voting kreditor (kuorum Pasal 229). Berlaku paling lama 270 hari sejak putusan sementara dibacakan. Di sinilah rencana perdamaian dinegosiasikan dan divoting.",
   tag:"Sumber: UU 37/2004",
   k:"Voting = momen kekuasaan kreditur: tanpa suara cukup, rencana mati. Pahami kelas votemu (separatis vs konkuren)."},
  {l:"Ujung: perdamaian disahkan → lanjut usaha; gagal → pailit", v:"2 ujung", v2:"—",
   d:"Rencana yang disetujui kreditor + disahkan pengadilan = perdamaian (PKPU berakhir, debitur lanjut dengan jadwal baru). Jika voting gagal / tenggat lewat = debitur dinyatakan pailit, kurator membereskan harta.",
   tag:"Sumber: UU 37/2004",
   k:"Rekomendasi kredit WAJIB memuat skenario pailit: berapa recovery-mu di waterfall likuidasi?"},
  {l:"Opsi restrukturisasi: haircut, tenor extension, debt-to-equity swap", v:"3 opsi", v2:"ilustratif",
   d:"Haircut = potong pokok (kreditor rugi di muka, tapi pasti); tenor extension = perpanjang jatuh tempo + cicilan lebih ringan (kreditor menunggu lebih lama); debt-to-equity swap = utang jadi saham (kreditor jadi pemilik — cocok bila bisnisnya sehat tapi neracanya tidak).",
   tag:"Praktik restrukturisasi",
   k:"Pilih berdasarkan diagnosis: masalah LIKUIDITAS → extension; masalah SOLVABILITAS → haircut/swap. Salah diagnosis = restrukturisasi jilid dua."},
  {l:"Waterfall recovery (DIHITUNG): EV 260.000", v:"100% / 40% / 0%", v2:"ilustratif",
   d:"Klaim: senior 200.000 + subordinasi 150.000 = 350.000 > EV 260.000. Senior dibayar penuh 200.000 → recovery 100%. Sisa 60.000 → subordinasi: 60.000 ÷ 150.000 = 40%. Ekuitas = 0. Total terdistribusi 260.000 = EV. ✓",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Inilah alasan obligasi subordinasi di-notch di bawah issuer (contoh modul ini: 3 notch, idBBB → idBB): di waterfall, mereka dibayar SETELAH senior kenyang."}
 ]},
pf:{ title:"Project finance: DSCR, LLCR, dan cash waterfall. Contoh proyek ILUSTRATIF.", cols:["Metrik","Angka","Catatan"],
 rows:[
  {l:"DSCR = CFADS ÷ debt service", v:"1,35x", v2:"ilustratif",
   d:"Debt Service Coverage Ratio: kas tersedia untuk utang (Cash Flow Available for Debt Service) dibagi cicilan pokok + bunga periode itu. Contoh ilustratif: 135.000 ÷ 100.000 = 1,35x — kas 35% di atas kebutuhan cicilan.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Covenant umumnya mensyaratkan DSCR ≥ 1,20x (praktik umum — angka pastinya di dokumen kredit). Di bawah itu = technical default → negosiasi ulang, bukan otomatis pailit."},
  {l:"LLCR = NPV CFADS selama tenor ÷ outstanding debt", v:"1,30x", v2:"ilustratif",
   d:"Loan Life Coverage Ratio: nilai kini SELURUH kas proyek selama sisa tenor pinjaman dibagi sisa utang. Ilustratif: 780.000 ÷ 600.000 = 1,30x — total kas proyek menutup utang 1,3 kali. DSCR = lensa tahunan; LLCR = lensa seumur pinjaman.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"LLCR berguna saat DSCR tahun berjalan goyah tapi proyek jangka panjang tetap sehat — atau sebaliknya."},
  {l:"Cash waterfall: O&M → pajak → debt service → reserve → ekuitas", v:"5 lapis", v2:"—",
   d:"Urutan pembagian kas proyek: (1) biaya operasi & pemeliharaan, (2) pajak, (3) cicilan utang, (4) cadangan DSRA (debt service reserve account), (5) BARU distribusi ke pemegang saham. Ekuitas = antrean paling belakang. Urutan ini mengikuti dokumen proyek (waterfall account, intercreditor agreement) dan dapat berbeda antar proyek — ini struktur umum, bukan template universal.",
   tag:"Struktur umum project finance",
   k:"Kalau DSCR < 1,0x, lapis 5 kering duluan — itulah gunanya lapis 4 (reserve) sebagai penyangga."},
  {l:"Non-recourse: yang dianalisis PROYEK-nya, bukan induknya", v:"SPV", v2:"—",
   d:"Pinjaman project finance umumnya non-recourse / limited-recourse: jaminan = arus kas + aset proyek (SPV), kreditur tak bisa menagih ke induk bila proyek gagal. Maka analisis kredit = analisis proyek: kontrak offtake, risiko konstruksi, risiko operasi.",
   tag:"Struktur umum project finance",
   k:"Induk ber-rating AAA tak otomatis membuat proyeknya layak — dan proyek bagus bisa dibiayai walau induknya lemah. Pisahkan analisisnya."},
  {l:"DSCR < 1,0x = kas tak cukup bayar cicilan", v:"< 1,0x", v2:"peringatan",
   d:"DSCR di bawah 1 berarti CFADS periode itu lebih kecil dari kewajiban cicilan — proyek harus menggerus reserve, injeksi ekuitas, atau restrukturisasi (cash sweep: seluruh kelebihan kas disapu untuk utang). Bukan vonis mati, tapi lampu merah.",
   tag:"Praktik umum",
   k:"Rekomendasi kredit wajib menjawab: pada DSCR < 1, berapa bulan reserve bertahan? Itulah runway negosiasimu."}
 ]},
pkpu:{ title:"PKPU lebih operasional — klaim, kelas kreditor, valuasi, dan cara menguji proposal perdamaian (UU 37/2004)", cols:["Langkah operasional","Isi","Catatan"],
 rows:[
  {l:"Penentuan klaim — verifikasi pengurus", v:"terverifikasi dulu", v2:"baru voting",
   d:"Pengurus memverifikasi tiap tagihan: jumlah, dasar hukum, dan jaminan. Klaim yang tidak terverifikasi tidak ikut voting dan tidak dibayar dari harta pailit. Contoh modul: senior 200.000 dan subordinasi 150.000 adalah klaim TERVERIFIKASI yang dipakai di waterfall — klaim fiktif yang lolos verifikasi adalah awal dari recovery palsu.",
   tag:"Sumber: UU 37/2004",
   k:"Kreditur: sebelum menghitung recovery-mu, pastikan klaimmu terverifikasi — klaim yang ditolak pengurus = recovery nol."},
  {l:"Kelas kreditor — separatis, preferen, konkuren", v:"3 kelas", v2:"voting per kelas",
   d:"Kreditor dibagi kelas menurut haknya: separatis (pemegang jaminan — dibayar dari objek jaminan), preferen (gaji, pajak — didahulukan undang-undang), konkuren (tanpa jaminan — dibayar dari sisa harta). Voting perdamaian dilakukan PER KELAS: rencana butuh persetujuan tiap kelas yang dirugikan.",
   tag:"Sumber: UU 37/2004",
   k:"Kreditur: kenali kelasmu SEBELUM voting — separatis dan konkuren punya kepentingan yang berlawanan atas rencana yang sama."},
  {l:"Valuasi: going concern vs likuidasi", v:"260.000 vs 180.000", v2:"selisih 80.000",
   d:"Dua angka jangkar negosiasi (ilustratif): going concern EV 260.000 vs likuidasi 180.000. Selisih 80.000 = nilai yang dipertahankan bila perusahaan lanjut. Recovery senior: 100% (going concern) vs 90% (likuidasi: 180.000 ÷ 200.000); subordinasi: 40% vs 0%. Kelas yang menolak perdamaian membandingkan kedua angka ini.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Kreditur: valuasi likuidasi adalah 'harga lantai'-mu — proposal apa pun di bawah angka itu merugikanmu."},
  {l:"Uji proposal perdamaian — best interest test", v:"≥ recovery likuidasi", v2:"per kelas",
   d:"Uji pertama: tiap kelas menerima MINIMAL sebesar recovery likuidasinya (best interest test). Senior 100% ≥ 90% lolos; subordinasi 40% ≥ 0% lolos; ekuitas 0% = 0% (tidak dirugikan karena memang tidak ada sisa). Proposal yang memberi satu kelas di bawah recovery likuidasi seharusnya tidak disahkan.",
   tag:"Praktik restrukturisasi",
   k:"Kreditur: hitung best interest test untuk kelasmu sendiri — jangan percaya klaim 'semua kelas diuntungkan' tanpa angka per kelas."},
  {l:"Uji arus kas proposal — DSCR proyeksi", v:"1,20x", v2:"batas covenant",
   d:"Uji kedua: apakah jadwal bayar baru realistis? Proyeksi CFADS 120.000 ÷ debt service 100.000 = DSCR 1,20x (ilustratif, pada batas covenant umum). Di bawah 1,0x (ambang kecukupan kas), CFADS tidak menutup cicilan — proposal dapat hanya menunda pailit bila tidak ada reserve, injeksi ekuitas, atau perubahan syarat; minta skenario downside (CFADS −20% → 96.000 ÷ 100.000 = 0,96x) sebelum menyetujui.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Kreditur: proposal dengan DSCR proyeksi di bawah 1,20x tanpa reserve yang tebal = restrukturisasi jilid dua yang menunggu waktu."},
  {l:"Persetujuan & pengesahan (homologasi)", v:"mengikat semua", v2:"termasuk yang menolak",
   d:"Rencana yang lolos voting per kelas disahkan pengadilan (homologasi) dan mengikat SEMUA kreditor — termasuk yang menolak. Setelah disahkan, debitur menjalankan jadwal baru di bawah pengawasan; gagal bayar atas jadwal perdamaian membuka jalan ke pailit.",
   tag:"Sumber: UU 37/2004",
   k:"Kreditur: suara menolak tidak membebaskanmu dari rencana yang disahkan — lawan di voting, bukan setelah homologasi."}
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
        + (r.k && r.k !== "—" ? '<div class="forensic"><strong>Lensa kredit:</strong> '+r.k+'</div>' : '');
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
renderStmt("rating");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"EBITDA emiten turun 20% (ilustratif), total utang tetap", q1:"Rasio leverage (D/EBITDA)", q2:"Arah peringkat kredit", a1:"naik", a2:"turun",
  e:"Leverage naik → financial risk memburuk → tekanan downgrade. Inilah gerakan 'ke kanan' di matriks business risk × financial risk."},
 {t:"DSCR proyek turun ke 0,9x", q1:"Risiko gagal bayar cicilan", q2:"Peluang distribusi kas ke ekuitas", a1:"naik", a2:"turun",
  e:"DSCR < 1 = kas tak cukup untuk cicilan; cash waterfall memaksa reserve dulu, ekuitas (antrean terakhir) kering. Bisa memicu cash sweep / restrukturisasi."},
 {t:"Rencana perdamaian disetujui mayoritas kreditor dalam PKPU", q1:"Kepastian jadwal pembayaran baru", q2:"Risiko debitur dinyatakan pailit", a1:"naik", a2:"turun",
  e:"Perdamaian yang disahkan = PKPU berakhir, debitur lanjut usaha dengan jadwal baru. Risiko pailit turun — tapi pantau kepatuhan terhadap jadwalnya."},
 {t:"Restrukturisasi: haircut 30% atas pokok disepakati", q1:"Beban utang yang harus dibayar debitur", q2:"Recovery rate kreditur (vs klaim penuh)", a1:"turun", a2:"turun",
  e:"Haircut meringankan debitur (beban turun) dengan harga recovery kreditur turun ke ~70%. Trade-off klasik: pasti 70% vs judi 100%."},
 {t:"Harga saham debitur anjlok 50%, volatilitas melonjak (lensa Merton)", q1:"Probabilitas default implisit pasar", q2:"Nilai opsi ekuitas (jarak ke strike utang)", a1:"naik", a2:"turun",
  e:"Ekuitas = call atas aset; saham anjlok = pasar menilai aset mendekati strike (titik default). Early warning sebelum rasio akuntansi bergerak."},
 {t:"Obligasi subordinasi vs senior unsecured — issuer SAMA (idBBB)", q1:"Peringkat tranche subordinasi vs senior", q2:"Yield yang diminta pasar atas tranche subordinasi", a1:"turun", a2:"naik",
  e:"Subordinasi di-notch di bawah issuer (ilustratif: idBBB → idBB = 3 notch via idBBB− → idBB+) karena recovery waterfall lebih rendah — pasar menuntut yield lebih tinggi."}
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
    try{ localStorage.setItem("fsa_pg_m33", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"DSCR proyek ilustratif", hint:"CFADS 135.000 ÷ debt service 100.000 (ilustratif)", ans:1.35, tol:0.02,
  why:"1,35x — kas 35% di atas cicilan. Di atas ambang covenant umum 1,20x: aman dengan buffer."},
 {q:"Recovery rate kreditur subordinasi (%)", hint:"(260.000 − 200.000) ÷ 150.000 × 100% — EV & klaim ilustratif", ans:40.0, dec:true, tol:0.5,
  why:"40,0% — senior kenyang dulu (100%), sisa 60.000 untuk klaim 150.000. Ekuitas 0%."},
 {q:"LLCR sederhana", hint:"NPV CFADS 780.000 ÷ outstanding debt 600.000 (ilustratif)", ans:1.30, tol:0.02,
  why:"1,30x — total kas seumur pinjaman menutup utang 1,3 kali. Lensa jangka panjang pendamping DSCR."},
 {q:"Notching ilustratif: issuer idBBB → obligasi subordinasi idBB", hint:"Hitung langkah notch: idBBB → idBBB− → idBB+ → idBB (PEFINDO)", ans:3, dec:true, tol:0.1,
  why:"3 notch — idBBB → idBBB− → idBB+ → idBB. PEFINDO memakai idBBB−, jangan dilewati."},
 {q:"Recovery senior bila dilikuidasi (%)", hint:"Nilai likuidasi 180.000 ÷ klaim senior 200.000 × 100% (ilustratif)", ans:90, dec:false, tol:1,
  why:"90% — vs 100% bila perusahaan lanjut (going concern EV 260.000); selisih 10 pp ini harga perdamaian bagi senior."},
 {q:"DSCR proyeksi proposal perdamaian (x)", hint:"CFADS proyeksi 120.000 ÷ debt service 100.000 (ilustratif)", ans:1.2, dec:true, tol:0.02,
  why:"1,20x — tepat pada batas covenant umum; skenario downside CFADS −20% → 0,96x, di bawah 1,0x."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 1,35">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 1,35)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — kamu memegang obligasi subordinasi Wira Kencana (idBBB, ilustratif); harga pasar 82 (dari 100). Rekomendasi: TAHAN / TAMBAH / JUAL? Tulis 3 baris: valuasi vs risiko (di skenario stres, waterfall memberimu maksimal 40%), katalis yang kamu tunggu, keputusanmu.",
 credit:"Lensa kredit — kamu analis bank. Fasilitas Rp150.000 juta, DSCR 0,74x, agunan 120%. Rekomendasi: APPROVE / CONDITIONAL / DECLINE. Tulis 3 baris: keputusanmu + 2 syarat konkret bila conditional (mis. covenant DSCR, cash sweep, agunan tambahan).",
 forensic:"Lensa forensik — sebelum komite kredit, angka mana yang kamu verifikasi ulang? Rumor PKPU belum terverifikasi. Tulis 3 baris: data yang dicek ke sumber primer, hitungan yang di-recompute, dan satu temuan yang membuatmu menolak mentah-mentah."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m33_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m33_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"PEFINDO memberi peringkat idAAA pada sebuah obligasi. Artinya…", o:["Setara dengan AAA pada skala global — peringkat idAAA dapat dibandingkan langsung dengan AAA internasional dan obligasinya aman di seluruh dunia", "Peringkat tertinggi skala NASIONAL: kemampuan superior memenuhi kewajiban jangka panjang relatif terhadap obligor Indonesia lainnya", "Dijamin pemerintah Indonesia sehingga investor pasti menerima pembayaran penuh", "Bebas dari risiko gagal bayar selamanya — peringkat tertinggi berarti obligasi tidak mungkin default kapan pun"], a:1},
 {q:"Dalam kerangka Merton, 'strike price' dari opsi ekuitas adalah…", o:["Harga saham perusahaan saat pertama kali IPO", "Nilai buku ekuitas pada tanggal valuasi", "Nilai kini dividen tahunan yang diharapkan", "Nilai nominal utang yang jatuh tempo"], a:3},
 {q:"PKPU sementara berdasarkan UU 37/2004 berlaku paling lama…", o:["45 hari", "90 hari", "180 hari", "270 hari"], a:0},
 {q:"DSCR proyek 1,35x artinya…", o:["Total utang proyek 1,35x lipat dari ekuitas yang disetor sponsor ke dalam SPV", "Proyek menghasilkan keuntungan 35% di atas total investasinya", "Kas tersedia untuk utang 1,35x lipat dari kewajiban cicilan periode itu", "Suku bunga pinjaman proyek ditetapkan sebesar 35% per tahun"], a:2},
 {q:"Waterfall ilustratif: EV 260.000; klaim senior 200.000; subordinasi 150.000. Recovery kreditur subordinasi = …", o:["100%", "40%", "60%", "0%"], a:1}];
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
           window.FSAMistake.log(33, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Phase 8 Tuntas ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu berpikir seperti analis kredit: metodologi rating, Merton/KMV, PKPU & waterfall, dan project finance — lalu berani menulis rekomendasi: approve, conditional, atau decline. Lanjut ke <a href=\"../modul-34/\">Modul 34 — Revenue Recognition</a>, atau kembali ke <a href=\"../index.html\">FSA Lab</a>.</p>";
    try{ localStorage.setItem("fsa_gate_m33","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m33") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m33") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m33") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Phase 8 Tuntas ✓</h3><p>Modul 33 sudah kamu lewati sebelumnya — lanjut ke <a href=\"../modul-34/\">Modul 34</a> atau kembali ke <a href=\"../index.html\">FSA Lab</a>.</p>";
  }
}catch(e){}
})();
