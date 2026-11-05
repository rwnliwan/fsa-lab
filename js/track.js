/* FSA Lab — lacak modul terakhir dibuka (untuk kartu "Lanjutkan belajar") */
(function () {
  "use strict";
  try {
    var m = location.pathname.match(/\/modul-(\d+)\/?$/);
    if (!m) return;
    var n = parseInt(m[1], 10);
    var title = (document.title || "").split("·")[0].trim() || ("Modul " + n);
    localStorage.setItem("fsa_last_open", JSON.stringify({
      mod: n, url: "/modul-" + n + "/", title: title, ts: Date.now()
    }));
  } catch (e) { /* abaikan */ }
})();
