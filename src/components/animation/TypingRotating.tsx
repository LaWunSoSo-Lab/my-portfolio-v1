import React, { useState, useEffect } from "react";

type TypingRotatingProps = {
  sentences: string[];
  typingSpeed?: number;   // ms per character
  displayTime?: number;   // ms to stay fully typed
  fadeTime?: number;      // fade-out duration in ms
};

const TypingRotating: React.FC<TypingRotatingProps> = ({
  sentences,
  typingSpeed = 80,
  displayTime = 3500,
  fadeTime = 1000,
}) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [typing, setTyping] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (typing) {
      // Typing each character
      const currentSentence = sentences[currentSentenceIndex];
      if (displayedText.length < currentSentence.length) {
        timeout = setTimeout(() => {
          setDisplayedText(
            currentSentence.slice(0, displayedText.length + 1)
          );
        }, typingSpeed);
      } else {
        // Full sentence typed, wait displayTime then fade
        timeout = setTimeout(() => {
          setFade(true);
        }, displayTime);
      }
    } else {
      // After fade completed, reset for next sentence
      timeout = setTimeout(() => {
        setFade(false);
        setDisplayedText("");
        setCurrentSentenceIndex(
          (prev) => (prev + 1) % sentences.length
        );
        setTyping(true);
      }, fadeTime);
    }

    // Fade effect trigger
    if (fade) {
      setTyping(false);
    }

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
      <span className="typing-line__cursor" aria-hidden>
        |
      </span>
    </p>
  );
};

export default TypingRotating;
