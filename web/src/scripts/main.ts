import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0); // el cargador ha de durar el temps real, encara que hi hagi tirons

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s);
const ease = 'expo.out';

// ---------- Tema ----------
$('#theme-toggle')?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', next === 'dark' ? '#08131c' : '#eef3f4');
});

// ---------- Menú mòbil ----------
const menu = $('#mobile-menu')!, menuBtn = $('#menu-btn')!;
const setMenu = (open: boolean) => {
  if (open) { menu.hidden = false; document.body.style.overflow = 'hidden'; if (!reduce) gsap.fromTo('.menu-item', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.5, ease, delay: 0.05 }); }
  else { menu.hidden = true; document.body.style.overflow = ''; }
  menuBtn.setAttribute('aria-expanded', String(open));
  (open ? menu.querySelector<HTMLElement>('button') : menuBtn)?.focus();
};
menuBtn.addEventListener('click', () => setMenu(true));
menu.querySelectorAll('[data-menu-close]').forEach((e) => e.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (e) => e.key === 'Escape' && !menu.hidden && setMenu(false));

// ---------- Tornar amunt ----------
const top = $('#to-top')!;
top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
ScrollTrigger.create({
  start: 600,
  onToggle: (s) => {
    top.classList.toggle('opacity-0', !s.isActive); top.classList.toggle('translate-y-4', !s.isActive);
    top.classList.toggle('pointer-events-none', !s.isActive);
  },
});

// ---------- Comptador enrere ----------
const cd = $('#countdown');
if (cd) {
  const target = new Date(cd.dataset.date!).getTime();
  const tick = () => {
    const s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const v = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
    (Object.keys(v) as (keyof typeof v)[]).forEach((k) => { const el = cd.querySelector(`[data-unit=${k}]`); if (el) el.textContent = String(v[k]).padStart(2, '0'); });
  };
  tick(); setInterval(tick, 1000);
}

