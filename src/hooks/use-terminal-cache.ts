"use client";

import { useRef, useEffect } from "react";
import { createHeadlessEngine, type HeadlessEngine } from "@/hooks/use-headless-engine";
import { runTerminalSequence } from "@/lib/run-terminal-sequence";

interface TabDef {
  key: string;
  content: string[];
}

interface CacheEntry {
  engine: HeadlessEngine;
  started: boolean;
}

/** Create and run headless terminal engines for all tabs in parallel — only when visible */
export function useTerminalCache(tabs: TabDef[], isVisible: boolean) {
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

  useEffect(() => {
    if (!isVisible) return;

    const cache = cacheRef.current;

    for (const tab of tabs) {
      if (!cache.has(tab.key)) {
        const engine = createHeadlessEngine();
        cache.set(tab.key, { engine, started: false });
      }
    }

    for (const tab of tabs) {
      const entry = cache.get(tab.key)!;
      if (!entry.started) {
        entry.started = true;
        runTerminalSequence(tab.content, entry.engine).catch(() => {
          // Swallow abort errors from cleanup
        });
      }
    }

    return () => {
      for (const entry of cache.values()) {
        entry.engine.abort();
      }
    };
  }, [isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  function getEngine(key: string): HeadlessEngine | null {
    return cacheRef.current.get(key)?.engine ?? null;
  }

  return { getEngine };
}
