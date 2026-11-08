import { test as base } from '@playwright/test';

// E2E_CPU_THROTTLE=6 pnpm e2e : ralentit le processeur comme sur un runner CI chargé, pour
// reproduire en local les courses entre les actions du test et l'hydratation.
const THROTTLE = Number(process.env.E2E_CPU_THROTTLE ?? 0);

export const test = base.extend({
  page: async ({ page }, use) => {
    // Tests hermétiques : le script d'analytics tiers (Rybbit) est bloqué, ses erreurs ne sont
    // pas celles du site et il ne doit pas dépendre du réseau.
    await page.route('https://analytics.eliott-roussille.fr/**', (route) => route.abort());
    if (THROTTLE > 1) {
      const cdp = await page.context().newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: THROTTLE });
    }
    await use(page);
  },
});

export { expect } from '@playwright/test';
