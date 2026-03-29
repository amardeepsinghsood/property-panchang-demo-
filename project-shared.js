/* ==========================================
   PROPERTY PANCHANG — Project Pages Shared JS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR ---- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .btn-mobile-cta');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    navbar.classList.toggle('at-top', window.scrollY <= 60);
  }, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileLinks.forEach(l => l.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---- SCROLL REVEAL ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* ---- PROGRESS BAR ---- */
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
    }, { passive: true });
  }

  /* ---- BACK TO TOP ---- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- CUSTOM CURSOR (desktop only) ---- */
  if (window.matchMedia('(pointer:fine)').matches) {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (dot && ring) {
      let mx = 0, my = 0, rx = 0, ry = 0;
      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
      const animate = () => {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        dot.style.cssText  = `left:${mx}px;top:${my}px;`;
        ring.style.cssText = `left:${rx}px;top:${ry}px;`;
        requestAnimationFrame(animate);
      };
      animate();
      document.querySelectorAll('a,button,[role=button]').forEach(el => {
        el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
        el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
      });
    }
  }

  /* ---- RIPPLE EFFECT ---- */
  document.querySelectorAll('.ripple-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const r = document.createElement('span');
      r.className = 'ripple-effect';
      const rect = this.getBoundingClientRect();
      r.style.cssText = `
        position:absolute;left:${e.clientX-rect.left}px;top:${e.clientY-rect.top}px;
        transform:translate(-50%,-50%) scale(0);
        width:200%;padding-bottom:200%;border-radius:50%;
        background:rgba(255,255,255,0.25);animation:ripple 0.6s ease forwards;pointer-events:none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(r);
      setTimeout(() => r.remove(), 700);
    });
  });

  /* ---- GALLERY LIGHTBOX ---- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;
      display:none;align-items:center;justify-content:center;
      cursor:zoom-out;animation:fadeIn 0.3s ease;
    `;
    lb.innerHTML = `<img id="lbImg" style="max-width:90vw;max-height:90vh;border-radius:12px;object-fit:contain;user-select:none;" />
      <button id="lbClose" style="position:absolute;top:20px;right:20px;background:rgba(255,255,255,0.12);border:none;color:white;width:44px;height:44px;border-radius:50%;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>`;
    document.body.appendChild(lb);
    const lbImg = lb.querySelector('#lbImg');
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        lbImg.src = item.querySelector('img').src;
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });
    [lb, lb.querySelector('#lbClose')].forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === lb || e.target === e.currentTarget) {
          lb.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { lb.style.display = 'none'; document.body.style.overflow = ''; }
    });
  }

  /* ---- COUNTER ANIMATION ---- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.count);
          const duration = 1800;
          const step = target / (duration / 16);
          let current = 0;
          const interval = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.round(current);
            if (current >= target) clearInterval(interval);
          }, 16);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  /* ---- PARALLAX ON HERO ---- */
  const heroImg = document.querySelector('.project-hero-bg img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroImg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
    }, { passive: true });
  }

  /* Ripple keyframe injection */
  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = `
      @keyframes ripple { to { transform:translate(-50%,-50%) scale(1); opacity:0; } }
      @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      #cursorDot { position:fixed;width:8px;height:8px;background:var(--orange);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:width 0.3s,height 0.3s,background 0.3s; }
      #cursorRing { position:fixed;width:36px;height:36px;border:2px solid var(--orange);border-radius:50%;pointer-events:none;z-index:9997;transform:translate(-50%,-50%);opacity:0.5;transition:width 0.3s,height 0.3s,opacity 0.3s; }
      #cursorDot.hover { width:14px;height:14px; }
      #cursorRing.hover { width:52px;height:52px;opacity:0.3; }
    `;
    document.head.appendChild(style);
  }

});
