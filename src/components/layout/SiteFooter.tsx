/**
 * SiteFooter Component
 * 
 * Simple footer that displays:
 * - Current year (automatically updated)
 * - Copyright notice
 * - Designer/developer name
 * 
 * This is a presentational component with no state or effects
 */
import React from "react";

/**
 * SiteFooter Component
 * 
 * Renders a minimal footer with dynamic copyright year
 * 
 * Uses new Date().getFullYear() to automatically update
 * the year without requiring manual maintenance
 */
const SiteFooter: React.FC = () => {
  // Get current year for copyright notice
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p className="site-footer__text bricolage-grotesque">
        © {year} La Wun So So — Full Stack Developer
      </p>
    </footer>
  );
};

export default SiteFooter;
