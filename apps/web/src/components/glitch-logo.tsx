"use client";

import { useCallback, useEffect, useRef } from "react";

const SLICE_COUNT = 12;

const OFFSETS = [-72, -48, -32, -18, -10, -4, 0, 0, 0, 4, 10, 18, 32, 48, 72];
const SCALES = [0.25, 0.4, 0.6, 1, 1, 1, 1, 1, 1.4, 1.8];
const RGB_OFFSETS = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
const RGB_DRIFT = [-1, -1, 0, 0, 0, 1, 1]; // subtle glow-phase drift

const GLITCH_DURATION = 600; // ms — slices settle to minimum by this point
const GLITCH_MIN = 0.20; // settled glitch intensity (glow phase)
const RGB_SETTLED_OPACITY = 0.28;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function LogoInner() {
  return (
    <div className="flex items-center gap-3">
      <span className="font-brand text-2xl font-semibold tracking-[-0.05em]">O°</span>
      <span className="font-brand text-xl font-semibold tracking-[-0.05em]">Orthogonal</span>
    </div>
  );
}

export function GlitchLogo() {
  const baseRef = useRef<HTMLDivElement>(null);
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const redRef = useRef<HTMLDivElement>(null);
  const cyanRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const hovering = useRef(false);
  const hoverStartRef = useRef(0);
  const lastTickRef = useRef(0);
  const state = useRef(
    Array.from({ length: SLICE_COUNT }, () => ({ tx: 0, sx: 1 }))
  );

  const tick = useCallback((now: number) => {
    if (!hovering.current) return;
    frameRef.current = requestAnimationFrame(tick);

    const elapsed = now - hoverStartRef.current;
    // Glitch intensity: 1.0 → GLITCH_MIN over GLITCH_DURATION ms, then holds
    const glitchIntensity = Math.max(GLITCH_MIN, 1 - (elapsed / GLITCH_DURATION) * (1 - GLITCH_MIN));
    const inGlitchPhase = elapsed < GLITCH_DURATION;

    // Run at ~14fps during glitch, ~5fps during glow
    const tickInterval = inGlitchPhase ? 70 : 200;
    if (now - lastTickRef.current < tickInterval) return;
    lastTickRef.current = now;

    // --- Slices (always active, intensity settles to GLITCH_MIN) ---
    for (let i = 0; i < SLICE_COUNT; i++) {
      if (Math.random() < 0.65 * glitchIntensity + 0.1) {
        state.current[i].tx = pick(OFFSETS) * glitchIntensity;
        state.current[i].sx = Math.random() < 0.18 * glitchIntensity ? pick(SCALES) : 1;
      }
      const el = sliceRefs.current[i];
      if (el) {
        const { tx, sx } = state.current[i];
        el.style.transform = `translateX(${tx}px) scaleX(${sx})`;
        el.style.opacity = String(glitchIntensity);
      }
    }
    if (baseRef.current) baseRef.current.style.opacity = String(1 - glitchIntensity * 0.3);

    // --- RGB layers ---
    // During glitch: large jitter + high opacity. During glow: tiny drift + settled opacity.
    if (redRef.current) {
      const tx = inGlitchPhase
        ? pick(RGB_OFFSETS) * glitchIntensity - 2
        : pick(RGB_DRIFT) - 1;
      const opacity = inGlitchPhase
        ? 0.3 + glitchIntensity * 0.55
        : RGB_SETTLED_OPACITY;
      redRef.current.style.transform = `translateX(${tx}px)`;
      redRef.current.style.opacity = String(opacity);
    }
    if (cyanRef.current) {
      const tx = inGlitchPhase
        ? pick(RGB_OFFSETS) * glitchIntensity + 2
        : pick(RGB_DRIFT) + 1;
      const opacity = inGlitchPhase
        ? 0.3 + glitchIntensity * 0.55
        : RGB_SETTLED_OPACITY;
      cyanRef.current.style.transform = `translateX(${tx}px)`;
      cyanRef.current.style.opacity = String(opacity);
    }
  }, []);

  const start = useCallback(() => {
    hovering.current = true;
    hoverStartRef.current = performance.now();
    lastTickRef.current = 0;
    frameRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    hovering.current = false;
    cancelAnimationFrame(frameRef.current);

    for (let i = 0; i < SLICE_COUNT; i++) {
      const el = sliceRefs.current[i];
      if (el) {
        el.style.transform = "translateX(0) scaleX(1)";
        el.style.opacity = "0";
      }
    }
    if (redRef.current) { redRef.current.style.opacity = "0"; redRef.current.style.transform = "translateX(0)"; }
    if (cyanRef.current) { cyanRef.current.style.opacity = "0"; cyanRef.current.style.transform = "translateX(0)"; }
    if (baseRef.current) baseRef.current.style.opacity = "1";
  }, []);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={start}
      onMouseLeave={stop}
    >
      <div ref={baseRef}>
        <LogoInner />
      </div>

      {/* RGB chromatic aberration — red ghost */}
      <div
        ref={redRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0, mixBlendMode: "screen", color: "rgb(255 80 80)", willChange: "transform" }}
      >
        <LogoInner />
      </div>

      {/* RGB chromatic aberration — cyan ghost */}
      <div
        ref={cyanRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0, mixBlendMode: "screen", color: "rgb(0 220 255)", willChange: "transform" }}
      >
        <LogoInner />
      </div>

      {/* Slice layers */}
      {Array.from({ length: SLICE_COUNT }, (_, i) => {
        const top = (i / SLICE_COUNT) * 100;
        const bottom = ((SLICE_COUNT - i - 1) / SLICE_COUNT) * 100;
        return (
          <div
            key={i}
            ref={el => { sliceRefs.current[i] = el; }}
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: `inset(${top}% 0 ${bottom}% 0)`,
              opacity: 0,
              willChange: "transform",
              transformOrigin: "left center",
            }}
          >
            <LogoInner />
          </div>
        );
      })}
    </div>
  );
}
