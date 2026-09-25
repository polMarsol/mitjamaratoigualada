// Resultats FICTICIS generats de forma determinista per al prototip (la 1a edició encara no s'ha celebrat).
export type Cat = 'Sènior' | 'Màster 35' | 'Màster 45' | 'Màster 55+';
export interface Row { pos: number; bib: number; name: string; sex: 'M' | 'F'; cat: Cat; sec: number }
const rng = (seed: number) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const FM = ['Marc', 'Pau', 'Jordi', 'Albert', 'Arnau', 'Oriol', 'Joan', 'Pere', 'Xavier', 'Ferran', 'Sergi', 'Roger', 'Àlex', 'Biel', 'Nil', 'Dídac', 'Guillem', 'Ramon'];
const FF = ['Marta', 'Núria', 'Laia', 'Anna', 'Júlia', 'Clara', 'Carla', 'Mireia', 'Sílvia', 'Irene', 'Berta', 'Paula', 'Èlia', 'Queralt', 'Ona', 'Aina', 'Judit', 'Montse'];
const SN = ['Puig', 'Serra', 'Vila', 'Roca', 'Ferrer', 'Soler', 'Pujol', 'Casals', 'Bosch', 'Vidal', 'Camps', 'Mas', 'Prat', 'Riera', 'Font', 'Sala', 'Costa', 'Rovira', 'Grau', 'Mora', 'Torres', 'Bonet', 'Ribas', 'Padrós'];

function make(seed: number, n: number, kmBase: { M: number; F: number }, spread: number): Row[] {
  const r = rng(seed), used = new Set<number>(), rows: Omit<Row, 'pos'>[] = [];
  for (let i = 0; i < n; i++) {
    const sex = r() < 0.58 ? 'M' : 'F', a = r();
    const cat: Cat = a < 0.42 ? 'Sènior' : a < 0.7 ? 'Màster 35' : a < 0.9 ? 'Màster 45' : 'Màster 55+';
    const catF = { 'Sènior': 1, 'Màster 35': 1.04, 'Màster 45': 1.1, 'Màster 55+': 1.2 }[cat];
    const sec = Math.round(kmBase[sex] * catF * (1 + Math.pow(r(), 1.6) * spread));
    let bib = 1 + Math.floor(r() * 800); while (used.has(bib)) bib = (bib % 800) + 1; used.add(bib);
    const first = (sex === 'M' ? FM : FF)[Math.floor(r() * 18)], s1 = SN[Math.floor(r() * 24)], s2 = SN[Math.floor(r() * 24)];
    rows.push({ bib, name: `${first} ${s1} ${s2}`, sex, cat, sec });
  }
  return rows.sort((x, y) => x.sec - y.sec).map((x, i) => ({ ...x, pos: i + 1 }));
}
export const RESULTS = {
  '21k': { km: 21.097, rows: make(21, 46, { M: 4300, F: 4950 }, 1.05) },
  '10k': { km: 10, rows: make(10, 46, { M: 2000, F: 2300 }, 1.15) },
};
export const fmtTime = (s: number) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60; return `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`; };
export const fmtPace = (s: number, km: number) => { const p = s / km, m = Math.floor(p / 60), ss = Math.round(p % 60); return `${m}:${String(ss).padStart(2, '0')}`; };
export const CATS: Cat[] = ['Sènior', 'Màster 35', 'Màster 45', 'Màster 55+'];
