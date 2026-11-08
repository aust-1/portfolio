import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SECURITY_HEADERS } from './security-headers.ts';

// /ce-site annonce des en-têtes : ils doivent être réellement posés par le Caddy interne.
describe('en-têtes de sécurité', () => {
  const caddyfile = readFileSync('infra/Caddyfile.site', 'utf8');

  it.each(SECURITY_HEADERS.map((h) => h.name))('%s est posé par infra/Caddyfile.site', (name) => {
    expect(caddyfile).toMatch(new RegExp(`^\\s*${name}\\s`, 'm'));
  });

  it("pose l'en-tête X-Flag depuis l'environnement, jamais en dur", () => {
    expect(caddyfile).toMatch(/^\s*X-Flag\s+"\{\$X_FLAG\}"/m);
  });

  it('masque la signature du serveur', () => {
    expect(caddyfile).toMatch(/^\s*-Server\s*$/m);
  });
});
