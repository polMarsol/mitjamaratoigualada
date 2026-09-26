// Dissenys de la samarreta (v2). Tres prototips: A «Tisores» (blau/verd), B «Rajoles» (blanca de quadrats), C «Nit» (blau nit).
// Disposició: escut d'Igualada a l'ESQUERRA del pit, logo MM a la DRETA; tall en zig-zag de dalt-dreta a baix-esquerra;
// tisores gràfiques de dalt a baix amb les fulles DINS del tall; riu Anoia en ones horitzontals al baix; coll de quadrats de Cal Font;
// al darrere, silueta de la xemeneia de la plaça de Cal Font.
import { W, H, CX, type P } from './geometry';
import { SPONSORS, type Shape } from '../../data/sponsors';

export const K = 1.5;
export type Variant = 'a' | 'b' | 'c';
export const PAL = { blue: '#0b5cad', teal: '#0e7f8c', green: '#1a7a50', navy: '#0d2233', mist: '#eaf3f6', aqua: '#3fc1c9' };
const FONT_D = '"Bricolage Grotesque Variable", system-ui, sans-serif', FONT_S = '"Instrument Sans Variable", system-ui, sans-serif';

interface Theme {
  label: string; ink: string; mm: 'mono' | 'color'; dot: string; kerf: string; sponsors: string;
  a: [string, string]; b: [string, string];                 // zona A (esquerra/dalt, amb l'escut) i zona B (dreta/baix, amb el MM)
  sleeveL: string; sleeveR: string; disc: string; discInk: string;
  river: string[]; mosaic: boolean; checker: boolean; chimney: string; collar: [string, string, string];
}
export const THEMES: Record<Variant, Theme> = {
  a: { label: 'Tisores', ink: '#ffffff', mm: 'mono', dot: '#ffffff', kerf: '#03101a', sponsors: '#ffffff',
    a: ['#23996b', '#0f6a48'], b: ['#0b5cad', '#0e7f8c'], sleeveL: '11,92,173', sleeveR: '26,122,80', disc: '#ffffff', discInk: PAL.navy,
    river: ['rgba(63,193,201,.30)', 'rgba(14,127,140,.55)', 'rgba(11,92,173,.70)', 'rgba(63,193,201,.55)', 'rgba(14,127,140,.85)', 'rgba(11,92,173,.95)'],
    mosaic: false, checker: false, chimney: 'rgba(255,255,255,.13)', collar: [PAL.navy, '#1c4a72', PAL.mist] },
  b: { label: 'Rajoles', ink: PAL.navy, mm: 'color', dot: PAL.navy, kerf: '#0d2233', sponsors: PAL.navy,
    a: ['#ffffff', '#f2f6f8'], b: ['#f4f8fa', '#e6eff2'], sleeveL: '11,92,173', sleeveR: '26,122,80', disc: PAL.navy, discInk: '#ffffff',
    river: ['rgba(63,193,201,.16)', 'rgba(14,127,140,.24)', 'rgba(11,92,173,.30)', 'rgba(63,193,201,.34)', 'rgba(14,127,140,.46)', 'rgba(11,92,173,.55)'],
    mosaic: true, checker: true, chimney: 'rgba(13,34,51,.10)', collar: [PAL.navy, PAL.blue, '#ffffff'] },
  c: { label: 'Nit', ink: '#ffffff', mm: 'mono', dot: '#ffffff', kerf: '#010a10', sponsors: '#ffffff',
    a: ['#0f2a3f', '#08131c'], b: ['#0e7f8c', '#1a7a50'], sleeveL: '14,127,140', sleeveR: '11,92,173', disc: '#ffffff', discInk: PAL.navy,
    river: ['rgba(63,193,201,.25)', 'rgba(63,193,201,.45)', 'rgba(14,127,140,.7)', 'rgba(95,214,160,.5)', 'rgba(26,122,80,.9)', 'rgba(14,127,140,.95)'],
    mosaic: false, checker: false, chimney: 'rgba(63,193,201,.16)', collar: ['#08131c', PAL.teal, '#5fd6a0'] },
};

