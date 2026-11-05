/* FSA Lab — Case Files: flag-or-pass pada kasus nyata (angka disederhanakan) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var CASES = [
 {name:"Garuda Indonesia", sub:"Pengakuan pendapatan prematur (2016–2018)",
  ctx:"Angka = yang DILAPORKAN perusahaan sebelum restatement. Basis laba: diatribusikan kepada pemilik entitas induk (laba pemilik). Terverifikasi: LK konsolidasian FY2017 (laba & CFO 2016–2017), AR 2018 (pendapatan). Fakta publik: Garuda mengakui ~US$240 jt dari PT Mahata Aero Teknologi (kontrak 15 tahun) sebagai pendapatan 2018; OJK & Kemenkeu sanksi Juni 2019; laporan direstate.",
  years:[
   {y:"2016", rows:[["Pendapatan","US$3.864 jt"],["Laba bersih (pemilik)","US$+8,1 jt"],["CFO","US$+107,5 jt"]], note:"Laba tipis tapi kas sehat. Belum ada sinyal aneh di angka ini.", flag:false},
   {y:"2017", rows:[["Pendapatan","US$4.177 jt"],["Laba bersih (pemilik)","US$(216,6) jt"],["CFO","US$(61,7) jt"]], note:"Rugi besar, kas negatif — polanya konsisten dengan bisnis yang sedang sulit, bukan manipulasi.", flag:false},
   {y:"2018", rows:[["Pendapatan","US$4.373 jt"],["Laba bersih (pemilik)","US$+0,8 jt*"],["Piutang Mahata","US$~240 jt"]], note:"*Sebelum restatement. Tiba-tiba laba dari kontrak 15 tahun yang diakui penuh di tahun pertama.", flag:true}
  ],
  reveal:"<strong>2018 = FLAG.</strong> Setelah restatement resmi, Garuda rugi US$175,0 juta di 2018 (ekspos publik 26 Jul 2019). Screen: piutang pihak berelasi yang melonjak + baca catatan kaki kontraknya. Pelajaran: laba tanpa kas + transaksi afiliasi raksasa = pola revenue fraud."},
 {name:"Enron", sub:"Utang off-balance-sheet via SPE (1998–2000)",
  ctx:"Fakta publik: Enron menyembunyikan utang & kerugian di entitas bertujuan khusus (SPE) yang tidak dikonsolidasi. Bangkrut Desember 2001 — skandal akuntansi terbesar eranya.",
  years:[
   {y:"1998", rows:[["Pendapatan","US$31 M"],["Laba bersih","US$0,7 M"],["Utang tercatat","US$7,4 M"],["CFO","US$1,6 M"]], note:"Tumbuh cepat, angka masih masuk akal.", flag:false},
   {y:"1999", rows:[["Pendapatan","US$40 M"],["Laba bersih","US$0,9 M"],["Utang tercatat","US$8,2 M"],["CFO","US$1,2 M"]], note:"Pendapatan +29%, laba datar. Baca footnote SPE — mulai aneh.", flag:true},
   {y:"2000", rows:[["Pendapatan","US$101 M"],["Laba bersih","US$1,0 M"],["Utang tercatat","US$10,2 M"],["CFO","US$4,8 M"]], note:"Pendapatan +150% tapi laba nyaris datar & utang 'terkendali'. Polanya sama dengan 1999 — asapnya sudah terlihat setahun sebelumnya.", flag:true}
  ],
  reveal:"<strong>1999 & 2000 = FLAG.</strong> 1999 = tangkapan paling awal (+1 bonus). Screen: pendapatan +29% tapi laba datar dan utang tercatat 'terkendali', dengan footnote SPE yang makin tebal — pertumbuhan tanpa laba dan tanpa utang = ada yang disembunyikan. (2000: pola makin ekstrem, +150%; Des 2001 Enron bangkrut.) Pelajaran: kalau bisnis tumbuh pesat tapi laba & utang 'tenang-tenang saja', itu PERTANYAAN bukan vonis — cari di catatan kaki untuk menguji hipotesis (di Enron, ternyata memang disembunyikan di SPE)."},
 {name:"Wirecard", sub:"Kas fiktif €1,9 miliar (2017–2019)",
  ctx:"Fakta publik terverifikasi: Juni 2020 Wirecard mengakui ~€1,9 miliar saldo kas di rekening trust 'kemungkinan tidak ada' (~¼ total aset); auditor EY menolak mensertifikasi LK 2019; insolven diajukan 25 Juni 2020; CEO Markus Braun mundur 19 Juni 2020 (sumber: Wikipedia 'Wirecard', BPB Jerman). Angka ~ disederhanakan untuk pembelajaran.",
  years:[
   {y:"2017", rows:[["Pendapatan","~€1,5 M"],["Laba bersih","~€0,3 M"],["Kas di trust Asia","~€1,0 M"]], note:"Tumbuh pesat; porsi kas 'disimpan' di rekening trust pihak ketiga di Asia — bukan di bank atas nama sendiri.", flag:false},
   {y:"2018", rows:[["Pendapatan","~€2,0 M"],["Laba bersih","~€0,35 M"],["Kas di trust Asia","~€1,0 M+"]], note:"Jan 2019: Financial Times menerbitkan investigasi soal operasi Asia (kantor Singapura); manajemen menuduh wartawan bersekongkol dengan short seller.", flag:true},
   {y:"2019", rows:[["Pendapatan","~€2,8 M*"],["Kas trust yang hilang","€1,9 M"],["Porsi total aset","~¼"]], note:"*Preliminer, tak pernah diaudit. 18 Jun 2020: EY tak menemukan bukti saldo; 22 Jun: perusahaan mengakui kas 'kemungkinan tidak ada'.", flag:true}
  ],
  reveal:"<strong>2018 & 2019 = FLAG.</strong> 2018 = tangkapan paling awal (+1 bonus). Screen: kas raksasa (~€1 M+) 'disimpan' di rekening trust pihak ketiga di Asia — bukan di bank atas nama sendiri — plus investigasi FT atas operasi Asia dan manajemen yang menyerang wartawan alih-alih menjawab. (2019: €1,9 M diakui 'kemungkinan tidak ada'; Jun 2020 insolven.) Pelajaran: kas yang tidak bisa dikonfirmasi langsung ke bank = PERTANYAAN besar, bukan vonis — uji dengan konfirmasi bank independen (di Wirecard, ternyata memang tidak ada)."},
 {name:"Jiwasraya", sub:"Gagal bayar polis & kerugian negara Rp16,81 T (2017–2019)",
  ctx:"Fakta publik terverifikasi: BPK menghitung kerugian negara Rp16,81 triliun (saham Rp4,65 T + reksa dana Rp12,16 T), diumumkan 9 Mar 2020 (sumber: BPK.go.id); gagal bayar klaim JS Saving Plan mulai Rp802 miliar, total klaim gagal bayar Rp12,4 T; ekuitas negatif ~Rp27,24 T (aset ~Rp23,26 T vs kewajiban ~Rp50,5 T). Angka ~ disederhanakan.",
  years:[
   {y:"2017", rows:[["Produk andalan","JS Saving Plan"],["Janji produk","Imbal hasil TETAP"],["Risiko investasi","100% di perusahaan"]], note:"Bukan unit-link: imbal dijamin perusahaan, risiko investasi sepenuhnya di pundak Jiwasraya — profilnya seperti bank tanpa aturan bank.", flag:false},
   {y:"2018", rows:[["Gagal bayar klaim JS Saving Plan","Rp802 M (Nov 2018)"],["Aset","~Rp23 T"],["Kewajiban","~Rp50 T"],["Ekuitas","~Rp(27) T"]], note:"Okt/Nov 2018: klaim jatuh tempo Rp802 M tak dibayar — awal krisis likuiditas. Kewajiban 2× aset; ekuitas negatif. RBC jauh di bawah ambang 120% — butuh ~Rp32,9 T untuk pulih.", flag:true},
   {y:"2019", rows:[["Penyidikan Kejagung","Des 2019"],["Kerugian negara (BPK)","Rp16,81 T"]], note:"Klaim jatuh tempo tak dibayar (sejak Nov 2018); 14 Jan 2020 lima tersangka ditetapkan, tersangka keenam 6 Feb 2020; putusan kasasi MA, Agustus 2021: 2 seumur hidup (Heru Hidayat, Benny Tjokro) + 4 pidana 18–20 tahun (Hendrisman Rahim 20, Hary Prasetyo 20, Syahmirwan 18, Joko Hartono Tirto 18→20). (Sumber: detik.com 25 Agu 2021, antaranews.com)", flag:true}
  ],
  reveal:"<strong>2018 & 2019 = FLAG.</strong> 2018 = tangkapan paling awal (+1 bonus). Screen: gagal bayar klaim Rp802 M (Nov 2018) + kewajiban ~2× aset + ekuitas negatif ~Rp27 T — krisis likuiditas sudah pecah setahun sebelum penyidikan Kejagung. (2019: kerugian negara Rp16,81 T.) Pelajaran: penjamin imbal hasil tetap tanpa aset yang cocok = bom waktu, bukan asuransi."},
 {name:"SNP Finance", sub:"Piutang fiktif & gagal bayar MTN (2016–2018)",
  ctx:"Fakta publik terverifikasi: gagal bayar bunga MTN Rp6,75 miliar (9 & 14 Mei 2018); total MTN Rp1,852 triliun (data KSEI); PKPU Rp4,07 triliun (kredit 14 bank Rp2,22 T + MTN Rp1,85 T, 336 pemegang MTN); rating Pefindo idA (Mar 2018) → SD/Selective Default (Mei 2018); piutang fiktif via penjualan fiktif; auditor Deloitte/SBE beri opini WTP (sumber: Binus Accounting 2018, IRMAPA).",
  years:[
   {y:"2016", rows:[["Rating Pefindo","idA−/Stable"],["Opini audit","WTP (Deloitte)"]], note:"Kertas terlihat bersih: rating A, auditor Big Four. Semua orang percaya.", flag:false},
   {y:"2017", rows:[["MTN diterbitkan","~Rp1,85 T"],["Rating","NAIK → idA (Mar 2018)"]], note:"Piutang melejit didanai MTN; rating malah NAIK — berdasarkan LK yang belakangan terbukti dimanipulasi.", flag:true},
   {y:"2018", rows:[["Gagal bayar bunga MTN","Rp6,75 M"],["Rating","→ SD (Mei 2018)"],["PKPU","Rp4,07 T"]], note:"Mei 2018: gagal bayar bunga dua seri MTN; PKPU: utang 14 bank Rp2,22 T (Mandiri Rp1,4 T) + MTN Rp1,85 T.", flag:true}
  ],
  reveal:"<strong>2017 & 2018 = FLAG.</strong> 2017 = tangkapan paling awal (+1 bonus). Screen: piutang melejit didanai utang baru (MTN ~Rp1,85 T) sementara rating malah NAIK — rating dan opini WTP dibangun di atas LK yang sama. (2018: gagal bayar bunga MTN dua seri; PKPU Rp4,07 T.) Pelajaran: piutang fiktif tak pernah jadi kas — verifikasi langsung ke debitur."},
 {name:"Indosurya", sub:"Pola Ponzi berkedok koperasi (2018–2020)",
  ctx:"Fakta publik terverifikasi: dana kelolaan disebut ~Rp106 triliun, kerugian akibat penggelapan ~Rp15,9 triliun (Bareskrim Polri); gagal bayar mulai Feb 2020 (memo No. 212, 24 Feb 2020: cicil 10 tahun tanpa bunga); MA 16 Mei 2023 (Putusan No. 2113 K/Pid.Sus/2023): Henry Surya 18 tahun penjara + denda Rp15 miliar (tindak pidana perbankan & pencucian uang). Angka ~ disederhanakan.",
  years:[
   {y:"2018", rows:[["Imbal simpanan","8,5–11,5%/th TETAP"],["Pengawas","Kementerian Koperasi"],["Status","sanksi administratif"]], note:"Imbal tetap dua digit tanpa izin bank; Kemenkop sudah jatuhkan sanksi 2018 — sinyal awal yang diabaikan.", flag:false},
   {y:"2019", rows:[["Dana terhimpun","~Rp106 T"],["Disalurkan ke","26 perusahaan cangkang"]], note:"Dana anggota dialirkan ke perusahaan terafiliasi pendiri — bukan dipinjamkan ke anggota koperasi.", flag:true},
   {y:"2020", rows:[["Gagal bayar","Feb 2020"],["Tawaran ke nasabah","cicil 10 th, tanpa bunga"],["Vonis MA (2023)","18 th penjara"]], note:"Memo 212 (24 Feb 2020): penarikan dibatasi, pengembalian mencicil 10 tahun. Putusan MA 16 Mei 2023 (17 Mei = tanggal berita).", flag:true}
  ],
  reveal:"<strong>2019 & 2020 = FLAG.</strong> 2019 = tangkapan paling awal (+1 bonus). Screen: dana ~Rp106 T dialirkan ke 26 perusahaan cangkang terafiliasi — bukan dipinjamkan ke anggota koperasi — plus imbal tetap 8,5–11,5%/th tanpa izin menghimpun dana. (2020: gagal bayar Feb 2020; vonis MA 16 Mei 2023: 18 th.) Pelajaran: kalau imbalnya 'pasti' dan dibayar dari setoran anggota baru, itu bukan investasi — itu antrean."},
 {name:"Luckin Coffee", sub:"Fabricasi penjualan ~RMB 2,2 miliar (2018–2020)",
  ctx:"Fakta publik terverifikasi: laporan anonim 89 halaman dirilis Muddy Waters 31 Jan 2020; Luckin mengakui 2 Apr 2020 (filing 6-K) bahwa COO Jian Liu memfabrikasi ~RMB 2,2 miliar penjualan Q2–Q4 2019; perdagangan saham disuspend Nasdaq 7 Apr 2020; Nasdaq delisting efektif 29 Jun 2020; SEC mengumumkan kesepakatan denda US$180 juta 16 Des 2020; otoritas Tiongkok (SAMR) mendenda RMB 61 juta, Sep 2020. (Sumber: https://techcrunch.com/2020/12/16/luckin-180-million-fine-sec/ · https://www.nasdaq.com/press-release/delisting-of-securities-of-tuesday-morning-corp.-reebonz-holding-limited-taronis · https://kr-asia.com/luckin-coffee-to-investigate-rmb-2-2-million-of-fraudulent-sales-as-share-price-dives-75 · https://en.wikipedia.org/wiki/Luckin_coffee). Angka ~ disederhanakan untuk pembelajaran: jumlah toko, pendapatan, revenue-per-toko, beban penjualan & pemasaran.",
  years:[
   {y:"2018", rows:[["Jumlah toko (akhir thn)","~2.073 toko"],["Pendapatan","~RMB 840 jt"],["Rugi bersih","~RMB 1,62 M"],["Strategi","voucher & kupon besar-besaran"]], note:"Agresif tapi belum ada bukti salah: rugi besar karena bakar kas untuk ekspansi — pola 'normal' startup bakar uang. IPO Nasdaq Mei 2019 di US$17.", flag:false},
   {y:"2019", rows:[["Jumlah toko (akhir thn)","~4.507 toko (+117%)"],["Pendapatan dilaporkan","~RMB 5,1 M (+~6×)"],["Revenue/toko/kuartal (Q3)","~¥450 rb (+79,5% YoY)"],["Harga jual efektif","~46% dari harga tertera — voucher masif"],["Laba operasional per toko (Q3)","pertama kali POSITIF"]], note:"Toko naik ~2× tapi pendapatan naik ~6×; revenue per toko NAIK 79,5% justru saat harga jual efektif jatuh karena voucher; Q3 2019 tiba-tiba 'profitable' di level toko — pertama kali sepanjang sejarah. Angka melawan logika harga.", flag:true},
   {y:"2020", rows:[["Pengakuan fabricasi","RMB ~2,2 M (Q2–Q4 2019), 2 Apr 2020"],["CEO & COO","dipecat Mei 2020"],["Delisting Nasdaq","29 Jun 2020"],["Denda SEC","US$180 jt (16 Des 2020)"]], note:"Semua pecah dalam 8 bulan: pengakuan → pemecatan direksi → delisting → denda. Feb 2021: Luckin mengajukan Chapter 15 bankruptcy di AS (restrukturisasi; operasi Tiongkok tetap jalan).", flag:true}
  ],
  reveal:"<strong>2019 & 2020 = FLAG.</strong> 2019 = tangkapan paling awal (+1 bonus). Screen: <em>revenue-per-store analysis</em> — pendapatan per toko naik 79,5% justru saat harga jual efektif anjlok karena voucher masif; toko bertambah ~2× tapi pendapatan melonjak ~6×; Q3 2019 tiba-tiba 'profitable' di level toko untuk pertama kalinya. Anomali voucher/diskon: pendapatan tumbuh ketika harga efektif turun = pola yang WAJIB diuji (hipotesis: volume/mix/kematangan toko vs fabricasi) (SEC kemudian menemukan database operasional palsu + catatan bank diubah + biaya digelembungkan >US$190 jt). (2020: pengakuan 2 Apr, delisting 29 Jun, denda SEC US$180 jt 16 Des.) Pelajaran triple-lens: <em>forensik</em> — pendapatan melawan logika harga, biaya iklan digelembungkan ~RMB 460 jt untuk 'menyeimbangkan' penjualan fiktif; <em>investor</em> — saham US$50 di Jan 2020 (IPO US$17, Mei 2019) dibeli dengan 'pertumbuhan' yang ~47%-nya fiktif; <em>kreditur</em> — perusahaan menggalang >US$864 juta utang + ekuitas di tengah fabricasi, kas yang dilaporkan menutupi lubang."}
];

function renderTabs(){
  var h = "";
  CASES.forEach(function(c,i){
    h += '<button class="stmt-tab'+(i===0?" active":"")+'" data-c="'+i+'">'+c.name+"</button>";
  });
  $("#cf-tabs").innerHTML = h;
  $$("#cf-tabs .stmt-tab").forEach(function(b){
    b.addEventListener("click", function(){ render(+b.dataset.c); });
  });
}
function render(ci){
  var c = CASES[ci];
  $$("#cf-tabs .stmt-tab").forEach(function(b,j){ b.classList.toggle("active", j===ci); });
  var h = '<div class="pg-card"><h3>'+c.name+'</h3><p class="sub">'+c.sub+'</p><p class="sub" style="font-size:.85rem">'+c.ctx+'</p>';
  c.years.forEach(function(yr, yi){
    h += '<div class="quiz-q" id="cf'+ci+'y'+yi+'"><h3>Tahun '+yr.y+'</h3>';
    h += '<table class="stmt" style="box-shadow:none"><tr><th>Pos</th><th style="text-align:right">Nilai</th></tr>';
    yr.rows.forEach(function(r){ h += '<tr><td>'+r[0]+'</td><td class="val">'+r[1]+'</td></tr>'; });
    h += '</table><p class="sub" style="font-size:.88rem;margin:.5rem 0">'+yr.note+'</p>';
    h += '<div class="pg-opts" style="justify-content:flex-start">'
      + '<button data-c="'+ci+'" data-y="'+yi+'" data-v="flag">🚩 FLAG</button>'
      + '<button data-c="'+ci+'" data-y="'+yi+'" data-v="pass">✓ PASS</button></div>'
      + '<div class="pg-result" id="cfr'+ci+'y'+yi+'"></div></div>';
  });
  h += '<button class="btn btn-primary" id="cf-score">Hitung Skorku</button><div class="pg-result" id="cf-total"></div></div>';
  $("#cf-body").innerHTML = h;
  $$("#cf-body .pg-opts button").forEach(function(b){
    b.addEventListener("click", function(){
      var card = b.closest(".quiz-q");
      card.querySelectorAll(".pg-opts button").forEach(function(x){ x.classList.remove("sel"); });
      b.classList.add("sel");
    });
  });
  try{
    var prev = localStorage.getItem("fsa_cf_"+ci);
    if(prev !== null) $("#cf-total").innerHTML = "<strong>Skor terbaikmu: "+prev+"/7.</strong>";
  }catch(e){}
  $("#cf-score").addEventListener("click", function(){
    var score = 0, unanswered = [], earlyBonus = 0;
    // F04: bonus +1 bila tahun FLAG paling awal tertangkap
    var firstFlagIdx = -1;
    c.years.forEach(function(yr, yi){ if(yr.flag && firstFlagIdx < 0) firstFlagIdx = yi; });
    c.years.forEach(function(yr, yi){
      var sel = document.querySelector('#cf'+ci+'y'+yi+' .pg-opts button.sel');
      var r = $("#cfr"+ci+"y"+yi);
      if(!sel){ unanswered.push(yr.y); r.className = "pg-result show"; r.innerHTML = "Pilih FLAG atau PASS dulu."; return; }
      var v = sel.dataset.v === "flag";
      var pts = 0;
      if(v === yr.flag) pts = 2;
      else if(v && !yr.flag) pts = 0;
      if(yi === firstFlagIdx && v && yr.flag) earlyBonus = 1;
      score += pts;
      r.className = "pg-result show";
      r.innerHTML = v === yr.flag
        ? "<strong>Tepat ("+pts+" poin).</strong>"
        : "<strong>Kurang tepat (0 poin).</strong> Tahun ini seharusnya <strong>"+(yr.flag?"FLAG":"PASS")+"</strong>.";
    });
    var t = $("#cf-total");
    if(unanswered.length){
      t.className = "pg-result show";
      t.innerHTML = "Lengkapi dulu semua tahun ("+unanswered.join(", ")+" belum dijawab) — skor tidak dihitung.";
      t.scrollIntoView({behavior:"smooth", block:"center"});
      return;
    }
    score += earlyBonus;
    var best = score;
    try{
      var prev = parseInt(localStorage.getItem("fsa_cf_"+ci)||"-1", 10);
      best = Math.max(score, prev);
      localStorage.setItem("fsa_cf_"+ci, String(best));
    }catch(e){}
    t.className = "pg-result show";
    var bonusTxt = earlyBonus ? " (+1 bonus tangkapan paling awal)" : "";
    t.innerHTML = "<strong>Total: "+score+"/7 · terbaikmu: "+best+"/7."+bonusTxt+"</strong><br><br>"+c.reveal;
    t.scrollIntoView({behavior:"smooth", block:"center"});
  });
}
renderTabs();
/* Deep-link: /case-files/#garuda dls. memilih tab yang cocok (slug = nama lower, spasi -> ""). */
(function(){
  var slug = (location.hash||"").replace("#","").toLowerCase();
  var idx = 0;
  if(slug){
    for(var i=0;i<CASES.length;i++){
      var nm = CASES[i].name.toLowerCase().replace(/[^a-z]/g,"");
      var first = CASES[i].name.toLowerCase().split(/[^a-z]+/)[0];
      if(nm===slug || first===slug){ idx=i; break; }
    }
  }
  render(idx);
})();
})();
