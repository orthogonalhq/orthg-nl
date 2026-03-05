import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { BodyText } from "@/components/body-text";

const PRINCIPLES = [
  {
    label: "UBI",
    title: "Fund the transition",
    body: "A structural percentage of autonomous agent revenue funds universal basic income. Not a pledge. Not a PR initiative. Built into the operating model from day one — the kind investors, employees, and the public can hold us accountable to.",
  },
  {
    label: "Distribution",
    title: "Intelligence on a billion machines",
    body: "When intelligence runs on a billion machines, owned by a billion people, no single entity can misalign it. No single policy change can degrade it. No single acquisition can capture it. Distributed AI is the defense.",
  },
  {
    label: "Access",
    title: "Equal access. No exceptions.",
    body: "The full cognitive architecture is open, free, and runs on any hardware. Intelligence shouldn't be gated by wealth, connections, or where you were born. Everyone gets the same mind.",
  },
  {
    label: "Alignment",
    title: "Aligned to you. No one else.",
    body: "When your AI runs on your machine, governed by your rules, it serves one interest: yours. No shareholder incentives. No engagement metrics. No geopolitical leverage. Sovereign intelligence is aligned intelligence — because the person it serves is the person who controls it.",
  },
];

export function Responsibility() {
  return (
    <section id="responsibility" className="relative px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeader label="Responsibility">
            Democratized intelligence.
            <br className="hidden sm:block" />
            Structural accountability.
          </SectionHeader>
        </Reveal>

        <Reveal delay={100}>
          <div className="border-y border-white/[0.06] overflow-hidden">
            <div className="px-6 md:px-10 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <span className="terminal-text text-[11px] uppercase tracking-[0.2em] text-white/45">nous::protocol</span>
              <span className="terminal-text text-[10px] text-white/15">Universal Basic Income</span>
            </div>

            <div className="px-6 md:px-10 py-8 md:py-10 border-b border-white/[0.06]">
              <BodyText className="max-w-2xl">
                If we build the most powerful technology ever created, we owe the world more than a terms of service.
              </BodyText>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {PRINCIPLES.map((p, idx) => (
                <div
                  key={p.label}
                  className={`p-6 md:p-8 ${
                    idx % 2 === 0 ? "md:border-r" : ""
                  } ${idx < 2 ? "border-b" : ""} border-white/[0.06]`}
                >
                  <span className="terminal-text text-[10px] uppercase tracking-[0.2em] text-white/30">{p.label}</span>
                  <h3 className="font-mono text-sm font-semibold text-white/80 mt-3 mb-3">{p.title}</h3>
                  <BodyText>{p.body}</BodyText>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
