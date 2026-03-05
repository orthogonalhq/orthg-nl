"use client";

import type { RLine } from "@/hooks/use-terminal-engine";

/** Render a single terminal line with optional char-by-char typing limit */
export function TerminalLine({ line, charLimit }: { line: RLine; charLimit?: number }) {
  const hasLimit = charLimit !== undefined;
  let remaining = hasLimit ? charLimit! : Infinity;

  return (
    <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      {line.segments.map((seg, i) => {
        if (remaining <= 0) return null;
        const text = hasLimit ? seg.text.slice(0, remaining) : seg.text;
        remaining -= text.length;
        return (
          <span key={i} className={seg.cls}>
            {text}
          </span>
        );
      })}
      {line.spinning && (
        <span className="text-accent/50">{line.spinnerChar}</span>
      )}
      {!line.spinning && hasLimit && remaining <= 0 && (
        <span className="cursor-blink">&#9608;</span>
      )}
      {!line.spinning && !hasLimit && line.showCaret && (
        <span className="cursor-blink"> &#9608;</span>
      )}
    </p>
  );
}
