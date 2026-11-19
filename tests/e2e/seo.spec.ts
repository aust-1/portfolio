import { expect, test } from './fixtures.ts';

const SITE = 'https://eliott-roussille.fr';
const PAGES = [
  '/',
  '/projets',
  '/projets/coupe-de-france-de-robotique',
  '/parcours',
  '/parcours/bouygues-stage-pentest',
  '/competences',
  '/a-propos',
  '/cv',
  '/ce-site',
  '/liens',
];

// Lu dans le HTML prérendu : c'est ce que voient LinkedIn, Discord ou un moteur de recherche.
for (const path of PAGES) {
  test(`${path} : URL canonique, Open Graph et carte de partage`, async ({ page }) => {
    await page.goto(path);
    const meta = (sel: string) => page.locator(`head ${sel}`).getAttribute('content');
    const url = SITE + (path === '/' ? '/' : path);
    const title = await page.title();

    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', url);
    expect(await meta('meta[property="og:url"]')).toBe(url);
    expect(await meta('meta[property="og:title"]')).toBe(title);
    expect(await meta('meta[property="og:description"]')).toBe(
      await meta('meta[name="description"]'),
    );
    expect(await meta('meta[property="og:image"]')).toBe(`${SITE}/og.png`);
    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');
    await expect(page.locator('head meta[property="og:title"]')).toHaveCount(1);
  });
}

test("l'image de partage existe et fait 1200 × 630", async ({ request }) => {
  const res = await request.get('/og.png');
  expect(res.status()).toBe(200);
  const png = await res.body();
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
});

test('sitemap.xml liste les pages, projets et rôles, sans /admin', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const xml = await res.text();
  for (const path of PAGES) expect(xml).toContain(`<loc>${SITE}${path === '/' ? '/' : path}</loc>`);
  expect(xml).toContain(`<loc>${SITE}/projets/boggle</loc>`);
  expect(xml).not.toContain('/admin');

  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
});
