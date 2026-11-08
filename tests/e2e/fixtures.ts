import { test as base } from '@playwright/test';

// Tests hermétiques : le script d'analytics tiers (Rybbit) est bloqué, ses erreurs ne sont pas
// celles du site et il ne doit pas dépendre du réseau.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('https://analytics.eliott-roussille.fr/**', (route) => route.abort());
    await use(page);
  },
});

export { expect } from '@playwright/test';
