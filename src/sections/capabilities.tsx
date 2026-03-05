"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { AgentSessionSequence } from "@/components/agent-session-sequence";
import { TabPanel } from "@/components/tab-panel";
import { useTerminalCache } from "@/hooks/use-terminal-cache";
import { useIntersectionReveal } from "@/hooks/use-intersection-reveal";

function IconVoice({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1.5v13M5 4v8M11 4v8M2.5 6.5v3M13.5 6.5v3" />
    </svg>
  );
}

function IconAgents({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="5" r="2.5" />
      <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" />
      <path d="M12 4l2-2M4 4L2 2" />
    </svg>
  );
}

function IconSkills({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="5" height="5" rx="0.5" />
      <rect x="9" y="2" width="5" height="5" rx="0.5" />
      <rect x="2" y="9" width="5" height="5" rx="0.5" />
      <rect x="9" y="9" width="5" height="5" rx="0.5" />
    </svg>
  );
}

function IconGateway({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3M3.4 3.4l2.1 2.1M10.5 10.5l2.1 2.1M12.6 3.4l-2.1 2.1M5.5 10.5l-2.1 2.1" />
    </svg>
  );
}

function IconModels({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5l6-3.5L14 5v6l-6 3.5L2 11V5z" />
      <path d="M2 5l6 3.5L14 5" />
      <path d="M8 8.5V14.5" />
    </svg>
  );
}

function IconEverywhere({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="12" height="8" rx="1" />
      <path d="M5 13h6M8 10v3" />
    </svg>
  );
}

const CAPABILITY_TABS = [
  {
    key: "voice",
    title: "Talk to your AI",
    desc: "Converse with your entire agent mesh. Build skills by talking. Resolve escalations from a voice note.",
    icon: IconVoice,
    content: [
      "$ nous voice --channels",
      "---",
      "telegram  │ voice + text =connected",
      "phone     │ direct call =connected",
      "discord   │ bot integration =connected",
      "---",
      "Pick up on your laptop where you left off on your phone.",
      "The context follows you because the mind is one mind.",
    ],
  },
  {
    key: "agents",
    title: "Delegate real work",
    desc: "Multi-step projects that run for days. Governed, auditable, improving over time.",
    icon: IconAgents,
    content: [
      "$ nous agent --delegate",
      "---",
      "scope     │ multi-step projects =days/weeks",
      "govern    │ per-step permissions =enforced",
      "audit     │ full action log =tamper-evident",
      "---",
      "Every step is governed: it knows what to handle alone and what to ask you about.",
      "Week one it asks for every approval. Month three it runs autonomously — earned trust.",
    ],
  },
  {
    key: "skills",
    title: "Automate without code",
    desc: "Natural language + visual skill builder. Schedule tasks at any interval. Create digital employees.",
    icon: IconSkills,
    content: [
      "$ nous skills --builder",
      "---",
      "input     │ natural language + visual =simultaneous",
      "schedule  │ hourly, daily, 24/7 =configurable",
      "output    │ digital employees =autonomous",
      "---",
      "Build workflows using prompts and a visual builder at the same time.",
      "This isn't a prompt chain. It's delegation to intelligence that compounds.",
    ],
  },
  {
    key: "gateway",
    title: "Connect everything",
    desc: "Your local AI becomes the central hub via MCP. Every tool feeds intelligence back.",
    icon: IconGateway,
    content: [
      "$ nous gateway --mcp-status",
      "---",
      "server    │ MCP exposed =active",
      "clients   │ connected applications =12",
      "sync      │ bidirectional intelligence =live",
      "---",
      "Every app that supports MCP becomes a source of intelligence.",
      "Your entire ecosystem learns faster because it shares a mind.",
    ],
  },
  {
    key: "models",
    title: "Any model. Your choice.",
    desc: "Any provider — local or cloud. Nous suggests the best model for the job, including what runs on your hardware.",
    icon: IconModels,
    content: [
      "$ nous models --available",
      "---",
      "local     │ ollama:llama3 =ready",
      "cloud     │ claude-3.5, gpt-4, mistral =routed",
      "custom    │ your fine-tunes =supported",
      "---",
      "Nous measures your hardware and suggests what you can run locally.",
      "Models are swappable compute. Your intelligence lives in the memory layer.",
    ],
  },
  {
    key: "everywhere",
    title: "One mind, every surface",
    desc: "Telegram. Phone call. Discord. Pick up on your laptop where you left off on your phone.",
    icon: IconEverywhere,
    content: [
      "$ nous surfaces --list",
      "---",
      "app       │ nous desktop =active",
      "mobile    │ telegram, voice =active",
      "cli       │ nous-cli =active",
      "---",
      "No more dozens of chat groups and scattered threads.",
      "The communication surface is open and extensible — not locked down.",
    ],
  },
];

