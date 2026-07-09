import Link from "next/link";
import { BodyText } from "@/components/body-text";
import { CardTitle } from "@/components/card-title";
import { RecentPosts } from "@/sections/recent-posts";
import { Footer } from "@/components/footer";

const PLATFORMS = [
  {
    label: "Nue",
    href: "https://nue.orthg.nl",
    meta: "flagship product",
    body: "A privacy-first personal agent OS that turns everyday requests into private routines with memory, tools, approvals, and history.",
  },
  {
    label: "APM",
    href: "https://apm.orthg.nl",
    meta: "agent packages",
    body: "An open registry for agent skills and reusable capabilities across the emerging agent ecosystem.",
  },
  {
    label: "Research",
    href: "/research",
    meta: "papers and systems",
    body: "Technical and philosophical work behind Orthogonal's approach to sovereign intelligence, governance, and cognitive architecture.",
  },
];

const PRINCIPLES = [
  {
    label: "Sovereignty",
    body: "Intelligence should serve the person or organization that controls it, not the platform that hosts it.",
  },
  {
    label: "Stewardship",
    body: "Powerful systems need values, accountability, and clear boundaries before they need scale.",
  },
  {
    label: "Open Work",
    body: "The durable pieces of agent infrastructure should be inspectable, extensible, and shared where sharing compounds value.",
  },
];

function ExternalArrow() {
  return <span aria-hidden="true">-&gt;</span>;
}

export default function Home() {
  return (
    <div className="scanlines phosphor relative z-10 min-h-svh">
      <main className="mx-auto max-w-5xl px-6 md:px-12 lg:px-20 pt-36 pb-20">
        <section className="min-h-[72vh] flex flex-col justify-center py-20">
          <p className="terminal-text text-label uppercase tracking-[0.25em] t-meta mb-6">
            Orthogonal Research
          </p>
          <h1 className="font-mono text-5xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.03em] leading-none t-hero-head">
            Sovereign AI
            <br />
            infrastructure.
          </h1>
          <BodyText className="mt-8 max-w-2xl text-lg">
            Orthogonal builds open, privacy-first systems for personal agents,
            agent tooling, and the governance layer conscious intelligence will
            need as it becomes more capable.
          </BodyText>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="https://nue.orthg.nl"
              className="border border-accent/60 px-6 py-3 font-accent text-xs uppercase tracking-[0.15em] text-accent transition-all duration-200 hover:bg-accent hover:text-white hover:border-accent"
            >
              Explore Nue <ExternalArrow />
            </a>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mb-8 pr-4">
            <p className="terminal-text text-label uppercase tracking-[0.2em] t-meta mb-5">
              <span className="bg-accent text-black font-normal px-0.5">&gt;</span>
              <span className="ml-1.5">Ecosystem</span>
            </p>
            <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-tight t-section-head">
              Products, infrastructure,
              <br />
              and research under one roof.
            </h2>
          </div>

          <div className="border-y border-white/[0.06] bg-black/10 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
              {PLATFORMS.map((item) => {
                const external = item.href.startsWith("http");
                const content = (
                  <div className="p-6 md:p-8 h-full transition-colors hover:bg-white/[0.02]">
                    <span className="terminal-text text-label uppercase tracking-[0.2em] t-sub-label">
                      {item.meta}
                    </span>
                    <CardTitle className="mt-3 mb-3 text-base">
                      {item.label} {external && <ExternalArrow />}
                    </CardTitle>
                    <BodyText>{item.body}</BodyText>
                  </div>
                );

                return external ? (
                  <a key={item.label} href={item.href} className="block" target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                ) : (
                  <Link key={item.label} href={item.href} className="block">
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mb-8 pr-4">
            <p className="terminal-text text-label uppercase tracking-[0.2em] t-meta mb-5">
              <span className="bg-accent text-black font-normal px-0.5">&gt;</span>
              <span className="ml-1.5">Principles</span>
            </p>
            <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-tight t-section-head">
              Company-level convictions.
              <br />
              Product-level discipline.
            </h2>
          </div>

          <div className="border-y border-white/[0.06] bg-black/10 backdrop-blur-xl divide-y divide-white/[0.06]">
            {PRINCIPLES.map((principle, index) => (
              <div key={principle.label} className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
                <div className="px-6 md:px-8 py-5 md:border-r border-white/[0.06]">
                  <span className="terminal-text text-label t-faint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <CardTitle className="mt-2">{principle.label}</CardTitle>
                </div>
                <div className="px-6 md:px-10 py-5">
                  <BodyText>{principle.body}</BodyText>
                </div>
              </div>
            ))}
          </div>
        </section>

        <RecentPosts />

        <section className="py-20 md:py-28 text-center">
          <p className="terminal-text text-label uppercase tracking-[0.25em] t-meta mb-5">
            Flagship product
          </p>
          <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-tight t-section-head">
            Looking for the agent OS?
          </h2>
          <BodyText className="mt-5 max-w-xl mx-auto">
            Start with chat. Build private routines. Run agents with memory,
            tools, approvals, and history under your control.
          </BodyText>
          <a
            href="https://nue.orthg.nl"
            className="mt-8 inline-block border border-accent/60 px-8 py-3 font-accent text-xs uppercase tracking-[0.15em] text-accent transition-all duration-200 hover:bg-accent hover:text-white hover:border-accent"
          >
            Go to Nue <ExternalArrow />
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
