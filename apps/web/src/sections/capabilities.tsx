"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { PanelBar } from "@/components/panel-bar";
import { CardTitle } from "@/components/card-title";
import { AgentSessionSequence } from "@/components/agent-session-sequence";
import { TabPanel } from "@/components/tab-panel";
import { useTerminalCache } from "@/hooks/use-terminal-cache";
import { useIntersectionReveal } from "@/hooks/use-intersection-reveal";

function IconVoice({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 640" fill="currentColor">
      <path d="M300 68v504h-56V68h56zm192 64v376h-56V132h56zM204 164v312h-56V164h56zm192 32v248h-56V196h56zM108 260v120H52V260h56zm480 0v120h-56V260h56z" />
    </svg>
  );
}

function IconAgents({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 640" fill="currentColor">
      <path opacity=".4" d="M40.4 197.7l45.3 65.9c11.7-8.1 54.2-37.3 127.5-87.6h138.9v48H224v64h237.4l9.4-9.4 70.6-70.6h66.7V80H211.7l-10.2 7C100.2 156.6 46.5 193.5 40.4 197.7z" />
      <path d="M98.7 432l70.6-70.6 9.4-9.4H416v64H288v48h138.8c73.3-50.4 115.7-79.6 127.5-87.6l45.3 65.9c-6.1 4.2-59.8 41.1-161 110.7l-10.2 7H32V432h66.7z" />
    </svg>
  );
}

function IconSkills({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 640" fill="currentColor">
      <path opacity=".4" d="M104 280L104 416L152 416L152 328L248 328L296 376L296 416L344 416L344 376L392 328L488 328L488 416L536 416L536 280L392 280L344 232L344 192L296 192L296 232L248 280L104 280z" />
      <path d="M96 96L544 96L544 192L96 192L96 96zM192 416L192 544L64 544L64 416L192 416zM384 416L384 544L256 544L256 416L384 416zM576 416L576 544L448 544L448 416L576 416z" />
    </svg>
  );
}

function IconGateway({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 640" fill="currentColor">
      <path opacity=".4" d="M128 274.6c15.6 7.4 33.2 7 48 0v90.8c-14.8-7-32.4-7.4-48 0V274.6zm56-4.6c6.5-4.6 12.2-10.6 16.5-17.9 4.3-7.5 6.7-15.6 7.4-23.7L288 274.1l-1.6 1.2L264 288v27.6l-80-45.6zm0 100.1l80-45.7V352l22.4 12.8 1.6 1.2-80.1 45.8c-.6-8.1-3-16.2-7.4-23.7-4.3-7.4-9.9-13.4-16.5-17.9zM296 170.6c7.3 3.5 15.4 5.4 24 5.4s16.7-1.9 24-5.4v98.8l-2.6-1.1L320 256l-21.4 12.2-1.4.7V170.5zm0 200c.8.4 1.7.8 2.6 1.1L320 384l21.4-12.2 1.4-.6v98.8c-7.3-3.5-15.4-5.4-24-5.4s-16.7 1.9-24 5.4V370.7zm56-96.7l80.1-45.8c.6 8.1 3 16.2 7.4 23.7 4.2 7.4 9.9 13.4 16.5 17.9l-80 45.7V288l-22.4-12.9-1.6-1.1zm0 91.9l1.6-1.2L376 352v-27.6l80 45.7c-6.5 4.6-12.2 10.6-16.5 17.9-4.3 7.5-6.7 15.6-7.4 23.7l-80.1-45.9zM464 274.6c14.8 7 32.4 7.4 48 0v90.8c-15.6-7.4-33.2-7-48 0V274.6z" />
      <path d="M320 176c30.9 0 56-25.1 56-56s-25.1-56-56-56-56 25.1-56 56 25.1 56 56 56zm119.5 76c15.5 26.8 49.7 36 76.5 20.5s36-49.7 20.5-76.5-49.7-36-76.5-20.5-36 49.7-20.5 76.5zM180 175.5c-26.8-15.5-61-6.3-76.5 20.5S97.2 257 124 272.5s61 6.3 76.5-20.5S206.8 191 180 175.5zM320 576c30.9 0 56-25.1 56-56s-25.1-56-56-56-56 25.1-56 56 25.1 56 56 56zm-140-111.5c26.8-15.5 36-49.7 20.5-76.5S151 336 124 367.5 88 417.2 103.5 444 153.2 480 180 464.5zm356.5-20.5c15.5-26.8 6.3-61-20.5-76.5s-61-6.3-76.5 20.5-6.3 61 20.5 76.5 61 6.3 76.5-20.5zM286.4 364.8c3.7 2.8 7.8 5.2 12.2 7l21.4 12.2 21.4-12.2c4.4-1.8 8.5-4.2 12.2-7L376 352V288l-22.4-12.8c-3.7-2.8-7.8-5.2-12.2-7L320 256l-21.4 12.2c-4.4 1.8-8.5 4.2-12.2 7L264 288v64l22.4 12.8z" />
    </svg>
  );
}

