import { useEffect, useMemo, useState } from "react";
import "./App.css";

const keySkills = [
  "Architecture logicielle",
  "Full-stack",
  "Data & IA",
  "Automatisation",
  "DevOps",
];

const skills = [
  "Git/GitHub",
  "Docker",
  "Python",
  "TypeScript",
  "C#",
  "C",
  "C++",
  ".NET",
  "Rust",
  "HTML",
  "CSS",
  "Bash",
  "LaTeX",
  "Markdown",
  "Svelte",
  "Tailwind CSS",
  "Node.js",
  "GraphQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "SQLite",
  "Supabase",
  "Linux",
];

const projects = [
  {
    title: "Coupe de France de Robotique",
    description:
      "Développement du logiciel de contrôle d'un robot autonome avec asservissement et programmation concurrente.",
    tags: ["C/C++", "Python", "Embarqué"],
    link: "https://github.com/DaVinciBot/CoupeDeRobotique",
  },
  {
    title: "Bot Discord Fablab",
    description:
      "Développement backend, logique métier et intégration à l'écosystème Discord pour automatiser la gestion interne.",
    tags: ["Python", "Discord API", "Git"],
    link: "https://github.com/DeVinci-FabLab/FabLaBot",
  },
  {
    title: "Site de documentation technique",
    description:
      "Conception de l'architecture documentaire et rédaction de contenus techniques pour centraliser la documentation des membres.",
    tags: ["Docusaurus", "Markdown", "Git"],
    link: "https://docs.devinci-fablab.fr",
  },
  {
    title: "Site de documentation DaVinciBot",
    description:
      "Structuration de la documentation technique et mise en place d'un référentiel partagé pour l'association.",
    tags: ["Docusaurus", "Markdown", "Git"],
    link: "https://docs.davincibot.fr",
  },
  {
    title: "Plateforme d'inscriptions à des formations",
    description:
      "Développement full-stack et conception de la base de données pour gérer inscriptions, places et données utilisateurs.",
    tags: ["TypeScript", "Svelte", "Supabase"],
    link: "https://davincibot.fr",
  },
  {
    title: "Générateur de documents financiers",
    description:
      "Génération dynamique de documents officiels et standardisation des formats pour factures et notes de frais.",
    tags: ["LaTeX", "Automation", "Docs"],
    link: "https://fac.eliott-roussille.fr",
  },
  {
    title: "Boggle",
    description:
      "Conception orientée objet et implémentation des algorithmes de recherche pour un jeu sous contraintes POO.",
    tags: ["C#", ".NET", "Git"],
    link: "https://github.com/aust-1/Boggle",
  },
  {
    title: "LivinParis",
    description:
      "Modélisation par graphes, plus courts chemins et backend applicatif pour une application de livraison.",
    tags: ["C#", "Graphes", "MySQL"],
    link: "https://github.com/aust-1/LivinParis",
  },
];

const experiences = [
  {
    role: "Référent Informatique – Coupe de France de Robotique",
    company: "DaVinciBot",
    period: "Depuis octobre 2024",
    description:
      "Pilotage de la partie informatique, répartition des tâches, formation des membres et livraison de logiciels robotiques fonctionnels.",
    link: "https://davincibot.fr/project/coupe-de-robotique/",
  },
  {
    role: "Directeur Technique Informatique",
    company: "DeVinci Fablab",
    period: "Depuis septembre 2025",
    description:
      "Supervision technique des projets et accompagnement des équipes étudiantes, structuration des pratiques de développement et amélioration de la qualité logicielle.",
    link: "https://devinci-fablab.fr",
  },
  {
    role: "Membre du pôle numérique",
    company: "DaVinciBot",
    period: "Depuis novembre 2025",
    description:
      "Développement full-stack, contribution aux outils logiciels de l'association et conception d'un site d'inscriptions aux formations.",
    link: "https://davincibot.fr",
  },
  {
    role: "Membre du pôle numérique",
    company: "DeVinci Fablab",
    period: "Depuis juin 2025",
    description:
      "Structuration de l'écosystème associatif, conception d'architectures logicielles et maintenance des outils numériques internes.",
    link: "https://devinci-fablab.fr",
  },
  {
    role: "Responsable Formation",
    company: "DeVinci Fablab",
    period: "Avril 2025 – Décembre 2025",
    description:
      "Organisation et structuration de l'offre de formation technique, création de parcours cohérents et supports pédagogiques réutilisables.",
    link: "https://devinci-fablab.fr",
  },
  {
    role: "Responsable de module – Développement Technologique et Innovation",
    company: "EMLV",
    period: "Depuis septembre 2024",
    description:
      "Conception et encadrement d'un module orienté projet et innovation, accompagnement à la montée en compétences techniques.",
    link: "https://www.emlv.fr",
  },
];

