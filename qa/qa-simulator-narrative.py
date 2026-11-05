#!/usr/bin/env python3
"""QA Workstream D — retrofit narasi investigasi ke Cooked Books Simulator.

Guards permanen:
 G0 node --check js/simulator.js
 G1 MANIPS/SCREENS/SCEN TIDAK BERUBAH vs baseline pra-Workstream-D
    (isi, urutan, jumlah, kunci jawaban) — dicatat 2026-11-03 sebelum edit
 G2 BRIEFS/DEBRIEFS: 9 entri tiap array, deklarasi terpisah dari SCEN,
    aturan konten (peran, perusahaan konsisten, triple-lens, aman-HTML)
 G3 smoke test logika via node + fake DOM: brief ter-render, klik screen
    benar -> evidence log terisi, submit jawaban benar -> Skor 2/2 + debrief
 G4 index.html tidak berubah struktural (1 script eksternal, tanpa inline baru)
"""
import json, os, re, subprocess, sys

ROOT = os.path.expanduser("~/workspace/fsa-web")
JS = os.path.join(ROOT, "js", "simulator.js")
HTML = os.path.join(ROOT, "simulator", "index.html")
HARNESS = "/tmp/qa_sim_harness.js"

fails = []
def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + ((" — " + detail) if detail and not cond else ""))
    if not cond:
        fails.append(name + (": " + detail if detail else ""))

src = open(JS, encoding="utf-8").read()

# ---------- G0: syntax ----------
r = subprocess.run(["node", "--check", JS], capture_output=True, text=True)
check("G0 node --check", r.returncode == 0, r.stderr.strip()[:200])

# ---------- helper: quote-aware JS string list parser ----------
def js_strings(region):
    out, i, n = [], 0, len(region)
    while i < n:
        if region[i] == '"':
            j, buf = i + 1, []
            while j < n:
                c = region[j]
                if c == "\\" and j + 1 < n:
                    buf.append(region[j:j+2]); j += 2; continue
                if c == '"':
                    break
                buf.append(c); j += 1
            out.append("".join(buf)); i = j + 1
        else:
            i += 1
    return out

def extract_array(name):
    m = re.search(r"var %s = \[" % name, src)
    assert m, "array %s tidak ditemukan" % name
    i, depth, instr, esc = m.end() - 1, 0, False, False
    start = i
    while i < len(src):
        c = src[i]
        if instr:
            if esc: esc = False
            elif c == "\\": esc = True
            elif c == '"': instr = False
        else:
            if c == '"': instr = True
            elif c == "[": depth += 1
            elif c == "]":
                depth -= 1
                if depth == 0:
                    return src[start:i+1]
        i += 1
    raise AssertionError("array %s tidak tertutup" % name)

# ---------- G1: baseline kunci tidak berubah ----------
# Baseline dicatat 2026-11-03 SEBELUM Workstream D (file 112 baris).
EXP_MANIPS = ["Channel stuffing (penjualan dipompa)","Kapitalisasi beban operasi",
 "Utang disembunyikan","Tidak ada manipulasi","Cookie jar reserve (cadangan disembunyikan)",
 "Pendapatan pihak berelasi (tunneling)","Big bath (rugi jumbo sekali jalan)"]
EXP_SCREENS = ["DSO drift (piutang vs penjualan)","Accrual gap (NI − CFO)","DPO / layar liabilitas",
 "Tidak ada yang mencurigakan","Beban provisi / akrual cadangan",
 "Penjualan pihak berelasi / DSO berelasi","One-off / beban luar biasa"]
EXP_SCEN = [("Kasus 1","Mudah",0,0),("Kasus 2","Sedang",1,1),("Kasus 3","Sulit",2,2),
 ("Kasus 4","Sulit",0,0),("Kasus 5","Sulit",3,3),("Kasus 6","Sulit",1,1),
 ("Kasus 7","Sedang",4,4),("Kasus 8","Sedang",5,5),("Kasus 9","Sulit",6,6)]

check("G1a MANIPS 7 item, isi+urutan sama", js_strings(extract_array("MANIPS")) == EXP_MANIPS)
check("G1b SCREENS 7 item, isi+urutan sama", js_strings(extract_array("SCREENS")) == EXP_SCREENS)
names = re.findall(r'\{name:"(Kasus \d+)", diff:"(\w+)"', src)
keys = re.findall(r"aManip:(\d), aScreen:(\d)", src)
got_scen = [(n, d, int(a), int(b)) for (n, d), (a, b) in zip(names, keys)]
check("G1c SCEN 9 skenario, (name,diff,aManip,aScreen) sama", got_scen == EXP_SCEN,
      "dapat %d skenario" % len(got_scen))
check("G1d SCEN tidak disisipi key narasi baru",
      all(k not in extract_array("SCEN") for k in ["BRIEFS", "DEBRIEFS", "caseBrief", "caseDebrief"]),
      "array narasi harus terpisah, bukan key di objek SCEN")

