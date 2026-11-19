import type { Locator, Page } from '@playwright/test';
import { expect, test } from './fixtures.ts';

// Charte p. 04 et p. 09 : le grain couvre tout l'écran, y compris les surfaces posées au-dessus du
// grain global (body::after, z-index 50), qui portent donc le leur (.own-grain).
async function grain(el: Locator) {
  return el.evaluate((node) => {
    const after = getComputedStyle(node, '::after');
    const box = node.getBoundingClientRect();
    return {
      display: after.display,
      image: after.backgroundImage,
      covers: Math.abs(parseFloat(after.width) - box.width) < 1 && parseFloat(after.height) > 0,
    };
  });
}

async function expectGrain(el: Locator) {
  const g = await grain(el);
  expect(g.display).not.toBe('none');
  expect(g.image).toContain('grain.png');
  expect(g.covers).toBe(true);
}

async function openTerminal(page: Page) {
  await expect(async () => {
    if (!(await page.locator('#term-input').count())) await page.keyboard.press('Control+k');
    await expect(page.locator('#term-input')).toBeVisible({ timeout: 500 });
  }).toPass();
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`grain, thème ${theme === 'light' ? 'clair' : 'sombre'}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('er-theme', t), theme);
    });

    test('le terminal porte son grain', async ({ page }) => {
      await page.goto('/');
      await openTerminal(page);
      await expectGrain(page.locator('.term[role="dialog"]'));
    });

    test("la modale d'un rôle porte son grain", async ({ page }) => {
      await page.goto('/parcours');
      await page.locator('.bars a[href="/parcours/davincibot-responsable-numerique"]').click();
      await expect(page.locator('dialog[open]')).toBeVisible();
      await expectGrain(page.locator('dialog[open] .inner'));
    });

    test('le menu mobile porte son grain, pas la barre de liens sur grand écran', async ({
      page,
    }) => {
      await page.goto('/');
      expect((await grain(page.locator('#nav-links'))).display).toBe('none');

      await page.setViewportSize({ width: 360, height: 780 });
      await page.getByRole('button', { name: 'menu' }).click();
      await expect(page.locator('#nav-links')).toBeVisible();
      await expectGrain(page.locator('#nav-links'));
    });
  });
}

test('la révélation Konami porte son grain', async ({ page }) => {
  await page.goto('/projets');
  const keys = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  keys.push('ArrowLeft', 'ArrowRight', 'b', 'a');
  await expect(async () => {
    for (const k of keys) await page.keyboard.press(k);
    await expect(page.locator('.reveal')).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15_000 });
  await expectGrain(page.locator('.reveal'));
});
