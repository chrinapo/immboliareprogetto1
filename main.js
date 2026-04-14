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

  if (!hamburger || !mobileNav) return;

  function openMenu() {
    mobileNav.classList.add('open');
    hamburger.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Servizi dropdown
  const dropdownToggle = mobileNav.querySelector('.mobile-nav-dropdown-toggle');
  const dropdown = mobileNav.querySelector('.mobile-nav-dropdown');
  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', () => {
      const isOpen = dropdown.classList.toggle('open');
      dropdownToggle.setAttribute('aria-expanded', isOpen);
    });
  }
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

// ─── Ticker: selectable items + remove action ────────────
(function () {
  const track = document.querySelector('.ticker-track');
  const ticker = document.querySelector('.ticker');
  if (!track || !ticker) return;

  // Toggle `selected` class on click
  track.addEventListener('click', function (e) {
    const span = e.target.closest('span');
    if (!span || !track.contains(span)) return;
    span.classList.toggle('selected');
  });

  // Add a small remove button to the ticker
  const removeBtn = document.createElement('button');
  removeBtn.className = 'ticker-remove';
  removeBtn.setAttribute('aria-label', 'Rimuovi elemento selezionato');
  removeBtn.title = 'Rimuovi elemento selezionato';
  removeBtn.innerHTML = '✕';
  ticker.appendChild(removeBtn);

  // Remove first selected element when button clicked
  removeBtn.addEventListener('click', function () {
    const sel = track.querySelector('.selected');
    if (sel) sel.remove();
  });

  // Allow Delete/Backspace to remove all selected items
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Delete' && e.key !== 'Backspace') return;
    const selected = track.querySelectorAll('.selected');
    if (!selected.length) return;
    selected.forEach(s => s.remove());
  });

})();

// ─── Property Carousel ────────────────────────────────────
(function () {
  const wrap    = document.getElementById('propCarouselWrap');
  if (!wrap) return;

  const track   = document.getElementById('propCarouselTrack');
  const prevBtn = document.getElementById('propPrev');
  const nextBtn = document.getElementById('propNext');
  const dotsEl  = document.getElementById('propDots');
  const items   = track.querySelectorAll('.prop-carousel-item');
  const total   = items.length;

  let index = 0;

  function itemsPerView() {
    const w = wrap.offsetWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, total - itemsPerView());
  }

  function render(animated, rewind) {
    if (!animated) {
      track.style.transition = 'none';
    } else if (rewind) {
      track.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.6, 1)';
    } else {
      track.style.transition = '';
    }
    const item   = items[0];
    const gap    = parseInt(getComputedStyle(track).gap) || 32;
    const offset = -(index * (item.offsetWidth + gap));
    track.style.transform = 'translateX(' + offset + 'px)';
    if (!animated) {
      track.getBoundingClientRect(); // force reflow
      track.style.transition = '';
    }
    prevBtn.disabled = index === 0;
    nextBtn.disabled = false;
    dotsEl.querySelectorAll('.prop-carousel-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === index);
    });
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    var count = maxIndex() + 1;
    for (var i = 0; i < count; i++) {
      var btn = document.createElement('button');
      btn.className = 'prop-carousel-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', 'Vai alla proposta ' + (i + 1));
      (function (idx) {
        btn.addEventListener('click', function () { index = idx; render(true); });
      })(i);
      dotsEl.appendChild(btn);
    }
  }

  prevBtn.addEventListener('click', function () {
    if (index > 0) { index--; render(true); }
  });
  nextBtn.addEventListener('click', function () {
    if (index < maxIndex()) {
      index++;
      render(true, false);
    } else {
      index = 0;
      render(true, true);
    }
  });

  // Drag / swipe support
  var startX = 0;
  var dragging = false;

  track.addEventListener('pointerdown', function (e) {
    startX   = e.clientX;
    dragging = true;
    track.classList.add('is-dragging');
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener('pointerup', function (e) {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('is-dragging');
    var diff = e.clientX - startX;
    if (diff < -50 && index < maxIndex()) { index++; render(true); }
    else if (diff > 50 && index > 0)      { index--; render(true); }
  });

  track.addEventListener('pointercancel', function () {
    dragging = false;
    track.classList.remove('is-dragging');
  });

  // Prevent click-through after drag
  track.addEventListener('click', function (e) {
    if (Math.abs(e.clientX - startX) > 5) e.preventDefault();
  }, true);

  // Recalculate on resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (index > maxIndex()) index = maxIndex();
      buildDots();
      render(false);
    }, 120);
  });

  buildDots();
  render(false);

  // ── Mobile: native scroll dots ──
  var viewport = wrap.querySelector('.prop-carousel-viewport');
  var mobileDots = document.getElementById('propDotsMobile');
  if (viewport && mobileDots) {
    // Build 8 mobile dots (one per card)
    for (var mi = 0; mi < total; mi++) {
      var mdot = document.createElement('button');
      mdot.className = 'prop-carousel-dot-mobile' + (mi === 0 ? ' active' : '');
      mdot.setAttribute('aria-label', 'Vai alla proposta ' + (mi + 1));
      (function(idx) {
        mdot.addEventListener('click', function() {
          var itemWidth = items[0].offsetWidth + (parseInt(getComputedStyle(track).gap) || 16);
          viewport.scrollTo({ left: idx * itemWidth, behavior: 'smooth' });
        });
      })(mi);
      mobileDots.appendChild(mdot);
    }

    var mdotEls = mobileDots.querySelectorAll('.prop-carousel-dot-mobile');
    viewport.addEventListener('scroll', function() {
      var itemWidth = items[0].offsetWidth + (parseInt(getComputedStyle(track).gap) || 16);
      var idx = Math.round(viewport.scrollLeft / itemWidth);
      mdotEls.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
    }, { passive: true });
  }
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

// ─── Make entire property-card clickable + keyboard access ───
(function () {
  const cards = document.querySelectorAll('.property-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const link = card.querySelector('a.btn-ghost');
    if (!link) return;

    card.style.cursor = 'pointer';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'link');

    card.addEventListener('click', (e) => {
      // If click originates from an actual link or form control, let it handle
      if (e.target.closest('a') || e.target.closest('button') || e.target.closest('input')) return;
      window.location.href = link.href;
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = link.href;
      }
    });
  });
})();

// ─── Make service cards clickable + keyboard access ───────
(function () {
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const link = card.querySelector('a.btn-ghost');
    if (!link) return;

    card.style.cursor = 'pointer';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'link');

    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button') || e.target.closest('input')) return;
      window.location.href = link.href;
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = link.href;
      }
    });
  });
})();
