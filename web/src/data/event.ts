// Dades de l'esdeveniment. ⚠ Valors marcats PLACEHOLDER: substituir quan l'organització els confirmi.
export const EVENT = {
  name: 'MM Igualada',
  date: '2026-12-13', // PLACEHOLDER: el reglament no fixa la data
  place: { ca: 'Igualada · Vilanova del Camí', en: 'Igualada · Vilanova del Camí', es: 'Igualada · Vilanova del Camí' },
  registrationsOpen: true, // PLACEHOLDER
  email: 'info@mmigualada.example', // PLACEHOLDER
  whatsapp: '34600000000', // PLACEHOLDER
  siteUrl: 'https://mmigualada.example',
};

// Preus per TRAMS DE DATA (5 trams). Reduïts respecte al reglament per ser més competitius. PLACEHOLDER.
export const MODALITIES = [
  { id: '21k', km: '21,097', start: '08:30', cutoff: '11:30', minAge: 18, timed: true, fees: [18, 20, 23, 26, 28], routeId: '21k' },
  { id: '10k', km: '10', start: '09:00', cutoff: '10:30', minAge: 14, timed: true, fees: [12, 14, 17, 20, 23], routeId: '10k' },
  { id: 'walk', km: '6–8', start: '09:15', cutoff: '11:45', minAge: 0, timed: false, fees: [6, 8, 10, 10, 10], routeId: 'walk' },
] as const;

// Cada tram acaba (inclosa) a la data indicada. El primer comença quan s'obren les inscripcions.
export const TIERS = ['2026-10-31', '2026-11-15', '2026-11-30', '2026-12-08', '2026-12-12'] as const;
export const OPENS = '2026-09-25';
export const UDL_DISCOUNT = 20; // % de descompte a estudiants UdL (inscripció i merchandising). PLACEHOLDER
export const ANALYTICS_ID = ''; // PLACEHOLDER: ID de GA4 (G-XXXXXXXXXX). Buit = analítica desactivada
export const LEGAL = {
  entity: 'Comitè Organitzador de la MM Igualada', // PLACEHOLDER: confirmar raó social
  nif: 'G-00000000', // PLACEHOLDER
  address: 'Igualada (Barcelona) — adreça pendent de confirmar', // PLACEHOLDER
  updated: '2026-09-25',
};
