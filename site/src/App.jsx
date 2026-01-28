import { useEffect, useMemo, useState } from 'react'
import './App.css'

const keySkills = [
  'Architecture logicielle',
  'Full-stack',
  'Data & IA',
  'Automatisation',
  'DevOps',
]

const skills = [
  'Git/GitHub',
  'Python',
  'TypeScript',
  'C#',
  'C',
  'C++',
  '.NET',
  'Rust',
  'HTML',
  'CSS',
  'JavaScript',
  'Bash',
  'LaTeX',
  'Markdown',
  'Regex',
  'React',
  'Vite',
  'Next.js',
  'Svelte',
  'Tailwind CSS',
  'Node.js',
  'GraphQL',
  'Docker',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'SQLite',
  'Supabase',
  'Linux',
]

const projects = [
  {
    title: 'Site de documentation technique',
    description:
      'Conception de l\'architecture documentaire et rédaction de contenus techniques pour centraliser la documentation des membres.',
    tags: ['Docusaurus', 'Markdown', 'Git'],
    link: 'https://docs.devinci-fablab.fr',
  },
  {
    title: 'Site de documentation DaVinciBot',
    description:
      'Structuration de la documentation technique et mise en place d\'un référentiel partagé pour l\'association.',
    tags: ['Docusaurus', 'Markdown', 'Git'],
    link: 'https://docs.davincibot.fr',
  },
  {
    title: 'Bot Discord FabLab',
    description:
      'Développement backend, logique métier et intégration à l\'écosystème Discord pour automatiser la gestion interne.',
    tags: ['Python', 'Discord API', 'Git'],
    link: 'https://github.com/DeVinci-FabLab/FabLaBot',
  },
  {
    title: 'Plateforme d\'inscriptions à des formations',
    description:
      'Développement full-stack et conception de la base de données pour gérer inscriptions, places et données utilisateurs.',
    tags: ['TypeScript', 'Svelte', 'Supabase'],
    link: 'https://davincibot.fr',
  },
  {
    title: 'Générateur de documents financiers',
    description:
      'Génération dynamique de documents officiels et standardisation des formats pour factures et notes de frais.',
    tags: ['LaTeX', 'Automation', 'Docs'],
    link: 'https://fac.eliott-roussille.fr',
  },
  {
    title: 'Boggle',
    description:
      'Conception orientée objet et implémentation des algorithmes de recherche pour un jeu sous contraintes POO.',
    tags: ['C#', '.NET', 'Git'],
    link: '#',
  },
  {
    title: 'LivinParis',
    description:
      'Modélisation par graphes, plus courts chemins et backend applicatif pour une application de livraison.',
    tags: ['C#', 'Graphes', 'MySQL'],
    link: '#',
  },
  {
    title: 'Coupe de France de Robotique',
    description:
      'Développement du logiciel de contrôle d\'un robot autonome avec asservissement et programmation concurrente.',
    tags: ['C/C++', 'Python', 'Embarqué'],
    link: '#',
  },
]

const experiences = [
  {
    role: 'Directeur Technique Informatique',
    company: 'DeVinci Fablab',
    period: 'Depuis septembre 2025',
    description:
      'Supervision technique des projets et accompagnement des équipes étudiantes, structuration des pratiques de développement et amélioration de la qualité logicielle.',
  },
  {
    role: 'Membre du pôle numérique',
    company: 'DaVinciBot',
    period: 'Depuis novembre 2025',
    description:
      'Développement full-stack, contribution aux outils logiciels de l\'association et conception d\'un site d\'inscriptions aux formations.',
  },
  {
    role: 'Membre du pôle numérique',
    company: 'DeVinci Fablab',
    period: 'Depuis juin 2025',
    description:
      'Structuration de l\'écosystème associatif, conception d\'architectures logicielles et maintenance des outils numériques internes.',
  },
  {
    role: 'Responsable Formation',
    company: 'DeVinci Fablab',
    period: 'Avril 2025 — Décembre 2025',
    description:
      'Organisation et structuration de l\'offre de formation technique, création de parcours cohérents et supports pédagogiques réutilisables.',
  },
  {
    role: 'Référent Informatique — Coupe de France de Robotique',
    company: 'DaVinciBot',
    period: 'Depuis octobre 2024',
    description:
      'Pilotage de la partie informatique, répartition des tâches, formation des membres et livraison de logiciels robotiques fonctionnels.',
  },
  {
    role: 'Responsable de module — Développement Technologique et Innovation',
    company: 'EMLV',
    period: 'Depuis septembre 2024',
    description:
      'Conception et encadrement d\'un module orienté projet et innovation, accompagnement à la montée en compétences techniques.',
  },
  {
    role: 'Trésorier',
    company: 'DeVinci Lumière',
    period: 'Avril 2024 — Mai 2025',
    description:
      'Gestion financière et suivi administratif, documents normalisés et automatisation partielle des processus.',
  },
]

