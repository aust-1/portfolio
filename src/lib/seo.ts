// Référencement et partage : URL canoniques, image Open Graph, plan du site.
import { SITE } from './site.ts';

/** URL canonique d'une page : toujours sur le domaine, sans barre finale (trailingSlash 'never'). */
export function canonicalUrl(pathname: string): string {
  const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  return new URL(path, SITE.url).href;
}

/** Image de partage par défaut (Open Graph, 1200 × 630), générée par scripts/make-og.ts. */
export const OG_IMAGE = {
  src: '/og.png',
  width: 1200,
  height: 630,
  alt: `${SITE.name}, étudiant ingénieur cyber et manager. ${SITE.hook}`,
} as const;

/** Pages fixes publiées (sans /admin, piège non indexé, ni la 404). */
export const STATIC_PAGES = [
  '/',
  '/projets',
  '/parcours',
  '/competences',
  '/a-propos',
  '/cv',
  '/ce-site',
  '/liens',
] as const;

const escapeXml = (s: string) =>
  s.replace(
    /[<>&'"]/g,
    (c) => `&${{ '<': 'lt', '>': 'gt', '&': 'amp', "'": 'apos', '"': 'quot' }[c]};`,
  );

/** sitemap.xml (protocole sitemaps.org) des chemins donnés, en URL canoniques. */
export function sitemapXml(paths: readonly string[]): string {
  const urls = [...new Set(paths)].map(
    (p) => `  <url><loc>${escapeXml(canonicalUrl(p))}</loc></url>`,
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}
