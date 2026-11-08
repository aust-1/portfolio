import { getProjects } from '#lib/content/index.ts';
import { deriveSkills } from '#lib/content/skills.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  const projects = getProjects();
  return {
    skills: deriveSkills(projects),
    titles: Object.fromEntries(projects.map((p) => [p.slug, p.title])) as Record<string, string>,
  };
};
