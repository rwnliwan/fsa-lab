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
/* ================= FSA Lab — Ujian Blind: BBCA Interim H1 2026 =================
   parseIDNumber disalin byte-identik dari js/modul37.js (blok di atas file ini).
   Benchmark TIDAK ada di file ini — dimuat dinamis dari data/bbca-benchmark.js
   hanya saat langkah 5 dibuka. Namespace localStorage: fsa_exam_bbca_*.
   Referensi Q1 di bawah = angka PUBLIK dari presentasi analis resmi bank (S2),
   bukan rahasia benchmark — learner memang ditugaskan menemukan filing Q1. */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function fmtID(n){ try{ return Math.round(n).toLocaleString("id-ID"); }catch(e){ return String(Math.round(n)); } }
function fmtJt(n){ return "Rp" + fmtID(n) + " jt"; }
function fmtPctID(x){ return x.toFixed(2).replace(".",",") + "%"; }

/* Referensi publik Q1 2026 (S2 — presentasi analis resmi bank). Dipakai untuk cek I1. */
var Q1 = { nii: 21100000, ni: 14700000, ckpn: 1500000 };

/* ---------- definisi baris input (L2): 35 pos ---------- */
var ROWS = [
 {k:"int_inc",  sec:"Laba rugi — H1 2026 (flow)", label:"Pendapatan bunga"},
 {k:"int_exp",  sec:"Laba rugi — H1 2026 (flow)", label:"Beban bunga"},
 {k:"nii",      sec:"Laba rugi — H1 2026 (flow)", label:"NII — pendapatan bunga bersih (terhitung = pendapatan − beban)"},
 {k:"nonint_inc",sec:"Laba rugi — H1 2026 (flow)",label:"Pendapatan bersih asuransi"},
 {k:"opex",     sec:"Laba rugi — H1 2026 (flow)", label:"Beban operasional"},
 {k:"ckpn_exp", sec:"Laba rugi — H1 2026 (flow)", label:"Beban CKPN (H1)"},
 {k:"pbt",      sec:"Laba rugi — H1 2026 (flow)", label:"Laba sebelum pajak"},
 {k:"tax",      sec:"Laba rugi — H1 2026 (flow)", label:"Beban pajak"},
 {k:"patmi",    sec:"Laba rugi — H1 2026 (flow)", label:"Laba bersih — atribusional pemilik induk"},
 {k:"div_paid", sec:"Laba rugi — H1 2026 (flow)", label:"Dividen kas dibayar (arus kas)"},
 {k:"loans_gross",sec:"Posisi keuangan — 30 Jun 2026 (stock)",label:"Kredit yang diberikan — gross (sebelum CKPN)"},
 {k:"ckpn_loan",sec:"Posisi keuangan — 30 Jun 2026 (stock)",label:"CKPN atas kredit (cadangan di neraca)"},
 {k:"assets",   sec:"Posisi keuangan — 30 Jun 2026 (stock)",label:"TOTAL ASET"},
 {k:"giro",     sec:"Posisi keuangan — 30 Jun 2026 (stock)",label:"Giro"},
 {k:"tabungan", sec:"Posisi keuangan — 30 Jun 2026 (stock)",label:"Tabungan"},
 {k:"deposito", sec:"Posisi keuangan — 30 Jun 2026 (stock)",label:"Deposito berjangka"},
 {k:"dpk",      sec:"Posisi keuangan — 30 Jun 2026 (stock)",label:"Total DPK (terhitung = giro+tabungan+deposito)"},
 {k:"liab",     sec:"Posisi keuangan — 30 Jun 2026 (stock)",label:"TOTAL LIABILITAS (terhitung = aset − ekuitas)"},
 {k:"equity",   sec:"Posisi keuangan — 30 Jun 2026 (stock)",label:"TOTAL EKUITAS"},
 {k:"cap_core", sec:"Posisi keuangan — 30 Jun 2026 (stock)",label:"Modal inti (Tier 1)"},
 {k:"rwa",      sec:"Posisi keuangan — 30 Jun 2026 (stock)",label:"ATMR"},
 {k:"cash_begin",sec:"Arus kas & ekuitas — konsistensi",label:"Kas awal periode (arus kas)"},
 {k:"cash_end", sec:"Arus kas & ekuitas — konsistensi",label:"Kas akhir periode (arus kas)"},
 {k:"cf_net",   sec:"Arus kas & ekuitas — konsistensi",label:"Kenaikan neto kas H1 (terhitung)"},
 {k:"cf_fx",    sec:"Arus kas & ekuitas — konsistensi",label:"Selisih kurs atas kas"},
 {k:"re_begin", sec:"Arus kas & ekuitas — konsistensi",label:"Saldo laba awal"},
 {k:"re_end",   sec:"Arus kas & ekuitas — konsistensi",label:"Saldo laba akhir"},
 {k:"q2_nii",   sec:"DERIVASI Q2 standalone (H1 − Q1)", label:"NII Q2 (= NII H1 − NII Q1)", deriv:true},
 {k:"q2_ni",    sec:"DERIVASI Q2 standalone (H1 − Q1)", label:"Laba bersih Q2 (= laba H1 − laba Q1)", deriv:true},
 {k:"q2_ckpn",  sec:"DERIVASI Q2 standalone (H1 − Q1)", label:"CKPN Q2 (= CKPN H1 − CKPN Q1)", deriv:true},
 {k:"nim", sec:"Rasio (ketik + definisi)", label:"NIM — ketik hitunganmu (%), konvensi annualisasi WAJIB dinyatakan", ratio:true, defhint:"mis. NII ×2 (H1→FY) ÷ rata-rata aset produktif"},
 {k:"npl", sec:"Rasio (ketik + definisi)", label:"NPL gross — ketik angka bank (%)", ratio:true, defhint:"definisi bank, mis. kredit bermasalah (kol. 3–5) ÷ total kredit"},
 {k:"ldr", sec:"Rasio (ketik + definisi)", label:"LDR — ketik angka bank (%)", ratio:true, defhint:"definisi bank — LDR atau LFR? catat yang kamu pakai"},
 {k:"casa",sec:"Rasio (ketik + definisi)", label:"CASA — ketik hitunganmu (%)", ratio:true, defhint:"definisimu, mis. (giro+tabungan) ÷ DPK"},
 {k:"car", sec:"Rasio (ketik + definisi)", label:"CAR — ketik angka bank (%)", ratio:true, defhint:"definisi bank, mis. total modal ÷ ATMR"}
];
var RATIO_KEYS = ["nim","npl","ldr","casa","car"];
var VAL_KEYS = ROWS.filter(function(r){return !r.ratio;}).map(function(r){return r.k;});
var UNITS = {juta:1e6, miliar:1e9, triliun:1e12};
var K0="fsa_exam_bbca_s0", K1="fsa_exam_bbca_s1", K2="fsa_exam_bbca_s2", K3="fsa_exam_bbca_s3",
    K4="fsa_exam_bbca_s4", K5="fsa_exam_bbca_s5", K6="fsa_exam_bbca_s6", K7="fsa_exam_bbca_s7";
