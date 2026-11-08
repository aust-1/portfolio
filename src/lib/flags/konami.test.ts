import { describe, expect, it } from 'vitest';
import { KONAMI, konamiTracker } from './konami.ts';

describe('konami', () => {
  it('se déclenche à la fin de la séquence exacte', () => {
    const push = konamiTracker();
    const results = KONAMI.map((k) => push(k));
    expect(results.slice(0, -1).every((r) => !r)).toBe(true);
    expect(results.at(-1)).toBe(true);
  });

  it('accepte B et A en majuscules', () => {
    const push = konamiTracker();
    const seq = [...KONAMI.slice(0, -2), 'B', 'A'];
    expect(seq.map((k) => push(k)).at(-1)).toBe(true);
  });

  it('repart de zéro après une erreur, sans exiger de pause', () => {
    const push = konamiTracker();
    push('ArrowUp');
    push('x');
    expect([...KONAMI].map((k) => push(k)).at(-1)).toBe(true);
  });

  it('tolère une touche Haut en trop au début', () => {
    const push = konamiTracker();
    push('ArrowUp');
    expect([...KONAMI].map((k) => push(k)).at(-1)).toBe(true);
  });
});
