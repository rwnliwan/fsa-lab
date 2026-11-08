/* FSA Lab — Modul 1: data + interaksi */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

/* ---------- DATA: PT Nusantara Makmur (ilustratif, Rp juta) ---------- */
var STMTS = {
is:{ title:"Income Statement 2025 (Rp juta)", cols:["Pos","Nilai"],
 rows:[
  {l:"Penjualan", v:"480.000", sub:0, d:"Pendapatan dari penjualan barang. Diakui saat kewajiban pelaksanaan dipenuhi (model 5 langkah).", psak:"PSAK 115 (dulu 72) = IFRS 15", f:"Bandingkan pertumbuhan penjualan vs piutang. Penjualan naik tapi piutang naik lebih cepat = red flag klasik (channel stuffing / penjualan fiktif)."},
  {l:"Harga Pokok Penjualan (HPP)", v:"(288.000)", sub:1, d:"Biaya langsung menghasilkan barang yang terjual. Metode: FIFO atau rata-rata (LIFO dilarang di PSAK/IFRS).", psak:"PSAK 202 (dulu 14)", f:"HPP yang 'terlalu rendah' vs peers bisa berarti persediaan usang tidak dihapusbukukan."},
  {l:"Laba kotor", v:"192.000", sub:0, total:0, d:"Penjualan − HPP. Gross margin = 40,0% — cermin pricing power.", psak:"—", f:"Margin yang jauh di atas peers bertahun-tahun layak dicurigai, bukan dikagumi."},
  {l:"Beban operasi", v:"(120.000)", sub:1, d:"Gaji, sewa, marketing, dan depresiasi Rp28.000. Depresiasi = alokasi non-kas.", psak:"PSAK 216 (dulu 16)", f:"Classification shifting: menggeser beban operasi ke bawah garis operasi agar 'laba operasi' terlihat besar."},
  {l:"Laba operasi", v:"72.000", sub:0, d:"Laba dari bisnis inti, sebelum bunga & pajak.", psak:"—", f:"Mulai 2027, PSAK 118 mewajibkan subtotal laba operasi dengan definisi baku."},
  {l:"Beban bunga", v:"(12.000)", sub:1, d:"Bunga utang bank + bunga liabilitas sewa (PSAK 116).", psak:"PSAK 116 (dulu 73)", f:"Interest coverage = 72.000/12.000 = 6,0x. Di bawah 2x = zona bahaya kredit."},
  {l:"Laba sebelum pajak", v:"60.000", sub:0, d:"Titik transisi: setelah baris ini hanya pajak yang memisahkan dari laba bersih.", psak:"—", f:"—"},
  {l:"Beban pajak penghasilan", v:"(13.200)", sub:1, d:"Tarif efektif 22%. Beda dengan tarif statutori biasanya dari beda temporer (pajak tangguhan).", psak:"PSAK 212 (dulu 46)", f:"Tarif efektif yang anjlok tiba-tiba tanpa penjelasan = cek catatan pajak."},
  {l:"LABA BERSIH", v:"46.800", sub:0, total:1, d:"Hasil akhir akrual. Net margin 9,75%.", psak:"—", f:"Laba bisa dimanipulasi jauh lebih mudah daripada arus kas operasi. Selalu bandingkan dengan CFO."}
 ]},
bs:{ title:"Balance Sheet 31 Des 2025 (Rp juta)", cols:["Pos","Nilai"],
 rows:[
  {l:"Kas dan setara kas", v:"35.000", sub:0, d:"Kas + deposito ≤3 bulan. Paling likuid, paling mudah diverifikasi.", psak:"PSAK 201 (dulu 1)", f:"Kas besar tapi utang juga besar? Tanyakan kenapa tidak dilunasi — atau kasnya fiktif (kasus Satyam)."},
  {l:"Piutang usaha", v:"72.000", sub:0, d:"Tagihan ke pelanggan. DSO = 54,8 hari.", psak:"PSAK 109 (dulu 71) — ECL", f:"Piutang fiktif = skema fraud #1. Cek: DSO naik? Konsentrasi ke pihak berelasi?"},
  {l:"Persediaan", v:"84.000", sub:0, d:"Dinilai lower of cost or NRV.", psak:"PSAK 202 (dulu 14)", f:"Gudang fraud klasik: stok usang tidak dihapusbukukan, double-count antar lokasi."},
  {l:"Total aset lancar", v:"191.000", sub:0, total:0, d:"Sumber daya yang menjadi kas dalam 12 bulan.", psak:"—", f:"—"},
  {l:"Aset tetap neto", v:"210.000", sub:0, d:"Setelah akumulasi depresiasi. Revaluasi ke nilai wajar DIPERBOLEHKAN di PSAK (tidak di US GAAP).", psak:"PSAK 216 (dulu 16)", f:"Revaluasi yang 'pas' waktunya bisa menyembuhkan covenant di atas kertas. Tanya: siapa appraiser-nya, kenapa sekarang?"},
  {l:"TOTAL ASET", v:"401.000", sub:0, total:1, d:"Wujud persamaan akuntansi: 401.000 = 228.000 + 173.000 ✓", psak:"—", f:"—"},
  {l:"Utang usaha", v:"48.000", sub:0, d:"Kewajiban ke supplier.", psak:"—", f:"Utang yang tidak tercatat = fraud family kedua. Bandingkan dengan pembelian."},
  {l:"Utang bank jangka pendek", v:"30.000", sub:0, d:"Jatuh tempo <12 bulan.", psak:"—", f:"—"},
  {l:"Liabilitas sewa lancar", v:"6.000", sub:0, d:"Porsi <12 bulan dari liabilitas sewa.", psak:"PSAK 116 (dulu 73)", f:"—"},
  {l:"Total liabilitas lancar", v:"84.000", sub:0, total:0, d:"Current ratio = 2,27x.", psak:"—", f:"Aset lancar paling mudah digelembungkan — jadi rasio likuiditas paling mudah di-game."},
  {l:"Utang bank jangka panjang", v:"90.000", sub:0, d:"Liabilitas >12 bulan: bank 90.000 + sewa 54.000 = 144.000.", psak:"—", f:"Cek jadwal jatuh tempo di catatan: refinancing wall = risiko kredit utama."},
  {l:"Liabilitas sewa", v:"54.000", sub:0, d:"Nilai kini pembayaran sewa masa depan. Dulu off-balance-sheet sebelum PSAK 73/116.", psak:"PSAK 116 (dulu 73) = IFRS 16", f:"Sale-and-leaseback bisa 'menciptakan' laba dan kas dari udara tipis."},
  {l:"TOTAL LIABILITAS", v:"228.000", sub:0, total:1, d:"Debt/equity = 1,32x.", psak:"—", f:"Leverage tinggi + covenant ketat = motif fraud terkuat (fraud triangle: pressure)."},
  {l:"Modal disetor", v:"100.000", sub:0, d:"Setoran awal pemilik. Hanya berubah bila ada emisi saham baru.", psak:"—", f:"—"},
  {l:"Laba ditahan", v:"73.000", sub:0, d:"Akumulasi laba − dividen. Naik 38.800 = laba 46.800 − dividen 8.000. ✓ Artikulasi!", psak:"—", f:"Cek OCI: kerugian yang 'diparkir' di ekuitas tanpa lewat laba rugi."},
  {l:"TOTAL EKUITAS", v:"173.000", sub:0, total:1, d:"Aset 401.000 = Liabilitas 228.000 + Ekuitas 173.000 ✓", psak:"—", f:"—"},
  {l:"Laporan perubahan ekuitas (ringkas)", v:"34.200 → 73.000", sub:0, d:"Laporan keempat: saldo awal 34.200 + laba bersih 46.800 − dividen 8.000 = 73.000 ✓. Menjembatani IS ke BS — modal disetor tetap 100.000.", psak:"PSAK 201 (dulu 1)", f:"OCI yang 'diparkir' di ekuitas tanpa lewat laba rugi bersembunyi di laporan ini — baca baris per baris."},
  {l:"Paket laporan lengkap (2.4)", v:"5 komponen", sub:0, d:"Laporan keuangan lengkap = 5 komponen (PSAK 201): IS + BS + arus kas + perubahan ekuitas + CALK. MD&A (tinjauan manajemen) dan laporan/opini auditor adalah dokumen pendamping yang dibaca bersama — bukan komponen laporan keuangan. Profesional baca CALK & MD&A dulu — wajah laporan kedua.", psak:"PSAK 201 (dulu 1)", f:"Jenis opini auditor (wajar tanpa pengecualian vs modifikasian) dan pergantian auditor = red flag tersendiri."},
  {l:"MD&A — tinjauan manajemen", v:"Pendamping", sub:0, d:"Narasi manajemen soal kinerja, risiko, dan prospek. MD&A DIBACA BERSAMA laporan keuangan — ia menjelaskan 'kenapa' di balik angka — tapi BUKAN komponen laporan keuangan (PSAK 201) dan tidak tercakup opini audit atas laporan keuangan. Statusnya: sudut pandang manajemen, bisa bias optimistis.", psak:"—", f:"MD&A yang hanya memuji diri sendiri dan menyalahkan cuaca = manajemen yang tidak jujur pada dirinya sendiri."},
  {l:"Laporan auditor — opini independen", v:"Pendamping", sub:0, d:"Opini auditor atas laporan keuangan (wajar tanpa pengecualian, modifikasian, atau disclaimer). Laporan auditor juga BUKAN komponen laporan keuangan — ia adalah PENILAIAN independen atas kelima komponen itu. Ketiganya dibaca bersama karena saling melengkapi — angka, penjelasan manajemen, dan verifikasi independen — tapi bobot buktinya tidak setara: hanya laporan keuangan yang diaudit sebagai fakta. Tanpa opini wajar, angka-angka di atas kehilangan kredibilitas.", psak:"—", f:"Pergantian auditor + opini modifikasian = dua red flag yang dibaca berurutan."}
 ]},
cf:{ title:"Cash Flow Statement 2025 (Rp juta, metode tidak langsung)", cols:["Pos","Nilai"],
 rows:[
  {l:"Laba bersih", v:"46.800", sub:0, d:"Titik awal rekonsiliasi.", psak:"PSAK 207 (dulu 2)", f:"—"},
  {l:"Depresiasi", v:"28.000", sub:1, d:"Ditambah kembali: beban non-kas.", psak:"—", f:"—"},
  {l:"Perubahan modal kerja", v:"(21.000)", sub:1, d:"Kenaikan piutang+persediaan menghisap kas.", psak:"—", f:"Modal kerja yang terus menghisap kas = pertumbuhan tidak berkualitas."},
  {l:"Arus kas operasi (CFO)", v:"53.800", sub:0, total:0, d:"CFO > laba bersih → kualitas laba BAIK tahun ini.", psak:"PSAK 207: bunga/dividen boleh di operasi atau pendanaan (US GAAP: bunga dibayar wajib operasi)", f:"CFO bisa di-game: factoring piutang, menunda bayar supplier. Rekonsiliasi CFO ke saldo kas & pergerakan utang."},
  {l:"Belanja modal (capex)", v:"(45.000)", sub:0, d:"Investasi aset tetap.", psak:"—", f:"Capex < depresiasi bertahun-tahun = panen aset / kurang investasi. Capex yang dikapitalisasi dari beban operasi = trik WorldCom."},
  {l:"Arus kas investasi (CFI)", v:"(45.000)", sub:0, total:0, d:"Arus dari investasi aset jangka panjang (di sini: capex).", psak:"—", f:"—"},
  {l:"Pelunasan utang bank", v:"(10.000)", sub:0, d:"Cicilan pokok utang — keluar via pendanaan (CFF), bukan beban di laba rugi.", psak:"—", f:"—"},
  {l:"Dividen dibayar", v:"(8.000)", sub:0, d:"Kas keluar via pendanaan: 8.000.", psak:"—", f:"Dividen besar di perusahaan berleverage = covenant issue (leakage)."},
  {l:"Arus kas pendanaan (CFF)", v:"(18.000)", sub:0, total:0, d:"2025: pelunasan utang 10.000 + dividen 8.000.", psak:"—", f:"Perusahaan yang terus-menerus galang dana baru sambil lapor laba = pola Ponzi."},
  {l:"Kenaikan (penurunan) kas", v:"(9.200)", sub:0, total:1, d:"53.800 − 45.000 − 18.000 = (9.200) ✓", psak:"—", f:"—"},
  {l:"Kas awal → akhir", v:"44.200 → 35.000", sub:0, d:"Berartikulasi dengan neraca ✓", psak:"—", f:"—"}
 ]}
};

