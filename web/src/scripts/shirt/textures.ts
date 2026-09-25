// Textures de la samarreta (canvas 2D): colors de la paleta, tall en zig-zag amb les tisores de Cal Font, logos, bandera i patrocinadors.
import { W, H, CX, type P } from './geometry';
import { SPONSORS, type Shape } from '../../data/sponsors';

export const K = 1.5; // px per unitat de disseny
export const PAL = { blue: '#0b5cad', teal: '#0e7f8c', green: '#1a7a50', navy: '#0d2233', mist: '#eaf3f6' };
const FONT_D = '"Bricolage Grotesque Variable", system-ui, sans-serif', FONT_S = '"Instrument Sans Variable", system-ui, sans-serif';

const loadImg = (src: string) => new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
export async function loadAssets() {
  await Promise.all([document.fonts.load(`800 40px ${FONT_D}`), document.fonts.load(`700 20px ${FONT_S}`), document.fonts.load(`600 20px ${FONT_S}`)]);
  const [mono, horiz] = await Promise.all([loadImg('/brand/logo-mono-blanc.svg'), loadImg('/brand/logo-horitzontal.svg')]);
  return { mono, horiz };
}
export type Assets = Awaited<ReturnType<typeof loadAssets>>;

// ---------- Línia de tall: de dalt-esquerra a baix (en zig-zag) ----------
const Z0: P = [585, 84], Z1: P = [842, 1100];
const dir = (() => { const dx = Z1[0] - Z0[0], dy = Z1[1] - Z0[1], l = Math.hypot(dx, dy); return { x: dx / l, y: dy / l, l }; })();
export const CUT = { Z0, Z1, dir, tFront: 0.5 };            // t on acaba el tall obert (on són les tisores)
const norm = { x: -dir.y, y: dir.x };
export const zzPoint = (t: number, off = 0): P => [Z0[0] + dir.x * dir.l * t + norm.x * off, Z0[1] + dir.y * dir.l * t + norm.y * off];
function zigPts(t0: number, t1: number, offFn: (t: number) => number = () => 0, amp = 13, step = 19): P[] {
  const n = Math.max(2, Math.round(((t1 - t0) * dir.l) / step)), out: P[] = [];
  for (let i = 0; i <= n; i++) { const t = t0 + ((t1 - t0) * i) / n; out.push(zzPoint(t, offFn(t) + (i % 2 ? amp : -amp))); }
  return out;
}
const kerfW = (t: number) => 52 * Math.pow(Math.max(0, 1 - t / CUT.tFront), 0.9);

// ---------- Cos: zones de color, mànigues difuminades ----------
function drawBody(ctx: CanvasRenderingContext2D, mirrored: boolean) {
  ctx.save(); ctx.scale(K, K);
  if (mirrored) { ctx.translate(W, 0); ctx.scale(-1, 1); }
  // zona esquerra (blau)
  let g = ctx.createLinearGradient(0, 0, 400, H);
  g.addColorStop(0, '#0b5cad'); g.addColorStop(0.55, '#0a66b4'); g.addColorStop(1, '#0e7f8c');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // zona dreta (verd) retallada pel zig-zag
  const zz = zigPts(-0.12, 1.14);
  ctx.beginPath(); ctx.moveTo(zz[0][0], zz[0][1]); zz.forEach((p) => ctx.lineTo(p[0], p[1])); ctx.lineTo(W, H + 100); ctx.lineTo(W, -100); ctx.closePath();
  g = ctx.createLinearGradient(W, 0, 700, H);
  g.addColorStop(0, '#22996a'); g.addColorStop(0.6, '#1a7a50'); g.addColorStop(1, '#0f6a48');
  ctx.fillStyle = g; ctx.fill();
  // ecos del tall (com el paviment de Cal Font: teixit estripat)
  ctx.lineJoin = 'round';
  for (const [o, a] of [[-52, 0.16], [-96, 0.1], [-140, 0.06], [52, 0.16], [96, 0.1], [140, 0.06]] as const) {
    ctx.beginPath(); zigPts(-0.12, 1.14, () => o, 13, 19).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineWidth = 3; ctx.stroke();
  }
  // mànigues: la de l'esquerra és VERDA i la de la dreta BLAVA, difuminades cap al cos
  const fade = (x0: number, x1: number, col: string) => {
    const gr = ctx.createLinearGradient(x0, 0, x1, 0);
    gr.addColorStop(0, col); gr.addColorStop(0.55, col.replace('1)', '0.85)')); gr.addColorStop(1, col.replace('1)', '0)'));
    ctx.fillStyle = gr; ctx.fillRect(Math.min(x0, x1), 0, Math.abs(x1 - x0), 660);
  };
  fade(150, 400, 'rgba(26,122,80,1)');
  const gr = ctx.createLinearGradient(1250, 0, 1000, 0);
  gr.addColorStop(0, 'rgba(11,92,173,1)'); gr.addColorStop(0.55, 'rgba(11,92,173,0.85)'); gr.addColorStop(1, 'rgba(11,92,173,0)');
  ctx.fillStyle = gr; ctx.fillRect(1000, 0, 400, 660);
  ctx.restore();
}

