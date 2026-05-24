export function initReveal(root: Document | HTMLElement = document): void {
  const els = root.querySelectorAll<HTMLElement>('.reveal');
  if (!els.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const delay = Number(el.dataset.delay ?? 0);
        window.setTimeout(() => el.classList.add('is-visible'), delay);
        io.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  els.forEach((el) => io.observe(el));
}

export function initProgressBar(): void {
  const bar = document.querySelector<HTMLElement>('.progress-bar');
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = `${scrolled}%`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

export function initParallax(): void {
  const layers = document.querySelectorAll<HTMLElement>('[data-parallax]');
  if (!layers.length) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      layers.forEach((layer) => {
        const speed = Number(layer.dataset.parallax ?? 0.2);
        layer.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

export function initCursor(): void {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (document.querySelector('.cursor-dot')) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`;
  });

  const tick = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate3d(${rx - 19}px, ${ry - 19}px, 0)`;
    requestAnimationFrame(tick);
  };
  tick();

  const applyHover = () => {
    document.querySelectorAll<HTMLElement>('a, button, [role="button"], input, textarea, select, .dish-btn, .filter-chip, .filter-chip-block, [data-hover-zone]').forEach((el) => {
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = '1';
      el.addEventListener('mouseenter', () => {
        ring.classList.add('is-hover');
        dot.classList.add('is-hover');
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('is-hover');
        dot.classList.remove('is-hover');
      });
    });
  };
  applyHover();
  const mo = new MutationObserver(() => applyHover());
  mo.observe(document.body, { childList: true, subtree: true });
}

export function initMagnetic(): void {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll<HTMLElement>('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

export function initTilt(): void {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * -10;
      const ry = (px - 0.5) * 10;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

export function initSplitText(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const targets = document.querySelectorAll<HTMLElement>('[data-split]');
  targets.forEach((el) => {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? '';
        const frag = document.createDocumentFragment();
        for (const ch of text) {
          if (ch === ' ') {
            frag.appendChild(document.createTextNode(' '));
          } else {
            const span = document.createElement('span');
            span.className = 'split-char';
            span.textContent = ch;
            frag.appendChild(span);
          }
        }
        node.parentNode?.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = (node as HTMLElement).tagName;
        if (tag === 'BR') return;
        Array.from(node.childNodes).forEach(walk);
      }
    };
    Array.from(el.childNodes).forEach(walk);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const chars = entry.target.querySelectorAll<HTMLElement>('.split-char');
      chars.forEach((c, i) => {
        window.setTimeout(() => c.classList.add('is-in'), i * 22);
      });
      io.unobserve(entry.target);
    });
  }, { threshold: 0.25 });
  targets.forEach((el) => io.observe(el));
}

export function initCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>('[data-counter]');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      const target = Number(el.dataset.counter ?? 0);
      const duration = Number(el.dataset.duration ?? 1800);
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('pt-BR');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach((c) => io.observe(c));
}
