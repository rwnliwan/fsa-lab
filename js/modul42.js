/* FSA Lab — Modul 42: Akuntansi Asuransi (IFRS 17 / PSAK 117) — PT Proteksi Sejahtera (fiktif), Rp miliar, ilustratif */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
kenapa:{ title:"Kenapa IFRS 17 menggantikan IFRS 4 — masalah lama yang diperbaiki", cols:["Masalah lama (IFRS 4)","Angka ilustratif","Yang berubah di IFRS 17"],
 rows:[
  {l:"Premi kas diakui sebagai pendapatan", v:"1.200", v2:"revenue thn 1 = 400",
   d:"Di bawah IFRS 4, premi kas Rp1.200 miliar yang diterima di muka bisa tampil sebagai pendapatan — padahal jasa perlindungan baru berjalan 1 dari 3 tahun. PSAK 117 (IFRS 17) memisahkan kas dari jasa: insurance revenue tahun 1 hanya Rp400 miliar (klaim ekspektasian 300 + beban 30 + pelepasan CSM 50 + pelepasan RA 20). Premi yang belum menjadi jasa adalah liabilitas, bukan pendapatan.",
   psak:"PSAK 117", f:"Kredit: revenue yang mengikuti jasa, bukan kas masuk, membuat kualitas laba insurer bisa dibandingkan antar perusahaan. Investasi: jangan nilai insurer dari premi yang tumbuh — tanya berapa yang sudah menjadi revenue. Forensik: insurer yang masih menonjolkan 'premi tumbuh' tanpa revenue jasa sedang menjual kas sebagai kinerja."},
  {l:"Cadangan tidak terdiskonto & tidak eksplisit", v:"990 → PV", v2:"diskonto + RA 60",
   d:"IFRS 4 membiarkan cadangan dihitung tanpa diskonto dan tanpa risk adjustment yang eksplisit — dua insurer dengan risiko sama bisa melaporkan liabilitas yang sangat berbeda. PSAK 117 mewajibkan fulfilment cash flows = nilai kini arus kas masa depan (klaim ekspektasian 900 + beban 90 = 990; dalam contoh ini diskonto dianggap nol/tidak material, sehingga nilai kini = 990) DITAMBAH risk adjustment Rp60 miliar untuk ketidakpastian non-keuangan — jadi fulfilment cash flows = 990 + 60 = Rp1.050 miliar. Jangan sebut angka 990 saja sebagai 'fulfilment cash flows': 990 adalah arus kas SEBELUM risk adjustment.",
   psak:"PSAK 117", f:"Kredit: liabilitas yang terdiskonto + RA eksplisit = bantalan yang bisa diuji, bukan angka tebakan. Investasi: perubahan asumsi diskonto kini terlihat di insurance finance income/expense, bukan tersembunyi di cadangan. Forensik: bandingkan tingkat diskonto dan RA antar insurer — asumsi yang terlalu optimistis adalah tempat laba disembunyikan."},
  {l:"Tidak ada CSM — laba diakui terlalu dini", v:"CSM 150", v2:"dilepas 50/thn",
   d:"IFRS 4 tidak mengenal Contractual Service Margin (CSM): laba dari kontrak baru bisa diakui di muka. PSAK 117 menahan laba itu sebagai CSM — Rp150 miliar (premi 1.200 − fulfilment cash flows 1.050, yaitu arus kas 990 + RA 60) — dan melepasnya Rp50 miliar per tahun selama 3 tahun coverage. Laba mengikuti jasa yang sudah diberikan, bukan kontrak yang baru ditandatangani.",
   psak:"PSAK 117", f:"Kredit: CSM adalah 'laba yang menunggu' — makin besar CSM, makin banyak laba masa depan yang sudah terkunci. Investasi: new business CSM adalah indikator pertumbuhan yang lebih jujur daripada premi baru. Forensik: CSM yang menyusut sementara premi naik = kontrak baru makin tidak menguntungkan — tanya kenapa."}
 ]},
