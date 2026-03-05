import type { Seg, RLine } from "@/hooks/use-terminal-engine";

const SPINNER = "⣾⣽⣻⢿⡿⣟⣯⣷".split("");
const SPINNER_MS = 80;

export interface EngineSnapshot {
  output: RLine[];
  typing: { line: RLine; charIndex: number } | null;
  done: boolean;
}

export type EngineListener = (snapshot: EngineSnapshot) => void;

export interface HeadlessEngine {
  subscribe: (fn: EngineListener) => () => void;
  getSnapshot: () => EngineSnapshot;
  typeLine: (segments: Seg[], charMs: number) => Promise<RLine>;
  addInstant: (segments: Seg[]) => RLine;
  addBlank: () => void;
  spinStandalone: (ms: number) => Promise<void>;
  spinOnLine: (ms: number, result: Seg[]) => Promise<void>;
  finish: () => void;
  wait: (ms: number) => Promise<void>;
  abort: () => void;
}

export function createHeadlessEngine(): HeadlessEngine {
  let output: RLine[] = [];
  let typing: { line: RLine; charIndex: number } | null = null;
  let done = false;
  let idCounter = 0;
  let aborted = false;
  const listeners = new Set<EngineListener>();

  let snapshot: EngineSnapshot = { output: [], typing: null, done: false };

  function notify() {
    snapshot = { output: [...output], typing, done };
    listeners.forEach((fn) => fn(snapshot));
  }

  function subscribe(fn: EngineListener) {
    listeners.add(fn);
    fn(snapshot);
    return () => listeners.delete(fn);
  }

  function getSnapshot() {
    return snapshot;
  }

  const nextId = () => ++idCounter;

  function wait(ms: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (aborted) { reject(new Error("aborted")); return; }
      setTimeout(() => {
        if (aborted) { reject(new Error("aborted")); return; }
        resolve();
      }, ms);
    });
  }

  async function typeLine(segments: Seg[], charMs: number): Promise<RLine> {
    const line: RLine = { id: nextId(), segments };
    const total = segments.reduce((s, seg) => s + seg.text.length, 0);

    if (charMs === 0 || total === 0) {
      typing = null;
      output = [...output, line];
      notify();
      return line;
    }

    for (let ci = 1; ci <= total; ci++) {
      if (aborted) throw new Error("aborted");
      typing = { line, charIndex: ci };
      notify();
      await wait(charMs);
    }
    typing = null;
    output = [...output, line];
    notify();
    return line;
  }

  function addInstant(segments: Seg[]): RLine {
    const line: RLine = { id: nextId(), segments };
    output = [...output, line];
    notify();
    return line;
  }

  function addBlank() {
    addInstant([{ text: " " }]);
  }

  async function spinStandalone(ms: number) {
    if (output.length === 0) return;
    output = [...output.slice(0, -1), { ...output[output.length - 1], spinning: true, spinnerChar: SPINNER[0] }];
    notify();

    const start = Date.now();
    let frame = 0;
    while (Date.now() - start < ms) {
      if (aborted) throw new Error("aborted");
      frame = (frame + 1) % SPINNER.length;
      output = [...output.slice(0, -1), { ...output[output.length - 1], spinnerChar: SPINNER[frame] }];
      notify();
      await wait(SPINNER_MS);
    }

    output = [...output.slice(0, -1), { ...output[output.length - 1], spinning: false }];
    notify();
  }

  async function spinOnLine(ms: number, result: Seg[]) {
    if (output.length === 0) return;
    output = [...output.slice(0, -1), { ...output[output.length - 1], spinning: true, spinnerChar: SPINNER[0] }];
    notify();

    const start = Date.now();
    let frame = 0;
    while (Date.now() - start < ms) {
      if (aborted) throw new Error("aborted");
      frame = (frame + 1) % SPINNER.length;
      output = [...output.slice(0, -1), { ...output[output.length - 1], spinnerChar: SPINNER[frame] }];
      notify();
      await wait(SPINNER_MS);
    }

    const last = { ...output[output.length - 1], spinning: false };
    last.segments = [...last.segments, ...result];
    output = [...output.slice(0, -1), last];
    notify();
  }

  function finish() {
    if (output.length > 0) {
      output = [...output.slice(0, -1), { ...output[output.length - 1], showCaret: true }];
    }
    done = true;
    notify();
  }

  function abort() {
    aborted = true;
  }

  return { subscribe, getSnapshot, typeLine, addInstant, addBlank, spinStandalone, spinOnLine, finish, wait, abort };
}
