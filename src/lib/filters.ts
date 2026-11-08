/** Lit les tags actifs depuis `?tag=a&tag=b` en ignorant les valeurs inconnues. */
export function readTags<T extends string>(params: URLSearchParams, known: readonly T[]): T[] {
  return params.getAll('tag').filter((t): t is T => (known as readonly string[]).includes(t));
}

/** Un projet passe le filtre s'il porte au moins un des tags actifs (aucun tag = tout). */
export function matches(projectTags: readonly string[], active: readonly string[]): boolean {
  return active.length === 0 || active.some((t) => projectTags.includes(t));
}

export function toggle<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
