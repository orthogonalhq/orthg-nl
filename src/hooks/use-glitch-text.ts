"use client";

import { useEffect, useRef, useState } from "react";

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/~`";

export function useGlitchText(text: string, durationMs = 600) {
  const [display, setDisplay] = useState(text);
  const prevRef = useRef(text);
  const fromLenRef = useRef(text.length);

  useEffect(() => {
    if (text === prevRef.current) return;
    const fromLen = fromLenRef.current;
    const toLen = text.length;
    prevRef.current = text;

    const steps = 14;
    const stepMs = durationMs / steps;
    let step = 0;

    const id = setInterval(() => {
      step++;
      const progress = step / steps;

      // Smoothly interpolate the visible length
      const currentLen = Math.round(fromLen + (toLen - fromLen) * progress);

      const chars = Array.from({ length: currentLen }, (_, i) => {
        const resolveAt = i / toLen;
        if (progress > resolveAt + 0.3) {
          return text[i] ?? "";
        }
        if (text[i] === " ") return " ";
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      });

      setDisplay(chars.join(""));

      if (step >= steps) {
        clearInterval(id);
        setDisplay(text);
        fromLenRef.current = toLen;
      }
    }, stepMs);

    return () => {
      clearInterval(id);
      fromLenRef.current = Math.round(fromLen + (toLen - fromLen) * (step / steps));
    };
  }, [text, durationMs]);

  return display;
}
