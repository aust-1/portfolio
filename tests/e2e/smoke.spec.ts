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

  test('la barre de navigation reste en haut au défilement sans masquer les ancres', async ({
    page,
  }) => {
    await page.goto('/ce-site');
    const nav = page.locator('header.nav');
    await page.mouse.wheel(0, 3000);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
    await expect.poll(async () => (await nav.boundingBox())?.y).toBe(0);
    await expect(nav.getByRole('link', { name: 'Projets' })).toBeInViewport();

    // Une ancre de la table des matières s'arrête sous la barre, pas derrière.
    const link = page.locator('.toc a[href^="#"]').last();
    const target = page.locator((await link.getAttribute('href')) ?? '');
    await link.click();
    const navBottom = async () => {
      const box = await nav.boundingBox();
      return (box?.y ?? 0) + (box?.height ?? 0);
    };
    await expect
      .poll(async () => ((await target.boundingBox())?.y ?? 0) - (await navBottom()))
      .toBeGreaterThanOrEqual(0);
  });

  test('le CV se télécharge', async ({ request }) => {
    const res = await request.get('/cv.pdf');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('pdf');
  });
});
