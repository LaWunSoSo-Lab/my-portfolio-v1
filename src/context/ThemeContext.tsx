/**
 * ThemeContext - Manages application-wide theme state
 * 
 * Provides:
 * - Current theme (light/dark)
 * - Toggle theme function
 * - Set theme function
 * 
 * Features:
 * - Persists theme preference to localStorage
 * - Respects system color scheme preference on first load
 * - Watches for system theme changes and updates if no stored preference
 * - Applies theme to DOM and updates meta tags
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  STORAGE_KEY,
  Theme,
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  initTheme,
} from "./themeInit.ts";

/**
 * ThemeContextValue - Type definition for theme context value
 * 
 * Properties:
 * - theme: Current theme ('light' or 'dark')
 * - toggleTheme: Function to switch between themes
 * - setTheme: Function to set specific theme
 */
type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

// Create context with null default (validated in useTheme hook)
const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * ThemeProvider Component
 * 
 * Wraps the application and provides theme context to all children
 * 
 * Features:
 * - Initializes theme from storage or system preference
 * - Manages theme state
 * - Persists theme to localStorage
 * - Applies theme to DOM
 * - Listens for system theme changes
 * 
 * Usage:
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  /**
   * Theme state - initialized with initTheme function
   * which checks storage first, then system preference
   */
  const [theme, setThemeState] = useState<Theme>(() => initTheme());

  /**
   * setTheme function - Updates theme and persists to localStorage
   * 
   * Actions:
   * 1. Update local state
   * 2. Apply theme to DOM and meta tags
   * 3. Save preference to localStorage
   * 
   * @param next - Theme to set ('light' or 'dark')
   */
  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  /**
   * toggleTheme function - Switches between light and dark themes
   * 
   * Toggles current theme to opposite:
   * - 'dark' → 'light'
   * - 'light' → 'dark'
   */
  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  /**
   * Effect: Listen for system theme preference changes
   * 
   * When system theme changes (e.g., user enables dark mode):
   * - If no stored preference exists, automatically update to match system
   * - If user has stored preference, respect their choice (don't override)
   * 
   * This respects user choice while supporting system theme awareness
   */
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = () => {
      // Only update if user hasn't explicitly set a preference
      if (!getStoredTheme()) {
        setTheme(getSystemTheme());
      }
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [setTheme]);

  /**
   * Memoized context value - Prevents unnecessary re-renders
   * 
   * Only recreates when theme, toggleTheme, or setTheme change
   */
  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * useTheme Hook - Access theme context from any component
 * 
 * Returns theme context value containing:
 * - theme: Current theme ('light' or 'dark')
 * - toggleTheme: Function to switch themes
 * - setTheme: Function to set specific theme
 * 
 * Throws error if used outside ThemeProvider
 * 
 * @returns ThemeContextValue with theme and control functions
 * @throws Error if used without ThemeProvider wrapper
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
