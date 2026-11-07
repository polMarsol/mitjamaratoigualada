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
    const tx = anchor === 'middle' ? x + w / 2 : x, fill = white ? '#fff' : (brand.color || '#0b5cad');
    const t = (str, yy, f) => `<text x="${tx}" y="${yy}" text-anchor="${anchor}" dominant-baseline="central" font-family="Bricolage, sans-serif" font-weight="800" font-size="${f.toFixed(1)}" letter-spacing="-0.5" fill="${fill}">${esc(str)}</text>`;
    const fs = Math.min(h * 0.62, (w / Math.max(name.length, 4)) * 1.75);
    const words = name.split(' ');
    if (fs < h * 0.34 && words.length > 1) { // nom llarg en una caixa alta: dues línies
      let best = 1, diff = 1e9;
      for (let i = 1; i < words.length; i++) { const d = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length); if (d < diff) { diff = d; best = i; } }
      const l1 = words.slice(0, best).join(' '), l2 = words.slice(best).join(' ');
      const f2 = Math.min(h * 0.4, (w / Math.max(l1.length, l2.length, 4)) * 1.75);
      return t(l1, y + h / 2 - f2 * 0.52, f2) + t(l2, y + h / 2 + f2 * 0.52, f2);
    }
    return t(name, y + h / 2, fs);
  }
  const toWhite = '<filter id="toWhite"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/></filter>';

  /* ── Samarreta oficial (foto de la web, netejada) + logos a sobre ──────────────
     Coordenades en píxels de la foto original (davant 957×1200, darrere 947×1200).
     Davant: MMI al pit dret (esquerra de qui mira) i la marca al pit esquerre, una mica més gran.
     Darrere: títol, “by” + marca, fila de 6 logos (sense repetir cap marca) i institucions.        */
  const SHIRT = { front: { w: 957, h: 1200, img: 'assets/img/samarreta-front.webp' }, back: { w: 947, h: 1200, img: 'assets/img/samarreta-back.webp' } };
  const uniq = (list, skip = []) => {
    const seen = new Set(skip.filter(Boolean).map((b) => (b.nom || '').toLowerCase()));
    return (list || []).filter((b) => { const k = (b && b.nom || '').toLowerCase(); if (!b || !k || seen.has(k)) return false; seen.add(k); return true; });
  };
  /* opts: { side:'front'|'back', zones:bool, naming:brand|null, partners:[brand,brand], row:[brand×6] } */
  function shirt(opts = {}) {
    const side = opts.side || 'front', front = side === 'front', S = SHIRT[side], z = opts.zones, n = opts.naming;
    const partners = uniq(opts.partners, [n]).slice(0, 2), row = uniq(opts.row, [n, ...partners]).slice(0, 6);
    const zone = (x, y, w, h, num, label, hot) => `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${hot ? 'rgb(255 255 255 / .2)' : 'rgb(255 255 255 / .1)'}" stroke="#fff" stroke-width="3.5" stroke-dasharray="12 9"/>
      <circle cx="${x}" cy="${y}" r="26" fill="${hot ? '#c9a227' : '#0d2233'}" stroke="#fff" stroke-width="3.5"/>
      <text x="${x}" y="${y + 1}" text-anchor="middle" dominant-baseline="central" font-family="Instrument, sans-serif" font-weight="700" font-size="26" fill="#fff">${num}</text>
      ${label ? `<text x="${x + w / 2}" y="${y + h / 2}" text-anchor="middle" dominant-baseline="central" font-family="Instrument, sans-serif" font-weight="700" font-size="24" fill="#fff">${label}</text>` : ''}`;
    let c = '';
    if (front) {
      // Pit dret (esquerra de qui mira): MMI · pit esquerre: marca, ~15% més gran
      c += z ? zone(290, 222, 150, 150, 2, 'MMI') : `<image href="${L}logo-mono-blanc.svg" x="304" y="234" width="128" height="129"/>`;
      c += z ? zone(570, 215, 180, 165, 1, 'Principal', true) : (n ? svgBrand(n, 556, 224, 210, 142) : '');
      c += z ? zone(30, 288, 80, 80, 3, '') : (partners[0] ? `<g transform="rotate(-8 58 330)">${svgBrand(partners[0], 16, 308, 86, 44)}</g>` : '');
      c += z ? zone(846, 292, 80, 80, 4, '') : (partners[1] ? `<g transform="rotate(8 898 334)">${svgBrand(partners[1], 856, 312, 86, 44)}</g>` : '');
    } else {
      const cx = 473;
      if (z) {
        c += zone(250, 172, 446, 300, 5, 'Títol + “by” principal', true);
        c += zone(285, 530, 376, 250, 6, '6 logos (un per marca)');
        c += zone(270, 870, 406, 80, 7, 'Institucions');
      } else {
        // Amb patrocinador principal el títol es redueix perquè mani el “by MARCA”
        const t = n ? 38 : 46;
        c += `<text x="${cx}" y="${n ? 208 : 222}" text-anchor="middle" font-family="Bricolage, sans-serif" font-weight="800" font-size="${t}" letter-spacing="1" fill="#fff">MM, 10K I CAMINADA</text>`;
        c += `<text x="${cx}" y="${n ? 254 : 276}" text-anchor="middle" font-family="Bricolage, sans-serif" font-weight="800" font-size="${t}" letter-spacing="1" fill="#fff">IGUALADA 2028</text>`;
        if (n) {
          c += `<text x="${cx}" y="318" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="56" fill="#fff">by</text>`;
          c += svgBrand(n, cx - 210, 334, 420, 128);
        }
        for (let i = 0; i < 6; i++) {
          const x = 300 + (i % 3) * 120, y = 560 + Math.floor(i / 3) * 100, b = row[i];
          c += b ? svgBrand(b, x, y, 106, 64) : `<rect x="${x}" y="${y + 6}" width="106" height="52" rx="10" fill="#fff" opacity=".13"/>`;
        }
        c += `<rect x="262" y="880" width="422" height="64" rx="12" fill="#0d2233" opacity=".18"/>`;
        c += `<text x="${cx}" y="902" text-anchor="middle" font-family="Instrument, sans-serif" font-weight="700" font-size="17" letter-spacing="2" fill="#fff" opacity=".9">AMB EL SUPORT DE</text>`;
        c += `<text x="${cx}" y="930" text-anchor="middle" font-family="Instrument, sans-serif" font-weight="600" font-size="20" fill="#fff" opacity=".9">Aj. d’Igualada · Aj. de Vilanova del Camí · CAI</text>`;
      }
    }
    return `<svg viewBox="0 0 ${S.w} ${S.h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Samarreta oficial, ${front ? 'davant' : 'darrere'}">
      <defs>${toWhite}<filter id="shs${side}" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#0d2233" flood-opacity=".25"/></filter></defs>
      <image href="${S.img}" x="0" y="0" width="${S.w}" height="${S.h}" filter="url(#shs${side})"/>
      <g opacity=".96">${c}</g>
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
      <text x="240" y="245" text-anchor="middle" dominant-baseline="central" font-family="Instrument, sans-serif" font-weight="700" font-size="14" letter-spacing="3" fill="${color}">${mod} · 01.04.2028</text>
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