function load(k){ try{ var v=JSON.parse(localStorage.getItem(k)); return v||null; }catch(e){ return null; } }
function save(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
var st0=load(K0), st1=load(K1), st2=load(K2), st3=load(K3), st4=load(K4), st5=load(K5), st6=load(K6), st7=load(K7);

/* ---------- nilai ternormalisasi (Rp JUTA) ---------- */
function F(k){
  var r = st2 && st2.figures ? st2.figures[k] : null;
  if(!r || r.nd) return {nd:true};
  var num = parseIDNumber(r.v, false);
  if(isNaN(num)) return {nd:true, bad:true};
  var mult = UNITS[r.unit||"miliar"]||1e9;
  return {nd:false, jt:num*mult/1e6, unit:r.unit||"miliar", basis:r.basis||"konsolidasi", page:r.page||""};
}
function FR(k){
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
var LENSES=[
 {k:"inv", t:"Lensa investasi"},
 {k:"cred",t:"Lensa kredit"},
 {k:"foren",t:"Lensa forensik"},
 {k:"q2",  t:"Pertanyaan wajib interim"}
];
function validS4(){
  return st4 && LENSES.every(function(L){ return lensOK(st4.lenses[L.k]); }) &&
    String(st4.vonis||"").trim().length>=10 && !!st4.thesis;
}
function canReveal(){ return !!(st0 && st0.started && st1 && st1.read && st2 && st2.done && st3 && st3.ran && validS4()); }
function isCoached(){ return st0 && st0.mode==="coached"; }

/* ---------- stepper ---------- */
var STEP_TXT=["0 · Briefing","1 · Baca","2 · Input angka","3 · Cek mekanis","4 · Lensa","5 · Benchmark","6 · Rubrik","7 · Refleksi"];
function stepStatus(i){
  var started=!!(st0&&st0.started);
  if(i===0) return started?"done":"active";
  if(!started) return "lock";
  if(i===1) return (st1&&st1.read)?"done":"active";
  if(i===2) return (st2&&st2.done)?"done":((st1&&st1.read)?"active":"lock");
  if(i===3) return (st3&&st3.ran)?"done":((st2&&st2.done)?"active":"lock");
  if(i===4) return validS4()?"done":((st3&&st3.ran)?"active":"lock");
  if(i===5) return (st5&&st5.revealed)?"done":(canReveal()?"active":"lock");
  if(i===6) return (st6&&st6.computed)?"done":((st5&&st5.revealed)?"active":"lock");
  return (st7&&st7.done)?"done":((st6&&st6.computed)?"active":"lock");
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

/* ---------- S0: briefing, gate, atestasi, timer ---------- */
function gateM38(){ try{ return localStorage.getItem("fsa_gate_m38")==="lolos"; }catch(e){ return false; } }
function fmtDur(ms){
  var m=Math.floor(ms/60000), h=Math.floor(m/60);
  if(h<1) return m+" menit";
  return h+" jam "+(m%60)+" menit";
}
function tickTimer(){
  if(!(st0&&st0.started)) return;
  var tl=$("#timerline"), el=$("#elapsed");
  if(tl) tl.style.display="block";
  if(el) el.textContent=fmtDur(Date.now()-st0.ts);
}
function initS0(){
  var gm=$("#gate-m38");
  if(gm){
    if(gateM38()){
      gm.innerHTML="✅ <strong>M38 (mekanik interim) LULUS</strong> — prasyarat terpenuhi. Ujian interim tanpa mekanik interim = tidak fair; kamu sudah siap.";
    }else{
      gm.innerHTML="🔒 <strong>M38 belum lulus.</strong> Ujian ini memakai mekanik interim (derivasi Q2, annualisasi, anti-jebakan stock) — "+
        "selesaikan dulu <a href='/modul-38/'><strong>Modul 38: Mekanik Laporan Interim</strong></a> (gate 80%), lalu kembali ke sini.";
    }
  }
  var btn=$("#start-exam");
  if(!btn) return;
  if(st0&&st0.started){
    $("#exam-body").style.display="block";
    $("#briefing").style.display="none";
    tickTimer(); setInterval(tickTimer,30000);
    if(isCoached()) $("#coachbanner").style.display="block";
    document.querySelector(".modul-hero h1").innerHTML = "Ujian: <em>BBCA Interim H1 2026.</em>" +
      (isCoached()?" <span style='font-size:.55em;background:#8a6d1c;color:#fff;padding:.15em .6em;border-radius:12px'>COACHED</span>":"");
    return;
  }
  btn.addEventListener("click",function(){
    if(!gateM38()){ alert("Prasyarat belum terpenuhi.\n\nSelesaikan M38 (Mekanik Laporan Interim) dulu — ujian ini menguji mekanik interim secara real. Tombol mulai terkunci sampai gate M38 lolos."); return; }
    var mode=null;
    $$("input[name=attest]").forEach(function(r){ if(r.checked) mode=r.value; });
    if(!mode){ alert("Pilih atestasi kontaminasi dulu: BLIND atau COACHED.\n\nJujur = satu-satunya yang dinilai di sini."); return; }
    var attempts=1;
    try{ var prev=load(K0); if(prev&&prev.attempts) attempts=prev.attempts; }catch(e){}
    if(attempts>1) mode="coached";
    if(!confirm("Mulai ujian sekarang?\n\nMode: "+mode.toUpperCase()+"\nDurasi saran 3–4 jam. Timer pasif mulai berjalan. Lanjut?")) return;
    st0={started:true,mode:mode,ts:Date.now(),attempts:attempts}; save(K0,st0);
    location.reload();
  });
}

/* ---------- L1 ---------- */
function initL1(){
  var b=$("#s1-save"); if(!b) return;
  if(st1){
    ["a","b","c","unaud","ytd","ncc","q1url"].forEach(function(f){ var el=$("#s1-"+f); if(el) el.value=st1[f]||""; });
    $("#s1-read").checked=!!st1.read;
  }
  b.addEventListener("click",function(){
    var v={}, bad=[];
    ["a","b","c"].forEach(function(f){ v[f]=$("#s1-"+f).value.trim(); if(!v[f]) bad.push(f); });
    [["unaud","halaman status 'tidak diaudit'"],["ytd","konfirmasi periode YTD"],["ncc","halaman NPL/CKPN/CAR interim"],["q1url","URL filing Q1 2026"]].forEach(function(p){
      v[p[0]]=$("#s1-"+p[0]).value.trim(); if(!v[p[0]]) bad.push(p[1]);
    });
    var read=$("#s1-read").checked;
    if(bad.length){ alert("Belum bisa lanjut — kosong:\n• "+bad.join("\n• ")+"\n\nTugas baca interim: temukan 'tidak diaudit', konfirmasi YTD, catat halaman NPL/CKPN/CAR, dan temukan filing Q1 2026."); return; }
    if(!read){ alert("Centang 'Saya sudah membaca' dulu. Honor system — tapi jujur ke diri sendiri."); return; }
    st1={a:v.a,b:v.b,c:v.c,unaud:v.unaud,ytd:v.ytd,ncc:v.ncc,q1url:v.q1url,read:true,ts:Date.now()}; save(K1,st1);
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
  var dcls=rw.deriv?" class='derivrow'":"";
  var head="<tr data-k='"+rw.k+"'"+dcls+">"+
    "<td style='min-width:11rem'><strong>"+esc(rw.label)+"</strong><br><span style='font-size:.75rem;color:var(--ink-soft)'>"+esc(rw.sec)+"</span></td>";
  if(rw.ratio){
    return head+
    "<td><input class='bs-v' data-f='"+rw.k+"' type='text' inputmode='decimal' placeholder='mis. 4,50' value='"+esc(s.v||"")+"' style='max-width:7rem'> <span style='font-size:.8rem'>%</span></td>"+
    "<td colspan='5'><input class='bs-def' data-f='"+rw.k+"' type='text' placeholder='"+esc(rw.defhint||"definisi yang saya pakai…")+"' value='"+esc(s.def||"")+"' style='width:100%'></td>"+
    "<td style='text-align:center'><input class='bs-nd' data-f='"+rw.k+"' type='checkbox'"+(s.nd?" checked":"")+" title='tidak diungkapkan'></td></tr>";
  }
  var periodOpts = rw.deriv ? ["Q2 2026 (derivasi)"] : (rw.k.indexOf("q1")===0?["Q1 2026"]:(rw.sec.indexOf("30 Jun")>=0?["30 Jun 2026"]:["H1 2026"]));
  return head+
    "<td><input class='bs-v' data-f='"+rw.k+"' type='text' inputmode='decimal' placeholder='mis. 38.000' value='"+esc(s.v||"")+"' style='min-width:8rem'></td>"+
    "<td><input class='bs-page' data-f='"+rw.k+"' type='text' placeholder='hal./cat.' value='"+esc(s.page||"")+"' style='min-width:6rem'></td>"+
    "<td>"+sel("bs-period",periodOpts,s.period||periodOpts[0])+"</td>"+
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

/* ---------- L3: 14 cek mekanis ---------- */
function chkRow(id,name,st,detail,hint,extra){
  return {id:id,name:name,st:st,detail:detail,hint:hint,extra:extra||""};
}
function ndAny(){ for(var i=0;i<arguments.length;i++){ if(arguments[i].nd) return true; } return false; }
function withinJT(a,b){ return Math.abs(a-b) <= Math.max(0.01*Math.abs(b),1000); }
function runChecks(){
  var out=[];
  /* B1: NII aritmetika */
  var ii=F("int_inc"), ie=F("int_exp"), nii=F("nii");
  if(ndAny(ii,ie,nii)) out.push(chkRow("B1","NII aritmetika","DILEWATI","pendapatan/beban bunga / NII tidak diungkapkan.","—"));
  else{
    var e1=ii.jt-ie.jt, ok=withinJT(nii.jt,e1);
    out.push(chkRow("B1","NII aritmetika", ok?"LULUS":"GAGAL",
      "NII "+fmtJt(nii.jt)+" vs pendapatan − beban = "+fmtJt(e1)+".",
      "NII = bunga masuk − bunga keluar. Curigai salah satuan (filing dalam jutaan, input default miliar)."));
  }
  /* B2: DPK */
  var g=F("giro"), tb=F("tabungan"), dp=F("deposito"), dpk=F("dpk");
  if(ndAny(g,tb,dp,dpk)) out.push(chkRow("B2","DPK aritmetika","DILEWATI","giro / tabungan / deposito / DPK tidak diungkapkan.","—"));
  else{
    var e2=g.jt+tb.jt+dp.jt, ok2=withinJT(dpk.jt,e2);
    out.push(chkRow("B2","DPK aritmetika", ok2?"LULUS":"GAGAL",
      "DPK "+fmtJt(dpk.jt)+" vs giro+tabungan+deposito = "+fmtJt(e2)+".",
      "DPK = total simpanan nasabah. Pastikan tidak mencampur liabilitas lain."));
  }
  /* B3: NIM definisi interim (annualisasi wajib dinyatakan) */
  var nim=FR("nim");
  if(nim.nd) out.push(chkRow("B3","NIM — definisi interim","DILEWATI","NIM tidak diungkapkan / tidak diketik.","Ketik NIM hitunganmu + definisinya di langkah 2."));
  else{
    var dl=(nim.def||"").toLowerCase();
    var okP=nim.v>0&&nim.v<15;
    var okR=dl.indexOf("rata-rata")>=0||dl.indexOf("rata rata")>=0;
    var okA=dl.indexOf("annualis")>=0||/x\s*2|×\s*2|\*2|2\s*x/.test(dl);
    out.push(chkRow("B3","NIM — definisi interim", (okP&&okR&&okA)?"LULUS":"GAGAL",
      "Ketikanmu: "+fmtPctID(nim.v)+" · definisimu: \""+nim.def+"\". Nilai vs bank dibandingkan di langkah 5.",
      "NIM interim = NII ter-ANNUALISASI (H1 → ×2, dengan konvensi yang kamu nyatakan) ÷ RATA-RATA aset produktif. Bukan ×4 mentah, bukan saldo akhir. Lihat M38 S4."));
  }
  /* B4: CASA */
  var casa=FR("casa");
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
      "Bank menonjolkan angka yang kecil — pastikan definisimu menyebut GROSS."));
  }
  /* B6: coverage display */
  var cl=F("ckpn_loan"), lg=F("loans_gross");
  if(ndAny(cl,lg)||npl.nd) out.push(chkRow("B6","Coverage","DILEWATI","CKPN pinjaman / kredit gross / NPL tidak lengkap.","—"));
  else{
    var cov=cl.jt/(npl.v/100*lg.jt)*100;
    out.push(chkRow("B6","Coverage","INFO",
      "CKPN ÷ (NPL% × kredit gross) = "+fmtPctID(cov)+" dari angkamu.",
      "Coverage turun + NPL naik = dua sinyal merah, bukan satu. Bandingkan dengan angka bank di langkah 5."));
  }
  /* B7: LDR jebakan definisi */
  var ldr=FR("ldr");
  if(ndAny(lg,dpk)) out.push(chkRow("B7","LDR — jebakan definisi","DILEWATI","kredit gross / DPK tidak diungkapkan.","—"));
  else if(ldr.nd) out.push(chkRow("B7","LDR — jebakan definisi","DILEWATI","kamu belum mengetik LDR di langkah 2.","—"));
  else{
    var naive=lg.jt/dpk.jt*100, dl7=Math.abs(naive-ldr.v);
    if(dl7<=1) out.push(chkRow("B7","LDR — jebakan definisi","LULUS",
      "Ketikanmu "+fmtPctID(ldr.v)+" cocok dengan kredit ÷ DPK = "+fmtPctID(naive)+" dari inputmu.",
      "LDR = kredit ÷ DPK. Perbandingan definisi lengkap di langkah 5.",
      "INFO: bank mengungkap LDR yang BERBEDA di tabel rasio interim — definisinya tidak sama dengan kredit÷DPK. Hitunganmu BUKAN salah; ini jebakan definisi."));
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
      "CAR headline bisa menyanjung: cek porsi CET1 vs AT1+Tier2 — jangan puas dengan satu angka."));
  }
  /* B9: neraca balance */
  var A=F("assets"), L=F("liab"), E=F("equity");
  if(ndAny(A,L,E)) out.push(chkRow("B9","Neraca balance","DILEWATI","aset / liabilitas / ekuitas tidak diungkapkan.","—"));
  else{
    var e9=L.jt+E.jt, ok9=withinJT(A.jt,e9);
    out.push(chkRow("B9","Neraca balance", ok9?"LULUS":"GAGAL",
      "Aset "+fmtJt(A.jt)+" vs Liabilitas+Ekuitas "+fmtJt(e9)+".",
      "Cek satuan tiap baris; pastikan basis sama (konsolidasi vs induk)."));
  }
  /* B10: kas tie-out */
  var cb=F("cash_begin"), ce=F("cash_end"), cn=F("cf_net"), fx=F("cf_fx");
  if(ndAny(cb,ce,cn,fx)) out.push(chkRow("B10","Kas tie-out","DILEWATI","kas awal / akhir / neto / selisih kurs tidak diungkapkan.","—"));
  else{
    var e10=cb.jt+cn.jt-fx.jt, ok10=withinJT(ce.jt,e10);
    out.push(chkRow("B10","Kas tie-out", ok10?"LULUS":"GAGAL",
      "Kas akhir "+fmtJt(ce.jt)+" vs awal + neto − kurs = "+fmtJt(e10)+".",
      "Interim unaudited: yang diuji KONSISTENSI. Kas akhir BS ≠ kas akhir CF — tahu bedanya?"));
  }
  /* B11: laba ditahan walk */
  var rb=F("re_begin"), re=F("re_end"), pm=F("patmi"), dv=F("div_paid");
  if(ndAny(rb,re,pm,dv)) out.push(chkRow("B11","Laba ditahan walk","DILEWATI","saldo laba awal / akhir / laba bersih / dividen tidak diungkapkan.","—"));
  else{
    var e11=rb.jt+pm.jt-dv.jt, ok11=withinJT(re.jt,e11);
    out.push(chkRow("B11","Laba ditahan walk", ok11?"LULUS":"GAGAL",
      "Saldo akhir "+fmtJt(re.jt)+" vs awal + laba − dividen = "+fmtJt(e11)+".",
      "Walk ekuitas = jembatan laba rugi → neraca. Dividen interim 3× = cerita 2026 ini."));
  }
  /* B12: kelengkapan sumber & definisi */
  var withPage=VAL_KEYS.filter(function(k){ var f=F(k); return !f.nd&&f.page!==""; }).length;
  var withDef=RATIO_KEYS.filter(function(k){ var f=FR(k); return !f.nd&&String(f.def||"").trim()!==""; }).length;
  out.push(chkRow("B12","Kelengkapan sumber & definisi","INFO",
    "Disiplin sumbermu: "+withPage+"/"+VAL_KEYS.length+" baris ber-halaman · "+withDef+"/"+RATIO_KEYS.length+" rasio ber-definisi.",
    "Bukan nilai — cerminan disiplin. K5 menuntut ≥80% baris ber-halaman."));
  /* I1: derivasi Q2 = H1 − Q1 (flow only) */
  var q2n=F("q2_nii"), q2i=F("q2_ni"), q2c=F("q2_ckpn");
  function i1row(id,label,mine,exp){
    if(mine.nd) return chkRow(id,label,"DILEWATI","kamu tidak menginput derivasi ini (atau 'tidak diungkapkan').","Derivasi Q2 = H1 − Q1 untuk FLOW. Wajib diinput — ini ujian M38.");
    var tol=Math.max(0.03*Math.abs(exp),100000);
    var ok=Math.abs(mine.jt-exp)<=tol;
    return chkRow(id,label,ok?"LULUS":"GAGAL",
      "Derivasimu "+fmtJt(mine.jt)+" vs H1 − Q1 = "+fmtJt(exp)+" (tol ±"+fmtJt(tol)+").",
      "Q2 standalone = H1 − Q1. Hanya untuk FLOW. Angka Q1 dari presentasi resmi bank (S2).");
  }
  if(ndAny(nii)) out.push(chkRow("I1a","Derivasi NII Q2","DILEWATI","NII H1 tidak diinput.","—"));
  else out.push(i1row("I1a","Derivasi NII Q2",q2n,nii.jt-Q1.nii));
  if(ndAny(pm)) out.push(chkRow("I1b","Derivasi laba Q2","DILEWATI","laba bersih H1 tidak diinput.","—"));
  else out.push(i1row("I1b","Derivasi laba Q2",q2i,pm.jt-Q1.ni));
  if(ndAny(F("ckpn_exp"))) out.push(chkRow("I1c","Derivasi CKPN Q2","DILEWATI","CKPN H1 tidak diinput.","—"));
  else out.push(i1row("I1c","Derivasi CKPN Q2",q2c,F("ckpn_exp").jt-Q1.ckpn));
  /* I2: anti-jebakan stock */
  var i2c=$("#i2-stock");
  var i2on=i2c&&i2c.checked;
  out.push(chkRow("I2","Anti-jebakan stock", i2on?"LULUS":"GAGAL",
    i2on?"Kamu menyatakan tidak mengurangkan pos neraca untuk mendapat angka kuartalan.":"Centang pernyataan di bawah untuk lulus cek ini.",
    "Stock (aset, kredit, DPK) adalah posisi tanggal — tidak punya versi 'kuartalan'. Mengurangkan neraca = gagal paham M38."));
  return out;
}
function extraRatios(){
  var ce=F("ckpn_exp"), lg=F("loans_gross"), pm=F("patmi"), ea=F("equity");
  var nt=F("patmi"), A=F("assets");
  var dv=F("div_paid");
  function pct(x,y){ return (!x.nd&&!y.nd&&y.jt!==0)?(x.jt/y.jt*100).toFixed(2).replace(".",",")+"%":"—"; }
  return [
    ["DPR (dividen ÷ PATMI)", pct(dv,pm)],
    ["NPL nominal implisit (NPL% × kredit)", (!FR("npl").nd&&!lg.nd)?fmtJt(FR("npl").v/100*lg.jt):"—"],
    ["CASA nominal (giro+tabungan)", (!F("giro").nd&&!F("tabungan").nd)?fmtJt(F("giro").jt+F("tabungan").jt):"—"]
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
    $("#extra-ratios").innerHTML="<strong>Dari angkamu (display, bukan cek):</strong> "+
      ex.map(function(e){return esc(e[0])+": <span class='mono'>"+esc(e[1])+"</span>";}).join(" · ");
  }
  if(st3&&st3.ran) render();
  b.addEventListener("click",function(){
    var i2c=$("#i2-stock");
    render();
    st3={ran:true,checks:runChecks().map(function(c){return {id:c.id,st:c.st};}),ts:Date.now()};
    save(K3,st3);
    $("#s3-ok").textContent="✓ 14 cek mekanis dijalankan. GAGAL = informasi, bukan nilai. Lanjut ke langkah 4.";
    refreshSteps();
  });
}

/* ---------- L4: lensa ---------- */
var LENS_Q={
 inv:"Apakah return BBCA sepadan dengan risiko yang diambil? SATU bukti MENGUATKAN (mis. NIM/CASA/ROE/div yield) dan SATU yang MEMATAHKAN (mis. kompresi NIM/tren provisi), beserta angkanya.",
 cred:"Apakah CKPN cukup menutup NPL gross? Bagaimana tren kualitas aset (NPL, coverage, LAR)? Dan seberapa fortress pendanaannya (CASA, LDR)? Bukti penguat + pematah + angka.",
 foren:"Satu hal yang paling ingin kamu investigasi — sebagai PERTANYAAN, bukan vonis. (Contoh pola: 'Provisi turun 51% QoQ padahal NPL nominal naik — kenapa?')",
 q2:"Apa yang berubah dari Q1 ke Q2 2026 — dan apakah itu MUSIMAN atau STRUKTURAL? Kutip angka derivasimu."
};
function initL4(){
  if(!$("#lens-inv")) return;
  if(st4){
    LENSES.forEach(function(L){ $("#lens-"+L.k).value=(st4.lenses&&st4.lenses[L.k])||""; });
    $("#vonis").value=st4.vonis||"";
    if(st4.thesis) $("#thesis-chk").checked=true;
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
    var thesis=$("#thesis-chk").checked;
    if(!thesis) bad.push("Checkbox thesis testing (penguat DAN pematah)");
    if(bad.length){ alert("Belum bisa lanjut:\n• "+bad.join("\n• ")+"\n\nTiap jawaban lensa: min. 50 karakter DAN wajib mengutip minimal 1 angka."); return; }
    st4={lenses:lenses,vonis:vonis,thesis:true,ts:Date.now()}; save(K4,st4);
    $("#s4-ok").textContent="✓ 4 lensa + vonis tersimpan. Langkah 5 (benchmark) kini terbuka — membukanya akan MENGUNCI jawabanmu dan attempt blind-mu.";
    refreshSteps();
  });
}
function lockL4(){
  LENSES.forEach(function(L){ var ta=$("#lens-"+L.k); if(ta) ta.disabled=true; });
  var v=$("#vonis"); if(v) v.disabled=true;
  var t=$("#thesis-chk"); if(t) t.disabled=true;
  var b=$("#s4-save"); if(b) b.disabled=true;
  var note=$("#s4-locknote"); if(note) note.style.display="block";
}

