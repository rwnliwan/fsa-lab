/* F04: guard idempoten — file ini pernah dimuat 3x via tag script duplikat.
   Inisialisasi ganda mendaftarkan listener berulang (Bandingkan, copy, slider).
   Pola: flag dibaca SEKALI di awal file; tiap blok IIFE return lebih awal bila flag sudah true. */
var __fsaWorkbenchAlreadyInit = window.__fsaWorkbenchInit === true;
window.__fsaWorkbenchInit = true;
/* === workbench/index.html — blok inline #1 (dipindah ke file eksternal agar CSP script-src 'self' tanpa 'unsafe-inline') === */
(function(){
  "use strict";
  if (__fsaWorkbenchAlreadyInit) return;
  // --- cermin JS dari footnote_diff() Python: split kalimat -> LCS -> pasangkan yang mirip ---
  function sentences(t){
    t = (t || "").trim();
    if(!t) return [];
    return t.split(/(?<=[.!?])\s+/).map(function(s){return s.trim();}).filter(Boolean);
  }
  function ratio(a, b){
    // rasio kemiripan sederhana (Jaccard atas bigram karakter)
    if(a === b) return 1;
    function grams(s){ var g={}, i; s=s.toLowerCase();
      for(i=0;i<s.length-1;i++){ var k=s.slice(i,i+2); g[k]=(g[k]||0)+1; } return g; }
    var ga=grams(a), gb=grams(b), inter=0, union=0, k;
    for(k in ga){ if(gb[k]) inter+=Math.min(ga[k],gb[k]); union+=ga[k]; }
    for(k in gb){ if(!ga[k]) union+=gb[k]; }
    return union ? inter/union : 0;
  }
  function lcsOps(oldA, newA){
    // LCS dinamis -> opcode sederhana (equal/delete/insert/replace)
    var m=oldA.length, n=newA.length, i, j;
    var dp=[]; for(i=0;i<=m;i++){ dp.push(new Array(n+1).fill(0)); }
    for(i=m-1;i>=0;i--) for(j=n-1;j>=0;j--)
      dp[i][j] = oldA[i]===newA[j] ? dp[i+1][j+1]+1 : Math.max(dp[i+1][j], dp[i][j+1]);
    var ops=[], x=0, y=0;
    while(x<m && y<n){
      if(oldA[x]===newA[y]){ ops.push(["equal",x,x+1,y,y+1]); x++; y++; }
      else if(dp[x+1][y] >= dp[x][y+1]){ ops.push(["delete",x,x+1,y,y]); x++; }
      else { ops.push(["insert",x,x,y,y+1]); y++; }
    }
    while(x<m){ ops.push(["delete",x,x+1,y,y]); x++; }
    while(y<n){ ops.push(["insert",x,x,y,y+1]); y++; }
    // gabungkan opcode berurutan sejenis
    var merged=[];
    ops.forEach(function(o){
      var last=merged[merged.length-1];
      if(last && last[0]===o[0]){ last[2]=o[2]; last[4]=o[4]; }
      else merged.push(o.slice());
    });
    /* Cue P2-3: delete+insert berdekatan = kandidat replace -> aktifkan kategori DIUBAH */
    var out=[];
    for(var k=0;k<merged.length;k++){
      var cur=merged[k], nxt=merged[k+1];
      if(cur[0]==="delete" && nxt && nxt[0]==="insert"){
        out.push(["replace",cur[1],cur[2],nxt[3],nxt[4]]);
        k++;
      } else out.push(cur);
    }
    return out;
  }
  function footnoteDiff(oldText, newText){
    var oldA=sentences(oldText), newA=sentences(newText);
    var added=[], removed=[], changed=[];
    lcsOps(oldA,newA).forEach(function(op){
      var tag=op[0], i1=op[1], i2=op[2], j1=op[3], j2=op[4];
      if(tag==="equal") return;
      if(tag==="delete"){ removed.push.apply(removed, oldA.slice(i1,i2)); return; }
      if(tag==="insert"){ added.push.apply(added, newA.slice(j1,j2)); return; }
      var ro=oldA.slice(i1,i2), rn=newA.slice(j1,j2), used={};
      ro.forEach(function(a){
        var best=null, bi=-1, bs=0;
        rn.forEach(function(b,k){
          if(used[k]) return;
          var r=ratio(a,b);
          if(r>bs){ best=b; bi=k; bs=r; }
        });
        if(bs>=0.3){ changed.push({dari:a, ke:best}); used[bi]=1; }
        else removed.push(a);
      });
      rn.forEach(function(b,k){ if(!used[k]) added.push(b); });
    });
    return {added:added, removed:removed, changed:changed};
  }
  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function render(d){
    var h="";
    function group(title, cls, items, fmt){
      h += '<div class="fd-group"><div class="fd-head ' + cls + '">' + title + ' (' + items.length + ')</div>';
      if(!items.length){ h += '<div class="fd-none">— tidak ada —</div>'; }
      items.forEach(function(it){ h += '<div class="fd-item ' + cls + '">' + fmt(it) + '</div>'; });
      h += '</div>';
    }
    group("＋ DITAMBAH", "fd-add", d.added, esc);
    group("－ DIHAPUS", "fd-rem", d.removed, esc);
    group("〜 DIUBAH", "fd-chg", d.changed, function(c){
      return esc(c.dari) + '<span class="fd-arrow">↓ menjadi ↓</span>' + esc(c.ke);
    });
    document.getElementById("fd-out").innerHTML = h;
  }
  document.getElementById("fd-btn").addEventListener("click", function(){
    render(footnoteDiff(
      document.getElementById("fd-old").value,
      document.getElementById("fd-new").value));
  });
  document.getElementById("fd-clear").addEventListener("click", function(){
    document.getElementById("fd-old").value = "";
    document.getElementById("fd-new").value = "";
    document.getElementById("fd-out").innerHTML = "";
  });
})();

