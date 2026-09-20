// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Domaine final (pour URLs canoniques, sitemap, Open Graph).
  // À laisser tel quel : il sera correct dès que le domaine sera branché.
  site: 'https://philippemuraro.fr',
  // Mode statique par défaut : seules les routes avec `prerender = false`
  // (api/contact, galeries/[slug]) deviennent des fonctions serverless.
  adapter: vercel(),
  integrations: [sitemap()],
});