const loadImg = (src: string) => new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
export async function loadAssets() {
  await Promise.all([document.fonts.load(`800 40px ${FONT_D}`), document.fonts.load(`700 20px ${FONT_S}`)]);
  const [monoW, monoN, color, horiz, escut] = await Promise.all(['logo-mono-blanc', 'logo-mono-blau-fosc', 'logo-principal', 'logo-horitzontal'].map((n) => loadImg(`/brand/${n}.svg`)).concat([loadImg('/brand/escut-igualada.png')]));
  return { monoW, monoN, color, horiz, escut };
}
export type Assets = Awaited<ReturnType<typeof loadAssets>>;
const rng = (seed: number) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const smooth = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// ---------- Línia de tall (dalt-dreta → baix-esquerra) ----------
const Z0: P = [930, 100], Z1: P = [430, 1100];
const dir = (() => { const dx = Z1[0] - Z0[0], dy = Z1[1] - Z0[1], l = Math.hypot(dx, dy); return { x: dx / l, y: dy / l, l }; })();
const norm = { x: -dir.y, y: dir.x };                             // apunta cap a la zona A (esquerra/dalt)
export const CUT = { tFront: 0.44 };
export const zzPoint = (t: number, off = 0): P => [Z0[0] + dir.x * dir.l * t + norm.x * off, Z0[1] + dir.y * dir.l * t + norm.y * off];
function zig(t0: number, t1: number, offFn: (t: number) => number = () => 0, amp = 26, step = 84): P[] {
  const n = Math.max(2, Math.round(((t1 - t0) * dir.l) / step)), out: P[] = [];
  for (let i = 0; i <= n; i++) { const t = t0 + ((t1 - t0) * i) / n; out.push(zzPoint(t, offFn(t) + (i % 2 ? amp : -amp))); }
  return out;
}
const trace = (ctx: CanvasRenderingContext2D, pts: P[], move = true) => pts.forEach((p, i) => (i || !move ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
const kerfW = (t: number) => 96 * Math.pow(Math.max(0, 1 - t / CUT.tFront), 0.85);

// ---------- Mosaic de quadrats (rajoles de la plaça de Cal Font) ----------
function mosaic(ctx: CanvasRenderingContext2D, back: boolean, seed = 7) {
  const r = rng(seed), s = 36, cols = ['#0b5cad', '#0e7f8c', '#1a7a50', '#3fc1c9', '#7fb4d6', '#a9d6c4', '#0d2233'];
  for (let y = 0; y < H; y += s) for (let x = 0; x < W; x += s) {
    const cx = x + s / 2, cy = y + s / 2;
    // distància signada a la línia de tall (positiva cap a la zona A)
    const d = (Z0[0] - cx) * norm.x + (Z0[1] - cy) * norm.y; // >0 zona A
    const dist = Math.abs(d), sideB = d < 0;
    const p = (sideB ? 0.95 : 0.55) * Math.exp(-dist / (sideB ? 300 : 150)) + 0.9 * smooth(0.62, 1, cy / H) * (sideB ? 1 : 0.6) + 0.5 * smooth(0.5, 1, cy / H) * (cx < 330 || cx > 1070 ? 0.4 : 0);
    // zones netes: logos al davant; bandera i patrocinadors al darrere
    const away = (px: number, py: number, rx: number, ry: number) => smooth(1, 1.45, Math.hypot((cx - px) / rx, (cy - py) / ry));
    const keep = back ? Math.min(away(CX, 178, 110, 80), (cx > 330 && cx < 1070 && cy > 610 && cy < 990) ? 0.05 : 1) * (0.55 + 0.45 * smooth(0.55, 0.9, cy / H)) : Math.min(away(505, 375, 125, 115), away(930, 350, 125, 118));
    if (r() < p * keep) {
      ctx.globalAlpha = 0.35 + 0.65 * Math.min(1, p) * (0.6 + 0.4 * r()); ctx.fillStyle = cols[Math.floor(r() * cols.length)];
      ctx.fillRect(x + 1.5, y + 1.5, s - 3, s - 3);
    }
  }
  ctx.globalAlpha = 1;
}
function checkerBase(ctx: CanvasRenderingContext2D) { // quadrats molt tènues a tota la samarreta blanca
  const s = 48; ctx.fillStyle = 'rgba(11,92,173,.045)';
  for (let y = 0; y < H; y += s) for (let x = 0; x < W; x += s) if (((x / s) + (y / s)) % 2 === 0) ctx.fillRect(x, y, s, s);
}

// ---------- Riu Anoia: ones HORITZONTALS al baix de la samarreta ----------
function river(ctx: CanvasRenderingContext2D, th: Theme) {
  const y0 = 925;
  th.river.forEach((col, k) => {
    const base = y0 + k * 34, amp = 11 + k * 2.2, lam = 300 - k * 22, ph = k * 1.3;
    ctx.beginPath(); ctx.moveTo(-10, H + 10);
    for (let x = -10; x <= W + 10; x += 8) ctx.lineTo(x, base + amp * Math.sin((x / lam) * Math.PI * 2 + ph) + 6 * Math.sin((x / (lam * 0.43)) * Math.PI * 2 + ph * 2));
    ctx.lineTo(W + 10, H + 10); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
    ctx.beginPath(); for (let x = -10; x <= W + 10; x += 8) { const y = base + amp * Math.sin((x / lam) * Math.PI * 2 + ph) + 6 * Math.sin((x / (lam * 0.43)) * Math.PI * 2 + ph * 2); x === -10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.strokeStyle = `rgba(255,255,255,${0.35 + 0.05 * k})`; ctx.lineWidth = 3; ctx.stroke();
  });
}

// ---------- Cos ----------
function drawBody(ctx: CanvasRenderingContext2D, th: Theme, mirrored: boolean) {
  ctx.save(); ctx.scale(K, K);
  if (mirrored) { ctx.translate(W, 0); ctx.scale(-1, 1); }
  // zona B (dreta/baix) de fons
  let g = ctx.createLinearGradient(W, 0, 500, H); g.addColorStop(0, th.b[0]); g.addColorStop(1, th.b[1]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // zona A (esquerra/dalt) retallada pel zig-zag
  const zz = zig(-0.16, 1.16);
  ctx.beginPath(); ctx.moveTo(zz[0][0], zz[0][1]); trace(ctx, zz, false); ctx.lineTo(-300, H + 500); ctx.lineTo(-300, -500); ctx.closePath();
  g = ctx.createLinearGradient(0, 0, 500, H); g.addColorStop(0, th.a[0]); g.addColorStop(1, th.a[1]); ctx.fillStyle = g; ctx.fill();
  if (th.checker) checkerBase(ctx);
  if (th.mosaic) mosaic(ctx, mirrored);
  // ecos del tall (paviment de Cal Font / teixit estripat)
  ctx.lineJoin = 'round';
  for (const [o, a] of [[-60, 0.15], [-110, 0.09], [60, 0.15], [110, 0.09]] as const) {
    ctx.beginPath(); trace(ctx, zig(-0.16, 1.16, () => o)); ctx.strokeStyle = th.ink === '#ffffff' ? `rgba(255,255,255,${a})` : `rgba(13,34,51,${a * 0.7})`; ctx.lineWidth = 3; ctx.stroke();
  }
  // mànigues: esquerra i dreta de color creuat, difuminades cap al cos
  const fade = (x0: number, x1: number, rgb: string) => {
    const w = Math.abs(x1 - x0), tmp = document.createElement('canvas'); tmp.width = Math.round(w * K); tmp.height = Math.round(660 * K);
    const t = tmp.getContext('2d')!, lx = x1 > x0 ? 0 : w;
    const gr = t.createLinearGradient(x1 > x0 ? 0 : w, 0, x1 > x0 ? w : 0, 0);
    gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(0.5, `rgba(${rgb},.85)`); gr.addColorStop(1, `rgba(${rgb},0)`);
    t.fillStyle = gr; t.fillRect(0, 0, tmp.width, tmp.height); t.globalCompositeOperation = 'destination-in';
    const v = t.createLinearGradient(0, 0, 0, tmp.height); v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(0.62, 'rgba(0,0,0,1)'); v.addColorStop(1, 'rgba(0,0,0,0)');
    t.fillStyle = v; t.fillRect(0, 0, tmp.width, tmp.height); void lx;
    ctx.drawImage(tmp, Math.min(x0, x1), 0, w, 660);
  };
  fade(115, 430, th.sleeveL); fade(1285, 970, th.sleeveR);
  if (th.mosaic) { // quadrats que pugen per les mànigues
    const r = rng(3); for (const side of [0, 1]) for (let y = 300; y < 560; y += 30) for (let x = side ? 1000 : 90; x < (side ? 1330 : 400); x += 30) { const fadeP = side ? (x - 1000) / 330 : 1 - (x - 90) / 310; if (r() < 0.55 * fadeP * smooth(300, 520, y)) { ctx.fillStyle = side ? PAL.green : PAL.blue; ctx.globalAlpha = 0.3 + 0.5 * r(); ctx.fillRect(x, y, 27, 27); } }
    ctx.globalAlpha = 1;
  }
  river(ctx, th);
  ctx.restore();
}

// ---------- Escuts i insígnies ----------
function arms(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) { // bandera: armes (cruz vermella sobre blanc / quatre barres) + aigües
  ctx.save(); ctx.translate(x - w / 2, y - h / 2);
  const cw = w / 2, ch = (h * 0.8) / 2;
  const cross = (ox: number, oy: number) => { ctx.fillStyle = '#f4f4f4'; ctx.fillRect(ox, oy, cw, ch); ctx.fillStyle = '#c8102e'; ctx.fillRect(ox + cw * 0.4, oy, cw * 0.2, ch); ctx.fillRect(ox, oy + ch * 0.4, cw, ch * 0.2); };
  const bars = (ox: number, oy: number) => { ctx.fillStyle = '#f5c400'; ctx.fillRect(ox, oy, cw, ch); ctx.fillStyle = '#c8102e'; for (let i = 0; i < 4; i++) ctx.fillRect(ox + cw * (1 / 9 + (i * 2) / 9), oy, cw / 9, ch); };
  cross(0, 0); bars(cw, 0); bars(0, ch); cross(cw, ch);
  const wy = h * 0.8; ctx.fillStyle = '#1b6fb5'; ctx.fillRect(0, wy, w, h - wy);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = Math.max(1.4, h * 0.03);
  for (let r = 0; r < 2; r++) { ctx.beginPath(); for (let i = 0; i <= 8; i++) { const px = (w * i) / 8, py = wy + h * (0.06 + r * 0.08) + (i % 2 ? -h * 0.02 : h * 0.02); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
  ctx.restore();
}
/** Etiqueta amb la vora inferior en zig-zag (com el tall de la samarreta): 98 × 132 u, centrada a (0,0) */
function patch(ctx: CanvasRenderingContext2D, th: Theme, accent: string, draw: () => void) {
  ctx.save(); ctx.shadowColor = 'rgba(0,10,20,.35)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
  const w = 49, top = -66, bot = 50;
  ctx.beginPath(); ctx.moveTo(-w, top); ctx.lineTo(w, top); ctx.lineTo(w, bot);
  for (let i = 0; i < 4; i++) { ctx.lineTo(w - (i * w) / 2 - w / 4, bot + 16); ctx.lineTo(w - ((i + 1) * w) / 2, bot); }
  ctx.closePath(); ctx.fillStyle = th.disc; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.save(); ctx.clip(); ctx.fillStyle = accent; ctx.fillRect(-w, top, 2 * w, 12); ctx.restore();
  ctx.strokeStyle = th.discInk; ctx.globalAlpha = 0.25; ctx.lineWidth = 1.4; ctx.strokeRect(-w + 5, top + 17, 2 * w - 10, bot - top - 26); ctx.globalAlpha = 1;
  ctx.fillStyle = th.discInk; ctx.textAlign = 'center'; draw(); ctx.restore();
}
function badgeEntitat(ctx: CanvasRenderingContext2D, th: Theme) {
  patch(ctx, th, PAL.teal, () => {
    ctx.font = `800 40px ${FONT_D}`; ctx.fillText('CAI', 0, -8);
    ctx.fillRect(-30, 3, 60, 3); ctx.fillRect(-30, 9, 44, 3);
    ctx.font = `700 9px ${FONT_S}`; ctx.fillText('ENTITAT', 0, 27); ctx.fillText('COL·LABORADORA', 0, 38);
  });
}
function badgeVilanova(ctx: CanvasRenderingContext2D, th: Theme) {
  patch(ctx, th, PAL.green, () => {
    ctx.save(); ctx.translate(0, -14); ctx.beginPath(); ctx.moveTo(-17, -20); ctx.lineTo(17, -20); ctx.lineTo(17, 6); ctx.quadraticCurveTo(17, 22, 0, 29); ctx.quadraticCurveTo(-17, 22, -17, 6); ctx.closePath();
    ctx.fillStyle = PAL.green; ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = `800 17px ${FONT_D}`; ctx.fillText('VdC', 0, 8); ctx.restore();
    ctx.fillStyle = th.discInk; ctx.font = `700 8.5px ${FONT_S}`; ctx.fillText('AJUNTAMENT', 0, 30); ctx.fillText('VILANOVA', 0, 40); ctx.fillText('DEL CAMÍ', 0, 50);
  });
}

// ---------- Tisores de Cal Font (gràfiques): fulles DINS del tall, anelles a fora ----------
function scissorsBlades(ctx: CanvasRenderingContext2D, th: Theme, x: number, y: number, ang: number, L: number) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  for (const sgn of [1, -1]) {
    ctx.save(); ctx.rotate(sgn * 0.075);
    const g = ctx.createLinearGradient(0, -12, 0, 12); g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, '#cfdbe3'); g.addColorStop(1, '#8fa3b0');
    ctx.beginPath(); ctx.moveTo(-16, -14); ctx.lineTo(L, sgn * -1); ctx.lineTo(L + 2, sgn * 2); ctx.lineTo(-16, 14); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = PAL.navy; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  }
  ctx.restore();
}
function scissorsHandles(ctx: CanvasRenderingContext2D, th: Theme, x: number, y: number, ang: number) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(1.25, 1.25);
  ctx.shadowColor = 'rgba(0,10,20,.4)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4;
  for (const sgn of [1, -1]) {
    ctx.save(); ctx.rotate(sgn * 0.075); ctx.lineCap = 'round';
    ctx.strokeStyle = PAL.navy; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-78, -sgn * 26); ctx.stroke();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-78, -sgn * 26); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-104, -sgn * 36, 30, 23, sgn * 0.45, 0, Math.PI * 2);
    ctx.strokeStyle = PAL.navy; ctx.lineWidth = 17; ctx.stroke(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 9; ctx.stroke(); ctx.restore();
  }
  ctx.shadowColor = 'transparent'; ctx.fillStyle = PAL.navy; ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-1.5, -1.5, 3.2, 0, 7); ctx.fill();
  ctx.restore();
}

