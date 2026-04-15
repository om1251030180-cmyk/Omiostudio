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

  const parseFrameList = (value) => {
    if (!value) return [];
    return String(value)
      .split(/[|,\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const loadImage = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });

  const loadSequenceConfig = async () => {
    const inline = window.OMIO_SEQUENCE_PARALLAX || null;
    const data = document.body?.dataset || {};

    let config = inline ? { ...inline } : {};
    if (!config.frameUrls?.length && data.sequenceFrames) {
      config.frameUrls = parseFrameList(data.sequenceFrames);
    }
    if (!config.sectionSelector && data.sequenceSection) {
      config.sectionSelector = data.sequenceSection;
    }
    if (!config.intensity && data.sequenceIntensity) {
      config.intensity = data.sequenceIntensity;
    }
    if (!config.imageUrl && data.sequenceImage) {
      config.imageUrl = data.sequenceImage;
    }

    const manifestUrl = config.manifestUrl || data.sequenceManifest;
    if (manifestUrl) {
      try {
        const res = await fetch(manifestUrl, { credentials: 'same-origin' });
        if (res.ok) {
          const manifest = await res.json();
          config = { ...manifest, ...config };
          if (!config.frameUrls?.length && Array.isArray(manifest.frames)) {
            config.frameUrls = manifest.frames;
          }
        }
      } catch {
        // Graceful fallback when manifest isn't available.
      }
    }

    const urls = Array.isArray(config.frameUrls) ? config.frameUrls.filter(Boolean) : [];
    if (!urls.length && config.imageUrl) {
      urls.push(config.imageUrl);
    }
    if (!urls.length) return null;

    const lowPowerDevice =
      (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

    return {
      enabled: config.enabled !== false,
      frameUrls: urls,
      sectionSelector: config.sectionSelector || '.main',
      hideDefaultLayers: config.hideDefaultLayers !== false,
      intensity: String(config.intensity || (lowPowerDevice ? 'subtle' : 'medium')).toLowerCase(),
      opacityLight: Number.isFinite(config.opacityLight) ? config.opacityLight : 0.34,
      opacityDark: Number.isFinite(config.opacityDark) ? config.opacityDark : 0.28,
      maxDpr: Number.isFinite(config.maxDpr) ? config.maxDpr : (lowPowerDevice ? 1.25 : 1.7),
      pointerEnabled: config.pointerEnabled !== false && !lowPowerDevice,
      layerCount: Number.isFinite(config.layerCount) ? Math.max(1, Math.min(3, config.layerCount)) : (lowPowerDevice ? 2 : 3),
    };
  };

  const wireSequenceParallax = async () => {
    if (prefersReduced) return;

    const config = await loadSequenceConfig();
    if (!config || !config.enabled) return;

    const section = document.querySelector(config.sectionSelector) || document.body;
    if (!section) return;

    const intensityMap = {
      subtle: { pointer: 8, drift: 14, depth: [0.03, 0.015, 0] },
      medium: { pointer: 14, drift: 22, depth: [0.06, 0.03, 0] },
      bold: { pointer: 22, drift: 34, depth: [0.1, 0.05, 0] },
    };
    const intensity = intensityMap[config.intensity] || intensityMap.medium;

    const root = document.createElement('div');
    root.className = 'sequence-parallax-bg';
    const canvas = document.createElement('canvas');
    canvas.className = 'sequence-parallax-canvas';
    root.appendChild(canvas);
    document.body.prepend(root);
    document.body.classList.add('sequence-parallax-active');
    if (!config.hideDefaultLayers) {
      document.body.classList.remove('sequence-parallax-active');
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const frames = [];
    const framePromises = config.frameUrls.map((url) => loadImage(url).catch(() => null));
    const loaded = await Promise.all(framePromises);
    loaded.forEach((img) => {
      if (img) frames.push(img);
    });
    if (!frames.length) {
      root.remove();
      document.body.classList.remove('sequence-parallax-active');
      return;
    }

    let raf = 0;
    let pointerX = 0;
    let pointerY = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, config.maxDpr || 1.7);
      const w = Math.max(1, Math.round(window.innerWidth));
      const h = Math.max(1, Math.round(window.innerHeight));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const getScrollProgress = () => {
      const rect = section.getBoundingClientRect();
      const start = window.scrollY + rect.top - window.innerHeight * 0.82;
      const distance = Math.max(1, rect.height + window.innerHeight * 0.55);
      const raw = (window.scrollY - start) / distance;
      return Math.max(0, Math.min(1, raw));
    };

    const drawFrameCover = (img, x, y, scaleBoost, alpha) => {
      const vw = canvas.width / (window.devicePixelRatio || 1);
      const vh = canvas.height / (window.devicePixelRatio || 1);
      const sw = img.naturalWidth || img.width;
      const sh = img.naturalHeight || img.height;
      if (!sw || !sh) return;
      const coverScale = Math.max(vw / sw, vh / sh) * (1 + scaleBoost);
      const dw = sw * coverScale;
      const dh = sh * coverScale;
      const dx = (vw - dw) / 2 + x;
      const dy = (vh - dh) / 2 + y;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const render = () => {
      raf = 0;
      const theme = document.documentElement.getAttribute('data-theme') || 'light';
      const baseOpacity = theme === 'dark' ? config.opacityDark : config.opacityLight;
      const progress = getScrollProgress();
      const frameIndex = Math.min(frames.length - 1, Math.max(0, Math.round(progress * (frames.length - 1))));
      const frame = frames[frameIndex];

      const vw = canvas.width / (window.devicePixelRatio || 1);
      const vh = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, vw, vh);

      const scrollOsc = Math.sin(progress * Math.PI * 2) * intensity.drift;
      const px = (pointerX - 0.5) * intensity.pointer;
      const py = (pointerY - 0.5) * intensity.pointer;

      if (config.layerCount >= 3) {
        drawFrameCover(frame, px + scrollOsc, py, intensity.depth[0], baseOpacity * 0.3);
      }
      if (config.layerCount >= 2) {
        drawFrameCover(frame, px * 0.6 + scrollOsc * 0.55, py * 0.6, intensity.depth[1], baseOpacity * 0.52);
      }
      drawFrameCover(frame, px * 0.3 + scrollOsc * 0.3, py * 0.3, intensity.depth[2], baseOpacity);
      ctx.globalAlpha = 1;
    };

    const requestRender = () => {
      if (raf) return;
      raf = requestAnimationFrame(render);
    };

    window.addEventListener('resize', () => {
      resize();
      requestRender();
    });

    window.addEventListener('scroll', requestRender, { passive: true });

    if (isPointerFine && config.pointerEnabled) {
      window.addEventListener('mousemove', (e) => {
        pointerX = e.clientX / Math.max(1, window.innerWidth);
        pointerY = e.clientY / Math.max(1, window.innerHeight);
        requestRender();
      });
    }

    resize();
    requestRender();
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

  window.addEventListener('pageshow', resetBodyTransitionState);
  window.addEventListener('focus', resetBodyTransitionState);
  setTimeout(resetBodyTransitionState, 420);

  revealItems();
  initTheme();
  wireThemeToggle();
  wireTransitions();
  setActiveRailLink();
  wireCardTilt();
  wireScrollParallax();
  wireSequenceParallax();
  wireMagneticButtons();
  wireDismissSideRail();
  wirePageProgress();
})();
