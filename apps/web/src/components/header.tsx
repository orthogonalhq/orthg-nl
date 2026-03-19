"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GlitchLogo } from "./glitch-logo";
import { MobileMenu } from "./mobile-menu";
import Link from "next/link";
import { NAV_ITEMS, type MegaMenu, type NavLink } from "@/lib/nav";
import { NavIcon } from "./nav-icon";

/* ------------------------------------------------------------------ */
/*  External-link arrow icon                                          */
/* ------------------------------------------------------------------ */
function ExternalIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      className={`opacity-40 ${className}`}
    >
      <path
        d="M1 8L8 1M8 1H3M8 1V6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Mega-menu link (title + description)                              */
/* ------------------------------------------------------------------ */
function MegaLink({ item, onClick }: { item: NavLink; onClick: () => void }) {
  const inner = (
    <>
      <span className="flex items-center gap-2">
        <NavIcon name={item.icon} size={14} className="t-ghost" />
        <span className="font-mono text-[13px] font-semibold t-card-title">
          {item.label}
        </span>
        {item.external && <ExternalIcon />}
      </span>
      {item.description && (
        <span className="text-[11px] t-ghost leading-snug mt-1 block">
          {item.description}
        </span>
      )}
    </>
  );

  const cls =
    "block px-5 py-3 transition-colors hover:bg-white/[0.03] rounded";

  return item.external ? (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
      onClick={onClick}
    >
      {inner}
    </a>
  ) : (
    <Link href={item.href} className={cls} onClick={onClick}>
      {inner}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                            */
/* ------------------------------------------------------------------ */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [headerHovered, setHeaderHovered] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const headerRef = useRef<HTMLElement>(null);

  /* scroll detection */
  useEffect(() => {
    const root = document.getElementById("scroll-root");

    function onScroll() {
      const top = (root?.scrollTop ?? 0) || window.scrollY;
      setScrolled(top > 10);
    }

    root?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root?.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* close on outside click */
  useEffect(() => {
    if (!activeMenu) return;

    function onClick(e: MouseEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(e.target as Node)
      ) {
        setActiveMenu(null);
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [activeMenu]);

  /* close on Escape */
  useEffect(() => {
    if (!activeMenu) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveMenu(null);
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeMenu]);

  const scheduleClose = useCallback(() => {
    closeTimeout.current = setTimeout(() => setActiveMenu(null), 200);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
  }, []);

  function openMenu(label: string) {
    cancelClose();
    setActiveMenu((prev) => (prev === label ? null : label));
  }

  /* find the active mega menu data */
  const activeMega =
    activeMenu != null
      ? (NAV_ITEMS.find(
          (item) => item.type === "mega" && item.label === activeMenu
        ) as (MegaMenu & { type: "mega" }) | undefined)
      : undefined;

  return (
    <header
      ref={headerRef}
      className={`terminal-text fixed top-0 left-0 right-0 z-40 transition-[background-color,border-color] duration-300 ${
        scrolled || activeMenu || headerHovered
          ? "border-white/10 bg-[#0a0a0a]"
          : "border-white/6 bg-transparent"
      }`}
      onMouseLeave={() => {
        setHeaderHovered(false);
      }}
      onMouseEnter={() => {
        setHeaderHovered(true);
      }}
    >
      {/* Top bar */}
      <div className="flex items-center border-b border-white/6">
        <div className="overflow-hidden border-r border-white/6 px-5 py-3">
          <Link href="/" onClick={() => setActiveMenu(null)}>
            <GlitchLogo />
          </Link>
        </div>

        {/* Desktop nav triggers */}
        <nav
          className="hidden md:flex items-center ml-auto pr-5"
          onMouseLeave={scheduleClose}
          onMouseEnter={cancelClose}
        >
          {NAV_ITEMS.map((item) =>
            item.type === "mega" ? (
              <button
                key={item.label}
                className={`flex items-center gap-1.5 px-5 py-3 text-[11px] uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer rounded ${
                  activeMenu === item.label
                    ? "text-white bg-white/2"
                    : "t-nav hover:text-white hover:bg-white/2"
                }`}
                onClick={() => openMenu(item.label)}
                onMouseEnter={() => {
                  cancelClose();
                  setActiveMenu(item.label);
                }}
                aria-expanded={activeMenu === item.label}
              >
                {item.label}
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  className={`transition-transform duration-200 ${
                    activeMenu === item.label ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M1.5 3L4 5.5L6.5 3"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="px-5 py-3 text-[11px] uppercase tracking-[0.2em] t-nav transition-colors hover:text-accent"
                onClick={() => setActiveMenu(null)}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Mobile hamburger */}
        <MobileMenu />
      </div>

      {/* Mega-menu panel */}
      <div
        className={`hidden md:block overflow-hidden transition-all duration-250 ease-out ${
          activeMega
            ? "max-h-64 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        {activeMega && (
          <div className="border-b border-white/6 bg-[#0a0a0a]">
            <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-20 py-6">
              <span className="text-[10px] uppercase tracking-[0.2em] t-ghost block mb-4">
                &gt; {activeMega.label.toLowerCase()}
              </span>

              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(activeMega.items.length, 3)}, 1fr)`,
                }}
              >
                {activeMega.items.map((link) => (
                  <MegaLink
                    key={link.href}
                    item={link}
                    onClick={() => setActiveMenu(null)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
