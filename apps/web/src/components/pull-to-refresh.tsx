"use client";

import { useEffect, useRef } from "react";

const THRESHOLD = 80; // px of overscroll needed to trigger refresh
const MAX_PULL = 120; // max visual pull distance
const RESISTANCE = 0.4; // damping factor for pull distance

export function PullToRefresh() {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const pulling = useRef(false);
  const pullDistance = useRef(0);

  useEffect(() => {
    const root = document.getElementById("scroll-root");
    if (!root) return;

    function onTouchStart(e: TouchEvent) {
      // Only activate when scrolled to top
      if (root!.scrollTop > 0) return;
      startY.current = e.touches[0].clientY;
      pulling.current = true;
      pullDistance.current = 0;
    }

    function onTouchMove(e: TouchEvent) {
      if (!pulling.current) return;
      const dy = e.touches[0].clientY - startY.current;

      // Only pull down, not up
      if (dy <= 0) {
        updateIndicator(0, false);
        return;
      }

      // Apply resistance
      const distance = Math.min(dy * RESISTANCE, MAX_PULL);
      pullDistance.current = distance;
      updateIndicator(distance, distance >= THRESHOLD);
    }

    function onTouchEnd() {
      if (!pulling.current) return;
      pulling.current = false;

      if (pullDistance.current >= THRESHOLD) {
        // Show refreshing state briefly, then reload
        updateIndicator(THRESHOLD * 0.6, true);
        setTimeout(() => location.reload(), 200);
      } else {
        // Snap back
        updateIndicator(0, false);
      }
    }

    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: true });
    root.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  function updateIndicator(distance: number, ready: boolean) {
    const el = indicatorRef.current;
    if (!el) return;
    const progress = Math.min(distance / THRESHOLD, 1);
    el.style.transform = `translateY(${distance - 40}px)`;
    el.style.opacity = `${progress}`;
    // Spin the arrow when ready
    const arrow = el.firstElementChild as HTMLElement | null;
    if (arrow) {
      arrow.style.transform = ready ? "rotate(180deg)" : "rotate(0deg)";
    }
  }

  return (
    <div
      ref={indicatorRef}
      className="fixed left-1/2 z-50 flex items-center justify-center"
      style={{
        top: 0,
        marginLeft: -16,
        width: 32,
        height: 32,
        opacity: 0,
        transform: "translateY(-40px)",
        transition: "transform 0.25s ease-out, opacity 0.25s ease-out",
        pointerEvents: "none",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        style={{ transition: "transform 0.2s ease-out" }}
      >
        <path
          d="M12 4L12 20M12 4L6 10M12 4L18 10"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
