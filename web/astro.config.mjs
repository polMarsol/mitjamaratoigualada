import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mmigualada.example', // TODO: domini definitiu
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (p) => !p.includes('/404') && p !== 'https://mmigualada.example/',
      i18n: { defaultLocale: 'ca', locales: { ca: 'ca-ES', en: 'en-GB', es: 'es-ES' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
