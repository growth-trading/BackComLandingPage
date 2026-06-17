// ===== INJECT CONTACT INFO =====
function injectContactInfo() {
  const setHref = (id, href) => {
    const el = document.getElementById(id);
    if (el && href) el.href = href;
  };
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  };

  // Card hrefs
  setHref('contact-telegram', CONTACT.telegram.url);
  setHref('contact-zalo',     CONTACT.zalo.url);
  setHref('contact-facebook', CONTACT.facebook.url);
  setHref('contact-email',    CONTACT.email.url);

  // Handles / display values
  setText('ct-telegram-handle', CONTACT.telegram.handle);
  setText('ct-zalo-handle',     CONTACT.zalo.phone);
  setText('ct-facebook-handle', CONTACT.facebook.handle);
  setText('ct-email-handle',    CONTACT.email.address);

  // Descriptions
  setText('ct-telegram-desc-vi',  CONTACT.telegram.descVi);
  setText('ct-telegram-desc-en',  CONTACT.telegram.descEn);
  setText('ct-zalo-desc-vi',      CONTACT.zalo.descVi);
  setText('ct-zalo-desc-en',      CONTACT.zalo.descEn);
  setText('ct-facebook-desc-vi',  CONTACT.facebook.descVi);
  setText('ct-facebook-desc-en',  CONTACT.facebook.descEn);
  setText('ct-email-desc-vi',     CONTACT.email.descVi);
  setText('ct-email-desc-en',     CONTACT.email.descEn);

  // Footer links
  setHref('footer-telegram', CONTACT.telegram.url);
  setHref('footer-zalo',     CONTACT.zalo.url);
  setHref('footer-facebook', CONTACT.facebook.url);
  setHref('footer-email',    CONTACT.email.url);
}

// ===== INJECT BROKER LINKS & REF CODES =====
function injectBrokerLinks() {
  // Links: data-broker="exness" data-action="register|activate|switch-ib|identity-transfer"
  document.querySelectorAll('[data-broker][data-action]').forEach(el => {
    const broker = BROKERS[el.dataset.broker];
    if (!broker) return;
    const action = el.dataset.action;
    const urlMap = {
      register: broker.registerUrl,
      'activate-old': broker.activateOldUrl || broker.registerUrl,
      'switch-ib': broker.switchIbUrl || broker.registerUrl,
      'identity-transfer': broker.identityTransferUrl || broker.registerUrl,
    };
    const url = urlMap[action] || broker.registerUrl;
    if (el.tagName === 'A') {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
  });

  // Ref code display: data-ref="exness"
  document.querySelectorAll('[data-ref]').forEach(el => {
    const broker = BROKERS[el.dataset.ref];
    if (broker) el.textContent = broker.refCode;
  });

  // Copy ref code buttons: data-copy-ref="exness"
  document.querySelectorAll('[data-copy-ref]').forEach(btn => {
    const broker = BROKERS[btn.dataset.copyRef];
    if (broker) btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      copyText(broker.refCode, btn);
    };
  });
}

// ===== THEME TOGGLE =====
function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light');
  localStorage.setItem('backcom-theme', isLight ? 'light' : 'dark');
}

// ===== LANGUAGE TOGGLE =====
let currentLang = 'vi';

function toggleLang() {
  currentLang = currentLang === 'vi' ? 'en' : 'vi';
  document.getElementById('langLabel').textContent = currentLang === 'vi' ? 'EN' : 'VI';
  document.documentElement.lang = currentLang;

  document.querySelectorAll('.vi-text').forEach(el => {
    el.style.display = currentLang === 'vi' ? '' : 'none';
  });
  document.querySelectorAll('.en-text').forEach(el => {
    el.style.display = currentLang === 'en' ? '' : 'none';
  });
}

// ===== MOBILE MENU =====
function toggleMenu() {
  const menu = document.getElementById('navMobile');
  menu.classList.toggle('open');
}

// Close menu on outside click
document.addEventListener('click', function(e) {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const menu = document.getElementById('navMobile');
  if (!nav.contains(e.target)) return;
  if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// ===== NAVBAR SCROLL SHADOW =====
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 10) {
    navbar.style.boxShadow = '0 2px 24px rgba(0,0,0,.5)';
  } else {
    navbar.style.boxShadow = '';
  }
});

// ===== BROKER CARD FILTER =====
function filterBrokers(cat, btn) {
  document.querySelectorAll('.blist-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.broker-card').forEach(card => {
    const show = cat === 'all' || card.dataset.cat === cat;
    card.style.display = show ? '' : 'none';
  });
}

// ===== BROKER SELECTOR =====
function goToBroker(broker) {
  // Navigate to broker detail page
  window.location.href = 'brokers/' + broker + '.html';
}