/* ---------- L5: reveal ---------- */
function loadBench(cb){
  if(window.BBCA_BENCH){ cb(); return; }
  var s=document.createElement("script");
  s.src="data/bbca-benchmark.js";
  s.onload=cb;
  s.onerror=function(){ alert("Gagal memuat file benchmark. Cek koneksi / path data/bbca-benchmark.js"); };
  document.head.appendChild(s);
}
function srcCell(b){
  var tag=b.tag?" ["+b.tag+"]":"";
  if(b.page==="—"||b.page==="S2") return (b.page==="S2"?"presentasi analis resmi bank":"terhitung")+tag;
  if(b.page==="press") return "press"+tag;
  return "LK hlm. "+b.page+(b.note&&b.note!=="—"?", "+b.note:"")+tag;
}
var RATIO_MAP={nim:"nim",npl:"npl",ldr:"ldr",casa:"casa",car:"car"};
function renderL5(){
  var B=window.BBCA_BENCH; if(!B) return;
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
      if(!b2||b2.v==null) return "";
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
  var defRows=RATIO_KEYS.map(function(k){
    var b=B.ratios[RATIO_MAP[k]], f=FR(k);
    var mine=f.nd?"<em>tidak diungkapkan</em>":esc(f.def||"—");
    var lbl={nim:"NIM",npl:"NPL gross",ldr:"LDR",casa:"CASA",car:"CAR"}[k];
    return "<tr><td><strong>"+lbl+"</strong> ["+b.tag+"]</td><td>"+esc(b.def)+"</td><td>"+mine+"</td></tr>";
  }).join("");
  $("#def-table").innerHTML=defRows;
  var an=$("#analyst");
  an.innerHTML="<div class='honest'><strong>⚠️ Satu interpretasi analis — bukan jawaban benar.</strong> "+
    "Tiga paragraf di bawah adalah cara analis membaca BBCA H1 2026. Bandingkan dengan jawaban blind-mu: "+
    "di mana kamu menyimpang, angka apa yang terlewat, pertanyaan interim mana yang paling sulit?</div>"+
    [["Lensa investasi",B.analyst.inv],["Lensa kredit",B.analyst.cred],["Lensa forensik",B.analyst.foren]].map(function(p){
      return "<h3>"+esc(p[0])+"</h3><p>"+esc(p[1])+"</p>";
    }).join("")+
    "<h3>Red flags — sebagai pertanyaan, bukan vonis</h3><ol>"+
    B.redflags.map(function(r){return "<li>"+esc(r)+"</li>";}).join("")+"</ol>"+
    "<div class='honest' style='margin-top:1.2rem'><strong>📋 Callout jujur — interim unaudited.</strong> "+esc(B.callout)+"</div>"+
    "<div class='honest'><strong>🏦 Callout jujur — valuasi bank bukan DCF.</strong> "+esc(B.callout_val)+"</div>";
  $("#l5-content").style.display="block";
  $("#l5-gate").style.display="none";
}
function excerpt(t,n){ t=String(t||"").trim(); return t.length>n?t.slice(0,n)+"…":t; }
function buildLembar(){
  var B=window.BBCA_BENCH;
  var mode=isCoached()?"COACHED":"BLIND";
  var d=new Date(st0.ts);
  var tgl=d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
  var dur=fmtDur(Date.now()-st0.ts);
  var L="LEMBAR UJIAN ("+mode+") — "+B.meta.emiten+" ("+B.meta.ticker+") · "+B.meta.periode+"\n"+
    "Dikerjakan: "+tgl+" · durasi "+dur+" · Basis: "+B.meta.basis+" · "+B.meta.status_audit+"\n"+B.meta.filing_url+"\n\n"+
    "VERDICT 5 BARIS:\n"+
    "1. VONIS: "+st4.vonis+"\n"+
    "2. Kualitas laba: "+excerpt(st4.lenses.inv,280)+"\n"+
    "3. Kualitas aset & permodalan: "+excerpt(st4.lenses.cred,280)+"\n"+
    "4. Pendanaan: "+excerpt(st4.lenses.cred,280)+"\n"+
    "5. Pertanyaan terbuka: "+excerpt(st4.lenses.foren,280)+"\n\n"+
    "LENSA INVESTASI:\n"+st4.lenses.inv+"\n\n"+
    "LENSA KREDIT:\n"+st4.lenses.cred+"\n\n"+
    "LENSA FORENSIK:\n"+st4.lenses.foren+"\n\n"+
    "PERTANYAAN WAJIB INTERIM (Q1→Q2):\n"+st4.lenses.q2+"\n\n"+
    "RUBRIK: "+(st6&&st6.computed?(st6.pass?"LULUS":"BELUM LULUS")+" — "+["K1","K2","K3","K4","K5"].map(function(k){return k+":"+(st6.detail[k]?"✓":"✗");}).join(" "):"belum dihitung")+"\n\n"+
    "DEFINISI RESMI BANK vs DEFINISIKU:\n";
  RATIO_KEYS.forEach(function(k){
    var b=B.ratios[RATIO_MAP[k]], f=FR(k);
    var lbl={nim:"NIM",npl:"NPL gross",ldr:"LDR",casa:"CASA",car:"CAR"}[k];
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
    var f2=F(rw.k), b2=B.rows[rw.k]; if(!b2||b2.v==null) return;
    if(f2.nd){ L+="• "+rw.label+": tidak kuungkapkan vs benchmark "+fmtJt(b2.v)+(b2.tag?" ["+b2.tag+"]":"")+"\n"; return; }
    var dlt2=(f2.jt-b2.v)/Math.abs(b2.v)*100;
    L+="• "+rw.label+": angkaku "+fmtJt(f2.jt)+" vs benchmark "+fmtJt(b2.v)+" (Δ "+(dlt2>=0?"+":"")+dlt2.toFixed(1).replace(".",",")+"%)"+(b2.tag?" ["+b2.tag+"]":"")+"\n";
  });
  L+="\n—\nDibuat di FSA Lab · Ujian ("+mode+"). Benchmark terverifikasi dari LK Interim H1 2026 BBCA (unaudited, bca.co.id) + 1H26 Results; interpretasi analis = satu interpretasi, bukan jawaban benar.";
  return L;
}
function initL5(){
  var btn=$("#reveal-btn"); if(!btn) return;
  if(st5&&st5.revealed){
    lockL4();
    loadBench(function(){ renderL5(); });
    return;
  }
  btn.addEventListener("click",function(){
    if(!canReveal()){ alert("Langkah 0–4 belum lengkap. Selesaikan dulu: briefing (0), baca (1), input angka (2), jalankan cek (3), 4 lensa + vonis + thesis (4)."); return; }
    if(!confirm("Buka benchmark sekarang?\n\nJawaban lensamu (langkah 4) akan DIKUNCI permanen dan attempt blind-mu TERKUNCI — upaya unaided-mu terjaga. Lanjut?")) return;
    st5={revealed:true,ts:Date.now()}; save(K5,st5);
    lockL4();
    loadBench(function(){ renderL5(); });
    refreshSteps();
  });
  var gb=$("#goto-rubrik");
  if(gb) gb.addEventListener("click",function(){
    var r=$("#rubrik-sec"); if(r) r.scrollIntoView({behavior:"smooth"});
  });
}

