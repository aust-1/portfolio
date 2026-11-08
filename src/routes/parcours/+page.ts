import { getAwards, getProjects, getRoles } from '#lib/content/index.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  const projects = getProjects();
  const roles = getRoles();
  const related = Object.fromEntries(
    roles.map((r) => [
      r.slug,
      projects
        .filter((p) => r.relatedProjects.includes(p.slug) || p.roles.includes(r.slug))
        .map((p) => ({ slug: p.slug, title: p.title, summary: p.summary })),
    ]),
  );
  return { roles, related, awards: getAwards() };
};