/* === workbench/index.html — blok inline #2 (dipindah ke file eksternal agar CSP script-src 'self' tanpa 'unsafe-inline') === */
(function(){
  "use strict";
  if (typeof __fsaWorkbenchAlreadyInit !== "undefined" && __fsaWorkbenchAlreadyInit) return;
  function num(id){ var v = parseFloat(document.getElementById(id).value); return isFinite(v) ? v : 0; }
  function fmt(n){ return n.toLocaleString("id-ID", {maximumFractionDigits:2}); }
  function fmt0(n){ return Math.round(n).toLocaleString("id-ID"); }

  // --- cermin JS dari covenant_break() Python ---
  function covenantBreak(dscrBase, dscrMin, cfo, shockPct){
    var dscrBaru = dscrBase * (1 + shockPct/100);
    var status = dscrBaru < dscrMin ? "JEBOL" : "AMAN";
    var titik = dscrBase ? (dscrMin/dscrBase - 1)*100 : 0;
    return {dscrBaru:dscrBaru, status:status, titik:titik, cfoBaru:cfo*(1+shockPct/100)};
  }
  function renderCB(){
    var r = covenantBreak(num("cb-dscr"), num("cb-min"), num("cb-cfo"), num("cb-shock"));
    document.getElementById("cb-dscrbaru").textContent = fmt(r.dscrBaru) + "x";
    var st = document.getElementById("cb-status");
    st.textContent = r.status;
    st.className = r.status === "JEBOL" ? "jebol" : "aman";
    document.getElementById("cb-cfobaru").textContent = fmt0(r.cfoBaru);
    document.getElementById("cb-titik").textContent = (r.titik>0?"+":"") + fmt(r.titik) + "%";
    document.getElementById("cb-shockval").textContent = (num("cb-shock")>0?"+":"") + num("cb-shock") + "%";
  }
  ["cb-dscr","cb-min","cb-cfo","cb-shock"].forEach(function(id){
    document.getElementById(id).addEventListener("input", renderCB);
  });

  // --- cermin JS dari dcf_inputs() Python ---
  function dcfInputs(fcffBase, growth, wacc, gTerm){
    var fcff=[], pv=[], i;
    for(i=0;i<5;i++){ fcff.push(fcffBase*Math.pow(1+growth,i)); pv.push(fcff[i]/Math.pow(1+wacc,i+1)); }
    var tv = fcff[4]*(1+gTerm)/(wacc-gTerm);
    var pvTv = tv/Math.pow(1+wacc,5);
    var ev = pv.reduce(function(a,b){return a+b;},0) + pvTv;
    return {fcff:fcff, pv:pv, tv:tv, pvTv:pvTv, ev:ev};
  }
  function renderDCF(){
    var wacc = num("dcf-wacc")/100, gTerm = num("dcf-g")/100;
    /* Guard domain model: perpetuitas TV tidak valid bila WACC <= g — Cue P2-1 */
    if(!(wacc > gTerm)){
      document.getElementById("dcf-table").innerHTML =
        '<tr><td style="text-align:left;padding:.8rem">⚠ <strong>Model tidak valid:</strong> ' +
        'WACC (' + num("dcf-wacc") + '%) harus LEBIH BESAR dari g terminal (' + num("dcf-g") +
        '%). Rumus TV = FCFF×(1+g)/(WACC−g) hanya bermakna bila WACC &gt; g.</td></tr>';
      return;
    }
    var r = dcfInputs(num("dcf-fcff"), num("dcf-growth")/100, wacc, gTerm);
    var h = '<tr><th>Tahun</th><th>FCFF</th><th>PV(FCFF)</th></tr>';
    for(var i=0;i<5;i++){
      h += '<tr><td>' + (i+1) + '</td><td>' + fmt0(r.fcff[i]) + '</td><td>' + fmt0(r.pv[i]) + '</td></tr>';
    }
    h += '<tr><td>Terminal Value (thn 5)</td><td>' + fmt0(r.tv) + '</td><td>' + fmt0(r.pvTv) + '</td></tr>';
    h += '<tr class="hl"><td>Enterprise Value</td><td>—</td><td>' + fmt0(r.ev) + '</td></tr>';
    document.getElementById("dcf-table").innerHTML = h;
  }
  ["dcf-fcff","dcf-growth","dcf-wacc","dcf-g"].forEach(function(id){
    document.getElementById(id).addEventListener("input", renderDCF);
  });
  renderCB(); renderDCF();
})();

