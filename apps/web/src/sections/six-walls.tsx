import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { PanelBar } from "@/components/panel-bar";
import { CardTitle } from "@/components/card-title";

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
            <br />
            and sovereign AI.
          </SectionHeader>
        </Reveal>

        {/* 2x3 grid — compact, inside a single bordered container */}
        <Reveal delay={100}>
          <div className="border-y border-white/[0.06] divide-y divide-white/[0.06]">
            <PanelBar label="nous::security" meta="6 Critical" metaCls="text-red-400/30" />
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
              {WALLS.slice(0, 3).map((wall) => (
                <div key={wall.title} className="p-6 md:p-8">
                  <p className="terminal-text text-[10px] text-red-400/30 tracking-[0.15em] uppercase mb-2">{wall.code}</p>
                  <CardTitle className="tracking-[-0.01em] mb-2">{wall.title}</CardTitle>
                  <p className="terminal-text text-xs t-card-desc leading-relaxed">
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
                  <CardTitle className="tracking-[-0.01em] mb-2">{wall.title}</CardTitle>
                  <p className="terminal-text text-xs t-card-desc leading-relaxed">
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
