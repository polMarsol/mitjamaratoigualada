// Interaccions dels apartats d'informació (src/pages/[lang]/info). Formularis, botiga i seguiment són demostració: no s'envia res.
import gsap from 'gsap';

const $ = <T extends HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const dec = document.documentElement.lang === 'en' ? '.' : ',';
const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');
const hms = (s: number) => `${Math.floor(s / 3600)}:${pad((s % 3600) / 60)}:${pad(s % 60)}`;
const clock = (min: number) => `${pad(min / 60)}:${pad(min % 60)}`;
const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
/** Grup de botons excloents (aria-selected) */
const seg = (btns: HTMLElement[], cb: (b: HTMLElement) => void) => btns.forEach((b) => b.addEventListener('click', () => { btns.forEach((o) => o.setAttribute('aria-selected', String(o === b))); cb(b); }));

// ---------- Mapes de punts (Leaflet, càrrega mandrosa) ----------
const maps = $$('[data-pmap]');
if (maps.length) new IntersectionObserver(async (en, o) => {
  if (!en.some((e) => e.isIntersecting)) return; o.disconnect();
  const [{ default: L }, { default: D }] = await Promise.all([import('leaflet'), import('../data/logistics.json')]);
  const CC: Record<string, string> = { p: '--accent', t: '--caid', s: '--green', w: '--c10' };
  maps.forEach((el) => {
    const pts = JSON.parse(el.dataset.pmap!) as { lat: number; lon: number; t: string; d: string; c: string }[];
    const map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
    map.on('focus', () => map.scrollWheelZoom.enable()); map.on('blur', () => map.scrollWheelZoom.disable());
    const track = (D as any).races[0].track as [number, number][];
    L.polyline(track, { color: '#fff', weight: 7, opacity: 0.8, interactive: false }).addTo(map);
    L.polyline(track, { color: css('--accent'), weight: 3.5, opacity: 0.55, interactive: false }).addTo(map);
    const list = $$('[data-pt]', el.parentElement!);
    const mk = pts.map((p, i) => L.marker([p.lat, p.lon], { title: p.t, icon: L.divIcon({ className: 'pm-pin', html: `<span style="display:grid;place-items:center;width:100%;height:100%;border-radius:999px;background:${css(CC[p.c])}">${i + 1}</span>`, iconSize: [30, 30], iconAnchor: [15, 15] }) })
      .bindPopup(`<b>${p.t}</b><br>${p.d}<br><a href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}" target="_blank" rel="noopener" style="color:var(--accent);font-weight:700;text-decoration:underline">Google Maps</a>`).addTo(map));
    const b = L.latLngBounds(pts.map((p) => [p.lat, p.lon] as [number, number]));
    map.fitBounds(pts.length > 1 ? b.pad(0.25) : L.latLngBounds(track), { animate: false });
    const on = (i: number) => list.forEach((x, k) => x.classList.toggle('is-on', k === i));
    list.forEach((btn, i) => btn.addEventListener('click', () => { on(i); map.flyTo([pts[i].lat, pts[i].lon], 16, { duration: reduce ? 0 : 0.8 }); setTimeout(() => mk[i].openPopup(), reduce ? 0 : 850); }));
    mk.forEach((m, i) => m.on('click', () => on(i)));
  });
}, { rootMargin: '500px' }).observe(maps[0]);

// ---------- Llistes de comprovació (es recorden al navegador) ----------
$$('[data-check]').forEach((box) => {
  const key = `mmi-check-${box.dataset.check}`, inputs = $$<HTMLInputElement>('input', box), bar = $('[data-bar]', box)!;
  let saved: number[] = []; try { saved = JSON.parse(localStorage.getItem(key) || '[]'); } catch {}
  const sync = () => { const on = inputs.filter((i) => i.checked); bar.style.width = `${(on.length / inputs.length) * 100}%`; try { localStorage.setItem(key, JSON.stringify(on.map((i) => +i.dataset.i!))); } catch {} };
  inputs.forEach((i) => { i.checked = saved.includes(+i.dataset.i!); i.addEventListener('change', sync); }); sync();
});

