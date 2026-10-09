// Apartats d'informació validats l'octubre de 2026. ATENCIÓ: bona part del contingut continua sent una proposta
// (horaris de llançadores i fira, preus, terminis, franges d'edat, llebres, allotjaments, botiga, xifres ambientals):
// cal substituir-ho per dades confirmades abans de publicar. Textos en ca/es; l'anglès mostra el castellà (pendent de traduir).
import type { Lang } from '../i18n';
import L from './logistics.json';

export type T2 = [string, string];
export const tr = (v: T2 | string, lang: Lang) => (typeof v === 'string' ? v : v[lang === 'ca' ? 0 : 1]);
const aid = Object.fromEntries(L.aid.map((a) => [a.id, a]));
const START = { lat: 41.58647, lon: 1.62578 };

// Aparcaments reals d'OpenStreetMap (nom, coordenades i places); la resta de dades són proposta.
const PARK = [
  { lat: 41.58631, lon: 1.61797, t: ['P1 · Sagrada Família', 'P1 · Sagrada Família'], d: ['110 places · gratuït · 9 min a peu de la sortida', '110 plazas · gratuito · 9 min a pie de la salida'], c: 'p' },
  { lat: 41.58673, lon: 1.61535, t: ['P2 · Piera', 'P2 · Piera'], d: ['116 places · gratuït · 12 min a peu', '116 plazas · gratuito · 12 min a pie'], c: 'p' },
  { lat: 41.58999, lon: 1.61947, t: ['P3 · Hospital Universitari', 'P3 · Hospital Universitari'], d: ['207 places · gratuït · bus llançadora cada 10 min (07:00–08:20)', '207 plazas · gratuito · bus lanzadera cada 10 min (07:00–08:20)'], c: 'p' },
  { lat: 41.59006, lon: 1.612, t: ['P4 · Comarca', 'P4 · Comarca'], d: ['115 places · gratuït · bus llançadora', '115 plazas · gratuito · bus lanzadera'], c: 'p' },
  { lat: 41.57863, lon: 1.62351, t: ['P5 · La Masuca', 'P5 · La Masuca'], d: ['133 places · gratuït · queda dins del tall a partir de les 08:45', '133 plazas · gratuito · queda dentro del corte a partir de las 08:45'], c: 'w' },
  { lat: 41.57825, lon: 1.61574, t: ['P6 · Parkia Igualada Centre', 'P6 · Parkia Igualada Centre'], d: ['Soterrani de pagament · tarifa cursa 3 € tot el matí amb el dorsal', 'Subterráneo de pago · tarifa carrera 3 € toda la mañana con el dorsal'], c: 'p' },
  { lat: 41.57763, lon: 1.631, t: ['Estació d’autobusos i FGC (R6)', 'Estación de autobuses y FGC (R6)'], d: ['Hispano Igualadina des de Barcelona (1 h 10) · tren R6 des de Pl. Espanya (1 h 30) · 15 min a peu', 'Hispano Igualadina desde Barcelona (1 h 10) · tren R6 desde Pl. Espanya (1 h 30) · 15 min a pie'], c: 't' },
  { ...START, t: ['Sortida i meta', 'Salida y meta'], d: ['Av. del Mestre Montaner / Av. de Catalunya · Parc Central', 'Av. del Mestre Montaner / Av. de Catalunya · Parc Central'], c: 's' },
];
const SIGHTS = [
  { lat: 41.57716, lon: 1.61384, t: ['Museu de la Pell i barri del Rec', 'Museu de la Pell y barrio del Rec'], d: ['Les antigues adoberies vora el rec medieval. Entrada gratuïta amb el dorsal tot el cap de setmana.', 'Las antiguas curtidurías junto al rec medieval. Entrada gratuita con el dorsal todo el fin de semana.'], c: 't' },
  { lat: 41.57879, lon: 1.61828, t: ['Basílica de Santa Maria', 'Basílica de Santa Maria'], d: ['El cor del nucli antic, a dos minuts de la plaça de l’Ajuntament.', 'El corazón del casco antiguo, a dos minutos de la plaza del Ayuntamiento.'], c: 't' },
  { lat: 41.58117, lon: 1.6171, t: ['Plaça de Cal Font', 'Plaza de Cal Font'], d: ['La plaça que inspira la samarreta: terrasses i ambient postcursa.', 'La plaza que inspira la camiseta: terrazas y ambiente poscarrera.'], c: 't' },
  { lat: 41.56677, lon: 1.63796, t: ['Parc Fluvial de l’Anoia', 'Parc Fluvial del Anoia'], d: ['El tram més verd del recorregut, ideal per rodar suau el dissabte.', 'El tramo más verde del recorrido, ideal para rodar suave el sábado.'], c: 'p' },
  { lat: 41.57802, lon: 1.62442, t: ['Mercat de la Masuca', 'Mercado de la Masuca'], d: ['Producte de proximitat de l’Anoia. Dissabte al matí, tast per a corredors.', 'Producto de proximidad de la Anoia. Sábado por la mañana, degustación para corredores.'], c: 't' },
  { ...START, t: ['Parc Central · Fira del Corredor', 'Parc Central · Feria del Corredor'], d: ['Recollida de dorsals, sortida i meta.', 'Recogida de dorsales, salida y meta.'], c: 's' },
];
const EXPO = [{ ...START, t: ['Fira del Corredor · Parc Central', 'Feria del Corredor · Parc Central'], d: ['Dissabte 12, de 10:00 a 20:00 · carpa de dorsals, expositors i xerrades', 'Sábado 12, de 10:00 a 20:00 · carpa de dorsales, expositores y charlas'], c: 's' }, PARK[0], PARK[1], PARK[6]];
// Punts d'animació: sortida/meta + els tres avituallaments del pla operatiu (km reals del pla)
export const SPOTS = [
  { id: 'S', ...START, km: { '21k': 0.3, '10k': 0.3, cam: 0.3 }, t: ['Recta de sortida · Parc Central', 'Recta de salida · Parc Central'], d: ['Speaker, arc de sortida i les tres sortides en 45 minuts.', 'Speaker, arco de salida y las tres salidas en 45 minutos.'] },
  { id: 'A1', lat: aid.A1.lat, lon: aid.A1.lon, km: aid.A1.km, t: ['Punt Estadi · Av. de la Pietat', 'Punto Estadi · Av. de la Pietat'], d: ['Batucada i speaker del CAI. Veus passar les tres proves.', 'Batucada y speaker del CAI. Ves pasar las tres pruebas.'] },
  { id: 'A2', lat: aid.A2.lat, lon: aid.A2.lon, km: aid.A2.km, t: ['Punt del Rec · Ronda del Rec', 'Punto del Rec · Ronda del Rec'], d: ['Túnel d’ànims de les escoles i música en directe.', 'Túnel de ánimos de las escuelas y música en directo.'] },
  { id: 'A3', lat: aid.A3.lat, lon: aid.A3.lon, km: aid.A3.km, t: ['Punt Vilanova · Ctra. de Vilanova', 'Punto Vilanova · Ctra. de Vilanova'], d: ['Grallers i gegants de Vilanova del Camí.', 'Grallers y gegants de Vilanova del Camí.'] },
  { id: 'M', ...START, km: { '21k': 21.1, '10k': 10, cam: 6.1 }, t: ['Meta · Parc Central', 'Meta · Parc Central'], d: ['Grada, pantalla amb els noms i botifarrada solidària.', 'Grada, pantalla con los nombres y botifarrada solidaria.'] },
];

const P = (ca: string, es: string): T2 => [ca, es];
export interface Proto { slug: string; group: number; icon: string; title: T2; kicker: T2; lead: T2; blocks: any[] }

