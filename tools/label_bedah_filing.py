#!/usr/bin/env python3
"""F09 bedah-filing (review Cue, 2026-11-03): label provenans per blok di tiap stop.

- 📄 Kutipan        = teks/angka persis dari Annual Report SOCI 2024
- 🧮 Hitungan FSA Lab = perhitungan kami dari angka laporan
- 🧭 Interpretasi analis = opini & panduan membaca (.modmap)
Blok .fact campuran kutipan+hitungan dipecah jadi dua div (teks & angka identik).
Setiap anchor harus cocok TEPAT 1x, kalau tidak script gagal (fail-closed).
"""
import sys

PATH = '/home/hatch/workspace/fsa-web/bedah-filing/index.html'
Q = '<span class="src-tag q">📄 Kutipan</span>'
C = '<span class="src-tag c">🧮 Hitungan FSA Lab</span>'
I = '<span class="src-tag i">🧭 Interpretasi analis</span>'

# (anchor_unik, sisipan_tepat_setelah_anchor)
INSERTS = [
    # s1
    ('<div class="fact">Pendapatan neto', Q),
    ('<p class="modmap"><span class="tag">M4</span><span class="tag">M5</span><span class="tag">M6</span>', I),
    ('<p class="modmap"><span class="tag">G2</span>\n      Baris laba ditulis TERPISAH', I),
    # s2
    ('<div class="fact">Saham beredar', Q),
    ('<p class="modmap"><span class="tag">M24</span>', I),
    # s3
    ('<div class="fact">31 Des 2024:', Q),
    ('<p class="modmap"><span class="tag">M28</span> Baca narasi', I),
    ('<p class="modmap"><span class="tag">M22</span><span class="tag">G2</span> Tiga anak baru', I),
    # s4
    ('<div class="fact"><strong>Laba rugi:</strong>', Q),
    ('<div class="fact"><strong>Arus kas:</strong>', Q),
    ('<div class="fact"><strong>Rasio (manajemen):</strong>', Q),
    ('<p class="modmap"><span class="tag">M28</span><span class="tag">M5</span><span class="tag">M6</span><span class="tag">M10</span>', I),
    # s5
    ('<div class="fact"><strong>Hal audit utama (KAM)</strong>', Q),
    ('<p class="modmap"><span class="tag">M7</span><span class="tag">M12</span>', I),
    # s6 (fact1 dipecah terpisah; fact2 + modmap di sini)
    ('<div class="fact"><strong>Catatan 15d:</strong>', Q),
    ('<p class="modmap"><span class="tag">M32</span>', I),
    # s7 (fact1 dipecah terpisah)
    ('<div class="fact"><strong>Investasi:</strong>', Q),
    ('<p class="modmap"><span class="tag">M10</span><span class="tag">M4</span>', I),
    # s8 (fact dipecah terpisah)
    ('<p class="modmap"><span class="tag">M16</span>', I),
    # s9
    ('<div class="fact"><strong>Aset hak-guna</strong>', Q),
    ('<div class="fact"><strong>Jual-dan-sewa-balik:</strong>', Q),
    ('<p class="modmap"><span class="tag">M13</span>', I),
    ('<p class="modmap"><span class="tag">M22</span> Lessor terbesar', I),
    # s10
    ('<div class="fact"><strong>Afiliasi</strong>', Q),
    ('<div class="fact"><strong>Utang bank</strong>', Q),
    ('<p class="modmap"><span class="tag">M22</span> (PSAK 224)', I),
    # s11 (fact1 dipecah terpisah)
    ('<div class="fact"><strong>Segmen</strong>', Q),
    ('<p class="modmap"><span class="tag">M8</span><span class="tag">M22</span>', I),
    # s12
    ('<div class="fact"><strong>Mata uang fungsional = Dolar AS</strong>', Q),
    ('<div class="fact"><strong>Konsolidasi:</strong>', Q),
    ('<p class="modmap"><span class="tag">G5</span>', I),
    ('<p class="modmap"><span class="tag">G2</span> (gap konsolidasi)', I),
]

