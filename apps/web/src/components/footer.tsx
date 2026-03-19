import Link from "next/link";
import { NAV_ITEMS, type NavLink } from "@/lib/nav";

function FooterLink({ item }: { item: NavLink }) {
  const cls =
    "block text-[12px] uppercase tracking-[0.15em] t-nav transition-colors hover:text-accent";

  return item.external ? (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} inline-flex items-center gap-1.5`}
    >
      {item.label}
      <svg width="8" height="8" viewBox="0 0 9 9" fill="none" className="opacity-40">
        <path d="M1 8L8 1M8 1H3M8 1V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  ) : (
    <Link href={item.href} className={cls}>
      {item.label}
    </Link>
  );
}

function FooterGroup({ label, items }: { label: string; items: NavLink[] }) {
  return (
    <div>
      <span className="text-[10px] uppercase tracking-[0.2em] t-ghost block mb-4">
        &gt; {label.toLowerCase()}
      </span>
      <div className="space-y-2">
        {items.map((link) => (
          <FooterLink key={link.href} item={link} />
        ))}
      </div>
    </div>
  );
}

const megaGroups = NAV_ITEMS.filter(
  (item): item is Extract<typeof item, { type: "mega" }> => item.type === "mega"
);

function findGroup(label: string) {
  return megaGroups.find((g) => g.label === label);
}

export function Footer() {
  const products = findGroup("Products");
  const services = findGroup("Services");
  const blogs = findGroup("Blogs");
  const company = findGroup("Company");

  return (
    <footer className="terminal-text relative z-10 border-t border-white/6 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-white/6 py-10 md:py-14">
          {/* Col 1: Products + Services */}
          <div className="md:px-6 first:md:pl-0 space-y-8">
            {products && <FooterGroup label={products.label} items={products.items} />}
            {services && <FooterGroup label={services.label} items={services.items} />}
          </div>

          {/* Col 2: Blogs + Company */}
          <div className="md:px-6 space-y-8">
            {blogs && <FooterGroup label={blogs.label} items={blogs.items} />}
            {company && <FooterGroup label={company.label} items={company.items} />}
          </div>

          {/* Col 3: Connect */}
          <div className="md:px-6">
            <span className="text-[10px] uppercase tracking-[0.2em] t-ghost block mb-4">
              &gt; connect
            </span>
            <a
              href="mailto:hello@orthg.nl"
              className="block text-[12px] uppercase tracking-[0.15em] t-nav transition-colors hover:text-accent"
            >
              hello@orthg.nl
            </a>
          </div>

          {/* Col 4: Orthogonal */}
          <div className="md:px-6 md:pr-0">
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
        <div className="border-t border-white/6 py-4 flex items-center justify-between">
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
