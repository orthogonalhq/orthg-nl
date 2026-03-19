"use client";

import { useState, useEffect } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { PanelBar } from "@/components/panel-bar";
import { CardTitle } from "@/components/card-title";
import { BodyText } from "@/components/body-text";

type Billing = "monthly" | "annual";
type Region = "eu" | "us";

/* ── VPS tier data ───────────────────────────────────────────────── */

interface VPSTier {
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  specs: string[];
  note: string;
  highlighted?: boolean;
  isLocal?: boolean;
}

const LOCAL_TIER: VPSTier = {
  name: "Local", tagline: "Your hardware, your rules", monthly: 0, annual: 0, specs: ["Your own machine", "Unlimited storage"], note: "Full open source", isLocal: true,
};

const EU_TIERS: VPSTier[] = [
  LOCAL_TIER,
  { name: "Starter", tagline: "Personal AI workspace", monthly: 15, annual: 12, specs: ["4 vCPU / 8 GB RAM", "80 GB storage"], note: "Model benchmarks TBA" },
  { name: "Standard", tagline: "Daily driver", monthly: 25, annual: 20, specs: ["4 vCPU / 8 GB RAM", "80 GB storage"], note: "Model benchmarks TBA", highlighted: true },
  { name: "Power", tagline: "Full control, SSH access", monthly: 59, annual: 47, specs: ["8 vCPU / 16 GB RAM", "200 GB storage"], note: "Model benchmarks TBA" },
];

const US_TIERS: VPSTier[] = [
  LOCAL_TIER,
  { name: "Starter", tagline: "Personal AI workspace", monthly: 25, annual: 20, specs: ["2 vCPU / 8 GB RAM", "80 GB storage"], note: "Model benchmarks TBA" },
  { name: "Standard", tagline: "Daily driver", monthly: 49, annual: 39, specs: ["4 vCPU / 16 GB RAM", "80 GB storage"], note: "Model benchmarks TBA", highlighted: true },
  { name: "Power", tagline: "Full control, SSH access", monthly: 99, annual: 79, specs: ["8 vCPU / 32 GB RAM", "200 GB storage"], note: "Model benchmarks TBA" },
];

/* ── Intelligence tier data ──────────────────────────────────────── */

interface IntelTier {
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  creditPool: string | null;
  valueMultiplier: string | null;
  features: string[];
  highlighted?: boolean;
  isByok?: boolean;
}

const INTEL_TIERS: IntelTier[] = [
  { name: "BYOK", tagline: "Bring your own keys", monthly: 0, annual: 0, creditPool: null, valueMultiplier: "--", features: ["Your API keys", "Your provider rates", "Full parallel execution"], isByok: true },
  { name: "Lite", tagline: "Occasional cloud tasks", monthly: 19, annual: 15, creditPool: "$19 credit pool", valueMultiplier: "1.00x", features: ["Managed routing", "All frontier models", "Overage opt-in"] },
  { name: "Standard", tagline: "Daily workflows", monthly: 39, annual: 31, creditPool: "$45 credit pool", valueMultiplier: "1.15x", features: ["Managed routing", "All frontier models", "Overage opt-in"], highlighted: true },
  { name: "Pro", tagline: "Heavy agentic workloads", monthly: 199, annual: 159, creditPool: "$250 credit pool", valueMultiplier: "1.25x", features: ["Managed routing", "All frontier models", "Overage opt-in"] },
];

/* ── Routing strategy data ───────────────────────────────────────── */

interface RoutingStrategy {
  name: string;
  badge?: { text: string; variant: "success" | "info" };
  description: string;
  burnFilled: number;
  burnColor: "low" | "mid" | "high" | "none";
  burnLabel: string | null;
  bestFor: string;
}

