/* FSA Lab — Modul 2: Kualitas Laba & Arus Kas (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
is:{ title:"Income Statement 2025 (Rp juta) — 2024 sebagai pembanding", cols:["Pos","2025","2024"],
 rows:[
  {l:"Penjualan", v:"520.000", v2:"400.000", d:"Tumbuh +30% YoY. Diakui via model 5 langkah PSAK 115.", psak:"PSAK 115 (dulu 72) = IFRS 15", f:"Tumbuh 30% tapi piutang tumbuh 89% — penjualan tidak tertagih. Cek syarat pengakuan langkah 1–2: kontrak & kewajiban pelaksanaan."},
  {l:"Harga Pokok Penjualan (HPP)", v:"(338.000)", v2:"(264.000)", d:"FIFO/rata-rata; LIFO dilarang di PSAK.", psak:"PSAK 202 (dulu 14)", f:"Gross margin naik 34%→35%: 182/520=35,0% vs 136/400=34,0%. Naik tipis — tidak aneh."},
  {l:"Laba kotor", v:"182.000", v2:"136.000", d:"Margin 35,0% (2024: 34,0%).", psak:"—", f:"—"},
  {l:"Beban operasi", v:"(110.000)", v2:"(88.000)", d:"Naik 25% — lebih lambat dari penjualan (+30%).", psak:"—", f:"Beban tumbuh LEBIH LAMBAT dari penjualan = kemungkinan kapitalisasi beban atau penundaan pengakuan."},
  {l:"Laba operasi", v:"72.000", v2:"48.000", d:"+50% YoY.", psak:"—", f:"—"},
  {l:"Beban bunga", v:"(14.000)", v2:"(10.000)", d:"Coverage 5,14x — masih aman.", psak:"—", f:"—"},
  {l:"Laba sebelum pajak", v:"58.000", v2:"38.000", d:"Titik transisi: setelah baris ini hanya pajak yang memisahkan dari laba bersih.", psak:"—", f:"—"},
  {l:"Beban pajak", v:"(12.760)", v2:"(8.360)", d:"Tarif efektif 22% — konsisten.", psak:"PSAK 212 (dulu 46)", f:"—"},
  {l:"LABA BERSIH", v:"45.240", v2:"29.640", d:"+53% YoY. Net margin 8,7%.", psak:"—", f:"Laba +53% tapi CFO −30%. Inilah inti modul: laba akrual vs kas."}
 ]},
bs:{ title:"Balance Sheet 31 Des 2025 (Rp juta)", cols:["Pos","2025","2024"],
 rows:[
  {l:"Kas dan setara kas", v:"21.440", v2:"33.200", d:"Turun 11.760 — padahal laba naik.", psak:"—", f:"Kas turun saat laba naik = alarm pertama kualitas laba."},
  {l:"Piutang usaha", v:"104.000", v2:"55.000", d:"+89% YoY. DSO 2025 = 73 hari (2024: 50 hari).", psak:"PSAK 109 (dulu 71) — ECL", f:"RED FLAG utama: piutang tumbuh +89,1% — sekitar 3x LAJU pertumbuhan penjualan (+30,0%), bukan 3x penjualan. Fiktif? Channel stuffing? Cek umur piutang & cadangan ECL."},
  {l:"Persediaan", v:"96.000", v2:"80.000", d:"+20%.", psak:"PSAK 202 (dulu 14)", f:"—"},
  {l:"Total aset lancar", v:"221.440", v2:"168.200", d:"Sumber daya yang menjadi kas dalam 12 bulan.", psak:"—", f:"—"},
  {l:"Aset tetap neto", v:"230.000", v2:"210.000", d:"Capex kas 48.000 (+ aset hak-guna 2.000) > depresiasi 30.000 = ekspansi.", psak:"PSAK 216 (dulu 16)", f:"—"},
  {l:"TOTAL ASET", v:"451.440", v2:"378.200", d:"272.000 + 179.440 = 451.440 ✓", psak:"—", f:"—"},
  {l:"Utang usaha", v:"62.000", v2:"50.000", d:"DPO = 67 hari.", psak:"—", f:"—"},
  {l:"Utang bank jangka pendek", v:"31.440", v2:"30.000", d:"Naik tipis — tapi utang pajak & akrual muncul 8.560.", psak:"—", f:"Pola bahaya: laba naik, kas turun, utang naik = gali lubang tutup lubang."},
  {l:"Utang pajak & beban akrual", v:"8.560", v2:"0", d:"Kewajiban pajak & akrual — non-pendanaan.", psak:"PSAK 212/237", f:"Akrual naik = cek kualitas: akrual adalah tempat manajemen menyimpan 'cadangan'."},
  {l:"Total liabilitas lancar", v:"102.000", v2:"80.000", d:"Current ratio 2,17x.", psak:"—", f:"—"},
  {l:"Utang bank jangka panjang", v:"110.000", v2:"100.000", d:"Jadwal jatuh tempo ada di catatan — refinancing wall adalah risiko kredit utama.", psak:"—", f:"—"},
  {l:"Liabilitas sewa", v:"60.000", v2:"58.000", d:"PSAK 116.", psak:"PSAK 116 (dulu 73)", f:"—"},
  {l:"TOTAL LIABILITAS", v:"272.000", v2:"238.000", d:"Debt/equity = 1,52x (2024: 1,70x) — membaik di kertas.", psak:"—", f:"Membaik karena ekuitas naik dari laba akrual — bukan dari kas."},
  {l:"Modal disetor", v:"100.000", v2:"100.000", d:"Tidak berubah.", psak:"—", f:"—"},
  {l:"Laba ditahan", v:"79.440", v2:"40.200", d:"40.200 + 45.240 − 6.000 = 79.440 ✓", psak:"—", f:"—"},
  {l:"TOTAL EKUITAS", v:"179.440", v2:"140.200", d:"Naik dari laba akrual, bukan dari kas. Kualitas ekuitas = kualitas laba.", psak:"—", f:"—"},
  {l:"Laporan perubahan ekuitas (ringkas)", v:"40.200 → 79.440", v2:"—", d:"40.200 + 45.240 − 6.000 = 79.440 ✓. Laba ditahan naik dari laba akrual — bukan dari kas.", psak:"PSAK 201 (dulu 1)", f:"Cek OCI: kerugian yang diparkir di ekuitas tanpa lewat laba rugi."},
  {l:"Paket laporan lengkap (2.4)", v:"7 komponen", v2:"—", d:"IS + BS + arus kas + perubahan ekuitas + CALK + MD&A + opini auditor. Catatan (CALK) memuat jadwal utang, covenant, dan pihak berelasi — dokumen utama analis kredit.", psak:"PSAK 201 (dulu 1)", f:"Opini going-concern = sinyal kredit langsung; auditor mengundurkan diri = alarm forensik."}
 ]},
cf:{ title:"Cash Flow 2025 (Rp juta)", cols:["Pos","2025","2024"],
 rows:[
  {l:"Laba bersih", v:"45.240", v2:"29.640", d:"Titik awal.", psak:"PSAK 207 (dulu 2)", f:"—"},
  {l:"Depresiasi", v:"30.000", v2:"26.000", d:"Non-kas, ditambah kembali.", psak:"—", f:"—"},
  {l:"Perubahan modal kerja", v:"(44.440)", v2:"(11.640)", d:"Piutang +49.000 & persediaan +16.000, diimbangi utang & akrual +20.560.", psak:"—", f:"Inilah pembunuhnya: pertumbuhan semu yang dibiayai piutang."},
  {l:"Arus kas operasi (CFO)", v:"30.800", v2:"44.000", d:"−30% YoY. CFO/NI = 0,68x (< 1 = warning).", psak:"PSAK 207", f:"CFO/NI 0,68x — turun dari 1,48x di 2024. Pelemahan kualitas, bukan dua tahun struktural."},
  {l:"Belanja modal (capex)", v:"(48.000)", v2:"(40.000)", d:"Termasuk aset hak-guna baru Rp2.000 (non-kas) — capex kas 48.000.", psak:"—", f:"—"},
  {l:"Arus kas investasi (CFI)", v:"(48.000)", v2:"(40.000)", d:"Arus dari investasi aset jangka panjang (di sini: capex).", psak:"—", f:"—"},
  {l:"Utang bank (neto)", v:"11.440", v2:"0", d:"Neto +11.440 — tambah utang untuk tutup lubang kas.", psak:"—", f:"—"},
  {l:"Dividen dibayar", v:"(6.000)", v2:"(5.000)", d:"Kas keluar via pendanaan — sambil tambah utang 11.440.", psak:"—", f:"Bayar dividen sambil tambah utang = sinyal prioritas pemegang saham di atas kesehatan."},
  {l:"Arus kas pendanaan (CFF)", v:"5.440", v2:"(5.000)", d:"2025: utang neto +11.440 − dividen 6.000. Kas pendanaan menutup lubang operasi.", psak:"—", f:"—"},
  {l:"Perubahan kas", v:"(11.760)", v2:"(1.000)", d:"30.800 − 48.000 + 5.440 = (11.760) ✓", psak:"—", f:"—"},
  {l:"Kas awal → akhir", v:"33.200 → 21.440", v2:"34.200 → 33.200", d:"Berartikulasi ✓", psak:"—", f:"—"}
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
renderStmt("is");

/* ---------- PLAYGROUND ---------- */
var TXS = [
 {t:"Akui pendapatan Rp20.000 lebih awal (barang belum dikirim)", a:{laba:"naik",aset:"naik",liab:"tetap",kas:"tetap"},
  e:"Piutang +20.000, laba +20.000. Kas NOL — inilah premature recognition. DSO ikut melar."},
 {t:"Kapitalisasi beban operasi Rp12.000 menjadi aset", a:{laba:"naik",aset:"naik",liab:"tetap",kas:"tetap"},
  e:"Beban hilang dari laba rugi, muncul sebagai aset. Laba & aset naik, kas tetap. Trik inti WorldCom."},
 {t:"Perpanjang umur aset: depresiasi turun Rp5.000", a:{laba:"naik",aset:"naik",liab:"tetap",kas:"tetap"},
  e:"Beban susut lebih kecil → laba naik; akumulasi depresiasi lebih kecil → aset neto naik. Kas tidak bergerak. Legal-adjacent, tapi perubahan tiba-tiba = flag."},
 {t:"Jual piutang Rp30.000 ke bank (factoring)", a:{laba:"tetap",aset:"tetap",liab:"tetap",kas:"naik"},
  e:"Kas +30.000, piutang −30.000 → total aset tetap. CFO naik — tapi ini kas dari 'menjual masa depan', bukan operasi sehat."},
 {t:"Terima uang muka pelanggan Rp25.000", a:{laba:"tetap",aset:"naik",liab:"naik",kas:"naik"},
  e:"Kas +25.000, liabilitas (pendapatan diterima di muka) +25.000. Laba BELUM boleh diakui — PSAK 115."},
 {t:"Bayar utang usaha Rp18.000", a:{laba:"tetap",aset:"turun",liab:"turun",kas:"turun"},
  e:"Kas −18.000, utang −18.000 via CFO. Kebalikan dari trik 'stretch payables' yang menunda pembayaran agar CFO terlihat besar."}
];
var DIMS = [["laba","Laba bersih"],["aset","Total aset"],["liab","Total liabilitas"],["kas","Kas"]];
var OPTS = ["naik","turun","tetap"];
var pgScore = 0, pgDone = 0, pgCards = [];
function renderPg(){
  var h = "";
  TXS.forEach(function(tx,i){
    h += '<div class="pg-card" id="pg'+i+'"><h3>'+(i+1)+'. '+tx.t+'</h3><div class="pg-grid">';
    DIMS.forEach(function(dm){
      h += '<div class="pg-dim"><span class="dname">'+dm[1]+'</span><div class="pg-opts">';
      OPTS.forEach(function(o){
        h += '<button data-tx="'+i+'" data-dim="'+dm[0]+'" data-opt="'+o+'">'+o+'</button>';
      });
      h += '</div></div>';
    });
    h += '</div><button class="btn pg-check" data-tx="'+i+'">Cek</button><div class="pg-result" id="pgr'+i+'"></div></div>';
  });
  $("#pg-wrap").innerHTML = h;
  $$("#pg-wrap .pg-opts button").forEach(function(b){
    b.addEventListener("click", function(){
      var card = b.closest(".pg-card");
      card.querySelectorAll('button[data-dim="'+b.dataset.dim+'"]').forEach(function(x){x.classList.remove("sel");});
      b.classList.add("sel");
    });
  });
  $$("#pg-wrap .pg-check").forEach(function(b){
    b.addEventListener("click", function(){ checkPg(+b.dataset.tx); });
  });
}
function checkPg(i){
  var tx = TXS[i], ok = 0;
  var selCount = DIMS.filter(function(dm){
    return document.querySelector('#pg'+i+' button[data-dim="'+dm[0]+'"].sel');
  }).length;
  var r = $("#pgr"+i);
  if(selCount < 4){
    r.className = "pg-result show";
    r.innerHTML = "Lengkapi dulu <strong>keempat</strong> dimensi ("+selCount+"/4 terisi) — jawaban sebagian tidak dinilai.";
    return;
  }
  DIMS.forEach(function(dm){
    var sel = document.querySelector('#pg'+i+' button[data-dim="'+dm[0]+'"].sel');
    var btns = $$('#pg'+i+' button[data-dim="'+dm[0]+'"]');
    btns.forEach(function(x){
      x.classList.remove("right","wrong");
      if(x.dataset.opt === tx.a[dm[0]]) x.classList.add("right");
      else if(x === sel) x.classList.add("wrong");
    });
    if(sel && sel.dataset.opt === tx.a[dm[0]]) ok++;
  });
  r.className = "pg-result show";
  r.innerHTML = "<strong>"+ok+"/4 benar.</strong> "+tx.e;
  if(pgCards.indexOf(i) < 0){
    pgScore += ok; pgDone += 4; pgCards.push(i);
    $("#pg"+i).dataset.scored = "1";
    try{ localStorage.setItem("fsa_pg_m2", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
  }
  $("#pg-score").textContent = "Skor: " + pgScore + " / 24 (" + pgCards.length + " kartu dinilai)";
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

/* Angka format Indonesia: titik = ribuan, koma = desimal.
   Terima "14.440", "14.440,0", "9,75", "0.68", "109.7", "1.000.000". */
var RATIOS = [
 {n:"Akrual (NI − CFO)", f:"Laba bersih − Arus kas operasi", ans:14440, dec:false, unit:" Rp juta",
  hint:"Rp45.240 − Rp30.800",
  why:"+14.440 = laba jauh di atas kas → WARNING. Akrual positif besar persisten = kualitas laba buruk."},
 {n:"CFO / Laba bersih", f:"CFO ÷ Laba bersih", ans:0.68, unit:"x",
  hint:"Rp30.800 ÷ Rp45.240",
  why:"0,68x < 1 = tiap Rp1 laba cuma jadi Rp0,68 kas — turun dari 1,48x di 2024."},
 {n:"Cash conversion cycle", f:"DSO + DIO − DPO (hari)", ans:109.7, unit:" hari",
  hint:"73,0 + 103,7 − 67,0 (hitung dari piutang 104.000, persediaan 96.000, utang 62.000)",
  why:"109,7 hari = kas terikat hampir 4 bulan di modal kerja. Makin panjang makin haus dana."},
 {n:"Interest coverage", f:"Laba operasi ÷ Beban bunga", ans:5.14, unit:"x",
  hint:"Rp72.000 ÷ Rp14.000",
  why:"5,14x — masih aman (>3x). Tapi tren: utang naik sambil kas turun."}
];
function renderRatios(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.n+'</h3><span class="formula">'+r.f+'</span>'
      + '<p class="sub" style="font-size:.85rem;margin:.4rem 0">Petunjuk: '+r.hint+'</p>'
      + '<input id="rin'+i+'" inputmode="decimal" placeholder="jawaban"> <span>'+r.unit+'</span> '
      + '<button class="btn" data-r="'+i+'">Cek</button><div class="fb" id="rfb'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button[data-r]").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var fb = $("#rfb"+i);
      if(isNaN(v)){ fb.textContent = "Isi dulu angkanya."; return; }
      var ok = Math.abs(v - r.ans) <= Math.max(0.06, Math.abs(r.ans)*0.02);
      fb.innerHTML = ok
        ? "<strong style='color:var(--teal-deep)'>Benar.</strong> "+r.why
        : "<strong style='color:var(--sunset-deep)'>Belum tepat.</strong> Coba lagi — pakai petunjuk di atas.";
    });
  });
}
renderRatios();

