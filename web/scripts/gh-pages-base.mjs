// Adapta dist/ per servir-lo sota un subcamí (GitHub Pages: /<repo>/). La web fa servir rutes
// absolutes des de l'arrel («/ca/», «/img/…»), que a Vercel funcionen tal qual; aquí s'hi afegeix el prefix.
// Ús: node scripts/gh-pages-base.mjs /mitjamaratoigualada https://usuari.github.io
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const [base, origin] = process.argv.slice(2).map((v, i) => (i ? v.toLowerCase() : v));
if (!/^\/[\w.-]+$/.test(base || '') || !/^https?:\/\/[^/]+$/.test(origin || '')) { console.error('Ús: gh-pages-base.mjs /subcami https://origen'); process.exit(1); }
const files = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : /\.(html|css|js|json|webmanifest|xml|txt)$/.test(p) && files.push(p); });
walk('dist');
const no = `(?!\\/|${base.slice(1)}\\/)`;                                              // ni «//host» ni ja prefixat
const abs = (s) => s.replaceAll(origin + '/', origin + base + '/');                       // canonical, og, sitemap, JSON-LD
const cssUrl = (s) => s.replace(new RegExp(`url\\((['"]?)\\/${no}`, 'g'), `url($1${base}/`);
const js = (s) => s.replace(/([`'"])\/(gpx|img|shirt|shop|brand|_astro)\//g, `$1${base}/$2/`)  // rutes d'actius dins del codi
  .replace(/location\.replace\((['"])\/\1/g, `location.replace($1${base}/$1`)             // redirecció d'idioma de l'arrel
  .replace(/return\s*([`'"])\/\1\s*\+/g, (m, q) => (preload++, `return ${q}${base}/${q}+`)); // imports dinàmics de Vite («_astro/…»)
let preload = 0;
const html = (s) => js(cssUrl(s))
  .replace(new RegExp(`\\b(href|src|action|poster)="\\/${no}`, 'g'), `$1="${base}/`)
  .replace(/\bsrcset="([^"]*)"/g, (_, v) => `srcset="${v.replace(new RegExp(`(^|,\\s*)\\/${no}`, 'g'), `$1${base}/`)}"`)
  .replace(/(http-equiv="refresh" content="\d+;\s*url=)\//, `$1${base}/`);
let n = 0;
for (const p of files) {
  const src = readFileSync(p, 'utf8');
  let out = abs(src);
  if (p.endsWith('.html')) out = html(out);
  else if (p.endsWith('.css')) out = cssUrl(out);
  else if (p.endsWith('.js')) out = js(out);
  else if (p.endsWith('.webmanifest')) out = out.replace(/"(start_url|src)":"\/(?!\/)/g, `"$1":"${base}/`);
  if (out !== src) { writeFileSync(p, out); n++; }
}
if (!preload && files.some((p) => p.endsWith('.js') && /["'`]_astro\//.test(readFileSync(p, 'utf8')))) {
  console.error("No s'ha trobat el generador de rutes dels imports dinàmics de Vite: revisa gh-pages-base.mjs"); process.exit(1);
}
console.log(`${n} fitxers adaptats al subcamí ${base}`);
