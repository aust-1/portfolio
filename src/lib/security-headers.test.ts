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

  // handle_errors repart d'une réponse vierge : sans import, une 404 sortirait sans en-têtes.
  it("pose les mêmes en-têtes sur le site et sur chaque réponse d'erreur", () => {
    const snippet = /^\(securite\) \{\n([\s\S]*?)^\}/m.exec(caddyfile)?.[1] ?? '';
    for (const { name } of SECURITY_HEADERS)
      expect(snippet).toMatch(new RegExp(`^\\s*${name}\\s`, 'm'));
    expect(snippet).toMatch(/^\s*-Server\s*$/m);

    const site = /^:8080 \{\n([\s\S]*?)^\}/m.exec(caddyfile)?.[1] ?? '';
    expect(site).toMatch(/^\timport securite$/m);
    const errorBlocks = [...site.matchAll(/^\thandle_errors[^\n]*\{\n([\s\S]*?)^\t\}/gm)];
    expect(errorBlocks.length).toBeGreaterThan(0);
    for (const [, body] of errorBlocks) expect(body).toMatch(/^\t\timport securite$/m);
  });
});
