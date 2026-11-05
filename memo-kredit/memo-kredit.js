/* FSA Lab — Credit Memo Builder. 5 langkah terpandu → teks memo siap salin.
   Angka default = PT Cemerlang (FIKTIF), angka kanonis M18/M24, ILUSTRATIF. */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };

// Spread kanonis Cemerlang (Rp juta, ilustratif). 2026 = forecast M18.
var YEARS = ["2024", "2025", "2026F"];
var SPREAD = [
  {l:"Penjualan",        v:[400000, 520000, 598000]},
  {l:"EBITDA",           v:[70000, 102000, 120000]},   // 2025 = kanonis; 2024 & 2026F ilustratif
  {l:"Laba bersih",      v:[29640, 45240, 53449]},
  {l:"Utang berbunga",   v:[240000, 201440, 250000]},  // F2-R14: basis utang berbunga (bukan total liabilitas 272.000); 2025 = kanonis; 2024 & 2026F ilustratif
  {l:"Ekuitas",          v:[140200, 179440, 190000]},
  {l:"Beban bunga",      v:[15000, 14000, 18000]}      // F2-R14: 2025 = kanonis 14.000; sel 2026F = SATU-SATUNYA input bunga tahun berjalan
];

/* --- UPGRADE 2026-11-04 (Research Note Builder): persistensi localStorage --- */
var CMK_P="fsa_cm_profile", CMK_S="fsa_cm_spread", CMK_R="fsa_cm_reco", CMK_G="fsa_cm_gate";
function cmLoad(k){ try{ var v=JSON.parse(localStorage.getItem(k)); return v||null; }catch(e){ return null; } }
function cmSave(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
/* restore spread sebelum render */
(function(){
  var s = cmLoad(CMK_S);
  if(s && s.length===SPREAD.length){
    s.forEach(function(vs,i){ if(vs && vs.length===3) SPREAD[i].v = vs.map(function(x){ return isFinite(x)?x:0; }); });
  }
})();

function cmSaveAll(){
  cmSave(CMK_P, {nama:$("#m-nama").value, industri:$("#m-industri").value, tujuan:$("#m-tujuan").value,
    tenor:$("#m-tenor").value, limit:$("#m-limit").value, jaminan:$("#m-jaminan").value,
    asof:$("#m-asof")?$("#m-asof").value:"", horizon:$("#m-horizon")?$("#m-horizon").value:""});
  cmSave(CMK_S, readSpread().map(function(r){ return r.v; }));
  var recoEl = document.querySelector('#reco input:checked');
  cmSave(CMK_R, {reco: recoEl?recoEl.value:"CONDITIONAL", alasan:$("#m-alasan").value,
    dscr:$("#s-dscr").value, min:$("#s-min").value, shock:$("#s-shock").value});
}
function cmRestore(){
  var p = cmLoad(CMK_P);
  if(p){
    [["m-nama",p.nama],["m-industri",p.industri],["m-tujuan",p.tujuan],["m-tenor",p.tenor],
     ["m-limit",p.limit],["m-jaminan",p.jaminan],["m-asof",p.asof],["m-horizon",p.horizon]].forEach(function(pr){
      var el = document.getElementById(pr[0]); if(el && pr[1]!==undefined && pr[1]!=="") el.value = pr[1];
    });
  }
  var r = cmLoad(CMK_R);
  if(r){
    if(r.alasan) $("#m-alasan").value = r.alasan;
    if(r.dscr) $("#s-dscr").value = r.dscr;
    if(r.min) $("#s-min").value = r.min;
    if(r.shock) $("#s-shock").value = r.shock;
    var radio = document.querySelector('#reco input[value="'+r.reco+'"]');
    if(radio) radio.checked = true;
  }
  var g = cmLoad(CMK_G);
  if(g && g.disclaimer){ var d=$("#cm-disclaimer"); if(d) d.checked = true; }
}
/* --- akhir persistensi --- */

/* --- UPGRADE: impor drill → pre-fill spread (best-effort, keyword match) --- */
var CM_LABELS = {"klbf":{"rev":"Penjualan neto","cogs":"Beban pokok penjualan","gross":"Laba bruto","sell":"Beban penjualan","ga":"Beban umum dan administrasi","rd":"Beban penelitian dan pengembangan","ebit":"Laba usaha (terhitung — bukan subtotal LK)","int_exp":"Beban bunga dan keuangan","pbt":"Laba sebelum beban pajak penghasilan","tax":"Beban pajak penghasilan","ni_total":"Laba tahun berjalan (total)","ni_attr":"Laba tahun berjalan — diatribusikan ke pemilik induk","cash_bs":"Kas dan setara kas (neraca)","recv":"Piutang usaha, neto (pihak ketiga + berelasi)","inv":"Persediaan, neto","ppe":"Aset tetap, neto","ca":"Total aset lancar","assets":"TOTAL ASET","liab":"TOTAL LIABILITAS","cl":"Total liabilitas jangka pendek","intdebt":"Utang berbunga (terhitung: bank + sewa + pembiayaan + konversi)","equity":"TOTAL EKUITAS","re_start":"Saldo laba AWAL 2024 — belum ditentukan penggunaannya","re_end":"Saldo laba AKHIR 2024 — belum ditentukan penggunaannya","cash_cf":"Kas akhir tahun (arus kas)","cfo":"Kas neto diperoleh dari aktivitas operasi","capex":"Perolehan aset tetap","div":"Pembayaran dividen kas — Perusahaan"},"bbri":{"int_inc":"Pendapatan bunga","int_exp":"Beban bunga","nii":"Pendapatan bunga bersih / NII (terhitung = pendapatan − beban)","prov_fee":"Pendapatan provisi & komisi","recoveries":"Penerimaan kembali aset dihapusbukukan","ga":"Beban umum & administrasi","opex_other":"Beban operasional lainnya","op_profit":"Laba operasional","ppop":"PPoP — laba operasional sebelum pencadangan","ckpn_exp":"CKPN aset produktif (beban)","pbt":"Laba sebelum pajak","tax":"Beban pajak","ni_total":"Laba bersih","patmi":"Laba bersih — diatribusikan ke pemilik entitas induk","div":"Dividen kas didistribusikan","loans_gross":"Pinjaman diberikan — gross (sebelum CKPN)","loans_gross_23":"Pinjaman diberikan — gross 2023 (untuk rata-rata)","ckpn_loan":"CKPN pinjaman (cadangan di neraca)","assets":"TOTAL ASET","assets_23":"Total aset 2023 (untuk rata-rata)","giro":"Giro (simpanan nasabah)","tabungan":"Tabungan (simpanan nasabah)","deposito":"Deposito berjangka (simpanan nasabah)","dpk":"Simpanan nasabah / DPK (terhitung = giro+tabungan+deposito)","liab":"TOTAL LIABILITAS (terhitung = aset − ekuitas)","equity":"TOTAL EKUITAS","equity_attr":"Ekuitas atribusional (pemilik entitas induk)","equity_attr_23":"Ekuitas atribusional 2023 (untuk rata-rata)","nim":"NIM — ketik angka bank (%)","npl":"NPL gross — ketik angka bank (%)","ldr":"LDR — ketik angka bank (%)","car":"CAR — ketik angka bank (%)","casa":"CASA — ketik hitunganmu (%)"},"bbca":{"int_inc":"Pendapatan bunga","int_exp":"Beban bunga","nii":"NII — pendapatan bunga bersih (terhitung = pendapatan − beban)","nonint_inc":"Pendapatan bersih asuransi","opex":"Beban operasional","ckpn_exp":"Beban CKPN (H1)","pbt":"Laba sebelum pajak","tax":"Beban pajak","patmi":"Laba bersih — atribusional pemilik induk","div_paid":"Dividen kas dibayar (arus kas)","loans_gross":"Kredit yang diberikan — gross (sebelum CKPN)","ckpn_loan":"CKPN atas kredit (cadangan di neraca)","assets":"TOTAL ASET","giro":"Giro","tabungan":"Tabungan","deposito":"Deposito berjangka","dpk":"Total DPK (terhitung = giro+tabungan+deposito)","liab":"TOTAL LIABILITAS (terhitung = aset − ekuitas)","equity":"TOTAL EKUITAS","cap_core":"Modal inti (Tier 1)","rwa":"ATMR","cash_begin":"Kas awal periode (arus kas)","cash_end":"Kas akhir periode (arus kas)","cf_net":"Kenaikan neto kas H1 (terhitung)","cf_fx":"Selisih kurs atas kas","re_begin":"Saldo laba awal","re_end":"Saldo laba akhir","q2_nii":"NII Q2 (= NII H1 − NII Q1)","q2_ni":"Laba bersih Q2 (= laba H1 − laba Q1)","q2_ckpn":"CKPN Q2 (= CKPN H1 − CKPN Q1)","nim":"NIM — ketik hitunganmu (%), konvensi annualisasi WAJIB dinyatakan","npl":"NPL gross — ketik angka bank (%)","ldr":"LDR — ketik angka bank (%)","casa":"CASA — ketik hitunganmu (%)","car":"CAR — ketik angka bank (%)"}};
var CM_DRILLS = [
  {ns:"klbf", name:"Bedah Sendiri — KLBF", k2:"fsa_bs_klbf_s2", s5:"fsa_bs_klbf_s5"},
  {ns:"bbri", name:"Bank Practice — BBRI", k2:"fsa_bp_bbri_s2", s5:"fsa_bp_bbri_s5"},
  {ns:"bbca", name:"Ujian — BBCA H1 2026", k2:"fsa_exam_bbca_s2", s5:"fsa_exam_bbca_s5"}
];
function cmUnitToJuta(u){
  u = String(u||"juta").toLowerCase();
  if(u.indexOf("triliun")>=0) return 1e6;
  if(u.indexOf("miliar")>=0) return 1e3;
  return 1;
}
function cmMatchTarget(label){
  var l = String(label||"").toLowerCase();
  if(/penjualan/.test(l)) return "Penjualan";
  if(/laba usaha/.test(l)) return "EBITDA";
  if(/laba bersih|diatribusikan ke pemilik/.test(l)) return "Laba bersih";
  if(/utang berbunga/.test(l)) return "Utang berbunga";
  if(/total ekuitas|^ekuitas/.test(l)) return "Ekuitas";
  if(/beban bunga/.test(l)) return "Beban bunga";
  return null;
}
function cmImportDrill(){
  var opts = [];
  CM_DRILLS.forEach(function(D,i){
    var s5 = cmLoad(D.s5);
    if(s5 && s5.revealed) opts.push(i+") "+D.name);
  });
  if(!opts.length){ alert("Belum ada drill yang selesai (reveal). Selesaikan Bedah Sendiri / Bank Practice / ujian dulu."); return; }
  var pick = prompt("Impor spread dari drill mana?\n"+opts.join("\n")+"\n\nKetik nomor (0-"+(opts.length-1)+"):");
  if(pick===null) return;
  var D = CM_DRILLS[+pick]; if(!D){ alert("Nomor tidak valid."); return; }
  var s2 = cmLoad(D.k2);
  if(!(s2 && s2.figures)){ alert("Data drill tidak ditemukan."); return; }
  var lab = CM_LABELS[D.ns]||{}, filled = 0;
  Object.keys(s2.figures).forEach(function(k){
    var f = s2.figures[k]; if(f.nd) return;
    var target = cmMatchTarget(lab[k]||"");
    if(!target) return;
    /* normalisasi gaya memo-kredit (readSpread): titik ribuan dilucuti, koma jadi desimal */
    var v = parseFloat(String(f.v||"").replace(/\./g,"").replace(",","."));
    if(!isFinite(v)) return;
    v = v * cmUnitToJuta(f.unit) / 1;  // ke Rp juta
    var row = SPREAD.filter(function(r){ return r.l===target; })[0];
    if(row){ row.v[1] = Math.round(v); filled++; }  // kolom tengah (tahun berjalan)
  });
  renderSpread(); refreshAll();
  alert("Impor dari "+D.name+": "+filled+" pos terisi ke kolom tahun berjalan.\nCek & sesuaikan manual — impor ini best-effort.");
}
/* --- akhir impor drill --- */

/* --- UPGRADE: publish checklist lite (4 item, mengunci salin) --- */
function cmGates(){
  var asof = $("#m-asof") ? !!$("#m-asof").value : false;
  var hor = $("#m-horizon") ? !!$("#m-horizon").value.trim() : false;
  var satuanOK = true;  // spread selalu Rp juta (label tabel)
  var disc = $("#cm-disclaimer") ? $("#cm-disclaimer").checked : false;
  return [
    {t:"As-of date terisi", ok:asof},
    {t:"Horizon eksplisit", ok:hor},
    {t:"Satuan Rp juta dipakai konsisten", ok:satuanOK},
    {t:"Disclaimer dicentang (bukan nasihat kredit)", ok:disc}
  ];
}
function cmRenderGates(){
  var box = $("#cm-gates"); if(!box) return;
  var all = true, h = "";
  cmGates().forEach(function(g){
    if(!g.ok) all = false;
    h += '<li class="'+(g.ok?"ok":"")+'"><span class="st">'+(g.ok?"✓":"✗")+"</span><span>"+g.t+"</span></li>";
  });
  box.innerHTML = h;
  var btn = $("#copy-btn"); if(btn) btn.disabled = !all;
}
/* --- akhir checklist lite --- */

function fmt0(n){
  if(!isFinite(n)) return "—";
  return Math.round(n).toLocaleString("id-ID");
}

/* N1: parser angka Indonesia (definisi lokal, fix regresi R5) */
function parseIDNumber(str){
  var s = String(str||"").trim().replace(/\s/g,"");
  if(!s) return NaN;
  /* F3: validasi token penuh */
  if(/[^0-9.,\-+]/.test(s)) return NaN;  // karakter ilegal
  if(/--/.test(s) || /\+\+/.test(s)) return NaN;  // tanda ganda
  if(/\d-\d/.test(s) || /\d\+\d/.test(s)) return NaN;  // tanda di tengah (1-2)
  var dots = (s.match(/\./g)||[]).length;
  var commas = (s.match(/,/g)||[]).length;
  if(false){ // standalone: selalu mode currency
    /* R1/F3: rasio — max 1 pemisah desimal, tidak ada ribuan */
    if(dots + commas > 1) return NaN;
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
function fmtx(n){
  if(!isFinite(n)) return "—";
  return n.toLocaleString("id-ID", {minimumFractionDigits:1, maximumFractionDigits:1}) + "x";
}
function fmtp(n){
  if(!isFinite(n)) return "—";
  return n.toLocaleString("id-ID", {minimumFractionDigits:1, maximumFractionDigits:1}) + "%";
}

function readSpread(){
  var rows = document.querySelectorAll("#spread tr[data-row]");
  return Array.prototype.map.call(rows, function(tr){
    var l = tr.getAttribute("data-row");
    var vs = Array.prototype.map.call(tr.querySelectorAll("input"), function(inp){
      var v = parseFloat(inp.value.replace(/\./g, "").replace(",", "."));
      return isFinite(v) ? v : 0;
    });
    return {l:l, v:vs};
  });
}

function renderSpread(){
  var h = "<tr><th>Pos (Rp juta)</th>" + YEARS.map(function(y){ return "<th>"+y+"</th>"; }).join("") + "</tr>";
  SPREAD.forEach(function(r){
    h += '<tr data-row="' + r.l + '"><td>' + r.l + "</td>" +
      r.v.map(function(v){ return '<td><input value="' + fmt0(v) + '"></td>'; }).join("") + "</tr>";
  });
  $("#spread").innerHTML = h;
  Array.prototype.forEach.call(document.querySelectorAll("#spread input"), function(inp){
    inp.addEventListener("input", refreshAll);
  });
}

function renderRatios(data){
  function col(i){ return function(r){ return r.v[i]; }; }
  var rows = [
    {l:"Debt / EBITDA", f:function(i){
      var d = data[3].v[i], e = data[1].v[i]; return e ? fmtx(d/e) : "—"; }},
    {l:"Debt / Equity", f:function(i){
      var d = data[3].v[i], e = data[4].v[i]; return e ? fmtx(d/e) : "—"; }},
    {l:"EBITDA margin", f:function(i){
      var e = data[1].v[i], s = data[0].v[i]; return s ? fmtp(e/s*100) : "—"; }},
    {l:"Net margin", f:function(i){
      var n = data[2].v[i], s = data[0].v[i]; return s ? fmtp(n/s*100) : "—"; }},
    {l:"Interest coverage", f:function(i){
      var e = data[1].v[i], b = data[5].v[i]; return b ? fmtx(e/b) : "—"; }}
  ];
  var h = "<tr><th>Rasio</th>" + YEARS.map(function(y){ return "<th>"+y+"</th>"; }).join("") + "</tr>";
  rows.forEach(function(r){
    h += '<tr class="ratio"><td>' + r.l + "</td>" +
      YEARS.map(function(_, i){ return "<td>" + r.f(i) + "</td>"; }).join("") + "</tr>";
  });
  $("#ratios").innerHTML = h;
}

function renderStress(){
  var dscr = parseFloat($("#s-dscr").value) || 0;
  var min = parseFloat($("#s-min").value) || 0;
  var shock = parseFloat($("#s-shock").value) || 0;
  var baru = dscr * (1 + shock/100);
  var ok = baru >= min;
  $("#s-dscrbaru").textContent = isFinite(baru)
    ? baru.toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2}) + "x" : "—";
  var st = $("#stress-status");
  st.textContent = ok ? "AMAN" : "JEBOL";
  st.className = ok ? "aman" : "jebol";
  $("#stress-val").textContent = (shock>0?"+":"") + shock + "%";
  // F2-R14: interest coverage tahun berjalan SATU SUMBER — sel Beban bunga 2026F di spread
  var data = readSpread();
  var e = data[1].v[2], b = data[5].v[2];
  $("#s-ic").textContent = b ? fmtx(e/b) : "—";
}

function buildMemo(){
  var data = readSpread();
  var recoEl = document.querySelector('#reco input:checked');
  var reco = recoEl ? recoEl.value : "CONDITIONAL";
  var alasan = $("#m-alasan").value.trim().split("\n").filter(function(l){ return l.trim(); });
  var shock = parseFloat($("#s-shock").value) || 0;
  var dscr = parseFloat($("#s-dscr").value) || 0;
  var min = parseFloat($("#s-min").value) || 0;
  var dscrBaru = dscr * (1 + shock/100);
  var statusStress = dscrBaru < min ? "JEBOL" : "AMAN";

  var L = [];
  L.push("CREDIT MEMO — " + $("#m-nama").value.toUpperCase());
  L.push("Industri: " + $("#m-industri").value + " | Tujuan: " + $("#m-tujuan").value +
         " | Tenor: " + $("#m-tenor").value + " | Limit: Rp" + fmt0(parseFloat($("#m-limit").value)||0) + " juta");
  L.push("Jaminan: " + $("#m-jaminan").value);
  L.push("");
  L.push("1) SPREAD 3 TAHUN (Rp juta, ilustratif)");
  YEARS.forEach(function(y, i){
    L.push("  " + y + ": penjualan " + fmt0(data[0].v[i]) + ", EBITDA " + fmt0(data[1].v[i]) +
           ", laba bersih " + fmt0(data[2].v[i]) + ", utang " + fmt0(data[3].v[i]) +
           ", ekuitas " + fmt0(data[4].v[i]));
  });
  L.push("");
  L.push("2) RASIO LEVERAGE & COVERAGE");
  YEARS.forEach(function(y, i){
    var de = data[1].v[i] ? (data[3].v[i]/data[1].v[i]) : NaN;
    var dEq = data[4].v[i] ? (data[3].v[i]/data[4].v[i]) : NaN;
    var ic = data[5].v[i] ? (data[1].v[i]/data[5].v[i]) : NaN;  // F2-R14: satu sumber (spread)
    L.push("  " + y + ": Debt/EBITDA " + fmtx(de) + ", Debt/Equity " + fmtx(dEq) +
           ", interest coverage " + fmtx(ic));
  });
  L.push("");
  L.push("3) STRESS TEST — shock EBITDA " + (shock>0?"+":"") + shock + "%");
  L.push("  DSCR " + dscr.toLocaleString("id-ID") + " → " + dscrBaru.toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2}) +
         " vs covenant min " + min.toLocaleString("id-ID") + " = " + statusStress);
  L.push("");
  L.push("4) REKOMENDASI: " + reco);
  alasan.forEach(function(a, i){ L.push("  " + (i+1) + ". " + a.trim()); });
  L.push("");
  L.push("— Disusun dengan Credit Memo Builder FSA Lab. Angka ilustratif, bukan nasihat kredit.");
  return L.join("\n");
}

