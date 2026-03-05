"use client";

import { EmailCapture } from "@/components/email-capture";
import { SectionLabel } from "@/components/section-label";
import { SectionHeading } from "@/components/section-heading";
import { BodyText } from "@/components/body-text";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center"
    >
      <div className="flex flex-col items-center gap-4 md:gap-6">
        {/* Accent label */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <SectionLabel>Now in development</SectionLabel>
        </div>

        {/* Hero heading */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <SectionHeading as="h1" size="hero" className="phosphor-pulse">Nous</SectionHeading>
          <p className="terminal-text text-[11px] uppercase tracking-[0.25em] t-sub-label mt-2">
           A Neural Orchestration Unification System
          </p>
          <BodyText className="max-w-lg text-xl text-accent mt-4">
            Open Source. Free. Forever.
          </BodyText>
        </div>

        {/* Body */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
          <BodyText className="max-w-lg text-xl">
            An autonomous AI agent that knows you, works for you, and belongs entirely to you.
          </BodyText>
          
        </div>

        {/* Email capture */}
        <div
          className="z-30 mt-2 flex w-full flex-col items-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          <EmailCapture />
        </div>

        {/* Terminal status line */}
        <div
          className="mt-6 md:mt-10 terminal-text text-[11px] t-ghost flex items-center gap-3 animate-fade-in-up"
          style={{ animationDelay: "0.7s" }}
        >
          <span className="text-green-400/30">●</span>
          <span>systems nominal</span>
          <span className="t-faint">│</span>
          <span>v0.1.0-alpha</span>
          <span className="t-faint">│</span>
          <span>local-first</span>
        </div>
      </div>
    </section>
  );
}