// ---------- Barres d'objectius ----------
const mio = new IntersectionObserver((en) => en.forEach((e) => { if (!e.isIntersecting) return; mio.unobserve(e.target); gsap.to(e.target, { width: `${(e.target as HTMLElement).dataset.meter}%`, duration: reduce ? 0 : 1.3, ease: 'power3.out' }); }), { threshold: 0.6 });
$$('[data-meter]').forEach((m) => mio.observe(m));

// ---------- Xifres que compten ----------
const nio = new IntersectionObserver((en) => en.forEach((e) => { if (!e.isIntersecting) return; nio.unobserve(e.target); const el = e.target as HTMLElement, o = { v: 0 }; gsap.to(o, { v: +el.dataset.num!, duration: reduce ? 0 : 1.2, ease: 'power3.out', onUpdate: () => (el.textContent = String(Math.round(o.v))) }); }), { threshold: 0.6 });
$$('[data-num]').forEach((n) => nio.observe(n));

// ---------- Formularis de demostració ----------
$$<HTMLFormElement>('form[data-pform]').forEach((f) => f.addEventListener('submit', (e) => {
  e.preventDefault();
  const bad = $$<HTMLInputElement>('[required]', f).filter((i) => !i.value.trim() || (i.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value)));
  $$<HTMLInputElement>('[required]', f).forEach((i) => i.setAttribute('aria-invalid', String(bad.includes(i))));
  $('[data-err]', f)!.hidden = !bad.length; $('[data-ok]', f)!.hidden = !!bad.length;
  if (bad.length) return bad[0].focus();
  f.reset(); if (!reduce) gsap.from($('[data-ok]', f), { y: 10, opacity: 0, duration: 0.5 });
}));

// ---------- Calculadora de ritmes ----------
const pace = $('#pace');
if (pace) {
  const range = $<HTMLInputElement>('#pace-range')!, list = $('#pace-splits')!;
  let dist = 21.0975;
  const run = () => {
    const sec = +range.value * 60, p = sec / dist, half = dist > 20;
    $('#pace-goal')!.textContent = hms(sec);
    $('#pace-km')!.textContent = `${Math.floor(p / 60)}:${pad(p % 60)}`;
    $('#pace-kmh')!.textContent = (3600 / p).toFixed(1).replace('.', dec);
    const m = +range.value, lim = half ? [90, 105, 120, 140] : [40, 48, 55, 65], box = ['●', '●', '●', '●', '●'], col = ['#d33', '#27c', '#2a7', '#db0', '#999'];
    const i = lim.findIndex((l) => m < l), k = i < 0 ? 4 : i;
    const hare = (half ? [90, 105, 120, 135] : [45, 55, 65]).filter((h) => h >= m)[0];
    $('#pace-box')!.innerHTML = `<span style="color:${col[k]}">${box[k]}</span> ${k < 2 ? 'A' : k < 4 ? 'B' : 'C'} · ${hare ? hms(hare * 60).slice(0, 4) : '—'}`;
    const start = half ? 510 : 540, marks = half ? [5, 10, 15, 20, dist] : [2.5, 5, 7.5, dist];
    list.innerHTML = marks.map((km, n) => { const t = p * km; return `<li class="neo flex items-center gap-4 !rounded-2xl px-4 py-3"><span class="font-display w-16 text-lg font-extrabold" style="color:var(--accent)">${n === marks.length - 1 ? 'Meta' : `km ${String(km).replace('.', dec)}`}</span><span class="h-2 flex-1 overflow-hidden rounded-full" style="background:var(--line)"><i class="block h-full rounded-full" style="width:${(km / dist) * 100}%;background:var(--grad)"></i></span><span class="tabular-nums" style="color:var(--muted)">${hms(Math.round(t))}</span><b class="font-display w-14 text-right text-lg tabular-nums">${clock(start + t / 60)}</b></li>`; }).join('');
  };
  seg($$('[data-dist]', pace), (b) => { dist = +b.dataset.dist!; const h = dist > 20; range.min = h ? '65' : '30'; range.max = h ? '180' : '90'; range.value = h ? '120' : '55'; run(); });
  range.addEventListener('input', run); run();
}

