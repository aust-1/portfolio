<script lang="ts">
  import TimelineGantt from '#lib/components/parcours/TimelineGantt.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import type { Role } from '#lib/content/schema.ts';

  let { roles, peak, today }: { roles: Role[]; peak: number; today: Date } = $props();
</script>

<section class="container" aria-labelledby="parcours-apercu">
  <SectionHead title="Parcours" id="parcours-apercu" meta="{roles.length} rôles">
    <a href="/parcours" class="link-mono">Timeline complète</a>
  </SectionHead>
  {#if peak > 1}
    <p class="t-lead lead">Jusqu'à {peak} engagements menés en même temps que les études.</p>
  {/if}
  <TimelineGantt {roles} {today} compact />
</section>

<style>
  .lead {
    margin-bottom: 28px;
    max-width: 40ch;
  }
</style>