// ---------- Animacions d'entrada ----------
function intro() {
  const tl = gsap.timeline({ defaults: { ease } });
  tl.from('#site-header > div', { y: -30, opacity: 0, duration: 0.8 });
  if (document.querySelector('[data-hero-line]')) {
    tl.from('[data-hero-line]', { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.05)
      .from('[data-hero]', { y: 24, opacity: 0, duration: 0.9, stagger: 0.09 }, 0.25);
  }

  const route = document.querySelector<SVGPathElement>('#hero-route'), dot = document.querySelector<SVGCircleElement>('#hero-dot');
  if (route && dot) {
    const len = route.getTotalLength();
    const o = { p: 0 };
    gsap.set(route, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(o, { p: 1, duration: 3.2, ease: 'power2.inOut', delay: 0.6, onUpdate: () => {
      const pt = route.getPointAtLength(o.p * len);
      dot.setAttribute('cx', String(pt.x)); dot.setAttribute('cy', String(pt.y));
      route.style.strokeDashoffset = String(len * (1 - o.p));
    } });
  }
}

function scrollFx() {
  // Reveals amb IntersectionObserver: no depenen de posicions precalculades (robust amb imatges lazy)
  const io = new IntersectionObserver((entries) => {
    const vis = entries.filter((e) => e.isIntersecting);
    vis.forEach((e, i) => {
      io.unobserve(e.target);
      gsap.to(e.target, { opacity: 1, y: 0, duration: 0.9, ease, delay: i * 0.1, onComplete: () => ((e.target as HTMLElement).style.transform = 'none') });
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  if (!reduce) gsap.utils.toArray<HTMLElement>('.shot-img').forEach((img) => {
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    gsap.to(el, { y: Number(el.dataset.parallax), ease: 'none', scrollTrigger: { trigger: '#inici', start: 'top top', end: 'bottom top', scrub: true } });
  });
}

// Les imatges lazy i les fonts canvien les alçades: recalcula els disparadors
{ let t: number; new ResizeObserver(() => { clearTimeout(t); t = window.setTimeout(() => ScrollTrigger.refresh(), 150); }).observe(document.body); }

// ---------- Loader: recorregut real de la MM + revelat del logo en 3D (només un cop per sessió) ----------
const loader = $('#loader')!;
let seen = false; try { seen = sessionStorage.getItem('loaded') === '1'; } catch {}
const start = () => { if (!reduce) { intro(); scrollFx(); } else { scrollFx(); } };
if (seen || reduce) { loader.remove(); start(); }
else {
  const route = document.querySelector<SVGPathElement>('#loader-route')!, dot = document.querySelector<SVGCircleElement>('#loader-dot')!, km = $('#loader-km')!;
  const len = route.getTotalLength(), prog = { p: 0 };
  route.style.strokeDasharray = String(len); route.style.strokeDashoffset = String(len);
  let animDone = false, loaded = document.readyState === 'complete', closed = false;
  const box = $('#loader-box')!, stage = $('#loader-stage')!, stack = $('#loader-stack')!;
  const slices = [...stack.children] as HTMLElement[];
  const pageEls = () => [...document.querySelectorAll<HTMLElement>('#site-header, #main, footer')];
  const finish = () => { try { sessionStorage.setItem('loaded', '1'); } catch {} };

  // Sortida ràpida (botó «Saltar»)
  const quick = () => {
    if (closed) return; closed = true; finish(); gsap.killTweensOf([box, stage, stack, ...slices]);
    gsap.to(loader, { opacity: 0, duration: 0.5, ease: 'power2.out', onComplete: () => loader.remove() }); start();
  };

  // Revelat: el logo arriba des del fons com un bloc 3D i travessa la càmera; la web passa de borrosa a nítida
  const reveal = () => {
    if (closed) return; closed = true; finish();
    const els = pageEls();
    gsap.set(els, { opacity: 0, filter: 'blur(26px)' });
    gsap.set(stack, { z: -2600, rotationY: -32, rotationX: 14, transformOrigin: '50% 50%' });
    gsap.set(slices, { z: (i: number) => -i * 300 });
    const tl = gsap.timeline({ onComplete: () => { loader.remove(); gsap.set(els, { clearProps: 'filter,opacity' }); } });
    tl.to(box, { opacity: 0, scale: 0.86, duration: 0.55, ease: 'power2.in' })
      .set(stage, { visibility: 'visible' }, '<0.15')
      .to(stage, { opacity: 1, duration: 0.5, ease: 'power1.out' }, '<')
      .to(stack, { z: 0, rotationY: 0, rotationX: 0, duration: 1.9, ease: 'expo.out' }, '<')
      .to(slices, { z: (i: number) => -i * 4, duration: 1.9, ease: 'expo.out' }, '<')          // les capes es comprimeixen en arribar
      .to(stack, { rotationY: 6, rotationX: -2, duration: 0.8, ease: 'sine.inOut' }, '>-0.75')   // un petit gir per veure el gruix
      .to(stack, { z: 1500, duration: 0.95, ease: 'power3.in' }, '>-0.1')                       // travessa la càmera
      .to(slices, { z: (i: number) => -i * 4 + i * 70, duration: 0.95, ease: 'power3.in' }, '<')
      .to(stage, { opacity: 0, duration: 0.45, ease: 'power1.in' }, '<0.5')
      .to(loader, { backgroundColor: 'rgba(0,0,0,0)', duration: 0.01 }, '<')
      .add(() => start(), '<0.1')
      .to(els, { opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out' }, '<');
  };
  const tryClose = () => animDone && loaded && reveal();
  gsap.to(prog, {
    p: 1, duration: 3.4, ease: 'power1.inOut', delay: 0.3,
    onUpdate: () => {
      const pt = route.getPointAtLength(prog.p * len);
      dot.setAttribute('cx', String(pt.x)); dot.setAttribute('cy', String(pt.y));
      route.style.strokeDashoffset = String(len * (1 - prog.p));
      km.textContent = (prog.p * 21.097).toFixed(1).replace('.', ',');
    },
    onComplete: () => { km.textContent = '21,097'; setTimeout(() => { animDone = true; tryClose(); }, 300); },
  });
  addEventListener('load', () => { loaded = true; tryClose(); });
  $('#loader-skip')!.addEventListener('click', quick);
  setTimeout(quick, 12000); // xarxa lenta: mai bloquegem la pàgina
}
