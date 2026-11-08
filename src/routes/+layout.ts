import { getProjects, getRoles } from '#lib/content/index.ts';
import { deriveSkills } from '#lib/content/skills.ts';
import type { LayoutLoad } from './$types';

export const prerender = true;
export const trailingSlash = 'never';

// Index léger pour le terminal, disponible sur toutes les pages.
export const load: LayoutLoad = () => {
  const projects = getProjects();
  return {
    terminal: {
      projects: projects.map((p) => ({ slug: p.slug, title: p.title, summary: p.summary })),
      roles: getRoles().map((r) => ({
        slug: r.slug,
        title: r.title,
        organization: r.organization,
      })),
      skills: deriveSkills(projects).map((s) => s.name),
    },
  };
};
