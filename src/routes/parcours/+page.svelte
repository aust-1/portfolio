<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import RoleDetail from '#lib/components/parcours/RoleDetail.svelte';
  import RoleModal from '#lib/components/parcours/RoleModal.svelte';
  import TimelineGantt from '#lib/components/parcours/TimelineGantt.svelte';
  import TimelineList from '#lib/components/parcours/TimelineList.svelte';
  import ViewToggle, { type View } from '#lib/components/parcours/ViewToggle.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import { maxOverlap } from '#lib/content/timeline.ts';
  import { formatMonth } from '#lib/format.ts';
  import { safeGet, safeSet } from '#lib/storage.ts';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const today = new Date();
  const VIEW_KEY = 'er-parcours-vue';

  let view = $state<View>('parallele');
  onMount(() => {
    const saved = safeGet(VIEW_KEY);
    if (saved === 'liste' || saved === 'parallele') view = saved;
  });
  function setView(v: View) {
    view = v;
    safeSet(VIEW_KEY, v);
  }

  // Engagements seulement : les études courent en fond sur toute la période.
  const peak = $derived(
    maxOverlap(
      data.roles.filter((r) => r.kind !== 'formation'),
      today,
    ),
  );

  // Ouverture en modale avec une URL propre (shallow routing) ; un clic modifié (nouvel onglet,
  // etc.) garde le comportement natif du lien, et l'accès direct sert la page complète.
  function open(slug: string, e: MouseEvent) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    goto(`/parcours/${slug}`, { shallow: true, state: { role: slug } });
  }
  function close() {
    if (page.state.role) history.back();
  }
  const current = $derived(data.roles.find((r) => r.slug === page.state.role));
</script>

<svelte:head>
  <title>Parcours · Eliott Roussille</title>
  <meta
    name="description"
    content="Le parcours d'Eliott Roussille : formation, associations, enseignement et stage, rôle par rôle."
  />
</svelte:head>

<div class="container page">
  <SectionHead title="Parcours" id="parcours" level={1} meta="{data.roles.length} rôles">
    <a href="/cv" class="link-mono">CV détaillé</a>
    <a href="/cv.pdf" class="link-mono" download="CV-Eliott-Roussille.pdf">CV en PDF</a>
  </SectionHead>

  <div class="bar">
    {#if peak.count > 1 && peak.at}
      <p class="peak t-mono">
        jusqu'à <strong>{peak.count}</strong> engagements menés en parallèle des études ({formatMonth(
          peak.at,
        )})
      </p>
    {/if}
    <ViewToggle {view} onchange={setView} />
  </div>

  {#if view === 'parallele'}
    <TimelineGantt roles={data.roles} {today} onopen={open} />
    <p class="legend t-mono">
      <span class="k ink"></span> association, enseignement
      <span class="k surface"></span> formation
      <span class="k signal"></span> à venir
      <span class="k line"></span> aujourd'hui
    </p>
  {:else}
    <TimelineList roles={data.roles} {today} onopen={open} />
  {/if}

  {#if data.awards.length}
    <section class="awards" aria-labelledby="distinctions">
      <h2 id="distinctions" class="t-title">Distinctions et certifications</h2>
      <ul>
        {#each data.awards as a (a.title)}
          <li>
            <strong>{a.title}</strong>
            <span class="t-mono"
              >{a.issuer} · {formatMonth(a.date)}{a.detail ? ` · ${a.detail}` : ''}</span
            >
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</div>

<RoleModal open={!!current} onclose={close}>
  {#if current}
    <RoleDetail
      role={current}
      projects={data.related[current.slug] ?? []}
      level={2}
      headingId="modal-role-title"
    />
  {/if}
</RoleModal>

<style>
  .page {
    padding-top: 56px;
  }
  .bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
  }
  .peak {
    font-size: 14px;
    color: var(--er-text);
  }
  .peak strong {
    font-weight: 800;
    color: var(--er-signal-text);
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 10px;
    margin-top: 16px;
    font-size: 12px;
    color: var(--er-muted);
  }
  .k {
    display: inline-block;
    width: 14px;
    height: 10px;
    margin-left: 10px;
  }
  .k.ink {
    background: var(--er-ink);
  }
  .k.surface {
    background: var(--er-surface);
  }
  .k.signal {
    background: var(--er-signal);
  }
  .k.line {
    width: 2px;
    height: 14px;
    background: var(--er-signal);
  }
  .awards {
    margin-top: 96px;
  }
  .awards ul {
    list-style: none;
    padding: 0;
    margin: 20px 0 0;
    display: grid;
    gap: 14px;
  }
  .awards li {
    display: grid;
    gap: 2px;
  }
  .awards strong {
    font: 700 22px / 1.2 var(--font-display);
    color: var(--er-ink);
  }
  .awards span {
    font-size: 13px;
    color: var(--er-muted);
  }
</style>
