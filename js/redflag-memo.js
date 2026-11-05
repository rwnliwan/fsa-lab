/* FSA Lab — Red-Flag Memo Builder. Lensa forensik: tiap temuan = observasi + angka
   dikutip + PERTANYAAN investigasi (bukan vonis) + urgensi + bukti + batasan + tindak lanjut.
   Impor drill, bilingual ID/EN, publish checklist. Contoh = PT Cemerlang Abadi (FIKTIF), ilustratif.
   ATURAN KERAS: nol literal benchmark di file ini — impor HANYA baca localStorage milik user. */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

function load(k){ try{ var v=JSON.parse(localStorage.getItem(k)); return v||null; }catch(e){ return null; } }
function save(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

var DRILLS = [
  {ns:"klbf", name:"Bedah Sendiri — KLBF", s4:"fsa_bs_klbf_s4", s5:"fsa_bs_klbf_s5", s0:null,
   emiten:"PT Kalbe Farma Tbk"},
  {ns:"bbri", name:"Bank Practice — BBRI", s4:"fsa_bp_bbri_s4", s5:"fsa_bp_bbri_s5", s0:null,
   emiten:"PT Bank Rakyat Indonesia Tbk"},
  {ns:"bbca", name:"Ujian — BBCA H1 2026", s4:"fsa_exam_bbca_s4", s5:"fsa_exam_bbca_s5",
   s0:"fsa_exam_bbca_s0", emiten:"PT Bank Central Asia Tbk"}
];

var KMETA="fsa_rf_meta", KID="fsa_rf_id", KEN="fsa_rf_en", KGATE="fsa_rf_gate";

/* flag = {o: observasi+angka, q: pertanyaan, s: sumber, u: watch|investigate|escalate, e: bukti} */
function blankFlag(){ return {o:"",q:"",s:"",u:"",e:""}; }

/* ---------- state ---------- */
var S = {
  meta: load(KMETA)||{},
  id: load(KID)||{flags:[], checked:[], next:[], s5:""},
  en: load(KEN)||{flags:[], checked:[], next:[], s5:""},
  gate: load(KGATE)||{disclaimer:false}
};
if(!S.id.flags.length) S.id.flags=[blankFlag()];
if(!S.en.flags.length) S.en.flags=[blankFlag()];
if(!S.id.checked.length) S.id.checked=[{c:"",r:""}];
if(!S.en.checked.length) S.en.checked=[{c:"",r:""}];
if(!S.id.next.length) S.id.next=[{t:"",f:""}];
if(!S.en.next.length) S.en.next=[{t:"",f:""}];
var coached = false;

function persist(){
  save(KMETA,S.meta); save(KID,S.id); save(KEN,S.en); save(KGATE,S.gate);
}

function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

/* ---------- impor drill ---------- */
function detectDrills(){
  var cards = $("#imp-cards"), found = 0;
  DRILLS.forEach(function(D){
    var s5 = load(D.s5);
    if(!(s5 && s5.revealed)) return;
    found++;
    var isCoached = false;
    if(D.s0){ var s0 = load(D.s0); if(s0 && s0.mode==="coached") isCoached = true; }
    var div = document.createElement("div");
    div.className = "imp-card";
    div.innerHTML = "<h4>"+D.name+(isCoached?'<span class="coached-tag">COACHED</span>':"")+"</h4>"+
      "<p>Reveal: "+new Date(s5.ts).toLocaleDateString("id-ID")+". Klik impor untuk pre-fill header + draft observasi flag dari lensa forensik-mu.</p>"+
      '<button class="btn" data-imp="'+D.ns+'">Impor →</button>';
    cards.appendChild(div);
  });
  if(found) $("#imp-note").style.display = "none";
  cards.addEventListener("click", function(e){
    var b = e.target.closest("[data-imp]"); if(!b) return;
    doImport(b.getAttribute("data-imp"));
  });
}

function doImport(ns){
  var D = DRILLS.filter(function(d){return d.ns===ns;})[0];
  var s4 = load(D.s4), s0 = D.s0 ? load(D.s0) : null;
  coached = !!(s0 && s0.mode==="coached");
  if(coached) $("#rf-coached-note").style.display = "block";
  if(!S.meta.emiten){
    S.meta.emiten = D.emiten;
    $("#rf-emiten").value = S.meta.emiten;
  }
  /* lensa forensik → draft observasi flag pertama (PERTANYAAN wajib manual) */
  var foren = s4 && s4.lenses ? String(s4.lenses.foren||"").trim() : "";
  if(foren){
    S.id.flags[0].o = S.id.flags[0].o || ("DRAFT dari "+D.name+" — tulis ulang sebagai observasi + angka dikutip:\n"+foren.slice(0,800));
    /* q SENGAJA dikosongkan — pertanyaan investigasi wajib ditulis sendiri */
    renderFlags(); persist(); refreshAll();
  }
  alert("Impor dari "+D.name+" selesai.\n\nObservasi flag #1 = draft dari lensa forensik-mu. PERTANYAAN, urgensi, sumber, bukti, dan tindak lanjut WAJIB kamu tulis sendiri.");
}

/* ---------- renderers ---------- */
function fld(id, lab, val, ph, rows){
  return '<div style="margin-bottom:.5rem"><label for="'+id+'" style="font-weight:600;font-size:.8rem;display:block;margin-bottom:.25rem">'+lab+'</label>'+
    '<textarea id="'+id+'" rows="'+(rows||2)+'" placeholder="'+esc(ph)+'" style="width:100%;font-family:var(--font-body);font-size:.88rem;border:2px solid var(--line);border-radius:8px;padding:.45rem .7rem;background:var(--paper)">'+esc(val)+'</textarea></div>';
}

var URGS = [["","— pilih urgensi —"],["watch","watch — pantau"],["investigate","investigate — selidiki"],["escalate","escalate — dalami serius"]];

function qBadge(q){
  var t = String(q||"").trim();
  if(!t) return "";
  return /\?/.test(t) ? ' <span class="q-ok">✓ ada tanda tanya</span>'
                      : ' <span class="q-bad">✗ belum berbentuk pertanyaan</span>';
}

function renderFlags(){
  var box = $("#flag-list"); box.innerHTML = "";
  ["ID","EN"].forEach(function(lang){
    var arr = lang==="ID" ? S.id.flags : S.en.flags;
    arr.forEach(function(f,i){
      var wrap = document.createElement("div");
      wrap.className = "flag-pt "+(lang==="ID"?"id-field":"en-field");
      var uopts = URGS.map(function(u){
        return '<option value="'+u[0]+'"'+(f.u===u[0]?" selected":"")+'>'+u[1]+"</option>";
      }).join("");
      wrap.innerHTML = "<h4>Red flag #"+(i+1)+
        (f.u?'<span class="urg urg-'+f.u+'">'+f.u+"</span>":"")+"</h4>"+
        fld("fo-"+lang+"-"+i, "Observasi + angka dikutip", f.o, "mis. Restitusi pajak naik 3,2x menjadi Rp406 M di tahun laba naik 53%")+
        fld("fq-"+lang+"-"+i, "Pertanyaan investigasi (WAJIB ada tanda tanya)"+qBadge(f.q), f.q, "mis. Apakah restitusi ini one-off administratif atau ada sengketa pajak yang belum diungkap?")+
        '<div style="margin-bottom:.5rem"><label for="fs-'+lang+'-'+i+'" style="font-weight:600;font-size:.8rem;display:block;margin-bottom:.25rem">Sumber (hal./catatan)</label>'+
        '<input id="fs-'+lang+'-'+i+'" value="'+esc(f.s)+'" placeholder="mis. Cat. 32, hal. 87" style="width:100%;font-family:var(--font-body);font-size:.88rem;border:2px solid var(--line);border-radius:8px;padding:.45rem .7rem;background:var(--paper)"></div>'+
        '<div style="margin-bottom:.5rem"><label for="fu-'+lang+'-'+i+'" style="font-weight:600;font-size:.8rem;display:block;margin-bottom:.25rem">Urgensi</label>'+
        '<select id="fu-'+lang+'-'+i+'" style="width:100%;font-family:var(--font-body);font-size:.88rem;border:2px solid var(--line);border-radius:8px;padding:.45rem .7rem;background:var(--paper)">'+uopts+"</select></div>"+
        fld("fe-"+lang+"-"+i, "Bukti pendukung (hal./catatan + temuan)", f.e, "mis. Cat. 32 hal. 87: tabel restitusi; bandingkan Cat. pajak tahun lalu hal. 81");
      box.appendChild(wrap);
    });
  });
  box.addEventListener("input", syncFlags);
  box.addEventListener("change", syncFlags);
}
function syncFlags(e){
  var t = e.target; if(!t.id) return;
  var m = t.id.match(/^(fo|fq|fs|fu|fe)-(ID|EN)-(\d)$/); if(!m) return;
  var arr = m[2]==="ID" ? S.id.flags : S.en.flags;
  var key = {fo:"o",fq:"q",fs:"s",fu:"u",fe:"e"}[m[1]];
  arr[+m[3]][key] = t.value;
  /* sinkron bukti EN↔ID? tidak — tiap bahasa mandiri */
  persist(); renderFlags(); refreshAll();
}

function renderChecked(){
  var box = $("#checked-list"); box.innerHTML = "";
  ["ID","EN"].forEach(function(lang){
    var arr = lang==="ID" ? S.id.checked : S.en.checked;
    arr.forEach(function(r,i){
      var wrap = document.createElement("div");
      wrap.className = "flag-pt "+(lang==="ID"?"id-field":"en-field");
      wrap.innerHTML = "<h4>Pengecekan "+(i+1)+"</h4>"+
        fld("cc-"+lang+"-"+i, "Apa yang dicek", r.c, "mis. Rekonsiliasi kas akhir BS vs arus kas")+
        fld("cr-"+lang+"-"+i, "Hasil (termasuk jalan buntu)", r.r, "mis. Cocok persis Rp21.440 (hal. 1 & 6)");
      box.appendChild(wrap);
    });
  });
  box.addEventListener("input", syncChecked);
}
function syncChecked(e){
  var t = e.target; if(!t.id) return;
  var m = t.id.match(/^(cc|cr)-(ID|EN)-(\d)$/); if(!m) return;
  var arr = m[2]==="ID" ? S.id.checked : S.en.checked;
  arr[+m[3]][{cc:"c",cr:"r"}[m[1]]] = t.value;
  persist(); refreshAll();
}

function renderNext(){
  var box = $("#next-list"); box.innerHTML = "";
  ["ID","EN"].forEach(function(lang){
    var arr = lang==="ID" ? S.id.next : S.en.next;
    arr.forEach(function(r,i){
      var wrap = document.createElement("div");
      wrap.className = "flag-pt "+(lang==="ID"?"id-field":"en-field");
      wrap.innerHTML = "<h4>Tindak lanjut "+(i+1)+"</h4>"+
        fld("nt-"+lang+"-"+i, "Tindak lanjut (konkret + trigger selesai)", r.t, "mis. Minta klarifikasi IR soal restitusi; selesai bila ada penjelasan tertulis")+
        '<div style="margin-bottom:.5rem"><label for="nf-'+lang+'-'+i+'" style="font-weight:600;font-size:.8rem;display:block;margin-bottom:.25rem">Untuk flag nomor</label>'+
        '<input id="nf-'+lang+'-'+i+'" value="'+esc(r.f)+'" placeholder="mis. 1" style="width:6rem;font-family:var(--font-body);font-size:.88rem;border:2px solid var(--line);border-radius:8px;padding:.45rem .7rem;background:var(--paper)"></div>';
      box.appendChild(wrap);
    });
  });
  box.addEventListener("input", syncNext);
}
function syncNext(e){
  var t = e.target; if(!t.id) return;
  var m = t.id.match(/^(nt|nf)-(ID|EN)-(\d)$/); if(!m) return;
  var arr = m[2]==="ID" ? S.id.next : S.en.next;
  arr[+m[3]][{nt:"t",nf:"f"}[m[1]]] = t.value;
  persist(); refreshAll();
}

/* ---------- gates ---------- */
var VERDICT_WORDS = ["terbukti","manipulasi","curang","penipuan","memalsukan","dipalsukan",
  "menggelapkan","skandal","fraud","dakwa","tuduh","bersalah"];

function hardGates(){
  var flags = S.id.flags;
  var g1 = flags.length >= 1 && flags.some(function(f){ return String(f.o||"").trim(); });
  var noQ = flags.filter(function(f){
    return String(f.o||"").trim() && !/\?/.test(String(f.q||""));
  }).length;
  var noSrc = flags.filter(function(f){
    return String(f.o||"").trim() && !String(f.s||"").trim();
  }).length;
  var g4 = String(S.id.s5||"").trim().length >= 20;
  var g5 = !!S.gate.disclaimer;
  return [
    {t:"≥1 red flag terisi (S2)", ok:g1},
    {t:"Setiap flag punya PERTANYAAN (tanda tanya)"+(noQ?" — "+noQ+" flag belum":""), ok:!noQ},
    {t:"Setiap flag punya sumber"+(noSrc?" — "+noSrc+" flag belum":""), ok:!noSrc},
    {t:"≥1 batasan dinyatakan eksplisit (S5)", ok:g4},
    {t:"Disclaimer analis ritel independen dicentang (investigasi, BUKAN dakwaan)", ok:g5}
  ];
}
function softGates(){
  var warn = [];
  /* kata vonis */
  var hit = [];
  S.id.flags.forEach(function(f,i){
    var txt = (String(f.o||"")+" "+String(f.q||"")).toLowerCase();
    VERDICT_WORDS.forEach(function(w){
      if(txt.indexOf(w)>=0 && hit.indexOf("flag #"+(i+1)+": "+w)<0) hit.push("flag #"+(i+1)+": «"+w+"»");
    });
  });
  warn.push({t: hit.length? "Kata bernada vonis terdeteksi — "+hit.join(", ")+". Ingat: red flag is a question."
                          : "Tidak ada kata vonis di flag ✓", ok:!hit.length});
  /* angka dikutip */
  var nonum = S.id.flags.filter(function(f){
    return String(f.o||"").trim() && !/\d/.test(String(f.o||""));
  }).length;
  warn.push({t:"Angka dikutip di tiap observasi"+(nonum?" — "+nonum+" flag tanpa angka":" ✓"), ok:!nonum});
  /* urgensi terisi */
  var nourg = S.id.flags.filter(function(f){
    return String(f.o||"").trim() && !f.u;
  }).length;
  warn.push({t:"Urgensi terisi semua flag"+(nourg?" — "+nourg+" belum":" ✓"), ok:!nourg});
  /* S4 terisi */
  var chk = S.id.checked.filter(function(r){ return String(r.c||"").trim(); }).length;
  warn.push({t:"S4 pengecekan tercatat — sekarang "+chk, ok:chk>=1});
  /* S6 terisi */
  var nxt = S.id.next.filter(function(r){ return String(r.t||"").trim(); }).length;
  warn.push({t:"S6 tindak lanjut — sekarang "+nxt, ok:nxt>=1});
  return warn;
}

function renderGates(){
  var hg = $("#gate-hard"); hg.innerHTML = "";
  var all = true;
  hardGates().forEach(function(g){
    if(!g.ok) all = false;
    var li = document.createElement("li");
    li.className = g.ok ? "ok" : "";
    li.innerHTML = '<span class="st">'+(g.ok?"✓ LULUS":"✗ BELUM")+"</span><span>"+esc(g.t)+"</span>";
    hg.appendChild(li);
  });
  var sg = $("#gate-soft"); sg.innerHTML = "";
  softGates().forEach(function(g){
    var li = document.createElement("li");
    li.className = "gate-soft"+(g.ok?" ok":"");
    li.innerHTML = '<span class="st">'+(g.ok?"✓":"⚠")+"</span><span>"+esc(g.t)+"</span>";
    sg.appendChild(li);
  });
  $("#copy-id").disabled = !all;
  $("#copy-en").disabled = !all;
}

/* ---------- memo text ---------- */
var URG_ID = {watch:"WATCH — pantau", investigate:"INVESTIGATE — selidiki", escalate:"ESCALATE — dalami serius"};

function buildMemo(lang){
  var m = S.meta, D = lang==="ID" ? S.id : S.en;
  var L = [];
  L.push("RED-FLAG MEMO — " + (m.emiten||"[emiten]") + (coached?" [COACHED]":""));
  L.push((m.ticker?m.ticker+" · ":"")+(m.periode||"")+" · As-of: "+(m.asof||"—"));
  L.push("Satuan: "+(m.ccy||"—")+" · Basis: "+(m.basis||"—"));
  L.push("Sumber: "+(m.src||"—"));
  L.push("");
  L.push("RED FLAGS — pertanyaan investigasi, bukan vonis");
  D.flags.forEach(function(f,i){
    if(!String(f.o||"").trim() && !String(f.q||"").trim()) return;
    L.push((i+1)+". ["+(URG_ID[f.u]||"urgensi belum diisi")+"]");
    L.push("   Observasi: "+(f.o||"—"));
    L.push("   Pertanyaan: "+(f.q||"—"));
    L.push("   Sumber: "+(f.s||"—"));
    if(String(f.e||"").trim()) L.push("   Bukti: "+f.e);
  });
  L.push("");
  L.push("YANG SUDAH DICEK");
  D.checked.forEach(function(r){
    if(!String(r.c||"").trim() && !String(r.r||"").trim()) return;
    L.push("• "+(r.c||"—")+" → "+(r.r||"—"));
  });
  L.push("");
  L.push("BATASAN MEMO");
  L.push(D.s5||"[belum ditulis]");
  L.push("");
  L.push("TINDAK LANJUT");
  D.next.forEach(function(r,i){
    if(!String(r.t||"").trim()) return;
    L.push((i+1)+". "+r.t+(r.f?" (flag #"+r.f+")":""));
  });
  L.push("");
  L.push("— Disusun dengan Red-Flag Memo Builder FSA Lab. Analis ritel independen; investigasi, BUKAN dakwaan. A red flag is a question, not a conviction.");
  return L.join("\n");
}

/* ---------- init ---------- */
var META_IDS = ["rf-emiten","rf-ticker","rf-periode","rf-asof","rf-ccy","rf-basis","rf-src"];
function syncMeta(){
  META_IDS.forEach(function(id){
    var el = document.getElementById(id); if(!el) return;
    S.meta[{ "rf-emiten":"emiten","rf-ticker":"ticker","rf-periode":"periode","rf-asof":"asof",
      "rf-ccy":"ccy","rf-basis":"basis","rf-src":"src" }[id]] = el.value;
  });
  persist();
}

function init(){
  var rmap = {"rf-emiten":"emiten","rf-ticker":"ticker","rf-periode":"periode","rf-asof":"asof",
    "rf-ccy":"ccy","rf-basis":"basis","rf-src":"src"};
  Object.keys(rmap).forEach(function(k){
    var el = document.getElementById(k); if(el && S.meta[rmap[k]]) el.value = S.meta[rmap[k]];
  });
  $("#rf-s5").value = S.id.s5||"";
  $("#rf-s5-en").value = S.en.s5||"";
  detectDrills();
  renderFlags(); renderChecked(); renderNext();

  META_IDS.forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.addEventListener("input", function(){ syncMeta(); refreshAll(); });
  });
  $("#rf-s5").addEventListener("input", function(){ S.id.s5=this.value; persist(); refreshAll(); });
  $("#rf-s5-en").addEventListener("input", function(){ S.en.s5=this.value; persist(); refreshAll(); });

  var dwrap = document.createElement("div");
  dwrap.style.cssText = "margin:.8rem 0;padding:.7rem 1rem;border:2px dashed var(--ink);border-radius:10px;font-size:.85rem";
  dwrap.innerHTML = '<label><input type="checkbox" id="rf-disclaimer"'+(S.gate.disclaimer?" checked":"")+'> '+
    'Saya analis ritel independen; memo ini untuk investigasi/edukasi, <strong>BUKAN dakwaan atau rekomendasi</strong>.</label>';
  $("#gate-hard").before(dwrap);
  $("#rf-disclaimer").addEventListener("change", function(){ S.gate.disclaimer=this.checked; persist(); refreshAll(); });

  $("#flag-add").addEventListener("click", function(){
    if(S.id.flags.length>=8){ alert("Maksimal 8 red flags — prioritaskan yang paling material."); return; }
    S.id.flags.push(blankFlag()); S.en.flags.push(blankFlag());
    renderFlags(); persist();
  });
  $("#checked-add").addEventListener("click", function(){
    S.id.checked.push({c:"",r:""}); S.en.checked.push({c:"",r:""});
    renderChecked(); persist();
  });
  $("#next-add").addEventListener("click", function(){
    S.id.next.push({t:"",f:""}); S.en.next.push({t:"",f:""});
    renderNext(); persist();
  });

  $("#lang-id").addEventListener("click", function(){
    document.body.classList.remove("lang-en");
    $("#lang-id").classList.add("on"); $("#lang-en").classList.remove("on"); refreshAll();
  });
  $("#lang-en").addEventListener("click", function(){
    document.body.classList.add("lang-en");
    $("#lang-en").classList.add("on"); $("#lang-id").classList.remove("on"); refreshAll();
  });

  function doCopy(lang){
    var t = buildMemo(lang);
    navigator.clipboard.writeText(t).then(function(){
      var m=$("#copy-msg"); m.style.visibility="visible";
      setTimeout(function(){ m.style.visibility="hidden"; },2500);
    });
  }
  $("#copy-id").addEventListener("click", function(){ doCopy("ID"); });
  $("#copy-en").addEventListener("click", function(){ doCopy("EN"); });

  refreshAll();
}

function refreshAll(){
  renderGates();
  var lang = document.body.classList.contains("lang-en") ? "EN" : "ID";
  $("#rf-preview").textContent = buildMemo(lang);
}

document.addEventListener("DOMContentLoaded", init);
})();
