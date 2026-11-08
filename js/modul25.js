/* FSA Lab — Modul 25: Skor Forensik Lanjutan (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
fscore:{ title:"Piotroski F-score (2000): 9 tes biner, 1 poin per tes lolos — Cemerlang 2025 vs 2024", cols:["Tes","Nilai","Skor"],
 rows:[
  {l:"1 · ROA positif", v:"10,0% > 0", v2:"1",
   d:"ROA 2025 = 45.240 ÷ 451.440 = 10,0%. Tes lolos — perusahaan mencetak laba, bukan rugi. Kerugian hanya membuat tes INI gagal — delapan tes lain (CFO, ΔROA, akrual, leverage, likuiditas, penerbitan saham, margin, perputaran aset) tetap memberi informasi dan dibaca sendiri-sendiri: skor biner per tes tidak membatalkan satu sama lain.",
   psak:"—", f:"Analis: cek kualitas ROA — ROA naik karena operasi atau karena one-off jual aset 8.000 (M11)?"},
  {l:"2 · CFO positif", v:"30.800 > 0", v2:"1",
   d:"CFO 2025 = Rp30.800 juta > 0. Tes lolos. Piotroski tidak peduli besarnya — hanya tandanya. Tanda positif = bisnis masih menghasilkan kas operasi.",
   psak:"PSAK 207 (dulu 2) (arus kas)", f:"CFO positif tapi MENYUSUT dari 44.000 — trennya memburuk walau tes lolos. Skor biner buta terhadap tren."},
  {l:"3 · ΔROA naik", v:"10,0% vs 7,8%", v2:"1",
   d:"ROA 2024 = 29.640 ÷ 378.200 = 7,8%. Naik 2,2 poin → lolos. Profitabilitas membaik tahun-ke-tahun, salah satu penanda 'winner' menurut Piotroski.",
   psak:"—", f:"Kreditur suka tren naik — tapi tanya: kenaikan ROA datang dari penjualan (+30%) atau dari aset yang belum direvaluasi?"},
  {l:"4 · Accrual: CFO > NI", v:"30.800 < 45.240", v2:"0 — GAGAL",
   d:"Tes ini GAGAL: CFO 30.800 < laba bersih 45.240 → akrual = 14.440 (NI − CFO). Ini BUKAN bug perhitungan — ini justru inti tesnya: laba yang tidak didukung kas operasi adalah peringatan kualitas laba (lihat M2: Sloan accruals 3,2%).",
   psak:"PSAK 207 (dulu 2)", f:"Akrual 14.440 didorong ΔWC (44.440): piutang +49.000, persediaan +16.000. Laba naik, kas turun — pola klasik yang wajib diselidiki sebelum percaya F-score 8."},
  {l:"5 · ΔLeverage turun", v:"37,7% vs 41,8%", v2:"1",
   d:"Leverage = long-term debt ÷ total aset. 2025: (110.000 + 60.000) ÷ 451.440 = 37,7%; 2024: (100.000 + 58.000) ÷ 378.200 = 41,8%. Turun → lolos. Perusahaan tidak menambah utang jangka panjang lebih cepat dari asetnya.",
   psak:"PSAK 116 (dulu 73) (liabilitas sewa dihitung)", f:"Utang bank panjang naik 10.000 tapi rasio turun karena aset tumbuh. Rasio bisa 'membaik' sementara nominal utang naik — baca keduanya."},
  {l:"6 · ΔLiquidity naik", v:"CR 2,17 vs 2,10", v2:"1",
   d:"Current ratio 2025 = 221.440 ÷ 102.000 = 2,17; 2024 = 168.200 ÷ 80.000 = 2,10. Naik tipis → lolos. Kemampuan bayar kewajiban jangka pendek membaik.",
   psak:"—", f:"CR naik 0,07 — tipis. Dan komposisinya: kas TURUN 11.760 sementara piutang naik. Likuiditas 'naik' yang komposisinya memburuk."},
  {l:"7 · Tanpa penerbitan saham", v:"100.000 = 100.000", v2:"1",
   d:"Modal disetor tetap Rp100.000 juta — tidak ada penerbitan saham baru. Piotroski menghukum penerbitan saham karena sinyal perusahaan butuh modal eksternal / mendilusi pemegang saham. Lolos.",
   psak:"—", f:"Tidak ada dilusi — EPS 452,4 adalah pertumbuhan organik, bukan hasil pembagi yang menyusut."},
  {l:"8 · ΔGross margin naik", v:"35,0% vs 34,0%", v2:"1",
   d:"Gross margin 2025 = 182.000 ÷ 520.000 = 35,0%; 2024 = 136.000 ÷ 400.000 = 34,0%. Naik 1 poin → lolos. Efisiensi produksi / pricing power membaik.",
   psak:"PSAK 202 (persediaan)", f:"Margin naik 1 poin — tapi cek M6: ada indikasi transfer pricing 30.000 yang bisa menggeser margin antar entitas."},
  {l:"9 · ΔAsset turnover naik", v:"1,15x vs 1,06x", v2:"1",
   d:"Asset turnover 2025 = 520.000 ÷ 451.440 = 1,15x; 2024 = 400.000 ÷ 378.200 = 1,06x. Naik → lolos. Setiap rupiah aset menghasilkan penjualan lebih besar.",
   psak:"—", f:"Turnover naik didorong penjualan +30% — tapi piutang naik +89%. Penjualan 'efisien' yang belum tertagih."},
  {l:"TOTAL F-SCORE", v:"8 / 9", v2:"✓",
   d:"Skor 8/9 → kekuatan fundamental umum yang kuat (Piotroski: 7–9 = general strength, bukan label \u2018value stock\u2019). Delapan tes lolos, satu gagal — dan satu-satunya yang gagal justru yang paling forensik: accrual. Kesimpulan jujur: fundamental KUAT, kualitas laba PERLU DISELIDIKI.",
   psak:"—", f:"Inilah pelajaran modul ini: skor agregat bisa menutupi satu tes yang gagal. Analis forensik membaca rincian 9 tes, bukan cuma angka 8."}
 ]},
models:{ title:"Model forensik lain: dari akrual diskresioner sampai probabilitas distress", cols:["Model","Inti","Keterangan"],
 rows:[
  {l:"Dechow F-score (2011)", v:"Probabilitas misstatement", v2:"ilustratif",
   d:"Dechow et al. (2011) memprediksi kemungkinan salah saji material dalam 3 langkah: (1) skor = −7,893 + 0,790·RSST + 2,518·ΔREC + 1,191·ΔINV + 1,979·SOFT + 0,171·ΔCS − 0,932·ΔROA + 1,029·ISSUE; (2) probabilitas = 1/(1+e^(−skor)); (3) F-score = probabilitas ÷ 0,0037 (baseline). F > 1,00 = risiko di atas normal; F > 2,48 = risiko tinggi. Definisi variabel (diskalakan rata-rata total aset, kecuali SOFT & ISSUE): RSST = perubahan akrual luas (Δmodal kerja non-kas + Δaset operasi non-lancar neto + Δaset keuangan neto); ΔREC = perubahan piutang; ΔINV = perubahan persediaan; SOFT = aset BUKAN kas & PPE (piutang, persediaan, aset takberwujud, goodwill) ÷ total aset; ΔCS = perubahan penjualan tunai (penjualan − kenaikan piutang); ΔROA = perubahan laba ÷ rata-rata aset; ISSUE = 1 bila perusahaan menerbitkan saham/utang tahun itu, 0 bila tidak. Sumber: Dechow et al. (2011), 'Predicting Material Accounting Misstatements', Contemporary Accounting Research, Model 1 — sampel estimasi perusahaan publik AS yang dikenai AAER SEC, sehingga ambang di luar AS bersifat relatif, bukan absolut. Contoh ILUSTRATIF (bukan angka Cemerlang), hitung penuh: perusahaan X: RSST 0,20; ΔREC 0,565; ΔINV 0,15; SOFT 0,70; ΔCS 0,10; ΔROA 0,05; ISSUE 0. (1) Skor = −7,893 + 0,158 + 1,423 + 0,179 + 1,385 + 0,017 − 0,047 + 0 = −4,78. (2) Probabilitas = 1/(1+e^4,78) = 0,00834. (3) F = 0,00834 ÷ 0,0037 = 2,25 → zona waspada, sudah mendekati ambang risiko tinggi 2,48.",
   psak:"PSAK 208 (dulu 25) (koreksi & salah saji)", f:"Dechow = Beneish (M2) yang diperbarui. Pakai untuk memprioritaskan audit: F tinggi → baca catatan piutang & persediaan dulu."},
  {l:"Jones / Modified Jones (1991/1995)", v:"Discretionary accruals", v2:"ilustratif",
   d:"Model Jones memisahkan total accruals menjadi non-discretionary (normal, dijelaskan bisnis) dan discretionary (residu regresi — kandidat earnings management). Langkah: (1) regresi total accruals/TA terhadap 1/TA, Δrevenue/TA, PPE/TA; (2) Modified Jones: kurangi Δreceivables dari Δrevenue (penjualan kredit lebih mudah dimanipulasi); (3) residu = discretionary accruals. Contoh ILUSTRATIF: total accruals 14.440, model memprediksi normal 9.000 → discretionary ≈ 5.440 → flag untuk diuji lebih dalam.",
   psak:"PSAK 208 (dulu 25), PSAK 115 (dulu 72) (pengakuan pendapatan)", f:"Residu besar + DSO melar (Cemerlang: 73 hari) = pola pengakuan pendapatan agresif. Jones memberi angka pada kecurigaan itu."},
  {l:"Ohlson O-score (1980)", v:"Probabilitas kebangkrutan", v2:"ilustratif",
   d:"Ohlson memakai regresi logit dengan 9 variabel: (1) log(TA/GNP index), (2) total liabilities/TA, (3) WC/TA, (4) current liabilities/current assets, (5) 1 jika TL > TA, (6) NI/TA, (7) CFO/TL, (8) 1 jika NI negatif 2 tahun beruntun, (9) ΔNI/(|NI_t|+|NI_{t−1}|). Output = probabilitas distress 0–100%. Contoh ILUSTRATIF: perusahaan Y dengan TL/TA 0,85 dan NI negatif 2 tahun — dengan seluruh 9 input terisi (tujuh input lain tidak ditampilkan di sini), model menghasilkan O-score ≈ 12% → jauh di atas ambang waspada 3,8%. Angka 12% di sini adalah OUTPUT ILUSTRATIF yang diasumsikan, bukan hasil hitungan dari 2 input di atas — dua input tidak cukup untuk menghitung logit 9 variabel.",
   psak:"PSAK 201 (dulu 1) (kelangsungan usaha)", f:"O-score melengkapi Altman: Altman = jarak ke distress, Ohlson = probabilitasnya. Kreditur memakai keduanya sebelum menyetujui covenant."},
  {l:"Altman Z / Z′ / Z″", v:"Zona distress", v2:"2,26 (grey)",
   d:"Cemerlang tidak tercatat di bursa → varian yang TEPAT adalah Z′ (perusahaan privat): Z′ = 0,717·X1 + 0,847·X2 + 3,107·X3 + 0,420·X4 + 0,998·X5 dengan X4 = book equity ÷ total liabilitas. Cemerlang: X1 0,26 / X2 0,18 / X3 0,16 / X4 0,66 / X5 1,15 → Z′ = 2,26 → GREY ZONE (1,23–2,90). Z″ (non-manufaktur): tanpa X5 → 4,07 (safe). CATATAN: angka 2,64 yang kadang muncul = HIBRIDA ILUSTRATIF (bobot Z klasik × X4 ekuitas buku), BUKAN varian Altman resmi — klasik aslinya memakai market value ekuitas. Satu perusahaan, tiga angka, dua zona — pilih varian sesuai konteks!",
   psak:"—", f:"Lensa kredit: Z′ 2,26 = belum distress, belum aman → covenant ketat + monitoring triwulanan. Z″ yang 'safe' jangan dipakai untuk membatalkan covenant — varian salah = kesimpulan salah."}
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
renderStmt("fscore");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Laba naik, CFO tetap — akrual melebar", q1:"Skor tes ACCRUAL", q2:"Kewaspadaan forensik", a1:"tetap", a2:"naik",
  e:"Tes accrual sudah 0 (CFO < NI) dan tetap 0 — skornya 'tetap'. Tapi akrual yang MELEBAR = red flag Sloan: laba tidak jadi kas. Skor agregat tidak bergerak, risikonya naik."},
 {t:"Rights issue: penerbitan saham baru Rp20.000", q1:"Skor tes EQ_OFFER", q2:"F-score total", a1:"turun", a2:"turun",
  e:"Penerbitan saham baru = tes no-equity-issuance gagal → −1 poin (8 → 7). Masuk akal: perusahaan butuh modal eksternal, dan EPS terdilusi."},
 {t:"Gross margin turun 35,0% → 33,0% tahun depan", q1:"Skor tes ΔMARGIN", q2:"F-score total", a1:"turun", a2:"turun",
  e:"Δmargin gagal (arah turun) → −1 poin. Perhatikan: Piotroski hanya peduli ARAH, bukan level — margin 33% masih 'bagus' di mata pasar, tapi tesnya gagal."},
 {t:"ROA naik karena laba one-off jual aset", q1:"Skor tes ΔROA", q2:"Kewaspadaan forensik", a1:"tetap", a2:"naik",
  e:"Tes ΔROA lolos (arah naik) — skornya 'tetap' 1. Tapi one-off = kualitas rendah: Piotroski buta terhadap kualitas, analis forensik tidak. Normalisasi dulu (M11)."},
 {t:"Current ratio naik 2,17 → 2,50 karena persediaan menumpuk", q1:"Skor tes ΔLIQUID", q2:"Risiko obsolescence (DIO)", a1:"tetap", a2:"naik",
  e:"CR naik 2,17 → 2,50, tapi tes ΔLIQUID SUDAH lolos (skor 1) dan tetap lolos — skornya 'tetap', bukan 'naik': tes Piotroski hanya peduli lolos/gagal, bukan besarnya kenaikan. Tapi persediaan menumpuk — dengan asumsi HPP tetap — = DIO naik + risiko penurunan nilai (PSAK 202). Likuiditas 'baik' yang komposisinya memburuk — baca neracanya, bukan cuma rasionya."},
 {t:"Harga pasar ekuitas anjlok 40% — fundamental tetap", q1:"Altman Z (via X4)", q2:"F-score Piotroski", a1:"turun", a2:"tetap",
  e:"Varian KLASIK memakai X4 = market value ÷ liabilitas → Z turun karena pasar panik. F-score murni akuntansi → tetap. (Catatan: angka kanonis Cemerlang memakai X4 = book equity.) Pelajaran: skor pasar dan skor akuntansi mengukur hal berbeda — gabungkan, jangan ganda-hitung."}
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
    try{ localStorage.setItem("fsa_pg_m25", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
  }
  $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  r.scrollIntoView({behavior:"smooth", block:"center"});
}
renderPg();

/* ---------- RATIO LAB: kalkulator Altman ---------- */
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

