import { AwardSchema, type Award } from './schema.ts';

// Distinctions et certifications (spec §7). Classements CTF et prix de hackathon viendront ici.
export const AWARDS: Award[] = AwardSchema.array().parse([
  {
    title: 'TOEFL iBT',
    issuer: 'ETS',
    date: '2026-05',
    kind: 'certification',
    detail: 'niveau B2+',
  },
  {
    title: 'Design Thinker',
    issuer: 'dthinking academy, Pôle Léonard de Vinci',
    date: '2024-11',
    kind: 'certification',
  },
]);
