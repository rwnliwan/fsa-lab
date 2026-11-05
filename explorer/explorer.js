/* Statement Explorer — FSA Lab
   Klik pos laporan → penjelasan + acuan PSAK (nomor BARU, terverifikasi ke tabel IAI)
   + sudut forensik. Angka = PT Cemerlang Abadi 2025, Rp juta, ilustratif (kanonis). */
(function () {
  "use strict";

  /* fmt: titik ribuan */
  function n(v) {
    var neg = v < 0, a = Math.abs(Math.round(v));
    var s = a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return neg ? "(" + s + ")" : s;
  }

  /* D = detail per pos: {t: judul, d: penjelasan, p: "acuan PSAK", f: "sudut forensik"} */
  var D = {
    kas: {t: "Kas dan setara kas — 21.440",
      d: "Aset paling likuid: kas fisik, giro, deposito ≤3 bulan. Baris pertama yang dibaca kreditur — tapi juga baris yang paling mudah 'dirias' sesaat sebelum tutup buku.",
      p: "PSAK 201 (dulu 1) — penyajian · PSAK 207 (dulu 2) — laporan arus kas",
      f: "Window dressing: pinjam jangka pendek 29 Des, lunasi 3 Jan — kas akhir tahun menggembung. Cek: arus kas pendanaan melonjak di periode yang sama + kas anjlok di Q1 berikutnya."},
    piutang: {t: "Piutang usaha neto — 104.000",
      d: "Tagihan ke pelanggan setelah cadangan kerugian (ECL 4.100; rate 3,8%). Piutang bruto 108.100. Di bawah PSAK 109, cadangan dibentuk berbasis ekspektasi kerugian — penuh judgment manajemen.",
      p: "PSAK 109 (dulu 71) — instrumen keuangan & ECL",
      f: "Channel stuffing: kirim barang ke distributor akhir kuartal agar penjualan tercatat, piutang membengkak. Sinyal: DSO naik tajam (di sini 73 hari vs 50,2 di 2024) sementara kas pelanggan seret. Piutang fiktif = penjualan fiktif."},
    persediaan: {t: "Persediaan — 96.000",
      d: "Barang dagang/jadi dinilai mana yang lebih rendah: biaya perolehan vs nilai realisasi neto. Metode biaya (FIFO/rata-rata) memengaruhi HPP dan laba.",
      p: "PSAK 202 (dulu 14) — persediaan",
      f: "Overstatement klasik: biaya yang seharusnya jadi beban dikapitalisasi ke persediaan → HPP turun, laba naik. Sinyal: DIO memanjang (103,7 hari) + margin kotor 'membaik' tanpa alasan bisnis. Stok opname fiktif pernah jadi modus."},
    atetap: {t: "Aset tetap neto — 230.000",
      d: "Tanah 40.000 + bangunan & mesin 132.000 + aset hak-guna (ROU) 58.000. Disusutkan kecuali tanah. Revaluasi model diizinkan dengan pengungkapan penuh.",
      p: "PSAK 216 (dulu 16) — aset tetap · PSAK 116 (dulu 73) — sewa (ROU)",
      f: "Perpanjang umur manfaat → depresiasi turun → laba naik, tanpa kas berubah. Revaluasi agresif → ekuitas menggembung, D/E terlihat aman. Cek: bandingkan umur manfaat vs peers + depresiasi/pendapatan dari tahun ke tahun."},
    sewa: {t: "Liabilitas sewa — 60.000",
      d: "Nilai kini pembayaran sewa (PSAK 116): sewa operasi kini on-balance-sheet. Dulu off-BS — kini analis tak perlu lagi mengkapitalisasi manual.",
      p: "PSAK 116 (dulu 73) — sewa",
      f: "Struktur kontrak agar diklasifikasi jasa (bukan sewa) untuk menghindari liabilitas. Cek konsistensi: liabilitas sewa vs beban sewa di CALK; perusahaan 'asset-light' dengan sewa besar patut dicurigai."},
    utusaha: {t: "Utang usaha — 62.000",
      d: "Kewajiban ke supplier. DPO 67 hari = rata-rata bayar 67 hari setelah barang diterima. Utang usaha adalah pendanaan gratis — selama tidak merusak relasi.",
      p: "PSAK 201 (dulu 1) — penyajian",
      f: "Tahan pembayaran akhir tahun → CFO menggembung (kas belum keluar). Sinyal: DPO melonjak tiba-tiba + keluhan supplier. Reverse factoring yang disamarkan sebagai utang usaha = utang bank tersembunyi."},
    ubank: {t: "Utang bank — 141.440 (pendek 31.440 + panjang 110.000)",
      d: "Pinjaman berbunga. Klasifikasi lancar vs tidak lancar mengikuti jatuh tempo 12 bulan — kecuali ada covenant breach yang membuat utang jangka panjang jatuh tempo seketika.",
      p: "PSAK 109 (dulu 71) — instrumen keuangan · PSAK 201 — klasifikasi lancar",
      f: "Reklasifikasi utang pendek → panjang via refinancing menit terakhir untuk mempercantik current ratio. Utang via entitas khusus (SPE) yang tak dikonsolidasi = Enron playbook. Cek: CALK bagian utang + covenant."},
    ekui: {t: "Ekuitas — 179.440 (modal 100.000 + laba ditahan 79.440)",
      d: "Sisa klaim pemilik setelah liabilitas. Laba ditahan 79.440 = akumulasi laba − dividen. Book value per saham = 1.794 (100 juta saham).",
      p: "PSAK 201 (dulu 1) — penyajian",
      f: "Laba ditahan menggembung dari laba fiktif bertahun-tahun = bom waktu. Cek: laba ditahan vs kumulatif CFO historis — selisih lebar persisten = kualitas laba buruk (lihat Sloan accruals 3,2%)."},
    jual: {t: "Penjualan — 520.000",
      d: "Pendapatan diakui saat kewajiban pelaksanaan dipenuhi (pengendalian beralih ke pelanggan). Bukan saat kas diterima — di sinilah judgment masuk.",
      p: "PSAK 115 (dulu 72) — pendapatan dari kontrak dengan pelanggan",
      f: "Premature recognition: akui penjualan sebelum barang dikirim (bill-and-hold), round-tripping antar afiliasi. Sinyal: penjualan naik + piutang naik lebih cepat + CFO stagnan. Baca kebijakan pendapatan di CALK dulu."},
    hpp: {t: "HPP — (338.000)",
      d: "Biaya langsung penjualan. Gross margin 35,0% = (520.000−338.000)/520.000. HPP dan persediaan adalah dua sisi koin yang sama.",
      p: "PSAK 202 (dulu 14) — persediaan",
      f: "Tunda pengakuan HPP (biaya ditahan di persediaan) → margin 'membaik'. Sinyal: GM naik + DIO naik bersamaan — kombinasi yang tidak masuk akal secara bisnis."},
    bop: {t: "Beban operasi — (110.000)",
      d: "Beban penjualan, umum, administrasi. Operating margin 13,8% setelah beban ini.",
      p: "PSAK 201 (dulu 1) — penyajian",
      f: "Kapitalisasi beban operasi sebagai 'aset takberwujud' atau 'beban ditangguhkan' → beban turun, laba naik. Cek: pos aset 'lain-lain' yang tumbuh tanpa penjelasan + rasio beban/penjualan turun misterius."},
    bunga: {t: "Beban bunga — (14.000)",
      d: "Biaya utang. Interest coverage 5,14x = 72.000/14.000 — masih di atas ambang aman 3x, tapi tren utang naik.",
      p: "PSAK 207 (dulu 2) — klasifikasi arus kas · PSAK 223 (dulu 26) — biaya pinjaman",
      f: "Kapitalisasi bunga ke aset (proyek) berlebihan → beban bunga kecil, laba besar. Cek: bunga kas dibayar vs beban bunga di IS; selisih besar = banyak yang dikapitalisasi."},
    pajak: {t: "Beban pajak — (12.760), tarif efektif 22%",
      d: "Pajak kini + pajak tangguhan. Tarif efektif 22% = tarif statutori — tidak ada beda permanen material tahun ini.",
      p: "PSAK 212 (dulu 46) — pajak penghasilan",
      f: "Aset pajak tangguhan dari rugi fiskal diakui agresif ('pasti laba di masa depan') → ekuitas & laba menggembung. Cek: DTA besar + riwayat rugi = klaim yang patut diragukan."},
    cfo: {t: "Arus kas operasi — 30.800",
      d: "Kas dari operasi = NI 45.240 + depresiasi 30.000 + ΔWC (44.440). Catatan: di bawah PSAK, bunga dibayar masuk CFO (bukan pendanaan) — penting saat membaca covenant.",
      p: "PSAK 207 (dulu 2) — laporan arus kas",
      f: "CFO dipompa: tunda bayar supplier (+DPO), sekuritisasi piutang (kas masuk kini, risiko pergi), jual piutang ke bank. Sinyal: CFO/NI < 1 persisten (di sini 0,68x, turun dari 1,48x di 2024) = alarm kualitas."},
    capex: {t: "Belanja modal (capex) — (48.000)",
      d: "Investasi aset tetap. FCFF = 30.800 + 14.000×(1−22%) − 48.000 = (6.280) — negatif: investasi melebihi kas yang dihasilkan.",
      p: "PSAK 216 (dulu 16) — aset tetap · PSAK 207 — arus kas investasi",
      f: "Capex maintenance disamarkan sebagai growth capex (terlihat 'investasi', padahal menutup kebocoran). Atau sebaliknya: beban maintenance dikapitalisasi. Cek: capex vs depresiasi (48.000 vs 30.000 = ekspansi nyata, di sini wajar)."},
    dividen: {t: "Dividen dibayar — (6.000)",
      d: "Distribusi ke pemegang saham. FCFE 2025 = (5.760) — negatif: dividen tahun ini dibayar BUKAN dari kas bebas, melainkan dari utang/kas.",
      p: "PSAK 201 (dulu 1) — penyajian · PSAK 207 — arus kas pendanaan",
      f: "Dividen dari utang = sinyal leverage, bukan kemurahan (pelajaran M6/M23). Manajemen mempertahankan dividen demi citra sambil neraca melemah. Cek: dividen vs FCFE, bukan vs laba."}
  };

  var TABS = {
    bs: {label: "Neraca", rows: [
      ["kas", "Kas dan setara kas"],
      ["piutang", "Piutang usaha (neto)"],
      ["persediaan", "Persediaan"],
      [null, "Aset lancar", "221.440", "tot"],
      ["atetap", "Aset tetap neto"],
      [null, "TOTAL ASET", "451.440", "tot"],
      ["utusaha", "Utang usaha"],
      ["ubank", "Utang bank jangka pendek"],
      [null, "Utang pajak & akrual", "8.560"],
      [null, "Liabilitas lancar", "102.000", "tot"],
      ["ubank", "Utang bank jangka panjang"],
      ["sewa", "Liabilitas sewa"],
      [null, "TOTAL LIABILITAS", "272.000", "tot"],
      ["ekui", "Laba ditahan"],
      [null, "TOTAL EKUITAS", "179.440", "tot"]
    ]},
    is: {label: "Laba Rugi", rows: [
      ["jual", "Penjualan"],
      ["hpp", "HPP"],
      [null, "Laba kotor", "182.000", "tot"],
      ["bop", "Beban operasi"],
      [null, "Laba operasi (EBIT)", "72.000", "tot"],
      ["bunga", "Beban bunga"],
      [null, "PBT", "58.000", "tot"],
      ["pajak", "Beban pajak (22%)"],
      [null, "LABA BERSIH", "45.240", "tot"]
    ]},
    cf: {label: "Arus Kas", rows: [
      ["cfo", "Arus kas operasi (CFO)"],
      ["capex", "Belanja modal (capex)"],
      [null, "Arus kas investasi", "(48.000)", "tot"],
      ["ubank", "Utang neto ditarik"],
      ["dividen", "Dividen dibayar"],
      [null, "Arus kas pendanaan", "5.440", "tot"],
      [null, "Kenaikan (penurunan) kas", "(11.760)", "tot"]
    ]}
  };

  var VALS = {kas: "21.440", piutang: "104.000", persediaan: "96.000", atetap: "230.000",
    utusaha: "62.000", ubank: "31.440 / 110.000", sewa: "60.000", ekui: "79.440",
    jual: "520.000", hpp: "(338.000)", bop: "(110.000)", bunga: "(14.000)",
    pajak: "(12.760)", cfo: "30.800", capex: "(48.000)", dividen: "(6.000)"};

  var cur = "bs";

  function render() {
    var t = TABS[cur], h = '<tr><th style="text-align:left">Pos</th><th style="text-align:right">2025 (Rp juta)</th></tr>';
    t.rows.forEach(function (r) {
      var key = r[0], label = r[1], cls = r[3] || "";
      var val = r[2] || (key ? VALS[key] : "—");
      if (key) {
        h += '<tr class="pick ' + cls + '" data-k="' + key + '"><td>' + label + '</td><td class="pv">' + val + '</td></tr>';
      } else {
        h += '<tr class="' + cls + '"><td>' + label + '</td><td class="pv">' + val + '</td></tr>';
      }
    });
    var tbl = document.getElementById("exp-table");
    tbl.innerHTML = h;
    tbl.querySelectorAll("tr.pick").forEach(function (tr) {
      tr.addEventListener("click", function () { show(tr.dataset.k, tr); });
    });
    document.querySelectorAll("#exp-tabs .stmt-tab").forEach(function (b) {
      var on = b.dataset.t === cur;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });
    document.getElementById("exp-tabpanel").setAttribute("aria-labelledby", "exp-tab-" + cur);
  }

  function show(key, tr) {
    var d = D[key]; if (!d) return;
    document.querySelectorAll("#exp-table tr.pick").forEach(function (x) { x.classList.remove("sel"); });
    if (tr) tr.classList.add("sel");
    var panel = document.getElementById("exp-panel");
    panel.innerHTML =
      "<h3>" + d.t + "</h3>" +
      "<p>" + d.d + "</p>" +
      '<p><span class="tag">' + d.p + "</span></p>" +
      '<div class="forensic"><p><strong>🎯 Cara umum memanipulasinya:</strong> ' + d.f + "</p></div>";
    /* #3/N8: di layar sempit, gulir ke penjelasan */
    if (window.innerWidth <= 900 && tr) {
      setTimeout(function(){ panel.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50);
    }
  }

  document.querySelectorAll("#exp-tabs .stmt-tab").forEach(function (b) {
    b.addEventListener("click", function () { cur = b.dataset.t; render(); });
  });

  /* F07: navigasi panah kiri/kanan antar tab (pola tab WAI-ARIA) */
  document.getElementById("exp-tabs").addEventListener("keydown", function (e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    var tabs = Array.prototype.slice.call(document.querySelectorAll("#exp-tabs .stmt-tab"));
    var i = tabs.findIndex(function (b) { return b.dataset.t === cur; });
    i = (i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    cur = tabs[i].dataset.t;
    render();
    tabs[i].focus();
    e.preventDefault();
  });

  render();
})();
