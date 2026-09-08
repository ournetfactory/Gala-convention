// ── GOOGLE SHEETS BOOKING URL ─────────────────────────
// Paste your deployed Google Apps Script Web app URL here.
// Leave empty '' to use demo mode (random fake booked dates).
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycby5z3Zy6hmd86eb7b8fi2Wjn9JEbdw9XwEiESK00cLSVR5myjD3N2KqCPF24nmCHPQ-/exec';
// ── REVEAL ON SCROLL ───────────────────────────────────
(function () {
  const reveals = document.querySelectorAll('.reveal, .stagger');
  if (!reveals.length) return;

  // Premium GSAP reveals (with smooth, staggered easing)
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    reveals.forEach((el) => {
      // Hero has its own cinematic entrance (handled separately)
      if (el.closest('.hero')) return;

      // Disable the CSS transition so GSAP controls the motion
      gsap.set(el, { transition: 'none' });

      if (el.classList.contains('stagger')) {
        gsap.set(el.children, { transition: 'none' });
        gsap.fromTo(
          el.children,
          { y: 44, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          }
        );
        return;
      }

      gsap.fromTo(
        el,
        { y: 44, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }
      );
    });
    return;
  }

  // Fallback: IntersectionObserver (used only if GSAP fails to load)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
})();

// ── PREMIUM EFFECTS: smooth scroll, hero parallax, counters ──
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero parallax (GPU transform, cheap to run on desktop)
  const hero = document.querySelector('.hero');
  const heroSlides = document.querySelector('.hero-slides');
  if (hero && heroSlides) {
    gsap.fromTo(heroSlides, { yPercent: 0 }, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Animated stat counters (count up on scroll into view)
  document.querySelectorAll('.stat strong.num').forEach((el) => {
    const target = parseFloat(el.textContent.replace(/[^0-9.]/g, '')) || 0;
    if (!target) return;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = Math.round(obj.v); },
    });
  });
})();

