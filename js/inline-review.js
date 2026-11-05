/* === review/index.html — blok inline #1 (dipindah ke file eksternal agar CSP script-src 'self' tanpa 'unsafe-inline') === */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var INTERVALS = [1, 3, 7, 14, 30]; // hari, untuk box 0..4
var MAX_PER_DAY = 20;
var DAY = 86400000;

function gatePassed(m){
  try{ return localStorage.getItem("fsa_gate_m"+m) === "lolos"; }catch(e){ return false; }
}
function stKey(m, i){ return "fsa_sr_"+m+"_"+i; }
function stKeyV(vid){ return "fsa_srv_"+vid; }
function getState(key){
  try{
    var s = JSON.parse(localStorage.getItem(key) || "null");
    if(s && typeof s.box === "number" && typeof s.due === "number") return s;
  }catch(e){}
  return {box:0, due:0};
}
function setState(key, s){
  try{ localStorage.setItem(key, JSON.stringify(s)); }catch(e){}
}
function logMistake(m, qid){
  try{ if(window.FSAMistake) window.FSAMistake.log(m, qid, "review"); }catch(e){}
}

/* ---------- panel Topik Lemah ---------- */
function renderLemah(){
  var box = $("#lemah-body");
  if(!window.FSAMistake){ box.innerHTML = ""; return; }
  var agg = window.FSAMistake.byModule().slice(0, 8);
  if(!agg.length){
    box.innerHTML = '<div class="gate-box" style="display:block"><p>Belum ada kesalahan tercatat. '
      + 'Setiap jawaban quiz &amp; review yang salah akan muncul di sini, diurut dari yang paling sering salah.</p></div>';
    return;
  }
  var h = '<div class="tblwrap"><table class="stmt"><thead><tr><th>Modul</th><th>Salah</th><th>Ulangi</th></tr></thead><tbody>';
  agg.forEach(function(e){
    var meta = window.FSAMistake.MODUL[e.m] || {t:"Modul "+e.m, pg:["case-files/","Case Files"]};
    h += '<tr><td><strong>M'+e.m+'</strong> — '+meta.t+'</td>'
      + '<td class="lemah-count">'+e.n+'×</td>'
      + '<td><a href="../modul-'+e.m+'/">Modul '+e.m+' →</a> · <a href="../'+meta.pg[0]+'">'+meta.pg[1]+' →</a></td></tr>';
  });
  h += '</tbody></table></div>'
    + '<p style="margin-top:.6rem"><button class="btn" id="lemah-clear">Hapus riwayat kesalahan</button></p>';
  box.innerHTML = h;
  $("#lemah-clear").addEventListener("click", function(){
    if(confirm("Hapus semua riwayat kesalahan?")){ window.FSAMistake.clear(); renderLemah(); }
  });
}
renderLemah();

/* ---------- kumpulkan soal jatuh tempo (bank + varian) ---------- */
var maxM = 0;
(REVIEW_BANK || []).forEach(function(q){ if(q.m > maxM) maxM = q.m; });
var passedModules = [];
for(var m = 1; m <= maxM; m++){ if(gatePassed(m)) passedModules.push(m); }
var body = $("#sr-body");

if(passedModules.length === 0){
  body.innerHTML = '<div class="gate-box" style="display:block"><h3>Belum ada modul yang lolos</h3>'
    + '<p>Selesaikan minimal 1 modul dulu (quiz ≥80%) — soal dari modul yang lolos akan muncul di sini.</p>'
    + '<p><a href="../index.html">← Kembali ke FSA Lab</a></p></div>';
  return;
}

var now = Date.now();
var due = [];
(REVIEW_BANK || []).forEach(function(q, gi){
  if(passedModules.indexOf(q.m) < 0) return;
  var s = getState(stKey(q.m, gi));
  if(s.due <= now) due.push({q:q, key:stKey(q.m, gi), st:s, qid:"b"+gi, varian:false});
});
var VARIANTS = (typeof REVIEW_VARIANTS !== "undefined") ? REVIEW_VARIANTS : [];
VARIANTS.forEach(function(v){
  if(passedModules.indexOf(v.m) < 0) return;
  var s = getState(stKeyV(v.id));
  if(s.due <= now) due.push({q:v, key:stKeyV(v.id), st:s, qid:v.id, varian:true});
});
due.sort(function(a, b){ return a.st.due - b.st.due; });
due = due.slice(0, MAX_PER_DAY);

