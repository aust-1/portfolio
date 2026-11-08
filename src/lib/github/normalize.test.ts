import { describe, expect, it } from 'vitest';
import fixture from './fixture-portfolio.json';
import { normalize } from './normalize.ts';

const NOW = new Date('2026-11-08T05:30:00Z');

const portfolio = {
  generatedAt: '2026-11-08T04:40:00Z',
  contributions: { commits: 1200, prs: 80, issues: 20, reviews: 40, repos: 30 },
  stars: 12,
  linesChanged: 345678,
  repoCount: 42,
  languages: [
    { name: 'TypeScript', size: 500, color: '#3178c6' },
    { name: 'Python', size: 300, color: '#3572A5' },
    { name: 'C++', size: 100, color: '#f34b7d' },
    { name: 'C#', size: 50, color: '#178600' },
    { name: 'Kotlin', size: 30, color: '#A97BFF' },
    { name: 'Shell', size: 10, color: '#89e051' },
    { name: 'Zig', size: 5, color: '#ec915c' },
  ],
  repositories: [{ name: 'aust-1/portfolio', stars: 1 }],
};

const repos = [
  {
    name: 'portfolio',
    description: 'Site',
    html_url: 'https://github.com/aust-1/portfolio',
    pushed_at: '2026-11-08T10:00:00Z',
    language: 'Svelte',
    fork: false,
  },
  {
    name: 'caddy-plugin',
    description: null,
    html_url: 'https://github.com/aust-1/caddy-plugin',
    pushed_at: '2026-11-07T10:00:00Z',
    language: 'Kotlin',
    fork: true,
  },
  {
    name: 'bourse-tracker',
    description: 'PEA',
    html_url: 'https://github.com/aust-1/bourse-tracker',
    pushed_at: '2026-11-06T10:00:00Z',
    language: 'TypeScript',
    fork: false,
  },
];

describe('normalize', () => {
  it('garde les agrégats publics', () => {
    const s = normalize(portfolio, repos, NOW);
    expect(s.contributions.commits).toBe(1200);
    expect(s.repoCount).toBe(42);
    expect(s.source).toBe('live');
    expect(s.fetchedAt).toBe(NOW.toISOString());
  });

  it('garde les 6 premiers langages, triés, avec leur part', () => {
    const s = normalize(portfolio, repos, NOW);
    expect(s.languages.map((l) => l.name)).toEqual([
      'TypeScript',
      'Python',
      'C++',
      'C#',
      'Kotlin',
      'Shell',
    ]);
    const total = s.languages.reduce((a, l) => a + l.share, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  it('exclut les forks des dépôts récents', () => {
    const s = normalize(portfolio, repos, NOW);
    expect(s.recent.map((r) => r.name)).toEqual(['portfolio', 'bourse-tracker']);
  });

  it('lève sur un JSON qui ne respecte pas le format (le script bascule sur le repli)', () => {
    expect(() => normalize({ nope: true }, repos, NOW)).toThrow();
    expect(() => normalize(portfolio, 'pas un tableau', NOW)).toThrow();
  });

  it('refuse un JSON qui exposerait e-mails ou vues', () => {
    expect(() => normalize({ ...portfolio, emails: ['x@y.z'] }, repos, NOW)).toThrow();
  });

  it('accepte la sortie réelle du filtre jq de aust-1/github-stats (contrat)', () => {
    // fixture-portfolio.json : produit par l'étape « Export portfolio.json » sur un faux dump.
    const s = normalize(fixture, repos, NOW);
    expect(s.languages[0]?.name).toBe('TypeScript');
    expect(s.languages.every((l) => l.color.startsWith('#'))).toBe(true);
  });
});
