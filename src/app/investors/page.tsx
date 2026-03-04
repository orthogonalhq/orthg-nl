import type { Metadata } from "next";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Investor Relations - Orthogonal",
  description: "Orthogonal public investor deck.",
};

export default function InvestorsPage() {
  return (
    <div className="scanlines phosphor flex min-h-svh flex-col bg-black">
      {/* Header bar */}
      <header className="terminal-text flex items-center border-b border-white/[0.06]">
        <div className="border-r border-white/[0.06] px-5 py-3">
          <Logo />
        </div>
        <a
          href="mailto:ir@orthg.nl"
          className="ml-auto px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-white/25 transition-colors hover:text-accent"
        >
          ir@orthg.nl
        </a>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center px-6 py-12 gap-8">
        <h1 className="font-mono text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">
          Investor Relations.
        </h1>

        {/* Figma deck embed */}
        <div className="relative w-full max-w-5xl aspect-video border border-white/[0.06] overflow-hidden bg-black">
          {/* Corner brackets */}
          <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-white/20 z-10" />
          <div className="absolute -top-px -right-px w-3 h-3 border-t border-r border-white/20 z-10" />
          <div className="absolute -bottom-px -left-px w-3 h-3 border-b border-l border-white/20 z-10" />
          <div className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-white/20 z-10" />
          <iframe
            src="https://embed.figma.com/deck/XS1OEmG8kUKJNb5bz7PJfR/Orthogonal-Public-Pitch-Deck?node-id=1-306&viewport=-171%2C-223%2C1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share"
            className="h-full w-full"
            title="Orthogonal Public Pitch Deck"
            allowFullScreen
          />
        </div>

        {/* Contact */}
        <div className="text-center">
          <p className="text-[14px] tracking-[0.05em] text-white/25 mb-1">
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

      {/* Footer bar */}
      <footer className="terminal-text flex items-center border-t border-white/[0.06]">
        <span className="font-brand border-r border-white/[0.06] px-5 py-3 text-sm font-semibold tracking-[-0.05em] text-white/30">
          O°
        </span>
        <a
          href="/"
          className="border-r border-white/[0.06] px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-white/25 transition-colors hover:text-accent"
        >
          Home
        </a>
        <span className="ml-auto px-5 py-3 font-accent text-[11px] font-medium text-white/15">
          Sovereign AI for everyone.
        </span>
      </footer>
    </div>
  );
}
