/* Plantilla del correu de patrocini (HTML compatible amb Gmail: taules + estils en línia) */
(function () {
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
  const C = { ink: '#0d2233', ink2: '#3b5162', ink3: '#6b7f8e', lake: '#0b5cad', teal: '#0e7f8c', moss: '#1a7a50', mist: '#eef3f4', line: '#d3dee2', mint: '#8fd3c4', gold: '#c9a227' };

  const presets = [
    { id: 'gran', nom: 'Gran marca', nivell: 'naming', motiu: {
      ca: 'Busquem una marca que vulgui posar nom a la primera edició d’una nova etapa. El patrocinador principal forma part del nom oficial (“MM Igualada by…”), del logotip, de la samarreta i de tota la comunicació.',
      es: 'Buscamos una marca que quiera dar nombre a la primera edición de una nueva etapa. El patrocinador principal forma parte del nombre oficial («MM Igualada by…»), del logotipo, de la camiseta y de toda la comunicación.' } },
    { id: 'cocacola', nom: 'Coca-Cola', empresa: 'Coca-Cola Europacific Partners', marca: 'Coca-Cola', nivell: 'naming', adjunt: 'cocacola', motiu: {
      ca: 'La cursa necessita hidratació a quatre avituallaments i al postmeta, i la vostra cartera ja hi és present amb Aquarius i Powerade. A més, és una cursa de primavera, quan la calor fa que beure sigui imprescindible. Us proposem que la primera edició es digui MM Igualada by Coca-Cola: us adjunto una proposta feta a mida.',
      es: 'La carrera necesita hidratación en cuatro avituallamientos y en la postmeta, y vuestra cartera ya está presente con Aquarius y Powerade. Además, es una carrera de primavera, cuando el calor hace que beber sea imprescindible. Os proponemos que la primera edición se llame MM Igualada by Coca-Cola: os adjunto una propuesta hecha a medida.' } },
    { id: 'aneto', nom: 'Caldos Aneto', empresa: 'Caldos Aneto', nivell: 'bossa', motiu: {
      ca: 'Després de 21 km, el que més s’agraeix en creuar la meta és recuperar sals amb un bon brou. Us proposem la bossa del corredor (800 bosses amb el vostre producte) i un punt de recuperació a meta amb el vostre brou, per a corredors i públic.',
      es: 'Después de 21 km, lo que más se agradece al cruzar la meta es recuperar sales con un buen caldo. Os proponemos la bolsa del corredor (800 bolsas con vuestro producto) y un punto de recuperación en meta con vuestro caldo, para corredores y público.' } },
    { id: 'begudes', nom: 'Begudes / aigua', nivell: 'avituallament', motiu: {
      ca: 'Els avituallaments dels km 5, 10 i 15 necessiten aigua i isotònic per a 800 persones. Hi passen tots els corredors, a peu i mirant la taula: és el lloc natural per a la vostra marca.',
      es: 'Los avituallamientos de los km 5, 10 y 15 necesitan agua e isotónico para 800 personas. Pasan todos los corredores, a pie y mirando la mesa: es el lugar natural para vuestra marca.' } },
    { id: 'super', nom: 'Supermercat', nivell: 'modalitat', motiu: {
      ca: 'La Caminada Popular és la modalitat més familiar: oberta a totes les edats, i la que concentra més públic local. Creiem que “Caminada Popular by …” encaixa amb una marca de proximitat com la vostra.',
      es: 'La Caminada Popular es la modalidad más familiar: abierta a todas las edades, y la que concentra más público local. Creemos que «Caminada Popular by…» encaja con una marca de proximidad como la vuestra.' } },
    { id: 'esports', nom: 'Marca d’esports', nivell: 'partner', motiu: {
      ca: 'Els nostres participants són corredors que entrenen tot l’any i compren material. Una màniga de la samarreta oficial, un estand a la Fira del Corredor i l’exclusivitat de sector us posen davant de tots ells.',
      es: 'Nuestros participantes son corredores que entrenan todo el año y compran material. Una manga de la camiseta oficial, un stand en la Feria del Corredor y la exclusividad de sector os ponen delante de todos ellos.' } },
    { id: 'local', nom: 'Comerç local', nivell: 'tanques', motiu: {
      ca: 'Volem que el comerç d’Igualada i Vilanova sigui a la cursa. Una tanca a la zona de sortida o al recorregut és la manera més directa i assequible de ser-hi, i la podeu combinar amb el Pack Comerç.',
      es: 'Queremos que el comercio de Igualada y Vilanova esté en la carrera. Una valla en la zona de salida o en el recorrido es la forma más directa y asequible de estar, y podéis combinarla con el Pack Comerç.' } },
    { id: 'pime', nom: 'Empresa de l’Anoia', nivell: 'km', motiu: {
      ca: 'Cada un dels 21 quilòmetres porta el nom d’una empresa de la comarca. És una manera assequible i molt visual de formar part de la cursa, i surt al mapa interactiu de la web.',
      es: 'Cada uno de los 21 kilómetros lleva el nombre de una empresa de la comarca. Es una forma asequible y muy visual de formar parte de la carrera, y aparece en el mapa interactivo de la web.' } },
    { id: 'motor', nom: 'Banca / motor', nivell: 'meta', motiu: {
      ca: 'Els últims 200 metres són el tram més mirat i fotografiat del dia: públic, pantalla amb els noms i speaker. Vestir la recta de meta amb la vostra marca us posa a totes les fotos d’arribada.',
      es: 'Los últimos 200 metros son el tramo más mirado y fotografiado del día: público, pantalla con los nombres y speaker. Vestir la recta de meta con vuestra marca os pone en todas las fotos de llegada.' } },
    { id: 'salut', nom: 'Salut / fisio', nivell: 'llebres', motiu: {
      ca: 'Les llebres marquen el ritme de centenars de corredors durant tota la cursa i surten a moltes fotos. És un patrocini que parla de preparació, cura i rendiment.',
      es: 'Las liebres marcan el ritmo de cientos de corredores durante toda la carrera y salen en muchas fotos. Es un patrocinio que habla de preparación, cuidado y rendimiento.' } },
  ];

  const TX = {
    ca: {
      pre: (e) => `Recuperem la Mitja Marató de l’Anoia: 800 corredors l’1 d’abril al Parc Central. Proposta de patrocini per a ${e}.`,
      eyebrow: 'Dossier de patrocini 2028',
      h1: 'Torna la Mitja d’Igualada.',
      hola: (c, e) => (c ? `Hola, ${c}:` : e ? `Bon dia, equip de ${e}:` : 'Bon dia:'),
      p1: (r) => `${r ? `Em dic ${r} i formo` : 'Formo'} part del comitè organitzador de la <b>MM Igualada</b>, la mitja marató que recupera l’antiga Mitja Marató de l’Anoia, que va arribar a reunir prop de 900 corredors. El <b>dissabte 1 d’abril de 2028</b> esperem 800 participants entre la 21K, la 10K i la caminada popular, amb sortida i meta al Parc Central.`,
      boxLbl: (e) => `La nostra proposta per a ${e || 'vosaltres'}`,
      des: 'des de', iva: '+ IVA',
      p3: (adj) => adj === 'cap' ? 'Al dossier hi trobareu totes les opcions, des de 100 €, i també la podeu veure en línia:' : 'Us adjunto el dossier amb totes les opcions de patrocini, des de 100 €. També el podeu veure en línia:',
      cta: (e) => (e ? `Veure el dossier per a ${e}` : 'Veure el dossier'),
      dead: (d) => `Els espais únics (patrocinador principal, partners, modalitats) s’adjudiquen per candidatura a l’oferta més alta fins al <b>${d}</b>.`,
      p4: 'Us va bé que en parlem 15 minuts aquesta setmana? Us puc trucar o passar a veure-us.',
      bye: 'Moltes gràcies,',
      facts: [['01.04.2028', 'Parc Central'], ['800', 'participants'], ['21K · 10K', 'i Caminada']],
      foot: 'MM Igualada · 1a Mitja Marató d’Igualada · Igualada i Vilanova del Camí',
      subj: (e) => [
        `${e || 'La vostra empresa'} i la MM Igualada: us proposem ser-hi des del primer dia`,
        `Patrocini de la 1a MM Igualada (1/4/2028) · proposta per a ${e || 'la vostra empresa'}`,
        'Torna la Mitja d’Igualada. Ens hi acompanyeu?',
      ],
    },
    es: {
      pre: (e) => `Recuperamos la Mitja Marató de l’Anoia: 800 corredores el 1 de abril en el Parc Central. Propuesta de patrocinio para ${e}.`,
      eyebrow: 'Dossier de patrocinio 2028',
      h1: 'Vuelve la Media de Igualada.',
      hola: (c, e) => (c ? `Hola, ${c}:` : e ? `Buenos días, equipo de ${e}:` : 'Buenos días:'),
      p1: (r) => `${r ? `Me llamo ${r} y formo` : 'Formo'} parte del comité organizador de la <b>MM Igualada</b>, la media maratón que recupera la antigua Mitja Marató de l’Anoia, que llegó a reunir cerca de 900 corredores. El <b>sábado 1 de abril de 2028</b> esperamos 800 participantes entre la 21K, la 10K y la caminata popular, con salida y meta en el Parc Central.`,
      boxLbl: (e) => `Nuestra propuesta para ${e || 'vosotros'}`,
      des: 'desde', iva: '+ IVA',
      p3: (adj) => adj === 'cap' ? 'En el dossier encontraréis todas las opciones, desde 100 €, y también podéis verlo en línea:' : 'Os adjunto el dossier con todas las opciones de patrocinio, desde 100 €. También podéis verlo en línea:',
      cta: (e) => (e ? `Ver el dossier para ${e}` : 'Ver el dossier'),
      dead: (d) => `Los espacios únicos (patrocinador principal, partners, modalidades) se adjudican por candidatura a la oferta más alta hasta el <b>${d}</b>.`,
      p4: '¿Os va bien que lo hablemos 15 minutos esta semana? Puedo llamaros o pasar a veros.',
      bye: 'Muchas gracias,',
      facts: [['01.04.2028', 'Parc Central'], ['800', 'participantes'], ['21K · 10K', 'y Caminata']],
      foot: 'MM Igualada · 1ª Media Maratón de Igualada · Igualada y Vilanova del Camí',
      subj: (e) => [
        `${e || 'Vuestra empresa'} y la MM Igualada: os proponemos estar desde el primer día`,
        `Patrocinio de la 1ª MM Igualada (1/4/2028) · propuesta para ${e || 'vuestra empresa'}`,
        'Vuelve la Media de Igualada. ¿Nos acompañáis?',
      ],
    },
  };
  // Els noms dels nivells i els textos del catàleg estan en català (dades.js). En castellà es tradueixen els més usats.
  const ES_LVL = { naming: ['Patrocinador principal', '«MM Igualada by [vuestra marca]»'], partner: ['Partner oficial', 'Manga derecha · manga izquierda · dorsal'], modalitat: ['Patrocinador de modalidad', '«Cursa 10K by…» · «Caminada Popular by…»'], meta: ['Recta de meta', 'Los últimos 200 metros'], avituallament: ['Avituallamiento', 'Km 5 · km 10 · km 15'], km: ['Kilómetro patrocinado', '«Tu km»'], trofeus: ['Trofeos y premios', 'El podio lleva vuestro nombre'], medalla: ['Medalla finisher', 'La pieza que todos cuelgan en casa'], bossa: ['Bolsa del corredor', 'Welcome pack'], calent: ['Punto de recuperación', 'Caldo, fruta y agua fresca en meta'], fotos: ['Fotografía oficial', 'El marco de todas las fotos'], festa: ['Fiesta y Botifarrada Solidaria', '100% benéfica'], animacio: ['Punto de animación', 'Batucada · gigantes · castellers'], llebres: ['Liebres', 'Los marcadores de ritmo'], voluntaris: ['Voluntariado', '40 chalecos durante todo el día'], eco: ['Carrera limpia', 'Sostenibilidad en el Parc Fluvial'], resultats: ['Resultados y diploma', 'El tiempo de cada corredor'], tanques: ['Vallas publicitarias', 'Salida y recorrido'], esquena: ['Espalda de la camiseta', 'Fila de logos'], speaker: ['Speaker y vídeo', 'Menciones en directo'], web: ['Colaborador web y redes', 'Presencia digital'], sorteig: ['Sorteo y descuentos', 'Producto a cambio de visibilidad'], mitjans: ['Medio colaborador', 'Radio, televisión y prensa'] };
  const ES_INC = { naming: ['Nombre oficial «MM Igualada by [Marca]» en web, carteles, redes, prensa e inscripciones', 'Camiseta (pecho y espalda), dorsal, arco de salida y meta', 'Exclusividad de sector y derecho de tanteo para 2027'], partner: ['Un gran espacio exclusivo: una manga o la franja del dorsal', 'Stand de 3×3 m en la Feria del Corredor', 'Logo destacado en la web y en el cartel oficial'], avituallament: ['«Avituallamiento km X by [Marca]» en el mapa y la web', 'Banderola y mesa vestida con la marca', 'Posibilidad de servir vuestro producto'], bossa: ['Logo en las 800 bolsas', 'Producto o muestra en todas las bolsas', 'Espacio de muestreo en la Feria del Corredor'], modalitat: ['Nombre de la modalidad en web, reglamento e inscripciones', 'Logo en la pancarta de salida de la modalidad', 'Menciones del speaker en la salida de la modalidad'], meta: ['Vallas de la recta vestidas con vuestra marca (en exclusiva)', 'Logo en la pantalla de meta', 'Menciones del speaker'], km: ['Cartel kilométrico de 1×1,5 m con «Km X by [Marca]»', 'Logo en el mapa interactivo de la web', 'Publicación conjunta en redes'], tanques: ['Lona de 2×1 m (la imprime la organización)', 'Zona de salida o recorrido', 'Pack de 3 vallas: 300 €'], llebres: ['Banderolas y camisetas de las liebres con la marca', 'Logo en la página de liebres de la web'] };

  function subjects(d) { return TX[d.lang || 'ca'].subj((d.empresa || '').trim()); }

  function build(d, MM) {
    const L = d.lang || 'ca', t = TX[L], e = (d.empresa || '').trim(), c = (d.contacte || '').trim();
    const base = (d.base || '').replace(/\/?$/, '/'), img = (f) => base + 'email/' + f;
    const lvl = MM.nivells.find((x) => x.id === d.nivell) || MM.nivells[0];
    const [lvlNom, lvlLema] = L === 'es' && ES_LVL[lvl.id] ? ES_LVL[lvl.id] : [lvl.nom, lvl.lema];
    const incl = (L === 'es' ? ES_INC[lvl.id] : null) || lvl.inclou.slice(0, 3);
    const marca = (d.marca || '').trim() || e || (L === 'es' ? 'vuestra marca' : 'la vostra marca');
    const price = lvl.preu ? `${lvl.adj === 'cand' ? t.des + ' ' : ''}${lvl.preu.toLocaleString('ca-ES')} € <span style="font-size:13px;font-weight:400;color:${C.mint}">${t.iva}</span>` : esc(lvl.preuTxt);
    const q = new URLSearchParams(); if (e) q.set('empresa', (d.marca || '').trim() || e); if (c) q.set('contacte', c); if (lvl) q.set('nivell', lvl.id); if (d.logo) q.set('logo', d.logo);
    const link = MM.contacte.dossierUrl + (q.toString() ? '?' + q : '');
    const deadline = L === 'es' ? MM.terminis.candidatures.replace('de gener', 'de enero').replace('de febrer', 'de febrero').replace('de març', 'de marzo').replace('d’abril', 'de abril') : MM.terminis.candidatures;
    const motiu = esc((d.motiu || '').trim()).replace(/\n/g, '<br>');
    const P = (html, extra = '') => `<p style="margin:0 0 16px;font-family:${FONT};font-size:15.5px;line-height:1.6;color:${C.ink2};${extra}">${html}</p>`;

    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>MM Igualada</title></head><body style="margin:0;padding:0;background:${C.mist}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(t.pre(e || 'vosaltres'))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.mist}" style="background:${C.mist}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${C.line}">
  <tr><td bgcolor="${C.lake}" style="background:${C.lake};background-image:linear-gradient(135deg,${C.lake} 0%,${C.teal} 55%,${C.moss} 100%);padding:26px 34px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td valign="middle"><img src="${img('logo-blanc.png')}" width="190" alt="MM Igualada · Mitja Marató" style="display:block;width:190px;max-width:100%;height:auto;border:0"></td>
      <td valign="middle" align="right" style="font-family:${FONT};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#d6f3ea;font-weight:700">${esc(t.eyebrow)}</td>
    </tr></table>
  </td></tr>
  <tr><td><img src="${img('hero.jpg')}" width="600" alt="Igualada des de l’aire" style="display:block;width:100%;max-width:600px;height:auto;border:0"></td></tr>
  <tr><td style="padding:34px 34px 8px">
    <h1 style="margin:0 0 20px;font-family:${FONT};font-size:30px;line-height:1.1;font-weight:800;letter-spacing:-0.5px;color:${C.ink}">${esc(t.h1)}</h1>
    ${P(`<b style="color:${C.ink}">${esc(t.hola(c, e))}</b>`)}
    ${P(t.p1(esc((d.remitent || '').trim())))}
    ${motiu ? P(motiu) : ''}
  </td></tr>
  <tr><td style="padding:4px 34px 8px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.ink}" style="background:${C.ink};border-radius:14px"><tr><td style="padding:24px 26px">
      <div style="font-family:${FONT};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${C.mint}">${esc(t.boxLbl(e))}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px"><tr>
        <td valign="top" style="font-family:${FONT};color:#ffffff"><div style="font-size:22px;font-weight:800;line-height:1.15">${esc(lvlNom)}</div><div style="font-size:13px;color:#a9b9c4;margin-top:4px">${esc(lvlLema.replace(/\[(la vostra marca|vuestra marca)\]/, marca))}</div></td>
        <td valign="top" align="right" style="font-family:${FONT};color:#ffffff;font-size:24px;font-weight:800;white-space:nowrap;padding-left:12px">${price}</td>
      </tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;border-top:1px solid #2a4052">
        ${incl.map((i) => `<tr><td width="22" valign="top" style="padding-top:11px;font-family:${FONT};font-size:14px;color:${C.mint};font-weight:700">✓</td><td style="padding-top:10px;font-family:${FONT};font-size:14px;line-height:1.45;color:#dbe5ea">${esc(i.replace(/\[Marca\]/g, marca))}</td></tr>`).join('')}
      </table>
    </td></tr></table>
  </td></tr>
  <tr><td style="padding:22px 34px 4px">
    ${P(esc(t.p3(d.adjunt)))}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${C.lake}" style="border-radius:10px;background:${C.lake}"><a href="${esc(link)}" target="_blank" style="display:inline-block;padding:14px 22px;font-family:${FONT};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px">${esc(t.cta(e))} &rarr;</a></td></tr></table>
  </td></tr>
  <tr><td style="padding:26px 34px 6px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.line};border-bottom:1px solid ${C.line}"><tr>
      ${t.facts.map(([a, b], i) => `<td width="33%" align="center" style="padding:16px 6px;${i ? `border-left:1px solid ${C.line};` : ''}font-family:${FONT}"><div style="font-size:19px;font-weight:800;color:${C.lake};letter-spacing:-0.3px">${a}</div><div style="font-size:12px;color:${C.ink3};margin-top:3px">${b}</div></td>`).join('')}
    </tr></table>
  </td></tr>
  <tr><td style="padding:22px 34px 10px">
    ${P(t.dead(esc(deadline)), 'font-size:14px')}
    ${P(esc(t.p4))}
    ${P(esc(t.bye), 'margin-bottom:6px')}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px"><tr>
      <td valign="top" style="padding-right:14px"><img src="${img('icona.png')}" width="44" height="44" alt="" style="display:block;border:0;border-radius:10px"></td>
      <td valign="top" style="font-family:${FONT};font-size:14px;line-height:1.5;color:${C.ink2}">
        <b style="color:${C.ink};font-size:15px">${esc(d.remitent || MM.contacte.persona)}</b><br>${esc(d.carrec || '')}<br>
        ${d.tel ? `${esc(d.tel)}<br>` : ''}${d.mail ? `<a href="mailto:${esc(d.mail)}" style="color:${C.lake};text-decoration:none">${esc(d.mail)}</a><br>` : ''}
        <a href="${esc(MM.contacte.webUrl)}" style="color:${C.lake};text-decoration:none">${esc(MM.contacte.web)}</a>
      </td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:22px 34px 26px">
    <div style="height:4px;border-radius:2px;background:${C.lake};background-image:linear-gradient(90deg,${C.lake},${C.teal},${C.moss})"></div>
    <p style="margin:12px 0 0;font-family:${FONT};font-size:11.5px;line-height:1.5;color:${C.ink3}">${esc(t.foot)}</p>
  </td></tr>
</table>
</td></tr></table></body></html>`;

    const strip = (s) => s.replace(/<[^>]+>/g, '');
    const text = [t.hola(c, e), '', strip(t.p1((d.remitent || '').trim())), '', (d.motiu || '').trim(), '',
      `${t.boxLbl(e)}: ${lvlNom} (${strip(price)})`, ...incl.map((i) => '  ✓ ' + i.replace(/\[Marca\]/g, marca)), '',
      t.p3(d.adjunt), link, '', strip(t.dead(deadline)), '', t.p4, '', t.bye, d.remitent || MM.contacte.persona, d.carrec || '', d.tel || '', d.mail || '', MM.contacte.web].join('\n');
    return { html, text };
  }

  window.MMMail = { presets, subjects, build };
})();
