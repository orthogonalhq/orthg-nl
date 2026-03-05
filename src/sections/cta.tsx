"use client";

import { EmailCapture } from "@/components/email-capture";
import { SectionLabel } from "@/components/section-label";
import { SectionHeading } from "@/components/section-heading";
import { BodyText } from "@/components/body-text";

export function CTA() {
  return (
    <section
      id="cta"
      className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center pb-24"
    >
      <div className="flex flex-col items-center gap-6">
        <SectionLabel>Get started</SectionLabel>
        <SectionHeading size="large">
          Your agent is waiting.
        </SectionHeading>
        <BodyText>
          Open source. Autonomous. Yours.
          <br className="hidden sm:block" />
          Join the waitlist for early access.
        </BodyText>

        <div className="mt-4 z-30">
          <EmailCapture buttonText="Join the waitlist" />
        </div>

        {/* Terminal prompt */}
        <p className="terminal-text text-[11px] t-ghost mt-6">
          <span className="terminal-prefix">$</span> nous init --sovereign <span className="cursor-blink">&#9608;</span>
        </p>

        {/* Secondary links */}
        <div className="flex items-center gap-8 mt-4">
          <a
            href="/investors"
            className="terminal-text text-xs uppercase tracking-[0.2em] t-nav transition-colors hover:text-accent"
          >
            Invest →
          </a>
        </div>
      </div>
    </section>
  );
}
