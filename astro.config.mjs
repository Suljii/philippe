// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Mode statique par défaut : seules les routes avec `prerender = false`
  // (api/contact, galeries/[slug]) deviennent des fonctions serverless.
  adapter: vercel(),
});
