"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { GlitchLogo } from "./glitch-logo";

interface MobileMenuProps {
  links: { label: string; href: string }[];
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Two-phase open/close for animation
  function handleOpen() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
    // Next frame: trigger enter animation
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }

  function handleClose() {
    setVisible(false);
    // Wait for exit animation before unmounting
    timeoutRef.current = setTimeout(() => setOpen(false), 300);
  }

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Cleanup timeout on unmount
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  const allLinks = [{ label: "Home", href: "/" }, ...links];

  return (
    <>
      {/* Toggle button — sits in header flow */}
      <button
        onClick={() => (open ? handleClose() : handleOpen())}
        className="md:hidden ml-auto cursor-pointer px-5 py-3 text-[11px] uppercase tracking-[0.2em] t-nav transition-colors hover:text-accent"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? "Close" : "Menu"}
      </button>

      {/* Full-screen overlay — portaled to body to escape stacking contexts */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-[60] flex flex-col transition-opacity duration-300 ease-out"
          style={{
            backgroundColor: "#0a0a0a",
            opacity: visible ? 1 : 0,
          }}
        >
          {/* Top bar — logo left, close right (mirrors header) */}
          <div className="flex items-center border-b border-white/[0.06] shrink-0">
            <div className="px-5 py-3 border-r border-white/[0.06]">
              <Link href="/" onClick={handleClose}>
                <GlitchLogo />
              </Link>
            </div>
            <button
              onClick={handleClose}
              className="terminal-text cursor-pointer ml-auto px-5 py-3 text-[11px] uppercase tracking-[0.2em] t-nav transition-colors hover:text-accent"
              aria-label="Close menu"
            >
              Close
            </button>
          </div>

          {/* Nav links — left-aligned, IBM Plex Mono */}
          <nav className="flex flex-col gap-3 px-6 pt-10">
            {allLinks.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClose}
                className="font-mono text-3xl font-semibold tracking-[-0.02em] text-white/80 transition-all duration-300 hover:text-accent"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                  transitionDelay: `${80 + i * 50}ms`,
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>,
        document.body
      )}
    </>
  );
}
