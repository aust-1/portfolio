/** Fragment d'URL décodé, ou chaîne vide s'il est mal encodé : une URL forgée ne doit rien casser. */
export function readHash(hash: string): string {
  try {
    return decodeURIComponent(hash.replace(/^#/, ''));
  } catch {
    return '';
  }
}
