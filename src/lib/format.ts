import type { Period } from './content/schema.ts';
import { statusOf } from './content/validate.ts';

// Abréviations fixes : on ne dépend pas de l'ICU du serveur de build.
const MONTHS = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
];

export function formatMonth(month: string): string {
  const [y, m] = month.split('-');
  return `${MONTHS[Number(m) - 1] ?? m} ${y}`;
}

export function formatPeriod(period: Period): string {
  return `${formatMonth(period.start)} → ${period.end ? formatMonth(period.end) : "aujourd'hui"}`;
}

const STATUS_LABEL = { 'en-cours': 'en cours', termine: 'terminé', 'a-venir': 'à venir' } as const;

export function formatStatus(period: Period, today: Date): string {
  return STATUS_LABEL[statusOf(period, today)];
}

/** Année seule, pour les cartes : « 2024 → », « 2025 », « 2025 → 2026 ». */
export function formatYears(period: Period): string {
  const a = period.start.slice(0, 4);
  if (!period.end) return `${a} →`;
  const b = period.end.slice(0, 4);
  return a === b ? a : `${a} → ${b}`;
}