/* === workbench/index.html — blok inline #3 (dipindah ke file eksternal agar CSP script-src 'self' tanpa 'unsafe-inline') === */
(function(){
  if (typeof __fsaWorkbenchAlreadyInit !== "undefined" && __fsaWorkbenchAlreadyInit) return;
  var SCRIPTS = [
   {t:"1 · Beneish M-score", d:"8 rasio → skor manipulasi laba. M > −1.78 = FLAG.",
    code:"def beneish_mscore(dsri, gmi, aqi, sgi, depi, sgai, lvgi, tata):\n    m = (-4.84 + 0.92*dsri + 0.528*gmi + 0.404*aqi + 0.892*sgi\n         + 0.115*depi - 0.172*sgai + 4.679*tata - 0.327*lvgi)\n    return m, ('FLAG' if m > -1.78 else 'PASS')"},
   {t:"2 · DSO screen", d:"Tangkap channel stuffing: piutang tumbuh > penjualan.",
    code:"def dso_screen(receivables, revenue, prev_dso, threshold_days=15):\n    dso = receivables / revenue * 365 if revenue else 0\n    drift = dso - prev_dso\n    return dso, ('FLAG' if drift > threshold_days else 'PASS')"},
   {t:"3 · Uji Benford", d:"Digit pertama angka alami mengikuti hukum Benford. Deviasi besar = selidiki.",
    code:"import math\ndef benford_test(numbers):\n    benford = [math.log10(1 + 1/d) for d in range(1, 10)]\n    digits = [int(str(abs(float(x))).lstrip('0').replace('.','')[:1])\n              for x in numbers if float(x) != 0]\n    digits = [d for d in digits if 1 <= d <= 9]\n    n = len(digits)\n    dev = max(abs(digits.count(d)/n - benford[d-1]) for d in range(1, 10))\n    return dev, ('FLAG' if dev > 0.06 else 'PASS')"},
   {t:"4 · Parser XBRL", d:"XML laporan → net margin, ROA, CFO/NI, accruals. Contoh offline; live pakai SEC EDGAR API.",
    code:"import xml.etree.ElementTree as ET\ndef xbrl_parse_ratios(xml_string):\n    root = ET.fromstring(xml_string)\n    def num(tag):\n        el = root.find('.//' + tag)\n        return float(el.text.strip())\n    rev, ni = num('Revenue'), num('NetIncome')\n    ta, cfo = num('TotalAssets'), num('OperatingCashFlow')\n    return {'net_margin': ni/rev, 'roa': ni/ta, 'cfo_ni': cfo/ni, 'accruals': ni-cfo}"},
   {t:"5 · Duplicate detector", d:"Angka kembar dalam jurnal = jejak invoice ganda / round-tripping.",
    code:"from collections import Counter\ndef duplicate_detector(values, min_count=2):\n    c = Counter(values)\n    dups = {v: n for v, n in c.items() if n >= min_count}\n    return dict(sorted(dups.items(), key=lambda kv: -kv[1]))"},
   {t:"6 · Gap analysis", d:"Nomor dokumen yang hilang = disembunyikan / dibatalkan diam-diam.",
    code:"def gap_analysis(numbers):\n    lo, hi = min(numbers), max(numbers)\n    have = set(numbers)\n    return [n for n in range(lo, hi+1) if n not in have]"},
   {t:"7 · Red-flag scan", d:"Frasa penghindar di MD&A — daftar paragraf yang wajib dibaca ulang.",
    code:"def redflag_scan(text):\n    words = ['challenging','one-time','restructuring','going concern',\n             'material weakness','restatement','strategic alternatives']\n    t = text.lower()\n    return sorted([(w, t.count(w)) for w in words if w in t],\n                  key=lambda kv: -kv[1])"},
   {t:"8 · EDGAR live", d:"Tarik fakta XBRL emiten US langsung dari SEC EDGAR API (butuh internet).",
    code:"import json, urllib.request\ndef fetch_edgar_facts(cik, timeout=30):\n    cik = str(cik).zfill(10)\n    url = 'https://data.sec.gov/api/xbrl/companyfacts/CIK%s.json' % cik\n    req = urllib.request.Request(url, headers={\n        'User-Agent': 'FSA-Lab-Edu/1.0', 'Accept': 'application/json'})\n    with urllib.request.urlopen(req, timeout=timeout) as r:\n        facts = json.load(r)['facts']['us-gaap']\n    # ambil FY terakhir (form 10-K) tiap tag, lalu hitung rasio\n    return facts  # → saring tag Revenue*, NetIncomeLoss, Assets, CFO"},
   {t:"9 · Footnote diff", d:"Bandingkan dua versi catatan kaki per kalimat: apa yang ditambah, dihapus, diam-diam diubah.",
    code:"def footnote_diff(old_text, new_text):\n    import difflib, re\n    def sentences(t):\n        return [p.strip() for p in re.split(r'(?<=[.!?])\\s+', (t or '').strip()) if p.strip()]\n    old, new = sentences(old_text), sentences(new_text)\n    added, removed, changed = [], [], []\n    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, old, new, autojunk=False).get_opcodes():\n        if tag == 'equal': continue\n        if tag == 'delete': removed.extend(old[i1:i2])\n        elif tag == 'insert': added.extend(new[j1:j2])\n        else:\n            ro, rn, used = old[i1:i2], new[j1:j2], set()\n            for a in ro:\n                best, bi, bs = None, None, 0.0\n                for k, b in enumerate(rn):\n                    if k in used: continue\n                    r = difflib.SequenceMatcher(None, a, b).ratio()\n                    if r > bs: best, bi, bs = b, k, r\n                if bs >= 0.4: changed.append({'dari': a, 'ke': best}); used.add(bi)\n                else: removed.append(a)\n            added.extend(b for k, b in enumerate(rn) if k not in used)\n    return {'added': added, 'removed': removed, 'changed': changed}"},
   {t:"10 · Covenant Break Predictor", d:"Shock CFO setelah bunga → DSCR baru + status JEBOL/AMAN + titik jebol (shock % di mana DSCR = minimum). Konvensi: DSCR = CFO setelah bunga ÷ debt service (seperti M23). Asumsi: debt service tetap.",
    code:"def covenant_break(dscr_base, dscr_min, cfo, shock_pct):\n    dscr_baru = dscr_base * (1 + shock_pct/100.0)\n    status = 'JEBOL' if dscr_baru < dscr_min else 'AMAN'\n    titik_jebol = (dscr_min/dscr_base - 1.0) * 100.0 if dscr_base else 0.0\n    return dscr_baru, status, titik_jebol  # mis. (1.35, 1.20, 110000, -20) → (1.08, 'JEBOL', -11.1)"},
   {t:"11 · DCF Input Builder", d:"Proyeksi FCFF 5 thn + TV = FCFF5×(1+g)/(wacc−g) + EV. Kanonis M18: (25000, 3%, 12%, 3%) → EV = 277.778.",
    code:"def dcf_inputs(fcff_tahun1, growth, wacc, g_terminal):\n    if not (wacc > g_terminal):\n        raise ValueError('wacc harus > g_terminal')\n    fcff = [fcff_tahun1 * (1+growth)**t for t in range(5)]  # tahun 1..5\n    tv = fcff[-1] * (1+g_terminal) / (wacc - g_terminal)\n    pv_fcff = [f / (1+wacc)**(i+1) for i, f in enumerate(fcff)]\n    pv_tv = tv / (1+wacc)**5\n    ev = sum(pv_fcff) + pv_tv\n    return {'fcff': fcff, 'tv': tv, 'ev': ev, 'pv_fcff': pv_fcff, 'pv_tv': pv_tv}"}
  ];
  var h = "";
  SCRIPTS.forEach(function(s,i){
    h += '<div class="code-card"><div class="code-head"><h3>'+s.t+'</h3>'
      + '<button class="copy-btn" data-i="'+i+'">Salin</button></div><p>'+s.d+'</p><pre>'+s.code.replace(/</g,"&lt;")+'</pre></div>';
  });
  document.getElementById("wb-list").innerHTML = h;
  document.querySelectorAll(".copy-btn").forEach(function(b){
    b.addEventListener("click", function(){
      navigator.clipboard.writeText(SCRIPTS[+b.dataset.i].code).then(function(){
        b.textContent = "Tersalin ✓"; setTimeout(function(){ b.textContent = "Salin"; }, 1500);
      });
    });
  });
})();