const trainings = [
  {
    title: "Semestre à l'international – programme d'échange",
    school: "UVIC – Universitat de Vic, Espagne",
    period: "Juillet 2025 – Janvier 2026",
    description:
      "Cours suivis : Database, Python, “Optimization & Operational Research” (100% en anglais).",
    link: "https://www.uvic.cat/en/",
  },
  {
    title: "3ème année d'études d'ingénieur – majeure Big Data et IA",
    school: "ESILV – École Supérieure d'Ingénieurs Léonard de Vinci",
    period: "Depuis septembre 2023",
    description:
      "Associations : DeVinci Fablab, DaVinciBot, LéoLearning, DeVinci Lumière, Cordées de la Réussite.",
    link: "https://www.esilv.fr",
  },
  {
    title: "Double diplôme ingénieur manager",
    school: "EMLV / ESILV",
    period: "Depuis septembre 2023",
    description:
      "Cours additionnels : droit, gestion, corporate strategy, finance, marketing, comptabilité, intercultural management, vente.",
    link: "https://www.emlv.fr",
  },
  {
    title: "Baccalauréat général – spécialités Maths & Physique-Chimie",
    school: "Groupe scolaire Sœur Rosalie – Louise de Marillac (Paris 5e)",
    period: "Septembre 2020 – Juillet 2023",
    description:
      "Mention Très bien. Options : Mathématiques expertes et Coréen.",
    link: "https://rosalie-marillac.com/",
  },
];

const contacts = [
  {
    label: "Email",
    value: "eliottroussille@gmail.com",
    href: "mailto:eliottroussille@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/eliott-roussille",
    href: "https://linkedin.com/in/eliott-roussille/",
  },
  {
    label: "Github",
    value: "aust-1",
    href: "https://github.com/aust-1",
  },
];

const navLinks = [
  { label: "À propos", href: "#about" },
  { label: "Projets", href: "#projects" },
  { label: "Compétences", href: "#skills" },
  { label: "Expérience", href: "#experience" },
  { label: "Formations", href: "#training" },
  { label: "Contact", href: "#contact" },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const shuffledSkills = useMemo(
    () => [...keySkills].sort(() => 0.5 - Math.random()),
    [],
  );

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    document.body.dataset.theme = isDark ? "dark" : "light";
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="app">
      <header className="nav">
        <div className="nav__logo">Eliott R.</div>
        <nav className={`nav__links ${menuOpen ? "is-open" : ""}`}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav__actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setIsDark((current) => !current)}
            aria-pressed={isDark}
            aria-label={
              isDark ? "Passer en mode clair" : "Passer en mode sombre"
            }
          >
            {isDark ? (
              <span className="theme-toggle__icon" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-sun-icon lucide-sun"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              </span>
            ) : (
              <span className="theme-toggle__icon" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-moon-icon lucide-moon"
                >
                  <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
                </svg>
              </span>
            )}
          </button>
          <button
            className={`nav__burger ${menuOpen ? "is-open" : ""}`}
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="about">
          <div className="hero__content">
            <p className="eyebrow">Ingénieur en formation · Big Data & IA</p>
            <h1>Eliott Roussille</h1>
            <p className="lead">
              Étudiant en 3ème année d'école d'ingénieur, je développe des
              outils numériques pour les associations du PULV, avec un focus sur
              les architectures solides, la documentation et le produit.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#projects">
                Voir les projets
              </a>
              <a
                className="btn btn--ghost"
                href="/CV%20Eliott%20Roussille%20-%20FR%20Ver.%20-%202026.pdf"
                download
              >
                Télécharger le CV
              </a>
              <a className="btn btn--ghost" href="#contact">
                Me contacter
              </a>
            </div>
          </div>
          <div className="hero__chips">
            <p className="chips__label">Compétences clés</p>
            <div className="chips__grid">
              {shuffledSkills.map((skill, index) => (
                <span
                  className="chip"
                  style={{ animationDelay: `${index * 0.08}s` }}
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="projects">
          <div className="section__header">
            <h2>Projets sélectionnés</h2>
            <p>
              Projets associatifs, logiciels et plateformes que je maintiens.
            </p>
          </div>
          <div className="grid grid--projects">
            {projects.map((project) => (
              <a
                className="card card--link"
                key={project.title}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="card__media">
                  <div className="card__icon">⬡</div>
                  <div className="card__tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="card__body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <span className="card__link">Voir le projet</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section" id="skills">
          <div className="section__header">
            <h2>Compétences</h2>
            <p>Outils et technologies utilisés dans mes projets.</p>
          </div>
          <div className="grid grid--skills">
            {skills.map((skill) => (
              <div className="skill" key={skill}>
                <span className="skill__icon">◆</span>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="experience">
          <div className="section__header">
            <h2>Expérience</h2>
            <p>
              Responsabilités associatives, pédagogie et projets techniques.
            </p>
          </div>
          <div className="timeline">
            {experiences.map((exp) => (
              <a
                className="timeline__item timeline__item--link"
                key={exp.role}
                href={exp.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div>
                  <h3>{exp.role}</h3>
                  <p className="timeline__meta">
                    {exp.company} · {exp.period}
                  </p>
                  <p>{exp.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="section" id="training">
          <div className="section__header">
            <h2>Formations</h2>
            <p>
              Parcours d'ingénieur, double diplôme et semestre à
              l'international.
            </p>
          </div>
          <div className="grid grid--training">
            {trainings.map((training) => (
              <a
                className="card card--link"
                key={training.title}
                href={training.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3>{training.title}</h3>
                <p className="timeline__meta">
                  {training.school} · {training.period}
                </p>
                <p>{training.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="section" id="contact">
          <div className="section__header">
            <h2>Contact</h2>
            <p>On échange ? Voici mes liens directs.</p>
          </div>
          <div className="grid grid--contact">
            {contacts.map((contact) => (
              <a
                className="contact"
                href={contact.href}
                key={contact.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{contact.label}</span>
                <span>{contact.value}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
