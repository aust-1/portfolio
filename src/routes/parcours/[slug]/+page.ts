import { error } from '@sveltejs/kit';
import { getProjects, getRole, getRoles } from '#lib/content/index.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => getRoles().map((r) => ({ slug: r.slug }));

export const load: PageLoad = ({ params }) => {
  const role = getRole(params.slug);
  if (!role) error(404, 'Rôle introuvable');
  const projects = getProjects()
    .filter((p) => role.relatedProjects.includes(p.slug) || p.roles.includes(role.slug))
    .map((p) => ({ slug: p.slug, title: p.title, summary: p.summary }));
  return { role, projects };
};
