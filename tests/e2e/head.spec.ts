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
