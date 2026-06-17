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
    if (broker) btn.onclick = () => copyText(broker.refCode, btn);
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

// ===== BROKER SELECTOR =====
function goToBroker(broker) {
  // Find and click the matching selector button
  const btn = document.querySelector(`.broker-sel-btn[onclick*="'${broker}'"]`);
  if (btn) switchBroker(broker, btn);

  // Scroll to brokers section
  const section = document.getElementById('brokers');
  if (section) {
    const top = section.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function switchBroker(broker, btn) {
  // Deactivate all selector buttons
  btn.closest('.broker-selector').querySelectorAll('.broker-sel-btn').forEach(b => {
    b.classList.remove('active');
    b.removeAttribute('data-active-broker');
  });
  btn.classList.add('active');
  btn.dataset.activeBroker = broker;

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

// ===== INTERSECTION OBSERVER — fade-in on scroll =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.step-card, .broker-block, .cmp-box, .faq-item, .stat-box, .feat-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});

document.addEventListener('DOMContentLoaded', function() {
  injectContactInfo();
  injectBrokerLinks();
  const firstBtn = document.querySelector('.broker-sel-btn.active');
  if (firstBtn) firstBtn.dataset.activeBroker = 'exness';
});

// Visible class handler
const visObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      visObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.step-card, .broker-block, .cmp-box, .faq-item, .stat-box, .feat-card').forEach(el => {
  visObserver.observe(el);
});
