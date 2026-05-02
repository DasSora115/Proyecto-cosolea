// ═══════════════════════════════════════════════════
//  main2.js — IMMERSIAKS Corporate Site
//  Hamburger menu + smooth scroll + animations
// ═══════════════════════════════════════════════════
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
     1. MENÚ HAMBURGUESA CORPORATIVO
  ───────────────────────────────────────────────── */
  var corpHamburger = document.getElementById('corp-hamburger');
  var corpMobileNav = document.getElementById('corp-mobile-nav');
  var corpOverlay = document.getElementById('corp-mobile-overlay');

  function openCorpMenu() {
    if (!corpHamburger || !corpMobileNav || !corpOverlay) return;
    corpHamburger.classList.add('open');
    corpMobileNav.classList.add('open');
    corpOverlay.classList.add('open');
    corpHamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeCorpMenu() {
    if (!corpHamburger || !corpMobileNav || !corpOverlay) return;
    corpHamburger.classList.remove('open');
    corpMobileNav.classList.remove('open');
    corpOverlay.classList.remove('open');
    corpHamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (corpHamburger) {
    corpHamburger.addEventListener('click', function () {
      corpHamburger.classList.contains('open') ? closeCorpMenu() : openCorpMenu();
    });
  }

  if (corpOverlay) {
    corpOverlay.addEventListener('click', closeCorpMenu);
  }

  if (corpMobileNav) {
    corpMobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeCorpMenu);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && corpHamburger && corpHamburger.classList.contains('open')) {
      closeCorpMenu();
    }
  });

  /* ─────────────────────────────────────────────────
     2. SMOOTH SCROLL para links internos
  ───────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─────────────────────────────────────────────────
     3. NAVBAR: background on scroll
  ───────────────────────────────────────────────── */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  }

})();