import { monthEnd, monthStart } from './validate.ts';

type Dated = { slug: string; period: { start: string; end?: string } };

export type Bar = {
  slug: string;
  lane: number;
  /** Position horizontale, fraction 0-1 de l'axe. */
  x0: number;
  x1: number;
  /** Rôle pas encore commencé (« à venir »). */
  future: boolean;
  /** Rôle sans date de fin, prolongé jusqu'à aujourd'hui. */
  open: boolean;
};

export type GanttLayout = {
  bars: Bar[];
  laneCount: number;
  min: Date;
  max: Date;
  todayX: number;
  /** Années à graduer sur l'axe, avec leur position. */
  years: { year: number; x: number }[];
};

function endOf(item: Dated, today: Date): Date {
  return item.period.end ? monthEnd(item.period.end) : today;
}

/**
 * Vue « parallèle » façon Gantt : chaque rôle prend le premier couloir libre (algorithme glouton
 * par date de début), ce qui rend visibles les chevauchements, donc le cumul des engagements.
 */
export function layoutGantt(items: Dated[], today: Date): GanttLayout {
  const sorted = [...items].sort(
    (a, b) =>
      monthStart(a.period.start).getTime() - monthStart(b.period.start).getTime() ||
      endOf(b, today).getTime() - endOf(a, today).getTime(),
  );

  const min = new Date(Math.min(...sorted.map((i) => monthStart(i.period.start).getTime())));
  const max = new Date(Math.max(today.getTime(), ...sorted.map((i) => endOf(i, today).getTime())));
  const span = max.getTime() - min.getTime() || 1;
  const x = (d: Date) => Math.min(1, Math.max(0, (d.getTime() - min.getTime()) / span));

  const laneEnds: number[] = [];
  const bars = sorted.map((item) => {
    const start = monthStart(item.period.start);
    const end = endOf(item, today);
    let lane = laneEnds.findIndex((e) => e <= start.getTime());
    if (lane === -1) lane = laneEnds.push(0) - 1;
    // Un rôle en cours garde son couloir : son nom s'affiche à droite de la barre.
    laneEnds[lane] = item.period.end ? end.getTime() : Infinity;
    return {
      slug: item.slug,
      lane,
      x0: x(start),
      x1: x(end),
      future: start > today,
      open: !item.period.end,
    };
  });

  const years: { year: number; x: number }[] = [];
  for (let y = min.getUTCFullYear() + 1; y <= max.getUTCFullYear(); y++) {
    years.push({ year: y, x: x(new Date(Date.UTC(y, 0, 1))) });
  }

  return { bars, laneCount: laneEnds.length, min, max, todayX: x(today), years };
}

/** Plus grand nombre de rôles menés en même temps (rôles à venir exclus), et le premier mois où il est atteint. */
export function maxOverlap(items: Dated[], today: Date): { count: number; at?: string } {
  const past = items.filter((i) => monthStart(i.period.start) <= today);
  if (past.length === 0) return { count: 0 };

  const first = new Date(Math.min(...past.map((i) => monthStart(i.period.start).getTime())));
  let best = { count: 0, at: undefined as string | undefined };
  for (
    let d = first;
    d <= today;
    d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))
  ) {
    const count = past.filter((i) => monthStart(i.period.start) <= d && d < endOf(i, today)).length;
    if (count > best.count) {
      const month = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
      best = { count, at: month };
    }
  }
  return best;
}