blocks:{ title:"Building blocks — fulfilment cash flows + CSM", cols:["Blok","Angka (Rp miliar)","Peran dalam pengukuran"],
 rows:[
  {l:"Arus kas ekspektasian (klaim + beban)", v:"990", v2:"900 + 90",
   d:"Estimasi terbaik arus kas keluar masa depan: klaim ekspektasian Rp900 miliar + beban administrasi dan akuisisi Rp90 miliar = Rp990 miliar. Ini probabilitas-tertimbang (expected value), bukan skenario tunggal — lalu didiskonto ke nilai kini dengan tingkat diskonto yang mencerminkan nilai waktu uang dan risiko keuangan. Dalam contoh ini tingkat diskonto dianggap nol (tidak material) sehingga nilai kini = 990; bila diskonto positif, nilai kini lebih kecil dan CSM awal lebih besar. Ingat: 990 ini arus kas SEBELUM risk adjustment — fulfilment cash flows = 990 + RA 60 = 1.050.",
   psak:"PSAK 117", f:"Kredit: estimasi klaim adalah jantung liabilitas insurer — salah 5% di sini = Rp45 miliar. Investasi: tanya seberapa sering estimasi ini direvisi (pengalaman vs ekspektasi). Forensik: klaim ekspektasian yang tidak pernah direvisi naik sementara klaim aktual naik = asumsi yang sudah basi."},
  {l:"Risk adjustment (RA) — kompensasi ketidakpastian", v:"60", v2:"5% dari premi",
   d:"Risk adjustment Rp60 miliar adalah kompensasi yang dituntut insurer karena menanggung ketidakpastian jumlah dan waktu arus kas non-keuangan. RA dilepas ke laba seiring risiko mereda (klaim terjadi), bukan sekaligus — asumsi ilustratif modul ini: dilepas garis lurus 3 tahun, Rp20 miliar per tahun, sejalan dengan pelepasan CSM. RA naik → CSM awal turun (CSM = premi − FCF, dan FCF sudah termasuk RA), karena sebagian margin dialokasikan ke ketidakpastian.",
   psak:"PSAK 117", f:"Kredit: RA besar = insurer mengakui ketidakpastiannya — lebih jujur daripada RA tipis. Investasi: pelepasan RA adalah sumber laba yang berulang selama coverage. Forensik: RA yang menyusut tanpa alasan sementara portofolio makin berisiko = laba yang ditarik dari bantalan."},
  {l:"Contractual Service Margin (CSM) — laba yang belum diakui", v:"150", v2:"1.200 − 990 − 60",
   d:"CSM awal = premi Rp1.200 miliar − fulfilment cash flows Rp1.050 miliar (arus kas keluar 990 + risk adjustment 60) = Rp150 miliar. CSM bukan aset dan bukan pendapatan — ia komponen liabilitas kontrak asuransi yang dilepas ke laba selama coverage (di sini Rp50 miliar per tahun, garis lurus, ilustratif). Bila FCF melebihi premi, kontrak onerous: tidak ada CSM, dan rugi langsung diakui di laba rugi.",
   psak:"PSAK 117", f:"Kredit: CSM positif = kontrak menguntungkan sejak hari pertama; kontrak onerous = rugi yang harus diakui segera. Investasi: roll-forward CSM (awal + baru − dilepas ± perubahan estimasi) adalah cerita pertumbuhan insurer. Forensik: CSM yang tumbuh hanya karena perubahan asumsi, bukan kontrak baru, adalah pertumbuhan semu."},
  {l:"Liabilitas kontrak: LRC + LIC", v:"1.200", v2:"saat pengakuan awal",
   d:"Liabilitas kontrak asuransi terdiri dari Liability for Remaining Coverage (LRC — jasa yang belum diberikan: FCF masa depan + CSM) dan Liability for Incurred Claims (LIC — klaim yang sudah terjadi tapi belum dibayar). Saat pengakuan awal grup contoh ini: LRC Rp1.200 miliar (premi diterima, belum ada jasa) — lalu menyusut seiring revenue diakui.",
   psak:"PSAK 117", f:"Kredit: LRC yang menyusut lebih cepat dari revenue = jasa diberikan lebih cepat dari yang dijanjikan — cek. Investasi: LIC yang membengkak = klaim menumpuk belum dibayar, tekanan kas di depan. Forensik: pisahkan LRC vs LIC — mencampurnya menyembunyikan apakah masalah ada di bisnis baru atau klaim lama."},
  {l:"VFA — variable fee approach (kontrak partisipasi langsung)", v:"+50", v2:"10% × 500",
   d:"Bila pemegang polis berpartisipasi langsung pada sekumpulan aset (underlying items) — mis. unit-linked — kontrak memakai VFA: entitas mendapat 'fee variabel' dari hasil aset itu. Perubahan nilai wajar aset yang menjadi bagian entitas MENYESUAIKAN CSM, bukan masuk laba rugi. Ilustratif: nilai wajar aset dasar naik 500; bagian entitas 10% → CSM naik 50 (bukan laba 50 di P&L). Sebaliknya bila aset turun, CSM yang tergerus duluan. Diskonto VFA memakai tingkat kini, bukan tingkat saat pengakuan awal.",
   psak:"PSAK 117 (IFRS 17)", f:"Kredit: VFA membuat laba insurer mengikuti fee atas aset yang dikelola — bukan hasil investasi itu sendiri. Investasi: CSM yang bergerak searah pasar = VFA, bukan general model — jangan samakan volatilitasnya. Forensik: kontrak yang diklaim VFA tetapi pemegang polis tidak berbagi hasil aset secara langsung = klasifikasi yang patut diuji — VFA mensyaratkan partisipasi langsung."},
 ]},
