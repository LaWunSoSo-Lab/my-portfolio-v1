/**
 * TypingRotating Component
 * 
 * Animated text typing effect that cycles through multiple sentences
 * 
 * Features:
 * - Character-by-character typing animation
 * - Fade-out effect between sentences
 * - Smooth rotation through multiple sentences in a loop
 * - Configurable speeds (typing, display, fade)
 * - Blinking cursor indicator
 * 
 * State management:
 * - Tracks current sentence index
 * - Tracks displayed text for typing effect
 * - Manages typing/fading phase
 * - Handles animation timing
 */
import React, { useState, useEffect } from "react";

type TypingRotatingProps = {
  sentences: string[];           // Array of sentences to cycle through
  typingSpeed?: number;          // Milliseconds per character (default: 80)
  displayTime?: number;          // Milliseconds to show full sentence (default: 3500)
  fadeTime?: number;             // Milliseconds for fade-out effect (default: 1000)
};

/**
 * TypingRotating Component
 * 
 * Creates a typing effect that cycles through sentences with fade transitions
 * 
 * Animation flow:
 * 1. Type characters one by one (typingSpeed between each)
 * 2. Display full sentence for displayTime milliseconds
 * 3. Fade out text over fadeTime milliseconds
 * 4. Reset and start next sentence
 * 5. Loop back to first sentence after last one
 * 
 * Props:
 * - sentences: Array of strings to cycle through
 * - typingSpeed: Delay between typing each character (ms)
 * - displayTime: Duration to display complete sentence (ms)
 * - fadeTime: Duration of fade-out transition (ms)
 */
const TypingRotating: React.FC<TypingRotatingProps> = ({
  sentences,
  typingSpeed = 80,
  displayTime = 3500,
  fadeTime = 1000,
}) => {
  // Current sentence being displayed
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  // Text that has been typed so far
  const [displayedText, setDisplayedText] = useState("");
  // Is currently in typing phase?
  const [typing, setTyping] = useState(true);
  // Is currently in fade-out phase?
  const [fade, setFade] = useState(false);

  /**
   * Main animation effect hook
   * 
   * Manages the typing and fade animation flow.
   * Uses timeouts to control timing of each phase.
   * 
   * Animation phases:
   * 1. TYPING: Type characters progressively
   * 2. WAITING: Display full text for displayTime
   * 3. FADING: Fade out while holding current text
   * 4. IDLE: Wait for fade to complete
   * 5. RESET: Clear text and move to next sentence
   */
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (typing) {
      // TYPING PHASE: Add one character at a time
      const currentSentence = sentences[currentSentenceIndex];
      if (displayedText.length < currentSentence.length) {
        // Still typing - schedule next character
        timeout = setTimeout(() => {
          setDisplayedText(
            currentSentence.slice(0, displayedText.length + 1)
          );
        }, typingSpeed);
      } else {
        // Finished typing - wait before starting fade
        timeout = setTimeout(() => {
          setFade(true);
        }, displayTime);
      }
    } else {
      // NOT TYPING PHASE: Reset and move to next sentence
      timeout = setTimeout(() => {
        setFade(false);
        setDisplayedText("");
        // Move to next sentence (loop back to 0 after last)
        setCurrentSentenceIndex(
          (prev) => (prev + 1) % sentences.length
        );
        setTyping(true);
      }, fadeTime);
    }

    // Trigger fade phase transition
    if (fade) {
      setTyping(false);
    }

    // Cleanup: Cancel timeout if component unmounts
    return () => clearTimeout(timeout);
  }, [displayedText, typing, fade, currentSentenceIndex, sentences, typingSpeed, displayTime, fadeTime]);

  return (
    <p
      className="bricolage-grotesque intro--txt typing-line"
      style={{
        opacity: fade ? 0 : 1,
        transition: `opacity ${fadeTime}ms ease-in-out`,
      }}
    >
      {displayedText}
      {/* Blinking cursor indicator */}
      <span className="typing-line__cursor" aria-hidden>
        |
      </span>
    </p>
  );
};

export default TypingRotating;
