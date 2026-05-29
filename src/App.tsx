import React from "react";
import "./styles/main.css";
import "./styles/font.css";
import "./styles/spacing.css";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import SiteHeader from "./components/layout/SiteHeader.tsx";
import SiteFooter from "./components/layout/SiteFooter.tsx";
import HeroSection from "./components/hero/HeroSection.tsx";

const PROJECTS = [
  {
    title: "Nebula Commerce",
    meta: "React · Node · PostgreSQL",
    desc: "A full-stack e-commerce platform with cart, checkout, and admin dashboard. Placeholder copy for your case study.",
  },
  {
    title: "Pulse Analytics",
    meta: "TypeScript · GraphQL · AWS",
    desc: "Real-time analytics dashboard for product teams. Dummy project description until final content is ready.",
  },
  {
    title: "Orbit Tasks",
    meta: "React Native · Firebase",
    desc: "Cross-platform task manager with offline sync and push notifications. Sample card for portfolio layout.",
  },
];

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SiteHeader />
      <HeroSection />

      <main className="page-main">
        <section id="about" className="section" aria-labelledby="about-heading">
          <div className="section__inner">
            <p className="section__label bricolage-grotesque">About</p>
            <h2 id="about-heading" className="section__title playwrite-nz-basic">
              Building thoughtful digital products
            </h2>
            <p className="section__body bricolage-grotesque">
              I am a full stack developer focused on crafting reliable web applications
              from database design through to polished user interfaces. Replace this
              paragraph with your own story when ready.
            </p>
            <p className="section__body bricolage-grotesque">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </section>

        <section id="projects" className="section" aria-labelledby="projects-heading">
          <div className="section__inner">
            <p className="section__label bricolage-grotesque">Selected Work</p>
            <h2 id="projects-heading" className="section__title playwrite-nz-basic">
              Projects
            </h2>
            <p className="section__body bricolage-grotesque">
              Sample builds showcasing full stack work. Swap in your real projects later.
            </p>
            <div className="card-grid">
              {PROJECTS.map((project) => (
                <article key={project.title} className="card">
                  <h3 className="card__title bricolage-grotesque">{project.title}</h3>
                  <p className="card__meta bricolage-grotesque">{project.meta}</p>
                  <p className="card__desc bricolage-grotesque">{project.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="section" aria-labelledby="education-heading">
          <div className="section__inner">
            <p className="section__label bricolage-grotesque">Background</p>
            <h2 id="education-heading" className="section__title playwrite-nz-basic">
              Education & Certificates
            </h2>
            <ul className="edu-list">
              <li className="edu-list__item">
                <p className="edu-list__degree bricolage-grotesque">
                  Bachelor of Engineering — Information Technology
                </p>
                <p className="edu-list__school bricolage-grotesque">
                  West Yangon Technological University
                </p>
              </li>
              <li className="edu-list__item">
                <p className="edu-list__degree bricolage-grotesque">
                  Project Management
                </p>
                <p className="edu-list__school bricolage-grotesque">
                  Strategy First University
                </p>
              </li>
              <li className="edu-list__item">
                <p className="edu-list__degree bricolage-grotesque">
                  Full Stack Web Development — Certificate
                </p>
                <p className="edu-list__school bricolage-grotesque">
                  Online program · Placeholder entry
                </p>
              </li>
            </ul>
          </div>
        </section>

        <section id="contact" className="section" aria-labelledby="contact-heading">
          <div className="section__inner">
            <p className="section__label bricolage-grotesque">Get in touch</p>
            <h2 id="contact-heading" className="section__title playwrite-nz-basic">
              Contact
            </h2>
            <p className="section__body bricolage-grotesque">
              Open to freelance and full-time opportunities. Update the links below
              with your real email and profiles.
            </p>
            <div className="contact-links">
              <a href="mailto:lawunsoso.info@gmail.com" className="btn btn--primary bricolage-grotesque">
                Email me
              </a>
              <a
                href="https://github.com/LaWunSoSo-Lab"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost bricolage-grotesque"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost bricolage-grotesque"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </ThemeProvider>
  );
};

export default App;
