import { error } from '@sveltejs/kit';
import { getProject, getProjects, getRoles } from '#lib/content/index.ts';
import { skillSlug } from '#lib/content/skills.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => getProjects().map((p) => ({ slug: p.slug }));

export const load: PageLoad = ({ params }) => {
  const project = getProject(params.slug);
  if (!project) error(404, 'Projet introuvable');

  const all = getProjects();
  const i = all.findIndex((p) => p.slug === project.slug);
  const roles = getRoles()
    .filter((r) => project.roles.includes(r.slug) || r.relatedProjects.includes(project.slug))
    .map((r) => ({ slug: r.slug, title: r.title, organization: r.organization, period: r.period }));

  return {
    project,
    stack: project.stack.map((name) => ({ name, slug: skillSlug(name) })),
    roles,
    prev: all[i - 1] ? { slug: all[i - 1]!.slug, title: all[i - 1]!.title } : undefined,
    next: all[i + 1] ? { slug: all[i + 1]!.slug, title: all[i + 1]!.title } : undefined,
  };
};
