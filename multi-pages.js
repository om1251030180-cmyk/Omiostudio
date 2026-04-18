(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isPointerFine = window.matchMedia('(pointer:fine)').matches;
  const THEME_KEY = 'omio_theme';

  const getStoredTheme = () => {
    try {
      const value = (localStorage.getItem(THEME_KEY) || '').toLowerCase();
      return value === 'dark' || value === 'light' ? value : '';
    } catch {
      return '';
    }
  };

  const getPreferredTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  };

  const applyTheme = (theme) => {
    const next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.textContent = next === 'dark' ? 'Light Theme' : 'Dark Theme';
  };

  const initTheme = () => {
    applyTheme(getStoredTheme() || getPreferredTheme());
  };

  const wireThemeToggle = () => {
    const topbar = document.querySelector('.topbar-inner');
    if (!topbar || document.getElementById('themeToggleBtn')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'themeToggleBtn';
    btn.className = 'link-btn theme-toggle';
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
    topbar.appendChild(btn);
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    btn.textContent = current === 'dark' ? 'Light Theme' : 'Dark Theme';
  };

  window.toggleSideRail = function toggleSideRail() {
    if (window.innerWidth <= 960) {
      document.body.classList.toggle('side-open');
      return;
    }
    document.body.classList.toggle('side-collapsed');
  };

  const revealItems = () => {
    const items = document.querySelectorAll('.fade-up');
    if (!items.length) return;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('show'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    items.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 55, 260)}ms`;
      io.observe(el);
    });
  };

  /* Enhanced scroll-triggered animations */
  const setupScrollAnimations = () => {
    if (prefersReduced || !('IntersectionObserver' in window)) return;

    const animatedElements = document.querySelectorAll(
      '.fade-in, .scale-up, .slide-left, .slide-right, .stagger-item, .hover-lift, .image-reveal'
    );
    
    if (!animatedElements.length) return;

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        
        const element = entry.target;
        const animationType = element.className;
        
        /* Stagger animations for multiple elements */
        if (element.parentElement?.classList.contains('stagger-list')) {
          const siblings = element.parentElement.querySelectorAll('.stagger-item');
          siblings.forEach((sibling, index) => {
            setTimeout(() => {
              sibling.classList.add('show');
            }, index * 100);
          });
        } else {
          element.classList.add('show');
        }
        
        animationObserver.unobserve(element);
      });
    }, { 
      threshold: 0.1, 
      rootMargin: '0px 0px -10% 0px' 
    });

    animatedElements.forEach(el => animationObserver.observe(el));
  };

  /* Text character reveal animation */
  const setupTextAnimations = () => {
    if (prefersReduced) return;

    const headings = document.querySelectorAll('h1, h2, h3');
    
    headings.forEach((heading) => {
      if (heading.classList.contains('no-animate')) return;
      
      const text = heading.textContent;
      const words = text.split(' ');
      
      heading.innerHTML = words
        .map((word, idx) => `<span class="text-reveal" style="animation-delay: ${idx * 80}ms">${word}</span>`)
        .join(' ');
    });
  };

  /* Enhanced parallax with smooth easing */
  const setupEnhancedParallax = () => {
    if (prefersReduced) return;
    
    const parallaxItems = document.querySelectorAll('[data-parallax]');
    if (!parallaxItems.length) return;

    let ticking = false;
    let lastScrollY = 0;

    const updateParallax = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const speed = window.innerWidth <= 768 ? 0.3 : 0.5;

      parallaxItems.forEach((item) => {
        const yOffset = (scrollY - item.offsetTop) * speed;
        item.style.transform = `translateY(${yOffset}px)`;
      });

      ticking = false;
    };

    const onScroll = () => {
      lastScrollY = window.scrollY || window.pageYOffset;
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();
  };

  /* Smooth scroll snap */
  const setupScrollSnap = () => {
    const sections = document.querySelectorAll('.section, [data-snap]');
    if (!sections.length) return;

    let isScrolling = false;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
      if (isScrolling) return;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 100);
    }, { passive: true });
  };

  /* Mouse position tracker for enhanced interactions */
  const setupMouseTracker = () => {
    if (prefersReduced || !isPointerFine) return;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      /* Update gloss effect on cards */
      const cards = document.querySelectorAll('.card[data-gloss]');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = mouseX - rect.left;
        const y = mouseY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  };

  /* Smooth number animation for counters */
  const setupCounterAnimations = () => {
    const counters = document.querySelectorAll('.counter, [data-count]');
    if (!counters.length) return;

    const animateCounter = (element) => {
      const target = parseInt(element.dataset.count || element.textContent);
      if (!target || isNaN(target)) return;

      let current = 0;
      const increment = target / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target;
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current);
        }
      }, 30);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  };

  /* Smooth scroll to anchor */
  const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  /* Reveal cards on scroll with stagger */
  const setupCardReveal = () => {
    const cardContainers = document.querySelectorAll('.grid, [data-card-container]');
    if (!cardContainers.length) return;

    cardContainers.forEach((container) => {
      const cards = container.querySelectorAll('.card');
      if (!cards.length) return;

      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 100);
          });

          cardObserver.unobserve(container);
        });
      }, { threshold: 0.1 });

      cardObserver.observe(container);
    });
  };

  const wireTransitions = () => {
    document.querySelectorAll('a[data-nav]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#')) return;
        if (prefersReduced) return;
        e.preventDefault();
        document.body.style.opacity = '0.85';
        document.body.style.transform = 'translateY(6px)';
        document.body.style.transition = 'all .25s ease';
        setTimeout(() => {
          window.location.href = href;
        }, 180);
      });
    });
  };

  const resetBodyTransitionState = () => {
    document.body.style.opacity = '';
    document.body.style.transform = '';
    document.body.style.transition = '';
  };

  const setActiveRailLink = () => {
    const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.rail-nav a.rail-btn').forEach((a) => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === current) a.classList.add('active');
      else a.classList.remove('active');
    });
  };

  const wireCardTilt = () => {
    if (prefersReduced || !isPointerFine) return;
    const cards = document.querySelectorAll('.card[data-tilt]');
    cards.forEach((card) => {
      const className = card.className;
      const baseTilt = className.includes('tilt-soft-left')
        ? ' rotate(-1.3deg)'
        : className.includes('tilt-soft-right')
          ? ' rotate(1.3deg)'
          : className.includes('tilt-left')
            ? ' rotate(-2.4deg)'
            : className.includes('tilt-right')
              ? ' rotate(2.4deg)'
              : '';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 6;
        const ry = (px - 0.5) * 8;
        card.style.transform = `perspective(950px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)${baseTilt}`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = baseTilt ? baseTilt.trim() : '';
      });
    });
  };

  const wireScrollParallax = () => {
    if (prefersReduced) return;
    const layers = [...document.querySelectorAll('.parallax-layer')];
    if (!layers.length) return;

    const PRESETS = { subtle: 0.7, medium: 1, bold: 1.35 };
    let preset = 'medium';
    try {
      preset = (localStorage.getItem('omio_parallax_preset') || document.body.dataset.parallaxPreset || 'medium').toLowerCase();
    } catch {
      preset = (document.body.dataset.parallaxPreset || 'medium').toLowerCase();
    }

    const getFactor = () => PRESETS[preset] || PRESETS.medium;

    let ticking = false;
    const update = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const scale = window.innerWidth <= 768 ? 0.45 : 1;
      const factor = getFactor();
      layers.forEach((el) => {
        const speed = Number(el.getAttribute('data-parallax-speed') || '0.1');
        el.style.setProperty('--parallax-y', `${Math.round(y * speed * scale * factor)}px`);
      });
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    window.setParallaxPreset = (nextPreset) => {
      const normalized = String(nextPreset || '').toLowerCase();
      if (!PRESETS[normalized]) return;
      preset = normalized;
      try {
        localStorage.setItem('omio_parallax_preset', normalized);
      } catch {}
      update();
    };
  };

  const wireMagneticButtons = () => {
    if (prefersReduced || !isPointerFine) return;
    const targets = document.querySelectorAll('.link-btn, .rail-btn, .rail-logo');
    targets.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  };

  const wireDismissSideRail = () => {
    document.addEventListener('click', (e) => {
      if (window.innerWidth > 960 || !document.body.classList.contains('side-open')) return;
      const side = document.querySelector('.side-rail');
      if (!side) return;
      const isToggle = e.target.closest('.rail-btn, .rail-logo');
      if (isToggle) return;
      if (!side.contains(e.target)) document.body.classList.remove('side-open');
    });
  };

  const wirePageProgress = () => {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    let ticking = false;
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const current = Math.max(0, window.scrollY || window.pageYOffset || 0);
      const p = Math.min(100, Math.round((current / max) * 100));
      topbar.style.setProperty('--scroll-progress', `${p}%`);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  };

  window.addEventListener('resize', () => {
    isPointerFine = window.matchMedia('(pointer:fine)').matches;
    if (window.innerWidth > 960) {
      document.body.classList.remove('side-open');
    }
  });

  const wireSearchToggle = () => {
    const searchBox = document.querySelector('.search');
    if (!searchBox) return;

    const input = searchBox.querySelector('input');
    if (!input) return;

    // Toggle search on icon click
    searchBox.addEventListener('click', (e) => {
      if (e.target === input) return; // Don't toggle if clicking on input
      searchBox.classList.add('active');
      input.focus();
    });

    // Close on escape or blur
    input.addEventListener('blur', () => {
      if (!input.value) {
        searchBox.classList.remove('active');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchBox.classList.remove('active');
        input.value = '';
        input.blur();
      }
    });
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.body.classList.remove('side-open');
    }
  });

  window.addEventListener('pageshow', resetBodyTransitionState);
  window.addEventListener('focus', resetBodyTransitionState);
  setTimeout(resetBodyTransitionState, 420);

  /* Initialize all animations */
  revealItems();
  initTheme();
  wireThemeToggle();
  wireTransitions();
  setActiveRailLink();
  wireCardTilt();
  wireScrollParallax();
  wireMagneticButtons();
  wireDismissSideRail();
  wirePageProgress();
  wireSearchToggle();
  
  /* New Apple-style animations */
  setupScrollAnimations();
  setupTextAnimations();
  setupEnhancedParallax();
  setupScrollSnap();
  setupMouseTracker();
  setupCounterAnimations();
  setupSmoothScroll();
  setupCardReveal();
})();