function IconModels({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 640" fill="currentColor">
      <path opacity=".4" d="M96 96v448h448V96H96zm100 68h120v136H196V164zm32 176h56v136h-40v-96h-16v-40zm8-136h40v56h-40v-56zm88 136h120v136H324V340zm32-176h56v136h-40V204h-16v-40zm8 176h40v56h-40v-56z" />
      <path d="M196 164h120v136H196V164zm40 40v56h40v-56h-40zm120-40h56v136h-40V204h-16v-40zM228 340h56v136h-40v-96h-16v-40zm96 0h120v136H324V340zm40 40v56h40v-56h-40z" />
    </svg>
  );
}

function IconEverywhere({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 640" fill="currentColor">
      <path opacity=".4" d="M56.4 232.5l72.9 64.8C128.4 304.7 128 312.3 128 320s.5 15.2 1.3 22.7l-72.9 64.8L112.4 504.5l92.6-30.7c19.7 14.8 42.4 25.8 67 32.2V400.1h303.1l-64.5-57.3c.9-7.4 1.4-15 1.4-22.7s-.5-15.2-1.4-22.7l72.9-64.8-56-97-92.6 30.7c-12.1-9-25.3-16.7-39.3-22.7L376 48H264l-19.7 95.5c-14 6-27.2 13.7-39.3 22.7l-92.6-30.7-56 97zM240 320c0-44.2 35.8-80 80-80s80 35.8 80 80c0 11.4-2.4 22.2-6.7 32H246.7c-4.3-9.8-6.7-20.6-6.7-32z" />
      <path d="M376 444c24.3 0 44 19.7 44 44v124h-40v-48h-24v48h-40V488c0-24.3 19.7-44 44-44h16zm120 0c33.1 0 60 26.9 60 60s-26.9 60-60 60h-12v48h-40V444h52zm116 168h-40V444h40v168zM360 484c-2.2 0-4 1.8-4 4v36h24v-36c0-2.2-1.8-4-4-4h-16zm124 40h12c11 0 20-9 20-20s-9-20-20-20h-12v40z" />
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
      "$ nous inbox --live",
      "---",
      "telegram  │ incoming message =received",
      "user      │ \"hey, can you reschedule my dentist?\"",
      "nous      │ checking calendar =done",
      "nous      │ \"moved to Thursday 3pm. Notify them?\" =replied",
      "user      │ \"yes\" =confirmed",
      "nous      │ sending confirmation to clinic =done",
      "---",
      "$ nous voice --pickup",
      "---",
      "channel   │ switching to phone call =seamless",
      "nous      │ \"done. I also found a closer clinic —\"",
      "nous      │ \"4.8 stars, 10 min from your office.\"",
      "nous      │ \"want me to book a consult?\" =context preserved",
      "---",
      "One conversation. Two surfaces. Zero repetition. ",
    ],
  },
  {
    key: "agents",
    title: "Delegate real work",
    desc: "Multi-step projects that run for days. Governed, auditable, improving over time.",
    icon: IconAgents,
    content: [
      "$ nous agent --run \"research competitors and draft report\"",
      "---",
      "scope     │ 5-step project =initialized",
      "govern    │ zero-trust permissions =enforced",
      "---",
      "step 1/5  │ scanning 14 sources =complete",
      "step 2/5  │ extracting key insights =complete",
      "step 3/5  │ cross-referencing with your notes =complete",
      "step 4/5  │ drafting executive summary =complete",
      "step 5/5  │ sending report to your email =awaiting approval",
      "---",
      "> permission requested: send email on your behalf",
      "> approved via voice note at 2:47pm",
      "---",
      "step 5/5  │ email sent to you@company.com =complete",
      "audit     │ full action log saved =tamper-evident",
      "---",
      "Every step governed. Nothing happens without your trust.",
      "Week one it asks for everything. Month three it runs on its own — earned.",
    ],
  },
  {
    key: "skills",
    title: "Automate without code",
    desc: "Natural language + visual skill builder. Schedule tasks at any interval. Create digital employees.",
    icon: IconSkills,
    content: [
      "$ nous skill --create",
      "---",
      "user      │ \"every morning, check my calendar and brief me\"",
      "nous      │ parsing intent =understood",
      "---",
      "trigger   │ daily at 7:00am =set",
      "action 1  │ pull today's calendar events =configured",
      "action 2  │ check weather for commute =configured",
      "action 3  │ scan inbox for urgent threads =configured",
      "action 4  │ compile and deliver via telegram =configured",
      "---",
      "skill     │ \"morning brief\" =active",
      "---",
      "$ nous skill --log \"morning brief\"",
      "---",
      "today     │ \"3 meetings, clear skies, 2 urgent emails\"",
      "yesterday │ \"light day, rain expected, nothing urgent\"",
      "streak    │ 47 consecutive days =running",
      "---",
      "Not a prompt chain. A digital employee that improves over time.",
    ],
  },
  {
    key: "gateway",
    title: "Connect everything",
    desc: "Your local AI becomes the central hub via MCP. Every tool feeds intelligence back.",
    icon: IconGateway,
    content: [
      "$ nous gateway --activity",
      "---",
      "slack     │ #design mentioned you =captured",
      "figma     │ new comment on \"dashboard v3\" =indexed",
      "github    │ PR #47 review requested =queued",
      "gmail     │ invoice from AWS =categorized",
      "calendar  │ conflict detected tomorrow 2-3pm =flagged",
      "---",
      "nous      │ analyzing 5 new signals =done",
      "priority  │ PR review is blocking deploy =high",
      "priority  │ design comment needs response =medium",
      "priority  │ invoice is routine =low",
      "---",
      "nous      │ \"3 items need your attention.\"",
      "nous      │ \"PR #47 is blocking — review first.\"",
      "response  │ routed to telegram =delivered",
      "---",
      "Every connected app becomes a source of intelligence.",
      "Your ecosystem learns faster because it shares one mind.",
    ],
  },
  {
    key: "models",
    title: "Every model is supported.",
    desc: "Any provider — local or cloud. Nous suggests the best model for the job, including what runs on your hardware.",
    icon: IconModels,
    content: [
      "$ nous models --route \"summarize this 200-page PDF\"",
      "---",
      "task      │ long document summarization =classified",
      "hardware  │ 32GB RAM, RTX 4090 =detected",
      "---",
      "option 1  │ ollama:llama3 (local, fast, private) =recommended",
      "option 2  │ claude-3.5 (cloud, highest quality) =available",
      "option 3  │ mistral-large (cloud, balanced) =available",
      "---",
      "decision  │ llama3 selected (fits in VRAM) =local",
      "progress  │ processing 200 pages =done",
      "time      │ completed in 4.2 seconds =local",
      "---",
      "$ nous models --fallback",
      "---",
      "policy    │ if quality < 0.85 → escalate to cloud =active",
      "this run  │ quality score 0.91 =passed",
      "cost      │ $0.00 (ran entirely on your hardware) =free",
      "---",
      "Models are swappable compute. Your intelligence lives in the memory layer.",
    ],
  },
  {
    key: "everywhere",
    title: "One mind, every surface",
    desc: "Telegram. Phone call. Discord. Pick up on your laptop where you left off on your phone.",
    icon: IconEverywhere,
    content: [
      "$ nous session --trace",
      "---",
      "09:14     │ started on desktop (nous app) =active",
      "          │ \"plan my trip to Tokyo next month\"",
      "nous      │ researching flights and hotels =done",
      "---",
      "09:32     │ continued on phone (telegram) =seamless",
      "          │ \"actually, add Kyoto for 2 days\"",
      "nous      │ adjusting itinerary =done",
      "---",
      "10:01     │ voice note from car =transcribed",
      "          │ \"book the cheaper flight, window seat\"",
      "nous      │ flight booked, seat 14A =confirmed",
      "---",
      "10:15     │ resumed on laptop (cli) =current",
      "---",
      "$ nous trip --summary",
      "---",
      "flights   │ booked, window seat =confirmed",
      "hotels    │ 5 nights Tokyo, 2 nights Kyoto =reserved",
      "context   │ full history across 4 surfaces =unified",
      "---",
      "One mind. Every device. Nothing lost in between.",
    ],
  },
];