# ---------- G2: BRIEFS / DEBRIEFS ----------
briefs = js_strings(extract_array("BRIEFS"))
debriefs = js_strings(extract_array("DEBRIEFS"))
check("G2a BRIEFS 9 entri", len(briefs) == 9, "dapat %d" % len(briefs))
check("G2b DEBRIEFS 9 entri", len(debriefs) == 9, "dapat %d" % len(debriefs))
check("G2c deklarasi terpisah tepat 1x tiap array",
      len(re.findall(r"var BRIEFS\s*=", src)) == 1 and len(re.findall(r"var DEBRIEFS\s*=", src)) == 1)

EXP_COMPANY = ["Nusantara Makmur"]*6 + ["Baruna Lines", "Sentosa Group", "Cakra Steel"]
def sent_endings(t):
    return len(re.findall(r"(?<!\d)\.(?!\d)", t))
ok_brief = all("auditor forensik" in b and EXP_COMPANY[i] in b and 2 <= sent_endings(b) <= 3
               for i, b in enumerate(briefs))
check("G2d tiap BRIEF: peran + perusahaan konsisten + 2-3 kalimat", ok_brief)
check("G2e tiap BRIEF menyebut periode 2025", all("2025" in b for b in briefs))
ok_deb = all("triple-lens" in d and "forensik:" in d and "investasi:" in d and "kredit:" in d
             for d in debriefs)
check("G2f tiap DEBRIEF: pelajaran triple-lens 1 baris (3 lens)", ok_deb)
check("G2g DEBRIEF aman-HTML (tanpa < > & mentah)",
      all(not re.search(r"[<>&]", d) for d in debriefs))
check("G2h narasi tidak pakai PT Cemerlang Abadi (kanonis)",
      "Cemerlang Abadi" not in src.split("var BRIEFS")[1])

# ---------- G3: smoke test logika via node + fake DOM ----------
HARNESS_SRC = r'''
const fs = require("fs");
const src = fs.readFileSync(process.argv[2], "utf8");
function makeEl(){
  const handlers = {};
  const el = {
    innerHTML:"", textContent:"", className:"", id:"",
    dataset:{}, children:[], style:{}, parentNode:null,
    addEventListener(ev,fn){ (handlers[ev]=handlers[ev]||[]).push(fn); },
    querySelector(sel){ return makeEl(); },
    querySelectorAll(sel){ return []; },
    appendChild(c){ c.parentNode=this; this.children.push(c); return c; },
    removeChild(c){ this.children=this.children.filter(x=>x!==c); c.parentNode=null; return c; },
    getAttribute(k){ const key=k.replace(/^data-/,""); return this.dataset[key]!==undefined ? String(this.dataset[key]) : null; },
    setAttribute(k,v){ const key=k.replace(/^data-/,""); this.dataset[key]=String(v); },
    scrollIntoView(){},
    classList:{ toggle(){}, add(){}, remove(){} },
    _fire(ev,arg){ (handlers[ev]||[]).forEach(f=>f(arg||{preventDefault(){}})); }
  };
  return el;
}
const tabsEl = makeEl();
const tabStubs = [];
for(let j=0;j<9;j++){ const t=makeEl(); t.dataset={s:String(j)}; tabStubs.push(t); }
let goEl, resEl, evlistEl, evemptyEl, screenStubs=[];
const bodyEl = makeEl();
Object.defineProperty(bodyEl,"innerHTML",{
  set(html){
    this._html=html;
    const n=(html.match(/data-sc="/g)||[]).length;
    screenStubs=[];
    for(let k=0;k<n;k++){
      const sc=makeEl(); sc.dataset={sc:String(k),ev:"0"};
      const label=makeEl(); sc._label=label;
      sc.querySelector=function(sel){ return sel===".sn" ? label : makeEl(); };
      screenStubs.push(sc);
    }
    goEl=makeEl(); resEl=makeEl(); evlistEl=makeEl(); evemptyEl=makeEl();
  },
  get(){ return this._html||""; }
});
const answers={};
global.document={
  querySelector(sel){
    if(sel==="#sim-tabs") return tabsEl;
    if(sel==="#sim-body") return bodyEl;
    if(sel==="#sim-go") return goEl;
    if(sel==="#sim-res") return resEl;
    if(sel==="#sim-evlist") return evlistEl;
    if(sel==="#sim-evlog-empty") return evemptyEl;
    const m=sel.match(/^input\[name="([ms])(\d+)"\]:checked$/);
    if(m){ const k=m[1]+m[2]; return (k in answers)?{value:answers[k]}:null; }
    return makeEl();
  },
  querySelectorAll(sel){
    if(sel==="#sim-tabs .stmt-tab") return tabStubs;
    if(sel==="#sim-body .screen") return screenStubs;
    return [];
  },
  getElementById(id){
    if(id==="sim-evlist") return evlistEl;
    if(id==="sim-evlog-empty") return evemptyEl;
    for(const c of evlistEl.children) if(c.id===id) return c;
    return null;
  },
  createElement(tag){ return makeEl(); }
};
global.localStorage={ _m:{},
  getItem(k){ return k in this._m?this._m[k]:null; },
  setItem(k,v){ this._m[k]=String(v); } };
(0,eval)(src);
const out={};
// 1. brief ter-render untuk Kasus 1
out.brief_rendered = bodyEl._html.includes("Brief investigasi") && bodyEl._html.includes("auditor forensik");
// 2. klik screen benar (data-sc=0, Kasus 1 aScreen=0) -> evidence terisi
out.screens_n = screenStubs.length;
screenStubs[0]._fire("click");
out.ev_flagged = screenStubs[0].dataset.ev==="1";
out.ev_label = (screenStubs[0]._label.textContent||"").startsWith("\u2713");
out.ev_count = evlistEl.children.length;
out.ev_text = evlistEl.children.length? evlistEl.children[0].textContent : "";
out.ev_empty_hidden = evemptyEl.style.display==="none";
// 3. toggle off -> bukti hilang lagi
screenStubs[0]._fire("click");
out.ev_unflagged = screenStubs[0].dataset.ev==="0" && evlistEl.children.length===0;
// 4. keyboard Enter juga menandai
screenStubs[1]._fire("keydown",{key:"Enter",preventDefault(){}});
out.ev_keyboard = screenStubs[1].dataset.ev==="1";
screenStubs[1]._fire("click"); // kembalikan
// 5. submit jawaban BENAR (Kasus 1: aManip=0, aScreen=0)
screenStubs[0]._fire("click"); // tandai bukti lagi (simulasi user)
answers["m0"]="0"; answers["s0"]="0";
goEl._fire("click");
out.score = resEl.innerHTML.includes("Skor: 2/2");
out.debrief = resEl.innerHTML.includes("Debrief investigasi") && resEl.innerHTML.includes("triple-lens");
out.best = global.localStorage._m["fsa_sim_0"]==="2";
// 6. submit jawaban SALAH -> skor 0/2, debrief tetap muncul (formatif)
answers["m0"]="6"; answers["s0"]="6";
goEl._fire("click");
out.wrong_score = resEl.innerHTML.includes("Skor: 0/2");
out.wrong_debrief = resEl.innerHTML.includes("Debrief investigasi");
console.log(JSON.stringify(out));
'''
open(HARNESS, "w", encoding="utf-8").write(HARNESS_SRC)
r = subprocess.run(["node", HARNESS, JS], capture_output=True, text=True)
try:
    o = json.loads(r.stdout.strip().splitlines()[-1])
