<script lang="ts">
  import RoleDetail from '#lib/components/parcours/RoleDetail.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.role.title}, {data.role.organization} · Eliott Roussille</title>
  <meta name="description" content={data.role.summary ?? data.role.title} />
</svelte:head>

<!-- Accès direct (lien partagé, rechargement) : la page complète du rôle. -->
<article class="container page">
  <nav class="crumbs t-mono" aria-label="Fil d'Ariane">
    <a href="/parcours">parcours</a> <span aria-hidden="true">/</span>
    <span>{data.role.slug}</span>
  </nav>
  <RoleDetail role={data.role} projects={data.projects} />
</article>

<style>
  .page {
    padding-top: 40px;
    max-width: 1100px;
  }
  .crumbs {
    font-size: 13px;
    color: var(--er-muted);
    margin-bottom: 32px;
  }
  .crumbs a {
    color: var(--er-muted);
  }
</style>