function drawFront(ctx: CanvasRenderingContext2D, th: Theme, a: Assets) {
  ctx.save(); ctx.scale(K, K); ctx.lineJoin = 'round';
  const tf = CUT.tFront, t0 = -0.08;
  const Lk = zig(t0, tf, (t) => kerfW(t) / 2), Rk = zig(t0, tf, (t) => -kerfW(t) / 2);
  const kerfPath = () => { ctx.beginPath(); ctx.moveTo(Lk[0][0], Lk[0][1]); trace(ctx, Lk, false); [...Rk].reverse().forEach((p) => ctx.lineTo(p[0], p[1])); ctx.closePath(); };
  // tall obert
  ctx.save(); kerfPath(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 14; ctx.fillStyle = th.kerf; ctx.fill(); ctx.shadowBlur = 0; ctx.clip();
  ctx.strokeStyle = 'rgba(0,0,0,.85)'; ctx.lineWidth = 16; [Lk, Rk].forEach((e) => { ctx.beginPath(); trace(ctx, e); ctx.stroke(); });
  ctx.restore();
  // tisores ENTERES (només queda amagada la part que entraria a la tela): les puntes acaben on acaba el tall
  const tip = zzPoint(tf, 0), ang = Math.atan2(dir.y, dir.x), BL = 250;
  ctx.strokeStyle = th.ink === '#ffffff' ? 'rgba(255,255,255,.6)' : 'rgba(255,255,255,.75)'; ctx.lineWidth = 2.2; [Lk, Rk].forEach((e) => { ctx.beginPath(); trace(ctx, e); ctx.stroke(); });
  // resta per tallar: zig-zag de punts fins a baix (dents grans)
  ctx.save(); ctx.setLineDash([14, 11]); ctx.lineCap = 'round'; ctx.strokeStyle = th.dot; ctx.lineWidth = 3.4;
  ctx.beginPath(); trace(ctx, zig(tf, 1.1)); ctx.stroke(); ctx.restore();
  scissorsBlades(ctx, th, tip[0] - dir.x * BL, tip[1] - dir.y * BL, ang, BL);
  scissorsHandles(ctx, th, tip[0] - dir.x * BL, tip[1] - dir.y * BL, ang);
  // escut d'Igualada (esquerra) i MM (dreta)
  const eh = 148, ew = (a.escut.naturalWidth / a.escut.naturalHeight) * eh;
  ctx.drawImage(a.escut, 505 - ew / 2, 302, ew, eh);
  ctx.drawImage(th.mm === 'mono' ? a.monoW : a.color, 855, 285, 150, 155);
  // mànigues: entitat (esquerra) i Vilanova (dreta), en insígnies rodones
  ctx.save(); ctx.translate(228, 392); ctx.rotate(0.71); badgeEntitat(ctx, th); ctx.restore();
  ctx.save(); ctx.translate(1172, 392); ctx.rotate(-0.71); badgeVilanova(ctx, th); ctx.restore();
  ctx.restore();
}

// ---------- Silueta de la xemeneia de la plaça de Cal Font (darrere) ----------
function chimney(ctx: CanvasRenderingContext2D, th: Theme) {
  ctx.save(); ctx.scale(K, K); ctx.fillStyle = th.chimney; ctx.strokeStyle = th.chimney;
  const cx = CX, top = 250, base = 1100;
  // edifici de la fàbrica (teulada a quatre aigües) al fons
  ctx.beginPath(); ctx.moveTo(cx - 300, 1000); ctx.lineTo(cx - 250, 960); ctx.lineTo(cx + 250, 960); ctx.lineTo(cx + 300, 1000); ctx.lineTo(cx + 300, base); ctx.lineTo(cx - 300, base); ctx.closePath(); ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1;
  // fust cònic, cornisa i sòcol
  ctx.beginPath(); ctx.moveTo(cx - 19, top + 44); ctx.lineTo(cx + 19, top + 44); ctx.lineTo(cx + 31, base - 60); ctx.lineTo(cx - 31, base - 60); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx - 34, top + 46); ctx.lineTo(cx + 34, top + 46); ctx.lineTo(cx + 27, top + 30); ctx.lineTo(cx - 27, top + 30); ctx.closePath(); ctx.fill();
  ctx.fillRect(cx - 30, top + 6, 60, 26); ctx.fillRect(cx - 24, top - 4, 48, 12);
  ctx.fillRect(cx - 46, base - 60, 92, 20); ctx.fillRect(cx - 58, base - 40, 116, 40);
  // filades de maó
  ctx.globalAlpha = 0.5; ctx.strokeStyle = th.ink === '#ffffff' ? 'rgba(13,34,51,.25)' : 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.2;
  for (let y = top + 56; y < base - 62; y += 26) { const k = (y - top - 44) / (base - 60 - top - 44); const hw = 19 + 12 * k; ctx.beginPath(); ctx.moveTo(cx - hw, y); ctx.lineTo(cx + hw, y); ctx.stroke(); }
  ctx.globalAlpha = 1; ctx.restore();
}

