"use client";

export default function Home() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center px-6">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(204, 51, 51, 0.07) 0%, transparent 70%)",
        }}
      />

      {/* Logomark */}
      <header className="absolute top-8 left-8">
        <span className="font-brand text-2xl font-semibold tracking-[-0.05em]">
          O°
        </span>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex max-w-2xl flex-col items-center text-center gap-8">
        <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-none">
          Something is coming.
        </h1>

        <p className="text-lg sm:text-xl text-muted max-w-md leading-relaxed">
          We&apos;re building the operating system for AI. Stay in the loop.
        </p>

        <form
          className="flex w-full max-w-md gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="your@email.com"
            required
            className="flex-1 rounded-lg border border-card-border bg-card px-4 py-3 text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent/80"
          >
            Join
          </button>
        </form>
      </main>

      {/* Tagline */}
      <footer className="absolute bottom-8">
        <p className="font-accent text-sm text-muted tracking-wide">
          Sovereign AI for everyone.
        </p>
      </footer>
    </div>
  );
}