export function Capabilities() {
  const [activeTab, setActiveTab] = useState<string | null>("voice");
  const { ref: sectionRef, isVisible } = useIntersectionReveal({ threshold: 0.15 });
  const cache = useTerminalCache(CAPABILITY_TABS.map((t) => ({ key: t.key, content: t.content })), isVisible);

  const handleTabClick = (key: string) => {
    setActiveTab(key);
  };

  const activeTabData = CAPABILITY_TABS.find((t) => t.key === activeTab);
  const allLines = CAPABILITY_TABS.map((t) => t.content);

  return (
    <section ref={sectionRef} id="capabilities" className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeader label="Capabilities" className="max-w-2xl">
            The next level of intelligence.
          </SectionHeader>
        </Reveal>

        <div className="bg-black/10 backdrop-blur-xl">
        <Reveal delay={100}>
          <div className="border-y border-white/[0.06] overflow-hidden">
            <PanelBar label="nous::modules" meta="6 Loaded" />

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
                        ? "bg-tab-active"
                        : "hover:bg-tab-hover"
                    }`}
                  >
                    <cap.icon className={`w-6 h-6 -ml-4 mt-0.5 shrink-0 ${
                      activeTab === cap.key ? "text-accent/60" : "text-accent/40"
                    }`} />
                    <div>
                      <CardTitle className="mb-1">{cap.title}</CardTitle>
                      <p className="terminal-text text-xs t-card-desc leading-relaxed">{cap.desc}</p>
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
                allLines={allLines}
              />
            </div>

            {/* Mobile: button grid + terminal */}
            <div className="lg:hidden">
              <div className="grid grid-cols-2 gap-3 p-4 md:p-6">
                {CAPABILITY_TABS.map((cap) => (
                  <button
                    key={cap.key}
                    onClick={() => handleTabClick(cap.key)}
                    className={`border p-3 text-left transition-colors flex items-start gap-2.5 ${
                      activeTab === cap.key
                        ? "border-accent/30 bg-tab-active"
                        : "border-white/[0.06] hover:border-white/[0.12] hover:bg-tab-hover"
                    }`}
                  >
                    <cap.icon className={`w-5 h-5 mt-0.5 shrink-0 ${
                      activeTab === cap.key ? "text-accent/60" : "text-accent/40"
                    }`} />
                    <div>
                      <CardTitle className="mb-1">{cap.title}</CardTitle>
                      <p className="terminal-text text-[10px] t-card-desc leading-relaxed">{cap.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <TabPanel
                tabKey={activeTab}
                lines={activeTabData?.content ?? null}
                defaultContent={null}
                cachedEngine={activeTab ? cache.getEngine(activeTab) : null}
                allLines={allLines}
              />
            </div>
          </div>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
