'use strict';

/* ==================================================
   PROPERTY PANCHANG — Full Animation Script
   Matching the original website's animations exactly
   ================================================== */

// ─────────────────────────────────────────
// 1. PAGE PROGRESS BAR
// ─────────────────────────────────────────
const progressBar = document.getElementById('progressBar');

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}

// ─────────────────────────────────────────
// 2. CUSTOM CURSOR (desktop only)
// ─────────────────────────────────────────
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let rafCursor;

if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = mouseX - 4 + 'px';
    cursorDot.style.top  = mouseY - 4 + 'px';
  });

  // Ring follows with lag
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX - 16 + 'px';
    cursorRing.style.top  = ringY - 16 + 'px';
    rafCursor = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect: ring grows on interactive elements
  document.querySelectorAll('a, button, .service-item, .project-card, .listing-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width  = '54px';
      cursorRing.style.height = '54px';
      cursorRing.style.borderColor = 'rgba(249,115,22,0.9)';
      cursorDot.style.transform = 'scale(2)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width  = '32px';
      cursorRing.style.height = '32px';
      cursorRing.style.borderColor = 'rgba(249,115,22,0.5)';
      cursorDot.style.transform = 'scale(1)';
    });
  });
}

// ─────────────────────────────────────────
// 3. NAVBAR — scroll transition
// ─────────────────────────────────────────
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

function handleNavbar() {
  const scrollY = window.scrollY;

  if (scrollY > 60) {
    navbar.classList.add('scrolled');
    navbar.classList.remove('at-top');
  } else {
    navbar.classList.remove('scrolled');
    navbar.classList.add('at-top');
  }

  // Back to top button
  if (scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

handleNavbar();

// ─────────────────────────────────────────
// 4. ACTIVE NAV LINK
// ─────────────────────────────────────────
const sections     = document.querySelectorAll('section[id]');
const navLinks     = document.querySelectorAll('.nav-link');
const mobileLinks  = document.querySelectorAll('.mobile-link');
const navHeight    = 72;

function updateActiveLink() {
  const scrollPos = window.scrollY + navHeight + 40;
  let currentId = '';

  sections.forEach(section => {
    if (section.offsetTop <= scrollPos) {
      currentId = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}

// ─────────────────────────────────────────
// 5. SCROLL REVEAL ANIMATION (data-reveal)
//    Like AOS but custom, matching original
// ─────────────────────────────────────────
const revealElements = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target); // once
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => {
  revealObserver.observe(el);
});

// ─────────────────────────────────────────
// 6. HERO PARALLAX
// ─────────────────────────────────────────
const heroImg = document.getElementById('heroImg');

function handleParallax() {
  if (!heroImg) return;
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    heroImg.style.transform = `translateY(${scrollY * 0.35}px)`;
  }
}

// ─────────────────────────────────────────
// 7. STATS COUNTER ANIMATION
// ─────────────────────────────────────────
const statsTargets = [
  { id: 'stat1', target: 15 },
  { id: 'stat2', target: 50 },
  { id: 'stat3', target: 1000 },
  { id: 'stat4', target: 100 },
];

let statsAnimated = false;

function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statsTargets.forEach(({ id, target }) => {
        const el = document.getElementById(id);
        if (el) animateCounter(el, target);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.2 });

const aboutSection = document.querySelector('.about-stats');
if (aboutSection) statsObserver.observe(aboutSection);

// ─────────────────────────────────────────
// 8. SERVICE ITEM HOVER — line animation
//    is handled purely via CSS, but JS adds
//    class for number color change on reveal
// ─────────────────────────────────────────
// The service items' underline animation is CSS ::after based
// We do nothing extra in JS — it's all driven by CSS transitions

// ─────────────────────────────────────────
// 9. PROJECT CARD — 3D TILT ON HOVER
// ─────────────────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rotY = ((x - cx) / cx) * 4;
    const rotX = ((y - cy) / cy) * -3;
    card.style.transform = `translateY(-8px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`;
    card.style.transition = 'none'; // instant while moving
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1)';
    card.style.transform = '';
  });
});

// ─────────────────────────────────────────
// 10. RIPPLE EFFECT ON BUTTONS
// ─────────────────────────────────────────
document.querySelectorAll('.ripple-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${x - size/2}px; top: ${y - size/2}px;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// ─────────────────────────────────────────
// 11. MOBILE MENU TOGGLE
// ─────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on link click
document.querySelectorAll('.mobile-link, .btn-mobile-cta').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', false);
  document.body.style.overflow = '';
}

// ─────────────────────────────────────────
// 12. SMOOTH ANCHOR SCROLL
// ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
    closeMenu(); // also close mobile menu
  });
});