// ---------- Escuts ----------
function shieldPath(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2, -h / 2); ctx.lineTo(w / 2, h * 0.05);
  ctx.quadraticCurveTo(w / 2, h * 0.4, 0, h / 2); ctx.quadraticCurveTo(-w / 2, h * 0.4, -w / 2, h * 0.05); ctx.closePath();
}
/** Armes d'Igualada: les de la Ciutat Comtal (quarterades: creu de Sant Jordi / quatre barres) amb les aigües a la part baixa. */
function arms(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) { // rectangle w×h centrat a (x,y)
  ctx.save(); ctx.translate(x - w / 2, y - h / 2);
  const cw = w / 2, ch = h / 2;
  const cross = (ox: number, oy: number) => { ctx.fillStyle = '#c8102e'; ctx.fillRect(ox, oy, cw, ch); ctx.fillStyle = '#fff'; ctx.fillRect(ox + cw * 0.4, oy, cw * 0.2, ch); ctx.fillRect(ox, oy + ch * 0.4, cw, ch * 0.2); };
  const bars = (ox: number, oy: number) => { ctx.fillStyle = '#f5c400'; ctx.fillRect(ox, oy, cw, ch); ctx.fillStyle = '#c8102e'; for (let i = 0; i < 4; i++) ctx.fillRect(ox + cw * (1 / 9 + (i * 2) / 9), oy, cw / 9, ch); };
  cross(0, 0); bars(cw, 0); bars(0, ch); cross(cw, ch);
  // aigües (Aqualata) a la part baixa
  const wy = h * 0.78; ctx.fillStyle = '#1b6fb5'; ctx.fillRect(0, wy, w, h - wy);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = Math.max(1.4, h * 0.03);
  for (let r = 0; r < 2; r++) { ctx.beginPath(); for (let i = 0; i <= 8; i++) { const px = (w * i) / 8, py = wy + h * (0.07 + r * 0.09) + (i % 2 ? -h * 0.025 : h * 0.025); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
  ctx.restore();
}
function ajIgualada(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  const h = w * 1.18;
  ctx.save(); ctx.translate(x, y - 10);
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 8; shieldPath(ctx, w, h); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowBlur = 0;
  ctx.save(); shieldPath(ctx, w - 8, h - 8); ctx.clip(); arms(ctx, 0, 0, w - 8, h - 8); ctx.restore();
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = `700 ${w * 0.15}px ${FONT_S}`;
  ctx.fillText('AJUNTAMENT', 0, h / 2 + w * 0.2); ctx.font = `800 ${w * 0.19}px ${FONT_D}`; ctx.fillText('D’IGUALADA', 0, h / 2 + w * 0.4);
  ctx.restore();
}
function ajVilanova(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) { // logo provisional
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.fillStyle = 'rgba(255,255,255,.12)';
  shieldPath(ctx, w, w * 1.15); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = `800 ${w * 0.5}px ${FONT_D}`; ctx.fillText('VC', 0, w * 0.18);
  ctx.font = `700 ${w * 0.15}px ${FONT_S}`; ctx.fillText('AJUNTAMENT', 0, w * 0.86); ctx.fillText('VILANOVA DEL CAMÍ', 0, w * 1.03);
  ctx.restore();
}
function entitat(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) { // entitat col·laboradora (p. ex. CAI): provisional
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.fillStyle = 'rgba(255,255,255,.12)';
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = `800 ${r * 0.85}px ${FONT_D}`; ctx.fillText('CAI', 0, r * 0.3);
  ctx.font = `700 ${r * 0.24}px ${FONT_S}`; ctx.fillText('ENTITAT COL·LABORADORA', 0, r + 22);
  ctx.restore();
}

// ---------- Tisores de Cal Font ----------
function scissors(ctx: CanvasRenderingContext2D, x: number, y: number, ang: number, s = 1) {
  const L = 158, open = 0.115;
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  ctx.shadowColor = 'rgba(0,10,20,.55)'; ctx.shadowBlur = 16; ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 8;
  const blade = (sgn: number) => {
    ctx.save(); ctx.rotate(sgn * open);
    const g = ctx.createLinearGradient(0, -12, 0, 12); g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, '#c9d6de'); g.addColorStop(1, '#8ea2af');
    ctx.beginPath(); ctx.moveTo(-26, -11); ctx.lineTo(L, sgn * -1.5); ctx.lineTo(L + 2, sgn * 1.5); ctx.lineTo(-26, 11); ctx.closePath();
    ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = PAL.navy; ctx.stroke();
    ctx.restore();
  };
  const handle = (sgn: number) => {
    ctx.save(); ctx.rotate(sgn * open);
    ctx.lineCap = 'round'; ctx.strokeStyle = PAL.navy; ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-84, -sgn * 30); ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-84, -sgn * 30); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-112, -sgn * 40, 34, 25, sgn * 0.5, 0, Math.PI * 2);
    ctx.strokeStyle = PAL.navy; ctx.lineWidth = 19; ctx.stroke(); ctx.strokeStyle = '#eaf3f6'; ctx.lineWidth = 11; ctx.stroke();
    ctx.restore();
  };
  handle(1); handle(-1); blade(1); blade(-1);
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = PAL.navy; ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-1.5, -1.5, 3.4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawFront(ctx: CanvasRenderingContext2D, a: Assets) {
  ctx.save(); ctx.scale(K, K); ctx.lineJoin = 'round';
  const tf = CUT.tFront;
  // tall obert (kerf): de dalt fins on són les tisores
  const L = zigPts(-0.06, tf, (t) => -kerfW(t) / 2, 11, 17), Rr = zigPts(-0.06, tf, (t) => kerfW(t) / 2, 11, 17);
  ctx.save();
  ctx.beginPath(); L.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); [...Rr].reverse().forEach((p) => ctx.lineTo(p[0], p[1])); ctx.closePath();
  const gk = ctx.createLinearGradient(...zzPoint(-0.06), ...zzPoint(tf)); gk.addColorStop(0, '#020a10'); gk.addColorStop(1, '#0a2433');
  ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 14; ctx.fillStyle = gk; ctx.fill(); ctx.shadowBlur = 0; ctx.clip();
  // interior del tall: ombra viva a les vores
  ctx.strokeStyle = 'rgba(0,0,0,.8)'; ctx.lineWidth = 16; [L, Rr].forEach((edge) => { ctx.beginPath(); edge.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); });
  ctx.restore();
  // vores del tall (teixit tallat, línia clara)
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2.2;
  [L, Rr].forEach((edge) => { ctx.beginPath(); edge.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); });
  // per tallar: línia de punts en zig-zag fins a baix
  ctx.save(); ctx.setLineDash([15, 11]); ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 3.2; ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 3;
  ctx.beginPath(); zigPts(tf, 1.06, () => 0, 13, 19).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
  // tisores just davant de l'obertura
  const tip = zzPoint(tf, 0), ang = Math.atan2(dir.y, dir.x);
  scissors(ctx, tip[0] - dir.x * 158, tip[1] - dir.y * 158, ang);
  // escut MM (pit esquerre) i Ajuntament d'Igualada (pit dret)
  ctx.drawImage(a.mono, 372, 236, 165, 171);
  ajIgualada(ctx, 918, 300, 104);
  // mànigues: Vilanova (esquerra, verda) i entitat (dreta, blava)
  ctx.save(); ctx.translate(232, 352); ctx.rotate(0.84); ajVilanova(ctx, 0, 0, 84); ctx.restore();
  ctx.save(); ctx.translate(1168, 352); ctx.rotate(-0.84); entitat(ctx, 0, 0, 44); ctx.restore();
  ctx.restore();
}

