import { GlitchLogo } from "./glitch-logo";
import { MobileMenu } from "./mobile-menu";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Research", href: "/research" },
  { label: "Investors", href: "/investors" },
];

export function Header() {
  return (
    <header className="terminal-text absolute top-0 left-0 right-0 z-40 flex items-center border-b border-white/[0.06]">
      <div className="overflow-hidden border-r border-white/6 px-5 py-3">
        <a href="/">
          <GlitchLogo />
        </a>
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