const trainings = [
  {
    title: 'Semestre à l\'international — programme d\'échange',
    school: 'UVIC — Universitat de Vic, Espagne',
    period: 'Juillet 2025 — Janvier 2026',
    description:
      'Cours suivis : Database, Python, “Optimization & Operational Research” (100% en anglais).',
  },
  {
    title: '3ème année d\'études d\'ingénieur — majeure Big Data et IA',
    school: 'ESILV — École Supérieure d\'Ingénieurs Léonard de Vinci',
    period: 'Depuis septembre 2023',
    description:
      'Associations : DeVinci Fablab, DaVinciBot, LéoLearning, DeVinci Lumière, Cordées de la Réussite.',
  },
  {
    title: 'Double diplôme ingénieur manager',
    school: 'EMLV / ESILV',
    period: 'Depuis septembre 2023',
    description:
      'Cours additionnels : droit, gestion, corporate strategy, finance, marketing, comptabilité, intercultural management, vente.',
  },
  {
    title: 'Baccalauréat général — spécialités Maths & Physique-Chimie',
    school: 'Groupe scolaire Sœur Rosalie — Louise de Marillac (Paris 5e)',
    period: 'Septembre 2020 — Juillet 2023',
    description:
      'Mention Très bien. Options : Mathématiques expertes et Coréen.',
  },
]

const contacts = [
  {
    label: 'Email',
    value: 'eliottroussille@gmail.com',
    href: 'mailto:eliottroussille@gmail.com',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/eliott-roussille',
    href: 'https://linkedin.com/in/eliott-roussille/',
  },
  {
    label: 'Github',
    value: 'aust-1',
    href: 'https://github.com/aust-1',
  },
]

const navLinks = [
  { label: 'À propos', href: '#about' },
  { label: 'Projets', href: '#projects' },
  { label: 'Compétences', href: '#skills' },
  { label: 'Expérience', href: '#experience' },
  { label: 'Formations', href: '#training' },
  { label: 'Contact', href: '#contact' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const shuffledSkills = useMemo(() => [...keySkills].sort(() => 0.5 - Math.random()), [])

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme')
    if (storedTheme === 'dark') {
      setIsDark(true)
    }
  }, [])

  useEffect(() => {
    document.body.dataset.theme = isDark ? 'dark' : 'light'
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <div className="app">
      <header className="nav">
        <div className="nav__logo">Eliott R.</div>
        <nav className={`nav__links ${menuOpen ? 'is-open' : ''}`}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
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
          >
            {isDark ? 'Mode clair' : 'Mode sombre'}
          </button>
          <button
            className={`nav__burger ${menuOpen ? 'is-open' : ''}`}
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
            <h1>
              Eliott Roussille
            </h1>
            <p className="lead">
              Étudiant en 3ème année d'école d'ingénieur, je développe des outils
              numériques pour les associations du PULV, avec un focus sur les
              architectures solides, la documentation et le produit.
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
              <p>Projets associatifs, logiciels et plateformes que je maintiens.</p>
            </div>
          <div className="grid grid--projects">
            {projects.map((project) => (
              <article className="card" key={project.title}>
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
                <a className="card__link" href={project.link}>
                  Voir le projet
                </a>
              </article>
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
              <p>Responsabilités associatives, pédagogie et projets techniques.</p>
            </div>
          <div className="timeline">
            {experiences.map((exp) => (
              <article className="timeline__item" key={exp.role}>
                <div>
                  <h3>{exp.role}</h3>
                  <p className="timeline__meta">
                    {exp.company} · {exp.period}
                  </p>
                  <p>{exp.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="training">
            <div className="section__header">
              <h2>Formations</h2>
              <p>Parcours d'ingénieur, double diplôme et semestre à l'international.</p>
            </div>
          <div className="grid grid--training">
            {trainings.map((training) => (
              <article className="card" key={training.title}>
                <h3>{training.title}</h3>
                <p className="timeline__meta">
                  {training.school} · {training.period}
                </p>
                <p>{training.description}</p>
              </article>
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
              <a className="contact" href={contact.href} key={contact.label}>
                <span>{contact.label}</span>
                <span>{contact.value}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