// ---------- Patrocinadors ----------
const SHAPES: Record<Shape, (c: CanvasRenderingContext2D) => void> = {
  mountain: (c) => c.fill(new Path2D('M3 33 16 11l7 11 5-7 9 18Z')), leaf: (c) => c.fill(new Path2D('M7 33C7 15 19 7 34 7c0 15-8 26-27 26Z')),
  hex: (c) => c.fill(new Path2D('M20 3l14 8v18l-14 8-14-8V11Z')), bolt: (c) => c.fill(new Path2D('M23 2 8 23h10l-3 15 17-22H21Z')),
  wave: (c) => { c.lineWidth = 5; c.lineCap = 'round'; c.stroke(new Path2D('M2 22q6-12 12 0t12 0 12 0')); },
  ring: (c) => { c.lineWidth = 5; c.beginPath(); c.arc(20, 20, 14, 0, 7); c.stroke(); c.beginPath(); c.arc(20, 20, 4.5, 0, 7); c.fill(); },
  arrow: (c) => { c.lineWidth = 5; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(new Path2D('M5 20h27M21 9l11 11-11 11')); },
  sun: (c) => { c.beginPath(); c.arc(20, 20, 8, 0, 7); c.fill(); c.lineWidth = 3.5; c.lineCap = 'round'; c.stroke(new Path2D('M20 3v6M20 31v6M3 20h6M31 20h6M8 8l4 4M28 28l4 4M32 8l-4 4M12 28l-4 4')); },
};
function sponsor(ctx: CanvasRenderingContext2D, ink: string, name: string, shape: Shape, cx: number, cy: number, size: number) {
  ctx.save(); ctx.font = `800 ${size * 0.6}px ${FONT_D}`;
  const tw = ctx.measureText(name).width, total = size + size * 0.25 + tw, x0 = cx - total / 2;
  ctx.fillStyle = ink; ctx.strokeStyle = ink;
  ctx.save(); ctx.translate(x0, cy - size / 2); ctx.scale(size / 40, size / 40); SHAPES[shape](ctx); ctx.restore();
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(name, x0 + size * 1.25, cy + size * 0.04); ctx.restore();
}
function drawBackExtras(ctx: CanvasRenderingContext2D, th: Theme) {
  chimney(ctx, th);
  ctx.save(); ctx.scale(K, K);
  const fw = 7 * 14.2, fh = 5 * 14.2;                                                 // bandera d'Igualada 7 × 5 cm a la clivella
  ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 5; ctx.fillStyle = '#fff'; ctx.fillRect(CX - fw / 2 - 2, 178 - fh / 2 - 2, fw + 4, fh + 4); ctx.shadowBlur = 0;
  arms(ctx, CX, 178, fw, fh);
  ctx.fillStyle = th.sponsors; ctx.globalAlpha = 0.85; ctx.textAlign = 'center'; ctx.font = `700 16px ${FONT_S}`;
  if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '5px';
  ctx.fillText('MITJA MARATÓ D’IGUALADA · 2026', CX, 655);
  if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px'; ctx.globalAlpha = 1;
  const m = SPONSORS.main[0]; sponsor(ctx, th.sponsors, m.name, m.shape, CX, 725, 62);
  const px = [-178, 178, -178, 178], py = [800, 800, 844, 844]; SPONSORS.partners.forEach((s, i) => sponsor(ctx, th.sponsors, s.name, s.shape, CX + px[i], py[i], 28));
  const lx = [-236, 0, 236, -236, 0, 236], ly = [890, 890, 890, 922, 922, 922]; SPONSORS.local.forEach((s, i) => sponsor(ctx, th.sponsors, s.name, s.shape, CX + lx[i], ly[i], 19));
  ctx.restore();
}
function stitch(ctx: CanvasRenderingContext2D, th: Theme) { // al darrere el zig-zag és una costura de punts
  ctx.save(); ctx.scale(K, K); ctx.translate(W, 0); ctx.scale(-1, 1);
  ctx.setLineDash([9, 8]); ctx.strokeStyle = th.ink === '#ffffff' ? 'rgba(255,255,255,.7)' : 'rgba(13,34,51,.6)'; ctx.lineWidth = 2.6;
  ctx.beginPath(); trace(ctx, zig(-0.16, 1.16)); ctx.stroke(); ctx.restore();
}

