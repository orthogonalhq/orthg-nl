import { GlitchLogo } from "./glitch-logo";

export function Header() {
  return (
    <header className="terminal-text absolute top-0 left-0 right-0 z-40 flex items-center border-b border-white/[0.06] animate-fade-in-up">
      <div className="overflow-hidden border-r border-white/6 px-5 py-3">
        <a href="/">
          <GlitchLogo />
        </a>
      </div>
      <span className="ml-auto px-5 py-3 text-[11px] uppercase tracking-[0.2em] t-ghost">
        orthg.nl
      </span>
    </header>
  );
}
