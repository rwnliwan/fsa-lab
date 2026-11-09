/* FSA Lab — Modul 23: Covenant & Perjanjian Kredit (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
test:{ title:"Uji covenant 2025 — definisi perjanjian (Rp juta)", cols:["Uji","Hasil","Batas"],
 rows:[
  {l:"Leverage: total utang ÷ EBITDA", v:"1,97×", v2:"≤ 3,0× ✓", d:"(31.440 + 110.000 + 60.000) ÷ 102.000 = 201.440 ÷ 102.000. Definisi perjanjian: SEMUA utang berbunga termasuk liabilitas sewa.", psak:"—", f:"Leverage 'aman' tapi DSCR jebol = perusahaan bisa berutang, tapi tak bisa membayar cicilannya."},
  {l:"DSCR (definisi kontrak)", v:"0,91×", v2:"≥ 1,25× ✗ BREACH", d:"30.800 ÷ (14.000 + 20.000) = 0,91 — definisi KONTRAK (konservatif): pembilang CFO setelah bunga, penyebut bunga+pokok. Bedakan dari kas aktual: sisa 30.800 vs pokok 20.000 = 1,54x (cukup); CFADS 44.800 ÷ 34.000 = 1,32x. Breach kontraktual ≠ tidak bisa bayar — tapi memberi bank hak acceleration. (Cicilan ilustratif Rp20.000/th).", psak:"—", f:"Breach definisi kontrak = technical default. Inilah tekanan covenant yang jadi motif fraud (fraud triangle: pressure)."},
  {l:"Current ratio", v:"2,17×", v2:"≥ 1,5× ✓", d:"221.440 ÷ 102.000 — likuiditas jangka pendek aman. Covenant ini lolos dengan lega.", psak:"—", f:"Rasio lancar bisa 'aman' sementara DSCR jebol — covenant menguji hal yang berbeda-beda."},
  {l:"Batas dividen: dividen ÷ laba bersih", v:"13,3%", v2:"≤ 50% ✓", d:"6.000 ÷ 45.240. Masih jauh dari batas — ruang menaikkan dividen 16.620 sebelum menyentuh covenant.", psak:"—", f:"Dividen yang dibatasi covenant = dividen dibayar dari kas beneran, bukan dari utang baru."},
  {l:"Status keseluruhan", v:"1 dari 4 DILANGGAR", v2:"technical default", d:"Satu breach cukup: kreditur berhak meminta pelunasan dipercepat (acceleration) — atau menawarkan waiver dengan harga.", psak:"—", f:"Bank tidak butuh 4 pelanggaran. Satu saja = seluruh fasilitas bisa ditagih sekaligus."}
 ]},
reklas:{ title:"Reklasifikasi utang pasca-pelanggaran covenant — kapan waiver menyelamatkan klasifikasi (Rp juta)", cols:["Situasi","Klasifikasi utang","Dampak"],
 rows:[
  {l:"Aturan", v:"breach pada tanggal pelaporan", v2:"lancar, kecuali…", d:"Bila covenant dilanggar PADA tanggal pelaporan, utang jangka panjang direklasifikasi menjadi LANCAR — kecuali waiver diperoleh SEBELUM tanggal pelaporan, atau debitur punya hak tanpa syarat menunda pembayaran > 12 bulan.", psak:"PSAK 201 (dulu 1)", f:"Klasifikasi neraca mengikuti hak yang ADA pada tanggal pelaporan — bukan harapan negosiasi."},
  {l:"Waiver SEBELUM tanggal pelaporan", v:"15 Des 2025", v2:"tetap tidak lancar", d:"Waiver atas breach DSCR diperoleh 15 Des 2025 (sebelum 31 Des 2025): utang bank jangka panjang 110.000 TETAP tidak lancar. Current ratio tetap 2,17×.", psak:"PSAK 201 (dulu 1)", f:"Waiver dini = satu-satunya jalan klasifikasi selamat."},
  {l:"Waiver SETELAH tanggal pelaporan", v:"20 Jan 2026", v2:"direklas ke lancar", d:"Waiver diperoleh 20 Jan 2026 — setelah 31 Des 2025 tapi sebelum LK terbit: utang 110.000 DIREKLAS ke lancar. Ini peristiwa setelah periode pelaporan yang non-penyesuai untuk klasifikasi menurut PSAK 205 — tapi diungkap di catatan.", psak:"PSAK 205 (dulu 8)", f:"Waiver telat menenangkan bank, tapi tidak memperbaiki neraca tanggal pelaporan."},
  {l:"Dampak current ratio", v:"2,17× → 1,04×", v2:"di bawah batas 1,5×", d:"221.440 ÷ (102.000 + 110.000) = 221.440 ÷ 212.000 = 1,04× — jatuh di bawah batas covenant 1,5×: breach beranak breach.", psak:"—", f:"Satu reklasifikasi bisa memicu pelanggaran covenant kedua — baca cross-default."},
  {l:"Grace period / cure right", v:"belum dieksekusi", v2:"tetap lancar", d:"Masa tenggang yang berakhir setelah tanggal pelaporan, atau cure right yang belum dipakai (mis. setor modal 15.000 belum masuk), TIDAK menyelamatkan klasifikasi tanpa waiver sebelum tanggal pelaporan.", psak:"—", f:"Hak memperbaiki ≠ sudah diperbaiki — klasifikasi butuh fakta, bukan janji."},
  {l:"Kenapa analis peduli", v:"neraca ≠ perjanjian", v2:"baca catatan pasca-neraca", d:"Neraca bisa tetap menampilkan 'jangka panjang' sementara bank sudah berhak menagih sekaligus — selalu baca catatan peristiwa setelah tanggal neraca sebelum percaya klasifikasi.", psak:"—", f:"—"}
 ]},
anat:{ title:"Anatomi perjanjian kredit — tiga jenis janji", cols:["Jenis","Contoh di Cemerlang","Dil langgar jika…"],
 rows:[
  {l:"Affirmative — janji MELAKUKAN", v:"Serahkan LK audited tiap kuartal; bayar pajak tepat waktu", v2:"telat lapor > 30 hari", d:"Kewajiban aktif. Paling ringan — tapi keterlambatan lapor adalah sinyal klasik ada yang disembunyikan.", psak:"—", f:"LK audited yang telat terbit = cek forensik pertama, gratis."},
  {l:"Negative — janji TIDAK melakukan", v:"Dilarang tambah utang > 50.000; dilarang jual aset inti; dividen ≤ 50% laba", v2:"jual pabrik tanpa izin bank", d:"Pagar pembatas. Melindungi agunan & arus kas yang jadi sumber pembayaran kreditur.", psak:"—", f:"Pelanggaran negative covenant sering disembunyikan — baca catatan 'peristiwa setelah tanggal neraca'."},
  {l:"Financial — janji ANGKA", v:"Leverage ≤ 3,0×; DSCR ≥ 1,25×; CR ≥ 1,5×", v2:"DSCR 0,91× < 1,25×", d:"Diuji tiap kuartal (maintenance). Angka diuji pakai DEFINISI perjanjian — belum tentu sama dengan angka akuntansi.", psak:"—", f:"Definisi ≠ angka akuntansi: 'utang' versi bank bisa mengecualikan sewa atau mengurangkan kas. Baca definisinya."},
  {l:"Cure right — hak memperbaiki", v:"Pemegang saham boleh setor modal 15.000 dalam 30 hari", v2:"untuk menaikkan EBITDA/DSCR", d:"Jalan keluar yang disepakati di awal: suntik ekuitas agar rasio kembali patuh — tanpa dianggap default.", psak:"—", f:"Cure yang dipakai tiap kuartal = perusahaan hidup dari infus pemegang saham."},
  {l:"Konsekuensi breach", v:"Waiver (fee 0,5%) atau repricing +150bps", v2:"atau acceleration", d:"Waiver = bank memaafkan dengan harga: fee + bunga naik 150bps (+Rp2.122/th atas utang bank 141.440). Acceleration = tagih sekaligus.", psak:"—", f:"Biaya waiver yang berulang = pajak atas kerapuhan."}
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
renderStmt("test");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"CFO turun 20% (30.800 → 24.640)", q1:"DSCR", q2:"Risiko breach", a1:"turun", a2:"naik",
  e:"Pembilang DSCR menyusut, penyebut tetap → 0,72× (24.640 ÷ 34.000), makin dalam. Inilah kenapa bankir stress-test CFO."},
 {t:"Cicilan pokok dipercepat (20.000 → 30.000/th)", q1:"DSCR", q2:"Leverage", a1:"turun", a2:"tetap",
  e:"DSCR = 30.800 ÷ 44.000 = 0,70×. Leverage tak bergerak (total utang sama) — covenant menguji arus, bukan stok."},
 {t:"Dividen dinaikkan 4× (6.000 → 24.000)", q1:"Kepatuhan batas dividen", q2:"Kas", a1:"turun", a2:"turun",
  e:"24.000 ÷ 45.240 = 53% > batas 50% = breach negative covenant. Dividen dibayar, perjanjian dilanggar."},
 {t:"Waiver disetujui: bunga naik 150bps", q1:"Beban bunga", q2:"DSCR", a1:"naik", a2:"turun",
  e:"+150bps × 141.440 = +2.122/th. Harga maaf bank: DSCR makin terjepit tahun depan."},
 {t:"Jual aset Rp50.000, lunasi utang bank", q1:"Leverage", q2:"DSCR", a1:"turun", a2:"naik",
  e:"Utang turun 50.000 → leverage 1,48×; bunga turun → DSCR membaik — DENGAN ASUMSI aset yang dijual nonproduktif, EBITDA & CFO sebelum bunga tetap, dan pokok/bunga berkurang sesuai jadwal. Bila asetnya produktif, EBITDA bisa ikut turun dan arah DSCR belum pasti. Deleveraging = obat dua penyakit, bila asumsinya terpenuhi."},
 {t:"Definisi bank pakai utang BERSIH (kurangi kas 21.440)", q1:"Leverage terukur", q2:"Headroom", a1:"turun", a2:"naik",
  e:"(201.440 − 21.440) ÷ 102.000 = 1,76×. Definisi ≠ angka akuntansi — selalu baca definisi di perjanjiannya."}
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
    try{ localStorage.setItem("fsa_pg_m23", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Leverage covenant 2025 (×)", hint:"Total utang ÷ EBITDA: 201.440 ÷ 102.000", ans:1.97, tol:0.05,
  why:"1,97× vs batas 3,0× — lolos dengan lega. Tapi leverage bukan satu-satunya ujian."},
 {q:"DSCR 2025 menurut definisi kontrak (×)", hint:"CFO setelah bunga ÷ (bunga + pokok): 30.800 ÷ 34.000", ans:0.91, tol:0.03,
  why:"0,91× < 1,25× = BREACH kontraktual. Catatan: ini definisi kontrak yang konservatif — kas aktual 30.800 vs pokok 20.000 = 1,54x (cukup). Breach ≠ tidak bisa bayar."},
 {q:"Ruang tambah utang sebelum breach leverage (Rp juta)", hint:"Batas × EBITDA − utang kini: 3,0 × 102.000 − 201.440", ans:104560, dec:false, tol:1000,
  why:"104.560 — headroom besar di leverage. Masalahnya bukan di sini, melainkan di DSCR."},
 {q:"Biaya repricing +150bps per tahun (Rp juta)", hint:"Kenaikan × utang bank: 1,5% × 141.440", ans:2122, dec:false, tol:50,
  why:"2.122/th — harga waiver: bank memaafkan breach dengan menaikkan bunga."},
 {q:"Current ratio setelah reklasifikasi utang 110.000 (×)", hint:"221.440 ÷ (102.000 + 110.000)", ans:1.04, dec:true, tol:0.03,
  why:"1,04× — dari 2,17× yang 'aman' menjadi di bawah batas covenant 1,5×. Waktu perolehan waiver mengubah segalanya."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 1,97">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (boleh desimal koma, contoh: 1,97)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Leverage 1,97× aman tapi DSCR 0,91× breach. Waiver = bunga +150bps (+2.122/th). Apakah ekuitas masih menarik setelah biaya kerapuhan ini? Tulis 3 baris.",
 credit:"Lensa kredit — Kamu bankirnya: DSCR 0,91×, technical default. Beri waiver dengan repricing, atau acceleration (tagih sekaligus)? Tulis keputusan + 2 syaratmu.",
 forensic:"Lensa forensik — Perusahaan di ambang breach covenant punya insentif memoles laba (fraud triangle: pressure). Tulis 3 akun yang paling mungkin dimanipulasi + cara mengeceknya."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m23_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m23_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Maintenance covenant artinya…", o:["Diuji hanya saat perusahaan pertama kali menerbitkan utang baru","Diuji berkala (mis. tiap kuartal) selama fasilitas berjalan","Tidak pernah diuji lagi selama fasilitas berjalan hingga jatuh tempo","Hanya membatasi pembayaran dividen perusahaan"], a:1},
 {q:"DSCR 0,91× artinya…", o:["CFO 30.800 ÷ total liabilitas 272.000 = 0,11x — kemampuan bayar sangat lemah, kreditur pasti mempercepat pelunasan seluruh fasilitas seketika dan membekukan rekening operasional perusahaan tanpa pemberitahuan","Laba bersih naik 9% dari tahun lalu sehingga DSCR ikut membaik — perusahaan aman dan jauh dari risiko gagal bayar utang","CFO setelah bunga 30.800 ÷ (bunga+pokok) 34.000 = 0,91x BREACH definisi kontrak (konservatif). Catatan: kalau yang diuji hanya pokok, 30.800÷20.000=1,54x (cukup) — kontrak menguji bunga+pokok","Rasio di bawah 1,00 berarti perusahaan pasti bangkrut dan wajib mengajukan PKPU minggu ini tanpa bisa dinegosiasi sama sekali"], a:2},
 {q:"Technical default bisa berujung pada…", o:["Kreditur meminta pelunasan dipercepat, atau waiver dengan repricing","Otomatis dinyatakan pailit oleh pengadilan niaga tanpa proses PKPU seketika","Saham perusahaan dibekukan dari perdagangan bursa","Direksi langsung dipidana penjara oleh jaksa"], a:0},
 {q:"Angka covenant vs angka akuntansi…", o:["Selalu identik — definisi kontrak wajib mengikuti angka laporan keuangan","Angka akuntansi selalu mengalahkan definisi yang tertulis di kontrak","Keduanya tidak berhubungan — covenant diuji dari data operasional mentah","Bisa berbeda — definisi di perjanjian yang berlaku, bukan angka laporan"], a:3},
 {q:"Covenant pressure sebagai motif fraud…", o:["Tidak ada kaitannya dengan kecurangan — covenant murni urusan legal antara bank dan debitur","Perusahaan di ambang breach punya insentif memoles laba — fraud triangle: pressure","Hanya terjadi di bank karena covenant tidak dipakai di perusahaan non-bank","Membuat laporan lebih jujur karena manajemen takut diawasi kreditur"], a:1}
];
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
           window.FSAMistake.log(23, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓ — Phase 5 Tuntas!</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu membaca perjanjian kredit seperti bankir. <a href=\"../modul-24/\">Lanjut ke Modul 24 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m23","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m23") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m23") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m23") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 23 sudah kamu lewati sebelumnya — Phase 5 tuntas! <a href=\"../modul-24/\">Lanjut ke Modul 24 →</a></p>";
  }
}catch(e){}
})();
