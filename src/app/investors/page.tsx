import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Investor Relations - Orthogonal",
  description: "Orthogonal public investor deck.",
};

export default function InvestorsPage() {
  return (
    <div className="relative z-10 flex min-h-svh flex-col">
      <Header />
      {/* Main content */}
      <main className="flex flex-1 flex-col items-center px-6 pt-20 pb-12 gap-8">
        <h1 className="font-mono text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">
          Investor Relations.
        </h1>

        {/* Figma deck embed */}
        <div className="relative w-full max-w-5xl aspect-video border border-white/[0.06] overflow-hidden bg-black rounded-lg">
          <iframe
            src="https://embed.figma.com/deck/XS1OEmG8kUKJNb5bz7PJfR/Orthogonal-Public-Pitch-Deck?node-id=1-306&viewport=-171%2C-223%2C1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share"
            className="h-full w-full"
            title="Orthogonal Public Pitch Deck"
            allowFullScreen
          />
        </div>

        {/* Contact */}
        <div className="text-center">
          <p className="text-[14px] tracking-[0.05em] t-nav mb-1">
            For inquiries, contact
          </p>
          <a
            href="mailto:ir@orthg.nl"
            className="text-accent text-sm hover:underline terminal-text"
          >
            ir@orthg.nl
          </a>
        </div>
      </main>
      <Footer>
        <a
          href="/"
          className="cursor-pointer border-r border-white/[0.06] px-5 py-3 text-[11px] uppercase tracking-[0.2em] t-nav transition-colors hover:text-accent"
        >
          Home
        </a>
      </Footer>
    </div>
  );
}
