import { expect, test } from './fixtures.ts';

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

test.describe('pages', () => {
  for (const path of ROUTES) {
    test(`${path} répond et n'a pas d'erreur JS`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1').first()).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test('une URL inconnue répond 404 avec la page terminal', async ({ page }) => {
    const res = await page.goto('/nexiste-pas');
    expect(res?.status()).toBe(404);
  });

  test("le hero ne montre aucun chiffre-clé et porte l'accroche de la spec", async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('section.hero');
    await expect(hero).toContainText(
      "J'écris du code côté développeur, je le casse côté attaquant.",
    );
    await expect(hero.locator('.lead')).not.toContainText(/\d/);
  });

  test('le CV se télécharge', async ({ request }) => {
    const res = await request.get('/cv.pdf');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('pdf');
  });
});
