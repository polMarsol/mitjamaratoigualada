// Visor «3D» de la samarreta a partir de 4 fotos reals (davant, lateral, darrere, lateral): efecte de caixa giratòria.
// Cap malla ni deformació: cada cara és la foto original, comprimida només en horitzontal segons l'angle (com una peça que gira).
import gsap from 'gsap';

const host = document.getElementById('shirt-viewer');
if (host) init(host);

type Face = { img: HTMLImageElement; w: number };
async function init(host: HTMLElement) {
  const canvas = document.getElementById('shirt-canvas') as HTMLCanvasElement, ctx = canvas.getContext('2d')!;
  const status = document.getElementById('shirt-status')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const load = (src: string) => new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  const names = ['front', 'side-l', 'back', 'side-r'];              // 0°, 90°, 180°, 270°
  const imgs = await Promise.all(names.map((n) => load(`/shirt/${n}.webp`)));
  const faces: Face[] = imgs.map((img) => ({ img, w: img.naturalWidth }));
  const H = imgs[0].naturalHeight;
  status.hidden = true; host.classList.add('ready');

  let theta = 0, dpr = 1, W = 0, Ch = 0;                             // graus, 0 = davant
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2); W = host.clientWidth; Ch = host.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(Ch * dpr); draw();
  };

  const smooth = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  /** Cada foto conserva SIEMPRE sus proporciones reales (cap estirament). Entre dues vistes: fosa creuada amb un lleuger volteig. */
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, Ch);
    const th = ((theta % 360) + 360) % 360, k = Math.floor(th / 90) % 4, t = (th - k * 90) / 90;
    const cur = faces[k], nxt = faces[(k + 1) % 4];
    const sc = Math.min((Ch * 0.86) / H, (W * 0.92) / (faces[0].w * 1.08)), h = H * sc, y0 = (Ch - h) / 2 - Ch * 0.015;
    const e = smooth(0.12, 0.88, t), phi = e * Math.PI / 2;
    const wc = cur.w * sc, wn = nxt.w * sc;
    // ombra de terra (amplada mitjana entre les dues vistes)
    const wm = wc * (1 - e) + wn * e, sw = wm * 0.62 + 34, gy = y0 + h + 6, g = ctx.createRadialGradient(W / 2, gy, 4, W / 2, gy, sw);
    g.addColorStop(0, 'rgba(30,40,50,.32)'); g.addColorStop(1, 'rgba(30,40,50,0)');
    ctx.save(); ctx.translate(0, gy); ctx.scale(1, 0.11); ctx.translate(0, -gy); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W / 2, gy, sw, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    // fosa creuada pura: cap escalat ni volteig, la samarreta mai es deforma
    ctx.globalAlpha = 1 - smooth(0.2, 0.8, t); ctx.drawImage(cur.img, (W - wc) / 2, y0, wc, h);
    ctx.globalAlpha = smooth(0.2, 0.8, t); ctx.drawImage(nxt.img, (W - wn) / 2, y0, wn, h);
    ctx.globalAlpha = 1;
  }

  new ResizeObserver(resize).observe(host); resize();

  // ---------- Interacció: arrossegar, ajust a la vista real més propera, botons, teclat i gir automàtic amb pauses ----------
  let auto = !reduce, dragging = false, lastX = 0, vel = 0, tween: gsap.core.Tween | null = null, dwell = 0;
  const autoBox = document.getElementById('shirt-auto') as HTMLInputElement; autoBox.checked = auto;
  const stopAuto = () => { auto = false; autoBox.checked = false; };
  const setTheta = (v: number) => { theta = v; draw(); };
  const goTo = (target: number, dur = 1.0) => {
    tween?.kill(); vel = 0;
    const d = (((target - theta) % 360) + 540) % 360 - 180; if (Math.abs(d) < 0.3) { setTheta(target); return; }
    const from = theta, o = { v: 0 };
    tween = gsap.to(o, { v: 1, duration: reduce ? 0.01 : dur, ease: 'power3.inOut', onUpdate: () => setTheta(from + d * o.v) });
  };
  const snap = (dir = 0) => { const q = theta / 90; goTo((dir > 0 ? Math.ceil(q - 0.15) : dir < 0 ? Math.floor(q + 0.15) : Math.round(q)) * 90, 0.7); };
  canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; vel = 0; tween?.kill(); stopAuto(); canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; });
  canvas.addEventListener('pointermove', (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; vel = -dx * 0.5; setTheta(theta + vel); });
  const end = () => { if (!dragging) return; dragging = false; canvas.style.cursor = ''; snap(Math.abs(vel) > 1.2 ? Math.sign(vel) : 0); };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); stopAuto(); goTo(Math.round(theta / 90) * 90 + (e.key === 'ArrowLeft' ? -90 : 90), 0.8); } });
  const on = (id: string, fn: () => void) => document.getElementById(id)?.addEventListener('click', fn);
  const view = (deg: number) => () => { stopAuto(); goTo(deg, 1.1); };
  on('v-front', view(0)); on('v-left', view(90)); on('v-back', view(180)); on('v-right', view(270)); on('v-reset', view(0));
  autoBox.addEventListener('change', () => { auto = autoBox.checked; dwell = 0; });

  let visible = true; new IntersectionObserver((e) => (visible = e[0].isIntersecting)).observe(host);
  gsap.ticker.add((_t, dt) => {
    if (!visible || dragging || !auto || tween?.isActive()) return;
    dwell += dt; if (dwell > 2300) { dwell = 0; goTo(Math.round(theta / 90) * 90 + 90, 1.3); }
  });
  (window as any).__shirt = { setTheta, goTo, stop: () => { tween?.kill(); stopAuto(); } }; // per a proves
}
