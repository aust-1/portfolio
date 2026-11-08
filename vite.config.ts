import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vitest/config';

const ANALYTICS = 'https://analytics.eliott-roussille.fr';

export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.md'],
      preprocess: [mdsvex({ extensions: ['.md'] })],
      compilerOptions: {
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
      },
      adapter: adapter({ fallback: undefined, strict: true }),
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
