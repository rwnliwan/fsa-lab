#!/usr/bin/env python3
"""F08 (review Cue, 2026-11-03): tambah breadcrumb + nav prev/next ke semua halaman modul.

- Breadcrumb di atas: Beranda / Phase X / Modul N (link root-absolute: / , /#kurikulum, /modul-n/)
- Teks "Modul N dari {TOTAL}" — TOTAL dihitung dari jumlah direktori modul-*/ (ditulis statis + komentar)
- Nav bawah: "← Modul N-1" / "Modul N+1 →" (modul-1 tanpa prev, modul-37 tanpa next)
- Nomor phase dibaca dari <p class="kicker">Phase N ...</p> tiap modul (fallback: peta manual di bawah)
- Idempoten: lewati file yang sudah punya class="crumb".
- TIDAK menyentuh: quiz keys, grading, hard gates, localStorage, brand identity.
"""
import glob
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Fallback bila kicker tidak terbaca (peta dari konten/struktur yang ada, 2026-11-03)
PHASE_FALLBACK = {}
for n in range(1, 7):
    PHASE_FALLBACK[n] = 1
for n in range(7, 16):
    PHASE_FALLBACK[n] = 2
for n in range(16, 19):
    PHASE_FALLBACK[n] = 3
for n in range(19, 22):
    PHASE_FALLBACK[n] = 4
for n in range(22, 24):
    PHASE_FALLBACK[n] = 5
for n in range(24, 28):
    PHASE_FALLBACK[n] = 6
for n in range(28, 30):
    PHASE_FALLBACK[n] = 7
for n in range(30, 34):
    PHASE_FALLBACK[n] = 8
for n in range(34, 36):
    PHASE_FALLBACK[n] = 9
for n in range(36, 38):
    PHASE_FALLBACK[n] = 10


def phase_of(n, html):
    m = re.search(r'<p class="kicker">\s*Phase\s+(\d+)', html)
    if m:
        return int(m.group(1))
    return PHASE_FALLBACK[n]


def crumb_html(n, phase, total):
    return (
        '<!-- F08: breadcrumb + hitungan modul (total %d = jumlah direktori modul-*/ saat generate; '
        'update bila modul bertambah) -->\n'
        '<nav class="crumb" aria-label="Breadcrumb">\n'
        '  <a href="/">Beranda</a><span class="sep" aria-hidden="true">/</span>\n'
        '  <a href="/#kurikulum">Phase %d</a><span class="sep" aria-hidden="true">/</span>\n'
        '  <span aria-current="page">Modul %d</span>\n'
        '</nav>\n'
        '<p class="mod-count">Modul %d dari %d</p>' % (total, phase, n, n, total)
    )


def pagenav_html(n, total):
    links = []
    if n > 1:
        links.append('  <a href="/modul-%d/" class="pn-prev">\u2190 Modul %d</a>' % (n - 1, n - 1))
    if n < total:
        links.append('  <a href="/modul-%d/" class="pn-next">Modul %d \u2192</a>' % (n + 1, n + 1))
    return (
        '<!-- F08: navigasi antar-modul (prev/next) -->\n'
        '<nav class="mod-pagenav" aria-label="Navigasi modul">\n'
        + '\n'.join(links)
        + '\n</nav>'
    )


def main():
    mod_dirs = sorted(glob.glob(os.path.join(BASE, 'modul-*', 'index.html')),
                      key=lambda p: int(re.search(r'modul-(\d+)', p).group(1)))
    total = len(mod_dirs)
    assert total >= 1, 'tidak ada direktori modul-*/ ditemukan'
    print('modul ditemukan: %d' % total)

    done, skipped = 0, 0
    for path in mod_dirs:
        n = int(re.search(r'modul-(\d+)', path).group(1))
        with open(path, encoding='utf-8') as f:
            html = f.read()
        if 'class="crumb"' in html:
            print('  modul-%d: SUDAH ADA, dilewati' % n)
            skipped += 1
            continue
        phase = phase_of(n, html)

        # 1) breadcrumb: sisipkan tepat setelah </nav> penutup .modul-nav pertama
        mnav = html.find('<nav class="modul-nav"')
        assert mnav != -1, 'modul-%d: <nav class="modul-nav"> tidak ditemukan' % n
        nav_end = html.find('</nav>', mnav)
        assert nav_end != -1, 'modul-%d: penutup </nav> tidak ditemukan' % n
        nav_end += len('</nav>')
        html = html[:nav_end] + '\n\n' + crumb_html(n, phase, total) + html[nav_end:]

        # 2) prev/next: sisipkan tepat sebelum <footer> pertama
        ftr = html.find('<footer>')
        assert ftr != -1, 'modul-%d: <footer> tidak ditemukan' % n
        html = html[:ftr] + pagenav_html(n, total) + '\n\n' + html[ftr:]

        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        print('  modul-%d: breadcrumb + pagenav OK (Phase %d)' % (n, phase))
        done += 1

    print('selesai: %d diubah, %d dilewati' % (done, skipped))


if __name__ == '__main__':
    sys.exit(main())
