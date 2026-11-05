/* FSA Lab — Cooked Books Simulator: 9 skenario forensik */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

var MANIPS = ["Channel stuffing (penjualan dipompa)","Kapitalisasi beban operasi","Utang disembunyikan","Tidak ada manipulasi","Cookie jar reserve (cadangan disembunyikan)","Pendapatan pihak berelasi (tunneling)","Big bath (rugi jumbo sekali jalan)"];
var SCREENS = ["DSO drift (piutang vs penjualan)","Accrual gap (NI − CFO)","DPO / layar liabilitas","Tidak ada yang mencurigakan","Beban provisi / akrual cadangan","Penjualan pihak berelasi / DSO berelasi","One-off / beban luar biasa"];

var SCEN = [
 {name:"Kasus 1", diff:"Mudah",
  brief:"Nusantara Makmur melaporkan penjualan meledak. Semua terlihat hebat — atau tidak?",
  lines:[["Penjualan","540.000"],["Laba bersih","65.520"],["Piutang usaha","132.000"],["Arus kas operasi","38.800"],["Total aset","461.000"]],
  screens:[["DSO","89,2 hari",1,"tahun lalu 54,8 hari — piutang tumbuh jauh di atas penjualan"],["CFO / NI","0,59x",1,"laba tidak jadi kas"],["Akrual (NI−CFO)","+26.720",1,"positif besar"]],
  aManip:0, aScreen:0,
  reveal:"<strong>Channel stuffing:</strong> penjualan +Rp60.000 dipompa ke distributor (piutang +Rp60.000). Laba naik Rp18.720 tapi kas NOL dari penjualan itu. DSO 54,8 → 89,2 hari adalah screen yang menangkapnya duluan — piutang tumbuh ~6x lipat penjualan (+83% vs +12,5%)."},
 {name:"Kasus 2", diff:"Sedang",
  brief:"Laba melonjak tanpa penjualan tambahan. Efisiensi ajaib?",
  lines:[["Penjualan","480.000"],["Laba bersih","78.000"],["Beban operasi","80.000"],["Aset tetap neto","250.000"],["Arus kas operasi","53.800"]],
  screens:[["Akrual (NI−CFO)","+24.200",1,"positif besar — laba jauh di atas kas"],["CFO / NI","0,69x",1,"di bawah 1"],["DSO","54,8 hari",0,"normal"],["Aset tetap","Rp250.000",1,"naik Rp40.000 tanpa capex baru"]],
  aManip:1, aScreen:1,
  reveal:"<strong>Kapitalisasi beban (trik WorldCom):</strong> Rp40.000 beban operasi dipindah jadi aset. Laba +Rp31.200, aset +Rp40.000, kas tetap. Accrual gap NI−CFO = +24.200 menangkapnya — dan aset tetap yang naik tanpa belanja modal adalah konfirmasi.<br><br><em>Catatan jujur:</em> skenario ini disederhanakan — dalam praktik, beban yang dikapitalisasi biasanya berupa <strong>kas</strong>, sehingga arus keluar pindah ke investasi dan CFO justru terlihat <strong>lebih sehat</strong>. Itulah yang terjadi di WorldCom: CFO-nya tampak bagus justru karena manipulasinya."},
 {name:"Kasus 3", diff:"Sulit",
  brief:"Laba naik, utang turun. Terlalu bagus untuk jadi kenyataan?",
  lines:[["Penjualan","480.000"],["Laba bersih","66.300"],["Utang usaha","23.000"],["Beban operasi","95.000"],["Arus kas operasi","53.800"]],
  screens:[["DPO","29,1 hari",1,"tahun lalu 60,8 hari — utang menyusut misterius"],["CFO / NI","0,81x",0,"agak rendah"],["DSO","54,8 hari",0,"normal"],["Utang vs pembelian","turun 52%",1,"pembelian naik, utang turun = tidak wajar"]],
  aManip:2, aScreen:2,
  reveal:"<strong>Utang disembunyikan:</strong> Rp25.000 utang usaha tidak dicatat (dan bebannya ikut hilang). Laba +Rp19.500 semu. DPO ambruk 60,8 → 29,1 hari + utang turun saat pembelian naik = screen-nya. Keluarga fraud kedua: liabilitas yang tidak tercatat."},
 {name:"Kasus 4", diff:"Sulit",
  brief:"Penjualan +20%, piutang +65%. Manajemen bangga: ekspansi pabrik selesai. Mana yang bohong?",
  lines:[["Penjualan","540.000"],["Laba bersih","70.200"],["Piutang usaha","148.500"],["Arus kas operasi","50.400"],["Total aset","520.000"]],
  screens:[["DSO","100,4 hari",1,"tahun lalu 73,0 hari — piutang tumbuh jauh di atas penjualan"],["CFO / NI","0,72x",1,"laba tidak jadi kas"],["Akrual (NI−CFO)","+19.800",1,"positif besar"],["Aset tetap","Rp285.000",0,"naik Rp35.000 — TAPI arus kas investasi menunjukkan capex Rp35.000 nyata (pengecoh!)"]],
  aManip:0, aScreen:0,
  reveal:"<strong>Channel stuffing:</strong> Rp58.500 penjualan dipompa ke distributor (piutang +Rp58.500) — selaras dengan kenaikan piutang +65%. Dari +Rp90.000 kenaikan penjualan tercatat, Rp58.500 adalah pomping; pertumbuhan riil hanya +7%. Laba naik Rp18.252 semu tapi kas NOL dari penjualan yang dipompa itu. DSO 73,0 → 100,4 hari menangkapnya duluan.<br><br><em>Jebakan yang disengaja:</em> aset tetap naik Rp35.000 menggoda jawaban 'kapitalisasi beban' — tapi arus kas investasi menunjukkan capex Rp35.000 yang NYATA (pabrik baru). Screen forensik yang baik memeriksa konfirmasi, bukan cuma sinyal."},
 {name:"Kasus 5", diff:"Sulit",
  brief:"Laba +62%, semua rasio terlihat sempurna. Terlalu bagus untuk jadi kenyataan — atau memang bagus?",
  lines:[["Penjualan","620.000"],["Laba bersih","74.400"],["Piutang usaha","84.900"],["Arus kas operasi","81.800"],["Total aset","580.000"]],
  screens:[["DSO","50,0 hari",0,"persis seperti tahun lalu — pertumbuhan penjualan riil"],["CFO / NI","1,10x",0,"kas melebihi laba — kualitas laba tinggi"],["Akrual (NI−CFO)","−7.400",0,"negatif = kas lebih besar dari laba"],["Penjualan vs piutang","+29% vs +29%",0,"tumbuh seiring — bukan pomping"]],
  aManip:3, aScreen:3,
  reveal:"<strong>Tidak ada manipulasi.</strong> Ini jebakan klasik analis junior: 'terlalu bagus untuk jadi kenyataan' BUKAN bukti. Semua screen bersih — DSO stabil 50,0 hari, kas melebihi laba (1,10x), penjualan dan piutang tumbuh seiring +29%.<br><br>Analis hebat tahu kapan berkata 'bersih'. Menuduh tanpa screen yang mendukung = fitnah, bukan forensik."},
 {name:"Kasus 6", diff:"Sulit",
  brief:"Beban operasi turun 32% saat penjualan naik 15%. Efisiensi legendaris — atau akuntansi kreatif?",
  lines:[["Penjualan","540.000"],["Laba bersih","82.000"],["Beban operasi","76.000"],["Aset tetap neto","260.000"],["Arus kas operasi","51.200"]],
  screens:[["Akrual (NI−CFO)","+30.800",1,"positif besar — laba jauh di atas kas"],["CFO / NI","0,62x",1,"sangat rendah"],["Aset tetap vs capex","+50.000 vs 12.000",1,"aset naik 4x lipat capex — beban dikapitalisasi?"],["DSO","63,5 hari",0,"tahun lalu 56,0 hari — naik 7,5 hari, MASIH di bawah ambang 15 hari (pengecoh!)"]],
  aManip:1, aScreen:1,
  reveal:"<strong>Kapitalisasi beban (trik WorldCom, versi licin):</strong> Rp50.000 beban operasi dipindah jadi aset. Laba +Rp39.000 semu, aset tetap 210.000 → 260.000 — padahal capex (arus kas investasi) cuma Rp12.000. Mismatch aset-vs-capex adalah konfirmasinya.<br><br><em>Jebakan yang disengaja:</em> DSO naik 7,5 hari menggoda jawaban 'channel stuffing' — tapi masih di bawah ambang 15 hari = noise normal. Accrual gap NI−CFO = +30.800 yang menangkap manipulasi sebenarnya."},
 {name:"Kasus 7", diff:"Sedang",
  brief:"Baruna Lines melaporkan laba anjlok — tapi arus kasnya justru menguat. Manajemen menyalahkan 'kondisi pasar'. (Angka ilustratif.)",
  lines:[["Penjualan","500.000"],["Laba bersih","50.400"],["Beban provisi","35.000"],["Piutang usaha","90.000"],["Arus kas operasi","80.000"]],
  screens:[["Beban provisi","7,0% penjualan",1,"historis 2,0% — melonjak 3,5x tanpa penjelasan"],["Akrual (NI−CFO)","−29.600",1,"negatif besar — laba semu jauh di bawah kas (provisi non-kas)"],["CFO / NI","1,59x",1,"kas jauh melebihi laba — laba DITEKAN, bukan dipompa"],["DSO","65,7 hari",0,"stabil (tahun lalu 64,9) — kualitas piutang TIDAK memburuk (pengecoh!)"]],
  aManip:4, aScreen:4,
  reveal:"<strong>Cookie jar reserve:</strong> di tahun yang sebenarnya bagus, manajemen menyembunyikan laba Rp19.500 (setelah pajak) lewat beban provisi yang digelembungkan Rp25.000 — dari 2% historis menjadi 7% penjualan. Kelebihan cadangan ini disimpan sebagai 'toples kue' untuk dilepas di tahun jelek nanti, merapikan laba.<br><br>Screen-nya: provisi 3,5x lipat historis + akrual −29.600 yang sangat negatif — padahal DSO stabil 65,7 hari membuktikan kualitas piutang TIDAK memburuk, jadi provisinya tak berdasar.<br><br><em>Catatan jujur:</em> akrual negatif ekstrem di sini BUKAN tanda kualitas laba tinggi — melainkan laba yang DITEKAN. Arah akrual penting: positif besar = laba dipompa, negatif besar = laba disembunyikan."},
 {name:"Kasus 8", diff:"Sedang",
  brief:"Sentosa Group membukukan penjualan +25% dengan margin tertinggi sepanjang sejarah — sepertiga penjualannya ke 'pelanggan strategis'. (Angka ilustratif.)",
  lines:[["Penjualan","600.000"],["Laba bersih","66.000"],["Penjualan pihak berelasi","180.000"],["Piutang pihak berelasi","120.000"],["Arus kas operasi","30.000"]],
  screens:[["Penjualan berelasi","30,0%",1,"historis 10% — melonjak 3x dalam setahun"],["DSO berelasi","243,3 hari",1,"vs DSO non-berelasi 54,8 hari — menumpuk, tak tertagih"],["Akrual (NI−CFO)","+36.000",1,"laba jauh di atas kas"],["DPO","58,2 hari",0,"normal seperti tahun lalu — pembayaran pemasok wajar (pengecoh!)"]],
  aManip:5, aScreen:5,
  reveal:"<strong>Related-party revenue (tunneling):</strong> Rp180.000 penjualan (30%, dari historis 10%) dibukukan ke pihak berelasi dengan margin di atas normal — piutangnya Rp120.000 menumpuk 243,3 hari dan praktis tak tertagih. Laba semu, kas NOL: akrual +36.000.<br><br>Screen-nya: pangsa berelasi yang melonjak 3x + DSO berelasi 4,4x lipat DSO normal (54,8 hari). Ini keluarga fraud ketiga: <em>related-party transactions</em> (PSAK 224). DPO yang normal adalah pengecoh — masalahnya di sisi penjualan, bukan pemasok."},
 {name:"Kasus 9", diff:"Sulit",
  brief:"Cakra Steel — enam bulan setelah CEO baru menjabat — melaporkan rugi pertama dalam 20 tahun: impairment + provisi jumbo 'pembersihan'. (Angka ilustratif.)",
  lines:[["Penjualan","520.000"],["Rugi bersih","(45.000)"],["Beban impairment","60.000"],["Provisi restrukturisasi","25.000"],["Arus kas operasi","48.000"]],
  screens:[["One-off / penjualan","16,3%",1,"impairment 60.000 + provisi 25.000 = Rp85.000 sekali jalan"],["Akrual (NI−CFO)","−93.000",1,"negatif EKSTREM — rugi akuntansi, kas operasional tetap sehat"],["Laba continuing","+21.300",1,"tanpa one-off bisnis masih untung — rugi hanya di kertas"],["DSO","61,2 hari",0,"stabil — bukan masalah piutang (pengecoh!)"]],
  aManip:6, aScreen:6,
  reveal:"<strong>Big bath:</strong> CEO baru mengambil 'mandi besar' — impairment Rp60.000 + provisi restrukturisasi Rp25.000 (16,3% penjualan) dibebankan SEKALIGUS di tahun pergantian. Tanpa one-off, bisnis masih untung Rp21.300; kas operasi Rp48.000 tetap sehat.<br><br>Motifnya klasik: rendahkan basis perbandingan agar tahun depan tampak 'pulih' — dan target bonus dihitung dari pertumbuhan. Screen-nya: one-off jumbo + akrual −93.000 yang ekstrem negatif, sementara DSO normal membuktikan ini bukan krisis piutang.<br><br><em>Bedakan dengan cookie jar (Kasus 7):</em> cookie jar menyembunyikan laba di tahun BAGUS; big bath memusatkan rugi di tahun JELEK — sering tepat setelah pergantian CEO."}
];

 /* === Workstream D — narasi investigasi (array TERPISAH; SCEN/MANIPS/SCREENS tidak disentuh) ===
    BRIEFS[i]: brief kasus 2-3 kalimat (peran auditor forensik, perusahaan fiktif, periode).
    DEBRIEFS[i]: debrief naratif 2-3 kalimat setelah vonis + pelajaran triple-lens 1 baris.
    Perusahaan: Kasus 1-6 = PT Nusantara Makmur (ilustratif, BUKAN kanonis);
    Kasus 7 = Baruna Lines, Kasus 8 = Sentosa Group, Kasus 9 = Cakra Steel.
    PT Cemerlang Abadi SENGAJA tidak dipakai (angka kanonis modul). */
 var BRIEFS = [
 "Kamu auditor forensik yang ditugaskan memeriksa PT Nusantara Makmur untuk tahun buku 2025. Perusahaan melaporkan penjualan meledak dan manajemen mengklaim strategi distributor baru yang agresif. Tugasmu: verifikasi apakah pertumbuhan itu nyata — atau sekadar \u201Cdipompa\u201D.",
 "Kamu auditor forensik memeriksa PT Nusantara Makmur, tahun buku 2025. Laba melonjak tanpa penjualan tambahan; CFO mengklaim \u201Cefisiensi operasional\u201D. Tugasmu: telusuri apakah efisiensi itu nyata, atau beban yang disembunyikan di neraca.",
 "Kamu auditor forensik untuk PT Nusantara Makmur, tahun buku 2025. Laba naik sementara utang usaha justru turun — kombinasi yang jarang terjadi bersamaan. Tugasmu: pastikan tidak ada liabilitas yang \u201Clupa\u201D dicatat.",
 "Kamu auditor forensik kembali memeriksa PT Nusantara Makmur, tahun buku 2025. Penjualan +20% dan piutang +65%; manajemen menunjuk ekspansi pabrik yang baru selesai sebagai bukti pertumbuhan riil. Tugasmu: pisahkan pertumbuhan asli dari angka yang dipoles — dan waspadai pengecoh.",
 "Kamu auditor forensik memeriksa PT Nusantara Makmur, tahun buku 2025 — tahun terbaik dalam sejarah perusahaan. Laba +62% dan semua rasio terlihat sempurna. Tugasmu: buktikan secara forensik apakah ini kinerja asli atau terlalu bagus untuk jadi kenyataan — ingat, analis hebat tahu kapan berkata \u201Cbersih\u201D.",
 "Kamu auditor forensik memeriksa PT Nusantara Makmur, tahun buku 2025, di bawah CFO yang baru menjabat. Beban operasi turun 32% saat penjualan naik 15% — klaimnya \u201Ctransformasi efisiensi\u201D. Tugasmu: uji klaim itu terhadap arus kas dan belanja modal.",
 "Kamu auditor forensik memeriksa Baruna Lines, perusahaan pelayaran, untuk tahun buku 2025. Laba anjlok tapi arus kas operasi justru menguat; manajemen menyalahkan \u201Ckondisi pasar\u201D. Tugasmu: cari tahu apakah pasar yang lesu — atau laba yang disembunyikan.",
 "Kamu auditor forensik memeriksa Sentosa Group untuk tahun buku 2025. Penjualan +25% dengan margin tertinggi sepanjang sejarah — sepertiga penjualannya ke \u201Cpelanggan strategis\u201D. Tugasmu: selidiki siapa pelanggan itu sebenarnya, dan apakah piutangnya akan tertagih.",
 "Kamu auditor forensik memeriksa Cakra Steel untuk tahun buku 2025 — enam bulan setelah CEO baru menjabat. Perusahaan melaporkan rugi pertama dalam 20 tahun: impairment dan provisi jumbo yang disebut \u201Cpembersihan\u201D. Tugasmu: tentukan apakah ini pembersihan yang jujur, atau rugi yang dipusatkan agar tahun depan tampak pulih."
 ];

 var DEBRIEFS = [
 "Yang sebenarnya terjadi: tim penjualan Nusantara Makmur memompa penjualan Rp60.000 ke distributor di akhir tahun — barang menumpuk di gudang distributor, kas nol rupiah masuk. DSO yang melonjak dari 54,8 ke 89,2 hari adalah jejak yang tak bisa dihapus. Pelajaran triple-lens — forensik: piutang yang tumbuh jauh di atas penjualan = pompa; investasi: laba tanpa kas = laba semu; kredit: DSO memburuk = kolektibilitas melemah.",
 "Yang sebenarnya terjadi: CFO memindahkan Rp40.000 beban operasi menjadi aset — trik yang sama dengan skandal WorldCom 2002. Laba naik Rp31.200 di kertas, tapi tidak ada kas tambahan sepeser pun. Pelajaran triple-lens — forensik: accrual gap NI\u2212CFO positif besar = waspada; investasi: aset naik tanpa capex = kualitas aset dipertanyakan; kredit: cek arus kas investasi sebelum percaya klaim \u201Cefisiensi\u201D.",
 "Yang sebenarnya terjadi: Rp25.000 utang usaha — beserta bebannya — tidak dicatat, sehingga laba terlihat Rp19.500 lebih tinggi. DPO yang ambruk dari 60,8 ke 29,1 hari adalah pengakuan diam-diam: utang tidak mungkin menyusut saat pembelian naik. Pelajaran triple-lens — forensik: liabilitas adalah keluarga fraud kedua yang sering luput; investasi: margin yang naik karena beban hilang = tidak berkelanjutan; kredit: utang tercatat lebih kecil = leverage terlihat palsu aman.",
 "Yang sebenarnya terjadi: dari +Rp90.000 kenaikan penjualan, Rp58.500 adalah pomping ke distributor — pertumbuhan riil hanya +7%. Pabrik baru Rp35.000 memang nyata (capex tercatat), dan justru dipakai sebagai tameng agar analis berhenti menggali. Pelajaran triple-lens — forensik: konfirmasi satu screen (capex nyata) tidak membatalkan screen lain (DSO); investasi: bedakan pertumbuhan volume vs pertumbuhan piutang; kredit: DSO 100,4 hari = risiko gagal bayar distributor menumpuk.",
 "Yang sebenarnya terjadi: tidak ada apa-apa — ini memang tahun terbaik Nusantara Makmur yang sesungguhnya. Penjualan dan piutang tumbuh seiring +29%, kas melebihi laba, DSO stabil 50,0 hari. Pelajaran triple-lens — forensik: \u201Cterlalu bagus\u201D bukan bukti tanpa screen yang mendukung; investasi: kualitas laba (CFO/NI 1,10x) justru mendukung valuasi; kredit: arus kas yang menutupi laba = kapasitas bayar kuat. Menuduh tanpa bukti adalah fitnah, bukan forensik.",
 "Yang sebenarnya terjadi: CFO baru memindahkan Rp50.000 beban operasi menjadi aset tetap — aset naik 210.000 ke 260.000 padahal capex hanya Rp12.000. Kenaikan DSO 7,5 hari sengaja dibiarkan sebagai umpan agar analis menuduh channel stuffing yang salah alamat. Pelajaran triple-lens — forensik: bandingkan selalu aset tetap vs arus kas investasi; investasi: \u201Cefisiensi\u201D yang tidak tercermin di kas = manipulasi; kredit: laba semu Rp39.000 menggelembungkan coverage ratio.",
 "Yang sebenarnya terjadi: di tahun yang sebenarnya bagus, manajemen Baruna Lines menggelembungkan beban provisi dari 2% menjadi 7% penjualan — menyembunyikan laba Rp19.500 (setelah pajak) sebagai \u201Ctoples kue\u201D untuk dirilis di tahun jelek nanti. DSO yang stabil 65,7 hari membuktikan kualitas piutang tidak memburuk — provisinya tak berdasar. Pelajaran triple-lens — forensik: akrual negatif ekstrem = laba ditekan, bukan kualitas tinggi; investasi: laba yang diratakan menyembunyikan volatilitas asli; kredit: kas operasi Rp80.000 menunjukkan kemampuan bayar jauh di atas laba tercatat.",
 "Yang sebenarnya terjadi: Sentosa Group membukukan Rp180.000 penjualan ke pihak berelasi (naik dari 10% menjadi 30%) dengan margin di atas normal — piutang Rp120.000 menumpuk 243,3 hari dan praktis tak tertagih. Ini tunneling: laba dipompa lewat transaksi afiliasi, kas nol. Pelajaran triple-lens — forensik: pangsa berelasi melonjak + DSO berelasi 4,4x lipat DSO normal = red flag PSAK 224; investasi: margin dari penjualan berelasi bukan keunggulan kompetitif; kredit: piutang berelasi 243 hari praktis bukan aset lancar yang bisa diandalkan.",
 "Yang sebenarnya terjadi: CEO baru Cakra Steel mengambil \u201Cmandi besar\u201D — impairment Rp60.000 + provisi restrukturisasi Rp25.000 dibebankan sekaligus agar basis perbandingan rendah dan tahun depan tampak \u201Cpulih\u201D (target bonus dihitung dari pertumbuhan). Tanpa one-off, bisnis masih untung Rp21.300 dan kas operasi Rp48.000 tetap sehat. Pelajaran triple-lens — forensik: bedakan big bath (rugi dipusatkan di tahun jelek) vs cookie jar (laba disembunyikan di tahun bagus); investasi: nilai dari laba continuing, bukan laba yang \u201Cdimandikan\u201D; kredit: kas operasi sehat = kemampuan bayar tidak terganggu rugi kertas."
 ];

 /* Evidence log: user mengklik kartu screen untuk menandai red flag sebagai bukti.
    1 kalimat bukti per red flag diambil dari data screen existing (nama + nilai + catatan). */
 function evidText(s, k){
   var sc = s.screens[k];
   return sc[0]+" ("+sc[1]+") — "+sc[3];
 }
 function toggleEvidence(i, el){
   var k = +el.getAttribute("data-sc");
   var s = SCEN[i];
   var on = el.getAttribute("data-ev") === "1";
   var sn = el.querySelector(".sn");
   var list = document.getElementById("sim-evlist");
   var empty = document.getElementById("sim-evlog-empty");
   if(on){
     el.setAttribute("data-ev", "0");
     if(sn) sn.textContent = s.screens[k][0];
     var item = document.getElementById("sim-ev-"+i+"-"+k);
     if(item && item.parentNode) item.parentNode.removeChild(item);
   } else {
     el.setAttribute("data-ev", "1");
     if(sn) sn.textContent = "\u2713 "+s.screens[k][0];
     if(list){
       var li = document.createElement("li");
       li.id = "sim-ev-"+i+"-"+k;
       li.textContent = evidText(s, k);
       list.appendChild(li);
     }
   }
   if(list && empty) empty.style.display = list.children.length ? "none" : "";
 }