# (old_penuh, new_penuh) — pemecahan blok campuran; teks & angka identik, hanya batas div + label
SPLITS = [
    # s6: ETR 10,4% = hitungan kami
    ('''    <div class="fact">Laba sebelum pajak <span class="mono">19.136.874</span> · beban pajak <span class="mono">(1.994.473)</span> →
      <strong>ETR <span class="mono">10,4%</span></strong>, jauh di bawah tarif badan 22%. Rinciannya:
      pajak <strong>final <span class="mono">1.951.120</span></strong> + kini tidak final <span class="mono">66.351</span> −
      <strong>benefit pajak tangguhan <span class="mono">(22.998)</span></strong> = total beban pajak <span class="mono">(1.994.473)</span>.</div>''',
     '''    <div class="fact">''' + Q + '''Laba sebelum pajak <span class="mono">19.136.874</span> · beban pajak <span class="mono">(1.994.473)</span>.
      Rinciannya: pajak <strong>final <span class="mono">1.951.120</span></strong> + kini tidak final <span class="mono">66.351</span> −
      <strong>benefit pajak tangguhan <span class="mono">(22.998)</span></strong> = total beban pajak <span class="mono">(1.994.473)</span>.</div>
    <div class="fact">''' + C + '''<strong>ETR <span class="mono">10,4%</span></strong> = 1.994.473 ÷ 19.136.874 — jauh di bawah tarif badan 22%.</div>'''),
    # s7: CFO/NI 2,38× = hitungan kami
    ('''    <div class="fact"><strong>Operasi (direct method):</strong> penerimaan pelanggan <span class="mono">162.702.341</span> ·
      pembayaran pemasok <span class="mono">(101.118.218)</span> · beban keuangan dibayar <span class="mono">(11.818.443)</span> ·
      <strong>CFO <span class="mono">40.866.814</span></strong> (2023: 36.589.762) vs laba bersih <span class="mono">17.142.401</span> →
      <strong>CFO/NI = <span class="mono">2,38×</span></strong>.</div>''',
     '''    <div class="fact">''' + Q + '''<strong>Operasi (direct method):</strong> penerimaan pelanggan <span class="mono">162.702.341</span> ·
      pembayaran pemasok <span class="mono">(101.118.218)</span> · beban keuangan dibayar <span class="mono">(11.818.443)</span> ·
      <strong>CFO <span class="mono">40.866.814</span></strong> (2023: 36.589.762) vs laba bersih <span class="mono">17.142.401</span>.</div>
    <div class="fact">''' + C + '''<strong>CFO/NI = <span class="mono">2,38×</span></strong> — 40.866.814 ÷ 17.142.401.</div>'''),
    # s8: ECL rate 20,2% & 32,2% = hitungan kami
    ('''    <div class="fact">Piutang bruto <span class="mono">16.895.123</span> · cadangan ECL/penurunan nilai
      <span class="mono">(3.414.388)</span> → <strong>ECL rate <span class="mono">20,2%</span></strong> (2023: 3.571.191) ·
      neto pihak ketiga <span class="mono">13.480.735</span>. <strong>Aging: &gt;90 hari <span class="mono">5.441.690</span></strong>
      = <span class="mono">32,2%</span> dari bruto. Manajemen: cadangan cukup; <strong>ECL piutang pihak berelasi = nihil</strong>.</div>''',
     '''    <div class="fact">''' + Q + '''Piutang bruto <span class="mono">16.895.123</span> · cadangan ECL/penurunan nilai
      <span class="mono">(3.414.388)</span> (2023: 3.571.191) → neto pihak ketiga <span class="mono">13.480.735</span>.
      <strong>Aging: &gt;90 hari <span class="mono">5.441.690</span></strong> dari bruto.
      Manajemen: cadangan cukup; <strong>ECL piutang pihak berelasi = nihil</strong>.</div>
    <div class="fact">''' + C + '''<strong>ECL rate <span class="mono">20,2%</span></strong> = 3.414.388 ÷ 16.895.123 ·
      <strong>bucket &gt;90 hari = <span class="mono">32,2%</span></strong> dari bruto (5.441.690 ÷ 16.895.123).</div>'''),
    # s11: 50,7% = hitungan kami
    ('''    <div class="fact"><strong>Konsentrasi:</strong> PT Pertamina International Shipping =
      <span class="mono">83.970.644</span> dari pendapatan <span class="mono">165.638.994</span> →
      <strong><span class="mono">50,7%</span> pendapatan dari SATU pelanggan</strong> (2023: 101.096.979).</div>''',
     '''    <div class="fact">''' + Q + '''<strong>Konsentrasi:</strong> PT Pertamina International Shipping =
      <span class="mono">83.970.644</span> dari pendapatan <span class="mono">165.638.994</span> (2023: 101.096.979).</div>
    <div class="fact">''' + C + '''<strong><span class="mono">50,7%</span> pendapatan dari SATU pelanggan</strong> — 83.970.644 ÷ 165.638.994.</div>'''),
]


def main():
    with open(PATH, encoding='utf-8') as f:
        html = f.read()

    for anchor, badge in INSERTS:
        n = html.count(anchor)
        assert n == 1, 'anchor cocok %dx (harus 1x): %r' % (n, anchor[:60])
        html = html.replace(anchor, anchor + badge, 1)

    for old, new in SPLITS:
        n = html.count(old)
        assert n == 1, 'split cocok %dx (harus 1x): %r' % (n, old[:60])
        html = html.replace(old, new, 1)

    with open(PATH, 'w', encoding='utf-8') as f:
        f.write(html)
    print('OK: %d badge disisipkan, %d blok dipecah' % (len(INSERTS), len(SPLITS)))


if __name__ == '__main__':
    sys.exit(main())
