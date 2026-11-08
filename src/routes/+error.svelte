<script lang="ts">
  import { page } from '$app/state';

  // 404 qui répond comme un terminal (spec §10). Suggère les vraies pages et glisse l'indice Konami.
  const ROUTES = [
    '/',
    '/projets',
    '/parcours',
    '/competences',
    '/a-propos',
    '/cv',
    '/liens',
    '/ce-site',
  ];
  const path = $derived(page.url.pathname);
  const notFound = $derived(page.status === 404);
</script>

<svelte:head>
  <title>{page.status} · Eliott Roussille</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="container page">
  <div class="term t-mono" role="region" aria-label="Erreur {page.status}">
    <p><span class="prompt">visiteur@eliott-roussille:~$</span> cd {path}</p>
    {#if notFound}
      <p class="err">bash: cd: {path}: command not found</p>
      <p class="muted">code de sortie 404 : cette page n'existe pas (ou plus).</p>
    {:else}
      <p class="err">segmentation fault (core dumped) · {page.status}</p>
      <p class="muted">{page.error?.message ?? 'Erreur inattendue.'}</p>
    {/if}
    <p><span class="prompt">visiteur@eliott-roussille:~$</span> ls /</p>
    <ul>
      {#each ROUTES as r (r)}<li><a href={r}>{r === '/' ? '~' : r.slice(1)}/</a></li>{/each}
    </ul>
    <p class="muted"># astuce : ↑ ↑ ↓ ↓ ← → ← → B A, quelque part sur ce site</p>
    <p><span class="prompt">visiteur@eliott-roussille:~$</span> <span class="cursor">_</span></p>
  </div>
  <p class="big t-section" aria-hidden="true">{page.status}<span class="u">_</span></p>
</div>

<style>
  .page {
    padding-top: 72px;
    display: grid;
    gap: 40px;
  }
  .term {
    background: var(--er-ink);
    color: var(--er-bg);
    padding: clamp(20px, 4vw, 36px);
    font-size: 15px;
    line-height: 1.8;
    max-width: 880px;
    overflow-wrap: anywhere;
  }
  .prompt {
    color: var(--er-signal);
  }
  .err {
    color: var(--er-signal);
  }
  .muted {
    color: color-mix(in srgb, var(--er-bg) 65%, var(--er-ink));
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 22px;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  a {
    color: var(--er-bg);
  }
  a:hover {
    color: var(--er-signal);
  }
  .cursor {
    animation: blink 1.1s steps(1) infinite;
  }
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
  .big {
    font-size: clamp(96px, 18vw, 240px);
    color: var(--er-surface);
  }
  .u {
    color: var(--er-signal);
  }
</style>
