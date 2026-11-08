// Interpréteur du terminal : une fonction pure (entrée + contexte → sortie). Il ne produit que du
// texte, jamais de HTML : l'affichage échappe tout. La navigation est décrite, pas exécutée.

export const MAX_INPUT = 200;

export type Tone = 'muted' | 'signal' | 'error' | 'ok';
export type Line = { text: string; tone?: Tone; href?: string };

export type SubmitResult = { ok: boolean; already: boolean; found: number; total: number };

export type TermContext = {
  cwd: string;
  projects: { slug: string; title: string; summary: string }[];
  roles: { slug: string; title: string; organization: string }[];
  skills: string[];
  submit: (flag: string) => Promise<SubmitResult>;
  /** Commande cachée découverte par `ls -a` : renvoie son secret. */
  backdoor: () => string;
};

export type TermOutput = {
  lines: Line[];
  navigate?: string;
  external?: string;
  cwd?: string;
  clear?: boolean;
  close?: boolean;
};

const PAGES: Record<string, string> = {
  accueil: '/',
  projets: '/projets',
  parcours: '/parcours',
  competences: '/competences',
  'a-propos': '/a-propos',
  cv: '/cv',
  liens: '/liens',
  'ce-site': '/ce-site',
};

const HELP: [string, string][] = [
  ['help', 'cette aide'],
  ['ls [-a] [dossier]', 'lister le contenu'],
  ['cd <dossier>', 'changer de dossier (projets, parcours, ~)'],
  ['cat <fichier>', 'afficher un fichier'],
  ['open <nom>', 'ouvrir un projet, un rôle ou une page'],
  ['whoami', 'qui est derrière ce site'],
  ['cv', 'télécharger mon CV'],
  ['github', 'ouvrir mon GitHub'],
  ['submit <flag>', 'valider un flag aust-1{...}'],
  ['clear', "effacer l'écran"],
  ['exit', 'fermer le terminal'],
];

const COMMANDS = [
  'help',
  'ls',
  'cd',
  'cat',
  'open',
  'whoami',
  'cv',
  'github',
  'submit',
  'clear',
  'exit',
  'pwd',
  'echo',
  'date',
  'sudo',
  'hack',
];

const ROOT_FILES = [
  'projets/',
  'parcours/',
  'a-propos.txt',
  'competences.txt',
  'contact.txt',
  'cv.pdf',
];

const err = (text: string): TermOutput => ({ lines: [{ text, tone: 'error' }] });
const say = (...texts: string[]): TermOutput => ({ lines: texts.map((text) => ({ text })) });

