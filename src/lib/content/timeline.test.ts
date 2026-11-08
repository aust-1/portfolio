import { describe, expect, it } from 'vitest';
import { layoutGantt, maxOverlap } from './timeline.ts';

const TODAY = new Date('2026-11-08');
type R = { slug: string; period: { start: string; end?: string } };
const r = (slug: string, start: string, end?: string): R => ({ slug, period: { start, end } });

describe('layoutGantt', () => {
  it('place deux rôles qui se chevauchent dans des couloirs différents', () => {
    const { bars } = layoutGantt(
      [r('a', '2025-01', '2025-12'), r('b', '2025-06', '2026-03')],
      TODAY,
    );
    const lanes = bars.map((b) => b.lane);
    expect(new Set(lanes).size).toBe(2);
  });

  it('réutilise un couloir quand le rôle précédent est terminé', () => {
    const { bars, laneCount } = layoutGantt(
      [r('a', '2024-09', '2025-06'), r('b', '2025-09', '2026-06')],
      TODAY,
    );
    expect(laneCount).toBe(1);
    expect(bars.every((b) => b.lane === 0)).toBe(true);
  });

  it("prolonge un rôle sans fin jusqu'à aujourd'hui", () => {
    const { bars, max } = layoutGantt([r('a', '2026-02')], TODAY);
    expect(bars[0]?.x1).toBe(1);
    expect(max.getTime()).toBeGreaterThanOrEqual(TODAY.getTime());
  });

  it("place un rôle à venir après aujourd'hui", () => {
    const { bars, todayX } = layoutGantt(
      [r('passe', '2024-01', '2025-01'), r('stage', '2027-04', '2027-09')],
      TODAY,
    );
    const stage = bars.find((b) => b.slug === 'stage')!;
    expect(stage.x0).toBeGreaterThan(todayX);
    expect(stage.future).toBe(true);
  });

  it("ne met jamais un rôle à venir dans le couloir d'un rôle en cours (son nom y est affiché)", () => {
    const { bars } = layoutGantt([r('chef', '2026-09'), r('stage', '2027-04', '2027-09')], TODAY);
    const lane = (s: string) => bars.find((b) => b.slug === s)?.lane;
    expect(lane('chef')).not.toBe(lane('stage'));
  });

  it('donne des positions entre 0 et 1', () => {
    const { bars } = layoutGantt(
      [r('a', '2023-09', '2028-06'), r('b', '2024-04', '2025-05'), r('c', '2026-09')],
      TODAY,
    );
    for (const b of bars) {
      expect(b.x0).toBeGreaterThanOrEqual(0);
      expect(b.x1).toBeLessThanOrEqual(1);
      expect(b.x1).toBeGreaterThan(b.x0);
    }
  });
});

describe('maxOverlap', () => {
  it('trouve le plus grand nombre de rôles simultanés et quand', () => {
    const result = maxOverlap(
      [r('a', '2025-01', '2025-12'), r('b', '2025-06', '2026-03'), r('c', '2025-09', '2025-10')],
      TODAY,
    );
    expect(result.count).toBe(3);
    expect(result.at).toBe('2025-09');
  });

  it('ignore les rôles à venir', () => {
    expect(maxOverlap([r('a', '2027-04', '2027-09')], TODAY).count).toBe(0);
  });
});
