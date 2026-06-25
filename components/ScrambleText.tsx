"use client";

import { useEffect, useState, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':\",./<>?";

interface ScrambleTextProps {
  text: string;
  delay?: number;
  duration?: number;
  onComplete?: () => void;
  trigger?: boolean | number; // allow manual triggers, e.g. on click
}

export default function ScrambleText({
  text,
  delay = 0,
  duration = 800,
  onComplete,
  trigger = true,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If text changes or trigger updates, we want to scramble
    let isMounted = true;

    const startScramble = () => {
      const startTime = Date.now();

      const tick = () => {
        if (!isMounted) return;
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth curve: ease out cubic
        // t => 1 - Math.pow(1 - t, 3)
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const resolvedCount = Math.floor(easedProgress * text.length);

        const currentScramble = text
          .split("")
          .map((char, index) => {
            if (index < resolvedCount) {
              return text[index];
            }
            if (char === " ") {
              return " ";
            }
            // Keep specific punctuation symbols intact occasionally, or just random chars
            if (char === "." || char === "-" || char === "," || char === "?" || char === "!") {
              // 30% chance to show the correct punctuation, 70% random character
              return Math.random() < 0.3 ? char : CHARS[Math.floor(Math.random() * CHARS.length)];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");

        setDisplayText(currentScramble);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(tick);
        } else {
          setDisplayText(text);
          if (onComplete) onComplete();
        }
      };

      animationRef.current = requestAnimationFrame(tick);
    };

    // Cancel any existing animations/timeouts
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (delay > 0) {
      timeoutRef.current = setTimeout(startScramble, delay);
    } else {
      startScramble();
    }

    return () => {
      isMounted = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, delay, duration, trigger]);

  return <>{displayText}</>;
}