revenue:{ title:"Insurance revenue vs insurance service expense — bukan premi kas", cols:["Pos (tahun 1)","Angka (Rp miliar)","Aturan pengakuan"],
 rows:[
  {l:"Insurance revenue tahun 1", v:"400", v2:"300 + 30 + 50 + 20",
   d:"Revenue tahun 1 = klaim ekspektasian yang terjadi 300 + beban 30 + pelepasan CSM 50 + pelepasan RA 20 = Rp400 miliar. BUKAN premi kas Rp1.200 miliar. Revenue mengukur jasa yang sudah diberikan: klaim yang ditanggung tahun itu, beban yang dikeluarkan, bagian laba (CSM) yang dilepas, DAN kompensasi ketidakpastian (RA) yang dilepas seiring risiko mereda. Asumsi ilustratif: RA 60 dilepas garis lurus 3 tahun (20/tahun), sejalan dengan CSM. Komponen investasi (mis. premi yang dikembalikan bila tidak ada klaim) dikeluarkan dari revenue dan expense.",
   psak:"PSAK 117", f:"Kredit: revenue yang mengikuti jasa = tidak ada lagi 'pendapatan' dari premi yang belum dikerjakan. Investasi: bandingkan revenue antar insurer — kini rumusnya sama, perbandingannya bermakna. Forensik: revenue yang tumbuh secepat premi kas = tanda insurer masih berpikir seperti IFRS 4."},
  {l:"Insurance service expense tahun 1", v:"330", v2:"300 + 30",
   d:"Service expense tahun 1 = klaim aktual yang terjadi 300 + beban 30 = Rp330 miliar. Bila klaim aktual melebihi ekspektasi (mis. 340), selisih Rp40 miliar langsung menekan service result tahun berjalan — CSM tidak menanggungnya, karena CSM hanya menyerap perubahan estimasi jasa MASA DEPAN.",
   psak:"PSAK 117", f:"Kredit: klaim aktual vs ekspektasian adalah tes kejujuran asumsi tiap tahun. Investasi: expense yang melonjak = pengalaman klaim memburuk, bukan sekadar 'biaya naik'. Forensik: klaim aktual yang selalu tepat sama dengan ekspektasi = asumsi yang mungkin 'disesuaikan' ke realisasi."},
  {l:"Insurance service result tahun 1", v:"70", v2:"400 − 330",
   d:"Service result = revenue 400 − expense 330 = Rp70 miliar — persis sama dengan pelepasan CSM 50 + pelepasan RA 20 tahun itu. Itu bukan kebetulan: dalam contoh yang disederhanakan ini (aktual = ekspektasi, tanpa perubahan asumsi), laba jasa asuransi tahun berjalan adalah margin (CSM + RA) yang dilepas. Bila klaim aktual 340, service result jatuh ke Rp30 miliar (400 − 370).",
   psak:"PSAK 117", f:"Kredit: service result adalah laba operasi murni asuransi — sebelum hasil investasi dan finance. Investasi: service result yang stabil = mesin underwriting bekerja; yang bergejolak = klaim tidak terkendali. Forensik: service result yang selalu sama dengan pelepasan CSM + RA patut dicurigai — realisasi klaim nyaris tidak pernah sama persis dengan ekspektasi."},
  {l:"Jembatan: pelepasan RA + rekonsiliasi LRC–LIC (tahun 1)", v:"LRC 800", v2:"1.200 − 400",
   d:"Jembatan yang harus cocok. LRC awal 1.200 = FCF 990 + RA 60 + CSM 150. Selama tahun 1, jasa yang diberikan (revenue 400 = klaim 300 + beban 30 + CSM 50 + RA 20) menyusutkan LRC menjadi 800 = FCF sisa 660 (klaim 600 + beban 60) + RA sisa 40 + CSM sisa 100. LIC: klaim terjadi 300 — dalam contoh ini dibayar tunai tahun itu, sehingga LIC akhir 0 dan kas keluar 330 (klaim 300 + beban 30). Total liabilitas kontrak akhir = LRC 800 + LIC 0 = 800 (dari 1.200). Bila klaim 300 belum dibayar, LIC akhir 300 dan total liabilitas 1.100 — LRC tetap 800, yang pindah hanya kas vs LIC.",
   psak:"PSAK 117", f:"Kredit: LRC yang menyusut 400 persis sebesar revenue = jasa diberikan sesuai janji — selisihnya tanda ada perubahan asumsi. Investasi: CSM sisa 100 + RA sisa 40 adalah laba masa depan yang masih terkunci. Forensik: LRC akhir yang tidak sama dengan FCF sisa + RA sisa + CSM sisa = roll-forward yang tidak menutup — minta rinciannya."}
 ]},
