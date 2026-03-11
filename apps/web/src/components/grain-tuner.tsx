"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { KNOBS } from "@/hooks/use-grain";
import { useGrainContext } from "./grain-overlay";

export function GrainTuner() {
  const { displayParams, activeOverrides, elapsed, handleKnob, showTuner, setShowTuner, pixelZoom, pixelZoomOverride, setPixelZoomOverride, densityZoom, densityZoomOverride, setDensityZoomOverride } = useGrainContext();
  const panelRef = useRef<HTMLDivElement>(null);
  const savedOffset = useRef({ x: 0, y: 0 });
  const liveOffset = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Restore saved position when tuner opens, reset if off-screen
  useEffect(() => {
    if (!showTuner) return;
    const pos = savedOffset.current;
    liveOffset.current = pos;
    setOffset(pos);
    requestAnimationFrame(() => {
      const el = panelRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const oob =
        rect.right < 40 ||
        rect.left > window.innerWidth - 40 ||
        rect.bottom < 40 ||
        rect.top > window.innerHeight - 40;
      if (oob) {
        savedOffset.current = { x: 0, y: 0 };
        liveOffset.current = { x: 0, y: 0 };
        setOffset({ x: 0, y: 0 });
      }
    });
  }, [showTuner]);

  // Drag handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    dragStart.current = { x: e.clientX - liveOffset.current.x, y: e.clientY - liveOffset.current.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const next = { x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y };
    liveOffset.current = next;
    setOffset(next);
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    savedOffset.current = { ...liveOffset.current };
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!showTuner) return;
    function onDown(e: PointerEvent) {
      const target = e.target as HTMLElement;
      if (panelRef.current?.contains(target)) return;
      if (target.closest("[data-tuner-toggle]")) return;
      setShowTuner(false);
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [showTuner, setShowTuner]);

  if (!showTuner) return null;

  return (
    <div
      ref={panelRef}
      className="scanlines terminal-text phosphor absolute bottom-full right-0 w-[420px] text-[13px] border border-white/[0.06] border-b-0 bg-black/95 backdrop-blur-xs select-none"
      style={(offset.x || offset.y) ? { transform: `translate(${Math.round(offset.x)}px, ${Math.round(offset.y)}px)` } : undefined}
    >
      {/* Corner brackets — top only */}
      <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-white/20" />
      <div className="absolute -top-px -right-px w-3 h-3 border-t border-r border-white/20" />

      {/* Title bar — draggable */}
      <div
        className={`flex items-center justify-between border-b border-white/[0.06] px-6 py-3 ${dragging.current ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <span className="uppercase tracking-[0.25em] t-body text-[11px]">
          <span className="t-ghost mr-1">&gt;</span>grain.sys
        </span>
        <span className="t-meta tabular-nums text-[11px]">
          T+{elapsed}
        </span>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        {/* Zoom controls */}
        {(
          [
            { label: "Pixel Zoom", value: pixelZoom, override: pixelZoomOverride, set: setPixelZoomOverride, min: 1, max: 3, step: 0.01 },
            { label: "Density Zoom", value: densityZoom, override: densityZoomOverride, set: setDensityZoomOverride, min: 1, max: 2, step: 0.01 },
          ] as const
        ).map(({ label, value, override, set, min, max, step }) => {
          const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
          const isOverridden = override !== null;
          return (
            <div key={label} className="py-[6px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`uppercase tracking-[0.15em] text-[11px] ${isOverridden ? "text-accent" : "t-panel-label"}`}>
                  <span className={`mr-1.5 ${isOverridden ? "text-accent/50" : "t-ghost"}`}>$</span>
                  {label}
                </span>
                <span className="flex items-center gap-2">
                  {isOverridden && (
                    <button
                      onClick={() => set(null)}
                      className="uppercase tracking-[0.15em] text-[9px] text-accent/50 hover:text-accent transition-colors"
                    >
                      manual
                    </button>
                  )}
                  {!isOverridden && (
                    <span className="uppercase tracking-widest text-[9px] t-ghost">scroll</span>
                  )}
                  <span className={`tabular-nums text-[12px] ${isOverridden ? "text-accent" : "t-card-desc"}`}>
                    {value.toFixed(2)}
                  </span>
                </span>
              </div>
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
                  value={value}
                  onChange={(e) => set(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          );
        })}

        {/* Divider */}
        <div className="border-t border-white/6 my-3" />

        {KNOBS.map(({ key, label, min, max, step }) => {
          const val = displayParams[key];
          const pct = Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
          const isOverridden = activeOverrides[key];
          return (
            <div key={key} className="py-[6px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`uppercase tracking-[0.15em] text-[11px] ${isOverridden ? "text-accent" : "t-panel-label"}`}>
                  <span className={`mr-1.5 ${isOverridden ? "text-accent/50" : "t-ghost"}`}>$</span>
                  {label}
                </span>
                <span className={`tabular-nums text-[12px] ${isOverridden ? "text-accent" : "t-card-desc"}`}>
                  {val.toFixed(step < 0.01 ? 4 : step < 1 ? 2 : 0)}
                </span>
              </div>
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
          <span className="uppercase tracking-[0.2em] text-[10px] t-ghost">orthg.nl::grain</span>
          <span className="t-ghost text-[10px] flex items-center gap-1">
            <span className="cursor-blink">&#9608;</span>
            <span className="uppercase tracking-[0.2em]">sys.ok</span>
          </span>
        </div>
      </div>
    </div>
  );
}
