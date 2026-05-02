// ════════════════════════════════════════════════════
//  mejoras.js — Cosoleacaque
//  Hamburger nav · Lazy iframe map · Lightbox galería
//  Aria live · Nav active update
// ════════════════════════════════════════════════════
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
     1. MENÚ HAMBURGUESA
  ───────────────────────────────────────────────── */
  var hamburger = document.getElementById('nav-hamburger');
  var navLinks  = document.getElementById('nav-links');
  var overlay   = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });
  }
  overlay.addEventListener('click', closeMenu);

  // Cerrar al hacer clic en cualquier link del menú
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth <= 768) closeMenu();
      });
    });
  }

  // Cerrar con Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ─────────────────────────────────────────────────
     2. LAZY LOAD IFRAME MAPA
     Carga el src real solo cuando el mapa entra en viewport
  ───────────────────────────────────────────────── */
  var lazyIframes = document.querySelectorAll('.lazy-iframe[data-src]');
  if (lazyIframes.length && 'IntersectionObserver' in window) {
    var iframeIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var iframe = e.target;
          iframe.src = iframe.dataset.src;
          iframe.removeAttribute('data-src');
          iframeIO.unobserve(iframe);
        }
      });
    }, { rootMargin: '200px' });
    lazyIframes.forEach(function (f) { iframeIO.observe(f); });
  } else {
    // Fallback: cargar inmediatamente
    lazyIframes.forEach(function (f) { f.src = f.dataset.src; });
  }

  /* ─────────────────────────────────────────────────
     3. LIGHTBOX GALERÍA
  ───────────────────────────────────────────────── */
  var lb        = document.getElementById('lightbox');
  var lbImg     = document.getElementById('lightbox-img');
  var lbCaption = document.getElementById('lightbox-caption');

  window.openLightbox = function (src, caption) {
    if (!lb) return;
    lbImg.src = src;
    lbImg.alt = caption || '';
    if (lbCaption) lbCaption.textContent = caption || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lb.focus();
  };

  window.closeLightbox = function () {
    if (!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  };

  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb) window.closeLightbox();
    });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') window.closeLightbox();
    });
    lb.setAttribute('tabindex', '-1');
  }

  /* ─────────────────────────────────────────────────
     4. ARIA LIVE para el slideshow
     Anuncia el cambio de slide a lectores de pantalla
  ───────────────────────────────────────────────── */
  var heroSlides = document.querySelector('.hero-slides');
  if (heroSlides) {
    heroSlides.setAttribute('aria-live', 'polite');
    heroSlides.setAttribute('aria-atomic', 'false');
    document.querySelectorAll('.hero-slide').forEach(function (s, i) {
      s.setAttribute('aria-label', 'Imagen ' + (i + 1) + ' del carrusel');
      s.setAttribute('role', 'img');
    });
  }

  /* ─────────────────────────────────────────────────
     5. NAV: marcar enlace activo al hacer scroll
     (complementa el que ya existe en main.js para el nuevo nav)
  ───────────────────────────────────────────────── */
  var navLinksAll = document.querySelectorAll('#nav-links a');
  navLinksAll.forEach(function (a) {
    a.addEventListener('click', function () {
      navLinksAll.forEach(function (l) { l.classList.remove('active'); });
      a.classList.add('active');
    });
  });

})();

  /* ─────────────────────────────────────────────────
     6. BOTÓN "EXPLORAR" — smooth scroll a la siguiente sección
  ───────────────────────────────────────────────── */
  var scrollBtn = document.getElementById('scroll-hint-btn');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
      // Busca el primer elemento después del hero (textile-band o nav o la primera section)
      var hero = document.querySelector('.hero');
      var target = null;

      if (hero) {
        // Toma el primer elemento hermano significativo después del hero
        var next = hero.nextElementSibling;
        // Salta textile-bands vacíos hasta llegar al nav o primera section
        while (next && (next.classList.contains('textile-band'))) {
          next = next.nextElementSibling;
        }
        // Si el siguiente es el nav, salta al elemento después del nav
        if (next && next.tagName === 'NAV') {
          next = next.nextElementSibling;
          while (next && next.classList.contains('textile-band')) {
            next = next.nextElementSibling;
          }
        }
        target = next;
      }

      // Fallback: primera sección con id
      if (!target) {
        target = document.querySelector('section[id]');
      }

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }