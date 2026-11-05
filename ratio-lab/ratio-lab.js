/* Ratio Lab — FSA Lab
   16 rasio × 4 kategori. Input prefill angka kanonis 2025 (Rp juta, ilustratif);
   perbandingan 2024 dihitung dari kanonis & terverifikasi via Python independen.
   Twist tiap rasio = cara umum rasio "dibuat bagus" tanpa bisnis membaik. */
(function () {
  "use strict";

  function n(v, d) { return Number(v).toLocaleString("id-ID", {minimumFractionDigits: d, maximumFractionDigits: d}); }

  /* R = {cat, name, f: "rumus tampil", inputs:[{id,label,val,unit}], calc(o)->number,
          fmt(v)->string, interp(v)->string, twist, cmp: "2024: ..." } */
  var R = [
    {cat: "Likuiditas", name: "Current Ratio", den: "liabilitas lancar", neg: true, f: "Aset lancar ÷ Liabilitas lancar",
      inputs: [{id: "al", label: "Aset lancar", nn: true, val: 221440}, {id: "ll", label: "Liabilitas lancar", nn: true, val: 102000}],
      calc: function (o) { return o.al / o.ll; }, fmt: function (v) { return n(v, 2) + "x"; },
      interp: function (v) { return v >= 2 ? "Kuat — Rp" + n(v, 2) + " aset lancar per Rp1 utang jangka pendek." : v >= 1.5 ? "Aman." : "⚠ Di bawah 1,5x — waspadai likuiditas."; },
      twist: "Reklasifikasi utang jangka pendek → panjang lewat refinancing menit terakhir. Atau window dressing kas (pinjam 29 Des). Current ratio naik, risiko tidak hilang.",
      cmp: "2024: 2,10x → 2025: 2,17x — stabil kuat."},
    {cat: "Likuiditas", name: "Quick Ratio", den: "liabilitas lancar", neg: true, f: "(Aset lancar − Persediaan) ÷ Liabilitas lancar",
      inputs: [{id: "al", label: "Aset lancar", nn: true, val: 221440}, {id: "pers", label: "Persediaan", nn: true, val: 96000}, {id: "ll", label: "Liabilitas lancar", nn: true, val: 102000}],
      calc: function (o) { return (o.al - o.pers) / o.ll; }, fmt: function (v) { return n(v, 2) + "x"; },
      interp: function (v) { return v >= 1 ? "Sehat — bisa bayar utang lancar tanpa jual persediaan." : "⚠ Bergantung pada penjualan persediaan untuk bayar utang."; },
      twist: "Persediaan usang tidak di-write down → quick ratio terlihat oke karena pembilang 'bersih'. Cek umur persediaan di CALK.",
      cmp: "2024: 1,10x → 2025: 1,23x — membaik."},
    {cat: "Efisiensi Operasi", name: "DSO (hari piutang)", den: "penjualan", neg: true, f: "Piutang ÷ Penjualan × 365",
      inputs: [{id: "piut", label: "Piutang usaha", nn: true, val: 104000}, {id: "jual", label: "Penjualan", nn: true, val: 520000}],
      calc: function (o) { return o.piut / o.jual * 365; }, fmt: function (v) { return n(v, 1) + " hari"; },
      interp: function (v) { return v > 60 ? "⚠ " + n(v, 1) + " hari — penagihan melambat tajam, risiko piutang tak tertagih naik." : "Wajar."; },
      twist: "Channel stuffing akhir kuartal: kirim barang ke distributor agar penjualan tercatat — DSO justru memburuk, tapi penjualan 'naik'. Atau sebaliknya: jual piutang (factoring) → DSO turun semu.",
      cmp: "2024: 50,2 → 2025: 73,0 hari — ⚠ memburuk tajam."},
    {cat: "Efisiensi Operasi", name: "DIO (hari persediaan)", den: "hpp", neg: true, f: "Persediaan ÷ HPP × 365",
      inputs: [{id: "pers", label: "Persediaan", nn: true, val: 96000}, {id: "hpp", label: "HPP", nn: true, val: 338000}],
      calc: function (o) { return o.pers / o.hpp * 365; }, fmt: function (v) { return n(v, 1) + " hari"; },
      interp: function (v) { return "Stok menumpuk " + n(v, 1) + " hari — kas terikat di gudang."; },
      twist: "Tunda pengakuan HPP (biaya ditahan di persediaan) → DIO naik TAPI margin terlihat bagus. Kombinasi GM naik + DIO naik = tidak masuk akal.",
      cmp: "2024: 110,6 → 2025: 103,7 hari — membaik tipis."},
    {cat: "Efisiensi Operasi", name: "DPO (hari utang)", den: "hpp", neg: true, f: "Utang usaha ÷ HPP × 365",
      inputs: [{id: "ut", label: "Utang usaha", nn: true, val: 62000}, {id: "hpp", label: "HPP", nn: true, val: 338000}],
      calc: function (o) { return o.ut / o.hpp * 365; }, fmt: function (v) { return n(v, 1) + " hari"; },
      interp: function (v) { return "Bayar supplier rata-rata " + n(v, 1) + " hari — pendanaan gratis."; },
      twist: "Tahan pembayaran akhir tahun → DPO & CFO naik bersamaan. Terlihat efisien, padahal merusak relasi supplier. Cek keluhan/termin di CALK.",
      cmp: "2024: 69,1 → 2025: 67,0 hari — bayar sedikit lebih cepat."},
    {cat: "Efisiensi Operasi", name: "Cash Conversion Cycle", f: "DSO + DIO − DPO (hari)",
      inputs: [{id: "dso", label: "DSO", nn: true, val: 73.0, unit: "hari"}, {id: "dio", label: "DIO", nn: true, val: 103.7, unit: "hari"}, {id: "dpo", label: "DPO", nn: true, val: 67.0, unit: "hari"}],
      calc: function (o) { return o.dso + o.dio - o.dpo; }, fmt: function (v) { return n(v, 1) + " hari"; },
      interp: function (v) { return v > 100 ? "⚠ " + n(v, 1) + " hari — kas terikat hampir 4 bulan di modal kerja. Haus dana." : "Terkendali."; },
      twist: "CCC adalah gabungan tiga manipulasi di atas — satu angka 'membaik' bisa menyembunyikan DSO yang jebol. Selalu bedah komponennya.",
      cmp: "2024: 91,7 → 2025: 109,7 hari — ⚠ memburuk (didorong DSO)."},
    {cat: "Efisiensi Operasi", name: "Asset Turnover", den: "rata-rata total aset", neg: true, f: "Penjualan ÷ Rata-rata total aset",
      inputs: [{id: "jual", label: "Penjualan", nn: true, val: 520000}, {id: "ta0", label: "Total aset awal", nn: true, val: 378200}, {id: "ta1", label: "Total aset akhir", nn: true, val: 451440}],
      calc: function (o) { return o.jual / ((o.ta0 + o.ta1) / 2); }, fmt: function (v) { return n(v, 2) + "x"; },
      interp: function (v) { return "Tiap Rp1 aset (rata-rata) menghasilkan Rp" + n(v, 2) + " penjualan."; },
      twist: "Jual aset (sale-and-leaseback) → pembagi menyusut → turnover naik, padahal kapasitas berkurang. Atau aset tidak produktif tidak di-impair → turnover terlihat rendah 'jujur'.",
      cmp: "2025: 1,25x (kanonis). 2024: n/a — butuh total aset 2023."},
    {cat: "Solvabilitas", name: "Debt to Equity", den: "ekuitas", f: "Total liabilitas ÷ Ekuitas",
      inputs: [{id: "liab", label: "Total liabilitas", nn: true, val: 272000}, {id: "ek", label: "Ekuitas", val: 179440}],
      calc: function (o) { return o.liab / o.ek; }, fmt: function (v) { return n(v, 2) + "x"; },
      interp: function (v) { return v < 2 ? "Moderat — Rp" + n(v, 2) + " utang per Rp1 ekuitas." : "⚠ Leverage tinggi."; },
      twist: "Revaluasi aset → ekuitas menggembung → D/E turun semu. Atau utang disembunyikan via entitas tidak dikonsolidasi (playbook Enron).",
      cmp: "2024: 1,70x → 2025: 1,52x — membaik."},
    {cat: "Solvabilitas", name: "Net Debt / EBITDA", den: "ebitda", f: "(Utang berbunga − Kas) ÷ EBITDA",
      inputs: [{id: "ub", label: "Utang bank total", nn: true, val: 141440}, {id: "sewa", label: "Liabilitas sewa", nn: true, val: 60000}, {id: "kas", label: "Kas", nn: true, val: 21440}, {id: "ebitda", label: "EBITDA", val: 102000}],
      calc: function (o) { return (o.ub + o.sewa - o.kas) / o.ebitda; }, fmt: function (v) { return n(v, 2) + "x"; },
      interp: function (v) { return v < 3 ? "Aman — utang bersih lunas dalam " + n(v, 1) + " tahun EBITDA." : "⚠ Di atas 3x — waspadai."; },
      twist: "EBITDA 'disesuaikan' dengan add-back agresif (biaya 'sekali' yang terjadi tiap tahun). Atau kas yang dibatasi diklaim sebagai kas bebas.",
      cmp: "2025: 1,76x — moderat. (2024: n/a — EBITDA 2024 tidak diungkap.)"},
    {cat: "Solvabilitas", name: "Interest Coverage", den: "beban bunga", f: "EBIT ÷ Beban bunga",
      inputs: [{id: "ebit", label: "EBIT", val: 72000}, {id: "bunga", label: "Beban bunga", nn: true, val: 14000}],
      calc: function (o) { return o.ebit / o.bunga; }, fmt: function (v) { return n(v, 2) + "x"; },
      interp: function (v) { return v >= 3 ? "Aman — laba operasi " + n(v, 2) + "x lipat dari bunga." : "⚠ Di bawah 3x — sesak."; },
      twist: "Kapitalisasi bunga ke aset proyek → beban bunga kecil → coverage tinggi semu. Bandingkan bunga KAS dibayar vs beban bunga.",
      cmp: "2024: 4,80x → 2025: 5,14x — membaik."},
    {cat: "Profitabilitas", name: "Gross Margin", den: "penjualan", f: "(Penjualan − HPP) ÷ Penjualan",
      inputs: [{id: "jual", label: "Penjualan", nn: true, val: 520000}, {id: "hpp", label: "HPP", nn: true, val: 338000}],
      calc: function (o) { return (o.jual - o.hpp) / o.jual * 100; }, fmt: function (v) { return n(v, 1) + "%"; },
      interp: function (v) { return "Tiap Rp100 penjualan menyisakan Rp" + n(v, 1) + " laba kotor."; },
      twist: "Akui pendapatan dini + tunda HPP = margin 'naik'. Cek silang: GM naik + DIO naik + DSO naik = pola manipulasi klasik.",
      cmp: "2024: 34,0% → 2025: 35,0% — naik 1pp."},
    {cat: "Profitabilitas", name: "Operating Margin", den: "penjualan", f: "EBIT ÷ Penjualan",
      inputs: [{id: "ebit", label: "EBIT", val: 72000}, {id: "jual", label: "Penjualan", nn: true, val: 520000}],
      calc: function (o) { return o.ebit / o.jual * 100; }, fmt: function (v) { return n(v, 1) + "%"; },
      interp: function (v) { return "Margin operasi inti " + n(v, 1) + "%."; },
      twist: "Kapitalisasi beban operasi sebagai aset → margin naik. Cek pos 'aset lain-lain' yang tumbuh tanpa penjelasan.",
      cmp: "2024: 12,0% → 2025: 13,8% — membaik."},
    {cat: "Profitabilitas", name: "Net Margin", den: "penjualan", f: "Laba bersih ÷ Penjualan",
      inputs: [{id: "ni", label: "Laba bersih", val: 45240}, {id: "jual", label: "Penjualan", nn: true, val: 520000}],
      calc: function (o) { return o.ni / o.jual * 100; }, fmt: function (v) { return n(v, 1) + "%"; },
      interp: function (v) { return "Tiap Rp100 penjualan jadi Rp" + n(v, 1) + " laba bersih."; },
      twist: "One-off gain (jual aset 8.000 di 2025) mendongkrak margin. Margin continuing = 7,5% (39.000/520.000) — selalu pisahkan one-off.",
      cmp: "2024: 7,4% → 2025: 8,7% — naik (termasuk one-off 1,2pp: 8,7%−7,5%)."},
    {cat: "Profitabilitas", name: "ROE", den: "rata-rata ekuitas", f: "Laba bersih ÷ Rata-rata ekuitas",
      inputs: [{id: "ni", label: "Laba bersih", val: 45240}, {id: "ek0", label: "Ekuitas awal", val: 140200}, {id: "ek1", label: "Ekuitas akhir", val: 179440}],
      calc: function (o) { return o.ni / ((o.ek0 + o.ek1) / 2) * 100; }, fmt: function (v) { return n(v, 1) + "%"; },
      interp: function (v) { return v >= 15 ? "Tinggi — " + n(v, 1) + "%. Bedah DuPont: berapa dari margin, berapa dari leverage?" : "Moderat."; },
      twist: "Leverage ekstrem mendongkrak ROE (DuPont: ×2,60). Atau buyback menyusutkan ekuitas → ROE naik tanpa laba naik. ROE tinggi + D/E tinggi = rapuh.",
      cmp: "2025: 28,3% (kanonis). 2024: n/a — butuh ekuitas 2023."},
    {cat: "Profitabilitas", name: "ROA", den: "rata-rata total aset", f: "Laba bersih ÷ Rata-rata total aset",
      inputs: [{id: "ni", label: "Laba bersih", val: 45240}, {id: "ta0", label: "Total aset awal", nn: true, val: 378200}, {id: "ta1", label: "Total aset akhir", nn: true, val: 451440}],
      calc: function (o) { return o.ni / ((o.ta0 + o.ta1) / 2) * 100; }, fmt: function (v) { return n(v, 1) + "%"; },
      interp: function (v) { return "Tiap Rp100 aset (rata-rata) menghasilkan Rp" + n(v, 1) + " laba."; },
      twist: "Aset tidak produktif yang tidak di-impair menekan ROA 'jujur' — manajemen enggan hapus karena mengakui kesalahan investasi.",
      cmp: "2025: 10,9% (kanonis). 2024: n/a — butuh total aset 2023."},
    {cat: "Profitabilitas", name: "ROIC", den: "modal diinvestasikan", f: "NOPAT ÷ Modal diinvestasikan",
      inputs: [{id: "nopat", label: "NOPAT", val: 56160}, {id: "ic", label: "Modal diinvestasikan", nn: true, val: 355443}],
      calc: function (o) { return o.nopat / o.ic * 100; }, fmt: function (v) { return n(v, 1) + "%"; },
      interp: function (v) { return "Return atas modal operasi " + n(v, 1) + "% vs WACC 13,1% (M9) — " + (v > 13.1 ? "menciptakan nilai." : "⚠ di bawah biaya modal."); },
      twist: "Definisi 'modal' diutak-atik: kas berlebih tidak dikeluarkan, atau memakai nilai buku lama. Selalu tanya definisi sebelum bandingkan.",
      cmp: "2025: 15,8% (kanonis). Prefill modal = 56.160 ÷ 15,8% — konsisten internal."}
  ];

  function render() {
    var root = document.getElementById("rl-root"), h = "", lastCat = "";
    R.forEach(function (r, i) {
      if (r.cat !== lastCat) { h += '<h2 class="rl-cat">' + r.cat + "</h2>"; lastCat = r.cat; }
      h += '<div class="rl-card" data-i="' + i + '"><h3>' + (i + 1) + ". " + r.name + "</h3>" +
        '<span class="rl-formula">' + r.f + "</span>" +
        '<div class="rl-inputs">' +
        r.inputs.map(function (p, j) {
          var inpId = "rl-in-" + i + "-" + j;
          return '<div class="rl-in"><label for="' + inpId + '">' + p.label + (p.unit ? ' <span class="unit">(' + p.unit + ")</span>" : ' <span class="unit">(Rp juta)</span>') +
            '</label><input id="' + inpId + '" data-i="' + i + '" data-j="' + j + '" type="text" inputmode="decimal" value="' + p.val + '"></div>';
        }).join("") + "</div>" +
        '<div class="rl-out"><span class="rl-val" id="rlv' + i + '">—</span><span class="rl-cmp" id="rlc' + i + '"></span></div>' +
        '<p class="rl-interp" id="rli' + i + '"></p>' +
        '<div class="rl-twist"><p><strong>🎯 Dibuat bagus tanpa bisnis membaik?</strong> ' + r.twist + "</p></div></div>";
    });
    root.innerHTML = h;
    root.querySelectorAll("input").forEach(function (inp) {
      inp.addEventListener("input", function () { calc(+inp.dataset.i); });
    });
    for (var i = 0; i < R.length; i++) calc(i);
  }

  function parseID(s) {
    /* F3: validasi strict */
    s = String(s || "").trim().replace(/\s/g, "");
    if (!s) return NaN;
    if (/[^0-9.,\-+]/.test(s)) return NaN;
    if (/\d-\d/.test(s)) return NaN;
    var dots = (s.match(/\./g)||[]).length;
    if (s.indexOf(",") >= 0) {
      if (dots > 0 && (s.match(/,/g)||[]).length !== 1) return NaN;
      s = s.replace(/\./g, "").replace(",", ".");
    } else if (/^-?0\./.test(s)) {
      if (dots !== 1) return NaN;
    } else {
      var p = s.split(".");
      if (p.length > 2) return NaN;
      if (p.length === 2 && p[1].length === 3 && p[0] !== "0") s = p.join("");
      else if (p.length === 2 && p[1].length !== 3) { /* desimal */ }
      else if (p.length === 2) return NaN;
    }
    var v = parseFloat(s); return isNaN(v) ? NaN : v;
  }

  /* Guard F02: rasio yang tidak dapat diinterpretasikan -> "N/A" + alasan,
     TANPA vonis Kuat/Lemah. Cek: NaN, Infinity (pembagi nol), negatif tak masuk akal. */
  function guardNA(r, v, o) {
    if (isNaN(v)) return "N/A \u2014 hasil tidak dapat dihitung dari input ini; periksa kembali angka yang dimasukkan.";
    if (!isFinite(v)) return "N/A \u2014 " + (r.den || "pembagi") + " nol; rasio tidak dapat diinterpretasikan.";
    for (var j = 0; j < r.inputs.length; j++) {
      var inp = r.inputs[j];
      if (inp.nn && o[inp.id] < 0)
        return "N/A \u2014 " + inp.label + " tidak boleh negatif; periksa tanda input.";
    }
    if (v < 0 && r.neg) return "N/A \u2014 hasil negatif tidak masuk akal untuk " + r.name + "; periksa tanda input.";
    return null;
  }

  function calc(i) {
    var r = R[i], card = document.querySelector('.rl-card[data-i="' + i + '"]'), o = {}, ok = true;
    card.querySelectorAll("input").forEach(function (inp, j) {
      var v = parseID(inp.value); o[r.inputs[j].id] = v; if (isNaN(v)) ok = false;
    });
    var el = document.getElementById("rlv" + i);
    if (!ok) { el.textContent = "—"; document.getElementById("rli" + i).textContent = "Lengkapi semua input (format Indonesia: 104.000 atau 104000)."; return; }
    var v = r.calc(o);
    var na = guardNA(r, v, o);
    document.getElementById("rlc" + i).innerHTML = "<b>2024 → 2025 (kanonis):</b> " + r.cmp;
    if (na) { el.textContent = "N/A"; document.getElementById("rli" + i).textContent = na; return; }
    el.textContent = r.fmt(v);
    document.getElementById("rli" + i).textContent = r.interp(v);
  }

  render();
})();
