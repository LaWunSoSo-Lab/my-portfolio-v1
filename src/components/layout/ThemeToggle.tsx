/**
 * ThemeToggle Component
 * 
 * Interactive button that toggles between light and dark themes
 * 
 * Features:
 * - Shows appropriate icon (sun for light mode, moon for dark mode)
 * - Updates aria-label based on current theme
 * - Calls useTheme context to toggle theme
 * 
 * Requires: ThemeProvider wrapper in app root
 */
import React from "react";
import { useTheme } from "../../context/ThemeContext.tsx";

/**
 * ThemeToggle Component
 * 
 * Renders a button that toggles between light and dark themes
 * 
 * Visual feedback:
 * - Icon changes between sun (light mode) and moon (dark mode)
 * - Label text shows current and next theme option
 * - Accessible with proper ARIA labels
 */
const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {/* Theme icon - shows sun in light mode, moon in dark mode */}
      <span className="theme-toggle__icon" aria-hidden>
        {isDark ? (
          // Sun icon for light mode
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        ) : (
          // Moon icon for dark mode
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M21 14.5A7.5 7.5 0 0 1 9.5 3 6.5 6.5 0 1 0 21 14.5z" />
          </svg>
        )}
      </span>
      {/* Theme label text */}
      <span className="theme-toggle__label bricolage-grotesque">
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
};

export default ThemeToggle;
