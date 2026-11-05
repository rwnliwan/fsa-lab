/* FSA Lab — bungkus tabel lebar dalam scroll horizontal (mobile 390px, round-5).
   Menangani tabel statis di HTML MAUPUN tabel yang disuntik JS belakangan
   (ganti tab explorer me-replace #stmt-wrap). Tabel yang sudah berada di
   dalam wrapper scroll (.tblwrap/.kmp-wrap/.spread-scroll/.heat-scroll/
   .conv-scroll) dilewati. Di layar lebar wrapper tidak berpengaruh. */
(function(){
  "use strict";
  var WRAP_SEL = ".tblwrap,.kmp-wrap,.spread-scroll,.heat-scroll,.conv-scroll";
  function mark(w){
    /* Tandai wrapper yang benar-benar overflow: fade tepi + petunjuk "geser".
       Dijalankan via rAF agar layout sudah final (termasuk tabel JS-rendered). */
    requestAnimationFrame(function(){
      if(!w.isConnected) return;
      if(w.scrollWidth > w.clientWidth + 2){
        w.classList.add("scrollable");
        if(!w.nextElementSibling || !w.nextElementSibling.classList.contains("scrollhint")){
          var h = document.createElement("div");
          h.className = "scrollhint";
          h.textContent = "← geser tabel →";
          w.parentNode.insertBefore(h, w.nextSibling);
        }
      }
    });
  }
  function wrap(t){
    if(!t || !t.parentNode) return;
    if(t.closest(WRAP_SEL)) return;            /* sudah terbungkus */
    var w = document.createElement("div");
    w.className = "tblwrap";
    t.parentNode.insertBefore(w, t);
    w.appendChild(t);
    mark(w);
  }
  function sweep(root){
    if(!root || !root.querySelectorAll) return;
    var ts = root.querySelectorAll("table");
    for(var i = 0; i < ts.length; i++) wrap(ts[i]);
  }
  function init(){
    sweep(document);
    /* wrapper statis dari HTML (round-5) juga perlu ditandai */
    var ws = document.querySelectorAll(".tblwrap");
    for(var i = 0; i < ws.length; i++) mark(ws[i]);
    if(window.MutationObserver){
      new MutationObserver(function(muts){
        for(var k = 0; k < muts.length; k++){
          var nodes = muts[k].addedNodes;
          for(var i = 0; i < nodes.length; i++){
            var n = nodes[i];
            if(n.nodeType !== 1) continue;
            if(n.tagName === "TABLE") wrap(n); else sweep(n);
          }
        }
      }).observe(document.documentElement, {childList: true, subtree: true});
    }
  }
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
