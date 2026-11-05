/* Spot the Fraud — FSA Lab. Tiga kasus FIKTIF, angka ILUSTRATIF (Rp juta). */
(function () {
  "use strict";

  var CASES = [
    {
      id: "maju", name: "PT Maju Mundur", tag: "Kasus 1 · Revenue Fraud",
      story: "Distributor elektronik yang sahamnya naik 3× lipat dalam setahun berkat 'pertumbuhan pendapatan 35%'. " +
        "Manajemen sesumbar 'permintaan meledak'. Kamu ditugaskan memverifikasi sebelum klien membeli sahamnya.",
      rows: [
        ["Pendapatan", "850.000", "1.150.000"],
        ["Piutang usaha", "310.000", "520.000"],
        ["Persediaan", "95.000", "140.000"],
        ["Kas dan setara kas", "40.000", "22.000"],
        ["Total aset", "1.200.000", "1.600.000"],
        ["Laba bersih", "102.000", "175.000"],
        ["Arus kas operasi", "18.000", "(12.000)"]
      ],
      note: "Catatan 2025: 42% penjualan dilakukan ke PT Mundur Jaya, entitas sepengendali.",
      items: [
        {t: "Pendapatan +35%, tapi piutang usaha +68%", f: true,
         w: "Piutang tumbuh hampir 2× lipat pendapatan: barang 'terjual' tapi belum dibayar. DSO melonjak dari ±133 hari ke ±165 hari — pola klasik channel stuffing."},
        {t: "Laba bersih +72% sementara arus kas operasi negatif", f: true,
         w: "Laba tanpa kas = laba akrual. Rasio CFO/laba negatif berarti kualitas laba buruk; uangnya nyangkut di piutang yang mungkin tak tertagih."},
        {t: "Kas turun dari Rp40 M ke Rp22 M di tengah laba rekor", f: true,
         w: "Perusahaan 'untung besar' tapi kas menipis — kas memang tidak pernah masuk karena penjualan belum dibayar."},
        {t: "42% penjualan ke entitas sepengendali", f: true,
         w: "Penjualan ke pihak berelasi rawan round-tripping: barang berputar, pendapatan tercatat, kas tak berpindah. Wajib telusur PSAK 224 (pengungkapan pihak berelasi)."},
        {t: "Persediaan naik 47% seiring ekspansi", f: false,
         w: "Bukan red flag utama: kenaikan persediaan masih sejalan dengan pertumbuhan penjualan 35% — wajar untuk distributor yang ekspansi."},
        {t: "Margin kotor stabil di 38%", f: false,
         w: "Distractor: margin stabil justru melemahkan hipotesis manipulasi harga pokok. Fokus forensik tetap di piutang vs kas."}
      ]
    },
    {
      id: "kilat", name: "PT Kilat Abadi", tag: "Kasus 2 · Asset Overstatement",
      story: "Produsen komponen yang labanya naik 38% setelah mengakuisisi PT Petir. Manajemen " +
        "mengklaim 'efisiensi pasca-akuisisi'. Kamu memeriksa apakah asetnya benar-benar seberharga itu.",
      rows: [
        ["Aset tetap neto", "900.000", "1.350.000"],
        ["Aset takberwujud (R&D dikapitalisasi)", "60.000", "145.000"],
        ["Goodwill (akuisisi PT Petir)", "0", "280.000"],
        ["Beban depresiasi", "90.000", "81.000"],
        ["Laba bersih", "120.000", "165.000"],
        ["Arus kas operasi", "95.000", "98.000"],
        ["Total aset", "2.100.000", "2.900.000"]
      ],
      note: "Catatan 2025: tidak ada pengungkapan uji penurunan nilai atas goodwill.",
      items: [
        {t: "Aset tetap +50% tanpa pengungkapan capex yang memadai", f: true,
         w: "PERTANYAAN: lonjakan aset tanpa capex yang jelas. Hipotesis: (1) beban dikapitalisasi, (2) akuisisi (aset naik tanpa capex setara), (3) reklasifikasi. Uji: baca catatan akuisisi & kebijakan kapitalisasi."},
        {t: "Biaya R&D Rp85 M dikapitalisasi sebagai aset takberwujud", f: true,
         w: "Fase riset (research) seharusnya dibebankan; kapitalisasi agresif menunda beban ke masa depan dan menggelembungkan aset (PSAK 238)."},
        {t: "Beban depresiasi TURUN meski aset tetap naik 50%", f: true,
         w: "PERTANYAAN: depresiasi turun saat aset naik. Hipotesis: (1) umur manfaat diperpanjang, (2) komposisi aset berubah (aset baru belum disusutkan penuh), (3) pelepasan aset lama, (4) perubahan estimasi. Uji: bandingkan tarif depresiasi per kategori aset."},
        {t: "Goodwill Rp280 M tanpa uji impairment yang diungkap", f: true,
         w: "Goodwill wajib diuji penurunan nilainya tiap tahun (PSAK 236). Tanpa uji, overpayment akuisisi bisa disembunyikan bertahun-tahun."},
        {t: "Arus kas operasi tumbuh sejalan dengan laba", f: false,
         w: "Pernyataan ini SALAH: CFO/NI turun dari 0,79x (95/120) ke 0,59x (98/165) — laba naik 37,5% tapi kas operasi hanya +3,2%. Kualitas laba dari sisi kas MEMBURUK. Ini red flag tersendiri, bukan 'bukan red flag'."},
        {t: "Rasio lancar 1,8×", f: false,
         w: "Distractor: likuiditas sehat tidak membuktikan aset tidak digelembungkan."}
      ]
    },
    {
      id: "samudra", name: "PT Samudra Biru", tag: "Kasus 3 · One-Off & Tunneling",
      story: "Perusahaan perikanan & cold chain yang labanya 'hampir 2× lipat'. Direksi mengusulkan dividen " +
        "jumbo. Kamu diminta memastikan laba itu berkualitas sebelum RUPS menyetujui.",
      rows: [
        ["Laba bersih", "110.000", "210.000"],
        ["Keuntungan penjualan kapal (sekali)", "0", "120.000"],
        ["Arus kas operasi", "85.000", "35.000"],
        ["Piutang lain-lain (kepada direksi)", "5.000", "60.000"],
        ["Pendapatan diterima di muka", "90.000", "63.000"],
        ["Kas dan setara kas", "70.000", "48.000"]
      ],
      note: "Catatan 2025: kapal tua dijual di atas nilai buku kepada pembeli yang tidak diungkap identitasnya.",
      items: [
        {t: "Rp120 M dari Rp210 M laba berasal dari penjualan kapal sekali", f: true,
         w: "57% laba adalah one-off. Laba berulang (recurring) justru turun dari Rp110 M ke Rp90 M — tren semu yang menipu."},
        {t: "Arus kas operasi anjlok 59% sementara laba hampir 2× lipat", f: true,
         w: "Divergensi laba vs kas = akrual agresif plus keuntungan non-kas. Selalu bandingkan laba dengan CFO."},
        {t: "Piutang kepada direksi melonjak ke Rp60 M", f: true,
         w: "Pinjaman ke pihak berelasi = tunneling: kas perusahaan dipakai untuk kepentingan pengendali. Red flag tata kelola."},
        {t: "Pendapatan diterima di muka turun 30%", f: true,
         w: "Uang muka pelanggan menyusut = order book melemah; pertumbuhan tahun depan terancam meski laba tahun ini 'bagus'."},
        {t: "Beban bunga turun 10%", f: false,
         w: "Bukan red flag: penurunan beban bunga yang wajar (refinancing/pelunasan) justru kabar baik."},
        {t: "Dividen Rp50 M dibagikan ke pemegang saham", f: false,
         w: "Distractor: pembagian dividen oleh perusahaan profitable adalah keputusan alokasi modal, bukan bukti fraud — meski kas menipis patut dicatat."}
      ]
    }
  ];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function fmt(n) { return n; }

  var tabsBox = document.getElementById("sf-tabs");
  var casesBox = document.getElementById("sf-cases");
  var state = {}; // caseId -> {picked:Set, done:bool}

  CASES.forEach(function (c, ci) {
    state[c.id] = {picked: {}, done: false};

    var tab = document.createElement("button");
    tab.className = "stmt-tab" + (ci === 0 ? " active" : "");
    tab.textContent = c.name;
    tab.dataset.cid = c.id;
    tabsBox.appendChild(tab);

    var sec = document.createElement("div");
    sec.className = "sf-case" + (ci === 0 ? " active" : "");
    sec.id = "sf-" + c.id;

    var h = '<div class="sf-story"><span class="tag">' + esc(c.tag) + '</span><h3>' + esc(c.name) + '</h3><p>' + esc(c.story) + '</p></div>';
    h += '<p class="sf-illus">ANGKA ILUSTRATIF (Rp juta) — perusahaan fiktif, untuk latihan.</p>';
    h += '<table class="sf-table"><thead><tr><th>Pos</th><th style="text-align:right">2024</th><th style="text-align:right">2025</th></tr></thead><tbody>';
    c.rows.forEach(function (r) {
      h += '<tr><td class="lbl">' + esc(r[0]) + '</td><td class="num">' + esc(r[1]) + '</td><td class="num">' + esc(r[2]) + '</td></tr>';
    });
    h += '</tbody></table>';
    if (c.note) h += '<div class="sf-note">📝 ' + esc(c.note) + '</div>';
    h += '<h3 style="font-family:var(--font-display);margin-bottom:.6rem">Klik semua item yang menurutmu mencurigakan:</h3>';
    h += '<div class="sf-items" id="sf-items-' + c.id + '">';
    c.items.forEach(function (it, ii) {
      h += '<div class="sf-item" data-cid="' + c.id + '" data-ii="' + ii + '"><span class="tick">[ ]</span>' + esc(it.t) + '</div>';
    });
    h += '</div>';
    h += '<p><button class="btn btn-primary" id="sf-submit-' + c.id + '">Submit Jawaban</button> '
      + '<button class="btn btn-ghost" id="sf-reset-' + c.id + '" style="margin-left:.5rem">Ulangi</button></p>';
    h += '<div id="sf-result-' + c.id + '"></div>';
    sec.innerHTML = h;
    casesBox.appendChild(sec);
  });

  tabsBox.addEventListener("click", function (e) {
    var b = e.target.closest(".stmt-tab");
    if (!b) return;
    tabsBox.querySelectorAll(".stmt-tab").forEach(function (x) { x.classList.toggle("active", x === b); });
    document.querySelectorAll(".sf-case").forEach(function (s) {
      s.classList.toggle("active", s.id === "sf-" + b.dataset.cid);
    });
  });

  casesBox.addEventListener("click", function (e) {
    var it = e.target.closest(".sf-item");
    if (it && !it.classList.contains("locked")) {
      var st = state[it.dataset.cid];
      if (st.done) return;
      var ii = it.dataset.ii;
      if (st.picked[ii]) { delete st.picked[ii]; it.classList.remove("picked"); it.querySelector(".tick").textContent = "[ ]"; }
      else { st.picked[ii] = 1; it.classList.add("picked"); it.querySelector(".tick").textContent = "[✓]"; }
      return;
    }
    var sm = e.target.closest("[id^='sf-submit-']");
    if (sm) { submit(sm.id.replace("sf-submit-", "")); return; }
    var rs = e.target.closest("[id^='sf-reset-']");
    if (rs) { reset(rs.id.replace("sf-reset-", "")); }
  });

  function submit(cid) {
    var c = CASES.filter(function (x) { return x.id === cid; })[0];
    var st = state[cid];
    if (st.done) return;
    st.done = true;
    var flags = c.items.map(function (it, i) { return it.f ? i : -1; }).filter(function (i) { return i >= 0; });
    var picked = Object.keys(st.picked).map(Number);
    var hits = picked.filter(function (i) { return c.items[i].f; });
    var fps = picked.filter(function (i) { return !c.items[i].f; });
    var misses = flags.filter(function (i) { return picked.indexOf(i) === -1; });
    var score = Math.max(0, Math.round(100 * (hits.length - 0.5 * fps.length) / flags.length));
    var verdict = score >= 85 ? "🔍 Forensik Tajam — kamu menangkap hampir semua red flag."
      : score >= 60 ? "👀 Cukup Waspada — beberapa red flag lolos dari radar."
      : "📚 Perlu Latihan Lagi — baca pembahasan di bawah, lalu coba kasus lain.";

    var h = '<div class="sf-result"><div class="sf-score">' + score + '<span style="font-size:1.2rem">/100</span></div>'
      + '<div class="sf-verdict">' + verdict + '</div>'
      + '<p style="font-size:.87rem;color:var(--ink-soft)">Benar: ' + hits.length + '/' + flags.length
      + ' red flag · Terlewat: ' + misses.length + ' · Salah tandai: ' + fps.length + '</p>'
      + '<div class="sf-review">';
    c.items.forEach(function (it, i) {
      var cls, st2;
      if (it.f && st.picked[i]) { cls = "hit"; st2 = "✓ TEPAT — red flag tertangkap"; }
      else if (it.f) { cls = "miss"; st2 = "✗ TERLEWAT — ini red flag"; }
      else if (st.picked[i]) { cls = "fp"; st2 = "⚠ SALAH TANDI — bukan red flag utama"; }
      else { cls = "ok"; st2 = "– Bukan red flag, benar tidak dipilih"; }
      h += '<div class="sf-rev ' + cls + '"><span class="st">' + st2 + '</span><strong>' + esc(it.t) + '</strong><br>' + esc(it.w) + '</div>';
    });
    h += '</div></div>';
    document.getElementById("sf-result-" + cid).innerHTML = h;
    document.querySelectorAll("#sf-items-" + cid + " .sf-item").forEach(function (el) { el.classList.add("locked"); });
    document.getElementById("sf-result-" + cid).scrollIntoView({behavior: "smooth", block: "nearest"});
  }

  function reset(cid) {
    var st = state[cid];
    st.picked = {}; st.done = false;
    document.querySelectorAll("#sf-items-" + cid + " .sf-item").forEach(function (el) {
      el.classList.remove("picked", "locked");
      el.querySelector(".tick").textContent = "[ ]";
    });
    document.getElementById("sf-result-" + cid).innerHTML = "";
  }
})();
