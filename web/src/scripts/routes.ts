import L from 'leaflet';
import gsap from 'gsap';
import data from '../data/routes.json';

type Pt = [number, number, number, number]; // lat, lon, ele, dist(m)
type Route = { points: Pt[]; kms: { km: number; lat: number; lon: number }[]; distance: number; gain: number; loss: number; minEle: number; maxEle: number };
const routes = data as unknown as Record<string, Route>;

const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!;
const panel = document.getElementById('route-panel');
if (panel) {
  const i18n = JSON.parse(panel.dataset.i18n || '{}');
  const wrap = $('#route-wrap'), mapEl = $('#route-map'), prof = $('#profile'), info = $('#hover-info');
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-route]')];
  let map: L.Map | null = null, layer: L.LayerGroup, cursor: L.CircleMarker, current = '21k', pts: Pt[] = [];
  const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

  const tween = (id: string, to: number, dec = 0) => {
    const el = document.getElementById(id)!;
    const o = { v: parseFloat(el.textContent || '0') || 0 };
    gsap.to(o, { v: to, duration: 0.8, ease: 'power3.out', onUpdate: () => (el.textContent = o.v.toFixed(dec).replace('.', ',')) });
  };

  const grade = (i: number) => {
    const a = pts[Math.max(0, i - 3)], b = pts[Math.min(pts.length - 1, i + 3)];
    const dd = b[3] - a[3];
    return dd ? ((b[2] - a[2]) / dd) * 100 : 0;
  };

  function initMap() {
    map = L.map(mapEl, { zoomControl: true, scrollWheelZoom: false, attributionControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
    layer = L.layerGroup().addTo(map);
    cursor = L.circleMarker([0, 0], { radius: 8, color: '#fff', weight: 3, fillColor: css('--accent') || '#0b5cad', fillOpacity: 1 });
    map.on('focus', () => map!.scrollWheelZoom.enable());
    map.on('blur', () => map!.scrollWheelZoom.disable());
  }

  function show(id: string) {
    current = id;
    const r = routes[id];
    pts = r.points;
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.route === id)));
    ($('#gpx-dl') as HTMLAnchorElement).href = `/gpx/${id}.gpx`;
    tween('st-dist', r.distance, 2); tween('st-gain', r.gain); tween('st-loss', r.loss);
    $('#st-alt').textContent = `${r.minEle}–${r.maxEle}`;

    if (!map) initMap();
    layer.clearLayers();
    const ll = pts.map((p) => [p[0], p[1]] as [number, number]);
    L.polyline(ll, { color: '#fff', weight: 9, opacity: 0.9 }).addTo(layer);
    const line = L.polyline(ll, { color: css('--accent') || '#0b5cad', weight: 5, lineCap: 'round' }).addTo(layer);
    line.on('mousemove', (e) => moveTo(nearest(e.latlng), false));
    line.on('mouseout', hideCursor);
    r.kms.forEach((k) => L.marker([k.lat, k.lon], { interactive: false, icon: L.divIcon({ className: 'km-pin', html: String(k.km), iconSize: [22, 22] }) }).addTo(layer));
    L.marker(ll[0], { title: i18n.start, icon: L.divIcon({ className: '', html: `<div style="background:#16a34a;color:#fff;border:3px solid #fff;border-radius:999px;width:26px;height:26px;display:grid;place-items:center;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,.4)" aria-label="${i18n.start}">⚑</div>`, iconSize: [26, 26], iconAnchor: [13, 13] }) }).addTo(layer);
    map!.fitBounds(line.getBounds(), { padding: [30, 30], animate: false });
    drawProfile();
  }

  const nearest = (ll: L.LatLng) => {
    let best = 0, bd = Infinity;
    pts.forEach((p, i) => { const d = (p[0] - ll.lat) ** 2 + (p[1] - ll.lng) ** 2; if (d < bd) { bd = d; best = i; } });
    return best;
  };

  // ---------- Perfil d'elevació (SVG propi) ----------
  let svg: SVGSVGElement, geo = { w: 0, h: 0, l: 38, r: 8, t: 10, b: 22, max: 1, lo: 0, hi: 1 };
  function drawProfile() {
    const w = prof.clientWidth, h = prof.clientHeight;
    if (!w || !h) return;
    const r = routes[current];
    const lo = Math.floor((r.minEle - 5) / 10) * 10, hi = Math.ceil((r.maxEle + 5) / 10) * 10;
    geo = { ...geo, w, h, max: pts[pts.length - 1][3], lo, hi };
    const x = (d: number) => geo.l + (d / geo.max) * (w - geo.l - geo.r);
    const y = (e: number) => geo.t + (1 - (e - lo) / (hi - lo)) * (h - geo.t - geo.b);
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p[3]).toFixed(1)} ${y(p[2]).toFixed(1)}`).join('');
    const area = `${line}L${x(geo.max)} ${h - geo.b}L${x(0)} ${h - geo.b}Z`;
    const step = geo.max > 15000 ? 5000 : geo.max > 8000 ? 2000 : 1000;
    let grid = '';
    for (let d = 0; d <= geo.max; d += step) grid += `<text x="${x(d)}" y="${h - 5}" text-anchor="middle" font-size="11" fill="${css('--muted')}">${d / 1000}</text>`;
    for (let k = 0; k <= 3; k++) {
      const e = lo + ((hi - lo) * k) / 3;
      grid += `<line x1="${geo.l}" x2="${w - geo.r}" y1="${y(e)}" y2="${y(e)}" stroke="${css('--line')}"/><text x="${geo.l - 6}" y="${y(e) + 4}" text-anchor="end" font-size="11" fill="${css('--muted')}">${Math.round(e)}</text>`;
    }
    prof.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">
      <defs><linearGradient id="pg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${css('--accent')}" stop-opacity=".55"/><stop offset="1" stop-color="${css('--accent')}" stop-opacity=".03"/></linearGradient></defs>
      ${grid}<path d="${area}" fill="url(#pg)"/><path id="pline" d="${line}" fill="none" stroke="${css('--accent')}" stroke-width="2.5" stroke-linejoin="round"/>
      <g id="pcur" style="display:none"><line id="pcl" y1="${geo.t}" y2="${h - geo.b}" stroke="${css('--fg')}" stroke-width="1.5" stroke-dasharray="3 3"/><circle id="pcd" r="5.5" fill="${css('--accent')}" stroke="#fff" stroke-width="2.5"/></g></svg>`;
    svg = prof.firstElementChild as SVGSVGElement;
    const path = svg.querySelector<SVGPathElement>('#pline')!;
    const len = path.getTotalLength();
    gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', onComplete: () => path.removeAttribute('stroke-dasharray') });
  }

  function moveTo(i: number, fromChart = true) {
    const p = pts[i], w = geo.w, h = geo.h;
    const x = geo.l + (p[3] / geo.max) * (w - geo.l - geo.r);
    const y = geo.t + (1 - (p[2] - geo.lo) / (geo.hi - geo.lo)) * (h - geo.t - geo.b);
    const g = svg.querySelector<SVGGElement>('#pcur')!; g.style.display = '';
    svg.querySelector('#pcl')!.setAttribute('x1', String(x)); svg.querySelector('#pcl')!.setAttribute('x2', String(x));
    svg.querySelector('#pcd')!.setAttribute('cx', String(x)); svg.querySelector('#pcd')!.setAttribute('cy', String(y));
    const gr = grade(i);
    info.textContent = `${(p[3] / 1000).toFixed(2).replace('.', ',')} km · ${Math.round(p[2])} m · ${i18n.grade} ${gr > 0 ? '+' : ''}${gr.toFixed(1).replace('.', ',')}%`;
    if (map && fromChart !== undefined) {
      if (!map.hasLayer(cursor)) cursor.addTo(map);
      cursor.setLatLng([p[0], p[1]]);
    }
  }
  function hideCursor() { svg?.querySelector<SVGGElement>('#pcur')!.style.setProperty('display', 'none'); info.innerHTML = '&nbsp;'; if (map?.hasLayer(cursor)) cursor.remove(); }

  prof.addEventListener('pointermove', (e) => {
    const rect = prof.getBoundingClientRect();
    const d = ((e.clientX - rect.left - geo.l) / (geo.w - geo.l - geo.r)) * geo.max;
    let lo = 0, hi = pts.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; pts[m][3] < d ? (lo = m + 1) : (hi = m); }
    moveTo(Math.max(0, Math.min(pts.length - 1, lo)));
  });
  prof.addEventListener('pointerleave', hideCursor);

  // ---------- Pestanyes, ampliar, tema ----------
  tabs.forEach((t) => t.addEventListener('click', () => show(t.dataset.route!)));
  document.querySelectorAll<HTMLElement>('[data-route-link]').forEach((a) => a.addEventListener('click', () => show(a.dataset.routeLink!)));
  tabs.forEach((t, i) => t.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]; n.focus(); show(n.dataset.route!); }
  }));

  const btn = $('#map-expand'), label = $('#map-expand-label');
  const toggleFull = (on = !wrap.classList.contains('is-full')) => {
    wrap.classList.toggle('is-full', on);
    document.body.style.overflow = on ? 'hidden' : '';
    label.textContent = on ? i18n.collapse : i18n.expand;
    setTimeout(() => { map?.invalidateSize(); drawProfile(); map?.fitBounds(L.latLngBounds(pts.map((p) => [p[0], p[1]] as [number, number])), { padding: [30, 30] }); }, 60);
  };
  btn.addEventListener('click', () => toggleFull());
  addEventListener('keydown', (e) => e.key === 'Escape' && wrap.classList.contains('is-full') && toggleFull(false));
  new ResizeObserver(() => pts.length && drawProfile()).observe(prof);
  new MutationObserver(() => pts.length && show(current)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  show((window as any).__pendingRoute || '21k');
}
