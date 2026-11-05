/* FSA Lab — navigasi section otomatis untuk lesson panjang (Instinct P2) */
(function () {
  "use strict";
  try {
    var heads = Array.prototype.slice.call(document.querySelectorAll("h2"));
    // Abaikan h2 di dalam nav/header/footer — ambil yang di konten utama
    heads = heads.filter(function(h){
      return !h.closest("nav") && !h.closest("header") && !h.closest("footer");
    });
    if (heads.length < 3) return; // hanya lesson panjang
    var nav = document.createElement("nav");
    nav.className = "section-nav";
    nav.setAttribute("aria-label", "Navigasi bagian modul");
    var title = document.createElement("p");
    title.className = "section-nav-title";
    title.textContent = "Bagian modul";
    nav.appendChild(title);
    var ul = document.createElement("ul");
    heads.forEach(function (h, i) {
      if (!h.id) h.id = "bagian-" + (i + 1);
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent.trim().replace(/\s+/g, " ");
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var y = h.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
        history.replaceState(null, "", "#" + h.id);
      });
      li.appendChild(a);
      ul.appendChild(li);
    });
    nav.appendChild(ul);
    // Sisipkan setelah breadcrumb / di awal konten
    var anchor = document.querySelector(".crumb") || document.querySelector(".mod-count")
      || document.querySelector(".modul-hero");
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(nav, anchor.nextSibling);
    } else {
      document.body.insertBefore(nav, document.body.firstChild);
    }
  } catch (e) { /* abaikan */ }
})();
