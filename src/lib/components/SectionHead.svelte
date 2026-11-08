<script lang="ts">
  // Titre de section façon charte : grand titre 900, filet épais, compteur en mono à droite.
  import type { Snippet } from 'svelte';
  let {
    title,
    id,
    meta,
    level = 2,
    children,
  }: { title: string; id: string; meta?: string; level?: 1 | 2; children?: Snippet } = $props();
</script>

<header class="head">
  <svelte:element this={level === 1 ? 'h1' : 'h2'} {id} class="t-section">{title}</svelte:element>
  <div class="right t-ui">
    {#if meta}<span class="meta">{meta}</span>{/if}
    {@render children?.()}
  </div>
</header>

<style>
  .head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px 24px;
    padding-bottom: 14px;
    border-bottom: 2px solid var(--er-ink);
    margin-bottom: 28px;
  }
  .right {
    display: flex;
    gap: 24px;
    align-items: baseline;
    font-size: 13px;
    padding-bottom: 6px;
  }
  .meta {
    color: var(--er-muted);
  }
</style>
