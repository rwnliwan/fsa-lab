/* ============================================================================
   FSA Lab — Mekanik Impostor (lapisan presentasi di atas blind drill).
   ----------------------------------------------------------------------------
   Dipakai di: bedah-sendiri/klbf/index.html (data-drill="klbf"),
               bedah-sendiri/bbri/index.html (data-drill="bbri").
   TIDAK dipakai di: guided (janji "semua angka benar"), fraud cases, ujian.

   Cara kerja:
   1. Render "kartu referensi cepat" (6–7 angka kunci filing, asli) di langkah 2.
   2. Berdasarkan seed harian (YYYYMMDD), drill ini bisa ARMED: 1–2 anomali dari
      pool disuntik ke kartu — SATU angka diubah ±8% sehingga kartu menjadi
      tidak konsisten secara internal. Tidak ada tanda visual.
   3. Anomali SELALU terdeteksi oleh mekanik yang sudah diajarkan (cek
      konsistensi L3 / cross-check vs input L2 sendiri dari filing asli).
   4. Field "kecurigaan" opsional di L4 (disimpan pre-reveal).
   5. Debrief wajib pasca-reveal di L5: apakah drill mengandung impostor,
      apa anomalinya, mekanik penangkapnya. Badge "Impostor spotted" bila
      kecurigaan pre-reveal cocok dengan field yang diubah.

   Aturan keras: benchmark TIDAK tercemar (file *-benchmark.js tidak disentuh;
   anomali hanya di layer presentasi). Track menyatakan impostor ada tapi
   TIDAK PERNAH menandai drill mana — ketidakpastian adalah latihannya.
   ============================================================================ */
