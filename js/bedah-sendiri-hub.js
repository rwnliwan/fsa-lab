/* FSA Lab — Bedah Sendiri hub: status drill per emiten (localStorage) */
(function(){
"use strict";
function load(k){ try{ var v=JSON.parse(localStorage.getItem(k)); return v||null; }catch(e){ return null; } }
function paint(prefix, elId, linkId){
  var el=document.getElementById(elId);
  if(!el) return;
  var s1=load(prefix+"_s1"), s5=load(prefix+"_s5");
  if(s5&&s5.revealed){
    var d=new Date(s5.ts);
    el.className="st done";
    el.textContent="✓ Drill tercatat — benchmark dibuka "+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()+".";
    var lk=document.getElementById(linkId);
    if(lk) lk.textContent="Lihat hasil / ulangi →";
  }else if(s1&&s1.read){
    el.className="st prog";
    el.textContent="◐ Sedang berjalan — langkah 1 selesai.";
  }else{
    el.className="st todo";
    el.textContent="○ Belum mulai.";
  }
}
document.addEventListener("DOMContentLoaded",function(){
  paint("fsa_bs_klbf","klbf-status","klbf-link");
  paint("fsa_bp_bbri","bbri-status","bbri-link");
  paint("fsa_bs_mika","mika-status","mika-link");
});
})();
