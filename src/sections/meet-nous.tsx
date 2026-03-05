"use client";

import { useState, useMemo } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { PanelBar } from "@/components/panel-bar";
import { BodyText } from "@/components/body-text";
import { TerminalSequence } from "@/components/terminal-sequence";
import { TabPanel } from "@/components/tab-panel";
import { useTerminalCache } from "@/hooks/use-terminal-cache";
import { useIntersectionReveal } from "@/hooks/use-intersection-reveal";

function detectOS(): "windows" | "macos" | "linux" {
  if (typeof navigator === "undefined") return "macos";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows";
  if (ua.includes("mac")) return "macos";
  return "linux";
}

function buildInstallContent(os: "windows" | "macos" | "linux"): string[] {
  const tag = (key: "windows" | "macos" | "linux") => key === os ? "=recommended" : "=~available";
  return [
    "$ nous install --help",
    "---",
    `windows   │ nous-desktop.exe ${tag("windows")}`,
    `macos     │ nous-desktop.dmg ${tag("macos")}`,
    `linux     │ nous-desktop.AppImage ${tag("linux")}`,
    `cli       │ curl -sL get.nous.dev | sh =~available`,
    `git       │ git clone nous-core =~latest`,
    "---",
    "One command. Any platform. Running in under a minute.",
    "Your data stays local. Your agent starts immediately.",
    "Free forever.",
  ];
}

const STATIC_TABS = [
  {
    key: "memory",
    label: "Memory",
    value: "Persistent",
    content: [
      "$ nous memory --status",
      "---",
      "records   │ every conversation stored =persistent",
      "prefs     │ learned preferences =147 active",
      "context   │ cross-session recall =enabled",
      "---",
      "No more repeating yourself. Close the tab — nothing is lost.",
      "Your history compounds over time. The longer you use it, the better it knows you.",
    ],
  },
  {
    key: "agency",
    label: "Agency",
    value: "Autonomous",
    content: [
      "$ nous agent --permissions",
      "---",
      "trust     │ zero-trust =default",
      "actions   │ execute on your behalf =authorized",
      "escalate  │ asks before acting =always",
      "---",
      "It doesn't just answer — it acts. Tasks, workflows, real work.",
      "Week one it asks for every approval. Month three it runs on its own — because it earned it.",
    ],
  },
  {
    key: "models",
    label: "Models",
    value: "Any provider",
    content: [
      "$ nous models --list",
      "---",
      "local     │ ollama:llama3 =ready",
      "cloud     │ claude-3.5, gpt-4 =routed",
      "custom    │ your fine-tunes =supported",
      "---",
      "Nous picks the best model for the job — including what fits your hardware.",
      "Models are swappable compute. Your intelligence lives in the memory layer.",
    ],
  },
  {
    key: "access",
    label: "Access",
    value: "Every device",
    content: [
      "$ nous devices --registered",
      "---",
      "desktop   │ nous app =connected",
      "mobile    │ telegram, voice =connected",
      "terminal  │ nous-cli =connected",
      "---",
      "One mind, every device. Beautiful app or CLI — your choice.",
      "The surface is open and extensible, not a single locked-down interface.",
    ],
  },
  {
    key: "open-source",
    label: "Open Source",
    value: "Fully public",
    content: [
      "$ git clone nous-core",
      "---",
      "runtime   │ fully public =auditable",
      "license   │ open source =forkable",
      "data      │ yours always =sovereign",
      "---",
      "No lock-in, no black boxes. Fork it, extend it, contribute back.",
      "No terms of service written three thousand miles away. You own it.",
    ],
  },
];

export function MeetNous() {
  const [activeTab, setActiveTab] = useState<string | null>("install");
  const { ref: sectionRef, isVisible } = useIntersectionReveal({ threshold: 0.15 });

  const TABS = useMemo(() => {
    const os = detectOS();
    return [
      { key: "install", label: "Install", value: "Every platform", content: buildInstallContent(os) },
      ...STATIC_TABS,
    ];
  }, []);

  const cache = useTerminalCache(TABS.map((t) => ({ key: t.key, content: t.content })), isVisible);

  const handleTabClick = (key: string) => {
    setActiveTab(key);
  };

  const activeTabData = TABS.find((t) => t.key === activeTab);

  return (
    <section ref={sectionRef} id="meet-nous" className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeader label="What is Nous">
            Meet your autonomous agent.
          </SectionHeader>
        </Reveal>

        <Reveal delay={100}>
          {/* Full-width bordered container */}
          <div className="border-y border-white/[0.06] overflow-hidden">
            <PanelBar label="nous::core" meta="Yours By Design" />

            {/* Content: split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left: text + stat grid */}
              <div className="p-6 md:p-10 lg:border-r border-white/[0.06]">
                <BodyText className="mb-8">
                  An agent that remembers, acts, and learns — running on your hardware or the cloud, accessible from any device, owned entirely by you.
                </BodyText>
                <div className="grid grid-cols-2 gap-4">
                  {TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => handleTabClick(tab.key)}
                      className={`border p-3 text-left transition-colors ${
                        activeTab === tab.key
                          ? "border-accent/30 bg-white/[0.03]"
                          : "border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]"
                      }`}
                    >
                      <p className="terminal-text text-[10px] uppercase tracking-[0.2em] t-nav mb-1">{tab.label}</p>
                      <p className="font-mono text-sm font-semibold t-stat-value">{tab.value}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: terminal / tab content */}
              <TabPanel
                tabKey={activeTab}
                lines={activeTabData?.content ?? null}
                defaultContent={<TerminalSequence />}
                cachedEngine={activeTab ? cache.getEngine(activeTab) : null}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