except Exception as e:
    check("G3 harness jalan", False, "node error: " + (r.stderr[:300] or str(e)))
    o = None
if o:
    check("G3a brief investigasi ter-render", o.get("brief_rendered") is True)
    check("G3b 3 kartu screen Kasus 1 terpasang", o.get("screens_n") == 3, str(o.get("screens_n")))
    check("G3c klik screen benar -> evidence ter-flag + label ✓",
          o.get("ev_flagged") and o.get("ev_label"))
    check("G3d evidence log terisi 1 kalimat red flag",
          o.get("ev_count") == 1 and "54,8 hari" in o.get("ev_text","") and "DSO" in o.get("ev_text",""),
          o.get("ev_text","")[:80])
    check("G3e empty-state disembunyikan saat ada bukti", o.get("ev_empty_hidden") is True)
    check("G3f toggle ulang menghapus bukti", o.get("ev_unflagged") is True)
    check("G3g keyboard Enter menandai bukti (aksesibilitas)", o.get("ev_keyboard") is True)
    check("G3h submit benar -> Skor 2/2 + skor terbaik tersimpan", o.get("score") and o.get("best"))
    check("G3i debrief naratif muncul setelah vonis", o.get("debrief") is True)
    check("G3j jawaban salah -> Skor 0/2, debrief tetap formatif",
          o.get("wrong_score") and o.get("wrong_debrief"))

# ---------- G4: index.html tidak berubah struktural ----------
html = open(HTML, encoding="utf-8").read()
check("G4a index.html: tepat 1 tag <script (eksternal saja)",
      len(re.findall(r"<script", html)) == 1, "dapat %d" % len(re.findall(r"<script", html)))
check("G4b index.html: tetap load ../js/simulator.js", '../js/simulator.js' in html)
check("G4c index.html: container brief/log/debrief di-render JS (tidak hardcode)",
      "sim-evlist" not in html and "Brief investigasi" not in html)

print()
if fails:
    print("GAGAL %d:" % len(fails))
    for f in fails: print(" - " + f)
    sys.exit(1)
print("SEMUA GUARD LOLOS")