(function(){
"use strict";
var scriptEl = document.currentScript;
var DRILL = scriptEl ? scriptEl.getAttribute("data-drill") : null;
if(!DRILL) return;

var $ = function(s){ return document.querySelector(s); };
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function fmtID(n){ try{ return Math.round(n).toLocaleString("id-ID"); }catch(e){ return String(Math.round(n)); } }
function load(k){ try{ var v=JSON.parse(localStorage.getItem(k)); return v||null; }catch(e){ return null; } }
function save(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

/* ---------- konfigurasi per drill ---------- */
var CFG = {
 klbf: {
  drillIdx: 0,
  s5key: "fsa_bs_klbf_s5",
  unitNote: "Rp juta · FY2024 / 31 Des 2024 · sumber: AR 2024 KLBF",
  ref: [
   {k:"rev",     label:"Penjualan neto",        v:32627776},
   {k:"ni_attr", label:"Laba atribusional",     v:3240637},
   {k:"assets",  label:"TOTAL ASET",            v:29429728},
   {k:"liab",    label:"TOTAL LIABILITAS",      v:4839294},
   {k:"equity",  label:"TOTAL EKUITAS",         v:24590434},
   {k:"cash_bs", label:"Kas dan setara kas",    v:4723294}
  ],
  pool: [
   {id:"klbf-imp-1", field:"assets", label:"TOTAL ASET", alter:8,
    catcher:"Cek C1 (neraca balance): jumlahkan TOTAL LIABILITAS + TOTAL EKUITAS di kartu ini — hasilnya tidak sama dengan TOTAL ASET di kartu yang sama.",
    kw:["aset","aktiva","asset"]},
   {id:"klbf-imp-2", field:"rev", label:"Penjualan neto", alter:-8,
    catcher:"Cross-check kartu vs input L2-mu sendiri (yang kamu salin dari filing asli). Net margin yang dihitung dari angka kartu tidak konsisten.",
    kw:["penjualan","pendapatan","revenue","sales"]},
   {id:"klbf-imp-3", field:"ni_attr", label:"Laba atribusional", alter:8,
    catcher:"Cross-check vs L2; ROE yang dihitung dari angka kartu terlihat inflated dibanding filing.",
    kw:["laba","profit","earning","net income"]},
   {id:"klbf-imp-4", field:"cash_bs", label:"Kas dan setara kas", alter:-8,
    catcher:"Cek C2 (kas tie-out): kas di kartu vs kas arus kas tidak cocok.",
    kw:["kas","cash"]}
  ]
 },
 bbri: {
  drillIdx: 1,
  s5key: "fsa_bp_bbri_s5",
  unitNote: "Rp juta · FY2024 / 31 Des 2024 · sumber: LK FY2024 BBRI (filing IDX)",
  ref: [
   {k:"int_inc",    label:"Pendapatan bunga",   v:199266252},
   {k:"int_exp",    label:"Beban bunga",        v:57209062},
   {k:"nii",        label:"NII (terhitung)",    v:142057190},
   {k:"loans_gross",label:"Kredit gross",       v:1298318089},
   {k:"dpk",        label:"DPK",                v:1365450104},
   {k:"assets",     label:"TOTAL ASET",         v:1992983447},
   {k:"equity",     label:"TOTAL EKUITAS",      v:323189047}
  ],
  pool: [
   {id:"bbri-imp-1", field:"nii", label:"NII", alter:-8,
    catcher:"Cek B1 (NII aritmetika): pendapatan bunga − beban bunga di kartu ≠ NII di kartu yang sama.",
    kw:["nii","bunga bersih","net interest"]},
   {id:"bbri-imp-2", field:"loans_gross", label:"Kredit gross", alter:8,
    catcher:"Cek B7 (LDR): denominator kredit di kartu inflated — bandingkan dengan input L2-mu dari filing.",
    kw:["kredit","loan","pinjaman"]},
   {id:"bbri-imp-3", field:"dpk", label:"DPK", alter:-8,
    catcher:"Cek B4 (CASA) / B7 (LDR): DPK di kartu tidak konsisten dengan penjumlahan giro+tabungan+deposito.",
    kw:["dpk","simpanan","giro","tabungan","deposito"]},
   {id:"bbri-imp-4", field:"equity", label:"TOTAL EKUITAS", alter:8,
    catcher:"Cek B9 (neraca balance): aset di kartu ≠ liabilitas + ekuitas bila memakai angka kartu.",
    kw:["ekuitas","equity","modal"]}
  ]
 }
};
var C = CFG[DRILL];
if(!C) return;
var IMPFX = "fsa_imp_"+DRILL;

/* ---------- seed harian & status ---------- */
function ymd(){
  var d=new Date();
  return d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
}
function dayState(){
  var s = ymd();
  var stored = load(IMPFX+"_"+s);
  if(stored && stored.sealed) return stored;
  var armed = ((s + C.drillIdx) % 2 === 0);   /* ~50% hari armed, deterministik */
  var anoms = [];
  if(armed){
    var i1 = (s + C.drillIdx*7) % C.pool.length;
    anoms.push(C.pool[i1].id);
    if(s % 3 === 0){                          /* ~1/3 hari: anomali kedua */
      var i2 = (s*3 + C.drillIdx) % C.pool.length;
      if(i2 !== i1) anoms.push(C.pool[i2].id);
    }
  }
  var st = {sealed:true, ymd:s, armed:armed, anoms:anoms};
  save(IMPFX+"_"+s, st);
  return st;
}
function anomById(id){
  for(var i=0;i<C.pool.length;i++) if(C.pool[i].id===id) return C.pool[i];
  return null;
}
function alteredVal(a){
  var r=null;
  for(var i=0;i<C.ref.length;i++) if(C.ref[i].k===a.field) r=C.ref[i];
  if(!r) return null;
  return {orig:r.v, shown:Math.round(r.v*(1+a.alter/100))};
}

/* ---------- kartu referensi (langkah 2) ---------- */
function renderRefCard(st){
  var l2 = $("#fig-tbody");
  if(!l2) return;
  var bstep = l2.closest(".bstep-body");
  if(!bstep || $("#imp-refcard")) return;
  var rows = C.ref.map(function(r){
    var shown = r.v, imp = false;
    if(st.armed){
      for(var i=0;i<st.anoms.length;i++){
        var a = anomById(st.anoms[i]);
        if(a && a.field===r.k){ shown = Math.round(r.v*(1+a.alter/100)); imp = true; break; }
      }
    }
    return "<tr data-rk='"+r.k+"'><td>"+esc(r.label)+"</td>"+
      "<td class='mono' style='text-align:right'>"+fmtID(shown)+"</td>"+
      "<td style='font-size:.78rem;color:var(--ink-soft)'>"+esc(C.unitNote)+"</td></tr>";
  }).join("");
  var div = document.createElement("div");
  div.id = "imp-refcard";
  div.innerHTML =
    "<div class='honest' style='border-left-color:var(--ink)'>"+
    "<strong>📋 Referensi cepat — angka kunci filing.</strong> "+
    "Untuk kenyamanan, bukan pengganti filing asli. <strong>Verifikasi ke filing</strong> sebelum memakai angka ini — "+
    "analis yang baik tidak menyalin ringkasan buta."+
    "<div class='tblwrap' style='margin-top:.7rem'><table class='stmt figs'>"+
    "<thead><tr><th>Pos</th><th style='text-align:right'>Nilai</th><th>Satuan &amp; sumber</th></tr></thead>"+
    "<tbody>"+rows+"</tbody></table></div>"+
    "<p class='sub' style='margin:.6rem 0 0;font-size:.82rem'>⚠️ <strong>Catatan impostor:</strong> "+
    "beberapa drill di FSA Lab mengandung <em>impostor</em> — 1–2 anomali data halus yang disuntik "+
    "tanpa pemberitahuan ke kartu seperti ini. Kami tidak menandai drill mana yang sedang armed. "+
    "Satu-satunya cara menangkapnya: <strong>cek konsistensi</strong> (mekanik langkah 3) dan "+
    "cross-check dengan filing asli.</p></div>";
  var tbl = bstep.querySelector(".tblwrap");
  bstep.insertBefore(div, tbl);
}

/* ---------- field kecurigaan (langkah 4) ---------- */
function renderSuspicion(){
  var l4 = $("#s4-save");
  if(!l4) return;
  var body = l4.closest(".bstep-body");
  if(!body || $("#imp-susp")) return;
  var s5 = load(C.s5key);
  var locked = !!(s5 && s5.revealed);
  var prev = load(IMPFX+"_susp");
  var div = document.createElement("div");
  div.id = "imp-susp";
  div.innerHTML =
    "<div class='lens' style='border-style:dashed'>"+
    "<h3>🕵️ Kecurigaan impostor <span style='font-weight:400;font-size:.8rem'>(opsional)</span></h3>"+
    "<p class='q'>Apakah ada angka di kartu referensi yang menurutmu janggal / tidak konsisten? "+
    "Tulis kecurigaanmu di sini <strong>SEBELUM</strong> membuka benchmark. "+
    "Bila tebakanmu tepat, kamu dapat badge <em>Impostor spotted</em> di debrief.</p>"+
    "<textarea id='imp-susp-ta' placeholder='mis. Total aset di kartu tidak balance dengan liabilitas+ekuitas…'></textarea>"+
    (locked ? "<p class='cnt'>🔒 Terkunci bersama jawaban blind-mu.</p>" : "")+
    "</div>";
  body.insertBefore(div, l4.closest(".btnrow"));
  var ta = $("#imp-susp-ta");
  if(prev && prev.text) ta.value = prev.text;
  if(locked){ ta.disabled = true; return; }
  ta.addEventListener("change", function(){
    var t = ta.value.trim();
    save(IMPFX+"_susp", {text:t, ts:Date.now()});
  });
}

/* ---------- debrief (langkah 5, pasca-reveal) ---------- */
function suspicionSpotted(st){
  if(!st.armed || !st.anoms.length) return false;
  var prev = load(IMPFX+"_susp");
  if(!prev || !prev.text) return false;
  var s5 = load(C.s5key);
  if(s5 && s5.ts && prev.ts && prev.ts > s5.ts) return false; /* ditulis setelah reveal = tidak dihitung */
  var t = prev.text.toLowerCase();
  for(var i=0;i<st.anoms.length;i++){
    var a = anomById(st.anoms[i]);
    if(!a) continue;
    for(var j=0;j<a.kw.length;j++){
      if(t.indexOf(a.kw[j].toLowerCase())>=0) return a;
    }
  }
  return false;
}
function renderDebrief(){
  var host = $("#l5-content");
  if(!host || $("#imp-debrief")) return;
  var st = dayState();
  var h = "<div class='honest' id='imp-debrief' style='border-left-color:var(--ink)'>"+
    "<strong>🔍 Impostor check — debrief.</strong><br>";
  if(st.armed){
    h += "Drill ini <strong>MENGANDUNG impostor</strong> hari ini ("+st.anoms.length+" anomali di kartu referensi):<ol>";
    st.anoms.forEach(function(id){
      var a = anomById(id); if(!a) return;
      var av = alteredVal(a);
      h += "<li><strong>"+esc(a.label)+"</strong> diubah "+(a.alter>0?"+":"")+a.alter+"%: "+
        "asli <span class='mono'>"+fmtID(av.orig)+"</span> → tampil <span class='mono'>"+fmtID(av.shown)+"</span>.<br>"+
        "<span style='font-size:.85rem'>Mekanik penangkap: "+esc(a.catcher)+"</span></li>";
    });
    h += "</ol>";
    var hit = suspicionSpotted(st);
    if(hit){
      h += "<p style='font-size:1.05rem'>🎯 <strong>Impostor spotted!</strong> "+
        "Kamu menandai kejanggalan pada <strong>"+esc(hit.label)+"</strong> sebelum reveal. "+
        "Itulah cara analis bekerja: curiga dulu, buktikan dengan mekanik.</p>";
    } else {
      h += "<p class='sub'>Kamu tidak menandai kecurigaan sebelum reveal — tidak apa-apa. "+
        " lain kali: biasakan cek konsistensi kartu referensi (C1/C2 atau B1/B9) sebelum percaya angkanya.</p>";
    }
  } else {
    h += "Drill ini <strong>TIDAK mengandung</strong> impostor hari ini. "+
      "(Ketidakpastian adalah latihannya — drill yang sama bisa armed di hari lain. "+
      "Kebiasaan cek konsistensi tetap berlaku setiap saat.)";
  }
  h += "<p class='sub' style='margin-bottom:0'>Benchmark tidak tercemar: file benchmark tetap angka filing asli — "+
    "anomali hanya hidup di layer presentasi kartu referensi.</p></div>";
  var tmp = document.createElement("div");
  tmp.innerHTML = h;
  host.insertBefore(tmp.firstChild, host.firstChild);
}
function hookReveal(){
  var s5 = load(C.s5key);
  if(s5 && s5.revealed){ renderDebrief(); return; }
  var btn = $("#reveal-btn");
  if(!btn) return;
  btn.addEventListener("click", function(){
    /* drill handler jalan dulu (confirm + set st5); cek tak lama setelahnya */
    setTimeout(function(){
      var s = load(C.s5key);
      if(s && s.revealed){
        renderDebrief();
        var ta = $("#imp-susp-ta"); if(ta) ta.disabled = true;
      }
    }, 600);
  });
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", function(){
  var st = dayState();
  renderRefCard(st);
  renderSuspicion();
  hookReveal();
});
})();
