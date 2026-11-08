import { describe, expect, it } from 'vitest';
import { getFeatured, getProject, getProjects, getRoles } from './index.ts';

// Charge le vrai contenu de content/ : si un fichier est invalide, l'import lève et ce test échoue.
describe('contenu réel', () => {
  it('charge les projets et les rôles', () => {
    expect(getProjects().length).toBeGreaterThanOrEqual(9);
    expect(getRoles().length).toBeGreaterThanOrEqual(15);
  });

  it("met en avant les 4 projets vedettes de la spec, dans l'ordre", () => {
    expect(getFeatured().map((p) => p.slug)).toEqual([
      'coupe-de-france-de-robotique',
      'dvctf-bug-bounty',
      'ecosysteme-web-davincibot',
      'infra-davincibot',
    ]);
  });

  it("n'affiche jamais l'hexapode", () => {
    const all = JSON.stringify([...getProjects(), ...getRoles()]).toLowerCase();
    expect(all).not.toContain('hexapode');
  });

  it('affiche le classement CDR 2025 et aucun pour 2026', () => {
    const cdr = getProject('coupe-de-france-de-robotique');
    expect(cdr?.awards).toEqual(['36e sur 188 équipes à la Coupe de France 2025']);
  });
});