paa:{ title:"Premium Allocation Approach (PAA) — penyederhanaan untuk kontrak pendek", cols:["Aspek","Perlakuan PAA","Catatan"],
 rows:[
  {l:"Kapan PAA boleh dipakai", v:"≤ 1 tahun", v2:"atau sederhana",
   d:"PAA boleh dipakai bila coverage tiap kontrak ≤ 1 tahun, atau bila hasil pengukurannya tidak berbeda material dari general model. Praktis: asuransi umum (kendaraan, properti, kesehatan jangka pendek) adalah kandidat utama; kontrak jiwa multi-tahun memakai general model (atau variable fee approach untuk produk partisipasi).",
   psak:"PSAK 117", f:"Kredit: PAA pada kontrak pendek = liabilitas yang mudah diverifikasi. Investasi: insurer umum yang memakai PAA punya laporan yang lebih sederhana — tapi jangan samakan sederhananya dengan murahnya risiko. Forensik: PAA dipakai pada kontrak yang coverage-nya jelas di atas 1 tahun = pelanggaran syarat, bukan pilihan."},
  {l:"Yang disederhanakan: LRC mengikuti premi", v:"120", v2:"premi belum diakui",
   d:"Di bawah PAA, Liability for Remaining Coverage = premi yang diterima dikurangi premi yang sudah diakui sebagai revenue — mirip pendapatan diterima di muka. Contoh: premi Rp120 miliar untuk 1 tahun diakui Rp10 miliar per bulan; LRC awal 120, akhir bulan 6 tinggal 60. Tidak perlu menghitung CSM dan fulfilment cash flows untuk LRC.",
   psak:"PSAK 117", f:"Kredit: LRC PAA transparan — premi belum diakui terlihat langsung. Investasi: revenue PAA = premi yang dialokasikan, jadi tren premi dan revenue bergerak bersama. Forensik: LRC PAA yang tidak menyusut seiring waktu = revenue yang ditahan atau premi yang dicatat ganda."},
  {l:"PAA vs general model — selisihnya risk adjustment", v:"120 vs 120", v2:"selisih 0",
   d:"Contoh kerja: kontrak 1 tahun premi 120, klaim ekspektasian 84, beban 12, RA 6 → CSM general model = 120 − 84 − 12 − 6 = 18; revenue general model = 84 + 12 + 18 + 6 = 120 — RA 6 dilepas penuh di tahun itu karena coverage hanya 1 tahun. Revenue PAA = 120 (seluruh premi dialokasikan). Selisih Rp0: total revenue SAMA; bedanya hanya penyajian — di general model RA dipisah lalu dilepas, di PAA ia menyatu dalam premi yang dialokasikan. Angka disederhanakan untuk menunjukkan arah, bukan presisi penuh.",
   psak:"PSAK 117", f:"Kredit: revenue total yang sama di kontrak pendek inilah alasan PAA diizinkan — penyederhanaannya tidak mengubah total, hanya rinciannya. Investasi: jangan bandingkan RINCIAN revenue PAA dengan general model tanpa menyesuaikan RA — totalnya sama, komposisinya beda. Forensik: insurer yang beralih model pengukuran antar tahun tanpa alasan = comparability yang rusak."}
 ]},
