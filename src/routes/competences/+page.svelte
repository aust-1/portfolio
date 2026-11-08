<script lang="ts">
  import SectionHead from '#lib/components/SectionHead.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Compétences · Eliott Roussille</title>
</svelte:head>

<div class="container page">
  <SectionHead title="Compétences" id="titre" level={1} meta="{data.skills.length} prouvées" />
  <ul class="list">
    {#each data.skills as skill (skill.slug)}
      <li id={skill.slug}>
        <strong>{skill.name}</strong>
        <span class="t-mono">
          {#each skill.projects as slug, i (slug)}{i ? ', ' : ''}<a href="/projets/{slug}"
              >{data.titles[slug]}</a
            >{/each}
        </span>
      </li>
    {/each}
  </ul>
</div>

<style>
  .page {
    padding-top: 56px;
  }
  .list {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 10px;
  }
  span {
    font-size: 13px;
    margin-left: 12px;
  }
</style>
