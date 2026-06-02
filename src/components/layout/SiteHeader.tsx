/**
 * SiteHeader Component
 * 
 * Renders the main navigation header with:
 * - Logo/brand button (scrolls to top)
 * - Navigation links to page sections
 * - Theme toggle switch
 * 
 * Navigation items use smooth scroll behavior for better UX
 */
import React from "react";
import ThemeToggle from "./ThemeToggle.tsx";

/**
 * NAV_ITEMS - Static navigation menu configuration
 * 
 * Each item includes:
 * - label: Text shown in navigation
 * - id: Target section ID to scroll to
 */
const NAV_ITEMS = [
  { label: "About", id: "about" },
  { label: "Work", id: "projects" },
  { label: "Education", id: "education" },
  { label: "Contact", id: "contact" },
] as const;

/**
 * scrollToSection Function
 * 
 * Performs smooth scrolling to a target section by ID
 * 
 * @param id - The ID attribute of the target section element
 * 
 * Uses native scrollIntoView API with smooth behavior
 * for consistent cross-browser smooth scrolling
 */
const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

/**
 * SiteHeader Component
 * 
 * Main header/navigation component that:
 * 1. Displays logo as interactive button (scrolls to top)
 * 2. Renders navigation menu with smooth scroll links
 * 3. Includes theme toggle button
 * 
 * Uses semantic HTML with proper ARIA labels for accessibility
 */
const SiteHeader: React.FC = () => {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        {/* Logo button - scrolls to top when clicked */}
        <button
          type="button"
          className="site-header__logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          LWSS
        </button>
        
        {/* Main navigation menu */}
        <nav className="site-header__nav" aria-label="Main">
          {/* Map over NAV_ITEMS to create navigation buttons */}
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
          {/* Theme toggle - switches between light/dark mode */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
