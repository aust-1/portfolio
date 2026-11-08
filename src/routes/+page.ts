import { getFeatured, getProjects, getRoles } from '#lib/content/index.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  const upcoming = getRoles().find((r) => r.kind === 'stage');
  return {
    featured: getFeatured().map(({ Body: _b, ...p }) => p),
    total: getProjects().length,
    nextStep: upcoming
      ? { label: `Stage pentest · avril 2027`, href: `/parcours/${upcoming.slug}` }
      : undefined,
  };
};
