import type { Handle } from '@sveltejs/kit/hooks';
import { COMMENT_FLAG } from 'virtual:flags-server';
import { asciiBanner } from '#lib/ascii.ts';

const BANNER = asciiBanner(COMMENT_FLAG);

// Exécuté au prérendu : pose l'ASCII art et le flag 1 en commentaire en tête de chaque page.
export const handle: Handle = ({ event, resolve }) =>
  resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%portfolio.ascii%', BANNER),
  });