// ---------- Pla d'entrenament ----------
const plan = $('#plan-body');
if (plan) {
  const w = JSON.parse(plan.dataset.w!);
  let d = 0, l = 0;
  const run = () => {
    const peak = (d ? [9, 11, 13] : [17, 19, 21])[l], base = (d ? [4, 5, 6] : [5, 7, 8])[l], reps = [0, 5, 7][l];
    plan.innerHTML = Array.from({ length: 8 }, (_, i) => {
      const taper = i === 7, f = [0.5, 0.6, 0.7, 0.6, 0.85, 1, 0.7, 0][i], long = Math.round(peak * f), easy = base + Math.min(i, 3), q = taper ? `${base} km ${w.easy} ${w.strides}` : l === 0 ? `${easy} km ${w.easy}` : i % 2 ? `${reps + (i > 3 ? 1 : 0)} × 1.000 m ${w.series}` : `${easy} km, ${Math.round(easy / 2)} ${w.tempo}`;
      const sat = taper ? `3 km ${w.easy}` : i % 3 === 2 ? w.rest : `${base} km ${w.easy}`, sun = taper ? `<b style="color:var(--accent)">${w.race} · 13/12</b>` : `${long} km ${w.long}`;
      const tot = taper ? base * 2 + 3 : easy + (l === 0 || i % 2 === 0 ? easy : reps + 4) + (i % 3 === 2 ? 0 : base) + long;
      return `<tr class="border-t transition-colors hover:bg-[var(--line)]" style="border-color:var(--line)"><td class="p-3 font-display text-base font-extrabold">${i + 1}</td><td class="p-3">${easy} km ${w.easy}</td><td class="p-3">${q}</td><td class="p-3">${sat}</td><td class="p-3 font-semibold">${sun}</td><td class="p-3 font-display font-bold tabular-nums">${taper ? `${tot} + ${d ? 10 : 21}` : tot}</td></tr>`;
    }).join('');
    if (!reduce) gsap.from(plan.children, { opacity: 0, y: 8, stagger: 0.03, duration: 0.35 });
  };
  seg($$('[data-pd]'), (b) => { d = +b.dataset.pd!; run(); }); seg($$('[data-pl]'), (b) => { l = +b.dataset.pl!; run(); }); run();
}

// ---------- Guia de l'espectador ----------
const sp = $('#spect');
if (sp) {
  const spots = JSON.parse(sp.dataset.spots!) as { id: string; km: Record<string, number>; t: string }[];
  const R: Record<string, { d: number; s: number; lo: number; hi: number; def: number; fast: number }> = { '21k': { d: 21.1, s: 510, lo: 65, hi: 180, def: 120, fast: 66 }, '10k': { d: 10, s: 540, lo: 31, hi: 90, def: 55, fast: 32 }, cam: { d: 6.1, s: 555, lo: 55, hi: 150, def: 90, fast: 55 } };
  const range = $<HTMLInputElement>('#sp-range')!, list = $('#sp-list')!;
  let race = '21k';
  const run = () => {
    const r = R[race], g = +range.value;
    $('#sp-goal')!.textContent = `${Math.floor(g / 60)}:${pad(g % 60)}`;
    list.innerHTML = spots.filter((s) => s.km[race] != null).map((s) => { const f = s.km[race] / r.d; return `<li class="sp-card neo p-4"><p class="text-xs font-bold uppercase tracking-wider" style="color:var(--muted)">km ${String(s.km[race]).replace('.', dec)}</p><p class="font-display text-4xl font-extrabold tabular-nums" style="color:var(--accent)">${clock(r.s + g * f)}</p><p class="mt-1 font-display font-bold leading-tight">${s.t}</p><p class="mt-1 text-xs tabular-nums" style="color:var(--muted)">${clock(r.s + r.fast * f)} – ${clock(r.s + r.hi * f)}</p></li>`; }).join('');
  };
  seg($$('[data-race]', sp), (b) => { race = b.dataset.race!; const r = R[race]; range.min = String(r.lo); range.max = String(r.hi); range.value = String(r.def); run(); if (!reduce) gsap.from(list.children, { y: 14, opacity: 0, stagger: 0.05, duration: 0.4 }); });
  range.addEventListener('input', run); run();
}