const ROUTING_ROW1: RoutingStrategy[] = [
  { name: "Optimal value", description: "Picks the cheapest model that meets the task requirements. Prefers local when available.", burnFilled: 1, burnColor: "low", burnLabel: "slowest", bestFor: "Best for getting the most from your credit pool" },
  { name: "Optimal balance", badge: { text: "default", variant: "info" }, description: "Weighs quality against cost. Spends more when the task is worth it, saves when it isn\u2019t.", burnFilled: 3, burnColor: "mid", burnLabel: "moderate", bestFor: "Best for reliable daily use without watching your balance" },
  { name: "Optimal quality", description: "Always picks the best model. Frontier reasoning on every task.", burnFilled: 5, burnColor: "high", burnLabel: "fastest", bestFor: "Best for when the output matters more than the spend" },
];

const ROUTING_ROW2: RoutingStrategy[] = [
  { name: "Local", badge: { text: "free", variant: "success" }, description: "Runs on your hardware. Unlimited. No credits used.", burnFilled: 0, burnColor: "none", burnLabel: "none", bestFor: "Quality depends on your local model" },
  { name: "Manual", description: "Pick the exact model for each agent or task.", burnFilled: 5, burnColor: "low", burnLabel: "you decide", bestFor: "Full control over model selection and spend" },
];

/* ── Helper components ───────────────────────────────────────────── */

const BURN_FILL: Record<string, string> = {
  low: "bg-white/40",
  mid: "bg-emerald-400",
  high: "bg-accent",
};

