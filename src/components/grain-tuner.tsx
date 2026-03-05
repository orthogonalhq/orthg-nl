"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { KNOBS } from "@/hooks/use-grain";
import { useGrainContext } from "./grain-overlay";

export function GrainTuner() {
  const { displayParams, activeOverrides, elapsed, handleKnob, showTuner, setShowTuner } = useGrainContext();
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
        <span className="uppercase tracking-[0.25em] text-white/55 text-[11px]">
          <span className="text-white/15 mr-1">&gt;</span>grain.sys
        </span>
        <span className="text-white/30 tabular-nums text-[11px]">
          T+{elapsed}
        </span>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        {KNOBS.map(({ key, label, min, max, step }) => {
          const val = displayParams[key];
          const pct = Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
          const isOverridden = activeOverrides[key];
          return (
            <div key={key} className="py-[6px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`uppercase tracking-[0.15em] text-[11px] ${isOverridden ? "text-accent" : "text-white/45"}`}>
                  <span className={`mr-1.5 ${isOverridden ? "text-accent/50" : "text-white/15"}`}>$</span>
                  {label}
                </span>
                <span className={`tabular-nums text-[12px] ${isOverridden ? "text-accent" : "text-white/50"}`}>
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
          <span className="uppercase tracking-[0.2em] text-[10px] text-white/15">orthg.nl::grain</span>
          <span className="text-white/15 text-[10px] flex items-center gap-1">
            <span className="cursor-blink">&#9608;</span>
            <span className="uppercase tracking-[0.2em]">sys.ok</span>
          </span>
        </div>
      </div>
    </div>
  );
}