var pos = 0, doneToday = 0, correctToday = 0;

function renderCard(){
  if(pos >= due.length){
    body.innerHTML = '<div class="gate-box" style="display:block"><h3>Sesi selesai ✓</h3>'
      + '<p>Hari ini: <strong>'+correctToday+"/"+doneToday+'</strong> benar. '
      + (due.length ? "Soal yang salah akan kembali besok — soal yang benar muncul lagi sesuai intervalnya."
                    : "Tidak ada soal yang jatuh tempo. Nikmati harimu — review berikutnya menunggu.") + '</p>'
      + '<p><a href="../index.html">← Kembali ke FSA Lab</a></p></div>';
    return;
  }
  var item = due[pos], q = item.q;
  var h = '<div class="sr-progress">Soal '+(pos+1)+" / "+due.length
    + " · hari ini "+correctToday+"/"+doneToday+' benar</div>';
  h += '<div class="quiz-q" id="srq"><h3><span class="tag">M'+q.m+'</span> '+q.q
    + (item.varian ? '<span class="varian-tag">varian</span>' : '<span class="sr-box">kotak '+item.st.box+'</span>')
    + '</h3>';
  q.o.forEach(function(o, j){
    h += '<label><input type="radio" name="sr" value="'+j+'"> '+o+'</label>';
  });
  h += '</div><button class="btn btn-primary" id="sr-check">Cek Jawaban</button>'
    + '<div class="pg-result" id="sr-res"></div>'
    + '<button class="btn sr-next" id="sr-next">Soal berikutnya →</button>';
  body.innerHTML = h;
  $("#sr-check").addEventListener("click", function(){ check(item); });
  $("#sr-next").addEventListener("click", function(){ pos++; renderCard(); });
}

function check(item){
  var sel = document.querySelector('input[name="sr"]:checked');
  var r = $("#sr-res");
  r.className = "pg-result show";
  if(!sel){ r.innerHTML = "Pilih satu jawaban dulu."; return; }
  var ok = +sel.value === item.q.a;
  var labels = document.querySelectorAll("#srq label");
  labels.forEach(function(lb, j){
    lb.classList.remove("right","wrong");
    if(j === item.q.a) lb.classList.add("right");
    else if(+sel.value === j) lb.classList.add("wrong");
  });
  var box = ok ? Math.min(item.st.box + 1, INTERVALS.length - 1) : 0;
  setState(item.key, {box: box, due: Date.now() + INTERVALS[box]*DAY});
  doneToday++; if(ok) correctToday++;
  if(!ok) logMistake(item.q.m, item.qid);
  r.innerHTML = (ok ? "<strong>Benar ✓</strong> — kotak "+item.st.box+" → "+box
                    + " · muncul lagi dalam "+INTERVALS[box]+" hari."
                   : "<strong>Belum tepat.</strong> — kembali ke kotak 0 · muncul lagi besok.")
    + (item.varian && item.q.cara ? '<div class="cara">Cara hitung: '+item.q.cara+'</div>' : "")
    + (!item.varian && !ok && item.q.why ? '<div class="cara">Kenapa: '+item.q.why+'</div>' : "");
  $("#sr-check").style.display = "none";
  $("#sr-next").style.display = "inline-block";
  renderLemah();
}