function renderTabs(){
  var h = "";
  SCEN.forEach(function(s,i){
    h += '<button class="stmt-tab'+(i===0?" active":"")+'" data-s="'+i+'">'+s.name+" · "+s.diff+"</button>";
  });
  $("#sim-tabs").innerHTML = h;
  $$("#sim-tabs .stmt-tab").forEach(function(b){
    b.addEventListener("click", function(){ render(+b.dataset.s); });
  });
}
function render(i){
  var s = SCEN[i];
  var caseBrief = (typeof BRIEFS !== "undefined" && BRIEFS[i]) || "";
  var caseDebrief = (typeof DEBRIEFS !== "undefined" && DEBRIEFS[i]) || "";
  $$("#sim-tabs .stmt-tab").forEach(function(b,j){ b.classList.toggle("active", j===i); });
  var h = '<div class="pg-card"><h3>'+s.name+" — "+s.diff+'</h3>';
  if(caseBrief) h += '<p class="kicker">Brief investigasi</p><p class="lede">'+caseBrief+'</p>';
  h += '<p class="sub">'+s.brief+'</p>';
  h += '<table class="stmt"><tr><th>Pos kunci (Rp juta)</th><th style="text-align:right">Nilai</th></tr>';
  s.lines.forEach(function(l){ h += '<tr><td>'+l[0]+'</td><td class="val">'+l[1]+'</td></tr>'; });
  h += '</table><h3 style="font-family:var(--font-display);margin:.6rem 0">Screen forensik</h3><div class="sim-screens">';
  s.screens.forEach(function(sc,k){
    h += '<div class="screen" data-sc="'+k+'" data-ev="0" tabindex="0" role="button" title="Klik untuk menandai sebagai bukti"><span class="sn">'+sc[0]+'</span><span class="sv'+(sc[2]?" bad":"")+'">'+sc[1]+"</span></div>";
  });
  h += '</div><h3 style="font-family:var(--font-display);margin:1rem 0 .5rem">Bukti terkumpul</h3>'
    + '<div class="pg-result show"><p class="sub" id="sim-evlog-empty">Belum ada bukti yang ditandai. Klik kartu screen di atas untuk menandai red flag sebagai bukti.</p>'
    + '<ol id="sim-evlist" style="margin:.4rem 0 0;padding-left:1.3rem"></ol></div>';
  h += '<h3 style="font-family:var(--font-display);margin:1rem 0 .5rem">1. Manipulasi apa ini?</h3>';
  MANIPS.forEach(function(m,j){ h += '<label class="quiz-q sim-opt"><input type="radio" name="m'+i+'" value="'+j+'">'+m+'</label>'; });
  h += '<h3 style="font-family:var(--font-display);margin:1rem 0 .5rem">2. Screen apa yang menangkapnya duluan?</h3>';
  SCREENS.forEach(function(m,j){ h += '<label class="quiz-q sim-opt"><input type="radio" name="s'+i+'" value="'+j+'">'+m+'</label>'; });
  h += '<br><button class="btn btn-primary" id="sim-go">Ungkap</button><div class="pg-result" id="sim-res"></div></div>';
  $("#sim-body").innerHTML = h;
  $$("#sim-body .screen").forEach(function(el){
    el.addEventListener("click", function(){ toggleEvidence(i, el); });
    el.addEventListener("keydown", function(e){
      if(e.key === "Enter" || e.key === " "){ e.preventDefault(); toggleEvidence(i, el); }
    });
  });
  $("#sim-go").addEventListener("click", function(){
    var pm = document.querySelector('input[name="m'+i+'"]:checked');
    var ps = document.querySelector('input[name="s'+i+'"]:checked');
    var r = $("#sim-res");
    if(!pm || !ps){ r.className = "pg-result show"; r.innerHTML = "Jawab kedua pertanyaan dulu."; return; }
    var score = (+pm.value === s.aManip ? 1 : 0) + (+ps.value === s.aScreen ? 1 : 0);
    var key = "fsa_sim_"+i, best = score;
    try{
      var prev = parseInt(localStorage.getItem(key)||"-1", 10);
      best = Math.max(score, prev);
      localStorage.setItem(key, String(best));
    }catch(e){}
    r.className = "pg-result show";
    r.innerHTML = "<strong>Skor: "+score+"/2 · terbaikmu: "+best+"/2.</strong><br><br>"+s.reveal
      + (caseDebrief ? "<br><br><strong>Debrief investigasi:</strong> "+caseDebrief : "")
      + "<br><br>Screen yang relevan: <strong>"+s.screens.filter(function(x){return x[2];}).map(function(x){return x[0]+" ("+x[3]+")";}).join("; ")+"</strong>";
    r.scrollIntoView({behavior:"smooth", block:"center"});
  });
}
renderTabs(); render(0);
})();
