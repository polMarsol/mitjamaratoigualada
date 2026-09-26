// Geometria de la samarreta: silueta 2D (unitats de disseny, 1 cm ≈ 14,2 u) → malla inflada davant/darrere.
import * as THREE from 'three';
import Delaunator from 'delaunator';

export const W = 1400, H = 1180, CX = 700, CY = 590, S = 0.0022, UCM = 14.2;
export type P = [number, number];
type Tag = 'seam' | 'open' | 'neck';
const mirror = (p: P): P => [2 * CX - p[0], p[1]];
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const cubic = (p0: P, p1: P, p2: P, p3: P, n: number): P[] =>
  Array.from({ length: n }, (_, i) => { const t = i / n, u = 1 - t; return [u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0], u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]] as P; });
const dense = (a: P, b: P, step: number): P[] => { const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step)); return Array.from({ length: n }, (_, i) => lerp(a, b, i / n)); };

const NL: P = [512, 62], SL: P = [335, 155], SO: P = [105, 420], SI: P = [262, 545], AP: P = [318, 470], HL: P = [322, 1100];
const NR = mirror(NL), SLr = mirror(SL), SOr = mirror(SO), SIr = mirror(SI), APr = mirror(AP), HR = mirror(HL);

export interface Outline { pts: P[]; tags: Tag[]; neck: P[] }
export function outline(kind: 'front' | 'back'): Outline {
  const pts: P[] = [], tags: Tag[] = [];
  const add = (a: P, b: P, tag: Tag, step = 10) => dense(a, b, step).forEach((p) => { pts.push(p); tags.push(tag); });
  add(NL, SL, 'seam'); add(SL, SO, 'seam'); add(SO, SI, 'open'); add(SI, AP, 'seam'); add(AP, HL, 'seam'); add(HL, HR, 'open', 10);
  add(HR, APr, 'seam'); add(APr, SIr, 'seam'); add(SIr, SOr, 'open'); add(SOr, SLr, 'seam'); add(SLr, NR, 'seam');
  // coll: de NR a NL (davant més baix que darrere)
  const mid: P = kind === 'front' ? [700, 192] : [700, 102];
  const c1 = kind === 'front' ? [[884, 130], [790, 192]] : [[850, 90], [770, 102]];
  const c2 = kind === 'front' ? [[610, 192], [516, 130]] : [[630, 102], [550, 90]];
  const neck = [...cubic(NR, c1[0] as P, c1[1] as P, mid, 22), ...cubic(mid, c2[0] as P, c2[1] as P, NL, 22)];
  neck.forEach((p) => { pts.push(p); tags.push('neck'); });
  return { pts, tags, neck: [...neck, NL] };
}

const segDist = (x: number, y: number, a: P, b: P) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / l2));
  return Math.hypot(x - (a[0] + dx * t), y - (a[1] + dy * t));
};
function inside(x: number, y: number, poly: P[]) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
const smooth = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

const A = 150, R = 300, C = 42; // gruix, radi d'inflat, mig-obertura de coll/baix/punys
export function makeSurface(kind: 'front' | 'back') {
  const o = outline(kind), n = o.pts.length;
  const dists = (x: number, y: number) => {
    let d = Infinity, dOpen = Infinity;
    for (let i = 0; i < n; i++) {
      const dd = segDist(x, y, o.pts[i], o.pts[(i + 1) % n]);
      if (dd < d) d = dd;
      if (o.tags[i] !== 'seam' && dd < dOpen) dOpen = dd;
    }
    return { d, dOpen };
  };
  const heightAt = (x: number, y: number, dd = dists(x, y)) => {
    const dx = Math.abs(x - CX), sl = smooth(372, 430, dx);                     // 0 = cos, 1 = màniga
    const cuff = smooth(430, 600, dx);
    const amp = A * (1 - 0.30 * sl) * (1 - 0.22 * cuff) * (1 + 0.06 * Math.sin(((y - 200) / 900) * Math.PI));
    const t = Math.min(1, dd.d / R), f = Math.sqrt(1 - (1 - t) * (1 - t));
    const folds = 4.5 * Math.sin(y * 0.022 + x * 0.007) + 3 * Math.sin(x * 0.03 - y * 0.011) * (0.4 + 0.6 * smooth(200, 900, y)); // plecs suaus del teixit
    return amp * f + C * (1 - smooth(0, 60, dd.dOpen)) * (1 + 0.45 * sl) + folds * f * (1 - 0.85 * sl);
  };
  // ombra d'oclusió (fosc a costures, aixella i sota el coll) → colors de vèrtex
  const aoAt = (x: number, y: number, dd: { d: number; dOpen: number }) => {
    let ao = 0.78 + 0.22 * smooth(0, 100, dd.d);
    const dl = Math.hypot(x - AP[0], y - AP[1]), dr = Math.hypot(x - APr[0], y - APr[1]);
    ao *= 0.72 + 0.28 * smooth(0, 120, Math.min(dl, dr));
    return ao;
  };
  return { outline: o, dists, heightAt, aoAt, inside: (x: number, y: number) => inside(x, y, o.pts) };
}
export type Surface = ReturnType<typeof makeSurface>;

