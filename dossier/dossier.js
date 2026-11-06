/* Dossier de patrocini · MM Igualada — components compartits (camiseta, dorsal, arc, catàleg, personalització) */
(function () {
  const MM = window.MM;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const eur = (n) => n.toLocaleString('ca-ES') + ' €';
  const L = 'assets/logos/';

  /* ── Marca patrocinadora (logo o nom) ─────────────────────── */
  // brand = { nom, logo (url, opcional), logoBlanc (url, opcional), color }
  function brandMark(brand, { white = false, h = 40, fs } = {}) {
    const src = white ? (brand.logoBlanc || brand.logo) : brand.logo;
    if (src) return `<img src="${esc(src)}" alt="${esc(brand.nom)}" style="height:${h}px;width:auto;max-width:${h * 4.6}px;object-fit:contain${white && !brand.logoBlanc ? ';filter:brightness(0) invert(1)' : ''}">`;
    return `<span style="font:800 ${fs || h * 0.8}px/1 var(--f-d);letter-spacing:-.03em;color:${white ? '#fff' : (brand.color || 'var(--accent)')};white-space:nowrap">${esc(brand.nom || 'La vostra marca')}</span>`;
  }
  // Dins d'un SVG: imatge o text centrat dins d'una caixa
  function svgBrand(brand, x, y, w, h, { white = true, anchor = 'middle' } = {}) {
    const src = white ? (brand.logoBlanc || brand.logo) : brand.logo;
    if (src) {
      const f = white && !brand.logoBlanc ? ' filter="url(#toWhite)"' : '';
      return `<image href="${esc(src)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"${f}/>`;
    }
    const name = brand.nom || 'LA VOSTRA MARCA';
    const fs = Math.min(h * 0.62, (w / Math.max(name.length, 4)) * 1.75);
    const tx = anchor === 'middle' ? x + w / 2 : x;
    return `<text x="${tx}" y="${y + h / 2}" text-anchor="${anchor}" dominant-baseline="central" font-family="Bricolage, sans-serif" font-weight="800" font-size="${fs.toFixed(1)}" letter-spacing="-0.5" fill="${white ? '#fff' : (brand.color || '#0b5cad')}">${esc(name)}</text>`;
  }
  const toWhite = '<filter id="toWhite"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/></filter>';

  /* ── Samarreta (SVG) ──────────────────────────────────────── */
  let uid = 0;
  function rand(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
  function mosaic(id, w, h, cell, seed) {
    const r = rand(seed); let out = '';
    for (let y = 0; y < h; y += cell) for (let x = 0; x < w; x += cell) {
      const v = r(); if (v < 0.45) continue;
      out += `<rect x="${x}" y="${y}" width="${cell - 1}" height="${cell - 1}" fill="${v > 0.8 ? '#5fd6a0' : v > 0.62 ? '#4da3ff' : '#ffffff'}" opacity="${(0.05 + (v - 0.45) * 0.28).toFixed(2)}"/>`;
    }
    return out;
  }
  const BODY = {
    front: 'M140 22 C165 54 235 54 260 22 L322 44 L394 112 L352 164 L318 138 L318 404 C240 416 160 416 82 404 L82 138 L48 164 L6 112 L78 44 Z',
    back: 'M140 22 C168 36 232 36 260 22 L322 44 L394 112 L352 164 L318 138 L318 404 C240 416 160 416 82 404 L82 138 L48 164 L6 112 L78 44 Z',
  };
  const SLEEVE_L = 'M78 44 L6 112 L48 164 L82 138 L92 70 Z';
  const SLEEVE_R = 'M322 44 L394 112 L352 164 L318 138 L308 70 Z';

  /* opts: { side:'front'|'back', zones:bool, naming:brand|null, partners:[brand,brand], row:[brand×6], title:'' } */
  function shirt(opts = {}) {
    const id = 'sh' + (++uid), side = opts.side || 'front', front = side === 'front';
    const n = opts.naming, z = opts.zones;
    const zone = (x, y, w, h, num, label, hot) => `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${hot ? 'rgb(255 255 255 / .22)' : 'rgb(255 255 255 / .1)'}" stroke="#fff" stroke-width="1.6" stroke-dasharray="5 4"/>
      <circle cx="${x}" cy="${y}" r="11" fill="${hot ? '#c9a227' : '#0d2233'}" stroke="#fff" stroke-width="1.5"/>
      <text x="${x}" y="${y + 0.5}" text-anchor="middle" dominant-baseline="central" font-family="Instrument, sans-serif" font-weight="700" font-size="11" fill="#fff">${num}</text>
      ${label ? `<text x="${x + w / 2}" y="${y + h / 2}" text-anchor="middle" dominant-baseline="central" font-family="Instrument, sans-serif" font-weight="600" font-size="10" fill="#fff" opacity=".95">${label}</text>` : ''}`;
    let content = '';
    if (front) {
      content += z ? zone(104, 92, 80, 58, 2, 'Escut MM') : `<image href="${L}logo-mono-blanc.svg" x="112" y="84" width="66" height="66"/>`;
      content += z ? zone(214, 92, 84, 58, 1, 'Principal', true) : (n ? svgBrand(n, 214, 98, 86, 44) : '');
      const pl = opts.partners || [];
      content += z ? zone(22, 104, 52, 28, 3, '') : (pl[0] ? `<g transform="rotate(-42 48 118)">${svgBrand(pl[0], 24, 108, 50, 20)}</g>` : '');
      content += z ? zone(326, 104, 52, 28, 4, '') : (pl[1] ? `<g transform="rotate(42 352 118)">${svgBrand(pl[1], 326, 108, 50, 20)}</g>` : '');
    } else {
      content += `<rect x="189" y="44" width="22" height="15" rx="2" fill="#fff" opacity=".9"/><path d="M189 51.5h22M200 44v15" stroke="#c8102e" stroke-width="3"/>`;
      content += `<text x="200" y="${z ? 88 : 86}" text-anchor="middle" font-family="Bricolage, sans-serif" font-weight="800" font-size="17" letter-spacing=".5" fill="#fff">MM, 10K I CAMINADA · 2026</text>`;
      if (z) {
        content += zone(110, 104, 180, 62, 5, 'Principal · “by”', true);
        content += zone(100, 188, 200, 96, 6, '6 logos · esquena');
        content += zone(130, 300, 140, 30, 7, 'Institucions');
      } else {
        if (n) content += `<text x="200" y="118" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="20" fill="#fff" opacity=".9">by</text>` + svgBrand(n, 105, 124, 190, 48);
        const row = opts.row || [];
        row.slice(0, 6).forEach((b, i) => { const cx = 112 + (i % 3) * 62, cy = 196 + Math.floor(i / 3) * 44; content += b ? svgBrand(b, cx, cy, 54, 30) : `<rect x="${cx}" y="${cy + 4}" width="54" height="22" rx="4" fill="#fff" opacity=".16"/>`; });
        content += `<text x="200" y="306" text-anchor="middle" font-family="Instrument, sans-serif" font-weight="600" font-size="7" letter-spacing="1" fill="#fff" opacity=".75">AJUNTAMENTS D’IGUALADA I VILANOVA · CAI</text>`;
      }
    }
    return `<svg viewBox="0 0 400 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Samarreta oficial, ${front ? 'davant' : 'darrere'}">
      <defs>${toWhite}
        <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b5cad"/><stop offset=".55" stop-color="#0e7f8c"/><stop offset="1" stop-color="#1a7a50"/></linearGradient>
        <clipPath id="${id}c"><path d="${BODY[side]}"/></clipPath>
        <filter id="${id}s" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#0d2233" flood-opacity=".28"/></filter>
      </defs>
      <g filter="url(#${id}s)"><path d="${BODY[side]}" fill="url(#${id}g)"/></g>
      <g clip-path="url(#${id}c)">
        ${mosaic(id, 400, 430, 14, front ? 7 : 11)}
        <path d="${front ? SLEEVE_L : SLEEVE_R}" fill="#1a7a50"/><path d="${front ? SLEEVE_R : SLEEVE_L}" fill="#0b4f96"/>
        <path d="M232 40 L214 120 L246 190 L210 260 L238 330 L214 430" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="3 5" opacity=".55"/>
        <path d="M60 372 q15 -10 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 V430 H60Z" fill="#4da3ff" opacity=".35"/>
        <path d="M60 388 q15 -10 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 V430 H60Z" fill="#7fd8ff" opacity=".35"/>
        <path d="M60 372 q15 -10 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="#fff" stroke-width="1.5" opacity=".6"/>
      </g>
      <path d="${front ? 'M140 22 C165 54 235 54 260 22' : 'M140 22 C168 36 232 36 260 22'}" fill="none" stroke="#0d2a4a" stroke-width="9" stroke-linecap="round"/>
      <path d="M92 70 L82 138 M308 70 L318 138" stroke="#0d2a4a" stroke-width="1.2" opacity=".5"/>
      ${content}
    </svg>`;
  }

  /* ── Dorsal (SVG) ─────────────────────────────────────────── */
  function bib({ naming, partner, num = '1427', mod = 'MITJA MARATÓ 21K', color = '#0b5cad', head = null } = {}) {
    const headColor = head || color;
    return `<svg viewBox="0 0 480 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dorsal">
      <defs>${toWhite}<filter id="bibs"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#0d2233" flood-opacity=".22"/></filter></defs>
      <g filter="url(#bibs)"><rect x="10" y="10" width="460" height="310" rx="16" fill="#fff"/></g>
      <path d="M26 10 H454 A16 16 0 0 1 470 26 V82 H10 V26 A16 16 0 0 1 26 10Z" fill="${headColor}"/>
      <image href="${L}logo-horitzontal-blanc.svg" x="26" y="22" width="150" height="46"/>
      ${naming ? `<text x="${naming.logo ? 300 : 296}" y="46" text-anchor="end" dominant-baseline="central" font-family="Caveat, cursive" font-weight="700" font-size="24" fill="#fff" opacity=".85">by</text>${svgBrand(naming, 306, 24, 150, 44, { white: true })}` : ''}
      <text x="240" y="186" text-anchor="middle" font-family="Bricolage, sans-serif" font-weight="800" font-size="118" letter-spacing="-4" fill="#0d2233">${num}</text>
      <rect x="10" y="230" width="460" height="30" fill="${color}" opacity=".12"/>
      <text x="240" y="245" text-anchor="middle" dominant-baseline="central" font-family="Instrument, sans-serif" font-weight="700" font-size="14" letter-spacing="3" fill="${color}">${mod} · 13.12.2026</text>
      ${partner ? svgBrand(partner, 150, 272, 180, 34, { white: false }) : `<text x="240" y="290" text-anchor="middle" font-family="Instrument, sans-serif" font-size="12" fill="#6b7f8e" letter-spacing="2">FRANJA PARTNER</text>`}
      <circle cx="34" cy="106" r="6" fill="#e0e9eb"/><circle cx="446" cy="106" r="6" fill="#e0e9eb"/><circle cx="34" cy="296" r="6" fill="#e0e9eb"/><circle cx="446" cy="296" r="6" fill="#e0e9eb"/>
    </svg>`;
  }

  /* ── Arc de meta (SVG) ────────────────────────────────────── */
  function arch({ naming, color = '#0b5cad', color2 = '#1a7a50', label = 'META' } = {}) {
    return `<svg viewBox="0 0 800 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Arc de meta">
      <defs>${toWhite}
        <linearGradient id="ag" x1="0" x2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${color2}"/></linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd9dd"/><stop offset="1" stop-color="#eef3f4"/></linearGradient>
      </defs>
      <rect x="0" y="372" width="800" height="68" fill="url(#floor)"/>
      <path d="M300 440 L360 372 H440 L500 440Z" fill="#b9c7cd" opacity=".55"/>
      <path d="M392 372 H408 L414 440 H386Z" fill="#fff" opacity=".8"/>
      <path d="M110 372 V150 Q110 58 400 58 Q690 58 690 150 V372" fill="none" stroke="url(#ag)" stroke-width="70" stroke-linejoin="round"/>
      <path d="M110 372 V150 Q110 58 400 58 Q690 58 690 150 V372" fill="none" stroke="#fff" stroke-width="2" opacity=".35" transform="translate(0 -22)"/>
      <rect x="230" y="14" width="340" height="96" rx="14" fill="#fff"/>
      <image href="${L}logo-horitzontal.svg" x="${naming ? 246 : 280}" y="30" width="${naming ? 160 : 240}" height="${naming ? 64 : 64}"/>
      ${naming ? `<text x="420" y="62" text-anchor="middle" dominant-baseline="central" font-family="Caveat, cursive" font-weight="700" font-size="28" fill="#6b7f8e">by</text>${svgBrand(naming, 436, 30, 120, 64, { white: false })}` : ''}
      <text x="110" y="270" text-anchor="middle" font-family="Bricolage, sans-serif" font-weight="800" font-size="34" fill="#fff" transform="rotate(-90 110 270)" letter-spacing="6">${label}</text>
      <text x="690" y="270" text-anchor="middle" font-family="Bricolage, sans-serif" font-weight="800" font-size="34" fill="#fff" transform="rotate(90 690 270)" letter-spacing="6">${label}</text>
      ${naming ? `<g>${svgBrand(naming, 82, 300, 56, 56)}</g><g>${svgBrand(naming, 662, 300, 56, 56)}</g>` : ''}
      <rect x="330" y="200" width="140" height="44" rx="6" fill="#0d2233"/>
      <text x="400" y="223" text-anchor="middle" dominant-baseline="central" font-family="Bricolage, sans-serif" font-weight="700" font-size="26" fill="#5fd6a0" letter-spacing="2">1:24:37</text>
    </svg>`;
  }

  /* ── Catàleg ──────────────────────────────────────────────── */
  const ADJ = { cand: ['chip--cand', 'Candidatura'], ordre: ['chip--ordre', 'Per ordre'], especie: ['chip--especie', 'En espècie'] };
  function priceHTML(l) {
    if (!l.preu) return `<div class="price price--txt">${esc(l.preuTxt)}</div>`;
    return `<div class="price">${l.adj === 'cand' ? '<small class="pre">des de</small>' : ''}${eur(l.preu)}<small>+ IVA</small></div>`;
  }
  function levelCard(l, { ticks = 3, hero = false } = {}) {
    const [cls, txt] = ADJ[l.adj];
    const places = l.places ? `${l.places} ${l.places === 1 ? 'plaça' : 'places'}` : 'Sense límit';
    const extra = [l.preu && l.preuTxt ? l.preuTxt : '', l.alt || ''].filter(Boolean).join(' · ');
    return `<article class="card lvl ${hero ? 'lvl--hero' : ''}" data-lvl="${l.id}">
      <div><div class="lvl__name">${esc(l.nom)}</div><div class="lvl__lema">${esc(l.lema)}</div></div>
      <div class="lvl__price">${priceHTML(l)}<div class="lvl__meta"><span class="chip ${cls}">${txt}</span><span class="chip">${places}</span>${l.nou ? '<span class="chip chip--nou">Nou</span>' : ''}</div></div>
      ${extra ? `<div class="lvl__extra">${esc(extra)}</div>` : ''}
      <p class="lvl__que">${esc(l.que)}</p>
      ${ticks ? `<ul class="ticks">${l.inclou.slice(0, ticks).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
      <div class="lvl__ideal"><b>Ideal per a:</b> ${esc(l.ideal)}</div>
    </article>`;
  }
  function renderLevels() {
    $$('[data-levels]').forEach((el) => {
      const ids = el.dataset.levels.split(','), t = el.dataset.ticks;
      el.innerHTML = ids.map((id) => MM.nivells.find((l) => l.id === id)).filter(Boolean).map((l) => levelCard(l, { ticks: t === 'all' ? 99 : t != null ? +t : 3, hero: el.dataset.hero === l.id })).join('');
    });
    $$('[data-summary]').forEach((el) => {
      const items = [];
      MM.grups.forEach((g) => { items.push({ g }); MM.nivells.filter((l) => l.grup === g.id).forEach((l) => items.push({ l, g })); });
      const half = Math.ceil(items.length / 2), cols = [items.slice(0, half), items.slice(half)];
      if (!cols[1][0].l) {} else cols[1].unshift({ g: cols[1][0].g, cont: true });
      const tr = (it) => {
        if (!it.l) return `<tr class="grp"><td colspan="4">${esc(it.g.titol)}${it.cont ? ' (cont.)' : ''}</td></tr>`;
        const l = it.l, [cls, txt] = ADJ[l.adj];
        const p = l.preu ? (l.adj === 'cand' ? 'des de ' : '') + eur(l.preu) : esc(l.preuTxt);
        return `<tr><td><b>${esc(l.nom)}</b></td><td>${l.places || '—'}</td><td><span class="chip ${cls}">${txt}</span></td><td class="r"><b>${p}</b></td></tr>`;
      };
      el.innerHTML = cols.map((c) => `<table class="t"><thead><tr><th>Patrocini</th><th>Places</th><th>Adjudicació</th><th class="r">Mínim (+IVA)</th></tr></thead><tbody>${c.map(tr).join('')}</tbody></table>`).join('');
    });
  }

  /* ── Omplir dades i dibuixos ──────────────────────────────── */
  function get(path) { return path.split('.').reduce((o, k) => (o == null ? o : o[k]), MM); }
  function fillData() { $$('[data-mm]').forEach((el) => { const v = get(el.dataset.mm); if (v != null) el.textContent = typeof v === 'number' ? v.toLocaleString('ca-ES') : v; }); }
  function draw(brand) {
    $$('[data-shirt]').forEach((el) => {
      const cfg = JSON.parse(el.dataset.shirt || '{}');
      el.innerHTML = shirt({ ...cfg, naming: cfg.naming === false ? null : (cfg.zones ? null : brand), partners: window.MM_PARTNERS, row: window.MM_ROW });
    });
    $$('[data-bib]').forEach((el) => { const cfg = JSON.parse(el.dataset.bib || '{}'); el.innerHTML = bib({ ...cfg, naming: brand, partner: window.MM_BIB_PARTNER }); });
    $$('[data-arch]').forEach((el) => { const cfg = JSON.parse(el.dataset.arch || '{}'); el.innerHTML = arch({ ...cfg, naming: brand }); });
    $$('[data-brand]').forEach((el) => { const o = JSON.parse(el.dataset.brand || '{}'); el.innerHTML = brandMark(brand, o); });
    $$('[data-empresa]').forEach((el) => { el.textContent = brand.nom || el.dataset.empresa || 'la vostra empresa'; });
  }

  /* ── Mapa del recorregut amb actius ──────────────────────── */
  function routeMap() {
    $$('[data-routemap]').forEach((el) => {
      const K = window.MM_KM || []; if (!K.length) return;
      const av = [5, 10, 15], key = [1, 10, 15, 21];
      let pins = '';
      K.forEach(([x, y], km) => {
        if (km === 0) return;
        const isAv = av.includes(km), isKey = key.includes(km);
        pins += `<div style="position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);width:${isAv ? 30 : 20}px;height:${isAv ? 30 : 20}px;border-radius:50%;display:grid;place-items:center;font:700 ${isAv ? 12 : 10}px var(--f-s);color:#fff;background:${isAv ? '#c9a227' : isKey ? '#0d2233' : 'rgb(13 34 51 / .55)'};border:2px solid #fff;box-shadow:0 2px 6px rgb(0 0 0 / .25)">${km}</div>`;
      });
      const [sx, sy] = K[0];
      pins += `<div style="position:absolute;left:${sx}%;top:${sy}%;transform:translate(-20%,-130%);background:#0d2233;color:#fff;font:700 11px var(--f-s);letter-spacing:.08em;padding:6px 9px;border-radius:7px;white-space:nowrap">SORTIDA · META</div>`;
      el.innerHTML = `<img src="assets/img/ruta-21k-color.svg" alt="Recorregut de la Mitja Marató" style="width:100%;height:100%">${pins}`;
    });
  }

  /* ── Escalat a la pantalla ────────────────────────────────── */
  function fit() {
    const w = document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--z', w > 760 ? Math.min(1, (w - 48) / 1280).toFixed(4) : 1);
  }

  window.MMD = { shirt, bib, arch, brandMark, levelCard, renderLevels, fillData, draw, routeMap, fit, esc, eur };
  window.addEventListener('resize', fit);
})();
