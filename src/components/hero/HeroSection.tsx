import React, { useEffect, useRef, useState, useCallback } from "react";
import MoonScene from "./MoonScene.tsx";
import TypingRotating from "../animation/TypingRotating.tsx";
import { useTheme } from "../../context/ThemeContext.tsx";
import "../../styles/hero.css";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const HeroSection: React.FC = () => {
  const { theme } = useTheme();
  const scrollTrackRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [heroVisibility, setHeroVisibility] = useState(1);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const updateLayout = useCallback(() => {
    setLayout({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const updateScrollProgress = useCallback(() => {
    const track = scrollTrackRef.current;
    if (!track) return;

    const scrollable = track.offsetHeight - window.innerHeight;
    if (scrollable <= 0) {
      setProgress(0);
      return;
    }

    const rect = track.getBoundingClientRect();
    const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
    setProgress(scrolled / scrollable);
    setHeroVisibility(
      Math.min(1, Math.max(0, rect.bottom / (window.innerHeight * 0.65)))
    );
  }, []);

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

  const eased = easeOutCubic(progress);
  const { width, height } = layout;

  const moonSizeStart = Math.min(width * 0.72, 520);
  const moonSizeEnd = Math.min(width * 0.22, 140);
  const moonSize =
    width > 0 ? moonSizeStart + (moonSizeEnd - moonSizeStart) * eased : moonSizeStart;

  const startX = width / 2;
  const startY = height / 2;
  const endX = width - moonSizeEnd * 0.55 - 24;
  const endY = moonSizeEnd * 0.55 + 88;
  const moonX = width > 0 ? startX + (endX - startX) * eased : startX;
  const moonY = height > 0 ? startY + (endY - startY) * eased : startY;

  const introReveal = Math.min(1, Math.max(0, (progress - 0.25) / 0.55));
  const introOpacity = introReveal * heroVisibility;
  const introTranslateY = (1 - introReveal) * 40;
  const moonVisibility = Math.max(eased, heroVisibility * 0.35 + eased * 0.65);

  return (
    <section className="hero" ref={scrollTrackRef}>
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

      <div className="hero__scroll-hint" style={{ opacity: 1 - eased * 2 }}>
        <span className="bricolage-grotesque">Scroll to explore</span>
        <span className="hero__scroll-arrow" />
      </div>

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
