import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures.ts';

// Contrôles axe-core sur chaque page, dans les deux thèmes (charte p. 09 : tester en clair et en
// sombre, petit texte ≥ 4,5:1). La CI échoue sur toute violation grave ou critique.
const ROUTES = [
  '/',
  '/projets',
  '/projets/coupe-de-france-de-robotique',
  '/projets/dvctf-bug-bounty',
  '/parcours',
  '/parcours/bouygues-stage-pentest',
  '/competences',
  '/a-propos',
  '/cv',
  '/ce-site',
  '/liens',
  '/admin',
];
const THEMES = ['light', 'dark'] as const;
const BLOCKING = new Set(['serious', 'critical']);

// Thème forcé comme le ferait le bouton « thème » (clé lue par static/theme-init.js), et
// animations réduites : les pastilles qui tombent ne sont pas mesurées en plein fondu.
async function open(page: Page, path: string, theme: (typeof THEMES)[number]) {
  await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
  await page.addInitScript((t) => localStorage.setItem('er-theme', t), theme);
  await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
}

async function blockingViolations(page: Page, include?: string) {
  let builder = new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
    'wcag22aa',
    'best-practice',
  ]);
  if (include) builder = builder.include(include);
  // Le grand « 404 » de la page d'erreur est un filigrane décoratif (aria-hidden), volontairement
  // ton sur ton : le texte décoratif est exempté du contraste minimal (WCAG 1.4.3).
  builder = builder.exclude('.big[aria-hidden="true"]');
  const { violations } = await builder.analyze();
  return violations
    .filter((v) => BLOCKING.has(v.impact ?? ''))
    .map((v) => ({
      rule: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => `${n.target.join(' ')} : ${n.failureSummary ?? ''}`),
    }));
}

for (const theme of THEMES) {
  test.describe(`accessibilité, thème ${theme === 'light' ? 'clair' : 'sombre'}`, () => {
    for (const path of ROUTES) {
      test(`${path} sans violation grave`, async ({ page }) => {
        await open(page, path, theme);
        expect(await blockingViolations(page)).toEqual([]);
      });
    }

    test('la page 404 sans violation grave', async ({ page }) => {
      await open(page, '/nexiste-pas', theme);
      expect(await blockingViolations(page)).toEqual([]);
    });

    test('le terminal ouvert sans violation grave', async ({ page }) => {
      await open(page, '/', theme);
      await expect(async () => {
        if (!(await page.locator('#term-input').count())) await page.keyboard.press('Control+k');
        await expect(page.locator('#term-input')).toBeVisible({ timeout: 500 });
      }).toPass();
      await page.locator('#term-input').fill('help');
      await page.locator('#term-input').press('Enter');
      await expect(page.locator('.screen')).toContainText('submit');
      expect(await blockingViolations(page, '.term')).toEqual([]);
    });
  });
}
