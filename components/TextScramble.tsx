"use client";

import { useState, useEffect } from "react";

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface TextScrambleProps {
  text: string;
  delay?: number; // Delay before starting to resolve in ms
  duration?: number; // Duration of the resolution animation in ms
  scrambleSpeed?: number; // Speed of the character scrambling in ms
}

export function TextScramble({
  text,
  delay = 0,
  duration = 800,
  scrambleSpeed = 30,
}: TextScrambleProps) {
  const [output, setOutput] = useState("");

  useEffect(() => {
    let isMounted = true;
    let frameId: number;
    let startTime: number;
    let resolveTimeoutId: NodeJS.Timeout;

    // Generate initial scrambled text matching spaces
    const getInitialScramble = () => {
      return text
        .split("")
        .map((char) => {
          if (char === " ") return " ";
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        })
        .join("");
    };

    setOutput(getInitialScramble());

    // Continuously scramble characters until resolve phase starts
    const scrambleIntervalId = setInterval(() => {
      if (!isMounted) return;
      setOutput(
        text
          .split("")
          .map((char) => {
            if (char === " ") return " ";
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("")
      );
    }, scrambleSpeed);

    const startResolving = () => {
      clearInterval(scrambleIntervalId);
      startTime = performance.now();

      const tick = (now: number) => {
        if (!isMounted) return;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Linear calculation of how many characters are resolved
        const revealCount = Math.floor(progress * text.length);

        const currentOutput = text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < revealCount) {
              return char;
            }
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("");

        setOutput(currentOutput);

        if (progress < 1) {
          frameId = requestAnimationFrame(tick);
        } else {
          setOutput(text); // Ensure it ends with exact text
        }
      };

      frameId = requestAnimationFrame(tick);
    };

    resolveTimeoutId = setTimeout(startResolving, delay);

    return () => {
      isMounted = false;
      clearInterval(scrambleIntervalId);
      clearTimeout(resolveTimeoutId);
      cancelAnimationFrame(frameId);
    };
  }, [text, delay, duration, scrambleSpeed]);

  return <>{output}</>;
}
