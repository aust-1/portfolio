import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import { defineConfig } from 'vitest/config';
import { flagsPlugin } from './scripts/flags.ts';
import { textCharsetPlugin } from './scripts/text-charset.ts';

const ANALYTICS = 'https://analytics.eliott-roussille.fr';

export default defineConfig({
  plugins: [
    flagsPlugin(),
    textCharsetPlugin(),
    sveltekit({
      extensions: ['.svelte', '.md'],
      preprocess: [mdsvex({ extensions: ['.md'], rehypePlugins: [rehypeSlug] })],
      compilerOptions: {
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
      },
      // Pas de fallback : 404.html est la page prérendue de src/routes/404, servie par Caddy pour
      // toute URL inconnue (une coquille SPA serait vide sans JavaScript).
      adapter: adapter({ strict: true }),
      // Chemins absolus (/_app/…) : 404.html est servie à n'importe quelle profondeur (/projets/x/y),
      // où des chemins relatifs (./_app/…) pointeraient dans le vide.
      paths: { relative: false },
      prerender: { handleHttpError: 'fail', handleMissingId: 'fail' },
      // Pages prérendues : SvelteKit pose la CSP en <meta> avec les empreintes de ses scripts.
      // Les directives qu'une balise <meta> ignore (frame-ancestors…) sont posées par Caddy.
      csp: {
        mode: 'hash',
        directives: {
          'default-src': ['self'],
          'script-src': ['self', ANALYTICS],
          'connect-src': ['self', ANALYTICS],
          'img-src': ['self', 'data:'],
          'style-src': ['self', 'unsafe-inline'],
          'font-src': ['self'],
          'object-src': ['none'],
          'base-uri': ['none'],
          'form-action': ['none'],
        },
      },
    }),
  ],
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    environment: 'node',
  },
});
