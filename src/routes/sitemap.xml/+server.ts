import { getProjects, getRoles } from '#lib/content/index.ts';
import { sitemapXml, STATIC_PAGES } from '#lib/seo.ts';
import type { RequestHandler } from './$types';

// Prérendu en build/sitemap.xml : pages fixes, projets et rôles publiés.
export const prerender = true;

export const GET: RequestHandler = () =>
  new Response(
    sitemapXml([
      ...STATIC_PAGES,
      ...getProjects().map((p) => `/projets/${p.slug}`),
      ...getRoles().map((r) => `/parcours/${r.slug}`),
    ]),
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
