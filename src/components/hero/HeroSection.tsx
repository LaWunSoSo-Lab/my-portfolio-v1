/**
 * HeroSection Component
 * 
 * Creates an interactive hero section with:
 * - Animated moon scene that moves based on scroll position
 * - Scroll-triggered animations (intro text fade and reveal)
 * - Scroll progress tracking
 * - Responsive layout calculations
 * - Typing animation component
 * 
 * Key features:
 * - Uses cubic easing function for smooth scroll animations
 * - Calculates moon position and size based on scroll progress
 * - Manages hero visibility state as user scrolls
 * - Responsive to window resize events
 */
// @ts-ignore
import React, { useEffect, useRef, useState, useCallback } from "react";
import MoonScene from "./MoonScene.tsx";
import TypingRotating from "../animation/TypingRotating.tsx";
import { useTheme } from "../../context/ThemeContext.tsx";
// @ts-ignore
import "../../styles/hero.css";

/**
 * Easing function for smooth animations
 * 
 * @param t - Time value between 0 and 1
 * @returns Eased value using cubic ease-out curve
 * 
 * Provides smooth deceleration: starts fast, ends slow
 */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

interface LayoutDimensions {
  width: number;
  height: number;
}

const HeroSection: React.FC = () => {
  const { theme } = useTheme();
  const scrollTrackRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [heroVisibility, setHeroVisibility] = useState(1);
  const [layout, setLayout] = useState<LayoutDimensions>({ width: 0, height: 0 });

  /**
   * Updates layout state when window is resized
   * 
   * Stored in useCallback to prevent unnecessary re-renders
   * Called on mount and whenever window size changes
   */
  const updateLayout = useCallback(() => {
    setLayout({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  /**
   * Calculates scroll progress and updates animation values
   * 
   * This function:
   * 1. Gets the scrollable height of the hero section
   * 2. Calculates how far the user has scrolled
   * 3. Converts scroll position to a 0-1 progress value
   * 4. Updates hero visibility based on scroll position
   * 
   * Scroll progress drives:
   * - Moon size transitions
   * - Moon position movement
   * - Intro text fade-in and reveal
   */
  const updateScrollProgress = useCallback(() => {
    const track = scrollTrackRef.current;
    if (!track) return;

    const scrollable = track.offsetHeight - window.innerHeight;
    if (scrollable <= 0) {
      setProgress(0);
      return;
    }

    // Get position of track relative to viewport
    const rect = track.getBoundingClientRect();
    // Clamp scrolled amount between 0 and total scrollable height
    const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
    // Convert to 0-1 progress value
    setProgress(scrolled / scrollable);
    // Calculate when hero section scrolls out of view
    setHeroVisibility(
      Math.min(1, Math.max(0, rect.bottom / (window.innerHeight * 0.65)))
    );
  }, []);

  /**
   * Effect: Initialize and attach scroll/resize listeners
   * 
   * - Updates layout and scroll position on mount
   * - Adds passive scroll listener for performance
   * - Cleans up listeners on unmount
   */
  useEffect(() => {
    updateLayout();
    updateScrollProgress();

    window.addEventListener("resize", updateLayout);
    window.addEventListener("scroll", updateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("scroll", updateScrollProgress);
    };
  }, [updateLayout, updateScrollProgress]);

  // Apply easing curve to progress
  const eased = easeOutCubic(progress);
  const { width, height } = layout;

  /**
   * Calculate moon size based on scroll progress
   * 
   * Starts at 72% of viewport width (max 520px)
   * Ends at 22% of viewport width (min 140px)
   * Smoothly transitions as user scrolls
   */
  const moonSizeStart = Math.min(width * 0.72, 520);
  const moonSizeEnd = Math.min(width * 0.22, 140);
  const moonSize =
    width > 0 ? moonSizeStart + (moonSizeEnd - moonSizeStart) * eased : moonSizeStart;

  /**
   * Calculate moon position based on scroll progress
   * 
   * Start position: center of screen
   * End position: top-right corner
   * Smoothly transitions as user scrolls
   */
  const startX = width / 2;
  const startY = height / 2;
  const endX = width - moonSizeEnd * 0.55 - 24;
  const endY = moonSizeEnd * 0.55 + 88;
  const moonX = width > 0 ? startX + (endX - startX) * eased : startX;
  const moonY = height > 0 ? startY + (endY - startY) * eased : startY;

  /**
   * Calculate intro text animations
   * 
   * introReveal: Fades in intro text starting after 25% scroll
   * introOpacity: Combines reveal with hero visibility for smooth fade-out
   * introTranslateY: Slides up intro text as it fades in
   * moonVisibility: Blends eased position with hero visibility
   */
  const introReveal = Math.min(1, Math.max(0, (progress - 0.25) / 0.55));
  const introOpacity = introReveal * heroVisibility;
  const introTranslateY = (1 - introReveal) * 40;
  const moonVisibility = Math.max(eased, heroVisibility * 0.35 + eased * 0.65);

  return (
    <section className="hero" ref={scrollTrackRef}>
      {/* Animated moon scene that responds to scroll */}
      <div
        className="hero__moon"
        style={{
          left: moonX,
          top: moonY,
          width: moonSize,
          height: moonSize,
          transform: "translate(-50%, -50%)",
          opacity: moonVisibility,
        }}
        aria-hidden
      >
        <MoonScene theme={theme} />
      </div>

      {/* Scroll hint that fades as user scrolls */}
      <div className="hero__scroll-hint" style={{ opacity: 1 - eased * 2 }}>
        <span className="bricolage-grotesque">Scroll to explore</span>
        <span className="hero__scroll-arrow" />
      </div>

      {/* Hero intro text that fades and slides in */}
      <div
        className="hero__intro"
        style={{
          opacity: introOpacity,
          transform: `translateY(${introTranslateY}px)`,
          pointerEvents: introOpacity > 0.5 ? "auto" : "none",
        }}
      >
        <div className="introduction__container hero__intro-inner">
          <p className="bricolage-grotesque intro--txt hero__greeting">Hello! I&apos;m</p>
          <p className="permanent-marker-regular hero__name">La Wun So So</p>
          <p className="bricolage-grotesque hero__role">Full Stack Developer</p>
          <TypingRotating
            sentences={[
              "I design and build end-to-end web applications.",
              "From APIs and databases to polished front-end experiences.",
              "I ship clean, responsive, and maintainable software.",
            ]}
            typingSpeed={70}
            displayTime={4500}
            fadeTime={900}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
