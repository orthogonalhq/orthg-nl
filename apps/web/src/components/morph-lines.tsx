"use client";

import { useState, useEffect, useRef } from "react";

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/~`";

interface MorphLinesProps {
  sourceLines: string[];
  targetLines: string[];
  durationMs?: number;
  onComplete: () => void;
}

/**
 * Full→Full morph transition: characters scramble from source text to target text.
 * Full→Empty: characters randomly disappear until nothing remains.
 */
export function MorphLines({ sourceLines, targetLines, durationMs = 400, onComplete }: MorphLinesProps) {
  const [displays, setDisplays] = useState<string[]>(sourceLines);
  const calledRef = useRef(false);

  useEffect(() => {
    calledRef.current = false;
    const maxLineCount = Math.max(sourceLines.length, targetLines.length);

    if (maxLineCount === 0) {
      onComplete();
      return;
    }

    const steps = 16;
    const stepMs = durationMs / steps;
    let step = 0;

    const id = setInterval(() => {
      step++;
      const progress = step / steps;

      const newDisplays: string[] = [];
      for (let lineIdx = 0; lineIdx < maxLineCount; lineIdx++) {
        const src = sourceLines[lineIdx] ?? "";
        const tgt = targetLines[lineIdx] ?? "";
        const srcLen = src.length;
        const tgtLen = tgt.length;

        // Interpolate visible length from source to target
        const currentLen = Math.round(srcLen + (tgtLen - srcLen) * progress);

        const chars: string[] = [];
        for (let i = 0; i < currentLen; i++) {
          // Determine when this character position resolves to target
          const resolveAt = tgtLen > 0 ? i / tgtLen : 1;

          if (progress > resolveAt + 0.3 && i < tgtLen) {
            // Resolved: show target character
            chars.push(tgt[i]);
          } else if (tgt[i] === " " || src[i] === " ") {
            // Preserve spaces
            chars.push(" ");
          } else {
            // Scramble
            chars.push(GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]);
          }
        }
        newDisplays.push(chars.join(""));
      }

      setDisplays(newDisplays);

      if (step >= steps) {
        clearInterval(id);
        setDisplays(targetLines);
        if (!calledRef.current) {
          calledRef.current = true;
          onComplete();
        }
      }
    }, stepMs);

    return () => clearInterval(id);
  }, [sourceLines, targetLines, durationMs, onComplete]);

  return (
    <div className="terminal-text text-body leading-[1.8] t-panel-label relative">
      {displays.map((d, i) => (
        <p key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }} className="t-body">
          {d}
        </p>
      ))}
    </div>
  );
}
