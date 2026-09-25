import routes from '../data/routes.json';
/** Projecta el track GPX d'un recorregut a un path SVG dins d'un viewBox W×H (mantenint proporcions). */
export function routeD(id: '21k' | '10k' | 'walk' = '21k', W = 600, H = 600, pad = 40): string {
  const pts = routes[id].points as number[][];
  const lats = pts.map((p) => p[0]), lons = pts.map((p) => p[1]);
  const [minLa, maxLa, minLo, maxLo] = [Math.min(...lats), Math.max(...lats), Math.min(...lons), Math.max(...lons)];
  const k = Math.cos((((minLa + maxLa) / 2) * Math.PI) / 180);
  const sc = Math.min((W - 2 * pad) / ((maxLo - minLo) * k), (H - 2 * pad) / (maxLa - minLa));
  const ox = (W - (maxLo - minLo) * k * sc) / 2, oy = (H - (maxLa - minLa) * sc) / 2;
  return pts.map((p, i) => `${i ? 'L' : 'M'}${(ox + (p[1] - minLo) * k * sc).toFixed(1)} ${(H - oy - (p[0] - minLa) * sc).toFixed(1)}`).join('');
}
