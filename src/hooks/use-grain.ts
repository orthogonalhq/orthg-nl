"use client";

import { useEffect } from "react";

export interface GrainParams {
  churnRate: number;
  basePop: number;
  maxPop: number;
  popAlphaMin: number;
  popAlphaMax: number;
  baseAlpha: number;
}

export const GRAIN = {
  lo: {
    churnRate: 0.13,
    basePop: 0.0,
    maxPop: 0.3,
    popAlphaMin: 20,
    popAlphaMax: 40,
    baseAlpha: 5,
  } as GrainParams,

  hi: {
    churnRate: 0.33,
    basePop: 0.0,
    maxPop: 0.3,
    popAlphaMin: 35,
    popAlphaMax: 50,
    baseAlpha: 6,
  } as GrainParams,

  breathMs: 120000,
  scale: 1,
  densityMaps: [
    { src: "/density-map-16x9.png", ar: 4,      scale: 1.25, offsetY: -0.08, offsetX: 0.22, zone3: null },
    { src: "/density-map-16x9.png", ar: 16 / 9, scale: 1.5, offsetY: -0.10, zone3: { scale: 1.25, offsetX: 0.10, offsetY: 0.075 } },
    { src: "/density-map-1x1.png",  ar: 1,      scale: 1,   offsetY: 0,     zone3: null },
    { src: "/density-map-9x16.png", ar: 9 / 16, scale: 1,   offsetY: 0,     zone3: { scale: 1.75, offsetX: 0, offsetY: 0, anchor: "br" as const } },
  ],
  densityMapFallback: "/density-map.png",
  overrideHoldMs: 1000,
  releaseEaseMs: 15000,
};

export const GRAIN_KEYS: (keyof GrainParams)[] = [
  "churnRate", "basePop", "maxPop", "popAlphaMin", "popAlphaMax", "baseAlpha",
];

export const KNOBS: { key: keyof GrainParams; label: string; min: number; max: number; step: number }[] = [
  { key: "churnRate",   label: "Churn",     min: 0.01, max: 1,    step: 0.01   },
  { key: "basePop",     label: "Base Pop",   min: 0,    max: 0.05, step: 0.0005 },
  { key: "maxPop",      label: "Max Pop",    min: 0.001,max: 0.3,  step: 0.001  },
  { key: "popAlphaMin", label: "Pop α Min",  min: 1,    max: 60,   step: 1      },
  { key: "popAlphaMax", label: "Pop α Max",  min: 1,    max: 80,   step: 1      },
  { key: "baseAlpha",   label: "Base α",     min: 0,    max: 10,   step: 0.5    },
];

export type Overrides = Record<string, { value: number; expires: number; _releaseVal?: number; _releaseTime?: number }>;

