/* FSA Lab — Toggle PSAK/IFRS vs US GAAP */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var TOPICS = [
 {t:"LIFO vs FIFO (harga naik)", s:"Beli 100 unit @Rp10 lalu 100 unit @Rp14. Jual 100 unit. Harga-harga naik.",
  ifrs:{h:"PSAK / IFRS", rows:[["Metode yang boleh","FIFO / rata-rata (LIFO dilarang)",""],["COGS","Rp1.000",""],["Persediaan akhir","Rp1.400",""],["Laba","lebih tinggi Rp400","hl"]]},
  gaap:{h:"US GAAP", rows:[["Metode yang boleh","LIFO / FIFO / rata-rata",""],["COGS","Rp1.400",""],["Persediaan akhir","Rp1.000",""],["Laba","lebih rendah Rp400","hl"]]},
  adj:"Penyesuaian analis: tambah <b>LIFO reserve</b> (selisih persediaan LIFO vs FIFO, ada di catatan) kembali ke persediaan & ekuitas sebelum membandingkan margin antar perusahaan."},
 {t:"Reversal impairment", s:"Aset dihapusbukukan Rp20.000 (2024). Nilai terpulihkan naik Rp8.000 (2025). Bukan goodwill.",
  ifrs:{h:"PSAK / IFRS", rows:[["Reversal 2025","Rp8.000 → laba naik","hl"],["Batasan","maksimal sebesar penurunan awal",""]]},
  gaap:{h:"US GAAP", rows:[["Reversal 2025","Rp0 — dilarang","hl"],["Batasan","—",""]]},
  adj:"Penyesuaian analis: keluarkan reversal dari laba normalisasi — ini one-off. Catatan: goodwill TIDAK boleh di-reverse di kedua framework."},
 {t:"Kapitalisasi biaya pengembangan", s:"Biaya development Rp30.000 memenuhi kriteria IAS 38 / PSAK (layak teknis & komersial).",
  ifrs:{h:"PSAK / IFRS", rows:[["Perlakuan","Dikapitalisasi → aset",""],["Beban 2025","Rp0 (amortisasi tahun berikut)",""],["Laba 2025","lebih tinggi Rp30.000","hl"]]},
  gaap:{h:"US GAAP", rows:[["Perlakuan","Dibebankan langsung",""],["Beban 2025","Rp30.000",""],["Laba 2025","lebih rendah Rp30.000","hl"]]},
  adj:"Penyesuaian analis: untuk perusahaan software, bandingkan <b>rasio kapitalisasi</b> (kapitalisasi ÷ total R&D) antar peer — kapitalisasi agresif = flag. <em>Penyederhanaan: ASC 985 mengecualikan software — GAAP tidak 100% 'beban semua'.</em>"},
 {t:"Revaluasi aset tetap", s:"Tanah perusahaan naik nilai wajar Rp50.000.",
  ifrs:{h:"PSAK / IFRS", rows:[["Model revaluasi","Diperbolehkan",""],["Aset","Rp50.000",""],["Ekuitas (OCI)","Rp50.000",""],["Dampak rasio","D/E turun, ROA turun","hl"]]},
  gaap:{h:"US GAAP", rows:[["Model revaluasi","Dilarang (cost only)",""],["Aset","Rp0",""],["Ekuitas","Rp0",""],["Dampak rasio","tidak berubah",""]]},
  adj:"Penyesuaian analis: revaluasi menaikkan ekuitas di atas kertas → D/E terlihat membaik. Lender sering pakai <b>tangible net worth at cost</b>. Tanya: siapa penilainya, kenapa sekarang?"},
 {t:"Klasifikasi bunga dibayar (arus kas)", s:"Bunga dibayar Rp12.000. CFO sebelum bunga Rp65.800.",
  ifrs:{h:"PSAK / IFRS", rows:[["Pilihan klasifikasi","Operasi ATAU pendanaan",""],["CFO (bunga di operasi)","Rp53.800",""],["CFO (bunga di pendanaan)","Rp65.800","hl"]]},
  gaap:{h:"US GAAP", rows:[["Pilihan klasifikasi","Wajib operasi",""],["CFO","Rp53.800",""],["CFO alternatif","tidak ada",""]]},
  adj:"Penyesuaian analis: 'CFO' bukan konsep netral-framework hari ini. Samakan dulu klasifikasinya sebelum bandingkan. Mulai 2027, PSAK 118/IFRS 18 membakukan ini."},
 {t:"CECL vs ECL (12.5)", s:"Bank punya portofolio kredit Rp1.000.000. Kerugian ekspektasian lifetime 2% = Rp20.000; ECL 12 bulan 0,5% = Rp5.000. Semua kredit masih Stage 1.",
  ifrs:{h:"PSAK 109 / IFRS 9", rows:[["Model","3-stage",""],["Cadangan awal (Stage 1)","Rp5.000 (ECL 12 bulan)",""],["Bila naik ke Stage 2","Rp20.000 (lifetime)",""],["Laba tahun 1","lebih tinggi Rp15.000","hl"]]},
  gaap:{h:"US GAAP (CECL)", rows:[["Model","lifetime sejak hari pertama",""],["Cadangan awal","Rp20.000","hl"],["Staging","tidak ada",""],["Laba tahun 1","lebih rendah Rp15.000","hl"]]},
  adj:"Penyesuaian analis: allowance bank lintas framework TIDAK bisa dibandingkan langsung — Rp5.000 vs Rp20.000 untuk portofolio yang identik. Bandingkan coverage ratio dalam satu framework, dan awasi migrasi Stage 1→2: keputusan staging = judgment manajemen yang menggerakkan laba."},
 {t:"Sewa: split US GAAP (12.8)", s:"Sewa 5 tahun, bayar Rp12.000/tahun. Liabilitas & aset hak-guna awal Rp50.000. Tahun 1: bunga Rp4.000, depresiasi aset hak-guna Rp10.000.",
  ifrs:{h:"PSAK 116 / IFRS 16", rows:[["Model lessee","satu model",""],["Beban tahun 1","Rp14.000 (10.000 depresiasi + 4.000 bunga)","hl"],["Pola beban","front-loaded — tahun awal lebih berat",""],["Laba operasi tahun 1","lebih tinggi Rp2.000",""]]},
  gaap:{h:"US GAAP", rows:[["Model lessee","operating vs finance lease",""],["Beban tahun 1 (operating)","Rp12.000 garis lurus","hl"],["Pola beban","rata — bunga+depresiasi dibungkus satu angka",""],["Laba operasi tahun 1","lebih rendah Rp2.000",""]]},
  adj:"Penyesuaian analis: kas keluar SAMA (Rp12.000/tahun), total beban 5 tahun SAMA (Rp60.000) — yang beda hanya timing & lokasi di laba rugi. Untuk bandingkan margin operasi lintas framework, normalisasi dulu (kembalikan ke beban sewa tunai atau pakai EBITDAR). Covenant berbasis 'EBITDA' wajib menyebut framework-nya."},
 {t:"Disclosure & MPM (12.9)", s:"Emiten melaporkan 'EBITDA disesuaikan' Rp95.000 — tidak termasuk beban restrukturisasi Rp15.000 dan rugi kurs Rp5.000. EBITDA ukuran baku = Rp75.000.",
  ifrs:{h:"PSAK 118 / IFRS 18 (mulai 2027)", rows:[["Status MPM","didefinisikan di standar",""],["Rekonsiliasi wajib","95.000 − 15.000 − 5.000 = 75.000","hl"],["Syarat","jelaskan tiap penyesuaian + efek pajak",""],["Penyajian","tak boleh lebih menonjol dari ukuran baku",""]]},
  gaap:{h:"US GAAP (aturan SEC)", rows:[["Status non-GAAP","Reg G / Item 10(e)",""],["Rekonsiliasi wajib","95.000 → 75.000","hl"],["Larangan","item 'normal & recurring' tak boleh disesuaikan",""],["Penegakan","SEC agresif via comment letter",""]]},
  adj:"Penyesuaian analis: angka 'disesuaikan' = klaim manajemen, bukan fakta. Selalu mulai dari ukuran baku Rp75.000, lalu tanya: penyesuaian mana yang recurring? Restrukturisasi tiap tahun = beban biasa yang disamarkan. Mulai 2027, emiten Indonesia kena disiplin MPM yang sama ketatnya."}
];

