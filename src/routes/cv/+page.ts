import { getAwards, getProjects, getRoles } from '#lib/content/index.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  const roles = getRoles().map(({ Body: _b, ...r }) => r);
  return {
    experiences: roles.filter((r) => r.kind !== 'formation'),
    formations: roles.filter((r) => r.kind === 'formation'),
    projects: getProjects().map(({ Body: _b, ...p }) => p),
    awards: getAwards(),
  };
};