export function buildPanel(surf: Surface, kind: 'front' | 'back'): THREE.BufferGeometry {
  const o = surf.outline, pts: P[] = o.pts.map((p) => [...p] as P);
  const step = 15;
  for (let y = 66, row = 0; y < 1100; y += step * 0.866, row++) {
    for (let x = 100 + (row % 2) * step * 0.5; x < 1300; x += step) {
      if (!surf.inside(x, y)) continue;
      if (surf.dists(x, y).d < 7) continue;
      pts.push([x, y]);
    }
  }
  const coords = new Float64Array(pts.length * 2);
  pts.forEach((p, i) => { coords[2 * i] = p[0]; coords[2 * i + 1] = p[1]; });
  const tri = new Delaunator(coords).triangles;
  const sign = kind === 'front' ? 1 : -1;
  const pos: number[] = [], uv: number[] = [], idx: number[] = [], col: number[] = [];
  const dd = pts.map((p) => surf.dists(p[0], p[1]));
  pts.forEach((p, i) => {
    const z = sign * surf.heightAt(p[0], p[1], dd[i]);
    pos.push((p[0] - CX) * S, (CY - p[1]) * S, z * S);
    uv.push(kind === 'front' ? p[0] / W : 1 - p[0] / W, 1 - p[1] / H);
    const ao = surf.aoAt(p[0], p[1], dd[i]); col.push(ao, ao, ao);
  });
  for (let i = 0; i < tri.length; i += 3) {
    const a = tri[i], b = tri[i + 1], c = tri[i + 2];
    const cx = (pts[a][0] + pts[b][0] + pts[c][0]) / 3, cy = (pts[a][1] + pts[b][1] + pts[c][1]) / 3;
    if (!surf.inside(cx, cy)) continue;
    const e = Math.max(Math.hypot(pts[a][0] - pts[b][0], pts[a][1] - pts[b][1]), Math.hypot(pts[b][0] - pts[c][0], pts[b][1] - pts[c][1]), Math.hypot(pts[a][0] - pts[c][0], pts[a][1] - pts[c][1]));
    if (e > 48) continue;
    // orientació segons la normal (x dreta, y amunt): davant ha de mirar +z, darrere -z
    const ax = pts[b][0] - pts[a][0], ay = -(pts[b][1] - pts[a][1]), bx = pts[c][0] - pts[a][0], by = -(pts[c][1] - pts[a][1]);
    const cr = ax * by - ay * bx;
    if ((cr > 0) === (kind === 'front')) idx.push(a, b, c); else idx.push(a, c, b);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

/** Coll de canalé: tub al voltant de l'obertura (davant a +z, darrere a −z) */
export function buildCollar(front: Surface, back: Surface): THREE.Mesh {
  const f = front.outline.neck.slice(0, -1), b = back.outline.neck.slice(0, -1);
  const v = (p: P, s: number) => new THREE.Vector3((p[0] - CX) * S, (CY - p[1]) * S, s * C * S);
  const loop = [...f.map((p) => v(p, 1)), ...[...b].reverse().map((p) => v(p, -1))];
  const curve = new THREE.CatmullRomCurve3(loop, true, 'centripetal');
  const geo = new THREE.TubeGeometry(curve, 360, 0.031, 12, true);
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x0d2233, roughness: 0.9 }));
  return m;
}
