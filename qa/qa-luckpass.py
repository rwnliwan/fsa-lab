#!/usr/bin/env python3
"""QA luck-pass — permanent measurement for the tie-luck error class (R17/R18).

Method (Instinct R18 section 3; validated against R18's published numbers):
- Fixed single-rank strategy: always pick the r-th longest option (r=1..4),
  uniform pick among ties. A tie block of width k covering position r is
  exploitable at every covered position with probability 1/k.
- Per question, per strategy r: p = 1/k if the key lies in the tie block
  covering position r (k = block width), 1 if the key is uniquely at
  position r (block width 1), 0 otherwise. Positions are 1-based in the
  length-sorted (descending) option list; a tie block occupies consecutive
  positions.
- Module luck-pass = max over r of P(Poisson-binomial(p_1..p_n) >= GATE),
  GATE = ceil(80% x n questions) per module (4/5, 7/8). Exact arithmetic
  (Fraction).
- Also reported: worst expected score ratio (max over r of sum p_i / n;
  R17 bar < 0.70) and guaranteed score ratio (max over r of count of
  p_i == 1 / n; agreed bar <= 0.60).
- Guard: FAIL if any module luck-pass > 25%.

History:
- R17 measured tie-luck wrong (each tied key at a single rank, every tie a
  50/50 flip). R18 corrected the model (tie block of width k,
  Poisson-binomial) and published: M10 41.7%, M11 31.3%, M12/M36 16.7%,
  M9/M13 12.5%, M37 4.2%, M15/M26/M27 25% (no-signal ties: 3 strict + one
  width-4 tie, pass probability = blind guess on that one question).
- R18 polish (Nov 2026): one distractor tweak each in M10/M11, breaking one
  width-2 tie -> M10 16.7%, M11 12.5%. This script locks that result in.
- The review bank is a shuffled copy of the same questions (lengths
  unchanged), so its luck-pass is identical; measured here on module quizzes.
"""
import json
import subprocess
import sys
from fractions import Fraction
from math import comb

ROOT = "/home/hatch/workspace/fsa-web"
GATE = None       # per-module gate: ceil(80% x n questions), computed in main()
LIMIT = Fraction(1, 4)  # polish target: luck-pass <= 25% per module

NODE_EXTRACT = r"""
const fs = require('fs');
function extractArr(src, varName) {
  const m = src.match(new RegExp('var ' + varName + '\\s*=\\s*\\['));
  if (!m) return null;
  let i = src.indexOf('[', m.index), depth = 0, start = i;
  let inStr = null, esc = false;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) { esc = false; }
      else if (c === '\\') { esc = true; }
      else if (c === inStr) { inStr = null; }
      continue;
    }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '[') depth++;
    if (c === ']') { depth--; if (!depth) break; }
  }
  return eval(src.slice(start, i + 1));
}
const out = {};
const _nums = fs.readdirSync('js').filter(f => f.startsWith('modul') && f.endsWith('.js'))
  .map(f => parseInt(f.slice(5, -3), 10)).sort((a, b) => a - b);
for (const n of _nums) {
  try {
    const q = extractArr(fs.readFileSync('js/modul' + n + '.js', 'utf8'), 'QUIZ');
    if (q) out[n] = q.map(x => ({o: x.o, a: x.a}));
  } catch (e) { out[n] = {error: String(e)}; }
}
console.log(JSON.stringify(out));
"""


def blocks_for(o, a):
    """Return list of (positions_covered_set, key_inside, width) per tie block.

    Positions are 1-based in the length-descending order.
    """
    order = sorted(range(len(o)), key=lambda i: -len(o[i]))
    blocks = []
    i = 0
    pos = 1
    while i < len(order):
        j = i
        while j + 1 < len(order) and len(o[order[j + 1]]) == len(o[order[i]]):
            j += 1
        idxs = order[i:j + 1]
        blocks.append((set(range(pos, pos + len(idxs))), a in idxs, len(idxs)))
        pos += len(idxs)
        i = j + 1
    return blocks


def strategy_p(o, a, r):
    """P(correct) for fixed single-rank strategy r on one question."""
    for positions, key_inside, width in blocks_for(o, a):
        if r in positions:
            return Fraction(1, width) if key_inside else Fraction(0)
    return Fraction(0)


def p_pass(ps, gate=GATE):
    """Exact P(X >= gate) for independent Bernoulli(ps) — Poisson-binomial DP."""
    dist = [Fraction(1)]
    for p in ps:
        nd = [Fraction(0)] * (len(dist) + 1)
        for k, v in enumerate(dist):
            nd[k] += v * (1 - p)
            nd[k + 1] += v * p
        dist = nd
    return sum(dist[gate:])


def main():
    proc = subprocess.run(["node", "-e", NODE_EXTRACT], cwd=ROOT,
                          capture_output=True, text=True)
    if proc.returncode != 0:
        print("FAIL ekstraksi QUIZ via node:", proc.stderr[:200])
        return 1
    data = json.loads(proc.stdout)
    fails = []
    rows = []
    for n in sorted(data, key=int):
        qs = data[n]
        if isinstance(qs, dict):
            print(f"FAIL modul {n} ter-parse: {qs.get('error')}")
            fails.append(f"M{n} parse")
            continue
        gate = -(-len(qs) * 4 // 5)  # gate modul = ceil(80% x soal): 4/5, 7/8
        best_lp, best_r, best_exp, best_guar = Fraction(0), None, Fraction(0), 0
        for r in range(1, 5):
            ps = [strategy_p(q["o"], q["a"], r) for q in qs]
            lp = p_pass(ps, gate)
            exp = sum(ps)
            guar = sum(1 for p in ps if p == 1)
            if lp > best_lp:
                best_lp, best_r = lp, r
            best_exp = max(best_exp, exp)
            best_guar = max(best_guar, guar)
        rows.append((int(n), len(qs), best_lp, best_r, best_exp, best_guar))
        flag = "FAIL " if best_lp > LIMIT else "ok   "
        print(f"{flag}M{int(n):>2}: luck-pass {float(best_lp)*100:5.1f}% "
              f"({best_lp}) via rank {best_r} | exp {float(best_exp):.2f}/{len(qs)} "
              f"| guaranteed {best_guar}/{len(qs)}")
        if best_lp > LIMIT:
            fails.append(f"M{n} luck-pass {float(best_lp)*100:.1f}%")
    print()
    worst_exp_ratio = max(r[4] / r[1] for r in rows)
    worst_guar_ratio = max(r[5] / r[1] for r in rows)
    print(f"INFO worst expected score ratio: {float(worst_exp_ratio):.2f} (bar R17 < 0.70)")
    print(f"INFO worst guaranteed score ratio: {float(worst_guar_ratio):.2f} (bar disepakati <= 0.60)")
    if worst_exp_ratio >= Fraction(7, 10):
        fails.append(f"worst expected ratio {float(worst_exp_ratio):.2f} >= 0.70")
    if worst_guar_ratio > Fraction(3, 5):
        fails.append(f"worst guaranteed ratio {float(worst_guar_ratio):.2f} > 0.60")
    if fails:
        print(f"RESULT: {len(fails)} FAILURES — {fails}")
        return 1
    print("RESULT: ALL PASS (semua modul luck-pass <= 25%)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
