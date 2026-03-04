"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Logo } from "@/components/logo";

// ─── Grain config ────────────────────────────────────────────
// Edit these to tune the grain effect

interface GrainParams {
  churnRate: number;
  basePop: number;
  maxPop: number;
  popAlphaMin: number;
  popAlphaMax: number;
  baseAlpha: number;
}

const GRAIN = {
  lo: {
    churnRate: 0.04,
    basePop: 0.0,
    maxPop: 0.3,
    popAlphaMin: 3,
    popAlphaMax: 29,
    baseAlpha: 2,
  } as GrainParams,

  hi: {
    churnRate: 1.0,
    basePop: 0.0,
    maxPop: 0.3,
    popAlphaMin: 3,
    popAlphaMax: 24,
    baseAlpha: 2,
  } as GrainParams,

  breathMs: 120000,       // duration of one full lo→hi→lo cycle
  scale: 0.5,           // canvas resolution (0.25 = quarter res)
  densityMaps: [
    { src: "/density-map-16x9.png", ar: 16 / 9 },   // landscape
    { src: "/density-map-1x1.png",  ar: 1 },         // square
    { src: "/density-map-9x16.png", ar: 9 / 16 },    // portrait
  ],
  densityMapFallback: "/density-map.png",
  overrideHoldMs: 1000,  // how long a knob override lasts after release
  releaseEaseMs: 15000,  // ease-back duration after override expires
};

const GRAIN_KEYS: (keyof GrainParams)[] = [
  "churnRate", "basePop", "maxPop", "popAlphaMin", "popAlphaMax", "baseAlpha",
];

const KNOBS: { key: keyof GrainParams; label: string; min: number; max: number; step: number }[] = [
  { key: "churnRate",   label: "Churn",     min: 0.01, max: 1,    step: 0.01   },
  { key: "basePop",     label: "Base Pop",   min: 0,    max: 0.05, step: 0.0005 },
  { key: "maxPop",      label: "Max Pop",    min: 0.001,max: 0.3,  step: 0.001  },
  { key: "popAlphaMin", label: "Pop α Min",  min: 1,    max: 60,   step: 1      },
  { key: "popAlphaMax", label: "Pop α Max",  min: 1,    max: 80,   step: 1      },
  { key: "baseAlpha",   label: "Base α",     min: 0,    max: 10,   step: 0.5    },
];

