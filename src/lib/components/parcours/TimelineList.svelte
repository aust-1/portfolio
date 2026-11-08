<script lang="ts">
  import type { Role } from '#lib/content/schema.ts';
  import { formatPeriod, formatStatus } from '#lib/format.ts';

  let {
    roles,
    today,
    onopen,
  }: { roles: Role[]; today: Date; onopen?: (slug: string, e: MouseEvent) => void } = $props();

  // Regroupés par année de début, du plus récent au plus ancien (les rôles à venir en tête).
  const years = $derived(
    [...new Set(roles.map((r) => r.period.start.slice(0, 4)))].sort().reverse(),
  );
</script>

<ol class="years">
  {#each years as year (year)}
    <li class="year">
      <h3 class="t-title y">{year}</h3>
      <ol class="items">
        {#each roles.filter((r) => r.period.start.startsWith(year)) as role (role.slug)}
          <li class="item">
            <p class="t-mono when">
              {formatPeriod(role.period)} · {formatStatus(role.period, today)}
            </p>
            <a class="title" href="/parcours/{role.slug}" onclick={(e) => onopen?.(role.slug, e)}
              >{role.title}</a
            >
            <p class="org t-ui">{role.organization}</p>
          </li>
        {/each}
      </ol>
    </li>
  {/each}
</ol>

<style>
  .years,
  .items {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .year {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: var(--gutter);
    padding: 28px 0;
    border-top: 2px solid var(--er-ink);
  }
  .y {
    font-size: clamp(36px, 4vw, 56px);
    line-height: 0.9;
  }
  .items {
    display: grid;
    gap: 26px;
  }
  .item {
    position: relative;
    padding-left: 26px;
  }
  .item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 6px;
    width: 10px;
    height: 10px;
    background: var(--er-signal);
  }
  .when {
    font-size: 12px;
    color: var(--er-muted);
  }
  .title {
    display: inline-block;
    margin-top: 6px;
    font: 700 clamp(20px, 2vw, 26px) / 1.15 var(--font-display);
    letter-spacing: -0.02em;
    color: var(--er-ink);
    text-decoration: none;
  }
  .title:hover {
    color: var(--er-signal-text);
  }
  .org {
    margin-top: 6px;
    font-size: 13px;
    color: var(--er-signal-text);
  }
  @media (max-width: 720px) {
    .year {
      grid-template-columns: 1fr;
    }
  }
</style>
