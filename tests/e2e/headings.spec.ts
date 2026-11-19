import type { Locator } from '@playwright/test';
import { expect, test } from './fixtures.ts';

// Les lecteurs d'écran naviguent de titre en titre : un seul h1, et jamais de niveau sauté.
async function levels(root: Locator) {
  return root.evaluate((el) =>
    [...el.querySelectorAll('h1, h2, h3, h4, h5, h6')]
      .filter((h) => h.getClientRects().length > 0 || h.closest('dialog') === null)
      .map((h) => ({ level: Number(h.tagName[1]), text: h.textContent?.trim() ?? '' })),
  );
}

function skipped(list: { level: number; text: string }[], start = 0) {
  let previous = start;
  const jumps: string[] = [];
  for (const h of list) {
    if (h.level > previous + 1) jumps.push(`h${previous} → h${h.level} « ${h.text} »`);
    previous = h.level;
  }
  return jumps;
}

for (const path of ['/', '/parcours/bouygues-stage-pentest', '/competences', '/projets', '/cv']) {
  test(`${path} : un seul h1 et aucun niveau de titre sauté`, async ({ page }) => {
    await page.goto(path);
    const list = await levels(page.locator('main'));
    expect(list.filter((h) => h.level === 1)).toHaveLength(1);
    expect(skipped(list)).toEqual([]);
  });
}

test("sur l'accueil, les familles de compétences sont sous la section Compétences", async ({
  page,
}) => {
  await page.goto('/');
  const skills = page.locator('.field');
  for (const name of ['domaines', 'langages', 'outils et méthodes']) {
    await expect(
      skills.getByRole('heading', { name: new RegExp(`^${name}`), level: 3 }),
    ).toHaveCount(1);
  }
});

test('dans la modale de /parcours, les sous-titres suivent le h2 du rôle', async ({ page }) => {
  await page.goto('/parcours');
  await page.locator('.bars a[href="/parcours/davincibot-responsable-numerique"]').click();
  const dialog = page.locator('dialog[open]');
  await expect(dialog.locator('h2')).toHaveText('Responsable numérique');
  const list = await levels(dialog);
  expect(skipped(list, 1)).toEqual([]);
  expect(list.some((h) => h.level === 3)).toBe(true);
});