function refreshAll(){
  var data = readSpread();
  renderRatios(data);
  renderStress();
  $("#memo-preview").textContent = buildMemo();
  cmSaveAll();
  cmRenderGates();
}

cmRestore();
renderSpread();
["s-dscr","s-min","s-shock"].forEach(function(id){
  document.getElementById(id).addEventListener("input", refreshAll);
});
Array.prototype.forEach.call(document.querySelectorAll("#reco input"), function(r){
  r.addEventListener("change", refreshAll);
});
["m-nama","m-industri","m-tujuan","m-tenor","m-limit","m-jaminan","m-alasan","m-asof","m-horizon"].forEach(function(id){
  var el = document.getElementById(id); if(el) el.addEventListener("input", refreshAll);
});
var cd = document.getElementById("cm-disclaimer");
if(cd) cd.addEventListener("change", function(){ cmSave(CMK_G,{disclaimer:this.checked}); refreshAll(); });
var ib = document.getElementById("cm-import");
if(ib) ib.addEventListener("click", cmImportDrill);
refreshAll();

$("#copy-btn").addEventListener("click", function(){
  var t = buildMemo();
  navigator.clipboard.writeText(t).then(function(){
    var m = $("#copy-msg"); m.style.visibility = "visible";
    setTimeout(function(){ m.style.visibility = "hidden"; }, 2500);
  });
});
})();
