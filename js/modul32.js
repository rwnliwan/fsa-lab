/* FSA Lab — Modul 32: SAK EP/EMKM & Pajak Deep-Dive (PT Cemerlang Abadi 2025, kanonis; rincian fiskal ilustratif) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
rezim:{ title:"Peta rezim — siapa pakai standar apa & kena pajak apa; salah pilih rezim = salah baca angka", cols:["Rezim","Siapa","Ciri kunci"],
 rows:[
  {l:"PSAK penuh", v:"akuntabilitas publik", v2:"pengungkapan terlengkap",
   d:"Wajib untuk entitas berakuntabilitas publik: emiten, bank, asuransi, dan entitas yang mengelola aset pihak lain dalam kapasitas fidusia (definisi PSAK 1). Cemerlang Abadi — dengan utang bank Rp141.440 juta dan publikasi penuh — dianalisis dengan lensa PSAK penuh.",
   psak:"PSAK 1", f:"Kredit: emiten wajib menyampaikan laporan tahunan (POJK 29/2016). Forensik: 'akuntabilitas publik' bukan soal ukuran — perusahaan Rp50 miliar tanpa investor publik tidak wajib PSAK penuh."},
  {l:"SAK EP", v:"privat, tanpa akuntabilitas publik", v2:"pengungkapan jauh lebih ringkas",
   d:"Standar Akuntansi Keuangan Entitas Privat — menggantikan SAK ETAP (efektif 2025, DSAK IAI). Untuk PT/CV tertutup yang tidak punya investor publik. Diadopsi dari IFRS for SMEs dengan penyederhanaan: opsi pengukuran lebih sedikit dan pengungkapan jauh lebih ringkas dibanding PSAK penuh.",
   psak:"—", f:"Kredit: laporan SAK EP tidak sedetail PSAK — comparability terbatas antar-rezim. Tutupi dengan covenant & informasi tambahan, bukan dengan asumsi."},
  {l:"SAK EMKM", v:"mikro–kecil–menengah", v2:"basis biaya historis",
   d:"Untuk entitas mikro, kecil, dan menengah — kriteria PP 7/2021: mikro penjualan ≤ Rp2 miliar/tahun; kecil Rp2–15 miliar; menengah Rp15–50 miliar. Sangat sederhana: basis biaya historis, tanpa pajak tangguhan, tanpa banyak opsi pengukuran.",
   psak:"—", f:"Forensik: SAK EMKM tidak mengenal pajak tangguhan — jangan cari DTA/DTL di neracanya. Investasi: kualitas laba UMKM = kualitas kas; akrualnya tipis."},
  {l:"PPh badan non-final", v:"PKP × 22%", v2:"kredit pajak bisa dipakai",
   d:"Tarif PPh badan 22% (UU PPh Pasal 17; dikukuhkan permanen oleh UU 7/2021). Dikenakan atas Penghasilan Kena Pajak (PKP) SETELAH rekonsiliasi fiskal — bukan atas laba akuntansi. PPh 21/23/25 yang sudah dipotong atau dibayar menjadi kredit pajak pengurang PPh terutang.",
   psak:"PSAK 212 (dulu PSAK 46)", f:"Investasi: ETR akuntansi ≠ 22% belum tentu masalah — bedakan beda tetap (permanen) vs beda waktu (berbalik). Lihat tab Rekonsiliasi Fiskal."},
  {l:"PPh final — PPh Pasal 4 ayat (2)", v:"sewa tanah/bangunan, dll", v2:"final: tidak dikreditkan",
   d:"Penghasilan tertentu dipotong FINAL: sewa tanah dan/atau bangunan 10% (PP 34/2017), pengalihan hak atas tanah/bangunan 2,5%, bunga deposito 20%, jasa konstruksi (PP 51/2008). Final = selesai di situ: tidak masuk PKP, tidak bisa dikreditkan, tidak bisa dirugikan.",
   psak:"—", f:"Kredit: pendapatan final memperkecil objek PPh non-final. Forensik: waspadai 'jasa' yang seharusnya kena PPh 23 (non-final) tapi disulap menjadi objek final."},
  {l:"PPh 21 / 23 / 25 / 29", v:"withholding & angsuran", v2:"alur kas pajak",
   d:"PPh 21: pemotongan atas gaji/upah pegawai (UU PPh Psl 21). PPh 23: pemotongan atas jasa 2% dan dividen/bunga/royalti 15% (UU PPh Psl 23) — menjadi kredit pajak. PPh 25: angsuran bulanan = (PPh terutang tahun lalu − kredit pajak tahun lalu) ÷ 12. PPh 29: kurang bayar tahun berjalan, dilunasi sebelum SPT Tahunan.",
   psak:"—", f:"Kredit: PPh 25 hanya TIMING kas — angsuran besar bukan beban baru. Coba kartu 5 di playground."},
  {l:"Sengketa pajak", v:"keberatan → banding → PK", v2:"diungkap PSAK 237",
   d:"Bila tidak setuju dengan SKP: keberatan ke DJP (UU KUP Psl 25) → banding ke Pengadilan Pajak (Psl 27 jo. UU 14/2002) → peninjauan kembali ke Mahkamah Agung. Selama sengketa berjalan, potensi kewajiban diungkap sebagai kontinjensi — bukan diakui sebagai utang, kecuali probable & terukur.",
   psak:"PSAK 237 (dulu PSAK 57)", f:"Forensik: sengketa pajak material yang tidak diungkap = red flag dokumen. Kredit: masukkan skenario kalah ke downside kas (coba kartu 3 di playground)."}
 ]},
fiskal:{ title:"Rekonsiliasi fiskal Cemerlang Abadi 2025 (Rp juta, rincian ilustratif) — dari laba akuntansi ke pajak yang benar-benar terutang", cols:["Pos","Rp juta","Arti"],
 rows:[
  {l:"PBT — laba akuntansi sebelum pajak", v:"58.000", v2:"titik berangkat",
   d:"Laba sebelum pajak menurut PSAK dari laporan laba rugi (kanonis: 58.000). Pajak dihitung BUKAN dari angka ini, melainkan dari PKP setelah koreksi fiskal — di sinilah banyak analis pemula tersesat.",
   psak:"—", f:"—"},
  {l:"(+) Koreksi beda tetap", v:"4.000", v2:"permanen",
   d:"Biaya yang diakui akuntansi tapi TIDAK boleh dikurangkan fiskal — ilustratif: entertainment & natura yang TIDAK memenuhi syarat (mis. natura mewah non-operasional). Catatan: aturan DJP kini membolehkan natura tertentu sebagai biaya untuk mendapatkan/menagih/memelihara penghasilan — kualifikasi faktanya, bukan blanket rule. Menambah PKP selamanya: tidak menimbulkan DTA/DTL karena tidak akan pernah berbalik.",
   psak:"PSAK 212 (dulu PSAK 46)", f:"Investasi: beda tetap menaikkan ETR akuntansi secara permanen. Forensik: beda tetap yang tumbuh tiap tahun = gaya hidup manajemen dibiayai perusahaan."},
  {l:"(−) Koreksi beda tetap", v:"(4.000)", v2:"permanen",
   d:"Penghasilan yang dikenakan PPh FINAL (ilustratif: sewa tanah/bangunan) — dikeluarkan dari PKP karena pajaknya sudah selesai di sumber. Mengurangi PKP selamanya; juga tidak menimbulkan DTA/DTL. Ilustrasi: pajak final atas penghasilan ini diabaikan. Catatan: di sini dua beda tetap (+4.000 dan −4.000) saling meniadakan sehingga ETR tetap 22,0% — bila tidak netral, beda tetap permanen MENGUBAH ETR (lihat kartu skenario 1 di playground).",
   psak:"PSAK 212 (dulu PSAK 46)", f:"Investasi: penghasilan final = margin 'bersih pajak' — jangan bandingkan langsung dengan margin kena pajak normal."},
  {l:"(−) Koreksi beda waktu", v:"(6.000)", v2:"temporer",
   d:"Selisih waktu pengakuan akuntansi vs fiskal — ilustratif: pembalikan DTA periode lalu (provisi yang dulu membentuk DTA kini boleh dikurangkan fiskal). Mengurangi PKP Rp6.000 juta tahun ini dan memulihkan DTA Rp1.320 juta; beban pajak tangguhan tahun ini Rp1.320 juta.",
   psak:"PSAK 212 (dulu PSAK 46)", f:"Kredit: beda waktu negatif = REVERSAL DTA (pajak dibayar di muka dulu, kini manfaatnya berbalik — bukan pajak ditunda). Lacak DTA/DTL di neraca untuk melihat saldonya."},
  {l:"(=) PKP — Penghasilan Kena Pajak", v:"52.000", v2:"58.000+4.000−4.000−6.000",
   d:"Hasil rekonsiliasi: 58.000 + 4.000 − 4.000 − 6.000 = 52.000. Inilah dasar pengenaan PPh badan — bukan 58.000. Salah memakai PBT = salah hitung pajak Rp1.320 juta.",
   psak:"—", f:"—"},
  {l:"PPh terutang (pajak kini)", v:"11.440", v2:"52.000 × 22%",
   d:"52.000 × 22% = 11.440 (UU PPh Psl 17; UU 7/2021). Ini 'pajak kini' (current tax) — kewajiban pajak tahun berjalan menurut fiskal, yang akan dibandingkan dengan beban pajak akuntansi.",
   psak:"PSAK 212", f:"—"},
  {l:"(−) Kredit pajak: PPh 25 dibayar", v:"(8.360)", v2:"ilustratif",
   d:"Angsuran PPh 25 selama 2025 — ilustratif: Rp696,7 juta/bulan × 12, diturunkan dari PPh terutang 2024 (UU PPh Psl 25: angsuran = (PPh terutang tahun lalu − kredit pajak) ÷ 12). Mengurangi yang harus dilunasi — bukan mengurangi beban pajak.",
   psak:"—", f:"—"},
  {l:"(=) PPh 29 — kurang bayar", v:"3.080", v2:"11.440 − 8.360",
   d:"11.440 − 8.360 = 3.080 — dilunasi sebelum SPT Tahunan (UU PPh Psl 29). Tercermin di 'utang pajak & akrual' Rp8.560 juta di neraca (kanonis) — sisanya akrual lain.",
   psak:"—", f:"Kredit: PPh 29 yang membengkak vs tahun lalu = kejutan kas. Bandingkan dengan CFO Rp30.800 juta."},
  {l:"Beban pajak akuntansi vs PPh terutang", v:"12.760 vs 11.440", v2:"selisih 1.320",
   d:"Beban pajak di laporan laba rugi (kanonis: 12.760) = pajak kini 11.440 + beban pajak tangguhan 1.320. Rincian 1.320: pembalikan DTA (beda waktu −6.000) → beban +1.320 (22% × 6.000). Tidak ada DTA/DTL dari beda tetap — beda tetap tidak pernah berbalik. ETR akuntansi = 12.760 ÷ 58.000 = 22,0% tepat. Rumus kunci: beban pajak = pajak kini + pajak tangguhan.",
   psak:"PSAK 212", f:"Forensik: beban pajak tangguhan yang berayun liar tanpa beda waktu yang jelas = area abu-abu. Minta rincian DTA/DTL per komponen."}
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
renderStmt("rezim");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Beda tetap naik: biaya entertainment & natura tak-deductible naik Rp2.000 juta", q1:"PKP", q2:"ETR akuntansi (beban pajak ÷ PBT)", a1:"naik", a2:"naik",
  e:"Beda tetap menambah PKP → pajak kini naik sementara PBT akuntansi tetap → ETR akuntansi naik. Ini beda PERMANEN: tidak ada DTA/DTL yang mengimbanginya, tidak akan berbalik."},
 {t:"Beda waktu negatif membesar: penyusutan fiskal Rp6.000 juta lebih cepat dari akuntansi", q1:"PPh terutang tahun ini", q2:"Liabilitas pajak tangguhan (DTL)", a1:"turun", a2:"naik",
  e:"PKP tahun ini turun → pajak kini turun; tapi selisihnya akan berbalik di tahun depan → DTL naik (6.000 × 22% = Rp1.320 juta, ilustratif). Pajak ditunda, bukan dihemat."},
 {t:"Sengketa PPh kalah di tingkat banding: harus bayar Rp3.000 juta", q1:"Kas", q2:"Provisi kontinjensi pajak", a1:"turun", a2:"turun",
  e:"Kas keluar Rp3.000 juta; provisi yang dulu dibentuk (PSAK 237, dulu PSAK 57) ikut terpakai → turun. Sengketa yang kalah berubah status: dari 'mungkin' menjadi 'pasti'."},
 {t:"Pendapatan sewa gedung naik Rp2.400 juta (PPh final 10%)", q1:"ETR gabungan (total pajak ÷ total laba)", q2:"PPh non-final terutang", a1:"turun", a2:"tetap",
  e:"Sewa gedung kena PPh FINAL 10% (PPh Psl 4 ayat 2, PP 34/2017) — di bawah tarif badan 22% → bauran tarif efektif turun. Penghasilan final dikeluarkan dari objek PPh non-final → PPh non-final tetap."},
 {t:"Angsuran PPh 25 naik 50% karena PPh terutang tahun lalu naik", q1:"Kas bulan depan", q2:"Beban pajak periode berjalan", a1:"turun", a2:"tetap",
  e:"PPh 25 hanya TIMING kas — angsuran lebih besar = kas keluar lebih besar, tapi bukan beban baru. Beban pajak periode tetap; angsuran menjadi kredit pajak sehingga PPh 29 lebih kecil."},
 {t:"Rugi fiskal 2024 dikompensasi ke laba 2025 (UU PPh Psl 6 ayat 2)", q1:"PPh terutang 2025", q2:"Aset pajak tangguhan (DTA) dari rugi fiskal", a1:"turun", a2:"turun",
  e:"Kompensasi memangkas PKP 2025 → pajak kini turun. DTA yang dulu dibentuk dari rugi fiskal ikut 'terpakai' → turun. Kompensasi rugi fiskal maksimal 5 tahun ke depan."}
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
    try{ localStorage.setItem("fsa_pg_m32", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"ETR akuntansi 2025 (%)", hint:"Beban pajak Rp12.760 juta ÷ PBT Rp58.000 juta × 100%", ans:22.0, dec:true, tol:0.3,
  why:"22,0% — persis tarif statutori 22% (UU PPh Psl 17; UU 7/2021). Dua beda tetap (+4.000 dan −4.000) saling meniadakan; beda waktu hanya menggeser kas, bukan beban akuntansi."},
 {q:"ETR fiskal 2025 — pajak kini ÷ PBT (%)", hint:"PPh terutang Rp11.440 juta ÷ PBT Rp58.000 juta × 100%", ans:19.7, tol:0.3,
  why:"19,7% — di bawah 22% karena beda tetap −4.000 (penghasilan final) dan beda waktu −6.000 (reversal DTA) menekan PKP tahun ini. ETR fiskal < ETR akuntansi karena reversal DTA (pajak kini lebih rendah karena dulu dibayar di muka) + penghasilan final, bukan karena pajak ditunda atau dihindari."},
 {q:"DTA yang dipulihkan dari beda waktu 2025 (Rp juta)", hint:"Rp6.000 juta × 22% — reversal DTA periode lalu (ilustratif)", ans:1320, dec:false, tol:5,
  why:"Rp1.320 juta — beda waktu yang menekan PKP tahun ini membalikkan DTA periode lalu; inilah satu-satunya komponen beban pajak tangguhan tahun ini."},
 {q:"Cash tax rate ilustratif 2025 (%)", hint:"Pajak dibayar kas Rp8.360 juta (PPh 25) ÷ PBT Rp58.000 juta × 100%", ans:14.4, tol:0.3,
  why:"14,4% — ilustratif. Kas yang benar-benar keluar jauh di bawah beban akuntansi 22%; selisihnya menjadi PPh 29 kurang bayar Rp3.080 juta."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 22,0">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 22,0)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — ETR akuntansi 22,0% terlihat 'normal', tapi ETR fiskal 19,7% dan cash tax rate 14,4% (ilustratif). Apakah laba bersih Rp45.240 juta berkualitas dari sisi pajak? Tulis 3 baris: kualitas laba pajak, risiko (beda tetap/sengketa), keputusanmu.",
 credit:"Lensa kredit — beda waktu (6.000) = reversal DTA Rp1.320 juta (pajak yang dulu dibayar di muka kini dikurangkan); PPh 29 kurang bayar Rp3.080 juta jatuh tempo sebelum SPT. Apakah arus kas cukup menutup kewajiban pajaknya? Tulis 3 baris: kewajiban pajak vs kas, mitigasi, kesimpulanmu.",
 forensic:"Lensa forensik — beda tetap neto nol (+4.000 non-deductible, −4.000 penghasilan final), beban pajak tangguhan 1.320 tanpa rincian DTA/DTL per komponen di contoh ini. Di mana rantai buktinya putus? Tulis 3 baris: bukti terkuat, lubang terbesar, langkah berikut."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m32_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m32_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [ {q:"Rekonsiliasi fiskal Cemerlang Abadi 2025: PBT Rp58.000 juta, beda tetap +Rp4.000 juta (non-deductible), beda tetap −Rp4.000 juta (penghasilan final), beda waktu −Rp6.000 juta. PKP-nya…", o:["Rp48.000 juta", "Rp52.000 juta", "Rp58.000 juta", "Rp60.000 juta"], a:1},
 {q:"PPh terutang 2025 = Rp11.440 juta, beban pajak akuntansi = Rp12.760 juta. Selisih Rp1.320 juta adalah…", o:["PPh Pasal 29 — kurang bayar yang harus dilunasi sebelum SPT disampaikan", "Kredit PPh Pasal 25 yang hangus karena tidak diklaim dalam tahun berjalan", "Denda administrasi atas keterlambatan penyampaian SPT tahunan", "Beban pajak tangguhan (pembalikan DTA atas beda waktu)"], a:3},
 {q:"Pendapatan sewa gedung PT Cemerlang Abadi dikenai…", o:["PPh final 10% (PPh Pasal 4 ayat 2)", "PPh Pasal 23 sebesar 2% atas jasa sewa", "PPh badan tarif 22% non-final seperti penghasilan usaha", "Bukan objek pajak karena sewa gedung milik sendiri"], a:0},
 {q:"Urutan penyelesaian sengketa pajak yang benar adalah…", o:["Banding → keberatan → peninjauan kembali", "Peninjauan kembali → banding → keberatan", "Keberatan → banding → peninjauan kembali", "Keberatan → mediasi → arbitrase"], a:2},
 {q:"Warung makan keluarga: penjualan Rp1,5 miliar/tahun, tanpa akuntabilitas publik. Rezim akuntansi yang paling tepat…", o:["PSAK penuh", "SAK EP", "IFRS", "SAK EMKM"], a:3}];
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
           window.FSAMistake.log(32, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Modul 32 Tuntas ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu bisa membaca rekonsiliasi fiskal, membedakan PPh final vs non-final, dan menilai kualitas laba dari sisi pajak. Lanjut ke <a href=\"../modul-33/\">Modul 33 →</a> — atau kembali ke <a href=\"../index.html\">FSA Lab</a>.</p>";
    try{ localStorage.setItem("fsa_gate_m32","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m32") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m32") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m32") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Modul 32 Tuntas ✓</h3><p>Kamu sudah melewati modul ini sebelumnya — lanjut ke <a href=\"../modul-33/\">Modul 33 →</a> atau kembali ke <a href=\"../index.html\">FSA Lab</a>.</p>";
  }
}catch(e){}
})();
