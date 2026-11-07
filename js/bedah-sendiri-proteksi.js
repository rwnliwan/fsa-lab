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
      if(parts.length > 2) return NaN;  // F3: 1.2.3 ditolak
      if(parts.length === 2 && parts[1].length === 3 && parts[0] !== "0" && parts[0] !== "-0"){
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
/* ================= FSA Lab — Bedah Sendiri: PT Proteksi Sejahtera (FIKTIF) =================
   Pola disederhanakan dari js/bedah-sendiri-bbri.js (workflow L1–L5, 6 cek, bukan 10).
   Perusahaan FIKTIF, seluruh angka ILUSTRATIF — latihan format Bedah Sendiri, bukan filing asli.
   Benchmark TIDAK ada di file ini — dimuat dinamis dari ../data/proteksi-benchmark.js
   hanya saat langkah 5 dibuka. Namespace localStorage: fsa_bs_proteksi_* . */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function fmtID(n){ try{ return Math.round(n).toLocaleString("id-ID"); }catch(e){ return String(Math.round(n)); } }
function fmtJt(n){ return "Rp" + fmtID(n) + " jt"; }
function fmtPctID(x){ return x.toFixed(2).replace(".",",") + "%"; }

/* ---------- definisi baris input (L2): 17 pos + 2 rasio ---------- */
var ROWS = [
 {k:"premi_diterima", sec:"Laba rugi", label:"Premi diterima (gross written premium)"},
 {k:"ins_rev",  sec:"Laba rugi", label:"Insurance revenue"},
 {k:"klaim",    sec:"Laba rugi", label:"Klaim terjadi (incurred claims)"},
 {k:"beban",    sec:"Laba rugi", label:"Beban akuisisi & administrasi"},
 {k:"service_exp", sec:"Laba rugi", label:"Insurance service expense (terhitung = klaim + beban)"},
 {k:"service_result", sec:"Laba rugi", label:"Insurance service result (terhitung = revenue − expense)"},
 {k:"csm_awal", sec:"CSM & liabilitas", label:"CSM awal tahun"},
 {k:"csm_release", sec:"CSM & liabilitas", label:"Pelepasan CSM tahun berjalan"},
 {k:"csm_akhir",sec:"CSM & liabilitas", label:"CSM akhir tahun (terhitung = awal − dilepas)"},
 {k:"ra",       sec:"CSM & liabilitas", label:"Risk adjustment"},
 {k:"fcf",      sec:"CSM & liabilitas", label:"Fulfilment cash flows"},
 {k:"premi_reas", sec:"Reasuransi", label:"Premi reasuransi (reinsurance held)"},
 {k:"recovery_reas", sec:"Reasuransi", label:"Recovery dari reasuradur"},
 {k:"laba_bersih", sec:"Laba rugi", label:"Laba bersih"},
 {k:"aset",     sec:"Posisi keuangan", label:"TOTAL ASET"},
 {k:"liab",     sec:"Posisi keuangan", label:"TOTAL LIABILITAS (terhitung = aset − ekuitas)"},
 {k:"ekuitas",  sec:"Posisi keuangan", label:"TOTAL EKUITAS"}
];
var RATIO_KEYS = ["combined","service_margin"];
var RATIO_LABELS = {combined:"Combined ratio — ketik angka (%)", service_margin:"Service margin — ketik angka (%)"};
var RATIO_HINTS = {combined:"definisi latihan, mis. (klaim + beban) ÷ insurance revenue", service_margin:"definisimu, mis. service result ÷ insurance revenue"};
var UNITS = {juta:1e6, miliar:1e9, triliun:1e12};
var K1="fsa_bs_proteksi_s1", K2="fsa_bs_proteksi_s2", K3="fsa_bs_proteksi_s3", K4="fsa_bs_proteksi_s4", K5="fsa_bs_proteksi_s5";
function load(k){ try{ var v=JSON.parse(localStorage.getItem(k)); return v||null; }catch(e){ return null; } }
function save(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
var st1=load(K1), st2=load(K2), st3=load(K3), st4=load(K4), st5=load(K5);

/* ---------- nilai ternormalisasi ---------- */
function F(k){ /* baris nilai: normalisasi ke Rp JUTA */
  var r = st2 && st2.figures ? st2.figures[k] : null;
  if(!r || r.nd) return {nd:true};
  var num = parseIDNumber(r.v, false);
  if(isNaN(num)) return {nd:true, bad:true};
  var mult = UNITS[r.unit||"miliar"]||1e9;
  return {nd:false, jt:num*mult/1e6, unit:r.unit||"miliar", basis:r.basis||"konsolidasi", page:r.page||""};
}
function FR(k){ /* baris rasio: persen ketikan + definisi */
  var r = st2 && st2.figures ? st2.figures[k] : null;
  if(!r || r.nd) return {nd:true};
  var num = parseIDNumber(r.v, true);
  if(isNaN(num)) return {nd:true, bad:true};
  return {nd:false, v:num, def:r.def||""};
}
function allOk(){
  if(!st2 || !st2.figures) return false;
  return ROWS.every(function(rw){
    var f=st2.figures[rw.k];
    if(!f) return false;
    if(f.nd) return true;
    if(String(f.v||"").trim()==="") return false;
    return true;
  }) && RATIO_KEYS.every(function(k){
    var f=st2.figures[k];
    if(!f) return false;
    if(f.nd) return true;
    if(String(f.v||"").trim()==="") return false;
    if(String(f.def||"").trim()==="") return false;
    return true;
  });
}
function lensOK(t){ t=String(t||"").trim(); return t.length>=50 && /\d/.test(t); }
function validS4(){ return st4 && lensOK(st4.lenses.inv) && lensOK(st4.lenses.cred) && lensOK(st4.lenses.foren) && String(st4.vonis||"").trim().length>=10; }
function canReveal(){ return !!(st1 && st1.read && st2 && st2.done && st3 && st3.ran && validS4()); }

/* ---------- stepper ---------- */
var STEP_TXT=["1 · Baca","2 · Input angka","3 · Cek mekanis","4 · Tiga lensa","5 · Benchmark"];
function stepStatus(i){
  if(i===0) return (st1&&st1.read)?"done":"active";
  if(i===1) return (st2&&st2.done)?"done":((st1&&st1.read)?"active":"lock");
  if(i===2) return (st3&&st3.ran)?"done":((st2&&st2.done)?"active":"lock");
  if(i===3) return validS4()?"done":((st3&&st3.ran)?"active":"lock");
  return (st5&&st5.revealed)?"done":(canReveal()?"active":"lock");
}
function refreshSteps(){
  var box=$("#stepper"); if(!box) return;
  box.innerHTML=STEP_TXT.map(function(t,i){
    var s=stepStatus(i);
    var cls=s==="done"?"done":(s==="active"?"active":"lock");
    var mark=s==="done"?" ✓":(s==="lock"?" 🔒":"");
    return "<span class='step "+cls+"'>"+esc(t)+mark+"</span>";
  }).join("");
}

/* ---------- L1 ---------- */
function initL1(){
  var b=$("#s1-save"); if(!b) return;
  if(st1){
    ["a","b","c","rev","csm","cr"].forEach(function(f){ var el=$("#s1-"+f); if(el) el.value=st1[f]||""; });
    $("#s1-read").checked=!!st1.read;
  }
  b.addEventListener("click",function(){
    var v={}, bad=[];
    ["a","b","c"].forEach(function(f){ v[f]=$("#s1-"+f).value.trim(); if(!v[f]) bad.push(f); });
    [["rev","insurance revenue"],["csm","CSM akhir"],["cr","combined ratio"]].forEach(function(p){
      v[p[0]]=$("#s1-"+p[0]).value.trim(); if(!v[p[0]]) bad.push(p[1]);
    });
    var read=$("#s1-read").checked;
    if(bad.length){ alert("Belum bisa lanjut — kosong:\n• "+bad.join("\n• ")+"\n\nTugas baca insurer: temukan insurance revenue, CSM akhir, dan combined ratio di kartu referensi."); return; }
    if(!read){ alert("Centang 'Saya sudah membaca' dulu. Honor system — tapi jujur ke diri sendiri."); return; }
    st1={a:v.a,b:v.b,c:v.c,rev:v.rev,csm:v.csm,cr:v.cr,read:true,ts:Date.now()}; save(K1,st1);
    $("#s1-ok").textContent="✓ Langkah 1 tercatat. Lanjut ke langkah 2.";
    refreshSteps();
  });
}

/* ---------- L2 ---------- */
function rowHTML(rw, saved){
  var s=saved||{};
  function sel(name, opts, val){
    return "<select class='"+name+"' data-f='"+rw.k+"'>"+opts.map(function(o){
      return "<option value='"+o+"'"+(o===val?" selected":"")+">"+o+"</option>";
    }).join("")+"</select>";
  }
  var head="<tr data-k='"+rw.k+"'>"+
    "<td style='min-width:11rem'><strong>"+esc(rw.label)+"</strong><br><span style='font-size:.75rem;color:var(--ink-soft)'>"+esc(rw.sec)+"</span></td>";
  return head+
    "<td><input class='bs-v' data-f='"+rw.k+"' type='text' inputmode='decimal' placeholder='mis. 1.200' value='"+esc(s.v||"")+"' style='min-width:8rem'></td>"+
    "<td><input class='bs-page' data-f='"+rw.k+"' type='text' placeholder='kartu/hal.' value='"+esc(s.page||"")+"' style='min-width:6rem'></td>"+
    "<td>"+sel("bs-period",["FY2025","FY2024"],s.period||"FY2025")+"</td>"+
    "<td>"+sel("bs-unit",["juta","miliar","triliun"],s.unit||"miliar")+"</td>"+
    "<td>"+sel("bs-ccy",["Rp","USD"],s.ccy||"Rp")+"</td>"+
    "<td>"+sel("bs-basis",["konsolidasi","induk"],s.basis||"konsolidasi")+"</td>"+
    "<td style='text-align:center'><input class='bs-nd' data-f='"+rw.k+"' type='checkbox'"+(s.nd?" checked":"")+" title='tidak diungkapkan'></td></tr>";
}
function ratioRowHTML(k, saved){
  var s=saved||{};
  return "<tr data-k='"+k+"'>"+
    "<td style='min-width:11rem'><strong>"+esc(RATIO_LABELS[k])+"</strong><br><span style='font-size:.75rem;color:var(--ink-soft)'>Rasio (ketik + definisi)</span></td>"+
    "<td><input class='bs-v' data-f='"+k+"' type='text' inputmode='decimal' placeholder='mis. 74,1' value='"+esc(s.v||"")+"' style='max-width:7rem'> <span style='font-size:.8rem'>%</span></td>"+
    "<td colspan='5'><input class='bs-def' data-f='"+k+"' type='text' placeholder='"+esc(RATIO_HINTS[k])+"' value='"+esc(s.def||"")+"' style='width:100%'></td>"+
    "<td style='text-align:center'><input class='bs-nd' data-f='"+k+"' type='checkbox'"+(s.nd?" checked":"")+" title='tidak diungkapkan'></td></tr>";
}
function initL2(){
  var box=$("#fig-tbody"); if(!box) return;
  box.innerHTML=ROWS.map(function(rw){ return rowHTML(rw, st2&&st2.figures?st2.figures[rw.k]:null); }).join("")
    + RATIO_KEYS.map(function(k){ return ratioRowHTML(k, st2&&st2.figures?st2.figures[k]:null); }).join("");
  $$(".bs-nd").forEach(function(cb){
    cb.addEventListener("change",function(){
      var tr=cb.closest("tr");
      tr.querySelector(".bs-v").disabled=cb.checked;
      tr.classList.toggle("ndrow",cb.checked);
    });
    if(cb.checked){ var tr=cb.closest("tr"); tr.querySelector(".bs-v").disabled=true; tr.classList.add("ndrow"); }
  });
  $("#s2-save").addEventListener("click",function(){
    var figs={}, errs=[];
    ROWS.forEach(function(rw){
      var k=rw.k;
      var v=$(".bs-v[data-f='"+k+"']").value.trim();
      var nd=$(".bs-nd[data-f='"+k+"']").checked;
      if(nd){ figs[k]={v:"",nd:true}; return; }
      if(v===""){ errs.push(rw.label); return; }
      if(isNaN(parseIDNumber(v, false))){ errs.push(rw.label+" (format angka tidak valid)"); return; }
      figs[k]={v:v, nd:false,
        page:$(".bs-page[data-f='"+k+"']").value.trim(),
        period:$(".bs-period[data-f='"+k+"']").value,
        unit:$(".bs-unit[data-f='"+k+"']").value,
        ccy:$(".bs-ccy[data-f='"+k+"']").value,
        basis:$(".bs-basis[data-f='"+k+"']").value};
    });
    RATIO_KEYS.forEach(function(k){
      var v=$(".bs-v[data-f='"+k+"']").value.trim();
      var nd=$(".bs-nd[data-f='"+k+"']").checked;
      if(nd){ figs[k]={v:"",nd:true}; return; }
      if(v===""){ errs.push(RATIO_LABELS[k]); return; }
      if(isNaN(parseIDNumber(v, true))){ errs.push(RATIO_LABELS[k]+" (format angka tidak valid)"); return; }
      var rec={v:v, nd:false, def:$(".bs-def[data-f='"+k+"']").value.trim()};
      if(!rec.def) errs.push(RATIO_LABELS[k]+" (definisi wajib diisi — rasio insurer = kontrak definisi)");
      figs[k]=rec;
    });
    if(errs.length){
      alert("Belum bisa lanjut — "+errs.length+" baris bermasalah:\n• "+errs.slice(0,6).join("\n• ")+(errs.length>6?"\n…dan "+(errs.length-6)+" lagi":"")+"\n\nBaris kosong WAJIB dicentang 'tidak diungkapkan'.");
      return;
    }
    st2={figures:figs,done:true,ts:Date.now()}; save(K2,st2);
    $("#s2-ok").textContent="✓ "+(ROWS.length+RATIO_KEYS.length)+" baris tersimpan. Lanjut ke langkah 3 — cek mekanis.";
    refreshSteps();
  });
}

/* ---------- L3: 6 cek mekanis insurer ---------- */
function chkRow(id,name,st,detail,hint,extra){
  return {id:id,name:name,st:st,detail:detail,hint:hint,extra:extra||""};
}
function ndAny(){ for(var i=0;i<arguments.length;i++){ if(arguments[i].nd) return true; } return false; }
function runChecks(){
  var out=[];
  /* P1: service expense = klaim + beban */
  var kl=F("klaim"), bb=F("beban"), se=F("service_exp");
  if(ndAny(kl,bb,se)) out.push(chkRow("P1","Service expense aritmetika","DILEWATI","klaim / beban / service expense tidak diungkapkan.","—"));
  else{
    var e1=kl.jt+bb.jt, t1=Math.max(0.01*Math.abs(e1),1000), d1=Math.abs(se.jt-e1);
    out.push(chkRow("P1","Service expense aritmetika", d1<=t1?"LULUS":"GAGAL",
      "Service expense "+fmtJt(se.jt)+" vs klaim + beban = "+fmtJt(e1)+" — selisih "+fmtJt(d1)+".",
      "Service expense = klaim yang terjadi + beban. Curigai salah satuan (kartu referensi dalam jutaan, input default miliar)."));
  }
  /* P2: service result = revenue − expense */
  var rv=F("ins_rev"), sr=F("service_result");
  if(ndAny(rv,se,sr)) out.push(chkRow("P2","Service result aritmetika","DILEWATI","revenue / service expense / service result tidak diungkapkan.","—"));
  else{
    var e2=rv.jt-se.jt, t2=Math.max(0.01*Math.abs(e2),1000), d2=Math.abs(sr.jt-e2);
    out.push(chkRow("P2","Service result aritmetika", d2<=t2?"LULUS":"GAGAL",
      "Service result "+fmtJt(sr.jt)+" vs revenue − expense = "+fmtJt(e2)+" — selisih "+fmtJt(d2)+".",
      "Service result adalah laba jasa asuransi — sebelum hasil investasi dan finance. Lihat M42."));
  }
  /* P3: CSM akhir = awal − dilepas */
  var ca=F("csm_awal"), cr=F("csm_release"), ce=F("csm_akhir");
  if(ndAny(ca,cr,ce)) out.push(chkRow("P3","CSM roll-forward","DILEWATI","CSM awal / pelepasan / CSM akhir tidak diungkapkan.","—"));
  else{
    var e3=ca.jt-cr.jt, t3=Math.max(0.01*Math.abs(e3),1000), d3=Math.abs(ce.jt-e3);
    out.push(chkRow("P3","CSM roll-forward", d3<=t3?"LULUS":"GAGAL",
      "CSM akhir "+fmtJt(ce.jt)+" vs awal − dilepas = "+fmtJt(e3)+" — selisih "+fmtJt(d3)+".",
      "Roll-forward disederhanakan (tanpa akresi dan perubahan asumsi). CSM akhir = cadangan laba masa depan."));
  }
  /* P4: combined ratio (definisi latihan) */
  var cb=FR("combined");
  if(ndAny(kl,bb,rv)) out.push(chkRow("P4","Combined ratio","DILEWATI","klaim / beban / revenue tidak diungkapkan.","—"));
  else if(cb.nd) out.push(chkRow("P4","Combined ratio","DILEWATI","kamu belum mengetik combined ratio di langkah 2.","Ketik combined ratio hasil hitunganmu di baris rasio langkah 2."));
  else{
    var c4=(kl.jt+bb.jt)/rv.jt*100;
    out.push(chkRow("P4","Combined ratio", Math.abs(c4-cb.v)<=0.5?"LULUS":"GAGAL",
      "Hitungan situs: "+fmtPctID(c4)+" vs ketikanmu: "+fmtPctID(cb.v)+".",
      "Definisi latihan: (klaim + beban) ÷ insurance revenue. Di bawah 100% = underwriting untung."));
  }
  /* P5: neraca balance */
  var A=F("aset"), L=F("liab"), E=F("ekuitas");
  if(ndAny(A,L,E)) out.push(chkRow("P5","Neraca balance","DILEWATI","aset / liabilitas / ekuitas tidak diungkapkan.","—"));
  else{
    var e5=L.jt+E.jt, t5=Math.max(0.01*Math.abs(e5),1000), d5=Math.abs(A.jt-e5);
    out.push(chkRow("P5","Neraca balance", d5<=t5?"LULUS":"GAGAL",
      "Aset "+fmtJt(A.jt)+" vs Liabilitas+Ekuitas "+fmtJt(e5)+" — selisih "+fmtJt(d5)+".",
      "Cek satuan tiap baris; pastikan basis sama (konsolidasi vs induk)."));
  }
  /* P6: kelengkapan sumber + definisi (display) */
  var withPage=ROWS.filter(function(rw){ var f=F(rw.k); return !f.nd&&f.page!==""; }).length;
  var withDef=RATIO_KEYS.filter(function(k){ var f=FR(k); return !f.nd&&String(f.def||"").trim()!==""; }).length;
  out.push(chkRow("P6","Kelengkapan sumber & definisi","INFO",
    "Disiplin sumbermu: "+withPage+"/"+ROWS.length+" baris ber-kartu · "+withDef+"/"+RATIO_KEYS.length+" rasio ber-definisi.",
    "Bukan nilai — cerminan disiplin. Analis insurer yang baik selalu bisa menunjuk 'angka ini dari kartu sekian, definisinya ini'."));
  return out;
}
function extraRatios(){
  var sr=F("service_result"), rv=F("ins_rev");
  var lb=F("laba_bersih"), eq=F("ekuitas");
  function pct(x,y){ return (!x.nd&&!y.nd&&y.jt!==0)?(x.jt/y.jt*100).toFixed(2).replace(".",",")+"%":"—"; }
  return [
    ["Service margin (service result ÷ revenue)", pct(sr,rv)],
    ["ROE (laba bersih ÷ ekuitas)", pct(lb,eq)],
    ["Premi diterima ÷ insurance revenue", (!F("premi_diterima").nd&&!rv.nd&&rv.jt!==0)?(F("premi_diterima").jt/rv.jt).toFixed(2).replace(".",",")+"×":"—"]
  ];
}
function initL3(){
  var b=$("#s3-run"); if(!b) return;
  function render(){
    var checks=runChecks();
    var box=$("#check-results");
    box.innerHTML=checks.map(function(c){
      var badge=c.st==="LULUS"?"<span class='ck ok'>LULUS</span>":c.st==="GAGAL"?"<span class='ck bad'>GAGAL</span>":c.st==="INFO"?"<span class='ck info'>INFO</span>":"<span class='ck skip'>DILEWATI</span>";
      return "<div class='ck-row'>"+badge+
        "<div><strong>"+c.id+" — "+esc(c.name)+"</strong><br><span class='ck-det'>"+esc(c.detail)+"</span>"+
        (c.extra?"<br><span class='ck-hint'>📌 "+esc(c.extra)+"</span>":"")+
        (c.hint&&c.hint!=="—"?"<br><span class='ck-hint'>💡 "+esc(c.hint)+"</span>":"")+"</div></div>";
    }).join("");
    var ex=extraRatios();
    $("#extra-ratios").innerHTML="<strong>Rasio dari angkamu (display, bukan cek):</strong> "+
      ex.map(function(e){return esc(e[0])+": <span class='mono'>"+esc(e[1])+"</span>";}).join(" · ");
  }
  if(st3&&st3.ran) render();
  b.addEventListener("click",function(){
    render();
    st3={ran:true,checks:runChecks().map(function(c){return {id:c.id,st:c.st};}),ts:Date.now()};
    save(K3,st3);
    $("#s3-ok").textContent="✓ 6 cek mekanis dijalankan. GAGAL = informasi, bukan nilai — perbaiki inputmu atau catat sebagai temuan. Lanjut ke langkah 4.";
    refreshSteps();
  });
}

/* ---------- L4: lensa insurer ---------- */
var LENSES=[
 {k:"inv", t:"Lensa investasi", q:"Apakah return insurer ini sepadan dengan risiko klaim yang diambil? Tulis SATU bukti yang MENGUATKAN (mis. CSM/service margin/combined ratio) dan SATU yang MEMATAHKAN (mis. tren klaim/ketergantungan reasuransi), beserta angkanya dari langkah 2."},
 {k:"cred",t:"Lensa kredit", q:"Apakah CSM cukup sebagai bantalan laba masa depan? Bagaimana kualitas underwriting (combined ratio)? Dan seberapa besar ketergantungan pada reasuransi? Bukti penguat + pematah + angka."},
 {k:"foren",t:"Lensa forensik", q:"Satu hal tentang CSM / asumsi klaim / risk adjustment yang paling ingin kamu investigasi — dan pertanyaan apa yang kamu ajukan? (Bukan vonis. Contoh pola: 'CSM naik tapi klaim aktual naik lebih cepat — kenapa?')"}
];
function initL4(){
  if(!$("#lens-inv")) return;
  if(st4){
    LENSES.forEach(function(L){ $("#lens-"+L.k).value=(st4.lenses&&st4.lenses[L.k])||""; });
    $("#vonis").value=st4.vonis||"";
  }
  LENSES.forEach(function(L){
    var ta=$("#lens-"+L.k);
    ta.addEventListener("input",function(){
      var ok=lensOK(ta.value);
      $("#cnt-"+L.k).textContent=ta.value.trim().length+" karakter"+(ok?" ✓":" (min. 50 + wajib ada angka)");
      $("#cnt-"+L.k).className=ok?"cnt ok":"cnt";
    });
    ta.dispatchEvent(new Event("input"));
  });
  $("#s4-save").addEventListener("click",function(){
    var lenses={}, bad=[];
    LENSES.forEach(function(L){
      var v=$("#lens-"+L.k).value;
      lenses[L.k]=v;
      if(!lensOK(v)) bad.push(L.t);
    });
    var vonis=$("#vonis").value.trim();
    if(vonis.length<10) bad.push("Vonis 1 kalimat (min. 10 karakter)");
    if(bad.length){ alert("Belum bisa lanjut:\n• "+bad.join("\n• ")+"\n\nTiap jawaban lensa: min. 50 karakter DAN wajib mengutip minimal 1 angka."); return; }
    st4={lenses:lenses,vonis:vonis,ts:Date.now()}; save(K4,st4);
    $("#s4-ok").textContent="✓ Tiga lensa + vonis tersimpan. Langkah 5 (benchmark) kini terbuka — membukanya akan MENGUNCI jawabanmu.";
    refreshSteps();
  });
}
function lockL4(){
  LENSES.forEach(function(L){ var ta=$("#lens-"+L.k); if(ta) ta.disabled=true; });
  var v=$("#vonis"); if(v) v.disabled=true;
  var b=$("#s4-save"); if(b) b.disabled=true;
  var note=$("#s4-locknote"); if(note) note.style.display="block";
}

/* ---------- L5: reveal ---------- */
function loadBench(cb){
  if(window.PROTEKSI_BENCH){ cb(); return; }
  var s=document.createElement("script");
  s.src="../data/proteksi-benchmark.js";
  s.onload=cb;
  s.onerror=function(){ alert("Gagal memuat file benchmark. Cek koneksi / path ../data/proteksi-benchmark.js"); };
  document.head.appendChild(s);
}
function srcCell(b){
  var tag=b.tag?" ["+b.tag+"]":"";
  if(b.page==="—") return "terhitung"+tag;
  return b.page+(b.note&&b.note!=="—"?", "+b.note:"")+tag;
}
function renderL5(){
  var B=window.PROTEKSI_BENCH; if(!B) return;
  var rows=ROWS.map(function(rw){
    var mine, delta, cls="", bench, src;
    var b2=B.rows[rw.k];
    if(!b2) return "";
    bench=fmtJt(b2.v); src=srcCell(b2);
    var f2=F(rw.k);
    if(f2.nd){ mine="<em>tidak diungkapkan</em>"; delta="—"; }
    else{
      mine=fmtJt(f2.jt);
      var d2=(f2.jt-b2.v)/Math.abs(b2.v)*100;
      delta=(d2>=0?"+":"")+d2.toFixed(1).replace(".",",")+"%";
      if(Math.abs(d2)>1) cls=" class='diverge'";
    }
    return "<tr"+cls+"><td>"+esc(rw.label)+"</td><td class='mono'>"+mine+"</td><td class='mono'>"+bench+"</td><td class='mono'>"+delta+"</td><td>"+esc(src)+"</td></tr>";
  }).join("");
  rows+=RATIO_KEYS.map(function(k){
    var b=B.ratios[k];
    if(!b) return "";
    var f=FR(k);
    var bench=(b.v).toFixed(2).replace(".",",")+"%";
    var src=srcCell({page:"—",tag:b.tag,note:b.def});
    var mine, delta, cls="";
    if(f.nd){ mine="<em>tidak diungkapkan</em>"; delta="—"; }
    else{
      mine=fmtPctID(f.v);
      var d=(f.v-b.v)/Math.abs(b.v)*100;
      delta=(d>=0?"+":"")+d.toFixed(1).replace(".",",")+"%";
      if(Math.abs(d)>1) cls=" class='diverge'";
    }
    return "<tr"+cls+"><td>"+esc(RATIO_LABELS[k])+"</td><td class='mono'>"+mine+"</td><td class='mono'>"+bench+"</td><td class='mono'>"+delta+"</td><td>"+esc(src)+"</td></tr>";
  }).join("");
  $("#div-table").innerHTML=rows;
  var defRows=RATIO_KEYS.map(function(k){
    var b=B.ratios[k], f=FR(k);
    var mine=f.nd?"<em>tidak diungkapkan</em>":esc(f.def||"—");
    return "<tr><td><strong>"+esc(RATIO_LABELS[k])+"</strong> ["+b.tag+"]</td><td>"+esc(b.def)+"</td><td>"+mine+"</td></tr>";
  }).join("");
  $("#def-table").innerHTML=defRows;
  var an=$("#analyst");
  an.innerHTML="<div class='honest'><strong>⚠️ Satu interpretasi analis — bukan jawaban benar.</strong> "+
    "Tiga paragraf di bawah adalah cara analis membaca angka Proteksi FY2025 (ilustratif). Bandingkan dengan jawaban blind-mu: "+
    "di mana kamu menyimpang, angka apa yang terlewat, pertanyaan lensa mana yang paling sulit?</div>"+
    [["Lensa investasi",B.analyst.inv],["Lensa kredit",B.analyst.cred],["Lensa forensik",B.analyst.foren]].map(function(p){
      return "<h3>"+esc(p[0])+"</h3><p>"+esc(p[1])+"</p>";
    }).join("")+
    "<h3>Red flags — sebagai pertanyaan, bukan vonis</h3><ol>"+
    B.redflags.map(function(r){return "<li>"+esc(r)+"</li>";}).join("")+"</ol>"+
    "<div class='honest' style='margin-top:1.2rem'><strong>🏦 Callout jujur — valuasi insurer bukan DCF atas premi.</strong> "+esc(B.callout)+"</div>";
  if(st5&&st5.reflect) $("#reflect").value=st5.reflect;
  $("#l5-content").style.display="block";
  $("#l5-gate").style.display="none";
}
function excerpt(t,n){ t=String(t||"").trim(); return t.length>n?t.slice(0,n)+"…":t; }
function buildLembar(){
  var B=window.PROTEKSI_BENCH;
  var d=new Date(st1.ts); var tgl=d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
  var L="LEMBAR BEDAH — "+B.meta.emiten+" · "+B.meta.periode+"\n"+
    "Dibaca: "+tgl+" · Basis: "+B.meta.basis+" · Sumber: "+B.meta.dokumen+"\n"+B.meta.filing_url+"\n\n"+
    "VERDICT 5 BARIS:\n"+
    "1. VONIS: "+st4.vonis+"\n"+
    "2. Kualitas laba jasa: "+excerpt(st4.lenses.inv,280)+"\n"+
    "3. Kualitas underwriting & CSM: "+excerpt(st4.lenses.cred,280)+"\n"+
    "4. Reasuransi: "+excerpt(st4.lenses.cred,280)+"\n"+
    "5. Pertanyaan terbuka: "+excerpt(st4.lenses.foren,280)+"\n\n"+
    "LENSA INVESTASI:\n"+st4.lenses.inv+"\n\n"+
    "LENSA KREDIT:\n"+st4.lenses.cred+"\n\n"+
    "LENSA FORENSIK:\n"+st4.lenses.foren+"\n\n"+
    "DEFINISI LATIHAN vs DEFINISIKU:\n";
  RATIO_KEYS.forEach(function(k){
    var b=B.ratios[k], f=FR(k);
    L+="• "+RATIO_LABELS[k]+" ["+b.tag+"]: latihan = \""+b.def+"\" | definisiku = \""+(f.nd?"tidak diungkapkan":f.def)+"\"\n";
  });
  L+="\nDIVERGENSI vs KUNCI JAWABAN (Δ > 1% disorot di web; [T]=terhitung dari data ilustratif):\n";
  ROWS.forEach(function(rw){
    var f2=F(rw.k), b2=B.rows[rw.k]; if(!b2) return;
    if(f2.nd){ L+="• "+rw.label+": tidak kuungkapkan vs kunci "+fmtJt(b2.v)+(b2.tag?" ["+b2.tag+"]":"")+"\n"; return; }
    var dlt2=(f2.jt-b2.v)/Math.abs(b2.v)*100;
    L+="• "+rw.label+": angkaku "+fmtJt(f2.jt)+" vs kunci "+fmtJt(b2.v)+" (Δ "+(dlt2>=0?"+":"")+dlt2.toFixed(1).replace(".",",")+"%)"+(b2.tag?" ["+b2.tag+"]":"")+"\n";
  });
  RATIO_KEYS.forEach(function(k){
    var f=FR(k), b=B.ratios[k]; if(!b) return;
    if(f.nd){ L+="• "+RATIO_LABELS[k]+": tidak kuungkapkan vs kunci "+fmtPctID(b.v)+" ["+b.tag+"]\n"; return; }
    var dlt=(f.v-b.v)/Math.abs(b.v)*100;
    L+="• "+RATIO_LABELS[k]+": angkaku "+fmtPctID(f.v)+" vs kunci "+fmtPctID(b.v)+" (Δ "+(dlt>=0?"+":"")+dlt.toFixed(1).replace(".",",")+"%) ["+b.tag+"]\n";
  });
  L+="\n—\nDibuat di FSA Lab · Bedah Sendiri (Proteksi, fiktif). Seluruh angka ilustratif — latihan format Bedah Sendiri, bukan filing asli; interpretasi analis = satu interpretasi, bukan jawaban benar.";
  return L;
}
function initL5(){
  var btn=$("#reveal-btn"); if(!btn) return;
  if(st5&&st5.revealed){
    lockL4();
    loadBench(renderL5);
    return;
  }
  btn.addEventListener("click",function(){
    if(!canReveal()){ alert("Langkah 1–4 belum lengkap. Selesaikan dulu: baca (1), input angka (2), jalankan cek (3), tiga lensa + vonis (4)."); return; }
    if(!confirm("Buka kunci jawaban sekarang?\n\nJawaban tiga lensamu (langkah 4) akan DIKUNCI permanen — upaya blind-mu terjaga. Lanjut?")) return;
    st5={revealed:true,ts:Date.now(),reflect:""}; save(K5,st5);
    lockL4();
    loadBench(renderL5);
    refreshSteps();
  });
  var cp=$("#copy-lembar");
  if(cp) cp.addEventListener("click",function(){
    var t=buildLembar();
    function done(){ $("#copy-ok").textContent="✓ Lembar Bedah tersalin ke clipboard."; }
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(done,function(){ fallback(); });
    } else fallback();
    function fallback(){
      var ta=document.createElement("textarea"); ta.value=t; document.body.appendChild(ta);
      ta.select(); try{ document.execCommand("copy"); done(); }catch(e){ alert("Gagal menyalin otomatis — blokir browser. Salin manual dari halaman."); }
      document.body.removeChild(ta);
    }
  });
  var rf=$("#reflect");
  if(rf) rf.addEventListener("change",function(){
    st5=st5||{revealed:true,ts:Date.now()}; st5.reflect=rf.value; save(K5,st5);
  });
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded",function(){
  refreshSteps();
  initL1(); initL2(); initL3(); initL4(); initL5();
  if(st5&&st5.revealed) lockL4();
});
})();