function render(i){
  var t = TOPICS[i];
  $("#tgl-scenario").innerHTML = "<p><strong>Skenario:</strong> "+t.s+"</p>";
  [["#tgl-ifrs",t.ifrs],["#tgl-gaap",t.gaap]].forEach(function(pair){
    var el = $(pair[0]), d = pair[1], h = "<h3>"+d.h+"</h3>";
    d.rows.forEach(function(r){
      h += '<div class="k">'+r[0]+'</div><div class="v'+(r[2]==="hl"?" hl":"")+'">'+r[1]+"</div>";
    });
    el.innerHTML = h;
  });
  $("#tgl-adjust").innerHTML = "<h3>Penyesuaian analis</h3><p>"+t.adj+"</p>";
  $$("#tgl-tabs .stmt-tab").forEach(function(b,j){ b.classList.toggle("active", j===i); });
}
var tabs = "";
TOPICS.forEach(function(t,i){ tabs += '<button class="stmt-tab'+(i===0?" active":"")+'">'+t.t+'</button>'; });
$("#tgl-tabs").innerHTML = tabs;
$$("#tgl-tabs .stmt-tab").forEach(function(b,i){ b.addEventListener("click", function(){ render(i); }); });
render(0);

var QUIZ = [
 {q:"Perusahaan US pakai LIFO saat harga naik vs peer Indonesia pakai FIFO. Laba US akan…", o:["Lebih tinggi","Lebih rendah","Sama","Tidak bisa dibandingkan sama sekali"], a:1},
 {q:"Revaluasi tanah Rp50.000 di PSAK. Dampak ke D/E ratio?", o:["Naik","Turun (ekuitas naik)","Tetap","Jadi negatif"], a:1},
 {q:"Agar CFO bisa dibandingkan antar framework, analis harus…", o:["Pakai angka apa adanya","Samakan klasifikasi bunga/dividen dulu","Abaikan arus kas","Pakai metode langsung"], a:1}
];
var h = "";
QUIZ.forEach(function(q,i){
  h += '<div class="quiz-q" id="qq'+i+'"><h3>'+(i+1)+'. '+q.q+'</h3>';
  q.o.forEach(function(o,j){ h += '<label><input type="radio" name="q'+i+'" value="'+j+'" style="margin-right:.5rem">'+o+'</label>'; });
  h += '</div>';
});
$("#quiz-wrap").innerHTML = h;
$("#quiz-submit").addEventListener("click", function(){
  var score = 0;
  QUIZ.forEach(function(q,i){
    var sel = document.querySelector('input[name="q'+i+'"]:checked');
    $$('#qq'+i+' label').forEach(function(lb,j){
      lb.classList.remove("right","wrong");
      if(j === q.a) lb.classList.add("right");
      else if(sel && +sel.value === j) lb.classList.add("wrong");
    });
    if(sel && +sel.value === q.a) score++;
  });
  var box = $("#gate-box"); box.style.display = "block";
  box.innerHTML = "<h3>Skor "+score+"/"+QUIZ.length+"</h3><p>Uji kilat formatif — tidak ada gerbang di halaman ini.</p>";
  box.scrollIntoView({behavior:"smooth", block:"center"});
});
})();