// ── HEADER SCROLL EFFECT ───────────────────────────────
(function () {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        topbar.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ── MOBILE NAV OVERLAY (right drawer) ──────────────────
(function () {
  const toggle = document.querySelector('.mobile-toggle');
  if (!toggle) return;

  // Build the overlay — full-screen dim backdrop + right drawer panel
  const overlay = document.createElement('div');
  overlay.className = 'mobile-nav-overlay';

  const panel = document.createElement('div');
  panel.className = 'mobile-nav-panel';
  overlay.appendChild(panel);

  // ── Brand header (logo) ──
  const brand = document.createElement('div');
  brand.className = 'mobile-nav-brand';
  const brandLogo = document.createElement('img');
  brandLogo.src = 'assets/logo_bg.png';
  brandLogo.alt = 'Gala Retreat';
  brandLogo.className = 'mobile-nav-logo';
  const brandText = document.createElement('span');
  brandText.className = 'mobile-nav-brandtext';
  brandText.innerHTML = 'GALA RETREAT<small>— RESORT AND CONVENTION —</small>';
  brand.appendChild(brandLogo);
  brand.appendChild(brandText);
  panel.appendChild(brand);

  // ── Close button ──
  const closeBtn = document.createElement('button');
  closeBtn.className = 'mobile-nav-close';
  closeBtn.setAttribute('aria-label', 'Close menu');
  closeBtn.innerHTML = '✕';
  panel.appendChild(closeBtn);

  // ── Navigation links (numbered) ──
  const navLinks = [
    { text: 'The Retreat', href: 'index.html#retreat' },
    { text: 'Farmhouse', href: 'index.html#farmhouse' },
    { text: 'Convention', href: 'index.html#convention' },
    { text: 'Celebrations', href: 'index.html#celebrations' },
    { text: 'Gallery', href: 'gallery.html' },
    { text: 'Contact', href: 'contact.html' },
  ];

  const linksWrap = document.createElement('div');
  linksWrap.className = 'mobile-nav-links';
  panel.appendChild(linksWrap);

  navLinks.forEach((l, i) => {
    const a = document.createElement('a');
    a.href = l.href;

    const num = document.createElement('span');
    num.className = 'mobile-nav-num';
    num.textContent = String(i + 1).padStart(2, '0');

    const label = document.createElement('span');
    label.className = 'mobile-nav-label';
    label.textContent = l.text;

    const arrow = document.createElement('span');
    arrow.className = 'mobile-nav-arrow';
    arrow.innerHTML = '→';

    a.appendChild(num);
    a.appendChild(label);
    a.appendChild(arrow);
    linksWrap.appendChild(a);
  });

  // ── CTA (only ever shown on touch sizes) ──
  const cta = document.createElement('a');
  cta.className = 'mobile-nav-cta';
  cta.href = 'contact.html';
  cta.innerHTML = 'PLAN YOUR CELEBRATION　<span>→</span>';
  panel.appendChild(cta);

  // ── Contact footer ──
  const footer = document.createElement('div');
  footer.className = 'mobile-nav-footer';
  footer.innerHTML =
    '<a href="tel:+919848819444" class="mnav-f-row">☎　9848819444</a>' +
    '<a href="mailto:hello@galaretreat.com" class="mnav-f-row">✉　hello@galaretreat.com</a>' +
    '<span class="mnav-f-row">📍　Ramdas Pally, Kothapet Rd, Bongloor</span>';
  panel.appendChild(footer);

  document.body.appendChild(overlay);

  const open = () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  // Close the menu immediately after tapping any link (nav topics or CTA)
  panel.addEventListener('click', (e) => {
    if (e.target.closest('a')) close();
  });
})();

// ── BACK TO TOP ────────────────────────────────────────
(function () {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(btn);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > 500);
        ticking = false;
      });
      ticking = true;
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ── DEMO: prevent form submissions & button actions ────
document.querySelectorAll('button').forEach((btn) => {
  if (!btn.closest('.mobile-toggle') && !btn.closest('.back-to-top') && !btn.closest('.mobile-nav-close') && !btn.closest('.lightbox') && !btn.closest('.lb-nav')) {
    btn.addEventListener('click', (e) => e.preventDefault());
  }
});

// ── GALLERY TAB FILTERING ─────────────────────────────
(function () {
  const tabs = document.querySelectorAll('.tab[data-filter]');
  if (!tabs.length) return;

  const items = document.querySelectorAll('.g-item');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // update selected tab
      tabs.forEach((t) => t.classList.remove('selected'));
      tab.classList.add('selected');

      const filter = tab.dataset.filter;

      items.forEach((item, i) => {
        const match = filter === 'all' || item.dataset.cat === filter;

        if (!match) {
          // fade out, then hide
          item.classList.add('hiding');
          setTimeout(() => {
            item.classList.add('hidden');
            item.classList.remove('hiding');
          }, 300);
        } else {
          // show, then fade in
          item.classList.remove('hidden');
          // force reflow so the transition triggers
          void item.offsetWidth;
          item.classList.remove('hiding');
        }
      });
    });
  });
})();

