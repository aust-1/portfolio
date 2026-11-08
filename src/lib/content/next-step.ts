import { formatMonth } from '#lib/format.ts';
import { statusOf } from './validate.ts';

type Dated = { slug: string; kind: string; period: { start: string; end?: string } };

/** Étiquette « prochaine étape » du hero : le stage à venir, et rien une fois qu'il a commencé. */
export function nextStep(roles: Dated[], today: Date): { label: string; href: string } | undefined {
  const stage = roles.find((r) => r.kind === 'stage' && statusOf(r.period, today) === 'a-venir');
  if (!stage) return undefined;
  return {
    label: `Stage pentest · ${formatMonth(stage.period.start)}`,
    href: `/parcours/${stage.slug}`,
  };
}
