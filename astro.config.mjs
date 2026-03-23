import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://placeholder.com',
  image: {
    layout: 'constrained',
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
    }),
  ],
});
