/* Case Forensics Theater: Garuda Indonesia 2016-2019 — FSA Lab.
   FAKTA dari filing resmi; angka dalam US$ juta. Tidak ada angka karangan. */
(function () {
  "use strict";

  var YEARS = [
    {
      y: 2016, label: "Tahun yang tampak baik-baik saja",
      nums: [
        {k: "Laba bersih (TOTAL)", v: "+9,4", cls: "pos", src: "Laporan Tahunan GIAA 2016 (total; pemilik +8,1)"},
        {k: "Arus kas operasi", v: "+107,5", cls: "pos", src: "Laporan Tahunan GIAA 2016"}
      ],
      flags: [
        {t: "Belum ada red flag material.", d: "Setelah bertahun-tahun merugi, Garuda mencetak laba tipis US$9,4 jt dengan arus kas operasi positif US$107,5 jt. Angka tampak seperti turnaround yang sehat."},
        {t: "Waspada dini, bukan vonis.", d: "Laba sangat tipis dari sebuah turnaround = fondasi rapuh. Pelajaran pertama teater ini: fraud hampir tidak pernah terlihat di tahun yang 'baik'. Analis mencatat, bukan menuduh."}
      ]
    },
    {
      y: 2017, label: "Tekanan memuncak",
      nums: [
        {k: "Laba bersih (TOTAL)", v: "−213,4", cls: "neg", src: "Laporan Tahunan GIAA 2017"},
        {k: "Arus kas operasi", v: "−61,7", cls: "neg", src: "Laporan Tahunan GIAA 2017"}
      ],
      flags: [
        {t: "Kerugian besar + arus kas operasi negatif.", d: "Rugi US$213,4 jt dan CFO minus US$61,7 jt: fundamental memburuk di kedua sisi — laba dan kas. Turnaround 2016 runtuh total."},
        {t: "Pressure: insentif mempercantik 2018 meningkat.", d: "Segitiga fraud (pressure–opportunity–rationalization) mulai terbentuk. Setelah rugi sebesar ini, tekanan manajemen untuk menunjukkan laba di tahun berikutnya menjadi ekstrem. Analis forensik membaca insentif SEBELUM membaca angkanya."}
      ]
    },
    {
      y: 2018, label: "Tahun pendapatan 'ajaib'",
      nums: [
        {k: "Piutang Mahata Aero Teknologi", v: "±240", cls: "neg", src: "Laporan Tahunan GIAA 2018 (asli, sebelum restatement)"},
        {k: "Rugi bersih (setelah restatement)", v: "−175,0", cls: "neg", src: "Restatement LK 2018 GIAA"}
      ],
      flags: [
        {t: "Pendapatan ±US$240 jt dari kontrak 15 tahun diakui di muka.", d: "Kerja sama dengan Mahata Aero Teknologi (layanan wifi & hiburan dalam pesawat, 15 tahun) dicatat sebagai pendapatan 2018 sekaligus — padahal kas belum masuk. Hasilnya: piutang raksasa ±US$240 jt tanpa kas. Laba tanpa kas = alarm paling murah dalam forensik."},
        {t: "Dua komisaris menolak menandatangani laporan keuangan.", d: "Penolakan tanda tangan dari dalam dewan komisaris adalah sinyal paling keras yang bisa diberikan orang dalam. Analis yang memperhatikan ini tidak perlu menunggu restatement."},
        {t: "Restatement: laba berubah menjadi rugi US$175,0 jt.", d: "Setelah pendapatan Mahata dikoreksi, laporan 2018 disajikan ulang: dari laba menjadi rugi US$175,0 jt. Inilah 'angka jujur' yang selama ini tertutup akrual agresif."},
        {t: "Sanksi regulator & pembekuan izin Akuntan Publik.", d: "OJK menjatuhkan sanksi terkait penyajian laporan; Kementerian Keuangan membekukan izin Akuntan Publik yang mengaudit selama 12 bulan (+ denda Rp100 juta). Yang dibekukan = izin akuntan publik individunya, bukan izin KAP."}
      ]
    },
    {
      y: 2019, label: "Epilog: pelajaran",
      nums: [
        {k: "Status", v: "Restatement selesai", cls: "", src: "Pengumuman resmi 2019"}
      ],
      flags: [
        {t: "Kasus ditutup di meja regulator.", d: "Sanksi dijatuhkan, laporan disajikan ulang. Cerita 2016–2018 kini bisa dibaca utuh — dan polanya bisa dipelajari agar tidak terulang di emiten lain."}
      ],
      lesson: [
        {t: "Laba tanpa kas = tanya piutangnya.", d: "Divergensi laba vs arus kas operasi adalah alarm termurah. Piutang ±US$240 jt tanpa kas masuk seharusnya menghentikan siapa pun yang membaca 2018."},
        {t: "Penolakan tanda tangan = sinyal paling keras.", d: "Dua komisaris menolak mengesahkan LK 2018. Orang dalam yang berani menolak patut didengar lebih keras daripada siaran pers manajemen."},
        {t: "Pressure memprediksi.", d: "Rugi US$213,4 jt di 2017 menciptakan insentif ekstrem untuk mempercantik 2018. Baca segitiga fraud dulu, baru angkanya."},
        {t: "Restatement menghapus ilusi.", d: "Koreksi menghapus ±US$240 jt pendapatan semu; rugi restatement US$175,0 jt adalah angka jujurnya. Kualitas laba selalu bisa diverifikasi — dengan kas."}
      ]
    }
  ];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  var range = document.getElementById("th-range");
  var yearEl = document.getElementById("th-year");
  var lblEl = document.getElementById("th-yearlbl");
  var numsEl = document.getElementById("th-nums");
  var flagsEl = document.getElementById("th-flags");
  var flagTitle = document.getElementById("th-flagtitle");
  var lessonBox = document.getElementById("th-lesson");
  var lessonBody = document.getElementById("th-lesson-body");
  var marksBox = document.getElementById("th-marks");
  var prevBtn = document.getElementById("th-prev");
  var nextBtn = document.getElementById("th-next");

  YEARS.forEach(function (d) {
    var b = document.createElement("button");
    b.textContent = d.y;
    b.dataset.y = d.y;
    b.addEventListener("click", function () { setYear(d.y); });
    marksBox.appendChild(b);
  });

  function setYear(y) {
    y = Math.max(2016, Math.min(2019, +y));
    range.value = y;
    var idx = y - 2016;
    var d = YEARS[idx];

    yearEl.textContent = d.y;
    lblEl.textContent = d.label;

    /* F07: aria-label kontekstual — tombol panah menyebut adegan tujuannya */
    var py = Math.max(2016, y - 1), ny = Math.min(2019, y + 1);
    prevBtn.setAttribute("aria-label", "Adegan sebelumnya: " + py + " — " + YEARS[py - 2016].label);
    nextBtn.setAttribute("aria-label", "Adegan berikutnya: " + ny + " — " + YEARS[ny - 2016].label);

    numsEl.innerHTML = d.nums.map(function (n) {
      return '<div class="th-num"><span class="k">' + esc(n.k) + '</span>' +
        '<span class="v ' + n.cls + '">US$ ' + esc(n.v) + ' jt</span>' +
        '<span class="src">↳ ' + esc(n.src) + '</span></div>';
    }).join("");

    // red flag tahun ini (baru, disorot) + jejak tahun-tahun sebelumnya (redup)
    var h = "";
    d.flags.forEach(function (f) {
      h += '<div class="th-flag new"><span class="ftag">BARU ' + d.y + '</span><br><strong>' +
        esc(f.t) + '</strong><br>' + esc(f.d) + '</div>';
    });
    for (var i = 0; i < idx; i++) {
      YEARS[i].flags.forEach(function (f) {
        h += '<div class="th-flag oldf"><span class="ftag">JEJAK ' + YEARS[i].y + '</span><br><strong>' +
          esc(f.t) + '</strong></div>';
      });
    }
    flagsEl.innerHTML = h;
    flagTitle.textContent = d.y === 2019 ? "Jejak red flag 2016–2018" : "Red flag yang muncul tahun ini";

    if (d.lesson) {
      lessonBody.innerHTML = d.lesson.map(function (l) {
        return '<div class="les"><strong>' + esc(l.t) + '</strong><br>' + esc(l.d) + '</div>';
      }).join("");
      lessonBox.classList.add("show");
    } else {
      lessonBox.classList.remove("show");
    }

    marksBox.querySelectorAll("button").forEach(function (b) {
      b.classList.toggle("active", +b.dataset.y === y);
    });
  }

  range.addEventListener("input", function () { setYear(range.value); });
  document.getElementById("th-prev").addEventListener("click", function () { setYear(+range.value - 1); });
  document.getElementById("th-next").addEventListener("click", function () { setYear(+range.value + 1); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") setYear(+range.value - 1);
    if (e.key === "ArrowRight") setYear(+range.value + 1);
  });

  setYear(2016);
})();
