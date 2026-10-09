import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// SITE_URL: el posa el desplegament a GitHub Pages (.github/workflows/pages.yml)
const site = (process.env.SITE_URL || 'https://mmigualada.example').toLowerCase(); // TODO: domini definitiu

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (p) => !p.includes('/404') && p !== `${site}/`,
      i18n: { defaultLocale: 'ca', locales: { ca: 'ca-ES', en: 'en-GB', es: 'es-ES' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
