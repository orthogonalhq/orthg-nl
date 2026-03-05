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
  GRAIN_KEYS,
  useGrain,
} from "@/hooks/use-grain";

interface GrainContextValue {
  displayParams: GrainParams;
  activeOverrides: Record<string, boolean>;
  elapsed: string;
  handleKnob: (key: keyof GrainParams, value: number) => void;
  showTuner: boolean;
  setShowTuner: (v: boolean | ((prev: boolean) => boolean)) => void;
  grainEnabled: boolean;
  setGrainEnabled: (v: boolean) => void;
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
  const [displayParams, setDisplayParams] = useState<GrainParams>(GRAIN.lo);
  const [activeOverrides, setActiveOverrides] = useState<Record<string, boolean>>({});
  const [elapsed, setElapsed] = useState("00000");
  const [showTuner, setShowTuner] = useState(false);
  const [grainEnabled, setGrainEnabled] = useState(true);

  // Scroll-based effects: attenuation + pixel zoom
  const scrollAttenuationRef = useRef(1);
  const [pixelScale, setPixelScale] = useState(1);
  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const t = Math.min(scrollY / vh, 1); // 0 at top, 1 at 100vh, clamped
      // popAlphaMax: linear ramp from 1.0 to 0.25
      scrollAttenuationRef.current = 1 - t * 0.75;
      // Pixel scale: 1x at top, 2x at 100vh
      setPixelScale(1 + t);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGrain(grainRef, overridesRef, displayRef, scrollAttenuationRef);

  // Sync display params from the grain loop at ~20fps
  useEffect(() => {
    const id = setInterval(() => {
      setDisplayParams({ ...displayRef.current });
      const now = Date.now();
      const ov: Record<string, boolean> = {};
      for (const key of GRAIN_KEYS) {
        const entry = overridesRef.current[key];
        ov[key] = !!entry && now < entry.expires;
      }
      setActiveOverrides(ov);
      setElapsed(Math.floor(now / 1000 % 86400).toString().padStart(5, "0"));
    }, 50);
    return () => clearInterval(id);
  }, []);

  const handleKnob = useCallback((key: keyof GrainParams, value: number) => {
    overridesRef.current[key] = { value, expires: Date.now() + GRAIN.overrideHoldMs };
  }, []);

  return (
    <GrainContext.Provider value={{ displayParams, activeOverrides, elapsed, handleKnob, showTuner, setShowTuner, grainEnabled, setGrainEnabled }}>
      {grainEnabled && (
        <>
          {/* Vignette — top & bottom */}
          <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-[20vh] bg-linear-to-b from-black/60 to-transparent" />
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[20vh] bg-linear-to-t from-black/60 to-transparent" />

          {/* Animated grain canvas */}
          <canvas
            ref={grainRef}
            className="pointer-events-none fixed inset-0 z-20 h-full w-full"
            style={{
              imageRendering: "pixelated",
              transform: `scale(${pixelScale})`,
              willChange: "transform",
            }}
          />
        </>
      )}

      {children}
    </GrainContext.Provider>
  );
}
