<script lang="ts">
  import ProjectCard from '#lib/components/project/ProjectCard.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import type { Project } from '#lib/content/schema.ts';

  let { projects, total, today }: { projects: Project[]; total: number; today: Date } = $props();
  // 2 × 2 : les aplats encre se répondent en diagonale (le bleu est déjà pris par le hero).
  const TONES = ['ink', 'signal', 'surface', 'ink'] as const;
</script>

<section class="container" aria-labelledby="projets">
  <SectionHead title="Projets" id="projets" meta="{projects.length} vedettes sur {total}">
    <a href="/projets" class="link-mono">Tous les projets</a>
  </SectionHead>
  <div class="grid">
    {#each projects as project, i (project.slug)}
      <ProjectCard {project} {today} tone={TONES[i] ?? 'surface'} large />
    {/each}
  </div>
</section>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gutter);
  }
  @media (max-width: 880px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