function resolveDir(cwd: string, arg: string | undefined): string | null {
  const clean = (arg ?? '~').replace(/\/+$/, '').replace(/^~\/?/, '~').replace(/^\.\//, '');
  if (clean === '.') return cwd;
  if (['', '~', '/', '..'].includes(clean)) return '~';
  // Seuls deux dossiers existent, accessibles depuis n'importe où (« ../projets », « ~/projets »…).
  const name = clean
    .replace(/^(\.\.\/)+/, '')
    .replace(/^~/, '')
    .replace(/^\//, '');
  return name === 'projets' || name === 'parcours' ? `~/${name}` : null;
}

function list(cwd: string, all: boolean, ctx: TermContext): string[] {
  if (cwd === '~/projets') return ctx.projects.map((p) => p.slug);
  if (cwd === '~/parcours') return ctx.roles.map((r) => r.slug);
  return all ? ['./', '../', '.backdoor*', '.bash_history', ...ROOT_FILES] : ROOT_FILES;
}

function cat(cwd: string, arg: string | undefined, ctx: TermContext): TermOutput {
  if (!arg) return err('cat : il manque un nom de fichier');
  if (/(^|\/)\.\.\/.*etc\/passwd|^\/etc\/passwd/.test(arg) || arg.includes('passwd')) {
    return {
      lines: [
        { text: 'root:x:0:0:pas ici:/root:/usr/sbin/nologin' },
        { text: 'visiteur:x:1000:1000:vous:/home/visiteur:/bin/curious' },
        { text: '# joli réflexe. Les vrais secrets se valident avec submit.', tone: 'muted' },
      ],
    };
  }
  const name = arg.replace(/^\.\//, '').replace(/^~\//, '');
  const inDir = cwd === '~' ? name : `${cwd.slice(2)}/${name}`;
  const [dir, file] = inDir.includes('/') ? inDir.split('/', 2) : [null, inDir];

  if (dir === 'projets') {
    const p = ctx.projects.find((x) => x.slug === file);
    if (p)
      return {
        lines: [
          { text: p.title, tone: 'signal' },
          { text: p.summary },
          { text: `→ open ${p.slug}`, tone: 'muted' },
        ],
      };
  }
  if (dir === 'parcours') {
    const r = ctx.roles.find((x) => x.slug === file);
    if (r)
      return {
        lines: [
          { text: r.title, tone: 'signal' },
          { text: r.organization },
          { text: `→ open ${r.slug}`, tone: 'muted' },
        ],
      };
  }
  if (dir === null) {
    switch (file) {
      case 'a-propos.txt':
        return say(
          "J'écris du code côté développeur, je le casse côté attaquant.",
          'Étudiant ingénieur cyber et manager, ESILV × EMLV.',
          '→ open a-propos',
        );
      case 'contact.txt':
        return say(
          'e-mail   eliottroussille@gmail.com',
          'linkedin linkedin.com/in/eliott-roussille',
          'github   github.com/aust-1',
        );
      case 'competences.txt':
        return say(ctx.skills.join(', '), '→ open competences');
      case 'cv.pdf':
        return err('cat : cv.pdf est un binaire. Essayez plutôt : cv');
      case '.bash_history':
        return say(
          'ls',
          'ls -a',
          'cat .bash_history',
          '# tiens, il y a un exécutable caché ici...',
        );
      case '.backdoor':
      case '.backdoor*':
        return err('cat : .backdoor est un exécutable. Lancez-le plutôt.');
    }
  }
  return err(`cat : ${arg} : aucun fichier de ce nom`);
}

function open(arg: string | undefined, ctx: TermContext): TermOutput {
  if (!arg) return err('open : quoi ? Exemple : open dvctf-bug-bounty');
  const name = arg.replace(/^(projets|parcours)\//, '').replace(/\/$/, '');
  if (ctx.projects.some((p) => p.slug === name))
    return {
      lines: [{ text: `ouverture de /projets/${name}...`, tone: 'muted' }],
      navigate: `/projets/${name}`,
    };
  if (ctx.roles.some((r) => r.slug === name))
    return {
      lines: [{ text: `ouverture de /parcours/${name}...`, tone: 'muted' }],
      navigate: `/parcours/${name}`,
    };
  const page = PAGES[name];
  if (page) return { lines: [{ text: `ouverture de ${page}...`, tone: 'muted' }], navigate: page };
  return err(`open : « ${name} » introuvable. Essayez : ls projets`);
}

export async function run(raw: string, ctx: TermContext): Promise<TermOutput> {
  const input = raw.slice(0, MAX_INPUT).trim();
  if (!input) return { lines: [] };
  const [cmd = '', ...args] = input.split(/\s+/);
  const rest = input.slice(cmd.length).trim();

  switch (cmd) {
    case 'help':
      return {
        lines: [
          ...HELP.map(([c, d]) => ({ text: `${c.padEnd(20)} ${d}` })),
          { text: "astuce : Tab complète, ↑ et ↓ rappellent l'historique", tone: 'muted' },
        ],
      };
    case 'ls': {
      const all = args.includes('-a') || args.includes('-la') || args.includes('-al');
      const target = args.find((a) => !a.startsWith('-'));
      const dir = target ? resolveDir(ctx.cwd, target) : ctx.cwd;
      if (!dir) return err(`ls : ${target} : aucun dossier de ce nom`);
      return { lines: [{ text: list(dir, all, ctx).join('  ') }] };
    }
    case 'cd': {
      const dir = resolveDir(ctx.cwd, args[0]);
      if (!dir) return err(`cd : ${args[0]} : aucun dossier de ce nom`);
      return { lines: [], cwd: dir };
    }
    case 'pwd':
      return say(ctx.cwd.replace('~', '/home/visiteur'));
    case 'cat':
      return cat(ctx.cwd, args[0], ctx);
    case 'open':
      return open(args[0], ctx);
    case 'whoami':
      return say(
        'visiteur',
        'Et en face : Eliott Roussille (@aust-1), étudiant ingénieur cyber et manager.',
        '→ open a-propos',
      );
    case 'cv':
      return {
        lines: [
          { text: 'cv.pdf', href: '/cv.pdf', tone: 'signal' },
          { text: 'version web : open cv', tone: 'muted' },
        ],
        external: '/cv.pdf',
      };
    case 'github':
      return {
        lines: [{ text: 'github.com/aust-1', href: 'https://github.com/aust-1', tone: 'signal' }],
        external: 'https://github.com/aust-1',
      };
    case 'echo':
      return say(rest);
    case 'date':
      return say(new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }));
    case 'clear':
      return { lines: [], clear: true };
    case 'exit':
      return { lines: [], close: true };
    case 'submit': {
      if (!rest) return err('submit : donnez un flag au format aust-1{...}');
      const r = await ctx.submit(rest);
      if (!r.ok) return err(`flag invalide. (${r.found}/${r.total})`);
      if (r.already)
        return { lines: [{ text: `déjà trouvé. (${r.found}/${r.total})`, tone: 'muted' }] };
      return {
        lines: [
          { text: `flag validé ! ${r.found}/${r.total}`, tone: 'ok' },
          ...(r.found === r.total
            ? [{ text: 'Tout trouvé. Écrivez-moi pour me dire comment.', tone: 'signal' as const }]
            : []),
        ],
      };
    }
    case 'sudo':
      return err("visiteur n'est pas dans le fichier sudoers. Cet incident sera signalé.");
    case 'rm':
      return /-\w*r\w*f|-\w*f\w*r/.test(rest)
        ? err('rm : système de fichiers en lecture seule (et prérendu). Bien essayé.')
        : err('rm : permission refusée');
    case 'hack':
      return {
        lines: [
          { text: 'initialisation du mainframe...', tone: 'muted' },
          { text: 'contournement du pare-feu... [##########] 100 %', tone: 'muted' },
          {
            text: 'accès refusé : ça ne marche que dans les films. Cherchez les flags plutôt.',
            tone: 'error',
          },
        ],
      };
    case './.backdoor':
    case '.backdoor':
    case '~/.backdoor':
      return {
        lines: [
          { text: 'connexion établie. Vous avez trouvé la porte dérobée.', tone: 'ok' },
          { text: ctx.backdoor(), tone: 'signal' },
          { text: '→ submit <ce flag>', tone: 'muted' },
        ],
      };
    default:
      return err(`${cmd} : commande introuvable. Tapez help.`);
  }
}

/** Autocomplétion Tab : nom de commande, puis argument d'`open`/`cat`/`cd`. */
export function complete(input: string, ctx: TermContext): string {
  const parts = input.split(' ');
  if (parts.length === 1) {
    const hits = COMMANDS.filter((c) => c.startsWith(parts[0] ?? ''));
    return hits.length === 1 ? `${hits[0]} ` : input;
  }
  const [cmd, partial = ''] = [parts[0], parts.slice(1).join(' ')];
  const pool =
    cmd === 'open'
      ? [...ctx.projects.map((p) => p.slug), ...ctx.roles.map((r) => r.slug), ...Object.keys(PAGES)]
      : cmd === 'cd'
        ? ['projets', 'parcours', '~']
        : cmd === 'cat'
          ? ROOT_FILES.filter((f) => !f.endsWith('/'))
          : [];
  const hits = pool.filter((p) => p.startsWith(partial));
  return hits.length === 1 ? `${cmd} ${hits[0]}` : input;
}
