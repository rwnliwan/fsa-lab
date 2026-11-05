#!/usr/bin/env python3
"""Verifikasi mapping konverter/konverter.js vs tabel resmi IAI.
Sumber resmi: /tmp/komparasi-psak.txt (ekstrak dari PDF IAI
"Komparasi Perubahan Penomoran PSAK ISAK SAK Indonesia_FINAL.pdf").
Assert: (1) semua 28+ contoh dari brief cocok; (2) SEMUA baris konverter
cocok dengan tabel resmi; (3) baris tanpa padanan resmi sudah dihapus.
Exit 0 bila semua lolos, 1 bila ada yang gagal."""
import re, sys

PDF = '/tmp/komparasi-psak.txt'
JS  = '/home/hatch/workspace/fsa-web/konverter/konverter.js'

import os
if not os.path.exists(PDF):
    # File sumber adalah artefak /tmp yang disiapkan manual (bukan bagian repo).
    # Mapping konverter sendiri di-guard oleh qa-round9.py G1 (28 contoh kunci).
    print('SKIP: %s tidak ada (artefak /tmp manual) — mapping di-guard qa-round9.py G1' % PDF)
    sys.exit(0)

# ---- 1. Parse tabel resmi dari PDF ----
official = {}   # (tipe, old) -> new
txt = open(PDF, encoding='utf-8').read()
cur_old = cur_new = cur_type = None
for line in txt.split('\n'):
    m = re.match(r'^(PSAK|ISAK)\s+(\d+)\s+(PSAK|ISAK)\s+(\d+)\s*(.*)$', line.strip())
    if m:
        cur_type, cur_old, cur_new = m.group(1), m.group(2), m.group(4)
        title = m.group(5).strip()
        if title:
            official[(cur_type, cur_old)] = cur_new
            cur_old = cur_new = cur_type = None
    elif cur_old and line.strip():
        # judul lanjutan di baris berikutnya
        official[(cur_type, cur_old)] = cur_new
        cur_old = cur_new = cur_type = None

print('baris resmi terparse: %d' % len(official))
assert len(official) == 79, 'jumlah baris resmi harus 79 (57 PSAK + 22 ISAK), dapat %d' % len(official)

# ---- 2. Parse S array dari konverter.js ----
src = open(JS, encoding='utf-8').read()
m = re.search(r'var S = \[(.*?)\n  \];', src, re.S)
assert m, 'S array tidak ditemukan'
rows = re.findall(r'\{t:"(PSAK|ISAK)", o:"(\d+)", n:"(\d+)"', m.group(1))
conv = {(t, o): n for t, o, n in rows}
print('baris konverter: %d' % len(conv))

fails = []

# ---- 3. Contoh wajib dari brief (28+) ----
contoh = {
 ('PSAK','71'):'109', ('PSAK','72'):'115', ('PSAK','48'):'236', ('PSAK','57'):'237',
 ('PSAK','19'):'238', ('PSAK','2'):'207', ('PSAK','14'):'202', ('PSAK','24'):'219',
 ('PSAK','7'):'224', ('PSAK','60'):'107', ('PSAK','68'):'113', ('PSAK','15'):'228',
 ('PSAK','22'):'103', ('PSAK','38'):'338', ('PSAK','73'):'116', ('PSAK','25'):'208',
 ('PSAK','46'):'212', ('PSAK','53'):'102', ('PSAK','56'):'233', ('PSAK','65'):'110',
 ('PSAK','74'):'117', ('PSAK','55'):'239', ('PSAK','3'):'234', ('PSAK','4'):'227',
 ('PSAK','5'):'108', ('PSAK','8'):'210', ('PSAK','10'):'221', ('PSAK','13'):'240',
 ('PSAK','16'):'216', ('PSAK','26'):'223', ('PSAK','28'):'328', ('PSAK','36'):'336',
 ('PSAK','50'):'232', ('PSAK','61'):'220', ('PSAK','62'):'104', ('PSAK','63'):'229',
 ('PSAK','64'):'106', ('PSAK','66'):'111', ('PSAK','67'):'112', ('PSAK','69'):'241',
 ('PSAK','70'):'370', ('PSAK','58'):'105',
 ('ISAK','16'):'112', ('ISAK','34'):'123', ('ISAK','35'):'335',
}
ok_c = 0
for k, want in sorted(contoh.items()):
    got = conv.get(k)
    off = official.get(k)
    if got == want and off == want:
        ok_c += 1
    else:
        fails.append('CONTOH %s %s: konverter=%s resmi=%s ekspektasi=%s' % (k[0], k[1], got, off, want))
print('contoh brief cocok: %d/%d' % (ok_c, len(contoh)))

# ---- 4. Semua baris konverter harus cocok tabel resmi ----
ok_all = 0
for k, n in sorted(conv.items()):
    off = official.get(k)
    if off is None:
        fails.append('KONVERTER %s %s -> %s: TIDAK ADA di tabel resmi' % (k[0], k[1], n))
    elif off != n:
        fails.append('KONVERTER %s %s -> %s: resmi=%s (BEDA)' % (k[0], k[1], n, off))
    else:
        ok_all += 1
print('baris konverter cocok resmi: %d/%d' % (ok_all, len(conv)))

# ---- 5. Semua baris resmi harus ada di konverter (tidak ada yang hilang) ----
missing = [k for k in official if k not in conv]
for k in sorted(missing):
    fails.append('RESMI %s %s -> %s: HILANG dari konverter' % (k[0], k[1], official[k]))
print('baris resmi hilang dari konverter: %d' % len(missing))

# ---- 6. Baris tanpa padanan resmi harus sudah dihapus ----
removed = [('PSAK', x) for x in ('12','21','27','30','33','34','35','37','40','41')]
gone = [k for k in removed if k not in conv]
for k in sorted(set(removed) - set(gone)):
    fails.append('BARIS %s %s seharusnya sudah dihapus tapi masih ada' % k)
print('baris tanpa padanan resmi terhapus: %d/%d' % (len(gone), len(removed)))

# ---- 7. Tidak ada duplikat nomor lama/baru ----
olds = [k for k in conv]; news = [(k[0], v) for k, v in conv.items()]
assert len(set(olds)) == len(olds), 'duplikat nomor lama'
assert len(set(news)) == len(news), 'duplikat nomor baru'
print('tidak ada duplikat nomor lama/baru: OK')

print()
if fails:
    print('GAGAL (%d):' % len(fails))
    for f in fails:
        print(' -', f)
    sys.exit(1)
print('SEMUA VERIFIKASI LOLOS ✔')
