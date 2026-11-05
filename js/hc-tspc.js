/* FSA Lab — Healthcare guided TSPC: progres mini-lab + tombol selesai.
   Namespace localStorage: fsa_hc_tspc_* (fsa_hc_tspc_lab<N>, fsa_hc_tspc_done).
   Registry case-registry.js membaca fsa_hc_tspc_done untuk status "selesai".
   CSP-clean: tanpa inline handler. */
(function(){
  "use strict";
  var NS = "fsa_hc_tspc_";
  function load(k){ try{ return localStorage.getItem(NS+k); }catch(e){ return null; } }
  function save(k,v){ try{ localStorage.setItem(NS+k, v); }catch(e){} }

  var boxes = document.querySelectorAll('input[type=checkbox][data-lab]');
  var btn = document.getElementById("btn-done");
  var prog = document.getElementById("prog");
  if(!boxes.length || !btn) return;

  function refresh(){
    var done = 0;
    boxes.forEach(function(b){
      var key = "lab" + b.getAttribute("data-lab");
      if(load(key) === "1"){ b.checked = true; done++; }
    });
    var finished = load("done") === "1";
    btn.disabled = finished;
    btn.textContent = finished ? "Selesai ✓ (tersimpan)" : "Tandai selesai ✓";
    prog.textContent = finished
      ? "Case selesai. Penilaian tingkat kesulitan ada di Perpustakaan Kasus."
      : "Mini-lab selesai: " + done + "/" + boxes.length + ".";
  }

  boxes.forEach(function(b){
    b.addEventListener("change", function(){
      save("lab" + b.getAttribute("data-lab"), b.checked ? "1" : "0");
      refresh();
    });
  });
  btn.addEventListener("click", function(){
    save("done", "1");
    refresh();
  });
  refresh();
})();
