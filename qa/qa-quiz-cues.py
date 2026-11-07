#!/usr/bin/env python3
"""QA quiz-cue guard — permanent measurement for the quiz-cue error class.

History (rounds 11-13, Nov 2026):
- Instinct measured longest-option-is-key = 78% on the 185-question bank.
- Round 12 claimed an auto-fix "78% -> 40%" (325 distractors edited).
- Round 13 found the auto-fix had appended hedge qualifiers ("dalam kondisi
  normal" etc.) to wrong answers only, creating a WORSE cue: 76/185 questions
  answerable by "pick the option without a qualifier". The hack was reverted.
- The revert removed the same 325 distractor edits, restoring ~78% — but no
  script ever measured the rate, so the "40%" claim could not be checked
  against the shipped files. Measurement 2026-11-04 (this script): 77.8%.

This guard makes every future "cue fixed" claim instantly verifiable.

G1: longest-option-is-key rate vs target (<=35%, Septian's stated target).
    FAIL above target. NOTE: this FAILs on the current bank by design — it is
    the honest signal that the manual distractor rewrite (outstanding since
    round 13) has not landed yet. It turns green when the rewrite lands.
G2: qualifier-cue rate == 0. Round-13 bug class: hedge phrases present in
    wrong options but absent from the key => exploitable by pattern.
G3: review-bank <-> module quizzes must hold the same 215 questions with
    identical key text ("stale second copy" class). Found 2026-11-04: modul23
    DSCR question key text differs (bank still carries the pre-R2 wording
    "tak cukup menutup kewajiban" while the module teaches breach-vs-cash
    distinction). FAIL until regenerated.

Method note: "key is longest" counts ties (matches Instinct's 78% method);
unique-longest is reported separately.
"""
import os
import re
import sys
import json
import glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
fails = []


def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + ((" — " + detail) if detail and not cond else ""))
    if not cond:
        fails.append(name)


def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


QP = re.compile(r'\{q:"((?:[^"\\]|\\.)*)",\s*o:\[((?:"(?:[^"\\]|\\.)*",?\s*)+)\],\s*a:(\d+)\}')

HEDGE = ["dalam kondisi normal", "dalam keadaan normal", "pada umumnya",
         "secara umum", "biasanya", "cenderung", "umumnya", "pada dasarnya"]

TARGET_PCT = 35.0


def parse_modules():
    """Return list of (file, question, options, answer_idx)."""
    out = []
    for f in sorted(glob.glob("js/modul*.js")):
        src = read(f)
        for m in QP.finditer(src):
            opts = re.findall(r'"((?:[^"\\]|\\.)*)"', m.group(2))
            a = int(m.group(3))
            if opts and a < len(opts):
                out.append((f, m.group(1), opts, a))
    return out


def parse_bank():
    src = read("js/review-bank.js")
    return json.loads(re.search(r"var REVIEW_BANK = (\[.*\]);", src, re.S).group(1))


mods = parse_modules()
bank = parse_bank()

# ---------- coverage ----------
check("module MCQ count == 215", len(mods) == 215, "got %d" % len(mods))
check("review-bank MCQ count == 215", len(bank) == 215, "got %d" % len(bank))


def rates(items):
    total = len(items)
    key_longest = 0
    key_unique = 0
    for _, _, opts, a in items:
        lens = [len(o) for o in opts]
        mx = max(lens)
        if lens[a] == mx:
            key_longest += 1
            if lens.count(mx) == 1:
                key_unique += 1
    return total, 100.0 * key_longest / total, 100.0 * key_unique / total


def cue_questions(items):
    """Questions where a hedge phrase hits wrong options but not the key."""
    out = []
    for f, q, opts, a in items:
        for h in HEDGE:
            wrong = [o for i, o in enumerate(opts) if i != a and h in o.lower()]
            if wrong and h not in opts[a].lower():
                out.append((f, q[:60], h))
                break
    return out


# ---------- G1: longest-is-key ----------
t, pct_ties, pct_unique = rates([(f, q, o, a) for f, q, o, a in mods])
print("INFO module quizzes: n=%d longest-is-key (ties) %.1f%%, unique %.1f%%"
      % (t, pct_ties, pct_unique))
check("G1 module longest-is-key <= %.0f%%" % TARGET_PCT, pct_ties <= TARGET_PCT,
      "now %.1f%% (rewrite outstanding)" % pct_ties)

bt, bpct_ties, bpct_unique = rates(
    [("review-bank", q["q"], q["o"], q["a"]) for q in bank])
print("INFO review bank:   n=%d longest-is-key (ties) %.1f%%, unique %.1f%%"
      % (bt, bpct_ties, bpct_unique))
check("G1 review-bank longest-is-key <= %.0f%%" % TARGET_PCT, bpct_ties <= TARGET_PCT,
      "now %.1f%% (rewrite outstanding)" % bpct_ties)

# ---------- G2: qualifier cue ----------
mq = cue_questions(mods)
bq = cue_questions([("review-bank", q["q"], q["o"], q["a"]) for q in bank])
print("INFO qualifier-cue questions: modules=%d bank=%d" % (len(mq), len(bq)))
check("G2 module qualifier-cue == 0", len(mq) == 0,
      str(mq[:3]) if mq else "")
check("G2 review-bank qualifier-cue == 0", len(bq) == 0,
      str(bq[:3]) if bq else "")

# ---------- G3: module <-> bank consistency ----------
mod_map = {q: (f, opts, a) for f, q, opts, a in mods}
bank_qs = {q["q"] for q in bank}
missing = [q[:50] for q in bank_qs if q not in mod_map]
extra = [q[:50] for q in mod_map if q not in bank_qs]
check("G3 bank questions all exist in modules", not missing, str(missing[:3]))
check("G3 module questions all exist in bank", not extra, str(extra[:3]))
mism = []
for q in bank:
    f, opts, a = mod_map[q["q"]]
    if q["o"][q["a"]] != opts[a]:
        mism.append((f, q["q"][:60]))
print("INFO key-text mismatches module<->bank: %d" % len(mism))
check("G3 key text identical module<->bank", not mism, str(mism[:2]))

# ---------- report: worst modules (guides the rewrite) ----------
print("\nINFO worst modules by unique-longest rate:")
per = {}
for f, q, opts, a in mods:
    lens = [len(o) for o in opts]
    if lens[a] == max(lens) and lens.count(max(lens)) == 1:
        per[f] = per.get(f, 0) + 1
tot = {}
for f, q, opts, a in mods:
    tot[f] = tot.get(f, 0) + 1
for f, n in sorted(per.items(), key=lambda x: -x[1] / tot[x[0]])[:10]:
    print("  %s: %d/%d (%.0f%%)" % (f, n, tot[f], 100.0 * n / tot[f]))

print()
if fails:
    print("RESULT: %d FAILURES — %s" % (len(fails), fails))
    sys.exit(1)
print("RESULT: ALL PASS")