// ─── Glitch text hook ────────────────────────────────────────

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/~`";

function useGlitchText(text: string, durationMs = 600) {
  const [display, setDisplay] = useState(text);
  const prevRef = useRef(text);
  const fromLenRef = useRef(text.length);

  useEffect(() => {
    if (text === prevRef.current) return;
    const fromLen = fromLenRef.current;
    const toLen = text.length;
    prevRef.current = text;

    const steps = 14;
    const stepMs = durationMs / steps;
    let step = 0;

    const id = setInterval(() => {
      step++;
      const progress = step / steps;

      // Smoothly interpolate the visible length
      const currentLen = Math.round(fromLen + (toLen - fromLen) * progress);

      const chars = Array.from({ length: currentLen }, (_, i) => {
        const resolveAt = i / toLen;
        if (progress > resolveAt + 0.3) {
          return text[i] ?? "";
        }
        if (text[i] === " ") return " ";
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      });

      setDisplay(chars.join(""));

      if (step >= steps) {
        clearInterval(id);
        setDisplay(text);
        fromLenRef.current = toLen;
      }
    }, stepMs);

    return () => {
      clearInterval(id);
      fromLenRef.current = Math.round(fromLen + (toLen - fromLen) * (step / steps));
    };
  }, [text, durationMs]);

  return display;
}

// ─── Grain hook ──────────────────────────────────────────────

type Overrides = Record<string, { value: number; expires: number; _releaseVal?: number; _releaseTime?: number }>;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function useGrain(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  overridesRef: React.RefObject<Overrides>,
  displayRef: React.RefObject<GrainParams>,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let imageData!: ImageData;
    let data!: Uint8ClampedArray;
    let densityMap!: Float32Array;

    function resize() {
      w = Math.ceil(window.innerWidth * GRAIN.scale);
      h = Math.ceil(window.innerHeight * GRAIN.scale);
      canvas!.width = w;
      canvas!.height = h;
      imageData = ctx!.createImageData(w, h);
      data = imageData.data;
      densityMap = new Float32Array(w * h);
      loadDensitySource(); // re-evaluate best AR on resize
      buildDensityMap();
    }

    const densityImg = new Image();
    let densityLoaded = false;
    let currentSrc = "";

    function pickDensitySource() {
      const viewportAr = window.innerWidth / window.innerHeight;
      let best = GRAIN.densityMaps[0];
      let bestDist = Math.abs(Math.log(best.ar / viewportAr));
      for (const entry of GRAIN.densityMaps) {
        const dist = Math.abs(Math.log(entry.ar / viewportAr));
        if (dist < bestDist) {
          best = entry;
          bestDist = dist;
        }
      }
      return best.src;
    }

    function loadDensitySource() {
      const src = pickDensitySource();
      if (src === currentSrc) return;
      currentSrc = src;
      densityLoaded = false;
      densityImg.src = src;
    }

    function buildDensityMap() {
      if (!densityLoaded || w === 0) return;

      const offscreen = document.createElement("canvas");
      offscreen.width = w;
      offscreen.height = h;
      const offCtx = offscreen.getContext("2d")!;

      const imgAspect = densityImg.width / densityImg.height;
      const canvasAspect = w / h;
      let drawW: number, drawH: number, drawX: number, drawY: number;

      if (imgAspect > canvasAspect) {
        drawH = h;
        drawW = h * imgAspect;
        drawX = (w - drawW) / 2;
        drawY = 0;
      } else {
        drawW = w;
        drawH = w / imgAspect;
        drawX = 0;
        drawY = (h - drawH) / 2;
      }

      offCtx.drawImage(densityImg, drawX, drawY, drawW, drawH);
      const mapData = offCtx.getImageData(0, 0, w, h).data;

      for (let i = 0; i < densityMap.length; i++) {
        const r = mapData[i * 4];
        const g = mapData[i * 4 + 1];
        const b = mapData[i * 4 + 2];
        densityMap[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      }
    }

    densityImg.onload = () => {
      densityLoaded = true;
      buildDensityMap();
    };
    densityImg.onerror = () => {
      // Fallback if the AR-specific file doesn't exist yet
      if (currentSrc !== GRAIN.densityMapFallback) {
        currentSrc = GRAIN.densityMapFallback;
        densityImg.src = GRAIN.densityMapFallback;
      }
    };
    loadDensitySource();

    resize();

    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 2;
    }

    window.addEventListener("resize", resize);

    let frame: number;

    function draw(time: number) {
      frame = requestAnimationFrame(draw);

      const now = Date.now();
      const t = (Math.sin((time / GRAIN.breathMs) * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      const overrides = overridesRef.current;

      // Build effective params: sine wave with per-key overrides + ease-back
      const p = {} as GrainParams;
      for (const key of GRAIN_KEYS) {
        const ov = overrides[key];
        const sineVal = lerp(GRAIN.lo[key], GRAIN.hi[key], t);

        if (ov && now < ov.expires) {
          // Active override
          p[key] = ov.value;
          // Store release snapshot for when it expires
          ov._releaseVal = ov.value;
          ov._releaseTime = ov.expires;
        } else if (ov && ov._releaseTime && now < ov._releaseTime + GRAIN.releaseEaseMs) {
          // Easing back from override to sine
          const elapsed = now - ov._releaseTime;
          const easeT = Math.min(elapsed / GRAIN.releaseEaseMs, 1);
          // Smooth ease-out
          const smooth = 1 - (1 - easeT) * (1 - easeT);
          p[key] = lerp(ov._releaseVal!, sineVal, smooth);
        } else {
          p[key] = sineVal;
        }
      }

      // Write for UI display
      displayRef.current = p;

      const totalPixels = (data.length / 4) | 0;
      const pixelsToUpdate = (totalPixels * p.churnRate) | 0;

      for (let n = 0; n < pixelsToUpdate; n++) {
        const px = (Math.random() * totalPixels) | 0;
        const i = px * 4;

        const density = densityMap ? densityMap[px] || 0 : 0;
        const popChance = p.basePop + density * density * p.maxPop;
        const isPop = Math.random() < popChance;

        const v = isPop
          ? 200 + Math.random() * 55
          : Math.random() * 255;

        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = isPop
          ? p.popAlphaMin + Math.random() * (p.popAlphaMax - p.popAlphaMin)
          : p.baseAlpha;
      }

      ctx!.putImageData(imageData, 0, 0);
    }

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, overridesRef, displayRef]);
}

// ─── Page ────────────────────────────────────────────────────

export default function Home() {
  const grainRef = useRef<HTMLCanvasElement>(null);
  const overridesRef = useRef<Overrides>({});
  const displayRef = useRef<GrainParams>(GRAIN.lo);
  const [displayParams, setDisplayParams] = useState<GrainParams>(GRAIN.lo);
  const [activeOverrides, setActiveOverrides] = useState<Record<string, boolean>>({});
  const [elapsed, setElapsed] = useState("00000");
  const [showKnobs, setShowKnobs] = useState(false);
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  useGrain(grainRef, overridesRef, displayRef);

  const statusText = formMessage || "No spam. One email when we launch.";
  const glitchedStatus = useGlitchText(statusText);

  const handleSubscribe = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    // Basic client-side check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setFormStatus("error");
      setFormMessage("Please enter a valid email address.");
      return;
    }

    setFormStatus("loading");
    setFormMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();

      if (res.ok) {
        setFormStatus("success");
        setFormMessage(data.message);
        setEmail("");
      } else if (res.status === 409) {
        setFormStatus("duplicate");
        setFormMessage(data.error);
      } else {
        setFormStatus("error");
        setFormMessage(data.error || "Something went wrong.");
      }
    } catch {
      setFormStatus("error");
      setFormMessage("Network error. Please try again.");
    }
  }, [email]);

  // Sync display params, override states, and clock from the grain loop at ~20fps
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
    <div className="scanlines phosphor relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-black px-6">
      {/* Vignette — top & bottom */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-[20vh] bg-linear-to-b from-black/60 to-transparent" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[20vh] bg-linear-to-t from-black/60 to-transparent" />

      {/* Animated grain overlay */}
      <canvas
        ref={grainRef}
        className="pointer-events-none fixed inset-0 z-20 h-full w-full"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Header bar */}
      <header className="terminal-text absolute top-0 left-0 right-0 z-30 flex items-center border-b border-white/[0.06] animate-fade-in-up">
        <div className="border-r border-white/[0.06] px-5 py-3">
          <Logo/>
        </div>
        <span className="ml-auto px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-white/15">
          orthg.nl
        </span>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center text-center gap-6">
        {/* Accent label */}
        <p
          className="terminal-text text-xs uppercase tracking-[0.25em] text-accent animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="text-accent/40 mr-1">&gt;</span>Coming soon
        </p>

        {/* Hero heading */}
        <h1
          className="font-mono text-5xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.02em] leading-none animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          AI needs an
          <br />
          operating system.
        </h1>

        {/* Body */}
        <p
          className="mt-2 max-w-lg terminal-text text-base sm:text-lg text-white/40 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.35s" }}
        >
          We&apos;re building it. Get notified when we launch.
        </p>

        {/* Email capture */}
        <div
          className="group relative z-30 mt-6 w-full max-w-lg animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          <form
            className="relative flex items-center border border-white/[0.06] bg-[rgba(0,0,0,.5)] backdrop-blur-3xl p-2 transition-all duration-300 focus-within:border-accent/20"
            onSubmit={handleSubscribe}
          >
            {/* Corner brackets */}
            <div className="absolute -top-px -left-px w-2.5 h-2.5 border-t border-l border-white/20" />
            <div className="absolute -top-px -right-px w-2.5 h-2.5 border-t border-r border-white/20" />
            <div className="absolute -bottom-px -left-px w-2.5 h-2.5 border-b border-l border-white/20" />
            <div className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b border-r border-white/20" />

            <div className="flex flex-1 items-center gap-3 pl-4">
              <span className="terminal-text text-white/15 text-sm shrink-0">&gt;</span>
              <input
                type="text"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formStatus !== "idle" && formStatus !== "loading") {
                    setFormStatus("idle");
                    setFormMessage("");
                  }
                }}
                disabled={formStatus === "loading"}
                className="terminal-text w-full bg-transparent py-3 text-base text-foreground outline-none placeholder:text-white/20 disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={formStatus === "loading"}
              className="shrink-0 cursor-pointer border border-accent/60 px-6 py-3 font-accent text-xs uppercase tracking-[0.15em] text-accent transition-all duration-200 hover:bg-accent hover:text-white hover:border-accent active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none"
            >
              {formStatus === "loading" ? "Sending..." : "Get early access"}
            </button>
          </form>
          <p className={`terminal-text mt-3 text-[11px] tracking-[0.15em] uppercase ${formStatus === "success" ? "text-green-400/80" : formStatus === "duplicate" ? "text-pink-300/80" : formStatus === "error" ? "text-accent/80" : "text-white/15"}`}>
            {glitchedStatus}
          </p>
        </div>
      </main>

      {/* Footer + tuner dock */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 animate-fade-in-up"
        style={{ animationDelay: "0.65s" }}
      >
        {/* Grain tuner terminal — docked above footer */}
        {showKnobs && (
          <div className="scanlines terminal-text phosphor absolute bottom-full right-0 w-[420px] text-[13px] border border-white/[0.06] border-b-0 bg-black/95 backdrop-blur-xs">
            {/* Corner brackets — top only */}
            <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-white/20" />
            <div className="absolute -top-px -right-px w-3 h-3 border-t border-r border-white/20" />

            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-3">
              <span className="uppercase tracking-[0.25em] text-white/40 text-[11px]">
                <span className="text-white/15 mr-1">&gt;</span>grain.sys
              </span>
              <span className="text-white/20 tabular-nums text-[11px]">
                T+{elapsed}
              </span>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {KNOBS.map(({ key, label, min, max, step }) => {
                const val = displayParams[key];
                const pct = ((val - min) / (max - min)) * 100;
                const isOverridden = activeOverrides[key];
                return (
                  <div key={key} className="py-[6px]">
                    {/* Label + value row */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`uppercase tracking-[0.15em] text-[11px] ${isOverridden ? "text-accent" : "text-white/30"}`}>
                        <span className={`mr-1.5 ${isOverridden ? "text-accent/50" : "text-white/15"}`}>$</span>
                        {label}
                      </span>
                      <span className={`tabular-nums text-[12px] ${isOverridden ? "text-accent" : "text-white/50"}`}>
                        {val.toFixed(step < 0.01 ? 4 : step < 1 ? 2 : 0)}
                      </span>
                    </div>
                    {/* Track */}
                    <div className="relative h-[3px] w-full bg-white/[0.04]">
                      <div
                        className={`absolute inset-y-0 left-0 ${isOverridden ? "bg-accent/60" : "bg-white/[0.12]"}`}
                        style={{ width: `${pct}%` }}
                      />
                      <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={val}
                        onChange={(e) => handleKnob(key, parseFloat(e.target.value))}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}

              {/* Status footer */}
              <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/[0.06]">
                <span className="uppercase tracking-[0.2em] text-[10px] text-white/15">orthg.nl::grain</span>
                <span className="text-white/15 text-[10px] flex items-center gap-1">
                  <span className="cursor-blink">&#9608;</span>
                  <span className="uppercase tracking-[0.2em]">sys.ok</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer bar */}
        <footer className="terminal-text flex items-center border-t border-white/[0.06]">
          <span className="font-brand border-r border-white/[0.06] px-5 py-3 text-sm font-semibold tracking-[-0.05em] text-white/30">
            O°
          </span>
          <a
            href="/investors"
            className="cursor-pointer border-r border-white/[0.06] px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-white/25 transition-colors hover:text-accent"
          >
            Investors
          </a>
          <button
            onClick={() => setShowKnobs((v) => !v)}
            className="cursor-pointer border-r border-white/[0.06] px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-white/25 transition-colors hover:text-accent"
          >
            {showKnobs ? "Hide tuner" : "Tuner"}
          </button>
          <span className="ml-auto px-5 py-3 font-accent text-[11px] font-medium text-white/15">
            Sovereign AI for everyone.
          </span>
        </footer>
      </div>
    </div>
  );
}
