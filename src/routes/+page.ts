import { getFeatured, getProjects, getRoles } from '#lib/content/index.ts';
import { maxOverlap } from '#lib/content/timeline.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  const upcoming = getRoles().find((r) => r.kind === 'stage');
  const roles = getRoles().map(({ Body: _b, ...r }) => r);
  return {
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
