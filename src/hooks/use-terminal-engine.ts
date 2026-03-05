"use client";

import { useState, useRef, useCallback } from "react";

const SPINNER = "⣾⣽⣻⢿⡿⣟⣯⣷".split("");
const SPINNER_MS = 80;

/** A styled text segment */
export interface Seg {
  text: string;
  cls?: string;
}

/** A rendered line in the terminal output */
export interface RLine {
  id: number;
  segments: Seg[];
  spinning?: boolean;
  spinnerChar?: string;
  showCaret?: boolean;
}

export function useTerminalEngine() {
  const [output, setOutput] = useState<RLine[]>([]);
  const [typing, setTyping] = useState<{ line: RLine; charIndex: number } | null>(null);
  const [done, setDone] = useState(false);
  const idRef = useRef(0);

  const nextId = () => ++idRef.current;
  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  /** Type a line character by character. charMs=0 for instant. */
  const typeLine = useCallback(
    async (segments: Seg[], charMs: number) => {
      const line: RLine = { id: nextId(), segments };
      const total = segments.reduce((s, seg) => s + seg.text.length, 0);

      if (charMs === 0 || total === 0) {
        setTyping(null);
        setOutput((prev) => [...prev, line]);
        return line;
      }

      for (let ci = 1; ci <= total; ci++) {
        setTyping({ line, charIndex: ci });
        await wait(charMs);
      }
      setTyping(null);
      setOutput((prev) => [...prev, line]);
      return line;
    },
    [],
  );

  /** Add a fully-visible line instantly */
  const addInstant = useCallback((segments: Seg[]) => {
    const line: RLine = { id: nextId(), segments };
    setOutput((prev) => [...prev, line]);
    return line;
  }, []);

  /** Add a blank spacer line */
  const addBlank = useCallback(() => {
    addInstant([{ text: " " }]);
  }, [addInstant]);

  /** Show braille spinner at end of last output line for `ms`, then stop */
  const spinStandalone = useCallback(async (ms: number) => {
    setOutput((prev) => {
      if (prev.length === 0) return prev;
      const last = { ...prev[prev.length - 1], spinning: true, spinnerChar: SPINNER[0] };
      return [...prev.slice(0, -1), last];
    });

    const start = Date.now();
    let frame = 0;
    while (Date.now() - start < ms) {
      frame = (frame + 1) % SPINNER.length;
      const char = SPINNER[frame];
      setOutput((prev) => {
        const last = { ...prev[prev.length - 1], spinnerChar: char };
        return [...prev.slice(0, -1), last];
      });
      await wait(SPINNER_MS);
    }

    setOutput((prev) => {
      const last = { ...prev[prev.length - 1], spinning: false };
      return [...prev.slice(0, -1), last];
    });
  }, []);

  /** Show braille spinner at end of last line, then replace with result segments */
  const spinOnLine = useCallback(async (ms: number, result: Seg[]) => {
    setOutput((prev) => {
      const last = { ...prev[prev.length - 1], spinning: true, spinnerChar: SPINNER[0] };
      return [...prev.slice(0, -1), last];
    });

    const start = Date.now();
    let frame = 0;
    while (Date.now() - start < ms) {
      frame = (frame + 1) % SPINNER.length;
      const char = SPINNER[frame];
      setOutput((prev) => {
        const last = { ...prev[prev.length - 1], spinnerChar: char };
        return [...prev.slice(0, -1), last];
      });
      await wait(SPINNER_MS);
    }

    setOutput((prev) => {
      const last = { ...prev[prev.length - 1], spinning: false };
      last.segments = [...last.segments, ...result];
      return [...prev.slice(0, -1), last];
    });
  }, []);

  /** Mark the sequence as done — caret stays on last line */
  const finish = useCallback(() => {
    setOutput((prev) => {
      if (prev.length === 0) return prev;
      const last = { ...prev[prev.length - 1], showCaret: true };
      return [...prev.slice(0, -1), last];
    });
    setDone(true);
  }, []);

  return { output, typing, done, typeLine, addInstant, addBlank, spinStandalone, spinOnLine, finish, wait };
}
