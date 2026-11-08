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