function switchBroker(broker, btn) {
  // Legacy function kept for compatibility
  // Hide all panels, show selected
  document.querySelectorAll('.broker-panel').forEach(p => p.classList.remove('active-broker'));
  const panel = document.getElementById('broker-' + broker);
  if (panel) {
    panel.classList.add('active-broker');
    // Smooth scroll to panel top if below viewport
    const top = panel.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight) {
      const offset = 80;
      window.scrollTo({ top: panel.offsetTop - offset, behavior: 'smooth' });
    }
  }
}

// ===== REGISTRATION TABS =====
function switchTab(broker, panelNum, btn) {
  // Deactivate all tabs in same broker block
  const brokerBlock = btn.closest('.broker-block') || btn.closest('.bkex-section');
  const tabs = btn.closest('.reg-tabs').querySelectorAll('.reg-tab');
  tabs.forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  // Hide all panels for this broker
  const panels = btn.closest('.reg-guide').querySelectorAll('.reg-panel');
  panels.forEach(p => p.classList.remove('active'));

  // Show target panel
  const target = document.getElementById(`${broker}-panel-${panelNum}`);
  if (target) target.classList.add('active');
}

// ===== FAQ ACCORDION =====
function toggleFaq(item) {
  const isOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
  // Open clicked if it was closed
  if (!isOpen) item.classList.add('open');
}

// ===== COPY TEXT =====
function copyText(text, btn) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-check-lg"></i>';
    btn.style.color = '#22c55e';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.color = '';
    }, 1500);
  }).catch(() => {
    // Fallback
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });
}

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  // Assign animation type + stagger delay to each element
  const groups = [
    { sel: '.feat-card',    cls: 'anim-up',    stagger: 80  },
    { sel: '.step-card',    cls: 'anim-up',    stagger: 100 },
    { sel: '.stat-box',     cls: 'anim-scale', stagger: 70  },
    { sel: '.faq-item',     cls: 'anim-up',    stagger: 60  },
    { sel: '.cmp-box.cmp-yes', cls: 'anim-left',  stagger: 0 },
    { sel: '.cmp-box.cmp-no',  cls: 'anim-right', stagger: 0 },
    { sel: '.broker-block', cls: 'anim-up',    stagger: 0   },
    { sel: '.contact-card', cls: 'anim-scale', stagger: 80  },
    { sel: '.section-header', cls: 'anim-up', stagger: 0   },
  ];

  groups.forEach(({ sel, cls, stagger }) => {
    // Group by parent to reset stagger counter per visible group
    const els = document.querySelectorAll(sel);
    const parents = new Map();
    els.forEach(el => {
      const parent = el.parentElement;
      if (!parents.has(parent)) parents.set(parent, []);
      parents.get(parent).push(el);
    });
    parents.forEach(children => {
      children.forEach((el, i) => {
        el.classList.add('anim-el', cls);
        el.style.setProperty('--delay', (i * stagger) + 'ms');
      });
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Trigger countUp if applicable
        const numEl = entry.target.querySelector('[data-count]');
        if (numEl && !numEl.dataset.counted) {
          numEl.dataset.counted = '1';
          countUp(numEl);
        }
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.anim-el').forEach(el => io.observe(el));

  // CountUp — re-triggers every time element enters viewport
  const numObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
      } else {
        // Cancel running animation when scrolled away so next entry starts fresh
        if (entry.target._countFrame) {
          cancelAnimationFrame(entry.target._countFrame);
          entry.target._countFrame = null;
        }
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(el => numObserver.observe(el));
}

// ===== COUNT UP ANIMATION =====
function countUp(el) {
  if (el._countFrame) cancelAnimationFrame(el._countFrame);
  const target   = parseFloat(el.dataset.count);
  if (isNaN(target)) return;
  const prefix   = el.dataset.prefix || '';
  const suffix   = el.dataset.suffix || '';
  const duration = 1400;
  const start    = performance.now();
  const isInt    = Number.isInteger(target);

  function tick(now) {
    const p     = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val   = eased * target;
    el.textContent = prefix + (isInt ? Math.floor(val).toLocaleString('vi-VN') : val.toFixed(1)) + suffix;
    if (p < 1) el._countFrame = requestAnimationFrame(tick);
    else el.textContent = prefix + (isInt ? target.toLocaleString('vi-VN') : target.toFixed(1)) + suffix;
  }
  el._countFrame = requestAnimationFrame(tick);
}

document.addEventListener('DOMContentLoaded', function() {
  injectContactInfo();
  injectBrokerLinks();
  initScrollAnimations();
});

// ===== ACTIVE NAV HIGHLIGHT ON SCROLL =====
(function () {
  const sections = ['brokers', 'how-it-works', 'why-backcom', 'faq', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function setActiveNav(id) {
    document.querySelectorAll('.nav-link, .nav-mobile-link').forEach(a => {
      const href = a.getAttribute('href');
      if (href === '#' + id) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveNav(entry.target.id);
    });
  }, { rootMargin: '-50% 0px -45% 0px', threshold: 0 });

  sections.forEach(s => navObserver.observe(s));
})();