// ---------- Patrocinadors (marques FICTÍCIES, en blanc) ----------
const SHAPES: Record<Shape, (c: CanvasRenderingContext2D) => void> = {
  mountain: (c) => { c.fill(new Path2D('M3 33 16 11l7 11 5-7 9 18Z')); },
  wave: (c) => { c.lineWidth = 5; c.lineCap = 'round'; c.stroke(new Path2D('M2 22q6-12 12 0t12 0 12 0')); },
  leaf: (c) => { c.fill(new Path2D('M7 33C7 15 19 7 34 7c0 15-8 26-27 26Z')); },
  hex: (c) => { c.fill(new Path2D('M20 3l14 8v18l-14 8-14-8V11Z')); },
  bolt: (c) => { c.fill(new Path2D('M23 2 8 23h10l-3 15 17-22H21Z')); },
  ring: (c) => { c.lineWidth = 5; c.beginPath(); c.arc(20, 20, 14, 0, 7); c.stroke(); c.beginPath(); c.arc(20, 20, 4.5, 0, 7); c.fill(); },
  arrow: (c) => { c.lineWidth = 5; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(new Path2D('M5 20h27M21 9l11 11-11 11')); },
  sun: (c) => { c.beginPath(); c.arc(20, 20, 8, 0, 7); c.fill(); c.lineWidth = 3.5; c.lineCap = 'round'; c.stroke(new Path2D('M20 3v6M20 31v6M3 20h6M31 20h6M8 8l4 4M28 28l4 4M32 8l-4 4M12 28l-4 4')); },
};
function sponsor(ctx: CanvasRenderingContext2D, name: string, shape: Shape, cx: number, cy: number, size: number) {
  ctx.save(); ctx.font = `800 ${size * 0.6}px ${FONT_D}`;
  const tw = ctx.measureText(name).width, total = size + size * 0.25 + tw, x0 = cx - total / 2;
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff';
  ctx.save(); ctx.translate(x0, cy - size / 2); ctx.scale(size / 40, size / 40); SHAPES[shape](ctx); ctx.restore();
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(name, x0 + size * 1.25, cy + size * 0.04);
  ctx.restore();
}
function flag(ctx: CanvasRenderingContext2D, cx: number, cy: number) { // 7 cm × 5 cm
  const w = 7 * 14.2, h = 5 * 14.2;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 5; ctx.fillStyle = '#fff'; ctx.fillRect(cx - w / 2 - 2, cy - h / 2 - 2, w + 4, h + 4); ctx.shadowBlur = 0;
  arms(ctx, cx, cy, w, h);
  ctx.restore();
}
function drawBackExtras(ctx: CanvasRenderingContext2D) {
  ctx.save(); ctx.scale(K, K);
  flag(ctx, CX, 178); // a l'alçada de la clivella/nuca
  ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.textAlign = 'center'; ctx.font = `700 16px ${FONT_S}`;
  if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '5px';
  ctx.fillText('MITJA MARATÓ D’IGUALADA · 2026', CX, 780);
  if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px';
  const m = SPONSORS.main[0]; sponsor(ctx, m.name, m.shape, CX, 846, 62);          // principal: al mig
  const p = SPONSORS.partners, px = [-178, 178, -178, 178], py = [928, 928, 972, 972];
  p.forEach((s, i) => sponsor(ctx, s.name, s.shape, CX + px[i], py[i], 28));
  const l = SPONSORS.local, lx = [-236, 0, 236, -236, 0, 236], ly = [1020, 1020, 1020, 1054, 1054, 1054];
  l.forEach((s, i) => sponsor(ctx, s.name, s.shape, CX + lx[i], ly[i], 19));
  ctx.restore();
}

