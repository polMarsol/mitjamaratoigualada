/* ════════════════════════════════════════════════════════════════════
   DADES DEL DOSSIER DE PATROCINI · MM Igualada 2028
   Font única per als dos dossiers i el generador de correus.
   Canvia aquí preus, dates o contacte i es reflecteix a tot arreu.
   ⚠ = PLACEHOLDER, cal confirmar-ho abans d'enviar res.
   ════════════════════════════════════════════════════════════════════ */
window.MM = {
  event: {
    nom: 'MM Igualada',
    nomLlarg: "1a Mitja Marató d'Igualada",
    edicio: '2028',
    data: 'Dissabte 1 d’abril de 2028', // ⚠ mateixa data provisional que la web
    dataCurta: '01.04.2028',
    fira: 'Divendres 31 de març · Fira del Corredor',
    lloc: 'Parc Central · Igualada i Vilanova del Camí',
    participants: 800, // objectiu (pressupost base de les notes)
    record: 900, // màxim històric de la MM de l'Anoia (entrevista CAI)
    voluntaris: 40,
    espectadors: '2.000', // ⚠ previsió
    pressupost: '8.100 – 10.500 €',
  },
  contacte: {
    persona: 'Comitè Organitzador', // ⚠ nom de qui signa
    carrec: 'Àrea de patrocini',
    email: 'patrocini@mmigualada.example', // ⚠
    telefon: '+34 600 000 000', // ⚠
    web: 'mitjamaratoigualada.vercel.app',
    webUrl: 'https://mitjamaratoigualada.vercel.app/ca/',
    dossierUrl: 'https://mitjamaratoigualada.vercel.app/patrocini/', // versió web del dossier general
  },
  terminis: {
    candidatures: '15 de gener de 2028', // ⚠ tancament de candidatures (grans patrocinis)
    adjudicacio: '22 de gener de 2028',
    logos: '15 de febrer de 2028', // data límit per rebre logos vectorials (impressió de samarretes)
    resta: '10 de març de 2028', // data límit per a la resta de patrocinis
  },
  modalitats: [
    { id: '21k', nom: 'Mitja Marató', km: '21,097', hora: '08:30', desn: '+180 m', edat: '+18 anys', tall: '3 h', color: '#0b5cad' },
    { id: '10k', nom: 'Cursa 10K', km: '10', hora: '09:00', desn: '+72 m', edat: '+14 anys', tall: '1 h 30', color: '#0e7f8c' },
    { id: 'walk', nom: 'Caminada Popular', km: '6–8', hora: '09:15', desn: '+56 m', edat: 'Totes les edats', tall: '2 h 30', color: '#1a7a50' },
  ],

  /* ── CATÀLEG ─────────────────────────────────────────────────────────
     adj: 'cand' = candidatura (s'adjudica a l'oferta més alta, a partir del mínim)
          'ordre' = per ordre de confirmació
          'especie' = en espècie (producte o servei)
     preu: mínim en € (sense IVA). preuTxt substitueix el preu quan cal.          */
  grups: [
    { id: 'grans', titol: 'Grans patrocinis', sub: 'Places úniques, adjudicades per candidatura a l’oferta més alta.' },
    { id: 'moments', titol: 'Moments de la cursa', sub: 'Associa la marca a un instant concret del dia: on la gent mira, s’atura i fa fotos.' },
    { id: 'visibilitat', titol: 'Visibilitat', sub: 'Presència directa i econòmica, pensada per al comerç i l’empresa local.' },
    { id: 'especie', titol: 'Col·laboració en espècie', sub: 'Producte o servei a canvi de visibilitat equivalent.' },
  ],
  nivells: [
    {
      id: 'naming', grup: 'grans', nom: 'Patrocinador principal', lema: '“MM Igualada by [la vostra marca]”',
      places: 1, preu: 3000, adj: 'cand', destacat: true,
      que: 'La marca passa a formar part del nom oficial de la cursa i del logotip durant tota l’edició. És el nivell que dona més presència: apareix a tot el que es comunica, es porta i es fotografia.',
      inclou: [
        'Nom oficial “MM Igualada by [Marca]” a web, cartells, xarxes, premsa i plataforma d’inscripcions',
        'Logotip fusionat dissenyat a mida i lliurat en tots els formats',
        'Samarreta: pit esquerre (al costat del MMI, una mica més gran) i “by [Marca]” a l’esquena',
        'Capçalera del dorsal de les tres modalitats',
        'Arc de sortida i meta i photocall de meta (en exclusiva)',
        'Estand de 6×3 m a la Fira del Corredor i a la zona de meta',
        'Mencions de l’speaker cada 15 minuts i 4 publicacions dedicades a xarxes',
        '10 inscripcions gratuïtes per a l’equip',
        'Exclusivitat total del sector i dret de tanteig per a l’edició 2027',
        'Informe de retorn amb fotos, abast i dades d’impacte',
      ],
      ideal: 'Grans marques de consum, begudes, alimentació, automoció o banca amb presència a l’Anoia.',
    },
    {
      id: 'partner', grup: 'grans', nom: 'Partner oficial', lema: 'Màniga dreta · màniga esquerra · dorsal',
      places: 3, preu: 1000, adj: 'cand',
      que: 'Tres places amb exclusivitat de sector. Cada partner escull un gran espai propi, per ordre d’oferta: una màniga de la samarreta o la franja inferior del dorsal.',
      inclou: [
        'Un espai gran exclusiu: màniga dreta, màniga esquerra o franja del dorsal',
        'Estand de 3×3 m a la Fira del Corredor',
        'Logo destacat a la web i al cartell oficial',
        'Mencions de l’speaker i 2 publicacions a xarxes',
        '4 inscripcions gratuïtes',
      ],
      ideal: 'Marques esportives, equipament tècnic, salut, energia i indústria de la comarca.',
    },
    {
      id: 'modalitat', grup: 'grans', nom: 'Patrocinador de modalitat', lema: '“Cursa 10K by…” · “Caminada Popular by…”',
      places: 2, preu: 700, preuTxt: '10K: 800 € · Caminada: 600 €', adj: 'cand',
      que: 'La marca dona nom a una de les dues modalitats curtes. La Caminada és la més familiar i la que concentra més públic local: ideal per a marques de consum de proximitat.',
      inclou: [
        'Nom de la modalitat a la web, al reglament i a les inscripcions',
        'Logo a la pancarta de sortida de la modalitat',
        'Mencions de l’speaker a la sortida de la modalitat',
        '2 inscripcions gratuïtes',
      ],
      ideal: 'Supermercats, alimentació, assegurances i salut familiar.',
    },
    {
      id: 'meta', grup: 'moments', nom: 'Recta de meta', lema: 'Els últims 200 metres',
      places: 1, preu: 700, adj: 'cand',
      que: 'El tram més mirat i fotografiat del dia, on hi ha el públic, la pantalla amb els noms i l’speaker. Les tanques laterals es vesteixen amb la marca.',
      inclou: ['Tanques de la recta vestides amb lones de la marca (en exclusiva)', 'Logo a la pantalla de meta, amb el nom i el temps de cada corredor', 'Mencions de l’speaker'],
      ideal: 'Concessionaris, entitats financeres i marques que volen estar a la foto final.',
    },
    {
      id: 'avituallament', grup: 'moments', nom: 'Avituallament', lema: 'Km 5 · km 10 · km 15',
      places: 3, preu: 400, adj: 'ordre', alt: 'o producte equivalent',
      que: 'Cada punt d’avituallament porta el nom d’una marca. Hi passen tots els corredors, normalment a peu i mirant la taula.',
      inclou: ['“Avituallament km X by [Marca]” al mapa, a la web i al llibre de ruta', 'Banderola i taula vestida amb la marca', 'Possibilitat de servir-hi el vostre producte'],
      ideal: 'Begudes, aigua, fruita, supermercats i nutrició esportiva.',
    },
    {
      id: 'km', grup: 'moments', nom: 'Quilòmetre patrocinat', lema: '“El teu km”',
      places: 21, preu: 120, preuTxt: '120 € · km clau 250 €', adj: 'ordre',
      que: 'Cada un dels 21 cartells quilomètrics porta una marca. Els quilòmetres clau (km 1, km 10 del control de pas, km 15 i km 21) valen més perquè s’hi concentra més atenció.',
      inclou: ['Cartell quilomètric d’1×1,5 m amb “Km X by [Marca]”', 'Logo al mapa interactiu de la web, al punt del quilòmetre', 'Publicació conjunta a xarxes: “Els quilòmetres de la MM Igualada”'],
      ideal: 'Pimes de l’Anoia, despatxos, tallers, botigues: una forma assequible de ser dins la cursa.',
    },
    {
      id: 'trofeus', grup: 'moments', nom: 'Trofeus i premis', lema: 'El pòdium porta el vostre nom',
      places: 1, preu: 600, preuTxt: '600 € · per categoria 150 €', adj: 'ordre',
      que: 'Patrocini de tots els trofeus: absoluts masculí i femení, categories Sènior, Màster 35, 45 i 55+, i categories inclusives d’esport adaptat. També es pot patrocinar una sola categoria, en diners o amb material de premi.',
      inclou: ['Logo als trofeus', 'Lliurament dels trofeus a l’escenari (tots, en exclusiva)', 'Fons del pòdium amb la marca, a totes les fotos de premis', 'Possibilitat de premi en material (val de botiga, producte)'],
      ideal: 'Botigues d’esports, joieries, òptiques i marques que vulguin associar-se a l’èxit.',
    },
    {
      id: 'medalla', grup: 'moments', nom: 'Medalla finisher', lema: 'La peça que tothom penja a casa',
      places: 1, preu: 900, adj: 'cand', nou: true,
      que: 'Proposta nova: una medalla per a cada persona que acabi la 21K i la 10K. El patrocini en cobreix la producció, i la marca queda gravada al revers i estampada a la cinta.',
      inclou: ['Logo al revers de la medalla i a la cinta', 'La medalla és la foto més compartida a xarxes després de la cursa', 'Lliurament a la línia de meta'],
      ideal: 'Marques que busquen un record físic i durador.',
    },
    {
      id: 'bossa', grup: 'moments', nom: 'Bossa del corredor', lema: 'Welcome pack',
      places: 1, preu: 400, adj: 'ordre', alt: '+ producte per a 800 bosses',
      que: 'Les 800 bosses que es lliuren amb el dorsal porten la marca i el vostre producte. Es lliuren en mà a la Fira del Corredor, el dia abans de la cursa.',
      inclou: ['Logo a la bossa', 'Producte o mostra a totes les bosses', 'Fullet o val de descompte a dins', 'Espai de mostreig a la Fira del Corredor'],
      ideal: 'Alimentació (brou, barretes, fruita seca), cosmètica esportiva, farmàcies. Perfil Caldos Aneto.',
    },
    {
      id: 'calent', grup: 'moments', nom: 'Punt de recuperació', lema: 'Brou, fruita i aigua fresca a meta',
      places: 1, preu: 0, preuTxt: 'Producte + 200 €', adj: 'especie', alt: '≈800 racions de brou',
      que: 'Després de 21 km, el que més s’agraeix en arribar és recuperar sals. Proposem un punt amb la marca al postmeta que serveixi brou tebi, fruita i aigua fresca a corredors i públic.',
      inclou: ['Carpa “Punt de recuperació by [Marca]” al postmeta', 'Producte servit per voluntaris', 'Menció de l’speaker i publicació a xarxes'],
      ideal: 'Brous i sopes (Aneto), fruita, begudes de recuperació.',
    },
    {
      id: 'fotos', grup: 'moments', nom: 'Fotografia oficial', lema: 'El marc de totes les fotos',
      places: 1, preu: 350, adj: 'ordre',
      que: 'Totes les fotos oficials de la cursa, que es descarreguen i es comparteixen, porten un marc discret amb la marca. Inclou un punt de fotògraf patrocinat al recorregut.',
      inclou: ['Marc amb el logo a totes les fotos oficials', 'Punt de fotografia “by [Marca]” al recorregut', 'Logo a la galeria de la web'],
      ideal: 'Òptiques, estudis de fotografia, telecomunicacions.',
    },
    {
      id: 'festa', grup: 'moments', nom: 'Festa i Botifarrada Solidària', lema: '100% benèfica',
      places: 1, preu: 500, adj: 'ordre', alt: 'o producte',
      que: 'La festa postcursa amb Aleon DJ i la botifarrada popular, amb la recaptació 100% destinada a una entitat social de la ciutat. És el moment de més públic i el de més valor reputacional.',
      inclou: ['Nom a la festa i a la barra', 'Logo a l’escenari del DJ', 'Comunicació conjunta de la xifra solidària recaptada'],
      ideal: 'Alimentació (Bonàrea, xarcuteria local), cerveses i begudes.',
    },
    {
      id: 'animacio', grup: 'moments', nom: 'Punt d’animació', lema: 'Batucada · gegants · castellers',
      places: 3, preu: 250, adj: 'ordre',
      que: 'Els punts del recorregut amb música o cultura popular, on el públic s’atura. El vostre nom va a la pancarta del punt.',
      inclou: ['“Punt d’animació by [Marca]” al mapa i al recorregut', 'Pancarta al punt', 'Menció a xarxes amb vídeo'],
      ideal: 'Comerç del barri on hi ha el punt.',
    },
    {
      id: 'llebres', grup: 'moments', nom: 'Llebres', lema: 'Els marcadors de ritme',
      places: 1, preu: 300, adj: 'ordre',
      que: 'Els corredors que marquen ritme (1 h 30, 1 h 45, 2 h…) porten banderoles amb la marca durant tota la cursa i surten a moltes fotos.',
      inclou: ['Banderoles i samarretes de les llebres amb la marca', 'Logo a la pàgina de llebres de la web'],
      ideal: 'Fisioteràpia, clíniques esportives, rellotgeria.',
    },
    {
      id: 'voluntaris', grup: 'moments', nom: 'Voluntariat', lema: '40 armilles durant tot el dia',
      places: 1, preu: 400, adj: 'ordre',
      que: 'Les armilles dels voluntaris porten la marca. Són al recorregut, a les cruïlles i als avituallaments des de les 7 h fins al final.',
      inclou: ['Logo a les armilles dels voluntaris', 'Menció a la pàgina de voluntariat'],
      ideal: 'Empreses amb programes de voluntariat o RSC.',
    },
    {
      id: 'eco', grup: 'moments', nom: 'Cursa neta', lema: 'Sostenibilitat al Parc Fluvial',
      places: 1, preu: 400, adj: 'ordre',
      que: 'Patrocini del pla de residus: gots compostables, aigua en dipòsits en lloc d’ampolles i punts nets amb recollida selectiva. Una part del recorregut passa per l’Anella Verda i el Parc Fluvial.',
      inclou: ['“Cursa neta by [Marca]” als punts nets', 'Logo als contenidors i a la comunicació ambiental', 'Dades de residus evitats a l’informe final'],
      ideal: 'Energia, gestió de residus, cooperatives agràries.',
    },
    {
      id: 'resultats', grup: 'moments', nom: 'Resultats i diploma', lema: 'El temps de cada corredor',
      places: 1, preu: 300, adj: 'ordre',
      que: 'La marca acompanya cada classificació i el diploma digital que tothom descarrega amb el seu temps.',
      inclou: ['Logo a les classificacions de la web', 'Logo al diploma digital', 'Logo a l’SMS o correu amb el temps'],
      ideal: 'Tecnologia, telecomunicacions, assessories.',
    },
    {
      id: 'tanques', grup: 'visibilitat', nom: 'Tanques publicitàries', lema: 'Les “vallas”',
      places: 20, preu: 120, preuTxt: 'Recorregut 120 € · zona de sortida 180 € · pack de 3: 300 €', adj: 'ordre',
      que: 'Lona de 2×1 m en una tanca, a la zona de sortida o en un tram del recorregut (la recta de meta és un patrocini propi). És el format clàssic i el més assequible. Referència del CAI: unes 300 € l’any per pancarta.',
      inclou: ['Lona de 2×1 m (la imprimeix l’organització)', 'Cada tanca és d’una sola marca, ubicació per ordre de confirmació'],
      ideal: 'Qualsevol comerç o empresa local.',
    },
    {
      id: 'esquena', grup: 'visibilitat', nom: 'Esquena de la samarreta', lema: 'Fila de logos',
      places: 6, preu: 350, adj: 'ordre',
      que: 'Logo a la fila de patrocinadors de l’esquena de la samarreta oficial. 800 samarretes tècniques que es fan servir als entrenaments durant mesos.',
      inclou: ['Logo a la fila de l’esquena (6 posicions)', 'Logo a la web i a la publicació de presentació de la samarreta'],
      ideal: 'Empreses de l’Anoia que vulguin presència duradora.',
    },
    {
      id: 'speaker', grup: 'visibilitat', nom: 'Speaker i vídeo', lema: 'Mencions en directe',
      places: 6, preu: 150, adj: 'ordre',
      que: 'Mencions de l’speaker durant tot el matí i el logo al vídeo resum de la cursa.',
      inclou: ['10 mencions de l’speaker', 'Logo al vídeo resum'],
      ideal: 'Restauració, comerç, serveis.',
    },
    {
      id: 'web', grup: 'visibilitat', nom: 'Col·laborador web i xarxes', lema: 'Presència digital',
      places: 0, preu: 100, adj: 'ordre',
      que: 'Logo amb enllaç a la secció de patrocinadors de la web oficial (català, castellà i anglès) i menció a la publicació d’agraïment.',
      inclou: ['Logo i enllaç a la web', 'Menció a la publicació conjunta d’agraïment'],
      ideal: 'Comerç local i professionals.',
    },
    {
      id: 'sorteig', grup: 'especie', nom: 'Sorteig i descomptes', lema: 'Producte a canvi de visibilitat',
      places: 0, preu: 0, preuTxt: 'Producte o val', adj: 'especie',
      que: 'Lots per al sorteig entre els inscrits, o un descompte a la bossa del corredor. A partir de 300 € de valor de mercat, rep les contrapartides del nivell equivalent.',
      inclou: ['Nom al sorteig i a la publicació del guanyador', 'Logo a la web com a col·laborador'],
      ideal: 'Botigues, restaurants, gimnasos, hotels.',
    },
    {
      id: 'mitjans', grup: 'especie', nom: 'Mitjà col·laborador', lema: 'Ràdio, televisió i premsa',
      places: 0, preu: 0, preuTxt: 'Intercanvi', adj: 'especie',
      que: 'Difusió a canvi de presència com a mitjà oficial. Ràdio Igualada i Canal Taronja ja han fet difusió gratuïta en edicions anteriors.',
      inclou: ['Logo de mitjà oficial', 'Accés preferent a entrevistes i a la zona de meta'],
      ideal: 'Ràdios, televisions locals i premsa comarcal.',
    },
  ],
  packs: [
    { nom: 'Pack Comerç', preu: 250, inclou: 'Tanca al recorregut + col·laborador web + lot al sorteig', per: 'Botigues i restauració' },
    { nom: 'Pack Empresa Anoia', preu: 550, inclou: 'Quilòmetre patrocinat + logo a l’esquena + tanca a la sortida', per: 'Pimes de la comarca' },
    { nom: 'Pack Dia de Cursa', preu: 900, inclou: 'Avituallament + km clau + speaker + 2 tanques', per: 'Marques que volen ser al recorregut' },
  ],
};
