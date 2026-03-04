import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investor Relations - Orthogonal",
  description: "Orthogonal public investor deck.",
};

export default function InvestorsPage() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-card-border">
        <div className="flex items-center gap-3">
          <span className="font-brand text-2xl font-semibold tracking-[-0.05em]">
            O°
          </span>
          <span className="font-brand text-xl font-semibold tracking-[-0.05em]">
            Orthogonal
          </span>
        </div>
        <a
          href="mailto:ir@orthg.nl"
          className="font-accent text-sm text-muted hover:text-foreground transition-colors"
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
        <div className="w-full max-w-5xl aspect-video rounded-lg border border-card-border overflow-hidden bg-card">
          <iframe
            src="https://embed.figma.com/deck/XS1OEmG8kUKJNb5bz7PJfR?node-id=1-382&node-type=slide&viewport-fit=fill&scaling=min-zoom&content-scaling=responsive&page-id=0%3A1"
            className="h-full w-full"
            title="Orthogonal Public Investor Deck"
            allowFullScreen
          />
        </div>

        {/* Contact */}
        <div className="text-center">
          <p className="text-muted text-sm mb-1">For inquiries, contact</p>
          <a
            href="mailto:ir@orthg.nl"
            className="font-accent text-accent hover:underline"
          >
            ir@orthg.nl
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-center py-6 border-t border-card-border">
        <p className="font-accent text-sm text-muted tracking-wide">
          Sovereign AI for everyone.
        </p>
      </footer>
    </div>
  );
}
