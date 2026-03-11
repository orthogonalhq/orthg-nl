import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Research", href: "/research" },
  { label: "Investors", href: "/investors" },
];


export function Footer() {
  return (
    <footer className="terminal-text relative z-10 border-t border-white/[0.06] bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06] py-10 md:py-14">
          {/* Navigation */}
          <div className="pb-8 md:pb-0 md:pr-10">
            <span className="text-[10px] uppercase tracking-[0.2em] t-ghost block mb-4">
              &gt; navigate
            </span>
            <div className="space-y-2">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-[12px] uppercase tracking-[0.15em] t-nav transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="py-8 md:py-0 md:px-10">
            <span className="text-[10px] uppercase tracking-[0.2em] t-ghost block mb-4">
              &gt; connect
            </span>
            <p className="text-[12px] t-ghost">
              <span className="terminal-prefix">$</span>
            </p>
          </div>

          {/* About */}
          <div className="pt-8 md:pt-0 md:pl-10">
            <span className="text-[10px] uppercase tracking-[0.2em] t-ghost block mb-4">
              &gt; orthogonal
            </span>
            <p className="text-[12px] t-card-desc leading-relaxed">
              Sovereign AI for everyone.
            </p>
            <p className="text-[12px] t-card-desc leading-relaxed mt-2">
              Building Nous, an open source AI operating system.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] py-4 flex items-center justify-between">
          <span className="text-[10px] t-ghost">
            &copy; {new Date().getFullYear()} Orthogonal
          </span>
          <span className="text-[10px] t-ghost flex items-center gap-1">
            <span className="cursor-blink">&#9608;</span>
            <span className="uppercase tracking-[0.2em]">sys.ok</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
