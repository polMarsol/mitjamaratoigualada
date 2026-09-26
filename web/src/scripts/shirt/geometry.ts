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

const NL: P = [558, 62], SL: P = [367, 118], SO: P = [120, 340], SI: P = [281, 518], AP: P = [330, 410], HL: P = [324, 1100];
const NR = mirror(NL), SLr = mirror(SL), SOr = mirror(SO), SIr = mirror(SI), APr = mirror(AP), HR = mirror(HL);

export interface Outline { pts: P[]; tags: Tag[]; neck: P[] }
export function outline(kind: 'front' | 'back'): Outline {
  const pts: P[] = [], tags: Tag[] = [];
  const add = (a: P, b: P, tag: Tag, step = 10) => dense(a, b, step).forEach((p) => { pts.push(p); tags.push(tag); });
  add(NL, SL, 'seam'); add(SL, SO, 'seam'); add(SO, SI, 'open'); add(SI, AP, 'seam'); add(AP, HL, 'seam'); add(HL, HR, 'open', 10);
  add(HR, APr, 'seam'); add(APr, SIr, 'seam'); add(SIr, SOr, 'open'); add(SOr, SLr, 'seam'); add(SLr, NR, 'seam');
  // coll: de NR a NL (davant més baix que darrere)
  const mid: P = kind === 'front' ? [700, 215] : [700, 98];
  const c1 = kind === 'front' ? [[838, 140], [780, 215]] : [[820, 88], [760, 98]];
  const c2 = kind === 'front' ? [[620, 215], [562, 140]] : [[640, 98], [580, 88]];
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
    const sl = smooth(350, 410, Math.abs(x - CX));         // mànigues més primes
    const amp = A * (1 - 0.45 * sl) * (1 - 0.1 * Math.pow((y - 520) / 600, 2));
    const t = Math.min(1, dd.d / R), f = Math.sqrt(1 - (1 - t) * (1 - t));
    return amp * f + C * (1 - smooth(0, 60, dd.dOpen)) * (1 - 0.35 * sl);
  };
  return { outline: o, dists, heightAt, inside: (x: number, y: number) => inside(x, y, o.pts) };
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
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  const dd = pts.map((p) => surf.dists(p[0], p[1]));
  pts.forEach((p, i) => {
    const z = sign * surf.heightAt(p[0], p[1], dd[i]);
    pos.push((p[0] - CX) * S, (CY - p[1]) * S, z * S);
    uv.push(kind === 'front' ? p[0] / W : 1 - p[0] / W, 1 - p[1] / H);
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
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

/** Coll de canalé: tub al voltant de l'obertura (davant a +z, darrere a −z) */
export function buildCollar(front: Surface, back: Surface): THREE.Mesh {
  const f = front.outline.neck.slice(0, -1), b = back.outline.neck.slice(0, -1);
  const v = (p: P, s: number) => new THREE.Vector3((p[0] - CX) * S, (CY - p[1]) * S, s * C * S);
  const loop = [...f.map((p) => v(p, 1)), ...[...b].reverse().map((p) => v(p, -1))];
  const curve = new THREE.CatmullRomCurve3(loop, true, 'centripetal');
  const geo = new THREE.TubeGeometry(curve, 320, 0.026, 10, true);
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x0d2233, roughness: 0.9 }));
  return m;
}
