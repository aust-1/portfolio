<script lang="ts">
  import '#lib/styles/prose.css';
  import Toc from '#lib/components/motifs/Toc.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import { SECURITY_HEADERS } from '#lib/security-headers.ts';

  const toc = [
    { id: 'stack', label: 'Stack', n: 1 },
    { id: 'contenu', label: 'Contenu', n: 2 },
    { id: 'hebergement', label: 'Hébergement', n: 3 },
    { id: 'livraison', label: 'Livraison', n: 4 },
    { id: 'securite', label: 'Sécurité', n: 5 },
    { id: 'curieux', label: 'Pour les curieux', n: 6 },
  ];
</script>

<svelte:head>
  <title>Comment ce site est fait · Eliott Roussille</title>
  <meta
    name="description"
    content="La stack, l'hébergement, la chaîne de déploiement et les en-têtes de sécurité de eliott-roussille.fr."
  />
</svelte:head>

<div class="container page">
  <SectionHead title="Ce site" id="titre" level={1} meta="comment il est fait" />

  <div class="layout">
    <aside><div class="toc"><Toc items={toc} /></div></aside>

    <div class="prose">
      <p class="t-lead">
        Un site statique, servi depuis mon propre VPS, sans base de données ni appel tiers au
        chargement. Moins il y a de pièces mobiles, moins il y a de surface d'attaque.
      </p>

      <h2 id="stack">Stack</h2>
      <ul>
        <li>
          <strong>SvelteKit</strong> et Svelte 5, entièrement prérendus : chaque page est un fichier HTML
          généré au build.
        </li>
        <li>
          <strong>TypeScript</strong> en mode strict, ESLint, Prettier et <code>svelte-check</code> à
          chaque commit.
        </li>
        <li>
          <strong>Vitest</strong> pour la logique (compétences, timeline, terminal, flags) et
          <strong>Playwright</strong> pour les parcours dans le navigateur.
        </li>
        <li>
          Polices auto-hébergées : Inter Tight, Inter et JetBrains Mono. Aucune requête vers Google
          Fonts.
        </li>
      </ul>

      <h2 id="contenu">Contenu</h2>
      <p>
        Chaque projet et chaque rôle est un fichier Markdown dont l'en-tête est validé par
        <code>zod</code> au build. Un lien vers un projet inexistant, une date mal formée ou une apostrophe
        typographique font échouer la compilation.
      </p>
      <p>
        Les compétences ne sont saisies nulle part : elles sont déduites des projets. Le statut d'un
        rôle (en cours, terminé, à venir) est calculé à partir de ses dates, et un rebuild chaque
        nuit le tient à jour.
      </p>

      <h2 id="hebergement">Hébergement</h2>
      <p>
        Le site tourne dans un conteneur Docker sur un VPS que j'administre. Un Caddy interne sert
        les fichiers statiques et pose les en-têtes de sécurité ; un reverse proxy Caddy partagé
        gère TLS pour tous les services du serveur. Le conteneur ne publie aucun port, tourne sans
        privilèges supplémentaires et expose un healthcheck.
      </p>

      <h2 id="livraison">Livraison</h2>
      <ul>
        <li>
          Chaque push sur <code>main</code> lance la CI : format, lint, types, tests unitaires, build
          et tests de bout en bout.
        </li>
        <li>
          Si la CI est verte, un workflow se connecte au VPS en SSH, avec une clé dédiée et une clé
          d'hôte épinglée, puis lance le script de déploiement.
        </li>
        <li>
          Le script reconstruit l'image, redémarre le conteneur et attend qu'il réponde avant de
          déclarer le déploiement réussi.
        </li>
        <li>
          Les statistiques GitHub sont calculées chaque nuit par un autre dépôt, le seul à détenir
          un token. Le site les lit au build : aucun token n'est exposé et le navigateur n'appelle
          jamais l'API GitHub.
        </li>
      </ul>

      <h2 id="securite">Sécurité</h2>
      <p>
        Objectif : la note A+ sur les scanners d'en-têtes (Mozilla Observatory,
        securityheaders.com). Voici ce que chaque réponse renvoie :
      </p>
      <dl class="headers">
        {#each SECURITY_HEADERS as h (h.name)}
          <div>
            <dt class="t-mono">{h.name}</dt>
            <dd>{h.why}</dd>
          </div>
        {/each}
      </dl>
      <p>
        Pour signaler une vulnérabilité : <a href="/.well-known/security.txt" data-sveltekit-reload
          >security.txt</a
        >
        (RFC 9116), avec ma <a href="/pgp.asc" data-sveltekit-reload>clé PGP</a>.
      </p>

      <h2 id="curieux">Pour les curieux</h2>
      <p>
        Le site cache cinq flags au format <code>aust-1&#123;...&#125;</code>. Le terminal (<kbd
          >Ctrl</kbd
        >
        + <kbd>K</kbd>) les valide avec <code>submit</code>. Seules leurs empreintes SHA-256 sont
        embarquées dans le code : les lire dans le bundle ne suffit pas.
      </p>
      <p>
        Le code source est public :
        <a href="https://github.com/aust-1/portfolio">github.com/aust-1/portfolio</a>.
      </p>
    </div>
  </div>
</div>

<style>
  .page {
    padding-top: 56px;
  }
  .layout {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 40px var(--gutter);
  }
  aside {
    grid-column: 1 / span 3;
  }
  .toc {
    position: sticky;
    top: 24px;
  }
  .prose {
    grid-column: 5 / span 8;
  }
  .headers {
    display: grid;
    gap: 2px;
    margin-top: 1.2em;
  }
  .headers div {
    display: grid;
    grid-template-columns: minmax(0, 300px) 1fr;
    gap: 16px;
    padding: 12px 16px;
    background: var(--er-surface);
  }
  .headers dt {
    font-size: 13px;
    color: var(--er-ink);
    overflow-wrap: anywhere;
  }
  .headers dd {
    margin: 0;
    font-size: 15px;
    line-height: 1.5;
  }
  kbd {
    font-family: var(--font-mono);
    background: var(--er-surface);
    padding: 1px 6px;
    font-size: 0.85em;
  }
  @media (max-width: 880px) {
    aside {
      display: none;
    }
    .prose {
      grid-column: 1 / -1;
    }
    .headers div {
      grid-template-columns: 1fr;
      gap: 4px;
    }
  }
</style>
