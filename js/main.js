/* ============================================================
   VantageScale – main.js
   Vanilla ES6+. No jQuery. No frameworks.
   ============================================================ */

/* ---------- AOS (Animate on Scroll) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 400,
      easing: 'ease-out',
      once: true,
      offset: 60,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }
});

/* ---------- Sticky Navbar ---------- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- Mobile Menu ---------- */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn   = document.getElementById('close-menu');

  if (!hamburger || !mobileMenu) return;

  function open() {
    mobileMenu.classList.remove('translate-x-full');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    mobileMenu.classList.add('translate-x-full');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('translate-x-full')) close();
  });
})();

/* ---------- Sticky CTA Bar ---------- */
(function initStickyCtaBar() {
  const bar     = document.getElementById('sticky-cta');
  const dismiss = document.getElementById('dismiss-cta');
  if (!bar) return;

  if (sessionStorage.getItem('cta-dismissed')) return;

  const show = () => bar.classList.remove('translate-y-full');
  const hide = () => bar.classList.add('translate-y-full');

  window.addEventListener('scroll', () => {
    window.scrollY > 700 ? show() : hide();
  }, { passive: true });

  dismiss?.addEventListener('click', () => {
    hide();
    sessionStorage.setItem('cta-dismissed', '1');
  });
})();

/* ---------- Metric Counter Animation ---------- */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1500;
    const start    = performance.now();

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      const value    = eased * target;

      el.textContent = decimals > 0
        ? value.toFixed(decimals)
        : Math.floor(value).toString();

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = decimals > 0
          ? target.toFixed(decimals)
          : target.toString();
      }
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ---------- FAQ Accordion (single-open) ---------- */
(function initAccordion() {
  const allDetails = document.querySelectorAll('details.faq-item');
  if (!allDetails.length) return;

  allDetails.forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        allDetails.forEach(other => {
          if (other !== detail && other.open) other.open = false;
        });
      }
      const summary = detail.querySelector('summary');
      if (summary) summary.setAttribute('aria-expanded', detail.open);
    });
  });
})();

/* ---------- Smooth Scroll (Safari polyfill) ---------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ---------- Contact Form (Formspree AJAX) ---------- */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const successMsg = document.getElementById('form-success');
    const errorMsg   = document.getElementById('form-error');

    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        form.style.display = 'none';
        if (successMsg) successMsg.classList.remove('hidden');
      } else {
        throw new Error('Server error');
      }
    } catch {
      if (errorMsg) errorMsg.classList.remove('hidden');
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  });
})();

/* ---------- Blog Email Capture (Formspree AJAX) ---------- */
(function initEmailCapture() {
  const form = document.getElementById('email-capture-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const success = document.getElementById('email-capture-success');

    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok && success) {
        form.style.display = 'none';
        success.classList.remove('hidden');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Send Me the Guides';
    }
  });
})();
