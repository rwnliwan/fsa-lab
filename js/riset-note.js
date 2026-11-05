/* FSA Lab — Research Note Builder. Equity research note 7 section, impor drill,
   bilingual ID/EN, publish checklist. Contoh = PT Cemerlang Abadi (FIKTIF), ilustratif. */
(function(){
"use strict";
var $ = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

/* ---------- parseIDNumber: SALIN byte-identik dari js/modul37.js (jangan tulis ulang) ---------- */
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
/* ---------- akhir parseIDNumber ---------- */

function load(k){ try{ var v=JSON.parse(localStorage.getItem(k)); return v||null; }catch(e){ return null; } }
function save(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

/* Label pos per drill (statis — dari struktur drill, BUKAN benchmark) */
var LABELS = {"klbf":{"rev":"Penjualan neto","cogs":"Beban pokok penjualan","gross":"Laba bruto","sell":"Beban penjualan","ga":"Beban umum dan administrasi","rd":"Beban penelitian dan pengembangan","ebit":"Laba usaha (terhitung — bukan subtotal LK)","int_exp":"Beban bunga dan keuangan","pbt":"Laba sebelum beban pajak penghasilan","tax":"Beban pajak penghasilan","ni_total":"Laba tahun berjalan (total)","ni_attr":"Laba tahun berjalan — diatribusikan ke pemilik induk","cash_bs":"Kas dan setara kas (neraca)","recv":"Piutang usaha, neto (pihak ketiga + berelasi)","inv":"Persediaan, neto","ppe":"Aset tetap, neto","ca":"Total aset lancar","assets":"TOTAL ASET","liab":"TOTAL LIABILITAS","cl":"Total liabilitas jangka pendek","intdebt":"Utang berbunga (terhitung: bank + sewa + pembiayaan + konversi)","equity":"TOTAL EKUITAS","re_start":"Saldo laba AWAL 2024 — belum ditentukan penggunaannya","re_end":"Saldo laba AKHIR 2024 — belum ditentukan penggunaannya","cash_cf":"Kas akhir tahun (arus kas)","cfo":"Kas neto diperoleh dari aktivitas operasi","capex":"Perolehan aset tetap","div":"Pembayaran dividen kas — Perusahaan"},"bbri":{"int_inc":"Pendapatan bunga","int_exp":"Beban bunga","nii":"Pendapatan bunga bersih / NII (terhitung = pendapatan − beban)","prov_fee":"Pendapatan provisi & komisi","recoveries":"Penerimaan kembali aset dihapusbukukan","ga":"Beban umum & administrasi","opex_other":"Beban operasional lainnya","op_profit":"Laba operasional","ppop":"PPoP — laba operasional sebelum pencadangan","ckpn_exp":"CKPN aset produktif (beban)","pbt":"Laba sebelum pajak","tax":"Beban pajak","ni_total":"Laba bersih","patmi":"Laba bersih — diatribusikan ke pemilik entitas induk","div":"Dividen kas didistribusikan","loans_gross":"Pinjaman diberikan — gross (sebelum CKPN)","loans_gross_23":"Pinjaman diberikan — gross 2023 (untuk rata-rata)","ckpn_loan":"CKPN pinjaman (cadangan di neraca)","assets":"TOTAL ASET","assets_23":"Total aset 2023 (untuk rata-rata)","giro":"Giro (simpanan nasabah)","tabungan":"Tabungan (simpanan nasabah)","deposito":"Deposito berjangka (simpanan nasabah)","dpk":"Simpanan nasabah / DPK (terhitung = giro+tabungan+deposito)","liab":"TOTAL LIABILITAS (terhitung = aset − ekuitas)","equity":"TOTAL EKUITAS","equity_attr":"Ekuitas atribusional (pemilik entitas induk)","equity_attr_23":"Ekuitas atribusional 2023 (untuk rata-rata)","nim":"NIM — ketik angka bank (%)","npl":"NPL gross — ketik angka bank (%)","ldr":"LDR — ketik angka bank (%)","car":"CAR — ketik angka bank (%)","casa":"CASA — ketik hitunganmu (%)"},"bbca":{"int_inc":"Pendapatan bunga","int_exp":"Beban bunga","nii":"NII — pendapatan bunga bersih (terhitung = pendapatan − beban)","nonint_inc":"Pendapatan bersih asuransi","opex":"Beban operasional","ckpn_exp":"Beban CKPN (H1)","pbt":"Laba sebelum pajak","tax":"Beban pajak","patmi":"Laba bersih — atribusional pemilik induk","div_paid":"Dividen kas dibayar (arus kas)","loans_gross":"Kredit yang diberikan — gross (sebelum CKPN)","ckpn_loan":"CKPN atas kredit (cadangan di neraca)","assets":"TOTAL ASET","giro":"Giro","tabungan":"Tabungan","deposito":"Deposito berjangka","dpk":"Total DPK (terhitung = giro+tabungan+deposito)","liab":"TOTAL LIABILITAS (terhitung = aset − ekuitas)","equity":"TOTAL EKUITAS","cap_core":"Modal inti (Tier 1)","rwa":"ATMR","cash_begin":"Kas awal periode (arus kas)","cash_end":"Kas akhir periode (arus kas)","cf_net":"Kenaikan neto kas H1 (terhitung)","cf_fx":"Selisih kurs atas kas","re_begin":"Saldo laba awal","re_end":"Saldo laba akhir","q2_nii":"NII Q2 (= NII H1 − NII Q1)","q2_ni":"Laba bersih Q2 (= laba H1 − laba Q1)","q2_ckpn":"CKPN Q2 (= CKPN H1 − CKPN Q1)","nim":"NIM — ketik hitunganmu (%), konvensi annualisasi WAJIB dinyatakan","npl":"NPL gross — ketik angka bank (%)","ldr":"LDR — ketik angka bank (%)","casa":"CASA — ketik hitunganmu (%)","car":"CAR — ketik angka bank (%)"}};

var DRILLS = [
  {ns:"klbf", name:"Bedah Sendiri — KLBF", s2:"fsa_bs_klbf_s2", s4:"fsa_bs_klbf_s4", s5:"fsa_bs_klbf_s5", s0:null},
  {ns:"bbri", name:"Bank Practice — BBRI", s2:"fsa_bp_bbri_s2", s4:"fsa_bp_bbri_s4", s5:"fsa_bp_bbri_s5", s0:null},
  {ns:"bbca", name:"Ujian — BBCA H1 2026", s2:"fsa_exam_bbca_s2", s4:"fsa_exam_bbca_s4", s5:"fsa_exam_bbca_s5", s0:"fsa_exam_bbca_s0"}
];

var KMETA="fsa_rn_meta", KID="fsa_rn_id", KEN="fsa_rn_en", KGATE="fsa_rn_gate";

/* ---------- state ---------- */
var S = {
  meta: load(KMETA)||{},
  id: load(KID)||{s2:"",s3:[],s4assump:"",s4fmva:"",s5:[],s6:[]},
  en: load(KEN)||{s2:"",s3:[],s5:[],s6:[]},
  gate: load(KGATE)||{disclaimer:false}
};
if(!S.id.s3.length) S.id.s3=[{c:"",p:"",m:"",n:""},{c:"",p:"",m:"",n:""},{c:"",p:"",m:"",n:""}];
if(!S.id.s5.length) S.id.s5=[{d:"",i:"",self:false},{d:"",i:"",self:false},{d:"",i:"",self:false}];
if(!S.id.s6.length) S.id.s6=[{q:"",a:"",v:""}];
if(!S.en.s3.length) S.en.s3=[{c:"",p:"",m:"",n:""},{c:"",p:"",m:"",n:""},{c:"",p:"",m:"",n:""}];
if(!S.en.s5.length) S.en.s5=[{d:"",i:"",self:false},{d:"",i:"",self:false},{d:"",i:"",self:false}];
if(!S.en.s6.length) S.en.s6=[{q:"",a:"",v:""}];
var ATT = [];  // S7 rows: {pos,val,per,src,st}
var coached = false;

function persist(){
  save(KMETA,S.meta); save(KID,S.id); save(KEN,S.en); save(KGATE,S.gate);
  save("fsa_rn_att", ATT);
}

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
      "<p>Reveal: "+new Date(s5.ts).toLocaleDateString("id-ID")+". Klik impor untuk pre-fill S7 + draft S2/S3/S6.</p>"+
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
  var s2 = load(D.s2), s4 = load(D.s4), s0 = D.s0 ? load(D.s0) : null;
  coached = !!(s0 && s0.mode==="coached");
  if(coached) $("#rn-coached-note").style.display = "block";
  /* S7: figures → lampiran */
  if(s2 && s2.figures){
    var lab = LABELS[ns]||{};
    Object.keys(s2.figures).forEach(function(k){
      var f = s2.figures[k];
      if(f.nd) return;
      ATT.push({pos: lab[k]||k, val: String(f.v||""), per: f.period||"",
        src: (f.page?("hal. "+f.page):"")+(f.unit?(" · "+f.unit):""), st:"terverifikasi (filing)"});
    });
  }
  /* S2: vonis → draft */
  if(s4 && s4.vonis){
    S.id.s2 = S.id.s2 || ("DRAFT dari "+D.name+": "+s4.vonis+" — TULIS ULANG jadi paragraf vonis (kalimat pertama = vonis).");
    $("#rn-s2").value = S.id.s2;
  }
  /* S3: lenses → draft poin (penguat saja; PEMATAH WAJIB MANUAL) */
  if(s4 && s4.lenses){
    var keys = ["inv","cred","foren"];
    keys.forEach(function(k,i){
      var txt = String(s4.lenses[k]||"").trim();
      if(txt && i<3){
        S.id.s3[i].c = S.id.s3[i].c || ("DRAFT dari "+D.name+" — tulis ulang sebagai klaim thesis.");
        S.id.s3[i].p = S.id.s3[i].p || txt.slice(0,600);
        /* m (pematah) SENGAJA dikosongkan — wajib manual */
      }
    });
    renderThesis();
  }
  /* S6: starter template (divergensi tidak tersimpan di drill — tulis ulang sebagai pertanyaan) */
  if(!S.id.s6[0].q){
    S.id.s6[0].q = "Dari drill "+D.name+": temuan divergensi terbesarmu vs benchmark — tulis ulang sebagai PERTANYAAN di sini.";
    renderFlags();
  }
  if(!S.meta.emiten){
    S.meta.emiten = D.ns==="klbf" ? "PT Kalbe Farma Tbk" : D.ns==="bbri" ? "PT Bank Rakyat Indonesia Tbk" : "PT Bank Central Asia Tbk";
    $("#rn-emiten").value = S.meta.emiten;
  }
  renderAtt(); persist(); refreshAll();
  alert("Impor dari "+D.name+" selesai.\n\nS7 terisi dari angka drill-mu. S2/S3/S6 = DRAFT — bukti pematah, risiko, dan red flags WAJIB kamu tulis sendiri.");
}

/* ---------- renderers ---------- */
function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function renderThesis(){
  var box = $("#thesis-list"); box.innerHTML = "";
  ["ID","EN"].forEach(function(lang){
    var arr = lang==="ID" ? S.id.s3 : S.en.s3;
    arr.forEach(function(p,i){
      var wrap = document.createElement("div");
      wrap.className = "thesis-pt "+(lang==="ID"?"id-field":"en-field");
      wrap.innerHTML = "<h4>Poin "+(i+1)+"</h4>"+
        fld("tc-"+lang+"-"+i, "Klaim", p.c, "mis. Margin ekspansi berkelanjutan")+
        fld("tp-"+lang+"-"+i, "Bukti penguat + angka (sumber hal.)", p.p, "")+
        fld("tm-"+lang+"-"+i, "Bukti PEMATAH — wajib diisi manual", p.m, "thesis tanpa pematah = marketing")+
        fld("tn-"+lang+"-"+i, "Angka dikutip (dengan satuan)", p.n, "mis. 35,0% (Cat. 28, hal. 4)");
      box.appendChild(wrap);
    });
  });
  box.addEventListener("input", syncThesis);
}
function fld(id, lab, val, ph){
  return '<div style="margin-bottom:.5rem"><label for="'+id+'" style="font-weight:600;font-size:.8rem;display:block;margin-bottom:.25rem">'+lab+'</label>'+
    '<textarea id="'+id+'" rows="2" placeholder="'+esc(ph)+'" style="width:100%;font-family:var(--font-body);font-size:.88rem;border:2px solid var(--line);border-radius:8px;padding:.45rem .7rem;background:var(--paper)">'+esc(val)+'</textarea></div>';
}
function syncThesis(e){
  var t = e.target; if(!t.id) return;
  var m = t.id.match(/^(tc|tp|tm|tn)-(ID|EN)-(\d)$/); if(!m) return;
  var arr = m[2]==="ID" ? S.id.s3 : S.en.s3;
  var key = {tc:"c",tp:"p",tm:"m",tn:"n"}[m[1]];
  arr[+m[3]][key] = t.value;
  persist(); refreshAll();
}

function renderRisks(){
  var box = $("#risk-list"); box.innerHTML = "";
  ["ID","EN"].forEach(function(lang){
    var arr = lang==="ID" ? S.id.s5 : S.en.s5;
    arr.forEach(function(r,i){
      var wrap = document.createElement("div");
      wrap.className = "thesis-pt "+(lang==="ID"?"id-field":"en-field");
      wrap.innerHTML = "<h4>Risiko "+(i+1)+"</h4>"+
        fld("rd-"+lang+"-"+i, "Deskripsi + dampak ke thesis", r.d, "")+
        fld("ri-"+lang+"-"+i, "Kondisi invalidasi (terukur)", r.i, "mis. CFO/NI < 0,9x di Q1 2026")+
        '<label style="font-size:.82rem"><input type="checkbox" id="rs-'+lang+'-'+i+'"'+(r.self?" checked":"")+
        '> Risiko ini saya akui sendiri (bukan risiko generik)</label>';
      box.appendChild(wrap);
    });
  });
  box.addEventListener("input", syncRisks);
  box.addEventListener("change", syncRisks);
}
function syncRisks(e){
  var t = e.target; if(!t.id) return;
  var m = t.id.match(/^(rd|ri|rs)-(ID|EN)-(\d)$/); if(!m) return;
  var arr = m[2]==="ID" ? S.id.s5 : S.en.s5;
  var key = {rd:"d",ri:"i",rs:"self"}[m[1]];
  arr[+m[3]][key] = key==="self" ? t.checked : t.value;
  persist(); refreshAll();
}

function renderFlags(){
  var box = $("#flag-list"); box.innerHTML = "";
  ["ID","EN"].forEach(function(lang){
    var arr = lang==="ID" ? S.id.s6 : S.en.s6;
    arr.forEach(function(f,i){
      var wrap = document.createElement("div");
      wrap.className = "thesis-pt "+(lang==="ID"?"id-field":"en-field");
      wrap.innerHTML = "<h4>Red flag "+(i+1)+"</h4>"+
        fld("fq-"+lang+"-"+i, "Pertanyaan (harus diawali kata tanya)", f.q, "mis. Mengapa restitusi pajak naik 3,2x…?")+
        fld("fa-"+lang+"-"+i, "Angka pemicu", f.a, "mis. Rp406 M, +3,2x YoY")+
        fld("fv-"+lang+"-"+i, "Langkah verifikasi", f.v, "mis. Catatan pajak hal. 87 — one-off?");
      box.appendChild(wrap);
    });
  });
  box.addEventListener("input", syncFlags);
}
function syncFlags(e){
  var t = e.target; if(!t.id) return;
  var m = t.id.match(/^(fq|fa|fv)-(ID|EN)-(\d)$/); if(!m) return;
  var arr = m[2]==="ID" ? S.id.s6 : S.en.s6;
  var key = {fq:"q",fa:"a",fv:"v"}[m[1]];
  arr[+m[3]][key] = t.value;
  persist(); refreshAll();
}

function renderAtt(){
  var h = "<tr><th>Pos</th><th>Nilai</th><th>Periode</th><th>Sumber</th><th>Status</th><th></th></tr>";
  ATT.forEach(function(r,i){
    h += "<tr><td><input data-a='"+i+"' data-f='pos' value='"+esc(r.pos)+"'></td>"+
      "<td><input data-a='"+i+"' data-f='val' value='"+esc(r.val)+"'></td>"+
      "<td><input data-a='"+i+"' data-f='per' value='"+esc(r.per)+"'></td>"+
      "<td><input data-a='"+i+"' data-f='src' value='"+esc(r.src)+"'></td>"+
      "<td><select data-a='"+i+"' data-f='st'>"+
        ["terverifikasi (filing)","ilustratif","perlu cek ulang"].map(function(o){
          return "<option"+(r.st===o?" selected":"")+">"+o+"</option>"; }).join("")+
      "</select></td>"+
      '<td><button class="btn" data-del="'+i+'" type="button" style="padding:.2rem .6rem">×</button></td></tr>';
  });
  $("#att-table").innerHTML = h;
}

/* ---------- gates ---------- */
function hardGates(){
  var m = S.meta;
  var g1 = !!String(m.asof||"").trim();
  var g2 = !!String(m.horizon||"").trim();
  var s4ok = ["bear","base","bull"].every(function(k){
    return isFinite(parseIDNumber(String(m["tp_"+k]||""), true));
  });
  var shares = parseIDNumber(String(m.shares||""), true);
  var g4 = isFinite(shares) && shares > 0 && isFinite(parseIDNumber(String(m.tp_base||""), true));
  var g5 = !!S.gate.disclaimer;
  return [
    {t:"As-of date terisi (S1)", ok:g1},
    {t:"Horizon forecast eksplisit (S1)", ok:g2},
    {t:"Scenario range bear/base/bull terisi (S4)", ok:s4ok},
    {t:"Saham beredar dinyatakan → target price per-share valid (S1+S4)", ok:g4},
    {t:"Disclaimer analis ritel independen dicentang (bukan rekomendasi beli/jual)", ok:g5}
  ];
}
function softGates(){
  var warn = [];
  /* 6: fakta vs interpretasi — S7 semua bersumber halaman */
  var unsourced = ATT.filter(function(r){ return !String(r.src||"").trim(); }).length;
  warn.push({t:"Fakta vs interpretasi terpisah — "+(unsourced? unsourced+" baris S7 tanpa sumber":"semua baris S7 bersumber"), ok:!unsourced});
  /* 7: ilustratif dilabeli */
  var ill = ATT.filter(function(r){ return r.st==="ilustratif"; }).length;
  warn.push({t: ill? ill+" angka ilustratif — pastikan dilabeli PROMINENT di note" : "Tidak ada angka ilustratif di S7", ok:true});
  /* 8: red flags berbentuk pertanyaan */
  var badq = S.id.s6.filter(function(f){
    var q = String(f.q||"").trim(); if(!q) return false;
    return !/^(mengapa|bagaimana|apa|apakah|kapan|di mana|dimana|berapa|siapa|why|what|how|when|where|is|are|does|do|can|could)/i.test(q);
  }).length;
  warn.push({t:"Red flags berbentuk pertanyaan"+(badq? " — "+badq+" perlu diperbaiki":" ✓"), ok:!badq});
  /* 9: ≥3 angka dikutip di thesis */
  var nums = 0;
  S.id.s3.forEach(function(p){ nums += (String(p.n||"").match(/\d/)||[]).length ? 1 : 0; });
  warn.push({t:"≥3 angka dikutip di thesis — sekarang "+nums+"/3", ok:nums>=3});
  /* 10: ≥1 risiko diakui sendiri */
  var self = S.id.s5.filter(function(r){ return r.self; }).length;
  warn.push({t:"≥1 risiko diakui sendiri — sekarang "+self, ok:self>=1});
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

/* ---------- note text ---------- */
function buildNote(lang){
  var m = S.meta, D = lang==="ID" ? S.id : S.en;
  var L = [];
  L.push("EQUITY RESEARCH NOTE — " + (m.emiten||"[emiten]") + (coached?" [COACHED]":""));
  L.push((m.ticker?m.ticker+" · ":"")+(m.sektor||"")+" · "+(m.periode||""));
  L.push("As-of: "+(m.asof||"—")+" · Horizon: "+(m.horizon||"—")+" · Satuan: "+(m.ccy||"—")+
    " · Basis: "+(m.basis||"—")+" · Saham beredar: "+(m.shares||"—")+" jt lbr");
  L.push("Sumber: "+(m.src||"—"));
  L.push("");
  L.push("RINGKASAN INVESTASI");
  L.push(D.s2||"[belum ditulis]");
  L.push("");
  L.push("THESIS (3 poin, thesis testing)");
  D.s3.forEach(function(p,i){
    L.push((i+1)+". KLAIM: "+(p.c||"—"));
    L.push("   Penguat: "+(p.p||"—"));
    L.push("   Pematah: "+(p.m||"—"));
    L.push("   Angka: "+(p.n||"—"));
  });
  L.push("");
  L.push("VALUASI — "+(m.method||"[metode]")+" (metode mengikuti jenis emiten)");
  L.push("Target: bear "+(m.tp_bear||"—")+" / base "+(m.tp_base||"—")+" / bull "+(m.tp_bull||"—"));
  L.push("Asumsi kunci: "+($("#rn-assump").value||"—"));
  L.push("Model: "+(m.fmva||"—"));
  L.push("");
  L.push("RISIKO (3 + invalidasi)");
  D.s5.forEach(function(r,i){
    L.push((i+1)+". "+(r.d||"—")+(r.self?" [diakui sendiri]":""));
    L.push("   Invalidasi: "+(r.i||"—"));
  });
  L.push("");
  L.push("RED FLAGS (pertanyaan, bukan vonis)");
  D.s6.forEach(function(f,i){
    if(!String(f.q||"").trim() && !String(f.a||"").trim()) return;
    L.push((i+1)+". "+(f.q||"—"));
    L.push("   Pemicu: "+(f.a||"—")+" · Verifikasi: "+(f.v||"—"));
  });
  L.push("");
  L.push("LAMPIRAN ANGKA KUNCI");
  ATT.forEach(function(r){
    L.push("• "+r.pos+": "+r.val+(r.per?" ("+r.per+")":"")+" — "+r.src+" ["+r.st+"]");
  });
  L.push("");
  L.push("— Disusun dengan Research Note Builder FSA Lab. Analis ritel independen; edukasi/portofolio, BUKAN rekomendasi beli/jual.");
  return L.join("\n");
}

/* ---------- init ---------- */
function syncMeta(){
  var map = {emiten:"rn-emiten",ticker:"rn-ticker",sektor:"rn-sektor",periode:"rn-periode",
    asof:"rn-asof",horizon:"rn-horizon",ccy:"rn-ccy",basis:"rn-basis",shares:"rn-shares",
    src:"rn-src",method:"rn-method",tp_bear:"rn-tp-bear",tp_base:"rn-tp-base",tp_bull:"rn-tp-bull",fmva:"rn-fmva"};
  Object.keys(map).forEach(function(k){
    var el = document.getElementById(map[k]); if(el) S.meta[k] = el.value;
  });
  persist();
}
var META_IDS = ["rn-emiten","rn-ticker","rn-sektor","rn-periode","rn-asof","rn-horizon","rn-ccy",
  "rn-basis","rn-shares","rn-src","rn-method","rn-tp-bear","rn-tp-base","rn-tp-bull","rn-fmva"];

function init(){
  /* restore meta */
  var rmap = {emiten:"rn-emiten",ticker:"rn-ticker",sektor:"rn-sektor",periode:"rn-periode",
    asof:"rn-asof",horizon:"rn-horizon",ccy:"rn-ccy",basis:"rn-basis",shares:"rn-shares",
    src:"rn-src",method:"rn-method",tp_bear:"rn-tp-bear",tp_base:"rn-tp-base",tp_bull:"rn-tp-bull",fmva:"rn-fmva"};
  Object.keys(rmap).forEach(function(k){
    var el = document.getElementById(rmap[k]); if(el && S.meta[k]) el.value = S.meta[k];
  });
  $("#rn-assump").value = S.meta.assump||"";
  $("#rn-s2").value = S.id.s2||"";
  $("#rn-s2-en").value = S.en.s2||"";
  ATT = load("fsa_rn_att")||[];
  detectDrills();
  renderThesis(); renderRisks(); renderFlags(); renderAtt();

  /* listeners */
  META_IDS.forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.addEventListener("input", function(){ syncMeta(); S.meta.assump=$("#rn-assump").value; persist(); refreshAll(); });
  });
  $("#rn-s2").addEventListener("input", function(){ S.id.s2=this.value; persist(); refreshAll(); });
  $("#rn-s2-en").addEventListener("input", function(){ S.en.s2=this.value; persist(); refreshAll(); });

  /* disclaimer checkbox — injected into hard gate list? No: separate row */
  var dwrap = document.createElement("div");
  dwrap.style.cssText = "margin:.8rem 0;padding:.7rem 1rem;border:2px dashed var(--ink);border-radius:10px;font-size:.85rem";
  dwrap.innerHTML = '<label><input type="checkbox" id="rn-disclaimer"'+(S.gate.disclaimer?" checked":"")+'> '+
    'Saya analis ritel independen; note ini untuk edukasi/portofolio, <strong>BUKAN rekomendasi beli/jual</strong>.</label>';
  $("#gate-hard").before(dwrap);
  $("#rn-disclaimer").addEventListener("change", function(){ S.gate.disclaimer=this.checked; persist(); refreshAll(); });

  /* flags add */
  $("#flag-add").addEventListener("click", function(){
    if(S.id.s6.length>=5){ alert("Maksimal 5 red flags — prioritaskan."); return; }
    S.id.s6.push({q:"",a:"",v:""}); S.en.s6.push({q:"",a:"",v:""});
    renderFlags(); persist();
  });
  /* att add/del */
  $("#att-add").addEventListener("click", function(){
    ATT.push({pos:"",val:"",per:"",src:"",st:"terverifikasi (filing)"});
    renderAtt(); persist(); refreshAll();
  });
  $("#att-table").addEventListener("input", function(e){
    var t=e.target; if(!t.getAttribute("data-a")) return;
    ATT[+t.getAttribute("data-a")][t.getAttribute("data-f")] = t.value;
    persist(); refreshAll();
  });
  $("#att-table").addEventListener("change", function(e){
    var t=e.target; if(!t.getAttribute("data-a")) return;
    ATT[+t.getAttribute("data-a")][t.getAttribute("data-f")] = t.value;
    persist(); refreshAll();
  });
  $("#att-table").addEventListener("click", function(e){
    var b=e.target.closest("[data-del]"); if(!b) return;
    ATT.splice(+b.getAttribute("data-del"),1); renderAtt(); persist(); refreshAll();
  });

  /* bilingual toggle */
  $("#lang-id").addEventListener("click", function(){
    document.body.classList.remove("lang-en");
    $("#lang-id").classList.add("on"); $("#lang-en").classList.remove("on"); refreshAll();
  });
  $("#lang-en").addEventListener("click", function(){
    document.body.classList.add("lang-en");
    $("#lang-en").classList.add("on"); $("#lang-id").classList.remove("on"); refreshAll();
  });

  /* copy */
  function doCopy(lang){
    var t = buildNote(lang);
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
  $("#rn-preview").textContent = buildNote(lang);
}

document.addEventListener("DOMContentLoaded", init);
})();