/* ---------- Bagian 6: Rubrik K1–K5 ----------
   Benchmark values TIDAK di-hardcode di sini (isolasi blind-first) — diambil dari
   window.BBCA_BENCH yang baru dimuat saat reveal. Rubrik hanya bisa dihitung
   setelah reveal, jadi ini aman. */
function key6rows(){
  var B=window.BBCA_BENCH;
  return [
   {k:"nii", label:"NII H1 2026", bench:B.rows.nii.v},
   {k:"patmi", label:"Laba bersih atribusional H1", bench:B.rows.patmi.v},
   {k:"loans_gross", label:"Kredit gross 30 Jun 2026", bench:B.rows.loans_gross.v},
   {k:"dpk", label:"Total DPK 30 Jun 2026", bench:B.rows.dpk.v}
  ];
}
function checkSt(id){
  if(!st3||!st3.checks) return null;
  for(var i=0;i<st3.checks.length;i++) if(st3.checks[i].id===id) return st3.checks[i].st;
  return null;
}
function computeRubric(){
  var B=window.BBCA_BENCH;
  if(!B){ alert("Benchmark belum dimuat — buka langkah 5 dulu."); return null; }
  var det={};
  /* K1: 6 angka kunci */
  var k1bad=[];
  key6rows().forEach(function(o){
    var f=F(o.k);
    if(f.nd||f.bad){ k1bad.push(o.label+" (tidak diinput)"); return; }
    if(Math.abs(f.jt-o.bench)>Math.max(0.01*Math.abs(o.bench),1000)) k1bad.push(o.label);
  });
  var npl=FR("npl"), car=FR("car");
  if(npl.nd||Math.abs(npl.v-B.ratios.npl.v)>0.5) k1bad.push("NPL gross (±0,5pp)");
  if(car.nd||Math.abs(car.v-B.ratios.car.v)>0.5) k1bad.push("CAR (±0,5pp)");
  det.K1={pass:k1bad.length===0, detail:k1bad.length?"Meleset: "+k1bad.join(", "):"6/6 angka kunci dalam toleransi."};
  /* K2: konsistensi internal */
  var k2need=["B9","B10","B11"], k2bad=[];
  k2need.forEach(function(id){ if(checkSt(id)!=="LULUS") k2bad.push(id); });
  det.K2={pass:k2bad.length===0, detail:k2bad.length?"Gagal: "+k2bad.join(", ")+" — jalankan ulang langkah 3.":"Neraca balance ✓, kas tie-out ✓, laba ditahan walk ✓."};
  /* K3: mekanik interim */
  var b3ok=checkSt("B3")==="LULUS";
  var i1ok=["I1a","I1b","I1c"].every(function(id){return checkSt(id)==="LULUS";});
  var i2ok=checkSt("I2")==="LULUS";
  var k3bad=[];
  if(!b3ok) k3bad.push("B3 NIM annualisasi");
  if(!i1ok) k3bad.push("I1 derivasi Q2");
  if(!i2ok) k3bad.push("I2 anti-jebakan stock");
  det.K3={pass:k3bad.length===0, detail:k3bad.length?"Gagal: "+k3bad.join(", "):"NIM ter-annualisasi ✓, derivasi Q2 = H1−Q1 ✓, tidak mengurangkan stock ✓."};
  /* K4: lensa thesis testing */
  var k4site=LENSES.every(function(L){return lensOK(st4.lenses[L.k]);}) && String(st4.vonis||"").trim().length>=10 && !!st4.thesis;
  det.K4={pass:k4site, detail:k4site?"4 lensa ≥50 char + angka ✓, thesis testing ✓, vonis ✓.":"Lengkapi lensa (min. 50 char + angka) + checkbox thesis testing + vonis di langkah 4."};
  /* K5: red flag + disiplin sumber */
  var fq=String(st4.lenses.foren||"");
  var hasQ=fq.indexOf("?")>=0;
  var withPage=VAL_KEYS.filter(function(k){ var f=F(k); return !f.nd&&f.page!==""; }).length;
  var srcPct=Math.round(withPage/VAL_KEYS.length*100);
  var attest=$("#rf-attest")&&$("#rf-attest").checked;
  var k5bad=[];
  if(!hasQ) k5bad.push("lensa forensik tanpa tanda tanya");
  if(srcPct<80) k5bad.push("disiplin sumber "+srcPct+"% (< 80%)");
  if(!attest) k5bad.push("checkbox red-flag-sebagai-pertanyaan belum dicentang (bagian 7)");
  det.K5={pass:k5bad.length===0, detail:k5bad.length?"Gagal: "+k5bad.join("; ")+".":"Red flag sebagai pertanyaan ✓, disiplin sumber "+srcPct+"% ✓."};
  var pass=["K1","K2","K3","K4","K5"].every(function(k){return det[k].pass;});
  return {det:det,pass:pass};
}
var REMEDIAL={K1:"Bedah Sendiri BBRI (disiplin baca & input bank)",K2:"M38 §S6 (baca interim unaudited — konsistensi)",K3:"M38 (modul mekanik kuartalan)",K4:"Bedah Filing SOCI (pola thesis testing)",K5:"Bedah Sendiri (disiplin sumber)"};
function initRubrik(){
  var b=$("#rubrik-run"); if(!b) return;
  b.addEventListener("click",function(){
    if(!(st5&&st5.revealed)){ alert("Buka benchmark (langkah 5) dulu — rubrik dihitung setelah reveal."); return; }
    var r=computeRubric();
    if(!r) return;
    st6={computed:true,pass:r.pass,detail:{K1:r.det.K1.pass,K2:r.det.K2.pass,K3:r.det.K3.pass,K4:r.det.K4.pass,K5:r.det.K5.pass},ts:Date.now()};
    save(K6,st6);
    var list=$("#rubrik-list");
    list.innerHTML=["K1","K2","K3","K4","K5"].map(function(k){
      var d=r.det[k];
      var badge=d.pass?"<span class='ck ok'>LULUS</span>":"<span class='ck bad'>BELUM</span>";
      var nm={K1:"K1 — Angka kunci benar",K2:"K2 — Konsistensi internal",K3:"K3 — Mekanik interim",K4:"K4 — Tiga lensa thesis testing",K5:"K5 — Red flag + disiplin sumber"}[k];
      var rem=d.pass?"":"<br><span class='ck-hint'>🎯 Remedial: "+esc(REMEDIAL[k])+"</span>";
      return "<div class='rubk'>"+badge+" <h4 style='display:inline'>"+nm+"</h4><br><span class='ck-det'>"+esc(d.detail)+"</span>"+rem+"</div>";
    }).join("");
    var vp=$("#verdict-panel");
    vp.style.display="block";
    vp.className="verdict "+(r.pass?"pass":"fail");
    $("#verdict-mode").textContent="Mode: "+(isCoached()?"COACHED (latihan berlabel)":"BLIND");
    $("#verdict-text").textContent=r.pass?"LULUS":"BELUM LULUS";
    var fails=["K1","K2","K3","K4","K5"].filter(function(k){return !r.det[k].pass;});
    $("#verdict-remedial").textContent=r.pass?"Lima kriteria terpenuhi. Satu bukti kemampuan tercatat — bukti menguat lewat transfer (bagian 7).":"Remedial spesifik: "+fails.map(function(k){return k+" → "+REMEDIAL[k];}).join(" · ");
    $("#rubrik-ok").textContent="✓ Rubrik dihitung.";
    refreshSteps();
  });
}

