/* FSA Lab — Modul 36: Stock-Based Compensation & EPS (lensa TRIPLE; contoh baru = ILUSTRATIF berlabel) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
sbc:{ title:"Beban SBC: opsi karyawan PT Teknologi Maju (FIKTIF) — fair value Rp9.000 juta, vesting 3 tahun. Angka ILUSTRATIF (Rp juta).", cols:["Langkah","Angka","Standar"],
 rows:[
  {l:"Grant: fair value diukur SEKALI, lalu diamortisasi selama vesting", v:"9.000 ÷ 3 = 3.000/thn", v2:"PSAK 102",
   d:"PSAK 102 (dulu PSAK 53, setara IFRS 2) mewajibkan entitas mengakui beban jasa karyawan yang dibayar dengan ekuitas sebesar FAIR VALUE instrumen pada tanggal pemberian (grant date). PT Teknologi Maju memberi opsi senilai 9.000 (ilustratif) dengan masa vesting 3 tahun (service condition): beban diakui 3.000 per tahun — BUKAN saat opsi diberikan, BUKAN saat dieksekusi. Logikanya: beban mengikuti JASA yang diberikan karyawan, dan jasa itu mengalir selama 3 tahun.",
   tag:"PSAK 102 (dulu PSAK 53) · IFRS 2",
   k:"Lensa forensik: beban SBC 'kecil tiap tahun' tapi total 9.000 — jumlahkan seluruh grant yang beredar (overhang), bukan cuma beban tahun berjalan."},
  {l:"Jurnal tahunan: beban diakui, kas belum bergerak", v:"Dr 3.000 / Cr 3.000", v2:"PSAK 102",
   d:"Jurnal tiap tahun selama vesting: Dr beban kompensasi karyawan 3.000 / Cr modal disetor — agio saham 3.000 (ilustratif). Tidak ada kas keluar; ekuitas naik di sisi agio. Saat opsi dieksekusi nanti: Dr kas (hasil exercise) + Dr agio / Cr modal saham. Catatan: bila karyawan resign sebelum vesting (forfeiture), beban yang sudah diakui DIBALIK (true-up) — beban kumulatif hanya untuk instrumen yang benar-benar vest.",
   tag:"Jurnal ilustratif modul",
   k:"Lensa kredit: SBC menambah ekuitas TANPA kas masuk — analis konservatif memisahkannya dari 'modal disetor tunai' saat menilai kualitas permodalan."},
  {l:"Vesting dipercepat / kondisi kinerja: beban bisa melonjak tiba-tiba", v:"9.000 sekaligus", v2:"PSAK 102",
   d:"Bila masa vesting dipersingkat (repricing) atau kondisi kinerja tercapai lebih cepat, sisa beban yang belum diakui (mis. 6.000) diakui SEKALIGUS — laba tahun itu anjlok padahal operasi normal. Sebaliknya, opsi yang hangus (tidak vest) membalik beban yang sudah dicatat. Inilah kenapa analis membaca catatan 'rincian opsi beredar + masa vesting', bukan cuma satu angka beban di laba rugi.",
   tag:"Mekanisme PSAK 102",
   k:"Lensa investasi: lonjakan beban SBC satu tahun BUKAN sinyal operasi memburuk — pisahkan dari laba inti sebelum menilai tren."},
  {l:"SBC dan arus kas: addback non-kas di CFO", v:"+3.000 ke CFO", v2:"aturan",
   d:"Beban SBC 3.000 adalah beban NON-KAS: di laporan arus kas (metode tidak langsung) ia DIADD-BACK ke laba — CFO sudah 'bersih' dari SBC. Tapi valuasi FCFE/FCFF yang dibangun manual dari EBIT atau laba HARUS menambahkan kembali SBC, kalau tidak nilai perusahaan under-valued 3.000 per tahun (ilustratif). Aturan: setiap model DCF dari perusahaan teknologi WAJIB punya baris '+ beban SBC' — lupa = salah hitung.",
   tag:"Aturan FSA Lab: addback SBC di model kas",
   k:"Lensa investasi: perusahaan yang SBC-nya besar TAPI tak pernah add-back di presentasi investor = menyembunyikan biaya tenaga kerja riil. Cek rekonsiliasi non-GAAP mereka."}
 ]},
waso:{ title:"Rata-rata tertimbang saham beredar (WASO): 190 juta penuh setahun + 20 juta sejak 1 Juli. Angka ILUSTRATIF.", cols:["Komponen","Perhitungan","Hasil"],
 rows:[
  {l:"Saham awal tahun: beredar penuh 12 bulan", v:"190 × 12/12", v2:"190 juta",
   d:"190 juta lembar beredar sejak 1 Januari 2025 (ilustratif) — bobot penuh 12/12. WASO memakai bobot WAKTU: saham yang beredar hanya sebagian tahun dihitung proporsional. Ini mencegah 'pompa EPS' dengan menerbitkan saham di akhir tahun lalu mengklaim penyebut kecil.",
   tag:"PSAK 233 (dulu PSAK 56) · IAS 33",
   k:"Lensa forensik: penerbitan saham 31 Desember untuk 'mempercantik' rasio per 31 Desember = cek WASO, bukan saldo akhir."},
  {l:"Penerbitan 1 Juli: bobot 6 bulan", v:"20 × 6/12", v2:"10 juta",
   d:"20 juta lembar diterbitkan 1 Juli 2025 (ilustratif) — beredar 6 dari 12 bulan → kontribusi 10 juta ke WASO. Rumus umum: jumlah saham × (bulan beredar ÷ 12). Stock split/bonus issue diperlakukan RETROAKTIF (seolah sejak awal periode paling awal yang disajikan) — bukan proporsional.",
   tag:"PSAK 233 (dulu PSAK 56) · IAS 33",
   k:"Lensa investasi: rights issue di tengah tahun mengencerkan EPS tahun berjalan hanya separuh — proyeksikan tahun penuh bila menilai run-rate."},
  {l:"WASO total: penyebut basic EPS", v:"190 + 10", v2:"200 juta",
   d:"WASO = 200 juta lembar (ilustratif). Basic EPS = laba bersih 60.000 ÷ 200 = Rp300. Footing: 190 + 10 = 200. ✓ Laba yang dipakai = laba setelah beban SBC 3.000 — SBC sudah memotong pembilang, lalu opsi yang sama menambah penyebut: dilusi ganda bila tak diwaspadai.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa investasi: basic EPS Rp300 adalah TITIK AWAL — belum mencerminkan 24 juta opsi yang menunggu dieksekusi."},
  {l:"Buyback: mengurangi WASO (kebalikan penerbitan)", v:"−bobot waktu", v2:"aturan",
   d:"Saham treasuri yang dibeli kembali DIKURANGKAN dari WASO dengan bobot waktu yang sama. Buyback 10 juta lembar pada 1 Oktober → WASO berkurang 10 × 3/12 = 2,5 juta. Buyback menaikkan EPS secara mekanis TANPA mengubah operasi — analis memisahkan 'pertumbuhan EPS organik' dari 'EPS hasil buyback'.",
   tag:"PSAK 233 · IAS 33",
   k:"Lensa forensik: EPS naik + kas turun + utang naik = pertumbuhan EPS yang dibeli dengan leverage, bukan kinerja."}
 ]},
tsm:{ title:"Treasury stock method: 24 juta opsi @Rp200, harga pasar rata-rata Rp400. Angka ILUSTRATIF.", cols:["Langkah","Hitungan","Hasil"],
 rows:[
  {l:"Langkah 1 — hasil exercise hipotetis (proceeds)", v:"24 × 200", v2:"4.800",
   d:"Asumsikan SEMUA 24 juta opsi dieksekusi (ilustratif): perusahaan menerima 24 juta × Rp200 = Rp4.800 juta. Metode ini bernama 'treasury stock' karena hasil exercise DIANGGAP dipakai membeli kembali saham sendiri (treasuri) pada harga pasar rata-rata periode berjalan.",
   tag:"PSAK 233 (dulu PSAK 56) · IAS 33",
   k:"Lensa investasi: proceeds 4.800 adalah kas hipotetis — ia TIDAK masuk laba; ia hanya alat hitung penyebut."},
  {l:"Langkah 2 — saham yang bisa dibeli kembali", v:"4.800 ÷ 400", v2:"12 juta",
   d:"Dengan Rp4.800 juta, pada harga pasar rata-rata Rp400/lembar, perusahaan bisa membeli kembali 12 juta lembar (ilustratif). Inilah 'efek bersih' metode ini: opsi menambah saham, tapi sebagian 'dinetralkan' oleh pembelian kembali hipotetis.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa investasi: makin TINGGI harga pasar vs exercise, makin SEDIKIT saham yang bisa dibeli kembali → dilusi makin besar. Reli harga saham MEMPERBURUK dilusi."},
  {l:"Langkah 3 — tambahan saham dilutif bersih", v:"24 − 12", v2:"12 juta",
   d:"Tambahan bersih = 24 − 12 = 12 juta lembar (ilustratif). Diluted shares = 200 + 12 = 212 juta. Diluted EPS = 60.000 ÷ 212 = Rp283,0 (vs basic Rp300). Dilution drag = Rp17 (≈5,7%). Footing: 200 + 12 = 212. ✓",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa investasi: selisih 5,7% ini yang memisahkan 'P/E 20,0x' (basic) dari 'P/E 21,2x' (diluted) — murah palsu bila pakai basic."},
  {l:"Anti-dilutif: opsi out-of-the-money DIKELUARKAN", v:"exercise 500 > 400", v2:"aturan",
   d:"Opsi dengan harga exercise Rp500 saat harga pasar Rp400 (ilustratif) bersifat ANTI-DILUTIF — bila dimasukkan, EPS justru NAIK. PSAK 233 melarang memasukkannya ke diluted EPS. Analis waspada: opsi yang hari ini anti-dilutif bisa menjadi dilutif BESOK bila harga saham reli melewati 500 — baca strike price di catatan, bukan cuma angka diluted shares.",
   tag:"PSAK 233 · IAS 33",
   k:"Lensa forensik: 'diluted EPS kami hanya turun 2%' + 50 juta opsi out-of-the-money di catatan = bom waktu dilusi saat harga reli."}
 ]},
mult:{ title:"Dampak ke multiples: harga saham Rp6.000 — basic vs diluted P/E. Angka ILUSTRATIF.", cols:["Ukuran","Hitungan","Hasil"],
 rows:[
  {l:"P/E dengan basic EPS: terlihat murah", v:"6.000 ÷ 300", v2:"20,0x",
   d:"P/E = 20,0x bila memakai basic EPS Rp300 (ilustratif). Ini angka yang muncul di headline dan screener — dan ia MENGABAIKAN 24 juta opsi yang beredar. Analis yang berhenti di sini membayar harga 'murah' yang belum termasuk tagihan dilusi.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa investasi: screener P/E memakai basic EPS — selalu hitung ulang dengan diluted sebelum bandingkan antar emiten."},
  {l:"P/E dengan diluted EPS: harga yang jujur", v:"6.000 ÷ 283,0", v2:"21,2x",
   d:"P/E = 21,2x dengan diluted EPS (ilustratif) — 6% lebih mahal dari versi basic. Untuk perusahaan teknologi dengan SBC besar, P/E diluted adalah SATU-SATUNYA basis perbandingan yang fair. Selisih 1,2x multiple ini = premi yang kamu bayar tanpa sadar bila memakai basic.",
   tag:"Hitungan modul (angka ilustratif)",
   k:"Lensa kredit: covenant berbasis 'EPS' tanpa kualifikasi = tanyakan basisnya — basic vs diluted bisa menentukan lolos/gagal."},
  {l:"SBC dalam valuasi: dua penyesuaian wajib", v:"+3.000 & −dilusi", v2:"aturan",
   d:"(1) Arus kas: add-back beban SBC 3.000 ke FCFE (non-kas) — TAPI (2) jangan lupa biaya ekonominya: dilusi 12 juta saham ≈ 5,7% nilai per saham. Praktik analis yang benar: DCF per saham memakai jumlah saham DILUTED (212 juta), bukan WASO (200 juta). Lupa salah satu = salah dua arah.",
   tag:"Aturan FSA Lab: SBC double-adjustment",
   k:"Lensa forensik: 'FCF kami kuat' + SBC 15% dari revenue + tidak ada buyback penyeimbang = pemegang saham lama didilusi diam-diam tiap tahun."},
  {l:"Guidance manajemen: waspadai basis EPS yang dipilih", v:"basic vs diluted", v2:"peringatan",
   d:"Manajemen cenderung memandu dengan basic EPS (lebih tinggi) atau 'adjusted EPS' yang mengeluarkan SBC SEKALIGUS (pembilang dibesarkan, penyebut dikecilkan — double count keuntungan). Uji: minta guidance dalam diluted EPS GAAP, lalu bandingkan dengan adjusted. Selisih yang melebar tiap tahun = kualitas laba menurun.",
   tag:"Praktik umum (peringatan)",
   k:"Lensa investasi: 'adjusted EPS naik 20%' sementara diluted GAAP EPS datar = pertumbuhannya berasal dari penyesuaian, bukan operasi."}
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
renderStmt("sbc");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Repricing: harga exercise opsi diturunkan Rp200 → Rp150 (ilustratif)", q1:"Saham dilutif tambahan (TSM)", q2:"Diluted EPS", a1:"naik", a2:"turun",
  e:"Proceeds turun (24×150=3.600) → buyback hipotetis menyusut (3.600÷400=9) → tambahan bersih naik 24−9=15 juta. Penyebut membesar → diluted EPS turun. Repricing = transfer nilai ke karyawan."},
 {t:"Vesting dipercepat 3 tahun → 1 tahun (ilustratif)", q1:"Beban SBC tahun berjalan", q2:"Laba bersih tahun berjalan", a1:"naik", a2:"turun",
  e:"Sisa beban 6.000 diakui sekaligus tahun ini (total 9.000 vs 3.000). Laba anjlok padahal operasi normal — pisahkan dari laba inti."},
 {t:"Opsi baru diterbitkan dengan exercise Rp500, harga pasar Rp400 (ilustratif)", q1:"Saham dilutif (diluted shares)", q2:"Diluted EPS", a1:"tetap", a2:"tetap",
  e:"Out-of-the-money = anti-dilutif → DIKELUARKAN dari hitungan PSAK 233. Tapi catat strike-nya: reli harga melewati 500 mengaktifkan dilusi ini."},
 {t:"Buyback 10 juta saham pada 1 Oktober (ilustratif)", q1:"Basic EPS", q2:"Kas perusahaan", a1:"naik", a2:"turun",
  e:"WASO turun 10×3/12=2,5 juta → penyebut mengecil → EPS naik mekanis. Kas keluar untuk buyback — EPS naik + kas turun = cek sumber dananya."},
 {t:"Harga pasar rata-rata naik Rp400 → Rp600 (ilustratif)", q1:"Saham dilutif tambahan (TSM)", q2:"Diluted EPS", a1:"naik", a2:"turun",
  e:"Buyback hipotetis menyusut (4.800÷600=8) → tambahan bersih naik 24−8=16 juta. Reli harga MEMPERBURUK dilusi — paradoks yang sering luput."},
 {t:"SBC dibayar tunai (bonus kas), bukan opsi saham (ilustratif)", q1:"Beban SBC di laba rugi", q2:"Arus kas operasi (CFO)", a1:"tetap", a2:"turun",
  e:"Beban 3.000 tetap diakui (jasa diterima). Bedanya: kas KELUAR 3.000 → add-back non-kas hilang, CFO turun 3.000. Opsi = dilusi pemegang saham; bonus kas = kas keluar — pilih racunmu."}
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
    try{ localStorage.setItem("fsa_pg_m36", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
      if(parts.length > 2) return NaN;  // F3: 1.2.3 ditolak
      if(parts.length === 2 && parts[1].length === 3 && parts[0] !== "0" && parts[0] !== "-0"){
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
 {q:"Beban SBC tahunan (Rp juta)", hint:"Fair value 9.000 ÷ vesting 3 tahun (ilustratif)", ans:3000, dec:false, tol:1,
  why:"3.000 — PSAK 102: fair value grant date diamortisasi selama periode vesting, bukan saat grant/exercise."},
 {q:"Basic EPS (Rp)", hint:"Laba 60.000 ÷ WASO 200 juta (ilustratif)", ans:300, dec:false, tol:1,
  why:"Rp300 — titik awal; belum mencerminkan 24 juta opsi yang beredar."},
 {q:"Diluted EPS (Rp, 1 desimal)", hint:"60.000 ÷ (200 + 12) juta — TSM: 24 − (24×200÷400) (ilustratif)", ans:283.0, dec:false, tol:0.6,
  why:"Rp283,0 — 60.000 ÷ 212. Dilution drag Rp17 (≈5,7%) vs basic."},
 {q:"FCFE dengan addback SBC (Rp juta)", hint:"CFO 55.000 − capex 25.000 + net borrowing 1.500 (ilustratif)", ans:31500, dec:false, tol:1,
  why:"31.500 — CFO sudah termasuk add-back SBC 3.000 (non-kas). Tanpa add-back = 28.500: under-value 3.000."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 3.000">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 3.000)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — kamu menilai saham PT Teknologi Maju (FIKTIF). Basic EPS Rp300, diluted Rp283, P/E 20,0x vs 21,2x (harga 6.000), SBC 3.000/thn. Tulis 3 baris: EPS mana yang kamu pakai untuk valuasi + kenapa, bagaimana kamu memperlakukan SBC di model DCF-mu (add-back? penyesuaian saham?), keputusanmu (beli / tunggu / hindari).",
 credit:"Lensa kredit — perusahaan mengajukan pinjaman. Ekuitas naik tiap tahun dari agio SBC (tanpa kas masuk), diluted shares 212 juta vs WASO 200 juta. Tulis 3 baris: ukuran permodalan mana yang kamu pakai (dengan / tanpa agio SBC) + alasan, satu covenant terkait penerbitan opsi/buyback yang kamu minta, keputusanmu.",
 forensic:"Lensa forensik — sebelum ACC, angka mana yang kamu verifikasi ulang? Tulis 3 baris: basis EPS yang kamu kutip (basic / diluted) + sumbernya, satu hal di catatan opsi (strike, vesting, overhang) yang kamu uji, dan satu temuan yang membuatmu menolak mentah-mentah."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m36_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m36_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"PT Teknologi Maju memberi opsi karyawan senilai Rp9.000 juta dengan vesting 3 tahun (ilustratif). Menurut PSAK 102 (dulu PSAK 53), beban SBC diakui…", o:["Penuh Rp9.000 juta saat opsi diberikan (grant date) — jasa dianggap diterima di muka", "Saat karyawan mengeksekusi opsi — beban diakui mengikuti kas yang diterima", "Selama periode vesting, mengikuti jasa yang diberikan — 3.000 per tahun", "Hanya bila harga saham naik di atas exercise price — opsi out-of-the-money tidak diakui"], a:2},
 {q:"Jurnal tahunan beban SBC Rp3.000 juta (ilustratif) yang TEPAT…", o:["Tidak ada jurnal sampai opsi dieksekusi — cukup diungkap di catatan", "Dr kas 3.000 / Cr beban kompensasi 3.000 — beban dibayar tunai", "Dr modal saham 3.000 / Cr kas 3.000 — dianggap pembelian kembali saham", "Dr beban kompensasi 3.000 / Cr modal disetor — agio saham 3.000"], a:3},
 {q:"24 juta opsi @Rp200, harga pasar rata-rata Rp400 (ilustratif). Tambahan saham dilutif dengan treasury stock method = …", o:["24 juta","12 juta","36 juta","6 juta"], a:1},
 {q:"Harga saham Rp6.000, basic EPS Rp300, diluted EPS Rp283 (ilustratif). P/E yang dipakai analis konservatif…", o:["21,2x — memakai diluted EPS", "20,0x — memakai basic EPS yang lebih lazim dipakai", "0,1x — dari 6.000 ÷ 60.000 (salah rumus)", "Keduanya sama saja"], a:0},
 {q:"Opsi dengan exercise Rp500 saat harga pasar Rp400 (ilustratif). Perlakuan di diluted EPS…", o:["Tetap dimasukkan — semua opsi dihitung","Dihitung dengan metode if-converted","Dikeluarkan — bersifat anti-dilutif","Menambah laba bersih pembilang"], a:2}];
(function(){
  var h = "";
  QUIZ.forEach(function(q,i){
    h += '<div class="quiz-q" id="qq'+i+'"><h3>'+(i+1)+'. '+q.q+'</h3>';
    q.o.forEach(function(o,j){
      h += '<label><input type="radio" name="q'+i+'" value="'+j+'"> '+o+'</label>';
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
           window.FSAMistake.log(36, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Modul 36 Tuntas ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu bisa mencatat beban SBC sesuai PSAK 102, menghitung WASO dan diluted EPS dengan treasury stock method (PSAK 233), dan memakai basis EPS yang jujur untuk multiples. Lanjut ke <a href=\"../modul-37/\">Modul 37 — Inventory &amp; Long-Lived Asset Methods →</a>, atau kembali ke <a href=\"../index.html\">FSA Lab</a>.</p>";
    try{ localStorage.setItem("fsa_gate_m36","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m36") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m36") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m36") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Modul 36 Tuntas ✓</h3><p>Modul 36 sudah kamu lewati sebelumnya — lanjut ke <a href=\"../modul-37/\">Modul 37</a> atau kembali ke <a href=\"../index.html\">FSA Lab</a>.</p>";
  }
}catch(e){}
})();
