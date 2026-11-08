<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.role.title} · Eliott Roussille</title>
</svelte:head>

<div class="container">
  <h1 class="t-section">{data.role.title}</h1>
  {#each data.projects as p (p.slug)}<a href="/projets/{p.slug}">{p.title}</a>{/each}
</div>
