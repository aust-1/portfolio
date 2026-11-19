// Vérifie sur le site construit (build/) la protection des flags annoncée sur /ce-site :
// - aucun flag n'apparaît en clair (ni encodé simplement : base64, hex, URL, à l'envers) dans les
//   fichiers livrés, sauf le flag 1, offert dans un commentaire HTML ;
// - le flag 2 n'est jamais dans les fichiers (il n'existe que dans l'en-tête X-Flag de Caddy) ;
// - la validation embarque l'empreinte SHA-256 de chaque flag.
// Usage, après `pnpm build` : node scripts/build-flags.ts   (variables FLAG_* comme pour le build)
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { PROD_HASHES } from '../src/lib/flags/hashes.ts';
import { resolveFlags } from './flags.ts';

export type BuiltFile = { path: string; content: string };

/** Formes simples sous lesquelles un flag serait lisible sans effort. */
export function variants(flag: string): string[] {
  const b64 = Buffer.from(flag).toString('base64');
  return [
    flag,
    [...flag].reverse().join(''),
    encodeURIComponent(flag),
    b64,
    b64.replace(/=+$/, ''),
    Buffer.from(flag).toString('base64url'),
    Buffer.from(flag).toString('hex'),
  ];
}

const withoutHtmlComments = (html: string) => html.replace(/<!--[\s\S]*?-->/g, '');

export function checkBuiltFlags(files: BuiltFile[], flags: string[], hashes: string[]): string[] {
  const problems: string[] = [];
  flags.forEach((flag, i) => {
    const n = i + 1;
    for (const file of files) {
      // Flag 1 : seulement dans un commentaire HTML d'une page (« view-source », épreuve prévue).
      const visible =
        n === 1 && file.path.endsWith('.html') ? withoutHtmlComments(file.content) : file.content;
      const leaked = variants(flag).find((v) => visible.includes(v));
      if (leaked !== undefined) problems.push(`flag ${n} lisible dans ${file.path}`);
    }
  });
  const js = files.filter((f) => f.path.endsWith('.js')).map((f) => f.content);
  hashes.forEach((hash, i) => {
    if (!js.some((c) => c.includes(hash)))
      problems.push(`empreinte du flag ${i + 1} absente du JS`);
  });
  return problems;
}

function readAll(dir: string, root = dir): BuiltFile[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return readAll(path, root);
    return [{ path: relative(root, path), content: readFileSync(path).toString('latin1') }];
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { flags, hashes, mode } = resolveFlags(process.env, PROD_HASHES);
  const sha = (s: string) => createHash('sha256').update(s).digest('hex');
  if (flags.some((f, i) => sha(f) !== hashes[i]))
    throw new Error('flags et empreintes incohérents');
  const problems = checkBuiltFlags(readAll('build'), flags, hashes);
  if (problems.length > 0) {
    console.error(`Flags (${mode}) : ${problems.length} problème(s)\n- ${problems.join('\n- ')}`);
    process.exit(1);
  }
  console.log(`Flags (${mode}) : aucun flag lisible dans build/, empreintes embarquées.`);
}