finance:{ title:"Insurance finance income/expense + reinsurance held", cols:["Pos","Arah","Isi singkat"],
 rows:[
  {l:"Insurance finance income / expense", v:"diskonto", v2:"bunga atas liabilitas",
   d:"Liabilitas asuransi didiskonto — seiring waktu, unwinding diskonto menambah liabilitas dan diakui sebagai insurance finance expense (atau income bila diskonto berubah menguntungkan). Perubahan tingkat diskonto bisa diakui di laba rugi atau OCI (pilihan kebijakan akuntansi). Efeknya: laba insurer sensitif ke suku bunga, terpisah dari kinerja underwriting.",
   psak:"PSAK 117", f:"Kredit: pisahkan finance dari service — insurer bisa untung dari jasa tapi rugi dari bunga, atau sebaliknya. Investasi: volatilitas suku bunga kini terlihat di pos finance, bukan tersembunyi di cadangan. Forensik: insurer yang memindahkan efek diskonto ke OCI tanpa penjelasan = volatilitas yang disembunyikan dari laba rugi."},
  {l:"Reinsurance held — cermin, bukan pengurang premi", v:"120 → 60", v2:"premi → recovery",
   d:"Reinsurance held (reasuransi yang dibeli) disajikan TERPISAH: bukan pengurang premi, melainkan aset reinsurance contract + income/expense sendiri. Contoh ilustratif: premi reasuransi 120, klaim besar 200 ditanggung reasuradur 60% → recovery 120 mengurangi beban klaim neto menjadi 80. Hasil neto reasuransi bisa untung atau rugi — dan harus terlihat, bukan disembunyikan dalam angka bruto.",
   psak:"PSAK 117", f:"Kredit: reasuransi adalah transfer risiko — cek berapa banyak risiko yang benar-benar pindah, bukan sekadar premi yang dibayar. Investasi: recovery yang lambat = piutang reasuransi menumpuk. Forensik: rasio recovery terhadap klaim yang tidak konsisten antar tahun = pertanyaan tentang kualitas reasuradur."},
  {l:"Onerous contracts — rugi diakui segera", v:"loss component", v2:"tanpa CSM",
   d:"Bila fulfilment cash flows (arus kas + risk adjustment) melebihi premi, kontrak onerous: tidak ada CSM, dan rugi (loss component) langsung diakui di laba rugi saat pengakuan awal atau saat estimasi memburuk. Contoh: klaim ekspektasian naik 900 → 960 membuat CSM menyusut 150 → 90 — belum onerous, tapi bila naik melewati 1.050, sisa selisihnya menjadi rugi segera. Lanjutan (angka menutup): klaim naik ke 1.100 → arus kas 1.100 + 90 = 1.190 + RA 60 → FCF 1.250; premi 1.200 − 1.250 = −50 → loss component 50, CSM 0, rugi 50 langsung di P&L. Bila klaim membaik ke 1.000 → FCF 1.000 + 90 + 60 = 1.150 → 1.200 − 1.150 = 50 → loss component terbalik penuh (gain 50 di P&L), CSM tetap 0. Bila membaik ke 960 → selisih 90 → loss component balik 50 + CSM terbentuk kembali 40. Urutannya kaku: pulihkan loss component DULU, baru bangun CSM.",
   psak:"PSAK 117", f:"Kredit: onerous yang diakui cepat = manajemen jujur soal kontrak yang merugi. Investasi: loss component yang muncul berulang = portofolio yang salah harga. Forensik: tidak ada kontrak onerous sama sekali di portofolio yang preminya ditekan kompetisi = klaim yang patut diuji."}
 ]},