// ---------- La meva inscripció ----------
const lk = $('#lookup');
if (lk) {
  const card = $('#lk-card')!, msg = $('#lk-msg')!, M = JSON.parse(msg.dataset.m!), qr = $('#lk-qr') as unknown as SVGElement;
  $('form', lk)!.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = ($<HTMLInputElement>('#lk-q')!.value.trim() || 'MMI-4821').toUpperCase();
    $('#lk-loc')!.textContent = q; $('#lk-bib')!.textContent = String(1000 + ([...q].reduce((a, c) => a + c.charCodeAt(0), 0) % 800));
    card.style.opacity = '1'; msg.textContent = ''; if (!reduce) gsap.from(card, { y: 16, duration: 0.5, ease: 'power3.out' });
    let s = [...q].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7), cells = '';
    for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) { s = (s * 1103515245 + 12345) >>> 0; const eye = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13); const ex = x % 14, ey = y % 14; if (eye ? ex === 0 || ex === 6 || ey === 0 || ey === 6 || (ex > 1 && ex < 5 && ey > 1 && ey < 5) : (s >> 16) & 1) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }
    qr.innerHTML = cells;
  });
  $$('[data-act]', lk).forEach((b) => b.addEventListener('click', () => {
    if (card.style.opacity !== '1') return $<HTMLInputElement>('#lk-q')!.focus();
    const a = b.dataset.act!;
    if (a === 'qr') { qr.toggleAttribute('hidden'); return; }
    msg.textContent = M[a];
    if (a === 'mod') { $('#lk-mod')!.textContent = M.m10; $('#lk-paid')!.textContent = `12${dec}00 €`; }
    if (a === 'back') { const st = $('#lk-state')!; st.textContent = M.cancel; st.className = 'pill pill-soon text-sm'; }
    if (!reduce) gsap.from(msg, { x: -10, opacity: 0, duration: 0.4 });
  }));
}
const slq = $<HTMLInputElement>('#sl-q');
slq?.addEventListener('input', () => { const s = slq.value.trim().toLowerCase(); let n = 0; $$('#startlist [data-s]').forEach((r) => { const ok = r.dataset.s!.includes(s); r.hidden = !ok; if (ok) n++; }); $('#sl-n')!.textContent = String(n); });