var ALTMAN = {
 z:      {name:"Hibrida ilustratif (bobot klasik × book equity)", coef:[1.2,1.4,3.3,0.6,1.0], safe:2.99, grey:1.81,
          note:"X4 = book equity ÷ total liabilitas (klasik aslinya memakai market value ekuitas). Zona: aman >2,99 · grey 1,81–2,99 · distress <1,81. Peringatan: ini BUKAN varian Altman resmi."},
 zprime: {name:"Z′ (perusahaan privat)", coef:[0.717,0.847,3.107,0.420,0.998], safe:2.90, grey:1.23,
          note:"X4 = BOOK value ekuitas ÷ total liabilitas. Zona: aman >2,90 · grey 1,23–2,90 · distress <1,23."},
 zdbl:   {name:"Z″ (non-manufaktur / emerging)", coef:[6.56,3.26,6.72,1.05,0], safe:2.60, grey:1.10,
          note:"Tanpa X5 (penjualan) — untuk jasa & pasar berkembang. Zona: aman >2,60 · grey 1,10–2,60 · distress <1,10."}
};
var XLABELS = [
 "X1 = working capital ÷ total aset",
 "X2 = retained earnings ÷ total aset",
 "X3 = EBIT ÷ total aset",
 "X4 = book equity ÷ total liabilitas",
 "X5 = penjualan ÷ total aset"
];
(function(){
  var h = '<div class="ratio-card"><h3>Kalkulator Altman</h3>'
    + '<p class="sub">Angka kanonis Cemerlang sudah terisi — ubah untuk simulasi.</p>';
  XLABELS.forEach(function(x,i){
    var pre = [0.26,0.18,0.16,0.66,1.15][i];
    h += '<p class="sub" style="margin:.4rem 0 .15rem">'+x+'</p>'
      + '<div class="ratio-in"><input id="ax'+i+'" inputmode="decimal" value="'+pre+'"></div>';
  });
  h += '<p class="sub" style="margin:.6rem 0 .15rem">Varian</p>'
    + '<div class="ratio-in"><select id="avariant" style="font-family:var(--font-mono);font-size:1rem;border:2px solid var(--ink);border-radius:8px;padding:.4rem;max-width:100%;">'
    + '<option value="zprime" selected>Z′ (perusahaan privat)</option>'
    + '<option value="z">Hibrida ilustratif (bobot klasik × book equity)</option>'
    + '<option value="zdbl">Z″ (non-manufaktur)</option>'
    + '</select> <button id="abtn" style="background:var(--ink);color:var(--paper);border:2px solid var(--ink);border-radius:10px;padding:.7rem 1.4rem;font-weight:700;font-size:1rem;min-height:48px;min-width:120px;cursor:pointer;box-shadow:3px 3px 0 rgba(25,43,43,.25);">Hitung Z</button></div>'
    + '<div class="pg-result" id="ares"></div></div>';
  $("#ratio-wrap").innerHTML = h;
  $("#abtn").addEventListener("click", function(){
    var xs = [], bad = false;
    for(var i=0;i<5;i++){
      var v = parseIDNumber($("#ax"+i).value, true);  // R1: X1-X5 rasio, bukan mata uang
      if(isNaN(v)){ bad = true; break; }
      xs.push(v);
    }
    var el = $("#ares");
    el.className = "pg-result show";
    if(bad){ el.innerHTML = "Semua X1–X5 harus angka (contoh: 0,26)."; return; }
    var v = $("#avariant").value, A = ALTMAN[v];
    var z = 0, parts = [];
    for(var k=0;k<5;k++){
      var term = A.coef[k]*xs[k];
      z += term;
      if(A.coef[k] !== 0) parts.push(A.coef[k]+"×"+xs[k].toFixed(2));
    }
    var zone = z > A.safe ? "SAFE ✓" : (z >= A.grey ? "GREY ZONE ⚠" : "DISTRESS ✗");
    var verdict = v === "z"
      ? "Hibrida ilustratif (bobot klasik × ekuitas buku). Ini BUKAN varian Altman resmi — klasik aslinya memakai market value ekuitas."
      : (v === "zprime" && Math.abs(z-2.26) < 0.05 ? "Cocok dengan angka kanonis: Z′ = 2,26 → grey zone (1,23–2,90)."
        : (v === "zprime" ? "Hasil hitunganmu: Z′ = "+z.toFixed(2)+" → "+zone+". (Contoh default: 2,26 → grey zone.)"
        : "Hasil hitunganmu: Z″ = "+z.toFixed(2)+" → "+zone+". Satu perusahaan, zona berbeda — pilih varian sesuai konteks!"));
    el.innerHTML = "<strong>"+A.name+": Z = "+z.toFixed(2)+" → "+zone+"</strong><br>"
      + "<span class='num' style='font-size:.82rem'>"+parts.join(" + ")+" = "+z.toFixed(2)+"</span><br>"
      + A.note+"<br>"+verdict;
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — F-score 8/9 = fundamental kuat (general strength), tapi tes accrual gagal dan Altman grey. Apakah kamu beli di harga ilustratif Rp5.600? Tulis 3 baris: kualitas laba, margin of safety, keputusanmu.",
 credit:"Lensa kredit — Z′ 2,26 (grey), D/E 1,52x, coverage 5,14x. Berapa covenant yang kamu pasang? Tulis 3 baris: leverage, likuiditas, syarat kreditmu.",
 forensic:"Lensa forensik — Skor agregat 8 menutupi 1 tes gagal. Tulis 3 cek lanjutan: akrual 14.440, DSO 73 hari, dan M-score −1,65 yang SUDAH melewati ambang −1,78 (terflag, perlu investigasi)."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m25_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m25_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"F-score Cemerlang 2025 = 8/9, tapi tes ACCRUAL gagal: CFO 30.800 < NI 45.240. Interpretasi yang PALING tepat…", o:["Skor 8 dari 9 berarti perusahaan bersih — satu tes yang gagal tidak penting dan boleh diabaikan sepenuhnya oleh analis fundamental","Perusahaan pasti memanipulasi laba — jual semua sahamnya sekarang juga tanpa analisis tambahan","Fundamental kuat, tapi ada peringatan kualitas laba (akrual 14.440) yang wajib diselidiki — baca rincian, bukan cuma angka 8","Satu tes yang gagal membuat seluruh F-score tidak valid — hitung ulang dari nol dengan data berbeda"], a:2},
 {q:"Menurut Piotroski (2000), skor 8 dari 9 menempatkan perusahaan di zona…", o:["7–9: general strength — kekuatan fundamental umum yang kuat","Skor 4–6: zona abu-abu tanpa sinyal investasi yang jelas bagi analis","Skor 8 masih di bawah ambang 'winner' Piotroski","Hanya skor 9 yang dianggap value stock oleh Piotroski (2000)"], a:0},
 {q:"Altman Z′ Cemerlang = 2,26 dengan cut-off Z′ (aman >2,90; distress <1,23). Artinya…", o:["Aman — Z′ 2,26 sudah jauh dari ambang distress 1,23 sehingga risiko bangkrut kecil sekali dalam waktu dekat","Distress — harus segera restrukturisasi utang perusahaan","Model Altman tidak bisa dipakai untuk perusahaan di Indonesia","Grey zone 1,23–2,90: belum aman, belum distress — kreditur perlu covenant & monitoring"], a:3},
 {q:"Cemerlang diasumsikan tidak tercatat di bursa (tanpa harga pasar). Varian Altman yang PALING tepat…", o:["Z klasik dengan harga pasar yang ditebak-tebak analis","Z′: ganti market value di X4 dengan book value of equity ÷ total liabilities","Z″: hilangkan komponen X4 sekalian karena perusahaan tidak tercatat di bursa efek","Tidak ada — Altman hanya berlaku untuk perusahaan TBK"], a:1},
 {q:"Modified Jones mengukur discretionary accruals dengan cara…", o:["Selisih NI − CFO secara langsung tanpa regresi — itu pendekatan Sloan terhadap kualitas akrual, bukan Modified Jones","Menghitung Beneish M-score dari delapan rasio keuangan perusahaan tercatat","Meregresi total accruals terhadap Δrevenue (dikurangi Δreceivables), PPE — residunya = discretionary accruals","Menghitung Dechow F-score dari sembilan sinyal dalam laporan keuangan untuk mendeteksi manipulasi laba perusahaan"], a:2}];
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
           window.FSAMistake.log(25, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). "
      + "Kamu membaca skor forensik seperti analis: agregat + rincian + zona. "
      + "Satu tes gagal bisa lebih penting dari delapan yang lolos.</p>"
      + "<p style='margin-top:1rem'><a class='btn btn-primary' href='../modul-26/' style='text-decoration:none'>Lanjut ke Modul 26 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m25","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m25") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m25") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m25") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 25 sudah kamu lewati sebelumnya.</p>"
      + "<p style='margin-top:1rem'><a class='btn btn-primary' href='../modul-26/' style='text-decoration:none'>Lanjut ke Modul 26 →</a></p>";
  }
}catch(e){}
})();
