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
  // type Bubble,
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
  pixelZoom: number;
  pixelZoomOverride: number | null;
  setPixelZoomOverride: (v: number | null) => void;
  densityZoom: number;
  densityZoomOverride: number | null;
  setDensityZoomOverride: (v: number | null) => void;
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

  // Scroll-based effects across 3 zones
  const scrollAttenuationRef = useRef(1);
  const densityScaleRef = useRef(1);
  const [pixelScale, setPixelScale] = useState(1);
  const [densityScale, setDensityScale] = useState(1);

  const pixelZoomOverrideRef = useRef<number | null>(null);
  const densityZoomOverrideRef = useRef<number | null>(null);
  const [pixelZoomOverride, setPixelZoomOverrideState] = useState<number | null>(null);
  const [densityZoomOverride, setDensityZoomOverrideState] = useState<number | null>(null);

  function setPixelZoomOverride(v: number | null) {
    pixelZoomOverrideRef.current = v;
    setPixelZoomOverrideState(v);
  }
  function setDensityZoomOverride(v: number | null) {
    densityZoomOverrideRef.current = v;
    setDensityZoomOverrideState(v);
    if (v !== null) densityScaleRef.current = v;
  }

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - vh;

      // Zone 1: first 100vh — fade grain alpha, slight CSS zoom
      const tTop = Math.min(scrollY / vh, 1);
      scrollAttenuationRef.current = 1 - tTop * 0.75;
      let newPixelScale = 1 + tTop;
      let newDensityScale = 1;

      // Zone 3: last 100vh — fade back in, shrink density map
      const bottomStart = maxScroll - vh;
      if (scrollY > bottomStart && maxScroll > vh) {
        const tBottom = 1 - (scrollY - bottomStart) / vh;
        scrollAttenuationRef.current = 1.25 - tBottom * 1.0;
        newPixelScale = 1 + tBottom;
        newDensityScale = 0.47 + tBottom * 0.53;
      }

      if (pixelZoomOverrideRef.current === null) setPixelScale(newPixelScale);
      if (densityZoomOverrideRef.current === null) {
        densityScaleRef.current = newDensityScale;
        setDensityScale(newDensityScale);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // TODO: Click bubbles — fractal neural tendrils that push pops away from click point
  // const bubblesRef = useRef<Bubble[]>([]);
  // useEffect(() => {
  //   function onClick(e: MouseEvent) {
  //     const x = e.clientX * GRAIN.scale;
  //     const y = e.clientY * GRAIN.scale;
  //     const count = 5 + Math.floor(Math.random() * 4);
  //     const tendrils: number[] = [];
  //     for (let i = 0; i < count; i++) {
  //       tendrils.push(Math.random() * Math.PI * 2);
  //     }
  //     bubblesRef.current.push({ x, y, time: Date.now(), tendrils, seed: Math.random() * 1000 });
  //   }
  //   window.addEventListener("click", onClick);
  //   return () => window.removeEventListener("click", onClick);
  // }, []);

  useGrain(grainRef, overridesRef, displayRef, scrollAttenuationRef, densityScaleRef);

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
    <GrainContext.Provider value={{ displayParams, activeOverrides, elapsed, handleKnob, showTuner, setShowTuner, grainEnabled, setGrainEnabled, pixelZoom: pixelZoomOverride ?? pixelScale, pixelZoomOverride, setPixelZoomOverride, densityZoom: densityZoomOverride ?? densityScale, densityZoomOverride, setDensityZoomOverride }}>
      {grainEnabled && (
        <>
          {/* Animated grain canvas */}
          <canvas
            ref={grainRef}
            className="pointer-events-none fixed inset-0 z-1 h-full w-full"
            style={{
              imageRendering: "pixelated",
              transform: `scale(${pixelZoomOverride ?? pixelScale})`,
              willChange: "transform",
            }}
          />
        </>
      )}

      {children}
    </GrainContext.Provider>
  );
}
