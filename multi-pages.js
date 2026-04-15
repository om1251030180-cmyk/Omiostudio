(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isPointerFine = window.matchMedia('(pointer:fine)').matches;

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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.body.classList.remove('side-open');
    }
  });

  revealItems();
  wireTransitions();
  setActiveRailLink();
  wireCardTilt();
  wireScrollParallax();
  wireMagneticButtons();
  wireDismissSideRail();
  wirePageProgress();
})();
