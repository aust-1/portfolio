import { getFeatured, getProjects, getRoles } from '#lib/content/index.ts';
import { deriveSkills } from '#lib/content/skills.ts';
import { maxOverlap } from '#lib/content/timeline.ts';
import github from '#lib/data/github.json';
import type { GithubStats } from '#lib/github/normalize.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  const upcoming = getRoles().find((r) => r.kind === 'stage');
  const roles = getRoles().map(({ Body: _b, ...r }) => r);
  const skills = deriveSkills(getProjects());
  // Aperçu : les compétences portées par plusieurs projets, puis les domaines.
  const preview = skills.filter((s) => s.weight > 1 || s.family === 'domaine').slice(0, 24);
  return {
    github: github as GithubStats,
    skills: preview,
    skillCount: skills.length,
    titles: Object.fromEntries(getProjects().map((p) => [p.slug, p.title])) as Record<
      string,
      string
    >,
    roles,
    peak: maxOverlap(
      roles.filter((r) => r.kind !== 'formation'),
      new Date(),
    ).count,
    featured: getFeatured().map(({ Body: _b, ...p }) => p),
    total: getProjects().length,
    nextStep: upcoming
      ? { label: `Stage pentest · avril 2027`, href: `/parcours/${upcoming.slug}` }
      : undefined,
  };
};
