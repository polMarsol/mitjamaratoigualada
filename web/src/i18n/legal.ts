// Plantilles legals. ⚠ No són assessorament jurídic: revisar-les amb un professional abans de publicar.
import { LEGAL, EVENT } from '../data/event';
import type { Lang } from './index';

type Doc = { title: string; desc: string; updated: string; sections: { h: string; p: string[] }[] };
type Set = { legal: Doc; privacy: Doc; cookies: Doc };
const o = `${LEGAL.entity} (NIF ${LEGAL.nif}), ${LEGAL.address}`;

export const LEGAL_DOCS: Record<Lang, Set> = {
  ca: {
    legal: { title: 'Avís legal', desc: 'Informació legal del titular del web de la MM Igualada.', updated: 'Última actualització',
      sections: [
        { h: 'Titular del web', p: [`En compliment de la Llei 34/2002 (LSSI-CE), s’informa que el titular d’aquest web és ${o}. Contacte: ${EVENT.email}.`] },
        { h: 'Objecte i condicions d’ús', p: ['Aquest web informa sobre la Mitja Marató d’Igualada (21K, 10K i Caminada Popular). L’accés implica acceptar aquestes condicions. L’usuari es compromet a fer-ne un ús lícit i a no perjudicar tercers ni el funcionament del lloc.'] },
        { h: 'Propietat intel·lectual', p: ['Els continguts, disseny i marca són titularitat de l’organització o s’utilitzen amb llicència. Les fotografies de Wikimedia Commons es mostren sota llicència CC BY-SA amb l’autoria indicada. Queda prohibida la reproducció sense autorització.'] },
        { h: 'Reglament oficial', p: ['La informació del web és orientativa. En cas de discrepància, preval íntegrament el Reglament Oficial de la prova.'] },
        { h: 'Responsabilitat', p: ['L’organització no garanteix l’absència d’errors ni la disponibilitat contínua del web, i no es fa responsable dels enllaços a webs de tercers.'] },
        { h: 'Legislació i jurisdicció', p: ['Aquest avís es regeix per la legislació espanyola i catalana. Per a qualsevol controvèrsia, les parts se sotmeten als jutjats i tribunals d’Igualada.'] },
      ] },
    privacy: { title: 'Política de privacitat', desc: 'Com tractem les teves dades personals a la MM Igualada (RGPD).', updated: 'Última actualització',
      sections: [
        { h: 'Responsable del tractament', p: [`${o}. Contacte per a privacitat: ${EVENT.email}.`] },
        { h: 'Finalitats i base legal', p: ['Formulari de contacte: respondre la teva consulta (base: consentiment, art. 6.1.a RGPD).', 'Inscripcions (quan s’activin): gestionar la inscripció, dorsals, assegurança, cronometratge i classificacions (base: execució del contracte).', 'Analítica web: només si acceptes les cookies d’analítica (base: consentiment).'] },
        { h: 'Destinataris', p: ['No cedim les dades a tercers excepte obligació legal o proveïdors necessaris (cronometratge, assegurança, allotjament web) amb contracte d’encàrrec de tractament.'] },
        { h: 'Conservació', p: ['Les consultes es conserven el temps necessari per atendre-les. Les dades d’inscripció, durant l’esdeveniment i els terminis legals aplicables.'] },
        { h: 'Els teus drets', p: [`Pots exercir els drets d’accés, rectificació, supressió, oposició, limitació i portabilitat escrivint a ${EVENT.email}. Si consideres que no s’han atès, pots reclamar davant l’Autoritat Catalana de Protecció de Dades (apdcat.cat) o l’AEPD.`] },
        { h: 'Menors', p: ['La participació de menors requereix l’autorització signada del pare, mare o tutor legal, segons el Reglament.'] },
      ] },
    cookies: { title: 'Política de cookies', desc: 'Quines cookies fem servir a la web de la MM Igualada i com gestionar-les.', updated: 'Última actualització',
      sections: [
        { h: 'Què són', p: ['Les cookies són petits fitxers que el navegador desa quan visites un web. Serveixen perquè el lloc funcioni o per obtenir estadístiques.'] },
        { h: 'Cookies i emmagatzematge que fem servir', p: ['Necessàries (sense consentiment): «theme» (tema clar/fosc), «consent» (la teva elecció de cookies) i «loaded» (sessió, per mostrar la pantalla de càrrega una sola vegada).', 'Analítica (amb consentiment): Google Analytics 4 amb IP anonimitzada, només si acceptes i quan estigui configurat.'] },
        { h: 'Terceres parts', p: ['El mapa dels recorreguts carrega mosaics d’OpenStreetMap, que poden rebre la teva adreça IP com qualsevol petició web.'] },
        { h: 'Com gestionar-les', p: ['Pots canviar la teva decisió en qualsevol moment amb l’enllaç «Configura les cookies» del peu de pàgina, o esborrar-les des de la configuració del navegador.'] },
      ] },
  },
  en: {
    legal: { title: 'Legal notice', desc: 'Legal information about the owner of the MM Igualada website.', updated: 'Last updated',
      sections: [
        { h: 'Website owner', p: [`Pursuant to Spanish Law 34/2002 (LSSI-CE), the owner of this website is ${o}. Contact: ${EVENT.email}.`] },
        { h: 'Purpose and terms of use', p: ['This website provides information about the Igualada Half Marathon (21K, 10K and Popular Walk). By accessing it you accept these terms and agree to use it lawfully without harming third parties or the site’s operation.'] },
        { h: 'Intellectual property', p: ['Content, design and brand belong to the organiser or are used under licence. Wikimedia Commons photographs are displayed under CC BY-SA licence with the credited authorship. Reproduction without permission is prohibited.'] },
        { h: 'Official regulations', p: ['Website information is indicative. In case of discrepancy, the Official Regulations of the event prevail in full.'] },
        { h: 'Liability', p: ['The organiser does not guarantee the absence of errors or continuous availability, and is not responsible for third-party links.'] },
        { h: 'Governing law', p: ['This notice is governed by Spanish and Catalan law. The parties submit to the courts of Igualada for any dispute.'] },
      ] },
    privacy: { title: 'Privacy policy', desc: 'How we handle your personal data at MM Igualada (GDPR).', updated: 'Last updated',
      sections: [
        { h: 'Data controller', p: [`${o}. Privacy contact: ${EVENT.email}.`] },
        { h: 'Purposes and legal basis', p: ['Contact form: answering your enquiry (basis: consent, art. 6.1.a GDPR).', 'Registrations (when enabled): managing registration, bibs, insurance, timing and results (basis: performance of a contract).', 'Web analytics: only if you accept analytics cookies (basis: consent).'] },
        { h: 'Recipients', p: ['We do not share data with third parties except where legally required or with necessary providers (timing, insurance, hosting) under data processing agreements.'] },
        { h: 'Retention', p: ['Enquiries are kept as long as needed to handle them. Registration data is kept for the event and applicable legal periods.'] },
        { h: 'Your rights', p: [`You may exercise your rights of access, rectification, erasure, objection, restriction and portability by writing to ${EVENT.email}. You may also complain to the Catalan Data Protection Authority (apdcat.cat) or the Spanish AEPD.`] },
        { h: 'Minors', p: ['Minors’ participation requires the signed authorisation of a parent or legal guardian, as set out in the Regulations.'] },
      ] },
    cookies: { title: 'Cookie policy', desc: 'Which cookies the MM Igualada website uses and how to manage them.', updated: 'Last updated',
      sections: [
        { h: 'What they are', p: ['Cookies are small files your browser stores when you visit a website. They make the site work or provide statistics.'] },
        { h: 'Cookies and storage we use', p: ['Necessary (no consent required): “theme” (light/dark), “consent” (your cookie choice) and “loaded” (session, to show the loading screen only once).', 'Analytics (with consent): Google Analytics 4 with anonymised IP, only if you accept and once configured.'] },
        { h: 'Third parties', p: ['The route map loads OpenStreetMap tiles, which may receive your IP address like any web request.'] },
        { h: 'How to manage them', p: ['You can change your decision at any time via the “Cookie settings” link in the footer, or delete them in your browser settings.'] },
      ] },
  },
  es: {
    legal: { title: 'Aviso legal', desc: 'Información legal del titular del sitio web de la MM Igualada.', updated: 'Última actualización',
      sections: [
        { h: 'Titular del sitio web', p: [`En cumplimiento de la Ley 34/2002 (LSSI-CE), se informa de que el titular de este sitio es ${o}. Contacto: ${EVENT.email}.`] },
        { h: 'Objeto y condiciones de uso', p: ['Este sitio informa sobre la Media Maratón de Igualada (21K, 10K y Caminata Popular). El acceso implica aceptar estas condiciones y usarlo de forma lícita sin perjudicar a terceros ni al funcionamiento del sitio.'] },
        { h: 'Propiedad intelectual', p: ['Los contenidos, el diseño y la marca pertenecen a la organización o se usan con licencia. Las fotografías de Wikimedia Commons se muestran bajo licencia CC BY-SA con la autoría indicada. Queda prohibida la reproducción sin autorización.'] },
        { h: 'Reglamento oficial', p: ['La información del sitio es orientativa. En caso de discrepancia, prevalece íntegramente el Reglamento Oficial de la prueba.'] },
        { h: 'Responsabilidad', p: ['La organización no garantiza la ausencia de errores ni la disponibilidad continua, y no responde de los enlaces a sitios de terceros.'] },
        { h: 'Legislación y jurisdicción', p: ['Este aviso se rige por la legislación española y catalana. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Igualada.'] },
      ] },
    privacy: { title: 'Política de privacidad', desc: 'Cómo tratamos tus datos personales en la MM Igualada (RGPD).', updated: 'Última actualización',
      sections: [
        { h: 'Responsable del tratamiento', p: [`${o}. Contacto de privacidad: ${EVENT.email}.`] },
        { h: 'Finalidades y base jurídica', p: ['Formulario de contacto: responder tu consulta (base: consentimiento, art. 6.1.a RGPD).', 'Inscripciones (cuando se activen): gestionar inscripción, dorsales, seguro, cronometraje y clasificaciones (base: ejecución del contrato).', 'Analítica web: solo si aceptas las cookies de analítica (base: consentimiento).'] },
        { h: 'Destinatarios', p: ['No cedemos datos a terceros salvo obligación legal o proveedores necesarios (cronometraje, seguro, alojamiento web) con contrato de encargo de tratamiento.'] },
        { h: 'Conservación', p: ['Las consultas se conservan el tiempo necesario para atenderlas. Los datos de inscripción, durante el evento y los plazos legales aplicables.'] },
        { h: 'Tus derechos', p: [`Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${EVENT.email}. Si consideras que no se han atendido, puedes reclamar ante la Autoridad Catalana de Protección de Datos (apdcat.cat) o la AEPD.`] },
        { h: 'Menores', p: ['La participación de menores requiere la autorización firmada de padre, madre o tutor legal, según el Reglamento.'] },
      ] },
    cookies: { title: 'Política de cookies', desc: 'Qué cookies usa el sitio de la MM Igualada y cómo gestionarlas.', updated: 'Última actualización',
      sections: [
        { h: 'Qué son', p: ['Las cookies son pequeños archivos que el navegador guarda al visitar un sitio. Sirven para que funcione o para obtener estadísticas.'] },
        { h: 'Cookies y almacenamiento que usamos', p: ['Necesarias (sin consentimiento): «theme» (tema claro/oscuro), «consent» (tu elección de cookies) y «loaded» (sesión, para mostrar la pantalla de carga una sola vez).', 'Analítica (con consentimiento): Google Analytics 4 con IP anonimizada, solo si aceptas y cuando esté configurado.'] },
        { h: 'Terceros', p: ['El mapa de recorridos carga teselas de OpenStreetMap, que pueden recibir tu dirección IP como cualquier petición web.'] },
        { h: 'Cómo gestionarlas', p: ['Puedes cambiar tu decisión en cualquier momento con el enlace «Configurar cookies» del pie de página, o borrarlas desde los ajustes del navegador.'] },
      ] },
  },
};
