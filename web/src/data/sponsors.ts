// Marques FICTÍCIES per al prototip (cap correspon a empreses reals). Substituir per patrocinadors reals i els seus logos.
export type Shape = 'mountain' | 'wave' | 'leaf' | 'hex' | 'bolt' | 'ring' | 'arrow' | 'sun';
export interface Sponsor { name: string; shape: Shape; color: string; sector: { ca: string; en: string; es: string } }
export const SPONSORS: { main: Sponsor[]; partners: Sponsor[]; local: Sponsor[] } = {
  main: [{ name: 'Anoia Sport', shape: 'mountain', color: '#0b5cad', sector: { ca: 'Equipament esportiu', en: 'Sports equipment', es: 'Equipamiento deportivo' } }],
  partners: [
    { name: 'Vinyes del Camí', shape: 'leaf', color: '#7c2d3a', sector: { ca: 'Cellers', en: 'Wineries', es: 'Bodegas' } },
    { name: 'Nova Tèxtil', shape: 'wave', color: '#1d4ed8', sector: { ca: 'Indústria tèxtil', en: 'Textile industry', es: 'Industria textil' } },
    { name: 'Volt Anoia', shape: 'bolt', color: '#b45309', sector: { ca: 'Energia', en: 'Energy', es: 'Energía' } },
    { name: 'Clínica Fisio+', shape: 'ring', color: '#0f766e', sector: { ca: 'Fisioteràpia', en: 'Physiotherapy', es: 'Fisioterapia' } },
  ],
  local: [
    { name: 'Cal Forner', shape: 'sun', color: '#a16207', sector: { ca: 'Forn de pa', en: 'Bakery', es: 'Panadería' } },
    { name: 'Llibreria Nova', shape: 'hex', color: '#4338ca', sector: { ca: 'Llibreria', en: 'Bookshop', es: 'Librería' } },
    { name: 'Bikes Montbui', shape: 'arrow', color: '#15803d', sector: { ca: 'Bicicletes', en: 'Bikes', es: 'Bicicletas' } },
    { name: 'Òptica Vista', shape: 'ring', color: '#0369a1', sector: { ca: 'Òptica', en: 'Optician', es: 'Óptica' } },
    { name: 'Fruites Pere', shape: 'leaf', color: '#16a34a', sector: { ca: 'Fruiteria', en: 'Greengrocer', es: 'Frutería' } },
    { name: 'Taller Garriga', shape: 'hex', color: '#525252', sector: { ca: 'Mecànica', en: 'Garage', es: 'Mecánica' } },
  ],
};
export const SOCIAL = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/mmigualada' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/mmigualada' },
  { id: 'x', label: 'X', href: 'https://x.com/mmigualada' },
  { id: 'strava', label: 'Strava', href: 'https://www.strava.com/clubs/mmigualada' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@mmigualada' },
]; // PLACEHOLDER: perfils no creats
