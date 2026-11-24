<script lang="ts">
  import Seo from '#lib/components/seo/Seo.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import SkillField from '#lib/components/skills/SkillField.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<Seo
  title="Compétences · Eliott Roussille"
  description="Les compétences d'Eliott Roussille, chacune reliée aux projets qui la prouvent."
/>

<div class="container page">
  <SectionHead title="Compétences" id="titre" level={1} meta="{data.skills.length} prouvées" />
  <p class="t-lead intro">
    Aucune liste écrite à la main : une compétence apparaît ici seulement si au moins un projet la
    prouve. Plus la pastille est grande, plus il y a de projets derrière.
  </p>
  <SkillField skills={data.skills} titles={data.titles} />
</div>

<style>
  .page {
    padding-top: 56px;
  }
  .intro {
    max-width: 52ch;
    margin-bottom: 48px;
  }
</style>
