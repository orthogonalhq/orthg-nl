"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/~`";

type Phase = "default" | "glitch-out" | "type-in" | "done";

interface TabPanelProps {
  /** null = show defaultContent, string[] = show typed lines */
  lines: string[] | null;
  /** Key to force re-transition when switching between tabs */
  tabKey: string | null;
  defaultContent: ReactNode;
}

/** Glitch-dissolve a string: randomly replace chars while shrinking to empty */
function useGlitchOut(text: string, active: boolean, durationMs = 500) {
  const [display, setDisplay] = useState(text);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setDone(false);
      return;
    }

    const len = text.length;
    if (len === 0) {
      setDisplay("");
      setDone(true);
      return;
    }

    const steps = 12;
    const stepMs = durationMs / steps;
    let step = 0;

    setDone(false);
    const id = setInterval(() => {
      step++;
      const progress = step / steps;
      // Shrink visible length
      const visLen = Math.round(len * (1 - progress));
      const chars = Array.from({ length: visLen }, (_, i) => {
        // Later chars glitch first
        const glitchAt = 1 - i / len;
        if (progress > glitchAt * 0.5) {
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
        return text[i] === " " ? " " : text[i];
      });
      setDisplay(chars.join(""));

      if (step >= steps) {
        clearInterval(id);
        setDisplay("");
        setDone(true);
      }
    }, stepMs);

    return () => clearInterval(id);
  }, [text, active, durationMs]);

  return { display, done };
}

/** Type-in lines one character at a time */
function TypeInLines({ lines, charMs = 12 }: { lines: string[]; charMs?: number }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    intervalRef.current = setInterval(() => {
      setCharIndex((prev) => {
        const nextChar = prev + 1;
        if (nextChar >= lines[currentLine].length) {
          // Move to next line
          clearInterval(intervalRef.current!);
          setTimeout(() => {
            setCurrentLine((prevLine) => prevLine + 1);
            setCharIndex(0);
          }, 50);
          return lines[currentLine].length;
        }
        return nextChar;
      });
    }, charMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentLine, lines, charMs]);

  return (
    <div className="flex flex-col gap-3">
      {lines.map((line, i) => {
        if (i > currentLine) return <p key={i} className="terminal-text text-xs text-white/40 leading-relaxed min-h-[1.25em]" />;
        const visible = i < currentLine ? line : line.slice(0, charIndex);
        const showCaret = i === currentLine && currentLine < lines.length;
        return (
          <p key={i} className="terminal-text text-xs text-white/40 leading-relaxed min-h-[1.25em]">
            {visible}
            {showCaret && <span className="text-accent/50">&#9608;</span>}
          </p>
        );
      })}
    </div>
  );
}

/** Dissolve-out component: renders old lines while they glitch away */
function GlitchOutLines({
  lines,
  onComplete,
}: {
  lines: string[];
  onComplete: () => void;
}) {
  const [displays, setDisplays] = useState<string[]>(lines);
  const completedRef = useRef(0);
  const calledRef = useRef(false);

  useEffect(() => {
    if (lines.length === 0) {
      onComplete();
      return;
    }

    const totalSteps = 12;
    const stepMs = 400 / totalSteps;
    let step = 0;

    const id = setInterval(() => {
      step++;
      const progress = step / totalSteps;

      setDisplays(
        lines.map((line) => {
          const len = line.length;
          const visLen = Math.round(len * (1 - progress));
          return Array.from({ length: visLen }, (_, i) => {
            const glitchAt = 1 - i / len;
            if (progress > glitchAt * 0.4) {
              return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            }
            return line[i] === " " ? " " : line[i];
          }).join("");
        }),
      );

      if (step >= totalSteps) {
        clearInterval(id);
        if (!calledRef.current) {
          calledRef.current = true;
          onComplete();
        }
      }
    }, stepMs);

    return () => clearInterval(id);
  }, [lines, onComplete]);

  return (
    <div className="flex flex-col gap-3">
      {displays.map((d, i) => (
        <p key={i} className="terminal-text text-xs text-white/40 leading-relaxed min-h-[1.25em]">
          {d}
        </p>
      ))}
    </div>
  );
}

export function TabPanel({ lines, tabKey, defaultContent }: TabPanelProps) {
  const [phase, setPhase] = useState<Phase>("default");
  const [prevLines, setPrevLines] = useState<string[]>([]);
  const [activeLines, setActiveLines] = useState<string[]>([]);
  const prevKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    prevKeyRef.current = tabKey;

    if (tabKey === null && prevKey === null) {
      // Still default
      setPhase("default");
      return;
    }

    if (tabKey === null && prevKey !== null) {
      // Going back to default — glitch out current content
      setPrevLines(activeLines);
      setPhase("glitch-out");
      return;
    }

    if (prevKey === null && tabKey !== null) {
      // From default to tab — just type in (no glitch out needed for default content)
      setActiveLines(lines!);
      setPhase("type-in");
      return;
    }

    // Tab to tab — glitch out old, then type in new
    setPrevLines(activeLines);
    setActiveLines(lines!);
    setPhase("glitch-out");
  }, [tabKey, lines]);

  const handleGlitchOutComplete = useCallback(() => {
    if (prevKeyRef.current === null) {
      // Returning to default
      setPhase("default");
    } else {
      setPhase("type-in");
    }
  }, []);

  return (
    <div className="p-6 md:p-10 bg-[rgba(255,255,255,0.01)] min-h-[280px]">
      {phase === "default" && defaultContent}
      {phase === "glitch-out" && (
        <GlitchOutLines lines={prevLines} onComplete={handleGlitchOutComplete} />
      )}
      {(phase === "type-in" || phase === "done") && (
        <TypeInLines key={tabKey} lines={activeLines} />
      )}
    </div>
  );
}
