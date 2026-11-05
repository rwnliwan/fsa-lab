/* Konverter Nomor PSAK — FSA Lab
   Penomoran baru efektif 1 Jan 2024 (DSAK-IAI).
   Mapping mengikuti tabel resmi IAI: “Komparasi Perubahan Penomoran PSAK ISAK SAK Indonesia”
   (web.iaiglobal.or.id). Standar tanpa padanan resmi TIDAK dicantumkan.
   Setiap baris: tipe, nomor lama, nomor baru, nama standar, padanan IFRS/IAS, padanan US GAAP (ASC), catatan status. */
(function () {
  "use strict";

  var S = [
    {t:"PSAK", o:"1", n:"201", topik:"Penyajian Laporan Keuangan", ifrs:"IAS 1", asc:"ASC 205 / 210 / 220"},
    {t:"PSAK", o:"2", n:"207", topik:"Laporan Arus Kas", ifrs:"IAS 7", asc:"ASC 230"},
    {t:"PSAK", o:"3", n:"234", topik:"Laporan Keuangan Interim", ifrs:"IAS 34", asc:"ASC 270"},
    {t:"PSAK", o:"4", n:"227", topik:"Laporan Keuangan Tersendiri", ifrs:"IAS 27", asc:"ASC 323-10"},
    {t:"PSAK", o:"5", n:"108", topik:"Segmen Operasi", ifrs:"IFRS 8", asc:"ASC 280"},
    {t:"PSAK", o:"7", n:"224", topik:"Pengungkapan Pihak-Pihak Berelasi", ifrs:"IAS 24", asc:"ASC 850"},
    {t:"PSAK", o:"8", n:"210", topik:"Peristiwa Setelah Periode Pelaporan", ifrs:"IAS 10", asc:"ASC 855"},
    {t:"PSAK", o:"10", n:"221", topik:"Pengaruh Perubahan Kurs Valuta Asing", ifrs:"IAS 21", asc:"ASC 830"},
    {t:"PSAK", o:"13", n:"240", topik:"Properti Investasi", ifrs:"IAS 40", asc:"ASC 820 / 360"},
    {t:"PSAK", o:"14", n:"202", topik:"Persediaan", ifrs:"IAS 2", asc:"ASC 330"},
    {t:"PSAK", o:"15", n:"228", topik:"Investasi pada Entitas Asosiasi dan Ventura Bersama", ifrs:"IAS 28", asc:"ASC 323"},
    {t:"PSAK", o:"16", n:"216", topik:"Aset Tetap", ifrs:"IAS 16", asc:"ASC 360"},
    {t:"PSAK", o:"18", n:"226", topik:"Akuntansi dan Pelaporan Program Manfaat Purnakarya", ifrs:"IAS 26", asc:"ASC 715-80"},
    {t:"PSAK", o:"19", n:"238", topik:"Aset Takberwujud", ifrs:"IAS 38", asc:"ASC 350"},
    {t:"PSAK", o:"22", n:"103", topik:"Kombinasi Bisnis", ifrs:"IFRS 3", asc:"ASC 805"},
    {t:"PSAK", o:"24", n:"219", topik:"Imbalan Kerja", ifrs:"IAS 19", asc:"ASC 710 / 712 / 715"},
    {t:"PSAK", o:"25", n:"208", topik:"Kebijakan Akuntansi, Perubahan Estimasi Akuntansi, dan Kesalahan", ifrs:"IAS 8", asc:"ASC 250"},
    {t:"PSAK", o:"26", n:"223", topik:"Biaya Pinjaman", ifrs:"IAS 23", asc:"ASC 835-20"},
    {t:"PSAK", o:"28", n:"328", topik:"Akuntansi Kontrak Asuransi Kerugian", ifrs:"IFRS 4 → IFRS 17", asc:"ASC 944", note:"Digantikan PSAK 117 (Kontrak Asuransi; efektif 2025)"},
    {t:"PSAK", o:"36", n:"336", topik:"Akuntansi Kontrak Asuransi Jiwa", ifrs:"IFRS 4 → IFRS 17", asc:"ASC 944", note:"Digantikan PSAK 117 (Kontrak Asuransi; efektif 2025)"},
    {t:"PSAK", o:"38", n:"338", topik:"Kombinasi Bisnis Entitas Sepengendali", ifrs:"— (tanpa padanan IFRS)", asc:"—"},
    {t:"PSAK", o:"46", n:"212", topik:"Pajak Penghasilan", ifrs:"IAS 12", asc:"ASC 740"},
    {t:"PSAK", o:"48", n:"236", topik:"Penurunan Nilai Aset", ifrs:"IAS 36", asc:"ASC 360"},
    {t:"PSAK", o:"50", n:"232", topik:"Instrumen Keuangan: Penyajian", ifrs:"IAS 32", asc:"ASC 480 / 815"},
    {t:"PSAK", o:"53", n:"102", topik:"Pembayaran Berbasis Saham", ifrs:"IFRS 2", asc:"ASC 718"},
    {t:"PSAK", o:"55", n:"239", topik:"Instrumen Keuangan: Pengakuan dan Pengukuran", ifrs:"IAS 39 (ditarik)", asc:"ASC 320 / 321", note:"Digantikan PSAK 109 (IFRS 9)"},
    {t:"PSAK", o:"56", n:"233", topik:"Laba per Saham", ifrs:"IAS 33", asc:"ASC 260"},
    {t:"PSAK", o:"57", n:"237", topik:"Provisi, Liabilitas Kontinjensi, dan Aset Kontinjensi", ifrs:"IAS 37", asc:"ASC 450"},
    {t:"PSAK", o:"58", n:"105", topik:"Aset Tidak Lancar yang Dikuasai untuk Dijual dan Operasi yang Dihentikan", ifrs:"IFRS 5", asc:"ASC 205-20 / 360-10"},
    {t:"PSAK", o:"60", n:"107", topik:"Instrumen Keuangan: Pengungkapan", ifrs:"IFRS 7", asc:"ASC 825 / 820"},
    {t:"PSAK", o:"61", n:"220", topik:"Akuntansi Hibah Pemerintah dan Pengungkapan Bantuan Pemerintah", ifrs:"IAS 20", asc:"ASC 958-605"},
    {t:"PSAK", o:"62", n:"104", topik:"Kontrak Asuransi", ifrs:"IFRS 4", asc:"ASC 944", note:"Digantikan PSAK 117 (efektif 2025)"},
    {t:"PSAK", o:"63", n:"229", topik:"Pelaporan Keuangan dalam Ekonomi Hiperinflasi", ifrs:"IAS 29", asc:"ASC 255"},
    {t:"PSAK", o:"64", n:"106", topik:"Aktivitas Eksplorasi dan Evaluasi pada Pertambangan Sumber Daya Mineral", ifrs:"IFRS 6", asc:"ASC 930"},
    {t:"PSAK", o:"65", n:"110", topik:"Laporan Keuangan Konsolidasian", ifrs:"IFRS 10", asc:"ASC 810"},
    {t:"PSAK", o:"66", n:"111", topik:"Pengaturan Bersama", ifrs:"IFRS 11", asc:"ASC 323 / 808"},
    {t:"PSAK", o:"67", n:"112", topik:"Pengungkapan Kepentingan dalam Entitas Lain", ifrs:"IFRS 12", asc:"ASC 810"},
    {t:"PSAK", o:"68", n:"113", topik:"Pengukuran Nilai Wajar", ifrs:"IFRS 13", asc:"ASC 820"},
    {t:"PSAK", o:"69", n:"241", topik:"Agrikultur", ifrs:"IAS 41", asc:"ASC 905"},
    {t:"PSAK", o:"70", n:"370", topik:"Akuntansi Aset dan Liabilitas Pengampunan Pajak", ifrs:"—", asc:"—"},
    {t:"PSAK", o:"71", n:"109", topik:"Instrumen Keuangan", ifrs:"IFRS 9", asc:"ASC 320 / 321 / 825"},
    {t:"PSAK", o:"72", n:"115", topik:"Pendapatan dari Kontrak dengan Pelanggan", ifrs:"IFRS 15", asc:"ASC 606"},
    {t:"PSAK", o:"73", n:"116", topik:"Sewa", ifrs:"IFRS 16", asc:"ASC 842"},
    {t:"PSAK", o:"74", n:"117", topik:"Kontrak Asuransi", ifrs:"IFRS 17", asc:"ASC 944"},
    {t:"PSAK", o:"101", n:"401", topik:"Penyajian Laporan Keuangan Syariah", ifrs:"—", asc:"—"},
    {t:"PSAK", o:"102", n:"402", topik:"Akuntansi Murabahah", ifrs:"—", asc:"—"},
    {t:"PSAK", o:"103", n:"403", topik:"Akuntansi Salam", ifrs:"—", asc:"—"},
    {t:"PSAK", o:"104", n:"404", topik:"Akuntansi Istishna’", ifrs:"—", asc:"—"},
    {t:"PSAK", o:"105", n:"405", topik:"Akuntansi Mudharabah", ifrs:"—", asc:"—"},
    {t:"PSAK", o:"106", n:"406", topik:"Akuntansi Musyarakah", ifrs:"—", asc:"—"},
    {t:"PSAK", o:"107", n:"407", topik:"Akuntansi Ijarah", ifrs:"—", asc:"—"},
    {t:"PSAK", o:"108", n:"408", topik:"Akuntansi Transaksi Asuransi Syariah", ifrs:"—", asc:"—"},
    {t:"PSAK", o:"109", n:"409", topik:"Akuntansi Zakat dan Infak/Sedekah", ifrs:"—", asc:"—"},
    {t:"PSAK", o:"110", n:"410", topik:"Akuntansi Sukuk", ifrs:"—", asc:"—"},
    {t:"PSAK", o:"111", n:"411", topik:"Akuntansi Wa’d", ifrs:"—", asc:"—"},
    {t:"PSAK", o:"112", n:"412", topik:"Akuntansi Wakaf", ifrs:"—", asc:"—"},
    {t:"PSAK", o:"59", n:"459", topik:"Akuntansi Perbankan Syariah", ifrs:"—", asc:"—"},
    {t:"ISAK", o:"9", n:"101", topik:"Perubahan atas Liabilitas Aktivitas Purnaoperasi, Restorasi, dan Liabilitas Serupa", ifrs:"IFRIC 1", asc:"—"},
    {t:"ISAK", o:"11", n:"117", topik:"Distribusi Aset Nonkas kepada Pemilik", ifrs:"IFRIC 17", asc:"—"},
    {t:"ISAK", o:"13", n:"116", topik:"Lindung Nilai Investasi Neto dalam Kegiatan Usaha Luar Negeri", ifrs:"IFRIC 16", asc:"—"},
    {t:"ISAK", o:"14", n:"232", topik:"Aset Takberwujud – Biaya Situs Web", ifrs:"SIC 32", asc:"—"},
    {t:"ISAK", o:"15", n:"114", topik:"PSAK 219: Batas Aset Imbalan Pasti, Persyaratan Pendanaan Minimum, dan Interaksinya", ifrs:"IFRIC 14", asc:"—"},
    {t:"ISAK", o:"16", n:"112", topik:"Perjanjian Konsesi Jasa", ifrs:"IFRIC 12", asc:"—"},
    {t:"ISAK", o:"17", n:"110", topik:"Laporan Keuangan Interim dan Penurunan Nilai", ifrs:"IFRIC 10", asc:"—"},
    {t:"ISAK", o:"18", n:"210", topik:"Bantuan Pemerintah – Tidak Berelasi Spesifik dengan Aktivitas Operasi", ifrs:"SIC 10", asc:"—"},
    {t:"ISAK", o:"19", n:"107", topik:"Penerapan Pendekatan Penyajian Kembali dalam PSAK 229: Pelaporan Keuangan dalam Ekonomi Hiperinflasi", ifrs:"SIC 7", asc:"—"},
    {t:"ISAK", o:"20", n:"225", topik:"Pajak Penghasilan – Perubahan dalam Status Pajak Entitas atau Para Pemegang Sahamnya", ifrs:"SIC 25", asc:"—"},
    {t:"ISAK", o:"22", n:"229", topik:"Perjanjian Konsesi Jasa: Pengungkapan", ifrs:"SIC 29", asc:"—"},
    {t:"ISAK", o:"28", n:"119", topik:"Pengakhiran Liabilitas Keuangan dengan Instrumen Ekuitas", ifrs:"IFRIC 19", asc:"—"},
    {t:"ISAK", o:"29", n:"120", topik:"Biaya Pengupasan Lapisan Tanah dalam Tahap Produksi pada Tambang Terbuka", ifrs:"IFRIC 20", asc:"—"},
    {t:"ISAK", o:"30", n:"121", topik:"Pungutan", ifrs:"IFRIC 21", asc:"—"},
    {t:"ISAK", o:"31", n:"331", topik:"Interpretasi atas Ruang Lingkup PSAK 240: Properti Investasi", ifrs:"—", asc:"—"},
    {t:"ISAK", o:"32", n:"332", topik:"Definisi dan Hierarki Standar Akuntansi Keuangan", ifrs:"—", asc:"—"},
    {t:"ISAK", o:"33", n:"122", topik:"Transaksi Valuta Asing dan Imbalan di Muka", ifrs:"IFRIC 22", asc:"—"},
    {t:"ISAK", o:"34", n:"123", topik:"Ketidakpastian dalam Perlakuan Pajak Penghasilan", ifrs:"IFRIC 23", asc:"—"},
    {t:"ISAK", o:"35", n:"335", topik:"Penyajian Laporan Keuangan Entitas Berorientasi Nonlaba", ifrs:"—", asc:"—"},
    {t:"ISAK", o:"36", n:"336", topik:"Interpretasi atas Interaksi antara Ketentuan Mengenai Hak atas Tanah dalam PSAK 216: Aset Tetap dan PSAK 116: Sewa", ifrs:"—", asc:"—"},
    {t:"ISAK", o:"101", n:"401", topik:"Pengakuan Pendapatan Murabahah Tangguh Tanpa Risiko Signifikan Terkait Kepemilikan Persediaan", ifrs:"—", asc:"—"},
    {t:"ISAK", o:"102", n:"402", topik:"Penurunan Nilai Piutang Murabahah", ifrs:"—", asc:"—"},
  ];


  function norm(s) {
    return (s || "").toLowerCase().replace(/[^a-z0-9\s.\-]/g, " ").replace(/\s+/g, " ").trim();
  }

  function haystack(r) {
    return norm([r.t, r.t + " " + r.o, r.t + " " + r.n, r.o, r.n,
      r.topik, r.ifrs, r.asc, r.note || ""].join(" "));
  }

  function matches(r, q) {
    var h = haystack(r);
    var ref = norm(r.ifrs + " " + r.asc); // untuk token angka di dalam "IAS 38" / "ASC 842"
    var toks = norm(q).split(" ").filter(Boolean);
    if (!toks.length) return false;
    return toks.every(function (tk) {
      if (/^\d+$/.test(tk)) {
        // angka murni: cocok persis dengan nomor lama/baru,
        // ATAU muncul sebagai kata utuh di padanan IFRS/ASC ("38" di "IAS 38",
        // tapi "1" tidak match "710")
        if (r.o === tk || r.n === tk) return true;
        return new RegExp("(^|\\D)" + tk + "(\\D|$)").test(ref);
      }
      return h.indexOf(tk) !== -1;
    });
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function card(r) {
    var h = '<div class="conv-card">';
    h += '<div class="nums"><span class="tipe">' + esc(r.t) + '</span>'
      + '<span class="new">' + esc(r.t) + ' ' + esc(r.n) + '</span>'
      + '<span class="old">dahulu ' + esc(r.t) + ' ' + esc(r.o) + '</span></div>';
    h += '<div class="topik">' + esc(r.topik) + '</div>';
    h += '<div class="map"><div><span class="k">IFRS / IAS</span>' + esc(r.ifrs) + '</div>'
      + '<div><span class="k">US GAAP (ASC)</span>' + esc(r.asc) + '</div></div>';
    if (r.note) h += '<div class="flag">⚠ ' + esc(r.note) + '</div>';
    return h + '</div>';
  }

  var q = document.getElementById("conv-q");
  var res = document.getElementById("conv-results");
  var body = document.getElementById("conv-body");
  var cnt = document.getElementById("conv-count");

  function renderTable(list) {
    var h = "";
    list.forEach(function (r) {
      h += '<tr><td class="nb">' + esc(r.t) + ' ' + esc(r.n) + '</td>'
        + '<td class="ob">' + esc(r.t) + ' ' + esc(r.o) + '</td>'
        + '<td>' + esc(r.topik) + (r.note ? '<br><small style="color:var(--sunset-deep)">⚠ ' + esc(r.note) + '</small>' : '') + '</td>'
        + '<td>' + esc(r.ifrs) + '</td><td>' + esc(r.asc) + '</td></tr>';
    });
    body.innerHTML = h;
    cnt.textContent = list.length + " dari " + S.length + " standar ditampilkan";
  }

  function renderResults() {
    var v = q.value.trim();
    if (!v) { res.innerHTML = ""; renderTable(S); return; }
    var hits = S.filter(function (r) { return matches(r, v); });
    if (!hits.length) {
      res.innerHTML = '<div class="conv-empty">Tidak ada standar yang cocok dengan <strong>' + esc(v) + '</strong>. '
        + 'Coba nomor lain (lama/baru), padanan IFRS/ASC, atau kata kunci topik.</div>';
    } else {
      res.innerHTML = '<p class="conv-count">' + hits.length + ' hasil untuk "' + esc(v) + '"</p>'
        + hits.map(card).join("");
    }
    renderTable(hits.length ? hits : []);
  }

  q.addEventListener("input", renderResults);
  renderTable(S);
})();
