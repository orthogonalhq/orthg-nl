"use client";

import { useEffect, useState } from "react";
import { GlitchLogo } from "./glitch-logo";
import { MobileMenu } from "./mobile-menu";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Download", href: "/download" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Research", href: "/research" },
  { label: "Investors", href: "/investors" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const root = document.getElementById("scroll-root");
    if (!root) return;

    function onScroll() {
      setScrolled(root!.scrollTop > 10);
    }

    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`terminal-text fixed top-0 left-0 right-0 z-40 flex items-center border-b transition-[background-color,border-color] duration-300 ${
        scrolled
          ? "border-white/10 bg-[#0a0a0a]"
          : "border-white/6 bg-transparent"
      }`}
    >
      <div className="overflow-hidden border-r border-white/6 px-5 py-3">
        <Link href="/">
          <GlitchLogo />
        </Link>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center ml-auto">
        {NAV_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-5 py-3 text-[11px] uppercase tracking-[0.2em] t-nav transition-colors hover:text-accent"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile hamburger */}
      <MobileMenu links={NAV_LINKS} />
    </header>
  );
}