/* ---------- JOURNAL ---------- */
var PROMPTS = {
 invest:"Lensa investasi — Laba +53% tapi CFO −30%. Apakah Cemerlang Abadi layak dibeli? Tulis 3 baris: kualitas pertumbuhan, valuasi vs risiko, keputusanmu.",
 credit:"Lensa kredit — Perusahaan ini minta tambahan kredit. Tulis 3 baris: tren coverage, pola kas vs utang, syarat/kesimpulanmu.",
 forensic:"Lensa forensik — Di mana manipulasi paling mungkin? Tulis 3 titik + rasio pemeriksa untuk tiap titik."
};
var curLens = "invest";
function renderLens(){
  $("#lens-prompt").textContent = PROMPTS[curLens];
  var v = "";
  try{ v = localStorage.getItem("fsa_journal_m2_"+curLens) || ""; }catch(e){}
  $("#journal-text").value = v;
  updJournalMeta();
}
function updJournalMeta(){
  var v = $("#journal-text").value, w = v.trim() ? v.trim().split(/\s+/).length : 0;
  $("#journal-status").textContent = v.trim() ? "Tersimpan otomatis ✓" : "Belum ada catatan.";
  $("#journal-count").textContent = w + " kata";
}
$$(".journal-tabs .stmt-tab").forEach(function(b){
  b.addEventListener("click", function(){
    $$(".journal-tabs .stmt-tab").forEach(function(x){x.classList.remove("active");});
    b.classList.add("active"); curLens = b.dataset.lens; renderLens();
  });
});
var jT;
$("#journal-text").addEventListener("input", function(){
  clearTimeout(jT);
  jT = setTimeout(function(){
    try{ localStorage.setItem("fsa_journal_m2_"+curLens, $("#journal-text").value); }catch(e){}
    updJournalMeta();
  }, 600);
});
renderLens();

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Beneish M-score dipakai untuk mengukur…", o:["Risiko manipulasi laba", "Risiko kebangkrutan", "Tingkat likuiditas perusahaan", "Efisiensi modal kerja"], a:0},
 {q:"DSO naik 50 → 73 hari dalam setahun. Artinya…", o:["Penagihan justru membaik tahun ini", "DSO berfluktuasi wajar tiap tahun", "Piutang menumpuk karena penjualan turun", "Penagihan melambat — red flag"], a:3},
 {q:"Standar pengakuan pendapatan versi penomoran BARU adalah…", o:["PSAK 72","PSAK 116","PSAK 115","PSAK 118"], a:2},
 {q:"CFO/NI turun dari 1,48x (2024) ke 0,68x (2025) artinya…", o:["Kualitas laba membaik karena laba bersih terus bertumbuh", "Laba makin tidak menjadi kas — kualitas memburuk", "Perusahaan merugi karena kas operasinya turun", "Wajar — rasio di bawah 1x biasa terjadi di ritel"], a:1},
 {q:"Kapitalisasi beban operasi Rp12.000 efeknya…", o:["Laba turun, kas naik", "Laba & aset naik, kas tetap", "Tidak ada efek ke laporan lain", "Kas berkurang Rp12.000 saat dibayar"], a:1}
];
function renderQuiz(){
  var h = "";
  QUIZ.forEach(function(q,i){
    /* Acak urutan opsi tiap pemuatan (Fisher-Yates); petakan ulang indeks jawaban benar ke posisi tampil baru — kunci jawaban tetap terlacak. */
    var order = q.o.map(function(_,k){ return k; });
    for(var k=order.length-1;k>0;k--){ var r=Math.floor(Math.random()*(k+1)), t=order[k]; order[k]=order[r]; order[r]=t; }
    q.a = order.indexOf(q.a);
    h += '<div class="quiz-q" id="qq'+i+'"><h3>'+(i+1)+'. '+q.q+'</h3>';
    order.forEach(function(oi,j){
      h += '<label><input type="radio" name="q'+i+'" value="'+j+'" style="margin-right:.5rem">'+q.o[oi]+'</label>';
    });
    h += '</div>';
  });
  $("#quiz-wrap").innerHTML = h;
}
renderQuiz();
$("#quiz-submit").addEventListener("click", function(){
  var score = 0, picked = [], skipped = [];
  QUIZ.forEach(function(q,i){
    var sel = document.querySelector('input[name="q'+i+'"]:checked');
    picked.push(sel ? +sel.value : -1);
    try{ if(window.FSAMistake && sel && +sel.value !== q.a)
           window.FSAMistake.log(2, i, "quiz"); }catch(e){}
    if(!sel) skipped.push(i+1);
    else if(+sel.value === q.a) score++;
  });
  var box2 = $("#gate-box");
  if(skipped.length){
    box2.style.display = "block";
    box2.innerHTML = "<h3>Belum lengkap</h3><p>Kamu melewatkan soal: <strong>"+skipped.join(", ")+"</strong>. Jawab dulu semuanya, baru submit.</p>";
    box2.scrollIntoView({behavior:"smooth", block:"center"});
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
  var box = $("#gate-box"); box.style.display = "block";
  if(passed){
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). <a href=\"../modul-3/\">Lanjut ke Modul 3 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m2","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m2") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m2") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 24 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m2") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 2 sudah kamu lewati sebelumnya. <a href=\"../modul-3/\">Lanjut ke Modul 3 →</a></p>";
  }
}catch(e){}
})();
