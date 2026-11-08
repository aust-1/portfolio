<script lang="ts">
  import { onMount } from 'svelte';
  import { replaceState } from '$app/navigation';
  import ProjectCard from '#lib/components/project/ProjectCard.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import { TAG_LABELS, type Tag } from '#lib/content/schema.ts';
  import { matches, readTags, toggle } from '#lib/filters.ts';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const today = new Date();

  let active = $state<Tag[]>([]);
  // Le filtre vit dans l'URL (partageable). Prérendu = tout afficher ; le filtre s'applique au montage.
  onMount(() => {
    active = readTags(new URL(location.href).searchParams, data.tags);
  });

  const visible = $derived(data.projects.filter((p) => matches(p.tags, active)));

  function select(tag: Tag | null) {
    active = tag === null ? [] : toggle(active, tag);
    const url = new URL(location.href);
    url.searchParams.delete('tag');
    for (const t of active) url.searchParams.append('tag', t);
    replaceState(url, {});
  }
</script>

<svelte:head>
  <title>Projets · Eliott Roussille</title>
  <meta
    name="description"
    content="Tous les projets d'Eliott Roussille : cybersécurité, web, infrastructure, robotique et gestion de projet."
  />
</svelte:head>

<div class="container page">
  <SectionHead
    title="Projets"
    id="projets"
    level={1}
    meta="{visible.length} sur {data.projects.length}"
  />

  <div class="filters" role="group" aria-label="Filtrer par domaine">
    <button
      type="button"
      class="chip t-mono"
      aria-pressed={active.length === 0}
      onclick={() => select(null)}>tout</button
    >
    {#each data.tags as tag (tag)}
      <button
        type="button"
        class="chip t-mono"
        aria-pressed={active.includes(tag)}
        onclick={() => select(tag)}>#{TAG_LABELS[tag]}</button
      >
    {/each}
  </div>

  <ul class="grid" aria-live="polite">
    {#each visible as project (project.slug)}
      <li><ProjectCard {project} {today} tone={project.featured ? 'ink' : 'surface'} /></li>
    {:else}
      <li class="empty t-mono">Aucun projet ne porte ces tags. Retirez un filtre.</li>
    {/each}
  </ul>
</div>

<style>
  .page {
    padding-top: 56px;
  }
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 32px;
  }
  .chip {
    padding: 9px 14px;
    font-size: 13px;
    border: 0;
    background: var(--er-surface);
    color: var(--er-ink);
    cursor: pointer;
  }
  .chip[aria-pressed='true'] {
    background: var(--er-ink);
    color: var(--er-bg);
  }
  .chip:hover {
    background: var(--er-signal);
    color: var(--er-on-signal);
  }
  .grid {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--gutter);
  }
  .grid > li {
    display: grid;
  }
  .empty {
    grid-column: 1 / -1;
    padding: 40px 0;
    color: var(--er-muted);
  }
  @media (max-width: 1080px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 680px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
