import { useEffect, useMemo, useState } from "react";
import "./App.css";

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

const languageOptions = {
  fr: { label: "FR", name: "Français" },
  en: { label: "EN", name: "English" },
};

const languageContent = {
  fr: {
    navLinks: [
      { label: "À propos", href: "#about" },
      { label: "Projets", href: "#projects" },
      { label: "Compétences", href: "#skills" },
      { label: "Expérience", href: "#experience" },
      { label: "Formations", href: "#training" },
      { label: "Contact", href: "#contact" },
    ],
    hero: {
      eyebrow: "Ingénieur en formation · Big Data & IA",
      lead: "Déterminé et travailleur, je suis motivé à apprendre et à me développer dans divers domaines. J'aime relever les défis et je suis résolu à perfectionner mes compétences tout en contribuant à vos projets.",
      actions: {
        projects: "Voir les projets",
        resume: "Télécharger le CV",
        contact: "Me contacter",
      },
      resumeUrl: "/CV%20Eliott%20Roussille%20-%20FR%20Ver.%20-%202026.pdf",
    },
    keySkills: [
      "Architecture logicielle",
      "Full-stack",
      "Data & IA",
      "Automatisation",
      "DevOps",
    ],
    chipsLabel: "Compétences clés",
    sections: {
      projects: {
        title: "Projets sélectionnés",
        subtitle:
          "Projets associatifs, logiciels et plateformes que je maintiens.",
        cta: "Voir le projet",
      },
      skills: {
        title: "Compétences",
        subtitle: "Outils et technologies utilisés dans mes projets.",
      },
      experience: {
        title: "Expérience",
        subtitle:
          "Responsabilités associatives, pédagogie et projets techniques.",
      },
      training: {
        title: "Formations",
        subtitle:
          "Parcours d'ingénieur, double diplôme et semestre à l'international.",
      },
      contact: {
        title: "Contact",
        subtitle: "On échange ? Voici mes liens directs.",
      },
    },
    projects: [
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
        title: "Plateforme d'inscriptions à des formations",
        description:
          "Développement full-stack et conception de la base de données pour gérer inscriptions, places et données utilisateurs.",
        tags: ["TypeScript", "Svelte", "Supabase"],
        link: "https://davincibot.fr",
      },
      {
        title: "Site de documentation DaVinciBot",
        description:
          "Structuration de la documentation technique et mise en place d'un référentiel partagé pour l'association.",
        tags: ["Docusaurus", "Markdown", "Git"],
        link: "https://docs.davincibot.fr",
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
    ],
    experiences: [
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
    ],
    trainings: [
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
    ],
    contacts: [
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
        label: "GitHub",
        value: "aust-1",
        href: "https://github.com/aust-1",
      },
    ],
    accessibility: {
      themeToggleDark: "Passer en mode sombre",
      themeToggleLight: "Passer en mode clair",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
      languageToggle: "Choisir la langue",
      languageMenu: "Langues disponibles",
    },
  },
  en: {
    navLinks: [
      { label: "About", href: "#about" },
      { label: "Projects", href: "#projects" },
      { label: "Skills", href: "#skills" },
      { label: "Experience", href: "#experience" },
      { label: "Education", href: "#training" },
      { label: "Contact", href: "#contact" },
    ],
    hero: {
      eyebrow: "Engineering student · Big Data & AI",
      lead: "Determined and motivated student, eager to learn and develop skills across various fields. I enjoy tackling challenges and am committed to continuously improving my abilities while contributing to impactful projects.",
      actions: {
        projects: "See projects",
        resume: "Download resume",
        contact: "Get in touch",
      },
      resumeUrl: "/CV%20Eliott%20Roussille%20-%20EN%20Ver.%20-%202026.pdf",
    },
    keySkills: [
      "Software architecture",
      "Full-stack",
      "Data & AI",
      "Automation",
      "DevOps",
    ],
    chipsLabel: "Key skills",
    sections: {
      projects: {
        title: "Selected projects",
        subtitle: "Association projects, software, and platforms I maintain.",
        cta: "View project",
      },
      skills: {
        title: "Skills",
        subtitle: "Tools and technologies used across my projects.",
      },
      experience: {
        title: "Experience",
        subtitle:
          "Association responsibilities, teaching, and technical projects.",
      },
      training: {
        title: "Education",
        subtitle: "Engineering track, dual degree, and international semester.",
      },
      contact: {
        title: "Contact",
        subtitle: "Let's connect. Here are my direct links.",
      },
    },
    projects: [
      {
        title: "French Robotics Cup",
        description:
          "Built control software for an autonomous robot with closed-loop control and concurrent programming.",
        tags: ["C/C++", "Python", "Embedded"],
        link: "https://github.com/DaVinciBot/CoupeDeRobotique",
      },
      {
        title: "Fablab Discord Bot",
        description:
          "Backend development, business logic, and Discord ecosystem integration to automate internal management.",
        tags: ["Python", "Discord API", "Git"],
        link: "https://github.com/DeVinci-FabLab/FabLaBot",
      },
      {
        title: "Technical documentation site",
        description:
          "Designed documentation architecture and wrote technical content to centralize member documentation.",
        tags: ["Docusaurus", "Markdown", "Git"],
        link: "https://docs.devinci-fablab.fr",
      },
      {
        title: "Training registration platform",
        description:
          "Full-stack development and database design to manage registrations, seats, and user data.",
        tags: ["TypeScript", "Svelte", "Supabase"],
        link: "https://davincibot.fr",
      },
      {
        title: "DaVinciBot documentation site",
        description:
          "Structured technical documentation and set up a shared reference for the association.",
        tags: ["Docusaurus", "Markdown", "Git"],
        link: "https://docs.davincibot.fr",
      },
      {
        title: "Financial document generator",
        description:
          "Dynamic generation of official documents and standardization of formats for invoices and expense reports.",
        tags: ["LaTeX", "Automation", "Docs"],
        link: "https://fac.eliott-roussille.fr",
      },
      {
        title: "Boggle",
        description:
          "Object-oriented design and implementation of search algorithms for a constrained OOP game.",
        tags: ["C#", ".NET", "Git"],
        link: "https://github.com/aust-1/Boggle",
      },
      {
        title: "LivinParis",
        description:
          "Graph modeling, shortest paths, and application backend for a delivery app.",
        tags: ["C#", "Graphs", "MySQL"],
        link: "https://github.com/aust-1/LivinParis",
      },
    ],
    experiences: [
      {
        role: "IT Lead – French Robotics Cup",
        company: "DaVinciBot",
        period: "Since Oct 2024",
        description:
          "Leading the software track, task distribution, member training, and delivery of functional robotics software.",
        link: "https://davincibot.fr/project/coupe-de-robotique/",
      },
      {
        role: "Technical Director (IT)",
        company: "DeVinci Fablab",
        period: "Since Sep 2025",
        description:
          "Technical oversight of projects and student teams, structuring development practices and improving software quality.",
        link: "https://devinci-fablab.fr",
      },
      {
        role: "Digital team member",
        company: "DaVinciBot",
        period: "Since Nov 2025",
        description:
          "Full-stack development, contributing to association tools and building a training registration site.",
        link: "https://davincibot.fr",
      },
      {
        role: "Digital team member",
        company: "DeVinci Fablab",
        period: "Since Jun 2025",
        description:
          "Structuring the association ecosystem, designing software architectures, and maintaining internal digital tools.",
        link: "https://devinci-fablab.fr",
      },
      {
        role: "Training Lead",
        company: "DeVinci Fablab",
        period: "Apr 2025 – Dec 2025",
        description:
          "Organized and structured the technical training offer, creating coherent pathways and reusable learning materials.",
        link: "https://devinci-fablab.fr",
      },
      {
        role: "Subject Manager – Technological Development & Innovation",
        company: "EMLV",
        period: "Since Sep 2024",
        description:
          "Designed and delivered a higher-education course on project management, innovation, and prototyping. Structured educational content and popularized technical concepts.",
        link: "https://www.emlv.fr",
      },
    ],
    trainings: [
      {
        title: "International semester – exchange program",
        school: "UVIC – Universitat de Vic, Spain",
        period: "Jul 2025 – Jan 2026",
        description:
          "Courses: Database, Python, Optimization & Operational Research (100% in English).",
        link: "https://www.uvic.cat/en/",
      },
      {
        title: "3rd-year engineering program – Big Data & AI major",
        school: "ESILV – École Supérieure d'Ingénieurs Léonard de Vinci",
        period: "Since Sep 2023",
        description:
          "Associations: DeVinci Fablab, DaVinciBot, LéoLearning, DeVinci Lumière, Cordées de la Réussite.",
        link: "https://www.esilv.fr",
      },
      {
        title: "Dual degree: engineer & manager",
        school: "EMLV / ESILV",
        period: "Since Sep 2023",
        description:
          "Additional courses: law, management, corporate strategy, finance, marketing, accounting, intercultural management, sales.",
        link: "https://www.emlv.fr",
      },
      {
        title: "French Baccalaureate – Math & Physics-Chemistry",
        school: "Groupe scolaire Sœur Rosalie – Louise de Marillac (Paris 5th)",
        period: "Sep 2020 – Jul 2023",
        description:
          "Honors: highest distinction. Options: advanced math and Korean.",
        link: "https://rosalie-marillac.com/",
      },
    ],
    contacts: [
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
        label: "GitHub",
        value: "aust-1",
        href: "https://github.com/aust-1",
      },
    ],
    accessibility: {
      themeToggleDark: "Switch to dark mode",
      themeToggleLight: "Switch to light mode",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      languageToggle: "Choose language",
      languageMenu: "Available languages",
    },
  },
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState("en");
  const [languageOpen, setLanguageOpen] = useState(false);
  const content = languageContent[language];
  const shuffledSkills = useMemo(
    () => [...content.keySkills].sort(() => 0.5 - Math.random()),
    [language],
  );

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("language");
    if (storedLanguage && languageContent[storedLanguage]) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    document.body.dataset.theme = isDark ? "dark" : "light";
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("language", language);
  }, [language]);

  return (
    <div className="app">
      <header className="nav">
        <div className="nav__logo">Eliott R.</div>
        <nav className={`nav__links ${menuOpen ? "is-open" : ""}`}>
          {content.navLinks.map((link) => (
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
          <div className="lang-switcher">
            <button
              className="lang-switcher__button"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={languageOpen}
              aria-label={content.accessibility.languageToggle}
              onClick={() => setLanguageOpen((open) => !open)}
            >
              <span className="lang-switcher__label">
                {languageOptions[language].label}
              </span>
              <span className="lang-switcher__chevron" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
            <div
              className={`lang-switcher__menu ${languageOpen ? "is-open" : ""}`}
              role="listbox"
              aria-label={content.accessibility.languageMenu}
            >
              {Object.entries(languageOptions).map(([code, option]) => (
                <button
                  className={`lang-switcher__option ${
                    language === code ? "is-selected" : ""
                  }`}
                  type="button"
                  role="option"
                  aria-selected={language === code}
                  key={code}
                  onClick={() => {
                    setLanguage(code);
                    setLanguageOpen(false);
                  }}
                >
                  <span>{option.name}</span>
                  <span className="lang-switcher__code">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setIsDark((current) => !current)}
            aria-pressed={isDark}
            aria-label={
              isDark
                ? content.accessibility.themeToggleLight
                : content.accessibility.themeToggleDark
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
            aria-label={
              menuOpen
                ? content.accessibility.closeMenu
                : content.accessibility.openMenu
            }
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
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <h1>Eliott Roussille</h1>
            <p className="lead">{content.hero.lead}</p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#projects">
                {content.hero.actions.projects}
              </a>
              <a
                className="btn btn--ghost"
                href={content.hero.resumeUrl}
                download
              >
                {content.hero.actions.resume}
              </a>
              <a className="btn btn--ghost" href="#contact">
                {content.hero.actions.contact}
              </a>
            </div>
          </div>
          <div className="hero__chips">
            <p className="chips__label">{content.chipsLabel}</p>
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
            <h2>{content.sections.projects.title}</h2>
            <p>{content.sections.projects.subtitle}</p>
          </div>
          <div className="grid grid--projects">
            {content.projects.map((project) => (
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
                <span className="card__link">
                  {content.sections.projects.cta}
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="section" id="skills">
          <div className="section__header">
            <h2>{content.sections.skills.title}</h2>
            <p>{content.sections.skills.subtitle}</p>
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
            <h2>{content.sections.experience.title}</h2>
            <p>{content.sections.experience.subtitle}</p>
          </div>
          <div className="timeline">
            {content.experiences.map((exp) => (
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
            <h2>{content.sections.training.title}</h2>
            <p>{content.sections.training.subtitle}</p>
          </div>
          <div className="grid grid--training">
            {content.trainings.map((training) => (
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
            <h2>{content.sections.contact.title}</h2>
            <p>{content.sections.contact.subtitle}</p>
          </div>
          <div className="grid grid--contact">
            {content.contacts.map((contact) => (
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
