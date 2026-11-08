<script lang="ts">
  import { onMount } from 'svelte';
  import type { Skill, SkillFamily } from '#lib/content/skills.ts';

  // Vue ludique des compétences : les pastilles tombent et rebondissent à l'arrivée à l'écran,
  // leur taille dit combien de projets les prouvent, et survoler l'une d'elles éclaire celles qui
  // partagent un projet. Sans JS ou avec « réduire les animations » : une liste statique lisible.
  let {
    skills,
    titles,
    compact = false,
  }: { skills: Skill[]; titles: Record<string, string>; compact?: boolean } = $props();

  const FAMILIES: { id: SkillFamily; label: string }[] = [
    { id: 'domaine', label: 'domaines' },
    { id: 'langage', label: 'langages' },
    { id: 'outil', label: 'outils et méthodes' },
  ];

  let field: HTMLElement | undefined = $state();
  let dropped = $state(false);
  let hovered = $state<string | null>(null);
  let pinned = $state<string | null>(null);
  const focus = $derived(pinned ?? hovered);
  const focusSkill = $derived(skills.find((s) => s.slug === focus));
  const related = $derived(
    new Set(
      focusSkill
        ? skills
            .filter((s) => s.projects.some((p) => focusSkill.projects.includes(p)))
            .map((s) => s.slug)
        : [],
    ),
  );
  const maxWeight = $derived(Math.max(1, ...skills.map((s) => s.weight)));

  onMount(() => {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (!compact && skills.some((s) => s.slug === hash)) pinned = hash;
    if (!field) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          dropped = true;
          io.disconnect();
        }
      },
      { threshold: 0 },
    );
    io.observe(field);
    return () => io.disconnect();
  });

  // Délai et hauteur de chute pseudo-aléatoires mais stables (pas de différence SSR / client).
  function seed(slug: string, salt: number): number {
    let h = salt;
    for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return (h % 1000) / 1000;
  }

  function toggle(slug: string) {
    pinned = pinned === slug ? null : slug;
  }
</script>

