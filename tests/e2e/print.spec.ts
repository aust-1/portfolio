import { expect, test } from './fixtures.ts';

// Impression de /cv (feuille @media print) : seulement le CV, en couleurs claires, liens lisibles.
for (const theme of ['light', 'dark'] as const) {
  test(`/cv s'imprime sans navigation, pied de page ni grain (thème ${theme})`, async ({
    page,
  }) => {
    await page.addInitScript((t) => localStorage.setItem('er-theme', t), theme);
    await page.goto('/cv');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await page.emulateMedia({ media: 'print' });

    await expect(page.locator('header.nav')).toBeHidden();
    await expect(page.locator('footer.footer')).toBeHidden();
    await expect(page.locator('.skip')).toBeHidden();
    expect(await page.evaluate(() => getComputedStyle(document.body, '::after').display)).toBe(
      'none',
    );

    // Texte du thème clair (#2e3138) même si le thème sombre est actif à l'écran.
    const color = await page.evaluate(() => getComputedStyle(document.body).color);
    expect(color).toBe('rgb(46, 49, 56)');

    // Adresse des projets imprimée après leur nom.
    const after = await page
      .locator('.projects a[href^="/projets/"]')
      .first()
      .evaluate((a) => getComputedStyle(a, '::after').content);
    expect(after).toMatch(/\(eliott-roussille\.fr\/projets\/[a-z0-9-]+\)/);

    const pdf = await page.pdf({ format: 'A4' });
    expect(pdf.subarray(0, 4).toString()).toBe('%PDF');
  });
}
