/* FSA Lab — Peta Risiko Indonesia v1.
   Heatmap 10 sektor x 7 driver. Skor 1-5 = PENILAIAN ANALIS (judgment), STATIS,
   ILUSTRATIF — bukan data live. Lihat metodologi di index.html. */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };

var DRIVERS = [
  {k:"usd",    l:"Utang USD"},
  {k:"komod",  l:"Harga komoditas"},
  {k:"regul",  l:"Regulasi"},
  {k:"relasi", l:"Pihak berelasi"},
  {k:"likuid", l:"Likuiditas"},
  {k:"bunga",  l:"Suku bunga"},
  {k:"gov",    l:"Tata kelola"}
];

// skor [usd, komod, regul, relasi, likuid, bunga, gov] + alasan singkat per sel
var SECTORS = [
  {n:"Bank", v:[3,2,4,2,2,4,2], why:{
    usd:"Sebagian bank punya utang valas, tapi lindung nilai & LDR dijaga OJK.",
    komod:"Eksposur tidak langsung via debitur komoditas.",
    regul:"Regulasi OJK ketat: modal, CKPN (PSAK 109/ECL), restrukturisasi.",
    relasi:"Kepemilikan terkonsentrasi ada, tapi pengawasan OJK menekan tunneling.",
    likuid:"Dana pihak ketiga stabil; likuiditas umumnya aman.",
    bunga:"NIM sensitif terhadap BI rate — margin tertekan saat bunga naik.",
    gov:"Governance bank besar relatif paling disiplin di IDX."}},
  {n:"Batubara", v:[4,5,4,4,2,2,4], why:{
    usd:"Banyak utang dolar untuk ekspansi tambang; pendapatan justru dolar — natural hedge parsial.",
    komod:"Skor 5: margin 100% ditentukan harga batubara global yang siklikal.",
    regul:"Royalti, DMO, dan kebijakan hilirisasi bisa mengubah ekonomi tambang semalam.",
    relasi:"Konsesi & trading sering melibatkan entitas afiliasi pemilik.",
    likuid:"Kas tebal saat harga tinggi; likuiditas jarang masalah di puncak siklus.",
    bunga:"Capex tambang umumnya ekuitas/kas internal saat boom.",
    gov:"Transparansi royalti & reklamasi masih jadi sorotan."}},
  {n:"Nikel", v:[4,4,5,3,3,3,4], why:{
    usd:"Smelter dibiayai utang dolar jumbo; pendapatan dolar tapi capex dolar juga.",
    komod:"Harga nikel global menentukan; oversupply smelter menekan margin.",
    regul:"Skor 5: larangan ekspor ore & kebijakan hilirisasi = hidup-mati sektor.",
    relasi:"Rantai tambang-smelter-trading kerap satu grup.",
    likuid:"Leverage smelter tinggi; refinancing risk nyata bila harga jatuh.",
    bunga:"Utang proyek sensitif terhadap cost of debt.",
    gov:"Konsesi & perizinan rawan konflik kepentingan."}},
  {n:"CPO", v:[3,4,4,4,2,2,4], why:{
    usd:"Utang dolar moderat; pendapatan ekspor dolar memberi hedge alami.",
    komod:"Harga CPO global siklikal; margin kebun fluktuatif.",
    regul:"DMO, pungutan ekspor, dan moratorium lahan mengubah kalkulasi.",
    relasi:"Perkebunan grup keluarga klasik: plasma, trading afiliasi, transfer pricing.",
    likuid:"Arus kas kebun menghasilkan; likuiditas umumnya cukup.",
    bunga:"Leverage moderat; sensitivitas bunga rendah.",
    gov:"Sengketa lahan & plasma jadi risiko reputasi-hukum."}},
  {n:"Properti", v:[2,1,3,4,5,5,3], why:{
    usd:"Utang dolar kecil; bisnis domestik rupiah.",
    komod:"Hampir tidak relevan — properti bukan komoditas.",
    regul:"Aturan LTV, perizinan, dan pajak properti memengaruhi permintaan.",
    relasi:"Developer grup keluarga: penjualan ke afiliasi & proyek antar-grup umum.",
    likuid:"Skor 5: presales melambat = kas macet, utang obligasi jatuh tempo.",
    bunga:"Skor 5: KPR & cost of debt langsung menentukan daya beli dan margin.",
    gov:"Pengakuan pendapatan proyek (PSAK 115) rawan agresif."}},
  {n:"Konstruksi BUMN", v:[3,2,4,3,5,4,5], why:{
    usd:"Sebagian proyek & utang berdenominasi valas.",
    komod:"Eksposur tidak langsung via harga material.",
    regul:"Bergantung pada APBN & penugasan negara — kebijakan fiskal = nyawa.",
    relasi:"Rantai subkontraktor BUMN seinduk; piutang antar-BUMN menumpuk.",
    likuid:"Skor 5: piutang proyek macet + utang jatuh tempo = restrukturisasi berulang.",
    bunga:"Leverage ekstrem; kenaikan bunga mempercepat distress.",
    gov:"Skor 5: rekam jejak gagal bayar & restrukturisasi obligasi."}},
  {n:"Ritel", v:[2,1,2,3,3,3,3], why:{
    usd:"Impor barang dagang sebagian dolar, tapi cepat diteruskan ke harga.",
    komod:"Tidak relevan langsung.",
    regul:"Aturan perdagangan & impor relatif stabil.",
    relasi:"Jaringan toko waralaba/afiliasi pemilik cukup umum.",
    likuid:"Modal kerja besar (persediaan); sewa gerai menekan kas.",
    bunga:"Ekspansi gerai sering berutang; sensitif moderat.",
    gov:"Standar; isu utama di pengakuan pendapatan & sewa (PSAK 116)."}},
  {n:"Telco", v:[2,1,3,2,2,3,2], why:{
    usd:"Capex peralatan impor dolar, tapi skala & hedge memadai.",
    komod:"Tidak relevan.",
    regul:"Tarif, spektrum, dan kebijakan menara/5G memengaruhi capex.",
    relasi:"Struktur kepemilikan jelas; afiliasi terbatas.",
    likuid:"Arus kas subscription stabil & predictable.",
    bunga:"Capex 5G berutang; sensitivitas moderat.",
    gov:"Emiten telco besar umumnya transparan."}},
  {n:"Shipping", v:[5,3,2,3,3,3,3], why:{
    usd:"Skor 5: kapal dibeli dengan utang dolar; pendapatan dolar tapi tidak selalu seimbang.",
    komod:"Tarif angkut mengikuti siklus komoditas & perdagangan global.",
    regul:"Regulasi pelayaran relatif stabil; cabotage melindungi domestik.",
    relasi:"Perusahaan pelayaran keluarga; charter ke afiliasi ada.",
    likuid:"Siklus tarif ekstrem: boom-bust kas.",
    bunga:"Aset padat modal; pembiayaan kapal sensitif bunga.",
    gov:"Transparansi charter & umur armada perlu diverifikasi."}},
  {n:"Multifinance", v:[3,1,4,3,3,4,3], why:{
    usd:"Pendanaan valas via parent bank/asing; mismatch dikelola.",
    komod:"Tidak relevan langsung.",
    regul:"OJK multifinance: NPF, pembiayaan bermasalah, aturan DP kendaraan.",
    relasi:"Banyak anak usaha grup otomotif/bank — captive finance.",
    likuid:"Bergantung pada pasar obligasi & bank lines untuk pendanaan.",
    bunga:"Margin = spread bunga; kenaikan cost of fund menggerus laba.",
    gov:"Kualitas underwriting & kolektibilitas (PSAK 109/ECL) adalah kuncinya."}}
];

