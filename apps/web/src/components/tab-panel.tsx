"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore, type ReactNode } from "react";
import type { Seg, RLine } from "@/hooks/use-terminal-engine";
import type { HeadlessEngine, EngineSnapshot } from "@/hooks/use-headless-engine";
import { TerminalLine } from "@/components/terminal-line";
import { MorphLines } from "@/components/morph-lines";

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/~`";

type Phase = "default" | "glitch-out" | "morph" | "show";

interface TabPanelProps {
  /** null = show defaultContent, string[] = show typed lines */
  lines: string[] | null;
  /** Key to force re-transition when switching between tabs */
  tabKey: string | null;
  defaultContent: ReactNode;
  /** Cached headless engine for this tab (from useTerminalCache) */
  cachedEngine?: HeadlessEngine | null;
  /** All possible content arrays — used to lock height to the tallest tab */
  allLines?: string[][];
}

/**
 * Parse a content line string into terminal engine Seg arrays + behavior hints.
 *
 *   "$ command"              → command line (typed, then spin)
 *   "label   │ desc =status" → label row (typed label+desc, spin → status)
 *   "---"                    → blank + spin pause
 *   regular text             → plain typed line
 */
export function parseLineToSegs(line: string): { segs: Seg[]; spinResult?: Seg[]; isCommand?: boolean; isSeparator?: boolean } {
  if (line === "---") {
    return { segs: [], isSeparator: true };
  }

  if (line.startsWith("$ ")) {
    return {
      segs: [
        { text: "$ ", cls: "text-accent/60" },
        { text: line.slice(2), cls: "t-panel-label" },
      ],
      isCommand: true,
    };
  }

  const pipeIdx = line.indexOf("│");
  if (pipeIdx !== -1) {
    const labelStr = line.slice(0, pipeIdx);
    const afterPipe = line.slice(pipeIdx + 2);

    const eqIdx = afterPipe.lastIndexOf(" =");
    if (eqIdx !== -1) {
      const desc = afterPipe.slice(0, eqIdx + 1);
      const rawStatus = afterPipe.slice(eqIdx + 2);
      const dim = rawStatus.startsWith("~");
      const status = dim ? rawStatus.slice(1) : rawStatus;
      return {
        segs: [
          { text: labelStr, cls: "t-nav" },
          { text: "│ ", cls: "t-ghost" },
          { text: desc, cls: "t-body" },
        ],
        spinResult: [{ text: status, cls: dim ? "t-meta" : "text-green-400/40" }],
      };
    }

    return {
      segs: [
        { text: labelStr, cls: "t-nav" },
        { text: "│ ", cls: "t-ghost" },
        { text: afterPipe, cls: "t-body" },
      ],
    };
  }

  return { segs: [{ text: line, cls: "t-card-desc" }] };
}

/** Flatten an engine snapshot's output lines to plain text strings */
function flattenSnapshot(snapshot: EngineSnapshot): string[] {
  return snapshot.output.map((line) =>
    line.segments.map((s) => s.text).join("")
  );
}

/** Subscribe to a headless engine and render its output via TerminalLine */
function CachedEngineViewer({ engine, lines }: { engine: HeadlessEngine; lines: string[] }) {
  const snapshot = useSyncExternalStore(engine.subscribe, engine.getSnapshot, engine.getSnapshot);

  const ghostLines = lines.filter((l) => l !== "---").map((l) => l.replace(/ =\S+$/, ""));

  return (
    <div className="terminal-text text-body leading-[1.8] t-panel-label relative">
      <div className="invisible" aria-hidden="true">
        {ghostLines.map((text, i) => (
          <p key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{text}</p>
        ))}
      </div>
      <div className="absolute inset-0">
        {snapshot.output.map((line) => (
          <TerminalLine key={line.id} line={line} />
        ))}
        {snapshot.typing && (
          <TerminalLine line={snapshot.typing.line} charLimit={snapshot.typing.charIndex} />
        )}
      </div>
    </div>
  );
}

/** Dissolve-out component: renders old lines while they glitch away (Full → Empty) */
function GlitchOutLines({
  lines,
  onComplete,
}: {
  lines: string[];
  onComplete: () => void;
}) {
  const [displays, setDisplays] = useState<string[]>(lines);
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
        <p key={i} className="terminal-text text-xs t-body leading-relaxed min-h-[1.25em]">
          {d}
        </p>
      ))}
    </div>
  );
}

/** Strip separators and status suffixes to get display-ready ghost text */
function toGhostLines(raw: string[]): string[] {
  return raw.filter((l) => l !== "---").map((l) => l.replace(/ =\S+$/, ""));
}

export function TabPanel({ lines, tabKey, defaultContent, cachedEngine, allLines }: TabPanelProps) {
  const [phase, setPhase] = useState<Phase>("default");
  const [prevRenderedText, setPrevRenderedText] = useState<string[]>([]);
  const [targetRenderedText, setTargetRenderedText] = useState<string[]>([]);
  const [activeLines, setActiveLines] = useState<string[]>([]);
  const [activeEngine, setActiveEngine] = useState<HeadlessEngine | null>(null);
  const prevKeyRef = useRef<string | null>(null);
  const prevEngineRef = useRef<HeadlessEngine | null>(null);

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    const prevEngine = prevEngineRef.current;
    prevKeyRef.current = tabKey;
    prevEngineRef.current = cachedEngine ?? null;

    // Same tab, engine just became available — update it in place
    if (tabKey !== null && tabKey === prevKey && cachedEngine && !prevEngine) {
      setActiveEngine(cachedEngine);
      setActiveLines(lines!);
      setPhase("show");
      return;
    }

    // null → null: default
    if (tabKey === null && prevKey === null) {
      setPhase("default");
      return;
    }

    // tab → null (Full → Empty): dissolve out
    if (tabKey === null && prevKey !== null) {
      const sourceText = prevEngine ? flattenSnapshot(prevEngine.getSnapshot()) : [];
      setPrevRenderedText(sourceText);
      setPhase("glitch-out");
      return;
    }

    // null → tab (Empty → Full): show engine directly
    if (prevKey === null && tabKey !== null) {
      setActiveLines(lines!);
      setActiveEngine(cachedEngine ?? null);
      setPhase("show");
      return;
    }

    // tab → tab (Full → Full): morph transition
    const sourceText = prevEngine ? flattenSnapshot(prevEngine.getSnapshot()) : [];
    const targetEngine = cachedEngine ?? null;
    const targetText = targetEngine ? flattenSnapshot(targetEngine.getSnapshot()) : [];

    setPrevRenderedText(sourceText);
    setTargetRenderedText(targetText);
    setActiveLines(lines!);
    setActiveEngine(targetEngine);
    setPhase("morph");
  }, [tabKey, lines, cachedEngine]);

  const handleGlitchOutComplete = useCallback(() => {
    setPhase("default");
  }, []);

  const handleMorphComplete = useCallback(() => {
    setPhase("show");
  }, []);

  // Find the longest tab's ghost lines to lock height
  const longestGhost = allLines
    ? allLines.reduce<string[]>((best, arr) => {
        const g = toGhostLines(arr);
        return g.length > best.length ? g : best;
      }, [])
    : null;

  return (
    <div className="scanlines border-t border-white/[0.06] lg:border-t-0 bg-terminal min-h-[280px] flex flex-col">
      <div className="p-6 md:p-10 flex-1 overflow-hidden bg-black/30 relative">
        {/* Invisible sizer — reserves height of the tallest tab */}
        {longestGhost && (
          <div className="invisible terminal-text text-body leading-[1.8]" aria-hidden="true">
            {longestGhost.map((text, i) => (
              <p key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{text}</p>
            ))}
          </div>
        )}
        <div className={longestGhost ? "absolute inset-0 p-6 md:p-10 overflow-y-auto" : ""}>
          {phase === "default" && defaultContent}
          {phase === "glitch-out" && (
            <GlitchOutLines lines={prevRenderedText} onComplete={handleGlitchOutComplete} />
          )}
          {phase === "morph" && (
            <MorphLines
              sourceLines={prevRenderedText}
              targetLines={targetRenderedText}
              onComplete={handleMorphComplete}
            />
          )}
          {phase === "show" && activeEngine && (
            <CachedEngineViewer engine={activeEngine} lines={activeLines} />
          )}
        </div>
      </div>
    </div>
  );
}
