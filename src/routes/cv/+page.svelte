<script lang="ts">
  import { formatMonth, formatPeriod, formatStatus } from '#lib/format.ts';
  import { SITE } from '#lib/site.ts';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const today = new Date();
</script>

<svelte:head>
  <title>CV · Eliott Roussille</title>
  <meta
    name="description"
    content="CV d'Eliott Roussille, étudiant ingénieur en cybersécurité, avec les liens vers chaque projet."
  />
</svelte:head>

<!-- Même contenu que la timeline, mis en page comme un CV, imprimable. -->
<article class="container cv">
  <header class="head">
    <div>
      <h1 class="t-section">Eliott Roussille<span class="u">_</span></h1>
      <p class="t-lead">{SITE.subtitle}</p>
      <p class="hook">{SITE.hook}</p>
    </div>
    <ul class="contact t-mono">
      <li><a href="mailto:{SITE.email}">{SITE.email}</a></li>
      <li><a href={SITE.linkedin}>linkedin.com/in/eliott-roussille</a></li>
      <li><a href={SITE.github}>github.com/aust-1</a></li>
      <li class="noprint">
        <a class="cta" href="/cv.pdf" download="CV-Eliott-Roussille.pdf">Version PDF</a>
      </li>
    </ul>
  </header>

  <section aria-labelledby="exp">
    <h2 id="exp" class="t-title">Expériences</h2>
    <ol class="entries">
      {#each data.experiences as r (r.slug)}
        <li>
          <p class="when t-mono">
            {formatPeriod(r.period)} · {formatStatus(r.period, today)}
          </p>
          <div>
            <h3><a href="/parcours/{r.slug}">{r.title}</a></h3>
            <p class="org t-mono">{r.organization}{r.place ? ` · ${r.place}` : ''}</p>
            {#if r.missions.length}
              <ul class="missions">
                {#each r.missions.slice(0, 3) as m (m)}<li>{m}</li>{/each}
              </ul>
            {/if}
            {#if r.relatedProjects.length}
              <p class="linked t-mono">
                projets :
                {#each r.relatedProjects as p, i (p)}{i ? ', ' : ''}<a href="/projets/{p}"
                    >{data.projects.find((x) => x.slug === p)?.title ?? p}</a
                  >{/each}
              </p>
            {/if}
          </div>
        </li>
      {/each}
    </ol>
  </section>

  <section aria-labelledby="form">
    <h2 id="form" class="t-title">Formation</h2>
    <ol class="entries">
      {#each data.formations as r (r.slug)}
        <li>
          <p class="when t-mono">{formatPeriod(r.period)}</p>
          <div>
            <h3><a href="/parcours/{r.slug}">{r.title}</a></h3>
            <p class="org t-mono">{r.organization}{r.place ? ` · ${r.place}` : ''}</p>
            {#if r.summary}<p class="sum">{r.summary}</p>{/if}
          </div>
        </li>
      {/each}
    </ol>
  </section>

  <section aria-labelledby="proj">
    <h2 id="proj" class="t-title">Projets</h2>
    <ul class="projects">
      {#each data.projects as p (p.slug)}
        <li>
          <a href="/projets/{p.slug}">{p.title}</a>
          <span class="t-mono">{formatPeriod(p.period)}</span>
          <p>{p.summary}</p>
        </li>
      {/each}
    </ul>
  </section>

  <section aria-labelledby="cert">
    <h2 id="cert" class="t-title">Certifications et langues</h2>
    <ul class="certs">
      {#each data.awards as a (a.title)}
        <li>
          <strong>{a.title}</strong>
          <span class="t-mono"
            >{a.issuer} · {formatMonth(a.date)}{a.detail ? ` · ${a.detail}` : ''}</span
          >
        </li>
      {/each}
      <li><strong>Français</strong> <span class="t-mono">langue maternelle</span></li>
      <li><strong>Anglais</strong> <span class="t-mono">B2+, cours suivis en anglais</span></li>
    </ul>
  </section>
</article>

<style>
  .cv {
    padding-top: 56px;
    max-width: 1100px;
  }
  .head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 24px;
    padding-bottom: 28px;
    border-bottom: 2px solid var(--er-ink);
  }
  .u {
    color: var(--er-signal);
  }
  .head .t-lead {
    margin-top: 14px;
  }
  .hook {
    margin-top: 8px;
    font-size: 16px;
  }
  .contact {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 8px;
    font-size: 14px;
    align-content: start;
  }
  .contact a:not(.cta) {
    color: var(--er-ink);
  }
  section {
    margin-top: 56px;
  }
  h2 {
    margin-bottom: 20px;
  }
  .entries {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 24px;
  }
  .entries > li {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 6px var(--gutter);
  }
  .when {
    font-size: 13px;
    color: var(--er-muted);
    padding-top: 4px;
  }
  h3 {
    font: 700 21px / 1.2 var(--font-display);
    letter-spacing: -0.02em;
  }
  h3 a {
    color: var(--er-ink);
    text-decoration: none;
  }
  h3 a:hover {
    color: var(--er-signal-text);
  }
  .org {
    font-size: 13px;
    color: var(--er-signal-text);
    margin-top: 4px;
  }
  .missions {
    margin: 8px 0 0;
    padding-left: 1.1em;
    font-size: 16px;
    line-height: 1.55;
  }
  .linked,
  .sum {
    margin-top: 6px;
    font-size: 13px;
  }
  .sum {
    font-size: 16px;
  }
  .projects,
  .certs {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 14px;
  }
  .projects a,
  .certs strong {
    font: 700 19px / 1.2 var(--font-display);
    color: var(--er-ink);
  }
  .projects span,
  .certs span {
    margin-left: 10px;
    font-size: 13px;
    color: var(--er-muted);
  }
  .projects p {
    font-size: 16px;
    margin-top: 2px;
  }
  @media (max-width: 720px) {
    .entries > li {
      grid-template-columns: 1fr;
    }
  }
  @media print {
    .noprint {
      display: none;
    }
    section {
      margin-top: 28px;
      break-inside: avoid-page;
    }
  }
</style>
