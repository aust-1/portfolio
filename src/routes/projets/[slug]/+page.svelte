<script lang="ts">
  import '#lib/styles/prose.css';
  import { onMount } from 'svelte';
  import Placeholder from '#lib/components/Placeholder.svelte';
  import Toc from '#lib/components/motifs/Toc.svelte';
  import { TAG_LABELS } from '#lib/content/schema.ts';
  import { formatPeriod, formatStatus } from '#lib/format.ts';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const p = $derived(data.project);
  const today = new Date();

  // Sommaire construit depuis les titres du Markdown (ids posés par rehype-slug).
  let toc = $state<{ id: string; label: string; n: number }[]>([]);
  let active = $state<string | undefined>();
  let article: HTMLElement | undefined = $state();

  onMount(() => {
    if (!article) return;
    const headings = [...article.querySelectorAll<HTMLHeadingElement>('h2[id]')];
    toc = headings.map((h, i) => ({ id: h.id, label: h.textContent ?? '', n: i + 1 }));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) active = e.target.id;
      },
      { rootMargin: '0px 0px -70% 0px' },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  });
</script>

<svelte:head>
  <title>{p.title} · Eliott Roussille</title>
  <meta name="description" content={p.summary} />
</svelte:head>

<article class="container page">
  <nav class="crumbs t-mono" aria-label="Fil d'Ariane">
    <a href="/projets">projets</a> <span aria-hidden="true">/</span> <span>{p.slug}</span>
  </nav>

  <header class="head">
    <p class="t-mono when">{formatPeriod(p.period)} · {formatStatus(p.period, today)}</p>
    <h1 class="t-section title">{p.title}<span class="u" aria-hidden="true">_</span></h1>
    <p class="t-lead summary">{p.summary}</p>
    <ul class="tags t-mono" aria-label="Domaines">
      {#each p.tags as tag (tag)}
        <li><a href="/projets?tag={tag}">#{TAG_LABELS[tag]}</a></li>
      {/each}
    </ul>
  </header>

  <div class="cover no-grain">
    {#if p.cover && !p.cover.placeholder}
      <img src={p.cover.src} alt={p.cover.alt} />
    {:else}
      <Placeholder label={p.cover?.alt ?? p.title} ratio="21 / 8" />
    {/if}
  </div>

  <div class="layout">
    <aside class="side">
      <dl class="facts">
        <div>
          <dt class="t-label">rôle</dt>
          <dd>{p.role}</dd>
        </div>
        {#if p.team}
          <div>
            <dt class="t-label">équipe</dt>
            <dd class="t-mono">{p.team === 1 ? 'seul' : `${p.team} personnes`}</dd>
          </div>
        {/if}
        <div>
          <dt class="t-label">code</dt>
          <dd class="t-mono">
            {#if p.privateRepo}
              dépôt privé · extraits commentés sur cette page
            {:else if p.repo}
              <a href={p.repo}>{p.repo.replace('https://github.com/', 'github.com/')}</a>
            {:else}
              pas de dépôt public
            {/if}
          </dd>
        </div>
        {#if p.awards.length}
          <div>
            <dt class="t-label">résultat</dt>
            {#each p.awards as award (award)}<dd class="award">{award}</dd>{/each}
          </div>
        {/if}
      </dl>
      {#if toc.length > 1}
        <div class="toc"><Toc items={toc} {active} /></div>
      {/if}
    </aside>

    <div class="main">
      <div class="prose" bind:this={article}>
        <p.Body />
      </div>

      <section class="block" aria-labelledby="stack">
        <h2 id="stack" class="t-title">Stack</h2>
        <ul class="stack t-mono">
          {#each data.stack as s (s.slug)}
            <li><a href="/competences#{s.slug}">{s.name}</a></li>
          {/each}
        </ul>
      </section>

      {#if p.media.length}
        <section class="block" aria-labelledby="medias">
          <h2 id="medias" class="t-title">Médias</h2>
          <div class="gallery no-grain">
            {#each p.media as m (m.alt)}
              {#if m.placeholder}
                <Placeholder label={m.alt} ratio="4 / 3" />
              {:else}
                <img src={m.src} alt={m.alt} loading="lazy" />
              {/if}
            {/each}
          </div>
        </section>
      {/if}

      {#if data.roles.length}
        <section class="block" aria-labelledby="parcours-lie">
          <h2 id="parcours-lie" class="t-title">Dans mon parcours</h2>
          <ul class="roles">
            {#each data.roles as r (r.slug)}
              <li>
                <a href="/parcours/{r.slug}">{r.title}</a>
                <span class="t-mono">{r.organization} · {formatPeriod(r.period)}</span>
              </li>
            {/each}
          </ul>
        </section>
      {/if}
    </div>
  </div>

  <nav class="pager t-ui" aria-label="Autres projets">
    {#if data.prev}<a href="/projets/{data.prev.slug}">← {data.prev.title}</a>{:else}<span
      ></span>{/if}
    {#if data.next}<a href="/projets/{data.next.slug}">{data.next.title} →</a>{/if}
  </nav>
</article>

<style>
  .page {
    padding-top: 40px;
  }
  .crumbs {
    font-size: 13px;
    color: var(--er-muted);
  }
  .crumbs a {
    color: var(--er-muted);
  }
  .head {
    margin-top: 32px;
    max-width: 1100px;
  }
  .when {
    font-size: 13px;
    color: var(--er-muted);
  }
  .title {
    margin-top: 14px;
    overflow-wrap: anywhere;
  }
  .u {
    color: var(--er-signal);
  }
  .summary {
    margin-top: 22px;
    max-width: 46ch;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    list-style: none;
    padding: 0;
    margin: 20px 0 0;
    font-size: 13px;
  }
  .tags a {
    color: var(--er-text);
  }
  .cover {
    margin-top: 40px;
  }
  .cover img {
    width: 100%;
    aspect-ratio: 21 / 8;
    object-fit: cover;
  }
  .layout {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 40px var(--gutter);
    margin-top: 56px;
  }
  .side {
    grid-column: 1 / span 4;
  }
  .main {
    grid-column: 5 / span 8;
    min-width: 0;
  }
  .facts {
    display: grid;
    gap: 20px;
    margin: 0;
    padding: 24px;
    background: var(--er-surface);
  }
  dd {
    margin: 6px 0 0;
    color: var(--er-ink);
    font-size: 16px;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
  dd.t-mono {
    font-size: 14px;
  }
  .award {
    font: 700 20px / 1.2 var(--font-display);
  }
  .toc {
    position: sticky;
    top: 24px;
    margin-top: 32px;
  }
  .block {
    margin-top: 64px;
  }
  .block h2 {
    margin-bottom: 18px;
  }
  .stack {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .stack a {
    display: inline-block;
    padding: 8px 12px;
    background: var(--er-surface);
    color: var(--er-ink);
    text-decoration: none;
    font-size: 14px;
  }
  .stack a:hover {
    background: var(--er-ink);
    color: var(--er-bg);
  }
  .gallery {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gutter);
  }
  .gallery img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }
  .roles {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 14px;
  }
  .roles li {
    display: grid;
    gap: 2px;
  }
  .roles a {
    font: 700 20px / 1.2 var(--font-display);
    color: var(--er-ink);
    text-decoration: none;
  }
  .roles a:hover {
    color: var(--er-signal-text);
  }
  .roles span {
    font-size: 13px;
    color: var(--er-muted);
  }
  .pager {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    margin-top: 96px;
    padding-top: 20px;
    border-top: 2px solid var(--er-ink);
    font-size: 14px;
  }
  .pager a {
    color: var(--er-ink);
  }
  @media (max-width: 880px) {
    .side,
    .main {
      grid-column: 1 / -1;
    }
    .toc {
      display: none;
    }
    .gallery {
      grid-template-columns: 1fr;
    }
  }
</style>