// ---------- Seguiment en directe (demostració) ----------
const tr = $('#track');
if (tr) {
  const path = $('#tr-path') as unknown as SVGPathElement, len = path.getTotalLength(), D = 21.0975;
  const sel = $<HTMLSelectElement>('#tr-sel')!, range = $<HTMLInputElement>('#tr-range')!, play = $('#tr-play')!, PL = JSON.parse(play.dataset.l!);
  const eta = $('#tr-eta')!, EL = JSON.parse(eta.dataset.l!), splits = $('#tr-splits')!, SL = JSON.parse(splits.dataset.l!);
  const field = [...sel.options].map((o) => +o.value), cps = [5, 10, 15, D];
  $('#tr-cps')!.innerHTML = cps.map((k, i) => { const p = path.getPointAtLength((k / D) * len); return `<g><circle cx="${p.x}" cy="${p.y}" r="9" fill="var(--bg)" stroke="var(--fg)" stroke-width="2.5"/><text x="${p.x}" y="${p.y + 3.5}" text-anchor="middle" font-size="9" font-weight="800" fill="var(--fg)">${i < 3 ? k : '⚑'}</text></g>`; }).join('');
  const dots = $('#tr-dots')!;
  dots.innerHTML = field.map((_, i) => `<circle r="5" fill="var(--muted)" opacity=".7" data-i="${i}"/>`).join('') + '<circle id="tr-me" r="10" fill="var(--c10)" stroke="#fff" stroke-width="3"/>';
  let T = 0, raf = 0, last = 0;
  const draw = () => {
    const mine = +sel.value;
    $$('circle[data-i]', dots).forEach((c, i) => { const p = path.getPointAtLength(Math.min(1, T / field[i]) * len); c.setAttribute('cx', String(p.x)); c.setAttribute('cy', String(p.y)); });
    const f = Math.min(1, T / mine), p = path.getPointAtLength(f * len), me = $('#tr-me', dots)!; me.setAttribute('cx', String(p.x)); me.setAttribute('cy', String(p.y));
    $('#tr-clock')!.textContent = `${clock(510 + T / 60)}:${pad(T % 60)}`;
    $('#tr-km')!.textContent = (f * D).toFixed(1).replace('.', dec);
    eta.textContent = f >= 1 ? `${EL[1]} · ${hms(mine)}` : `${EL[0]}: ${clock(510 + mine / 60)} (${hms(mine)})`;
    splits.innerHTML = cps.map((k, i) => { const t = (k / D) * mine, done = T >= t; return `<li class="flex items-center justify-between rounded-xl px-3 py-2 ${done ? '' : 'opacity-40'}" style="background:${done ? 'color-mix(in srgb,var(--caid) 16%,transparent)' : 'var(--line)'}"><b>${SL[i]}</b><span class="tabular-nums">${done ? hms(Math.round(t)) : '—'}</span></li>`; }).join('');
    range.value = String(T);
  };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; $('span', play)!.textContent = PL[0]; };
  const tick = (now: number) => { T = Math.min(+range.max, T + ((now - last) / 1000) * 240); last = now; draw(); if (T >= +range.max) return stop(); raf = requestAnimationFrame(tick); };
  play.addEventListener('click', () => { if (raf) return stop(); if (T >= +range.max) T = 0; $('span', play)!.textContent = PL[1]; last = performance.now(); raf = requestAnimationFrame(tick); });
  range.addEventListener('input', () => { T = +range.value; draw(); }); sel.addEventListener('change', draw);
  T = 3300; draw();
}

// ---------- Botiga (demostració) ----------
const shop = $('#shop');
if (shop) {
  const SL = JSON.parse(shop.dataset.l!), cart = $('#cart')!; let n = 0, tot = 0;
  $$('.prod', shop).forEach((p) => {
    const sizes = $$('[data-size]', p); sizes.forEach((s) => s.addEventListener('click', () => sizes.forEach((o) => o.setAttribute('aria-pressed', String(o === s)))));
    const add = $('[data-add]', p)!;
    add.addEventListener('click', () => {
      n++; tot += +add.dataset.add!; $('#cart-n')!.textContent = String(n); $('#cart-t')!.textContent = String(tot); cart.classList.add('is-on');
      $('span', add)!.textContent = `✓ ${SL[0]}`; setTimeout(() => ($('span', add)!.textContent = SL[1]), 1200);
      if (!reduce) { gsap.fromTo(cart, { scale: 1.12 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }); gsap.fromTo($('.prod-img', p), { y: 0 }, { y: -14, yoyo: true, repeat: 1, duration: 0.18 }); }
    });
  });
}

// ---------- Equips ----------
const tm = $('#team');
if (tm) {
  const range = $<HTMLInputElement>('#tm-range')!, tier = $('#tm-tier')!, TL = JSON.parse(tier.dataset.l!); let fee = 18;
  const eur = (v: number) => v.toFixed(2).replace('.', dec);
  const run = () => { const n = +range.value, k = n >= 25 ? 3 : n >= 10 ? 2 : n >= 5 ? 1 : 0, each = fee * (1 - [0, 0.1, 0.15, 0.2][k]);
    $('#tm-n')!.textContent = String(n); tier.textContent = `${TL[k]}${k ? ` · −${[0, 10, 15, 20][k]} %` : ''}`; $('#tm-each')!.textContent = eur(each); $('#tm-total')!.textContent = eur(each * n); $('#tm-save')!.textContent = eur((fee - each) * n); };
  seg($$('[data-fee]', tm), (b) => { fee = +b.dataset.fee!; run(); }); range.addEventListener('input', run); run();
}
