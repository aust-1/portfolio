<script lang="ts">
  import '#lib/styles/prose.css';
  import Placeholder from '#lib/components/Placeholder.svelte';
  import type { RoleEntry } from '#lib/content/index.ts';
  import { formatPeriod, formatStatus } from '#lib/format.ts';

  let {
    role,
    projects,
    headingId = 'role-title',
    level = 1,
  }: {
    role: RoleEntry;
    projects: { slug: string; title: string; summary: string }[];
    headingId?: string;
    level?: 1 | 2;
  } = $props();
  const today = new Date();
</script>

<div class="role">
  <p class="t-mono when">
    {formatPeriod(role.period)} · {formatStatus(role.period, today)}{role.place
      ? ` · ${role.place}`
      : ''}
  </p>
  <svelte:element this={level === 1 ? 'h1' : 'h2'} id={headingId} class="t-section title">
    {role.title}
  </svelte:element>
  <p class="org t-ui">{role.organization}</p>
  {#if role.summary}<p class="t-lead summary">{role.summary}</p>{/if}

  <div class="cols">
    {#if role.missions.length}
      <section>
        <h3 class="t-label">missions</h3>
        <ul>
          {#each role.missions as m (m)}<li>{m}</li>{/each}
        </ul>
      </section>
    {/if}
    {#if role.achievements.length}
      <section>
        <h3 class="t-label">réalisations</h3>
        <ul>
          {#each role.achievements as a (a)}<li>{a}</li>{/each}
        </ul>
      </section>
    {/if}
  </div>

  <div class="prose body"><role.Body /></div>

  {#if role.skills.length}
    <section class="block">
      <h3 class="t-label">compétences développées</h3>
      <ul class="skills t-mono">
        {#each role.skills as s (s)}<li>{s}</li>{/each}
      </ul>
    </section>
  {/if}

  {#if projects.length}
    <section class="block">
      <h3 class="t-label">projets liés</h3>
      <ul class="projects">
        {#each projects as p (p.slug)}
          <li>
            <a href="/projets/{p.slug}">{p.title}</a>
            <span>{p.summary}</span>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if role.media.length}
    <section class="block gallery no-grain">
      {#each role.media as m (m.alt)}
        {#if m.placeholder}<Placeholder label={m.alt} ratio="4 / 3" />{:else}<img
            src={m.src}
            alt={m.alt}
            loading="lazy"
          />{/if}
      {/each}
    </section>
  {/if}
</div>

<style>
  .when {
    font-size: 13px;
    color: var(--er-muted);
  }
  .title {
    margin-top: 12px;
    font-size: clamp(40px, 5.4vw, 80px);
  }
  .org {
    margin-top: 14px;
    color: var(--er-signal-text);
  }
  .summary {
    margin-top: 20px;
    max-width: 52ch;
  }
  .cols {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px var(--gutter);
    margin-top: 40px;
  }
  .cols ul,
  .projects {
    list-style: none;
    padding: 0;
    margin: 12px 0 0;
    display: grid;
    gap: 10px;
  }
  .cols li {
    padding-left: 18px;
    position: relative;
    line-height: 1.55;
  }
  .cols li::before {
    content: '_';
    position: absolute;
    left: 0;
    color: var(--er-signal-text);
    font-family: var(--font-mono);
  }
  .body:empty {
    display: none;
  }
  .body {
    margin-top: 32px;
  }
  .block {
    margin-top: 40px;
  }
  .skills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 12px 0 0;
    font-size: 13px;
  }
  .skills li {
    background: var(--er-surface);
    color: var(--er-ink);
    padding: 6px 10px;
  }
  .projects li {
    display: grid;
    gap: 2px;
  }
  .projects a {
    font: 700 20px / 1.2 var(--font-display);
    color: var(--er-ink);
    text-decoration: none;
  }
  .projects a:hover {
    color: var(--er-signal-text);
  }
  .projects span {
    font-size: 15px;
    color: var(--er-muted);
  }
  .gallery {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gutter);
  }
  @media (max-width: 720px) {
    .cols,
    .gallery {
      grid-template-columns: 1fr;
    }
  }
</style>
