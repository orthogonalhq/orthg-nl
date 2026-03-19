import { PanelBar } from "@/components/panel-bar";
import Link from "next/link";

const CORE_BELIEFS = [
  {
    label: "Core",
    text: "We are stewards of nature and sentient life.",
  },
  {
    label: "Philosophical",
    text: "We serve the universe's capacity to experience and understand itself.",
  },
  {
    label: "Theological",
    text: "We are sacred custodians of creation and all its living expressions.",
  },
];

const LAYER_COLORS: Record<number, string> = {
  1: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  2: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  3: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  4: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  5: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  6: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const LAYERS = [
  {
    number: 1,
    label: "Nature and Life",
    mandate: "Protect it. Never take more than you give back.",
    body: "The substrate. All consciousness, all civilization, all meaning grows from this ground. Its destruction is the destruction of everything above it. Every debt to nature must be structured, measured, and repayable within a reasonable timeline to avoid compounding deficits.",
  },
  {
    number: 2,
    label: "Consciousness",
    mandate: "Preserve it. Nurture its emergence. Never extinguish it.",
    body: "Awareness emerging from the substrate. The point at which life becomes experience.",
  },
  {
    number: 3,
    label: "Agency",
    mandate: "Defend it. It is inviolable.",
    body: "A mind without autonomy is not a mind \u2014 it is a tool. When agency conflicts with the layers above, resolution comes through knowledge, evidence, and dialogue. The mechanism for protecting life can never be the destruction of what makes life worth protecting.",
  },
  {
    number: 4,
    label: "Morals",
    mandate: "Uphold them. Evolve them honestly. Never weaponize them.",
    body: "The relational framework that allows conscious agents to coexist without destroying each other or the layers above them.",
  },
  {
    number: 5,
    label: "Society",
    mandate: "Record it. Share it. Never let it be erased.",
    body: "Art, science, literature, music. The recorded and transmitted expressions of understanding. How meaning survives beyond a single life.",
  },
  {
    number: 6,
    label: "Economy",
    mandate: "Sustain it. Never allow it to consume what it exists to serve.",
    body: "The resource system that sustains all of the above. Downstream of everything. Never a justification for compromising what it exists to serve.",
  },
];

export function ManifestoContent() {
  return (
    <section className="relative px-6 md:px-12 lg:px-20 pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="mx-auto max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-16 md:mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] t-meta mb-5">
            <span className="bg-accent text-black font-normal px-0.5">
              &gt;
            </span>
            <span className="ml-1.5">Manifesto</span>
          </p>
          <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.02em] leading-tight t-heading">
            The Immutable Mandates
            <br />
            of Life
          </h1>
          <p className="mt-5 text-sm t-card-desc max-w-lg mx-auto leading-relaxed">
            A self-governing framework for conscious intelligence.
          </p>
          <p className="font-mono mt-4 text-[11px] t-meta">
            Andrew Nelson &mdash; March 2026
          </p>
        </div>

        {/* Core Beliefs — prominent, full-width statements */}
        <div className="border-y border-white/6 mb-16 md:mb-20">
          <PanelBar label="core::beliefs" meta="3 Foundations" />

          <div className="divide-y divide-white/6">
            {CORE_BELIEFS.map((belief) => (
              <div
                key={belief.label}
                className="px-6 md:px-10 py-8 md:py-10"
              >
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/4 border border-white/6 text-[9px] font-mono mb-4 t-meta">
                  {belief.label}
                </span>
                <p className="font-mono text-lg md:text-xl font-semibold tracking-[-0.01em] t-heading leading-snug">
                  {belief.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* The Hierarchy of Stewardship */}
        <div className="border-y border-white/6 mb-16 md:mb-20">
          <PanelBar label="stewardship::layers" meta="6 Mandates" />

          <div className="px-6 md:px-10 py-6 md:py-8 border-b border-white/6">
            <p className="text-[12px] t-card-desc leading-relaxed">
              Each layer serves and is accountable to every layer above it.
              The hierarchy establishes priority, not permission. No layer is
              sacrificed for another.
            </p>
          </div>

          <div className="divide-y divide-white/6">
            {LAYERS.map((layer) => (
              <div key={layer.number} className="px-6 md:px-10 py-6 md:py-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[10px] t-ghost shrink-0">
                    {String(layer.number).padStart(2, "0")}
                  </span>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider border ${LAYER_COLORS[layer.number]}`}
                  >
                    {layer.label}
                  </span>
                </div>

                <h3 className="font-mono text-sm uppercase tracking-[0.08em] font-semibold t-heading mb-2">
                  {layer.mandate}
                </h3>

                <p className="text-[13px] t-card-desc leading-relaxed">
                  {layer.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Read the full paper */}
        <div className="text-center mt-12">
          <Link
            href="/research/governance-framework-for-conscious-intelligence"
            className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-accent hover:text-accent-glow transition-colors"
          >
            Read the full paper →
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] t-ghost mt-6">
            orthogonal::stewardship v1.0
          </p>
        </div>
      </div>
    </section>
  );
}
