/* ============================================================
   EXPEDIENTE 2026-LV-001 — LÓGICA DE LA APLICACIÓN
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /* ----------------------------------------------------------
     SONIDO DE TECLEO (sintetizado, sin archivos externos)
     ---------------------------------------------------------- */
  let audioCtx = null;
  let noiseBuffer = null;

  function getAudioCtx() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function getNoiseBuffer(ctx) {
    if (noiseBuffer) return noiseBuffer;
    const duration = 0.05;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noiseBuffer = buffer;
    return noiseBuffer;
  }

  // Click percusivo (ruido filtrado), no un tono: se siente como una
  // tecla mecánica en vez de un "beep" sintético.
  function playTypeClick() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200 + Math.random() * 1200, t);
    filter.Q.value = 1.1;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.03);
  }

  // Si el navegador bloqueó el audio por política de autoplay,
  // se reactiva en la primera interacción del usuario con la página.
  ['pointerdown', 'keydown'].forEach((evt) => {
    window.addEventListener(evt, () => getAudioCtx(), { once: true });
  });

  // Typed.js (2.1.0) no expone un callback por carácter, así que
  // detectamos cada letra insertada observando mutaciones del DOM.
  function attachTypingSound(el) {
    let lastLength = el.textContent.length;
    const observer = new MutationObserver(() => {
      const currentLength = el.textContent.length;
      if (currentLength > lastLength) playTypeClick();
      lastLength = currentLength;
    });
    observer.observe(el, { characterData: true, childList: true, subtree: true });
    return observer;
  }

  /* ----------------------------------------------------------
     PARTÍCULAS DE FONDO
     ---------------------------------------------------------- */
  (function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.min(70, Math.floor((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        o: Math.random() * 0.35 + 0.08,
        gold: Math.random() > 0.75
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(212, 175, 55, ${p.o})`
          : `rgba(255, 255, 255, ${p.o})`;
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize);
    resize();
    tick();
  })();

  /* ----------------------------------------------------------
     NAVEGACIÓN ENTRE PANTALLAS
     ---------------------------------------------------------- */
  function goTo(id) {
    const current = document.querySelector('.screen.active');
    const next = document.getElementById(id);
    if (!next || current === next) return;

    if (current) {
      gsap.to(current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => current.classList.remove('active')
      });
    }
    next.classList.add('active');
    gsap.fromTo(
      next,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, delay: current ? 0.35 : 0, ease: 'power2.out' }
    );
  }

  // Transición lenta y cinematográfica específica entre el login y el
  // arranque del sistema: un respiro en negro antes de que aparezca la
  // terminal, en vez de un corte directo.
  function goToLoadingFromLogin() {
    const current = document.getElementById('screen-login');
    const next = document.getElementById('screen-loading');

    gsap.to(current, {
      opacity: 0,
      y: -16,
      duration: 1.1,
      ease: 'power2.in',
      onComplete: () => current.classList.remove('active')
    });

    next.classList.add('active');
    gsap.fromTo(
      next,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.3,
        delay: 0.9,
        ease: 'power2.out',
        onComplete: runBootSequence
      }
    );
  }

  /* ----------------------------------------------------------
     1. SECUENCIA DE ARRANQUE (TERMINAL + TYPED.JS)
     ---------------------------------------------------------- */
  const bootLines = [
    'Inicializando sistema...',
    'Conectando con servidor judicial...',
    'Buscando expediente ' + CONFIG.caso.numero + '...',
    'Validando permisos de acceso...',
    'Acceso autorizado.'
  ];

  function runBootSequence() {
    const bootLog = document.getElementById('boot-log');

    function typeLine(i) {
      if (i >= bootLines.length) {
        setTimeout(() => {
          populateCaseFile();
          goTo('screen-case-file');
        }, 750);
        return;
      }

      const lineEl = document.createElement('div');
      lineEl.className = 'log-line';
      bootLog.appendChild(lineEl);

      const isLast = i === bootLines.length - 1;
      const soundObserver = attachTypingSound(lineEl);

      new Typed(lineEl, {
        strings: [bootLines[i]],
        typeSpeed: 38,
        showCursor: true,
        cursorChar: '▌',
        onComplete: (self) => {
          soundObserver.disconnect();
          if (isLast) lineEl.classList.add('ok');
          if (self.cursor) self.cursor.remove();
          setTimeout(() => typeLine(i + 1), isLast ? 0 : 550);
        }
      });
    }

    typeLine(0);
  }

  /* ----------------------------------------------------------
     2. EXPEDIENTE
     ---------------------------------------------------------- */
  function populateCaseFile() {
    document.getElementById('case-number').textContent = `Caso No. ${CONFIG.caso.numero}`;
    document.getElementById('case-demandante').textContent = CONFIG.caso.demandante;
    document.getElementById('case-jueza').textContent = CONFIG.caso.jueza;
    document.getElementById('case-estado').textContent = CONFIG.caso.estado;
    document.getElementById('case-nivel').textContent = CONFIG.caso.nivel;

    gsap.fromTo(
      '.case-row',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.22, delay: 0.5, ease: 'power2.out' }
    );
  }

  document.getElementById('btn-open-file').addEventListener('click', () => {
    buildIntro();
    goTo('screen-intro');
  });

  /* ----------------------------------------------------------
     3. INTRODUCCIÓN
     ---------------------------------------------------------- */
  function buildIntro() {
    const container = document.getElementById('intro-text');
    container.innerHTML = '';
    CONFIG.intro.parrafos.forEach((texto) => {
      const p = document.createElement('p');
      p.textContent = texto;
      container.appendChild(p);
    });
    gsap.fromTo(
      '#intro-text p',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 1.1, stagger: 0.55, delay: 0.5, ease: 'power2.out' }
    );
  }

  document.getElementById('btn-start-evidence').addEventListener('click', () => {
    evidenceIndex = 0;
    loadEvidence(evidenceIndex);
    goTo('screen-evidence');
  });

  /* ----------------------------------------------------------
     4. EVIDENCIAS
     ---------------------------------------------------------- */
  let evidenceIndex = 0;
  const totalEvidencias = CONFIG.evidencias.length;
  let evidenceBusy = false;
  let evidenceLoadToken = 0;

  // Precarga y cachea cada foto una sola vez. Se dispara para todas las
  // evidencias desde el arranque (hay varias pantallas de por medio antes
  // de llegar a la primera evidencia, así que ese tiempo se aprovecha
  // para descargar en segundo plano) y de nuevo por seguridad al mostrar
  // cada evidencia, para no depender de que la precarga ya haya terminado.
  const evidenceImageCache = {};

  function preloadEvidenceImage(src) {
    if (!src) return Promise.resolve(null);
    if (evidenceImageCache[src]) return evidenceImageCache[src];
    const promise = new Promise((resolve) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = () => resolve(null);
      im.src = src;
    });
    evidenceImageCache[src] = promise;
    return promise;
  }

  CONFIG.evidencias.forEach((ev) => preloadEvidenceImage(ev.imagen));

  function loadEvidence(i) {
    const ev = CONFIG.evidencias[i];
    const img = document.getElementById('evidence-photo');
    const frame = document.querySelector('.evidence-photo-frame');
    const stamp = document.getElementById('evidence-stamp');
    const token = ++evidenceLoadToken;

    frame.classList.add('loading');
    img.classList.add('hidden');
    gsap.set(img, { opacity: 0 });

    document.getElementById('evidence-title').textContent = ev.titulo;
    document.getElementById('evidence-story').textContent = ev.historia;
    document.getElementById('evidence-progress-label').textContent =
      `Evidencia ${i + 1} de ${totalEvidencias}`;

    gsap.set(stamp, { opacity: 0, scale: 0 });
    gsap.to('#evidence-progress-fill', {
      width: `${(i / totalEvidencias) * 100}%`,
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.fromTo(
      ['#evidence-title', '#evidence-story'],
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.3, delay: 0.2, ease: 'power2.out' }
    );

    preloadEvidenceImage(ev.imagen).then((loadedImg) => {
      // Si el usuario ya avanzó a otra evidencia mientras esta cargaba,
      // no pisar lo que se está mostrando ahora.
      if (token !== evidenceLoadToken) return;
      frame.classList.remove('loading');
      if (!loadedImg) {
        img.classList.add('hidden');
        return;
      }
      img.src = ev.imagen;
      img.alt = ev.titulo;
      img.classList.remove('hidden');
      gsap.to(img, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    });

    // Adelanta la descarga de la siguiente evidencia mientras se lee esta.
    const next = CONFIG.evidencias[i + 1];
    if (next) preloadEvidenceImage(next.imagen);
  }

  // ---- Lightbox: ver la foto de la evidencia en grande ----
  const lightbox = document.getElementById('evidence-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('active');
    gsap.fromTo(
      lightboxImg,
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  document.getElementById('evidence-photo').addEventListener('click', (e) => {
    if (e.target.classList.contains('hidden') || !e.target.src) return;
    openLightbox(e.target.src, e.target.alt);
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function playStamp() {
    return new Promise((resolve) => {
      const stamp = document.getElementById('evidence-stamp');
      gsap.timeline({ onComplete: resolve })
        .to(stamp, { opacity: 1, scale: 1.15, rotate: -14, duration: 0.35, ease: 'power2.out' })
        .to(stamp, { scale: 1, duration: 0.25, ease: 'power2.out' })
        .to(stamp, {}, '+=0.7')
        .to(stamp, { opacity: 0, duration: 0.3 });
    });
  }

  document.getElementById('btn-continue-evidence').addEventListener('click', async () => {
    if (evidenceBusy) return;
    evidenceBusy = true;

    await playStamp();

    evidenceIndex += 1;
    if (evidenceIndex < totalEvidencias) {
      loadEvidence(evidenceIndex);
      evidenceBusy = false;
    } else {
      gsap.to('#evidence-progress-fill', { width: '100%', duration: 0.4 });
      await wait(400);
      buildTimeline();
      goTo('screen-timeline');
      evidenceBusy = false;
    }
  });

  /* ----------------------------------------------------------
     5. LÍNEA DEL TIEMPO
     ---------------------------------------------------------- */
  function buildTimeline() {
    const container = document.getElementById('timeline-container');
    container.innerHTML = '';
    CONFIG.timeline.forEach((item) => {
      const el = document.createElement('div');
      el.className = 'timeline-item';
      el.innerHTML = `
        <span class="timeline-date">${item.fecha}</span>
        <div class="timeline-title">${item.titulo}</div>
        <div class="timeline-desc">${item.descripcion}</div>
      `;
      container.appendChild(el);
    });
    gsap.fromTo(
      '.timeline-item',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.45, delay: 0.4, ease: 'power2.out' }
    );
  }

  document.getElementById('btn-timeline-continue').addEventListener('click', () => {
    buildAlegato();
    goTo('screen-alegato');
  });

  /* ----------------------------------------------------------
     6. ALEGATO FINAL
     ---------------------------------------------------------- */
  function buildAlegato() {
    document.getElementById('alegato-titulo').textContent = CONFIG.alegato.titulo;
    const container = document.getElementById('alegato-text');
    container.innerHTML = '';
    CONFIG.alegato.parrafos.forEach((texto) => {
      const p = document.createElement('p');
      p.textContent = texto;
      container.appendChild(p);
    });
    gsap.fromTo(
      '#alegato-text p',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.7, delay: 0.5, ease: 'power2.out' }
    );
  }

  document.getElementById('btn-alegato-continue').addEventListener('click', () => {
    goTo('screen-sentencia');
    runSentencia();
  });

  /* ----------------------------------------------------------
     7. SENTENCIA
     ---------------------------------------------------------- */
  let sentenciaStarted = false;

  async function runSentencia() {
    if (sentenciaStarted) return;
    sentenciaStarted = true;

    const stamp = document.getElementById('sentencia-stamp');
    const container = document.getElementById('sentencia-frases');
    container.innerHTML = '';

    await wait(500);
    gsap.to(stamp, {
      opacity: 1,
      scale: 1,
      rotate: -4,
      duration: 1,
      ease: 'elastic.out(1, 0.55)'
    });

    await wait(1700);

    for (const frase of CONFIG.sentencia.frases) {
      const p = document.createElement('p');
      p.textContent = frase;
      container.appendChild(p);
      gsap.to(p, { opacity: 1, duration: 1.5, ease: 'power2.out' });
      await wait(3000);
    }

    await wait(1200);
    runFinal();
    goTo('screen-final');
  }

  /* ----------------------------------------------------------
     8. PANTALLA FINAL
     ---------------------------------------------------------- */
  let finalStarted = false;

  async function runFinal() {
    if (finalStarted) return;
    finalStarted = true;

    const checklistEl = document.getElementById('final-checklist');
    const frasesEl = document.getElementById('final-frases');
    checklistEl.innerHTML = '';
    frasesEl.innerHTML = '';

    CONFIG.final.checklist.forEach((item) => {
      const row = document.createElement('div');
      row.className = `final-item ${item.estado}`;
      const icon = item.estado === 'ok' ? '✔' : '···';
      row.innerHTML = `<span class="icon">${icon}</span><span>${item.texto}${item.estado === 'pendiente' ? ': Pendiente' : ''}</span>`;
      checklistEl.appendChild(row);
    });

    gsap.set('.final-item', { x: -10 });
    await wait(600);
    gsap.to('.final-item', {
      opacity: 1,
      x: 0,
      duration: 0.8,
      stagger: 0.5,
      ease: 'power2.out'
    });

    const checklistDuration = 600 + CONFIG.final.checklist.length * 500;
    await wait(checklistDuration);

    fireDiscreteConfetti();

    await wait(1400);

    CONFIG.final.frases.forEach((texto, idx) => {
      const p = document.createElement('p');
      p.textContent = texto;
      if (idx === CONFIG.final.frases.length - 1) p.classList.add('emphasis');
      frasesEl.appendChild(p);
    });

    const frasePs = frasesEl.querySelectorAll('p');
    for (let i = 0; i < frasePs.length; i++) {
      gsap.to(frasePs[i], { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' });
      await wait(i === frasePs.length - 1 ? 0 : 2800);
    }

    gsap.to(frasePs[frasePs.length - 1], {
      opacity: 0.75,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1
    });
  }

  function fireDiscreteConfetti() {
    if (typeof confetti !== 'function') return;
    confetti({
      particleCount: 26,
      spread: 50,
      startVelocity: 20,
      gravity: 1,
      scalar: 0.7,
      ticks: 140,
      colors: ['#D4AF37', '#FFFFFF', '#3AA6FF'],
      origin: { x: 0.5, y: 0.7 }
    });
  }

  /* ----------------------------------------------------------
     0. LOGIN (valida credenciales y arranca el boot)
     ---------------------------------------------------------- */
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const loginCard = document.querySelector('.login-card');
  const loginPassInput = document.getElementById('login-pass');
  const btnTogglePass = document.getElementById('btn-toggle-pass');

  btnTogglePass.addEventListener('click', () => {
    const isHidden = loginPassInput.type === 'password';
    loginPassInput.type = isHidden ? 'text' : 'password';
    btnTogglePass.textContent = isHidden ? 'Ocultar' : 'Ver';
    btnTogglePass.setAttribute('aria-label', isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });

  // Solo recorta espacios; las mayúsculas/minúsculas sí importan.
  function normalize(str) {
    return str.trim();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = normalize(document.getElementById('login-user').value);
    const pass = normalize(document.getElementById('login-pass').value);
    const expectedUser = normalize(CONFIG.acceso.usuario);
    const expectedPass = normalize(CONFIG.acceso.clave);

    if (user === expectedUser && pass === expectedPass) {
      getAudioCtx();
      loginError.classList.remove('show');
      goToLoadingFromLogin();
    } else {
      loginError.classList.add('show');
      gsap.fromTo(
        loginCard,
        { x: -8 },
        { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }
      );
    }
  });
});
