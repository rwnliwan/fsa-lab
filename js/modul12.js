/* FSA Lab — Modul 12: Aset Tetap, Impairment & Sewa (PT Cemerlang Abadi, ilustratif Rp juta) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var STMTS = {
ppe:{ title:"Aset tetap neto 2025 (Rp juta) — 40.000 + 132.000 + 58.000 = 230.000 ✓", cols:["Pos","2025","2024"],
 rows:[
  {l:"Tanah", v:"40.000", v2:"40.000", d:"Tidak disusutkan. Bisa direvaluasi ke nilai wajar.", psak:"PSAK 216 (dulu 16)", f:"Tanah yang direvaluasi berulang = cara menaikkan ekuitas tanpa kas."},
  {l:"Bangunan & mesin (neto)", v:"132.000", v2:"120.000", d:"Setelah akumulasi depresiasi. Depresiasi 30.000/thn.", psak:"PSAK 216 (dulu 16)", f:"Perubahan umur manfaat tiba-tiba = cara legal-adjacent menaikkan laba."},
  {l:"Aset hak-guna / ROU (neto)", v:"58.000", v2:"50.000", d:"Hak pakai dari kontrak sewa — 25,2% dari aset tetap.", psak:"PSAK 116 (dulu 73)", f:"Sejak PSAK 116, 'tidak punya utang' harus dicek ulang — sewa jadi liabilitas."},
  {l:"Total aset tetap neto", v:"230.000", v2:"210.000", d:"51,0% dari total aset — perusahaan padat modal.", psak:"—", f:"—"},
  {l:"Capex vs depresiasi", v:"48.000 > 30.000", v2:"40.000 > 26.000", d:"Investasi melebihi penyusutan = INDIKASI ekspansi, bukan bukti — capex bisa mengganti aset lama, mencerminkan kenaikan harga aset, atau kewajiban keselamatan; pisahkan maintenance vs growth capex dan uji kapasitas aktual.", psak:"—", f:"Capex yang dikapitalisasi berlebihan = laba semu (ingat WorldCom)."}
 ]},
imp:{ title:"Impairment & sewa (ilustratif Rp juta)", cols:["Pos","Angka","Keterangan"],
 rows:[
  {l:"Nilai tercatat (carrying)", v:"50.000", v2:"mesin X", d:"Nilai buku mesin sebelum uji penurunan nilai.", psak:"PSAK 236 (dulu 48)", f:"—"},
  {l:"Nilai terpulihkan (recoverable)", v:"42.000", v2:"ilustratif", d:"Mana yang lebih tinggi: nilai pakai vs nilai wajar − biaya jual.", psak:"PSAK 236 (dulu 48)", f:"Asumsi nilai pakai bisa dimanipulasi — cek discount rate & proyeksi."},
  {l:"Rugi impairment", v:"8.000", v2:"50.000 − 42.000", d:"Dibebankan ke laba rugi tahun berjalan.", psak:"PSAK 236 (dulu 48)", f:"Impairment yang ditunda bertahun-tahun = bom waktu di neraca."},
  {l:"Liabilitas sewa", v:"60.000", v2:"2024: 58.000", d:"Nilai kini pembayaran sewa masa depan.", psak:"PSAK 116 (dulu 73)", f:"—"},
  {l:"Beban sewa di laba rugi", v:"depresiasi + bunga", v2:"bukan sewa", d:"Di bawah PSAK 116, sewa operasi dipecah jadi depresiasi ROU + beban bunga.", psak:"PSAK 116 (dulu 73)", f:"EBITDA naik semu setelah PSAK 116 — beban sewa pindah ke bawah EBIT."}
 ]},
lessor:{ title:"Sisi lessor: finance lease vs operating lease (ilustratif Rp juta) — cermin sisi lessee", cols:["Pos","Perlakuan","Keterangan"],
 rows:[
  {l:"Uji klasifikasi: finance lease bila risiko & manfaat berpindah", v:"5 indikator", v2:"PSAK 116", d:"Sewa diklasifikasikan FINANCE bila secara substansi mengalihkan seluruh risiko dan manfaat kepemilikan aset — dinilai dari keseluruhan fakta, bukan dari daftar ceklis mekanis. Lima indikator yang mengarah ke finance: (1) kepemilikan beralih di akhir masa sewa, (2) ada opsi beli murah (bargain purchase), (3) masa sewa ≈ umur ekonomis aset, (4) PV pembayaran ≈ nilai wajar aset, (5) aset bersifat khusus (hanya lessee itu yang bisa pakai). Bila indikator-indikator ini terpenuhi, besar kemungkinan finance — tetapi klasifikasi tetap judgment atas substansi keseluruhan, termasuk fakta lain di luar daftar; tidak ada satu indikator pun yang berdiri sendiri menentukan hasil. Klasifikasi dibuat di AWAL kontrak dan tidak diubah kecuali ada modifikasi. PSAK 116 (dulu 73), setara IFRS 16 — standar yang sama dengan sisi lessee di tab Impairment & Sewa, tapi cerminnya.", psak:"PSAK 116 (dulu 73)", f:"Klasifikasi adalah judgment: lessor yang 'selalu operating lease' atas aset yang masa sewanya ≈ umur ekonomis = patut dicurigai — ia menunda pengakuan piutang & laba penjualan."},
  {l:"Finance lease: aset keluar, piutang masuk — net investment in lease", v:"derecognize", v2:"piutang sewa", d:"Lessor MENGHAPUS aset dari neracanya dan mengakui NET INVESTMENT IN LEASE (piutang sewa pembiayaan) = nilai kini pembayaran sewa (sudah termasuk nilai residu yang DIJAMIN) + nilai kini nilai residu yang TIDAK DIJAMIN (unguaranteed residual value) yang menjadi hak lessor — semuanya didiskontokan dengan suku bunga implisit sewa. Selisih nilai tercatat aset vs piutang = laba/rugi di awal (untuk lessor manufaktur/dealer; lessor non-dealer umumnya tanpa laba awal bila piutang = nilai tercatat). Setelah itu asetnya bukan lagi 'mesin' — melainkan PIUTANG. Inilah cermin lessee: ROU + liabilitas sewa di pihak penyewa = piutang di pihak pemberi sewa.", psak:"PSAK 116", f:"Aset yang 'dijual' lewat finance lease tapi tetap dipajang sebagai aset tetap lessor = double-count: cek apakah piutang sewa sudah diakui."},
  {l:"Finance income: bunga atas piutang yang mengecil", v:"bunga efektif", v2:"tiap tahun", d:"Tiap pembayaran sewa dipecah dua: sebagian FINANCE INCOME (bunga = suku bunga implisit × saldo piutang awal periode), sebagian PELUNASAN piutang. Pola bunganya MENURUN tiap tahun karena saldo piutang mengecil — seperti angsuran KPR. Total finance income sepanjang kontrak = total pembayaran − piutang awal. Contoh: lihat baris contoh di bawah.", psak:"PSAK 116", f:"Finance income yang FLAT tiap tahun (bukan menurun) = lessor memakai metode garis lurus atas piutang — salah metode, laba tahun awal digelembungkan."},
  {l:"Operating lease: aset TETAP di neraca lessor, income garis lurus", v:"aset tetap", v2:"lease income", d:"Aset tetap tercatat di neraca lessor seperti aset biasa: disusutkan normal, diuji impairment (PSAK 236). Pembayaran sewa diakui sebagai LEASE INCOME garis lurus sepanjang masa sewa — berapapun jadwal bayarnya. Tidak ada piutang besar di awal, tidak ada derecognition. Cermin sisi lessee: penyewa mencatat ROU + liabilitas (lihat tab Impairment & Sewa), pemberi sewa tetap 'pemilik yang menyewakan'.", psak:"PSAK 116", f:"Lessor operating lease yang TIDAK menyusutkan aset sewanya = laba digelembungkan: aset yang disewakan tetap aus."},
  {l:"Contoh ilustratif — finance lease: aset 1.000, 250/tahun, 5 tahun (Rp juta)", v:"piutang 1.000", v2:"r ≈ 7,9%", d:"Lessor menyewakan mesin (nilai wajar = biaya 1.000) selama 5 tahun, pembayaran 250 tiap akhir tahun. Suku bunga implisit r DISELESAIKAN agar PV pembayaran = 1.000 → r ≈ 7,93% (250 × faktor anuitas 5 tahun pada 7,93% = 1.000). Piutang awal = 1.000 (aset keluar, piutang masuk — tanpa laba awal). Tahun 1: finance income = 7,93% × 1.000 = 79,3; kas masuk 250 → piutang akhir = 1.000 + 79,3 − 250 = 829,3. Cek: PV 4 pembayaran tersisa pada 7,93% = 829,3 ✓ — rekonsiliasi menutup. Total finance income 5 tahun = 5 × 250 − 1.000 = 250.", psak:"Hitungan modul (angka ilustratif)", f:"Suku bunga implisit bukan ditebak — ia DISELESAIKAN dari nilai wajar. Lessor yang mengumumkan r tanpa menunjukkan PV = r-nya belum teruji."},
  {l:"Contoh yang sama sebagai operating lease: income 250, depresiasi 200", v:"laba 50/tahun", v2:"garis lurus", d:"Sebagai PERBANDINGAN HIPOTETIS pola waktu (bukan pilihan bebas atas fakta yang sama — bila masa sewa 5 tahun memang ≈ umur ekonomis aset, itu sendiri indikator finance lease): andaikan kontrak yang sama diklasifikasikan OPERATING, dengan asumsi umur manfaat aset 5 tahun dan nilai residu nol: aset 1.000 TETAP di neraca, disusutkan 1.000 ÷ 5 = 200/tahun; lease income 250/tahun garis lurus → laba operasi 50/tahun. Bandingkan dengan finance lease tahun 1: finance income 79,3 (tanpa depresiasi — aset sudah keluar). Total laba 5 tahun SAMA: finance 250 = operating 5 × 50 = 250. Yang beda adalah POLA WAKTU dan tampilan neraca: finance lease front-loaded (79,3 lalu menurun), operating lease rata (50 tiap tahun); finance lease menampilkan piutang, operating menampilkan aset tetap.", psak:"Hitungan modul (angka ilustratif)", f:"Total laba sama, pola beda = klasifikasi adalah soal TIMING dan tampilan, bukan soal 'lebih menguntungkan'. Analis yang hanya membaca laba tahun-1 akan salah menilai."}
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
renderStmt("ppe");

/* ---------- PLAYGROUND ---------- */
var CARDS = [
 {t:"Revaluasi tanah +Rp20.000", q1:"Ekuitas", q2:"Depresiasi", a1:"naik", a2:"tetap",
  e:"Surplus revaluasi masuk OCI → ekuitas naik. Tanah tidak disusutkan → depresiasi tetap."},
 {t:"Impairment mesin Rp8.000", q1:"Laba", q2:"Aset", a1:"turun", a2:"turun",
  e:"Rugi impairment membebani laba dan menurunkan nilai tercatat. Menundanya = bom waktu."},
 {t:"Umur manfaat diperpanjang", q1:"Depresiasi", q2:"Laba", a1:"turun", a2:"naik",
  e:"Beban susut tahunan lebih kecil → laba naik. Legal-adjacent, tapi perubahan tiba-tiba = flag."},
 {t:"Kontrak sewa baru Rp20.000", q1:"Aset", q2:"Liabilitas", a1:"naik", a2:"naik",
  e:"PSAK 116: aset hak-guna + liabilitas sewa naik bersamaan. Neraca menggelembung dua sisi."},
 {t:"Capex > depresiasi bertahun-tahun", q1:"Indikasi ekspansi", q2:"FCFF", a1:"naik", a2:"turun",
  e:"Capex > depresiasi = INDIKASI ekspansi, bukan bukti — capex bisa sekadar mengganti aset lama atau mengejar harga aset yang naik; uji jenis investasinya sebelum menyimpulkan kapasitas tumbuh. Sementara itu kas bebas memang tertekan."},
 {t:"Jual tanah di atas nilai buku", q1:"Laba", q2:"Kas", a1:"naik", a2:"naik",
  e:"Selisih jual = laba; kas masuk. Tapi ini one-off — pisahkan dari laba operasi."}
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
    try{ localStorage.setItem("fsa_pg_m12", JSON.stringify({s:pgScore,d:pgDone,c:pgCards})); }catch(e){}
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
 {q:"PPE intensity 2025 (%)", hint:"Aset tetap ÷ total aset × 100: 230.000 ÷ 451.440 × 100", ans:51.0, dec:true, tol:0.3,
  why:"51,0% — lebih dari separuh aset tertanam di aset tetap. Perusahaan padat modal."},
 {q:"ROU share (%)", hint:"Aset hak-guna ÷ aset tetap × 100: 58.000 ÷ 230.000 × 100", ans:25.2, tol:0.3,
  why:"25,2% — seperempat aset tetap adalah hak sewa, bukan milik."},
 {q:"Impairment ilustrasi (Rp juta)", hint:"Carrying − recoverable: 50.000 − 42.000", ans:8000, dec:false, tol:100,
  why:"8.000 — rugi penurunan nilai yang membebani laba tahun berjalan."},
 {q:"Depresiasi tahunan (Rp juta)", hint:"Beban penyusutan aset tetap 2025", ans:30000, dec:false, tol:500,
  why:"30.000 — non-kas, ditambah kembali di arus kas operasi."}
];
(function(){
  var h = "";
  RATIOS.forEach(function(r,i){
    h += '<div class="ratio-card"><h3>'+(i+1)+'. '+r.q+'</h3><p class="sub">'+r.hint+'</p>'
      + '<div class="ratio-in"><input id="rin'+i+'" inputmode="decimal" placeholder="Contoh: 51,0">'
      + '<button data-r="'+i+'">Cek</button></div><div class="pg-result" id="rr'+i+'"></div></div>';
  });
  $("#ratio-wrap").innerHTML = h;
  $$("#ratio-wrap button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = +b.dataset.r, r = RATIOS[i];
      var v = parseIDNumber($("#rin"+i).value, r.dec !== undefined ? !!r.dec : (r.ans % 1 !== 0)); // F3-R14/R15: mode desimal per soal (r.dec opsional)
      var el = $("#rr"+i);
      el.className = "pg-result show";
      if(isNaN(v)){ el.innerHTML = "Masukkan angka dulu (contoh: 51,0 atau 8000)."; return; }
      el.innerHTML = Math.abs(v - r.ans) <= r.tol
        ? "<strong>Tepat ✓</strong> "+r.why
        : "<strong>Belum tepat.</strong> Coba lagi — petunjuknya sudah ada di atas.";
    });
  });
})();

