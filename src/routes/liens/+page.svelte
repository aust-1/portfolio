<script lang="ts">
  import Toc from '#lib/components/motifs/Toc.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import { LIENS } from '#lib/content/liens.ts';

  const toc = LIENS.map((g, i) => ({ id: g.id, label: g.title, n: i + 1 }));
</script>

<svelte:head>
  <title>Ressources recommandées · Eliott Roussille</title>
  <meta
    name="description"
    content="Les ressources que je recommande pour apprendre la cybersécurité, les CTF, le développement et l'infrastructure."
  />
</svelte:head>

<div class="container page">
  <SectionHead title="Liens" id="titre" level={1} meta="ressources recommandées" />
  <div class="layout">
    <aside><div class="toc"><Toc items={toc} /></div></aside>
    <div class="groups">
      {#each LIENS as group (group.id)}
        <section id={group.id} aria-labelledby="{group.id}-t">
          <h2 id="{group.id}-t" class="t-title">{group.title}</h2>
          <ul>
            {#each group.links as link (link.label)}
              <li>
                <a href={link.href} rel="noopener">{link.label}</a>
                <p>{link.why}</p>
              </li>
            {/each}
          </ul>
        </section>
      {/each}
    </div>
  </div>
</div>

<style>
  .page {
    padding-top: 56px;
  }
  .layout {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 40px var(--gutter);
  }
  aside {
    grid-column: 1 / span 3;
  }
  .toc {
    position: sticky;
    top: calc(var(--nav-h) + 24px);
  }
  .groups {
    grid-column: 5 / span 8;
    display: grid;
    gap: 64px;
  }
  section {
    scroll-margin-top: 24px;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 20px 0 0;
    display: grid;
    gap: 20px;
  }
  li a {
    font: 700 22px / 1.2 var(--font-display);
    letter-spacing: -0.02em;
    color: var(--er-ink);
    text-decoration: none;
  }
  li a:hover {
    color: var(--er-signal-text);
    text-decoration: underline;
  }
  li p {
    margin-top: 4px;
    font-size: 16px;
    line-height: 1.6;
    max-width: 62ch;
  }
  @media (max-width: 880px) {
    aside {
      display: none;
    }
    .groups {
      grid-column: 1 / -1;
    }
  }
</style>