export function makeCanvas() { const c = document.createElement('canvas'); c.width = Math.round(W * K); c.height = Math.round(H * K); return c; }
export function frontTexture(v: Variant, a: Assets) { const c = makeCanvas(), x = c.getContext('2d')!; drawBody(x, THEMES[v], false); drawFront(x, THEMES[v], a); return c; }
export function backTexture(v: Variant) { const th = THEMES[v], c = makeCanvas(), x = c.getContext('2d')!; drawBody(x, th, true); stitch(x, th); drawBackExtras(x, th); return c; }
/** Coll amb el brodat de quadrats del paviment de la plaça de Cal Font */
export function collarTexture(v: Variant) {
  const [c0, c1, c2] = THEMES[v].collar, c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d')!;
  x.fillStyle = c0; x.fillRect(0, 0, 64, 64); x.fillStyle = c2; x.fillRect(0, 0, 32, 32); x.fillRect(32, 32, 32, 32); x.fillStyle = c1; x.fillRect(32, 0, 32, 32);
  return c;
}
export function weaveTexture() { // malla d'un teixit tècnic esportiu: petits forats en retícula desplaçada
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!;
  x.fillStyle = '#9a9a9a'; x.fillRect(0, 0, 128, 128);
  for (let j = 0; j < 16; j++) for (let i = 0; i < 16; i++) {
    const px = i * 8 + (j % 2 ? 4 : 0) + 2, py = j * 8 + 2; const g = x.createRadialGradient(px, py, 0, px, py, 3);
    g.addColorStop(0, 'rgba(20,20,20,.9)'); g.addColorStop(1, 'rgba(20,20,20,0)'); x.fillStyle = g; x.beginPath(); x.arc(px, py, 3, 0, 7); x.fill();
  }
  return c;
}
export function bibTexture(a: Assets) {
  const c = document.createElement('canvas'); c.width = 810; c.height = 580; const x = c.getContext('2d')!;
  x.fillStyle = '#fff'; x.beginPath(); x.roundRect(0, 0, 810, 580, 26); x.fill(); x.strokeStyle = '#d5e0e6'; x.lineWidth = 6; x.stroke();
  x.drawImage(a.horiz, 34, 30, 420, 126); x.fillStyle = PAL.navy; x.beginPath(); x.roundRect(610, 44, 160, 74, 37); x.fill();
  x.fillStyle = '#fff'; x.font = `800 46px ${FONT_D}`; x.textAlign = 'center'; x.fillText('21K', 690, 96);
  x.fillStyle = PAL.navy; x.font = `800 250px ${FONT_D}`; x.fillText('0421', 405, 400);
  x.font = `700 26px ${FONT_S}`; x.fillStyle = '#45606f'; x.fillText('13 DE DESEMBRE 2026 · IGUALADA · XIP', 405, 520);
  return c;
}
