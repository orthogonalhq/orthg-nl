import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const LAYERS = [
  {
    name: "Cortex",
    brain: "Prefrontal cortex",
    desc: "Orchestration, reflection, governance",
    detail: "Decides which tasks to perform, reflects on outcomes, governs what happens next.",
    status: "active",
    pid: "001",
  },
  {
    name: "Memory",
    brain: "Hippocampus",
    desc: "Persistent learning, experience indexing",
    detail: "Reconstructs knowledge from fragments. Every experience carries outcomes and sentiment.",
    status: "active",
    pid: "002",
  },
  {
    name: "Subconscious",
    brain: "Gray matter",
    desc: "Multi-agent orchestration, pattern matching",
    detail: "Routes execution, delegates to worker models, builds patterns from repetition.",
    status: "active",
    pid: "003",
  },
  {
    name: "Autonomic",
    brain: "Nervous system",
    desc: "Storage, health, self-repair",
    detail: "Maintains baseline health — versioning, embeddings, monitoring. You never think about it.",
    status: "active",
    pid: "004",
  },
];

export function Architecture() {
  return (
    <section id="architecture" className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Centered heading */}
        <Reveal>
          <SectionHeader label="Architecture" center>
            A cognitive architecture
            <br className="hidden sm:block" />
            inspired by the brain.
          </SectionHeader>
        </Reveal>

        {/* Architecture diagram — single bordered container with stacked layers */}
        <Reveal delay={100}>
          <div className="border-y border-white/[0.06]">
            {/* Header */}
            <div className="border-b border-white/[0.06] px-6 md:px-10 py-3 flex items-center justify-between">
              <span className="terminal-text text-[11px] uppercase tracking-[0.2em] text-white/30">nous::layers</span>
              <span className="terminal-text text-[10px] text-white/15">Cognitive Stack</span>
            </div>

            {/* Layers — shared grid so the vertical divider aligns across all rows */}
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
              {LAYERS.map((layer, i) => (
                <div key={layer.name} className="contents">
                  {/* Left: layer label */}
                  <div className={`px-6 md:pl-10 md:pr-5 py-5 md:border-r border-white/[0.06] overflow-visible min-w-0 ${
                    i < LAYERS.length - 1 ? "border-b border-white/[0.06]" : ""
                  }`}>
                    <div className="flex w-full items-start justify-between gap-4">
                      <div className="min-w-0 overflow-visible">
                        <div className="flex items-baseline gap-2">
                          <span className={`text-[10px] leading-none relative -top-px ${layer.status === "active" ? "text-green-400/40" : "text-white/15"}`}>●</span>
                          <span className="font-mono text-sm font-semibold text-accent/80">{layer.name}</span>
                        </div>
                        <div className="terminal-text text-[10px] text-white/20 mt-1 pl-[18px] whitespace-nowrap">
                          ← {layer.brain}
                        </div>
                      </div>
                      <span className="terminal-text text-[10px] text-white/10 shrink-0 pt-1 text-right">PID {layer.pid}</span>
                    </div>
                  </div>

                  {/* Right: description */}
                  <div className={`px-6 md:px-10 py-5 ${
                    i < LAYERS.length - 1 ? "border-b border-white/[0.06]" : ""
                  }`}>
                    <p className="terminal-text text-xs uppercase tracking-[0.15em] text-white/40 mb-1.5">
                      {layer.desc}
                    </p>
                    <p className="terminal-text text-xs text-white/25 leading-relaxed">
                      {layer.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
