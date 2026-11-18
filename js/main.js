// BD Residential Care Home — site scripts

// 1. Fade sections in as they scroll into view
(function () {
  const items = document.querySelectorAll('.reveal');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => io.observe(el));
})();

// 2. Mobile menu
(function () {
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    })
  );
})();

// 3. Contact form — sends inquiries to your email through Web3Forms (see README)
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const key = form.querySelector('input[name="access_key"]').value;
    if (!key || key === 'YOUR_ACCESS_KEY_HERE') {
      status.textContent = 'The contact form is not connected yet. Please call or email us for now.';
      return;
    }
    status.textContent = 'Sending…';
    button.disabled = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const data = await res.json();
      if (data.success) {
        form.reset();
        status.textContent = 'Thank you! We received your message and will be in touch soon.';
      } else {
        status.textContent = 'Something went wrong. Please try again or give us a call.';
      }
    } catch {
      status.textContent = 'Something went wrong. Please try again or give us a call.';
    } finally {
      button.disabled = false;
    }
  });
})();

// 4. Keep the footer year current
document.getElementById('year').textContent = new Date().getFullYear();
