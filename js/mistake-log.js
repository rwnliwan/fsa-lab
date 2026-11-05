/* FSA Lab — mistake log (F4, Builder D).
   Client-side murni: setiap jawaban quiz/review yang SALAH dicatat ke
   localStorage "fsa_mistakes" (pola sama seperti fsa_gate_*).
   Format entri: {m: <no modul>, q: <id soal>, t: <timestamp ms>, k: "quiz"|"review"}.
   Kapasitas 500 entri (yang terlama dibuang). Tanpa backend.
*/
(function(){
"use strict";

var KEY = "fsa_mistakes";
var CAP = 500;

function load(){
  try{
    var v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  }catch(e){ return []; }
}
function save(list){
  try{ localStorage.setItem(KEY, JSON.stringify(list)); }catch(e){}
}

/* Judul modul + playground paling relevan (untuk panel "Topik Lemah"). */
var MODUL = {
  1:{t:"Tiga Laporan, Satu Cerita", pg:["explorer/","Statement Explorer"]},
  2:{t:"Kualitas Laba & Arus Kas", pg:["ratio-lab/","Ratio Lab"]},
  3:{t:"Margin, Return & Common-Size", pg:["ratio-lab/","Ratio Lab"]},
  4:{t:"Modal Kerja & Cash Conversion Cycle", pg:["ratio-lab/","Ratio Lab"]},
  5:{t:"Likuiditas & Solvabilitas", pg:["ratio-lab/","Ratio Lab"]},
  6:{t:"Free Cash Flow", pg:["workbench/","Workbench"]},
  7:{t:"Membaca Catatan & Opini Audit", pg:["explorer/","Statement Explorer"]},
  8:{t:"DuPont & Bedah Segmen", pg:["ratio-lab/","Ratio Lab"]},
  9:{t:"Kualitas Pendapatan & EPS", pg:["case-files/","Case Files"]},
  10:{t:"Arus Kas: Investasi & Pendanaan", pg:["workbench/","Workbench"]},
  11:{t:"Bedah Modal Kerja: Piutang & Persediaan", pg:["ratio-lab/","Ratio Lab"]},
  12:{t:"Aset Tetap, Impairment & Sewa", pg:["case-files/","Case Files"]},
  13:{t:"Deteksi Fraud: Triangle & Beneish", pg:["spot-fraud/","Spot the Fraud"]},
  14:{t:"PSAK vs US GAAP", pg:["toggle/","Toggle PSAK/GAAP"]},
  15:{t:"Model Kredit: Altman Z-Score", pg:["memo-kredit/","Credit Memo Builder"]},
  16:{t:"Instrumen Keuangan & ECL 3 Stage", pg:["case-files/","Case Files"]},
  17:{t:"Forensik Lanjutan", pg:["simulator/","Cooked Books Simulator"]},
  18:{t:"Forecasting & Valuasi", pg:["workbench/","Workbench"]},
  19:{t:"Dari Mana Dapat Laporannya?", pg:["explorer/","Statement Explorer"]},
  20:{t:"Aset Tak Berwujud & Goodwill", pg:["case-files/","Case Files"]},
  21:{t:"Aturan Main & Provisi", pg:["case-files/","Case Files"]},
  22:{t:"Pihak Berelasi & Tunneling", pg:["spot-fraud/","Spot the Fraud"]},
  23:{t:"Covenant & Perjanjian Kredit", pg:["memo-kredit/","Credit Memo Builder"]},
  24:{t:"Multiples", pg:["komparator/","Komparator"]},
  25:{t:"Skor Forensik Lanjutan", pg:["simulator/","Cooked Books Simulator"]},
  26:{t:"Akuntansi Syariah", pg:["glosarium/","Glosarium"]},
  27:{t:"ESOP & ESG", pg:["case-files/","Case Files"]},
  28:{t:"Forensik Dokumen", pg:["spot-fraud/","Spot the Fraud"]},
  29:{t:"Hedge Accounting", pg:["case-files/","Case Files"]},
  30:{t:"Analisis Bank Deep-Dive", pg:["ratio-lab/","Ratio Lab"]},
  31:{t:"3-Statement Modeling", pg:["workbench/","Workbench"]},
  32:{t:"SAK EP/EMKM & Pajak Deep-Dive", pg:["konverter/","Konverter PSAK"]},
  33:{t:"Credit Deep-Dive", pg:["memo-kredit/","Credit Memo Builder"]},
  34:{t:"Revenue Recognition", pg:["spot-fraud/","Spot the Fraud"]},
  35:{t:"Konsolidasi & NCI", pg:["case-files/","Case Files"]},
  36:{t:"Stock-Based Compensation & EPS", pg:["case-files/","Case Files"]},
  37:{t:"Inventory & Long-Lived Asset Methods", pg:["case-files/","Case Files"]}
};

window.FSAMistake = {
  MODUL: MODUL,
  /* Catat satu kesalahan. m = no modul, qid = id soal, kind = "quiz"|"review". */
  log: function(m, qid, kind){
    if(!m) return;
    var list = load();
    list.push({m:+m, q:String(qid), t:Date.now(), k:kind || "quiz"});
    while(list.length > CAP) list.shift();
    save(list);
  },
  all: load,
  clear: function(){ save([]); },
  /* Agregasi per modul, urut kesalahan terbanyak. [{m, n, last}] */
  byModule: function(){
    var agg = {};
    load().forEach(function(e){
      var k = "m" + e.m;
      if(!agg[k]) agg[k] = {m:e.m, n:0, last:0};
      agg[k].n++;
      if(e.t > agg[k].last) agg[k].last = e.t;
    });
    return Object.keys(agg).map(function(k){ return agg[k]; })
      .sort(function(a, b){ return (b.n - a.n) || (b.last - a.last); });
  }
};
})();
