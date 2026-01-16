import { useEffect, useMemo, useState } from 'react'
import './App.css'

const skills = [
  'Git',
  'Bash',
  'Linux',
  'Python',
  'Docker',
  'PostgreSQL',
  'NoSQL',
  'TypeScript',
]

const projects = Array.from({ length: 8 }).map((_, index) => ({
  title: `Projet ${index + 1}`,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet risus a leo auctor dictum.',
  tags: ['API', 'UI', 'Ops'],
  link: '#',
}))

const experiences = [
  {
    role: 'Ingénieur Logiciel',
    company: 'Entreprise Créative',
    period: '2024 — Aujourd’hui',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempor turpis non elit consequat, sed laoreet massa aliquet.',
  },
  {
    role: 'Développeur Full Stack',
    company: 'Studio Digital',
    period: '2022 — 2024',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum malesuada neque sit amet libero aliquet, a semper libero dignissim.',
  },
  {
    role: 'Développeur Backend',
    company: 'Startup Tech',
    period: '2020 — 2022',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam erat volutpat. Pellentesque ac mi sit amet nunc posuere.',
  },
  {
    role: 'Développeur Junior',
    company: 'Agence Web',
    period: '2018 — 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse potenti. Integer at libero sit amet magna congue.',
  },
  {
    role: 'Stagiaire Développement',
    company: 'Lab Innovation',
    period: '2017 — 2018',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin euismod est sed neque feugiat, quis malesuada lectus aliquet.',
  },
]

const trainings = [
  {
    title: 'Master Informatique',
    school: 'Université Exemple',
    period: '2016 — 2018',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget turpis sed arcu tempor volutpat.',
  },
  {
    title: 'Licence Informatique',
    school: 'Université Exemple',
    period: '2013 — 2016',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer bibendum ipsum at augue accumsan.',
  },
  {
    title: 'DUT Informatique',
    school: 'IUT Créatif',
    period: '2011 — 2013',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae velit vitae sem volutpat posuere.',
  },
  {
    title: 'Certification Cloud',
    school: 'Open Academy',
    period: '2019',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin massa nec ipsum faucibus.',
  },
]

const contacts = [
  {
    label: 'Email',
    value: 'eliottroussille@gmail.com',
    href: 'mailto:eliottroussille@gmail.com',
  },
  {
    label: 'GitHub',
    value: 'github.com/aust-1',
    href: 'https://github.com/aust-1/',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/eliott-roussille',
    href: 'https://linkedin.com/in/eliott-roussille/',
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
  const shuffledSkills = useMemo(() => [...skills].sort(() => 0.5 - Math.random()), [])

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
            <p className="eyebrow">Développeur créatif & orienté impact</p>
            <h1>
              Eliott Roussille — portfolio créatif pour explorer mes projets,
              compétences et parcours.
            </h1>
            <p className="lead">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus
              orci ut pretium feugiat. Donec consectetur justo vitae libero
              imperdiet, eu facilisis lorem dignissim.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#projects">
                Voir les projets
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
              Une collection de projets récents. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit.
            </p>
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
            <p>Un aperçu des outils et technologies que j’utilise.</p>
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
            <p>5 expériences professionnelles récentes.</p>
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
            <p>4 formations et certifications principales.</p>
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
