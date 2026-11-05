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

/* ================= FSA Lab — Bedah Sendiri: KLBF (workflow L1–L5) =================
   parseIDNumber disalin byte-identik dari js/modul37.js (blok di atas file ini).
   Benchmark TIDAK ada di file ini — dimuat dinamis dari ../data/klbf-benchmark.js
   hanya saat langkah 5 dibuka. */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function fmtID(n){ try{ return Math.round(n).toLocaleString("id-ID"); }catch(e){ return String(Math.round(n)); } }
function fmtRp(n){ return "Rp" + fmtID(n); }

/* ---------- definisi baris input (L2) ---------- */
var ROWS = [
 {k:"rev",    sec:"Laba rugi",       label:"Penjualan neto"},
 {k:"cogs",   sec:"Laba rugi",       label:"Beban pokok penjualan"},
 {k:"gross",  sec:"Laba rugi",       label:"Laba bruto"},
 {k:"sell",   sec:"Laba rugi",       label:"Beban penjualan"},
 {k:"ga",     sec:"Laba rugi",       label:"Beban umum dan administrasi"},
 {k:"rd",     sec:"Laba rugi",       label:"Beban penelitian dan pengembangan"},
 {k:"ebit",   sec:"Laba rugi",       label:"Laba usaha (terhitung — bukan subtotal LK)"},
 {k:"int_exp",sec:"Laba rugi",       label:"Beban bunga dan keuangan"},
 {k:"pbt",    sec:"Laba rugi",       label:"Laba sebelum beban pajak penghasilan"},
 {k:"tax",    sec:"Laba rugi",       label:"Beban pajak penghasilan"},
 {k:"ni_total",sec:"Laba rugi",      label:"Laba tahun berjalan (total)"},
 {k:"ni_attr",sec:"Laba rugi",       label:"Laba tahun berjalan — diatribusikan ke pemilik induk"},
 {k:"cash_bs",sec:"Posisi keuangan", label:"Kas dan setara kas (neraca)"},
 {k:"recv",   sec:"Posisi keuangan", label:"Piutang usaha, neto (pihak ketiga + berelasi)"},
 {k:"inv",    sec:"Posisi keuangan", label:"Persediaan, neto"},
 {k:"ppe",    sec:"Posisi keuangan", label:"Aset tetap, neto"},
 {k:"ca",     sec:"Posisi keuangan", label:"Total aset lancar"},
 {k:"assets", sec:"Posisi keuangan", label:"TOTAL ASET"},
 {k:"liab",   sec:"Posisi keuangan", label:"TOTAL LIABILITAS"},
 {k:"cl",     sec:"Posisi keuangan", label:"Total liabilitas jangka pendek"},
 {k:"intdebt",sec:"Posisi keuangan", label:"Utang berbunga (terhitung: bank + sewa + pembiayaan + konversi)"},
 {k:"equity", sec:"Posisi keuangan", label:"TOTAL EKUITAS"},
 {k:"re_start",sec:"Posisi keuangan",label:"Saldo laba AWAL 2024 — belum ditentukan penggunaannya"},
 {k:"re_end", sec:"Posisi keuangan", label:"Saldo laba AKHIR 2024 — belum ditentukan penggunaannya"},
 {k:"cash_cf",sec:"Arus kas",        label:"Kas akhir tahun (arus kas)"},
 {k:"cfo",    sec:"Arus kas",        label:"Kas neto diperoleh dari aktivitas operasi"},
 {k:"capex",  sec:"Arus kas",        label:"Perolehan aset tetap"},
 {k:"div",    sec:"Arus kas",        label:"Pembayaran dividen kas — Perusahaan"}
];
var UNITS = {juta:1e6, miliar:1e9, triliun:1e12};
var K1="fsa_bs_klbf_s1", K2="fsa_bs_klbf_s2", K3="fsa_bs_klbf_s3", K4="fsa_bs_klbf_s4", K5="fsa_bs_klbf_s5";
function load(k){ try{ var v=JSON.parse(localStorage.getItem(k)); return v||null; }catch(e){ return null; } }
function save(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
var st1=load(K1), st2=load(K2), st3=load(K3), st4=load(K4), st5=load(K5);

/* ---------- nilai ternormalisasi (Rupiah penuh) ---------- */
function F(k){
  var r = st2 && st2.figures ? st2.figures[k] : null;
  if(!r || r.nd) return {nd:true};
  var num = parseIDNumber(r.v, false);
  if(isNaN(num)) return {nd:true, bad:true};
  return {nd:false, rp:num*(UNITS[r.unit||"juta"]||1e6), unit:r.unit||"juta", basis:r.basis||"konsolidasi", page:r.page||""};
}
function allOk(){ // semua baris terisi atau nd
  if(!st2 || !st2.figures) return false;
  return ROWS.every(function(rw){ var f=st2.figures[rw.k]; return f && (f.nd || String(f.v||"").trim()!==""); });
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
    $("#s1-a").value=st1.a||""; $("#s1-b").value=st1.b||"";
    $("#s1-c").value=st1.c||""; $("#s1-read").checked=!!st1.read;
  }
  b.addEventListener("click",function(){
    var a=$("#s1-a").value.trim(), bb=$("#s1-b").value.trim(), c=$("#s1-c").value.trim();
    var read=$("#s1-read").checked;
    if(!a||!bb||!c){ alert("Isi ketiga kolom dulu (menarik / membingungkan / 1 pertanyaan) — ini latihan membaca, bukan formalitas."); return; }
    if(!read){ alert("Centang 'Saya sudah membaca LK-nya' dulu. Honor system — tapi jujur ke diri sendiri."); return; }
    st1={a:a,b:bb,c:c,read:true,ts:Date.now()}; save(K1,st1);
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
  return "<tr data-k='"+rw.k+"'>"+
    "<td style='min-width:11rem'><strong>"+esc(rw.label)+"</strong><br><span style='font-size:.75rem;color:var(--ink-soft)'>"+esc(rw.sec)+"</span></td>"+
    "<td><input class='bs-v' data-f='"+rw.k+"' type='text' inputmode='decimal' placeholder='mis. 48.500' value='"+esc(s.v||"")+"' style='min-width:8rem'></td>"+
    "<td><input class='bs-page' data-f='"+rw.k+"' type='text' placeholder='hal./cat.' value='"+esc(s.page||"")+"' style='min-width:6rem'></td>"+
    "<td>"+sel("bs-period",["FY2024","FY2023"],s.period||"FY2024")+"</td>"+
    "<td>"+sel("bs-unit",["juta","miliar","triliun"],s.unit||"juta")+"</td>"+
    "<td>"+sel("bs-ccy",["Rp","USD"],s.ccy||"Rp")+"</td>"+
    "<td>"+sel("bs-basis",["konsolidasi","induk"],s.basis||"konsolidasi")+"</td>"+
    "<td style='text-align:center'><input class='bs-nd' data-f='"+rw.k+"' type='checkbox'"+(s.nd?" checked":"")+" title='tidak diungkapkan'></td>"+
  "</tr>";
}
function initL2(){
  var box=$("#fig-tbody"); if(!box) return;
  box.innerHTML=ROWS.map(function(rw){ return rowHTML(rw, st2&&st2.figures?st2.figures[rw.k]:null); }).join("");
  $$(".bs-nd").forEach(function(cb){
    cb.addEventListener("change",function(){
      var k=cb.getAttribute("data-f");
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
      if(!nd && v===""){ errs.push(rw.label); return; }
      if(!nd && isNaN(parseIDNumber(v,false))){ errs.push(rw.label+" (format angka tidak valid)"); return; }
      figs[k]={v:v, nd:nd,
        page:$(".bs-page[data-f='"+k+"']").value.trim(),
        period:$(".bs-period[data-f='"+k+"']").value,
        unit:$(".bs-unit[data-f='"+k+"']").value,
        ccy:$(".bs-ccy[data-f='"+k+"']").value,
        basis:$(".bs-basis[data-f='"+k+"']").value};
    });
    if(errs.length){
      alert("Belum bisa lanjut — "+errs.length+" baris bermasalah:\n• "+errs.slice(0,6).join("\n• ")+(errs.length>6?"\n…dan "+(errs.length-6)+" lagi":"")+"\n\nBaris kosong WAJIB dicentang 'tidak diungkapkan'.");
      return;
    }
    st2={figures:figs,done:true,ts:Date.now()}; save(K2,st2);
    $("#s2-ok").textContent="✓ "+ROWS.length+" baris tersimpan. Lanjut ke langkah 3 — cek mekanis.";
    refreshSteps();
  });
}

/* ---------- L3: 8 cek mekanis ---------- */
function chkRow(id,name,st,detail,hint){
  return {id:id,name:name,st:st,detail:detail,hint:hint};
}
function runChecks(){
  var out=[];
  var A=F("assets"),L=F("liab"),E=F("equity");
  if(A.nd||L.nd||E.nd) out.push(chkRow("C1","Neraca balance","DILEWATI","salah satu dari total aset / liabilitas / ekuitas tidak diungkapkan.","Lengkapi ketiganya, atau terima cek ini dilewati."));
  else{
    var exp=L.rp+E.rp, tol=Math.max(0.01*Math.abs(exp),1e9), d=Math.abs(A.rp-exp);
    out.push(chkRow("C1","Neraca balance", d<=tol?"LULUS":"GAGAL",
      "Aset "+fmtRp(A.rp)+" vs Liabilitas+Ekuitas "+fmtRp(exp)+" — selisih "+fmtRp(d)+" (tol "+fmtRp(tol)+").",
      "Cek satuan tiap baris; pastikan basis sama (konsolidasi vs induk)."));
  }
  var cb=F("cash_bs"),cf=F("cash_cf");
  if(cb.nd||cf.nd) out.push(chkRow("C2","Kas tie-out","DILEWATI","kas neraca / kas arus kas tidak diungkapkan.","—"));
  else{
    var tol2=Math.max(0.01*Math.abs(cb.rp),1e9), d2=Math.abs(cb.rp-cf.rp);
    out.push(chkRow("C2","Kas tie-out", d2<=tol2?"LULUS":"GAGAL",
      "Kas neraca "+fmtRp(cb.rp)+" vs kas arus kas "+fmtRp(cf.rp)+" — selisih "+fmtRp(d2)+".",
      "Dua laporan harus sepakat soal kas. Beda = salah salin atau salah periode."));
  }
  var rs=F("re_start"),re=F("re_end"),ni=F("ni_attr"),dv=F("div");
  if(rs.nd||re.nd||ni.nd) out.push(chkRow("C3","Laba ditahan walk","DILEWATI","saldo laba awal / akhir / laba bersih tidak diungkapkan.","—"));
  else if(dv.nd) out.push(chkRow("C3","Laba ditahan walk","DILEWATI","dividen tidak diungkapkan — walk butuh dividen.","Isi dividen bila ada di LK, atau terima cek ini dilewati."));
  else{
    var exp3=rs.rp+ni.rp-dv.rp, tol3=Math.max(0.01*Math.abs(re.rp),1e9), d3=Math.abs(re.rp-exp3);
    out.push(chkRow("C3","Laba ditahan walk", d3<=tol3?"LULUS":"GAGAL",
      "RE akhir "+fmtRp(re.rp)+" vs RE awal + NI − dividen = "+fmtRp(exp3)+" — selisih "+fmtRp(d3)+".",
      "Butuh saldo laba AWAL + dividen. Selisih kecil bisa dari apropriasi cadangan."));
  }
  var rv=F("rev");
  var mIn=$("#c4-margin").value.trim(), mT=parseIDNumber(mIn,true);
  if(mIn===""||isNaN(mT)) out.push(chkRow("C4","Net margin hitung-sendiri","DILEWATI","kamu belum mengetik hasil hitungan tanganmu.","Ketik net margin hasil hitunganmu (dalam %) di kolom di atas, lalu jalankan ulang."));
  else if(rv.nd||ni.nd) out.push(chkRow("C4","Net margin hitung-sendiri","DILEWATI","pendapatan / laba bersih tidak diungkapkan.","—"));
  else{
    var mc=ni.rp/rv.rp*100;
    out.push(chkRow("C4","Net margin hitung-sendiri", Math.abs(mc-mT)<=0.5?"LULUS":"GAGAL",
      "Hitungan situs: "+mc.toFixed(2).replace(".",",")+"% vs ketikanmu: "+mT.toString().replace(".",",")+"%.",
      "Hitung ulang: laba bersih ÷ pendapatan. Ini menguji aritmetikamu, bukan situs."));
  }
  var rIn=$("#c5-roe").value.trim(), rT=parseIDNumber(rIn,true);
  if(rIn===""||isNaN(rT)) out.push(chkRow("C5","ROE hitung-sendiri","DILEWATI","kamu belum mengetik hasil hitungan tanganmu.","Ketik ROE hasil hitunganmu (dalam %) di kolom di atas, lalu jalankan ulang."));
  else if(ni.nd||E.nd) out.push(chkRow("C5","ROE hitung-sendiri","DILEWATI","laba bersih / ekuitas tidak diungkapkan.","—"));
  else{
    var rc=ni.rp/E.rp*100;
    out.push(chkRow("C5","ROE hitung-sendiri", Math.abs(rc-rT)<=0.5?"LULUS":"GAGAL",
      "Hitungan situs: "+rc.toFixed(2).replace(".",",")+"% vs ketikanmu: "+rT.toString().replace(".",",")+"%.",
      "Definisi di sini: laba atribusional ÷ ekuitas akhir. Benchmark headline memakai rata-rata — lihat langkah 5."));
  }
  var flags=[];
  if(!rv.nd&&!ni.nd&&rv.rp>0&&ni.rp>0&&rv.rp/ni.rp>10000) flags.push("pendapatan ÷ laba = "+fmtID(rv.rp/ni.rp)+"× — tidak wajar, curigai salah satuan (juta vs miliar vs triliun).");
  [["rev","ni_attr","Pendapatan","Laba bersih"],["assets","equity","Total aset","Total ekuitas"],["cfo","ni_total","CFO","Laba bersih (total)"]].forEach(function(p){
    var x=F(p[0]),y=F(p[1]);
    if(!x.nd&&!y.nd&&x.rp===0&&y.rp>0) flags.push(p[2]+" = 0 sementara "+p[3]+" > 0 — curigai salah satuan atau salah salin.");
  });
  out.push(chkRow("C6","Jebakan satuan", flags.length?"GAGAL":"LULUS",
    flags.length?flags.join(" "):"tidak ada anomali satuan terdeteksi.",
    "Kemungkinan salah satuan (juta vs miliar). Cek kolom satuanmu."));
  var bases={};
  ROWS.forEach(function(rw){ var f=F(rw.k); if(!f.nd&&!f.bad) bases[f.basis]=bases[f.basis]||[]; if(!f.nd&&!f.bad) bases[f.basis].push(rw.label); });
  var bk=Object.keys(bases);
  out.push(chkRow("C7","Campur basis", bk.length>1?"GAGAL":"LULUS",
    bk.length>1?("basis campur: "+bk.map(function(b){return b+" ("+bases[b].length+" baris)";}).join(", ")):"semua baris satu basis.",
    "Jangan campur basis dalam satu analisis (konsolidasi vs induk)."));
  var withPage=ROWS.filter(function(rw){ var f=F(rw.k); return !f.nd&&f.page!==""; }).length;
  out.push(chkRow("C8","Kelengkapan sumber","INFO","Disiplin sumbermu: "+withPage+"/"+ROWS.length+" baris mencantumkan halaman/catatan.",
    "Bukan nilai — cerminan disiplin. Analis yang baik selalu bisa menunjuk 'angka ini dari halaman sekian'."));
  return out;
}
function extraRatios(){
  var rv=F("rev"),gr=F("gross"),ni=F("ni_attr"),A=F("assets"),L=F("liab"),E=F("equity"),ca=F("ca"),cl=F("cl");
  function pct(x,y){ return (!x.nd&&!y.nd&&y.rp!==0)?(x.rp/y.rp*100).toFixed(1).replace(".",",")+"%":"—"; }
  function x(x2,y2){ return (!x2.nd&&!y2.nd&&y2.rp!==0)?(x2.rp/y2.rp).toFixed(2).replace(".",",")+"×":"—"; }
  return [
    ["Gross margin",pct(gr,rv)],["Net margin (atribusional)",pct(ni,rv)],
    ["ROA",pct(ni,A)],["Current ratio",x(ca,cl)],["D/E (total)",x(L,E)]
  ];
}
function initL3(){
  var b=$("#s3-run"); if(!b) return;
  if(st3&&st3.c4) $("#c4-margin").value=st3.c4;
  if(st3&&st3.c5) $("#c5-roe").value=st3.c5;
  function render(){
    var checks=runChecks();
    var box=$("#check-results");
    box.innerHTML=checks.map(function(c){
      var badge=c.st==="LULUS"?"<span class='ck ok'>LULUS</span>":c.st==="GAGAL"?"<span class='ck bad'>GAGAL</span>":c.st==="INFO"?"<span class='ck info'>INFO</span>":"<span class='ck skip'>DILEWATI</span>";
      return "<div class='ck-row "+c.st.toLowerCase()+"'>"+badge+
        "<div><strong>"+c.id+" — "+esc(c.name)+"</strong><br><span class='ck-det'>"+esc(c.detail)+"</span>"+
        (c.hint&&c.hint!=="—"?"<br><span class='ck-hint'>💡 "+esc(c.hint)+"</span>":"")+"</div></div>";
    }).join("");
    var ex=extraRatios();
    $("#extra-ratios").innerHTML="<strong>Rasio dari angkamu (display, bukan cek):</strong> "+
      ex.map(function(e){return esc(e[0])+": <span class='mono'>"+esc(e[1])+"</span>";}).join(" · ");
  }
  if(st3&&st3.ran) render();
  b.addEventListener("click",function(){
    render();
    st3={ran:true,checks:runChecks().map(function(c){return {id:c.id,st:c.st};}),c4:$("#c4-margin").value.trim(),c5:$("#c5-roe").value.trim(),ts:Date.now()};
    save(K3,st3);
    $("#s3-ok").textContent="✓ Cek mekanis dijalankan. GAGAL = informasi, bukan nilai — perbaiki inputmu atau catat sebagai temuan. Lanjut ke langkah 4.";
    refreshSteps();
  });
}

/* ---------- L4 ---------- */
var LENSES=[
 {k:"inv", t:"Lensa investasi", q:"Apakah modal yang ditanam menghasilkan return yang layak? Tulis SATU bukti yang MENGUATKAN dan SATU yang MEMATAHKAN, beserta angkanya (dari langkah 2)."},
 {k:"cred",t:"Lensa kredit", q:"Mampukah perusahaan membayar utang-utangnya dari kas operasinya? Bukti penguat + pematah + angka."},
 {k:"foren",t:"Lensa forensik", q:"Satu hal yang paling ingin kamu investigasi lebih jauh — dan pertanyaan apa yang kamu ajukan? (Bukan vonis. Red flag = pertanyaan.)"}
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
  if(window.KLBF_BENCH){ cb(); return; }
  var s=document.createElement("script");
  s.src="../data/klbf-benchmark.js";
  s.onload=cb;
  s.onerror=function(){ alert("Gagal memuat file benchmark. Cek koneksi / path ../data/klbf-benchmark.js"); };
  document.head.appendChild(s);
}
function srcCell(b){
  if(b.page==="—") return "terhitung";
  return "LK hal. "+b.page+(b.note&&b.note!=="—"?", cat. "+b.note:"");
}
function renderL5(){
  var B=window.KLBF_BENCH; if(!B) return;
  var rows=ROWS.map(function(rw){
    var f=F(rw.k), b=B.rows[rw.k];
    if(!b) return "";
    var mine, delta, cls="";
    if(f.nd){ mine="<em>tidak diungkapkan</em>"; delta="—"; }
    else{
      mine=fmtRp(f.rp);
      var d=(f.rp-b.v)/Math.abs(b.v)*100;
      delta=(d>=0?"+":"")+d.toFixed(1).replace(".",",")+"%";
      if(Math.abs(d)>1) cls=" class='diverge'";
    }
    return "<tr"+cls+"><td>"+esc(rw.label)+"</td><td class='mono'>"+mine+"</td><td class='mono'>"+fmtRp(b.v)+"</td><td class='mono'>"+delta+"</td><td>"+esc(srcCell(b))+"</td></tr>";
  }).join("");
  var rv=F("rev"),ni=F("ni_attr"),E=F("equity");
  function rrow(label,mineV,bV,formula){
    var mine,delta,cls="";
    if(mineV==null){ mine="<em>—</em>"; delta="—"; }
    else{ mine=(mineV*100).toFixed(2).replace(".",",")+"%";
      var d=(mineV-bV)/Math.abs(bV)*100; delta=(d>=0?"+":"")+d.toFixed(1).replace(".",",")+"%";
      if(Math.abs(d)>1) cls=" class='diverge'"; }
    return "<tr"+cls+"><td>"+esc(label)+"</td><td class='mono'>"+mine+"</td><td class='mono'>"+(bV*100).toFixed(2).replace(".",",")+"%</td><td class='mono'>"+delta+"</td><td>"+esc(formula)+"</td></tr>";
  }
  var nmMine=(!rv.nd&&!ni.nd&&rv.rp!==0)?ni.rp/rv.rp:null;
  var reMine=(!ni.nd&&!E.nd&&E.rp!==0)?ni.rp/E.rp:null;
  rows+=rrow("Net margin (atribusional)",nmMine,B.ratios.net_margin.v,"ni_attr ÷ rev")
       +rrow("ROE (ekuitas akhir)",reMine,B.ratios.roe_end.v,"ni_attr ÷ ekuitas akhir")
       +rrow("ROE (rata-rata — headline analis)",null,B.ratios.roe_avg.v,"ni_attr ÷ rata-rata ekuitas pemilik induk");
  $("#div-table").innerHTML=rows;
  var an=$("#analyst");
  an.innerHTML="<div class='honest'><strong>⚠️ Satu interpretasi analis — bukan jawaban benar.</strong> "+
    "Tiga paragraf di bawah adalah cara analis membaca angka KLBF 2024. Bandingkan dengan jawaban blind-mu: "+
    "di mana kamu menyimpang, angka apa yang terlewat, pertanyaan lensa mana yang paling sulit?</div>"+
    [["Lensa investasi",B.analyst.inv],["Lensa kredit",B.analyst.cred],["Lensa forensik",B.analyst.foren]].map(function(p){
      return "<h3>"+esc(p[0])+"</h3><p>"+esc(p[1])+"</p>";
    }).join("")+
    "<h3>Red flags — sebagai pertanyaan, bukan vonis</h3><ol>"+
    B.redflags.map(function(r){return "<li>"+esc(r)+"</li>";}).join("")+"</ol>";
  if(st5&&st5.reflect) $("#reflect").value=st5.reflect;
  $("#l5-content").style.display="block";
  $("#l5-gate").style.display="none";
}
function excerpt(t,n){ t=String(t||"").trim(); return t.length>n?t.slice(0,n)+"…":t; }
function buildLembar(){
  var B=window.KLBF_BENCH;
  var d=new Date(st1.ts); var tgl=d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
  var rv=F("rev"),ni=F("ni_attr"),E=F("equity"),cfo=F("cfo"),nit=F("ni_total");
  var aruskas="data tidak diungkapkan";
  if(!cfo.nd&&!nit.nd&&nit.rp!==0){
    aruskas="CFO "+fmtRp(cfo.rp)+" (angkaku) vs laba bersih "+fmtRp(nit.rp)+" (angkaku) → konversi kas "+(cfo.rp/nit.rp*100).toFixed(0).replace(".",",")+"% (CFO ÷ laba).";
  }
  var L="LEMBAR BEDAH — "+B.meta.emiten+" ("+B.meta.ticker+") · "+B.meta.periode+"\n"+
    "Dibaca: "+tgl+" · Basis: "+B.meta.basis+" · Sumber: LK auditan 2024\n"+B.meta.filing_url+"\n\n"+
    "VERDICT 5 BARIS:\n"+
    "1. VONIS: "+st4.vonis+"\n"+
    "2. Kualitas laba: "+excerpt(st4.lenses.inv,280)+"\n"+
    "3. Kesehatan neraca: "+excerpt(st4.lenses.cred,280)+"\n"+
    "4. Arus kas: "+aruskas+"\n"+
    "5. Pertanyaan terbuka: "+excerpt(st4.lenses.foren,280)+"\n\n"+
    "LENSA INVESTASI:\n"+st4.lenses.inv+"\n\n"+
    "LENSA KREDIT:\n"+st4.lenses.cred+"\n\n"+
    "LENSA FORENSIK:\n"+st4.lenses.foren+"\n\n"+
    "DIVERGENSI vs BENCHMARK (Δ > 1% disorot di web):\n";
  ROWS.forEach(function(rw){
    var f=F(rw.k), b=B.rows[rw.k]; if(!b) return;
    if(f.nd){ L+="• "+rw.label+": tidak kuungkapkan vs benchmark "+fmtRp(b.v)+" ("+srcCell(b)+")\n"; return; }
    var dlt=(f.rp-b.v)/Math.abs(b.v)*100;
    L+="• "+rw.label+": angkaku "+fmtRp(f.rp)+" vs benchmark "+fmtRp(b.v)+" (Δ "+(dlt>=0?"+":"")+dlt.toFixed(1).replace(".",",")+"%), "+srcCell(b)+"\n";
  });
  var nmMine=(!rv.nd&&!ni.nd&&rv.rp!==0)?ni.rp/rv.rp:null;
  var reMine=(!ni.nd&&!E.nd&&E.rp!==0)?ni.rp/E.rp:null;
  if(nmMine!=null) L+="• Net margin (atribusional): angkaku "+(nmMine*100).toFixed(2).replace(".",",")+"% vs benchmark "+(B.ratios.net_margin.v*100).toFixed(2).replace(".",",")+"%\n";
  if(reMine!=null) L+="• ROE (ekuitas akhir): angkaku "+(reMine*100).toFixed(2).replace(".",",")+"% vs benchmark "+(B.ratios.roe_end.v*100).toFixed(2).replace(".",",")+"%\n";
  L+="\n—\nDibuat di FSA Lab · Bedah Sendiri (KLBF). Benchmark terverifikasi dari AR 2024 KLBF; interpretasi analis = satu interpretasi, bukan jawaban benar.";
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
    if(!confirm("Buka benchmark sekarang?\n\nJawaban tiga lensamu (langkah 4) akan DIKUNCI permanen — upaya blind-mu terjaga. Lanjut?")) return;
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
