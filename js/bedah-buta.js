/* FSA Lab — Bedah Buta: rubrik self-check + log drill (localStorage) */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };
var LS_KEY = "fsa_bedahbuta_log";

/* ---------- Rubrik self-check ---------- */
var boxes = $$("#rubric input[type=checkbox]");
var verdict = $("#rubric-verdict");
function renderVerdict(){
  var n = boxes.filter(function(b){ return b.checked; }).length;
  var items = $$("#rubric li");
  boxes.forEach(function(b, i){ items[i].classList.toggle("done", b.checked); });
  if(n === 6){
    verdict.innerHTML = "<strong>6/6 — drill SAH. ✓</strong> Vonis 5 barismu memenuhi standar analis lab ini. " +
      "Catat emiten + vonis 1 kalimat di log drill di bawah.";
  } else {
    verdict.textContent = n + "/6 — " + (n === 0
      ? "centang rubrik di atas — verdict drill muncul di sini."
      : "belum sah. Lengkapi yang belum dicentang sebelum mencatat drill.");
  }
}
boxes.forEach(function(b){ b.addEventListener("change", renderVerdict); });
renderVerdict();

/* ---------- Log drill ---------- */
function loadLog(){
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch(e){ return []; }
}
function saveLog(arr){
  try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch(e){}
}
function esc(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function renderLog(){
  var arr = loadLog();
  var box = $("#log-list");
  if(!arr.length){
    box.innerHTML = "<p style='font-size:.88rem;color:var(--ink-soft)'>Belum ada drill tercatat. " +
      "Selesaikan 1 drill buta 6/6, lalu catat di sini.</p>";
    return;
  }
  box.innerHTML = arr.map(function(e, i){
    return "<div class='log-item'><div><strong>" + esc(e.emiten) + "</strong><br>" +
      "<span style='color:var(--ink-soft)'>" + esc(e.vonis) + "</span></div>" +
      "<div style='text-align:right;white-space:nowrap'><span class='d'>" + esc(e.tanggal) + "</span><br>" +
      "<button class='btn-sm danger' data-del='" + i + "'>hapus</button></div></div>";
  }).join("");
  $$("#log-list [data-del]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var a = loadLog();
      a.splice(parseInt(btn.getAttribute("data-del"), 10), 1);
      saveLog(a); renderLog();
    });
  });
}
$("#log-add").addEventListener("click", function(){
  var emiten = $("#log-emiten").value.trim();
  var tanggal = $("#log-tanggal").value;
  var vonis = $("#log-vonis").value.trim();
  if(!emiten || !tanggal || !vonis){
    alert("Isi ketiga kolom dulu: emiten, tanggal, dan vonis 1 kalimat.");
    return;
  }
  var n = boxes.filter(function(b){ return b.checked; }).length;
  if(n < 6 && !confirm("Rubrik baru " + n + "/6 — drill belum memenuhi standar. Tetap catat?")){
    return;
  }
  var a = loadLog();
  a.unshift({emiten: emiten, tanggal: tanggal, vonis: vonis});
  saveLog(a); renderLog();
  $("#log-emiten").value = ""; $("#log-tanggal").value = ""; $("#log-vonis").value = "";
});
renderLog();
})();
