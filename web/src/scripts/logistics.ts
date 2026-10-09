// Mapa i interaccions de les pàgines de logística: capes, simulador horari de talls, taules ↔ mapa i calculadora de material.
import L from 'leaflet';
import gsap from 'gsap';
import data from '../data/logistics.json';

type LL = [number, number];
type Row = { n: string; k0: number; k1: number; a: LL; tc: string; tr: string };
type Race = { id: string; name: string; km: number; rows: Row[]; track: LL[] };
type Vol = { id: number; lat: number; lon: number; what: string; kind: 'gir' | 'vol' | 'policia'; races: string[]; km: Record<string, number>; n: number };
type Aid = { id: string; name: string; lat: number; lon: number; km: Record<string, number> };
const D = data as unknown as { races: Race[]; vol: Vol[]; aid: Aid[] };

const wrap = document.getElementById('logi-wrap');
if (wrap) {
  const T = JSON.parse(wrap.dataset.i18n || '{}');
  const mapEl = document.getElementById('logi-map')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  const gm = (la: number, lo: number) => `https://www.google.com/maps/search/?api=1&query=${la},${lo}`;
  const num = (v: number, d = 1) => v.toFixed(d).replace('.', T.dec);
  const mins = (s: string) => +s.slice(0, 2) * 60 + +s.slice(3);
  const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const what = (s: string) => s.replaceAll('Giro:', `${T.turn}:`).replaceAll('Cruce:', `${T.cross}:`);
  const COL: Record<string, string> = { '21k': '--c21', '10k': '--c10', cam: '--ccam' };
  const W: Record<string, number> = { '21k': 9, '10k': 5.5, cam: 2.5 }; // gruixos apilats: on coincideixen es veuen totes tres

  // distància acumulada de cada traçat, escalada als km oficials de la prova
  const cum: Record<string, number[]> = {};
  D.races.forEach((r) => {
    const c = [0];
    for (let i = 1; i < r.track.length; i++) c.push(c[i - 1] + L.latLng(r.track[i - 1]).distanceTo(L.latLng(r.track[i])));
    const k = r.km / c[c.length - 1];
    cum[r.id] = c.map((v) => v * k);
  });
  const seg = (id: string, k0: number, k1: number) => {
    const r = D.races.find((x) => x.id === id)!, c = cum[id];
    const out = r.track.filter((_, i) => c[i] >= k0 - 0.02 && c[i] <= k1 + 0.02);
    return out.length > 1 ? out : r.track.slice(0, 2);
  };

  const show: Record<string, boolean> = {};
  document.querySelectorAll<HTMLButtonElement>('[data-layer]').forEach((b) => (show[b.dataset.layer!] = b.getAttribute('aria-pressed') === 'true'));
  let simT: number | null = null, first = true;

  const map = L.map(mapEl, { zoomControl: true, scrollWheelZoom: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
  map.on('focus', () => map.scrollWheelZoom.enable()); map.on('blur', () => map.scrollWheelZoom.disable());
  const base = L.layerGroup().addTo(map), pts = L.layerGroup().addTo(map), hi = L.layerGroup().addTo(map);
  const bounds = L.latLngBounds(D.races.flatMap((r) => r.track));
  map.fitBounds(bounds, { padding: [24, 24], animate: false });

  function draw() {
    base.clearLayers(); pts.clearLayers();
    const dim = simT !== null;
    D.races.forEach((r) => {
      if (!show[r.id]) return;
      L.polyline(r.track, { color: '#fff', weight: W[r.id] + 3, opacity: dim ? 0.5 : 0.85, interactive: false }).addTo(base);
      const line = L.polyline(r.track, { color: css(COL[r.id]), weight: W[r.id], opacity: dim ? 0.3 : 0.95, lineCap: 'round', lineJoin: 'round' }).addTo(base);
      line.bindTooltip(`${T.races[r.id]} · ${num(r.km)} km`, { sticky: true });
      if (first && !reduce) {
        const el = line.getElement() as SVGPathElement | null, len = el?.getTotalLength?.() || 0;
        if (el && len) gsap.fromTo(el, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', onComplete: () => el.removeAttribute('stroke-dasharray') });
      }
    });
    if (dim) D.races.forEach((r) => show[r.id] && r.rows.forEach((x) => {
      if (simT! >= mins(x.tc) && simT! < mins(x.tr)) L.polyline(seg(r.id, x.k0, x.k1), { color: css('--cpol'), weight: 6, opacity: 0.95, lineCap: 'round' }).bindTooltip(`${esc(x.n)} · ${x.tc}–${x.tr}`, { sticky: true }).addTo(base);
    }));
    if (show.vol) D.vol.forEach((v) => {
      if (!v.races.some((r) => show[r])) return;
      const km = Object.entries(v.km).map(([r, k]) => `${T.races[r]} ${num(k)}`).join(' · ');
      L.circleMarker([v.lat, v.lon], { radius: v.kind === 'policia' ? 7 : 5, color: css(v.kind === 'policia' ? '--cpol' : '--fg'), weight: 2, fillColor: css('--bg'), fillOpacity: 1 })
        .bindPopup(`<b>#${v.id} · ${T.kinds[v.kind]}</b><br>${esc(what(v.what))}<br>${v.n} ${T.people} · km ${km}<br><a href="${gm(v.lat, v.lon)}" target="_blank" rel="noopener">${T.maps}</a>`).addTo(pts);
    });
    if (show.aid) D.aid.forEach((a) => {
      const km = Object.entries(a.km).map(([r, k]) => `${T.races[r]} km ${num(k)}`).join(' · ');
      const m = L.marker([a.lat, a.lon], { title: a.name, zIndexOffset: 500, icon: L.divIcon({ className: 'logi-aid', html: a.id === 'M' ? '⚑' : a.id, iconSize: [30, 30], iconAnchor: [15, 15] }) })
        .bindPopup(`<b>${a.id === 'M' ? T.finish : a.id}</b><br>${esc(a.name.replace(/^Meta · /, ''))}<br>${km}<br><a href="${gm(a.lat, a.lon)}" target="_blank" rel="noopener">${T.maps}</a>`).addTo(pts);
      (m as any)._aid = a.id;
    });
    first = false;
  }
  draw();

  document.querySelectorAll<HTMLButtonElement>('[data-layer]').forEach((b) => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(on)); show[b.dataset.layer!] = on; draw();
  }));
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ---------- Ampliar ----------
  const label = document.getElementById('logi-expand-label')!;
  const full = (on = !wrap.classList.contains('is-full')) => {
    wrap.classList.toggle('is-full', on); document.body.style.overflow = on ? 'hidden' : ''; label.textContent = on ? T.collapse : T.expand;
    setTimeout(() => { map.invalidateSize(); map.fitBounds(bounds, { padding: [24, 24] }); }, 60);
  };
  document.getElementById('logi-expand')!.addEventListener('click', () => full());
  addEventListener('keydown', (e) => e.key === 'Escape' && wrap.classList.contains('is-full') && full(false));

  // ---------- Taules ↔ mapa ----------
  const focus = (la: number, lo: number, html: string, scroll = true) => {
    if (scroll && !wrap.classList.contains('is-full')) wrap.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    map.flyTo([la, lo], 17, { duration: reduce ? 0 : 0.9 });
    L.popup({ offset: [0, -4] }).setLatLng([la, lo]).setContent(html).openOn(map);
  };
  const glow = (row: HTMLElement | null) => {
    hi.clearLayers();
    document.querySelectorAll('.lrow.is-on').forEach((r) => r.classList.remove('is-on'));
    if (!row) return;
    row.classList.add('is-on');
    (row.dataset.seg || '').split('|').filter(Boolean).forEach((s) => {
      const [id, k0, k1] = s.split(',');
      L.polyline(seg(id, +k0, +k1), { color: '#ffd23f', weight: 12, opacity: 0.85, lineCap: 'round', interactive: false }).addTo(hi);
    });
  };
  document.querySelectorAll<HTMLElement>('.lrow').forEach((row) => {
    const [la, lo] = row.dataset.ll!.split(',').map(Number);
    const go = () => { glow(row); focus(la, lo, `<b>${esc(row.dataset.title || '')}</b><br>${esc(row.dataset.sub || '')}<br><a href="${gm(la, lo)}" target="_blank" rel="noopener">${T.maps}</a>`); };
    row.addEventListener('click', (e) => !(e.target as HTMLElement).closest('a') && go());
    row.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    row.addEventListener('mouseenter', () => glow(row));
  });
  document.querySelectorAll<HTMLElement>('[data-aid-focus]').forEach((b) => b.addEventListener('click', () => {
    const a = D.aid.find((x) => x.id === b.dataset.aidFocus)!;
    if (!show.aid) (document.querySelector('[data-layer="aid"]') as HTMLButtonElement).click();
    wrap.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    map.flyTo([a.lat, a.lon], 16, { duration: reduce ? 0 : 0.9 });
    pts.eachLayer((l: any) => l._aid === a.id && setTimeout(() => l.openPopup(), reduce ? 0 : 950));
  }));

  // ---------- Pestanyes ----------
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((g) => {
    const tabs = [...g.querySelectorAll<HTMLButtonElement>('[data-tab]')];
    const scope = document.getElementById(g.dataset.tabs!)!;
    const pick = (tb: HTMLButtonElement) => {
      tabs.forEach((x) => x.setAttribute('aria-selected', String(x === tb)));
      scope.querySelectorAll<HTMLElement>('[data-panel]').forEach((p) => (p.hidden = p.dataset.panel !== tb.dataset.tab));
      scope.querySelectorAll<HTMLElement>('[data-races]').forEach((r) => (r.hidden = tb.dataset.tab !== 'all' && !r.dataset.races!.split(',').includes(tb.dataset.tab!)));
      glow(null); filter();
    };
    tabs.forEach((tb, i) => {
      tb.addEventListener('click', () => pick(tb));
      tb.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]; n.focus(); pick(n); } });
    });
  });

  // ---------- Cerca de carrers ----------
  const q = document.getElementById('street-q') as HTMLInputElement | null;
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function filter() {
    if (!q) return;
    const s = norm(q.value.trim()), panel = document.querySelector<HTMLElement>('#streets [data-panel]:not([hidden])');
    if (!panel) return;
    let n = 0;
    panel.querySelectorAll<HTMLElement>('.lrow').forEach((r) => { const ok = !s || norm(r.dataset.title!).includes(s); r.hidden = !ok; if (ok) n++; });
    document.getElementById('street-count')!.textContent = String(n);
    document.getElementById('street-empty')!.hidden = n > 0;
  }
  q?.addEventListener('input', filter);

  // ---------- Simulador horari ----------
  const sim = document.getElementById('sim');
  if (sim) {
    const range = sim.querySelector<HTMLInputElement>('#sim-range')!, sw = sim.querySelector<HTMLInputElement>('#sim-on')!, play = sim.querySelector<HTMLButtonElement>('#sim-play')!;
    const out = sim.querySelector('#sim-time')!, cnt = sim.querySelector('#sim-count')!, host = document.getElementById('streets')!;
    let timer = 0;
    const apply = () => {
      simT = sw.checked ? +range.value : null;
      host.dataset.sim = sw.checked ? 'on' : 'off'; sim.dataset.sim = host.dataset.sim;
      out.textContent = hhmm(+range.value);
      range.style.setProperty('--p', `${((+range.value - +range.min) / (+range.max - +range.min)) * 100}%`);
      let closed = 0;
      host.querySelectorAll<HTMLElement>('.lrow').forEach((r) => {
        const a = mins(r.dataset.tc!), b = mins(r.dataset.tr!), t = +range.value;
        const k = t >= b ? 'done' : t >= a ? 'closed' : a - t <= 15 ? 'soon' : 'open';
        const p = r.querySelector<HTMLElement>('.st .pill'); if (p) { p.className = `pill pill-${k}`; p.textContent = T.sim[k]; }
        if (k === 'closed' && r.closest('[data-panel="all"]')) closed++;
      });
      cnt.textContent = String(closed);
      draw();
    };
    const stop = () => { clearInterval(timer); timer = 0; play.querySelector('span')!.textContent = T.sim.play; play.setAttribute('aria-pressed', 'false'); };
    range.addEventListener('input', () => { if (!sw.checked) sw.checked = true; apply(); });
    sw.addEventListener('change', () => { if (!sw.checked) stop(); apply(); });
    play.addEventListener('click', () => {
      if (timer) return stop();
      sw.checked = true; if (+range.value >= +range.max) range.value = range.min;
      play.querySelector('span')!.textContent = T.sim.pause; play.setAttribute('aria-pressed', 'true');
      timer = window.setInterval(() => { range.value = String(+range.value + 5); apply(); if (+range.value >= +range.max) stop(); }, 320);
      apply();
    });
    apply();
  }

  // ---------- Comptadors ----------
  const io = new IntersectionObserver((en) => en.forEach((e) => {
    if (!e.isIntersecting) return; io.unobserve(e.target);
    const el = e.target as HTMLElement, to = +el.dataset.countTo!, o = { v: 0 };
    gsap.to(o, { v: to, duration: reduce ? 0 : 1.1, ease: 'power3.out', onUpdate: () => (el.textContent = (el.dataset.prefix || '') + Math.round(o.v)) });
  }), { threshold: 0.6 });
  document.querySelectorAll('[data-count-to]').forEach((el) => io.observe(el));

  // ---------- Calculadora de material ----------
  const calc = document.getElementById('calc');
  if (calc) {
    const inp = (k: string) => calc.querySelector<HTMLInputElement>(`[data-n="${k}"]`)!;
    const run = () => {
      const n: Record<string, number> = { '21k': +inp('21k').value, '10k': +inp('10k').value, cam: +inp('cam').value };
      calc.querySelectorAll<HTMLElement>('[data-nv]').forEach((e) => (e.textContent = String(n[e.dataset.nv!])));
      calc.querySelector('#calc-total')!.textContent = String(n['21k'] + n['10k'] + n.cam);
      const tot = { pass: 0, water: 0, iso: 0, cups: 0, fruit: 0, tanks: 0, tables: 0, vols: 0 };
      D.aid.forEach((a) => {
        const end = a.id === 'M', runners = (a.km['21k'] != null ? n['21k'] : 0) + (a.km['10k'] != null ? n['10k'] : 0), walk = a.km.cam != null ? n.cam : 0;
        const pass = runners + walk, m = 1.1;
        const v = {
          pass, water: Math.ceil((end ? pass * 0.5 : runners * 0.2 + walk * 0.3) * m), iso: Math.ceil(runners * (end ? 0.25 : 0.15) * m),
          cups: Math.ceil((runners * 2 + (end ? walk * 2 : 0)) * m), fruit: Math.ceil((a.id === 'A3' ? runners * 0.08 : end ? pass * 0.15 : 0) * m),
          tanks: 0, tables: Math.max(2, Math.ceil(pass / 150)) + (end ? 2 : 0), vols: 3,
        };
        v.tanks = Math.ceil(v.water / 20);
        (Object.keys(v) as (keyof typeof v)[]).forEach((k) => { tot[k] += v[k]; const c = calc.querySelector(`[data-c="${a.id}-${k}"]`); if (c) c.textContent = String(v[k]); });
      });
      (Object.keys(tot) as (keyof typeof tot)[]).forEach((k) => { const c = calc.querySelector(`[data-c="T-${k}"]`); if (c) c.textContent = String(tot[k]); });
    };
    calc.querySelectorAll('input').forEach((i) => i.addEventListener('input', run)); run();
  }
}
