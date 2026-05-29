import React from "react";
import ThemeToggle from "./ThemeToggle.tsx";

const NAV_ITEMS = [
  { label: "About", id: "about" },
  { label: "Work", id: "projects" },
  { label: "Education", id: "education" },
  { label: "Contact", id: "contact" },
] as const;

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const SiteHeader: React.FC = () => {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <button
          type="button"
          className="site-header__logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          LWSS
        </button>
        <nav className="site-header__nav" aria-label="Main">
          {NAV_ITEMS.map(({ label, id }) => (
            <button
              key={id}
              type="button"
              className="site-header__link"
              onClick={() => scrollToSection(id)}
            >
              {label}
            </button>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