export function Capabilities() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const { ref: sectionRef, isVisible } = useIntersectionReveal({ threshold: 0.15 });
  const cache = useTerminalCache(CAPABILITY_TABS.map((t) => ({ key: t.key, content: t.content })), isVisible);

  const handleTabClick = (key: string) => {
    setActiveTab((prev) => (prev === key ? null : key));
  };

  const activeTabData = CAPABILITY_TABS.find((t) => t.key === activeTab);

  return (
    <section ref={sectionRef} id="capabilities" className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeader label="Capabilities" className="max-w-2xl">
            What your agent can do.
          </SectionHeader>
        </Reveal>

        <Reveal delay={100}>
          <div className="border-y border-white/[0.06] overflow-hidden">
            {/* Header bar */}
            <div className="border-b border-white/[0.06] px-6 md:px-10 py-3 flex items-center justify-between">
              <span className="terminal-text text-[11px] uppercase tracking-[0.2em] text-white/30">Modules</span>
              <span className="terminal-text text-[10px] text-white/15">6 loaded</span>
            </div>

            {/* Desktop: split layout */}
            <div className="hidden lg:grid lg:grid-cols-2">
              {/* Left: stacked capability rows */}
              <div className="lg:border-r border-white/[0.06] divide-y divide-white/[0.06]">
                {CAPABILITY_TABS.map((cap) => (
                  <button
                    key={cap.key}
                    onClick={() => handleTabClick(cap.key)}
                    className={`w-full px-6 md:px-8 py-5 flex items-start gap-4 text-left transition-colors ${
                      activeTab === cap.key
                        ? "bg-white/[0.03]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <cap.icon className={`w-4 h-4 mt-0.5 shrink-0 ${
                      activeTab === cap.key ? "text-accent/60" : "text-accent/40"
                    }`} />
                    <div>
                      <h3 className="font-mono text-sm font-semibold text-white/80 mb-1">{cap.title}</h3>
                      <p className="terminal-text text-xs text-white/30 leading-relaxed">{cap.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right: agent session / tab content */}
              <TabPanel
                tabKey={activeTab}
                lines={activeTabData?.content ?? null}
                defaultContent={<AgentSessionSequence />}
                cachedEngine={activeTab ? cache.getEngine(activeTab) : null}
              />
            </div>

            {/* Mobile: accordion layout */}
            <div className="lg:hidden divide-y divide-white/[0.06]">
              {CAPABILITY_TABS.map((cap) => (
                <div key={cap.key}>
                  <button
                    onClick={() => handleTabClick(cap.key)}
                    className={`w-full px-6 md:px-8 py-5 flex items-start gap-3 text-left transition-colors ${
                      activeTab === cap.key
                        ? "bg-white/[0.03]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <cap.icon className={`w-4 h-4 mt-0.5 shrink-0 ${
                      activeTab === cap.key ? "text-accent/60" : "text-accent/40"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-mono text-sm font-semibold text-white/80 mb-1">{cap.title}</h3>
                      <p className="terminal-text text-xs text-white/30 leading-relaxed">{cap.desc}</p>
                    </div>
                    <span className={`terminal-text text-[10px] mt-1 shrink-0 transition-transform duration-200 ${
                      activeTab === cap.key ? "text-accent/40 rotate-90" : "text-white/15"
                    }`}>▸</span>
                  </button>
                  {activeTab === cap.key && (
                    <TabPanel
                      tabKey={cap.key}
                      lines={cap.content}
                      defaultContent={null}
                      cachedEngine={cache.getEngine(cap.key)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