export const PROTO: Proto[] = [
  // ───────────────────────── Dia de la cursa (grup Logística) ─────────────────────────
  {
    slug: 'getting-there', group: 2, icon: 'M5 17h14M6 17l1.5-6h9L18 17M8 11V7h8v4M7 20v-3M17 20v-3',
    title: P('Com arribar i on aparcar', 'Cómo llegar y dónde aparcar'), kicker: P('Dia de la cursa', 'Día de la carrera'),
    lead: P('La sortida és al Parc Central. Els carrers del voltant es tallen a les 08:10: arriba abans de les 07:45 o deixa el cotxe als aparcaments dissuasius i puja al bus llançadora.', 'La salida está en el Parc Central. Las calles de alrededor se cortan a las 08:10: llega antes de las 07:45 o deja el coche en los aparcamientos disuasorios y sube al bus lanzadera.'),
    blocks: [
      { k: 'stats', items: [['681', P('places d’aparcament gratuït a menys de 15 min', 'plazas de aparcamiento gratuito a menos de 15 min')], ['07:45', P('hora límit recomanada per arribar en cotxe', 'hora límite recomendada para llegar en coche')], ['10 min', P('freqüència del bus llançadora', 'frecuencia del bus lanzadera')], ['0 €', P('bus llançadora amb el dorsal', 'bus lanzadera con el dorsal')]] },
      { k: 'map', title: P('Aparcaments i transport públic', 'Aparcamientos y transporte público'), note: P('Aparcaments reals (font: OpenStreetMap). Llançadores i tarifes: proposta per validar amb l’Ajuntament.', 'Aparcamientos reales (fuente: OpenStreetMap). Lanzaderas y tarifas: propuesta por validar con el Ayuntamiento.'), points: PARK },
      { k: 'cards', title: P('Tria com vens', 'Elige cómo vienes'), cols: 3, items: [
        { t: P('En cotxe', 'En coche'), d: P('A-2, sortides 555 i 557. Segueix els cartells «P Cursa». Des de la sortida 557 no travesses cap carrer tallat.', 'A-2, salidas 555 y 557. Sigue los carteles «P Carrera». Desde la salida 557 no atraviesas ninguna calle cortada.') },
        { t: P('En autobús', 'En autobús'), d: P('Hispano Igualadina des de Barcelona (Sants i Maria Cristina). Servei especial amb sortida a les 06:15 i tornada a les 13:30.', 'Hispano Igualadina desde Barcelona (Sants y Maria Cristina). Servicio especial con salida a las 06:15 y vuelta a las 13:30.') },
        { t: P('En tren', 'En tren'), d: P('FGC línia R6 des de Barcelona-Pl. Espanya. El primer tren del diumenge arriba a les 07:38; 15 minuts a peu fins a la sortida.', 'FGC línea R6 desde Barcelona-Pl. Espanya. El primer tren del domingo llega a las 07:38; 15 minutos a pie hasta la salida.') },
        { t: P('En bicicleta', 'En bicicleta'), d: P('Aparcabicis vigilat de 300 places al costat del guarda-roba. Porta el teu cadenat.', 'Aparcabicis vigilado de 300 plazas junto al guardarropa. Trae tu candado.') },
        { t: P('Cotxe compartit', 'Coche compartido'), d: P('Tauler per trobar o oferir seient des de la teva població. Tres o més dorsals al cotxe: plaça reservada al P1.', 'Tablón para encontrar u ofrecer asiento desde tu población. Tres o más dorsales en el coche: plaza reservada en el P1.'), tag: P('Idea', 'Idea') },
        { t: P('Mobilitat reduïda', 'Movilidad reducida'), d: P('20 places reservades a 80 m de la sortida amb acreditació. Sol·licita-la fins al 6 de desembre.', '20 plazas reservadas a 80 m de la salida con acreditación. Solicítala hasta el 6 de diciembre.') },
      ] },
      { k: 'table', title: P('Bus llançadora', 'Bus lanzadera'), cols: [P('Línia', 'Línea'), P('Recorregut', 'Recorrido'), P('Anada', 'Ida'), P('Tornada', 'Vuelta')], rows: [
        ['L1', P('P3 Hospital → P4 Comarca → Sortida', 'P3 Hospital → P4 Comarca → Salida'), '07:00–08:20', '10:30–13:30'],
        ['L2', P('Estació d’autobusos / FGC → Sortida', 'Estación de autobuses / FGC → Salida'), '07:15–08:15', '10:30–13:45'],
        ['L3', P('Vilanova del Camí (Ajuntament) → Sortida', 'Vilanova del Camí (Ayuntamiento) → Salida'), '07:10–08:10', '11:00–13:30'],
      ] },
      { k: 'faq', title: P('Dubtes habituals', 'Dudas habituales'), items: [
        [P('Puc sortir del P5 La Masuca durant la cursa?', '¿Puedo salir del P5 La Masuca durante la carrera?'), P('No fins a les 11:40. Si has de marxar abans, aparca al P1, P2, P3 o P4.', 'No hasta las 11:40. Si tienes que irte antes, aparca en el P1, P2, P3 o P4.')],
        [P('On em poden deixar en cotxe?', '¿Dónde me pueden dejar en coche?'), P('Zona «petó i adeu» a la rotonda de l’Av. de Balmes, oberta fins a les 08:00.', 'Zona «beso y adiós» en la rotonda de la Av. de Balmes, abierta hasta las 08:00.')],
        [P('Hi ha autocaravanes?', '¿Hay autocaravanas?'), P('Àrea habilitada al P4 Comarca des de divendres a la tarda, sense serveis.', 'Área habilitada en el P4 Comarca desde el viernes por la tarde, sin servicios.')],
      ] },
    ],
  },
  {
    slug: 'bib-pickup', group: 2, icon: 'M5 4h14v16H5zM9 9h6M9 13h6M8 4v3M16 4v3',
    title: P('Recollida de dorsals i Fira del Corredor', 'Recogida de dorsales y Feria del Corredor'), kicker: P('Dia de la cursa', 'Día de la carrera'),
    lead: P('Dissabte 12 de desembre, de 10:00 a 20:00, al Parc Central. Vine amb el codi QR de la inscripció i emporta’t el dorsal, el xip, la samarreta i la bossa.', 'Sábado 12 de diciembre, de 10:00 a 20:00, en el Parc Central. Ven con el código QR de la inscripción y llévate el dorsal, el chip, la camiseta y la bolsa.'),
    blocks: [
      { k: 'stats', items: [['10–20 h', P('dissabte 12 de desembre', 'sábado 12 de diciembre')], ['06:45', P('obertura excepcional diumenge', 'apertura excepcional el domingo')], ['45 min', P('abans de cada sortida tanca la recollida', 'antes de cada salida cierra la recogida')], ['24', P('expositors a la fira', 'expositores en la feria')]] },
      { k: 'steps', title: P('Com funciona, en quatre passos', 'Cómo funciona, en cuatro pasos'), items: [
        ['1', P('Ensenya el QR', 'Enseña el QR'), P('El trobaràs al correu de confirmació i a «La meva inscripció». Amb el DNI també et trobem.', 'Lo encontrarás en el correo de confirmación y en «Mi inscripción». Con el DNI también te encontramos.')],
        ['2', P('Recull el sobre', 'Recoge el sobre'), P('Dorsal amb el xip enganxat, quatre imperdibles i l’adhesiu del guarda-roba. Comprova nom i calaix.', 'Dorsal con el chip pegado, cuatro imperdibles y el adhesivo del guardarropa. Comprueba nombre y cajón.')],
        ['3', P('Samarreta i bossa', 'Camiseta y bolsa'), P('Emprovador per si vols canviar de talla; els canvis es fan mentre hi hagi estoc.', 'Probador por si quieres cambiar de talla; los cambios se hacen mientras haya stock.')],
        ['4', P('Passa per la fira', 'Pasa por la feria'), P('Marques, clubs de l’Anoia, fisioteràpia i el mur per signar abans de córrer.', 'Marcas, clubes de la Anoia, fisioterapia y el muro para firmar antes de correr.')],
      ] },
      { k: 'map', title: P('On és', 'Dónde está'), points: EXPO },
      { k: 'check', id: 'bib', title: P('Què has de portar', 'Qué tienes que traer'), items: [P('Codi QR o DNI', 'Código QR o DNI'), P('Autorització signada si reculls el dorsal d’algú altre (i còpia del seu DNI)', 'Autorización firmada si recoges el dorsal de otra persona (y copia de su DNI)'), P('Annex de menors signat pel pare, mare o tutor', 'Anexo de menores firmado por el padre, madre o tutor'), P('Llicència federativa si t’hi has inscrit com a federat', 'Licencia federativa si te has inscrito como federado'), P('Got o ampolla pròpia: a la fira no hi ha gots d’un sol ús', 'Vaso o botella propia: en la feria no hay vasos de un solo uso')] },
      { k: 'table', title: P('Programa de la fira', 'Programa de la feria'), cols: [P('Hora', 'Hora'), P('Activitat', 'Actividad'), P('Espai', 'Espacio')], rows: [
        ['10:00', P('Obertura i recollida de dorsals', 'Apertura y recogida de dorsales'), P('Carpa 1', 'Carpa 1')],
        ['11:00', P('Rodatge suau de 4 km amb les llebres', 'Rodaje suave de 4 km con las liebres'), P('Arc de sortida', 'Arco de salida')],
        ['12:30', P('Xerrada: «Com córrer la teva primera mitja»', 'Charla: «Cómo correr tu primera media»'), P('Escenari', 'Escenario')],
        ['17:00', P('Mini Mitja: curses infantils', 'Mini Mitja: carreras infantiles'), P('Parc Central', 'Parc Central')],
        ['18:30', P('Presentació del recorregut, metre a metre', 'Presentación del recorrido, metro a metro'), P('Escenari', 'Escenario')],
        ['19:00', P('Sopar de pasta solidari (8 €)', 'Cena de pasta solidaria (8 €)'), P('Carpa 2', 'Carpa 2')],
      ] },
      { k: 'faq', title: P('Preguntes', 'Preguntas'), items: [
        [P('No puc venir dissabte. Què faig?', 'No puedo ir el sábado. ¿Qué hago?'), P('Diumenge obrim de 06:45 fins a 45 minuts abans de la teva sortida, només per a qui ve de fora de l’Anoia. O autoritza algú.', 'El domingo abrimos de 06:45 hasta 45 minutos antes de tu salida, solo para quien viene de fuera de la Anoia. O autoriza a alguien.')],
        [P('Puc canviar la talla de la samarreta?', '¿Puedo cambiar la talla de la camiseta?'), P('Sí, a partir de les 18:00 de dissabte i segons estoc.', 'Sí, a partir de las 18:00 del sábado y según stock.')],
      ] },
    ],
  },
  {
    slug: 'runner-guide', group: 2, icon: 'M13 4a2 2 0 1 0 0 .01M6 21l3-6 3 2 1 4M9 11l3-3 3 3 3 1M7 13l2-2',
    title: P('Guia del corredor', 'Guía del corredor'), kicker: P('Dia de la cursa', 'Día de la carrera'),
    lead: P('Tot el que passa des que et lleves fins que et pengen la medalla: calaixos, guarda-roba, llebres, lavabos i què fer si alguna cosa no va bé.', 'Todo lo que pasa desde que te levantas hasta que te cuelgan la medalla: cajones, guardarropa, liebres, baños y qué hacer si algo no va bien.'),
    blocks: [
      { k: 'steps', title: P('El teu matí', 'Tu mañana'), items: [
        ['06:45', P('Obre la zona de sortida', 'Abre la zona de salida'), P('Guarda-roba, lavabos i punt d’informació al Parc Central.', 'Guardarropa, baños y punto de información en el Parc Central.')],
        ['07:45', P('Límit per arribar en cotxe', 'Límite para llegar en coche'), P('A partir de les 08:10 els carrers de la sortida queden tallats.', 'A partir de las 08:10 las calles de la salida quedan cortadas.')],
        ['08:00', P('Escalfament dirigit', 'Calentamiento dirigido'), P('Deu minuts amb música davant de l’arc.', 'Diez minutos con música delante del arco.')],
        ['08:15', P('Tanca el guarda-roba de la 21K', 'Cierra el guardarropa de la 21K'), P('La 10K, a les 08:45; la Caminada, a les 09:00.', 'La 10K, a las 08:45; la Caminada, a las 09:00.')],
        ['08:20', P('Entra al teu calaix', 'Entra en tu cajón'), P('El color del dorsal indica per on entres. Pots endarrerir-te de calaix, mai avançar-te.', 'El color del dorsal indica por dónde entras. Puedes retrasarte de cajón, nunca adelantarte.')],
        ['08:30', P('Sortida de la Mitja', 'Salida de la Media'), P('10K a les 09:00 i Caminada a les 09:15.', '10K a las 09:00 y Caminada a las 09:15.')],
      ] },
      { k: 'table', title: P('Calaixos de sortida', 'Cajones de salida'), lead: P('S’assignen pel temps que declares en inscriure’t. Canvis fins al 6 de desembre.', 'Se asignan por el tiempo que declaras al inscribirte. Cambios hasta el 6 de diciembre.'), cols: [P('Calaix', 'Cajón'), '21K', '10K', P('Entrada', 'Entrada')], rows: [
        [P('● Vermell', '● Rojo'), P('menys d’1 h 30', 'menos de 1 h 30'), P('menys de 40 min', 'menos de 40 min'), P('Porta A', 'Puerta A')],
        [P('● Blau', '● Azul'), '1 h 30 – 1 h 45', '40–48 min', P('Porta A', 'Puerta A')],
        [P('● Verd', '● Verde'), '1 h 45 – 2 h 00', '48–55 min', P('Porta B', 'Puerta B')],
        [P('● Groc', '● Amarillo'), '2 h 00 – 2 h 20', '55–65 min', P('Porta B', 'Puerta B')],
        [P('● Blanc', '● Blanco'), P('més de 2 h 20', 'más de 2 h 20'), P('més de 65 min', 'más de 65 min'), P('Porta C', 'Puerta C')],
      ] },
      { k: 'table', title: P('Llebres', 'Liebres'), lead: P('Porten globus i samarreta taronja amb el temps a l’esquena. Ritme constant, sense estirades.', 'Llevan globo y camiseta naranja con el tiempo en la espalda. Ritmo constante, sin tirones.'), cols: [P('Objectiu', 'Objetivo'), P('Ritme', 'Ritmo'), P('Calaix', 'Cajón'), P('Club', 'Club')], rows: [
        ['21K · 1 h 30', '4:16 /km', P('Vermell', 'Rojo'), 'Club Atlètic Igualada'], ['21K · 1 h 45', '4:59 /km', P('Blau', 'Azul'), 'Club Atlètic Igualada'], ['21K · 2 h 00', '5:41 /km', P('Verd', 'Verde'), P('Corredors de l’Anoia', 'Corredors de l’Anoia')], ['21K · 2 h 15', '6:24 /km', P('Groc', 'Amarillo'), P('Corredors de l’Anoia', 'Corredors de l’Anoia')],
        ['10K · 45 min', '4:30 /km', P('Blau', 'Azul'), 'UdL Running'], ['10K · 55 min', '5:30 /km', P('Verd', 'Verde'), 'UdL Running'], ['10K · 65 min', '6:30 /km', P('Groc', 'Amarillo'), 'UdL Running'],
      ] },
      { k: 'cards', title: P('Serveis a la sortida i a meta', 'Servicios en la salida y en meta'), cols: 3, items: [
        { t: P('Guarda-roba', 'Guardarropa'), d: P('Bossa de fins a 40 × 30 cm amb l’adhesiu del teu dorsal. No hi deixis objectes de valor.', 'Bolsa de hasta 40 × 30 cm con el adhesivo de tu dorsal. No dejes objetos de valor.') },
        { t: P('Lavabos', 'Baños'), d: P('40 cabines a la sortida, 6 adaptades, i dues a cada avituallament. Menys cua a la banda del Parc Central.', '40 cabinas en la salida, 6 adaptadas, y dos en cada avituallamiento. Menos cola en el lado del Parc Central.') },
        { t: P('Dutxes i vestidors', 'Duchas y vestuarios'), d: P('Al pavelló, a 300 m de meta, de 09:45 a 13:30. Porta tovallola.', 'En el pabellón, a 300 m de meta, de 09:45 a 13:30. Trae toalla.') },
        { t: P('Fisioteràpia', 'Fisioterapia'), d: P('Carpa de recuperació amb estudiants de l’UdL: 10 minuts per corredor.', 'Carpa de recuperación con estudiantes de la UdL: 10 minutos por corredor.') },
        { t: P('Medalla i gravat', 'Medalla y grabado'), d: P('Grava el teu temps a la medalla mentre esperes la botifarra: 3 € solidaris.', 'Graba tu tiempo en la medalla mientras esperas la butifarra: 3 € solidarios.'), tag: P('Idea', 'Idea') },
        { t: P('Punt de trobada', 'Punto de encuentro'), d: P('Lletres gegants A–Z a la gespa de meta: queda amb els teus a la inicial del teu cognom.', 'Letras gigantes A–Z en el césped de meta: queda con los tuyos en la inicial de tu apellido.'), tag: P('Idea', 'Idea') },
      ] },
      { k: 'check', id: 'kit', title: P('Prepara la bossa', 'Prepara la bolsa'), items: [P('Dorsal amb xip, posat al pit', 'Dorsal con chip, puesto en el pecho'), P('Sabatilles ja rodades (res d’estrenar)', 'Zapatillas ya rodadas (nada de estrenar)'), P('Roba d’abric per a abans i després: al desembre som a 3–8 °C', 'Ropa de abrigo para antes y después: en diciembre estamos a 3–8 °C'), P('Guants i buff per als primers quilòmetres', 'Guantes y buff para los primeros kilómetros'), P('Got plegable', 'Vaso plegable'), P('Vaselina o pegats', 'Vaselina o parches'), P('Telèfon d’emergència escrit al revers del dorsal', 'Teléfono de emergencia escrito en el reverso del dorsal')] },
      { k: 'note', title: P('Si et trobes malament', 'Si te encuentras mal'), items: [P('Para i avisa el voluntari més proper: tots porten ràdio i són a menys de 400 m.', 'Para y avisa al voluntario más cercano: todos llevan radio y están a menos de 400 m.'), P('Telèfon de cursa: imprès al dorsal. Emergències: 112.', 'Teléfono de carrera: impreso en el dorsal. Emergencias: 112.'), P('Si et retires, lliura el dorsal al control: el cotxe escombra et porta a meta.', 'Si te retiras, entrega el dorsal en el control: el coche escoba te lleva a meta.'), P('Omple la fitxa mèdica del revers del dorsal: al·lèrgies, medicació i contacte.', 'Rellena la ficha médica del reverso del dorsal: alergias, medicación y contacto.')] },
    ],
  },
  {
    slug: 'spectators', group: 2, icon: 'M3 11l4-1 11-5v14l-11-5-4-1zM7 14v5h3',
    title: P('Guia de l’espectador', 'Guía del espectador'), kicker: P('Dia de la cursa', 'Día de la carrera'),
    lead: P('Cinc punts per animar, tots a peu de recorregut i amb música. Digues-nos a quina hora vol arribar el teu corredor i et calculem quan passa per cada un.', 'Cinco puntos para animar, todos a pie de recorrido y con música. Dinos a qué hora quiere llegar tu corredor y te calculamos cuándo pasa por cada uno.'),
    blocks: [
      { k: 'spect' },
      { k: 'map', title: P('Punts d’animació', 'Puntos de animación'), points: SPOTS.map((s) => ({ lat: s.lat, lon: s.lon, t: s.t, d: s.d, c: s.id === 'M' || s.id === 'S' ? 's' : 't' })) },
      { k: 'cards', title: P('Anima com un professional', 'Anima como un profesional'), cols: 3, items: [
        { t: P('Crida el nom', 'Grita el nombre'), d: P('Tots els dorsals porten el nom ben gran. Un «Vinga, Laia!» val per dos gels.', 'Todos los dorsales llevan el nombre bien grande. Un «¡Vamos, Laia!» vale por dos geles.') },
        { t: P('Dos punts amb un passeig', 'Dos puntos con un paseo'), d: P('Del Punt del Rec a la meta hi ha 18 minuts a peu: veus el teu corredor al km 12 i arribes a temps a l’arribada.', 'Del Punto del Rec a la meta hay 18 minutos a pie: ves a tu corredor en el km 12 y llegas a tiempo a la llegada.') },
        { t: P('Concurs de pancartes', 'Concurso de pancartas'), d: P('Puja la foto amb #MMIgualada: la més votada guanya dos dorsals per al 2027.', 'Sube la foto con #MMIgualada: la más votada gana dos dorsales para 2027.'), tag: P('Idea', 'Idea') },
        { t: P('Esmorzar de forquilla', 'Desayuno de tenedor'), d: P('Bars del recorregut amb menú d’animador des de les 08:00. Busca l’adhesiu a la porta.', 'Bares del recorrido con menú de animador desde las 08:00. Busca la pegatina en la puerta.'), tag: P('Idea', 'Idea') },
        { t: P('No creuis davant dels corredors', 'No cruces delante de los corredores'), d: P('Fes-ho pels passos amb voluntari. Gossos, sempre lligats i lluny de la calçada.', 'Hazlo por los pasos con voluntario. Perros, siempre atados y lejos de la calzada.') },
        { t: P('Amb criatures', 'Con criaturas'), d: P('Zona infantil a meta amb inflables i tallers de 09:30 a 13:00.', 'Zona infantil en meta con hinchables y talleres de 09:30 a 13:00.') },
      ] },
    ],
  },
  {
    slug: 'live', group: 2, icon: 'M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M7 7a7 7 0 0 0 0 10M17 7a7 7 0 0 1 0 10M4 4a11 11 0 0 0 0 16M20 4a11 11 0 0 1 0 16',
    title: P('Seguiment en directe', 'Seguimiento en directo'), kicker: P('Dia de la cursa', 'Día de la carrera'),
    lead: P('Segueix qualsevol dorsal sobre el mapa, amb pas pels controls del km 5, 10, 15 i meta. Això és una demostració amb corredors ficticis.', 'Sigue cualquier dorsal sobre el mapa, con paso por los controles del km 5, 10, 15 y meta. Esto es una demostración con corredores ficticios.'),
    blocks: [
      { k: 'track' },
      { k: 'cards', title: P('Què tindràs el dia de la cursa', 'Qué tendrás el día de la carrera'), cols: 3, items: [
        { t: P('Avisos al mòbil', 'Avisos en el móvil'), d: P('Subscriu-te a un dorsal i rep un avís a cada control i a l’arribada. Sense instal·lar cap app.', 'Suscríbete a un dorsal y recibe un aviso en cada control y en la llegada. Sin instalar ninguna app.') },
        { t: P('Vídeo de la teva arribada', 'Vídeo de tu llegada'), d: P('Càmera a meta sincronitzada amb el xip: 20 segons amb el teu nom, a punt per compartir.', 'Cámara en meta sincronizada con el chip: 20 segundos con tu nombre, listos para compartir.'), tag: P('Idea', 'Idea') },
        { t: P('Classificació al moment', 'Clasificación al momento'), d: P('Temps oficial i real, posició per categoria i diploma descarregable en creuar la meta.', 'Tiempo oficial y real, posición por categoría y diploma descargable al cruzar la meta.') },
      ] },
    ],
  },
  // ───────────────────────── Inscripcions ─────────────────────────
  {
    slug: 'my-entry', group: 1, icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    title: P('La meva inscripció', 'Mi inscripción'), kicker: P('Inscripcions', 'Inscripciones'),
    lead: P('Consulta la teva inscripció, canvia de distància, cedeix el dorsal o demana la devolució. Tot en línia fins al 6 de desembre.', 'Consulta tu inscripción, cambia de distancia, cede el dorsal o pide la devolución. Todo en línea hasta el 6 de diciembre.'),
    blocks: [
      { k: 'lookup' },
      { k: 'table', title: P('Què pots canviar i fins quan', 'Qué puedes cambiar y hasta cuándo'), cols: [P('Tràmit', 'Trámite'), P('Fins al', 'Hasta el'), P('Cost', 'Coste')], rows: [
        [P('Dades personals, talla o temps previst', 'Datos personales, talla o tiempo previsto'), P('6 de desembre', '6 de diciembre'), P('Gratuït', 'Gratuito')],
        [P('Canvi de distància (si queden places)', 'Cambio de distancia (si quedan plazas)'), P('30 de novembre', '30 de noviembre'), P('La diferència de preu', 'La diferencia de precio')],
        [P('Cessió del dorsal a una altra persona', 'Cesión del dorsal a otra persona'), P('6 de desembre', '6 de diciembre'), '3 €'],
        [P('Devolució del 80 %', 'Devolución del 80 %'), P('15 de novembre', '15 de noviembre'), P('20 % de gestió', '20 % de gestión')],
        [P('Devolució del 50 % amb justificant mèdic', 'Devolución del 50 % con justificante médico'), P('6 de desembre', '6 de diciembre'), '—'],
        [P('Guardar la plaça per al 2027', 'Guardar la plaza para 2027'), P('6 de desembre', '6 de diciembre'), '5 €'],
      ], note: P('Terminis i imports proposats: cal contrastar-los amb l’article de cancel·lacions del reglament abans de publicar.', 'Plazos e importes propuestos: hay que contrastarlos con el artículo de cancelaciones del reglamento antes de publicar.') },
      { k: 'startlist' },
      { k: 'faq', title: P('Preguntes', 'Preguntas'), items: [
        [P('Puc córrer amb el dorsal d’algú altre?', '¿Puedo correr con el dorsal de otra persona?'), P('No. L’assegurança és nominal: fes la cessió en línia i el dorsal sortirà amb el teu nom.', 'No. El seguro es nominal: haz la cesión en línea y el dorsal saldrá con tu nombre.')],
        [P('No he rebut el correu de confirmació', '¿No he recibido el correo de confirmación?'), P('Mira el correu brossa i cerca’t a la llista d’inscrits. Si hi ets, tot és correcte.', 'Mira el correo no deseado y búscate en la lista de inscritos. Si estás, todo es correcto.')],
      ] },
    ],
  },
  {
    slug: 'training', group: 1, icon: 'M4 18l5-6 4 3 7-9M15 6h5v5',
    title: P('Entrenament', 'Entrenamiento'), kicker: P('Inscripcions', 'Inscripciones'),
    lead: P('Plans de vuit setmanes per arribar al 13 de desembre, calculadora de ritmes i sortides en grup pel recorregut cada diumenge.', 'Planes de ocho semanas para llegar al 13 de diciembre, calculadora de ritmos y salidas en grupo por el recorrido cada domingo.'),
    blocks: [
      { k: 'pace' },
      { k: 'plan' },
      { k: 'table', title: P('Entrenaments oficials pel recorregut', 'Entrenamientos oficiales por el recorrido'), lead: P('Gratuïts, amb llebres i avituallament. Sortida a les 09:00 del Parc Central.', 'Gratuitos, con liebres y avituallamiento. Salida a las 09:00 del Parc Central.'), cols: [P('Data', 'Fecha'), P('Sessió', 'Sesión'), P('Distància', 'Distancia'), P('Amb', 'Con')], rows: [
        [P('Dg. 25 oct', 'Dom. 25 oct'), P('Primer bucle: del Parc Central al Pla de la Massa', 'Primer bucle: del Parc Central al Pla de la Massa'), '8 km', 'Club Atlètic Igualada'],
        [P('Dg. 8 nov', 'Dom. 8 nov'), P('El Rec i el Parc Fluvial', 'El Rec y el Parc Fluvial'), '12 km', P('Corredors de l’Anoia', 'Corredors de l’Anoia')],
        [P('Dg. 22 nov', 'Dom. 22 nov'), P('Tirada llarga: fins a Vilanova i tornada', 'Tirada larga: hasta Vilanova y vuelta'), '16 km', 'Club Atlètic Igualada'],
        [P('Dg. 29 nov', 'Dom. 29 nov'), P('Els últims 5 km a ritme de cursa', 'Los últimos 5 km a ritmo de carrera'), '10 km', 'UdL Running'],
        [P('Ds. 12 des', 'Sáb. 12 dic'), P('Rodatge de la fira amb les llebres', 'Rodaje de la feria con las liebres'), '4 km', P('Tothom', 'Todo el mundo')],
      ] },
      { k: 'cards', title: P('Tres consells per a una mitja al desembre', 'Tres consejos para una media en diciembre'), cols: 3, items: [
        { t: P('Surt abrigat, corre lleuger', 'Sal abrigado, corre ligero'), d: P('Una samarreta vella per llençar al km 1: les recollim i les donem a Càritas.', 'Una camiseta vieja para tirar en el km 1: las recogemos y las donamos a Cáritas.') },
        { t: P('El km 12 enganya', 'El km 12 engaña'), d: P('Després del Rec ve el tram més planer i és fàcil accelerar. Guarda-ho per a Vilanova.', 'Después del Rec viene el tramo más llano y es fácil acelerar. Guárdalo para Vilanova.') },
        { t: P('Assaja l’avituallament', 'Ensaya el avituallamiento'), d: P('Beure d’un got corrent té tècnica: doblega la vora i fes glops curts.', 'Beber de un vaso corriendo tiene técnica: dobla el borde y da tragos cortos.') },
      ] },
    ],
  },
  {
    slug: 'teams', group: 1, icon: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20a6 6 0 0 1 12 0M12 20a6 6 0 0 1 10 0',
    title: P('Empreses i equips', 'Empresas y equipos'), kicker: P('Inscripcions', 'Inscripciones'),
    lead: P('Porta la teva empresa, el teu club o la colla. A partir de cinc dorsals hi ha descompte, classificació pròpia i carpa a meta.', 'Trae a tu empresa, tu club o la peña. A partir de cinco dorsales hay descuento, clasificación propia y carpa en meta.'),
    blocks: [
      { k: 'team' },
      { k: 'cards', title: P('Tres paquets', 'Tres paquetes'), cols: 3, items: [
        { t: P('Colla · 5 a 9', 'Peña · 5 a 9'), d: P('10 % de descompte, recollida conjunta de dorsals i nom de l’equip al dorsal.', '10 % de descuento, recogida conjunta de dorsales y nombre del equipo en el dorsal.') },
        { t: P('Equip · 10 a 24', 'Equipo · 10 a 24'), d: P('15 % de descompte, foto oficial d’equip a l’arc i taula reservada a la botifarrada.', '15 % de descuento, foto oficial de equipo en el arco y mesa reservada en la botifarrada.') },
        { t: P('Empresa · 25 o més', 'Empresa · 25 o más'), d: P('20 % de descompte, carpa pròpia a meta, logotip a la web i sessió d’entrenament a l’empresa.', '20 % de descuento, carpa propia en meta, logotipo en la web y sesión de entrenamiento en la empresa.') },
      ] },
      { k: 'table', title: P('Repte Empreses de l’Anoia', 'Reto Empresas de la Anoia'), lead: P('Guanya l’empresa amb més quilòmetres sumats per treballador. Classificació d’exemple.', 'Gana la empresa con más kilómetros sumados por trabajador. Clasificación de ejemplo.'), cols: ['#', P('Empresa', 'Empresa'), P('Dorsals', 'Dorsales'), P('km / plantilla', 'km / plantilla')], rows: [['1', 'Anoia Sport', '34', '8,4'], ['2', 'Volt Anoia', '21', '6,9'], ['3', 'Clínica Fisio+', '12', '6,1'], ['4', 'Vinyes del Camí', '18', '4,7'], ['5', 'Llibreria Nova', '6', '4,2']], note: P('Empreses fictícies del prototip.', 'Empresas ficticias del prototipo.') },
      { k: 'form', title: P('Demana el teu codi d’equip', 'Pide tu código de equipo'), fields: [[P('Nom de l’equip o empresa', 'Nombre del equipo o empresa'), 'text'], [P('Persona de contacte', 'Persona de contacto'), 'text'], [P('Correu electrònic', 'Correo electrónico'), 'email'], [P('Dorsals previstos', 'Dorsales previstos'), 'number']], submit: P('Envia la sol·licitud', 'Enviar la solicitud'), ok: P('Rebut. T’enviarem el codi d’equip en menys de 48 hores.', 'Recibido. Te enviaremos el código de equipo en menos de 48 horas.') },
    ],
  },
  // ───────────────────────── La cursa ─────────────────────────
  {
    slug: 'prizes', group: 0, icon: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8',
    title: P('Premis i categories', 'Premios y categorías'), kicker: P('La cursa', 'La carrera'),
    lead: P('Trofeu per als tres primers absoluts i per al primer de cada categoria, reconeixement als primers locals i a l’esport adaptat. Sense premis en metàl·lic: aquí es corre per la medalla.', 'Trofeo para los tres primeros absolutos y para el primero de cada categoría, reconocimiento a los primeros locales y al deporte adaptado. Sin premios en metálico: aquí se corre por la medalla.'),
    blocks: [
      { k: 'stats', items: [['36', P('trofeus en joc', 'trofeos en juego')], ['4', P('categories per edat', 'categorías por edad')], ['12:15', P('lliurament de premis', 'entrega de premios')], ['100 %', P('finishers amb medalla', 'finishers con medalla')]] },
      { k: 'table', title: P('Categories (21K i 10K)', 'Categorías (21K y 10K)'), lead: P('Masculina i femenina. Compta l’edat el dia de la prova.', 'Masculina y femenina. Cuenta la edad el día de la prueba.'), cols: [P('Categoria', 'Categoría'), P('Edat', 'Edad'), P('Trofeu', 'Trofeo')], rows: [
        [P('Absoluta', 'Absoluta'), P('Totes', 'Todas'), P('1r, 2n i 3r', '1.º, 2.º y 3.º')], ['Sènior', P('fins a 34 anys', 'hasta 34 años'), P('1r', '1.º')], ['Màster 35', '35–44', P('1r', '1.º')], ['Màster 45', '45–54', P('1r', '1.º')], ['Màster 55+', P('55 o més', '55 o más'), P('1r', '1.º')],
        [P('Local (Igualada i Vilanova del Camí)', 'Local (Igualada y Vilanova del Camí)'), P('Totes', 'Todas'), P('1r i 1a', '1.º y 1.ª')], [P('Esport adaptat', 'Deporte adaptado'), P('Totes', 'Todas'), P('1r i 1a de cada modalitat', '1.º y 1.ª de cada modalidad')],
      ], note: P('Categories i trofeus segons el reglament; les franges d’edat són una proposta. Els premis no són acumulables.', 'Categorías y trofeos según el reglamento; las franjas de edad son una propuesta. Los premios no son acumulables.') },
      { k: 'cards', title: P('Premis especials', 'Premios especiales'), lead: P('Propostes per fer la cerimònia més nostra.', 'Propuestas para hacer la ceremonia más nuestra.'), cols: 3, items: [
        { t: P('Trofeu de pell d’Igualada', 'Trofeo de piel de Igualada'), d: P('Fets a mà per artesans del Rec amb pell adobada a la ciutat. Cada un és diferent.', 'Hechos a mano por artesanos del Rec con piel curtida en la ciudad. Cada uno es diferente.'), tag: P('Idea', 'Idea') },
        { t: P('Club més nombrós', 'Club más numeroso'), d: P('Un pernil i la foto a l’escenari per al club amb més arribats a meta.', 'Un jamón y la foto en el escenario para el club con más llegados a meta.'), tag: P('Idea', 'Idea') },
        { t: P('Veterà i veterana d’honor', 'Veterano y veterana de honor'), d: P('Reconeixement a la persona de més edat que acaba cada distància.', 'Reconocimiento a la persona de más edad que acaba cada distancia.'), tag: P('Idea', 'Idea') },
        { t: P('Fanalet vermell', 'Farolillo rojo'), d: P('L’últim finisher creua la meta amb tota la grada dreta i s’endú el seu pes en botifarra.', 'El último finisher cruza la meta con toda la grada en pie y se lleva su peso en butifarra.'), tag: P('Idea', 'Idea') },
        { t: P('Primera mitja', 'Primera media'), d: P('Sorteig de deu dorsals per al 2027 entre qui debuta en la distància.', 'Sorteo de diez dorsales para 2027 entre quien debuta en la distancia.'), tag: P('Idea', 'Idea') },
        { t: P('Millor disfressa', 'Mejor disfraz'), d: P('A la Caminada: lot de productes de l’Anoia per a la colla més original.', 'En la Caminada: lote de productos de la Anoia para la peña más original.'), tag: P('Idea', 'Idea') },
      ] },
      { k: 'note', title: P('Reclamacions', 'Reclamaciones'), items: [P('Classificacions provisionals a la web en creuar la meta; definitives a les 14:00.', 'Clasificaciones provisionales en la web al cruzar la meta; definitivas a las 14:00.'), P('Reclamacions per escrit al jutge àrbitre fins a 30 minuts després de publicar-se els resultats.', 'Reclamaciones por escrito al juez árbitro hasta 30 minutos después de publicarse los resultados.'), P('Els trofeus no recollits a la cerimònia es guarden a l’Ajuntament durant un mes.', 'Los trofeos no recogidos en la ceremonia se guardan en el Ayuntamiento durante un mes.')] },
    ],
  },
  {
    slug: 'accessibility', group: 0, icon: 'M12 5a1.5 1.5 0 1 0 0-.01M7 9h10M12 9v6M9 21l3-6 3 6M5 14a7 7 0 0 0 14 0',
    title: P('Accessibilitat', 'Accesibilidad'), kicker: P('La cursa', 'La carrera'),
    lead: P('Una cursa on hi cap tothom: cadira de rodes, corredors amb guia, intèrpret de llengua de signes a l’escenari i una sortida tranquil·la per a qui la necessiti.', 'Una carrera donde cabe todo el mundo: silla de ruedas, corredores con guía, intérprete de lengua de signos en el escenario y una salida tranquila para quien la necesite.'),
    blocks: [
      { k: 'cards', title: P('Com pots participar', 'Cómo puedes participar'), cols: 2, items: [
        { t: P('Cadira de rodes', 'Silla de ruedas'), d: P('Sortida a les 08:25, cinc minuts abans de la 21K, amb bicicleta d’obertura. El recorregut és 100 % asfaltat tret d’1,2 km de terra compactada al Parc Fluvial, amb alternativa senyalitzada.', 'Salida a las 08:25, cinco minutos antes de la 21K, con bicicleta de apertura. El recorrido es 100 % asfaltado salvo 1,2 km de tierra compactada en el Parc Fluvial, con alternativa señalizada.') },
        { t: P('Corredors amb guia', 'Corredores con guía'), d: P('El guia no paga inscripció i porta peto identificatiu. Si no en tens, t’aparellem amb un voluntari del teu ritme.', 'El guía no paga inscripción y lleva peto identificativo. Si no tienes, te emparejamos con un voluntario de tu ritmo.') },
        { t: P('Joëlette i cadires empeses', 'Joëlette y sillas empujadas'), d: P('Equips de fins a quatre persones a la 10K i la Caminada. Tenim dues joëlettes de préstec.', 'Equipos de hasta cuatro personas en la 10K y la Caminada. Tenemos dos joëlettes de préstamo.') },
        { t: P('Sortida tranquil·la', 'Salida tranquila'), d: P('Calaix sense música ni megafonia a 100 m de l’arc, per a persones amb hipersensibilitat sensorial.', 'Cajón sin música ni megafonía a 100 m del arco, para personas con hipersensibilidad sensorial.'), tag: P('Idea', 'Idea') },
      ] },
      { k: 'table', title: P('Serveis accessibles', 'Servicios accesibles'), cols: [P('Servei', 'Servicio'), P('On', 'Dónde'), P('Detall', 'Detalle')], rows: [
        [P('Aparcament reservat', 'Aparcamiento reservado'), P('A 80 m de la sortida', 'A 80 m de la salida'), P('20 places amb acreditació', '20 plazas con acreditación')],
        [P('Lavabos adaptats', 'Baños adaptados'), P('Sortida, meta i els tres avituallaments', 'Salida, meta y los tres avituallamientos'), P('6 + 3 cabines', '6 + 3 cabinas')],
        [P('Llengua de signes', 'Lengua de signos'), P('Escenari i lliurament de premis', 'Escenario y entrega de premios'), P('Intèrpret de LSC', 'Intérprete de LSC')],
        [P('Avituallament a alçada baixa', 'Avituallamiento a altura baja'), P('Una taula a cada punt', 'Una mesa en cada punto'), P('Senyalitzada en blau', 'Señalizada en azul')],
        [P('Web i reglament en lectura fàcil', 'Web y reglamento en lectura fácil'), P('En línia', 'En línea'), P('PDF i àudio', 'PDF y audio')],
        [P('Grada reservada a meta', 'Grada reservada en meta'), P('Darrers 50 m', 'Últimos 50 m'), P('Per a acompanyants amb mobilitat reduïda', 'Para acompañantes con movilidad reducida')],
      ] },
      { k: 'form', title: P('Explica’ns què necessites', 'Cuéntanos qué necesitas'), lead: P('Et respon una persona de l’equip, no un formulari automàtic.', 'Te responde una persona del equipo, no un formulario automático.'), fields: [[P('Nom i cognoms', 'Nombre y apellidos'), 'text'], [P('Correu electrònic', 'Correo electrónico'), 'email'], [P('Modalitat', 'Modalidad'), 'select', ['21K', '10K', 'Caminada']], [P('Què necessites?', '¿Qué necesitas?'), 'textarea']], submit: P('Envia', 'Enviar'), ok: P('Gràcies. Et contactarem en tres dies feiners.', 'Gracias. Te contactaremos en tres días laborables.') },
    ],
  },
  {
    slug: 'kids', group: 0, icon: 'M12 6a2 2 0 1 0 0-.01M8 21l1-7-3-3 4-2h4l4 2-3 3 1 7M10 14h4',
    title: P('Mini Mitja', 'Mini Mitja'), kicker: P('La cursa', 'La carrera'),
    lead: P('Les curses infantils del dissabte a la tarda al Parc Central. De 0 a 13 anys, sense cronòmetre, amb dorsal, medalla i berenar per a tothom.', 'Las carreras infantiles del sábado por la tarde en el Parc Central. De 0 a 13 años, sin cronómetro, con dorsal, medalla y merienda para todos.'),
    blocks: [
      { k: 'stats', items: [['17:00', P('dissabte 12 de desembre', 'sábado 12 de diciembre')], ['0–13', P('anys', 'años')], ['2 €', P('íntegres per a la causa solidària', 'íntegros para la causa solidaria')], ['400', P('places', 'plazas')]] },
      { k: 'table', title: P('Distàncies per edat', 'Distancias por edad'), cols: [P('Cursa', 'Carrera'), P('Edat', 'Edad'), P('Distància', 'Distancia'), P('Hora', 'Hora')], rows: [
        [P('Gatejadors', 'Gateadores'), P('0–3 anys, amb un adult', '0–3 años, con un adulto'), '50 m', '17:00'], [P('Esquirols', 'Ardillas'), '4–5', '200 m', '17:10'], [P('Llebres', 'Liebres'), '6–8', '500 m', '17:25'], [P('Guineus', 'Zorros'), '9–11', '1.000 m', '17:40'], [P('Falcons', 'Halcones'), '12–13', '1.500 m', '18:00'],
      ] },
      { k: 'cards', title: P('Per què els agradarà', 'Por qué les gustará'), cols: 3, items: [
        { t: P('La mateixa meta que els grans', 'La misma meta que los mayores'), d: P('Creuen l’arc oficial amb speaker i el seu nom a la pantalla.', 'Cruzan el arco oficial con speaker y su nombre en la pantalla.') },
        { t: P('Dorsal per pintar', 'Dorsal para pintar'), d: P('El dorsal arriba en blanc: taller de retoladors abans de la sortida.', 'El dorsal llega en blanco: taller de rotuladores antes de la salida.'), tag: P('Idea', 'Idea') },
        { t: P('Mascota de la cursa', 'Mascota de la carrera'), d: P('La Tisoreta, inspirada en les tisores de Cal Font, corre l’última volta amb ells.', 'La Tisoreta, inspirada en las tijeras de Cal Font, corre la última vuelta con ellos.'), tag: P('Idea', 'Idea') },
      ] },
      { k: 'form', title: P('Inscriu-los', 'Inscríbelos'), fields: [[P('Nom del nen o nena', 'Nombre del niño o niña'), 'text'], [P('Any de naixement', 'Año de nacimiento'), 'number'], [P('Nom del pare, mare o tutor', 'Nombre del padre, madre o tutor'), 'text'], [P('Correu electrònic', 'Correo electrónico'), 'email']], submit: P('Reserva el dorsal', 'Reservar el dorsal'), ok: P('Dorsal reservat. El recollireu dissabte a la fira.', 'Dorsal reservado. Lo recogeréis el sábado en la feria.') },
    ],
  },
  {
    slug: 'sustainability', group: 0, icon: 'M5 19c0-8 5-13 14-14 0 9-5 14-13 14zM5 19l7-7',
    title: P('Sostenibilitat', 'Sostenibilidad'), kicker: P('La cursa', 'La carrera'),
    lead: P('El recorregut passa pel Parc Fluvial i l’Anella Verda. El compromís és senzill: que dilluns ningú noti que hi hem passat.', 'El recorrido pasa por el Parc Fluvial y la Anella Verda. El compromiso es sencillo: que el lunes nadie note que hemos pasado.'),
    blocks: [
      { k: 'meters', title: P('Objectius 2026', 'Objetivos 2026'), items: [[90, P('del residu separat i valoritzat', 'del residuo separado y valorizado')], [0, P('ampolles de plàstic d’un sol ús', 'botellas de plástico de un solo uso'), '0'], [60, P('dels participants arriben sense cotxe o compartint-lo', 'de los participantes llegan sin coche o compartiéndolo')], [75, P('de les compres a proveïdors de l’Anoia', 'de las compras a proveedores de la Anoia')]] },
      { k: 'cards', title: P('Què fem', 'Qué hacemos'), cols: 3, items: [
        { t: P('Residu zero', 'Residuo cero'), d: P('Gots compostables, aigua en dipòsits de 20 L i cap avituallament dins del Parc Fluvial.', 'Vasos compostables, agua en depósitos de 20 L y ningún avituallamiento dentro del Parc Fluvial.') },
        { t: P('Samarreta opcional', 'Camiseta opcional'), d: P('Si no la vols, el seu cost va a replantar ribera a l’Anoia. Menys armaris plens.', 'Si no la quieres, su coste va a replantar ribera en el Anoia. Menos armarios llenos.'), tag: P('Idea', 'Idea') },
        { t: P('Medalla de fusta', 'Medalla de madera'), d: P('De pi certificat i cinta de cotó, feta per un taller ocupacional de la comarca.', 'De pino certificado y cinta de algodón, hecha por un taller ocupacional de la comarca.'), tag: P('Idea', 'Idea') },
        { t: P('Senyalització reutilitzable', 'Señalización reutilizable'), d: P('Sense any imprès: els arcs, les tanques i els cartells serveixen per a totes les edicions.', 'Sin año impreso: los arcos, las vallas y los carteles sirven para todas las ediciones.') },
        { t: P('Aliments que no es llencen', 'Alimentos que no se tiran'), d: P('La fruita i el pa sobrers van al Banc d’Aliments el mateix diumenge.', 'La fruta y el pan sobrantes van al Banco de Alimentos el mismo domingo.') },
        { t: P('Brigada verda', 'Brigada verde'), d: P('30 voluntaris recorren el circuit darrere del cotxe escombra i publiquen el pes recollit.', '30 voluntarios recorren el circuito detrás del coche escoba y publican el peso recogido.') },
      ] },
      { k: 'table', title: P('Petjada estimada de la primera edició', 'Huella estimada de la primera edición'), cols: [P('Font', 'Fuente'), 'kg CO₂e', P('Com la reduïm', 'Cómo la reducimos')], rows: [
        [P('Desplaçament dels participants', 'Desplazamiento de los participantes'), '6.400', P('Llançadores, tren i cotxe compartit', 'Lanzaderas, tren y coche compartido')], [P('Samarretes i bossa', 'Camisetas y bolsa'), '2.100', P('Samarreta opcional i polièster reciclat', 'Camiseta opcional y poliéster reciclado')], [P('Avituallaments', 'Avituallamientos'), '380', P('Producte de proximitat i a granel', 'Producto de proximidad y a granel')], [P('Muntatge i energia', 'Montaje y energía'), '520', P('Connexió a xarxa en lloc de generadors', 'Conexión a red en lugar de generadores')],
      ], note: P('Xifres orientatives per a 800 participants; caldrà calcular-les amb dades reals després de la prova.', 'Cifras orientativas para 800 participantes; habrá que calcularlas con datos reales después de la prueba.') },
      { k: 'note', title: P('El que et demanem a tu', 'Lo que te pedimos a ti'), items: [P('Llença el got només a la zona de descart: fer-ho fora comporta desqualificació.', 'Tira el vaso solo en la zona de descarte: hacerlo fuera supone descalificación.'), P('Porta el teu got plegable i la teva ampolla.', 'Trae tu vaso plegable y tu botella.'), P('Vine en tren, en bus o comparteix cotxe.', 'Ven en tren, en bus o comparte coche.'), P('Al Parc Fluvial, no surtis del camí: és zona de nidificació.', 'En el Parc Fluvial, no salgas del camino: es zona de nidificación.')] },
    ],
  },
  // ───────────────────────── Resultats i fotos ─────────────────────────
  {
    slug: 'news', group: 3, icon: 'M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5',
    title: P('Notícies', 'Noticias'), kicker: P('Actualitat', 'Actualidad'),
    lead: P('El que va passant fins al 13 de desembre: obertura de trams, entrenaments, patrocinadors i històries de qui es prepara.', 'Lo que va pasando hasta el 13 de diciembre: apertura de tramos, entrenamientos, patrocinadores e historias de quien se prepara.'),
    blocks: [
      { k: 'news', items: [
        { date: P('9 oct 2026', '9 oct 2026'), cat: P('Recorregut', 'Recorrido'), photo: 'parc-fluvial', t: P('Publicat el pla de talls de trànsit carrer a carrer', 'Publicado el plan de cortes de tráfico calle a calle'), d: P('42 carrers, 61 punts de control i un simulador per saber a quina hora podràs passar.', '42 calles, 61 puntos de control y un simulador para saber a qué hora podrás pasar.') },
        { date: P('4 oct 2026', '4 oct 2026'), cat: P('Samarreta', 'Camiseta'), photo: 'cal-font', t: P('Així és la samarreta oficial: el paviment de Cal Font', 'Así es la camiseta oficial: el pavimento de Cal Font'), d: P('Els quadrats de la plaça es desfan des d’un tall en zig-zag. Ja la pots girar en 3D.', 'Los cuadrados de la plaza se deshacen desde un corte en zigzag. Ya puedes girarla en 3D.') },
        { date: P('28 set 2026', '28 sep 2026'), cat: P('Inscripcions', 'Inscripciones'), photo: 'estadi-1', t: P('S’obren les inscripcions amb el primer tram de preus', 'Se abren las inscripciones con el primer tramo de precios'), d: P('Fins al 31 d’octubre, la Mitja a 18 €, la 10K a 12 € i la Caminada a 6 €.', 'Hasta el 31 de octubre, la Media a 18 €, la 10K a 12 € y la Caminada a 6 €.') },
        { date: P('25 set 2026', '25 sep 2026'), cat: P('Voluntariat', 'Voluntariado'), photo: 'campus-udl', t: P('La UdL s’hi suma: un crèdit ECTS per fer de voluntari', 'La UdL se suma: un crédito ECTS por hacer de voluntario'), d: P('Proposta de conveni amb el Campus d’Igualada per als estudiants que hi col·laborin.', 'Propuesta de convenio con el Campus de Igualada para los estudiantes que colaboren.') },
        { date: P('21 set 2026', '21 sep 2026'), cat: P('Organització', 'Organización'), photo: 'ajuntament', t: P('Aprovat el reglament de la primera edició', 'Aprobado el reglamento de la primera edición'), d: P('Tres modalitats, temps de tall i categories. La versió 2026.1 ja es pot consultar.', 'Tres modalidades, tiempos de corte y categorías. La versión 2026.1 ya se puede consultar.') },
        { date: P('15 set 2026', '15 sep 2026'), cat: P('Històries', 'Historias'), photo: 'pell-museu', t: P('«Vaig començar a córrer pel Rec fa trenta anys»', '«Empecé a correr por el Rec hace treinta años»'), d: P('La Montse, 61 anys, farà la seva primera mitja a casa. Història il·lustrativa.', 'Montse, 61 años, hará su primera media en casa. Historia ilustrativa.') },
      ] },
      { k: 'form', title: P('Butlletí del corredor', 'Boletín del corredor'), lead: P('Un correu cada dues setmanes fins a la cursa. Res de publicitat.', 'Un correo cada dos semanas hasta la carrera. Nada de publicidad.'), fields: [[P('Correu electrònic', 'Correo electrónico'), 'email']], submit: P('Subscriu-m’hi', 'Suscribirme'), ok: P('Fet. Revisa el correu per confirmar la subscripció.', 'Hecho. Revisa el correo para confirmar la suscripción.') },
    ],
  },
  // ───────────────────────── Col·labora / altres ─────────────────────────
  {
    slug: 'visit', group: 4, icon: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    title: P('Allotjament i turisme', 'Alojamiento y turismo'), kicker: P('Vine a Igualada', 'Ven a Igualada'),
    lead: P('A una hora de Barcelona i als peus de Montserrat. Queda’t el cap de setmana: el dorsal t’obre museus, descomptes i taula als restaurants de la ciutat.', 'A una hora de Barcelona y a los pies de Montserrat. Quédate el fin de semana: el dorsal te abre museos, descuentos y mesa en los restaurantes de la ciudad.'),
    blocks: [
      { k: 'photos', items: [['pell-museu', P('Museu de la Pell', 'Museu de la Pell')], ['basilica', P('Basílica de Santa Maria', 'Basílica de Santa Maria')], ['cal-font', P('Plaça de Cal Font', 'Plaza de Cal Font')], ['parc-fluvial', P('Parc Fluvial', 'Parc Fluvial')]] },
      { k: 'map', title: P('Què veure a prop del recorregut', 'Qué ver cerca del recorrido'), points: SIGHTS },
      { k: 'table', title: P('On dormir', 'Dónde dormir'), lead: P('Tarifa de cursa amb el codi MMI26, vàlida de divendres a diumenge.', 'Tarifa de carrera con el código MMI26, válida de viernes a domingo.'), cols: [P('Allotjament', 'Alojamiento'), P('A la sortida', 'A la salida'), P('Des de', 'Desde'), P('Per a corredors', 'Para corredores')], rows: [
        [P('Hotel col·laborador · centre', 'Hotel colaborador · centro'), P('10 min a peu', '10 min a pie'), '68 €', P('Esmorzar a les 06:00 i sortida a les 15:00', 'Desayuno a las 06:00 y salida a las 15:00')],
        [P('Hotel col·laborador · avinguda', 'Hotel colaborador · avenida'), P('5 min a peu', '5 min a pie'), '82 €', P('Dutxa postcursa encara que ja hagis deixat l’habitació', 'Ducha poscarrera aunque ya hayas dejado la habitación')],
        [P('Alberg i residència d’estudiants', 'Albergue y residencia de estudiantes'), P('15 min a peu', '15 min a pie'), '24 €', P('Habitacions de 2 i 4; ideal per a clubs', 'Habitaciones de 2 y 4; ideal para clubes')],
        [P('Cases rurals de l’Anoia', 'Casas rurales de la Anoia'), P('10–20 min en cotxe', '10–20 min en coche'), '45 €', P('Per a famílies i colles', 'Para familias y peñas')],
      ], note: P('Establiments i preus per concretar: encara no hi ha acords signats.', 'Establecimientos y precios por concretar: todavía no hay acuerdos firmados.') },
      { k: 'cards', title: P('El teu dorsal val més', 'Tu dorsal vale más'), cols: 3, items: [
        { t: P('Menú del corredor', 'Menú del corredor'), d: P('Dissabte, plat de pasta a 12 € als restaurants adherits. Diumenge, vermut de finisher.', 'El sábado, plato de pasta a 12 € en los restaurantes adheridos. El domingo, vermut de finisher.'), tag: P('Idea', 'Idea') },
        { t: P('Museus gratis', 'Museos gratis'), d: P('Museu de la Pell i Museu del Traginer, de divendres a diumenge.', 'Museu de la Pell y Museu del Traginer, de viernes a domingo.'), tag: P('Idea', 'Idea') },
        { t: P('Montserrat a 30 minuts', 'Montserrat a 30 minutos'), d: P('Excursió de dilluns per estirar les cames: autocar a les 10:00 des del Parc Central.', 'Excursión del lunes para estirar las piernas: autocar a las 10:00 desde el Parc Central.'), tag: P('Idea', 'Idea') },
      ] },
    ],
  },
  {
    slug: 'shop', group: 4, icon: 'M6 8h12l-1 12H7zM9 8V6a3 3 0 0 1 6 0v2',
    title: P('Botiga', 'Tienda'), kicker: P('Marxandatge oficial', 'Merchandising oficial'),
    lead: P('La samarreta de Cal Font i la resta de la col·lecció. Recollida gratuïta a la Fira del Corredor; un euro de cada peça va a la causa solidària.', 'La camiseta de Cal Font y el resto de la colección. Recogida gratuita en la Feria del Corredor; un euro de cada pieza va a la causa solidaria.'),
    blocks: [
      { k: 'shop', items: [
        { id: 'tee', img: '/shirt/front.webp', t: P('Samarreta oficial 2026', 'Camiseta oficial 2026'), d: P('Tècnica, polièster reciclat. Tall home i dona.', 'Técnica, poliéster reciclado. Corte hombre y mujer.'), price: 22, sizes: ['XS', 'S', 'M', 'L', 'XL'], tag: P('Més venuda', 'Más vendida') },
        { id: 'buff', img: '/shop/buff.svg', t: P('Buff d’hivern', 'Buff de invierno'), d: P('Per als 5 °C de la sortida. Estampat de rajoles.', 'Para los 5 °C de la salida. Estampado de baldosas.'), price: 9 },
        { id: 'cup', img: '/shop/cup.svg', t: P('Got plegable', 'Vaso plegable'), d: P('150 ml, es penja del cinturó. Amb ell entres al sorteig del 2027.', '150 ml, se cuelga del cinturón. Con él entras en el sorteo de 2027.'), price: 6 },
        { id: 'cap', img: '/shop/cap.svg', t: P('Gorra lleugera', 'Gorra ligera'), d: P('Visera tova i reixeta lateral.', 'Visera blanda y rejilla lateral.'), price: 14 },
        { id: 'socks', img: '/shop/socks.svg', t: P('Mitjons de cursa', 'Calcetines de carrera'), d: P('Canya mitjana amb el zig-zag de la marca.', 'Caña media con el zigzag de la marca.'), price: 11, sizes: ['36–39', '40–43', '44–47'] },
        { id: 'hoodie', img: '/shop/hoodie.svg', t: P('Dessuadora finisher', 'Sudadera finisher'), d: P('Només per a qui creua la meta: es desbloqueja amb el teu dorsal.', 'Solo para quien cruza la meta: se desbloquea con tu dorsal.'), price: 39, sizes: ['S', 'M', 'L', 'XL'], tag: P('Exclusiva', 'Exclusiva') },
      ] },
      { k: 'note', title: P('Com funciona', 'Cómo funciona'), items: [P('Comandes fins al 30 de novembre per recollir-les amb el dorsal.', 'Pedidos hasta el 30 de noviembre para recogerlos con el dorsal.'), P('Enviament a domicili: 4,50 €; gratuït a partir de 50 €.', 'Envío a domicilio: 4,50 €; gratuito a partir de 50 €.'), P('Estudiants UdL: 20 % de descompte amb el carnet.', 'Estudiantes UdL: 20 % de descuento con el carné.'), P('Canvis de talla a la fira, segons estoc.', 'Cambios de talla en la feria, según stock.')] },
    ],
  },
  {
    slug: 'press', group: 4, icon: 'M4 6h16v12H4zM8 10h8M8 14h5',
    title: P('Premsa i organització', 'Prensa y organización'), kicker: P('Qui hi ha darrere', 'Quién hay detrás'),
    lead: P('Una cursa nova, organitzada des d’Igualada amb els ajuntaments, els clubs i la universitat. Aquí tens les xifres, el calendari del projecte i els materials per a mitjans.', 'Una carrera nueva, organizada desde Igualada con los ayuntamientos, los clubes y la universidad. Aquí tienes las cifras, el calendario del proyecto y los materiales para medios.'),
    blocks: [
      { k: 'stats', items: [['800', P('participants previstos', 'participantes previstos')], ['3', P('modalitats', 'modalidades')], ['2', P('municipis', 'municipios')], ['114', P('voluntaris', 'voluntarios')]] },
      { k: 'steps', title: P('Com s’ha fet la cursa', 'Cómo se ha hecho la carrera'), items: [
        [P('Mar–juny', 'Mar–jun'), P('Disseny', 'Diseño'), P('Recorreguts, modalitats i viabilitat econòmica.', 'Recorridos, modalidades y viabilidad económica.')],
        [P('Juny–ag', 'Jun–ago'), P('Documentació tècnica', 'Documentación técnica'), P('Memòria, plànols, pla de mobilitat i Pla d’Autoprotecció.', 'Memoria, planos, plan de movilidad y Plan de Autoprotección.')],
        [P('Setembre', 'Septiembre'), P('Tramitació oficial', 'Tramitación oficial'), P('Ajuntaments d’Igualada i Vilanova del Camí i Servei Català de Trànsit.', 'Ayuntamientos de Igualada y Vilanova del Camí y Servei Català de Trànsit.')],
        [P('Set–oct', 'Sep–oct'), P('Contractació', 'Contratación'), P('Assegurances, servei mèdic, cronometratge i samarretes.', 'Seguros, servicio médico, cronometraje y camisetas.')],
        [P('13 des', '13 dic'), P('Primera edició', 'Primera edición'), P('Sortida a les 08:30 al Parc Central.', 'Salida a las 08:30 en el Parc Central.')],
      ] },
      { k: 'cards', title: P('Qui fa què', 'Quién hace qué'), cols: 3, items: [
        { t: P('Direcció de cursa', 'Dirección de carrera'), d: P('Coordinació general, permisos i relació amb institucions.', 'Coordinación general, permisos y relación con instituciones.') },
        { t: P('Recorregut i seguretat', 'Recorrido y seguridad'), d: P('Talls de trànsit, senyalització, Policia Local i Protecció Civil.', 'Cortes de tráfico, señalización, Policia Local y Protecció Civil.') },
        { t: P('Voluntariat', 'Voluntariado'), d: P('Captació, formació i assignació dels 61 punts de control.', 'Captación, formación y asignación de los 61 puntos de control.') },
        { t: P('Corredor i inscripcions', 'Corredor e inscripciones'), d: P('Atenció al participant, dorsals i cronometratge.', 'Atención al participante, dorsales y cronometraje.') },
        { t: P('Patrocini i comunicació', 'Patrocinio y comunicación'), d: P('Marca, web, xarxes i relació amb empreses.', 'Marca, web, redes y relación con empresas.') },
        { t: P('Sostenibilitat', 'Sostenibilidad'), d: P('Residu zero, Parc Fluvial i memòria ambiental.', 'Residuo cero, Parc Fluvial y memoria ambiental.') },
      ] },
      { k: 'files', title: P('Kit de premsa', 'Kit de prensa'), items: [['/brand/logo-principal.svg', P('Logotip principal', 'Logotipo principal'), 'SVG'], ['/brand/logo-horitzontal.svg', P('Logotip horitzontal', 'Logotipo horizontal'), 'SVG'], ['/brand/logo-mono-blanc.svg', P('Logotip en negatiu', 'Logotipo en negativo'), 'SVG'], ['/gpx/21k.gpx', P('Recorregut 21K', 'Recorrido 21K'), 'GPX'], ['/gpx/10k.gpx', P('Recorregut 10K', 'Recorrido 10K'), 'GPX'], ['/og.jpg', P('Imatge de capçalera', 'Imagen de cabecera'), 'JPG']] },
      { k: 'form', title: P('Acreditació de mitjans', 'Acreditación de medios'), lead: P('Fins al 4 de desembre. Inclou armilla, accés a la zona mixta i moto de premsa per a dos fotògrafs.', 'Hasta el 4 de diciembre. Incluye chaleco, acceso a la zona mixta y moto de prensa para dos fotógrafos.'), fields: [[P('Mitjà', 'Medio'), 'text'], [P('Nom i cognoms', 'Nombre y apellidos'), 'text'], [P('Correu electrònic', 'Correo electrónico'), 'email'], [P('Tipus', 'Tipo'), 'select', [P('Redacció', 'Redacción'), P('Fotografia', 'Fotografía'), P('Vídeo', 'Vídeo'), P('Ràdio', 'Radio')]]], submit: P('Sol·licita l’acreditació', 'Solicitar la acreditación'), ok: P('Sol·licitud rebuda. Confirmarem l’acreditació per correu.', 'Solicitud recibida. Confirmaremos la acreditación por correo.') },
    ],
  },
];
