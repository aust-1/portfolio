<script lang="ts">
  import SectionHead from '#lib/components/SectionHead.svelte';
  import SkillField from '#lib/components/skills/SkillField.svelte';
  import type { Skill } from '#lib/content/skills.ts';

  let {
    skills,
    total,
    titles,
  }: { skills: Skill[]; total: number; titles: Record<string, string> } = $props();
</script>

<section class="container" aria-labelledby="competences-apercu">
  <SectionHead title="Compétences" id="competences-apercu" meta="{total} prouvées par les projets">
    <a href="/competences" class="link-mono">Toutes les compétences</a>
  </SectionHead>
  <SkillField {skills} {titles} compact />
</section>
