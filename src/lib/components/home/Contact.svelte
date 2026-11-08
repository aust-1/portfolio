<script lang="ts">
  import SectionHead from '#lib/components/SectionHead.svelte';
  import { SITE } from '#lib/site.ts';
</script>

<section class="container" aria-labelledby="contact">
  <SectionHead title="Contact" id="contact" />
  <div class="grid">
    <p class="t-lead intro">
      Un projet, un stage, une question sur un write-up : écrivez-moi, je réponds.
    </p>
    <ul class="links">
      <li>
        <span class="t-label">e-mail</span>
        <a class="big" href="mailto:{SITE.email}">{SITE.email}</a>
      </li>
      <li>
        <span class="t-label">linkedin</span>
        <a class="big" href={SITE.linkedin}>linkedin.com/in/eliott-roussille</a>
      </li>
      <li>
        <span class="t-label">github</span>
        <a class="big" href={SITE.github}>github.com/aust-1</a>
      </li>
      <li>
        <span class="t-label">cv</span>
        <a class="cta" href="/cv.pdf" download="CV-Eliott-Roussille.pdf">Télécharger mon CV</a>
      </li>
    </ul>
  </div>
</section>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 24px var(--gutter);
  }
  .intro {
    grid-column: 1 / span 5;
    max-width: 30ch;
  }
  .links {
    grid-column: 7 / span 6;
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 22px;
  }
  .links li {
    display: grid;
    gap: 6px;
  }
  .big {
    font: 700 clamp(20px, 2.2vw, 28px) / 1.15 var(--font-display);
    letter-spacing: -0.02em;
    color: var(--er-ink);
    text-decoration: none;
    overflow-wrap: anywhere;
  }
  .big:hover {
    color: var(--er-signal-text);
  }
  .cta {
    justify-self: start;
  }
  @media (max-width: 880px) {
    .intro,
    .links {
      grid-column: 1 / -1;
    }
  }
</style>
