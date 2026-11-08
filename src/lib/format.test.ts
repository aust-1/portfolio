import { describe, expect, it } from 'vitest';
import { formatMonth, formatPeriod, formatStatus } from './format.ts';

const TODAY = new Date('2026-11-08');

describe('format', () => {
  it('écrit un mois en français abrégé', () => {
    expect(formatMonth('2024-09')).toBe('sept. 2024');
    expect(formatMonth('2025-05')).toBe('mai 2025');
    expect(formatMonth('2026-02')).toBe('févr. 2026');
  });

  it('écrit une période terminée', () => {
    expect(formatPeriod({ start: '2025-02', end: '2025-05' })).toBe('févr. 2025 → mai 2025');
  });

  it('écrit une période ouverte', () => {
    expect(formatPeriod({ start: '2024-09' })).toBe("sept. 2024 → aujourd'hui");
  });

  it('écrit un statut en mono, sans étiquette', () => {
    expect(formatStatus({ start: '2024-09' }, TODAY)).toBe('en cours');
    expect(formatStatus({ start: '2027-04', end: '2027-09' }, TODAY)).toBe('à venir');
    expect(formatStatus({ start: '2024-01', end: '2025-01' }, TODAY)).toBe('terminé');
  });
});
