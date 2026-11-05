/* FSA Lab — Modul 31: 3-Statement Modeling (PT Cemerlang Abadi; base 2025 KANONIS, forecast 2026 ILUSTRATIF, Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
blocks:{ title:"6 building blocks — base 2025 angka KANONIS persis; forecast 2026 ILUSTRATIF (asumsi eksplisit, terartikulasi penuh)", cols:["Building block","Angka 2026","vs 2025"],
 rows:[
  {l:"1 · Revenue: penjualan +12%", v:"582.400", v2:"vs 520.000",
   d:"Penjualan 2026 = 520.000 × 1,12 = 582.400. Ini satu-satunya input 'asumsi makro' model ini: bukan hasil analisis, melainkan tebakan eksplisit yang WAJIB diuji sensitivitasnya (lihat playground S1/S2). Tanpa driver pendapatan, seluruh model tak bergerak.",
   psak:"—", lens:"Lensa investasi", f:"Setiap 1 pp growth ≈ Rp5.200 penjualan dan, dengan margin tetap, ±Rp1.419 NI (8.518 ÷ 6 pp dari S1−S2). Growth adalah tuas valuasi terbesar sekaligus asumsi paling rapuh — selalu tanya: dari mana 12% itu?"},
  {l:"2 · Margin: GM tetap 35%, opex +10%", v:"EBIT 82.840", v2:"vs 72.000",
   d:"GM tetap 35% → HPP = 582.400 × 65% = 378.560, laba kotor 203.840. Beban operasi +10% = 121.000 → EBIT 82.840. Dua asumsi independen: margin kotor (struktur biaya) dan laju opex (skala). Skenario S3/S4 menguji GM ±2 pp: NI bergeser ±9.085 — lebih tajam dari efek growth ±6 pp.",
   psak:"—", lens:"Lensa investasi", f:"Margin yang 'dipegang tetap' selamanya adalah asumsi malas — di dunia nyata GM 35% bisa tergerus kompetisi atau kenaikan bahan baku. Uji ±2 pp SEBELUM percaya NI 53.695."},
  {l:"3 · Working capital: DSO/DIO/DPO tetap", v:"ΔWC −14.960", v2:"vs −44.440",
   d:"Piutang = 73/365 × 582.400 = 116.480; persediaan = 103,67/365 × 378.560 = 107.520; utang usaha = 66,95/365 × 378.560 = 69.440; utang pajak & akrual proporsional pajak = 10.160. ΔWC 2026 = −(12.480 + 11.520) + (7.440 + 1.600) = −14.960. Pertumbuhan 'memakan' kas: makin cepat tumbuh, makin besar kas yang tertahan di WC.",
   psak:"PSAK 207", lens:"Lensa kredit", f:"DSO/DIO/DPO tetap = asumsi disiplin penagihan tak berubah. Kalau DSO melar 10 hari (S5), CFO anjlok ke 54.779 — debt service coverage ikut tertekan walau laba tetap."},
  {l:"4 · Capex & depresiasi", v:"capex 50.000", v2:"dep 32.000",
   d:"Capex 50.000 (ilustratif, > depresiasi 32.000) → aset tetap neto = 230.000 + 50.000 − 32.000 = 248.000. Capex > dep = perusahaan masih ekspansi (aset tumbuh). CFI = −50.000: kas keluar di depan, manfaatnya (penjualan +12%) masuk bertahap — mismatch waktu inilah yang membuat growth butuh pendanaan.",
   psak:"—", lens:"Lensa investasi", f:"Bandingkan capex dengan CFO 70.735 — masih ter-cover. FCFF ≈ 70.735 + 14.000×(1−0,22) − 50.000 = 31.655. Growth yang didanai kas internal = sehat; yang didanai utang baru = cerita lain."},
  {l:"5 · Debt schedule: utang bank tetap", v:"141.440", v2:"31.440 + 110.000",
   d:"Utang bank pendek 31.440 + panjang 110.000 = 141.440 TETAP — tidak ada penarikan/pelunasan baru, liabilitas sewa tetap 60.000. Arus pendanaan 2026 hanya dividen (6.000). Keputusan sadar: menahan utang tetap membuat model TIDAK sirkular (lihat blok 6) — tapi juga berarti seluruh kebutuhan kas growth ditutup dari kas internal.",
   psak:"—", lens:"Lensa kredit", f:"D/E turun 1,52x → 1,24x BUKAN karena utang dibayar, melainkan karena ekuitas naik (laba ditahan 79.440 → 127.135). Leverage membaik 'gratis' — sampai dividen dinaikkan atau buyback dimulai."},
  {l:"6 · Circularity bunga (referensi sirkular)", v:"bunga 14.000", v2:"flat — tanpa iterasi",
   d:"Bunga yang benar dihitung dari RATA-RATA utang: bunga = rate × (utang awal + utang akhir)/2. Tetapi utang akhir bergantung pada kas akhir, kas bergantung pada laba, laba bergantung pada bunga — lingkaran. Di Excel ini circular reference (butuh iterative calculation). Model ini MENGHINDARI lingkaran dengan asumsi utang tetap: rata-rata utang = 141.440 = saldo, sehingga bunga flat 14.000 tanpa iterasi.",
   psak:"—", lens:"Lensa forensik", f:"Waspadai model yang 'menyelesaikan' circularity dengan hardcode bunga lalu mengklaim utang dinamis — itu inkonsisten internal. Atau sebaliknya: utang naik tapi bunga tak naik = bunga disubsidi (red flag)."}
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
        + (r.f && r.f !== "—" ? '<div class="forensic"><strong>'+(r.lens||"Lensa") +':</strong> '+r.f+'</div>' : '');
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
renderStmt("blocks");

/* ---------- PLAYGROUND: 6 skenario sensitivitas vs base 2026 (NI 53.695, CFO 70.735) ---------- */
var CARDS = [
 {t:"Skenario 1: pertumbuhan penjualan +18% (bukan +12%)", q1:"Laba bersih vs base", q2:"CFO vs base", a1:"naik", a2:"naik",
  e:"Penjualan 613.600 → NI 62.213 (+8.518 vs base 53.695); CFO 72.584 (+1.849). Growth menaikkan laba, tapi ΔWC −21.629 menelan sebagian besar: dari +8.518 laba, hanya +1.849 yang jadi kas. Inilah 'growth eats cash'."},
 {t:"Skenario 2: pertumbuhan penjualan hanya +6%", q1:"Laba bersih vs base", q2:"CFO vs base", a1:"turun", a2:"turun",
  e:"Penjualan 551.200 → NI 45.178 (−8.518), CFO 68.886 (−1.849). Simetris dengan S1: model ini linear terhadap growth karena margin & rasio WC dipegang tetap — realitanya jarang selinear ini."},
 {t:"Skenario 3: gross margin turun ke 33%", q1:"Laba bersih vs base", q2:"CFO vs base", a1:"turun", a2:"turun",
  e:"HPP = 582.400 × 67% = 390.208 → NI 44.610 (−9.085), CFO 58.759 (−11.976). Efek margin ke kas LEBIH BESAR dari efek growth ±6 pp: margin adalah tuas yang lebih tajam — dan yang paling sering dimanipulasi."},
 {t:"Skenario 4: gross margin naik ke 37%", q1:"Laba bersih vs base", q2:"CFO vs base", a1:"naik", a2:"naik",
  e:"NI 62.781 (+9.085), CFO 82.711 (+11.976). Catatan forensik: margin yang 'naik sendiri' tanpa penjelasan struktur biaya = asumsi paling sering dipakai untuk mempercantik model jualan."},
 {t:"Skenario 5: DSO/DIO/DPO masing-masing +10 hari", q1:"Laba bersih vs base", q2:"CFO vs base", a1:"tetap", a2:"turun",
  e:"NI tetap 53.695 — P&L tak tersentuh. Tapi CFO anjlok ke 54.779 (−15.956): ΔWC −30.916. Laba bukan kas. Model yang hanya memproyeksi P&L akan melewatkan lubang kas ini sepenuhnya."},
 {t:"Skenario 6: DSO/DIO/DPO masing-masing −10 hari", q1:"Laba bersih vs base", q2:"CFO vs base", a1:"tetap", a2:"naik",
  e:"NI tetap 53.695; CFO naik ke 86.691 (+15.956) karena ΔWC hampir nol (+996). Efisiensi modal kerja adalah 'laba' yang tak muncul di income statement — tapi muncul di kas."}
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
    try{ localStorage.setItem("fsa_pg_m31", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
  }
  $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  r.scrollIntoView({behavior:"smooth", block:"center"});
}
renderPg();

/* ---------- LAB RASIO: 4 hitungan forecast ---------- */
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
 {q:"Laba bersih forecast 2026", hint:"PBT 68.840 − pajak 22% (15.144,8) — Rp juta", ans:53695, dec:false, tol:1,
  why:"53.695 = 68.840 − 15.144,8. Cek artikulasi: NI = PBT − pajak — kalau baris ini tak cocok, seluruh model di bawahnya salah."},
 {q:"CFO forecast 2026 (indirect method)", hint:"NI 53.695 + depresiasi 32.000 + ΔWC (−14.960) — Rp juta", ans:70735, dec:false, tol:1,
  why:"70.735 = 53.695 + 32.000 − 14.960. ΔWC negatif karena pertumbuhan menahan kas di piutang & persediaan (PSAK 207)."},
 {q:"D/E ratio 2026", hint:"Total liabilitas 281.040 ÷ ekuitas 227.135", ans:1.24, tol:0.02,
  why:"1,24x — turun dari 1,52x. BUKAN karena utang dibayar (utang bank tetap 141.440), melainkan ekuitas naik via laba ditahan 127.135."},
 {q:"Interest coverage 2026", hint:"EBIT 82.840 ÷ beban bunga 14.000", ans:5.92, tol:0.05,
  why:"5,92x — naik dari 5,14x. Setiap rupiah bunga ditutup 5,92 rupiah EBIT. Headroom nyaman — tapi ingat: ini forecast, bukan janji."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 53.695">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 53.695)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — model ini memproyeksi NI 53.695 (+18,7% vs 2025) dan CFO 70.735. Kalau kamu analis buy-side: asumsi mana yang paling menentukan valuasi, dan berapa 'margin of safety' yang kamu potong dari NI ini sebelum membayar? Tulis 3 baris: asumsi paling rapuh, uji sensitivitas yang kamu jalankan, keputusanmu.",
 credit:"Lensa kredit — D/E 1,24x, coverage 5,92x, utang bank flat 141.440, CFO 70.735 vs debt service (bunga 14.000 + cicilan?). Di mana model ini rapuh bagi kreditur? Tulis 3 baris: kualitas proyeksi kas, skenario yang bikin covenant jebol, mitigasimu.",
 forensic:"Lensa forensik — model ini 'menghindari' circularity dengan asumsi utang tetap, memegang GM 35% dan DSO/DIO/DPO tetap. Sebagai forensik: di titik mana asumsi 'tetap' ini bisa menyembunyikan masalah nyata? Tulis 3 baris: asumsi paling mencurigakan, angka yang kamu cek ulang ke sumber, langkah berikut."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m31_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m31_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"Bunga 2026 diasumsikan 14.000 karena utang bank tetap 141.440. Kapan perhitungan bunga menjadi SIRKULAR (circular reference)?", o:["Tidak pernah terjadi — bunga forecast selalu boleh diasumsikan tetap karena circular reference hanya masalah teori, bukan praktik pemodelan keuangan", "Ketika utang berubah di tengah tahun: bunga butuh rata-rata utang, rata-rata utang butuh kas akhir, kas butuh laba, laba butuh bunga", "Hanya ketika tarif pajak berubah — pajak memengaruhi beban bunga efektif tahun berjalan", "Hanya ketika perusahaan membayar dividen — dividen mengurangi kas sehingga utang bertambah"], a:1},
 {q:"DSO 2025 = 73,0 hari. Dengan asumsi DSO tetap dan penjualan 2026 = 582.400, piutang usaha 2026 = …", o:["116.480 (= 73/365 × 582.400)", "104.000 (= piutang 2025, tanpa penyesuaian penjualan)", "96.000 (= 60/365 × 582.400 — salah ambil DSO)", "120.960 (= 73/365 × 604.800 — salah ambil penjualan)"], a:0},
 {q:"Skenario WC days +10 hari: NI tetap 53.695, tetapi CFO turun dari 70.735 ke 54.779. Pelajaran yang TEPAT…", o:["Model rusak — NI yang tetap membuktikan ada kesalahan rumus di arus kas", "Angka tidak konsisten — CFO seharusnya tidak bisa turun bila NI tetap", "Laba bukan kas: tambahan 10 hari menahan ±15.956 kas di modal kerja", "Modal kerja tidak memengaruhi kas — kas hanya dipengaruhi laba dan capex"], a:2},
 {q:"Capex 50.000 > depresiasi 32.000. Dampak ke neraca 2026?", o:["Aset tetap neto naik 18.000 → 248.000", "Aset tetap neto turun 18.000 → 212.000", "Tidak ada dampak ke neraca — capex hanya memindahkan kas", "Ekuitas naik 18.000 karena aset bertambah"], a:0},
 {q:"D/E 2026 = 1,24x vs 2025 = 1,52x. Penjelasan yang TEPAT…", o:["Perusahaan membayar sebagian utang bank sehingga pembilang D/E menyusut sementara ekuitas relatif stabil", "Utang tetap, ekuitas naik (laba ditahan 79.440 → 127.135) sehingga leverage membaik", "Total aset menyusut sehingga rasio utang terhadap ekuitas ikut turun", "Beban bunga turun sehingga laba ditahan — dan ekuitas — naik lebih cepat"], a:1}];
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
           window.FSAMistake.log(31, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Phase 8 Tuntas ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu membangun model 3-statement yang terartikulasi: NI = PBT − pajak, A = L + E, dan CFO = NI + dep + ΔWC — semuanya cocok sampai rupiah terakhir. Lanjut ke <a href=\"../modul-32/\">Modul 32</a>. 🎓</p>";
    try{ localStorage.setItem("fsa_gate_m31","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m31") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m31") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m31") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Phase 8 Tuntas ✓</h3><p>Modul 31 sudah kamu lewati sebelumnya — lanjut ke <a href=\"../modul-32/\">Modul 32</a>.</p>";
  }
}catch(e){}
})();
