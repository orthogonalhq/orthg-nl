"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { AgentSessionSequence } from "@/components/agent-session-sequence";
import { TabPanel } from "@/components/tab-panel";

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
      "Talk to it through Telegram. Over a phone call. Through your microphone. A Discord bot.",
      "Have it monitor your security cameras. Pick up on your laptop where you left off on your phone.",
      "Resolve an escalation from a voice note. The context follows you because the mind is one mind.",
    ],
  },
  {
    key: "agents",
    title: "Delegate real work",
    desc: "Multi-step projects that run for days. Governed, auditable, improving over time.",
    icon: IconAgents,
    content: [
      "Delegate multi-step projects and trust them to execute with accuracy and auditability over days and weeks.",
      "Every step is governed: your AI knows what it can handle alone, what it should flag, and what it must ask you about.",
      "A workflow that needed your approval on every step in week one might run autonomously by month three — because it's proven it can.",
    ],
  },
  {
    key: "skills",
    title: "Automate without code",
    desc: "Natural language + visual skill builder. Schedule tasks at any interval. Create digital employees.",
    icon: IconSkills,
    content: [
      "Build workflows, projects, and skills using natural language prompting AND a visual skill builder simultaneously.",
      "Schedule tasks at any interval — hourly, daily, weekly — or have them running 24/7.",
      "Use this to build businesses. Create digital employees. Automate your personal operations.",
      "This isn't a prompt chain. It's delegation to an intelligence that gets more capable over time.",
    ],
  },
  {
    key: "gateway",
    title: "Connect everything",
    desc: "Your local AI becomes the central hub via MCP. Every tool feeds intelligence back.",
    icon: IconGateway,
    content: [
      "Nous exposes an MCP server. Your local AI becomes the central knowledge base for your entire network.",
      "Connect it to every application that supports MCP. Every tool you use becomes a source of intelligence.",
      "Your entire ecosystem of services learning faster, because they share a mind.",
    ],
  },
  {
    key: "models",
    title: "Any model. Your choice.",
    desc: "Any provider — local or cloud. Nous suggests the best model for the job, including what runs on your hardware.",
    icon: IconModels,
    content: [
      "Run on any provider — Ollama, OpenAI, Anthropic, Mistral, Groq, your own fine-tunes. Mix and match.",
      "Nous measures your local compute power and tells you what you can run on your own hardware. Or just let it auto-select.",
      "Models are swappable compute. Your intelligence lives in the memory layer. When a better model drops, plug it in.",
    ],
  },
  {
    key: "everywhere",
    title: "One mind, every surface",
    desc: "Telegram. Phone call. Discord. Pick up on your laptop where you left off on your phone.",
    icon: IconEverywhere,
    content: [
      "You don't need dozens of project chat groups and hundreds of scattered threads — although you can organize it that way.",
      "Talk to it through Telegram. Over a phone call. Through your microphone. A Discord bot.",
      "The communication surface is open and extensible, not a single locked-down interface.",
    ],
  },
];

export function Capabilities() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleTabClick = (key: string) => {
    setActiveTab((prev) => (prev === key ? null : key));
  };

  const activeTabData = CAPABILITY_TABS.find((t) => t.key === activeTab);

  return (
    <section id="capabilities" className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeader label="Capabilities" className="max-w-2xl">
            What your AI can finally do.
          </SectionHeader>
        </Reveal>

        <Reveal delay={100}>
          <div className="border-y border-white/[0.06] overflow-hidden">
            {/* Header bar */}
            <div className="border-b border-white/[0.06] px-6 md:px-10 py-3 flex items-center justify-between">
              <span className="terminal-text text-[11px] uppercase tracking-[0.2em] text-white/30">Modules</span>
              <span className="terminal-text text-[10px] text-white/15">6 loaded</span>
            </div>

            {/* Split: left list + right visual */}
            <div className="grid grid-cols-1 lg:grid-cols-2">
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
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
