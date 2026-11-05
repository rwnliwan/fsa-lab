/* FSA Lab — /kasus/ : render matriks, filter, progres, kalibrasi. */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function load(k){ try{ var v=JSON.parse(localStorage.getItem(k)); return v||null; }catch(e){ return null; } }
function save(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

var CASES = window.FSA_CASES || [];
var SOON = window.FSA_CASE_SOON || [];

/* ---------- status progres per case ---------- */
function caseStatus(c){
  var p = c.progress || {};
  try{
    if(p.kind==="s5" || p.kind==="exam"){
      var s5 = load(p.key);
      if(s5 && s5.revealed) return "selesai";
      var s1 = load(p.ns+"_s1") || load(p.ns+"_s0");
      if(s1) return "berjalan";
      return "belum";
    }
    if(p.kind==="cf"){
      var v = localStorage.getItem("fsa_cf_"+p.idx);
      return (v!==null && v!=="-1") ? "selesai" : "belum";
    }
    if(p.kind==="manual"){
      return localStorage.getItem(p.key)==="1" ? "selesai" : "belum";
    }
  }catch(e){}
  return "belum";
}
var ST_TXT = {belum:"Belum dimulai", berjalan:"Berjalan", selesai:"Selesai"};

/* ---------- filter ---------- */
var F = {sektor:"semua", tipe:"semua", level:"semua", peran:"semua", status:"semua"};
var FDEFS = [
 {k:"sektor", label:"Sektor", opts:["semua","bank","healthcare","transportasi","penerbangan","energi","fintech","asuransi","pembiayaan","konsumer"]},
 {k:"tipe", label:"Tipe", opts:["semua","guided","blind","fraud"]},
 {k:"level", label:"Level", opts:["semua","mudah","mudah–menengah","menengah","menengah–sulit","sulit"]},
 {k:"peran", label:"Peran", opts:["semua","latihan","ujian"]},
 {k:"status", label:"Status", opts:["semua","belum","berjalan","selesai"]}
];
function matchLevel(c, f){
  if(f==="semua") return true;
  var cal = window.FSA_caseCalib(c.slug);
  var lv = (cal && cal.level) ? cal.level : c.level_estimasi;
  return lv===f;
}
function visible(c){
  if(F.sektor!=="semua" && c.sektor!==F.sektor) return false;
  if(F.tipe!=="semua" && c.tipe!==F.tipe) return false;
  if(F.peran!=="semua" && c.peran!==F.peran) return false;
  if(F.status!=="semua" && caseStatus(c)!==F.status) return false;
  return matchLevel(c, F.level);
}
function renderFilters(){
  $("#filters").innerHTML = FDEFS.map(function(g){
    return "<div class='fgroup'><span class='flab'>"+g.label+"</span>"+
      g.opts.map(function(o){
        return "<button class='fchip"+(F[g.k]===o?" on":"")+"' data-g='"+g.k+"' data-v='"+esc(o)+"'>"+esc(o)+"</button>";
      }).join("")+"</div>";
  }).join("");
  Array.prototype.forEach.call(document.querySelectorAll(".fchip"), function(b){
    b.addEventListener("click", function(){
      F[b.getAttribute("data-g")] = b.getAttribute("data-v");
      renderFilters(); renderGrid();
    });
  });
}

/* ---------- kartu case ---------- */
function levelTag(c){
  var L = window.FSA_caseLevelLabel(c);
  return "<span class='tag "+(L.calib?"lvl-cal":"lvl-est")+"'>"+esc(L.txt)+(L.calib?" · terkalibrasi":" · estimasi")+"</span>";
}
function calibWidget(c){
  var cal = window.FSA_caseCalib(c.slug);
  var st = caseStatus(c);
  if(st==="belum") return "";
  var inner;
  if(cal && cal.level){
    inner = "Penilaianmu: <strong>"+esc(cal.level)+"</strong> "+
      "<button class='cbtn' data-cal='"+c.slug+"' data-v=''>ubah</button>";
  } else {
    inner = "Seberapa sulit case ini menurutmu? "+
      ["Mudah","Menengah","Sulit"].map(function(l){
        return "<button class='cbtn' data-cal='"+c.slug+"' data-v='"+l+"'>"+l+"</button>";
      }).join("");
  }
  return "<div class='calib'>"+inner+"</div>";
}
function cardHTML(c){
  var st = caseStatus(c);
  var pra = (c.prasyarat||[]).length ? "<span class='tag lvl-est'>prasyarat: "+esc(c.prasyarat.join(", "))+"</span>" : "";
  var imp = c.impostor_armed ? "<span class='tag imp'>🕵️ impostor-capable</span>" : "";
  var bench = c.benchmark==="terverifikasi"
    ? "<span class='tag lvl-cal'>benchmark terverifikasi</span>"
    : "<span class='tag lvl-est'>fakta publik · angka disederhanakan</span>";
  return "<article class='ccard' data-slug='"+c.slug+"'>"+
    "<h3>"+esc(c.title)+"</h3>"+
    "<div class='meta'>"+
      "<span class='tag'>"+esc(c.sektor)+(c.subsektor?" · "+esc(c.subsektor):"")+"</span>"+
      "<span class='tag tipe-"+c.tipe+"'>"+esc(c.tipe)+"</span>"+
      "<span class='tag peran-"+c.peran+"'>"+esc(c.peran)+"</span>"+
      levelTag(c)+
      "<span class='tag st-"+st+"'>"+ST_TXT[st]+"</span>"+
      imp+
    "</div>"+
    "<p class='desc'>"+esc(c.desc)+"</p>"+
    "<div class='prow'><span>"+pra+" "+bench+"</span>"+
    "<a class='btn btn-primary' style='font-size:.82rem;padding:.35rem .9rem' href='"+c.route+"'>Buka →</a></div>"+
    calibWidget(c)+
  "</article>";
}
function renderGrid(){
  var list = CASES.filter(visible);
  $("#case-count").textContent = "("+list.length+"/"+CASES.length+")";
  $("#casegrid").innerHTML = list.map(cardHTML).join("") ||
    "<p>Tak ada case yang cocok dengan filter ini.</p>";
  $("#soongrid").innerHTML = SOON.map(function(s){
    return "<article class='ccard soon'><h3>"+esc(s.prio)+" · "+esc(s.title)+"</h3>"+
      "<p class='desc'>"+esc(s.desc)+"</p>"+
      "<div class='prow'><span class='tag st-belum'>🔒 Segera hadir</span></div></article>";
  }).join("");
  Array.prototype.forEach.call(document.querySelectorAll("[data-cal]"), function(b){
    b.addEventListener("click", function(){
      var slug = b.getAttribute("data-cal"), v = b.getAttribute("data-v");
      if(v) save("fsa_case_calib_"+slug, {level:v, ts:Date.now()});
      else localStorage.removeItem("fsa_case_calib_"+slug);
      renderGrid();
    });
  });
}

/* ---------- matriks sektor × tipe ---------- */
function renderMatrix(){
  var sektors = [], tipes = ["guided","blind","fraud"];
  CASES.forEach(function(c){ if(sektors.indexOf(c.sektor)<0) sektors.push(c.sektor); });
  var h = "<thead><tr><th>Sektor</th>"+tipes.map(function(t){return "<th>"+t+"</th>";}).join("")+"</tr></thead><tbody>";
  sektors.forEach(function(s){
    h += "<tr><td><strong>"+esc(s)+"</strong></td>";
    tipes.forEach(function(t){
      var items = CASES.filter(function(c){return c.sektor===s && c.tipe===t;});
      h += "<td>"+(items.length
        ? items.map(function(c){
            return "<span class='mitem'>"+esc(c.title)+
              (c.impostor_armed?" 🕵️":"")+
              (c.peran==="ujian"?" (ujian)":"")+"</span>";
          }).join("")
        : "<span style='color:var(--ink-soft)'>—</span>")+"</td>";
    });
    h += "</tr>";
  });
  $("#matrix").innerHTML = h+"</tbody>";
}

document.addEventListener("DOMContentLoaded", function(){
  renderFilters();
  renderMatrix();
  renderGrid();
});
})();
