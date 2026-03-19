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
  "$ nous init",
  "Initializing cognitive architecture...",
  " ",
  `${pad("cortex")}│ orchestration engine ready`,
  `${pad("memory")}│ persistent store loaded`,
  `${pad("subcortex")}│ agent pool 3 workers`,
  `${pad("autonomic")}│ health monitor nominal`,
  " ",
  "$ nous status",
  " ",
  `${pad("models")}│ ollama:llama3 local`,
  `${pad("")}│ claude-3.5 routed`,
  `${pad("memory")}│ 2,847 experiences indexed`,
  `${pad("skills")}│ 14 active, 3 learning`,
  `${pad("uptime")}│ 47d 13h 22m`,
  " ",
  "Sovereign AI for everyone. \u2588",
];

export function TerminalSequence() {
  const { ref, isVisible } = useIntersectionReveal({ threshold: 0.3 });
  const engine = useTerminalEngine();
  const hasStarted = useRef(false);

  const label = (name: string): Seg => ({
    text: name.padEnd(LABEL_W),
    cls: name ? "t-panel-label" : "t-ghost",
  });
  const sep: Seg = { text: "│ ", cls: "t-ghost" };

  const runSequence = useCallback(async () => {
    const { typeLine, addBlank, spinStandalone, spinOnLine, finish, wait } = engine;

    await typeLine(
      [{ text: "$ ", cls: "text-accent/60" }, { text: "nous init", cls: "t-panel-label" }],
      55,
    );
    await wait(150);
    await spinStandalone(800);

    await typeLine([{ text: "Initializing cognitive architecture...", cls: "t-ghost" }], 18);
    await spinStandalone(900);

    addBlank();

    const subsystems: [string, string, string][] = [
      ["cortex", "orchestration engine ", "ready"],
      ["memory", "persistent store ", "loaded"],
      ["subcortex", "agent pool ", "3 workers"],
      ["autonomic", "health monitor ", "nominal"],
    ];

    for (const [name, desc, status] of subsystems) {
      await typeLine([label(name), sep, { text: desc }], 12);
      await spinOnLine(300 + Math.random() * 400, [{ text: status, cls: "text-green-400/40" }]);
      await wait(100);
    }

    addBlank();

    await typeLine(
      [{ text: "$ ", cls: "text-accent/60" }, { text: "nous status", cls: "t-panel-label" }],
      45,
    );
    await wait(150);
    await spinStandalone(1000);

    addBlank();

    await typeLine([label("models"), sep, { text: "ollama:llama3 " }, { text: "local", cls: "t-meta" }], 12);
    await wait(80);
    await typeLine([label(""), sep, { text: "claude-3.5 " }, { text: "routed", cls: "t-meta" }], 12);
    await wait(80);
    await typeLine([label("memory"), sep, { text: "2,847 experiences indexed" }], 12);
    await wait(80);
    await typeLine([label("skills"), sep, { text: "14 active, 3 learning" }], 12);
    await wait(80);
    await typeLine([label("uptime"), sep, { text: "47d 13h 22m" }], 12);
    await wait(400);

    addBlank();

    await typeLine([{ text: "Sovereign AI for everyone.", cls: "t-meta" }], 35);

    finish();
  }, [engine]);

  useEffect(() => {
    if (isVisible && !hasStarted.current) {
      hasStarted.current = true;
      runSequence();
    }
  }, [isVisible, runSequence]);

  return (
    <div ref={ref} className="terminal-text text-body leading-[1.8] t-panel-label relative">
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
