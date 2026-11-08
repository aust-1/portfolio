import { getProjects } from '#lib/content/index.ts';
import { TAGS } from '#lib/content/schema.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  const projects = getProjects().map(({ Body: _b, ...p }) => p);
  // Seuls les tags réellement portés par un projet deviennent des filtres.
  const tags = TAGS.filter((t) => projects.some((p) => p.tags.includes(t)));
  return { projects, tags };
};