/* ---------- JOURNAL ---------- */
var LENSES = {
 invest:"Lensa investasi — Bangun (capex 80.000, depresiasi 20 thn) vs sewa 10 tahun (ROU + liabilitas). Mana yang lebih baik untuk return & fleksibilitas? Tulis 3 baris.",
 credit:"Lensa kredit — Dampak tiap opsi ke D/E, coverage, dan jaminan kreditur. Opsi mana yang lebih aman untuk bank?",
 forensic:"Lensa forensik — Tulis 3 cek: apakah sewa ini sewa beneran atau utang terselubung? Apakah capex bangun dikapitalisasi wajar?"
};
var curLens = "invest";
function setLens(k){
  curLens = k;
  $$(".journal-tabs .stmt-tab").forEach(function(x){ x.classList.toggle("active", x.dataset.lens===k); });
  $("#lens-prompt").textContent = LENSES[k];
  var v = ""; try{ v = localStorage.getItem("fsa_journal_m12_"+k) || ""; }catch(e){}
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
  try{ localStorage.setItem("fsa_journal_m12_"+curLens, $("#journal-text").value); }catch(e){}
  updCount();
});
setLens("invest");

/* ---------- QUIZ + GATE ---------- */
var QUIZ = [
 {q:"Impairment diakui ketika…", o:["Recoverable < carrying amount","Carrying amount < recoverable amount","Harga pasar naik di atas nilai buku","Laba tahun berjalan naik signifikan"], a:0},
 {q:"Revaluasi tanah ke nilai wajar → …", o:["Ekuitas naik via OCI","Laba naik via OCI","Laba bersih naik","Aset naik, ekuitas tetap"], a:0},
 {q:"Aset hak-guna (ROU) muncul karena…", o:["PSAK 115","PSAK 116","IFRS 18","PSAK 109"], a:1},
 {q:"Capex > depresiasi bertahun-tahun, tanpa info jenis investasinya, paling tepat disebut…", o:["Kontraksi", "Efisiensi operasional", "Indikasi ekspansi", "Kerugian operasional"], a:2},
 {q:"Aset tetap 51% dari total aset → …", o:["Padat karya","Jasa murni","Risiko rendah","Padat modal"], a:3},
 {q:"Lessor menyewakan mesin lewat finance lease (PSAK 116). Perlakuan yang TEPAT di neraca lessor…", o:["Aset tetap dipertahankan di neraca; pembayaran sewa diakui sebagai lease income garis lurus","Aset dihapus; diakui piutang sewa pembiayaan (net investment in lease) sebesar nilai kini pembayaran","Seluruh pembayaran sewa 5 tahun diakui sebagai pendapatan di tahun pertama kontrak","Tidak ada pencatatan di neraca — sewa dicatat di luar neraca sampai lessee gagal bayar dan aset ditarik kembali"], a:1},
 {q:"Contoh modul (ilustratif): finance lease aset 1.000, pembayaran 250/tahun selama 5 tahun, suku bunga implisit ≈ 7,93%. Finance income tahun 1 = …", o:["79,3 — 7,93% × piutang awal 1.000","250 — seluruh kas yang diterima tahun 1","200 — aset 1.000 dibagi masa sewa 5 tahun","50 — selisih pembayaran 250 dengan depresiasi 200"], a:0},
 {q:"Kontrak yang sama diklasifikasikan operating lease. Laba lessor tiap tahun = …", o:["79,3 di tahun 1 lalu menurun tiap tahun","250 — seluruh pembayaran sewa diakui sebagai laba","50 — lease income 250 dikurangi depresiasi 200","0 — laba baru diakui saat aset dijual di akhir sewa"], a:2}
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
           window.FSAMistake.log(12, i, "quiz"); }catch(e){}
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
    box.innerHTML = "<h3>Gerbang Lolos ✓</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). <a href=\"../modul-13/\">Lanjut ke Modul 13 →</a></p>";
    try{ localStorage.setItem("fsa_gate_m12","lolos"); }catch(e){}
  } else if(localStorage.getItem("fsa_gate_m12") === "lolos"){
    box.innerHTML = "<h3>Belum lolos percobaan ini</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%). Tapi status <strong>LULUS</strong>-mu tetap tersimpan — tidak hilang karena satu percobaan gagal.</p>";
  } else {
    box.innerHTML = "<h3>Belum Lolos</h3><p>Skor "+score+"/"+QUIZ.length+" ("+pct+"%) — butuh ≥80%. Yang merah = salah; kunci tidak dibocorkan.</p>";
  }
  box.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ---------- RESTORE ---------- */
try{
  var pg = JSON.parse(localStorage.getItem("fsa_pg_m12") || "null");
  if(pg && pg.d > 0){
    pgScore = pg.s; pgDone = pg.d; pgCards = pg.c || [];
    pgCards.forEach(function(i){ var c = $("#pg"+i); if(c) c.dataset.scored = "1"; });
    $("#pg-score").textContent = "Skor: " + pgScore + " / 12 (" + pgCards.length + " kartu dinilai)";
  }
  if(localStorage.getItem("fsa_gate_m12") === "lolos"){
    var gb = $("#gate-box"); gb.style.display = "block";
    gb.innerHTML = "<h3>Lulus ✓</h3><p>Modul 12 sudah kamu lewati sebelumnya. <a href=\"../modul-13/\">Lanjut ke Modul 13 →</a></p>";
  }
}catch(e){}
})();
