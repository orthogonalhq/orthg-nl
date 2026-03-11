"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type GrainParams,
  type Overrides,
  GRAIN,
  useGrain,
} from "@/hooks/use-grain";

interface GrainContextValue {
  grainEnabled: boolean;
  setGrainEnabled: (v: boolean) => void;
  handleKnob: (key: keyof GrainParams, value: number) => void;
  lockZone2: boolean;
  setLockZone2: (v: boolean) => void;
}

const GrainContext = createContext<GrainContextValue | null>(null);

export function useGrainContext() {
  const ctx = useContext(GrainContext);
  if (!ctx) throw new Error("useGrainContext must be used within GrainProvider");
  return ctx;
}

export function GrainProvider({ children }: { children: React.ReactNode }) {
  const grainRef = useRef<HTMLCanvasElement>(null);
  const overridesRef = useRef<Overrides>({});
  const displayRef = useRef<GrainParams>(GRAIN.lo);
  const [grainEnabled, setGrainEnabled] = useState(true);
  const [lockZone2, setLockZone2] = useState(false);
  const lockZone2Ref = useRef(false);

  // Scroll-based effects across 3 zones
  const scrollAttenuationRef = useRef(1);
  const densityScaleRef = useRef(1);
  const [pixelScale, setPixelScale] = useState(1);

  // Zone2 exit transition state
  const TRANSITION_MS = 600;
  const transitionRef = useRef({ active: false, start: 0, fromAtt: 0.25, fromScale: 2, fromDensity: 1 });
  const transitionRafRef = useRef(0);

  // Compute target values for current scroll position (zone1/zone3 logic)
  // Zone3 anchors to <main> bottom, not page bottom, so the footer doesn't shift it
  function getScrollTargets() {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const footer = document.querySelector("footer");
    const footerH = footer ? footer.offsetHeight : 0;
    const contentBottom = document.documentElement.scrollHeight - footerH;
    const maxScroll = contentBottom - vh;
    const tTop = Math.min(scrollY / vh, 1);
    let att = 1 - tTop * 0.75;
    let scale = 1 + tTop;
    let density = 1;
    const bottomStart = maxScroll - vh;
    if (scrollY > bottomStart && maxScroll > vh) {
      const tBottom = Math.max(0, 1 - (scrollY - bottomStart) / vh);
      att = 1.25 - tBottom * 1.0;
      scale = 1 + tBottom;
      density = 0.47 + tBottom * 0.53;
    }
    return { att, scale, density };
  }

  function applyGrain(att: number, scale: number, density: number) {
    scrollAttenuationRef.current = att;
    setPixelScale(scale);
    densityScaleRef.current = density;
  }

  // Keep ref in sync and apply zone2 values eagerly
  useEffect(() => {
    const wasLocked = lockZone2Ref.current;
    lockZone2Ref.current = lockZone2;

    if (lockZone2) {
      transitionRef.current.active = false;
      cancelAnimationFrame(transitionRafRef.current);
      applyGrain(0.25, 2, 1);
    } else if (wasLocked) {
      // Start smooth transition from zone2 to scroll-based values
      transitionRef.current = { active: true, start: performance.now(), fromAtt: 0.25, fromScale: 2, fromDensity: 1 };

      function tick() {
        const tr = transitionRef.current;
        if (!tr.active) return;
        const elapsed = performance.now() - tr.start;
        const t = Math.min(elapsed / TRANSITION_MS, 1);
        const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
        const target = getScrollTargets();
        applyGrain(
          tr.fromAtt + (target.att - tr.fromAtt) * ease,
          tr.fromScale + (target.scale - tr.fromScale) * ease,
          tr.fromDensity + (target.density - tr.fromDensity) * ease,
        );
        if (t >= 1) { tr.active = false; return; }
        transitionRafRef.current = requestAnimationFrame(tick);
      }
      transitionRafRef.current = requestAnimationFrame(tick);
    }
  }, [lockZone2]);

  // Normal scroll handler (skipped during transition — rAF loop handles it)
  useEffect(() => {
    function onScroll() {
      if (lockZone2Ref.current || transitionRef.current.active) return;
      const { att, scale, density } = getScrollTargets();
      applyGrain(att, scale, density);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGrain(grainRef, overridesRef, displayRef, scrollAttenuationRef, densityScaleRef);

  const handleKnob = useCallback((key: keyof GrainParams, value: number) => {
    overridesRef.current[key] = { value, expires: Date.now() + GRAIN.overrideHoldMs };
  }, []);

  return (
    <GrainContext.Provider value={{ grainEnabled, setGrainEnabled, handleKnob, lockZone2, setLockZone2 }}>
      {/* Animated grain canvas */}
      {grainEnabled && <canvas
        ref={grainRef}
        className="pointer-events-none fixed inset-0 z-1 h-full w-full"
        style={{
          imageRendering: "pixelated",
          transform: `scale(${pixelScale})`,
          willChange: "transform",
        }}
      />}

      {children}
    </GrainContext.Provider>
  );
}
