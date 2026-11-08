import { expect, test } from './fixtures.ts';

test.describe('parcours', () => {
  test('accès direct à un rôle : page complète, pas une modale vide', async ({ page }) => {
    await page.goto('/parcours/davincibot-responsable-numerique');
    await expect(page.locator('h1')).toHaveText('Responsable numérique');
    await expect(page.locator('dialog[open]')).toHaveCount(0);
  });

  test('un clic ouvre la modale avec une URL propre, Échap la ferme', async ({ page }) => {
    await page.goto('/parcours');
    await page.locator('.bars a[href="/parcours/davincibot-responsable-numerique"]').click();
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('h2')).toHaveText('Responsable numérique');
    await expect(page).toHaveURL(/\/parcours\/davincibot-responsable-numerique$/);
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await expect(page).toHaveURL(/\/parcours$/);
  });

  test('la vue liste est mémorisée', async ({ page }) => {
    await page.goto('/parcours');
    await page.getByRole('button', { name: 'liste' }).click();
    await page.reload();
    await expect(page.getByRole('button', { name: 'liste' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});

test.describe('projets', () => {
  test("le filtre par tag vit dans l'URL et se recharge", async ({ page }) => {
    await page.goto('/projets?tag=robotique');
    await expect(page.locator('.grid > li')).toHaveCount(1);
    await page.getByRole('button', { name: 'tout' }).click();
    await expect(page).toHaveURL(/\/projets$/);
  });
});