/* ---------- Bagian 7: refleksi ---------- */
function initS7(){
  var b=$("#s7-save"); if(!b) return;
  if(st7){
    ["a","b","c"].forEach(function(f){ var el=$("#rf-"+f); if(el) el.value=st7[f]||""; });
    if(st7.attest) $("#rf-attest").checked=true;
  }
  b.addEventListener("click",function(){
    st7={a:$("#rf-a").value.trim(),b:$("#rf-b").value.trim(),c:$("#rf-c").value.trim(),attest:$("#rf-attest").checked,done:true,ts:Date.now()};
    save(K7,st7);
    $("#s7-ok").textContent="✓ Refleksi tersimpan.";
    refreshSteps();
  });
  var tk=$("#transfer-ask");
  if(tk) tk.addEventListener("click",function(){
    var n=1; try{ var s=load("fsa_exam_bbca_transfer"); if(s&&s.n) n=s.n+1; }catch(e){}
    save("fsa_exam_bbca_transfer",{n:n,ts:Date.now()});
    $("#transfer-ok").textContent="✓ Minat tercatat ("+n+"×). Sinyal demand untuk tim FSA Lab — bukan janji.";
  });
  var cp=$("#copy-lembar");
  if(cp) cp.addEventListener("click",function(){
    if(!(window.BBCA_BENCH)){ alert("Buka benchmark dulu agar Lembar Ujian lengkap."); return; }
    var t=buildLembar();
    function done(){ $("#copy-ok").textContent="✓ Lembar Ujian tersalin ke clipboard."; }
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(done,function(){ fallback(); });
    } else fallback();
    function fallback(){
      var ta=document.createElement("textarea"); ta.value=t; document.body.appendChild(ta);
      ta.select(); try{ document.execCommand("copy"); done(); }catch(e){ alert("Gagal menyalin otomatis — salin manual dari halaman."); }
      document.body.removeChild(ta);
    }
  });
  var rs=$("#reset-exam");
  if(rs) rs.addEventListener("click",function(){
    if(!confirm("Ulangi ujian dari awal?\n\nAttempt berikutnya OTOMATIS mode COACHED (berlabel) — blind hanya sekali. Lanjut?")) return;
    var att=1;
    try{ var p=load(K0); if(p&&p.attempts) att=p.attempts; }catch(e){}
    [K0,K1,K2,K3,K4,K5,K6,K7].forEach(function(k){ try{ localStorage.removeItem(k); }catch(e){} });
    save(K0,{attempts:att+1});
    location.reload();
  });
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded",function(){
  refreshSteps();
  initS0();
  if(st0&&st0.started){
    initL1(); initL2(); initL3(); initL4(); initL5(); initRubrik(); initS7();
    if(st5&&st5.revealed) lockL4();
    /* I2 checkbox: disisipkan dinamis di bawah tombol cek agar selalu ada */
    var s3b=$("#s3-run");
    if(s3b && !$("#i2-stock")){
      var p=document.createElement("p");
      p.innerHTML="<label><input type='checkbox' id='i2-stock'> <strong>I2 — pernyataan:</strong> saya <strong>TIDAK</strong> mengurangkan pos neraca (aset, kredit, DPK) untuk mendapat angka kuartalan. Derivasi Q2 hanya untuk flow.</label>";
      s3b.parentNode.insertBefore(p, s3b.nextSibling);
    }
  }
});
})();

