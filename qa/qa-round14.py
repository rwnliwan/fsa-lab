#!/usr/bin/env python3
"""QA Round 14 — guard permanen untuk fix temuan audit Cue (3 Nov 2026).

G1: robots.txt ada + plain text (bukan HTML homepage)
G2: sitemap.xml valid XML + memuat landing + 48 modul + 26 tools
G3: glossary count konsisten — JS == HTML == landing (programmatic, bukan hardcode)
G4: mobile nav — hamburger ada (aria-expanded/aria-controls), :focus-visible ada
G5: simulator link TIDAK disembunyikan (false positive audit) + noscript ada
G6: M35 framing "PRESUMSI AWAL" ada; tidak ada ambang sebagai aturan
G7: M7 KAM wording benar (reasonable assurance, bukan "paling berisiko")
G8: review-bank diregen (252 soal, kunci ikut teks)
"""
import os, re, sys, xml.dom.minidom

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []

def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + ((" — " + detail) if detail and not cond else ""))
    if not cond:
        fails.append(name)

def read(p):
    with open(os.path.join(ROOT, p), encoding="utf-8") as f:
        return f.read()

# ---- G1: robots.txt ----
try:
    r = read("robots.txt")
    check("G1 robots.txt bukan HTML", "<!DOCTYPE" not in r and "<html" not in r)
    check("G1 robots.txt ada Allow + Sitemap", "Allow: /" in r and "sitemap.xml" in r)
except FileNotFoundError:
    check("G1 robots.txt ada", False)

# ---- G2: sitemap.xml ----
try:
    s = read("sitemap.xml")
    doc = xml.dom.minidom.parseString(s)
    urls = [n.firstChild.data for n in doc.getElementsByTagName("loc")]
    check("G2 sitemap XML valid", True)
    check("G2 sitemap ada landing", "https://fsa-lab.pages.dev/" in urls)
    mods = [u for u in urls if "/modul-" in u]
    check("G2 sitemap 48 modul", len(mods) == 48, f"dapat {len(mods)}")
    tools = [u for u in urls if "/modul-" not in u and u != "https://fsa-lab.pages.dev/"]
    check("G2 sitemap 26 tools", len(tools) == 26, f"dapat {len(tools)}")
except Exception as e:
    check("G2 sitemap valid + lengkap", False, str(e)[:80])

# ---- G3: glossary count ----
gjs = read("glosarium/glosarium.js")
n_js = len(re.findall(r"\{en:", gjs))
ghtml = read("glosarium/index.html")
m1 = re.search(r"(\d+)\s*istilah", ghtml)
land = read("index.html")
m2 = re.search(r"(\d+)\s*istilah", land)
check("G3 count JS>0", n_js > 0, f"n={n_js}")
check("G3 HTML == JS", m1 and int(m1.group(1)) == n_js, f"html={m1.group(1) if m1 else '?'} js={n_js}")
check("G3 landing == JS", m2 and int(m2.group(1)) == n_js, f"landing={m2.group(1) if m2 else '?'} js={n_js}")

# ---- G4: mobile nav ----
check("G4 hamburger ada", 'aria-controls="navLinks"' in land and 'aria-expanded' in land)
css = read("css/style.css")
check("G4 :focus-visible ada", ":focus-visible" in css)
check("G4 focus outline >=3px", re.search(r":focus-visible[^{]*\{[^}]*outline:\s*3px", css) is not None)
mainjs = read("js/main.js")
check("G4 Escape handler ada", "Escape" in mainjs)

# ---- G5: simulator ----
check("G5 link simulator TIDAK disembunyikan", ('href="simulator/"' in land or 'href="/simulator/"' in land))
sim = read("simulator/index.html")
check("G5 noscript ada", "<noscript>" in sim)
sjs = read("js/simulator.js")
check("G5 simulator.js fungsional", "MANIPS" in sjs and "sim-tabs" in sjs)

# ---- G6: M35 framing ----
m35 = read("js/modul35.js")
check("G6 M35 'PRESUMSI AWAL' ada", "PRESUMSI AWAL" in m35)
check("G6 M35 contoh de facto control", "de facto" in m35.lower() or "tanpa mayoritas" in m35.lower())

# ---- G7: M7 KAM ----
m7 = read("js/modul7.js")
check("G7 M7 reasonable assurance", "reasonable assurance" in m7.lower())
check("G7 M7 bukan 'paling berisiko' mentah", "paling berisiko" not in m7.lower() or "paling signifikan" in m7.lower())

# ---- G8: review bank ----
rb = read("js/review-bank.js")
n_q = rb.count('"q":')
check("G8 review bank 252 soal", n_q == 252, f"dapat {n_q}")

print()
if fails:
    print(f"RESULT: {len(fails)} FAIL — {fails}")
    sys.exit(1)
print("RESULT: ALL PASS")