// ── GALLERY LIGHTBOX ──────────────────────────────────
(function () {
  const items = document.querySelectorAll('.g-item');
  if (!items.length) return;

  // build lightbox DOM
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close">✕</button>
    <button class="lb-nav lb-prev" aria-label="Previous">‹</button>
    <button class="lb-nav lb-next" aria-label="Next">›</button>
    <img src="" alt="">
    <div class="lightbox-caption"></div>
    <div class="lb-counter"></div>
  `;
  document.body.appendChild(lightbox);

  const lbImg    = lightbox.querySelector('img');
  const lbCap    = lightbox.querySelector('.lightbox-caption');
  const lbCount  = lightbox.querySelector('.lb-counter');
  const lbClose  = lightbox.querySelector('.lightbox-close');
  const lbPrev   = lightbox.querySelector('.lb-prev');
  const lbNext   = lightbox.querySelector('.lb-next');

  let current = 0;
  let visible = []; // tracks non-hidden items for navigation

  function getVisible() {
    return Array.from(items).filter((it) => !it.classList.contains('hidden'));
  }

  function show(idx) {
    visible = getVisible();
    if (!visible.length) return;
    // wrap index
    current = ((idx % visible.length) + visible.length) % visible.length;

    const fig = visible[current];
    const img = fig.querySelector('img');
    const cap = fig.querySelector('figcaption');

    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = cap ? cap.textContent : '';
    lbCount.textContent = (current + 1) + ' / ' + visible.length;
  }

  function open(idx) {
    show(idx);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // click each gallery item to open
  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
  });

  lbClose.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });

  // keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

/* ═══════════════════ PREMIUM BUNDLE ═══════════════════ */

// ── Hero auto slideshow (crossfade, no buttons/dots) ───
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;
  slides[0].classList.add('active');
  let idx = 0;
  setInterval(() => {
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('active');
  }, 5000);
})();

// ── Cinematic hero entrance ────────────────────────────
function runHeroEntrance() {
  if (!window.gsap) return;
  const hc = document.querySelector('.hero .hero-content');
  if (!hc) return;
  gsap.set(hc, { transition: 'none', opacity: 1 });
  gsap.fromTo(
    hc.children,
    { y: 44, opacity: 0, filter: 'blur(8px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out', stagger: 0.13 }
  );
}

// ── Elegant preloader ──────────────────────────────────
(function () {
  const pre = document.querySelector('.preloader');
  if (!pre) return;

  const openCurtains = () => pre.classList.add('curtains-open');
  const hide = () => { pre.style.display = 'none'; };

  // With GSAP: logo sequence, then curtains + logo vanish together
  if (window.gsap) {
    const tl = gsap.timeline();
    tl.fromTo('.preloader-inner', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' })
      .fromTo('.preloader-line', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, '-=0.2')
      // logo fades out first, then curtains open
      .to('.preloader-inner', { y: -20, opacity: 0, duration: 0.6, ease: 'power2.in' })
      .add(() => { runHeroEntrance(); openCurtains(); })
      .add(hide, '+=1.2');
  } else {
    // Without GSAP: still open the curtains via the CSS class
    window.setTimeout(openCurtains, 500);
    window.setTimeout(hide, 2000);
  }

  // Absolute safety: never leave content hidden behind the preloader
  window.setTimeout(hide, 5000);
})();

// ── Scroll progress bar ────────────────────────────────
(function () {
  const bar = document.querySelector('.scroll-progress');
  if (!bar || !window.ScrollTrigger) return;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
  });
})();

// ── Custom cursor (fine pointers only) ─────────────────
(function () {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  const isCoarse = window.matchMedia ? !window.matchMedia('(pointer: fine)').matches : true;
  if (!window.gsap || isTouch || isCoarse) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
  const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

  let shown = false;
  window.addEventListener('mousemove', (e) => {
    if (!shown) { gsap.to([dot, ring], { opacity: 1, duration: 0.3 }); shown = true; }
    dotX(e.clientX); dotY(e.clientY);
    ringX(e.clientX); ringY(e.clientY);
  });
  document.addEventListener('mouseleave', () => {
    gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    shown = false;
  });
  document.querySelectorAll('a, button, .card, .g-item').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });
})();

// ── Magnetic buttons ───────────────────────────────────
(function () {
  if (!window.gsap || !window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('.cta, .process-btn, .whatsapp-btn, .call-btn').forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power3.out' });
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
    });
    btn.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
  });
})();

// ── 3D tilt on celebration cards ───────────────────────
(function () {
  if (!window.gsap || !window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, {
        rotateY: px * 12, rotateX: -py * 12, y: -6,
        duration: 0.4, ease: 'power2.out', transformPerspective: 900,
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.5, ease: 'power3.out' });
    });
  });
})();

// ── Curtain (clip-path) image reveals ──────────────────
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.split .photo img, .feature > img').forEach((img) => {
    gsap.fromTo(img, { clipPath: 'inset(0 0 100% 0)' }, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.2, ease: 'power3.inOut',
      scrollTrigger: { trigger: img, start: 'top 88%', once: true },
    });
  });

  const moments = document.querySelectorAll('.moments img');
  if (moments.length) {
    gsap.fromTo(moments, { clipPath: 'inset(0 0 100% 0)' }, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.1, ease: 'power3.inOut', stagger: 0.12,
      scrollTrigger: { trigger: '.moments', start: 'top 88%', once: true },
    });
  }
})();

// ── CHECK AVAILABILITY MODAL ───────────────────────────
(function () {
  const modal = document.getElementById('availModal');
  if (!modal) return;

  const grid = modal.querySelector('.cal-grid');
  const title = modal.querySelector('.cal-title');
  const summary = modal.querySelector('.avail-summary');
  const triggers = document.querySelectorAll('.avail-trigger');
  const closeBtn = modal.querySelector('.avail-close');
  const backdrop = modal.querySelector('.avail-backdrop');
  const prevBtn = modal.querySelector('.cal-prev');
  const nextBtn = modal.querySelector('.cal-next');
  const propTabs = modal.querySelectorAll('.prop-tab');

  const toISO = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const fmt = (d) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Demo fallback: deterministic pseudo-random "booked" days per property
  function genBooked(prop) {
    const set = new Set();
    const now = new Date();
    const salt = prop === 'hall' ? 7 : 13;
    for (let i = 0; i < 95; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      let h = salt * (d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate());
      h = Math.abs(h) % 97;
      if (h < 33) set.add(toISO(d));
    }
    return set;
  }

  // Fetch real booked dates from Google Sheets (or fall back to demo)
  async function fetchBooked(prop) {
    if (!GOOGLE_SHEETS_URL) return genBooked(prop);
    try {
      const url = GOOGLE_SHEETS_URL + '?property=' + encodeURIComponent(prop);
      const res = await fetch(url);
      const json = await res.json();
      const set = new Set();
      if (json.booked && Array.isArray(json.booked)) {
        json.booked.forEach(function (d) { set.add(d); });
      }
      return set;
    } catch (err) {
      console.warn('Google Sheets fetch failed, using demo dates:', err);
      return genBooked(prop);
    }
  }

  let prop = 'hall';
  let booked = new Set();
  let viewY = new Date().getFullYear();
  let viewM = new Date().getMonth();
  let selStart = null;
  let selEnd = null;
  let singleMode = false;
  let onSingleSelect = null;
  const today = new Date();

  function rangeHasBooked(a, b) {
    for (let t = new Date(a); t <= b; t.setDate(t.getDate() + 1)) {
      if (booked.has(toISO(t))) return true;
    }
    return false;
  }

  function isSelected(iso) {
    if (!selStart) return false;
    const cur = new Date(iso + 'T00:00:00');
    if (selEnd) return cur >= selStart && cur <= selEnd;
    return toISO(selStart) === iso;
  }

  function render() {
    title.textContent = new Date(viewY, viewM, 1).toLocaleDateString('en-US', {
      month: 'long', year: 'numeric',
    });
    const firstDay = new Date(viewY, viewM, 1).getDay();
    const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();
    const tDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let html = '';
    for (let i = 0; i < firstDay; i++) html += '<span class="cal-empty"></span>';
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = toISO(new Date(viewY, viewM, d));
      const isPast = new Date(viewY, viewM, d) < tDate;
      const isBooked = booked.has(iso);
      let cls = 'cal-day';
      if (isPast) cls += ' past';
      if (isBooked) cls += ' booked';
      if (isSelected(iso)) cls += ' selected';
      html += `<button class="${cls}" data-iso="${iso}" ${(isPast || isBooked) ? 'disabled' : ''}>${d}</button>`;
    }
    grid.innerHTML = html;
    prevBtn.disabled = (viewY === today.getFullYear() && viewM === today.getMonth());
  }

  function showMsg(msg, type) {
    summary.className = 'avail-summary' + (type ? ' ' + type : '');
    summary.textContent = msg || '';
  }

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.cal-day');
    if (!btn || btn.disabled) return;
    const dObj = new Date(btn.dataset.iso + 'T00:00:00');

    if (singleMode) {
      selStart = dObj; selEnd = null;
      if (onSingleSelect) onSingleSelect(fmt(dObj), btn.dataset.iso);
      close();
      render();
      return;
    }
    if (!selStart) {
      selStart = dObj; selEnd = null;
      showMsg('Now pick a check-out date.');
    } else if (!selEnd) {
      if (dObj >= selStart) {
        selEnd = dObj;
        if (rangeHasBooked(selStart, selEnd)) {
          showMsg('⚠ That range includes a booked date — please choose another.', 'warn');
        } else {
          showMsg('✓ ' + fmt(selStart) + ' – ' + fmt(selEnd) + ' is available!', 'ok');
        }
      } else {
        selStart = dObj; selEnd = null;
        showMsg('Now pick a check-out date.');
      }
    } else {
      selStart = dObj; selEnd = null;
      showMsg('Now pick a check-out date.');
    }
    render();
  });

  prevBtn.addEventListener('click', () => {
    viewM--; if (viewM < 0) { viewM = 11; viewY--; }
    render();
  });
  nextBtn.addEventListener('click', () => {
    viewM++; if (viewM > 11) { viewM = 0; viewY++; }
    render();
  });

  propTabs.forEach((tab) => {
    tab.addEventListener('click', async () => {
      propTabs.forEach((t) => t.classList.remove('selected'));
      tab.classList.add('selected');
      prop = tab.dataset.prop;
      showMsg('Loading…');
      selStart = selEnd = null;
      viewY = today.getFullYear();
      viewM = today.getMonth();
      // Paint the new property's demo dates instantly, then swap in real
      // booked dates when the fetch resolves.
      booked = genBooked(prop);
      render();
      booked = await fetchBooked(prop);
      render();
    });
  });

  async function open(opts) {
    opts = opts || {};
    singleMode = !!opts.single;
    onSingleSelect = opts.onSelect || null;
    selStart = selEnd = null;
    showMsg(singleMode ? 'Select your event date.' : '');
    // Paint the calendar instantly (deterministic demo dates as an immediate
    // placeholder) so the modal never feels slow; swap in real booked dates
    // when the Google Sheets fetch resolves.
    booked = genBooked(prop);
    render();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    booked = await fetchBooked(prop);
    render();
  }
  function close() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    singleMode = false;
    onSingleSelect = null;
  }

  triggers.forEach((t) => t.addEventListener('click', () => open()));
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });

  // Expose for the contact form (event date picker) and any other caller.
  window.openAvailModal = open;
})();

// ── Contact form: Event Date opens the availability calendar ──
(function () {
  const field = document.getElementById('eventDate');
  if (!field || typeof window.openAvailModal !== 'function') return;
  field.addEventListener('click', (e) => {
    e.preventDefault();
    window.openAvailModal({
      single: true,
      onSelect: function (label, iso) {
        field.value = label;
        field.dataset.iso = iso;
      },
    });
  });
})();

/* ── PAST CELEBRATIONS video carousel ────────────────────
   • Videos start playing muted only when their card is on screen
     (IntersectionObserver) and pause/reset once scrolled away.
   • Unmute toggle on each card; only one card carries sound.
   • Arrow + dot navigation; dots sync to the most visible card.
   ────────────────────────────────────────────────────── */
(function () {
  const track = document.querySelector('.cp-track');
  const cards = Array.from(document.querySelectorAll('.cp-card'));
  const videos = document.querySelectorAll('.cp-card video');
  if (!track || !cards.length) return;

  // Dots (mobile indicator) + sync to most visible card
  const dotsWrap = document.querySelector('.cp-dots');
  const dots = [];
  if (dotsWrap) {
    cards.forEach((_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'cp-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to card ' + (i + 1));
      dots.push(d);
      dotsWrap.appendChild(d);
    });
    dots.forEach((d, i) => {
      d.addEventListener('click', () => {
        const tr = track.getBoundingClientRect();
        const cr = cards[i].getBoundingClientRect();
        // Center the tapped card in the track's viewport (live rects → correct at any scroll position)
        const target = track.scrollLeft + (cr.left - tr.left) + cr.width / 2 - track.clientWidth / 2;
        track.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
      });
    });

    let ticking = false;
    track.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        // Live viewport-relative positions, so the active dot tracks every scroll step
        const tr = track.getBoundingClientRect();
        const mid = tr.left + tr.width / 2;
        let best = 0;
        let bestDist = Infinity;
        cards.forEach((c, i) => {
          const cr = c.getBoundingClientRect();
          const cx = cr.left + cr.width / 2;
          const dist = Math.abs(cx - mid);
          if (dist < bestDist) { bestDist = dist; best = i; }
        });
        dots.forEach((d, i) => d.classList.toggle('active', i === best));
        ticking = false;
      });
    });
  }

  // Scroll-triggered muted playback
  const play = (v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  const pause = (v) => { try { v.pause(); } catch (e) {} };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const vid = e.target;
          if (e.isIntersecting) {
            vid.muted = true;
            play(vid);
          } else {
            pause(vid);
            try { vid.currentTime = 0; } catch (err) {}
          }
        });
      },
      { threshold: 0.55 }
    );
    videos.forEach((v) => { v.loop = true; io.observe(v); });
  }

  // Unmute / mute toggle (the chosen card can carry sound)
  document.querySelectorAll('.cp-mute').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.cp-card');
      if (!card) return;
      const video = card.querySelector('video');
      video.muted = !video.muted;
      btn.textContent = video.muted ? '🔇' : '🔊';
      btn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
      if (!video.muted) {
        document.querySelectorAll('.cp-card video').forEach((v) => {
          if (v !== video) v.muted = true;
        });
      }
    });
  });

  // Arrow navigation (desktop / tablet)
  const step = () => {
    const first = cards[0];
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return first ? first.offsetWidth + gap : 200;
  };
  const prev = document.querySelector('.cp-prev');
  const next = document.querySelector('.cp-next');

  const clamp = () => {
    if (prev) prev.disabled = track.scrollLeft <= 0;
    if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
  };
  if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (next) next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  setTimeout(clamp, 300);
  track.addEventListener('scroll', () => { if (window.requestAnimationFrame) requestAnimationFrame(clamp); else clamp(); });
})();

/* ── TESTIMONIALS (JS-rendered, drag-to-scroll + auto-advance) ──
   Two staggered full-bleed rows of horizontal-scrolling cards.
   Content is drawn from POOL below — swap in real client reviews here.
   Click-drag (or trackpad/shift-scroll) with momentum; both rows move
   in sync. The rows auto-scroll continuously right-to-left (seamless
   loop, two identical card-sets per row). Auto-scroll pauses on
   hover/touch, briefly after any manual interaction, and honors
   prefers-reduced-motion. The thin progress bar tracks row 1.
   ─────────────────────────────────────────────────────────────── */
(function () {
  const band = document.querySelector('.testi-band');
  if (!band) return;

  const rows = band.querySelectorAll('.tc-row');
  const progressBar = band.querySelector('.testi-progress-bar');
  if (!rows.length) return;

  /* Swappable testimonial pool — replace these with real reviews. */
  const POOL = [
    { quote: 'From the moment we arrived, everything felt effortless. The farmhouse was spotless, the grounds were stunning, and our guests haven\'t stopped talking about how beautiful it was.', name: 'Priya & Arjun', event: 'Wedding Celebration' },
    { quote: 'We hosted our company\'s annual retreat here and it exceeded every expectation. The hall was elegant, the AV flawless, the team handled every detail with precision.', name: 'Vikram Mehta', event: 'Corporate Retreat' },
    { quote: 'My parents\' 40th anniversary was everything they dreamed of. The garden setting, the fairy lights, the music — it was pure magic.', name: 'Shalini Reddy', event: 'Anniversary' },
    { quote: 'The kids had the time of their lives in the pool and garden while the adults relaxed with cocktails on the lawn. The perfect family getaway.', name: 'The Kapoor Family', event: 'Family Gathering' },
    { quote: 'We wanted an intimate celebration that felt special without being over the top. A beautiful, private space where every moment felt intentional.', name: 'Ananya & Rohit', event: 'Reception' },
    { quote: 'My daughter\'s first birthday was beyond what I imagined. The decorations, the space, the attention to every little detail — everything was perfect.', name: 'Meera Joshi', event: 'Birthday Celebration' },
    { quote: 'The team went above and beyond for our product launch. The venue looked spectacular on camera, and the seamless coordination let us focus on our guests.', name: 'Karthik Nair', event: 'Brand Launch' },
    { quote: 'Weekend stay with friends was absolutely perfect. The pool, the bonfire area, the spacious rooms — it felt like a private resort just for us.', name: 'The Menon Group', event: 'Weekend Stay' },
    { quote: 'My bridal shower was dreamy from start to finish. The team anticipated every need before I could even ask. I\'ll treasure that evening forever.', name: 'Ananya Joshi', event: 'Bridal Shower' },
    { quote: 'Twenty-five years of marriage, celebrated in the most beautiful garden setting. Thank you for making it so personal and heartfelt.', name: 'Suresh & Lakshmi', event: 'Silver Jubilee' }
  ];

  // Two identical card-sets per row → a seamless infinite right-to-left loop.
  const CARDS_PER_ROW = 16; // = CARDS_PER_SET × 2
  const CARDS_PER_SET = 8;

  function buildCards(rowEl, startIndex) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < CARDS_PER_ROW; i++) {
      var t = POOL[(startIndex + i) % POOL.length];
      var card = document.createElement('article');
      card.className = 'testi-card';
      card.innerHTML =
        '<span class="testi-qmark">&ldquo;</span>' +
        '<div class="testi-vdiv"></div>' +
        '<div class="testi-content">' +
          '<p class="testi-quote"></p>' +
          '<span class="testi-name"></span>' +
          '<span class="testi-rule"></span>' +
          '<span class="testi-event"></span>' +
        '</div>';
      card.querySelector('.testi-quote').textContent = t.quote;
      card.querySelector('.testi-name').textContent = t.name;
      card.querySelector('.testi-event').textContent = t.event;
      frag.appendChild(card);
    }
    rowEl.appendChild(frag);
  }

  // Row 2 starts mid-pool so its visible cards differ from Row 1's.
  buildCards(rows[0], 0);
  if (rows[1]) buildCards(rows[1], 3);

  var FRICTION = 0.92;
  var MIN_VELOCITY = 0.5;
  var AUTO_PX = 0.42;         // px/frame (~25px/s @60fps) — slow right-to-left drift
  var WHEEL_PAUSE_MS = 2200;  // brief stop after the user wheels / grabs

  var dragging = null; // { pointerId, captureEl, startX, lastX, lastTime, velocity, targets[] }
  var vel = 0;         // flick velocity added on top of the auto drift
  var touching = false;
  var userPauseUntil = 0;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var loopStep = 0; // width of one card-set = seamless loop period

  function now() { return performance.now(); }

  function getStep() {
    var cards = rows[0].querySelectorAll('.testi-card');
    if (!cards.length) return 240;
    // Measure the actual distance between card starts (gap is a %, so
    // reading computed style would return the raw percentage).
    var step = cards[0].offsetWidth;
    if (cards[1]) {
      var a = cards[0].getBoundingClientRect();
      var b = cards[1].getBoundingClientRect();
      step = b.left - a.left;
    }
    return step > 0 ? step : cards[0].offsetWidth + 24;
  }

  function measureLoop() {
    var s = getStep();
    loopStep = s * CARDS_PER_SET;
    if (loopStep <= 0) return;
    // Pin each row inside the loop window [0, loopStep).
    rows.forEach(function (r) {
      r.scrollLeft = ((r.scrollLeft % loopStep) + loopStep) % loopStep;
    });
    updateProgress();
  }

  /* Seamless wrap: the content is two identical card-sets, so the row at
     scrollLeft == loopStep shows exactly the same layout as at 0. Rewinding
     by loopStep is therefore invisible. */
  function wrapRows() {
    if (loopStep <= 0) return;
    rows.forEach(function (r) {
      if (r.scrollLeft >= loopStep) r.scrollLeft -= loopStep;
      else if (r.scrollLeft < 0) r.scrollLeft += loopStep;
    });
  }

  function updateProgress() {
    if (!progressBar) return;
    if (loopStep <= 0) { progressBar.style.width = '0%'; return; }
    var pct = ((rows[0].scrollLeft / loopStep * 100) % 100 + 100) % 100;
    progressBar.style.width = pct + '%';
  }

  /* ── One rAF loop drives the continuous right-to-left scroll + flick ── */
  function scrollFrame() {
    if (dragging) { // pointermove writes scrollLeft directly
      requestAnimationFrame(scrollFrame);
      return;
    }
    var auto = !touching && now() >= userPauseUntil && !reducedMotion;
    var dx = auto ? AUTO_PX : 0;
    if (vel !== 0) {
      dx += vel;
      vel *= FRICTION;
      if (Math.abs(vel) < MIN_VELOCITY) vel = 0;
    }
    if (dx !== 0) {
      rows.forEach(function (r) { r.scrollLeft += dx; });
      wrapRows();
      updateProgress();
    }
    requestAnimationFrame(scrollFrame);
  }

  /* ── Drag-to-scroll: one gesture moves BOTH rows in sync ── */
  function onPointerDown(e) {
    if (e.button && e.button !== 0) return; // ignore right-click
    vel = 0;
    userPauseUntil = now();
    dragging = {
      pointerId: e.pointerId,
      captureEl: e.currentTarget,
      startX: e.clientX,
      lastX: e.clientX,
      lastTime: performance.now(),
      velocity: 0,
      targets: []
    };
    rows.forEach(function (r) {
      dragging.targets.push(r.scrollLeft);
      r.classList.add('dragging');
    });
    if (dragging.captureEl && dragging.captureEl.setPointerCapture) {
      try { dragging.captureEl.setPointerCapture(dragging.pointerId); } catch (err) {}
    }
  }

  function onPointerMove(e) {
    if (!dragging || e.pointerId !== dragging.pointerId) return;
    var dx = dragging.startX - e.clientX;
    rows.forEach(function (r, i) {
      r.scrollLeft = dragging.targets[i] + dx;
    });
    var t = performance.now();
    var dt = t - dragging.lastTime;
    if (dt > 0) dragging.velocity = (dragging.lastX - e.clientX) / dt * 16; // px/frame
    dragging.lastX = e.clientX;
    dragging.lastTime = t;
    updateProgress();
  }

  function onPointerEnd() {
    if (!dragging) return;
    vel = dragging.velocity; // flick keeps decaying into the auto-drift
    rows.forEach(function (r) { r.classList.remove('dragging'); });
    if (dragging.captureEl && dragging.captureEl.releasePointerCapture) {
      try { dragging.captureEl.releasePointerCapture(dragging.pointerId); } catch (err) {}
    }
    dragging = null;
    // No resume delay — the marquee picks back up on the very next frame.
    // (Only wheel breaks resume, since a trackpad sweep needs room to breathe.)
  }

  rows.forEach(function (row) {
    row.addEventListener('pointerdown', onPointerDown);
    row.addEventListener('pointermove', onPointerMove);
    row.addEventListener('pointerup', onPointerEnd);
    row.addEventListener('pointercancel', onPointerEnd);
    row.addEventListener('wheel', function () {
      userPauseUntil = now() + WHEEL_PAUSE_MS;
      vel = 0;
    }, { passive: true });
  });

  /* ── Pause only on touch; hover never stops the marquee ── */
  band.addEventListener('touchstart', function () { touching = true; }, { passive: true });
  band.addEventListener('touchend', function () { touching = false; }, { passive: true });
  band.addEventListener('touchcancel', function () { touching = false; }, { passive: true });

  /* ── Keep the progress bar honest during native wheel/trackpad scroll ── */
  rows.forEach(function (row) {
    row.addEventListener('scroll', function () {
      if (window.requestAnimationFrame) requestAnimationFrame(updateProgress);
      else updateProgress();
    }, { passive: true });
  });

  /* ── Init ── */
  window.addEventListener('resize', measureLoop);
  measureLoop();
  updateProgress();
  requestAnimationFrame(scrollFrame);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measureLoop); // remeasure once fonts settle
  }
})();
