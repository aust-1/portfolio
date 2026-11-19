import { describe, expect, it } from 'vitest';
import { canonicalUrl, sitemapXml, STATIC_PAGES } from './seo.ts';

describe('URL canonique', () => {
  it('reste sur le domaine, sans barre finale', () => {
    expect(canonicalUrl('/')).toBe('https://eliott-roussille.fr/');
    expect(canonicalUrl('/projets')).toBe('https://eliott-roussille.fr/projets');
    expect(canonicalUrl('/projets/boggle/')).toBe('https://eliott-roussille.fr/projets/boggle');
  });
});

describe('sitemap.xml', () => {
  it('liste chaque page une fois, en URL canoniques', () => {
    const xml = sitemapXml(['/', '/projets', '/projets', '/parcours/a&b']);
    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>\n<urlset xmlns=/);
    expect(xml.match(/<loc>/g)).toHaveLength(3);
    expect(xml).toContain('<loc>https://eliott-roussille.fr/projets</loc>');
    expect(xml).toContain('<loc>https://eliott-roussille.fr/parcours/a&amp;b</loc>');
  });

  it("n'annonce ni /admin ni la 404", () => {
    expect(STATIC_PAGES).not.toContain('/admin');
    expect(STATIC_PAGES).not.toContain('/404');
  });
});