var LABEL = {1:"minimal", 2:"rendah", 3:"sedang", 4:"tinggi", 5:"kritis"};

function avg(v){ return v.reduce(function(a,b){return a+b;},0)/v.length; }

function render(){
  var h = "<tr><th>Sektor</th>" + DRIVERS.map(function(d){ return "<th>"+d.l+"</th>"; }).join("") + "</tr>";
  SECTORS.forEach(function(s){
    h += "<tr><td class=\"sector\">" + s.n +
         '<span class="sector-avg">rata-rata ' + avg(s.v).toFixed(1) + "</span></td>";
    s.v.forEach(function(val, i){
      var dk = DRIVERS[i].k;
      h += '<td class="r'+val+'" data-s="'+s.n+'" data-d="'+dk+'" title="'+s.n+" × "+DRIVERS[i].l+": "+val+"/5 ("+LABEL[val]+'). Klik untuk alasan.">'+val+"</td>";
    });
    h += "</tr>";
  });
  $("#heat").innerHTML = h;

  var lg = '<span style="border:none;font-family:var(--font-body);font-weight:600">Skala:</span> ';
  [1,2,3,4,5].forEach(function(v){
    lg += '<span class="r'+v+'">'+v+" · "+LABEL[v]+"</span>";
  });
  $("#legend").innerHTML = lg;

  Array.prototype.forEach.call(document.querySelectorAll("#heat td[data-s]"), function(td){
    td.style.cursor = "pointer";
    td.addEventListener("click", function(){
      var sec = SECTORS.filter(function(x){ return x.n === td.dataset.s; })[0];
      var di = DRIVERS.map(function(d){ return d.k; }).indexOf(td.dataset.d);
      var dl = DRIVERS[di].l;
      alert(sec.n + " × " + dl + " = " + sec.v[di] + "/5 (" + LABEL[sec.v[di]] + ")\n\n" +
            sec.why[td.dataset.d] + "\n\n— Penilaian analis, ilustratif, bukan data live.");
    });
  });
}

render();
})();
