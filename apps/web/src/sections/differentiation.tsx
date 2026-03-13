import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { BodyText } from "@/components/body-text";

export function Differentiation() {
  return (
    <section id="differentiation" className="relative px-6 md:px-12 lg:px-20 py-28 md:py-40">
      <div className="mx-auto max-w-4xl text-center px-4 lg:px-0">
        <Reveal>
          <SectionHeader label="Differentiation" center size="large">
            They built the neurons.
            <br />
            <span className="t-heading-dim">We&apos;re building the brain.</span>
          </SectionHeader>
        </Reveal>

        <Reveal delay={100}>
          <BodyText className="mb-16 max-w-2xl mx-auto">
            The trillion-dollar investment in foundation models created the most capable AI
            components in history. Open source delivers 95%+ of frontier capability. The next
            level of intelligence isn&apos;t a bigger model&nbsp;&mdash; it&apos;s a cognitive architecture
            that composes them into minds.
          </BodyText>
        </Reveal>

        <Reveal delay={200}>
          <div className="border border-white/[0.06] pt-6 pb-6 px-8 max-w-lg mx-auto">
            <p className="terminal-text text-[10px] t-ghost uppercase tracking-[0.2em] mb-4">
              <span className="terminal-prefix">&gt;</span>signal intercept
            </p>
            <p className="font-mono text-base sm:text-lg t-nav italic leading-relaxed">
              &ldquo;We&apos;re going to see the first one-person billion-dollar company pretty soon.&rdquo;
            </p>
            <p className="terminal-text text-xs t-ghost mt-4 flex items-center gap-2">
              <span className="t-faint">src:</span> Sam Altman
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
