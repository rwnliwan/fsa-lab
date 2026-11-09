/* FSA Lab — Modul 19: Dari Mana Dapat Laporannya? (filing: EDGAR, IDX, OJK) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
k10:{ title:"Anatomi 10-K — laporan tahunan perusahaan AS", cols:["Bagian","Isi","Fokus analis"],
 rows:[
  {l:"Item 1 · Bisnis", v:"Model bisnis & operasi", v2:"baca pertama", d:"Apa yang dijual, ke siapa, bagaimana menghasilkan uang — konteks untuk SEMUA angka.", psak:"—", f:"Bisnis yang tak bisa dijelaskan dalam 2 kalimat = red flag."},
  {l:"Item 1A · Faktor risiko", v:"Daftar risiko", v2:"jangan di-skip", d:"Risiko yang diakui perusahaan sendiri — dibaca sebagai daftar cek, bukan ramalan harga.", psak:"—", f:"Risiko yang hilang dibanding kompetitor = patut dicurigai."},
  {l:"Item 7 · MD&A", v:"Pembahasan manajemen", v2:"narasi vs angka", d:"Penjelasan manajemen atas hasil, likuiditas & prospek — WAJIB dibandingkan dengan Item 8.", psak:"—", f:"Narasi optimis + angka memburuk = cek classification shifting."},
  {l:"Item 8 · Laporan keuangan", v:"LK diaudit + catatan", v2:"sumber angka", d:"Neraca, laba rugi, arus kas, ekuitas + catatan kaki. Bagian utama yang menjadi objek opini audit laporan keuangan.", psak:"—", f:"Catatan related-party & kebijakan akuntansi = tempat mayat disembunyikan."},
  {l:"Item 9A · Kontrol internal", v:"Efektivitas kontrol", v2:"material weakness?", d:"Penilaian/pengungkapan terkait kontrol internal pelaporan keuangan, sesuai status & kewajiban filer (atestasi auditor atas ICFR tidak berlaku untuk semua kategori filer — 'bila berlaku'). 'Material weakness' = angkanya boleh diragukan.", psak:"—", f:"Material weakness + pergantian auditor = lampu merah ganda."},
  {l:"Part III · via proxy", v:"Gaji & related-party", v2:"rujuk DEF 14A", d:"10-K merujuk ke proxy statement untuk kompensasi eksekutif & transaksi pihak berelasi — dokumen forensik terkaya.", psak:"—", f:"Transaksi dengan perusahaan milik direksi = baca kontraknya, bukan ringkasannya."}
 ]},
src:{ title:"EDGAR vs IDX — dua gerbang filing", cols:["Aspek","EDGAR (AS)","IDX (Indonesia)"],
 rows:[
  {l:"Gerbang", v:"sec.gov/edgar/search", v2:"idx.co.id", d:"Keduanya gratis dan terbuka — tanpa login, tanpa API key.", psak:"—", f:"Sumber primer selalu mengalahkan ringkasan berita."},
  {l:"Dokumen utama", v:"10-K / 10-Q / 8-K / DEF 14A", v2:"Laporan tahunan & LK emiten", d:"AS: 4 formulir inti. Indonesia: laporan tahunan memuat LK auditan PSAK + disclosure OJK.", psak:"—", f:"—"},
  {l:"Bahasa", v:"Inggris", v2:"Indonesia", d:"Istilah teknis Inggris dipakai di kedua sistem — konsisten dengan modul ini.", psak:"—", f:"—"},
  {l:"Data mesin", v:"XBRL → data.sec.gov (JSON)", v2:"PDF (bisa di-scrape)", d:"EDGAR punya API terstruktur gratis tanpa key; IDX berupa PDF laporan.", psak:"—", f:"Angka yang bisa di-query > angka yang harus diketik ulang."},
  {l:"Cakupan", v:"Perusahaan tercatat AS", v2:"Emiten BEI", d:"Pilih gerbang sesuai domisili perusahaan yang dianalisis.", psak:"—", f:"—"},
  {l:"Regulator", v:"SEC", v2:"OJK", d:"SEC mengatur format filing AS; OJK menambah kewajiban disclosure untuk emiten Indonesia.", psak:"—", f:"—"}
 ]},
cek:{ title:"Checklist verifikasi filing — sebelum SATU angka pun dipakai", cols:["Cek","Yang diperiksa","Kenapa penting"],
 rows:[
  {l:"1 · Periode", v:"tahun/bulan filing vs pertanyaan", v2:"FY vs kuartal", d:"10-K FY2025 ≠ 10-Q Q3 2025. Angka kuartalan yang dipakai sebagai angka tahunan = analisis salah total.", psak:"—", f:"Cek cover page dulu: periode & tanggal filing."},
  {l:"2 · Versi / amendment", v:"ada 10-K/A sesudahnya?", v2:"pakai versi terbaru", d:"Amendment (/A) memperbaiki angka filing sebelumnya. Pakai versi terbaru dan catat tanggal filingnya.", psak:"—", f:"Filing 'terbaru diunduh' belum tentu versi terbaru yang difile."},
  {l:"3 · Restatement", v:"8-K Item 4.02 / kata 'restated'?", v2:"angka lama tak bisa diandalkan", d:"Bila laporan lama disajikan kembali (restatement), angka versi lama TIDAK BOLEH dipakai — pakai angka penyajian kembali.", psak:"—", f:"Restatement yang tak ketahuan = seluruh rasio ikut salah."},
  {l:"4 · Konsolidasian vs tersendiri", v:"LK konsolidasian atau parent-only?", v2:"induk ≠ grup", d:"Angka induk saja ≠ grup: aset/utang anak perusahaan hanya ada di laporan KONSOLIDASIAN. Pastikan basis penyajiannya sama dengan yang dibandingkan.", psak:"—", f:"Bandingkan konsolidasian dengan tersendiri = apel vs jeruk."},
  {l:"5 · Auditor & opini", v:"opini wajar tanpa pengecualian?", v2:"bila tidak → flag", d:"Opini selain wajar (atau disclaimer) = angka boleh diragukan sebelum dipakai — baca paragraf opini di Item 8.", psak:"—", f:"—"},
  {l:"6 · Mata uang & satuan", v:"USD ribu vs juta; Rp juta?", v2:"salah skala = hancur", d:"Salah skala 1.000× menghancurkan analisis. Cek cover page dan satuan di kepala setiap tabel.", psak:"—", f:"—"}
 ]},
xbrl:{ title:"Rekonsiliasi XBRL — satu angka, dari tag ke Item 8 (ilustratif Rp juta)", cols:["Langkah","XBRL (data.sec.gov)","Item 8 / catatan"],
 rows:[
  {l:"Tag", v:"us-gaap:Revenues", v2:"pendapatan usaha", d:"Tag XBRL yang dipetakan ke pos 'Pendapatan usaha' di Item 8. Tag salah = angka salah, meski nilainya 'kelihatan benar'.", psak:"—", f:"Tag yang mirip belum tentu sama: cek definisi tag di taxonomy."},
  {l:"Nilai", v:"520.000", v2:"sama dengan Item 8", d:"Nilai XBRL 520.000 = laba rugi Item 8 520.000. Titik awal rekonsiliasi.", psak:"—", f:"—"},
  {l:"Unit", v:"Rp juta (unitRef disamakan)", v2:"cek skala dulu", d:"Skala tabel Item 8 juga Rp juta. Bila XBRL dalam ribuan, kalikan 1.000 dulu — jangan bandingkan mentah.", psak:"—", f:"Kesalahan unit adalah kesalahan rekonsiliasi paling bodoh sekaligus paling sering."},
  {l:"Periode", v:"FY2025 (duration)", v2:"2025-01-01 s.d. 2025-12-31", d:"Tahun buku sama dengan Item 8. Jangan campur duration (arus, mis. pendapatan) dengan instant (saldo neraca per tanggal).", psak:"—", f:"Pendapatan Q4 yang dibaca sebagai FY = seperempat angka sebenarnya."},
  {l:"Sign convention", v:"pendapatan +, beban −", v2:"minus = pengurang", d:"Tanda minus di XBRL = pengurang, bukan 'negatif' secara ekonomi. Beban yang tampil positif tanpa tanda = waspadai pembalikan tanda.", psak:"—", f:"—"},
  {l:"Catatan — disaggregasi segmen", v:"312.000 + 208.000", v2:"= 520.000 ✓", d:"Jumlah segmen di catatan kaki harus tie ke angka Item 8: 312.000 + 208.000 = 520.000.", psak:"—", f:"Segmen yang tak tie = minta rekonsiliasi dulu."},
  {l:"Hasil rekonsiliasi", v:"COCOK — selisih 0", v2:"siap dipakai", d:"Selisih 0 = angka XBRL siap diolah. Bila selisih ≠ 0: cek tag, unit, periode, atau dimensi segmen — jangan 'dibulatkan' diam-diam.", psak:"—", f:"JSON XBRL bukan otomatis siap pakai — rekonsiliasi adalah buktinya."}
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
renderStmt("k10");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Merger baru diumumkan pagi ini via siaran pers", q1:"Dokumen resmi yang dibuka", o1:["8-K","10-K","Proxy DEF 14A"], q2:"Detail kontrak merger ada di", o2:["Exhibit 2.1","Item 1A","Catatan kaki"], a1:"8-K", a2:"Exhibit 2.1",
  e:"8-K = laporan peristiwa material (cepat). Siaran pers hanya cover; kontraknya di Exhibit 2.1, press release di 99.1."},
 {t:"Mau cek gaji CEO & transaksi dengan perusahaan milik direksi", q1:"Dokumen yang dibuka", o1:["Item 7","Proxy DEF 14A","10-Q"], q2:"Bagian yang dibaca", o2:["Item 1A","Bagian related-party","MD&A"], a1:"Proxy DEF 14A", a2:"Bagian related-party",
  e:"Proxy (DEF 14A) memuat Summary Compensation Table + 'Certain Relationships and Related Transactions' — dokumen forensik terkaya yang paling sering di-skip."},
 {t:"Mau pahami risiko utama bisnis perusahaan AS", q1:"Dokumen yang dibuka", o1:["8-K","10-K","Proxy DEF 14A"], q2:"Bagian yang dibaca", o2:["Item 7","Item 1A","Part III"], a1:"10-K", a2:"Item 1A",
  e:"Item 1A = risk factors versi perusahaan sendiri. Baca sebagai daftar cek, bukan ramalan."},
 {t:"Mau lihat perubahan penjualan kuartal terakhir", q1:"Dokumen yang dibuka", o1:["10-K","10-Q","DEF 14A"], q2:"Bagian yang dibaca", o2:["Laporan keuangan kuartalan","Proxy","Exhibit 99.1"], a1:"10-Q", a2:"Laporan keuangan kuartalan",
  e:"10-Q = update kuartalan, laporannya unaudited. Apa yang berubah sejak 10-K terakhir = pertanyaan intinya."},
 {t:"Mau unduh LK auditan emiten Indonesia", q1:"Sumber yang dibuka", o1:["sec.gov","idx.co.id","BPS"], q2:"Isi yang diharapkan", o2:["LK konsolidasian + opini auditor","Siaran pers","Prospektus IPO"], a1:"idx.co.id", a2:"LK konsolidasian + opini auditor",
  e:"idx.co.id menyimpan laporan tahunan emiten: LK konsolidasian auditan PSAK + disclosure OJK."},
 {t:"Mau olah angka SEC dengan Python (tanpa ketik ulang)", q1:"Sumber data mesin", o1:["PDF scan","XBRL via data.sec.gov","Screenshot"], q2:"Format yang diambil", o2:["HTML saja","JSON XBRL","Koran"], a1:"XBRL via data.sec.gov", a2:"JSON XBRL",
  e:"EDGAR punya API XBRL gratis tanpa key (data.sec.gov/api/xbrl). Angka mesin-terbaca > angka ketik-ulang."}
];
var pgScore = 0, pgDone = 0, pgCards = [];
function renderPg(){
  var h = "";
  CARDS.forEach(function(c,i){
    h += '<div class="quiz-q" id="pg'+i+'"><h3>Kartu '+(i+1)+': '+c.t+'</h3>';
    [["q1",c.q1,c.o1],["q2",c.q2,c.o2]].forEach(function(qq){
      h += '<p class="sub" style="margin:.4rem 0 .2rem">'+qq[1]+' →</p><div class="pg-opts">';
      qq[2].forEach(function(o){ h += '<button data-card="'+i+'" data-q="'+qq[0]+'" data-opt="'+o+'">'+o+'</button>'; });
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
    try{ localStorage.setItem("fsa_pg_m19", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"Pertumbuhan penjualan 2025 dari 10-K (%)", hint:"(520.000 − 400.000) ÷ 400.000 × 100", ans:30, dec:true, tol:0.5,
  why:"30% — angka pertama yang selalu dihitung dari filing mana pun: berapa cepat bisnisnya tumbuh."},
 {q:"Net debt dari Item 8 (Rp juta)", hint:"Utang berbunga 201.440 − kas 21.440", ans:180000, dec:false, tol:100,
  why:"180.000 — utang bank pendek+panjang+sewa dikurangi kas. Fondasi semua rasio leverage."},
 {q:"Akuisisi Rp60.000 (dari 8-K) ÷ ekuitas (%)", hint:"60.000 ÷ 179.440 × 100", ans:33.4, tol:0.5,
  why:"33,4% — akuisisi sebesar sepertiga ekuitas = peristiwa material, wajar masuk 8-K."},
 {q:"CFO 9 bulan 23.100 (10-Q) → run-rate tahunan (Rp juta)", hint:"23.100 × 4 ÷ 3", ans:30800, dec:false, tol:100,
  why:"30.800 — sama dengan CFO auditan 2025. Annualisasi 10-Q = cara baca kuartalan yang benar."},
 {q:"Selisih rekonsiliasi XBRL vs Item 8 (Rp juta)", hint:"520.000 (XBRL) − 520.000 (Item 8)", ans:0, dec:false, tol:0,
  why:"0 — cocok. Selisih ≠ 0 berarti tag, unit, atau periode yang dipakai salah — jangan dibulatkan diam-diam."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 30">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 30)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Proxy DEF 14A mengungkap transaksi Rp25.000/tahun dengan perusahaan milik CEO. Red flag apa yang kamu lihat? Cek lanjutan apa yang wajib dilakukan?",
 credit:"Lensa kredit — 10-K Item 1A mencantumkan 40 faktor risiko. Pilih 3 yang paling relevan untuk kreditur dan jelaskan kenapa ketiganya menentukan keputusan kredit.",
 forensic:"Lensa forensik — Auditor diganti 2× dalam 3 tahun, lalu muncul 8-K Item 4.02 (laporan lama tak bisa diandalkan). Tulis 3 cek yang kamu lakukan sebelum percaya angka mana pun."
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m19_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m19_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"10-K itu…", o:["Laporan kuartalan perusahaan AS yang memuat laporan keuangan auditan","Laporan tahunan perusahaan AS yang memuat laporan keuangan auditan","Pengumuman insiden material ke SEC","Proxy statement untuk rapat pemegang saham"], a:1},
 {q:"Merger diumumkan pagi ini. Dokumen resmi tercepat yang dibuka…", o:["10-K","10-Q","Proxy DEF 14A","8-K"], a:3},
 {q:"Gaji CEO dan transaksi pihak berelasi dicari di…", o:["Proxy DEF 14A","Item 7 (MD&A)","Item 1 (bisnis)","8-K"], a:0},
 {q:"Laporan keuangan auditan emiten Indonesia diunduh dari…", o:["sec.gov","Kantor OJK","idx.co.id","BPS"], a:2},
 {q:"Data keuangan SEC yang mesin-terbaca untuk diolah Python…", o:["PDF hasil scan filing","XBRL via data.sec.gov","Screenshot tabel dari 10-K","Koran bisnis terbitan pagi"], a:1}
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
           window.FSAMistake.log(19, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓ — Modul 19 Tuntas!</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Kamu tahu di dokumen mana setiap fakta hidup. <a href=\"../modul-20/\">Lanjut ke Modul 20 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m19","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m19") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m19") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m19") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 19 sudah kamu lewati sebelumnya — filing bukan lagi misteri! <a href=\"../modul-20/\">Lanjut ke Modul 20 →</a></p>";
  }
}catch(e){}
})();
