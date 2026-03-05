import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { BodyText } from "@/components/body-text";

export function Responsibility() {
  return (
    <section id="responsibility" className="relative px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeader label="Responsibility" size="small">
            If we build agents that replace labor,
            <br className="hidden sm:block" />
            we fund the people they&nbsp;displace.
          </SectionHeader>
        </Reveal>

        <Reveal delay={100}>
          <div className="border-y border-white/[0.06] overflow-hidden">
            <div className="px-6 md:px-10 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <span className="terminal-text text-[11px] uppercase tracking-[0.2em] text-white/30">protocol::ubi</span>
              <span className="terminal-text text-[10px] text-white/15">built into the operating model</span>
            </div>
            <div className="px-6 md:px-10 py-8 md:py-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
              <div className="md:flex-1">
                <BodyText>
                  A structural percentage of autonomous agent revenue funds UBI. Not a pledge. Built into the operating model.
                </BodyText>
              </div>
              <div className="shrink-0 terminal-text text-[11px] text-white/10 hidden md:block">
                <p>revenue.split()</p>
                <p>&nbsp;&nbsp;├── operations</p>
                <p>&nbsp;&nbsp;├── creators</p>
                <p>&nbsp;&nbsp;└── <span className="text-accent/30">ubi_fund</span></p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
