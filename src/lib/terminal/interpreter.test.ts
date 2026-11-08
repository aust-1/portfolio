import { describe, expect, it, vi } from 'vitest';
import { complete, MAX_INPUT, run, type TermContext } from './interpreter.ts';

function ctx(over: Partial<TermContext> = {}): TermContext {
  return {
    cwd: '~',
    projects: [
      { slug: 'dvctf-bug-bounty', title: 'DVCTF x bug bounty', summary: 'CTF et bug bounty.' },
      { slug: 'infra-davincibot', title: 'Infra DaVinciBot', summary: 'Infra.' },
    ],
    roles: [{ slug: 'cdr-chef-de-projet', title: 'Chef de projet', organization: 'DaVinciBot' }],
    skills: ['Python', 'Docker'],
    submit: vi.fn(async () => ({ ok: true, already: false, found: 1, total: 5 })),
    backdoor: () => 'secret',
    ...over,
  };
}

const text = (o: { lines: { text: string }[] }) => o.lines.map((l) => l.text).join('\n');

describe('terminal', () => {
  it('help liste les commandes, dont submit', async () => {
    const out = await run('help', ctx());
    expect(text(out)).toContain('submit');
    expect(text(out)).toContain('open');
  });

  it('open navigue vers la page du projet', async () => {
    expect((await run('open dvctf-bug-bounty', ctx())).navigate).toBe('/projets/dvctf-bug-bounty');
  });

  it('open accepte un rôle et une page du site', async () => {
    expect((await run('open cdr-chef-de-projet', ctx())).navigate).toBe(
      '/parcours/cdr-chef-de-projet',
    );
    expect((await run('open liens', ctx())).navigate).toBe('/liens');
  });

  it('open signale un projet inconnu', async () => {
    const out = await run('open nimporte-quoi', ctx());
    expect(out.navigate).toBeUndefined();
    expect(out.lines[0]?.tone).toBe('error');
  });

  it('ls cache les fichiers cachés, ls -a les montre', async () => {
    expect(text(await run('ls', ctx()))).not.toContain('.backdoor');
    expect(text(await run('ls -a', ctx()))).toContain('.backdoor');
  });

  it('la commande cachée révèle son secret', async () => {
    expect(text(await run('./.backdoor', ctx()))).toContain('secret');
  });

  it('cd puis ls liste les projets', async () => {
    const c = ctx();
    const moved = await run('cd projets', c);
    expect(moved.cwd).toBe('~/projets');
    expect(text(await run('ls', { ...c, cwd: moved.cwd! }))).toContain('dvctf-bug-bounty');
  });

  it('cd vers un dossier inexistant échoue proprement', async () => {
    const out = await run('cd /etc', ctx());
    expect(out.cwd).toBeUndefined();
    expect(out.lines[0]?.tone).toBe('error');
  });

  it('cat ../../etc/passwd répond en mode jeu, sans erreur', async () => {
    const out = await run('cat ../../etc/passwd', ctx());
    expect(text(out)).toMatch(/root/);
  });

  it('submit transmet le flag et affiche le compteur', async () => {
    const c = ctx();
    const out = await run('submit aust-1{test}', c);
    expect(c.submit).toHaveBeenCalledWith('aust-1{test}');
    expect(text(out)).toContain('1/5');
  });

  it('submit sans argument explique le format', async () => {
    expect(text(await run('submit', ctx()))).toContain('aust-1{');
  });

  it('rend le HTML comme du texte brut', async () => {
    const out = await run('echo <img src=x onerror=alert(1)>', ctx());
    expect(out.lines[0]?.text).toBe('<img src=x onerror=alert(1)>');
  });

  it('tronque une entrée démesurée', async () => {
    const out = await run('echo ' + 'a'.repeat(10_000), ctx());
    expect(out.lines[0]!.text.length).toBeLessThanOrEqual(MAX_INPUT);
  });

  it('répond aux classiques avec humour', async () => {
    expect(text(await run('sudo rm -rf /', ctx()))).toContain('sudoers');
    expect(text(await run('rm -rf /', ctx()))).toMatch(/lecture seule/);
    expect((await run('exit', ctx())).close).toBe(true);
    expect((await run('clear', ctx())).clear).toBe(true);
  });

  it('signale une commande inconnue', async () => {
    expect(text(await run('frobnicate', ctx()))).toContain('help');
  });

  it('ignore une entrée vide', async () => {
    expect((await run('   ', ctx())).lines).toEqual([]);
  });

  it('complète une commande et un slug', () => {
    expect(complete('subm', ctx())).toBe('submit ');
    expect(complete('open dvc', ctx())).toBe('open dvctf-bug-bounty');
  });
});
