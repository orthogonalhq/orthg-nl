import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { BodyText } from "@/components/body-text";

export function Ecosystem() {
  return (
    <section id="ecosystem" className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeader label="Ecosystem">
            Not a walled garden.
            <br className="hidden sm:block" />
            An open foundation.
          </SectionHeader>
        </Reveal>

        <Reveal delay={100}>
          <div className="border-y border-white/[0.06] overflow-hidden">
            {/* Header bar */}
            <div className="px-6 md:px-10 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <span className="terminal-text text-[11px] uppercase tracking-[0.2em] text-white/30">ecosystem::core</span>
              <span className="terminal-text text-[10px] text-white/15">open source</span>
            </div>

            {/* Body text */}
            <div className="px-6 md:px-10 py-8 md:py-10 border-b border-white/[0.06]">
              <BodyText className="max-w-2xl">
                Every skill shared makes the ecosystem smarter. Every integration expands the surface area. Build on Nous — contribute to everyone.
              </BodyText>
            </div>

            {/* Three pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="terminal-prefix">$</span>
                  <span className="terminal-text text-accent/60 text-xs uppercase tracking-[0.2em]">Marketplace</span>
                </div>
                <p className="terminal-text text-xs text-white/30 leading-relaxed">
                  Discover and install community-built skills and packages. Publish your own. Earn revenue as a creator.
                </p>
                <p className="terminal-text text-[10px] text-white/10 mt-3">nous install &lt;skill&gt;</p>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="terminal-prefix">$</span>
                  <span className="terminal-text text-accent/60 text-xs uppercase tracking-[0.2em]">Open Source</span>
                </div>
                <p className="terminal-text text-xs text-white/30 leading-relaxed">
                  The runtime is public. The architecture is auditable. Fork it, extend it, contribute back.
                </p>
                <p className="terminal-text text-[10px] text-white/10 mt-3">git clone nous-core</p>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="terminal-prefix">$</span>
                  <span className="terminal-text text-accent/60 text-xs uppercase tracking-[0.2em]">Nous Cloud</span>
                </div>
                <p className="terminal-text text-xs text-white/30 leading-relaxed">
                  Don&apos;t want to self-host? We run it for you. Sovereign by default — your data stays yours.
                </p>
                <p className="terminal-text text-[10px] text-white/10 mt-3">nous deploy --sovereign</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
