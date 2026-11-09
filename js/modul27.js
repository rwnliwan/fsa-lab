/* FSA Lab — Modul 27: ESOP & ESG (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
esop:{ title:"ESOP / MSOP — ILUSTRATIF: Cemerlang kanonis TIDAK punya ESOP; andaikan ada MSOP 5 juta opsi", cols:["Pos","Angka (ilustratif)","Keterangan"],
 rows:[
  {l:"PSAK 102 — kapan beban diakui", v:"selama vesting", v2:"bukan saat exercise", d:"PSAK 102 (dulu PSAK 53): beban share-based payment diakui selama periode VESTING berdasar fair value pada grant date. Saat exercise tidak ada beban baru — hanya saham bertambah.", psak:"PSAK 102 (dulu 53)", f:"Perusahaan yang 'lupa' mengakui beban ESOP = laba digelembungkan. Cek CALK: 'beban kompensasi berbasis saham'."},
  {l:"Beban ESOP tahunan (ilustratif)", v:"3.000", v2:"/tahun × 4 thn", d:"Fair value total ilustratif 12.000 ÷ masa vesting 4 tahun = 3.000/tahun. Laba bersih 45.240 tergerus 6,6% SETIAP tahun vesting — sebelum satu opsi pun di-exercise.", psak:"PSAK 102", f:"Beban ini non-kas tapi riil: nilai yang ditransfer ke karyawan. 'Non-kas' ≠ 'gratis'."},
  {l:"Saham beredar + opsi (ilustratif)", v:"105 jt", v2:"100 + 5", d:"Basic: 100 juta saham. Andaikan MSOP 5 juta opsi → fully diluted 105 juta (pendekatan konservatif: seluruh opsi dihitung penuh).", psak:"PSAK 102", f:"—"},
  {l:"Dilusi MAKSIMUM (ilustratif — tanpa treasury stock method)", v:"430,9", v2:"vs basic 452,4", d:"45.240 ÷ 105 = 430,9 — SEMUA 5 jt opsi dihitung penuh sebagai saham baru, tanpa treasury stock method. Ini dilusi MAKSIMUM, BUKAN diluted EPS PSAK 233 (metode baku mengurangkan saham yang \u2018dibeli kembali\u2019 dari proceeds exercise, sehingga tambahan bersih < 5 jt). Turun 4,8% dari basic EPS 452,4. Inilah 'pajak tersembunyi' ESOP bagi pemegang saham lama: laba yang sama dibagi ke lebih banyak kepala.", psak:"PSAK 102", f:"Bandingkan basic vs diluted antar tahun: pelebaran gap = penerbitan opsi agresif."},
  {l:"Treasury stock method", v:"tambahan bersih < 5 jt", v2:"—", d:"Metode baku: dana hasil exercise (5 jt × strike price) DIANGGAP dipakai buyback saham di pasar. Tambahan saham bersih = opsi − saham yang bisa dibeli kembali — selalu LEBIH KECIL dari jumlah opsi.", psak:"PSAK 102", f:"Kalau strike jauh di bawah harga pasar, proceeds kecil → buyback sedikit → dilusi mendekati penuh. Itulah opsi 'in-the-money' dalam."},
  {l:"TSM — contoh numerik: harga pasar rata-rata", v:"5.600", v2:"Rp/saham", d:"Harga pasar rata-rata tertimbang periode berjalan (ilustratif — sama dengan harga saham Cemerlang di M24).", psak:"PSAK 233 (dulu 56)", f:"Harga pasar periode berjalan, bukan harga hari ini — TSM memakai rata-rata periode."},
  {l:"TSM — strike price (grant date)", v:"3.000", v2:"Rp/saham", d:"Strike ditetapkan saat grant, ketika harga pasar masih lebih rendah dari 5.600 kini — karena itu opsi in-the-money.", psak:"PSAK 233 (dulu 56)", f:"—"},
  {l:"TSM — proceeds exercise", v:"15.000", v2:"5 jt × 3.000", d:"5.000.000 opsi × Rp3.000 = Rp15.000 juta kas masuk bila semua di-exercise.", psak:"PSAK 233 (dulu 56)", f:"—"},
  {l:"TSM — saham yang 'dibeli kembali'", v:"2,68 jt", v2:"15.000 ÷ 5.600", d:"Proceeds 15.000 dianggap dipakai buyback pada harga pasar 5.600 → 15.000 ÷ 5.600 = 2,68 juta saham.", psak:"PSAK 233 (dulu 56)", f:"Buyback ini fiktif (asumsi metode) — bukan transaksi nyata."},
  {l:"TSM — tambahan saham bersih", v:"2,32 jt", v2:"5 − 2,68", d:"5,00 − 2,68 = 2,32 juta saham — JAUH di bawah 5 juta penuh. Inilah angka yang masuk penyebut diluted EPS.", psak:"PSAK 233 (dulu 56)", f:"Tambahan bersih < jumlah opsi adalah inti TSM — yang lupa buyback-nya menghitung dilusi berlebih."},
  {l:"TSM — diluted EPS (PSAK 233)", v:"442,1", v2:"45.240 ÷ 102,32", d:"45.240 ÷ (100 + 2,32) = 442,1 — di antara basic 452,4 dan dilusi maksimum 430,9; lebih tinggi 11,2 dari maksimum karena proceeds dianggap buyback. Inilah diluted EPS yang benar menurut PSAK 233, bukan 430,9.", psak:"PSAK 233 (dulu 56)", f:"Bandingkan ketiganya: basic 452,4 > TSM 442,1 > maksimum 430,9 — TSM selalu di tengah."},
  {l:"Repricing opsi", v:"red flag", v2:"—", d:"Harga saham jatuh → perusahaan MENURUNKAN strike price agar opsi 'kembali berharga'. Insentif karyawan pulih — tapi nilai yang hilang dari pemegang saham tidak kembali. Beban akuntansi bisa BERTAMBAH (incremental fair value).", psak:"PSAK 102", f:"Repricing = manajemen menghadiahi diri sendiri atas kegagalan. Cek RUPS: repricing tanpa persetujuan pemegang saham = bau."},
  {l:"Backdating opsi", v:"red flag keras", v2:"—", d:"Grant date dimundurkan ke tanggal harga TERENDAH agar opsi langsung in-the-money. Terlihat seperti 'keberuntungan', padahal manipulasi tanggal — di AS berujung skandal & tuntutan pidana.", psak:"PSAK 102", f:"Pola forensik: grant date selalu di titik harga terendah, berulang-ulang. Probabilitas 'kebetulan' ≈ nol."}
 ]},
esg:{ title:"ESG disclosure — kewajiban emiten Indonesia & standar global", cols:["Aturan","Isi pokok","Status"],
 rows:[
  {l:"POJK 51/POJK.03/2017", v:"laporan keberlanjutan wajib", v2:"RAKB: LJK; laporan: LJK+Emiten+PP", d:"RAKB wajib disusun oleh Lembaga Jasa Keuangan (LJK); LAPORAN KEBERLANJUTAN tahunan wajib diterbitkan oleh LJK, Emiten, dan Perusahaan Publik — terpisah atau bagian dari laporan tahunan. (POJK 51/POJK.03/2017: jangan campur subjek kedua kewajiban ini.)", psak:"POJK 51/2017", f:"Laporan ada tapi isinya templat generik + foto CSR = sinyal greenwashing. Bandingkan angka (emisi, energi) antar tahun — bukan narasinya."},
  {l:"Isi pokok laporan keberlanjutan", v:"E, S, G", v2:"—", d:"Lingkungan (emisi, energi, air, limbah), Sosial (tenaga kerja, K3, masyarakat), Tata kelola (struktur, etik, anti-korupsi). POJK 51 menuntut penjelasan strategi keberlanjutan, bukan sekadar daftar kegiatan CSR.", psak:"POJK 51/2017", f:"Cek konsistensi: klaim 'ramah lingkungan' di laporan vs denda lingkungan di CALK kontinjensi. Kontradiksi = red flag."},
  {l:"IFRS S1", v:"pengungkapan sustainability umum", v2:"efektif 2024 (global)", d:"IFRS S1 (sumber: IFRS Foundation): kerangka umum pengungkapan risiko & peluang terkait sustainability yang memengaruhi prospek arus kas, akses pendanaan, dan biaya modal.", psak:"IFRS S1", f:"S1 memaksa manajemen bicara soal risiko yang DULU bisa disembunyikan di narasi. Baca bagian 'risiko' — di situlah kejujuran diuji."},
  {l:"IFRS S2", v:"pengungkapan terkait iklim", v2:"efektif 2024 (global)", d:"IFRS S2 (sumber: IFRS Foundation): pengungkapan KHUSUS iklim — emisi GRK scope 1-2-3, target transisi, analisis skenario, dan ketahanan strategi bisnis terhadap perubahan iklim.", psak:"IFRS S2", f:"Scope 3 (rantai pasok) adalah tempat angka 'hilang' paling sering. Emisi scope 1 kecil + scope 3 tak diungkap = cerita belum lengkap."},
  {l:"Status adopsi Indonesia", v:"perkembangan berjalan", v2:"—", d:"Sebagai perkembangan (sumber: IFRS Foundation): standar ISSB (S1/S2) diadopsi bertahap lintas yurisdiksi; Indonesia menyiapkan kerangka pengungkapan keberlanjutan yang selaras. Analis WAJIB cek status adopsi TERKINI sebelum mengandalkannya — jangan anggap sudah wajib penuh.", psak:"IFRS S1/S2 · POJK 51/2017", f:"Masa transisi = masa klaim berlebihan. 'Selaras IFRS S2' tanpa assurance eksternal = klaim sepihak."},
  {l:"Kaitan ke analisis kredit/investasi", v:"risiko & biaya modal", v2:"—", d:"Liabilitas imbalan kerja & komitmen ESG (capex hijau, target emisi) adalah KLAIM ATAS KAS MASA DEPAN — mengurangi debt capacity dan menaikkan risiko kredit. Bagi investor: ESG yang buruk = risiko regulasi, denda, dan reputasi yang menekan valuasi.", psak:"—", f:"Tanya kreditur: apakah covenant memperhitungkan capex keberlanjutan wajib? Kalau tidak, headroom covenant menipu."}
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
        + (r.f && r.f !== "—" ? '<div class="forensic"><strong>Lensa forensik:</strong> '+r.f+'</div>' : '');
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
renderStmt("esop");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"MSOP 5 jt opsi: fair value 12.000, vesting 4 thn (ilustratif)", q1:"Beban tahunan", q2:"Laba bersih", a1:"naik", a2:"turun",
  e:"PSAK 102: 12.000 ÷ 4 = 3.000/tahun diakui SELAMA vesting. Beban naik → laba turun 3.000/thn — padahal belum ada satu opsi pun yang di-exercise."},
 {t:"Semua 5 jt opsi di-exercise (ilustratif)", q1:"Saham beredar", q2:"Basic EPS (setelah exercise)", a1:"naik", a2:"turun",
  e:"Saham 100 → 105 juta → basic EPS setelah exercise 45.240 ÷ 105 = 430,9 (vs basic 452,4 sebelum exercise). Ini dilusi MAKSIMUM ilustratif — SEMUA opsi dihitung penuh — BUKAN diluted EPS PSAK 233: metode baku (treasury stock method) menganggap proceeds exercise dipakai buyback, sehingga tambahan bersih < 5 jt dan diluted EPS-nya lebih tinggi dari 430,9."},
 {t:"Harga saham jatuh 40% → strike price di-repricing turun", q1:"Nilai transfer ke karyawan", q2:"Kepercayaan investor", a1:"naik", a2:"turun",
  e:"Repricing menghidupkan kembali opsi yang 'tenggelam' — karyawan diuntungkan atas kegagalan. Pemegang saham menanggung, kepercayaan turun."},
 {t:"Grant date selalu di harga terendah bulan itu", q1:"Probabilitas kebetulan", q2:"Risiko backdating", a1:"turun", a2:"naik",
  e:"Backdating: tanggal grant dimundurkan agar opsi langsung in-the-money. Pola berulang di titik terendah = hampir pasti disengaja."},
 {t:"POJK 51/2017: emiten wajib lapor keberlanjutan", q1:"Biaya kepatuhan", q2:"Risiko reputasi (bila patuh)", a1:"naik", a2:"turun",
  e:"Laporan wajib = biaya (data, assurance, SDM). Imbalannya: risiko reputasi turun bila pengungkapannya jujur dan konsisten antar tahun."},
 {t:"IFRS S2: ungkap emisi scope 1-2-3 + target iklim", q1:"Transparansi risiko iklim", q2:"Biaya modal (jangka panjang)", a1:"naik", a2:"tidak dapat ditentukan",
  e:"Risiko iklim yang terukur = risiko yang bisa dihargai pasar. Transparansi BERPOTENSI menurunkan premi risiko bila pasar menilai risikonya lebih rendah dari dugaan — tapi bila pengungkapan justru mengungkap risiko lebih besar dari dugaan, biaya modal bisa NAIK. Arahnya tidak dapat ditentukan dari pengungkapan saja."}
];
var OPTS3 = ["naik","turun","tetap","tidak dapat ditentukan"];
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
    try{ localStorage.setItem("fsa_pg_m27", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
  }
  $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  r.scrollIntoView({behavior:"smooth", block:"center"});
}
renderPg();

/* ---------- RATIO LAB ---------- */
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
 {q:"Dilusi MAKSIMUM ilustratif (Rp) \u2014 tanpa treasury stock method", hint:"ILUSTRATIF: 45.240 ÷ 105 (100 jt saham + 5 jt opsi MSOP dihitung penuh)", ans:430.9, tol:0.5,
  why:"430,9 — vs basic 452,4. Selisih 4,8% adalah 'pajak tersembunyi' ESOP bagi pemegang saham lama."},
 {q:"Beban ESOP tahunan ilustratif (Rp juta)", hint:"ILUSTRATIF: fair value 12.000 ÷ vesting 4 tahun (PSAK 102)", ans:3000, dec:false, tol:50,
  why:"3.000/tahun selama vesting — diakui SEBELUM ada opsi yang di-exercise. Laba 45.240 tergerus 6,6%/tahun."},
 {q:"Efek dilusi ke EPS, ilustratif (%)", hint:"ILUSTRATIF: ((452,4 − 430,9) ÷ 452,4) × 100", ans:4.76, tol:0.15,
  why:"≈4,8% EPS 'hilang' karena dilusi. Kecil per tahun — tapi penerbitan opsi berulang menumpuk seperti bunga majemuk terbalik."},
 {q:"Tambahan saham dari MSOP ilustratif (%)", hint:"ILUSTRATIF: 5 juta ÷ 100 juta × 100 (pendekatan konservatif, penuh)", ans:5, dec:true, tol:0.2,
  why:"5% — treasury stock method yang baku memberi angka LEBIH KECIL (proceeds dianggap buyback). 5% penuh = batas atas konservatif."},
 {q:"Tambahan saham bersih — treasury stock method (juta saham)", hint:"ILUSTRATIF: 5 − (5 × 3.000 ÷ 5.600)", ans:2.32, dec:true, tol:0.05,
  why:"2,32 jt — bukan 5 jt penuh: proceeds Rp15.000 jt dianggap membeli kembali 2,68 jt saham di harga pasar 5.600."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 430,9">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 430,9)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — beban ilustratif 3.000/thn menekan laba + dilusi 4,8% ke EPS; ESG = biaya kepatuhan vs risiko reputasi. Tulis 3 baris: apakah valuasimu atas Cemerlang berubah, dan kenapa?",
 credit:"Lensa kredit — liabilitas imbalan kerja & komitmen ESG (capex hijau, target emisi) = klaim atas kas masa depan. Tulis 3 baris: debt capacity, coverage, dan apakah covenant perlu disesuaikan.",
 forensic:"Lensa forensik — repricing tanpa RUPS, backdating (grant selalu di harga terendah), greenwashing (narasi vs angka emisi). Tulis 3 cek yang kamu lakukan sebelum percaya."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m27_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m27_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"Fakta kanonis: PT Cemerlang Abadi TIDAK punya ESOP. Maka contoh 'MSOP 5 juta opsi' di modul ini adalah…", o:["Fakta yang dikutip dari CALK 2025 perusahaan","Hasil temuan audit forensik tahun lalu","ILUSTRATIF — andaikan ada, untuk latihan hitung dilusi","Kewajiban lapor ESOP ke OJK"], a:2},
 {q:"Menurut PSAK 102, beban share-based payment diakui…", o:["Selama periode vesting, berdasar fair value pada grant date","Saat opsi di-exercise oleh karyawan yang bersangkutan","Tidak diakui — cukup diungkap di CALK","Hanya bila harga saham naik di atas strike price yang disepakati"], a:0},
 {q:"Dilusi MAKSIMUM ilustratif = 45.240 ÷ 105 (tanpa treasury stock method) sama dengan… (Rp)", o:["452,4","445,0","460,2","430,9"], a:3},
 {q:"Treasury stock method intinya…", o:["Semua opsi karyawan langsung dihitung penuh sebagai saham baru yang beredar tanpa asumsi buyback dari proceeds exercise","Proceeds dari exercise DIANGGAP dipakai buyback saham di pasar — tambahan bersih lebih kecil dari jumlah opsi","Opsi karyawan tidak pernah bersifat dilutif bagi pemegang saham lama perusahaan","Metode ini hanya berlaku untuk opsi yang sudah vesting penuh oleh karyawan"], a:1},
 {q:"POJK 51/2017 mewajibkan…", o:["LJK menyusun RAKB; LJK, Emiten & Perusahaan Publik menerbitkan laporan keberlanjutan","Semua perusahaan di Indonesia wajib menerbitkan laporan keuangan bilingual setiap tahun buku","Hanya BUMN yang wajib melaporkan emisi karbonnya ke KLHK","Semua ESOP wajib diganti dengan bonus tunai bagi karyawan"], a:0}];
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
           window.FSAMistake.log(27, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). ESOP &amp; ESG tuntas — biaya yang tak terlihat kini terlihat.</p><p><a class=\"btn btn-primary\" href=\"../modul-28/\">Lanjut ke Modul 28 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m27","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m27") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m27") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m27") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 27 sudah kamu lewati sebelumnya.</p><p><a class=\"btn btn-primary\" href=\"../modul-28/\">Lanjut ke Modul 28 →</a></p>";
  }
}catch(e){}
})();
