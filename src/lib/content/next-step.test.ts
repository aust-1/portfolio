import { describe, expect, it } from 'vitest';
import { nextStep } from './next-step.ts';

const stage = {
  slug: 'bouygues-stage-pentest',
  kind: 'stage' as const,
  title: 'Stage pentest et sécurité applicative',
  period: { start: '2027-04', end: '2027-09' },
};

describe('nextStep (étiquette du hero)', () => {
  it("annonce le stage tant qu'il est à venir", () => {
    expect(nextStep([stage], new Date('2026-11-08'))).toEqual({
      label: 'Stage pentest · avr. 2027',
      href: '/parcours/bouygues-stage-pentest',
    });
  });

  it('disparaît une fois le stage commencé', () => {
    expect(nextStep([stage], new Date('2027-05-02'))).toBeUndefined();
  });

  it("n'affiche rien sans stage", () => {
    expect(nextStep([], new Date('2026-11-08'))).toBeUndefined();
  });
});