function fmtStmt(key){
  var s = STMTS[key], h = '<table class="stmt"><tr><th>'+s.cols[0]+'</th><th style="text-align:right">'+s.cols[1]+'</th></tr>';
  s.rows.forEach(function(r,i){
    h += '<tr class="clickable'+(r.sub?' sub':'')+(r.total?' total':'')+'" data-stmt="'+key+'" data-i="'+i+'"><td>'+r.l+'</td><td class="val">'+r.v+'</td></tr>';
  });
  return h + '</table><p class="sub" style="font-size:.82rem">Periode 2025 · '+s.title+'</p>';
}
function renderStmt(key){
  $("#stmt-wrap").innerHTML = fmtStmt(key);
  $$("#stmt-wrap tr.clickable").forEach(function(tr){
    tr.addEventListener("click", function(){
      var r = STMTS[tr.dataset.stmt].rows[+tr.dataset.i];
      $("#explain").innerHTML = '<h3>'+r.l+' <span class="num">'+r.v+'</span></h3>'
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
 {t:"Penjualan tunai Rp10.000 (HPP Rp6.000)", a:{laba:"naik",aset:"naik",liab:"tetap",kas:"naik"},
  e:"Kas +10.000, persediaan −6.000 → aset neto +4.000. Laba +4.000 → ekuitas +4.000. Kas masuk via CFO."},
 {t:"Beli persediaan Rp15.000 secara kredit", a:{laba:"tetap",aset:"naik",liab:"naik",kas:"tetap"},
  e:"Persediaan +15.000, utang usaha +15.000. Belum ada efek laba/kas — kas keluar nanti saat bayar."},
 {t:"Bayar utang usaha Rp8.000", a:{laba:"tetap",aset:"turun",liab:"turun",kas:"turun"},
  e:"Kas −8.000, utang −8.000. Laba tidak tersentuh. Kas keluar via CFO."},
 {t:"Terima utang bank Rp50.000", a:{laba:"tetap",aset:"naik",liab:"naik",kas:"naik"},
  e:"Kas +50.000, utang bank +50.000. Bukan pendapatan! Kas masuk via pendanaan (CFF)."},
 {t:"Bayar dividen Rp8.000", a:{laba:"tetap",aset:"turun",liab:"tetap",kas:"turun"},
  e:"Kas −8.000, ekuitas (laba ditahan) −8.000. Dividen bukan beban — tidak menyentuh laba."},
 {t:"Beban depresiasi Rp7.000", a:{laba:"turun",aset:"turun",liab:"tetap",kas:"tetap"},
  e:"Laba −7.000, aset tetap −7.000, ekuitas −7.000. NON-KAS: kas tidak bergerak (di arus kas ditambah kembali)."}
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
    try{ localStorage.setItem("fsa_pg_m1", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {n:"Gross margin", f:"Laba kotor ÷ Penjualan", ans:40.0, dec:true, unit:"%",
  hint:"Laba kotor Rp192.000 ÷ Penjualan Rp480.000",
  why:"40% = pricing power sehat untuk manufaktur. Di bawah 20% = perang harga."},
 {n:"Net margin", f:"Laba bersih ÷ Penjualan", ans:9.75, unit:"%",
  hint:"Rp46.800 ÷ Rp480.000",
  why:"9,75% — wajar. Net margin tinggi + CFO rendah = waspada kualitas laba."},
 {n:"Current ratio", f:"Aset lancar ÷ Liabilitas lancar", ans:2.27, unit:"x",
  hint:"Rp191.000 ÷ Rp84.000",
  why:"2,27x = likuiditas aman. Di bawah 1x = bahaya jangka pendek."},
 {n:"DSO (hari)", f:"Piutang ÷ Penjualan × 365", ans:54.75, unit:" hari",
  hint:"Rp72.000 ÷ Rp480.000 × 365",
  why:"54,8 hari. Naik 15+ hari YoY tanpa penjelasan = red flag penagihan/penjualan."}
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
      var ok = Math.abs(v - r.ans) <= Math.max(0.06, r.ans*0.01);
      fb.innerHTML = ok
        ? "<strong style='color:var(--teal-deep)'>Benar.</strong> "+r.why
        : "<strong style='color:var(--sunset-deep)'>Belum tepat.</strong> Coba lagi — pakai petunjuk di atas.";
    });
  });
}
renderRatios();

/* ---------- JOURNAL ---------- */
var PROMPTS = {
 invest:"Lensa investasi — Apakah Nusantara Makmur layak dibeli? Tulis 3 baris: kualitas bisnis, pertumbuhan, dan driver nilainya.",
 credit:"Lensa kredit — Layakkah kredit Rp50M/5 tahun? Tulis 3 baris: coverage, leverage, dan downside terbesar.",
 forensic:"Lensa forensik — Di mana kamu akan mencari manipulasi duluan? Sebut 3 titik + rasio pemeriksanya."
};
var curLens = "invest";
function renderLens(){
  $("#lens-prompt").textContent = PROMPTS[curLens];
  var v = "";
  try{ v = localStorage.getItem("fsa_journal_m1_"+curLens) || ""; }catch(e){}
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
    try{ localStorage.setItem("fsa_journal_m1_"+curLens, $("#journal-text").value); }catch(e){}
    updJournalMeta();
  }, 600);
});
renderLens();

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Standar sewa versi penomoran BARU (efektif 1 Jan 2024) adalah…", o:["PSAK 73","PSAK 115","PSAK 118","PSAK 116"], a:3},
 {q:"Laba bersih naik 3 tahun berturut-turut, tapi CFO selalu di bawah laba dan selisihnya melebar. Sinyal apa?", o:["Kualitas laba memburuk — red flag", "Laba bertumbuh — gap kas wajar saat ekspansi", "Laba ditahan naik — perusahaan makin kuat", "Modal kerja membesar — operasi makin besar"], a:0},
 {q:"Kenaikan beban depresiasi Rp7.000 berpengaruh ke kas sebesar…", o:["Rp7.000 keluar","Rp7.000 masuk","Nol — non-kas","Tergantung metode"], a:2},
 {q:"Fokus utama lensa KREDIT adalah…", o:["Pertumbuhan penjualan", "Arus kas & kemampuan bayar utang", "Valuasi harga saham perusahaan", "Rencana ekspansi & inovasi produk"], a:1},
 {q:"Current ratio 2,27x artinya…", o:["Total utang 2,27x total aset", "Aset lancar 2,27x liabilitas lancar", "Laba 2,27x lebih besar dari tahun lalu", "Kas 2,27x liabilitas lancar"], a:1}
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
  var score = 0;
  var picked = [];
  var skipped = [];
  QUIZ.forEach(function(q,i){
    var sel = document.querySelector('input[name="q'+i+'"]:checked');
    picked.push(sel ? +sel.value : -1);
    try{ if(window.FSAMistake && sel && +sel.value !== q.a)
           window.FSAMistake.log(1, i, "quiz"); }catch(e){}
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
  var pct = Math.round(score/QUIZ.length*100);
  var passed = pct >= 80;
  QUIZ.forEach(function(q,i){
    var labels = $$('#qq'+i+' label');
    labels.forEach(function(lb, j){
      lb.classList.remove("right","wrong");
      if(passed && j === q.a) lb.classList.add("right");
      else if(picked[i] === j && j !== q.a) lb.classList.add("wrong");
    });
  });
  box.style.display = "block";
  if(passed){
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). <a href=\"../modul-2/\">Lanjut ke Modul 2 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m1","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m1") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci jawaban tidak dibocorkan. Pelajari lagi, lalu coba lagi.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE persistence saat kembali ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m1") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 24 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m1") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 1 sudah kamu lewati sebelumnya. <a href=\"../modul-2/\">Lanjut ke Modul 2 →</a></p>";
  }
}catch(e){}
})();
