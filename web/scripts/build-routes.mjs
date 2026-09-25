// Converteix els GPX de public/gpx en src/data/routes.json (punts, distància acumulada, desnivell, marcadors de km)
import { readFileSync, writeFileSync } from 'node:fs';
const files = { '21k': 'public/gpx/21k.gpx', '10k': 'public/gpx/10k.gpx', walk: 'public/gpx/walk.gpx' };
const R = 6371000, rad = (d) => (d * Math.PI) / 180;
const hav = (a, b) => {
  const dl = rad(b[0] - a[0]), dn = rad(b[1] - a[1]);
  const x = Math.sin(dl / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dn / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};
const out = {};
for (const [id, f] of Object.entries(files)) {
  const s = readFileSync(f, 'utf8');
  const raw = [...s.matchAll(/<trkpt lat="([\d.\-]+)" lon="([\d.\-]+)">\s*<ele>([\d.\-]+)/g)].map((m) => [+m[1], +m[2], +m[3]]);
  // elevació suavitzada (mitjana mòbil) per evitar soroll
  const ele = raw.map((_, i) => {
    let a = 0, n = 0;
    for (let j = Math.max(0, i - 2); j <= Math.min(raw.length - 1, i + 2); j++) { a += raw[j][2]; n++; }
    return a / n;
  });
  let d = 0, gain = 0, loss = 0;
  const pts = raw.map((p, i) => {
    if (i) {
      d += hav(raw[i - 1], p);
      const de = ele[i] - ele[i - 1];
      if (de > 0) gain += de; else loss -= de;
    }
    return [+p[0].toFixed(5), +p[1].toFixed(5), +ele[i].toFixed(1), Math.round(d)];
  });
  const kms = [];
  for (let k = 1; k * 1000 < d; k++) {
    const p = pts.find((q) => q[3] >= k * 1000);
    if (p) kms.push({ km: k, lat: p[0], lon: p[1] });
  }
  out[id] = {
    id, points: pts, kms,
    distance: +(d / 1000).toFixed(2),
    gain: Math.round(gain), loss: Math.round(loss),
    minEle: Math.round(Math.min(...ele)), maxEle: Math.round(Math.max(...ele)),
  };
}
writeFileSync('src/data/routes.json', JSON.stringify(out));
console.log(Object.values(out).map((r) => `${r.id}: ${r.distance}km +${r.gain}/-${r.loss} ${r.minEle}-${r.maxEle}m`).join('\n'));
