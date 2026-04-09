/* =========================================================
   MATERIKA COSTRUZIONI — Shared JavaScript
   ========================================================= */

'use strict';

// ─── Sticky Header ────────────────────────────────────────
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ─── Mobile Menu ──────────────────────────────────────────
(function () {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn  = document.querySelector('.mobile-nav-close');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeMenu() {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
})();

// ─── Active Nav Link ──────────────────────────────────────
(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ─── Scroll Reveal ────────────────────────────────────────
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
})();

// ─── Property Filter Tabs ─────────────────────────────────
(function () {
  const tabs  = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.property-card[data-province]');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'tutti' || card.dataset.province === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
})();

// ─── Lightbox ─────────────────────────────────────────────
(function () {
  const lightbox = document.querySelector('.lightbox');
  const lbImg    = document.querySelector('.lightbox-img');
  const lbClose  = document.querySelector('.lightbox-close');

  if (!lightbox || !lbImg) return;

  document.querySelectorAll('.gallery-img img, .floorplan-card img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lbImg.src = img.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();

// ─── Form Validation ──────────────────────────────────────
(function () {
  document.querySelectorAll('form.validated').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          field.style.borderColor = '#c0392b';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.style.borderColor = '#c0392b';
        valid = false;
      }

      if (valid) {
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.textContent = 'Inviato! Ti contatteremo presto.';
          btn.style.background = '#27ae60';
          btn.disabled = true;
        }
      }
    });
  });
})();

// ─── Ticker Duplicate ─────────────────────────────────────
(function () {
  const track = document.querySelector('.ticker-track');
  if (!track) return;
  // Duplicate content for seamless loop
  track.innerHTML += track.innerHTML;
})();

// ─── Counter Animation ────────────────────────────────────
(function () {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur    = 1600;
      const start  = performance.now();

      function tick(now) {
        const pct = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - pct, 3);
        el.textContent = prefix + Math.round(ease * target) + suffix;
        if (pct < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
})();
