// FSA Lab — Gelombang 1: interaksi minimal landing
(function(){
  // smooth anchor offset untuk sticky nav
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if(id.length < 2) return;
      var el = document.querySelector(id);
      if(!el) return;
      e.preventDefault();
      var y = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({top:y, behavior:'smooth'});
    });
  });
})();

// FSA Lab — hamburger menu mobile (hanya di halaman yang punya .nav-toggle + #navLinks)
(function(){
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('navLinks');
  if(!btn || !nav) return; // guard: halaman tanpa menu mobile (mis. modul) tidak error
  function setOpen(open){
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if(!open && document.activeElement && nav.contains(document.activeElement)){
      btn.focus(); // focus management dasar: fokus kembali ke button saat menu ditutup
    }
  }
  btn.addEventListener('click', function(){
    setOpen(!nav.classList.contains('open'));
  });
  // klik di luar menu → tutup (klik link di dalam menu juga menutup)
  document.addEventListener('click', function(e){
    if(nav.classList.contains('open') && !btn.contains(e.target)) setOpen(false);
  });
  // Escape → tutup
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && nav.classList.contains('open')) setOpen(false);
  });
})();

// Phase count dari inventory: hitung phase-tag unik di kurikulum (bukan hardcode)
(function(){
  var tags = document.querySelectorAll('.phase-tag');
  var set = {};
  for(var i=0;i<tags.length;i++){ set[tags[i].textContent.trim()] = 1; }
  var n = Object.keys(set).length;
  var el = document.getElementById('stat-phase');
  if(el && n > 0) el.textContent = n;
})();

// FSA Lab — kartu "Lanjutkan belajar" (baca fsa_last_open)
(function(){
  var card = document.getElementById('resume-card');
  if(!card) return;
  try{
    var last = JSON.parse(localStorage.getItem('fsa_last_open') || 'null');
    if(!last || !last.url) return;
    var link = document.getElementById('resume-link');
    link.href = last.url;
    link.textContent = (last.title || ('Modul ' + last.mod)) + ' →';
    var meta = document.getElementById('resume-meta');
    if(meta && last.ts){
      var d = new Date(last.ts);
      meta.textContent = 'Terakhir dibuka ' + d.toLocaleDateString('id-ID', {day:'numeric', month:'short'});
    }
    card.hidden = false;
  }catch(e){ /* abaikan */ }
})();
