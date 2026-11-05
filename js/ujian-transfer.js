/* FSA Lab — Ujian Transfer (UNVR FY2024).
   Pola: ujian BBCA (briefing + gate + 5 langkah + rubrik + reveal lock + timer pasif).
   Namespace localStorage: fsa_transfer_*.
   Prasyarat: lulus ujian BBCA (fsa_exam_bbca_s6.pass === true).
   Benchmark window.UNVR_BENCH dimuat DINAMIS hanya saat reveal (isolasi blind-first). */
(function(){
"use strict";
function $(s){ return document.querySelector(s); }
function $all(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); }
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
/* parseIDNumber: "1.234.567" / "47,6" / "88.30" -> number */
function parseIDNumber(str, isDecimal){
  if(str==null) return NaN;
  var s=String(str).trim(); if(!s) return NaN;
  var neg=false;
  if(/^\s*\(.*\)\s*$/.test(s)){ neg=true; s=s.replace(/[()]/g,""); }
  s=s.replace(/\s/g,"");
  if(isDecimal){ s=s.replace(/\./g,"").replace(/,/g,"."); }
  else { s=s.replace(/\./g,""); var ci=s.indexOf(","); if(ci>=0) s=s.slice(0,ci); }
  var v=parseFloat(s); return neg?-v:v;
}
function fmtID(v, dec){
  if(v==null||isNaN(v)) return "—";
  return v.toLocaleString("id-ID",{minimumFractionDigits:dec||0,maximumFractionDigits:dec||0});
}
function load(k){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):null; }catch(e){ return null; } }
function save(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

var K0="fsa_transfer_s0",K1="fsa_transfer_s1",K2="fsa_transfer_s2",K3="fsa_transfer_s3",
    K4="fsa_transfer_s4",K5="fsa_transfer_s5",K6="fsa_transfer_s6",K7="fsa_transfer_s7",K8="fsa_transfer_s8";

/* 20 pos input: key, label, satuan default, isDecimal, isCount */
var VAL_KEYS=[
  {k:"sales",label:"Penjualan bersih",unit:"Rp jt"},
  {k:"cogs",label:"Beban pokok penjualan",unit:"Rp jt"},
  {k:"gross",label:"Laba bruto",unit:"Rp jt"},
  {k:"ebitda",label:"EBITDA",unit:"Rp jt"},
  {k:"net_profit",label:"Laba bersih",unit:"Rp jt"},
  {k:"eps",label:"EPS dasar",unit:"Rp",dec:1},
  {k:"cash",label:"Kas dan setara kas",unit:"Rp jt"},
  {k:"recv",label:"Piutang usaha (total)",unit:"Rp jt"},
  {k:"inv",label:"Persediaan",unit:"Rp jt"},
  {k:"ca",label:"Jumlah aset lancar",unit:"Rp jt"},
  {k:"assets",label:"JUMLAH ASET",unit:"Rp jt"},
  {k:"bankloan",label:"Pinjaman bank",unit:"Rp jt"},
  {k:"payables",label:"Utang usaha (total)",unit:"Rp jt"},
  {k:"cl",label:"Jumlah liabilitas jangka pendek",unit:"Rp jt"},
  {k:"liab",label:"JUMLAH LIABILITAS",unit:"Rp jt"},
  {k:"equity",label:"JUMLAH EKUITAS",unit:"Rp jt"},
  {k:"shares",label:"Saham beredar",unit:"lembar",count:1},
  {k:"cfo",label:"Kas dari operasi",unit:"Rp jt"},
  {k:"capex",label:"Belanja modal",unit:"Rp jt"},
  {k:"div",label:"Dividen kas dibayar",unit:"Rp jt"}
];
var LENSES=[{k:"inv",t:"investasi"},{k:"cred",t:"kredit"},{k:"foren",t:"forensik"}];

var st0=load(K0),st1=load(K1),st2=load(K2),st3=load(K3),st4=load(K4),st5=load(K5),st6=load(K6),st7=load(K7),st8=load(K8);
var coached=!!(st0&&st0.coached);

/* ---------- prasyarat: lulus ujian BBCA ---------- */
function examPassed(){
  try{ var s=load("fsa_exam_bbca_s6"); return !!(s&&s.pass===true); }catch(e){ return false; }
}
function renderGate(){
  var g=$("#gate-exam"); if(!g) return;
  if(examPassed()){
    g.innerHTML="✅ <strong>Ujian BBCA: LULUS.</strong> Kamu boleh mengikuti ujian transfer.";
  }else{
    g.innerHTML="🔒 <strong>Ujian BBCA belum lulus.</strong> Ujian transfer hanya dibuka setelah kamu "+
      "<strong>LULUS</strong> <a href='/ujian/'><strong>Ujian Blind BBCA</strong></a> (rubrik K1–K5). "+
      "Selesaikan dulu — transfer mengukur skill yang sudah terbukti di sana.";
  }
}
function lensOK(txt){
  txt=String(txt||"");
  return txt.trim().length>=50 && /\d/.test(txt);
}

/* ---------- stepper ---------- */
var STEPS=[["s0","Briefing"],["s1","Baca"],["s2","20 angka"],["s3","Cek"],["s4","3 lensa"],["s5","Benchmark"],["s6","Rubrik"],["s7","Memo"]];
function renderStepper(){
  var el=$("#stepper"); if(!el) return;
  var done={s0:!!st0,s1:!!st1,s2:!!st2,s3:!!(st3&&st3.checks),s4:!!st4,s5:!!(st5&&st5.revealed),s6:!!(st6&&st6.computed),s7:!!st7};
  el.innerHTML=STEPS.map(function(s){
    var cls="step"+(done[s[0]]?" done":"");
    return "<span class='"+cls+"'>"+esc(s[1])+"</span>";
  }).join("");
}

/* ---------- timer pasif ---------- */
var t0=null,timerInt=null;
function startTimer(fromTs){
  t0=fromTs||Date.now();
  $("#timerline").style.display="block";
  function tick(){
    var m=Math.floor((Date.now()-t0)/60000);
    var h=Math.floor(m/60);
    $("#elapsed").textContent=(h?h+" jam ":"")+ (m%60)+" menit";
  }
  tick(); timerInt=setInterval(tick,30000);
}
function fmtDur(ms){
  var m=Math.round(ms/60000); return Math.floor(m/60)+" jam "+(m%60)+" menit";
}

/* ---------- S0 ---------- */
function initS0(){
  renderGate();
  if(coached){ $("#coachbanner").style.display="block"; }
  if(st0){
    $("#s0-ok").textContent="✓ briefing tersimpan ("+new Date(st0.ts).toLocaleString("id-ID")+")";
    $("#exam-body").style.display="block";
    renderStepper(); startTimer(st0.ts); initRest(); return;
  }
  var b=$("#start-exam"); if(!b) return;
  b.addEventListener("click",function(){
    if(!examPassed()){ alert("Prasyarat belum terpenuhi.\n\nLuluskan dulu Ujian Blind BBCA (rubrik K1–K5), lalu kembali ke sini."); return; }
    if(!$("#att-blind").checked||!$("#att-honest").checked){
      alert("Centang kedua atestasi dulu — kejujuran adalah bagian dari ujian."); return;
    }
    st0={ts:Date.now(),coached:false}; save(K0,st0);
    $("#s0-ok").textContent="✓ dimulai — selamat mengerjakan.";
    $("#exam-body").style.display="block";
    renderStepper(); startTimer(st0.ts); initRest();
    $("#exam-body").scrollIntoView({behavior:"smooth"});
  });
}

/* ---------- S1 ---------- */
function initS1(){
  if(st1){ $("#s1-audit").value=st1.audit||""; $("#s1-anom").value=st1.anom||""; $("#s1-read").checked=!!st1.read;
    $("#s1-ok").textContent="✓ tersimpan."; }
  var b=$("#s1-save"); if(!b) return;
  b.addEventListener("click",function(){
    if(!$("#s1-read").checked){ alert("Centang honor checkbox dulu."); return; }
    st1={audit:$("#s1-audit").value.trim(),anom:$("#s1-anom").value.trim(),read:true,ts:Date.now()};
    save(K1,st1); $("#s1-ok").textContent="✓ tersimpan."; renderStepper();
  });
}

/* ---------- S2: 20 angka ---------- */
function figRow(o, saved){
  var v=saved&&saved.vals?saved.vals[o.k]:null;
  return "<tr data-k='"+o.k+"'>"+
    "<td><strong>"+esc(o.label)+"</strong><br><span style='font-size:.75rem;color:var(--ink-soft)'>"+esc(o.unit)+"</span></td>"+
    "<td><input type='text' data-f='val' value='"+esc(v&&v.val!=null?v.val:"")+"' placeholder='"+(o.count?"12.000.000.000":"…")+"'></td>"+
    "<td style='text-align:center'><input type='checkbox' data-f='nd' "+(v&&v.nd?"checked":"")+"></td>"+
    "<td><input type='text' data-f='page' value='"+esc(v&&v.page?v.page:"")+"' placeholder='hlm./catatan'></td></tr>";
}
function initS2(){
  var tb=$("#fig-tbody"); if(!tb) return;
  tb.innerHTML=VAL_KEYS.map(function(o){ return figRow(o,st2); }).join("");
  if(st2) $("#s2-ok").textContent="✓ tersimpan ("+Object.keys(st2.vals||{}).length+"/20 baris).";
  var b=$("#s2-save"); if(!b) return;
  b.addEventListener("click",function(){
    var vals={};
    $all("#fig-tbody tr").forEach(function(tr){
      var k=tr.getAttribute("data-k");
      vals[k]={val:tr.querySelector("[data-f=val]").value.trim(),
               nd:tr.querySelector("[data-f=nd]").checked,
               page:tr.querySelector("[data-f=page]").value.trim()};
    });
    st2={vals:vals,ts:Date.now()}; save(K2,st2);
    $("#s2-ok").textContent="✓ tersimpan ("+Object.keys(vals).length+"/20 baris)."; renderStepper();
  });
}
function F(k){
  if(!st2||!st2.vals||!st2.vals[k]) return {nd:true};
  var e=st2.vals[k]; if(e.nd) return {nd:true};
  var meta=null; VAL_KEYS.forEach(function(o){ if(o.k===k) meta=o; });
  var v=parseIDNumber(e.val, !!(meta&&(meta.dec||meta.unit==="%")));
  return {nd:isNaN(v), jt:v, page:e.page||""};
}
function FR(id){
  var el=document.getElementById(id); if(!el) return {nd:true};
  var v=parseIDNumber(el.value,true); return {nd:isNaN(v), v:v};
}

/* ---------- S3: 8 cek ---------- */
var CHECKS=[
 {id:"M1",t:"Neraca balance",d:"aset = liabilitas + ekuitas"},
 {id:"M2",t:"Gross margin = 47,6%",d:"laba bruto ÷ penjualan (±0,5pp)"},
 {id:"M3",t:"Net profit margin",d:"laba bersih ÷ penjualan (±0,5pp)"},
 {id:"M4",t:"Current ratio",d:"aset lancar ÷ liabilitas jangka pendek (±0,05)"},
 {id:"M5",t:"D/E",d:"total liabilitas ÷ ekuitas (±0,2)"},
 {id:"M6",t:"Payout ratio",d:"dividen ÷ laba bersih — flag bila >100%"},
 {id:"M7",t:"CFO / laba bersih",d:"kas operasi ÷ laba bersih (±5pp)"},
 {id:"M8",t:"EPS tie-out",d:"laba bersih ÷ saham beredar ≈ EPS (±1)"}
];
function runChecks(){
  var B=window.UNVR_BENCH, out=[];
  function need(keys){ for(var i=0;i<keys.length;i++){ if(F(keys[i]).nd) return keys[i]; } return null; }
  function row(id,ok,det,hint){ out.push({id:id,st:ok?"LULUS":"GAGAL",det:det,hint:ok?"":hint}); }
  var miss;
  /* M1 */
  miss=need(["assets","liab","equity"]);
  if(miss) row("M1",false,"butuh "+miss+" (ND/kosong).","Isi dulu barisnya di langkah 2.");
  else{ var d=Math.abs(F("assets").jt-(F("liab").jt+F("equity").jt));
    row("M1",d<=Math.max(0.005*F("assets").jt,1000),"selisih "+fmtID(d)+" jt.","Neraca harus balance: aset = liabilitas + ekuitas."); }
  /* M2 */
  miss=need(["gross","sales"]);
  if(miss) row("M2",false,"butuh "+miss+".","");
  else{ var gm=F("gross").jt/F("sales").jt*100;
    row("M2",Math.abs(gm-47.6)<=0.5,"GM hitunganmu "+gm.toFixed(1)+"% vs 47,6%.","GM = laba bruto ÷ penjualan. Siaran pers: 47,6%."); }
  /* M3 */
  miss=need(["net_profit","sales"]);
  if(miss) row("M3",false,"butuh "+miss+".","");
  else{ var npm=F("net_profit").jt/F("sales").jt*100, exp=B?B.ratios.npm.v:9.6;
    row("M3",Math.abs(npm-exp)<=0.5,"NPM hitunganmu "+npm.toFixed(1)+"% vs "+exp+"%.","NPM = laba bersih ÷ penjualan."); }
  /* M4 */
  (function(){ var r=FR("r-cr"); miss=need(["ca","cl"]);
    if(miss||r.nd){ row("M4",false,"butuh ca, cl + rasio CR diketik.","Ketik CR hitunganmu di kolom rasio."); return; }
    var cr=F("ca").jt/F("cl").jt, exp=B?B.ratios.cr.v:0.45;
    row("M4",Math.abs(cr-exp)<=0.05&&Math.abs(r.v-exp)<=0.05,
      "CR = "+cr.toFixed(2)+"x (kamu ketik "+r.v+")."+(cr<1?" ⚠️ di bawah 1 — catat untuk lensa kredit.":""),
      "CR = aset lancar ÷ liabilitas jangka pendek."); })();
  /* M5 */
  (function(){ var r=FR("r-de"); miss=need(["liab","equity"]);
    if(miss||r.nd){ row("M5",false,"butuh liab, equity + rasio D/E diketik.","Ketik D/E hitunganmu."); return; }
    var de=F("liab").jt/F("equity").jt, exp=B?B.ratios.de.v:6.47;
    row("M5",Math.abs(de-exp)<=0.2&&Math.abs(r.v-exp)<=0.2,
      "D/E = "+de.toFixed(2)+"x (kamu ketik "+r.v+")."+(de>3?" ⚠️ sangat tinggi — catat untuk lensa.":""),
      "D/E = total liabilitas ÷ ekuitas."); })();
  /* M6 */
  miss=need(["div","net_profit"]);
  if(miss) row("M6",false,"butuh div, net_profit.","");
  else{ var po=F("div").jt/F("net_profit").jt*100;
    row("M6",po>100,"payout "+po.toFixed(1)+"% — "+(po>100?"⚠️ DIVIDEN > LABA. Ini temuan, bukan error. Bawa ke lensa forensik.":"di bawah 100%."),
      "Payout = dividen ÷ laba bersih."); }
  /* M7 */
  (function(){ var r=FR("r-cfocov"); miss=need(["cfo","net_profit"]);
    if(miss||r.nd){ row("M7",false,"butuh cfo, net_profit + rasio diketik.","Ketik CFO/laba hitunganmu."); return; }
    var cv=F("cfo").jt/F("net_profit").jt*100, exp=B?B.ratios.cfo_cov.v:118.7;
    row("M7",Math.abs(cv-exp)<=5&&Math.abs(r.v-exp)<=5,"CFO/laba = "+cv.toFixed(1)+"% (kamu ketik "+r.v+").","CFO ÷ laba bersih: >100% = konversi kas sehat."); })();
  /* M8 */
  miss=need(["net_profit","shares","eps"]);
  if(miss) row("M8",false,"butuh net_profit, shares, eps.","");
  else{ var tie=F("net_profit").jt*1e6/F("shares").jt;
    row("M8",Math.abs(tie-F("eps").jt)<=1,"tie-out "+tie.toFixed(1)+" vs EPS input "+F("eps").jt+".","EPS = laba bersih (Rp) ÷ saham beredar."); }
  /* GM/NPM typed */
  var rgm=FR("r-gm"), rnpm=FR("r-npm"), rp=FR("r-payout");
  if(!rgm.nd&&Math.abs(rgm.v-47.6)>0.5) out.push({id:"R-GM",st:"GAGAL",det:"GM ketikan "+rgm.v+" vs 47,6.",hint:""});
  if(!rnpm.nd&&Math.abs(rnpm.v-9.6)>0.5) out.push({id:"R-NPM",st:"GAGAL",det:"NPM ketikan "+rnpm.v+" vs 9,6.",hint:""});
  if(!rp.nd&&Math.abs(rp.v-99.7)>2) out.push({id:"R-PO",st:"GAGAL",det:"Payout ketikan "+rp.v+" vs 99,7.",hint:""});
  return out;
}
function initS3(){
  ["r-gm","r-npm","r-cr","r-de","r-payout","r-cfocov"].forEach(function(id){
    if(st3&&st3.ratios&&st3.ratios[id]!=null){ var el=document.getElementById(id); if(el) el.value=st3.ratios[id]; }
  });
  if(st3&&st3.checks){ paintChecks(st3.checks); $("#s3-ok").textContent="✓ cek tersimpan."; }
  var b=$("#s3-run"); if(!b) return;
  b.addEventListener("click",function(){
    var ratios={}; ["r-gm","r-npm","r-cr","r-de","r-payout","r-cfocov"].forEach(function(id){
      var el=document.getElementById(id); ratios[id]=el?el.value.trim():""; });
    var checks=runChecks();
    st3={ratios:ratios,checks:checks,ts:Date.now()}; save(K3,st3);
    paintChecks(checks); $("#s3-ok").textContent="✓ "+checks.filter(function(c){return c.st==="LULUS";}).length+"/"+checks.length+" lulus.";
    renderStepper();
  });
}
function paintChecks(checks){
  var box=$("#check-results"); if(!box) return;
  box.innerHTML=checks.map(function(c){
    var badge=c.st==="LULUS"?"<span class='ck ok'>LULUS</span>":"<span class='ck bad'>GAGAL</span>";
    var meta=null; CHECKS.forEach(function(m){ if(m.id===c.id) meta=m; });
    var t=meta?meta.t:c.id, d=meta?meta.d:"";
    return "<div class='ck-row'>"+badge+"<div><strong>"+esc(t)+"</strong><br><span class='ck-det'>"+esc(c.det)+"</span>"+
      (c.hint?"<br><span class='ck-hint'>💡 "+esc(c.hint)+"</span>":"")+"</div></div>";
  }).join("");
}
function checkSt(id){
  if(!st3||!st3.checks) return null;
  for(var i=0;i<st3.checks.length;i++) if(st3.checks[i].id===id) return st3.checks[i].st;
  return null;
}

/* ---------- S4: 3 lensa ---------- */
function initS4(){
  if(st4&&st4.lenses){ LENSES.forEach(function(L){ var el=$("#lens-"+L.k); if(el) el.value=st4.lenses[L.k]||""; }); }
  if(st4){ if($("#vonis")) $("#vonis").value=st4.vonis||""; if($("#thesis-chk")) $("#thesis-chk").checked=!!st4.thesis; }
  if(st5&&st5.revealed){
    ["lens-inv","lens-cred","lens-foren","vonis"].forEach(function(id){ var el=document.getElementById(id); if(el) el.disabled=true; });
    var tc=$("#thesis-chk"); if(tc) tc.disabled=true;
    var sv=$("#s4-save"); if(sv) sv.disabled=true;
    $("#s4-locknote").style.display="block";
    $("#s4-ok").textContent="🔒 terkunci (benchmark dibuka).";
  }
  LENSES.forEach(function(L){
    var el=$("#lens-"+L.k); if(!el) return;
    function upd(){
      var ok=lensOK(el.value), n=el.value.trim().length;
      var c=$("#cnt-"+L.k); if(c){ c.textContent=n+" karakter"+(ok?" ✓ (≥50 + ada angka)":" — butuh ≥50 karakter + 1 angka"); c.className="cnt"+(ok?" ok":""); }
    }
    el.addEventListener("input",upd); upd();
  });
  var b=$("#s4-save"); if(!b) return;
  b.addEventListener("click",function(){
    var lenses={}; LENSES.forEach(function(L){ lenses[L.k]=$("#lens-"+L.k).value; });
    var bad=LENSES.filter(function(L){ return !lensOK(lenses[L.k]); });
    if(bad.length){ alert("Lensa belum memenuhi syarat (min. 50 karakter + 1 angka): "+bad.map(function(L){return L.t;}).join(", ")); return; }
    if(!$("#thesis-chk").checked){ alert("Centang thesis-testing dulu."); return; }
    var vonis=$("#vonis").value.trim();
    if(vonis.length<10){ alert("Vonis 1 kalimat minimal 10 karakter."); return; }
    st4={lenses:lenses,vonis:vonis,thesis:true,ts:Date.now()}; save(K4,st4);
    $("#s4-ok").textContent="✓ tersimpan."; renderStepper();
  });
}

/* ---------- S5: reveal ---------- */
function loadBench(cb){
  if(window.UNVR_BENCH){ cb(); return; }
  var s=document.createElement("script");
  s.src="data/unvr-benchmark.js";
  s.onload=function(){ cb(); }; s.onerror=function(){ alert("Gagal memuat benchmark."); };
  document.head.appendChild(s);
}
function initS5(){
  if(st5&&st5.revealed){ showReveal(); return; }
  var b=$("#reveal-btn"); if(!b) return;
  b.addEventListener("click",function(){
    if(!st4){ alert("Selesaikan langkah 4 dulu — reveal mengunci jawaban lensamu."); return; }
    if(!confirm("Buka benchmark? Jawaban langkah 1–4 akan TERKUNCI permanen (mode blind).")) return;
    loadBench(function(){
      st5={revealed:true,ts:Date.now()}; save(K5,st5);
      showReveal(); renderStepper(); initS4();
    });
  });
}
function showReveal(){
  $("#l5-gate").style.display="none"; $("#l5-content").style.display="block";
  var B=window.UNVR_BENCH; if(!B) return;
  /* divergensi */
  var rows=VAL_KEYS.map(function(o){
    var f=F(o.k), b=B.rows[o.k], bv=b?b.v:null;
    var inp=f.nd?"<em>ND</em>":esc(o.count?fmtID(f.jt):fmtID(f.jt));
    var ben=b?(o.count||b.isCount?fmtID(bv):(b.isRatio?bv:fmtID(bv)))+(b.tag?" ["+b.tag+"]":""):"—";
    var st="-",cls="";
    if(!f.nd&&bv!=null&&!b.isRatio&&!b.isCount){
      var tol=Math.max(0.01*Math.abs(bv),1000000);
      var ok=Math.abs(f.jt-bv)<=tol;
      st=ok?"✓":"✗"; cls=ok?"":"diverge";
      var pct=((f.jt-bv)/bv*100);
      st+=" "+(pct>=0?"+":"")+pct.toFixed(1)+"%";
    }
    return "<tr class='"+cls+"'><td>"+esc(o.label)+"</td><td class='mono'>"+inp+"</td><td class='mono'>"+ben+"</td><td class='mono'>"+st+"</td><td style='font-size:.75rem'>"+esc(b?b.note:"")+"</td></tr>";
  }).join("");
  $("#div-table").innerHTML=rows;
  /* rasio */
  var rt=Object.keys(B.ratios).map(function(k){
    var r=B.ratios[k];
    return "<tr><td>"+esc(r.label)+"</td><td class='mono'><strong>"+r.v+" "+r.unit+"</strong> ["+r.tag+"]</td><td style='font-size:.78rem'>"+esc(r.note)+"</td></tr>";
  }).join("");
  $("#ratio-table").innerHTML=rt;
  /* bacaan analis */
  $("#analyst").innerHTML="<h4>Bacaan analis — 3 lensa (satu interpretasi, bukan jawaban benar)</h4>"+
    B.analyst.map(function(a){
      return "<div class='lens'><h3>"+esc(a.lens)+"</h3><p style='font-size:.9rem'>"+esc(a.text)+"</p></div>";
    }).join("");
  var gb=$("#goto-rubrik"); if(gb) gb.addEventListener("click",function(){
    $("#rubrik-sec").scrollIntoView({behavior:"smooth"});
  });
}

/* ---------- S6: rubrik T1–T3 ---------- */
var REMEDIAL={T1:"Bedah Sendiri KLBF (disiplin baca & input)",T2:"Bedah Filing SOCI (pola thesis testing)",T3:"Bedah Sendiri (disiplin sumber) + tulis ulang memo sebagai pertanyaan"};
function computeRubric(){
  var B=window.UNVR_BENCH;
  if(!B){ alert("Benchmark belum dimuat — buka langkah 5 dulu."); return null; }
  var det={};
  /* T1: 6 angka kunci */
  var keys=[["sales","Penjualan bersih"],["net_profit","Laba bersih"],["assets","Total aset"],["liab","Total liabilitas"],["equity","Total ekuitas"],["cfo","Kas dari operasi"]];
  var bad=[];
  keys.forEach(function(p){
    var f=F(p[0]), bv=B.rows[p[0]].v;
    if(f.nd){ bad.push(p[1]+" (tidak diinput)"); return; }
    if(Math.abs(f.jt-bv)>Math.max(0.01*Math.abs(bv),1000000)) bad.push(p[1]);
  });
  det.T1={pass:bad.length===0,detail:bad.length?"Meleset: "+bad.join(", "):"6/6 angka kunci dalam toleransi (±1% / ±Rp1 M)."};
  /* T2: lensa */
  var t2=LENSES.every(function(L){ return lensOK(st4.lenses[L.k]); })&&String(st4.vonis||"").trim().length>=10&&!!st4.thesis;
  det.T2={pass:t2,detail:t2?"3 lensa ≥50 char + angka ✓, thesis testing ✓, vonis ✓.":"Lengkapi lensa + checkbox + vonis di langkah 4."};
  /* T3: memo + sumber */
  var memo=st7&&st7.memo?String(st7.memo):"";
  var hasQ=memo.indexOf("?")>=0;
  var nums=(memo.match(/\d[\d.,]*/g)||[]).length;
  var withPage=VAL_KEYS.filter(function(o){ var f=F(o.k); return !f.nd&&f.page!==""; }).length;
  var srcPct=Math.round(withPage/VAL_KEYS.length*100);
  var chk=st7&&st7.q&&st7.num&&st7.honest;
  var t3bad=[];
  if(!hasQ) t3bad.push("memo tanpa tanda tanya");
  if(nums<2) t3bad.push("memo mengutip <2 angka");
  if(srcPct<80) t3bad.push("disiplin sumber "+srcPct+"% (<80%)");
  if(!chk) t3bad.push("checklist nilai-sendiri memo belum lengkap");
  det.T3={pass:t3bad.length===0,detail:t3bad.length?"Gagal: "+t3bad.join("; ")+".":"Red flag sebagai pertanyaan ✓, ≥2 angka ✓, disiplin sumber "+srcPct+"% ✓."};
  var pass=["T1","T2","T3"].every(function(k){return det[k].pass;});
  return {det:det,pass:pass};
}
function initRubrik(){
  var b=$("#rubrik-run"); if(!b) return;
  b.addEventListener("click",function(){
    if(!(st5&&st5.revealed)){ alert("Buka benchmark (langkah 5) dulu."); return; }
    var r=computeRubric(); if(!r) return;
    st6={computed:true,pass:r.pass,detail:{T1:r.det.T1.pass,T2:r.det.T2.pass,T3:r.det.T3.pass},ts:Date.now()};
    save(K6,st6);
    var nm={T1:"T1 — 6/6 angka kunci dalam toleransi",T2:"T2 — Disiplin thesis per lensa (self-attested)",T3:"T3 — Red flag + disiplin sumber (self-attested)"};
    $("#rubrik-list").innerHTML=["T1","T2","T3"].map(function(k){
      var d=r.det[k];
      var badge=d.pass?"<span class='ck ok'>LULUS</span>":"<span class='ck bad'>BELUM</span>";
      var rem=d.pass?"":"<br><span class='ck-hint'>🎯 Remedial: "+esc(REMEDIAL[k])+"</span>";
      return "<div class='rubk'>"+badge+" <h4 style='display:inline'>"+nm[k]+"</h4><br><span class='ck-det'>"+esc(d.detail)+"</span>"+rem+"</div>";
    }).join("");
    var vp=$("#verdict-panel"); vp.style.display="block";
    vp.className="verdict "+(r.pass?"pass":"fail");
    $("#verdict-mode").textContent=coached?"Mode: COACHED (latihan berlabel)":"Mode: BLIND";
    $("#verdict-text").textContent=r.pass?"LULUS ✓ — sinyal belajar mandiri (bukan sertifikasi)":"BELUM LULUS — remedial dulu";
    $("#verdict-remedial").textContent=r.pass?
      "Angka dan disiplinmu lolos di emiten baru. Bukti transfer menguat lewat jam terbang — lanjutkan ke case berikutnya.":
      "Gagal: "+["T1","T2","T3"].filter(function(k){return !r.det[k].pass;}).map(function(k){return k+" → "+REMEDIAL[k];}).join("; ");
    $("#rubrik-ok").textContent="✓ rubrik dihitung.";
    renderStepper();
  });
  if(st6&&st6.computed){ /* biarkan user hitung ulang bila mau */ }
}

/* ---------- S7: memo ---------- */
function initMemo(){
  if(st7){ $("#memo").value=st7.memo||"";
    $("#memo-q").checked=!!st7.q; $("#memo-num").checked=!!st7.num; $("#memo-honest").checked=!!st7.honest;
    $("#memo-ok").textContent="✓ tersimpan."; }
  var m=$("#memo"); if(!m) return;
  function upd(){
    var t=m.value, n=t.trim().length, q=t.indexOf("?")>=0, nums=(t.match(/\d[\d.,]*/g)||[]).length;
    var c=$("#cnt-memo");
    c.textContent=n+" karakter · "+(q?"ada '?' ✓":"belum ada '?'")+" · "+nums+" angka dikutip";
    c.className="cnt"+(q&&nums>=2?" ok":"");
  }
  m.addEventListener("input",upd); upd();
  $("#memo-save").addEventListener("click",function(){
    if(m.value.trim().length<50){ alert("Memo minimal 50 karakter."); return; }
    st7={memo:m.value,q:$("#memo-q").checked,num:$("#memo-num").checked,honest:$("#memo-honest").checked,ts:Date.now()};
    save(K7,st7); $("#memo-ok").textContent="✓ tersimpan."; renderStepper();
  });
}

/* ---------- S8: refleksi + salin + reset ---------- */
function initS8(){
  if(st8){ $("#rf-a").value=st8.a||""; $("#rf-b").value=st8.b||""; $("#s8-ok").textContent="✓ tersimpan."; }
  var b=$("#s8-save"); if(b) b.addEventListener("click",function(){
    st8={a:$("#rf-a").value,b:$("#rf-b").value,ts:Date.now()}; save(K8,st8);
    $("#s8-ok").textContent="✓ tersimpan.";
  });
  var cp=$("#copy-lembar"); if(cp) cp.addEventListener("click",function(){
    if(!st6||!st6.computed){ alert("Hitung rubrik dulu."); return; }
    var L=[];
    L.push("LEMBAR TRANSFER — UNVR FY2024 ("+(coached?"COACHED":"BLIND")+")");
    L.push("Durasi: "+(st0?fmtDur(Date.now()-st0.ts):"-"));
    L.push("T1: "+(st6.detail.T1?"LULUS":"BELUM")+" | T2: "+(st6.detail.T2?"LULUS":"BELUM")+" | T3: "+(st6.detail.T3?"LULUS":"BELUM"));
    L.push("Vonis: "+(st6.pass?"LULUS — sinyal belajar mandiri":"BELUM LULUS"));
    L.push("--- 3 lensa ---");
    if(st4){ LENSES.forEach(function(X){ L.push("["+X.t+"] "+st4.lenses[X.k]); }); L.push("Vonis: "+st4.vonis); }
    L.push("--- Memo ---"); if(st7) L.push(st7.memo);
    var txt=L.join("\n");
    if(navigator.clipboard) navigator.clipboard.writeText(txt).then(function(){ $("#copy-ok").textContent="✓ disalin."; });
    else { var ta=document.createElement("textarea"); ta.value=txt; document.body.appendChild(ta); ta.select();
      try{ document.execCommand("copy"); $("#copy-ok").textContent="✓ disalin."; }catch(e){} ta.remove(); }
  });
  var rs=$("#reset-exam"); if(rs) rs.addEventListener("click",function(){
    if(!confirm("Ulangi ujian transfer? Attempt berikutnya = MODE COACHED berlabel. Jawaban blind terkunci tidak bisa dikembalikan.")) return;
    [K1,K2,K3,K4,K5,K6,K7,K8].forEach(function(k){ try{localStorage.removeItem(k);}catch(e){} });
    st0={ts:Date.now(),coached:true}; save(K0,st0);
    location.reload();
  });
}

function initRest(){ initS1(); initS2(); initS3(); initS4(); initS5(); initRubrik(); initMemo(); initS8(); }
document.addEventListener("DOMContentLoaded",function(){ initS0(); });
})();