baca:{ title:"Membaca insurer — combined ratio, CSM roll-forward, new business CSM", cols:["Ukuran","Angka ilustratif","Cara membaca"],
 rows:[
  {l:"Combined ratio 94,1% (umum)", v:"94,1%", v2:"(620 + 180) ÷ 850",
   d:"Combined ratio = (klaim terjadi + beban underwriting) ÷ premi yang diperoleh. Contoh: (620 + 180) ÷ 850 = 94,1% — di bawah 100% berarti underwriting untung 5,9 poin. Di atas 100% berarti rugi underwriting (ditutup hasil investasi, bila ada). Selalu pisahkan loss ratio (klaim ÷ premi = 72,9%) dan expense ratio (beban ÷ premi = 21,2%). Catatan penyebut: 94,1% ini memakai premi yang diperoleh portofolio UMUM (Rp850 miliar). Di Bedah Sendiri Proteksi, definisi latihannya berbeda — (klaim + beban) ÷ insurance revenue atas SELURUH portofolio (jiwa + umum) — sehingga kuncinya 74,1% (800 ÷ 1.080). Beda penyebut dan cakupan, bukan salah hitung.",
   psak:"—", f:"Kredit: combined di atas 100% selama 3 tahun = model bisnis yang hidup dari investasi, bukan underwriting. Investasi: combined yang membaik karena klaim turun lebih berharga daripada karena premi naik. Forensik: combined 'bagus' + cadangan klaim (LIC) yang menyusut = klaim yang mungkin ditahan."},
  {l:"CSM roll-forward 3 tahun", v:"150 → 0", v2:"−50 / tahun",
   d:"CSM awal 150, dilepas 50 per tahun, akhir tahun 1: 100, tahun 2: 50, tahun 3: 0 (disederhanakan: tanpa akresi bunga dan tanpa perubahan asumsi). Roll-forward lengkap: CSM awal + CSM kontrak baru ± perubahan estimasi jasa masa depan − pelepasan periode berjalan = CSM akhir. Pertumbuhan CSM yang sehat datang dari kontrak baru yang menguntungkan.",
   psak:"PSAK 117", f:"Kredit: CSM akhir adalah cadangan laba masa depan — makin besar, makin banyak laba yang sudah terkunci. Investasi: new business CSM per tahun adalah metrik pertumbuhan terbaik insurer jiwa. Forensik: CSM akhir yang naik hanya karena perubahan asumsi diskonto = pertumbuhan yang tidak berasal dari penjualan."},
  {l:"New business CSM — pertumbuhan yang jujur", v:"150", v2:"kontrak baru thn 1",
   d:"New business CSM adalah CSM dari kontrak yang dijual pada periode berjalan — di contoh ini Rp150 miliar untuk grup yang baru diakui. Berbeda dari premi baru: premi bisa tumbuh dari kontrak yang merugi (onerous, CSM nol), sedangkan new business CSM hanya tumbuh bila kontrak baru menguntungkan. Analis membandingkan new business CSM dengan premi baru untuk menilai kualitas pertumbuhan.",
   psak:"PSAK 117", f:"Kredit: premi naik + new business CSM datar = pertumbuhan yang tidak menambah laba masa depan. Investasi: new business CSM yang tumbuh dua digit dengan margin stabil = franchise yang kuat. Forensik: new business CSM yang melonjak di kuartal terakhir tahun = tanya apakah asumsi penjualan akhir tahun terlalu optimistis."},
  {l:"Jembatan: premi 1.200 → revenue 400 → laba jasa 70", v:"70", v2:"thn 1, Rp miliar",
   d:"Satu jembatan yang harus cocok: premi kas 1.200 → insurance revenue tahun 1: 400 (300 klaim + 30 beban + 50 CSM + 20 RA) → service expense 330 → service result 70. Bila revenue tumbuh tapi service result tidak, masalahnya ada di klaim aktual atau beban. Bila service result tumbuh tapi CSM menyusut, laba hari ini dibayar dengan laba masa depan.",
   psak:"PSAK 117", f:"Kredit: jembatan ini adalah tes konsistensi pertama atas laporan insurer mana pun. Investasi: laba jasa yang tumbuh bersama CSM = pertumbuhan berkelanjutan. Forensik: jembatan yang tidak bisa direkonsiliasi dari pengungkapan = minta rincian roll-forward LRC dan CSM."}
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
renderStmt("kenapa");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Risk adjustment naik 60 → 90, premi dan arus kas lain tetap", q1:"CSM awal", q2:"Insurance revenue tahun 1", a1:"turun", a2:"tetap",
  e:"CSM awal = 1.200 − 900 − 90 − 90 = 120 (turun dari 150); pelepasan CSM per tahun 120 ÷ 3 = 40 (dari 50), TETAPI pelepasan RA naik 90 ÷ 3 = 30 (dari 20) → revenue tahun 1 = 300 + 30 + 40 + 30 = 400 — SAMA seperti sebelumnya (300 + 30 + 50 + 20). Total margin (CSM + RA) tetap 210, jadi total pelepasan per tahun tetap 70; yang berubah hanya KOMPOSISINYA: lebih banyak laba dari pelepasan RA, lebih sedikit dari CSM. RA yang lebih besar memakan CSM, bukan revenue."},
 {t:"Klaim aktual tahun 1 Rp340 miliar, padahal ekspektasian Rp300 miliar", q1:"Insurance service result tahun 1", q2:"CSM", a1:"turun", a2:"tetap",
  e:"Service expense = 340 + 30 = 370 → service result = 400 − 370 = 30 (turun dari 70). CSM TETAP 150: selisih klaim yang sudah terjadi adalah pengalaman periode berjalan dan langsung masuk laba rugi — CSM hanya menyerap perubahan estimasi jasa MASA DEPAN, bukan klaim yang sudah terjadi."},
 {t:"Tingkat diskonto naik — nilai kini klaim masa depan menyusut", q1:"Fulfilment cash flows", q2:"CSM awal", a1:"turun", a2:"naik",
  e:"Diskonto lebih tinggi → PV arus kas keluar masa depan lebih kecil → FCF turun. CSM awal = premi − FCF (FCF sudah termasuk RA): FCF yang lebih kecil membuat CSM awal NAIK (dengan premi dan RA tetap). Inilah mengapa laba insurer sensitif ke suku bunga lewat pos finance — terpisah dari kinerja underwriting."},
 {t:"Grup kontrak baru yang menguntungkan ditambah: premi 600, CSM awal 75", q1:"CSM total (awal)", q2:"Insurance revenue tahun 1", a1:"naik", a2:"naik",
  e:"Asumsi kartu ini (agar totalnya bisa dihitung): grup baru setengah skala grup awal — klaim total 450 (150/tahun), beban total 45 (15/tahun), RA total 30 (10/tahun), CSM awal 75 (25/tahun): 600 − 450 − 45 − 30 = 75 ✓. CSM total awal = 150 + 75 = 225 (naik). Revenue tahun 1 = (300 + 150) + (30 + 15) + (50 + 25) + (20 + 10) = 450 + 45 + 75 + 30 = 600 (sebelumnya 400). Kontrak baru yang menguntungkan menambah laba masa depan DAN laba tahun berjalan — tetapi hanya bila klaim, beban, dan RA grup barunya ikut dihitung; pelepasan CSM saja tidak cukup."},
 {t:"Asumsi klaim masa depan memburuk: klaim ekspektasian 900 → 960", q1:"CSM", q2:"Insurance service result tahun berjalan", a1:"turun", a2:"tetap",
  e:"CSM = 1.200 − 960 − 90 − 60 = 90 (turun dari 150): perubahan estimasi jasa masa depan diserap CSM. Service result tahun berjalan TETAP 70 — klaim tahun ini belum terjadi, jadi laba rugi tahun ini tidak tersentuh. Bila klaim naik melewati 1.050, kontrak menjadi onerous dan selisihnya langsung menjadi rugi."},
 {t:"Klaim besar Rp200 miliar, reasuransi menanggung 60% (recovery Rp120 miliar)", q1:"Beban klaim neto (setelah reasuransi)", q2:"Insurance service result", a1:"turun", a2:"naik",
  e:"Beban klaim neto = 200 − 120 = 80 (turun dari 200 bruto). Recovery reasuransi mengurangi service expense → service result naik Rp120 miliar dibanding tanpa reasuransi. Ingat: reinsurance held disajikan terpisah — premi reasuransi 120 dan recovery 120 terlihat sendiri, bukan disembunyikan dalam angka bruto."}
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
    try{ localStorage.setItem("fsa_pg_m42", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"CSM awal (Rp miliar)", hint:"Premi 1.200 − fulfilment cash flows 1.050 (arus kas keluar 990 + risk adjustment 60)", ans:150, dec:false, tol:0.5,
  why:"150 — premi 1.200 dikurangi fulfilment cash flows 1.050 (arus kas keluar 990 + RA 60). Inilah laba yang belum diakui, dilepas 50 per tahun selama 3 tahun coverage."},
 {q:"Insurance revenue tahun 1 (Rp miliar)", hint:"Klaim ekspektasian tahun 1: 300 + beban tahun 1: 30 + pelepasan CSM: 50 + pelepasan RA: 20", ans:400, dec:false, tol:0.5,
  why:"400 — revenue mengukur jasa yang sudah diberikan, bukan premi kas 1.200. Klaim 300 + beban 30 + CSM 50 + RA 20."},
 {q:"Insurance service result tahun 1 (Rp miliar)", hint:"Insurance revenue tahun 1 (400) − insurance service expense tahun 1 (klaim 300 + beban 30)", ans:70, dec:false, tol:0.5,
  why:"70 — sama dengan pelepasan CSM 50 + pelepasan RA 20 tahun itu, karena dalam contoh ini klaim aktual sama dengan ekspektasi dan tidak ada perubahan asumsi."},
 {q:"Combined ratio (%) — portofolio umum", hint:"(Klaim terjadi 620 + beban underwriting 180) ÷ premi yang diperoleh 850 × 100%", ans:94.1, dec:true, tol:0.15,
  why:"94,1% — di bawah 100% berarti underwriting untung 5,9 poin. Loss ratio 72,9% (620 ÷ 850) + expense ratio 21,2% (180 ÷ 850) = 94,1%."},
 {q:"LRC akhir tahun 1 (Rp miliar)", hint:"LRC awal 1.200 − revenue tahun 1 (400); cek: FCF sisa 660 + RA sisa 40 + CSM sisa 100", ans:800, dec:false, tol:0.5,
  why:"800 — LRC menyusut sebesar revenue 400. Cek: FCF sisa (klaim 600 + beban 60) 660 + RA sisa 40 + CSM sisa 100 = 800. LIC akhir 0 karena klaim 300 dibayar tunai."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 150">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 150)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — insurer ilustratif ini: CSM awal 150, new business CSM 150, combined ratio 94,1%, service result tahun 1: 70. Apakah sahamnya layak dibeli? Tulis 3 baris: apa yang menarik, apa yang mengganggumu, keputusanmu.",
 credit:"Lensa kredit — kamu analis kredit / calon pembeli obligasi insurer ini: CSM 150 sebagai cadangan laba masa depan, combined ratio 94,1%, tetapi klaim aktual bisa melampaui ekspektasi dan kontrak bisa menjadi onerous. Tulis 3 baris: kekuatan, risiko yang perlu covenant, kesimpulanmu.",
 forensic:"Lensa forensik — verifikasi jembatan premi 1.200 → revenue 400 → service result 70: dari mana angka 300, 30, 50, dan 20 berasal? Apa yang TIDAK bisa kamu verifikasi dari angka agregat ini? Tulis 3 baris: yang terverifikasi, lubang terbesar, data tambahan yang kamu minta."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m42_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m42_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"Grup kontrak jiwa 3 tahun punya CSM awal Rp150 miliar yang dilepas garis lurus selama masa coverage. Berapa pelepasan CSM tiap tahun?", o:["Rp150 miliar di tahun pertama, lalu nol di tahun 2 dan 3", "Rp50 miliar per tahun selama 3 tahun", "Rp30 miliar per tahun selama 5 tahun", "Rp75 miliar per tahun selama 2 tahun"], a:1},
 {q:"Kontrak asuransi umum 1 tahun, premi Rp120 miliar, tanpa fitur partisipasi yang kompleks. Perlakuan yang tepat menurut PSAK 117?", o:["PAA dapat dipakai: liabilitas mengikuti premi yang belum diakui", "PAA dipakai untuk kontrak asuransi umum karena preminya dibayar di muka", "General model dipakai karena PAA tidak mencakup kontrak asuransi umum", "Kontrak dicatat sebagai investasi karena preminya dibayar di muka"], a:0},
 {q:"Premi kas Rp1.200 miliar diterima untuk grup kontrak 3 tahun. Berapa insurance revenue tahun 1?", o:["Rp1.200 miliar: seluruh premi kas diakui sebagai revenue di tahun pertama", "Rp400 miliar: klaim ekspektasian 300 + beban 30 + pelepasan CSM 50 + pelepasan RA 20", "Rp150 miliar: hanya pelepasan CSM yang diakui sebagai revenue", "Rp900 miliar: klaim ekspektasian 3 tahun diakui sekaligus di tahun 1"], a:1},
 {q:"Risk adjustment naik dari 60 menjadi 90, sedangkan premi dan arus kas lain tetap. Apa dampak ke CSM awal?", o:["CSM awal naik Rp30 miliar karena risiko yang lebih besar menambah laba", "CSM awal tetap 150 karena risk adjustment diakui terpisah dari CSM", "CSM awal turun Rp30 miliar: RA lebih besar mengurangi laba belum diakui", "CSM awal menjadi nol karena risk adjustment menghapus seluruh margin"], a:2},
 {q:"Premi yang diperoleh 850, klaim terjadi 620, beban underwriting 180 (Rp miliar). Berapa combined ratio dan artinya?", o:["129,0%: underwriting rugi karena klaim melebihi premi yang diperoleh", "72,9%: underwriting untung besar karena hanya klaim yang dihitung", "94,1%: underwriting untung karena rasio di bawah 100%", "100,0%: impas karena klaim dan beban persis menghabiskan seluruh premi"], a:2}];
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
           window.FSAMistake.log(42, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu membaca insurer seperti analis: CSM, PAA, revenue jasa vs premi kas, dan combined ratio — semuanya terartikulasi. Lanjut ke <a href=\"/modul-43/\">Modul 43 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m42","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m42") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m42") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m42") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Modul 42 sudah kamu lewati sebelumnya — lanjut ke <a href=\"/modul-43/\">Modul 43</a>.</p>";
  }
}catch(e){}
})();
