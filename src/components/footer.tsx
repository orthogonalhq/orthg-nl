"use client";

import { GrainTuner } from "./grain-tuner";
import { useGrainContext } from "./grain-overlay";

interface FooterProps {
  children?: React.ReactNode;
}

export function Footer({ children }: FooterProps) {
  const { showTuner, setShowTuner } = useGrainContext();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Grain tuner — docked above footer */}
      <GrainTuner />

      {/* Footer bar */}
      <footer className="terminal-text flex items-center border-t border-white/[0.06] bg-[#0a0a0a]">
        <span className="font-brand border-r border-white/[0.06] px-5 py-3 text-sm font-semibold tracking-[-0.05em] text-white/30">
          O°
        </span>
        {children ?? (
          <>
            <a
              href="/investors"
              className="cursor-pointer border-r border-white/[0.06] px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-white/25 transition-colors hover:text-accent"
            >
              Investors
            </a>
            <button
              data-tuner-toggle
              onClick={() => setShowTuner((v: boolean) => !v)}
              className="cursor-pointer border-r border-white/[0.06] px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-white/25 transition-colors hover:text-accent"
            >
              {showTuner ? "Hide tuner" : "Tuner"}
            </button>
          </>
        )}
        <span className="ml-auto px-5 py-3 font-accent text-[11px] font-medium text-white/15">
          Sovereign AI for everyone.
        </span>
      </footer>
    </div>
  );
}
