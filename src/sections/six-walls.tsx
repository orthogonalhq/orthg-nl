import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const WALLS = [
  { code: "ERR_01", title: "Your data isn't yours", body: "Every conversation, every insight — on someone else's servers, training someone else's models." },
  { code: "ERR_02", title: "Sessions expire", body: "No memory. No continuity. Close the tab and everything you built together is gone." },
  { code: "ERR_03", title: "Pay per thought", body: "Cloud compute, per-token pricing, usage caps. The cost of a true AI partner is prohibitive." },
  { code: "ERR_04", title: "Walled gardens", body: "Locked to one model, one vendor. Each provider wants to be your everything." },
  { code: "ERR_05", title: "No autonomy", body: "It can draft an email but not send it. It can write code but not deploy it. It lives behind glass." },
  { code: "ERR_06", title: "Fragmented", body: "One chat window. Close it and the context is gone. No continuity across devices, channels, or surfaces." },
];

export function SixWalls() {
  return (
    <section id="six-walls" className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeader label="The problem" center>
            Six walls between you
            <br className="hidden sm:block" />
            and sovereign AI.
          </SectionHeader>
        </Reveal>

        {/* 2x3 grid — compact, inside a single bordered container */}
        <Reveal delay={100}>
          <div className="border-y border-white/[0.06] divide-y divide-white/[0.06]">
            {/* Header bar */}
            <div className="px-6 md:px-10 py-3 flex items-center justify-between">
              <span className="terminal-text text-[11px] uppercase tracking-[0.2em] text-white/30">diagnostic report</span>
              <span className="terminal-text text-[10px] text-red-400/30">6 critical</span>
            </div>
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
              {WALLS.slice(0, 3).map((wall) => (
                <div key={wall.title} className="p-6 md:p-8">
                  <p className="terminal-text text-[10px] text-red-400/30 tracking-[0.15em] uppercase mb-2">{wall.code}</p>
                  <h3 className="font-mono text-sm font-semibold tracking-[-0.01em] mb-2 text-white/80">
                    {wall.title}
                  </h3>
                  <p className="terminal-text text-xs text-white/30 leading-relaxed">
                    {wall.body}
                  </p>
                </div>
              ))}
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
              {WALLS.slice(3, 6).map((wall) => (
                <div key={wall.title} className="p-6 md:p-8">
                  <p className="terminal-text text-[10px] text-red-400/30 tracking-[0.15em] uppercase mb-2">{wall.code}</p>
                  <h3 className="font-mono text-sm font-semibold tracking-[-0.01em] mb-2 text-white/80">
                    {wall.title}
                  </h3>
                  <p className="terminal-text text-xs text-white/30 leading-relaxed">
                    {wall.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
