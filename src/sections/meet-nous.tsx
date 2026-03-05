"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { BodyText } from "@/components/body-text";
import { TerminalSequence } from "@/components/terminal-sequence";
import { TabPanel } from "@/components/tab-panel";

const TABS = [
  {
    key: "runtime",
    label: "Runtime",
    value: "Local-first",
    content: [
      "All of it. Every memory, every learned pattern, every decision your AI has ever made — stored locally, on your machine, under your control.",
      "Export it. Back it up. Delete it. It's yours the way your thoughts are yours.",
      "Your AI runs on your hardware. No cloud dependency. No terms of service written by a legal team three thousand miles away.",
    ],
  },
  {
    key: "models",
    label: "Models",
    value: "Any provider",
    content: [
      "Run your agent mesh on any provider you choose — local or cloud. Ollama, OpenAI, Anthropic, Mistral, Groq, your own fine-tunes.",
      "For every task, Nous suggests the best model for the job — including measuring your local compute and telling you what you can run on your own hardware.",
      "Models are swappable compute. Your intelligence lives in the memory layer. When a better model drops next month, plug it in. Nothing is lost.",
    ],
  },
  {
    key: "memory",
    label: "Memory",
    value: "Persistent",
    content: [
      "Your AI becomes the central knowledge base for your entire digital life via MCP.",
      "Connect it to every application that supports the protocol. Every tool you use becomes a source of intelligence that feeds back into your personal AI.",
      "Not just your assistant learning faster. Your entire ecosystem of services learning faster, because they share a mind.",
    ],
  },
  {
    key: "governance",
    label: "Governance",
    value: "User-defined",
    content: [
      "Per-project, per-task, or full system control if you trust it that far. You decide the boundaries. The Cortex enforces them.",
      "Every action is logged in a tamper-evident witness chain you can audit at any time.",
      "The permission model is as granular or as broad as you want, and every escalation is explicit.",
    ],
  },
];

export function MeetNous() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleTabClick = (key: string) => {
    setActiveTab((prev) => (prev === key ? null : key));
  };

  const activeTabData = TABS.find((t) => t.key === activeTab);

  return (
    <section id="meet-nous" className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeader label="The solution">
            What happens when you remove the walls.
          </SectionHeader>
        </Reveal>

        <Reveal delay={100}>
          {/* Full-width bordered container */}
          <div className="border-y border-white/[0.06] overflow-hidden">
            {/* Top: header bar */}
            <div className="border-b border-white/[0.06] px-6 md:px-10 py-3 flex items-center justify-between">
              <span className="terminal-text text-[11px] uppercase tracking-[0.2em] text-white/30">nous::core</span>
              <span className="terminal-text text-[10px] text-white/15">
                The operating system for AI
              </span>
            </div>

            {/* Content: split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left: text + stat grid */}
              <div className="p-6 md:p-10 lg:border-r border-white/[0.06]">
                <BodyText className="mb-8">
                  Sovereign. Self-hosted. Open source. Runs on your hardware, compounds from your life, governed by your rules.
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
                      <p className="terminal-text text-[10px] uppercase tracking-[0.2em] text-white/25 mb-1">{tab.label}</p>
                      <p className="font-mono text-sm font-semibold text-white/70">{tab.value}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: terminal / tab content */}
              <TabPanel
                tabKey={activeTab}
                lines={activeTabData?.content ?? null}
                defaultContent={<TerminalSequence />}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
