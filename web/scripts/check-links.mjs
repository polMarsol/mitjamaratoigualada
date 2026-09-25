import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const dist = 'dist', pages = {}, bad = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && (pages['/' + p.slice(5).replace(/index\.html$/, '')] = readFileSync(p, 'utf8')); });
walk(dist);
for (const [page, html] of Object.entries(pages)) {
  for (const m of html.matchAll(/(?:href|src)="([^"#?]*)(#[^"]*)?"/g)) {
    const [, path, hash] = m;
    if (!path || /^(https?:|mailto:|tel:|data:)/.test(path)) continue;
    const target = path.startsWith('/') ? path : new URL(path, 'http://x' + page).pathname;
    const isPage = pages[target] !== undefined || pages[target.replace(/\/?$/, '/')] !== undefined;
    if (!isPage && !existsSync(join(dist, target))) bad.push(`${page} -> ${target} (no existeix)`);
    else if (hash && hash.length > 1 && isPage) { const h = pages[target] ?? pages[target.replace(/\/?$/, '/')]; if (!h.includes(`id="${hash.slice(1)}"`)) bad.push(`${page} -> ${target}${hash} (ancora inexistent)`); }
  }
}
console.log(Object.keys(pages).length + ' pàgines revisades;', bad.length ? '\n' + [...new Set(bad)].join('\n') : 'cap enllaç trencat ✓');
