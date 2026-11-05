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
/* ================= FSA Lab — Bedah Sendiri: BBRI (workflow L1–L5) =================
   parseIDNumber disalin byte-identik dari js/modul37.js (blok di atas file ini).
   Benchmark TIDAK ada di file ini — dimuat dinamis dari ../data/bbri-benchmark.js
   hanya saat langkah 5 dibuka. Namespace localStorage: fsa_bp_bbri_* (beda dari fsa_bs_*). */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function fmtID(n){ try{ return Math.round(n).toLocaleString("id-ID"); }catch(e){ return String(Math.round(n)); } }
function fmtJt(n){ return "Rp" + fmtID(n) + " jt"; }
function fmtPctID(x){ return x.toFixed(2).replace(".",",") + "%"; }

/* ---------- definisi baris input (L2): 33 pos ---------- */
var ROWS = [
 {k:"int_inc",  sec:"Laba rugi", label:"Pendapatan bunga"},
 {k:"int_exp",  sec:"Laba rugi", label:"Beban bunga"},
 {k:"nii",      sec:"Laba rugi", label:"Pendapatan bunga bersih / NII (terhitung = pendapatan − beban)"},
 {k:"prov_fee", sec:"Laba rugi", label:"Pendapatan provisi & komisi"},
 {k:"recoveries",sec:"Laba rugi",label:"Penerimaan kembali aset dihapusbukukan"},
 {k:"ga",       sec:"Laba rugi", label:"Beban umum & administrasi"},
 {k:"opex_other",sec:"Laba rugi",label:"Beban operasional lainnya"},
 {k:"op_profit",sec:"Laba rugi", label:"Laba operasional"},
 {k:"ppop",     sec:"Laba rugi", label:"PPoP — laba operasional sebelum pencadangan"},
 {k:"ckpn_exp", sec:"Laba rugi", label:"CKPN aset produktif (beban)"},
 {k:"pbt",      sec:"Laba rugi", label:"Laba sebelum pajak"},
 {k:"tax",      sec:"Laba rugi", label:"Beban pajak"},
 {k:"ni_total", sec:"Laba rugi", label:"Laba bersih"},
 {k:"patmi",    sec:"Laba rugi", label:"Laba bersih — diatribusikan ke pemilik entitas induk"},
 {k:"div",      sec:"Laba rugi", label:"Dividen kas didistribusikan"},
 {k:"loans_gross",sec:"Posisi keuangan",label:"Pinjaman diberikan — gross (sebelum CKPN)"},
 {k:"loans_gross_23",sec:"Posisi keuangan",label:"Pinjaman diberikan — gross 2023 (untuk rata-rata)"},
 {k:"ckpn_loan",sec:"Posisi keuangan",label:"CKPN pinjaman (cadangan di neraca)"},
 {k:"assets",   sec:"Posisi keuangan",label:"TOTAL ASET"},
 {k:"assets_23",sec:"Posisi keuangan",label:"Total aset 2023 (untuk rata-rata)"},
 {k:"giro",     sec:"Posisi keuangan",label:"Giro (simpanan nasabah)"},
 {k:"tabungan", sec:"Posisi keuangan",label:"Tabungan (simpanan nasabah)"},
 {k:"deposito", sec:"Posisi keuangan",label:"Deposito berjangka (simpanan nasabah)"},
 {k:"dpk",      sec:"Posisi keuangan",label:"Simpanan nasabah / DPK (terhitung = giro+tabungan+deposito)"},
 {k:"liab",     sec:"Posisi keuangan",label:"TOTAL LIABILITAS (terhitung = aset − ekuitas)"},
 {k:"equity",   sec:"Posisi keuangan",label:"TOTAL EKUITAS"},
 {k:"equity_attr",sec:"Posisi keuangan",label:"Ekuitas atribusional (pemilik entitas induk)"},
 {k:"equity_attr_23",sec:"Posisi keuangan",label:"Ekuitas atribusional 2023 (untuk rata-rata)"},
 {k:"nim", sec:"Rasio (ketik + definisi)", label:"NIM — ketik angka bank (%)", ratio:true, defhint:"definisi bank, mis. NII ÷ rata-rata aset produktif"},
 {k:"npl", sec:"Rasio (ketik + definisi)", label:"NPL gross — ketik angka bank (%)", ratio:true, defhint:"definisi bank, mis. kredit bermasalah (kol. 3–5) ÷ total kredit"},
 {k:"ldr", sec:"Rasio (ketik + definisi)", label:"LDR — ketik angka bank (%)", ratio:true, defhint:"definisi bank — LDR atau LFR? catat yang kamu pakai"},
 {k:"car", sec:"Rasio (ketik + definisi)", label:"CAR — ketik angka bank (%)", ratio:true, defhint:"definisi bank, mis. total modal ÷ ATMR"},
 {k:"casa",sec:"Rasio (ketik + definisi)", label:"CASA — ketik hitunganmu (%)", ratio:true, defhint:"definisimu, mis. (giro+tabungan) ÷ DPK"}
];
var RATIO_KEYS = ["nim","npl","ldr","car","casa"];
var UNITS = {juta:1e6, miliar:1e9, triliun:1e12};
var K1="fsa_bp_bbri_s1", K2="fsa_bp_bbri_s2", K3="fsa_bp_bbri_s3", K4="fsa_bp_bbri_s4", K5="fsa_bp_bbri_s5";
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
    if(rw.ratio && String(f.def||"").trim()==="") return false;
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
    ["a","b","c","npl","ckpn","car"].forEach(function(f){ var el=$("#s1-"+f); if(el) el.value=st1[f]||""; });
    $("#s1-read").checked=!!st1.read;
  }
  b.addEventListener("click",function(){
    var v={}, bad=[];
    ["a","b","c"].forEach(function(f){ v[f]=$("#s1-"+f).value.trim(); if(!v[f]) bad.push(f); });
    [["npl","halaman NPL gross"],["ckpn","halaman CKPN"],["car","halaman CAR"]].forEach(function(p){
      v[p[0]]=$("#s1-"+p[0]).value.trim(); if(!v[p[0]]) bad.push(p[1]);
    });
    var read=$("#s1-read").checked;
    if(bad.length){ alert("Belum bisa lanjut — kosong:\n• "+bad.join("\n• ")+"\n\nTugas baca bank: temukan NPL gross, CKPN, CAR dan catat halamannya."); return; }
    if(!read){ alert("Centang 'Saya sudah membaca' dulu. Honor system — tapi jujur ke diri sendiri."); return; }
    st1={a:v.a,b:v.b,c:v.c,npl:v.npl,ckpn:v.ckpn,car:v.car,read:true,ts:Date.now()}; save(K1,st1);
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
  if(rw.ratio){
    return head+
    "<td><input class='bs-v' data-f='"+rw.k+"' type='text' inputmode='decimal' placeholder='mis. 6,50' value='"+esc(s.v||"")+"' style='max-width:7rem'> <span style='font-size:.8rem'>%</span></td>"+
    "<td colspan='5'><input class='bs-def' data-f='"+rw.k+"' type='text' placeholder='"+esc(rw.defhint||"definisi yang saya pakai…")+"' value='"+esc(s.def||"")+"' style='width:100%'></td>"+
    "<td style='text-align:center'><input class='bs-nd' data-f='"+rw.k+"' type='checkbox'"+(s.nd?" checked":"")+" title='tidak diungkapkan'></td></tr>";
  }
  return head+
    "<td><input class='bs-v' data-f='"+rw.k+"' type='text' inputmode='decimal' placeholder='mis. 130.000' value='"+esc(s.v||"")+"' style='min-width:8rem'></td>"+
    "<td><input class='bs-page' data-f='"+rw.k+"' type='text' placeholder='hal./cat.' value='"+esc(s.page||"")+"' style='min-width:6rem'></td>"+
    "<td>"+sel("bs-period",["FY2024","FY2023"],s.period||"FY2024")+"</td>"+
    "<td>"+sel("bs-unit",["juta","miliar","triliun"],s.unit||"miliar")+"</td>"+
    "<td>"+sel("bs-ccy",["Rp","USD"],s.ccy||"Rp")+"</td>"+
    "<td>"+sel("bs-basis",["konsolidasi","induk"],s.basis||"konsolidasi")+"</td>"+
    "<td style='text-align:center'><input class='bs-nd' data-f='"+rw.k+"' type='checkbox'"+(s.nd?" checked":"")+" title='tidak diungkapkan'></td></tr>";
}
function initL2(){
  var box=$("#fig-tbody"); if(!box) return;
  box.innerHTML=ROWS.map(function(rw){ return rowHTML(rw, st2&&st2.figures?st2.figures[rw.k]:null); }).join("");
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
      if(isNaN(parseIDNumber(v, !!rw.ratio))){ errs.push(rw.label+" (format angka tidak valid)"); return; }
      var rec={v:v, nd:false};
      if(rw.ratio){
        rec.def=$(".bs-def[data-f='"+k+"']").value.trim();
        if(!rec.def) errs.push(rw.label+" (definisi wajib diisi — rasio bank = kontrak definisi)");
      }else{
        rec.page=$(".bs-page[data-f='"+k+"']").value.trim();
        rec.period=$(".bs-period[data-f='"+k+"']").value;
        rec.unit=$(".bs-unit[data-f='"+k+"']").value;
        rec.ccy=$(".bs-ccy[data-f='"+k+"']").value;
        rec.basis=$(".bs-basis[data-f='"+k+"']").value;
      }
      figs[k]=rec;
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

/* ---------- L3: 10 cek mekanis bank ---------- */
function chkRow(id,name,st,detail,hint,extra){
  return {id:id,name:name,st:st,detail:detail,hint:hint,extra:extra||""};
}
function ndAny(){ for(var i=0;i<arguments.length;i++){ if(arguments[i].nd) return true; } return false; }
function runChecks(){
  var out=[];
  /* B1: NII aritmetika */
  var ii=F("int_inc"), ie=F("int_exp"), nii=F("nii");
  if(ndAny(ii,ie,nii)) out.push(chkRow("B1","NII aritmetika","DILEWATI","pendapatan/beban bunga / NII tidak diungkapkan.","—"));
  else{
    var e1=ii.jt-ie.jt, t1=Math.max(0.01*Math.abs(e1),1000), d1=Math.abs(nii.jt-e1);
    out.push(chkRow("B1","NII aritmetika", d1<=t1?"LULUS":"GAGAL",
      "NII "+fmtJt(nii.jt)+" vs pendapatan − beban = "+fmtJt(e1)+" — selisih "+fmtJt(d1)+".",
      "NII = bunga masuk − bunga keluar. Curigai salah satuan (filing dalam jutaan, input default miliar)."));
  }
  /* B2: PPoP identitas */
  var pp=F("ppop"), op=F("op_profit"), ce=F("ckpn_exp");
  if(ndAny(pp,op,ce)) out.push(chkRow("B2","PPoP identitas","DILEWATI","PPoP / laba operasional / CKPN tidak diungkapkan.","—"));
  else{
    var e2=op.jt+ce.jt, t2=0.05*Math.abs(e2), d2=Math.abs(pp.jt-e2);
    out.push(chkRow("B2","PPoP identitas", d2<=t2?"LULUS":"GAGAL",
      "PPoP "+fmtJt(pp.jt)+" vs laba operasional + CKPN = "+fmtJt(e2)+" — selisih "+(d2/e2*100).toFixed(1).replace(".",",")+"%.",
      "PPoP = pendapatan operasional − beban operasional, SEBELUM CKPN. Bank bisa memakai definisi sedikit berbeda — selisih definisi = bahan pertanyaan forensik, bukan kegagalanmu.",
      "INFO: bank mengungkap PPoP yang sedikit berbeda dari identitas 'laba operasional + CKPN' — definisi bank vs definisi umum tidak selalu sama."));
  }
  /* B3: NIM definisi */
  var nim=FR("nim");
  if(nim.nd) out.push(chkRow("B3","NIM — definisi","DILEWATI","NIM tidak diungkapkan / tidak diketik.","Ketik angka NIM bank + definisinya di langkah 2."));
  else{
    var dl=(nim.def||"").toLowerCase();
    var okP=nim.v>0&&nim.v<30, okD=dl.indexOf("rata-rata")>=0||dl.indexOf("rata rata")>=0;
    out.push(chkRow("B3","NIM — definisi", (okP&&okD)?"LULUS":"GAGAL",
      "Ketikanmu: "+fmtPctID(nim.v)+" · definisimu: \""+nim.def+"\". Nilai vs bank dibandingkan di langkah 5.",
      "NIM pakai RATA-RATA aset produktif, bukan total aset akhir. Lihat M30+M38. Definisi wajib menyebut 'rata-rata'."));
  }
  /* B4: CASA */
  var g=F("giro"), tb=F("tabungan"), dpk=F("dpk"), casa=FR("casa");
  if(ndAny(g,tb,dpk)) out.push(chkRow("B4","CASA aritmetika","DILEWATI","giro / tabungan / DPK tidak diungkapkan.","—"));
  else if(casa.nd) out.push(chkRow("B4","CASA aritmetika","DILEWATI","kamu belum mengetik CASA di langkah 2.","Ketik CASA hasil hitunganmu di baris rasio langkah 2."));
  else{
    var c4=(g.jt+tb.jt)/dpk.jt*100;
    out.push(chkRow("B4","CASA aritmetika", Math.abs(c4-casa.v)<=0.5?"LULUS":"GAGAL",
      "Hitungan situs: "+fmtPctID(c4)+" vs ketikanmu: "+fmtPctID(casa.v)+".",
      "CASA = dana murah (giro+tabungan) ÷ total DPK. Deposito bukan CASA."));
  }
  /* B5: NPL gross definisi */
  var npl=FR("npl");
  if(npl.nd) out.push(chkRow("B5","NPL gross — definisi","DILEWATI","NPL tidak diungkapkan / tidak diketik.","—"));
  else{
    var dl5=(npl.def||"").toLowerCase();
    var okP5=npl.v>0&&npl.v<15, okD5=dl5.indexOf("gross")>=0;
    out.push(chkRow("B5","NPL gross — definisi", (okP5&&okD5)?"LULUS":"GAGAL",
      "Ketikanmu: "+fmtPctID(npl.v)+" · definisimu: \""+npl.def+"\". Nilai vs bank dibandingkan di langkah 5.",
      "Bank menonjolkan angka yang kecil — pastikan definisimu menyebut GROSS (kredit bermasalah ÷ total kredit, bukan net)."));
  }
  /* B6: coverage (display) */
  var cl=F("ckpn_loan"), lg=F("loans_gross");
  if(ndAny(cl,lg)||npl.nd) out.push(chkRow("B6","Coverage","DILEWATI","CKPN pinjaman / kredit gross / NPL tidak lengkap.","—"));
  else{
    var cov=cl.jt/(npl.v/100*lg.jt)*100;
    out.push(chkRow("B6","Coverage","INFO",
      "CKPN ÷ (NPL% × kredit gross) = "+fmtPctID(cov)+" dari angkamu.",
      "Coverage turun + NPL naik = dua sinyal merah, bukan satu. Bandingkan dengan angka bank di langkah 5."));
  }
  /* B7: LDR — jebakan definisi (BUKAN GAGAL untuk selisih definisi) */
  var ldr=FR("ldr");
  if(ndAny(lg,dpk)) out.push(chkRow("B7","LDR — jebakan definisi","DILEWATI","kredit gross / DPK tidak diungkapkan.","—"));
  else if(ldr.nd) out.push(chkRow("B7","LDR — jebakan definisi","DILEWATI","kamu belum mengetik LDR di langkah 2.","—"));
  else{
    var naive=lg.jt/dpk.jt*100, dl7=Math.abs(naive-ldr.v);
    if(dl7<=1) out.push(chkRow("B7","LDR — jebakan definisi","LULUS",
      "Ketikanmu "+fmtPctID(ldr.v)+" cocok dengan kredit ÷ DPK = "+fmtPctID(naive)+" dari inputmu.",
      "LDR = kredit ÷ DPK. LFR memasukkan surat berharga — catat mana yang dipakai bank.",
      "INFO: bank mengungkap angka LDR yang BERBEDA di press conference — definisinya tidak sama dengan kredit÷DPK. Hitunganmu 95%-an BUKAN salah; ini jebakan definisi. Perbandingan lengkap di langkah 5."));
    else if(dl7<=10) out.push(chkRow("B7","LDR — jebakan definisi","INFO",
      "Ketikanmu "+fmtPctID(ldr.v)+" tidak sama dengan kredit ÷ DPK ("+fmtPctID(naive)+") dari inputmu — mungkin kamu memakai definisi bank.",
      "Pastikan kolom definisi di langkah 2 terisi. Perbandingan definisi lengkap di langkah 5."));
    else out.push(chkRow("B7","LDR — jebakan definisi","GAGAL",
      "Ketikanmu "+fmtPctID(ldr.v)+" jauh dari kredit ÷ DPK ("+fmtPctID(naive)+").",
      "Cek aritmetika: kredit gross ÷ simpanan nasabah."));
  }
  /* B8: CAR definisi */
  var car=FR("car");
  if(car.nd) out.push(chkRow("B8","CAR — definisi","DILEWATI","CAR tidak diungkapkan / tidak diketik.","—"));
  else{
    var okP8=car.v>10&&car.v<40, okD8=String(car.def||"").trim().length>0;
    out.push(chkRow("B8","CAR — definisi", (okP8&&okD8)?"LULUS":"GAGAL",
      "Ketikanmu: "+fmtPctID(car.v)+" · definisimu: \""+car.def+"\". Nilai vs bank dibandingkan di langkah 5.",
      "CAR headline bisa menyanjung: cek porsi CET1 vs AT1+Tier2 di catatan permodalan — jangan puas dengan satu angka."));
  }
  /* B9: neraca balance */
  var A=F("assets"), L=F("liab"), E=F("equity");
  if(ndAny(A,L,E)) out.push(chkRow("B9","Neraca balance","DILEWATI","aset / liabilitas / ekuitas tidak diungkapkan.","—"));
  else{
    var e9=L.jt+E.jt, t9=Math.max(0.01*Math.abs(e9),1000), d9=Math.abs(A.jt-e9);
    out.push(chkRow("B9","Neraca balance", d9<=t9?"LULUS":"GAGAL",
      "Aset "+fmtJt(A.jt)+" vs Liabilitas+Ekuitas "+fmtJt(e9)+" — selisih "+fmtJt(d9)+".",
      "Cek satuan tiap baris; pastikan basis sama (konsolidasi vs induk)."));
  }
  /* B10: kelengkapan sumber + definisi (display) */
  var valRows=ROWS.filter(function(rw){return !rw.ratio;});
  var withPage=valRows.filter(function(rw){ var f=F(rw.k); return !f.nd&&f.page!==""; }).length;
  var withDef=RATIO_KEYS.filter(function(k){ var f=FR(k); return !f.nd&&String(f.def||"").trim()!==""; }).length;
  out.push(chkRow("B10","Kelengkapan sumber & definisi","INFO",
    "Disiplin sumbermu: "+withPage+"/"+valRows.length+" baris ber-halaman · "+withDef+"/"+RATIO_KEYS.length+" rasio ber-definisi.",
    "Bukan nilai — cerminan disiplin. Analis bank yang baik selalu bisa menunjuk 'angka ini dari halaman sekian, definisinya ini'."));
  return out;
}
function extraRatios(){
  var ce=F("ckpn_exp"), lg=F("loans_gross"), lg23=F("loans_gross_23");
  var ga=F("ga"), oo=F("opex_other"), nii=F("nii"), pf=F("prov_fee"), rc=F("recoveries");
  var pm=F("patmi"), ea=F("equity_attr"), ea23=F("equity_attr_23");
  var nt=F("ni_total"), A=F("assets"), A23=F("assets_23");
  var dv=F("div"), L=F("liab"), E=F("equity");
  function pct(x,y){ return (!x.nd&&!y.nd&&y.jt!==0)?(x.jt/y.jt*100).toFixed(2).replace(".",",")+"%":"—"; }
  function avg(a,b){ return (!a.nd&&!b.nd)?{nd:false,jt:(a.jt+b.jt)/2}:{nd:true}; }
  var avgL=avg(lg,lg23), avgE=avg(ea,ea23), avgA=avg(A,A23);
  return [
    ["CoC (CKPN ÷ rata-rata kredit)", (!ce.nd&&!avgL.nd&&avgL.jt!==0)?(ce.jt/avgL.jt*100).toFixed(2).replace(".",",")+"%":"—"],
    ["CIR (opex ÷ pendapatan operasional)", (!ga.nd&&!oo.nd&&!nii.nd&&!pf.nd&&!rc.nd&&(nii.jt+pf.jt+rc.jt)!==0)?((ga.jt+oo.jt)/(nii.jt+pf.jt+rc.jt)*100).toFixed(1).replace(".",",")+"%":"—"],
    ["ROE (PATMI ÷ rata-rata ekuitas atribusional)", (!pm.nd&&!avgE.nd&&avgE.jt!==0)?(pm.jt/avgE.jt*100).toFixed(2).replace(".",",")+"%":"—"],
    ["ROA (laba bersih ÷ rata-rata aset)", (!nt.nd&&!avgA.nd&&avgA.jt!==0)?(nt.jt/avgA.jt*100).toFixed(2).replace(".",",")+"%":"—"],
    ["DPR (dividen ÷ PATMI)", pct(dv,pm)],
    ["D/E", (!L.nd&&!E.nd&&E.jt!==0)?(L.jt/E.jt).toFixed(2).replace(".",",")+"×":"—"]
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
    $("#s3-ok").textContent="✓ 10 cek mekanis dijalankan. GAGAL = informasi, bukan nilai — perbaiki inputmu atau catat sebagai temuan. Lanjut ke langkah 4.";
    refreshSteps();
  });
}

/* ---------- L4: lensa bank-adapted ---------- */
var LENSES=[
 {k:"inv", t:"Lensa investasi", q:"Apakah return bank ini sepadan dengan risiko kredit yang diambil? Tulis SATU bukti yang MENGUATKAN (mis. NIM/CASA/ROE) dan SATU yang MEMATAHKAN (mis. tren CKPN/coverage/CoC), beserta angkanya dari langkah 2."},
 {k:"cred",t:"Lensa kredit", q:"Apakah CKPN cukup menutup NPL gross? Bagaimana TREN kualitas aset 2023→2024 (NPL, coverage)? Dan seberapa stabil pendanaannya (CASA, LDR)? Bukti penguat + pematah + angka."},
 {k:"foren",t:"Lensa forensik", q:"Satu hal tentang kualitas aset / permodalan yang paling ingin kamu investigasi — dan pertanyaan apa yang kamu ajukan? (Bukan vonis. Contoh pola: 'NPL turun tapi CKPN turun lebih cepat — kenapa?')"}
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
  if(window.BBRI_BENCH){ cb(); return; }
  var s=document.createElement("script");
  s.src="../data/bbri-benchmark.js";
  s.onload=cb;
  s.onerror=function(){ alert("Gagal memuat file benchmark. Cek koneksi / path ../data/bbri-benchmark.js"); };
  document.head.appendChild(s);
}
function srcCell(b){
  var tag=b.tag?" ["+b.tag+"]":"";
  if(b.page==="—") return "terhitung"+tag;
  if(b.page==="press") return "press conference 12 Feb 2025"+tag;
  return "LK hal. "+b.page+(b.note&&b.note!=="—"?", "+b.note:"")+tag;
}
var RATIO_MAP={nim:"nim",npl:"npl",ldr:"ldr",car:"car",casa:"casa"};
function renderL5(){
  var B=window.BBRI_BENCH; if(!B) return;
  var rows=ROWS.map(function(rw){
    var mine, delta, cls="", bench, src;
    if(rw.ratio){
      var f=FR(rw.k), b=B.ratios[RATIO_MAP[rw.k]];
      if(!b) return "";
      bench=(b.v).toFixed(2).replace(".",",")+"%";
      src=srcCell({page:"—",tag:b.tag,note:b.def});
      if(f.nd){ mine="<em>tidak diungkapkan</em>"; delta="—"; }
      else{
        mine=fmtPctID(f.v);
        var d=(f.v-b.v)/Math.abs(b.v)*100;
        delta=(d>=0?"+":"")+d.toFixed(1).replace(".",",")+"%";
        if(Math.abs(d)>1) cls=" class='diverge'";
      }
    }else{
      var f2=F(rw.k), b2=B.rows[rw.k];
      if(!b2) return "";
      bench=fmtJt(b2.v); src=srcCell(b2);
      if(f2.nd){ mine="<em>tidak diungkapkan</em>"; delta="—"; }
      else{
        mine=fmtJt(f2.jt);
        var d2=(f2.jt-b2.v)/Math.abs(b2.v)*100;
        delta=(d2>=0?"+":"")+d2.toFixed(1).replace(".",",")+"%";
        if(Math.abs(d2)>1) cls=" class='diverge'";
      }
    }
    return "<tr"+cls+"><td>"+esc(rw.label)+"</td><td class='mono'>"+mine+"</td><td class='mono'>"+bench+"</td><td class='mono'>"+delta+"</td><td>"+esc(src)+"</td></tr>";
  }).join("");
  $("#div-table").innerHTML=rows;
  /* tabel definisi resmi bank vs hitunganmu */
  var defRows=RATIO_KEYS.map(function(k){
    var b=B.ratios[RATIO_MAP[k]], f=FR(k);
    var mine=f.nd?"<em>tidak diungkapkan</em>":esc(f.def||"—");
    var lbl={nim:"NIM",npl:"NPL gross",ldr:"LDR",car:"CAR",casa:"CASA"}[k];
    return "<tr><td><strong>"+lbl+"</strong> ["+b.tag+"]</td><td>"+esc(b.def)+"</td><td>"+mine+"</td></tr>";
  }).join("");
  $("#def-table").innerHTML=defRows;
  var an=$("#analyst");
  an.innerHTML="<div class='honest'><strong>⚠️ Satu interpretasi analis — bukan jawaban benar.</strong> "+
    "Tiga paragraf di bawah adalah cara analis membaca angka BBRI 2024. Bandingkan dengan jawaban blind-mu: "+
    "di mana kamu menyimpang, angka apa yang terlewat, pertanyaan lensa mana yang paling sulit?</div>"+
    [["Lensa investasi",B.analyst.inv],["Lensa kredit",B.analyst.cred],["Lensa forensik",B.analyst.foren]].map(function(p){
      return "<h3>"+esc(p[0])+"</h3><p>"+esc(p[1])+"</p>";
    }).join("")+
    "<h3>Red flags — sebagai pertanyaan, bukan vonis</h3><ol>"+
    B.redflags.map(function(r){return "<li>"+esc(r)+"</li>";}).join("")+"</ol>"+
    "<div class='honest' style='margin-top:1.2rem'><strong>🏦 Callout jujur — valuasi bank bukan DCF.</strong> "+esc(B.callout)+"</div>";
  if(st5&&st5.reflect) $("#reflect").value=st5.reflect;
  $("#l5-content").style.display="block";
  $("#l5-gate").style.display="none";
}
function excerpt(t,n){ t=String(t||"").trim(); return t.length>n?t.slice(0,n)+"…":t; }
function buildLembar(){
  var B=window.BBRI_BENCH;
  var d=new Date(st1.ts); var tgl=d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
  var pm=F("patmi"), ce=F("ckpn_exp"), pp=F("ppop");
  var L="LEMBAR BEDAH — "+B.meta.emiten+" ("+B.meta.ticker+") · "+B.meta.periode+"\n"+
    "Dibaca: "+tgl+" · Basis: "+B.meta.basis+" · Sumber: "+B.meta.dokumen+"\n"+B.meta.filing_url+"\n\n"+
    "VERDICT 5 BARIS:\n"+
    "1. VONIS: "+st4.vonis+"\n"+
    "2. Kualitas laba: "+excerpt(st4.lenses.inv,280)+"\n"+
    "3. Kualitas aset & permodalan: "+excerpt(st4.lenses.cred,280)+"\n"+
    "4. Pendanaan: "+excerpt(st4.lenses.cred,280)+"\n"+
    "5. Pertanyaan terbuka: "+excerpt(st4.lenses.foren,280)+"\n\n"+
    "LENSA INVESTASI:\n"+st4.lenses.inv+"\n\n"+
    "LENSA KREDIT:\n"+st4.lenses.cred+"\n\n"+
    "LENSA FORENSIK:\n"+st4.lenses.foren+"\n\n"+
    "DEFINISI RESMI BANK vs DEFINISIKU:\n";
  RATIO_KEYS.forEach(function(k){
    var b=B.ratios[RATIO_MAP[k]], f=FR(k);
    var lbl={nim:"NIM",npl:"NPL gross",ldr:"LDR",car:"CAR",casa:"CASA"}[k];
    L+="• "+lbl+" ["+b.tag+"]: bank = \""+b.def+"\" | definisiku = \""+(f.nd?"tidak diungkapkan":f.def)+"\"\n";
  });
  L+="\nDIVERGENSI vs BENCHMARK (Δ > 1% disorot di web; [B]=diungkap bank, [T]=terhitung builder):\n";
  ROWS.forEach(function(rw){
    if(rw.ratio){
      var f=FR(rw.k), b=B.ratios[RATIO_MAP[rw.k]]; if(!b) return;
      if(f.nd){ L+="• "+rw.label+": tidak kuungkapkan vs benchmark "+fmtPctID(b.v)+" ["+b.tag+"]\n"; return; }
      var dlt=(f.v-b.v)/Math.abs(b.v)*100;
      L+="• "+rw.label+": angkaku "+fmtPctID(f.v)+" vs benchmark "+fmtPctID(b.v)+" (Δ "+(dlt>=0?"+":"")+dlt.toFixed(1).replace(".",",")+"%) ["+b.tag+"]\n";
      return;
    }
    var f2=F(rw.k), b2=B.rows[rw.k]; if(!b2) return;
    if(f2.nd){ L+="• "+rw.label+": tidak kuungkapkan vs benchmark "+fmtJt(b2.v)+(b2.tag?" ["+b2.tag+"]":"")+"\n"; return; }
    var dlt2=(f2.jt-b2.v)/Math.abs(b2.v)*100;
    L+="• "+rw.label+": angkaku "+fmtJt(f2.jt)+" vs benchmark "+fmtJt(b2.v)+" (Δ "+(dlt2>=0?"+":"")+dlt2.toFixed(1).replace(".",",")+"%)"+(b2.tag?" ["+b2.tag+"]":"")+"\n";
  });
  L+="\n—\nDibuat di FSA Lab · Bedah Sendiri (BBRI). Benchmark terverifikasi dari LK auditan FY2024 BBRI (filing IDX) + press conference 12 Feb 2025; interpretasi analis = satu interpretasi, bukan jawaban benar.";
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