// ─────────────────────────────────────────
// 13. BACK TO TOP
// ─────────────────────────────────────────
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─────────────────────────────────────────
// 14. CONTACT FORM
// ─────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name  = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name || !phone) {
      // Shake the submit button
      submitBtn.style.animation = 'shake 0.5s ease';
      setTimeout(() => { submitBtn.style.animation = ''; }, 600);
      // Highlight missing fields
      if (!name)  { document.getElementById('name').style.borderColor  = '#EF4444'; setTimeout(() => document.getElementById('name').style.borderColor  = '', 2000); }
      if (!phone) { document.getElementById('phone').style.borderColor = '#EF4444'; setTimeout(() => document.getElementById('phone').style.borderColor = '', 2000); }
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Sending…';
    submitBtn.querySelector('svg').innerHTML = '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" stroke-dasharray="56" stroke-dashoffset="14" fill="none" style="animation:spin 1s linear infinite"/>';

    setTimeout(() => {
      // Hide form, show success
      Array.from(contactForm.elements).forEach(el => { el.closest('.form-group, .form-row, .btn-form-submit') && (el.closest('.form-group, .form-row, .btn-form-submit').style.display = 'none'); });
      submitBtn.style.display = 'none';
      formSuccess.style.display = 'block';
      formSuccess.classList.add('show');

      // Reset after 8s
      setTimeout(() => {
        formSuccess.style.display = 'none';
        formSuccess.classList.remove('show');
        Array.from(contactForm.elements).forEach(el => { el.closest('.form-group, .form-row') && (el.closest('.form-group, .form-row').style.display = ''); });
        submitBtn.style.display = '';
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Schedule Muhurat Visit';
        submitBtn.querySelector('svg').innerHTML = '<path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>';
        contactForm.reset();
      }, 7000);
    }, 1600);
  });
}

// ─────────────────────────────────────────
// 15. LISTING CARD — stagger reveal
// ─────────────────────────────────────────
const listingCards = document.querySelectorAll('.listing-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      const delay = parseInt(card.dataset.delay || 0);
      setTimeout(() => { card.classList.add('revealed'); }, delay);
      cardObserver.unobserve(card);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

listingCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  cardObserver.observe(card);
});

// Add revealed class to listing cards
document.querySelectorAll('.listing-card').forEach(card => {
  card.addEventListener('transitionrun', () => {}); // flush
});

// Override: revealed class sets cards visible
const styleTag = document.createElement('style');
styleTag.textContent = `
  .listing-card.revealed { opacity: 1 !important; transform: translateY(0) !important; }
  
  @keyframes spin {
    from { stroke-dashoffset: 56; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px); }
    60%       { transform: translateX(-5px); }
    80%       { transform: translateX(5px); }
  }
`;
document.head.appendChild(styleTag);

// ─────────────────────────────────────────
// 16. SERVICE ITEM — staggered slide-in
// ─────────────────────────────────────────
const serviceItems = document.querySelectorAll('.service-item');

// Init hidden
serviceItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-24px)';
  item.style.transition = 'none';
});

const serviceObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      serviceItems.forEach((item, i) => {
        setTimeout(() => {
          item.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
          item.style.opacity    = '1';
          item.style.transform  = 'translateX(0)';
        }, i * 120);
      });
      serviceObserver.disconnect();
    }
  });
}, { threshold: 0.05 });

const servicesSection = document.querySelector('.services-section');
if (servicesSection) serviceObserver.observe(servicesSection);

// ─────────────────────────────────────────
// 17. PRELAUNCH BENEFITS — stagger
// ─────────────────────────────────────────
const benefitItems = document.querySelectorAll('.benefit-item');
benefitItems.forEach(item => {
  item.style.opacity   = '0';
  item.style.transform = 'translateX(-16px)';
  item.style.transition = 'none';
});

const benefitObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    benefitItems.forEach((item, i) => {
      setTimeout(() => {
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        item.style.opacity    = '1';
        item.style.transform  = 'translateX(0)';
      }, 300 + i * 100);
    });
    benefitObserver.disconnect();
  }
}, { threshold: 0.1 });

const prelaunchSection = document.querySelector('.prelaunch-section');
if (prelaunchSection) benefitObserver.observe(prelaunchSection);

// ─────────────────────────────────────────
// 18. IMAGE HOVER ZOOM (about)
// ─────────────────────────────────────────
document.querySelectorAll('.about-img-wrap img').forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
    img.closest('.about-img-wrap').style.background = 'linear-gradient(135deg,#1F2937,#374151)';
  });
});

// ─────────────────────────────────────────
// 19. UNIFIED SCROLL HANDLER
// ─────────────────────────────────────────
function onScroll() {
  handleNavbar();
  updateActiveLink();
  updateProgressBar();
  handleParallax();
}

window.addEventListener('scroll', onScroll, { passive: true });

// Initial state
onScroll();

// ─────────────────────────────────────────
// 20. ABOUT SECTION IMAGE — stagger in
// ─────────────────────────────────────────
const aboutImgWraps = document.querySelectorAll('.about-img-wrap');
aboutImgWraps.forEach(wrap => {
  wrap.style.opacity = '0';
  wrap.style.transform = 'scale(0.94)';
  wrap.style.transition = 'none';
});

const aboutImgObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    aboutImgWraps.forEach((wrap, i) => {
      setTimeout(() => {
        wrap.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        wrap.style.opacity    = '1';
        wrap.style.transform  = 'scale(1)';
      }, i * 120);
    });
    aboutImgObserver.disconnect();
  }
}, { threshold: 0.1 });

const aboutImages = document.querySelector('.about-images');
if (aboutImages) aboutImgObserver.observe(aboutImages);

console.log('Property Panchang — All animations active ✦');