function BurnMeter({ filled, color }: { filled: number; color: string }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-5 rounded-sm ${
            i < filled ? BURN_FILL[color] ?? "bg-white/[0.06]" : "bg-white/[0.06]"
          }`}
        />
      ))}
    </div>
  );
}

function RoutingCell({ strategy: s }: { strategy: RoutingStrategy }) {
  return (
    <div className="p-6 md:p-8 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="terminal-prefix">›</span>
          <CardTitle>{s.name}</CardTitle>
        </div>
        {s.badge && (
          <span
            className={`shrink-0 text-label uppercase tracking-[0.15em] px-2 py-0.5 ${
              s.badge.variant === "success"
                ? "bg-emerald-400/10 text-emerald-400"
                : "bg-white/[0.06] t-card-title"
            }`}
          >
            {s.badge.text}
          </span>
        )}
      </div>

      <p className="terminal-text text-xs t-card-desc leading-relaxed flex-1 mb-4">{s.description}</p>

      <div>
        <BurnMeter filled={s.burnFilled} color={s.burnColor} />

        <p className="terminal-text text-label t-meta mt-1.5">
          {s.burnLabel ? `Credit burn: ${s.burnLabel}` : "\u00A0"}
        </p>

        <p className="terminal-text text-label t-faint mt-1">
          {s.bestFor}
        </p>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */

export function PricingContent() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [region, setRegion] = useState<Region>("us");

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.startsWith("Europe/") || tz.startsWith("Africa/")) {
        setRegion("eu");
      }
    } catch {
      /* default to US */
    }
  }, []);

  const vpsTiers = region === "eu" ? EU_TIERS : US_TIERS;
  const regionLabel = region === "eu" ? "Showing EU pricing." : "Showing US pricing.";

  return (
    <div className="pt-28">
      {/* ── Section 1: Header ───────────────────────────────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28 text-center">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionHeader label="Pricing" center size="large">
              Your intelligence.
              <br />
              Your infrastructure.
            </SectionHeader>
            <BodyText className="max-w-xl mx-auto">
              Pick your seat. Add intelligence when you need it.
            </BodyText>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-8 inline-flex items-center rounded-full border border-white/[0.06] bg-card p-1">
              <button
                onClick={() => setBilling("monthly")}
                className={`cursor-pointer rounded-full px-5 py-2 font-mono text-xs tracking-wide transition-colors ${
                  billing === "monthly"
                    ? "bg-white/[0.08] t-card-title"
                    : "t-meta hover:t-body"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("annual")}
                className={`cursor-pointer rounded-full px-5 py-2 font-mono text-xs tracking-wide transition-colors ${
                  billing === "annual"
                    ? "bg-white/[0.08] t-card-title"
                    : "t-meta hover:t-body"
                }`}
              >
                Annual
                <span className="ml-2 text-label text-emerald-400">save 20%</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Section 2: Step 1 — Choose your seat ────────────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionHeader label="Step 1" size="small">
              Choose your seat
            </SectionHeader>
          </Reveal>

          <div className="bg-black/10 backdrop-blur-xl">
          <Reveal delay={100}>
            <div className="border-y border-white/[0.06]">
              <PanelBar label="nous::cloud" meta={regionLabel} />

              <div className="px-6 md:px-10 py-6 md:py-8 border-b border-white/[0.06]">
                <BodyText>
                  Your Nous instance — runtime, web UI, MCP gateway, storage.
                </BodyText>
              </div>

              <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  region === "eu" ? "lg:grid-cols-5" : "lg:grid-cols-4"
                } divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]`}
              >
                {vpsTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`relative p-6 flex flex-col ${
                      tier.highlighted ? "bg-white/[0.02]" : ""
                    }`}
                  >
                    {tier.highlighted && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 terminal-text text-label uppercase tracking-[0.15em] bg-accent text-black px-1.5 py-0.5 whitespace-nowrap">
                        most popular
                      </span>
                    )}

                    <CardTitle>{tier.name}</CardTitle>
                    <p className="terminal-text text-xs t-card-desc mt-1">
                      {tier.tagline}
                    </p>

                    <div className="mt-5 mb-5">
                      {tier.isLocal ? (
                        <span className="font-mono text-4xl font-semibold t-hero-head">Free</span>
                      ) : (
                        <>
                          <span className="font-mono text-4xl font-semibold t-hero-head">
                            ${billing === "annual" ? tier.annual : tier.monthly}
                          </span>
                          <span className="terminal-text text-sm t-meta">/mo</span>
                        </>
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      {tier.specs.map((spec) => (
                        <p key={spec} className="terminal-text text-xs t-card-desc">
                          {spec}
                        </p>
                      ))}
                      <p className="terminal-text text-xs t-meta">{tier.note}</p>
                    </div>

                    {tier.isLocal ? (
                      <a
                        href="/download"
                        className="mt-6 block w-full text-center border border-accent/60 px-6 py-3 font-accent text-xs uppercase tracking-[0.15em] text-accent transition-all duration-200 hover:bg-accent hover:text-white hover:border-accent"
                      >
                        Download
                      </a>
                    ) : (
                      <a
                        href="/#cta"
                        className="mt-6 block w-full text-center border border-accent/60 px-6 py-3 font-accent text-xs uppercase tracking-[0.15em] text-accent transition-all duration-200 hover:bg-accent hover:text-white hover:border-accent"
                      >
                        Join waitlist
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          </div>
        </div>
      </section>

      {/* ── Section 3: Step 2 — Add intelligence ────────────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionHeader label="Step 2" size="small">
              Add intelligence
            </SectionHeader>
          </Reveal>

          <div className="bg-black/10 backdrop-blur-xl">
          <Reveal delay={100}>
            <div className="border-y border-white/[0.06]">
              <PanelBar label="nous::intelligence" meta="BYOK + Managed" />

              <div className="px-6 md:px-10 py-6 md:py-8 border-b border-white/[0.06]">
                <BodyText>
                  Bring your own keys for free, or subscribe for managed access to frontier models.
                </BodyText>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
                {INTEL_TIERS.map((tier) => (
                  <div
                    key={tier.name}
                    className={`relative p-6 flex flex-col ${
                      tier.highlighted ? "bg-white/[0.02]" : ""
                    }`}
                  >
                    {tier.highlighted && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 terminal-text text-label uppercase tracking-[0.15em] bg-accent text-black px-1.5 py-0.5 whitespace-nowrap">
                        best value
                      </span>
                    )}

                    <CardTitle>{tier.name}</CardTitle>
                    <p className="terminal-text text-xs t-card-desc mt-1">
                      {tier.tagline}
                    </p>

                    <div className="mt-5 mb-1">
                      <span className="font-mono text-4xl font-semibold t-hero-head">
                        ${tier.isByok ? 0 : billing === "annual" ? tier.annual : tier.monthly}
                      </span>
                      {!tier.isByok && (
                        <span className="terminal-text text-sm t-meta">/mo</span>
                      )}
                    </div>

                    {tier.isByok ? (
                      <div className="mb-4">
                        <p className="terminal-text text-xs text-emerald-400">
                          Free with every seat
                        </p>
                        <span className="terminal-text text-label t-meta">
                          {tier.valueMultiplier}
                        </span>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <p className="terminal-text text-xs t-card-desc">
                          {tier.creditPool}
                        </p>
                        {tier.valueMultiplier && (
                          <span className={`terminal-text text-label ${
                            tier.valueMultiplier === "1.00x" ? "t-meta" : "text-emerald-400"
                          }`}>
                            {tier.valueMultiplier}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="space-y-1.5 flex-1">
                      {tier.features.map((f) => (
                        <p key={f} className="terminal-text text-xs t-card-desc">
                          {f}
                        </p>
                      ))}
                    </div>

                    {tier.isByok ? (
                      <span className="mt-6 block w-full text-center border border-white/[0.06] px-6 py-3 font-accent text-xs uppercase tracking-[0.15em] t-meta cursor-default">
                        Included
                      </span>
                    ) : (
                      <a
                        href="/#cta"
                        className="mt-6 block w-full text-center border border-accent/60 px-6 py-3 font-accent text-xs uppercase tracking-[0.15em] text-accent transition-all duration-200 hover:bg-accent hover:text-white hover:border-accent"
                      >
                        Join waitlist
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="px-6 md:px-10 py-4 border-t border-white/[0.06]">
                <p className="terminal-text text-caption t-meta">
                  Need more? Enable overage at the same rates — no penalty, no surprises. You control the cap.
                </p>
              </div>
            </div>
          </Reveal>
          </div>
        </div>
      </section>

      {/* ── Section 4: Routing strategies ────────────────────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionHeader center size="small">
              You control how your credits are spent
            </SectionHeader>
          </Reveal>

          <div className="bg-black/10 backdrop-blur-xl">
          <Reveal delay={100}>
            <div className="border-y border-white/[0.06]">
              <PanelBar label="nous::routing" meta="5 Strategies" />

              <div className="px-6 md:px-10 py-6 md:py-8 border-b border-white/[0.06]">
                <BodyText>
                  Choose a routing strategy per agent, per task, or globally. Switch any time.
                </BodyText>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
                {ROUTING_ROW1.map((s) => (
                  <RoutingCell key={s.name} strategy={s} />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.06] border-t border-white/[0.06]">
                {ROUTING_ROW2.map((s) => (
                  <RoutingCell key={s.name} strategy={s} />
                ))}
              </div>
            </div>
          </Reveal>
          </div>
        </div>
      </section>

      {/* ── Section 5: Enterprise ────────────────────────────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionHeader label="Custom deployments" center size="small">
              Enterprise
            </SectionHeader>
          </Reveal>

          <div className="bg-black/10 backdrop-blur-xl">
          <Reveal delay={100}>
            <div className="border-y border-white/[0.06]">
              <PanelBar label="nous::enterprise" meta="Custom" />

              <div className="px-6 md:px-10 py-10 md:py-14 text-center">
                <BodyText className="max-w-2xl mx-auto">
                  Dedicated infrastructure and GPUs for data sovereignty, SLA, SSO, RBAC, and compliance.
                  Custom pricing for your requirements.
                </BodyText>
                <a
                  href="mailto:hello@orthg.nl"
                  className="mt-8 inline-block border border-accent/60 px-8 py-3 font-accent text-xs uppercase tracking-[0.15em] text-accent transition-all duration-200 hover:bg-accent hover:text-white hover:border-accent"
                >
                  Contact us
                </a>
              </div>
            </div>
          </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
