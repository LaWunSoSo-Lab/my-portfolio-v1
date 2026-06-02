/**
 * Theme initialization utilities
 * 
 * Provides functions for:
 * - Getting theme from localStorage
 * - Getting system theme preference
 * - Resolving theme (stored or system)
 * - Applying theme to DOM
 * - Initializing theme on app startup
 */

export type Theme = "light" | "dark";

const STORAGE_KEY = "portfolio-theme";

/**
 * getStoredTheme - Retrieve user's saved theme preference from localStorage
 * 
 * @returns Stored theme ('light' or 'dark') or null if not set
 * 
 * Validates the stored value is a valid theme before returning
 * to prevent invalid theme values from localStorage
 */
export function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return null;
}

/**
 * getSystemTheme - Detect system color scheme preference
 * 
 * @returns System theme based on prefers-color-scheme media query
 *          - 'light' if user prefers light mode
 *          - 'dark' if user prefers dark mode (default)
 * 
 * Uses CSS media query to detect OS-level theme preference
 * Respects user's system settings (Windows, macOS, Linux dark mode, etc)
 */
export function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

/**
 * resolveTheme - Determine which theme to use
 * 
 * Priority:
 * 1. User's stored preference (localStorage)
 * 2. System theme preference (media query)
 * 
 * @returns Final theme to use: stored preference or system preference
 * 
 * This ensures stored user preference always takes precedence
 * while falling back to system preference for first-time users
 */
export function resolveTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

/**
 * applyTheme - Apply theme to the DOM
 * 
 * @param theme - Theme to apply ('light' or 'dark')
 * 
 * Actions:
 * 1. Set data-theme attribute on html element for CSS styling
 * 2. Update theme-color meta tag for browser UI (address bar, etc)
 * 
 * The data-theme attribute is used by CSS to style the entire app
 * The meta tag controls browser UI colors in mobile browsers
 */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    // Light theme gets light background, dark theme gets dark background
    meta.setAttribute("content", theme === "light" ? "#fafafa" : "#0a0a0a");
  }
}

/**
 * initTheme - Initialize theme on app startup
 * 
 * @returns Resolved theme
 * 
 * This function is called once on app load:
 * 1. Determines which theme to use (stored or system)
 * 2. Applies the theme to DOM
 * 3. Returns the theme
 * 
 * Used to prevent flash of wrong theme before React hydration
 */
export function initTheme(): Theme {
  const theme = resolveTheme();
  applyTheme(theme);
  return theme;
}

export { STORAGE_KEY };
