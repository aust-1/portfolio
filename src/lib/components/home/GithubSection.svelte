<script lang="ts">
  import SectionHead from '#lib/components/SectionHead.svelte';
  import type { GithubStats } from '#lib/github/normalize.ts';
  import { SITE } from '#lib/site.ts';

  let { stats }: { stats: GithubStats } = $props();

  const date = $derived(
    new Date(stats.fetchedAt).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Europe/Paris',
    }),
  );
  const scope = $derived(stats.source === 'live' ? 'au total' : 'sur 12 mois');
  const fmt = (n: number) => n.toLocaleString('fr-FR');
  const max = $derived(Math.max(...stats.languages.map((l) => l.share), 0.0001));

  const tiles = $derived([
    { value: stats.contributions.commits, label: `commits ${scope}` },
    {
      value: stats.contributions.prs + stats.contributions.reviews,
      label: `pull requests et revues ${scope}`,
    },
    { value: stats.repoCount, label: 'dépôts publics' },
    ...(stats.linesChanged > 0 ? [{ value: stats.linesChanged, label: 'lignes modifiées' }] : []),
  ]);
</script>

<section class="container" aria-labelledby="github">
  <SectionHead title="GitHub" id="github" meta="données du {date}">
    <a href={SITE.github} class="link-mono">github.com/aust-1</a>
  </SectionHead>

  <ul class="tiles">
    {#each tiles as t (t.label)}
      <li>
        <span class="num">{fmt(t.value)}</span>
        <span class="t-label">{t.label}</span>
      </li>
    {/each}
  </ul>

  <div class="cols">
    <div>
      <h3 class="t-label">langages (part du code des dépôts publics)</h3>
      <ol class="langs">
        {#each stats.languages as l (l.name)}
          <li title="{l.name} : {Math.round(l.share * 100)} %">
            <span class="name t-mono">{l.name}</span>
            <span class="track"
              ><span class="fill" style:width="{(l.share / max) * 100}%"></span></span
            >
            <span class="pct t-mono">{Math.round(l.share * 100)} %</span>
          </li>
        {/each}
      </ol>
    </div>
    <div>
      <h3 class="t-label">dépôts récents</h3>
      <ul class="repos">
        {#each stats.recent as r (r.name)}
          <li>
            <a href={r.url}>{r.name}</a>
            {#if r.description}<p>{r.description}</p>{/if}
            <span class="t-mono meta">
              {r.language ?? '·'} · {new Date(r.pushedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                timeZone: 'Europe/Paris',
              })}
            </span>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>

<style>
  .tiles {
    list-style: none;
    padding: 0;
    margin: 0 0 48px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--gutter);
  }
  .tiles li {
    display: grid;
    gap: 8px;
    padding: 20px 24px;
    background: var(--er-surface);
  }
  .num {
    font: 900 clamp(40px, 4.4vw, 64px) / 0.9 var(--font-display);
    letter-spacing: -0.04em;
    color: var(--er-ink);
  }
  .cols {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 48px var(--gutter);
  }
  h3 {
    margin-bottom: 16px;
  }
  .langs {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 10px;
  }
  .langs li {
    display: grid;
    grid-template-columns: 110px 1fr 48px;
    align-items: center;
    gap: 12px;
  }
  .name,
  .pct {
    font-size: 13px;
    color: var(--er-ink);
  }
  .pct {
    text-align: right;
    color: var(--er-text);
  }
  .track {
    height: 12px;
  }
  .fill {
    display: block;
    height: 100%;
    background: var(--er-ink);
    border-radius: 0 4px 4px 0;
  }
  .langs li:first-child .fill {
    background: var(--er-signal);
  }
  .repos {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 16px;
  }
  .repos a {
    font: 700 19px / 1.2 var(--font-display);
    color: var(--er-ink);
    text-decoration: none;
  }
  .repos a:hover {
    color: var(--er-signal-text);
  }
  .repos p {
    font-size: 15px;
    line-height: 1.5;
    margin-top: 2px;
  }
  .meta {
    display: block;
    font-size: 12px;
    color: var(--er-muted);
  }
  @media (max-width: 880px) {
    .cols {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
