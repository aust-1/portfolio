import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PGP_FINGERPRINT } from './site.ts';

// security.txt (RFC 9116) : ne promettre une clé que si elle est publiée, et ne jamais expirer.
describe('security.txt', () => {
  const txt = readFileSync('static/.well-known/security.txt', 'utf8');
  const field = (name: string) =>
    [...txt.matchAll(new RegExp(`^${name}:\\s*(.+)$`, 'gm'))].map((m) => m[1]!.trim());

  it("déclare un contact, une date d'expiration et son URL canonique", () => {
    expect(field('Contact')).not.toEqual([]);
    expect(field('Expires')).toHaveLength(1);
    expect(field('Canonical')).toEqual(['https://eliott-roussille.fr/.well-known/security.txt']);
  });

  // La CI tourne chaque nuit : ce test rappelle le renouvellement un mois avant l'échéance.
  it('expire dans plus de 30 jours (à renouveler sinon)', () => {
    const expires = new Date(field('Expires')[0]!);
    expect(Number.isNaN(expires.getTime())).toBe(false);
    const in30Days = Date.now() + 30 * 24 * 60 * 60 * 1000;
    expect(expires.getTime(), `Expires ${field('Expires')[0]} : à renouveler`).toBeGreaterThan(
      in30Days,
    );
  });

  if (PGP_FINGERPRINT) {
    it('renvoie vers une vraie clé publique OpenPGP', () => {
      expect(field('Encryption')).toEqual(['https://eliott-roussille.fr/pgp.asc']);
      expect(readFileSync('static/pgp.asc', 'utf8')).toMatch(
        /^-----BEGIN PGP PUBLIC KEY BLOCK-----$[\s\S]+^-----END PGP PUBLIC KEY BLOCK-----$/m,
      );
    });
  } else {
    it("ne promet aucun chiffrement tant que la clé n'est pas publiée", () => {
      expect(field('Encryption')).toEqual([]);
      expect(txt).not.toMatch(/chiffr/i);
    });
  }
});
