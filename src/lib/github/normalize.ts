import { z } from 'zod';

// Format de generated/portfolio.json publié par aust-1/github-stats : uniquement des agrégats
// publics. `strict()` refuse toute clé en plus (e-mails, vues…) au lieu de l'ignorer en silence.
const PortfolioJson = z
  .object({
    generatedAt: z.string(),
    contributions: z.object({
      commits: z.number().int().nonnegative(),
      prs: z.number().int().nonnegative(),
      issues: z.number().int().nonnegative(),
      reviews: z.number().int().nonnegative(),
      repos: z.number().int().nonnegative(),
    }),
    stars: z.number().int().nonnegative(),
    linesChanged: z.number().int().nonnegative(),
    repoCount: z.number().int().nonnegative(),
    languages: z.array(
      z.object({ name: z.string(), size: z.number().nonnegative(), color: z.string().nullable() }),
    ),
    repositories: z.array(z.object({ name: z.string(), stars: z.number().int() })),
  })
  .strict();

const Repo = z.object({
  name: z.string(),
  description: z.string().nullable(),
  html_url: z.string().url(),
  pushed_at: z.string(),
  language: z.string().nullable(),
  fork: z.boolean(),
});

export type GithubStats = {
  fetchedAt: string;
  source: 'live' | 'fallback';
  contributions: z.infer<typeof PortfolioJson>['contributions'];
  stars: number;
  linesChanged: number;
  repoCount: number;
  languages: { name: string; color: string; share: number }[];
  recent: {
    name: string;
    description: string | null;
    url: string;
    pushedAt: string;
    language: string | null;
  }[];
};

export function normalize(portfolioJson: unknown, repos: unknown, now: Date): GithubStats {
  const p = PortfolioJson.parse(portfolioJson);
  const list = z.array(Repo).parse(repos);

  const top = [...p.languages].sort((a, b) => b.size - a.size).slice(0, 6);
  const total = top.reduce((a, l) => a + l.size, 0) || 1;

  return {
    fetchedAt: now.toISOString(),
    source: 'live',
    contributions: p.contributions,
    stars: p.stars,
    linesChanged: p.linesChanged,
    repoCount: p.repoCount,
    languages: top.map((l) => ({
      name: l.name,
      color: l.color ?? '#888888',
      share: l.size / total,
    })),
    recent: list
      .filter((r) => !r.fork)
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        pushedAt: r.pushed_at,
        language: r.language,
      })),
  };
}
