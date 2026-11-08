<script lang="ts">
  import Contact from '#lib/components/home/Contact.svelte';
  import Featured from '#lib/components/home/Featured.svelte';
  import Hero from '#lib/components/home/Hero.svelte';
  import TimelinePreview from '#lib/components/home/TimelinePreview.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const today = new Date();
</script>

<svelte:head>
  <title>Eliott Roussille, étudiant ingénieur cyber et manager</title>
  <meta
    name="description"
    content="Portfolio d'Eliott Roussille : cybersécurité offensive et défensive, développement full-stack, infrastructure et gestion de projet."
  />
</svelte:head>

<Hero nextStep={data.nextStep} />
<div class="sections">
  <Featured projects={data.featured} total={data.total} {today} />
  <TimelinePreview roles={data.roles} peak={data.peak} {today} />
  <Contact />
</div>

<style>
  .sections {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 120px;
    margin-top: 56px;
  }
</style>
