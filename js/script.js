(function () {
  'use strict';

  /* ============================================================
     LANGUAGE TOGGLE
  ============================================================ */
  var LANG_KEY = 'siteLang';
  var translatable = document.querySelectorAll('[data-tr]');
  var placeholderEls = document.querySelectorAll('[data-tr-placeholder]');
  var langToggleBtn = document.getElementById('langToggle');
  var langOptions = document.querySelectorAll('.lang-toggle__option');

  /* ---- WhatsApp deep links ---- */
  var whatsappLinks = document.querySelectorAll('.js-whatsapp-link');
  var whatsappNumber = (document.body.getAttribute('data-whatsapp-number') || '').replace(/\D/g, '');
  var whatsappMessages = {
    tr: 'Merhaba, Arnavutluk’a taşınma süreciyle ilgili bilgi almak istiyorum.',
    en: 'Hello, I would like more information about relocating to Albania.'
  };

  function updateWhatsappLinks(lang) {
    if (!whatsappNumber || !whatsappLinks.length) return;
    var text = encodeURIComponent(whatsappMessages[lang] || whatsappMessages.tr);
    var url = 'https://wa.me/' + whatsappNumber + '?text=' + text;
    whatsappLinks.forEach(function (link) {
      link.setAttribute('href', url);
    });
    var floatBtn = document.getElementById('whatsappFloat');
    if (floatBtn) {
      var ariaVal = floatBtn.getAttribute('data-' + lang + '-aria');
      if (ariaVal) floatBtn.setAttribute('aria-label', ariaVal);
    }
  }

  function applyLanguage(lang) {
    translatable.forEach(function (el) {
      var val = el.getAttribute('data-' + lang);
      if (val !== null) el.innerHTML = val;
    });
    placeholderEls.forEach(function (el) {
      var val = el.getAttribute('data-' + lang + '-placeholder');
      if (val !== null) el.setAttribute('placeholder', val);
    });
    langOptions.forEach(function (opt) {
      opt.classList.toggle('is-active', opt.getAttribute('data-lang') === lang);
    });
    updateWhatsappLinks(lang);
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  function getStoredLanguage() {
    try {
      return localStorage.getItem(LANG_KEY);
    } catch (e) {
      return null;
    }
  }

  var currentLang = getStoredLanguage() || 'tr';
  applyLanguage(currentLang);

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      currentLang = currentLang === 'tr' ? 'en' : 'tr';
      applyLanguage(currentLang);
    });
  }

  /* ============================================================
     MOBILE NAV DRAWER
  ============================================================ */
  var hamburger = document.getElementById('hamburger');
  var mobileDrawer = document.getElementById('mobileDrawer');

  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('is-open');
      mobileDrawer.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileDrawer.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        mobileDrawer.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ============================================================
     NAVBAR SCROLL STATE
  ============================================================ */
  var navbar = document.getElementById('navbar');
  function updateNavbarState() {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNavbarState, { passive: true });
  updateNavbarState();

  /* ============================================================
     FOOTER YEAR
  ============================================================ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     CONTACT FORM: forwards the submission to WhatsApp + email
     (no backend/server; the visitor's own WhatsApp and mail app
     send the message, pre-filled with the form's contents)
  ============================================================ */
  var contactForm = document.getElementById('contactForm');
  var formNote = document.getElementById('formNote');
  var contactEmail = document.body.getAttribute('data-contact-email') || '';

  var contactFormCopy = {
    tr: {
      intro: 'Web sitesi iletişim formundan yeni bir talep:',
      name: 'Ad Soyad',
      email: 'E-posta',
      phone: 'Telefon',
      message: 'Mesaj',
      subject: 'Web sitesinden yeni iletişim formu'
    },
    en: {
      intro: 'New inquiry from the website contact form:',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      subject: 'New contact form submission'
    }
  };

  function buildContactSummary(data, lang) {
    var copy = contactFormCopy[lang] || contactFormCopy.tr;
    var lines = [copy.intro, '', copy.name + ': ' + data.name, copy.email + ': ' + data.email];
    if (data.phone) lines.push(copy.phone + ': ' + data.phone);
    lines.push('', copy.message + ':', data.message);
    return lines.join('\n');
  }

  function openInNewTab(url) {
    var link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function openMailClient(url) {
    var link = document.createElement('a');
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = {
        name: (document.getElementById('name') || {}).value || '',
        email: (document.getElementById('email') || {}).value || '',
        phone: (document.getElementById('phone') || {}).value || '',
        message: (document.getElementById('message') || {}).value || ''
      };
      var copy = contactFormCopy[currentLang] || contactFormCopy.tr;
      var summary = buildContactSummary(data, currentLang);

      if (contactEmail) {
        var mailUrl =
          'mailto:' + contactEmail +
          '?subject=' + encodeURIComponent(copy.subject) +
          '&body=' + encodeURIComponent(summary);
        openMailClient(mailUrl);
      }

      if (whatsappNumber) {
        openInNewTab('https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(summary));
      }

      if (formNote) formNote.hidden = false;
      contactForm.reset();
    });
  }

  /* ============================================================
     THREE.JS: HERO PARTICLE FIELD
  ============================================================ */
  function initHeroParticles() {
    var canvas = document.getElementById('hero-canvas');
    var fallback = document.querySelector('.hero__gradient-fallback');
    if (!canvas) return;

    var supportsWebGL = false;
    try {
      var testCanvas = document.createElement('canvas');
      supportsWebGL = !!(window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
    } catch (e) {
      supportsWebGL = false;
    }

    if (!supportsWebGL || typeof THREE === 'undefined') {
      if (fallback) fallback.style.opacity = '1';
      return;
    }

    var hero = document.querySelector('.hero');
    var width = hero.clientWidth;
    var height = hero.clientHeight;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 60;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (e) {
      if (fallback) fallback.style.opacity = '1';
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var particleCount = width < 768 ? 220 : 450;
    var positions = new Float32Array(particleCount * 3);
    var speeds = new Float32Array(particleCount);
    var swaySeed = new Float32Array(particleCount);

    for (var i = 0; i < particleCount; i++) {
      var ix = i * 3;
      positions[ix] = (Math.random() - 0.5) * 140;
      positions[ix + 1] = (Math.random() - 0.5) * 100;
      positions[ix + 2] = (Math.random() - 0.5) * 100;
      speeds[i] = 0.02 + Math.random() * 0.06;
      swaySeed[i] = Math.random() * Math.PI * 2;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    var material = new THREE.PointsMaterial({
      color: new THREE.Color(0xc9a84c),
      size: 0.55,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      sizeAttenuation: true
    });

    var points = new THREE.Points(geometry, material);
    scene.add(points);

    var clock = new THREE.Clock();
    var rafId;
    var isVisible = true;

    function animate() {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      var elapsed = clock.getElapsedTime();
      var posAttr = geometry.attributes.position;

      for (var p = 0; p < particleCount; p++) {
        var idx = p * 3;
        posAttr.array[idx + 1] += speeds[p];
        posAttr.array[idx] += Math.sin(elapsed * 0.3 + swaySeed[p]) * 0.006;

        if (posAttr.array[idx + 1] > 55) {
          posAttr.array[idx + 1] = -55;
        }
      }
      posAttr.needsUpdate = true;

      points.rotation.y = elapsed * 0.015;
      renderer.render(scene, camera);
    }
    animate();

    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        width = hero.clientWidth;
        height = hero.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }, 150);
    });

    document.addEventListener('visibilitychange', function () {
      isVisible = document.visibilityState === 'visible';
    });
  }

  initHeroParticles();

  /* ============================================================
     GSAP ANIMATIONS
  ============================================================ */
  function initGsapAnimations() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* ---- Navbar fade-in on load ---- */
    gsap.to('#navbar', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay: 0.3,
      ease: 'power2.out'
    });
    gsap.set('#navbar', { y: -20 });

    /* ---- Hero heading / subheading word stagger ---- */
    function splitIntoWords(el) {
      if (!el) return [];
      var text = el.textContent.trim();
      var words = text.split(/\s+/);
      el.innerHTML = words
        .map(function (w) {
          return '<span class="word-wrap"><span class="word">' + w + '</span></span>';
        })
        .join(' ');
      return el.querySelectorAll('.word');
    }

    var headingWords = splitIntoWords(document.getElementById('heroHeading'));
    var subWords = splitIntoWords(document.getElementById('heroSubheading'));

    gsap.set(headingWords, { yPercent: 120, opacity: 0 });
    gsap.set(subWords, { yPercent: 120, opacity: 0 });
    gsap.set('.hero__ctas', { opacity: 0, y: 20 });
    gsap.set('.hero__scroll-indicator', { opacity: 0 });

    var heroTl = gsap.timeline({ delay: 0.4 });
    heroTl
      .to(headingWords, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      })
      .to(
        subWords,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out'
        },
        '-=0.3'
      )
      .to('.hero__ctas', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      .to('.hero__scroll-indicator', { opacity: 1, duration: 0.6 }, '-=0.2');

    /* ---- WhatsApp float button entrance ---- */
    gsap.set('.whatsapp-float', { opacity: 0, scale: 0.6, y: 20 });
    gsap.to('.whatsapp-float', {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      delay: 1.4,
      ease: 'back.out(1.7)'
    });

    /* ---- Generic reveal: fade up + slight scale on scroll ---- */
    gsap.utils.toArray('.reveal').forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 55%',
            scrub: 1
          }
        }
      );
    });

    /* ---- Section headers (not already tagged .reveal) ---- */
    gsap.utils.toArray('.section-header').forEach(function (el) {
      if (el.classList.contains('reveal')) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 55%',
            scrub: 1
          }
        }
      );
    });

    /* ---- Service cards: scale 0.95 -> 1, staggered ---- */
    gsap.fromTo(
      '.service-card',
      { opacity: 0, scale: 0.95, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.services__grid',
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: 1
        }
      }
    );

    /* ---- Step cards stagger ---- */
    gsap.fromTo(
      '.step',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.steps',
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: 1
        }
      }
    );

    /* ---- Stats count-up ---- */
    var statNumbers = document.querySelectorAll('.stat__number');
    statNumbers.forEach(function (el) {
      if (!el.hasAttribute('data-count')) return;
      var target = parseFloat(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var counter = { val: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(counter, {
            val: target,
            duration: 1.8,
            ease: 'power1.out',
            onUpdate: function () {
              el.textContent = Math.floor(counter.val) + suffix;
            },
            onComplete: function () {
              el.textContent = target + suffix;
            }
          });
        }
      });
    });

    /* ---- Trust ticker marquee ---- */
    var track = document.getElementById('tickerTrack');
    if (track) {
      track.innerHTML += track.innerHTML;
      var totalWidth = track.scrollWidth / 2;
      gsap.to(track, {
        x: -totalWidth,
        duration: 32,
        ease: 'none',
        repeat: -1
      });
    }

    ScrollTrigger.refresh();
  }

  window.addEventListener('load', initGsapAnimations);
})();
