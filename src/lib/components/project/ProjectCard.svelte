<script lang="ts">
  import Placeholder from '#lib/components/Placeholder.svelte';
  import { TAG_LABELS, type Project } from '#lib/content/schema.ts';
  import { formatStatus, formatYears } from '#lib/format.ts';

  let {
    project,
    tone = 'surface',
    large = false,
    today,
  }: {
    project: Project;
    tone?: 'ink' | 'signal' | 'surface';
    large?: boolean;
    today: Date;
  } = $props();
</script>

<article class="card {tone}" class:large>
  {#if large}
    <div class="media no-grain">
      {#if project.cover && !project.cover.placeholder}
        <img src={project.cover.src} alt={project.cover.alt} loading="lazy" />
      {:else}
        <Placeholder label={project.cover?.alt ?? project.title} ratio="16 / 8" />
      {/if}
    </div>
  {/if}
  <div class="body">
    <p class="meta t-mono">
      {formatYears(project.period)} · {formatStatus(project.period, today)}
    </p>
    <h3 class="t-title title">
      <a href="/projets/{project.slug}">{project.title}</a>
    </h3>
    <p class="role t-mono">{project.role}</p>
    <ul class="tags t-mono" aria-label="Domaines">
      {#each project.tags as tag (tag)}<li>{TAG_LABELS[tag]}</li>{/each}
    </ul>
  </div>
  <span class="go t-ui" aria-hidden="true">Voir le projet <span>→</span></span>
</article>

<style>
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 260px;
    background: var(--er-surface);
    color: var(--er-text);
  }
  .card.ink {
    background: var(--er-ink);
    color: var(--er-bg);
  }
  .card.signal {
    background: var(--er-signal);
    color: var(--er-on-signal);
  }
  .body {
    padding: 24px 24px 0;
    flex: 1;
  }
  .meta {
    font-size: 12px;
    opacity: 0.85;
  }
  .title {
    margin-top: 10px;
    color: inherit;
  }
  .title a {
    color: inherit;
    text-decoration: none;
  }
  /* Toute la carte est cliquable, sans imbriquer de liens. */
  .title a::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
  }
  .title a:focus-visible {
    outline: none;
  }
  .card:has(a:focus-visible) {
    outline: 3px solid var(--er-signal);
    outline-offset: 3px;
  }
  .card.signal:has(a:focus-visible) {
    outline-color: var(--er-ink);
  }
  .role {
    margin-top: 12px;
    font-size: 13px;
    line-height: 1.5;
    max-width: 52ch;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
    list-style: none;
    padding: 0;
    margin: 16px 0 0;
    font-size: 12px;
    opacity: 0.85;
  }
  .tags li::before {
    content: '#';
    opacity: 0.6;
  }
  .go {
    display: flex;
    justify-content: space-between;
    margin: 24px;
    padding: 12px 14px;
    font-size: 13px;
    background: var(--er-signal);
    color: var(--er-on-signal);
  }
  .card.signal .go {
    background: var(--er-ink);
    color: var(--er-bg);
  }
  .card:hover .go {
    background: var(--er-ink);
    color: var(--er-bg);
  }
  .card.signal:hover .go,
  .card.ink:hover .go {
    background: var(--er-bg);
    color: var(--er-ink);
  }
  .media :global(img) {
    width: 100%;
    aspect-ratio: 16 / 8;
    object-fit: cover;
  }
  .card.ink .media :global(.ph) {
    background-color: color-mix(in srgb, var(--er-ink) 85%, var(--er-bg));
  }
  .card.signal .media :global(.ph) {
    background-color: color-mix(in srgb, var(--er-signal) 80%, var(--er-ink));
  }
  .card.ink .media :global(figcaption),
  .card.signal .media :global(figcaption) {
    color: inherit;
  }
</style>
