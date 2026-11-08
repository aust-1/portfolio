<script lang="ts">
  import '#lib/styles/prose.css';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import { SITE } from '#lib/site.ts';
</script>

<svelte:head>
  <title>À propos · Eliott Roussille</title>
  <meta
    name="description"
    content="Eliott Roussille, étudiant ingénieur en cybersécurité à l'ESILV en double diplôme avec l'EMLV."
  />
</svelte:head>

<div class="container page">
  <SectionHead title="À propos" id="titre" level={1} />

  <div class="layout">
    <aside>
      <picture class="no-grain">
        <source srcset="/media/eliott-roussille.avif" type="image/avif" />
        <source srcset="/media/eliott-roussille.webp" type="image/webp" />
        <img src="/media/eliott-roussille.jpg" alt="Eliott Roussille" width="800" height="800" />
      </picture>
      <p class="sign t-ui">Eliott Roussille <span>@aust-1</span></p>
    </aside>

    <div class="prose">
      <p class="t-hook hook">{SITE.hook}</p>

      <p>
        Je construis et j'exploite des systèmes qui doivent tourner sans moi : des robots autonomes,
        des infrastructures auto-hébergées, des applications web. Et je cherche ce qui les fait
        tomber, en CTF et en bug bounty.
      </p>

      <h2 id="parcours">Ingénieur et manager</h2>
      <p>
        Je suis en 4e année à l'ESILV, majeure Objets connectés et cybersécurité, parcours
        Souveraineté numérique et défense. Je prépare en parallèle le Master Management de l'EMLV,
        en double diplôme. Les deux cursus se répondent : je comprends un système de l'intérieur, et
        je sais piloter les personnes qui le construisent.
      </p>
      <p>
        Mes engagements m'ont mis tôt en situation d'encadrement : responsable d'un module
        académique à l'EMLV, directeur technique informatique au FabLab, trésorier d'association, et
        aujourd'hui chef de projet de l'équipe Coupe de France de Robotique de DaVinciBot.
      </p>

      <h2 id="interets">Ce qui m'intéresse</h2>
      <ul>
        <li>La fiabilité et la souveraineté des systèmes : savoir où tournent les données.</li>
        <li>Pouvoir reconstruire une stack de zéro, à partir de sa seule configuration.</li>
        <li>Écrire du code dont la logique reste lisible six mois plus tard.</li>
        <li>
          Comprendre une vulnérabilité assez finement pour en concevoir une, pas seulement
          l'exploiter.
        </li>
      </ul>

      <h2 id="methode">Comment je travaille</h2>
      <p>
        Typage strict, linting et formatage systématiques, revue de code, documentation. Je lis
        avant d'exécuter, je mesure avant d'optimiser, et je préfère un fait vérifiable à un
        adjectif.
      </p>

      <h2 id="suite">La suite</h2>
      <p>
        D'avril à septembre 2027, je rejoins les équipes de tests SI de Bouygues Telecom pour un
        stage en pentest et sécurité applicative : tests d'intrusion web et API, qualification des
        vulnérabilités et restitution aux équipes de développement.
      </p>

      <div class="actions">
        <a class="cta" href="/cv.pdf" download="CV-Eliott-Roussille.pdf">Télécharger mon CV</a>
        <a class="link-mono" href={SITE.github}>GitHub</a>
        <a class="link-mono" href={SITE.linkedin}>LinkedIn</a>
        <a class="link-mono" href="mailto:{SITE.email}">{SITE.email}</a>
      </div>
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
    grid-column: 1 / span 4;
  }
  aside img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
  }
  .sign {
    margin-top: 14px;
    font-size: 14px;
  }
  .sign span {
    color: var(--er-signal-text);
  }
  .prose {
    grid-column: 6 / span 7;
  }
  .hook {
    color: var(--er-ink);
    margin-bottom: 1.2em;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px 24px;
    margin-top: 2.4em;
  }
  .actions .link-mono {
    color: var(--er-ink);
  }
  @media (max-width: 880px) {
    aside {
      grid-column: 1 / -1;
      max-width: 280px;
    }
    .prose {
      grid-column: 1 / -1;
    }
  }
</style>