function stitchZig(ctx: CanvasRenderingContext2D) { // al darrere el zig-zag és una costura
  ctx.save(); ctx.scale(K, K); ctx.translate(W, 0); ctx.scale(-1, 1);
  ctx.setLineDash([9, 8]); ctx.strokeStyle = 'rgba(255,255,255,.65)'; ctx.lineWidth = 2.4;
  ctx.beginPath(); zigPts(-0.12, 1.14, () => 0, 13, 19).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  ctx.restore();
}

export function makeCanvas() { const c = document.createElement('canvas'); c.width = Math.round(W * K); c.height = Math.round(H * K); return c; }
export function frontTexture(a: Assets) { const c = makeCanvas(), x = c.getContext('2d')!; drawBody(x, false); drawFront(x, a); return c; }
export function backTexture() { const c = makeCanvas(), x = c.getContext('2d')!; drawBody(x, true); stitchZig(x); drawBackExtras(x); return c; }
export function weaveTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!;
  x.fillStyle = '#808080'; x.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 128; i += 2) { x.fillStyle = `rgba(0,0,0,${0.10 + Math.random() * 0.1})`; x.fillRect(0, i, 128, 1); x.fillStyle = `rgba(255,255,255,${0.08 + Math.random() * 0.1})`; x.fillRect(i, 0, 1, 128); }
  return c;
}
export function bibTexture(a: Assets) {
  const c = document.createElement('canvas'); c.width = 810; c.height = 580; const x = c.getContext('2d')!;
  x.fillStyle = '#fff'; x.beginPath(); x.roundRect(0, 0, 810, 580, 26); x.fill();
  x.strokeStyle = '#d5e0e6'; x.lineWidth = 6; x.stroke();
  x.drawImage(a.horiz, 34, 30, 420, 126);
  x.fillStyle = PAL.navy; x.beginPath(); x.roundRect(610, 44, 160, 74, 37); x.fill();
  x.fillStyle = '#fff'; x.font = `800 46px ${FONT_D}`; x.textAlign = 'center'; x.fillText('21K', 690, 96);
  x.fillStyle = PAL.navy; x.font = `800 250px ${FONT_D}`; x.fillText('0421', 405, 400);
  x.font = `700 26px ${FONT_S}`; x.fillStyle = '#45606f'; x.fillText('13 DE DESEMBRE 2026 · IGUALADA · XIP', 405, 520);
  x.fillStyle = '#c5d2d9'; [[28, 28], [782, 28], [28, 552], [782, 552]].forEach(([px, py]) => { x.beginPath(); x.arc(px, py, 9, 0, 7); x.fill(); });
  return c;
}