/* ---------- Ekspor / Impor progres (JSON) ---------- */
var IO_PREFIX = "fsa_";
function collectProgress(){
  var data = {};
  try{
    for(var i = 0; i < localStorage.length; i++){
      var k = localStorage.key(i);
      if(k && k.indexOf(IO_PREFIX) === 0) data[k] = localStorage.getItem(k);
    }
  }catch(e){}
  return data;
}
function ioMsg(t){ var el = $("#io-msg"); if(el) el.textContent = t; }
function ioPad(n){ return (n < 10 ? "0" : "") + n; }
function parseSR(raw){
  try{
    var s = JSON.parse(raw);
    if(s && typeof s.box === "number" && typeof s.due === "number") return s;
  }catch(e){}
  return null;
}
/* Merge aman: kotak SM-2 hanya naik (tak pernah turun), due terbaru menang bila seri. */
function mergeSR(key, impRaw){
  var cur = null, imp = parseSR(impRaw);
  try{ cur = parseSR(localStorage.getItem(key)); }catch(e){}
  if(!imp) return false;
  if(!cur || imp.box > cur.box || (imp.box === cur.box && imp.due > cur.due)){
    try{ localStorage.setItem(key, JSON.stringify({box: imp.box, due: imp.due})); return true; }
    catch(e){ return false; }
  }
  return false;
}
/* Merge aman: union mistake log by (m,q,k), timestamp terbaru menang, cap 500. */
function mergeMistakes(impRaw){
  var cur = [], imp = [];
  try{ cur = JSON.parse(localStorage.getItem("fsa_mistakes") || "[]"); }catch(e){}
  try{ imp = JSON.parse(impRaw); }catch(e){}
  if(!Array.isArray(cur)) cur = [];
  if(!Array.isArray(imp)) return 0;
  var map = {};
  cur.forEach(function(e){ if(e && e.m !== undefined && e.q) map[e.m + "|" + e.q + "|" + e.k] = e; });
  var added = 0;
  imp.forEach(function(e){
    if(!e || e.m === undefined || !e.q) return;
    var k = e.m + "|" + e.q + "|" + e.k, old = map[k];
    if(!old || (e.t || 0) > (old.t || 0)){ map[k] = e; added++; }
  });
  var list = Object.keys(map).map(function(k){ return map[k]; })
    .sort(function(a, b){ return (b.t || 0) - (a.t || 0); }).slice(0, 500);
  try{ localStorage.setItem("fsa_mistakes", JSON.stringify(list)); }catch(e){}
  return added;
}
var btnExport = $("#btn-export"), btnImport = $("#btn-import"), fileImport = $("#file-import");
if(btnExport) btnExport.addEventListener("click", function(){
  var payload = {app: "fsa-lab", version: 1, exportedAt: new Date().toISOString(), data: collectProgress()};
  var blob = new Blob([JSON.stringify(payload, null, 2)], {type: "application/json"});
  var a = document.createElement("a"), d = new Date();
  a.href = URL.createObjectURL(blob);
  a.download = "fsa-lab-progres-" + d.getFullYear() + ioPad(d.getMonth() + 1) + ioPad(d.getDate()) + ".json";
  document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500);
  ioMsg("Progres diunduh (" + Object.keys(payload.data).length + " kunci). Simpan file-nya baik-baik.");
});
if(btnImport) btnImport.addEventListener("click", function(){ fileImport.click(); });
if(fileImport) fileImport.addEventListener("change", function(ev){
  var f = ev.target.files && ev.target.files[0];
  if(!f) return;
  var rd = new FileReader();
  rd.onload = function(){
    try{
      var p = JSON.parse(rd.result);
      if(!p || p.app !== "fsa-lab" || !p.data || typeof p.data !== "object") throw new Error("bad");
      var nGate = 0, nSR = 0, nFill = 0, nMis = 0, nSkip = 0;
      Object.keys(p.data).forEach(function(k){
        var v = p.data[k];
        if(k.indexOf(IO_PREFIX) !== 0 || typeof v !== "string"){ nSkip++; return; }
        if(k.indexOf("fsa_gate_") === 0){
          if(v === "lolos"){ try{ localStorage.setItem(k, "lolos"); nGate++; }catch(e){} }
        }else if(k.indexOf("fsa_sr_") === 0 || k.indexOf("fsa_srv_") === 0){
          if(mergeSR(k, v)) nSR++;
        }else if(k === "fsa_mistakes"){
          nMis += mergeMistakes(v);
        }else{
          /* Jurnal / catatan / toolkit: isi hanya bila lokal kosong — jangan timpa tulisan yang lebih baru. */
          var cur = null;
          try{ cur = localStorage.getItem(k); }catch(e){}
          if((cur === null || cur === "") && v !== ""){ try{ localStorage.setItem(k, v); nFill++; }catch(e){} }
        }
      });
      ioMsg("Impor selesai: " + nGate + " gate, " + nSR + " status review diperbarui, " +
        nMis + " catatan kesalahan digabung, " + nFill + " teks diisi." +
        (nSkip ? " " + nSkip + " kunci asing diabaikan." : "") + " Memuat ulang…");
      setTimeout(function(){ location.reload(); }, 1200);
    }catch(e){
      ioMsg("File tidak valid: bukan file ekspor progres FSA Lab.");
    }
    ev.target.value = "";
  };
  rd.readAsText(f);
});

renderCard();
})();
