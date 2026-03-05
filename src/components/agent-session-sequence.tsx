"use client";

import { useIntersectionReveal } from "@/hooks/use-intersection-reveal";
import { useTerminalEngine } from "@/hooks/use-terminal-engine";
import type { Seg } from "@/hooks/use-terminal-engine";
import { TerminalLine } from "@/components/terminal-line";
import { useEffect, useRef, useCallback } from "react";

const LABEL_W = 10;
const pad = (s: string) => s.padEnd(LABEL_W);

// Pre-defined final output lines for ghost height reservation
const GHOST_LINES = [
  `${pad("you")}│ Research competitors in the sovereign AI space and draft a summary`,
  " ",
  `${pad("cortex")}│ Decomposing into 3 subtasks...`,
  `${pad("agent-1")}│ Searching web: "sovereign AI platforms 2025"`,
  `${pad("agent-2")}│ Querying memory: prior research on AI sovereignty`,
  `${pad("agent-3")}│ Indexing sources 12 found, filtering...`,
  " ",
  `${pad("cortex")}│ Synthesizing results`,
  `${pad("cortex")}│ Draft ready. 2,400 words. 3 key findings.`,
  " ",
  `${pad("memory")}│ Experience indexed: competitor-analysis`,
  `${pad("memory")}│ 12 new sources added to knowledge base`,
  " ",
  "Task complete. Elapsed: 4m 12s \u2588",
];

export function AgentSessionSequence() {
  const { ref, isVisible } = useIntersectionReveal({ threshold: 0.2 });
  const engine = useTerminalEngine();
  const hasStarted = useRef(false);

  const label = (name: string, cls?: string): Seg => ({
    text: name.padEnd(LABEL_W),
    cls: cls ?? (name ? "t-panel-label" : "t-ghost"),
  });
  const sep: Seg = { text: "│ ", cls: "t-ghost" };

  const runSequence = useCallback(async () => {
    const { typeLine, addBlank, addInstant, spinStandalone, spinOnLine, finish, wait } = engine;

    await typeLine(
      [
        label("you"),
        sep,
        { text: "Research competitors in the sovereign AI space and draft a summary" },
      ],
      25,
    );
    await wait(300);

    addBlank();

    await typeLine([label("cortex", "text-accent/60"), sep, { text: "Decomposing into 3 subtasks" }], 14);
    await spinOnLine(600, [{ text: "...", cls: "t-ghost" }]);
    await wait(200);

    await typeLine(
      [label("agent-1", "t-meta"), sep, { text: "Searching web: " }, { text: '"sovereign AI platforms 2025"', cls: "t-ghost" }],
      0,
    );
    await wait(100);

    await typeLine(
      [label("agent-2", "t-meta"), sep, { text: "Querying memory: " }, { text: "prior research on AI sovereignty", cls: "t-ghost" }],
      0,
    );
    await wait(100);

    await typeLine(
      [label("agent-3", "t-meta"), sep, { text: "Indexing sources" }],
      0,
    );
    await spinOnLine(800 + Math.random() * 400, [
      { text: " 12 found, filtering...", cls: "t-ghost" },
    ]);

    await wait(400);
    addBlank();

    await typeLine([label("cortex", "text-accent/60"), sep, { text: "Synthesizing results" }], 14);
    await spinOnLine(1200 + Math.random() * 600, []);

    await wait(200);
    addInstant([
      label("cortex", "text-accent/60"),
      sep,
      { text: "Draft ready. " },
      { text: "2,400 words. 3 key findings.", cls: "t-panel-label" },
    ]);

    await wait(400);
    addBlank();

    await typeLine(
      [label("memory"), sep, { text: "Experience indexed: " }, { text: "competitor-analysis", cls: "t-meta" }],
      12,
    );
    await wait(120);
    await typeLine(
      [label("memory"), sep, { text: "12 new sources added to knowledge base" }],
      12,
    );

    await wait(500);
    addBlank();

    await typeLine(
      [
        { text: "Task complete. ", cls: "t-meta" },
        { text: "Elapsed: 4m 12s", cls: "t-ghost" },
      ],
      30,
    );

    finish();
  }, [engine]);

  useEffect(() => {
    if (isVisible && !hasStarted.current) {
      hasStarted.current = true;
      runSequence();
    }
  }, [isVisible, runSequence]);

  return (
    <div ref={ref} className="terminal-text text-[12px] leading-[1.8] t-panel-label relative">
      {/* Ghost lines — invisible but reserve final height */}
      <div className="invisible" aria-hidden="true">
        {GHOST_LINES.map((text, i) => (
          <p key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{text}</p>
        ))}
      </div>
      {/* Animated content overlaid */}
      <div className="absolute inset-0">
        {engine.output.map((line) => (
          <TerminalLine key={line.id} line={line} />
        ))}
        {engine.typing && (
          <TerminalLine line={engine.typing.line} charLimit={engine.typing.charIndex} />
        )}
      </div>
    </div>
  );
}
