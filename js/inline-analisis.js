/* === analisis-mingguan/index.html — blok inline #1 (dipindah ke file eksternal agar CSP script-src 'self' tanpa 'unsafe-inline') === */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
function todayKey(){
  var d = new Date();
  var p = function(n){ return (n < 10 ? "0" : "") + n; };
  return "fsa_note_" + d.getFullYear() + p(d.getMonth()+1) + p(d.getDate());
}
function fmtKey(k){
  return k.slice(9,13) + "-" + k.slice(13,15) + "-" + k.slice(15,17);
}
var K = todayKey();
function loadToday(){
  var raw = null;
  try{ raw = localStorage.getItem(K); }catch(e){}
  if(raw){
    try{
      var o = JSON.parse(raw);
      $("#note-id").value = o.id || ""; $("#note-en").value = o.en || "";
      $("#note-status").textContent = "Note hari ini tersimpan ✓ (" + fmtKey(K) + ")";
    }catch(e){}
  }
}
function listNotes(){
  var keys = [];
  try{
    for(var i = 0; i < localStorage.length; i++){
      var k = localStorage.key(i);
      if(k && k.indexOf("fsa_note_") === 0) keys.push(k);
    }
  }catch(e){}
  keys.sort().reverse();
  var h = "";
  if(!keys.length) h = '<p class="sub">Belum ada note tersimpan. Tulis yang pertama minggu ini.</p>';
  keys.forEach(function(k){
    h += '<div class="note-item"><span class="d">' + fmtKey(k) + '</span><span class="acts">'
      + '<button class="btn-sm" data-read="' + k + '">Baca</button>'
      + '<button class="btn-sm danger" data-del="' + k + '">Hapus</button></span></div>';
  });
  $("#note-list").innerHTML = h;
  Array.prototype.forEach.call(document.querySelectorAll("[data-read]"), function(b){
    b.addEventListener("click", function(){
      var o = {};
      try{ o = JSON.parse(localStorage.getItem(b.dataset.read) || "{}"); }catch(e){}
      var r = $("#note-read");
      r.style.display = "block";
      r.innerHTML = "=== " + fmtKey(b.dataset.read) + " · INDONESIA ===\n" + (o.id || "(kosong)")
        + "\n\n=== ENGLISH ===\n" + (o.en || "(kosong)");
      r.scrollIntoView({behavior:"smooth", block:"center"});
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-del]"), function(b){
    b.addEventListener("click", function(){
      if(confirm("Hapus note " + fmtKey(b.dataset.del) + "?")){
        try{ localStorage.removeItem(b.dataset.del); }catch(e){}
        $("#note-read").style.display = "none";
        listNotes();
      }
    });
  });
}
$("#note-save").addEventListener("click", function(){
  var o = {id: $("#note-id").value, en: $("#note-en").value};
  try{
    localStorage.setItem(K, JSON.stringify(o));
    $("#note-status").textContent = "Tersimpan ✓ (" + fmtKey(K) + " — " + new Date().toLocaleTimeString("id-ID") + ")";
  }catch(e){ $("#note-status").textContent = "Gagal menyimpan (storage penuh?)."; }
  listNotes();
});
loadToday(); listNotes();
})();
