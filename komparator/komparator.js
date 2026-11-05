/* FSA Lab — Komparator Multiples. 2-3 perusahaan FIKTIF, angka ILUSTRATIF (Rp juta).
   Default baris 1 = PT Cemerlang, angka kanonis M24: P/E 12,4x, EV/EBITDA 7,3x, P/B 3,1x. */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };

// harga (Rp), saham (juta lbr), utang, kas, NI, EBITDA, ekuitas (Rp juta)
var CEMERLANG = {nama:"PT Cemerlang (fiktif)", harga:5600, saham:100, utang:201440, kas:21440,
                 ni:45240, ebitda:102000, ekuitas:179440, _leaseIncluded:true};  // F10: selaras kurikulum; N7: utang sudah termasuk sewa 60.000
var FIKSI = [
  {nama:"PT Maju Fiktif", harga:3200, saham:200, utang:500000, kas:60000,
   ni:80000, ebitda:220000, ekuitas:400000},
  {nama:"PT Suram Fiktif", harga:850, saham:500, utang:900000, kas:30000,
   ni:12000, ebitda:150000, ekuitas:350000}
];

var rows = [JSON.parse(JSON.stringify(CEMERLANG))];
var fixtIdx = 0;

function fmt0(n){ return isFinite(n) ? Math.round(n).toLocaleString("id-ID") : "—"; }
function fmtx(n){ return isFinite(n) ? n.toLocaleString("id-ID",{minimumFractionDigits:1,maximumFractionDigits:1})+"x" : "—"; }

function compute(r){
  var mc = r.harga * r.saham;
  var ev = mc + r.utang - r.kas;
  /* R6: batasi kas berlebih <= total kas; lease hanya bila belum termasuk utang */
  if($("#adj-cash").checked){
    var xc = Math.min(parseFloat($("#adj-cash-val").value) || 0, r.kas);
    ev += xc;
  }
  /* N7: lease hanya ditambah bila belum termasuk utang. Default Cemerlang 201.440 sudah termasuk sewa 60.000 -> toggle diabaikan */
  if($("#adj-lease").checked && !r._leaseIncluded){
    ev += (parseFloat($("#adj-lease-val").value) || 0);
  }
  return {mc:mc, ev:ev,
    pe: r.ni ? mc/r.ni : NaN,
    evebitda: r.ebitda ? ev/r.ebitda : NaN,
    pb: r.ekuitas ? mc/r.ekuitas : NaN};
}

function render(){
  var outs = rows.map(compute);
  // termurah per metrik = nilai terendah (disorot)
  function cheapest(key){
    var vals = outs.map(function(o){ return o[key]; }).filter(isFinite);
    if(!vals.length) return null;
    return Math.min.apply(null, vals);
  }
  var cPE = cheapest("pe"), cEV = cheapest("evebitda"), cPB = cheapest("pb");

  var FIELDS = [
    {k:"harga", l:"Harga saham (Rp)"}, {k:"saham", l:"Jumlah saham (jt lbr)"},
    {k:"utang", l:"Utang berbunga (Rp jt)"}, {k:"kas", l:"Kas (Rp jt)"},
    {k:"ni", l:"Laba bersih (Rp jt)"}, {k:"ebitda", l:"EBITDA (Rp jt)"},
    {k:"ekuitas", l:"Ekuitas buku (Rp jt)"}
  ];
  var h = "<tr><th>Perusahaan / pos</th>" + rows.map(function(r,i){
    return "<th>" + (i+1) + "</th>";
  }).join("") + "</tr>";

  h += "<tr><td>Nama</td>" + rows.map(function(r,i){
    return '<td><input class="nm" data-i="'+i+'" data-k="nama" value="'+r.nama.replace(/"/g,"&quot;")+'">' +
      (rows.length>1 ? ' <button class="btn btn-ghost del" data-i="'+i+'" style="padding:.15rem .5rem;font-size:.75rem">✕</button>' : "") + "</td>";
  }).join("") + "</tr>";

  FIELDS.forEach(function(f){
    h += "<tr><td>" + f.l + "</td>" + rows.map(function(r,i){
      return '<td><input data-i="'+i+'" data-k="'+f.k+'" type="number" value="'+r[f.k]+'"></td>';
    }).join("") + "</tr>";
  });

  var OUTS = [
    {k:"mc", l:"Kapitalisasi pasar (Rp jt)", f:fmt0, cheap:null},
    {k:"ev", l:"Enterprise Value (Rp jt)", f:fmt0, cheap:null},
    {k:"pe", l:"P/E", f:fmtx, cheap:cPE},
    {k:"evebitda", l:"EV/EBITDA", f:fmtx, cheap:cEV},
    {k:"pb", l:"P/B", f:fmtx, cheap:cPB}
  ];
  OUTS.forEach(function(o){
    h += '<tr class="out"><td>' + o.l + "</td>" + outs.map(function(c){
      var cls = (o.cheap !== null && c[o.k] === o.cheap) ? ' class="kmp-cheap"' : "";
      return "<td"+cls+">" + o.f(c[o.k]) + "</td>";
    }).join("") + "</tr>";
  });

  $("#kmp").innerHTML = h;
  Array.prototype.forEach.call(document.querySelectorAll("#kmp input"), function(inp){
    inp.addEventListener("input", function(){
      var i = +inp.dataset.i, k = inp.dataset.k;
      if(k === "nama") rows[i][k] = inp.value;
      else rows[i][k] = parseFloat(inp.value) || 0;
      /* F4-R14: angka utang yang diedit user tidak lagi mewarisi flag tersembunyi —
         toggle lease kini selalu dijumlahkan ke angka yang tampil */
      if(k === "utang") delete rows[i]._leaseIncluded;
      render();
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll("#kmp .del"), function(b){
    b.addEventListener("click", function(){
      rows.splice(+b.dataset.i, 1);
      render();
    });
  });
}

$("#add-row").addEventListener("click", function(){
  if(rows.length >= 3) return;
  rows.push(JSON.parse(JSON.stringify(FIKSI[fixtIdx % FIKSI.length])));
  fixtIdx++;
  render();
});
$("#reset-rows").addEventListener("click", function(){
  rows = [JSON.parse(JSON.stringify(CEMERLANG))];
  fixtIdx = 0;
  render();
});
["adj-cash","adj-cash-val","adj-lease","adj-lease-val"].forEach(function(id){
  document.getElementById(id).addEventListener("input", render);
});

render();
})();
