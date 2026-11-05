/* FSA Lab — Modul 38: Mekanik Laporan Interim/Kuartalan (lensa TRIPLE; contoh baru = ILUSTRATIF berlabel) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
ytd:{ title:"Cover & periode: PT Cemerlang Abadi, laporan interim Q2 2026 (ILUSTRATIF). Baca cover dulu — periode, status audit, basis.", cols:["Item","Yang benar","Jebakan"],
 rows:[
  {l:"Periode IS: 'untuk enam bulan yang berakhir 30 Juni 2026'", v:"YTD: 1 Jan–30 Jun", v2:"BUKAN Q2 saja",
   d:"Cover menulis 'untuk enam bulan yang berakhir 30 Juni 2026' (ilustratif) — IS-nya mencakup ENAM BULAN penuh, 1 Januari sampai 30 Juni. Analis yang membaca angka ini sebagai 'kinerja Q2' salah membaca periode — kesalahan paling umum di laporan interim.",
   tag:"LO1 · baca cover",
   k:"Lensa forensik: salah periode = salah kesimpulan. Sebelum menghitung apa pun, tulis dulu: periode apa, YTD atau standalone, audited atau unaudited."},
  {l:"Periode BS: 30 Jun 2026 vs 31 Des 2025", v:"titik waktu", v2:"bukan arus",
   d:"Neraca adalah FOTO per 30 Juni 2026, dibandingkan dengan foto 31 Desember 2025. Ia tidak 'mencakup' enam bulan — ia memotret dua titik. Konsekuensinya: selisih dua foto BUKAN 'kinerja kuartal'.",
   tag:"LO1 · flow vs stock",
   k:"Lensa investasi: bandingkan foto dengan foto (30 Jun vs 31 Des), arus dengan arus (H1 vs H1 tahun lalu). Jangan campur keduanya."},
  {l:"Status: tidak diaudit", v:"unaudited", v2:"bobot berbeda",
   d:"Cover interim lazim bertuliskan 'tidak diaudit' (ilustratif). Artinya BUKAN 'tidak bisa dibaca' — artinya bobot analisis bergeser: konsistensi internal NAIK (apakah angka-angkanya saling mengunci?), jangkar verifikasi eksternal TURUN.",
   tag:"LO5 · kalibrasi",
   k:"Lensa forensik: unaudited + revisi besar saat audit tahunan = pola yang dicatat. Bandingkan interim vs audited tahun lalu untuk membaca 'gaya' manajemen."},
  {l:"Basis: konsolidasian, Rp juta", v:"cek catatan 1", v2:"syarat derivasi",
   d:"Basis (konsolidasi vs induk, satuan, mata uang) harus SAMA antara H1 dan Q1 — inilah 'basis selaras' yang menjadi syarat sah derivasi H1−Q1. Restatement atau akuisisi di tengah tahun bisa merusaknya diam-diam.",
   tag:"LO2 · syarat",
   k:"Lensa forensik: restatement Q1 yang diam-diam = basis tidak selaras → derivasi Q2 cacat total."}
 ]},
flow:{ title:"IS & arus kas (FLOW): yang BOLEH diturunkan via H1−Q1. Cemerlang Abadi, Rp juta, ILUSTRATIF.", cols:["Derivasi","Hitungan","Hasil"],
 rows:[
  {l:"Revenue Q2 = H1 − Q1", v:"290.000 − 135.000", v2:"155.000",
   d:"Revenue H1 2026 Rp290.000jt − Q1 Rp135.000jt = revenue Q2 Rp155.000jt (ilustratif, basis selaras). IS adalah FLOW — mengalir sepanjang periode — sehingga selisih dua periode kumulatif = aliran kuartalnya.",
   tag:"Hitungan modul (ilustratif)",
   k:"Lensa investasi: Q2 tumbuh 14,8% QoQ (155.000 vs 135.000) — tapi angka unaudited; tesis menunggu konfirmasi konsistensi."},
  {l:"Laba bersih Q2 = H1 − Q1", v:"26.000 − 11.000", v2:"15.000",
   d:"Laba bersih H1 Rp26.000jt − Q1 Rp11.000jt = Rp15.000jt (ilustratif). Syaratnya: tidak ada restatement Q1 dan tidak ada akuisisi/divestasi di tengah jalan yang mengubah perimeter konsolidasi.",
   tag:"Hitungan modul (ilustratif)",
   k:"Lensa kredit: laba Q2 untuk uji debt service — tapi covenant resmi memakai angka audited, bukan interim."},
  {l:"Arus kas operasi Q2", v:"BOLEH", v2:"flow juga",
   d:"Arus kas juga FLOW — CFO Q2 = CFO H1 − CFO Q1 sah dengan syarat yang sama. Inilah cara analis menguji 'kualitas' laba kuartalan: lonjakan NI Q2 yang tidak diikuti kas = akrual, bukan kas.",
   tag:"LO2 · arus kas",
   k:"Lensa forensik: NI Q2 melonjak tapi CFO Q2 datar = pola akrual agresif — uji pertama setiap membaca interim."},
  {l:"Syarat sah: basis selaras", v:"WAJIB", v2:"cek restatement",
   d:"Derivasi H1−Q1 HANYA sah bila H1 dan Q1 memakai basis yang sama: standar sama, perimeter sama (tanpa akuisisi), tanpa restatement diam-diam. Bila ragu: JANGAN kurangkan — pakai angka H1 apa adanya.",
   tag:"LO2 · caveat",
   k:"Lensa forensik: 'Q2 anjlok' yang ternyata efek restatement Q1 = artefak akuntansi, bukan kinerja. Selalu cek catatan restatement."}
 ]},
jebak:{ title:"Jebakan stock: yang TIDAK BOLEH diturunkan. Rp juta, ILUSTRATIF.", cols:["Klaim","Fakta","Vonis"],
 rows:[
  {l:"'Kas Q2' = kas 30 Jun − kas 31 Des", v:"24.000 − 21.440", v2:"TIDAK VALID",
   d:"Selisihnya Rp2.560jt (ilustratif) — itu PERUBAHAN kas selama H1, bukan 'kas yang dihasilkan Q2'. Kas adalah STOCK (saldo), bukan aliran. Tidak ada konsep 'kas Q2 standalone' — pertanyaannya sendiri tidak valid.",
   tag:"LO2 · jebakan #1",
   k:"Lensa forensik: analis yang menulis 'kas Q2 = …' dari selisih neraca = tidak paham stock vs flow. Coret tesisnya tanpa diskusi."},
  {l:"'Total aset Q2' dari selisih BS", v:"TIDAK VALID", v2:"stock",
   d:"Total aset 30 Jun − total aset 31 Des = perubahan aset H1. Menyebutnya 'aset Q2' adalah kesalahan kategori — seperti menimbang badan dua kali lalu mengklaim selisihnya adalah 'berat badan bulan lalu'.",
   tag:"LO2 · jebakan",
   k:"Lensa investasi: 'aset Q2 tumbuh' dari selisih BS = narasi tanpa makna. Minta IS-nya."},
  {l:"Yang BOLEH dari selisih BS", v:"perubahan H1", v2:"bukan Q2",
   d:"Selisih BS hanya memberi PERUBAHAN selama H1 (mis. kas +2.560). Itu pun bukan 'kinerja Q2' — ia mencakup Q1 juga. Untuk kinerja kuartal, kembalilah ke IS/CF yang memang flow.",
   tag:"LO2 · batas",
   k:"Lensa kredit: perubahan kas H1 untuk likuiditas — tapi jangan sebut 'kas kuartalan' di memo kredit."},
  {l:"Ekuitas 30 Jun − 31 Des", v:"Δ ekuitas H1", v2:"bukan laba Q2",
   d:"Selisih ekuitas = laba H1 − dividen ± OCI ± setoran modal. Bukan 'laba Q2'. Mencari laba kuartal dari neraca = memakai pintu yang salah.",
   tag:"LO2 · jebakan",
   k:"Lensa forensik: 'laba Q2 dari ekuitas' yang mengabaikan dividen interim = double-counting yang disengaja atau lalai."}
 ]},
bank:{ title:"Interim bank: Bank Nusantara H1 2026 (ILUSTRATIF). NIM, NPL, CAR di laporan interim.", cols:["Item","Hitungan","Catatan"],
 rows:[
  {l:"NIM annualisasi", v:"6,00%", v2:"(4.800×2)/160.000",
   d:"NII H1 Rp4.800jt di-annualisasi (×2, karena setengah tahun) lalu dibagi RATA-RATA earning assets Rp160.000jt = 6,00% (ilustratif). Dua keputusan sadar: annualisasi NII (flow) dan denominator rata-rata.",
   tag:"Hitungan modul (ilustratif)",
   k:"Lensa kredit: NIM interim untuk membaca TREN — keputusan kredit tetap menunggu audited."},
  {l:"Jebakan denominator: saldo akhir", v:"5,65%", v2:"SALAH",
   d:"Memakai saldo akhir Rp170.000jt → 9.600/170.000 = 5,65% — SALAH. Earning assets bergerak selama 6 bulan; NII dihasilkan oleh saldo RATA-RATA, bukan foto terakhir. Selisih 35bps = premi ketidaktelitian.",
   tag:"LO4 · denominator",
   k:"Lensa investasi: bandingkan NIM antar-bank interim — pastikan keduanya memakai rata-rata, bukan akhir periode."},
  {l:"NPL 3,2%: tidak di-annualisasi", v:"point-in-time", v2:"stock",
   d:"NPL adalah rasio STOCK (kredit bermasalah ÷ total kredit per 30 Jun, ilustratif 3,2%) — TIDAK di-annualisasi. Yang dianalisis: tren vs 31 Des dan kecukupan CKPN-nya.",
   tag:"LO4 · stock",
   k:"Lensa forensik: NPL turun di interim + CKPN turun juga = tanyakan restrukturisasi/hapusbuku, bukan rayakan."},
  {l:"CAR interim", v:"dihitung normal", v2:"nuansa modal",
   d:"Rasio permodalan dihitung normal dari angka 30 Jun — TAPI: laba H1 yang belum diaudit umumnya tidak diakui penuh sebagai modal inti oleh regulator. CAR interim bisa terlihat lebih konservatif dari realitanya.",
   tag:"LO5 · nuansa",
   k:"Lensa kredit: untuk bank, CAR interim + tren NPL + LDR = paket tiga serangkai sebelum bicara fasilitas."}
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
renderStmt("ytd");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Revenue Q2 Cemerlang: H1 Rp290.000jt − Q1 Rp135.000jt, basis selaras (ilustratif)", a:"dapat",
  e:"Revenue adalah FLOW — selisih dua periode kumulatif = aliran kuartalnya. Hasil: Rp155.000jt. Inilah bahan semua rasio Q2."},
 {t:"'Kas Q2': kas 30 Jun Rp24.000jt − kas 31 Des Rp21.440jt (ilustratif)", a:"tidak",
  e:"Kas adalah STOCK. Selisih Rp2.560jt = perubahan kas selama H1, bukan 'kas Q2'. Pertanyaannya tidak valid — mengenali itu adalah skill."},
 {t:"CFO Q2: arus kas operasi H1 − Q1, tanpa restatement (ilustratif)", a:"dapat",
  e:"Arus kas adalah FLOW seperti IS. Uji kualitas laba kuartalan: NI Q2 naik tapi CFO Q2 datar = akrual, bukan kas."},
 {t:"NPL Q2 = NPL H1 − NPL Q1 (ilustratif)", a:"tidak",
  e:"NPL adalah RASIO atas stock — tidak bisa dikurangkan. Hitung ulang dari komponen Q2 bila datanya tersedia."},
 {t:"Laba bersih Q2: H1 Rp26.000jt − Q1 Rp11.000jt, basis selaras (ilustratif)", a:"dapat",
  e:"Flow, basis selaras → Rp15.000jt. Syaratnya: tanpa restatement Q1 dan tanpa perubahan perimeter."},
 {t:"'Total aset Q2': neraca 30 Jun − neraca 31 Des (ilustratif)", a:"tidak",
  e:"Neraca adalah FOTO. Selisih dua foto = perubahan H1, bukan 'aset kuartalan'. Untuk kinerja kuartal, kembali ke IS/CF."}
];
var OPTS2 = ["dapat","tidak"];
var pgScore = 0, pgDone = 0, pgCards = [];
function renderPg(){
  var h = "";
  CARDS.forEach(function(c,i){
    h += '<div class="quiz-q" id="pg'+i+'"><h3>Kartu '+(i+1)+': '+c.t+'</h3>';
    h += '<p class="sub" style="margin:.4rem 0 .2rem">Dapat diturunkan via H1−Q1?</p><div class="pg-opts">';
    OPTS2.forEach(function(o){ h += '<button data-card="'+i+'" data-opt="'+o+'">'+o+'</button>'; });
    h += '</div>';
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
  var sel = document.querySelector('#pg'+i+' button.sel');
  var r = $("#pgr"+i);
  if(!sel){
    r.className = "pg-result show";
    r.innerHTML = "Pilih dulu: dapat atau tidak — baru tekan Cek.";
    return;
  }
  var btns = $$('#pg'+i+' .pg-opts button');
  btns.forEach(function(x){
    x.classList.remove("right","wrong");
    if(x.dataset.opt === c.a) x.classList.add("right");
    else if(x === sel) x.classList.add("wrong");
  });
  if(sel.dataset.opt === c.a) ok = 1;
  r.className = "pg-result show";
  r.innerHTML = "<strong>"+(ok?"Tepat ✓":"Belum tepat.")+"</strong> "+c.e;
  if(pgCards.indexOf(i) < 0){
    pgScore += ok; pgDone += 1; pgCards.push(i);
    $("#pg"+i).dataset.scored = "1";
    try{ localStorage.setItem("fsa_pg_m38", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
  }
  $("#pg-score").textContent = "Skor: " + pgScore + " / 6 (" + pgCards.length + " kartu dinilai)";
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
 {q:"Revenue Q2 standalone Cemerlang (Rp juta)", hint:"290.000 − 135.000, basis selaras (ilustratif)", ans:155000, dec:false, tol:1,
  why:"155.000 — flow BOLEH dikurangkan bila basis selaras. Inilah bahan semua rasio Q2."},
 {q:"NIM annualisasi Bank Nusantara (%)", hint:"NII H1 4.800 ×2 ÷ rata-rata earning assets 160.000 (ilustratif)", ans:6, dec:true, tol:0.02,
  why:"6,00% — annualisasi NII (flow ×2), denominator RATA-RATA. Pakai saldo akhir 170.000 → 5,65% (salah)."},
 {q:"Net margin Q2 Cemerlang (%)", hint:"15.000 ÷ 155.000 — hitung dari komponen Q2 (ilustratif)", ans:9.68, dec:true, tol:0.03,
  why:"9,68% — rasio dihitung ULANG dari komponen. 8,97 − 8,15 = 0,82 adalah fallacy selisih margin."},
 {q:"Kas 30 Jun Rp24.000jt, kas 31 Des Rp21.440jt (ilustratif). 'Kas Q2 standalone' = …", hint:"Pikirkan dulu: kas itu flow atau stock?",
  mc:["Rp2.560jt — selisihnya","Tidak valid — kas adalah stock, tak ada 'kas Q2'","Rp24.000jt — pakai angka terakhir","Rp12.000jt — bagi dua, kan setengah tahun"], a:1,
  why:"Tidak valid — kas adalah STOCK (saldo). Rp2.560jt = perubahan kas H1, bukan 'kas kuartalan'. Mengenali pertanyaan yang salah adalah skill analis."},
 {q:"Annualisasi NAIF laba Q2 ritel (Rp juta)", hint:"Laba Q2 8.000 ×4 — cara mekanis (ilustratif)", ans:32000, dec:false, tol:1,
  why:"32.000 — inilah angka yang keluar bila mengabaikan seasonality. Bandingkan dengan estimasi wajar berikut."},
 {q:"Estimasi tahunan WAJAR laba ritel (Rp juta)", hint:"Pola 3 tahun: Q2 (lebaran) = 40% laba tahunan (ilustratif)", ans:20000, dec:false, tol:1,
  why:"20.000 = 8.000 ÷ 0,40 — seasonality lebaran membuat Q2 gemuk; ×4 mekanis melebih-lebihkan 60%."}
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
      var ok, msg;
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
 invest:"Lensa investasi — Cemerlang Abadi Q2 2026 (ILUSTRATIF): revenue Q2 155.000 (+14,8% QoQ), NI Q2 15.000 (+36,4%), net margin 9,68% vs 8,15% di Q1. Tulis 3 baris: apakah perbaikan margin ini riil atau butuh uji musiman — angka apa yang kamu pakai + dari mana, keputusanmu (beli / tunggu / hindari) + SATU hal yang membunuh tesismu.",
 credit:"Lensa kredit — kas Cemerlang naik Rp2.560jt selama H1 2026 (unaudited, ilustratif). Tulis 3 baris: bagaimana kamu memakai angka interim ini dalam memo kredit (dan apa yang TIDAK boleh kamu klaim darinya), satu covenant berbasis angka audited yang kamu minta, keputusanmu.",
 forensic:"Lensa forensik — interim ini unaudited (ilustratif). Tulis 3 baris: apa yang kamu verifikasi dulu (basis selaras? restatement Q1?), satu uji konsistensi internal (kas vs laba), dan satu temuan yang membuatmu menolak mentah-mentah."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m38_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m38_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"Cover menulis 'untuk enam bulan yang berakhir 30 Juni 2026' (ilustratif). Laporan laba rugi di dalamnya mencakup periode…", o:["1 Jan–30 Jun 2026 (YTD — enam bulan penuh)", "1 Apr–30 Jun 2026 (kuartal kedua saja)", "30 Jun 2025–30 Jun 2026 (dua belas bulan berjalan)", "1 Jan–31 Des 2026 (tahun penuh proyeksi)"], a:0},
 {q:"Revenue H1 Rp290.000jt, Q1 Rp135.000jt, basis selaras (ilustratif). Revenue Q2 standalone…", o:["Rp155.000jt","Rp425.000jt","Rp145.000jt","Rp135.000jt"], a:0},
 {q:"Manakah pernyataan yang BENAR tentang derivasi H1−Q1?", o:["Laba bersih Q2 = H1 − Q1 bila basis selaras — flow boleh dikurangkan", "'Kas Q2' = kas 30 Jun − kas 31 Des — kas juga arus", "NPL Q2 = NPL H1 − NPL Q1 — rasio ikut dikurangkan", "Margin Q2 = margin H1 − margin Q1 — konsisten dengan cara derivasi komponen"], a:0},
 {q:"NII H1 Rp4.800jt, rata-rata earning assets Rp160.000jt (ilustratif, Bank Nusantara). NIM annualisasi…", o:["6,00% — NII×2 ÷ rata-rata EA", "3,00% — tanpa annualisasi setengah tahun", "5,65% — pakai saldo akhir 170.000", "12,00% — annualisasi ×4"], a:0},
 {q:"Analis A menghitung: margin Q2 = margin H1 − margin Q1. Di mana letak kesalahannya?", o:["Rasio adalah hasil bagi — ia harus dihitung ulang dari komponen Q2, bukan dikurangkan", "Tidak ada yang salah — selama basis selaras, semua angka interim boleh dikurangkan langsung", "Salahnya di pembulatan — pakai 4 desimal maka selisihnya hilang", "Margin H1 seharusnya dibagi dua dulu sebelum dikurangkan"], a:0}];
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
var m36ok=false, m37ok=false;
try{ m36ok = localStorage.getItem("fsa_gate_m36")==="lolos"; }catch(e){}
try{ m37ok = localStorage.getItem("fsa_gate_m37")==="lolos"; }catch(e){}
var phaseTitle = (m36ok && m37ok) ? "Phase 10 Tuntas \u2713" : "Modul 38 Tuntas \u2713";
var phaseNote = (m36ok && m37ok) ? "" : "<br>Selesaikan juga <a href=\"../modul-36/\">Modul 36</a> dan <a href=\"../modul-37/\">Modul 37</a> untuk menuntaskan Phase 10.";
$("#quiz-submit").addEventListener("click", function(){
  var score = 0, picked = [], skipped = [];
  QUIZ.forEach(function(q,i){
    var sel = document.querySelector('input[name="q'+i+'"]:checked');
    picked.push(sel ? +sel.value : -1);
    try{ if(window.FSAMistake && sel && +sel.value !== q.a)
           window.FSAMistake.log(38, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>"+phaseTitle+"</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu bisa membaca cover interim (YTD vs standalone, audited vs unaudited), menurunkan kuartal standalone HANYA untuk flow dengan basis selaras, menolak mengurangkan stock dan rasio, menghitung ulang rasio dari komponen, mengannualisasi dengan konvensi + seasonality, memakai denominator rata-rata untuk NIM, dan mengkalibrasi bobot pada interim unaudited. Kembali ke <a href=\"../index.html\">FSA Lab</a>."+phaseNote+"</p>";
    try{ localStorage.setItem("fsa_gate_m38","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m38") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m38") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 6 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m38") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>"+phaseTitle+"</h3><p>Modul 38 sudah kamu lewati sebelumnya — kembali ke <a href=\"../index.html\">FSA Lab</a>.</p>";
  }
}catch(e){}
})();

