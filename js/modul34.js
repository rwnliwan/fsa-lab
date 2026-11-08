/* FSA Lab — Modul 34: Revenue Recognition, PSAK 115 (dulu 72) / IFRS 15 (lensa FORENSIK; contoh baru = ILUSTRATIF berlabel) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
l1:{ title:"Langkah 1 — Identifikasi kontrak dengan pelanggan. Tanpa kontrak valid, lima langkah berhenti di sini.", cols:["Kriteria","Status","Catatan"],
 rows:[
  {l:"Kontrak = kesepakatan yang menciptakan hak & kewajiban yang dapat dipaksakan (enforceable)", v:"DEFINISI", v2:"—", kl:"Lensa investasi",
   d:"Bentuknya bebas: tertulis, lisan, bahkan tersirat dari praktik bisnis — yang penting hak masing-masing pihak bisa dipaksakan dan konsekuensi wanprestasi jelas. Inilah fondasi seluruh model lima langkah.",
   tag:"PSAK 115 (dulu 72), mengadopsi IFRS 15",
   k:"Investor membaca catatan 'pendapatan' emiten justru untuk memastikan kontraknya enforceable — pendapatan dari MOU tak mengikat = bukan pendapatan."},
  {l:"Lima kriteria kontrak valid: (1) disetujui & berkomitmen, (2) hak tiap pihak teridentifikasi, (3) syarat pembayaran jelas, (4) substansi komersial, (5) kolektibilitas probable", v:"5 KRITERIA", v2:"—", kl:"Sudut forensik",
   d:"Kelima-limanya harus terpenuhi. 'Substansi komersial' = arus kas masa depan benar-benar berubah karena kontrak ini (bukan tukar-menukar semu). 'Kolektibilitas probable' = besar kemungkinan imbalan tertagih.",
   tag:"PSAK 115 (dulu 72)",
   k:"Dua kriteria yang paling sering 'dilonggarkan' diam-diam: substansi komersial (transaksi round-trip dengan pihak berelasi) dan kolektibilitas (pelanggan yang jelas tak mampu bayar)."},
  {l:"Kontrak yang tak memenuhi kriteria → imbalan diterima = LIABILITAS, bukan pendapatan", v:"BUKAN PENDAPATAN", v2:"aturan", kl:"Lensa kredit",
   d:"Kas yang diterima sebelum kontrak valid dicatat sebagai liabilitas (utang pengembalian) sampai kriteria terpenuhi atau kontrak batal. Pendapatan nol — seberapa pun kas sudah masuk.",
   tag:"PSAK 115 (dulu 72)",
   k:"Kreditur yang melihat 'pendapatan' melonjak tanpa kontrak valid melihat ilusi: tak ada hak enforceable = tak ada arus kas yang bisa diandalkan untuk debt service."},
  {l:"Side agreement: kontrak tertulis bilang A, surat sampingan bilang B", v:"RED FLAG", v2:"forensik", kl:"Sudut forensik",
   d:"Modus klasik: syarat retur/pembatalan disembunyikan di side letter agar kontrak utama lolos kriteria. Auditor & analis yang hanya membaca kontrak utama akan terkecoh — forensik selalu bertanya: 'ada surat lain?'",
   tag:"Pola fraud pendapatan",
   k:"Muncul di angka sebagai: retur mendadak melonjak kuartal berikutnya + piutang macet ke segelintir pelanggan. Cek catatan kaki 'transaksi dengan pihak berelasi'."},
  {l:"Abaikan ambang kolektibilitas: catat pendapatan dari pelanggan yang takkan membayar", v:"RED FLAG", v2:"forensik", kl:"Sudut forensik",
   d:"Kriteria (5) mensyaratkan kolektibilitas probable SEBELUM satu rupiah diakui. Melanggarnya = revenue fiktif secara ekonomi: piutang yang lahir untuk tak pernah tertagih.",
   tag:"PSAK 115 (dulu 72)",
   k:"Screen-nya: revenue naik, kas dari pelanggan datar, DSO meledak, dan allowance piutang tak bergerak. Lihat Case Files Kasus 2 (Enron): pertumbuhan tanpa kas."}
 ]},
l2:{ title:"Langkah 2 — Identifikasi kewajiban pelaksanaan (performance obligations). Salah petakan di sini, timing pendapatan ikut salah.", cols:["Konsep","Isi","Catatan"],
 rows:[
  {l:"Kewajiban pelaksanaan = janji menyerahkan barang/jasa yang DISTINCT ke pelanggan", v:"DISTINCT", v2:"—", kl:"Lensa investasi",
   d:"Satu kontrak bisa berisi BANYAK kewajiban (alat + instalasi + garansi). Tiap kewajiban yang distinct diakui pendapatannya sendiri-sendiri — boleh beda waktu.",
   tag:"PSAK 115 (dulu 72)",
   k:"Investor memecah kontrak multi-tahun jadi 'kapan kas benar-benar jadi milik perusahaan' — kewajiban yang belum dipenuhi = liabilitas kontrak, bukan ekuitas masa depan."},
  {l:"Uji distinct: (a) pelanggan bisa mengambil manfaatnya sendiri, (b) janji terpisah dari janji lain di kontrak", v:"2 SYARAT", v2:"—", kl:"Sudut forensik",
   d:"Alat bisa dipakai tanpa instalasi penjual? (a) lolos. Instalasi bukan sekadar 'melengkapi' alat? (b) lolos. Garansi extended di luar garansi standar? distinct — karena pelanggan bisa membelinya terpisah.",
   tag:"PSAK 115 (dulu 72)",
   k:"Area abu-abu = area mainan: manajemen berargumen 'tidak distinct' agar satu paket diakui sekaligus di muka. Minta uji (a)-(b) tertulis di kertas kerja."},
  {l:"Contoh Surya Nusa (ilustratif): alat ✓ distinct, instalasi ✓ distinct, garansi extended ✓ distinct → 3 kewajiban", v:"3 KEWAJIBAN", v2:"ilustratif", kl:"Lensa investasi",
   d:"Tiga kewajiban = tiga jadwal pengakuan: alat saat serah terima, instalasi saat selesai, garansi selama 24 bulan. Inilah yang membuat 'harga kontrak 120.000' TIDAK sama dengan 'pendapatan 2026'.",
   tag:"Contoh modul (angka ilustratif)",
   k:"Analis yang cermat tidak menaruh 120.000 di forecast 2026 — ia menaruh 109.630 (alat+instalasi+10 bulan garansi) dan sisanya di 2027–2028."},
  {l:"Garansi assurance vs service: jaminan standar BUKAN kewajiban terpisah", v:"BUKAN PO", v2:"aturan", kl:"Sudut forensik",
   d:"Garansi tipe assurance (menjamin produk sesuai spesifikasi) dicatat sebagai provisi mengikuti PSAK 237 (dulu 57) — bukan kewajiban pelaksanaan. Hanya garansi tipe service (extended, berbayar) yang menjadi kewajiban tersendiri.",
   tag:"PSAK 115; PSAK 237 (dulu 57)",
   k:"Celah: mengklaim garansi extended sebagai 'assurance' agar seluruh harga diakui di muka. Uji: apakah pelanggan membayar premi / bisa membeli terpisah? Kalau ya = service."},
  {l:"Bundling/unbundling: menggabung agar alokasi kabur, memecah agar timing bergeser", v:"RED FLAG", v2:"forensik", kl:"Sudut forensik",
   d:"Dua arah manipulasi: (1) gabung semua jadi satu kewajiban → akui sekaligus lebih cepat; (2) pecah berlebihan → geser porsi ke kewajiban yang sudah 'selesai'. Keduanya mengubah KAPAN pendapatan muncul tanpa mengubah kas.",
   tag:"Pola fraud pendapatan",
   k:"Screen: baca definisi kewajiban di catatan LK dua tahun berurutan — definisi yang berubah-ubah tanpa perubahan bisnis = lampu kuning."}
 ]},
l3:{ title:"Langkah 3 — Tentukan harga transaksi. Bukan harga di kuitansi, melainkan imbalan yang DIHARAPKAN.", cols:["Komponen","Aturan","Catatan"],
 rows:[
  {l:"Harga transaksi = imbalan yang diharapkan atas kewajiban yang dijanjikan", v:"EKSPEKTASI", v2:"—", kl:"Lensa investasi",
   d:"Bisa lebih kecil dari harga kontrak (ada diskon/retur yang diperkirakan) atau mencakup komponen non-kas. Prinsip: ukur realitas ekonomi, bukan angka brosur.",
   tag:"PSAK 115 (dulu 72)",
   k:"Investor menyesuaikan 'harga kontrak yang diumumkan' dengan retur historis — nilai kontrak 1 triliun dengan retur 15% = ekspektasi 850 miliar, bukan 1 triliun."},
  {l:"Variable consideration: diskon, rabat, retur, bonus/penalti kinerja", v:"VARIABEL", v2:"—", kl:"Lensa kredit",
   d:"Diestimasi dengan expected value atau jumlah paling mungkin (mana yang paling prediktif). Contoh: bonus kinerja 10.000 yang 70% tercapai → ekspektasi 7.000 masuk harga transaksi.",
   tag:"PSAK 115 (dulu 72)",
   k:"Kreditur memakai angka SETELAH variable consideration untuk proyeksi debt service — bonus yang belum pasti bukan kas yang bisa membayar cicilan."},
  {l:"Constraint: variable hanya diakui bila SANGAT PROBABLE tidak ada reversal signifikan", v:"BATAS", v2:"aturan", kl:"Sudut forensik",
   d:"Rem standar terhadap optimisme: kalau masih besar kemungkinan pendapatan harus dikoreksi turun nanti, jangan akui sekarang. Bonus 'hampir pasti' boleh; bonus 'mudah-mudahan' tidak.",
   tag:"PSAK 115 (dulu 72)",
   k:"Pelanggaran klasik: akui bonus penuh di Q4, lalu 'lupa' mereversal saat target meleset. Screen: pendapatan Q4 selalu tertinggi + koreksi misterius di Q1."},
  {l:"Significant financing component: bayar jauh di muka / jauh di belakang → pisahkan unsur bunga", v:"BUNGA", v2:"aturan", kl:"Lensa investasi",
   d:"Kontrak 3 tahun dibayar penuh di muka mengandung pembiayaan dari pelanggan: sebagian kas = bunga, bukan pendapatan. Sebaliknya termin 3 tahun = perusahaan memberi kredit. Praktis: abaikan bila selisih waktu ≤ 1 tahun.",
   tag:"PSAK 115 (dulu 72)",
   k:"Tanpa pemisahan ini, perusahaan padat uang muka terlihat 'pendapatannya' lebih besar — padahal sebagian adalah biaya bunga terselubung."},
  {l:"Channel stuffing: genjot distributor di akhir periode TANPA cadangan retur", v:"RED FLAG", v2:"forensik", kl:"Sudut forensik",
   d:"Modus: paksa distributor serap stok (diskon besar, konsinyasi terselubung), akui penuh sebagai penjualan, 'lupa' estimasi retur (melanggar constraint Langkah 3). Kuartal ini cantik, kuartal depan retur membanjir.",
   tag:"Pola fraud pendapatan",
   k:"Screen: revenue Q4 anomali + piutang melonjak + DSO naik + retur Q1 meledak. Cek juga: apakah distributor pihak berelasi? (Lihat Case Files Kasus 1 — Garuda.)"}
 ]},
l4:{ title:"Langkah 4 — Alokasikan harga transaksi ke tiap kewajiban, proporsional ke standalone selling price (SSP).", cols:["Aturan alokasi","Rumus","Catatan"],
 rows:[
  {l:"Alokasi = harga transaksi × (SSP kewajiban ÷ total SSP)", v:"PROPORSIONAL", v2:"—", kl:"Lensa investasi",
   d:"Setiap kewajiban 'membawa' porsi harga sesuai harga jual berdirinya. Diskon kontrak pun tersebar proporsional — tidak boleh seenaknya ditempel ke satu item.",
   tag:"PSAK 115 (dulu 72)",
   k:"Inilah fondasi forecast analis: porsi tiap kewajiban = jadwal kas yang diakui. Salah alokasi = salah tahun."},
  {l:"SSP = harga jual terpisah yang diobservasi; bila tak ada → estimasi", v:"3 METODE", v2:"estimasi", kl:"Sudut forensik",
   d:"Hierarki estimasi: (1) adjusted market assessment — harga pasar sejenis; (2) expected cost + margin; (3) residual — hanya bila SSP sangat variabel/tak pasti. Residual = harga total − SSP item lain yang diketahui.",
   tag:"PSAK 115 (dulu 72)",
   k:"Metode (3) residual paling rawan: 'sisa' bisa diatur dengan menggelembungkan SSP item lain. Minta rekonsiliasi SSP vs harga katalog tiap tahun."},
  {l:"Surya Nusa (ilustratif): 120.000 × SSP/135.000 → alat 88.889 | instalasi 13.333 | garansi 17.778", v:"88.889 / 13.333 / 17.778", v2:"ilustratif ✓", kl:"Lensa investasi",
   d:"Hitungan: alat 120.000×100.000/135.000 = 88.888,89; instalasi 120.000×15.000/135.000 = 13.333,33; garansi 120.000×20.000/135.000 = 17.777,78. Jumlah = 120.000,00 tepat — foot selalu.",
   tag:"Hitungan modul (angka ilustratif, terverifikasi)",
   k:"Cek analis: jumlah alokasi HARUS = harga transaksi. Selisih satu rupiah = ada yang disembunyikan di pembulatan."},
  {l:"Alokasi agresif: bobot besar ke kewajiban yang diserahkan DULUAN → front-loading", v:"RED FLAG", v2:"forensik", kl:"Sudut forensik",
   d:"Contoh curang (ilustratif): alokasi alat dipatok 110.000 (bukan 88.889) → pendapatan Q1 melonjak +23,75% tanpa satu rupiah kas tambahan. SSP 'diestimasi' ulang tiap tahun agar pola ini bertahan.",
   tag:"Pola fraud pendapatan",
   k:"Screen: liabilitas kontrak (deferred revenue) tipis vs peers + margin kotor item 'terkirim' tak wajar tinggi. Bandingkan SSP antar tahun — SSP yang menari-nari = sinyal."},
  {l:"Diskon kontrak dialokasikan proporsional — kecuali bukti kuat menempel ke 1–2 kewajiban", v:"DISKON", v2:"aturan", kl:"Lensa kredit",
   d:"Pengecualian sempit: bila perusahaan rutin menjual kewajiban itu terpisah dengan diskon serupa, barulah diskon boleh ditempel spesifik. Jika tidak: sebar rata.",
   tag:"PSAK 115 (dulu 72)",
   k:"Kreditur waspada: diskon yang 'ditempel' ke item yang sudah terkirim mempercepat EBITDA akuntansi — covenant bisa lolos di kertas padahal kas tidak."}
 ]},
l5:{ title:"Langkah 5 — Akui pendapatan SAAT (atau SELAMA) kewajiban dipenuhi, yaitu ketika CONTROL beralih ke pelanggan.", cols:["Kriteria","Uji","Catatan"],
 rows:[
  {l:"Control beralih = pelanggan bisa mengarahkan penggunaan & menikmati manfaat aset", v:"CONTROL", v2:"inti", kl:"Lensa investasi",
   d:"Bukan lagi 'risiko & manfaat' ala standar lama — melainkan kendali. Pelanggan yang bisa menjual kembali, memakai, atau menggadaikan barang = control sudah beralih, walau legal title belum pindah.",
   tag:"PSAK 115 (dulu 72)",
   k:"Investor bertanya satu kalimat: 'kalau pelanggan bangkrut besok, barang ini milik siapa?' — jawabannya menentukan tahun pendapatan."},
  {l:"Over time bila SALAH SATU: (a) pelanggan terima & konsumsi bersamaan, (b) aset dikendalikan pelanggan saat dibuat, (c) tanpa alternative use + hak bayar enforceable", v:"3 PINTU", v2:"—", kl:"Lensa kredit",
   d:"Contoh: jasa kebersihan (a), bangun gedung di tanah pelanggan (b), manufaktur komponen custom dengan termin bayar mengikat (c). Lolos satu pintu = akui bertahap sesuai progress.",
   tag:"PSAK 115 (dulu 72)",
   k:"Kreditur proyek konstruksi hidup dari pintu (c): tanpa hak bayar enforceable, 'progress' hanyalah klaim — dan klaim bukan agunan."},
  {l:"Selain itu = point in time. Indikator: hak atas pembayaran, legal title, possession fisik, risiko-manfaat signifikan, acceptance pelanggan", v:"INDIKATOR", v2:"—", kl:"Sudut forensik",
   d:"Tak ada satu indikator yang mutlak — dinilai keseluruhannya. Serah terima alat Surya Nusa (15 Feb): possession + risiko beralih → 88.889 diakui saat itu juga.",
   tag:"PSAK 115 (dulu 72)",
   k:"Forensik menguji tiap indikator: 'acceptance' yang ditandatangani SEBELUM barang dikirim = bill-and-hold terselubung. Minta berita acara + dokumen ekspedisi."},
  {l:"Ukur progress over-time: metode OUTPUT (unit selesai, milestone) atau INPUT (biaya terjadi, jam kerja)", v:"OUTPUT / INPUT", v2:"—", kl:"Lensa investasi",
   d:"Pilih yang paling menggambarkan transfer control, terapkan konsisten. Instalasi Surya Nusa selesai 31 Mar → 13.333 diakui penuh saat itu (output). Garansi 24 bulan → straight-line 740,74/bulan sejak Maret 2026 (instalasi selesai 31 Mar).",
   tag:"PSAK 115 (dulu 72)",
   k:"Metode input rawan 'gelembungkan biaya agar progress naik' — analis membandingkan progress akuntansi vs milestone fisik di lapangan."},
  {l:"Premature recognition — Garuda/Mahata: kontrak 15 tahun ±US$240 jt diakui sebagai pendapatan 2018", v:"KASUS NYATA", v2:"forensik", kl:"Sudut forensik",
   d:"Fakta publik (Case Files Kasus 1): Garuda mengakui ±US$240 juta dari PT Mahata Aero Teknologi (kontrak 15 tahun) sebagai pendapatan 2018 — control 15 tahun 'dialihkan' dalam setahun. OJK & Kemenkeu memberi sanksi Juni 2019; laporan direstate menjadi rugi US$175,0 juta.",
   tag:"Case Files FSA Lab — Kasus 1 Garuda Indonesia",
   k:"Inilah Step 5 yang dilanggar telanjang: kewajiban 15 tahun diakui sekaligus. Screen abadi: piutang pihak berelasi melonjak + laba tanpa kas."},
  {l:"Bill-and-hold & mark-to-market: akui sekarang, serahkan nanti (atau tak pernah)", v:"KASUS NYATA", v2:"forensik", kl:"Sudut forensik",
   d:"Bill-and-hold: barang masih di gudang penjual tapi sudah 'terjual' di kertas (syaratnya ketat: alasan substantif, barang teridentifikasi, siap diserahkan). Mark-to-market ala Enron: estimasi laba SEUMUR kontrak energi diakui di hari kontrak ditandatangani.",
   tag:"Pola fraud pendapatan; Case Files Kasus 2 Enron",
   k:"Enron di Case Files dibedah dari sisi utang SPE — tapi mesin pendapatannya pun bermasalah: laba masa depan diakui di muka. Screen: contract asset membengkak + revenue tumbuh jauh di atas kas."}
 ]},
konsep:{ title:"Konsep kunci: aset vs liabilitas kontrak, dan principal vs agent — dua pasang istilah yang paling sering tertukar.", cols:["Istilah","Makna","Bedanya"],
 rows:[
  {l:"Receivable (piutang): hak TANPA SYARAT atas imbalan — tinggal tunggu waktu", v:"UNCONDITIONAL", v2:"—", kl:"Lensa kredit",
   d:"Faktur sudah terbit, kewajiban sudah dipenuhi, pelanggan tinggal membayar. Inilah satu-satunya dari trio ini yang boleh dijaminkan/di-factoring tanpa catatan.",
   tag:"PSAK 115 (dulu 72)",
   k:"Kreditur menilai receivable sebagai agunan; contract asset bukan — karena masih bersyarat. Salah klasifikasi = agunan semu."},
  {l:"Contract asset: hak BERSYARAT — masih tergantung kinerja masa depan", v:"CONDITIONAL", v2:"—", kl:"Sudut forensik",
   d:"Contoh: instalasi selesai (kewajiban dipenuhi, 13.333 'diperoleh') tapi kontrak baru bisa ditagih setelah garansi tahun pertama lewat. Beda dengan piutang: ada syarat selain berjalannya waktu.",
   tag:"PSAK 115 (dulu 72)",
   k:"Akun ini adalah hak bersyarat atas imbalan setelah kewajiban pelaksanaan dipenuhi — hak yang masih bersyarat selain berlalunya waktu, bukan piutang. Membengkak = pendapatan diakui lebih cepat dari hak tagih — pantau rasionya terhadap revenue tiap kuartal."},
  {l:"Contract liability: kas sudah diterima, kewajiban BELUM dipenuhi (uang muka)", v:"DEFERRED", v2:"—", kl:"Lensa investasi",
   d:"1 Jan Surya Nusa: Dr Kas 120.000 / Cr Liabilitas kontrak 120.000. Setiap pengakuan pendapatan mendebit akun ini. Sisa 31 Des 2026: 10.370,37 (garansi 14 bulan ke depan).",
   tag:"PSAK 115 (dulu 72); hitungan modul ilustratif",
   k:"Investor SUKA liabilitas kontrak tebal: itu pendapatan masa depan yang sudah dibayar — visibilitas terbaik yang bisa dibeli."},
  {l:"Principal vs agent: mengendalikan barang SEBELUM dialihkan → catat BRUTO; hanya mengatur → catat NETO (komisi)", v:"GROSS vs NET", v2:"—", kl:"Sudut forensik",
   d:"Uji control: siapa primary responsible ke pelanggan? siapa menanggung risiko persediaan? siapa menentukan harga? Distributor tiket yang tak mengendalikan tiket = agen → hanya komisinya yang jadi pendapatan.",
   tag:"PSAK 115 (dulu 72)",
   k:"Satu-satunya langkah yang bisa melipatgandakan revenue TANPA menambah laba: pindah dari neto ke bruto. Screen: revenue meledak + margin anjlok + modal kerja tak bergerak."},
  {l:"Enron: booking BRUTO atas trading energi → revenue raksasa, margin tipis", v:"KASUS NYATA", v2:"forensik", kl:"Sudut forensik",
   d:"Enron mencatat nilai penuh transaksi perdagangan energi sebagai pendapatan (seolah prinsipal atas tiap megawatt), sehingga top-line membengkak spektakuler sementara margin menyusut — pola yang juga dipakai menutupi transaksi SPE pihak berelasi.",
   tag:"Fakta publik; Case Files FSA Lab — Kasus 2 Enron",
   k:"Buka Case Files Kasus 2, lalu baca ulang dengan lensa ini: 'pendapatan +150% tapi laba datar' = ciri pendapatan bruto tanpa substansi. Pelajaran: revenue tanpa margin = vanity metric."}
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
        + (r.k && r.k !== "—" ? '<div class="forensic"><strong>'+r.kl+':</strong> '+r.k+'</div>' : '');
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
renderStmt("l1");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Revenue +30% YoY, tapi kas yang ditagih dari pelanggan cuma +2%", q1:"Kualitas pendapatan (cash conversion)", q2:"Risiko premature recognition (Step 5)", a1:"turun", a2:"naik",
  e:"Pendapatan tanpa kas = akrual. Uji Step 5: apakah control benar-benar beralih? Dan Step 1: apakah pelanggan mampu membayar? Pola ini = Garuda 2018 versi mini."},
 {t:"Contract asset naik 3x lipat sementara revenue cuma +10%", q1:"Porsi pendapatan yang 'belum bisa ditagih'", q2:"Kualitas pendapatan", a1:"naik", a2:"turun",
  e:"Contract asset = hak bersyarat. Membengkak = makin banyak pendapatan yang pengakuannya menggantung pada kinerja masa depan — rawan reversal bila proyek seret."},
 {t:"Lini distribusi yang SAMA, tanpa perubahan bisnis, pelaporan beralih dari NETO ke BRUTO", q1:"Revenue tercatat", q2:"Gross margin", a1:"naik", a2:"turun",
  e:"Klasik principal-vs-agent: dari agen jadi 'prinsipal' di kertas → revenue meledak, margin anjlok. Cek: siapa mengendalikan barang dan menanggung risiko persediaan? (Enron.)"},
 {t:"DSO naik 73 → 110 hari dan retur penjualan melonjak di Q4", q1:"Risiko kolektibilitas (Step 1)", q2:"Dugaan channel stuffing", a1:"naik", a2:"naik",
  e:"Distributor 'dipaksa' serap stok akhir tahun tanpa cadangan retur = constraint Langkah 3 dilanggar. Q1 berikutnya: retur membanjir, revenue terkoreksi."},
 {t:"Uang muka pelanggan (contract liability) naik 2x lipat, backlog penuh 6 bulan", q1:"Visibilitas pendapatan masa depan", q2:"Tekanan likuiditas jangka pendek", a1:"naik", a2:"turun",
  e:"Liabilitas kontrak = pendapatan masa depan yang sudah dibayar di muka — kabar baik, asal kewajiban benar-benar dipenuhi sesuai jadwal. Ini 'utang' yang sehat."},
 {t:"Garansi extended 2 tahun dialokasikan hanya 5% dari harga transaksi, padahal SSP-nya ~15%", q1:"Revenue yang diakui di muka (front-loading)", q2:"Liabilitas kontrak vs yang seharusnya", a1:"naik", a2:"turun",
  e:"Alokasi agresif (Step 4): bobot digeser ke kewajiban yang diserahkan duluan. Screen: deferred revenue tipis vs peers + SSP yang berubah-ubah tiap tahun."}
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
    try{ localStorage.setItem("fsa_pg_m34", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Alokasi harga transaksi ke INSTALASI (Rp juta)", hint:"120.000 × 15.000 ÷ 135.000 (ilustratif Surya Nusa)", ans:13333.33, tol:1,
  why:"13.333,33 — porsi instalasi dari harga transaksi 120.000. Foot: 88.888,89 + 13.333,33 + 17.777,78 = 120.000 tepat."},
 {q:"DSO PT Cemerlang Abadi 2025 (hari)", hint:"104.000 ÷ 520.000 × 365 (angka kanonis)", ans:73.0, dec:true, tol:0.5,
  why:"73,0 hari (kanonis). Forensik: DSO yang merangkak naik sementara revenue tumbuh = kolektibilitas Step 1 dipertanyakan."},
 {q:"Cash conversion 2025: kas dari pelanggan ÷ penjualan (%)", hint:"471.000 ÷ 520.000 × 100% (angka kanonis)", ans:90.58, tol:0.5,
  why:"90,6% (kanonis) — dari tiap Rp100 penjualan, Rp90,6 tertagih tunai. Di bawah 80% dua tahun beruntun = red flag kualitas pendapatan."},
 {q:"Pendapatan GARANSI yang diakui selama 2026 (Rp juta)", hint:"17.777,78 ÷ 24 bulan × 10 bulan (ilustratif)", ans:7407.41, tol:1,
  why:"7.407,41 — garansi diakui straight-line 740,74/bulan sejak Maret 2026. Sisa 10.370,37 tetap jadi liabilitas kontrak di akhir 2026."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 13.333,33">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 13.333,33)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — kamu analis ekuitas. Surya Nusa melaporkan revenue 2026 Rp120.000 juta (versi manajemen: semua diakui Q1). Dengan lima langkah yang benar, revenue 2026 = 109.630. Tulis 3 baris: penyesuaian apa yang kamu buat ke forecast, bagaimana valuasimu berubah, dan satu pertanyaan untuk manajemen di earnings call.",
 credit:"Lensa kredit — kamu analis bank. Covenant fasilitas Surya Nusa memakai EBITDA; versi manajemen (110.000 diakui Q1) membuat covenant lolos tipis. Tulis 3 baris: keputusanmu (approve/conditional/decline untuk perpanjangan), 2 covenant yang kamu tulis ulang agar tak bisa diakali timing pengakuan, dan agunan informasi apa yang kamu minta.",
 forensic:"Lensa forensik — buka Case Files Kasus 1 (Garuda) dan Kasus 2 (Enron), lalu kembali ke Surya Nusa. Tulis 3 baris: tiga dokumen/bukti yang kamu minta untuk menguji klaim 'alat sudah diserahkan, kas sudah masuk', langkah PSAK 115 mana yang paling mungkin dilanggar, dan pola angka apa yang kamu pantau 4 kuartal ke depan."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m34_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m34_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"Kontrak Surya Nusa: kas 120.000 diterima di muka, tiga kewajiban belum dipenuhi. Di neraca 1 Jan, 120.000 ini dicatat sebagai…", o:["Piutang usaha — hak menagih yang belum ditagih", "Liabilitas kontrak (contract liability)", "Aset kontrak (contract asset) — imbalan yang belum menjadi hak tanpa syarat", "Beban dibayar di muka — kas untuk jasa yang belum diterima"], a:1},
 {q:"Alokasi ke garansi extended: harga transaksi 120.000; SSP alat 100.000, instalasi 15.000, garansi 20.000. Alokasi garansi = … (Rp juta, ilustratif)", o:["20.000","15.000","40.000","17.778"], a:3},
 {q:"Distributor menjual tiket Rp1.000.000/lembar; ia TIDAK mengendalikan tiket sebelum terjual — promotor menetapkan harga dan menanggung kursi kosong. Pendapatan distributor per tiket = …", o:["Hanya komisinya (neto) — ia agen", "1.000.000 (bruto) — ia mengendalikan tiket", "0 — bukan penjual, tak ada pendapatan", "500.000 — setengah harga tiket"], a:0},
 {q:"Garansi 17.778 diakui straight-line 24 bulan mulai Maret 2026. Pendapatan garansi selama 2026 = … (Rp juta, ilustratif)", o:["8.889","17.778","7.407","5.926"], a:2},
 {q:"Revenue +30% YoY, piutang +80%, contract asset +150%, CFO flat. Bacaan tiga-lensa yang paling tepat…", o:["Kinerja operasional sangat baik — pendapatan tumbuh 30% dan kas menyusul satu-dua kuartal kemudian", "Red flag: pendapatan diakui lebih cepat dari kas — uji Step 5 dan kolektibilitas Step 1", "Efisiensi modal kerja membaik karena piutang dan aset kontrak tumbuh lebih cepat", "Perusahaan siap ekspansi agresif — pertumbuhan pendapatan 30% butuh tambahan modal"], a:1}];
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
           window.FSAMistake.log(34, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Modul 34 Tuntas ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu membedah pendapatan seperti forensik: lima langkah PSAK 115, aset vs liabilitas kontrak, principal vs agent — dan tahu di langkah mana angka bisa disulap. Lanjut ke <a href=\"../modul-35/\">Modul 35 — Konsolidasi & NCI →</a>, atau kembali ke <a href=\"../index.html\">FSA Lab</a>.</p>";
    try{ localStorage.setItem("fsa_gate_m34","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m34") === "lolos"){
    box.style.display = "block";
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m34") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m34") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Modul 34 Tuntas ✓</h3><p>Modul 34 sudah kamu lewati sebelumnya — lanjut ke <a href=\"../modul-35/\">Modul 35</a> atau kembali ke <a href=\"../index.html\">FSA Lab</a>.</p>";
  }
}catch(e){}
})();
