<script lang="ts">
  import type { Role } from '#lib/content/schema.ts';
  import { layoutGantt } from '#lib/content/timeline.ts';
  import { formatPeriod } from '#lib/format.ts';

  let {
    roles,
    today,
    onopen,
    compact = false,
  }: {
    roles: Role[];
    today: Date;
    onopen?: (slug: string, e: MouseEvent) => void;
    compact?: boolean;
  } = $props();

  const layout = $derived(layoutGantt(roles, today));
  const bySlug = $derived(new Map(roles.map((r) => [r.slug, r])));
</script>

<!-- Vue « parallèle » : un couloir par rôle simultané. Le défilement horizontal reste dans ce bloc. -->
<div class="scroller" class:compact>
  <div class="gantt" style:--lanes={layout.laneCount}>
    <div class="axis t-mono" aria-hidden="true">
      {#each layout.years as y (y.year)}
        <span class="year" style:left="{y.x * 100}%">{y.year}</span>
      {/each}
    </div>
    <div class="lanes">
      {#each layout.years as y (y.year)}
        <span class="grid-line" style:left="{y.x * 100}%" aria-hidden="true"></span>
      {/each}
      <span class="today-line" style:left="{layout.todayX * 100}%" aria-hidden="true"
        ><span class="today t-mono">aujourd'hui</span></span
      >
      <ol class="bars">
        {#each layout.bars as bar (bar.slug)}
          {@const role = bySlug.get(bar.slug)!}
          <li
            class="bar {role.kind}"
            class:future={bar.future}
            class:open={bar.open}
            class:narrow={bar.open && !bar.future && bar.x1 - bar.x0 < 0.09}
            style:left="{bar.x0 * 100}%"
            style:width="{(bar.x1 - bar.x0) * 100}%"
            style:--lane={bar.lane}
          >
            <a
              href="/parcours/{role.slug}"
              title="{role.title} · {role.organization} · {formatPeriod(role.period)}"
              onclick={(e) => onopen?.(role.slug, e)}
            >
              <span class="text">
                <span class="label">{role.title}</span>
                {#if !compact}<span class="org">{role.organization}</span>{/if}
              </span>
            </a>
          </li>
        {/each}
      </ol>
    </div>
  </div>
</div>

<style>
  .scroller {
    overflow-x: auto;
    overscroll-behavior-x: contain;
    padding-bottom: 8px;
  }
  .gantt {
    --row: 52px;
    min-width: 980px;
    position: relative;
  }
  .compact .gantt {
    --row: 34px;
    min-width: 760px;
  }
  .axis {
    position: relative;
    height: 28px;
    font-size: 12px;
    color: var(--er-muted);
    border-bottom: 2px solid var(--er-ink);
  }
  .year {
    position: absolute;
    top: 0;
    transform: translateX(4px);
  }
  .today {
    position: absolute;
    top: 100%;
    left: 0;
    transform: translateX(-50%);
    padding-top: 6px;
    font-size: 12px;
    color: var(--er-signal-text);
    font-weight: 500;
    white-space: nowrap;
  }
  .lanes {
    position: relative;
    height: calc(var(--lanes) * var(--row) + 16px);
    margin-top: 8px;
    margin-bottom: 28px;
  }
  .grid-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 0;
    border-left: 2px dotted var(--er-dot);
  }
  .today-line {
    position: absolute;
    top: -8px;
    bottom: 0;
    width: 2px;
    background: var(--er-signal);
    z-index: 2;
  }
  .bars {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .bar {
    position: absolute;
    top: calc(var(--lane) * var(--row));
    height: calc(var(--row) - 6px);
    min-width: 6px;
  }
  .bar a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    height: 100%;
    padding: 0 10px;
    overflow: hidden;
    text-decoration: none;
    background: var(--er-ink);
    color: var(--er-bg);
    font: 500 12px / 1.2 var(--font-mono);
  }
  .bar.formation a {
    background: var(--er-surface);
    color: var(--er-ink);
  }
  .bar.future a {
    background: var(--er-signal);
    color: var(--er-on-signal);
  }
  .bar a:hover,
  .bar a:focus-visible {
    background: var(--er-signal);
    color: var(--er-on-signal);
    z-index: 3;
    position: relative;
  }
  .text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  /* Rôle récent, donc barre courte : le nom passe à droite de la barre pour rester lisible. */
  .bar.narrow a {
    overflow: visible;
  }
  .bar.narrow .text {
    position: absolute;
    left: calc(100% + 10px);
    top: 0;
    height: 100%;
    justify-content: center;
    color: var(--er-ink);
    pointer-events: none;
  }
  .label,
  .org {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .org {
    font-weight: 400;
    opacity: 0.75;
    font-size: 11px;
  }
</style>
