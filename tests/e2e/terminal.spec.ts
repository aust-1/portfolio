import type { Page } from '@playwright/test';
import { expect, test } from './fixtures.ts';

// Le raccourci n'existe qu'après l'hydratation : on réessaie jusqu'à ce que le terminal s'ouvre.
async function openTerminal(page: Page) {
  await expect(async () => {
    if (!(await page.locator('#term-input').count())) await page.keyboard.press('Control+k');
    await expect(page.locator('#term-input')).toBeVisible({ timeout: 500 });
  }).toPass();
}

async function run(page: Page, command: string) {
  await page.locator('#term-input').fill(command);
  await page.locator('#term-input').press('Enter');
}

test.describe('terminal et flags', () => {
  test('Ctrl+K ouvre le terminal, help répond, Échap ferme', async ({ page }) => {
    await page.goto('/');
    await openTerminal(page);
    await expect(page.locator('#term-input')).toBeFocused();
    await run(page, 'help');
    await expect(page.locator('.screen')).toContainText('submit');
    await page.keyboard.press('Escape');
    await expect(page.locator('#term-input')).toHaveCount(0);
  });

  test('open navigue vers un projet', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('button', { name: /terminal/i })
      .first()
      .click();
    await run(page, 'open infra-davincibot');
    await expect(page).toHaveURL(/\/projets\/infra-davincibot$/);
  });

  test('le curseur reste dans le terminal quelle que soit la commande', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('button', { name: /terminal/i })
      .first()
      .click();
    const field = page.locator('#term-input');
    await expect(field).toBeFocused();
    // Uniquement le clavier : fill() et press() sur le champ le refocaliseraient d'eux-mêmes.
    for (const command of ['help', 'cd projets', 'open infra-davincibot', 'ls', 'clear']) {
      await page.keyboard.type(command);
      await page.keyboard.press('Enter');
      await expect(field).toBeFocused();
    }
    await expect(page).toHaveURL(/\/projets\/infra-davincibot$/);
    await page.locator('.term .screen').click();
    await expect(field).toBeFocused();
    await page.keyboard.type('pwd');
    await page.keyboard.press('Enter');
    await expect(page.locator('.screen')).toContainText('~');
  });

  test('un clic hors du terminal lui rend le focus de la page', async ({ page }) => {
    await page.goto('/');
    await openTerminal(page);
    await expect(page.locator('#term-input')).toBeFocused();
    await page.locator('main h1').first().click();
    await expect(page.locator('#term-input')).not.toBeFocused();
    await expect(page.locator('#term-input')).toBeVisible();
  });

  test('la commande cachée donne un flag que submit valide', async ({ page }) => {
    await page.goto('/');
    await openTerminal(page);
    await run(page, 'ls -a');
    await expect(page.locator('.screen')).toContainText('.backdoor');
    await run(page, './.backdoor');
    const flag = (await page.locator('.screen p.signal').last().textContent())?.trim() ?? '';
    expect(flag).toMatch(/^aust-1\{.+\}$/);
    await run(page, `submit ${flag}`);
    await expect(page.locator('.screen')).toContainText('flag validé ! 1/5');
    await run(page, 'submit aust-1{faux}');
    await expect(page.locator('.screen')).toContainText('flag invalide');
  });

  test('le code Konami révèle un flag', async ({ page }) => {
    await page.goto('/projets');
    const KONAMI = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];
    // L'écouteur n'existe qu'après l'hydratation (lente sur le runner CI) : on rejoue la séquence
    // jusqu'à ce qu'il réponde, comme le ferait quelqu'un qui recommence.
    await expect(async () => {
      for (const k of KONAMI) await page.keyboard.press(k);
      await expect(page.locator('.reveal .flag')).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15_000 });
    await expect(page.locator('.reveal .flag')).toHaveText(/^aust-1\{.+\}$/);
  });

  test("/admin n'envoie jamais les identifiants et révèle un flag", async ({ page }) => {
    await page.goto('/admin');
    // Même une soumission native (avant hydratation) n'emporterait rien : aucun champ nommé.
    await expect(page.locator('form [name]')).toHaveCount(0);
    const sent: string[] = [];
    page.on('request', (r) => {
      const leak = r.url().includes('hunter2') || (r.postData() ?? '').includes('hunter2');
      if (r.method() !== 'GET' || leak) sent.push(`${r.method()} ${r.url()}`);
    });
    // Rejoue la soumission tant que la page n'est pas hydratée (le flag n'apparaît qu'après).
    await expect(async () => {
      await page.locator('#u').fill('admin');
      await page.locator('#p').fill('hunter2');
      await page.getByRole('button', { name: 'Se connecter' }).click();
      await expect(page.locator('.flag')).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15_000 });
    await expect(page.locator('.flag')).toHaveText(/^aust-1\{.+\}$/);
    await expect(page.locator('#p')).toHaveValue('');
    expect(sent).toEqual([]);
  });

  test('tout fonctionne quand localStorage est bloqué', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('bloqué', 'SecurityError');
        },
      });
    });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/parcours');
    await page.getByRole('button', { name: /thème/ }).click();
    await page.getByRole('button', { name: 'liste' }).click();
    await openTerminal(page);
    await run(page, './.backdoor');
    const flag = (await page.locator('.screen p.signal').last().textContent())?.trim() ?? '';
    await run(page, `submit ${flag}`);
    await expect(page.locator('.screen')).toContainText('flag validé');
    expect(errors).toEqual([]);
  });
});
