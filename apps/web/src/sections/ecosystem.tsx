import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { PanelBar } from "@/components/panel-bar";
import { BodyText } from "@/components/body-text";

export function Ecosystem() {
  return (
    <section id="ecosystem" className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeader label="Ecosystem">
            Not a walled garden.
            <br />
            An open foundation.
          </SectionHeader>
        </Reveal>

        <div className="bg-black/10 backdrop-blur-xl">
        <Reveal delay={100}>
          <div className="border-y border-white/[0.06] overflow-hidden">
            <PanelBar label="nous::ecosystem" meta="Open Source" />

            {/* Body text */}
            <div className="px-6 md:px-10 py-8 md:py-10 border-b border-white/[0.06]">
              <BodyText className="max-w-2xl">
                Every skill shared makes the ecosystem smarter. Every integration expands the surface area. Build on Nous — contribute to everyone.
              </BodyText>
            </div>

            {/* Three pillars */}
            {(() => {
              const pillars = [
                { label: "Marketplace", desc: "Discover and install community-built skills and packages. Publish your own. Earn revenue as a creator.", cmd: "nous install <skill>" },
                { label: "Open Source", desc: "The runtime is public. The architecture is auditable. Fork it, extend it, contribute back.", cmd: "git clone nous-core" },
                { label: "Nous Cloud", desc: "Don\u2019t want to self-host? We run it for you. Sovereign by default \u2014 your data stays yours.", cmd: "nous deploy --sovereign" },
              ];
              return (
                <div className="grid grid-cols-1 md:grid-cols-3">
                  {pillars.map((p, i) => (
                    <div
                      key={p.label}
                      className={`p-6 md:p-8 border-white/[0.06] ${
                        i < pillars.length - 1 ? "border-b md:border-b-0 md:border-r" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="terminal-prefix">›</span>
                        <span className="terminal-text text-accent text-xs uppercase tracking-[0.2em]">{p.label}</span>
                      </div>
                      <p className="terminal-text text-xs t-card-desc leading-relaxed">{p.desc}</p>
                      <p className="terminal-text text-label t-faint mt-3">{p.cmd}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