export interface Bubble {
  x: number;  // canvas-space x
  y: number;  // canvas-space y
  time: number; // Date.now() when created
  tendrils: number[]; // angles in radians
  seed: number; // for deterministic fractal variation
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function useGrain(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  overridesRef: React.RefObject<Overrides>,
  displayRef: React.RefObject<GrainParams>,
  scrollAttenuationRef?: React.RefObject<number>,
  densityScaleRef?: React.RefObject<number>,
  bubblesRef?: React.RefObject<Bubble[]>,
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

    let currentDensityScale = densityScaleRef?.current ?? 1;

    function resize() {
      w = Math.ceil(window.innerWidth * GRAIN.scale);
      h = Math.ceil(window.innerHeight * GRAIN.scale);
      canvas!.width = w;
      canvas!.height = h;
      imageData = ctx!.createImageData(w, h);
      data = imageData.data;
      densityMap = new Float32Array(w * h);
      loadDensitySource();
      buildDensityMap();
    }

    const densityImg = new Image();
    let densityLoaded = false;
    let currentSrc = "";

    let currentEntryScale = 1;
    let currentEntryOffsetX = 0;
    let currentEntryOffsetY = 0;
    let currentEntryAr = 0;
    let currentZone3: { scale: number; offsetX: number; offsetY: number; anchor?: "br" } | null = null;

    function pickDensityEntry() {
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
      return best;
    }

    function loadDensitySource() {
      const entry = pickDensityEntry();
      if (entry.ar === currentEntryAr) return;
      currentEntryAr = entry.ar;
      currentSrc = entry.src;
      currentEntryScale = entry.scale;
      currentEntryOffsetX = entry.offsetX ?? 0;
      currentEntryOffsetY = entry.offsetY;
      currentZone3 = entry.zone3;
      densityLoaded = false;
      densityImg.src = entry.src;
    }

    function buildDensityMap() {
      if (!densityLoaded || w === 0) return;

      const offscreen = document.createElement("canvas");
      offscreen.width = w;
      offscreen.height = h;
      const offCtx = offscreen.getContext("2d")!;

      const ds = currentDensityScale * currentEntryScale;
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

      // Apply density scale: scale from center
      const inZone3 = currentDensityScale < 1;
      const z3 = inZone3 && currentZone3 ? currentZone3 : null;
      drawW *= ds * (z3 ? z3.scale : 1);
      drawH *= ds * (z3 ? z3.scale : 1);
      if (z3?.anchor === "br") {
        drawX = w - drawW + w * z3.offsetX;
        drawY = h - drawH + h * z3.offsetY;
      } else {
        drawX = (w - drawW) / 2 + w * (z3 ? z3.offsetX : currentEntryOffsetX);
        drawY = (h - drawH) / 2 + h * (z3 ? z3.offsetY : currentEntryOffsetY);
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

      // Rebuild density map when densityScaleRef changes
      const newDensityScale = densityScaleRef?.current ?? 1;
      if (newDensityScale !== currentDensityScale) {
        currentDensityScale = newDensityScale;
        buildDensityMap();
      }

      const now = Date.now();
      const t = (Math.sin((time / GRAIN.breathMs) * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      const overrides = overridesRef.current;

      const p = {} as GrainParams;
      for (const key of GRAIN_KEYS) {
        const ov = overrides[key];
        const sineVal = lerp(GRAIN.lo[key], GRAIN.hi[key], t);

        if (ov && now < ov.expires) {
          p[key] = ov.value;
          ov._releaseVal = ov.value;
          ov._releaseTime = ov.expires;
        } else if (ov && ov._releaseTime && now < ov._releaseTime + GRAIN.releaseEaseMs) {
          const elapsed = now - ov._releaseTime;
          const easeT = Math.min(elapsed / GRAIN.releaseEaseMs, 1);
          const smooth = 1 - (1 - easeT) * (1 - easeT);
          p[key] = lerp(ov._releaseVal!, sineVal, smooth);
        } else {
          p[key] = sineVal;
        }
      }

      // Scroll attenuation: scale pop alphas and base alpha by scroll position
      if (scrollAttenuationRef?.current !== undefined) {
        const att = scrollAttenuationRef.current;
        p.popAlphaMin = p.popAlphaMin * att;
        p.popAlphaMax = p.popAlphaMax * att;
        p.baseAlpha *= Math.sqrt(att);
      }

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

      // Fractal neural tendrils: suppress pops in organic branching patterns
      if (bubblesRef?.current) {
        const bubbles = bubblesRef.current;
        const maxAge = 400;
        const baseRadius = Math.max(w, h) * 0.12;
        const tendrilReach = baseRadius * 1.8; // tendrils extend further
        const tendrilWidth = 0.35; // angular width in radians

        for (let b = bubbles.length - 1; b >= 0; b--) {
          const bubble = bubbles[b];
          const age = now - bubble.time;
          if (age > maxAge + 300) {
            bubbles.splice(b, 1);
            continue;
          }

          const expandT = Math.min(age / maxAge, 1);
          const fadeOut = age > maxAge ? 1 - (age - maxAge) / 300 : 1;
          const seed = bubble.seed;

          const bx = bubble.x;
          const by = bubble.y;
          const maxR = Math.ceil(tendrilReach * expandT);
          const x0 = Math.max(0, Math.floor(bx - maxR));
          const x1 = Math.min(w - 1, Math.ceil(bx + maxR));
          const y0 = Math.max(0, Math.floor(by - maxR));
          const y1 = Math.min(h - 1, Math.ceil(by + maxR));

          for (let y = y0; y <= y1; y++) {
            for (let x = x0; x <= x1; x++) {
              const dx = x - bx;
              const dy = y - by;
              const dist = Math.sqrt(dx * dx + dy * dy);

              const angle = Math.atan2(dy, dx);

              // Fractal edge distortion on base shape
              const fractal =
                0.25 * Math.sin(angle * 3 + seed) +
                0.15 * Math.sin(angle * 7 + seed * 1.7) +
                0.1 * Math.sin(angle * 13 + seed * 2.3) +
                0.08 * Math.sin(angle * 23 + seed * 3.1);
              const coreRadius = baseRadius * expandT * (0.5 + 0.5 * (0.5 + fractal));

              // Tendril extensions
              let tendrilStrength = 0;
              for (const tAngle of bubble.tendrils) {
                let angleDiff = Math.abs(angle - tAngle);
                if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
                if (angleDiff < tendrilWidth) {
                  const proximity = 1 - angleDiff / tendrilWidth;
                  const tRadius = tendrilReach * expandT * proximity;
                  if (dist < tRadius) {
                    // Taper along length
                    const along = dist / tRadius;
                    tendrilStrength = Math.max(tendrilStrength, (1 - along * along) * proximity);
                  }
                }
              }

              // Combined: inside core or on a tendril
              let suppression = 0;
              if (dist < coreRadius) {
                const edge = 1 - dist / coreRadius;
                suppression = Math.min(edge * 3, 1); // sharp edge
              }
              suppression = Math.max(suppression, tendrilStrength);

              if (suppression <= 0) continue;
              suppression *= fadeOut;

              const idx = (y * w + x) * 4;
              const alpha = data[idx + 3];
              if (alpha <= p.baseAlpha + 1) continue;

              data[idx + 3] = lerp(alpha, p.baseAlpha, suppression);
            }
          }
        }
      }

      ctx!.putImageData(imageData, 0, 0);
    }

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, overridesRef, displayRef]);
}
