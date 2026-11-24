import { expect, test } from './fixtures.ts';

// <head> des pages prérendues, lu dans le HTML servi (avant tout JavaScript).
const ROUTES = [
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
  '/admin',
];

for (const path of ROUTES) {
  // Une CSP en <meta> ne s'applique qu'au contenu qui la suit : aucun script avant elle.
  test(`${path} : la CSP précède tout script`, async ({ request }) => {
    const html = await (await request.get(path)).text();
    const csp = html.search(/<meta http-equiv="content-security-policy"/i);
    const firstScript = html.search(/<script[\s>]/i);
    expect(csp, 'balise CSP absente').toBeGreaterThan(-1);
    expect(firstScript, 'aucun script').toBeGreaterThan(-1);
    expect(csp).toBeLessThan(firstScript);
  });
}

test('les polices du premier écran sont préchargées et réellement utilisées', async ({
  page,
  request,
}) => {
  const html = await (await request.get('/')).text();
  const preloads = [
    ...html.matchAll(/<link rel="preload" as="font" type="font\/woff2" href="([^"]+)"/g),
  ].map((m) => m[1]!);
  expect(
    preloads.map((h) =>
      h
        .split('/')
        .pop()
        ?.replace(/\.[\w-]+\.woff2$/, ''),
    ),
  ).toEqual([
    'inter-tight-latin-900-normal',
    'inter-latin-400-normal',
    'jetbrains-mono-latin-500-normal',
  ]);

  // Même URL que celle des @font-face : le fichier préchargé est celui que la page utilise.
  const fonts: string[] = [];
  page.on('request', (r) => {
    if (r.resourceType() === 'font') fonts.push(new URL(r.url()).pathname);
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  for (const href of preloads) expect(fonts).toContain(new URL(href, 'http://x').pathname);
});
