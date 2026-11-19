// Génère static/og.png : image de partage Open Graph (1200 × 630), aux couleurs et polices de la
// charte (papier, bloc encre, orange, grain). Script ponctuel : le PNG produit est versionné.
// Usage : node scripts/make-og.ts   (Chromium de Playwright requis : pnpm exec playwright install chromium)
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from '@playwright/test';
import { OG_IMAGE } from '../src/lib/seo.ts';
import { SITE } from '../src/lib/site.ts';

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) =>
  `data:font/woff2;base64,${readFileSync(require.resolve(`${pkg}/files/${file}`)).toString('base64')}`;
const grain = `data:image/png;base64,${readFileSync(new URL('../static/grain.png', import.meta.url)).toString('base64')}`;

// Valeurs de src/lib/styles/tokens.css (thème clair).
const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8" /><style>
  @font-face { font-family: 'Inter Tight'; font-weight: 900; src: url(${font('@fontsource/inter-tight', 'inter-tight-latin-900-normal.woff2')}); }
  @font-face { font-family: 'Inter Tight'; font-weight: 700; src: url(${font('@fontsource/inter-tight', 'inter-tight-latin-700-normal.woff2')}); }
  @font-face { font-family: 'JetBrains Mono'; font-weight: 500; src: url(${font('@fontsource/jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff2')}); }
  @font-face { font-family: 'JetBrains Mono'; font-weight: 800; src: url(${font('@fontsource/jetbrains-mono', 'jetbrains-mono-latin-800-normal.woff2')}); }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${OG_IMAGE.width}px; height: ${OG_IMAGE.height}px; }
  body { background: #e7e5df; color: #0b0c0e; position: relative; overflow: hidden; }
  body::after { content: ''; position: absolute; inset: 0; background: url(${grain}) repeat;
    background-size: 256px 256px; opacity: 0.22; mix-blend-mode: multiply; }
  .top { position: absolute; left: 72px; right: 72px; top: 56px; display: flex;
    justify-content: space-between; align-items: baseline; font: 500 22px/1 'JetBrains Mono'; color: #4a4d55; }
  .mono { font: 800 40px/1 'JetBrains Mono'; color: #0b0c0e; }
  .u { color: #ff5a1f; }
  h1 { position: absolute; left: 66px; top: 128px; font: 900 150px/0.84 'Inter Tight';
    letter-spacing: -0.06em; }
  .block { position: absolute; left: 72px; right: 72px; bottom: 64px; background: #0b0c0e;
    color: #e7e5df; padding: 34px 40px; display: flex; justify-content: space-between; align-items: end; gap: 40px; }
  .hook { font: 700 38px/1.08 'Inter Tight'; letter-spacing: -0.03em; max-width: 22ch; }
  .url { font: 500 22px/1 'JetBrains Mono'; color: #ff8a57; white-space: nowrap; }
</style></head><body>
  <div class="top"><span class="mono">ER<span class="u">_</span></span><span>${SITE.subtitle}</span></div>
  <h1>Eliott<br />Roussille<span class="u">_</span></h1>
  <div class="block"><p class="hook">${SITE.hook}</p><p class="url">eliott-roussille.fr</p></div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: OG_IMAGE.width, height: OG_IMAGE.height },
});
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: new URL('../static/og.png', import.meta.url).pathname });
await browser.close();
console.log('static/og.png généré');