<div class="field" class:compact class:dropped class:focusing={!!focus} bind:this={field}>
  {#each FAMILIES as fam (fam.id)}
    {@const list = skills.filter((s) => s.family === fam.id)}
    {#if list.length}
      <section class="family" aria-label={fam.label}>
        <h2 class="t-label">{fam.label} <span>{list.length}</span></h2>
        <ul>
          {#each list as s, i (s.slug)}
            <li
              id={compact ? undefined : s.slug}
              style:--size={s.weight / maxWeight}
              style:--delay="{Math.round(i * 45 + seed(s.slug, 7) * 260)}ms"
              style:--fall="{Math.round(-180 - seed(s.slug, 13) * 420)}px"
              style:--tilt="{Math.round((seed(s.slug, 3) - 0.5) * 24)}deg"
            >
              {#if compact}
                <a
                  class="pill"
                  class:lit={related.has(s.slug)}
                  class:main={focus === s.slug}
                  href="/competences#{s.slug}"
                  onmouseenter={() => (hovered = s.slug)}
                  onmouseleave={() => (hovered = null)}
                  onfocus={() => (hovered = s.slug)}
                  onblur={() => (hovered = null)}>{s.name}<sup>{s.weight}</sup></a
                >
              {:else}
                <button
                  type="button"
                  class="pill"
                  class:lit={related.has(s.slug)}
                  class:main={focus === s.slug}
                  aria-pressed={pinned === s.slug}
                  aria-controls="skill-panel"
                  onmouseenter={() => (hovered = s.slug)}
                  onmouseleave={() => (hovered = null)}
                  onfocus={() => (hovered = s.slug)}
                  onblur={() => (hovered = null)}
                  onclick={() => toggle(s.slug)}>{s.name}<sup>{s.weight}</sup></button
                >
                <noscript>
                  <span class="proof">{s.projects.map((p) => titles[p]).join(', ')}</span></noscript
                >
              {/if}
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  {/each}
</div>

{#if !compact}
  <div id="skill-panel" class="panel" aria-live="polite">
    {#if focusSkill}
      <p class="t-label">
        {focusSkill.name} · prouvé par {focusSkill.weight} projet{focusSkill.weight > 1 ? 's' : ''}
      </p>
      <ul>
        {#each focusSkill.projects as p (p)}
          <li><a href="/projets/{p}">{titles[p] ?? p}</a></li>
        {/each}
      </ul>
    {:else}
      <p class="hint t-mono">
        survolez ou choisissez une compétence pour voir les projets qui la prouvent_
      </p>
    {/if}
  </div>
{/if}

<style>
  .field {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    gap: 40px var(--gutter);
    align-items: start;
  }
  .compact {
    grid-template-columns: 1fr 1fr 2fr;
  }
  h2 {
    margin-bottom: 16px;
  }
  h2 span {
    color: var(--er-signal-text);
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .pill {
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
    padding: calc(7px + var(--size) * 6px) calc(10px + var(--size) * 8px);
    border: 0;
    background: var(--er-surface);
    color: var(--er-ink);
    font: 500 calc(13px + var(--size) * 9px) / 1 var(--font-mono);
    text-decoration: none;
    cursor: pointer;
    transition:
      background 120ms,
      color 120ms,
      opacity 160ms,
      transform 160ms;
  }
  li:nth-child(3n) .pill {
    background: var(--er-ink);
    color: var(--er-bg);
  }
  sup {
    font-size: 0.6em;
    color: var(--er-signal-text);
  }
  li:nth-child(3n) sup {
    color: var(--er-signal);
  }
  .focusing .pill {
    opacity: 0.32;
  }
  .focusing .pill.lit {
    opacity: 1;
  }
  .pill.main,
  .pill[aria-pressed='true'] {
    background: var(--er-signal) !important;
    color: var(--er-on-signal) !important;
    opacity: 1 !important;
    transform: translateY(-3px);
  }
  .pill.main sup {
    color: inherit;
  }

  /* Chute avec rebond, une seule fois, quand le bloc entre à l'écran. */
  @media (prefers-reduced-motion: no-preference) {
    :global(html.js) .field li {
      opacity: 0;
      transform: translateY(var(--fall)) rotate(var(--tilt));
    }
    :global(html.js) .field.dropped li {
      animation: drop 900ms cubic-bezier(0.2, 0.7, 0.3, 1) var(--delay) both;
    }
  }
  @keyframes drop {
    0% {
      opacity: 0;
      transform: translateY(var(--fall)) rotate(var(--tilt));
    }
    55% {
      opacity: 1;
      transform: translateY(0) rotate(calc(var(--tilt) * -0.4));
    }
    72% {
      transform: translateY(-14px) rotate(calc(var(--tilt) * 0.2));
    }
    86% {
      transform: translateY(0) rotate(0deg);
    }
    93% {
      transform: translateY(-4px);
    }
    100% {
      opacity: 1;
      transform: none;
    }
  }

  .proof {
    display: block;
    font-size: 12px;
    color: var(--er-muted);
  }
  .panel {
    position: sticky;
    bottom: 0;
    margin-top: 48px;
    padding: 20px 24px;
    background: var(--er-ink);
    color: var(--er-bg);
    min-height: 76px;
    z-index: 5;
  }
  .panel .t-label {
    color: color-mix(in srgb, var(--er-bg) 70%, var(--er-ink));
  }
  .panel ul {
    margin-top: 10px;
    gap: 8px 24px;
  }
  .panel a {
    color: var(--er-bg);
    font: 700 20px / 1.2 var(--font-display);
  }
  .panel a:hover {
    color: var(--er-signal);
  }
  .hint {
    font-size: 13px;
    color: color-mix(in srgb, var(--er-bg) 70%, var(--er-ink));
  }
  @media (max-width: 880px) {
    .field,
    .compact {
      grid-template-columns: 1fr;
    }
  }
</style>
