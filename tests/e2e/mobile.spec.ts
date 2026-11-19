import { expect, test } from './fixtures.ts';

test.use({ viewport: { width: 360, height: 780 } });

// Aucun défilement horizontal de page à 360 px (le Gantt défile dans son propre bloc).
for (const path of [
  '/',
  '/projets',
  '/projets/ecosysteme-web-davincibot',
  '/parcours',
  '/competences',
  '/cv',
  '/ce-site',
  '/liens',
]) {
  test(`${path} ne déborde pas à 360 px`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('le menu mobile ouvre la navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'menu' }).click();
  await page.getByRole('link', { name: 'Parcours' }).click();
  await expect(page).toHaveURL(/\/parcours$/);
});

test('Échap ferme le menu mobile et rend le focus au bouton', async ({ page }) => {
  await page.goto('/');
  const burger = page.getByRole('button', { name: 'menu' });
  await expect(async () => {
    await burger.click();
    await expect(page.locator('#nav-links')).toBeVisible({ timeout: 500 });
  }).toPass();
  await page.keyboard.press('Escape');
  await expect(page.locator('#nav-links')).toBeHidden();
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
  await expect(burger).toBeFocused();
});

test("un clic hors de l'en-tête ferme le menu mobile, pas un clic dedans", async ({ page }) => {
  await page.goto('/');
  const burger = page.locator('button.burger');
  await expect(async () => {
    await burger.click();
    await expect(page.locator('#nav-links')).toBeVisible({ timeout: 500 });
  }).toPass();
  // Un clic dans le menu (hors lien) le laisse ouvert.
  await page.locator('#nav-links').click({ position: { x: 5, y: 5 } });
  await expect(page.locator('#nav-links')).toBeVisible();

  await page.mouse.click(180, 700);
  await expect(page.locator('#nav-links')).toBeHidden();
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
});
