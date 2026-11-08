// Stats GitHub, récupérées au build (jamais dans le navigateur, jamais avec un token).
// - agrégats : generated/portfolio.json publié chaque nuit par aust-1/github-stats (qui, lui seul,
//   détient un token) ;
// - dépôts récents : API REST publique, sans authentification.
// En cas d'échec (réseau, format), le build continue avec l'instantané versionné.
// Usage : node scripts/github-stats.ts   (GITHUB_STATS=offline pour forcer l'instantané)
import { copyFileSync, writeFileSync } from 'node:fs';
import { normalize } from '../src/lib/github/normalize.ts';

const PORTFOLIO_JSON =
  'https://raw.githubusercontent.com/aust-1/github-stats/generated/generated/portfolio.json';
const REPOS = 'https://api.github.com/users/aust-1/repos?sort=pushed&per_page=12';
const OUT = new URL('../src/lib/data/github.json', import.meta.url);
const FALLBACK = new URL('../src/lib/data/github-fallback.json', import.meta.url);

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    headers: { Accept: 'application/json', 'User-Agent': 'eliott-roussille.fr-build' },
  });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

try {
  if (process.env.GITHUB_STATS === 'offline') throw new Error('mode hors ligne demandé');
  const [stats, repos] = await Promise.all([getJson(PORTFOLIO_JSON), getJson(REPOS)]);
  writeFileSync(OUT, JSON.stringify(normalize(stats, repos, new Date()), null, 2) + '\n');
  console.log('stats GitHub : données du jour');
} catch (e) {
  copyFileSync(FALLBACK, OUT);
  console.warn(
    `stats GitHub : instantané versionné utilisé (${e instanceof Error ? e.message : e})`,
  );
}
