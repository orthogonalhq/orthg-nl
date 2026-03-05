import type { Seg } from "@/hooks/use-terminal-engine";
import { parseLineToSegs } from "@/components/tab-panel";

interface SequenceEngine {
  typeLine: (segments: Seg[], charMs: number) => Promise<unknown>;
  addBlank: () => void;
  spinStandalone: (ms: number) => Promise<void>;
  spinOnLine: (ms: number, result: Seg[]) => Promise<void>;
  finish: () => void;
  wait: (ms: number) => Promise<void>;
}

/** Run a terminal typing sequence from a string[] content array */
export async function runTerminalSequence(lines: string[], engine: SequenceEngine) {
  for (const line of lines) {
    const parsed = parseLineToSegs(line);

    if (parsed.isSeparator) {
      engine.addBlank();
      await engine.spinStandalone(200);
      continue;
    }

    if (parsed.isCommand) {
      await engine.typeLine(parsed.segs, 25);
      await engine.wait(80);
      await engine.spinStandalone(300);
      continue;
    }

    if (parsed.spinResult) {
      await engine.typeLine(parsed.segs, 8);
      await engine.spinOnLine(150 + Math.random() * 150, parsed.spinResult);
      await engine.wait(30);
      continue;
    }

    // Regular text
    await engine.typeLine(parsed.segs, 8);
    await engine.wait(20);
  }

  engine.finish();
}
