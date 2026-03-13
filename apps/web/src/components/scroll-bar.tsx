"use client";

import { useCallback, useEffect, useRef } from "react";

export function ScrollBar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackBgRef = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const dragging = useRef(false);
  const hovered = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);
  const currentThumbHeight = useRef(0);

  const getScrollRoot = useCallback(() => document.getElementById("scroll-root"), []);

  // Direct DOM update — no React re-render
  function sync() {
    const root = getScrollRoot();
    const thumb = thumbRef.current;
    if (!root || !thumb) return;

    const { scrollTop, scrollHeight, clientHeight } = root;
    if (scrollHeight <= clientHeight) {
      thumb.style.opacity = "0";
      return;
    }

    const ratio = clientHeight / scrollHeight;
    const height = Math.max(ratio * clientHeight, 24);
    const maxTop = clientHeight - height;
    const top = (scrollTop / (scrollHeight - clientHeight)) * maxTop;

    currentThumbHeight.current = height;
    thumb.style.height = `${height}px`;
    thumb.style.transform = `translateY(${top}px)`;
  }

  // RAF-batched sync
  function scheduleSync() {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = 0;
      sync();
    });
  }

  // Show/hide helpers — direct DOM, no state
  function show() {
    const thumb = thumbRef.current;
    if (!thumb) return;
    thumb.style.opacity = "1";
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }

  function hideAfterDelay() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!dragging.current && !hovered.current) {
        thumbRef.current && (thumbRef.current.style.opacity = "0");
      }
    }, 1200);
  }

  function setActive(active: boolean) {
    const thumb = thumbRef.current;
    const bg = trackBgRef.current;
    const track = trackRef.current;
    if (!thumb || !bg || !track) return;
    if (active) {
      thumb.style.width = "6px";
      thumb.style.right = "2px";
      thumb.style.backgroundColor = "rgba(180, 180, 180, 0.55)";
      bg.style.opacity = "1";
      track.style.width = "10px";
      track.style.cursor = "pointer";
    } else {
      thumb.style.width = "4px";
      thumb.style.right = "3px";
      thumb.style.backgroundColor = "rgba(180, 180, 180, 0.4)";
      bg.style.opacity = "0";
      track.style.width = "14px";
      track.style.cursor = "default";
    }
  }

  // Skip entirely on touch devices — let native scrollbar handle it
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      if (trackRef.current) trackRef.current.style.display = "none";
      return;
    }

    const root = getScrollRoot();
    if (!root) return;

    function onScroll() {
      scheduleSync();
      show();
      hideAfterDelay();
    }

    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleSync);
    // Initial sync
    sync();

    return () => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleSync);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [getScrollRoot]);

  // Pointer handlers with capture for off-screen drag
  function onPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    const root = getScrollRoot();
    if (!root) return;

    dragging.current = true;
    dragStartY.current = e.clientY;
    dragStartScroll.current = root.scrollTop;

    // Capture pointer — keeps receiving events even outside the browser window
    thumbRef.current?.setPointerCapture(e.pointerId);
    show();
    setActive(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const root = getScrollRoot();
    if (!root) return;

    const { scrollHeight, clientHeight } = root;
    const maxTop = clientHeight - currentThumbHeight.current;
    if (maxTop <= 0) return;

    const dy = e.clientY - dragStartY.current;
    const scrollDelta = (dy / maxTop) * (scrollHeight - clientHeight);
    root.scrollTop = dragStartScroll.current + scrollDelta;
  }

  function onPointerUp() {
    dragging.current = false;
    if (!hovered.current) {
      setActive(false);
      hideAfterDelay();
    }
  }

  // Track click to jump
  function onTrackClick(e: React.MouseEvent) {
    const root = getScrollRoot();
    if (!root || !trackRef.current) return;
    // Ignore clicks on the thumb itself
    if (thumbRef.current?.contains(e.target as Node)) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickRatio = (e.clientY - rect.top) / rect.height;
    root.scrollTop = clickRatio * (root.scrollHeight - root.clientHeight);
  }

  return (
    <div
      ref={trackRef}
      onClick={onTrackClick}
      onMouseEnter={() => { hovered.current = true; show(); setActive(true); }}
      onMouseLeave={() => { hovered.current = false; if (!dragging.current) { setActive(false); hideAfterDelay(); } }}
      className="fixed top-0 right-0 bottom-0 z-50"
      style={{ width: 14, cursor: "default" }}
    >
      {/* Track background */}
      <div
        ref={trackBgRef}
        className="absolute inset-0 transition-opacity duration-200"
        style={{ opacity: 0, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
      />
      {/* Thumb */}
      <div
        ref={thumbRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onLostPointerCapture={onPointerUp}
        className="absolute top-0 rounded-full"
        style={{
          width: 4,
          right: 3,
          opacity: 0,
          backgroundColor: "rgba(180, 180, 180, 0.4)",
          transition: "opacity 0.3s, width 0.15s, right 0.15s, background-color 0.15s",
          willChange: "transform",
          touchAction: "none",
        }}
      />
    </div>
  );
}
