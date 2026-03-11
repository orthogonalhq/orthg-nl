"use client";

import { use, useEffect, useId, useState } from "react";

export function Mermaid({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <MermaidContent chart={chart} />;
}

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;
  const promise = fn();
  cache.set(key, promise);
  return promise;
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "_");

  const { default: mermaid } = use(
    cachePromise("mermaid", () => import("mermaid"))
  );

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    fontFamily: "var(--font-ibm-plex-mono), ui-monospace, monospace",
    theme: "base",
    flowchart: {
      useMaxWidth: false,
      htmlLabels: true,
      curve: "basis",
      rankSpacing: 60,
      nodeSpacing: 30,
      padding: 15,
    },
    sequence: {
      useMaxWidth: false,
      actorMargin: 80,
      messageMargin: 40,
    },
    themeVariables: {
      // Background
      darkMode: true,
      background: "#141414",
      mainBkg: "#1a1a1a",
      nodeBkg: "#1a1a1a",
      clusterBkg: "#141414",

      // Text
      primaryTextColor: "rgba(255,255,255,0.85)",
      secondaryTextColor: "rgba(255,255,255,0.55)",
      tertiaryTextColor: "rgba(255,255,255,0.38)",
      titleColor: "rgba(255,255,255,0.90)",
      nodeTextColor: "rgba(255,255,255,0.85)",

      // Borders & lines
      primaryBorderColor: "#333333",
      secondaryBorderColor: "#222222",
      tertiaryBorderColor: "#222222",
      nodeBorder: "#333333",
      clusterBorder: "#222222",
      lineColor: "rgba(255,255,255,0.22)",

      // Accent (orange)
      primaryColor: "rgba(250,93,43,0.12)",
      secondaryColor: "#1a1a1a",
      tertiaryColor: "#141414",

      // Links & edges
      edgeLabelBackground: "#141414",

      // Notes
      noteBkgColor: "rgba(250,93,43,0.06)",
      noteTextColor: "rgba(255,255,255,0.62)",
      noteBorderColor: "rgba(250,93,43,0.20)",

      // Sequence diagram
      actorBkg: "#1a1a1a",
      actorBorder: "#333333",
      actorTextColor: "rgba(255,255,255,0.85)",
      actorLineColor: "rgba(255,255,255,0.12)",
      signalColor: "rgba(255,255,255,0.62)",
      signalTextColor: "rgba(255,255,255,0.62)",
      labelBoxBkgColor: "#1a1a1a",
      labelBoxBorderColor: "#333333",
      labelTextColor: "rgba(255,255,255,0.85)",
      loopTextColor: "rgba(255,255,255,0.55)",
      activationBorderColor: "#FA5D2B",
      activationBkgColor: "rgba(250,93,43,0.08)",
      sequenceNumberColor: "#000000",

      // Flowchart
      fillType0: "rgba(250,93,43,0.08)",
      fillType1: "#1a1a1a",
      fillType2: "rgba(250,142,46,0.06)",
      fillType3: "#141414",

      // Gantt
      gridColor: "#222222",
      doneTaskBkgColor: "rgba(250,93,43,0.15)",
      activeTaskBkgColor: "rgba(250,93,43,0.25)",
      taskTextColor: "rgba(255,255,255,0.85)",
      sectionBkgColor: "#141414",
      altSectionBkgColor: "#1a1a1a",
    },
  });

  const { svg, bindFunctions } = use(
    cachePromise(chart, () => mermaid.render(id, chart.replaceAll("\\n", "\n")))
  );

  return (
    <div
      className="my-6 overflow-x-auto rounded-md border border-white/[0.06] bg-card p-4 [&_svg]:mx-auto"
      ref={(el) => {
        if (el) bindFunctions?.(el);
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
